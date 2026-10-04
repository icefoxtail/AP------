#!/usr/bin/env node
/** Prepare isolated A/B semantic bundles from a UID-only sample, hiding old L3. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const [sampleArg, authorityArg, aOutputArg, bOutputArg] = process.argv.slice(2);
if (!sampleArg || !authorityArg || !aOutputArg || !bOutputArg)
  throw new Error('usage: node prepare-h1-blind-boundary-sample.mjs SAMPLE_JSONL AUTHORITY_JSON A_OUTPUT B_OUTPUT');
const root = process.cwd();
const sampleFile = path.resolve(sampleArg), authorityFile = path.resolve(authorityArg);
const source = fs.readFileSync(sampleFile, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
if (source.length < 1 || source.length > 20 || new Set(source.map(row => row.questionUid)).size !== source.length)
  throw new Error('sample must contain 1-20 unique UID rows');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const builder = path.join(root, 'archive/tools/meta-foundation/build-h1-blind-worker-bundle.mjs');
const result = { schemaVersion: 1, status: 'BLIND_INPUTS_PREPARED_NOT_REVIEWED', count: source.length, bundles: [] };
for (const [side, outputArg] of [['A', aOutputArg], ['B', bOutputArg]]) {
  const output = path.resolve(outputArg);
  if (fs.existsSync(output)) throw new Error(`refusing to overwrite ${output}`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const queueFile = output + '-uid-queue.jsonl';
  if (fs.existsSync(queueFile)) throw new Error(`refusing to overwrite ${queueFile}`);
  const queue = source.map(row => ({ queueIndex: row.queueIndex, questionUid: row.questionUid,
    sourceIdentity: row.sourceIdentity, sourceFingerprint: row.sourceFingerprint }));
  fs.writeFileSync(queueFile, queue.map(row => JSON.stringify(row)).join('\n') + '\n');
  const run = spawnSync(process.execPath, [builder, side, queueFile, output], { cwd: root, encoding: 'utf8' });
  if (run.status !== 0) throw new Error(`${side} builder failed: ${run.stderr || run.stdout}`);
  const manifestFile = path.join(output, 'bundle-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  const inputFile = path.join(output, manifest.inputFile);
  const rows = fs.readFileSync(inputFile, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  if (rows.length !== source.length) throw new Error(`${side} input coverage drift`);
  for (const row of rows) delete row.frozenL3;
  fs.writeFileSync(inputFile, rows.map(row => JSON.stringify(row)).join('\n') + '\n');
  const authorityTarget = path.join(output, 'authority/H1_BOUNDARY_AUTHORITY_NO_UID.json');
  fs.copyFileSync(authorityFile, authorityTarget);
  manifest.inputSha256 = sha(fs.readFileSync(inputFile));
  manifest.boundaryAuthorityFile = 'authority/H1_BOUNDARY_AUTHORITY_NO_UID.json';
  manifest.boundaryAuthoritySha256 = sha(fs.readFileSync(authorityTarget));
  manifest.frozenL3Visible = false;
  manifest.forbiddenContent.push('UID-specific frozen L3 and L4 assignments');
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  if (fs.readFileSync(inputFile, 'utf8').includes('frozenL3')) throw new Error(`${side} frozen L3 leaked`);
  result.bundles.push({ side, output, inputSha256: manifest.inputSha256,
    activeVocabSha256: manifest.vocabularySha256, boundaryAuthoritySha256: manifest.boundaryAuthoritySha256 });
}
if (result.bundles[0].inputSha256 !== result.bundles[1].inputSha256)
  throw new Error('A/B input payload mismatch');
console.log(JSON.stringify(result, null, 2));
