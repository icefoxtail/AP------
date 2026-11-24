'use strict';
// A named negative authority for one question (M2S1 E034 Q18). It only marks/excludes that single question
// (catalog sourceIssueHold projection, registrar and 4slot-vector refusal). It never pins any file bytes:
// the 2026-11-24 owner decision removed the byte pinning, so changing the exam JS, its figure, the compact/index
// files or the metadata/identity files never fails because of this hold. Existing ledger data is kept as history.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const UID='qid_v1_19094807547ac6f15acca37931be797fce40c7b0e4344e1c5a6e2223ca2bbc54';
const SOURCE='original/middle/m2/1final/22_매산중_1학기_기말_중2_수학.js';
const ORDINAL=18;
const LEDGER='archive/data/meta-foundation/m2s1-e034-original-source-hold-v1.json';
const MODULE='tools/4slot/original-source-error-hold.cjs';
const SCHEMA='archive-original-registered-vector-source-hold-v1';
const SCOPE='EXACT_M2S1_E034_Q18_ORIGINAL_CONTRADICTION_REJECT_PRIOR_VECTOR_REUSE';
const REASON='ORIGINAL_SOURCE_CONTRADICTION_UNRESOLVED';
const RELEASE='EXPLICIT_VERIFIED_SOURCE_CORRECTION_REQUIRED';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const fail=code=>{throw Error('ORIGINAL_SOURCE_ERROR_HOLD:'+code);};
function isSubject({questionUid,source,sourceArchiveFile,ordinal,sourceOrdinal}={}){return questionUid===UID||(source??sourceArchiveFile)===SOURCE&&Number(ordinal??sourceOrdinal)===ORDINAL;}
function assertNotSubject(context){if(isSubject(context))fail('EXPLICIT_SOURCE_RESOLUTION_REQUIRED');}
// The hold exists only while its ledger file exists. Deleting the ledger lifts it; nothing else is consulted.
function relevant(root){return fs.existsSync(path.join(root,LEDGER));}
// Reads the ledger only to build the projection. No source, figure, receipt, git blob or metadata bytes are checked.
function verify(root){
  const file=path.join(root,LEDGER);if(!fs.existsSync(file))fail('LEDGER_MISSING');
  const raw=fs.readFileSync(file);let d;try{d=JSON.parse(raw);}catch{fail('LEDGER_JSON');}
  return {questionUid:UID,sourceArchiveFile:SOURCE,sourceOrdinal:ORDINAL,reason:REASON,negativeOnly:true,observed:[[LEDGER,sha(raw)]],
    projection:{schemaVersion:SCHEMA,scope:SCOPE,status:'HOLD',reasonCode:REASON,ledgerPath:LEDGER,ledgerSha256:sha(raw),reviewRef:d?.reviewRef,sourceBlobSha1:d?.currentSourceRef?.gitBlobSha1,releasePolicy:RELEASE,newMathQa:0,newSemanticApproval:0,newFourSlotVector:0}};
}
function dependencyPaths(root){return relevant(root)?[MODULE,LEDGER]:[MODULE];}
module.exports={UID,SOURCE,ORDINAL,LEDGER,MODULE,SCHEMA,SCOPE,REASON,RELEASE,isSubject,assertNotSubject,relevant,verify,dependencyPaths};
