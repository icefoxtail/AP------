import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const BASE = JSON.parse(fs.readFileSync(path.join(REPORT, '412_specialist_candidate_bank_manifest_r30.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '426_specialist_v1_expected_facts_r31.json');
const TARGETS = [
  ['1mid', '25_매산고_1학기_중간_고1_기출.js', 18, 'cartesian', { function: { a: -2, b: 0, c: 12, domain: [-4, 4] }, line: { slope: 4, intercept: 0 }, result: 12, exact: '2(x₁²+x₂²)=32, m=12' }],
  ['1mid', '25_팔마고_1학기_중간_고1_기출.js', 6, 'cartesian', { function: { a: 1, b: 5, c: -7, domain: [-7, 3] }, vertex: [-2.5, -13.25], result: 35, exact: 'αβ(α+β)=(-7)(-5)=35' }],
  ['1mid', '25_팔마고_1학기_중간_고1_기출.js', 8, 'cartesian', { function: { a: 3, b: -4, c: -7, domain: [-2, 6] }, line: { slope: 10, intercept: 10 }, sum: '14/3', result: 17, exact: '교점 방정식의 근의 합=14/3, α+β=17' }],
  ['1mid', '24_한영고_1학기_중간_고1_기출.js', 9, 'cartesian', { function: { a: 1, b: -2, c: 6, domain: [-1, 5] }, vertex: [1, 5], result: 6, exact: 'f(x)−1=x²−2x+5, f(2)=6' }],
  ['1mid', '25_효천고_1학기_중간_고1_기출.js', 14, 'number-line', { solutionInterval: [8 / 3, 8 / 3], leftClosed: true, rightClosed: true, leftLabel: '8/3', rightLabel: '8/3', result: '8/3', exact: '근을 t,3t로 두면 t=1 또는 1/3, M−m=8/3' }],
  ['1mid', '25_효천고_1학기_중간_고1_기출.js', 20, 'number-line', { solutionInterval: [2, 2], leftClosed: true, rightClosed: true, result: 2, exact: '판별식 12k−8>0, 정수 최솟값 2' }],
  ['1mid', '24_여수고_1학기_중간_고1_기출.js', 4, 'number-line', { solutionInterval: [-5, -5], leftClosed: true, rightClosed: true, result: -5, exact: '근의 차 제곱=판별식=16, a=−5' }],
  ['1mid', '24_한영고_1학기_중간_고1_기출.js', 17, 'number-line', { solutionInterval: [null, -1], leftClosed: false, rightClosed: true, leftLabel: '−∞', rightLabel: '−1', result: 'k≤−1', exact: '판별식 −8(k+1)≥0, k≤−1' }],
];
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
const baseBySource = new Map(BASE.candidateFiles.map((file) => [file.sourcePath, file])); const rows = [];
for (const [dir, basename, id, expectedVisualType, expectedFacts] of TARGETS) {
  const sourceJsPath = `archive/exams/original/high/h1/${dir}/${basename}`; const source = load(sourceJsPath); const question = source.questionBank.find((item) => Number(item.id) === id); if (!question) throw new Error(`missing ${sourceJsPath} q${id}`); const base = load(baseBySource.get(sourceJsPath).candidatePath); const candidateQuestion = base.questionBank.find((item) => Number(item.id) === id); if (candidateQuestion?.solutionImage) throw new Error(`already candidate visualized ${sourceJsPath} q${id}`); rows.push({ questionUid: `${sourceJsPath}|${source.examTitle}|${id}`, sourceJsPath, id, content: question.content, choices: question.choices ?? [], expectedVisualType, expectedFacts });
}
const output = { schemaVersion: 'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R31', status: 'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS', inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', rows, note: 'Fresh source-only facts for r31; function rows use open cartesian teaching diagrams and parameter/inequality rows use explicit number lines. Existing solution/SVG/V2/V3 evidence were not used for derivation.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, rows: rows.length, numberLineRows: rows.filter((row) => row.expectedVisualType === 'number-line').length, cartesianRows: rows.filter((row) => row.expectedVisualType === 'cartesian').length }, null, 2));
