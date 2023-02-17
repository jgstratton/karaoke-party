import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faVideo } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux';
import { sendPosition, songEnded } from '../../slices/playerSlice';
import Overlay from '../common/Overlay';

const Player = () => {
	const dispatch = useDispatch();
	const player = useSelector((state) => state.player);
	const [userInteraction, setUserInteraction] = useState(false);
	const [lastReportedPosition, setLastReportedPosition] = useState(0);
	const [played, setPlayed] = useState(0);
	const [loaded, setLoaded] = useState(0);
	const [duration, setDuration] = useState(0);
	const [playbackRate, setPlaybackRate] = useState(1.0);
	const [loop, setLoop] = useState(false);

	useEffect(() => {
		if (lastReportedPosition != player.position && playerRef.current) {
			setLastReportedPosition(player.position);
			playerRef.current.seekTo(parseFloat(player.position));
		}
	}, [lastReportedPosition, setLastReportedPosition, player]);

	const enablePlayer = () => {
		//launch in full screen by default
		findDOMNode(playerRef.current).requestFullscreen();
		setUserInteraction(true);
	};

	const handleProgress = (status) => dispatch(sendPosition(status.played));
	const handleEnded = () => dispatch(songEnded());

	const playerRef = React.useRef();

	return (
		<div style={{ height: 'calc(100vh)', overflowY: 'hidden' }}>
			<ReactPlayer
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
				// onDuration={this.handleDuration}
			/>
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
								Some browsers don't like it when websites start jamming playing music right away.
								<br />
								Click the button below to let your browser know you're in the mood for some 🎶🎶 karaoke
								🎶🎶!
							</p>
							<button className="btn btn-primary" onClick={enablePlayer}>
								Start Player
								<FontAwesomeIcon icon={faVideo} className="ml-1" />
							</button>
						</div>
					</Overlay>
				</div>
			)}
		</div>
	);
};
export default Player;
