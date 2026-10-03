const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const { spawnSync } = require('child_process');

const exam = 'archive/exams/original/middle/m3/1final/26_삼산중_1학기_기말_중3_기출.js';
const evidence = 'archive/data/r3-intake/m3/26_삼산중_1학기_기말_중3_기출.emergency-closeout.physical-evidence.json';
const sha256 = p => 'sha256:' + crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const expectedExamSha = 'sha256:5e93070b2ce1187ae22b7ebdbc441a698addab5e0a379ea64fb2ce11e1d5cf7c';
if (sha256(exam) !== expectedExamSha) {
  console.error('O26_FINAL_ARTIFACT_SHA_MISMATCH', sha256(exam));
  process.exit(1);
}

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(exam, 'utf8'), sandbox, { filename: exam });
const qb = sandbox.window.questionBank;
if (!Array.isArray(qb) || qb.length !== 24) {
  console.error('O26_LOADABILITY_FAIL');
  process.exit(1);
}
const q21 = qb.find(q => q.id === 21);
const q24 = qb.find(q => q.id === 24);
if (!q21 || !q24) process.exit(1);
if (q21.answer !== '(1) $x=\\dfrac{5}{3}$ 또는 $x=-\\dfrac{7}{2}$, (2) $x=2\\pm\\dfrac{\\sqrt{13}}{2}$') {
  console.error('O26_Q21_SOURCE_ANSWER_PARITY_FAIL');
  process.exit(1);
}
if (!q21.solution.includes('(3x-5)(2x+7)') || !q21.solution.includes('(x-2)^2=\\dfrac{13}{4}')) {
  console.error('O26_Q21_CHANGED_SCOPE_MATH_FAIL');
  process.exit(1);
}
if (q24.answer !== '(1) $b=-4a$, $c=4a-3$, (2) $a\\ge\\dfrac{3}{4}$') {
  console.error('O26_Q24_SOURCE_ANSWER_PARITY_FAIL');
  process.exit(1);
}
if (!q24.solution.includes('b=-4a,c=4a-3') || !q24.solution.includes('4a-3\\ge0') || !q24.solution.includes('a\\ge\\dfrac34')) {
  console.error('O26_Q24_CHANGED_SCOPE_MATH_FAIL');
  process.exit(1);
}

const ev = JSON.parse(fs.readFileSync(evidence, 'utf8'));
const m21 = ev.questionRows.find(r => r.qid === 21).meta;
const m24 = ev.questionRows.find(r => r.qid === 24).meta;
if (m21.status !== 'PASS' || m21.rpmRecordId !== 'M3-RPM-034' || !m21.crossConceptKeys.includes('CC_POLYNOMIAL_FACTORIZATION')) {
  console.error('O26_Q21_META_REPAIR_BINDING_FAIL');
  process.exit(1);
}
if (m24.status !== 'PASS' || m24.rpmRecordId !== 'M3-RPM-053' || !m24.crossConceptKeys.includes('CC_VERTEX') || !m24.conditionKeys.includes('COND_RANGE')) {
  console.error('O26_Q24_META_REPAIR_BINDING_FAIL');
  process.exit(1);
}
if (ev.summary.itemHoldCount !== 0 || ev.overallProtocolDisposition !== 'PASS') {
  console.error('O26_TARGETED_HOLD_CLOSURE_FAIL');
  process.exit(1);
}

const preflight = spawnSync(process.execPath, [
  'archive/tools/solution-calibration-gate.mjs',
  '--exam', exam,
  '--evidence', evidence,
  '--stage', 'R3',
  '--preflight',
  '--json'
], { cwd: process.cwd(), encoding: 'utf8' });
console.log('O26_R3_EMERGENCY_CLOSEOUT_CALIBRATION_PREFLIGHT');
if (preflight.stdout) process.stdout.write(preflight.stdout);
if (preflight.stderr) process.stderr.write(preflight.stderr);
if (preflight.status !== 0) process.exit(preflight.status || 1);

(async () => {
  const mod = await import('../archive/tools/review-evidence-gate.mjs');
  const report = mod.validatePhysicalEvidence({
    examFile: path.resolve(exam),
    evidenceFile: path.resolve(evidence),
    stage: 'R3'
  });
  console.log('O26_R3_EMERGENCY_CLOSEOUT_CANONICAL_GATE');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
  else console.log('O26_R3_EMERGENCY_CLOSEOUT_TARGET_PASS');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
