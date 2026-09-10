import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { bytesSha, canonicalJson, objectSha, uidSet, uidSetSha, nonempty, isObject, readBoundFile, HASH_PATTERN } from './canonical.mjs';
import { compareVisualFacts, auditDuplicates, structureFingerprint, VISUAL_SPEC_SHA, extractSvgGeometry, verifySvgGeometry } from './visual.mjs';
import { verifyViewportPng } from './png.mjs';
import { rulePreflight } from './rulepack.mjs';
import { validateRuntimeBundle } from './runtime.mjs';
import { axisName } from './projection.mjs';
import { validateRenderReviewReuseReceipt } from './render-impact.mjs';
import { createContinuationDenominator, validateContinuationDenominator } from './continuation.mjs';
import { validateSourceRecoveryLedger } from './source-recovery.mjs';
import { validateSolutionQuality } from './solution-quality.mjs';
import { validateVisualBenefitPair } from './solution-visual-benefit.mjs';
import { validatePastExamCompletion } from './past-exam-contract.mjs';
import { validateStudentSerialization, validateCurriculumBinding } from './student-output.mjs';

export const RUN_VERSION = 'APMATH_PIPELINE_RUN_v1';
export const RUN_VERSION_V2 = 'APMATH_PIPELINE_RUN_v2';
export const EVIDENCE_VERSION = 'APMATH_PIPELINE_EVIDENCE_v1';
export const EVIDENCE_VERSION_V2 = 'APMATH_PIPELINE_EVIDENCE_v2';
export const profiles = JSON.parse(fs.readFileSync(new URL('./profiles.json', import.meta.url)));
export const CORE_SHA_INPUT_FILES = Object.freeze(['solution-quality.mjs', 'solution-visual-benefit.mjs', 'student-output.mjs', '../../data/master_tables/js_archive_tag_master.json', 'past-exam-contract.mjs', '../past-exam-pipeline/completion-contract.json', '../past-exam-pipeline/lib/calibration.mjs', 'contracts/work-batch-v1.schema.json', 'work-batch.mjs', 'provider-bridge.mjs', 'recover-dispatch-lock.py', 'canonical.mjs', 'source-recovery.mjs', 'schema.mjs', 'expression.mjs', 'rulepack.mjs', 'runtime.mjs', 'prepare.mjs', 'render.mjs', 'native-final.mjs', 'closure.mjs', 'batch.mjs', 'png.mjs', 'visual.mjs', 'integration.mjs', 'cli.mjs', 'machine-evidence.mjs', 'generator.py', 'profiles.json', 'visual-contract.json', 'question-uid.mjs', 'projection.mjs', 'semantic-diff.mjs', 'review-evidence-v2.mjs', 'question-quality-set.mjs', 'exam-release.mjs', 'review-isolation-runner.mjs', 'build-work-ledger.mjs', 'v2-audit.mjs', 'continuation.mjs', 'render-impact.mjs', 'contracts/run-v2.schema.json', 'contracts/evidence-v2.schema.json', 'contracts/review-batch-v2.schema.json', 'contracts/exam-release-v1.schema.json', 'contracts/build-work-ledger-v1.schema.json', 'contracts/source-exam-id-registry-v1.schema.json', 'contracts/reuse-receipt-v1.schema.json', 'contracts/question-quality-closure-v2.schema.json', 'contracts/continuation-denominator-v1.schema.json', 'contracts/render-impact-v1.schema.json', 'contracts/edit-closure-v1.schema.json', 'contracts/render-review-reuse-receipt-v1.schema.json']);
export const CORE_SHA = objectSha(CORE_SHA_INPUT_FILES.map(name => ({ name, sha256: bytesSha(fs.readFileSync(new URL(name, import.meta.url))) })));
const MINIMUM_RULES = ['00_RULES_INDEX.md', '01_CANONICAL/JS아카이브룰북_v2.6.md', '02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md', '02_PIPELINES/공통파이프라인_실행계약_v1.md', '02_PIPELINES/작업방식_적응형배치루프_v1.md', '03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md'];

export function runInputSha(run) {
  const questions = [...run.questions].sort((a, b) => a.questionUid < b.questionUid ? -1 : 1).map(({ evidence, renderEvidenceIds, sourceStatus, visual, ...q }) => {
    if (run.schemaVersion === RUN_VERSION_V2) delete q.axisInputShas;
    const { requirement, adjudicationId, adjudicationStatus, exemptReason, ...visualInputs } = visual || {};
    return { ...q, visual: visualInputs };
  });
  // Decisions are outputs of review, not inputs to the blind source pass.
  // The final requirement map is bound separately by denominatorInput and V3.
  const payload = { schemaVersion: run.schemaVersion, pipeline: run.pipeline, runId: run.runId, revision: run.revision, assetRoot: run.assetRoot || 'archive', renderRuntime: run.renderRuntime || null, sourceRecoveryLedger: run.sourceRecoveryLedger || null, sourceRecoverySignal: run.sourceRecoverySignal === true, sourceRecoveryStatus: run.sourceRecoveryStatus || null, questionOrder: run.questions.map(q => q.questionUid), questionUids: uidSet(run.questions.map(q => q.questionUid)), questions, inputs: [...run.inputs].sort((a, b) => a.path < b.path ? -1 : 1), pastExamCompletionRef: run.pastExamCompletionRef || null, coreSha: CORE_SHA, visualSpecSha: VISUAL_SPEC_SHA };
  if (run.schemaVersion === RUN_VERSION_V2) Object.assign(payload, { workBatchId: run.workBatchId || null, builderId: run.builderId || null, builderSessionId: run.builderSessionId || null, builderModelOrAgent: run.builderModelOrAgent || null, sourceAuthority: run.sourceAuthority || null, uidAuthority: run.uidAuthority || null, semanticDependencyBindings: run.semanticDependencyBindings || null, releaseRenderPolicy: run.releaseRenderPolicy || run.releasePolicy || null, viewportProfiles: run.viewportProfiles || profiles.viewports, requiredModeCaseSet: run.requiredModeCaseSet || null });
  if (run.schemaVersion === RUN_VERSION_V2) Object.assign(payload, { predecessor: run.predecessor || null, publicationIntent: run.publicationIntent || null, sharedMaterial: run.sharedMaterial || null, globalLayoutMetadata: run.globalLayoutMetadata || null, contextDependencyRefs: run.contextDependencyRefs || [], declaredContextDependencyUidSet: run.declaredContextDependencyUidSet || [] });
  return objectSha(payload);
}

