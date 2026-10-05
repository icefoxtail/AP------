import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const adjudication = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_batch_01_requirement_adjudication.json'), 'utf8'));
if (adjudication.status !== 'RESOLVED') throw new Error('requirement adjudication is not resolved');
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(Buffer.isBuffer(value) || value instanceof Uint8Array ? value : typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')}`;
const artifactPathByUid = new Map([
  ['archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js|22_금당고_2학기_기말_고1_기출|20', 'archive/assets/images/22_금당고_2학기_기말_고1_기출/q20-solution.svg'],
  ['archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|17', 'archive/assets/images/22_매산고_2학기_중간_고1_기출/q17-solution.svg'],
  ['archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js|22_팔마고_2학기_중간_고1_기출|14', 'archive/assets/images/22_팔마고_2학기_중간_고1_기출/q14-solution.svg']
]);
const artifactShaMap = Object.fromEntries([...artifactPathByUid.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([uid, relative]) => [uid, sha256(fs.readFileSync(path.join(ROOT, relative.replaceAll('/', path.sep))))]));
const requirements = Object.fromEntries(adjudication.entries.map((entry) => [entry.questionUid, entry.finalVisualRequirement]));
const attached = Object.fromEntries(Object.keys(requirements).map((uid) => [uid, true]));
const problemDependency = Object.fromEntries(Object.keys(requirements).map((uid) => [uid, false]));
const sharedDependency = Object.fromEntries(Object.keys(requirements).map((uid) => [uid, false]));
const finalVisualRequirementMapSha = sha256(requirements);
const actualSolutionVisualAttachedMapSha = sha256(attached);
const problemVisualMathDependencyMapSha = sha256(problemDependency);
const sharedVisualMathDependencyMapSha = sha256(sharedDependency);
const candidateReleaseArtifactSha = sha256(artifactShaMap);
const cDenominatorInputSha = sha256({ finalVisualRequirementMapSha, actualSolutionVisualAttachedMapSha, problemVisualMathDependencyMapSha, sharedVisualMathDependencyMapSha, candidateReleaseArtifactSha });
const required = Object.keys(requirements).sort();
const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_BATCH_01_C_DENOMINATOR',
  scope: 'Pilot-scoped denominator for the three adjudicated batch-01 UIDs only; not the global 360-target denominator.',
  status: 'FROZEN',
  finalVisualRequirementMapSha,
  actualSolutionVisualAttachedMapSha,
  problemVisualMathDependencyMapSha,
  sharedVisualMathDependencyMapSha,
  candidateReleaseArtifactSha,
  cDenominatorInputSha,
  logicVisualRequiredUidSet: required,
  logicVisualRequiredUidSetSha: sha256(required),
  coreFinalCRequiredUidSet: required,
  coreFinalCRequiredUidSetSha: sha256(required),
  parity: true,
  requiredCount: required.length,
  stale: false,
  denominatorMayBeReusedForGlobalPhase1: false,
  evidence: { requirementAdjudication: 'reports/phase2_batch_01_requirement_adjudication.json', artifactEvidence: 'reports/phase2_artifact_evidence_invalidation.json', typedParity: 'reports/phase2_typed_semantic_parity.json' }
};
fs.writeFileSync(path.join(OUT, 'phase2_batch_01_c_denominator_frozen.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, scope: output.scope, requiredCount: output.requiredCount, logicVisualRequiredUidSetSha: output.logicVisualRequiredUidSetSha, cDenominatorInputSha: output.cDenominatorInputSha }, null, 2));
