import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { setPosition, setLength } from '../slices/playerSlice';
import { populatePerformances, addPerformance } from '../slices/performancesSlice';
import { populatePlayer, pause, play } from '../slices/playerSlice';
import { populateSettings } from '../slices/playerSlice';
import { populateSingers } from '../slices/singerSlice';

import PartyApi from '../api/PartyApi';
import { AnyAction, Middleware } from 'redux';
import { markAsStale, reset } from '../slices/partySlice';
import StorageService from '../services/StorageService';
import { LoadParty } from '../mediators/PartyMediator';

const messageQueue: { (): void }[] = [];

const connection = new HubConnectionBuilder().withUrl('/hubs/player').build();
const retryIntervals = [1, 2, 3, 5, 5, 5, 10, 10, 10];
let currentTry = -1;

const signalRMiddleware: Middleware = (store) => {
	const startSignalRConnection = (_connection: HubConnection) => {
		_connection
			.start()
			.then(async () => {
				console.info('SignalR Connected');
				while (messageQueue.length > 0) {
					console.log(`Getting caught up on ${messageQueue.length} signalR messages.`);
					const messageSender = messageQueue.shift();
					if (messageSender) {
						messageSender();
					}
				}
				// auto rejoin
				const party = await StorageService.loadParty();
				if ((party?.partyKey ?? '').length === 0) {
					store.dispatch(reset());
					return;
				}
				const isDj = StorageService.loadDjFlag();
				let joinType = isDj ? 'JoinAsDj' : 'JoinParty';
				if (window.location.pathname.toLowerCase().includes('player')) {
					joinType = 'JoinAsPlayer';
				}
				console.log('Joining party:', joinType);
				queueMessageSender(() => connection.invoke(joinType, party?.partyKey));
				if (joinType !== 'JoinAsPlayer' || !store.getState().party.isLoaded) {
					LoadParty();
				}
				currentTry = -1;
			})
			.catch((err) => {
				currentTry++;
				console.error('SignalR Connection Error: ', err);
				if (currentTry < retryIntervals.length) {
					console.log('Connection attempt:', currentTry + 1);
					setTimeout(() => startSignalRConnection(connection), retryIntervals[currentTry] * 1000);
				}
			});
	};
	connection.onclose(() => {
		console.log('SignalR Connection Closed - Starting new connection');
		startSignalRConnection(connection);
	});

	startSignalRConnection(connection);
	const signalActionCreator = function (action: AnyAction) {
		action.signalR = true;
		console.log('SignalR action dispatched', action);
		return action;
	};

	connection.on('ReceivePosition', (value) => {
		console.log('ReceivePosition');
		store.dispatch(signalActionCreator(setPosition(value)));
	});

	connection.on('ReceiveVideoLength', (valueInMs) => {
		console.log('ReceiveVideoLength');
		store.dispatch(signalActionCreator(setLength(valueInMs)));
	});

	connection.on('ReceiveNewPerformanceStarted', async (value) => {
		console.log('ReceiveNewPerformanceStarted');
		const curParty = await PartyApi.fetchPartyOrThrow(store.getState().party.partyKey);
		let player = curParty.player;
		player.showSplash = true;
		player.videoPosition = 0;
		store.dispatch(signalActionCreator(populatePerformances(curParty.performances)));
		store.dispatch(signalActionCreator(populateSingers(curParty.singers)));
		store.dispatch(signalActionCreator(populatePlayer(player)));
	});

	connection.on('ReceivePreviousSong', async (value) => {
		console.log('ReceivePreviousSong');
		const curParty = await PartyApi.fetchPartyOrThrow(store.getState().party.partyKey);
		let player = curParty.player;
		player.showSplash = true;
		player.videoPosition = 0;
		store.dispatch(signalActionCreator(populatePerformances(curParty.performances)));
		store.dispatch(signalActionCreator(populateSingers(curParty.singers)));
		store.dispatch(signalActionCreator(populatePlayer(player)));
	});

	connection.on('ReceivePause', async () => {
		console.log('ReceivePause');
		store.dispatch(signalActionCreator(pause()));
	});

	connection.on('ReceivePlay', async () => {
		console.log('ReceivePlay');
		store.dispatch(signalActionCreator(play()));
	});

	connection.on('ReceivePlayerSettings', async (playerSettings) => {
		console.log('ReceivePlayerSettings');
		store.dispatch(signalActionCreator(populateSettings(playerSettings)));
	});

	connection.on('ReceivePerformances', async (performances) => {
		console.log('ReceivePerformances');
		store.dispatch(signalActionCreator(populatePerformances(performances)));
	});

	connection.on('ReceiveNewRequest', async (performance) => {
		console.log('ReceiveNewRequest');
		store.dispatch(signalActionCreator(addPerformance(performance)));
	});

	connection.on('ReceiveDjChanges', async (performance) => {
		console.log('ReceiveDjChanges');
		store.dispatch(signalActionCreator(markAsStale()));
	});

	const queueMessageSender = (sendMessage: { (): void }) => {
		// hub is connected and nothing queued? then just run the method
		if (messageQueue.length === 0 && connection.state === HubConnectionState.Connected) {
			sendMessage();
			return;
		}

		// otherwise, queue up the message to be sent when the connection
		messageQueue.push(sendMessage);
	};

	return (next) => (action) => {
		if (!action.signalR) {
			const currentStorePartyKey = store.getState().party.partyKey;
			console.log(action);
			switch (action.type) {
				case 'player/sendPosition':
					if (typeof action.payload != 'undefined') {
						queueMessageSender(() =>
							connection.invoke('SendPosition', currentStorePartyKey, action.payload)
						);
					}
					break;
				case 'player/sendDuration':
					if (typeof action.payload != 'undefined') {
						queueMessageSender(() =>
							connection.invoke('SendVideoLength', currentStorePartyKey, action.payload)
						);
					}
					break;
				case 'player/pause':
					queueMessageSender(() => connection.invoke('Pause', currentStorePartyKey));
					break;
				case 'player/play':
					queueMessageSender(() => connection.invoke('Play', currentStorePartyKey));
					break;
				case 'player/songEnded':
					queueMessageSender(() => connection.invoke('StartNewPerformance', currentStorePartyKey));
					break;
				case 'player/sendChangePlayerPosition':
					if (typeof action.payload != 'undefined') {
						queueMessageSender(() =>
							connection.invoke('ChangePlayerPosition', currentStorePartyKey, action.payload)
						);
					}
					break;
				case 'performances/startNextPerformance':
					queueMessageSender(() => connection.invoke('StartNewPerformance', currentStorePartyKey));
					// store.dispatch(resetPlayer());
					break;
				case 'performances/startPreviousPerformance':
					queueMessageSender(() => connection.invoke('startPreviousPerformance', currentStorePartyKey));
					// store.dispatch(resetPlayer());
					break;
				case 'party/resetParty': {
					if (currentStorePartyKey.length > 0) {
						queueMessageSender(() => connection.invoke('LeaveParty', currentStorePartyKey));
					}
					break;
				}
				case 'party/notifyDjChanges':
					queueMessageSender(() => connection.invoke('NotifyDjChanges', currentStorePartyKey));
					break;
				case 'party/joinHub': {
					const partyKey = store.getState().party.partyKey;
					let joinType = store.getState().user.isDj ? 'JoinAsDj' : 'JoinParty';
					if (window.location.pathname.toLowerCase().includes('player')) {
						joinType = 'JoinAsPlayer';
					}
					console.log('Joining party:', joinType);
					queueMessageSender(() => connection.invoke(joinType, partyKey));
					break;
				}
				case 'player/broadcastSettings': {
					queueMessageSender(() => connection.invoke('UpdateSettings', currentStorePartyKey, action.payload));
					break;
				}
				case 'performances/sendMovePerformance': {
					queueMessageSender(() =>
						connection.invoke('MovePerformance', currentStorePartyKey, action.payload)
					);
					break;
				}
				case 'performances/sendNotifyRequest': {
					queueMessageSender(() =>
						connection.invoke('NotifyNewRequest', currentStorePartyKey, action.payload)
					);
					break;
				}
				default:
					break;
			}
		}

		return next(action);
	};
};

export default signalRMiddleware;
