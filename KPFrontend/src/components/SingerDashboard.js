import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Upcoming from './singer/Upcoming';
import Menu from './common/Menu';
import Player from './singer/Player';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import { selectPlayerSettings } from '../slices/playerSlice';

const SingerDashboard = (props) => {
	const navigate = useNavigate();
	const playerSettings = useSelector(selectPlayerSettings);
	return (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			<Menu />
			<div className="mb-2 text-right">
				<Button className="bg-success" onClick={() => navigate('/search')}>
					Request a song
				</Button>
			</div>
			<Card className="mb-2">
				<Card.Body>
					<Card.Title>Now Performing</Card.Title>
					<Card.Text className="text-warning">
						<Player />
					</Card.Text>
				</Card.Body>
			</Card>
			{playerSettings.splashScreenUpcomingCount > 0 && (
				<Card>
					<Card.Body>
						<Card.Title>On Deck</Card.Title>
						<Card.Text>
							<Upcoming />
						</Card.Text>
					</Card.Body>
				</Card>
			)}
		</div>
	);
};
export default SingerDashboard;
