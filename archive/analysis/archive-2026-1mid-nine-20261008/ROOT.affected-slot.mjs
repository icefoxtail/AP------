import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {physical,writeFresh,inside} from '../../tools/archive-codex-artifact-io.mjs';
import {transitionFile} from '../../tools/archive-codex-dispatcher.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',base=path.join(root,'archive/analysis',run),file=path.join(base,'dispatcher.json');
const [command,index,stage,session,qidOrProof,proofSha]=process.argv.slice(2);
const row=JSON.parse(fs.readFileSync(path.join(base,'roster.json')))[Number(index)-1];
if(!row||!['R1','R2'].includes(stage))throw Error('AFFECTED_SLOT_ASSIGNMENT_REQUIRED');
let receipt;
const result=transitionFile({stateFile:file,expectedStateSha256:physical(file).sha256,mutate:s=>{
 const n=structuredClone(s),at=new Date().toISOString();
 if(command==='claim'){
  const qids=qidOrProof.split(',').map(Number);
  if(n.slots[stage]||n.usedSessionIds.includes(session)||!n.jobs[row.examUid].rootRecovery||!qids.every(q=>n.jobs[row.examUid].rootRecovery.heldQids.includes(q)))throw Error('AFFECTED_SLOT_NOT_AVAILABLE');
  n.slots[stage]={examUid:row.examUid,sessionId:session,startedAt:at,substage:'FRESH_AFFECTED_REVIEW',affectedQids:qids,repairReturnStage:n.jobs[row.examUid].nextStage};
  n.usedSessionIds.push(session);n.events.push({type:'FRESH_AFFECTED_REVIEW_DISPATCH',examUid:row.examUid,stage,sessionId:session,qids,qualityPassAsserted:false,at});
 }else if(command==='release'){
  const proof=inside(root,qidOrProof);
  if(physical(proof).sha256!==proofSha||n.slots[stage]?.examUid!==row.examUid||n.slots[stage]?.sessionId!==session||n.slots[stage]?.substage!=='FRESH_AFFECTED_REVIEW')throw Error('AFFECTED_REVIEW_PROOF_OR_OWNER_MISMATCH');
  const held=n.slots[stage].affectedQids;n.slots[stage]=null;
  n.events.push({type:'FRESH_AFFECTED_REVIEW_RETURNED',examUid:row.examUid,stage,sessionId:session,qids:held,proof:{path:proof,sha256:proofSha},fullBankClosureStillRequired:true,at});
  receipt={schemaVersion:'ROOT_FRESH_AFFECTED_REVIEW_SLOT_RELEASE_V1',examUid:row.examUid,stage,sessionId:session,qids:held,proof:{path:proof,sha256:proofSha},fullBankClosureStillRequired:true};
 }else throw Error('CLAIM_OR_RELEASE_REQUIRED');
 n.revision++;return{state:n};}});
if(receipt)writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.'+stage+'.'+session+'.slot-release.json'),{...receipt,stateRef:result.stateRef});
console.log(JSON.stringify(result));
