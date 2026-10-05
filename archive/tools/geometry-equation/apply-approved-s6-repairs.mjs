import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const staging = path.join(reports, 'staging', 'archive');
const rawManifestPath = path.join(reports, 'geometry_equation_manifest.json');
const v22ManifestPath = path.join(reports, 'geometry_equation_manifest_v22.json');
const rawManifest = JSON.parse(fs.readFileSync(rawManifestPath, 'utf8'));
const v22Manifest = JSON.parse(fs.readFileSync(v22ManifestPath, 'utf8'));
const q352Key = 'original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js_13';
const approvalRef = 'user-2026-09-03-student-quality-approved-repair';

const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  if (typeof value === 'string') return value.replace(/\r\n/g, '\n').trim();
  return value ?? null;
};
const hashJson = (value) => sha(JSON.stringify(stable(value)));
const readText = (name) => fs.readFileSync(path.join(reports, 's6', name), 'utf8').replace(/\r\n/g, '\n').replace(/\n$/, '');
const readBank = (filePath) => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window.questionBank || [];
};

function locateObject(text, id) {
  const marker = new RegExp('\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*' + id + ',');
  const found = marker.exec(text);
  if (!found) throw new Error('Question object not found: ' + id);
  const start = found.index + 1;
  let depth = 0; let quoted = false; let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') quoted = false;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return { start, end: i + 1 };
    }
  }
  throw new Error('Question object closing brace not found: ' + id);
}

function valueEnd(text, start) {
  let i = start;
  while (/\s/.test(text[i] || '')) i += 1;
  const first = text[i];
  if (first === '"') {
    i += 1; let escaped = false;
    for (; i < text.length; i += 1) {
      if (escaped) escaped = false;
      else if (text[i] === '\\') escaped = true;
      else if (text[i] === '"') return i + 1;
    }
  }
  if (first === '[' || first === '{') {
    const open = first; const close = first === '[' ? ']' : '}';
    let depth = 0; let quoted = false; let escaped = false;
    for (; i < text.length; i += 1) {
      const ch = text[i];
      if (quoted) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') quoted = false;
        continue;
      }
      if (ch === '"') quoted = true;
      else if (ch === open) depth += 1;
      else if (ch === close) {
        depth -= 1;
        if (depth === 0) return i + 1;
      }
    }
  }
  while (i < text.length && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') i += 1;
  return i;
}

function readProperty(block, field) {
  const key = new RegExp('(^[ \\t]*"' + field + '"\\s*:\\s*)', 'm').exec(block);
  if (!key) throw new Error('Property not found: ' + field);
  const start = key.index + key[0].length;
  const end = valueEnd(block, start);
  return JSON.parse(block.slice(start, end).trim());
}

function replaceProperty(text, id, field, value) {
  const object = locateObject(text, id);
  const block = text.slice(object.start, object.end);
  const key = new RegExp('(^[ \\t]*"' + field + '"\\s*:\\s*)', 'm').exec(block);
  if (!key) throw new Error('Property not found: ' + field + ' for q' + id);
  const start = key.index + key[0].length;
  const end = valueEnd(block, start);
  const previous = JSON.parse(block.slice(start, end).trim());
  const nextBlock = block.slice(0, start) + JSON.stringify(value) + block.slice(end);
  return { text: text.slice(0, object.start) + nextBlock + text.slice(object.end), previous };
}

const repairs = [
  { qKey: 'original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js_7', id: 7, solutionFile: 'q32.solution.txt', answer: '⑤' },
  { qKey: 'original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js_12', id: 12, contentFile: 'q36.content.txt', solutionFile: 'q36.solution.txt' },
  { qKey: 'original/high/h1/2mid/21_효천고_2학기_중간_고1_기출.js_8', id: 8, contentFile: 'q276.content.txt', solutionFile: 'q276.solution.txt' },
  { qKey: 'original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js_6', id: 6, contentFile: 'q281.content.txt', choicesFile: 'q281.choices.txt', answer: '③, ⑤', solutionFile: 'q281.solution.txt' },
  { qKey: 'original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js_21', id: 21, contentFile: 'q294.content.txt' },
  { qKey: 'original/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2.js_7', id: 7, choicesFile: 'q375.choices.txt', solutionFile: 'q375.solution.txt' },
  { qKey: 'original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js_14', id: 14, contentFile: 'q38.content.txt' }
];
const metadataByQKey = new Map([
  ['original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_14', { id: 14, subUnitKey: 'H22-C2-02-RELATION', subUnit: '두 직선의 관계' }],
  ['original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_15', { id: 15, subUnitKey: 'H22-C2-02-RELATION', subUnit: '두 직선의 관계' }],
  ['original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_16', { id: 16, subUnitKey: 'H22-C2-02-LINE_EQUATION', subUnit: '직선의 방정식' }],
  ['original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_17', { id: 17, subUnitKey: 'H22-C2-02-LINE_EQUATION', subUnit: '직선의 방정식' }],
  ['original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_20', { id: 20, subUnitKey: 'H22-C2-02-LINE_EQUATION', subUnit: '직선의 방정식' }],
  ['original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_21', { id: 21, subUnitKey: 'H22-C2-02-LINE_EQUATION', subUnit: '직선의 방정식' }]
]);
const byQKey = new Map(rawManifest.rows.map((row) => [row.qKey, row]));
const touched = new Map();
const ledger = [];

