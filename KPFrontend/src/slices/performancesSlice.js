import { createSlice } from '@reduxjs/toolkit';
import StatusServices from '../services/StatusService';

const initialState = {
	requests: [],
	queued: [],
	live: [],
	completed: [],
};
const cmp = (a, b) => (a > b) - (a < b);

export const performancesSlice = createSlice({
	name: 'performances',
	initialState: initialState,
	reducers: {
		populatePerformances: (state, action) => {
			StatusServices.getStatuses().forEach((s) => {
				state[s.name] = action.payload
					.filter((q) => q.status === s.id)
					.sort((a, b) => cmp(a.sort_Order, b.sort_Order) || cmp(a.performanceId, b.performanceId));
			});
			state.completed = state.completed.reverse();
		},

		addRequest: (state, action) => {
			state.requests.push(action.payload);
		},

		startNextPerformance: (state, action) => {
			console.log('previous performance started');
		},
		startPreviousPerformance: (state, action) => {
			console.log('previous performance started');
		},
		resetPerformances: () => initialState,
		sendMovePerformance: () => {},
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
