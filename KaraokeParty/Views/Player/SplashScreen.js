const SplashScreen = function (options) {
	let splashScreen;
	this.Show = (dto) => {
		splashScreen = document.createElement('div');
		splashScreen.innerHTML = `
			<div class="text-center splash-screen">
				<div class="large-glow">
					NOW PERFORMING
				</div>
				<div class="singer-cricle-wrap">
					<div class="singer-bar">
						<span class="singer-text">${dto.singerName}</span>
						<br/>
						<span class="song-text">${dto.songTitle}</span>
					</div>
				</div>
			</div>
		`;
		document.body.appendChild(splashScreen);
	};

	this.Hide = () => {
		if (splashScreen) {
			splashScreen.remove();
		}
	};

	this.IsVisible = () => {
		return !!splashScreen;
	};
};
