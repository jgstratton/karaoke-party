import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from '../../../lib/react-player-controls/Slide';
import { setPosition, sendPosition } from '../../../slices/playerSlice';

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

const PlayerSlider = (props) => {
	const dispatch = useDispatch();
	const target = useRef(null);
	const [value, setValue] = useState(0);
	const [lastIntent] = useState(0);
	const direction = 'HORIZONTAL';
	const storePlayer = useSelector((state) => state.player);

	useEffect(() => {
		setValue(props.playerSlidePosition);
	}, [props.playerSlidePosition]);

	// prevent sending position when react component loads (which will cause player to "skip")
	const dispatchNewPosition = (position) => {
		dispatch(sendPosition(position));
		dispatch(setPosition(position));
	};

	const SliderHandle = ({ value, style }) => (
		<>
			<div
				ref={target}
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
			></div>
		</>
	);

	return (
		<>
			<Slider
				isEnabled={storePlayer.enabled}
				direction={direction}
				onChange={(value) => {
					if (storePlayer.enabled) {
						setValue(value);
					}
				}}
				onChangeEnd={dispatchNewPosition}
				style={{
					width: '100%',
					height: 24,
					transition: 'width 0.1s',
					cursor: storePlayer.enabled === true ? 'pointer' : 'default',
				}}
			>
				<SliderBar direction={direction} value={1} style={{ background: '#fff' }} />
				<SliderBar
					direction={direction}
					value={value}
					style={{ background: storePlayer.enabled ? '#CC273D' : '#878C88' }}
				/>

				<SliderBar direction={direction} value={lastIntent} style={{ background: 'rgba(0, 0, 0, 0.05)' }} />

				<SliderHandle
					direction={direction}
					value={value}
					style={{ background: storePlayer.enabled ? '#CC273D' : '#878C88' }}
				></SliderHandle>
				<div style={{ display: 'none' }}>{props.slidePosition}</div>
			</Slider>
		</>
	);
};
export default PlayerSlider;
