(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Snapshot = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";
  // Resolved-snapshot cache (2026-11-23): keep the RESULT of "download -> SHA-256 check -> parse -> resolveCatalog" in
  // IndexedDB so the next visit with the same inputs skips all of it.
  //
  // Why this does not weaken verification: every input byte is still checked against the manifest the first time it is
  // downloaded (the canonical loader, unchanged). The manifest lists the SHA-256 of every input, and its own digest
  // (projectionVersion) is recomputed from that list on every visit, so "same projectionVersion" means "the same input
  // bytes". The snapshot is reused only when (1) projectionVersion is the one it was built from, (2) the code that
  // produced it (canonical, core, runtime bridge, this file) has the same SHA-256, and (3) the stored copy still matches
  // the counts and UID digest written with it. Anything else (a different key, a missing or damaged copy, no IndexedDB,
  // a full disk, private mode) silently falls back to the normal download-and-verify path.
  //
  // This file only stores and finds snapshots. It never decides what is valid input: that stays in archive2-canonical.js.
  const SCHEMA = "archive2-resolved-snapshot-v1";
  const DB_NAME = "archive2-resolved-snapshot";
  const STORE = "snapshots";
  const HEAD_KEY = "meta-foundation:head";
  const PAYLOAD_KEY = "meta-foundation:payload";
  const MANIFEST_PATH = "data/archive2-canonical-input-manifest.json";
  const CODE_FILES = ["archive2-canonical.js", "archive2-core.js", "meta-foundation-runtime.js", "archive2-snapshot.js"];
  const SAVE_DELAY_MS = 1500;

  const hex = (buffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
  async function sha256(value) {
    const subtle = root.crypto && root.crypto.subtle;
    if (!subtle || typeof TextEncoder !== "function") throw new Error("Web Crypto unavailable");
    return hex(await subtle.digest("SHA-256", new TextEncoder().encode(String(value))));
  }

  function disabled() {
    try { return new URLSearchParams(root.location && root.location.search).get("snapshot") === "off"; } catch { return false; }
  }

  // ---- IndexedDB (every failure becomes "no snapshot") -------------------------------------------------------------
  function openDb() {
    return new Promise((resolve) => {
      try {
        const factory = root.indexedDB;
        if (!factory) return resolve(null);
        const request = factory.open(DB_NAME, 1);
        request.onupgradeneeded = () => { try { request.result.createObjectStore(STORE); } catch { /* reported by onerror */ } };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
        request.onblocked = () => resolve(null);
      } catch { resolve(null); }
    });
  }
  function read(db, key) {
    return new Promise((resolve) => {
      try {
        const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
        request.onsuccess = () => resolve(request.result === undefined ? null : request.result);
        request.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
  }
  function write(db, entries) {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);
        for (const [key, value] of entries) store.put(value, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
        tx.onabort = () => resolve(false);
      } catch { resolve(false); }
    });
  }
  function drop(db) {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(HEAD_KEY);
        tx.objectStore(STORE).delete(PAYLOAD_KEY);
        tx.oncomplete = tx.onerror = tx.onabort = () => resolve();
      } catch { resolve(); }
    });
  }

  // ---- what produced the snapshot -----------------------------------------------------------------------------------
  // The SHA-256 of the scripts that compute it. They were just loaded, so force-cache returns the very bytes that run.
  async function codeHash() {
    const doc = root.document;
    if (!doc || !doc.scripts || typeof root.fetch !== "function") return null;
    const parts = [];
    for (const name of CODE_FILES) {
      const script = Array.from(doc.scripts).find((node) => {
        try { return node.src && new URL(node.src).pathname.endsWith("/" + name); } catch { return false; }
      });
      if (!script) return null;
      const response = await root.fetch(script.src, { cache: "force-cache" });
      if (!response || !response.ok) return null;
      parts.push(name + "\u0000" + await response.text());
    }
    return sha256(parts.join("\u0001"));
  }

  const uidDigestOf = (records) => sha256(records.map((row) => (row && row.questionUid) || "").join("\n"));
  const countsOf = (parts) => ({
    records: parts.finalCatalog.records.length,
    exams: Array.isArray(parts.finalCatalog.exams) ? parts.finalCatalog.exams.length : 0,
    runtimeRecords: parts.runtime.records.length,
    packs: parts.packs.length,
  });
  const sameCounts = (a, b) => ["records", "exams", "runtimeRecords", "packs"].every((key) => a && b && a[key] === b[key]);
  // The parts the bridge needs, in the shape it sets them: one structured-clone value, so the references between the
  // runtime records and the packs survive exactly as they were.
  function wellFormed(parts) {
    return Boolean(parts && parts.finalCatalog && Array.isArray(parts.finalCatalog.records) && Array.isArray(parts.packs) &&
      parts.runtime && Array.isArray(parts.runtime.records) && parts.labels && typeof parts.labels === "object" &&
      parts.bundled && typeof parts.bundled === "object");
  }

  // lookup: reads the manifest (once; a miss hands the same text back to canonical), recomputes projectionVersion and looks
  // for a stored snapshot. Resolves to null when snapshots are off or unusable, otherwise
  // { key, payload (or null), fetcherFor(fetcher), save(parts) }.
  async function lookup({ fetcher, baseUrl, canonical }) {
    if (disabled() || typeof fetcher !== "function" || !canonical || typeof canonical.computeProjectionVersion !== "function") return null;
    let manifestUrl;
    try { manifestUrl = new URL(MANIFEST_PATH, String(baseUrl)).toString(); } catch { return null; }
    const [manifestInfo, code, db] = await Promise.all([
      (async () => {
        const response = await fetcher(manifestUrl);
        if (!response || !response.ok) return null;
        const body = await response.text();
        const manifest = JSON.parse(body);
        if (manifest && manifest.schemaVersion === "archive2-canonical-input-manifest-v1" && manifest.resolverVersion === canonical.RESOLVER_VERSION &&
            Array.isArray(manifest.files) && await canonical.computeProjectionVersion(manifest.files) === manifest.projectionVersion)
          return { body, key: manifest.projectionVersion };
        return { body, key: null };
      })().catch(() => null),
      codeHash().catch(() => null),
      openDb(),
    ]);
    if (!manifestInfo) return null;
    // The manifest text is already here: canonical must not ask for it again (a second request, and a second reading).
    let served = false;
    const fetcherFor = (inner) => (url) => {
      if (!served && String(url) === manifestUrl) {
        served = true;
        return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(manifestInfo.body) });
      }
      return inner(url);
    };
    const result = { key: null, payload: null, fetcherFor, save: async () => false };
    if (!manifestInfo.key || !code || !db) return result;
    result.key = manifestInfo.key;

    const head = await read(db, HEAD_KEY);
    if (head && head.schema === SCHEMA && head.key === manifestInfo.key && head.codeHash === code) {
      const stored = await read(db, PAYLOAD_KEY);
      let usable = false;
      try {
        usable = wellFormed(stored) && sameCounts(head.counts, countsOf(stored)) && head.uidDigest === await uidDigestOf(stored.finalCatalog.records);
      } catch { usable = false; }
      if (usable) result.payload = stored;
      else await drop(db); // damaged or half-written: forget it, the normal path rebuilds it
    }

    result.save = (parts) => {
      if (!wellFormed(parts) || result.payload) return Promise.resolve(false);
      return new Promise((resolve) => {
        const Boot = root.Archive2Boot;
        const run = async () => {
          try {
            const entryHead = { schema: SCHEMA, key: manifestInfo.key, codeHash: code, savedAt: Date.now(), counts: countsOf(parts), uidDigest: await uidDigestOf(parts.finalCatalog.records) };
            // One put clones the whole value (about 0.3 s of main thread for the real catalog), so it waits for the page to be ready.
            resolve(await write(db, [[PAYLOAD_KEY, parts], [HEAD_KEY, entryHead]]));
          } catch { resolve(false); }
        };
        const later = () => {
          const idle = Boot && typeof Boot.idle === "function" ? Boot.idle : (fn) => setTimeout(fn, 200);
          idle(run, 20000);
        };
        if (Boot && typeof Boot.onProgress === "function") {
          let armed = false;
          Boot.onProgress((progress) => {
            if (armed || !progress.finished) return;
            armed = true;
            if (progress.failed) return resolve(false);
            setTimeout(later, SAVE_DELAY_MS);
          });
        } else setTimeout(later, SAVE_DELAY_MS);
      });
    };
    return result;
  }

  return Object.freeze({ SCHEMA, lookup, _internal: Object.freeze({ codeHash, uidDigestOf, MANIFEST_PATH }) });
});
