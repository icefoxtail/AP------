import test from 'node:test';
import assert from 'node:assert/strict';
import {RepairBudget} from '../production/repair-budget.mjs';

const sha=n=>'sha256:'+String(n).padStart(64,'0');

test('completing a pending non-last row does not compare the row with itself',()=>{
 const budget=new RepairBudget();
 const first=budget.consume('NORMALIZER',sha(1),'INVALID_CONDITION_AUDIT');budget.complete(first,sha(2));
 const pending=budget.consume('NORMALIZER',sha(3),'REALIZATION_RECIPE_REQUIRED');
 const third=budget.consume('NORMALIZER',sha(4),'INVALID_BRANCH');budget.complete(third,sha(5));
 assert.doesNotThrow(()=>budget.complete(pending,sha(6)));
 assert.equal(budget.ledger.length,3);
 assert.deepEqual(budget.ledger.map(row=>row.outputSha),[sha(2),sha(6),sha(5)]);
});

test('a distinct row with the same completed repair signature remains stagnation',()=>{
 const budget=new RepairBudget();
 const first=budget.consume('NORMALIZER',sha(1),'INVALID_CONDITION_AUDIT');budget.complete(first,sha(2));
 const duplicate=budget.consume('NORMALIZER',sha(1),'INVALID_CONDITION_AUDIT');
 assert.throws(()=>budget.complete(duplicate,sha(2)),/REPAIR_STAGNATION/);
 assert.equal(duplicate.outputSha,null);
 assert.throws(()=>budget.complete(first,sha(3)),/INVALID_REPAIR_OUTPUT/);
 assert.equal(first.outputSha,sha(2));
});
