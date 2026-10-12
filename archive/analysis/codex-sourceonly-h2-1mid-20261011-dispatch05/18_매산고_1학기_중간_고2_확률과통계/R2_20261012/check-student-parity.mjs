import fs from 'node:fs';
import {readExam,sha256} from '../../../../tools/archive-codex-artifact-io.mjs';
const source='archive/exams/original/high/h2/1mid/18_매산고_1학기_중간_고2_확률과통계.js';
const bundleFile='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_매산고_1학기_중간_고2_확률과통계/R2_20261012/student-only.bundle.json';
const exam=readExam(source),bundle=JSON.parse(fs.readFileSync(bundleFile));
const fields=['id','sourceQuestionNo','displayNo','content','question','choices','image','imageSize','choiceColumns','layoutTag','wide','preserveChoicePrefixes','__apExamSubjectiveSpacing','sharedContext','sharedMaterial','commonData','commonPassage','passage','table'];
const choiceFields=new Set(['text','content','value','answer']);
if(bundle.sourceRawSha256!==exam.rawSha256||bundle.rows.length!==exam.questions.length) throw Error('SOURCE_BINDING_OR_DENOMINATOR_MISMATCH');
for(let i=0;i<exam.questions.length;i++){
 const q=exam.questions[i],row=bundle.rows[i];
 if(Number(q.id??q.qid)!==row.qid) throw Error('QID_ORDER_MISMATCH:'+i);
 const student=Object.fromEntries(fields.filter(k=>Object.hasOwn(q,k)).map(k=>[k,structuredClone(q[k])]));
 if(Array.isArray(student.choices)) student.choices=student.choices.map(c=>c&&typeof c==='object'&&!Array.isArray(c)?Object.fromEntries(Object.entries(c).filter(([k])=>choiceFields.has(k))):c);
 if(JSON.stringify(student)!==JSON.stringify(row.student)) throw Error('STUDENT_PAYLOAD_PARITY_MISMATCH:'+row.qid);
 for(const a of row.assets||[]) if(sha256(fs.readFileSync(a.path))!==a.sha256) throw Error('ASSET_SHA_MISMATCH:'+a.ref);
}
console.log(JSON.stringify({parity:'EXACT',sourceRawSha256:exam.rawSha256,qids:bundle.qids,assetCount:bundle.rows.reduce((n,r)=>n+r.assets.length,0),studentOnly:true}));

