import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const SOURCE_REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260904', 'modified-review');
const GRAPH_LEDGER_PATH = path.join(SOURCE_REPORT_DIR, 'function_family_pilot_graphs.json');
const INVENTORY_PATH = path.join(SOURCE_REPORT_DIR, 'post_upgrade_audit_v21', 'function_family_inventory.json');
const TARGETS_PATH = path.join(ARCHIVE, 'tools', 'function-family', 'modified_review_targets.json');
const A_JSON = path.join(REPORT_DIR, 'function_family_review_A_modified_v1.json');
const A_MD = path.join(REPORT_DIR, 'function_family_review_A_modified_v1.md');
const B_JSON = path.join(REPORT_DIR, 'function_family_review_B_modified_v1.json');
const B_MD = path.join(REPORT_DIR, 'function_family_review_B_modified_v1.md');

const FORBIDDEN_SOLUTION_RE = /미분|도함수|미적분|극한|행렬|벡터|대학수학/;
const FORBIDDEN_SVG_RE = /<\s*script\b|<\s*foreignObject\b|정답|보기|answer|choice/i;

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function loadBank(relativePath, cache) {
  if (cache.has(relativePath)) return cache.get(relativePath);
  const absolutePath = path.join(ARCHIVE, 'exams', relativePath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(absolutePath, 'utf8'), context, { filename: absolutePath, timeout: 5000 });
  const bank = Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
  cache.set(relativePath, bank);
  return bank;
}

function rowKey(row) {
  return `${row.sourceJsPath}_${row.id}`;
}

function readAttachmentLedger() {
  const ledgers = fs.readdirSync(SOURCE_REPORT_DIR)
    .filter((name) => /^function_family_(?:pilot|batch\d+)_attachment_ledger\.json$/.test(name))
    .sort();
  const entries = new Map();
  for (const name of ledgers) {
    const payload = JSON.parse(fs.readFileSync(path.join(SOURCE_REPORT_DIR, name), 'utf8'));
    for (const entry of payload.ledger || []) entries.set(entry.qKey, { ...entry, ledgerFile: name });
  }
  return entries;
}

function parseAttr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}="([^"]+)"`));
  return match ? match[1] : null;
}

function numericValues(text, pattern) {
  const values = [];
  for (const match of text.matchAll(pattern)) values.push(Number(match[1]));
  return values;
}

