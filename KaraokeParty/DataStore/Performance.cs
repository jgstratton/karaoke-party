using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class Performance {
		[Key]
		public int PerformanceID { get; set; }

		public Party? Party { get; set; }

		public Singer? Singer { get; set; }

		public Song? Song { get; set; }

		public bool SongCompleted { get; set; } = false;

		public int? Order { get; set; }
	}
}
