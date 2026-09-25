import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const outRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const inventory = JSON.parse(fs.readFileSync(path.join(outRoot, 'M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
if (!Number.isInteger(batchNo) || batchNo < 1 || batchNo > inventory.exams.length) throw new Error('Usage: node freeze-middle1-batch.mjs <1..31>');
const exam = inventory.exams[batchNo - 1];
if (exam.batchNo !== batchNo) throw new Error('Frozen inventory order mismatch');
const dest = path.join(root, exam.artifactPath);
if (fs.existsSync(path.join(dest, 'INPUT_BUNDLE.jsonl'))) throw new Error('Batch input already frozen');
const sourcePath = path.join(root, 'archive/exams', exam.sourceArchiveFile);
const bytes = fs.readFileSync(sourcePath);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
if (sha(bytes) !== exam.sourceJsSha256) throw new Error('Source JS drift');
const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(bytes.toString('utf8'), context, { filename: sourcePath, timeout: 3000 });
const questions = context.window.questionBank || context.window.questions || context.questionBank || context.questions;
if (!Array.isArray(questions) || questions.length !== exam.questionRowCount) throw new Error('Question count drift');
const identity = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_identity_map.json'), 'utf8'));
const bySource = new Map(identity.records.map(r => [`${r.sourceArchiveFile}#${r.sourceOrdinal}`, r]));
function imageRefs(q) {
  const refs = new Set([q.image, q.solutionImage].filter(v => typeof v === 'string' && v.trim()));
  for (const field of ['content', 'solution']) {
    for (const match of String(q[field] || '').matchAll(/<img[^>]*src=["']([^"']+)["']/gi)) refs.add(match[1]);
  }
  return [...refs].map(ref => {
    const safe = !/^https?:|^data:|\.\./i.test(ref);
    const full = safe ? path.join(root, 'archive', ref.replace(/^\/+/, '')) : null;
    return { ref, exists: Boolean(full && fs.existsSync(full)), sha256: full && fs.existsSync(full) ? sha(fs.readFileSync(full)) : null };
  });
}
const rows = questions.map((q, index) => {
  const sourceOrdinal = index + 1;
  const sourceArchiveFile = exam.sourceArchiveFile;
  const sourceIdentity = `${sourceArchiveFile}#${sourceOrdinal}`;
  const id = bySource.get(sourceIdentity);
  if (!id) throw new Error(`Missing identity ${sourceIdentity}`);
  const sourceFingerprint = sha(JSON.stringify({ content: q?.content ?? null, choices: Array.isArray(q?.choices) ? q.choices : null, answer: q?.answer ?? null, solution: q?.solution ?? null, image: q?.image ?? null }));
  if (sourceFingerprint !== id.sourceFingerprint) throw new Error(`Source fingerprint mismatch ${sourceIdentity}`);
  const input = {
    questionUid: id.questionUid, sourceArchiveFile, sourceOrdinal, sourceQuestionNo: String(q.id ?? ''),
    sourceIdentity, sourceFingerprint,
    sourceIdentityFingerprint: sha(JSON.stringify({ sourceArchiveFile, sourceOrdinal, sourceFingerprint })),
    content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, answer: q.answer ?? null,
    solution: q.solution ?? null, images: imageRefs(q),
    contentHash: sha(JSON.stringify(q.content ?? null)), choicesHash: sha(JSON.stringify(Array.isArray(q.choices) ? q.choices : null)),
    solutionHash: sha(JSON.stringify(q.solution ?? null)),
    currentL1: q.standardUnitKey ?? null, currentL2: q.subUnitKey ?? null,
    standardCourse: q.standardCourse ?? null,
    inputFieldInventory: ['questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceQuestionNo', 'sourceIdentity', 'sourceFingerprint', 'sourceIdentityFingerprint', 'content', 'choices', 'answer', 'solution', 'images', 'contentHash', 'choicesHash', 'solutionHash', 'currentL1', 'currentL2', 'standardCourse']
  };
  input.inputBundleSha = sha(JSON.stringify(input));
  return input;
});
if (new Set(rows.map(r => r.questionUid)).size !== rows.length) throw new Error('Duplicate UID in batch');
if (new Set(rows.map(r => r.sourceIdentity)).size !== rows.length) throw new Error('Duplicate source identity in batch');
fs.mkdirSync(dest, { recursive: true });
fs.writeFileSync(path.join(dest, 'INVENTORY.json'), JSON.stringify({ ...exam, inputBundleSha: sha(rows.map(r => r.inputBundleSha).join('\n')), sourceQuestionCount: rows.length, uniqueUidCount: new Set(rows.map(r => r.questionUid)).size, status: 'IDENTITY_FROZEN' }, null, 2) + '\n');
fs.writeFileSync(path.join(dest, 'INPUT_BUNDLE.jsonl'), rows.map(r => JSON.stringify(r)).join('\n') + '\n');
console.log(JSON.stringify({ batchNo, sourceArchiveFile: exam.sourceArchiveFile, rowCount: rows.length, uidUnique: new Set(rows.map(r => r.questionUid)).size, bundle: path.join(dest, 'INPUT_BUNDLE.jsonl') }, null, 2));
