import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {runFrozen,repoRoot} from '../production/run.mjs';
import {assetIdentity,planHash} from '../production/contracts.mjs';
import {commitStage,withWorkRoot} from '../production/store.mjs';
import {objectSha,canonicalJson,readBoundFile,fileRef} from '../../pipeline-core/canonical.mjs';
import {resolveQuestion,runQuestion} from '../production/resolve-request.mjs';

function bootstrap(mathPlan,capability){
  const identity=assetIdentity('synthetic-runner-'+crypto.randomUUID()+'|1','SOLUTION_VISUAL');
  const examUid=identity.questionUid.split('|')[0],workRoot=`.tmp/archive/test-${crypto.randomUUID()}/${examUid}/visual-engine/production`;
  return withWorkRoot(workRoot,()=>{
    const source=commitStage(repoRoot,{stage:'INPUT',key:objectSha(identity),provenance:{synthetic:true},outputs:{'source.txt':'synthetic primitive inputs','solution.txt':'synthetic verified expectation'}});
    const sourceRef=source.outputs.find(r=>r.path.endsWith('source.txt')),solutionRef=source.outputs.find(r=>r.path.endsWith('solution.txt'));
    const plan={schemaVersion:'VISUAL_SPIKE_PLAN_v1',questionUid:identity.questionUid,visualAssetKey:identity.visualAssetKey,sourceRef,solutionRef,...(capability==='construction-spike-v1'?{mathPlan}:{graphPlan:mathPlan}),labels:[]};
    const frozen=commitStage(repoRoot,{stage:'PLAN',key:planHash(plan),provenance:{synthetic:true},outputs:{'plan.json':canonicalJson({...plan,planSha256:planHash(plan)})}});
    return {request:{questionUid:identity.questionUid,surface:identity.surface,mode:'PHASE0_2_EXPERIMENT',capability,sourceRef,solutionRef,frozenPlanRef:frozen.outputs[0]},plan};
  });
}
const integer=v=>({kind:'integer',value:String(v)});
const graph={schemaVersion:'construction-spike-v1',nodes:[
  ...['A','B'].map((id,i)=>({id,op:'SOURCE_POINT',inputs:[],args:{coordinates:[integer(i*4),integer(0)]},outputType:'POINT',factRole:'GIVEN'})),
  {id:'M',op:'MIDPOINT',inputs:['A','B'],args:{},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
]};
test('frozen plan -> Node/Python -> Cindy -> immutable result; warm math and fresh audit',async()=>{
  const suffix=crypto.randomUUID().replaceAll('-','').slice(0,12);
  const freshGraph={...graph,nodes:graph.nodes.map(n=>({...n,id:n.id+suffix,inputs:n.inputs.map(id=>id+suffix)}))};
  const {request,plan}=bootstrap(freshGraph,'construction-spike-v1');
  const cold=await runFrozen(repoRoot,request),warm=await runFrozen(repoRoot,request);
  const a=JSON.parse(readBoundFile(repoRoot,cold.outputs[0])),b=JSON.parse(readBoundFile(repoRoot,warm.outputs[0]));
  assert.equal(a.cacheHit,false);assert.equal(b.cacheHit,true);assert.deepEqual(a.stages[0],b.stages[0]);assert.notDeepEqual(a.stages[1],b.stages[1]);
  assert.equal(a.evidence.CINDY_RECONSTRUCTION.status,'PASS');assert.equal(a.status,'REVIEW_REQUIRED');assert.equal(a.productionAuthorized,false);
  const changed={...plan,labels:[{text:'label-only change'}]};
  const examUid=request.questionUid.split('|')[0],workRoot=`.tmp/archive/test-${crypto.randomUUID()}/${examUid}/visual-engine/production`;
  const receipt=withWorkRoot(workRoot,()=>commitStage(repoRoot,{stage:'PLAN',key:planHash(changed),provenance:{synthetic:true},outputs:{'plan.json':canonicalJson(changed)}}));
  const c=JSON.parse(readBoundFile(repoRoot,(await runFrozen(repoRoot,{...request,frozenPlanRef:receipt.outputs[0]})).outputs[0]));
  assert.equal(c.cacheHit,true);assert.notEqual(a.planSha256,c.planSha256);
});
test('polynomial runner uses a separately launched observer and never marks source review PASS',async()=>{
  const {request}=bootstrap({family:'polynomial',coefficients:['0','0','1'],domain:[-2,2],viewport:[-2,2,-1,5]},'polynomial-spike-v1');
  const result=JSON.parse(readBoundFile(repoRoot,(await runFrozen(repoRoot,request)).outputs[0]));
  assert.equal(result.evidence.GRAPH_INTERIOR_BOUND.status,'PASS');assert.ok(result.missing.includes('SOURCE_CONDITIONS'));
});
test('unknown plan fields, source mismatch, wrong capability and production mode rejected',async()=>{
  const {request,plan}=bootstrap(graph,'construction-spike-v1');
  await assert.rejects(runFrozen(repoRoot,{...request,mode:'PRODUCTION_CANDIDATE'}),/ONLY_PHASE/);
  await assert.rejects(runFrozen(repoRoot,{...request,capability:'unimplemented'}),/UNSUPPORTED_CAPABILITY/);
  for(const p of [{...plan,randomOverride:true},{...plan,sourceRef:{...plan.sourceRef,sha256:objectSha('different')}}]){
    const examUid=request.questionUid.split('|')[0],workRoot=`.tmp/archive/test-${crypto.randomUUID()}/${examUid}/visual-engine/production`;
    const ref=withWorkRoot(workRoot,()=>commitStage(repoRoot,{stage:'PLAN',key:objectSha(p),provenance:{},outputs:{'plan.json':canonicalJson(p)}})).outputs[0];
    await assert.rejects(runFrozen(repoRoot,{...request,frozenPlanRef:ref}));
  }
});
test('UID authority mapping and actual source resolve, solution text is not verified',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'visual-resolve-'));
  try{
    const sourcePath='archive/exams/original/middle/m3/test.js';fs.mkdirSync(path.dirname(path.join(root,sourcePath)),{recursive:true});
    fs.writeFileSync(path.join(root,sourcePath),'window.questionBank=[{id:1,content:"actual source",solution:"unreviewed"}];');
    const sourceRef=fileRef(root,sourcePath);
    const row={canonicalSourceExamId:'stable-exam',sourceExamId:'stable-exam',sourceIdentityKey:'original-source',status:'ACTIVE',sourceQuestionOrdinal:1,questionUidV2:'stable-exam|1',sourcePath,sourceSha256:sourceRef.sha256};
    fs.writeFileSync(path.join(root,'registry.json'),JSON.stringify({schemaVersion:'SOURCE_EXAM_ID_REGISTRY_v1',entries:[row]}));
    const sourceRegistryRef=fileRef(root,'registry.json');
    const result=resolveQuestion(root,{questionUid:'stable-exam|1',sourceRegistryRef});
    assert.equal(result.status,'VERIFIED_SOLUTION_AUTHORITY_REQUIRED');assert.equal(result.verifiedSolution,null);
    fs.appendFileSync(path.join(root,sourcePath),'\n');assert.throws(()=>resolveQuestion(root,{questionUid:'stable-exam|1',sourceRegistryRef}),/STALE_SOURCE_AUTHORITY/);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('real UID locator leaves immutable INPUT_REQUIRED rather than fabricated authority',()=>{
  const {result,receipt}=runQuestion(repoRoot,{questionUid:'25_효천고_2학기_중간_고1_기출|1'});
  assert.equal(result.status,'INPUT_REQUIRED');assert.equal(result.reason,'UID_AUTHORITY_REGISTRY_REQUIRED');
  assert.equal(result.locatedSourceCandidates[0].questionFound,true);assert.equal(result.productionAuthorized,false);
  assert.deepEqual(JSON.parse(readBoundFile(repoRoot,receipt.outputs[0])),result);
});
