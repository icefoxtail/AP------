'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const vm = require('node:vm');

const repo = path.resolve(__dirname, '../../../../..');
const archive = path.join(repo, 'archive');
const pilot = path.resolve(__dirname, '..');
const receiptPath = path.join(repo, '.tmp/archive/palma-svg-speed-pilot-20261010/root-intake/apply-receipt.json');
const hashRebindPath = path.join(repo, '.tmp/archive/palma-svg-speed-pilot-20261010/root-intake/hash-rebind-apply-receipt.json');
const rosterPath = path.join(pilot, 'roster.json');
const visualFields = ['solutionImage', 'solutionImageSize', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageLayout'];
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const readJsonBytes = file => {
  const bytes = fs.readFileSync(file);
  return { bytes, value: JSON.parse(bytes.toString('utf8')) };
};
const digestFile = file => sha256(fs.readFileSync(file));
const stable = value => {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
};
const canonical = value => JSON.stringify(stable(value));
const clone = value => JSON.parse(JSON.stringify(value));
const fail = message => { throw new Error(message); };

const args = process.argv.slice(2);
const getArg = name => args.map(arg => new RegExp(`^--${name}=(.+)$`).exec(arg)).find(Boolean)?.[1];
const manifestPathArg = getArg('manifest-path') || '.tmp/archive/palma-svg-speed-pilot-20261010/PALMA25_H1_2MID/revised-batch-v8/manifest.json';
const expectedManifestSha = String(getArg('manifest-sha') || '').toUpperCase();
const expectedReceiptSha = String(getArg('apply-receipt-sha') || '').toUpperCase();
const expectedHashRebindSha = String(getArg('hash-rebind-receipt-sha') || '').toUpperCase();
const manifestPath = path.resolve(repo, manifestPathArg);
const { bytes: manifestBytes, value: manifest } = readJsonBytes(manifestPath);
const { bytes: receiptBytes, value: receipt } = readJsonBytes(receiptPath);
const { bytes: hashRebindBytes, value: hashRebind } = readJsonBytes(hashRebindPath);
const roster = readJsonBytes(rosterPath).value;

if (!/^[0-9A-F]{64}$/.test(expectedManifestSha) || sha256(manifestBytes) !== expectedManifestSha)
  fail('Candidate manifest SHA-256 mismatch');
if (!/^[0-9A-F]{64}$/.test(expectedReceiptSha) || sha256(receiptBytes) !== expectedReceiptSha)
  fail('Root reviewed Source/Consumer apply receipt SHA-256 mismatch');
if (!/^[0-9A-F]{64}$/.test(expectedHashRebindSha) || sha256(hashRebindBytes) !== expectedHashRebindSha || hashRebind.status !== 'APPLIED_EXACT_HASH_ONLY_REBIND')
  fail('Exact root hash-only metadata rebind receipt SHA/status mismatch');
if (!['STATIC_CANDIDATES_READY_FOR_INDEPENDENT_REVIEW', 'REVIEW_PENDING_Q19_MATHJAX', 'REVIEW_PENDING_ACTUAL_QPP1_RENDER'].includes(manifest.status) || manifest.candidateCount !== 10)
  fail('Candidate manifest status/count mismatch');
if (receipt.status !== 'APPLIED_EXACT_REVIEWED_BYTES' || receipt.proposalSha !== '0B7DC28B26DC9799B7B821FF1C1B35EBDB8C2DEDC0FFBD3CFD92C4A29C0DB175')
  fail('Root apply receipt is not the exact reviewed proposal');

const targetUids = roster.selected.map(item => item.uid);
const manifestUids = manifest.items.map(item => item.uid);
if (targetUids.length !== 10 || new Set(targetUids).size !== 10 || canonical(targetUids.slice().sort()) !== canonical(receipt.targetUIDs.slice().sort()) || canonical(targetUids.slice().sort()) !== canonical(manifestUids.slice().sort()))
  fail('Root receipt, frozen roster, and visual manifest UID rosters differ');

const changed = new Map(receipt.changedFiles.map(item => [item.path, item.sha256.toUpperCase()]));
const hashRebound = new Map(hashRebind.rows.map(item => [item.path, item]));
const beforeRoot = path.resolve(repo, receipt.backups);
for (const [relative, expected] of changed) {
  const current = path.resolve(repo, relative);
  const hashOnlyAfter = hashRebound.get(relative);
  if (!current.startsWith(repo + path.sep) || !fs.existsSync(current) ||
      (hashOnlyAfter && hashOnlyAfter.before.toUpperCase() !== expected) ||
      digestFile(current) !== (hashOnlyAfter?.after?.toUpperCase() || expected))
    fail(`Current production bytes differ from root apply receipt: ${relative}`);
}

const visualByUid = new Map(manifest.items.map(item => [item.uid, item]));
const rosterByUid = new Map(roster.selected.map(item => [item.uid, item]));
const indexPath = 'archive/data/generated-lite-consumer/v1/index.json';
const indexBeforePath = path.resolve(beforeRoot, indexPath);
const indexAfterPath = path.resolve(repo, indexPath);
const indexRebind = hashRebound.get(indexPath);
const indexReceiptSha = indexRebind?.after?.toUpperCase() || changed.get(indexPath);
if (!indexReceiptSha || digestFile(indexAfterPath) !== indexReceiptSha || (indexRebind && indexRebind.before.toUpperCase() !== changed.get(indexPath)))
  fail('Current index is not exact apply/hash-rebind receipt-pinned');
const cutoverPath = 'archive/data/generated-lite-consumer/v1/meta-retention-cutover-20261009.json';
const cutoverRebind = hashRebound.get(cutoverPath);
if (!cutoverRebind || !/^[0-9A-F]{64}$/i.test(cutoverRebind.before) ||
    digestFile(path.resolve(repo, cutoverPath)) !== cutoverRebind.after.toUpperCase())
  fail('Current metadata cutover is not exact hash-rebind receipt-pinned');
const indexBefore = JSON.parse(fs.readFileSync(indexBeforePath, 'utf8'));
const indexAfter = JSON.parse(fs.readFileSync(indexAfterPath, 'utf8'));
const indexHashFields = ['sourceShardGitSha', 'shardGitBlobSha', 'consumerShardGitSha', 'consumerShardSha256'];
function normalizeIndex(value) {
  const copy = clone(value);
  for (const row of copy.records || []) {
    for (const field of indexHashFields) delete row[field];
    if (row.metaVerification) delete row.metaVerification.sourceShardGitSha;
  }
  return copy;
}
if (canonical(normalizeIndex(indexBefore)) !== canonical(normalizeIndex(indexAfter)))
  fail('Index body, metadata, status, approval, UID order, or selectable projection changed beyond source hash refresh');
const beforeIndexRows = indexBefore.records || [], afterIndexRows = indexAfter.records || [];

function questionFromSource(file, uid) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { timeout: 1000 });
  const rows = context.window.questionBank;
  const matches = Array.isArray(rows) ? rows.filter(question => question.uid === uid) : [];
  if (matches.length !== 1) fail(`Source UID is missing or duplicated: ${uid}`);
  return matches[0];
}
function normalizeVisualQuestion(question) {
  const copy = clone(question);
  for (const field of visualFields) delete copy[field];
  return copy;
}
function normalizeConsumer(value, allowedUids) {
  const copy = clone(value);
  for (const record of copy.records || []) {
    delete record.sourceShardGitSha;
    if (allowedUids.has(record.generatedUid))
      record.question = normalizeVisualQuestion(record.question);
  }
  return copy;
}

