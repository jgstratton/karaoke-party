﻿namespace KaraokeParty.ApiModels {
	public class PerformanceRequestDTO {
		public int UserId { get; set; }
		public string FileName { get; set; } = "";
		public string SingerName { get; set; } = "";
	}
}
