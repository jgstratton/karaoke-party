import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Menu from './common/Menu';
import LocalResults from './search/LocalResults';
import YoutubeResults from './search/YoutubeResults';
import SearchCard from './search/SearchCard';
import YTService from '../services/YTService';
import ApiService from '../api/ApiService';
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

const Search = () => {
	const navigate = useNavigate();
	const [searchString, setSearchString] = useState('');
	const [localResults, setLocalResults] = useState([]);
	const [youtubeResults, setYoutubeResults] = useState([]);
	const [searchSubmitted, setSearchSubmitted] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [youtubeLoading, setYoutubeLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [addedToQueue, setAddedToQueue] = useState(false);
	const user = useSelector((state: RootState) => state.user);
	const [isKaraoke, setIsKaraoke] = useState(1);
	const isDj = useSelector(selectUserIsDj);

	async function submitSearch() {
		const actualSearchString = isKaraoke === 1 ? searchString + ' karaoke' : searchString;
		setSearchSubmitted(true);
		setLocalLoading(true);
		const tempLocalResults = await ApiService.searchSongs(actualSearchString);
		setLocalResults(tempLocalResults);
		setLocalLoading(false);
		setYoutubeLoading(true);
		const tempYoutubeResults = await YTService.searchYoutube(actualSearchString);
		// @ts-ignore
		setYoutubeResults(tempYoutubeResults.filter((x) => !tempLocalResults.map((lr) => lr.url).includes(x.url)));
		setYoutubeLoading(false);
	}
	async function resetSearch() {
		setAddedToQueue(false);
		setSearchSubmitted(false);
		setSearchString('');
	}

	async function submitNewPerformance(filename: string, singerName: string, singerId?: number) {
		setLoading(true);
		const createNewSinger = (singerId ?? 0) === 0;
		const newRequest: PerformanceRequestDTO = {
			fileName: filename,
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
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			{loading || addedToQueue ? (
				<Overlay>
					{loading && <div>saving...</div>}
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
			{searchSubmitted && (
				<>
					<LocalResults
						results={localResults}
						loading={localLoading}
						handleNewPerformance={submitNewPerformance}
					/>
					<YoutubeResults
						results={youtubeResults}
						loading={youtubeLoading}
						handleNewPerformance={submitNewPerformance}
					/>
				</>
			)}
		</div>
	);
};
export default Search;
