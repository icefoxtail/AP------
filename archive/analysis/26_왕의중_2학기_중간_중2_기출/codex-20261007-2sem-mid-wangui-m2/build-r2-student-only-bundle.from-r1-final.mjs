import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
const [assignmentPath, targetPath] = process.argv.slice(2);
const a = JSON.parse(fs.readFileSync(assignmentPath, 'utf8'));
const sourceBaseline = JSON.parse(fs.readFileSync(a.studentBundleAbsolute, 'utf8'));
const roster = JSON.parse(fs.readFileSync(a.sourceRosterAbsolute, 'utf8'));
const rosterExam = roster.exams.find(e => e.examUid === a.examUid);
if (!rosterExam) throw new Error('SOURCE_ROSTER_EXAM_MISSING');
const jsBytes = fs.readFileSync(a.workingJsAbsolute);
const rawSha = crypto.createHash('sha256').update(jsBytes).digest('hex');
const rawBlob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${jsBytes.length}\0`), jsBytes])).digest('hex');
const cleanBlob = execFileSync('git', ['hash-object', '--path=' + a.workingJsAbsolute, a.workingJsAbsolute], { encoding: 'utf8' }).trim();
if (rawSha !== a.artifactRawSha256 || rawBlob !== a.validatorRawBufferBlobSha1 || cleanBlob !== a.gitCleanFilterBlobSha1) throw new Error('CANDIDATE_BINDING_MISMATCH');
if (roster.runId !== a.cohortRunId || roster.qualityContractVersion !== a.qualityContractVersion || roster.executionLine !== a.executionLine) throw new Error('SOURCE_ROSTER_BINDING_MISMATCH');
const rosterSha = crypto.createHash('sha256').update(fs.readFileSync(a.sourceRosterAbsolute)).digest('hex');
if (rosterSha !== a.sourceRosterSha256) throw new Error('SOURCE_ROSTER_SHA_MISMATCH');
if (rosterExam.expectedQuestionCount !== 24 || rosterExam.sourcePages.length !== 6 || sourceBaseline.rows.length !== 24 || sourceBaseline.pages.length !== 6) throw new Error('SOURCE_DENOMINATOR_MISMATCH');
for (let i=0;i<6;i++) {
  const rp=rosterExam.sourcePages[i], bp=sourceBaseline.pages[i];
  if (rp.name!==bp.name || rp.bytes!==bp.bytes || rp.sha256!==bp.sha256) throw new Error('PAGE_MANIFEST_MISMATCH:'+(i+1));
}
const box = { window: {} };
vm.createContext(box);
vm.runInContext(jsBytes.toString('utf8'), box, { filename:a.workingJsAbsolute, timeout:5000 });
const questions = box.window.questionBank || box.window.questions;
if (!Array.isArray(questions) || questions.length!==24 || questions.some((q,i)=>Number(q.id)!==i+1)) throw new Error('CURRENT_QID_DENOMINATOR_MISMATCH');
const assetManifest=[];
for (const required of a.requiredAssets) {
  const abs=a.assetRootAbsolute+'\\'+required.ref.replaceAll('/','\\');
  const actual=crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
  if (actual!==required.sha256) throw new Error('ASSET_HASH_MISMATCH:q'+required.qid);
  assetManifest.push({qid:required.qid,ref:required.ref,sha256:actual});
}
if (assetManifest.length!==13) throw new Error('ASSET_COUNT_MISMATCH');
const assetsByQid=new Map(assetManifest.map(x=>[x.qid,x]));
const baselineByQid=new Map(sourceBaseline.rows.map(r=>[Number(r.qid),r]));
const studentFields=['id','questionType','content','choices','score','subScores','image','sourcePage','sourcePageSha256'];
const payloadHash=obj=>{
  const sorted=Object.fromEntries(Object.entries(obj).sort(([x],[y])=>x.localeCompare(y)));
  return 'sha256:'+crypto.createHash('sha256').update(JSON.stringify(sorted)).digest('hex');
};
const rows=questions.map((q,index)=>{
  const id=Number(q.id),base=baselineByQid.get(id),asset=assetsByQid.get(id)||null;
  if (!base || Number(base.qid)!==index+1) throw new Error('BASELINE_ROW_ORDER_MISMATCH:q'+id);
  const image=q.image??null;
  if (q.content!==base.content || JSON.stringify(q.choices??[])!==JSON.stringify(base.choices??[]) || q.questionType!==base.questionType || image!==(base.problemAsset?.path??null)) throw new Error('CURRENT_STUDENT_PAYLOAD_PARITY_MISMATCH:q'+id);
  if ((asset?.ref??null)!==image || (asset?.sha256??null)!==(base.problemAsset?.sha256??null)) throw new Error('CURRENT_IMAGE_ASSET_MISMATCH:q'+id);
  const payload={id,questionType:q.questionType,content:q.content,choices:q.choices,score:base.score,subScores:base.subScores,image,sourcePage:base.sourcePage,sourcePageSha256:base.sourcePageSha256};
  return {...payload,assetSha256:asset?.sha256??null,payloadSha256:payloadHash(payload)};
});
const bundle={
  schemaVersion:'JS_ARCHIVE_CODEX_STUDENT_ONLY_BUNDLE_V1',
  examUid:a.examUid,
  runId:a.runId,
  cohortRunId:a.cohortRunId,
  stage:'R2_HANDOFF',
  sourceArtifactRawSha256:rawSha,
  sourceArtifactBlobSha1:rawBlob,
  gitCleanFilterBlobSha1:cleanBlob,
  sourceRosterPath:a.sourceRosterAbsolute.replaceAll('\\','/'),
  sourceRosterSha256:rosterSha,
  sourceFormat:rosterExam.sourceFormat,
  qualityContractVersion:a.qualityContractVersion,
  executionLine:a.executionLine,
  answerFree:true,
  questionCount:rows.length,
  qids:rows.map(r=>r.id),
  studentFields,
  pages:sourceBaseline.pages.map(p=>({page:p.page,name:p.name,bytes:p.bytes,sha256:p.sha256})),
  rows,
  assetManifest
};
const forbidden=/^(?:answer|storedAnswer|solution|solutionImage|decisiveStep|Meta|difficulty|verdict|upstreamVerdict|reviewStatus|independentAnswer)$/i;
function scan(o,path='root') { if(Array.isArray(o)){o.forEach((v,i)=>scan(v,`${path}[${i}]`));return;} if(o&&typeof o==='object') for(const [k,v] of Object.entries(o)){if(forbidden.test(k))throw new Error(`FORBIDDEN_FIELD:${path}.${k}`);scan(v,`${path}.${k}`);} }
scan(bundle);
if (rows.length!==24 || rows.some((r,i)=>r.id!==i+1 || !r.payloadSha256) || assetManifest.length!==13 || bundle.qids.some((qid,i)=>qid!==i+1)) throw new Error('FINAL_BUNDLE_INTEGRITY_FAIL');
fs.writeFileSync(targetPath,JSON.stringify(bundle,null,2)+'\n','utf8');
const out=fs.readFileSync(targetPath);
console.log(JSON.stringify({path:targetPath,bundleSha256:crypto.createHash('sha256').update(out).digest('hex'),artifactRawSha256:rawSha,artifactBlobSha1:rawBlob,gitCleanFilterBlobSha1:cleanBlob,sourceRosterSha256:rosterSha,qidCount:rows.length,qidOrder:'1-24',assetCount:assetManifest.length,answerFree:true,forbiddenFields:'NONE'},null,2));
