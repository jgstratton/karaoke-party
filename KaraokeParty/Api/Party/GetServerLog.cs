using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Party {
	[ApiController]
	public class GetServerLog : ControllerBase {
		private readonly KPContext context;

		public GetServerLog(KPContext context) {
			this.context = context;
		}

		[HttpGet]
		[Route("party/{partyKey}/ServerLog")]
		[HttpGet]
		public ActionResult<ServerLogResponse> Get(string partyKey) {
			return new ServerLogResponse {
				Records = context.ApplicationLog.OrderByDescending(l => l.LogId).Take(500).Select(l => new ServerLogDTO {
					Id = l.LogId,
					LogLevel = l.LogLevel,
					LogTime = l.LogTime.ToString("yyyy-MM-dd HH:mm:ss"),
					Message = l.Message
				}).ToList()
			};
		}
	}
}
