
async function loadStored() {
	const partyKey = localStorage.getItem('partyKey');
	if (partyKey) {
		const response = await fetch('party?' + new URLSearchParams({
			partyKey: partyKey,
		}));
		return await response.json();
	}
	return {};
}

async function fetchParty(partyKey) {
	const response = await fetch('party?' + new URLSearchParams({
		partyKey: partyKey,
	}));
	let party = await response.json();
	if (party.partyKey) {
		return party;
	}
	alert('error joining party');
}

async function createParty(title) {
	let response = await fetch("party", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}, 
		body: JSON.stringify({
			title: title
		})
	});
	let party = await response.json();
	if (party.partyKey) {
		return party;
	}
	alert('error creating party');
}

function storeParty(party) {
	localStorage.setItem('partyKey', party.partyKey);
}
const PartyService = {
	loadStored,
	storeParty,
	createParty,
	fetchParty
}

export default PartyService;