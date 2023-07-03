import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectRotationSize } from '../../slices/singerSlice';
import styles from './NewSingerModal.module.css';
import { selectCurrentSinger } from '../../slices/combinedSelectors';
import { AddNewSinger } from '../../mediators/SingerMediator';
interface props {
	show: boolean;
	handleClose: () => void;
}

const NewSingerModal = ({ show, handleClose }: props) => {
	const [singerName, setSingerName] = useState('');
	const [singerPosition, setSingerPosition] = useState(1);
	const [showNameWarning, setShowNameWarning] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const rotationSize = useSelector(selectRotationSize);
	const curSinger = useSelector(selectCurrentSinger);

	useEffect(() => {
		setSingerPosition(rotationSize + 1);
	}, [rotationSize]);

	const resetForm = () => {
		setSingerName('');
		setSingerPosition(1);
		setShowErrorMessage(false);
		setShowNameWarning(false);
	};

	const handleCancel = () => {
		resetForm();
		handleClose();
	};

	const handleSave = async () => {
		if (singerName.length === 0) {
			setShowNameWarning(true);
			return;
		}
		const newSingerResult = await AddNewSinger({
			name: singerName,
			rotationNumber: singerPosition,
			isPaused: false,
		});

		if (!newSingerResult.ok) {
			setShowErrorMessage(true);
			setErrorMessage(newSingerResult.error);
			return;
		}
		handleCancel();
	};

	return (
		<Modal className={styles.settingsModal} size="lg" show={show} backdrop="static">
			<Modal.Header>
				<Modal.Title>Add Singer to Rotation</Modal.Title>
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
						value={singerPosition}
						aria-label="Default select example"
						onChange={(e) => setSingerPosition(parseInt(e.target.value))}
					>
						{[...Array(rotationSize)].map((x, i) => (
							<option value={i + 1}>
								{i + 1}
								{1 === i + 1 && ' (Add to start of the rotation)'}
								{!!curSinger && curSinger.rotationNumber === i + 1 && ' (Add before current singer)'}
								{!!curSinger && curSinger.rotationNumber === i && ' (Add after current singer)'}
							</option>
						))}
						<option value={rotationSize + 1}>{rotationSize + 1} - (Add to end of the rotation)</option>
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
export default NewSingerModal;
