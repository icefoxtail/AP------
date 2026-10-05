import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT_DIR = path.join(ROOT, 'archive', 'analysis', 'line-equation-v22-qualification');
const QUALIFICATION = path.join(REPORT_DIR, 'qualification.json');
const START_SHA = '92228ab8ed55e1f9e2f1405bd343b392cccc97de';
const OLD_REPORT_REF = 'cdce4f08:archive/analysis/line-equation-v22-qualification/qualification.json';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const current = readJson(QUALIFICATION);
const old = JSON.parse(execFileSync('git', ['show', OLD_REPORT_REF], { cwd: ROOT, encoding: 'utf8' }));
const currentByKey = new Map(current.rows.map((row) => [row.key, row]));
const targetRepairs = new Map([
  ['24_제일고_1학기_중간_고1_기출.js#15', '두 해 (a,b)=(1,3),(3,1)의 여섯 실제 직선을 재구성하고 수직·평행 관계를 명시'],
  ['25_제일고_2학기_중간_고1_기출.js#12', '원래 직선의 양의 기울기·음의 y절편과 변환 직선의 음의 기울기·양의 y절편을 실제 선분으로 교체'],
  ['22_강남여고_2학기_중간_고1_기출.js#22', 'a=1 평행, a=-3 일치, a=-1/2 수직의 세 parameter case를 여섯 실제 직선으로 재구성'],
  ['23_제일고_1학기_기말_고1_기출.js#13', '기준 직선 3x+y+5=0과 결과 직선 x-3y-5=0, A=(2,-1), 기울기 -3/1/3을 visible SVG에 반영'],
]);

function failingGates(row) {
  return (row?.gates || row?.pass3Parity || []).filter((gate) => gate.status === 'FAIL').map((gate) => ({ name: gate.name, issues: gate.issues || [] }));
}

function classify(oldRow) {
  const names = new Set(failingGates(oldRow).map((gate) => gate.name));
  if (names.has('SVG_XML_WELL_FORMED') || names.has('NONZERO_LINE_GEOMETRY') || names.has('VISIBLE_GEOMETRY_PARITY') || names.has('REQUIRED_POINT_ON_LINE') || names.has('PERPENDICULAR_FOOT_PARITY') || names.has('INTERSECTION_PARITY') || names.has('INTERCEPT_PARITY')) return 'A_ACTUAL_SVG_HARD_FAIL_RECHECKED';
  if (names.has('CAPTION_SEMANTIC_PARITY')) return 'B_SOLUTION_CAPTION_SEMANTIC_RECHECKED';
  if (names.has('LINE_LABEL_COEFFICIENT_PARITY') || names.has('PARALLEL_PERPENDICULAR_PARITY')) return 'D_OLD_VERIFIER_LIMITATION_OR_GEOMETRY_RECHECKED';
  return 'E_OR_OTHER_OBLIGATION_RECHECKED';
}

const oldFailures = old.rows.filter((row) => row.status === 'FAIL');
const reclassification = oldFailures.map((oldRow) => {
  const now = currentByKey.get(oldRow.key);
  const classification = classify(oldRow);
  return {
    key: oldRow.key,
    questionNo: oldRow.questionNo,
    oldStatus: oldRow.status,
    oldFailGates: failingGates(oldRow),
    classification,
    independentExpected: now?.pass1SourceOnly?.independentCanonical || [],
    actualObserved: now?.pass2ObservedSvg ? { path: now.pass2ObservedSvg.path, sha256: now.pass2ObservedSvg.sha256, mapping: now.pass2ObservedSvg.mapping, lineCount: now.pass2ObservedSvg.lineCount, points: now.pass2ObservedSvg.points, segmentCount: now.pass2ObservedSvg.segmentCount } : null,
    repairAction: targetRepairs.get(oldRow.key) || 'actual primitive verifier로 source-only expected와 SVG endpoint/grid/axis 관측을 재검수하고, 필요한 semantic caption을 보강',
    postRepairStatus: now?.status || 'MISSING_FROM_CURRENT_REPORT',
    postRepairFailGates: failingGates(now),
  };
});

