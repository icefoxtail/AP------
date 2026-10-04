import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '37_candidate_source_repair_manifest_r8.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '38_candidate_source_repair_independent_recheck_r8.json');

function load(relative) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

function findCandidateQuestion(row) {
  const file = MANIFEST.candidateFiles.find(item => item.sourcePath === row.sourceJsPath);
  if (!file) throw new Error(`candidate file missing for ${row.questionUid}`);
  const candidate = load(file.candidatePath);
  const question = candidate.questionBank.find(item => Number(item.id) === row.id);
  if (!question) throw new Error(`candidate question missing for ${row.questionUid}`);
  return question;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function independentChecks() {
  const q13 = (() => {
    // Δ/4 = k(5+b−2a) + (1−a)^2.  For every nonzero real k this is 0,
    // so both coefficients vanish: a=1, b=−3.  k=0 is explicitly excluded.
    const coefficientOfK = 5 - 3 - 2 * 1;
    const constantTerm = (1 - 1) ** 2;
    assert(coefficientOfK === 0 && constantTerm === 0, 'q13 discriminant identity check failed');
    return { kCondition: 'k≠0', a: 1, b: -3, result: -2, answer: '②' };
  })();

  const q17 = (() => {
    const count = a => {
      const left = a < 4 ? 0 : a === 4 ? 1 : 2;
      const right = a > 1 ? 1 : 0;
      return 2 + left + right;
    };
    const samples = [0.5, 1, 2, 3.999, 4, 5].map(a => ({ a, intersections: count(a) }));
    assert(samples.find(item => item.a === 0.5).intersections === 2, 'q17 low-a count failed');
    assert(samples.find(item => item.a === 2).intersections === 3, 'q17 exact-three count failed');
    assert(samples.find(item => item.a === 4).intersections === 4, 'q17 boundary count failed');
    assert(samples.find(item => item.a === 5).intersections === 5, 'q17 high-a count failed');
    return { exactThreeRange: '1<a<4', maximum: '없다', answer: '⑤', samples };
  })();

  const q19 = (() => {
    const first = t => (t < 0 ? 0 : t === 0 ? 1 : 2);
    const second = t => (t > 5 ? 0 : t === 5 ? 1 : 2);
    const shared = new Set([1, 4]);
    const values = [];
    for (const t of [0, 1, 4, 5]) {
      const total = first(t) + second(t) - (shared.has(t) ? 1 : 0);
      if (total === 3) values.push(t);
    }
    assert(JSON.stringify(values) === JSON.stringify([0, 1, 4, 5]), 'q19 t-set check failed');
    return { tValues: values, sum: values.reduce((sum, value) => sum + value, 0), answer: '④' };
  })();

  const q9 = (() => {
    const t = 3 / 4;
    const perimeter = -8 * t * t / 3 + 4 * t + 24;
    assert(perimeter === 51 / 2, 'q9 perimeter maximum check failed');
    return { maximizingT: '3/4', perimeter: '51/2', answer: '①' };
  })();

  const q15 = (() => {
    const a = (22 - 7) / 5;
    const f3 = a * (3 + 3) * (3 - 1) + 7;
    assert(a === 3 && f3 === 43, 'q15 quadratic reconstruction check failed');
    return { a, f3, answer: '③' };
  })();

  return { q13, q17, q19, q9, q15 };
}

const expected = independentChecks();
const checks = [];
for (const row of MANIFEST.repairedRows) {
  const question = findCandidateQuestion(row);
  const suffix = row.questionUid.split('|').at(-1);
  const key = `q${suffix}`;
  const fact = expected[key];
  assert(question.answer === fact.answer, `${key} candidate answer mismatch`);
  if (key === 'q13') assert(question.content.includes('k\\ne0'), 'q13 candidate condition missing');
  checks.push({ questionUid: row.questionUid, answer: question.answer, fields: row.fields, independentFact: fact, candidateContentHasRequiredCondition: key !== 'q13' || question.content.includes('k\\ne0'), candidateSolutionPresent: typeof question.solution === 'string' && question.solution.length > 0, status: 'RECHECKED' });
}

const output = {
  schemaVersion: 'HS_QUADRATIC_CANDIDATE_SOURCE_REPAIR_INDEPENDENT_RECHECK_R8',
  status: 'CANDIDATE_SOURCE_REPAIR_INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS',
  productionAuthorized: false,
  sourceMutationPerformed: false,
  sourceHoldsBefore: MANIFEST.sourceHoldsBefore,
  sourceHoldsAfterCandidateRepair: MANIFEST.sourceHoldsAfterCandidateRepair,
  checks,
  independentCalculations: expected,
  note: 'The five approved repairs agree with independent calculations and are present in candidate-r8. This is not a current-pipeline V1/V2/V3 or final production PASS.'
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, checkedQuestionCount: checks.length, sourceHoldsAfterCandidateRepair: output.sourceHoldsAfterCandidateRepair }, null, 2));
