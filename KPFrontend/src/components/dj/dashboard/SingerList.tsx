import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PerformanceDTO from '../../../dtoTypes/PerformanceDTO';
import { RootState } from '../../../store';
import styles from './SingerList.module.css';
import SingerListItem from './SingerListItem';

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
				<span>Songs Counts</span>
			</div>
			<div className={styles.listContents}>
				{performances.completed.map((s, i) => (
					<div className={styles.listContainer}>
						<SingerListItem performance={s} index={i + 1} className="text-muted" />
					</div>
				))}
				{performances.completed.map((s, i) => (
					<div className={styles.listContainer}>
						<SingerListItem performance={s} index={i + 1} className="text-muted" />
					</div>
				))}
				{performances.live.map((s, i) => (
					<div className={classNames([styles.listContainer, 'text-warning'])}>
						<SingerListItem
							performance={s}
							index={performances.completed.length + i}
							className="text-warning"
						/>
					</div>
				))}
				{state.queued.map((s, i) => (
					<div className={styles.listContainer}>
						<SingerListItem
							performance={s}
							index={performances.completed.length + performances.live.length + 1 + i}
						/>
					</div>
				))}
			</div>
		</>
	);
};
export default SongList;
