import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {canonicalJson,objectSha,readBoundFile,fileRef} from '../../pipeline-core/canonical.mjs';
import {assetIdentity,stageKey,validateFrozenPlan,reduceResult} from './contracts.mjs';
import {scopeFingerprint,mathFingerprint} from './fingerprint.mjs';
import {reconstruct,compareReconstruction} from './cindy-observer.mjs';
import {commitStage,calculationStage,bindRunWorkspace,withWorkRoot} from './store.mjs';
import {pythonWorker} from './worker.mjs';
import {runQuestion,locatedSourceCandidates} from './resolve-request.mjs';
import {runPhase2} from './phase2.mjs';

export const repoRoot = fileURLToPath(new URL('../../../../',import.meta.url));
export async function runFrozen(root, request) {
  const runId=request.runId||'frozen-'+objectSha({questionUid:request.questionUid,surface:request.surface,capability:request.capability}).slice(7,19);
  const workspace=bindRunWorkspace(root,{questionUid:request.questionUid,replayResultRef:request.replayResultRef,runId});
  return withWorkRoot(workspace.workRoot,()=>runFrozenInWorkspace(root,request,workspace));
}
async function runFrozenInWorkspace(root, request, workspace) {
  const identity = assetIdentity(request.questionUid,request.surface,request.visualRole);
  if (request.mode !== 'PHASE0_2_EXPERIMENT') throw Error('ONLY_PHASE0_2_EXPERIMENT_SUPPORTED');
  const plan = JSON.parse(readBoundFile(root,request.frozenPlanRef));
  if (plan.questionUid !== identity.questionUid || plan.visualAssetKey !== identity.visualAssetKey) throw Error('PLAN_IDENTITY_MISMATCH');
  const planSha256 = validateFrozenPlan(plan);
  const capability=request.capability;
  const fingerprint=scopeFingerprint(root,capability);
  if((capability==='construction-spike-v1'&&!plan.mathPlan)||(capability==='polynomial-spike-v1'&&plan.graphPlan?.family!=='polynomial')||(capability==='rational-spike-v1'&&plan.graphPlan?.family!=='rational'))throw Error('PLAN_CAPABILITY_MISMATCH');
  if(plan.sourceRef?.sha256!==request.sourceRef.sha256||plan.solutionRef?.sha256!==request.solutionRef.sha256)throw Error('PLAN_SOURCE_BINDING_MISMATCH');
  const action = plan.mathPlan ? 'construction' : 'graph';
  const projection = plan.mathPlan ? {action,graph:plan.mathPlan} : {action,graphPlan:plan.graphPlan};
  const provenance = {identity,planSha256,sourceRef:request.sourceRef,solutionRef:request.solutionRef};
  readBoundFile(root,request.sourceRef); readBoundFile(root,request.solutionRef);
  const key = stageKey('MATH',projection,mathFingerprint(root,capability));
  const stage = await calculationStage(root,{stage:'MATH',key,provenance},async () => {
    const response = await pythonWorker(projection);
    if (response.status !== 'OK') throw Error(response.result.code);
    return {'model.json':canonicalJson(response.result)};
  });
  const model=JSON.parse(readBoundFile(root,stage.receipt.outputs[0]));
  let observation,axis;
  if(action==='construction'){
    const peer=reconstruct(plan.mathPlan);observation={...compareReconstruction(model,peer),peer};axis='CINDY_RECONSTRUCTION';
  }else{
    const response=await pythonWorker({graphPlan:plan.graphPlan,svg:model.svg,transform:model.transform},{script:fileURLToPath(new URL('graph-observer-worker.py',import.meta.url))});
    observation=response.result;axis='GRAPH_INTERIOR_BOUND';
  }
  const auditReceipt=commitStage(root,{stage:'AUDIT',key:objectSha({key,fingerprint,invocation:crypto.randomUUID()}),provenance,outputs:{'observation.json':canonicalJson(observation)}});
  const result = {schemaVersion:'VISUAL_RESULT_v1',...identity,planSha256,capability,fingerprint,workRoot:workspace.workRoot,runId:workspace.runId,examUid:workspace.examUid,stages:[stage.receipt.manifestRef,auditReceipt.manifestRef],cacheHit:stage.cacheHit,evidence:{[axis]:{status:observation.status,ref:auditReceipt.outputs[0]}},...reduceResult(capability,{[axis]:observation})};
  // Each invocation gets a new immutable result; no cached evidence approval.
  const resultKey = objectSha({result,invocation:crypto.randomUUID()});
  return commitStage(root,{stage:'RESULT',key:resultKey,provenance,outputs:{'result.json':canonicalJson(result)}});
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const allowedFlags=new Set(['--request','--question-uid','--resume','--source-registry','--experimental-locator']);
    for(const arg of process.argv.slice(2))if(arg.startsWith('--')&&!allowedFlags.has(arg))throw Error('UNSUPPORTED_CLI_OPTION:'+arg);
    const uidIndex=process.argv.indexOf('--question-uid');
    if(uidIndex>=0){
      const questionUid=process.argv[uidIndex+1];
      const resumeIndex=process.argv.indexOf('--resume');
      const registryIndex=process.argv.indexOf('--source-registry');
      let options={questionUid,sourceRegistryRef:registryIndex>=0?fileRef(repoRoot,process.argv[registryIndex+1]):null,replayResultRef:resumeIndex>=0?fileRef(repoRoot,process.argv[resumeIndex+1]):null};
      if(process.argv.includes('--experimental-locator')){
        const candidates=locatedSourceCandidates(repoRoot,questionUid);
        if(candidates.length!==1||!candidates[0].questionFound)throw Error('AMBIGUOUS_OR_MISSING_UID_SOURCE');
        options={...options,sourcePath:candidates[0].sourceRef.path,ordinal:candidates[0].ordinal,experimentalLocator:true};
      }
      const output=await runPhase2(options);
      const resultRef=output.receipt.outputs.find(v=>v.path.endsWith('/result.json'))||output.receipt.outputs[0];
      console.log(JSON.stringify({status:output.result.status,reason:output.result.reason||output.result.error||null,identityStatus:output.result.identityStatus||null,workRoot:output.result.workRoot||null,resultRef}));
      if(output.result.status!=='PHASE2_SLICE_COMPLETE')process.exitCode=2;
    }else{
    const index = process.argv.indexOf('--request');
    if (index < 0) throw Error('REQUEST_FILE_REQUIRED');
    console.log(JSON.stringify(await runFrozen(repoRoot,JSON.parse(fs.readFileSync(process.argv[index+1],'utf8')))));
    }
  } catch(error) {console.error(error.message);process.exitCode=1;}
}
