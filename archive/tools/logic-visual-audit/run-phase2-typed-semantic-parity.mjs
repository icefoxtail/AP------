import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { sha256, validateFact, semanticSha } from './lib/canonicalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TOOL = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit');
const OUT = path.join(TOOL, 'reports');
const projectionSpec = JSON.parse(fs.readFileSync(path.join(TOOL, 'specs', 'semantic-projection-spec-v1.json'), 'utf8'));
const v1 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v1_expected_visual_facts_batch_01.json'), 'utf8'));
const v2Q20 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v2_observed_facts_batch_01.json'), 'utf8')).entries.find((entry) => entry.questionUid.includes('|20'));
const v2Q17 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v2_q17_observed_facts_retry.json'), 'utf8')).entries[0];
const expectedByUid = new Map(v1.entries.map((entry) => [entry.questionUid, entry.expectedLogicalFact]));

function q20CaseId(parameterValue, elements) {
  return `S${elements.length}_C${String(parameterValue).padStart(2, '0')}_E${elements.map((value) => String(value).padStart(2, '0')).join('_')}`;
}

function normalizeExpectedQ20(fact) {
  return fact.caseRows.map((row) => ({
    caseId: row.caseId,
    caseCondition: row.caseCondition,
    caseElements: row.caseElements,
    parameterValue: row.parameterValue,
    countContribution: row.countContribution
  }));
}

function normalizeObservedQ20(fact) {
  const rows = [];
  for (const group of fact.caseRows) {
    const caseMatch = group.visibleCaseLabel.match(/\|S\|=(\d+)/);
    const caseSize = Number(caseMatch?.[1]);
    const contribution = caseSize === 2 ? 4 : 8;
    for (const visible of group.visibleRows) {
      const match = visible.visibleText.match(/^\((\d+),\{([^}]+)\}\)$/);
      if (!match) throw new Error(`unparseable q20 visible row: ${visible.visibleText}`);
      const parameterValue = Number(match[1]);
      const elements = match[2].split(',').map(Number);
      rows.push({ caseId: q20CaseId(parameterValue, elements), caseCondition: `|S|=${caseSize}`, caseElements: elements, parameterValue, countContribution: contribution });
    }
  }
  return rows;
}

function normalizeExpectedQ17(fact) {
  return fact.caseRows.filter((row) => row.caseId === 'N21_PAIR_01_20' || row.caseId.startsWith('N21_PAIR_')).map((row) => ({
    caseId: row.caseId,
    caseCondition: row.caseCondition,
    caseElements: row.caseElements,
    parameterValue: row.parameterValue,
    derivedFacts: row.derivedFacts.filter((item) => item.factId === 'collisionOutput'),
    countContribution: row.countContribution
  }));
}

function normalizeObservedQ17(fact) {
  return fact.caseRows.map((row) => {
    const values = row.pairText.match(/\((\d+),(\d+)\)/);
    if (!values) throw new Error(`unparseable q17 pair: ${row.pairText}`);
    return {
      caseId: `N21_PAIR_${String(Number(values[1])).padStart(2, '0')}_${String(Number(values[2])).padStart(2, '0')}`,
      caseCondition: 'n=21',
      caseElements: [Number(values[1]), Number(values[2])],
      parameterValue: 21,
      derivedFacts: [{ factId: 'collisionOutput', value: Number(row.outputText) }],
      countContribution: 1
    };
  });
}

function factShell(source, caseRows) {
  return {
    factSchemaVersion: 'LOGIC_VISUAL_FACT_v1',
    questionUid: source.questionUid,
    unit: '집합',
    visualType: 'SET_CASE_PARTITION',
    visualRole: 'CASE_PARTITION',
    requiredLabels: [],
    decisiveStepIds: [],
    caseRows
  };
}

const q20Uid = [...expectedByUid.keys()].find((uid) => uid.endsWith('|20'));
const q17Uid = [...expectedByUid.keys()].find((uid) => uid.endsWith('|17'));
const pairs = [
  { uid: q20Uid, expected: factShell(expectedByUid.get(q20Uid), normalizeExpectedQ20(expectedByUid.get(q20Uid))), observed: factShell(v2Q20.observedVisualFact, normalizeObservedQ20(v2Q20.observedVisualFact)), artifactSha: v2Q20.artifactSha256 },
  { uid: q17Uid, expected: factShell(expectedByUid.get(q17Uid), normalizeExpectedQ17(expectedByUid.get(q17Uid))), observed: factShell(v2Q17.observedVisualFact, normalizeObservedQ17(v2Q17.observedVisualFact)), artifactSha: v2Q17.artifactSha256 }
];

const results = pairs.map(({ uid, expected, observed, artifactSha }) => {
  const expectedValidation = validateFact(expected);
  const observedValidation = validateFact(observed);
  const expectedErrors = expectedValidation.errors;
  const observedErrors = observedValidation.errors;
  const expectedSemanticSha = expectedErrors.length ? null : semanticSha(expected);
  const observedSemanticSha = observedErrors.length ? null : semanticSha(observed);
  const parity = Boolean(expectedSemanticSha && observedSemanticSha && expectedSemanticSha === observedSemanticSha);
  return {
    questionUid: uid,
    artifactSha,
    expectedSchemaErrors: expectedErrors,
    observedSchemaErrors: observedErrors,
    expectedFactSha: sha256(expected),
    observedFactSha: sha256(observed),
    expectedSemanticSha,
    observedSemanticSha,
    semanticParity: parity ? 'PASS' : 'FAIL',
    normalizedCaseRowCount: { expected: expected.caseRows.length, observed: observed.caseRows.length },
    itemSemanticGateStatus: parity && !expectedErrors.length && !observedErrors.length ? 'CANDIDATE_TYPED_PARITY_PASS_NOT_FINAL' : 'FAIL'
  };
});

const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_TYPED_SEMANTIC_PARITY',
  status: results.every((result) => result.semanticParity === 'PASS') ? 'PASS_TYPED_SEMANTIC_PARITY' : 'FAIL_TYPED_SEMANTIC_PARITY',
  projectionScope: 'Phase 2 adjudicated visual caseRows only: displayed candidate rows and displayed collision rows; hidden derivation branches are not projected into the artifact parity field.',
  projectionSpecSha: sha256(projectionSpec),
  results,
  cDenominatorStatus: 'STALE_REQUIRED_AFTER_Q17_ARTIFACT_CHANGE',
  commonCoreDStatus: 'NOT_TESTED_LOCAL_BROWSER_FILE_URL_BLOCKED',
  reportSha: sha256(JSON.stringify(results))
};
fs.writeFileSync(path.join(OUT, 'phase2_typed_semantic_parity.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, itemCount: results.length, parityPassCount: results.filter((result) => result.semanticParity === 'PASS').length, reportSha: output.reportSha }, null, 2));
if (output.status !== 'PASS_TYPED_SEMANTIC_PARITY') process.exitCode = 1;
