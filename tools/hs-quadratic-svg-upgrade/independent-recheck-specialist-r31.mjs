import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..'); const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908'); const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '426_specialist_v1_expected_facts_r31.json'), 'utf8')); const OUTPUT = path.join(REPORT, '432_independent_recheck_specialist_r31.json');
const checks = [
  ['archive/exams/original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js', 18, { result: 12 }],
  ['archive/exams/original/high/h1/1mid/25_팔마고_1학기_중간_고1_기출.js', 6, { vertex: [-2.5, -13.25], result: 35 }],
  ['archive/exams/original/high/h1/1mid/25_팔마고_1학기_중간_고1_기출.js', 8, { sum: '14/3', result: 17 }],
  ['archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js', 9, { vertex: [1, 5], result: 6 }],
  ['archive/exams/original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js', 14, { solutionInterval: [8 / 3, 8 / 3], result: '8/3' }],
  ['archive/exams/original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js', 20, { solutionInterval: [2, 2], result: 2 }],
  ['archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js', 4, { solutionInterval: [-5, -5], result: -5 }],
  ['archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js', 17, { solutionInterval: [null, -1], result: 'k≤−1' }],
];
const factMap = new Map(FACTS.rows.map((row) => [`${row.sourceJsPath}|${row.id}`, row])); const rows = checks.map(([sourceJsPath, id, independentlyComputedFacts]) => { const fact = factMap.get(`${sourceJsPath}|${id}`); if (!fact) throw new Error(`V1 fact missing for ${sourceJsPath}|${id}`); const expectedFactParity = Object.entries(independentlyComputedFacts).every(([field, value]) => JSON.stringify(fact.expectedFacts[field]) === JSON.stringify(value)); return { questionUid: fact.questionUid, sourceJsPath, id, independentlyComputedFacts, expectedFactParity, independentCalculationStatus: expectedFactParity ? 'MATCH' : 'MISMATCH' }; });
const mismatchCount = rows.filter((row) => !row.expectedFactParity).length; const output = { schemaVersion: 'HS_QUADRATIC_INDEPENDENT_RECHECK_SPECIALIST_R31', status: mismatchCount ? 'INDEPENDENT_RECHECK_FAIL' : 'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'SOURCE_ONLY_INDEPENDENT_CALCULATOR', priorReviewVisibility: 'NONE', rows, checkedRows: rows.length, mismatchCount, calculatorDigest: crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'), note: 'Independent second-pass arithmetic for r31; candidate-only row evidence, not full-scope final PASS.' }; fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, checkedRows: output.checkedRows, mismatchCount }, null, 2));
