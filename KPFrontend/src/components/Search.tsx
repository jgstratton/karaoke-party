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
import { downloadMessages } from './search/DownloadResponses';

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

	const changeSearchSetting = (isKaraoke: number) => {
		setSearchSubmitted(false);
		setIsKaraoke(isKaraoke);
	};

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
		setDownloadMessage('');
		if (!selectedSong) {
			alert('No song selected');
			setDownloadInProgress(false);
			return;
		}
		const openAiMessageResult = await SongApi.openAiMessage(selectedSong.title);
		setDownloadMessage(
			openAiMessageResult.ok
				? openAiMessageResult.value
				: downloadMessages[Math.floor(Math.random() * downloadMessages.length)]
		);
		if (selectedSong.fileName.length === 0) {
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
		setTimeout(() => {
			setDownloadInProgress(false);
			addNewPerformance(selectedSong, singerName, singerId);
		}, 5000);
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
			<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
				{downloadInProgress || loading || addedToQueue ? (
					<Overlay>
						<div style={{ maxWidth: '350px', padding: '0 5px', lineHeight: '20px' }}>
							{downloadMessage.length > 0 && (
								<>
									{downloadMessage}
									<hr />
								</>
							)}

							{downloadInProgress && (
								<p>
									<Loading>Please wait while we fetch your song...</Loading>
								</p>
							)}
							{loading && <div>Adding to queue...</div>}
							{addedToQueue && (
								<>
									<div>Your song request has been received!</div>
									<br />
									<div className="mb-3">
										<Button onClick={() => navigate(-1)}>Done for now</Button>
									</div>
									<div className="mb-3">
										<Button onClick={() => resetSearch()}>Search for another song</Button>
									</div>
								</>
							)}
						</div>
					</Overlay>
				) : (
					''
				)}
				<Menu />
				{!isDj && (
					<div className="mb-2 text-right">
						<Button className="btn-link" onClick={() => navigate(-1)}>
							Back
						</Button>
					</div>
				)}

				<SearchCard
					submitSearch={submitSearch}
					searchString={searchString}
					setSearchString={setSearchString}
					isKaraoke={isKaraoke}
					setIsKaraoke={changeSearchSetting}
				/>
				{errorMsg.length > 0 ? (
					<div className="alert alert-danger">{errorMsg}</div>
				) : (
					<>
						{searchSubmitted && (
							<>
								<SearchResults
									isKaraoke={isKaraoke === 1}
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
