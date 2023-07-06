using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class Dj {

		[Key]
		public int DjId { get; set; }

		[Required]
		[MaxLength(128)]
		public string Name { get; set; } = "";

		// not encrypted or anything or this silly app
		public string Password { get; set; } = "";
	}
}
