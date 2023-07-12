import Menu from '../common/Menu';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { selectUserPerformances } from '../../slices/combinedSelectors';
import PerformanceDTO from '../../dtoTypes/PerformanceDTO';
import StatusService from '../../services/StatusService';
import { Badge, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMusic } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './MyRequests.module.css';

const MyRequests = () => {
	const performances = useSelector(selectUserPerformances);
	const navigate = useNavigate();

	const renderSwitch = (performance: PerformanceDTO) => {
		switch (StatusService.getStatusName(performance.status)) {
			case 'completed':
				return (
					<Badge bg="secondary">
						<FontAwesomeIcon icon={faCheck} />
						<span className="pl-2">Completed</span>
					</Badge>
				);
			case 'live':
				return (
					<Badge bg="warning" text="dark">
						<FontAwesomeIcon icon={faMusic} />
						<span className="pl-2">Now Playing</span>
					</Badge>
				);
			case 'queued':
				return <Badge bg="success">Added to Queue</Badge>;
			case 'requests':
				return <Badge bg="primary">Request Submitted</Badge>;
			default:
				return <></>;
		}
	};

	const textStyle = (performance: PerformanceDTO): string => {
		switch (StatusService.getStatusName(performance.status)) {
			case 'completed':
				return 'text-muted';
			case 'live':
				return '';
			case 'queued':
				return '';
			case 'requests':
				return '';
			default:
				return '';
		}
	};
	return (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			<Menu />
			<div className="clearfix">
				<div className="float-right pb-2">
					<Button className="bg-success ml-2" onClick={() => navigate('/search')}>
						Request a song
					</Button>
				</div>

				<h6 className="ml-2 mb-0 pt-3">Your Requests</h6>
			</div>

			<ListGroup>
				{performances.length > 0 ? (
					performances.map((p, i) => {
						return (
							<ListGroup.Item
								key={p.performanceId}
								className={classNames([textStyle(p)])}
								style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
							>
								<div>
									<span className="float-right">{renderSwitch(p)}</span>
									<div className={classNames(['text-warning', textStyle(p)])}>{p.singerName}</div>
									{p.songTitle}
								</div>
							</ListGroup.Item>
						);
					})
				) : (
					<ListGroup.Item style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
						No requests have been submitted from this device.... yet.
					</ListGroup.Item>
				)}
			</ListGroup>
			<Button className="btn-link" onClick={() => navigate(-1)}>
				Back
			</Button>
		</div>
	);
};
export default MyRequests;
