namespace KaraokeParty.ApiModels {
	public class ConfigurableSettingsDTO {
		public Boolean MarqueeEnabled { get; set; }
		public string MarqueeText { get; set; } = "";
		public int MarqueeSpeed { get; set; } = 20;
		public int MarqueeSize { get; set; } = 40;

		public Boolean SplashScreenEnabled { get; set; } = false;
		public int SplashScreenSeconds { get; set; } = 10;
		public int SplashScreenUpcomingCount { get; set; } = 3;

		public Boolean AiEnabled { get; set; } = false;
	}
}