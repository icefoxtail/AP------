import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const run='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88';
const targetSpecs=[
 {examUid:'24_순천고_1학기_중간_고2_확률과통계',relative:'archive/exams/original/high/h2/1mid/24_순천고_1학기_중간_고2_확률과통계.js'},
 {examUid:'24_순천여고_1학기_중간_고2_수학I',relative:'archive/exams/original/high/h2/1mid/24_순천여고_1학기_중간_고2_수학I.js'},
 {examUid:'24_순천여고_1학기_중간_고2_확률과통계',relative:'archive/exams/original/high/h2/1mid/24_순천여고_1학기_중간_고2_확률과통계.js'},
];
const registryPaths=['archive/db.js','archive/data/question_identity_map.json','archive/data/question_metadata.json','archive/question-identity.js','archive/question-index.js','archive/question-index-report.md','archive/question-index-audit.md','archive/data/archive2-catalog.json','archive/data/archive2-canonical-input-manifest.json'];
const codePaths=['archive/archive2-core.js','archive/problem-bank-meta.js','archive/problem-bank-search.html','archive/generated-bank.html','archive/workspace.html','archive/tools/build-archive2-catalog.mjs','archive/tools/prepare-existing-target-registration-update.mjs','archive/tools/prepare-target-registration-candidate.mjs','archive/tools/register-existing-target-exam-update.mjs','archive/tools/question-only-replacement-v2.mjs','archive/tools/review-evidence-gate.mjs'];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const canonical=value=>JSON.stringify(stable(value));
function stable(value){return Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])])):value;}
const hashJson=o=>sha(Buffer.from(canonical(o),'utf8'));
const readJson=rel=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8').replace(/^\uFEFF/,''));
const srcs=[];const assetMap=new Map();
for(const t of targetSpecs){const bytes=fs.readFileSync(path.join(root,t.relative));const box={window:{}};vm.runInNewContext(bytes.toString('utf8'),box,{filename:t.relative,timeout:5000});const bank=box.window.questionBank||box.window.questions;if(!Array.isArray(bank))throw new Error('SOURCE_BANK_MISSING:'+t.examUid);const refs=new Set();for(const q of bank){for(const value of [q.image,q.solutionImage])if(typeof value==='string'&&value.startsWith('assets/'))refs.add(value);for(const field of ['content','solution'])for(const m of String(q[field]||'').matchAll(/(?:src|href)=["'](assets\/[^"']+)["']/gi))refs.add(m[1]);}for(const ref of refs){const assetPath=`archive/${ref}`,assetBytes=fs.readFileSync(path.join(root,assetPath));assetMap.set(assetPath,{path:assetPath,sha256:sha(assetBytes),size:assetBytes.length});}srcs.push({examUid:t.examUid,path:t.relative,rawSha256:sha(bytes),gitBlobSha1:execFileSync('git',['-C',root,'hash-object',t.relative],{encoding:'utf8'}).trim(),questionCount:bank.length});}
const status=execFileSync('git',['-C',root,'status','--porcelain=v1','-z','--untracked-files=all'],{encoding:'utf8',maxBuffer:64*1024*1024});
const changedStatusPaths=[];const tokens=status.split('\0');for(let i=0;i<tokens.length;i++){const entry=tokens[i];if(!entry)continue;const p=entry.slice(3).replaceAll('\\','/');if(p&&!p.startsWith('..'))changedStatusPaths.push(p);if(/^R|^C/.test(entry.slice(0,2)))i++;}
const targetPathSet=new Set();for(const p of changedStatusPaths){if(p.startsWith('archive/assets/images/24_순천고_1학기_중간_고2_확률과통계/')||p.startsWith('archive/assets/images/24_순천여고_1학기_중간_고2_수학I/')||p.startsWith('archive/assets/images/24_순천여고_1학기_중간_고2_확률과통계/'))targetPathSet.add(p);if(srcs.some(s=>s.path===p)||registryPaths.includes(p)||codePaths.includes(p))targetPathSet.add(p);}
if(!targetPathSet.size)throw new Error('PUBLICATION_TARGET_PATHS_EMPTY');
const changedPaths=[...targetPathSet].sort();
const baselineFiles=registryPaths.map(p=>{const bytes=execFileSync('git',['-C',root,'show',`origin/main:${p}`],{maxBuffer:128*1024*1024});return {path:p,sha256:sha(bytes),gitBlobSha1:execFileSync('git',['-C',root,'rev-parse',`origin/main:${p}`],{encoding:'utf8'}).trim()};});
const rootCheckpointOutputs=new Set([`${run}/registration/publication-binding.json`,`${run}/registration/sourceonly-batch-proof-index.json`,`${run}/registration/publication-checks.json`,`${run}/registration/publication-checks.build.stdout.json`,`${run}/registration/publication-checks.build.stderr.txt`,`${run}/registration/publication-binding.build.stdout.json`,`${run}/registration/publication-binding.build.stderr.txt`]);
const proofPaths=[...new Set(changedStatusPaths.filter(p=>p.startsWith('archive/analysis/')).filter(p=>!p.includes('/candidate-root')&&!p.includes('/registration-catalog-build')&&!rootCheckpointOutputs.has(p)&&!p.includes('/registration/publication-checkpoint')))].sort();
const proofFiles=proofPaths.map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(root,p))),size:fs.statSync(path.join(root,p)).size}));
const proofIndex={schemaVersion:'ROOT_SOURCEONLY_BATCH_PROOF_INDEX_V1',runId:'codex-sourceonly-h2-1mid-20261010-b2-eb572b88',createdAt:new Date().toISOString(),files:proofFiles,proofsSha256:hashJson(proofFiles)};
const proofIndexPath=`${run}/registration/sourceonly-batch-proof-index.json`;fs.writeFileSync(path.join(root,proofIndexPath),JSON.stringify(proofIndex,null,2)+'\n');
const sourceSha256=hashJson(srcs),assets=[...assetMap.values()].sort((a,b)=>a.path.localeCompare(b.path,'en')),assetsSha256=hashJson(assets),baselineSha256=hashJson(baselineFiles),mainSha=execFileSync('git',['-C',root,'rev-parse','origin/main'],{encoding:'utf8'}).trim();
const changedProductFiles=changedPaths.map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(root,p))),size:fs.statSync(path.join(root,p)).size}));
const changedProductFilesSha256=hashJson(changedProductFiles);
const binding={schemaVersion:'ROOT_ARCHIVE_PUBLICATION_BINDING_V1',runId:'codex-sourceonly-h2-1mid-20261010-b2-eb572b88',mainSha,sourceSha256,proofsSha256:proofIndex.proofsSha256,proofIndexPath,proofIndexSha256:sha(fs.readFileSync(path.join(root,proofIndexPath))),assetsSha256,baselineSha256,changedProductFilesSha256,changedProductFiles,changedPaths,targetPaths:changedPaths,targets:srcs,assets,baselineRegistry:baselineFiles};
const bindingPath=`${run}/registration/publication-binding.json`;fs.writeFileSync(path.join(root,bindingPath),JSON.stringify(binding,null,2)+'\n');
console.log(JSON.stringify({status:'BINDING_READY',path:bindingPath,bindingSha256:hashJson(binding),mainSha,sourceSha256,proofsSha256:proofIndex.proofsSha256,proofFileCount:proofFiles.length,assetsSha256,assetCount:assets.length,baselineSha256,changedProductFilesSha256,changedPathCount:changedPaths.length,targetPaths:changedPaths,proofIndexSha256:binding.proofIndexSha256},null,2));
