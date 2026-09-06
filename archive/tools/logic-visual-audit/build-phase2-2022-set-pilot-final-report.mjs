import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { closureFromArgs } from '../pipeline-core/integration.mjs';
import { writeNewJson } from '../pipeline-core/canonical.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const hash = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const read = (name) => {
  const file = path.join(OUT, name);
  if (!fs.existsSync(file)) return { __missing: true, file: name };
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (error) { return { __invalid: true, file: name, error: error.message }; }
};
const isUsable = (value) => value && !value.__missing && !value.__invalid;

const closure = closureFromArgs(ROOT, 'logic-visual', process.argv, [], null);
const outIndex = process.argv.indexOf('--out');
if (closure.status !== 'PASS' && outIndex < 0) throw new Error(`COMMON_PIPELINE_CLOSURE_BLOCKED:${(closure.errors || []).join(';')}`);
const registry = read('phase2_2022_set_pilot_canonical_registry.json');
const registryValidation = read('phase2_2022_set_pilot_canonical_registry_validation.json');
const denominator = read('phase2_2022_set_pilot_c_denominator_closure.json');
const failClosed = read('phase2_batch_11_fail_closed_gate.json');
const evidenceContract = read('phase2_evidence_contract_validation.json');
const typed = read('phase2_batch_11_full_typed_semantic_parity.json');
const math = read('phase2_batch_11_math_verification.json');
const mathValidation = read('phase2_batch_11_math_verification_validation.json');
const calibration = read('phase2_calibration_01_blind_bundle_validation.json');
const decisionContract = read('phase2_decision_contract_validation.json');
const renderReports = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((name) => /^phase2_batch_\d+.*qualification_render\.json$/.test(name)).sort().map(read) : [];

const failures = [];
if (closure.status !== 'PASS') failures.push({ code: 'COMMON_CLOSURE_BLOCKED', errors: closure.errors || [] });
if (!isUsable(registry) || !isUsable(registryValidation) || registryValidation.status !== 'PASS_CANONICAL_REGISTRY_VALIDATION') failures.push({ code: 'CANONICAL_REGISTRY_NOT_VALIDATED', status: registryValidation.status ?? 'MISSING' });
if (!isUsable(denominator) || denominator.status !== 'FROZEN' || denominator.stale === true || !Array.isArray(denominator.requiredUidSet) || !denominator.requiredUidSetSha) failures.push({ code: 'C_DENOMINATOR_NOT_FRESHLY_FROZEN', status: denominator.status ?? 'MISSING' });
if (!isUsable(failClosed) || failClosed.status !== 'PASS_FAIL_CLOSED_GATE') failures.push({ code: 'FAIL_CLOSED_GATE_NOT_PASS', status: failClosed.status ?? 'MISSING' });
if (!isUsable(evidenceContract) || evidenceContract.status !== 'PASS_EVIDENCE_CONTRACT') failures.push({ code: 'EVIDENCE_CONTRACT_NOT_PASS', status: evidenceContract.status ?? 'MISSING' });
if (!isUsable(typed) || typed.status !== 'PASS_TYPED_FACT_SCHEMA_FRESH_BLIND' || typed.independentFreshBlindStatus !== 'PROVEN') failures.push({ code: 'TYPED_FRESH_BLIND_NOT_PROVEN', status: typed.status ?? 'MISSING' });
if (!isUsable(math) || !isUsable(mathValidation) || mathValidation.status !== 'PASS_INDEPENDENT_MATH_VERIFICATION' || math.status !== 'PASS_INDEPENDENT_MATH_VERIFICATION' || math.entries?.some((entry) => entry.status !== 'INDEPENDENTLY_VERIFIED')) failures.push({ code: 'MATH_VERIFICATION_NOT_INDEPENDENT_PASS', status: mathValidation.status ?? math.status ?? 'MISSING' });
if (!isUsable(calibration) || calibration.status !== 'PASS_BLIND_BUNDLE_CONTRACT') failures.push({ code: 'CALIBRATION_BUNDLE_NOT_VALID', status: calibration.status ?? 'MISSING' });
if (!isUsable(decisionContract) || decisionContract.status !== 'PASS_DECISION_REQUIREMENT_ACTION_CONTRACT') failures.push({ code: 'DECISION_REQUIREMENT_ACTION_CONTRACT_FAIL', status: decisionContract.status ?? 'MISSING' });
if (!renderReports.length) failures.push({ code: 'RENDER_REPORTS_MISSING' });
for (const report of renderReports) {
  if (!isUsable(report) || report.status !== 'PASS_QUALIFICATION_RENDER_OBSERVED') failures.push({ code: 'RENDER_REPORT_NOT_PASS', file: report.file ?? null, status: report.status ?? 'MISSING' });
  for (const entry of report.entries ?? []) if (!entry.desktopViewport || !entry.mobileViewport || !entry.screenshotSha || !entry.accessibilitySnapshotSha) failures.push({ code: 'RENDER_WITNESS_MATRIX_INCOMPLETE', questionUid: entry.questionUid ?? null });
}

