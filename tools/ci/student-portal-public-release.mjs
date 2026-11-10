#!/usr/bin/env node
// Read-only public Pages verification. The verifier and the published product
// have separate revisions: a content NO_OP may retain an older release receipt.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateReleaseIdentity } from './archive-pages-release-identity.mjs';

export const REPOSITORY = 'icefoxtail/AP------';
export const PUBLIC_BASE = 'https://icefoxtail.github.io/AP------';
export const RECEIPT_URL = PUBLIC_BASE + '/_archive-release.json';
const SHA = /^[a-f0-9]{40}$/;
function requireSHA(value, label) {
  assert.equal(typeof value, 'string', label + ' must be a string');
  assert.equal(value.length, 40, label + ' must have exactly 40 characters');
  assert.match(value, SHA, label + ' is invalid');
  return value;
}
const RECEIPT_FIELDS = ['schemaVersion', 'registeredMainSHA', 'packageDigest', 'externalDependencyDigest',
  'validatorDigest', 'archiveValidationDigest', 'fileCount', 'totalBytes', 'releaseGate'];
const sourcePaths = [
  'apmath/student/index.html', 'apmath/student/student-version.json', 'apmath/student/manifest.json',
  'apmath/student/sw.js', 'apmath/student/student-portal.css', 'apmath/student/archive-review-output.js',
  'apmath/student/clinic-learning-view.js', 'apmath/student/clinic-lineage-view.js',
  'apmath/js/student-navigation.js', 'apmath/css/student-navigation.css',
  'apmath/css/student-tools.css', 'apmath/css/apms-ui-foundation.css',
  'apmath/planner/index.html', 'apmath/homework/index.html', 'apmath/playground/index.html',
  'apmath/playground/next/index.html', 'apmath/playground/next/kit/apl.css',
  'apmath/playground/next/kit/apl-hub.css', 'apmath/playground/next/kit/apl-hub.js',
  'apmath/playground/next/kit/apl-shell.js', 'apmath/playground/next/kit/apl-catalog.js',
  'apmath/playground/next/kit/apl-core.js', 'apmath/playground/next/kit/apl-board.js',
  'apmath/playground/next/labs/g8-triangles.html', 'apmath/wrong_print_engine.html',
  'archive/engine.html', 'archive/mixed_engine.html', 'archive/archive2-reader-controls.js',
  'archive/archive2-reader-controls.css', 'archive/archive2-output.js', 'archive/archive2-output-contract.js'
];
export const PUBLIC_ASSETS = Object.freeze([
  ...sourcePaths.map(sourcePath => ({ sourcePath, publicPath: sourcePath })),
  ...['apmath/student/', 'apmath/planner/', 'apmath/homework/', 'apmath/playground/next/']
    .map(publicPath => ({ publicPath, sourcePath: publicPath + 'index.html' }))
]);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const receiptKey = receipt => JSON.stringify(RECEIPT_FIELDS.map(key => receipt[key]));

export function requireReceipt(value) {
  assert.ok(validateReleaseIdentity(value, { requireGate: true }), 'Public release receipt is missing, malformed or has no successful release gate');
  requireSHA(value.registeredMainSHA, 'Public registered SHA');
  for (const field of ['packageDigest', 'externalDependencyDigest', 'validatorDigest', 'archiveValidationDigest']) {
    assert.equal(typeof value[field], 'string');
    assert.equal(value[field].length, 64, field + ' must have exactly 64 characters');
  }
  return value;
}