export function validateRegistry(records, run) {
  const errors = [], byId = new Map(), active = new Map();
  if (!Array.isArray(records) || records.length === 0) return ['REGISTRY_MISSING'];
  for (const record of records) {
    if (!nonempty(record.recordId) || byId.has(record.recordId)) errors.push('REGISTRY_RECORD_ID_DUPLICATE_OR_MISSING');
    byId.set(record.recordId, record);
    if (!Number.isSafeInteger(record.revision) || record.revision < 1 || typeof record.isCanonical !== 'boolean' || !HASH_PATTERN.test(record.inputSha)) errors.push('REGISTRY_INVALID_RECORD');
    try { if (!uidSet(record.questionUids).length) errors.push('REGISTRY_EMPTY_SCOPE'); } catch { errors.push('REGISTRY_UID_SET_INVALID'); }
    if (record.isCanonical) for (const uid of record.questionUids || []) {
      if (active.has(uid)) errors.push(`ACTIVE_UID_DUPLICATE:${uid}`);
      active.set(uid, record);
    }
  }
  for (const record of records) {
    if (record.revision === 1 && record.supersedes !== null) errors.push('INITIAL_REVISION_SUPERSEDES');
    if (record.revision > 1) {
      const previous = byId.get(record.supersedes);
      if (!previous || previous.revision !== record.revision - 1 || previous.batchId !== record.batchId || previous.isCanonical || previous.inputSha === record.inputSha) errors.push('REVISION_LINEAGE_INVALID');
      if (previous && canonicalJson(uidSet(previous.questionUids)) !== canonicalJson(uidSet(record.questionUids))) errors.push('REVISION_UID_SCOPE_CHANGED');
    }
  }
  const selected = byId.get(run.canonicalRecordId);
  if (!selected?.isCanonical || selected.revision !== run.revision || selected.batchId !== run.runId || selected.inputSha !== run.inputSha) errors.push('RUN_CANONICAL_RECORD_MISMATCH');
  if (selected && canonicalJson(uidSet(selected.questionUids)) !== canonicalJson(uidSet(run.questions.map(q => q.questionUid)))) errors.push('RUN_CANONICAL_SCOPE_MISMATCH');
  return errors;
}

export function denominatorInput(run) {
  const rows = run.questions.map(q => ({ questionUid: q.questionUid, requirement: q.visual.requirement, adjudicationId: q.visual.adjudicationId, adjudicationStatus: q.visual.adjudicationStatus, exemptReason: q.visual.exemptReason ?? null, actualSolutionVisualAttached: q.visual.actualSolutionVisualAttached, problemVisualMathDependency: q.visual.problemVisualMathDependency, sharedVisualMathDependency: q.visual.sharedVisualMathDependency })).sort((a, b) => a.questionUid < b.questionUid ? -1 : 1);
  const requiredUidSet = rows.filter(q => q.requirement === 'VISUAL_REQUIRED' || q.requirement === 'VISUAL_RECOMMENDED' || q.actualSolutionVisualAttached || q.problemVisualMathDependency || q.sharedVisualMathDependency).map(q => q.questionUid);
  return { inputSha: objectSha({ runInputSha: runInputSha(run), rows }), requiredUidSet, requiredUidSetSha: uidSetSha(requiredUidSet) };
}

