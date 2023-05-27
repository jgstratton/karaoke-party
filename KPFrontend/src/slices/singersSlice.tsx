import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SingerDTO } from '../dtoTypes/SingerDTO';

interface iSingersSlice {
	singers: SingerDTO[];
}

const initialState: iSingersSlice = {
	singers: [],
};

const cmp = (a: number, b: number) => +(a > b) - +(a < b);

export const singersSlice = createSlice({
	name: 'singers',
	initialState: initialState,
	reducers: {
		addSinger: (state, action: PayloadAction<SingerDTO>) => {
			state.singers.push(action.payload);
			state.singers.sort((a, b) => cmp(a.rotationNumber, b.rotationNumber));
		},
	},
});

export const { addSinger } = singersSlice.actions;

export default singersSlice.reducer;
