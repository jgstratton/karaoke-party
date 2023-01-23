using KaraokeParty.ApiModels;
using KaraokeParty.Hubs.Clients;
using Microsoft.AspNetCore.SignalR;

namespace KaraokeParty.Hubs {
	public class PlayerHub : Hub<IPlayerClient> {
		public async Task SendPosition(decimal position) {
			await Clients.Others.ReceivePosition(position);
		}

		public async Task SendVideoLength(int timeInMs) {
			await Clients.Others.ReceiveVideoLength(timeInMs);
		}

		public async Task SendCurrentPerformance(PerformanceDTO performance) {
			await Clients.All.ReceiveCurrentPerformance(performance);
		}
	}
}
