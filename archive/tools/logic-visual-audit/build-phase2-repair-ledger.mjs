import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './lib/io.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TOOL = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit');
const REPORTS = path.join(TOOL, 'reports');

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(REPORTS, name), 'utf8'));
const v3 = readJson('v3_failure_adjudication.json');
const duplicateAudit = readJson('visual_structure_duplicate_adjudication.json');
const inputReports = {
  v3FailureAdjudication: 'archive/tools/logic-visual-audit/reports/v3_failure_adjudication.json',
  structuralDuplicateAdjudication: 'archive/tools/logic-visual-audit/reports/visual_structure_duplicate_adjudication.json',
  qualificationReport: 'archive/tools/logic-visual-audit/reports/qualification_report_phase1.json'
};
const inputSha = sha256(Object.fromEntries(Object.entries(inputReports).map(([key, relative]) => [key, {
  path: relative,
  sha256: sha256(fs.readFileSync(path.join(ROOT, relative.replaceAll('/', path.sep))))
}])));

const actionForRootCause = {
  OBSERVATION_INSUFFICIENT: {
    priority: 1,
    repairTrack: 'V2_OBSERVED_EXTRACTOR_OR_INDEPENDENT_OBSERVATION',
    allowedScope: 'qualification tooling / artifact-only observation evidence',
    requiredEvidence: [
      'typed observed fact or explicit manual-independent observation',
      'V2 first-pass evidence freeze',
      'V3 parity rerun under a new qualification attempt'
    ],
    productionMutationAllowed: false
  },
  SOURCE_BLOCKED: {
    priority: 1,
    repairTrack: 'V1_SOURCE_REVIEW',
    allowedScope: 'source/provenance recovery and independent V1 adjudication',
    requiredEvidence: [
      'resolved source/provenance reference',
      'replacement V1 expected-fact evidence',
      'denominator invalidation and re-freeze if classification changes'
    ],
    productionMutationAllowed: false
  },
  ARTIFACT_SEMANTIC_MISMATCH: {
    priority: 2,
    repairTrack: 'PRODUCTION_ARTIFACT_ADJUDICATION',
    allowedScope: 'Phase 2 only; rebuild or remove invalid linkage after approval',
    requiredEvidence: [
      'question-specific expected/observed semantic adjudication',
      'visualAction parity evidence',
      'C denominator stale → re-freeze after any attachment/action change',
      'new V1/V2/V3 evidence for the changed UID'
    ],
    productionMutationAllowed: false
  }
};

function makeRepairEntry(entry) {
  const policy = actionForRootCause[entry.rootCause] ?? {
    priority: 3,
    repairTrack: 'UNCLASSIFIED_REVIEW',
    allowedScope: 'manual adjudication required',
    requiredEvidence: ['new independent evidence'],
    productionMutationAllowed: false
  };
  return {
    questionUid: entry.questionUid,
    priorParityStatus: entry.priorParityStatus,
    rootCause: entry.rootCause,
    recommendedAction: entry.recommendedAction,
    priority: policy.priority,
    repairTrack: policy.repairTrack,
    allowedScope: policy.allowedScope,
    requiredEvidence: policy.requiredEvidence,
    productionMutationAllowed: policy.productionMutationAllowed,
    evidenceSummary: entry.evidenceSummary,
    sourceReport: 'reports/v3_failure_adjudication.json'
  };
}

const v3Entries = v3.entries.map(makeRepairEntry);
const duplicateEntries = duplicateAudit.groups.map((group) => ({
  repairTrack: 'STRUCTURAL_DUPLICATE_ADJUDICATION',
  priority: 1,
  fingerprint: group.fingerprint,
  questionUids: group.questionUids,
  status: group.status,
  reason: group.reason,
  allowedScope: 'Phase 2 artifact provenance review; no blanket asset replacement',
  requiredEvidence: [
    'question-specific expected semantic projection for every UID',
    'explicit shared provenance only if semantic projection is identical',
    'otherwise rebuild/remove invalid linkage per UID'
  ],
  productionMutationAllowed: false,
  sourceReport: 'reports/visual_structure_duplicate_adjudication.json'
}));

