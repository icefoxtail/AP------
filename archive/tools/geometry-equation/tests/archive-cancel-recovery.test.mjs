import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileRef,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {repoRoot} from '../visual-browser-runtime.mjs';
import {sha256} from '../verify-visual-engine-static.mjs';
import {recordArchiveEvidence} from '../record-visual-browser-evidence.mjs';
import {runPhase2} from '../production/phase2.mjs';

test('Archive readiness cancellation closes Chromium and server without publishing CAPTURE',async()=>{
  const packageRoot='docs/evidence/apmath-vprod/p3e/measured-panel-repair-v3';
  const p3e=JSON.parse(fs.readFileSync(path.join(repoRoot,packageRoot,'measured-panel-repair-ledger.json'),'utf8'));
  const q10=p3e.candidates.find(row=>row.candidate==='q10-graph');
  assert.ok(q10?.currentResultPackagePath);
  const priorPath=packageRoot+'/'+q10.currentResultPackagePath;
  const prior=JSON.parse(fs.readFileSync(path.join(repoRoot,priorPath),'utf8'));
  const questionUid=prior.identity.questionUid,ordinal=Number(questionUid.split('|').at(-1));
  const runId='archive-cancel-'+crypto.randomUUID();
  assert.notEqual(runId,prior.runId);
  const controller=new AbortController(),progress=[];
  const result=await runPhase2({questionUid,sourcePath:prior.sourceRef.path,ordinal,replayResultRef:fileRef(repoRoot,priorPath),experimentalLocator:true,runId,signal:controller.signal,onArchiveProgress:event=>{
    progress.push(event);
    if(event.event==='PAGE_READINESS_WAIT'&&event.attempt==='envelope-preflight')controller.abort();
  }});
  assert.equal(result.result.status,'UNRESOLVED');
  assert.equal(result.result.errorCode,'ARCHIVE_CAPTURE_CANCELLED');
  assert.equal(result.result.productionAuthorized,false);
  assert.equal(result.result.workRoot,'.tmp/archive/'+runId+'/'+prior.examUid+'/visual-engine/production');
  assert.deepEqual(progress.map(event=>event.event),['SERVER_LISTENING','BROWSER_LAUNCHED','PAGE_READINESS_WAIT']);
  assert.ok(result.result.archiveAbortEvidenceRef);
  const abortPath=path.join(repoRoot,result.result.archiveAbortEvidenceRef);
  const aborted=JSON.parse(fs.readFileSync(abortPath,'utf8'));
  assert.equal(aborted.status,'ABORTED');
  assert.deepEqual(aborted.cleanup,{serverWasListening:true,browserWasLaunched:true,browserClosed:true,serverClosed:true,browserCloseError:null,serverCloseError:null});
  const attemptFolder=path.dirname(abortPath);
  assert.deepEqual(fs.readdirSync(attemptFolder),['ABORTED.json']);
  const stages=result.result.stages.map(ref=>JSON.parse(readBoundFile(repoRoot,ref).toString('utf8')).stage);
  assert.equal(stages.some(stage=>['DISPLAY_ENVELOPE_CAPTURE','ARCHIVE_CAPTURE','CAPTURE','ACTUAL_ARCHIVE_CAPTURE'].includes(stage)),false);
  const resultReceipt=JSON.parse(readBoundFile(repoRoot,result.receipt.outputs[0]).toString('utf8'));
  assert.equal(resultReceipt.status,'UNRESOLVED');
  assert.equal(resultReceipt.errorCode,'ARCHIVE_CAPTURE_CANCELLED');
  assert.equal(resultReceipt.archiveAbortEvidenceRef,result.result.archiveAbortEvidenceRef);
  const evidenceRoot=path.join(repoRoot,'.tmp/archive/phase3d-browser-cancel-test/browser-cancel-test/visual-engine/production');
  fs.mkdirSync(evidenceRoot,{recursive:true});
  fs.writeFileSync(path.join(evidenceRoot,'abort-result-'+process.pid+'.json'),JSON.stringify({schemaVersion:'ARCHIVE_CAPTURE_CANCEL_TEST_v1',questionUid,runId,workRoot:result.result.workRoot,progress,abortEvidenceRef:result.result.archiveAbortEvidenceRef,cleanup:aborted.cleanup,stageNames:stages,resultRef:result.receipt.outputs[0]},null,2)+'\n');
});

