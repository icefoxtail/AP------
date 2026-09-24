import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const generatedRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const inventory = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
const dryRun = process.argv.includes('--dry-run');
const exam = inventory.exams[batchNo - 1];
if (!exam || exam.batchNo !== batchNo) throw new Error('Usage: apply-middle1-metadata.mjs <1..31>');
const batchDir = path.join(root, exam.artifactPath);
const sourcePath = path.join(root, 'archive/exams', exam.sourceArchiveFile);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJsonl = name => fs.readFileSync(path.join(batchDir, name), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const input = readJsonl('INPUT_BUNDLE.jsonl');
const consensus = readJsonl('CONSENSUS.jsonl');
const difficulty = readJsonl('DIFFICULTY_FINAL.jsonl');
const sourceQuality = readJsonl('SOURCE_QUALITY.jsonl');
if ([input, consensus, difficulty, sourceQuality].some(rows => rows.length !== exam.questionRowCount)) throw new Error('Metadata writeback requires complete batch ledgers');
const byUid = rows => new Map(rows.map(x => [x.questionUid, x]));
const cByUid = byUid(consensus), dByUid = byUid(difficulty), qByUid = byUid(sourceQuality);
const master = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/master_tables/js_archive_tag_master.json'), 'utf8'));
const masterByKey = new Map(master.map(x => [x.key, x]));
const originalBytes = fs.readFileSync(sourcePath);
if (sha(originalBytes) !== exam.sourceJsSha256) throw new Error('Exam source drift since inventory freeze');
const before = originalBytes.toString('utf8');
const eol = before.includes('\r\n') ? '\r\n' : '\n';
const lines = before.split(/\r?\n/);
const blocks = [];
let start = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '  {') {
    if (start !== -1) throw new Error(`Nested top-level question block at line ${i + 1}`);
    start = i;
  } else if (start !== -1 && /^  \},?$/.test(lines[i])) {
    blocks.push({ start, end: i });
    start = -1;
  }
}
if (start !== -1 || blocks.length !== input.length) throw new Error(`Question block count mismatch ${blocks.length}/${input.length}`);
function loadBank(code) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(code, context, { timeout: 3000 });
  return context.window.questionBank || context.window.questions || context.questionBank || context.questions;
}
const beforeBank = loadBank(before);
if (beforeBank.length !== input.length) throw new Error('VM source count mismatch');
const changes = [];
function setExisting(block, key, value) {
  const index = block.findIndex(line => line.startsWith(`    "${key}":`));
  if (index < 0) throw new Error(`Required existing metadata field missing: ${key}`);
  const comma = block[index].trimEnd().endsWith(',') ? ',' : '';
  block[index] = `    "${key}": ${JSON.stringify(value)}${comma}`;
}
function insertNew(block, values) {
  const end = block.findIndex(line => /^  \},?$/.test(line));
  if (end < 0) throw new Error('Question block end missing');
  const existing = new Set(block.flatMap(line => [...line.matchAll(/^    "([^"]+)":/g)].map(match => match[1])));
  for (const key of Object.keys(values)) if (existing.has(key)) throw new Error(`Foundation field already exists: ${key}`);
  let last = end - 1;
  while (last > 0 && !block[last].trim()) last--;
  if (!block[last].trimEnd().endsWith(',')) block[last] += ',';
  const added = Object.entries(values).map(([key, value], index, all) => `    "${key}": ${JSON.stringify(value)}${index < all.length - 1 ? ',' : ''}`);
  block.splice(end, 0, ...added);
}
const replacement = new Map();
for (let ordinal = 1; ordinal <= blocks.length; ordinal++) {
  const source = input[ordinal - 1];
  const c = cByUid.get(source.questionUid), d = dByUid.get(source.questionUid), quality = qByUid.get(source.questionUid);
  if (!c || !d || !quality || source.sourceOrdinal !== ordinal || c.inputBundleSha !== source.inputBundleSha || d.blindInputSha === undefined) throw new Error(`UID/ledger join mismatch #${ordinal}`);
  const q = beforeBank[ordinal - 1];
  if (c.reviewStatus === 'ROUTE_OUT') {
    if (quality.metadataWritebackAllowed !== false || q.standardUnitKey !== c.standardUnitKey || q.subUnitKey !== c.subUnitKey) throw new Error(`Route-out source parent/writeback mismatch #${ordinal}`);
    changes.push({ questionUid: source.questionUid, sourceOrdinal: ordinal, routeOutSkipped: true, l1Changed: false, l2Changed: false, metadataFieldsAdded: 0 });
    continue;
  }
  if (c.reviewStatus === 'HOLD' || quality.disposition === 'SOURCE_BLOCKED') {
    if (quality.metadataWritebackAllowed !== false) throw new Error(`Held source item must not be written #${ordinal}`);
    changes.push({ questionUid: source.questionUid, sourceOrdinal: ordinal, holdSkipped: true, sourceBlocked: quality.disposition === 'SOURCE_BLOCKED', l1Changed: false, l2Changed: false, metadataFieldsAdded: 0 });
    continue;
  }
  if (quality.disposition === 'SOURCE_BLOCKED' || quality.metadataWritebackAllowed === false) throw new Error(`Source-blocked item cannot be written #${ordinal}`);
  const l1 = masterByKey.get(c.standardUnitKey), l2 = masterByKey.get(c.subUnitKey);
  if (l1?.keyType !== 'standardUnitKey' || l2?.keyType !== 'subUnitKey' || l2.standardUnitKey !== c.standardUnitKey) throw new Error(`L1/L2 invalid #${ordinal}`);
  const block = lines.slice(blocks[ordinal - 1].start, blocks[ordinal - 1].end + 1);
  if (q.standardUnitKey !== c.standardUnitKey || q.subUnitKey !== c.subUnitKey) {
    setExisting(block, 'standardUnitKey', c.standardUnitKey);
    setExisting(block, 'standardUnit', l1.labelKo);
    setExisting(block, 'standardUnitOrder', Number(c.standardUnitKey.slice(-2)));
    setExisting(block, 'subUnitKey', c.subUnitKey);
    setExisting(block, 'subUnit', l2.labelKo);
    setExisting(block, 'subUnitConfidence', 'candidate_evidence');
    setExisting(block, 'subUnitClassificationDepth', 'complete_candidate');
  }
  insertNew(block, {
    problemTypeKey: c.problemTypeKey,
    templateKey: c.templateKey,
    crossConceptKeys: c.crossConceptKeys,
    conditionKeys: c.conditionKeys,
    integrationPattern: c.integrationPattern,
    difficultyBucket: d.difficultyBucket,
    difficultyConfidence: d.difficultyConfidence,
    difficultyBoundaryFlag: d.difficultyBoundaryFlag,
    legacyLevelCompatibility: d.legacyLevelCompatibility
  });
  replacement.set(blocks[ordinal - 1].start, { end: blocks[ordinal - 1].end, lines: block });
  changes.push({ questionUid: source.questionUid, sourceOrdinal: ordinal, routeOutSkipped: false, l1Changed: q.standardUnitKey !== c.standardUnitKey, l2Changed: q.subUnitKey !== c.subUnitKey, metadataFieldsAdded: 9 });
}
const resultLines = [];
for (let i = 0; i < lines.length; i++) {
  const item = replacement.get(i);
  if (item) { resultLines.push(...item.lines); i = item.end; }
  else resultLines.push(lines[i]);
}
const after = resultLines.join(eol);
const afterBank = loadBank(after);
if (afterBank.length !== beforeBank.length) throw new Error('After-write question count mismatch');
const allowed = new Set(['standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility']);
for (let i = 0; i < beforeBank.length; i++) {
  for (const key of new Set([...Object.keys(beforeBank[i]), ...Object.keys(afterBank[i])])) {
    if (allowed.has(key)) continue;
    if (JSON.stringify(beforeBank[i][key] ?? null) !== JSON.stringify(afterBank[i][key] ?? null)) throw new Error(`Protected/non-metadata change #${i + 1} ${key}`);
  }
}
const routeOutSkippedQuestionUids = changes.filter(x => x.routeOutSkipped).map(x => x.questionUid);
const holdSkippedQuestionUids = changes.filter(x => x.holdSkipped).map(x => x.questionUid);
const receipt = { schemaVersion: 'm1-metadata-writeback-receipt-v1', batchNo, sourceArchiveFile: exam.sourceArchiveFile, originalSourceSha256: sha(originalBytes), writtenSourceSha256: sha(Buffer.from(after)), questionCount: afterBank.length, changedQuestionCount: changes.length - routeOutSkippedQuestionUids.length - holdSkippedQuestionUids.length, routeOutSkippedCount: routeOutSkippedQuestionUids.length, routeOutSkippedQuestionUids, holdSkippedCount: holdSkippedQuestionUids.length, holdSkippedQuestionUids, closureQuestionCount: changes.length, l1ChangedCount: changes.filter(x => x.l1Changed).length, l2ChangedCount: changes.filter(x => x.l2Changed).length, protectedMutationCount: 0, nonMetadataMutationCount: 0, metadataOnly: true, canonicalStatus: 'BRANCH_CANDIDATE_PENDING_GLOBAL_COMPRESSION', changes };
if (!dryRun) {
  fs.writeFileSync(sourcePath, after, 'utf8');
  fs.writeFileSync(path.join(batchDir, 'WRITEBACK_RECEIPT.json'), JSON.stringify(receipt, null, 2) + '\n');
}
console.log(JSON.stringify({ batchNo, dryRun, questionCount: afterBank.length, changedQuestionCount: receipt.changedQuestionCount, routeOutSkippedCount: receipt.routeOutSkippedCount, holdSkippedCount: receipt.holdSkippedCount, l1ChangedCount: receipt.l1ChangedCount, l2ChangedCount: receipt.l2ChangedCount, protectedMutationCount: 0, sourceSha256: receipt.writtenSourceSha256 }, null, 2));
