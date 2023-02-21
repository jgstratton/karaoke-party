import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import PlayerDTO from '../dtoTypes/PlayerDTO';
import StatusService from '../services/StatusService';
import { RootState } from '../store';

interface playerSettings {
	marqueeEnabled: boolean;
	marqueeText: string;
	marqueeSpeed: number;
	marqueeSize: number;
}

const initialState = {
	enabled: true,
	playing: false,
	url: '',
	title: '',
	position: 0,
	length: 0,
	settings: {
		marqueeEnabled: true,
		marqueeText: '',
		marqueeSpeed: 20,
		marqueeSize: 40,
	},
};

export const playerSlice = createSlice({
	name: 'player',
	initialState: initialState,
	reducers: {
		// payload is party object
		populatePlayer: (state, action: PayloadAction<PlayerDTO>) => {
			if (action.payload.playerState === StatusService.getLiveStatus()) {
				state.enabled = true;
				state.playing = true;
				state.url = `./song/${action.payload.fileName}`;
				state.title = action.payload.title;
				state.position = action.payload.videoPosition;
				state.length = action.payload.videoLength;
			} else {
				state.enabled = false;
				state.playing = false;
				state.url = '';
				state.title = '';
				state.position = 0;
				state.length = 0;
			}
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
		populateSettings: (state, action: PayloadAction<playerSettings>) => {
			if (action.payload) {
				state.settings = action.payload;
			}
		},
	},
});

export const selectPlayerSettings = (state: RootState) => {
	return state.player?.settings ?? {};
};

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
	populateSettings,
} = playerSlice.actions;

export default playerSlice.reducer;
