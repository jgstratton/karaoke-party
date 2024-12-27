using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class ApplicationLog {

		[Key]
		public int LogId { get; set; }

		public DateTime LogTime { get; set; } = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.Now, "Eastern Standard Time");

		public string LogLevel { get; set; } = "";

		public string Message { get; set; } = "";

		public string ExceptionType { get; set; } = "";

		public string ExceptionSource { get; set; } = "";

		public string InnerException { get; set; } = "";

		public string StackTrace { get; set; } = "";
	}
}
