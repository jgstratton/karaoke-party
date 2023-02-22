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

	const resetSettings = useCallback(() => {
		setMarqueeEnabled(playerStoreSettings.marqueeEnabled);
		setMarqueeText(playerStoreSettings.marqueeText);
		setMarqueeSpeed(playerStoreSettings.marqueeSpeed);
		setMarqueeSize(playerStoreSettings.marqueeSize);
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
			})
		);
		handleClose();
	};

	return (
		<>
			<Modal className={styles.settingsModal} size="lg" show={show} backdrop="static">
				<Modal.Header closeButton>
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
