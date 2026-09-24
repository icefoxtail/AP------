#!/usr/bin/env node
/** Fresh A/B one-UID parent review after an exact source question edit. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const [queueArg, aOutputArg, bOutputArg] = process.argv.slice(2);
if (!queueArg || !aOutputArg || !bOutputArg) throw new Error('usage: node prepare-h1-inequality-parent-targeted-ab.mjs QUEUE_INDEX A_OUTPUT B_OUTPUT');
const queueIndex = Number(queueArg);
const root = process.cwd();
const dir = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/l3-boundary');
const currentScreen = path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN_CURRENT_QUEUE_39.jsonl');
const source = fs.readFileSync(fs.existsSync(currentScreen) ? currentScreen
  : path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse)
  .find(row => row.queueIndex === queueIndex);
if (!source) throw new Error(`queue ${queueIndex} not in bounded screen`);
const queue = { queueIndex, questionUid: source.questionUid, sourceIdentity: source.sourceIdentity };
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const builder = path.join(root, 'archive/tools/meta-foundation/build-h1-blind-worker-bundle.mjs');
const summary = { schemaVersion: 1, status: 'TARGETED_BLIND_AB_INPUTS_PREPARED', queueIndex, bundles: [] };
for (const [side, outputArg] of [['A', aOutputArg], ['B', bOutputArg]]) {
  const output = path.resolve(outputArg);
  if (fs.existsSync(output)) throw new Error(`refusing to overwrite ${output}`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const queueFile = output + '-uid-queue.jsonl';
  if (fs.existsSync(queueFile)) throw new Error(`refusing to overwrite ${queueFile}`);
  fs.writeFileSync(queueFile, JSON.stringify(queue) + '\n');
  const result = spawnSync(process.execPath, [builder, side, queueFile, output], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${side} builder failed: ${result.stderr || result.stdout}`);
  const manifestFile = path.join(output, 'bundle-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  const inputFile = path.join(output, manifest.inputFile);
  const rows = fs.readFileSync(inputFile, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  if (rows.length !== 1 || rows[0].questionUid !== queue.questionUid) throw new Error(`${side} identity drift`);
  delete rows[0].frozenL3;
  fs.writeFileSync(inputFile, JSON.stringify(rows[0]) + '\n');
  const parentTarget = path.join(output, 'authority/H1_INEQUALITY_PARENT_AUTHORITY_NO_UID.json');
  fs.copyFileSync(path.join(dir, 'H1_INEQUALITY_PARENT_AUTHORITY_NO_UID.json'), parentTarget);
  manifest.inputSha256 = sha(fs.readFileSync(inputFile));
  manifest.parentAuthorityFile = 'authority/H1_INEQUALITY_PARENT_AUTHORITY_NO_UID.json';
  manifest.parentAuthoritySha256 = sha(fs.readFileSync(parentTarget));
  manifest.frozenL3Visible = false;
  manifest.forbiddenContent.push('UID-specific frozen L3 assignment');
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  if (fs.readFileSync(inputFile, 'utf8').includes('frozenL3')) throw new Error(`${side} frozen L3 leaked`);
  summary.bundles.push({ side, output, sourceFingerprint: rows[0].sourceFingerprint,
    inputSha256: manifest.inputSha256, parentAuthoritySha256: manifest.parentAuthoritySha256 });
}
if (summary.bundles[0].sourceFingerprint !== summary.bundles[1].sourceFingerprint)
  throw new Error('A/B source snapshot mismatch');
console.log(JSON.stringify(summary, null, 2));
