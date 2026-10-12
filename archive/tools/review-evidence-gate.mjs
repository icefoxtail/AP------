#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { validateSolutionCalibration } from './solution-calibration-gate.mjs';
import { questionOnlyReplacementProfile } from './question-only-replacement-v2.mjs';

const SCHEMA = 'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1';
const PASS = 'PASS';
const HOLD = 'HOLD';
const QUESTION_ONLY_REPLACEMENT = 'QUESTION_ONLY_REPLACEMENT_ACCEPTED';
const ALLOWED_STAGES = new Set(['CREATE', 'R1', 'R2', 'R3', 'SOLUTION_UPGRADE']);
const REQUIRED_AXES = [
  'sourceExact', 'answerMath', 'solutionMath', 'smallBoard',
  'curriculum', 'visualNecessity', 'meta', 'difficulty', 'runtimeString',
];
const HIGH_SIGNAL_TEX = [
  'dfrac', 'frac', 'sqrt', 'left', 'right', 'overline', 'text', 'mathrm',
  'mathbb', 'operatorname', 'cdot', 'times', 'leq', 'geq', 'neq', 'ne',
  'cup', 'cap', 'subset', 'supset', 'in', 'notin', 'emptyset', 'angle',
  'triangle', 'parallel', 'perp', 'vec', 'ell', 'qquad', 'mid',
];
const DOUBLE_TEX = new RegExp(`\\\\\\\\(${HIGH_SIGNAL_TEX.join('|')})(?![A-Za-z])`, 'g');
const ENUM_LABEL_RE = /(?:^|<br\s*\/?>|\n)\s*([ㄱ-ㅎ])\./g;

function parseArgs(argv) {
  const out = { stage: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--exam') out.exam = argv[++i];
    else if (arg === '--evidence') out.evidence = argv[++i];
    else if (arg === '--stage') out.stage = String(argv[++i] || '').toUpperCase();
    else if (arg === '--json') out.json = true;
    else throw new Error(`UNKNOWN_ARGUMENT:${arg}`);
  }
  if (!out.exam) throw new Error('EXAM_PATH_REQUIRED');
  if (!out.evidence) throw new Error('EVIDENCE_PATH_REQUIRED');
  if (!ALLOWED_STAGES.has(out.stage)) throw new Error('STAGE_CREATE_R1_R2_R3_OR_SOLUTION_UPGRADE_REQUIRED');
  return out;
}

const sha256 = value => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const normalize = value => String(value || '').replaceAll('\\', '/');
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const hasValue = value => value !== undefined && value !== null && (typeof value !== 'string' || value.trim().length > 0);
function validHoldEvidence(item) {
  const hold = item?.holdEvidence;
  return Boolean(hold
    && nonEmpty(hold.reason)
    && hasValue(hold.observedEvidence)
    && nonEmpty(hold.unresolvedPoint)
    && nonEmpty(hold.nextRequiredEvidenceOrCapability)
    && hasValue(hold.repairAttempted)
    && hasValue(hold.authorityLookupAttempted)
    && nonEmpty(hold.whyDeterministicClosureImpossible));
}

function loadExam(file) {
  const source = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: file, timeout: 5000 });
  const questions = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(questions) || questions.length === 0) throw new Error('QUESTION_BANK_REQUIRED');
  return { source, questions };
}

function array(value) { return Array.isArray(value) ? value : []; }

function collectEnumLabels(content) {
  const labels = [];
  for (const match of String(content || '').matchAll(ENUM_LABEL_RE)) {
    if (!labels.includes(match[1])) labels.push(match[1]);
  }
  return labels;
}

function enumSolutionSeparated(solution, labels) {
  const value = String(solution || '');
  return labels.every(label => new RegExp(`(?:^|\\n\\n|\\n)\\s*${label}\\.`).test(value));
}

function runtimeTexIssues(question) {
  const fields = [
    ['content', question.content], ['answer', question.answer], ['solution', question.solution],
    ...array(question.choices).map((choice, index) => [`choice${index + 1}`, choice]),
  ];
  const issues = [];
  for (const [field, raw] of fields) {
    const value = String(raw ?? '');
    DOUBLE_TEX.lastIndex = 0;
    for (const match of value.matchAll(DOUBLE_TEX)) issues.push(`${field}:runtime-double-slash-${match[1]}`);
  }
  return issues;
}

