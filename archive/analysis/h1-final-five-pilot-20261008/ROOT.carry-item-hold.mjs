#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { physical, readExam, inside, artifactSnapshot, writeFresh } from '../../tools/archive-codex-artifact-io.mjs';
import { transitionFile } from '../../tools/archive-codex-dispatcher.mjs';
import { buildStageState } from '../../tools/archive-stage-runtime-v2.mjs';
import { solutionSha256 } from '../../tools/archive-stage-validator-artifact-v2.mjs';

export const QUALITY_CONTRACT = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
export const AUTHORITY_SCHEMA = 'ROOT_ITEM_HOLD_CARRY_AUTHORITY_V1';
export const CARRY_SCHEMA = 'ROOT_ITEM_HOLD_CARRY_V1';
const STAGES = Object.freeze(['CREATE', 'R1', 'R2']);
const NEXT_STAGE = Object.freeze({ CREATE: 'R1', R1: 'R2', R2: 'ROOT_ITEM_RECOVERY' });
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const abs = value => typeof value === 'string' && path.isAbsolute(value);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function assert(condition, code, detail = '') { if (!condition) throw new Error(detail ? `${code}:${detail}` : code); }
function set(values) { return [...new Set(values)].sort((a, b) => a - b); }

function readAuthority({ root, authorityFile }) {
  assert(abs(authorityFile), 'AUTHORITY_PATH_ABSOLUTE_REQUIRED');
  const authorityPath = inside(root, authorityFile);
  const authorityBytes = fs.readFileSync(authorityPath);
  const authority = JSON.parse(authorityBytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(authority.schemaVersion === AUTHORITY_SCHEMA && authority.decisionAuthority === 'ROOT_DELEGATED', 'ROOT_HOLD_CARRY_AUTHORITY_REQUIRED');
  assert(authority.runId && authority.examUid && STAGES.includes(authority.stage), 'ROOT_HOLD_CARRY_SCOPE_REQUIRED');
  assert(Array.isArray(authority.heldQids) && authority.heldQids.length && authority.heldQids.every(q => Number.isInteger(q) && q > 0), 'ROOT_HELD_QID_SET_REQUIRED');
  assert(new Set(authority.heldQids).size === authority.heldQids.length, 'ROOT_HELD_QID_SET_DUPLICATE');
  assert(authority.ownerSessionId, 'ROOT_STAGE_OWNER_SESSION_REQUIRED');
  assert(authority.authorityReference?.path === 'docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md' && authority.authorityReference?.section === 20, 'CURRENT_ITEM_HOLD_AUTHORITY_REFERENCE_REQUIRED');
  const authorityReferencePath = inside(root, authority.authorityReference.path);
  assert(sha256(fs.readFileSync(authorityReferencePath)) === authority.authorityReference.sha256, 'CURRENT_ITEM_HOLD_AUTHORITY_SHA_MISMATCH');
  assert(authority.lockedRoster?.path && /^[a-f0-9]{64}$/.test(authority.lockedRoster.sha256 || ''), 'LOCKED_ROSTER_BINDING_REQUIRED');
  assert(authority.dispatcher?.path && /^[a-f0-9]{64}$/.test(authority.dispatcher.sha256 || ''), 'DISPATCHER_STATE_BINDING_REQUIRED');
  for (const field of ['source', 'evidence', 'report']) {
    assert(abs(authority[field]?.path), `ROOT_${field.toUpperCase()}_PATH_ABSOLUTE_REQUIRED`);
    assert(/^[a-f0-9]{64}$/.test(authority[field]?.sha256 || ''), `ROOT_${field.toUpperCase()}_SHA256_REQUIRED`);
  }
  assert(/^[a-f0-9]{40}$/.test(authority.source.rawBufferGitBlobSha1 || ''), 'ROOT_SOURCE_RAW_BUFFER_BLOB_SHA1_REQUIRED');
  assert(abs(authority.assetRootAbsolute), 'ROOT_ASSET_ROOT_ABSOLUTE_REQUIRED');
  assert(abs(authority.stateFileAbsolute), 'ROOT_EXAM_STATE_ABSOLUTE_REQUIRED');
  return { authority, authorityPath, authoritySha256: sha256(authorityBytes), authorityReferencePath };
}

function currentHoldProof({ root, authority }) {
  const rosterPath = inside(root, authority.lockedRoster.path);
  const rosterBytes = fs.readFileSync(rosterPath);
  assert(sha256(rosterBytes) === authority.lockedRoster.sha256, 'LOCKED_ROSTER_SHA_MISMATCH');
  const roster = JSON.parse(rosterBytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(roster.locked === true && roster.runId === authority.runId && Array.isArray(roster.rows), 'LOCKED_ROSTER_REQUIRED');
  const rosterRows = roster.rows.filter(row => row.examUid === authority.examUid);
  assert(rosterRows.length === 1, 'LOCKED_ROSTER_TARGET_CARDINALITY_INVALID');
  const rosterRow = rosterRows[0];

  const dispatcherPath = inside(root, authority.dispatcher.path);
  const dispatcherRef = physical(dispatcherPath);
  assert(dispatcherRef.sha256 === authority.dispatcher.sha256, 'DISPATCHER_STATE_SHA_MISMATCH');
  const dispatcher = json(dispatcherPath);
  assert(dispatcher.schemaVersion === 'JS_ARCHIVE_CODEX_DISPATCHER_V1' && dispatcher.runId === authority.runId, 'DISPATCHER_RUN_BINDING_REQUIRED');
  assert(Number.isInteger(dispatcher.revision) && sha256(Buffer.from(JSON.stringify(dispatcher.roster))) === dispatcher.rosterSha256, 'DISPATCHER_LOCKED_ROSTER_SHA_MISMATCH');
  const dispatchRows = dispatcher.roster.filter(row => row.examUid === authority.examUid);
  assert(dispatchRows.length === 1 && dispatchRows[0].productionPath === rosterRow.productionPath, 'DISPATCHER_TARGET_ROSTER_MISMATCH');
  const job = dispatcher.jobs?.[authority.examUid];
  const slot = dispatcher.slots?.[authority.stage];
  assert(job?.nextStage === authority.stage && slot?.examUid === authority.examUid, 'SOURCE_HOLD_STAGE_SLOT_REQUIRED');
  assert(slot.sessionId === authority.ownerSessionId && job.sessions?.[authority.stage] === authority.ownerSessionId, 'STAGE_OWNER_SLOT_IDENTITY_MISMATCH');
  assert(!dispatcher.events?.some(event => event.type === 'HOLD_CARRIED' && event.examUid === authority.examUid && event.stage === authority.stage), 'HOLD_CARRY_ALREADY_RECORDED');

  const sourcePath = inside(root, authority.source.path);
  const exam = readExam(sourcePath);
  const sourceRef = physical(sourcePath);
  assert(sourceRef.sha256 === authority.source.sha256 && exam.rawSha256 === authority.source.sha256, 'SOURCE_RAW_SHA256_MISMATCH');
  assert(exam.rawBufferGitBlobSha1 === authority.source.rawBufferGitBlobSha1, 'SOURCE_RAW_BUFFER_BLOB_SHA1_MISMATCH');
  const qids = exam.questions.map(question => Number(question.id));
  assert(qids.length && qids.every(qid => Number.isInteger(qid) && qid > 0) && new Set(qids).size === qids.length, 'SOURCE_QID_SET_INVALID');
  const heldQids = set(exam.questions.filter(question => String(question.itemStatus || '').toUpperCase() === 'HOLD').map(question => Number(question.id)));
  assert(heldQids.length && same(heldQids, set(authority.heldQids)), 'ROOT_SOURCE_HOLD_SET_MISMATCH');

  const evidencePath = inside(root, authority.evidence.path);
  const evidenceRef = physical(evidencePath);
  assert(evidenceRef.sha256 === authority.evidence.sha256, 'EVIDENCE_SHA256_MISMATCH');
  const evidence = json(evidencePath);
  assert(evidence.schemaVersion === 'JS_ARCHIVE_STAGE_EVIDENCE_v2' && evidence.stage === authority.stage && evidence.examUid === authority.examUid, 'CURRENT_STAGE_EVIDENCE_BINDING_REQUIRED');
  assert(evidence.qualityContractVersion === QUALITY_CONTRACT && evidence.executionLine === 'CODEX', 'CURRENT_CODEX_STAGE_EVIDENCE_REQUIRED');
  assert(evidence.artifactSha === exam.rawBufferGitBlobSha1 && Array.isArray(evidence.rows), 'EVIDENCE_SOURCE_BINDING_REQUIRED');
  const evidenceQids = evidence.rows.map(row => Number(row?.qid));
  assert(same(set(evidenceQids), set(qids)) && evidenceQids.length === qids.length, 'FULL_EVIDENCE_QID_COVERAGE_REQUIRED');

  const reportPath = inside(root, authority.report.path);
  const reportRef = physical(reportPath);
  assert(reportRef.sha256 === authority.report.sha256, 'RAW_GENERIC_REPORT_SHA256_MISMATCH');
  const report = json(reportPath);
  assert(report.ok === false && report.disposition === 'FAIL' && report.validatorMode === `${authority.stage}_V2`, 'ACTUAL_GENERIC_FAIL_REPORT_REQUIRED');
  assert(report.stage === authority.stage && report.examUid === authority.examUid && report.artifactSha === exam.rawBufferGitBlobSha1, 'GENERIC_REPORT_SOURCE_BINDING_REQUIRED');
  assert(report.qualityContractVersion === QUALITY_CONTRACT && report.executionLine === 'CODEX', 'CURRENT_CODEX_GENERIC_REPORT_REQUIRED');
  assert(report.artifactContract?.active === true && report.artifactContract.disposition === 'FAIL' && report.artifactContract.qualityContractVersion === QUALITY_CONTRACT, 'ACTIVE_ARTIFACT_FAIL_REPORT_REQUIRED');
  const assetRootPath = inside(root, authority.assetRootAbsolute);
  const snapshot = artifactSnapshot({ sourceFile: sourcePath, evidenceFile: evidencePath, assetRoot: assetRootPath, questions: exam.questions });
  assert(!snapshot.issues.length, 'CURRENT_SOURCE_ASSET_SNAPSHOT_INVALID', snapshot.issues.join('|'));
  assert(report.technicalBinding && same(report.technicalBinding, snapshot), 'GENERIC_REPORT_TECHNICAL_BINDING_STALE');
  assert(path.resolve(root, report.evidenceRef) === evidencePath, 'GENERIC_REPORT_EVIDENCE_REF_MISMATCH');

  const rowByQid = new Map(evidence.rows.map(row => [Number(row.qid), row]));
  const questionByQid = new Map(exam.questions.map(question => [Number(question.id), question]));
  const expectedHeldIssues = [];
  for (const qid of heldQids) {
    const row = rowByQid.get(qid);
    const heldReview = String(row.verdict || '').toUpperCase() === 'HOLD'
      || Object.values(row.axisEvidence || {}).some(value => String(typeof value === 'object' ? value?.status : value).toUpperCase() === 'HOLD');
    assert(heldReview, 'SOURCE_HOLD_REVIEW_STATUS_BINDING_REQUIRED', String(qid));
    expectedHeldIssues.push(`ARTIFACT_KNOWN_FAILED_REVIEW:q${qid}`);
    const continuity = String(row.smallBoardContinuityStatus || row.axisEvidence?.solutionLayout?.smallBoardContinuityStatus || '').toUpperCase();
    if (continuity === 'HOLD') {
      const question = questionByQid.get(qid);
      assert(typeof question?.solution === 'string' && question.solution.trim(), 'HOLD_SOLUTION_SOURCE_REQUIRED', String(qid));
      assert(row.solutionSha256 === solutionSha256(question.solution), 'HOLD_SOLUTION_SHA_BINDING_REQUIRED', String(qid));
      expectedHeldIssues.push(`ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q${qid}`);
    }
  }
  const artifactIssues = report.artifactContract.issues;
  assert(Array.isArray(artifactIssues) && same([...artifactIssues].sort(), [...expectedHeldIssues].sort()), 'ARTIFACT_FAIL_ISSUES_NOT_EXACT_HELD_QIDS');
  assert(Array.isArray(report.issues) && same([...report.issues].sort(), [...expectedHeldIssues].sort()), 'GENERIC_FAIL_ISSUES_NOT_EXACT_HELD_QIDS');
  assert(report.common?.commonValid === true && same(report.common.expectedQids, set(qids)) && same(report.common.observedQids, set(qids)), 'GENERIC_COMMON_FULL_QID_COVERAGE_REQUIRED');
  assert(report.denominator === qids.length && report.rowCount === qids.length && report.artifactContract.questionCount === qids.length, 'GENERIC_REPORT_DENOMINATOR_MISMATCH');
  assert(evidence.rows.every(row => !heldQids.includes(Number(row.qid)) || String(row.verdict || '').toUpperCase() === 'HOLD' || Object.values(row.axisEvidence || {}).some(value => String(typeof value === 'object' ? value?.status : value).toUpperCase() === 'HOLD')), 'HOLD_EVIDENCE_ROW_BINDING_REQUIRED');

  const nextStage = NEXT_STAGE[authority.stage];
  const statePath = inside(root, authority.stateFileAbsolute);
  assert(path.dirname(statePath) === path.dirname(evidencePath), 'ROOT_STATE_EVIDENCE_DIRECTORY_MISMATCH');
  let priorState = null;
  if (fs.existsSync(statePath)) {
    priorState = json(statePath);
    assert(priorState.stage === authority.stage && priorState.qualityContractVersion === QUALITY_CONTRACT && priorState.executionLine === 'CODEX', 'ROOT_STATE_CURRENT_STAGE_REQUIRED');
  }
  return {
    rosterPath, rosterRef: physical(rosterPath), rosterRow,
    dispatcherPath, dispatcher, dispatcherRef, job, slot,
    sourcePath, sourceRef, exam, qids, heldQids,
    evidencePath, evidence, evidenceRef,
    reportPath, report, reportRef,
    assetRootPath, snapshot,
    statePath, priorState, nextStage,
  };
}

export function validateHoldCarry({ root, authorityFile }) {
  const repository = fs.realpathSync(root);
  const { authority, authorityPath, authoritySha256 } = readAuthority({ root: repository, authorityFile });
  const proof = currentHoldProof({ root: repository, authority });
  return {
    schemaVersion: CARRY_SCHEMA,
    status: 'HOLD_CARRIED',
    runId: authority.runId,
    examUid: authority.examUid,
    stage: authority.stage,
    nextStage: proof.nextStage,
    freedSlot: authority.stage,
    ownerSessionId: authority.ownerSessionId,
    heldQids: proof.heldQids,
    genericDisposition: 'FAIL',
    rawGenericReport: proof.reportRef,
    rawEvidence: proof.evidenceRef,
    source: { ...proof.sourceRef, rawBufferGitBlobSha1: proof.exam.rawBufferGitBlobSha1 },
    lockedRoster: proof.rosterRef,
    dispatcherBefore: proof.dispatcherRef,
    authority: { path: authorityPath, sha256: authoritySha256, decisionAuthority: authority.decisionAuthority, authorityReference: authority.authorityReference },
    physicalSnapshot: proof.snapshot,
    denominator: proof.qids.length,
    expectedHeldIssues: proof.heldQids.map(qid => `ARTIFACT_KNOWN_FAILED_REVIEW:q${qid}`),
    stageComplete: false,
    passClaimed: false,
    actualRenderPassAsserted: false,
    _proof: proof,
    _authority: authority,
  };
}

export function applyHoldCarry({ root, authorityFile, receiptFile }) {
  const repository = fs.realpathSync(root);
  const carry = validateHoldCarry({ root: repository, authorityFile });
  const proof = carry._proof;
  const authority = carry._authority;
  delete carry._proof;
  delete carry._authority;
  assert(abs(receiptFile), 'CARRY_RECEIPT_PATH_ABSOLUTE_REQUIRED');
  const receiptPath = inside(repository, receiptFile);
  const receiptBytes = Buffer.from(JSON.stringify(carry, null, 2) + '\n', 'utf8');
  const receiptSha256 = sha256(receiptBytes);
  const priorStatePath = proof.statePath;
  const beforeState = proof.priorState;
  const beforeStateBinding = beforeState ? { ...physical(priorStatePath) } : null;
  const updatedState = authority.stage === 'R2'
    ? { schemaVersion: 'ROOT_ITEM_HOLD_ROUTING_STATE_V1', runId: authority.runId, examUid: authority.examUid, stage: 'ROOT_ITEM_RECOVERY', qualityContractVersion: QUALITY_CONTRACT, executionLine: 'CODEX', workComplete: false }
    : buildStageState({ stage: carry.nextStage, qualityContractVersion: QUALITY_CONTRACT, executionLine: 'CODEX', workComplete: false });
  updatedState.carriedActualFailures = [ ...(beforeState?.carriedActualFailures || []), {
    stage: authority.stage, genericDisposition: 'FAIL', heldQids: carry.heldQids,
    sourceRawSha256: carry.source.sha256, sourceRawBufferGitBlobSha1: carry.source.rawBufferGitBlobSha1,
    evidenceSha256: carry.rawEvidence.sha256, rawGenericReportSha256: carry.rawGenericReport.sha256,
    carryReceiptSha256: receiptSha256,
  } ];

  const result = transitionFile({
    stateFile: proof.dispatcherPath,
    expectedStateSha256: authority.dispatcher.sha256,
    mutate: state => {
      assert(state.revision === proof.dispatcher.revision && state.slots?.[authority.stage]?.sessionId === authority.ownerSessionId, 'DISPATCHER_STATE_OWNER_CHANGED');
      if (beforeStateBinding) {
        const backupPath = path.join(path.dirname(receiptPath), `ROOT.state.before-${authority.stage}-${beforeStateBinding.sha256.slice(0, 12)}.json`);
        writeFresh(backupPath, beforeState);
      }
      writeFresh(receiptPath, carry);
      const out = structuredClone(state);
      const job = out.jobs[authority.examUid];
      job.nextStage = carry.nextStage;
      job.history.push({
        type: 'HOLD_CARRIED', stage: authority.stage, sessionId: authority.ownerSessionId,
        genericDisposition: 'FAIL', heldQids: carry.heldQids, carryReceiptSha256: receiptSha256,
        sourceRawSha256: carry.source.sha256, sourceRawBufferGitBlobSha1: carry.source.rawBufferGitBlobSha1,
        evidenceSha256: carry.rawEvidence.sha256, rawGenericReportSha256: carry.rawGenericReport.sha256,
        at: new Date().toISOString(),
      });
      out.slots[authority.stage] = null;
      out.events.push({
        type: 'HOLD_CARRIED', examUid: authority.examUid, stage: authority.stage,
        genericDisposition: 'FAIL', heldQids: carry.heldQids, carryReceiptSha256: receiptSha256,
        freedSlot: authority.stage, nextStage: carry.nextStage, at: new Date().toISOString(),
      });
      out.revision += 1;
      const tempState = priorStatePath + '.carry-' + process.pid;
      fs.writeFileSync(tempState, JSON.stringify(updatedState, null, 2) + '\n', { flag: 'wx' });
      fs.renameSync(tempState, priorStatePath);
      return out;
    },
  });
  return { receiptPath, receiptSha256, dispatcher: result.stateRef, nextStage: carry.nextStage, freedSlot: authority.stage, nextDispatch: result.nextDispatch, genericDisposition: 'FAIL', heldQids: carry.heldQids };
}

function parseArgs(argv) {
  const command = argv[0];
  if (!['preflight', 'apply'].includes(command)) throw new Error('COMMAND_REQUIRED:preflight|apply');
  const args = {};
  for (let i = 1; i < argv.length; i += 1) {
    const key = argv[i];
    if (!['--root', '--authority', '--receipt'].includes(key)) throw new Error('UNKNOWN_ARGUMENT:' + key);
    args[key.slice(2)] = argv[++i];
  }
  for (const key of ['root', 'authority']) if (!args[key]) throw new Error('REQUIRED_ARGUMENT:--' + key);
  if (command === 'apply' && !args.receipt) throw new Error('REQUIRED_ARGUMENT:--receipt');
  return { command, ...args };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.command === 'preflight') {
      const carry = validateHoldCarry({ root: args.root, authorityFile: args.authority });
      delete carry._proof;
      delete carry._authority;
      carry.status = 'VALIDATED_HOLD_CARRY_NOT_APPLIED';
      console.log(JSON.stringify(carry, null, 2));
    } else {
      console.log(JSON.stringify(applyHoldCarry({ root: args.root, authorityFile: args.authority, receiptFile: args.receipt }), null, 2));
    }
  } catch (error) {
    console.error(String(error?.stack || error));
    process.exitCode = 1;
  }
}
