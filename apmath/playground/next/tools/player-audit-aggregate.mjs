// Aggregate raw player-fast-audit evidence. Never upgrades a raw verdict.
// Usage: node tools/player-audit-aggregate.mjs --artifacts DIR
//   --manifest FILE --inventory FILE --out FILE
// Inventory sceneIndex is a flat index, NEVER a substitute for native gi.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = file => { const bytes=fs.readFileSync(file);return {value:JSON.parse(bytes),ref:{path:file,sha256:sha(bytes),bytes:bytes.length}}; };
const identity = x => JSON.stringify([x.lab,String(x.scene),x.lessonIndex]);
const coverageKey = (u,view) => `${u.lab}:${u.scene}${u.gi==null?'':'@'+u.gi}:${u.lessonIndex}:${view}`;
const increment = (o,key,n=1) => {o[key]=(o[key]||0)+n;};
const statuses = () => ({PASS:0,FAIL:0,REVIEW_REQUIRED:0});
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):e.isFile()?[path.join(dir,e.name)]:[]);
const unique = xs => [...new Set(xs)];
const finite = x => typeof x==='number'&&Number.isFinite(x);
const extreme = (values,kind) => {const xs=values.filter(finite);return xs.length?Math[kind](...xs):null;};
const knownRowStatuses = new Set(['PASS','FAIL','REVIEW_REQUIRED']);
const auditMethod = 'DETERMINISTIC_NATIVE_SEEK_SAMPLES_PLUS_SELECTED_NATIVE_RAF_PLAYBACK';
const causeName = name => String(name).replace(/^(?:initial|seek-ended|normal-ended|t=[\d.]+):\s*/, '');

async function jsonLines(file,visit,error) {
  const stream=fs.createReadStream(file),hash=createHash('sha256');
  stream.on('data',chunk=>hash.update(chunk));
  const lines=readline.createInterface({input:stream,crlfDelay:Infinity});
  let line=0,records=0;
  for await(const text of lines){line++;if(!text.trim())continue;let row;
    try{row=JSON.parse(text);}catch(e){error('INVALID_JSONL',{file,line,error:String(e)});continue;}
    records++;await visit(row,line);
  }
  return {path:file,sha256:hash.digest('hex'),bytes:fs.statSync(file).size,records,lines:line};
}

