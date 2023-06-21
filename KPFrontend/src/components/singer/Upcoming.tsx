import { useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import { selectQueued } from '../../slices/performancesSlice';

const Upcoming = () => {
	const performances = useSelector(selectQueued);
	const performanceList = performances.slice(0, 5);
	return (
		<ListGroup>
			{performanceList.length > 0 ? (
				performanceList.map((s, i) => (
					<ListGroup.Item key={s.performanceId}>
						<div className="text-warning">{s.singerName}</div>
						{s.songTitle}
					</ListGroup.Item>
				))
			) : (
				<>
					<ListGroup.Item>
						<div className="text-warning">No additional peformances queued up.</div>
					</ListGroup.Item>
				</>
			)}
		</ListGroup>
	);
};
export default Upcoming;
