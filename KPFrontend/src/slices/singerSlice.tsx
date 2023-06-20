import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import SingerDTO from '../dtoTypes/SingerDTO';
import { RootState } from '../store';
import { selectCompleted, selectLive, selectQueued } from './performancesSlice';

interface iSingerState {
	singerList: SingerDTO[];
}

const initialState: iSingerState = {
	singerList: [],
};

const cmp = (a: number, b: number) => +(a > b) - +(a < b);

export const singerSlice = createSlice({
	name: 'singer',
	initialState: initialState,
	reducers: {
		populateSingers: (state: iSingerState, action: PayloadAction<SingerDTO[]>) => {
			state.singerList = action.payload;
			state.singerList.sort((a, b) => cmp(a.rotationNumber, b.rotationNumber));
		},
		addSinger: (state, action: PayloadAction<SingerDTO>) => {
			state.singerList.push(action.payload);
			state.singerList.sort((a, b) => cmp(a.rotationNumber, b.rotationNumber));
		},
		updateSinger: (state, action: PayloadAction<SingerDTO>) => {
			const targetIndex = state.singerList.findIndex((s) => s.singerId === action.payload.singerId);
			const targetRotationNumberIndex = action.payload.rotationNumber - 1;
			if (targetIndex >= 0) {
				if (state.singerList[targetIndex].rotationNumber !== action.payload.rotationNumber) {
					const idRotationMap = state.singerList
						.filter((s) => s.singerId !== action.payload.singerId)
						.sort((a, b) => cmp(a.rotationNumber, b.rotationNumber));
					state.singerList = [
						...idRotationMap.slice(0, targetRotationNumberIndex),
						action.payload,
						...idRotationMap.slice(targetRotationNumberIndex),
					];
					for (var i = 0; i < state.singerList.length; i++) {
						state.singerList[i].rotationNumber = i + 1;
					}
					state.singerList.sort((a, b) => cmp(a.rotationNumber, b.rotationNumber));
				} else {
					state.singerList[targetIndex] = action.payload;
				}
			} else {
				console.error('Attempted to update singer detail for singer not found in store');
			}
		},
	},
});

export const { populateSingers, addSinger, updateSinger } = singerSlice.actions;

export type SingerSummary = {
	singerId?: number;
	name: string;
	rotationNumber: number;
	completedCount: number;
	liveCount: number;
	queuedCount: number;
};

export type SingerDetails = {
	singerId?: number;
	name: string;
	rotationNumber: number;
	performances: PerformanceDTO[];
};

export const selectSingerList = (state: RootState) => {
	return state.singer.singerList;
};

export const selectRotationSize = createSelector(selectSingerList, (singers) => singers.length);

export const selectSingerId = (state: RootState, singerId: Number) => singerId;
export const selectSingerById = createSelector([selectSingerList, selectSingerId], (singerList, singerId) => {
	return singerList.find((s) => s.singerId === singerId);
});

const selectSingerPerformances = createSelector(
	[selectQueued, selectLive, selectCompleted],
	(queued, live, completed) => queued.concat(live, completed)
);

export const selectSingerDetailsById = createSelector(
	[selectSingerById, selectSingerPerformances],
	(singer, performances): SingerDetails => {
		return {
			singerId: singer?.singerId,
			name: singer?.name ?? '',
			rotationNumber: singer?.rotationNumber ?? 0,
			performances: performances
				.filter((p) => p.singerId === singer?.singerId)
				.sort((a, b) => cmp(a.completedOrder, b.completedOrder) || cmp(a.performanceId, b.performanceId)),
		};
	}
);

export default singerSlice.reducer;
