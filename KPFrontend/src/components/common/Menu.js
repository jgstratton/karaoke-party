import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList12, faSearch, faFolderOpen, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { reset as resetUser } from '../../slices/userSlice';
import { reset as resetParty } from '../../slices/partySlice';
import { reset as resetPerformances } from '../../slices/performancesSlice';
import StorageService from '../../services/StorageService';

const Menu = () => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	function leaveParty() {
		StorageService.forgetParty();
		StorageService.forgetUser();
		dispatch(resetUser());
		dispatch(resetParty());
		dispatch(resetPerformances());
	}

	return (
		<Nav>
			<Nav.Link onClick={() => navigate('/home')}>
				<FontAwesomeIcon icon={faHome} fixedWidth /> Home
			</Nav.Link>
			<Nav.Link onClick={() => navigate('/queue')}>
				<FontAwesomeIcon icon={faList12} fixedWidth /> Queue
			</Nav.Link>
			<Nav.Link onClick={() => navigate('/search')}>
				<FontAwesomeIcon icon={faSearch} fixedWidth /> Search
			</Nav.Link>
			<Nav.Link onClick={() => navigate('/browse')}>
				<FontAwesomeIcon icon={faFolderOpen} fixedWidth /> Browse
			</Nav.Link>
			<Nav.Link>
				<FontAwesomeIcon icon={faMicrophone} fixedWidth /> {user.name}
			</Nav.Link>
			<Nav.Link onClick={leaveParty}>Leave Party</Nav.Link>
		</Nav>
	);
};

export default Menu;
