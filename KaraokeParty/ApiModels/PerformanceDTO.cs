using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class PerformanceDTO {
		public int? PerformanceId { get; set; }
		public int? SingerId { get; set; }
		public string? FileName { get; set; }
		public PerformanceStatus Status { get; set; }
		public int? Order { get; set; }

		public void UpdateDb(KPContext context, Performance performance) {
			if (performance.Singer is null) {
				throw new Exception("Missing singer.");
			}
			if (performance.Singer.SingerId != SingerId) {
				throw new Exception($"Changing singers is not supported");
			}

			if (FileName != null && FileName != performance.Song?.FileName) {
				var newSong = context.Songs.Find(FileName);
				if (newSong is null) {
					throw new Exception($"Song not found");
				} else {
					performance.Song = newSong;
				}
			}

			performance.Status = Status;

			if (Order != null) {
				performance.Order = Order;
			}
		}
	}
}
