import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import styles from './PlayerControlsModal.module.css';
import PlayerMainControls from "./dashboard/PlayerMainControls";

interface props {
	show: boolean;
	handleClose: () => void;
}

const PlayerSettingsModal = ({ show, handleClose }: props) => {

	const handleCancel = () => {
		handleClose();
	};

	return (
		<>
			<Modal className={styles.settingsModal} size="lg" show={show} backdrop="static">
				<Modal.Header closeButton onHide={handleClose}>
					<Modal.Title>Player Controls</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col md={2} className="d-flex align-items-center">
							<p>Main Controls</p>
						</Col>
						<Col md={10}>
							<Card className="border-secondary">
								<Card.Body>
									<PlayerMainControls />
								</Card.Body>
							</Card>
						</Col>
					</Row>

				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancel}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
export default PlayerSettingsModal;