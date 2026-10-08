import fs from 'node:fs';import path from 'node:path';import {execFileSync,spawnSync} from 'node:child_process';
import {sha256,physical,writeFresh} from '../../../tools/archive-codex-artifact-io.mjs';
import {makePublicationCheckpoint,recordPublicationEvent,publicationBindingSha256} from '../../../tools/archive-publication-checkpoint.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',uid='26_복성고_1학기_중간_고1_기출',base=path.join(root,'archive/analysis',run,uid);
const relative=p=>path.relative(root,p).replaceAll('\\','/');
const closeoutPath=path.join(base,'registration-postapply-bridge-05/ROOT.registration-postapply-closeout.final.json');
if(physical(closeoutPath).sha256!=='fc18817825f086db3b888439d2174dd2cb2ff82a84c7c85e7c05d922ee814dc6')throw Error('REGISTRATION_CLOSEOUT_DRIFT');
const closeout=JSON.parse(fs.readFileSync(closeoutPath));
if(closeout.status!=='REGISTRATION_VALIDATORS_PASS_AWAITING_ROOT_PUBLICATION')throw Error('REGISTRATION_NOT_READY');
for(const ref of [...closeout.registryFiles,...closeout.assets,closeout.promotion,
 closeout.r1.evidence,closeout.r1.validator,closeout.r2.event,closeout.r3.event,closeout.r3.render])
 if(physical(ref.path).sha256!==ref.sha256)throw Error('CLOSEOUT_FILE_DRIFT:'+ref.path);
if(physical(closeout.source.path).sha256!==closeout.source.rawSha256)throw Error('SOURCE_DRIFT');
const exact=[relative(closeout.source.path),...closeout.assets.map(a=>relative(a.path)),...closeout.registryFiles.map(a=>a.relativePath),'archive/analysis/'+run+'/'+uid];
if(execFileSync('git',['diff','--cached','--name-only']).length)throw Error('INITIAL_INDEX_NOT_EMPTY');
execFileSync('git',['add','--',...exact]);
const staged=execFileSync('git',['diff','--cached','--name-only','-z']).toString('utf8').split('\0').filter(Boolean);
const allowed=new Set(exact);for(const p of staged)if(!allowed.has(p)&&!p.startsWith('archive/analysis/'+run+'/'+uid+'/'))throw Error('NON_TARGET_STAGED:'+p);
const binding={sourceSha256:closeout.source.rawSha256,proofsSha256:physical(closeoutPath).sha256,
 assetsSha256:sha256(Buffer.from(JSON.stringify(closeout.assets))),baselineSha256:sha256(Buffer.from(JSON.stringify(closeout.registryFiles))),
 mainSha:execFileSync('git',['rev-parse','origin/main'],{encoding:'utf8'}).trim(),changedPaths:staged,targetPaths:staged};
const checkpoint=makePublicationCheckpoint({phase:'INPUTS_BOUND',binding,completedPhases:['INPUTS_BOUND']});
writeFresh(path.join(base,'ROOT.publication.binding.json'),binding);writeFresh(path.join(base,'ROOT.publication.checkpoint.inputs.json'),checkpoint);
const checkDir=path.join(base,'publication-checks');fs.mkdirSync(checkDir,{recursive:true});
const result=spawnSync(process.execPath,['tools/archive/check-exam-workspace-policy.mjs','--staged'],{cwd:root,maxBuffer:64*1024*1024});
if(result.error)throw result.error;
fs.writeFileSync(path.join(checkDir,'workspace-policy.stdout.bin'),result.stdout);fs.writeFileSync(path.join(checkDir,'workspace-policy.stderr.bin'),result.stderr);
const checks=[{name:'workspace-policy',command:'node tools/archive/check-exam-workspace-policy.mjs --staged',status:'completed',exitCode:result.status,
 bindingSha256:publicationBindingSha256(binding),stdoutSha256:sha256(result.stdout),stderrSha256:sha256(result.stderr)}];
for(const name of ['catalogCheck','registrationParity','identityTests']){
 const ref=closeout.validators[name];if(closeout.validators[name+'Disposition']!=='PASS'||physical(ref.path).sha256!==ref.sha256)throw Error('VALIDATOR_PROOF_REQUIRED:'+name);
 const report=JSON.parse(fs.readFileSync(ref.path));
 if(report.exitCode!==0)throw Error('VALIDATOR_EXIT_FAILED:'+name);
 checks.push({name,command:report.command,status:'completed',exitCode:0,bindingSha256:publicationBindingSha256(binding),
 stdoutSha256:report.stdoutSha256,stderrSha256:report.stderrSha256,proof:relative(ref.path),
 reuseBasis:'Exact source/assets/nine registry bytes unchanged since this current-bound successful validator.'});
}
const audit=staged.map(p=>{const oid=execFileSync('git',['rev-parse',':'+p],{encoding:'utf8'}).trim(),bytes=execFileSync('git',['cat-file','blob',oid],{maxBuffer:128*1024*1024});
 const raw=physical(path.join(root,p)).sha256;if(sha256(bytes)!==raw)throw Error('INDEX_BYTES_MISMATCH:'+p);return {path:p,gitBlobSha1:oid,rawSha256:raw};});
writeFresh(path.join(base,'ROOT.staged-byte-audit.json'),{status:'PASS',files:audit});
writeFresh(path.join(base,'ROOT.publication.checks.json'),checks);
if(checks.some(c=>c.exitCode!==0))throw Error('PUBLICATION_CHECK_FAILED');
writeFresh(path.join(base,'ROOT.publication.checkpoint.ready.json'),recordPublicationEvent({checkpoint,binding,event:'checks',checks}));
execFileSync('git',['add','--','archive/analysis/'+run+'/'+uid]);
console.log(JSON.stringify({status:'COMMIT_READY',sourceSha256:binding.sourceSha256,stagedCount:staged.length,checkCount:checks.length,bindingSha256:publicationBindingSha256(binding)}));
