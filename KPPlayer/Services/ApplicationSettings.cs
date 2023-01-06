using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace KPPlayer.Services {
	internal class ApplicationSettings {
		private readonly static string SettingsPath = $"{AppDomain.CurrentDomain.BaseDirectory}/data/";
		private readonly static string SettingsFile = $"ApplicationSettings.json";
		public string ServerUrl { get; set; }
		public string PartyKey { get; set; }
		
		public async static Task<ApplicationSettings> ReadStoredSettings() {
			CreateSettingsFolder();

			if (!SettingsExist()) {
				return new ApplicationSettings();
			}
			string settingsJson = await File.ReadAllTextAsync($"{SettingsPath}/{SettingsFile}");
			return JsonSerializer.Deserialize<ApplicationSettings>(settingsJson);
		}

		public async void WriteSettigns() {
			CreateSettingsFolder();
			await File.WriteAllTextAsync($"{SettingsPath}/{SettingsFile}",JsonSerializer.Serialize(this));
		}

		private static void CreateSettingsFolder() {
			if (!Directory.Exists(SettingsPath)) {
				Directory.CreateDirectory(SettingsPath);
			}
		}

		private static bool SettingsExist() => File.Exists($"{SettingsPath}/{SettingsFile}");
	}
}
