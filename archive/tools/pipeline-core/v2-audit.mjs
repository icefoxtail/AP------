import fs from 'node:fs';
import { MACHINE_AXES, readWorkBatch, validateWorkBatchEvidence, workBatchMetrics } from './work-batch.mjs';
import { validateTypedEvidence, validateMachineEvidence } from './review-evidence-v2.mjs';
import { canonicalJson, objectSha, readBoundFile, nonempty } from './canonical.mjs';
import { validateSchema } from './schema.mjs';
import { RUN_VERSION_V2, CORE_SHA, profiles, runInputSha, auditSemanticKernel, loadBoundQuestionBanks } from './closure.mjs';
import { axisInputSha, requiredAxesForQuestion, AXIS_INPUT_PROJECTION_MAP } from './projection.mjs';
import { semanticDiff, changeImpactMap, runLevelSemanticHash } from './semantic-diff.mjs';
import { validateEvidenceFreshness, validateFreshEvidenceIndependence } from './review-evidence-v2.mjs';
import { validateQuestionQualityClosureSet } from './question-quality-set.mjs';
import { normalizeSourceExamIdRegistry, validateUidMigrationEvidence } from './question-uid.mjs';
import { validateAuditorPacket, loadCandidateReviewContext } from './review-isolation-runner.mjs';
import { validateBuildWorkLedgerEntry } from './build-work-ledger.mjs';
import { validateExamReleaseClosure, examReleaseApplicability } from './exam-release.mjs';
import { detectRenderImpact } from './render-impact.mjs';

const same = (a, b) => canonicalJson(a ?? null) === canonicalJson(b ?? null);
const load = (root, ref) => JSON.parse(readBoundFile(root, ref));
const pairKey = row => `${row.questionUid}\u0000${row.axis}`;
export function requiresSolutionVisualBenefitGate(requiredAxes = [], changedFields = [], v3Evidence = null) {
  return requiredAxes.includes('V3') && changedFields.includes('SOLUTION') && v3Evidence?.payload?.checks?.SOLUTION_VISUAL_BENEFIT_GATE !== 'PASS';
}
const contracts = Object.fromEntries(['run-v2', 'evidence-v2', 'reuse-receipt-v1', 'question-quality-closure-v2', 'exam-release-v1', 'build-work-ledger-v1', 'source-exam-id-registry-v1', 'edit-closure-v1', 'render-review-reuse-receipt-v1'].map(name => [name, JSON.parse(fs.readFileSync(new URL(`./contracts/${name}.schema.json`, import.meta.url), 'utf8'))]));

export function computeV2AxisInputShas(root, run) {
  return Object.fromEntries(loadBoundQuestionBanks(root, run).map(q => {
    const declared = run.questions.find(row => row.questionUid === q.questionUid);
    return [q.questionUid, Object.fromEntries(requiredAxesForQuestion(profiles.pipelines[run.pipeline], declared, run).map(axis => [axis, axisInputSha(q, axis, projectionContext(root, run, q, axis))]))];
  }));
}

