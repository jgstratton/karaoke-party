import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card';
import PlayerSlider from './PlayerSlider';
import { faPlay, faPause, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Player.module.css';
import DateTimeUtilities from '../../utilities/dateTimeUtilities';
import ListGroup from 'react-bootstrap/ListGroup';
import { play, pause } from '../../slices/playerSlice';
import { startNextPerformance, startPreviousPerformance } from '../../slices/performancesSlice';

const Player = () => {
	const dispatch = useDispatch();
	const performances = useSelector((state) => state.performances);
	const storePlayer = useSelector((state) => state.player);
	const livePerformance = performances.live[0];

	return (
		<Card className={[styles.player, storePlayer.enabled ? styles.enabled : '', 'mb-4']}>
			<Card.Body>
				<Card.Title>Now Playing</Card.Title>
				<Card.Text>
					<ListGroup>
						<ListGroup.Item>
							{livePerformance ? (
								<>
									<div className="text-warning">{livePerformance?.singer?.name}</div>
									{livePerformance.song?.title}
									<br />
									<a href={livePerformance?.song.url}>{livePerformance.song.url}</a>
								</>
							) : (
								<div className="text-warning">Nothing playing right now</div>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Card.Text>

				<>
					<div className={`${styles.controls}`}>
						<FontAwesomeIcon
							icon={faPlay}
							className={storePlayer.playing ? styles.icon : styles.iconEnabled}
							fixedWidth
							onClick={() => dispatch(play())}
						/>
						<FontAwesomeIcon
							icon={faPause}
							className={storePlayer.playing ? styles.iconEnabled : styles.icon}
							fixedWidth
							onClick={() => dispatch(pause())}
						/>
						<PlayerSlider
							playerSlidePosition={storePlayer.position}
							videoLengthSeconds={storePlayer.length}
						/>
					</div>
					<hr />
					<div className={`${styles.controlsLine2}`}>
						<button className="btn btn-primary" onClick={() => dispatch(startPreviousPerformance())}>
							<FontAwesomeIcon icon={faBackwardStep} /> Previous Song
						</button>
						<div className="text-center">
							{DateTimeUtilities.secondsToHHMMSS(storePlayer.length * storePlayer.position)} /{' '}
							{DateTimeUtilities.secondsToHHMMSS(storePlayer.length)}
						</div>
						<button className="btn btn-primary" onClick={() => dispatch(startNextPerformance())}>
							Next Song <FontAwesomeIcon icon={faForwardStep} />
						</button>
					</div>
				</>
			</Card.Body>
		</Card>
	);
};
export default Player;
