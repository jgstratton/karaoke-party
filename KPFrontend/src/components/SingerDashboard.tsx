import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Upcoming from './singer/Upcoming';
import Menu from './common/Menu';
import Player from './singer/Player';
import Card from 'react-bootstrap/Card';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { selectPlayerSettings } from '../slices/playerSlice';
import MyRequests from './MyRequests/MyRequests';

const SingerDashboard = () => {
	const navigate = useNavigate();
	const playerSettings = useSelector(selectPlayerSettings);
	return (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			<Menu />

			<div className="clearfix">
				<div className="float-right pb-2">
					<Button className="btn btn-link" onClick={() => navigate('/MyRequests')}>
						View your requests
					</Button>
					<Button className="bg-success ml-2" onClick={() => navigate('/search')}>
						Request a song
					</Button>
				</div>

				<h5 className="ml-2 pt-2">Now Performing</h5>
			</div>

			<div className="text-warning mb-4">
				<Player />
			</div>

			{playerSettings.splashScreenUpcomingCount > 0 && (
				<>
					<h5>On Deck</h5>
					<div className="mb-2">
						<Upcoming />
					</div>
				</>
			)}
		</div>
	);
};
export default SingerDashboard;
