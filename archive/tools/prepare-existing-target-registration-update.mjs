#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import core from '../archive2-core.js';
import { gitBlobSha } from './archive-stage-validator-compat-v1.mjs';
import { validateStageEvidence } from './archive-stage-validator.mjs';

const QUALITY_CONTRACT = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const R1_META_PASS_VALUES = new Set([
  'PASS', 'PASS_WITH_RPM_PROJECTION_DEBT', 'PASS_CURRENT_FIELDS_AND_RPM_PROOF', 'PASS_AFTER_RECHECK',
  'SAME_STAGE_CLASSIFICATION_REPAIR_PASS', 'CURRENT_FIELDS_RECORDED_NO_SEMANTIC_RECLASSIFICATION',
]);
function r1MetaPass(row) {
  const axis = row?.axisEvidence?.META ?? row?.axisEvidence?.meta;
  if (axis?.status === 'REVIEWED_WITH_EXACT_DECLARED_DEBT') {
    return Array.isArray(row?.metaDebtFields) && row.metaDebtFields.length > 0
      && row.metaDebtFields.every(field => typeof field === 'string' && field.trim().length > 0)
      && typeof row.metaDebtReason === 'string' && row.metaDebtReason.trim().length > 0
      && axis.currentSourceFields && typeof axis.currentSourceFields === 'object';
  }
  if (axis?.status === 'REVIEWED') {
    return Array.isArray(row?.metaDebtFields) && row.metaDebtFields.length === 0
      && row.verdict === 'PASS' && row.metaDebtReason === 'No unresolved required Meta fields.'
      && axis.currentSourceFields && typeof axis.currentSourceFields === 'object';
  }
  if (axis?.status === 'REVIEWED_WITH_EXACT_DECLARED_DEBT') {
    return Array.isArray(row?.metaDebtFields) && row.metaDebtFields.length > 0
      && row.metaDebtFields.every(field => typeof field === 'string' && field.trim().length > 0)
      && typeof row.metaDebtReason === 'string' && row.metaDebtReason.trim().length > 0
      && axis.currentSourceFields && typeof axis.currentSourceFields === 'object';
  }
  if (axis?.status === 'REVIEWED') {
    return Array.isArray(row?.metaDebtFields) && row.metaDebtFields.length === 0
      && row.verdict === 'PASS' && row.metaDebtReason === 'No unresolved required Meta fields.'
      && axis.currentSourceFields && typeof axis.currentSourceFields === 'object';
  }
  if (axis?.status === 'EVIDENCE_DEBT') {
    return Array.isArray(row?.metaDebtFields) && row.metaDebtFields.length > 0
      && row.metaDebtFields.every(field => typeof field === 'string' && field.trim().length > 0)
      && typeof row.metaDebtReason === 'string' && row.metaDebtReason.trim().length > 0
      && typeof axis.note === 'string' && axis.note.trim() === row.metaDebtReason.trim();
  }
  if (axis?.status === 'PROJECTION_BINDING_PENDING') {
    const fields = axis.currentFields || {}, note = axis.note;
    return typeof note === 'string' && note.includes('DIRECT_BINDING_GAP')
      && note.includes('record nonblocking projection pending') && fields.rpmSemanticStatus === 'FINAL'
      && Boolean(fields.rpmL1 && fields.rpmL2 && fields.rpmL3 && fields.rpmL4);
  }
  if (axis?.status === 'REVIEWED_WITH_RECORDED_PROJECTION_DEBT') {
    if (Array.isArray(row?.metaDebtFields) && row.metaDebtFields.length === 0
      && !String(row.metaDebtReason || '').trim()
      && axis.observation === 'Current source metadata fields reviewed against canonical unit/crosswalk and active registries.') return true;
    return Array.isArray(row?.metaDebtFields) && row.metaDebtFields.length > 0
      && row.metaDebtFields.every(field => typeof field === 'string' && field.trim().length > 0)
      && typeof row.metaDebtReason === 'string' && row.metaDebtReason.trim().length > 0
      && typeof axis.observation === 'string' && axis.observation.trim() === row.metaDebtReason.trim();
  }
  if (axis?.status === 'PASS_WITH_EXPLICIT_EVIDENCE_DEBT') {
    const debts = axis.exactDebts;
    return Array.isArray(debts) && debts.length > 0
      && debts.every(debt => debt && typeof debt.field === 'string' && debt.field.trim().length > 0
        && typeof debt.reason === 'string' && debt.reason.trim().length > 0);
  }
  const values = [];
  const push = value => { if (typeof value === 'string' && value.trim()) values.push(value.trim()); };
  push(axis?.status); push(axis?.verdict); push(axis?.metaStatus);
  push(row?.metaStatus); push(row?.metaReview?.status); push(row?.metaAudit?.status);
  const fourAxis = row?.fourAxisReview?.META ?? row?.fourAxisReview?.meta;
  if (typeof fourAxis === 'string') push(fourAxis);
  else {
    push(fourAxis?.status); push(fourAxis?.verdict);
    if (['CURRENT_FIELDS_RETAINED', 'CURRENT_NULL_DEBT_PRESERVED'].includes(fourAxis?.disposition)
      && typeof fourAxis.evidence === 'string' && fourAxis.evidence.trim()) values.push('REVIEWED_CURRENT_META_DISPOSITION');
  }
  return values.some(value => R1_META_PASS_VALUES.has(value) || value === 'REVIEWED_CURRENT_META_DISPOSITION');
}
export const REGISTRATION_FILES = Object.freeze([
  'archive/db.js', 'archive/data/question_identity_map.json', 'archive/data/question_metadata.json',
  'archive/question-identity.js', 'archive/question-index.js', 'archive/question-index-report.md',
  'archive/question-index-audit.md', 'archive/data/archive2-catalog.json',
  'archive/data/archive2-canonical-input-manifest.json',
]);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const fail = (code, detail = '') => { throw Object.assign(new Error(`${code}${detail ? `:${detail}` : ''}`), { code }); };
const evalWindow = (file, key) => { const sandbox = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { timeout: 5000 }); return sandbox.window[key]; };

