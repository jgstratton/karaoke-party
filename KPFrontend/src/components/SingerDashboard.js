import React from 'react';
import NextSong from './singer/Upcoming';
import Menu from './common/Menu';
import Title from './common/Title';
import Player from './singer/Player';
import Card from 'react-bootstrap/Card';

const SingerDashboard = (props) => {
	return (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			<Menu />
			<Title />
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
						<NextSong />
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};
export default SingerDashboard;
