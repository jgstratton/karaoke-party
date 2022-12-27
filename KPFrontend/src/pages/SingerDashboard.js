import React from 'react';
import NowPlaying from '../components/NowPlaying'
import NextSong from '../components/NextSong';
import Menu from '../components/Menu';


const SingerDashboard = (props) => {

	return (
		<div className="container" style={{padding: "5px",maxWidth: "900px"}}>
			<Menu user={props.user} leaveParty={props.leaveParty}/>
			<h3 className="text-center">{props.party.title} ({props.party.partyKey})</h3>
			<NowPlaying/>
			<NextSong/>
		</div>
	)
}
export default SingerDashboard;