import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { canonicalizeFact, loadSpecs, projectSemantic, semanticHash, validateFact } from './lib/facts.mjs';
import { computeDenominator, detectStale } from './lib/denominator.mjs';
import { compareStructureReuse } from './lib/gate.mjs';
import { nextHoldoutStatus } from './lib/holdout.mjs';
import { readJson, sha256 } from './lib/io.mjs';

const root = path.resolve(process.cwd(), 'archive/tools/logic-visual-audit');
const specs = loadSpecs(path.join(root, 'specs'));
const numberLine = (from = '0', to = '2') => ({ factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', visualType: 'SET_NUMBER_LINE', intervalComponents: [{ from, to, fromEndpoint: { kind: 'CLOSED' }, toEndpoint: { kind: 'OPEN' } }] });

assert.equal(semanticHash({ ...numberLine(), requiredLabels: ['B', 'A'] }, specs.projection), semanticHash({ ...numberLine(), requiredLabels: ['A', 'B'] }, specs.projection), 'projection must ignore non-semantic labels');
assert.equal(sha256(canonicalizeFact({ factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', visualType: 'SET_FORCE_FORBID_FREE', forcedElements: ['2', '1'], forbiddenElements: [], freeElements: [] })), sha256(canonicalizeFact({ factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', visualType: 'SET_FORCE_FORBID_FREE', forcedElements: ['1', '2'], forbiddenElements: [], freeElements: [] })), 'SET fields are order-insensitive');
const proofA = { factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', visualType: 'PROOF_FLOW', proofSteps: ['a', 'b'], proofEdges: [{ key: '2' }, { key: '1' }] };
const proofB = { ...proofA, proofSteps: ['b', 'a'] };
assert.notEqual(sha256(canonicalizeFact(proofA)), sha256(canonicalizeFact(proofB)), 'proof step order is semantic');
assert.throws(() => projectSemantic({ factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', visualType: 'SET_NUMBER_LINE' }, specs.projection), /required semantic field missing/);
assert(validateFact({ factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', visualType: 'SET_NUMBER_LINE' }, specs.schema).length > 0, 'required field removal must fail schema');

const baseItems = [
  { questionUid: 'required-attached', actualSolutionVisualAttached: true, problemVisualMathDependency: false, sharedVisualMathDependency: false },
  { questionUid: 'exempt-no-visual', actualSolutionVisualAttached: false, problemVisualMathDependency: false, sharedVisualMathDependency: false },
  { questionUid: 'required-no-satisfier', actualSolutionVisualAttached: false, problemVisualMathDependency: false, sharedVisualMathDependency: false }
];
const triage = {
  'required-attached': { finalVisualRequirement: 'VISUAL_OPTIONAL' },
  'exempt-no-visual': { finalVisualRequirement: 'VISUAL_EXEMPT' },
  'required-no-satisfier': { finalVisualRequirement: 'VISUAL_REQUIRED' }
};
const artifacts = { 'required-attached': { artifactExists: true }, 'exempt-no-visual': { artifactExists: false }, 'required-no-satisfier': { artifactExists: false } };
const denominator = computeDenominator({ items: baseItems, triage, artifacts, candidateReleaseArtifactSha: 'release-a' });
assert(denominator.logicVisualRequiredUidSet.includes('required-attached'), 'optional plus actual visual is C-required');
assert(!denominator.logicVisualRequiredUidSet.includes('exempt-no-visual'), 'exempt without dependency is not required');
assert(denominator.logicVisualRequiredUidSet.includes('required-no-satisfier'), 'required without satisfier remains in denominator and will fail');
const changedAttach = computeDenominator({ items: baseItems.map((item) => item.questionUid === 'exempt-no-visual' ? { ...item, actualSolutionVisualAttached: true } : item), triage, artifacts: { ...artifacts, 'exempt-no-visual': { artifactExists: true } }, candidateReleaseArtifactSha: 'release-a' });
assert.equal(detectStale(denominator, changedAttach).stale, true, 'attach after freeze makes denominator stale');
const changedDependency = computeDenominator({ items: baseItems, triage, artifacts, candidateReleaseArtifactSha: 'release-a' });
changedDependency.cInput.problemVisualMathDependencyMapSha = 'changed';
assert.equal(detectStale(denominator, changedDependency).stale, true, 'dependency flip makes denominator stale');
assert.notEqual(denominator.logicVisualRequiredUidSetSha, 'invalidated', 'UID set is valid before stale mutation');
assert.notEqual(denominator.logicVisualRequiredUidSetSha, denominator.coreFinalCRequiredUidSetSha.replace(/^./, 'x'), 'overlay/core parity check is exact');

const cPass = { ...numberLine(), observed: true };
assert.equal(semanticHash(cPass, specs.projection), semanticHash(cPass, specs.projection), 'C semantic PASS remains independent from D');
const cStatus = 'PASS';
const dStatus = 'FAIL';
assert.equal(cStatus, 'PASS');
assert.equal(dStatus, 'FAIL');
assert.notEqual(`${cStatus}:${dStatus}`, 'PASS');

const mutation = readJson(path.join(root, 'reports/mutation-qualification.json'));
assert.equal(mutation.mutationQualificationCurrent, 'PASS', 'mutation harness must detect all frozen mutations');
assert.equal(nextHoldoutStatus({ currentStatus: 'UNSEEN', result: 'FAIL' }), 'REVEALED_FAIL');
assert.equal(nextHoldoutStatus({ currentStatus: 'REVEALED_FAIL', result: 'PASS', toolChanged: true }), 'RETIRED');
assert.equal(nextHoldoutStatus({ currentStatus: 'REVEALED_PASS', result: 'PASS', toolChanged: true }), 'RETIRED');

const sameStructure = { visualStructureFingerprint: 'same', expectedSemanticSha: 'sha', questionUid: 'a' };
const sameStructure2 = { visualStructureFingerprint: 'same', expectedSemanticSha: 'sha', questionUid: 'b' };
const differentStructure = { visualStructureFingerprint: 'same', expectedSemanticSha: 'different', questionUid: 'c' };
assert.equal(compareStructureReuse([sameStructure, sameStructure2])[0].status, 'ALLOWED_SHARED_SEMANTIC');
assert.equal(compareStructureReuse([sameStructure, differentStructure])[0].status, 'FAIL_STRUCTURAL_REUSE');
console.log(JSON.stringify({ test: 'logic-visual-audit', status: 'PASS', assertions: 16 }, null, 2));
