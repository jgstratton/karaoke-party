import React from 'react';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../css/table-classes.css';
import Loading from '../common/Loading';
import Overlay from '../common/Overlay';
import VideoPreview from './VideoPreview';
import YTService from '../../services/YTService';
import ApiService from '../../api/ApiService';
import { YtdlpSongDTO } from '../../dtoTypes/YtdlpSongDTO';
import RequestModalForm from './RequestModalForm';

interface iProps {
	results: YtdlpSongDTO[];
	loading: boolean;
	addToQueue: (filename: string, singerName: string, singerId: number) => Promise<void>;
}
const YouTubeResults = ({ results, loading, addToQueue }: iProps) => {
	const [downloadInProgress, setDownloadInProgress] = useState(false);
	const [selectedSong, setSelectedSong] = useState<YtdlpSongDTO>();
	const [showRequestForm, setShowRequestForm] = useState(false);

	const selectSong = (song: YtdlpSongDTO) => {
		setSelectedSong(song);
		setShowRequestForm(true);
	};

	const handleSubmitForm = async (singerName: string, singerId: number) => {
		setDownloadInProgress(true);
		let fileName = await YTService.downloadYoutube(selectedSong?.url ?? '');
		if (fileName.length === 0) {
			alert('error downloading file...');
			setDownloadInProgress(false);
			return;
		}
		await ApiService.addSong({
			fileName: fileName,
			title: selectedSong?.title ?? '',
			url: selectedSong?.url ?? '',
		});
		setDownloadInProgress(false);
		setShowRequestForm(false);
		addToQueue(fileName, singerName, singerId);
	};

	return (
		<>
			{downloadInProgress && (
				<Overlay>
					<Loading>Download in progress... this may take a minute...</Loading>
				</Overlay>
			)}
			<Card className="mt-3">
				<Card.Body>
					<Card.Title>Online search results</Card.Title>
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
				title={selectedSong?.title ?? ''}
				url={selectedSong?.url ?? ''}
				handleClose={() => setShowRequestForm(false)}
				handleSubmit={handleSubmitForm}
			/>
		</>
	);
};
export default YouTubeResults;
