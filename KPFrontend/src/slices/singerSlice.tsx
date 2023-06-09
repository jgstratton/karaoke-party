import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import SingerDTO from '../dtoTypes/SingerDTO';
import StatusService from '../services/StatusService';
import { RootState } from '../store';
import { selectCompleted, selectLive, selectQueued, selectRequests } from './performancesSlice';

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
	},
});

export const { populateSingers, addSinger } = singerSlice.actions;

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

export const selectSingerSummaryList = createSelector(
	selectSingerList,
	selectQueued,
	selectLive,
	selectCompleted,
	(singers, queued, live, completed) => {
		return singers.map((s) => ({
			singerId: s.singerId,
			name: s.name,
			rotationNumber: s.rotationNumber,
			completedCount: completed.filter((p) => p.singerId === s.singerId && p.status === StatusService.completed)
				.length,
			queuedCount: queued.filter((p) => p.singerId === s.singerId && p.status === StatusService.queued).length,
			liveCount: live.filter((p) => p.singerId === s.singerId && p.status === StatusService.live).length,
		}));
	}
);

export const selectSingerId = (state: RootState, singerId: Number) => singerId;
export const selectSingerById = createSelector([selectSingerList, selectSingerId], (singerList, singerId) => {
	return singerList.find((s) => s.singerId == singerId);
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
			performances: performances.filter((p) => p.singerId == singer?.singerId),
		};
	}
);

export default singerSlice.reducer;
