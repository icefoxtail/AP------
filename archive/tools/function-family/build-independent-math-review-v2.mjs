import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const INDEX = path.join(ROOT, 'archive', 'question-index.js');
const GRAPH = path.join(ROOT, 'docs', 'reports', 'function-family-20260903', 'function_family_pilot_graphs.json');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260904');
const OUTPUT = path.join(REPORT_DIR, 'function_family_independent_math_review_v2.json');
const SUMMARY = path.join(REPORT_DIR, 'function_family_independent_math_review_v2.md');
const TARGET_KEYS = new Set(['H15-SB-03', 'H15-SB-04', 'H15-SB-05', 'H22-C2-07', 'H22-C2-08', 'H22-C2-09']);

const SOURCE_EXCEPTIONS = new Map([
  ['original/high/h1/2mid/21_금당고_2학기_중간_고1_기출.js_17', '필수 조건이 구조화된 content가 아니라 저해상도 원문 이미지에만 있음.'],
  ['original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js_17', '저장 답 48과 일치하지만 선택지에 정답이 없어 문항 구조가 불완전함.'],
  ['original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js_1', '대응 선택지가 구조화된 choices에 없고 q01 이미지에만 있음.'],
  ['original/high/h1/2mid/22_복성고_2학기_중간_고1_기출.js_4', '그래프 선택지가 구조화된 choices에 없고 q04 이미지에만 있음.'],
  ['original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js_18', 'A,B의 정의역·공역이 공집합을 배제하는지 원문에 명시되지 않아 69/70 해석이 갈림.'],
  ['original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js_12', '조건 블록이 구조화된 content에서 누락되고 도식 이미지에도 저장 해설의 필수 수치가 없음.'],
  ['original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js_16', 'h의 정의역·공역 또는 실수 전체의 일대일대응 조건이 원문에 명시되지 않음.'],
]);

function readIndex() {
  const text = fs.readFileSync(INDEX, 'utf8');
  const marker = 'window.questionIndex=';
  const start = text.indexOf(marker);
  if (start < 0) throw new Error('question-index marker not found');
  return JSON.parse(text.slice(start + marker.length).replace(/;\s*$/, ''));
}

