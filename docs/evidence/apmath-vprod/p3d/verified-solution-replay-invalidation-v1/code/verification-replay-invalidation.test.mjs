import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {bytesSha,objectSha,fileRef} from '../../pipeline-core/canonical.mjs';
import {blindThenCompare,reuseReviewAuthority,verificationBinding,validateReviewLineage} from '../production/blinded-review.mjs';
import {verificationClosed} from '../production/source-policy.mjs';

function harness(root){
  const calls=[],events=[];
  const freeze=(stage,value)=>{const file=stage+'-'+events.length+'.json';fs.writeFileSync(path.join(root,file),JSON.stringify(value));events.push('FREEZE:'+stage);return{outputs:[fileRef(root,file)]};};
  const call=async(purpose,packet)=>{
    calls.push({purpose,packet});const blind=packet.visibility==='SOURCE_ONLY';
    if(blind){
      assert.deepEqual(Object.keys(packet.source).sort(),['choices','content','sourceImageRequired']);
      assert.equal(Object.hasOwn(packet,'answer'),false);assert.equal(Object.hasOwn(packet,'solution'),false);
      return{output:{status:'PASS'},payload:{recomputedAnswer:'34',reasoning:'5²+3²=34',independentlyExtractedSourceConditions:['legs 5,3'],uncoveredConditions:[]},inputPacket:packet,inputSha256:objectSha(packet),contextId:'blind-'+calls.length,providerInvocationId:'turn-'+calls.length,subagentToolsEnabled:false};
    }
    assert.ok(packet.blindDecisionRef);assert.ok(events.includes('FREEZE:SOLUTION_BLIND_FREEZE'));
    return{output:{status:'PASS'},payload:{solutionComparison:'matches',errors:[],uncoveredConditions:[]},inputPacket:packet,inputSha256:objectSha(packet),contextId:'compare-'+calls.length,providerInvocationId:'turn-'+calls.length,subagentToolsEnabled:false};
  };
  return{root,calls,events,freeze,call};
}

test('verified-solution review authority invalidates on every frozen source, answer, solution, image, and policy input',async()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'verification-replay-matrix-')),h=harness(root);
  const imageA='data:image/png;base64,'+Buffer.from('source-image-a').toString('base64');
  const imageB='data:image/png;base64,'+Buffer.from('source-image-b').toString('base64');
  const base={sourceRef:{path:'archive/exams/original/m3/source.js',bytes:32,sha256:objectSha('source-v1')},source:{content:'직각삼각형의 두 변의 길이는 5, 3이다.',choices:['34','35'],sourceImageRequired:true},images:[imageA],answer:'34',solution:'5²+3²=34',policySha256:objectSha('verified-policy-v1')};
  try{
  const binding=verificationBinding({...base});
  const record=await blindThenCompare({root,kind:'SOLUTION',source:base.source,images:base.images,comparison:{answer:base.answer,solution:base.solution},policySha256:base.policySha256,inputBindingSha256:binding,call:h.call,freeze:h.freeze});
  assert.equal(h.calls.length,2);assert.equal(validateReviewLineage(root,record,'SOLUTION',base.policySha256,binding),true);
  const warm=await reuseReviewAuthority({root,record,kind:'SOLUTION',policySha256:base.policySha256,inputBindingSha256:binding,closed:verificationClosed,refresh:()=>{throw Error('UNCHANGED_VERIFIED_INPUT_MUST_REUSE');}});
  assert.equal(warm.reused,true);assert.equal(h.calls.length,2);
  const mutations=[
    ['source-file-sha',{sourceRef:{...base.sourceRef,sha256:objectSha('source-v2')}}],
    ['student-body',{source:{...base.source,content:'직각삼각형의 두 변의 길이는 6, 3이다.'}}],
    ['student-choices',{source:{...base.source,choices:['45','46']}}],
    ['source-image-bytes',{images:[imageB]}],
    ['stored-answer',{answer:'35'}],
    ['stored-solution',{solution:'5²+3²=35'}],
    ['verified-solution-policy',{policySha256:objectSha('verified-policy-v2')}]
  ];
  const observations=[];
  for(const [field,patch] of mutations){
    const changed={...base,...patch},nextBinding=verificationBinding(changed);
    assert.notEqual(nextBinding,binding,field);
    let refreshCount=0;
    await assert.rejects(reuseReviewAuthority({root,record,kind:'SOLUTION',policySha256:changed.policySha256,inputBindingSha256:nextBinding,closed:verificationClosed,refresh:async()=>{refreshCount++;return record;}}),/REFRESHED_REVIEW_AUTHORITY_INVALID/,field);
    assert.equal(refreshCount,1,field);
    assert.equal(validateReviewLineage(root,record,'SOLUTION',changed.policySha256,nextBinding),false,field);
    observations.push({field,priorBindingSha256:binding,nextBindingSha256:nextBinding,refreshCount,staleReceiptRejected:true});
  }
  console.log('VERIFIED_SOLUTION_REPLAY_INVALIDATION_MATRIX='+JSON.stringify({unchangedWarmReuse:true,providerCallsBeforeMutations:h.calls.length,observations}));
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
