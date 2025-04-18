import Connection from "/StaticComponents/Connection.js";
import InteractionOverlay from "/StaticComponents/InteractionOverlay.js";
import SplashScreen from "/StaticComponents/SplashScreen.js";
import Marquee from "/StaticComponents/Marquee.js";
import PartyQR from "/StaticComponents/PartyQR.js";
import Storage from "/StaticComponents/Storage.js";

const Player = function (options) {
    const model = options.model;
    const video = options.video;
    let splashScreen;
    let marquee;
    let partyQR;

    const state = {
        playing: false,
        waitingForVideo: false, // use when song has ended and we're waiting for the next song to be sent
        settings: null,
        currentPerformance: null,
    };

    const storage = new Storage('songs');

    let lastRequest;
    let backgroundTimeout;
    let connection;

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
        state.settings = partyResponse.settings;
        state.playing = partyResponse.player.playerState === 1;
        state.currentPerformance = partyResponse.performances.filter((p) => p.status == 2)[0];
        marquee.Update(state.settings);
        partyQR.Update(state.settings);
        console.log("setting initial volume", partyResponse.player.volume);
        video.volume = partyResponse.player.volume / 100;
        if (state.playing && state.currentPerformance) {
            _loadVideo();
        } else {
            state.waitingForVideo = true;
            loadInBackground();
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
        if (splashScreen.IsVisible() && curSecondsVisible < state.settings.splashScreenSeconds) {
            console.warn('PLAYER: Splash screen duration not complete, continue waiting.');
            setTimeout(() => {
                splashScreen.Hide();
                _attemptPlay();
            }, (state.settings.splashScreenSeconds - curSecondsVisible) * 1000);
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
                const percentTimeEllapsed = secondsVisible / state.settings.splashScreenSeconds;
                const percentDownloaded = evt.loaded / evt.total;
                const percentComplete =
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

                const percentTimeEllapsed = (secondsVisible / state.settings.splashScreenSeconds) * 100;
                splashScreen.SetProgressBar(percentTimeEllapsed > 100 ? 100 : percentTimeEllapsed);
                _updateProgressTimeRemaining(percentTimeEllapsed > 100);
            }, 500);
        };

        video.classList.add('hidden');
        video.pause();
        video.removeAttribute('src');
        splashScreen.Show(state.currentPerformance);

        const storedFile = await storage.get(state.currentPerformance.videoId);
        const videoId = state.currentPerformance.videoId;

        if (!storedFile) {
            console.log('Current song - file not stored, loading from server');
            if (lastRequest) {
                console.log('Canceling in-progress request to download current song.');
                lastRequest.abort();
                lastRequest = null;
            }

            const objectUrlResponse = await fetch(`../../song/objecturl/${videoId}`);
            let songObjectDto = await objectUrlResponse.json();
            if (!songObjectDto.objectUrl) {
                console.log(songObjectDto);
                console.error('Background - objectUrl not found for videoId', videoId);
                return;
            }

            splashScreen.SetProgressBarPreloaded(false);
            var req = new XMLHttpRequest();
            req.onprogress = _updateProgress;
            req.open('GET', songObjectDto.objectUrl, true);
            req.responseType = 'blob';

            req.onload = async function () {
                if (this.status === 200) {
                    var videoBlob = this.response;
                    delete songObjectDto.objectUrl;
                    songObjectDto.blob = videoBlob;
                    await storage.set(state.currentPerformance.videoId, songObjectDto);
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
            var vid = URL.createObjectURL(storedFile.blob);
            video.src = vid;
            _updateProgressTimeRemaining();
            loadInBackground();
        }
    };

    let volumeInterval = null;

    const endVolumeChange = () => {
        clearInterval(volumeInterval);
        volumeInterval = null;
        document.getElementById("volumeControl").style.display = "none";
    }

    const smoothChangeVolume = (targetVolume) => {

        // Clear existing interval if it exists
        if (volumeInterval !== null) {
            endVolumeChange();
        }
        console.log("New volume received", targetVolume);
        document.getElementById("volumeControl").style.display = "block";
        const initialVolume = parseInt(video.volume * 100);
        let volumeChange = targetVolume - initialVolume;
        if (volumeChange === 0) {
            console.log("No volume change, exiting");
            return;
        }
        console.log("Volume Change", volumeChange);
        const stepTime = 100; // at 100ms, each second will move the volume by 10% 
        const direction = volumeChange > 0 ? 1 : -1;

        volumeInterval = setInterval(() => {
            const nextVolume = video.volume + direction * 0.01;
            console.log("Next volume", nextVolume);
            if (nextVolume < 0 || nextVolume > 1) {
                endVolumeChange();
                console.log("Existing volume changer, hit limit", nextVolume);
                return;
            }
            console.log("Smooth volume update", nextVolume);
            video.volume = nextVolume;
            if (direction > 0 && nextVolume * 100 >= targetVolume) {
                endVolumeChange();
            }
            if (direction < 0 && nextVolume * 100 <= targetVolume) {
                endVolumeChange();
            }
        }, stepTime);
    }

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

        // todo: this works but make this a setting that can be toggled before enabling it prod
        // if (state.waitingForVideo && queuedPerformances.length > 0) {
        //     console.log('Auto-checking for new songs, waiting for video to start');
        //     connection.StartNewPerformance();
        // }

        for (var i = 0; i < queuedPerformances.length; i++) {
            const videoId = queuedPerformances[i].videoId;
            const storedFile = await storage.get(videoId);

            if (!storedFile) {
                console.log('Background - downloading queued song', videoId);

                const objectUrlResponse = await fetch(`../../song/objecturl/${videoId}`);
                let songObjectDto = await objectUrlResponse.json();
                if (!songObjectDto.objectUrl) {
                    console.log(songObjectDto);
                    console.error('Background - objectUrl not found for videoId', videoId);
                    continue;
                }

                const req = new XMLHttpRequest();
                req.open('GET', songObjectDto.objectUrl, true);
                req.responseType = 'blob';

                req.onload = async function () {
                    if (this.status === 200) {
                        var videoBlob = this.response;
                        delete songObjectDto.objectUrl;
                        songObjectDto.blob = videoBlob;
                        await storage.set(videoId, songObjectDto);
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

        partyQR = new PartyQR({
            partyKey: model.partyKey,
        })

        connection = new Connection({
            partyKey: model.partyKey,
            ReceiveNewPerformanceStarted: (dto) => {
                state.currentPerformance = dto;
                state.waitingForVideo = false;
                _loadVideo();
            },
            ReceivePreviousSong: (dto) => {
                state.currentPerformance = dto;
                state.waitingForVideo = false;
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
            ReceiveVolume: (volume) => {
                video.volume = smoothChangeVolume(volume);
            },
            ReceivePlayerSettings: (newSettings) => {
                console.log("New settings received", newSettings);
                state.settings = newSettings;
                marquee.Update(newSettings);
                partyQR.Update(newSettings);
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
            console.log('Video ended, waiting for next song');
            state.waitingForVideo = true;
            connection.StartNewPerformance();
        });
        loadInBackground();
    };

    this.GetLastRequest = () => {
        return lastRequest;
    };

    this.GetConnectionObject = () => connection;

    this.GetState = () => state;

    this.GetVideo = () => state;
};

export default Player;