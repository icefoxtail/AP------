// Actual Node HTTP send-buffer observations, explicit published-problem opt-in only.
// A server transfer digest never impersonates a missing Chromium body digest.
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {bytesSha,fileRef,readBoundFile} from '../../pipeline-core/canonical.mjs';
export const PUBLISHED_RESPONSE_HEADER='x-geometry-published-response-id';
export const CDP_EVICTED_BODY_ERROR='Error: response.body: Protocol error (Network.getResponseBody): Request content was evicted from inspector cache';
const ID=/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
const HASH=/^sha256:[a-f0-9]{64}$/;
const fail=code=>{throw Error(code);};
const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
const validRun=r=>typeof r==='string'&&/^\.tmp\/archive\/[A-Za-z0-9_-]{1,80}\/[\p{L}\p{N}_.-]{1,180}\/published-capture$/u.test(r);
function safe(root,relative){
 if(typeof relative!=='string'||relative.includes('\\')||relative.includes('\0')||relative.split('/').some(x=>!x||x==='.'||x==='..'))fail('PUBLISHED_RESPONSE_PATH');
 const absolute=path.resolve(root,relative);if(!absolute.startsWith(fs.realpathSync(root)+path.sep))fail('PUBLISHED_RESPONSE_PATH');
 let cursor=absolute;while(!fs.existsSync(cursor))cursor=path.dirname(cursor);if(fs.realpathSync(cursor)!==cursor)fail('PUBLISHED_RESPONSE_REDIRECT');return absolute;
}
function read(root,ref){if(!exact(ref,['path','bytes','sha256'])||!HASH.test(ref.sha256)||!Number.isSafeInteger(ref.bytes)||ref.bytes<0)fail('PUBLISHED_RESPONSE_REF');const file=safe(root,ref.path);if(!fs.lstatSync(file).isFile()||fs.realpathSync(file)!==file)fail('PUBLISHED_RESPONSE_REDIRECT');return readBoundFile(root,ref);}
export function assertPublishedResponseOptIn(matrix,blockExternalRequests){
 if(matrix?.schemaVersion!=='READ_ONLY_PUBLISHED_PROBLEM_MATRIX_v1'||matrix.synthetic!==false||blockExternalRequests!==true||matrix.sources?.length!==1||matrix.rows?.length!==3||matrix.rows.some(r=>r.mode!=='exam'||r.problemEnvelope!==true||!r.assets?.length||r.assets.some(a=>a.surface!=='PROBLEM_VISUAL')))fail('PUBLISHED_RESPONSE_OPT_IN_SCOPE');
}
export function createPublishedResponseRecorder({root,runRelative}){
 if(!validRun(runRelative))fail('PUBLISHED_RESPONSE_RUN_SCOPE');const rows=new Map();let active=null;
 const save=(relative,bytes)=>{const file=safe(root,relative);fs.mkdirSync(path.dirname(file),{recursive:true});if(fs.existsSync(file)){if(!fs.readFileSync(safe(root,relative)).equals(bytes))fail('PUBLISHED_RESPONSE_SNAPSHOT_CONFLICT');}else fs.writeFileSync(file,bytes,{flag:'wx'});return fileRef(root,relative);};
 return {
  beginRow(rowId){if(active!==null||!/^[-A-Za-z0-9_]+$/.test(rowId)||rows.has(rowId))fail('PUBLISHED_RESPONSE_ROW');active=rowId;rows.set(rowId,[]);},
  send(req,res,status,headers,buffer){
   if(active===null||!Buffer.isBuffer(buffer))fail('PUBLISHED_RESPONSE_SEND_BUFFER_REQUIRED');
   const id=randomUUID(),sha=bytesSha(buffer),bodyRef=save(runRelative+'/runtime-response-bodies/'+sha.slice(7)+'.bin',buffer);
   const entry={id,rowId:active,urlPath:req.url,method:req.method,status,bodyRef,bodySha256:sha,bodyBytes:buffer.length,completion:'PENDING',finishObserved:false,closeObserved:false};rows.get(active).push(entry);
   res.once('finish',()=>{entry.finishObserved=true;if(entry.completion==='PENDING')entry.completion='COMPLETE';});
   res.once('close',()=>{entry.closeObserved=true;if(!entry.finishObserved)entry.completion='ABORTED';});
   res.once('error',()=>{entry.completion='ABORTED';});req.once('aborted',()=>{entry.completion='ABORTED';});
   res.writeHead(status,{...headers,'Content-Length':buffer.length,[PUBLISHED_RESPONSE_HEADER]:id});res.end(buffer);return id;
  },
  persistAbortedRow(){if(active!==null)return this.finalizeRow(active);return null;},
  finalizeRow(rowId){
   if(active!==rowId)fail('PUBLISHED_RESPONSE_ROW');active=null;
   const value={schemaVersion:'PUBLISHED_HTTP_SEND_BUFFER_EVIDENCE_v1',observationKind:'ACTUAL_NODE_HTTP_SEND_BUFFER',rowId,headerName:PUBLISHED_RESPONSE_HEADER,entries:rows.get(rowId)};
   const relative=runRelative+'/runtime-response-evidence/'+rowId+'.json',file=safe(root,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return fileRef(root,relative);
  }
 };
}
export async function observePublishedBrowserResponse(response){
 const base={url:response.url(),status:response.status(),serverResponseId:response.headers()[PUBLISHED_RESPONSE_HEADER]??null};
 try{const body=await response.body();return {...base,sha256:bytesSha(body).slice(7),bytes:body.length,browserBodyObservation:'CDP_RESPONSE_BODY_SHA256'};}
 catch(error){return {...base,error:String(error),browserBodyObservation:'CDP_RESPONSE_BODY_UNAVAILABLE'};}
}
/** Historical readback of two separate actual observations. Never fills absent browser SHA fields. */
export function verifyPublishedResponseEvidence(row,{root,runRelative}){
 if(!validRun(runRelative)||!row?.id||row.runtimeResponseEvidenceRef?.path!==runRelative+'/runtime-response-evidence/'+row.id+'.json')fail('PUBLISHED_RESPONSE_EVIDENCE_REQUIRED');
 const proof=JSON.parse(read(root,row.runtimeResponseEvidenceRef));
 if(!exact(proof,['schemaVersion','observationKind','rowId','headerName','entries'])||proof.schemaVersion!=='PUBLISHED_HTTP_SEND_BUFFER_EVIDENCE_v1'||proof.observationKind!=='ACTUAL_NODE_HTTP_SEND_BUFFER'||proof.rowId!==row.id||proof.headerName!==PUBLISHED_RESPONSE_HEADER||!Array.isArray(proof.entries)||!proof.entries.length||!Array.isArray(row.responses)||!row.responses.length)fail('PUBLISHED_RESPONSE_SCHEMA');
 const ids=new Set(),byId=new Map();
 for(const e of proof.entries){
  if(!exact(e,['id','rowId','urlPath','method','status','bodyRef','bodySha256','bodyBytes','completion','finishObserved','closeObserved'])||!ID.test(e.id)||ids.has(e.id)||e.rowId!==row.id||e.method!=='GET'||!Number.isInteger(e.status)||e.status<200||e.status>599||e.completion!=='COMPLETE'||e.finishObserved!==true||e.closeObserved!==true)fail('PUBLISHED_RESPONSE_TRANSFER_INCOMPLETE');
  ids.add(e.id);byId.set(e.id,e);if(typeof e.urlPath!=='string'||!e.urlPath.startsWith('/')||e.urlPath.startsWith('//')||e.urlPath.includes('\\')||e.urlPath.includes('\0'))fail('PUBLISHED_RESPONSE_URL');
  if(e.bodyRef?.path!==runRelative+'/runtime-response-bodies/'+e.bodySha256?.slice(7)+'.bin'||e.bodyRef?.sha256!==e.bodySha256||e.bodyRef?.bytes!==e.bodyBytes)fail('PUBLISHED_RESPONSE_BODY_BINDING');read(root,e.bodyRef);
 }
 const observed=new Set(),bindings=[];
 for(const r of row.responses){
  if(!ID.test(r.serverResponseId??'')||observed.has(r.serverResponseId)||!byId.has(r.serverResponseId))fail('PUBLISHED_RESPONSE_BROWSER_CORRELATION');observed.add(r.serverResponseId);
  const e=byId.get(r.serverResponseId);let url;try{url=new URL(r.url);}catch{fail('PUBLISHED_RESPONSE_URL');}
  if(url.origin!==row.network?.localOrigin||url.pathname+url.search!==e.urlPath||r.status!==e.status)fail('PUBLISHED_RESPONSE_BROWSER_CORRELATION');
  let kind;
  if(r.browserBodyObservation==='CDP_RESPONSE_BODY_SHA256'&&typeof r.sha256==='string'&&r.error===undefined&&r.sha256===e.bodySha256.slice(7)&&r.bytes===e.bodyBytes)kind='BROWSER_BODY_AND_FINISHED_SERVER_SEND_MATCH';
  else if(r.browserBodyObservation==='CDP_RESPONSE_BODY_UNAVAILABLE'&&r.sha256===undefined&&r.bytes===undefined&&r.status===200&&url.pathname==='/archive/data/question_metadata.json'&&r.error===CDP_EVICTED_BODY_ERROR)kind='BROWSER_HEADER_CORRELATED_FINISHED_SERVER_SEND_CDP_BODY_EVICTED';
  else fail('PUBLISHED_RESPONSE_BODY_OBSERVATION_MISMATCH');
  bindings.push({id:e.id,url:r.url,status:e.status,path:decodeURIComponent(url.pathname).replace(/^\//,''),observationKind:kind,bodyRef:e.bodyRef});
 }
 if(observed.size!==proof.entries.length)fail('PUBLISHED_RESPONSE_BROWSER_INVENTORY_MISMATCH');
 return {schemaVersion:'PUBLISHED_RUNTIME_RESPONSE_BINDING_v1',evidenceRef:row.runtimeResponseEvidenceRef,observationKind:'CORRELATED_BROWSER_AND_ACTUAL_SERVER_SEND',bindings};
}
