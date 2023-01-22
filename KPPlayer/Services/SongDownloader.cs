using System;
using System.Collections.Generic;
using System.IO;

namespace KPPlayer.Services {
	internal class SongDownloader {
		private readonly static string downloadPath = $"{AppDomain.CurrentDomain.BaseDirectory}\\data\\videos";
		private Dictionary<string, bool> verifiedSongs { get; set; }

		public SongDownloader() {
			if (!Directory.Exists(downloadPath)) {
				Directory.CreateDirectory(downloadPath);
			}
			verifiedSongs = new Dictionary<string, bool>();
		}

		public async void PrepareVideo(string fileName) {
			string filePath = GetFilePath(fileName);
			if (verifiedSongs.ContainsKey(fileName)) {
				return;
			}
			if (File.Exists(filePath)) {
				verifiedSongs[fileName] = true;
				return;
			}
			byte[] fileData = await AppState.client.FetchFile($"song/download/{fileName}");
			File.WriteAllBytes(filePath, fileData);
			verifiedSongs[fileName] = true;
		}

		public static string GetFilePath(string fileName) {
			return Path.Combine(downloadPath, fileName);
		}
	}
}
