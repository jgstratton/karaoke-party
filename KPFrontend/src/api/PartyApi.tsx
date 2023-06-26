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
	if (!response.ok || !partyReponse.partyKey) {
		return { ok: false, error: partyReponse };
	}
	return { ok: true, value: partyReponse };
};

const fetchPartyOrThrow = async (partyKey: string): Promise<PartyDTO> => fetchOrThrowResult(await fetchParty(partyKey));

const PartyApi = {
	fetchParty,
	fetchPartyOrThrow,
};

export default PartyApi;
