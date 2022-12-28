import React from 'react';
import NowPlaying from './common/NowPlaying';
import NextSong from './common/NextSong';
import Menu from './common/Menu';
import Title from './common/Title';

const SingerDashboard = (props) => {
	return (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			<Menu user={props.user} leaveParty={props.leaveParty} />
			<Title party={props.party} />
			<NowPlaying />
			<NextSong />
		</div>
	);
};
export default SingerDashboard;
