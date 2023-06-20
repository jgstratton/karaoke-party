import classNames from 'classnames';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSingerSummaryList } from '../../../slices/combinedSelectors';
import { RootState } from '../../../store';
import SingerModal from '../singerModal/SingerModal';
import styles from './SingerList.module.css';
import SingerListItem from './SingerListItem';

const SingerList = () => {
	const singers = useSelector((state: RootState) => selectSingerSummaryList(state));
	const [singerId, setSingerId] = useState(0);
	const [showSingerModal, setShowSingerModal] = useState(false);
	return (
		<>
			<SingerModal singerId={singerId} show={showSingerModal} handleClose={() => setShowSingerModal(false)} />

			<div className={classNames([styles.listContainer, styles.borderBottom, 'text-muted'])}>
				<span>#</span>
				<span>Singer Rotation</span>
				<span></span>
			</div>
			<div className={styles.listContents}>
				{singers.map((s, i) => (
					<div className={styles.listContainer}>
						<SingerListItem
							handleSelectSinger={(singerId: number) => {
								setSingerId(singerId);
								setShowSingerModal(true);
							}}
							singer={s}
							index={i + 1}
							className="text-muted"
						/>
					</div>
				))}
			</div>
		</>
	);
};
export default SingerList;
