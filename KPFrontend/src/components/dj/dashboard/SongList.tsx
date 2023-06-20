import classNames from 'classnames';
import { Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectQueuedSorted } from '../../../slices/combinedSelectors';
import { selectCompleted, selectLive, selectRequests } from '../../../slices/performancesSlice';
import { RootState } from '../../../store';
import styles from './SongList.module.css';
import SongListItem from './SongListItem';

const SongList = () => {
	const completed = useSelector(selectCompleted);
	const queued = useSelector(selectQueuedSorted);
	const live = useSelector(selectLive);
	const requests = useSelector(selectRequests);

	return (
		<>
			<div className={classNames([styles.listContainer, styles.borderBottom, 'text-muted'])}>
				<span>#</span>
				<span>Song List</span>
				<span></span>
				<span></span>
				<span>
					<Badge bg="success">
						<span className="pl-2">{requests.length} New Requests</span>
					</Badge>
				</span>
			</div>
			<div className={styles.listContents}>
				{completed.map((s, i) => (
					<div className={styles.listContainer}>
						<SongListItem performance={s} index={i + 1} className="text-muted" />
					</div>
				))}
				{live.map((s, i) => (
					<div className={classNames([styles.listContainer, 'text-warning'])}>
						<SongListItem performance={s} index={completed.length + 1 + i} className="text-warning" />
					</div>
				))}
				{queued.map((s, i) => (
					<div className={styles.listContainer}>
						<SongListItem performance={s} index={completed.length + live.length + 1 + i} />
					</div>
				))}
				<hr />
				{requests.map((s, i) => (
					<div key={s.performanceId} className={styles.listContainer}>
						<SongListItem performance={s} index={completed.length + live.length + queued.length + 1 + i} />
					</div>
				))}
			</div>
		</>
	);
};
export default SongList;
