import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovePerformanceDTO } from '../dtoTypes/MovePerformanceDTO';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';
import StatusServices from '../services/StatusService';

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
			StatusServices.getStatuses().forEach((s) => {
				// @ts-ignore:
				state[s.name] = action.payload
					.filter((q) => q.status === s.id)
					.sort((a, b) => cmp(a.sort_Order, b.sort_Order) || cmp(a.performanceId ?? 0, b.performanceId ?? 0));
			});
			state.completed = state.completed.reverse();
		},

		addRequest: (state, action: PayloadAction<PerformanceDTO>) => {
			state.requests.push(action.payload);
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

export const {
	populatePerformances,
	addRequest,
	resetPerformances,
	startNextPerformance,
	startPreviousPerformance,
	sendMovePerformance,
} = performancesSlice.actions;

export default performancesSlice.reducer;
