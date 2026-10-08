import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sha256,physical,writeFresh,readExam} from './archive-codex-artifact-io.mjs';

export const STUDENT_FIELDS=new Set(['id','sourceQuestionNo','displayNo','content','question','choices','image','imageSize','choiceColumns','layoutTag','wide','preserveChoicePrefixes','__apExamSubjectiveSpacing','sharedContext','sharedMaterial','commonData','commonPassage','passage','table']);
const transport=new Set(['qid','studentPayloadSha256','requiredAssets']);
const forbidden=new Set(['answer','storedAnswer','solution','explanation','decisiveStep','solutionImage','meta','difficultyBucket']);
const choiceFields=new Set(['text','content','value','answer']);
function inspectStudent(student){
  for(const k of Object.keys(student)){if(forbidden.has(k))throw Error('STUDENT_BUNDLE_FORBIDDEN_FIELD:'+k);if(!STUDENT_FIELDS.has(k))throw Error('STUDENT_FIELD_UNSUPPORTED_NOT_DROPPED:'+k);}
  if(student.choices!==undefined&&!Array.isArray(student.choices))throw Error('STUDENT_CHOICES_ARRAY_REQUIRED');
  for(const choice of student.choices||[])if(choice&&typeof choice==='object'){if(Array.isArray(choice)||Object.keys(choice).some(k=>!choiceFields.has(k)))throw Error('CHOICE_FIELD_UNSUPPORTED');}
}
function imageRefs(value,out=new Set()){
  if(typeof value==='string'){for(const m of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi))if(!/^(?:data:|#)/.test(m[1]))out.add(m[1]);}
  else if(Array.isArray(value))for(const v of value)imageRefs(v,out);
  else if(value&&typeof value==='object')for(const v of Object.values(value))imageRefs(v,out);
  return out;
}
export function normalizeStudentBundle(input,{inputFile,expectedSourceRawSha256}={}){
  if(!input||forbidden.size&&Object.keys(input).some(k=>forbidden.has(k)))throw Error('BUNDLE_ANSWER_FIELDS_FORBIDDEN');
  const hash=input.sourceRawSha256||input.source?.rawSha256||input.source?.sha256;
  if(!/^[a-f0-9]{64}$/.test(hash||'')||(expectedSourceRawSha256&&hash!==expectedSourceRawSha256))throw Error('CURRENT_STUDENT_SOURCE_SHA_REQUIRED');
  if(Array.isArray(input.rows)&&Array.isArray(input.questions))throw Error('AMBIGUOUS_BUNDLE_SCHEMA');
  const sourceRows=input.rows||input.questions;if(!Array.isArray(sourceRows)||!sourceRows.length)throw Error('STUDENT_ROWS_REQUIRED');
  const legacy=!Array.isArray(input.rows),rows=sourceRows.map(original=>{
    const qid=Number(original.qid??original.id);if(!Number.isInteger(qid)||qid<1)throw Error('STUDENT_QID_INVALID');
    let student,assets;
    if(legacy){const unknown=Object.keys(original).filter(k=>!transport.has(k)&&!STUDENT_FIELDS.has(k));if(unknown.length)throw Error('LEGACY_ROW_FIELD_NOT_DROPPED:'+unknown.join(','));student=Object.fromEntries(Object.entries(original).filter(([k])=>STUDENT_FIELDS.has(k)));assets=original.requiredAssets||[];}
    else{if(Object.keys(original).some(k=>!['qid','student','assets','studentPayloadSha256','originalStudentPayloadSha256'].includes(k)))throw Error('ROW_FIELD_NOT_DROPPED');student=original.student;assets=original.assets||[];}
    if(!student||typeof student!=='object'||Array.isArray(student))throw Error('STUDENT_OBJECT_REQUIRED');inspectStudent(student);
    if(student.id!==undefined&&Number(student.id)!==qid)throw Error('STUDENT_ID_QID_MISMATCH');
    if(!Array.isArray(assets)||assets.some(a=>!a.ref||!a.path||!/^[a-f0-9]{64}$/.test(a.sha256||'')))throw Error('STUDENT_ASSET_BINDING_REQUIRED');
    const required=imageRefs(student);if(student.image)required.add(student.image);
    for(const ref of required)if(!assets.some(a=>a.ref===ref))throw Error('STUDENT_ASSET_BUNDLE_INCOMPLETE:'+ref);
    for(const a of assets){const bytes=fs.readFileSync(a.path);if(sha256(bytes)!==a.sha256)throw Error('STUDENT_ASSET_SHA_CHANGED:'+a.ref);if(a.ref.endsWith('.svg'))for(const m of bytes.toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)/gi))if(!/^(?:data:|#)/.test(m[1])){const dep=path.posix.normalize(path.posix.join(path.posix.dirname(a.ref),m[1]));if(!assets.some(x=>x.ref===dep))throw Error('STUDENT_SVG_DEPENDENCY_MISSING:'+dep);}}
    return {qid,student:structuredClone(student),studentPayloadSha256:sha256(Buffer.from(JSON.stringify(student))),assets:structuredClone(assets),originalStudentPayloadSha256:original.studentPayloadSha256??null};
  });
  const qids=rows.map(r=>r.qid);if(new Set(qids).size!==qids.length)throw Error('STUDENT_QID_DUPLICATE');
  for(const count of [input.sourceQuestionCount,input.questionCount])if(count!==undefined&&count!==rows.length)throw Error('STUDENT_DENOMINATOR_MISMATCH');
  if(input.qids&&(input.qids.length!==qids.length||input.qids.some((q,i)=>Number(q)!==qids[i])))throw Error('STUDENT_QID_ORDER_MISMATCH');
  return {schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:hash,sourceRawBlobSha1:input.sourceRawBlobSha1||input.sourceRawBufferBlobSha1||input.source?.rawBufferGitBlobSha1||null,questionCount:rows.length,qids,whitelist:[...STUDENT_FIELDS],rows,adapterProvenance:{input:inputFile?physical(inputFile):null,inputSchemaVersion:input.schemaVersion??null,legacyConverted:legacy,studentFieldsDropped:[],answersRead:false,originalBundleMutated:false}};
}
export function studentAssetRefs(student){return [...imageRefs(student),...(student.image?[student.image]:[])];}
export function disclosePostfreeze({sourceFile,studentBundleFile,freezeFile,freezeSha256,qids,output}){
  if(physical(freezeFile).sha256!==freezeSha256)throw Error('ORIGINAL_FREEZE_SHA_REQUIRED');
  const original=JSON.parse(fs.readFileSync(freezeFile)),bundle=normalizeStudentBundle(JSON.parse(fs.readFileSync(studentBundleFile)),{inputFile:studentBundleFile}),freezeSource=original.sourceRawSha256||original.sourceSha256||original.source?.sha256,frozen=original.rows||original.answers||original.independentAnswers;
  if(freezeSource!==bundle.sourceRawSha256||!Array.isArray(frozen)||frozen.length!==bundle.rows.length||new Set(frozen.map(r=>Number(r.qid??r.id))).size!==bundle.rows.length||bundle.rows.some(r=>!frozen.some(f=>Number(f.qid??f.id)===r.qid)))throw Error('FULL_ORIGINAL_FREEZE_AND_BUNDLE_REQUIRED');
  if(original.studentBundle?.sha256&&original.studentBundle.sha256!==physical(studentBundleFile).sha256)throw Error('FROZEN_STUDENT_BUNDLE_CHANGED');
  const exam=readExam(sourceFile);if(exam.questions.length!==bundle.rows.length)throw Error('CURRENT_SOURCE_DENOMINATOR_CHANGED');
  for(let i=0;i<bundle.rows.length;i++){
    const row=bundle.rows[i],q=exam.questions[i];if(Number(q.id??q.qid)!==row.qid)throw Error('CURRENT_QID_ORDER_CHANGED');
    const current=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));
    if(Array.isArray(current.choices))current.choices=current.choices.map(c=>c&&typeof c==='object'&&!Array.isArray(c)?Object.fromEntries(Object.entries(c).filter(([k])=>choiceFields.has(k))):c);
    const before=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(row.student,k)).map(k=>[k,row.student[k]]));
    if(JSON.stringify(current)!==JSON.stringify(before))throw Error('STUDENT_INPUT_CHANGED_FRESH_REVIEW_REQUIRED:'+row.qid);
  }
  const wanted=qids||bundle.qids;if(!Array.isArray(wanted)||new Set(wanted).size!==wanted.length||wanted.some(q=>!bundle.qids.includes(q)))throw Error('POSTFREEZE_QID_SCOPE_INVALID');
  const fields=['answer','solution','explanation','sol','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','decisiveStep'];
  const value={schemaVersion:'JS_ARCHIVE_POSTFREEZE_DISCLOSURE_V2',originalFreeze:physical(freezeFile),studentBundle:physical(studentBundleFile),sourceRawSha256:exam.rawSha256,originalFreezeSourceRawSha256:freezeSource,studentParity:'EXACT',rows:exam.questions.filter(q=>wanted.includes(Number(q.id??q.qid))).map(q=>({qid:Number(q.id??q.qid),...Object.fromEntries(fields.filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]))})),disclosedAt:new Date().toISOString()};return {disclosure:value,ref:writeFresh(output,value)};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const a={};for(let i=2;i<process.argv.length;i++){const k=process.argv[i];if(!['--input','--output','--expected-source-sha'].includes(k))throw Error('UNKNOWN_ARGUMENT:'+k);a[k.slice(2)]=process.argv[++i];}
  if(!a.input||!a.output||!a['expected-source-sha'])throw Error('INPUT_OUTPUT_CURRENT_SHA_REQUIRED');
  const value=normalizeStudentBundle(JSON.parse(fs.readFileSync(a.input)),{inputFile:a.input,expectedSourceRawSha256:a['expected-source-sha']});console.log(JSON.stringify({ref:writeFresh(a.output,value),questionCount:value.questionCount,legacyConverted:value.adapterProvenance.legacyConverted}));
}
