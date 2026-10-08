import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { artifactSnapshot, physical } from '../../../tools/archive-codex-artifact-io.mjs';
import { solutionSha256 } from '../../../tools/archive-stage-validator-artifact-v2.mjs';
import { consumeValidationPass } from '../../../tools/archive-stage-runtime-v2.mjs';
import { applyHoldCarry, validateHoldCarry, QUALITY_CONTRACT } from '../ROOT.carry-item-hold.mjs';

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); return physical(file); };

function fixture(stage = 'CREATE') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-hold-carry-'));
  const runId = 'h1-final-five-pilot-20261008';
  const examUid = '21_금당고_1학기_기말_고1_기출';
  const ownerSessionId = '/root/create_geumdang2021_five';
  const runDir = path.join(root, 'archive/analysis', runId);
  const evDir = path.join(root, 'archive/analysis', examUid, runId);
  const sourcePath = path.join(root, '.tmp/archive', runId, examUid, `${examUid}.js`);
  const assetRoot = path.dirname(sourcePath);
  const evidencePath = path.join(evDir, `${stage}.evidence.json`);
  const reportPath = path.join(evDir, `${stage}.validation.json`);
  const stateFile = path.join(evDir, 'ROOT.state.json');
  const rosterPath = path.join(runDir, 'ROOT.roster.json');
  const dispatcherPath = path.join(runDir, 'ROOT.dispatcher.json');
  const authorityPath = path.join(runDir, `ROOT.${stage}.hold-carry-authority.json`);
  const receiptPath = path.join(runDir, 'technical-hold-routing', `${examUid}.${stage}.HOLD_CARRIED.json`);
  const authorityReferencePath = path.join(root, 'docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md');

  fs.mkdirSync(assetRoot, { recursive: true });
  fs.mkdirSync(evDir, { recursive: true });
  fs.mkdirSync(path.dirname(authorityReferencePath), { recursive: true });
  fs.writeFileSync(authorityReferencePath, '## 20. ITEM_HOLD TRAVEL fixture\n');
  const sourceBytes = Buffer.from(`window.examTitle = ${JSON.stringify(examUid)};\nwindow.questionBank = [{ id: 1, itemStatus: 'HOLD', solution: 'x=1' }];\n`);
  fs.writeFileSync(sourcePath, sourceBytes);
  const sourceRef = physical(sourcePath);
  const sourceSha = gitBlobSha1(sourceBytes);
  const evidence = {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage, examUid, artifactSha: sourceSha,
    qualityContractVersion: QUALITY_CONTRACT, executionLine: 'CODEX',
    rows: [{ qid: 1, verdict: 'HOLD', smallBoardContinuityStatus: 'HOLD', solutionSha256: solutionSha256('x=1'), axisEvidence: { META: { status: 'HOLD' }, SOLUTION_LAYOUT: { status: 'HOLD', smallBoardContinuityStatus: 'HOLD' } } }],
  };
  const evidenceRef = writeJson(evidencePath, evidence);
  const snapshot = artifactSnapshot({ sourceFile: sourcePath, evidenceFile: evidencePath, assetRoot, questions: [{ id: 1, itemStatus: 'HOLD', solution: 'x=1' }] });
  const holdIssues = ['ARTIFACT_KNOWN_FAILED_REVIEW:q1', 'ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q1'];
  const report = {
    ok: false, validatorMode: `${stage}_V2`, stage, examUid, artifactSha: sourceSha,
    evidenceRef: evidencePath, denominator: 1, rowCount: 1, disposition: 'FAIL',
    qualityContractVersion: QUALITY_CONTRACT, executionLine: 'CODEX',
    common: { commonValid: true, expectedQids: [1], observedQids: [1], issues: [] },
    artifactContract: { active: true, qualityContractVersion: QUALITY_CONTRACT, disposition: 'FAIL', questionCount: 1, issues: holdIssues },
    issues: holdIssues, technicalBinding: snapshot,
  };
  const reportRef = writeJson(reportPath, report);
  const roster = { runId, locked: true, rows: [{ examUid, productionPath: `archive/exams/original/high/h1/1final/${examUid}.js`, rosterIndex: 0 }] };
  const rosterRef = writeJson(rosterPath, roster);
  const dispatchRoster = [{ examUid, productionPath: roster.rows[0].productionPath, rosterIndex: 0 }];
  const dispatcher = {
    schemaVersion: 'JS_ARCHIVE_CODEX_DISPATCHER_V1', runId, revision: 4,
    roster: dispatchRoster, rosterSha256: sha256(Buffer.from(JSON.stringify(dispatchRoster))),
    jobs: { [examUid]: { nextStage: stage, sessions: { [stage]: ownerSessionId }, history: [] } },
    slots: { CREATE: null, R1: null, R2: null, R3: null, [stage]: { examUid, sessionId: ownerSessionId, startedAt: '2026-10-08T00:00:00.000Z' } },
    events: [], usedSessionIds: [ownerSessionId],
  };
  const dispatcherRef = writeJson(dispatcherPath, dispatcher);
  const authority = {
    schemaVersion: 'ROOT_ITEM_HOLD_CARRY_AUTHORITY_V1', decisionAuthority: 'ROOT_DELEGATED', runId, examUid, stage,
    ownerSessionId, heldQids: [1],
    authorityReference: { path: 'docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md', section: 20, sha256: sha256(fs.readFileSync(authorityReferencePath)) },
    lockedRoster: { path: rosterPath, sha256: rosterRef.sha256 },
    dispatcher: { path: dispatcherPath, sha256: dispatcherRef.sha256 },
    source: { path: sourcePath, sha256: sourceRef.sha256, rawBufferGitBlobSha1: sourceSha },
    evidence: { path: evidencePath, sha256: evidenceRef.sha256 },
    report: { path: reportPath, sha256: reportRef.sha256 },
    assetRootAbsolute: assetRoot, stateFileAbsolute: stateFile,
  };
  writeJson(authorityPath, authority);
  return { root, runId, examUid, stage, ownerSessionId, sourcePath, evidencePath, reportPath, stateFile, dispatcherPath, authorityPath, receiptPath, rosterPath };
}

