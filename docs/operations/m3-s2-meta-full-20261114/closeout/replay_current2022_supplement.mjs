#!/usr/bin/env node
// One additive E065 Q5 route only. The 403-route baseline is never re-run or rewritten.
// Build once: node replay_current2022_supplement.mjs --repo-root <repo> --report-dir <dir>
//   --supplement-input <root-input.json> --meaning-recheck <author-A.json> --build
// Replay: node replay_current2022_supplement.mjs --repo-root <repo> --report-dir <closeout>
//   --out <new-replay.json>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const arg = name => { const i = args.indexOf(`--${name}`); return i < 0 ? '' : args[i + 1] || ''; };
if (!arg('repo-root') || !arg('report-dir')) throw new Error('Required: --repo-root <repo> --report-dir <directory>');
const repoRoot = path.resolve(arg('repo-root'));
const reportDir = path.resolve(arg('report-dir'));
const closeout = 'docs/operations/m3-s2-meta-full-20261114/closeout';
const examDir = 'docs/operations/m3-s2-meta-full-20261114/exams';
const names = {
  input: 'E065.current2022-supplement.json', meaning: 'E065.current2022-recheck.json',
  report: 'E065.Q5.current2022.official-supplement.json',
  summary: 'ALL9.official-validation.effective-summary.json',
  replay: 'E065.Q5.current2022.official-replay.json',
  helper: 'replay_current2022_supplement.mjs',
  baseline: 'ALL9.official-validation.compact-summary.json',
};
const expected = {
  input: '2dc3e2dcf9fb47275666fbf923f790432396e9252eb55a09b4a59d642c391817',
  meaning: '765430abd81d89c52b01c034e4454fce0815b98b80b6d37e2bb3eab29a627a27',
  baseline: '7151d89965996d56ae18d2fa2a48012983660455542abbbef40bb952add58ad6',
};
const inputPath = arg('supplement-input') ? path.resolve(arg('supplement-input')) : path.join(reportDir, names.input);
const meaningPath = arg('meaning-recheck') ? path.resolve(arg('meaning-recheck')) : path.join(reportDir, names.meaning);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const raw = file => fs.readFileSync(file);
const read = file => JSON.parse(raw(file).toString('utf8'));
const clone = value => JSON.parse(JSON.stringify(value));
const officialPath = 'archive/tools/meta-foundation/rpm-active-resolver.mjs';
const official = await import(pathToFileURL(path.join(repoRoot, officialPath)).href);
const { objectSha } = await import(pathToFileURL(path.join(repoRoot, 'archive/tools/pipeline-core/canonical.mjs')).href);
const { loadActiveMetaRegistry } = await import(pathToFileURL(path.join(repoRoot, 'archive/tools/meta-foundation/active-registry.mjs')).href);
const registry = loadActiveMetaRegistry(repoRoot);
const same = (a, b) => objectSha(a ?? null) === objectSha(b ?? null);
const ensure = (ok, code) => { if (!ok) throw new Error(code); };
const fileRef = (file, publishedPath) => ({ path: publishedPath, sha256: sha(raw(file)), bytes: raw(file).length });
const resolveRef = refPath => {
  if (refPath.startsWith(`${closeout}/`)) return path.join(reportDir, path.basename(refPath));
  if (!path.isAbsolute(refPath)) return path.join(repoRoot, refPath);
  const marker = '/m3-meta/';
  const at = refPath.indexOf(marker);
  return at < 0 ? refPath : path.join(repoRoot, refPath.slice(at + marker.length));
};
function checkRef(ref, label) {
  ensure(ref?.path && ref?.sha256, `${label}:REF_MISSING`);
  const bytes = raw(resolveRef(ref.path));
  ensure(sha(bytes) === ref.sha256.replace(/^sha256:/, ''), `${label}:FILE_SHA_MISMATCH`);
  if (Number.isInteger(ref.ordinal) && ref.objectSha) {
    const row = JSON.parse(bytes.toString('utf8')).items?.find(item => item.ordinal === ref.ordinal);
    ensure(row && objectSha(row) === ref.objectSha, `${label}:ITEM_SHA_MISMATCH`);
  }
}
function writeNew(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
}

