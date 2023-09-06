import { Button, Modal, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserIsDj } from '../../slices/userSlice';
import { selectIsPartyInitialized } from '../../slices/partySlice';
import StorageService from '../../services/StorageService';
import styles from './Menu.module.css';
import SettingsModal from '../dj/SettingsModal';
import { useState } from 'react';
import { RootState } from '../../store';
import ConfirmModal from './ConfirmModal';
import NewSingerModal from '../dj/NewSingerModal';
import { selectErrors } from '../../slices/errorSlice';

const Menu = () => {
	const user = useSelector((state: RootState) => state.user);
	const party = useSelector((state: RootState) => state.party);
	const errors = useSelector(selectErrors);

	const isPartyInitialized = useSelector(selectIsPartyInitialized);
	const isDj = useSelector(selectUserIsDj);
	const navigate = useNavigate();

	// dj settings modals control
	const [showDjSettings, setShowDjSettings] = useState(false);
	const [showConfirmLeave, setShowConfirmLeave] = useState(false);
	const [showNewSingerModal, setShowNewSingerModal] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	const handleHideDjSettings = () => setShowDjSettings(false);
	const handleShowDjSettings = () => setShowDjSettings(true);
	const handleShowNewSingerModal = () => setShowNewSingerModal(true);
	const handleHideNewSingerModal = () => setShowNewSingerModal(false);

	function leaveParty() {
		StorageService.forgetParty();
		StorageService.forgetUser();
		window.location.href = './home';
	}

	return (
		<>
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className={styles.navBar}>
				<Navbar.Brand href="#home">
					<div className={user.isDj ? styles.logoTextSmall : styles.logoText}>Karaoke Party</div>
					{isPartyInitialized && (
						<div className={styles.titleText}>
							{party?.title} ({party?.partyKey})
						</div>
					)}
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				{isPartyInitialized && (
					<>
						{isDj ? (
							<Navbar.Collapse id="responsive-navbar-nav">
								<Nav className="me-auto">
									<Nav.Link onClick={() => navigate('/navigateHome')}>Home</Nav.Link>
									<Nav.Link onClick={() => navigate('/search')}>Add Request</Nav.Link>
									<Nav.Link onClick={handleShowNewSingerModal}>Add Singer</Nav.Link>
									<Nav.Link onClick={() => setShowConfirmLeave(true)}>Leave Party</Nav.Link>
									<Nav.Link onClick={() => window.location.reload()}>Refresh Page</Nav.Link>
									<Nav.Link onClick={handleShowDjSettings}>Open DJ Settings</Nav.Link>
									{errors.length > 0 ? (
										<Nav.Link onClick={() => setShowErrors(true)}>View Errors</Nav.Link>
									) : (
										''
									)}
								</Nav>
							</Navbar.Collapse>
						) : (
							<Navbar.Collapse id="responsive-navbar-nav">
								<Nav className="me-auto">
									<Nav.Link onClick={() => window.location.reload()}>Refresh Page</Nav.Link>
									<Nav.Link onClick={() => setShowConfirmLeave(true)}>Leave Party</Nav.Link>
									{errors.length > 0 ? (
										<Nav.Link onClick={() => setShowErrors(true)}>View Errors</Nav.Link>
									) : (
										''
									)}
								</Nav>
							</Navbar.Collapse>
						)}
					</>
				)}
			</Navbar>
			<SettingsModal show={showDjSettings} handleClose={handleHideDjSettings} />
			<NewSingerModal show={showNewSingerModal} handleClose={handleHideNewSingerModal} />

			<ConfirmModal
				show={showConfirmLeave}
				handleCancel={() => setShowConfirmLeave(false)}
				handleConfirm={leaveParty}
			>
				<p>You sure you want to exit the party?</p>
				<br />
				{isDj ? (
					<p className="text-warning">
						As the DJ, if you exit the party you won't be able to regain control of the requests or the
						video player. Make sure this is what you want to do.
					</p>
				) : (
					<p className="text-warning">
						Leaving so soon? If you have songs queued up, let the DJ know you're heading out so they can
						clear up the queue. Or stick around... you don't have anywhere important to be.
					</p>
				)}
			</ConfirmModal>

			<Modal size="lg" show={showErrors} backdrop="static">
				<Modal.Header>{errors.length} Error(s)</Modal.Header>
				<Modal.Body>
					{errors.map((e, i) => (
						<>
							<p className="text-danger">
								{i + 1} - {e}
							</p>
							<hr />
						</>
					))}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowErrors(false)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Menu;
