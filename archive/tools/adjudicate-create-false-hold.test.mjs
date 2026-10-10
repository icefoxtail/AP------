#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyFalseHoldAdjudication } from './adjudicate-create-false-hold.mjs';
import { validatePhysicalEvidence } from './review-evidence-gate.mjs';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'create-false-hold-'));
fs.mkdirSync(path.join(temp, '.git'));
const exam = 'archive/exams/original/middle/m2/1final/24_금당중_1학기_기말_중2_기출.js';
const evidence = 'archive/data/r2e-intake/m2/24_금당중_1학기_기말_중2_기출.create.physical-evidence.json';
const base = 'archive/analysis/r1-source-refresh-20261010/24_금당중_1학기_기말_중2_기출';
const adjudication = `${base}/q24-CREATE-false-hold-adjudication.json`;
const adjudicationV2 = `${base}/q24-CREATE-false-hold-adjudication.v2.json`;
const visualPhysical = `${base}/q24-solution-svg-physical-evidence.json`;
const r3VisualReview = `${base}/R3-q24-target/R3-q24-displayfix-v2-sol-review.json`;
const solutionSvg = 'archive/assets/images/24_금당중_1학기_기말_중2_기출/q24-solution.svg';
const deltaManifest = `${base}/q24-only-source-delta-manifest.v2.json`;
const copy = rel => {
  const target = path.join(temp, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(sourceRoot, rel), target);
};
for (const rel of [exam, evidence, adjudication, `${base}/q24-SOURCE_HOLD.json`, `${base}/fresh-original-freeze.json`,
  'archive/assets/images/24_금당중_1학기_기말_중2_기출/q24.png',
  'archive/data/r2e-intake/m2/source-refresh-receipts/24_금당중_1학기_기말_중2_기출.e5244fadc8814dae986c7363ace83e6dbd693aaae68cbdda99ba4173522169a0.json']) copy(rel);
const tempExamFile = path.join(temp, exam);
const currentExamText = fs.readFileSync(tempExamFile, 'utf8');
const displayBlock = [
  '    "solutionImage": "assets/images/24_금당중_1학기_기말_중2_기출/q24-solution.svg",',
  '    "solutionImageSize": "full",',
  '    "solutionImageLayout": "fullwidth",',
].join('\n') + '\n';
assert.equal(currentExamText.split(displayBlock).length - 1, 1);
fs.writeFileSync(tempExamFile, currentExamText.replace(displayBlock, ''));
const baselinePhysical = JSON.parse(fs.readFileSync(path.join(temp, evidence), 'utf8'));
baselinePhysical.examSha256 = 'sha256:53a9333ebf9caab43f4accb346fa5fdedcb67c091e7f5ae205ad24c807814a56';
baselinePhysical.finalArtifactGitBlob = '8adf111c4e5ebc57a61c7f4ff3cd1e2b6e38f1a6';
baselinePhysical.visualRows = (baselinePhysical.visualRows || []).filter(row => Number(row.qid) !== 24);
baselinePhysical.summary.linkedSolutionVisualCount = baselinePhysical.visualRows.length;
baselinePhysical.summary.visualEvidenceRows = baselinePhysical.visualRows.length;
fs.writeFileSync(path.join(temp, evidence), JSON.stringify(baselinePhysical, null, 2) + '\n');
const originalEvidence = JSON.parse(fs.readFileSync(path.join(temp, evidence), 'utf8'));
for (const ref of [...(originalEvidence.solutionQualityCalibration?.goldenSampleRefs || []), ...(originalEvidence.solutionQualityCalibration?.negativeSampleRefs || [])]) copy(ref.path);

