import ApiService from './ApiService';

async function loadParty() {
	const partyKey = localStorage.getItem('partyKey');
	if (partyKey) {
		return await ApiService.fetchParty(partyKey);
	}
	return {};
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
	const id = localStorage.getItem('singerId');
	if (id) {
		const response = await fetch(
			'singer?' +
				new URLSearchParams({
					singerId: id,
				})
		);
		const userObj = await response.json();
		const isDj = localStorage.getItem('isDj');
		if (isDj) {
			userObj.isDj = true;
		}
		return await userObj;
	}
	return {};
}

function storeUser(user) {
	localStorage.setItem('singerId', user.singerId);
	if (user.isDj) {
		localStorage.setItem('isDj', true);
	}
}

function forgetUser() {
	localStorage.removeItem('singerId');
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
