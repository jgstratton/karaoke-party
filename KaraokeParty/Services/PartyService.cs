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
					p.Sort_Order = lastCompleted++;
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
	}

	public interface IPartyService {
		Party? GetPartyByKey(string partyKey);
		PerformanceDTO? StartNextSong(string partyKey);
	}
}
