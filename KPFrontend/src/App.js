import React from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import RequireSession from './components/RequireSession';
import SingerDashboard from './pages/SingerDashboard';
import NoParty from './NoParty';
import DJDashboard from './pages/DJDashboard';
import StorageService from './services/StorageService';
import DevTools from './components/DevTools';

const App = () => {
	const [party, setParty] = useState({});
	const [user, setUser] = useState({
		singerId: 0,
		name: '',
		isDj: false
	});
	const navigate = useNavigate();

	function updateParty(party) {
		let newParty = {...party};
		StorageService.storeParty(newParty);
		setParty(newParty);
	}

	function updateUser(user) {
		let newUser = {...user};
		StorageService.storeUser(newUser);
		setUser(newUser);
	}

	function leaveParty(){
		StorageService.forgetParty();
		StorageService.forgetUser();
		setParty({});
		setUser({});
		navigate('/NoParty');
	}

	useEffect(() => {
		async function load() {
			let party = await StorageService.loadParty();
			let user = await StorageService.loadUser();
			setParty(party);
			setUser(user);
		}
		load();
	}, []);
	
	return (
		<div>
			{console.log("re-render")}
			{console.log(user.isDj)}
			<DevTools user={user} setUser={updateUser}/>
			<Routes>
				<Route path="/" element={ <NoParty updateParty={updateParty} setUser={updateUser}/> } />
				<Route path="/NoParty" element={ <NoParty updateParty={updateParty} setUser={updateUser}/> } />
				<Route path="home" element={
					<RequireSession party={party} user={user} updateParty={updateParty} setUser={updateUser}>
						{user.isDj
							? <DJDashboard user={user} leaveParty={leaveParty} party={party}/>
							: <SingerDashboard user={user} leaveParty={leaveParty} party={party}/>
						}
					</RequireSession>
				} />
			</Routes>
		</div>
	);
}
export default App;