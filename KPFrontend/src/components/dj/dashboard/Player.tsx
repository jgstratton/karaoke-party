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
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { selectPartyKey } from '../../../slices/partySlice';
import Overlay from '../../common/Overlay';

const Player = () => {
	const dispatch = useDispatch();
	const [displayPlayerSelect, setDisplayPlayerSelect] = useState(false);
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
							<a target="_blank" rel="noopener noreferrer" onClick={() => setDisplayPlayerSelect(true)}>
								<FontAwesomeIcon className={classNames([styles.icon, styles.navigate])} icon={faTv} />
							</a>
						</OverlayTrigger>
					</div>
				</div>
			</div>
			{displayPlayerSelect && (
				<Overlay>
					<p className="text-center text-warning" style={{ padding: '10px', marginTop: '-100px' }}>
						<div className="text-left" style={{ display: 'inline-block', verticalAlign: 'text-top' }}>
							<a
								href={`/player`}
								className="btn btn-primary"
								onClick={() => setDisplayPlayerSelect(false)}
								target="_blank"
								rel="noopener noreferrer"
							>
								Launch Original player
							</a>
							<br />
							<br />
							<ul className="text-left">
								<li>Shows upcoming singers</li>
								<li>Doesn't pre-download songs</li>
								<li>Can have buffering issues</li>
								<li>May cut out in middle of song</li>
							</ul>
						</div>
						<div
							className="text-left"
							style={{ display: 'inline-block', verticalAlign: 'text-top', paddingLeft: '50px' }}
						>
							<a
								href={`/party/${partyKey}/player`}
								className="btn btn-primary"
								onClick={() => setDisplayPlayerSelect(false)}
								target="_blank"
								rel="noopener noreferrer"
							>
								Launch New player
							</a>
							<br />
							<br />
							<ul className="text-left">
								<li>Does not show upcoming singers</li>
								<li>Pre-downloads the entire song before starting</li>
								<li>Who knows if it will help with the cut-out issues</li>
							</ul>
						</div>
						<br />

						<div
							className="text-left"
							style={{ display: 'inline-block', verticalAlign: 'text-top', paddingLeft: '50px' }}
						>
							<hr />
							<span className="text-danger">
								<b>IMPORTANT!</b> - Never have 2 players running at the same time. Make sure to close
								any other browser tabs that might have a player running or you will
							</span>
							<br />
							<div className="text-center text-danger">
								<b>~~ cross the streams ~~</b>.
							</div>
							<hr />

							<br />
							<p>
								<span className="text-info" style={{ display: 'inline-block', width: '70px' }}>
									Egon:
								</span>{' '}
								<b>Don’t cross the streams.</b>
							</p>
							<p>
								<span className="text-success" style={{ display: 'inline-block', width: '70px' }}>
									Peter:
								</span>{' '}
								Why?
							</p>
							<p>
								<span className="text-info" style={{ display: 'inline-block', width: '70px' }}>
									Egon:
								</span>{' '}
								It would be bad.
							</p>
							<p>
								<span className="text-success" style={{ display: 'inline-block', width: '70px' }}>
									Peter:
								</span>{' '}
								I’m fuzzy on the whole good/bad thing. What do you mean “bad”?
							</p>
							<p>
								<span className="text-info" style={{ display: 'inline-block', width: '70px' }}>
									Egon:
								</span>{' '}
								Try to imagine all [karaoke] as you know it stopping instantaneously and every molecule
								in your body exploding at the speed of light.
							</p>
							<p>
								<span className="text-success" style={{ display: 'inline-block', width: '70px' }}>
									Peter:
								</span>{' '}
								That’s bad. Okay. Alright, important safety tip, thanks Egon.
							</p>
						</div>
					</p>
				</Overlay>
			)}
		</>
	);
};
export default Player;
