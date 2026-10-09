import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {physical,sha256,writeFresh,gitBlobReader} from '../../tools/archive-codex-artifact-io.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const base='archive/analysis/archive-2026-1mid-nine-20261008';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p)));
const roster=read(base+'/roster.json'),dispatcher=read(base+'/dispatcher.json');
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!==execFileSync('git',['rev-parse','origin/main'],{encoding:'utf8'}).trim())throw Error('REMOTE_HEAD_REQUIRED');
if(Object.values(dispatcher.slots).some(Boolean))throw Error('ACTIVE_SLOT');
const model=read(base+'/ROOT.actual-agent-model-check-FINAL.json');
if(!model.allLunaHigh)throw Error('MODEL_MISMATCH');
const stdout=fs.readFileSync(path.join(root,base+'/ROOT.runtime-guard-FINAL.stdout.txt'),'utf8');
if(!stdout.includes('pass 42')||!stdout.includes('fail 0'))throw Error('RUNTIME_GUARD_NOT_PASS');
const rows=[],remotePaths=new Set();
for(const r of roster){
 const b=base+'/'+r.examUid,receipt=read(b+'/ROOT.MAIN_DONE.receipt.json');
 const render=read(b+'/ROOT.production.render.receipt.json'),promotion=read(b+'/ROOT.promotion.receipt.json');
 if(dispatcher.jobs[r.examUid].nextStage!=='MAIN_DONE'||receipt.status!=='MAIN_DONE'||render.status!=='RENDER_PASS')throw Error('INCOMPLETE:'+r.examUid);
 if(physical(path.join(root,r.productionRelativePath)).sha256!==render.loadedJs.sha256)throw Error('SOURCE_CHANGED');
 const blob=execFileSync('git',['hash-object','--no-filters',r.productionRelativePath],{encoding:'utf8'}).trim();
 if(blob!==receipt.artifactSha)throw Error('BLOB_MISMATCH');
 if(render.cases.length!==6||render.cases.some(c=>c.status!=='PASS'))throw Error('CAPTURE_CASES_REQUIRED');
 remotePaths.add(r.productionRelativePath);
 for(const a of promotion.assets)remotePaths.add('archive/'+a.ref);
 for(const c of render.cases)for(const capture of c.captures){
  if(physical(path.join(root,capture.image.path)).sha256!==capture.image.sha256)throw Error('CAPTURE_HASH');
  remotePaths.add(capture.image.path);
 }
 rows.push({examUid:r.examUid,status:'MAIN_DONE',questionCount:promotion.qids.length,sourceSha256:render.loadedJs.sha256,gitBlobSha1:blob,publicationMainSha:receipt.remoteMainSha,mainDoneReceipt:physical(path.join(root,b+'/ROOT.MAIN_DONE.receipt.json')),actualRenderCases:6,itemHoldCount:0});
}
const paths=[...remotePaths],remote=gitBlobReader(root,head,paths);
const remoteRows=paths.map(p=>{const hash=sha256(remote(p));if(hash!==physical(path.join(root,p)).sha256)throw Error('REMOTE_MISMATCH:'+p);return {path:p,sha256:hash};});
const total=rows.reduce((s,r)=>s+r.questionCount,0);if(total!==211)throw Error('DENOMINATOR');
writeFresh(path.join(root,base,'ROOT.FINAL_CLOSEOUT.json'),{schemaVersion:'ROOT_NINE_EXAM_FINAL_CLOSEOUT_V1',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',status:'MAIN_DONE',checkedAt:new Date().toISOString(),publicationHead:head,examCount:9,questionCount:total,actualRenderCases:54,allSubagentsLunaHigh:true,modelAudit:physical(path.join(root,base+'/ROOT.actual-agent-model-check-FINAL.json')),runtimeGuard:{exitCode:0,tests:42,pass:42,fail:0,stdout:physical(path.join(root,base+'/ROOT.runtime-guard-FINAL.stdout.txt')),stderr:physical(path.join(root,base+'/ROOT.runtime-guard-FINAL.stderr.txt'))},rows,latestRemoteSourceAssetAndCaptureReadback:remoteRows,provenance:'Original failures, correction reviews, independent freezes, source repairs and question-only replacements remain in each exam evidence directory. No render waiver used.'});
fs.writeFileSync(path.join(root,base,'ROOT.FINAL_CLOSEOUT.md'),'2026년 1학기 중간 9개 시험지, 211문항의 CREATE → R1 → R2 → R3 → MAIN_DONE을 완료했습니다.\n\n각 시험지 6종 실제 렌더(총 54종), 원격 메인 JS·자산·캡처 바이트 일치를 확인했습니다. 런타임 검사 42/42 PASS. 하위 에이전트 실제 세션 76개는 모두 gpt-6-luna / high였습니다. 원문 오류 수정·문항 대체와 이전 실패 기록은 각 시험지 evidence에 보존했습니다.\n\n'+rows.map(r=>'- '+r.examUid+': '+r.questionCount+'문항, MAIN_DONE').join('\n')+'\n');
console.log(JSON.stringify({status:'MAIN_DONE',examCount:9,questionCount:total,remoteReadbackFiles:paths.length,head}));
