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
		public string DJKey { get; set; } = "";

		[Required]
		[MaxLength(10)]
		public string PartyKey { get; set; } = "";

		[Required]
		public DateTime DateTimeCreated { get; set; }

		public bool IsExpired { get; set; } = false;

	}
}