ensure(sha(raw(inputPath)) === expected.input, 'SUPPLEMENT_INPUT_SHA_MISMATCH');
ensure(sha(raw(meaningPath)) === expected.meaning, 'SEMANTIC_RECHECK_SHA_MISMATCH');
ensure(sha(raw(path.join(reportDir, names.baseline))) === expected.baseline, 'BASELINE_SUMMARY_SHA_MISMATCH');
const supplement = read(inputPath);
const meaning = read(meaningPath);
const baseline = read(path.join(reportDir, names.baseline));
const baselines = baseline.exams.map(exam => {
  const file = path.join(reportDir, exam.compactRef.fileName);
  ensure(sha(raw(file)) === exam.compactRef.sha256, `${exam.examId}:BASELINE_COMPACT_SHA_MISMATCH`);
  return { exam, report: read(file), ref: fileRef(file, `${closeout}/${exam.compactRef.fileName}`) };
});
const oldExam = baselines.find(row => row.exam.examId === 'E065');
const oldItem = oldExam.report.items.find(row => row.ordinal === 5);
const oldRoute = oldItem.routes.find(row => row.curriculum === '2015');
const unavailable = oldItem.routes.find(row => row.curriculum === '2022');
ensure(unavailable.executionStatus === 'NOT_RUN' && unavailable.reason === 'EXACT_COUNTERPART_NOT_FOUND', 'EXPECTED_PRIOR_UNAVAILABLE_ROUTE_MISSING');
ensure(supplement.examId === 'E065' && supplement.ordinal === 5 && supplement.curriculum === '2022', 'SUPPLEMENT_ROUTE_ID_MISMATCH');
ensure(supplement.input.sourceIdentity.questionUid === oldItem.questionUid, 'SUPPLEMENT_QUESTION_UID_MISMATCH');
ensure(supplement.evidence.sourceFingerprint === oldRoute.difficultyEvidence.sourceFingerprint, 'SOURCE_FINGERPRINT_CHANGED');
ensure(supplement.input.solutionIdentity.solutionHash === oldRoute.difficultyEvidence.solutionHash, 'SOLUTION_HASH_CHANGED');
ensure(supplement.evidence.crosswalkRecordId === 'M3-RPM-135', 'SUPPLEMENT_LEAF_MISMATCH');
checkRef(supplement.supersedes.frozenMetaRef, 'FROZEN_META');
checkRef(supplement.supersedes.frozenResolverRef, 'FROZEN_RESOLVER');
checkRef(supplement.sourceRef, 'ACTUAL_SOURCE');
checkRef(oldExam.report.resolverCodeRef, 'OFFICIAL_RESOLVER_CODE');
for (const key of ['authorDecisionRef', 'finalMetaItemRef', 'adjudicationRef', 'independentRecheckRef', 'independentSampleRef']) {
  if (oldRoute.difficultyDecisionBinding[key]) checkRef(oldRoute.difficultyDecisionBinding[key], `DIFFICULTY_${key}`);
}
ensure(objectSha(oldRoute.difficultyDecisionBinding) === oldRoute.difficultyEvidence.decisionSha, 'ORIGINAL_DIFFICULTY_DECISION_BINDING_INVALID');
const pkg = read(path.join(repoRoot, `${examDir}/E065.resolver-receipt.json`));
const oldPackageRoute = pkg.items.find(row => row.ordinal === 5 && row.curriculum === '2015');
ensure(same(oldPackageRoute.input.sourceIdentity, supplement.input.sourceIdentity), 'SOURCE_IDENTITY_CHANGED');
ensure(same(oldPackageRoute.input.solutionIdentity, supplement.input.solutionIdentity), 'SOLUTION_IDENTITY_CHANGED');
ensure(oldPackageRoute.input.semanticDecision.primaryMethod === supplement.input.semanticDecision.primaryMethod, 'PRIMARY_METHOD_CHANGED');
ensure(oldPackageRoute.input.semanticDecision.decisiveStep === supplement.input.semanticDecision.decisiveStep, 'DECISIVE_STEP_CHANGED');
const finalMeta = read(path.join(repoRoot, `${examDir}/E065.meta.json`));
const finalItem = finalMeta.items.find(row => row.ordinal === 5);
const originalDecision = read(resolveRef(oldRoute.difficultyDecisionBinding.authorDecisionRef.path)).items.find(row => row.ordinal === 5);
const rootSampleFile = resolveRef(oldRoute.difficultyDecisionBinding.independentSampleRef.path);
const rootSampleDocument = read(rootSampleFile);
const rootSample = rootSampleDocument.items.find(row => row.ordinal === 5);
const meaningQ5 = meaning.items.find(row => row.ordinal === 5);
ensure(meaningQ5?.exact2022RecordId === 'M3-RPM-135' && meaningQ5.status === 'EXACT_LEAF_AVAILABLE', 'RECHECK_EXACT_LEAF_NOT_CONFIRMED');
ensure(rootSampleDocument.beforeAuthorJudgmentsRead === true, 'SOURCE_FIRST_ROOT_SAMPLE_NOT_DOCUMENTED');
ensure(oldRoute.semanticMetaEvidence.candidateVisibleDuringDecision === false, 'ORIGINAL_RELATIONAL_SOURCE_FIRST_NOT_DOCUMENTED');
const inputRef = { ...fileRef(inputPath, `${closeout}/${names.input}`), field: 'input', objectSha: objectSha(supplement.input) };
const evidenceRef = { ...fileRef(inputPath, `${closeout}/${names.input}`), field: 'evidence', evidenceSha: supplement.evidence.evidenceSha };
const meaningRef = { ...fileRef(meaningPath, `${closeout}/${names.meaning}`), ordinal: 5, objectSha: objectSha(meaningQ5) };
const baselineRef = fileRef(path.join(reportDir, names.baseline), `${closeout}/${names.baseline}`);
const selfRef = fileRef(fileURLToPath(import.meta.url), `${closeout}/${names.helper}`);
const oldRouteRef = { ...oldExam.ref, selector: { ordinal: 5, curriculum: '2015' },
  difficultyEvidenceSha: oldRoute.difficultyEvidence.evidenceSha,
  relationalEvidenceSha: oldRoute.semanticMetaEvidence.evidenceSha,
  inputObjectSha: oldRoute.inputRef.objectSha };

