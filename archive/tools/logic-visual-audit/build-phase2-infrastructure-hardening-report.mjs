import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const typed = read('phase2_batch_11_full_typed_semantic_parity.json');
const structural = read('phase2_2022_set_pilot_structural_fingerprint_adjudication.json');
const baseline = read('phase2_2022_set_pilot_baseline_post_mutation.json');
const mutation = read('phase2_2022_set_pilot_mutation_manifest.json');
const contract = read('phase2_evidence_contract_validation.json');
const calibration = read('phase2_calibration_01_blind_bundle_manifest.json');
const blindValidation = read('phase2_calibration_01_blind_bundle_validation.json');
const output = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_INFRASTRUCTURE_HARDENING',
  status: contract.status === 'PASS_EVIDENCE_CONTRACT' ? 'PASS_INFRASTRUCTURE_READY_FOR_LARGER_BATCH' : 'PARTIAL_LEGACY_MIGRATION_REQUIRED_BEFORE_LARGER_BATCH',
  completed: {
    typedFactSchema: { status: typed.status, passCount: typed.results.filter((result) => result.semanticParity === 'PASS').length, totalCount: typed.results.length },
    structuralFingerprint: { status: structural.status, candidateCount: structural.candidateCount, resolvedCount: structural.resolvedCount },
    freshBlindCalibration: { status: calibration.status, bundleValidation: blindValidation.status, batchId: calibration.batchId, plannedSize: calibration.plannedSize, manifestSha: calibration.manifestSha },
    baselinePostMutation: { status: baseline.status, baselineRef: baseline.baselineRef, recordCount: baseline.recordCount, changedPathCount: baseline.changedPathCount },
    mutationScope: { productionMutationAllowed: mutation.productionMutationAllowed, preExistingDirtyFilesIgnored: mutation.preExistingDirtyFilesIgnored, manifestSha: mutation.manifestSha }
  },
  remainingBeforeNextBatch: {
    evidenceContract: contract.status,
    warnings: contract.warnings,
    nextBatchGate: contract.nextBatchGate,
    requiredActions: [
      'V1/V2 fresh blind session metadata and frozen input SHA',
      'desktop/mobile render evidence with viewport and screenshot/accessibility SHA',
      'separate math verification manifest with INDEPENDENTLY_VERIFIED or explicit BLOCKED status'
    ]
  },
  ruleRefs: [
    'docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md',
    'archive/tools/logic-visual-audit/phase2_evidence_record.template.json',
    'archive/tools/logic-visual-audit/validate-phase2-evidence-contract.mjs'
  ]
};
output.reportSha = sha(output);
fs.writeFileSync(path.join(OUT, 'phase2_infrastructure_hardening_report.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, typedFactSchema: output.completed.typedFactSchema, structuralFingerprint: output.completed.structuralFingerprint, nextBatchGate: output.remainingBeforeNextBatch.nextBatchGate, reportSha: output.reportSha }, null, 2));
