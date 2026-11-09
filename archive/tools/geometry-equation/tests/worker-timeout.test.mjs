// GEOMETRY_WORKER_TIMEOUT_MS only lengthens the 10 s worker limit with a finite positive number up to 600000; anything else keeps 10000.
import test from 'node:test';
import assert from 'node:assert/strict';
import {workerTimeoutMs} from '../production/worker.mjs';

test('the worker time limit env value is used only when it is a sane number', () => {
  assert.equal(workerTimeoutMs('90000'),90000);assert.equal(workerTimeoutMs('600000'),600000);
  for(const bad of [undefined,'','abc','-5','0','Infinity','-Infinity','NaN','600001','2147483648'])assert.equal(workerTimeoutMs(bad),10000,String(bad));
});
