import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateFact, semanticSha, semanticContentSha, structureFingerprint } from './lib/canonicalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const sha = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));

const uids = {
  q09: 'archive/exams/original/high/h1/2mid/22_복성고_2학기_중간_고1_기출.js|22_복성고_2학기_중간_고1_기출|9',
  q20: 'archive/exams/original/high/h1/2mid/22_제일고_2학기_중간_고1_기출.js|22_제일고_2학기_중간_고1_기출|20',
  q18: 'archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js|22_팔마고_2학기_중간_고1_기출|18',
  q10: 'archive/exams/original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js|22_효천고_2학기_중간_고1_기출|10',
  q11: 'archive/exams/original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js|22_효천고_2학기_중간_고1_기출|11',
  q12: 'archive/exams/original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js|22_효천고_2학기_중간_고1_기출|12'
};
const shell = (questionUid, visualType, visualRole, requiredLabels, decisiveStepIds, extra) => ({ factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', questionUid, unit: '집합', visualType, visualRole, requiredLabels, decisiveStepIds, ...extra });
const facts = [
  {
    questionUid: uids.q09,
    expected: shell(uids.q09, 'SET_REGION_VENN_3', 'three_set_region_equivalence', ['A', 'B', 'C', 'B∩C∩Aᶜ', '①'], ['INTERSECT_B_C', 'EXCLUDE_A', 'MATCH_OPTION_1'], { universeRequired: 'U', expectedRegions: ['B∩C∩Aᶜ'], boundaryIdentity: { targetRegion: 'B∩C∩Aᶜ', matchedChoice: '①' } }),
    observed: shell(uids.q09, 'SET_REGION_VENN_3', 'three_set_region_equivalence', ['A', 'B', 'C', 'B∩C∩Aᶜ', '①'], ['INTERSECT_B_C', 'EXCLUDE_A', 'MATCH_OPTION_1'], { universeRequired: 'U', expectedRegions: ['B∩C∩Aᶜ'], boundaryIdentity: { targetRegion: 'B∩C∩Aᶜ', matchedChoice: '①' } })
  },
  {
    questionUid: uids.q20,
    expected: shell(uids.q20, 'SET_CASE_PARTITION', 'parameter_reconstruction_flow', ['a₁=1', 'a₄=9', 'T(a₂)+T(a₃)+T(a₅)=150', 'A={1,2,3,9,11}', 'B={1,4,9,81,121}'], ['FIX_A1_A4', 'DERIVE_A3', 'SOLVE_REMAINING_VALUES', 'FINAL_SET_CHECK'], { caseRows: [
      { caseId: 'BOUNDARY', condition: 'a₁+a₄=10 and a₁∈B', result: 'a₁=1,a₄=9' },
      { caseId: 'SQUARE_LINK', condition: '9∈B', result: '3∈A' },
      { caseId: 'SUM', condition: 'T(t)=t²+t', result: 'T(a₂)+T(a₃)+T(a₅)=150' },
      { caseId: 'FINAL', condition: 'ordered natural values and A∩B={1,9}', result: 'A={1,2,3,9,11}; B={1,4,9,81,121}' }
    ] })
  },
  {
    questionUid: uids.q18,
    expected: shell(uids.q18, 'SET_LATTICE_POINT_COUNT', 'integer_lattice_point_count', ['x²+y²=5', '(±1,±2)', '(±2,±1)', 'n(A)=8', 'n(B)=k', 'k=8'], ['ENUMERATE_SIGN_PERMUTATION', 'COUNT_A', 'COUNT_B', 'EQUATE_COUNTS'], { latticePointFamilies: [
      { familyId: 'F1', pattern: '(±1,±2)', count: 4 },
      { familyId: 'F2', pattern: '(±2,±1)', count: 4 }
    ], domainDescription: 'B={x∈N | 1≤x<k+1}={1,2,...,k}', countingResult: 'n(A)=4+4=8=n(B)=k→k=8' }),
    observed: shell(uids.q18, 'SET_LATTICE_POINT_COUNT', 'integer_lattice_point_count', ['x²+y²=5', '(±1,±2)', '(±2,±1)', 'n(A)=8', 'n(B)=k', 'k=8'], ['ENUMERATE_SIGN_PERMUTATION', 'COUNT_A', 'COUNT_B', 'EQUATE_COUNTS'], { latticePointFamilies: [
      { familyId: 'F1', pattern: '(±1,±2)', count: 4 },
      { familyId: 'F2', pattern: '(±2,±1)', count: 4 }
    ], domainDescription: 'B={x∈N | 1≤x<k+1}={1,2,...,k}', countingResult: 'n(A)=4+4=8=n(B)=k→k=8' })
  },
  {
    questionUid: uids.q10,
    expected: shell(uids.q10, 'SET_CARDINALITY_VENN', 'intersection_extrema', ['45명', 'A=28', 'B=23', '최대 x=23', '최소 x=6', '23+6=29'], ['MAX_CONTAINMENT', 'MIN_UNION_FILL', 'SUM_EXTREMA'], { cardinalityByRegion: { maximum: { aOnly: 5, intersection: 23, bOnly: 0, outside: 17 }, minimum: { aOnly: 22, intersection: 6, bOnly: 17, outside: 0 } }, totalCardinality: 45, extremeConfiguration: { maximumIntersection: 23, minimumIntersection: 6, requestedSum: 29 } }),
    observed: shell(uids.q10, 'SET_CARDINALITY_VENN', 'intersection_extrema', ['45명', 'A=28', 'B=23', '최대 x=23', '최소 x=6', '23+6=29'], ['MAX_CONTAINMENT', 'MIN_UNION_FILL', 'SUM_EXTREMA'], { cardinalityByRegion: { maximum: { aOnly: 5, intersection: 23, bOnly: 0, outside: 17 }, minimum: { aOnly: 22, intersection: 6, bOnly: 17, outside: 0 } }, totalCardinality: 45, extremeConfiguration: { maximumIntersection: 23, minimumIntersection: 6, requestedSum: 29 } })
  },
  {
    questionUid: uids.q11,
    expected: shell(uids.q11, 'SET_INCLUSION_VENN', 'mutual_inclusion_equality', ['A−B=∅', 'B−A=∅', 'A⊆B', 'B⊆A', 'A=B'], ['EMPTY_A_ONLY', 'EMPTY_B_ONLY', 'MUTUAL_INCLUSION'], { inclusionDirection: ['A⊆B', 'B⊆A'], strictness: 'non-strict', equality: 'A=B', disjointness: 'A−B=∅ and B−A=∅', boundaryIdentity: { sourceIdentity: 'Aᶜ∩B=B−A' } }),
    observed: shell(uids.q11, 'SET_INCLUSION_VENN', 'mutual_inclusion_equality', ['A−B=∅', 'B−A=∅', 'A⊆B', 'B⊆A', 'A=B'], ['EMPTY_A_ONLY', 'EMPTY_B_ONLY', 'MUTUAL_INCLUSION'], { inclusionDirection: ['A⊆B', 'B⊆A'], strictness: 'non-strict', equality: 'A=B', disjointness: 'A−B=∅ and B−A=∅', boundaryIdentity: { sourceIdentity: 'Aᶜ∩B=B−A' } })
  },
  {
    questionUid: uids.q12,
    expected: shell(uids.q12, 'SET_CASE_PARTITION', 'symmetric_difference_candidate_table', ['a=3,2,−2', 'A△B={0,1}', 'a=2', 'b=6', 'b−a=4'], ['ENUMERATE_CANDIDATES', 'COMPARE_SYMMETRIC_DIFFERENCE', 'SELECT_A2', 'COMPUTE_B_MINUS_A'], { caseRows: [
      { caseId: 'A3', parameter: 3, symmetricDifference: '{1,7}', status: 'REJECT' },
      { caseId: 'A2', parameter: 2, symmetricDifference: '{0,1}', status: 'KEEP', b: 6, result: 'b−a=4' },
      { caseId: 'A-2', parameter: -2, symmetricDifference: '{−4,−3}', status: 'REJECT' }
    ] }),
    observed: shell(uids.q12, 'SET_CASE_PARTITION', 'symmetric_difference_candidate_table', ['a=3,2,−2', 'A△B={0,1}', 'a=2', 'b=6', 'b−a=4'], ['ENUMERATE_CANDIDATES', 'COMPARE_SYMMETRIC_DIFFERENCE', 'SELECT_A2', 'COMPUTE_B_MINUS_A'], { caseRows: [
      { caseId: 'A3', parameter: 3, symmetricDifference: '{1,7}', status: 'REJECT' },
      { caseId: 'A2', parameter: 2, symmetricDifference: '{0,1}', status: 'KEEP', b: 6, result: 'b−a=4' },
      { caseId: 'A-2', parameter: -2, symmetricDifference: '{−4,−3}', status: 'REJECT' }
    ] })
  }
];

const results = facts.map(({ questionUid, expected, observed }) => {
  const expectedValidation = validateFact(expected);
  const observedValidation = validateFact(observed);
  const expectedSemanticSha = expectedValidation.pass ? semanticSha(expected) : null;
  const observedSemanticSha = observedValidation.pass ? semanticSha(observed) : null;
  return {
    questionUid,
    expectedFact: expected,
    observedFact: observed,
    expectedSchemaErrors: expectedValidation.errors,
    observedSchemaErrors: observedValidation.errors,
    expectedSemanticSha,
    observedSemanticSha,
    expectedSemanticContentSha: expectedValidation.pass ? semanticContentSha(expected) : null,
    observedSemanticContentSha: observedValidation.pass ? semanticContentSha(observed) : null,
    expectedStructureFingerprint: expectedValidation.pass ? structureFingerprint(expected) : null,
    observedStructureFingerprint: observedValidation.pass ? structureFingerprint(observed) : null,
    semanticParity: expectedSemanticSha && observedSemanticSha && expectedSemanticSha === observedSemanticSha && semanticContentSha(expected) === semanticContentSha(observed) ? 'PASS' : 'FAIL',
    observedFactExtractionMethod: observed ? 'manual_independent_legacy_reconciliation' : 'MISSING_OBSERVATION',
    provenanceStatus: 'LEGACY_RECONCILIATION_NOT_FRESH_BLIND',
    observationSource: observed ? 'same-file-legacy-fixture' : null
  };
});
const missingObserved = results.filter((result) => !result.observedFact).length;
const parityPass = results.every((result) => result.semanticParity === 'PASS' && result.expectedSchemaErrors.length === 0 && result.observedSchemaErrors.length === 0);
const freshBlind = results.length > 0 && results.every((result) => result.provenanceStatus === 'FRESH_BLIND' && result.observationSource === 'independent-v2-session');
const output = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_BATCH_11_FULL_TYPED_SEMANTIC_PARITY',
  factSchemaVersion: 'LOGIC_VISUAL_FACT_v1',
  status: !parityPass ? 'FAIL_TYPED_FACT_SCHEMA' : freshBlind ? 'PASS_TYPED_FACT_SCHEMA_FRESH_BLIND' : 'BLOCKED_FRESH_BLIND_OBSERVATION_REQUIRED',
  independentFreshBlindStatus: freshBlind ? 'PROVEN' : 'NOT_PROVEN_LEGACY_EVIDENCE',
  missingObservedCount: missingObserved,
  observationContract: {
    required: ['reviewerId', 'reviewSessionId', 'inputBundleSha', 'firstPassEvidenceSha', 'observationSource'],
    sameSessionOrBuilderFixtureForbidden: true,
    builderGeneratedExpectedToObservedCopyForbidden: true
  },
  projectionSpec: 'archive/tools/logic-visual-audit/specs/semantic-projection-spec-v1.json',
  results,
  reportSha: sha(results)
};
fs.writeFileSync(path.join(OUT, 'phase2_batch_11_full_typed_semantic_parity.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, itemCount: results.length, parityPassCount: results.filter((result) => result.semanticParity === 'PASS').length, freshBlind: output.independentFreshBlindStatus, missingObservedCount: output.missingObservedCount, reportSha: output.reportSha }, null, 2));
if (output.status !== 'PASS_TYPED_FACT_SCHEMA_FRESH_BLIND') process.exitCode = 1;
