const fs = require('fs');
const vm = require('vm');
const crypto = require('crypto');
const path = require('path');
const evidenceRoot = 'archive/evidence/visual-upgrade-2025-m3-independent-b';
const triage = JSON.parse(fs.readFileSync(evidenceRoot + '/triage.json', 'utf8'));
const built = JSON.parse(fs.readFileSync(evidenceRoot + '/build_outputs.json', 'utf8'));
const lock = JSON.parse(fs.readFileSync(evidenceRoot + '/protected_fields_snapshot.json', 'utf8'));
const sha = bytes => 'sha256:' + crypto.createHash('sha256').update(bytes).digest('hex');
const rawBlob = bytes => crypto.createHash('sha1')
  .update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes])).digest('hex');
function loadBank(file, bytes) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(bytes.toString('utf8'), sandbox, { filename: file, timeout: 5000 });
  const bank = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(bank)) throw new Error('QUESTION_BANK_REQUIRED:' + file);
  return bank;
}
function replaceOrInsert(block, key, value) {
  const encoded = JSON.stringify(value);
  const pattern = new RegExp('("' + key + '"\\s*:\\s*)"(?:\\\\.|[^"\\\\])*"');
  if (pattern.test(block)) return block.replace(pattern, '$1' + encoded);
  if (!/\n  \}$/.test(block)) throw new Error('QUESTION_OBJECT_END_NOT_FOUND:' + key);
  return block.replace(/\n  \}$/, ',\n    "' + key + '": ' + encoded + '\n  }');
}
function protectedValues(q) {
  const omitted = new Set(['solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize']);
  return Object.fromEntries(Object.entries(q).filter(([key]) => !omitted.has(key)));
}
const lockByFile = new Map(lock.exams.map(exam =>
  [exam.sourcePath, new Map(exam.questions.map(q => [Number(q.qid), q]))]));
const targetExams = new Map();
for (const asset of built.assets) {
  const filename = asset.sourcePath;
  if (!targetExams.has(filename)) targetExams.set(filename, []);
  targetExams.get(filename).push(asset);
}
const examChanges = [];
for (const [file, assets] of targetExams) {
  const before = fs.readFileSync(file);
  const beforeBank = loadBank(file, before);
  const beforeSha = sha(before);
  let source = before.toString('utf8');
  const edits = [];
  for (const asset of assets) {
    const qid = Number(asset.qid);
    const tri = triage.triage.find(row => row.questionUid === file + '|' + qid);
    if (!tri || !['ADD', 'REBUILD'].includes(tri.action)) throw new Error('TRIAGE_ACTION_MISMATCH:' + file + '#' + qid);
    const regex = new RegExp('\\{\\s*"id"\\s*:\\s*' + qid + ',[\\s\\S]*?\\n  \\}', 'g');
    const matches = [...source.matchAll(regex)];
    if (matches.length !== 1) throw new Error('QUESTION_OBJECT_NOT_UNIQUE:' + file + '#' + qid + ':' + matches.length);
    const oldBlock = matches[0][0];
    let newBlock = oldBlock;
    const folder = path.posix.basename(file, '.js');
    const solutionImage = 'assets/images/' + folder + '/q' + qid + '-solution.svg';
    newBlock = replaceOrInsert(newBlock, 'solutionImage', solutionImage);
    newBlock = replaceOrInsert(newBlock, 'solutionImageAlt', asset.alt);
    newBlock = replaceOrInsert(newBlock, 'solutionImageCaption', asset.caption);
    newBlock = replaceOrInsert(newBlock, 'solutionImageSize', 'medium');
    const prior = beforeBank.find(q => Number(q.id) === qid);
    const lockedBefore = protectedValues(prior);
    const expectedLock = lockByFile.get(file).get(qid).protectedValuesSha256;
    if (sha(Buffer.from(JSON.stringify(lockedBefore), 'utf8')) !== expectedLock) {
      throw new Error('BASELINE_PROTECTED_FIELDS_MISMATCH:' + file + '#' + qid);
    }
    source = source.replace(oldBlock, newBlock);
    edits.push({ qid, action: tri.action, changedFields: [
      ...(prior.solutionImage === solutionImage ? [] : ['solutionImage']),
      'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize'
    ], solutionImage, alt: asset.alt, caption: asset.caption, size: 'medium',
    protectedFieldsSha256Before: expectedLock });
  }
  const after = Buffer.from(source, 'utf8');
  const afterBank = loadBank(file, after);
  for (const edit of edits) {
    const oldQ = beforeBank.find(q => Number(q.id) === edit.qid);
    const newQ = afterBank.find(q => Number(q.id) === edit.qid);
    if (sha(Buffer.from(JSON.stringify(protectedValues(oldQ)), 'utf8')) !==
        sha(Buffer.from(JSON.stringify(protectedValues(newQ)), 'utf8'))) {
      throw new Error('PROTECTED_FIELD_MUTATION:' + file + '#' + edit.qid);
    }
    if (newQ.solutionImage !== edit.solutionImage ||
        newQ.solutionImageAlt !== edit.alt ||
        newQ.solutionImageCaption !== edit.caption ||
        newQ.solutionImageSize !== 'medium') throw new Error('VISUAL_FIELD_READBACK_FAIL:' + file + '#' + edit.qid);
  }
  fs.writeFileSync(file, after);
  examChanges.push({ path: file, beforeSha256: beforeSha, beforePhysicalGitBlobSha: rawBlob(before),
    afterSha256: sha(after), afterPhysicalGitBlobSha: rawBlob(after), edits });
}
const finalInventory = [];
for (const exam of lock.exams) {
  const file = exam.sourcePath;
  const bytes = fs.readFileSync(file);
  const bank = loadBank(file, bytes);
  if (bank.length !== exam.questions.length) throw new Error('QUESTION_COUNT_CHANGED:' + file);
  let changedProtected = 0;
  for (const q of bank) {
    const base = exam.questions.find(row => Number(row.qid) === Number(q.id));
    if (sha(Buffer.from(JSON.stringify(protectedValues(q)), 'utf8')) !== base.protectedValuesSha256) {
      changedProtected += 1;
    }
  }
  finalInventory.push({ path: file, finalExamSha256: sha(bytes), finalPhysicalGitBlobSha: rawBlob(bytes),
    questionCount: bank.length, protectedFieldMutationCount: changedProtected });
}
if (finalInventory.reduce((n, row) => n + row.questionCount, 0) !== 120 ||
    finalInventory.reduce((n, row) => n + row.protectedFieldMutationCount, 0) !== 0) {
  throw new Error('LOCKED_SCOPE_VALIDATION_FAIL');
}
const out = { schemaVersion: 'M3_SOLUTION_IMAGE_LINK_CHANGES_v1', baseCommit: lock.baseCommit,
  denominator: 120, changedExamFiles: examChanges.length, protectedFieldMutationCount: 0,
  examChanges, finalInventory };
fs.writeFileSync(evidenceRoot + '/solution_image_link_changes.json', JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ changedExamFiles: examChanges.length, linkedImages: examChanges.reduce((n, e) => n + e.edits.length, 0),
  denominator: 120, protectedFieldMutationCount: 0, out: evidenceRoot + '/solution_image_link_changes.json' }));
