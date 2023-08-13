import PartyApi from '../api/PartyApi';
import { Result } from '../api/Result';
import { CreatePartyResponse } from '../dtoTypes/CreatePartyResponse';
import StorageService from '../services/StorageService';
import { joinHub, populateParty, reset as resetParty } from '../slices/partySlice';
import { populatePerformances, resetPerformances } from '../slices/performancesSlice';
import { populatePlayer, populateSettings } from '../slices/playerSlice';
import { populateSingers } from '../slices/singerSlice';
import { populateUser, reset as resetUser } from '../slices/userSlice';
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
	store.dispatch(joinHub());
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

export const LoadParty = async (): Promise<void> => {
	let loadedParty = await StorageService.loadParty();
	let loadedUser = await StorageService.loadUser();

	if (loadedParty) {
		console.log(loadedParty);
		store.dispatch(populateParty(loadedParty));
		store.dispatch(populatePlayer(loadedParty.player));
		store.dispatch(populateSettings(loadedParty.playerSettings));
	} else {
		store.dispatch(resetParty());
	}

	if (loadedUser) {
		console.log('Loaded User:', loadedUser);
		store.dispatch(populateUser(loadedUser));
	} else {
		store.dispatch(resetUser());
	}

	if (loadedParty && loadedParty.performances) {
		store.dispatch(populatePerformances(loadedParty.performances));
		store.dispatch(populateSingers(loadedParty.singers));
	} else {
		store.dispatch(resetPerformances());
	}
};
