import { configureStore } from '@reduxjs/toolkit';
import partyReducer from './slices/partySlice';
import performancesReducer from './slices/performancesSlice';
import userReducer from './slices/userSlice';
import playerReducer from './slices/playerSlice';
import signalRMiddleware from './middleware/signalRMiddleware';
import singersReducer from './slices/singerSlice';

// create the store with the reducer function
const store = configureStore({
	reducer: {
		user: userReducer,
		party: partyReducer,
		performances: performancesReducer,
		player: playerReducer,
		singer: singersReducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat([signalRMiddleware]);
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
