namespace KaraokeParty.ApiModels {
	public static class ServerSettingsStaticProvider {
		public static string OpenAILambdaEndpoint { get; set; } = String.Empty;
		public static ServerSettings GetServerSettings() {
			return new ServerSettings {
				OpenAILambdaEndpoint = OpenAILambdaEndpoint
			};
		}
	}

	public class ServerSettings {
		public string OpenAILambdaEndpoint { get; set; } = String.Empty;
	}
}