import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {fileRef,objectSha,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {blindThenCompare,reuseReviewAuthority,validateReviewLineage,verificationBinding,assertStudentOnly} from '../production/blinded-review.mjs';
import {sourceReviewClosed,verificationClosed,verifiedSolutionPolicyFingerprint} from '../production/source-policy.mjs';
import {scalar,compareReconstruction} from '../production/cindy-observer.mjs';
import {runPhase2} from '../production/phase2.mjs';
import {resolveQuestion} from '../production/resolve-request.mjs';
const repo=fileURLToPath(new URL('../../../../',import.meta.url));
function harness(kind){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'blind-compare-')),calls=[],events=[];
  const freeze=(stage,record)=>{const name=stage+'-'+events.length+'.json';fs.writeFileSync(path.join(root,name),JSON.stringify(record));events.push('FREEZE:'+stage);return {outputs:[fileRef(root,name)]};};
  const call=async(purpose,packet)=>{
    calls.push(packet);events.push('CALL:'+purpose);
    const blind=packet.visibility==='SOURCE_ONLY';
    if(blind){assert.deepEqual(Object.keys(packet.source).sort(),['choices','content','sourceImageRequired']);assert.equal('answer' in packet,false);assert.equal('proposedPlan' in packet,false);}
    else {assert.ok(readBoundFile(root,packet.blindDecisionRef));assert.ok(events.some(e=>e.startsWith('FREEZE:'+kind+'_BLIND_FREEZE')));}
    const payload=blind?(kind==='SOLUTION'?{recomputedAnswer:'34',reasoning:'5²+3²',independentlyExtractedSourceConditions:['legs 5,3'],uncoveredConditions:[]}:{sourceConditions:[{id:'given1',condition:'legs 5,3'}],uncoveredConditions:[]}):(kind==='SOLUTION'?{solutionComparison:'matches',errors:[],uncoveredConditions:[]}:{mappedConditions:[{sourceConditionId:'given1',mappedTo:'A,B,C'}],errors:[],uncoveredConditions:[],realizationReview:'faithful'});
    return {output:{status:'PASS'},payload,inputPacket:packet,inputSha256:objectSha(packet),contextId:'ctx-'+calls.length,providerInvocationId:'turn-'+calls.length,subagentToolsEnabled:false};
  };
  return {root,calls,events,freeze,call};
}
for(const kind of ['SOLUTION','CONDITIONS'])test(kind+': source-only freeze physically precedes disclosure; legacy and tampered decisions rejected',async()=>{
  const h=harness(kind),policy=objectSha('policy'),binding=objectSha('binding');
  try{
    const record=await blindThenCompare({...h,kind,source:{content:'triangle',choices:['34','35'],sourceImageRequired:false},images:[],comparison:kind==='SOLUTION'?{answer:'1',solution:'stored'}:{proposedPlan:{nodes:[]}},policySha256:policy,inputBindingSha256:binding});
    assert.equal(h.calls.length,2);assert.equal(h.calls[0].visibility,'SOURCE_ONLY');assert.equal(h.calls[1].visibility,'COMPARE_ONLY');
    assert.equal(validateReviewLineage(h.root,record,kind,policy,binding),true);
    assert.equal(validateReviewLineage(h.root,record,kind,objectSha('new-verifier'),binding),false);
    assert.equal(validateReviewLineage(h.root,record,kind,policy,objectSha('new-answer-or-source')),false);
    assert.equal(validateReviewLineage(h.root,{...record,reviewContract:undefined},kind,policy,binding),false);
    const altered={...record,payload:{...record.payload,...(kind==='SOLUTION'?{recomputedAnswer:'35'}:{sourceConditions:[]})}};
    assert.equal(validateReviewLineage(h.root,altered,kind,policy,binding),false);
  }finally{fs.rmSync(h.root,{recursive:true,force:true});}
});
test('replay reuses only current review authority and requires a valid fresh replacement',async()=>{
  for(const kind of ['SOLUTION','CONDITIONS']){
    const h=harness(kind),closed=kind==='SOLUTION'?verificationClosed:sourceReviewClosed;
    const source={content:'triangle',choices:['34'],sourceImageRequired:false},images=[];
    const comparison=kind==='SOLUTION'?{answer:'34',solution:'5²+3²=34'}:{proposedPlan:{sourceConditions:[{id:'given1',condition:'legs 5,3'}]}};
    const originalPolicy=objectSha('policy-v1'),originalBinding=objectSha('binding-v1');
    const makeReview=(policySha256,inputBindingSha256)=>blindThenCompare({ ...h,kind,source,images,comparison,policySha256,inputBindingSha256 });
    try{
      const original=await makeReview(originalPolicy,originalBinding);
      const current=await reuseReviewAuthority({root:h.root,record:original,kind,policySha256:originalPolicy,inputBindingSha256:originalBinding,closed,refresh:()=>{throw Error('UNEXPECTED_REFRESH');}});
      assert.equal(current.reused,true);assert.equal(current.record,original);
      for(const [policySha256,inputBindingSha256] of [[objectSha('policy-v2'),originalBinding],[originalPolicy,objectSha('binding-v2')]]){
        let refreshCount=0;
        const refreshed=await reuseReviewAuthority({root:h.root,record:original,kind,policySha256,inputBindingSha256,closed,refresh:async()=>{refreshCount++;return makeReview(policySha256,inputBindingSha256);}});
        assert.equal(refreshCount,1);assert.equal(refreshed.reused,false);assert.equal(closed(refreshed.record),true);
        assert.equal(validateReviewLineage(h.root,refreshed.record,kind,policySha256,inputBindingSha256),true);
      }
      await assert.rejects(reuseReviewAuthority({root:h.root,record:original,kind,policySha256:objectSha('policy-v2'),inputBindingSha256:originalBinding,closed,refresh:()=>original}),/REFRESHED_REVIEW_AUTHORITY_INVALID/);
    }finally{fs.rmSync(h.root,{recursive:true,force:true});}
  }
});
test('no comparison call after blind failure, leak, absent image or non-durable freeze',async()=>{
  for(const source of [{content:'q',answer:'upstream'}, {content:'q',choices:[{solution:'leak'}]}])assert.throws(()=>assertStudentOnly(source),/LEAK/);
  const h=harness('SOLUTION'),args={...h,kind:'SOLUTION',source:{content:'q',choices:[],sourceImageRequired:false},images:[],comparison:{answer:'1',solution:'s'},policySha256:objectSha(1),inputBindingSha256:objectSha(2)};
  try{
    await assert.rejects(blindThenCompare({...args,source:{...args.source,sourceImageRequired:true}}),/IMAGE_MISSING/);assert.equal(h.calls.length,0);
    await assert.rejects(blindThenCompare({...args,freeze:()=>({outputs:[{path:'missing',bytes:0,sha256:objectSha(0)}]})}));assert.equal(h.calls.length,1);
    let calls=0;await assert.rejects(blindThenCompare({...args,call:async()=>{calls++;return {output:{status:'FAIL'},payload:{}};}}),/BLIND_NOT_CLOSED/);assert.equal(calls,1);
  }finally{fs.rmSync(h.root,{recursive:true,force:true});}
});
test('verification key changes for source, answer, solution or verifier/provider closure',()=>{
  const base={sourceRef:{path:'s',bytes:1,sha256:objectSha('s')},source:{content:'q'},images:[],answer:'1',solution:'s',policySha256:objectSha('v1')};
  const before=verificationBinding(base);
  for(const patch of [{answer:'2'},{solution:'new'},{source:{content:'new'}},{policySha256:objectSha('v2')}])assert.notEqual(before,verificationBinding({...base,...patch}));
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'verification-policy-'));
  try{const files=['archive/tools/geometry-equation/production/source-policy.mjs','archive/tools/geometry-equation/production/blinded-review.mjs','alive/runtime/provider-bridge/codex-appserver-adapter.mjs','archive/tools/pipeline-core/canonical.mjs'];for(const p of files){fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),'v1');}const key=verifiedSolutionPolicyFingerprint(root);fs.appendFileSync(path.join(root,files[2]),'v2');assert.notEqual(key,verifiedSolutionPolicyFingerprint(root));}finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('actual UID CLI and direct phase2 cannot manufacture ACTIVE authority from locator',async()=>{
  const uid='25_효천고_2학기_중간_고1_기출|1';
  const cli=spawnSync(process.execPath,['archive/tools/geometry-equation/production/run.mjs','--question-uid',uid],{cwd:repo,encoding:'utf8'});
  assert.equal(cli.status,2);
  const result=await runPhase2({questionUid:uid});assert.equal(result.result.status,'INPUT_REQUIRED');assert.equal(result.result.reason,'UID_AUTHORITY_REGISTRY_REQUIRED');
  await assert.rejects(runPhase2({questionUid:uid,sourceRegistryRef:{path:'archive/_generated/geometry-visual-engine/production/stages/UID_AUTHORITY/old.json'}}),/SCOPED_REGISTRY_NOT_AUTHORITY/);
});
test('canonical/current authority resolves opaque UID without filename search and rejects retired/stale mappings',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'canonical-authority-'));
  try{
    const sourcePath='archive/exams/original/middle/m3/unrelated-filename.js';fs.mkdirSync(path.dirname(path.join(root,sourcePath)),{recursive:true});fs.writeFileSync(path.join(root,sourcePath),'window.questionBank=[{id:7,content:"student",answer:"1",solution:"stored"}];');
    const sourceRef=fileRef(root,sourcePath),row={sourceExamId:'opaque-canonical',canonicalSourceExamId:'opaque-canonical',sourceIdentityKey:'parent-source',status:'ACTIVE',sourceQuestionOrdinal:7,questionUidV2:'opaque-canonical|7',sourcePath,sourceSha256:sourceRef.sha256};
    const write=entry=>{fs.writeFileSync(path.join(root,'current-registry.json'),JSON.stringify({schemaVersion:'SOURCE_EXAM_ID_REGISTRY_v1',entries:[entry]}));return fileRef(root,'current-registry.json');};
    assert.equal(resolveQuestion(root,{questionUid:row.questionUidV2,sourceRegistryRef:write(row)}).sourceRef.path,sourcePath);
    assert.throws(()=>resolveQuestion(root,{questionUid:row.questionUidV2,sourceRegistryRef:write({...row,status:'RETIRED'})}),/CURRENT_SOURCE_MAPPING_REQUIRED/);
    assert.throws(()=>resolveQuestion(root,{questionUid:row.questionUidV2,sourceRegistryRef:write({...row,sourceSha256:objectSha('wrong')})}),/STALE_SOURCE_AUTHORITY/);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('Cindy refuses unsafe integer/rational and a manufactured double delta-zero PASS',()=>{
  const huge={kind:'integer',value:'9007199254740993'};
  assert.throws(()=>scalar(huge),/UNSUPPORTED_CINDY/);
  assert.throws(()=>scalar({kind:'rational',numerator:'9007199254740993',denominator:'9007199254740992'}),/UNSUPPORTED_CINDY/);
  assert.throws(()=>scalar({kind:'rational',numerator:'1',denominator:'1000000000000000000'}),/UNSUPPORTED_CINDY/);
  assert.throws(()=>scalar({kind:'expression',op:'sub',args:[{kind:'integer',value:'1'},{kind:'rational',numerator:'999999999',denominator:'1000000000'}]}),/UNSUPPORTED_CINDY/);
  assert.equal(scalar({kind:'rational',numerator:'1',denominator:'3'}),1/3);
  const rounded=Number(huge.value);
  assert.throws(()=>compareReconstruction({points:{P:{exact:[huge,{kind:'integer',value:'0'}],approximation:[rounded,0]}}},{points:{P:[rounded,0]}}),/UNSUPPORTED_CINDY/);
});
