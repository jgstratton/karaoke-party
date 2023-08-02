const Marquee = function (options) {
	let marqueeParent;
	let marqueeTimer;

	this.Update = (playerSettings) => {
		if (marqueeParent) {
			marqueeParent.remove();
		}
		if (marqueeTimer) {
			clearInterval(marqueeTimer);
		}
		if (!playerSettings.marqueeEnabled) {
			return;
		}

		marqueeParent = document.createElement('div');
		marqueeParent.classList.add('marquee-parent');
		// marqueeParent.style.height = `${playerSettings.marqueeSize}px`;

		const marqueeText = playerSettings.marqueeText
			.replace(/%code%/gi, options.partyKey)
			.replace(/%url%/gi, window.location.host)
			.replaceAll(' ', '\u00A0');
		const marqueeHtml = `
			<div class="marquee-text" style="font-size:${parseInt(playerSettings.marqueeSize / 1.25)}px">
				${marqueeText}
			</div>`;
		marqueeParent.innerHTML = marqueeHtml + marqueeHtml + marqueeHtml;

		document.body.appendChild(marqueeParent);
		const firstElement = marqueeParent.children[0];
		let i = 0;
		marqueeTimer = setInterval(function () {
			firstElement.style.marginLeft = `-${i}px`;
			if (i > firstElement.clientWidth) {
				i = 0;
			}
			i = i + playerSettings.marqueeSpeed / 100;
		}, 10);
	};
};
