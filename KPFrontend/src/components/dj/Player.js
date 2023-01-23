import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card';
import PlayerSlider from './PlayerSlider';
import { faPlay, faPause, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Player.module.css';
import { HubConnectionBuilder } from '@microsoft/signalr';
import DateTimeUtilities from '../../utilities/dateTimeUtilities';
import ListGroup from 'react-bootstrap/ListGroup';
import ApiService from '../../services/ApiService';
import { populate as populatePerformance } from '../../slices/performancesSlice';

const Player = (props) => {
	const dispatch = useDispatch();
	const [isEnabled] = useState(true);
	const performances = useSelector((state) => state.performances);
	const party = useSelector((state) => state.party);
	const livePerformance = performances.live[0];
	const [connection, setConnection] = useState(null);
	const [slidePosition, setSlidePosition] = useState(0);
	const [videoLengthSeconds, setVideoLengthSeconds] = useState('300');

	useEffect(() => {
		const newConnection = new HubConnectionBuilder()
			.withUrl('https://localhost:7049/hubs/player')
			.withAutomaticReconnect()
			.build();
		setConnection(newConnection);

		newConnection
			.start()
			.then((result) => {
				console.log('Connected!');

				newConnection.on('ReceivePosition', (value) => {
					console.log('Position Received', value);
					setSlidePosition(value);
				});

				newConnection.on('ReceiveVideoLength', (value) => {
					console.log('Video Length Received', value);
					setVideoLengthSeconds(Math.floor(value / 1000));
				});

				newConnection.on('ReceiveCurrentPerformance', async (value) => {
					console.log('New video started, refreshing party');
					let curParty = await ApiService.fetchParty(party.partyKey);
					dispatch(populatePerformance(curParty.queue));
				});
			})
			.catch((e) => console.log('Connection failed: ', e));
	}, [setSlidePosition, dispatch, party.partyKey]);

	const sendPosition = async (position) => {
		if (connection) {
			try {
				await connection.invoke('SendPosition', position);
				console.log('position sent', position);
			} catch (e) {
				console.log(e);
			}
		} else {
			alert('No connection to server yet.');
		}
	};

	return (
		<Card className={[styles.player, isEnabled ? styles.enabled : '', 'mb-4']}>
			<Card.Body>
				<Card.Title>Now Playing</Card.Title>
				<Card.Text>
					<ListGroup>
						<ListGroup.Item>
							{livePerformance ? (
								<>
									<div className="text-warning">{livePerformance?.singer?.name}</div>
									{livePerformance.song?.title}
									<br />
									<a href={livePerformance?.song.url}>{livePerformance.song.url}</a>
								</>
							) : (
								<div className="text-warning">Nothing playing right now</div>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Card.Text>

				{livePerformance && (
					<>
						<div className={`${styles.controls}`}>
							<FontAwesomeIcon icon={faPlay} className={styles.icon} fixedWidth />
							<FontAwesomeIcon icon={faPause} className={styles.icon} fixedWidth />
							<PlayerSlider
								isEnabled={isEnabled}
								onSlidePositionUpdate={sendPosition}
								playerSlidePosition={slidePosition}
								videoLengthSeconds={videoLengthSeconds}
							/>
						</div>
						<hr />
						<div className={`${styles.controlsLine2}`}>
							<button className="btn btn-primary">
								<FontAwesomeIcon icon={faBackwardStep} /> Previous Song
							</button>
							<div className="text-center">
								{DateTimeUtilities.secondsToHHMMSS(videoLengthSeconds * slidePosition)} /{' '}
								{DateTimeUtilities.secondsToHHMMSS(videoLengthSeconds)}
							</div>
							<button className="btn btn-primary">
								Next Song <FontAwesomeIcon icon={faForwardStep} />
							</button>
						</div>
					</>
				)}
			</Card.Body>
		</Card>
	);
};
export default Player;
