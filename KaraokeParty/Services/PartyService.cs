using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;

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
	}

	public interface IPartyService {
		Party? GetPartyByKey(string partyKey);
		PerformanceDTO? StartNextSong(string partyKey);
		PerformanceDTO? StartPreviousSong(string partyKey);
		void UpdateVideoLength(string partyKey, int timeInMs);
		void UpdateVideoPosition(string partyKey, decimal position);
	}
}
