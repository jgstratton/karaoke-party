import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import PartyDTO from '../dtoTypes/PartyDTO';
import { RootState } from '../store';

export interface Party {
	title: string;
	partyKey: string;
}

const initialState: Party = {
	title: '',
	partyKey: '',
};

export const partySlice = createSlice({
	name: 'party',
	initialState: initialState,
	reducers: {
		populateParty: (state, action: PayloadAction<PartyDTO>) => {
			state.title = action.payload.title;
			state.partyKey = action.payload.partyKey;
		},

		reset: () => initialState,
	},
});

export const selectIsPartyInitialized = (state: RootState) => {
	return (state.party?.partyKey ?? '').length > 0;
};

export const selectPartyKey = (state: RootState) => {
	return state.party?.partyKey ?? '';
};

export const { populateParty, reset } = partySlice.actions;

export default partySlice.reducer;
