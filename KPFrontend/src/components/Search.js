import React from 'react';
import { useState } from 'react';
import Menu from './common/Menu';
import Title from './common/Title';
import LocalResults from './search/LocalResults';
import YoutubeResults from './search/YoutubeResults';
import SearchCard from './search/SearchCard';
import YTService from '../services/YTService';
import ApiService from '../services/ApiService';

const Search = (props) => {
	const [localResults, setLocalResults] = useState([]);
	const [youtubeResults, setYoutubeResults] = useState([]);
	const [searchSubmitted, setSearchSubmitted] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [youtubeLoading, setYoutubeLoading] = useState(false);

	async function submitSearch(searchString) {
		setSearchSubmitted(true);
		setLocalLoading(true);
		setLocalResults(await ApiService.searchSongs(searchString));
		setLocalLoading(false);
		setYoutubeLoading(true);
		const tempYoutubeResults = await YTService.searchYoutube(searchString);
		setYoutubeResults(tempYoutubeResults.filter((x) => !localResults.map((lr) => lr.url).includes(x.url)));
		setYoutubeLoading(false);
	}

	async function addToQueue(filename) {
		ApiService.addPerformance(props.party.partyKey, {
			fileName: filename,
			singerId: props.user.singerId,
		});
	}

	return (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			<Menu user={props.user} leaveParty={props.leaveParty} />
			<Title party={props.party} />
			<SearchCard
				party={props.party}
				user={props.user}
				updateParty={props.updateParty}
				setUser={props.updateUser}
				submitSearch={submitSearch}
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
