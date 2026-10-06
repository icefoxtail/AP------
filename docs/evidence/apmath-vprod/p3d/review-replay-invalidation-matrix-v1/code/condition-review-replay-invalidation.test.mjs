import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {objectSha,fileRef} from '../../pipeline-core/canonical.mjs';
import {blindThenCompare,reuseReviewAuthority,conditionBinding,validateReviewLineage} from '../production/blinded-review.mjs';
import {sourceReviewClosed} from '../production/source-policy.mjs';

function harness(root){
  const calls=[],events=[];
  const freeze=(stage,value)=>{const name=stage+'-'+events.length+'.json';fs.writeFileSync(path.join(root,name),JSON.stringify(value));events.push('FREEZE:'+stage);return{outputs:[fileRef(root,name)]};};
  const call=async(purpose,packet)=>{
    calls.push({purpose,packet});const blind=packet.visibility==='SOURCE_ONLY';
    if(blind){
      assert.deepEqual(Object.keys(packet.source).sort(),['choices','content','sourceImageRequired']);
      assert.equal(Object.hasOwn(packet,'proposedPlan'),false);
      return{output:{status:'PASS'},payload:{sourceConditions:[{id:'given1',condition:'AB=5'}],uncoveredConditions:[]},inputPacket:packet,inputSha256:objectSha(packet),contextId:'blind-'+calls.length,providerInvocationId:'turn-'+calls.length,subagentToolsEnabled:false};
    }
    assert.ok(packet.blindDecisionRef);assert.ok(events.includes('FREEZE:CONDITIONS_BLIND_FREEZE'));
    return{output:{status:'PASS'},payload:{mappedConditions:[{sourceConditionId:'given1',mappedTo:'A,B'}],errors:[],uncoveredConditions:[],realizationReview:'faithful'},inputPacket:packet,inputSha256:objectSha(packet),contextId:'compare-'+calls.length,providerInvocationId:'turn-'+calls.length,subagentToolsEnabled:false};
  };
  return{root,calls,events,freeze,call};
}

test('source-condition review invalidates on frozen source, image, plan, and policy inputs',async()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'condition-review-replay-matrix-')),h=harness(root);
  const imageA='data:image/png;base64,'+Buffer.from('diagram-a').toString('base64'),imageB='data:image/png;base64,'+Buffer.from('diagram-b').toString('base64');
  const base={sourceRef:{path:'archive/exams/original/m3/source.js',bytes:32,sha256:objectSha('source-v1')},source:{content:'삼각형의 두 변의 길이는 AB=5이다.',choices:['5','6'],sourceImageRequired:true},images:[imageA],plan:{sourceConditions:[{id:'given1',condition:'AB=5'}],displaySegments:['AB'],caption:'삼각형'},policySha256:objectSha('condition-policy-v1')};
  try{
    const binding=conditionBinding({...base});
    const record=await blindThenCompare({root,kind:'CONDITIONS',source:base.source,images:base.images,comparison:{proposedPlan:base.plan},policySha256:base.policySha256,inputBindingSha256:binding,call:h.call,freeze:h.freeze});
    assert.equal(h.calls.length,2);assert.equal(validateReviewLineage(root,record,'CONDITIONS',base.policySha256,binding),true);
    const warm=await reuseReviewAuthority({root,record,kind:'CONDITIONS',policySha256:base.policySha256,inputBindingSha256:binding,closed:sourceReviewClosed,refresh:()=>{throw Error('UNCHANGED_CONDITION_INPUT_MUST_REUSE');}});
    assert.equal(warm.reused,true);assert.equal(h.calls.length,2);
    const mutations=[
      ['source-file-sha',{sourceRef:{...base.sourceRef,sha256:objectSha('source-v2')}}],
      ['student-body',{source:{...base.source,content:'삼각형의 두 변의 길이는 AB=6이다.'}}],
      ['student-choices',{source:{...base.source,choices:['7','8']}}],
      ['source-image-bytes',{images:[imageB]}],
      ['frozen-visual-plan',{plan:{...base.plan,displaySegments:['AC']}}],
      ['source-condition-inventory',{plan:{...base.plan,sourceConditions:[{id:'given1',condition:'AB=6'}]}}],
      ['source-policy-provider-observer-closure',{policySha256:objectSha('condition-policy-v2')}]
    ];
    const observations=[];
    for(const [field,patch] of mutations){
      const changed={...base,...patch},nextBinding=conditionBinding(changed);
      assert.notEqual(nextBinding,binding,field);
      let refreshCount=0;
      await assert.rejects(reuseReviewAuthority({root,record,kind:'CONDITIONS',policySha256:changed.policySha256,inputBindingSha256:nextBinding,closed:sourceReviewClosed,refresh:async()=>{refreshCount++;return record;}}),/REFRESHED_REVIEW_AUTHORITY_INVALID/,field);
      assert.equal(refreshCount,1,field);assert.equal(validateReviewLineage(root,record,'CONDITIONS',changed.policySha256,nextBinding),false,field);
      observations.push({field,priorBindingSha256:binding,nextBindingSha256:nextBinding,refreshCount,staleReceiptRejected:true});
    }
    console.log('CONDITION_REVIEW_REPLAY_INVALIDATION_MATRIX='+JSON.stringify({unchangedWarmReuse:true,providerCallsBeforeMutations:h.calls.length,observations}));
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
