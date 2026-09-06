import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const adjudication = read('phase2_batch_01_requirement_adjudication.json');
const denominator = read('phase2_batch_01_c_denominator_frozen.json');
const gate = read('phase2_batch_01_item_gate.json');
const render = read('phase2_batch_01_qualification_render.json');
const semantic = read('phase2_typed_semantic_parity.json');
const q14Semantic = read('phase2_q14_typed_semantic_parity.json');
const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_BATCH_01_FINAL',
  overallStatus: gate.status === 'PASS_TYPED_ITEM_SEMANTIC_GATE' && render.status === 'PASS_QUALIFICATION_RENDER_OBSERVED' && adjudication.status === 'RESOLVED' && denominator.status === 'FROZEN' && semantic.status === 'PASS_TYPED_SEMANTIC_PARITY' && q14Semantic.status === 'PASS_TYPED_SEMANTIC_PARITY' ? 'BATCH_01_C_AND_QUALIFICATION_RENDER_PASS_D_SEPARATE' : 'BATCH_01_FAIL',
  productionAuthority: false,
  batchScope: denominator.scope,
  requirementAdjudication: adjudication.status,
  cDenominator: { status: denominator.status, requiredCount: denominator.requiredCount, inputSha: denominator.cDenominatorInputSha, uidSetSha: denominator.logicVisualRequiredUidSetSha, parity: denominator.parity },
  itemSemanticGate: { status: gate.status, passCount: gate.logicVisualItemPassCount, failCount: gate.logicVisualItemFailCount },
  typedSemanticParity: { q20Q17: semantic.status, q14: q14Semantic.status },
  qualificationRender: { status: render.status, resultCount: render.resultCount },
  commonCoreDStatus: render.commonCoreDStatus,
  globalPhase1Status: 'INFRASTRUCTURE_READY_V3_FAIL_NOT_ADOPTED',
  remainingPilotItemsAfterBatch: 47,
  nextAction: 'Proceed to Phase 2 batch 02; do not promote Overlay or release authority from this pilot-scoped pass.',
  evidence: {
    requirementAdjudication: 'reports/phase2_batch_01_requirement_adjudication.json',
    denominator: 'reports/phase2_batch_01_c_denominator_frozen.json',
    itemGate: 'reports/phase2_batch_01_item_gate.json',
    qualificationRender: 'reports/phase2_batch_01_qualification_render.json',
    q20Q17Semantic: 'reports/phase2_typed_semantic_parity.json',
    q14Semantic: 'reports/phase2_q14_typed_semantic_parity.json'
  }
};
output.reportSha = sha256(output);
fs.writeFileSync(path.join(OUT, 'phase2_batch_01_final_report.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ overallStatus: output.overallStatus, productionAuthority: output.productionAuthority, requiredCount: output.cDenominator.requiredCount, itemPassCount: output.itemSemanticGate.passCount, qualificationRender: output.qualificationRender.status, commonCoreDStatus: output.commonCoreDStatus, reportSha: output.reportSha }, null, 2));
