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

	return (next) => (action) => {
		if (!action.signalR) {
			console.log(action, 'non-signalr');
			switch (action.type) {
				case 'player/setPosition':
					connection.invoke('SendPosition', action.payload);
					break;
				case 'player/pause':
					connection.invoke('Pause');
					break;
				case 'player/play':
					connection.invoke('Play');
					break;
				case 'performances/startNextPerformance':
					connection.invoke('StartNewPerformance', store.getState().party.partyKey);
					store.dispatch(resetPlayer());
					break;
				default:
					break;
			}
		}

		return next(action);
	};
};

export default signalRMiddleware;
