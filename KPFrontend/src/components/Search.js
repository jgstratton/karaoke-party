import React from 'react';
import { useState } from 'react';
import Menu from './common/Menu';
import Title from './common/Title';
import LocalResults from './search/LocalResults';
import YoutubeResults from './search/YoutubeResults';
import SearchCard from './search/SearchCard';
import YTService from '../services/YTService';
import ApiService from '../services/ApiService';
import { useNavigate } from 'react-router-dom';
import Overlay from './common/Overlay';
import Button from 'react-bootstrap/Button';

const Search = (props) => {
	const navigate = useNavigate();
	const [searchString, setSearchString] = useState('');
	const [localResults, setLocalResults] = useState([]);
	const [youtubeResults, setYoutubeResults] = useState([]);
	const [searchSubmitted, setSearchSubmitted] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [youtubeLoading, setYoutubeLoading] = useState(false);
	const [addedToQueue, setAddedToQueue] = useState(false);

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
		ApiService.addPerformance(props.party.partyKey, {
			fileName: filename,
			singerId: props.user.singerId,
		});
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
			<Menu user={props.user} leaveParty={props.leaveParty} />
			<Title party={props.party} />
			<SearchCard
				party={props.party}
				user={props.user}
				updateParty={props.updateParty}
				setUser={props.updateUser}
				submitSearch={submitSearch}
				searchString={searchString}
				setSearchString={setSearchString}
			/>
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
