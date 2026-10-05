import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const requirement = read('phase2_batch_02_requirement_adjudication.json');
const denominator = read('phase2_batch_02_c_denominator_frozen.json');
const gate = read('phase2_batch_02_item_gate.json');
const render = read('phase2_batch_02_qualification_render.json');
const semantic = read('phase2_batch_02_semantic_parity.json');
const output = {
  generatedAtKst: '2026-09-05', phase: 'LOGIC_VISUAL_PHASE_2_BATCH_02_FINAL',
  overallStatus: requirement.status === 'RESOLVED' && denominator.status === 'FROZEN' && semantic.status === 'PASS_TYPED_SEMANTIC_PARITY' && gate.status === 'PASS_TYPED_ITEM_SEMANTIC_GATE' && render.status === 'PASS_QUALIFICATION_RENDER_OBSERVED' ? 'BATCH_02_C_AND_QUALIFICATION_RENDER_PASS_D_SEPARATE' : 'BATCH_02_FAIL',
  productionAuthority: false, batchScope: denominator.scope, requirementAdjudication: requirement.status,
  cDenominator: { status: denominator.status, requiredCount: denominator.requiredCount, inputSha: denominator.cDenominatorInputSha, uidSetSha: denominator.logicVisualRequiredUidSetSha, parity: denominator.parity },
  typedSemanticParity: semantic.status, itemSemanticGate: { status: gate.status, passCount: gate.logicVisualItemPassCount, failCount: gate.logicVisualItemFailCount }, qualificationRender: { status: render.status, resultCount: render.resultCount }, commonCoreDStatus: render.commonCoreDStatus, globalPhase1Status: 'INFRASTRUCTURE_READY_V3_FAIL_NOT_ADOPTED', remainingPilotItemsAfterBatch: 44, nextAction: 'Proceed to Phase 2 batch 03; do not promote Overlay or release authority from this pilot-scoped pass.'
};
output.reportSha = sha256(output);
fs.writeFileSync(path.join(OUT, 'phase2_batch_02_final_report.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ overallStatus: output.overallStatus, requiredCount: output.cDenominator.requiredCount, itemPassCount: output.itemSemanticGate.passCount, qualificationRender: output.qualificationRender.status, remainingPilotItemsAfterBatch: output.remainingPilotItemsAfterBatch, reportSha: output.reportSha }, null, 2));
