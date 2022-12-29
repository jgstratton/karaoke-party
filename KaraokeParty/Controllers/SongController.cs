using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class SongController : ControllerBase {

		private readonly KPContext context;

		public SongController() {
			this.context = new KPContext();
		}

		[HttpGet]
		public ActionResult<Song> Get(string fileName) {
			Song? song = context.Songs.Find(fileName);
			if (song is null) {
				return NotFound();
			}
			return song;
		}

		[HttpGet]
		[Route("search")]
		public ActionResult<List<Song>> Search(string searchString) {
			var filteredSongs = context.Songs.ToList();
			foreach(var keyword in searchString.ToUpper().Split()) {
				filteredSongs = filteredSongs.Where(s => s.Title.ToUpper().Contains(keyword)).ToList();
			}
			return filteredSongs;
		}

		[HttpPost]
		public ActionResult<Song> Post(SongDTO songDto) {
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
			return song;
		}
	}
}