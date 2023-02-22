using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class User {

		[Key]
		public int UserId { get; set; }

		[Required]
		[MaxLength(128)]
		public string Name { get; set; } = "";

		public bool IsDj { get; set; }
	}
}
