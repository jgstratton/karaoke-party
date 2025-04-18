const InteractionOverlay = function (options) {
	const wrap = document.createElement('div');
	wrap.innerHTML = `
		<div class="text-center" style="height: calc(100vh); line-height: calc(100vh); position: fixed; z-index: 100; top: 0px; left: 0px; width: 100%;">
			<div style="position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; background: rgba(0, 0, 0, 0.9); z-index: 9999; line-height: 100%;">
				<div class="text-center" style="position: relative; top: 40%; right: auto;">
					<div class="text-left" style="display: inline-block;">
						<div class="text-center">
							<p class="mb-3" style="line-height: 30px; color:white">
								Some browsers don't like it when websites start jamming their music right away.<br>Let your browser know you're in the mood for some 🎶🎶 karaoke 🎶🎶!
							</p>
							<button id="userInteractionButton" class="btn btn-primary">Launch Karaoke Player</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
	document.body.appendChild(wrap);
	document.getElementById('userInteractionButton').addEventListener('click', () => {
		options.OnInteraction();
		wrap.remove();
	});
};

export default InteractionOverlay;