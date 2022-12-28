async function searchYoutube(search_string) {
	const response = await fetch(
		'yt-dlp/search?' +
			new URLSearchParams({
				search_string: search_string,
			})
	);
	return await response.json();
}

async function downloadYoutube(url) {
	const response = await fetch(
		'yt-dlp/download?' +
			new URLSearchParams({
				url: url,
			})
	);
	return await response.body;
}

const PartyService = {
	searchYoutube,
	downloadYoutube,
};

export default PartyService;
