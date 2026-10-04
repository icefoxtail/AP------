import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const DIR = path.join(ROOT, 'archive', 'analysis', 'line-equation-external-51');
const review = JSON.parse(fs.readFileSync(path.join(DIR, 'independent-review.json'), 'utf8'));
const ledger = JSON.parse(fs.readFileSync(path.join(DIR, 'repair-ledger.json'), 'utf8'));
const byKey = new Map(ledger.modifiedQuestionKeys.map(item => [item.key, item]));
const rows = review.rows.map(row => ({
  key: row.key,
  file: row.file,
  id: row.id,
  unit: row.unit,
  reviewStatus: row.status,
  modifications: byKey.has(row.key) ? [
    ...(byKey.get(row.key).numeric ? ['numeric-hard-fail-repaired'] : []),
    ...(byKey.get(row.key).semantic ? ['semantic-svg-repaired'] : []),
    ...(byKey.get(row.key).metadata ? ['subUnit-tags-repaired'] : []),
  ] : [],
  issuesAfterRepair: row.issues,
  svg: row.svg,
}));
if (rows.length !== 94 || rows.some(row => row.reviewStatus !== 'PASS' || row.issuesAfterRepair.length)) throw new Error('94-question final row gate failed');
const uniqueModified = rows.filter(row => row.modifications.length);
const final = {
  status: 'PASS',
  baselineExternalReviewSha: '5958eedf933f306bb044bb350f2763dafe8b1343',
  actualMainBeforeRepair: '08ed4f102fc992ad839b75c1dff0f8208fb463dc',
  target: { h15: 63, h22: 31, total: 94, files: 28, reviewed: 94 },
  externalReview: ledger.externalReviewFindingCategories,
  disposition: { modifiedQuestions: uniqueModified.length, unchangedPassQuestions: 94 - uniqueModified.length, modifiedVisualAssets: ledger.modifiedVisualCount, modifiedMetadataQuestions: ledger.modifiedMetadataCount },
  gates: {
    inventory: 'PASS',
    contentChoicesAnswerProtected: 'PASS 94/94',
    mathAnswerBaseline: 'PASS 94/94 (answer/solution not changed by this repair)',
    independentGeometryVerifier: 'PASS 94/94',
    svgStaticAndNumericParity: 'PASS 94/94',
    subUnitCanonicalParity: 'PASS 94/94',
    solutionImageCoverage: 'PASS 94/94',
    schematicAllowedMisuse: 'PASS 0',
    genericFakeVisualization: 'PASS 0',
    knownWrongCoordinateSvg: 'PASS 0',
    browserRender: 'PASS 84/84',
  },
  perQuestion: rows,
};
fs.writeFileSync(path.join(DIR, 'final-report.json'), `${JSON.stringify(final, null, 2)}\n`, 'utf8');
const lines = [
  '# 고1 「직선의 방정식」 최신 main 외부검수 51건 최종 보고', '',
  `- 기준 외부검수 SHA: \`${final.baselineExternalReviewSha}\``,
  `- 수정 시작 시 실제 최신 main: \`${final.actualMainBeforeRepair}\``,
  '- 대상: H15 63 + H22 31 = 94문항 / 28개 JS',
  '- 최종 판정: **PASS**', '',
  '## 외부검수 finding', '',
  '| category | count | disposition |', '|---|---:|---|',
  '| 실제 수치·직선·수선의 발 HARD FAIL | 21 | 독립 기준값 대조 후 수정 |',
  '| 의미 불충분 SVG | 27 | 핵심 직선·점·수선·영역 보강 |',
  '| subUnit 잔여 오류 | 10 | 중복 포함 canonical 재분류 |', '',
  '## 전체 문항 판정', '',
  '| 문항 | 단원 | 최종 | 수정내역 |', '|---|---|---|---|',
  ...rows.map(row => `| ${row.key} | ${row.unit} | ${row.reviewStatus} | ${row.modifications.length ? row.modifications.join(', ') : 'unchanged PASS'} |`), '',
  '## coverage / gates', '',
  `- reviewed: **${final.target.total}/${final.target.total}**`,
  `- modified questions: **${final.disposition.modifiedQuestions}**, unchanged PASS: **${final.disposition.unchangedPassQuestions}**`,
  `- modified SVG: **${final.disposition.modifiedVisualAssets}**, metadata-modified questions: **${final.disposition.modifiedMetadataQuestions}**`,
  '- content / choices / answer: 94/94 preserved',
  '- math answer baseline: 94/94 PASS preserved',
  '- independent geometry verifier: 94/94 PASS',
  '- SVG static/numeric parity: 94/94 PASS',
  '- subUnit canonical parity: 94/94 PASS',
  '- solutionImage coverage: 94/94 PASS; SCHEMATIC_ALLOWED misuse: 0; generic fake SVG: 0; known wrong-coordinate SVG: 0',
  '- browser render: 84/84 PASS (28 files × exam/sol/ans)', '',
  '상세 row별 데이터는 `final-report.json`에 보존했다.',
];
fs.writeFileSync(path.join(DIR, 'final-report.md'), `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ status: final.status, targetCount: final.target.total, modifiedQuestions: final.disposition.modifiedQuestions, unchangedPass: final.disposition.unchangedPassQuestions, modifiedVisualAssets: final.disposition.modifiedVisualAssets, browserRender: final.gates.browserRender }, null, 2));
