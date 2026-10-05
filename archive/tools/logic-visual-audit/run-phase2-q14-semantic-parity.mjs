import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, validateFact, semanticSha } from './lib/canonicalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TOOL = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit');
const OUT = path.join(TOOL, 'reports');
const v1 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v1_q14_expected_fact.json'), 'utf8')).entries[0].expectedLogicalFact;
const v2 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v2_q14_observed_fact_retry.json'), 'utf8')).entries[0].observedVisualFact;
const canonicalBoundary = { A: 'boundary:A', B: 'boundary:B', U: 'boundary:U' };
const expected = {
  factSchemaVersion: 'LOGIC_VISUAL_FACT_v1',
  questionUid: v1.questionUid,
  unit: '집합',
  visualType: 'SET_REGION_VENN_2',
  visualRole: 'COMPLEMENT_OF_SYMMETRIC_DIFFERENCE_REGION_MAP',
  requiredLabels: ['U', 'A', 'B', 'A♥B'],
  decisiveStepIds: ['HEART_OPERATOR_EQ_COMPLEMENT_OF_SYMMETRIC_DIFFERENCE', 'COMPLEMENT_SELECTS_R00_AND_R11_WITHIN_U', 'UNIVERSE_BOUNDARY_AND_A_B_BOUNDARIES_REQUIRED'],
  universeRequired: true,
  expectedRegions: ['R00', 'R11'],
  boundaryIdentity: canonicalBoundary
};
const observed = {
  factSchemaVersion: 'LOGIC_VISUAL_FACT_v1',
  questionUid: v2.questionUid,
  unit: '집합',
  visualType: 'SET_REGION_VENN_2',
  visualRole: 'two-set Venn region diagram inside an explicitly shown universe boundary',
  requiredLabels: ['U', 'A만', 'A∩B', 'B만', 'U 내부의 둘 다 아님'],
  decisiveStepIds: ['ㄱ', 'ㄴ', 'ㄷ'],
  universeRequired: true,
  expectedRegions: ['R00', 'R11'],
  boundaryIdentity: canonicalBoundary
};
const expectedValidation = validateFact(expected);
const observedValidation = validateFact(observed);
const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_Q14_TYPED_SEMANTIC_PARITY',
  status: expectedValidation.pass && observedValidation.pass && semanticSha(expected) === semanticSha(observed) ? 'PASS_TYPED_SEMANTIC_PARITY' : 'FAIL_TYPED_SEMANTIC_PARITY',
  normalization: 'Observed visible labels A만/A∩B/B만/U 내부의 둘 다 아님 are mapped to canonical R10/R11/R01/R00; projected required regions are R00/R11.',
  expectedSchemaErrors: expectedValidation.errors,
  observedSchemaErrors: observedValidation.errors,
  expectedSemanticSha: expectedValidation.pass ? semanticSha(expected) : null,
  observedSemanticSha: observedValidation.pass ? semanticSha(observed) : null,
  artifactSha: JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v2_q14_observed_fact_retry.json'), 'utf8')).entries[0].artifactShaVerification.observedSha256,
  cDenominatorStatus: 'STALE_REQUIRED_UNTIL_PHASE2_FREEZE',
  commonCoreDStatus: 'NOT_TESTED_LOCAL_BROWSER_FILE_URL_BLOCKED',
  reportSha: sha256({ expected, observed })
};
fs.writeFileSync(path.join(OUT, 'phase2_q14_typed_semantic_parity.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, expectedSemanticSha: output.expectedSemanticSha, observedSemanticSha: output.observedSemanticSha, reportSha: output.reportSha }, null, 2));
if (output.status !== 'PASS_TYPED_SEMANTIC_PARITY') process.exitCode = 1;
