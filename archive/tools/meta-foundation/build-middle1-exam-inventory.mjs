import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const examRoot = path.join(root, 'archive/exams/original/middle/m1');
const outRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const groups = ['1mid', '2mid', '2final'];
const baseMainSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const identity = readJson('archive/data/question_identity_map.json');
const metadata = readJson('archive/data/question_metadata.json');
const identityBySource = new Map(identity.records.map(r => [`${r.sourceArchiveFile}#${r.sourceOrdinal}`, r]));
const metadataByUid = new Map(metadata.records.map(r => [r.questionUid, r]));
const failures = [];
const seenUid = new Map();
const seenSource = new Map();
const l1 = {};
const l2 = {};
const files = [];
let rawQuestionRows = 0;
let identityJoinCount = 0;
let fingerprintMatchCount = 0;
let metadataJoinCount = 0;
let genericSolutionCount = 0;
let missingSolutionCount = 0;

function sourceFingerprint(q) {
  return sha(JSON.stringify({
    content: q?.content ?? null,
    choices: Array.isArray(q?.choices) ? q.choices : null,
    answer: q?.answer ?? null,
    solution: q?.solution ?? null,
    image: q?.image ?? null
  }));
}
function loadExam(fullPath) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 3000 });
  const questions = context.window.questionBank || context.window.questions || context.questionBank || context.questions;
  if (!Array.isArray(questions)) throw new Error(`Question array missing: ${fullPath}`);
  return { examTitle: context.window.examTitle || path.basename(fullPath, '.js'), questions };
}
function addCount(target, key) { target[key || '(missing)'] = (target[key || '(missing)'] || 0) + 1; }
function fail(code, detail) { failures.push({ code, ...detail }); }