test('carries exact source HOLD through CREATE→R1 and R1→R2 without creating PASS or stage completion', t => {
  for (const stage of ['CREATE', 'R1']) {
    const f = fixture(stage);
    t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
    const frozenPayload = [f.sourcePath, f.evidencePath, f.reportPath].map(file => physical(file).sha256);
    const result = applyHoldCarry({ root: f.root, authorityFile: f.authorityPath, receiptFile: f.receiptPath });
    const receipt = JSON.parse(fs.readFileSync(f.receiptPath, 'utf8'));
    const dispatcher = JSON.parse(fs.readFileSync(f.dispatcherPath, 'utf8'));
    const rootState = JSON.parse(fs.readFileSync(f.stateFile, 'utf8'));
    assert.equal(result.nextStage, stage === 'CREATE' ? 'R1' : 'R2');
    assert.equal(receipt.status, 'HOLD_CARRIED');
    assert.equal(receipt.genericDisposition, 'FAIL');
    assert.deepEqual(receipt.heldQids, [1]);
    assert.equal(receipt.stageComplete, false);
    assert.equal(receipt.passClaimed, false);
    assert.equal(dispatcher.slots[stage], null);
    assert.equal(dispatcher.jobs[f.examUid].nextStage, result.nextStage);
    assert.equal(dispatcher.jobs[f.examUid].history[0].genericDisposition, 'FAIL');
    assert.equal(dispatcher.events[0].type, 'HOLD_CARRIED');
    assert.equal(rootState.stage, result.nextStage);
    assert.equal(rootState.carriedActualFailures[0].genericDisposition, 'FAIL');
    assert.deepEqual([f.sourcePath, f.evidencePath, f.reportPath].map(file => physical(file).sha256), frozenPayload);
    if (stage === 'CREATE') {
      const consumed = consumeValidationPass({
        state: { ...rootState, workComplete: true },
        validationReport: {
          ok: true, disposition: 'PASS', validatorMode: 'R1_V2', stage: 'R1', examUid: f.examUid,
          artifactSha: 'a'.repeat(40), evidenceRef: 'fixture/R1.evidence.json',
          qualityContractVersion: QUALITY_CONTRACT, executionLine: 'CODEX', artifactContract: { active: true },
        },
      });
      assert.equal(consumed.state.stage, 'R2');
    }
  }
});

