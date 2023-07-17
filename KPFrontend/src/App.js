import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireSession from './components/common/RequireSession';
import SingerDashboard from './components/SingerDashboard';
import NoParty from './components/NoParty';
import DJDashboard from './components/dj/dashboard/DJDashboard';
import Search from './components/Search';
import Player from './components/player/Player';
import KeyPressChecker from './services/KeyPressChecker';
import Offline from './components/common/Offline';
import { ToggleDj } from './mediators/PartyMediator';
import MyRequests from './components/MyRequests/MyRequests';

const App = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const loading = useSelector((state) => !state.party.isLoaded);

	KeyPressChecker(['Shift', 'D', 'J'], () => {
		ToggleDj();
	});

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
								<Offline>
									<RequireSession>{user.isDj ? <DJDashboard /> : <SingerDashboard />}</RequireSession>
								</Offline>
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
							path="MyRequests"
							element={
								<RequireSession>
									<MyRequests />
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
