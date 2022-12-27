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
	}

	public interface IPartyService {
		Party? GetPartyByKey(string partyKey);
	}
}
