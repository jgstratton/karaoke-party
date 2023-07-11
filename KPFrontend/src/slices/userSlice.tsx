import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDTO } from '../dtoTypes/UserDTO';
import { RootState } from '../store';

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
			console.log('populating user', action.payload);
			state.userId = action.payload.userId;
			state.isDj = action.payload.isDj;
			state.name = action.payload.name;
		},

		setDj: (state, action: PayloadAction<boolean>) => {
			state.isDj = action.payload;
		},

		reset: () => {
			return initialState;
		},
	},
});

export const selectUserId = (state: RootState) => {
	return state.user?.userId ?? 0;
};

export const selectUserName = (state: RootState) => {
	return state.user?.name ?? '';
};

export const selectUserIsDj = (state: RootState) => {
	return state.user?.isDj ?? false;
};

export const { populateUser, reset, setDj } = userSlice.actions;

export default userSlice.reducer;
