const Player = function (options) {
	const model = options.model;
	const video = options.video;
	let splashScreen;
	let marquee;

	const state = {
		playing: false,
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
		marquee.Update(state.playerSettings);

		if (state.playing) {
			_loadVideo();
		}
		return partyResponse;
	};

	const _attemptPlay = () => {
		if (!state.playing) {
			console.warn("PLAYER: Video not started. Not in 'playing' state.");
			return;
		}

		if (!video.src) {
			console.warn('PLAYER: Video not started. Src not loaded.');
			return;
		}

		const curSecondsVisible = splashScreen.GetSecondsVisible();
		if (splashScreen.IsVisible() && curSecondsVisible < state.playerSettings.splashScreenSeconds) {
			console.warn('PLAYER: Splash screen duration not complete, continue waiting.');
			setTimeout(() => {
				splashScreen.Hide();
				_attemptPlay();
			}, (state.playerSettings.splashScreenSeconds - curSecondsVisible) * 1000);
			return;
		}

		console.log('PLAYER: Starting new video');
		video.play();
		video.classList.remove('hidden');
		splashScreen.Hide();
	};

	const _loadVideo = () => {
		const _updateProgress = (evt) => {
			if (evt.lengthComputable) {
				var percentComplete = (evt.loaded / evt.total) * 100;
				splashScreen.SetProgressBar(percentComplete);
			}
		};

		video.classList.add('hidden');
		video.pause();
		video.removeAttribute('src');
		splashScreen.Show(state.currentPerformance);
		if (lastRequest) {
			lastRequest.abort();
			lastRequest = null;
		}
		var req = new XMLHttpRequest();
		req.onprogress = _updateProgress;
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
		new InteractionOverlay({
			OnInteraction: () => {
				// wait till interaction before loading party details
				_loadInitialState();
				_attemptPlay();
			},
		});

		splashScreen = new SplashScreen();

		marquee = new Marquee({
			partyKey: model.partyKey,
		});

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
				marquee.Update(newSettings);
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
