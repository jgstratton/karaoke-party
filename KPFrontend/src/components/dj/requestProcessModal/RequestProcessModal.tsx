import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Alert, Button, Modal, Pagination } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import PerformanceApi from '../../../api/PerformanceApi';
import { selectPartyKey } from '../../../slices/partySlice';
import { deletePerformance, selectRequests, updatePerformancesSubset } from '../../../slices/performancesSlice';
import ConfirmModal from '../../common/ConfirmModal';
import Overlay from '../../common/Overlay';
import RequestProcessForm from './RequestProcessForm';
import StatusService from '../../../services/StatusService';
import SingerApi from '../../../api/SingerApi';
import { addSinger } from '../../../slices/singerSlice';

interface iProps {
	show: boolean;
	handleClose: () => void;
}

const RequestProcessModal = ({ show, handleClose }: iProps) => {
	const dispatch = useDispatch();

	const [currentReqIndex, setCurrentReqIndex] = useState(0);
	const requests = useSelector(selectRequests);
	const partyKey = useSelector(selectPartyKey);
	const [errorMessage, setErrorMessage] = useState('');
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	const submitForm = async (singerName: string, singerId: number) => {
		const clonedPerformance = { ...requests[currentReqIndex] };
		clonedPerformance.singerId = singerId;
		clonedPerformance.singerName = singerName;
		clonedPerformance.status = StatusService.queued;

		if (singerId === 0) {
			const newSinger = await SingerApi.addSinger(partyKey, {
				name: singerName,
				rotationNumber: 0,
			});
			if (!newSinger.ok) {
				setErrorMessage(newSinger.error);
				return;
			}
			if (!newSinger.value.singerId) {
				setErrorMessage('Issue creating new singer');
				return;
			}
			dispatch(addSinger(newSinger.value));
			clonedPerformance.singerId = newSinger.value.singerId;
		}

		const updatedPerformance = await PerformanceApi.updatePerformance(partyKey, clonedPerformance);

		if (!updatedPerformance.ok) {
			setErrorMessage(updatedPerformance.error);
			return;
		}
		dispatch(updatePerformancesSubset([updatedPerformance.value]));
	};

	const deleteRequest = async () => {
		const deleteResult = await PerformanceApi.deletePerformance(partyKey, requests[currentReqIndex]);

		if (!deleteResult.ok) {
			setErrorMessage(deleteResult.error);
			setShowConfirmDelete(false);
			return;
		}
		setShowConfirmDelete(false);
		if (currentReqIndex === requests.length - 1) {
			setCurrentReqIndex(currentReqIndex - 1);
		} else if (requests.length === 1) {
			handleClose();
		}
		console.log('about to delete', requests.length, currentReqIndex);
		dispatch(deletePerformance(requests[currentReqIndex].performanceId));
	};

	return (
		<>
			<Modal size="lg" show={show} backdrop="static" onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						Add Request to the Queue
						{requests.length > 1 && (
							<div className="ml-4" style={{ display: 'inline-block' }}>
								<Pagination className="mb-0">
									<Pagination.Prev
										disabled={currentReqIndex === 0}
										onClick={() => setCurrentReqIndex(currentReqIndex - 1)}
									/>
									<Pagination.Item disabled={true}>
										{currentReqIndex + 1} of {requests.length} requests
									</Pagination.Item>
									<Pagination.Next
										disabled={currentReqIndex === requests.length - 1}
										onClick={() => setCurrentReqIndex(currentReqIndex + 1)}
									/>
								</Pagination>
							</div>
						)}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{showConfirmDelete && (
						<Overlay>
							<ConfirmModal
								show={showConfirmDelete}
								handleCancel={() => setShowConfirmDelete(false)}
								handleConfirm={() => deleteRequest()}
							>
								<p>You sure you want to delete this request?</p>
								<br />
								<p className="text-warning">
									You got a problem with {requests[currentReqIndex].singerName} or something? I mean,
									if you want to delete their request, that's up to you, you're runnin the show.
								</p>
							</ConfirmModal>
						</Overlay>
					)}
					{errorMessage.length > 0 && (
						<Alert variant={'danger'}>
							<FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
							{errorMessage}
						</Alert>
					)}
					{requests.length > 0 ? (
						<RequestProcessForm
							performance={requests[currentReqIndex]}
							handleDelete={() => setShowConfirmDelete(true)}
							handleSubmit={submitForm}
						/>
					) : (
						<p> That's all the requests there are right now.</p>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default RequestProcessModal;
