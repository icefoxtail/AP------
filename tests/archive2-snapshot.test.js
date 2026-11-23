// Resolved-snapshot cache (archive2-snapshot.js): when it may be used, and that every failure falls back to the normal path.
// The decision rules are the contract here, not a time: a hit needs the same projectionVersion, the same code hash and an intact copy.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SOURCE = fs.readFileSync(path.join(__dirname, '../archive/archive2-snapshot.js'), 'utf8');
const MANIFEST_URL = 'https://archive.test/archive/data/archive2-canonical-input-manifest.json';
const SCRIPT_NAMES = ['archive2-canonical.js', 'archive2-core.js', 'meta-foundation-runtime.js', 'archive2-snapshot.js'];

// A minimal IndexedDB: one database, one store, structured clone on put/get, request callbacks asynchronous.
function fakeIndexedDb({ failOpen = false, failPut = false } = {}) {
  const data = new Map();
  const later = (fn) => setImmediate(fn);
  const store = {
    get(key) { const request = {}; later(() => { request.result = data.has(key) ? structuredClone(data.get(key)) : undefined; request.onsuccess?.(); }); return request; },
    put(value, key) { if (failPut) throw Object.assign(new Error('quota'), { name: 'QuotaExceededError' }); data.set(key, structuredClone(value)); },
    delete(key) { data.delete(key); },
  };
  return {
    data,
    open() {
      const request = {};
      later(() => {
        if (failOpen) return request.onerror?.();
        request.result = {
          createObjectStore() { return store; },
          transaction() {
            const tx = { objectStore: () => store };
            later(() => later(() => tx.oncomplete?.()));
            return tx;
          },
        };
        request.onupgradeneeded?.();
        request.onsuccess?.();
      });
      return request;
    },
  };
}

function makeEnv({ indexedDB, search = '', scripts = SCRIPT_NAMES, scriptText = (name) => `// ${name} v1` } = {}) {
  const document = { scripts: scripts.map((name) => ({ src: `https://archive.test/archive/${name}?v=1` })) };
  const fetched = [];
  const sandbox = {
    console, setTimeout, clearTimeout, setImmediate, structuredClone, TextEncoder, URL, URLSearchParams, Promise,
    crypto: crypto.webcrypto, document, indexedDB, location: { search },
    fetch: async (url, options) => {
      fetched.push({ url: String(url), cache: options && options.cache });
      const name = String(url).split('/').pop().split('?')[0];
      return { ok: true, text: async () => scriptText(name) };
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SOURCE, sandbox, { filename: 'archive2-snapshot.js' });
  return { Snapshot: sandbox.Archive2Snapshot, fetched, sandbox };
}

const KEY = 'archive2-canonical-v1:abc';
const canonical = (key = KEY) => ({
  RESOLVER_VERSION: '1.1.0',
  computeProjectionVersion: async () => key,
});
const manifestBody = (key = KEY) => JSON.stringify({ schemaVersion: 'archive2-canonical-input-manifest-v1', resolverVersion: '1.1.0', projectionVersion: key, files: [{ path: 'a', sha256: 'a'.repeat(64) }] });
function fetcherFor(body, seen = []) {
  return async (url) => { seen.push(String(url)); return { ok: true, status: 200, text: async () => body }; };
}
const parts = (n = 5) => {
  const records = Array.from({ length: n }, (_, i) => ({ questionUid: 'qid_' + i, v: i }));
  const packRecords = [{ questionUid: 'qid_0' }];
  return {
    finalCatalog: { records, exams: [{ file: 'x' }], health: { automatic: 1 } },
    runtime: { records: packRecords, counts: { records: 1 } },
    packs: [{ packId: 'P', records: packRecords }],
    labels: { problemTypes: {}, templates: {} },
    bundled: { indexVersion: 'i', identityDigest: 'd' },
  };
};
const flush = () => new Promise((resolve) => setTimeout(resolve, 20));
async function saveNow(found, value) {
  // No Archive2Boot in the sandbox: save waits SAVE_DELAY_MS then a short timer.
  return found.save(value);
}

test('first visit: no snapshot, the manifest text is handed to canonical once, then saved and used by the next visit', async () => {
  const idb = fakeIndexedDb();
  const { Snapshot } = makeEnv({ indexedDB: idb });
  const seen = [];
  const inner = fetcherFor(manifestBody(), seen);
  const found = await Snapshot.lookup({ fetcher: inner, baseUrl: 'https://archive.test/archive/', canonical: canonical() });
  assert.equal(found.key, KEY);
  assert.equal(found.payload, null);
  // canonical asks for the manifest itself: it gets the text already read, not a second request
  const wrapped = found.fetcherFor(inner);
  assert.equal(await (await wrapped(MANIFEST_URL)).text(), manifestBody());
  assert.equal(seen.filter((url) => url === MANIFEST_URL).length, 1, 'the manifest is requested once');
  await wrapped('https://archive.test/archive/data/other.json');
  assert.ok(seen.includes('https://archive.test/archive/data/other.json'), 'everything else still goes to the real fetcher');
  assert.equal(await saveNow(found, parts()), true);
  assert.ok(idb.data.has('meta-foundation:head') && idb.data.has('meta-foundation:payload'));

  const second = await Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() });
  assert.ok(second.payload, 'same manifest + same code + intact copy -> hit');
  assert.deepEqual(second.payload.finalCatalog.records.map((r) => r.questionUid), parts().finalCatalog.records.map((r) => r.questionUid));
  assert.equal(second.payload.runtime.records.length, 1);
});

