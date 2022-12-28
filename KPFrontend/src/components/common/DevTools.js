import React from 'react';

const DevTools = (props) => {
	function toggleDj(){
		let updatedUser = props.user;
		updatedUser.isDj = !updatedUser.isDj;
		props.setUser(updatedUser);
	}
	return (
		<div style={{backgroundColor: "white", padding: "2px"}}>
			<span style={{color: "black", paddingRight: "3px"}}> {props.user.isDj ? "DJ Mode" : "Singer Mode"}</span>
			<button onClick={toggleDj}>Toggle Dj Mode</button>
		</div>
		
	);
}

export default DevTools;