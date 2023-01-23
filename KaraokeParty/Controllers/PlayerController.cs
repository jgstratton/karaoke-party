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

		[HttpGet]
		public ActionResult<PlayerDTO> Get(string partyKey) {
			Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			List<PerformanceDTO> queue = party.Queue
				.Where(q => q.Status == PerformanceStatus.Queued)
				.Select(a => new PerformanceDTO {
					FileName = a.Song?.FileName,
					Sort_Order = a.Sort_Order,
					PerformanceId = a.PerformanceID,
					SingerId = a.Singer?.SingerId,
					SingerName = a.Singer?.Name,
					Status = a.Status
				}).OrderBy(q => q.Sort_Order).ToList();
			return new PlayerDTO {
				PlayerState = party.PlayerState,
				Performance = queue.FirstOrDefault(),
				UpcomingPerformances = queue.Skip(1).ToList()
			};
		}

		[HttpGet]
		[Route("Next")]
		public ActionResult<PerformanceDTO> Next(string partyKey) {
			Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			party.Queue
				.Where(p => p.Status == PerformanceStatus.Live)
				.ToList()
				.ForEach(p => p.Status = PerformanceStatus.Completed);

			Performance? nextPerformance = party.Queue
				.Where(q => q.Status == PerformanceStatus.Queued)
				.OrderBy(p => p.Sort_Order).FirstOrDefault();

			PerformanceDTO dto = new PerformanceDTO();
			if (nextPerformance != null) {
				nextPerformance.Status = PerformanceStatus.Live;
				dto = PerformanceDTO.FromDb(nextPerformance);
				_ = playerHubContext.Clients.All.SendAsync("ReceiveCurrentPerformance", dto);
			}
			context.SaveChanges();
			return dto;
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

		[HttpGet]
		[Route("GetQueuedList")]
		public ActionResult<GetQueuedListResponse> GetQueuedList(string partyKey) {
			Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			return new GetQueuedListResponse {
				Performances = party.Queue.Where(p => p.Status == PerformanceStatus.Queued).Select(p => new GetQueuedListResponse.Performance {
					FileName = p.Song?.FileName ?? "",
					Sort_Order = p.Sort_Order,
					PerformanceId = p.PerformanceID,
					SingerName = p.Singer?.Name ?? ""
				}).ToList()
			};
		}


	}
}
