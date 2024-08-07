import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PlayerSlider from './PlayerSlider';
import { faForwardStep, faBackwardStep, faPlayCircle, faPauseCircle, faTv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Player.module.css';
import DateTimeUtilities from '../../../utilities/dateTimeUtilities';
import { play, pause } from '../../../slices/playerSlice';
import { selectLive, startNextPerformance, startPreviousPerformance } from '../../../slices/performancesSlice';
import classNames from 'classnames';
import { RootState } from '../../../store';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { selectPartyKey } from '../../../slices/partySlice';

const Player = () => {
	const dispatch = useDispatch();
	const performances = useSelector(selectLive);
	const partyKey = useSelector(selectPartyKey);
	const storePlayer = useSelector((state: RootState) => state.player);
	const livePerformance = performances[0];

	useEffect(() => {
		document.body.classList.add(styles.body);
		return () => {
			document.body.classList.remove(styles.body);
		};
	}, []);

	return (
		<>
			<div className={classNames([styles.player])}>
				{livePerformance ? (
					<div className={styles.nowPlaying}>
						<div className={styles.nowPlayingTime}>
							{DateTimeUtilities.secondsToHHMMSS(storePlayer.length * storePlayer.position)} /{' '}
							{DateTimeUtilities.secondsToHHMMSS(storePlayer.length)}
						</div>
						<div>
							{livePerformance?.singerName && (
								<span className="text-warning pr-2">{livePerformance?.singerName}</span>
							)}
							<span className="text-muted">
								{livePerformance?.singerName !== livePerformance?.userName &&
									livePerformance?.userName.length &&
									`(Submitted by ${livePerformance?.userName})`}
							</span>
						</div>

						<a href={livePerformance?.url}>{livePerformance?.songTitle}</a>
					</div>
				) : (
					<div className={classNames(['text-warning', styles.nowPlaying])}>Nothing playing right now</div>
				)}

				<div className={`${styles.controls}`}>
					<div className={`${styles.controlsLine1}`}>
						<FontAwesomeIcon
							className={classNames([styles.icon, styles.navigate])}
							icon={faBackwardStep}
							onClick={() => dispatch(startPreviousPerformance())}
						/>
						<FontAwesomeIcon
							icon={faPlayCircle}
							className={storePlayer.playing ? styles.iconHidden : styles.icon}
							fixedWidth
							onClick={() => dispatch(play())}
						/>
						<FontAwesomeIcon
							icon={faPauseCircle}
							className={storePlayer.playing ? styles.icon : styles.iconHidden}
							fixedWidth
							onClick={() => dispatch(pause())}
						/>
						<FontAwesomeIcon
							className={classNames([styles.icon, styles.navigate])}
							icon={faForwardStep}
							onClick={() => dispatch(startNextPerformance())}
						/>
					</div>

					<div className={`${styles.controlsLine2}`}>
						<div className="text-right pr-3">
							{DateTimeUtilities.secondsToHHMMSS(storePlayer.length * storePlayer.position)}
						</div>
						<div className="text-center">
							<PlayerSlider
								playerSlidePosition={storePlayer.position}
								videoLengthSeconds={storePlayer.length}
							/>
						</div>
						<div className="text-left pl-3"> {DateTimeUtilities.secondsToHHMMSS(storePlayer.length)}</div>
					</div>
				</div>
				<div className={styles.right}>
					<div className={styles.launchToggle}>
						<OverlayTrigger overlay={<Tooltip>Launch video player in new tab</Tooltip>} placement="top">
							<a
								href={`/party/${partyKey}/player`}
								className=""
								target="_blank"
								rel="noopener noreferrer"
							>
								<FontAwesomeIcon className={classNames([styles.icon, styles.navigate])} icon={faTv} />
							</a>
						</OverlayTrigger>
					</div>
				</div>
			</div>
		</>
	);
};
export default Player;
