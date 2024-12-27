namespace KaraokeParty.ApiModels {
	public class ServerLogDTO {
		public int Id { get; set; }
		public string LogTime { get; set; } = "";
		public string LogLevel { get; set; } = "";
		public string Message { get; set; } = "";
	}
}