export function buildExistingTargetUpdate({ root, assignment, candidateRoot, preservedProofs }) {
  const realRoot = fs.realpathSync(root);
  const abs = relative => {
    const file = path.resolve(realRoot, relative);
    const rel = path.relative(realRoot, file);
    if (rel.startsWith('..') || path.isAbsolute(rel)) fail('PATH_ESCAPE', relative);
    if (fs.existsSync(file)) {
      const real = fs.realpathSync(file), realRel = path.relative(realRoot, real);
      if (realRel.startsWith('..') || path.isAbsolute(realRel)) fail('SYMLINK_OUTSIDE_ROOT', relative);
    }
    return file;
  };
  const sourcePath = assignment.productionRelativePath;
  const source = fs.readFileSync(abs(sourcePath));
  if (sha256(source) !== assignment.artifactRawSha256 || gitBlobSha(source) !== assignment.validatorRawBufferBlobSha1) fail('CURRENT_SOURCE_SHA_MISMATCH');
  const head = execFileSync('git', ['-C', realRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (head !== assignment.expectedHead) fail('HEAD_MISMATCH');
  const sourceFile = core.normalizeFile(sourcePath.replace(/^archive\/exams\//, ''));
  if (path.basename(sourceFile, '.js') !== assignment.examUid) fail('ASSIGNMENT_EXAM_UID_SOURCE_MISMATCH');
  const targetDb = evalWindow(abs('archive/db.js'), 'mainDB').exams.filter(row => core.normalizeFile(row.file) === sourceFile);
  const identity = readJson(abs('archive/data/question_identity_map.json')).records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFile);
  const metadata = readJson(abs('archive/data/question_metadata.json')).records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFile);
  const index = evalWindow(abs('archive/question-index.js'), 'questionIndex').filter(row => core.normalizeFile(row.sourceFile) === sourceFile);
  const catalog = core.decodeCatalog(readJson(abs('archive/data/archive2-catalog.json'))).records.filter(row => core.normalizeFile(row.sourceFile) === sourceFile);
  if (targetDb.length !== 1 || !identity.length || metadata.length !== identity.length || index.length !== identity.length || catalog.length !== identity.length) fail('EXISTING_TARGET_DENOMINATOR_INCOMPLETE');

  const candidate = fs.realpathSync(path.resolve(realRoot, candidateRoot));
  const candidateRel = path.relative(realRoot, candidate);
  if (candidateRel.startsWith('..') || path.isAbsolute(candidateRel)) fail('CANDIDATE_PATH_ESCAPE');
  const generatedIdentity = readJson(path.join(candidate, 'archive/data/question_identity_map.json')).records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFile);
  const generatedMetadata = readJson(path.join(candidate, 'archive/data/question_metadata.json')).records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFile);
  const generatedIndex = evalWindow(path.join(candidate, 'archive/question-index.js'), 'questionIndex').filter(row => core.normalizeFile(row.sourceFile) === sourceFile);
  const generatedCatalog = core.decodeCatalog(readJson(path.join(candidate, 'archive/data/archive2-catalog.json'))).records.filter(row => core.normalizeFile(row.sourceFile) === sourceFile);
  const sourceSandbox = { window: {} };
  vm.runInNewContext(source.toString('utf8'), sourceSandbox, { timeout: 5000 });
  const bank = sourceSandbox.window.questionBank || sourceSandbox.window.questions;
  if (!Array.isArray(bank) || bank.length !== identity.length) fail('CURRENT_SOURCE_DENOMINATOR_MISMATCH');
  const count = bank.length;
  const groups = [['identity', identity, generatedIdentity], ['metadata', metadata, generatedMetadata], ['index', index, generatedIndex], ['catalog', catalog, generatedCatalog]];
  const ordinalUids = new Map(identity.map(row => [Number(row.sourceOrdinal), row.questionUid]));
  const sorted = rows => [...rows].sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
  for (const [name, existing, next] of groups) {
    if (next.length !== count || sorted(next).some((row, i) => Number(row.sourceOrdinal) !== i + 1)) fail('CANDIDATE_DENOMINATOR_OR_ORDINAL_MISMATCH', name);
  }
  for (let i = 0; i < count; i++) {
    const current = sorted(identity)[i], replacement = sorted(generatedIdentity)[i];
    if (current.questionUid !== replacement.questionUid || Number(current.sourceOrdinal) !== Number(replacement.sourceOrdinal)) fail('EXISTING_UID_IDENTITY_CHANGE', String(i + 1));
    for (const [name, , next] of groups.slice(1)) {
      const row = sorted(next)[i];
      if (Number(row.sourceOrdinal) !== Number(current.sourceOrdinal)) fail('CANDIDATE_UID_JOIN_MISMATCH', `${name}:${i + 1}`);
      if (name === 'index') {
        if (row.qKey !== replacement.legacyQKey) fail('CANDIDATE_UID_JOIN_MISMATCH', `${name}:${i + 1}`);
      } else if (row.questionUid !== current.questionUid) fail('CANDIDATE_UID_JOIN_MISMATCH', `${name}:${i + 1}`);
    }
  }
  const targetDbRow = evalWindow(path.join(candidate, 'archive/db.js'), 'mainDB').exams.filter(row => core.normalizeFile(row.file) === sourceFile);
  if (targetDbRow.length !== 1) fail('CANDIDATE_TARGET_DB_ROW_MISSING');
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  if (!same(targetDb[0], targetDbRow[0])) fail('RUNTIME_TARGET_TUPLE_CHANGE');
  const proofRows = Array.isArray(preservedProofs) ? preservedProofs : [];
  if (!proofRows.length) fail('PRESERVED_ORIGINAL_PROOFS_REQUIRED');
  const proofs = proofRows.map(proof => {
    const bytes = fs.readFileSync(abs(proof.path));
    if (sha256(bytes) !== proof.sha256) fail('PRESERVED_PROOF_SHA_MISMATCH', proof.path);
    return { path: proof.path, sha256: proof.sha256 };
  });
  const baselineBindings = REGISTRATION_FILES.map(relativePath => ({ relativePath, sha256: sha256(fs.readFileSync(abs(relativePath))) }));
  const replacementRows = Object.fromEntries(groups.map(([name, , next]) => [name, sorted(next)]));
  const candidateBindings = ['archive/db.js', 'archive/data/question_identity_map.json', 'archive/data/question_metadata.json', 'archive/question-index.js', 'archive/data/archive2-catalog.json']
    .map(relativePath => ({ relativePath, sha256: sha256(fs.readFileSync(path.join(candidate, relativePath))) }));
  return {
    schemaVersion: 'JS_ARCHIVE_EXISTING_TARGET_REGISTRATION_UPDATE_V1',
    status: 'UPDATE_CANDIDATE_READY_NOT_APPLIED',
    route: 'EXISTING_TARGET_UPDATE',
    runId: assignment.runId, examUid: assignment.examUid, expectedHead: head,
    source: { path: sourcePath, normalizedFile: sourceFile, rawSha256: sha256(source), gitBlobSha1: gitBlobSha(source), questionCount: count },
    candidateRoot: candidate,
    releaseAssets: (assignment.releaseAssets || []).map(asset => ({ ref: asset.ref, sha256: asset.sha256 })),
    targetRuntime: { dbRow: targetDb[0], unchanged: true },
    existingTarget: { questionCount: count, questionUids: sorted(identity).map(row => row.questionUid) },
    originalTargetMetadata: sorted(metadata),
    originalTargetMetadataSha256: sha256(Buffer.from(JSON.stringify(sorted(metadata)), 'utf8')),
    replacementRows,
    candidateBindings,
    preservedProofs: proofs,
    baselineBindings,
    nonTargetInvariance: 'REQUIRED_AT_APPLY_TIME',
    semanticReview: 'NOT_ASSIGNED_BY_REGISTRATION_UPDATE',
    apply: { requested: false, sharedProductionWrites: false },
    nextRequiredAction: 'A_SEPARATE_APPLIER_MUST_MERGE_TARGET_ROWS_AND_VERIFY_NON_TARGET_INVARIANCE',
  };
}

