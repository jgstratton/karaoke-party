using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class Performance {
		[Key]
		public int PerformanceID { get; set; }

		public string SingerName { get; set; } = "";

		public virtual Party? Party { get; set; }

		public virtual User? User { get; set; }

		public virtual Song? Song { get; set; }

		public virtual Singer? Singer { get; set; }

		public PerformanceStatus Status { get; set; } = PerformanceStatus.Requested;

		public int? SortOrder { get; set; }

		public int? CompletedOrder { get; set; }
	}
}
