﻿using Amazon;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using Amazon.S3;
using Amazon.S3.Model;
using KaraokeParty.Helpers;
using Microsoft.Extensions.Caching.Memory;
using System.Net;
using System.Text.Json;

namespace KaraokeParty.Services {
	public class AwsSongService {
		private readonly AmazonLambdaClient lambdaClient;
		private readonly AmazonS3Client s3Client;
		private readonly AppLoggerService logger;
		private readonly IMemoryCache memoryCache;
		private readonly int presignedUrlDurationHours = 24;

		public AwsSongService(IConfiguration config, AppLoggerService logger, IMemoryCache memoryCache) {
			lambdaClient = new AmazonLambdaClient(
				config["AwsAccessKey"] ?? throw new Exception("Missing configuration: AwsAccessKey"),
				config["AwsSecretKey"] ?? throw new Exception("Missing configuration: LambdaApiSecret"),
				RegionEndpoint.GetBySystemName(config["AwsRegion"] ?? throw new Exception("Missing configuration: AwsRegion"))
			);

			s3Client = new AmazonS3Client(
				config["AwsAccessKey"] ?? throw new Exception("Missing configuration: AwsAccessKey"),
				config["AwsSecretKey"] ?? throw new Exception("Missing configuration: AwsSecretKey"),
				RegionEndpoint.GetBySystemName(config["AwsRegion"] ?? throw new Exception("Missing configuration: AwsRegion"))
			);

			this.logger = logger;
			this.memoryCache = memoryCache;
		}

		public async Task<Result<AwsSongResponse>> DownloadSong(string url, CancellationToken cancellationToken) {

			try {
				var response = await lambdaClient.InvokeAsync(new InvokeRequest() {
					FunctionName = "DownloadSongFunction",
					InvocationType = InvocationType.RequestResponse,
					Payload = $"{{\"video_url\": \"{url}\"}}"
				}, cancellationToken);

				if (response.HttpStatusCode != HttpStatusCode.OK) {
					logger.LogWarning($"Failed to download song: {response}");
					return Result.Fail<AwsSongResponse>("Failed to download song");
				}

				StreamReader reader = new StreamReader(response.Payload);
				string textPayload = await reader.ReadToEndAsync(cancellationToken);
				var payload = JsonSerializer.Deserialize<AwsSongResponse>(textPayload);

				if (payload is null) {
					logger.LogWarning($"Failed to parse payload: {textPayload}");
					return Result.Fail<AwsSongResponse>("Failed to parse response");
				}

				if (payload.video_id.Length == 0 || payload.s3_key.Length == 0 || payload.url.Length == 0 || payload.title.Length == 0) {
					logger.LogWarning($"Failed to parse payload: {textPayload}");
					return Result.Fail<AwsSongResponse>("Failed to parse response");
				}

				return Result.Ok(payload);
			} catch (Exception e) {
				logger.LogError($"Exception downloading song: {e}", e);
				return Result.Fail<AwsSongResponse>(e.Message);
			}
		}

		public string GetSongUrl(string s3key) {
			memoryCache.TryGetValue(s3key, out string? url);
			if (!string.IsNullOrWhiteSpace(url)) {
				logger.LogInfo($"Returning pre-signed s3 URL from cache for: {s3key}");
				return url;
			}

			try {
				var request = new GetPreSignedUrlRequest() {
					BucketName = "karaoke-files",
					Key = s3key,
					Expires = DateTime.UtcNow.AddHours(presignedUrlDurationHours),
				};
				var urlString = s3Client.GetPreSignedURL(request);
				if (string.IsNullOrWhiteSpace(urlString)) {
					logger.LogWarning($"AWS failed to generate presigned url for: {s3key}");
				}
				logger.LogInfo($"Caching new pre-signed s3 URL: {s3key}");
				memoryCache.Set(s3key, urlString, TimeSpan.FromHours(presignedUrlDurationHours - 1));
				url = urlString;
			} catch (AmazonS3Exception ex) {
				logger.LogError($"Amazon S3 Error", ex);
			}

			if (string.IsNullOrWhiteSpace(url)) {
				logger.LogWarning($"Returning empty string for presigned url: {s3key}");
			}

			return url ?? "";
		}

		public class AwsSongResponse {
			public string title { get; set; } = "";
			public string s3_key { get; set; } = "";
			public string url { get; set; } = "";
			public string video_id { get; set; } = "";
		}
	}
}
