import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SingerList from './common/SingerList';
import NowPlaying from './common/NowPlaying';
import NextSong from './common/NextSong';
import Menu from './common/Menu';
import Title from './common/Title';

const DJDashboard = (props) => {
	return (
		<div>
			<Menu user={props.user} leaveParty={props.leaveParty} />
			<Title party={props.party} />
			<Row>
				<Col xs={4}>
					<span>song queue</span>
				</Col>
				<Col xs={4}>
					<NowPlaying />
					<NextSong />
				</Col>
				<Col xs={4}>
					<SingerList singers={props.party.singers} />
				</Col>
			</Row>
		</div>
	);
};
export default DJDashboard;