test('routes an R2 hold only to ROOT_ITEM_RECOVERY', t => {
  const f = fixture('R2');
  t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const result = applyHoldCarry({ root: f.root, authorityFile: f.authorityPath, receiptFile: f.receiptPath });
  const dispatcher = JSON.parse(fs.readFileSync(f.dispatcherPath, 'utf8'));
  const rootState = JSON.parse(fs.readFileSync(f.stateFile, 'utf8'));
  assert.equal(result.nextStage, 'ROOT_ITEM_RECOVERY');
  assert.equal(dispatcher.jobs[f.examUid].nextStage, 'ROOT_ITEM_RECOVERY');
  assert.equal(dispatcher.slots.R2, null);
  assert.equal(dispatcher.slots.R3, null);
  assert.equal(rootState.stage, 'ROOT_ITEM_RECOVERY');
});

test('preflight validates all proof bindings without writing a receipt or releasing the dispatcher slot', t => {
  const f = fixture('CREATE');
  t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const before = physical(f.dispatcherPath).sha256;
  const carry = validateHoldCarry({ root: f.root, authorityFile: f.authorityPath });
  assert.equal(carry.genericDisposition, 'FAIL');
  assert.equal(carry.stageComplete, false);
  assert.equal(carry.passClaimed, false);
  assert.equal(physical(f.dispatcherPath).sha256, before);
  assert.equal(fs.existsSync(f.receiptPath), false);
  assert.equal(fs.existsSync(f.stateFile), false);
});

test('rejects any unrelated generic or artifact issue even when the source item remains HOLD', t => {
  for (const location of ['issues', 'artifactContract.issues']) {
    const f = fixture('CREATE');
    t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
    const report = JSON.parse(fs.readFileSync(f.reportPath, 'utf8'));
    if (location === 'issues') report.issues.push('COMMON_QID_ORPHAN:q9');
    else report.artifactContract.issues.push('ARTIFACT_META_FIELD_REQUIRED:standardUnit:q1');
    const reportRef = writeJson(f.reportPath, report);
    const authority = JSON.parse(fs.readFileSync(f.authorityPath, 'utf8'));
    authority.report.sha256 = reportRef.sha256;
    writeJson(f.authorityPath, authority);
    assert.throws(() => validateHoldCarry({ root: f.root, authorityFile: f.authorityPath }), /ISSUES_NOT_EXACT_HELD_QIDS/);
  }
});

test('rejects stale source/evidence hashes, wrong stage owner, or a changed full-qid report binding', t => {
  const f = fixture('CREATE');
  t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const authority = JSON.parse(fs.readFileSync(f.authorityPath, 'utf8'));
  authority.ownerSessionId = '/root/wrong-session';
  writeJson(f.authorityPath, authority);
  assert.throws(() => validateHoldCarry({ root: f.root, authorityFile: f.authorityPath }), /STAGE_OWNER_SLOT_IDENTITY_MISMATCH/);
  authority.ownerSessionId = f.ownerSessionId;
  authority.source.sha256 = '0'.repeat(64);
  writeJson(f.authorityPath, authority);
  assert.throws(() => validateHoldCarry({ root: f.root, authorityFile: f.authorityPath }), /SOURCE_RAW_SHA256_MISMATCH/);
});