function expectedCandidate() {
  const candidate = { ...clone(finalItem.after), curriculum: '2022', sourceArchiveFile: finalMeta.sourceArchiveFile,
    integrationReason: finalItem.crossConditionIntegration.rationale };
  ensure(same({ ...candidate, curriculum: '2015' }, oldRoute.candidateMeta), 'FINAL_SOURCE_CANDIDATE_CHANGED');
  return candidate;
}
function relationalEvidence() {
  const prior = clone(oldRoute.semanticMetaEvidence);
  const { evidenceSha: ignored, ...body } = prior;
  body.inputBundleSha = supplement.evidence.inputBundleSha;
  body.decisionOrigin = 'REUSED_AUTHOR_SOURCE_FIRST_FROZEN_RELATIONAL_DECISION';
  body.originalRelationalEvidenceRef = oldRouteRef;
  body.current2022SemanticRecheckRef = meaningRef;
  body.currentSemanticAdjudicationCandidateVisible = true;
  body.currentSemanticAdjudicationExposure = supplement.actualExposure;
  body.currentMeaningReviewerProvenance = clone(meaning.provenance);
  body.currentAssemblerIsFreshReviewer = false;
  body.candidateVisibilityScope = 'candidateVisibleDuringDecision=false refers only to the unchanged original author CC/COND/INTEGRATION decision, whose frozen source-first evidence is reused. The later current-2022 RPM selection and this receipt assembly were candidate-visible; no new never-exposed review is claimed.';
  body.rebindingScope = 'Same question, solution, primary method, decisive calculation and final relational fields; only the curriculum/RPM route input bundle is rebound. No new relational decision is inferred from the chosen RPM key.';
  body.rootSourceFirstMethodGrounding = {
    ref: clone(oldRoute.difficultyDecisionBinding.independentSampleRef),
    frozenAt: rootSampleDocument.frozenAt,
    beforeAuthorJudgmentsRead: rootSampleDocument.beforeAuthorJudgmentsRead,
    sourceReasonVerbatim: rootSample.independentSourceReason,
    fourSlotExpectationsVerbatim: rootSample.fourSlotExpectations,
    scope: 'Independent method and graph-point-condition grounding; this note does not contain explicit canonical CC/COND arrays. Canonical arrays and their unchanged rationale are reused from the original author freeze and final metadata.'
  };
  for (const key of ['crossConceptDecisions', 'conditionDecisions']) {
    body[key] = body[key].map(row => ({ ...row, inputBundleSha: supplement.evidence.inputBundleSha }));
  }
  return { ...body, evidenceSha: objectSha(body) };
}
function validateNewRoute(candidateMeta, difficultyEvidence, semanticMetaEvidence) {
  const validation = official.validateResolverEvidence(supplement.input, supplement.evidence, { repoRoot, registry });
  const resolverReceipt = validation.status === 'PASS' ? official.makeMetaValidatorReceipt(supplement.evidence, validation) : null;
  const difficultyValidation = official.validateBlindDifficulty(difficultyEvidence, {
    sourceFingerprint: supplement.evidence.sourceFingerprint, solutionHash: supplement.input.solutionIdentity.solutionHash });
  const payload = { input: supplement.input, resolverEvidence: supplement.evidence, candidateMeta,
    difficultyEvidence, semanticMetaEvidence, repoRoot, registry };
  const preflight = official.validateMetaFinalization({ ...payload, requireValidatorReceipt: false });
  const fullReceipt = preflight.status === 'PASS' ? official.makeMetaValidatorReceipt(supplement.evidence, preflight) : null;
  const full = official.validateMetaFinalization({ ...payload, validatorReceipt: fullReceipt });
  return { validation, resolverReceipt, difficultyValidation, preflight, fullReceipt, full };
}
function makeReport() {
  const { evidenceSha: ignored, ...difficultyBody } = oldRoute.difficultyEvidence;
  const difficultyEvidence = official.makeDifficultyEvidence(difficultyBody);
  ensure(same(difficultyEvidence, oldRoute.difficultyEvidence), 'DIFFICULTY_EVIDENCE_REBUILD_CHANGED');
  const candidateMeta = expectedCandidate();
  const semanticMetaEvidence = relationalEvidence();
  const result = validateNewRoute(candidateMeta, difficultyEvidence, semanticMetaEvidence);
  return {
    schemaVersion: 'M3S2_ADDITIVE_CURRENT2022_OFFICIAL_VALIDATION_v1', createdAt: new Date().toISOString(),
    taskId: supplement.taskId, examId: 'E065', ordinal: 5, curriculum: '2022', questionUid: oldItem.questionUid,
    reviewer: 'GPT_AUTHOR_B_00FBAC4C0777', sourceSnapshotCommit: supplement.sourceSnapshotCommit,
    scope: 'Exactly one added current-2022 resolver route. Original source metadata and 403 frozen route validations are unchanged. Official finalization PASS may retain unmaterialized compatibility projection.',
    inputRef, resolverEvidenceRef: evidenceRef, meaningRecheckRef: meaningRef, original2015DecisionRef: oldRouteRef,
    baselineSummaryRef: baselineRef, replayHelperRef: selfRef,
    resolverCodeRef: clone(oldExam.report.resolverCodeRef), finalSourceRef: clone(supplement.sourceRef),
    finalMetaItemRef: clone(oldItem.finalMetaItemRef), supersedes: clone(supplement.supersedes),
    effectiveMetaPatch: clone(supplement.effectiveMetaPatch), executionStatus: 'EXECUTED',
    observationProvenance: {
      actualNewSemanticExposure: supplement.actualExposure,
      meaningReviewerProvenance: clone(meaning.provenance),
      newFreshBlindReviewClaimed: false, newR1R2R3CertificationClaimed: false,
      difficultyPolicy: 'CURRENT_OVERRIDE_SAME_REVIEWER_SEPARATE_DIFFICULTY_AXIS',
      difficultyReuse: 'Exact original difficulty evidence and decision binding, including boundary adjudication and source-first root sample; source and solution identity hashes match. No new independent difficulty reviewer or fresh session is asserted.',
      relationalReuse: semanticMetaEvidence.candidateVisibilityScope,
      primaryMethodUnchanged: true, decisiveStepUnchanged: true, sourceIdentityUnchanged: true, solutionIdentityUnchanged: true,
    },
    resolverValidation: { status: result.validation.status, errors: result.validation.errors,
      recomputedBodyOmitted: true, recomputedEvidenceSha: result.validation.recomputed?.evidenceSha,
      fullOfficialResultSha: objectSha(result.validation) },
    officialResolverDecisionReceipt: result.resolverReceipt,
    officialResolverDecisionReceiptSelfCheck: result.resolverReceipt ? official.validateMetaValidatorReceipt(result.resolverReceipt, supplement.evidence.evidenceSha, result.validation) : false,
    difficultyDecisionBinding: clone(oldRoute.difficultyDecisionBinding), difficultyEvidence,
    difficultyValidation: result.difficultyValidation, candidateMeta, semanticMetaEvidence,
    finalizationPreflight: result.preflight, officialFullFinalizationReceipt: result.fullReceipt,
    officialFullFinalizationReceiptSelfCheck: result.fullReceipt ? official.validateMetaValidatorReceipt(result.fullReceipt, supplement.evidence.evidenceSha, result.preflight) : false,
    fullFinalization: result.full,
    fullFinalizationDisposition: result.full.status === 'PASS' ? 'OFFICIAL_FINALIZATION_PASS_WITH_RECORDED_PROJECTION_STATE' : 'OFFICIAL_FINALIZATION_PENDING_RAW_FAILURE_PRESERVED',
    nativeTemplateGapProjectionReusePending: false,
    currentProjectionDebt: clone(supplement.effectiveMetaPatch.addDebt),
  };
}
const bump = (map, key) => { map[key] = (map[key] || 0) + 1; };
function aggregate(report) {
  const totals = { totalQuestions: 0, totalCandidateRoutes: 0, executedRoutes: 0, notRunRoutes: 0,
    resolverStatusCounts: {}, difficultyStatusCounts: {}, fullFinalizationStatusCounts: {},
    preflightStatusCounts: {}, finalizationErrors: {}, projectionStatusCounts: {}, unavailableRoutes: [],
    sourceInvalidQuestions: [], unknownDifficultyQuestions: [], nativeTemplateGapProjectionReusePending: [],
    relationalVisibilityPending: [], questionCoverage: { bothRoutesExecuted: 0, oneRouteExecuted: 0, noRouteExecuted: 0,
      bothRoutesFullFinalizationPass: 0, allExecutedRoutesFullFinalizationPass: 0, anyFullFinalizationFailure: 0 }, exams: [] };
  for (const entry of baselines) {
    const examCounts = { examId: entry.exam.examId, questions: entry.report.items.length, executedRoutes: 0, notRunRoutes: 0,
      resolverStatusCounts: {}, difficultyStatusCounts: {}, fullFinalizationStatusCounts: {}, baselineCompactRef: entry.ref };
    for (const item of entry.report.items) {
      const questionId = `${entry.exam.examId}:${item.ordinal}`;
      const routes = item.routes.map(route => entry.exam.examId === 'E065' && item.ordinal === 5 && route.curriculum === '2022' ? report : route);
      totals.totalQuestions++;
      if (item.sourceInvalid) totals.sourceInvalidQuestions.push(questionId);
      if (item.difficultyUnknown) totals.unknownDifficultyQuestions.push(questionId);
      const executed = routes.filter(route => route.executionStatus === 'EXECUTED');
      totals.questionCoverage[executed.length === 2 ? 'bothRoutesExecuted' : executed.length ? 'oneRouteExecuted' : 'noRouteExecuted']++;
      if (executed.length && executed.every(route => route.fullFinalization.status === 'PASS')) totals.questionCoverage.allExecutedRoutesFullFinalizationPass++;
      if (executed.length === 2 && executed.every(route => route.fullFinalization.status === 'PASS')) totals.questionCoverage.bothRoutesFullFinalizationPass++;
      if (executed.some(route => route.fullFinalization.status === 'FAIL')) totals.questionCoverage.anyFullFinalizationFailure++;
      for (const route of routes) {
        totals.totalCandidateRoutes++;
        const routeId = `${questionId}:${route.curriculum}`;
        const active = route.executionStatus === 'EXECUTED';
        totals[active ? 'executedRoutes' : 'notRunRoutes']++;
        examCounts[active ? 'executedRoutes' : 'notRunRoutes']++;
        for (const [field, counter] of [['resolverValidation', 'resolverStatusCounts'], ['difficultyValidation', 'difficultyStatusCounts'], ['fullFinalization', 'fullFinalizationStatusCounts']]) {
          bump(totals[counter], route[field].status); bump(examCounts[counter], route[field].status);
        }
        if (route.finalizationPreflight) bump(totals.preflightStatusCounts, route.finalizationPreflight.status);
        for (const error of route.fullFinalization.errors || []) bump(totals.finalizationErrors, error);
        if (active) bump(totals.projectionStatusCounts, route.fullFinalization.projectionStatus);
        else totals.unavailableRoutes.push({ routeId, hold: route.hold, reason: route.reason, recordedRouteStatus: route.recordedRouteStatus });
        if (route.nativeTemplateGapProjectionReusePending) totals.nativeTemplateGapProjectionReusePending.push(routeId);
        if ((route.fullFinalization.errors || []).includes('META_FINAL_RELATIONAL_PROVENANCE_INVALID')) totals.relationalVisibilityPending.push(routeId);
      }
    }
    totals.exams.push(examCounts);
  }
  ensure(totals.totalQuestions === 209 && totals.totalCandidateRoutes === 418 && totals.executedRoutes === 404 && totals.notRunRoutes === 14, 'EFFECTIVE_SCOPE_COUNT_MISMATCH');
  return totals;
}
function makeSummary(report) {
  return {
    schemaVersion: 'M3S2_OFFICIAL_EFFECTIVE_SUMMARY_v1', createdAt: new Date().toISOString(), taskId: supplement.taskId,
    baselineSummaryRef: baselineRef,
    supplementalValidationRef: fileRef(path.join(reportDir, names.report), `${closeout}/${names.report}`),
    semanticSupplementInputRef: inputRef, replayHelperRef: selfRef,
    overlay: { routeId: 'E065:5:2022', previousExecutionStatus: 'NOT_RUN', previousReason: unavailable.reason,
      effectiveExecutionStatus: report.executionStatus, frozenBaselineFilesModified: false,
      original403OfficialValidationsRerun: false },
    ...aggregate(report),
    interpretation: {
      officialResolverReceipts: '403 original receipts plus the single new receipt; original results remain frozen and are aggregated by verified file hashes, not re-executed here.',
      notRun: '14 unavailable official route validations: 5 source-invalid questions across 2 curricula, plus E065 Q1/4/11/16 current-2022 exact-leaf gaps. UNKNOWN2 are a subset of the source-invalid5, not extra cases.',
      fullFinalization: 'Official raw results are preserved. PASS can coexist with recorded projection/binding debt; it is not production deployment approval or complete PT/TPL materialization.',
      nativeTemplateGaps: 'The 39 intentional native-template omissions against PROJECTION_REUSE remain failed/pending; no template key or definition was changed.',
      relationalVisibility: 'The 6 historical provenance failures remain unchanged and explicitly reflect actual candidate exposure versus the legacy validator boolean. Current override does not conceal exposure or fabricate validator PASS.',
      legacyValidatorNotRunError: 'META_DETERMINISTIC_VALIDATOR_NOT_RUN in a failed full check means no PASS preflight receipt was issuable. Both preflight and full validation were executed.',
      difficultyOverride: 'CURRENT_OVERRIDE_SAME_REVIEWER_SEPARATE_DIFFICULTY_AXIS; actual minimum-solution-burden rationale is independent of semantic keys, with boundary/abnormal legacy adjudications preserved. No new different-reviewer/session/non-exposure condition is imposed.',
    },
  };
}

