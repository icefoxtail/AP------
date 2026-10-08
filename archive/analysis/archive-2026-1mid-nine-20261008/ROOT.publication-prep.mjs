import fs from 'node:fs';import path from 'node:path';import {execFileSync,spawnSync} from 'node:child_process';
import {sha256,physical,writeFresh,inside} from '../../tools/archive-codex-artifact-io.mjs';
import {makePublicationCheckpoint,recordPublicationEvent,publicationBindingSha256} from '../../tools/archive-publication-checkpoint.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',runBase=path.join(root,'archive/analysis',run);
const roster=JSON.parse(fs.readFileSync(path.join(runBase,'roster.json')));
const row=roster.find(r=>r.examUid===process.argv[2]||String(r.rosterIndex+1)===process.argv[2]);
if(!row)throw Error('LOCKED_ROSTER_TARGET_REQUIRED');
const uid=row.examUid,base=row.evidenceRootAbsolute,relative=p=>path.relative(root,p).replaceAll('\\','/');
const closeoutPath=inside(root,process.argv[3]),expectedHash=process.argv[4],isRebase=['--rebase','--rebase-resume'].includes(process.argv[5]),isResume=['--resume','--rebase-resume'].includes(process.argv[5]);
if(!expectedHash||physical(closeoutPath).sha256!==expectedHash)throw Error('CURRENT_CLOSEOUT_HASH_REQUIRED');
const closeout=JSON.parse(fs.readFileSync(closeoutPath));
const allowedStatus=isRebase?'WORKTREE_REGISTRY_RECONSTRUCTED_VALIDATORS_PASS_AWAITING_ROOT_REBASE_CONTINUE':'REGISTRATION_VALIDATORS_PASS_AWAITING_ROOT_PUBLICATION';
if(closeout.examUid!==uid||closeout.status!==allowedStatus)throw Error('CURRENT_TARGET_CLOSEOUT_REQUIRED');
if(isRebase&&(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==closeout.baseHead||execFileSync('git',['rev-parse','REBASE_HEAD'],{encoding:'utf8'}).trim()!==closeout.replayedCommit))throw Error('PINNED_REBASE_STATE_REQUIRED');
const registryNames=['archive/db.js','archive/data/question_identity_map.json','archive/data/question_metadata.json',
 'archive/question-identity.js','archive/question-index.js','archive/question-index-report.md',
 'archive/question-index-audit.md','archive/data/archive2-catalog.json','archive/data/archive2-canonical-input-manifest.json'];
