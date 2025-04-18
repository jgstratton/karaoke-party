const Storage = function (name) {
	this.ready = new Promise((resolve, reject) => {
		var request = window.indexedDB.open(location.origin);

		request.onupgradeneeded = (e) => {
			this.db = e.target.result;
			this.db.createObjectStore(name);
		};

		request.onsuccess = (e) => {
			this.db = e.target.result;
			resolve();
		};

		request.onerror = (e) => {
			this.db = e.target.result;
			reject(e);
		};
	});

	this.get = function (key) {
		return this.ready.then(() => {
			return new Promise((resolve, reject) => {
				var request = this.getStore().get(key);
				request.onsuccess = (e) => resolve(e.target.result);
				request.onerror = reject;
			});
		});
	};

	this.set = function (key, value) {
		return this.ready.then(() => {
			return new Promise((resolve, reject) => {
				var request = this.getStore().put(value, key);
				request.onsuccess = resolve;
				request.onerror = reject;
			});
		});
	};

	this.getStore = function () {
		return this.db.transaction([name], 'readwrite').objectStore(name);
	};

	this.delete = function (key, value) {
		window.indexedDB.deleteDatabase(location.origin);
	};
};

export default Storage;