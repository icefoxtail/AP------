#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const base = 'e5189d7e459d2f12e281baee5f7d25eada26015c';
const evidenceDir = 'archive/evidence/visual-upgrade-2025-m3-independent-b';
const removed = new Map([
  ['archive/exams/original/middle/m3/2mid/25_왕운중_2학기_중간_중3_수학.js', [1]],
  ['archive/exams/original/middle/m3/2mid/25_풍덕중_2학기_중간_중3_수학.js', [1, 11, 23]],
]);
const visualKeys = new Set(['solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize']);
const sha = bytes => 'sha256:' + crypto.createHash('sha256').update(bytes).digest('hex');

function loadBank(file, bytes) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(bytes.toString('utf8'), sandbox, { filename: file, timeout: 5000 });
  const bank = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(bank)) throw new Error('QUESTION_BANK_REQUIRED:' + file);
  return bank;
}

function protectedValues(q) {
  return Object.fromEntries(Object.entries(q).filter(([key]) => !visualKeys.has(key)));
}

function questionBlock(source, qid) {
  const regex = new RegExp('\\{\\s*"id"\\s*:\\s*' + qid + ',[\\s\\S]*?\\n  \\}', 'g');
  const matches = [...source.matchAll(regex)];
  if (matches.length !== 1) throw new Error('QUESTION_OBJECT_NOT_UNIQUE:' + qid + ':' + matches.length);
  return matches[0][0];
}

function baselineBytes(file) {
  return execFileSync('git', ['show', `${base}:${file}`], { cwd: root, maxBuffer: 20_000_000 });
}

const fileResults = [];
for (const [file, qids] of removed) {
  const before = fs.readFileSync(file);
  const baseBytes = baselineBytes(file);
  const currentBank = loadBank(file, before);
  const baseBank = loadBank(file, baseBytes);
  const beforeSha256 = sha(before);
  let source = before.toString('utf8');
  for (const qid of qids) {
    const currentQ = currentBank.find(q => Number(q.id) === qid);
    const baseQ = baseBank.find(q => Number(q.id) === qid);
    if (!currentQ || !baseQ) throw new Error('QUESTION_MISSING:' + file + '#' + qid);
    if (JSON.stringify(protectedValues(currentQ)) !== JSON.stringify(protectedValues(baseQ))) {
      throw new Error('PROTECTED_FIELDS_DIFFER_FROM_BASE:' + file + '#' + qid);
    }
    for (const key of visualKeys) {
      if (baseQ[key] !== undefined && baseQ[key] !== null) {
        throw new Error('BASELINE_VISUAL_FIELD_UNEXPECTED:' + file + '#' + qid + ':' + key);
      }
    }
    const oldBlock = questionBlock(source, qid);
    const baseBlock = questionBlock(baseBytes.toString('utf8'), qid);
    source = source.replace(oldBlock, baseBlock);
  }
  const after = Buffer.from(source, 'utf8');
  const finalBank = loadBank(file, after);
  if (finalBank.length !== baseBank.length) throw new Error('QUESTION_COUNT_CHANGED:' + file);
  for (const baseQ of baseBank) {
    const currentQ = finalBank.find(q => Number(q.id) === Number(baseQ.id));
    if (JSON.stringify(protectedValues(currentQ)) !== JSON.stringify(protectedValues(baseQ))) {
      throw new Error('PROTECTED_FIELD_MUTATION:' + file + '#' + baseQ.id);
    }
  }
  fs.writeFileSync(file, after);
  fileResults.push({ file, qidsRestored: qids, beforeSha256, afterSha256: sha(after), protectedParity: 'PASS' });
}

const sourceImages = new Set();
const inventory = JSON.parse(fs.readFileSync(path.join(evidenceDir, 'inventory.json'), 'utf8'));
for (const exam of inventory.exams) for (const question of exam.questions) {
  if (question.problemImagePath) sourceImages.add(question.problemImagePath);
}

const removedAssets = [
  'archive/assets/images/25_왕운중_2학기_중간_중3_수학/q1-solution.svg',
  'archive/assets/images/25_풍덕중_2학기_중간_중3_수학/q1-solution.svg',
  'archive/assets/images/25_풍덕중_2학기_중간_중3_수학/q11-solution.svg',
  'archive/assets/images/25_풍덕중_2학기_중간_중3_수학/q23-solution.svg',
];
const repoRoot = path.resolve(root);
const removedResults = [];
for (const relative of removedAssets) {
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(repoRoot + path.sep)) throw new Error('REMOVE_PATH_ESCAPES_REPO:' + relative);
  const bytes = execFileSync('git', ['show', `43e0b955d890e317e222f36d7f18e6a30925be04:${relative}`], { cwd: root, maxBuffer: 2_000_000 });
  if (fs.existsSync(absolute)) {
    if (!fs.statSync(absolute).isFile()) throw new Error('REMOVED_ASSET_NOT_FILE:' + relative);
    const current = fs.readFileSync(absolute);
    if (sha(current) !== sha(bytes)) throw new Error('REMOVED_ASSET_BYTES_NOT_FROM_B:' + relative);
    fs.unlinkSync(absolute);
  }
  removedResults.push({ path: relative, removedBytes: bytes.length, removedSha256: sha(bytes), result: 'REMOVED' });
}

const builtPath = path.join(evidenceDir, 'build_outputs.json');
const built = JSON.parse(fs.readFileSync(builtPath, 'utf8'));
const removedQuestionUids = new Set([
  'archive/exams/original/middle/m3/2mid/25_왕운중_2학기_중간_중3_수학.js|1',
  'archive/exams/original/middle/m3/2mid/25_풍덕중_2학기_중간_중3_수학.js|1',
  'archive/exams/original/middle/m3/2mid/25_풍덕중_2학기_중간_중3_수학.js|11',
  'archive/exams/original/middle/m3/2mid/25_풍덕중_2학기_중간_중3_수학.js|23',
]);
built.assets = built.assets.filter(asset => !removedQuestionUids.has(asset.questionUid));
built.assetCount = built.assets.length;
if (built.assetCount !== 17) throw new Error('FINAL_CHANGED_SVG_COUNT_EXPECTED_17:' + built.assetCount);
fs.writeFileSync(builtPath, JSON.stringify(built, null, 2) + '\n', 'utf8');

const report = {
  schemaVersion: 'M3_WITHDRAWN_ADD_REPAIR_v1',
  baseCommit: base,
  sourceFigurePolicy: 'Withdraw an ADD when the original problem figure already contains the same decisive relation and the candidate adds no student-visible information.',
  withdrawnCandidates: removedResults,
  sourceExamRestores: fileResults,
  finalChangedSvgCount: built.assetCount,
};
fs.writeFileSync(path.join(evidenceDir, 'withdrawn_add_repair.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ sourceExamRestores: fileResults.length, withdrawnAssets: removedResults.length, finalChangedSvgCount: built.assetCount }));
