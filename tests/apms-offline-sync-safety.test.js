const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const core = read('apmath/js/core.js');

function functionSource(name) {
  const marker = `function ${name}(`;
  const markerStart = core.indexOf(marker);
  assert.notEqual(markerStart, -1, `${name} exists`);
  const start = core.slice(Math.max(0, markerStart - 6), markerStart).endsWith('async ')
    ? markerStart - 6 : markerStart;
  let depth = 0;
  let opened = false;
  for (let i = core.indexOf('{', start); i < core.length; i += 1) {
    if (core[i] === '{') { depth += 1; opened = true; }
    if (core[i] === '}') {
      depth -= 1;
      if (opened && depth === 0) return core.slice(start, i + 1);
    }
  }
  throw new Error(`Unclosed ${name}`);
}

function makeQueueHarness({ session = { id: 'teacher-a' }, fetchImpl = async () => new Response('{"success":true}', { status: 200 }), queue = [] } = {}) {
  const writes = [];
  const store = { AP_SYNC_QUEUE: JSON.stringify(queue), APMATH_SESSION: JSON.stringify(session) };
  const context = {
    CONFIG: { API_BASE: 'https://fixture.invalid/api' },
    AUTH_KEY: 'APMATH_SESSION',
    syncQueue: queue,
    syncQueueInFlight: false,
    localStorage: { getItem: key => store[key] || null, setItem: (key, value) => { store[key] = value; } },
    getSession: () => session,
    getAuthHeader: () => ({ Authorization: `Bearer ${session?.id || ''}` }),
    toast() {}, loadData: async () => { writes.push(['reload']); },
    console: { warn() {}, error() {} }, Date, Math, JSON, Response,
    fetch: async (...args) => { writes.push(args); return fetchImpl(...args); }
  };
  vm.createContext(context);
  vm.runInContext([
    functionSource('currentQueueAccountId'),
    functionSource('persistSyncQueue'),
    functionSource('removeSyncQueueTask'),
    functionSource('addToSyncQueue'),
    functionSource('processSyncQueue')
  ].join('\n'), context);
  return { context, writes, store };
}

test('navigator.onLine is never used as a write or queue-sync gate', () => {
  assert.doesNotMatch(core.slice(core.indexOf('async patch(res, d)'), core.indexOf('getPlannerOverview')), /navigator\.onLine/);
  assert.doesNotMatch(functionSource('processSyncQueue'), /navigator\.onLine/);
  assert.match(read('apmath/app.js'), /await processSyncQueue\(\)/);
});

test('navigator.onLine=false still attempts an API write; a real failure queues only idempotent POSTs', async () => {
  const calls = [];
  const context = {
    CONFIG: { API_BASE: 'https://fixture.invalid/api' },
    getAuthHeader: () => ({}),
    parseApiResponse: async response => response.json(),
    addToSyncQueue: (...args) => { calls.push(['queue', ...args]); return { success: false, offline: true, queued: true }; },
    notifyApiFailure() {}, navigator: { onLine: false },
    fetch: async (...args) => { calls.push(['fetch', ...args]); return new Response('{"success":true}', { status: 200 }); }
  };
  vm.createContext(context);
  vm.runInContext(functionSource('requestWrite'), context);
  const saved = await context.requestWrite('POST', 'consultations', { clientRequestId: 'rid-1' });
  assert.equal(saved.success, true);
  assert.equal(calls[0][0], 'fetch');
  context.fetch = async () => { throw new TypeError('network down'); };
  const queued = await context.requestWrite('POST', 'consultations', { clientRequestId: 'rid-2' });
  assert.equal(queued.queued, true);
  assert.equal(calls.at(-1)[0], 'queue');
  const before = calls.length;
  await assert.rejects(context.requestWrite('POST', 'non-idempotent-operation', { content: 'draft' }), /network down/);
  assert.equal(calls.length, before, 'a POST without an idempotency key is never auto-retried');
});

