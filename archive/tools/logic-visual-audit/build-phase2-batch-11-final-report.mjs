import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const req = read('phase2_batch_11_requirement_adjudication.json');
const denominator = read('phase2_batch_11_c_denominator_frozen.json');
const gate = read('phase2_batch_11_item_gate.json');
const render = read('phase2_batch_11_qualification_render.json');
const parity = read('phase2_batch_11_typed_semantic_parity.json');
const out = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_BATCH_11_FINAL',
  overallStatus: req.status === 'RESOLVED' && denominator.status === 'FROZEN' && gate.status === 'PASS_TYPED_ITEM_SEMANTIC_GATE' && render.status === 'PASS_QUALIFICATION_RENDER_OBSERVED' && parity.status === 'PASS_TYPED_SEMANTIC_PARITY' ? 'BATCH_11_C_AND_QUALIFICATION_RENDER_PASS_D_SEPARATE' : 'BATCH_11_FAIL',
  productionAuthority: false,
  batchScope: denominator.scope,
  requirementAdjudication: req.status,
  cDenominator: { status: denominator.status, requiredCount: denominator.requiredCount, inputSha: denominator.cDenominatorInputSha, uidSetSha: denominator.logicVisualRequiredUidSetSha, parity: denominator.parity },
  typedSemanticParity: parity.status,
  itemSemanticGate: { status: gate.status, requiredPassCount: gate.requiredPassCount, exemptPassCount: gate.exemptPassCount },
  qualificationRender: { status: render.status, renderedRequiredCount: render.renderedRequiredCount, exemptNoRenderCount: render.exemptNoRenderCount },
  commonCoreDStatus: render.commonCoreDStatus,
  globalPhase1Status: 'INFRASTRUCTURE_READY_V3_FAIL_NOT_ADOPTED',
  remainingPilotItemsAfterBatch: 0,
  nextAction: 'Pilot scope is closed at 50/50; do not promote Overlay or release authority from this pilot-scoped pass.',
};
out.reportSha = sha(out);
fs.writeFileSync(path.join(OUT, 'phase2_batch_11_final_report.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ overallStatus: out.overallStatus, requiredCount: out.cDenominator.requiredCount, requiredPass: out.itemSemanticGate.requiredPassCount, exemptPass: out.itemSemanticGate.exemptPassCount, qualificationRender: out.qualificationRender.status, remainingPilotItemsAfterBatch: out.remainingPilotItemsAfterBatch, reportSha: out.reportSha }, null, 2));