const consumerChecks = new Map();
const sourceChecks = new Map();
const visualAssets = new Map();
for (const uid of targetUids) {
  const selected = rosterByUid.get(uid), visual = visualByUid.get(uid);
  const sourcePath = selected.sourceShard.path, consumerPath = selected.consumer.path;
  const sourceBeforePath = path.resolve(beforeRoot, sourcePath), sourceAfterPath = path.resolve(repo, sourcePath);
  const consumerBeforePath = path.resolve(beforeRoot, consumerPath), consumerAfterPath = path.resolve(repo, consumerPath);
  const sourceSha = changed.get(sourcePath), consumerSha = changed.get(consumerPath);
  if (!sourceSha || !consumerSha) fail(`Root apply receipt lacks target Source/Consumer bytes: ${uid}`);
  if (digestFile(sourceAfterPath) !== sourceSha || digestFile(consumerAfterPath) !== consumerSha)
    fail(`Target Source/Consumer bytes differ from root apply receipt: ${uid}`);

  const sourceBefore = questionFromSource(sourceBeforePath, uid);
  const sourceAfter = questionFromSource(sourceAfterPath, uid);
  if (canonical(normalizeVisualQuestion(sourceBefore)) !== canonical(normalizeVisualQuestion(sourceAfter)))
    fail(`Source content, choices, answer, solution, or Meta changed beyond allowed solution visual fields: ${uid}`);
  if (targetUids.filter(id => id === uid).length !== 1) fail(`Target UID identity mismatch: ${uid}`);

  const consumerBefore = JSON.parse(fs.readFileSync(consumerBeforePath, 'utf8'));
  const consumerAfter = JSON.parse(fs.readFileSync(consumerAfterPath, 'utf8'));
  const shardUids = targetUids.filter(id => rosterByUid.get(id).consumer.path === consumerPath);
  const shardUidSet = new Set(shardUids);
  if (canonical(normalizeConsumer(consumerBefore, shardUidSet)) !== canonical(normalizeConsumer(consumerAfter, shardUidSet)))
    fail(`Consumer content, choices, answer, solution, or Meta changed beyond approved visuals/source hash refresh: ${uid}`);
  const beforeRows = consumerBefore.records.filter(record => record.generatedUid === uid);
  const afterRows = consumerAfter.records.filter(record => record.generatedUid === uid);
  if (beforeRows.length !== 1 || afterRows.length !== 1 || beforeRows[0].localOrdinal !== afterRows[0].localOrdinal)
    fail(`Consumer UID/ordinal identity mismatch: ${uid}`);
  const beforeIndexMatches = beforeIndexRows.filter(row => row.uid === uid);
  const afterIndexMatches = afterIndexRows.filter(row => row.uid === uid);
  if (beforeIndexMatches.length !== 1 || afterIndexMatches.length !== 1 || canonical(normalizeIndex({ records: beforeIndexMatches })) !== canonical(normalizeIndex({ records: afterIndexMatches })))
    fail(`Index approval/selectability/meta projection changed: ${uid}`);

  const question = afterRows[0].question;
  const assetRef = String(visual.asset?.path || '').replace(/^archive\//, '');
  const expectedRef = `assets/generated-lite/palma-speed-pilot/${uid}-solution.svg`;
  if (assetRef !== expectedRef || question.solutionImage !== expectedRef)
    fail(`Source/Consumer solutionImage ref does not match manifest: ${uid}`);
  for (const field of visualFields) if ((sourceAfter[field] ?? null) !== (question[field] ?? null))
    fail(`Source/Consumer visual field parity mismatch (${field}): ${uid}`);
  const assetPath = path.resolve(repo, visual.asset.path);
  if (!assetPath.startsWith(archive + path.sep) || !fs.existsSync(assetPath)) fail(`Physical candidate asset missing: ${uid}`);
  const assetSha = digestFile(assetPath);
  if (assetSha !== String(visual.asset.rawSha256).toUpperCase() || assetSha !== String(visual.svg.rawSha256).toUpperCase())
    fail(`Physical candidate asset hash mismatch: ${uid}`);
  consumerChecks.set(consumerPath, consumerSha);
  sourceChecks.set(sourcePath, sourceSha);
  visualAssets.set(expectedRef, { uid, path: assetPath, sha256: assetSha });
}

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'], ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml; charset=utf-8'], ['.png', 'image/png'], ['.woff2', 'font/woff2'],
]);
function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}
function fixtureHtml(url) {
  const role = url.searchParams.get('role') === 'teacher' ? 'teacher' : url.searchParams.get('role') === 'student' ? 'student' : 'none';
  const uid = visualByUid.has(url.searchParams.get('uid')) ? url.searchParams.get('uid') : '';
  const session = role === 'teacher'
    ? { id: 'local-read-only-teacher', role: 'teacher', session_token: 'LOCAL_PREVIEW_FIXTURE_ONLY' }
    : role === 'student'
      ? { id: 'local-student', role: 'student', student_token: 'LOCAL_PREVIEW_FIXTURE_ONLY' }
      : null;
  return `<!doctype html><meta charset="utf-8"><title>Local preview fixture</title><p>Local-only ${role} preview setup…</p><script>localStorage.removeItem('APMATH_SESSION');const session=${JSON.stringify(session)};if(session)localStorage.setItem('APMATH_SESSION',JSON.stringify(session));location.replace('/archive/generated-bank.html'+(${JSON.stringify(uid)}?('?uid='+encodeURIComponent(${JSON.stringify(uid)})):'')+'&previewFixture=${role}')</script>`;
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (url.pathname === '/archive/generated-bank-preview-fixture.html')
      return send(res, 200, fixtureHtml(url), 'text/html; charset=utf-8');
    if (!url.pathname.startsWith('/archive/')) return send(res, 404, 'not found');
    const relative = decodeURIComponent(url.pathname.slice('/archive/'.length));
    const file = path.resolve(archive, relative);
    if (!file.startsWith(archive + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile())
      return send(res, 404, 'not found');
    const asset = visualAssets.get(relative);
    const headers = { 'Content-Type': mime.get(path.extname(file)) || 'application/octet-stream', 'Cache-Control': 'no-store' };
    if (asset) headers['X-Candidate-SHA256'] = asset.sha256;
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  } catch (error) {
    send(res, 500, `physical preview fixture error: ${error.message}`);
  }
});
const numericPort = args.find(arg => /^\d+$/.test(arg));
const port = Number(numericPort || process.env.PALMA_PREVIEW_PORT || 0);
server.listen(port, '127.0.0.1', () => {
  console.log(JSON.stringify({
    ready: true,
    mode: 'PHYSICAL_SOURCE_CONSUMER_INDEX_ASSET',
    baseUrl: `http://127.0.0.1:${server.address().port}/archive/`,
    candidateManifestPath: path.relative(repo, manifestPath),
    candidateManifestSha256: expectedManifestSha,
    applyReceiptPath: path.relative(repo, receiptPath),
    applyReceiptSha256: expectedReceiptSha,
    hashRebindReceiptPath: path.relative(repo, hashRebindPath),
    hashRebindReceiptSha256: expectedHashRebindSha,
    candidateCount: visualAssets.size,
    rootAppliedTargetUids: targetUids,
    targetSourceFileCount: sourceChecks.size,
    targetConsumerShardCount: consumerChecks.size,
    indexSha256: indexReceiptSha,
    physicalSourceConsumerIndex: true,
    productionBytesWrittenByServer: false,
  }));
});
process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
