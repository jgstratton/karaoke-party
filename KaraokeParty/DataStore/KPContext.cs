using Microsoft.EntityFrameworkCore;

namespace KaraokeParty.DataStore {
	public class KPContext : DbContext {
		public DbSet<Party> Parties { get; set; } = null!;
		public DbSet<Singer> Singers { get; set; } = null!;

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
			optionsBuilder.UseNpgsql("Host=localhost;Database=KaraokeParty;Username=admin;Password=password");
			base.OnConfiguring(optionsBuilder);
		}

		protected override void OnModelCreating(ModelBuilder builder) {
			builder.ApplyUtcDateTimeConverter();
		}
	}
}