using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class SongDTO {
		public string? FileName { get; set; }
		public string? Title { get; set; }
		public string? Url { get; set; }

		public Song ToDb() {
			if (FileName is null) {
				throw new Exception("Missing Filename");
			}
			return new Song {
				FileName = FileName,
				Title = Title is null ? FileName : Title,
				Url = Url??""
			};
		}

		public void UpdateDb(Song song) {
			if (FileName is null) {
				throw new Exception("Missing Filename");
			}
			if (song.FileName != FileName) {
				throw new Exception($"Attempted to update wrong object {FileName}:{song.FileName}");
			}
			if (!string.IsNullOrEmpty(Title)) {
				song.Title = Title;
			}
			if (!string.IsNullOrEmpty(Url)) {
				song.Url = Url;
			}
		}
	}
}
