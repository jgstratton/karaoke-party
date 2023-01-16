using KaraokeParty.DataStore;

namespace KaraokeParty.Controllers {
	public class MovePerformanceBody {
		public PerformanceStatus TargetStatus { get; set; }
		public int TargetIndex { get; set; }
	}
}