test('the real Chromium collector writes only ABORTED evidence, then succeeds in a fresh workspace',async()=>{
  const runId='archive-cancel-control-'+crypto.randomUUID(),retryId='archive-cancel-retry-'+crypto.randomUUID();
  const cancelRun=path.join(repoRoot,'.tmp/archive',runId,'controlled-capture/visual-engine/production');
  const retryRun=path.join(repoRoot,'.tmp/archive',retryId,'controlled-capture/visual-engine/production');
  const sourcePath='archive/engine.html',sourceSha256=sha256(fs.readFileSync(path.join(repoRoot,sourcePath)));
  const fixture='<!doctype html><html><head><style>html,body{margin:0}#print-area{margin:0;padding:0}.page{width:300px;height:100px}</style><script>window.MathJax={startup:{document:{},promise:Promise.resolve()}};if(location.search.includes("hold=1"))document.documentElement.dataset.apPrintReadiness=JSON.stringify({state:"RENDERING"})</script></head><body><div id="print-area"><div class="page"></div></div></body></html>';
  const makeMatrix=(run,query,questionCount)=>{
    fs.mkdirSync(run,{recursive:true});const candidatePath=path.join(run,'controlled-page.html'),bytes=Buffer.from(fixture,'utf8');
    fs.writeFileSync(candidatePath,bytes,{flag:'wx'});const relativeCandidate=path.relative(repoRoot,candidatePath).replaceAll('\\','/'),candidateSha256=sha256(bytes);
    const source={id:'archive-cancellation-control',sourcePath,sourceSha256,candidatePath:relativeCandidate,candidateSha256,questionCount,assets:[]};
    const row={...source,mode:'sol',viewport:'cancellation-control',width:800,height:600,urlPath:'/archive/engine.html?mode=sol&'+query};
    const matrix={schemaVersion:'ARCHIVE_CANCEL_CONTROL_MATRIX_v1',synthetic:false,engineSha256:sourceSha256,sources:[source],rows:[row]};
    fs.writeFileSync(path.join(run,'archive-render-matrix.json'),JSON.stringify(matrix,null,2)+'\n');
  };
  // The cancellation predicate stays false because the row expects one question
  // number while the fixture has none; the retry expects zero and can pass.
  makeMatrix(cancelRun,'hold=1',1);
  const controller=new AbortController(),events=[];let abortError=null;
  await assert.rejects(recordArchiveEvidence({run:cancelRun,signal:controller.signal,onProgress:event=>{
    events.push(event.event);
    if(event.event==='PAGE_READINESS_WAIT')controller.abort();
  }}),error=>{abortError=error;return error.code==='ARCHIVE_CAPTURE_CANCELLED';});
  assert.deepEqual(events,['SERVER_LISTENING','BROWSER_LAUNCHED','PAGE_READINESS_WAIT']);
  assert.deepEqual(abortError.cleanup,{serverWasListening:true,browserWasLaunched:true,browserClosed:true,serverClosed:true,browserCloseError:null,serverCloseError:null});
  const abortedFolder=path.dirname(path.join(repoRoot,abortError.abortEvidenceRef));
  assert.deepEqual(fs.readdirSync(abortedFolder),['ABORTED.json']);
  assert.equal(JSON.parse(fs.readFileSync(path.join(abortedFolder,'ABORTED.json'),'utf8')).status,'ABORTED');
  makeMatrix(retryRun,'retry=1',0);
  const retry=await recordArchiveEvidence({run:retryRun,attempt:'attempt-02'});
  assert.equal(retry.status,'PASS');assert.equal(retry.rows.length,1);assert.equal(retry.rows[0].status,'PASS');
  const retryFolder=path.join(retryRun,'archive-render','attempt-02');
  assert.ok(fs.existsSync(path.join(retryFolder,'summary.json')));
  const evidenceRoot=path.join(repoRoot,'.tmp/archive/phase3d-browser-cancel-test/browser-cancel-test/visual-engine/production');
  fs.mkdirSync(evidenceRoot,{recursive:true});
  fs.writeFileSync(path.join(evidenceRoot,'collector-abort-retry-'+process.pid+'.json'),JSON.stringify({schemaVersion:'ARCHIVE_COLLECTOR_CANCEL_RETRY_v1',cancelRun,retryRun,progressEvents:events,abortEvidenceRef:abortError.abortEvidenceRef,cleanup:abortError.cleanup,abortedAttemptFiles:fs.readdirSync(abortedFolder),retryStatus:retry.status,retryRowStatus:retry.rows[0].status,retrySummaryPath:path.relative(repoRoot,path.join(retryFolder,'summary.json')).replaceAll('\\','/')},null,2)+'\n');
});

