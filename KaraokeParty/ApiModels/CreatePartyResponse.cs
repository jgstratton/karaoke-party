namespace KaraokeParty.ApiModels {
	public class CreatePartyResponse {
		public PartyDTO Party { get; set; }
		public UserDTO Dj { get; set; }

		public CreatePartyResponse() {
			Party = new PartyDTO();
			Dj = new UserDTO();
		}
	}
}