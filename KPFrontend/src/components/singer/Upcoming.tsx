import React from 'react';
import { useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import { RootState } from '../../store';

const Upcoming = () => {
	const performances = useSelector((state: RootState) => state.performances);
	const performanceList = performances.queued.slice(0, 5);
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
