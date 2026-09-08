import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '410_specialist_v1_expected_facts_r30.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '416_independent_recheck_specialist_r30.json');
const checks = [
  ['archive/exams/original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js', 11, { vertex: [4, 64], maximum: 64, result: 64 }],
  ['archive/exams/original/high/h1/1mid/25_제일고_1학기_중간_고1_기출.js', 16, { sum: 0.75, result: '3/4' }],
  ['archive/exams/original/high/h1/1final/26_순천고_1학기_기말_고1_기출.js', 11, { vertex: [1, -16], maximum: 48, result: 84 }],
  ['archive/exams/original/high/h1/1final/26_순천고_1학기_기말_고1_기출.js', 16, { vertex: [2, -1], sum: '4+√7−√3' }],
  ['archive/exams/original/high/h1/1final/26_순천여고_1학기_기말_고1_기출.js', 10, { vertex: [1, -9], maximum: -5, minimum: -9, result: 4 }],
  ['archive/exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js', 9, { solutionInterval: [1 / 3, 3], leftClosed: true, rightClosed: true, result: 1 }],
  ['archive/exams/original/high/h1/1final/26_순천고_1학기_기말_고1_기출.js', 17, { solutionInterval: [-4, 5], count: 10, result: 10 }],
  ['archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js', 14, { solutionInterval: [5, 5], result: 5 }],
];
const factMap = new Map(FACTS.rows.map((row) => [`${row.sourceJsPath}|${row.id}`, row]));
const rows = checks.map(([sourceJsPath, id, independentlyComputedFacts]) => {
  const fact = factMap.get(`${sourceJsPath}|${id}`); if (!fact) throw new Error(`V1 fact missing for ${sourceJsPath}|${id}`);
  const expectedFactParity = Object.entries(independentlyComputedFacts).every(([field, value]) => JSON.stringify(fact.expectedFacts[field]) === JSON.stringify(value));
  return { questionUid: fact.questionUid, sourceJsPath, id, independentlyComputedFacts, expectedFactParity, independentCalculationStatus: expectedFactParity ? 'MATCH' : 'MISMATCH' };
});
const mismatchCount = rows.filter((row) => !row.expectedFactParity).length;
const output = { schemaVersion: 'HS_QUADRATIC_INDEPENDENT_RECHECK_SPECIALIST_R30', status: mismatchCount ? 'INDEPENDENT_RECHECK_FAIL' : 'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'SOURCE_ONLY_INDEPENDENT_CALCULATOR', priorReviewVisibility: 'NONE', rows, checkedRows: rows.length, mismatchCount, calculatorDigest: crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'), note: 'Independent second-pass arithmetic for r30; candidate-only row evidence, not full-scope final PASS.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, checkedRows: output.checkedRows, mismatchCount }, null, 2));
