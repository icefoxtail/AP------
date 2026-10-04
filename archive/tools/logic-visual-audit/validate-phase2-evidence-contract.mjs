import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const errors = [];
const warnings = [];
const typed = read('phase2_batch_11_full_typed_semantic_parity.json');
const structural = read('phase2_2022_set_pilot_structural_fingerprint_adjudication.json');
const mutation = read('phase2_2022_set_pilot_mutation_manifest.json');
const render = read('phase2_batch_11_qualification_render.json');
const mathPath = path.join(OUT, 'phase2_batch_11_math_verification.json');
const math = fs.existsSync(mathPath) ? JSON.parse(fs.readFileSync(mathPath, 'utf8')) : null;
const mathValidationPath = path.join(OUT, 'phase2_batch_11_math_verification_validation.json');
const mathValidation = fs.existsSync(mathValidationPath) ? JSON.parse(fs.readFileSync(mathValidationPath, 'utf8')) : null;
const decisionContractPath = path.join(OUT, 'phase2_decision_contract_validation.json');
const decisionContract = fs.existsSync(decisionContractPath) ? JSON.parse(fs.readFileSync(decisionContractPath, 'utf8')) : null;
const typedPass = typed.results.filter((result) => result.semanticParity === 'PASS' && result.expectedSchemaErrors.length === 0 && result.observedSchemaErrors.length === 0);
if (typedPass.length !== typed.results.length) errors.push({ code: 'TYPED_FACT_PARITY_FAIL', pass: typedPass.length, total: typed.results.length });
if (typed.results.some((result) => result.provenanceStatus !== 'FRESH_BLIND' || result.observationSource !== 'independent-v2-session')) errors.push({ code: 'FRESH_BLIND_PROVENANCE_REQUIRED', count: typed.results.filter((result) => result.provenanceStatus !== 'FRESH_BLIND' || result.observationSource !== 'independent-v2-session').length });
if (structural.status !== 'PASS_STRUCTURAL_FINGERPRINT_ADJUDICATED') errors.push({ code: 'STRUCTURAL_DUPLICATE_ADJUDICATION_FAIL', status: structural.status });
if (structural.groups?.some((group) => {
  const expectedApprovalSha = sha({ geometryFingerprint: group.geometryFingerprint, questionUids: group.questionUids, bindings: group.bindings, disposition: group.adjudication?.disposition ?? null });
  return group.adjudicationStatus !== 'RESOLVED' || group.questionSpecificCoverageStatus !== 'PASS' || !group.approvalInputSha || group.approvalInputSha !== expectedApprovalSha || group.adjudication?.approvalInputSha !== expectedApprovalSha || group.bindings?.some((binding) => !binding.artifactSha || !binding.questionSpecificEvidenceSha || binding.artifactExists !== true);
})) errors.push({ code: 'STRUCTURAL_APPROVAL_BINDING_INCOMPLETE' });
if (!decisionContract || decisionContract.status !== 'PASS_DECISION_REQUIREMENT_ACTION_CONTRACT') errors.push({ code: 'DECISION_REQUIREMENT_ACTION_CONTRACT_FAIL', status: decisionContract?.status ?? 'MISSING' });
if (mutation.productionMutationAllowed !== false || mutation.preExistingDirtyFilesIgnored !== true) errors.push({ code: 'MUTATION_SCOPE_CONTRACT_FAIL' });
if (render.status !== 'PASS_QUALIFICATION_RENDER_OBSERVED' || render.entries?.some((entry) => !entry.mobileViewport || !entry.desktopViewport || !entry.screenshotSha || !entry.accessibilitySnapshotSha)) errors.push({ code: 'RENDER_VIEWPORT_MATRIX_OR_WITNESS_INCOMPLETE', required: ['desktop', 'mobile', 'screenshotSha', 'accessibilitySnapshotSha'] });
if (!math || !mathValidation || mathValidation.status !== 'PASS_INDEPENDENT_MATH_VERIFICATION') errors.push({ code: 'MATH_VERIFICATION_EXTERNAL_INDEPENDENCE_PENDING', manifestStatus: math?.status ?? 'MISSING', validationStatus: mathValidation?.status ?? 'MISSING', requiredStatus: 'INDEPENDENTLY_VERIFIED' });
const output = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_EVIDENCE_CONTRACT_VALIDATION',
  contractVersion: 'PHASE2_EVIDENCE_CONTRACT_v1',
  status: errors.length ? 'FAIL_EVIDENCE_CONTRACT' : warnings.length ? 'WARN_LEGACY_EVIDENCE_CONTRACT_REVIEW_REQUIRED' : 'PASS_EVIDENCE_CONTRACT',
  typedFactSchema: { passCount: typedPass.length, totalCount: typed.results.length },
  structuralFingerprint: structural.status,
  mutationScope: mutation.productionMutationAllowed === false ? 'PASS_NO_PRODUCTION_MUTATION' : 'FAIL',
  renderViewportEvidence: render.entries?.every((entry) => entry.mobileViewport && entry.desktopViewport) ? 'PASS_DESKTOP_MOBILE' : 'NOT_TESTED_MOBILE_MATRIX',
  mathVerification: mathValidation?.status ?? (math ? math.status : 'NOT_RECORDED_FOR_LEGACY_BATCH_11'),
  errors,
  warnings,
  nextBatchGate: errors.length ? 'BLOCKED_UNTIL_ERRORS_RESOLVED' : warnings.length ? 'BLOCKED_UNTIL_WARNINGS_ADJUDICATED' : 'OPEN'
};
fs.writeFileSync(path.join(OUT, 'phase2_evidence_contract_validation.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, typedFactPass: `${typedPass.length}/${typed.results.length}`, warningCount: warnings.length, errorCount: errors.length, nextBatchGate: output.nextBatchGate }, null, 2));
if (errors.length) process.exitCode = 1;
