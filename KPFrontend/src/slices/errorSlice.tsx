import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ErrorStore {
	errors: string[];
}

const initialState: ErrorStore = {
	errors: [],
};

export const errorSlice = createSlice({
	name: 'errors',
	initialState: initialState,
	reducers: {
		logError: (state, action: PayloadAction<string>) => {
			if (state.errors.length <= 20) {
				state.errors.push(action.payload);
			}
		},
	},
});

export const selectErrors = (state: RootState) => {
	return state.error.errors;
};

export const { logError } = errorSlice.actions;
export default errorSlice.reducer;
