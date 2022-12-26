using KaraokeParty.DataStore;
using KaraokeParty.Services;

namespace KaraokeParty.ApiModels {
	public class PartyPost {
		public string Title { get; set; } = "";

		public Party ToDb() {
			return new Party {
				Title = Title,
				DJKey = KeyGenerator.CreateAlphaKey(4),
				PartyKey = KeyGenerator.CreateAlphaKey(4)
			};
		}
	}
}
