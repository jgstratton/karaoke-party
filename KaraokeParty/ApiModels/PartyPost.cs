using KaraokeParty.DataStore;
using KaraokeParty.Services;

namespace KaraokeParty.ApiModels {
	public class PartyPost {
		public string Title { get; set; } = "";
		public string DJName { get; set; } = "";

		public Party ToDb() {
			return new Party {
				Title = Title,
				PartyKey = KeyGenerator.CreateAlphaKey(4),
				Singers = new List<Singer> {
					new Singer {
						Name = string.IsNullOrWhiteSpace(DJName) ? "DJ" : DJName,
						IsDj = true
					}
				}
			};
		}
	}
}
