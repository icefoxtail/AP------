import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PUBLIC_BASE, RECEIPT_URL, PUBLIC_ASSETS, requireReceipt, requireIdentity,
  resolvePublishedRelease, verifyPublicAssets, assertPublicationStable, finishPublicReceipt } from '../tools/ci/student-portal-public-release.mjs';

const published = '1'.repeat(40), main = '2'.repeat(40);
const receipt = () => ({
  schemaVersion: 'ARCHIVE_PAGES_RELEASE_V1', registeredMainSHA: published,
  packageDigest: 'a'.repeat(64), externalDependencyDigest: 'b'.repeat(64),
  validatorDigest: 'c'.repeat(64), archiveValidationDigest: 'd'.repeat(64),
  fileCount: 100, totalBytes: 10000, releaseGate: 'RELEASE_GATE_PASS'
});
function fixture() {
  const sources = new Map(PUBLIC_ASSETS.map(item => [item.sourcePath, Buffer.from('synthetic source ' + item.sourcePath)]));
  sources.set('apmath/student/student-version.json', Buffer.from('{"version":"2026.11.11.3"}'));
  sources.set('apmath/student/manifest.json', Buffer.from('{"version":"2026.11.11.3"}'));
  sources.set('apmath/student/index.html', Buffer.from("const STUDENT_APP_VERSION = '2026.11.11.3';"));
  sources.set('apmath/student/sw.js', Buffer.from("const STUDENT_SW_VERSION = '2026.11.11.3';"));
  const state = { sources, receipt: receipt(), relation: 'ahead', mutate: '', requests: [], receiptReads: 0 };
  state.fetch = async (url, options) => {
    state.requests.push({ url, options });
    assert.equal(options.method, 'GET', 'the public verifier must never write');
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    if (url === RECEIPT_URL) {
      state.receiptReads++;
      assert.equal(options.headers.Authorization, undefined, 'no GitHub credential may reach Pages');
      return new Response(JSON.stringify(state.receipt));
    }
    if (url.endsWith('/git/ref/heads/main')) return new Response(JSON.stringify({ ref: 'refs/heads/main', object: { type: 'commit', sha: main } }));
    if (url.includes('/compare/')) return new Response(JSON.stringify({ status: state.relation,
      base_commit: { sha: published }, merge_base_commit: { sha: published } }));
    assert.ok(url.startsWith(PUBLIC_BASE + '/'));
    assert.equal(options.headers.Authorization, undefined, 'no GitHub credential may reach public assets');
    const item = PUBLIC_ASSETS.find(asset => PUBLIC_BASE + '/' + asset.publicPath === url);
    assert.ok(item, 'unexpected URL ' + url);
    return new Response(item.publicPath === state.mutate ? 'stale live bytes' : state.sources.get(item.sourcePath));
  };
  state.resolve = () => resolvePublishedRelease({ verifierSHA: main, token: 'synthetic-github-read-token', fetchImpl: state.fetch });
  return state;
}

test('requires a fully validated exact public receipt, including its successful gate', () => {
  assert.equal(requireReceipt(receipt()).registeredMainSHA, published);
  for (const invalid of [null, {}, { ...receipt(), registeredMainSHA: 'main' },
    { ...receipt(), registeredMainSHA: published + '\n' }, { ...receipt(), releaseGate: 'FAIL' },
    { ...receipt(), packageDigest: '' }, { ...receipt(), totalBytes: 1000000000 }]) {
    assert.throws(() => requireReceipt(invalid));
  }
});

test('a NO_OP may retain an ancestor receipt; verifier and published Worker revisions remain distinct', async () => {
  const f = fixture(); const identity = await f.resolve();
  assert.equal(identity.publishedSHA, published);
  assert.equal(identity.observedMainSHA, main);
  assert.equal(identity.verifierSHA, main);
  assert.equal(identity.productionAccount, 'NOT_RUN');
  assert.equal(identity.productionApiWrites, 'NONE');
  assert.notEqual(identity.publishedSHA, identity.verifierSHA);
  assert.ok(f.requests.filter(row => row.url.startsWith('https://api.github.com/')).every(row => row.options.headers.Authorization));
});

test('rejects diverged or newer published commits instead of guessing the deployed main', async () => {
  for (const relation of ['diverged', 'behind', 'unknown']) {
    const f = fixture(); f.relation = relation;
    await assert.rejects(f.resolve(), /ancestor/);
  }
});

