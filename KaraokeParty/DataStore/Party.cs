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
		public DateTime DateTimeCreated { get; set; } = DateTime.Now;

		public bool IsExpired { get; set; } = false;

		public List<Singer> Singers { get; set; } = new List<Singer>();
	}
}
