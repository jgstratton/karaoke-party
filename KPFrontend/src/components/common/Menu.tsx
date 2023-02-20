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

const Menu = () => {
	const user = useSelector((state: RootState) => state.user);
	const party = useSelector((state: RootState) => state.party);
	const isPartyInitialized = useSelector(selectIsPartyInitialized);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// dj settings modals control
	const [showDjSettings, setShowDjSettings] = useState(false);
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
					<div className={styles.logoText}>Karaoke Party</div>
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
								<Nav.Link onClick={() => navigate('/search')}>Request a song</Nav.Link>
								<Nav.Link onClick={leaveParty}>Leave Party</Nav.Link>
								{user.isDj && (
									<>
										<Nav.Link onClick={handleShowDjSettings}>Open DJ Settings</Nav.Link>
										<Nav>
											<Nav.Link
												className="float-right"
												href="/player"
												target="_blank"
												rel="noopener noreferrer"
											>
												Launch Video Player
											</Nav.Link>
										</Nav>
									</>
								)}
							</Nav>
						</Navbar.Collapse>
					</>
				)}
			</Navbar>
			<SettingsModal show={showDjSettings} handleClose={handleHideDjSettings} />
		</>
	);
};

export default Menu;
