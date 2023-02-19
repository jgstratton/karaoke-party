import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Menu from './common/Menu';
import LocalResults from './search/LocalResults';
import YoutubeResults from './search/YoutubeResults';
import SearchCard from './search/SearchCard';
import YTService from '../services/YTService';
import ApiService from '../services/ApiService';
import { useNavigate } from 'react-router-dom';
import Overlay from './common/Overlay';
import Button from 'react-bootstrap/Button';
import { addRequest } from '../slices/performancesSlice';

const Search = (props) => {
	const navigate = useNavigate();
	const [searchString, setSearchString] = useState('');
	const [localResults, setLocalResults] = useState([]);
	const [youtubeResults, setYoutubeResults] = useState([]);
	const [searchSubmitted, setSearchSubmitted] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [youtubeLoading, setYoutubeLoading] = useState(false);
	const [addedToQueue, setAddedToQueue] = useState(false);
	const party = useSelector((state) => state.party);
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	async function submitSearch() {
		setSearchSubmitted(true);
		setLocalLoading(true);
		const tempLocalResults = await ApiService.searchSongs(searchString);
		setLocalResults(tempLocalResults);
		setLocalLoading(false);
		setYoutubeLoading(true);
		const tempYoutubeResults = await YTService.searchYoutube(searchString);
		setYoutubeResults(tempYoutubeResults.filter((x) => !tempLocalResults.map((lr) => lr.url).includes(x.url)));
		setYoutubeLoading(false);
	}
	async function resetSearch() {
		setAddedToQueue(false);
		setSearchSubmitted(false);
		setSearchString('');
	}

	async function addToQueue(filename) {
		const newPerforamance = await ApiService.addPerformance(party.partyKey, {
			fileName: filename,
			singerId: user.singerId,
		});
		dispatch(addRequest(newPerforamance));
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
						<Button onClick={() => resetSearch(false)}>Search for another song</Button>
					</div>
				</Overlay>
			) : (
				''
			)}
			<Menu />
			<SearchCard submitSearch={submitSearch} searchString={searchString} setSearchString={setSearchString} />
			{searchSubmitted && (
				<>
					<LocalResults results={localResults} loading={localLoading} addToQueue={addToQueue} />
					<YoutubeResults results={youtubeResults} loading={youtubeLoading} addToQueue={addToQueue} />
				</>
			)}
		</div>
	);
};
export default Search;
