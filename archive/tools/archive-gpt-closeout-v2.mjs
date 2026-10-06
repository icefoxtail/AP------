import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { QUALITY_CONTRACT_V2 } from './archive-stage-validator-artifact-v2.mjs';
import { gitBlobSha } from './archive-stage-validator-compat-v1.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
function readBound(root, ref) {
  if (!ref || typeof ref.path !== 'string' || path.isAbsolute(ref.path)) throw new Error('PHYSICAL_REF_REQUIRED');
  const file=path.resolve(root,ref.path),rel=path.relative(path.resolve(root),file);
  if(rel==='..' || rel.startsWith('..'+path.sep) || path.isAbsolute(rel)) throw new Error('REF_PATH_ESCAPE');
  const real=fs.realpathSync(file),rr=path.relative(fs.realpathSync(root),real);
  if(rr==='..' || rr.startsWith('..'+path.sep) || path.isAbsolute(rr)) throw new Error('REF_SYMLINK_ESCAPE');
  const bytes=fs.readFileSync(file); if(hash(bytes)!==ref.sha256) throw new Error('PHYSICAL_REF_SHA_MISMATCH'); return bytes;
}

export function validateGptMainDoneReceipt({receipt,root,r3Validation,assets=[],campaignId,stream}) {
  const issues=[];
  try {
    if(receipt?.executionLine!=='GPT_SCHEDULED' || receipt?.qualityContractVersion!==QUALITY_CONTRACT_V2 || receipt?.status!=='MAIN_DONE') throw new Error('GPT_MAIN_DONE_CONTRACT_REQUIRED');
    if(!nonEmpty(receipt.campaignId) || receipt.campaignId!==campaignId) throw new Error('GPT_MAIN_DONE_CAMPAIGN_REQUIRED');
    if(!['A','B','C'].includes(receipt.stream) || receipt.stream!==stream) throw new Error('GPT_MAIN_DONE_STREAM_REQUIRED');
    if(!nonEmpty(receipt.artifactSha)) throw new Error('GPT_MAIN_DONE_ARTIFACT_REQUIRED');
    if(!/^archive\/exams\/(original|similar|types)\//.test(receipt.productionPath||'') || /generated/i.test(receipt.productionPath)) throw new Error('PRODUCTION_PATH_REQUIRED');
    const read=JSON.parse(readBound(root,receipt.r3Validation));
    if(JSON.stringify(read)!==JSON.stringify(r3Validation)) throw new Error('R3_VALIDATION_PARITY_REQUIRED');
    if(read.ok!==true || read.validatorMode!=='R3_V2' || read.artifactSha!==receipt.artifactSha || read.qualityContractVersion!==QUALITY_CONTRACT_V2 || read.executionLine!=='GPT_SCHEDULED' || read.campaignId!==campaignId || String(read.stream||'').toUpperCase()!==stream || read.artifactContract?.active!==true) throw new Error('GPT_R3_RELEASE_READY_REQUIRED');
    const main=execFileSync('git',['-C',root,'rev-parse','origin/main'],{encoding:'utf8'}).trim();
    if(execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim()!==main) throw new Error('WORKING_HEAD_MAIN_PARITY_REQUIRED');
    if(main!==receipt.remoteMainSha) throw new Error('REMOTE_MAIN_SHA_MISMATCH');
    const readBlob=p=>execFileSync('git',['-C',root,'show',main+':'+p]);
    if(gitBlobSha(readBlob(receipt.productionPath))!==receipt.artifactSha) throw new Error('REMOTE_PRODUCTION_BLOB_MISMATCH');
    const seen=new Set();
    for(const asset of assets){
      if(!asset || !nonEmpty(asset.ref) || !nonEmpty(asset.sha256) || seen.has(asset.ref)) throw new Error('REMOTE_ASSET_SET_INVALID');
      seen.add(asset.ref);
      if(!asset.ref.startsWith('assets/images/') || asset.ref.includes('..')) throw new Error('REMOTE_ASSET_PATH_INVALID');
      if(hash(readBlob('archive/'+asset.ref))!==asset.sha256) throw new Error('REMOTE_ASSET_SHA_MISMATCH:'+asset.ref);
    }
  }catch(error){issues.push(error.message);}
  return {ok:!issues.length,disposition:issues.length?'FAIL':'PASS',issues};
}
