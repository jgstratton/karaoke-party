using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Party {
	[ApiController]
	public class ApiGetQueuedPerformances : ControllerBase {
		private readonly KPContext context;

		public ApiGetQueuedPerformances(KPContext context) {
			this.context = context;
		}

		[HttpGet]
		[Route("party/{partyKey}/queued")]
		[HttpGet]
		public ActionResult<List<PerformanceDTO>> Get(string partyKey) {
			return context.Performances
				.Where(p => p.Party != null && p.Singer != null && p.Party.PartyKey == partyKey)
				.OrderBy(a => a.SortOrder)
				.ThenBy(a => a.Singer != null ? a.Singer.RotationNumber : 0)
				.ToList()
				.Where(p => p.Status == PerformanceStatus.Queued)
				.Select(p => PerformanceDTO.FromDb(p))
				.ToList();
		}
	}
}