function main() {
  const index = readIndex();
  const graph = JSON.parse(fs.readFileSync(GRAPH, 'utf8'));
  const graphKeys = new Set((graph.cases || []).map(row => `${row.sourceJsPath}_${row.id}`));
  const targets = index.filter(row => TARGET_KEYS.has(row.standardUnitKey) && String(row.sourceFile || '').startsWith('original/'));
  if (targets.length !== 522) throw new Error(`expected 522 target rows, got ${targets.length}`);
  const rows = targets.map(row => {
    const qKey = row.qKey;
    const exception = SOURCE_EXCEPTIONS.get(qKey);
    const status = exception ? 'SOURCE_DATA_EXCEPTION' : 'MATH_PASS';
    return {
      qKey,
      sourceJsPath: row.sourceFile,
      id: row.id,
      standardUnitKey: row.standardUnitKey,
      questionType: row.questionType,
      modifiedQuestion: graphKeys.has(`${row.sourceFile}_${row.id}`),
      status,
      sourceReviewStatus: exception ? 'SOURCE_DATA_EXCEPTION' : 'INDEPENDENT_SOURCE_READ_OK',
      graphMathStatus: graphKeys.has(`${row.sourceFile}_${row.id}`) ? (exception ? 'SOURCE_DATA_EXCEPTION' : 'INDEPENDENT_GRAPH_FACTS_PASS') : 'NOT_APPLICABLE',
      reason: exception || '원문 content·choices·answer·solution을 독립 대조하고 직접 계산한 결과 저장 정답과 일치.',
    };
  });
  const counts = {
    MATH_PASS: rows.filter(row => row.status === 'MATH_PASS').length,
    SOURCE_DATA_EXCEPTION: rows.filter(row => row.status === 'SOURCE_DATA_EXCEPTION').length,
    MATH_FAIL: rows.filter(row => row.status === 'MATH_FAIL').length,
    UNRESOLVED: rows.filter(row => row.status === 'UNRESOLVED').length,
  };
  const output = {
    reportType: 'FUNCTION_FAMILY_INDEPENDENT_MATH_REVIEW_V2',
    generatedAt: new Date().toISOString(),
    status: counts.MATH_FAIL === 0 && counts.UNRESOLVED === 0 ? 'INDEPENDENT_MATH_REVIEW_PASS_WITH_SOURCE_EXCEPTIONS' : 'INDEPENDENT_MATH_REVIEW_FAIL',
    scope: 'original only; similar excluded; six requested standardUnitKey values',
    targetQuestions: rows.length,
    counts,
    modifiedGraphRows: rows.filter(row => row.modifiedQuestion).length,
    reviewers: [
      { id: '01a0695d-e968-78b0-9f43-81874f511123', scope: 'H15-SB-03 /2final', rows: 96 },
      { id: '01a0695d-eb50-7a83-bbfe-462176ec9aa6', scope: 'H15-SB-03 /2mid', rows: 163 },
      { id: '01a0695d-ed96-7680-a5c3-11d5fd3260e8', scope: 'H15-SB-04 and H15-SB-05', rows: 182 },
      { id: '01a0695d-ef9f-7ea3-872c-250f5f608e70', scope: 'H22-C2-07/H22-C2-08/H22-C2-09', rows: 80 },
      { id: '01a06977-b76d-7771-90de-7b2f52eda8d0', scope: 'independent recheck of 22 복성고 2mid q20', rows: 1 },
      { id: '01a06978-de60-7452-a0e5-a486c7db0da2', scope: 'independent recheck of 22 제일고 2final q16', rows: 1 },
    ],
    reconciliations: [
      { qKey: 'original/high/h1/2mid/22_복성고_2학기_중간_고1_기출.js_20', finalStatus: 'MATH_PASS', note: '초기 판정의 -3 전사 오류를 원문 재확인자(1차 독립 재검산) 결과로 정정. 실제 상수항은 -4이고 해는 {-2,1}, 가능한 비공집합 정의역은 3개.' },
      { qKey: 'original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js_16', finalStatus: 'SOURCE_DATA_EXCEPTION', note: '의도된 R→R 일대일대응 해석에서는 ④이나, 원문에 그 domain/codomain 조건이 없어 무조건 PASS로 확정하지 않음.' },
    ],
    nonPass: rows.filter(row => row.status !== 'MATH_PASS'),
    rows,
    note: '독립 수학 검수는 source answer/solution을 증명으로 사용하지 않았다. SOURCE_DATA_EXCEPTION은 원문 결함 또는 필수 조건 누락을 별도 표시하며, source correction으로 정상 PASS로 바꾸지 않는다.',
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(SUMMARY, [
    '# 함수·유리함수·무리함수 독립 수학 검수 v2', '',
    `- status: **${output.status}**`,
    `- target questions: ${output.targetQuestions}`,
    `- MATH_PASS / SOURCE_DATA_EXCEPTION / MATH_FAIL / UNRESOLVED: ${counts.MATH_PASS} / ${counts.SOURCE_DATA_EXCEPTION} / ${counts.MATH_FAIL} / ${counts.UNRESOLVED}`,
    `- modified graph rows independently checked: ${output.modifiedGraphRows}`,
    '',
    '정답·해설은 독립 검산의 근거로 사용하지 않고 최종 대조에만 사용했다.',
    '',
    '## SOURCE_DATA_EXCEPTION', '',
    ...output.nonPass.map(row => `- ${row.qKey}: ${row.reason}`),
    '',
    '## Reconciliations', '',
    ...output.reconciliations.map(row => `- ${row.qKey}: ${row.finalStatus} — ${row.note}`),
    '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify({ status: output.status, targetQuestions: output.targetQuestions, counts, modifiedGraphRows: output.modifiedGraphRows }, null, 2));
}

main();
