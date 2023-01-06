import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loading = (props) => {
	return (
		<div className="text-muted" style={{ fontSize: '30px' }}>
			<FontAwesomeIcon icon={faSpinner} className="fa-spin" />
			<span className="pl-2" style={{ fontSize: '14px' }}>
				{props.children || 'Loading...'}
			</span>
		</div>
	);
};

export default Loading;
