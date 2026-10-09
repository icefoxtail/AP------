import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const file = '.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/23_금당고_1학기_중간_고2_수학I.js';
const source = fs.readFileSync(file, 'utf8');
const hash = s => createHash('sha256').update(s).digest('hex');
function parse(text) { const box={window:{}}; vm.runInNewContext(text,box,{timeout:5000}); return box.window.questionBank; }
const oldQs=parse(source);
const st=source.indexOf('window.questionBank ='); const open=source.indexOf('[',st);
if(st<0||open<0)throw new Error('QUESTION_BANK_START_NOT_FOUND');
const ranges=[];let arrDepth=1,objDepth=0,inString=false,escaped=false,objStart=-1,close=-1;
for(let i=open+1;i<source.length;i++){
 const c=source[i];
 if(inString){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')inString=false;continue;}
 if(c==='"'){inString=true;continue;}
 if(c==='['){arrDepth++;continue;}
 if(c===']'){arrDepth--;if(arrDepth===0){close=i;break;}continue;}
 if(c==='{'&&arrDepth===1){if(objDepth===0)objStart=i;objDepth++;continue;}
 if(c==='}'&&objDepth>0){objDepth--;if(objDepth===0)ranges.push([objStart,i+1]);}
}
if(close<0||ranges.length!==oldQs.length)throw new Error('QUESTION_OBJECT_SCAN_MISMATCH');
const fixes={
 4:{subUnitKey:'H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH',subUnit:'로그함수의 그래프',subUnitConfidence:'category_or_cue_inferred',subUnitClassificationDepth:'complete_category',tagConfidence:'high'},
 6:{subUnitKey:'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH',subUnit:'지수함수의 그래프',subUnitConfidence:'category_or_cue_inferred',subUnitClassificationDepth:'complete_category',tagConfidence:'high'},
 7:{subUnitKey:'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH',subUnit:'지수함수의 그래프',subUnitConfidence:'category_or_cue_inferred',subUnitClassificationDepth:'complete_category',tagConfidence:'high',difficultyBucket:3,difficultyConfidence:'medium',difficultyBoundaryFlag:'B23',legacyLevelCompatibility:'NORMAL'},
 12:{subUnitKey:'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH',subUnit:'지수함수의 그래프',subUnitConfidence:'category_or_cue_inferred',subUnitClassificationDepth:'complete_category',tagConfidence:'high'},
 17:{subUnitKey:'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH',subUnit:'지수함수의 그래프',subUnitConfidence:'category_or_cue_inferred',subUnitClassificationDepth:'complete_category',tagConfidence:'high'}
};
const allowed=new Set(['subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','tagConfidence','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility']);
let out=source;
for(const [a,b] of [...ranges].reverse()){
 const q=JSON.parse(source.slice(a,b)); const fix=fixes[q.id]; if(!fix)continue;
 let fragment=source.slice(a,b); const lines=fragment.split('\n');
 for(const [field,value] of Object.entries(fix)){
   const index=lines.findIndex(line=>line.trimStart().startsWith('"'+field+'": '));
   if(index<0)throw new Error('FIELD_NOT_FOUND:'+q.id+':'+field);
   const line=lines[index],comma=line.trimEnd().endsWith(',');
   lines[index]=line.slice(0,line.indexOf('"'))+'"'+field+'": '+JSON.stringify(value)+(comma?',':'');
 }
 fragment=lines.join('\n');out=out.slice(0,a)+fragment+out.slice(b);
}
const newQs=parse(out);if(newQs.length!==oldQs.length)throw new Error('QUESTION_COUNT_CHANGED');
const studentFields=['id','sourceQuestionNo','displayNo','content','question','choices','image','imageSize','choiceColumns','layoutTag','wide','preserveChoicePrefixes','__apExamSubjectiveSpacing','sharedContext','sharedMaterial','commonData','commonPassage','passage','table'];
const changed=[];
for(let i=0;i<oldQs.length;i++){
 const before=oldQs[i],after=newQs[i];if(before.id!==after.id)throw new Error('QID_ORDER_CHANGED');
 for(const k of new Set([...Object.keys(before),...Object.keys(after)])){
   if(allowed.has(k))continue;
   if(JSON.stringify(before[k])!==JSON.stringify(after[k]))throw new Error('UNAUTHORIZED_OBJECT_MUTATION:'+before.id+':'+k);
 }
 for(const k of studentFields)if(JSON.stringify(before[k])!==JSON.stringify(after[k]))throw new Error('STUDENT_FIELD_MUTATION:'+before.id+':'+k);
 for(const k of ['answer','solution'])if(JSON.stringify(before[k])!==JSON.stringify(after[k]))throw new Error('ANSWER_OR_SOLUTION_MUTATION:'+before.id+':'+k);
 const diffs=[...allowed].filter(k=>JSON.stringify(before[k])!==JSON.stringify(after[k]));
 if(diffs.length){if(!fixes[before.id]||diffs.some(k=>!Object.hasOwn(fixes[before.id],k)))throw new Error('UNEXPECTED_META_DIFF:'+before.id+':'+diffs.join(','));changed.push({qid:before.id,fields:diffs});}
}
fs.writeFileSync(file,out,'utf8');
console.log(JSON.stringify({sourceRawSha256Before:hash(source),sourceRawSha256After:hash(out),questionCount:newQs.length,changed,studentAndAnswerSolutionParity:'EXACT',written:true},null,2));
