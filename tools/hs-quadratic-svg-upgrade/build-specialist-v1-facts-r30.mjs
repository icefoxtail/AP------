import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const BASE = JSON.parse(fs.readFileSync(path.join(REPORT, '397_specialist_candidate_bank_manifest_r29.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '410_specialist_v1_expected_facts_r30.json');
const TARGETS = [
  ['1mid', '25_매산고_1학기_중간_고1_기출.js', 11, 'cartesian', { function: { a: -4, b: 32, c: 0, domain: [0, 8] }, vertex: [4, 64], maximum: 64, result: 64, exact: 'b²=−4a²+32a=−4(a−4)²+64, 최댓값 64' }],
  ['1mid', '25_제일고_1학기_중간_고1_기출.js', 16, 'cartesian', { function: { a: 1, b: 0, c: 0, domain: [-2, 5] }, line: { slope: 3, intercept: -2.25 }, sum: 0.75, result: '3/4', exact: '모든 k에서 접선: a=3, b=−9/4, a+b=3/4' }],
  ['1final', '26_순천고_1학기_기말_고1_기출.js', 11, 'cartesian', { function: { a: 4, b: -8, c: -12, domain: [-3, 6] }, vertex: [1, -16], maximum: 48, result: 84, exact: 'f(x)=4x²−8x−12, 구간 최댓값 48, f(6)=84' }],
  ['1final', '26_순천고_1학기_기말_고1_기출.js', 16, 'cartesian', { function: { a: 1, b: -4, c: 3, domain: [0, 5] }, vertex: [2, -1], sum: '4+√7−√3', exact: 'a=2−√3 또는 2+√7, 합=4+√7−√3' }],
  ['1final', '26_순천여고_1학기_기말_고1_기출.js', 10, 'cartesian', { function: { a: 1, b: -2, c: -8, domain: [-1, 3] }, vertex: [1, -9], maximum: -5, minimum: -9, result: 4, exact: 't=x²−2x, t∈[−1,3], M−m=4' }],
  ['1final', '26_금당고_1학기_기말_고1_기출.js', 9, 'number-line', { solutionInterval: [1 / 3, 3], leftClosed: true, rightClosed: true, leftLabel: '1/3', rightLabel: '3', result: 1, exact: '해집합 1/3≤x≤3, ab=1' }],
  ['1final', '26_순천고_1학기_기말_고1_기출.js', 17, 'number-line', { solutionInterval: [-4, 5], leftClosed: true, rightClosed: true, integerSolutions: [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5], count: 10, result: 10, exact: '정수해 −4≤x≤5, 10개' }],
  ['1mid', '25_금당고_1학기_중간_고1_기출.js', 14, 'number-line', { solutionInterval: [5, 5], leftClosed: true, rightClosed: true, result: 5, exact: 'f(3)=9−2n<0이므로 n≥5, 최솟값 5' }],
];

function load(relative) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

const baseBySource = new Map(BASE.candidateFiles.map((file) => [file.sourcePath, file]));
const rows = [];
for (const [dir, basename, id, expectedVisualType, expectedFacts] of TARGETS) {
  const sourceJsPath = `archive/exams/original/high/h1/${dir}/${basename}`;
  const source = load(sourceJsPath);
  const question = source.questionBank.find((item) => Number(item.id) === id);
  if (!question) throw new Error(`missing ${sourceJsPath} q${id}`);
  const base = load(baseBySource.get(sourceJsPath).candidatePath);
  const candidateQuestion = base.questionBank.find((item) => Number(item.id) === id);
  if (candidateQuestion?.solutionImage) throw new Error(`already candidate visualized ${sourceJsPath} q${id}`);
  rows.push({ questionUid: `${sourceJsPath}|${source.examTitle}|${id}`, sourceJsPath, id, content: question.content, choices: question.choices ?? [], expectedVisualType, expectedFacts });
}

const output = {
  schemaVersion: 'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R30',
  status: 'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',
  inputVisibilityProfile: 'SOURCE_ONLY',
  priorReviewVisibility: 'NONE',
  rows,
  note: 'Fresh source-only facts for r30; function rows use open cartesian teaching diagrams and inequality rows use explicit number lines. Existing solution/SVG/V2/V3 evidence were not used for derivation.',
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, rows: rows.length, numberLineRows: rows.filter((row) => row.expectedVisualType === 'number-line').length, cartesianRows: rows.filter((row) => row.expectedVisualType === 'cartesian').length }, null, 2));
