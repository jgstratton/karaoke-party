window.convertLegacyBlobs = async function () {
    const storage = new Storage('songs');
    await storage.ready;
    const store = await storage.getStore();

    const getAllKeysRequest = store.getAllKeys();
    getAllKeysRequest.onsuccess = (event) => {
        const keys = event.target.result;
        console.log("Keys", keys);
        for (const key of keys) {
            storage.get(key).then(async (value) => {
                if (value instanceof Blob) {
                    const splitKey = key.split('---');
                    if (splitKey.length != 2) {
                        console.error("Invalid key, cannot convert:", key);
                        return;
                    }
                    const title = splitKey[0];
                    const split2 = splitKey[1].split('.');
                    if (split2.length != 2) {
                        console.error("Invalid key, cannot convert:", key);
                        return;
                    }
                    const id = split2[0];

                    const newValue = {
                        title: title,
                        id: id,
                        blob: value
                    }

                    if (keys.filter(k => k == id).length > 0) {
                        console.warn("Key already exists, cannot convert:", id);
                        return;
                    }
                    console.info("Converting new value", newValue);
                    await storage.set(id, newValue);
                } else {
                    console.warn("Value is not a blob, cannot convert:", key, value);
                }
            });
        }
    };

    getAllKeysRequest.onerror = (event) => {
        console.error("Error getting keys:", event.target.error);
    };
}

console.log("%c ~~~ To convert legacy items in indexdb, use: window.convertLegacyBlobs() ~~~", 'padding:5px; background-color:#A020F0');