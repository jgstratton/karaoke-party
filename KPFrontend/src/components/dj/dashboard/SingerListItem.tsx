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
				{singer.completedCount > 0 && (
					<span
						className="bg-secondary"
						style={{ display: 'inline-block', width: `${singer.completedCount * 10}px` }}
					>
						&nbsp;
					</span>
				)}

				{singer.liveCount > 0 && (
					<span
						className="bg-warning"
						style={{ display: 'inline-block', width: `${singer.liveCount * 10}px` }}
					>
						&nbsp;
					</span>
				)}

				{singer.queuedCount > 0 && (
					<span
						className="bg-success"
						style={{ display: 'inline-block', width: `${singer.queuedCount * 10}px` }}
					>
						&nbsp;
					</span>
				)}
			</span>
		</>
	);
};
export default SingerListItem;
