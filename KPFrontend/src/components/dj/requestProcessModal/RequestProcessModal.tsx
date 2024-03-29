import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MutableRefObject, useRef, useState } from 'react';
import { Alert, Button, Modal, Pagination } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectRequests } from '../../../slices/performancesSlice';
import ConfirmModal from '../../common/ConfirmModal';
import Overlay from '../../common/Overlay';
import RequestProcessForm from './RequestProcessForm';
import { selectSingerList } from '../../../slices/singerSlice';
import {
	AssignRequestToExistingSinger,
	AssignRequestToNewSinger,
	DeleteRequest,
} from '../../../mediators/AssignRequestMediator';

interface iProps {
	show: boolean;
	handleClose: () => void;
}

const RequestProcessModal = ({ show, handleClose }: iProps) => {
	const singers = useSelector(selectSingerList);
	const [currentReqIndex, setCurrentReqIndex] = useState(0);
	const requests = useSelector(selectRequests);
	const [errorMessage, setErrorMessage] = useState('');
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const errorRef = useRef<HTMLDivElement>(null);

	const submitForm = async (singerName: string, singerId: number) => {
		const clonedPerformance = { ...requests[currentReqIndex] };
		clonedPerformance.singerId = singerId;
		clonedPerformance.singerName = singerName;

		const assignResult =
			singerId === 0
				? await AssignRequestToNewSinger(clonedPerformance, singerName)
				: await AssignRequestToExistingSinger(
						clonedPerformance,
						singers.filter((s) => s.singerId === singerId)[0]
				  );

		if (!assignResult.ok) {
			setErrorMessage(assignResult.error);
			errorRef.current?.scrollIntoView();
			return;
		}
		setErrorMessage('');
	};

	const deleteRequest = async () => {
		const deleteResult = await DeleteRequest(requests[currentReqIndex]);
		setShowConfirmDelete(false);

		if (!deleteResult.ok) {
			setErrorMessage(deleteResult.error);
			return;
		}

		if (currentReqIndex === requests.length - 1) {
			setCurrentReqIndex(currentReqIndex - 1);
		} else if (requests.length === 1) {
			handleClose();
		}
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
								{requests[currentReqIndex] && (
									<p className="text-warning">
										You got a problem with {requests[currentReqIndex].singerName} or something? I
										mean, if you want to delete their request, that's up to you, you're runnin the
										show.
									</p>
								)}
							</ConfirmModal>
						</Overlay>
					)}
					{errorMessage.length > 0 && (
						<div ref={errorRef}>
							<Alert variant={'danger'}>
								<FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
								{errorMessage}
							</Alert>
						</div>
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