export function validateRender(root, record, profile, mode, run, inputSha, candidatePath, evidence, evidenceHashes, invalidEvidenceIds) {
  const errors = [];
  let review = record?.payload, reused = false;
  if (run.schemaVersion === RUN_VERSION_V2 && record?.inputSha !== inputSha) {
    const receipts = (run.renderReviewReuseReceiptRefs || []).map(ref => JSON.parse(readBoundFile(root, ref))).filter(receipt => receipt.rootFreshReviewRef?.sha256 === evidenceHashes.get(record?.evidenceId));
    if (receipts.length !== 1) return ['RENDER_REVIEW_REUSE_RECEIPT_REQUIRED'];
    const receipt = receipts[0];
    const checked = validateRenderReviewReuseReceipt(root, receipt, { currentCaptureRef: receipt.currentCaptureRef, currentRunInputSha: inputSha });
    if (checked.status !== 'PASS') return checked.errors;
    const currentCapture = JSON.parse(readBoundFile(root, receipt.currentCaptureRef));
    review = { ...review, captureEvidenceId: currentCapture.evidenceId, captureEvidenceSha: receipt.currentCaptureRef.sha256 };
    reused = true;
  }
  if (record?.axis !== 'render' || record.status !== 'PASS' || (!reused && record.inputSha !== inputSha) || !isObject(review)) return ['RENDER_REVIEW_EVIDENCE_NOT_PASS'];
  const capture = evidence.get(review.captureEvidenceId);
  const captureSha = evidenceHashes.get(review.captureEvidenceId);
  if (!capture || capture.axis !== 'render-capture' || capture.status !== 'PASS' || capture.validityStatus !== 'FROZEN' || invalidEvidenceIds.has(capture.evidenceId)) return ['RENDER_CAPTURE_EVIDENCE_NOT_PASS'];
  if (review.captureEvidenceSha !== captureSha) errors.push('RENDER_CAPTURE_SHA_MISMATCH');
  if (record.reviewSessionId === capture.reviewSessionId || record.reviewerId === capture.reviewerId) errors.push('RENDER_REVIEW_NOT_INDEPENDENT');
  if (!reused && Date.parse(record.startedAt) < Date.parse(capture.frozenAt)) errors.push('RENDER_REVIEW_BEFORE_CAPTURE_FREEZE');
  const payload = capture.payload;
  if (run.schemaVersion === RUN_VERSION_V2 && (capture.inputSha !== inputSha || capture.runId !== run.runId || capture.revision !== run.revision)) errors.push('CURRENT_RENDER_CAPTURE_REQUIRED');
  if (run.schemaVersion === RUN_VERSION_V2 && (canonicalJson(payload.candidateRef) !== canonicalJson(run.inputs.find(ref => ref.path === candidatePath && ref.role === 'candidate')) || canonicalJson(payload.assetRefs) !== canonicalJson(run.inputs.filter(ref => payload.assetAssociations?.some(row => row.path === ref.path))))) errors.push('RENDER_CURRENT_OUTPUT_REF_BINDING');
  if (!isObject(payload) || payload.actualBrowser !== true || payload.productionEngine !== true || payload.mode !== mode || !nonempty(payload.browserVersion)) errors.push('REAL_RENDER_CAPTURE_REQUIRED');
  if (review.runtimeBundleSha !== run.renderRuntime?.bundleSha || payload.runtimeBundleSha !== run.renderRuntime?.bundleSha) errors.push('RENDER_RUNTIME_BUNDLE_SHA_MISMATCH');
  if (!Array.isArray(payload.runtimeResponses) || !payload.runtimeResponses.length || payload.runtimeResponseBundleSha !== objectSha(payload.runtimeResponses) || review.runtimeResponseBundleSha !== payload.runtimeResponseBundleSha) errors.push('RENDER_RESPONSE_BUNDLE_SHA_MISMATCH');
  if (payload.unboundRequests?.length || payload.failedRequests?.length || payload.pageErrors?.length) errors.push('RENDER_CAPTURE_REQUEST_FAILURE');
  const runtimeInputs = new Map(run.inputs.filter(ref => ['engine', 'runtime'].includes(ref.role)).map(ref => [ref.path, ref]));
  for (const response of payload.runtimeResponses || []) {
    if (response.localPath) {
      const input = runtimeInputs.get(response.localPath);
      if (!input || input.role !== response.role || input.bytes !== response.bytes || input.sha256 !== response.sha256 || response.status < 200 || response.status >= 400) errors.push(`RENDER_RUNTIME_RESPONSE_UNBOUND:${response.localPath}`);
    } else if (response.role !== 'external' || !HASH_PATTERN.test(response.sha256) || !Number.isSafeInteger(response.bytes) || response.bytes < 1) errors.push('RENDER_EXTERNAL_RESPONSE_INVALID');
  }
  if (!(payload.runtimeResponses || []).some(response => response.localPath === run.renderRuntime?.enginePath && response.role === 'engine')) errors.push('RENDER_ENGINE_RESPONSE_MISSING');
  const viewport = payload.viewport;
  if (!isObject(viewport) || viewport.profile !== profile.profile || !Number.isSafeInteger(viewport.width) || !Number.isSafeInteger(viewport.height) || viewport.height < 1 || viewport.width < profile.minWidth || (profile.maxWidth && viewport.width > profile.maxWidth)) errors.push('RENDER_VIEWPORT_INVALID');
  for (const check of ['runtime', 'mathJax', 'fonts', 'imageDecode', 'assetAssociation', 'questionCount', 'lastQuestion', ...(run.schemaVersion === RUN_VERSION_V2 ? ['clipping', 'overflow'] : [])]) if (payload.checks?.[check] !== 'PASS') errors.push(`RENDER_CAPTURE_CHECK:${check}`);
  for (const check of ['clipping', 'overflow', 'readability']) if (review.checks?.[check] !== 'PASS') errors.push(`RENDER_REVIEW_CHECK:${check}`);
  const questions = run.questions.filter(q => q.candidatePath === candidatePath);
  const context = { window: {} }; vm.runInNewContext(readBoundFile(root, run.inputs.find(i => i.path === candidatePath)).toString('utf8'), context, { timeout: 1000 });
  const bank = context.window.questionBank;
  if (payload.candidatePath !== candidatePath || payload.expectedQuestionCount !== bank.length || payload.observedQuestionCount !== bank.length || payload.lastQuestionId !== bank.at(-1).id || !Array.isArray(payload.questionUids) || canonicalJson(uidSet(payload.questionUids)) !== canonicalJson(uidSet(questions.map(q => q.questionUid)))) errors.push('RENDER_SCOPE_COUNT_MISMATCH');
  if (!Array.isArray(payload.assetAssociations)) errors.push('RENDER_ASSET_ASSOCIATIONS_MISSING');
  else for (const q of questions) for (const assetPath of (mode === 'solution' ? q.solutionAssetPaths : mode === 'exam' ? q.problemAssetPaths : []) || []) {
    const ref = run.inputs.find(i => i.path === assetPath);
    if (!ref || !payload.assetAssociations.some(a => a.questionUid === q.questionUid && a.path === assetPath && a.sha256 === ref.sha256 && a.status === 'PASS')) errors.push(`RENDER_ASSET_ASSOCIATION:${q.questionUid}:${assetPath}`);
  }
  try {
    const png = readBoundFile(root, payload.screenshot);
    if (!verifyViewportPng(png, viewport.width, viewport.height)) errors.push('VIEWPORT_PNG_WITNESS_INVALID');
  } catch (error) { errors.push(`RENDER_WITNESS:${error.message}`); }
  if (!Array.isArray(payload.itemWitnesses)) errors.push('PER_ITEM_RENDER_WITNESSES_MISSING');
  else for (const q of questions) {
    const witnesses = payload.itemWitnesses.filter(w => w.questionUid === q.questionUid);
    const reviews = Array.isArray(review.itemReviews) ? review.itemReviews.filter(item => item.questionUid === q.questionUid) : [];
    if (witnesses.length !== 1 || witnesses[0].status !== 'CAPTURED') { errors.push(`ITEM_RENDER_WITNESS:${q.questionUid}`); continue; }
    if (reviews.length !== 1 || reviews[0].status !== 'PASS' || reviews[0].screenshotSha !== witnesses[0].screenshot.sha256) errors.push(`ITEM_RENDER_REVIEW:${q.questionUid}`);
    if (run.schemaVersion === RUN_VERSION_V2) {
      const witness = witnesses[0];
      const { witnessSha, ...witnessPayload } = witness;
      if (witnessSha !== objectSha(witnessPayload) || witness.mode !== mode || witness.viewportProfile !== profile.profile || witness.runtimeResponseSha !== payload.runtimeResponseBundleSha || witness.assetSha !== objectSha(payload.assetAssociations.filter(row => row.questionUid === q.questionUid))) errors.push('ITEM_CANONICAL_WITNESS_BINDING');
      errors.push(...validateContinuationDenominator(witness.continuationDenominator, { questionUid: q.questionUid, cases: [`${mode}/${profile.profile}`], reviewedBlocks: reviews[0]?.blockReviews || [] }).errors);
      for (const block of witness.blocks || []) {
        const placement = { page: block.page, column: block.column, flowPosition: block.flowPosition, boundingBox: block.boundingBox, sourceBlockId: block.sourceBlockId, segment: block.segment, segmentOffset: block.segmentOffset };
        if (block.placementSha !== objectSha(placement) || !Number.isSafeInteger(block.page) || block.page < 1 || !Number.isSafeInteger(block.column) || block.column < 1 || !block.boundingBox || !Object.values(block.boundingBox).every(Number.isFinite)) errors.push('CONTINUATION_PLACEMENT_INVALID');
        if (!verifyViewportPng(readBoundFile(root, block.screenshot), viewport.width, viewport.height)) errors.push('CONTINUATION_SCREENSHOT_INVALID');
      }
      const rebuilt = createContinuationDenominator({ questionUid: q.questionUid, cases: [`${mode}/${profile.profile}`], blocks: witness.blocks });
      if (canonicalJson(rebuilt.expectedBlockSet) !== canonicalJson(witness.continuationDenominator.expectedBlockSet)) errors.push('CONTINUATION_ACTUAL_BLOCK_PARITY');
    }
    try { if (!verifyViewportPng(readBoundFile(root, witnesses[0].screenshot), viewport.width, viewport.height)) errors.push(`ITEM_PNG_INVALID:${q.questionUid}`); } catch (error) { errors.push(`ITEM_PNG:${error.message}`); }
  }
  return errors;
}

