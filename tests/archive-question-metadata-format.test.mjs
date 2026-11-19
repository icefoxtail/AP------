import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  META_FILE, SHARD_DIR, HEAD_FILE, questionMetadataText, shardKey, splitDocument, assembleDocument, assembledTextFromShards,
  assertMetadataAssembledCurrent, syncMetadataShards, writeMetadataText, assembleMetadataFile, splitMetadataFile,
  questionMetadataBytesAt, hasShards,
} from '../archive/tools/meta-foundation/question-metadata-format.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' });

// ---- the operational data -----------------------------------------------------------------------------------------------------

// Defect condition: any writer (or hand edit) that leaves the shards in another form is caught here. Git holds one file per exam and a
// head; the one-file form is only the ignored assembled copy.
test('the committed tree holds shards and a head, not a question_metadata.json', () => {
  assert.equal(git(root, 'ls-files', '--', META_FILE).trim(), '', 'the assembled file must not be committed');
  assert.ok(git(root, 'ls-files', '--', `${SHARD_DIR}/${HEAD_FILE}`).trim(), 'the head file is committed');
});

test('shards: every file is named by its exam, records are in questionUid order, no uid twice, the head has no records', () => {
  const dir = path.join(root, SHARD_DIR);
  const names = fs.readdirSync(dir).filter(name => name !== HEAD_FILE).sort();
  assert.ok(names.length > 0);
  const seen = new Set();
  let previous = '';
  const all = [];
  for (const name of names) {
    const text = fs.readFileSync(path.join(dir, name), 'utf8');
    assert.equal(text.includes('\r'), false, `LF only: ${name}`);
    const records = JSON.parse(text);
    assert.ok(Array.isArray(records) && records.length > 0, `non-empty shard: ${name}`);
    for (const record of records) {
      assert.equal(shardKey(record.sourceArchiveFile), name, `record ${record.questionUid} is in the shard of its exam`);
      assert.equal(seen.has(record.questionUid), false, `uid twice: ${record.questionUid}`);
      seen.add(record.questionUid);
      all.push(record);
    }
    assert.equal(text, `[\n${records.map(record => `  ${JSON.stringify(record)}`).join(',\n')}\n]\n`, `one record per line: ${name}`);
  }
  const sortedUids = all.map(record => record.questionUid).sort();
  const fromShards = [...all].sort((a, b) => (a.questionUid < b.questionUid ? -1 : 1)).map(record => record.questionUid);
  assert.deepEqual(fromShards, sortedUids);
  previous = fromShards[0];
  assert.ok(previous);
  const head = JSON.parse(fs.readFileSync(path.join(dir, HEAD_FILE), 'utf8'));
  assert.equal(Object.hasOwn(head, 'records'), false, 'the head has no records');
  assert.ok(Number.isInteger(head.recordsPosition));
});

test('shards assemble to the text of the document, and splitting the assembly gives the same shards again', () => {
  const dir = path.join(root, SHARD_DIR);
  const text = assembledTextFromShards(root);
  const doc = JSON.parse(text);
  assert.equal(text, questionMetadataText(doc));
  const { head, shards } = splitDocument(doc);
  assert.equal(head, fs.readFileSync(path.join(dir, HEAD_FILE), 'utf8'));
  assert.deepEqual([...shards.keys()].sort(), fs.readdirSync(dir).filter(name => name !== HEAD_FILE).sort());
  for (const [name, content] of shards) assert.equal(content, fs.readFileSync(path.join(dir, name), 'utf8'), name);
  // When the working folder has the assembled file (run-tests.js builds it), it is exactly that text.
  const file = path.join(root, META_FILE);
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file, 'utf8');
    assert.equal(raw.charCodeAt(0) === 0xFEFF, false, 'no BOM');
    assert.equal(raw, text);
  }
});

// ---- the text form ------------------------------------------------------------------------------------------------------------

