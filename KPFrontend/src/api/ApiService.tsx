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

const ApiService = {
	joinParty,
	addSong,
	searchSongs,
};

export default ApiService;