function verifyRules(root, run, errors) {
  errors.push(...validatePastExamCompletion(root, run));
  const manifestRef = run.inputs.find(i => i.path === 'docs/rules/MANIFEST.md' && i.role === 'rule');
  if (!manifestRef) { errors.push('RULE_MANIFEST_NOT_BOUND'); return; }
  let manifest;
  try { manifest = readBoundFile(root, manifestRef).toString('utf8'); } catch (error) { errors.push(error.message); return; }
  const required = [...MINIMUM_RULES];
  if (profiles.pipelines[run.pipeline]?.scope === 'QUESTION_QUALITY') required.push('02_PIPELINES/해설프로토콜.md', '02_PIPELINES/JS_문항품질_업그레이드.md');
  if (run.questions.some(q => q.visual?.actualSolutionVisualAttached || q.visual?.problemVisualMathDependency || q.visual?.sharedVisualMathDependency || q.visual?.requirement === 'VISUAL_REQUIRED')) required.push('04_VISUAL/도형추출.md');
  if (['logic-visual', 'set-visual-pilot'].includes(run.pipeline)) required.push('04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md');
  if (run.pipeline === 'geometry-equation') required.push('04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md');
  for (const relative of required) {
    const ref = run.inputs.find(i => i.path === `docs/rules/${relative}` && i.role === 'rule');
    const line = manifest.split(/\r?\n/).find(line => line.startsWith(`- ${relative} | `));
    const match = line?.match(/\| (\d+) bytes \| sha256 ([0-9a-f]{64})$/);
    if (!ref || !match || ref.bytes !== Number(match[1]) || ref.sha256 !== `sha256:${match[2]}`) errors.push(`RULE_PACK_DRIFT:${relative}`);
  }
}

function validateEvidence(root, ref, run, errors, freshnessRows = null) {
  let e;
  try { e = JSON.parse(readBoundFile(root, ref)); } catch (error) { errors.push(`EVIDENCE_FILE:${error.message}`); return null; }
  if (run.schemaVersion === RUN_VERSION_V2) {
    const rows = freshnessRows?.filter(row => row.evidenceId === e.evidenceId && row.evidenceSha === ref.sha256);
    if (e.schemaVersion !== EVIDENCE_VERSION_V2 || !rows?.length || rows.some(row => row.status !== 'PASS')) errors.push(`EVIDENCE_BINDING:${e.evidenceId}`);
    const legacy = { SOURCE: 'source', MATH_A1: 'math', MATH_A2: 'math-a2', SOLUTION: 'solution', METADATA: 'metadata', STATIC: 'static', V1: 'v1', V2: 'v2', V3: 'v3', RENDER_CAPTURE: 'render-capture', RENDER_REVIEW: 'render' };
    e = { ...e, axis: legacy[axisName(e.axis)] };
  } else if (e.schemaVersion !== EVIDENCE_VERSION || !nonempty(e.evidenceId) || !nonempty(e.axis) || e.runId !== run.runId || e.revision !== run.revision || e.inputSha !== run.inputSha || e.reviewStartInputSha !== run.inputSha || e.reviewEndInputSha !== run.inputSha) errors.push(`EVIDENCE_BINDING:${e.evidenceId}`);
  if (e.status !== 'PASS' || !['VALID', 'FROZEN'].includes(e.validityStatus)) errors.push(`EVIDENCE_NOT_PASS:${e.evidenceId}`);
  if (!nonempty(e.reviewerId) || !nonempty(e.reviewSessionId) || !nonempty(e.reviewerModelOrAgent)) errors.push(`REVIEWER_IDENTITY_MISSING:${e.evidenceId}`);
  if (!Array.isArray(e.findings) || e.findings.some(f => f.status !== 'RESOLVED')) errors.push(`UNRESOLVED_FINDINGS:${e.evidenceId}`);
  if (!Number.isFinite(Date.parse(e.startedAt)) || !Number.isFinite(Date.parse(e.frozenAt)) || Date.parse(e.startedAt) > Date.parse(e.frozenAt)) errors.push(`EVIDENCE_TIME_INVALID:${e.evidenceId}`);
  return e;
}

export function auditRun(root, run) {
  if (run?.schemaVersion !== RUN_VERSION) return { status: 'BLOCKED', productionAuthorized: false, errors: ['RUN_SCHEMA_INVALID'] };
  return auditSemanticKernel(root, run);
}

export function loadBoundQuestionBanks(root, run) {
  const banks = new Map();
  for (const ref of run.inputs.filter(ref => ['source', 'candidate'].includes(ref.role))) {
    const context = { window: {} };
    vm.runInNewContext(readBoundFile(root, ref).toString('utf8'), context, { timeout: 1000 });
    const bank = JSON.parse(JSON.stringify(context.window));
    if (!Array.isArray(bank.questionBank) || new Set(bank.questionBank.map(q => q.id)).size !== bank.questionBank.length) throw new Error(`BANK_IDENTITY_INVALID:${ref.path}`);
    banks.set(ref.path, bank);
  }
  return run.questions.map(q => {
    const candidate = banks.get(q.candidatePath)?.questionBank.find(item => item.id === q.qid);
    const source = banks.get(q.sourcePath)?.questionBank.find(item => item.id === q.qid);
    if (!candidate || !source) throw new Error(`SOURCE_CANDIDATE_IDENTITY:${q.questionUid}`);
    const { questionBank: ignoredBank, ...examMetadata } = banks.get(q.candidatePath);
    return { ...candidate, questionUid: q.questionUid, sourceStem: source.content, sourceExamId: q.sourceExamId, sourceRecord: source, examMetadata, problemAssetRefs: (q.problemAssetPaths || []).map(p => run.inputs.find(ref => ref.path === p)), solutionAssetRefs: (q.solutionAssetPaths || []).map(p => run.inputs.find(ref => ref.path === p)) };
  });
}

