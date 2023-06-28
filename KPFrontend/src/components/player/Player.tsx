import React from 'react';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { sendPosition, sendDuration, songEnded, selectPlayerSettings, disableSplash } from '../../slices/playerSlice';
import Overlay from '../common/Overlay';
import Marquee from 'react-fast-marquee';
import useBodyClass from '../../utilities/useBodyClass';
import { RootState } from '../../store';
import { selectPartyKey } from '../../slices/partySlice';
import Splash from './Splash';
import { selectUserIsDj } from '../../slices/userSlice';

const Player = () => {
	useBodyClass('player-open');
	const settings = useSelector(selectPlayerSettings);
	const dispatch = useDispatch();
	const isDj = useSelector(selectUserIsDj);
	const player = useSelector((state: RootState) => state.player);
	const partyKey = useSelector(selectPartyKey);
	const playerSettings = useSelector(selectPlayerSettings);
	const [userInteraction, setUserInteraction] = useState(false);
	const [lastReportedPosition, setLastReportedPosition] = useState(0);
	const [playbackRate] = useState(1.0);
	const [loop] = useState(false);

	useEffect(() => {
		if (lastReportedPosition !== player.position && playerRef.current) {
			setLastReportedPosition(player.position);
			// @ts-ignore:
			playerRef.current.seekTo(player.position);
		}
		if (player.showSplash && settings.splashScreenEnabled) {
			setTimeout(() => dispatch(disableSplash()), settings.splashScreenSeconds * 1000);
		}
	}, [lastReportedPosition, setLastReportedPosition, player]);

	const enablePlayer = () => {
		setUserInteraction(true);
	};

	// @ts-ignore:
	const handleProgress = (status) => dispatch(sendPosition(status.played));
	const handleEnded = () => dispatch(songEnded());

	const playerRef = React.useRef();

	return (
		<>
			{!isDj ? (
				<div>You're not the DJ... what are you doing here?</div>
			) : player.showSplash && settings.splashScreenEnabled ? (
				<Splash />
			) : (
				<div style={{ height: `calc(100vh)`, overflowY: 'hidden' }}>
					<ReactPlayer
						// @ts-ignore:
						ref={playerRef}
						className="react-player"
						width="100%"
						height="100%"
						url={player.url}
						pip={false}
						playing={userInteraction && player.playing}
						controls={false}
						light={false}
						loop={loop}
						playbackRate={playbackRate}
						// volume={volume}
						muted={false}
						// onReady={() => console.log('onReady')}
						// onStart={() => console.log('onStart')}
						// onPlay={handlePlay}
						// onEnablePIP={this.handleEnablePIP}
						// onDisablePIP={this.handleDisablePIP}
						// onPause={this.handlePause}
						// onBuffer={() => console.log('onBuffer')}
						// onPlaybackRateChange={this.handleOnPlaybackRateChange}
						// onSeek={(e) => console.log('onSeek', e)}
						onEnded={handleEnded}
						// onError={(e) => console.log('onError', e)}
						onProgress={handleProgress}
						onDuration={(duration) => dispatch(sendDuration(Math.floor(duration * 1000)))}
					/>
					{playerSettings.marqueeEnabled && (
						<div
							className="marquee-wrap"
							style={{
								height: `${playerSettings.marqueeSize}px`,
								lineHeight: `${playerSettings.marqueeSize}px`,
								fontSize: `${playerSettings.marqueeSize * 0.8}px`,
							}}
						>
							<Marquee gradient={false} speed={playerSettings.marqueeSpeed}>
								<span className="p-2">
									{playerSettings.marqueeText
										.replace(/%code%/gi, partyKey)
										.replace(/%url%/gi, window.location.href)
										.replaceAll(' ', '\u00A0')}
								</span>
							</Marquee>
						</div>
					)}

					{!userInteraction && (
						<div
							className="text-center"
							style={{
								height: 'calc(100vh)',
								lineHeight: 'calc(100vh)',
								position: 'fixed',
								zIndex: 100,
								top: 0,
								left: 0,
								width: '100%',
							}}
						>
							<Overlay>
								<div className="text-center">
									<p className="mb-3" style={{ lineHeight: '30px' }}>
										Some browsers don't like it when websites start jamming their music right away.
										<br />
										Let your browser know you're in the mood for some 🎶🎶 karaoke 🎶🎶!
									</p>
									<button className="btn btn-primary" onClick={enablePlayer}>
										Launch Karaoke Player
										<FontAwesomeIcon icon={faVideo} className="ml-1" />
									</button>
								</div>
							</Overlay>
						</div>
					)}
				</div>
			)}
		</>
	);
};
export default Player;
