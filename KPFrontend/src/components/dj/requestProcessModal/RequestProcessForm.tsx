import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import PerformanceDTO from '../../../dtoTypes/PerformanceDTO';
import { selectSingerList } from '../../../slices/singerSlice';
import VideoPreview from './../../common/VideoPreview';

interface iProps {
	performance: PerformanceDTO;
	handleSubmit: (singerName: string, singerId: number) => void;
	handleDelete: () => void;
}

const RequestProcessForm = ({ performance, handleDelete, handleSubmit }: iProps) => {
	const [singerName, setSingerName] = useState(performance.singerName);
	const [singerId, setSingerId] = useState(0);
	const [showNameWarning, setShowNameWarning] = useState(false);
	const singerList = useSelector(selectSingerList);

	const submitForm = () => {
		if (singerName.trim().length === 0) {
			setShowNameWarning(true);
			return;
		}
		setShowNameWarning(false);
		handleSubmit(singerName, singerId);
	};

	useEffect(() => {
		setSingerId(0);
		setSingerName(performance.singerName);
	}, [performance]);

	const handleSelectSinger = (e: any) => {
		var index = e.nativeEvent.target.selectedIndex;
		if (index === 0) {
			setSingerId(0);
		} else {
			setSingerId(e.nativeEvent.target[index].value);
		}
	};

	return (
		<>
			<Form.Group as={Row} className="mb-3">
				<Form.Label column sm="2">
					Requested Song
				</Form.Label>
				<Col sm="10">
					<VideoPreview url={performance.url} />
					<div>{performance.songTitle}</div>
					<a href={performance.url}>{performance.url}</a>
				</Col>
			</Form.Group>

			<Form.Group as={Row} className="mb-3">
				<Form.Label column sm="2">
					Submitted By
				</Form.Label>
				<Col sm="10">
					<Form.Label column sm="2">
						{performance.userName}
					</Form.Label>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-3">
				<Form.Label column sm="2">
					Singer's Name
				</Form.Label>
				<Col sm="10">
					<Form.Label column sm="2">
						{performance.singerName}
					</Form.Label>
				</Col>
			</Form.Group>
			<hr />
			<Form.Group className="mb-3">
				<Form.Label>Select Singer in Rotation</Form.Label>
				<Form.Select aria-label="Default select example" onChange={handleSelectSinger}>
					<option value="0">New - Add new singer to rotation</option>
					{singerList.map((s, i) => (
						<option value={s.singerId}>
							{i + 1} - {s.name}
						</option>
					))}
				</Form.Select>
				<Form.Text className="text-muted">
					If it's a duet or group, you could choose to add it to a singer's slot, or create a new slot in the
					rotation.
				</Form.Text>
				{showNameWarning && (
					<p className="text-danger">You must provide a singer's name to add to the rotation</p>
				)}
			</Form.Group>

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
			<Button variant="primary">
				<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
				Add To Queue
			</Button>
			<Button variant="danger" className="ml-3" onClick={() => handleDelete()}>
				<FontAwesomeIcon icon={faTrash} className="mr-2" />
				Delete Request
			</Button>
		</>
	);
};

export default RequestProcessForm;
