import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Menu from './common/Menu';
import SearchResults from './search/SearchResults';
import SearchCard from './search/SearchCard';
import Loading from '../components/common/Loading';

import { useNavigate } from 'react-router-dom';
import Overlay, { Positions } from './common/Overlay';
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
import DownloadResponseGenerator from './search/DownloadResponseGenerator';

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
	const minDownloadTime = 5000; // wait at least 5 seconds when downloading
	const [submittedSongTitle, setSubmittedSongTitle] = useState('');

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
		let submitSongDto = selectedSong;
		setDownloadInProgress(true);
		setDownloadMessage('');
		if (!submitSongDto) {
			alert('No song selected');
			setDownloadInProgress(false);
			return;
		}
		const downloadStart = new Date();
		// start the file download
		let downloadPromise = submitSongDto.fileName.length === 0 ? SongApi.downloadSong(submitSongDto) : null;

		// start the chatgpt api
		setSubmittedSongTitle(submitSongDto.title);

		if (downloadPromise != null) {
			const downloadResult = await downloadPromise;
			if (!downloadResult.ok) {
				alert('error downloading file...');
				setDownloadInProgress(false);
				return;
			}
			submitSongDto = downloadResult.value;
		}

		const totalWaitTime = new Date().valueOf() - downloadStart.valueOf();
		const remainingWaitTime = totalWaitTime > minDownloadTime ? 1 : minDownloadTime - totalWaitTime;
		console.log(`Waiting ${remainingWaitTime} more ms`);
		setTimeout(() => {
			setDownloadInProgress(false);
			addNewPerformance(submitSongDto, singerName, singerId);
		}, remainingWaitTime);
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
					<Overlay position={Positions.FullTop}>
						<div style={{ width: '100%', padding: '0 15px', lineHeight: '20px' }}>
							<div style={{ minHeight: '130px' }}>
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
								{downloadInProgress && (
									<p>
										<Loading>Please wait while we fetch your song...</Loading>
									</p>
								)}
								{loading && <div>Adding to queue...</div>}
							</div>
							<DownloadResponseGenerator songTitle={submittedSongTitle} />
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
						{searchSubmitted && !downloadInProgress && !loading && !addedToQueue && (
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
