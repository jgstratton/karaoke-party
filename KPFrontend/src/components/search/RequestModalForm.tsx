import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectSingerList } from '../../slices/singerSlice';
import { selectUserIsDj, selectUserName } from '../../slices/userSlice';
import { SongDTO } from '../../dtoTypes/SongDTO';
import YoutubeEmbed from '../common/VideoEmbed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import VideoPreview from '../common/VideoPreview';

interface iProps {
	song?: SongDTO;
	show: boolean;
	showKaraokeWarning: boolean;
	handleSubmit: (singerName: string, singerId?: number) => void;
	handleClose: () => void;
}

const RequestModalForm = ({ song, show, handleSubmit, handleClose, showKaraokeWarning }: iProps) => {
	const [singerName, setSingerName] = useState('');
	const [singerId, setSingerId] = useState<number | undefined>();
	const [showNameWarning, setShowNameWarning] = useState(false);
	const userName = useSelector(selectUserName);
	const isDj = useSelector(selectUserIsDj);
	const singerList = useSelector(selectSingerList);
	const [useEmbedded, setUseEmbedded] = useState(false);

	useEffect(() => {
		if (!isDj) {
			setSingerName(userName);
		} else {
			setSingerId(0);
		}
	}, [isDj, userName]);

	useEffect(() => {
		setUseEmbedded(false);
	}, [song]);

	const submitForm = () => {
		if (singerName.trim().length === 0) {
			setShowNameWarning(true);
			return;
		}
		setShowNameWarning(false);
		handleSubmit(singerName, singerId);
	};

	const handleSelectSinger = (e: any) => {
		var index = e.nativeEvent.target.selectedIndex;
		if (index === 0) {
			setSingerName('');
			setSingerId(0);
		} else {
			setSingerName(e.nativeEvent.target[index].text.split('-').slice(-1)[0].trim());
			setSingerId(parseInt(e.nativeEvent.target[index].value));
		}
	};

	const ToggleVideo = () =>
		useEmbedded ? (
			<Button onClick={() => setUseEmbedded(false)}>Disable Embedded Video Preview</Button>
		) : (
			<Button onClick={() => setUseEmbedded(true)}>Load Embedded Video Preview</Button>
		);

	return (
		<Modal size="lg" show={show} backdrop="static">
			<Modal.Header closeButton onHide={() => handleClose()}>
				<Modal.Title>Verify and submit your request</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group className="mb-3">
					<Form.Label>Selected Song</Form.Label>
					{song &&
						(useEmbedded ? (
							<div style={{ width: '320px' }}>
								<YoutubeEmbed embedId={song.id} />
							</div>
						) : (
							<VideoPreview url={song?.url} />
						))}
					{showKaraokeWarning && (
						<div className="alert alert-warning mt-2">
							<FontAwesomeIcon icon={faInfoCircle} /> We cannot verify that this is a karaoke version.
							Please preview the video and make sure it's the version you want.
							<br />
							{ToggleVideo()}
						</div>
					)}

					<div>{song?.title}</div>

					<a href={song?.url}>{song?.url}</a>
				</Form.Group>
				{isDj && (
					<Form.Group className="mb-3">
						<Form.Label>Select Singer in Rotation</Form.Label>
						<Form.Select value={singerId} onChange={handleSelectSinger}>
							<option value="0">New - Add new singer to rotation</option>
							{singerList.map((s, i) => (
								<option key={s.singerId} value={s.singerId}>
									{i + 1} - {s.name}
								</option>
							))}
						</Form.Select>
						<Form.Text className="text-muted">
							By default, user will be added right before the current singer so as not to jump anyone in
							line.
						</Form.Text>
						{showNameWarning && (
							<p className="text-danger">You must provide a singer's name to add to the rotation</p>
						)}
					</Form.Group>
				)}
				<Form.Group className="mb-3">
					<Form.Label>Singer's Name</Form.Label>
					<Form.Control
						type="text"
						name="singerName"
						value={singerName}
						onChange={(e) => setSingerName(e.target.value)}
					/>
					<Form.Text className="text-muted">
						If different than the singer in rotation, like a duet or a group.
					</Form.Text>
					{showNameWarning && (
						<p className="text-danger">You must provide a singer's name... this isn't karaoke roulette!</p>
					)}
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Cancel
				</Button>
				<Button variant="primary" onClick={() => submitForm()}>
					Submit Request
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RequestModalForm;
