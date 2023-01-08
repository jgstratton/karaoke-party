import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { populate as populateParty } from './slices/partySlice';
import { populate as populateUser } from './slices/userSlice';
import { populate as populatePerformances } from './slices/performancesSlice';
import { Routes, Route } from 'react-router-dom';
import RequireSession from './components/common/RequireSession';
import SingerDashboard from './components/SingerDashboard';
import NoParty from './components/NoParty';
import DJDashboard from './components/DJDashboard';
import StorageService from './services/StorageService';
import DevTools from './components/common/DevTools';
import Search from './components/Search';

const App = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			let loadedParty = await StorageService.loadParty();
			let loadedUser = await StorageService.loadUser();
			console.log('loaded Party', loadedParty);
			console.log('Loaded User', loadedUser);
			dispatch(populateParty(loadedParty));
			dispatch(populateUser(loadedUser));
			dispatch(populatePerformances(loadedParty.queue));
			setLoading(false);
			console.log('loaded');
		}
		load();
	}, [dispatch]);

	return (
		<div>
			{loading ? (
				<div>Loading...</div>
			) : (
				<div>
					<DevTools />
					<Routes>
						<Route path="/" element={<NoParty />} />
						<Route path="/NoParty" element={<NoParty />} />
						<Route
							path="home"
							element={
								<RequireSession>{user.isDj ? <DJDashboard /> : <SingerDashboard />}</RequireSession>
							}
						/>
						<Route
							path="Search"
							element={
								<RequireSession>
									<Search />
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
