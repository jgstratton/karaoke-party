using KaraokeParty.ApiModels;

namespace KaraokeParty.Hubs.Clients
{
	public interface IPlayerClient
	{
		Task ReceivePosition(decimal position);
		Task ReceiveVideoLength(int timeInMs);
		Task ReceivePreviousSong(PerformanceDTO performance);
		Task ReceivePause();
		Task ReceivePlay();
		Task ReceiveNewPerformanceStarted(PerformanceDTO performance);
		Task ReceiveEndOfQueue();
		Task ReceivePlayerSettings(PlayerSettingsDTO settings);
	}
}
