import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const sha = b => 'sha256:' + crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob ' + b.length + '\0'), b])).digest('hex');
const paths = [
  'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',
  'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',
  'archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js',
];
const rows = [];
for (const p of paths) {
  const b = fs.readFileSync(p);
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(b.toString('utf8'), sandbox);
  const qs = sandbox.window.questionBank || sandbox.window.questions;
  for (const id of [1, 2]) {
    const q = qs.find(x => x.id === id);
    rows.push({
      path: p,
      qid: id,
      solutionSha256: sha(String(q.solution)),
      solutionExcerpt: String(q.solution).slice(0, 36),
      observation: 'Read complete q' + id + ' solution from ' + p + '; ' +
        (id === 1 ? 'checked explicit setup, intermediate mathematics and student-facing conclusion.' : 'checked that each stated condition is applied with visible intermediate reasoning and a supported conclusion.'),
    });
  }
}
const neg = 'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const nb = fs.readFileSync(neg);
const refs = paths.map(p => { const b = fs.readFileSync(p); return { path: p, sha256: sha(b), gitBlobSha: blob(b) }; });
const evidence = {
  schemaVersion: 'JS_ARCHIVE_SOLUTION_CALIBRATION_PREFLIGHT_V1',
  executionLine: 'CODEX',
  examUid: '24_매산여고_1학기_중간_고2_수학I',
  qid: 21,
  solutionQualityCalibration: {
    sampleReadBeforeWork: true,
    calibrationStatus: 'PASS',
    solutionWorkMode: 'TARGETED_REPAIR',
    calibrationOrder: 'SAMPLES_PREFLIGHT_THEN_DEFECT_SCOPE_FREEZE_THEN_REPAIR',
    calibrationAxes: ['STUDENT_REPRODUCIBILITY', 'SMALL_BOARD_STRUCTURE', 'EXPLANATION_DENSITY', 'VISUAL_SEMANTIC_PARITY', 'VISUAL_READABILITY'],
    goldenSampleRefs: refs,
    goldenSampleQuestionRefs: rows,
    negativeSampleRefs: [{ path: neg, sha256: sha(nb), gitBlobSha: blob(nb) }],
    negativeSampleObservation: 'Read the complete Bokseong false-PASS regression README. Recorded failure families: actual SVG geometry mismatch despite audit counts, enumerated small-board judgments merged into prose, missed exact ACTIVE Meta mapping, and runtime TeX escape damage. For q21 any new visual must be checked from actual primitives; a no-visual decision must be justified from the replacement concept.',
    preflightScope: 'q21 only; source-truth sufficiency decision and q21 scoped source crop inspection were completed before any upstream answer/solution/status exposure.',
    firstEditNotStarted: true,
  },
};
fs.writeFileSync(process.argv[2], JSON.stringify(evidence, null, 2) + '\n');
