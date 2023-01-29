import { HubConnectionBuilder } from '@microsoft/signalr';
import { setPosition, setLength, resetPlayer } from '../slices/playerSlice';
import { populatePerformances } from '../slices/performancesSlice';

import ApiService from '../services/ApiService';

const connection = new HubConnectionBuilder()
	.withUrl('https://localhost:7049/hubs/player')
	.withAutomaticReconnect()
	.build();

connection
	.start()
	.then((result) => console.log('Connected!'))
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
		store.dispatch(signalActionCreator(setLength(Math.floor(valueInMs / 1000))));
	});

	connection.on('ReceiveNewPerformanceStarted', async (value) => {
		let curParty = await ApiService.fetchParty(store.getState().party.partyKey);
		store.dispatch(signalActionCreator(populatePerformances(curParty.queue)));
	});

	connection.on('ReceivePreviousSong', async (value) => {
		let curParty = await ApiService.fetchParty(store.getState().party.partyKey);
		store.dispatch(signalActionCreator(populatePerformances(curParty.queue)));
	});

	return (next) => (action) => {
		if (!action.signalR) {
			const currentStorePartyKey = store.getState().party.partyKey;
			console.log(action);
			switch (action.type) {
				case 'player/setPosition':
					connection.invoke('SendPosition', action.payload);
					break;
				case 'player/pause':
					connection.invoke('Pause', currentStorePartyKey);
					break;
				case 'player/play':
					connection.invoke('Play', currentStorePartyKey);
					break;
				case 'performances/startNextPerformance':
					connection.invoke('StartNewPerformance', currentStorePartyKey);
					store.dispatch(resetPlayer());
					break;
				case 'performances/startPreviousPerformance':
					connection.invoke('startPreviousPerformance', currentStorePartyKey);
					store.dispatch(resetPlayer());
					break;
				case 'party/resetParty': {
					if (currentStorePartyKey.length > 0) {
						connection.invoke('LeaveParty', currentStorePartyKey);
					}
					break;
				}
				case 'party/populateParty': {
					console.log('getting party details');
					console.log('joining party', action.payload.partyKey);
					connection.invoke('JoinParty', action.payload.partyKey);
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