test('queue sync deduplicates in-flight runs, preserves legacy and foreign-account rows, and removes only successful rows', async () => {
  let resolveRequest;
  const queue = [
    { id: 'legacy', method: 'POST', resource: 'consultations', data: { clientRequestId: 'legacy-id' } },
    { id: 'foreign', accountId: 'teacher-b', method: 'POST', resource: 'consultations', data: { clientRequestId: 'foreign-id' } },
    { id: 'ok', accountId: 'teacher-a', method: 'POST', resource: 'consultations', data: { clientRequestId: 'ok-id' } },
    { id: 'bad', accountId: 'teacher-a', method: 'POST', resource: 'consultations', data: { clientRequestId: 'bad-id' } }
  ];
  let calls = 0;
  const harness = makeQueueHarness({ queue, fetchImpl: async (_url, options) => {
    calls += 1;
    if (calls === 1) await new Promise(resolve => { resolveRequest = resolve; });
    return options.body.includes('bad-id')
      ? new Response('{"success":false,"error":"invalid"}', { status: 422 })
      : new Response('{"success":true}', { status: 200 });
  } });
  const first = harness.context.processSyncQueue();
  await new Promise(resolve => setImmediate(resolve));
  const second = await harness.context.processSyncQueue();
  assert.equal(second.skipped, true, 'concurrent sync does not send rows twice');
  resolveRequest();
  const result = await first;
  assert.equal(result.synced, 1);
  assert.equal(result.failed, 1);
  assert.deepEqual(JSON.parse(harness.store.AP_SYNC_QUEUE).map(row => row.id), ['legacy', 'foreign', 'bad']);
  assert.equal(calls, 2, 'legacy and foreign account rows are held without transmission');
});

test('offline consultation enqueue is account-scoped and idempotent, and preserves same clientRequestId', () => {
  const harness = makeQueueHarness();
  const payload = { studentId: 's1', content: 'saved locally', clientRequestId: 'stable-id' };
  const first = harness.context.addToSyncQueue('POST', 'consultations', payload);
  const duplicate = harness.context.addToSyncQueue('POST', 'consultations', payload);
  assert.equal(first.success, false);
  assert.equal(first.queued, true);
  assert.equal(duplicate.queueId, first.queueId);
  assert.equal(JSON.parse(harness.store.AP_SYNC_QUEUE).length, 1);
  assert.equal(JSON.parse(harness.store.AP_SYNC_QUEUE)[0].data.clientRequestId, 'stable-id');
});

test('401 and 403 responses retain queued source for the signed-in account', async () => {
  for (const status of [401, 403]) {
    const row = { id: `auth-${status}`, accountId: 'teacher-a', method: 'POST', resource: 'consultations', data: { clientRequestId: `rid-${status}` } };
    const harness = makeQueueHarness({ queue: [row], fetchImpl: async () => new Response('{"success":false}', { status }) });
    const result = await harness.context.processSyncQueue();
    assert.equal(result.authFailure, true);
    assert.deepEqual(JSON.parse(harness.store.AP_SYNC_QUEUE), [row]);
  }
});

test('consultation UI distinguishes pending storage from server success and reuses request ID on retry', () => {
  const student = read('apmath/js/student.js');
  const save = student.slice(student.indexOf('async function handleSaveConsultation(sid)'), student.indexOf('async function generateConsultationAiSummary('));
  assert.match(save, /requestIdField\.dataset\.clientRequestId/);
  assert.match(save, /if \(r\?\.offline && r\?\.queued\)[\s\S]*서버 저장 대기 중/);
  assert.match(save, /if \(r\?\.success\)[\s\S]*상담 기록이 저장되었습니다/);
});

test('manual sync status checks the API and reports result instead of closing blindly', () => {
  const dashboard = read('apmath/js/dashboard.js');
  assert.match(dashboard, /async function refreshOperationConnectionStatus\(\)[\s\S]*api\.checkConnectivity\(\)/);
  assert.match(dashboard, /async function syncQueueFromStatus\(\)[\s\S]*await processSyncQueue\(\)/);
  assert.doesNotMatch(dashboard, /onclick="if\(typeof processSyncQueue==='function'\) processSyncQueue\(\); closeModal\(\);"/);
});
