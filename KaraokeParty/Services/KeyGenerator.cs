namespace KaraokeParty.Services {
	public static class KeyGenerator {
		static readonly Random rd = new Random();

		public static string CreateAlphaKey(int length) {
			const string allowedChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
			char[] chars = new char[length];

			for (int i = 0; i < length; i++) {
				chars[i] = allowedChars[rd.Next(0, allowedChars.Length)];
			}

			return new string(chars);
		}
	}
}