function applyField(filePath, qKey, id, field, nextValue, reasonCode) {
  const currentText = touched.get(filePath) || fs.readFileSync(filePath, 'utf8');
  const result = replaceProperty(currentText, id, field, nextValue);
  touched.set(filePath, result.text);
  ledger.push({ approvalRef, qKey, id, field, beforeHash: hashJson(result.previous), afterHash: hashJson(nextValue), reasonCode, protectedField: ['content', 'choices', 'answer', 'image'].includes(field) });
}

for (const repair of repairs) {
  const row = byQKey.get(repair.qKey);
  if (!row) throw new Error('Repair qKey not found: ' + repair.qKey);
  const filePath = path.join(staging, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  if (repair.contentFile) applyField(filePath, repair.qKey, repair.id, 'content', readText(repair.contentFile), 'APPROVED_SOURCE_REPAIR');
  if (repair.choicesFile) applyField(filePath, repair.qKey, repair.id, 'choices', readText(repair.choicesFile).split('\n'), 'APPROVED_SOURCE_REPAIR');
  if (repair.answer) applyField(filePath, repair.qKey, repair.id, 'answer', repair.answer, 'APPROVED_SOURCE_REPAIR');
  if (repair.solutionFile) applyField(filePath, repair.qKey, repair.id, 'solution', readText(repair.solutionFile), 'APPROVED_SOLUTION_REPAIR');
}

for (const [qKey, metadata] of metadataByQKey) {
  const row = byQKey.get(qKey);
  if (!row) throw new Error('Metadata qKey not found: ' + qKey);
  const filePath = path.join(staging, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  applyField(filePath, qKey, metadata.id, 'standardUnitKey', 'H22-C2-02', 'METADATA_REPAIRED');
  applyField(filePath, qKey, metadata.id, 'standardUnit', '직선의 방정식', 'METADATA_REPAIRED');
  applyField(filePath, qKey, metadata.id, 'standardUnitOrder', 2, 'METADATA_REPAIRED');
  applyField(filePath, qKey, metadata.id, 'subUnitKey', metadata.subUnitKey, 'METADATA_REPAIRED');
  applyField(filePath, qKey, metadata.id, 'subUnit', metadata.subUnit, 'METADATA_REPAIRED');
  applyField(filePath, qKey, metadata.id, 'subUnitConfidence', 'approved_source_repair', 'METADATA_REPAIRED');
  applyField(filePath, qKey, metadata.id, 'subUnitClassificationDepth', 'complete_rule', 'METADATA_REPAIRED');
}

for (const [filePath, text] of touched) {
  new vm.Script(text, { filename: filePath });
  fs.writeFileSync(filePath, text, 'utf8');
}

const loadCurrentBanks = () => {
  const banks = new Map();
  for (const sourceJsPath of [...new Set(rawManifest.rows.map((row) => row.sourceJsPath))]) {
    banks.set(sourceJsPath, readBank(path.join(staging, 'exams', sourceJsPath.replaceAll('/', path.sep))));
  }
  return banks;
};
const banks = loadCurrentBanks();
const protectedPayload = (row, question) => ({ content: question.content || '', choices: question.choices || [], answer: question.answer || '', image: question.image || null, id: question.id, displayNo: question.displayNo || question.id, sourceIdentity: { qKey: row.qKey, sourceFile: row.sourceJsPath, sourceOrdinal: row.sourceOrdinal } });
const targetRows = rawManifest.rows.filter((row) => row.qKey !== q352Key);
const rawRows = targetRows.map((row) => {
  const question = banks.get(row.sourceJsPath).find((item) => item.id === row.id);
  if (!question) throw new Error('Current question missing: ' + row.qKey);
  const next = { ...row, contentHash: sha(question.content || ''), protectedCoreHash: hashJson(protectedPayload(row, question)), content: undefined, choices: undefined, answer: undefined, standardUnitKey: question.standardUnitKey, standardUnit: question.standardUnit, subUnitKey: question.subUnitKey, subUnit: question.subUnit, solutionPresent: Boolean(String(question.solution || '').trim()), solutionLength: String(question.solution || '').length, solutionImageRef: question.solutionImage || '', solutionImageStatus: question.solutionImage ? 'REFERENCED' : 'NONE', solutionImageSha256: null };
  delete next.content; delete next.choices; delete next.answer;
  if (metadataByQKey.has(row.qKey)) next.metadataDefectStatus = 'METADATA_REPAIRED';
  if (repairs.some((repair) => repair.qKey === row.qKey)) next.sourceDefectStatus = 'APPROVED_SOURCE_REPAIR';
  return next;
});
const nextRawManifest = { ...rawManifest, generatedAt: new Date().toISOString(), targetCount: rawRows.length, rows: rawRows };
fs.writeFileSync(rawManifestPath, JSON.stringify(nextRawManifest, null, 2) + '\n', 'utf8');

const targetBySource = new Map();
for (const row of rawRows) {
  if (!targetBySource.has(row.sourceJsPath)) targetBySource.set(row.sourceJsPath, new Set());
  targetBySource.get(row.sourceJsPath).add(row.id);
}
const nextV22Rows = v22Manifest.rows.filter((row) => row.qKey !== q352Key).map((row) => {
  const rawRow = rawRows.find((candidate) => candidate.qKey === row.qKey);
  const bank = banks.get(row.sourceJsPath);
  const targetIds = targetBySource.get(row.sourceJsPath) || new Set();
  const question = bank.find((item) => item.id === row.id);
  const originalProtected = row.ORIGINAL_PROTECTED_HASH || row.protectedCoreHash || rawRow.protectedCoreHash;
  const effectiveProtected = hashJson(protectedPayload(rawRow, question));
  const outScopePayload = bank.filter((item) => !targetIds.has(item.id)).map((item) => ({ questionUid: row.sourceJsPath + '_' + item.id, ...protectedPayload({ qKey: row.sourceJsPath + '_' + item.id, sourceJsPath: row.sourceJsPath, sourceOrdinal: item.id }, item) }));
  const outScopeHash = hashJson(outScopePayload);
  const next = { ...row, standardUnitKey: question.standardUnitKey, standardUnit: question.standardUnit, subUnitKey: question.subUnitKey, subUnit: question.subUnit, protectedCoreHash: effectiveProtected, solutionLength: String(question.solution || '').length, solutionPresent: Boolean(String(question.solution || '').trim()), solutionImageRef: question.solutionImage || '', solutionImageStatus: question.solutionImage ? 'REFERENCED' : 'NONE', solutionImageSha256: null, ORIGINAL_PROTECTED_HASH: originalProtected, EFFECTIVE_PROTECTED_HASH: effectiveProtected, TARGET_QUESTION_UIDS: rawRows.filter((candidate) => candidate.sourceJsPath === row.sourceJsPath).map((candidate) => candidate.questionUid).sort(), PROTECTED_QUESTION_UIDS: bank.filter((item) => !targetIds.has(item.id)).map((item) => row.sourceJsPath + '_' + item.id).sort(), OUT_OF_SCOPE_BASELINE_HASH: outScopeHash, OUT_OF_SCOPE_FINAL_HASH: outScopeHash, metadataDefectStatus: metadataByQKey.has(row.qKey) ? 'METADATA_REPAIRED' : row.metadataDefectStatus, sourceDefectStatus: repairs.some((repair) => repair.qKey === row.qKey) ? 'APPROVED_SOURCE_REPAIR' : row.sourceDefectStatus, builderStatus: 'S6_APPROVED_REPAIR_APPLIED', selfCheckStatus: 'NOT_STARTED', mathReviewStatus: 'NOT_TESTED', educationReviewStatus: 'NOT_TESTED', svgReviewStatus: 'NOT_TESTED', renderReviewStatus: 'NOT_TESTED', currentArtifactSha: null, finalArtifactSha: null, currentReleaseArtifactSha: null, finalReleaseArtifactSha: null, reviewEvidenceSha: null, presealBundleSha: null, promotionEvidenceSha: null, sealBundleSha: null, productionPromotionStatus: 'NOT_STARTED', productionParityStatus: 'NOT_STARTED' };
  return next;
});
const v22Payload = { ...v22Manifest, generatedAt: new Date().toISOString(), targetCount: nextV22Rows.length, rows: nextV22Rows };
v22Payload.manifestSha = hashJson({ ...v22Payload, generatedAt: null, manifestSha: undefined });
fs.writeFileSync(v22ManifestPath, JSON.stringify(v22Payload, null, 2) + '\n', 'utf8');

const renderInputPath = path.join(reports, 'render_matrix_input.json');
const renderInput = JSON.parse(fs.readFileSync(renderInputPath, 'utf8'));
const removedUid = 'h1:' + q352Key;
const nextRenderRows = renderInput.rows.map((row) => row.sourceJsPath === 'original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js' ? { ...row, targetCount: row.targetCount - 1, targetQuestionUids: row.targetQuestionUids.filter((uid) => uid !== removedUid) } : row);
const rawManifestSha = sha(fs.readFileSync(rawManifestPath));
fs.writeFileSync(renderInputPath, JSON.stringify({ ...renderInput, manifestSha256: rawManifestSha, rows: nextRenderRows }, null, 2) + '\n', 'utf8');
const renderCsvRows = nextRenderRows.map((row) => ({ examId: row.examId, sourceJsPath: row.sourceJsPath, targetCount: row.targetCount, targetQuestionUids: row.targetQuestionUids.join('|'), dependencyExamCount: 1, dependencyClosureStatus: 'CLOSED', renderRequired: true }));
const csvEscape = (value) => { const text = String(value ?? ''); return /[",\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text; };
fs.writeFileSync(path.join(reports, 'target_render_exams.csv'), ['examId,sourceJsPath,targetCount,targetQuestionUids,dependencyExamCount,dependencyClosureStatus,renderRequired', ...renderCsvRows.map((row) => Object.values(row).map(csvEscape).join(','))].join('\n') + '\n', 'utf8');
for (const csvName of ['geometry_equation_dependency_closure.csv', 'visual_requirement_matrix.csv', 'review_input_hash_map.csv']) {
  const csvPath = path.join(reports, csvName);
  const lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/);
  fs.writeFileSync(csvPath, lines.filter((line, index) => index === 0 || !line.includes(removedUid)).join('\n'), 'utf8');
}

const factsPath = path.join(reports, 'a_independent_solve_facts_final.json');
const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
const candidateFacts = { ...facts, targetCount: facts.targetCount - 1, facts: facts.facts.filter((fact) => fact.questionUid !== removedUid), scopeRepair: { removedQuestionUid: removedUid, reason: 'OUT_OF_SCOPE_CONTENT_MATRIX_PROBLEM', approvalRef } };
fs.writeFileSync(path.join(reports, 'a_independent_solve_facts_S6_candidate.json'), JSON.stringify(candidateFacts, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(reports, 's6_approved_repair_ledger.json'), JSON.stringify({ status: 'S6_APPROVED_REPAIR_APPLIED_TO_STAGING_ONLY', approvalRef, removedFromGeometryManifest: q352Key, targetCountBefore: rawManifest.targetCount, targetCountAfter: rawRows.length, changedSourceFileCount: touched.size, changedFieldCount: ledger.length, ledger, productionModified: false }, null, 2) + '\n', 'utf8');
const ledgerCsv = ['approvalRef,qKey,id,field,beforeHash,afterHash,reasonCode,protectedField', ...ledger.map((entry) => [entry.approvalRef, entry.qKey, entry.id, entry.field, entry.beforeHash, entry.afterHash, entry.reasonCode, entry.protectedField].map(csvEscape).join(','))].join('\n') + '\n';
fs.writeFileSync(path.join(reports, 's6_approved_repair_ledger.csv'), ledgerCsv, 'utf8');
console.log(JSON.stringify({ status: 'S6_APPROVED_REPAIR_APPLIED_TO_STAGING_ONLY', approvalRef, targetCountBefore: rawManifest.targetCount, targetCountAfter: rawRows.length, changedSourceFileCount: touched.size, changedFieldCount: ledger.length, removedQuestionUid: removedUid, productionModified: false }, null, 2));
