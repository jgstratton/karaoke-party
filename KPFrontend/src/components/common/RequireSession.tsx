import NoParty from '../NoParty';
import { useState, useEffect, PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const RequireSession = (props: PropsWithChildren) => {
	const user = useSelector((state: RootState) => state.user);
	const party = useSelector((state: RootState) => state.party);
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(false);

	useEffect(() => {
		const sessionValid = party.partyKey.length > 0 && (user.userId ?? 0) > 0;
		setLoading(false);
		setValid(sessionValid);
	}, [party, user]);

	return loading ? <div>...Loading</div> : valid ? props.children : <NoParty />;
};
export default RequireSession;
