import { canonicalUidSet, sha256 } from './io.mjs';

export function mapSha(map) {
  return sha256(Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b))));
}

export function computeDenominator({ items, triage, artifacts, candidateReleaseArtifactSha }) {
  const finalRequirement = {};
  const attached = {};
  const problemDependency = {};
  const sharedDependency = {};
  for (const item of items) {
    const triageItem = triage[item.questionUid];
    finalRequirement[item.questionUid] = triageItem?.finalVisualRequirement ?? signalToRequirement(triageItem?.expectedVisualRequirementSignal);
    attached[item.questionUid] = Boolean(item.actualSolutionVisualAttached && artifacts[item.questionUid]?.artifactExists);
    problemDependency[item.questionUid] = Boolean(item.problemVisualMathDependency);
    sharedDependency[item.questionUid] = Boolean(item.sharedVisualMathDependency);
  }
  const finalVisualRequirementMapSha = mapSha(finalRequirement);
  const actualSolutionVisualAttachedMapSha = mapSha(attached);
  const problemVisualMathDependencyMapSha = mapSha(problemDependency);
  const sharedVisualMathDependencyMapSha = mapSha(sharedDependency);
  const cInput = { finalVisualRequirementMapSha, actualSolutionVisualAttachedMapSha, problemVisualMathDependencyMapSha, sharedVisualMathDependencyMapSha, candidateReleaseArtifactSha };
  const cDenominatorInputSha = sha256(cInput);
  const required = canonicalUidSet(items.filter((item) => finalRequirement[item.questionUid] === 'VISUAL_REQUIRED' || attached[item.questionUid] || problemDependency[item.questionUid] || sharedDependency[item.questionUid]).map((item) => item.questionUid));
  return { finalRequirement, attached, problemDependency, sharedDependency, finalVisualRequirementMapSha, actualSolutionVisualAttachedMapSha, problemVisualMathDependencyMapSha, sharedVisualMathDependencyMapSha, cInput, cDenominatorInputSha, logicVisualRequiredUidSet: required, logicVisualRequiredUidSetSha: sha256(required), coreFinalCRequiredUidSet: [...required], coreFinalCRequiredUidSetSha: sha256(required), status: 'FROZEN' };
}

export function detectStale(previous, current) {
  if (!previous) return { stale: false, reasons: [] };
  const reasons = [];
  for (const key of ['finalVisualRequirementMapSha', 'actualSolutionVisualAttachedMapSha', 'problemVisualMathDependencyMapSha', 'sharedVisualMathDependencyMapSha', 'candidateReleaseArtifactSha']) {
    if (previous.cInput?.[key] !== current.cInput?.[key]) reasons.push(key);
  }
  return { stale: reasons.length > 0, reasons };
}

function signalToRequirement(signal) {
  if (signal === 'SHOULD_BE_REQUIRED') return 'VISUAL_REQUIRED';
  if (signal === 'SHOULD_BE_EXEMPT') return 'VISUAL_EXEMPT';
  return 'VISUAL_OPTIONAL';
}
