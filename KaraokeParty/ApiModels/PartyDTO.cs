﻿using KaraokeParty.DataStore;

namespace KaraokeParty.ApiModels {
	public class PartyDTO {
		public int PartyId { get; set; }
		public string Title { get; set; } = "";
		public string PartyKey { get; set; } = "";

		public PlayerDTO Player { get; set; }
		public List<PerformanceDTO> Performances { get; set; }
		public List<SingerDTO> Singers { get; set; }
		public PlayerSettingsDTO PlayerSettings { get; set; }

		public PartyDTO() {
			Player = new PlayerDTO();
			Performances = new List<PerformanceDTO>();
			Singers = new List<SingerDTO>();
			PlayerSettings = new PlayerSettingsDTO();
		}

		public static PartyDTO FromDb(Party party) {
			List<PerformanceDTO> performances = party.Queue
				.ToList()
				.Select(q => PerformanceDTO.FromDb(q))
				.ToList();

			PerformanceDTO? currentPerformance = performances.Where(p => p.Status == PerformanceStatus.Live).FirstOrDefault();

			List<SingerDTO> singers = party.Singers.Select(s => SingerDTO.FromDb(s)).ToList();

			return new PartyDTO {
				PartyId = party.PartyId,
				Title = party.Title,
				PartyKey = party.PartyKey,
				Player = new PlayerDTO {
					VideoLength = party.VideoLength,
					VideoPosition = party.VideoPosition,
					FileName = currentPerformance?.FileName ?? "",
					PlayerState = party.PlayerState,
					Title = currentPerformance?.SongTitle ?? ""
				},
				Performances = performances,
				Singers = singers,
				PlayerSettings = new PlayerSettingsDTO {
					MarqueeEnabled = party.MarqueeEnabled,
					MarqueeSize = party.MarqueeSize,
					MarqueeSpeed = party.MarqueeSpeed,
					MarqueeText = party.MarqueeText
				}
			};
		}
	}
}
