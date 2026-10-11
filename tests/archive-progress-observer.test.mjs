import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {reconcile,present} from '../archive/tools/archive-progress-core.mjs';
import {mergedPRs,parseProof,selectProof,checksFromRuns} from '../archive/tools/archive-progress-collector.mjs';
import {executeOnce} from '../archive/tools/archive-progress-observer.mjs';
const ID='25_샘플고_1학기_중간_고1_기출',A='a'.repeat(40),B='b'.repeat(40),C='c'.repeat(40),D='d'.repeat(40),E='e'.repeat(40);
const at=n=>'2026-10-11T00:'+String(n).padStart(2,'0')+':00Z';
const link=(kind,n)=>'https://github.com/icefoxtail/AP------/'+kind+'/'+n;
const proof=(sha,id=20,attempt=1,site=false)=>({schema:2,run_id:id,run_attempt:attempt,sourceSha:sha,
 registry:'f'.repeat(64),exams:{[ID]:{source:A,assets:'e'.repeat(64)}},actualDeployed:site,deploymentJobVerified:site,evidenceSource:site?'uploaded-pages-artifact':'trusted-git-tree'});
const pr=(head=A,merge=B,number=1,t=1)=>({number,exams:[ID],headSha:head,mergeSha:merge,at:at(t),url:link('pull',number)});
const ck=(head=A,result='success',minute=2,attempt=1)=>({pr:1,sha:head,conclusion:result,at:at(minute),url:link('actions/runs',10),attempt});
const reg=(input=B,result=C,minute=3,attempt=1)=>({id:20,attempt,sha:input,inputSha:input,registeredSha:result,proof:proof(result,20,attempt),conclusion:'success',at:at(minute),url:link('actions/runs',20)});
const deploy=(sha=D,minute=4,conclusion='success',attempt=1)=>({id:30,attempt,sha,proof:proof(sha,30,attempt,true),conclusion,at:at(minute),url:link('actions/runs',30)});
const ancestor=async(a,b)=>[A,B,C,D,E].indexOf(a)<=[A,B,C,D,E].indexOf(b);
const base=()=>({prs:[pr()],checks:[ck()],registrations:[reg()],releases:[deploy()],now:at(5)});
test('four separate states, exact PR head SHA, actual registration SHA',async()=>{
 const e=(await reconcile(null,base(),ancestor)).entries[ID];
 assert.equal(e.check.result,'통과');assert.equal(e.check.sha,A);assert.equal(e.main.sha,B);
 assert.equal(e.registration.sha,C);assert.equal(e.deployment.sha,D);
});
test('previous PR head passed, final head failed; never promote old success',async()=>{
 const b=base();b.prs[0].headSha=C;b.checks=[ck(A,'success',3),ck(C,'failure',4)];
 const e=(await reconcile(null,b,ancestor)).entries[ID];
 assert.equal(e.check.result,'실패');assert.equal(e.check.sha,C);
 b.checks=[ck(A,'success',3)];
 const s=await reconcile(null,b,ancestor);assert.equal(present(s.entries[ID].check),'미확인');
});
test('final head later attempt failure wins over same-head earlier success even if reversed',async()=>{
 const b=base();b.checks=[ck(A,'failure',4,2),ck(A,'success',3,1)];
 assert.equal((await reconcile(null,b,ancestor)).entries[ID].check.result,'실패');
 assert.equal((await reconcile(null,{...b,checks:[...b.checks].reverse()},ancestor)).entries[ID].check.result,'실패');
});
test('deployment before registration is unconfirmed; replay restores with exact proofs',async()=>{
 const b=base();const first=await reconcile(null,{...b,registrations:[]},ancestor);
 assert.equal(present(first.entries[ID].registration),'미확인');assert.equal(present(first.entries[ID].deployment),'미확인');
 const second=await reconcile(first,b,ancestor);assert.equal(second.entries[ID].deployment.sha,D);
});
test('retry completed new SHA but current run attempt evidence missing => unverified',async()=>{
 const r={id:20,attempt:2};
 const artifacts=[{name:'archive-progress-20-1',id:90,expired:false,size_in_bytes:100}];
 assert.equal(selectProof(artifacts,r),null);
 assert.equal(parseProof(JSON.stringify(proof(C,20,1)),r,'registration'),null);
 const b=base();b.registrations=[{...reg(B,D,3,2),registeredSha:null,proof:null}];
 const e=(await reconcile(null,b,ancestor)).entries[ID];assert.equal(present(e.registration),'미확인');
});
test('100+ changed files fetches every page and maps final exam',async()=>{
 const files=Array.from({length:100},(_,i)=>({filename:'other/file-'+i}));files.push({filename:'archive/exams/high/'+ID+'.js'});
 const fake=async route=>{
  if(route.startsWith('/pulls?'))return [{number:1,merged_at:at(1),merge_commit_sha:B,head:{sha:A},changed_files:101,html_url:link('pull',1)}];
  if(route.includes('/files?')&&/[&?]page=1$/.test(route))return files.slice(0,100);
  if(route.includes('/files?')&&/[&?]page=2$/.test(route))return files.slice(100);
  throw Error('unexpected '+route);
 };
 const result=await mergedPRs(fake,1);
 assert.deepEqual(result.prs[0].exams,[ID]);assert.deepEqual(result.incompletePRs,[]);
});
test('incomplete PR file API is reported; no uncertain new completion',async()=>{
 const fake=async route=>{
  if(route.startsWith('/pulls?'))return [{number:1,merged_at:at(1),merge_commit_sha:B,head:{sha:A},changed_files:101,html_url:link('pull',1)}];
  if(route.includes('/files?')&&/[&?]page=1$/.test(route))return Array.from({length:100},(_,i)=>({filename:'archive/exams/'+i+'.js'}));
  throw Error('page failure');
 };
 const {prs,incompletePRs}=await mergedPRs(fake,1);assert.equal(prs.length,0);assert.deepEqual(incompletePRs,[1]);
 const e=(await reconcile(null,{prs,checks:[],registrations:[],releases:[],incompletePRs,now:at(6)},ancestor));
 assert.equal(e.inventoryComplete,false);
});
test('opposite event order and duplicate evidence cannot flip current release',async()=>{
 const b=base(),first=await reconcile(null,b,ancestor);
 const reversed=await reconcile(first,{...b,prs:[...b.prs,...b.prs].reverse(),registrations:[...b.registrations,...b.registrations].reverse(),
  releases:[...b.releases,...b.releases].reverse(),checks:[...b.checks,...b.checks].reverse()},ancestor);
 assert.deepEqual(reversed.entries,first.entries);
});
test('past success remains visible alongside latest failed deployment',async()=>{
 const first=await reconcile(null,base(),ancestor);
 const second=await reconcile(first,{...base(),releases:[{...deploy(E,6,'failure'),proof:null}],now:at(7)},ancestor);
 assert.equal(second.entries[ID].lastSuccessfulRelease.sha,D);
 assert.equal(second.entries[ID].deployment.result,'실패');
 assert.equal(second.entries[ID].lastFailure.stage,'배포 작업');
});
test('newer merged revision resets current previous PASS but preserves old successful release',async()=>{
 const first=await reconcile(null,base(),ancestor);
 const b={...base(),prs:[pr(),pr(D,E,2,6)],checks:[ck()],registrations:[],releases:[],now:at(7)};
 const second=await reconcile(first,b,ancestor);
 assert.equal(second.entries[ID].main.sha,E);assert.equal(present(second.entries[ID].check),'미확인');
 assert.equal(present(second.entries[ID].deployment),'미확인');assert.equal(second.entries[ID].lastSuccessfulRelease.sha,D);
});
test('malicious URLs, malformed timestamps and extra private fields do not appear',async()=>{
 const bad=base();bad.prs[0].url='https://evil.example/steal?token=x';
 assert.equal(Object.keys((await reconcile(null,bad,ancestor)).entries).length,0);
 const previous={entries:{[ID]:{main:{result:'완료',sha:B,run:link('pull',1),at:at(1),privateKey:'token'},
  check:{result:'통과',sha:A,run:'https://github.com.evil.example/capture',at:at(2)},
  registration:{result:'완료',sha:C,run:link('actions/runs',20),at:'2026-02-31T00:00:00Z'}}}};
 const cleared=await reconcile(previous,{prs:[],checks:[],registrations:[],releases:[],now:at(7)},ancestor);
 assert.equal(cleared.entries[ID].main.privateKey,undefined);assert.equal(cleared.entries[ID].check,null);
 assert.equal(cleared.entries[ID].registration,null);
});
test('real overlay leaves producer workflows byte-identical; observer failure and delay cannot block them',async()=>{
 const tmp=mkdtempSync(path.join(os.tmpdir(),'archive-progress-test-'));
 try{
  execFileSync('git',['init','-q','-b','work/test'],{cwd:tmp});writeFileSync(path.join(tmp,'AGENTS.md'),'# test');
  const regYaml='name: Archive Registration Sync\njobs:\n  sync:\n    steps:\n      - name: Actual registration\n        run: echo REGISTERED\n';
  const pageYaml='name: Archive Pages Release\njobs:\n  build:\n    steps:\n      - name: Upload the verified student site\n        run: echo DEPLOYED\n';
  mkdirSync(path.join(tmp,'.github','workflows'),{recursive:true});
  const rp=path.join(tmp,'.github/workflows/archive-registration-sync.yml'),pp=path.join(tmp,'.github/workflows/archive-pages-release.yml');
  writeFileSync(rp,regYaml);writeFileSync(pp,pageYaml);
  const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  execFileSync('python3',[path.join(dir,'apply.py'),tmp]);
  assert.equal(readFileSync(rp,'utf8'),regYaml);assert.equal(readFileSync(pp,'utf8'),pageYaml);
  // Exercise the real collector entry path with mocked API and delayed/failing STORE.
  const api=async route=>{
   if(route.startsWith('/pulls?'))return [];
   if(route.includes('/runs?'))return {workflow_runs:[]};
   if(route.startsWith('/contents/'))return null;
   throw Error('unexpected '+route);
  };
  let started;const entered=new Promise(resolve=>{started=resolve;});
  let release;const barrier=new Promise(resolve=>{release=resolve;});
  const observer=executeOnce({api,getEvidence:async()=>null,clock:()=>at(8),
   storeStatus:async()=>{started();await barrier;throw Error('status branch unavailable');}});
  await entered;
  const regOutput=execFileSync('bash',['-c','echo REGISTERED'],{cwd:tmp,timeout:1000,encoding:'utf8'});
  const pageOutput=execFileSync('bash',['-c','echo DEPLOYED'],{cwd:tmp,timeout:1000,encoding:'utf8'});
  assert.match(regOutput,/REGISTERED/);assert.match(pageOutput,/DEPLOYED/);
  release();await assert.rejects(observer,/status branch unavailable/);
  assert.equal(readFileSync(pp,'utf8'),pageYaml);
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
test('actual uploaded Pages ZIP content yields source/asset/registry proof, not checkout digest',async()=>{
 const tmp=mkdtempSync(path.join(os.tmpdir(),'archive-site-proof-'));
 try{
  const python=String.raw`import io,os,tarfile,zipfile,sys
root=sys.argv[1]
files={
 'archive/exams/high/25_샘플고_1학기_중간_고1_기출.js': b'deployed exam bytes',
 'archive/assets/images/25_샘플고_1학기_중간_고1_기출/q1.png': b'actual uploaded asset',
 'archive/db.js': b'actual deployed registry',
}
raw=io.BytesIO()
with tarfile.open(fileobj=raw,mode='w:gz') as t:
 for name,body in files.items():
  info=tarfile.TarInfo('./'+name);info.size=len(body);t.addfile(info,io.BytesIO(body))
with zipfile.ZipFile(os.path.join(root,'site.zip'),'w') as z:z.writestr('artifact.tar',raw.getvalue())
`;
  execFileSync('python3',['-c',python,tmp]);
  const pythonResult=execFileSync('python3',[path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../.github/scripts/archive-progress-site-snapshot.py'),path.join(tmp,'site.zip')],{encoding:'utf8'});
  const files=JSON.parse(pythonResult);
  const {proofFromBlobs}=await import('../archive/tools/archive-progress-content-proof.mjs');
  const result=proofFromBlobs(files);
  assert.match(result.exams[ID].source,/^[a-f0-9]{40}$/);
  assert.match(result.exams[ID].assets,/^[a-f0-9]{64}$/);
  assert.match(result.registry,/^[a-f0-9]{64}$/);
  const changed=proofFromBlobs({...files,'archive/db.js':B});
  assert.notEqual(result.registry,changed.registry);
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
test('attempt 2 without evidence cannot borrow attempt 1 registration result even when run ID matches',async()=>{
 const first=await reconcile(null,base(),ancestor);
 const next={...base(),registrations:[{id:20,attempt:2,sha:B,inputSha:B,registeredSha:null,proof:null,
  conclusion:'success',at:at(6),url:link('actions/runs',20)}],releases:[],now:at(7)};
 const result=(await reconcile(first,next,ancestor)).entries[ID];
 assert.equal(present(result.registration),'미확인');
 assert.equal(result.lastSuccessfulRelease.sha,D);
});
test('trusted evidence helper records exact run ID and attempt; rejects PR context',async()=>{
 const tmp=mkdtempSync(path.join(os.tmpdir(),'archive-evidence-test-'));
 try{
  execFileSync('git',['init','-q','-b','test'],{cwd:tmp});
  mkdirSync(path.join(tmp,'archive','exams','high'),{recursive:true});
  writeFileSync(path.join(tmp,'archive/exams/high/'+ID+'.js'),'test exam');
  execFileSync('git',['add','archive/exams'],{cwd:tmp});
  execFileSync('git',['-c','user.email=test@localhost','-c','user.name=test','commit','-qm','test'],{cwd:tmp});
  const script=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../.github/scripts/archive-progress-evidence.mjs');
  const env={...process.env,GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'2',GITHUB_EVENT_NAME:'workflow_dispatch'};
  execFileSync('node',[script,path.join(tmp,'output')],{cwd:tmp,env});
  const witness=JSON.parse(readFileSync(path.join(tmp,'output/progress-evidence-123-2.json'),'utf8'));
  assert.equal(witness.run_id,123);assert.equal(witness.run_attempt,2);assert.equal(witness.actualDeployed,false);
  assert.throws(()=>execFileSync('node',[script,path.join(tmp,'another')],{cwd:tmp,env:{...env,GITHUB_EVENT_NAME:'pull_request'},stdio:'pipe'}));
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
test('applying v1 targeted patch removes old pre-upload hooks and is idempotent',()=>{
 const tmp=mkdtempSync(path.join(os.tmpdir(),'archive-v1-cleanup-'));
 try{
  execFileSync('git',['init','-q','-b','work/review'],{cwd:tmp});
  writeFileSync(path.join(tmp,'AGENTS.md'),'# test');
  const baseReg='name: Archive Registration Sync\njobs:\n  sync:\n    steps:\n      - run: echo PRODUCTION\n';
  const basePage='name: Archive Pages Release\njobs:\n  build:\n    steps:\n      - run: echo BUILD\n      - run: echo UPLOAD\n';
  const regHook=`
      - name: Capture actual registration commit for observer (best effort)
        if: always()
        continue-on-error: true
        run: node .github/scripts/archive-progress-evidence.mjs "$RUNNER_TEMP/progress-evidence.json"

      - name: Upload registration observer evidence (best effort)
        if: always()
        continue-on-error: true
        uses: actions/upload-artifact@v4
        with:
          name: archive-progress-${'${{ github.run_id }}'}
          path: ${'${{ runner.temp }}'}/progress-evidence.json
          if-no-files-found: ignore
          retention-days: 30
`;
  const pageHook=`      - name: Capture verified build provenance for observer (best effort)
        if: always()
        continue-on-error: true
        run: node .github/scripts/archive-progress-evidence.mjs "$RUNNER_TEMP/progress-evidence.json"

      - name: Upload verified build observer evidence (best effort)
        if: always()
        continue-on-error: true
        uses: actions/upload-artifact@v4
        with:
          name: archive-progress-${'${{ github.run_id }}'}
          path: ${'${{ runner.temp }}'}/progress-evidence.json
          if-no-files-found: ignore
          retention-days: 30

`;
  const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  mkdirSync(path.join(tmp,'.github','workflows'),{recursive:true});
  const rp=path.join(tmp,'.github/workflows/archive-registration-sync.yml');
  const pp=path.join(tmp,'.github/workflows/archive-pages-release.yml');
  writeFileSync(rp,baseReg+regHook);writeFileSync(pp,basePage+pageHook);
  execFileSync('python3',[path.join(dir,'apply.py'),tmp]);
  assert.equal(readFileSync(rp,'utf8'),baseReg);assert.equal(readFileSync(pp,'utf8'),basePage);
  execFileSync('python3',[path.join(dir,'apply.py'),tmp]);
  assert.equal(readFileSync(rp,'utf8'),baseReg);assert.equal(readFileSync(pp,'utf8'),basePage);
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
