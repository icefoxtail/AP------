import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '101_specialist_v1_expected_facts_r13.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '114_independent_recheck_specialist_r13.json');
const key = (row) => `${row.sourceJsPath}|${row.id}`;
const expectedByKey = new Map(FACTS.rows.map((row) => [key(row), row.expectedFacts]));

const checks = [
  ['archive/exams/original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js', 1, { solutionInterval: [-4, 2], leftClosed: false, rightClosed: false, result: -6 }],
  ['archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js', 5, { solutionInterval: [-1, 7], leftClosed: true, rightClosed: true }],
  ['archive/exams/original/high/h1/1final/22_순천여고_1학기_기말_고1_기출.js', 2, { solutionInterval: [-4, 5], leftClosed: true, rightClosed: true, result: 1 }],
  ['archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js', 19, { solutionInterval: [-1.5, 1.5], leftClosed: true, rightClosed: true }],
  ['archive/exams/original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js', 1, { solutionInterval: [1, 3], leftClosed: true, rightClosed: true, result: 4 }],
  ['archive/exams/original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js', 10, { solutionInterval: [-1, 2], leftClosed: true, rightClosed: true, result: -2 }],
  ['archive/exams/original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js', 1, { solutionInterval: [2, 4], leftClosed: false, rightClosed: true, integerSolutions: [3, 4], count: 2 }],
  ['archive/exams/original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js', 10, { solutionInterval: [-2, 3], leftClosed: false, rightClosed: false, integerSolutions: [-1, 0, 1, 2], count: 4 }],
  ['archive/exams/original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js', 4, { solutionInterval: [-1, 3], leftClosed: false, rightClosed: false, integerSolutions: [0, 1, 2], count: 3 }],
  ['archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js', 6, { solutionInterval: [4, 5], leftClosed: false, rightClosed: true, integerSolutions: [5], count: 1, result: 5 }],
  ['archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js', 10, { solutionInterval: [0, 4 / 3], leftClosed: true, rightClosed: true, integerSolutions: [0, 1], count: 2, result: 2 }],
  ['archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js', 4, { solutionInterval: [null, -1], leftClosed: false, rightClosed: true }],
  ['archive/exams/original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js', 6, { solutionInterval: [-2, 3], leftClosed: false, rightClosed: false, integerSolutions: [-1, 0, 1, 2], count: 4, result: 4 }],
  ['archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js', 2, { solutionInterval: [200, 400], leftClosed: true, rightClosed: true, result: 600, sum: 600 }],
  ['archive/exams/original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js', 10, { solutionInterval: [-1, 8], leftClosed: true, rightClosed: true, result: 11, sum: 11 }],
  ['archive/exams/original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js', 11, { solutionInterval: [20, 80], leftClosed: true, rightClosed: true, result: 100, sum: 100 }],
  ['archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js', 7, { function: { a: -1, b: 2, c: 3, domain: [0, 3] }, vertex: [1, 4], maximum: 4, minimum: 0, result: 4 }],
  ['archive/exams/original/high/h1/1final/23_매산고_1학기_기말_고1_기출.js', 13, { solutionInterval: [3, 4], leftClosed: true, rightClosed: true, integerSolutions: [3, 4], result: 12 }],
];

function digest(value) { return crypto.createHash('sha256').update(JSON.stringify(value, null, 2)).digest('hex'); }
const rows = [];
for (const [sourceJsPath, id, independentlyComputedFacts] of checks) {
  const rowKey = `${sourceJsPath}|${id}`;
  const expected = expectedByKey.get(rowKey);
  if (!expected) throw new Error(`V1 fact missing for ${rowKey}`);
  const parity = Object.entries(independentlyComputedFacts).every(([field, value]) => JSON.stringify(expected[field]) === JSON.stringify(value));
  rows.push({ questionUid: FACTS.rows.find((row) => key(row) === rowKey).questionUid, sourceJsPath, id, independentlyComputedFacts, expectedFactParity: parity, independentCalculationStatus: parity ? 'MATCH' : 'MISMATCH' });
}
const mismatchCount = rows.filter((row) => !row.expectedFactParity).length;
const output = { schemaVersion: 'HS_QUADRATIC_INDEPENDENT_RECHECK_SPECIALIST_R13', status: mismatchCount ? 'INDEPENDENT_RECHECK_FAIL' : 'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'SOURCE_ONLY_INDEPENDENT_CALCULATOR', priorReviewVisibility: 'NONE', rows, checkedRows: rows.length, mismatchCount, calculatorDigest: digest(checks), note: 'Independent second-pass arithmetic for the 18 r13 rows. The calculator does not use solution, SVG, V2, or V3 evidence to derive facts; parity is row-level candidate evidence and not full-scope final PASS.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, checkedRows: output.checkedRows, mismatchCount: output.mismatchCount }, null, 2));
