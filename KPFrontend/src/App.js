import React from 'react';
import { useState, useEffect } from 'react';
import Home from './Home';
import Menu from './Menu';
import NoParty from './NoParty';
import PartyService from './services/PartyService';

const App = () => {
	const [party, setParty] = useState({});
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});

	function updateParty(party) {
		PartyService.storeParty(party);
		setParty(party);
	}

	function leaveParty(){
		setParty({});
	}

	useEffect(() => {
		async function load() {
			let party = await PartyService.loadStored();
			setParty(party);
			setLoading(false);
		}
		load();
	}, []);

	let contents = loading
		? <div>Loading...</div>
		: !(party.partyKey)
		? <NoParty updateParty={updateParty} setUser={setUser}/>
		: <Home party={party}/>;
	
	return (
		<div className="container" style={{padding: "5px",maxWidth: "900px"}}>
			{party.partyKey && <Menu user={user} leaveParty={leaveParty}/>}
			{contents}
		</div>
	);
}
export default App;