import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const examsDir = path.join(archiveDir, 'exams');
const dbPath = path.join(archiveDir, 'db.js');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalizeFile = value => String(value || '').normalize('NFC').replace(/\\/g, '/').replace(/^exams\//, '').replace(/^\/+/, '').trim();
const sourceFingerprint = q => sha256(JSON.stringify({
  content: q?.content ?? null,
  choices: Array.isArray(q?.choices) ? q.choices : null,
  answer: q?.answer ?? null,
  solution: q?.solution ?? null,
  image: q?.image ?? null
}));
const ordinalUid = (file, ordinal) => 'qid_v1_' + sha256(normalizeFile(file) + '#' + Number(ordinal));

function runJs(file, code) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: file, timeout: 3000 });
  const bank = ctx.window.questions || ctx.window.questionBank || ctx.questions || ctx.questionBank;
  if (!Array.isArray(bank)) throw new Error('questions array not found: ' + file);
  return bank;
}

function readDbFiles() {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(dbPath, 'utf8'), ctx, { filename: dbPath, timeout: 3000 });
  const exams = ctx.window.mainDB?.exams;
  if (!Array.isArray(exams)) throw new Error('window.mainDB.exams missing');
  return [...new Set(exams.map(x => normalizeFile(x?.file)).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'en'));
}


const PATH_RENAME_EXCLUDED_FIELDS = new Set([
  'image',
  'solutionImage',
  'solutionImageAlt',
  'solutionImageCaption',
  'solutionImageSize'
]);

function pathRenameQuestionFingerprint(question) {
  const stable = {};
  for (const [key, value] of Object.entries(question || {})) {
    if (!PATH_RENAME_EXCLUDED_FIELDS.has(key)) stable[key] = value;
  }
  return sha256(JSON.stringify(stable));
}
function pathRenameBankFingerprint(bank) {
  return sha256(JSON.stringify((bank || []).map(pathRenameQuestionFingerprint)));
}
function sourceRenameFamily(sourceFile) {
  const file = normalizeFile(sourceFile);
  const dir = path.posix.dirname(file);
  const stem = path.posix.basename(file, '.js');
  const parts = stem.split('_');
  const identityStem = parts.length >= 5 ? parts.slice(0, 5).join('_') : stem;
  return dir + '|' + identityStem;
}
function readWorkingBank(sourceFile) {
  const file = normalizeFile(sourceFile);
  const full = path.join(examsDir, file);
  return runJs(full, fs.readFileSync(full, 'utf8'));
}
function readHistoricalBank(ref, sourceFile) {
  const file = normalizeFile(sourceFile);
  const target = `archive/exams/${file}`;
  const candidates = [];

  try {
    const history = execFileSync(
      'git',
      ['-C', repoRoot, 'log', '-n', '12', '--format=%H', '--all', '--', target],
      { maxBuffer: 2 * 1024 * 1024 }
    ).toString('utf8').trim().split(/\r?\n/).filter(Boolean);
    for (const commit of history) {
      candidates.push(commit, commit + '^');
    }
  } catch {}

  if (ref) candidates.push(ref);

  const seen = new Set();
  for (const candidate of candidates) {
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);
    try {
      const code = execFileSync('git', ['-C', repoRoot, 'show', `${candidate}:${target}`], {
        maxBuffer: 32 * 1024 * 1024
      }).toString('utf8');
      return runJs(`${candidate}:${target}`, code);
    } catch {}
  }
  throw new Error('historical source not found for rename verification: ' + file);
}
function detectSourcePathRenames(records, dbFiles, identitySourceCommit) {
  const dbSet = new Set(dbFiles);
  const identityFiles = new Set(records.map(r => normalizeFile(r.sourceArchiveFile)));
  const staleFiles = [...identityFiles].filter(file => !dbSet.has(file)).sort((a, b) => a.localeCompare(b, 'en'));
  const freshFiles = dbFiles.filter(file => !identityFiles.has(file));
  const renameMap = new Map();
  const renamedFiles = [];
  const currentBanks = new Map();
  if (!staleFiles.length || !freshFiles.length || !identitySourceCommit) {
    return { renameMap, renamedFiles, currentBanks };
  }
  const historicalBanks = new Map();
  for (const staleFile of staleFiles) {
    try {
      historicalBanks.set(staleFile, readHistoricalBank(identitySourceCommit, staleFile));
    } catch {
      historicalBanks.set(staleFile, null);
    }
  }
  const usedStaleFiles = new Set();
  for (const freshFile of freshFiles) {
    const currentBank = readWorkingBank(freshFile);
    currentBanks.set(freshFile, currentBank);
    const family = sourceRenameFamily(freshFile);
    const currentFingerprint = pathRenameBankFingerprint(currentBank);
    const matches = staleFiles.filter(staleFile => {
      if (usedStaleFiles.has(staleFile) || sourceRenameFamily(staleFile) !== family) return false;
      const historicalBank = historicalBanks.get(staleFile);
      return Array.isArray(historicalBank)
        && historicalBank.length === currentBank.length
        && pathRenameBankFingerprint(historicalBank) === currentFingerprint;
    });
    if (matches.length > 1) {
      throw new Error('ambiguous source path rename: ' + freshFile + ' <- ' + matches.join(', '));
    }
    if (matches.length === 1) {
      const from = matches[0];
      usedStaleFiles.add(from);
      renameMap.set(from, freshFile);
      renamedFiles.push({ from, to: freshFile, questionCount: currentBank.length });
      continue;
    }

    const sameFamilyStale = staleFiles.filter(staleFile =>
      !usedStaleFiles.has(staleFile) && sourceRenameFamily(staleFile) === family
    );
    if (sameFamilyStale.length) {
      throw new Error(
        'source path rename candidate could not be verified: ' +
        freshFile + ' <- ' + sameFamilyStale.join(', ')
      );
    }
  }
  return { renameMap, renamedFiles, currentBanks };
}

