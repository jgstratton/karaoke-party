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

		public async Task JoinParty(string partyKey) {
			logAction(partyKey, "JoinParty");
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey + "USERS");
		}

		public async Task JoinAsDj(string partyKey) {
			logAction(partyKey, "JoinAsDj");
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey + "DJ");
		}

		public async Task JoinAsPlayer(string partyKey) {
			logAction(partyKey, "JoinAsPlayer");
			await Groups.AddToGroupAsync(Context.ConnectionId, partyKey + "PLAYER");
		}

		public async Task LeaveParty(string partyKey) {
			logAction(partyKey, "LeaveParty");
			foreach (var group in new List<string> { "USER", "DJ", "PLAYER" }) {
				await LeaveGroups(partyKey + group, Context.ConnectionId);
			}
		}

		public async Task SendPosition(string partyKey, decimal position) {
			partyService.UpdateVideoPosition(partyKey, position);
			await Clients.OthersInGroup(partyKey + "DJ").ReceivePosition(position);
			await Clients.OthersInGroup(partyKey + "USERS").ReceivePosition(position);
		}

		public async Task ChangePlayerPosition(string partyKey, decimal position) {
			logAction(partyKey, "ChangePlayerPosition");
			partyService.UpdateVideoPosition(partyKey, position);
			await Clients.Group(partyKey + "PLAYER").ReceivePosition(position);
		}

		public async Task SendVideoLength(string partyKey, int timeInMs) {
			logAction(partyKey, "SendVideoLength");
			partyService.UpdateVideoLength(partyKey, timeInMs);
			await Clients.OthersInGroup(partyKey + "DJ").ReceiveVideoLength(timeInMs);
			await Clients.OthersInGroup(partyKey + "USERS").ReceiveVideoLength(timeInMs);
		}

		public async Task MovePerformance(string partyKey, MovePerformanceDTO dto) {
			logAction(partyKey, "MovePerformance");
			List<PerformanceDTO> performances = partyService.MovePerformance(partyKey, dto);
			await Clients.Group(partyKey + "DJ").ReceivePerformances(performances);
			await Clients.Group(partyKey + "USERS").ReceivePerformances(performances);
		}

		public async Task NotifyNewRequest(string partyKey, PerformanceDTO dto) {
			logAction(partyKey, "NotifyNewRequest");
			await Clients.Group(partyKey + "DJ").ReceiveNewRequest(dto);
			await Clients.Group(partyKey + "USERS").ReceiveNewRequest(dto);
		}

		public async Task NotifyDjChanges(string partyKey) {
			logAction(partyKey, "NotifyDjChanges");
			await Clients.OthersInGroup(partyKey + "DJ").ReceiveDjChanges();
		}

		public async Task StartNewPerformance(string partyKey) {
			logAction(partyKey, "StartNewPerformance");
			PerformanceDTO? dto = partyService.StartNextSong(partyKey);
			if (dto != null) {
				await Clients.Group(partyKey + "DJ").ReceiveNewPerformanceStarted(dto);
				await Clients.Group(partyKey + "USERS").ReceiveNewPerformanceStarted(dto);
				await Clients.Group(partyKey + "PLAYER").ReceiveNewPerformanceStarted(dto);
			} else {
				await Clients.Group(partyKey + "DJ").ReceiveEndOfQueue();
				await Clients.Group(partyKey + "USERS").ReceiveEndOfQueue();
				await Clients.Group(partyKey + "PLAYER").ReceiveEndOfQueue();
			}
		}

		public async Task StartPreviousPerformance(string partyKey) {
			logAction(partyKey, "StartPreviousPerformance");
			PerformanceDTO? dto = partyService.StartPreviousSong(partyKey);
			if (dto != null) {
				await Clients.Group(partyKey + "DJ").ReceivePreviousSong(dto);
				await Clients.Group(partyKey + "USERS").ReceivePreviousSong(dto);
				await Clients.Group(partyKey + "PLAYER").ReceivePreviousSong(dto);
			}
		}

		public async Task Pause(string partyKey) {
			logAction(partyKey, "Pause");
			partyService.Pause(partyKey);
			await Clients.OthersInGroup(partyKey + "DJ").ReceivePause();
			await Clients.OthersInGroup(partyKey + "USERS").ReceivePause();
			await Clients.OthersInGroup(partyKey + "PLAYER").ReceivePause();
		}

		public async Task Play(string partyKey) {
			logAction(partyKey, "Play");
			partyService.Play(partyKey);
			await Clients.OthersInGroup(partyKey + "DJ").ReceivePlay();
			await Clients.OthersInGroup(partyKey + "USERS").ReceivePlay();
			await Clients.OthersInGroup(partyKey + "PLAYER").ReceivePlay();
		}

		public async Task UpdateSettings(string partyKey, PlayerSettingsDTO settings) {
			logAction(partyKey, "UpdateSettings");
			partyService.SavePlayerSettings(partyKey, settings);
			await Clients.Group(partyKey + "DJ").ReceivePlayerSettings(settings);
			await Clients.Group(partyKey + "USERS").ReceivePlayerSettings(settings);
			await Clients.Group(partyKey + "PLAYER").ReceivePlayerSettings(settings);
		}

		public async Task LeaveGroups(string partyKey, string connectionId) {
			context.ConnectionLog.Add(new ConnectionLog {
				ConnectionId = connectionId,
				PartyKey = partyKey,
				Action = "DisconnectConnections",
				IP = ""
			});
			context.SaveChanges();
			foreach (var group in new List<string> { "USER", "DJ", "PLAYER" }) {
				try {
					await Groups.RemoveFromGroupAsync(connectionId, partyKey + group);
				} catch {
					// do nothing, this is test code
				}
			}
		}

		private void logAction(string partyKey, string action) {
			context.ConnectionLog.Add(new ConnectionLog {
				ConnectionId = Context.ConnectionId,
				PartyKey = partyKey,
				Action = action,
				IP = Context.GetHttpContext()?.Connection.RemoteIpAddress?.ToString() ?? ""
			});
			context.SaveChanges();
		}
	}
}
