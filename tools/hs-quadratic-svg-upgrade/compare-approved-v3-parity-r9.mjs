import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '39_approved_source_only_v1_expected_facts_r9.json'), 'utf8'));
const V2 = JSON.parse(fs.readFileSync(path.join(REPORT, '43_approved_v2_artifact_only_r9.json'), 'utf8'));
const BANKS = JSON.parse(fs.readFileSync(path.join(REPORT, '41_approved_candidate_bank_manifest_r9.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '44_approved_v3_parity_r9.json');

function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function sourceFileFor(uid) { return uid.split('|')[0]; }
function qidFor(uid) { return Number(uid.split('|').at(-1)); }
function candidateQuestion(uid) {
  const sourcePath = sourceFileFor(uid); const file = BANKS.candidateFiles.find(item => item.sourcePath === sourcePath);
  if (!file) throw new Error(`candidate bank missing ${uid}`);
  const bank = load(file.candidatePath); const q = bank.questionBank.find(item => Number(item.id) === qidFor(uid));
  if (!q) throw new Error(`candidate question missing ${uid}`);
  return q;
}

function parityFor(row, observed, question) {
  const solution = String(question.solution ?? '');
  const expected = row.expectedFacts;
  if (row.id === 13) return {
    expectedObserved: expected.parameterCondition === observed.parameterCondition && expected.line.slope === observed.line.slope && expected.line.intercept === observed.line.intercept && expected.representativeIntersection.join(',') === observed.representativeIntersection.join(',') && expected.allNonzeroKIntersection === observed.allNonzeroKIntersection,
    solutionEvidence: /k\\ne0/.test(solution) && /a=1/.test(solution) && /b=-3/.test(solution) && /a\+b=-2/.test(solution),
    answerParity: question.answer === '②'
  };
  if (row.id === 17) return {
    expectedObserved: JSON.stringify(expected.exactThreeIntersectionRange) === JSON.stringify(observed.exactThreeIntersectionRange) && expected.maximum === observed.maximum && JSON.stringify(expected.intersectionCountByRegion) === JSON.stringify(observed.intersectionCountByRegion),
    solutionEvidence: /1<a<4/.test(solution) && /최댓값이 없다/.test(solution),
    answerParity: question.answer === '⑤' && question.choices?.at(-1) === '없다'
  };
  if (row.id === 19) return {
    expectedObserved: JSON.stringify(expected.horizontalLevels) === JSON.stringify(observed.horizontalLevels) && JSON.stringify(expected.sharedPoints) === JSON.stringify(observed.sharedPoints) && expected.sum === observed.sum,
    solutionEvidence: /0,1,4,5/.test(solution) && /10/.test(solution),
    answerParity: question.answer === '④'
  };
  if (row.id === 9) return {
    expectedObserved: expected.maximizingParameter === observed.maximizingParameter && expected.perimeterFunction === observed.perimeterFunction && expected.maximumPerimeter === observed.maximumPerimeter,
    solutionEvidence: solution.includes('3/4') && solution.includes('51/2'),
    answerParity: question.answer === '①'
  };
  if (row.id === 15) return {
    expectedObserved: JSON.stringify(expected.intersectionXs) === JSON.stringify(observed.intersectionXs) && expected.maximumOnInterval.x === observed.maximumOnInterval.x && expected.maximumOnInterval.y === observed.maximumOnInterval.y && expected.target.y === observed.target.y,
    solutionEvidence: /a=3/.test(solution) && /43/.test(solution),
    answerParity: question.answer === '③'
  };
  throw new Error(`unmapped q${row.id}`);
}

function main() {
  const v2ByUid = new Map(V2.rows.map(row => [row.questionUid, row]));
  const rows = FACTS.rows.map(item => {
    const observed = v2ByUid.get(item.questionUid); if (!observed) throw new Error(`V2 missing ${item.questionUid}`);
    const question = candidateQuestion(item.questionUid);
    const result = parityFor(item, observed.observedFacts, question);
    const verdict = result.expectedObserved && result.solutionEvidence && result.answerParity ? 'PASS' : 'FAIL';
    return { questionUid: item.questionUid, id: item.id, expectedFactsHash: item.expectedFacts, observedFacts: observed.observedFacts, solution: question.solution, ...result, verdict, status: verdict === 'PASS' ? 'V3_PARITY_PASS' : 'V3_PARITY_FAIL' };
  });
  const failures = rows.filter(row => row.verdict === 'FAIL');
  const output = { schemaVersion: 'HS_QUADRATIC_APPROVED_V3_PARITY_R9', status: failures.length ? 'V3_PARITY_FAIL' : 'V3_PARITY_RECORDED_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'EXPECTED_FACT_V1_PLUS_ARTIFACT_FACT_V2_PLUS_CANDIDATE_SOLUTION', rows, failCount: failures.length, note: 'V3 compares the corrected source-only expected facts, independent artifact-only observations, and candidate-r9 solutions. PASS here is limited to these five rows and is not a final production PASS.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, rows: rows.length, failCount: output.failCount }, null, 2));
}
main();
