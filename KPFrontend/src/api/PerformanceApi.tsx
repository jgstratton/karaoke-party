import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import { PerformanceRequestDTO } from '../dtoTypes/PerformanceRequestDTO';
import { Result } from './Result';

async function updatePerformance(partyKey: string, performance: PerformanceDTO): Promise<Result<PerformanceDTO>> {
	let response = await fetch(`party/${partyKey}/performance`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},

		body: JSON.stringify(performance),
	});
	let responseJson = await response.json();
	if (!response.ok) {
		return { ok: false, error: responseJson };
	}
	if (responseJson.performanceId) {
		return { ok: true, value: responseJson };
	}
	return { ok: false, error: 'Something went wrong when trying to update the performance' };
}

async function deletePerformance(partyKey: string, performance: PerformanceDTO): Promise<Result<boolean>> {
	let response = await fetch(`party/${partyKey}/performance/${performance.performanceId}`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(performance),
	});
	if (response.ok) {
		return { ok: true, value: true };
	}
	return { ok: false, error: 'Something went wrong when trying to delete the performance' };
}

async function addPerformance(partyKey: string, performance: PerformanceRequestDTO): Promise<Result<PerformanceDTO>> {
	let response = await fetch(`party/${partyKey}/performance?`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(performance),
	});

	let responseJson = await response.json();
	if (!response.ok) {
		return { ok: false, error: responseJson };
	}
	if (responseJson.performanceId) {
		return { ok: true, value: responseJson };
	}
	return { ok: false, error: 'Something went wrong when trying to add the performance' };
}

const PerformanceApi = {
	updatePerformance,
	deletePerformance,
	addPerformance,
};

export default PerformanceApi;