function projectionContext(root, run, question, axis) {
  const declaredQuestion = run.questions.find(q => q.questionUid === question.questionUid);
  const dependencies = run.inputs.filter(ref => !['source', 'candidate', 'rule', 'verifier'].includes(ref.role)).filter(ref => {
    if (ref.role !== 'asset') return true;
    const owners = run.questions.filter(q => [...(q.problemAssetPaths || []), ...(q.solutionAssetPaths || [])].includes(ref.path));
    if (!owners.length) return true;
    return (AXIS_INPUT_PROJECTION_MAP[axis]?.includes('PROBLEM_ASSETS') && declaredQuestion.problemAssetPaths?.includes(ref.path)) || (AXIS_INPUT_PROJECTION_MAP[axis]?.includes('SOLUTION_ASSETS') && declaredQuestion.solutionAssetPaths?.includes(ref.path));
  }).map(ref => {
    readBoundFile(root, ref);
    const declared = run.semanticDependencyBindings?.[ref.path];
    const scoped = ['QUESTION', 'AXIS'].includes(declared?.ownership) && declared.questionUids?.length && declared.questionUids.every(uid => run.questions.some(q => q.questionUid === uid)) && declared.authorityRef;
    if (scoped) {
      const classification = load(root, declared.authorityRef);
      if (classification.status !== 'APPROVED' || classification.dependencySha !== ref.sha256 || !same(classification.questionUids, declared.questionUids)) throw new Error('DEPENDENCY_OWNERSHIP_UNPROVEN');
    }
    return { ...ref, ownership: scoped ? declared.ownership : 'GLOBAL', questionUids: scoped ? declared.questionUids : [] };
  }).filter(ref => !['QUESTION', 'AXIS'].includes(ref.ownership) || ref.questionUids.includes(question.questionUid));
  const rules = run.inputs.filter(ref => ref.role === 'rule'), verifiers = run.inputs.filter(ref => ref.role === 'verifier');
  for (const ref of [...rules, ...verifiers]) readBoundFile(root, ref);
  const sourceAuthority = { sourceRecord: question.sourceRecord, sourceExamId: question.sourceExamId, registryEntrySha: run.uidAuthority?.sourceExamIdRegistryEntrySha || null, repair: run.sourceAuthority?.approvedSourceRepairLedgerRef || null, exception: run.sourceAuthority?.approvedSourceExceptionLedgerRef || null };
  const frozen = {};
  for (const [name, evidenceAxis] of [['A1', 'MATH_A1'], ['V1', 'V1'], ['V2', 'V2']]) {
    if (!AXIS_INPUT_PROJECTION_MAP[axis]?.includes(`${name}_FROZEN`)) continue;
    // Bind upstream semantic inputs; exact frozen output hashes remain checked by the semantic kernel.
    frozen[name] = axisInputSha(question, evidenceAxis, projectionContext(root, run, question, evidenceAxis));
  }
  return { frozen, dependencies: { shared: dependencies }, dependencySetSha: objectSha(dependencies), ruleDependencySetSha: objectSha(rules), verifierDependencySetSha: objectSha({ verifiers, coreSha: CORE_SHA }), sourceAuthority, sourceAuthoritySliceSha: objectSha(sourceAuthority), renderPolicy: run.releaseRenderPolicy || run.releasePolicy || null, runtime: axis === 'RENDER_CAPTURE' ? { bundle: run.renderRuntime || null, captureRunId: run.runId, captureRevision: run.revision } : run.renderRuntime || null };
}

function bindAuthority(root, run) {
  const source = run.sourceAuthority, authority = run.uidAuthority;
  if (!source?.sourceTruthRefs?.length || !source.activeBaselineRef || source.activeBaselineSha !== source.activeBaselineRef.sha256 || source.sourceTruthBundleSha !== objectSha(source.sourceTruthRefs)) throw new Error('SOURCE_AUTHORITY_REQUIRED');
  for (const ref of [...source.sourceTruthRefs, source.activeBaselineRef]) readBoundFile(root, ref);
  for (const ref of run.inputs.filter(ref => ref.role === 'source')) if (!source.sourceTruthRefs.some(truth => truth.path === ref.path && truth.sha256 === ref.sha256)) throw new Error('SOURCE_TRUTH_INPUT_PARITY');
  for (const key of ['baselineDiscoveryEvidenceRef', 'approvedSourceRepairLedgerRef', 'approvedSourceExceptionLedgerRef']) {
    const applicability = source.applicability?.[key];
    if (!['REQUIRED', 'NOT_APPLICABLE'].includes(applicability?.status)) throw new Error(`SOURCE_APPLICABILITY_REQUIRED:${key}`);
    const evidence = load(root, applicability.status === 'REQUIRED' ? source[key] : applicability.evidenceRef);
    if (!['PASS', 'APPROVED'].includes(evidence.status) || evidence.sourceTruthBundleSha !== source.sourceTruthBundleSha || (applicability.status === 'NOT_APPLICABLE' && (!nonempty(applicability.reason) || evidence.applicability !== 'NOT_APPLICABLE'))) throw new Error(`SOURCE_AUTHORITY_EVIDENCE_INVALID:${key}`);
  }
  const registry = normalizeSourceExamIdRegistry(load(root, authority?.sourceExamIdRegistryRef));
  if (validateSchema(registry, contracts['source-exam-id-registry-v1']).length) throw new Error('SOURCE_REGISTRY_CONTRACT_INVALID');
  const selected = registry.entries.filter(entry => run.questions.some(q => q.sourcePath === entry.sourcePath && q.sourceExamId === entry.sourceExamId));
  if (objectSha(selected) !== authority.sourceExamIdRegistryEntrySha) throw new Error('REGISTRY_ENTRY_SHA_MISMATCH');
  if (!Array.isArray(authority.uidMigrationEvidenceRefs) || objectSha(authority.uidMigrationEvidenceRefs) !== authority.uidMigrationEvidenceSetSha) throw new Error('MIGRATION_SET_SHA_MISMATCH');
  const migrations = authority.uidMigrationEvidenceRefs.map(ref => load(root, ref));
  for (const q of run.questions) {
    const entries = selected.filter(entry => entry.questionUidV2 === q.questionUid && entry.sourcePath === q.sourcePath && entry.status === 'ACTIVE');
    if (entries.length !== 1 || q.sourceQuestionOrdinal !== q.qid) throw new Error(`UID_AUTHORITY_MAPPING:${q.questionUid}`);
    if (q.legacyQuestionUid) {
      const matches = migrations.filter(e => e.questionUidV2 === q.questionUid);
      if (matches.length !== 1 || validateUidMigrationEvidence(matches[0], { legacyQuestionUid: q.legacyQuestionUid, questionUidV2: q.questionUid, sourcePath: q.sourcePath, sourceSha256: run.inputs.find(ref => ref.path === q.sourcePath)?.sha256 }).status !== 'PASS') throw new Error(`UID_MIGRATION_REQUIRED:${q.questionUid}`);
    }
  }
}

