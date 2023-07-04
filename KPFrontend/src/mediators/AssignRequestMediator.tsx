import PerformanceApi from '../api/PerformanceApi';
import SingerApi from '../api/SingerApi';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import SingerDTO from '../dtoTypes/SingerDTO';
import StatusService from '../services/StatusService';
import store from '../store';
import { Result } from '../api/Result';
import { deletePerformance, updatePerformancesSubset } from '../slices/performancesSlice';
import { populateSingers } from '../slices/singerSlice';

export const AssignRequestToExistingSinger = async (
	performance: PerformanceDTO,
	singer: SingerDTO
): Promise<Result<PerformanceDTO>> => {
	const partyKey = store.getState().party.partyKey;
	if (singer.singerId == null) {
		return { ok: false, error: 'null singer id' };
	}

	performance.status = StatusService.queued;
	performance.singerId = singer.singerId;
	const updatedPerformance = await PerformanceApi.updatePerformance(partyKey, performance);

	if (!updatedPerformance.ok) {
		return updatedPerformance;
	}

	store.dispatch(updatePerformancesSubset([updatedPerformance.value]));
	return updatedPerformance;
};

export const AssignRequestToNewSinger = async (
	performance: PerformanceDTO,
	singerName: string
): Promise<Result<PerformanceDTO>> => {
	const partyKey = store.getState().party.partyKey;

	// create the new singer
	const newSingerResult = await SingerApi.addSinger(partyKey, {
		name: singerName,
		rotationNumber: 0,
		isPaused: false,
	});

	//validate
	if (!newSingerResult.ok) {
		return newSingerResult;
	}

	if (newSingerResult.value.singerId == null) {
		return { ok: false, error: 'Error occured when creating singer.' };
	}

	// move new singer to the back
	const updatedSingerList = await SingerApi.moveToLast(partyKey, newSingerResult.value.singerId);
	if (!updatedSingerList.ok) {
		return { ok: false, error: 'New singer created, but error occured when re-positioning.' };
	}

	// all the singers are moved around... get the new singer list
	const singersList = await SingerApi.getSingers(partyKey);

	if (!singersList.ok) {
		return { ok: false, error: 'New singer created, but failed before assigning request to singer.' };
	}

	// update the store
	store.dispatch(populateSingers(singersList.value));

	// done with new singer... now assign the performance to them
	return await AssignRequestToExistingSinger(performance, newSingerResult.value);
};

export const DeleteRequest = async (performance: PerformanceDTO): Promise<Result<boolean>> => {
	const partyKey = store.getState().party.partyKey;
	const deleteResult = await PerformanceApi.deletePerformance(partyKey, performance);

	if (!deleteResult.ok) {
		return deleteResult;
	}

	store.dispatch(deletePerformance(performance.performanceId));
	return { ok: true, value: true };
};
