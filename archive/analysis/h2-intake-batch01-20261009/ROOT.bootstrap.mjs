import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
const primary='C:/Users/USER/Desktop/AP------';
const root=path.resolve(process.argv[2]);
const runId='h2-intake-batch01-20261009';
const head=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(p,b)=>{if(fs.existsSync(p)){if(sha(fs.readFileSync(p))!==sha(b))throw Error('EXISTING_BYTES_DIFFER:'+p);return;}fs.writeFileSync(p,b,{flag:'wx'});};
const titles=['26_순천고_1학기_중간_고2_대수','23_강남여고_1학기_중간_고2_수학I','23_강남여고_1학기_중간_고2_확률과통계','23_금당고_1학기_중간_고2_수학I','23_금당고_1학기_중간_고2_수학II','23_매산고_1학기_중간_고2_수학I','23_매산여고_1학기_중간_고2_수학I','23_매산여고_1학기_중간_고2_확률과통계','23_순천여고_1학기_중간_고2_수학I','23_순천여고_1학기_중간_고2_확률과통계'];
const runRoot=path.join(root,'.tmp/archive',runId);
const durable=path.join(root,'archive/analysis',runId);
fs.mkdirSync(runRoot,{recursive:true});fs.mkdirSync(durable,{recursive:true});
const roster=[];
for(const [i,title] of titles.entries()){
 const evidenceSrc=path.join(primary,'archive/analysis/source-only-h2-1mid-20261005',title+'.evidence.json');
 const evidenceBytes=fs.readFileSync(evidenceSrc),intake=JSON.parse(evidenceBytes);
 const production=intake.exam.targetJs;
 const input=fs.readFileSync(path.join(primary,production));
 const examRoot=path.join(runRoot,title),working=path.join(examRoot,title+'.js');
 fs.mkdirSync(examRoot,{recursive:true});
 put(working,input);
 put(path.join(examRoot,'intake-original.evidence.json'),evidenceBytes);
 put(path.join(examRoot,'extracted-baseline.js'),input);
 const box={window:{}};vm.runInNewContext(input.toString('utf8'),box,{timeout:5000});
 const qs=box.window.questionBank||box.window.questions;
 if(qs.length!==intake.inventory.totalQuestions)throw Error('DENOMINATOR:'+title);
 const qids=qs.map(q=>Number(q.id??q.number));
 const assets=[];
 for(const a of intake.images||[]){
  const bytes=fs.readFileSync(path.join(primary,a.path));
  if(sha(bytes)!==a.sha256)throw Error('INTAKE_ASSET_SHA:'+a.path);
  const canonicalRef=a.path.replace(/^archive\//,'');
  const ref=qs.some(q=>q.image===a.path)?a.path:canonicalRef;
  const target=path.join(examRoot,ref);fs.mkdirSync(path.dirname(target),{recursive:true});put(target,bytes);
  const canonicalTarget=path.join(examRoot,canonicalRef);fs.mkdirSync(path.dirname(canonicalTarget),{recursive:true});put(canonicalTarget,bytes);
  assets.push({ref,path:target,sha256:sha(bytes)});
 }
 for(const q of qs){if(q.image&&!assets.some(a=>a.ref===q.image))throw Error('UNBOUND_IMAGE:'+title+':'+q.id);}
 let pdf=intake.source.pdfPath;
 if(!fs.existsSync(pdf)&&title==='23_강남여고_1학기_중간_고2_수학I')pdf=pdf.replace('2023_강남여고2','2023_강남고2');
 const eRoot=path.join(durable,title);fs.mkdirSync(eRoot,{recursive:true});
 const assignment={runId,examUid:title,stage:'CREATE',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',worktreeRootAbsolute:root,workingJsAbsolute:working,assetRootAbsolute:examRoot,evidenceRootAbsolute:eRoot,productionRelativePath:production,expectedHead:head,artifactRawSha256:sha(input),validatorRawBufferBlobSha1:execFileSync('git',['hash-object','--no-filters',working],{cwd:root,encoding:'utf8'}).trim(),gitCleanFilterBlobSha1:execFileSync('git',['hash-object','--path='+production,working],{cwd:root,encoding:'utf8'}).trim(),allowedQids:qids,allowedFields:['answer','solution','decisiveStep','meta','difficulty','layout','solutionImage'],requiredAssets:assets,sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',sourcePdfDefectOnlyAbsolute:pdf,sourcePdfExists:fs.existsSync(pdf),sourcePdfActuallyReviewed:false,intakeEvidenceAbsolute:path.join(examRoot,'intake-original.evidence.json'),intakeEvidenceSha256:sha(evidenceBytes),extractedBaselineAbsolute:path.join(examRoot,'extracted-baseline.js'),sourceProvenanceLimitations:intake.source.pdfSha256==='N/A'?['INTAKE_PDF_SHA_UNAVAILABLE']:[],resolvedRoleModel:'gpt-6-luna',resolvedRoleReasoningEffort:'high'};
 assignment.technicalFindings=assets.filter(a=>a.ref.startsWith('archive/')).map(a=>({type:'IMAGE_REF_EXTRA_ARCHIVE_PREFIX',ref:a.ref,canonicalRef:a.ref.slice(8),action:'CREATE owner normalize to assets/images reference; identical byte alias is already available. Record source-student reference migration; do not claim source text change.'}));
 const assignmentFile=path.join(examRoot,'CREATE.assignment.json');
 if(fs.existsSync(assignmentFile)&&sha(fs.readFileSync(assignmentFile))!==sha(JSON.stringify(assignment,null,2)+'\n'))fs.renameSync(assignmentFile,path.join(examRoot,'CREATE.assignment.bootstrap-original.json'));
 put(assignmentFile,JSON.stringify(assignment,null,2)+'\n');
 roster.push({order:i+1,examUid:title,assignmentAbsolute:path.join(examRoot,'CREATE.assignment.json'),inputRawSha256:sha(input),qidCount:qids.length,stage:'CREATE_PENDING',productionRelativePath:production});
}
fs.writeFileSync(path.join(durable,'roster.json'),JSON.stringify(roster,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(durable,'run-ledger.json'),JSON.stringify({runId,qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',head,root,createdAt:new Date().toISOString(),userOverride:{instruction:'크리에이트 5개씩 2번 생성시키고 r1부터 순처적으로 가고 / 진행시켜',createConcurrentLimit:5,r1ConcurrentLimit:1,r2ConcurrentLimit:1,r3ConcurrentLimit:1,configuredSubagentLimit:8,activeSessionSubagentLimit:5,policy:'Actual tool limit respected; release completed stage sessions before further dispatch; no altered shared dispatcher or quality gate.'},roster,events:[]},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({root,head,rosterPath:path.join(durable,'roster.json'),assignments:roster.map(x=>x.assignmentAbsolute),count:roster.length},null,2));
