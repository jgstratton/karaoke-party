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
	isKaraoke: boolean;
	loading: boolean;
	submitRequest: (selectedSong: SongDTO, singerName: string, singerId?: number) => Promise<void>;
}

const SearchResults = ({ results, loading, submitRequest, isKaraoke }: iProps) => {
	const [selectedSong, setSelectedSong] = useState<SongDTO>({
		id: '',
		fileName: '',
		title: '',
		url: '',
		S3Key: '',
	});
	const [karaokeWarning, setKaraokeWarning] = useState(false);
	const [showRequestForm, setShowRequestForm] = useState(false);
	const karaokeResults: SongDTO[] = [];
	const otherResults: SongDTO[] = [];
	if (isKaraoke) {
		results.forEach((r) => {
			const lowerTitle = r.title.toLowerCase();
			if (lowerTitle.includes('karaoke') || lowerTitle.includes('karoake') || lowerTitle.includes('kareoke')) {
				karaokeResults.push(r);
				return;
			}
			if (lowerTitle.includes('instrumental') && lowerTitle.includes('lyric')) {
				karaokeResults.push(r);
				return;
			}
			otherResults.push(r);
		});
	}
	const selectSong = (song: SongDTO, warning: boolean) => {
		setSelectedSong(song);
		setKaraokeWarning(warning);
		setShowRequestForm(true);
	};

	return (
		<>
			{loading ? (
				<Card className="mt-3">
					<Card.Body>
						<Card.Title>Searching</Card.Title>
						<Card.Text className="text-warning"></Card.Text>
						<Loading />
					</Card.Body>
				</Card>
			) : (
				<>
					{isKaraoke ? (
						<>
							{karaokeResults.length === 0 && (
								<div className="alert alert-warning mt-3">
									Unable to find any Karaoke versions for your song.
									{otherResults.length > 0
										? 'The results below might be karaoke versions, but you should check them out to verify before submitting your request.  Click on the video link and preview it on YouTube to see if it will work for you.'
										: 'Try searching again.'}
								</div>
							)}
							<Card className="mt-3">
								<Card.Body>
									<Card.Title>Search Results</Card.Title>
									<Card.Text className="text-warning"></Card.Text>
									{karaokeResults.map((r) => (
										<Row key={r.id}>
											<Col md={8}>
												<VideoPreview url={r.url} />
												<div>{r.title}</div>
												<a href={r.url}>{r.url}</a>
											</Col>
											<Col className="text-sm-right mt-sm-3 mt-md-0" md={4}>
												<Button onClick={() => selectSong(r, false)}>Request this song</Button>
											</Col>
											<Col sm={12}>
												<hr />
											</Col>
										</Row>
									))}
								</Card.Body>
							</Card>
							{karaokeResults.length > 0 && otherResults.length > 0 && (
								<div className="alert alert-warning mt-3">
									We could not verify that the remaning search results are actual karaoke versions.
									You should check them out and make sure it's a version you like before submitting
									the request.
								</div>
							)}
							{otherResults.length > 0 && (
								<Card className="mt-3">
									<Card.Body>
										<Card.Title>Additional Search Results</Card.Title>
										<Card.Text className="text-warning"></Card.Text>
										{otherResults.map((r) => (
											<Row key={r.id}>
												<Col md={8}>
													<VideoPreview url={r.url} />
													<div>{r.title}</div>
													<a href={r.url}>{r.url}</a>
												</Col>
												<Col className="text-sm-right mt-sm-3 mt-md-0" md={4}>
													<Button onClick={() => selectSong(r, true)}>
														Request this song
													</Button>
												</Col>
												<Col sm={12}>
													<hr />
												</Col>
											</Row>
										))}
									</Card.Body>
								</Card>
							)}
						</>
					) : (
						<>
							<Card className="mt-3">
								<Card.Body>
									<Card.Title>Search Results</Card.Title>
									<Card.Text className="text-warning"></Card.Text>
									{results.map((r) => (
										<Row key={r.id}>
											<Col md={8}>
												<VideoPreview url={r.url} />
												<div>{r.title}</div>
												<a href={r.url}>{r.url}</a>
											</Col>
											<Col className="text-sm-right mt-sm-3 mt-md-0" md={4}>
												<Button onClick={() => selectSong(r, false)}>Request this song</Button>
											</Col>
											<Col sm={12}>
												<hr />
											</Col>
										</Row>
									))}
								</Card.Body>
							</Card>
						</>
					)}

					<RequestModalForm
						show={showRequestForm}
						song={selectedSong}
						showKaraokeWarning={karaokeWarning}
						handleClose={() => setShowRequestForm(false)}
						handleSubmit={(singerName, singerId) => {
							setShowRequestForm(false);
							submitRequest(selectedSong, singerName, singerId);
						}}
					/>
				</>
			)}
		</>
	);
};
export default SearchResults;
