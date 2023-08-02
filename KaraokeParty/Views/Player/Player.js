const Player = function (options) {
	const model = options.model;
	const video = options.video;
	let splashScreen;
	let interactionOverlay;

	const state = {
		playing: false,
		interaction: false,
		videoStarted: false,
		playerSettings: null,
		currentPerformance: null,
	};

	let lastRequest;

	// handle initial page load
	const _loadInitialState = async () => {
		const response = await fetch(`../../party/${model.partyKey}`);
		let partyResponse = await response.json();

		if (response.status === 404) {
			console.error('404 - Party not found');
			return;
		}

		if (!partyResponse.partyKey) {
			console.error('404 - Parety not found (no key in response)');
			return;
		}
		state.playerSettings = partyResponse.playerSettings;
		state.playing = partyResponse.player.playerState === 1;
		state.currentPerformance = partyResponse.performances.filter((p) => p.status == 2)[0];
		if (state.playing) {
			_loadVideo();
		}
		return partyResponse;
	};

	const _attemptPlay = () => {
		// need interaction before chrome will let us play
		if (!state.interaction) {
			console.warn('PLAYER: Video not started, waiting for interaction');
			return;
		}
		if (!state.playing) {
			console.warn("PLAYER: Video not started. Not in 'playing' state.");
			return;
		}

		if (!video.src) {
			console.warn('PLAYER: Video not started. Src not loaded.');
			return;
		}

		if (!state.videoStarted && splashScreen.IsVisible()) {
			console.log('PLAYER: Video not started. Waiting for splashscreen to complete.');
			return;
		}

		// if the video was already started, then just show it
		if (state.videoStarted) {
			console.log('PLAYER: Video already started. Continue playing.');
			video.play();
			video.classList.remove('hidden');
			splashScreen.Hide();
			return;
		}

		// if the video is just now starting, show the splash screen
		console.log('PLAYER: Starting new video, show splash screen.');
		splashScreen.Show(state.currentPerformance);
		setTimeout(() => {
			state.videoStarted = true;
			splashScreen.Hide();
			_attemptPlay();
		}, state.playerSettings.splashScreenSeconds * 1000);
	};

	const _loadVideo = () => {
		video.classList.add('hidden');
		video.pause();
		video.removeAttribute('src');
		if (lastRequest) {
			lastRequest.abort();
			lastRequest = null;
		}
		var req = new XMLHttpRequest();
		req.open('GET', `../../song/${state.currentPerformance.fileName}`, true);
		req.responseType = 'blob';

		req.onload = function () {
			if (this.status === 200) {
				var videoBlob = this.response;
				var vid = URL.createObjectURL(videoBlob);
				video.src = vid;
				_attemptPlay();
			}
		};
		req.onerror = function () {
			alert('error');
		};

		req.send();
		lastRequest = req;
	};
	this.Run = () => {
		//load the party details when the page first loads
		_loadInitialState();
		interactionOverlay = new InteractionOverlay({
			OnInteraction: () => {
				state.interaction = true;
				interactionOverlay.Hide();
				_attemptPlay();
			},
		});

		splashScreen = new SplashScreen();
		interactionOverlay.Show();

		const connection = new Connection({
			partyKey: model.partyKey,
			ReceiveNewPerformanceStarted: (dto) => {
				state.currentPerformance = dto;
				_loadVideo();
			},
			ReceivePreviousSong: (dto) => {
				state.currentPerformance = dto;
				_loadVideo();
			},
			ReceivePause: () => {
				video.pause();
				state.playing = false;
			},
			ReceivePlay: () => {
				state.playing = true;
				_attemptPlay();
			},
			ReceivePosition: (position) => {
				video.currentTime = video.duration * position;
			},
			ReceivePlayerSettings: (newSettings) => {
				state.playerSettings = newSettings;
			},
		});

		let lastTimeChecked = 0;
		const timeChecker = () => {
			setTimeout(() => {
				if (lastTimeChecked != video.currentTime) {
					lastTimeChecked = video.currentTime;
					connection.SendPosition(video.duration > 0 ? video.currentTime / video.duration : 0);
				}
				timeChecker();
			}, 1000);
		};
		timeChecker();

		video.addEventListener('durationchange', () => {
			connection.SendVideoLength(parseInt(video.duration * 1000));
		});

		video.addEventListener('ended', () => {
			connection.StartNewPerformance();
		});
	};
};
