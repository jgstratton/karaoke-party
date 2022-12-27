
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
	alert('error fetching party');
}

async function joinParty(partyKey, singerName) {
	const response = await fetch(`party/join/${partyKey}?` + new URLSearchParams({
		name: singerName,
	}));
	let singer = await response.json();
	if (singer.singerId) {
		return singer;
	}
	alert('error joining party');
}

async function createParty(title, djName) {
	let response = await fetch("party", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}, 
		body: JSON.stringify({
			title: title,
			djName: djName
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
	fetchParty,
	joinParty
}

export default PartyService;