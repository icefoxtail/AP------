import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const mutate = process.argv.find((arg) => arg.startsWith('--mutate='))?.split('=')[1] ?? null;
const req = read('phase2_batch_11_requirement_adjudication.json');
const denominator = read('phase2_batch_11_c_denominator_frozen.json');
const closure = read('phase2_2022_set_pilot_c_denominator_closure.json');
const gate = read('phase2_batch_11_item_gate.json');
const typed = read('phase2_batch_11_full_typed_semantic_parity.json');
const render = read('phase2_batch_11_qualification_render.json');
const contract = read('phase2_evidence_contract_validation.json');
const mathPath = path.join(OUT, 'phase2_batch_11_math_verification.json');
const math = fs.existsSync(mathPath) ? JSON.parse(fs.readFileSync(mathPath, 'utf8')) : null;
const preparationPath = path.join(OUT, 'phase2_batch_11_input_preparation.json');
const preparation = fs.existsSync(preparationPath) ? JSON.parse(fs.readFileSync(preparationPath, 'utf8')) : null;

if (mutate === 'render-fail') render.status = 'FAIL_QUALIFICATION_RENDER';
if (mutate === 'fact-fail' && typed.results[0]) typed.results[0].semanticParity = 'FAIL';
if (mutate === 'c-stale') denominator.stale = true;
if (mutate === 'missing-item') gate.results = gate.results.filter((entry) => entry.logicVisualItemStatus !== 'PASS').concat(gate.results.filter((entry) => entry.logicVisualItemStatus === 'PASS').slice(1));

const failures = [];
const required = new Set(denominator.logicVisualRequiredUidSet ?? []);
const adjudicatedRequired = new Set(req.requiredUidSet ?? []);
if (req.status !== 'RESOLVED') failures.push({ code: 'REQUIREMENT_ADJUDICATION_NOT_RESOLVED', status: req.status });
if (preparation?.legacyOutputsInvalidated?.some((item) => item.path === 'phase2_batch_11_requirement_adjudication.json')) failures.push({ code: 'REQUIREMENT_ADJUDICATION_LEGACY_INVALIDATED' });
if (preparation?.legacyOutputsInvalidated?.some((item) => item.path === 'phase2_batch_11_c_denominator_frozen.json')) failures.push({ code: 'BATCH_DENOMINATOR_LEGACY_INVALIDATED' });
if (denominator.status !== 'FROZEN' || denominator.stale === true) failures.push({ code: 'C_DENOMINATOR_NOT_FROZEN_OR_STALE', status: denominator.status, stale: denominator.stale });
if (closure.status !== 'FROZEN' || closure.stale === true) failures.push({ code: 'C_CLOSURE_NOT_FROZEN_OR_STALE', status: closure.status, stale: closure.stale });
if (required.size === 0 || required.size !== adjudicatedRequired.size || [...required].some((uid) => !adjudicatedRequired.has(uid))) failures.push({ code: 'C_UID_SET_MISMATCH', denominatorCount: required.size, adjudicatedCount: adjudicatedRequired.size });
const closureUids = new Set(closure.requiredUidSet ?? []);
if ([...required].some((uid) => !closureUids.has(uid))) failures.push({ code: 'BATCH_REQUIRED_UID_OUTSIDE_CLOSURE', questionUids: [...required].filter((uid) => !closureUids.has(uid)) });
if (render.status !== 'PASS_QUALIFICATION_RENDER_OBSERVED') failures.push({ code: 'RENDER_REPORT_NOT_PASS', status: render.status });
if (contract.status !== 'PASS_EVIDENCE_CONTRACT') failures.push({ code: 'EVIDENCE_CONTRACT_NOT_PASS', status: contract.status, warnings: contract.warnings });
if (typed.status !== 'PASS_TYPED_FACT_SCHEMA_FRESH_BLIND' || typed.independentFreshBlindStatus !== 'PROVEN') failures.push({ code: 'TYPED_REPORT_NOT_FRESH_BLIND_PASS', status: typed.status, freshBlind: typed.independentFreshBlindStatus });
if (!math || math.status !== 'PASS_INDEPENDENT_MATH_VERIFICATION') failures.push({ code: 'MATH_REPORT_NOT_INDEPENDENT_PASS', status: math?.status ?? 'MISSING' });
const gateByUid = new Map((gate.results ?? []).map((entry) => [entry.questionUid, entry]));
const typedByUid = new Map((typed.results ?? []).map((entry) => [entry.questionUid, entry]));
for (const uid of required) {
  const item = gateByUid.get(uid);
  if (!item || item.logicVisualItemStatus !== 'PASS') failures.push({ code: 'REQUIRED_ITEM_NOT_PASS', questionUid: uid, observed: item?.logicVisualItemStatus ?? 'MISSING' });
  const fact = typedByUid.get(uid);
  if (!fact || fact.semanticParity !== 'PASS' || fact.expectedSchemaErrors.length || fact.observedSchemaErrors.length || fact.expectedSemanticContentSha !== fact.observedSemanticContentSha) failures.push({ code: 'TYPED_SEMANTIC_EVIDENCE_NOT_PASS', questionUid: uid, observed: fact ? { semanticParity: fact.semanticParity, expectedSchemaErrors: fact.expectedSchemaErrors, observedSchemaErrors: fact.observedSchemaErrors, contentShaEqual: fact.expectedSemanticContentSha === fact.observedSemanticContentSha } : 'MISSING' });
  if (!fact || fact.provenanceStatus !== 'FRESH_BLIND') failures.push({ code: 'FRESH_BLIND_PROVENANCE_MISSING', questionUid: uid, observed: fact?.provenanceStatus ?? 'MISSING' });
  if (!math || !math.entries?.find((entry) => entry.questionUid === uid && entry.status === 'INDEPENDENTLY_VERIFIED')) failures.push({ code: 'MATH_VERIFICATION_MISSING', questionUid: uid });
}
const result = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_FAIL_CLOSED_FINAL_GATE',
  gateVersion: 'FAIL_CLOSED_GATE_v1',
  mode: mutate ? `MUTATION_TEST_${mutate}` : 'NORMAL',
  status: failures.length ? 'FAIL_FAIL_CLOSED_GATE' : 'PASS_FAIL_CLOSED_GATE',
  requiredCount: required.size,
  failureCount: failures.length,
  failures,
  reportSha: sha(failures)
};
if (!mutate) fs.writeFileSync(path.join(OUT, 'phase2_batch_11_fail_closed_gate.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, mode: result.mode, requiredCount: result.requiredCount, failureCount: result.failureCount, reportSha: result.reportSha }, null, 2));
if (result.status !== 'PASS_FAIL_CLOSED_GATE' && !mutate) process.exitCode = 1;
if (mutate && result.status !== 'FAIL_FAIL_CLOSED_GATE') process.exitCode = 1;
