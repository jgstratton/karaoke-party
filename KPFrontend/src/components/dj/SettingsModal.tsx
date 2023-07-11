import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { broadcastSettings, selectPlayerSettings } from '../../slices/playerSlice';
import styles from './SettingsModal.module.css';
interface props {
	show: boolean;
	handleClose: () => void;
}

const SettingsModal = ({ show, handleClose }: props) => {
	const dispatch = useDispatch();
	const playerStoreSettings = useSelector(selectPlayerSettings);
	const [marqueeEnabled, setMarqueeEnabled] = useState(false);
	const [marqueeText, setMarqueeText] = useState('');
	const [marqueeSpeed, setMarqueeSpeed] = useState(20);
	const [marqueeSize, setMarqueeSize] = useState(40);

	const [splashScreenEnabled, setSplashScreenEnabled] = useState(false);
	const [splashScreenSeconds, setSplashScreenSeconds] = useState(10);
	const [splashScreenUpcomingCount, setSplashScreenUpcomingCount] = useState(3);

	const resetSettings = useCallback(() => {
		setMarqueeEnabled(playerStoreSettings.marqueeEnabled);
		setMarqueeText(playerStoreSettings.marqueeText);
		setMarqueeSpeed(playerStoreSettings.marqueeSpeed);
		setMarqueeSize(playerStoreSettings.marqueeSize);
		setSplashScreenEnabled(playerStoreSettings.splashScreenEnabled);
		setSplashScreenSeconds(playerStoreSettings.splashScreenSeconds);
		setSplashScreenUpcomingCount(playerStoreSettings.splashScreenUpcomingCount);
	}, [playerStoreSettings]);

	useEffect(() => {
		resetSettings();
	}, [resetSettings]);

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
							min={5}
							max={60}
							onChange={(e) => setSplashScreenSeconds(parseInt(e.target.value))}
						/>
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
