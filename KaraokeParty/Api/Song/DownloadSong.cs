using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiSongDownload : ControllerBase {
		private readonly KPContext context;
		private readonly IHttpClientFactory clientFactory;

		public ApiSongDownload(KPContext context, IHttpClientFactory clientFactory) {
			this.context = context;
			this.clientFactory = clientFactory;
		}

		[HttpPost]
		[Route("song/download")]
		public async Task<ActionResult<SongDTO>> Search(SongDTO dto) {
			if (dto.Url.Length == 0) {
				return BadRequest("URL is required to download file");
			}
			if (dto.Title.Length == 0) {
				return BadRequest("Title is required to download file");
			}
			if (dto.FileName.Length > 0) {
				return BadRequest("File is already downloaded");
			}

			var ytClient = clientFactory.CreateClient("yt-dlp");
			var request = new HttpRequestMessage(HttpMethod.Get, $"song/download?url={dto.Url}");
			var response = await ytClient.SendAsync(request);

			if (!response.IsSuccessStatusCode) {
				return BadRequest("Error trying to get song");
			}

			var fileName = await response.Content.ReadAsAsync<string>();
			if (fileName.Length == 0) {
				return BadRequest("Error while trying to get song");
			}
			dto.FileName = fileName;

			Song? song = context.Songs.Find(dto.FileName);
			if (song is null) {
				song = dto.ToDb();
				context.Songs.Add(song);
			} else {
				dto.UpdateDb(song);
			}

			context.SaveChanges();
			return SongDTO.FromDb(song);
		}
	}
}
