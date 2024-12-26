using System.ComponentModel.DataAnnotations;

namespace KaraokeParty.DataStore {
	public class Song {

		public string FileName { get; set; } = "";

		public string Title { get; set; } = "";

		public string Url { get; set; } = "";

		[Key]
		public string VideoId { get; set; } = "";

		public string S3Key { get; set; } = "";
	}
}
