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

	const storage = new Storage('songs');

	let lastRequest;
	let backgroundTimeout;

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
		state.playerSettings = partyResponse.settings;
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

	const _loadVideo = async () => {
		const _updateProgress = (evt) => {
			if (evt.lengthComputable) {
				const secondsVisible = splashScreen.GetSecondsVisible();
				const percentTimeEllapsed = secondsVisible / state.playerSettings.splashScreenSeconds;
				const percentDownloaded = evt.loaded / evt.total;
				percentComplete =
					(percentTimeEllapsed < percentDownloaded ? percentTimeEllapsed : percentDownloaded) * 100;
				splashScreen.SetProgressBar(percentComplete);
			}
		};

		const _updateProgressTimeRemaining = (progressComplete = false) => {
			setTimeout(() => {
				if (progressComplete) {
					_attemptPlay();
					return;
				}
				const secondsVisible = splashScreen.GetSecondsVisible();

				const percentTimeEllapsed = (secondsVisible / state.playerSettings.splashScreenSeconds) * 100;
				splashScreen.SetProgressBar(percentTimeEllapsed > 100 ? 100 : percentTimeEllapsed);
				_updateProgressTimeRemaining(percentTimeEllapsed > 100);
			}, 500);
		};

		video.classList.add('hidden');
		video.pause();
		video.removeAttribute('src');
		splashScreen.Show(state.currentPerformance);

		const storedFile = await storage.get(state.currentPerformance.fileName);

		if (!storedFile) {
			console.log('Current song - file not stored, loading from server');
			if (lastRequest) {
				console.log('Canceling in-progress request to download current song.');
				lastRequest.abort();
				lastRequest = null;
			}

			splashScreen.SetProgressBarPreloaded(false);
			var req = new XMLHttpRequest();
			req.onprogress = _updateProgress;
			req.open('GET', `../../song/${state.currentPerformance.fileName}`, true);
			req.responseType = 'blob';

			req.onload = async function () {
				if (this.status === 200) {
					var videoBlob = this.response;
					await storage.set(state.currentPerformance.fileName, videoBlob);
					var vid = URL.createObjectURL(videoBlob);
					video.src = vid;
					splashScreen.SetProgressBarPreloaded(true);
					_updateProgressTimeRemaining();

					// after the current video is loaded we can start up the background loader
					loadInBackground();
				}
			};
			req.onerror = function () {
				alert('error');
			};

			req.send();
			lastRequest = req;
		} else {
			console.log('Current song - file already downloaded, loading from client db');
			splashScreen.SetProgressBarPreloaded(true);
			var vid = URL.createObjectURL(storedFile);
			video.src = vid;
			_updateProgressTimeRemaining();
			loadInBackground();
		}
	};

	const loadInBackground = async () => {
		if (backgroundTimeout) {
			console.log('clearing existing background-loader timeout');
			window.clearTimeout(backgroundTimeout);
			backgroundTimeout = null;
		}
		// if a request is alreay started, do nothing.  We don't want to interupt the current download
		if (lastRequest && lastRequest.readyState < 4) {
			console.log('Background - download in progress, abort');
			return;
		}
		const queuedPerformancesResponse = await fetch(`../../party/${model.partyKey}/queued`);
		let queuedPerformances = await queuedPerformancesResponse.json();
		console.log(queuedPerformances);
		for (var i = 0; i < queuedPerformances.length; i++) {
			const targetFile = queuedPerformances[i].fileName;
			const storedFile = await storage.get(targetFile);

			if (!storedFile) {
				console.log('Background - downloading queued song', targetFile);

				const req = new XMLHttpRequest();
				req.open('GET', `../../song/${targetFile}`, true);
				req.responseType = 'blob';

				req.onload = async function () {
					if (this.status === 200) {
						var videoBlob = this.response;
						await storage.set(targetFile, videoBlob);
						loadInBackground();
					}
				};
				req.onerror = function () {
					console.error('error');
				};

				// last minute check before queuing up background request
				if (lastRequest && lastRequest.readyState < 4) {
					console.log('Background - download in progress, abort');
					return;
				}
				req.send();
				lastRequest = req;
				return;
			}
		}

		// no queued performances were found.  Wait 15 seconds then check again
		backgroundTimeout = setTimeout(() => {
			console.log('Background - No queued songs to download.  Pausing for 15 seconds.');
			backgroundTimeout = null;
			loadInBackground();
		}, 15 * 1000);
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
		loadInBackground();
	};

	this.GetLastRequest = () => {
		return lastRequest;
	};
};
