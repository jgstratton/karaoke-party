import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovePerformanceDTO } from '../dtoTypes/MovePerformanceDTO';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import StatusService from '../services/StatusService';
import { RootState } from '../store';
interface iPerformancesState {
	performances: PerformanceDTO[];
}

const initialState: iPerformancesState = {
	performances: [],
};
const cmp = (a: number, b: number) => +(a > b) - +(a < b);

export const performancesSlice = createSlice({
	name: 'performances',
	initialState: initialState,
	reducers: {
		populatePerformances: (state: iPerformancesState, action: PayloadAction<PerformanceDTO[]>) => {
			state.performances = action.payload;
		},

		updatePerformancesSubset: (state: iPerformancesState, action: PayloadAction<PerformanceDTO[]>) => {
			action.payload.forEach((updatedPerformanceDto) => {
				const curIndex = state.performances.findIndex(
					(existingPerformanceDto) =>
						existingPerformanceDto.performanceId === updatedPerformanceDto.performanceId
				);

				if (updatedPerformanceDto.deleteFlag) {
					state.performances.splice(curIndex, 1);
				} else {
					state.performances[curIndex] = updatedPerformanceDto;
				}
			});
		},

		deletePerformance: (state: iPerformancesState, action: PayloadAction<number>) => {
			state.performances.splice(
				state.performances.findIndex((p) => p.performanceId === action.payload),
				1
			);
		},

		deleteSingerPerformances: (state: iPerformancesState, action: PayloadAction<number>) => {
			state.performances = state.performances.filter((p) => p.singerId !== action.payload);
		},

		addPerformance: (state, action: PayloadAction<PerformanceDTO>) => {
			state.performances.push(action.payload);
		},

		startNextPerformance: (state, action: PayloadAction<void>) => {
			console.log('next performance started');
		},
		startPreviousPerformance: (state, action: PayloadAction<void>) => {
			console.log('previous performance started');
		},
		resetPerformances: () => initialState,
		sendMovePerformance: (state, action: PayloadAction<MovePerformanceDTO>) => {},
		sendNotifyRequest: (state, action: PayloadAction<PerformanceDTO>) => {},
	},
});

export const selectPerformances = (state: RootState): iPerformancesState => state.performances;

export const selectRequests = createSelector(selectPerformances, (performances) =>
	performances.performances
		.filter((q) => q.status === StatusService.requests)
		.sort((a, b) => cmp(a.performanceId ?? 0, b.performanceId ?? 0))
		.map((p) => p)
);

export const selectQueued = createSelector(selectPerformances, (performances) =>
	performances.performances.filter((q) => q.status === StatusService.queued).map((p) => p)
);

export const selectLive = createSelector(selectPerformances, (performances) =>
	performances.performances.filter((q) => q.status === StatusService.live).map((p) => p)
);

export const selectCompleted = createSelector(selectPerformances, (performances) =>
	performances.performances
		.filter((q) => q.status === StatusService.completed)
		.sort((a, b) => cmp(a.completedOrder ?? 0, b.completedOrder ?? 0))
		.map((p) => p)
);

export const {
	populatePerformances,
	addPerformance,
	deletePerformance,
	deleteSingerPerformances,
	resetPerformances,
	updatePerformancesSubset,
	startNextPerformance,
	startPreviousPerformance,
	sendMovePerformance,
	sendNotifyRequest,
} = performancesSlice.actions;

export default performancesSlice.reducer;
