using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class SingerDTO {
		public int? SingerId { get; set; }
		public string? FileName { get; set; }
		public string Name { get; set; } = "";
		public bool IsDj { get; set; } = false;

		public Singer ToDb() {
			return new Singer {
				Name = Name,
				IsDj = IsDj
			};
		}

		public void UpdateDb(Singer singer) {
			if (singer.SingerId != SingerId) {
				throw new Exception($"Attempted to update wrong object {SingerId}:{singer.SingerId}");
			}
			if (!string.IsNullOrEmpty(Name)) {
				singer.Name = Name;
			}

			singer.IsDj= IsDj;
		}
	}
}
