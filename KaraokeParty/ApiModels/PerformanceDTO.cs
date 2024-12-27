using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class PerformanceDTO {
		public int? PerformanceId { get; set; }
		public int? UserId { get; set; }
		public int? SingerId { get; set; }
		public string? UserName { get; set; }
		public string? SingerName { get; set; }
		public string? VideoId { get; set; }
		public string? SongTitle { get; set; }
		public string? Url { get; set; }

		public PerformanceStatus Status { get; set; }
		public int? SortOrder { get; set; }
		public int? CompletedOrder { get; set; }

		public void UpdateDb(KPContext context, Performance performance) {
			if (performance.User is null) {
				throw new Exception("Missing user.");
			}

			if (performance.User.UserId != UserId || performance.User.Name != UserName) {
				throw new Exception($"Changing user is not supported");
			}

			if (VideoId != null && VideoId != performance.Song?.VideoId) {
				var newSong = context.Songs.Find(VideoId);
				if (newSong is null) {
					throw new Exception($"Song not found");
				} else {
					performance.Song = newSong;
				}
			}

			Singer? newSinger = context.Singers.Where(s => s.SingerId == SingerId).FirstOrDefault();
			if (newSinger != null) {
				performance.Singer = newSinger;
			}

			performance.Status = Status;
			performance.SingerName = SingerName ?? "";
			performance.CompletedOrder = CompletedOrder;

			if (SortOrder != null) {
				performance.SortOrder = SortOrder;
			}
		}

		public static PerformanceDTO FromDb(Performance performance) {
			return new PerformanceDTO {
				PerformanceId = performance.PerformanceID,
				SingerId = performance.Singer?.SingerId,
				VideoId = performance.Song?.VideoId,
				UserId = performance.User?.UserId,
				UserName = performance.User?.Name,
				SingerName = performance.SingerName,
				SortOrder = performance.SortOrder,
				CompletedOrder = performance.CompletedOrder,
				Status = performance.Status,
				SongTitle = performance.Song?.Title,
				Url = performance.Song?.Url
			};
		}
	}
}
