import PartyDTO from '../dtoTypes/PartyDTO';
import { fetchOrThrowResult, Result } from './Result';

const fetchParty = async (partyKey: string): Promise<Result<PartyDTO>> => {
	console.log('fetching party');
	const response = await fetch(
		'party?' +
			new URLSearchParams({
				partyKey: partyKey,
			})
	);
	let partyReponse = await response.json();
	if (response.status === 404) {
		return { ok: false, error: '404 - Party not found' };
	}
	if (!response.ok || !partyReponse.partyKey) {
		return { ok: false, error: 'No party' };
	}
	return { ok: true, value: partyReponse };
};

const fetchPartyOrThrow = async (partyKey: string): Promise<PartyDTO> => fetchOrThrowResult(await fetchParty(partyKey));

const PartyApi = {
	fetchParty,
	fetchPartyOrThrow,
};

export default PartyApi;
