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
		populateParty: (state, action) => {
			state.partyId = action.payload.partyId;
			state.title = action.payload.title;
			state.partyKey = action.payload.partyKey;
		},

		reset: () => initialState,
	},
});

export const { populateParty, reset } = partySlice.actions;

export default partySlice.reducer;
