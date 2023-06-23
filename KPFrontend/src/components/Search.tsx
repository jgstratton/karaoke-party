import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Menu from './common/Menu';
import LocalResults from './search/LocalResults';
import YoutubeResults from './search/YoutubeResults';
import SearchCard from './search/SearchCard';
import YTService from '../services/YTService';
import ApiService from '../api/ApiService';
import { useNavigate } from 'react-router-dom';
import Overlay from './common/Overlay';
import Button from 'react-bootstrap/Button';
import { addRequest } from '../slices/performancesSlice';
import { RootState } from '../store';
import PerformanceApi from '../api/PerformanceApi';

const Search = () => {
	const navigate = useNavigate();
	const [searchString, setSearchString] = useState('');
	const [localResults, setLocalResults] = useState([]);
	const [youtubeResults, setYoutubeResults] = useState([]);
	const [searchSubmitted, setSearchSubmitted] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [youtubeLoading, setYoutubeLoading] = useState(false);
	const [addedToQueue, setAddedToQueue] = useState(false);
	const party = useSelector((state: RootState) => state.party);
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	async function submitSearch() {
		setSearchSubmitted(true);
		setLocalLoading(true);
		const tempLocalResults = await ApiService.searchSongs(searchString);
		setLocalResults(tempLocalResults);
		setLocalLoading(false);
		setYoutubeLoading(true);
		const tempYoutubeResults = await YTService.searchYoutube(searchString);
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
		const newPerforamance = await PerformanceApi.addPerformance(party.partyKey, {
			fileName: filename,
			userId: user.userId ?? 0,
			singerName: singerName,
			singerId: singerId,
			createNewSinger: typeof singerId !== 'undefined',
		});
		if (!newPerforamance.ok) {
			alert(newPerforamance.error.toString());
			return;
		}

		dispatch(addRequest(newPerforamance.value));
		setAddedToQueue(true);
	}

	return (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			{addedToQueue ? (
				<Overlay>
					<div>Your song request has been received!</div>
					<br />
					<div className="mb-3">
						<Button onClick={() => navigate('/home')}>Done for now</Button>
					</div>
					<div className="mb-3">
						<Button onClick={() => resetSearch()}>Search for another song</Button>
					</div>
				</Overlay>
			) : (
				''
			)}
			<Menu />
			<SearchCard submitSearch={submitSearch} searchString={searchString} setSearchString={setSearchString} />
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
