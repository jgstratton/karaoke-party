using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class PartyController : ControllerBase {
		private readonly IPartyService partyService;
		private readonly ILogger<PartyController> _logger;
		private readonly KPContext context;

		public PartyController(IPartyService partyService, ILogger<PartyController> logger, KPContext context) {
			this.partyService = partyService;
			_logger = logger;
			this.context = context;
		}

		[HttpGet]
		public ActionResult<Party> Get(string partyKey) {
			Party? party = context.Parties.Include(p => p.Singers).Where(p =>
				!p.IsExpired && p.PartyKey == partyKey
			).OrderByDescending(p => p.DateTimeCreated).FirstOrDefault();
			if (party == null) {
				return NotFound();
			}
			return party;
		}

		[HttpGet]
		[Route("join/{partyKey}")]
		public ActionResult<Singer> Join(string partyKey, [FromQuery] SingerDTO singer) {
			Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			Singer newSinger = singer.ToDb();
			party.Singers.Add(newSinger);
			context.SaveChanges();
			return newSinger;
		}

		[HttpPost]
		public Party Post(PartyPost postParty) {
			Party newParty = postParty.ToDb();
			context.Parties.Add(newParty);
			context.SaveChanges();
			return newParty;
		}
	}
}
