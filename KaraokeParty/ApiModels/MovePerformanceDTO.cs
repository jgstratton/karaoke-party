using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class MovePerformanceDTO {
		public int PerformanceId { get; set; }
		public PerformanceStatus TargetStatus { get; set; }
		public int TargetIndex { get; set; }
	}
}