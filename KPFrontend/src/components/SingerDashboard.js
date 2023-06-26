import Upcoming from './singer/Upcoming';
import Menu from './common/Menu';
import Player from './singer/Player';
import Card from 'react-bootstrap/Card';

const SingerDashboard = (props) => {
	return (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			<Menu />
			<Card className="mb-2">
				<Card.Body>
					<Card.Title>Now Performing</Card.Title>
					<Card.Text className="text-warning">
						<Player />
					</Card.Text>
				</Card.Body>
			</Card>
			<Card>
				<Card.Body>
					<Card.Title>On Deck</Card.Title>
					<Card.Text>
						<Upcoming />
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};
export default SingerDashboard;
