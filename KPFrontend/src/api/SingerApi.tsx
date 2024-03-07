import SingerDTO from '../dtoTypes/SingerDTO';
import { Result, validateResult } from './Result';

const addSinger = async (partyKey: string, singer: SingerDTO): Promise<Result<SingerDTO>> =>
	await validateResult(
		await fetch(`party/${partyKey}/singer`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(singer),
		}),
		(body) => (body.singerId ?? 0) > 0,
		'Something went wrong when trying to add the singer'
	);

const getSinger = async (partyKey: string, singerId: number): Promise<Result<SingerDTO>> =>
	await validateResult(
		await fetch(`party/${partyKey}/singer/${singerId}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}),
		(body) => (body.singerId ?? 0) > 0,
		'Something went wrong when trying to get the singer details'
	);

const getSingers = async (partyKey: string): Promise<Result<SingerDTO[]>> =>
	await validateResult(
		await fetch(`party/${partyKey}/singers`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}),
		(body) => Array.isArray(body),
		'Something went wrong when trying to fetch the singers list'
	);

const updateSinger = async (partyKey: string, singer: SingerDTO): Promise<Result<SingerDTO>> =>
	await validateResult(
		await fetch(`party/${partyKey}/singer/${singer.singerId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(singer),
		}),
		(body) => (body.singerId ?? 0) > 0,
		'Something went wrong when trying to update the singer'
	);

const deleteSinger = async (partyKey: string, singerId: number): Promise<Result<boolean>> =>
	await validateResult(
		await fetch(`party/${partyKey}/singer/${singerId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}),
		() => true,
		'Error deleting singer'
	);

const moveToLast = async (partyKey: string, singerId: number): Promise<Result<SingerDTO[]>> =>
	await validateResult(
		await fetch(`party/${partyKey}/singer/${singerId}/moveToLast`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}),
		() => true,
		'Error moving singer in rotation'
	);

const autoMoveSinger = async (partyKey: string, singerId: number): Promise<Result<SingerDTO[]>> =>
	await validateResult(
		await fetch(`party/${partyKey}/singer/${singerId}/autoMoveSinger`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}),
		() => true,
		'Error moving singer in rotation'
	);

const SingerApi = {
	addSinger,
	getSinger,
	getSingers,
	updateSinger,
	deleteSinger,
	moveToLast,
	autoMoveSinger,
};

export default SingerApi;
