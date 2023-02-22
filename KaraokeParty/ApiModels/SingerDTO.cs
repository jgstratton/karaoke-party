using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class SingerDTO {
		public int? SingerId { get; set; }
		public string? FileName { get; set; }
		public string Name { get; set; } = "";
		public bool IsDj { get; set; } = false;

		public User ToDb() {
			return new User {
				Name = Name,
				IsDj = IsDj
			};
		}

		public void UpdateDb(User singer) {
			if (singer.UserId != SingerId) {
				throw new Exception($"Attempted to update wrong object {SingerId}:{singer.UserId}");
			}
			if (!string.IsNullOrEmpty(Name)) {
				singer.Name = Name;
			}

			singer.IsDj= IsDj;
		}
	}
}
