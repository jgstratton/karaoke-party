import React from 'react';
import { useSelector } from 'react-redux';

const Title = (props) => {
	const party = useSelector((state) => state.party);
	return (
		<h3 className="text-center">
			{party?.title} ({party?.partyKey})
		</h3>
	);
};

export default Title;
