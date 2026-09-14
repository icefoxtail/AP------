import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileRef, safePath, writeNewJson, objectSha, readBoundFile } from './canonical.mjs';
import { profiles, RUN_VERSION, RUN_VERSION_V2, runInputSha } from './closure.mjs';
import { legacyQuestionUid, normalizeSourceExamIdRegistry, questionUidV2, createUidMigrationEvidence } from './question-uid.mjs';
import { requiredAxesForQuestion } from './projection.mjs';
import { computeV2AxisInputShas } from './v2-audit.mjs';
import { rulePreflight } from './rulepack.mjs';
import { addRuntimeInputs, runtimeDependencyBundle } from './runtime.mjs';
import { assertBuilderStart } from '../past-exam-pipeline/lib/calibration.mjs';
import { solutionQualityDraft } from './solution-quality.mjs';
import { visualBenefitDraft } from './solution-visual-benefit.mjs';
import { evaluateGoldSourceEligibility } from './gold-contract.mjs';

export function prepareDraft(root, { pipeline, runId, sourcePath, candidatePath, workdir, schemaVersion = RUN_VERSION, builderId = null, builderSessionId = null, builderModelOrAgent = null, sourceExamIdRegistryRef = null, workBatchId = null, pastExamManifestPath = null, assetRoot = null, sourceAssetRoot = null, benchmarkKind = null }) {
  if (!profiles.pipelines[pipeline] || !/^[A-Za-z0-9_-]+$/.test(runId || '')) throw new Error('PIPELINE_AND_RUN_ID_REQUIRED');
  let pastManifest = null;
  let calibrationStart = null;
  const pastSourceRefs = [];
  if (pipeline === 'past-exam') {
    if (!pastExamManifestPath || schemaVersion !== RUN_VERSION_V2) throw new Error('BUILDER_START_BLOCKED:PAST_EXAM_V3_MANIFEST_AND_CORE_V2_REQUIRED');
    pastManifest = JSON.parse(fs.readFileSync(path.resolve(root, pastExamManifestPath), 'utf8'));
    calibrationStart = assertBuilderStart(root, pastManifest);
    const lock = JSON.parse(fs.readFileSync(pastManifest.referenceSampleLock.path, 'utf8'));
    if (lock.readerId !== builderId || lock.readerSessionId !== builderSessionId) throw new Error('BUILDER_START_BLOCKED:CALIBRATION_READER_BUILDER_MISMATCH');
  }
  const v2 = schemaVersion === RUN_VERSION_V2;
  const stableRegistry = v2 ? normalizeSourceExamIdRegistry(JSON.parse(readBoundFile(root, sourceExamIdRegistryRef))) : null;
  const sourceEntries = stableRegistry?.entries.filter(entry => entry.sourcePath === sourcePath && entry.status === 'ACTIVE') || [];
  if (v2 && (!sourceEntries.length || new Set(sourceEntries.map(entry => entry.canonicalSourceExamId)).size !== 1)) throw new Error('ONE_ACTIVE_CANONICAL_SOURCE_EXAM_REQUIRED');
  if (![RUN_VERSION, RUN_VERSION_V2].includes(schemaVersion)) throw new Error('UNSUPPORTED_PIPELINE_SCHEMA');
  if (v2 && (![builderId, builderSessionId, builderModelOrAgent].every(value => typeof value === 'string' && value.trim()))) throw new Error('V2_BUILDER_IDENTITY_REQUIRED');
  const destination = safePath(root, workdir, { mustExist: false });
  if (fs.existsSync(destination)) throw new Error('NEW_RUN_DIRECTORY_REQUIRED');
  for (const protectedRoot of ['archive/exams', 'archive/assets']) {
    const protectedPath = path.resolve(root, protectedRoot);
    if (destination === protectedPath || destination.startsWith(`${protectedPath}${path.sep}`) || protectedPath.startsWith(`${destination}${path.sep}`)) throw new Error('PRODUCTION_WORKDIR_FORBIDDEN');
  }
  const rulePack = rulePreflight(root);
  if (rulePack.status !== 'PASS') throw new Error(rulePack.errors.join(';'));
  const load = relative => { const context = { window: {} }; vm.runInNewContext(fs.readFileSync(safePath(root, relative), 'utf8'), context, { timeout: 1000 }); return JSON.parse(JSON.stringify(context.window)); };
  const source = load(sourcePath), candidate = load(candidatePath);
  if (!Array.isArray(source.questionBank) || !Array.isArray(candidate.questionBank) || !candidate.questionBank.length || !source.examTitle) throw new Error('JS_BANK_REQUIRED');
  if (new Set(candidate.questionBank.map(q => q.id)).size !== candidate.questionBank.length) throw new Error('DUPLICATE_CANDIDATE_ID');
  if (sourcePath === candidatePath) throw new Error('SOURCE_AND_CANDIDATE_MUST_BE_SEPARATE');
  const sourceInputRef = { ...fileRef(root, sourcePath), role: 'source' };
  const candidateInputRef = { ...fileRef(root, candidatePath), role: 'candidate' };
  const run = { schemaVersion, status: 'DRAFT_NOT_REVIEWED', pipeline, runId, revision: 1, builderId: v2 ? builderId : null, builderSessionId: v2 ? builderSessionId : null, builderModelOrAgent: v2 ? builderModelOrAgent : null, canonicalRecordId: `${runId}:r1`, inputs: [sourceInputRef, candidateInputRef, ...rulePack.refs], questions: [], evidence: [], registry: [], denominator: { status: 'UNFROZEN', stale: true }, inputSha: null };
  if (v2) {
    run.sourceAuthority = { sourceTruthRefs: [], sourceTruthBundleSha: objectSha([]), activeBaselineRef: null, activeBaselineSha: null, baselineDiscoveryEvidenceRef: null, approvedSourceRepairLedgerRef: null, approvedSourceExceptionLedgerRef: null };
    run.uidAuthority = { sourceExamIdRegistryRef: null, sourceExamIdRegistryEntrySha: null, uidMigrationEvidenceRefs: [], uidMigrationEvidenceSetSha: objectSha([]) };
    run.semanticDependencyBindings = {};
    if (!workBatchId) throw new Error('WORK_BATCH_ID_REQUIRED');
    run.workBatchId = workBatchId;
    run.benchmarkKind = benchmarkKind || null;
  }
  const pendingBundles = [];
  run.assetRoot = assetRoot || (pastManifest ? path.relative(root, path.resolve(root, pastManifest.outputDir || path.join(path.dirname(pastManifest.sourceInventoryPath), '..'))).split(path.sep).join('/') : 'archive');
  if (pastManifest) {
    const contractPath = 'archive/tools/past-exam-pipeline/completion-contract.json';
    const contract = JSON.parse(fs.readFileSync(safePath(root, contractPath), 'utf8'));
    if (!rulePack.refs.some(ref => ref.path === contract.geometryPolicyRef.path && ref.bytes === contract.geometryPolicyRef.bytes && ref.sha256 === contract.geometryPolicyRef.sha256)) throw new Error('BUILDER_START_BLOCKED:GEOMETRY_POLICY_RULE_PACK_DRIFT');
    const inventoryPath = path.relative(root, path.resolve(root, pastManifest.sourceInventoryPath)).split(path.sep).join('/');
    const inventoryRef = fileRef(root, inventoryPath);
    pastSourceRefs.push(inventoryRef);
    const inventory = JSON.parse(readBoundFile(root, inventoryRef));
    if (inventory.status !== 'SOURCE_INVENTORY_FROZEN' || inventory.examId !== pastManifest.examId) throw new Error('PAST_EXAM_SOURCE_INVENTORY_NOT_FROZEN');
    const included = inventory.questions.filter(q => q.disposition !== 'EXCLUDED_WITH_EVIDENCE');
    if (included.length !== candidate.questionBank.length || new Set(candidate.questionBank.map(q => q.sourceIdentityKey)).size !== included.length || included.some(q => !candidate.questionBank.some(c => c.sourceIdentityKey === q.sourceIdentityKey))) throw new Error('SOURCE_INVENTORY_COVERAGE_FAIL');
    for (const row of included) for (const page of row.sourcePageEvidencePaths || [row.sourceEvidencePath]) {
      if (!page) throw new Error('SOURCE_PAGE_EVIDENCE_REQUIRED');
      const pagePath = path.relative(root, path.resolve(path.dirname(path.resolve(root, inventoryPath)), '..', page)).split(path.sep).join('/');
      if (!run.inputs.some(r => r.path === pagePath)) {
        const pageRef = fileRef(root, pagePath);
        run.inputs.push({ ...pageRef, role: 'dependency' });
        pastSourceRefs.push(pageRef);
      }
    }
    const lockPath = path.relative(root, pastManifest.referenceSampleLock.path).split(path.sep).join('/');
    const lockRef = fileRef(root, lockPath);
    const lock = JSON.parse(readBoundFile(root, lockRef));
    const goldEligibility = evaluateGoldSourceEligibility(pastManifest);
    run.benchmarkKind = benchmarkKind || pastManifest.benchmarkKind || run.benchmarkKind || null;
    run.sourceAuthority.goldBenchmarkEligibility = goldEligibility;
    run.pastExamAuthority = {
      schemaVersion: 'APMATH_PAST_EXAM_JOB_AUTHORITY_v1',
      startSha: calibrationStart.mainCommit,
      calibrationRef: lockRef,
      calibrationSha: lockRef.sha256,
      rulePackSha: lock.rulePackSha,
    };
    const configPath = `${workdir}/past-exam-project-config.json`;
    writeNewJson(safePath(root, configPath, { mustExist: false }), { schemaVersion: 'PAST_EXAM_V3_PROJECT_CONFIG', referenceSampleLockRef: lockRef, geometryPolicyRef: contract.geometryPolicyRef, sourceInventorySha: inventoryRef.sha256, authority: run.pastExamAuthority, goldBenchmarkEligibility: goldEligibility });
    run.pastExamCompletionRef = fileRef(root, configPath);
    run.publicationIntent = 'FULL_EXAM';
    run.inputs.push({ ...run.pastExamCompletionRef, role: 'spec' }, { ...lockRef, role: 'spec' }, { ...inventoryRef, role: 'dependency' }, { ...fileRef(root, contractPath), role: 'spec' });
  }
  const asset = (reference, base = run.assetRoot) => {
    const relative = path.posix.join(base, reference.replace(/^archive\//, ''));
    const ref = fileRef(root, relative);
    if (!run.inputs.some(i => i.path === relative)) run.inputs.push({ ...ref, role: 'asset' });
    return ref;
  };
  for (const q of candidate.questionBank) {
    if (!Number.isSafeInteger(q.id) || q.id < 1 || !source.questionBank.some(s => s.id === q.id)) throw new Error('SOURCE_CANDIDATE_ID_MAPPING_REQUIRED');
    if (/<(?:svg|table|img)\b/i.test(q.solution || '') && !q.solutionImage) throw new Error('INLINE_VISUAL_REQUIRES_EXPLICIT_EXTRACTION_ADAPTER');
    const legacyUid = legacyQuestionUid(sourcePath, source.examTitle, q.id);
    const uid = v2 ? questionUidV2(sourceEntries[0].canonicalSourceExamId, q.id) : legacyUid;
    if (v2 && !sourceEntries.some(entry => entry.questionUidV2 === uid)) throw new Error('SOURCE_REGISTRY_ORDINAL_MISSING');
    const problem = q.image ? asset(q.image) : null, visual = q.solutionImage ? asset(q.solutionImage) : null;
    const sourceQuestion = source.questionBank.find(item => item.id === q.id);
    if (pastManifest && (sourceQuestion.sourceIdentityKey !== q.sourceIdentityKey || !q.sourceIdentityKey)) throw new Error('PAST_EXAM_SOURCE_IDENTITY_MAPPING_REQUIRED');
    const sourceProblem = sourceQuestion.image ? asset(sourceQuestion.image, sourceAssetRoot || run.assetRoot) : null;
    const sourceBundle = { questionUid: uid, content: sourceQuestion.content, choices: sourceQuestion.choices || [], problemAssets: sourceProblem ? [sourceProblem] : [] };
    pendingBundles.push({ path: `${workdir}/bundles/q${q.id}-v1.json`, value: sourceBundle });
    if (visual) pendingBundles.push({ path: `${workdir}/bundles/q${q.id}-v2.json`, value: { questionUid: uid, artifact: visual, renderWitnesses: [] } });
    const richIdentityFields = ['sourceDocumentSha256', 'sourceQuestionNo', 'sourcePageNo', 'sourcePageEvidencePaths', 'sourceEvidencePath', 'sourceIdentityKey'];
    const richIdentityPresent = richIdentityFields.some(field => sourceQuestion?.[field] !== undefined);
    const richIdentity = richIdentityPresent
      ? Object.fromEntries(richIdentityFields.filter(field => sourceQuestion?.[field] !== undefined).map(field => [field, sourceQuestion[field]]))
      : {};
    if (pipeline === 'past-exam' && richIdentityPresent && richIdentityFields.some(field => richIdentity[field] === undefined)) throw new Error('PAST_EXAM_RICH_SOURCE_IDENTITY_INCOMPLETE');
    run.questions.push({ questionUid: uid, ...richIdentity, ...(v2 ? { questionUidV2: uid, legacyQuestionUid: legacyUid, sourceExamId: sourceEntries[0].canonicalSourceExamId, sourceQuestionOrdinal: q.id, requiredAxes: [...profiles.pipelines[pipeline].axes.map(axis => profiles.axisAliases?.[axis] || axis.toUpperCase()), ...(profiles.pipelines[pipeline].visual ? ['V1', 'V2', 'V3'] : []), ...(profiles.pipelines[pipeline].modes.length ? ['RENDER'] : [])] } : {}), sourcePath, candidatePath, examId: source.examTitle, qid: q.id, sourceStatus: 'PENDING', visual: { origin: 'NATIVE', requirement: visual || problem ? 'VISUAL_OPTIONAL' : 'VISUAL_EXEMPT', action: visual ? 'KEEP' : 'NONE', actualSolutionVisualAttached: !!visual, problemVisualMathDependency: !!problem, sharedVisualMathDependency: false, adjudicationId: `q${q.id}:v3`, adjudicationStatus: 'PENDING', exemptReason: null }, problemAssetPaths: problem ? [problem.path] : [], solutionAssetPaths: visual ? [visual.path] : [], evidence: {} });
  }
  if (v2) {
    const registry = stableRegistry;
    if (pastManifest) for (const row of run.questions) {
      const q = candidate.questionBank.find(item => item.id === row.qid);
      for (const key of ['sourceIdentityKey', 'sourceDocumentSha256', 'sourceQuestionNo', 'sourcePageNo', 'sourcePageEvidencePaths']) row[key] = q[key];
    }
    const registryRef = sourceExamIdRegistryRef;
    run.inputs.push({ ...registryRef, role: 'dependency' });
    run.sourceExamIdRegistry = registry;
    run.uidAuthority.sourceExamIdRegistryRef = registryRef;
    run.uidAuthority.sourceExamIdRegistryEntrySha = objectSha(sourceEntries);
    for (const question of run.questions) {
      question.sourceExamId = sourceEntries[0].canonicalSourceExamId;
      question.requiredAxes = requiredAxesForQuestion(profiles.pipelines[pipeline], question, run);
      const migrationPath = `${workdir}/uid-migration/q${question.qid}.json`;
      writeNewJson(safePath(root, migrationPath, { mustExist: false }), createUidMigrationEvidence({ legacyQuestionUid: question.legacyQuestionUid, sourceExamId: question.sourceExamId, sourceQuestionOrdinal: question.qid, questionUidV2: question.questionUid, sourcePath, sourceSha256: sourceInputRef.sha256 }));
      run.uidAuthority.uidMigrationEvidenceRefs.push(fileRef(root, migrationPath));
    }
    run.uidAuthority.uidMigrationEvidenceSetSha = objectSha(run.uidAuthority.uidMigrationEvidenceRefs);
    run.sourceAuthority.sourceTruthRefs = [sourceInputRef, ...pastSourceRefs];
    run.sourceAuthority.sourceTruthBundleSha = objectSha(run.sourceAuthority.sourceTruthRefs);
    run.sourceAuthority.activeBaselineRef = sourceInputRef;
    run.sourceAuthority.activeBaselineSha = sourceInputRef.sha256;
  }
  for (const [relative, role] of [['archive/tools/pipeline-core/visual-contract.json', 'spec'], ['archive/tools/pipeline-core/closure.mjs', 'verifier'], ['archive/tools/pipeline-core/generator.py', 'generator']]) run.inputs.push({ ...fileRef(root, relative), role });
  addRuntimeInputs(run, runtimeDependencyBundle(root));
  if (v2) {
    const axisShas = computeV2AxisInputShas(root, run);
    for (const question of run.questions) question.axisInputShas = axisShas[question.questionUid];
  }
  run.inputSha = runInputSha(run);
  const bundleManifest = [];
  if (profiles.pipelines[pipeline].scope === 'QUESTION_QUALITY') for (const q of run.questions) pendingBundles.push({ path: `${workdir}/review-drafts/q${q.qid}-quality.json`, value: { status: 'NOT_TESTED', questionUid: q.questionUid, solutionQuality: solutionQualityDraft(), visualBenefit: visualBenefitDraft() } });
  for (const bundle of pendingBundles) {
    writeNewJson(safePath(root, bundle.path, { mustExist: false }), bundle.value);
    bundleManifest.push(fileRef(root, bundle.path));
  }
  run.reviewPreparation = { status: 'REQUIRES_BLIND_REVIEW_AND_REQUIREMENT_ADJUDICATION', bundleManifest, bundleManifestSha: objectSha(bundleManifest), note: 'No reviewer, PASS or final requirement is fabricated. Freeze builder/input plan before review; changed plans need a new revision.' };
  writeNewJson(path.join(destination, 'run.json'), run);
  return { status: 'DRAFT_NOT_EXECUTABLE', manifestPath: `${workdir}/run.json`, questionCount: run.questions.length, bundles: bundleManifest, inputSha: run.inputSha };
}
