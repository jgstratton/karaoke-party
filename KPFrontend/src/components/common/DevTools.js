import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDj } from '../../slices/userSlice';

const DevTools = (props) => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	return (
		<div style={{ backgroundColor: 'white', padding: '2px' }}>
			<span style={{ color: 'black', paddingRight: '3px' }}> {user.isDj ? 'DJ Mode' : 'Singer Mode'}</span>
			<button
				onClick={() => {
					console.log('hi');
					dispatch(toggleDj());
					console.log('bye');
				}}
			>
				Toggle Dj Mode
			</button>
		</div>
	);
};

export default DevTools;
