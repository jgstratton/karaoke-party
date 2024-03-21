import PerformanceApi from '../api/PerformanceApi';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import store from '../store';
import { Result } from '../api/Result';
import { addPerformance, sendNotifyRequest } from '../slices/performancesSlice';
import SingerApi from '../api/SingerApi';
import { populateSingers } from '../slices/singerSlice';
import { PerformanceRequestDTO } from '../dtoTypes/PerformanceRequestDTO';
import { notifyDjChanges } from '../slices/partySlice';

export const CreateNewUserRequest = async (performance: PerformanceRequestDTO): Promise<Result<PerformanceDTO>> => {
	const partyKey = store.getState().party.partyKey;

	if ((performance.singerId ?? 0) > 0) {
		return {
			ok: false,
			error: 'User requests are not automatically assigned to singer in rotation. Unexpected singer id.',
		};
	}

	const newPerformanceResult = await PerformanceApi.addPerformance(partyKey, performance);

	if (!newPerformanceResult.ok) {
		return newPerformanceResult;
	}

	// notify hub of new request
	store.dispatch(sendNotifyRequest(newPerformanceResult.value));
	return newPerformanceResult;
};

export const CreateNewRequestForExistingSinger = async (
	performance: PerformanceRequestDTO
): Promise<Result<PerformanceDTO>> => {
	const partyKey = store.getState().party.partyKey;
	const autoMoveSingerEnabled = store.getState().player.settings.autoMoveSingerEnabled;

	if ((performance.singerId ?? 0) === 0) {
		return { ok: false, error: 'Singer Id is not set, unable to update for existing singer.' };
	}

	if (autoMoveSingerEnabled) {
		const response = await SingerApi.autoMoveSinger(partyKey, performance.singerId ?? 0);
		if (response.ok && response.value.wasSingerMoved) {
			const singersList = await SingerApi.getSingers(partyKey);
			if (singersList.ok) {
				store.dispatch(populateSingers(singersList.value));
			}
		}
	}

	const newPerformanceResult = await PerformanceApi.addPerformance(partyKey, performance);

	if (!newPerformanceResult.ok) {
		return newPerformanceResult;
	}

	store.dispatch(addPerformance(newPerformanceResult.value));
	store.dispatch(notifyDjChanges());
	return newPerformanceResult;
};

export const CreateNewRequestForNewSinger = async (
	performance: PerformanceRequestDTO
): Promise<Result<PerformanceDTO>> => {
	const partyKey = store.getState().party.partyKey;

	if ((performance.singerId ?? 0) > 0) {
		return { ok: false, error: 'Singer Id is set, unable to add new singer.' };
	}

	const newSingerResult = await SingerApi.addSinger(partyKey, {
		name: performance.singerName,
		rotationNumber: 0,
		isPaused: false,
	});

	if (!newSingerResult.ok) {
		return newSingerResult;
	}

	if (newSingerResult.value.singerId == null) {
		return { ok: false, error: 'Error adding new singer' };
	}

	// move new singer to the back
	const updatedSingerList = await SingerApi.moveToLast(partyKey, newSingerResult.value.singerId);
	if (!updatedSingerList.ok) {
		return { ok: false, error: 'New singer created, but error occured when re-positioning.' };
	}

	// new singers were updated, we can refresh the singer list in the store
	store.dispatch(populateSingers(updatedSingerList.value));

	performance.singerId = newSingerResult.value.singerId;
	const newPerformanceResult = await PerformanceApi.addPerformance(partyKey, performance);
	if (!newPerformanceResult.ok) {
		return newPerformanceResult;
	}

	store.dispatch(addPerformance(newPerformanceResult.value));
	store.dispatch(notifyDjChanges());
	return newPerformanceResult;
};
