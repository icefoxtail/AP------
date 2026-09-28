/* Persist complete MathJax-ready solution batches so Clinic can resume a retry. */
(function (root) {
    'use strict';

    const DATABASE = 'ap-clinic-solution-checkpoints';
    const STORE = 'batches';
    // Bump this when solution box markup, fonts, or page layout rules change.
    const FORMAT = 'clinic-sol-v1-20260928';
    const MAX_RECORDS = 192; // Up to 4,608 checkpointed questions across interrupted packets.
    const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
    const memory = new Map();
    let databasePromise = null;

    function openDatabase() {
        if (!root.indexedDB) return Promise.reject(new Error('INDEXED_DB_UNAVAILABLE'));
        if (!databasePromise) {
            databasePromise = new Promise((resolve, reject) => {
                const request = root.indexedDB.open(DATABASE, 1);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(STORE)) {
                        const store = db.createObjectStore(STORE, { keyPath: 'id' });
                        store.createIndex('checkpointKey', 'checkpointKey', { unique: false });
                        store.createIndex('savedAt', 'savedAt', { unique: false });
                    }
                };
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error || new Error('INDEXED_DB_OPEN_FAILED'));
                request.onblocked = () => reject(new Error('INDEXED_DB_BLOCKED'));
            }).catch(error => {
                databasePromise = null;
                throw error;
            });
        }
        return databasePromise;
    }

    function recordId(checkpointKey, startIndex) {
        return `${FORMAT}:${checkpointKey}:${startIndex}`;
    }

    async function createKey(boxes) {
        if (!root.crypto?.subtle || !Array.isArray(boxes)) return '';
        const material = JSON.stringify({
            format: FORMAT,
            mathVersion: String(root.MathJax?.version || 'unavailable'),
            executor: root.document.querySelector('script[src*="solution-render-executor.js"]')?.src || '',
            boxes: boxes.map(box => [box.dataset.sourceRef || '', box.dataset.solutionHtml || '', box.innerHTML])
        });
        try {
            const digest = new Uint8Array(await root.crypto.subtle.digest('SHA-256', new TextEncoder().encode(material)));
            return Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            return '';
        }
    }

    function isFresh(record, checkpointKey) {
        return record?.format === FORMAT && record.checkpointKey === checkpointKey &&
            Date.now() - Number(record.savedAt || 0) <= MAX_AGE_MS && Array.isArray(record.boxHtml);
    }

    async function load(checkpointKey, startIndex, count) {
        if (!checkpointKey) return null;
        const id = recordId(checkpointKey, startIndex);
        const remembered = memory.get(id);
        if (isFresh(remembered, checkpointKey) && remembered.boxHtml.length === count) return remembered.boxHtml;
        try {
            const db = await openDatabase();
            const record = await new Promise((resolve, reject) => {
                const tx = db.transaction(STORE, 'readonly');
                const request = tx.objectStore(STORE).get(id);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error || new Error('INDEXED_DB_READ_FAILED'));
                tx.onabort = () => reject(tx.error || new Error('INDEXED_DB_READ_ABORTED'));
            });
            if (!isFresh(record, checkpointKey) || record.boxHtml.length !== count) return null;
            memory.set(id, record);
            return record.boxHtml;
        } catch (error) {
            return null;
        }
    }

    async function save(checkpointKey, startIndex, boxHtml) {
        if (!checkpointKey || !Array.isArray(boxHtml) || !boxHtml.length) return false;
        const record = { id: recordId(checkpointKey, startIndex), checkpointKey, startIndex, boxHtml, savedAt: Date.now(), format: FORMAT };
        memory.set(record.id, record);
        while (memory.size > MAX_RECORDS) memory.delete(memory.keys().next().value);
        try {
            const db = await openDatabase();
            await new Promise((resolve, reject) => {
                const tx = db.transaction(STORE, 'readwrite');
                const store = tx.objectStore(STORE);
                store.put(record);
                const count = store.count();
                count.onsuccess = () => {
                    const excess = Math.max(0, count.result - MAX_RECORDS);
                    const cursorRequest = store.index('savedAt').openCursor();
                    let visited = 0;
                    cursorRequest.onsuccess = () => {
                        const cursor = cursorRequest.result;
                        if (!cursor) return;
                        const expired = Date.now() - Number(cursor.value.savedAt || 0) > MAX_AGE_MS;
                        if (expired || visited < excess) cursor.delete();
                        visited += 1;
                        cursor.continue();
                    };
                    cursorRequest.onerror = () => reject(cursorRequest.error || new Error('INDEXED_DB_PRUNE_FAILED'));
                };
                count.onerror = () => reject(count.error || new Error('INDEXED_DB_COUNT_FAILED'));
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error || new Error('INDEXED_DB_WRITE_FAILED'));
                tx.onabort = () => reject(tx.error || new Error('INDEXED_DB_WRITE_ABORTED'));
            });
            return true;
        } catch (error) {
            // Checkpoint storage is best-effort; normal rendering still completes.
            return false;
        }
    }

    async function clear(checkpointKey) {
        if (!checkpointKey) return;
        const prefix = `${FORMAT}:${checkpointKey}:`;
        for (const key of memory.keys()) if (key.startsWith(prefix)) memory.delete(key);
        try {
            const db = await openDatabase();
            await new Promise((resolve, reject) => {
                const tx = db.transaction(STORE, 'readwrite');
                const index = tx.objectStore(STORE).index('checkpointKey');
                const request = index.openCursor(root.IDBKeyRange.only(checkpointKey));
                request.onsuccess = () => {
                    const cursor = request.result;
                    if (cursor) { cursor.delete(); cursor.continue(); }
                };
                request.onerror = () => reject(request.error || new Error('INDEXED_DB_CLEAR_FAILED'));
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error || new Error('INDEXED_DB_CLEAR_FAILED'));
                tx.onabort = () => reject(tx.error || new Error('INDEXED_DB_CLEAR_ABORTED'));
            });
        } catch (error) {
            // Expiring or retained records are safe; exact input hashes gate every read.
        }
    }

    root.APClinicSolutionCheckpoint = Object.freeze({ createKey, load, save, clear });
})(window);
