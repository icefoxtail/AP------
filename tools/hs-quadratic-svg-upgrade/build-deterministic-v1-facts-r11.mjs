import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const OUTPUT = path.join(REPORT, '68_deterministic_v1_expected_facts_r11.json');
const TARGETS = [
  ['22_복성고_1학기_기말_고1_기출.js', 4, 'number-line', { solutionInterval: [-5, 2], leftClosed: false, rightClosed: false, alphaMinusBeta: -7 }],
  ['22_제일고_1학기_기말_고1_기출.js', 3, 'number-line', { realInterval: [4.5, 6], leftClosed: false, rightClosed: true, integerSolutions: [5, 6], sum: 11 }],
  ['23_매산고_1학기_기말_고1_기출.js', 11, 'number-line', { solutionIntervals: [{ left: null, right: -4 / 3, leftClosed: false, rightClosed: true }, { left: 0, right: null, leftClosed: true, rightClosed: false }], alpha: '-4/3', beta: 0, result: -4 }],
  ['23_매산고_1학기_기말_고1_기출.js', 17, 'number-line', { solutionInterval: ['(6−√26)/5', '(6+√26)/5'], numericBounds: [(6 - Math.sqrt(26)) / 5, (6 + Math.sqrt(26)) / 5], leftClosed: true, rightClosed: true, result: '12/5' }],
  ['23_제일고_1학기_기말_고1_기출.js', 3, 'cartesian', { function: { a: 1, b: -4, c: 5, domain: [1, 4] }, vertex: [2, 1], maximum: 5, maximizingX: 4 }],
  ['23_제일고_1학기_기말_고1_기출.js', 3, 'cartesian', { duplicate: true }],
  ['23_팔마고_1학기_기말_고1_기출.js', 13, 'number-line', { solutionInterval: [null, -4], leftClosed: false, rightClosed: true, negativeIntegerMaximum: -4 }],
  ['25_강남여고_1학기_기말_고1_기출c.js', 8, 'number-line', { realInterval: [-4, 6], leftClosed: false, rightClosed: false, integerSolutions: [-3, -2, -1, 0, 1, 2, 3, 4, 5], sum: 6 }],
  ['25_매산고_1학기_기말_고1_기출c.js', 8, 'number-line', { integerSolutions: [2, 3, 4], sum: 9 }],
  ['25_매산여고_1학기_기말_고1_기출c.js', 1, 'number-line', { solutionInterval: [2, 4], leftClosed: true, rightClosed: true }],
  ['25_순천고_1학기_기말_고1_기출c.js', 1, 'number-line', { solutionIntervals: [{ left: -2, right: -1, leftClosed: true, rightClosed: false }, { left: 2, right: 3, leftClosed: false, rightClosed: true }] }],
  ['25_순천여고_1학기_기말_고1_기출c.js', 2, 'number-line', { solutionInterval: [null, 1], leftClosed: false, rightClosed: true, maximum: 1 }],
  ['25_제일고_1학기_기말_고1_기출c.js', 2, 'number-line', { realInterval: [2, 6], leftClosed: true, rightClosed: true, integerSolutions: [4, 5, 6], sum: 15 }],
  ['25_팔마고_1학기_기말_고1_기출c.js', 2, 'number-line', { realInterval: [2, 5], leftClosed: false, rightClosed: false, integerSolutions: [3, 4], count: 2 }],
  ['25_효천고_1학기_기말_고1_기출c.js', 20, 'cartesian', { function: { a: 2, b: 4, c: 3, domain: [-2, 0] }, vertex: [-1, 1], maximum: 3, maximizingXs: [-2, 0] }],
  ['26_금당고_1학기_기말_고1_기출.js', 4, 'number-line', { solutionInterval: [-2, 3], leftClosed: false, rightClosed: false }],
  ['26_복성고_1학기_기말_고1_기출.js', 5, 'number-line', { realInterval: [-1.5, 2.5], leftClosed: true, rightClosed: true, integerSolutions: [-1, 0, 1, 2], count: 4 }],
  ['26_순천여고_1학기_기말_고1_기출.js', 8, 'number-line', { realIntervals: [[-2, 1.5, true, true], [2, 3, true, true]], integerSolutions: [-2, -1, 0, 1, 2, 3], sum: 3 }],
  ['26_팔마고_1학기_기말_고1_기출.js', 20, 'cartesian', { function: { a: 1, b: 9, c: 1 }, line: { slope: 5, intercept: -3 }, tangentPoint: [-2, -13], parameterA: 9, result: 23 }],
  ['26_팔마고_1학기_기말_고1_기출.js', 4, 'cartesian', { function: { a: -1, b: 6, c: -8, domain: [2, 5] }, vertex: [3, 1], maximum: 1 }],
  ['26_팔마고_1학기_기말_고1_기출.js', 8, 'number-line', { realInterval: [-2, 3], leftClosed: false, rightClosed: true, integerSolutions: [-1, 0, 1, 2, 3], sum: 5 }],
  ['23_여천고_1학기_중간_고1_기출.js', 14, 'cartesian', { function: { a: -1 / 3, b: 1, c: 0 }, line: { slope: '(3−2√6)/3', intercept: 2 }, tangentPoint: ['√6', '√6−2'] }],
  ['23_여천고_1학기_중간_고1_기출.js', 17, 'cartesian', { function: { a: 1, b: -2, c: -2 }, vertex: [1, -3], result: -2 }],
  ['23_충무고_1학기_중간_고1_기출.js', 13, 'cartesian', { function: { a: -1, b: 6, c: -2 }, vertex: [3, 7], maximum: 7 }],
  ['24_한영고_1학기_중간_고1_기출.js', 6, 'cartesian', { function: { a: -1, b: 2, c: 3 }, point: [-1, 3], tangentSlopes: ['4−2√3', '4+2√3'], slopeSum: 8 }],
  ['24_제일고_2학기_중간_고1_기출.js', 5, 'number-line', { realInterval: [-2, 2], leftClosed: false, rightClosed: true, integerSolutions: [-1, 0, 1, 2], sum: 2 }]
];

function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }

const rows = [];
for (const [basename, id, visualType, expectedFacts] of TARGETS) {
  if (basename === '23_제일고_1학기_기말_고1_기출.js' && id === 3 && expectedFacts.duplicate) continue;
  const sourceDir = basename.startsWith('23_여천고_1학기_중간') || basename.startsWith('23_충무고_1학기_중간') || basename.startsWith('24_한영고_1학기_중간') ? '1mid' : basename.startsWith('24_제일고_2학기_중간') ? '2mid' : '1final';
  const sourceJsPath = `archive/exams/original/high/h1/${sourceDir}/${basename}`;
  const source = load(sourceJsPath); const q = source.questionBank.find(item => Number(item.id) === id); if (!q) throw new Error(`question missing ${sourceJsPath} q${id}`);
  rows.push({ questionUid: `${sourceJsPath}|${source.examTitle}|${id}`, sourceJsPath, id, content: q.content, choices: q.choices ?? [], expectedVisualType: visualType, expectedFacts });
}
const output = { schemaVersion: 'HS_QUADRATIC_DETERMINISTIC_V1_EXPECTED_FACTS_R11', status: 'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS', inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', sourceRepairPrerequisite: 'reports/hs-quadratic-svg-upgrade-20260908/57_current_closure_snapshot_r10.json', rows, note: 'Fresh source-only fact derivation for the deterministic 26-row batch. The source problem and choices were read; solution, existing SVG, and prior V2/V3 were not used. Specialist rows remain outside this batch.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, rows: rows.length }, null, 2));
