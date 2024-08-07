import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { broadcastSettings, selectPlayerSettings } from '../../slices/playerSlice';
import styles from './SettingsModal.module.css';
import { selectDjKey } from '../../slices/partySlice';
interface props {
	show: boolean;
	handleClose: () => void;
}

const SettingsModal = ({ show, handleClose }: props) => {
	const dispatch = useDispatch();
	const playerStoreSettings = useSelector(selectPlayerSettings);
	const djKey = useSelector(selectDjKey);
	const [marqueeEnabled, setMarqueeEnabled] = useState(false);
	const [marqueeText, setMarqueeText] = useState('');
	const [marqueeSpeed, setMarqueeSpeed] = useState(20);
	const [marqueeSize, setMarqueeSize] = useState(40);

	const [splashScreenEnabled, setSplashScreenEnabled] = useState(false);
	const [splashScreenSeconds, setSplashScreenSeconds] = useState(10);
	const [splashScreenUpcomingCount, setSplashScreenUpcomingCount] = useState(3);

	const [aiEnabled, setAiEnabled] = useState(true);
	const [autoMoveSingerEnabled, setAutoMoveSingerEnabled] = useState(true);
	const [dataQuota, setDataQuota] = useState(0);
	const [dataUsage, setDataUsage] = useState(0);

	const [qrCodeEnabled, setQrCodeEnabled] = useState(true);
	const [qrCodeSize, setQrCodeSize] = useState(100);

	const resetSettings = useCallback(() => {
		setMarqueeEnabled(playerStoreSettings.marqueeEnabled);
		setMarqueeText(playerStoreSettings.marqueeText);
		setMarqueeSpeed(playerStoreSettings.marqueeSpeed);
		setMarqueeSize(playerStoreSettings.marqueeSize);
		setSplashScreenEnabled(playerStoreSettings.splashScreenEnabled);
		setSplashScreenSeconds(playerStoreSettings.splashScreenSeconds);
		setSplashScreenUpcomingCount(playerStoreSettings.splashScreenUpcomingCount);
		setAiEnabled(playerStoreSettings.aiEnabled);
		setAutoMoveSingerEnabled(playerStoreSettings.autoMoveSingerEnabled);
		setQrCodeEnabled(playerStoreSettings.qrCodeEnabled);
		setQrCodeSize(playerStoreSettings.qrCodeSize);
	}, [playerStoreSettings]);

	useEffect(() => {
		resetSettings();
	}, [resetSettings]);

	useEffect(() => {
		if (show) {
			console.log('checking data usage');
			navigator.storage.estimate().then((result) => {
				setDataQuota(result.quota ?? 0);
				setDataUsage(result.usage ?? 0);
			});
		}
	}, [show]);

	const handleCancel = () => {
		resetSettings();
		handleClose();
	};

	const handleSave = () => {
		dispatch(
			broadcastSettings({
				marqueeEnabled,
				marqueeText,
				marqueeSpeed,
				marqueeSize,
				splashScreenEnabled,
				splashScreenSeconds,
				splashScreenUpcomingCount,
				aiEnabled,
				autoMoveSingerEnabled,
				qrCodeEnabled,
				qrCodeSize,
			})
		);
		handleClose();
	};

	return (
		<>
			<Modal className={styles.settingsModal} size="lg" show={show} backdrop="static">
				<Modal.Header closeButton onHide={handleClose}>
					<Modal.Title>Settings</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col>
							<Form.Group className="mb-3">
								<Form.Label>DJ Party Key</Form.Label>
								<p className="text-warning">({djKey})</p>
								<p className="text-muted">Use this to join this party as a DJ from another device.</p>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className="mb-3">
								<Form.Label>Storage</Form.Label>
								<p className="text-warning">
									This app is using {(dataUsage / (1024 * 1024 * 1024)).toFixed(1)} GB of data.
								</p>
								<p className="text-muted">
									{((dataUsage / dataQuota) * 100).toFixed(1)}% of{' '}
									{(dataQuota / (1024 * 1024 * 1024)).toFixed(1)} GB available storage used.
								</p>
							</Form.Group>
						</Col>
					</Row>

					<hr />
					<Form.Group className="mb-3">
						<Form.Label>Marquee Settings ({marqueeEnabled ? 'enabled' : 'marquee disabled'})</Form.Label>
						{!marqueeEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOff} onClick={() => setMarqueeEnabled(true)} />
							</div>
						)}
						{marqueeEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOn} onClick={() => setMarqueeEnabled(false)} />
							</div>
						)}
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Speed</Form.Label>
						<span className="float-right text-muted">{marqueeSpeed}</span>
						<Form.Range
							disabled={!marqueeEnabled}
							value={marqueeSpeed}
							onChange={(e) => setMarqueeSpeed(parseInt(e.target.value))}
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Size (height)</Form.Label>
						<span className="float-right text-muted">{marqueeSize}</span>
						<Form.Range
							min={20}
							max={80}
							disabled={!marqueeEnabled}
							value={marqueeSize}
							onChange={(e) => setMarqueeSize(parseInt(e.target.value))}
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Marquee Text</Form.Label>
						<Form.Control
							type="text"
							name="joinCode"
							value={marqueeText}
							onChange={(e) => setMarqueeText(e.target.value)}
							disabled={!marqueeEnabled}
						/>
						<Form.Text className="text-muted">
							Use the following variables in your marquee text
							<ul>
								<li>%Code% : Show's the code used to join</li>
								<li> %Url% : Show's the Karaoke Party url</li>
							</ul>
						</Form.Text>
					</Form.Group>
					<hr />
					<Form.Group className="mb-3">
						<Form.Label>QR Code ({qrCodeEnabled ? 'enabled' : 'disabled'})</Form.Label>
						{!qrCodeEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOff} onClick={() => setQrCodeEnabled(true)} />
							</div>
						)}
						{qrCodeEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOn} onClick={() => setQrCodeEnabled(false)} />
							</div>
						)}
						<Form.Group className="mb-3">
							<Form.Label>Size</Form.Label>
							<span className="float-right text-muted">{qrCodeSize}</span>
							<Form.Range
								disabled={!qrCodeEnabled}
								value={qrCodeSize}
								min={25}
								max={250}
								onChange={(e) => setQrCodeSize(parseInt(e.target.value))}
							/>
						</Form.Group>
					</Form.Group>
					<hr />
					<Form.Group className="mb-3">
						<Form.Label>Number of upcoming singers to show</Form.Label>
						<span className="float-right text-muted">{splashScreenUpcomingCount}</span>
						<Form.Range
							value={splashScreenUpcomingCount}
							min={0}
							max={5}
							onChange={(e) => setSplashScreenUpcomingCount(parseInt(e.target.value))}
						/>
						<Form.Text className="text-muted">Applies to user devices and splash screen.</Form.Text>
					</Form.Group>
					<hr />
					<Form.Group className="mb-3">
						<Form.Label>
							Splash Screen Settings ({splashScreenEnabled ? 'enabled' : 'splash screen disabled'})
						</Form.Label>
						{!splashScreenEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOff} onClick={() => setSplashScreenEnabled(true)} />
							</div>
						)}
						{splashScreenEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOn} onClick={() => setSplashScreenEnabled(false)} />
							</div>
						)}
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Display Time (seconds)</Form.Label>
						<span className="float-right text-muted">{splashScreenSeconds}</span>
						<Form.Range
							disabled={!splashScreenEnabled}
							value={splashScreenSeconds}
							min={1}
							max={60}
							onChange={(e) => setSplashScreenSeconds(parseInt(e.target.value))}
						/>
					</Form.Group>
					<hr />
					<Form.Group className="mb-3">
						<Form.Label>AI Responses ({aiEnabled ? 'enabled' : 'disabled'})</Form.Label>

						{!aiEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOff} onClick={() => setAiEnabled(true)} />
							</div>
						)}
						{aiEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOn} onClick={() => setAiEnabled(false)} />
							</div>
						)}
						<div className="text-muted">
							Generate ChatGpt messages for the user to read while they wait for the song to download from
							yt-dlp.
						</div>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Auto-Move Singer ({autoMoveSingerEnabled ? 'enabled' : 'disabled'})</Form.Label>

						{!autoMoveSingerEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOff} onClick={() => setAutoMoveSingerEnabled(true)} />
							</div>
						)}
						{autoMoveSingerEnabled && (
							<div className={classNames(['float-right', styles.faToggle])}>
								<FontAwesomeIcon icon={faToggleOn} onClick={() => setAutoMoveSingerEnabled(false)} />
							</div>
						)}
						<div className="text-muted">
							If adding a request to an existing singer in the rotation would change the "Upcoming
							Singers" list, the singer will instead get moved to the next available slot after the
							rotation.
						</div>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancel}>
						Close
					</Button>
					<Button variant="primary" onClick={handleSave}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default SettingsModal;
