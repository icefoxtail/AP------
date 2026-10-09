import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const examUid='26_왕운중_1학기_중간_중2_기출';
const rel=`.tmp/archive/archive-2026-1mid-nine-20261008/${examUid}/${examUid}.js`;
const file=path.join(root,rel);
const evidence=path.join(root,`archive/analysis/archive-2026-1mid-nine-20261008/${examUid}`);
const before=fs.readFileSync(file,'utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const expected='ac8667fbbbad6440389fe07647eb655301fe363e5d0dabde22ba44ae6470252d';
if(sha(before)!==expected) throw new Error(`SOURCE_SHA_MISMATCH ${sha(before)}`);
const assignment=JSON.parse(fs.readFileSync(path.join(evidence,'CREATE.item-recovery.assignment.head-0a89a9af.json'),'utf8'));
if(assignment.expectedHead!=='0a89a9af2f40b16182d29241d88bb63aa39ab969'||assignment.allowedQids.join(',')!=='1,16') throw new Error('ASSIGNMENT_SCOPE_MISMATCH');
const lhs=before.match(/window\.questionBank\s*=\s*\[/);
if(!lhs) throw new Error('QUESTIONBANK_NOT_FOUND');
const arrayStart=lhs.index+lhs[0].lastIndexOf('[');
const spans=[];let square=1,curly=0,string=null,escape=false,objStart=-1;
for(let i=arrayStart+1;i<before.length;i++){
  const ch=before[i];
  if(string){if(escape) escape=false; else if(ch==='\\') escape=true; else if(ch===string) string=null; continue;}
  if(ch==='"'||ch==="'"||ch==='`'){string=ch;continue;}
  if(ch==='/'&&before[i+1]==='/'){const n=before.indexOf('\n',i+2);i=n<0?before.length:n;continue;}
  if(ch==='/'&&before[i+1]==='*'){const n=before.indexOf('*/',i+2);if(n<0)throw new Error('UNCLOSED_COMMENT');i=n+1;continue;}
  if(ch==='['){square++;continue;} if(ch===']'){square--;if(square===0&&curly===0)break;continue;}
  if(ch==='{'){if(curly===0&&square===1)objStart=i;curly++;continue;}
  if(ch==='}') {curly--;if(curly===0&&objStart>=0){spans.push({start:objStart,end:i+1});objStart=-1;}continue;}
}
if(spans.length!==24) throw new Error(`QID_OBJECT_COUNT_${spans.length}`);
const originals=spans.map(s=>JSON.parse(before.slice(s.start,s.end)));
const map=new Map(originals.map(q=>[q.id,q]));
for(const id of [1,16])if(!map.has(id))throw new Error(`MISSING_QID_${id}`);
const replacements=new Map();
const q1={...map.get(1),content:'순환소수 $0.\\overline{23}$를 기약분수로 나타낸 것은? [3점]',choices:['$\\dfrac{23}{99}$','$\\dfrac{23}{90}$','$\\dfrac{23}{100}$','$\\dfrac{232}{999}$','$\\dfrac{7}{30}$']};
const q16={...map.get(16),content:'다음 보기에서 부등식의 개수와 일차부등식의 개수를 각각 구하면? [3점]<br><보기><br>ㄱ. $3x+5=0$<br>ㄴ. $5x>7$<br>ㄷ. $x+7=5$<br>ㄹ. $8-x^2\\le x^2+5$<br>ㅁ. $2-\\dfrac13>\\dfrac{x}{2}$<br>ㅂ. $1.3x-2x=4$<br>ㅅ. $5x+3y=9$<br>ㅇ. $2(x-3)<x+2$',choices:['4, 3','5, 3','4, 2','3, 3','4, 4']};
for(const [id,q] of [[1,q1],[16,q16]]){
  if(q.answer!==''||q.solution!=='')throw new Error(`EXPECTED_STUDENT_ONLY_TARGET_${id}`);
  replacements.set(id,JSON.stringify(q,null,2).split('\n').map(line=>'  '+line).join('\n'));
}
let after=before;
for(const s of [...spans].reverse()){
  const q=JSON.parse(before.slice(s.start,s.end));
  if(replacements.has(q.id))after=after.slice(0,s.start)+replacements.get(q.id)+after.slice(s.end);
}
const tmp=file+'.tmp';fs.writeFileSync(tmp,after,'utf8');fs.renameSync(tmp,file);
const vmctx={window:{}};const vm=await import('node:vm');vm.default.createContext(vmctx);vm.default.runInContext(after,vmctx);
if(vmctx.window.questionBank.length!==24)throw new Error('QID_DENOMINATOR_CHANGED');
const nonTarget=spans.map((s,i)=>({qid:originals[i].id,sha256:sha(before.slice(s.start,s.end))})).filter(x=>![1,16].includes(x.qid));
const afterSpans=[]; // confirm source literals outside edited spans remain exactly identical in order
const untouchedBefore=spans.filter((s,i)=>![1,16].includes(originals[i].id)).map(s=>before.slice(s.start,s.end));
let cursor=0,untouchedAfter=[];for(const s of spanScan(after,arrayStart)){const q=JSON.parse(after.slice(s.start,s.end));if(![1,16].includes(q.id))untouchedAfter.push(after.slice(s.start,s.end));}
function spanScan(src,from){const out=[];let sq=1,cu=0,st=null,esc=false,os=-1;for(let i=from+1;i<src.length;i++){let c=src[i];if(st){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===st)st=null;continue;}if(c==='"'||c==="'"||c==='`'){st=c;continue;}if(c==='['){sq++;continue;}if(c===']'){sq--;if(cu===0&&sq===0)break;continue;}if(c==='{'){if(cu===0&&sq===1)os=i;cu++;continue;}if(c==='}'){cu--;if(cu===0&&os>=0){out.push({start:os,end:i+1});os=-1;}}}return out;}
if(JSON.stringify(untouchedBefore)!==JSON.stringify(untouchedAfter))throw new Error('NON_TARGET_LITERAL_INVARIANCE_FAILED');
const rows=[1,16].map(id=>{const q=vmctx.window.questionBank.find(x=>x.id===id);return {qid:id,content:q.content,choices:q.choices,answer:q.answer,solution:q.solution,holdStatus:q.itemStatus};});
fs.writeFileSync(path.join(evidence,'CREATE.student-candidate-02.json'),JSON.stringify({schemaVersion:'JS_ARCHIVE_CREATE_STUDENT_CANDIDATE_V1',examUid,baseArtifactSha256:expected,candidateRawSha256:sha(after),targetQids:[1,16],nonTargetCount:22,nonTargetLiteralInvariant:true,studentRows:rows,changeDisposition:'ALIVE_REPLACEMENT / CODEX_DIRECT_AUTHORING; QUESTION_ONLY',sourceAssessmentPath:path.join('archive/analysis/archive-2026-1mid-nine-20261008',examUid,'CREATE.source-assessment-02.json')},null,2),'utf8');
console.log(JSON.stringify({candidateRawSha256:sha(after),nonTargetCount:untouchedAfter.length,nonTargetLiteralInvariant:true,studentRows:rows},null,2));