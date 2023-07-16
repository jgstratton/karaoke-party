import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import PlayerDTO from '../dtoTypes/PlayerDTO';
import { RootState } from '../store';
import { PlayerSettingsDTO } from '../dtoTypes/PlayerSettingsDTO';

const initialState = {
	enabled: true,
	playing: false,
	showSplash: false,
	url: '',
	title: '',
	position: 0,
	length: 0,
	settings: {
		marqueeEnabled: true,
		marqueeText: '',
		marqueeSpeed: 20,
		marqueeSize: 40,
		splashScreenEnabled: false,
		splashScreenSeconds: 10,
		splashScreenUpcomingCount: 3,
	},
};

const msToSec = (timeInMs: number) => Math.floor(timeInMs / 1000);

export const playerSlice = createSlice({
	name: 'player',
	initialState: initialState,
	reducers: {
		// payload is party object
		populatePlayer: (state, action: PayloadAction<PlayerDTO>) => {
			state.enabled = true;
			state.playing = action.payload.playerState === 1;
			state.showSplash = action.payload.showSplash ?? false;
			state.url = `./song/${action.payload.fileName}`;
			state.title = action.payload.title;
			state.position = action.payload.videoPosition;
			state.length = msToSec(action.payload.videoLength);
		},
		setPosition: (state, action) => {
			state.position = action.payload;
		},
		setLength: (state, action) => {
			state.length = msToSec(action.payload);
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
		sendChangePlayerPosition: () => {},
		sendDuration: (state, action: PayloadAction<number>) => {},
		populateSettings: (state, action: PayloadAction<PlayerSettingsDTO>) => {
			if (action.payload) {
				state.settings = action.payload;
			}
		},
		disableSplash: (state) => {
			state.showSplash = false;
		},
		broadcastSettings: (state, action: PayloadAction<PlayerSettingsDTO>) => {},
	},
});

export const selectPlayerSettings = (state: RootState) => {
	return state.player?.settings ?? {};
};

export const {
	broadcastSettings,
	disableSplash,
	pause,
	play,
	populatePlayer,
	populateSettings,
	resetPlayer,
	sendPosition,
	sendChangePlayerPosition,
	sendDuration,
	setLength,
	setPosition,
	songEnded,
} = playerSlice.actions;

export default playerSlice.reducer;
