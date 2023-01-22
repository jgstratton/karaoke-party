using KaraokeParty.DataStore;

namespace KaraokeParty.Controllers {
	public class GetQueuedListResponse {
		public List<Performance> Performances { get; set; }

		public GetQueuedListResponse() {
			Performances = new List<Performance>();
		}
		public class Performance {
			public int? PerformanceId { get; set; }
			public string? SingerName { get; set; }
			public string? FileName { get; set; }
			public int? Sort_Order { get; set; }
		}
	}
}