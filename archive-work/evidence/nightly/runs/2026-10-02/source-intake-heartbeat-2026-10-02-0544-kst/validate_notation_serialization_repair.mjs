import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=process.cwd();
const dir='archive-work/evidence/nightly/runs/2026-10-02/source-intake-heartbeat-2026-10-02-0544-kst';
const runDir=path.join(root,dir);
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const readBank=text=>{const m='window.questionBank = ',a=text.indexOf(m)+m.length,b=text.indexOf('\n];',a);if(b<0)throw new Error('questionBank terminator absent');return JSON.parse(text.slice(a,b+2))};
const specs=[
 {examId:'22_팔마고_2학기_기말_고2_수학II',file:'archive-work/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js'},
 {examId:'22_효천고_2학기_기말_고2_수학II',file:'archive-work/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js'}
];
const receipt=JSON.parse(fs.readFileSync(path.join(runDir,'notation_serialization_repair_receipt.json'),'utf8'));
if(receipt.correctedEntries.length!==92)throw new Error(`Repair receipt has ${receipt.correctedEntries.length} entries, expected 92`);
if(receipt.supplementalUnindexedNotationRepairCount!==2||receipt.supplementalUnindexedRepairs?.length!==2)throw new Error('Expected two supplemental unindexed source tokens.');
const qidMap=new Map();for(const e of receipt.correctedEntries){if(!qidMap.has(e.examId))qidMap.set(e.examId,new Set());qidMap.get(e.examId).add(Number(e.qid));}
const exams=[];
let unchangedNonTarget=0,changedTarget=0,answerSolutionBlank=0,allEntryBindings=true,forbiddenResiduals=[];
const forbidden=[/(?<!\\)[fgF]prime/,/(?<!\\)int(?=_|\s|\(|\{|\d)/,/(?<!\\)dfrac/,/(?<!\\)sum_/,/(?<!\\)end\{cases\}/,/(?<!\\)lim_\{/,/(?<!\\)(?:x|\d)ge(?=[\d\s-])/,/(?<!\\)(?:x|\d)le(?=[\d\s<])/];
for(const s of specs){
 const file=path.join(root,s.file),nowText=fs.readFileSync(file,'utf8'),oldText=execFileSync('git',['show',`HEAD:${s.file}`],{encoding:'utf8'});
 const now=readBank(nowText),old=readBank(oldText),wanted=qidMap.get(s.examId)??new Set();
 if(now.length!==old.length)throw new Error(`${s.examId}: question count changed`);
 for(let i=0;i<now.length;i++){
   const a=old[i],b=now[i];if(a.id!==b.id)throw new Error(`${s.examId}: id order changed at ${i}`);
   if(a.answer!==b.answer||a.solution!==b.solution||a.answer!==''||a.solution!=='')throw new Error(`${s.examId} q${a.id}: answer/solution field changed or nonempty`);
   answerSolutionBlank++;
   if(wanted.has(a.id)){
     const aa={...a};delete aa.content;delete aa.choices;const bb={...b};delete bb.content;delete bb.choices;
     if(JSON.stringify(aa)!==JSON.stringify(bb))throw new Error(`${s.examId} q${a.id}: non-content/choice field changed`);
     if(a.content===b.content&&JSON.stringify(a.choices)===JSON.stringify(b.choices))throw new Error(`${s.examId} q${a.id}: expected text correction missing`);
     for(const value of [b.content,...b.choices]){
       if(/[\u0000-\u0008\u0009\u000b\u000c\u000d\u000e-\u001f]/.test(value))throw new Error(`${s.examId} q${a.id}: stray control character remains`);
       if(/(?<!\\),d(?:x|y|t)\b/.test(value))throw new Error(`${s.examId} q${a.id}: raw differential comma remains`);
       for(const re of forbidden)if(re.test(value))forbiddenResiduals.push({examId:s.examId,qid:String(a.id),pattern:String(re),text:value});
     }
     if(s.examId.includes('효천고')&&[9,14,24].includes(a.id)){
       const bs=String.fromCharCode(92),begin=b.content.split('begin{cases}').length-1,end=b.content.split('end{cases}').length-1;
       if(begin!==1||end!==1||!b.content.includes(bs.repeat(2)))throw new Error(`${s.examId} q${a.id}: piecewise case row separator/begin/end invalid`);
     }
     changedTarget++;
   } else {
     if(JSON.stringify(a)!==JSON.stringify(b))throw new Error(`${s.examId} q${a.id}: unrelated question object changed`);
     unchangedNonTarget++;
   }
 }
 const out=execFileSync('node',['--check',file],{encoding:'utf8'});
 exams.push({examId:s.examId,file:s.file,sourceJsSha256:`sha256:${sha(Buffer.from(nowText,'utf8'))}`,baselineCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),questionCount:now.length,correctedQids:[...wanted].sort((a,b)=>a-b),nodeCheck:'PASS',output:out||''});
}
for(const x of receipt.correctedEntries){
 const ex=exams.find(e=>e.examId===x.examId),source=readBank(fs.readFileSync(path.join(root,ex.file),'utf8')),q=source.find(y=>String(y.id)===x.qid);
 const m=/^choices\[(\d+)\]$/.exec(x.currentJsField);const field=m?q.choices[Number(m[1])]:q.content;
 const chars=Array.from(field),start=x.afterCharacterOffset,sub=Array.from(x.afterJsSerialization);
 if(chars.slice(start,start+sub.length).join('')!==x.afterJsSerialization)throw new Error(`After-substring binding failed ${x.examId} q${x.qid} entry ${x.entryIndex}`);
 if(Buffer.byteLength(chars.slice(0,start).join(''),'utf8')!==x.afterUtf8ByteOffset)throw new Error(`After UTF-8 offset failed ${x.examId} q${x.qid} entry ${x.entryIndex}`);
 allEntryBindings=allEntryBindings&&true;
}
for(const x of receipt.supplementalUnindexedRepairs){const e=exams.find(y=>y.examId===x.examId),source=readBank(fs.readFileSync(path.join(root,e.file),'utf8')),q=source.find(y=>String(y.id)===x.qid);if(!q.content.includes(x.afterJsSerialization))throw new Error(`Supplemental source serialization not found in q${x.qid}`)}
if(forbiddenResiduals.length)throw new Error(`Unsupported serializer fragments remain in corrected rows: ${JSON.stringify(forbiddenResiduals.slice(0,8))}`);
if(changedTarget!==33)throw new Error(`Expected 33 corrected question rows; found ${changedTarget}`);
const report={schema:'STATIC_NOTATION_SERIALIZATION_REPAIR_VALIDATION_v1',runId:'source-intake-heartbeat-2026-10-02-0544-kst',validatedAtKst:new Date(Date.now()+9*3600000).toISOString().replace('Z','+09:00'),baselineHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),repairReceiptRef:`${dir}/notation_serialization_repair_receipt.json`,repairReceiptSha256:`sha256:${sha(fs.readFileSync(path.join(runDir,'notation_serialization_repair_receipt.json')))}`,questionCount:46,correctedQuestionCount:changedTarget,correctedNotationMappingCount:receipt.correctedEntries.length,unindexedSupplementalNotationRepairCount:receipt.supplementalUnindexedRepairs.length,totalSourceSerializationRepairCount:receipt.totalSourceSerializationRepairCount,exactAfterSubstringBindings:'PASS_92_OF_92',afterCharacterAndUtf8Offsets:'PASS_92_OF_92',nonTargetQuestionObjectsUnchanged:unchangedNonTarget,onlyTargetedContentChoicesChanged:true,answerSolutionFieldsUnchangedAndEmpty:`PASS_${answerSolutionBlank}_OF_${answerSolutionBlank}`,nodeSyntaxChecks:exams.map(x=>({examId:x.examId,status:x.nodeCheck,sourceJsSha256:x.sourceJsSha256})),unsupportedSerializerResidualCount:forbiddenResiduals.length,fullPagePixelsUsedForSourceTruth:true,ocrUsed:false,browserRenderUsed:false,answersSolutionsExpanded:false,notionWrites:'NOT_PERFORMED',independentReviewStatus:'PENDING_FRESH_OCR_FREE_SUBAGENT_REVIEW',sourceQAReadyCount:0,exams};
fs.writeFileSync(path.join(runDir,'notation_serialization_static_validation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
