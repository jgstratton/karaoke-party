import PartyApi from '../api/PartyApi';
import { Result } from '../api/Result';
import { CreatePartyResponse } from '../dtoTypes/CreatePartyResponse';
import StorageService from '../services/StorageService';
import { populateParty } from '../slices/partySlice';
import { populateSettings } from '../slices/playerSlice';
import { populateUser, setDj } from '../slices/userSlice';
import store from '../store';

export const CreateParty = async (
	title: string,
	djName: string,
	password: string
): Promise<Result<CreatePartyResponse>> => {
	let partyResult = await PartyApi.createParty(title, djName, password);
	if (!partyResult.ok) {
		return partyResult;
	}

	let { party, dj } = partyResult.value;

	// update the store
	store.dispatch(populateUser(dj));
	store.dispatch(populateParty(party));
	store.dispatch(populateSettings(party.playerSettings));

	// store the dj flag and party key
	StorageService.storeUser(dj);
	StorageService.storeParty(party);

	return partyResult;
};

export const ToggleDj = async (): Promise<void> => {
	const curFlag = StorageService.loadDjFlag();
	StorageService.setDjFlag(!curFlag);
	window.location.reload();
};
