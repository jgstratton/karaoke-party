using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KaraokeParty.Api.Party.Performance {
	[ApiController]
	public class ApiUpdatePerformance : ControllerBase {
		private readonly KPContext context;

		public ApiUpdatePerformance(KPContext context) {
			this.context = context;
		}

		[HttpPut]
		[Route("party/{partyKey}/performance")]
		public ActionResult<PerformanceDTO> UpdatePerformance(string partyKey, [FromBody] PerformanceDTO dto) {
			try {
				DataStore.Party? party = context.Parties.Where(p => p.PartyKey == partyKey).FirstOrDefault();
				if (party is null) {
					return NotFound("Party not found");
				}

				if (dto.PerformanceId == null) {
					return BadRequest("Wrong verb or missing id, use POST to create a new performance, or provide a performance id");
				}
				DataStore.Performance? performance = context.Performances
					.Include(p => p.Party)
					.Include(p => p.User)
					.Where(p => p.PerformanceID == dto.PerformanceId).FirstOrDefault();
				if (performance == null) {
					return NotFound($"No performance was found with id {dto.PerformanceId}");
				}
				if (partyKey != performance.Party?.PartyKey) {
					return BadRequest("Performance partyKey mismatch");
				}

				DataStore.Singer? singer = null;

				if ((dto.SingerId ?? 0) > 0) {
					singer = party.Singers.Where(s => s.SingerId == dto.SingerId).FirstOrDefault();
				} else {
					if (dto.Status != (int)PerformanceStatus.Requested) {
						return BadRequest("A singer must be selected for a request to move passed 'requested' status.");
					}
				}

				// if sort order isn't set, then add it to the end
				if (singer is not null && dto.SortOrder is null) {
					dto.SortOrder = party.Queue
						.Where(p => p.Singer != null && p.Singer.SingerId == dto.SingerId)
						.Select(p => p.SortOrder)
						.DefaultIfEmpty(0).Max() + 1;
				}

				dto.UpdateDb(context, performance);
				context.SaveChanges();
				return PerformanceDTO.FromDb(performance);
			} catch (Exception ex) {
				return BadRequest($"An unexpected error occured: {ex.Message}");
			}
		}
	}
}
