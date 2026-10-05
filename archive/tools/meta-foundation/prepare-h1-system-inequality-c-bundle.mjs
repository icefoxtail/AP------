#!/usr/bin/env node
/** Make a C-only, UID-scoped source bundle with prior L3 and A/B verdicts absent. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const [queueArg, outputArg] = process.argv.slice(2);
if (!queueArg || !outputArg) throw new Error('usage: node prepare-h1-system-inequality-c-bundle.mjs Q1,Q2,... OUTPUT_DIR');
const root = process.cwd();
const out = path.resolve(outputArg);
if (fs.existsSync(out)) throw new Error(`refusing to overwrite ${out}`);
const dir = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/l3-boundary');
const currentScreen = path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN_CURRENT_QUEUE_39.jsonl');
const all = fs.readFileSync(fs.existsSync(currentScreen) ? currentScreen
  : path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const byQueue = new Map(all.map(row => [row.queueIndex, row]));
const indexes = queueArg.split(',').map(Number);
if (indexes.length < 1 || indexes.length > 20 || new Set(indexes).size !== indexes.length || indexes.some(q => !byQueue.has(q)))
  throw new Error('bad C queue selection');
const queue = indexes.map(q => {
  const { sourceFingerprint, ...identity } = byQueue.get(q);
  return identity; // The builder binds the live question after any exact source repair.
});
fs.mkdirSync(path.dirname(out), { recursive: true });
const queueFile = path.join(path.dirname(out), path.basename(out) + '-uid-queue.jsonl');
if (fs.existsSync(queueFile)) throw new Error(`refusing to overwrite ${queueFile}`);
fs.writeFileSync(queueFile, queue.map(row => JSON.stringify(row)).join('\n') + '\n');
const builder = path.join(root, 'archive/tools/meta-foundation/build-h1-blind-worker-bundle.mjs');
const result = spawnSync(process.execPath, [builder, 'C', queueFile, out], { cwd: root, encoding: 'utf8' });
if (result.status !== 0) throw new Error(`C builder failed: ${result.stderr || result.stdout}`);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const manifestFile = path.join(out, 'bundle-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const inputFile = path.join(out, manifest.inputFile);
const inputRows = fs.readFileSync(inputFile, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
if (inputRows.length !== queue.length) throw new Error('C input count drift');
for (const row of inputRows) delete row.frozenL3;
fs.writeFileSync(inputFile, inputRows.map(row => JSON.stringify(row)).join('\n') + '\n');
const parentTarget = path.join(out, 'authority/H1_INEQUALITY_PARENT_AUTHORITY_NO_UID.json');
fs.copyFileSync(path.join(dir, 'H1_INEQUALITY_PARENT_AUTHORITY_NO_UID.json'), parentTarget);
manifest.inputSha256 = sha(fs.readFileSync(inputFile));
manifest.parentAuthorityFile = 'authority/H1_INEQUALITY_PARENT_AUTHORITY_NO_UID.json';
manifest.parentAuthoritySha256 = sha(fs.readFileSync(parentTarget));
manifest.frozenL3Visible = false;
manifest.forbiddenContent.push('UID-specific frozen L3 assignment');
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
if (fs.readFileSync(inputFile, 'utf8').includes('frozenL3')) throw new Error('frozen L3 leaked');
console.log(JSON.stringify({ output: out, count: queue.length, queueIndexes: indexes,
  inputSha256: manifest.inputSha256, parentAuthoritySha256: manifest.parentAuthoritySha256 }, null, 2));
