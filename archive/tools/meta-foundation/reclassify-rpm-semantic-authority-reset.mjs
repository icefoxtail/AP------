#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { reclassifyR1MetaItem } from '../r2e/read-only-r1-adapter.mjs';
import { parseQuestionBank } from './reviewed-apply-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const args = process.argv.slice(2);
const option = name => { const at = args.indexOf('--' + name); return at < 0 ? '' : args[at + 1] || ''; };
const intakeRef = option('intake-ref') || 'origin/work/intake/m2';
const outputPath = path.resolve(root, option('out') || 'archive/data/meta-foundation/evidence/rpm-primary-v1.0/semantic-authority-20260928/reset-r1-reclassification.json');
const targets = [
  { examUid: '25_삼산중_2학기_기말_중2_기출', oldAdvancedMetaHold: 14, oldMigrationGap: 0 },
  { examUid: '25_연향중_2학기_기말_중2_기출', oldAdvancedMetaHold: 8, oldMigrationGap: 0 },
  { examUid: '25_왕운중_2학기_기말_중2_기출', oldAdvancedMetaHold: 0, oldMigrationGap: 14 },
];
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitText = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const gitBlob = file => execFileSync('git', ['show', intakeRef + ':' + file], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
const ordinalOf = row => {
  if (typeof row === 'number' && Number.isSafeInteger(row) && row > 0) return row;
  const n = Number(row?.sourceOrdinal ?? row?.ordinal ?? row?.questionNo ?? row?.q);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
};
const uniqueCounts = (rows, field) => {
  const out = {};
  for (const row of rows) {
    const key = String(row[field] || 'UNAVAILABLE');
    out[key] = (out[key] || 0) + 1;
  }
  return out;
};
function readJsonBlob(file) {
  const bytes = gitBlob(file);
  return { bytes, sha256: digest(bytes), value: JSON.parse(bytes.toString('utf8')) };
}
function basicHoldOrdinals(receipt, evidence) {
  const holds = new Set();
  const evidenceSections = [receipt, evidence, evidence?.meta].filter(section => section && typeof section === 'object');
  for (const section of evidenceSections) {
    for (const field of ['BASIC_HARD_HOLD', 'SOURCE_HARD_HOLD', 'GENUINE_SOURCE_HOLD', 'TRUE_HOLD', 'sourceHardHolds', 'basicHardHolds', 'trueHold']) {
      for (const row of Array.isArray(section[field]) ? section[field] : []) {
        const ordinal = ordinalOf(row);
        if (ordinal) holds.add(ordinal);
      }
    }
    for (const row of section.unresolvedItems || []) {
      const disposition = String(row.disposition || row.class || row.status || '').toUpperCase();
      if (!/BASIC_HARD_HOLD|SOURCE_HARD_HOLD|GENUINE_SOURCE_HOLD|TRUE_HOLD/.test(disposition)) continue;
      const ordinal = ordinalOf(row);
      if (ordinal) holds.add(ordinal);
    }
  }
  const extra = evidence.basicHoldEvidence;
  if (Array.isArray(extra)) for (const row of extra) {
    const ordinal = ordinalOf(row);
    if (ordinal) holds.add(ordinal);
  }
  if (extra && typeof extra === 'object') {
    for (const field of ['items', 'questions', 'ordinals', 'questionNumbers']) if (Array.isArray(extra[field])) {
      for (const row of extra[field]) {
        const ordinal = typeof row === 'number' ? row : ordinalOf(row);
        if (Number.isSafeInteger(ordinal) && ordinal > 0) holds.add(ordinal);
      }
    }
  }
  return holds;
}
function frozenExam(receipt, receiptFile) {
  const inputCommit = receipt.inputCommit || receipt.sourceAuthorityCommit
    || gitText(['log', '-1', '--format=%H', intakeRef, '--', receiptFile]);
  const paths = gitText(['-c', 'core.quotepath=false', 'ls-tree', '-r', '--name-only', inputCommit]).split(/\r?\n/)
    .filter(file => file.normalize('NFC').endsWith('/' + String(receipt.examFile).normalize('NFC')) && file.startsWith('archive/exams/original/middle/m2/'));
  if (paths.length !== 1) throw new Error(receipt.examUid + ': expected one frozen M2 exam JS, found ' + paths.length);
  const examFile = paths[0];
  const bytes = execFileSync('git', ['show', inputCommit + ':' + examFile], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  const questions = parseQuestionBank(bytes.toString('utf8'), examFile);
  if (questions.length !== Number(receipt.totalQuestions)) throw new Error(receipt.examUid + ': frozen source denominator mismatch');
  return { inputCommit, examFile, sourceArchiveFile: examFile.replace(/^archive\/exams\//, ''), questions };
}
function summarizeExam(target) {
  const base = 'archive/data/r2e-intake/m2/' + target.examUid;
  const receiptFile = base + '.json';
  const receiptBlob = readJsonBlob(receiptFile);
  const receipt = receiptBlob.value;
  const frozenSource = frozenExam(receipt, receiptFile);
  const metaPath = receipt.metaResolutionEvidenceRef?.path || base + '.meta.json';
  const metaBlob = readJsonBlob(metaPath);
  const meta = metaBlob.value;
  const expectedMetaSha = String(receipt.metaResolutionEvidenceRef?.sha256 || '').replace(/^sha256:/, '');
  if (expectedMetaSha && expectedMetaSha !== metaBlob.sha256) throw new Error(target.examUid + ': frozen Meta evidence SHA mismatch');
  const evidenceFile = base + '.evidence.json';
  let evidence = {};
  let evidenceSha = '';
  try {
    const result = readJsonBlob(evidenceFile);
    evidence = result.value;
    evidenceSha = result.sha256;
  } catch { /* target may not have an evidence sidecar */ }
  const oldAdvancedRows = [
    ...(receipt.unresolvedItems || []).filter(row => row.disposition === 'ADVANCED_META_HOLD'),
    ...(evidence.meta?.ADVANCED_META_HOLD || []),
  ];
  const oldAdvanced = new Set(oldAdvancedRows.map(ordinalOf).filter(Boolean));
  const sourceHolds = basicHoldOrdinals(receipt, evidence);
  const rows = (meta.items || []).map(item => {
    const ordinal = ordinalOf(item);
    const fresh = reclassifyR1MetaItem(item, { repoRoot: root, sourceArchiveFile: frozenSource.sourceArchiveFile,
      sourceQuestion: ordinal ? frozenSource.questions[ordinal - 1] : null });
    let rpmSemanticStatus = fresh.semanticStatus || 'UNAVAILABLE';
    let rpmSemanticReason = fresh.projectionReasonCode || fresh.reasonCode || '';
    if (rpmSemanticStatus === 'UNAVAILABLE' && sourceHolds.has(Number(fresh.ordinal))) {
      rpmSemanticStatus = 'NOT_EVALUATED_SOURCE_HOLD';
      rpmSemanticReason = 'PRESERVED_BASIC_OR_SOURCE_HOLD';
    } else if (rpmSemanticStatus === 'UNAVAILABLE') {
      rpmSemanticStatus = 'HOLD';
      rpmSemanticReason = 'RPM_SEMANTIC_INPUT_OR_PATH_UNRESOLVED';
    }
    return {
      questionUid: fresh.questionUid,
      sourceOrdinal: fresh.ordinal,
      priorDisposition: fresh.priorDisposition || item.disposition || '',
      priorAdvancedMetaHold: oldAdvanced.has(Number(fresh.ordinal)),
      priorMigrationGap: target.oldMigrationGap > 0 && item.disposition === 'RPM_PRIMARY_MIGRATION_GAP',
      rpmSemanticStatus,
      rpmSemanticPath: fresh.rpmPath,
      rpmSemanticReason,
      legacyProjectionStatus: fresh.projectionStatus || 'NOT_ATTEMPTED',
      projectionReasonCode: fresh.projectionReasonCode || '',
      problemTypeKey: fresh.problemTypeKey || '',
      templateKey: fresh.templateKey || '',
      canonicalOwnerPack: fresh.canonicalOwnerPack || '',
      bindingOwnerPack: fresh.bindingOwnerPack || '',
      resolverEvidenceSha: fresh.resolverEvidenceSha || '',
      evidenceValidationStatus: fresh.status,
      preservedBasicSourceHold: sourceHolds.has(Number(fresh.ordinal)),
    };
  });
  const semantic = {
    FINAL: rows.filter(row => row.rpmSemanticStatus === 'FINAL').length,
    HOLD: rows.filter(row => row.rpmSemanticStatus === 'HOLD').length,
    NOT_EVALUATED_SOURCE_HOLD: rows.filter(row => row.rpmSemanticStatus === 'NOT_EVALUATED_SOURCE_HOLD').length,
  };
  const projection = uniqueCounts(rows.filter(row => row.rpmSemanticStatus === 'FINAL'), 'legacyProjectionStatus');
  const targetedOldAdvancedRows = rows.filter(row => row.priorAdvancedMetaHold);
  const oldGapRows = rows.filter(row => row.priorMigrationGap);
  const priorAdvancedMetaHoldCount = oldAdvanced.size || Number(receipt.metaDispositionSummary?.ADVANCED_META_HOLD || 0);
  const priorMigrationGapCount = target.oldMigrationGap > 0
    ? Number(receipt.metaDispositionSummary?.RPM_PRIMARY_MIGRATION_GAP || oldGapRows.length || target.oldMigrationGap) : 0;
  if (priorAdvancedMetaHoldCount !== target.oldAdvancedMetaHold) {
    throw new Error(target.examUid + ': unexpected old ADVANCED_META_HOLD denominator ' + priorAdvancedMetaHoldCount);
  }
  if (target.oldMigrationGap > 0 && priorMigrationGapCount !== target.oldMigrationGap && oldGapRows.length !== target.oldMigrationGap) {
    throw new Error(target.examUid + ': unexpected old migration-gap denominator');
  }
  const oldAdvancedSemantic = {
    FINAL: targetedOldAdvancedRows.filter(row => row.rpmSemanticStatus === 'FINAL').length,
    HOLD: targetedOldAdvancedRows.filter(row => row.rpmSemanticStatus === 'HOLD').length,
    NOT_EVALUATED_SOURCE_HOLD: targetedOldAdvancedRows.filter(row => row.rpmSemanticStatus === 'NOT_EVALUATED_SOURCE_HOLD').length,
  };
  const oldMigrationGapSemantic = {
    FINAL: oldGapRows.filter(row => row.rpmSemanticStatus === 'FINAL').length,
    HOLD: oldGapRows.filter(row => row.rpmSemanticStatus === 'HOLD').length,
    NOT_EVALUATED_SOURCE_HOLD: oldGapRows.filter(row => row.rpmSemanticStatus === 'NOT_EVALUATED_SOURCE_HOLD').length,
  };
  return {
    examUid: target.examUid,
    stage: receipt.stage,
    denominator: rows.length,
    inputCommit: frozenSource.inputCommit,
    sourceAuthorityCommit: receipt.sourceAuthorityCommit || null,
    frozenReceipt: { path: receiptFile, sha256: receiptBlob.sha256 },
    frozenR1Evidence: evidenceSha ? { path: evidenceFile, sha256: evidenceSha } : null,
    frozenMetaEvidence: { path: metaPath, sha256: metaBlob.sha256 },
    priorReceiptStatus: receipt.status || receipt.nextState || '',
    priorMetaDispositionSummary: receipt.metaDispositionSummary || {},
    priorAdvancedMetaHoldCount,
    priorMigrationGapCount,
    reclassifiedOldAdvancedMetaHold: oldAdvancedSemantic,
    reclassifiedOldMigrationGap: oldMigrationGapSemantic,
    oldMigrationGapProjection: uniqueCounts(oldGapRows.filter(row => row.rpmSemanticStatus === 'FINAL'), 'legacyProjectionStatus'),
    rpmSemantic: semantic,
    legacyProjection: projection,
    preservedBasicSourceHoldCount: sourceHolds.size,
    preservedVisualHoldCount: Number(receipt.validatorSummary?.visualComplianceHoldCount || 0),
    trueMetaHoldItems: rows.filter(row => row.rpmSemanticStatus === 'HOLD'),
    rows,
  };
}
const mainSha = gitText(['rev-parse', intakeRef]);
const exams = targets.map(summarizeExam);
const result = {
  schemaVersion: 'RPM_SEMANTIC_AUTHORITY_RESET_RECLASSIFICATION_v1',
  status: exams.every(exam => exam.reclassifiedOldAdvancedMetaHold.HOLD === 0
    && exam.reclassifiedOldMigrationGap.HOLD === 0 && exam.rpmSemantic.HOLD === 0) ? 'PASS' : 'HOLD',
  intakeRef,
  intakeHead: mainSha,
  reclassificationMode: 'FROZEN_R1_SEMANTIC_INPUT_ONLY_NO_SOURCE_OR_SOLUTION_REVIEW',
  createdAgainstMain: gitText(['rev-parse', 'origin/main']),
  exams,
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n', 'utf8');
process.stdout.write(JSON.stringify({
  status: result.status,
  intakeHead: result.intakeHead,
  output: path.relative(root, outputPath).replaceAll('\\', '/'),
  exams: exams.map(exam => ({
    examUid: exam.examUid,
    priorAdvancedMetaHoldCount: exam.priorAdvancedMetaHoldCount,
    priorMigrationGapCount: exam.priorMigrationGapCount,
    reclassifiedOldAdvancedMetaHold: exam.reclassifiedOldAdvancedMetaHold,
    reclassifiedOldMigrationGap: exam.reclassifiedOldMigrationGap,
    oldMigrationGapProjection: exam.oldMigrationGapProjection,
    rpmSemantic: exam.rpmSemantic,
    legacyProjection: exam.legacyProjection,
    preservedBasicSourceHoldCount: exam.preservedBasicSourceHoldCount,
    preservedVisualHoldCount: exam.preservedVisualHoldCount,
    trueMetaHoldCount: exam.trueMetaHoldItems.length,
  })),
}, null, 2) + '\n');
if (result.status !== 'PASS') process.exitCode = 1;
