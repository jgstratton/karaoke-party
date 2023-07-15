import { Dropdown } from 'react-bootstrap';
import { SingerSummary, deleteSinger, toggleSinger } from '../../../slices/singerSlice';
import classNames from 'classnames';
import styles from './SingerList.module.css';
import EllipsisToggle from '../../common/EllipsisToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import ConfirmModal from '../../common/ConfirmModal';
import SingerApi from '../../../api/SingerApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectPartyKey } from '../../../slices/partySlice';
import { deleteSingerPerformances } from '../../../slices/performancesSlice';

interface iProps {
	singer: SingerSummary;
	index: number;
	className?: string;
	handleSelectSinger: (singerId: number) => void;
}

const SingerListItem = ({ singer, index, className = '', handleSelectSinger }: iProps) => {
	const dispatch = useDispatch();
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const partyKey = useSelector(selectPartyKey);

	const handleToggleSinger = async () => {
		const updatedSinger = await SingerApi.updateSinger(partyKey, {
			singerId: singer.singerId,
			name: singer.name,
			rotationNumber: singer.rotationNumber,
			isPaused: !singer.isPaused,
		});
		if (!updatedSinger.ok || updatedSinger.value.singerId == null) {
			alert('Error Updating singer');
			return;
		}
		dispatch(toggleSinger({ singerId: updatedSinger.value.singerId ?? 0, isPaused: updatedSinger.value.isPaused }));
	};

	const handleDeleteSinger = async () => {
		const singerId = singer.singerId ?? 0;
		const deleteSingerResponse = await SingerApi.deleteSinger(partyKey, singerId);
		if (!deleteSingerResponse.ok) {
			alert('Error Deleting singer');
			return;
		}
		setShowDeleteConfirmation(false);
		dispatch(deleteSingerPerformances(singerId));
		dispatch(deleteSinger(singerId));
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
