import PartyApi from '../api/PartyApi';

async function loadParty() {
	const partyKey = localStorage.getItem('partyKey');
	if (partyKey) {
		const partyResponse = await PartyApi.fetchParty(partyKey);
		// if the party key was not valid then remove saved settings
		if (!partyResponse.ok) {
			localStorage.clear();
			return null;
		}
		return partyResponse.value;
	}
	return null;
}

function getPartyKey() {
	return localStorage.getItem('partyKey');
}

function storeParty(party) {
	localStorage.setItem('partyKey', party.partyKey);
}

function forgetParty() {
	localStorage.removeItem('partyKey');
}

async function loadUser() {
	const id = localStorage.getItem('userId');
	if (id) {
		const response = await fetch(`user/${id}`);
		const userObj = await response.json();
		const isDj = localStorage.getItem('isDj');
		if (isDj) {
			userObj.isDj = true;
		}
		return await userObj;
	}
	return null;
}

function storeUser(user) {
	localStorage.setItem('userId', user.userId);
	if (user.isDj) {
		localStorage.setItem('isDj', true);
	}
}

function forgetUser() {
	localStorage.removeItem('userId');
	localStorage.removeItem('isDj');
}

const StorageService = {
	loadParty,
	storeParty,
	forgetParty,
	loadUser,
	storeUser,
	forgetUser,
	getPartyKey,
};

export default StorageService;
