const SplashScreen = function (options) {
	let splashScreen;
	let showStart;
	this.Show = (dto) => {
		// if there's already a splash screen created, get rid of it
		this.Hide();
		showStart = new Date();
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
				<div class="progress">
					<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0"></div>
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

	this.SetProgressBar = (percentComplete) => {
		if (this.IsVisible()) {
			document.querySelector('.progress-bar').style.width = percentComplete + '%';
		}
	};

	this.GetSecondsVisible = () => (this.IsVisible() ? (new Date() - showStart) / 1000 : 0);
};
