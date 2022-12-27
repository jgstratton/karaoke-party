import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import SingerList from './components/SingerList'

const Home = (props) => {

	return (
		<div>
			<h3 className="text-center">{props.party.title} ({props.party.partyKey})</h3>
			<Row>
				<Col xs={10}>
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
				</Col>
				<Col xs={2}>
					<SingerList singers={props.party.singers}/>
				</Col>
			</Row>
			
		</div>
	)
}
export default Home;