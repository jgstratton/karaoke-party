﻿using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class SongDTO {
		public string Id { get; set; } = "";
		public string FileName { get; set; } = "";
		public string Title { get; set; } = "";
		public string Url { get; set; } = "";
		public string S3Key { get; set; } = "";

		public Song ToDb() {
			if (FileName is null) {
				throw new Exception("Missing Filename");
			}
			return new Song {
				FileName = FileName,
				Title = Title is null ? FileName : Title,
				Url = Url ?? "",
				VideoId = Id,
				S3Key = S3Key ?? ""
			};
		}

		public void UpdateDb(Song song) {
			if (Id is null) {
				throw new Exception("Missing Video ID");
			}
			if (song.VideoId != Id) {
				throw new Exception($"Attempted to update wrong object {FileName}:{song.VideoId}");
			}
			if (!string.IsNullOrEmpty(Title)) {
				song.Title = Title;
			}
			if (!string.IsNullOrEmpty(Url)) {
				song.Url = Url;
			}
			if (!string.IsNullOrEmpty(S3Key)) {
				song.S3Key = S3Key;
			}
			if (!string.IsNullOrEmpty(Url)) {
				song.FileName = FileName;
			}
		}

		public static SongDTO FromDb(Song song) {
			return new SongDTO {
				FileName = song.FileName,
				Title = song.Title,
				Url = song.Url,
				Id = song.VideoId,
				S3Key = song.S3Key
			};
		}
	}
}
