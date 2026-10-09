#!/usr/bin/env node
// Remote Library transaction preflight: the caller must upload files with
// files.manage_library, download them using files.materialize, and supply hashes.
// This module never labels unperformed remote operations as complete.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const NEXT = {CREATE:'R1',R1:'R2',R2:'R3',R3:'PUBLICATION'};
const STATUS = {CREATE:'CREATE_PASS',R1:'R1_QUALITY_SEALED',R2:'R2_VERIFIED',R3:'R3_RELEASE_READY'};
function checked(o) {
  if(!/^[\w]+$/.test(o.campaignId||'') || !['A','B','C'].includes(o.stream)
      || !/^[\w가-힣-]+$/.test(o.examUid||'') || !NEXT[o.stage])throw Error('INVALID_SCOPE');
  const root=path.resolve(o.outputRoot,o.campaignId,o.stream,o.examUid);
  const handoffPath=path.join(root,'handoffs',NEXT[o.stage]+'.json');
  const handoff=JSON.parse(fs.readFileSync(handoffPath,'utf8'));
  if(handoff.campaignId!==o.campaignId || handoff.stream!==o.stream || handoff.examUid!==o.examUid
     || handoff.previousStage!==o.stage || handoff.stage!==NEXT[o.stage]
     || !/^[0-9a-f]{40}$/.test(handoff.artifactSha))throw Error('HANDOFF_DRIFT');
  const prefix=path.join(root,'seals',o.stage,handoff.artifactSha);
  const validatorFile=prefix+'.validator.json',sealFile=prefix+'.json';
  const validatorBytes=fs.readFileSync(validatorFile),validator=JSON.parse(validatorBytes);
  const seal=JSON.parse(fs.readFileSync(sealFile));
  if(seal.campaignId!==o.campaignId || seal.stream!==o.stream || seal.examUid!==o.examUid
    || seal.stage!==o.stage || seal.artifactSha!==handoff.artifactSha
    || seal.evidenceSha256!==handoff.evidenceSha256 || seal.stageStatus!==STATUS[o.stage]
    || seal.validatorReportSha256!==sha(validatorBytes) || validator.ok!==true
    || validator.validatorMode!==o.stage+'_V2' || validator.artifactSha!==handoff.artifactSha
    || validator.artifactContract?.active!==true || validator.issues?.length!==0)throw Error('VALIDATOR_OR_RECEIPT_DRIFT');
  const prefixRemote='/Archive2-GPT/generations/'+o.campaignId+'/'+o.stream+'/'+o.examUid+'/TECHNICAL/GPT2_V2/';
  const files=[[validatorFile,prefixRemote+'seals/'+o.stage+'/'+handoff.artifactSha+'.validator.json'],
    [sealFile,prefixRemote+'seals/'+o.stage+'/'+handoff.artifactSha+'.json'],
    [handoffPath,prefixRemote+'handoffs/'+NEXT[o.stage]+'.json']]
     .map(([localPath,remotePath])=>({localPath,remotePath,sha256:sha(fs.readFileSync(localPath)),sizeBytes:fs.statSync(localPath).size}));
  return {handoff,files,commitPath:prefixRemote+'commits/'+o.stage+'-'+handoff.artifactSha+'.json'};
}
export function plan(o){
  const x=checked(o);
  return {schemaVersion:'GPT2_REMOTE_PLAN_v2',state:'AWAITING_REMOTE_READBACK',
    campaignId:o.campaignId,stream:o.stream,examUid:o.examUid,stage:o.stage,
    artifactSha:x.handoff.artifactSha,items:x.files,commitPath:x.commitPath};
}
export function verify(o,observations){
  const p=plan(o);
  if(!Array.isArray(observations)||observations.length!==p.items.length)throw Error('READBACK_INCOMPLETE');
  const index=new Map();
  for(const z of observations){if(index.has(z.remotePath))throw Error('READBACK_DUPLICATE');index.set(z.remotePath,z);}
  for(const item of p.items){const z=index.get(item.remotePath);
    if(!z || z.readbackConfirmed!==true || z.sha256!==item.sha256 || z.sizeBytes!==item.sizeBytes)
      throw Error('REMOTE_READBACK_MISMATCH:'+item.remotePath);}
  return {schemaVersion:'GPT2_REMOTE_COMMIT_v2',status:'REMOTE_VERIFIED',campaignId:p.campaignId,
    stream:p.stream,examUid:p.examUid,stage:p.stage,artifactSha:p.artifactSha,
    verifiedItems:p.items.map(({remotePath,sha256,sizeBytes})=>({remotePath,sha256,sizeBytes})),
    commitPath:p.commitPath};
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try {const [action,outputRoot,campaignId,stream,examUid,stage,input]=process.argv.slice(2);
    const opts={outputRoot,campaignId,stream,examUid,stage};
    console.log(JSON.stringify(action==='plan'?plan(opts):action==='verify'?verify(opts,JSON.parse(fs.readFileSync(input))):(()=>{throw Error('INVALID_ACTION')})(),null,2));
  } catch(e){console.error(JSON.stringify({ok:false,error:e.message}));process.exitCode=2;}
}
