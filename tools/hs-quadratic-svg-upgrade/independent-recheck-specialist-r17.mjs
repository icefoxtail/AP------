import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '168_specialist_v1_expected_facts_r17.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '178_independent_recheck_specialist_r17.json');
const key = (row) => `${row.sourceJsPath}|${row.id}`;
const expectedByKey = new Map(FACTS.rows.map((row) => [key(row), row.expectedFacts]));
const checks = [
  ['archive/exams/original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js', 15, { solutionInterval: [2, 4], leftClosed: true, rightClosed: false, integerSolutions: [2, 3], maximum: 3, result: 3 }],
  ['archive/exams/original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js', 16, { solutionInterval: [8, 9], leftClosed: true, rightClosed: false }],
  ['archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js', 17, { function: { a: 1, b: -4, c: 4, domain: [0, 4] }, vertex: [2, 0], minimum: 0, result: 6 }],
  ['archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js', 19, { solutionIntervals: [{ left: -3, right: -3, leftClosed: true, rightClosed: true }, { left: 3, right: 5, leftClosed: true, rightClosed: false }], integerSolutions: [-3, 3, 4], sum: 4, result: 4 }],
  ['archive/exams/original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js', 9, { function: { a: 1, b: 4, c: -5, domain: [-6, 2] }, vertex: [-2, -9], result: 6 }],
  ['archive/exams/original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js', 22, { solutionInterval: [5, 5], leftClosed: true, rightClosed: true, integerSolutions: [5], count: 1, result: 1 }],
  ['archive/exams/original/high/h1/1final/26_광양제철고_1학기_기말_고1_기출.js', 1, { solutionInterval: [-3, -1], leftClosed: false, rightClosed: true, integerSolutions: [-2, -1], count: 2, result: 2 }],
  ['archive/exams/original/high/h1/1final/26_광양제철고_1학기_기말_고1_기출.js', 8, { solutionInterval: [(-7 - Math.sqrt(13)) / 2, (-7 + Math.sqrt(13)) / 2], leftClosed: true, rightClosed: true, integerSolutions: [-5, -4, -3, -2], count: 4, result: 4 }],
  ['archive/exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js', 10, { solutionInterval: [15, 15], leftClosed: true, rightClosed: true, integerSolutions: [15], result: 18 }],
  ['archive/exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js', 2, { solutionInterval: [5, 8], leftClosed: false, rightClosed: false }],
  ['archive/exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js', 3, { solutionIntervals: [{ left: null, right: 2, leftClosed: false, rightClosed: true }, { left: 5, right: null, leftClosed: true, rightClosed: false }] }],
  ['archive/exams/original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js', 13, { solutionInterval: [4, 5], leftClosed: true, rightClosed: false, result: 9 }],
  ['archive/exams/original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js', 6, { solutionInterval: [2, 7], leftClosed: false, rightClosed: true, integerSolutions: [3, 4, 5, 6, 7], count: 5, result: 5 }],
  ['archive/exams/original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js', 9, { solutionInterval: [27, null], leftClosed: true, rightClosed: false, result: 27 }],
  ['archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js', 11, { solutionInterval: [-2, 10 / 3], leftClosed: true, rightClosed: true, result: 4 / 3 }],
  ['archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js', 7, { solutionInterval: [-3, 0.5], leftClosed: true, rightClosed: true, result: -2 }],
  ['archive/exams/original/high/h1/1final/23_팔마고_1학기_기말_고1_기출.js', 20, { solutionIntervals: [{ left: null, right: -2.5, leftClosed: false, rightClosed: false }, { left: 2.5, right: null, leftClosed: false, rightClosed: false }] }],
  ['archive/exams/original/high/h1/1final/23_순천여고_1학기_기말_고1_기출.js', 7, { solutionInterval: [-3, 2], leftClosed: true, rightClosed: true, result: 2 }],
];
const stripPrivate = (value) => Array.isArray(value) ? value.map(stripPrivate) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).filter(([field]) => !field.startsWith('_')).map(([field, item]) => [field, stripPrivate(item)])) : value;
const rows = [];
for (const [sourceJsPath, id, independentlyComputedFacts] of checks) {
  const rowKey = `${sourceJsPath}|${id}`; const expected = expectedByKey.get(rowKey); if (!expected) throw new Error(`V1 fact missing for ${rowKey}`);
  const parity = Object.entries(independentlyComputedFacts).every(([field, value]) => JSON.stringify(stripPrivate(expected[field])) === JSON.stringify(stripPrivate(value)));
  rows.push({ questionUid: FACTS.rows.find((row) => key(row) === rowKey).questionUid, sourceJsPath, id, independentlyComputedFacts, expectedFactParity: parity, independentCalculationStatus: parity ? 'MATCH' : 'MISMATCH' });
}
const mismatchCount = rows.filter((row) => !row.expectedFactParity).length;
const output = { schemaVersion: 'HS_QUADRATIC_INDEPENDENT_RECHECK_SPECIALIST_R17', status: mismatchCount ? 'INDEPENDENT_RECHECK_FAIL' : 'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'SOURCE_ONLY_INDEPENDENT_CALCULATOR', priorReviewVisibility: 'NONE', rows, checkedRows: rows.length, mismatchCount, calculatorDigest: crypto.createHash('sha256').update(JSON.stringify(checks, null, 2)).digest('hex'), note: 'Independent second-pass arithmetic for r17; candidate-only row evidence, not full-scope final PASS.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, checkedRows: output.checkedRows, mismatchCount: output.mismatchCount }, null, 2));
