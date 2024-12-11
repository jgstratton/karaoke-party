using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Song {
	[ApiController]
	public class ApiGetSong : ControllerBase {
		private string VideoStoragePath;
		private readonly ILogger<ApiGetSong> logger;

		public ApiGetSong(IConfiguration config, ILogger<ApiGetSong> logger) {
			if (config.GetSection("DownloadLocation")?.Value is string downloadLocation) {
				this.VideoStoragePath = downloadLocation;
			} else {
				DirectoryInfo? dir = new DirectoryInfo(Directory.GetCurrentDirectory());
				while (dir != null && dir.Name != "KaraokeParty") {
					dir = dir.Parent;
				}
				this.VideoStoragePath = $"{dir?.Parent?.FullName}/Songs";
			}

			this.logger = logger;
		}

		[HttpGet]
		[Route("song/{fileName}")]
		public FileResult GetFile(string fileName) {
			logger.LogInformation($"Returning binary file {fileName}");
			string videoPath = $"{VideoStoragePath}/{fileName}";
			var file = System.IO.File.ReadAllBytes(videoPath);
			return File(file, contentType: "video/mp4", fileDownloadName: fileName, enableRangeProcessing: true);
		}
	}
}
