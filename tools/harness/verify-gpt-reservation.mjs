#!/usr/bin/env node
// GPT-only booked-stage offline byte verifier. Never attests a remote provider or quality.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
const SHA=/^[a-f0-9]{64}$/i;
const STAGES={
 COURIER:{schema:'GPT_BOOK_FINAL_DELIVERY_V2',success:'READY_MATH'},
 MATH_META:{schema:'GPT_BOOK_MATH_META_RECEIPT_V2',success:'MATH_DONE'},
 VISUAL:{schema:'GPT_BOOK_VISUAL_RECEIPT_V2',success:'VISUAL_DONE'}
};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const str=v=>typeof v==='string'&&v.length>0;
export function verifyStage({stage,receipt,inputBytes,outputBytes,predecessor,sourceBytes}){
 const errors=[],pending=[],spec=STAGES[stage];
 if(!spec)return {verdict:'FAIL',errors:['UNSUPPORTED_STAGE'],pending:[]};
 if(!receipt||typeof receipt!=='object'||Array.isArray(receipt))return {verdict:'FAIL',errors:['INVALID_RECEIPT'],pending:[]};
 if(receipt.schemaVersion!==spec.schema)errors.push('SCHEMA_MISMATCH');
 if(!str(receipt.batchId)||!Number.isInteger(receipt.revision))errors.push('MISSING_IDENTITY');
 if(stage!=='COURIER'&&receipt.stage!==stage)errors.push('STAGE_MISMATCH');
 if(stage!=='COURIER'&&receipt.status!==spec.success)errors.push('STAGE_NOT_DONE');
 if(stage==='COURIER'&&receipt.deliveryStatus!=='DELIVERED_READBACK_VERIFIED')pending.push('DELIVERY_NOT_PROVEN');
 if(stage==='COURIER'&&!['READY_MATH','MATH_DONE','VISUAL_DONE','MAIN_DONE'].includes(receipt.status))pending.push('COURIER_NOT_DELIVERED');
 const check=(kind,bytes,sha)=>{
  if(!SHA.test(sha||'')){errors.push(kind+'_SHA_MISSING');return;}
  if(bytes===undefined||bytes===null){pending.push(kind+'_BYTES_NOT_READ');return;}
  if(hash(bytes)!==sha.toLowerCase())errors.push(kind+'_SHA_MISMATCH');
 };
 if(stage==='COURIER'){
  if(!str(receipt.sourceLibraryFileId)||!str(receipt.sourceDriveFileId))errors.push('SOURCE_ID_MISSING');
  if(receipt.sourceSha256!==receipt.sourceLibrarySha256)errors.push('SOURCE_LIBRARY_SHA_CLAIM_MISMATCH');
  check('SOURCE',sourceBytes,receipt.sourceSha256);
 }else{
  if(!str(receipt.stageInputLibraryFileId))errors.push('INPUT_ID_MISSING');
  if(!str(receipt.stageOutputLibraryFileId))errors.push('OUTPUT_ID_MISSING');
  check('INPUT',inputBytes,receipt.stageInputSha256);
  check('OUTPUT',outputBytes,receipt.stageOutputSha256);
  if(stage==='VISUAL'){
   if(!predecessor)pending.push('MATH_RECEIPT_UNREAD');
   else{
    if(predecessor.batchId!==receipt.batchId||predecessor.revision!==receipt.revision)errors.push('PREDECESSOR_IDENTITY_MISMATCH');
    if(predecessor.stageOutputLibraryFileId!==receipt.stageInputLibraryFileId||predecessor.stageOutputSha256!==receipt.stageInputSha256)errors.push('PREDECESSOR_LINEAGE_MISMATCH');
   }
  }
 }
 return {stage,batchId:receipt.batchId??null,revision:receipt.revision??null,statusClaim:receipt.status??null,
  verdict:errors.length?'FAIL':pending.length?'UNKNOWN':'BYTE_EVIDENCE_PASS',
  errors,pending,remoteProviderAttestation:'NOT_VERIFIED_BY_OFFLINE_CHECK',skillInjection:'UNKNOWN',
  mathQuality:'NOT_REASSESSED',gitMainMerged:'NOT_VERIFIED',
  nextAction:errors[0]||pending[0]||'REMOTE_PROVIDER_ID_AND_BYTES_READBACK'};
}
const direct=process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(direct){
 const argv=process.argv.slice(2),opt={};
 for(let i=0;i<argv.length;i+=2)opt[argv[i]]=argv[i+1];
 if(!opt['--stage']||!opt['--receipt']){
  console.error('Usage: node verify-gpt-reservation.mjs --stage MATH_META|VISUAL|COURIER --receipt receipt.json [--input input.json --output output.json --predecessor math-receipt.json --source original.json]');
  process.exitCode=2;
 }else{
  try{
   const json=p=>p?JSON.parse(fs.readFileSync(p,'utf8')):undefined;
   const bytes=p=>p?fs.readFileSync(p):undefined;
   const out=verifyStage({stage:opt['--stage'],receipt:json(opt['--receipt']),inputBytes:bytes(opt['--input']),outputBytes:bytes(opt['--output']),predecessor:json(opt['--predecessor']),sourceBytes:bytes(opt['--source'])});
   console.log(JSON.stringify(out,null,2));
   if(out.verdict==='FAIL')process.exitCode=1;
  }catch(e){console.error('INPUT_READ_ERROR: '+e.message);process.exitCode=2;}
 }
}