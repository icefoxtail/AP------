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

export function prepareDraft(root, { pipeline, runId, sourcePath, candidatePath, workdir, schemaVersion = RUN_VERSION, builderId = null, builderSessionId = null, builderModelOrAgent = null, sourceExamIdRegistryRef = null, workBatchId = null }) {
  if (!profiles.pipelines[pipeline] || !/^[A-Za-z0-9_-]+$/.test(runId || '')) throw new Error('PIPELINE_AND_RUN_ID_REQUIRED');
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
  }
  const pendingBundles = [];
  const asset = reference => {
    const relative = reference.startsWith('archive/') ? reference : `archive/${reference}`;
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
    const sourceProblem = sourceQuestion.image ? asset(sourceQuestion.image) : null;
    const sourceBundle = { questionUid: uid, content: sourceQuestion.content, choices: sourceQuestion.choices || [], problemAssets: sourceProblem ? [sourceProblem] : [] };
    pendingBundles.push({ path: `${workdir}/bundles/q${q.id}-v1.json`, value: sourceBundle });
    if (visual) pendingBundles.push({ path: `${workdir}/bundles/q${q.id}-v2.json`, value: { questionUid: uid, artifact: visual, renderWitnesses: [] } });
    run.questions.push({ questionUid: uid, ...(v2 ? { questionUidV2: uid, legacyQuestionUid: legacyUid, sourceExamId: sourceEntries[0].canonicalSourceExamId, sourceQuestionOrdinal: q.id, requiredAxes: [...profiles.pipelines[pipeline].axes.map(axis => profiles.axisAliases?.[axis] || axis.toUpperCase()), ...(profiles.pipelines[pipeline].visual ? ['V1', 'V2', 'V3'] : []), ...(profiles.pipelines[pipeline].modes.length ? ['RENDER'] : [])] } : {}), sourcePath, candidatePath, examId: source.examTitle, qid: q.id, sourceStatus: 'PENDING', visual: { origin: 'NATIVE', requirement: visual || problem ? 'VISUAL_OPTIONAL' : 'VISUAL_EXEMPT', action: visual ? 'KEEP' : 'NONE', actualSolutionVisualAttached: !!visual, problemVisualMathDependency: !!problem, sharedVisualMathDependency: false, adjudicationId: `q${q.id}:v3`, adjudicationStatus: 'PENDING', exemptReason: null }, problemAssetPaths: problem ? [problem.path] : [], solutionAssetPaths: visual ? [visual.path] : [], evidence: {} });
  }
  if (v2) {
    const registry = stableRegistry;
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
    run.sourceAuthority.sourceTruthRefs = [sourceInputRef];
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
  for (const bundle of pendingBundles) {
    writeNewJson(safePath(root, bundle.path, { mustExist: false }), bundle.value);
    bundleManifest.push(fileRef(root, bundle.path));
  }
  run.reviewPreparation = { status: 'REQUIRES_BLIND_REVIEW_AND_REQUIREMENT_ADJUDICATION', bundleManifest, bundleManifestSha: objectSha(bundleManifest), note: 'No reviewer, PASS or final requirement is fabricated. Freeze builder/input plan before review; changed plans need a new revision.' };
  writeNewJson(path.join(destination, 'run.json'), run);
  return { status: 'DRAFT_NOT_EXECUTABLE', manifestPath: `${workdir}/run.json`, questionCount: run.questions.length, bundles: bundleManifest, inputSha: run.inputSha };
}
