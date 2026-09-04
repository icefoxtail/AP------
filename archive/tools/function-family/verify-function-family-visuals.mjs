import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');
const GRAPH_LEDGER = path.join(REPORT_DIR, 'function_family_pilot_graphs.json');
const INDEX_PATH = path.join(ARCHIVE, 'question-index.js');
const TARGET_KEYS = new Set(['H15-SB-03', 'H15-SB-04', 'H15-SB-05', 'H22-C2-07', 'H22-C2-08', 'H22-C2-09']);
const PROVENANCE = 'reconstructed_from_independent_solution_facts';

function loadWindow(filePath, label) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: label || filePath, timeout: 5000 });
  return context.window;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function sampleCountFromPolyline(points) {
  const numbers = String(points).trim().split(/[\s,]+/).filter(Boolean).map(Number);
  return numbers.length >= 4 && numbers.length % 2 === 0 ? numbers.length / 2 : 0;
}

function readIndex() {
  return loadWindow(INDEX_PATH, INDEX_PATH).questionIndex || [];
}

function loadBank(sourceFile, cache) {
  if (cache.has(sourceFile)) return cache.get(sourceFile);
  const filePath = path.join(ARCHIVE, 'exams', sourceFile.replaceAll('/', path.sep));
  const bank = loadWindow(filePath, sourceFile).questionBank || [];
  cache.set(sourceFile, bank);
  return bank;
}

function checkSvg(row) {
  const filePath = path.join(ARCHIVE, row.assetRef.replaceAll('/', path.sep));
  const errors = [];
  if (!fs.existsSync(filePath)) return { caseId: row.caseId, assetRef: row.assetRef, status: 'FAIL', errors: ['asset-missing'] };
  const raw = fs.readFileSync(filePath, 'utf8');
  const caseMatch = raw.match(/data-graph-case="([^"]+)"/);
  const factMatch = raw.match(/data-fact-hash="([^"]+)"/);
  const provenanceMatch = raw.match(/data-visual-provenance="([^"]+)"/);
  if (!/<svg\b[^>]*\bviewBox="[^"]+"/i.test(raw)) errors.push('viewBox-missing');
  if (!caseMatch || caseMatch[1] !== row.caseId) errors.push('case-id-mismatch');
  if (!factMatch || factMatch[1] !== row.factHash) errors.push('fact-hash-mismatch');
  if (!provenanceMatch || provenanceMatch[1] !== PROVENANCE) errors.push('provenance-mismatch');
  if (/<\/?(?:script|foreignObject)\b/i.test(raw)) errors.push('unsafe-svg-element');
  if (/(?:정답|answer|choice|보기)/iu.test(raw)) errors.push('answer-leak-token');
  if (/<br\b/i.test(raw)) errors.push('br-element');
  if (/\\(?:frac|sqrt|begin|end|left|right)|\$(?:[^$]|\$)+\$/i.test(raw)) errors.push('latex-token');
  const polylineSampleCounts = [...raw.matchAll(/<polyline\b[^>]*\bpoints="([^"]+)"/gi)].map((match) => sampleCountFromPolyline(match[1]));
  const expectedCurveSampleCounts = Array.isArray(row.curveSampleCounts) ? row.curveSampleCounts : [];
  if (polylineSampleCounts.length !== expectedCurveSampleCounts.length) errors.push('curve-polyline-count-mismatch');
  if (polylineSampleCounts.some((count, index) => count !== expectedCurveSampleCounts[index])) errors.push('curve-polyline-sample-count-mismatch');
  const minimum = row.visualKind === 'RATIONAL_GRAPH' ? 300 : 200;
  const densityFailures = expectedCurveSampleCounts.flatMap((count, index) => count > 0 && count < minimum ? [{ index, count, minimum }] : []);
  if (densityFailures.length) errors.push('sample-density-below-policy');
  return { caseId: row.caseId, assetRef: row.assetRef, bytes: Buffer.byteLength(raw), assetSha256: sha256(raw), curveSampleCounts: polylineSampleCounts, expectedCurveSampleCounts, minimumCurveSampleCount: minimum, densityFailures, status: errors.length ? 'FAIL' : 'PASS', errors };
}

