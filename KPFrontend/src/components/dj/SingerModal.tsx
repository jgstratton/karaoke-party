import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import SingerApi from '../../api/SingerApi';
import { selectPartyKey } from '../../slices/partySlice';
import { addSinger, selectSingerDetailsById } from '../../slices/singerSlice';
import { RootState } from '../../store';
import styles from './NewSingerModal.module.css';

interface props {
	show: boolean;
	singerId: number;
	handleClose: () => void;
}

const SingerModal = ({ show, singerId, handleClose }: props) => {
	const dispatch = useDispatch();
	const [singerName, setSingerName] = useState('');
	const [singerPosition, setSingerPosition] = useState(1);
	const [showNameWarning, setShowNameWarning] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const partyKey = useSelector(selectPartyKey);
	const singerDetails = useSelector((state: RootState) => selectSingerDetailsById(state, singerId));
	const resetForm = () => {
		setSingerName(singerDetails.name);
		setSingerPosition(singerDetails.rotationNumber);
		setShowErrorMessage(false);
		setShowNameWarning(false);
	};

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const handleCancel = () => {
		resetForm();
		handleClose();
	};

	const handleSave = async () => {
		if (singerName.length === 0) {
			setShowNameWarning(true);
			return;
		}
		const newSinger = await SingerApi.addSinger(partyKey, {
			name: singerName,
			rotationNumber: singerPosition,
		});
		if (newSinger.ok) {
			dispatch(addSinger(newSinger.value));
			handleCancel();
		} else {
			setShowErrorMessage(true);
			setErrorMessage(newSinger.error);
		}
	};

	return (
		<Modal className={styles.settingsModal} size="lg" show={show} backdrop="static">
			<Modal.Header>
				<Modal.Title>Singer Details</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group className="mb-3">
					<Form.Label>Singer's Name</Form.Label>
					<Form.Control
						type="text"
						name="singerName"
						value={singerName}
						onChange={(e) => setSingerName(e.target.value)}
					/>
					<Form.Text className="text-muted">Note: Singer names must be unique.</Form.Text>
					{showNameWarning && (
						<p className="text-danger">You must provide a singer's name to add to the rotation</p>
					)}
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Rotation Position</Form.Label>
					<Form.Select
						aria-label="Default select example"
						onChange={(e) => setSingerPosition(parseInt(e.target.value))}
					>
						<option value="1">1 - (Add to start of rotation)</option>
					</Form.Select>
					<Form.Text className="text-muted">Where in the rotation would you like to add the singer</Form.Text>
					{showNameWarning && (
						<p className="text-danger">You must provide a singer's name to add to the rotation</p>
					)}
				</Form.Group>
				{showErrorMessage && (
					<Alert variant={'danger'}>
						<FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
						{errorMessage}
					</Alert>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleCancel}>
					Close
				</Button>
				<Button variant="primary" onClick={handleSave}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SingerModal;
