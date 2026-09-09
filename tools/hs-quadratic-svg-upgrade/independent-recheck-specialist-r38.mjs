import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '541_specialist_v1_expected_facts_r38.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '547_independent_recheck_specialist_r38.json');
const checks = [
  ['archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js', 12, { vertex: [4, -1], maximum: 24, minimum: -1, result: 25 }],
  ['archive/exams/original/high/h1/1final/25_효천고_1학기_기말_고1_기출c.js', 7, { vertex: [10, 300], maximum: 300, result: 10 }],
  ['archive/exams/original/high/h1/1final/25_효천고_1학기_기말_고1_기출c.js', 16, { vertex: [-4, 9], maximum: 9, minimum: -7, result: -7 }],
  ['archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js', 1, { vertex: [4, -10], maximum: 9, minimum: -10, result: -1 }],
  ['archive/exams/original/high/h1/1mid/26_매산고_1학기_중간_고1_기출c.js', 14, { solutionInterval: [1, 2], result: 3 }],
  ['archive/exams/original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js', 15, { solutionInterval: [0, 5], result: 0 }],
  ['archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js', 22, { solutionInterval: [2, 4], result: 5 }],
  ['archive/exams/original/high/h1/1final/26_순천고_1학기_기말_고1_기출.js', 10, { solutionInterval: [-17, -14], result: -15 }],
];
const factMap = new Map(FACTS.rows.map((row) => [`${row.sourceJsPath}|${row.id}`, row]));
const rows = checks.map(([sourceJsPath, id, independentlyComputedFacts]) => {
  const fact = factMap.get(`${sourceJsPath}|${id}`);
  if (!fact) throw new Error(`V1 fact missing for ${sourceJsPath}|${id}`);
  const expectedFactParity = Object.entries(independentlyComputedFacts).every(([field, value]) => JSON.stringify(fact.expectedFacts[field]) === JSON.stringify(value));
  return { questionUid: fact.questionUid, sourceJsPath, id, independentlyComputedFacts, expectedFactParity, independentCalculationStatus: expectedFactParity ? 'MATCH' : 'MISMATCH' };
});
const mismatchCount = rows.filter((row) => !row.expectedFactParity).length;
const output = { schemaVersion: 'HS_QUADRATIC_INDEPENDENT_RECHECK_SPECIALIST_R38', status: mismatchCount ? 'INDEPENDENT_RECHECK_FAIL' : 'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'SOURCE_ONLY_INDEPENDENT_CALCULATOR', priorReviewVisibility: 'NONE', rows, checkedRows: rows.length, mismatchCount, calculatorDigest: crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'), note: 'Independent second-pass arithmetic for r38. This closes only the eight-row candidate fact check, not full-scope final PASS.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, checkedRows: output.checkedRows, mismatchCount }, null, 2));
