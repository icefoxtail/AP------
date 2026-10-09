import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {physical,writeFresh} from '../../tools/archive-codex-artifact-io.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',base=path.join(root,'archive/analysis',run);
const row=JSON.parse(fs.readFileSync(path.join(base,'roster.json')))[Number(process.argv[2])-1];
if(!row)throw Error('EXACT_ROSTER_REQUIRED');
const dir=row.evidenceRootAbsolute,assignment=JSON.parse(fs.readFileSync(path.join(dir,'R3.assignment.json')));
const eventPath=path.resolve(root,process.argv[3]),event=JSON.parse(fs.readFileSync(eventPath));
if(physical(eventPath).sha256!==process.argv[4]||event.examUid!==row.examUid||event.stage!=='R3')throw Error('EVENT_BINDING_REQUIRED');
const source=physical(row.workingJsAbsolute),productionAbsolute=path.join(root,row.productionRelativePath);
if(source.sha256!==event.physicalSnapshot.source.sha256||physical(productionAbsolute).sha256!==source.sha256)throw Error('PROMOTED_CURRENT_SOURCE_REQUIRED');
const currentUpstreamEvents=new Map();
for(const ref of event.extraProofs||[]){if(!ref.path?.endsWith('.json'))continue;const value=JSON.parse(fs.readFileSync(ref.path));
 if(value.schemaVersion==='JS_ARCHIVE_CODEX_STABLE_STAGE_COMPLETE_V1'&&['CREATE','R1','R2'].includes(value.stage)&&value.examUid===row.examUid&&value.physicalSnapshot?.source?.sha256===source.sha256)currentUpstreamEvents.set(value.stage,{ref,value});}
const upstreamPaths=currentUpstreamEvents.size===3?[...currentUpstreamEvents.values()].flatMap(({ref,value})=>[ref.path,value.physicalSnapshot.evidence.path,value.rawReport.path]):assignment.proofs?assignment.proofs.map(p=>p.path):(assignment.currentEvidenceAndReports||[]).flatMap(p=>[p.event.path,p.evidence.path,p.report.path]);
const paths=[...upstreamPaths,eventPath,event.physicalSnapshot.evidence.path,event.rawReport.path,
 path.join(dir,'ROOT.production.render.receipt.json'),path.join(dir,'ROOT.promotion.receipt.json')];
const proofs=[...new Set(paths)].map(p=>({name:path.relative(dir,p).replaceAll('\\','/'),...physical(p)}));
const packet={schemaVersion:'ROOT_EXACT_TECHNICAL_REGISTRATION_CONTINUATION_V1',runId:run,examUid:row.examUid,
 stage:'MASTER_TECHNICAL_REGISTRATION',worktreeRootAbsolute:root,expectedHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
 workingJsAbsolute:row.workingJsAbsolute,productionRelativePath:row.productionRelativePath,productionAbsolute,assetRootAbsolute:row.assetRootAbsolute,
 evidenceRootAbsolute:dir,artifactRawSha256:source.sha256,rawBufferBlobSha1:event.artifactSha,questionCount:(assignment.qids||assignment.allowedQids).length,proofs,
 firstMissingClosureStep:'Strict target-only registration package over current baseline',sourceAssetsStageEvidenceReadOnly:true,
 rootOwnsApplyStageCommitPushReadback:true,boundedKnownProducerGapAdapterAllowed:true,nonTargetInvarianceRequired:true,qualityJudgmentForbidden:true};
console.log(JSON.stringify(writeFresh(path.join(dir,'MASTER.registration.assignment.json'),packet)));
