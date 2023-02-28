import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectUserIsDj, selectUserName } from '../../slices/userSlice';
import VideoPreview from './VideoPreview';

interface iProps {
	title: string;
	url: string;
	show: boolean;
	handleSubmit: (singerName: string) => void;
	handleClose: () => void;
}

const RequestModalForm = ({ title, url, show, handleSubmit, handleClose }: iProps) => {
	const [singerName, setSingerName] = useState('');
	const [showNameWarning, setShowNameWarning] = useState(false);
	const userName = useSelector(selectUserName);
	const isDj = useSelector(selectUserIsDj);

	useEffect(() => {
		if (!isDj) {
			setSingerName(userName);
		}
	}, [isDj, userName]);

	const submitForm = () => {
		if (singerName.trim().length === 0) {
			setShowNameWarning(true);
			return;
		}
		setShowNameWarning(false);
		handleSubmit(singerName);
	};
	return (
		<Modal size="lg" show={show} backdrop="static">
			<Modal.Header closeButton>
				<Modal.Title>Verify and submit your request</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group className="mb-3">
					<Form.Label>Selected Song</Form.Label>
					<VideoPreview url={url} />
					<div>{title}</div>
					<a href={url}>{url}</a>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Singer's Name</Form.Label>
					<Form.Control
						type="text"
						name="singerName"
						value={singerName}
						onChange={(e) => setSingerName(e.target.value)}
					/>
					<Form.Text className="text-muted">Who will be performing this song?</Form.Text>
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
