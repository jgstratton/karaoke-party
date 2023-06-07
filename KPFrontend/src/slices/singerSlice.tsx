import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SingerDTO from '../dtoTypes/SingerDTO';
import { RootState } from '../store';

interface iSingerState {
	singerList: SingerDTO[];
}

const initialState: iSingerState = {
	singerList: [],
};

const cmp = (a: number, b: number) => +(a > b) - +(a < b);

export const singerSlice = createSlice({
	name: 'singer',
	initialState: initialState,
	reducers: {
		populateSingers: (state: iSingerState, action: PayloadAction<SingerDTO[]>) => {
			state.singerList = action.payload;
			state.singerList.sort((a, b) => cmp(a.rotationNumber, b.rotationNumber));
		},
		addSinger: (state, action: PayloadAction<SingerDTO>) => {
			state.singerList.push(action.payload);
			state.singerList.sort((a, b) => cmp(a.rotationNumber, b.rotationNumber));
		},
	},
});

export const { populateSingers, addSinger } = singerSlice.actions;

export const selectSingerList = (state: RootState) => {
	return state.singer.singerList;
};

export default singerSlice.reducer;
