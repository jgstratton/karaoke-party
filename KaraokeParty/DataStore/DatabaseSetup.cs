using Microsoft.EntityFrameworkCore;

namespace KaraokeParty.DataStore {
	public static class DatabaseSetup {

		/// <summary>
		/// Database will be recreated on application start
		/// </summary>
		public static void InitializeSampleDatabase() {

			using (var dbContext = new KPContext()) {
				if (!dbContext.Parties.Any()) {
					dbContext.Parties.AddRange(new Party[]
					{
						new Party{
							Title="Family Game Night",
							DJKey="EFGH",
							PartyKey="ABCD"
						},
						new Party{
							Title="Smith's Karaoke Night",
							DJKey="IJKL",
							PartyKey="EFGH"
						}
					});
					dbContext.SaveChanges();
				}
				foreach (var party in dbContext.Parties) {
					Console.WriteLine(party.ToString());
				}
			}
		}
	}
}
