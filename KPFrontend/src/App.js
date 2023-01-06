import React from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RequireSession from './components/common/RequireSession';
import SingerDashboard from './components/SingerDashboard';
import NoParty from './components/NoParty';
import DJDashboard from './components/DJDashboard';
import StorageService from './services/StorageService';
import DevTools from './components/common/DevTools';
import Search from './components/Search';

const App = () => {
	const [loading, setLoading] = useState(true);
	const [party, setParty] = useState({});
	const [user, setUser] = useState({
		singerId: 0,
		name: '',
		isDj: false,
	});
	const navigate = useNavigate();

	function updateParty(party) {
		let newParty = { ...party };
		StorageService.storeParty(newParty);
		setParty(newParty);
	}

	function updateUser(user) {
		let newUser = { ...user };
		StorageService.storeUser(newUser);
		setUser(newUser);
	}

	function leaveParty() {
		StorageService.forgetParty();
		StorageService.forgetUser();
		setParty({});
		setUser({});
		navigate('/NoParty');
	}

	function updateQueue(queue) {
		let newParty = { ...party };
		newParty.queue = queue.sort((a, b) => a.order - b.order);
		setParty(newParty);
	}

	useEffect(() => {
		async function load() {
			let party = await StorageService.loadParty();
			let user = await StorageService.loadUser();
			updateParty(party);
			updateUser(user);
			setLoading(false);
		}
		load();
	}, []);

	useEffect(() => {
		console.log(party);
	}, [party]);

	return (
		<div>
			{loading ? (
				<div>Loading...</div>
			) : (
				<div>
					<DevTools user={user} setUser={updateUser} />
					<Routes>
						<Route
							path="/"
							element={
								<NoParty party={party} user={user} updateParty={updateParty} setUser={updateUser} />
							}
						/>
						<Route
							path="/NoParty"
							element={
								<NoParty party={party} user={user} updateParty={updateParty} setUser={updateUser} />
							}
						/>
						<Route
							path="home"
							element={
								<RequireSession
									party={party}
									user={user}
									updateParty={updateParty}
									setUser={updateUser}
								>
									{user.isDj ? (
										<DJDashboard
											updateQueue={updateQueue}
											user={user}
											leaveParty={leaveParty}
											party={party}
										/>
									) : (
										<SingerDashboard user={user} leaveParty={leaveParty} party={party} />
									)}
								</RequireSession>
							}
						/>
						<Route
							path="Search"
							element={
								<RequireSession
									party={party}
									user={user}
									updateParty={updateParty}
									setUser={updateUser}
								>
									<Search party={party} user={user} updateParty={updateParty} setUser={updateUser} />
								</RequireSession>
							}
						/>
					</Routes>
				</div>
			)}
		</div>
	);
};
export default App;
