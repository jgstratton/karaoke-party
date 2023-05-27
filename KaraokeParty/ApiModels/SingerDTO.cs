using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class SingerDTO {
		public int? SingerId { get; set; }
		public string Name { get; set; } = "";
		public int RotationNumber { get; set; } = 0;

		public Singer ToDb() {
			return new Singer {
				Name = Name,
				RotationNumber = RotationNumber
			};
		}

		public void UpdateDb(Singer singer) {
			if (singer.SingerId != SingerId) {
				throw new Exception($"Attempted to update wrong object {SingerId}:{singer.SingerId}");
			}
			if (!string.IsNullOrEmpty(Name)) {
				singer.Name = Name;
			}

			singer.RotationNumber = RotationNumber;
		}

		public static SingerDTO FromDb(Singer singer) {
			return new SingerDTO {
				SingerId = singer.SingerId,
				Name = singer.Name,
				RotationNumber = singer.RotationNumber
			};
		}
	}
}
