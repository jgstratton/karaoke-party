import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loading = (props) => {
	return (
		<div>
			{props.overlay ? (
				<div
					style={{
						position: 'fixed',
						width: '100%',
						height: '100%',
						top: '0',
						left: '0',
						background: 'rgba(0,0,0,0.9)',
						fontSize: '30px',
						zIndex: '9999',
					}}
				>
					<div className="text-center">
						<FontAwesomeIcon icon={faSpinner} className="fa-spin" />
						<span>{props.message || 'Loading...'}</span>
					</div>
				</div>
			) : (
				<div className="text-muted" style={{ fontSize: '30px' }}>
					<FontAwesomeIcon icon={faSpinner} className="fa-spin" />
					<span className="pl-2" style={{ fontSize: '14px' }}>
						Loading...
					</span>
				</div>
			)}
		</div>
	);
};

export default Loading;
