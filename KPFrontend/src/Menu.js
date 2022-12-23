import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faList12, faSearch, faFolderOpen, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'

export default class Menu extends Component {
	static displayName = Menu.name;

	constructor(props) {
		super(props);
		this.state = { user: {}, loading: true };
	}

	render() {

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
					<FontAwesomeIcon icon={faMicrophone} fixedWidth/> Mr. Singer
				</Nav.Link>
			</Nav>
		);
	}

	async populateWeatherData() {
		const response = await fetch('weatherforecast');
		const data = await response.json();
		this.setState({ forecasts: data, loading: false });
	}
}
