using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class Song {
		[Key]
		public string FileName { get; set; } = "";

		public string Title { get; set; } = "";

		public string Url { get; set; } = "";

		public string VideoId { get; set; } = "";
	}
}
