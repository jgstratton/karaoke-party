import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SingerList from '../components/SingerList'
import NowPlaying from '../components/NowPlaying'
import NextSong from '../components/NextSong';
import Menu from '../components/Menu';

const DJDashboard = (props) => {

	return (
		<div>
			<Menu user={props.user} leaveParty={props.leaveParty}/>
			<h3 className="text-center">{props.party.title} ({props.party.partyKey})</h3>
			<Row>
				<Col xs={10}>
					<NowPlaying/>
					<NextSong/>
				</Col>
				<Col xs={2}>
					<SingerList singers={props.party.singers}/>
				</Col>
			</Row>
		</div>
	)
}
export default DJDashboard;