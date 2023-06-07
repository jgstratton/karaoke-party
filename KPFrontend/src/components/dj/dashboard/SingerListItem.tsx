import { Badge } from 'react-bootstrap';
import SingerDTO from '../../../dtoTypes/SingerDTO';
import { SingerSummary } from '../../../slices/singerSlice';

interface iProps {
	singer: SingerSummary;
	index: number;
	className?: string;
}

const SingerListItem = ({ singer, index, className = '' }: iProps) => {
	return (
		<>
			<span className={className}>{index}</span>
			<span className={className}>{singer.name}</span>
			<span className={className}>
				<Badge bg="secondary" className="mr-1">
					{singer.completedCount}
				</Badge>
				<Badge bg="success" className="mr-1">
					{singer.queuedCount}
				</Badge>
				<Badge bg="primary" className="mr-1">
					{singer.requestedCount}
				</Badge>
			</span>
		</>
	);
};
export default SingerListItem;
