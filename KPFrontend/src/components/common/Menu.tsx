import { Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { reset as resetUser } from '../../slices/userSlice';
import { reset as resetParty, selectIsPartyInitialized } from '../../slices/partySlice';
import { resetPerformances } from '../../slices/performancesSlice';
import { resetPlayer } from '../../slices/playerSlice';
import StorageService from '../../services/StorageService';
import styles from './Menu.module.css';
import SettingsModal from '../dj/SettingsModal';
import { useState } from 'react';
import { RootState } from '../../store';
import ConfirmModal from './ConfirmModal';

const Menu = () => {
	const user = useSelector((state: RootState) => state.user);
	const party = useSelector((state: RootState) => state.party);
	const isPartyInitialized = useSelector(selectIsPartyInitialized);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// dj settings modals control
	const [showDjSettings, setShowDjSettings] = useState(false);
	const [showConfirmLeave, setShowConfirmLeave] = useState(false);
	const handleHideDjSettings = () => setShowDjSettings(false);
	const handleShowDjSettings = () => setShowDjSettings(true);

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
						<Navbar.Collapse id="responsive-navbar-nav">
							<Nav>
								<Nav.Link onClick={() => navigate('/home')}>Home</Nav.Link>
								<Nav.Link onClick={() => navigate('/search')}>
									{user.isDj ? 'Add Request' : 'Request a song'}
								</Nav.Link>
								<Nav.Link onClick={() => setShowConfirmLeave(true)}>Leave Party</Nav.Link>
								{user.isDj && (
									<>
										<Nav.Link onClick={handleShowDjSettings}>Open DJ Settings</Nav.Link>
									</>
								)}
							</Nav>
						</Navbar.Collapse>
					</>
				)}
			</Navbar>
			<SettingsModal show={showDjSettings} handleClose={handleHideDjSettings} />
			<ConfirmModal
				show={showConfirmLeave}
				handleCancel={() => setShowConfirmLeave(false)}
				handleConfirm={leaveParty}
			>
				<p>You sure you want to exit the party?</p>
				<br />
				<p className="text-warning">
					As the DJ, if you exit the party you won't be able to regain control of the requests or the video
					player. Make sure this is what you want to do.
				</p>
			</ConfirmModal>
		</>
	);
};

export default Menu;
