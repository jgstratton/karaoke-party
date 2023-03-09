using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.IO.Pipes;
using System.Net;
using System.Net.Http.Headers;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class SongController : ControllerBase {

		private readonly KPContext context;
		private readonly string VideoStoragePath;

		public SongController(KPContext kpContext, IConfiguration config) {
			if (config.GetSection("DownloadLocation")?.Value is string downloadLocation) {
				this.VideoStoragePath = downloadLocation;
			} else {
				DirectoryInfo? dir = new DirectoryInfo(Directory.GetCurrentDirectory());
				while (dir != null && dir.Name != "KaraokeParty") {
					dir = dir.Parent;
				}
				this.VideoStoragePath = $"{dir?.Parent?.FullName}/Songs";
			}
			this.context = kpContext;
		}

		[HttpGet]
		public ActionResult<Song> Get([FromQuery] string fileName) {
			Song? song = context.Songs.Find(fileName);
			if (song is null) {
				return NotFound();
			}
			return song;
		}

		[HttpGet]
		[Route("search")]
		public ActionResult<List<SongDTO>> Search([FromQuery] string searchString) {
			var filteredSongs = context.Songs.ToList();
			foreach (var keyword in searchString.ToUpper().Split()) {
				filteredSongs = filteredSongs.Where(s => s.Title.ToUpper().Contains(keyword) && s.FileName.Length > 0).ToList();
			}
			return filteredSongs.Select(fs => SongDTO.FromDb(fs)).ToList();
		}

		[HttpPost]
		public ActionResult<SongDTO> Post(SongDTO songDto) {
			if (songDto.FileName is null) {
				return NotFound();
			}
			Song? song = context.Songs.Find(songDto.FileName);
			if (song is null) {
				song = songDto.ToDb();
				context.Songs.Add(song);
			} else {
				songDto.UpdateDb(song);
			}
			context.SaveChanges();
			return SongDTO.FromDb(song);
		}

		[HttpGet]
		[Route("download/{fileName}")]
		public ActionResult DownloadVideoToPlayer(string fileName) {
			string videoPath = $"{VideoStoragePath}/{fileName}";
			return File(System.IO.File.ReadAllBytes(videoPath), "application/octet-stream");
		}

		[HttpGet]
		[Route("{fileName}")]
		public IActionResult GetFile(string fileName) {
			string videoPath = $"{VideoStoragePath}/{fileName}";
			var file = System.IO.File.ReadAllBytes(videoPath);
			return File(file, contentType: "video/mp4", fileDownloadName: fileName, enableRangeProcessing: true);
		}
	}
}