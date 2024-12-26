using KaraokeParty.Api.Song;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace KaraokeParty.Services {
	public class InternalSongService {
		private readonly string VideoStoragePath;
		private readonly ILogger<ApiGetSong> logger;

		public InternalSongService(IConfiguration config, ILogger<ApiGetSong> logger) {
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

		/// <summary>
		/// Stream the file from local server storage 
		/// </summary>
		public FileStreamResult GetFile(string fileName) {
			var tik = Environment.TickCount;
			logger.LogInformation($"Stream started: {fileName}");
			string videoPath = $"{VideoStoragePath}/{fileName}";
			//var file = System.IO.File.ReadAllBytes(videoPath);
			Stream str = System.IO.File.OpenRead(videoPath);
			return new MyFileStreamResult(
				str,
				"video/mp4",
				() => logger.LogInformation($"Stream completed in {Environment.TickCount - tik}ms: {fileName}"),
				() => logger.LogInformation($"Stream ABORTED after {Environment.TickCount - tik}ms: {fileName}")
			);
		}

		public class MyFileStreamResult : FileStreamResult {
			private readonly Action onComplete;
			private readonly Action onAbort;

			public MyFileStreamResult(Stream fileStream, string contentType, Action onComplete, Action onAbort) : base(fileStream, contentType) {
				this.onComplete = onComplete;
				this.onAbort = onAbort;
			}

			public MyFileStreamResult(Stream fileStream, MediaTypeHeaderValue contentType, Action onComplete, Action onAbort) : base(fileStream, contentType) {
				this.onComplete = onComplete;
				this.onAbort = onAbort;
			}

			public override async Task ExecuteResultAsync(ActionContext context) {
				context.HttpContext.RequestAborted.Register(() => onAbort());
				await base.ExecuteResultAsync(context);
				onComplete();
			}
		}

		/// <summary>
		/// Check if the file has been downloaded to local server storage
		/// </summary>
		public bool HasFileBeenDownloaded(string fileName) {
			string videoPath = $"{VideoStoragePath}/{fileName}";
			return File.Exists(videoPath);
		}
	}
}
