using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Song {
	[ApiController]
	public class ApiGetSong : ControllerBase {

		private readonly InternalSongService internalSongService;

		public ApiGetSong(InternalSongService internalSongService) {
			this.internalSongService = internalSongService;
		}

		[HttpGet]
		[Route("song/{fileName}")]
		public FileStreamResult GetFile(string fileName)
			=> internalSongService.GetFile(fileName);
	}
}