if (args.includes('--build')) {
  const report = makeReport();
  writeNew(path.join(reportDir, names.report), report);
  writeNew(path.join(reportDir, names.summary), makeSummary(report));
}
const report = read(path.join(reportDir, names.report));
const summary = read(path.join(reportDir, names.summary));
const replayErrors = [];
const test = (condition, code) => { if (!condition) replayErrors.push(code); };
test(same(report.inputRef, inputRef) && same(report.resolverEvidenceRef, evidenceRef), 'SUPPLEMENT_INPUT_OR_EVIDENCE_REF_CHANGED');
test(same(report.meaningRecheckRef, meaningRef), 'MEANING_RECHECK_REF_CHANGED');
test(same(report.replayHelperRef, selfRef), 'REPLAY_HELPER_REF_CHANGED');
test(same(report.difficultyDecisionBinding, oldRoute.difficultyDecisionBinding), 'DIFFICULTY_DECISION_BINDING_CHANGED');
test(same(report.difficultyEvidence, oldRoute.difficultyEvidence), 'REUSED_DIFFICULTY_EVIDENCE_CHANGED');
test(same(report.candidateMeta, expectedCandidate()), 'FINAL_CANDIDATE_CHANGED');
test(same(report.semanticMetaEvidence, relationalEvidence()), 'RELATIONAL_REBINDING_OR_PROVENANCE_CHANGED');
const result = validateNewRoute(report.candidateMeta, report.difficultyEvidence, report.semanticMetaEvidence);
test(report.resolverValidation.fullOfficialResultSha === objectSha(result.validation), 'RESOLVER_RESULT_SHA_CHANGED');
test(report.resolverValidation.status === result.validation.status && same(report.resolverValidation.errors, result.validation.errors), 'RESOLVER_STATUS_OR_ERRORS_CHANGED');
const resolverReceiptVerified = official.validateMetaValidatorReceipt(report.officialResolverDecisionReceipt, supplement.evidence.evidenceSha, result.validation);
test(resolverReceiptVerified, 'OFFICIAL_RESOLVER_RECEIPT_INVALID');
test(same(report.difficultyValidation, result.difficultyValidation), 'DIFFICULTY_VALIDATION_CHANGED');
test(same(report.finalizationPreflight, result.preflight), 'FINALIZATION_PREFLIGHT_CHANGED');
const fullReceiptVerified = report.officialFullFinalizationReceipt
  ? official.validateMetaValidatorReceipt(report.officialFullFinalizationReceipt, supplement.evidence.evidenceSha, result.preflight) : null;
