import { Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { reset as resetUser } from '../../slices/userSlice';
import { reset as resetParty, selectIsPartyInitialized } from '../../slices/partySlice';
import { resetPerformances } from '../../slices/performancesSlice';
import { resetPlayer } from '../../slices/playerSlice';
import StorageService from '../../services/StorageService';
import styles from './Menu.module.css';

const Menu = () => {
	const user = useSelector((state) => state.user);
	const party = useSelector((state) => state.party);
	const isPartyInitialized = useSelector(selectIsPartyInitialized);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	function leaveParty() {
		StorageService.forgetParty();
		StorageService.forgetUser();
		dispatch(resetUser());
		dispatch(resetParty());
		dispatch(resetPerformances());
		dispatch(resetPlayer());
	}

	return (
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
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav>
						<Nav.Link onClick={() => navigate('/home')}>Home</Nav.Link>
						<Nav.Link onClick={() => navigate('/search')}>Request a song</Nav.Link>

						{user.isDj && (
							<Nav.Link href="/player" target="_blank" rel="noopener noreferrer">
								Launch Video Player
							</Nav.Link>
						)}
						<Nav.Link onClick={leaveParty}>Leave Party</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			)}
		</Navbar>
	);
};

export default Menu;
