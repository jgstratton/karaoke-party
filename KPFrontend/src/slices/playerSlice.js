import { createSlice } from '@reduxjs/toolkit';
import StatusService from '../services/StatusService';

const initialState = {
	enabled: true,
	playing: false,
	url: '',
	title: '',
	position: 0,
	length: 0,
};

export const playerSlice = createSlice({
	name: 'player',
	initialState: initialState,
	reducers: {
		// payload is party object
		populatePlayer: (state, action) => {
			const curPerformance = action.payload.queue.filter((q) => q.status === StatusService.getLiveStatus())[0];

			if (curPerformance) {
				state.enabled = true;
				state.playing = true;
				state.url = `./song/${curPerformance.song.fileName}`;
				state.title = curPerformance.song.title;
			} else {
				state.enabled = false;
				state.playing = false;
				state.url = '';
				state.title = '';
			}
			state.position = 0;
		},
		setPosition: (state, action) => {
			state.position = action.payload;
		},
		setLength: (state, action) => {
			state.length = Math.floor(action.payload / 1000);
		},
		pause: (state) => {
			state.playing = false;
		},
		play: (state) => {
			state.playing = true;
		},
		songEnded: (state) => {
			state.playing = false;
		},
		resetPlayer: () => initialState,
		sendPosition: () => {},
		sendDuration: () => {},
	},
});

export const {
	populatePlayer,
	resetPlayer,
	setPosition,
	sendPosition,
	sendDuration,
	setLength,
	play,
	pause,
	songEnded,
} = playerSlice.actions;

export default playerSlice.reducer;
