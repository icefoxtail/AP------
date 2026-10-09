import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {physical,inside,writeFresh} from '../../tools/archive-codex-artifact-io.mjs';
import {verifyCompletion} from '../../tools/archive-codex-stage-kit.mjs';
import {transitionFile} from '../../tools/archive-codex-dispatcher.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim(),run='archive-2026-1mid-nine-20261008',base=path.join(root,'archive/analysis',run);
const row=JSON.parse(fs.readFileSync(path.join(base,'roster.json')))[Number(process.argv[2])-1],eventPath=inside(root,process.argv[3]);
verifyCompletion({root,eventFile:eventPath,expectedEventSha256:process.argv[4]});
const event=JSON.parse(fs.readFileSync(eventPath)),report=JSON.parse(fs.readFileSync(event.rawReport.path));
if(event.stage!=='CREATE'||event.examUid!==row.examUid||report.disposition!=='PASS'||report.denominator!==report.rowCount||report.issues.length)throw Error('CURRENT_TECHNICAL_CREATE_PASS_REQUIRED');
const source=physical(row.workingJsAbsolute);if(source.sha256!==event.physicalSnapshot.source.sha256)throw Error('CURRENT_SOURCE_REQUIRED');
const proof=inside(root,process.argv[5]);if(physical(proof).sha256!==process.argv[6])throw Error('APPROVED_ENCODING_PROOF_REQUIRED');
const stateFile=path.join(base,'dispatcher.json'),initialState=JSON.parse(fs.readFileSync(stateFile)),originalCreateSlot=initialState.slots.CREATE;
const result=transitionFile({stateFile,expectedStateSha256:physical(stateFile).sha256,mutate:s=>{const n=structuredClone(s),job=n.jobs[row.examUid];
 if(!job.history.some(h=>h.stage==='CREATE')||n.events.some(e=>e.technicalEventSha256===process.argv[4]))throw Error('PRIOR_CREATE_OR_UNIQUE_TECHNICAL_REBIND_REQUIRED');
 if(n.slots.CREATE?.examUid===row.examUid)throw Error('THIS_IS_NOT_A_NORMAL_SLOT_HANDOFF');
 job.currentTechnicalStageBindings={...job.currentTechnicalStageBindings,CREATE:{event:physical(eventPath),evidence:event.physicalSnapshot.evidence,report:event.rawReport,source}};
 if(job.rootRecovery)job.rootRecovery.currentSourceRawSha256=source.sha256;
 n.events.push({type:'ROOT_UNCHANGED_CREATE_QUALITY_TECHNICAL_REBIND_ACCEPTED',examUid:row.examUid,technicalEventSha256:process.argv[4],approvedEncodingProof:physical(proof),freedSlot:null,source,semanticVerdictCreated:false,at:new Date().toISOString()});n.revision++;return n;}});
const finalState=JSON.parse(fs.readFileSync(stateFile));if(JSON.stringify(finalState.slots.CREATE)!==JSON.stringify(originalCreateSlot))throw Error('OTHER_EXAM_CREATE_SLOT_MUTATED');
console.log(JSON.stringify(writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.CREATE.technical-rebind.intake.json'),{
 schemaVersion:'ROOT_CURRENT_CREATE_TECHNICAL_REBIND_INTAKE_V1',examUid:row.examUid,decisionAuthority:'ROOT_DELEGATED',event:physical(eventPath),approvedEncodingProof:physical(proof),source,
 originalQualityReviewer:event.reviewerIdentity,technicalActor:'archive_master',semanticVerdictCreated:false,freedSlot:null,otherExamCreateSlotPreserved:true,stateRef:result.stateRef
})));
