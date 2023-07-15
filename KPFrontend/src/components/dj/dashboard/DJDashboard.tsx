import React, { useState } from 'react';
import Menu from '../../common/Menu';
import Player from './Player';
import styles from './DJDashboard.module.css';
import classNames from 'classnames';
import SongList from './SongList';
import SingerList from './SingerList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectRequests } from '../../../slices/performancesSlice';
import RequestProcessModal from '../requestProcessModal/RequestProcessModal';
import { selectUserIsDj } from '../../../slices/userSlice';

const DJDashboard = () => {
	const requests = useSelector(selectRequests);
	const [showRequestProcessModal, setShowRequestProcessModal] = useState(false);
	const isDj = useSelector(selectUserIsDj);

	const handleShowRequestProcessModal = () => setShowRequestProcessModal(true);
	const handleHideRequestProcessModal = () => setShowRequestProcessModal(false);

	return (
		<>
			<RequestProcessModal show={showRequestProcessModal} handleClose={handleHideRequestProcessModal} />

			<div className={classNames([styles.dashboardWrapper])}>
				<div className={classNames([styles.header])}>
					<Menu />
				</div>
				<div className={styles.requests}>
					{isDj && requests.length > 0 && (
						<button
							className="btn btn-success"
							onClick={handleShowRequestProcessModal}
							style={{
								boxShadow:
									'0px 1px 2px 0px rgba(0,255,255,0.7),1px 2px 4px 0px rgba(0,255,255,0.7),2px 4px 8px 0px rgba(0,255,255,0.7),2px 4px 16px 0px rgba(0,255,255,0.7);',
							}}
						>
							{requests.length} New Requests <FontAwesomeIcon icon={faExclamation} />
						</button>
					)}
				</div>
				<div style={{ height: '100%', overflowY: 'hidden' }} className={styles.singerList}>
					<SingerList />
				</div>
				<div style={{ height: '100%', overflowY: 'hidden' }} className={styles.songList}>
					<SongList />
				</div>
				<div className={classNames([styles.footer])}>
					<Player />
				</div>
			</div>
		</>
	);
};
export default DJDashboard;
