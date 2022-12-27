import React from 'react';
import { useState, useEffect } from 'react';
import Home from './Home';
import Menu from './Menu';
import NoParty from './NoParty';
import StorageService from './services/StorageService';

const App = () => {
	const [party, setParty] = useState({});
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});

	function updateParty(party) {
		StorageService.storeParty(party);
		setParty(party);
	}

	function updateUser(user) {
		StorageService.storeUser(user);
		setUser(user);
	}

	function leaveParty(){
		StorageService.forgetParty();
		StorageService.forgetUser();
		setParty({});
		setUser({});
	}

	useEffect(() => {
		async function load() {
			let party = await StorageService.loadParty();
			let user = await StorageService.loadUser();
			setParty(party);
			setUser(user);
			setLoading(false);
		}
		load();
	}, []);

	let contents = loading
		? <div>Loading...</div>
		: !(party.partyKey)
		? <NoParty updateParty={updateParty} setUser={updateUser}/>
		: <Home party={party}/>;
	
	// give more space for the DJ view
	let containerStyle = user.isDj ? {} : {padding: "5px",maxWidth: "900px"};
	let containerClass = user.isDj ? "" : "container";
	return (
		<div className={containerClass} style={containerStyle}>
			{party.partyKey && <Menu user={user} leaveParty={leaveParty}/>}
			{contents}
		</div>
	);
}
export default App;