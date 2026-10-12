#!/usr/bin/env node
// GPT2 Library connector readback gate.
// A connector host MUST materialize each Library file as raw bytes before calling.
// No claims about remote persistence are accepted without those bytes.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { plan, verify } from './gpt2-library-commit.mjs';

const digest = data => crypto.createHash('sha256').update(data).digest('hex');

export function attestReadback(options, materialized) {
  const p = plan(options);
  if (!Array.isArray(materialized) || materialized.length !== p.items.length)
    throw Error('REMOTE_READBACK_INCOMPLETE');
  const byPath = new Map();
  for (const row of materialized) {
    if (byPath.has(row.remotePath)) throw Error('REMOTE_READBACK_DUPLICATE');
    byPath.set(row.remotePath, row);
  }
  const observations = p.items.map(item => {
    const row = byPath.get(item.remotePath);
    if (!row || !row.localReadbackPath) throw Error('REMOTE_READBACK_MISSING:' + item.remotePath);
    const bytes = fs.readFileSync(row.localReadbackPath);
    const hash = digest(bytes);
    if (hash !== item.sha256 || bytes.length !== item.sizeBytes)
      throw Error('REMOTE_READBACK_MISMATCH:' + item.remotePath);
    return { remotePath: item.remotePath, sha256: hash, sizeBytes: bytes.length, readbackConfirmed: true };
  });
  const commit = verify(options, observations);
  return { ...commit, verification: 'MATERIALIZED_REMOTE_BYTES', verificationSha256: digest(Buffer.from(JSON.stringify(observations))) };
}

function cli(argv) {
  if (argv.length !== 6) throw Error('ARGS_REQUIRED: outputRoot campaignId stream examUid stage readbackManifest');
  const [outputRoot, campaignId, stream, examUid, stage, readbackManifest] = argv;
  const options = { outputRoot, campaignId, stream, examUid, stage };
  const manifest = JSON.parse(fs.readFileSync(readbackManifest, 'utf8'));
  const result = attestReadback(options, manifest);
  console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { cli(process.argv.slice(2)); }
  catch (error) { console.error(JSON.stringify({ ok: false, error: error.message })); process.exitCode = 2; }
}
