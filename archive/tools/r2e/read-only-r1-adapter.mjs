import { blob, ensure, relative, sha } from './common.mjs';
import { parseQuestionBank } from '../meta-foundation/reviewed-apply-core.mjs';

const META_TOKENS = /RPM_PRIMARY_MIGRATION_GAP|R2_ADJUDICATION_REQUIRED|RELATIONAL_ACTIVE_KEY_GAP|ACTIVE_KEY_GAP|META_CANONICAL_HOLD|META_PACK_GAP_HOLD|PROPOSED_NEW_L[34]|PROPOSED_NEW_CROSS_CONCEPT|CROSS_CONCEPT_CANDIDATE|DIFFICULTY_(?:MISSING|GAP)|META_(?:MISSING|STALE|GAP)/i;
const SVG_TOKENS = /SVG|VISUAL|GEOMETRY|IMAGE|ASSET|DIAGRAM/i;
const JS_TOKENS = /JS|SYNTAX|SERIALIZATION|CONTROL.?CHAR|LATEX|ANSWER|SOLUTION|CONTENT|CHOICE|SOURCE|IDENTITY|DENOMINATOR/i;
const META_SOURCE = /(?:rpmMigrationGaps|proposedNewL3|proposedNewL4|proposedNewCrossConcept|crossConceptCandidates|metaAdjudications)/i;
const OPEN_STATE = /(?:^|[_\s:])(?:HOLD|REPAIR|REPAIR_REQUIRED|REPAIR_PENDING|FAIL|CONFLICT|GAP|PROPOSAL|PROPOSED_NEW|UNRESOLVED|MISMATCH|ERROR|R2_ADJUDICATION_REQUIRED)(?:[_\s:]|$)/i;
const CLOSED_STATE = /(?:^|_)(?:PASS|KEEP|EXISTING_REUSE|REPAIRED|FIXED|RESOLVED|CLOSED|VERIFIED_NO_CHANGE|MAPPED_EXISTING|GROUP_RESOLVED|APPLIED)(?:_|$)/i;
const HOLD_AUTHORITY_FIELDS = new Set([
  'unresolvedItems', 'sourceHardHolds', 'rpmMigrationGaps', 'proposedNewL3', 'proposedNewL4',
  'proposedNewCrossConcept', 'crossConceptCandidates', 'visualHolds', 'trueHold',
]);
const ITEMIZED_HOLD_FIELDS = [
  'unresolvedItems', 'sourceHardHolds', 'rpmMigrationGaps', 'proposedNewL3', 'proposedNewL4',
  'proposedNewCrossConcept', 'crossConceptCandidates', 'perQuestion', 'rpmByQ', 'items', 'holdItems', 'visualHolds', 'trueHold',
];

