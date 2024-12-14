const Connection = function (options) {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('../../hubs/player')
        .build();

    connection.onreconnecting(error => {
        console.log('Player Signalr Reconnecting interval', error);
    });

    connection.onclose(error => {
        console.log('Player Signalr Connection closed', error);
        startSignalRConnection(connection);
    });

    const getDeviceId = () => {
        return localStorage.getItem('deviceId') ?? 'player-no-device-id';
    };

    const clientConnectionDetails = {
        PartyKey: options.partyKey,
        DeviceId: getDeviceId(),
    };

    const startSignalRConnection = (_connection) => {
        console.log("%c ~~~ Attempting to start new connection to SignalR ~~~", 'padding:5px; background-color:#ddffdd');
        _connection
            .start()
            .then(async () => {
                console.info('SignalR Connected');
                connection.invoke('JoinAsPlayer', clientConnectionDetails);
            })
            .catch((err) => {
                // the hub already has it's own retry/timeout policy, so we don't need a super tight retry here
                console.log("%c ~~~ New connection to SignalR failed ~~~", 'padding:5px; background-color:#ffdddd');
                console.error(err);
                setTimeout(() => startSignalRConnection(connection), 10 * 1000); // try again in 20 seconds
            });
    };
    startSignalRConnection(connection);

    connection.on('ReceivePosition', options.ReceivePosition);
    connection.on('ReceiveNewPerformanceStarted', options.ReceiveNewPerformanceStarted);
    connection.on('ReceivePreviousSong', options.ReceivePreviousSong);
    connection.on('ReceivePause', options.ReceivePause);
    connection.on('ReceivePlay', options.ReceivePlay);
    connection.on('ReceivePlayerSettings', options.ReceivePlayerSettings);
    connection.on('ReceiveVolume', options.ReceiveVolume);

    this.SendPosition = (payload) => connection.invoke('SendPosition', clientConnectionDetails, payload);
    this.SendVideoLength = (payload) => connection.invoke('SendVideoLength', clientConnectionDetails, payload);
    this.StartNewPerformance = () => connection.invoke('StartNewPerformance', clientConnectionDetails);
    this.SendVolume = (payload) => connection.invoke('SendVolume', clientConnectionDetails, payload);
    this.GetConnectionObject = () => connection;
};