function checkQuestionRows(questions, evidence, issues, questionOnlyAcceptedQids = new Set()) {
  const rows = array(evidence.questionRows);
  const byQid = new Map();
  for (const row of rows) {
    const qid = Number(row?.qid);
    if (!Number.isInteger(qid)) { issues.push('QUESTION_ROW_QID_INVALID'); continue; }
    if (byQid.has(qid)) issues.push(`QUESTION_ROW_DUPLICATE:q${qid}`);
    byQid.set(qid, row);
  }
  for (const q of questions) {
    const row = byQid.get(Number(q.id));
    if (!row) { issues.push(`QUESTION_ROW_MISSING:q${q.id}`); continue; }
    for (const axis of REQUIRED_AXES) {
      const item = row[axis];
      const questionOnlyDisposition = axis === 'sourceExact'
        && item?.status === QUESTION_ONLY_REPLACEMENT
        && questionOnlyAcceptedQids.has(Number(q.id));
      if (!item || (![PASS, HOLD].includes(item.status) && !questionOnlyDisposition)) {
        issues.push(`QUESTION_AXIS_EVIDENCE_MISSING:q${q.id}:${axis}`);
        continue;
      }
      if (item.status === PASS && !nonEmpty(item.evidence)) {
        issues.push(`QUESTION_AXIS_PASS_EVIDENCE_MISSING:q${q.id}:${axis}`);
      }
      if (questionOnlyDisposition && !nonEmpty(item.evidence)) {
        issues.push(`QUESTION_ONLY_REPLACEMENT_EVIDENCE_MISSING:q${q.id}`);
      }
      if (item.status === HOLD && !validHoldEvidence(item)) {
        issues.push(`QUESTION_AXIS_HOLD_EVIDENCE_INCOMPLETE:q${q.id}:${axis}`);
      }
    }
    const tex = runtimeTexIssues(q);
    for (const issue of tex) issues.push(`RUNTIME_TEX_FAIL:q${q.id}:${issue}`);
    const labels = collectEnumLabels(q.content);
    if (labels.length >= 2 && !enumSolutionSeparated(q.solution, labels)) {
      issues.push(`SMALLBOARD_ENUMERATION_FAIL:q${q.id}:${labels.join(',')}`);
    }
  }
  const actual = new Set(questions.map(q => Number(q.id)));
  for (const qid of byQid.keys()) if (!actual.has(qid)) issues.push(`QUESTION_ROW_ORPHAN:q${qid}`);
  const heldQids = [...byQid.entries()]
    .filter(([, row]) => REQUIRED_AXES.some(axis => row?.[axis]?.status === HOLD))
    .map(([qid]) => qid)
    .sort((a, b) => a - b);
  return { rowCount: rows.length, heldQids };
}

