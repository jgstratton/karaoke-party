import { CreatePartyResponse } from '../dtoTypes/CreatePartyResponse';
import PartyDTO from '../dtoTypes/PartyDTO';
import { fetchOrThrowResult, Result, validateResult } from './Result';

const createParty = async (title: string, djName: string, password: string): Promise<Result<CreatePartyResponse>> =>
	await validateResult(
		await fetch('party', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: title,
				djName: djName,
				password: password,
			}),
		}),
		(body) => body.party && body.party.partyKey,
		'error creating party'
	);

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
	createParty,
	fetchParty,
	fetchPartyOrThrow,
};

export default PartyApi;
