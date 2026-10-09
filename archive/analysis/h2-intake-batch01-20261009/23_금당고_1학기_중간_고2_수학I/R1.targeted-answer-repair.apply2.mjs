import fs from 'node:fs';import crypto from 'node:crypto';
import {readExam,physical} from 'file:///C:/Users/USER/Desktop/AP-worktrees/h2-intake-batch01/AP------/archive/tools/archive-codex-artifact-io.mjs';
const examFile='C:/Users/USER/Desktop/AP-worktrees/h2-intake-batch01/AP------/.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/23_금당고_1학기_중간_고2_수학I.js';
const evidenceRoot='C:/Users/USER/Desktop/AP-worktrees/h2-intake-batch01/AP------/archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I';
const expected='ea3ad7b6d18ad2be61ac8e20420395adb9caee888891c0e9e9ce20fe6f621f65';
const patches={
5:{answer:'⑤',solution:String.raw`로그를 하나의 변수로 바꾸어 자연수 $x$의 범위를 구한다.
$t=\log_2 x$라 두면 $\log_2 x^4=4\log_2 x=4t$이므로
$t^2-4t+3\le0$
$(t-1)(t-3)\le0$에서 $1\le t\le3$이다.
밑 $2$는 $1$보다 크므로 $2\le x\le8$이다. 이 구간의 자연수는 $2,3,4,5,6,7,8$의 일곱 개이다.
따라서 정답은 ⑤이다.`},
7:{answer:'⑤',solution:String.raw`점선이 나타내는 좌표를 차례로 읽는다.
높이 $1$에서 로그그래프의 점선 교점의 $x$좌표가 $a$이므로 $\log_2 a=1$, 따라서 $a=2$이다.
같은 수직선에서 지수그래프의 높이가 $c$이므로 $c=2^a=4$이다.
높이 $c$에서 로그그래프의 점선 교점의 $x$좌표가 $b$이므로 $\log_2 b=c$, 따라서 $b=2^c=16$이다.
마지막으로 $x=b$에서 지수그래프의 높이가 $d$이므로 $d=2^b=2^{16}$이다.
따라서 $abcd=2\cdot4\cdot16\cdot2^{16}=2^{23}$이고, 정답은 ⑤이다.`}
};
const before=readExam(examFile);if(before.rawSha256!==expected)throw Error('SOURCE_SHA_CHANGED_BEFORE_PATCH');
const bytes=fs.readFileSync(examFile);const bom=bytes.subarray(0,3).equals(Buffer.from([0xef,0xbb,0xbf]));let source=bytes.toString('utf8');if(bom)source=source.slice(1);
function skipQuoted(s,i){const q=s[i];for(let j=i+1;j<s.length;j++){if(s[j]==='\\'){j++;continue;}if(s[j]===q)return j+1;}throw Error('STRING_UNCLOSED');}
function findEnd(s,start){let d=0;for(let i=start;i<s.length;){const c=s[i];if(c==='"'||c==="'"){i=skipQuoted(s,i);continue;}if(c==='`'){i=skipQuoted(s,i);continue;}if(c==='/'&&s[i+1]==='/'){const e=s.indexOf('\n',i+2);i=e<0?s.length:e+1;continue;}if(c==='/'&&s[i+1]==='*'){const e=s.indexOf('*/',i+2);if(e<0)throw Error('COMMENT_UNCLOSED');i=e+2;continue;}if(c==='{')d++;else if(c==='}'){d--;if(d===0)return i;}i++;}throw Error('OBJECT_UNCLOSED');}
const edits=[];for(const [qid,patch] of Object.entries(patches)){const idRe=new RegExp('"id"\\s*:\\s*'+qid+'\\b','g'),hits=[...source.matchAll(idRe)];if(hits.length!==1)throw Error('QID_CARDINALITY:'+qid+':'+hits.length);const start=source.lastIndexOf('{',hits[0].index),end=findEnd(source,start);let block=source.slice(start,end+1);for(const field of ['answer','solution']){const re=new RegExp('("'+field+'"\\s*:\\s*)("(?:\\\\.|[^"\\\\])*")');const m=block.match(re);if(!m)throw Error('FIELD_STRING_NOT_FOUND:q'+qid+':'+field);block=block.replace(re,(_all,prefix)=>prefix+JSON.stringify(patch[field]));}edits.push({start,end:end+1,block,qid:Number(qid)});}
edits.sort((a,b)=>b.start-a.start);for(const e of edits)source=source.slice(0,e.start)+e.block+source.slice(e.end);const output=Buffer.from((bom?'\ufeff':'')+source,'utf8');
const backup=evidenceRoot+'/R1.source-before-answer-repair.js';fs.writeFileSync(backup,bytes,{flag:'wx'});fs.writeFileSync(examFile,output);const after=readExam(examFile);for(const qid of [5,7]){const q=after.questions.find(x=>Number(x.id)===qid),p=patches[qid];if(q.answer!==p.answer||q.solution!==p.solution)throw Error('POST_PATCH_MISMATCH:q'+qid);}
for(const q of after.questions.filter(x=>![5,7].includes(Number(x.id)))){const old=before.questions.find(x=>Number(x.id)===Number(q.id));for(const k of ['answer','solution','decisiveStep'])if(old[k]!==q[k])throw Error('UNEXPECTED_CHANGE:q'+q.id+':'+k);}
const evidence={schemaVersion:'JS_ARCHIVE_R1_TARGETED_SOURCE_REPAIR_V1',stage:'R1',examUid:'23_금당고_1학기_중간_고2_수학I',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',preChangeSource:physical(backup),preChangeSourceSha256:before.rawSha256,postChangeSourceSha256:after.rawSha256,postChangeRawBufferBlobSha1:after.rawBufferGitBlobSha1,calibrationEvidence:{path:evidenceRoot+'/R1.solution-calibration-preflight.json',sha256:physical(evidenceRoot+'/R1.solution-calibration-preflight.json').sha256,gateStatus:'PASS'},changedQids:[5,7],changedFields:['answer','solution'],rows:[5,7].map(qid=>({qid,answer:patches[qid].answer,solutionSha256:'sha256:'+crypto.createHash('sha256').update(patches[qid].solution).digest('hex'),decisiveStep:qid===5?'t=log_2 x로 치환한 뒤 자연수 정수 x=2부터 8까지 직접 세어 일곱 개임을 확인한다.':'점선 교점에서 로그와 지수의 역관계를 차례로 적용해 a,c,b,d를 결정한다.',reason:qid===5?'Stored solution counted only powers of 2, but every natural integer 2 through 8 satisfies the inequality; answer is 7 (choice ⑤).':'Filled the uniquely determined value from the actually opened source figure.'})),itemStatusChanged:false};const epath=evidenceRoot+'/R1.targeted-answer-repair.json';fs.writeFileSync(epath,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({evidencePath:epath,evidenceSha256:crypto.createHash('sha256').update(fs.readFileSync(epath)).digest('hex'),before:before.rawSha256,after:after.rawSha256,changedQids:[5,7],sourceBackup:backup}));