const registry=closeout.registryFiles.map(r=>({path:inside(root,r.path),relativePath:r.relativePath||relative(inside(root,r.path)),sha256:r.finalSha256||r.finalWorktreeRawSha256||r.currentWitness?.sha256||r.sha256}));
if(JSON.stringify(registry.map(r=>r.relativePath).sort())!==JSON.stringify([...registryNames].sort()))throw Error('EXACT_NINE_REGISTRY_SCOPE_REQUIRED');
const checkRef=r=>{if(!r?.path||!r.sha256||physical(inside(root,r.path)).sha256!==r.sha256)throw Error('BOUND_FILE_DRIFT:'+r?.path);};
const historicalWitnessRebindings=[];
const walkRefs=v=>{if(!v||typeof v!=='object')return;if(v.path&&v.sha256){
 const current=physical(inside(root,v.path));
 if(current.sha256===v.sha256)checkRef(v);
 else{
  const historical=closeout.registryFiles.find(r=>inside(root,r.path)===inside(root,v.path)
   &&r.afterApplyStateClassification==='HISTORICAL_FILE_STATE_NOT_CURRENT_WITNESS'
   &&r.afterApplySha256===v.sha256&&r.afterApplySnapshot?.sha256===v.sha256);
  if(!historical)throw Error('BOUND_FILE_DRIFT:'+v.path);
  checkRef(historical.afterApplySnapshot);
  historicalWitnessRebindings.push({originalFilePath:v.path,historicalSha256:v.sha256,
   immutableSnapshot:historical.afterApplySnapshot,currentFileSha256:current.sha256,
   classification:'VERIFIED_HISTORICAL_FILE_STATE_NOT_CURRENT_WITNESS'});
 }
}for(const x of Object.values(v))walkRefs(x);};
walkRefs(closeout);registry.forEach(checkRef);
const assets=closeout.assets.map(a=>({path:inside(root,a.path),sha256:a.sha256||a.rawSha256}));assets.forEach(checkRef);
const renderImpact=isRebase?{path:inside(root,process.argv[6]),sha256:process.argv[7]}:null;if(renderImpact)checkRef(renderImpact);
const sourcePath=inside(root,closeout.source.path);
const sourceRawSha256=closeout.source.rawSha256||closeout.source.sha256;
if(sourcePath!==inside(root,row.productionRelativePath)||physical(sourcePath).sha256!==sourceRawSha256)throw Error('PRODUCTION_SOURCE_DRIFT');
const stageBindings=closeout.stageBindings||closeout.proofBindings;
const proofs=[];
const collectPhysicalRefs=v=>{if(!v||typeof v!=='object')return;if(v.path&&v.sha256){proofs.push(v);return;}for(const x of Object.values(v))collectPhysicalRefs(x);};
if(stageBindings){for(const stage of ['R1','R2','R3'])if(!stageBindings[stage])throw Error('FINAL_STAGE_BINDING_REQUIRED:'+stage);collectPhysicalRefs(stageBindings);}
else proofs.push(closeout.r1.evidence,closeout.r1.validator,closeout.r2.event,closeout.r3.event,closeout.r3.render);
proofs.forEach(checkRef);
const exact=[row.productionRelativePath,...closeout.assets.map(a=>relative(inside(root,a.path))),...registryNames,'archive/analysis/'+run+'/'+uid];
if(!isRebase&&!isResume&&execFileSync('git',['diff','--cached','--name-only']).length)throw Error('INITIAL_INDEX_NOT_EMPTY');
execFileSync('git',['add','--',...exact]);
const staged=execFileSync('git',['diff','--cached','--name-only','-z']).toString('utf8').split('\0').filter(Boolean),allowed=new Set(exact);
for(const p of staged)if(!allowed.has(p)&&!p.startsWith('archive/analysis/'+run+'/'+uid+'/'))throw Error('NON_TARGET_STAGED:'+p);
const binding={sourceSha256:sourceRawSha256,proofsSha256:renderImpact?sha256(Buffer.from(JSON.stringify({closeoutHash:expectedHash,renderImpact}))):expectedHash,
 assetsSha256:sha256(Buffer.from(JSON.stringify(closeout.assets))),baselineSha256:sha256(Buffer.from(JSON.stringify(registry))),
 mainSha:execFileSync('git',['rev-parse','origin/main'],{encoding:'utf8'}).trim(),changedPaths:staged,targetPaths:staged};
const checkpoint=makePublicationCheckpoint({phase:'INPUTS_BOUND',binding,completedPhases:['INPUTS_BOUND']});
const attemptSuffix=isResume?'retry-'+new Date().toISOString().replaceAll(/[:.]/g,'-'):null;
const prefix=isRebase?(isResume?'ROOT.publication.rebase.'+attemptSuffix+'.':'ROOT.publication.rebase.'):isResume?'ROOT.publication.'+attemptSuffix+'.':'ROOT.publication.';
writeFresh(path.join(base,prefix+'binding.json'),binding);writeFresh(path.join(base,prefix+'checkpoint.inputs.json'),checkpoint);
if(historicalWitnessRebindings.length)writeFresh(path.join(base,prefix+'historical-state-witnesses.json'),historicalWitnessRebindings);
const checkDir=path.join(base,isRebase?(isResume?'publication-rebase-checks-'+attemptSuffix:'publication-rebase-checks'):isResume?'publication-checks-'+attemptSuffix:'publication-checks');fs.mkdirSync(checkDir,{recursive:true});
const result=spawnSync(process.execPath,['tools/archive/check-exam-workspace-policy.mjs','--staged'],{cwd:root,maxBuffer:64*1024*1024});
if(result.error)throw result.error;
fs.writeFileSync(path.join(checkDir,'workspace-policy.stdout.bin'),result.stdout);fs.writeFileSync(path.join(checkDir,'workspace-policy.stderr.bin'),result.stderr);
const checks=[{name:'workspace-policy',command:'node tools/archive/check-exam-workspace-policy.mjs --staged',status:'completed',exitCode:result.status,
 bindingSha256:publicationBindingSha256(binding),stdoutSha256:sha256(result.stdout),stderrSha256:sha256(result.stderr)}];
