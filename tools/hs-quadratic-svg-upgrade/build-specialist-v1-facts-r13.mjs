import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const OUTPUT = path.join(REPORT, '101_specialist_v1_expected_facts_r13.json');

const TARGETS = [
  ['1final', '22_매산고_1학기_기말_고1_기출.js', 1, 'number-line', { solutionInterval: [-4, 2], leftClosed: false, rightClosed: false, result: -6, exact: 'a=2, b=−8, a+b=−6' }],
  ['1final', '22_복성고_1학기_기말_고1_기출.js', 5, 'number-line', { solutionInterval: [-1, 7], leftClosed: true, rightClosed: true, result: '−1≤x≤7' }],
  ['1final', '22_순천여고_1학기_기말_고1_기출.js', 2, 'number-line', { solutionInterval: [-4, 5], leftClosed: true, rightClosed: true, result: 1, sum: 1 }],
  ['1final', '22_제일고_1학기_기말_고1_기출.js', 19, 'number-line', { solutionInterval: [-1.5, 1.5], leftClosed: true, rightClosed: true, exact: '−3/2≤x≤3/2' }],
  ['1final', '22_팔마고_1학기_기말_고1_기출.js', 1, 'number-line', { solutionInterval: [1, 3], leftClosed: true, rightClosed: true, result: 4, sum: 4 }],
  ['1final', '22_효천고_1학기_기말_고1_기출.js', 10, 'number-line', { solutionInterval: [-1, 2], leftClosed: true, rightClosed: true, result: -2, product: -2 }],
  ['1final', '23_강남여고_1학기_기말_고1_기출.js', 1, 'number-line', { solutionInterval: [2, 4], leftClosed: false, rightClosed: true, integerSolutions: [3, 4], count: 2 }],
  ['1final', '23_강남여고_1학기_기말_고1_기출.js', 10, 'number-line', { solutionInterval: [-2, 3], leftClosed: false, rightClosed: false, integerSolutions: [-1, 0, 1, 2], count: 4 }],
  ['1final', '23_금당고_1학기_기말_고1_기출.js', 4, 'number-line', { solutionInterval: [-1, 3], leftClosed: false, rightClosed: false, integerSolutions: [0, 1, 2], count: 3 }],
  ['1final', '22_복성고_1학기_기말_고1_기출.js', 6, 'number-line', { solutionInterval: [4, 5], leftClosed: false, rightClosed: true, integerSolutions: [5], count: 1, result: 5, exact: 'x=5' }],
  ['1final', '22_복성고_1학기_기말_고1_기출.js', 10, 'number-line', { solutionInterval: [0, 4 / 3], leftClosed: true, rightClosed: true, integerSolutions: [0, 1], count: 2, result: 2, exact: '0≤x≤4/3' }],
  ['1final', '22_제일고_1학기_기말_고1_기출.js', 4, 'number-line', { solutionInterval: [null, -1], leftClosed: false, rightClosed: true, result: 'a≤−1', exact: 'a≤−1' }],
  ['1final', '22_효천고_1학기_기말_고1_기출.js', 6, 'number-line', { solutionInterval: [-2, 3], leftClosed: false, rightClosed: false, integerSolutions: [-1, 0, 1, 2], count: 4, result: 4 }],
  ['1final', '22_제일고_1학기_기말_고1_기출.js', 2, 'number-line', { solutionInterval: [200, 400], leftClosed: true, rightClosed: true, result: 600, sum: 600, exact: '200≤증발량≤400' }],
  ['1final', '22_팔마고_1학기_기말_고1_기출.js', 10, 'number-line', { solutionInterval: [-1, 8], leftClosed: true, rightClosed: true, result: 11, sum: 11, exact: 'a=2, b=9' }],
  ['1final', '22_팔마고_1학기_기말_고1_기출.js', 11, 'number-line', { solutionInterval: [20, 80], leftClosed: true, rightClosed: true, result: 100, sum: 100, exact: '20≤x≤80' }],
  ['1final', '22_복성고_1학기_기말_고1_기출.js', 7, 'cartesian', { function: { a: -1, b: 2, c: 3, domain: [0, 3] }, vertex: [1, 4], endpointValues: { '0': 3, '3': 0 }, maximum: 4, minimum: 0, result: 4 }],
  ['1final', '23_매산고_1학기_기말_고1_기출.js', 13, 'number-line', { solutionInterval: [3, 4], leftClosed: true, rightClosed: true, integerSolutions: [3, 4], result: 12, exact: 'k=3 또는 k=4, 곱=12' }],
];

function load(relative) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

const rows = [];
for (const [sourceDir, basename, id, expectedVisualType, expectedFacts] of TARGETS) {
  const sourceJsPath = `archive/exams/original/high/h1/${sourceDir}/${basename}`;
  const source = load(sourceJsPath);
  const question = source.questionBank.find((item) => Number(item.id) === id);
  if (!question) throw new Error(`missing ${sourceJsPath} q${id}`);
  rows.push({
    questionUid: `${sourceJsPath}|${source.examTitle}|${id}`,
    sourceJsPath,
    id,
    content: question.content,
    choices: question.choices ?? [],
    expectedVisualType,
    expectedFacts,
  });
}

const output = {
  schemaVersion: 'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R13',
  status: 'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',
  inputVisibilityProfile: 'SOURCE_ONLY',
  priorReviewVisibility: 'NONE',
  rows,
  note: 'Fresh source-only facts for 18 specialist rows. Calculations use only current source problem content and choices; existing solution, SVG, V2, and V3 evidence were not read for fact derivation. This is candidate evidence and contains no PASS claim.',
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, rows: rows.length, numberLineRows: rows.filter((row) => row.expectedVisualType === 'number-line').length, cartesianRows: rows.filter((row) => row.expectedVisualType === 'cartesian').length }, null, 2));
