import React from 'react';
import Menu from '../../common/Menu';
import Player from './Player';
import styles from './DJDashboard.module.css';
import classNames from 'classnames';
import SongList from './SongList';
import SingerList from './SingerList';

const DJDashboard = () => {
	return (
		<>
			<div className={classNames([styles.dashboardWrapper])}>
				<div className={classNames([styles.header])}>
					<Menu />
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
