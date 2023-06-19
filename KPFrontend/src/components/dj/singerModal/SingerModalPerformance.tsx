import { faCheck, faMusic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Badge } from 'react-bootstrap';
import PerformanceDTO from '../../../dtoTypes/PerformanceDTO';
import StatusService from '../../../services/StatusService';
import SingerDTO from '../../../dtoTypes/SingerDTO';

interface iProps {
	performance: PerformanceDTO;
	singer: SingerDTO;
	index: number;
	className?: string;
}

const SongListItem = ({ performance, index, singer, className = '' }: iProps) => {
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
			<span className={className}>{index + 1}</span>
			<span className={className} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
				<span>
					{/* {singer.name != performance.singerName && ( */}
					<>
						<span className="text-warning">{performance.singerName}</span>
						<br />
					</>
					{/* )} */}
					{/* <a
						href={performance?.url}
						target="_blank"
						rel="noopener noreferrer"
						className="mr-3"
						title="Open Source Video in New Tab"
					>
						<FontAwesomeIcon icon={faYoutube} />
					</a> */}
					<span style={{ textOverflow: 'ellipsis' }}>{performance?.songTitle}</span>
				</span>
			</span>

			<span>{renderSwitch()}</span>
		</>
	);
};
export default SongListItem;
