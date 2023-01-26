import { createSlice } from '@reduxjs/toolkit';
import StatusService from '../services/StatusService';
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
					.sort((a, b) => cmp(a.sort_Order, b.sort_Order) || cmp(a.performanceID, b.performanceID));
			});
			state.completed = state.completed.reverse();
		},

		addRequest: (state, action) => {
			state.requests.push(action.payload);
		},

		movePerformance: (state, action) => {
			const { targetPerformance, targetIndex, targetStatus } = action.payload;
			const sourceStatusName = StatusService.getStatusName(targetPerformance.status);
			const targetStatusName = StatusService.getStatusName(targetStatus);
			// remove item from original list
			state[sourceStatusName].splice(
				state[sourceStatusName].findIndex((e) => e.performanceID === targetPerformance.performanceID),
				1
			);
			// insert item into target list
			state[targetStatusName].splice(targetIndex, 0, targetPerformance);
		},

		startNextPerformance: (state, action) => {},
		resetPerformances: () => initialState,
	},
});

export const { populatePerformances, addRequest, movePerformance, resetPerformances, startNextPerformance } =
	performancesSlice.actions;

export default performancesSlice.reducer;
