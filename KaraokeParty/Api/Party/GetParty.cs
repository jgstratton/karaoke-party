using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiGetParty : ControllerBase {
		private readonly IPartyService partyService;

		public ApiGetParty(IPartyService partyService) {
			this.partyService = partyService;
		}

		[HttpGet]
		[Route("party/{partyKey}")]
		[HttpGet]
		public ActionResult<PartyDTO> Get(string partyKey) {
			Party? party = partyService.GetPartyByAnyKey(partyKey);

			if (party == null) {
				return NotFound();
			}
			return PartyDTO.FromDb(party);
		}
	}
}
