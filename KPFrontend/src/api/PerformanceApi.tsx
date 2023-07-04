import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import { PerformanceRequestDTO } from '../dtoTypes/PerformanceRequestDTO';
import { Result, validateResult } from './Result';

const updatePerformance = async (partyKey: string, performance: PerformanceDTO): Promise<Result<PerformanceDTO>> =>
	await validateResult(
		await fetch(`party/${partyKey}/performance`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},

			body: JSON.stringify(performance),
		}),
		(body) => body.performanceId > 0,
		'Something went wrong when trying to update the performance'
	);

const deletePerformance = async (partyKey: string, performance: PerformanceDTO): Promise<Result<boolean>> =>
	await validateResult(
		await fetch(`party/${partyKey}/performance/${performance.performanceId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(performance),
		}),
		() => true,
		'Something went wrong when trying to delete the performance'
	);

const addPerformance = async (partyKey: string, performance: PerformanceRequestDTO): Promise<Result<PerformanceDTO>> =>
	await validateResult(
		await fetch(`party/${partyKey}/performance?`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(performance),
		}),
		(body) => body.performanceId > 0,
		'Something went wrong when trying to add the performance'
	);

const PerformanceApi = {
	updatePerformance,
	deletePerformance,
	addPerformance,
};

export default PerformanceApi;
