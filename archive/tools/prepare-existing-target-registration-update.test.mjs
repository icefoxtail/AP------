import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { buildExistingTargetUpdate, REGISTRATION_FILES } from './prepare-existing-target-registration-update.mjs';
import { gitBlobSha } from './archive-stage-validator-compat-v1.mjs';

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const write = (root, relative, text) => { const file = path.join(root, ...relative.split('/')); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); };
const json = value => JSON.stringify(value);
const uids = ['qid_v1_demo_1', 'qid_v1_demo_2'];

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-existing-target-update-'));
  const target = 'original/middle/m3/2mid/demo.js';
  const dbRow = { file: target, school: 'Demo', grade: '중3', qCount: 2, runtimeIndex: 41 };
  const identity = [1, 2].map((n, i) => ({ questionUid: uids[i], sourceArchiveFile: target, sourceOrdinal: n, sourceQuestionNo: String(n), sourceFingerprint: 'fingerprint-' + n }));
  const metadata = identity.map(row => ({ ...row, existingProofMarker: 'proof-' + row.sourceOrdinal }));
  const index = identity.map(row => ({ sourceFile: target, sourceOrdinal: row.sourceOrdinal, questionUid: row.questionUid, qKey: target + '_' + row.sourceQuestionNo }));
  const catalog = identity.map(row => ({ sourceFile: target, sourceOrdinal: row.sourceOrdinal, questionUid: row.questionUid, sourceStatus: 'registered' }));
  const source = 'window.questionBank = [{id:1},{id:2}];';
  const writeBase = dir => {
    write(dir, 'archive/db.js', 'window.mainDB={exams:[' + json(dbRow) + ']};');
    write(dir, 'archive/data/question_identity_map.json', json({ records: identity }));
    write(dir, 'archive/data/question_metadata.json', json({ records: metadata }));
    write(dir, 'archive/question-index.js', 'window.questionIndex=' + json(index) + ';');
    write(dir, 'archive/data/archive2-catalog.json', json({ records: catalog }));
    write(dir, 'archive/question-identity.js', 'window.questionIdentity={};');
    write(dir, 'archive/question-index-report.md', 'report\n');
    write(dir, 'archive/question-index-audit.md', 'audit\n');
    write(dir, 'archive/data/archive2-canonical-input-manifest.json', '{}\n');
  };
  write(root, 'archive/exams/original/middle/m3/2mid/demo.js', source);
  writeBase(root);
  write(root, 'archive/analysis/run/R1.json', '{"status":"PASS"}\n');
  execFileSync('git', ['init', root], { stdio: 'ignore' });
  execFileSync('git', ['-C', root, 'config', 'user.email', 'test@example.invalid']);
  execFileSync('git', ['-C', root, 'config', 'user.name', 'Test']);
  execFileSync('git', ['-C', root, 'add', '.']);
  execFileSync('git', ['-C', root, 'commit', '-m', 'fixture']);
  const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const candidateRoot = '.tmp/candidate';
  writeBase(path.join(root, candidateRoot));
  const sourceBytes = fs.readFileSync(path.join(root, 'archive/exams/original/middle/m3/2mid/demo.js'));
  return {
    root, candidateRoot,
    assignment: { runId: 'run', examUid: 'demo', productionRelativePath: 'archive/exams/original/middle/m3/2mid/demo.js', artifactRawSha256: hash(sourceBytes), validatorRawBufferBlobSha1: gitBlobSha(sourceBytes), expectedHead: head },
    preservedProofs: [{ path: 'archive/analysis/run/R1.json', sha256: hash(fs.readFileSync(path.join(root, 'archive/analysis/run/R1.json'))) }],
  };
}

test('builds a current-source, full-denominator update candidate while preserving UID and proof history', () => {
  const f = fixture();
  try {
    const result = buildExistingTargetUpdate({ ...f });
    assert.equal(result.status, 'UPDATE_CANDIDATE_READY_NOT_APPLIED');
    assert.equal(result.source.questionCount, 2);
    assert.deepEqual(result.existingTarget.questionUids, uids);
    assert.equal(result.replacementRows.metadata[0].existingProofMarker, 'proof-1');
    assert.equal(result.preservedProofs[0].path, 'archive/analysis/run/R1.json');
    assert.equal(result.baselineBindings.length, REGISTRATION_FILES.length);
    assert.equal(result.targetRuntime.unchanged, true);
    assert.deepEqual(result.apply, { requested: false, sharedProductionWrites: false });
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('rejects changed target UID, source denominator drift, and missing proof preservation', () => {
  const f = fixture();
  try {
    const idPath = path.join(f.root, f.candidateRoot, 'archive/data/question_identity_map.json');
    const changed = JSON.parse(fs.readFileSync(idPath, 'utf8'));
    changed.records[0].questionUid = 'qid_v1_wrong';
    fs.writeFileSync(idPath, json(changed));
    assert.throws(() => buildExistingTargetUpdate({ ...f }), /EXISTING_UID_IDENTITY_CHANGE/);
    fs.writeFileSync(idPath, json({ records: [{ ...changed.records[0], questionUid: uids[0] }] }));
    assert.throws(() => buildExistingTargetUpdate({ ...f }), /CANDIDATE_DENOMINATOR_OR_ORDINAL_MISMATCH/);
    fs.writeFileSync(idPath, json({ records: [
      { ...changed.records[0], questionUid: uids[0], sourceOrdinal: 1 },
      { ...changed.records[1], questionUid: uids[1], sourceOrdinal: 2 },
    ] }));
    assert.throws(() => buildExistingTargetUpdate({ ...f, preservedProofs: [] }), /PRESERVED_ORIGINAL_PROOFS_REQUIRED/);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('rejects any non-target runtime tuple change', () => {
  const f = fixture();
  try {
    const dbPath = path.join(f.root, f.candidateRoot, 'archive/db.js');
    fs.writeFileSync(dbPath, 'window.mainDB={exams:[{"file":"original/middle/m3/2mid/demo.js","school":"Demo","grade":"중3","qCount":2,"runtimeIndex":42}]};');
    assert.throws(() => buildExistingTargetUpdate({ ...f }), /RUNTIME_TARGET_TUPLE_CHANGE/);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});
