using KaraokeParty.ApiModels;

namespace KaraokeParty.Hubs.Clients {
	public interface IPlayerClient {
		Task ReceivePosition(decimal position);
		Task ReceiveVideoLength(int timeInMs);
		Task ReceiveCurrentPerformance(PerformanceDTO performance);
	}
}
