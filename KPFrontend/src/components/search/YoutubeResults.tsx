import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../css/table-classes.css';
import Loading from '../common/Loading';
import Overlay from '../common/Overlay';
import VideoPreview from '../common/VideoPreview';
import YTService from '../../services/YTService';
import ApiService from '../../api/ApiService';
import { YtdlpSongDTO } from '../../dtoTypes/YtdlpSongDTO';
import RequestModalForm from './RequestModalForm';
import { selectUserIsDj } from '../../slices/userSlice';

interface iProps {
	results: YtdlpSongDTO[];
	loading: boolean;
	handleNewPerformance: (filename: string, singerName: string, singerId?: number) => Promise<void>;
}

const downloadMessages = [
	"We're listening to your song to see if it's any good...",
	"Checking this song to see if it's worthy of your awesomeness...",
	'I love this song!  Good choice! Hang tight while I jam out...',
	'You can sing this song?  You got skillz yo...',
	"Oh I can't wait to hear this one... it's gonna rock!...",
	'Wait for it... waaaait foooor iiiiit.....',
	'This is going to be legen ... (wait for it) ... dary!',
	'Karaoke time!!!...',
	'Running this song through the awesomeness filter, stand by',
	'Just a minute...',
	'Removing ads from this song... cause ads suck...',
	'Processing... processing... processing...',
	'Fetching muzic... gathering notes... compiling lyrics...',
	'This song is restricted to amazing singers only... which you are!...',
	'In just a few moments this song will be all yours...',
	'One moment please...',
	'Analying this song for adequate notes',
	'Counting the beats in this song...',
	"Previewing this song to see if it's worth your time...",
	'How about a country song next time?...',
	'How about some broadway musical numbers next time?...',
	"Oh good song! You're gonna rock this!...",
	"Really... you're gonna sing THIS song?...",
	"I'm debating on if I'm gonna let you sing this one...",
];
const YouTubeResults = ({ results, loading, handleNewPerformance }: iProps) => {
	const [downloadInProgress, setDownloadInProgress] = useState(false);
	const [selectedSong, setSelectedSong] = useState<YtdlpSongDTO>();
	const [showRequestForm, setShowRequestForm] = useState(false);
	const [downloadMessage, setDownloadMessage] = useState('Download in progress... this may take a minute...');
	const isDj = useSelector(selectUserIsDj);

	const selectSong = (song: YtdlpSongDTO) => {
		setSelectedSong(song);
		setShowRequestForm(true);
	};

	const handleSubmitForm = async (singerName: string, singerId?: number) => {
		setDownloadInProgress(true);
		if (!isDj) {
			setDownloadMessage(downloadMessages[Math.floor(Math.random() * downloadMessages.length)]);
		}
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
		handleNewPerformance(fileName, singerName, singerId);
	};

	return (
		<>
			{downloadInProgress && (
				<Overlay>
					<Loading>{downloadMessage}</Loading>
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
