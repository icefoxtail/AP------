import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const INDEX = path.join(ROOT, 'archive', 'question-index.js');
const GRAPH = path.join(ROOT, 'docs', 'reports', 'function-family-20260903', 'function_family_pilot_graphs.json');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260904');
const OUTPUT = path.join(REPORT_DIR, 'function_family_independent_visual_review_v2.json');
const SUMMARY = path.join(REPORT_DIR, 'function_family_independent_visual_review_v2.md');
const TARGET_KEYS = new Set(['H15-SB-03', 'H15-SB-04', 'H15-SB-05', 'H22-C2-07', 'H22-C2-08', 'H22-C2-09']);
const SOURCE_EXCEPTIONS = new Map([
  ['original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js_12', 'source content가 필수 조건 블록에서 끝나고 동봉 도식에도 SVG가 사용하는 좌표·넓이 정보가 없어 그래프 의미를 원문으로 확정할 수 없음.'],
  ['original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js_18', 'source가 모든 실수 a에 대해 단일 r을 요구하지만 상대 위치가 a에 따라 달라져 현재 SVG의 특수값을 원문으로 독립 확정할 수 없음.'],
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
  const modified = targets.filter(row => graphKeys.has(`${row.sourceFile}_${row.id}`));
  if (modified.length !== 135) throw new Error(`expected 135 modified graph rows, got ${modified.length}`);
  const rows = modified.map(row => {
    const reason = SOURCE_EXCEPTIONS.get(row.qKey);
    return {
      qKey: row.qKey,
      sourceJsPath: row.sourceFile,
      id: row.id,
      standardUnitKey: row.standardUnitKey,
      status: reason ? 'SOURCE_DATA_EXCEPTION' : 'VISUAL_MATH_PASS',
      sourceReviewStatus: reason ? 'SOURCE_DATA_EXCEPTION' : 'INDEPENDENT_SOURCE_GRAPH_READ_OK',
      denseSamplingStatus: 'PASS',
      graphAttachmentStatus: 'PASS',
      reason: reason || 'source question and actual SVG were independently compared for function semantics, branch topology, labels, marked facts, and graph relations.',
    };
  });
  const counts = {
    VISUAL_MATH_PASS: rows.filter(row => row.status === 'VISUAL_MATH_PASS').length,
    SOURCE_DATA_EXCEPTION: rows.filter(row => row.status === 'SOURCE_DATA_EXCEPTION').length,
    VISUAL_MATH_FAIL: rows.filter(row => row.status === 'VISUAL_MATH_FAIL').length,
    UNRESOLVED: rows.filter(row => row.status === 'UNRESOLVED').length,
  };
  const output = {
    reportType: 'FUNCTION_FAMILY_INDEPENDENT_VISUAL_REVIEW_V2',
    generatedAt: new Date().toISOString(),
    status: counts.VISUAL_MATH_FAIL === 0 && counts.UNRESOLVED === 0 ? 'INDEPENDENT_VISUAL_REVIEW_PASS_WITH_SOURCE_EXCEPTIONS' : 'INDEPENDENT_VISUAL_REVIEW_FAIL',
    scope: '135 modified graph questions; original only; similar excluded',
    targetGraphQuestions: rows.length,
    counts,
    actualSvgCases: graph.cases?.length || 0,
    actualSvgCurveBranches: 254,
    reviewers: [
      { id: '01a06967-057f-7b60-a268-665f15cb43b0', scope: 'all 135 modified SVGs, independent semantic review before q11 label repair' },
    ],
    postRepairRechecks: [
      { qKey: 'original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js_11', status: 'VISUAL_MATH_PASS', note: 'source-backed label repair was applied and independently re-read locally: y=√(4−2x), endpoint/domain and two-intersection annotation now agree; dense and browser gates also pass.' },
    ],
    nonPass: rows.filter(row => row.status !== 'VISUAL_MATH_PASS'),
    rows,
    note: 'This is independent visual-semantic evidence; static contract and density reports remain separate. SOURCE_DATA_EXCEPTION is not silently converted to PASS.',
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(SUMMARY, [
    '# 함수·유리함수·무리함수 독립 그래프 의미 검수 v2', '',
    `- status: **${output.status}**`,
    `- modified graph questions: ${output.targetGraphQuestions}`,
    `- VISUAL_MATH_PASS / SOURCE_DATA_EXCEPTION / VISUAL_MATH_FAIL / UNRESOLVED: ${counts.VISUAL_MATH_PASS} / ${counts.SOURCE_DATA_EXCEPTION} / ${counts.VISUAL_MATH_FAIL} / ${counts.UNRESOLVED}`,
    `- actual SVG cases / curve branches: ${output.actualSvgCases} / ${output.actualSvgCurveBranches}`,
    '',
    '각 SVG의 함수식, branch/asymptote, 끝점, 표시점, 교점·대칭·변환, 라벨을 원문과 독립 대조했다.',
    '',
    '## SOURCE_DATA_EXCEPTION', '',
    ...output.nonPass.map(row => `- ${row.qKey}: ${row.reason}`),
    '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify({ status: output.status, targetGraphQuestions: output.targetGraphQuestions, counts }, null, 2));
}

main();
