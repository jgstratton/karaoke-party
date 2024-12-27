using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Party.Performance {
	[ApiController]
	public class ApiPostPerformance : ControllerBase {
		private readonly IPartyService partyService;
		private readonly KPContext context;


		public ApiPostPerformance(IPartyService partyService, KPContext context) {
			this.partyService = partyService;
			this.context = context;
		}

		[HttpPost]
		[Route("party/{partyKey}/performance")]
		public ActionResult<PerformanceDTO> PostPerformance(string partyKey, [FromBody] PerformanceRequestDTO dto) {
			DataStore.Party? party = partyService.GetPartyByKey(partyKey);
			DataStore.User? user = context.Users.Find(dto.UserId);
			DataStore.Song? song = context.Songs.Find(dto.VideoId);
			DataStore.Singer? singer = context.Singers.Find(dto.SingerId);

			if (party == null) return NotFound("404 - Party not found");
			if (user == null) return NotFound("404 - User not found");
			if (song == null) return NotFound("404 - Song not found");

			DataStore.Performance performance = new DataStore.Performance {
				Party = party,
				User = user,
				Song = song,
				SingerName = dto.SingerName
			};

			if (singer != null) {
				performance.Singer = singer;
				performance.Status = PerformanceStatus.Queued;
				int? lastSongNumber = party.Queue
					.Where(p => p.Singer != null && p.Singer.SingerId == singer.SingerId)
					.Max(p => p.SortOrder);
				performance.SortOrder = lastSongNumber is null ? 1 : lastSongNumber + 1;
			}
			context.Performances.Add(performance);
			context.SaveChanges();

			return PerformanceDTO.FromDb(performance);
		}
	}
}
