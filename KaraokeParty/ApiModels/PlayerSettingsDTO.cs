namespace KaraokeParty.ApiModels
{
	public class PlayerSettingsDTO
	{
		public Boolean MarqueeEnabled { get; set; }
		public string MarqueeText { get; set; } = "";
		public int MarqueeSpeed { get; set; } = 20;
		public int MarqueeSize { get; set; } = 40;
	}
}