import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const repo=process.cwd();
const assignmentPath='.tmp/archive/codex-20261007-2sem-mid-jeil-calc1/26_제일고_2학기_중간_고2_미적분I/assignment.R1.json';
const assignment=JSON.parse(fs.readFileSync(assignmentPath,'utf8'));
const assignmentSha=crypto.createHash('sha256').update(fs.readFileSync(assignmentPath)).digest('hex');
const sourceFile=assignment.workingJsAbsolute;
const sourceBytes=fs.readFileSync(sourceFile);
const rawSha=crypto.createHash('sha256').update(sourceBytes).digest('hex');
if(rawSha!=='5d1cb102d0b0f35699cdcf04166d5b164d533cdbbfc51534b2b3dd3a3ed1430c') throw new Error('CURRENT_RAW_SHA_MISMATCH:'+rawSha);
const cleanBlobSha=crypto.createHash('sha1').update(`blob ${sourceBytes.length}\0`).update(sourceBytes).digest('hex');
if(cleanBlobSha!=='9fb307c9c0c0aeff780d2bbbcfa421c206fd279b') throw new Error('CURRENT_BLOB_SHA_MISMATCH:'+cleanBlobSha);
const ctx={window:{},console:{log(){},warn(){},error(){}}};
vm.runInNewContext(sourceBytes.toString('utf8'),ctx,{timeout:5000,filename:'R1-final-student-extraction.js'});
const bank=ctx.window.questionBank;
if(!Array.isArray(bank)||bank.length!==22) throw new Error('QID_DENOMINATOR_MISMATCH');
const old=JSON.parse(fs.readFileSync(path.join(assignment.evidenceRootAbsolute,'handoff/R1.student-only-bundle.from-CREATE-final.json'),'utf8'));
const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
const items=[];const assetManifest=[];
for(let i=0;i<bank.length;i++){
 const q=bank[i]; const id=Number(q.id); if(id!==i+1) throw new Error('QID_ORDER_MISMATCH:'+id);
 const image=q.image??null; let assetSha=null;
 if(image){const rel=image.replaceAll('\\','/'); if(!rel.startsWith('assets/images/'))throw new Error('BAD_IMAGE_REF:'+id);const p=path.resolve(assignment.assetRootAbsolute,rel);const relInside=path.relative(path.resolve(assignment.assetRootAbsolute),p);if(relInside==='..'||relInside.startsWith('..'+path.sep)||path.isAbsolute(relInside))throw new Error('ASSET_PATH_ESCAPE:'+id);const bytes=fs.readFileSync(p);assetSha=sha256(bytes);const expected=assignment.requiredAssets.find(a=>Number(a.qid)===id);if(!expected||expected.ref!==image||expected.sha256!==assetSha)throw new Error('ASSIGNED_ASSET_SHA_MISMATCH:'+id);assetManifest.push({qid:id,path:image,sha256:assetSha,bytes:bytes.length});}
 const student={id,content:String(q.content??''),choices:Array.isArray(q.choices)?q.choices:null,image,imageAlt:q.imageAlt,assetSha};
 if(!student.content||!Array.isArray(student.choices))throw new Error('STUDENT_FIELDS_REQUIRED:'+id);
 student.payloadSha=sha256(JSON.stringify({id:student.id,content:student.content,choices:student.choices,image:student.image,imageAlt:student.imageAlt,assetSha:student.assetSha}));
 const prior=old.items.find(x=>Number(x.id)===id);if(!prior||prior.content!==student.content||JSON.stringify(prior.choices)!==JSON.stringify(student.choices)||prior.image!==student.image||prior.imageAlt!==student.imageAlt||prior.assetSha!==student.assetSha)throw new Error('UPSTREAM_STUDENT_PAYLOAD_DRIFT:'+id);
 items.push(student);
}
const qids=items.map(x=>x.id);if(JSON.stringify(qids)!==JSON.stringify(Array.from({length:22},(_,i)=>i+1)))throw new Error('QID_ROSTER_MISMATCH');
const bundle={schemaVersion:'JS_ARCHIVE_CODEX_STUDENT_ONLY_BUNDLE_V1',runId:assignment.runId,examUid:assignment.examUid,stage:'R2',executionLine:assignment.executionLine,qualityContractVersion:assignment.qualityContractVersion,assignmentSha256:assignmentSha,sourceRosterSha256:assignment.sourceRosterSha256,sourceBundleSha256:old.sourceBundleSha256,artifactSha:cleanBlobSha,artifactRawSha256:rawSha,denominator:22,qids,items,assetManifest,verification:{qidOrder:'PASS',studentFieldCoverage:'22/22',assetReferenceCoverage:`${assetManifest.length}/${assetManifest.length}`,assetShaParity:'PASS',payloadShaParity:'PASS',answerOrSolutionFieldsIncluded:false,sourceRosterBound:true,exactCurrentArtifactBound:true}};
const forbidden=new Set(['answer','storedAnswer','solution','solutionImage','decisiveStep','Meta','difficulty','verdict','reviewStatus','review','upstreamVerdict','independentAnswer','answerStatus','solutionStatus']);
function scan(v,p='$'){if(Array.isArray(v))return v.forEach((x,i)=>scan(x,`${p}[${i}]`));if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){if(forbidden.has(k))throw new Error('FORBIDDEN_KEY:'+p+'.'+k);scan(x,`${p}.${k}`);}}
scan(bundle);
const out=path.join(assignment.evidenceRootAbsolute,'handoff/R2.student-only-bundle.from-R1-final.json');fs.writeFileSync(out,JSON.stringify(bundle,null,2)+'\n','utf8');
const saved=JSON.parse(fs.readFileSync(out,'utf8'));if(saved.items.length!==22||saved.items.some((x,i)=>x.payloadSha!==items[i].payloadSha))throw new Error('SAVED_BUNDLE_REOPEN_CHECK_FAILED');
process.stdout.write(JSON.stringify({path:out,bundleSha256:sha256(fs.readFileSync(out)),artifactRawSha256:rawSha,artifactBlobSha1:cleanBlobSha,sourceRosterSha256:assignment.sourceRosterSha256,qids:items.length,assets:assetManifest.map(x=>({qid:x.qid,sha256:x.sha256})),payloadHashCount:items.length,forbiddenFieldsPresent:false},null,2));

