import NoParty from '../NoParty'

const RequireSession = (props) => {
	const sessionValid = props.party && props.party.partyKey && props.user && props.user.singerId;
 
	if (!sessionValid) {
		return <NoParty updateParty={props.updateParty} setUser={props.updateUser} />;
	}
	return props.children;
};
export default RequireSession;