import test from 'node:test';
import assert from 'node:assert/strict';
import {objectSha} from '../../pipeline-core/canonical.mjs';
import {RepairBudget} from '../production/repair-budget.mjs';

test('an exact completed repair is replayed without spending another shared-budget entry',()=>{
  const inputSha=objectSha({formulaWidthPx:143.84375,panelPx:140,sourceSha256:'source',policySha256:'policy'});
  const outputSha=objectSha({panelPx:167.9,paddingPx:24});
  const first=new RepairBudget(),created=first.record('LAYOUT',inputSha,'MEASURED_GRAPH_FORMULA_PANEL_OVERFLOW',outputSha);
  assert.equal(created.replayed,false);assert.equal(created.resumed,false);assert.equal(first.ledger.length,1);
  const resumed=new RepairBudget(JSON.parse(JSON.stringify(first.ledger)));
  const replay=resumed.record('LAYOUT',inputSha,'MEASURED_GRAPH_FORMULA_PANEL_OVERFLOW',outputSha);
  assert.equal(replay.replayed,true);assert.equal(replay.resumed,false);assert.equal(resumed.ledger.length,1);
  assert.deepEqual(resumed.ledger,first.ledger);
  assert.throws(()=>resumed.record('LAYOUT',inputSha,'MEASURED_GRAPH_FORMULA_PANEL_OVERFLOW',objectSha({panelPx:168,paddingPx:24})),/REPAIR_OUTPUT_MISMATCH/);
});

test('an interrupted exact repair completes its existing entry and changed inputs spend a distinct entry',()=>{
  const inputSha=objectSha({formulaWidthPx:143.84375,panelPx:140}),outputSha=objectSha({panelPx:167.9});
  const interrupted=new RepairBudget(),pending=interrupted.consume('LAYOUT',inputSha,'MEASURED_GRAPH_FORMULA_PANEL_OVERFLOW');
  const recovered=new RepairBudget(JSON.parse(JSON.stringify(interrupted.ledger)));
  const completion=recovered.record('LAYOUT',inputSha,'MEASURED_GRAPH_FORMULA_PANEL_OVERFLOW',outputSha);
  assert.equal(completion.replayed,true);assert.equal(completion.resumed,true);assert.equal(recovered.ledger.length,1);
  assert.equal(recovered.ledger[0].outputSha,outputSha);assert.equal(pending.outputSha,null);
  const changed=recovered.record('LAYOUT',objectSha({formulaWidthPx:144,panelPx:140}),'MEASURED_GRAPH_FORMULA_PANEL_OVERFLOW',objectSha({panelPx:168}));
  assert.equal(changed.replayed,false);assert.equal(changed.row.iteration,2);assert.equal(recovered.ledger.length,2);
});
