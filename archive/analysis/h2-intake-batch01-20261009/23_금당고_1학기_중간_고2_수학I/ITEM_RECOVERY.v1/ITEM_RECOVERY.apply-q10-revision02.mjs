import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {gitBlobSha} from '../../../../tools/archive-stage-validator.mjs';
const root=process.cwd();
const candidateRel='.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/item-recovery-v2/23_금당고_1학기_중간_고2_수학I.js';
const ev='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/ITEM_RECOVERY.v1';
const H=b=>crypto.createHash('sha256').update(b).digest('hex');
const solution=String.raw`$x=\log_a2$, $y=\log_b2$라 두면 $a,b>1$이므로 $x,y>0$이다. 또한
$\log_2a=\dfrac1x$, $\log_2b=\dfrac1y$
이다.

주어진 제곱합 조건은
$\dfrac1{x^2}+\dfrac1{y^2}=14$
이다. $p=xy$라 놓으면 $p>0$이고, $x+y=4$이므로
$x^2+y^2=(x+y)^2-2xy=16-2p$
이다. 따라서
$\dfrac{x^2+y^2}{p^2}=14$
$\dfrac{16-2p}{p^2}=14$
$7p^2+p-8=0$
$(7p+8)(p-1)=0$
이다. $p>0$이므로 $p=1$이다.

$x+y=4$, $xy=1$이므로 $x,y$는 $u^2-4u+1=0$의 두 근이다. 따라서 $x,y=2\pm\sqrt3$이고 둘 다 양수이다. 실제로 $a=2^{1/x}$, $b=2^{1/y}$라 두면 $a,b>1$이며 주어진 로그 조건을 만족한다.

세제곱합은
$x^3+y^3=(x+y)^3-3xy(x+y)$
$=4^3-3\cdot1\cdot4=52$
이다.

그러므로 정답은 ①이다.`;
const draftPath=path.join(root,ev,'ITEM_RECOVERY.replacement-objects.json');
const draft=JSON.parse(fs.readFileSync(draftPath,'utf8'));
draft.rows.find(r=>r.qid===10).solution=solution;
const revisedDraft=path.join(root,ev,'ITEM_RECOVERY.replacement-objects.revision02.json');
fs.writeFileSync(revisedDraft,JSON.stringify(draft,null,2)+'\n',{flag:'wx'});
const candidate=path.join(root,candidateRel);
const before=fs.readFileSync(candidate);
const expected='37570857b17955263b350ba071d45023b329e24836263558d8f428b7c087291c';
if(H(before)!==expected)throw Error('CANDIDATE_SHA_MISMATCH');
const parent=path.join(root,'.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/23_금당고_1학기_중간_고2_수학I.js');
if(H(fs.readFileSync(parent))!=='f991b9796817f3ac596126c2dc911002124822a04e1a7455065712fcee59194e')throw Error('PARENT_SHA_MISMATCH');
const beforePath=path.join(root,ev,'ITEM_RECOVERY.candidate.revision02.before.js');
fs.writeFileSync(beforePath,before,{flag:'wx'});
function parse(src){const a=src.indexOf('window.questionBank'),start=src.indexOf('[',a);let ins=false,esc=false,d=0,end=-1;for(let i=start;i<src.length;i++){const c=src[i];if(ins){if(esc)esc=false;else if(c==='\\')esc=true;else if(c==='"')ins=false;continue;}if(c==='"'){ins=true;continue;}if(c==='[')d++;else if(c===']'&&--d===0){end=i;break;}}if(end<0)throw Error('ARRAY_END');const qs=JSON.parse(src.slice(start,end+1)),ranges=[];ins=false;esc=false;let braces=0,s=-1;for(let i=start+1;i<end;i++){const c=src[i];if(ins){if(esc)esc=false;else if(c==='\\')esc=true;else if(c==='"')ins=false;continue;}if(c==='"'){ins=true;continue;}if(c==='{'){if(braces===0)s=i;braces++;}else if(c==='}'&&--braces===0)ranges.push({start:s,end:i+1});}if(ranges.length!==qs.length)throw Error('RANGE_MISMATCH');return{qs,ranges};}
const src=before.toString('utf8'),{qs,ranges}=parse(src),idx=qs.findIndex(q=>q.id===10),old=qs[idx];if(idx<0||!old)throw Error('Q10_NOT_FOUND');
const updated={...old,solution};const serialized=JSON.stringify(updated,null,2).split('\n').map(line=>'  '+line).join('\n');const r=ranges[idx];const afterText=src.slice(0,r.start)+serialized+src.slice(r.end),afterBytes=Buffer.from(afterText);const context={window:{}};vm.createContext(context);vm.runInContext(afterText,context,{timeout:5000});const finalQs=context.window.questionBank||context.window.questions;if(finalQs.length!==20)throw Error('DENOMINATOR_FAIL');
const baseline=JSON.parse(fs.readFileSync(path.join(root,ev,'ITEM_RECOVERY.invariance-baseline.json'),'utf8'));
const obj=q=>H(Buffer.from(JSON.stringify(q)));for(const qid of [9,18,19])if(obj(qs.find(q=>q.id===qid))!==obj(finalQs.find(q=>q.id===qid)))throw Error('OTHER_TARGET_MUTATED:'+qid);
const non=finalQs.filter(q=>![9,10,18,19].includes(q.id)).map(q=>({qid:q.id,sha256:obj(q)}));if(JSON.stringify(non)!==JSON.stringify(baseline.nonTargetObjectSha256))throw Error('NON_TARGET_MUTATION');
const q10=finalQs.find(q=>q.id===10);if(q10.solution!==solution||q10.solution.includes('`n')||!q10.solution.includes('\n')||q10.answer!=='①'||JSON.stringify(q10.choices)!==JSON.stringify(['52','56','60','61','64']))throw Error('Q10_SOLUTION_OR_ANSWER_SHAPE_FAIL');
fs.writeFileSync(candidate,afterBytes);
const report={schemaVersion:'JS_ARCHIVE_ITEM_RECOVERY_QID_REVISION_PATCH_V1',qid:10,change:'Replaced accidental literal backtick-n separators with real board lines and added the existence check x,y=2±sqrt(3).',inputRawSha256:expected,outputRawSha256:H(fs.readFileSync(candidate)),outputGitBlobSha:gitBlobSha(fs.readFileSync(candidate)),q10SolutionSha256:H(Buffer.from(solution)),otherTargetQidsInvariant:[9,18,19],nonTargetQidsInvariant:non.length,parentWorkingJsSha256:H(fs.readFileSync(parent))};
fs.writeFileSync(path.join(root,ev,'ITEM_RECOVERY.q10-revision02-patch-report.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(report,null,2));