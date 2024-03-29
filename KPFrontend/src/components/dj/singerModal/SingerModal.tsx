import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import StatusService from '../../../services/StatusService';
import { selectRotationSize, selectSingerDetailsById } from '../../../slices/singerSlice';
import { RootState } from '../../../store';
import styles from './SingerModal.module.css';
import SingerModalPerformance from './SingerModalPerformance';
import classNames from 'classnames';
import PerformanceDTO from '../../../dtoTypes/PerformanceDTO';
import Overlay from '../../common/Overlay';
import Loading from '../../common/Loading';
import { SaveSingerChanges } from '../../../mediators/SingerMediator';
interface props {
	show: boolean;
	singerId: number;
	handleClose: () => void;
}

const SingerModal = ({ show, singerId, handleClose }: props) => {
	const [singerName, setSingerName] = useState('');
	const [singerPosition, setSingerPosition] = useState(1);
	const [performances, setPerformances] = useState<PerformanceDTO[]>([]);
	const [showNameWarning, setShowNameWarning] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const singerDetails = useSelector((state: RootState) => selectSingerDetailsById(state, singerId));
	const rotationSize = useSelector(selectRotationSize);

	const resetForm = () => {
		setIsLoading(false);
		setSingerName(singerDetails.name);
		setSingerPosition(singerDetails.rotationNumber);
		setPerformances(singerDetails.performances);
		setShowErrorMessage(false);
		setShowNameWarning(false);
		console.log(performances);
	};

	useEffect(() => {
		console.log('resetting form');
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
		setIsLoading(true);

		const saveResult = await SaveSingerChanges(
			{
				singerId: singerDetails.singerId,
				name: singerName,
				rotationNumber: singerPosition,
				isPaused: singerDetails.isPaused,
			},
			performances.map((p) => ({ ...p }))
		);

		if (!saveResult.ok) {
			setShowErrorMessage(true);
			setErrorMessage(saveResult.error);
			setIsLoading(false);
			return;
		}

		handleCancel();
	};

	const moveItem = (objArray: any[], fromIndex: number, toIndex: number) => {
		const item = objArray.splice(fromIndex, 1)[0];
		objArray.splice(toIndex, 0, item);
	};

	const handleMoveUp = (performanceId: number) => {
		const clonePerformances: PerformanceDTO[] = [...performances];
		const targetIndex = clonePerformances.findIndex((p) => p.performanceId === performanceId);
		moveItem(clonePerformances, targetIndex, targetIndex - 1);
		setPerformances(clonePerformances);
	};

	const handleMoveDown = (performanceId: number) => {
		const clonePerformances: PerformanceDTO[] = [...performances];
		const targetIndex = clonePerformances.findIndex((p) => p.performanceId === performanceId);
		moveItem(clonePerformances, targetIndex, targetIndex + 1);
		setPerformances(clonePerformances);
	};

	const handleDeletePerformance = (performanceId: number) => {
		let clonePerformances: PerformanceDTO[] = performances.map((p) => ({ ...p }));
		const targetIndex = clonePerformances.findIndex((p) => p.performanceId === performanceId);
		clonePerformances[targetIndex].deleteFlag = true;
		setPerformances(clonePerformances);
	};

	return (
		<>
			{isLoading && (
				<Overlay>
					<Loading>Saving changes... </Loading>
				</Overlay>
			)}

			<Modal className={styles.settingsModal} size="lg" show={show} backdrop="static">
				<Modal.Header>
					<Modal.Title style={{ width: '100%' }}>
						Singer Details
						<div className="float-right" style={{ fontSize: '16px' }}>
							{singerDetails.isPaused && (
								<>
									<Badge bg="danger" className="mr-3">
										PAUSED
									</Badge>
									<span className="text-muted">(Singer will be skipped in rotation)</span>
								</>
							)}
						</div>
					</Modal.Title>
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
								onChange={(e) => {
									console.log('Singer Position', e.target.value);
									setSingerPosition(parseInt(e.target.value));
								}}
							>
								{[...Array(rotationSize)].map((x, i) => (
									<option key={i} value={i + 1}>
										{i + 1}
									</option>
								))}
							</Form.Select>
							{showNameWarning && (
								<p className="text-danger">You must provide a singer's name to add to the rotation</p>
							)}
						</Form.Group>
					</Row>
					<div className={styles.listContents}>
						{performances.map((p, i) => {
							const allowMoveUp =
								p.status === StatusService.queued &&
								i > performances.findIndex((p) => p.status === StatusService.queued);
							const allowMoveDown = p.status === StatusService.queued && i < performances.length - 1;
							const allowDelete = p.status === StatusService.queued;
							return (
								!(p.deleteFlag ?? false) && (
									<div
										key={p.performanceId}
										className={classNames([styles.listContainer, styles.toggle])}
									>
										<SingerModalPerformance
											performance={p}
											index={i}
											allowMoveDown={allowMoveDown}
											allowMoveUp={allowMoveUp}
											allowDelete={allowDelete}
											handleMoveDown={handleMoveDown}
											handleMoveUp={handleMoveUp}
											handleDelete={handleDeletePerformance}
										/>
									</div>
								)
							);
						})}
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
						Close (without saving)
					</Button>
					<Button variant="primary" onClick={handleSave}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default SingerModal;
