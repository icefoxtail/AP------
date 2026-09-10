import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),job='past-exam-v3-gold2-20260910-job-b-hanyeong-2023',base='archive/_generated/past-exams/'+job;
const sha=p=>'sha256:'+crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
if(execFileSync('git',['branch','--show-current'],{cwd:root,encoding:'utf8'}).trim()!=='codex/past-exam-v3-gold2-independent-20260910-job-b')throw Error('WRONG_BRANCH');
const binding=read(base+'/reports/job-evidence-binding.json');
for(const r of binding.refs){if(fs.statSync(r.path).size!==r.bytes||sha(r.path)!==r.sha256)throw Error('STALE_REF:'+r.path)}
const expected='sha256:c07a1c7a09ca2c7e7f5cf2ca2f242e23fb0fa32b7a81fad5951802f3d68af8bd';
if(sha(base+'/source/original.hwp')!==expected||sha('D:/기출/23,24 고1/2023년/2학기 기말고사/수학 하 (23 한영고 기말) 답X.hwp')!==expected)throw Error('SOURCE_CHANGED');
const statePath='alive/runtime/work-batches/'+job+'/state.json';
const state=read(statePath);if(state.workBatchId!==job||state.launches.length||state.freezes.length)throw Error('UNEXPECTED_RUNTIME_STATE');
const toolScript=base+'/tools/preserve-job-b.mjs';let txt=fs.readFileSync(toolScript,'utf8');txt=txt.replace("startedAt:'2026-09-10T03:15:00Z'","startedAt:null");fs.writeFileSync(toolScript,txt);
const reportFiles=fs.readdirSync(base+'/reports').filter(n=>n!=='deliverable-files.json').map(n=>base+'/reports/'+n);
const files=[base+'/.gitattributes','alive/runtime/work-batches/'+job+'/.gitattributes',base+'/JOB-B-REPORT.md',base+'/work-batch-spec.json',base+'/target-manifest.pending.json',...reportFiles,...['original.hwp','pyhwp.odt','pyhwp-html/index.xhtml','pyhwp-html/styles.css','pyhwp-html/bindata/BIN0001.bmp','pyhwp-html/bindata/BIN0002.bmp'].map(n=>base+'/source/'+n),...['convert-source.ps1','convert-source-with-module.ps1','preserve-job-b.mjs','finalize-hold-evidence.mjs','diagnose-pyhwp.py','stage-review-artifacts.mjs'].map(n=>base+'/tools/'+n),statePath];
const index={workBatchId:job,outcome:'HOLD',refCheck:'PASS_ALL_JOB_EVIDENCE_BINDING_REFS_CURRENT',sourceSha256:expected,files:files.map(p=>({path:p,bytes:fs.statSync(p).size,sha256:sha(p)})),excluded:['downloaded official module ZIP/DLL/source bundle (regenerable; provenance retained)','temporary .job-b-tools removed','caches/browser profiles/node_modules','all unrelated files'],selfHashPolicy:'This index is included in the commit but deliberately not hashed inside itself.'};
fs.writeFileSync(base+'/reports/deliverable-files.json',JSON.stringify(index,null,2)+'\n');
execFileSync('git',['add','-f','--',...files,base+'/reports/deliverable-files.json'],{cwd:root});
execFileSync('git',['add','--renormalize','--',...files,base+'/reports/deliverable-files.json'],{cwd:root});
for(const p of [...files,base+'/reports/deliverable-files.json']){const blob=execFileSync('git',['show',':'+p],{cwd:root,maxBuffer:8*1024*1024});if(!blob.equals(fs.readFileSync(p)))throw Error('GIT_RAW_BYTE_PARITY_FAIL:'+p);}
console.log(JSON.stringify({status:'STAGED_EXACT_JOB_B_ARTIFACTS',files:files.length+1,bytes:files.reduce((s,p)=>s+fs.statSync(p).size,0),sourceSha256:expected}));

