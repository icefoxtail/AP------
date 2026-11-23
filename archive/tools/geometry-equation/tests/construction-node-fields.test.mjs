// A mathPlan node that leaves out a required field is refused by name, not with a bare KeyError ("factRole" reached the author as an unknown code).
// No default is filled in (GIVEN / CONCLUSION decides which values a figure may show); a complete node is accepted exactly as before. Python worker only, no Chrome.
import test from 'node:test';import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {HINTS} from '../ops/tools/hints.mjs';
import {createRequire} from 'node:module';
const codes=createRequire(import.meta.url)('../ops/claude-batch/plan-lint-codes.cjs');

const int=n=>({kind:'integer',value:String(n)});
const pt=(id,x,y,extra={})=>({id,op:'SOURCE_POINT',inputs:[],args:{coordinates:[int(x),int(y)]},outputType:'POINT',factRole:'GIVEN',...extra});
const run=nodes=>pythonWorker({action:'construction',graph:{schemaVersion:'construction-spike-v1',nodes}});
const without=(node,field)=>{const {[field]:_,...rest}=node;return rest;};

test('a node without factRole is refused as MATH_NODE_FACT_ROLE_REQUIRED:<id>, never defaulted',async()=>{
  const response=await run([pt('A',0,0),without(pt('B',3,4),'factRole')]);
  assert.equal(response.status,'ERROR');assert.equal(response.result.code,'MATH_NODE_FACT_ROLE_REQUIRED:B');
});

test('a node without id, op, inputs, args or outputType is refused with the node and the field named; a graph without nodes too',async()=>{
  for(const field of ['op','inputs','args','outputType']){
    const response=await run([pt('A',0,0),without(pt('B',3,4),field)]);
    assert.equal(response.status,'ERROR',field);assert.equal(response.result.code,`MATH_NODE_FIELD_REQUIRED:B:${field}`);
  }
  assert.equal((await run([pt('A',0,0),without(pt('B',3,4),'id')])).result.code,'MATH_NODE_FIELD_REQUIRED:?:id');
  const noNodes=await pythonWorker({action:'construction',graph:{schemaVersion:'construction-spike-v1'}});
  assert.equal(noNodes.result.code,'MATH_PLAN_NODES_REQUIRED');
});

test('complete nodes behave as before: an invalid factRole value is still INVALID_FACT_ROLE, a good plan still composes its model',async()=>{
  assert.equal((await run([pt('A',0,0),pt('B',3,4,{factRole:'ANSWER'})])).result.code,'INVALID_FACT_ROLE');
  const ok=await run([pt('A',0,0),pt('B',3,4,{factRole:'CONCLUSION'})]);
  assert.equal(ok.status,'OK');assert.deepEqual(Object.keys(ok.result.points).sort(),['A','B']);
});

test('the author is told what to do: the engine hint and the plan-lint reason both name the three roles and the CONCLUSION rule',()=>{
  const hint=HINTS.find(([re])=>re.test('MATH_NODE_FACT_ROLE_REQUIRED:B'))[1];
  assert.match(hint,/GIVEN, DERIVED_INTERMEDIATE or CONCLUSION/);assert.match(hint,/CONCLUSION/);
  const lint=codes.explain('MATH_NODE_FACT_ROLE_REQUIRED:B',{});
  assert.match(lint.reason,/B/);assert.match(lint.fix,/GIVEN, DERIVED_INTERMEDIATE, CONCLUSION/);assert.match(lint.fix,/정답/);
  const field=codes.explain('MATH_NODE_FIELD_REQUIRED:B:args',{});assert.match(field.reason,/B:args/);
});
