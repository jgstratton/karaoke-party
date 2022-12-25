using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class PartyController : ControllerBase {

		private readonly ILogger<PartyController> _logger;
		private readonly KPContext context;

		public PartyController(ILogger<PartyController> logger, KPContext context) {
			_logger = logger;
			this.context = context;
		}

		[HttpGet]
		public Party Get(
			[FromQuery] string djKey ="",
			string partyKey = ""
		) {
			Party? party = context.Parties.Where(p => p.DJKey == djKey || p.PartyKey == partyKey).FirstOrDefault();
			if (party == null) {
				throw new System.Web.Http.HttpResponseException(HttpStatusCode.NotFound);
			}
			return party;
		}
	}
}