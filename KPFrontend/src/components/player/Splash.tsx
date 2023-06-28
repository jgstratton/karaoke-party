import { useSelector } from 'react-redux';
import Card from 'react-bootstrap/Card';
import { selectQueuedSorted } from '../../slices/combinedSelectors';
import { selectLive } from '../../slices/performancesSlice';
import styles from './Splash.module.css';
import classNames from 'classnames';
import { selectPlayerSettings } from '../../slices/playerSlice';

const Splash = () => {
	const settings = useSelector(selectPlayerSettings);
	const queued = useSelector(selectQueuedSorted);
	const live = useSelector(selectLive);
	const queuedList = queued.slice(0, settings.splashScreenUpcomingCount);
	const livePerformance = live[0];

	return (
		<>
			<div
				className={classNames(['container', styles.container])}
				style={{ padding: '5px', maxWidth: '900px', marginTop: '50px' }}
			>
				<div className={styles.logoText}>Now Performing</div>
				<Card className="mb-4">
					<Card.Body>
						<div className="text-warning">{livePerformance.singerName}</div>
						{livePerformance.songTitle}
					</Card.Body>
				</Card>
				<div className={styles.logoText}>On Deck</div>

				{queuedList.length > 0 ? (
					queuedList.map((s, i) => (
						<Card key={s.performanceId} className="mb-2">
							<Card.Body>
								<Card.Text>
									<div className="text-warning">{s.singerName}</div>
									{s.songTitle}
								</Card.Text>
							</Card.Body>
						</Card>
					))
				) : (
					<>
						<Card className="mb-2">
							<Card.Body>
								<Card.Text>
									<div className="text-warning">No additional peformances queued up.</div>
								</Card.Text>
							</Card.Body>
						</Card>
					</>
				)}
			</div>
		</>
	);
};
export default Splash;
