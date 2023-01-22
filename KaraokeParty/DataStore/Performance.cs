using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class Performance {
		[Key]
		public int PerformanceID { get; set; }

		public virtual Party? Party { get; set; }

		public virtual Singer? Singer { get; set; }

		public virtual Song? Song { get; set; }

		public PerformanceStatus Status { get; set; } = PerformanceStatus.Requested;

		public int? Sort_Order { get; set; }
	}
}