function inspectSvg(caseRow) {
  const absolutePath = path.join(ARCHIVE, caseRow.assetRef.replaceAll('/', path.sep));
  const failures = [];
  if (!fs.existsSync(absolutePath)) return { status: 'FAIL', failures: ['ASSET_MISSING'] };
  const svg = fs.readFileSync(absolutePath, 'utf8');
  const rootMatch = svg.match(/<svg\b[^>]*>/i);
  if (!rootMatch) failures.push('SVG_ROOT_MISSING');
  const root = rootMatch?.[0] || '';
  if (parseAttr(root, 'data-graph-case') !== caseRow.caseId) failures.push('CASE_ID_MISMATCH');
  if (parseAttr(root, 'data-fact-hash') !== caseRow.factHash) failures.push('FACT_HASH_MISMATCH');
  if (parseAttr(root, 'data-visual-provenance') !== 'reconstructed_from_independent_solution_facts') failures.push('PROVENANCE_MISMATCH');
  const width = Number(parseAttr(root, 'width'));
  const height = Number(parseAttr(root, 'height'));
  const viewBox = (parseAttr(root, 'viewBox') || '').trim().split(/\s+/).map(Number);
  if (!(width > 0 && height > 0)) failures.push('DIMENSION_INVALID');
  if (viewBox.length !== 4 || viewBox.some((value) => !Number.isFinite(value)) || viewBox[2] <= 0 || viewBox[3] <= 0) failures.push('VIEWBOX_INVALID');
  if (FORBIDDEN_SVG_RE.test(svg)) failures.push('FORBIDDEN_TOKEN');
  const textNodes = [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)].map((match) => match[1].replace(/<[^>]+>/g, '').trim());
  if (textNodes.length === 0 || textNodes.some((text) => !text)) failures.push('TEXT_LABEL_EMPTY');
  const bounds = viewBox.length === 4 ? { x: viewBox[0], y: viewBox[1], width: viewBox[2], height: viewBox[3] } : null;
  if (bounds) {
    const xValues = numericValues(svg, /\bx(?:1|2|)?="(-?\d+(?:\.\d+)?)"/g);
    const yValues = numericValues(svg, /\by(?:1|2|)?="(-?\d+(?:\.\d+)?)"/g);
    const cxValues = numericValues(svg, /\bcx="(-?\d+(?:\.\d+)?)"/g);
    const cyValues = numericValues(svg, /\bcy="(-?\d+(?:\.\d+)?)"/g);
    const allX = [...xValues, ...cxValues];
    const allY = [...yValues, ...cyValues];
    if (allX.some((value) => value < bounds.x - 0.01 || value > bounds.x + bounds.width + 0.01)) failures.push('X_COORDINATE_OUT_OF_VIEWBOX');
    if (allY.some((value) => value < bounds.y - 0.01 || value > bounds.y + bounds.height + 0.01)) failures.push('Y_COORDINATE_OUT_OF_VIEWBOX');
    for (const match of svg.matchAll(/\bpoints="([^"]+)"/g)) {
      const numbers = match[1].trim().split(/[\s,]+/).map(Number);
      for (let index = 0; index + 1 < numbers.length; index += 2) {
        if (numbers[index] < bounds.x - 0.01 || numbers[index] > bounds.x + bounds.width + 0.01) failures.push('POLYLINE_X_OUT_OF_VIEWBOX');
        if (numbers[index + 1] < bounds.y - 0.01 || numbers[index + 1] > bounds.y + bounds.height + 0.01) failures.push('POLYLINE_Y_OUT_OF_VIEWBOX');
      }
    }
  }
  return {
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
    bytes: fs.statSync(absolutePath).size,
    width,
    height,
    viewBox,
    textLabelCount: textNodes.length,
  };
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const graphLedger = JSON.parse(fs.readFileSync(GRAPH_LEDGER_PATH, 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8')).rows;
  const inventoryByKey = new Map(inventory.map((row) => [rowKey(row), row]));
  const attachments = readAttachmentLedger();
  const cache = new Map();
  const cases = graphLedger.cases;
  const sourceFiles = [...new Set(cases.map((row) => row.sourceJsPath))].sort();
  fs.writeFileSync(TARGETS_PATH, JSON.stringify({ reportType: 'FUNCTION_FAMILY_MODIFIED_REVIEW_TARGETS', questionCount: cases.length, sourceCount: sourceFiles.length, sourceFiles }, null, 2) + '\n', 'utf8');

  const aRows = cases.map((caseRow) => {
    const key = rowKey(caseRow);
    const inventoryRow = inventoryByKey.get(key);
    const question = inventoryRow ? loadBank(caseRow.sourceJsPath, cache).find((item) => Number(item.id) === Number(caseRow.id)) : null;
    const attachment = attachments.get(key);
    const solution = String(question?.solution || '');
    const answer = String(question?.answer || '').trim();
    const choiceConclusion = Array.isArray(question?.choices) && question.choices.length > 0
      ? solution.includes(`정답은 ${answer}`)
      : /따라서/.test(solution);
    const checks = {
      sourceQuestion: Boolean(question),
      solutionNonEmpty: solution.trim().length > 0,
      solutionConclusion: /따라서/.test(solution),
      curriculumMethodGate: !FORBIDDEN_SOLUTION_RE.test(solution),
      answerConclusion: choiceConclusion,
      sourceSolutionImageMatches: question?.solutionImage === caseRow.assetRef,
      assetExists: Boolean(question?.solutionImage) && fs.existsSync(path.join(ARCHIVE, question.solutionImage.replaceAll('/', path.sep))),
      attachmentLedgerPresent: Boolean(attachment),
      protectedPayloadParity: Boolean(attachment && attachment.beforeProtectedHash === attachment.afterProtectedHash),
      rendererMathEvidence: caseRow.status === 'PASS' && Boolean(caseRow.assetSha256),
    };
    return {
      caseId: caseRow.caseId,
      qKey: key,
      sourceJsPath: caseRow.sourceJsPath,
      id: caseRow.id,
      visualKind: caseRow.visualKind,
      factHash: caseRow.factHash,
      checks,
      status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL',
      failureCodes: Object.entries(checks).filter(([, pass]) => !pass).map(([name]) => name),
    };
  });
  const aSummary = {
    modifiedQuestionCount: aRows.length,
    modifiedSourceFileCount: sourceFiles.length,
    sourceQuestionPass: aRows.filter((row) => row.checks.sourceQuestion).length,
    solutionPass: aRows.filter((row) => row.checks.solutionNonEmpty && row.checks.solutionConclusion && row.checks.curriculumMethodGate).length,
    answerConclusionPass: aRows.filter((row) => row.checks.answerConclusion).length,
    sourceAttachmentPass: aRows.filter((row) => row.checks.sourceSolutionImageMatches && row.checks.assetExists).length,
    protectedPayloadParityPass: aRows.filter((row) => row.checks.protectedPayloadParity).length,
    rendererMathEvidencePass: aRows.filter((row) => row.checks.rendererMathEvidence).length,
    failures: aRows.filter((row) => row.status !== 'PASS').length,
  };
  const aOutput = {
    reportType: 'FUNCTION_FAMILY_REVIEW_A_MODIFIED_QUESTIONS',
    generatedAt: new Date().toISOString(),
    status: aSummary.failures === 0 ? 'REVIEW_A_PASS' : 'REVIEW_A_FAIL',
    passDefinition: '원문 문항 존재·solution 결론·교육과정 방법·answer 결론·solutionImage 연결·자산 존재·attachment 보호 parity·graph ledger 수학 evidence를 수정 문항마다 확인',
    summary: aSummary,
    rows: aRows,
  };
  fs.writeFileSync(A_JSON, JSON.stringify(aOutput, null, 2) + '\n', 'utf8');
  fs.writeFileSync(A_MD, [
    '# 1차 독립검수 — 수정 문항만', '',
    `- 상태: **${aOutput.status}**`,
    `- 수정 문항: ${aSummary.modifiedQuestionCount}`,
    `- 수정 source JS: ${aSummary.modifiedSourceFileCount}`, 
    `- source question: ${aSummary.sourceQuestionPass}/${aSummary.modifiedQuestionCount}`,
    `- solution 구조·교육과정: ${aSummary.solutionPass}/${aSummary.modifiedQuestionCount}`,
    `- answer 결론: ${aSummary.answerConclusionPass}/${aSummary.modifiedQuestionCount}`,
    `- source solutionImage·asset: ${aSummary.sourceAttachmentPass}/${aSummary.modifiedQuestionCount}`,
    `- protected payload parity: ${aSummary.protectedPayloadParityPass}/${aSummary.modifiedQuestionCount}`,
    `- graph ledger math evidence: ${aSummary.rendererMathEvidencePass}/${aSummary.modifiedQuestionCount}`,
    `- failures: ${aSummary.failures}`,
    '',
    '검수 범위는 graph ledger에 등록된 실제 수정 135문항으로 제한했다. 원문 content/choices/answer/image는 읽기 전용으로 취급했고, answer 결론·solution 구조·교육과정 금지 방법·sourceImage 연결·보호 hash parity를 별도 확인했다.',
    '',
  ].join('\n'), 'utf8');

  const bRows = cases.map((caseRow) => ({ caseId: caseRow.caseId, qKey: rowKey(caseRow), sourceJsPath: caseRow.sourceJsPath, id: caseRow.id, ...inspectSvg(caseRow) }));
  const bSummary = {
    modifiedGraphCount: bRows.length,
    svgRootPass: bRows.filter((row) => row.status === 'PASS').length,
    failures: bRows.filter((row) => row.status !== 'PASS').length,
    forbiddenTokenFailures: bRows.filter((row) => row.failures.includes('FORBIDDEN_TOKEN')).length,
    caseFactProvenanceFailures: bRows.filter((row) => row.failures.some((code) => ['CASE_ID_MISMATCH', 'FACT_HASH_MISMATCH', 'PROVENANCE_MISMATCH'].includes(code))).length,
    coordinateViewBoxFailures: bRows.filter((row) => row.failures.some((code) => code.includes('OUT_OF_VIEWBOX'))).length,
  };
  const bOutput = {
    reportType: 'FUNCTION_FAMILY_REVIEW_B_MODIFIED_VISUALS',
    generatedAt: new Date().toISOString(),
    status: bSummary.failures === 0 ? 'REVIEW_B_PASS' : 'REVIEW_B_FAIL',
    passDefinition: 'SVG root·case id·fact hash·visual provenance·dimension/viewBox·좌표 범위·비공백 라벨·금지 토큰을 기존 visual contract와 독립적인 문자열/좌표 검사로 확인',
    summary: bSummary,
    rows: bRows,
  };
  fs.writeFileSync(B_JSON, JSON.stringify(bOutput, null, 2) + '\n', 'utf8');
  fs.writeFileSync(B_MD, [
    '# 2차 독립검수 — 수정 SVG만', '',
    `- 상태: **${bOutput.status}**`,
    `- 수정 SVG: ${bSummary.modifiedGraphCount}`,
    `- SVG contract independent rows: ${bSummary.svgRootPass}/${bSummary.modifiedGraphCount}`,
    `- case/fact/provenance failures: ${bSummary.caseFactProvenanceFailures}`,
    `- coordinate/viewBox failures: ${bSummary.coordinateViewBoxFailures}`,
    `- forbidden-token failures: ${bSummary.forbiddenTokenFailures}`,
    `- failures: ${bSummary.failures}`,
    '',
    '이 검사는 기존 `verify-function-family-visuals.mjs`와 별도로 SVG 원문을 다시 읽어 수행했다. 정답·보기·답안 토큰, script/foreignObject, case/fact/provenance 불일치, viewBox 밖 좌표, 빈 라벨을 fail-closed로 판정했다.',
    '',
  ].join('\n'), 'utf8');

  console.log(JSON.stringify({ reviewA: aOutput.status, reviewB: bOutput.status, reviewASummary: aSummary, reviewBSummary: bSummary, targets: { questions: cases.length, sourceFiles: sourceFiles.length, path: TARGETS_PATH } }, null, 2));
}

main();
