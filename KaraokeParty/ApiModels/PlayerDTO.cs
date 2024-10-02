using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class PlayerDTO {
		public PlayerState PlayerState { get; set; } = PlayerState.Stopped;
		public decimal VideoPosition { get; set; }
		public int VideoLength { get; set; }
		public string FileName { get; set; } = "";
		public string Title { get; set; } = "";
		public int Volume { get; set; } = 80;
	}
}