test('compares all critical raw bytes and actual directory entry URLs to the registered commit', async () => {
  const f = fixture(); const identity = await f.resolve();
  const report = await verifyPublicAssets({ identity, fetchImpl: f.fetch, readSource: file => f.sources.get(file) });
  assert.equal(report.status, 'PASS');
  assert.equal(report.assets.length, PUBLIC_ASSETS.length);
  assert.equal(report.studentVersion, '2026.11.11.3');
  assert.ok(report.assets.every(row => row.matched && row.actualSha256 === row.expectedSha256));
  for (const destination of ['apmath/student/', 'apmath/planner/', 'apmath/homework/', 'apmath/playground/next/']) {
    assert.ok(report.assets.some(row => row.publicPath === destination && row.sourcePath === destination + 'index.html'));
  }
  assert.ok(report.assets.some(row => row.publicPath.endsWith('/labs/g8-triangles.html')));
  for (const stylesheet of ['apmath/css/student-tools.css', 'apmath/css/apms-ui-foundation.css']) {
    assert.ok(report.assets.some(row => row.publicPath === stylesheet && row.matched));
  }
});

test('a stale shared navigation or directory alias produces an explicit failed asset report', async () => {
  for (const changed of ['apmath/js/student-navigation.js', 'apmath/student/', 'apmath/css/student-tools.css', 'apmath/css/apms-ui-foundation.css']) {
    const f = fixture(); const identity = await f.resolve(); f.mutate = changed;
    const report = await verifyPublicAssets({ identity, fetchImpl: f.fetch, readSource: file => f.sources.get(file) });
    assert.equal(report.status, 'FAIL');
    assert.deepEqual(report.failures.map(row => row.publicPath), [changed]);
  }
});

test('final receipt evidence states stability only and never claims overall browser or asset PASS', async () => {
  const f = fixture(); const identity = await f.resolve();
  const result = await finishPublicReceipt({ ...identity, status: 'PASS', overallStatus: 'PASS' }, { fetchImpl: f.fetch });
  assert.equal(result.scope, 'PUBLIC_RECEIPT_STABILITY_ONLY');
  assert.equal(result.receiptStatus, 'UNCHANGED');
  assert.equal(result.publishedSHA, published);
  assert.equal(Object.hasOwn(result, 'status'), false);
  assert.equal(Object.hasOwn(result, 'overallStatus'), false);
  f.receipt.packageDigest = 'f'.repeat(64);
  await assert.rejects(finishPublicReceipt(identity, { fetchImpl: f.fetch }), /changed during verification/);
});

test('an invalid or changed receipt stops both pre-browser and final checks', async () => {
  const f = fixture(); const identity = await f.resolve();
  f.receipt.packageDigest = 'f'.repeat(64);
  await assert.rejects(assertPublicationStable(identity, { fetchImpl: f.fetch }), /changed during verification/);
  await assert.rejects(verifyPublicAssets({ identity, fetchImpl: f.fetch, readSource: file => f.sources.get(file) }), /changed during verification/);
  assert.throws(() => requireIdentity({ ...identity, publishedSHA: main }), /differs from the receipt/);
});

test('receipt fetching rejects redirects and oversized responses', async () => {
  const redirected = new Response(JSON.stringify(receipt()));
  Object.defineProperty(redirected, 'redirected', { value: true });
  await assert.rejects(resolvePublishedRelease({ verifierSHA: main, fetchImpl: async () => redirected }), /redirect/);
  await assert.rejects(resolvePublishedRelease({ verifierSHA: main, fetchImpl: async () => new Response(' '.repeat(16385)) }), /size limit/);
});

test('the public workflow pins the same dependency versions as the existing browser workflow', () => {
  const root = new URL('../', import.meta.url);
  const read = name => fs.readFileSync(fileURLToPath(new URL('.github/workflows/' + name, root)), 'utf8');
  const dependencyLine = value => value.split('\n').find(line => line.includes('npm install --prefix')).trim();
  const publicWorkflow = read('student-portal-public-browser.yml');
  assert.equal(dependencyLine(publicWorkflow), dependencyLine(read('student-portal-ux-browser.yml')));
  assert.match(publicWorkflow, /workflows: \['Archive Pages Release'\]/);
  assert.match(publicWorkflow, /conclusion == 'success'/);
  assert.match(publicWorkflow, /--source-root="\$GITHUB_WORKSPACE\/source"/);
  assert.match(publicWorkflow, /--base-url=https:\/\/icefoxtail\.github\.io\/AP------/);
  assert.equal((publicWorkflow.match(/persist-credentials: false/g) || []).length, 2);
});
