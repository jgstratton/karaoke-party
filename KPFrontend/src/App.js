import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { populateParty, reset as resetParty } from './slices/partySlice';
import { populateUser, reset as resetUser, toggleDj } from './slices/userSlice';
import { populatePlayer, populateSettings } from './slices/playerSlice';
import { populatePerformances, resetPerformances } from './slices/performancesSlice';
import { setPosition, setLength } from './slices/playerSlice';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireSession from './components/common/RequireSession';
import SingerDashboard from './components/SingerDashboard';
import NoParty from './components/NoParty';
import DJDashboard from './components/DJDashboard';
import StorageService from './services/StorageService';
import Search from './components/Search';
import Player from './components/player/Player';
import KeyPressChecker from './services/KeyPressChecker';

const App = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		KeyPressChecker(['Shift', 'D', 'J'], () => {
			dispatch(toggleDj());
		});

		async function load() {
			let loadedParty = await StorageService.loadParty();
			let loadedUser = await StorageService.loadUser();

			if (loadedParty) {
				console.log(loadedParty);
				dispatch(populateParty(loadedParty));
				dispatch(populatePlayer(loadedParty));
				dispatch(populateSettings(loadedParty));
				dispatch(setPosition(loadedParty.videoPosition));
				dispatch(setLength(loadedParty.videoLength));
			} else {
				dispatch(resetParty(loadedParty));
			}

			if (loadedUser) {
				console.log('Loaded User:', loadedUser);
				dispatch(populateUser(loadedUser));
			} else {
				dispatch(resetUser(loadedUser));
			}

			if (loadedParty && loadedParty.queue) {
				dispatch(populatePerformances(loadedParty.queue));
			} else {
				dispatch(resetPerformances());
			}
			setLoading(false);
		}
		load();
	}, [dispatch]);

	return (
		<div>
			{loading ? (
				<div>Loading...</div>
			) : (
				<div>
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
						<Route
							path="Player"
							element={
								<RequireSession>
									<Player />
								</RequireSession>
							}
						/>
						<Route path="/redirectHome" element={<Navigate to="/home" />} />
					</Routes>
				</div>
			)}
		</div>
	);
};
export default App;
