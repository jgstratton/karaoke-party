import { Button } from 'react-bootstrap';
import { SingerSummary } from '../../../slices/singerSlice';

interface iProps {
	singer: SingerSummary;
	index: number;
	className?: string;
	handleSelectSinger: (singerId: number) => void;
}

const SingerListItem = ({ singer, index, className = '', handleSelectSinger }: iProps) => {
	return (
		<>
			<span className={className}>{index}</span>
			<span className={className}>
				<Button className="btn btn-link p-0" onClick={() => handleSelectSinger(singer.singerId ?? 0)}>
					{singer.name}
				</Button>
			</span>
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