test('head keys are pretty, records are one compact line each, key order is kept', () => {
  const doc = { schemaVersion: 'v', counts: { a: 1, b: [1, 2] }, records: [{ questionUid: 'x', n: 1, nested: { k: [1] } }, { questionUid: 'y' }], digest: 'd' };
  const text = questionMetadataText(doc);
  assert.equal(text, [
    '{',
    '  "schemaVersion": "v",',
    '  "counts": {',
    '    "a": 1,',
    '    "b": [',
    '      1,',
    '      2',
    '    ]',
    '  },',
    '  "records": [',
    '    {"questionUid":"x","n":1,"nested":{"k":[1]}},',
    '    {"questionUid":"y"}',
    '  ],',
    '  "digest": "d"',
    '}', ''].join('\n'));
  assert.deepEqual(Object.keys(JSON.parse(text)), Object.keys(doc));
});

test('empty or missing records stay valid JSON and the text round-trips', () => {
  for (const doc of [{ schemaVersion: 'v', records: [] }, { schemaVersion: 'v' }, { records: [], counts: {} }]) {
    const text = questionMetadataText(doc);
    assert.ok(text.endsWith('\n') && !text.endsWith('\n\n'));
    assert.deepEqual(JSON.parse(text), doc);
    assert.equal(questionMetadataText(JSON.parse(text)), text, 'writing what was read changes nothing');
  }
  assert.ok(questionMetadataText({ records: [] }).includes('"records": []'));
});

// ---- writers and the assembled copy (a small synthetic repository) -------------------------------------------------------------

const uid = n => 'qid_v1_' + String(n).padStart(8, '0');
const rec = (n, file) => ({ questionUid: uid(n), sourceArchiveFile: file, sourceOrdinal: n, difficultyBucket: n % 5 + 1, note: '해설 ' + n });
const sampleDoc = () => ({ schemaVersion: 'v', counts: { a: 1 }, records: [rec(1, 'a/one.js'), rec(2, 'b/two.js'), rec(3, 'a/one.js'), rec(4, 'c/three.js')], digest: 'd' });
function shardedRepo(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qm-shards-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, path.dirname(META_FILE)), { recursive: true });
  fs.writeFileSync(path.join(dir, META_FILE), questionMetadataText(sampleDoc()));
  splitMetadataFile(dir);
  return dir;
}
const shardFiles = dir => fs.readdirSync(path.join(dir, SHARD_DIR)).sort();
const readShards = dir => Object.fromEntries(shardFiles(dir).map(name => [name, fs.readFileSync(path.join(dir, SHARD_DIR, name), 'utf8')]));

test('split, assemble and the assembled-current check agree on a small repository', t => {
  const dir = shardedRepo(t);
  assert.equal(shardFiles(dir).length, 4, 'three exams and the head');
  assert.deepEqual(JSON.parse(assembledTextFromShards(dir)), sampleDoc());
  assert.doesNotThrow(() => assertMetadataAssembledCurrent(dir));
  fs.rmSync(path.join(dir, META_FILE));
  assert.throws(() => assertMetadataAssembledCurrent(dir), /assembled file is missing.*assemble/);
  assert.equal(assembleMetadataFile(dir), true);
  assert.equal(assembleMetadataFile(dir), false, 'already current');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, META_FILE), 'utf8')), sampleDoc());
});

test('a write changes only the shard of the exam it touched; a removed exam loses its shard, a new exam gains one', t => {
  const dir = shardedRepo(t);
  const before = readShards(dir);
  const doc = sampleDoc();
  doc.records[1].difficultyBucket = 5;
  writeMetadataText(dir, questionMetadataText(doc));
  const after = readShards(dir);
  const changed = Object.keys(after).filter(name => after[name] !== before[name]);
  assert.deepEqual(changed, [shardKey('b/two.js')]);
  assert.equal(fs.readFileSync(path.join(dir, META_FILE), 'utf8'), assembledTextFromShards(dir));
  // a new exam and the removal of another one
  const next = JSON.parse(fs.readFileSync(path.join(dir, META_FILE), 'utf8'));
  next.records = next.records.filter(record => record.sourceArchiveFile !== 'c/three.js').concat(rec(9, 'd/four.js')).sort((a, b) => (a.questionUid < b.questionUid ? -1 : 1));
  writeMetadataText(dir, questionMetadataText(next));
  const names = shardFiles(dir);
  assert.ok(names.includes(shardKey('d/four.js')) && !names.includes(shardKey('c/three.js')));
  assert.equal(fs.readFileSync(path.join(dir, META_FILE), 'utf8'), assembledTextFromShards(dir));
});

