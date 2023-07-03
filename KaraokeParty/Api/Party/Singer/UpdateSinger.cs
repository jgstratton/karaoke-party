using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiSingerUpdate : ControllerBase {
		private readonly IPartyService partyService;
		private readonly ISingerService singerService;
		private readonly KPContext context;

		public ApiSingerUpdate(KPContext context, IPartyService partyService, ISingerService singerService) {
			this.partyService = partyService;
			this.singerService = singerService;
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

				singerService.MoveSingerInRotation(party, singer, dto.RotationNumber);

				dto.UpdateDb(singer);
				context.SaveChanges();
				return dto;
			} catch (Exception ex) {
				return BadRequest($"An unexpected error occured: {ex.Message}");
			}
		}

		[HttpPut]
		[Route("party/{partyKey}/singer/{singerId}/moveToLast")]
		public ActionResult<List<SingerDTO>> Update(string partyKey, int singerId) {
			try {
				Party? party = partyService.GetPartyByKey(partyKey);
				if (party == null) {
					return NotFound();
				}
				Singer? singer = party.Singers.Where(s => s.SingerId == singerId).FirstOrDefault();
				if (singer == null) {
					return NotFound();
				}

				// by default, place new singers right before the current singer
				var currentPerformance = party.Queue.Where(p => p.Status == PerformanceStatus.Live).FirstOrDefault();
				int newRotationNumber = -1;
				if (currentPerformance != null) {
					newRotationNumber = party.Singers.Where(s => s.SingerId == currentPerformance.Singer?.SingerId)
						.Select(s => s.RotationNumber).FirstOrDefault() - 1;
				}
				if (newRotationNumber <= 0) {
					newRotationNumber = party.Singers.Count + 1;
				}
				singer.RotationNumber = newRotationNumber;

				singerService.MoveSingerInRotation(party, singer, newRotationNumber);

				context.SaveChanges();
				return party.Singers.OrderBy(s => s.RotationNumber).Select(s => SingerDTO.FromDb(s)).ToList();
			} catch (Exception ex) {
				return BadRequest($"An unexpected error occured: {ex.Message}");
			}
		}
	}
}
