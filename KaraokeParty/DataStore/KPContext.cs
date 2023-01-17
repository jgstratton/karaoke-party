using Microsoft.EntityFrameworkCore;

namespace KaraokeParty.DataStore {
	public class KPContext : DbContext {
		public DbSet<Party> Parties { get; set; } = null!;
		public DbSet<Singer> Singers { get; set; } = null!;
		public DbSet<Song> Songs { get; set; } = null!;
		public DbSet<Performance> Performances { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
			optionsBuilder.UseNpgsql("Host=localhost;Database=KaraokeParty;Username=admin;Password=password")
				.UseSnakeCaseNamingConvention();
			base.OnConfiguring(optionsBuilder);
		}

		protected override void OnModelCreating(ModelBuilder builder) {
			builder.ApplyUtcDateTimeConverter();
		}
	}
}