import React from 'react';
import { useSelector } from 'react-redux';
import DateTimeUtilities from '../../utilities/dateTimeUtilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import ListGroup from 'react-bootstrap/ListGroup';
import { RootState } from '../../store';
import { selectLive } from '../../slices/performancesSlice';

const Player = () => {
	const performances = useSelector(selectLive);
	const storePlayer = useSelector((state: RootState) => state.player);
	const livePerformance = performances[0];

	return (
		<ListGroup>
			{livePerformance ? (
				<>
					<ListGroup.Item style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
						<div className="text-warning">
							<FontAwesomeIcon icon={faMicrophone} fixedWidth /> {livePerformance?.singerName}
						</div>
						{livePerformance?.songTitle}
						<div className="float-right">
							{DateTimeUtilities.secondsToHHMMSS(storePlayer.length * storePlayer.position)} /{' '}
							{DateTimeUtilities.secondsToHHMMSS(storePlayer.length)}
						</div>
					</ListGroup.Item>
				</>
			) : (
				<>
					<ListGroup.Item style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
						<div className="text-warning">Nothing playing right now</div>
					</ListGroup.Item>
				</>
			)}
		</ListGroup>
	);
};
export default Player;
