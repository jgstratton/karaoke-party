import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../css/table-classes.css';
import Loading from '../common/Loading';
import VideoPreview from '../common/VideoPreview';
import RequestModalForm from './RequestModalForm';
import { SongDTO } from '../../dtoTypes/SongDTO';

interface iProps {
	results: SongDTO[];
	loading: boolean;
	submitRequest: (selectedSong: SongDTO, singerName: string, singerId?: number) => Promise<void>;
}

const SearchResults = ({ results, loading, submitRequest }: iProps) => {
	const [selectedSong, setSelectedSong] = useState<SongDTO>({
		id: '',
		fileName: '',
		title: '',
		url: '',
	});
	const [showRequestForm, setShowRequestForm] = useState(false);

	const selectSong = (song: SongDTO) => {
		setSelectedSong(song);
		setShowRequestForm(true);
	};

	return (
		<>
			<Card className="mt-3">
				<Card.Body>
					<Card.Title>Search results</Card.Title>
					<Card.Text className="text-warning">
						{loading ? (
							<Loading />
						) : (
							<>
								{results.map((r) => (
									<Row key={r.id}>
										<Col md={8}>
											<VideoPreview url={r.url} />
											<div>{r.title}</div>
											<a href={r.url}>{r.url}</a>
										</Col>
										<Col className="text-sm-right mt-sm-3 mt-md-0" md={4}>
											<Button onClick={() => selectSong(r)}>Request this song</Button>
										</Col>
										<Col sm={12}>
											<hr />
										</Col>
									</Row>
								))}
							</>
						)}
					</Card.Text>
				</Card.Body>
			</Card>
			<RequestModalForm
				show={showRequestForm}
				song={selectedSong}
				handleClose={() => setShowRequestForm(false)}
				handleSubmit={(singerName, singerId) => {
					setShowRequestForm(false);
					submitRequest(selectedSong, singerName, singerId);
				}}
			/>
		</>
	);
};
export default SearchResults;
