#!/usr/bin/env node
// Read-only, evidence-limited backlog overview. Never marks an exam REGISTERED.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = '.archive-meta-register/pending-supplement';
const STATE = '.archive-meta-register/auto/state.json';
const sorted = a => [...a].sort((a,b)=>String(a).localeCompare(String(b),'en'));
const countBy = (rows, fn) => Object.fromEntries(sorted([...new Set(rows.map(fn))]).map(k=>[k,rows.filter(r=>fn(r)===k).length]));
const read = (root, rel) => JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));
const safeSource = s => typeof s==='string' && s.endsWith('.js') &&
  !s.startsWith('/') && !s.includes('\\') && !s.split('/').some(p=>!p||p==='.'||p==='..');

function gitBlobSha(bytes) {
  return crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
}
function sourceInfo(root, source) {
  if (!safeSource(source)) return {exists:false,blob:null,unsafe:true};
  const file=path.join(root,'archive/exams',source);
  if(!fs.existsSync(file))return {exists:false,blob:null,unsafe:false};
  const bytes=fs.readFileSync(file);
  return {exists:true,blob:gitBlobSha(bytes),unsafe:false};
}
export function summarizeArchiveMetaBacklog({requests, provisionalReceipts={}, autoState, sources={}}) {
  if (!Array.isArray(requests) || !autoState || typeof autoState!=='object') throw Error('BACKLOG_INPUT_INVALID');
  const pending=Object.values(autoState.pending||{});
  const pendingBySource=new Map();
  for(const item of pending){
    const p=item?.sourceArchiveFile;
    if(typeof p!=='string')continue;
    if(!pendingBySource.has(p))pendingBySource.set(p,[]);
    pendingBySource.get(p).push(item);
  }
  const rows=requests.map((request)=>{
    const id=request.requestId;
    const source=request.sourceArchiveFile;
    if(typeof id!=='string'||!id||!safeSource(source))throw Error('BACKLOG_REQUEST_IDENTITY_INVALID');
    const old=provisionalReceipts[id]||null;
    const file=sources[source]||{exists:false,blob:null};
    const currentPending=pendingBySource.get(source)||[];
    const reasons=sorted(new Set(currentPending.flatMap(x=>Array.isArray(x.lastReasons)?x.lastReasons:[])));
    const items=Array.isArray(request.items)?request.items:[];
    const reviewed=request.approval?.metadataReviewed===true;
    const emptyAfter=items.filter(q=>!q.after||typeof q.after!=='object'||!Object.keys(q.after).length).length;
    const blobSame=typeof request.expectedSourceBlobSha1==='string' && file.blob
      ? request.expectedSourceBlobSha1===file.blob : null;
    let nextAction='CHECK_CURRENT_REGISTRATION_EVIDENCE';
    if(!file.exists)nextAction='SOURCE_MISSING';
    else if(!reviewed||emptyAfter)nextAction='REVIEW_MISSING_METADATA_EVIDENCE';
    else if(reasons.includes('IDENTITY_SOURCE_FINGERPRINT_MISMATCH'))nextAction='VERIFY_UID_SOURCE_REBIND';
    else if(currentPending.length)nextAction='FIX_CURRENT_AUTO_PENDING';
    else if(blobSame===false)nextAction='VERIFY_CHANGED_SOURCE_BLOB';
    return {
      requestId:id, examUid:request.examUid||null, sourceArchiveFile:source,
      expectedQuestionCount:Number.isInteger(request.expectedQuestionCount)?request.expectedQuestionCount:null,
      requestItemCount:items.length, metadataReviewed:reviewed, emptyAfterCount:emptyAfter,
      sourceExists:Boolean(file.exists), expectedSourceBlobMatchesCurrent:blobSame,
      currentAutoPendingQids:currentPending.length, currentAutoReasons:reasons,
      oldProvisionalStatus:old?.metadataApprovalStatus||null,
      oldVerifiedStatus:old?.metadataVerificationStatus||null,
      oldProjectionStatus:old?.canonicalProjectionStatus||null,
      nextAction, registrationEvidenceStatus:'NOT_EVALUATED',
    };
  });
  if(new Set(rows.map(r=>r.requestId)).size!==rows.length)throw Error('DUPLICATE_REQUEST_ID');
  rows.sort((a,b)=>a.requestId.localeCompare(b.requestId,'en'));
  const allReasons=pending.flatMap(x=>Array.isArray(x.lastReasons)?x.lastReasons:[]);
  return {
    schemaVersion:'archive-meta-backlog-readonly-v1', mode:'DIAGNOSTIC_ONLY',
    note:'Historical provisional receipts and source-blob equality are not registration or independent quality evidence.',
    summary:{
      historicalRequests:rows.length,
      distinctExactSources:new Set(rows.map(r=>r.sourceArchiveFile)).size,
      currentGlobalAutoPendingQids:pending.length,
      currentPendingQidsForListedSources:[...new Set(rows.map(r=>r.sourceArchiveFile))].reduce((n,p)=>n+(pendingBySource.get(p)?.length||0),0),
      oldProvisionalNotVerified:rows.filter(r=>r.oldVerifiedStatus==='NOT_VERIFIED').length,
      byNextAction:countBy(rows,r=>r.nextAction),
      globalPendingReasonOccurrences:countBy(allReasons,x=>x),
      registrationEvidenceStatus:'NOT_EVALUATED',
    },
    requests:rows,
  };
}
export function readArchiveMetaBacklog(root=DEFAULT_ROOT) {
  root=path.resolve(root);
  const dir=path.join(root,DIR);
  const names=sorted(fs.readdirSync(dir).filter(n=>n.endsWith('.json')&&!n.endsWith('.receipt.json')));
  const requests=names.map(n=>{
    const value=read(root,DIR+'/'+n);
    if(value.requestId!==n.slice(0,-5))throw Error('REQUEST_FILENAME_ID_MISMATCH:'+n);
    return value;
  });
  const provisionalReceipts={};
  const sources={};
  for(const r of requests){
    const receiptName=DIR+'/'+r.requestId+'.receipt.json';
    if(fs.existsSync(path.join(root,receiptName)))provisionalReceipts[r.requestId]=read(root,receiptName);
    if(!Object.hasOwn(sources,r.sourceArchiveFile))sources[r.sourceArchiveFile]=sourceInfo(root,r.sourceArchiveFile);
  }
  return summarizeArchiveMetaBacklog({requests,provisionalReceipts,autoState:read(root,STATE),sources});
}
const isCli=process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(isCli){
  const i=process.argv.indexOf('--root');
  const root=i<0?DEFAULT_ROOT:process.argv[i+1];
  if(!root||process.argv.some((x,j)=>(x==='--root'&&j===process.argv.length-1)))throw Error('ROOT_ARGUMENT_MISSING');
  const report=readArchiveMetaBacklog(root);
  if(process.argv.includes('--summary')){
    console.log(JSON.stringify({schemaVersion:report.schemaVersion,mode:report.mode,summary:report.summary},null,2));
  } else console.log(JSON.stringify(report,null,2));
}
