import NoParty from '../NoParty';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const RequireSession = (props) => {
	const user = useSelector((state) => state.user);
	const party = useSelector((state) => state.party);
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(false);

	useEffect(() => {
		const sessionValid = typeof party.partyKey !== 'undefined' && typeof user.singerId !== 'undefined';
		setLoading(false);
		setValid(sessionValid);
		console.log('is session valid?', party, sessionValid);
	}, [party, user]);

	return loading ? <div>...Loading</div> : valid ? props.children : <NoParty />;
};
export default RequireSession;
