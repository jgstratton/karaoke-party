using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class PlayerDTO {
		public Performance? Performance { get; set; } = null;
		public PlayerState PlayerState { get; set; } = PlayerState.Stopped;
		public List<Performance> UpcomingPerformances { get; set; } = new List<Performance>();
	}
}
