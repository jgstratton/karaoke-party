using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Hubs.Clients;
using KaraokeParty.Services;
using Microsoft.AspNetCore.SignalR;
using System;

namespace KaraokeParty.Hubs {
	public class PlayerHub : Hub<IPlayerClient> {
		private readonly KPContext context;
		private readonly IPartyService partyService;

		public PlayerHub(KPContext context, IPartyService partyService) {
			this.context = context;
			this.partyService = partyService;
		}

		public async Task JoinParty(ClientConnectionDetails clientDetails) {
			logAction(clientDetails, "JoinParty");
			await Groups.AddToGroupAsync(Context.ConnectionId, clientDetails.PartyKey + "USERS");
		}

		public async Task JoinAsDj(ClientConnectionDetails clientDetails) {
			logAction(clientDetails, "JoinAsDj");
			await Groups.AddToGroupAsync(Context.ConnectionId, clientDetails.PartyKey + "DJ");
		}

		public async Task JoinAsPlayer(ClientConnectionDetails clientDetails) {
			logAction(clientDetails, "JoinAsPlayer");
			await Groups.AddToGroupAsync(Context.ConnectionId, clientDetails.PartyKey + "PLAYER");
		}

		public async Task LeaveParty(ClientConnectionDetails clientDetails) {
			logAction(clientDetails, "LeaveParty");
			await LeaveGroups(clientDetails, Context.ConnectionId);
		}

		public async Task SendPosition(ClientConnectionDetails clientDetails, decimal position) {
			partyService.UpdateVideoPosition(clientDetails.PartyKey, position);
			await Clients.OthersInGroup(clientDetails.PartyKey + "DJ").ReceivePosition(position);
			await Clients.OthersInGroup(clientDetails.PartyKey + "USERS").ReceivePosition(position);
		}

		public async Task ChangePlayerPosition(ClientConnectionDetails clientDetails, decimal position) {
			logAction(clientDetails, "ChangePlayerPosition");
			partyService.UpdateVideoPosition(clientDetails.PartyKey, position);
			await Clients.Group(clientDetails.PartyKey + "PLAYER").ReceivePosition(position);
		}

		public async Task ChangeVolume(ClientConnectionDetails clientDetails, int volume) {
			logAction(clientDetails, "ChangePlayerVolume");
			partyService.UpdateVideoVolume(clientDetails.PartyKey, volume);
			await Clients.Group(clientDetails.PartyKey + "PLAYER").ReceiveVolume(volume);
			await Clients.OthersInGroup(clientDetails.PartyKey + "DJ").ReceiveVolume(volume);
		}

		public async Task SendVideoLength(ClientConnectionDetails clientDetails, int timeInMs) {
			logAction(clientDetails, "SendVideoLength");
			partyService.UpdateVideoLength(clientDetails.PartyKey, timeInMs);
			await Clients.OthersInGroup(clientDetails.PartyKey + "DJ").ReceiveVideoLength(timeInMs);
			await Clients.OthersInGroup(clientDetails.PartyKey + "USERS").ReceiveVideoLength(timeInMs);
		}

		public async Task MovePerformance(ClientConnectionDetails clientDetails, MovePerformanceDTO dto) {
			logAction(clientDetails, "MovePerformance");
			List<PerformanceDTO> performances = partyService.MovePerformance(clientDetails.PartyKey, dto);
			await Clients.Group(clientDetails.PartyKey + "DJ").ReceivePerformances(performances);
			await Clients.Group(clientDetails.PartyKey + "USERS").ReceivePerformances(performances);
		}

		public async Task NotifyNewRequest(ClientConnectionDetails clientDetails, PerformanceDTO dto) {
			logAction(clientDetails, "NotifyNewRequest");
			await Clients.Group(clientDetails.PartyKey + "DJ").ReceiveNewRequest(dto);
			await Clients.Group(clientDetails.PartyKey + "USERS").ReceiveNewRequest(dto);
		}

		public async Task NotifyDjChanges(ClientConnectionDetails clientDetails) {
			logAction(clientDetails, "NotifyDjChanges");
			await Clients.OthersInGroup(clientDetails.PartyKey + "DJ").ReceiveDjChanges();
		}

