#!/usr/bin/env node
/** Prepare equal A2/B L4 inputs for current PASS quadratic-discriminant family only. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const checkpoint = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const out = path.join(checkpoint, 'l4-quadratic-discriminant');
fs.mkdirSync(out, { recursive: true });
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rows = fs.readFileSync(path.join(checkpoint, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170.jsonl'), 'utf8')
  .trim().split(/\r?\n/).map(JSON.parse);
const parentKey = 'PT_H1_QUADRATIC_DISCRIMINANT';
const family = rows.filter(row => row.fieldDecisions.l3.value === parentKey);
const pass = family.filter(row => row.fieldDecisions.reviewStatus.value === 'PASS');
const held = family.filter(row => row.fieldDecisions.reviewStatus.value === 'HOLD');
if (rows.length !== 1170 || family.length !== 82 || pass.length !== 80
  || held.map(row => row.queueIndex).sort((a, b) => a - b).join(',') !== '38,620')
  throw new Error('quadratic-discriminant family scope drift');
const authority = {
  schemaVersion: 1, status: 'UID_FREE_L4_BOUNDARY_AUTHORITY_NOT_VERDICT',
  parentProblemTypeKey: parentKey,
  parentLabelKo: '이차방정식의 근과 판별식',
  parentDefinition: '실근·중근·허근의 존재와 근의 위치를 판별식 또는 부호 조건으로 판정하는 유형.',
  curriculumSource: 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/H1_STAGE3_L3_SYNTHESIS_CHECKPOINT_1170.json#newProblemTypeCandidates',
  instructions: [
    'Read each complete current content and solution once; record the actual decisive step and item-level mathematical reason.',
    'Check exact ACTIVE template semantic equivalents before proposing a bounded reusable skeleton.',
    'Do not split L4 for numerical, display-format, difficulty or mere condition differences.',
    'If a supporting concept belongs in CrossConcept or a sign/range filter belongs in Condition, keep it out of the L4 skeleton.',
    'Do not infer a source correction. HOLD only an affected UID with an exact reason.',
  ],
  forbidden: ['UID-specific old L4 assignment', 'peer verdicts', 'aggregate target L4 count', 'pilot hidden metadata'],
};
const authorityFile = path.join(out, 'H1_QDISC_L4_AUTHORITY_NO_UID.json');
const manifestFile = path.join(out, 'H1_QDISC_L4_WORKING_PASS_80_UID_ONLY.jsonl');
if (fs.existsSync(authorityFile) || fs.existsSync(manifestFile)) throw new Error('qdisc family already prepared');
fs.writeFileSync(authorityFile, JSON.stringify(authority, null, 2) + '\n');
const queue = pass.map(row => ({ queueIndex: row.queueIndex, questionUid: row.questionUid,
  sourceIdentity: row.sourceIdentity, sourceFingerprint: row.sourceFingerprint }));
fs.writeFileSync(manifestFile, queue.map(row => JSON.stringify(row)).join('\n') + '\n');
const builder = path.join(root, 'archive/tools/meta-foundation/build-h1-blind-worker-bundle.mjs');
const results = [];
for (const [side, destRoot] of [['A', 'C:/Users/USER/.codex/h1-a2-blind/l4-qdisc-80'],
  ['B', 'C:/Users/USER/.codex/h1-b-blind/l4-qdisc-80']]) {
  for (let batch = 0; batch < 4; batch++) {
    const scope = queue.slice(batch * 20, (batch + 1) * 20);
    const folder = path.join(destRoot, `batch${batch + 1}`);
    if (fs.existsSync(folder)) throw new Error(`refusing to overwrite ${folder}`);
    const queuePath = path.join(out, `H1_QDISC_L4_BATCH${batch + 1}_UID_ONLY.jsonl`);
    if (!fs.existsSync(queuePath)) fs.writeFileSync(queuePath,
      scope.map(row => JSON.stringify(row)).join('\n') + '\n');
    const result = spawnSync(process.execPath, [builder, side, queuePath, folder],
      { cwd: root, encoding: 'utf8' });
    if (result.status !== 0) throw new Error(`${side} batch${batch + 1} bundle: ${result.stderr || result.stdout}`);
    const manifestPath = path.join(folder, 'bundle-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const inputPath = path.join(folder, manifest.inputFile);
    const input = fs.readFileSync(inputPath, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
    if (input.length !== 20) throw new Error(`${side} batch${batch + 1} input count`);
    for (let i = 0; i < input.length; i++) {
      if (input[i].questionUid !== scope[i].questionUid || input[i].sourceFingerprint !== scope[i].sourceFingerprint)
        throw new Error(`${side} batch${batch + 1} source parity`);
      input[i].frozenL3 = { problemTypeKey: parentKey, status: 'CURRENT_WORKING_UPSTREAM_L3',
        reason: 'Current Stage A working parent; global taxonomy review remains pending.' };
    }
    fs.writeFileSync(inputPath, input.map(row => JSON.stringify(row)).join('\n') + '\n');
    const targetAuthority = path.join(folder, 'authority/H1_QDISC_L4_AUTHORITY_NO_UID.json');
    fs.copyFileSync(authorityFile, targetAuthority);
    manifest.inputSha256 = sha(fs.readFileSync(inputPath));
    manifest.boundaryAuthorityFile = 'authority/H1_QDISC_L4_AUTHORITY_NO_UID.json';
    manifest.boundaryAuthoritySha256 = sha(fs.readFileSync(targetAuthority));
    manifest.currentWorkingL3Visible = true;
    manifest.oldL4AssignmentVisible = false;
    manifest.forbiddenContent.push('UID-specific old L4 candidates and verdicts');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    results.push({ side, batch: batch + 1, count: 20, inputSha256: manifest.inputSha256,
      authoritySha256: manifest.boundaryAuthoritySha256, assets: manifest.assets.length, folder });
  }
}
for (let i = 0; i < 4; i++) if (results[i].inputSha256 !== results[i + 4].inputSha256)
  throw new Error(`A/B qdisc batch${i + 1} input mismatch`);
const summary = { schemaVersion: 1, status: 'BLIND_INPUTS_PREPARED_NOT_REVIEWED',
  parentProblemTypeKey: parentKey, currentFamilyCount: 82, passWorkScope: 80,
  sourceOrSolutionHeldQueueIndexes: [38, 620], batchCount: 4,
  oldUidSpecificL4Visible: false, activeCanonicalPromotion: false, l4Final: false,
  bundles: results };
fs.writeFileSync(path.join(out, 'H1_QDISC_L4_PREPARATION_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ currentFamilyCount: 82, passWorkScope: 80, heldQueueIndexes: [38, 620],
  aBEqualInputShaByBatch: results.slice(0, 4).map(row => row.inputSha256), l4Final: false }, null, 2));
