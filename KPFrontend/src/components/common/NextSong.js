import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'

const NextSong = (props) => {
	return (
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
	)
}
export default NextSong;
