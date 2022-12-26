import React, { Component } from 'react';
import Home from './Home';
import Menu from './Menu';
import NoParty from './NoParty';
import PartyService from './services/PartyService';

export default class App extends Component {
	static displayName = App.name;

	constructor(props) {
		super(props);
		this.state = { party: {}, loading: true };
	}

	setParty = (party) => {
		PartyService.storeParty(party);
		this.setState({
			party: party,
			loading: false
		});
	}

	leaveParty = () => {
		this.setState({
			party: {},
			loading: false
		});
	}

	async componentDidMount() {
		let party = await PartyService.loadStored();
		this.setState({ party: party, loading: false });
	}

	render() {
		let contents = this.state.loading
			? <div>Loading...</div>
			: !(this.state.party.partyKey)
			? <NoParty setParty={this.setParty}/>
			: <Home party={this.state.party}/>;
		
		return (
			<div className="container" style={{padding: "5px",maxWidth: "900px"}}>
				{this.state.party.partyKey && <Menu user="Need to add users" leaveParty={this.leaveParty}/>}
				{contents}
			</div>
		);
	}
}
