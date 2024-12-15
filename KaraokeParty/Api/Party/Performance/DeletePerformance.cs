using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Party.Performance {
	[ApiController]
	public class ApiDeletePerformance : ControllerBase {
		private readonly KPContext context;

		public ApiDeletePerformance(KPContext context) {
			this.context = context;
		}

		[HttpDelete]
		[Route("party/{partyKey}/performance/{PerformanceId}")]
		public ActionResult<bool> DeletePerformance(string partyKey, int performanceId) {
			DataStore.Performance? performance = context.Performances.Find(performanceId);
			if (performance == null) {
				return NotFound($"No performance was found with id {performanceId}");
			}
			if (partyKey != performance.Party?.PartyKey) {
				return BadRequest("Performance partyKey mismatch");
			}
			context.Performances.Remove(performance);
			context.SaveChanges();
			return true;
		}
	}
}
