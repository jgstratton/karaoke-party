import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'

const Home = (props) => {

	return (
		<div>
			<h3 className="text-center">{props.party.title}</h3>
			<Card>
				<Card.Body>
					<Card.Title>Now Playing</Card.Title>
					<Card.Text className="text-warning">
						Nothing is playing right now
					</Card.Text>
					<Button variant="primary">Go somewhere</Button>
				</Card.Body>
			</Card>
			<Card>
				<Card.Body>
					<Card.Title>Next Song</Card.Title>
					<Card.Text>
						<div className="text-warning">
							Johnny Cash (Hurt) - Karaoke Version
						</div>
						<FontAwesomeIcon icon={faMicrophone} fixedWidth/> Mr. Singer
					</Card.Text>
					<Button variant="primary">Go somewhere</Button>
				</Card.Body>
			</Card>
		</div>
	)
}
export default Home;