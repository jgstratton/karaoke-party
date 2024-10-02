using KaraokeParty.ApiModels;

namespace KaraokeParty.Hubs.Clients {
	public interface IPlayerClient {
		Task ReceivePosition(decimal position);
		Task ReceiveVolume(int volume);
		Task ReceiveVideoLength(int timeInMs);
		Task ReceivePreviousSong(PerformanceDTO performance);
		Task ReceivePause();
		Task ReceivePlay();
		Task ReceiveNewPerformanceStarted(PerformanceDTO performance);
		Task ReceiveEndOfQueue();
		Task ReceivePlayerSettings(ConfigurableSettingsDTO settings);
		Task ReceivePerformances(List<PerformanceDTO> performances);
		Task ReceiveNewRequest(PerformanceDTO dto);
		Task ReceiveDjChanges();
	}
}