export function validateCurrentProofChain({ root, assignment, proofManifest, proofManifestPath }) {
  const realRoot = fs.realpathSync(root);
  const abs = relative => {
    const file = path.resolve(realRoot, relative);
    const rel = path.relative(realRoot, file);
    if (rel.startsWith('..') || path.isAbsolute(rel)) fail('PROOF_PATH_ESCAPE', relative);
    return file;
  };
  if (proofManifest?.schemaVersion !== 'JS_ARCHIVE_CURRENT_STAGE_PROOF_SET_V1'
    || proofManifest.runId !== assignment.runId || proofManifest.examUid !== assignment.examUid
    || proofManifest.productionRelativePath !== assignment.productionRelativePath
    || proofManifest.artifactRawSha256 !== assignment.artifactRawSha256
    || proofManifest.artifactBlobSha1 !== assignment.validatorRawBufferBlobSha1) fail('CURRENT_STAGE_PROOF_SET_BINDING_REQUIRED');
  if (assignment.currentStageProofManifestPath !== proofManifestPath
    || assignment.currentStageProofManifestSha256 !== sha256(fs.readFileSync(abs(proofManifestPath)))) fail('ASSIGNMENT_PROOF_SET_SHA_BINDING_REQUIRED');
  const sourceSandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(abs(assignment.productionRelativePath), 'utf8'), sourceSandbox, { timeout: 5000 });
  const sourceBank = sourceSandbox.window.questionBank || sourceSandbox.window.questions;
  if (!Array.isArray(sourceBank) || sourceBank.length < 1) fail('CURRENT_SOURCE_DENOMINATOR_REQUIRED');
  const proofRows = Array.isArray(proofManifest.proofs) ? proofManifest.proofs : [];
  const stages = new Set(proofRows.map(row => row.stage));
  if (proofRows.length !== 3 || ['R1', 'R2', 'R3'].some(stage => !stages.has(stage)) || stages.size !== 3) fail('CURRENT_R1_R2_R3_PROOFS_REQUIRED');
  const validated = [];
  let r1MetaPassQids = [];
  for (const row of proofRows) {
    const file = abs(row.path), bytes = fs.readFileSync(file);
    if (!/^[a-f0-9]{64}$/i.test(row.sha256 || '') || sha256(bytes) !== row.sha256) fail('CURRENT_STAGE_PROOF_SHA_MISMATCH', row.stage);
    const report = validateStageEvidence({
      examFile: abs(assignment.productionRelativePath), evidenceFile: file, stage: row.stage,
      qualityContractVersion: QUALITY_CONTRACT, executionLine: 'CODEX', repoRoot: realRoot, assetRoot: path.join(realRoot, 'archive'),
    });
    if (report.ok !== true || report.disposition !== 'PASS' || report.qualityContractVersion !== QUALITY_CONTRACT
      || report.executionLine !== 'CODEX' || report.artifactSha !== assignment.validatorRawBufferBlobSha1
      || report.artifactContract?.active !== true) fail('CURRENT_STAGE_VALIDATOR_NOT_PASS', row.stage + ':' + (report.issues || []).join(','));
    if (['R1', 'R2'].includes(row.stage) && Number(report.denominator) !== sourceBank.length) fail('CURRENT_STAGE_FULL_DENOMINATOR_REQUIRED', row.stage);
    if (row.stage === 'R3' && Number(report.artifactContract.questionCount) !== sourceBank.length) fail('CURRENT_R3_ARTIFACT_DENOMINATOR_REQUIRED');
    if (row.stage === 'R1') {
      const evidence = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
      r1MetaPassQids = evidence.rows.filter(r1MetaPass).map(row => Number(row.qid)).sort((a, b) => a - b);
    }
    validated.push({
      stage: row.stage, path: row.path, sha256: row.sha256,
      validator: { mode: report.validatorMode, disposition: report.disposition, denominator: report.denominator ?? report.scopeCount, rowCount: report.rowCount, artifactContract: report.artifactContract },
    });
  }
  return { schemaVersion: proofManifest.schemaVersion, path: proofManifestPath, sha256: assignment.currentStageProofManifestSha256, stages: validated, r1MetaPassQids };
}

