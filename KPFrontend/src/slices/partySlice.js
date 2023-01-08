import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	partyId: null,
	title: '',
	partyKey: '',
};

export const partySlice = createSlice({
	name: 'party',
	initialState: initialState,
	reducers: {
		populate: (state, action) => {
			state.partyId = action.payload.partyId;
			state.title = action.payload.title;
			state.partyKey = action.payload.partyKey;
		},

		reset: (state) => {
			state = initialState;
		},
	},
});

export const { populate, reset } = partySlice.actions;

export default partySlice.reducer;