if (report.officialFullFinalizationReceipt) test(fullReceiptVerified, 'OFFICIAL_FULL_FINALIZATION_RECEIPT_INVALID');
const rawFullFromStoredReceipt = official.validateMetaFinalization({ input: supplement.input, resolverEvidence: supplement.evidence,
  candidateMeta: report.candidateMeta, difficultyEvidence: report.difficultyEvidence, semanticMetaEvidence: report.semanticMetaEvidence,
  validatorReceipt: report.officialFullFinalizationReceipt, repoRoot, registry });
test(same(report.fullFinalization, rawFullFromStoredReceipt), 'FULL_FINALIZATION_CHANGED');
const counts = aggregate(report);
for (const [key, value] of Object.entries(counts)) test(same(summary[key], value), `EFFECTIVE_SUMMARY_CHANGED:${key}`);
test(summary.supplementalValidationRef.sha256 === sha(raw(path.join(reportDir, names.report))), 'SUMMARY_SUPPLEMENT_REF_SHA_MISMATCH');
const replay = {
  schemaVersion: 'M3S2_ADDITIVE_CURRENT2022_OFFICIAL_REPLAY_v1', createdAt: new Date().toISOString(),
  status: replayErrors.length ? 'FAIL' : 'PASS', errors: replayErrors,
  scope: 'Only E065 Q5 current-2022 official route is re-executed. Frozen baseline file hashes and effective arithmetic are checked without re-running the original 403 routes. Replay integrity PASS never changes an expected raw metadata FAIL/HOLD.',
  reportRef: fileRef(path.join(reportDir, names.report), `${closeout}/${names.report}`),
  effectiveSummaryRef: fileRef(path.join(reportDir, names.summary), `${closeout}/${names.summary}`),
  inputRef, meaningRef, replayHelperRef: selfRef,
  baselineCompactFilesVerified: baselines.map(row => row.ref), original403OfficialValidationsRerun: false,
  actualNewRoutesExecuted: 1, route: { examId: 'E065', ordinal: 5, curriculum: '2022',
    resolverStatus: result.validation.status, resolverErrors: result.validation.errors,
    fullOfficialResolverResultSha: objectSha(result.validation), officialResolverDecisionReceiptVerified: resolverReceiptVerified,
    difficultyStatus: result.difficultyValidation.status, difficultyErrors: result.difficultyValidation.errors,
    finalizationPreflight: result.preflight, officialFullFinalizationReceiptVerified: fullReceiptVerified,
    fullFinalization: rawFullFromStoredReceipt },
  effectiveCounts: { totalQuestions: counts.totalQuestions, totalCandidateRoutes: counts.totalCandidateRoutes,
    executedRoutes: counts.executedRoutes, notRunRoutes: counts.notRunRoutes,
    resolverStatusCounts: counts.resolverStatusCounts, difficultyStatusCounts: counts.difficultyStatusCounts,
    fullFinalizationStatusCounts: counts.fullFinalizationStatusCounts },
};
const out = arg('out') ? path.resolve(arg('out')) : args.includes('--build') ? path.join(reportDir, names.replay) : '';
if (out) writeNew(out, replay);
process.stdout.write(`${JSON.stringify({ replayIntegrity: replay.status, actualNewRoutesExecuted: 1,
  routeResolver: result.validation.status, routeDifficulty: result.difficultyValidation.status,
  routeFinalization: rawFullFromStoredReceipt.status, routeFinalizationErrors: rawFullFromStoredReceipt.errors,
  projectionStatus: rawFullFromStoredReceipt.projectionStatus, effectiveCounts: replay.effectiveCounts, errors: replayErrors })}\n`);
if (replayErrors.length) process.exitCode = 1;