// Both versions execute the same source, candidate, visual and render semantics.
// V2 supplies verified freshness rows; immutable evidence is never rewritten on disk.
export function auditSemanticKernel(root, run, freshnessRows = null) {
  const errors = [], itemResults = [], renderResults = [], candidateQuestions = new Map();
  let productionAuthorized = false;
  const result = () => ({ schemaVersion: 'APMATH_PIPELINE_CLOSURE_v1', pipeline: run?.pipeline || null, runId: run?.runId || null, status: errors.length ? 'BLOCKED' : 'PASS', verifiedScope: profiles.pipelines[run?.pipeline]?.scope || null, productionAuthorized, coreSha: CORE_SHA, visualSpecSha: VISUAL_SPEC_SHA, inputSha: run?.inputSha || null, errors, items: itemResults, renders: renderResults });
  if (!isObject(run) || ![RUN_VERSION, RUN_VERSION_V2].includes(run.schemaVersion) || (run.schemaVersion === RUN_VERSION_V2 && !Array.isArray(freshnessRows)) || !profiles.pipelines[run.pipeline] || !nonempty(run.runId) || !Number.isSafeInteger(run.revision) || run.revision < 1 || !Array.isArray(run.questions) || !run.questions.length || !Array.isArray(run.inputs) || !run.inputs.length || !Array.isArray(run.evidence) || !run.evidence.length || !nonempty(run.builderSessionId)) {
    errors.push('RUN_SCHEMA_INVALID'); return result();
  }
  const policy = profiles.pipelines[run.pipeline];
  try { uidSet(run.questions.map(q => q.questionUid)); } catch (error) { errors.push(error.message); }
  const inputPaths = new Set();
  const sourceIdentities = new Set();
  for (const ref of run.inputs) {
    if (inputPaths.has(ref.path)) errors.push(`DUPLICATE_INPUT:${ref.path}`);
    inputPaths.add(ref.path);
    if (!profiles.inputRoles.includes(ref.role)) errors.push(`INVALID_INPUT_ROLE:${ref.path}`);
    try { readBoundFile(root, ref); } catch (error) { errors.push(error.message); }
  }
  for (const role of ['source', 'candidate', 'rule', 'spec', 'verifier']) if (!run.inputs.some(i => i.role === role)) errors.push(`INPUT_ROLE_MISSING:${role}`);
  if (policy.modes.length && !run.inputs.some(i => i.role === 'engine')) errors.push('ENGINE_INPUT_NOT_BOUND');
  if (policy.modes.length) errors.push(...validateRuntimeBundle(root, run).errors);
  for (const q of run.questions) {
    if (!Number.isSafeInteger(q.qid) || q.qid < 1 || !nonempty(q.examId) || (run.schemaVersion === RUN_VERSION ? q.questionUid !== `${q.sourcePath}|${q.examId}|${q.qid}` : q.questionUid !== `${q.sourceExamId}|${q.sourceQuestionOrdinal}`)) errors.push(`CANONICAL_UID_INVALID:${q.questionUid}`);
    const identity = `${q.sourcePath}|${q.qid}`;
    if (sourceIdentities.has(identity)) errors.push(`SOURCE_IDENTITY_ALIAS_DUPLICATE:${identity}`);
    sourceIdentities.add(identity);
    if (!isObject(q.visual) || !['VISUAL_REQUIRED', 'VISUAL_RECOMMENDED', 'VISUAL_OPTIONAL', 'VISUAL_EXEMPT'].includes(q.visual.requirement) || !['NONE', 'KEEP', 'ADD', 'REBUILD', 'REMOVE'].includes(q.visual.action) || !nonempty(q.visual.adjudicationId) || !['actualSolutionVisualAttached', 'problemVisualMathDependency', 'sharedVisualMathDependency'].every(k => typeof q.visual[k] === 'boolean') || !isObject(q.evidence)) { errors.push(`QUESTION_SCHEMA:${q.questionUid}`); continue; }
    if (q.sourceStatus !== 'RESOLVED' || q.visual.adjudicationStatus !== 'RESOLVED') errors.push(`SOURCE_OR_REQUIREMENT_UNRESOLVED:${q.questionUid}`);
    if (q.visual.requirement === 'VISUAL_EXEMPT' && (!nonempty(q.visual.exemptReason) || q.visual.actualSolutionVisualAttached || q.visual.problemVisualMathDependency || q.visual.sharedVisualMathDependency)) errors.push(`INVALID_VISUAL_EXEMPT:${q.questionUid}`);
    const candidate = run.inputs.find(i => i.path === q.candidatePath && i.role === 'candidate');
    if (!candidate || !run.inputs.some(i => i.path === q.sourcePath && i.role === 'source')) { errors.push(`QUESTION_INPUT_MISSING:${q.questionUid}`); continue; }
    try {
      const context = { window: {} };
      vm.runInNewContext(readBoundFile(root, candidate).toString('utf8'), context, { timeout: 1000 });
      const bank = context.window.questionBank;
      if (run.schemaVersion === RUN_VERSION_V2 && (!Array.isArray(bank) || canonicalJson(bank.map(item => item.id)) !== canonicalJson(run.questions.filter(item => item.candidatePath === q.candidatePath).map(item => item.qid)) || q.sourcePath === q.candidatePath)) throw new Error('CANDIDATE_OUTPUT_SCOPE_OR_ORDER');
      const matches = Array.isArray(bank) ? bank.filter(item => item.id === q.qid) : [];
      if (matches.length !== 1) throw new Error('QUESTION_IDENTITY');
      const question = matches[0];
      const sourceContext = { window: {} };
      vm.runInNewContext(readBoundFile(root, run.inputs.find(i => i.path === q.sourcePath && i.role === 'source')).toString('utf8'), sourceContext, { timeout: 1000 });
      const sourceMatches = sourceContext.window.questionBank?.filter(item => item.id === q.qid);
      if (sourceContext.window.examTitle !== q.examId || !Array.isArray(sourceMatches) || sourceMatches.length !== 1) errors.push(`SOURCE_IDENTITY_MISMATCH:${q.questionUid}`);
      if (policy.scope === 'QUESTION_QUALITY' && (!nonempty(question.content) || !Array.isArray(question.choices) || !nonempty(String(question.answer ?? '')) || !nonempty(question.solution))) errors.push(`QUESTION_REQUIRED_FIELDS:${q.questionUid}`);
      for (const text of [question.content, question.solution, ...(question.choices || [])]) {
        const mergedCommands = String(text).match(/\\(?:lt|gt|leq|geq)[A-Za-z]+/g) || [];
        if (mergedCommands.some(command => !['\\ltimes', '\\gtimes', '\\leqq', '\\geqq', '\\leqslant', '\\geqslant'].includes(command))) errors.push(`MERGED_TEX_RELATION:${q.questionUid}`);
      }
      candidateQuestions.set(q.questionUid, JSON.parse(JSON.stringify(question)));
      if (policy.scope === 'METADATA_ONLY') {
        const source = sourceContext.window.questionBank?.find(item => item.id === q.qid);
        if (!source) throw new Error('METADATA_SOURCE_IDENTITY');
        for (const key of ['content', 'choices', 'answer', 'solution', 'image', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'layoutTag', 'wide']) if (JSON.stringify(source[key] ?? null) !== JSON.stringify(question[key] ?? null)) errors.push(`METADATA_SCOPE_CONTENT_MUTATION:${q.questionUid}:${key}`);
      }
      const attached = Boolean(question.solutionImage || /<(?:svg|table|img)\b/i.test(question.solution || ''));
      if (attached !== q.visual.actualSolutionVisualAttached) errors.push(`ACTUAL_ATTACHMENT_MISMATCH:${q.questionUid}`);
      if (!attached && (question.solutionImageAlt || question.solutionImageCaption)) errors.push(`ORPHAN_ALT_CAPTION:${q.questionUid}`);
      if ((['KEEP', 'ADD', 'REBUILD'].includes(q.visual.action) && !attached) || (['NONE', 'REMOVE'].includes(q.visual.action) && attached)) errors.push(`VISUAL_ACTION_PARITY:${q.questionUid}`);
      if (['ADD', 'REBUILD'].includes(q.visual.action)) {
        try {
          const witness = JSON.parse(readBoundFile(root, q.generationEvidence));
          const generator = run.inputs.find(i => i.role === 'generator');
          const artifact = run.inputs.find(i => q.solutionAssetPaths?.includes(i.path));
          if (!generator || !artifact || witness.schemaVersion !== 'APMATH_GENERATOR_WITNESS_v1' || witness.status !== 'BUILD_SIDE_ONLY' || witness.numericExecution !== 'PYTHON_EXECUTED' || witness.generatorSha !== generator.sha256 || witness.artifactSha !== artifact.sha256 || witness.visualSpecSha !== VISUAL_SPEC_SHA || !HASH_PATTERN.test(witness.semanticSha)) throw new Error('GENERATOR_BINDING_INVALID');
          if (witness.rulePackSha !== rulePreflight(root).rulePackSha) throw new Error('GENERATOR_RULE_PACK_STALE');
        } catch (error) { errors.push(`GENERATION_EVIDENCE:${q.questionUid}:${error.message}`); }
      }
      for (const [field, pathsKey] of [['solutionImage', 'solutionAssetPaths'], ['image', 'problemAssetPaths']]) {
        const paths = q[pathsKey];
        if (!Array.isArray(paths) || paths.some(p => !run.inputs.some(i => i.path === p && ['asset', 'dependency'].includes(i.role)))) errors.push(`ASSET_INPUT_UNBOUND:${q.questionUid}:${pathsKey}`);
        if (question[field] && !paths?.some(p => p === question[field] || p === `archive/${question[field]}` || p === `${run.assetRoot || 'archive'}/${question[field]}`)) errors.push(`DECLARED_ASSET_OMITTED:${q.questionUid}:${field}`);
      }
      if ((question.image || /<(?:svg|table|img)\b/i.test(question.content || '')) && !q.visual.problemVisualMathDependency && !nonempty(q.visual.problemDependencyExemption)) errors.push(`PROBLEM_VISUAL_DEPENDENCY_UNADJUDICATED:${q.questionUid}`);
    } catch (error) { errors.push(`CANDIDATE_READ:${q.questionUid}:${error.message}`); }
  }
  if (errors.length) return result();
  try { if (run.inputSha !== runInputSha(run)) errors.push('RUN_INPUT_SHA_STALE'); } catch (error) { errors.push(error.message); }
  verifyRules(root, run, errors);
  try { errors.push(...validateRegistry(run.registry, run)); } catch { errors.push('REGISTRY_MALFORMED'); }
  if (errors.length) return result();
  const evidence = new Map(), evidenceHashes = new Map(), invalidEvidenceIds = new Set();
  for (const ref of run.evidence) {
    const beforeValidation = errors.length;
    const e = validateEvidence(root, ref, run, errors, freshnessRows);
    if (e) {
      if (evidence.has(e.evidenceId)) errors.push(`DUPLICATE_EVIDENCE_ID:${e.evidenceId}`);
      if (errors.length !== beforeValidation) invalidEvidenceIds.add(e.evidenceId);
      evidence.set(e.evidenceId, e);
      evidenceHashes.set(e.evidenceId, ref.sha256);
    }
  }
  const visualItems = [];
  for (const q of run.questions) {
    const findings = [];
    const get = axis => {
      const e = evidence.get(q.evidence[run.schemaVersion === RUN_VERSION_V2 ? axisName(axis) : axis]);
      if (!e || e.axis !== axis || e.questionUid !== q.questionUid) { findings.push(`EVIDENCE_MISSING_OR_WRONG_SCOPE:${axis}`); return null; }
      if (invalidEvidenceIds.has(e.evidenceId)) findings.push(`EVIDENCE_INVALID:${axis}`);
      return e;
    };
    for (const axis of policy.axes) {
      const e = get(axis);
      if (['math', 'solution', 'source'].includes(axis) && e && (e.reviewSessionId === run.builderSessionId || (run.schemaVersion !== RUN_VERSION_V2 || axis !== 'solution') && e.priorReviewVisibility !== 'NONE')) findings.push(`INDEPENDENT_REVIEW_REQUIRED:${axis}`);
      if (axis === 'math' && e && (e.payload?.blindSolveFrozen !== true || e.payload?.allChoicesChecked !== true || e.payload?.answerUnique !== true)) findings.push('MATH_COMPLETENESS_NOT_PROVEN');
      if (axis === 'solution') findings.push(...validateSolutionQuality(e?.payload?.solutionQuality, candidateQuestions.get(q.questionUid)).errors);
    }
    if (run.pipeline === 'past-exam') {
      const candidate = candidateQuestions.get(q.questionUid);
      findings.push(...validateStudentSerialization(candidate).errors);
      findings.push(...validateCurriculumBinding(candidate, { examId: q.examId }).errors);
    }
    if (run.schemaVersion === RUN_VERSION_V2 && policy.scope === 'QUESTION_QUALITY') {
      const a2 = evidence.get(q.evidence.MATH_A2), a1 = evidence.get(q.evidence.MATH_A1);
      if (!a2 || a2.payload?.a1EvidenceSha !== evidenceHashes.get(a1?.evidenceId) || a2.payload?.allChoicesChecked !== true || a2.payload?.answerUnique !== true || Date.parse(a2.startedAt) < Date.parse(a1?.frozenAt)) findings.push('MATH_A2_FROZEN_A1_BINDING_REQUIRED');
    }
    const needed = q.visual.requirement === 'VISUAL_REQUIRED' || q.visual.requirement === 'VISUAL_RECOMMENDED' || q.visual.actualSolutionVisualAttached || q.visual.problemVisualMathDependency || q.visual.sharedVisualMathDependency;
    let parity = null;
    if (policy.visual) {
      const triage = get('v1');
      const adjudication = get('v3');
      findings.push(...validateVisualBenefitPair(triage, adjudication, { question: candidateQuestions.get(q.questionUid), visual: q.visual, ruleRefs: run.inputs.filter(ref => ref.role === 'rule') }).errors);
      const compatibility = { SHOULD_BE_REQUIRED: ['VISUAL_REQUIRED'], SHOULD_BE_RECOMMENDED: ['VISUAL_RECOMMENDED'], MAY_BE_OPTIONAL: ['VISUAL_OPTIONAL', 'VISUAL_RECOMMENDED', 'VISUAL_REQUIRED'], SHOULD_BE_EXEMPT: ['VISUAL_EXEMPT', 'VISUAL_OPTIONAL'] };
      if (!triage || triage.reviewSessionId === run.builderSessionId || triage.inputVisibilityProfile !== 'SOURCE_ONLY' || triage.priorReviewVisibility !== 'NONE' || triage.payload?.freshBlind !== true || (run.schemaVersion === RUN_VERSION && !compatibility[triage.payload?.visualRequirementSignal]?.includes(q.visual.requirement))) findings.push('INDEPENDENT_VISUAL_TRIAGE_NOT_CLOSED');
      if (!needed && triage) {
        if (run.schemaVersion === RUN_VERSION && q.visual.adjudicationId !== triage.evidenceId) findings.push('EXEMPT_ADJUDICATION_NOT_BOUND');
        try {
          const bundle = JSON.parse(readBoundFile(root, triage.payload.inputBundle));
          const candidate = candidateQuestions.get(q.questionUid);
          if (bundle.questionUid !== q.questionUid || bundle.content !== candidate.content || canonicalJson(bundle.choices) !== canonicalJson(candidate.choices || []) || Object.keys(bundle).some(k => !['questionUid', 'content', 'choices', 'problemAssets', 'curriculum'].includes(k))) throw new Error('EXEMPT_SOURCE_VISIBILITY');
        } catch (error) { findings.push(`EXEMPT_BLIND_BUNDLE:${error.message}`); }
      }
    }
    if (needed && policy.visual) {
      const v1 = get('v1'), v2 = get('v2'), v3 = get('v3');
      if (v1 && v2 && v3) {
        if (q.visual.adjudicationId !== v3.evidenceId) findings.push('REQUIREMENT_ADJUDICATION_NOT_BOUND');
        if (v3.payload?.finalVisualRequirement !== q.visual.requirement || v3.payload?.cDenominatorInputSha !== denominatorInput(run).inputSha) findings.push('V3_REQUIREMENT_MAP_STALE');
        if (new Set([run.builderSessionId, v1.reviewSessionId, v2.reviewSessionId, v3.reviewSessionId]).size !== 4) findings.push('BLIND_SESSION_COLLISION');
        if (v1.inputVisibilityProfile !== 'SOURCE_ONLY' || v2.inputVisibilityProfile !== 'ARTIFACT_ONLY' || v3.inputVisibilityProfile !== 'FROZEN_V1_V2' || [v1, v2].some(e => e.priorReviewVisibility !== 'NONE' || e.payload?.freshBlind !== true)) findings.push('BLIND_VISIBILITY_INVALID');
        if (Date.parse(v3.startedAt) < Math.max(Date.parse(v1.frozenAt), Date.parse(v2.frozenAt))) findings.push('V3_BEFORE_FREEZE');
        if (v3.payload?.v1EvidenceSha !== evidenceHashes.get(v1.evidenceId) || v3.payload?.v2EvidenceSha !== evidenceHashes.get(v2.evidenceId)) findings.push('V3_FIRST_PASS_BINDING_MISSING');
        for (const [axis, e, allowed] of [['v1', v1, ['questionUid', 'content', 'choices', 'problemAssets', 'curriculum']], ['v2', v2, ['questionUid', 'artifact', 'renderWitnesses']]]) {
          try {
            const bundle = JSON.parse(readBoundFile(root, e.payload.inputBundle));
            if (!isObject(bundle) || bundle.questionUid !== q.questionUid || Object.keys(bundle).some(k => !allowed.includes(k))) throw new Error('INPUT_VISIBILITY_OR_UID');
            if (axis === 'v1') {
              const candidate = candidateQuestions.get(q.questionUid);
              if (bundle.content !== candidate.content || canonicalJson(bundle.choices) !== canonicalJson(candidate.choices || [])) throw new Error('SOURCE_BUNDLE_NOT_CURRENT_CANDIDATE');
            } else {
              const artifact = run.inputs.find(i => i.path === e.payload.artifactPath);
              if (!artifact || bundle.artifact?.path !== artifact.path || bundle.artifact.sha256 !== artifact.sha256) throw new Error('ARTIFACT_BUNDLE_NOT_CURRENT');
              readBoundFile(root, bundle.artifact);
            }
          } catch (error) { findings.push(`BLIND_BUNDLE:${axis}:${error.message}`); }
        }
        if (v1.payload?.specSha !== VISUAL_SPEC_SHA || v2.payload?.specSha !== VISUAL_SPEC_SHA) findings.push('VISUAL_SPEC_STALE');
        try {
          parity = compareVisualFacts(v1.payload?.fact, v2.payload?.fact);
          if (parity.status !== 'PASS' || v1.payload.fact.questionUid !== q.questionUid) findings.push('SEMANTIC_PARITY_FAIL');
          if (q.generationEvidence && JSON.parse(readBoundFile(root, q.generationEvidence)).semanticSha !== parity.expectedSemanticSha) findings.push('GENERATOR_EXPECTED_FACT_MISMATCH');
          const artifact = run.inputs.find(i => i.path === v2.payload.artifactPath);
          if (!artifact || artifact.sha256 !== v2.payload.artifactSha || ![...q.solutionAssetPaths, ...q.problemAssetPaths].includes(artifact.path)) findings.push('OBSERVED_ARTIFACT_UNBOUND');
          else {
            if (['cartesian', 'geometry', 'number-line'].includes(v2.payload.fact.visualType)) {
              const observed = extractSvgGeometry(readBoundFile(root, artifact).toString('utf8'));
              findings.push(...verifySvgGeometry(v2.payload.fact, observed).errors);
              if (run.schemaVersion === RUN_VERSION_V2) {
                try {
                  const build = JSON.parse(readBoundFile(root, q.generationEvidence));
                  if (build.numericExecution !== 'PYTHON_EXECUTED' || build.artifactSha !== artifact.sha256 || build.semanticSha !== parity.expectedSemanticSha || build.visualSpecSha !== VISUAL_SPEC_SHA) findings.push('NUMERIC_BUILD_WITNESS_MISMATCH');
                } catch { findings.push('NUMERIC_BUILD_WITNESS_REQUIRED'); }
              }
            }
            const structureSha = structureFingerprint(v2.payload.fact);
            if (v2.payload.structureSha !== structureSha) findings.push('STRUCTURE_FINGERPRINT_STALE_OR_MISSING');
            visualItems.push({ artifactSha: artifact.sha256, structureSha, fact: v2.payload.fact, reuseApproval: v3.payload.reuseApproval });
          }
        } catch (error) { findings.push(`VISUAL_FACT_INVALID:${error.message}`); }
        for (const gate of ['necessity', 'decisiveStep', 'completeness', 'mediumFit', 'solutionParity', 'altCaptionParity', 'semanticsLocks', 'staticContract']) if (v3.payload?.checks?.[gate] !== 'PASS') findings.push(`V3_GATE_NOT_PASS:${gate}`);
      }
    }
    if (run.schemaVersion === RUN_VERSION_V2 && policy.visual) {
      const v3 = get('v3'), v1 = get('v1');
      if (!v3 || q.visual.adjudicationId !== v3.evidenceId || v3.payload?.finalVisualRequirement !== q.visual.requirement || v3.payload?.finalVisualAction !== q.visual.action || v3.payload?.v1EvidenceSha !== evidenceHashes.get(v1?.evidenceId) || v3.payload?.cDenominatorInputSha !== denominatorInput(run).inputSha || v3.payload?.checks?.SOLUTION_VISUAL_BENEFIT_GATE !== 'PASS') findings.push('U3_VISUAL_BENEFIT_ADJUDICATION_UNBOUND');
    }
    itemResults.push({ questionUid: q.questionUid, status: findings.length ? 'BLOCKED' : 'PASS', visualRequired: needed, parity, errors: findings });
    errors.push(...findings.map(f => `${q.questionUid}:${f}`));
  }
  try {
    const duplicate = auditDuplicates(visualItems);
    if (duplicate.status !== 'PASS') errors.push(...duplicate.errors);
  } catch (error) { errors.push(`DUPLICATE_CHECK:${error.message}`); }
  const denominator = denominatorInput(run);
  if (!isObject(run.denominator) || run.denominator.status !== 'FROZEN' || run.denominator.stale !== false || run.denominator.inputSha !== denominator.inputSha || run.denominator.requiredUidSetSha !== denominator.requiredUidSetSha || !Array.isArray(run.denominator.requiredUidSet) || canonicalJson(run.denominator.requiredUidSet) !== canonicalJson(denominator.requiredUidSet)) errors.push('C_DENOMINATOR_STALE_OR_INCOMPLETE');
  for (const candidatePath of new Set(run.questions.map(q => q.candidatePath))) for (const mode of (run.schemaVersion === RUN_VERSION_V2 && run.publicationIntent === 'FULL_EXAM' ? ['exam', 'solution', 'answer'] : policy.modes)) for (const viewport of profiles.viewports) {
    const matches = [...evidence.values()].filter(e => {
      if (e.axis !== 'render') return false;
      let capture = evidence.get(e.payload?.captureEvidenceId);
      if (run.schemaVersion === RUN_VERSION_V2 && e.inputSha !== run.inputSha) {
        const receipt = (run.renderReviewReuseReceiptRefs || []).map(ref => JSON.parse(readBoundFile(root, ref))).find(receipt => receipt.rootFreshReviewRef?.sha256 === evidenceHashes.get(e.evidenceId));
        if (receipt) capture = evidence.get(JSON.parse(readBoundFile(root, receipt.currentCaptureRef)).evidenceId);
      }
      return capture?.axis === 'render-capture' && capture.payload?.mode === mode && capture.payload?.viewport?.profile === viewport.profile && capture.payload?.candidatePath === candidatePath;
    });
    let renderErrors;
    try { renderErrors = matches.length === 1 ? invalidEvidenceIds.has(matches[0].evidenceId) ? ['RENDER_EVIDENCE_INVALID'] : validateRender(root, matches[0], viewport, mode, run, run.inputSha, candidatePath, evidence, evidenceHashes, invalidEvidenceIds) : ['RENDER_CASE_MISSING_OR_DUPLICATE']; } catch (error) { renderErrors = [`RENDER_SCHEMA_INVALID:${error.message}`]; }
    renderResults.push({ candidatePath, mode, viewport: viewport.profile, status: renderErrors.length ? 'BLOCKED' : 'PASS', errors: renderErrors });
    errors.push(...renderErrors.map(e => `${mode}/${viewport.profile}:${e}`));
  }
  for (const ref of [...run.inputs, ...run.evidence]) {
    try { readBoundFile(root, ref); } catch (error) { errors.push(`CHANGED_DURING_AUDIT:${error.message}`); }
  }
  if (run.sourceRecoveryLedger) {
    const recovery = validateSourceRecoveryLedger(run.sourceRecoveryLedger, run, root);
    if (recovery.status !== 'PASS') errors.push(...recovery.errors.map(error => `SOURCE_RECOVERY:${error}`));
  }
  if (!errors.length && policy.scope === 'QUESTION_QUALITY' && run.schemaVersion === RUN_VERSION) {
    const authorization = run.productionAuthorization;
    const reviewIds = [...evidence.values()].filter(e => e.axis === 'render').map(e => e.evidenceId).sort();
    const latestRenderFreeze = Math.max(...[...evidence.values()].filter(e => e.axis === 'render').map(e => Date.parse(e.frozenAt)), -Infinity);
    productionAuthorized = isObject(authorization)
      && authorization.status === 'APPROVED'
      && nonempty(authorization.authorityId)
      && Number.isFinite(Date.parse(authorization.approvedAt))
      && Date.parse(authorization.approvedAt) >= latestRenderFreeze
      && authorization.releaseInputSha === run.inputSha
      && authorization.runtimeBundleSha === run.renderRuntime?.bundleSha
      && canonicalJson(uidSet(authorization.renderReviewEvidenceIds || [])) === canonicalJson(uidSet(reviewIds));
  }
  if (CORE_SHA !== objectSha(CORE_SHA_INPUT_FILES.map(name => ({ name, sha256: bytesSha(fs.readFileSync(new URL(name, import.meta.url))) })))) errors.push('VERIFIER_CHANGED_DURING_AUDIT');
  return result();
}

export function auditManifestFile(root, file, expectedPipeline) {
  try {
    const run = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (expectedPipeline && run.pipeline !== expectedPipeline) throw new Error('PIPELINE_ID_MISMATCH');
    return auditRun(root, run);
  } catch (error) { return { schemaVersion: 'APMATH_PIPELINE_CLOSURE_v1', status: 'BLOCKED', productionAuthorized: false, errors: [`MANIFEST_READ_OR_SCHEMA:${error.message}`] }; }
}
