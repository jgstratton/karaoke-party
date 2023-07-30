using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class ConnectionLog {

		[Key]
		public int LogId { get; set; }

		public string ConnectionId { get; set; } = "";

		public string PartyKey { get; set; } = "";

		public string IP { get; set; } = "";

		public string Action { get; set; } = "";
	}
}
