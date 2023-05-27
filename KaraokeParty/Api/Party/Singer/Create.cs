using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class ApiSingerCreate : ControllerBase {
		private readonly IPartyService partyService;
		private readonly KPContext context;

		public ApiSingerCreate(KPContext context, IPartyService partyService) {
			this.partyService = partyService;
			this.context = context;
		}

		[HttpPost]
		[Route("party/{partyKey}/singer")]
		public ActionResult<SingerDTO> Create(string partyKey, [FromBody] SingerDTO dto) {
			try {
				if (dto.SingerId != null) {
					return BadRequest("Wrong verb / unexpected id, use PUT to update an existing singer");
				}
				Party? party = partyService.GetPartyByKey(partyKey);
				if (party == null) {
					return NotFound();
				}
				context.Singers.Add(dto.ToDb());
				context.SaveChanges();
				return dto;
			} catch (Exception ex) {
				return BadRequest($"An unexpected error occured: {ex.Message}");
			}
		}
	}
}
