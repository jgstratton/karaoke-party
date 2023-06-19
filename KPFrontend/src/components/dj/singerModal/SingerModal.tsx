import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import SingerApi from '../../../api/SingerApi';
import { selectPartyKey } from '../../../slices/partySlice';
import { selectRotationSize, selectSingerDetailsById, updateSinger } from '../../../slices/singerSlice';
import { RootState } from '../../../store';
import styles from './SingerModal.module.css';
import SingerModalPerformance from './SingerModalPerformance';

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
	const rotationSize = useSelector(selectRotationSize);

	const resetForm = () => {
		console.log('resetting form');
		setSingerName(singerDetails.name);
		setSingerPosition(singerDetails.rotationNumber);
		setShowErrorMessage(false);
		setShowNameWarning(false);
	};

	useEffect(() => {
		console.log(singerDetails);
		resetForm();
	}, [singerDetails]);

	const handleCancel = () => {
		resetForm();
		handleClose();
	};

	const handleSave = async () => {
		if (singerName.length === 0) {
			setShowNameWarning(true);
			return;
		}
		const updatedSinger = await SingerApi.updateSinger(partyKey, {
			singerId: singerDetails.singerId,
			name: singerName,
			rotationNumber: singerPosition,
		});
		if (updatedSinger.ok) {
			dispatch(updateSinger(updatedSinger.value));
			handleCancel();
		} else {
			setShowErrorMessage(true);
			setErrorMessage(updatedSinger.error);
		}
	};

	return (
		<Modal className={styles.settingsModal} size="lg" show={show} backdrop="static">
			<Modal.Header>
				<Modal.Title>Singer Details</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Form.Group as={Col} className="mb-3">
						<Form.Label>Singer's Name</Form.Label>
						<Form.Control
							type="text"
							name="singerName"
							value={singerName}
							onChange={(e) => {
								console.log(e.target.value);
								setSingerName(e.target.value);
							}}
						/>
						{showNameWarning && (
							<p className="text-danger">You must provide a singer's name to add to the rotation</p>
						)}
					</Form.Group>
					<Form.Group as={Col} className="mb-3">
						<Form.Label>Rotation Position</Form.Label>
						<Form.Select
							value={singerPosition}
							aria-label="Default select example"
							onChange={(e) => {
								console.log('Singer Position', e.target.value);
								setSingerPosition(parseInt(e.target.value));
							}}
						>
							{[...Array(rotationSize)].map((x, i) => (
								<option value={i + 1}>{i + 1}</option>
							))}
						</Form.Select>
						{showNameWarning && (
							<p className="text-danger">You must provide a singer's name to add to the rotation</p>
						)}
					</Form.Group>
				</Row>
				<hr />
				<div className={styles.listContents}>
					{singerDetails.performances.map((p, i) => (
						<div className={styles.listContainer}>
							<SingerModalPerformance performance={p} index={i} singer={singerDetails} />
						</div>
					))}
				</div>
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
