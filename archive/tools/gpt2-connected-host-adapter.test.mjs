import test from 'node:test';
import assert from 'node:assert/strict';
import {createAdapter} from './gpt2-connected-host-adapter.mjs';

test('cannot claim real Library CAS without an authorized connector host',async()=>{
 await assert.rejects(()=>createAdapter({campaignId:'H1_GPT2_20261006',stream:'B',examUid:'23_금당고_1학기_중간_고1_기출'}),/AUTHORIZED_CONNECTOR_HOST_MODULE_REQUIRED/);
});