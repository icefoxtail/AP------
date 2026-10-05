#!/usr/bin/env node
/** Build A/B isolated current-source bundles for one bounded L3 parent review. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const [aRootArg, bRootArg] = process.argv.slice(2);
if (!aRootArg || !bRootArg) throw new Error('usage: node prepare-h1-system-inequality-blind-bundles.mjs A_ROOT B_ROOT');
const root = process.cwd();
const checkpoint = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const currentSource = path.join(checkpoint, 'l3-boundary/H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN_CURRENT_QUEUE_39.jsonl');
const source = fs.existsSync(currentSource) ? currentSource
  : path.join(checkpoint, 'l3-boundary/H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN.jsonl');
const authority = path.join(checkpoint, 'l3-boundary/H1_INEQUALITY_PARENT_AUTHORITY_NO_UID.json');
const builder = path.join(root, 'archive/tools/meta-foundation/build-h1-blind-worker-bundle.mjs');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const rows = fs.readFileSync(source, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
if (rows.length !== 39 || new Set(rows.map(row => row.questionUid)).size !== 39) throw new Error('screen coverage drift');
const chunks = [rows.slice(0, 20), rows.slice(20)];
const summary = { schemaVersion: 1, status: 'BLIND_INPUTS_PREPARED_NOT_REVIEWED', denominator: 39, bundles: [] };
for (const [side, rootArg] of [['A', aRootArg], ['B', bRootArg]]) {
  const sideRoot = path.resolve(rootArg);
  if (fs.existsSync(sideRoot)) throw new Error(`refusing to overwrite side root: ${sideRoot}`);
  fs.mkdirSync(sideRoot, { recursive: true });
  for (const [index, chunk] of chunks.entries()) {
    const number = index + 1;
    const queueFile = path.join(sideRoot, `queue-batch${number}.jsonl`);
    const output = path.join(sideRoot, `batch${number}`);
    fs.writeFileSync(queueFile, chunk.map(row => JSON.stringify(row)).join('\n') + '\n');
    const result = spawnSync(process.execPath, [builder, side, queueFile, output], { cwd: root, encoding: 'utf8' });
    if (result.status !== 0) throw new Error(`${side} batch${number} builder failed: ${result.stderr || result.stdout}`);
    const manifestFile = path.join(output, 'bundle-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const inputFile = path.join(output, manifest.inputFile);
    const inputRows = fs.readFileSync(inputFile, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
    if (inputRows.length !== chunk.length) throw new Error(`${side} batch${number} count drift`);
    for (const row of inputRows) delete row.frozenL3;
    fs.writeFileSync(inputFile, inputRows.map(row => JSON.stringify(row)).join('\n') + '\n');
    const authorityTarget = path.join(output, 'authority/H1_INEQUALITY_PARENT_AUTHORITY_NO_UID.json');
    fs.copyFileSync(authority, authorityTarget);
    manifest.inputSha256 = sha(fs.readFileSync(inputFile));
    manifest.parentAuthorityFile = 'authority/H1_INEQUALITY_PARENT_AUTHORITY_NO_UID.json';
    manifest.parentAuthoritySha256 = sha(fs.readFileSync(authorityTarget));
    manifest.frozenL3Visible = false;
    manifest.forbiddenContent.push('UID-specific frozen L3 assignment');
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
    if (fs.readFileSync(inputFile, 'utf8').includes('frozenL3')) throw new Error(`${side} batch${number} frozen L3 leaked`);
    summary.bundles.push({ side, batch: number, range: [chunk[0].queueIndex, chunk.at(-1).queueIndex],
      count: chunk.length, output, inputSha256: manifest.inputSha256,
      activeVocabSha256: manifest.vocabularySha256, parentAuthoritySha256: manifest.parentAuthoritySha256 });
  }
}
console.log(JSON.stringify(summary, null, 2));
