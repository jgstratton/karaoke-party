import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

const NowPlaying = (props) => {

	return (
		<Card>
			<Card.Body>
				<Card.Title>Now Playing</Card.Title>
				<Card.Text className="text-warning">
					Nothing is playing right now
				</Card.Text>
				<Button variant="primary">Go somewhere</Button>
			</Card.Body>
		</Card>
	)
}
export default NowPlaying;