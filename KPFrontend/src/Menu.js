import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faList12, faSearch, faFolderOpen, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import Nav from 'react-bootstrap/Nav';

const Menu = (props) => {

	return (
		<Nav>
			<Nav.Link href="/">
				<FontAwesomeIcon icon={faHome} fixedWidth/> Home
			</Nav.Link>
			<Nav.Link href="/queue">
				<FontAwesomeIcon icon={faList12} fixedWidth/> Queue
			</Nav.Link>
			<Nav.Link href="/search">
				<FontAwesomeIcon icon={faSearch} fixedWidth/> Search
			</Nav.Link>
			<Nav.Link href="/browse">
				<FontAwesomeIcon icon={faFolderOpen} fixedWidth/> Browse
			</Nav.Link>
			<Nav.Link href="/browse" style={{marginLeft: "auto"}}>
				<FontAwesomeIcon icon={faMicrophone} fixedWidth/> {props.user.name}
			</Nav.Link>
			<Nav.Link onClick={props.leaveParty}>
				Leave Party
			</Nav.Link>
		</Nav>
	);
}

export default Menu;