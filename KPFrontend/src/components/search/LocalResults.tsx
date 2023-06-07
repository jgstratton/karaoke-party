import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../../css/table-classes.css';
import Loading from '../common/Loading';
import VideoPreview from './VideoPreview';
import { Col, Row } from 'react-bootstrap';
import { SongDTO } from '../../dtoTypes/SongDTO';
import RequestModalForm from './RequestModalForm';

interface iProps {
	results: SongDTO[];
	loading: boolean;
	addToQueue: (filename: string, singerName: string, singerId: number) => Promise<void>;
}

const LocalResults = ({ results, loading, addToQueue }: iProps) => {
	const [selectedSong, setSelectedSong] = useState<SongDTO>();
	const [showRequestForm, setShowRequestForm] = useState(false);

	const selectFile = (song: SongDTO) => {
		setSelectedSong(song);
		setShowRequestForm(true);
	};

	const handleSubmitForm = (singerName: string, singerId: number) => {
		addToQueue(selectedSong?.fileName ?? '', singerName, singerId);
		setShowRequestForm(false);
	};

	return (
		<>
			<Card className="mt-3">
				<Card.Body>
					<Card.Title>Songs found in library</Card.Title>
					<Card.Text className="text-warning">
						{loading ? (
							<Loading />
						) : (
							<>
								{results.length > 0 ? (
									<>
										{results.map((r, i) => (
											<Row key={r.fileName}>
												<Col md={8}>
													<VideoPreview url={r.url} />
													<div>{r.title}</div>
													<a href={r.url}>{r.url}</a>
												</Col>
												<Col className="text-sm-right mt-sm-3 mt-md-0" md={4}>
													<Button onClick={() => selectFile(r)}>Request this song</Button>
												</Col>

												<Col sm={12}>
													<hr />
												</Col>
											</Row>
										))}
									</>
								) : (
									<div className="text-muted mt-3">No downloaded results found in library</div>
								)}
							</>
						)}
					</Card.Text>
				</Card.Body>
			</Card>
			<RequestModalForm
				show={showRequestForm}
				title={selectedSong?.title ?? ''}
				url={selectedSong?.url ?? ''}
				handleClose={() => setShowRequestForm(false)}
				handleSubmit={handleSubmitForm}
			/>
		</>
	);
};
export default LocalResults;
