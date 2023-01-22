import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from 'react-bootstrap/Card';
import PlayerSlider from './PlayerSlider';
import { faPlay, faPause, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Player.module.css';
import VideoPreview from '../search/VideoPreview';

const Player = (props) => {
	const [isEnabled] = useState(true);
	const performances = useSelector((state) => state.performances);
	const livePerformance = performances.live[0];

	return (
		<Card className={[styles.player, isEnabled ? styles.enabled : '']}>
			<Card.Body>
				<Card.Title>Now Playing</Card.Title>
				<Card.Text>
					{livePerformance ? (
						<>
							<div className="text-warning">{livePerformance?.singer?.name}</div>
							{livePerformance.song?.title}
							<VideoPreview url={livePerformance?.song?.url} />
							<a href={livePerformance?.song.url}>{livePerformance.song.url}</a>
						</>
					) : (
						<div className="text-warning">Nothing playing right now</div>
					)}
				</Card.Text>

				{livePerformance && (
					<div className={`${styles.controls}`}>
						<FontAwesomeIcon icon={faPlay} className={styles.icon} fixedWidth />
						<FontAwesomeIcon icon={faPause} className={styles.icon} fixedWidth />
						<FontAwesomeIcon icon={faBackwardStep} className={styles.icon} fixedWidth />
						<PlayerSlider isEnabled={isEnabled} />
						<FontAwesomeIcon icon={faForwardStep} className={styles.icon} fixedWidth />
						<div className="text-center">0:00</div>
					</div>
				)}
			</Card.Body>
		</Card>
	);
};
export default Player;
