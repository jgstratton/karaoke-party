async function fetchParty(partyKey) {
	const response = await fetch(
		'party?' +
			new URLSearchParams({
				partyKey: partyKey,
			})
	);
	let party = await response.json();
	if (party.partyKey) {
		return party;
	}
	alert('error fetching party');
}

async function joinParty(partyKey, singerName) {
	const response = await fetch(
		`party/${partyKey}/join?` +
			new URLSearchParams({
				name: singerName,
			})
	);
	let singer = await response.json();
	if (singer.singerId) {
		return singer;
	}
	alert('error joining party');
}

async function createParty(title, djName) {
	let response = await fetch('party', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			title: title,
			djName: djName,
		}),
	});
	let party = await response.json();
	if (party.partyKey) {
		return party;
	}
	alert('error creating party');
}

const PartyService = {
	createParty,
	fetchParty,
	joinParty,
};

export default PartyService;
