import { Badge } from 'react-bootstrap';
import SingerDTO from '../../../dtoTypes/SingerDTO';

interface iProps {
	singer: SingerDTO;
	index: number;
	className?: string;
}

const SingerListItem = ({ singer, index, className = '' }: iProps) => {
	return (
		<>
			<span className={className}>{index}</span>
			<span className={className}>{singer.name}</span>
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
