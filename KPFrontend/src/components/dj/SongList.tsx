import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import PerformanceDTO from '../../dtoTypes/PerformanceDTO';
import { RootState } from '../../store';
import styles from './SongList.module.css';
import SongListItem from './SongListItem';

interface state {
	requests: PerformanceDTO[];
	queued: PerformanceDTO[];
}

const SongList = () => {
	const performances = useSelector((state: RootState) => state.performances);
	const [state, setState] = useState<state>({
		requests: [],
		queued: [],
	});
	useEffect(() => {
		setState({
			requests: performances.requests,
			queued: performances.queued,
		});
	}, [performances]);
	return (
		<>
			<div className={classNames([styles.listContainer, styles.borderBottom, 'text-muted'])}>
				<span>#</span>
				<span>Singer</span>
				<span></span>
				<span>Title</span>
				<span>
					<Badge bg="success">
						<span className="pl-2">{state.requests.length} New Requests</span>
					</Badge>
				</span>
			</div>
			<div className={styles.listContents}>
				{performances.completed.map((s, i) => (
					<div className={styles.listContainer}>
						<SongListItem performance={s} index={i + 1} className="text-muted" />
					</div>
				))}
				{performances.live.map((s, i) => (
					<div className={classNames([styles.listContainer, 'text-warning'])}>
						<SongListItem
							performance={s}
							index={performances.completed.length + i}
							className="text-warning"
						/>
					</div>
				))}
				{state.queued.map((s, i) => (
					<div className={styles.listContainer}>
						<SongListItem
							performance={s}
							index={performances.completed.length + performances.live.length + 1 + i}
						/>
					</div>
				))}
				<hr />
				{state.requests.map((s, i) => (
					<div className={styles.listContainer}>
						<SongListItem
							performance={s}
							index={
								performances.completed.length +
								performances.live.length +
								performances.queued.length +
								1 +
								i
							}
						/>
					</div>
				))}
			</div>
		</>
	);
};
export default SongList;
