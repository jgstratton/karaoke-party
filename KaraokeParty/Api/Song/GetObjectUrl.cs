using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Song {
	[ApiController]
	public class GetObjectUrl : ControllerBase {

		private readonly KPContext context;
		private readonly AwsSongService awsSongService;

		public GetObjectUrl(KPContext context, AwsSongService awsSongService) {
			this.context = context;
			this.awsSongService = awsSongService;
		}

		[HttpGet]
		[Route("song/objecturl/{videoId}")]
		public ActionResult<SongObjectDTO> Get(string videoId) {
			DataStore.Song? song = context.Songs.Where(s => s.VideoId == videoId).FirstOrDefault();

			if (song == null) {
				return NotFound();
			}

			return new SongObjectDTO {
				Id = song.VideoId,
				Title = song.Title,
				Url = song.Url,
				ObjectUrl = !string.IsNullOrEmpty(song.S3Key)
					? awsSongService.GetSongUrl(song.S3Key)
					: Url.Action(nameof(ApiGetSong.GetFile), nameof(ApiGetSong), new { fileName = song.FileName }) ?? ""
			};

		}

	}
}
