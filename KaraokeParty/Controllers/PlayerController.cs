using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("party/{partyKey}/[controller]")]
	public class PlayerController : ControllerBase {
		private readonly IPartyService partyService;
		private readonly ILogger<PartyController> _logger;
		private readonly KPContext context;

		public PlayerController(IPartyService partyService, ILogger<PartyController> logger, KPContext context) {
			this.partyService = partyService;
			_logger = logger;
			this.context = context;
		}

		[HttpGet]
		public ActionResult<PlayerDTO> Get(string partyKey) {
			Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			List<Performance> queue = party.Queue.Where(q => q.Status == PerformanceStatus.Queued).OrderBy(q => q.Order).ToList();
			return new PlayerDTO {
				PlayerState = party.PlayerState,
				Performance = queue.FirstOrDefault(),
				UpcomingPerformances = queue.Skip(1).ToList()
			};
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
