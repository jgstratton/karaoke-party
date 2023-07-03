import { Result } from '../api/Result';
import SingerApi from '../api/SingerApi';
import SingerDTO from '../dtoTypes/SingerDTO';
import { populateSingers } from '../slices/singerSlice';
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
	return newSingerResponse;
};