function restoreHeldEvidence() {
  const file = path.join(temp, evidence), object = JSON.parse(fs.readFileSync(file, 'utf8'));
  const q24 = object.questionRows.find(row => row.qid === 24);
  const old = object.falseHoldAdjudicationHistory?.find(row => row.qid === 24);
  if (old) { q24.sourceExact = old.sourceExact; q24.solutionMath = old.solutionMath; }
  else {
    q24.sourceExact.status = 'HOLD';
    q24.solutionMath.status = 'HOLD';
  }
  delete q24.sourceExactAdjudicationRef;
  delete q24.solutionMathAdjudicationRef;
  delete object.falseHoldAdjudications;
  delete object.falseHoldAdjudicationHistory;
  object.summary.itemHoldCount = 1;
  fs.writeFileSync(file, JSON.stringify(object, null, 2) + '\n');
}
restoreHeldEvidence();

const args = { root: temp, exam, evidence, adjudication };
const decisionFile = path.join(temp, adjudication);
const dry = applyFalseHoldAdjudication({ ...args, mode: 'dry-run' });
assert.equal(dry.itemHoldCount, 0);
assert.equal(dry.entry.durableReceiptCopy?.parity ?? null, null);
const write = applyFalseHoldAdjudication({ ...args, mode: 'write' });
assert.equal(write.itemHoldCount, 0);
const stored = JSON.parse(fs.readFileSync(path.join(temp, evidence), 'utf8'));
const q24 = stored.questionRows.find(row => row.qid === 24);
assert.equal(q24.sourceExact.status, 'PASS');
assert.equal(q24.solutionMath.status, 'PASS');
assert.equal(stored.falseHoldAdjudicationHistory[0].sourceExact.status, 'HOLD');
assert.equal(stored.falseHoldAdjudicationHistory[0].solutionMath.status, 'HOLD');
assert.equal(applyFalseHoldAdjudication({ ...args, mode: 'check' }).disposition, 'CHECK_PASS_QID_SCOPED_FALSE_HOLD_ADJUDICATION');
const gate = validatePhysicalEvidence({ examFile: path.join(temp, exam), evidenceFile: path.join(temp, evidence), stage: 'CREATE' });
assert.equal(gate.ok, true, JSON.stringify(gate));
assert.equal(gate.itemHoldCount, 0);
assert.throws(() => applyFalseHoldAdjudication({ ...args, mode: 'write' }), /FALSE_HOLD_NOT_CURRENTLY_HELD|Q24_FALSE_HOLD_ALREADY_ADJUDICATED/);

const gateDecision = JSON.parse(fs.readFileSync(decisionFile, 'utf8'));
gateDecision.sourceBinding.rawSha256 = '0'.repeat(64);
fs.writeFileSync(decisionFile, JSON.stringify(gateDecision));
const tamperedGate = validatePhysicalEvidence({ examFile: path.join(temp, exam), evidenceFile: path.join(temp, evidence), stage: 'CREATE' });
assert.equal(tamperedGate.ok, false);
assert(tamperedGate.issues.includes('FALSE_HOLD_ADJUDICATION_SHA_MISMATCH:q24'));

const restore = () => copy(adjudication);
const decision = JSON.parse(fs.readFileSync(decisionFile, 'utf8'));
decision.sourceBinding.rawSha256 = '0'.repeat(64);
fs.writeFileSync(decisionFile, JSON.stringify(decision));
assert.throws(() => applyFalseHoldAdjudication({ ...args, mode: 'dry-run' }), /CURRENT_SOURCE_SHA_MISMATCH/);
restore();

const holdDecision = JSON.parse(fs.readFileSync(decisionFile, 'utf8'));
holdDecision.status = 'SOURCE_HOLD';
fs.writeFileSync(decisionFile, JSON.stringify(holdDecision));
restoreHeldEvidence();
assert.throws(() => applyFalseHoldAdjudication({ ...args, mode: 'dry-run' }), /ADJUDICATION_SCOPE_INVALID/);
const stillHeld = JSON.parse(fs.readFileSync(path.join(temp, evidence), 'utf8'));
assert.equal(stillHeld.questionRows.find(row => row.qid === 24).sourceExact.status, 'HOLD');
restore();

