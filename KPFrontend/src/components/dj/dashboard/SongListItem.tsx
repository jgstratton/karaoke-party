import { faCheck, faMusic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from 'react-bootstrap';
import PerformanceDTO from '../../../dtoTypes/PerformanceDTO';
import StatusService from '../../../services/StatusService';

interface iProps {
	performance: PerformanceDTO;
	index: number;
	className?: string;
}

const SongListItem = ({ performance, index, className = '' }: iProps) => {
	const renderSwitch = () => {
		switch (StatusService.getStatusName(performance.status)) {
			case 'completed':
				return (
					<Badge bg="secondary">
						<FontAwesomeIcon icon={faCheck} />
						<span className="pl-2">Completed</span>
					</Badge>
				);
			case 'live':
				return (
					<Badge bg="warning" text="dark">
						<FontAwesomeIcon icon={faMusic} />
						<span className="pl-2">Now Playing</span>
					</Badge>
				);
			case 'queued':
				return <Badge bg="success">Queued</Badge>;
			case 'requests':
				return <button className="btn btn-primary">Add To Queue</button>;
			default:
				return <></>;
		}
	};

	return (
		<>
			<span className={className}>{index}</span>
			<span className={className}>{performance.singerName}</span>
			<span className={className}>
				{performance?.singerName !== performance?.userName &&
					performance?.userName.length &&
					`(Submitted by ${performance?.userName})`}
			</span>
			<a className={className} href={performance?.url} target="_blank" rel="noopener noreferrer">
				{performance?.songTitle}
			</a>
			<span>{renderSwitch()}</span>
		</>
	);
};
export default SongListItem;
