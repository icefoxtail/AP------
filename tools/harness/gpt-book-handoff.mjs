#!/usr/bin/env node
// 5-lane GPT Book Library handoff *byte and lineage* verifier.
// Deliberately does not attest Library remote fetch, quality review, Git merge or deployment.
import {readFileSync, existsSync} from 'node:fs';
import {join, basename, resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

export const STAGES = ['COURIER','MATH_META','VISUAL','RELEASE','ALL_MASTER'];
const HEX = /^[0-9a-f]{64}$/i;
const RECEIPTS = {math:'11_MATH_META_RECEIPT.json',visual:'21_VISUAL_RECEIPT.json'};
const FILES = {assignment:'00_ASSIGNMENT.json',math:'10_MATH_META_REVIEWED.json',visual:'20_VISUAL_REVIEWED.json',mathReceipt:RECEIPTS.math,visualReceipt:RECEIPTS.visual,releaseReceipt:'30_RELEASE_RECEIPT.json'};
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
const isId = s => typeof s==='string' && s.length>8;
const safeName = s => typeof s==='string' && s===basename(s) && !['','.','..'].includes(s) && !s.includes('\\') && !s.includes('/') && !s.includes('\0');

export function verify({directory, stage, ids={}}) {
  if(!STAGES.includes(stage)) throw Error('INVALID_STAGE');
  const report={contract:'GPT_BOOK_HANDOFF_HARNESS_v1',stage,scope:'LOCAL_RAW_BYTES_AND_LINEAGE_ONLY',status:'UNKNOWN',checks:[],firstMissingStep:null,qualityApproval:'NOT_EVALUATED',remoteLibraryReadback:'NOT_ATTESTED_BY_CLI',gitMerge:'NOT_EVALUATED',deployment:'NOT_EVALUATED'};
  const fail=(code,detail)=>{report.status='FAIL';report.firstMissingStep=code;report.detail=detail;return report;};
  const unknown=(code,detail)=>{report.status='UNKNOWN';report.firstMissingStep=code;report.detail=detail;return report;};
  const ok=(code)=>report.checks.push(code);
  const dir=resolve(directory);
  function load(filename, json=true) {
    if(!safeName(filename)) throw Object.assign(Error('unsafe filename'),{code:'UNSAFE_FILENAME'});
    const file=join(dir,filename);
    if(!existsSync(file))throw Object.assign(Error('missing '+filename),{code:'RAW_BYTES_MISSING'});
    const bytes=readFileSync(file);
    const value=json?JSON.parse(bytes.toString('utf8')):null;
    if(json && (!value || typeof value!=='object'||Array.isArray(value)))throw Error('invalid JSON object');
    return {value,sha:sha(bytes),bytes:bytes.length};
  }
  const assert=(condition,code)=>{if(!condition)throw Object.assign(Error(code),{code});};
  const hashEq=(value,actual,code)=>assert(HEX.test(value??'')&&value.toLowerCase()===actual,code);
  const same=(a,b,code)=>assert(typeof a==='string'&&!!a&&a===b,code);
  const matchId=(key,expected,code)=>{
    // These IDs must be captured from actual Library retrieval in caller, not inferred by file names.
    if(!isId(ids[key]))throw Object.assign(Error('Library retrieved ID missing for '+key),{code:'FILE_ID_PROBE_MISSING',isUnknown:true});
    same(expected,ids[key],code);
  };
  try {
    const assignment=load(FILES.assignment), a=assignment.value;
    assert(a.schemaVersion==='GPT_BOOK_FINAL_DELIVERY_V2'||a.schemaVersion==='GPT_BOOK_FINAL_LIBRARY_HANDOFF_V2','ASSIGNMENT_SCHEMA_WRONG');
    assert(typeof a.batchId==='string'&&a.batchId.length>0&&Number.isInteger(a.revision)&&a.revision>0,'ASSIGNMENT_IDENTITY_INVALID');
    assert(safeName(a.sourceOriginalFilename),'ORIGINAL_NAME_INVALID');
    const orig=load(a.sourceOriginalFilename,false);
    hashEq(a.sourceSha256,orig.sha,'SOURCE_HASH_MISMATCH');
    if(own(a,'sourceLibrarySha256'))hashEq(a.sourceLibrarySha256,orig.sha,'SOURCE_LIBRARY_HASH_MISMATCH');
    assert(isId(a.sourceLibraryFileId),'SOURCE_LIBRARY_ID_MISSING');
    matchId('original',a.sourceLibraryFileId,'SOURCE_FILE_ID_MISMATCH');
    matchId('assignment',ids.assignment,'ASSIGNMENT_FILE_ID_INVALID');
    report.batchId=a.batchId; report.revision=a.revision;
    report.source={bytes:orig.bytes,sha256:orig.sha,fileId:ids.original};
    ok('COURIER_SOURCE_RAW_HASH_AND_ASSIGNMENT');
    if(stage==='COURIER') {
      report.status='LOCAL_EVIDENCE_PASS';return report;
    }
    const m=load(FILES.math),mr=load(FILES.mathReceipt),r=mr.value;
    assert(r.schemaVersion==='GPT_BOOK_MATH_META_RECEIPT_V2','MATH_RECEIPT_SCHEMA_WRONG');
    assert(r.stage===undefined||r.stage==='MATH_META','MATH_STAGE_WRONG');
    assert(['MATH_META','GPT_BOOK_MATH_META'].includes(r.stageOwner),'MATH_OWNER_WRONG');
    assert(r.status==='MATH_DONE','MATH_NOT_DONE');
    same(r.batchId,a.batchId,'MATH_BATCH_LINEAGE_MISMATCH');
    assert(r.revision===a.revision,'MATH_REVISION_MISMATCH');
    hashEq(r.sourceSha256,orig.sha,'MATH_SOURCE_HASH_MISMATCH');
    hashEq(r.stageInputSha256,orig.sha,'MATH_INPUT_HASH_MISMATCH');
    same(r.stageInputLibraryFileId,a.sourceLibraryFileId,'MATH_INPUT_FILE_ID_MISMATCH');
    hashEq(r.stageOutputSha256,m.sha,'MATH_OUTPUT_HASH_MISMATCH');
    if(own(r,'remoteReadbackSha256'))hashEq(r.remoteReadbackSha256,m.sha,'MATH_READBACK_CLAIM_MISMATCH');
    matchId('math',r.stageOutputLibraryFileId,'MATH_OUTPUT_FILE_ID_MISMATCH');
    matchId('mathReceipt',ids.mathReceipt,'MATH_RECEIPT_FILE_ID_INVALID');
    if(own(a,'stageOutputSha256'))hashEq(a.stageOutputSha256,m.sha,'ASSIGNMENT_MATH_OUTPUT_HASH_MISMATCH');
    ok('MATH_META_RAW_HASH_AND_LINEAGE');
    if(stage==='MATH_META'){report.status='LOCAL_EVIDENCE_PASS';return report;}
    const v=load(FILES.visual),vr=load(FILES.visualReceipt),s=vr.value;
    assert(s.schemaVersion==='GPT_BOOK_VISUAL_RECEIPT_V2','VISUAL_RECEIPT_SCHEMA_WRONG');
    assert(s.stage===undefined||s.stage==='VISUAL','VISUAL_STAGE_WRONG');
    assert(['VISUAL','GPT_BOOK_VISUAL'].includes(s.stageOwner),'VISUAL_OWNER_WRONG');
    assert(s.status==='VISUAL_DONE','VISUAL_NOT_DONE');
    same(s.batchId,a.batchId,'VISUAL_BATCH_LINEAGE_MISMATCH');
    assert(s.revision===a.revision,'VISUAL_REVISION_MISMATCH');
    hashEq(s.sourceSha256,orig.sha,'VISUAL_SOURCE_HASH_MISMATCH');
    hashEq(s.stageInputSha256,m.sha,'VISUAL_INPUT_HASH_MISMATCH');
    same(s.stageInputLibraryFileId,r.stageOutputLibraryFileId,'VISUAL_INPUT_FILE_ID_MISMATCH');
    matchId('mathReceipt',s.stageInputReceiptLibraryFileId,'VISUAL_INPUT_RECEIPT_ID_MISMATCH');
    if(own(s,'stageInputReceiptSha256'))hashEq(s.stageInputReceiptSha256,mr.sha,'VISUAL_INPUT_RECEIPT_HASH_MISMATCH');
    hashEq(s.stageOutputSha256,v.sha,'VISUAL_OUTPUT_HASH_MISMATCH');
    if(own(s,'remoteReadbackSha256'))hashEq(s.remoteReadbackSha256,v.sha,'VISUAL_READBACK_CLAIM_MISMATCH');
    if(own(s,'stageOutputSizeBytes'))assert(s.stageOutputSizeBytes===v.bytes,'VISUAL_OUTPUT_BYTES_MISMATCH');
    matchId('visual',s.stageOutputLibraryFileId,'VISUAL_OUTPUT_FILE_ID_MISMATCH');
    matchId('visualReceipt',ids.visualReceipt,'VISUAL_RECEIPT_ID_INVALID');
    ok('VISUAL_RAW_HASH_AND_LINEAGE');
    if(stage==='VISUAL'){report.status='LOCAL_EVIDENCE_PASS';return report;}
    if(!existsSync(join(dir,FILES.releaseReceipt)))return unknown('RELEASE_RECEIPT_MISSING','No 30_RELEASE_RECEIPT.json raw bytes provided');
    const release=load(FILES.releaseReceipt).value;
    if(release.batchId!==a.batchId||release.revision!==a.revision)return fail('RELEASE_LINEAGE_MISMATCH');
    if(stage==='ALL_MASTER')return unknown('GIT_REMOTE_MERGE_NOT_PROBED','Earlier stage bytes match; release requires an independent live GitHub merged=true and main blob readback');
    return unknown('GIT_REMOTE_MERGE_NOT_PROBED','Receipt alone cannot attest GitHub merged=true/main blob readback');
  } catch(e) {
    if(e.code==='RAW_BYTES_MISSING'||e.code==='FILE_ID_PROBE_MISSING'||e.isUnknown) return unknown(e.code||'EVIDENCE_MISSING',e.message);
    return fail(e.code||'INVALID_RAW_OR_JSON',e.message);
  }
}
export function main(args=process.argv.slice(2)) {
  try{
    let dir=null,stage=null,idsPath=null;
    for(let i=0;i<args.length;i++){
      const option=args[i];
      if(option==='--json')continue;
      if(!['--dir','--stage','--ids'].includes(option)||!args[i+1])throw Error('ARGUMENT_INVALID');
      const value=args[++i];
      if(option==='--dir')dir=value;
      if(option==='--stage')stage=value;
      if(option==='--ids')idsPath=value;
    }
    if(!dir||!stage)throw Error('REQUIRED_ARGS: --dir <folder> --stage COURIER|MATH_META|VISUAL|RELEASE|ALL_MASTER [--ids retrieved-ids.json]');
    const ids=idsPath?JSON.parse(readFileSync(idsPath,'utf8')):{};
    const result=verify({directory:dir,stage,ids});
    console.log(JSON.stringify(result,null,2));
    return result.status==='LOCAL_EVIDENCE_PASS'?0:result.status==='UNKNOWN'?2:1;
  }catch(e){console.error(JSON.stringify({contract:'GPT_BOOK_HANDOFF_HARNESS_v1',status:'FAIL',error:e.message}));return 1;}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)process.exitCode=main();
