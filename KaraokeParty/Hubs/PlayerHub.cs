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
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey + "USERS");
		}

		public async Task JoinAsDj(string partyKey)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey + "DJ");
		}

		public async Task JoinAsPlayer(string partyKey)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey + "PLAYER");
		}

		public async Task LeaveParty(string partyKey)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey);
		}

		public async Task SendPosition(string partyKey, decimal position)
		{
			partyService.UpdateVideoPosition(partyKey, position);
			await Clients.OthersInGroup(partyKey + "DJ").ReceivePosition(position);
			await Clients.OthersInGroup(partyKey + "USERS").ReceivePosition(position);
		}

		public async Task ChangePlayerPosition(string partyKey, decimal position) {
			partyService.UpdateVideoPosition(partyKey, position);
			await Clients.Group(partyKey + "PLAYER").ReceivePosition(position);
		}

		public async Task SendVideoLength(string partyKey, int timeInMs)
		{
			partyService.UpdateVideoLength(partyKey, timeInMs);
			await Clients.OthersInGroup(partyKey + "DJ").ReceiveVideoLength(timeInMs);
			await Clients.OthersInGroup(partyKey + "USERS").ReceiveVideoLength(timeInMs);
		}

		public async Task MovePerformance(string partyKey, MovePerformanceDTO dto)
		{
			List<PerformanceDTO> performances = partyService.MovePerformance(partyKey, dto);
			await Clients.Group(partyKey + "DJ").ReceivePerformances(performances);
			await Clients.Group(partyKey + "USERS").ReceivePerformances(performances);
		}

		public async Task NotifyNewRequest(string partyKey, PerformanceDTO dto)
		{
			await Clients.Group(partyKey + "DJ").ReceiveNewRequest(dto);
			await Clients.Group(partyKey + "USERS").ReceiveNewRequest(dto);
		}

		public async Task NotifyDjChanges(string partyKey)
		{
			await Clients.OthersInGroup(partyKey + "DJ").ReceiveDjChanges();
		}

		public async Task StartNewPerformance(string partyKey)
		{
			PerformanceDTO? dto = partyService.StartNextSong(partyKey);
			if (dto != null)
			{
				await Clients.Group(partyKey + "DJ").ReceiveNewPerformanceStarted(dto);
				await Clients.Group(partyKey + "USERS").ReceiveNewPerformanceStarted(dto);
				await Clients.Group(partyKey + "PLAYER").ReceiveNewPerformanceStarted(dto);
			}
			else
			{
				await Clients.Group(partyKey + "DJ").ReceiveEndOfQueue();
				await Clients.Group(partyKey + "USERS").ReceiveEndOfQueue();
				await Clients.Group(partyKey + "PLAYER").ReceiveEndOfQueue();
			}
		}

		public async Task StartPreviousPerformance(string partyKey)
		{
			PerformanceDTO? dto = partyService.StartPreviousSong(partyKey);
			if (dto != null)
			{
				await Clients.Group(partyKey + "DJ").ReceivePreviousSong(dto);
				await Clients.Group(partyKey + "USERS").ReceivePreviousSong(dto);
				await Clients.Group(partyKey + "PLAYER").ReceivePreviousSong(dto);
			}
		}

		public async Task Pause(string partyKey)
		{
			partyService.Pause(partyKey);
			await Clients.OthersInGroup(partyKey + "DJ").ReceivePause();
			await Clients.OthersInGroup(partyKey + "USERS").ReceivePause();
			await Clients.OthersInGroup(partyKey + "PLAYER").ReceivePause();
		}

		public async Task Play(string partyKey)
		{
			partyService.Play(partyKey);
			await Clients.OthersInGroup(partyKey + "DJ").ReceivePlay();
			await Clients.OthersInGroup(partyKey + "USERS").ReceivePlay();
			await Clients.OthersInGroup(partyKey + "PLAYER").ReceivePlay();
		}

		public async Task UpdateSettings(string partyKey, PlayerSettingsDTO settings)
		{
			partyService.SavePlayerSettings(partyKey, settings);
			await Clients.Group(partyKey + "DJ").ReceivePlayerSettings(settings);
			await Clients.Group(partyKey + "USERS").ReceivePlayerSettings(settings);
			await Clients.Group(partyKey + "PLAYER").ReceivePlayerSettings(settings);
		}
	}
}
