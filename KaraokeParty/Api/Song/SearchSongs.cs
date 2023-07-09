using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiSongSearch : ControllerBase {
		private readonly KPContext context;
		private readonly IHttpClientFactory clientFactory;

		public ApiSongSearch(KPContext context, IHttpClientFactory clientFactory) {
			this.context = context;
			this.clientFactory = clientFactory;
		}

		[HttpGet]
		[Route("songs")]
		public async Task<ActionResult<List<SongDTO>>> Search([FromQuery] SongSearchRequestDto searchDto) {
			var ytClient = clientFactory.CreateClient("yt-dlp");

			var modifiedSearchString = searchDto.KaraokeFlag ? $"{searchDto.SearchString} karaoke" : searchDto.SearchString;
			var request = new HttpRequestMessage(HttpMethod.Get, $"search?search_string={modifiedSearchString}");

			var response = await ytClient.SendAsync(request);

			if (!response.IsSuccessStatusCode) {
				return BadRequest("Error trying to communicate with yt-dlp service");
			}

			var ytSearchResults = await response.Content.ReadAsAsync<List<SongDTO>>();

			foreach (var song in ytSearchResults) {
				//todo: add id field and use that instead of filename
				song.FileName = context.Songs.Where(s => s.FileName.Contains(song.Id)).Select(s => s.FileName).FirstOrDefault() ?? "";
			}
			return ytSearchResults;
		}

		private class YtDlpSongDto {
			public string Id { get; set; } = "";
			public string Title { get; set; } = "";
			public string Url { get; set; } = "";
		}

		public class SongSearchRequestDto {
			public string SearchString { get; set; } = "";
			public bool KaraokeFlag { get; set; } = false;

		}
	}
}
