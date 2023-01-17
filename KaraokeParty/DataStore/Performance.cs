using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class Performance {
		[Key]
		public int PerformanceID { get; set; }

		public Party? Party { get; set; }

		public Singer? Singer { get; set; }

		public Song? Song { get; set; }

		public PerformanceStatus Status { get; set; } = PerformanceStatus.Requested;

		public int? Sort_Order { get; set; }
	}
}
