using KaraokeParty.DataStore;
using KaraokeParty.Hubs;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Party {
	[ApiController]
	public class ApiDisconnectAll : ControllerBase {
		private readonly PlayerHub hub;
		private readonly KPContext context;

		public ApiDisconnectAll(KPContext context, PlayerHub hub) {
			this.hub = hub;
			this.context = context;
		}

		[HttpGet]
		[Route("party/{partyKey}/disconnect")]
		public async Task<ActionResult<bool>> DisconnectAll(string partyKey) {
			var connections = context.ConnectionLog.Where(c => c.PartyKey.Contains(partyKey)).Select(c => new {
				c.ConnectionId,
				c.PartyKey
			}).Distinct().ToList();
			foreach (var connection in connections) {
				await hub.LeaveGroups(new ClientConnectionDetails { PartyKey = partyKey }, connection.ConnectionId);
			}
			return true;
		}
	}
}
