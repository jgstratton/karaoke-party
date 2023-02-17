const map = {};
const KeyPressChecker = (keyCodes, callback) => {
	document.addEventListener('keydown', function (e) {
		map[e.key] = true;
		for (let i = 0; i < keyCodes.length; i++) {
			if (!map[keyCodes[i]]) {
				return;
			}
		}
		callback();
	});

	document.addEventListener('keyup', function (e) {
		map[e.key] = false;
	});
};

export default KeyPressChecker;
