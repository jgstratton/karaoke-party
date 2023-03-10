using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Hubs;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("party/{partyKey}/[controller]")]
	public class PlayerController : ControllerBase {
		private readonly IHubContext<PlayerHub> playerHubContext;
		private readonly IPartyService partyService;
		private readonly ILogger<PartyController> _logger;
		private readonly KPContext context;

		public PlayerController(IHubContext<PlayerHub> playerHubContext, IPartyService partyService, ILogger<PartyController> logger, KPContext context) {
			this.playerHubContext = playerHubContext;
			this.partyService = partyService;
			_logger = logger;
			this.context = context;
		}

		[HttpPost]
		[Route("EndPerformance")]
		public ActionResult<bool> EndSong(string partyKey, [FromQuery] int performanceId) {
			Performance? performance = context.Performances
				.Where(p => p.Party != null && p.Party.PartyKey == partyKey && p.PerformanceID == performanceId)
				.FirstOrDefault();
			if (performance == null) {
				return NotFound();
			}
			performance.Status = PerformanceStatus.Completed;
			context.SaveChanges();
			return true;
		}

	}
}
