import { ListGroup } from 'react-bootstrap';
import PerformanceDTO from '../../dtoTypes/PerformanceDTO';

interface iProps {
	performance: PerformanceDTO;
}

const ListItem = ({ performance }: iProps) => {
	return (
		<ListGroup.Item key={performance.performanceId}>
			<div className="text-warning">
				{performance.singerName}{' '}
				<span className="text-muted">
					{performance.singerName !== performance.userName &&
						performance.userName.length &&
						`(Submitted by ${performance.userName})`}
				</span>
			</div>
			{performance.songTitle}
		</ListGroup.Item>
	);
};

export default ListItem;
