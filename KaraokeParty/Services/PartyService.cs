using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.EntityFrameworkCore;

namespace KaraokeParty.Services {
	public class PartyService : IPartyService {
		private readonly KPContext context;

		public PartyService(KPContext context) {
			this.context = context;
		}

		public Party? GetPartyByKey(string partyKey) {
			return context.Parties
				.Where(p => !p.IsExpired && p.PartyKey == partyKey)
				.OrderByDescending(p => p.DateTimeCreated)
				.FirstOrDefault();
		}

		public PerformanceDTO? StartNextSong(string partyKey) {
			Party? party = GetPartyByKey(partyKey);
			if (party == null) {
				return null;
			}
			int lastCompleted = party.Queue.Where(p => p.Status == PerformanceStatus.Completed).Max(p => p.Sort_Order) ?? 0;
			party.Queue
				.Where(p => p.Status == PerformanceStatus.Live)
				.ToList()
				.ForEach(p => {
					p.Status = PerformanceStatus.Completed;
					p.Sort_Order = ++lastCompleted;
				});

			Performance? nextPerformance = party.Queue
				.Where(q => q.Status == PerformanceStatus.Queued)
				.OrderBy(p => p.Sort_Order).FirstOrDefault();

			PerformanceDTO? dto = null;
			if (nextPerformance != null) {
				nextPerformance.Status = PerformanceStatus.Live;
				dto = PerformanceDTO.FromDb(nextPerformance);
			}
			context.SaveChanges();
			return dto;
		}

		public PerformanceDTO? StartPreviousSong(string partyKey) {
			Party? party = GetPartyByKey(partyKey);
			if (party == null) {
				return null;
			}

			List<Performance> allCompletedDb = party.Queue.Where(p => p.Status == PerformanceStatus.Completed).ToList();
			Performance? lastCompleted = allCompletedDb
				.Where(p => p.Sort_Order == allCompletedDb.Max(p => p.Sort_Order))
				.FirstOrDefault();

			if (lastCompleted is null) {
				return null;
			}
			int minQueuedIndex = party.Queue.Where(p => p.Status == PerformanceStatus.Queued).Min(p => p.Sort_Order) ?? 0;

			party.Queue.Where(p => p.Status == PerformanceStatus.Live)
				.ToList().
				ForEach(p => {
					p.Status = PerformanceStatus.Queued;
					p.Sort_Order = --minQueuedIndex;
				});

			lastCompleted.Status = PerformanceStatus.Live;
			context.SaveChanges();
			return PerformanceDTO.FromDb(lastCompleted);
		}

		public void UpdateVideoLength(string partyKey, int timeInMs) {
			Party? party = GetPartyByKey(partyKey);
			if (party == null) {
				return;
			}
			party.VideoLength = timeInMs;
			context.SaveChanges();
		}

		public void UpdateVideoPosition(string partyKey, decimal position) {
			Party? party = GetPartyByKey(partyKey);
			if (party == null) {
				return;
			}
			party.VideoPosition = position;
			context.SaveChanges();
		}

		public void SavePlayerSettings(string partyKey, PlayerSettingsDTO settings) {
			Party? party = GetPartyByKey(partyKey);
			if (party == null) {
				return;
			}
			party.MarqueeSize = settings.MarqueeSize;
			party.MarqueeText = settings.MarqueeText;
			party.MarqueeEnabled = settings.MarqueeEnabled;
			party.MarqueeSpeed = settings.MarqueeSpeed;
			context.SaveChanges();
		}

		public void ApllyDefaultPlayerSettings(Party party) {
			party.MarqueeSize = 30;
			party.MarqueeText = "Visit %Url% and use code %code% to put in your requests";
			party.MarqueeEnabled = false;
			party.MarqueeSpeed = 40;
		}

		public List<PerformanceDTO> MovePerformance(string partyKey, MovePerformanceDTO dto) {
			Party? party = GetPartyByKey(partyKey);
			if (party == null) {
				throw new Exception($"Unable to find party with key: {partyKey}");
			}
			int targetRow = dto.TargetIndex + 1;
			// increase the order by value of all records after the target index
			context.Database.ExecuteSql($@"
					WITH cte AS (
						SELECT performance_id as id, row_number() OVER (ORDER BY sort_order) as row_num
						FROM performances
						WHERE performances.party_id = {party.PartyId}
							and status = {(int)dto.TargetStatus}
							and performance_id != {dto.PerformanceId}
						UNION
						SELECT performance_id as id, 0 as row_num
						FROM performances
						WHERE performance_id = {dto.PerformanceId}
					)
					UPDATE performances 
					SET sort_order =
						CASE
							WHEN performance_id = {dto.PerformanceId} THEN {targetRow}
							WHEN cte.row_num < {targetRow} THEN cte.row_num
							WHEN cte.row_num >= {targetRow} THEN cte.row_num + 1
							ELSE 999
						END,
						status = {(int)dto.TargetStatus}
					FROM cte
					WHERE performances.performance_id = cte.id
				"
			);
			return party.Queue.Select(p => PerformanceDTO.FromDb(p)).ToList();
		}

		public void Pause (string partyKey) {
			Party? party = GetPartyByKey(partyKey);
			if (party == null) {
				throw new Exception($"Unable to find party with key: {partyKey}");
			}
			party.PlayerState = PlayerState.Paused;
			context.SaveChanges();
		}

		public void Play(string partyKey) {
			Party? party = GetPartyByKey(partyKey);
			if (party == null) {
				throw new Exception($"Unable to find party with key: {partyKey}");
			}
			party.PlayerState = PlayerState.Playing;
			context.SaveChanges();
		}
	}

	public interface IPartyService {
		void ApllyDefaultPlayerSettings(Party party);
		Party? GetPartyByKey(string partyKey);
		List<PerformanceDTO> MovePerformance(string partyKey, MovePerformanceDTO dto);
		void Pause(string partyKey);
		void Play(string partyKey);
		void SavePlayerSettings(string partyKey, PlayerSettingsDTO settings);
		PerformanceDTO? StartNextSong(string partyKey);
		PerformanceDTO? StartPreviousSong(string partyKey);
		void UpdateVideoLength(string partyKey, int timeInMs);
		void UpdateVideoPosition(string partyKey, decimal position);
	}
}
