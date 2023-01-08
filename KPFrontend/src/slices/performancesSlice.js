import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	requests: [],
	queued: [],
	completed: [],
};

export const performancesSlice = createSlice({
	name: 'performances',
	initialState: initialState,
	reducers: {
		populate: (state, action) => {
			state.requests = action.payload
				.filter((q) => !q.songCompleted && !q.order)
				.sort((a, b) => a.performanceID - b.performanceID);
			state.queued = action.payload
				.filter((q) => !q.songCompleted && q.order > 0)
				.sort((a, b) => a.order - b.order);
			state.completed = action.payload.filter((q) => q.songCompleted).sort((a, b) => b.order - a.order);
		},

		addRequest: (state, action) => {
			state.requests.push(action.payload);
		},

		reset: (state) => {
			state = initialState;
		},
	},
});

export const { populate, addRequest } = performancesSlice.actions;

export default performancesSlice.reducer;
