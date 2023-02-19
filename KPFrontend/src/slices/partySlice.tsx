import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Party {
	partyId?: Number;
	title: string;
	partyKey: string;
}

const initialState:Party = {
	partyId: undefined,
	title: '',
	partyKey: ''
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

export const selectIsPartyInitialized = (state:RootState) => {
	return (state.party?.partyKey ?? '').length > 0;
}

export const { populateParty, reset } = partySlice.actions;

export default partySlice.reducer;