function validateEvidenceLifecycle(root, run, evidenceRefs) {
  const errors = [];
  const activeRefs = new Set((run.evidence || []).map(ref => `${ref.path}|${ref.sha256}`));
  for (const row of run.evidenceLifecycle || []) {
    try {
      if (row?.schemaVersion !== 'APMATH_EVIDENCE_LIFECYCLE_v1' || row.status !== 'INVALIDATED' || !row.evidenceRef?.path || row.evidenceSha !== row.evidenceRef.sha256 || activeRefs.has(`${row.evidenceRef.path}|${row.evidenceRef.sha256}`)) throw new Error('EVIDENCE_LIFECYCLE_INVALID');
      const evidence = JSON.parse(readBoundFile(root, row.evidenceRef));
      if (evidence.evidenceId !== row.evidenceId || evidence.axis !== row.axis || evidence.questionUid !== row.questionUid) throw new Error('EVIDENCE_LIFECYCLE_IDENTITY_MISMATCH');
      if (row.currentArtifactSha && evidence.payload?.currentArtifactSha === row.currentArtifactSha) throw new Error('EVIDENCE_LIFECYCLE_NOT_STALE');
      if (evidenceRefs.some(ref => ref.path === row.evidenceRef.path && ref.sha256 === row.evidenceRef.sha256)) throw new Error('INVALIDATED_EVIDENCE_REUSED');
    } catch (error) { errors.push(`${error.message}:${row?.evidenceId || 'UNKNOWN'}`); }
  }
  return errors;
}

