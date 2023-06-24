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
	const [singerId, setSingerId] = useState(-1);
	const [nameWarning, setNameWarning] = useState('');
	const [singerWarning, setSingerWarning] = useState('');
	const singerList = useSelector(selectSingerList);

	const submitForm = () => {
		console.log(singerId);
		if (singerName.trim().length === 0) {
			setNameWarning('We need to know who is singing this song');
			return;
		}
		if (singerId < 0) {
			setSingerWarning('You must choose a singer in the rotation (or add new)');
			return;
		}
		setNameWarning('');
		setSingerWarning('');
		handleSubmit(singerName, singerId);
	};

	useEffect(() => {
		setSingerId(-1);
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
				<Form.Select value={singerId} onChange={handleSelectSinger}>
					<option value="-1">-- Select --</option>
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
				{singerWarning.length > 0 && <p className="text-danger">{singerWarning}</p>}
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
				{nameWarning.length > 0 && <p className="text-danger">{nameWarning}</p>}
			</Form.Group>
			<Button variant="primary" onClick={() => submitForm()}>
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
