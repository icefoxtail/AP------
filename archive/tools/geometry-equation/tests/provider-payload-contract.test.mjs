import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {bytesSha,fileRef,objectSha} from '../../pipeline-core/canonical.mjs';
import {blindThenCompare} from '../production/blinded-review.mjs';
import {parseVisualProviderPayload} from '../production/phase2.mjs';

test('provider output parse failure retains completion and process-cleanup evidence without raw model text',()=>{
  const processCleanup={pid:1204,exitObserved:true,closeObserved:true,exitSignal:'SIGTERM',closeSignal:'SIGTERM',closeWaitTimedOut:false};
  const rawOutput='{"output":{"payload":"solutionComparison: matches"}}';
  const payload='solutionComparison: matches';
  const response={output:{status:'PASS',payload},rawOutput,providerInvocationId:'turn-1',contextId:'thread-1',providerTerminalStatus:'completed',providerProcessCleanup:processCleanup};
  assert.throws(()=>parseVisualProviderPayload(response,'CONDITIONS_COMPARE'),error=>{
    assert.equal(error.code,'VISUAL_PROVIDER_PAYLOAD_JSON_INVALID');
    assert.equal(error.message,'VISUAL_PROVIDER_PAYLOAD_JSON_INVALID');
    assert.equal(error.providerParserErrorName,'SyntaxError');
    assert.equal(error.message.includes('solutionComparison'),false);
    assert.equal(error.providerPurpose,'CONDITIONS_COMPARE');
    assert.equal(error.providerInvocationId,'turn-1');assert.equal(error.providerContextId,'thread-1');
    assert.equal(error.providerTerminalStatus,'completed');assert.deepEqual(error.providerProcessCleanup,processCleanup);
    assert.equal(error.providerPayloadSha256,bytesSha(Buffer.from(payload)));
    assert.equal(error.providerRawOutputSha256,bytesSha(Buffer.from(rawOutput)));
    assert.equal(Object.hasOwn(error,'rawOutput'),false);
    return true;
  });
});

test('valid provider payload remains parsed and missing payload fails closed',()=>{
  assert.deepEqual(parseVisualProviderPayload({output:{payload:'{"status":"PASS","payload":"ok"}'}},'PLAN'),{status:'PASS',payload:'ok'});
  assert.throws(()=>parseVisualProviderPayload({output:{}},'PLAN'),error=>error.code==='VISUAL_PROVIDER_PAYLOAD_JSON_INVALID'&&error.providerPayloadSha256===null);
});

test('blind and compare prompts explicitly require JSON-encoded outer payload strings',async()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'provider-payload-prompt-contract-'));
  try{
    let index=0;const requests=[];
    const freeze=(stage,value)=>{const name=stage+'-'+index+'.json';index++;fs.writeFileSync(path.join(root,name),JSON.stringify(value));return{outputs:[fileRef(root,name)]};};
    const call=async(purpose,packet)=>{
      requests.push({purpose,packet});const blind=packet.visibility==='SOURCE_ONLY';
      const payload=blind
        ?purpose==='SOLUTION_SOURCE_BLIND'?{recomputedAnswer:'1',reasoning:'1=1',independentlyExtractedSourceConditions:['given'],uncoveredConditions:[]}:{sourceConditions:[{id:'given',condition:'x=1'}],uncoveredConditions:[]}
        :purpose==='SOLUTION_COMPARE'?{solutionComparison:'matches',errors:[],uncoveredConditions:[]}:{mappedConditions:[{sourceConditionId:'given',mappedTo:'label'}],errors:[],uncoveredConditions:[],realizationReview:'faithful'};
      return{output:{status:'PASS'},payload,inputPacket:packet,inputSha256:objectSha(packet),contextId:'context-'+requests.length,providerInvocationId:'turn-'+requests.length,subagentToolsEnabled:false};
    };
    for(const kind of ['SOLUTION','CONDITIONS']){
      const source={content:'question',choices:['1','2'],sourceImageRequired:false},inputBindingSha256=objectSha({kind});
      await blindThenCompare({root,kind,source,images:[],comparison:kind==='SOLUTION'?{answer:'1',solution:'1=1'}:{proposedPlan:{sourceConditions:[{id:'given',condition:'x=1'}]}},policySha256:objectSha('policy'),inputBindingSha256,call,freeze});
    }
    assert.equal(requests.length,4);
    for(const request of requests){
      assert.match(request.packet.instruction,/outer JSON response/);
      assert.match(request.packet.instruction,/payload.*string containing exactly one valid JSON object/);
      assert.match(request.packet.instruction,/Do not put bare fields or prose in/);
    }
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
