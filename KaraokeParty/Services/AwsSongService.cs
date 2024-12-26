using Amazon;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using KaraokeParty.Helpers;
using System.Net;
using System.Text.Json;

namespace KaraokeParty.Services {
	public class AwsSongService {
		private readonly AmazonLambdaClient lambdaClient;
		private readonly ILogger<AwsSongService> logger;

		public AwsSongService(IConfiguration config, ILogger<AwsSongService> logger) {
			lambdaClient = new AmazonLambdaClient(
			config["LambdaApiKey"] ?? throw new Exception("Missing configuration: LambdaApiKey"),
			config["LambdaApiSecret"] ?? throw new Exception("Missing configuration: LambdaApiSecret"),
			RegionEndpoint.GetBySystemName(config["LambdaRegion"] ?? throw new Exception("Missing configuration: LambdaRegion")));
			this.logger = logger;
		}

		public async Task<Result<AwsSongResponse>> DownloadSong(string url, CancellationToken cancellationToken) {

			try {
				var response = await lambdaClient.InvokeAsync(new InvokeRequest() {
					FunctionName = "DownloadSongFunction",
					InvocationType = InvocationType.RequestResponse,
					Payload = $"{{\"video_url\": \"{url}\"}}"
				}, cancellationToken);

				if (response.HttpStatusCode != HttpStatusCode.OK) {
					logger.LogWarning("Failed to download song: {response}", response);
					return Result.Fail<AwsSongResponse>("Failed to download song");
				}

				StreamReader reader = new StreamReader(response.Payload);
				string textPayload = await reader.ReadToEndAsync(cancellationToken);
				var payload = JsonSerializer.Deserialize<AwsSongResponse>(textPayload);

				if (payload is null) {
					logger.LogWarning("Failed to parse payload: {textPayload}", textPayload);
					return Result.Fail<AwsSongResponse>("Failed to parse response");
				}

				if (payload.video_id.Length == 0 || payload.s3_key.Length == 0 || payload.url.Length == 0 || payload.title.Length == 0) {
					logger.LogWarning("Failed to parse payload: {textPayload}", textPayload);
					return Result.Fail<AwsSongResponse>("Failed to parse response");
				}

				return Result.Ok(payload);
			} catch (Exception e) {
				logger.LogWarning("Exception downloading song: {e}", e.Message);
				return Result.Fail<AwsSongResponse>(e.Message);
			}
		}

		public class AwsSongResponse {
			public string title { get; set; } = "";
			public string s3_key { get; set; } = "";
			public string url { get; set; } = "";
			public string video_id { get; set; } = "";
		}
	}
}
