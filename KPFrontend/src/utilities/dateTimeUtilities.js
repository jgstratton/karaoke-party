const secondsToHHMMSS = (secondsValue) => {
	var hours = Math.floor(secondsValue / 3600);
	var minutes = Math.floor((secondsValue - hours * 3600) / 60);
	var seconds = Math.floor(secondsValue - hours * 3600 - minutes * 60);

	let returnString = hours > 0 ? hours + ':' : '';
	returnString += (minutes < 10 ? (minutes = '0' + minutes) : minutes) + ':';
	returnString += seconds < 10 ? (seconds = '0' + seconds) : seconds;
	return returnString;
};

const DateTimeUtilities = {
	secondsToHHMMSS,
};

export default DateTimeUtilities;
