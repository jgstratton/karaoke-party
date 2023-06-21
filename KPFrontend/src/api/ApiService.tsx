import { CreatePartyResponse } from '../dtoTypes/CreatePartyResponse';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import { PerformanceRequestDTO } from '../dtoTypes/PerformanceRequestDTO';
import { SongDTO } from '../dtoTypes/SongDTO';

async function joinParty(partyKey: string, singerName: string) {
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

async function createParty(title: string, djName: string) {
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
	let createPartyResponse: CreatePartyResponse = await response.json();
	if (createPartyResponse.party.partyKey) {
		return createPartyResponse;
	}
	alert('error creating party');
}

async function addSong(song: SongDTO) {
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

async function searchSongs(searchString: string) {
	const response = await fetch(
		`song/search?` +
			new URLSearchParams({
				searchString: searchString,
			})
	);
	return await response.json();
}

async function addPerformance(partyKey: string, performance: PerformanceRequestDTO) {
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

const ApiService = {
	createParty,
	joinParty,
	addSong,
	searchSongs,
	addPerformance,
};

export default ApiService;
