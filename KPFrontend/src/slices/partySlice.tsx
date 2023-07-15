import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import PartyDTO from '../dtoTypes/PartyDTO';
import { RootState } from '../store';

export interface Party {
	title: string;
	partyKey: string;
	isStale: boolean;
}

const initialState: Party = {
	title: '',
	partyKey: '',
	isStale: false,
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

		markAsStale: (state) => {
			state.isStale = true;
		},

		notifyDjChanges: () => {},
	},
});

export const selectIsPartyInitialized = (state: RootState) => {
	return (state.party?.partyKey ?? '').length > 0;
};

export const selectPartyKey = (state: RootState) => {
	return state.party?.partyKey ?? '';
};

export const selectIsStale = (state: RootState) => {
	return state.party?.isStale ?? false;
};

export const { populateParty, reset, markAsStale, notifyDjChanges } = partySlice.actions;

export default partySlice.reducer;
