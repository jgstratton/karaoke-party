namespace KaraokeParty.ApiModels {
	public class PerformanceRequestDTO {
		public int UserId { get; set; }
		public int? SingerId { get; set; }
		public string VideoId { get; set; } = "";
		public string SingerName { get; set; } = "";
		public Boolean CreateNewSinger { get; set; } = false;
	}
}
