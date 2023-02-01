import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { setPosition, setLength, resetPlayer } from '../slices/playerSlice';
import { populatePerformances } from '../slices/performancesSlice';

import ApiService from '../services/ApiService';

const messageQueue = [];
const connection = new HubConnectionBuilder()
	.withUrl('https://localhost:7049/hubs/player')
	.withAutomaticReconnect()
	.build();

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
		store.dispatch(signalActionCreator(populatePerformances(curParty.queue)));
	});

	connection.on('ReceivePreviousSong', async (value) => {
		let curParty = await ApiService.fetchParty(store.getState().party.partyKey);
		store.dispatch(signalActionCreator(populatePerformances(curParty.queue)));
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
					console.log('sending position from client', action.payload);
					if (typeof action.payload != 'undefined') {
						queueMessageSender(() =>
							connection.invoke('SendPosition', currentStorePartyKey, action.payload)
						);
					}
					break;
				case 'player/pause':
					queueMessageSender(() => connection.invoke('Pause', currentStorePartyKey));
					break;
				case 'player/play':
					queueMessageSender(() => connection.invoke('Play', currentStorePartyKey));
					break;
				case 'performances/startNextPerformance':
					queueMessageSender(() => connection.invoke('StartNewPerformance', currentStorePartyKey));
					store.dispatch(resetPlayer());
					break;
				case 'performances/startPreviousPerformance':
					queueMessageSender(() => connection.invoke('startPreviousPerformance', currentStorePartyKey));
					store.dispatch(resetPlayer());
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
				default:
					break;
			}
		}

		return next(action);
	};
};

export default signalRMiddleware;
