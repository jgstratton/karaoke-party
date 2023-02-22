using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class UserDTO {
		public int? UserId { get; set; }
		public string Name { get; set; } = "";
		public bool IsDj { get; set; } = false;

		public User ToDb() {
			return new User {
				Name = Name,
				IsDj = IsDj
			};
		}

		public void UpdateDb(User user) {
			if (user.UserId != UserId) {
				throw new Exception($"Attempted to update wrong object {UserId}:{user.UserId}");
			}
			if (!string.IsNullOrEmpty(Name)) {
				user.Name = Name;
			}

			user.IsDj = IsDj;
		}

		public static UserDTO FromDb(User user) {
			return new UserDTO {
				UserId = user.UserId,
				Name = user.Name,
				IsDj = user.IsDj
			};
		}
	}
}
