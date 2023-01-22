import NoParty from '../NoParty';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const RequireSession = (props) => {
	const user = useSelector((state) => state.user);
	const party = useSelector((state) => state.party);
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(false);

	useEffect(() => {
		const sessionValid = party.partyKey && user.singerId;
		setLoading(false);
		setValid(sessionValid);
	}, [party, user]);

	return loading ? <div>...Loading</div> : valid ? props.children : <NoParty />;
};
export default RequireSession;