const counts = Object.fromEntries([...new Set(v3Entries.map((entry) => entry.rootCause))].map((key) => [key, v3Entries.filter((entry) => entry.rootCause === key).length]));
const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_QUALIFICATION_PHASE_2_REPAIR_LOOP',
  status: 'PHASE2_REPAIR_PLAN_READY_NOT_APPLIED',
  scope: 'Repair planning and qualification evidence routing only; production files intentionally unchanged.',
  productionMutationCount: 0,
  sourceInputSha: inputSha,
  v3FailureCount: v3Entries.length,
  v3RootCauseCounts: counts,
  structuralDuplicateGroupCount: duplicateEntries.length,
  blockingWorkOrder: [
    '1. Resolve observation-insufficient and source-blocked cases without using hidden source/solution data in V2.',
    '2. Adjudicate structural template reuse before any asset is reused or removed.',
    '3. Repair artifact semantic mismatches only in Phase 2 and invalidate/re-freeze C denominator after action changes.',
    '4. Run a new qualification attempt with fresh V1/V2/V3 evidence; do not overwrite Phase 1 evidence.',
    '5. Use a new unseen holdout if qualification inputs or verifier/extractor change.'
  ],
  v3RepairEntries: v3Entries.sort((a, b) => a.priority - b.priority || a.questionUid.localeCompare(b.questionUid)),
  structuralDuplicateEntries: duplicateEntries.sort((a, b) => a.fingerprint.localeCompare(b.fingerprint)),
  invariants: {
    phase1EvidencePreserved: true,
    v2BlindContractPreserved: true,
    productionMassEditAllowed: false,
    overlayAdoptionAllowed: false,
    denominatorMayBeReusedAfterRepair: false
  },
  note: 'This ledger is a bounded Phase 2 handoff. It does not convert V3 BLOCKED/FAIL into PASS and it does not authorize production edits.'
};

fs.writeFileSync(path.join(REPORTS, 'phase2_repair_ledger.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
const markdown = [
  '# Logic Visual Phase 2 Repair Ledger',
  '',
  `- 상태: **${output.status}**`,
  `- production mutation count: **${output.productionMutationCount}**`,
  `- V3 adjudication entries: **${output.v3FailureCount}**`,
  `- structural duplicate groups: **${output.structuralDuplicateGroupCount}**`,
  `- source input SHA: \`${output.sourceInputSha}\``,
  '',
  '## Repair tracks',
  '',
  `- V2 observed extractor / independent observation: **${counts.OBSERVATION_INSUFFICIENT ?? 0}**`,
  `- V1 source review: **${counts.SOURCE_BLOCKED ?? 0}**`,
  `- production artifact adjudication: **${counts.ARTIFACT_SEMANTIC_MISMATCH ?? 0}**`,
  `- structural template reuse review: **${output.structuralDuplicateGroupCount} groups**`,
  '',
  '## Required order',
  '',
  ...output.blockingWorkOrder.map((item, index) => `${index + 1}. ${item.replace(/^\d+\.\s*/, '')}`),
  '',
  '## Guardrails',
  '',
  '- Phase 1 V1/V2/V3 evidence is preserved and not rewritten.',
  '- V2 cannot use source answer, solution, expected fact, alt/caption, or previous verdict.',
  '- Any changed visual attachment/action invalidates C denominator evidence and requires re-freeze.',
  '- Any verifier/extractor/rule/corpus change requires a new qualification attempt and new unseen holdout when applicable.',
  '- This ledger does not authorize production bulk edits or Overlay adoption.',
  '',
  '## Evidence',
  '',
  '- [V3 failure adjudication](./v3_failure_adjudication.json)',
  '- [Structural duplicate adjudication](./visual_structure_duplicate_adjudication.json)',
  '- [Phase 1 qualification report](./qualification_report_phase1.md)',
  ''
].join('\n');
fs.writeFileSync(path.join(REPORTS, 'phase2_repair_ledger.md'), markdown, 'utf8');
console.log(JSON.stringify({
  status: output.status,
  v3FailureCount: output.v3FailureCount,
  v3RootCauseCounts: output.v3RootCauseCounts,
  structuralDuplicateGroupCount: output.structuralDuplicateGroupCount,
  productionMutationCount: output.productionMutationCount,
  sourceInputSha: output.sourceInputSha
}, null, 2));
