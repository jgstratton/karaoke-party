import React from 'react';

const Overlay = (props) => {
	return (
		<div
			style={{
				position: 'fixed',
				width: '100%',
				height: '100%',
				top: '0',
				left: '0',
				background: 'rgba(0,0,0,0.9)',
				zIndex: '9999',
				lineHeight: '100%',
			}}
		>
			<div
				className="text-center"
				style={{
					position: 'relative',
					top: '40%',
				}}
			>
				<div className="text-left" style={{ display: 'inline-block' }}>
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default Overlay;
