import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {physical,sha256,writeFresh,gitBlobReader} from '../../tools/archive-codex-artifact-io.mjs';
import {buildStageState,consumeCodexMainDone} from '../../tools/archive-stage-runtime-v2.mjs';
import {transitionFile} from '../../tools/archive-codex-dispatcher.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',runBase=path.join(root,'archive/analysis',run);
const roster=JSON.parse(fs.readFileSync(path.join(runBase,'roster.json')));
const row=roster.find(r=>r.examUid===process.argv[2]||String(r.rosterIndex+1)===process.argv[2]);
if(!row)throw Error('ROSTER_TARGET_REQUIRED');
const uid=row.examUid,base=row.evidenceRootAbsolute,prod=row.productionRelativePath;
const remote=execFileSync('git',['rev-parse','origin/main'],{encoding:'utf8'}).trim();
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!==remote)throw Error('HEAD_REMOTE_PARITY_REQUIRED');
const relative=p=>path.relative(root,p).replaceAll('\\','/');
const renderPath=path.join(base,'ROOT.production.render.receipt.json');
const render=JSON.parse(fs.readFileSync(renderPath));
const promotion=JSON.parse(fs.readFileSync(path.join(base,'ROOT.promotion.receipt.json')));
const assets=promotion.assets,qids=promotion.qids;
const impactPath=process.argv[3]?path.resolve(root,process.argv[3]):null;
const impact=impactPath?{path:relative(impactPath),sha256:physical(impactPath).sha256}:null;
if(impact&&impact.sha256!==process.argv[4])throw Error('RENDER_IMPACT_PROOF_HASH_REQUIRED');
const paths=[...new Set([prod,...assets.map(a=>'archive/'+a.ref),'archive/db.js',
 'archive/data/question_identity_map.json','archive/data/question_metadata.json',
 'archive/question-identity.js','archive/question-index.js','archive/data/archive2-catalog.json',
 'archive/data/archive2-canonical-input-manifest.json',relative(renderPath),render.r3Validation.path,
 ...render.cases.flatMap(c=>c.captures.map(x=>x.image.path)),
 ...(impact?[impact.path,'archive/engine.html','archive/archive2-preview-mobile.css','archive/vendor/qrious/qrious.min.js']:[])])];
const read=gitBlobReader(root,remote,paths);
const rows=paths.map(p=>{const b=read(p),local=fs.readFileSync(path.join(root,p));
 if(sha256(b)!==sha256(local))throw Error('REMOTE_BYTES_MISMATCH:'+p);
 return {path:p,sha256:sha256(b),bytes:b.length};});
const readback=writeFresh(path.join(base,'ROOT.remote-readback.json'),{
 schemaVersion:'ROOT_EXAM_REMOTE_READBACK_V1',examUid:uid,remoteMainSha:remote,head,allBytesMatch:true,rows});
const receipt={schemaVersion:'JS_ARCHIVE_CODEX_MAIN_DONE_RECEIPT_V1',executionLine:'CODEX',
 qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',status:'MAIN_DONE',runId:run,
 examUid:uid,artifactSha:render.artifactSha,productionPath:prod,remoteMainSha:remote,
 renderReceipt:{path:relative(renderPath),sha256:physical(renderPath).sha256},remoteReadback:readback,
 completionBasis:'ACTUAL_RENDER_AND_TARGET_ONLY_REGISTRATION',...(impact?{renderEnvironmentUnchangedScopeReuse:impact}: {})};
const consumed=consumeCodexMainDone({state:buildStageState({stage:'PUBLICATION',
 qualityContractVersion:receipt.qualityContractVersion,executionLine:'CODEX'}),receipt,root,renderReceipt:render,assets,qids});
const receiptRef=writeFresh(path.join(base,'ROOT.MAIN_DONE.receipt.json'),receipt);
writeFresh(path.join(base,'ROOT.MAIN_DONE.intake.json'),{status:'PASS',state:consumed.state,receipt:receiptRef});
const stateFile=path.join(runBase,'dispatcher.json');
transitionFile({stateFile,expectedStateSha256:physical(stateFile).sha256,mutate:s=>{
 const n=structuredClone(s);if(n.jobs[uid].nextStage!=='ROOT_PUBLICATION')throw Error('PUBLICATION_JOB_STAGE_REQUIRED');
 n.jobs[uid].nextStage='MAIN_DONE';n.jobs[uid].mainDone={remoteMainSha:remote,receipt:receiptRef};
 n.events.push({type:'MAIN_DONE',examUid:uid,remoteMainSha:remote,receipt:receiptRef,at:new Date().toISOString()});
 n.revision++;return {state:n};}});
console.log(JSON.stringify({examUid:uid,status:'MAIN_DONE',remoteMainSha:remote,receipt:receiptRef,readback,files:rows.length}));
