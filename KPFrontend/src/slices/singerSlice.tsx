import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import SingerDTO from '../dtoTypes/SingerDTO';
import StatusService from '../services/StatusService';
import { RootState } from '../store';

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

export const selectSingerList = (state: RootState) => {
	return state.singer.singerList;
};

export type SingerSummary = {
	singerId?: number;
	name: string;
	rotationNumber: number;
	completedCount: number;
	liveCount: number;
	queuedCount: number;
};

export const selectSingerSummaryList = (state: RootState): SingerSummary[] => {
	return state.singer.singerList.map((s) => ({
		singerId: s.singerId,
		name: s.name,
		rotationNumber: s.rotationNumber,
		completedCount: state.performances.completed.filter(
			(p) => p.singerId === s.singerId && p.status === StatusService.completed
		).length,
		queuedCount: state.performances.queued.filter(
			(p) => p.singerId === s.singerId && p.status === StatusService.queued
		).length,
		liveCount: state.performances.live.filter((p) => p.singerId === s.singerId && p.status === StatusService.live)
			.length,
	}));
};

export default singerSlice.reducer;
