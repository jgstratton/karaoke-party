import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { faTv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Player.module.css';
import DateTimeUtilities from '../../../utilities/dateTimeUtilities';
import { selectLive } from '../../../slices/performancesSlice';
import classNames from 'classnames';
import { RootState } from '../../../store';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { selectPartyKey } from '../../../slices/partySlice';
import PlayerMainControls from './PlayerMainControls';

const Player = () => {
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
					<PlayerMainControls />
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