function checkQuestionOnlyReplacementAdjudications(examFile, source, questions, evidence, issues) {
  const entries = array(evidence.questionOnlyReplacementAdjudications);
  const repoRoot = path.resolve(examFile.slice(0, examFile.lastIndexOf(`${path.sep}archive${path.sep}`)));
  const byQid = new Map((evidence.questionRows || []).map(row => [Number(row.qid), row]));
  const accepted = new Set();
  const readBoundJson = (ref, label, qid) => {
    const file = path.resolve(repoRoot, ref?.path || '');
    if (!file.startsWith(repoRoot + path.sep) || !fs.existsSync(file)) {
      issues.push(`QUESTION_ONLY_${label}_FILE_MISSING:q${qid}`);
      return null;
    }
    const bytes = fs.readFileSync(file), digest = crypto.createHash('sha256').update(bytes).digest('hex');
    if (!ref?.sha256 || digest !== ref.sha256) {
      issues.push(`QUESTION_ONLY_${label}_SHA_MISMATCH:q${qid}`);
      return null;
    }
    try { return JSON.parse(bytes.toString('utf8')); }
    catch { issues.push(`QUESTION_ONLY_${label}_JSON_INVALID:q${qid}`); return null; }
  };
  for (const entry of entries) {
    const qid = Number(entry?.qid), row = byQid.get(qid);
    const profile = questionOnlyReplacementProfile(evidence.examUid, qid);
    if (!profile || entry?.schemaVersion !== 'JS_ARCHIVE_CREATE_QUESTION_ONLY_REPLACEMENT_HISTORY_V1') {
      issues.push(`QUESTION_ONLY_REPLACEMENT_SCHEMA_OR_SCOPE_INVALID:q${qid}`);
      continue;
    }
    const decision = readBoundJson({ path: entry.adjudicationPath, sha256: entry.adjudicationSha256 }, 'ADJUDICATION', qid);
    if (!decision) continue;
    const q = questions.find(item => Number(item.id) === qid);
    const raw = digestSource(source);
    const blob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${Buffer.byteLength(source)}\0`), Buffer.from(source)])).digest('hex');
    const hashText = value => crypto.createHash('sha256').update(String(value ?? '')).digest('hex');
    const qChoicesHash = crypto.createHash('sha256').update(JSON.stringify(q?.choices ?? [])).digest('hex');
    const candidate = decision.currentCandidate || {};
    const prior = decision.priorStatuses || {};
    const problemImageRef = q?.image == null || q.image === '' ? null : q.image;
    const solutionImageRef = q?.solutionImage == null || q.solutionImage === '' ? null : q.solutionImage;
    const assetSha = (ref, prefix = false) => {
      if (!ref) return null;
      const file = path.resolve(repoRoot, 'archive', ref);
      if (!file.startsWith(path.resolve(repoRoot, 'archive') + path.sep) || !fs.existsSync(file)) return 'MISSING_OR_OUT_OF_SCOPE';
      const digest = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
      return prefix ? `sha256:${digest}` : digest;
    };
    let problemImageSha256 = null, solutionImageSha256 = null;
    try { problemImageSha256 = assetSha(problemImageRef); } catch { problemImageSha256 = 'MISSING_OR_OUT_OF_SCOPE'; }
    try { solutionImageSha256 = assetSha(solutionImageRef, true); } catch { solutionImageSha256 = 'MISSING_OR_OUT_OF_SCOPE'; }
    const candidateExtraRefs = [];
    const collectCandidateAssetRefs = (kind, value, index = '') => {
      if (typeof value === 'string' && value.trim()) {
        candidateExtraRefs.push({ kind: index ? `${kind}:${index}` : kind, ref: value });
      } else if (Array.isArray(value)) {
        value.forEach((item, itemIndex) => collectCandidateAssetRefs(kind, item, String(itemIndex)));
      } else if (value && typeof value === 'object') {
        const ref = value.ref || value.path || value.assetRef || value.imageRef;
        if (typeof ref === 'string' && ref.trim()) candidateExtraRefs.push({ kind: value.kind || kind, ref });
        else Object.entries(value).filter(([key]) => /(?:ref|path|image|asset)$/i.test(key))
          .forEach(([key, item]) => collectCandidateAssetRefs(`${kind}:${key}`, item));
      }
    };
    for (const field of ['images', 'visualAsset', 'assets']) collectCandidateAssetRefs(field, q?.[field]);
    const boundExtraAssets = [];
    const seenCandidateAssets = new Set([`problem:${problemImageRef}`, `solution:${solutionImageRef}`]);
    for (const extra of candidateExtraRefs) {
      const key = `${extra.kind}:${extra.ref}`;
      if (seenCandidateAssets.has(key)) continue;
      seenCandidateAssets.add(key);
      let digest = 'MISSING_OR_OUT_OF_SCOPE';
      try {
        const raw = assetSha(extra.ref);
        if (/^[a-f0-9]{64}$/.test(raw)) digest = raw;
      } catch {}
      boundExtraAssets.push({ kind: extra.kind, ref: extra.ref, sha256: digest });
    }
    const q22AssetBindingsValid = profile.key !== 'SUN-CHEON-YEO-PROB-Q22'
      || (decision.targetPayload?.problemImageRef === problemImageRef
        && decision.targetPayload?.problemImageSha256 === problemImageSha256
        && decision.targetPayload?.solutionImageRef === solutionImageRef
        && decision.targetPayload?.solutionImageSha256 === solutionImageSha256
        && (!problemImageRef || /^[a-f0-9]{64}$/.test(problemImageSha256))
        && (!solutionImageRef || /^sha256:[a-f0-9]{64}$/.test(solutionImageSha256))
        && same(decision.targetPayload?.assets, boundExtraAssets)
        && boundExtraAssets.every(item => /^[a-f0-9]{64}$/.test(item.sha256))
        && entry.currentAssetSha256 === problemImageSha256);
    if (decision.schemaVersion !== 'JS_ARCHIVE_CREATE_QUESTION_ONLY_REPLACEMENT_ADJUDICATION_V1'
      || decision.status !== 'QUESTION_ONLY_REPLACEMENT_ACCEPTED'
      || decision.executionLine !== 'CODEX' || decision.qualityContractVersion !== 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'
      || decision.qid !== qid || decision.stage !== 'CREATE' || decision.scopeOnly !== true
      || decision.fullExamCreateComplete !== false
      || decision.sourceParityClaim !== 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT'
      || candidate.rawSha256 !== raw || candidate.gitBlobSha1 !== blob
      || entry.currentSourceSha256 !== raw || Number(decision.sourceIdentity?.sourceOrdinal) !== qid
      || decision.sourceIdentity?.questionUid !== entry.questionUid
      || decision.targetPayload?.contentSha256 !== hashText(q?.content)
      || decision.targetPayload?.choicesSha256 !== qChoicesHash
      || decision.targetPayload?.answerSha256 !== hashText(q?.answer)
      || decision.targetPayload?.solutionSha256 !== hashText(q?.solution)
      || (profile.key === 'LEGACY_Q19' && (decision.targetPayload?.problemImageRef !== q?.image
        || decision.targetPayload?.problemImageSha256 !== entry.currentAssetSha256
        || decision.targetPayload?.solutionImageRef !== q?.solutionImage
        || !['sha256:' + crypto.createHash('sha256').update(fs.readFileSync(path.join(repoRoot, 'archive', q?.solutionImage || ''))).digest('hex')].includes(decision.targetPayload?.solutionImageSha256)))
      || !q22AssetBindingsValid
      || prior.sourceExact?.status !== HOLD || prior.solutionMath?.status !== HOLD
      || !decision.replacementReason || decision.replacementReason.sourceParityClaimed !== false) {
      issues.push(`QUESTION_ONLY_REPLACEMENT_BINDING_INVALID:q${qid}`);
    }
    const authority = readBoundJson(decision.authorityRef, 'AUTHORITY', qid);
    const create = readBoundJson(decision.createValidatorRef, 'CREATE_VALIDATOR', qid);
    const r1 = readBoundJson(decision.r1Ref, 'R1', qid);
    const r2 = readBoundJson(decision.r2Ref, 'R2', qid);
    const r3 = readBoundJson(decision.r3Ref, 'R3', qid);
    if (!authority || authority.schemaVersion !== 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_AUTHORITY_V1'
      || authority.status !== 'AUTHORIZED' || Number(authority.qid) !== qid
      || authority.replacementScope !== 'QUESTION_ONLY'
      || authority.sourceParityClaim !== 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT'
      || authority.candidate?.rawSha256 !== raw) issues.push(`QUESTION_ONLY_AUTHORITY_BINDING_INVALID:q${qid}`);
    if (!create || create.ok !== true || create.disposition !== 'PASS'
      || create.qualityContractVersion !== 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'
      || create.candidateScope !== 'QUESTION_ONLY_QID_CANDIDATE' || create.fullExamStageClosure !== false
      || create.questionOnly?.qid !== qid || create.artifactSha !== blob || array(create.issues).length) {
      issues.push(`QUESTION_ONLY_CREATE_VALIDATOR_BINDING_INVALID:q${qid}`);
    }
    if (!r1 || r1.stage !== 'R1' || r1.reviewScope !== 'QID_ONLY' || Number(r1.qid) !== qid
      || r1.candidateRawSha256 !== raw || r1.mathReview?.verdict !== PASS
      || !String(r1.result || '').startsWith(profile.key === 'LEGACY_Q19'
        ? 'QID_19_R1_CONTENT_AND_META_PASS' : `QID_${qid}_R1_CONTENT_AND_META_PASS`)) issues.push(`QUESTION_ONLY_R1_BINDING_INVALID:q${qid}`);
    const q22FreshR2Invalid = profile.key === 'SUN-CHEON-YEO-PROB-Q22'
      && (r2?.postfreezeDecision?.answerRecomputed !== true || r2?.postfreezeDecision?.answerFreezeReused !== false);
    const q22WrittenAnswerAudit = r2?.writtenAnswerAudit || {};
    const q22WrittenResponseInvalid = profile.key === 'SUN-CHEON-YEO-PROB-Q22'
      && (q?.questionType !== 'short_answer' || array(q?.choices).length !== 0
        || typeof q?.answer !== 'string' || !q.answer.trim()
        || r2?.responseForm !== 'SHORT_ANSWER'
        || q22WrittenAnswerAudit.status !== PASS
        || q22WrittenAnswerAudit.answerSha256 !== hashText(q?.answer)
        || q22WrittenAnswerAudit.answerCardinality !== 1
        || q22WrittenAnswerAudit.noDistinctAlternative !== true
        || !String(q22WrittenAnswerAudit.uniquenessReason || '').trim());
    if (!r2 || r2.stage !== 'R2' || r2.scope?.coverage !== 'QID_ONLY' || Number(r2.scope?.qid) !== qid
      || r2.currentCandidate?.sha256 !== raw || r2.studentInputParity?.disposition !== 'EXACT'
      || (profile.key === 'LEGACY_Q19' && (r2.postfreezeDecision?.answerRecomputed !== false || r2.postfreezeDecision?.answerFreezeReused !== true))
      || q22FreshR2Invalid || q22WrittenResponseInvalid) {
      issues.push(`QUESTION_ONLY_R2_BINDING_INVALID:q${qid}`);
    }
    const requiredR3Cases = profile.key === 'LEGACY_Q19'
      ? ['desktop-exam-q19', 'desktop-sol-q19', 'desktop-ans-q19']
      : [`desktop-exam-q${qid}`, `desktop-sol-q${qid}`, `desktop-ans-q${qid}`];
    const observedR3Cases = array(r3?.dispositions).filter(item => requiredR3Cases.includes(item.case));
    if (!r3 || r3.review?.overall !== (profile.key === 'LEGACY_Q19'
      ? 'QID_19_DESKTOP_RENDER_PASS_ONLY' : `QID_${qid}_DESKTOP_RENDER_PASS_ONLY`)
      || (profile.key === 'SUN-CHEON-YEO-PROB-Q22' && (observedR3Cases.length !== requiredR3Cases.length
        || new Set(observedR3Cases.map(item => item.case)).size !== requiredR3Cases.length))
      || !observedR3Cases.every(item => item.disposition === 'PASS_QID_RENDER')) issues.push(`QUESTION_ONLY_R3_BINDING_INVALID:q${qid}`);
    if (row?.sourceExact?.status !== QUESTION_ONLY_REPLACEMENT
      || row?.sourceExactAdjudicationRef?.path !== entry.adjudicationPath
      || row?.sourceExactAdjudicationRef?.sha256 !== entry.adjudicationSha256
      || row?.solutionMath?.status !== PASS
      || row?.solutionMathAdjudicationRef?.path !== entry.adjudicationPath
      || row?.solutionMathAdjudicationRef?.sha256 !== entry.adjudicationSha256) {
      issues.push(`QUESTION_ONLY_REPLACEMENT_CLEARANCE_UNBOUND:q${qid}`);
    }
    if (entry.priorStatuses?.sourceExact?.status !== HOLD || entry.priorStatuses?.solutionMath?.status !== HOLD) {
      issues.push(`QUESTION_ONLY_PRIOR_HOLD_NOT_PRESERVED:q${qid}`);
    }
    accepted.add(qid);
  }
  for (const row of evidence.questionRows || []) {
    const qid = Number(row.qid);
    if (row?.sourceExact?.status === QUESTION_ONLY_REPLACEMENT
      && !accepted.has(qid)) issues.push(`QUESTION_ONLY_REPLACEMENT_ORPHAN:q${qid}`);
  }
  return accepted;
}

function checkVisualRows(examFile, questions, evidence, issues) {
  const visualQuestions = questions.filter(q => nonEmpty(q.solutionImage));
  const rows = array(evidence.visualRows);
  const byQid = new Map(rows.map(row => [Number(row?.qid), row]));
  for (const q of visualQuestions) {
    const row = byQid.get(Number(q.id));
    if (!row) { issues.push(`VISUAL_ROW_MISSING:q${q.id}`); continue; }
    if (row.result !== PASS) issues.push(`VISUAL_ROW_NOT_PASS:q${q.id}`);
    if (normalize(row.assetPath) !== normalize(q.solutionImage)) issues.push(`VISUAL_PATH_MISMATCH:q${q.id}`);
    if (!array(row.expectedFacts).length || !array(row.observedFacts).length) issues.push(`VISUAL_FACTS_MISSING:q${q.id}`);
    const checks = array(row.checks);
    if (!checks.length) issues.push(`VISUAL_CHECKS_MISSING:q${q.id}`);
    if (!checks.some(check => ['COORDINATE_COMPUTE', 'TOPOLOGY_COMPUTE', 'SOURCE_PIXEL', 'TARGETED_RENDER'].includes(check?.method))) {
      issues.push(`VISUAL_PHYSICAL_METHOD_MISSING:q${q.id}`);
    }
    for (const [index, check] of checks.entries()) {
      if (check?.result !== PASS || !nonEmpty(check?.predicate) || check?.expected == null || check?.observed == null) {
        issues.push(`VISUAL_CHECK_INCOMPLETE:q${q.id}:${index + 1}`);
      }
      if (check?.method === 'TEXT_LABEL_ONLY') issues.push(`VISUAL_TEXT_ONLY_FORBIDDEN:q${q.id}:${index + 1}`);
    }
    const asset = path.resolve(path.dirname(examFile), '..', '..', '..', '..', q.solutionImage);
    const repoGuess = examFile.slice(0, examFile.lastIndexOf(`${path.sep}archive${path.sep}`));
    const repoAsset = repoGuess ? path.join(repoGuess, 'archive', q.solutionImage.replace(/^assets\//, 'assets/')) : asset;
    const candidates = [repoAsset, asset].filter(Boolean);
    const actualAsset = candidates.find(candidate => fs.existsSync(candidate));
    if (!actualAsset) { issues.push(`VISUAL_ASSET_NOT_FOUND:q${q.id}`); continue; }
    const bytes = fs.readFileSync(actualAsset);
    const actualSha = sha256(bytes);
    if (!nonEmpty(row.assetSha256) || row.assetSha256 !== actualSha) issues.push(`VISUAL_SHA_MISMATCH:q${q.id}`);
  }
  const expectedIds = new Set(visualQuestions.map(q => Number(q.id)));
  for (const row of rows) if (!expectedIds.has(Number(row?.qid))) issues.push(`VISUAL_ROW_ORPHAN:q${row?.qid}`);
  return { expected: visualQuestions.length, actual: rows.length };
}

function checkMetaRows(questions, evidence, issues) {
  const rows = array(evidence.metaRows);
  const byQid = new Map(rows.map(row => [Number(row?.qid), row]));
  for (const q of questions) {
    const row = byQid.get(Number(q.id));
    if (!row) { issues.push(`META_ROW_MISSING:q${q.id}`); continue; }
    if (![PASS, HOLD].includes(row.result) || !nonEmpty(row.primaryMethod) || !nonEmpty(row.decisiveStep)) {
      issues.push(`META_SEMANTIC_EVIDENCE_MISSING:q${q.id}`);
    }
    if (row.result === HOLD && !validHoldEvidence(row)) issues.push(`META_HOLD_EVIDENCE_INCOMPLETE:q${q.id}`);
    if (!nonEmpty(row.rpmDisposition) || !nonEmpty(row.projectionDisposition) || !array(row.lookupRefs).length) issues.push(`META_LOOKUP_EVIDENCE_MISSING:q${q.id}`);
    const ptNull = !nonEmpty(q.problemTypeKey);
    const tplNull = !nonEmpty(q.templateKey);
    if ((ptNull || tplNull) && row.projectionDisposition === 'EXACT_ACTIVE') issues.push(`META_NULL_BUT_RESOLVABLE:q${q.id}`);
    if ((ptNull || tplNull) && !nonEmpty(row.nullReason)) issues.push(`META_NULL_REASON_REQUIRED:q${q.id}`);
    if (nonEmpty(q.problemTypeKey) && row.problemTypeKey && row.problemTypeKey !== q.problemTypeKey) issues.push(`META_PT_EVIDENCE_MISMATCH:q${q.id}`);
    if (nonEmpty(q.templateKey) && row.templateKey && row.templateKey !== q.templateKey) issues.push(`META_TPL_EVIDENCE_MISMATCH:q${q.id}`);
  }
  const heldQids = rows.filter(row => row?.result === HOLD)
    .map(row => Number(row?.qid))
    .filter(Number.isInteger)
    .sort((a, b) => a - b);
  return { rowCount: rows.length, heldQids };
}

function checkIndependence(stage, evidence, issues) {
  const i = evidence.independence || {};
  if (stage === 'R1' && i.createReceiptUsedAsAuthority !== false) issues.push('R1_INDEPENDENCE_FLAG_REQUIRED');
  if (stage === 'R2') {
    if (i.blindDecisionFrozenBeforeR1Compare !== true) issues.push('R2_BLIND_FREEZE_REQUIRED');
    if (!nonEmpty(i.blindFreezeSha256)) issues.push('R2_BLIND_FREEZE_SHA_REQUIRED');
  }
  if (stage === 'R3') {
    if (i.freshFromArtifactBytes !== true) issues.push('R3_FRESH_BYTES_REQUIRED');
    if (i.priorStageCountsUsedAsEvidence !== false) issues.push('R3_PRIOR_COUNTS_FORBIDDEN');
  }
}

function checkSummary(evidence, derived, issues) {
  const summary = evidence.summary || {};
  for (const [key, value] of Object.entries(derived)) {
    if (summary[key] != null && Number(summary[key]) !== Number(value)) issues.push(`SUMMARY_COUNT_MISMATCH:${key}`);
  }
}

function checkFalseHoldAdjudications(examFile, source, questions, evidence, issues) {
  const entries = array(evidence.falseHoldAdjudications);
  const repoRoot = path.resolve(examFile.slice(0, examFile.lastIndexOf(`${path.sep}archive${path.sep}`)));
  const byQid = new Map((evidence.questionRows || []).map(row => [Number(row.qid), row]));
  for (const entry of entries) {
    const qid = Number(entry?.qid), row = byQid.get(qid);
    if (qid !== 24 || entry?.schemaVersion !== 'JS_ARCHIVE_CREATE_FALSE_HOLD_HISTORY_V1') { issues.push(`FALSE_HOLD_ADJUDICATION_SCHEMA_OR_SCOPE_INVALID:q${qid}`); continue; }
    const file = path.resolve(repoRoot, entry.adjudicationPath || '');
    if (!file.startsWith(repoRoot + path.sep) || !fs.existsSync(file)) { issues.push(`FALSE_HOLD_ADJUDICATION_FILE_MISSING:q${qid}`); continue; }
    const bytes = fs.readFileSync(file), digest = crypto.createHash('sha256').update(bytes).digest('hex');
    if (digest !== entry.adjudicationSha256) { issues.push(`FALSE_HOLD_ADJUDICATION_SHA_MISMATCH:q${qid}`); continue; }
    const decision = JSON.parse(bytes.toString('utf8'));
    const q = questions.find(item => Number(item.id) === qid), hashText = value => crypto.createHash('sha256').update(String(value ?? '')).digest('hex');
    const assetFile = q?.image ? path.resolve(repoRoot, 'archive', q.image) : '';
    const assetSha = assetFile && fs.existsSync(assetFile) ? crypto.createHash('sha256').update(fs.readFileSync(assetFile)).digest('hex') : null;
    if (decision.schemaVersion !== 'JS_ARCHIVE_CREATE_FALSE_HOLD_ADJUDICATION_V1' || decision.status !== 'FALSE_HOLD_CLEARED'
      || decision.executionLine !== 'CODEX' || decision.qualityContractVersion !== 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'
      || decision.qid !== qid || decision.stage !== 'CREATE' || decision.scopeOnly !== true
      || decision.fullExamCreateComplete !== false || decision.sourceBinding?.rawSha256 !== digestSource(source)
      || entry.currentSourceSha256 !== digestSource(source) || entry.currentAssetSha256 !== assetSha
      || decision.assetBinding?.sha256 !== assetSha || decision.sourceBinding?.qidContentSha256 !== hashText(q?.content)
      || decision.sourceBinding?.qidChoicesSha256 !== crypto.createHash('sha256').update(JSON.stringify(q?.choices ?? [])).digest('hex')
      || decision.sourceBinding?.qidAnswerSha256 !== hashText(q?.answer) || decision.sourceBinding?.qidSolutionSha256 !== hashText(q?.solution)
      || decision.studentSourceMutated !== false || decision.solutionMutated !== false
      || decision.sourceBinding?.currentStudentPayloadSha256 !== decision.sourceBinding?.baselineStudentPayloadSha256
      || !decision.falseHoldAdjudication?.proof?.some(text => String(text).includes('[ABC]=[DBC]'))
      || !decision.falseHoldAdjudication?.proof?.some(text => String(text).includes('[OBC]'))
      || !decision.falseHoldAdjudication?.proof?.some(text => String(text).includes('3:5'))) {
      issues.push(`FALSE_HOLD_ADJUDICATION_BINDING_INVALID:q${qid}`);
    }
    const holdRef = decision.falseHoldAdjudication || {};
    if (entry.originalHold?.path !== holdRef.priorHoldPath || entry.originalHold?.sha256 !== holdRef.priorHoldSha256
      || entry.originalFreeze?.path !== holdRef.originalFreezePath || entry.originalFreeze?.sha256 !== holdRef.originalFreezeSha256) {
      issues.push(`FALSE_HOLD_ADJUDICATION_HISTORY_BINDING_INVALID:q${qid}`);
    }
    for (const ref of [{ path: holdRef.priorHoldPath, sha256: holdRef.priorHoldSha256 }, { path: holdRef.originalFreezePath, sha256: holdRef.originalFreezeSha256 }]) {
      const target = path.resolve(repoRoot, ref.path || '');
      if (!target.startsWith(repoRoot + path.sep) || !fs.existsSync(target)
        || crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex') !== ref.sha256) issues.push(`FALSE_HOLD_ADJUDICATION_PRIOR_BYTES_MISMATCH:q${qid}`);
    }
    const durable = entry.durableReceiptCopy;
    if (durable) {
      const declared = array(evidence.sourceRefreshReviewV1?.receipts).find(ref => ref?.sourcePath === holdRef.priorHoldPath);
      const target = path.resolve(repoRoot, durable.path || '');
      const actual = target.startsWith(repoRoot + path.sep) && fs.existsSync(target)
        ? sha256(fs.readFileSync(target)) : null;
      const parity = actual === durable.declaredSha256 ? 'MATCH' : 'MISMATCH_PRESERVED';
      if (!declared || declared.durablePath !== durable.path || declared.sha256 !== durable.declaredSha256
        || !actual || actual !== durable.actualSha256 || parity !== durable.parity) issues.push(`FALSE_HOLD_RECEIPT_COPY_WITNESS_INVALID:q${qid}`);
    }
    if (row?.sourceExact?.status !== PASS || row?.solutionMath?.status !== PASS
      || row?.sourceExactAdjudicationRef?.sha256 !== entry.adjudicationSha256
      || row?.solutionMathAdjudicationRef?.sha256 !== entry.adjudicationSha256) issues.push(`FALSE_HOLD_ADJUDICATION_CLEARANCE_UNBOUND:q${qid}`);
    if (entry.priorStatuses?.sourceExact?.status !== HOLD || entry.priorStatuses?.solutionMath?.status !== HOLD) issues.push(`FALSE_HOLD_ADJUDICATION_PRIOR_HOLD_NOT_PRESERVED:q${qid}`);
  }
  for (const row of evidence.questionRows || []) {
    if ((row.sourceExactAdjudicationRef || row.solutionMathAdjudicationRef)
      && !entries.some(entry => Number(entry.qid) === Number(row.qid))
      && !array(evidence.questionOnlyReplacementAdjudications).some(entry => Number(entry.qid) === Number(row.qid))) {
      issues.push(`FALSE_HOLD_ADJUDICATION_ORPHAN_CLEARANCE:q${row.qid}`);
    }
  }
}

function digestSource(source) { return crypto.createHash('sha256').update(source).digest('hex'); }

export function validatePhysicalEvidence({ examFile, evidenceFile, stage }) {
  const { source, questions } = loadExam(examFile);
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
  const issues = [];
  if (evidence.schemaVersion !== SCHEMA) issues.push('EVIDENCE_SCHEMA_INVALID');
  if (String(evidence.stage || '').toUpperCase() !== stage) issues.push('EVIDENCE_STAGE_MISMATCH');
  if (normalize(evidence.examPath) && !normalize(examFile).endsWith(normalize(evidence.examPath))) issues.push('EVIDENCE_EXAM_PATH_MISMATCH');
  const examSha = sha256(source);
  if (evidence.examSha256 !== examSha) issues.push('EVIDENCE_EXAM_SHA_MISMATCH');
  if (Number(evidence.questionCount) !== questions.length) issues.push('EVIDENCE_QUESTION_COUNT_MISMATCH');

  checkFalseHoldAdjudications(examFile, source, questions, evidence, issues);
  const questionOnlyAcceptedQids = checkQuestionOnlyReplacementAdjudications(examFile, source, questions, evidence, issues);

  const questionEvidence = checkQuestionRows(questions, evidence, issues, questionOnlyAcceptedQids);
  const visual = checkVisualRows(examFile, questions, evidence, issues);
  const metaEvidence = checkMetaRows(questions, evidence, issues);
  issues.push(...validateSolutionCalibration({ examFile, questions, evidence, stage }));
  checkIndependence(stage, evidence, issues);

  const heldQids = [...new Set([...questionEvidence.heldQids, ...metaEvidence.heldQids])].sort((a, b) => a - b);
  if (stage === 'R3' && heldQids.length) issues.push(`R3_ITEM_HOLD_FORBIDDEN:${heldQids.join(',')}`);

  const derived = {
    questionCount: questions.length,
    questionEvidenceRows: questionEvidence.rowCount,
    linkedSolutionVisualCount: visual.expected,
    visualEvidenceRows: visual.actual,
    metaEvidenceRows: metaEvidence.rowCount,
    itemHoldCount: heldQids.length,
  };
  checkSummary(evidence, derived, issues);

  return {
    ok: issues.length === 0,
    schemaVersion: SCHEMA,
    stage,
    examPath: normalize(examFile),
    examSha256: examSha,
    ...derived,
    itemHoldQids: heldQids,
    disposition: issues.length ? 'FAIL' : heldQids.length ? 'PASS_WITH_ITEM_HOLDS' : 'PASS',
    issues,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const report = validatePhysicalEvidence({
      examFile: path.resolve(args.exam), evidenceFile: path.resolve(args.evidence), stage: args.stage,
    });
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
    process.exitCode = 2;
  }
}
