import React from 'react';
import { useState } from 'react';
import Menu from './common/Menu';
import Title from './common/Title';
import LocalResults from './search/LocalResults';
import YoutubeResults from './search/YoutubeResults';
import SearchCard from './search/SearchCard';
import SearchService from '../services/YouTubeService';

const Search = (props) => {
	const [localResults, setLocalResults] = useState([]);
	const [youtubeResults, setYoutubeResults] = useState([]);
	const [searchSubmitted, setSearchSubmitted] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [youtubeLoading, setYoutubeLoading] = useState(false);

	async function submitSearch(searchString) {
		setSearchSubmitted(true);
		setLocalLoading(true);
		setLocalResults(['File 1', 'File 2']);
		setLocalLoading(false);
		setYoutubeLoading(true);
		setYoutubeResults(await SearchService.searchYoutube(searchString));
		setYoutubeLoading(false);
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
				<div>
					<LocalResults results={localResults} loading={localLoading} />
					<YoutubeResults results={youtubeResults} loading={youtubeLoading} />
				</div>
			)}

			<div>
				<hr />

				<div class="field is-hidden" id="container_search_form">
					<form action="/search" method="get">
						<input id="search_string" type="text" name="search_string" />
						<input type="text" id="non_karaoke" name="non_karaoke" />
					</form>
				</div>

				<div id="searching_loader" class="control is-loading is-hidden">
					Searching YouTube for{' '}
					<small>
						<i>
							'<span id="search_term"></span>'
						</i>
					</small>
				</div>

				<div class="field" id="container_search_result">
					<form action="/download" method="post">
						<label class="label">
							Search results for{' '}
							<small>
								<i>'smith'</i>
							</small>
						</label>
						<div class="field select">
							<select id="search_result_selector" name="song-url">
								&gt;
								<option data-ytid="Uq9gPaIzbe8" value="https://www.youtube.com/watch?v=Uq9gPaIzbe8">
									Sam Smith, Kim Petras - Unholy (Official Music Video)
								</option>
							</select>
						</div>
						<input class="song-added-by" type="hidden" name="song-added-by" value="Jesse" />
						<p class="help">Click dropdown to show more results</p>
						<p>
							Link:{' '}
							<a
								// target="_blank"
								id="youtube-link"
								href="https://www.youtube.com/watch?v=5_P2CW9mlYo"
							>
								https://www.youtube.com/watch?v=5_P2CW9mlYo
							</a>
						</p>
						<p class="has-text-centered-mobile">
							{' '}
							<img
								id="youtube-thumb"
								src="https://img.youtube.com/vi/5_P2CW9mlYo/mqdefault.jpg"
								alt="thumbnail"
							/>{' '}
						</p>
						<div class="field">
							<label class="checkbox">
								<input type="checkbox" checked="" name="queue" />
								Add to queue once downloaded
							</label>
						</div>
						<div class="field">
							<button class="button is-success is-rounded" id="download-button" type="submit">
								Download
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
export default Search;
