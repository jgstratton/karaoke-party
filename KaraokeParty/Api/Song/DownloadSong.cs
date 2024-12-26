using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Song {
	[ApiController]
	public class ApiSongDownload : ControllerBase {
		private readonly ILogger<ApiSongDownload> logger;
		private readonly KPContext context;
		private readonly IHttpClientFactory clientFactory;
		private readonly AwsSongService awsSongService;
		private readonly InternalSongService internalSongService;

		public ApiSongDownload(ILogger<ApiSongDownload> logger, KPContext context, IHttpClientFactory clientFactory, AwsSongService awsSongService, InternalSongService internalSongService) {
			this.logger = logger;
			this.context = context;
			this.clientFactory = clientFactory;
			this.awsSongService = awsSongService;
			this.internalSongService = internalSongService;
		}

		[HttpPost]
		[Route("song/download")]
		public async Task<ActionResult<SongDTO>> Download(SongDTO dto, CancellationToken cancellationToken) {
			if (dto.Url.Length == 0) {
				return BadRequest("URL is required to download file");
			}

			// try to downlaod the song using cloud services
			var cloudDownload = await _downloadSongFromCloud(dto.Url, cancellationToken);
			if (cloudDownload.success) {
				return cloudDownload.dto!;
			}

			// if cloud services aren't available, check if we already have the song downloaded locally (no need to download it multiple times)
			if (dto.FileName.Length > 0 && internalSongService.HasFileBeenDownloaded(dto.FileName)) {
				return dto;
			}

			// ok, song hasn't been downloaded yet, let's download it
			var ytClient = clientFactory.CreateClient("yt-dlp");
			var request = new HttpRequestMessage(HttpMethod.Get, $"download?url={dto.Url}");
			var response = await ytClient.SendAsync(request);

			if (!response.IsSuccessStatusCode) {
				logger.LogError("Error downloading song: {response}", response);
				return BadRequest("Error trying to get song");
			}

			var fileName = await response.Content.ReadAsAsync<DownloadResult>();
			if (fileName.status != "success" || fileName.file.Length == 0) {
				return BadRequest("Error while trying to get song");
			}
			dto.FileName = fileName.file;

			DataStore.Song? song = context.Songs.Find(dto.FileName);
			if (song is null) {
				song = dto.ToDb();
				context.Songs.Add(song);
			} else {
				dto.UpdateDb(song);
			}

			context.SaveChanges();
			return SongDTO.FromDb(song);
		}

		private async Task<(bool success, SongDTO? dto)> _downloadSongFromCloud(string url, CancellationToken cancellationToken) {
			// try to download song from the cloud if possible
			var cloudResponse = await awsSongService.DownloadSong(url, cancellationToken);
			if (cloudResponse.Success) {
				var payload = cloudResponse.Value;
				// we can technically match any of these fields to find the record in the database
				DataStore.Song? song = context.Songs.Where(s =>
					s.VideoId == payload.video_id ||
					s.Url == url ||
					s.S3Key == payload.s3_key ||
					s.FileName == Path.GetFileName(payload.s3_key)
				).FirstOrDefault();

				if (song is null) {
					song = new DataStore.Song {
						FileName = Path.GetFileName(payload.s3_key),
						VideoId = payload.video_id,
						S3Key = payload.s3_key,
						Title = payload.title,
						Url = url
					};
					context.Songs.Add(song);
				} else {
					song.FileName = Path.GetFileName(payload.s3_key);
					song.Title = payload.title;
					song.Url = url;
					song.VideoId = payload.video_id;
					song.S3Key = payload.s3_key;
				}
				context.SaveChanges();
				return (true, SongDTO.FromDb(song));
			}
			return (false, null);
		}

		private class DownloadResult {
			public string status { get; set; } = "";
			public string file { get; set; } = "";
		}
	}
}
