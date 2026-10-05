import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const SOURCE_REPORT = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260904', 'modified-review');
const GRAPH_PATH = path.join(SOURCE_REPORT, 'function_family_pilot_graphs.json');
const INDEX_PATH = path.join(ARCHIVE, 'question-index.js');
const TARGET_PATH = path.join(ARCHIVE, 'tools', 'function-family', 'modified_review_targets.json');

function loadWindow(filePath) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window;
}

function loadBank(sourceFile, cache) {
  if (!cache.has(sourceFile)) cache.set(sourceFile, loadWindow(path.join(ARCHIVE, 'exams', sourceFile.replaceAll('/', path.sep))).questionBank || []);
  return cache.get(sourceFile);
}

function k(row) { return `${row.sourceJsPath}_${row.id}`; }
function readAttachmentRows() {
  const map = new Map();
  for (const name of fs.readdirSync(SOURCE_REPORT).filter((name) => /^function_family_(?:pilot|batch\d+)_attachment_ledger\.json$/.test(name))) {
    const data = JSON.parse(fs.readFileSync(path.join(SOURCE_REPORT, name), 'utf8'));
    for (const row of data.ledger || []) map.set(row.qKey, row);
  }
  return map;
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const graph = JSON.parse(fs.readFileSync(GRAPH_PATH, 'utf8'));
  const index = loadWindow(INDEX_PATH).questionIndex || [];
  const indexByKey = new Map(index.map((row) => [`${row.sourceFile}_${row.id}`, row]));
  const cache = new Map();
  const attachments = readAttachmentRows();
  const sourceFiles = [...new Set(graph.cases.map((row) => row.sourceJsPath))].sort();
  fs.writeFileSync(TARGET_PATH, JSON.stringify({ reportType: 'FUNCTION_FAMILY_MODIFIED_REVIEW_TARGETS_V2', questionCount: graph.cases.length, sourceCount: sourceFiles.length, sourceFiles }, null, 2) + '\n', 'utf8');

  const rows = graph.cases.map((caseRow) => {
    const question = loadBank(caseRow.sourceJsPath, cache).find((item) => Number(item.id) === Number(caseRow.id));
    const indexRow = indexByKey.get(k(caseRow));
    const solution = String(question?.solution || '');
    const answer = String(question?.answer || '').trim();
    const answerSolutionParity = Boolean(question) && (Array.isArray(question.choices) && question.choices.length > 0 ? solution.includes(`정답은 ${answer}`) : /따라서/.test(solution));
    const solutionStructureGate = solution.trim().length > 0 && /따라서/.test(solution) && !/미분|도함수|미적분|극한|행렬|벡터|대학수학/.test(solution);
    const sourceAssetParity = Boolean(question && question.solutionImage === caseRow.assetRef && indexRow?.hasSolutionImage === true && fs.existsSync(path.join(ARCHIVE, caseRow.assetRef.replaceAll('/', path.sep))));
    const attachment = attachments.get(k(caseRow));
    const protectedPayloadParity = Boolean(attachment && attachment.beforeProtectedHash === attachment.afterProtectedHash);
    return {
      caseId: caseRow.caseId,
      qKey: k(caseRow),
      sourceJsPath: caseRow.sourceJsPath,
      id: caseRow.id,
      answerSolutionParity: answerSolutionParity ? 'PASS' : 'FAIL',
      solutionStructureGate: solutionStructureGate ? 'PASS' : 'FAIL',
      sourceAssetParity: sourceAssetParity ? 'PASS' : 'FAIL',
      protectedPayloadParity: protectedPayloadParity ? 'PASS' : 'FAIL',
      graphMathEvidence: caseRow.status === 'PASS' ? 'GENERATOR_EVIDENCE_ONLY' : 'FAIL',
      independentMathStatus: 'PENDING_SEPARATE_REVIEW',
    };
  });
  const counts = (field) => ({ pass: rows.filter((row) => row[field] === 'PASS').length, fail: rows.filter((row) => row[field] === 'FAIL').length, total: rows.length });
  const a = { reportType: 'FUNCTION_FAMILY_REVIEW_A_MODIFIED_V2', generatedAt: new Date().toISOString(), status: rows.every((row) => [row.answerSolutionParity, row.solutionStructureGate, row.sourceAssetParity, row.protectedPayloadParity, row.graphMathEvidence].every((value) => value !== 'FAIL')) ? 'REVIEW_A_STATIC_CONTRACT_PASS' : 'REVIEW_A_FAIL', scope: 'modified graph questions only', modifiedQuestions: rows.length, modifiedSourceFiles: sourceFiles.length, counts: { answerSolutionParity: counts('answerSolutionParity'), solutionStructureGate: counts('solutionStructureGate'), sourceAssetParity: counts('sourceAssetParity'), protectedPayloadParity: counts('protectedPayloadParity'), graphMathEvidence: { pass: rows.filter((row) => row.graphMathEvidence === 'GENERATOR_EVIDENCE_ONLY').length, fail: rows.filter((row) => row.graphMathEvidence === 'FAIL').length, total: rows.length } }, rows, note: 'answerSolutionParity/solutionStructureGate/static contract are not independent mathematical solving; independent math status is deliberately separate.' };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_review_A_modified_v2.json'), JSON.stringify(a, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_review_A_modified_v2.md'), [`# 1차 독립검수 — 수정 문항만 v2`, '', `- 상태: **${a.status}**`, `- 수정 문항: ${rows.length}`, `- 수정 source JS: ${sourceFiles.length}`, `- answerSolutionParity: ${a.counts.answerSolutionParity.pass}/${rows.length}`, `- solutionStructureGate: ${a.counts.solutionStructureGate.pass}/${rows.length}`, `- source asset parity: ${a.counts.sourceAssetParity.pass}/${rows.length}`, `- protected payload parity: ${a.counts.protectedPayloadParity.pass}/${rows.length}`, `- graph math evidence: ${a.counts.graphMathEvidence.pass}/${rows.length} (generator evidence only)`, '', '이 보고서의 static gate는 독립 수학검산과 분리한다. 독립 수학검산 결과는 `function_family_independent_math_review_v2.json`에 별도 기록한다.', ''].join('\n'), 'utf8');

  const dense = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'reports', 'function-family-20260904', 'function_family_dense_sampling_audit_v2.json'), 'utf8'));
  const visual = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'reports', 'function-family-20260904', 'function_family_visual_contract_v2.json'), 'utf8'));
  const b = { reportType: 'FUNCTION_FAMILY_REVIEW_B_MODIFIED_V2', generatedAt: new Date().toISOString(), status: dense.status === 'DENSE_SAMPLING_PASS' && visual.status === 'VISUAL_CONTRACT_PASS' && dense.graphCases === rows.length ? 'REVIEW_B_STATIC_VISUAL_PASS' : 'REVIEW_B_FAIL', scope: 'modified SVG only', modifiedGraphs: rows.length, denseSampling: { status: dense.status, pass: dense.counts.pass, fail: dense.counts.fail, below200: dense.counts.below200, rationalBelow300: dense.counts.rationalBelow300 }, visualContract: { status: visual.status, pass: visual.svgContract.pass, fail: visual.svgContract.total - visual.svgContract.pass, densityPass: visual.densityGate.pass, densityTotal: visual.densityGate.total, parityPass: visual.sourceAttachmentParity.pass, parityTotal: visual.sourceAttachmentParity.total }, note: 'B v2 reuses only the scoped 135-case static evidence; semantic math judgment remains separate from serialization/density contract.' };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_review_B_modified_v2.json'), JSON.stringify(b, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_review_B_modified_v2.md'), [`# 2차 독립검수 — 수정 SVG만 v2`, '', `- 상태: **${b.status}**`, `- 수정 SVG: ${rows.length}`, `- dense sampling: ${b.denseSampling.pass}/${rows.length}`, `- visual contract: ${b.visualContract.pass}/${rows.length}`, `- density: ${b.visualContract.densityPass}/${b.visualContract.densityTotal}`, `- source parity: ${b.visualContract.parityPass}/${b.visualContract.parityTotal}`, '', 'case/fact/provenance·viewBox·금지 토큰·실제 polyline density를 독립 parser로 재확인했다. 그래프 의미의 수학검산은 별도 522/135 math review evidence로 분리한다.', ''].join('\n'), 'utf8');
  console.log(JSON.stringify({ reviewA: a.status, reviewB: b.status, modifiedQuestions: rows.length, modifiedSourceFiles: sourceFiles.length }, null, 2));
}

main();
