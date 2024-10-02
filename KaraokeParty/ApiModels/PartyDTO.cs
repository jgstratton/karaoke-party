using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class PartyDTO {
		public int PartyId { get; set; }
		public string Title { get; set; } = "";
		public string PartyKey { get; set; } = "";
		public string DjKey { get; set; } = "";
		public PlayerDTO Player { get; set; }
		public List<PerformanceDTO> Performances { get; set; }
		public List<SingerDTO> Singers { get; set; }
		public ConfigurableSettingsDTO Settings { get; set; }
		public ServerSettings ServerSettings { get; set; }

		public PartyDTO() {
			Player = new PlayerDTO();
			Performances = new List<PerformanceDTO>();
			Singers = new List<SingerDTO>();
			Settings = new ConfigurableSettingsDTO();
			this.ServerSettings = ServerSettingsStaticProvider.GetServerSettings();
		}

		public static PartyDTO FromDb(Party party) {
			List<PerformanceDTO> performances = party.Queue
				.ToList()
				.Select(q => PerformanceDTO.FromDb(q))
				.ToList();

			PerformanceDTO? currentPerformance = performances.Where(p => p.Status == PerformanceStatus.Live).FirstOrDefault();

			List<SingerDTO> singers = party.Singers.Select(s => SingerDTO.FromDb(s)).ToList();

			return new PartyDTO {
				PartyId = party.PartyId,
				Title = party.Title,
				PartyKey = party.PartyKey,
				DjKey = party.DjKey,

				Player = new PlayerDTO {
					VideoLength = party.VideoLength,
					VideoPosition = party.VideoPosition,
					FileName = currentPerformance?.FileName ?? "",
					PlayerState = party.PlayerState,
					Title = currentPerformance?.SongTitle ?? "",
					Volume = party.Volume,
				},
				Performances = performances,
				Singers = singers,
				Settings = new ConfigurableSettingsDTO {
					MarqueeEnabled = party.MarqueeEnabled,
					MarqueeSize = party.MarqueeSize,
					MarqueeSpeed = party.MarqueeSpeed,
					MarqueeText = party.MarqueeText,
					SplashScreenEnabled = party.SplashScreenEnabled,
					SplashScreenSeconds = party.SplashScreenSeconds,
					SplashScreenUpcomingCount = party.SplashScreenUpcomingCount,
					AiEnabled = party.AiEnabled,
					AutoMoveSingerEnabled = party.AutoMoveSingerEnabled,
					QRCodeEnabled = party.QRCodeEnabled,
					QRCodeSize = party.QRCodeSize
				}
			};
		}
	}
}
