import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const repairDir = 'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/intake-repair';
const target = 'archive/exams/original/high/h2/1mid/24_순천여고_1학기_중간_고2_확률과통계.js';
const ctx={window:{}}; vm.runInNewContext(fs.readFileSync(target,'utf8'),ctx);
const qs=ctx.window.questionBank;
const set=(id,values)=>Object.assign(qs.find(q=>q.id===id),values);
const question=(content,choices,score,page,type='multiple_choice')=>({content,choices,score,page,type});
set(1,{...question('다음 중 값이 가장 큰 것은? [3.2]',[
  String.raw`$_{2}\mathrm{H}_{8}$`,String.raw`$_{7}\mathrm{H}_{3}$`,String.raw`$_{6}\mathrm{C}_{3}$`,String.raw`$_{4}\mathrm{P}_{3}$`,String.raw`$_{3}\Pi_{4}$`
],3.2,1), question:'다음 중 값이 가장 큰 것은? [3.2]', tags:undefined});
set(2,{...question('두 학생 $A$, $B$를 포함한 7명의 학생이 있다. 이 7명의 학생 중에서 $A$, $B$를 포함하여 5명의 학생을 선택 후, 이 5명의 학생을 모두 원 모양의 탁자에 일정한 간격으로 둘러앉게 할 때, $A$와 $B$가 이웃하도록 앉는 경우의 수는? [3.6]',[
  '114','116','118','120','122'
],3.6,1), question:'두 학생 $A$, $B$를 포함한 7명의 학생이 있다. 이 7명의 학생 중에서 $A$, $B$를 포함하여 5명의 학생을 선택 후, 이 5명의 학생을 모두 원 모양의 탁자에 일정한 간격으로 둘러앉게 할 때, $A$와 $B$가 이웃하도록 앉는 경우의 수는? [3.6]', tags:undefined});
set(3,{question:'9개의 알파벳 $E, M, E, R, G, E, N, C, Y$를 다음 조건에 맞도록 모두 일렬로 나열하는 경우의 수는? [3.7]\n\n(가) $M$은 $N$보다 왼쪽에 위치한다.\n(나) $C$는 $N$보다 오른쪽에 위치한다.\n(다) $R$과 $G$는 항상 이웃한다.',choices:['2040','2140','2240','2340','2440'],score:3.7,page:1,tags:undefined});
set(4,{question:'$a, a, a, b, b, c$의 6개의 문자를 일렬로 배열할 때, $a$ 문자는 이웃하지 않는 경우의 수는? [3.4]',choices:['10','11','12','13','14'],score:3.4,page:1,tags:undefined});
set(5,{question:'$\\left(x^2-\\dfrac{2}{x}\\right)^6$의 전개식에서 상수항은? [3.7]',choices:['200','210','220','230','240'],score:3.7,page:1,tags:undefined});
set(6,{question:'서로 다른 종류의 사탕 4개와 같은 종류의 쿠키 4개를 다음의 조건에 맞추어 $A$, $B$, $C$ 세 사람에게 남김없이 나누어 줄 수 있는 경우의 수는? [3.8]\n\n(가) 사탕을 한 개도 못 받은 사람이 있을 수 있다.\n(나) 세 사람이 적어도 한 개씩 쿠키를 받는다.',choices:['237','239','241','243','245'],score:3.8,page:1,tags:undefined});
set(12,{question:'1부터 6까지의 자연수가 하나씩 적혀 있는 6개의 의자가 있다. 이 6개의 의자를 일정한 간격을 두고 원형으로 배열할 때, 서로 이웃한 2개의 의자에 적혀 있는 수의 합이 10 이상인 경우가 존재하도록 배열하는 경우의 수는? [4.3] (단, 회전하여 일치하는 것은 같은 것으로 본다.)',choices:['68','72','76','80','84'],score:4.3,page:2,image:'assets/images/24_순천여고_1학기_중간_고2_확률과통계/q12_source-correction.png',tags:undefined});
const group16='[16~17] 아래 그림과 같이 정사각형 4개로 이루어진 정사각형에 서로 다른 4가지 색을 사용하여 색칠하려고 할 때, 다음 물음에 답하시오. (단, 한 정사각형에는 한 가지 색만 칠하고, 회전하여 일치하는 것은 같은 것으로 본다.)';
set(16,{question:`${group16}\n\n16. 서로 다른 4가지 색 모두를 사용하여 칠하는 경우의 수를 구하면? [3.3]`,choices:['6','8','10','12','14'],score:3.3,page:3,image:'assets/images/24_순천여고_1학기_중간_고2_확률과통계/q16_source-correction.png',tags:undefined});
set(17,{question:`${group16}\n\n17. 서로 다른 4가지 색 중 2가지 색을 사용하여 칠하는 경우의 수를 구하면? (단, 색을 중복해서 사용할 수 있고, 인접한 영역의 색이 같을 수 있다.) [4.7]`,choices:['16','18','20','22','24'],score:4.7,page:3,image:'assets/images/24_순천여고_1학기_중간_고2_확률과통계/q16_source-correction.png',tags:undefined});
const group1819='[18~19] 0, 1, 2, 3, 4 다섯 개의 숫자 중에서 중복을 허락하여 만들 수 있는 자연수를 아래와 같이 작은 것부터 차례대로 나열했을 때, 다음 물음에 답하시오.\n\n1, 2, 3, 4, 10, 11, 12, 13, 14, 20, ⋯';
set(18,{question:`${group1819}\n\n18. ‘2000’은 몇 번째 오는 수인지 구하면? [4.2]`,choices:['247','248','249','250','251'],score:4.2,page:3,tags:undefined});
set(19,{question:`${group1819}\n\n19. 200번째 오는 수는 무엇인지 구하면? [4.6]`,choices:['1243','1244','1300','1301','1302'],score:4.6,page:3,tags:undefined});
set(21,{question:'[서술형1] $a, a, b, b, c, c$의 6개의 문자를 일렬로 배열할 때, 같은 문자는 서로 이웃하지 않도록 배열하는 경우의 수를 구하시오. [6.0점]',choices:[],score:6.0,type:'short_answer',page:4,tags:undefined});
set(22,{question:'[서술형2] ${}_8\\mathrm{C}_1(2+1)+{}_8\\mathrm{C}_2(2^2+1)+{}_8\\mathrm{C}_3(2^3+1)+\\cdots+{}_8\\mathrm{C}_8(2^8+1)$ 값과 $a^n+b^n+c$ 값이 같을 때, 정수 $a, b, c, n$의 값을 구하시오. (단, $a<b$이다.) [7.0점]',choices:[],score:7.0,type:'short_answer',page:4,tags:undefined});
set(23,{question:'[서술형3] 남자 5명과 여자 4명이 보드게임을 하기 위해 아래 그림과 같은 정삼각형 모양의 탁자에 둘러앉으려고 한다. 이때 삼각형의 모든 모서리에 적어도 1명의 남자가 앉는 경우의 수가 $n\\times 6!$일 때, 자연수 $n$의 값을 구하시오. (단, 회전하여 일치하는 것은 같은 것으로 본다.) [7.0점]',choices:[],score:7.0,type:'short_answer',page:4,image:'assets/images/24_순천여고_1학기_중간_고2_확률과통계/q23_source-correction.png',tags:undefined});
// q20 image is an existing asset in the submitted extraction but its bytes must remain immutable here.
set(20,{question:'다음 그림과 같은 도로망이 있다.  출발하여  최단 거리로 가는 경우의 수를 구하면? [4.5]',image:'assets/images/24_순천여고_1학기_중간_고2_확률과통계/q20_source-correction.png',tags:undefined});
for (const q of qs) { delete q.tags; q.answer=''; q.solution=''; }
const out=`window.examTitle = ${JSON.stringify('24_순천여고_1학기_중간_고2_확률과통계')};\nwindow.questionBank = ${JSON.stringify(qs,null,2)};\n`;
fs.writeFileSync(path.join(repairDir,'24_순천여고_1학기_중간_고2_확률과통계.source-only-candidate.js'),out,'utf8');
console.log('candidate written',qs.length,qs.filter(q=>q.type==='multiple_choice').length,qs.filter(q=>q.type==='short_answer').length);