function cli() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const key = process.argv[i];
    if (!['--root', '--assignment', '--candidate-root', '--output', '--proof-manifest'].includes(key)) fail('UNKNOWN_ARGUMENT', key);
    args[key.slice(2)] = process.argv[++i];
  }
  for (const key of ['root', 'assignment', 'candidate-root', 'output', 'proof-manifest']) if (!args[key]) fail('REQUIRED_ARGUMENT', key);
  const root = fs.realpathSync(path.resolve(args.root));
  const safe = rel => {
    const file = path.resolve(root, rel), relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) fail('PATH_ESCAPE', rel);
    if (fs.existsSync(file)) {
      const real = fs.realpathSync(file), realRelative = path.relative(root, real);
      if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) fail('SYMLINK_OUTSIDE_ROOT', rel);
    }
    return file;
  };
  const assignment = readJson(safe(args.assignment));
  const proofPath = args['proof-manifest'];
  const proofManifest = readJson(safe(proofPath));
  const candidate = buildExistingTargetUpdate({ root, assignment, candidateRoot: args['candidate-root'], preservedProofs: proofManifest.originalProofs });
  candidate.currentStageProofs = validateCurrentProofChain({ root, assignment, proofManifest, proofManifestPath: proofPath });
  const output = safe(args.output);
  if (fs.existsSync(output)) fail('FRESH_OUTPUT_PATH_REQUIRED');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(candidate, null, 2)}\n`);
  console.log(JSON.stringify({ status: candidate.status, examUid: candidate.examUid, questionCount: candidate.source.questionCount, output: args.output, outputSha256: sha256(fs.readFileSync(output)) }, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { cli(); } catch (error) { console.error(JSON.stringify({ status: 'BLOCKED', code: error.code || 'ERROR', message: error.message })); process.exitCode = 1; }
}