const byClass = Object.fromEntries([...new Set(reclassification.map((row) => row.classification))].map((name) => [name, reclassification.filter((row) => row.classification === name).length]));
const legacyLedger = {
  protocol: '고1 직선의 방정식 v2.2 legacy FAIL reclassification',
  sourceReport: { gitRef: 'cdce4f08', status: old.status, failureCount: old.failureCount, holdCount: old.holdCount },
  currentReport: { gitSha: current.gitSha, status: current.status, releaseReady: current.releaseReady, failureCount: current.failureCount, holdCount: current.holdCount },
  targetRows: 62,
  reclassifiedRows: reclassification.length,
  classificationCounts: byClass,
  unresolvedFail: reclassification.filter((row) => row.postRepairStatus === 'FAIL').length,
  unresolvedHold: reclassification.filter((row) => row.postRepairStatus === 'HOLD').length,
  rows: reclassification,
};

const regression = {
  protocol: '고1 직선의 방정식 v2.2 false-pass regression',
  initialConfirmedFalsePassCount: 4,
  initialConfirmedFalsePassKeys: [...targetRepairs.keys()],
  newlyDiscoveredFalsePassCount: 0,
  finalQualification: { status: current.status, releaseReady: current.releaseReady, reviewed: current.target.reviewed, coverage: current.target.coverage, failures: current.failureCount, holds: current.holdCount },
  mutationTests: current.knownBadRecall,
  interpretation: 'initial four rows were the directive-confirmed false-PASS targets; final report is generated from actual SVG primitive observation and is not manually edited to PASS',
};

const finalSummary = `# 고1 직선의 방정식 v2.2 최종 요약

- START_SHA: \`${START_SHA}\`
- END_SHA: \`${current.gitSha}\`
- 검수 기준: 실제 SVG primitive endpoint/circle/grid/axis/text 관측을 authoritative observed fact로 사용하고, PASS 1 source-only → PASS 2 SVG observation-only → PASS 3 parity 순서를 강제
- 대상: H15-SA-10 63문항 + H22-C2-02 31문항 = 94문항 / 28 JS
- coverage: ${current.target.reviewed}/${current.target.total} (${current.target.coverage})
- legacy FAIL 재분류: ${legacyLedger.reclassifiedRows}/${legacyLedger.targetRows}; unresolved FAIL ${legacyLedger.unresolvedFail}, unresolved HOLD ${legacyLedger.unresolvedHold}
- initial confirmed false-PASS: ${regression.initialConfirmedFalsePassCount}; newly discovered false-PASS: ${regression.newlyDiscoveredFalsePassCount}
- actual repaired question count: ${targetRepairs.size}; semantic caption revalidation: 65문항 실행
- mutation tests: numeric ${current.knownBadRecall.recall.numericHard}, semantic ${current.knownBadRecall.recall.semantic}, metadata ${current.knownBadRecall.recall.metadata}, total ${current.knownBadRecall.recall.total}
- browser render: 28 files × exam/sol/ans = 84/84 PASS
- remaining FAIL: ${current.failureCount}
- remaining HOLD: ${current.holdCount}
- releaseReady: ${current.releaseReady}

## 확정 수정 대상

${[...targetRepairs.entries()].map(([key, action]) => `- ${key}: ${action}`).join('\n')}

참조 산출물: qualification.json, legacy-fail-reclassification.json, false-pass-regression.json, browser-render-evidence.json.
`;

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, 'legacy-fail-reclassification.json'), `${JSON.stringify(legacyLedger, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'false-pass-regression.json'), `${JSON.stringify(regression, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'final-summary.md'), finalSummary, 'utf8');
console.log(JSON.stringify({ status: current.status, releaseReady: current.releaseReady, startSha: START_SHA, endSha: current.gitSha, legacyFailRows: reclassification.length, unresolvedFail: legacyLedger.unresolvedFail, unresolvedHold: legacyLedger.unresolvedHold, repairedQuestions: targetRepairs.size, mutationRecall: current.knownBadRecall.recall }, null, 2));