test('an abort at the post-cleanup finalization boundary writes ABORTED and suppresses summary',async()=>{
  const runId='archive-cancel-finalize-'+crypto.randomUUID();
  const run=path.join(repoRoot,'.tmp/archive',runId,'controlled-finalization/visual-engine/production');
  const sourcePath='archive/engine.html',sourceSha256=sha256(fs.readFileSync(path.join(repoRoot,sourcePath)));
  const fixture='<!doctype html><html><head><style>html,body{margin:0}#print-area{margin:0;padding:0}.page{width:300px;height:100px}</style><script>window.MathJax={startup:{document:{},promise:Promise.resolve()}}</script></head><body><div id="print-area"><div class="page"></div></div></body></html>';
  fs.mkdirSync(run,{recursive:true});const candidatePath=path.join(run,'controlled-page.html'),bytes=Buffer.from(fixture,'utf8');
  fs.writeFileSync(candidatePath,bytes,{flag:'wx'});const relativeCandidate=path.relative(repoRoot,candidatePath).replaceAll('\\','/'),candidateSha256=sha256(bytes);
  const source={id:'archive-cancellation-finalization',sourcePath,sourceSha256,candidatePath:relativeCandidate,candidateSha256,questionCount:0,assets:[]};
  const row={...source,mode:'sol',viewport:'finalization-control',width:800,height:600,urlPath:'/archive/engine.html?mode=sol&finalize=1'};
  fs.writeFileSync(path.join(run,'archive-render-matrix.json'),JSON.stringify({schemaVersion:'ARCHIVE_CANCEL_FINALIZATION_MATRIX_v1',synthetic:false,engineSha256:sourceSha256,sources:[source],rows:[row]},null,2)+'\n');
  const controller=new AbortController(),events=[];let abortError=null;
  await assert.rejects(recordArchiveEvidence({run,signal:controller.signal,onProgress:event=>{
    events.push(event.event);
    if(event.event==='ARCHIVE_RESOURCES_CLEANED')controller.abort();
  }}),error=>{abortError=error;return error.code==='ARCHIVE_CAPTURE_CANCELLED';});
  assert.deepEqual(events,['SERVER_LISTENING','BROWSER_LAUNCHED','PAGE_READINESS_WAIT','ARCHIVE_RESOURCES_CLEANED']);
  assert.deepEqual(abortError.cleanup,{serverWasListening:true,browserWasLaunched:true,browserClosed:true,serverClosed:true,browserCloseError:null,serverCloseError:null});
  const attemptFolder=path.dirname(path.join(repoRoot,abortError.abortEvidenceRef));
  const files=fs.readdirSync(attemptFolder);
  assert.ok(files.includes('ABORTED.json'));
  assert.ok(files.some(name=>name.endsWith('.json')&&name!=='ABORTED.json'));
  assert.ok(files.some(name=>name.endsWith('.png')));
  assert.equal(files.includes('summary.json'),false);
  const aborted=JSON.parse(fs.readFileSync(path.join(attemptFolder,'ABORTED.json'),'utf8'));
  assert.equal(aborted.status,'ABORTED');assert.deepEqual(aborted.cleanup,abortError.cleanup);
  const evidenceRoot=path.join(repoRoot,'.tmp/archive/phase3d-browser-cancel-test/browser-cancel-test/visual-engine/production');
  fs.mkdirSync(evidenceRoot,{recursive:true});
  fs.writeFileSync(path.join(evidenceRoot,'collector-finalization-abort-'+process.pid+'.json'),JSON.stringify({schemaVersion:'ARCHIVE_COLLECTOR_FINALIZATION_ABORT_v1',runId,progressEvents:events,abortEvidenceRef:abortError.abortEvidenceRef,cleanup:abortError.cleanup,attemptFiles:files,summaryPresent:files.includes('summary.json')},null,2)+'\n');
});
