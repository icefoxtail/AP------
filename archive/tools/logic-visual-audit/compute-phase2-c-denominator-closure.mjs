import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha = (value) => `sha256:${crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')}`;
const inventory = read('phase2_2022_set_pilot_inventory.json');
const forceRefreeze = process.argv.includes('--refreeze');
const registry = read('phase2_2022_set_pilot_canonical_registry.json');
const decisionByUid = new Map(registry.entries.map((entry) => [entry.questionUid, entry.finalVisualDecision]));
const questionRows = [];
const sourceShaMap = {};
const artifactShaMap = {};
const altCaptionShaMap = {};
const assetShaMap = {};
const dependencyMap = {};
const pipelineDependencyPaths = [
  'archive/tools/logic-visual-audit/lib/canonicalize.mjs',
  'archive/tools/logic-visual-audit/lib/denominator.mjs',
  'archive/tools/logic-visual-audit/lib/visual.mjs',
  'archive/tools/logic-visual-audit/specs/logic-visual-fact-schema-v1.json',
  'archive/tools/logic-visual-audit/specs/semantic-projection-spec-v1.json',
  'archive/tools/logic-visual-audit/specs/fact-canonicalization-spec-v1.json',
  'archive/tools/logic-visual-audit/validate-phase2-evidence-contract.mjs'
];
const fileSha = (relativePath) => {
  const absolute = path.join(ROOT, relativePath.replaceAll('/', path.sep));
  return fs.existsSync(absolute) ? sha(fs.readFileSync(absolute)) : null;
};
const resolveAsset = (ref) => {
  if (typeof ref !== 'string' || !ref || ref.startsWith('data:') || ref.startsWith('http')) return null;
  const candidates = [ref, ref.startsWith('archive/') ? ref : `archive/${ref}`];
  for (const candidate of candidates) {
    const absolute = path.resolve(ROOT, candidate.replaceAll('/', path.sep));
    if (absolute.startsWith(`${ROOT}${path.sep}`) && fs.existsSync(absolute) && fs.statSync(absolute).isFile()) return candidate.replaceAll('\\', '/');
  }
  return candidates[0].replaceAll('\\', '/');
};
for (const row of inventory.rows) {
  const sourcePath = path.join(ROOT, row.sourceJsPath.replaceAll('/', path.sep));
  const sourceBytes = fs.readFileSync(sourcePath);
  sourceShaMap[row.questionUid] = sha(sourceBytes);
  const context = { window: {} };
  vm.runInNewContext(sourceBytes.toString('utf8'), context, { timeout: 5000 });
  const question = context.window.questionBank.find((candidate) => Number(candidate.id) === Number(row.qid));
  const actualAttached = Boolean(question.solutionImage || question.solutionImageAlt || question.solutionImageCaption || question.solution.includes('[시각자료 읽기]'));
  const artifactPath = question.solutionImage ? path.join(ROOT, 'archive', question.solutionImage.replaceAll('/', path.sep)) : null;
  const artifactExists = Boolean(artifactPath && fs.existsSync(artifactPath));
  artifactShaMap[row.questionUid] = artifactExists ? sha(fs.readFileSync(artifactPath)) : null;
  altCaptionShaMap[row.questionUid] = sha(JSON.stringify({ alt: question.solutionImageAlt ?? null, caption: question.solutionImageCaption ?? null }));
  const referencedAssets = [...new Set([
    question.solutionImage,
    question.problemImage,
    question.problemImageRef,
    question.image,
    question.imageRef,
    question.originalProblemImage,
    ...(Array.isArray(question.problemImageRefs) ? question.problemImageRefs : [])
  ].map(resolveAsset).filter(Boolean))].sort();
  assetShaMap[row.questionUid] = referencedAssets.map((relativePath) => ({ path: relativePath, sha256: fileSha(relativePath) }));
  const problemRefs = [...new Set([
    ...(Array.isArray(question.problemImageRefs) ? question.problemImageRefs : []),
    question.problemImage,
    question.problemImageRef,
    question.image,
    question.imageRef,
    question.originalProblemImage
  ].filter((value) => typeof value === 'string' && value.length > 0))];
  const problemDependency = problemRefs.length > 0;
  const sharedDependency = (Array.isArray(question.tags) && question.tags.includes('공통자료')) || Boolean(question.sharedProblemMaterial);
  const finalDecision = decisionByUid.get(row.questionUid) ?? null;
  const requiredByDecision = finalDecision !== 'NO_VISUAL';
  const requiredByClosure = requiredByDecision || actualAttached || problemDependency || sharedDependency;
  dependencyMap[row.questionUid] = { requiredByDecision, actualSolutionVisualAttached: actualAttached, problemVisualMathDependency: problemDependency, sharedVisualMathDependency: sharedDependency, finalDecision };
  questionRows.push({ questionUid: row.questionUid, finalDecision, requiredByDecision, actualSolutionVisualAttached: actualAttached, problemVisualMathDependency: problemDependency, sharedVisualMathDependency: sharedDependency, requiredByClosure, artifactExists });
}
const ruleRefs = ['docs/rules/00_RULES_INDEX.md', 'docs/rules/MANIFEST.md', 'docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md', 'docs/rules/04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md', 'archive/tools/logic-visual-audit/specs/logic-visual-fact-schema-v1.json', 'archive/tools/logic-visual-audit/specs/semantic-projection-spec-v1.json'];
const ruleShaMap = Object.fromEntries(ruleRefs.map((relativePath) => [relativePath, sha(fs.readFileSync(path.join(ROOT, relativePath.replaceAll('/', path.sep))))]));
const pipelineShaMap = Object.fromEntries(pipelineDependencyPaths.map((relativePath) => [relativePath, fileSha(relativePath)]));
const inventoryBytesSha = sha(fs.readFileSync(path.join(OUT, 'phase2_2022_set_pilot_inventory.json')));
const currentInput = { inventoryQuestionUidSetSha: inventory.questionUidSetSha, inventoryBytesSha, dependencyMap, sourceShaMap, artifactShaMap, altCaptionShaMap, assetShaMap, ruleShaMap, pipelineShaMap };
const currentInputSha = sha(currentInput);
const previousPath = path.join(OUT, 'phase2_2022_set_pilot_c_denominator_closure.json');
const previous = fs.existsSync(previousPath) ? JSON.parse(fs.readFileSync(previousPath, 'utf8')) : null;
const requiredUidSet = questionRows.filter((row) => row.requiredByClosure).map((row) => row.questionUid).sort();
const output = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_C_DENOMINATOR_CLOSURE',
  status: previous && previous.cDenominatorInputSha !== currentInputSha && !forceRefreeze ? 'STALE_REFREEZE_REQUIRED' : 'FROZEN',
  closureRule: 'requiredByDecision OR actualSolutionVisualAttached OR problemVisualMathDependency OR sharedVisualMathDependency',
  inventoryQuestionUidSetSha: inventory.questionUidSetSha,
  cDenominatorInputSha: currentInputSha,
  previousCdenominatorInputSha: previous?.cDenominatorInputSha ?? null,
  stale: Boolean(previous && previous.cDenominatorInputSha !== currentInputSha && !forceRefreeze),
  refreezePerformed: Boolean(forceRefreeze && previous && previous.cDenominatorInputSha !== currentInputSha),
  requiredUidSet,
  requiredUidSetSha: sha(requiredUidSet),
  requiredCount: requiredUidSet.length,
  rows: questionRows,
  maps: { dependencyMapSha: sha(dependencyMap), sourceShaMapSha: sha(sourceShaMap), artifactShaMapSha: sha(artifactShaMap), altCaptionShaMapSha: sha(altCaptionShaMap), assetShaMapSha: sha(assetShaMap), ruleShaMapSha: sha(ruleShaMap), pipelineShaMapSha: sha(pipelineShaMap), inventoryBytesSha }
};
fs.writeFileSync(previousPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, requiredCount: output.requiredCount, requiredUidSetSha: output.requiredUidSetSha, cDenominatorInputSha: output.cDenominatorInputSha, stale: output.stale }, null, 2));
if (output.status !== 'FROZEN') process.exitCode = 1;
