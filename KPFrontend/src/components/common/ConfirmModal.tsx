import { PropsWithChildren } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface iProps {
	show: boolean;
	handleCancel: () => void;
	handleConfirm: () => void;
}

const ConfirmModal = ({ show, handleCancel, handleConfirm, children }: PropsWithChildren<iProps>) => {
	return (
		<>
			<Modal size="lg" show={show} backdrop="static">
				<Modal.Body>{children}</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancel}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleConfirm}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ConfirmModal;
