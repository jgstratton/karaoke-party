using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiSingerUpdate : ControllerBase {
		private readonly IPartyService partyService;
		private readonly KPContext context;

		public ApiSingerUpdate(KPContext context, IPartyService partyService) {
			this.partyService = partyService;
			this.context = context;
		}

		[HttpPut]
		[Route("party/{partyKey}/singer/{singerId}")]
		public ActionResult<SingerDTO> Update(string partyKey, [FromBody] SingerDTO dto) {
			try {
				if (dto.SingerId == null) {
					return BadRequest("Wrong verb or missing id, use POST to update an existing singer, or provide a singer id");
				}
				Party? party = partyService.GetPartyByKey(partyKey);
				if (party == null) {
					return NotFound();
				}
				Singer? singer = context.Singers.Find(dto.SingerId);
				if (singer == null) {
					return NotFound();
				}
				if (partyKey != singer.Party?.PartyKey) {
					return BadRequest("partyKey mismatch");
				}

				if (dto.RotationNumber != singer.RotationNumber) {
					List<Singer> allSingers = context.Singers.OrderBy(s => s.RotationNumber).ToList();
					allSingers.RemoveAt(allSingers.FindIndex(s => s.SingerId == dto.SingerId));
					allSingers.Insert(dto.RotationNumber - 1, singer);
					for (var i = 0; i < allSingers.Count; i++) {
						allSingers[i].RotationNumber = i + 1;
					}
				}

				dto.UpdateDb(singer);
				context.SaveChanges();
				return dto;
			} catch (Exception ex) {
				return BadRequest($"An unexpected error occured: {ex.Message}");
			}
		}
	}
}
