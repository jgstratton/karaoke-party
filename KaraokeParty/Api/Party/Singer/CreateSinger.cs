using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.PartyEndpoints.Singer {
	[ApiController]
	public class ApiSingerCreate : ControllerBase {
		private readonly IPartyService partyService;
		private readonly ISingerService singerService;
		private readonly KPContext context;

		public ApiSingerCreate(KPContext context, IPartyService partyService, ISingerService singerService) {
			this.partyService = partyService;
			this.singerService = singerService;
			this.context = context;
		}

		[HttpPost]
		[Route("party/{partyKey}/singer")]
		public ActionResult<SingerDTO> Create(string partyKey, [FromBody] SingerDTO dto) {
			try {
				if (dto.SingerId != null) {
					return BadRequest("Wrong verb / unexpected id, use PUT to update an existing singer");
				}
				DataStore.Party? party = partyService.GetPartyByKey(partyKey);
				if (party == null) {
					return NotFound();
				}
				int existingNameCount = context.Singers
					.Where(s =>
						s.Party != null
						&& s.Party.PartyId == party.PartyId
						&& s.Name.ToLower().Trim() == dto.Name.ToLower().Trim()
					).Count();

				if (existingNameCount > 0) {
					return BadRequest("Name is already used in this party");
				}

				DataStore.Singer dbSinger = dto.ToDb();
				if (dto.RotationNumber <= 0) {
					dbSinger.RotationNumber = party.Singers.Count() + 1;
				} else {
					singerService.MoveSingerInRotation(party, dbSinger, dto.RotationNumber);
				}

				dbSinger.Party = party;
				context.Singers.Add(dbSinger);
				context.SaveChanges();
				return SingerDTO.FromDb(dbSinger);
			} catch (Exception ex) {
				return BadRequest($"An unexpected error occured: {ex.Message}");
			}
		}
	}
}
