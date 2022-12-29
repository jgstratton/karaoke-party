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
	const data = await response.json();
	return data.file;
}

const YTService = {
	searchYoutube,
	downloadYoutube,
};

export default YTService;