async function fetchBytes(url, { fetchImpl = fetch, token = '', maxBytes = 2 * 1024 * 1024 } = {}) {
  const headers = { 'Cache-Control': 'no-cache' };
  if (token) {
    assert.equal(new URL(url).origin, 'https://api.github.com', 'Credentials are only sent to the GitHub API');
    headers.Authorization = 'Bearer ' + token;
    headers.Accept = 'application/vnd.github+json';
    headers['X-GitHub-Api-Version'] = '2022-11-28';
  }
  const response = await fetchImpl(url, { method: 'GET', cache: 'no-store', redirect: 'error', headers, signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, 'Public verification GET failed: ' + new URL(url).pathname + ' HTTP ' + response.status);
  assert.ok(!response.redirected, 'Public verification must not follow redirects');
  if (response.url) assert.equal(response.url, url, 'Public verification URL changed');
  assert.ok(response.body, 'Public verification response has no body');
  const chunks = []; let length = 0;
  for await (const chunk of response.body) {
    length += chunk.length;
    assert.ok(length <= maxBytes, 'Public verification response exceeds its size limit');
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function readPublicReceipt({ fetchImpl = fetch } = {}) {
  const bytes = await fetchBytes(RECEIPT_URL, { fetchImpl, maxBytes: 16384 });
  return requireReceipt(JSON.parse(bytes.toString('utf8')));
}

export async function resolvePublishedRelease({ verifierSHA, token = '', fetchImpl = fetch } = {}) {
  requireSHA(verifierSHA, 'Trusted main verifier SHA');
  const receipt = await readPublicReceipt({ fetchImpl });
  const get = async route => JSON.parse((await fetchBytes('https://api.github.com/repos/' + REPOSITORY + route,
    { fetchImpl, token, maxBytes: 32 * 1024 * 1024 })).toString('utf8'));
  const ref = await get('/git/ref/heads/main');
  assert.equal(ref.ref, 'refs/heads/main');
  assert.equal(ref.object?.type, 'commit');
  requireSHA(ref.object?.sha, 'Main SHA');
  const publishedSHA = receipt.registeredMainSHA;
  const mainSHA = ref.object.sha;
  const relation = await get('/compare/' + publishedSHA + '...' + mainSHA + '?per_page=1');
  assert.ok(['ahead', 'identical'].includes(relation.status), 'Published commit is not an ancestor of current main');
  assert.equal(relation.base_commit?.sha, publishedSHA, 'Compare base is not the published commit');
  assert.equal(relation.merge_base_commit?.sha, publishedSHA, 'Published commit ancestry was not proven');
  return {
    schemaVersion: 'STUDENT_PORTAL_PUBLIC_CHECK_V1', publicBaseURL: PUBLIC_BASE,
    receiptURL: RECEIPT_URL, publishedSHA, observedMainSHA: mainSHA, verifierSHA, receipt,
    resolvedAt: new Date().toISOString(),
    authentication: 'Real published Worker code with synthetic name/PIN and teacher authentication in ephemeral local D1.',
    productionAccount: 'NOT_RUN', productionApiWrites: 'NONE'
  };
}

export function requireIdentity(value) {
  assert.equal(value?.schemaVersion, 'STUDENT_PORTAL_PUBLIC_CHECK_V1');
  assert.equal(value.publicBaseURL, PUBLIC_BASE);
  assert.equal(value.receiptURL, RECEIPT_URL);
  for (const name of ['publishedSHA', 'observedMainSHA', 'verifierSHA']) requireSHA(value[name], name);
  requireReceipt(value.receipt);
  assert.equal(value.publishedSHA, value.receipt.registeredMainSHA, 'Published SHA differs from the receipt');
  return value;
}

export async function assertPublicationStable(identity, { fetchImpl = fetch } = {}) {
  requireIdentity(identity);
  const current = await readPublicReceipt({ fetchImpl });
  assert.equal(receiptKey(current), receiptKey(identity.receipt), 'Public release changed during verification; a mixed-version result cannot pass');
  return current;
}

export async function finishPublicReceipt(identity, options = {}) {
  const receipt = await assertPublicationStable(identity, options);
  return {
    schemaVersion: 'STUDENT_PORTAL_PUBLIC_RECEIPT_CHECK_V1', scope: 'PUBLIC_RECEIPT_STABILITY_ONLY',
    receiptStatus: 'UNCHANGED', receiptUnchanged: true, finishedAt: new Date().toISOString(),
    publicBaseURL: PUBLIC_BASE, receiptURL: RECEIPT_URL,
    publishedSHA: identity.publishedSHA, verifierSHA: identity.verifierSHA,
    observedMainSHA: identity.observedMainSHA, receipt
  };
}

export function verifyVersion(sources) {
  const version = JSON.parse(sources.get('apmath/student/student-version.json').toString('utf8')).version;
  assert.match(String(version || ''), /^[a-zA-Z0-9][a-zA-Z0-9.-]{0,63}$/, 'Student version is missing or invalid');
  assert.equal(JSON.parse(sources.get('apmath/student/manifest.json').toString('utf8')).version, version);
  const indexVersion = sources.get('apmath/student/index.html').toString('utf8').match(/const STUDENT_APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
  const workerVersion = sources.get('apmath/student/sw.js').toString('utf8').match(/const STUDENT_SW_VERSION\s*=\s*['"]([^'"]+)['"]/);
  assert.equal(indexVersion?.[1], version, 'Public index version differs from student-version.json');
  assert.equal(workerVersion?.[1], version, 'Public service worker version differs from student-version.json');
  return version;
}

export async function verifyPublicAssets({ identity, readSource, fetchImpl = fetch, assets = PUBLIC_ASSETS } = {}) {
  await assertPublicationStable(identity, { fetchImpl });
  const sources = new Map(); const rows = [];
  for (const item of assets) {
    assert.ok(sourcePaths.includes(item.sourcePath), 'Unexpected source asset');
    assert.ok(PUBLIC_ASSETS.some(allowed => allowed.publicPath === item.publicPath && allowed.sourcePath === item.sourcePath), 'Unexpected public asset');
    if (!sources.has(item.sourcePath)) sources.set(item.sourcePath, Buffer.from(await readSource(item.sourcePath)));
    const expected = sources.get(item.sourcePath);
    const row = { ...item, expectedBytes: expected.length, expectedSha256: digest(expected), matched: false };
    try {
      const actual = await fetchBytes(PUBLIC_BASE + '/' + item.publicPath, { fetchImpl });
      row.actualBytes = actual.length; row.actualSha256 = digest(actual);
      row.matched = row.actualSha256 === row.expectedSha256 && row.actualBytes === row.expectedBytes;
      if (!row.matched) row.error = 'Published asset bytes differ from the registered commit';
    } catch (error) { row.error = error.message; }
    rows.push(row);
  }
  await assertPublicationStable(identity, { fetchImpl });
  const failures = rows.filter(row => !row.matched);
  const report = { ...identity, checkedAt: new Date().toISOString(), assets: rows, failures, status: failures.length ? 'FAIL' : 'PASS' };
  if (!failures.length) report.studentVersion = verifyVersion(sources);
  return report;
}

function writeJson(filename, value) {
  fs.mkdirSync(path.dirname(path.resolve(filename)), { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(value, null, 2) + '\n');
}
function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], { maxBuffer: 4 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
}
function options(args) {
  const result = {};
  for (const arg of args) {
    const match = /^--(source-root|verifier-root|identity|output)=(.+)$/.exec(arg);
    assert.ok(match, 'Unexpected verification option');
    assert.equal(result[match[1]], undefined, 'Duplicate verification option');
    result[match[1]] = match[2];
  }
  assert.ok(result.output, 'An evidence output path is required');
  return result;
}
async function main() {
  const mode = process.argv[2]; const opt = options(process.argv.slice(3));
  try {
    if (mode === 'resolve') {
      assert.ok(opt['verifier-root']);
      const verifierSHA = git(opt['verifier-root'], ['rev-parse', 'HEAD']).toString('utf8').trim();
      const identity = await resolvePublishedRelease({ verifierSHA, token: process.env.GITHUB_TOKEN || '' });
      writeJson(opt.output, identity);
      if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, 'published_sha=' + identity.publishedSHA + '\n');
      console.log('Public registered SHA: ' + identity.publishedSHA + '; verifier SHA: ' + verifierSHA);
      return;
    }
    assert.ok(opt.identity, 'The resolved release identity is required');
    const identity = requireIdentity(JSON.parse(fs.readFileSync(opt.identity, 'utf8')));
    if (mode === 'verify') {
      assert.ok(opt['source-root']);
      const actual = git(opt['source-root'], ['rev-parse', 'HEAD']).toString('utf8').trim();
      assert.equal(actual, identity.publishedSHA, 'Checkout is not the public registered commit');
      git(opt['source-root'], ['diff', '--exit-code', 'HEAD', '--']);
      const report = await verifyPublicAssets({ identity,
        readSource: file => git(opt['source-root'], ['show', identity.publishedSHA + ':' + file]) });
      writeJson(opt.output, report);
      assert.equal(report.status, 'PASS', 'Public asset mismatch: ' + report.failures.map(row => row.publicPath).join(', '));
      console.log('Public student version ' + report.studentVersion + ': ' + report.assets.length + ' exact asset comparisons passed');
      return;
    }
    assert.equal(mode, 'finish', 'Unknown verification mode');
    writeJson(opt.output, await finishPublicReceipt(identity));
  } catch (error) {
    const failurePath = mode === 'verify' ? opt.output + '.failure.json' : opt.output;
    const outcome = mode === 'finish'
      ? { scope: 'PUBLIC_RECEIPT_STABILITY_ONLY', receiptStatus: 'CHECK_FAILED' }
      : { status: 'FAIL' };
    writeJson(failurePath, { ...outcome, mode, error: error.message, checkedAt: new Date().toISOString() });
    throw error;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
