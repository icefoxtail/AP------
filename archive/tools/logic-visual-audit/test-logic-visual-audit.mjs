import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalJson, semanticSha, sha256, validateFact } from './lib/canonicalize.mjs';
import { computeDenominator, detectStale } from './lib/denominator.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const results = [];
const setA = { factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', questionUid: 'test:set:1', unit: '집합', visualType: 'SET_FORCE_FORBID_FREE', visualRole: 'bucket', requiredLabels: ['freeElements', 'forcedElements', 'forbiddenElements'], decisiveStepIds: ['bucket'], forcedElements: [3, 1], forbiddenElements: [8, 6], freeElements: [2, 5], freeCount: 2, countingResult: '2^2' };
const setB = { ...setA, requiredLabels: ['forbiddenElements', 'freeElements', 'forcedElements'], forcedElements: [1, 3], forbiddenElements: [6, 8], freeElements: [5, 2] };
results.push({ id: 'set-order-is-canonical', pass: semanticSha(setA) === semanticSha(setB), detail: [semanticSha(setA), semanticSha(setB)] });
const proofA = { factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', questionUid: 'test:proof:1', unit: '명제', visualType: 'PROOF_FLOW', visualRole: 'proof', requiredLabels: [], decisiveStepIds: ['s1', 's2'], proofSteps: [{ id: 's1', text: 'a' }, { id: 's2', text: 'b' }], proofEdges: [{ fromStep: 's1', toStep: 's2', relation: 'uses' }], contradictionTarget: null, finalConclusion: 'b' };
const proofB = { ...proofA, proofSteps: [{ id: 's2', text: 'b' }, { id: 's1', text: 'a' }] };
results.push({ id: 'proof-order-is-semantic', pass: semanticSha(proofA) !== semanticSha(proofB), detail: [semanticSha(proofA), semanticSha(proofB)] });
results.push({ id: 'same-meaning-different-uid-is-semantic-equivalent', pass: semanticSha(setA) === semanticSha({ ...setA, questionUid: 'test:set:another-uid' }), detail: [semanticSha(setA), semanticSha({ ...setA, questionUid: 'test:set:another-uid' })] });
const caseOrderA = { factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', questionUid: 'test:case:a', unit: '집합', visualType: 'SET_CASE_PARTITION', visualRole: 'table', requiredLabels: ['case'], decisiveStepIds: ['case'], caseRows: [{ caseId: 'B', result: 'reject' }, { caseId: 'A', result: 'keep' }] };
const caseOrderB = { ...caseOrderA, questionUid: 'test:case:b', caseRows: [...caseOrderA.caseRows].reverse() };
results.push({ id: 'case-row-order-is-canonical-and-uid-independent', pass: semanticSha(caseOrderA) === semanticSha(caseOrderB), detail: [semanticSha(caseOrderA), semanticSha(caseOrderB)] });
const missingProjection = { ...setA }; delete missingProjection.freeElements;
results.push({ id: 'required-projection-field-is-enforced', pass: !validateFact(missingProjection).pass, detail: validateFact(missingProjection) });
const invalidTypes = [
  { ...setA, questionUid: 42 },
  { ...setA, requiredLabels: 'not-an-array' },
  { ...setA, freeElements: [null] },
  { ...setA, freeCount: -1 },
  { ...caseOrderA, caseRows: [{ caseId: 'A' }, { caseId: 'A' }] }
];
results.push({ id: 'typed-negative-fixtures-are-rejected', pass: invalidTypes.every((fact) => !validateFact(fact).pass), detail: invalidTypes.map((fact) => validateFact(fact)) });
const denominator = JSON.parse(fs.readFileSync(path.join(OUT, 'c_denominator.json'), 'utf8'));
const mutate = (mapKey) => { const maps = structuredClone(denominator.maps); const uid = denominator.candidateRequiredUidSet[0]; maps[mapKey] = { ...maps[mapKey], [uid]: !maps[mapKey][uid] }; return sha256({ ...maps, candidateReleaseArtifactSha: sha256(denominator.candidateRequiredUidSet) }); };
for (const key of ['actualSolutionVisualAttachedMapSha', 'problemVisualMathDependencyMapSha', 'sharedVisualMathDependencyMapSha']) results.push({ id: `denominator-${key}-mutation-changes-input`, pass: mutate(key) !== denominator.cDenominatorInputSha, detail: { before: denominator.cDenominatorInputSha, after: mutate(key) } });
const denominatorProbe = computeDenominator({ items: [{ questionUid: 'probe:optional-attached', actualSolutionVisualAttached: true, problemVisualMathDependency: false, sharedVisualMathDependency: false }], triage: { 'probe:optional-attached': { finalVisualRequirement: 'VISUAL_OPTIONAL' } }, artifacts: {}, candidateReleaseArtifactSha: 'sha256:' + '0'.repeat(64) });
results.push({ id: 'missing-attached-artifact-remains-in-c-denominator', pass: denominatorProbe.logicVisualRequiredUidSet.includes('probe:optional-attached'), detail: denominatorProbe.logicVisualRequiredUidSet });
const staleProbe = detectStale({ cInput: { ...denominatorProbe.cInput } }, { cInput: { ...denominatorProbe.cInput, candidateReleaseArtifactSha: 'sha256:' + '1'.repeat(64) } });
results.push({ id: 'artifact-input-change-invalidates-c-denominator', pass: staleProbe.stale && staleProbe.reasons.includes('candidateReleaseArtifactSha'), detail: staleProbe });
const output = { generatedAtKst: '2026-09-05', status: results.every((result) => result.pass) ? 'PASS' : 'FAIL', results };
fs.writeFileSync(path.join(OUT, 'logic_visual_unit_tests.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, testCount: results.length, failed: results.filter((result) => !result.pass).length }, null, 2));
if (output.status !== 'PASS') process.exitCode = 1;
