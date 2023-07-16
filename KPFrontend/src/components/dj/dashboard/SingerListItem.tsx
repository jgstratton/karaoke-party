import { Dropdown } from 'react-bootstrap';
import { SingerSummary } from '../../../slices/singerSlice';
import classNames from 'classnames';
import styles from './SingerList.module.css';
import EllipsisToggle from '../../common/EllipsisToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import ConfirmModal from '../../common/ConfirmModal';
import { DeleteSinger, ToggleSinger } from '../../../mediators/SingerMediator';

interface iProps {
	singer: SingerSummary;
	index: number;
	className?: string;
	handleSelectSinger: (singerId: number) => void;
}

const SingerListItem = ({ singer, index, className = '', handleSelectSinger }: iProps) => {
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const handleToggleSinger = async () => {
		const updatedSingerResult = await ToggleSinger(singer);
		if (!updatedSingerResult.ok) {
			alert('Error Updating singer');
			return;
		}
	};

	const handleDeleteSinger = async () => {
		const deleteResult = await DeleteSinger(singer.singerId ?? 0);
		if (!deleteResult.ok) {
			alert('Error Deleting singer');
			return;
		}
		setShowDeleteConfirmation(false);
	};

	return (
		<>
			<span className={className}>
				{index}
				{showDeleteConfirmation && (
					<ConfirmModal
						handleConfirm={handleDeleteSinger}
						show={showDeleteConfirmation}
						handleCancel={() => setShowDeleteConfirmation(false)}
					>
						<p>
							Delete <span className="text-warning">{singer.name}</span> and all of their songs?
						</p>
					</ConfirmModal>
				)}
			</span>
			<span className={className}>
				<span className={singer.isPaused ? 'text-danger' : ''}>{singer.name}</span>
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
						className={singer.isPaused ? 'bg-danger' : 'bg-success'}
						style={{ display: 'inline-block', width: `${singer.queuedCount * 10}px` }}
					>
						&nbsp;
					</span>
				)}
			</span>
			<span className={classNames([styles.showOnHover, styles.hideOnMobile, 'text-right'])}>
				<Dropdown className="float-right">
					<Dropdown.Toggle as={EllipsisToggle} variant="success" id="dropdown-basic"></Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item as="button" onClick={() => handleSelectSinger(singer.singerId ?? 0)}>
							<FontAwesomeIcon icon={faPencil} /> Singer Details
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item as="button" onClick={handleToggleSinger}>
							<FontAwesomeIcon icon={faTrash} /> {singer.isPaused ? 'Unpause Singer' : 'Pause Singer'}
						</Dropdown.Item>
						<Dropdown.Item as="button" onClick={() => setShowDeleteConfirmation(true)}>
							<FontAwesomeIcon icon={faTrash} /> Delete Singer
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</span>
		</>
	);
};
export default SingerListItem;
