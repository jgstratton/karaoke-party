using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class Singer {

		[Key]
		public int SingerId { get; set; }

		[Required]
		[MaxLength(128)]
		public string Name { get; set; } = "";

		public virtual Party? Party { get; set; }

		public int RotationNumber { get; set; }

		public bool IsPaused { get; set; }
	}
}
