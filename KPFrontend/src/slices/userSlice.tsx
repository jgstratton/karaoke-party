import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDTO } from '../dtoTypes/UserDTO';

interface iUserState {
	userId?: number;
	isDj: boolean;
	name: string;
}

const initialState: iUserState = {
	userId: undefined,
	isDj: false,
	name: '',
};

export const userSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
		populateUser: (state, action: PayloadAction<UserDTO>) => {
			state.userId = action.payload.userId;
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