export function auditV2Run(root, run) {
  const errors = [], freshness = [];
  let semantic = null, changeImpact = null, editClosure = null, closureSetSha = null, renderImpact = null;
  try {
    const schemaErrors = validateSchema(run, contracts['run-v2']);
    if (schemaErrors.length) throw new Error(`RUN_V2_CONTRACT:${schemaErrors.join(';')}`);
    if (run?.schemaVersion !== RUN_VERSION_V2 || !profiles.pipelines[run.pipeline] || !Number.isSafeInteger(run.revision) || run.revision < 1 || !run.questions?.length || !run.inputs?.length || ![run.runId, run.builderId, run.builderSessionId, run.builderModelOrAgent].every(nonempty)) throw new Error('RUN_V2_SCHEMA_INVALID');
    for (const ref of run.inputs) readBoundFile(root, ref);
    if (run.inputSha !== runInputSha(run)) throw new Error('RUN_V2_INPUT_SHA_STALE');
    const budget = readWorkBatch(root, run.workBatchId);
    if (!budget.freezes.some(f => f.bindings.some(b => b.runId === run.runId && b.inputSha === run.inputSha && b.revision === run.revision))) throw new Error('WORK_BATCH_FREEZE_REQUIRED');
    bindAuthority(root, run);
    const actual = loadBoundQuestionBanks(root, run);
    const required = Object.fromEntries(run.questions.map(q => [q.questionUid, requiredAxesForQuestion(profiles.pipelines[run.pipeline], q, run)]));
    const contexts = Object.fromEntries(actual.map(q => [q.questionUid, Object.fromEntries(required[q.questionUid].map(axis => [axis, projectionContext(root, run, q, axis)]))]));
    const axisShas = Object.fromEntries(actual.map(q => [q.questionUid, Object.fromEntries(required[q.questionUid].map(axis => [axis, axisInputSha(q, axis, contexts[q.questionUid][axis])]))]));
    let previous = null, before = [], previousAxisShas = {}, predecessorClosure = null;
    if (run.revision > 1) {
      const p = run.predecessor;
      previous = load(root, p?.runRef); predecessorClosure = load(root, p?.closureSetRef);
      const record = run.registry?.find(row => row.recordId === run.canonicalRecordId), priorRecord = run.registry?.find(row => row.recordId === record?.supersedes);
      if (!priorRecord || priorRecord.isCanonical || priorRecord.batchId !== p.runId || priorRecord.revision !== p.revision || priorRecord.inputSha !== p.inputSha || previous.runId !== p.runId || previous.revision !== p.revision || previous.inputSha !== p.inputSha || p.revision !== run.revision - 1 || p.runId !== run.runId || predecessorClosure.closureSetSha !== p.closureSetSha || !same(p.candidateRefs, previous.inputs.filter(ref => ref.role === 'candidate'))) throw new Error('CANONICAL_PREDECESSOR_IDENTITY_INVALID');
      if (validateQuestionQualityClosureSet(predecessorClosure, { runId: previous.runId, revision: previous.revision, currentRunInputSha: previous.inputSha, questionUids: previous.questions.map(q => q.questionUid) }).status !== 'PASS') {
        // A completed auditor may return defects. Only independently revalidated PASS axes may be reused.
        if (!p.partialAuditRef || previous.revision !== 1) throw new Error('PREDECESSOR_CLOSURE_INVALID');
        const saved = load(root, p.partialAuditRef), recomputed = auditV2Run(root, previous);
        if (saved.runId !== previous.runId || saved.revision !== previous.revision || saved.inputSha !== previous.inputSha || saved.status !== 'BLOCKED' || !same(saved.freshness, recomputed.freshness) || !saved.freshness?.length) throw new Error('PARTIAL_PREDECESSOR_AUDIT_UNPROVEN');
        for (const closure of predecessorClosure.closures || []) for (const [axis, row] of Object.entries(closure.axes || {})) if (!recomputed.freshness.some(f => f.questionUid === closure.questionUid && f.axis === axis && f.status === 'PASS' && f.evidenceId === row.evidenceId && f.evidenceSha === row.evidenceSha)) delete closure.axes[axis];
      }
      before = loadBoundQuestionBanks(root, previous);
      previousAxisShas = Object.fromEntries(before.map(q => [q.questionUid, Object.fromEntries((required[q.questionUid] || []).map(axis => [axis, axisInputSha(q, axis, projectionContext(root, previous, q, axis))]))]));
    } else if (run.predecessor) throw new Error('INITIAL_PREDECESSOR_FORBIDDEN');
    const runHash = runLevelSemanticHash(run, actual);
    const diff = semanticDiff(before, actual, { previousDependencies: previous ? { runLevel: runLevelSemanticHash(previous, before) } : {}, currentDependencies: { runLevel: runHash } });
    changeImpact = changeImpactMap(diff, actual, { previousAxisInputShas: previousAxisShas, currentAxisInputShas: axisShas });
    const affected = new Map(changeImpact.affectedUidAxisSet.filter(row => required[row.questionUid]?.includes(row.axis)).map(row => [pairKey(row), row]));
    for (const q of run.questions) for (const axis of required[q.questionUid]) if (!previous || previousAxisShas[q.questionUid]?.[axis] !== axisShas[q.questionUid][axis]) affected.set(pairKey({ questionUid: q.questionUid, axis }), { questionUid: q.questionUid, axis, action: 'RECHECK', reasonCodes: ['AXIS_INPUT_CHANGED'] });
    if (run.predecessor?.partialAuditRef) for (const q of run.questions) for (const axis of required[q.questionUid]) if (!MACHINE_AXES.includes(axis) && !predecessorClosure?.closures?.find(c => c.questionUid === q.questionUid)?.axes?.[axis]) affected.set(pairKey({ questionUid: q.questionUid, axis }), { questionUid: q.questionUid, axis, action: 'RECHECK', reasonCodes: ['PRIOR_AXIS_NOT_ACCEPTED'] });
    changeImpact.affectedUidAxisSet = [...affected.values()].sort((a, b) => pairKey(a).localeCompare(pairKey(b)));
    changeImpact.affectedUidSet = [...new Set(changeImpact.affectedUidAxisSet.map(row => row.questionUid))].sort();
    changeImpact.affectedUidAxisSetSha = objectSha(changeImpact.affectedUidAxisSet);
    changeImpact.changeImpactSha = objectSha({ predecessor: run.predecessor || null, runLevelSemanticHash: runHash, changedUidSet: diff.changedUidSet, affectedUidAxisSet: changeImpact.affectedUidAxisSet });
    const evidence = new Map(), evidenceRefs = new Map();
    for (const ref of run.evidence || []) { const e = load(root, ref); errors.push(...validateSchema(e, contracts['evidence-v2'])); if (evidence.has(e.evidenceId)) throw new Error('DUPLICATE_EVIDENCE_ID'); evidence.set(e.evidenceId, e); evidenceRefs.set(e.evidenceId, ref); }
    errors.push(...validateEvidenceLifecycle(root, run, [...evidenceRefs.values()]));
    const receipts = (run.reuseReceipts || []).map(ref => load(root, ref)), packets = (run.auditorPacketRefs || []).map(ref => load(root, ref));
    for (const receipt of receipts) errors.push(...validateSchema(receipt, contracts['reuse-receipt-v1']));
    for (const ref of run.renderReviewReuseReceiptRefs || []) errors.push(...validateSchema(load(root, ref), contracts['render-review-reuse-receipt-v1']));
    const captureRows = [...evidence.values()].filter(e => e.axis === 'RENDER_CAPTURE').flatMap(e => e.payload?.itemWitnesses || []);
    if (captureRows.length && previous) {
      const oldRows = (previous.evidence || []).map(ref => load(root, ref)).filter(e => e.axis === 'RENDER_CAPTURE').flatMap(e => e.payload?.itemWitnesses || []);
      renderImpact = detectRenderImpact(oldRows, captureRows, { globalDependencies: same(previous.renderRuntime, run.renderRuntime) && same(previous.releasePolicy, run.releasePolicy) ? [] : ['runtime-or-release-policy'] });
      if (run.renderImpactSha && run.renderImpactSha !== renderImpact.impactSha) errors.push('DECLARED_RENDER_IMPACT_MISMATCH');
      for (const uid of renderImpact.affectedRenderUidSet) if (required[uid]?.includes('RENDER_REVIEW')) affected.set(pairKey({ questionUid: uid, axis: 'RENDER_REVIEW' }), { questionUid: uid, axis: 'RENDER_REVIEW', action: 'RECHECK', reasonCodes: ['ACTUAL_RENDER_WITNESS_CHANGED'] });
    }
    if (run.predecessor?.partialAuditRef) for (const q of run.questions) for (const axis of required[q.questionUid]) if (!MACHINE_AXES.includes(axis) && !predecessorClosure?.closures?.find(c => c.questionUid === q.questionUid)?.axes?.[axis]) affected.set(pairKey({ questionUid: q.questionUid, axis }), { questionUid: q.questionUid, axis, action: 'RECHECK', reasonCodes: ['PRIOR_AXIS_NOT_ACCEPTED'] });
    changeImpact.affectedUidAxisSet = [...affected.values()].sort((a, b) => pairKey(a).localeCompare(pairKey(b)));
    changeImpact.affectedUidSet = [...new Set(changeImpact.affectedUidAxisSet.map(row => row.questionUid))].sort();
    changeImpact.affectedUidAxisSetSha = objectSha(changeImpact.affectedUidAxisSet);
    changeImpact.reusableUidAxisSet = run.questions.flatMap(q => required[q.questionUid].filter(axis => !affected.has(pairKey({ questionUid: q.questionUid, axis }))).map(axis => ({ questionUid: q.questionUid, axis })));
    changeImpact.changeImpactSha = objectSha({ predecessor: run.predecessor || null, runLevelSemanticHash: runHash, changedUidSet: diff.changedUidSet, affectedUidAxisSet: changeImpact.affectedUidAxisSet, renderImpactSha: renderImpact?.impactSha || null });
    for (const [key, value] of Object.entries({ changedUidSet: diff.changedUidSet, affectedUidSet: changeImpact.affectedUidSet, affectedUidAxisSet: changeImpact.affectedUidAxisSet, changeImpactSha: changeImpact.changeImpactSha, runLevelSemanticHash: runHash })) if (run[key] !== undefined && !same(run[key], value)) errors.push(`DECLARED_IMPACT_MISMATCH:${key}`);
    const contextUids = new Set();
    for (const ref of run.contextDependencyRefs || []) {
      const dependency = load(root, ref);
      if (dependency.status !== 'APPROVED' || !dependency.sourceUidSet?.some(uid => changeImpact.affectedUidSet.includes(uid)) || !Array.isArray(dependency.contextUidSet)) throw new Error('PROMPT_CONTEXT_DEPENDENCY_UNPROVEN');
      for (const uid of dependency.contextUidSet) { if (!run.questions.some(q => q.questionUid === uid)) throw new Error('CONTEXT_DEPENDENCY_UID_UNKNOWN'); contextUids.add(uid); }
    }
    if (!same([...(run.declaredContextDependencyUidSet || [])].sort(), [...contextUids].sort())) errors.push('DECLARED_CONTEXT_DEPENDENCY_PARITY');
    const candidateContext = packets.some(packet => packet.phase === 'U3') ? loadCandidateReviewContext(root, run) : null;
    for (const packet of packets) errors.push(...validateAuditorPacket(packet, { affectedUidSet: changeImpact.affectedUidSet, declaredContextDependencyUidSet: [...contextUids], builderId: run.builderId, builderSessionId: run.builderSessionId, candidateContext }).errors);
    for (const q of run.questions) {
      if (!same(q.requiredAxes, required[q.questionUid])) errors.push(`REQUIRED_AXES_EXACT_PARITY:${q.questionUid}`);
      if (!same(q.axisInputShas, axisShas[q.questionUid])) errors.push(`DECLARED_AXIS_SHA_MISMATCH:${q.questionUid}`);
      if (q.visual?.requirement === 'VISUAL_RECOMMENDED') errors.push(`V2_VISUAL_RECOMMENDED_FORBIDDEN:${q.questionUid}`);
      if (q.visual?.requirement === 'VISUAL_OPTIONAL' && q.visual.origin === 'LEGACY_VISUAL_RECOMMENDED') {
        const migration = load(root, q.visual.migrationEvidenceRef);
        if (migration.schemaVersion !== 'APMATH_VISUAL_OPTIONAL_MIGRATION_v1' || migration.questionUid !== q.questionUid || migration.from !== 'VISUAL_RECOMMENDED' || migration.to !== 'VISUAL_OPTIONAL' || migration.status !== 'APPROVED') errors.push(`VISUAL_OPTIONAL_MIGRATION_REQUIRED:${q.questionUid}`);
      }
      if (q.visual?.requirement === 'VISUAL_OPTIONAL' && !['NATIVE', 'LEGACY_VISUAL_RECOMMENDED'].includes(q.visual.origin)) errors.push('VISUAL_OPTIONAL_ORIGIN_REQUIRED');
      for (const axis of required[q.questionUid]) {
        const e = evidence.get(q.evidence?.[axis]);
        if (!e || e.axis !== axis || (e.questionUid !== q.questionUid && !(['RENDER_CAPTURE', 'RENDER_REVIEW'].includes(axis) && e.payload?.questionUids?.includes(q.questionUid)))) { errors.push(`EVIDENCE_SCOPE:${q.questionUid}:${axis}`); continue; }
        const matches = receipts.filter(r => r.questionUid === q.questionUid && r.axis === axis);
        if (matches.length > 1) errors.push(`DUPLICATE_REUSE_RECEIPT:${q.questionUid}:${axis}`);
        const receipt = matches[0], context = contexts[q.questionUid][axis];
        const rootEvidence = receipt ? load(root, receipt.rootFreshEvidenceRef) : null, eligibility = receipt ? load(root, receipt.eligibilityEvidenceRef) : null;
        if (receipt) {
          const lifecycle = load(root, receipt.lifecycleSnapshotRef);
          if (lifecycle.currentRunId !== run.runId || lifecycle.currentRevision !== run.revision || lifecycle.currentRunInputSha !== run.inputSha || lifecycle.rootFreshEvidenceSha !== receipt.rootFreshEvidenceSha || !same(lifecycle.eligibility, Object.fromEntries(Object.entries(eligibility).filter(([key]) => key !== 'lifecycleSnapshotSha')))) errors.push('LIFECYCLE_ELIGIBILITY_SNAPSHOT_BINDING');
          const rootRun = load(root, receipt.rootFreshRunRef), rootPacket = load(root, receipt.rootFreshPacketRef);
          if (rootRun.runId !== receipt.rootFreshRunId || rootRun.inputSha !== receipt.rootFreshRunInputSha || rootRun.inputSha !== runInputSha(rootRun) || !rootRun.evidence?.some(ref => ref.sha256 === receipt.rootFreshEvidenceSha)) errors.push('ROOT_FRESH_RUN_BINDING');
          errors.push(...validateFreshEvidenceIndependence(rootEvidence, rootRun, rootPacket), ...validateWorkBatchEvidence(root, rootRun, rootEvidence));
          errors.push(...validateAuditorPacket(rootPacket, { affectedUidSet: rootRun.questions.map(q => q.questionUid), builderId: rootRun.builderId, builderSessionId: rootRun.builderSessionId, candidateContext: rootPacket.phase === 'U3' ? loadCandidateReviewContext(root, rootRun) : null }).errors);
        }
        const scopedEvidence = ['RENDER_CAPTURE', 'RENDER_REVIEW'].includes(axis) ? { ...e, questionUid: q.questionUid, axisInputSha: e.axisInputShas?.[q.questionUid] } : e;
        const scopedRoot = rootEvidence && ['RENDER_CAPTURE', 'RENDER_REVIEW'].includes(axis) ? { ...rootEvidence, questionUid: q.questionUid, axisInputSha: rootEvidence.axisInputShas?.[q.questionUid] } : rootEvidence;
        const f = validateEvidenceFreshness(scopedEvidence, { currentRunInputSha: run.inputSha, currentAxisInputSha: axisShas[q.questionUid][axis], reuseReceipt: receipt, reuseContext: { priorEvidence: scopedEvidence, priorEvidenceId: e.evidenceId, priorEvidenceSha: evidenceRefs.get(e.evidenceId).sha256, priorRunInputSha: e.inputSha, currentRunId: run.runId, currentRevision: run.revision, dependencySetSha: context.dependencySetSha, ruleDependencySetSha: context.ruleDependencySetSha, semanticVerifierSha: context.verifierDependencySetSha, sourceAuthoritySliceSha: context.sourceAuthoritySliceSha, lifecycleSnapshotSha: receipt?.lifecycleSnapshotRef?.sha256, rootFreshEvidence: scopedRoot, rootFreshEvidenceSha: receipt?.rootFreshEvidenceRef?.sha256, eligibility } });
        const rowErrors = [...f.errors, ...validateTypedEvidence(e)];
        if (axis === 'SOURCE' && e.payload.sourceTruthBundleSha !== run.sourceAuthority.sourceTruthBundleSha) rowErrors.push('SOURCE_TYPED_AUTHORITY_BINDING');
        if (axis === 'STATIC' && e.payload.checkedInputSha !== run.inputSha) rowErrors.push('STATIC_TYPED_INPUT_BINDING');
        if (axis === 'METADATA' && e.payload.metadataInputSha !== axisShas[q.questionUid][axis]) rowErrors.push('METADATA_TYPED_AXIS_BINDING');
        if (f.mode !== (MACHINE_AXES.includes(axis) ? 'MACHINE_CURRENT' : affected.has(pairKey({ questionUid: q.questionUid, axis })) ? 'FRESH' : 'REUSED')) rowErrors.push('EDIT_FRESH_REUSE_PARTITION_MISMATCH');
        if (f.mode === 'MACHINE_CURRENT') {
          rowErrors.push(...validateMachineEvidence(e, run));
        } else if (f.mode === 'FRESH') {
          if (e.runId !== run.runId || e.revision !== run.revision || e.reviewStartInputSha !== run.inputSha || e.reviewEndInputSha !== run.inputSha || e.mode !== 'FRESH') rowErrors.push('FRESH_RUN_BINDING_INVALID');
          rowErrors.push(...validateFreshEvidenceIndependence(e, run, packets.find(p => p.packetSha === e.reviewIsolationProvenanceSha)), ...validateWorkBatchEvidence(root, run, e));
        } else {
          const priorAxis = predecessorClosure?.closures?.find(c => c.questionUid === q.questionUid)?.axes?.[axis];
          if (!priorAxis || priorAxis.evidenceId !== e.evidenceId || priorAxis.evidenceSha !== evidenceRefs.get(e.evidenceId).sha256) rowErrors.push('REUSE_NOT_CANONICAL_PREDECESSOR');
        }
        freshness.push({ questionUid: q.questionUid, axis, mode: f.mode, evidenceId: e.evidenceId, evidenceSha: evidenceRefs.get(e.evidenceId).sha256, receiptSha: f.receiptSha || null, axisInputSha: axisShas[q.questionUid][axis], status: rowErrors.length ? 'BLOCKED' : 'PASS', errors: rowErrors });
        errors.push(...rowErrors.map(error => `${q.questionUid}:${axis}:${error}`));
      }
      const u1 = evidence.get(q.evidence?.V1), u2 = evidence.get(q.evidence?.V2);
      if (u1 && u2 && (u1.reviewSessionId === u2.reviewSessionId || (u1.auditorPrincipalType === 'HUMAN' || u2.auditorPrincipalType === 'HUMAN') && u1.reviewerId === u2.reviewerId)) errors.push(`U1_U2_ISOLATION:${q.questionUid}`);
      if (u1 && u2) {
        const packetFor = e => packets.find(p => p.packetSha === e.reviewIsolationProvenanceSha) || (() => { const receipt = receipts.find(r => r.rootFreshEvidenceId === e.evidenceId); return receipt ? load(root, receipt.rootFreshPacketRef) : null; })();
        const first = packetFor(u1), second = packetFor(u2);
        if (!first || !second || first.contextId === second.contextId || first.phase !== 'U1' || second.phase !== 'U2') errors.push(`U1_U2_SEALED_CONTEXT_COLLISION:${q.questionUid}`);
      }
      if (requiresSolutionVisualBenefitGate(required[q.questionUid], diff.changedFieldMap[q.questionUid] || [], evidence.get(q.evidence?.V3))) errors.push(`SOLUTION_VISUAL_BENEFIT_GATE:${q.questionUid}`);
    }
    const ledger = (run.buildWorkLedgerRefs || []).map(ref => load(root, ref));
    for (const entry of ledger) errors.push(...validateSchema(entry, contracts['build-work-ledger-v1']));
    for (const uid of changeImpact.affectedUidSet) {
      const entries = ledger.filter(entry => entry.questionUid === uid);
      if (entries.length !== 1) errors.push(`BUILD_LEDGER_COVERAGE:${uid}`);
      else errors.push(...validateBuildWorkLedgerEntry(entries[0], { root, run, freshness, evidence }).errors);
    }
    const renderFreshness = [];
    for (const e of evidence.values()) if (['RENDER_CAPTURE', 'RENDER_REVIEW'].includes(e.axis) && !freshness.some(row => row.evidenceId === e.evidenceId)) {
      const renderErrors = e.axis === 'RENDER_CAPTURE' ? validateMachineEvidence(e, run) : [...validateFreshEvidenceIndependence(e, run, packets.find(p => p.packetSha === e.reviewIsolationProvenanceSha)), ...validateWorkBatchEvidence(root, run, e)];
      if (e.schemaVersion !== 'APMATH_PIPELINE_EVIDENCE_v2' || e.mode !== (e.axis === 'RENDER_CAPTURE' ? 'MACHINE_CURRENT' : 'FRESH') || e.runId !== run.runId || e.revision !== run.revision || e.inputSha !== run.inputSha || e.reviewStartInputSha !== run.inputSha || e.reviewEndInputSha !== run.inputSha || !e.payload?.questionUids?.length) renderErrors.push('RENDER_FRESH_RUN_BINDING');
      for (const uid of e.payload?.questionUids || []) if (!axisShas[uid] || e.axisInputShas?.[uid] !== axisShas[uid][e.axis]) renderErrors.push('RENDER_AXIS_SHA_BINDING');
      renderFreshness.push({ evidenceId: e.evidenceId, evidenceSha: evidenceRefs.get(e.evidenceId).sha256, status: renderErrors.length ? 'BLOCKED' : 'PASS' });
      errors.push(...renderErrors);
    }
    semantic = auditSemanticKernel(root, run, [...freshness, ...renderFreshness]); errors.push(...semantic.errors);
    const closure = load(root, run.questionQualityClosureSetRef);
    errors.push(...validateSchema(closure, contracts['question-quality-closure-v2']));
    const quality = validateQuestionQualityClosureSet(closure, { runId: run.runId, revision: run.revision, currentRunInputSha: run.inputSha, questionUids: run.questions.map(q => q.questionUid), requiredAxesByUid: required, freshness });
    errors.push(...quality.errors); closureSetSha = quality.closureSetSha;
    { // Both REQUIRED and canonical NOT_APPLICABLE closures are mandatory.
      const release = load(root, run.examReleaseClosureRef);
      errors.push(...validateSchema(release, contracts['exam-release-v1']));
      errors.push(...validateExamReleaseClosure(release, { root, run, semantic, evidence, evidenceRefs, qualityClosureSetSha: closureSetSha }).errors);
    }
    const payload = { schemaVersion: 'APMATH_EDIT_CLOSURE_v1', runId: run.runId, revision: run.revision, inputSha: run.inputSha, predecessor: run.predecessor || null, changeImpactSha: changeImpact.changeImpactSha, requiredUidAxisSet: run.questions.flatMap(q => required[q.questionUid].map(axis => ({ questionUid: q.questionUid, axis }))), axes: freshness, closureSetSha, productionAuthorized: false, status: errors.length ? 'BLOCKED' : 'PASS' };
    if (freshness.length !== payload.requiredUidAxisSet.length || new Set(freshness.map(pairKey)).size !== freshness.length) errors.push('EDIT_CLOSURE_COVERAGE_INCOMPLETE');
    payload.status = errors.length ? 'BLOCKED' : 'PASS';
    editClosure = { ...payload, editClosureSha: objectSha(payload) };
    if (run.editClosureRef && !same(load(root, run.editClosureRef), editClosure)) errors.push('EDIT_CLOSURE_DECLARATION_MISMATCH');
    for (const ref of [...run.inputs, ...(run.evidence || [])]) readBoundFile(root, ref);
  } catch (error) { errors.push(`V2_CONTRACT:${error.message}`); }
  const cost = workBatchMetrics(root, run, freshness);
  if (cost.agentBudgetStatus === 'HOLD') errors.push('AGENT_BUDGET_HOLD');
  return { cost, schemaVersion: 'APMATH_PIPELINE_AUDIT_v2', runId: run?.runId || null, revision: run?.revision || null, inputSha: run?.inputSha || null, status: errors.length ? 'BLOCKED' : 'PASS', productionAuthorized: false, diagnosticContinuation: semantic?.diagnosticContinuation || { status: errors.length ? 'UPSTREAM_BLOCKED' : 'NOT_NEEDED', downstreamObserved: Boolean(semantic) }, errors, freshness, semantic, changeImpact, renderImpact, editClosure, closureSetSha };
}
