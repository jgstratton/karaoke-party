const Marquee = function (options) {
	let marqueeParent;
	let marqueeTimer;

	this.Update = (settings) => {
		if (marqueeParent) {
			marqueeParent.remove();
		}
		if (marqueeTimer) {
			clearInterval(marqueeTimer);
		}
		if (!settings.marqueeEnabled) {
			return;
		}

		marqueeParent = document.createElement('div');
		marqueeParent.classList.add('marquee-parent');
		// marqueeParent.style.height = `${settings.marqueeSize}px`;

		const marqueeText = settings.marqueeText
			.replace(/%code%/gi, options.partyKey)
			.replace(/%url%/gi, window.location.host)
			.replaceAll(' ', '\u00A0');
		const marqueeHtml = `
			<div class="marquee-text" style="font-size:${parseInt(settings.marqueeSize / 1.25)}px">
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
			i = i + settings.marqueeSpeed / 100;
		}, 10);
	};
};
