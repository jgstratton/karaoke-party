import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovePerformanceDTO } from '../dtoTypes/MovePerformanceDTO';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import StatusService from '../services/StatusService';
import { RootState } from '../store';
interface iPerformancesState {
	requests: PerformanceDTO[];
	queued: PerformanceDTO[];
	live: PerformanceDTO[];
	completed: PerformanceDTO[];
}

const initialState: iPerformancesState = {
	requests: [],
	queued: [],
	live: [],
	completed: [],
};
const cmp = (a: number, b: number) => +(a > b) - +(a < b);

export const performancesSlice = createSlice({
	name: 'performances',
	initialState: initialState,
	reducers: {
		populatePerformances: (state: iPerformancesState, action: PayloadAction<PerformanceDTO[]>) => {
			state.completed = action.payload
				.filter((q) => q.status === StatusService.completed)
				.sort((a, b) => cmp(a.completedOrder ?? 0, b.completedOrder ?? 0));
			state.live = action.payload.filter((q) => q.status === StatusService.live);
			state.requests = action.payload
				.filter((q) => q.status === StatusService.requests)
				.sort((a, b) => cmp(a.performanceId ?? 0, b.performanceId ?? 0));

			// queued performances are not sorted when loaded into the store
			state.queued = action.payload.filter((q) => q.status === StatusService.queued);
		},

		addRequest: (state, action: PayloadAction<PerformanceDTO>) => {
			const statusName = StatusService.getStatusName(action.payload.status);
			state[statusName as keyof iPerformancesState].push(action.payload);
		},

		startNextPerformance: (state, action: PayloadAction<void>) => {
			console.log('previous performance started');
		},
		startPreviousPerformance: (state, action: PayloadAction<void>) => {
			console.log('previous performance started');
		},
		resetPerformances: () => initialState,
		sendMovePerformance: (state, action: PayloadAction<MovePerformanceDTO>) => {},
	},
});

export const selectRequests = (state: RootState): PerformanceDTO[] => state.performances.requests;
export const selectQueued = (state: RootState): PerformanceDTO[] => state.performances.queued;
export const selectLive = (state: RootState): PerformanceDTO[] => state.performances.live;
export const selectCompleted = (state: RootState): PerformanceDTO[] => state.performances.completed;

export const {
	populatePerformances,
	addRequest,
	resetPerformances,
	startNextPerformance,
	startPreviousPerformance,
	sendMovePerformance,
} = performancesSlice.actions;

export default performancesSlice.reducer;
