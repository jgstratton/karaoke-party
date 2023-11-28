import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import PartyDTO from '../dtoTypes/PartyDTO';
import { RootState } from '../store';

export interface Party {
	title: string;
	partyKey: string;
	djKey: string;
	isStale: boolean;
	isLoaded: boolean;
	openAiEndpoint: string;
}

const initialState: Party = {
	title: '',
	partyKey: '',
	djKey: '',
	isStale: false,
	isLoaded: false,
	openAiEndpoint: '',
};

export const partySlice = createSlice({
	name: 'party',
	initialState: initialState,
	reducers: {
		populateParty: (state, action: PayloadAction<PartyDTO>) => {
			state.title = action.payload.title;
			state.partyKey = action.payload.partyKey;
			state.djKey = action.payload.djKey;
			state.isLoaded = true;
			state.openAiEndpoint = action.payload.serverSettings.openAILambdaEndpoint;
		},

		reset: (state) => {
			state.title = initialState.title;
			state.partyKey = initialState.partyKey;
			state.djKey = initialState.djKey;
			state.isStale = initialState.isStale;
			// no party is set, but the state is loaded
			state.isLoaded = true;
		},

		markAsStale: (state) => {
			state.isStale = true;
		},
		joinHub: () => {},
		notifyDjChanges: () => {},
	},
});

export const selectIsPartyInitialized = (state: RootState) => {
	return (state.party?.partyKey ?? '').length > 0;
};

export const selectPartyKey = (state: RootState) => {
	return state.party?.partyKey ?? '';
};

export const selectDjKey = (state: RootState) => {
	return state.party?.djKey ?? '';
};

export const selectIsStale = (state: RootState) => {
	return state.party?.isStale ?? false;
};

export const selectOpenAiEndpoint = (state: RootState) => {
	return state.party?.openAiEndpoint ?? '';
};

export const { populateParty, reset, markAsStale, joinHub, notifyDjChanges } = partySlice.actions;

export default partySlice.reducer;
