import PerformanceDTO from '../dtoTypes/PerformanceDTO';
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
	if (responseJson.singerId) {
		return { ok: true, value: responseJson };
	}
	return { ok: false, error: 'Something went wrong when trying to update the performance' };
}

const PerformanceApi = {
	updatePerformance,
};

export default PerformanceApi;
