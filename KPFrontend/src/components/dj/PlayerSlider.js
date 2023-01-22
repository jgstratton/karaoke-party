import React from 'react';
import { useState } from 'react';
import Slider from '../../lib/react-player-controls/Slide';

const SliderBar = ({ value, style }) => (
	<div
		style={{
			position: 'absolute',
			background: '#878C88',
			borderRadius: 4,
			...{
				top: 'calc(50% - 4px)',
				left: 0,
				width: `${value * 100}%`,
				height: 6,
			},
			...style,
		}}
	/>
);

const SliderHandle = ({ value, style }) => (
	<div
		style={Object.assign(
			{},
			{
				position: 'absolute',
				width: 14,
				height: 14,
				background: '#CC273D',
				borderRadius: '100%',
				transform: 'scale(1)',
				transition: 'transform 0.2s',
				'&:hover': {
					transform: 'scale(1.3)',
				},
			},
			{
				top: 'calc(50% - 4px)',
				left: `${value * 100}%`,
				marginTop: -4,
				marginLeft: -8,
			},

			style
		)}
	/>
);

const PlayerSlider = (props) => {
	const [value, setValue] = useState(0);
	const [setLastValueStart] = useState(0);
	const [setLastValueEnd] = useState(0);
	const [lastIntent, setLastIntent] = useState(0);
	const [setLastIntentStart] = useState(0);
	const direction = 'HORIZONTAL';

	return (
		<Slider
			isEnabled={props.isEnabled}
			direction={direction}
			onChange={(value) => {
				if (props.isEnabled) {
					setValue(value);
				}
			}}
			// onChangeStart={setLastValueStart}
			// onChangeEnd={setLastValueEnd}
			// onIntent={setLastIntent}
			// onIntentStart={setLastIntentStart}
			style={{
				width: '100%',
				height: 24,
				transition: 'width 0.1s',
				cursor: props.isEnabled === true ? 'pointer' : 'default',
			}}
		>
			<SliderBar direction={direction} value={1} style={{ background: '#fff' }} />
			<SliderBar
				direction={direction}
				value={value}
				style={{ background: props.isEnabled ? '#CC273D' : '#878C88' }}
			/>
			<SliderBar direction={direction} value={lastIntent} style={{ background: 'rgba(0, 0, 0, 0.05)' }} />
			<SliderHandle
				direction={direction}
				value={value}
				style={{ background: props.isEnabled ? '#CC273D' : '#878C88' }}
			/>
		</Slider>
	);
};
export default PlayerSlider;
