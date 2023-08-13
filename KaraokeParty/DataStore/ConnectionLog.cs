using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class ConnectionLog {

		[Key]
		public int LogId { get; set; }

		public string ConnectionId { get; set; } = "";

		public string PartyKey { get; set; } = "";

		public string DeviceId { get; set; } = "";

		public string Action { get; set; } = "";

		public string BrowserDetails { get; set; } = "";

		public DateTime LogTime { get; set; } = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.Now, "Eastern Standard Time");
	}
}
