import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import SingerList from './components/SingerList'
import NowPlaying from './components/NowPlaying'
import Menu from './components/Menu';

const Home = (props) => {

	return (
		<div>
			<Menu user={props.user} leaveParty={props.leaveParty}/>
			<h3 className="text-center">{props.party.title} ({props.party.partyKey})</h3>
			<Row>
				<Col xs={10}>
					<NowPlaying/>
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