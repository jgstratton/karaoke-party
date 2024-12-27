import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireSession from './components/common/RequireSession';
import SingerDashboard from './components/SingerDashboard';
import NoParty from './components/NoParty';
import DJDashboard from './components/dj/dashboard/DJDashboard';
import Search from './components/Search';
import Offline from './components/common/Offline';
import MyRequests from './components/MyRequests/MyRequests';
import TestApi from './components/dj/playground/TestApi';

const App = () => {
	const user = useSelector((state) => state.user);
	const loading = useSelector((state) => !state.party.isLoaded);

	return (
		<div>
			{loading ? (
				<div>Loading...</div>
			) : (
				<div>
					<Routes>
						<Route path="/" element={<NoParty />} />
						<Route path="/NoParty" element={<NoParty />} />
						{user.isDj ? (
							<Route
								path="djhome"
								element={
									<Offline>
										<RequireSession>
											<DJDashboard />
										</RequireSession>
									</Offline>
								}
							/>
						) : (
							<Route
								path="home"
								element={
									<Offline>
										<RequireSession>
											<SingerDashboard />
										</RequireSession>
									</Offline>
								}
							/>
						)}
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
							path="TestApi"
							element={
								<RequireSession>
									<TestApi />
								</RequireSession>
							}
						/>
						<Route path="*" element={<Navigate to={user.isDj ? '/djHome' : '/home'} />} />
					</Routes>
				</div>
			)}
		</div>
	);
};
export default App;