const groups=[['postcopyCatalog','canonicalCatalogCheck','catalogCheckFinal','catalogCheck'],['postcopyRegistration','registrationParityFinal','registrationParity'],['postcopyIdentity','identityRuntimeTestsFinal','identityRuntimeTests','identityTests','identityRuntime']];
for(const choices of groups){
 const name=choices.find(n=>closeout.validators[n]),entry=closeout.validators[name];
 if(!entry)throw Error('CURRENT_VALIDATOR_REQUIRED:'+choices.join('/'));
 const ref={...entry,path:entry.path||entry.reportPath||entry.resultPath,sha256:entry.sha256||entry.reportSha256||entry.resultSha256};checkRef(ref);
 if(entry.inputFiles)entry.inputFiles.forEach(checkRef);
 const report=JSON.parse(fs.readFileSync(inside(root,ref.path)));
 const dispositions=[report.disposition,report.status,ref.disposition,ref.status,closeout.validators[name+'Disposition']].filter(v=>v==='PASS'||v==='FAIL');
 if(report.exitCode!==0||!dispositions.includes('PASS')||dispositions.includes('FAIL'))throw Error('VALIDATOR_NOT_PASS:'+name);
 const out=report.stdout||ref.stdout||{path:report.stdoutPath,sha256:report.stdoutSha256};
 const err=report.stderr||ref.stderr||{path:report.stderrPath,sha256:report.stderrSha256};checkRef(out);checkRef(err);
 const executedCommand=report.command||ref.command;
 checks.push({name,command:Array.isArray(executedCommand)?executedCommand.join(' '):executedCommand,status:'completed',exitCode:0,bindingSha256:publicationBindingSha256(binding),
 stdoutSha256:out.sha256,stderrSha256:err.sha256,proof:relative(inside(root,ref.path)),
 reuseBasis:'Exact source/assets/nine registry bytes unchanged since this current-bound successful validator.'});
}
const index=execFileSync('git',['ls-files','--stage','-z'],{maxBuffer:64*1024*1024}).toString('utf8').split('\0').filter(Boolean);
const oidByPath=new Map(index.map(line=>{const m=line.match(/^\d+ ([0-9a-f]{40}) 0\t(.+)$/s);if(!m)throw Error('UNMERGED_INDEX');return[m[2],m[1]];}));
const oids=staged.map(p=>{const oid=oidByPath.get(p);if(!oid)throw Error('INDEX_OID_MISSING:'+p);return oid;});
const groupsForAudit=[];let group=[],groupBytes=0;
for(let i=0;i<staged.length;i++){const bytes=fs.statSync(path.join(root,staged[i])).size+128;if(group.length&&groupBytes+bytes>64*1024*1024){groupsForAudit.push(group);group=[];groupBytes=0;}group.push(i);groupBytes+=bytes;}
if(group.length)groupsForAudit.push(group);const audit=[];
for(const indices of groupsForAudit){
 const batch=execFileSync('git',['cat-file','--batch'],{input:indices.map(i=>oids[i]).join('\n')+'\n',maxBuffer:256*1024*1024});let offset=0;
 for(const i of indices){const p=staged[i],end=batch.indexOf(10,offset),m=batch.subarray(offset,end).toString('utf8').match(/^([0-9a-f]{40}) blob (\d+)$/);
  if(!m||m[1]!==oids[i])throw Error('INDEX_BATCH_HEADER_INVALID');const size=Number(m[2]),bytes=batch.subarray(end+1,end+1+size);offset=end+1+size+1;
  const raw=physical(path.join(root,p)).sha256;if(sha256(bytes)!==raw)throw Error('INDEX_BYTES_MISMATCH:'+p);audit.push({path:p,gitBlobSha1:oids[i],rawSha256:raw});
 }if(offset!==batch.length)throw Error('INDEX_BATCH_TRAILING_DATA');
}
const auditName=isRebase?(isResume?'ROOT.staged-byte-audit.rebase.'+attemptSuffix+'.json':'ROOT.staged-byte-audit.rebase.json'):isResume?'ROOT.staged-byte-audit.'+attemptSuffix+'.json':'ROOT.staged-byte-audit.json';
writeFresh(path.join(base,auditName),{status:'PASS',files:audit,batches:groupsForAudit.length});
writeFresh(path.join(base,prefix+'checks.json'),checks);
if(checks.some(c=>c.exitCode!==0))throw Error('PUBLICATION_CHECK_FAILED');
writeFresh(path.join(base,prefix+'checkpoint.ready.json'),recordPublicationEvent({checkpoint,binding,event:'checks',checks}));
execFileSync('git',['add','--','archive/analysis/'+run+'/'+uid]);
console.log(JSON.stringify({status:'COMMIT_READY',examUid:uid,stagedCount:staged.length,checkCount:checks.length,bindingSha256:publicationBindingSha256(binding)}));
