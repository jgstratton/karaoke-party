import React, { PropsWithChildren } from 'react';

export enum Positions {
	Center,
	TopRight,
}

interface iProps {
	backgroundOpacity?: number;
	position?: Positions;
}
const Overlay = ({ backgroundOpacity = 0.9, position = Positions.Center, children }: PropsWithChildren<iProps>) => {
	let top = '40%';
	let right = 'auto';

	switch (position) {
		case Positions.TopRight:
			top = '30px';
			right = '30px';
			break;
		case Positions.Center:
		default:
			top = '40%';
			right = 'auto';
	}
	return (
		<div
			style={{
				position: 'fixed',
				width: '100%',
				height: '100%',
				top: '0',
				left: '0',
				background: `rgba(0,0,0,${backgroundOpacity})`,
				zIndex: '9999',
				lineHeight: '100%',
			}}
		>
			<div
				className="text-center"
				style={{
					position: 'absolute',
					top: top,
					right: right,
				}}
			>
				<div className="text-left" style={{ display: 'inline-block' }}>
					{children}
				</div>
			</div>
		</div>
	);
};

export default Overlay;
