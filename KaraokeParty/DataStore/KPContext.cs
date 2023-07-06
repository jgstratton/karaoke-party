using Microsoft.EntityFrameworkCore;

namespace KaraokeParty.DataStore {
	public class KPContext : DbContext {
		private IConfiguration configuration;

		public DbSet<Party> Parties { get; set; } = null!;
		public DbSet<User> Users { get; set; } = null!;
		public DbSet<Song> Songs { get; set; } = null!;
		public DbSet<Performance> Performances { get; set; }
		public DbSet<Singer> Singers { get; set; } = null!;
		public DbSet<Dj> Djs { get; set; } = null!;

		public KPContext(IConfiguration iConfig) {
			configuration = iConfig;
		}
		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
			string dbConfigString = configuration.GetSection("DBConnectionString").Value ?? "";
			optionsBuilder.UseNpgsql(dbConfigString)
				.UseSnakeCaseNamingConvention()
				.UseLazyLoadingProxies();
			base.OnConfiguring(optionsBuilder);
		}

		protected override void OnModelCreating(ModelBuilder builder) {
			builder.ApplyUtcDateTimeConverter();
		}
	}
}