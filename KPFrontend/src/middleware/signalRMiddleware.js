import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { setPosition, setLength } from '../slices/playerSlice';
import { populatePerformances } from '../slices/performancesSlice';
import { populatePlayer, pause, play } from '../slices/playerSlice';
import { populateSettings } from '../slices/playerSlice';

import ApiService from '../api/ApiService';

const messageQueue = [];
const connection = new HubConnectionBuilder().withUrl('/hubs/player').withAutomaticReconnect().build();

connection
	.start()
	.then((result) => {
		console.log('Connected!');
		while (messageQueue.length > 0) {
			console.log(`Getting caught up on ${messageQueue.length} signalR messages.`);
			const messageSender = messageQueue.shift();
			messageSender();
		}
	})
	.catch((e) => console.log('Connection failed: ', e));

const signalRMiddleware = (store) => {
	const signalActionCreator = function (action) {
		action.signalR = true;
		console.log('SignalR action dispatched', action);
		return action;
	};

	connection.on('ReceivePosition', (value) => {
		store.dispatch(signalActionCreator(setPosition(value)));
	});

	connection.on('ReceiveVideoLength', (valueInMs) => {
		store.dispatch(signalActionCreator(setLength(valueInMs)));
	});

	connection.on('ReceiveNewPerformanceStarted', async (value) => {
		let curParty = await ApiService.fetchParty(store.getState().party.partyKey);
		store.dispatch(signalActionCreator(populatePerformances(curParty.performances)));
		store.dispatch(signalActionCreator(populatePlayer(curParty.player)));
	});

	connection.on('ReceivePreviousSong', async (value) => {
		let curParty = await ApiService.fetchParty(store.getState().party.partyKey);
		store.dispatch(signalActionCreator(populatePerformances(curParty.performances)));
		store.dispatch(signalActionCreator(populatePlayer(curParty.player)));
	});

	connection.on('ReceivePause', async () => {
		store.dispatch(signalActionCreator(pause()));
	});

	connection.on('ReceivePlay', async () => {
		store.dispatch(signalActionCreator(play()));
	});

	connection.on('ReceivePlayerSettings', async (playerSettings) => {
		store.dispatch(signalActionCreator(populateSettings(playerSettings)));
	});

	connection.on('ReceivePerformances', async (performances) => {
		store.dispatch(signalActionCreator(populatePerformances(performances)));
	});

	const queueMessageSender = (sendMessage) => {
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
				case 'party/populateParty': {
					queueMessageSender(() => {
						if (action.payload.partyKey) {
							console.log(connection, action.payload.partyKey);
							connection.invoke('JoinParty', action.payload.partyKey);
						}
					});
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
				default:
					break;
			}
		}

		return next(action);
	};
};

export default signalRMiddleware;