for (const group of groups) {
  const names = fs.readdirSync(path.join(examRoot, group)).filter(n => n.endsWith('.js')).sort((a, b) => a.localeCompare(b, 'ko'));
  for (const name of names) {
    const relative = `original/middle/m1/${group}/${name}`;
    const fullPath = path.join(examRoot, group, name);
    const bytes = fs.readFileSync(fullPath);
    const { examTitle, questions } = loadExam(fullPath);
    const uidSet = new Set();
    const sourceFingerprints = [];
    for (let index = 0; index < questions.length; index++) {
      const q = questions[index];
      const ordinal = index + 1;
      const sourceKey = `${relative}#${ordinal}`;
      const expectedUid = `qid_v1_${sha(sourceKey.normalize('NFC'))}`;
      const id = identityBySource.get(sourceKey);
      const fp = sourceFingerprint(q);
      sourceFingerprints.push(fp);
      rawQuestionRows++;
      if (!id) fail('MISSING_IDENTITY', { sourceKey });
      else {
        identityJoinCount++;
        uidSet.add(id.questionUid);
        if (id.questionUid !== expectedUid) fail('UID_ALGORITHM_MISMATCH', { sourceKey, actual: id.questionUid, expected: expectedUid });
        if (id.sourceFingerprint !== fp) fail('SOURCE_FINGERPRINT_MISMATCH', { sourceKey, uid: id.questionUid });
        else fingerprintMatchCount++;
        if (seenUid.has(id.questionUid)) fail('DUPLICATE_UID', { uid: id.questionUid, sources: [seenUid.get(id.questionUid), sourceKey] });
        else seenUid.set(id.questionUid, sourceKey);
        const meta = metadataByUid.get(id.questionUid);
        if (!meta) fail('MISSING_METADATA_JOIN', { sourceKey, uid: id.questionUid });
        else metadataJoinCount++;
      }
      if (seenSource.has(sourceKey)) fail('SOURCE_IDENTITY_COLLISION', { sourceKey });
      else seenSource.set(sourceKey, id?.questionUid || null);
      addCount(l1, q.standardUnitKey);
      addCount(l2, q.subUnitKey);
      if (!String(q.solution || '').trim()) missingSolutionCount++;
      if (/주어진 식을 정리하고 필요한 값을 대입한 뒤|주어진 정답과 일치하는 결과는/.test(String(q.solution || ''))) genericSolutionCount++;
    }
    const batchNo = files.length + 1;
    files.push({
      batchNo,
      sourceArchiveFile: relative,
      examTitle,
      questionRowCount: questions.length,
      uniqueUidCount: uidSet.size,
      sourceFingerprint: sha(sourceFingerprints.join('\n')),
      sourceJsSha256: sha(bytes),
      semesterGroup: group,
      status: 'PENDING',
      checkpointCommit: null,
      artifactPath: `archive/_generated/intelligence/phase1/middle1-foundation/batches/B${String(batchNo).padStart(2, '0')}_${path.basename(name, '.js')}`
    });
  }
}
const inventory = {
  schemaVersion: 'm1-exam-inventory-v1',
  baseMainSha,
  branch: 'codex/meta-foundation/middle1',
  sourceRoot: 'archive/exams/original/middle/m1/',
  orderPolicy: '1mid, 2mid, 2final; Korean filename ascending within each group; frozen at BASE_MAIN_SHA',
  denominator: {
    examFiles: files.length,
    bySemesterGroup: Object.fromEntries(groups.map(g => [g, files.filter(f => f.semesterGroup === g).length])),
    rawQuestionRows,
    uniqueQuestionUids: seenUid.size,
    identityJoinCount,
    fingerprintMatchCount,
    metadataJoinCount,
    duplicateUidCount: failures.filter(f => f.code === 'DUPLICATE_UID').length,
    missingIdentityCount: failures.filter(f => f.code === 'MISSING_IDENTITY').length,
    sourceIdentityCollisionCount: failures.filter(f => f.code === 'SOURCE_IDENTITY_COLLISION').length,
    missingSolutionCount,
    genericSolutionCount
  },
  l1Distribution: l1,
  l2Distribution: l2,
  failures,
  exams: files
};
if (fs.existsSync(path.join(outRoot, 'M1_EXAM_INVENTORY_31.json'))) {
  throw new Error('Inventory already frozen; do not overwrite it');
}
fs.mkdirSync(outRoot, { recursive: true });
fs.writeFileSync(path.join(outRoot, 'M1_EXAM_INVENTORY_31.json'), JSON.stringify(inventory, null, 2) + '\n');
const progress = {
  schemaVersion: 'm1-progress-v1', baseMainSha, branch: inventory.branch,
  originalGoal: '31 complete exam batches, global compression, canonical/compiled/runtime/Archive2 integrity, branch push without main merge',
  batches: files.map(f => ({ batchNo: f.batchNo, filename: f.sourceArchiveFile, denominator: f.questionRowCount, status: 'PENDING', aReviewed: 0, bReviewed: 0, abConflicts: 0, cReviewed: 0, solDirectRead: 0, hold: 0, routeOut: 0, validationStatus: 'NOT_RUN', checkpointCommit: null }))
};
fs.writeFileSync(path.join(outRoot, 'M1_PROGRESS.json'), JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(path.join(outRoot, 'STATE.json'), JSON.stringify({ schemaVersion: 'm1-state-v1', baseMainSha, branch: inventory.branch, currentStage: 'INVENTORY_FROZEN', denominator: inventory.denominator, completedBatchCount: 0, completedUidCount: 0, nextBatchNo: 1, nextSourceArchiveFile: files[0]?.sourceArchiveFile ?? null, blockingIssues: failures, ruleDrift: 'NONE' }, null, 2) + '\n');
fs.writeFileSync(path.join(outRoot, 'M1_CUMULATIVE_TAXONOMY_REGISTRY.json'), JSON.stringify({ schemaVersion: 'm1-taxonomy-candidate-registry-v1', baseMainSha, problemTypes: [], templates: [], crossConcepts: [], reuseDecisions: [] }, null, 2) + '\n');
fs.writeFileSync(path.join(outRoot, 'M1_UNEXPECTED_FINDINGS.jsonl'), '');
console.log(JSON.stringify({ baseMainSha, denominator: inventory.denominator, l1Distribution: l1, failures: failures.slice(0, 10), firstExam: files[0] }, null, 2));
if (failures.length) process.exitCode = 1;
