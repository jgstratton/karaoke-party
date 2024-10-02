import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faPlayCircle, faPauseCircle, faForwardStep } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './PlayerMainControls.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { play, pause } from '../../../slices/playerSlice';
import { startPreviousPerformance, startNextPerformance } from '../../../slices/performancesSlice';
import { RootState } from '../../../store';
import PlayerSlider from './PlayerSlider';
import DateTimeUtilities from '../../../utilities/dateTimeUtilities';

const PlayerMainControls = () => {
    const dispatch = useDispatch();
    const storePlayer = useSelector((state: RootState) => state.player);

    return (
        <>
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
                <div className="text-right">
                    {DateTimeUtilities.secondsToHHMMSS(storePlayer.length * storePlayer.position)}
                </div>
                <div className="text-center">
                    <PlayerSlider
                        playerSlidePosition={storePlayer.position}
                        videoLengthSeconds={storePlayer.length}
                    />
                </div>
                <div className="text-left"> {DateTimeUtilities.secondsToHHMMSS(storePlayer.length)}</div>
            </div>
        </>
    );
};

export default PlayerMainControls;