function main() {
  const ledger = JSON.parse(fs.readFileSync(GRAPH_LEDGER, 'utf8'));
  const index = readIndex();
  const targetRows = index.filter((row) => row.sourceFile?.startsWith('original/') && TARGET_KEYS.has(row.standardUnitKey));
  const sourceCache = new Map();
  const sourceChecks = [];
  const sourceByKey = new Map();
  for (const row of targetRows) {
    const key = `${row.sourceFile}_${row.id}`;
    const bank = loadBank(row.sourceFile, sourceCache);
    const question = bank.find((item) => Number(item.id) === Number(row.id));
    const errors = [];
    if (!question) errors.push('source-question-missing');
    if (question && Boolean(question.solutionImage) !== Boolean(row.hasSolutionImage)) errors.push('index-solution-image-presence-mismatch');
    if (question?.solutionImage && !fs.existsSync(path.join(ARCHIVE, question.solutionImage.replaceAll('/', path.sep)))) errors.push('source-solution-asset-missing');
    if (!question?.content) errors.push('content-missing');
    if (question?.answer === undefined || question?.answer === null || String(question.answer).trim() === '') errors.push('answer-missing');
    if (!question?.solution) errors.push('solution-missing');
    const check = { qKey: key, sourceFile: row.sourceFile, id: row.id, status: errors.length ? 'FAIL' : 'PASS', errors };
    sourceChecks.push(check);
    sourceByKey.set(key, question);
  }

  const caseIds = ledger.cases.map((row) => row.caseId);
  const assetRefs = ledger.cases.map((row) => row.assetRef);
  const duplicateCaseIds = [...new Set(caseIds.filter((id, i) => caseIds.indexOf(id) !== i))];
  const duplicateAssetRefs = [...new Set(assetRefs.filter((ref, i) => assetRefs.indexOf(ref) !== i))];
  const svgChecks = ledger.cases.map(checkSvg);
  const ledgerSourceChecks = ledger.cases.map((row) => {
    const question = sourceByKey.get(`${row.sourceJsPath}_${row.id}`);
    const errors = [];
    if (!question) errors.push('ledger-source-question-missing');
    else if (question.solutionImage !== row.assetRef) errors.push('ledger-source-asset-ref-mismatch');
    return { caseId: row.caseId, qKey: `${row.sourceJsPath}_${row.id}`, status: errors.length ? 'FAIL' : 'PASS', errors };
  });

  const sourceSolutionImageCount = targetRows.filter((row) => sourceByKey.get(`${row.sourceFile}_${row.id}`)?.solutionImage).length;
  const preexistingSolutionImageCount = sourceSolutionImageCount - ledger.cases.length;
  const densityChecks = ledger.cases.map((row, index) => ({ caseId: row.caseId, visualKind: row.visualKind, expected: row.curveSampleCounts || [], actual: svgChecks[index].curveSampleCounts || [], minimum: row.visualKind === 'RATIONAL_GRAPH' ? 300 : 200, status: svgChecks[index].densityFailures?.length ? 'FAIL' : 'PASS' }));
  const output = {
    reportType: 'FUNCTION_FAMILY_VISUAL_CONTRACT_VERIFICATION_V2',
    generatedAt: new Date().toISOString(),
    status: targetRows.length === 522 && sourceChecks.every((row) => row.status === 'PASS') && ledger.status === 'PASS' && ledger.cases.length > 0 && svgChecks.every((row) => row.status === 'PASS') && densityChecks.every((row) => row.status === 'PASS') && ledgerSourceChecks.every((row) => row.status === 'PASS') && duplicateCaseIds.length === 0 && duplicateAssetRefs.length === 0 && preexistingSolutionImageCount >= 0 ? 'VISUAL_CONTRACT_PASS' : 'VISUAL_CONTRACT_FAIL',
    targetCount: targetRows.length,
    targetSourceFileCount: sourceCache.size,
    sourceRuntime: { status: sourceChecks.every((row) => row.status === 'PASS') ? 'PASS' : 'FAIL', pass: sourceChecks.filter((row) => row.status === 'PASS').length, total: sourceChecks.length, failures: sourceChecks.filter((row) => row.status === 'FAIL') },
    graphLedger: { status: ledger.status, cases: ledger.cases.length, pass: ledger.cases.filter((row) => row.status === 'PASS').length, sourceSolutionImageCount, preexistingSolutionImageCount },
    svgContract: { status: svgChecks.every((row) => row.status === 'PASS') ? 'PASS' : 'FAIL', pass: svgChecks.filter((row) => row.status === 'PASS').length, total: svgChecks.length, failures: svgChecks.filter((row) => row.status === 'FAIL'), duplicateCaseIds, duplicateAssetRefs },
    densityGate: { status: densityChecks.every((row) => row.status === 'PASS') ? 'PASS' : 'FAIL', pass: densityChecks.filter((row) => row.status === 'PASS').length, total: densityChecks.length, failures: densityChecks.filter((row) => row.status === 'FAIL'), policy: 'RATIONAL_GRAPH curves >=300 points per branch; other nonlinear curves >=200 points' },
    sourceAttachmentParity: { status: ledgerSourceChecks.every((row) => row.status === 'PASS') ? 'PASS' : 'FAIL', pass: ledgerSourceChecks.filter((row) => row.status === 'PASS').length, total: ledgerSourceChecks.length, failures: ledgerSourceChecks.filter((row) => row.status === 'FAIL') },
    forbiddenTokenPolicy: 'SVG must not contain script, foreignObject, answer, choice, 보기, or 정답 tokens.',
    interpretation: 'This verifies generated visual assets, actual SVG polyline density, and source/index contracts. It does not by itself adjudicate VISUAL_REQUIRED versus OPTIONAL/EXEMPT for no-image questions.',
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const outputPath = path.resolve(process.argv[2] || path.join(REPORT_DIR, 'function_family_visual_contract_v1.json'));
  const summaryPath = outputPath.replace(/\.json$/i, '.md');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(summaryPath, [
    '# Function-family visual contract verification v2', '',
    `- 상태: **${output.status}**`,
    `- target: ${output.targetCount}문항 / ${output.targetSourceFileCount} source JS`,
    `- graph ledger: ${output.graphLedger.pass}/${output.graphLedger.cases} PASS`,
    `- SVG contract: ${output.svgContract.pass}/${output.svgContract.total} PASS`,
    `- dense sampling gate: ${output.densityGate.pass}/${output.densityGate.total} PASS`,
    `- source attachment parity: ${output.sourceAttachmentParity.pass}/${output.sourceAttachmentParity.total} PASS`,
    '',
    output.interpretation,
    '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify(output, null, 2));
}

main();