		public async Task StartNewPerformance(ClientConnectionDetails clientDetails) {
			logAction(clientDetails, "StartNewPerformance");
			PerformanceDTO? dto = partyService.StartNextSong(clientDetails.PartyKey);
			if (dto != null) {
				await Clients.Group(clientDetails.PartyKey + "DJ").ReceiveNewPerformanceStarted(dto);
				await Clients.Group(clientDetails.PartyKey + "USERS").ReceiveNewPerformanceStarted(dto);
				await Clients.Group(clientDetails.PartyKey + "PLAYER").ReceiveNewPerformanceStarted(dto);
			} else {
				await Clients.Group(clientDetails.PartyKey + "DJ").ReceiveEndOfQueue();
				await Clients.Group(clientDetails.PartyKey + "USERS").ReceiveEndOfQueue();
				await Clients.Group(clientDetails.PartyKey + "PLAYER").ReceiveEndOfQueue();
			}
		}

		public async Task StartPreviousPerformance(ClientConnectionDetails clientDetails) {
			logAction(clientDetails, "StartPreviousPerformance");
			PerformanceDTO? dto = partyService.StartPreviousSong(clientDetails.PartyKey);
			if (dto != null) {
				await Clients.Group(clientDetails.PartyKey + "DJ").ReceivePreviousSong(dto);
				await Clients.Group(clientDetails.PartyKey + "USERS").ReceivePreviousSong(dto);
				await Clients.Group(clientDetails.PartyKey + "PLAYER").ReceivePreviousSong(dto);
			}
		}

		public async Task Pause(ClientConnectionDetails clientDetails) {
			logAction(clientDetails, "Pause");
			partyService.Pause(clientDetails.PartyKey);
			await Clients.OthersInGroup(clientDetails.PartyKey + "DJ").ReceivePause();
			await Clients.OthersInGroup(clientDetails.PartyKey + "USERS").ReceivePause();
			await Clients.OthersInGroup(clientDetails.PartyKey + "PLAYER").ReceivePause();
		}

		public async Task Play(ClientConnectionDetails clientDetails) {
			logAction(clientDetails, "Play");
			partyService.Play(clientDetails.PartyKey);
			await Clients.OthersInGroup(clientDetails.PartyKey + "DJ").ReceivePlay();
			await Clients.OthersInGroup(clientDetails.PartyKey + "USERS").ReceivePlay();
			await Clients.OthersInGroup(clientDetails.PartyKey + "PLAYER").ReceivePlay();
		}

		public async Task UpdateSettings(ClientConnectionDetails clientDetails, ConfigurableSettingsDTO settings) {
			logAction(clientDetails, "UpdateSettings");
			partyService.SavePlayerSettings(clientDetails.PartyKey, settings);
			await Clients.Group(clientDetails.PartyKey + "DJ").ReceivePlayerSettings(settings);
			await Clients.Group(clientDetails.PartyKey + "USERS").ReceivePlayerSettings(settings);
			await Clients.Group(clientDetails.PartyKey + "PLAYER").ReceivePlayerSettings(settings);
		}

		public async Task LeaveGroups(ClientConnectionDetails clientDetails, string connectionId) {
			logAction(clientDetails, "LeaveGroups");
			context.SaveChanges();
			foreach (var group in new List<string> { "USER", "DJ", "PLAYER" }) {
				try {
					await Groups.RemoveFromGroupAsync(connectionId, clientDetails.PartyKey + group);
				} catch {
					// do nothing, this is test code
				}
			}
		}

		private void logAction(ClientConnectionDetails clientDetails, string action) {
			context.ConnectionLog.Add(new ConnectionLog {
				ConnectionId = Context.ConnectionId,
				PartyKey = clientDetails.PartyKey,
				Action = action,
				DeviceId = clientDetails.DeviceId,
				BrowserDetails = $"{clientDetails.BrowserName} {clientDetails.BrowserVersion} {clientDetails.OS}"
			});
			context.SaveChanges();
		}
	}
}
