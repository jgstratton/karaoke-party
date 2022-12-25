using Microsoft.EntityFrameworkCore;

namespace KaraokeParty.DataStore {
	public class KPContext : DbContext {
		public DbSet<Party> Parties { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
			optionsBuilder.UseSqlite($"DataSource=./db/KPDatabase.sqlite");
			base.OnConfiguring(optionsBuilder);
		}
	}
}