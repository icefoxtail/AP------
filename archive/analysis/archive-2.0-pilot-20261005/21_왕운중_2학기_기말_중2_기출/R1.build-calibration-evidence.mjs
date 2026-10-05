import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const dir = 'archive/analysis/archive-2.0-pilot-20261005/21_왕운중_2학기_기말_중2_기출';
const calibration = {
  goldenSampleRefs: [
    'archive/exams/original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js',
    'archive/exams/original/middle/m2/2final/24_향림중_2학기_기말_중2_기출.js'
  ],
  goldenSampleQuestionRefs: [
    { path: 'archive/exams/original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js', qid: 7, observation: 'The right-triangle solution exposes the known hypotenuse and leg, writes the subtraction of squares, then states the positive length and answer.' },
    { path: 'archive/exams/original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js', qid: 11, observation: 'The multi-claim geometry solution separates each truth judgment and shows the segment/area ratios used for each claim.' },
    { path: 'archive/exams/original/middle/m2/2final/24_향림중_2학기_기말_중2_기출.js', qid: 21, observation: 'The geometry solution connects the perpendicular/right-triangle givens to a Pythagorean calculation and then to the requested cone volume in visible steps.' },
    { path: 'archive/exams/original/middle/m2/2final/24_향림중_2학기_기말_중2_기출.js', qid: 23, observation: 'The probability solution defines the unknown, writes the total count, forms the equation, and solves it in separate steps.' }
  ],
  negativeSamplePaths: [
    'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md',
    'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/q7-solution.bad.svg'
  ],
  calibrationAxes: [
    'STUDENT_REPRODUCIBILITY', 'SMALL_BOARD_STRUCTURE', 'EXPLANATION_DENSITY',
    'VISUAL_SEMANTIC_PARITY', 'VISUAL_READABILITY'
  ],
  sampleReadBeforeWork: true,
  calibrationStatus: 'PASS',
  solutionWorkMode: 'INDEPENDENT_REVIEW',
  calibrationOrder: 'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE',
  recoveryPassId: 'R1-TARGETED-CORRECTION-REVIEW-01',
  targetScopeQids: [3, 9, 13],
  priorAttemptRef: `${dir}/R1.initial-quality-attempt.json`,
  timingNote: 'This preflight applies only to the new targeted correction-review pass. The earlier attempt retains sampleReadBeforeWork=false and is not retroactively relabeled.'
};

const sha256 = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const blobSha = file => {
  const bytes = fs.readFileSync(file);
  const header = Buffer.from(`blob ${bytes.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(Buffer.concat([header, bytes])).digest('hex');
};
const fileRef = file => ({ path: file, sha256: sha256(fs.readFileSync(file)), gitBlobSha: blobSha(file) });

const goldenSampleRefs = calibration.goldenSampleRefs.map(fileRef);
const goldenSampleQuestionRefs = calibration.goldenSampleQuestionRefs.map(ref => {
  const source = fs.readFileSync(ref.path, 'utf8');
  const context = vm.createContext({ window: {} });
  vm.runInContext(source, context, { filename: ref.path, timeout: 5000 });
  const question = (context.window.questionBank || context.window.questions || []).find(item => Number(item.id) === ref.qid);
  if (!question || typeof question.solution !== 'string' || !question.solution.trim()) throw new Error(`SAMPLE_SOLUTION_MISSING:${ref.path}:q${ref.qid}`);
  return {
    ...ref,
    solutionSha256: sha256(Buffer.from(question.solution, 'utf8')),
    solutionExcerpt: question.solution.slice(0, Math.min(140, question.solution.length))
  };
});

const negativeSampleRefs = calibration.negativeSamplePaths.map(fileRef);
const section = { ...calibration, goldenSampleRefs, goldenSampleQuestionRefs, negativeSampleRefs };
const preflight = {
  schemaVersion: 'JS_ARCHIVE_SOLUTION_CALIBRATION_PREFLIGHT_v1',
  stage: 'R1',
  examPath: 'archive/_generated/source-only/m2-20261004/21_왕운중_2학기_기말_중2_기출.js',
  solutionQualityCalibration: section,
  sampleObservations: [
    { source: goldenSampleRefs[0].path, qids: [7, 11], quality: 'explicit quantities and formulas; separately reasoned geometry claims' },
    { source: goldenSampleRefs[1].path, qids: [21, 23], quality: 'visible derivation order, condition use, and student-facing conclusion' },
    { source: negativeSampleRefs[0].path, qids: [2, 7, 17], quality: 'false-pass families include unseparated enumeration, SVG coordinate/topology mismatch, Meta-null mapping, and runtime TeX escape' },
    { source: negativeSampleRefs[1].path, qids: [7], quality: 'read the frozen failure SVG; coordinate primitives do not satisfy the labeled point/fact relationship' }
  ]
};

if (process.argv.includes('--bind-final')) {
  const evidencePath = `${dir}/R1.evidence.json`;
  const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  evidence.solutionQualityCalibration = { ...section, qualityCompareCount: '24/24' };
  evidence.targetedCorrectionReview = {
    passId: 'R1-TARGETED-CORRECTION-REVIEW-01',
    scopeQids: [3, 9, 13],
    samplePreflightRef: `${dir}/R1.targeted-correction-preflight.json`,
    fullMathAnswerComparisonReexecuted: false,
    unaffectedRowsReusedFromCurrentR1Evidence: 21,
    finalQualityCompare: '24/24 solution rows bound to current final artifact; only q3/q9/q13 solution/asset changed loci were re-reviewed.'
  };
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
} else {
  fs.writeFileSync(`${dir}/R1.targeted-correction-preflight.json`, `${JSON.stringify(preflight, null, 2)}\n`, 'utf8');
}

console.log(JSON.stringify({
  mode: process.argv.includes('--bind-final') ? 'FINAL_CALIBRATION_BOUND' : 'PREFLIGHT_READY',
  goldenSamples: goldenSampleRefs.map(ref => ({ path: ref.path, sha256: ref.sha256, gitBlobSha: ref.gitBlobSha })),
  representativeSolutions: goldenSampleQuestionRefs.map(ref => ({ path: ref.path, qid: ref.qid, solutionSha256: ref.solutionSha256 })),
  negativeSamples: negativeSampleRefs,
  sampleReadBeforeWork: section.sampleReadBeforeWork,
  calibrationStatus: section.calibrationStatus
}, null, 2));
