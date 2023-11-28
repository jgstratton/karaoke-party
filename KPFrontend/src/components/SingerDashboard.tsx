import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Upcoming from './singer/Upcoming';
import Menu from './common/Menu';
import Player from './singer/Player';
import { Button } from 'react-bootstrap';
import { selectPlayerSettings } from '../slices/playerSlice';

const SingerDashboard = () => {
	const navigate = useNavigate();
	const settings = useSelector(selectPlayerSettings);
	return (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			<Menu />
			<div className="clearfix">
				<div className="float-right pb-2">
					<Button className="bg-success ml-2" onClick={() => navigate('/search')}>
						Request a song
					</Button>
				</div>
				<h6 className="ml-2 mb-0 pt-3">Now Performing</h6>
			</div>

			<div className="text-warning mb-4">
				<Player />
			</div>

			{settings.splashScreenUpcomingCount > 0 && (
				<>
					<h6 className="ml-2">On Deck</h6>
					<div className="mb-2">
						<Upcoming />
					</div>
				</>
			)}
			<Button className="btn btn-link" onClick={() => navigate('/MyRequests')}>
				View your requests
			</Button>
		</div>
	);
};
export default SingerDashboard;
