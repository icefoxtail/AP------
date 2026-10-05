#!/usr/bin/env node
/** UID-scoped C bundle for A/B parent conflicts, with peer and old assignments absent. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const [sampleArg, indexesArg, authorityArg, outputArg] = process.argv.slice(2);
if (!sampleArg || !indexesArg || !authorityArg || !outputArg)
  throw new Error('usage: node prepare-h1-blind-boundary-c.mjs SAMPLE_JSONL Q1,Q2,... AUTHORITY_JSON OUTPUT_DIR');
const root = process.cwd();
const sample = fs.readFileSync(path.resolve(sampleArg), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const byQueue = new Map(sample.map(row => [row.queueIndex, row]));
const indexes = indexesArg.split(',').map(Number);
if (indexes.length < 1 || indexes.length > 20 || new Set(indexes).size !== indexes.length || indexes.some(q => !byQueue.has(q)))
  throw new Error('bad C UID selection');
const output = path.resolve(outputArg);
if (fs.existsSync(output)) throw new Error(`refusing to overwrite ${output}`);
fs.mkdirSync(path.dirname(output), { recursive: true });
const queueFile = output + '-uid-queue.jsonl';
if (fs.existsSync(queueFile)) throw new Error(`refusing to overwrite ${queueFile}`);
const queue = indexes.map(q => {
  const item = byQueue.get(q);
  return { queueIndex: item.queueIndex, questionUid: item.questionUid,
    sourceIdentity: item.sourceIdentity, sourceFingerprint: item.sourceFingerprint };
});
fs.writeFileSync(queueFile, queue.map(row => JSON.stringify(row)).join('\n') + '\n');
const builder = path.join(root, 'archive/tools/meta-foundation/build-h1-blind-worker-bundle.mjs');
const run = spawnSync(process.execPath, [builder, 'C', queueFile, output], { cwd: root, encoding: 'utf8' });
if (run.status !== 0) throw new Error(`C builder failed: ${run.stderr || run.stdout}`);
const manifestFile = path.join(output, 'bundle-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const inputFile = path.join(output, manifest.inputFile);
const rows = fs.readFileSync(inputFile, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
if (rows.length !== queue.length) throw new Error('C input coverage drift');
for (const row of rows) delete row.frozenL3;
fs.writeFileSync(inputFile, rows.map(row => JSON.stringify(row)).join('\n') + '\n');
const authorityTarget = path.join(output, 'authority/H1_BOUNDARY_AUTHORITY_NO_UID.json');
fs.copyFileSync(path.resolve(authorityArg), authorityTarget);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
manifest.inputSha256 = sha(fs.readFileSync(inputFile));
manifest.boundaryAuthorityFile = 'authority/H1_BOUNDARY_AUTHORITY_NO_UID.json';
manifest.boundaryAuthoritySha256 = sha(fs.readFileSync(authorityTarget));
manifest.frozenL3Visible = false;
manifest.forbiddenContent.push('UID-specific frozen L3 and L4 assignments');
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
if (fs.readFileSync(inputFile, 'utf8').includes('frozenL3')) throw new Error('C frozen L3 leaked');
console.log(JSON.stringify({ output, count: rows.length, queueIndexes: indexes,
  inputSha256: manifest.inputSha256, authoritySha256: manifest.boundaryAuthoritySha256 }, null, 2));
