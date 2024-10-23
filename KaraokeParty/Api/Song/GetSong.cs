using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Song {
	[ApiController]
	public class ApiGetSong : ControllerBase {
		private string VideoStoragePath;

		public ApiGetSong(IConfiguration config) {
			if (config.GetSection("DownloadLocation")?.Value is string downloadLocation) {
				this.VideoStoragePath = downloadLocation;
			} else {
				DirectoryInfo? dir = new DirectoryInfo(Directory.GetCurrentDirectory());
				while (dir != null && dir.Name != "KaraokeParty") {
					dir = dir.Parent;
				}
				this.VideoStoragePath = $"{dir?.Parent?.FullName}/Songs";
			}
		}

		[HttpGet]
		[Route("song/{fileName}")]
		public FileResult GetFile(string fileName) {
			string videoPath = $"{VideoStoragePath}/{fileName}";
			var file = System.IO.File.ReadAllBytes(videoPath);
			return File(file, contentType: "video/mp4", fileDownloadName: fileName, enableRangeProcessing: true);
		}
	}
}
