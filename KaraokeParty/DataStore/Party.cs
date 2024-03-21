using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class Party {

		[Key]
		public int PartyId { get; set; }

		[Required]
		[MaxLength(128)]
		public string Title { get; set; } = "";

		[Required]
		[MaxLength(10)]
		public string PartyKey { get; set; } = "";

		[Required]
		[MaxLength(10)]
		public string DjKey { get; set; } = "";

		[Required]
		public DateTime DateTimeCreated { get; set; } = DateTime.Now;

		public bool IsExpired { get; set; } = false;

		public virtual List<Performance> Queue { get; set; } = new List<Performance>();

		public virtual List<Singer> Singers { get; set; } = new List<Singer>();

		public PlayerState PlayerState { get; set; } = PlayerState.Stopped;

		public decimal VideoPosition { get; set; }

		public int VideoLength { get; set; }

		public Boolean MarqueeEnabled { get; set; } = false;

		public string MarqueeText { get; set; } = "";

		public int MarqueeSpeed { get; set; } = 20;

		public int MarqueeSize { get; set; } = 40;

		public Boolean SplashScreenEnabled { get; set; } = false;

		public int SplashScreenSeconds { get; set; } = 10;

		public int SplashScreenUpcomingCount { get; set; } = 3;

		public Boolean AiEnabled { get; set; } = true;

		public Boolean AutoMoveSingerEnabled { get; set; } = true;
	}
}
