// Trusted offline evidence helper, NOT executed in any PR, registration, or Pages job.
// For actual Pages releases a checkout-based witness is INSUFFICIENT and must not
// be promoted to actualDeployed. The observer requires an uploaded-site witness.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const id=Number(process.env.GITHUB_RUN_ID),attempt=Number(process.env.GITHUB_RUN_ATTEMPT);
if(!Number.isSafeInteger(id)||id<1||!Number.isSafeInteger(attempt)||attempt<1)throw Error('run_id/run_attempt required');
if(process.env.GITHUB_EVENT_NAME==='pull_request')throw Error('PR code cannot write trusted evidence');
const target=process.argv[2];
if(!target)throw Error('Output directory required');
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:64*1024*1024}).trim();
const sourceSha=git('rev-parse','HEAD');
if(!/^[a-f0-9]{40}$/.test(sourceSha))throw Error('Invalid HEAD SHA');
const digest=arr=>crypto.createHash('sha256').update(arr.sort().join('\n')).digest('hex');
const rows=git('ls-tree','-r','-z','HEAD','--','archive/exams','archive/assets/images').split('\0');
const exams={};
for(const row of rows){
 const m=/^[0-7]{6} blob ([a-f0-9]{40})\t(.+)$/.exec(row);if(!m)continue;
 const f=m[2];
 if(f.startsWith('archive/exams/')&&f.endsWith('.js')){
  const e=exams[path.basename(f,'.js')]||={source:'',assets:''};e.source=m[1];
 }
 if(f.startsWith('archive/assets/images/')){
  const id=f.slice('archive/assets/images/'.length).split('/')[0];
  const e=exams[id]||={source:'',assets:''};(e._items||=[]).push(f+' '+m[1]);
 }
}
for(const e of Object.values(exams)){e.assets=digest(e._items||[]);delete e._items;}
const registryFiles=['archive/db.js','archive/question-index.js','archive/question-identity.js',
 'archive/question-index-report.md','archive/question-index-audit.md',
 'archive/data/archive2-catalog.json','archive/data/archive2-crosswalk-inventory.json',
 'archive/data/question_metadata.json',
 'archive/data/archive2-canonical-input-manifest.json','archive/data/archive2-canonical-projection-policy.json',
 'archive/data/archive2-item-review-overrides.json','archive/data/basic-scope-parent-links.json',
 ...git('ls-files','--','archive/data/meta-foundation/runtime').split('\n').filter(Boolean)];
const registry=digest(registryFiles.map(f=>f+' '+(git('ls-tree','HEAD','--',f).match(/blob ([a-f0-9]{40})/)?.[1]||'MISSING')));
fs.mkdirSync(target,{recursive:true});
const out=path.join(target,'progress-evidence-'+id+'-'+attempt+'.json');
fs.writeFileSync(out,JSON.stringify({schema:2,run_id:id,run_attempt:attempt,sourceSha,registry,exams,
 evidenceSource:'trusted-git-tree',actualDeployed:false}));
console.log(out);
