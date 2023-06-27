import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type CustomToggleProps = {
	children?: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};
};

const EllipsisToggle = React.forwardRef((props: CustomToggleProps, ref: React.Ref<HTMLButtonElement>) => (
	<button
		className="btn btn-link"
		ref={ref}
		onClick={(e) => {
			e.preventDefault();
			if (props.onClick) {
				props.onClick(e);
			}
		}}
	>
		<FontAwesomeIcon icon={faEllipsis} />
	</button>
));
export default EllipsisToggle;
