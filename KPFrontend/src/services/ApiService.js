async function fetchParty(partyKey) {
	console.log('fetching party');
	const response = await fetch(
		'party?' +
			new URLSearchParams({
				partyKey: partyKey,
			})
	);
	console.log('fetched', response);
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
	let user = await response.json();
	if (user.userId) {
		return user;
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
	let createPartyResponse = await response.json();
	if (createPartyResponse.party.partyKey) {
		return createPartyResponse;
	}
	alert('error creating party');
}

async function addSong(song) {
	let response = await fetch('song', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(song),
	});
	let reponseSong = await response.json();
	if (reponseSong.fileName) {
		return reponseSong;
	}
	alert('error saving song metadata');
}

async function searchSongs(searchString) {
	const response = await fetch(
		`song/search?` +
			new URLSearchParams({
				searchString: searchString,
			})
	);
	return await response.json();
}

async function addPerformance(partyKey, performance) {
	let response = await fetch(`party/${partyKey}/performance?`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(performance),
	});
	let responseJson = await response.json();
	if (responseJson.performanceId) {
		return responseJson;
	}
	alert('error adding performance');
}

async function updatePerformance(partyKey, performance) {
	let response = await fetch(`party/${partyKey}/performance`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},

		body: JSON.stringify({
			performanceId: performance.performanceId,
			singerId: performance.singer.singerId,
			fileName: performance.song.fileName,
			songCompleted: performance.songCompleted,
			order: performance.order,
		}),
	});
	let responseJson = await response.json();
	if (responseJson.performanceId) {
		return responseJson;
	}
	alert('error adding performance');
}

const ApiService = {
	createParty,
	fetchParty,
	joinParty,
	addSong,
	searchSongs,
	addPerformance,
	updatePerformance,
};

export default ApiService;
