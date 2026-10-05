import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {canonicalJson,objectSha,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {assetIdentity,stageKey,planHash,reduceResult,capabilityFingerprint} from './contracts.mjs';
import {commitStage,calculationStage} from './store.mjs';
import {pythonWorker} from './worker.mjs';

export const repoRoot = fileURLToPath(new URL('../../../../',import.meta.url));
export async function runFrozen(root, request) {
  const identity = assetIdentity(request.questionUid,request.surface,request.visualRole);
  if (request.mode !== 'PHASE0_2_EXPERIMENT') throw Error('ONLY_PHASE0_2_EXPERIMENT_SUPPORTED');
  const plan = JSON.parse(readBoundFile(root,request.frozenPlanRef));
  if (plan.questionUid !== identity.questionUid || plan.visualAssetKey !== identity.visualAssetKey) throw Error('PLAN_IDENTITY_MISMATCH');
  const planSha256 = planHash(plan);
  const fingerprint = capabilityFingerprint(root,request.fingerprint);
  const action = plan.mathPlan ? 'construction' : 'build';
  const projection = plan.mathPlan ? {action,graph:plan.mathPlan} : {action,spec:plan.visualSpec,measurements:plan.measurements??null};
  const provenance = {identity,planSha256,sourceRef:request.sourceRef,solutionRef:request.solutionRef};
  readBoundFile(root,request.sourceRef); readBoundFile(root,request.solutionRef);
  const key = stageKey('MATH',projection,fingerprint);
  const stage = await calculationStage(root,{stage:'MATH',key,provenance},async () => {
    const response = await pythonWorker(projection);
    if (response.status !== 'OK') throw Error(response.result.code);
    return {'model.json':canonicalJson(response.result)};
  });
  const result = {schemaVersion:'VISUAL_RESULT_v1',...identity,planSha256,capability:request.fingerprint.capability,fingerprint,stages:[stage.receipt.manifestRef],cacheHit:stage.cacheHit,...reduceResult(request.fingerprint.capability,{})};
  // Each invocation gets a new immutable result; no cached evidence approval.
  const resultKey = objectSha({result,invocation:crypto.randomUUID()});
  return commitStage(root,{stage:'RESULT',key:resultKey,provenance,outputs:{'result.json':canonicalJson(result)}});
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const index = process.argv.indexOf('--request');
    if (index < 0) throw Error('REQUEST_FILE_REQUIRED');
    console.log(JSON.stringify(await runFrozen(repoRoot,JSON.parse(fs.readFileSync(process.argv[index+1],'utf8')))));
  } catch(error) {console.error(error.message);process.exitCode=1;}
}
