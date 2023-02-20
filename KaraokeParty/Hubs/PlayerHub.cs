using KaraokeParty.ApiModels;
using KaraokeParty.Hubs.Clients;
using KaraokeParty.Services;
using Microsoft.AspNetCore.SignalR;

namespace KaraokeParty.Hubs
{
	public class PlayerHub : Hub<IPlayerClient>
	{
		private readonly IPartyService partyService;

		public PlayerHub(IPartyService partyService)
		{
			this.partyService = partyService;
		}

		public async Task JoinParty(string partyKey)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey);
		}

		public async Task LeaveParty(string partyKey)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey);
		}

		public async Task SendPosition(string partyKey, decimal position)
		{
			partyService.UpdateVideoPosition(partyKey, position);
			await Clients.OthersInGroup(partyKey).ReceivePosition(position);
		}

		public async Task SendVideoLength(string partyKey, int timeInMs)
		{
			partyService.UpdateVideoLength(partyKey, timeInMs);
			await Clients.OthersInGroup(partyKey).ReceiveVideoLength(timeInMs);
		}

		public async Task StartNewPerformance(string partyKey)
		{
			PerformanceDTO? dto = partyService.StartNextSong(partyKey);
			if (dto != null)
			{
				await Clients.Group(partyKey).ReceiveNewPerformanceStarted(dto);
			}
			else
			{
				await Clients.Group(partyKey).ReceiveEndOfQueue();
			}
		}

		public async Task StartPreviousPerformance(string partyKey)
		{
			PerformanceDTO? dto = partyService.StartPreviousSong(partyKey);
			if (dto != null)
			{
				await Clients.Group(partyKey).ReceivePreviousSong(dto);
			}
		}

		public async Task Pause(string partyKey)
		{
			await Clients.OthersInGroup(partyKey).ReceivePause();
		}

		public async Task Play(string partyKey)
		{
			await Clients.OthersInGroup(partyKey).ReceivePlay();
		}

		public async Task UpdateSettings(string partyKey, PlayerSettingsDTO settings)
		{
			partyService.SavePlayerSettings(partyKey, settings);
			await Clients.Group(partyKey).ReceivePlayerSettings(settings);
		}
	}
}
