using KaraokeParty.ApiModels;
using KaraokeParty.Hubs.Clients;
using KaraokeParty.Services;
using Microsoft.AspNetCore.SignalR;

namespace KaraokeParty.Hubs {
	public class PlayerHub : Hub<IPlayerClient> {
		private readonly IPartyService partyService;

		public PlayerHub(IPartyService partyService) {
			this.partyService = partyService;
		}

		public async Task JoinParty(string partyKey) {
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey);
		}

		public async Task LeaveParty(string partyKey) {
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey);
		}

		public async Task SendPosition(decimal position) {
			await Clients.Others.ReceivePosition(position);
		}

		public async Task StartNewPerformance(string partyKey) {
			PerformanceDTO? dto = partyService.StartNextSong(partyKey);
			if (dto != null) {
				await Clients.All.ReceiveNewPerformanceStarted(dto);
			} else {
				await Clients.All.ReceiveEndOfQueue();
			}
		}

		public async Task StartPreviousPerformance(string partyKey) {
			PerformanceDTO? dto = partyService.StartPreviousSong(partyKey);
			if (dto != null) {
				await Clients.All.ReceivePreviousSong(dto);
			}
		}

		public async Task SendVideoLength(int timeInMs) {
			await Clients.Others.ReceiveVideoLength(timeInMs);
		}

		public async Task SendCurrentPerformance(PerformanceDTO performance) {
			await Clients.All.ReceiveCurrentPerformance(performance);
		}

		public async Task Pause() {
			await Clients.Others.ReceivePause();
		}

		public async Task Play() {
			await Clients.Others.ReceivePlay();
		}
	}
}
