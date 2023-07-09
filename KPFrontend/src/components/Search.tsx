import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Menu from './common/Menu';
import SearchResults from './search/SearchResults';
import SearchCard from './search/SearchCard';
import Loading from '../components/common/Loading';

import { useNavigate } from 'react-router-dom';
import Overlay from './common/Overlay';
import Button from 'react-bootstrap/Button';
import { RootState } from '../store';
import { selectUserIsDj } from '../slices/userSlice';
import {
	CreateNewRequestForExistingSinger,
	CreateNewRequestForNewSinger,
	CreateNewUserRequest,
} from '../mediators/NewRequestMediator';
import { PerformanceRequestDTO } from '../dtoTypes/PerformanceRequestDTO';
import { SongDTO } from '../dtoTypes/SongDTO';
import SongApi from '../api/SongApi';

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

const Search = () => {
	const navigate = useNavigate();
	const [searchString, setSearchString] = useState('');
	const [searchResults, setSearchResults] = useState<SongDTO[]>([]);
	const [searchSubmitted, setSearchSubmitted] = useState(false);
	const [searchLoading, setSearchLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [addedToQueue, setAddedToQueue] = useState(false);
	const user = useSelector((state: RootState) => state.user);
	const [isKaraoke, setIsKaraoke] = useState(1);
	const isDj = useSelector(selectUserIsDj);
	const [errorMsg, setErrorMsg] = useState('');
	const [downloadInProgress, setDownloadInProgress] = useState(false);
	const [downloadMessage, setDownloadMessage] = useState('Download in progress... this may take a minute...');

	async function submitSearch() {
		setSearchLoading(true);
		setSearchSubmitted(true);
		setErrorMsg('');
		const tempSearchResults = await SongApi.searchSongs({
			searchString: searchString,
			karaokeFlag: isKaraoke === 1,
		});
		if (!tempSearchResults.ok) {
			setErrorMsg(tempSearchResults.error);
			return;
		}

		setSearchResults(tempSearchResults.value);
		setSearchLoading(false);
	}

	async function resetSearch() {
		setAddedToQueue(false);
		setSearchSubmitted(false);
		setSearchString('');
	}

	async function handleSubmitRequest(selectedSong: SongDTO, singerName: string, singerId?: number) {
		setDownloadInProgress(true);
		if (!isDj) {
			setDownloadMessage(downloadMessages[Math.floor(Math.random() * downloadMessages.length)]);
		}
		if (!selectedSong) {
			alert('No song selected');
			setDownloadInProgress(false);
			return;
		}
		if (selectedSong.fileName.length == 0) {
			const downloadResult = await SongApi.downloadSong(selectedSong);
			if (!downloadResult.ok) {
				alert('error downloading file...');
				setDownloadInProgress(false);
				return;
			}
			setDownloadInProgress(false);
			addNewPerformance(downloadResult.value, singerName, singerId);
			return;
		}

		console.log('already downloaded... pause anyway');
		setTimeout(
			() => {
				setDownloadInProgress(false);
				addNewPerformance(selectedSong, singerName, singerId);
			},
			isDj ? 1000 : 5000
		);
	}

	async function addNewPerformance(selectedSong: SongDTO, singerName: string, singerId?: number) {
		setLoading(true);
		const createNewSinger = (singerId ?? 0) === 0;
		const newRequest: PerformanceRequestDTO = {
			fileName: selectedSong.fileName,
			userId: user.userId ?? 0,
			singerName: singerName,
			singerId: singerId,
		};
		const newRequestResult = !isDj
			? await CreateNewUserRequest(newRequest)
			: createNewSinger
			? await CreateNewRequestForNewSinger(newRequest)
			: await CreateNewRequestForExistingSinger(newRequest);

		if (!newRequestResult.ok) {
			setLoading(false);
			alert(newRequestResult.error);
			return;
		}

		setLoading(false);
		setAddedToQueue(true);
	}

	return (
		<>
			{downloadInProgress && (
				<Overlay>
					<Loading>{downloadMessage}</Loading>
				</Overlay>
			)}

			<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
				{loading || addedToQueue ? (
					<Overlay>
						{loading && <div>Adding to queue...</div>}
						{addedToQueue && (
							<>
								<div>Your song request has been received!</div>
								<br />
								<div className="mb-3">
									<Button onClick={() => navigate('/home')}>Done for now</Button>
								</div>
								<div className="mb-3">
									<Button onClick={() => resetSearch()}>Search for another song</Button>
								</div>
							</>
						)}
					</Overlay>
				) : (
					''
				)}
				<Menu />
				{!isDj && (
					<div className="mb-2 text-right">
						<Button className="btn-link" onClick={() => navigate('/home')}>
							Back
						</Button>
					</div>
				)}

				<SearchCard
					submitSearch={submitSearch}
					searchString={searchString}
					setSearchString={setSearchString}
					isKaraoke={isKaraoke}
					setIsKaraoke={setIsKaraoke}
				/>
				{errorMsg.length > 0 ? (
					<div className="alert alert-danger">{errorMsg}</div>
				) : (
					<>
						{searchSubmitted && (
							<>
								<SearchResults
									results={searchResults}
									loading={searchLoading}
									submitRequest={handleSubmitRequest}
								/>
							</>
						)}
					</>
				)}
			</div>
		</>
	);
};
export default Search;
