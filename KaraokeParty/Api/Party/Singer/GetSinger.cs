using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Party.Singer {
	[ApiController]
	public class ApiSingerGet : ControllerBase {
		private readonly IPartyService partyService;
		private readonly KPContext context;

		public ApiSingerGet(KPContext context, IPartyService partyService) {
			this.partyService = partyService;
			this.context = context;
		}

		[HttpGet]
		[Route("party/{partyKey}/singer/{singerId}")]
		public ActionResult<SingerDTO> Get(string partyKey, int singerId) {
			DataStore.Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			DataStore.Singer? singer = context.Singers.Find(singerId);
			if (singer == null) {
				return NotFound();
			}
			return SingerDTO.FromDb(singer);
		}

		[HttpGet]
		[Route("party/{partyKey}/singers")]
		public ActionResult<List<SingerDTO>> GetSingers(string partyKey) {
			DataStore.Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			return party.Singers.Select(s => SingerDTO.FromDb(s)).ToList();
		}
	}
}
