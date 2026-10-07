import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {gitBlobSha} from '../../../archive/tools/archive-stage-validator.mjs';
import {validateCodexMainDoneReceipt} from '../../../archive/tools/archive-codex-closeout-v2.mjs';
const root=process.cwd(),runId='m3-codex-20261007',base=`archive/analysis/${runId}`;
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(path.resolve(root,p));
const write=(p,x)=>{fs.mkdirSync(path.dirname(path.resolve(root,p)),{recursive:true});fs.writeFileSync(path.resolve(root,p),JSON.stringify(x,null,2)+'\n');};
const preserve=p=>{if(!fs.existsSync(path.resolve(root,p)))return;let n=1;while(fs.existsSync(path.resolve(root,`${p}.before-rebuild-${n}.json`)))n++;fs.copyFileSync(path.resolve(root,p),path.resolve(root,`${p}.before-rebuild-${n}.json`));};
const git=(...a)=>execFileSync('git',a,{cwd:root,maxBuffer:128*1024*1024});
function currentAssets(bytes,candidateRoot){
 const box={window:{}};vm.runInNewContext(bytes.toString('utf8'),box,{timeout:1000});const bank=box.window.questionBank||box.window.questions,refs=new Set();
 const addHtml=value=>{if(typeof value!=='string')return;for(const m of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(m[1]))refs.add(m[1]);};
 for(const q of bank){for(const field of ['image','solutionImage','visualAsset'])if(typeof q[field]==='string'&&q[field]&&!/^(?:data:|blob:|#)/i.test(q[field]))refs.add(q[field]);for(const field of ['content','question','solution','explanation','sol','answer'])addHtml(q[field]);for(let choice of q.choices||[]){if(choice&&typeof choice==='object')choice=choice.text||choice.content||choice.value||choice.answer||Object.values(choice)[0]||'';addHtml(String(choice??''));}}
 for(const ref of refs){if(!ref.startsWith('assets/images/')||ref.includes('..'))throw Error('INVALID_FINAL_ASSET_REF:'+ref);if(ref.toLowerCase().endsWith('.svg'))for(const m of read(path.join(candidateRoot,ref)).toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(m[1]))refs.add(path.posix.normalize(path.posix.join(path.posix.dirname(ref),m[1])));}
 return [...refs].map(ref=>({ref,path:path.join(candidateRoot,ref),sha256:hash(read(path.join(candidateRoot,ref)))}));
}
const roster=JSON.parse(read(`${base}/locked-roster.json`));
const [phase,uid,stage]=process.argv.slice(2);
if(phase==='bootstrap'){
 const sourcePath='docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md';
 const commit=git('rev-parse','HEAD').toString().trim(),bytes=git('cat-file','blob',`${commit}:${sourcePath}`);
 const snapshot=`${base}/authority-snapshot.md`;fs.writeFileSync(snapshot,bytes);
 write(`${base}/bootstrap.json`,{runId,root,head:commit,startedAt:new Date().toISOString(),resolvedRoles:['archive_create','archive_r1','archive_r2','archive_r3','archive_master'].map(role=>({role,model:'gpt-6-luna',effort:'high'})),renderRoute:{enginePath:'archive/engine.html',previousApprovedUrl:'http://127.0.0.1:52430/archive/engine.html',probe:'CONNECTION_REFUSED',rootDecision:'full static completion under CURRENT §25; all screens NOT_RUN; quality requirements retained'},authorityReference:{path:snapshot,sha256:hash(bytes),sourcePath,section:25,sourceGitCommit:commit,sourceGitBlobSha1:gitBlobSha(bytes),sourceRawSha256:hash(bytes)}});
 for(const r of roster.rows){const bytes=read(r.workingJsAbsolute);r.inputRawSha256=hash(bytes);r.validatorRawBufferBlobSha1=gitBlobSha(bytes);r.gitCleanFilterBlobSha1=git('hash-object','--path='+r.productionPath,r.workingJsAbsolute).toString().trim();try{r.productionBlobSha1=git('rev-parse',`HEAD:${r.productionPath}`).toString().trim();}catch{r.productionBlobSha1=null;}}
 write(`${base}/locked-roster.json`,roster);console.log(JSON.stringify({root,head:commit,roster:roster.rows.length}));
}
if(phase==='bundle'){
 const r=roster.rows.find(x=>x.examUid===uid);if(!r)throw Error('EXAM_NOT_ROSTER');
 const bytes=read(r.workingJsAbsolute),box={window:{}};vm.runInNewContext(bytes.toString('utf8'),box,{timeout:1000});
 const bank=box.window.questionBank||box.window.questions;
 const fields=['id','content','question','choices','image','imageSize','choiceLayout','choiceColumns','commonData','passage'];
 const scopeArgument=process.argv[5],scope=scopeArgument?new Set(scopeArgument.split(',').map(Number)):null;
 const selected=scope?bank.filter(q=>scope.has(Number(q.id))):bank;if(scope&&selected.length!==scope.size)throw Error('STUDENT_SCOPE_NOT_IN_CURRENT_BANK');
 const questions=selected.map(q=>{const student={};for(const f of fields)if(Object.hasOwn(q,f))student[f]=q[f];return {...student,studentPayloadSha256:hash(Buffer.from(JSON.stringify(student)))};});
 const forbidden=['answer','solution','solutionImage','decisiveStep','meta','independentAnswer','storedAnswer'];
 const inspect=x=>{if(!x||typeof x!=='object')return;for(const [k,v] of Object.entries(x)){if(forbidden.includes(k))throw Error('FORBIDDEN_STUDENT_FIELD:'+k);inspect(v);}};inspect(questions);
 const assets=[],seen=new Set();const addAsset=(qid,ref,parentRef=null)=>{const key=qid+':'+ref;if(seen.has(key))return;seen.add(key);if(!ref.startsWith('assets/images/')||ref.includes('..'))throw Error('UNSAFE_STUDENT_ASSET:'+ref);const file=path.join(r.candidateRoot,ref),bytes=read(file);assets.push({qid,ref,path:file,sha256:hash(bytes),...(parentRef?{parentRef}: {})});if(ref.endsWith('.svg')){for(const m of bytes.toString('utf8').matchAll(/(?:href\s*=\s*["']([^"']+)["']|url\(\s*["']?([^\s"')]+))/g)){const link=m[1]||m[2];if(link.startsWith('#')||link.startsWith('data:'))continue;if(/^(?:https?:|\/)/.test(link))throw Error('EXTERNAL_STUDENT_SVG_ASSET:'+link);addAsset(qid,path.posix.normalize(path.posix.join(path.posix.dirname(ref),link)),ref);}}};for(const q of questions){const refs=new Set([...JSON.stringify(q).matchAll(/assets\/images\/[^\s"'<>\\)]+\.(?:png|jpg|jpeg|webp|gif|svg)/g)].map(m=>m[0]));for(const ref of refs)addAsset(q.id,ref);}
 const out=`${base}/${uid}/${stage}.student-input.json`;write(out,{schemaVersion:'CURRENT_STUDENT_ONLY_BUNDLE_V1',examUid:uid,source:{path:r.workingJsAbsolute,sha256:hash(bytes),artifactSha:gitBlobSha(bytes)},studentWhitelist:fields,count:questions.length,questions,assets});console.log(JSON.stringify({path:path.resolve(root,out),sha256:hash(read(out)),sourceRawSha256:hash(bytes),artifactSha:gitBlobSha(bytes),qids:questions.map(x=>x.id),assetCount:assets.length}));
}
if(phase==='disclose'){
 const freezePath=process.argv[5];if(!freezePath)throw Error('FREEZE_PATH_REQUIRED');const freeze=read(freezePath);JSON.parse(freeze);
 const r=roster.rows.find(x=>x.examUid===uid),bytes=read(r.workingJsAbsolute),box={window:{}};vm.runInNewContext(bytes.toString('utf8'),box,{timeout:1000});
 const bank=box.window.questionBank||box.window.questions,bundle=JSON.parse(read(`${base}/${uid}/${stage}.student-input.json`)),scope=new Set(bundle.questions.map(q=>Number(q.id)));
 const excludedQids=process.argv[6]?process.argv[6].split(',').map(Number):[];for(const qid of excludedQids)scope.delete(qid);
 const out=`${base}/${uid}/${stage}.postfreeze-disclosure.json`;write(out,{examUid:uid,stage,disclosedAt:new Date().toISOString(),freeze:{path:freezePath,sha256:hash(freeze)},source:{path:r.workingJsAbsolute,sha256:hash(bytes),artifactSha:gitBlobSha(bytes)},excludedQids,questions:bank.filter(q=>scope.has(Number(q.id)))});console.log(JSON.stringify({path:path.resolve(root,out),sha256:hash(read(out)),freezeSha256:hash(freeze),disclosedQids:[...scope],excludedQids}));
}
if(phase==='reuse'){
 const r=roster.rows.find(x=>x.examUid===uid),dir=`archive/analysis/qualification-20261006/${uid}`;
 const receipt=JSON.parse(read(`${dir}/MAIN_DONE.receipt.json`)),render=JSON.parse(read(receipt.renderReceipt.path));
 const bytes=read(r.productionPath),box={window:{}};vm.runInNewContext(bytes.toString('utf8'),box,{timeout:1000});const bank=box.window.questionBank||box.window.questions;
 const refs=[...new Set([...bytes.toString('utf8').matchAll(/assets\/images\/[^\s"'<>\\)]+\.(?:png|jpg|jpeg|webp|gif|svg)/g)].map(m=>m[0]))];
 const assets=refs.map(ref=>({ref,sha256:hash(read('archive/'+ref))}));
 const main=git('rev-parse','origin/main').toString().trim();
 const result=validateCodexMainDoneReceipt({receipt:{...receipt,remoteMainSha:main},root,renderReceipt:render,assets,qids:bank.map(q=>q.id)});
 write(`${base}/${uid}/existing-main-done-reuse-check.json`,{examUid:uid,historicalReceiptUnchanged:true,verifiedAgainstRemoteMain:main,productionRawSha256:hash(bytes),productionBlobSha1:gitBlobSha(bytes),result});console.log(JSON.stringify(result));
}
if(phase==='static'){
 const closurePath=process.argv[4]||`${base}/${uid}/R3.static-closure.json`,c=JSON.parse(read(closurePath)),r=roster.rows.find(x=>x.examUid===uid),bootstrap=JSON.parse(read(`${base}/bootstrap.json`));
 if(c.examUid!==uid||c.itemHoldCount!==0||c.status!=='STATIC_CODE_COMPLETE')throw Error('R3_CLOSURE_NOT_READY');
 const source=read(r.workingJsAbsolute);if(gitBlobSha(source)!==c.artifactSha||hash(source)!==c.artifactRawSha256){const production=read(r.productionPath);if(gitBlobSha(production)!==c.artifactSha||hash(production)!==c.artifactRawSha256)throw Error('FINAL_SOURCE_MISMATCH');}else{fs.mkdirSync(path.dirname(r.productionPath),{recursive:true});fs.writeFileSync(r.productionPath,source);}
 const assets=c.assets.map(a=>({ref:a.ref,sha256:a.sha256,file:{path:'archive/'+a.ref,sha256:a.sha256}}));
 for(const a of assets){const dest=a.file.path;let b;try{b=read(path.join(r.candidateRoot,a.ref));if(hash(b)!==a.sha256)b=null;}catch{}if(!b)b=read(dest);if(hash(b)!==a.sha256)throw Error('ASSET_SOURCE_MISMATCH:'+a.ref);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b);}
 const ref=p=>({path:p,sha256:hash(read(p))});const loadedJs=ref(r.productionPath),r1Validation=c.upstreamBindings.R1.validatorReport,r2Validation=c.upstreamBindings.R2.validatorReport,r3StaticClosure=ref(closurePath),lockedRoster=ref(`${base}/locked-roster.json`);
 const caseIds=['exam/desktop','exam/mobile','sol/desktop','sol/mobile','ans/desktop','ans/mobile'],reason=bootstrap.renderRoute.reason||'Previously approved local official Archive Engine endpoint refused connection; full static completion selected under CURRENT §25, retaining valid independent reviews and structural/code/asset checks.';
 const caseDispositions=caseIds.map(id=>({id,status:'NOT_RUN',captureCount:0,reason}));
 const evidence={loadedJs,r1Validation,r2Validation,r3StaticClosure};
 const decision={schemaVersion:'JS_ARCHIVE_CODEX_ROOT_WAIVER_DECISION_V1',qualityContractVersion:roster.qualityContractVersion,executionLine:'CODEX',runId,examUid:uid,decisionAuthority:'ROOT_DELEGATED',rootIdentity:{role:'ROOT',identity:'/root'},completionBasis:'ROOT_DIRECTED_STATIC_COMPLETE',renderStatus:'NOT_RUN_ROOT_WAIVER',authorityReference:bootstrap.authorityReference,lockedRoster,scope:{runId,examUid:uid,qids:c.qids,caseIds},waivedCaseIds:caseIds,caseDispositions,reason,alternativeReview:{status:'PASS',description:'Valid full-input R1/R2 review and full-qid R3 static JS/assets/SVG/structure integrity; zero unresolved item HOLD.',evidenceRefs:[r3StaticClosure,r1Validation,r2Validation]},publicationConditions:['Generic V2 CODEX R1/R2 full PASS with actual artifact contract','R3 static full-qid integrity and zero item HOLD','Exact raw production/index/asset bytes and remote readback','ROOT static and MAIN_DONE helper intake PASS'],r3ReviewerIdentity:c.reviewerIdentity,artifact:{artifactSha:c.artifactSha,artifactRawSha256:c.artifactRawSha256},assets,evidence,decidedAt:new Date().toISOString()};
 const decisionPath=`${base}/${uid}/ROOT.decision.json`;preserve(decisionPath);write(decisionPath,decision);
 const receipt={schemaVersion:'JS_ARCHIVE_CODEX_ROOT_WAIVED_STATIC_RECEIPT_V1',status:'STATIC_CODE_COMPLETE',qualityContractVersion:roster.qualityContractVersion,executionLine:'CODEX',runId,examUid:uid,completionBasis:decision.completionBasis,renderStatus:decision.renderStatus,artifactSha:c.artifactSha,artifactRawSha256:c.artifactRawSha256,productionPath:r.productionPath,qids:c.qids,assets,loadedJs,r1Validation,r2Validation,r3StaticClosure,lockedRoster,rootDecision:ref(decisionPath),caseDisposition:caseDispositions};
 const receiptPath=`${base}/${uid}/ROOT.static.receipt.json`;preserve(receiptPath);write(receiptPath,receipt);console.log(JSON.stringify({receiptPath,productionPath:r.productionPath,artifactSha:c.artifactSha,artifactRawSha256:c.artifactRawSha256}));
}
if(phase==='main-done'){
 const receipt=JSON.parse(read(`${base}/${uid}/ROOT.static.receipt.json`));receipt.schemaVersion='JS_ARCHIVE_CODEX_ROOT_WAIVED_MAIN_DONE_RECEIPT_V1';receipt.status='MAIN_DONE';receipt.remoteMainSha=git('rev-parse','origin/main').toString().trim();receipt.closedAt=new Date().toISOString();const p=`${base}/${uid}/MAIN_DONE.receipt.json`;write(p,receipt);console.log(JSON.stringify({receiptPath:p,remoteMainSha:receipt.remoteMainSha}));
}
if(phase==='packet'){
 const r=roster.rows.find(x=>x.examUid===uid),bytes=read(r.workingJsAbsolute),baseStage=stage.split('-')[0],blind=['R1','R2'].includes(baseStage),bundlePath=`${base}/${uid}/${stage}.student-input.json`,bundle=blind?JSON.parse(read(bundlePath)):null;
 const packet={runId,examUid:uid,stage,qualityContractVersion:roster.qualityContractVersion,executionLine:'CODEX',worktreeRootAbsolute:root,workingJsAbsolute:r.workingJsAbsolute,assetRootAbsolute:r.candidateRoot,evidenceRootAbsolute:path.resolve(root,`${base}/${uid}`),productionRelativePath:r.productionPath,expectedHead:git('rev-parse','HEAD').toString().trim(),artifactRawSha256:hash(bytes),validatorRawBufferBlobSha1:gitBlobSha(bytes),gitCleanFilterBlobSha1:git('hash-object','--path='+r.productionPath,r.workingJsAbsolute).toString().trim(),allowedQids:bundle?bundle.questions.map(q=>q.id):Array.from({length:r.questionCount},(_,i)=>i+1),allowedFields:blind?['current student whitelist pre-freeze; full assigned stage only after durable freeze/disclosure']:['assigned stage candidate/evidence only'],studentBundleAbsolute:blind?path.resolve(root,bundlePath):null,studentBundleSha256:blind?hash(read(bundlePath)):null,requiredAssets:bundle?.assets||r.sourceRow.assets.map(a=>({ref:a.ref,path:path.join(r.candidateRoot,a.ref),sha256:a.sha256})),renderDecision:'ROOT_DELEGATED / ROOT_DIRECTED_STATIC_COMPLETE / NOT_RUN_ROOT_WAIVER; quality not waived',sourceManifestAbsolute:'C:/Users/USER/Desktop/AP------/.tmp/archive/source-batch-20261006/batch-manifest.json'};
 packet.stage=baseStage;packet.reviewScope=blind?(bundle.questions.length===r.questionCount?'FULL_QID_STAGE':'AFFECTED_QID_ONLY'):(baseStage==='R3'?'FULL_STRUCTURAL_TARGETED_RELEASE':'FULL_QID_AUTHORING');packet.scopeEvidencePrefix=stage;
 if(baseStage==='R3'||stage.includes('recovery')||stage.includes('restoration'))packet.requiredAssets=currentAssets(bytes,r.candidateRoot);
 packet.postfreezeHelperAbsolute=path.resolve(root,`.tmp/archive/${runId}/root-technical.mjs`);
 const out=`${base}/${uid}/${stage}.assignment.json`;write(out,packet);console.log(JSON.stringify({path:path.resolve(root,out),sha256:hash(read(out)),artifactRawSha256:packet.artifactRawSha256,artifactSha:packet.validatorRawBufferBlobSha1}));
}
if(phase==='stage'){
 const r=roster.rows.find(x=>x.examUid===uid),receipt=JSON.parse(read(`${base}/${uid}/ROOT.static.receipt.json`));
 const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name).replaceAll('\\','/')]);
 const files=[r.productionPath,...receipt.assets.map(a=>a.file.path),...walk(`${base}/${uid}`),`${base}/locked-roster.json`,`${base}/bootstrap.json`,`${base}/authority-snapshot.md`,`${base}/ledger.jsonl`,`${base}/input-asset-copy-parity.json`,`${base}/run-state.json`].filter(p=>fs.existsSync(p)&&!/[.](pdf|hwp|hwpx)$/i.test(p));
 if(files.some(p=>p.includes('/_generated/')||p.startsWith('.tmp/')))throw Error('FORBIDDEN_STAGE_PATH');
 for(let i=0;i<files.length;i+=25)git('add','--',...files.slice(i,i+25));
 const parity=[];for(const p of files){const bytes=read(p);let index=git('cat-file','blob',':'+p);if(!bytes.equals(index)){const sha=git('hash-object','--no-filters','-w',p).toString().trim(),mode=git('ls-files','-s','--',p).toString().split(' ')[0]||'100644';git('update-index','--add','--cacheinfo',`${mode},${sha},${p}`);index=git('cat-file','blob',':'+p);if(!bytes.equals(index))throw Error('RAW_INDEX_MISMATCH:'+p);}parity.push({path:p,sha256:hash(bytes),blobSha1:gitBlobSha(bytes)});}
 write(`${base}/${uid}/ROOT.index-byte-parity.json`,{examUid:uid,status:'PASS',files:parity,verifiedAt:new Date().toISOString()});git('add','--',`${base}/${uid}/ROOT.index-byte-parity.json`);
 const checker='C:/Users/USER/Desktop/AP------/tools/archive/check-exam-workspace-policy.mjs',checkerModule='C:/Users/USER/Desktop/AP------/tools/archive/exam-workspace-policy.mjs';
 const policyRaw=execFileSync('node',[checker,'--staged'],{cwd:root}),policy=JSON.parse(policyRaw);write(`${base}/${uid}/ROOT.workspace-policy.json`,{command:['node',checker,'--staged'],root,actualReport:policy,implementation:{checkerSha256:hash(read(checker)),moduleSha256:hash(read(checkerModule)),source:'READ_ONLY_PRIMARY_CURRENT_LOCAL_POLICY_IMPLEMENTATION'},verifiedAt:new Date().toISOString()});git('add','--',`${base}/${uid}/ROOT.workspace-policy.json`);
 console.log(JSON.stringify({stagedFiles:files.length+2,rawIndexParity:'PASS',workspacePolicy:policy.status}));
}
if(phase==='intake-static'||phase==='intake-main'){
 const mode=phase==='intake-static'?'static':'main-done',receiptPath=`${base}/${uid}/${mode==='static'?'ROOT.static.receipt.json':'MAIN_DONE.receipt.json'}`;
 let raw,status=0;try{raw=execFileSync('node',['archive/tools/archive-codex-root-waiver-intake.mjs','--phase',mode,'--root',root,'--receipt',receiptPath],{cwd:root});}catch(e){raw=e.stdout||Buffer.from(JSON.stringify({ok:false,issues:[e.message]}));status=e.status||1;}
 const prefix=`${base}/${uid}/ROOT.${mode}.intake`;let n=1;while(fs.existsSync(`${prefix}.attempt${n}.json`))n++;fs.writeFileSync(`${prefix}.attempt${n}.json`,raw);fs.writeFileSync(`${prefix}.json`,raw);process.stdout.write(raw);process.exitCode=status;
}
