import { faCheck, faDownLong, faEllipsis, faMusic, faTrash, faUpLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Badge, Dropdown } from 'react-bootstrap';
import PerformanceDTO from '../../../dtoTypes/PerformanceDTO';
import StatusService from '../../../services/StatusService';
import React, { ReactNode } from 'react';

interface iProps {
	children?: ReactNode;
	performance: PerformanceDTO;
	index: number;
	className?: string;
	allowMoveUp: boolean;
	allowMoveDown: boolean;
	allowDelete: boolean;
	handleMoveUp: (performanceId: number) => void;
	handleMoveDown: (performanceId: number) => void;
	handleDelete: (performanceId: number) => void;
}

const SongListItem = ({
	performance,
	index,
	allowMoveUp,
	allowMoveDown,
	allowDelete,
	handleMoveUp,
	handleMoveDown,
	handleDelete,
	className = '',
}: iProps) => {
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

	type CustomToggleProps = {
		children?: React.ReactNode;
		onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};
	};

	const CustomToggle = React.forwardRef((props: CustomToggleProps, ref: React.Ref<HTMLButtonElement>) => (
		<button
			className="btn btn-link"
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				if (props.onClick) {
					props.onClick(e);
				}
			}}
		>
			<FontAwesomeIcon icon={faEllipsis} />
		</button>
	));

	return (
		<>
			<span className={className}>{index + 1}</span>
			<span className={className} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
				<span>
					<a
						href={performance?.url}
						target="_blank"
						rel="noopener noreferrer"
						className="mr-3"
						title="Open Source Video in New Tab"
					>
						<FontAwesomeIcon icon={faYoutube} />
					</a>
					<span style={{ textOverflow: 'ellipsis' }}>{performance?.songTitle}</span>
					<>
						<br />
						<span className="text-warning">{performance.singerName}</span>
					</>
				</span>
			</span>

			<span>{renderSwitch()}</span>
			<span className="text-right">
				{(allowMoveUp || allowMoveDown || allowDelete) && (
					<Dropdown>
						<Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic"></Dropdown.Toggle>

						<Dropdown.Menu>
							{allowMoveUp && (
								<Dropdown.Item as="button" onClick={() => handleMoveUp(performance.performanceId)}>
									<FontAwesomeIcon icon={faUpLong} /> Move Up
								</Dropdown.Item>
							)}
							{allowMoveDown && (
								<Dropdown.Item as="button" onClick={() => handleMoveDown(performance.performanceId)}>
									<FontAwesomeIcon icon={faDownLong} /> Move Down
								</Dropdown.Item>
							)}

							<Dropdown.Divider />
							{allowDelete && (
								<Dropdown.Item as="button" onClick={() => handleDelete(performance.performanceId)}>
									<FontAwesomeIcon icon={faTrash} /> Delete
								</Dropdown.Item>
							)}
						</Dropdown.Menu>
					</Dropdown>
				)}
			</span>
		</>
	);
};
export default SongListItem;
