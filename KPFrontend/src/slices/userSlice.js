import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	singerId: null,
	isDj: false,
	name: '',
};

export const userSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
		populateUser: (state, action) => {
			state.singerId = action.payload.singerId;
			state.isDj = action.payload.isDj;
			state.name = action.payload.name;
		},

		toggleDj: (state) => {
			state.isDj = !state.isDj;
		},

		reset: () => initialState,
	},
});

export const { populateUser, reset, toggleDj } = userSlice.actions;

export default userSlice.reducer;
