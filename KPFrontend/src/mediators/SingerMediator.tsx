import PerformanceApi from '../api/PerformanceApi';
import { Result } from '../api/Result';
import SingerApi from '../api/SingerApi';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import SingerDTO from '../dtoTypes/SingerDTO';
import { notifyDjChanges } from '../slices/partySlice';
import { deleteSingerPerformances, updatePerformancesSubset } from '../slices/performancesSlice';
import { deleteSinger, populateSingers, toggleSinger, updateSinger } from '../slices/singerSlice';
import store from '../store';

export const AddNewSinger = async (singer: SingerDTO): Promise<Result<SingerDTO>> => {
	const partyKey = store.getState().party.partyKey;
	const newSingerResponse = await SingerApi.addSinger(partyKey, singer);

	if (!newSingerResponse.ok) {
		return newSingerResponse;
	}

	// if we added the new singer, then the order might have changed... refresh the singers list
	const singersListResult = await SingerApi.getSingers(partyKey);

	if (!singersListResult.ok) {
		return { ok: false, error: 'Added new singer, but failed to refresh singers list' };
	}

	store.dispatch(populateSingers(singersListResult.value));
	store.dispatch(notifyDjChanges());
	return newSingerResponse;
};

export const SaveSingerChanges = async (
	singer: SingerDTO,
	performances: PerformanceDTO[]
): Promise<Result<boolean>> => {
	const partyKey = store.getState().party.partyKey;
	const updatedSingerResult = await SingerApi.updateSinger(partyKey, singer);

	if (!updatedSingerResult.ok) {
		return updatedSingerResult;
	}

	for (var i = 0; i < performances.length; i++) {
		let performanceDto = performances[i];
		if (performanceDto.deleteFlag) {
			const updatedPerformanceResult = await PerformanceApi.deletePerformance(partyKey, performanceDto);

			if (!updatedPerformanceResult.ok) {
				return updatedPerformanceResult;
			}
		} else {
			performanceDto.sortOrder = i + 1;
			const updatedPerformanceResult = await PerformanceApi.updatePerformance(partyKey, performanceDto);

			if (!updatedPerformanceResult.ok) {
				return updatedPerformanceResult;
			}
		}
	}

	store.dispatch(updateSinger(updatedSingerResult.value));
	store.dispatch(updatePerformancesSubset(performances));
	store.dispatch(notifyDjChanges());

	return { ok: true, value: true };
};

export const DeleteSinger = async (singerId: number): Promise<Result<boolean>> => {
	const partyKey = store.getState().party.partyKey;
	const deleteSingerResponse = await SingerApi.deleteSinger(partyKey, singerId);
	if (!deleteSingerResponse.ok) {
		alert('Error Deleting singer');
		return deleteSingerResponse;
	}

	store.dispatch(deleteSingerPerformances(singerId));
	store.dispatch(deleteSinger(singerId));
	store.dispatch(notifyDjChanges());
	return { ok: true, value: true };
};

export const ToggleSinger = async (singer: SingerDTO): Promise<Result<boolean>> => {
	const partyKey = store.getState().party.partyKey;
	const updatedSingerResult = await SingerApi.updateSinger(partyKey, {
		singerId: singer.singerId,
		name: singer.name,
		rotationNumber: singer.rotationNumber,
		isPaused: !singer.isPaused,
	});
	if (!updatedSingerResult.ok) {
		return updatedSingerResult;
	}
	if (updatedSingerResult.value.singerId == null) {
		return { ok: false, error: 'Error updating sing' };
	}
	store.dispatch(
		toggleSinger({
			singerId: updatedSingerResult.value.singerId ?? 0,
			isPaused: updatedSingerResult.value.isPaused,
		})
	);
	store.dispatch(notifyDjChanges());
	return { ok: true, value: true };
};