test('a different projectionVersion, different code or a damaged copy is never used', async () => {
  const idb = fakeIndexedDb();
  const a = makeEnv({ indexedDB: idb });
  const found = await a.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() });
  await saveNow(found, parts());

  // other inputs
  const otherKey = 'archive2-canonical-v1:def';
  let r = await a.Snapshot.lookup({ fetcher: fetcherFor(manifestBody(otherKey)), baseUrl: 'https://archive.test/archive/', canonical: canonical(otherKey) });
  assert.equal(r.payload, null, 'different projectionVersion');
  assert.equal(r.key, otherKey);

  // other code (one of the scripts changed)
  const b = makeEnv({ indexedDB: idb, scriptText: (name) => `// ${name} ${name === 'archive2-core.js' ? 'v2' : 'v1'}` });
  r = await b.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() });
  assert.equal(r.payload, null, 'different code hash');

  // a record dropped from the stored copy (counts no longer match) is rejected and forgotten
  const stored = idb.data.get('meta-foundation:payload');
  stored.finalCatalog.records.pop();
  r = await a.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() });
  assert.equal(r.payload, null, 'damaged copy (count)');
  assert.equal(idb.data.has('meta-foundation:payload'), false, 'a damaged copy is deleted');

  // same count, one UID changed
  await saveNow(await a.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() }), parts());
  idb.data.get('meta-foundation:payload').finalCatalog.records[2].questionUid = 'tampered';
  r = await a.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() });
  assert.equal(r.payload, null, 'damaged copy (uid digest)');
});

test('scripts are hashed from what is already loaded (force-cache) and a missing script disables snapshots', async () => {
  const idb = fakeIndexedDb();
  const env = makeEnv({ indexedDB: idb });
  await env.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() });
  assert.equal(env.fetched.length, SCRIPT_NAMES.length);
  assert.ok(env.fetched.every((row) => row.cache === 'force-cache'));
  const missing = makeEnv({ indexedDB: idb, scripts: SCRIPT_NAMES.slice(0, 2) });
  const r = await missing.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() });
  assert.equal(r.key, null, 'no code identity -> no snapshot at all');
  assert.equal(r.payload, null);
  assert.equal(await r.save(parts()), false);
});

test('a manifest whose digest does not match its own file list is never a snapshot key', async () => {
  const { Snapshot } = makeEnv({ indexedDB: fakeIndexedDb() });
  const r = await Snapshot.lookup({ fetcher: fetcherFor(manifestBody('archive2-canonical-v1:claimed')), baseUrl: 'https://archive.test/archive/', canonical: canonical('archive2-canonical-v1:computed') });
  assert.equal(r.key, null);
  assert.equal(r.payload, null);
});

test('no IndexedDB, a failing open, a failing write and ?snapshot=off all fall back without throwing', async () => {
  for (const env of [
    makeEnv({ indexedDB: undefined }),
    makeEnv({ indexedDB: fakeIndexedDb({ failOpen: true }) }),
  ]) {
    const r = await env.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() });
    assert.equal(r.payload, null);
    assert.equal(await r.save(parts()), false);
  }
  const full = makeEnv({ indexedDB: fakeIndexedDb({ failPut: true }) });
  const r = await full.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() });
  assert.equal(await saveNow(r, parts()), false, 'quota exceeded is reported as not saved, not thrown');
  const idb = fakeIndexedDb();
  await saveNow(await makeEnv({ indexedDB: idb }).Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() }), parts());
  const off = makeEnv({ indexedDB: idb, search: '?view=compose&snapshot=off' });
  assert.equal(await off.Snapshot.lookup({ fetcher: fetcherFor(manifestBody()), baseUrl: 'https://archive.test/archive/', canonical: canonical() }), null, 'off means untouched');
  await flush();
});

test('the bridge uses the snapshot only through lookup/save and keeps the verification path of canonical', () => {
  const bridge = fs.readFileSync(path.join(__dirname, '../archive/meta-foundation-runtime.js'), 'utf8');
  assert.match(bridge, /Snapshot\.lookup\(/);
  assert.match(bridge, /found\.fetcherFor\(fetcher\)/);
  assert.match(bridge, /Archive2Canonical\.loadInputBundle\(/, 'a miss still loads and verifies through canonical');
  const snapshot = SOURCE;
  // this file stores results; it never reads a verdict about input bytes
  assert.doesNotMatch(snapshot, /canonical\.(loadInputBundle|resolveCatalog)/);
  for (const page of ['workspace.html', 'unit-past-exams.html', 'assessment/diagnostic-report.html']) {
    const html = fs.readFileSync(path.join(__dirname, '../archive', page), 'utf8');
    assert.ok(html.indexOf('archive2-snapshot.js') > 0 && html.indexOf('archive2-snapshot.js') < html.indexOf('meta-foundation-runtime.js'), page + ': the snapshot script loads before the bridge');
  }
  const release = JSON.parse(fs.readFileSync(path.join(__dirname, '../tools/archive-pages-release-manifest.json'), 'utf8'));
  assert.ok(release.archiveRootFiles.includes('archive2-snapshot.js'), 'shipped with the Pages package');
});
