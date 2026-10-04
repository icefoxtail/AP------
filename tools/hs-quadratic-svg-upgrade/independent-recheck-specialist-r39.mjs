import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..'); const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908'); const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '557_specialist_v1_expected_facts_r39.json'), 'utf8')); const OUTPUT = path.join(REPORT, '563_independent_recheck_specialist_r39.json');
const checks = [
  ['archive/exams/original/high/h1/1final/26_순천여고_1학기_기말_고1_기출.js', 12, { vertex: [1, -5], maximum: 13, minimum: -5, result: 8 }],
  ['archive/exams/original/high/h1/1final/26_순천여고_1학기_기말_고1_기출.js', 23, { vertex: [3, 6], maximum: 6, tangentPoint: [4.5, 4.5], result: '27/16' }],
  ['archive/exams/original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js', 19, { vertex: [1, 4], maximum: 4, result: '−1/2' }],
  ['archive/exams/original/high/h1/1final/23_매산고_1학기_기말_고1_기출.js', 19, { solutionIntervals: [{ left: null, right: 0.5, leftClosed: false, rightClosed: false, _leftLabel: '−∞', _rightLabel: '1/2' }, { left: 3.5, right: null, leftClosed: false, rightClosed: false, _leftLabel: '7/2', _rightLabel: '∞' }], result: 22 }],
  ['archive/exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js', 14, { solutionInterval: [-2, 3], integerSolutions: [-2, -1, 0, 1, 2, 3], count: 6, result: 6 }],
  ['archive/exams/original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js', 14, { solutionInterval: [1, 2], result: 3 }],
  ['archive/exams/original/high/h1/1final/25_효천고_1학기_기말_고1_기출c.js', 22, { solutionInterval: [-1, 2 / 3], integerSolutions: [-1, 0], count: 2, result: 2 }],
  ['archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js', 14, { solutionInterval: [3 - Math.sqrt(11), 3 + Math.sqrt(11)], integerSolutions: [0, 1, 2, 3, 4, 5, 6], count: 7, result: 21 }],
];
const factMap = new Map(FACTS.rows.map((row) => [`${row.sourceJsPath}|${row.id}`, row])); const rows = checks.map(([sourceJsPath, id, independentlyComputedFacts]) => { const fact = factMap.get(`${sourceJsPath}|${id}`); if (!fact) throw new Error(`V1 fact missing for ${sourceJsPath}|${id}`); const expectedFactParity = Object.entries(independentlyComputedFacts).every(([field, value]) => JSON.stringify(fact.expectedFacts[field]) === JSON.stringify(value)); return { questionUid: fact.questionUid, sourceJsPath, id, independentlyComputedFacts, expectedFactParity, independentCalculationStatus: expectedFactParity ? 'MATCH' : 'MISMATCH' }; });
const mismatchCount = rows.filter((row) => !row.expectedFactParity).length; const output = { schemaVersion: 'HS_QUADRATIC_INDEPENDENT_RECHECK_SPECIALIST_R39', status: mismatchCount ? 'INDEPENDENT_RECHECK_FAIL' : 'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'SOURCE_ONLY_INDEPENDENT_CALCULATOR', priorReviewVisibility: 'NONE', rows, checkedRows: rows.length, mismatchCount, calculatorDigest: crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'), note: 'Independent second-pass arithmetic for r39; this is not full-scope final PASS.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, checkedRows: output.checkedRows, mismatchCount }, null, 2));
