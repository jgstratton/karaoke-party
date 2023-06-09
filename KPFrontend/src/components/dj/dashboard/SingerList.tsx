import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { selectSingerSummaryList } from '../../../slices/singerSlice';
import styles from './SingerList.module.css';
import SingerListItem from './SingerListItem';

const SingerList = () => {
	const singers = useSelector(selectSingerSummaryList);

	return (
		<>
			<div className={classNames([styles.listContainer, styles.borderBottom, 'text-muted'])}>
				<span>#</span>
				<span>Singer</span>
				<span></span>
			</div>
			<div className={styles.listContents}>
				{singers.map((s, i) => (
					<div className={styles.listContainer}>
						<SingerListItem singer={s} index={i + 1} className="text-muted" />
					</div>
				))}
			</div>
		</>
	);
};
export default SingerList;
