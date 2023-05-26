import { faCheck, faMusic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Badge } from 'react-bootstrap';
import PerformanceDTO from '../../dtoTypes/PerformanceDTO';
import StatusService from '../../services/StatusService';

interface iProps {
	performance: PerformanceDTO;
	index: number;
	className?: string;
}

const SingerListItem = ({ performance, index, className = '' }: iProps) => {
	return (
		<>
			<span className={className}>{index}</span>
			<span className={className}>{performance.singerName}</span>
			<span className={className}>
				<Badge bg="secondary" className="mr-1">
					1
				</Badge>
				<Badge bg="success" className="mr-1">
					4
				</Badge>
				<Badge bg="primary" className="mr-1">
					3
				</Badge>
			</span>
		</>
	);
};
export default SingerListItem;
