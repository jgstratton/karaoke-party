import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faList12, faSearch, faFolderOpen, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from "react-router-dom";

const Menu = (props) => {
	const navigate = useNavigate();
	return (
		<Nav>
			<Nav.Link onClick={() => navigate('/home')}>
				<FontAwesomeIcon icon={faHome} fixedWidth/> Home
			</Nav.Link>
			<Nav.Link onClick={() => navigate('/queue')}>
				<FontAwesomeIcon icon={faList12} fixedWidth/> Queue
			</Nav.Link>
			<Nav.Link onClick={() => navigate('/search')}>
				<FontAwesomeIcon icon={faSearch} fixedWidth/> Search
			</Nav.Link>
			<Nav.Link onClick={() => navigate('/browse')}>
				<FontAwesomeIcon icon={faFolderOpen} fixedWidth/> Browse
			</Nav.Link>
			<Nav.Link >
				<FontAwesomeIcon icon={faMicrophone} fixedWidth/> {props.user.name}
			</Nav.Link>
			<Nav.Link onClick={props.leaveParty}>
				Leave Party
			</Nav.Link>
		</Nav>
	);
}

export default Menu;