import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson, sha256 } from './lib/io.mjs';
import { computeDenominator, detectStale } from './lib/denominator.mjs';

const repoRoot = path.resolve(process.cwd());
const inventory = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/target-inventory.json'));
const triageReport = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/v1-evidence-freeze.json'));
const artifactReport = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/v2-evidence-freeze.json'));
const triage = triageReport.signals;
const artifacts = artifactReport.items;
const releaseSha = sha256(inventory.items.map((item) => `${item.questionUid}:${item.sourceFileSha}`).join('\n'));
const current = computeDenominator({ items: inventory.items, triage, artifacts, candidateReleaseArtifactSha: releaseSha });
const previousPath = path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/c-denominator.json');
const previous = fs.existsSync(previousPath) ? readJson(previousPath) : null;
const stale = detectStale(previous, current);
const staleMutationTests = runStaleMutationTests(inventory.items, triage, artifacts, releaseSha, current);
const report = { ...current, candidateReleaseArtifactSha: releaseSha, stale, staleMutationTests, denominatorInputSha: sha256(current.cInput), parity: current.logicVisualRequiredUidSetSha === current.coreFinalCRequiredUidSetSha ? 'PASS' : 'FAIL' };
writeJson(previousPath, report);
console.log(JSON.stringify({ status: report.status, finalVisualRequirementMapSha: report.finalVisualRequirementMapSha, cDenominatorInputSha: report.cDenominatorInputSha, requiredCount: report.logicVisualRequiredUidSet.length, parity: report.parity, stale: report.stale }, null, 2));
if (report.parity !== 'PASS') process.exitCode = 1;

function runStaleMutationTests(items, triageMap, artifactMap, release, frozen) {
  const cases = [];
  const first = items.find((item) => !item.actualSolutionVisualAttached) ?? items[0];
  const attachedItem = items.find((item) => item.actualSolutionVisualAttached) ?? items[0];
  const attachArtifacts = { ...artifactMap, [first.questionUid]: { ...(artifactMap[first.questionUid] ?? {}), artifactExists: true } };
  const scenarios = [
    ['ADD', items.map((item) => item.questionUid === first.questionUid ? { ...item, actualSolutionVisualAttached: true } : item), attachArtifacts, release],
    ['REBUILD', items.map((item) => item.questionUid === first.questionUid ? { ...item, actualSolutionVisualAttached: true } : item), attachArtifacts, release],
    ['REMOVE_INVALID_VISUAL', items.map((item) => item.questionUid === attachedItem.questionUid ? { ...item, actualSolutionVisualAttached: false } : item), artifactMap, release],
    ['USE_PROBLEM_IMAGE', items.map((item) => item.questionUid === first.questionUid ? { ...item, problemVisualMathDependency: !item.problemVisualMathDependency } : item), artifactMap, release],
    ['RELEASE_SHA_CHANGE', items, artifactMap, `${release}-changed`]
  ];
  for (const [mutationId, mutatedItems, mutatedArtifacts, mutatedRelease] of scenarios) {
    const mutated = computeDenominator({ items: mutatedItems, triage: triageMap, artifacts: mutatedArtifacts, candidateReleaseArtifactSha: mutatedRelease });
    const result = detectStale(frozen, mutated);
    cases.push({ mutationId, stale: result.stale, reasons: result.reasons });
  }
  return { pass: cases.every((item) => item.stale), cases };
}
