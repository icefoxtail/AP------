import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileRef, safePath, writeNewJson, objectSha } from './canonical.mjs';
import { profiles, RUN_VERSION, runInputSha } from './closure.mjs';
import { rulePreflight } from './rulepack.mjs';

export function prepareDraft(root, { pipeline, runId, sourcePath, candidatePath, workdir }) {
  if (!profiles.pipelines[pipeline] || !/^[A-Za-z0-9_-]+$/.test(runId || '')) throw new Error('PIPELINE_AND_RUN_ID_REQUIRED');
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
  const run = { schemaVersion: RUN_VERSION, status: 'DRAFT_NOT_REVIEWED', pipeline, runId, revision: 1, builderSessionId: null, canonicalRecordId: `${runId}:r1`, inputs: [{ ...fileRef(root, sourcePath), role: 'source' }, { ...fileRef(root, candidatePath), role: 'candidate' }, ...rulePack.refs], questions: [], evidence: [], registry: [], denominator: { status: 'UNFROZEN', stale: true }, inputSha: null };
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
    const uid = `${sourcePath}|${source.examTitle}|${q.id}`;
    const problem = q.image ? asset(q.image) : null, visual = q.solutionImage ? asset(q.solutionImage) : null;
    const sourceBundle = { questionUid: uid, content: q.content, choices: q.choices || [], problemAssets: problem ? [problem] : [] };
    pendingBundles.push({ path: `${workdir}/bundles/q${q.id}-v1.json`, value: sourceBundle });
    if (visual) pendingBundles.push({ path: `${workdir}/bundles/q${q.id}-v2.json`, value: { questionUid: uid, artifact: visual, renderWitnesses: [] } });
    run.questions.push({ questionUid: uid, sourcePath, candidatePath, examId: source.examTitle, qid: q.id, sourceStatus: 'PENDING', visual: { requirement: visual || problem ? 'VISUAL_OPTIONAL' : 'VISUAL_EXEMPT', action: visual ? 'KEEP' : 'NONE', actualSolutionVisualAttached: !!visual, problemVisualMathDependency: !!problem, sharedVisualMathDependency: false, adjudicationId: `q${q.id}:v3`, adjudicationStatus: 'PENDING', exemptReason: null }, problemAssetPaths: problem ? [problem.path] : [], solutionAssetPaths: visual ? [visual.path] : [], evidence: {} });
  }
  for (const [relative, role] of [['archive/engine.html', 'engine'], ['archive/tools/pipeline-core/visual-contract.json', 'spec'], ['archive/tools/pipeline-core/closure.mjs', 'verifier'], ['archive/tools/pipeline-core/generator.py', 'generator']]) run.inputs.push({ ...fileRef(root, relative), role });
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
