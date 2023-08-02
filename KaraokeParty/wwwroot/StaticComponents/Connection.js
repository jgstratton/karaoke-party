const Connection = function (options) {
	const connection = new signalR.HubConnectionBuilder().withUrl('../../hubs/player').build();
	const retryIntervals = [1, 2, 3, 5, 5, 5, 10, 10, 10];
	let currentTry = -1;

	const startSignalRConnection = (_connection) => {
		_connection
			.start()
			.then(async () => {
				console.info('SignalR Connected');
				connection.invoke('JoinAsPlayer', options.partyKey);
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
	startSignalRConnection(connection);

	connection.on('ReceivePosition', options.ReceivePosition);
	connection.on('ReceiveNewPerformanceStarted', options.ReceiveNewPerformanceStarted);
	connection.on('ReceivePreviousSong', options.ReceivePreviousSong);
	connection.on('ReceivePause', options.ReceivePause);
	connection.on('ReceivePlay', options.ReceivePlay);
	connection.on('ReceivePlayerSettings', options.ReceivePlayerSettings);

	this.SendPosition = (payload) => connection.invoke('SendPosition', options.partyKey, payload);
	this.SendVideoLength = (payload) => connection.invoke('SendVideoLength', options.partyKey, payload);
	this.StartNewPerformance = () => connection.invoke('StartNewPerformance', options.partyKey);
};
