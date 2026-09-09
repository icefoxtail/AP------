import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const BASE = JSON.parse(fs.readFileSync(path.join(REPORT, '491_specialist_candidate_bank_manifest_r35.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '506_specialist_v1_expected_facts_r36.json');
const TARGETS = [
  ['1final', '25_강남여고_1학기_기말_고1_기출c.js', 17, 'number-line', { solutionInterval: [-2, 3], leftClosed: true, rightClosed: true, result: 6, exact: '해집합 −2≤x≤3, x²−x−6≤0, bc/a=6' }],
  ['1final', '25_금당고_1학기_기말_고1_기출c.js', 13, 'number-line', { solutionInterval: [4, 6], leftClosed: true, rightClosed: true, integerSolutions: [4, 5, 6], count: 10, result: 10, exact: 'b=4,5,6에서 가능한 a 개수 1,3,6, 합10' }],
  ['1final', '25_순천여고_1학기_기말_고1_기출c.js', 5, 'number-line', { solutionInterval: [3, 17 / 3], leftClosed: true, rightClosed: true, leftLabel: '3', rightLabel: '17/3', result: 17, exact: '해집합 3≤x≤17/3, Mm=17' }],
  ['1mid', '23_한영고_1학기_중간_고1_기출.js', 17, 'number-line', { solutionInterval: [2, 2], leftClosed: true, rightClosed: true, result: 2, exact: '판별식 4−4k<0에서 k>1, 최솟값2' }],
  ['1mid', '23_한영고_1학기_중간_고1_기출.js', 3, 'cartesian', { function: { a: 2, b: -4, c: 1, domain: [0, 2] }, vertex: [1, -1], minimum: -1, result: 2, exact: 'y=2(x−1)²−1, a−b=2' }],
  ['1mid', '23_한영고_1학기_중간_고1_기출.js', 5, 'cartesian', { function: { a: 1, b: -3, c: -6, domain: [-3, 5] }, vertex: [1.5, -8.25], result: -2, exact: '(α+1)(β+1)=αβ+α+β+1=−2' }],
  ['1mid', '23_한영고_1학기_중간_고1_기출.js', 11, 'number-line', { solutionInterval: [1, 7], leftClosed: true, rightClosed: true, integerSolutions: [1, 2, 3, 4, 5, 6, 7], count: 7, result: 28, exact: '정수 1,2,3,4,5,6,7의 합28' }],
  ['1mid', '23_한영고_1학기_중간_고1_기출.js', 20, 'cartesian', { function: { a: 1, b: 4, c: 1, domain: [-5, 2] }, vertex: [-2, -3], result: -5, exact: '접선 조건 k=1, α+β=−4, α+β−k=−5' }],
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
  const baseFile = baseBySource.get(sourceJsPath);
  if (!baseFile) throw new Error(`base candidate file missing ${sourceJsPath}`);
  const base = load(baseFile.candidatePath);
  const candidateQuestion = base.questionBank.find((item) => Number(item.id) === id);
  if (candidateQuestion?.solutionImage) throw new Error(`already candidate visualized ${sourceJsPath} q${id}`);
  rows.push({ questionUid: `${sourceJsPath}|${source.examTitle}|${id}`, sourceJsPath, id, content: question.content, choices: question.choices ?? [], expectedVisualType, expectedFacts });
}

const output = { schemaVersion: 'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R36', status: 'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS', inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', rows, note: 'Fresh source-only facts for r36; integer/range rows use explicit number lines and function rows use cartesian diagrams. Existing solution/SVG/V2/V3 evidence were not used for derivation.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, rows: rows.length, numberLineRows: rows.filter((row) => row.expectedVisualType === 'number-line').length, cartesianRows: rows.filter((row) => row.expectedVisualType === 'cartesian').length }, null, 2));
