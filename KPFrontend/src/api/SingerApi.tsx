import SingerDTO from '../dtoTypes/SingerDTO';
import { Result } from './Result';

const addSinger = async (partyKey: string, singer: SingerDTO): Promise<Result<SingerDTO>> => {
	let response = await fetch(`party/${partyKey}/singer`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(singer),
	});

	let responseSinger = await response.json();
	if (!response.ok) {
		return { ok: false, error: responseSinger };
	}
	if (responseSinger.singerId) {
		return { ok: true, value: responseSinger };
	}
	return { ok: false, error: 'Something went wrong when trying to add the singer' };
};

const updateSinger = async (partyKey: string, singer: SingerDTO): Promise<Result<SingerDTO>> => {
	let response = await fetch(`party/${partyKey}/singer/${singer.singerId}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(singer),
	});

	let responseSinger = await response.json();
	if (!response.ok) {
		return { ok: false, error: responseSinger };
	}
	if (responseSinger.singerId) {
		return { ok: true, value: responseSinger };
	}
	return { ok: false, error: 'Something went wrong when trying to update the singer' };
};

const SingerApi = {
	addSinger,
	updateSinger,
};

export default SingerApi;