const missingArgs = { ...args, adjudication: 'archive/analysis/missing-false-hold.json' };
assert.throws(() => applyFalseHoldAdjudication({ ...missingArgs, mode: 'dry-run' }));

const holdFile = path.join(temp, `${base}/q24-SOURCE_HOLD.json`);
fs.appendFileSync(holdFile, 'tampered');
assert.throws(() => applyFalseHoldAdjudication({ ...args, mode: 'dry-run' }), /ORIGINAL_HOLD_BINDING_MISMATCH/);

// Strict q24-only supersession: retain the prior HOLD/freeze entry and v1 receipt chain while rebinding current bytes.
const temp2 = fs.mkdtempSync(path.join(os.tmpdir(), 'create-false-hold-v2-'));
fs.mkdirSync(path.join(temp2, '.git'));
const copy2 = rel => {
  const target = path.join(temp2, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(sourceRoot, rel), target);
};
for (const rel of [exam, evidence, adjudication, adjudicationV2, deltaManifest, visualPhysical, r3VisualReview, `${base}/q24-SOURCE_HOLD.json`, `${base}/fresh-original-freeze.json`,
  'archive/assets/images/24_금당중_1학기_기말_중2_기출/q24.png', solutionSvg,
  'archive/data/r2e-intake/m2/source-refresh-receipts/24_금당중_1학기_기말_중2_기출.e5244fadc8814dae986c7363ace83e6dbd693aaae68cbdda99ba4173522169a0.json']) copy2(rel);
