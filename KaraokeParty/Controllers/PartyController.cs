using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class PartyController : ControllerBase {

		private readonly ILogger<PartyController> _logger;
		private readonly KPContext context;

		public PartyController(ILogger<PartyController> logger) {
			_logger = logger;
			this.context = new KPContext();
		}

		[HttpGet]
		public ActionResult<Party> Get([FromQuery] PartyQuery query) {
			Party? party = context.Parties.Where(p =>
				!p.IsExpired && 
				(p.DJKey == query.DJKey || p.PartyKey == query.PartyKey)
			).FirstOrDefault();
			if (party == null) {
				return NotFound();
			}
			return party;
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