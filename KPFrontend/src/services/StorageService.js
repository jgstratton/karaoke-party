import PartyService from './PartyService'

async function loadParty() {
	const partyKey = localStorage.getItem('partyKey');
	if (partyKey) {
		return await PartyService.fetchParty(partyKey);
	}
	return {};
}

function storeParty(party) {
	localStorage.setItem('partyKey', party.partyKey);
}

function forgetParty() {
	localStorage.removeItem('partyKey');
}

async function loadUser() {
	const id = localStorage.getItem('singerId');
	if (id) {
		const response = await fetch('singer?' + new URLSearchParams({
			singerId: id,
		}));
		return await response.json();
	}
	return {};
}

function storeUser(user) {
	localStorage.setItem('singerId', user.singerId);
}

function forgetUser() {
	localStorage.removeItem('singerId');
}

const StorageService = {
	loadParty,
	storeParty,
	forgetParty,
	loadUser,
	storeUser,
	forgetUser
}

export default StorageService;