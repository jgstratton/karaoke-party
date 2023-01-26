import { configureStore } from '@reduxjs/toolkit';
import partyReducer from './slices/partySlice';
import performancesReducer from './slices/performancesSlice';
import userReducer from './slices/userSlice';
import playerReducer from './slices/playerSlice';
import signalRMiddleware from './middleware/signalRMiddleware';

// create the store with the reducer function
export const store = configureStore({
	reducer: {
		user: userReducer,
		party: partyReducer,
		performances: performancesReducer,
		player: playerReducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat([signalRMiddleware]);
	},
});