function addArray(obj, key, value) {
  if (!obj[key]) obj[key] = [];
  obj[key].push(value);
}
function sortObject(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b, 'en')));
}
function buildLookups(records) {
  const byQuestionUid = {}, byLegacyQKey = {}, bySourceFileAndOrdinal = {}, bySourceFileAndQuestionNo = {};
  for (const r of records) {
    byQuestionUid[r.questionUid] = {
      sourceArchiveFile: r.sourceArchiveFile,
      sourceOrdinal: r.sourceOrdinal,
      sourceQuestionNo: r.sourceQuestionNo
    };
    addArray(byLegacyQKey, r.legacyQKey, r.questionUid);
    if (!bySourceFileAndOrdinal[r.sourceArchiveFile]) bySourceFileAndOrdinal[r.sourceArchiveFile] = {};
    bySourceFileAndOrdinal[r.sourceArchiveFile][String(r.sourceOrdinal)] = r.questionUid;
    if (!bySourceFileAndQuestionNo[r.sourceArchiveFile]) bySourceFileAndQuestionNo[r.sourceArchiveFile] = {};
    addArray(bySourceFileAndQuestionNo[r.sourceArchiveFile], String(r.sourceQuestionNo ?? ''), r.questionUid);
  }
  return {
    byQuestionUid: sortObject(byQuestionUid),
    byLegacyQKey: sortObject(byLegacyQKey),
    bySourceFileAndOrdinal: sortObject(bySourceFileAndOrdinal),
    bySourceFileAndQuestionNo: sortObject(bySourceFileAndQuestionNo)
  };
}