export async function aggregateAudit({artifacts,manifest,inventory}) {
  artifacts=path.resolve(artifacts);manifest=path.resolve(manifest);inventory=path.resolve(inventory);
  const m=readJson(manifest),inv=readJson(inventory),errors=[],warnings=[];
  const error=(code,details)=>errors.push({code,...details});
  const warn=(code,details)=>warnings.push({code,...details});
  if(!Array.isArray(m.value.targets)||!Array.isArray(inv.value.units))throw Error('Manifest targets and inventory units arrays are required.');
  const units=new Map(),expected=new Map();
  for(const u of inv.value.units){const key=identity(u);if(units.has(key))error('AMBIGUOUS_INVENTORY_UNIT',{key});else units.set(key,u);}
  for(const [targetIndex,t] of m.value.targets.entries()) {
    let candidates=[...units.values()].filter(u=>u.lab===t.lab&&(t.scene==null||String(t.scene)===String(u.scene))&&(!t.lessonIndices||t.lessonIndices.includes(u.lessonIndex)));
    if(t.gi!=null&&candidates.some(u=>u.gi==null)){error('GI_FILTER_REQUIRES_INVENTORY_GI',{targetIndex,target:t});continue;}
    if(t.gi!=null)candidates=candidates.filter(u=>u.gi===t.gi);
    if(!candidates.length)error('TARGET_MATCHES_NO_INVENTORY_UNIT',{targetIndex,target:t});
    for(const u of candidates)for(const view of t.views||['390x844']) {
      const key=coverageKey(u,view),old=expected.get(key);
      if(!old)expected.set(key,{key,lab:u.lab,scene:u.scene,lessonIndex:u.lessonIndex,view,...(u.gi==null?{}:{gi:u.gi}),capture:!!t.capture,playback:!!t.playback,normalPlayback:!!t.normalPlayback,targetIndices:[targetIndex]});
      else{old.capture||=!!t.capture;old.playback||=!!t.playback;old.normalPlayback||=!!t.normalPlayback;old.targetIndices.push(targetIndex);}
    }
  }
  if(m.value.selection?.selectedViewportUnits!=null&&m.value.selection.selectedViewportUnits!==expected.size)error('MANIFEST_DECLARED_COVERAGE_MISMATCH',{declared:m.value.selection.selectedViewportUnits,computed:expected.size});

  const files=walk(artifacts),summaries=[],ignored=[],external=[],runIds=new Set(),runAttempts=new Set(),externalSourceShas=new Set();
  for(const file of files) {
    const relative=path.relative(artifacts,file),base=path.basename(file);
    if(relative.split(path.sep).some(p=>p==='tool-tests'||p==='aggregate-tool')){if(base==='summary.json')ignored.push({file,reason:'TOOL_TEST_NOT_PRODUCT_EVIDENCE'});continue;}
    if(base==='summary.json'){
      const input=readJson(file),s=input.value;
      if(s.method!==auditMethod||s.realBrowser===false||s.productCoverage===0||/^https?:\/\/simulated\./.test(s.base||'')){ignored.push({file,sha256:input.ref.sha256,reason:'NOT_RAW_PRODUCT_PLAYER_AUDIT'});continue;}
      summaries.push(input);
    }else if(base==='artifacts-index.json'||/(?:^|-)receipt\.json$/.test(base)||['run.json','execution.json','github-run.json'].includes(base)) {
      const input=readJson(file),records=Array.isArray(input.value)?input.value:[input.value];
      const values=records.map(r=>({
        ...(r.workflow_run?{artifactId:r.id,artifactName:r.name,digest:r.digest,url:r.url,archiveDownloadUrl:r.archive_download_url,createdAt:r.created_at,expiresAt:r.expires_at}:{}),
        runId:r.workflow_run?.id??r.runId??r.run_id??r.run,
        runAttempt:r.workflow_run?.run_attempt??r.runAttempt??r.run_attempt,
        sourceSha:r.workflow_run?.head_sha??r.sourceSha??r.head_sha,
        branch:r.workflow_run?.head_branch??r.head_branch,htmlUrl:r.html_url,status:r.status
      })).filter(r=>r.runId!=null||r.sourceSha);
      if(values.length){external.push({ref:input.ref,values});for(const v of values){if(v.runId!=null)runIds.add(String(v.runId));if(v.runAttempt!=null)runAttempts.add(String(v.runAttempt));if(v.sourceSha)externalSourceShas.add(v.sourceSha);}}
    }
  }
  if(!summaries.length)error('NO_RAW_PLAYER_SUMMARIES',{artifacts});
  const sourceShas=unique(summaries.map(s=>s.value.sourceSha)),manifestShas=unique(summaries.map(s=>s.value.manifestSha256));
  if(sourceShas.length!==1)error('MIXED_SOURCE_SHA',{sourceShas});
  const sourceSha=sourceShas.length===1?sourceShas[0]:null;
  if(sourceSha&&!/^[a-f0-9]{40}$/i.test(sourceSha))error('INVALID_SOURCE_SHA',{sourceSha});
  for(const s of summaries){
    if(s.value.manifestSha256!==m.ref.sha256)error('MANIFEST_SHA_MISMATCH',{summary:s.ref.path,expected:m.ref.sha256,actual:s.value.manifestSha256});
    for(const id of [s.value.runId,s.value.run_id,s.value.execution?.runId])if(id!=null)runIds.add(String(id));
  }
  if(runIds.size>1)error('MIXED_EXTERNAL_RUNS',{runIds:[...runIds]});
  if(runAttempts.size>1)error('MIXED_RUN_ATTEMPTS',{runAttempts:[...runAttempts]});
  for(const value of externalSourceShas)if(sourceSha&&value!==sourceSha)error('EXTERNAL_SOURCE_SHA_MISMATCH',{expected:sourceSha,actual:value});
  if(!runIds.size)warn('EXTERNAL_RUN_ID_UNAVAILABLE',{message:'Source/manifest identity is checked; a single external execution cannot be independently established.'});

  const rawRows=statuses(),assertions=statuses(),assertionUnits=new Map(),causes=new Map(),nativeKeys=new Map(),observed=new Map(),duplicates=[],unexpected=[],rawUnits=[],receipts=[],shards=new Map(),sampleMethods={},startup=new Map(),fatal=[];
  const nativeExecutions=[],otherContinuous=[],sourceFingerprints=new Map();
  let sampleCount=0,rowCount=0;
  const addStartup=(failure,ref)=>{const key=JSON.stringify([failure.lab,failure.view,failure.phase,failure.error,failure.at]);const item=startup.get(key);if(item)item.refs.push(ref);else startup.set(key,{...failure,refs:[ref]});};
  for(const input of summaries) {
    const s=input.value,dir=path.dirname(input.ref.path),rowsPath=path.join(dir,'units.jsonl');
    const localCounts=statuses();let localRows=0,localSamples=0,localNative=0;
    const receipt={summary:input.ref,sourceSha:s.sourceSha,manifestSha256:s.manifestSha256,shard:s.shard??null,startedAt:s.startedAt,finishedAt:s.finishedAt,executionStatus:s.executionStatus,status:s.status,summaryCounts:{completed:s.completed,passed:s.passed,failed:s.failed,reviewRequired:s.reviewRequired,reused:s.reused,samples:s.samples},sourceFilesSha256:sha(JSON.stringify(s.sourceFiles||{}))};
    const shard=s.shard&&/^(\d+)\/(\d+)$/.exec(s.shard);
    if(s.shard&&!shard)error('INVALID_SHARD_ID',{summary:input.ref.path,shard:s.shard});
    if(shard){if(shards.has(s.shard))error('DUPLICATE_SHARD',{shard:s.shard,files:[shards.get(s.shard),input.ref.path]});else shards.set(s.shard,input.ref.path);}
    for(const [lab,binding]of Object.entries(s.sourceFiles||{})){
      const previous=sourceFingerprints.get(lab);if(previous&&previous!==binding.sha256)error('LAB_SOURCE_FINGERPRINT_MISMATCH',{lab,expected:previous,actual:binding.sha256,summary:input.ref.path});else sourceFingerprints.set(lab,binding.sha256);
    }
    if(s.fatalError)fatal.push({error:s.fatalError,summary:input.ref,shard:s.shard,knownLab:null});
    for(const f of s.labFailures||[])addStartup(f,{file:input.ref.path,location:'labFailures'});
    const startupPath=path.join(dir,'lab-failures.jsonl');
    if(fs.existsSync(startupPath))receipt.labFailures=await jsonLines(startupPath,(f,line)=>addStartup(f,{file:startupPath,line}),error);
    if(!fs.existsSync(rowsPath)){error('MISSING_UNITS_FILE',{summary:input.ref.path,rowsPath});receipts.push(receipt);continue;}
    receipt.units=await jsonLines(rowsPath,(row,line)=>{
      const ref={file:rowsPath,line};rowCount++;localRows++;increment(rawRows,row.status);increment(localCounts,row.status);
      if(!knownRowStatuses.has(row.status))error('UNKNOWN_ROW_STATUS',{key:row.key,status:row.status,ref});
      if(row.sourceSha&&row.sourceSha!==s.sourceSha)error('ROW_SOURCE_SHA_MISMATCH',{key:row.key,ref});
      if(row.manifestSha256&&row.manifestSha256!==m.ref.sha256)error('ROW_MANIFEST_SHA_MISMATCH',{key:row.key,ref});
      const nativeKey=`${row.lab}:${row.scene}@${row.gi}:${row.lessonIndex}:${row.view}`;
      if(row.key!==nativeKey)error('NATIVE_KEY_FIELDS_MISMATCH',{key:row.key,expected:nativeKey,ref});
      if(nativeKeys.has(row.key)){const duplicate={key:row.key,first:nativeKeys.get(row.key),again:ref};duplicates.push(duplicate);error('DUPLICATE_UNIT_KEY',duplicate);}else nativeKeys.set(row.key,ref);
      if(shard&&parseInt(sha(row.key).slice(0,8),16)%+shard[2]!==+shard[1])error('ROW_IN_WRONG_SHARD',{key:row.key,shard:s.shard,ref});
      const u=units.get(identity(row)),key=u?coverageKey(u,row.view):null;
      if(u?.gi!=null&&u.gi!==row.gi)error('ROW_GROUP_MISMATCH',{key:row.key,expectedGi:u.gi,actualGi:row.gi,ref});
      if(!key||!expected.has(key)){unexpected.push({key:row.key,coverageKey:key,ref});error('UNEXPECTED_COVERAGE_UNIT',{key:row.key,coverageKey:key,ref});}
      else if(observed.has(key))error('DUPLICATE_COVERAGE_UNIT',{key,first:observed.get(key),again:{nativeKey:row.key,ref}});
      else observed.set(key,{nativeKey:row.key,status:row.status,ref});
      const binding=s.sourceFiles?.[row.lab];
      if(binding&&row.sourceFingerprint!==binding.sha256)error('ROW_SOURCE_FINGERPRINT_MISMATCH',{key:row.key,expected:binding.sha256,actual:row.sourceFingerprint,ref});
      const checks=Array.isArray(row.checks)?row.checks:[];
      if(!Array.isArray(row.checks))error('MISSING_CHECKS',{key:row.key,ref});
      for(const c of checks){
        increment(assertions,c.status);if(!assertionUnits.has(c.status))assertionUnits.set(c.status,new Set());assertionUnits.get(c.status).add(row.key);
        if(!knownRowStatuses.has(c.status))error('UNKNOWN_ASSERTION_STATUS',{key:row.key,check:c.name,status:c.status,ref});
        if(c.status==='PASS')continue;
        const name=causeName(c.name),id=JSON.stringify([c.status,name]);if(!causes.has(id))causes.set(id,{status:c.status,cause:name,assertions:0,units:new Set()});
        const group=causes.get(id);group.assertions++;group.units.add(row.key);
      }
      const implied=checks.some(c=>c.status==='FAIL')?'FAIL':checks.some(c=>c.status==='REVIEW_REQUIRED')?'REVIEW_REQUIRED':'PASS';
      if(knownRowStatuses.has(row.status)&&row.status!==implied)error('RAW_STATUS_CHECKS_DISAGREE',{key:row.key,rawStatus:row.status,checksImply:implied,ref});
      const samples=Array.isArray(row.samples)?row.samples:[];sampleCount+=samples.length;localSamples+=samples.length;
      for(const sample of samples)increment(sampleMethods,sample.method||'UNSPECIFIED');
      for(const trace of row.continuous||[]){
        if(trace.method!=='NATIVE_RAF_PLAYBACK'){otherContinuous.push({key:row.key,trace,ref});continue;}
        localNative++;nativeExecutions.push({key:row.key,ref,...trace,complete:trace.finished===true&&finite(trace.last)&&finite(trace.duration)&&trace.last>=trace.duration-1e-6});
      }
      rawUnits.push({key:row.key,coverageKey:key,status:row.status,sourceFingerprint:row.sourceFingerprint,ref,samples:samples.length,startedAt:row.startedAt,finishedAt:row.finishedAt});
    },error);
    const compare={completed:localRows,passed:localCounts.PASS,failed:localCounts.FAIL,reviewRequired:localCounts.REVIEW_REQUIRED,samples:localSamples};
    receipt.recounted=compare;
    for(const [field,value]of Object.entries(compare))if(s[field]!==value)error('SUMMARY_COUNTER_MISMATCH',{summary:input.ref.path,field,summaryValue:s[field],rawValue:value,resumeReused:s.reused||0});
    if(Array.isArray(s.continuous)&&s.continuous.length!==localNative)error('SUMMARY_NATIVE_COUNT_MISMATCH',{summary:input.ref.path,summaryValue:s.continuous.length,rawValue:localNative});
    receipts.push(receipt);
  }
  const notRun=[...expected.values()].filter(u=>!observed.has(u.key));
  const groups=[...causes.values()].map(g=>({status:g.status,cause:g.cause,assertions:g.assertions,uniqueUnits:g.units.size,unitKeys:[...g.units].sort()})).sort((a,b)=>a.status.localeCompare(b.status)||b.uniqueUnits-a.uniqueUnits||a.cause.localeCompare(b.cause));
  const summarizeTraces=list=>({executions:list.length,uniqueUnits:new Set(list.map(x=>x.key)).size,completed:list.filter(x=>x.complete).length,incomplete:list.filter(x=>!x.complete).length,
    wallMs:list.reduce((n,x)=>n+(finite(x.wallMs)?x.wallMs:0),0),frames:list.reduce((n,x)=>n+(finite(x.frames)?x.frames:0),0),scriptSeconds:list.reduce((n,x)=>n+(finite(x.duration)?x.duration:0),0),
    missingWallMetrics:list.filter(x=>!finite(x.wallMs)).length,rates:unique(list.map(x=>x.rate)),multipliers:unique(list.map(x=>x.multiplier)),firstTimelineSeconds:extreme(list.map(x=>x.first),'min'),lastTimelineSeconds:extreme(list.map(x=>x.last),'max'),
    maximumTimelineJumpSeconds:extreme(list.map(x=>x.maximumJump),'max')});
  const normal=nativeExecutions.filter(x=>x.multiplier===1),fast=nativeExecutions.filter(x=>x.multiplier>1),paired=[];
  for(const n of normal)for(const q of fast.filter(q=>q.key===n.key))if(n.complete&&q.complete&&q.wallMs>0)paired.push({key:n.key,normalWallMs:n.wallMs,fastWallMs:q.wallMs,observedSpeedup:n.wallMs/q.wallMs,qaMultiplier:q.multiplier,normalRate:n.rate,fastRate:q.rate});
  const declaredShards=m.value.shards||Math.max(0,...[...shards.keys()].map(x=>+x.split('/')[1]));
  const missingShards=declaredShards?Array.from({length:declaredShards},(_,i)=>`${i}/${declaredShards}`).filter(id=>!shards.has(id)):[];
  const executionPartial=notRun.length>0||missingShards.length>0||startup.size>0||fatal.length>0||summaries.some(x=>x.value.executionStatus!=='COMPLETE');
  const timestamps=rawUnits.flatMap(r=>[r.startedAt,r.finishedAt]).filter(Boolean).sort();
  const report={schemaVersion:1,createdAt:new Date().toISOString(),kind:'RAW_PLAYER_AUDIT_AGGREGATION',generator:{file:fileURLToPath(import.meta.url),sha256:sha(fs.readFileSync(fileURLToPath(import.meta.url)))},
    declaration:'Counts preserve raw verdicts. Seek samples, native playback and independent visual/educational review are different evidence contracts. No raw FAIL or REVIEW is upgraded.',
    input:{artifacts,manifest:m.ref,inventory:inv.ref,inventoryHead:inv.value.head,inventoryUse:'UNIT_IDENTITY_AND_COVERAGE_ONLY_NOT_SOURCE_OR_QUALITY_PROOF'},
    binding:{sourceSha,sourceShas,manifestSha256:m.ref.sha256,observedManifestShas:manifestShas,externalRunIds:[...runIds],externalRunAttempts:[...runAttempts],externalRunBinding:runIds.size===1?'SINGLE_RECORDED_RUN':runIds.size>1?'MIXED':'UNAVAILABLE',external},
    integrity:{status:errors.length?'FAIL':'PASS',errors,warnings},
    status:errors.length?'INVALID_EVIDENCE':rawRows.FAIL?'FAIL':executionPartial?'INCOMPLETE':rawRows.REVIEW_REQUIRED?'REVIEW_REQUIRED':'PASS_AUTOMATED_CHECKS_ONLY',
    execution:{status:errors.length?'INVALID':executionPartial?'PARTIAL':'COMPLETE',summaries:receipts.length,shards:[...shards.keys()].sort(),missingShards,firstObservedAt:timestamps[0]||null,lastObservedAt:timestamps.at(-1)||null},
    raw:{rows:rowCount,unitStatuses:rawRows,assertionStatuses:assertions,unitsWithAssertionStatus:Object.fromEntries([...assertionUnits].map(([s,keys])=>[s,keys.size])),sampleCount,sampleMethods},
    coverage:{keyContract:'lab + scene + lessonIndex + viewport; gi included only when inventory explicitly provides it',expectedViewportUnits:expected.size,observedUniqueExpectedUnits:observed.size,notRunCount:notRun.length,notRun,duplicateNativeKeys:duplicates,unexpected},
    causes:groups,startupFailures:[...startup.values()],fatalExecutionFailures:fatal,
    playback:{wallAggregation:'SUM_OF_RECORDED_EXECUTION_WALL_MS_NOT_PARALLEL_JOB_ELAPSED',total:summarizeTraces(nativeExecutions),normal:summarizeTraces(normal),qa:summarizeTraces(fast),pairedWallTimeComparisons:paired,executions:nativeExecutions,otherRecordedMethods:otherContinuous},
    independentVisualEducationalQuality:'NOT_ASSESSED_BY_AGGREGATOR',ignored,receipts,rawUnits};
  return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),value=flag=>{const i=args.indexOf(flag);if(i<0||!args[i+1])throw Error(`Required ${flag}`);return args[i+1];};
  const out=path.resolve(value('--out'));
  const report=await aggregateAudit({artifacts:value('--artifacts'),manifest:value('--manifest'),inventory:value('--inventory')});
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:report.status,integrity:report.integrity.status,sourceSha:report.binding.sourceSha,rows:report.raw.rows,unitStatuses:report.raw.unitStatuses,assertionStatuses:report.raw.assertionStatuses,notRun:report.coverage.notRunCount,out}));
  process.exitCode=report.integrity.status==='FAIL'?2:report.status==='PASS_AUTOMATED_CHECKS_ONLY'?0:1;
}
