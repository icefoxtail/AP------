#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateSolutionCalibrationPreflight } from './solution-calibration-gate.mjs';

const hash = value => 'sha256:' + crypto.createHash('sha256').update(value).digest('hex');
const blobHash = value => {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes])).digest('hex');
};
const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'calibration-preflight-'));
const examFile = path.join(temp, 'target.js');
fs.writeFileSync(examFile, 'window.examTitle="target";window.questionBank=[{"id":1,"content":"x=1","choices":["1"],"answer":"①","solution":"x=1이다."}];\n');
const questions = [{ id: 1, content: 'x=1', choices: ['1'], answer: '①', solution: 'x=1이다.' }];
const goldenPaths = [
  'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',
  'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',
];
const negativePath = 'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
function boundRef(rel) {
  const bytes = fs.readFileSync(path.join(root, rel));
  return { path: rel, sha256: hash(bytes), gitBlobSha: blobHash(bytes) };
}
function parseBank(rel) {
  const box = { window: {} };
  new Function('window', fs.readFileSync(path.join(root, rel), 'utf8'))(box.window);
  return box.window.questionBank;
}
function calibration(stage) {
  const goldenSampleQuestionRefs = [];
  for (const rel of goldenPaths) {
    for (const q of parseBank(rel).slice(0, 2)) {
      const solution = String(q.solution);
      goldenSampleQuestionRefs.push({
        path: rel,
        qid: q.id,
        solutionSha256: hash(solution),
        solutionExcerpt: solution.slice(0, Math.min(solution.length, 80)),
        observation: 'solution and visual-quality structure read before target work',
      });
    }
  }
  const repair = ['REPAIR', 'R3_REPAIR', 'ITEM_RECOVERY', 'VISUAL_REPAIR'].includes(stage);
  return {
    solutionQualityCalibration: {
      goldenSampleRefs: goldenPaths.map(boundRef),
      goldenSampleQuestionRefs,
      negativeSampleRefs: [boundRef(negativePath)],
      calibrationAxes: [
        'STUDENT_REPRODUCIBILITY',
        'SMALL_BOARD_STRUCTURE',
        'EXPLANATION_DENSITY',
        'VISUAL_SEMANTIC_PARITY',
        'VISUAL_READABILITY',
      ],
      sampleReadBeforeWork: true,
      calibrationStatus: 'PASS',
      solutionWorkMode: repair ? 'TARGETED_REPAIR' : stage === 'INDEPENDENT_RECHECK' ? 'INDEPENDENT_RECHECK' : 'INDEPENDENT_REVIEW',
      calibrationOrder: repair ? 'SAMPLES_PREFLIGHT_THEN_DEFECT_SCOPE_FREEZE_THEN_REPAIR' : 'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE',
    },
  };
}
for (const stage of ['REPAIR', 'R3_REPAIR', 'ITEM_RECOVERY', 'VISUAL_REPAIR', 'INDEPENDENT_RECHECK']) {
  const report = validateSolutionCalibrationPreflight({ examFile, questions, evidence: calibration(stage), stage });
  assert.deepEqual(report, [], stage + ': ' + report.join('\n'));
}
const noVisualAxis = calibration('REPAIR');
noVisualAxis.solutionQualityCalibration.calibrationAxes =
  noVisualAxis.solutionQualityCalibration.calibrationAxes.filter(x => x !== 'VISUAL_READABILITY');
assert(validateSolutionCalibrationPreflight({ examFile, questions, evidence: noVisualAxis, stage: 'REPAIR' })
  .includes('CALIBRATION_AXIS_REQUIRED:VISUAL_READABILITY'));
const staleExcerpt = calibration('ITEM_RECOVERY');
staleExcerpt.solutionQualityCalibration.goldenSampleQuestionRefs[0].solutionExcerpt = 'definitely-not-in-golden-solution';
assert(validateSolutionCalibrationPreflight({ examFile, questions, evidence: staleExcerpt, stage: 'ITEM_RECOVERY' })
  .some(x => x.startsWith('GOLDEN_SAMPLE_SOLUTION_EXCERPT_MISSING_OR_STALE')));
const wrongMode = calibration('VISUAL_REPAIR');
wrongMode.solutionQualityCalibration.solutionWorkMode = 'INDEPENDENT_REVIEW';
assert(validateSolutionCalibrationPreflight({ examFile, questions, evidence: wrongMode, stage: 'VISUAL_REPAIR' })
  .includes('CALIBRATION_WORK_MODE_INVALID:VISUAL_REPAIR'));

console.log('solution-calibration-gate.test.mjs PASS');
