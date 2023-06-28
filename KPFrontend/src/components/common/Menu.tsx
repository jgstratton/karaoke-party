import { Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { reset as resetUser, selectUserIsDj } from '../../slices/userSlice';
import { reset as resetParty, selectIsPartyInitialized } from '../../slices/partySlice';
import { resetPerformances, selectRequests } from '../../slices/performancesSlice';
import { resetPlayer } from '../../slices/playerSlice';
import StorageService from '../../services/StorageService';
import styles from './Menu.module.css';
import SettingsModal from '../dj/SettingsModal';
import { useState } from 'react';
import { RootState } from '../../store';
import ConfirmModal from './ConfirmModal';
import NewSingerModal from '../dj/NewSingerModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import RequestProcessModal from '../dj/requestProcessModal/RequestProcessModal';

const Menu = () => {
	const user = useSelector((state: RootState) => state.user);
	const party = useSelector((state: RootState) => state.party);
	const requests = useSelector(selectRequests);
	const isPartyInitialized = useSelector(selectIsPartyInitialized);
	const isDj = useSelector(selectUserIsDj);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// dj settings modals control
	const [showDjSettings, setShowDjSettings] = useState(false);
	const [showConfirmLeave, setShowConfirmLeave] = useState(false);
	const [showNewSingerModal, setShowNewSingerModal] = useState(false);
	const [showRequestProcessModal, setShowRequestProcessModal] = useState(false);

	const handleHideDjSettings = () => setShowDjSettings(false);
	const handleShowDjSettings = () => setShowDjSettings(true);
	const handleShowNewSingerModal = () => setShowNewSingerModal(true);
	const handleHideNewSingerModal = () => setShowNewSingerModal(false);
	const handleShowRequestProcessModal = () => setShowRequestProcessModal(true);
	const handleHideRequestProcessModal = () => setShowRequestProcessModal(false);

	function leaveParty() {
		StorageService.forgetParty();
		StorageService.forgetUser();
		dispatch(resetUser());
		dispatch(resetParty());
		dispatch(resetPerformances());
		dispatch(resetPlayer());
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
									<Nav.Link onClick={() => navigate('/home')}>Home</Nav.Link>
									<Nav.Link onClick={() => navigate('/search')}>Add Request</Nav.Link>
									<Nav.Link onClick={handleShowNewSingerModal}>Add Singer</Nav.Link>
									<Nav.Link onClick={() => setShowConfirmLeave(true)}>Leave Party</Nav.Link>
									<Nav.Link onClick={handleShowDjSettings}>Open DJ Settings</Nav.Link>
								</Nav>
								{requests.length > 0 && (
									<button
										className="btn btn-success"
										onClick={handleShowRequestProcessModal}
										style={{
											boxShadow:
												'0px 1px 2px 0px rgba(0,255,255,0.7),1px 2px 4px 0px rgba(0,255,255,0.7),2px 4px 8px 0px rgba(0,255,255,0.7),2px 4px 16px 0px rgba(0,255,255,0.7);',
										}}
									>
										{requests.length} New Requests <FontAwesomeIcon icon={faExclamation} />
									</button>
								)}
							</Navbar.Collapse>
						) : (
							<Navbar.Collapse id="responsive-navbar-nav">
								<Nav className="me-auto">
									<Nav.Link onClick={() => setShowConfirmLeave(true)}>Leave Party</Nav.Link>
								</Nav>
							</Navbar.Collapse>
						)}
					</>
				)}
			</Navbar>
			<SettingsModal show={showDjSettings} handleClose={handleHideDjSettings} />
			<NewSingerModal show={showNewSingerModal} handleClose={handleHideNewSingerModal} />
			<RequestProcessModal show={showRequestProcessModal} handleClose={handleHideRequestProcessModal} />

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
		</>
	);
};

export default Menu;
