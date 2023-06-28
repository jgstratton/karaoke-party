import { faCheck, faMusic, faPencil, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Badge, Dropdown } from 'react-bootstrap';
import PerformanceDTO from '../../../dtoTypes/PerformanceDTO';
import StatusService from '../../../services/StatusService';
import classNames from 'classnames';
import EllipsisToggle from '../../common/EllipsisToggle';
import styles from './SongList.module.css';
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
			<span className={classNames([className, 'no-wrap'])}>
				<a
					href={performance?.url}
					target="_blank"
					rel="noopener noreferrer"
					className="mr-3"
					title="Open Source Video in New Tab"
				>
					<FontAwesomeIcon icon={faYoutube} />
				</a>
				{performance?.songTitle}
			</span>

			<span>{renderSwitch()}</span>
			<span className={classNames([styles.showOnHover, 'text-right'])}>
				<Dropdown className="float-right">
					<Dropdown.Toggle as={EllipsisToggle} variant="success" id="dropdown-basic"></Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item as="button">
							<FontAwesomeIcon icon={faPencil} /> Song Details
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</span>
		</>
	);
};
export default SongListItem;