const requiredCount = isUsable(denominator) && Array.isArray(denominator.requiredUidSet) ? denominator.requiredUidSet.length : 0;
const overallPass = failures.length === 0;
const report = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_2022_SET_PILOT_FINAL_FAIL_CLOSED',
  overallStatus: overallPass ? 'PASS — ALL_REQUIRED_EVIDENCE_CLOSED' : 'FAIL — 검수 인프라 또는 evidence 결함 존재',
  publicationStatus: 'NOT_PUBLISHED',
  productionAuthority: false,
  closure: { status: closure.status, inputSha: closure.inputSha ?? null, errors: closure.errors ?? [] },
  canonicalRegistry: { status: registry.status ?? 'MISSING', validationStatus: registryValidation.status ?? 'MISSING', registrySha: registry.registrySha ?? null, activeCanonicalQuestionCount: registry.activeCanonicalQuestionCount ?? null },
  denominatorClosure: { status: denominator.status ?? 'MISSING', stale: denominator.stale ?? null, requiredCount, inputSha: denominator.cDenominatorInputSha ?? null, requiredUidSetSha: denominator.requiredUidSetSha ?? null },
  typedSemanticParity: { status: typed.status ?? 'MISSING', independentFreshBlindStatus: typed.independentFreshBlindStatus ?? null },
  mathVerification: mathValidation.status ?? math.status ?? 'MISSING',
  calibration: calibration.status ?? 'MISSING',
  decisionContract: decisionContract.status ?? 'MISSING',
  renderEvidence: { reportCount: renderReports.length, browserStatus: renderReports.every((item) => item.status === 'PASS_QUALIFICATION_RENDER_OBSERVED') ? 'PASS' : 'FAIL' },
  failClosedGate: { status: failClosed.status ?? 'MISSING', failureCount: failClosed.failureCount ?? null },
  evidenceContract: evidenceContract.status ?? 'MISSING',
  failureCount: failures.length,
  failures,
  nextAction: overallPass ? 'Keep production authority disabled until release-manager authorization is separately recorded.' : 'Resolve every listed gate, regenerate current evidence, then rerun the full fail-closed gate.',
  reportSha: hash({ closure, registry, registryValidation, denominator, failClosed, evidenceContract, typed, math, mathValidation, calibration, decisionContract, renderReports, failures })
};

if (outIndex >= 0) {
  if (!process.argv[outIndex + 1]) throw new Error('--out requires a new JSON path');
  const target = path.resolve(process.argv[outIndex + 1]);
  if (target.startsWith(`${path.resolve(ROOT, 'archive/exams')}${path.sep}`) || target.startsWith(`${path.resolve(ROOT, 'archive/assets')}${path.sep}`)) throw new Error('PRODUCTION_REPORT_OUTPUT_FORBIDDEN');
  writeNewJson(target, report);
}
console.log(JSON.stringify(report, null, 2));
if (!overallPass) process.exitCode = 1;
