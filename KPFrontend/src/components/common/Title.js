import React from 'react';

const Title = (props) => {
	return (
		<h3 className="text-center">{props.party.title} ({props.party.partyKey})</h3>
	);
}

export default Title;