// A manual tool that still writes the assembled file in the old pretty form (or any other text) must be stopped by the writers' check
// before it can be registered over, and must be visible when the shards are brought in line.
test('an old pretty tool that rewrote the assembled file directly is caught before the next write', t => {
  const dir = shardedRepo(t);
  fs.writeFileSync(path.join(dir, META_FILE), JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, META_FILE), 'utf8')), null, 2) + '\n');
  assert.throws(() => assertMetadataAssembledCurrent(dir), /differs from the shards.*assemble/);
  assert.throws(() => writeMetadataText(dir, questionMetadataText(sampleDoc())), /differs from the shards/);
  // a stale assembled file (older content) is caught the same way
  const doc = sampleDoc(); doc.records[0].note = 'edited by hand';
  fs.writeFileSync(path.join(dir, META_FILE), questionMetadataText(doc));
  assert.throws(() => assertMetadataAssembledCurrent(dir), /differs from the shards/);
  // the repair is the assemble command: the shards win
  assert.equal(assembleMetadataFile(dir), true);
  assert.doesNotThrow(() => assertMetadataAssembledCurrent(dir));
});

test('records that are not in questionUid order cannot be turned into shards silently', t => {
  const dir = shardedRepo(t);
  const doc = sampleDoc();
  doc.records.reverse();
  fs.writeFileSync(path.join(dir, META_FILE), questionMetadataText(doc));
  assert.throws(() => syncMetadataShards(dir), /not in questionUid order/);
});

test('without a shard folder (temporary repositories of tests) a write is the single file, nothing else', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qm-legacy-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  assert.equal(hasShards(dir), false);
  assert.doesNotThrow(() => assertMetadataAssembledCurrent(dir));
  writeMetadataText(dir, questionMetadataText(sampleDoc()));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, META_FILE), 'utf8')), sampleDoc());
  assert.equal(fs.existsSync(path.join(dir, SHARD_DIR)), false);
});

test('the file at a commit is the same bytes whether that commit holds the single file or the shards', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qm-at-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, 'init', '-q', '--initial-branch=main'); git(dir, 'config', 'user.name', 'fixture'); git(dir, 'config', 'user.email', 'f@example.invalid');
  git(dir, 'config', 'commit.gpgsign', 'false');
  const text = questionMetadataText(sampleDoc());
  fs.mkdirSync(path.join(dir, path.dirname(META_FILE)), { recursive: true });
  fs.writeFileSync(path.join(dir, META_FILE), text);
  git(dir, 'add', '-A'); git(dir, 'commit', '-qm', 'single file');
  const single = git(dir, 'rev-parse', 'HEAD').trim();
  splitMetadataFile(dir);
  git(dir, 'rm', '-q', '--cached', META_FILE);
  fs.writeFileSync(path.join(dir, '.gitignore'), '/' + META_FILE + '\n');
  git(dir, 'add', '-A'); git(dir, 'commit', '-qm', 'shards');
  const sharded = git(dir, 'rev-parse', 'HEAD').trim();
  assert.equal(questionMetadataBytesAt(dir, single).toString('utf8'), text);
  assert.equal(questionMetadataBytesAt(dir, sharded).toString('utf8'), text);
  assert.equal(sha256(questionMetadataBytesAt(dir, sharded)), sha256(text));
  assert.throws(() => questionMetadataBytesAt(dir, 'HEAD~5'), Error);
});

test('assembleDocument puts records back at the position of the original key', () => {
  for (const doc of [{ records: [rec(1, 'a')], x: 1 }, { a: 1, b: 2, records: [rec(1, 'a')], c: 3 }, { a: 1, records: [rec(1, 'a'), rec(2, 'b')] }]) {
    const { head, shards } = splitDocument(doc);
    const back = assembleDocument(head, [...shards.values()]);
    assert.deepEqual(Object.keys(back), Object.keys(doc));
    assert.equal(questionMetadataText(back), questionMetadataText(doc));
  }
});
