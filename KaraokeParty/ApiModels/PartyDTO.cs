using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class PartyDTO {
		public int PartyId { get; set; }
		public string Title { get; set; } = "";
		public string PartyKey { get; set; } = "";

		public PlayerDTO Player { get; set; }
		public List<PerformanceDTO> Performances { get; set; }
		public PlayerSettingsDTO PlayerSettings { get; set; }

		public PartyDTO() {
			Player = new PlayerDTO();
			Performances = new List<PerformanceDTO>();
			PlayerSettings = new PlayerSettingsDTO();
		}

		public static PartyDTO FromDb(Party party) {
			List<PerformanceDTO> performances = party.Queue
				.ToList()
				.Select(q => PerformanceDTO.FromDb(q))
				.ToList();

			PerformanceDTO? currentPerformance = performances.Where(p => p.Status == PerformanceStatus.Live).FirstOrDefault();

			return new PartyDTO {
				PartyId = party.PartyId,
				Title = party.Title,
				PartyKey = party.PartyKey,
				Player = new PlayerDTO {
					VideoLength = party.VideoLength,
					VideoPosition = party.VideoPosition,
					FileName = currentPerformance?.FileName ?? "",
					PlayerState = party.PlayerState,
					Title = currentPerformance?.SongTitle ?? ""
				},
				Performances = performances,
				PlayerSettings = new PlayerSettingsDTO {
					MarqueeEnabled = party.MarqueeEnabled,
					MarqueeSize = party.MarqueeSize,
					MarqueeSpeed = party.MarqueeSpeed,
					MarqueeText = party.MarqueeText
				}
			};
		}
	}
}