const beforeV2 = JSON.parse(fs.readFileSync(path.join(temp2, evidence), 'utf8'));
// Reconstruct the official pre-v2 physical state so this fixture exercises the v1→v2 write, even if ROOT has already applied v2 in the shared checkout.
const seededV2Entry = beforeV2.falseHoldAdjudications.find(row => row.qid === 24);
assert(seededV2Entry?.supersededAdjudication?.path === adjudication);
const seededV1Sha = seededV2Entry.supersededAdjudication.sha256;
Object.assign(seededV2Entry, { adjudicationPath: adjudication, adjudicationSha256: seededV1Sha, currentSourceSha256: '53a9333ebf9caab43f4accb346fa5fdedcb67c091e7f5ae205ad24c807814a56' });
delete seededV2Entry.supersededAdjudication;
beforeV2.questionRows.find(row => row.qid === 24).sourceExactAdjudicationRef = { path: adjudication, sha256: seededV1Sha, qid: 24 };
beforeV2.questionRows.find(row => row.qid === 24).solutionMathAdjudicationRef = { path: adjudication, sha256: seededV1Sha, qid: 24 };
beforeV2.examSha256 = 'sha256:53a9333ebf9caab43f4accb346fa5fdedcb67c091e7f5ae205ad24c807814a56';
beforeV2.finalArtifactGitBlob = '8adf111c4e5ebc57a61c7f4ff3cd1e2b6e38f1a6';
beforeV2.visualRows = (beforeV2.visualRows || []).filter(row => Number(row.qid) !== 24);
beforeV2.summary.linkedSolutionVisualCount = beforeV2.visualRows.length;
beforeV2.summary.visualEvidenceRows = beforeV2.visualRows.length;
fs.writeFileSync(path.join(temp2, evidence), JSON.stringify(beforeV2, null, 2) + '\n');
for (const ref of [...(beforeV2.solutionQualityCalibration?.goldenSampleRefs || []), ...(beforeV2.solutionQualityCalibration?.negativeSampleRefs || [])]) copy2(ref.path);
const v2args = { root: temp2, exam, evidence, adjudication: adjudicationV2 };
const originalV1Entry = beforeV2.falseHoldAdjudications.find(row => row.qid === 24);
const originalHoldHistory = JSON.stringify(beforeV2.falseHoldAdjudicationHistory);
const nonTargetVisualRowsBefore = JSON.stringify(beforeV2.visualRows.filter(row => Number(row.qid) !== 24));
const v2Dry = applyFalseHoldAdjudication({ ...v2args, mode: 'dry-run' });
assert.equal(v2Dry.itemHoldCount, 0);
assert.equal(v2Dry.disposition, 'DRY_RUN_QID_SCOPED_FALSE_HOLD_ADJUDICATION');
assert.equal(v2Dry.entry.supersededAdjudication.sha256, originalV1Entry.adjudicationSha256);
assert.equal(v2Dry.entry.currentSourceSha256, 'c05cd9d6990d680f3268228245417aa5ac33e8abfbb0e0dc083df0830118598b');
assert.equal(JSON.stringify(JSON.parse(fs.readFileSync(path.join(temp2, evidence), 'utf8'))), JSON.stringify(beforeV2));
const v2Write = applyFalseHoldAdjudication({ ...v2args, mode: 'write' });
assert.equal(v2Write.disposition, 'WRITE_QID_SCOPED_FALSE_HOLD_SUPERSESSION');
const afterV2 = JSON.parse(fs.readFileSync(path.join(temp2, evidence), 'utf8'));
assert.equal(afterV2.examSha256, 'sha256:c05cd9d6990d680f3268228245417aa5ac33e8abfbb0e0dc083df0830118598b');
assert.equal(afterV2.finalArtifactGitBlob, 'b862003aab287515b6cf007f9ec74bb7ebe09573');
assert.equal(afterV2.falseHoldAdjudications.length, beforeV2.falseHoldAdjudications.length);
assert.equal(afterV2.falseHoldAdjudications.find(row => row.qid === 24).supersededAdjudication.sha256, originalV1Entry.adjudicationSha256);
assert.deepEqual(afterV2.falseHoldAdjudications.find(row => row.qid === 24).supersededAdjudication.v1PhysicalEntryHistory.durableReceiptCopy, originalV1Entry.durableReceiptCopy);
assert.equal(afterV2.falseHoldAdjudications.find(row => row.qid === 24).durableReceiptCopy, null);
assert.equal(JSON.stringify(afterV2.falseHoldAdjudicationHistory), originalHoldHistory);
assert.equal(afterV2.questionRows.find(row => row.qid === 24).sourceExactAdjudicationRef.path, adjudicationV2);
assert.equal(afterV2.questionRows.find(row => row.qid === 24).solutionMathAdjudicationRef.path, adjudicationV2);
assert.equal(afterV2.summary.itemHoldCount, 0);
const visualRow = afterV2.visualRows.find(row => row.qid === 24);
assert.equal(visualRow.result, 'PASS');
assert.equal(visualRow.assetPath, 'assets/images/24_금당중_1학기_기말_중2_기출/q24-solution.svg');
assert.equal(visualRow.assetSha256, 'sha256:271eac5b5998cb6f4181341afe61a77e82cdd3903733d09d4fa23d7fdb373d12');
assert(visualRow.expectedFacts.length > 0 && visualRow.observedFacts.length > 0);
assert.deepEqual(visualRow.checks.map(check => check.method), ['TOPOLOGY_COMPUTE', 'TARGETED_RENDER']);
assert.equal(afterV2.summary.linkedSolutionVisualCount, 1);
assert.equal(afterV2.summary.visualEvidenceRows, 1);
assert.equal(JSON.stringify(afterV2.visualRows.filter(row => Number(row.qid) !== 24)), nonTargetVisualRowsBefore);
assert.equal(applyFalseHoldAdjudication({ ...v2args, mode: 'check' }).disposition, 'CHECK_PASS_QID_SCOPED_FALSE_HOLD_ADJUDICATION');
const gateV2 = validatePhysicalEvidence({ examFile: path.join(temp2, exam), evidenceFile: path.join(temp2, evidence), stage: 'CREATE' });
assert.equal(gateV2.ok, true, JSON.stringify(gateV2));
assert.equal(gateV2.ok, true, JSON.stringify(gateV2));
assert.equal(gateV2.itemHoldCount, 0);
assert.deepEqual(gateV2.itemHoldQids, []);
assert.equal(gateV2.linkedSolutionVisualCount, 1);
assert.equal(gateV2.visualEvidenceRows, 1);
assert(!gateV2.issues.includes('VISUAL_ROW_MISSING:q24'));
assert(!gateV2.issues.includes('SUMMARY_COUNT_MISMATCH:linkedSolutionVisualCount'));
assert(!gateV2.issues.includes('SUMMARY_COUNT_MISMATCH:visualEvidenceRows'));

