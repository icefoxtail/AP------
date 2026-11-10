// Render attempt log (roadmap 0-1): <out>/attempts.jsonl gets one line per attempt and one "final" line per render, appended across invocations,
// without changing figure-result.json. Plus the attempt-stats.mjs summarizer on a fixture.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {renderPlan} from '../production/render-plan.mjs';
import {createAttemptLog,errorCode,planDigest,stopwatch,ATTEMPT_LOG_FILE} from '../production/attempt-log.mjs';
import {summarize,formatSummary,findLogs,readLog,main as statsMain} from '../ops/tools/attempt-stats.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const golden=name=>path.join(here,'..','ops','golden',name,'plan.json');
const manifest=JSON.parse(fs.readFileSync(path.join(here,'..','ops','golden.manifest.json'),'utf8'));
const goldenItem=(dir,as)=>{const x=manifest.items.find(i=>i.dir===dir);return {sourcePath:x.sourcePath,ordinal:x.ordinal,dir:as};};
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'attempt-log-'));
const readLines=dir=>fs.readFileSync(path.join(dir,ATTEMPT_LOG_FILE),'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

test('errorCode picks the most specific code and never invents one',()=>{
  assert.equal(errorCode({code:'A_B'}),'A_B');
  assert.equal(errorCode({status:'COMPOSITE_PANEL_NOT_COMPOSED',detail:{status:'LAYOUT_INVENTORY_INCOMPLETE'}}),'LAYOUT_INVENTORY_INCOMPLETE');
  assert.equal(errorCode({status:'LAYOUT_INVENTORY_INCOMPLETE',detail:{unresolved:['x-coordinate']}}),'LAYOUT_INVENTORY_INCOMPLETE');
  assert.equal(errorCode({errors:['POINT_DISPLAY_NAME_MISMATCH:P']}),'POINT_DISPLAY_NAME_MISMATCH');
  assert.equal(errorCode('plan file not found: x.json'),null);
  assert.equal(errorCode(null),null);
});

test('logger lines carry the documented fields and never throw',()=>{
  const out=tmp(),watch=stopwatch();watch.lap('measure');
  const log=createAttemptLog({outDir:out,item:'q1',invocation:'inv1',planSha256:'abc'});
  log.setPlan({capability:'polynomial-spike-v1',graphPlan:{family:'polynomial'}});
  log.attempt({variant:'initial',stage:'compose',ok:false,code:'LAYOUT_INVENTORY_INCOMPLETE',detail:'x'.repeat(500),watch});
  log.attempt({variant:'COORDINATE_LEADER',stage:'compose',ok:true,fallback:['COORDINATE_LEADER'],watch});
  log.final({status:'ARCHIVE_BOUND',stage:'capture',fallback:['COORDINATE_LEADER'],durationMs:5});
  const [a,b,f]=readLines(out);
  assert.deepEqual([a.kind,a.attemptIndex,a.ok,a.code,a.capability,a.family,a.planSha256,a.invocation],['attempt',1,false,'LAYOUT_INVENTORY_INCOMPLETE','polynomial-spike-v1','polynomial','abc','inv1']);
  assert.equal(a.detail.length,200);assert.ok(typeof a.durationMs==='number'&&'measure' in a.stageMs);assert.ok(Date.parse(a.ts));
  assert.deepEqual([b.attemptIndex,b.ok,b.code,b.fallback],[2,true,null,['COORDINATE_LEADER']]);
  assert.deepEqual([f.kind,f.attempts,f.ok,f.status,f.fallback],['final',2,true,'ARCHIVE_BOUND',['COORDINATE_LEADER']]);
  // an unwritable folder must not throw
  assert.doesNotThrow(()=>createAttemptLog({outDir:path.join(out,'missing','dir'),item:'q',invocation:'i'}).final({status:'FAILED'}));
});

test('malformed plan logs a failed final line at read-plan; planSha256 is the file bytes',async()=>{
  const out=tmp(),planFile=path.join(out,'bad-plan.json');
  fs.writeFileSync(planFile,'{ "capability": ');
  const r=await renderPlan({item:{sourcePath:'archive/exams/test-exam.js',ordinal:3,dir:'t'},plan:planFile,outDir:out});
  assert.equal(r.status,'FAILED');assert.equal(r.stage,'read-plan');
  const lines=readLines(out);
  assert.equal(lines.length,1);
  const [line]=lines;
  assert.deepEqual([line.kind,line.item,line.ok,line.status,line.stage,line.code,line.attempts],['final','t',false,'FAILED','read-plan','PLAN_JSON_INVALID',0]);
  assert.equal(line.planSha256,sha(fs.readFileSync(planFile)));
  assert.ok(line.detail.length>0&&line.detail.length<=200);
  // a missing plan file is also a read-plan failure, with no digest
  const out2=tmp();
  await renderPlan({item:{sourcePath:'archive/exams/test-exam.js',ordinal:3,dir:'t'},plan:path.join(out2,'nope.json'),outDir:out2});
  const [missing]=readLines(out2);
  assert.deepEqual([missing.stage,missing.ok,missing.planSha256],['read-plan',false,null]);
  assert.equal(planDigest(path.join(out2,'nope.json')),null);
});

test('a failure inside an attempt logs the attempt and the final line; figure-result.json keeps its shape',async()=>{
  const out=tmp();
  const plan=JSON.parse(fs.readFileSync(golden('item01'),'utf8'));
  plan.coordinateCanvas={width:100,height:100};
  const r=await renderPlan({item:goldenItem('item01','c'),plan,outDir:out});
  assert.equal(r.status,'FAILED');assert.equal(r.stage,'spec');assert.match(r.detail,/COORDINATE_CANVAS_BOUNDS_INVALID/);
  const lines=readLines(out);
  const attempt=lines.find(l=>l.kind==='attempt'),final=lines.find(l=>l.kind==='final');
  assert.deepEqual([attempt.attemptIndex,attempt.variant,attempt.stage,attempt.ok,attempt.code,attempt.capability],[1,'initial','spec',false,'COORDINATE_CANVAS_BOUNDS_INVALID','construction-spike-v1']);
  assert.deepEqual([final.attempts,final.stage,final.ok,final.code,final.invocation],[1,'spec',false,'COORDINATE_CANVAS_BOUNDS_INVALID',attempt.invocation]);
  assert.equal(attempt.planSha256,sha(Buffer.from(JSON.stringify(plan))));
  // semantics of figure-result.json are unchanged: the original keys keep their values; a failure only adds code, detailFull, hint and fix (roadmap 1-1), never log fields
  const result=JSON.parse(fs.readFileSync(path.join(out,'c-result.json'),'utf8'));
  assert.deepEqual(Object.keys(result).sort(),['capability','code','detail','detailFull','fix','hint','identity','stage','status']);
  assert.equal(result.detail,'COORDINATE_CANVAS_BOUNDS_INVALID');assert.equal(result.detailFull,result.detail);
});

test('a real render logs its attempt and final line, and lines accumulate across invocations',async()=>{
  const out=tmp();
  const item=goldenItem('item14','g');
  const r1=await renderPlan({item,plan:golden('item14'),outDir:out});
  assert.equal(r1.status,'ARCHIVE_BOUND');
  let lines=readLines(out);
  assert.deepEqual(lines.map(l=>l.kind),['attempt','final']);
  const [attempt,final]=lines;
  assert.deepEqual([attempt.attemptIndex,attempt.variant,attempt.stage,attempt.ok,attempt.code,attempt.capability,attempt.family],[1,'initial','compose',true,null,'polynomial-spike-v1','polynomial']);
  assert.ok(['spec','measure','compose'].every(k=>typeof attempt.stageMs[k]==='number'));
  assert.deepEqual([final.ok,final.status,final.attempts,final.code],[true,'ARCHIVE_BOUND',1,null]);
  // a successful render's result file and log line carry nothing of the failure guidance
  const result=JSON.parse(fs.readFileSync(path.join(out,'g-result.json'),'utf8'));
  for(const key of ['code','detailFull','errors','hint','fix'])assert.equal(Object.hasOwn(result,key),false,key);
  assert.deepEqual([final.hint,final.fix],[null,null]);
  assert.equal(final.planSha256,sha(fs.readFileSync(golden('item14'))));
  assert.ok(final.durationMs>=attempt.durationMs);
  // second invocation on the same out folder appends and does not overwrite
  const first=fs.readFileSync(path.join(out,ATTEMPT_LOG_FILE),'utf8');
  await renderPlan({item,plan:{status:'EXEMPT',reason:'text is enough'},outDir:out});
  const text=fs.readFileSync(path.join(out,ATTEMPT_LOG_FILE),'utf8');
  assert.ok(text.startsWith(first));
  lines=readLines(out);
  assert.equal(lines.length,3);
  assert.notEqual(lines[2].invocation,lines[0].invocation);
  assert.deepEqual([lines[2].kind,lines[2].status,lines[2].ok],['final','EXEMPT',true]);
});

test('attempt-stats summarizes a fixture: renders per question, error codes by stage, fallback usage',()=>{
  const root=tmp();
  const put=(sub,records,extra='')=>{const dir=path.join(root,sub);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,ATTEMPT_LOG_FILE),records.map(r=>JSON.stringify(r)).join('\n')+'\n'+extra);};
  const cap='polynomial-spike-v1',fam='polynomial';
  const at=(item,invocation,i,ok,code,stage='compose',fallback=null)=>({kind:'attempt',item,invocation,capability:cap,family:fam,attemptIndex:i,stage,ok,code,fallback});
  const fin=(item,invocation,ok,over={})=>({kind:'final',item,invocation,capability:cap,family:fam,ok,status:ok?'ARCHIVE_BOUND':'FAILED',stage:'capture',code:null,...over});
  // q1: one invocation, three attempts (two layout failures, then ok with a leader fallback)
  const q1=[at('q1','i1',1,false,'LAYOUT_INVENTORY_INCOMPLETE'),at('q1','i1',2,false,'LAYOUT_INVENTORY_INCOMPLETE',undefined,['COORDINATE_LEADER']),at('q1','i1',3,true,null,'compose',['COORDINATE_LEADER','COORDINATE_PANEL']),fin('q1','i1',true,{fallback:['COORDINATE_LEADER','COORDINATE_PANEL']})];
  // q2: first invocation fails at frame (no attempt), second renders in one attempt
  const q2=[fin('q2','i2',false,{stage:'frame',code:'INVALID_FRAMING_COEFFICIENTS'}),at('q2','i3',1,true,null),fin('q2','i3',true)];
  // q3: a read-plan failure renders nothing; an attempt that threw is reported once (attempt + final share the code)
  const q3=[fin('q3','i4',false,{stage:'read-plan',code:'PLAN_JSON_INVALID'}),at('q3','i5',1,false,'ARCHIVE_PREFLIGHT_FAIL','measure'),fin('q3','i5',false,{stage:'measure',code:'ARCHIVE_PREFLIGHT_FAIL'})];
  put('run-a',[...q1,...q2],'this line is not json\n');
  put('run-b/nested',q3);
  const files=findLogs(root);
  assert.equal(files.length,2);
  const logs=files.map(file=>({dir:path.dirname(file),...readLog(file)}));
  assert.equal(logs.reduce((n,l)=>n+l.malformed,0),1);
  const s=summarize(logs);
  const klass=s.classes.find(c=>c.name===cap+'/'+fam);
  assert.equal(klass.questions,3);
  // renders per question: q1 = 3, q2 = 1 (frame failure, no attempt) + 1 = 2, q3 = 1 (read-plan renders nothing) + 1 = 1
  assert.deepEqual(klass.rendersPerQuestion,{median:2,p90:3,max:3});
  assert.deepEqual(klass.invocationsPerQuestion,{median:2,p90:2,max:2});
  const byCode=Object.fromEntries(s.errorCodes.map(e=>[e.code,e]));
  assert.equal(byCode.LAYOUT_INVENTORY_INCOMPLETE.count,2);
  assert.deepEqual(byCode.LAYOUT_INVENTORY_INCOMPLETE.stages,{compose:2});
  assert.equal(byCode.ARCHIVE_PREFLIGHT_FAIL.count,1);
  assert.deepEqual(byCode.ARCHIVE_PREFLIGHT_FAIL.stages,{measure:1});
  assert.equal(byCode.INVALID_FRAMING_COEFFICIENTS.count,1);
  assert.deepEqual(byCode.INVALID_FRAMING_COEFFICIENTS.stages,{frame:1});
  assert.equal(byCode.PLAN_JSON_INVALID.count,1);
  assert.deepEqual(s.fallbacks,[{step:'COORDINATE_LEADER',runs:1},{step:'COORDINATE_PANEL',runs:1}]);
  const text=formatSummary(s,{files:files.length,malformed:1});
  assert.match(text,/polynomial-spike-v1\/polynomial/);assert.match(text,/LAYOUT_INVENTORY_INCOMPLETE  \[2: compose=2\]/);assert.match(text,/1 malformed/);
  // the CLI entry prints the same and exits 0; a missing folder is a usage error
  const chunks=[];const write=process.stdout.write;process.stdout.write=c=>{chunks.push(String(c));return true;};
  let code;try{code=statsMain([root]);}finally{process.stdout.write=write;}
  assert.equal(code,0);assert.match(chunks.join(''),/Renders per question/);
  const err=console.error;console.error=()=>{};try{assert.equal(statsMain([path.join(root,'nope')]),2);}finally{console.error=err;}
});
