import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const OUTPUT = path.join(REPORT, '541_specialist_v1_expected_facts_r38.json');

const TARGETS = [
  ['archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js', 12, 'cartesian', { function: { a: 1, b: -8, c: 15, domain: [-1, 8] }, vertex: [4, -1], maximum: 24, minimum: -1, result: 25, exact: 't=x²−2x, y=(t−4)²−1, M−m=25' }],
  ['archive/exams/original/high/h1/1final/25_효천고_1학기_기말_고1_기출c.js', 7, 'cartesian', { function: { a: -3, b: 60, c: 0, domain: [0, 20] }, vertex: [10, 300], maximum: 300, result: 10, exact: 'S(a)=−3a²+60a, 꼭짓점 (10,300), a=10' }],
  ['archive/exams/original/high/h1/1final/25_효천고_1학기_기말_고1_기출c.js', 16, 'cartesian', { function: { a: -1, b: -8, c: -7, domain: [-4, 0] }, vertex: [-4, 9], maximum: 9, minimum: -7, result: -7, exact: 'h(x)=−(x+4)²+9, 최솟값 −7' }],
  ['archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js', 1, 'cartesian', { function: { a: 1, b: -8, c: 6, domain: [-1, 9] }, vertex: [4, -10], maximum: 9, minimum: -10, result: -1, exact: 'M=9, m=−10, M+m=−1' }],
  ['archive/exams/original/high/h1/1mid/26_매산고_1학기_중간_고1_기출c.js', 14, 'number-line', { solutionInterval: [1, 2], leftClosed: true, rightClosed: false, leftLabel: '1', rightLabel: '2', result: 3, exact: '1≤a<2, p+q=3' }],
  ['archive/exams/original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js', 15, 'number-line', { solutionInterval: [0, 5], leftClosed: true, rightClosed: false, leftLabel: '0', rightLabel: '5', result: 0, exact: '0≤k<5, 최소 정수 k=0' }],
  ['archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js', 22, 'number-line', { solutionInterval: [2, 4], leftClosed: true, rightClosed: false, leftLabel: '2', rightLabel: '4', result: 5, exact: '2≤k<4, 가능한 정수합=5' }],
  ['archive/exams/original/high/h1/1final/26_순천고_1학기_기말_고1_기출.js', 10, 'number-line', { solutionInterval: [-17, -14], leftClosed: true, rightClosed: false, leftLabel: '−17', rightLabel: '−14', result: -15, exact: '−17≤a<−14, 최대 정수 a=−15' }],
];

function load(relative) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

const rows = TARGETS.map(([sourceJsPath, id, expectedVisualType, expectedFacts]) => {
  const source = load(sourceJsPath);
  const question = source.questionBank.find((item) => Number(item.id) === id);
  if (!question) throw new Error(`missing ${sourceJsPath} q${id}`);
  return { questionUid: `${sourceJsPath}|${source.examTitle}|${id}`, sourceJsPath, id, content: question.content, choices: question.choices ?? [], expectedVisualType, expectedFacts };
});

const output = { schemaVersion: 'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R38', status: 'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS', inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', rows, note: 'Fresh source-only facts for r38. Four open cartesian function diagrams and four explicit number-line diagrams were selected from the remaining target-scoped ADD_NEW_VISUAL rows. Existing solution/SVG/V2/V3 evidence was not read for fact derivation.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, rows: rows.length, numberLineRows: rows.filter((row) => row.expectedVisualType === 'number-line').length, cartesianRows: rows.filter((row) => row.expectedVisualType === 'cartesian').length }, null, 2));
