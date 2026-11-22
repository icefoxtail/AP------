// The progress witness must still reflect every question-metadata record now that git holds the metadata as per-exam shards.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { proofFromBlobs } from '../archive/tools/archive-progress-content-proof.mjs';
import { META_FILE, SHARD_DIR, hasShards, assembledTextFromShards, questionMetadataText, splitDocument } from '../archive/tools/meta-foundation/question-metadata-format.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = 'a'.repeat(40), B = 'b'.repeat(40), C = 'c'.repeat(40);

test('a changed metadata shard changes the registry digest; the head file and the single file are not witnesses', () => {
  const shard = `${SHARD_DIR}/${'1'.repeat(64)}.json`;
  const base = { 'archive/db.js': A, [shard]: B, [`${SHARD_DIR}/_head.json`]: C };
  const before = proofFromBlobs(base).registry;
  assert.notEqual(proofFromBlobs({ ...base, [shard]: C }).registry, before, 'a changed shard is observed');
  assert.equal(proofFromBlobs({ ...base, [`${SHARD_DIR}/_head.json`]: A }).registry, before, 'the head only restates counts');
  assert.notEqual(proofFromBlobs({ 'archive/db.js': A }).registry, before, 'a missing shard is observed');
  assert.equal(proofFromBlobs({ ...base, [META_FILE]: C }).registry, before, 'the assembled file is not a git blob witness');
});

test('the deployed-site side derives exactly the git shard blobs from the shipped assembled file', t => {
  if (!hasShards(root)) return t.skip('no shard folder');
  const python = ['python3', 'python'].find(name => spawnSync(name, ['--version'], { encoding: 'utf8' }).status === 0);
  if (!python) return t.skip('python not available');
  const snapshot = fs.readFileSync(path.join(root, '.github/scripts/archive-progress-site-snapshot.py'), 'utf8');
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'shard-witness-'));
  t.after(() => fs.rmSync(scratch, { recursive: true, force: true }));
  const helper = path.join(scratch, 'helper.py');
  fs.writeFileSync(helper, `${snapshot.split('seen_meta = False')[0].replace('ZIP_FILE = sys.argv[1]', 'ZIP_FILE = None')}
import sys
print(json.dumps(metadata_shard_blobs(open(sys.argv[1], encoding='utf-8', newline='').read())))
`);
  const assembled = path.join(scratch, 'question_metadata.json');
  const text = assembledTextFromShards(root);
  fs.writeFileSync(assembled, text);
  const run = spawnSync(python, [helper, assembled], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  assert.equal(run.status, 0, run.stderr);
  const derived = JSON.parse(run.stdout);
  // the blobs git would store for the shard texts of the same document
  const { shards } = splitDocument(JSON.parse(text));
  const expected = Object.fromEntries([...shards].map(([name, content]) => {
    const body = Buffer.from(content, 'utf8');
    return [`${SHARD_DIR}/${name}`, spawnSync('git', ['hash-object', '--stdin'], { input: body, encoding: 'utf8' }).stdout.trim()];
  }));
  assert.deepEqual(derived, expected);
  assert.equal(questionMetadataText(JSON.parse(text)), text);
});