function clean(value) {
  return String(value == null ? '' : value).trim();
}
function stateValues(row) {
  if (typeof row === 'string') return [row];
  if (!row || typeof row !== 'object') return [];
  return [
    row.disposition, row.status, row.code, row.errorCode, row.reasonCode,
    row.outcome, row.reviewStatus, row.questionDisposition, row.r1Status,
    row.finalStatus, row.holdType, row.repairType, row.svgDisposition,
    row.svgReview, row.svgStatus, row.visualReview, row.visualStatus,
    row.solutionDisposition, row.solutionReview, row.solutionStatus,
    row.answerDisposition, row.answerReview, row.answerStatus,
  ].map(clean).filter(Boolean);
}
function isClosedR1Row(row) {
  return stateValues(row).some(value => CLOSED_STATE.test(value.toUpperCase().replaceAll('-', '_').replaceAll(' ', '_')));
}
function hasOpenR1State(row) {
  return stateValues(row).some(value => OPEN_STATE.test(value.toUpperCase().replaceAll('-', '_')));
}
function isAuthoritativeHoldSource(sourceName) {
  return HOLD_AUTHORITY_FIELDS.has(String(sourceName).split('.').at(-1));
}
function itemOrdinal(row) {
  const value = row && (row.sourceOrdinal ?? row.questionNo ?? row.ordinal ?? row.q ?? row.question ?? row.id);
  const n = Number(value);
  if (Number.isSafeInteger(n) && n > 0) return n;
  const match = String(value ?? '').match(/(?:^|\b)q\s*(\d+)\b/i);
  return match ? Number(match[1]) : null;
}
function expandQuestionScope(row) {
  if (!row || typeof row !== 'object' || itemOrdinal(row)) return [row];
  const values = [row.questions, row.questionNumbers, row.questionOrdinals].find(Array.isArray);
  if (!values) return [row];
  return values.map(value => ({
    ...row,
    sourceOrdinal: Number(value) || undefined,
    questionNo: Number(value) || value,
    questions: undefined,
    questionNumbers: undefined,
    questionOrdinals: undefined,
  }));
}
function rowText(row) {
  if (typeof row === 'string') return row;
  if (!row || typeof row !== 'object') return '';
  return [
    row.type, row.disposition, row.status, row.code, row.errorCode, row.reasonCode, row.reason,
    row.field, row.category, row.holdType, row.repairType, row.reviewStatus,
    row.outcome, row.holdReason, row.questionDisposition, row.r1Status, row.finalStatus,
    row.solutionDisposition, row.solutionReview, row.sourceStatus, row.solutionStatus,
    row.svgDisposition, row.svgReview, row.svgStatus, row.visualReview, row.visualStatus,
    row.answerDisposition, row.answerReview, row.answerStatus, row.mathReview, row.l1l2Review, row.metaStatus,
  ].map(clean).filter(Boolean).join(' ');
}
function classification(row, sourceName) {
  if (isClosedR1Row(row)) return null;
  if (!isAuthoritativeHoldSource(sourceName) && !hasOpenR1State(row)) return null;
  const text = rowText(row);
  const disposition = clean(row && (row.disposition || row.status || row.code || row.errorCode || row.reasonCode || row.type)) || sourceName;
  const field = clean(row && (row.field || row.targetField));
  if (META_SOURCE.test(sourceName) || META_TOKENS.test(text) || /META|RPM|L3|L4|CROSS.?CONCEPT|DIFFICULTY|CURRICULUM.?BINDING/i.test(field)) {
    const reason = clean(row && (row.reasonCode || row.dispositionReason || row.reason || row.code)) || disposition;
    return { releaseEffect: 'META_ONLY', category: 'META_MAPPING', disposition, reasonCode: reason };
  }
  if (/R1_HOLD_INVENTORY_SOURCE_MISSING/.test(text)) {
    return { releaseEffect: 'RELEASE_BLOCKING', category: 'R1_AUTHORITY_INCOMPLETE', disposition, reasonCode: 'R1_HOLD_INVENTORY_SOURCE_MISSING' };
  }
  if (/sourceHardHolds|trueHold/i.test(sourceName) || /TRUE_HOLD|SOURCE_HARD_HOLD|SOURCE_TRUTH|SOURCE_IDENTITY|ANSWER_KEY_DEFECT/i.test(text)) {
    const reason = clean(row && (row.reasonCode || row.dispositionReason || row.reason || row.code)) || disposition;
    return { releaseEffect: 'RELEASE_BLOCKING', category: 'SOURCE_OR_MATH_HOLD', disposition, reasonCode: reason };
  }
  if (SVG_TOKENS.test(text) || /^(?:svg|solutionImage|image|visualAsset)$/i.test(field)) {
    const reason = clean(row && (row.reasonCode || row.dispositionReason || row.reason || row.code)) || disposition;
    return { releaseEffect: 'RELEASE_BLOCKING', category: 'SVG_REPAIR', disposition, reasonCode: reason };
  }
  if (JS_TOKENS.test(text) || /^(?:content|choices|answer|solution|image|questionBank)$/i.test(field)) {
    const reason = clean(row && (row.reasonCode || row.dispositionReason || row.reason || row.code)) || disposition;
    return { releaseEffect: 'RELEASE_BLOCKING', category: 'JS_OR_SOLUTION_REPAIR', disposition, reasonCode: reason };
  }
  return {
    releaseEffect: 'RELEASE_BLOCKING',
    category: 'UNCLASSIFIED_R1_FINDING',
    disposition,
    reasonCode: clean(row && (row.reasonCode || row.dispositionReason || row.reason || row.code)) || 'R1_FINDING_NEEDS_CLASSIFICATION',
  };
}
function isCleanPerQuestion(row) {
  return isClosedR1Row(row) || !hasOpenR1State(row);
}
function optionalBlob(repo, commit, filePath) {
  try {
    const normalized = relative(filePath);
    const bytes = blob(repo, commit, normalized);
    return { path: normalized, sha256: sha(bytes), bytes, status: 'READ_ONLY' };
  } catch (error) {
    return { path: filePath || null, sha256: null, bytes: null, status: 'UNAVAILABLE', reason: error.message };
  }
}
export function readR1Authority(repo, candidate, { identityBySource = new Map() } = {}) {
  ensure(candidate && /^[a-f0-9]{40}$/.test(candidate.inputCommit || ''), 'R1_INPUT_COMMIT_REQUIRED');
  const receiptPath = relative(candidate.receiptPath);
  const receiptBytes = blob(repo, candidate.inputCommit, receiptPath);
  const receipt = JSON.parse(receiptBytes.toString('utf8'));
  ensure(receipt.nextState === 'READY_FOR_R2E', 'R1_RECEIPT_NOT_READY');
  ensure(receipt.examUid === candidate.examUid, 'R1_EXAM_UID_MISMATCH');
  const examFile = relative(candidate.examFile);
  const examBytes = blob(repo, candidate.inputCommit, examFile);
  const bank = parseQuestionBank(examBytes.toString('utf8'), examFile);
  ensure(bank.length === Number(receipt.totalQuestions), 'R1_DENOMINATOR_MISMATCH');
  ensure(bank.every((q, index) => Number(q.id) === index + 1), 'R1_ORDINAL_SEQUENCE_INVALID');

  const evidencePath = receiptPath.replace(/\.json$/, '.evidence.json');
  const evidenceBlob = optionalBlob(repo, candidate.inputCommit, evidencePath);
  let evidence = null;
  if (evidenceBlob.bytes) {
    try { evidence = JSON.parse(evidenceBlob.bytes.toString('utf8')); }
    catch (error) { evidenceBlob.status = 'INVALID_JSON'; evidenceBlob.reason = error.message; evidenceBlob.bytes = null; }
  }

  const metaRef = receipt.metaResolutionEvidenceRef;
  let metaBlob = { path: null, sha256: null, status: 'META_ONLY_LEGACY', reason: 'META_SIDECAR_ABSENT' };
  let metaEvidence = null;
  if (metaRef && typeof metaRef.path === 'string') {
    metaBlob = optionalBlob(repo, candidate.inputCommit, metaRef.path);
    if (metaBlob.bytes && String(metaRef.sha256 || '').replace(/^sha256:/, '') === metaBlob.sha256) {
      try { metaEvidence = JSON.parse(metaBlob.bytes.toString('utf8')); metaBlob.status = 'READ_ONLY_VALID_HASH'; }
      catch (error) { metaBlob.status = 'META_ONLY_INVALID'; metaBlob.reason = error.message; metaBlob.bytes = null; }
    } else if (metaBlob.bytes) {
      metaBlob.status = 'META_ONLY_STALE_HASH';
      metaBlob.reason = 'META_REF_HASH_MISMATCH';
      metaBlob.bytes = null;
    }
  }

  const evidenceRefs = [
    { role: 'R1_RECEIPT', path: receiptPath, sha256: sha(receiptBytes), inputCommit: candidate.inputCommit },
    ...(evidenceBlob.sha256 ? [{ role: 'R1_EVIDENCE', path: evidencePath, sha256: evidenceBlob.sha256, inputCommit: candidate.inputCommit }] : []),
    ...(metaBlob.sha256 ? [{ role: 'META_EVIDENCE_READ_ONLY', path: metaBlob.path, sha256: metaBlob.sha256, inputCommit: candidate.inputCommit }] : []),
  ];
  const findings = new Map();
  const addOne = (rowObject, sourceName, sourcePath) => {
    if (!itemOrdinal(rowObject) && (Number(rowObject.count) > 0 || /\bq\s*\d+\s*[-–]/i.test(clean(rowObject.scope)))) return;
    const classificationResult = classification(rowObject, sourceName);
    if (!classificationResult) return;
    const normalizedReasonCode = classificationResult.category === 'SOURCE_OR_MATH_HOLD'
      && (/trueHold/i.test(sourceName) || /\bTRUE_HOLD\b/i.test(rowText(rowObject)))
      ? 'TRUE_HOLD' : classificationResult.reasonCode;
    const ordinal = itemOrdinal(rowObject);
    const explicitUid = clean(rowObject.questionUid || rowObject.uid || rowObject.qid) || null;
    const sourceArchiveFile = examFile.replace(/^archive\/exams\//, '');
    const identity = ordinal ? identityBySource.get(sourceArchiveFile + '#' + ordinal) : null;
    const questionUid = explicitUid || identity && identity.questionUid || null;
    const reason = clean(rowObject.reason || rowObject.reasonCode || rowObject.dispositionReason || rowObject.code) || classificationResult.reasonCode;
    const key = [candidate.examUid, questionUid || 'NO_UID', ordinal || 'NO_ORDINAL', classificationResult.category, normalizedReasonCode].join('|');
    const existing = findings.get(key);
    const sourceSha = sourceName.startsWith('R1_EVIDENCE.') ? evidenceBlob.sha256
      : sourceName.startsWith('R1_META_SIDECAR.') ? metaBlob.sha256 : sha(receiptBytes);
    const ref = sourcePath && sourceSha ? { path: sourcePath, sha256: sourceSha, role: sourceName, inputCommit: candidate.inputCommit } : null;
    const detail = {
      disposition: classificationResult.disposition,
      field: clean(rowObject.field || rowObject.targetField) || null,
      reason,
      rpmPrimary: rowObject.rpmPrimary || rowObject.rpm || rowObject.rpmPrimaryId || null,
      problemTypeKey: rowObject.problemTypeKey || rowObject.candidateMeta && rowObject.candidateMeta.problemTypeKey || null,
      templateKey: rowObject.templateKey || rowObject.candidateMeta && rowObject.candidateMeta.templateKey || null,
      standardUnitKey: rowObject.standardUnitKey || null,
      subUnitKey: rowObject.subUnitKey || null,
      sourceFingerprint: rowObject.sourceFingerprint || rowObject.resolverEvidence && rowObject.resolverEvidence.sourceFingerprint || null,
      inputSource: sourceName,
    };
    if (existing) {
      existing.details.push(detail);
      if (ref && !existing.evidenceRefs.some(x => x.path === ref.path && x.sha256 === ref.sha256)) existing.evidenceRefs.push(ref);
      return;
    }
    const body = {
      examUid: candidate.examUid,
      examFile,
      inputBranch: candidate.intakeBranch,
      inputCommit: candidate.inputCommit,
      questionUid,
      ordinal,
      releaseEffect: classificationResult.releaseEffect,
      category: classificationResult.category,
      reasonCode: normalizedReasonCode,
      status: 'COLLECTED',
      groupId: null,
      upperModelCaseId: null,
      evidenceRefs: ref ? [ref] : [],
      details: [detail],
    };
    body.findingId = 'hold_' + sha(Buffer.from(JSON.stringify({ examUid: body.examUid, questionUid, ordinal, releaseEffect: body.releaseEffect, category: body.category, reasonCode: body.reasonCode }))).slice(0, 20);
    findings.set(key, body);
  };
  const add = (row, sourceName, sourcePath) => {
    const rowObject = row && typeof row === 'object' ? row : { reason: String(row) };
    for (const scopedRow of expandQuestionScope(rowObject)) addOne(scopedRow, sourceName, sourcePath);
  };

  const rowFields = [
    'unresolvedItems', 'repairs', 'sourceHardHolds', 'rpmMigrationGaps',
    'proposedNewL3', 'proposedNewL4', 'proposedNewCrossConcept',
    'crossConceptCandidates', 'rpmByQ', 'l1l2RepairCandidates', 'answerRepairs',
    'solutionRepairs', 'svgRepairs', 'visualHolds', 'trueHold',
  ];
  for (const source of [{ name: 'R1_RECEIPT', value: receipt, path: receiptPath }, { name: 'R1_EVIDENCE', value: evidence, path: evidencePath }]) {
    if (!source.value) continue;
    for (const field of rowFields) {
      if (Array.isArray(source.value[field])) for (const row of source.value[field]) add(row, source.name + '.' + field, source.path);
    }
    for (const field of ['perQuestion', 'rpmByQ', 'items']) {
      const rows = source.value[field];
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (!row || typeof row !== 'object' || isCleanPerQuestion(row)) continue;
        add(row, source.name + '.' + field, source.path);
      }
    }
  }
  if (metaEvidence && Array.isArray(metaEvidence.items)) {
    for (const row of metaEvidence.items) {
      if (!row || typeof row !== 'object') continue;
      const disposition = clean(row.disposition || row.resolverEvidence && row.resolverEvidence.disposition);
      if (META_TOKENS.test(disposition) || /TRUE_TAXONOMY_GAP|ROUTE_OUT/i.test(disposition)) add({
        ...row,
        questionUid: row.questionUid,
        sourceOrdinal: row.sourceOrdinal,
        disposition,
        reasonCode: row.resolverEvidence && row.resolverEvidence.dispositionReason,
        problemTypeKey: row.candidateMeta && row.candidateMeta.problemTypeKey,
        templateKey: row.candidateMeta && row.candidateMeta.templateKey,
        sourceFingerprint: row.resolverEvidence && row.resolverEvidence.sourceFingerprint,
      }, 'R1_META_SIDECAR.' + disposition, metaBlob.path);
    }
  }

  const r1HoldEvidenceComplete = ITEMIZED_HOLD_FIELDS.some(field => Array.isArray(receipt[field]) || Array.isArray(evidence && evidence[field]));
  if (!r1HoldEvidenceComplete) add({
    disposition: 'R1_HOLD_INVENTORY_SOURCE_MISSING', reason: 'R1 receipt and read-only evidence sidecar contain no itemized disposition array.',
  }, 'R1_AUTHORITY_INCOMPLETE', receiptPath);

  const list = [...findings.values()].sort((a, b) => (a.ordinal || 0) - (b.ordinal || 0) || a.findingId.localeCompare(b.findingId));
  return {
    readOnly: true,
    examUid: candidate.examUid,
    examFile,
    inputBranch: candidate.intakeBranch,
    intakeHead: candidate.intakeHead,
    inputCommit: candidate.inputCommit,
    receiptPath,
    receiptSha256: sha(receiptBytes),
    r1Evidence: { path: evidencePath, sha256: evidenceBlob.sha256, status: evidenceBlob.status, reason: evidenceBlob.reason || null },
    metaAuthority: { path: metaBlob.path, sha256: metaBlob.sha256, status: metaBlob.status, reason: metaBlob.reason || null },
    metaDispositionSummary: receipt.metaDispositionSummary || evidence && evidence.metaDispositionSummary || {},
    holdEvidenceStatus: r1HoldEvidenceComplete ? 'READ_ONLY_ITEMIZED' : 'R1_HOLD_INVENTORY_INCOMPLETE',
    metaOnlyFindings: metaBlob.status === 'READ_ONLY_VALID_HASH' ? [] : [{ code: metaBlob.status, path: metaBlob.path, reason: metaBlob.reason || null }],
    denominator: bank.length,
    examJsSha256: sha(examBytes),
    evidenceRefs,
    findings: list,
  };
}