function main() {
  if (!fs.existsSync(identityPath)) throw new Error('identity map missing: ' + identityPath);
  const current = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
  const records = (current.records || []).map(x => ({ ...x, sourceArchiveFile: normalizeFile(x.sourceArchiveFile) }));
  const dbFiles = readDbFiles();
  const rename = detectSourcePathRenames(records, dbFiles, current.sourceCommit);
  let renamedRecords = 0;
  const renamedSourceFiles = new Set();
  for (const record of records) {
    const from = normalizeFile(record.sourceArchiveFile);
    const to = rename.renameMap.get(from);
    if (!to) continue;
    const bank = rename.currentBanks.get(to) || readWorkingBank(to);
    const question = bank[Number(record.sourceOrdinal) - 1];
    if (!question) throw new Error('renamed source ordinal missing: ' + to + '#' + record.sourceOrdinal);
    record.sourceArchiveFile = to;
    record.sourceQuestionNo = question?.id ?? record.sourceQuestionNo ?? '';
    record.legacyQKey = to + '_' + String(record.sourceQuestionNo ?? '');
    record.sourceFingerprint = sourceFingerprint(question);
    renamedRecords += 1;
    renamedSourceFiles.add(to);
  }
  const bySourceOrdinal = new Map(records.map(r => [r.sourceArchiveFile + '#' + Number(r.sourceOrdinal), r]));
  const existingFiles = new Set(records.map(r => r.sourceArchiveFile));
  const usedUids = new Set(records.map(r => r.questionUid));
  const newSourceFiles = [];
  let newRecords = 0;
  for (const sourceFile of dbFiles) {
    const full = path.join(examsDir, sourceFile);
    if (!fs.existsSync(full)) throw new Error('db source missing: ' + sourceFile);
    const questions = runJs(full, fs.readFileSync(full, 'utf8'));
    const prior = records.filter(r => r.sourceArchiveFile === sourceFile);
    if (prior.length && prior.length !== questions.length) {
      throw new Error('existing source cardinality changed; identity migration required: ' +
        sourceFile + ' ' + prior.length + ' -> ' + questions.length);
    }
    if (!prior.length) newSourceFiles.push(sourceFile);
    for (let i = 0; i < questions.length; i += 1) {
      const ordinal = i + 1;
      const q = questions[i];
      const key = sourceFile + '#' + ordinal;
      if (bySourceOrdinal.has(key)) continue;
      if (existingFiles.has(sourceFile)) throw new Error('identity ordinal gap in existing source: ' + key);
      const uid = ordinalUid(sourceFile, ordinal);
      if (usedUids.has(uid)) throw new Error('questionUid collision: ' + uid);
      usedUids.add(uid);
      const qno = q?.id ?? '';
      const row = {
        questionUid: uid,
        legacyQKey: sourceFile + '_' + String(qno),
        sourceArchiveFile: sourceFile,
        sourceOrdinal: ordinal,
        sourceQuestionNo: qno,
        sourceFingerprint: sourceFingerprint(q)
      };
      records.push(row);
      bySourceOrdinal.set(key, row);
      newRecords += 1;
    }
  }
  if (!newRecords && !renamedRecords) {
    console.log(JSON.stringify({ status: 'NO_CHANGE', records: records.length, newFiles: 0, newRecords: 0, renamedFiles: 0, renamedRecords: 0 }, null, 2));
    return;
  }
  records.sort((a, b) =>
    a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'en') ||
    Number(a.sourceOrdinal) - Number(b.sourceOrdinal)
  );
  const uniqueUidCount = new Set(records.map(r => r.questionUid)).size;
  if (uniqueUidCount !== records.length) throw new Error('duplicate questionUid after incremental sync');
  const sourceCommit = execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD']).toString('utf8').trim();
  const renameHistory = new Map();
  for (const row of [
    ...(current.verifiedPathRenameHistory || []),
    ...(current.incrementalSync?.renamedFiles || []),
    ...rename.renamedFiles,
  ]) {
    const from = normalizeFile(row.from), to = normalizeFile(row.to);
    if (from && to) renameHistory.set(`${from}\u0000${to}`, { ...row, from, to });
  }
  const next = {
    ...current,
    sourceCommit,
    records,
    lookup: buildLookups(records),
    verifiedPathRenameHistory: [...renameHistory.values()].sort((a, b) => a.from.localeCompare(b.from, 'en') || a.to.localeCompare(b.to, 'en')),
    stats: {
      ...(current.stats || {}),
      examFileCount: new Set(records.map(r => r.sourceArchiveFile)).size,
      sourceQuestionCount: records.length,
      uniqueQuestionUidCount: uniqueUidCount,
      duplicateQuestionUidCount: 0,
      failures: 0
    },
    incrementalSync: {
      schemaVersion: 'question-identity-incremental-sync-v2',
      sourceCommit,
      newFiles: newSourceFiles.length,
      newRecords,
      newSourceFiles,
      renamedFiles: rename.renamedFiles,
      renamedRecords,
      renamedSourceFiles: [...renamedSourceFiles].sort((a, b) => a.localeCompare(b, 'en'))
    },
    generatedAt: new Date().toISOString()
  };
  delete next.identityDigest;
  const stable = { ...next };
  delete stable.generatedAt;
  next.identityDigest = sha256(JSON.stringify(stable));
  fs.writeFileSync(identityPath, JSON.stringify(next, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({
    status: 'UPDATED',
    records: records.length,
    newFiles: newSourceFiles.length,
    newRecords,
    newSourceFiles,
    renamedFiles: rename.renamedFiles,
    renamedRecords,
    identityDigest: next.identityDigest
  }, null, 2));
}
main();