// The shared checkout may already contain an older v2 bind without this visual row; prove the same writer repairs that exact missing locus.
const legacyV2 = JSON.parse(fs.readFileSync(path.join(temp2, evidence), 'utf8'));
legacyV2.visualRows = legacyV2.visualRows.filter(row => Number(row.qid) !== 24);
legacyV2.summary.linkedSolutionVisualCount = legacyV2.visualRows.length;
legacyV2.summary.visualEvidenceRows = legacyV2.visualRows.length;
const legacyEntry = legacyV2.falseHoldAdjudications.find(row => Number(row.qid) === 24);
legacyEntry.durableReceiptCopy = originalV1Entry.durableReceiptCopy;
delete legacyEntry.supersededAdjudication.v1PhysicalEntryHistory;
fs.writeFileSync(path.join(temp2, evidence), JSON.stringify(legacyV2, null, 2) + '\n');
const repairV2 = applyFalseHoldAdjudication({ ...v2args, mode: 'write' });
assert.equal(repairV2.disposition, 'WRITE_QID_SCOPED_FALSE_HOLD_SUPERSESSION');
const repairedEvidence = JSON.parse(fs.readFileSync(path.join(temp2, evidence), 'utf8'));
assert.equal(repairedEvidence.visualRows.find(row => Number(row.qid) === 24).assetSha256, 'sha256:271eac5b5998cb6f4181341afe61a77e82cdd3903733d09d4fa23d7fdb373d12');
assert.equal(repairedEvidence.falseHoldAdjudications.find(row => Number(row.qid) === 24).durableReceiptCopy, null);
assert.equal(validatePhysicalEvidence({ examFile: path.join(temp2, exam), evidenceFile: path.join(temp2, evidence), stage: 'CREATE' }).ok, true);

const v2DecisionFile = path.join(temp2, adjudicationV2);
const goodV2 = fs.readFileSync(v2DecisionFile);
const tamperedSupersedes = JSON.parse(goodV2.toString('utf8'));
tamperedSupersedes.supersedes.sha256 = '0'.repeat(64);
fs.writeFileSync(v2DecisionFile, JSON.stringify(tamperedSupersedes));
assert.throws(() => applyFalseHoldAdjudication({ ...v2args, mode: 'dry-run' }), /SUPERSEDES_V1_PATH_OR_SHA_MISMATCH/);
fs.writeFileSync(v2DecisionFile, goodV2);
const v2ManifestFile = path.join(temp2, deltaManifest);
const goodManifest = fs.readFileSync(v2ManifestFile);
const tamperedManifest = JSON.parse(goodManifest.toString('utf8'));
tamperedManifest.displayFields.changedFields = ['solutionImage'];
fs.writeFileSync(v2ManifestFile, JSON.stringify(tamperedManifest));
assert.throws(() => applyFalseHoldAdjudication({ ...v2args, mode: 'dry-run' }), /Q24_DELTA_MANIFEST_SHA_MISMATCH/);
fs.writeFileSync(v2ManifestFile, goodManifest);
const svgFile = path.join(temp2, solutionSvg);
const goodSvg = fs.readFileSync(svgFile);
fs.appendFileSync(svgFile, '\n');
assert.throws(() => applyFalseHoldAdjudication({ ...v2args, mode: 'dry-run' }), /Q24_SOLUTION_SVG_SHA_MISMATCH/);
fs.writeFileSync(svgFile, goodSvg);

console.log('adjudicate-create-false-hold.test.mjs PASS');
