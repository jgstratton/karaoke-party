import { useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import { selectQueuedSorted } from '../../slices/combinedSelectors';
import { selectPlayerSettings } from '../../slices/playerSlice';

const Upcoming = () => {
	const performances = useSelector(selectQueuedSorted);
	const settings = useSelector(selectPlayerSettings);
	const performanceList = performances.slice(0, settings.splashScreenUpcomingCount);
	return (
		<ListGroup>
			{performanceList.length > 0 ? (
				performanceList.map((s, i) => (
					<ListGroup.Item key={s.performanceId} style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
						<div className="text-warning">{s.singerName}</div>
						{s.songTitle}
					</ListGroup.Item>
				))
			) : (
				<>
					<ListGroup.Item style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
						<div className="text-warning">No additional peformances queued up.</div>
					</ListGroup.Item>
				</>
			)}
		</ListGroup>
	);
};
export default Upcoming;
