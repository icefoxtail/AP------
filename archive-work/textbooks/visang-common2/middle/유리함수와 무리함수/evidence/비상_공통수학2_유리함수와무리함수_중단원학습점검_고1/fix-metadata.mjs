import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const path = 'archive-work/textbooks/visang-common2/middle/유리함수와 무리함수/js/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1.js';
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path,'utf8').replace('\\nwindow.questionBank',String.fromCharCode(10)+'window.questionBank').replace(/;\\n$/,';'),context);
const qs=context.window.questionBank;
qs[0].answer='(1) $\\dfrac{x-1}{x(x+1)}$  (2) $\\dfrac{2}{x(x-2)}$';
qs[9].subUnitKey='H22-C2-09-FUNCTION_INVERSE';
qs[9].subUnit='역함수';
qs[10].content=qs[10].content.replace('$R$라 할 때','$R$라고 할 때');
qs[10].content=qs[10].content.replace('+1;(x>2)', '+1\\;(x>2)');
qs[11].solution='곡선 $A$는 $x\\ge3$에서 시작점 $(3,1)$을 지나 오른쪽으로 갈수록 감소한다.\n자연수 $m=1$이면 직선 $y=x-2$도 점 $(3,1)$을 지나므로 두 그래프는 만난다.\n$m=2$이면 직선은 $x=3$일 때 $y=4$이고, 오른쪽으로 갈수록 증가한다. 곡선 $A$는 $1$ 이하에서 감소하므로 두 그래프는 만나지 않는다.\n$m=1$은 조건을 만족하지 않고 $m=2$는 만족하므로, 교점이 없도록 하는 자연수 $m$의 최솟값은 $2$이다.';
qs[11].solutionImage='assets/images/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1/q12_intersection-threshold.svg';
qs[11].solutionImageAlt='무리함수 y=-√(x-3)+1과 m=1, m=2일 때의 직선';
qs[11].solutionImageCaption='m=1일 때는 시작점에서 만나고, m=2일 때는 직선이 곡선보다 위에 있다.';
qs[11].solutionImageSize='large';
for(const q of qs){
 q.id='qid_v1_'+crypto.createHash('sha256').update(JSON.stringify({content:q.content,choices:q.choices})).digest('hex');
 q.difficultyBucket='UNKNOWN'; q.difficultyConfidence='UNKNOWN'; q.difficultyBoundaryFlag='UNKNOWN'; q.legacyLevelCompatibility='UNKNOWN';
}
fs.writeFileSync(path,`window.examTitle = ${JSON.stringify(context.window.examTitle)};\nwindow.questionBank = ${JSON.stringify(qs,null,2)};\n`,'utf8');
