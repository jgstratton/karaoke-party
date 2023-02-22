using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
		public DateTime DateTimeCreated { get; set; } = DateTime.Now;

		public bool IsExpired { get; set; } = false;

		public virtual List<Performance> Queue { get; set; } = new List<Performance>();

		public PlayerState PlayerState { get; set; } = PlayerState.Stopped;

		public decimal VideoPosition { get; set; }

		public int VideoLength { get; set; }

		public Boolean MarqueeEnabled { get; set; } = false;

		public string MarqueeText { get; set; } = "";

		public int MarqueeSpeed { get; set; } = 20;

		public int MarqueeSize { get; set; } = 40;
	}
}
