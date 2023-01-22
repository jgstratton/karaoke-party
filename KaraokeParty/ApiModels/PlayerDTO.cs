using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class PlayerDTO {
		public PerformanceDTO? Performance { get; set; } = null;
		public PlayerState PlayerState { get; set; } = PlayerState.Stopped;
		public List<PerformanceDTO> UpcomingPerformances { get; set; } = new List<PerformanceDTO>();
	}
}
