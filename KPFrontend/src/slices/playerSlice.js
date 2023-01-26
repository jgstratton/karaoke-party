import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	enabled: true,
	playing: false,
	position: 0,
	length: 0,
};

export const playerSlice = createSlice({
	name: 'player',
	initialState: initialState,
	reducers: {
		populatePlayer: (state, action) => {
			state.enabled = action.payload.enabled;
			state.player = action.payload.playing;
			state.position = action.payload.position;
			state.length = action.payload.length;
		},
		setPosition: (state, action) => {
			state.position = action.payload;
		},
		setLength: (state, action) => {
			state.length = action.payload;
		},
		pause: (state) => {
			state.playing = false;
		},
		play: (state) => {
			state.playing = true;
		},
		resetPlayer: () => initialState,
	},
});

export const { populatePlayer, resetPlayer, setPosition, setLength, play, pause } = playerSlice.actions;

export default playerSlice.reducer;
