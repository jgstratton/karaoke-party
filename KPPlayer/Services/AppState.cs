using KaraokeParty.DataStore;
using KPPlayer.Types;
using System;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace KPPlayer.Services {
	internal static class AppState {
		private readonly static string SettingsPath = $"{AppDomain.CurrentDomain.BaseDirectory}/data/";
		private readonly static string SettingsFile = $"ApplicationSettings.json";
		public static HttpClient client;
		public static ConnectionStatus Status { get; set; } = ConnectionStatus.Unknown;
		public static string ServerUrl { get; set; }
		public static string PartyKey { get; set; }
		public static VideoPlayer Player { get; set; }

		private class PersistedSettings {
			public string ServerUrl { get; set; }
			public string PartyKey { get; set; }
		}


		public async static Task<bool> ReadStoredSettings() {
			CreateSettingsFolder();

			if (!SettingsExist()) {
				return true;
			}
			string settingsJson = await File.ReadAllTextAsync($"{SettingsPath}/{SettingsFile}");
			PersistedSettings settings = JsonSerializer.Deserialize<PersistedSettings>(settingsJson);
			ServerUrl = settings.ServerUrl;
			PartyKey = settings.PartyKey;
			return true;
		}

		public async static void WriteSettigns() {
			CreateSettingsFolder();
			PersistedSettings settings = new PersistedSettings {
				ServerUrl = ServerUrl,
				PartyKey = PartyKey
			};
			await File.WriteAllTextAsync($"{SettingsPath}/{SettingsFile}",JsonSerializer.Serialize(settings));
		}

		private static void CreateSettingsFolder() {
			if (!Directory.Exists(SettingsPath)) {
				Directory.CreateDirectory(SettingsPath);
			}
		}

		private static bool SettingsExist() => File.Exists($"{SettingsPath}/{SettingsFile}");
	}
}
