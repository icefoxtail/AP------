import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const production='archive/exams/original/high/h2/1mid/18_강남여고_1학기_중간_고2_확률과통계.js';
const basePath='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_강남여고_1학기_중간_고2_확률과통계/input-baseline.js';
const baseRaw=fs.readFileSync(basePath); const baseSha=crypto.createHash('sha256').update(baseRaw).digest('hex').toUpperCase();
const box={window:{}}; vm.runInNewContext(baseRaw.toString('utf8'),box,{timeout:5000});
const examTitle=box.window.examTitle; const questions=box.window.questionBank;
if(questions.length!==25)throw Error('SOURCE_DENOMINATOR_MISMATCH');
const h=s=>crypto.createHash('sha256').update(String(s),'utf8').digest('hex');
const prodRel=production.replaceAll('\\','/');
const choices={1:'②',2:'④',3:'④',4:'③',5:'①',6:'⑤',7:'②',8:'③',9:'④',10:'⑤',12:'②',13:'⑤',14:'③',15:'②',16:'①',17:'④',18:'②',19:'①',20:'⑤',21:'④',22:'⑤'};
const answers={
1:choices[1],2:choices[2],3:choices[3],4:choices[4],5:choices[5],6:choices[6],7:choices[7],8:choices[8],9:choices[9],10:choices[10],
11:'48',12:choices[12],13:choices[13],14:choices[14],15:choices[15],16:choices[16],17:choices[17],18:choices[18],19:choices[19],20:choices[20],21:choices[21],22:choices[22],
23:'141',24:String.raw`⑴ ${String.raw`\binom{4}{r}\binom{n}{s}x^{r+2s}`} (0≤r≤4, 0≤s≤n), ⑵ n=6`,25:String.raw`⑴ 2회, ⑵ \frac{40}{243}`
};
const solutions={
1:String.raw`서로 다른 5개에서 순서를 고려하지 않고 3개를 고르므로 조합을 사용한다.
${String.raw`{}_5\mathrm{C}_3=\frac{5\cdot4\cdot3}{3\cdot2\cdot1}=10`}이다.
따라서 정답은 ②이다.`,
2:String.raw`첫 번째 괄호에서는 a, b 중 한 항을 고른다. 두 번째 괄호에서는 x, y, z 중 한 항을 고른다.
두 선택은 서로 독립적으로 이루어지므로 곱의 법칙을 적용한다.
항의 개수는 ${String.raw`2\cdot3=6`}이다.
따라서 정답은 ④이다.`,
3:String.raw`원형 놀이기구에서는 회전하여 같아지는 배치를 하나로 본다. 한 사람의 자리를 고정하면 나머지 5명을 배열하면 된다.
${String.raw`(6-1)!=5!=120`}이다.
혜민이와 지성이도 6명 중 서로 다른 두 사람이므로 별도의 추가 선택은 없다.
따라서 정답은 ④이다.`,
4:String.raw`쇼핑백과 옷이 각각 서로 구별되지 않으므로 담는 방법은 9를 4개의 양의 정수로 분할하는 경우와 같다.
가능한 분할은 ${String.raw`6+1+1+1,;5+2+1+1,;4+3+1+1,;4+2+2+1,;3+3+2+1,;3+2+2+2`}이다.
빈 쇼핑백이 없다는 조건을 만족하는 분할은 모두 6가지이다.
따라서 정답은 ③이다.`,
5:String.raw`일반항에서 ${String.raw`(-3/x)^k`}를 고르면 x의 지수는 ${String.raw`6-k-k=6-2k`}이다.
${String.raw`6-2k=4`}이므로 ${String.raw`k=1`}이다.
x⁴의 계수는 ${String.raw`{}_6\mathrm{C}_1\cdot2^5\cdot(-3)=-6\cdot32\cdot3=-576`}이다.
따라서 정답은 ①이다.`,
6:String.raw`전체 경우는 주머니의 공 5개 중 2개를 고르는 ${String.raw`{}_5\mathrm{C}_2=10`}가지이다.
빨간 공 1개와 파란 공 1개를 고르는 경우는 ${String.raw`{}_3\mathrm{C}_1\cdot{}_2\mathrm{C}_1=6`}가지이다.
따라서 확률은 ${String.raw`6/10=3/5`}이므로 ${String.raw`q=3,;p=5`}이다.
${String.raw`p+q=8`}이므로 정답은 ⑤이다.`,
7:String.raw`5개의 모터 중 작동하는 3개를 고르는 경우는 ${String.raw`{}_5\mathrm{C}_3=10`}가지이다.
각 경우의 확률은 ${String.raw`(2/3)^3(1/3)^2`}이다.
따라서 구하는 확률은 ${String.raw`{}_5\mathrm{C}_3(2/3)^3(1/3)^2=10\cdot8/243=80/243`}이다.
따라서 정답은 ②이다.`,
8:String.raw`짝수가 되려면 일의 자리에 2 또는 4가 와야 하므로 마지막 자리는 2가지로 정한다.
남은 네 숫자를 앞의 네 자리에 배열하는 방법은 ${String.raw`4!=24`}가지이다.
따라서 전체 방법의 수는 ${String.raw`2\cdot4!=48`}이므로 정답은 ③이다.`,
9:String.raw`네 사람을 원형의 탁자에 앉히는 방법은 회전을 같은 것으로 보아 ${String.raw`(4-1)!=6`}가지이다.
서로 다른 과일 5개 중 4개를 골라 네 사람에게 하나씩 주는 방법은 ${String.raw`{}_5\mathrm{P}_4=5\cdot4\cdot3\cdot2=120`}가지이다.
두 선택을 함께 하면 ${String.raw`6\cdot120=720`}가지이다.
따라서 정답은 ④이다.`,
10:String.raw`A가 받는 연필 수에 따라 나눈다.
A가 0자루 받으면 각 연필을 B 또는 C에게 주므로 ${String.raw`2^6=64`}가지이다.
A가 1자루 받으면 그 연필을 고르는 방법은 6가지이고, 나머지 5자루를 B 또는 C에게 주는 방법은 ${String.raw`2^5=32`}가지이다.
따라서 전체는 ${String.raw`2^6+6\cdot2^5=64+192=256`}가지이므로 정답은 ⑤이다.`,
11:String.raw`그림에서 오른쪽 방향을 7번, 아래 방향을 3번 이동한다. 세 번 아래로 이동하는 열을 차례로 i, j, k라 하면 ${String.raw`0\le i\le j\le k\le7`}이다.
두 번째 아래 이동은 그림의 세로 도로가 이어진 열 ${String.raw`j=0,5,6,7`}에서만 가능하다.
${String.raw`j=0`}일 때 경로는 ${String.raw`1\cdot8=8`}가지이다. ${String.raw`j=5`}일 때는 ${String.raw`6\cdot3=18`}가지이다. ${String.raw`j=6`}일 때는 ${String.raw`7\cdot2=14`}가지이다. ${String.raw`j=7`}일 때는 ${String.raw`8\cdot1=8`}가지이다.
따라서 그림의 최단경로는 ${String.raw`8+18+14+8=48`}가지이다. 그러나 제시된 보기 82, 96, 120, 144, 160 중 48은 없다.
문제 그림·발문·보기는 원문 그대로 보존하고, 정답 선택지가 없는 원문 결함으로 이 문항을 HOLD한다.`,
12:String.raw`x, y, z는 음이 아닌 정수이고 합이 5이다. 별 5개와 구분막대 2개를 배열하는 별과 막대 방법을 쓴다.
${String.raw`x+y+z=5`}의 해의 수는 ${String.raw`\binom{5+3-1}{3-1}=\binom{7}{2}=21`}이다.
따라서 정답은 ②이다.`,
13:String.raw`각 팀은 비어 있지 않고 인원수가 서로 달라야 한다. 8을 세 개의 서로 다른 양의 정수로 나누는 경우는 ${String.raw`1+3+4`}와 ${String.raw`1+2+5`}뿐이다.
팀은 이름이 주어지지 않았으므로 각 크기별 사람을 나누는 방법을 더한다.
${String.raw`1+3+4`}인 경우는 ${String.raw`\frac{8!}{1!3!4!}=280`}가지이다.
${String.raw`1+2+5`}인 경우는 ${String.raw`\frac{8!}{1!2!5!}=168`}가지이다.
따라서 ${String.raw`m+n=280+168=448`}이므로 정답은 ⑤이다.`,
14:String.raw`7을 1, 2, 3만 사용하여 분할한다. 3의 개수를 c라 두고 경우를 나눈다.
c=0이면 2의 개수는 0, 1, 2, 3으로 4가지이다.
c=1이면 남은 합은 4이므로 2의 개수는 0, 1, 2로 3가지이다.
c=2이면 남은 합은 1이므로 1가지이다.
따라서 서로 다른 분할의 수는 ${String.raw`4+3+1=8`}이므로 정답은 ③이다.`,
15:String.raw`이항정리에 의해 ${String.raw`(1-1)^{30}=\sum_{k=0}^{30}(-1)^k{}_{30}\mathrm{C}_k=0`}이다.
끝의 두 항은 ${String.raw`(-1)^{29}{}_{30}\mathrm{C}_{29}+{}_{30}\mathrm{C}_{30}=-30+1=-29`}이다.
따라서 ${String.raw`\sum_{k=0}^{28}(-1)^k{}_{30}\mathrm{C}_k=29`}이고, k=0 항을 빼면 ${String.raw`\sum_{k=1}^{28}(-1)^k{}_{30}\mathrm{C}_k=28`}이다.
문제의 부호는 이를 반대로 시작하므로 구하는 값은 ${String.raw`-28`}이다. 따라서 정답은 ②이다.`,
16:String.raw`주사위 두 번의 전체 순서쌍은 ${String.raw`6^2=36`}가지이다.
합이 10 이상인 경우는 (4,6), (5,5), (6,4), (5,6), (6,5), (6,6)의 6가지이다.
따라서 확률은 ${String.raw`6/36=1/6`}이므로 정답은 ①이다.`,
17:String.raw`1부터 30까지 짝수 카드 15장, 홀수 카드 15장이 있다. 두 수의 합이 홀수인 경우는 짝수 1장과 홀수 1장을 고르는 ${String.raw`15\cdot15=225`}가지이다.
두 장이 모두 짝수인 경우는 ${String.raw`\binom{15}{2}=105`}가지이다. 두 사건은 서로 겹치지 않는다.
전체 두 장 선택은 ${String.raw`\binom{30}{2}=435`}가지이므로 구하는 확률은 ${String.raw`(225+105)/435=330/435=22/29`}이다.
따라서 정답은 ④이다.`,
18:String.raw`전체 10명 중 4명을 뽑는 방법은 ${String.raw`\binom{10}{4}=210`}가지이다.
여자가 2명인 경우는 ${String.raw`\binom{4}{2}\binom{6}{2}=90`}가지, 3명인 경우는 ${String.raw`\binom{4}{3}\binom{6}{1}=24`}가지, 4명인 경우는 ${String.raw`\binom{4}{4}=1`}가지이다.
따라서 여자를 2명 이상 뽑을 확률은 ${String.raw`(90+24+1)/210=115/210=23/42`}이다.
따라서 정답은 ②이다.`,
19:String.raw`첫 번째로 수영이가 당첨제비를 뽑을 확률은 ${String.raw`5/20`}이다. 당첨제비 하나가 빠진 뒤 종찬이가 남은 당첨제비 4개 중 하나를 뽑을 확률은 ${String.raw`4/19`}이다.
두 사건이 차례로 일어나므로 확률을 곱한다.
${String.raw`(5/20)(4/19)=1/19`}이므로 정답은 ①이다.`,
20:String.raw`당선자는 갑, 을, 병 중 한 명이므로 세 경우를 나누어 버스 노선이 개편될 확률을 더한다.
갑의 경우는 ${String.raw`(3/10)(4/5)=24/100`}이다.
을의 경우는 ${String.raw`(1/2)(1/10)=5/100`}이다.
병의 경우는 ${String.raw`(1/5)(2/5)=8/100`}이다.
따라서 전체 확률은 ${String.raw`24/100+5/100+8/100=37/100`}이므로 정답은 ⑤이다.`,
21:String.raw`주사위의 6의 약수 사건 A는 ${String.raw`A=\{1,2,3,6\}`}이므로 ${String.raw`P(A)=4/6=2/3`}이다.
${String.raw`|A\cap B|=x,;|A^c\cap B|=y`}라 두면 ${String.raw`P(A\cap B)=x/6,;P(B)=(x+y)/6`}이다.
독립 조건 ${String.raw`P(A\cap B)=P(A)P(B)`}을 대입하면 ${String.raw`x/6=(2/3)(x+y)/6`}이므로 ${String.raw`x=2y`}이다.
${String.raw`0\le x\le4,;0\le y\le2`}에서 가능한 ${String.raw`(x,y)`}는 ${String.raw`(0,0),(2,1),(4,2)`}이다.
따라서 사건 B의 수는 ${String.raw`\binom40\binom20+\binom42\binom21+\binom44\binom22=1+12+1=14`}이므로 정답은 ④이다.`,
22:String.raw`홀수는 1, 3, 5의 3개이고 짝수는 2, 4의 2개이다. 세 번 뽑은 수의 합이 홀수이려면 홀수가 1개 또는 3개 나와야 한다.
홀수가 1개 나오는 경우는 ${String.raw`\binom31\cdot3\cdot2^2=36`}가지이다.
홀수가 3개 나오는 경우는 ${String.raw`3^3=27`}가지이다.
전체는 ${String.raw`5^3=125`}가지이므로 확률은 ${String.raw`(36+27)/125=63/125`}이다. 따라서 정답은 ⑤이다.`,
23:String.raw`f는 A의 네 원소를 서로 다른 네 값에 순서대로 대응시키므로 엄격히 증가하는 함수의 수는 ${String.raw`\binom64=15`}이다.
g는 여섯 값 중 중복을 허용하여 네 값을 비내림차순으로 고르는 것과 같다. 중복조합의 별과 막대 방법을 쓰면 ${String.raw`\binom{6+4-1}{4}=\binom94=126`}이다.
따라서 ${String.raw`m+n=15+126=141`}이다.`,
24:String.raw`(1)의 첫 번째 인수에서 x^r, 두 번째 인수에서 x^{2s}를 고르면 일반항은 ${String.raw`T_{r,s}=\binom4r\binom ns x^{r+2s}`}이다. 여기서 ${String.raw`0\le r\le4,;0\le s\le n`}이다.
(2) x²항은 ${String.raw`(r,s)=(2,0)`} 또는 ${String.raw`(r,s)=(0,1)`}에서 나온다.
따라서 x²의 계수는 ${String.raw`\binom42\binom n0+\binom40\binom n1=6+n`}이다.
${String.raw`6+n=12`}이므로 ${String.raw`n=6`}이다.`,
25:String.raw`6의 약수 눈은 1, 2, 3, 6의 네 가지이므로 한 번 던져 약수의 눈이 나올 확률은 ${String.raw`4/6=2/3`}이다.
다섯 번 중 약수의 눈이 k번 나오면 위치 변화량은 ${String.raw`2k-(5-k)=3k-5`}이다.
점이 1에 있으려면 ${String.raw`3k-5=1`}이므로 ${String.raw`k=2`}번 나와야 한다.
따라서 그 확률은 ${String.raw`\binom52(2/3)^2(1/3)^3=10\cdot4/9\cdot1/27=40/243`}이다.`
};
const units={
1:{key:'H15-PS-01',label:'순열과 조합',order:1},2:{key:'H15-PS-02',label:'이항정리',order:2},3:{key:'H15-PS-03',label:'확률의 뜻과 활용',order:3},4:{key:'H15-PS-04',label:'조건부확률',order:4}
};
const sub={
'01P':['H15-PS-01-PERMUTATION','순열'],'01C':['H15-PS-01-COMBINATION','조합'],'01A':['H15-PS-01-COUNTING_APPLICATION','경우의 수의 활용'],
'02B':['H15-PS-02-BINOMIAL_BASIC','이항정리'],'02C':['H15-PS-02-BINOMIAL_COEFFICIENT','이항계수와 계수비교'],
'03B':['H15-PS-03-PROBABILITY_BASIC','확률의 뜻과 활용'],'03D':['H15-PS-03-PROBABILITY_ADDITION','확률의 덧셈정리'],'03A':['H15-PS-03-PROBABILITY_APPLICATION','확률의 활용'],
'04C':['H15-PS-04-CONDITIONAL_PROBABILITY','조건부확률'],'04B':['H15-PS-04-CONDITIONAL_BASIC','조건부확률'],'04I':['H15-PS-04-INDEPENDENCE','독립사건과 곱셈정리'],'04T':['H15-PS-04-TOTAL_BAYES','전확률과 베이즈']
};
const meta={
1:{u:1,s:'01C',p:'PT_COUNTING_SELECTION_DISTRIBUTION',t:'TPL_COMBINATION_SELECTION',rpm:['경우의 수','순열과 조합','조합','선택'],method:'5개 중 순서 없이 3개를 선택하는 조합',integration:'NONE',condition:[],cross:[],level:'하',bucket:1,diff:'선택 조건이 없는 한 단계 조합 계산',visual:'문제 조건이 식에 완전히 표현되며 별도 그림이 필요 없다.'},
2:{u:1,s:'01A',p:null,t:null,rpm:['경우의 수','순열과 조합',null,null],method:'두 괄호에서 항을 하나씩 고르는 곱의 법칙',integration:'NONE',condition:[],cross:[],level:'하',bucket:1,diff:'두 유한 선택을 곱하는 단일 원리 적용',debt:['problemTypeKey','templateKey'],debtReason:'현재 H2 확률통계 crosswalk와 ACTIVE taxonomy/bindings에서 분배법칙으로 생성된 항 개수를 위한 exact PT/TPL pair가 확인되지 않았다. q02의 product rule 의미를 승인된 canonical mapping으로 연결하는 근거가 필요하다.',visual:'식 자체가 모든 선택을 직접 보여 주며 diagram이 중복이다.'},
3:{u:1,s:'01P',p:'PT_COUNTING_ARRANGEMENT',t:'TPL_CIRCULAR_PERMUTATION',rpm:['경우의 수','순열과 조합','순열','중복·원순열'],method:'원형 배치를 회전 동치로 나누는 원순열',integration:'NONE',condition:[],cross:[],level:'중',bucket:2,diff:'회전 동치 처리 뒤 5!를 계산하는 단일 원순열',visual:'문제의 놀이기구 이미지는 조건과 자리 배치를 충분히 전달하며 해설은 (n-1)! 계산만 한다.'},
4:{u:1,s:'01C',p:'PT_COUNTING_SELECTION_DISTRIBUTION',t:'TPL_REPEATED_COMBINATION_DISTRIBUTION',rpm:['경우의 수','순열과 조합','조합','분할·분배'],method:'동일한 9개를 비어 있지 않은 동일한 4개 묶음으로 나누는 정수분할',integration:'CASE_BRANCH',condition:['COND_POSITIVE'],cross:[],level:'중',bucket:3,diff:'동일 상자 분할에서 가능한 크기분할을 빠짐없이 나열',visual:'유한한 정수분할 목록이 해설의 독립 block으로 충분히 확인된다.'},
5:{u:2,s:'02B',p:'PT_BINOMIAL_THEOREM',t:'TPL_BINOMIAL_TERM_COEFFICIENT',rpm:['경우의 수','이항정리','이항정리','특정 항의 계수'],method:'일반항의 x 지수로 k를 정한 뒤 계수를 계산',integration:'SEQUENTIAL',condition:[],cross:[],level:'중',bucket:2,diff:'일반항 지수 비교 후 한 항의 계수 계산',visual:'지수 비교와 한 번의 계수 대입으로 완결된다.'},
6:{u:3,s:'03B',p:'PT_PROBABILITY_PROPERTIES_APPLICATION',t:'TPL_PROBABILITY_BASIC_COUNT_RATIO',rpm:['확률','확률의 뜻과 활용','확률의 기본','확률 계산'],method:'동일 가능 공 뽑기 결과에서 유리한 조합 수/전체 조합 수',integration:'SEQUENTIAL',condition:[],cross:['CC_COMBINATORICS_COUNTING'],level:'하',bucket:2,diff:'조합 개수의 비를 약분하는 직접 확률 계산',visual:'기존 주머니 그림이 색별 공의 구성을 충분히 보여 준다.'},
7:{u:4,s:'04B',p:'PT_PROBABILITY_REPEATED_TRIALS',t:'TPL_INDEPENDENT_TRIAL_PROBABILITY',rpm:['확률','조건부확률','독립시행','이항형 시행'],method:'5회 독립 시행에서 작동 3회인 이항형 확률',integration:'SEQUENTIAL',condition:[],cross:['CC_COMBINATORICS_COUNTING'],level:'중',bucket:2,diff:'독립 시행의 고정 성공 횟수에 이항계수와 곱셈 적용',visual:'성공 횟수별 항이 공식에 바로 나타나므로 추가 그림이 불필요하다.'},
8:{u:1,s:'01P',p:'PT_COUNTING_ARRANGEMENT',t:'TPL_PERMUTATION_STANDARD_CONSTRAINT',rpm:['경우의 수','순열과 조합','순열','일렬 배열'],method:'짝수 끝자리 2가지를 먼저 정한 뒤 나머지를 배열',integration:'SEQUENTIAL',condition:[],cross:[],level:'하',bucket:2,diff:'끝자리 조건 분리 후 4!를 곱함',visual:'끝자리 경우와 앞자리 배열 식만으로 조건이 완전히 드러난다.'},
9:{u:1,s:'01P',p:'PT_COUNTING_ARRANGEMENT',t:'TPL_CIRCULAR_PERMUTATION',rpm:['경우의 수','순열과 조합','순열','중복·원순열'],method:'4인 원순열과 서로 다른 과일의 5P4 배정을 곱함',integration:'SEQUENTIAL',condition:[],cross:[],level:'중',bucket:3,diff:'원형 회전 동치와 과일의 순서 있는 선택 두 구조를 결합',visual:'회전 동치는 원순열 식이 처리하며 추가 공간관계가 없다.'},
10:{u:1,s:'01A',p:'PT_COUNTING_REPEATED_ASSIGNMENT',t:'TPL_REPEATED_PERMUTATION_ASSIGNMENT',rpm:['경우의 수','순열과 조합',null,null],method:'각 연필의 수령인을 반복 배정하고 A의 수령 수 0 또는 1로 분기',integration:'CASE_BRANCH',condition:['COND_RANGE'],cross:[],level:'중',bucket:3,diff:'A의 수령량 두 경우를 분리하여 나머지 배정을 계산',debt:['rpmL3','rpmL4'],debtReason:'RPM Primary의 현재 2015 확률과통계 L3/L4 draft에는 서로 다른 물건을 사람에게 반복 배정하고 한 수령인의 개수를 제한하는 exact leaf가 없다. 순열/중복조합으로 임의 대입하지 않고 해당 L3/L4를 EVIDENCE_DEBT로 남긴다.',visual:'A의 수령량 0/1 두 경우가 표 없이도 식과 별도 문단으로 명확하다.'},
11:{u:1,s:'01A',p:null,t:null,rpm:['경우의 수','순열과 조합',null,null],method:'원문 그림의 짧은 경로 계수는 48이나 보기에 일치 답이 없음',integration:'CASE_BRANCH',condition:['COND_RANGE'],cross:[],level:'중',bucket:3,diff:'격자에서 아래 이동 열의 제한을 세는 경로 계수',debt:['problemTypeKey','templateKey','rpmL3','rpmL4'],debtReason:'원문 그림/발문과 제시 보기 82,96,120,144,160이 충돌한다. 그림의 이동열 계수는 48이지만 answer-cardinality가 0이므로 route-count key를 임의 확정하지 않는다. exact item correction authority가 필요하다.',visual:'문제에는 원본 도로망 그림이 필수다. 해설에는 아래 방향 도로의 허용 열별 경로 수를 표시하는 보조 표시가 BENEFICIAL이나, 원문 HOLD 해제 전에는 학생용 solution visual을 만들지 않는다.'},
12:{u:1,s:'01C',p:'PT_COUNTING_SELECTION_DISTRIBUTION',t:'TPL_REPEATED_COMBINATION_DISTRIBUTION',rpm:['경우의 수','순열과 조합','중복조합','정수해 개수'],method:'음이 아닌 정수해를 별과 막대로 세기',integration:'NONE',condition:['COND_INTEGER'],cross:[],level:'중',bucket:2,diff:'별과 막대 한 번으로 3변수 정수해 수 계산',visual:'별과 막대 식이 해설의 전체 구조를 직접 보여 준다.',conditionDebt:{field:'nonnegativeIntegerCondition',reason:'현재 Condition Registry에 정확한 COND_NONNEGATIVE_INTEGER 키가 없으므로 COND_INTEGER만 기록하고 x,y,z≥0의 별도 세부 키는 EVIDENCE_DEBT로 남긴다.'}},
13:{u:1,s:'01C',p:'PT_COUNTING_SELECTION_DISTRIBUTION',t:'TPL_COMBINATION_SELECTION',rpm:['경우의 수','순열과 조합','조합','분할·분배'],method:'8명의 사람을 서로 다른 크기의 무기명 팀으로 분할하고 크기형별 multinomial 수를 더함',integration:'CASE_BRANCH',condition:['COND_POSITIVE'],cross:[],level:'중',bucket:3,diff:'가능한 서로 다른 양의 크기 분할 2종을 찾아 다항계수 합산',visual:'크기 분할 2종을 번호 block으로 나누어 완전하게 설명한다.'},
14:{u:1,s:'01C',p:'PT_COUNTING_SELECTION_DISTRIBUTION',t:'TPL_REPEATED_COMBINATION_DISTRIBUTION',rpm:['경우의 수','순열과 조합','중복조합','중복을 허용한 선택'],method:'3의 개수 c별로 7의 분할을 세기',integration:'CASE_BRANCH',condition:['COND_NATURAL_NUMBER','COND_RANGE'],cross:[],level:'중',bucket:3,diff:'허용 부분 크기 1,2,3에 맞춰 c=0,1,2 세 경우를 조사',visual:'c의 값에 따른 세 경우를 텍스트 수식 block으로 완결한다.'},
15:{u:2,s:'02C',p:'PT_BINOMIAL_THEOREM',t:'TPL_BINOMIAL_COEFFICIENT_IDENTITY',rpm:['경우의 수','이항정리','이항계수','조합 항등식'],method:'(1-1)^30 전체 합에서 k=29,30 꼬리항을 제거하고 부호를 반전',integration:'SEQUENTIAL',condition:['COND_RANGE'],cross:[],level:'상',bucket:4,diff:'교대 이항합의 전체 항등식과 잘린 꼬리 두 항을 연쇄 적용',visual:'전체합/꼬리항/목표합의 등식 전개가 관계를 모두 보인다.',projectionDebt:{field:'curriculumBinding',reason:'crosswalk H2-PS-RPM-010은 DIRECT_BINDING_GAP으로 기록되어 있다. ACTIVE PT/TPL은 보존하되 H15-PS-02-BINOMIAL_COEFFICIENT exact binding 추가 근거가 필요하다.'}},
16:{u:3,s:'03B',p:'PT_PROBABILITY_PROPERTIES_APPLICATION',t:'TPL_PROBABILITY_BASIC_COUNT_RATIO',rpm:['확률','확률의 뜻과 활용','확률의 기본','확률 계산'],method:'36개 순서쌍에서 합이 10 이상인 6개를 직접 센다',integration:'NONE',condition:[],cross:['CC_COMBINATORICS_COUNTING'],level:'하',bucket:2,diff:'주사위 결과 36개와 유리한 6개를 직접 열거',visual:'작은 유한 표본공간을 식과 여섯 순서쌍으로 완전히 나타낸다.'},
17:{u:3,s:'03D',p:'PT_PROBABILITY_PROPERTIES_APPLICATION',t:'TPL_EVENT_RELATION_COMPLEMENT_ADDITION',rpm:['확률','확률의 뜻과 활용','확률의 덧셈정리','배반사건'],method:'합이 홀수인 사건과 둘 다 짝수인 배반사건의 경우 수를 더한다',integration:'SEQUENTIAL',condition:[],cross:['CC_COMBINATORICS_COUNTING'],level:'중',bucket:3,diff:'서로 배반인 두 경우를 확인하고 조합 수를 더한 뒤 약분',visual:'두 경우가 배반임을 글과 식으로 확인하며 그림이 추가 사실을 주지 않는다.'},
18:{u:3,s:'03A',p:'PT_PROBABILITY_PROPERTIES_APPLICATION',t:'TPL_PROBABILITY_BASIC_COUNT_RATIO',rpm:['확률','확률의 뜻과 활용','확률의 기본','확률 계산'],method:'여성 인원 2,3,4인 서로 배반인 표본을 조합 수로 세어 합산',integration:'CASE_BRANCH',condition:['COND_RANGE'],cross:['CC_COMBINATORICS_COUNTING'],level:'중',bucket:3,diff:'여성 수 조건을 3개의 독립 조합 경우로 나눔',visual:'각 여성 수의 선택 수를 세 개의 식 block으로 나누어 보인다.'},
19:{u:4,s:'04C',p:'PT_CONDITIONAL_PROBABILITY',t:'TPL_CONDITIONAL_PROBABILITY_DIRECT',rpm:['확률','조건부확률','조건부확률','조건부확률 계산'],method:'비복원 추출에서 두 번째 확률의 조건부 분모와 분자를 갱신',integration:'SEQUENTIAL',condition:[],cross:[],level:'하',bucket:2,diff:'두 단계 조건부확률을 곱함',visual:'갱신된 19개/4개 수식으로 단계가 드러나 별도 그림이 필요 없다.',conditionDebt:{field:'withoutReplacementCondition',reason:'Condition Registry에 비복원 추출을 정확히 뜻하는 key가 없어 조건 metadata를 유사한 키로 대체하지 않는다.'}},
20:{u:4,s:'04T',p:'PT_CONDITIONAL_PROBABILITY',t:'TPL_CONDITIONAL_BRANCH_REVERSE',rpm:['확률','조건부확률','조건부확률','조건부확률 계산'],method:'당선자 세 경우의 조건부확률을 곱해 전확률로 합산',integration:'CASE_BRANCH',condition:[],cross:[],level:'중',bucket:3,diff:'세 후보자 분기를 가진 전확률 계산',visual:'각 당선자 분기를 별도 식 block으로 합산해 보이며 트리 그림은 같은 내용을 반복한다.'},
21:{u:4,s:'04I',p:'PT_EVENT_INDEPENDENCE',t:'TPL_EVENT_INDEPENDENCE_JUDGMENT',rpm:['확률','조건부확률','사건의 독립','독립 판정'],method:'독립식을 사건 A 내부 x개/외부 y개로 바꿔 x=2y를 만족하는 부분집합을 센다',integration:'CASE_BRANCH',condition:[],cross:['CC_COMBINATORICS_COUNTING'],level:'상',bucket:4,diff:'독립 관계를 cardinality equation으로 바꾸고 제한된 정수 경우와 조합 수를 합산',visual:'A와 여집합의 4/2 분할은 해설의 x,y 정의로 충분하며 가능한 세 값 조합을 별도 수식 block으로 보인다.',projectionDebt:{field:'curriculumBinding',reason:'crosswalk H2-PS-RPM-016은 DIRECT_BINDING_GAP으로 기록되어 있다. H15-PS-04-INDEPENDENCE L2 binding 승인 근거가 필요하다.'}},
22:{u:4,s:'04B',p:'PT_PROBABILITY_REPEATED_TRIALS',t:'TPL_INDEPENDENT_TRIAL_PROBABILITY',rpm:['확률','조건부확률','독립시행','반복 시행의 확률'],method:'복원 시행 세 번의 홀수 개수 1 또는 3으로 parity 분기',integration:'CASE_BRANCH',condition:[],cross:['CC_COMBINATORICS_COUNTING'],level:'중',bucket:3,diff:'독립 반복 시행에서 홀수 성공 개수를 두 경우로 나눔',visual:'두 항의 이항계수 식이 경우별 수를 직접 나타낸다.',conditionDebt:{field:'parityCondition',reason:'현재 Condition Registry에 홀수합/짝수 패리티 전용 key가 없어 임의 key를 만들지 않는다.'}},
23:{u:1,s:'01A',p:'PT_FUNCTION_COUNTING',t:null,rpm:['경우의 수','순열과 조합','조합',null],method:'엄격증가 함수는 조합, 비내림차순 함수는 중복조합으로 각각 센 후 합산',integration:'CASE_BRANCH',condition:[],cross:[],level:'중',bucket:3,diff:'엄격/약한 증가 두 서로 다른 함수 조건을 별도 counting',debt:['templateKey','rpmL4'],debtReason:'ACTIVE PT_FUNCTION_COUNTING은 확인되지만 독립 strict-increasing/weakly-increasing 부분문항을 함께 묶는 exact TPL은 registry/crosswalk에서 확인되지 않는다. 하나의 조합 L4로 축약하지 않는다.',visual:'두 함수 조건을 각각 조합/중복조합 수식으로 보이며 공간 구조나 보조선이 없다.'},
24:{u:2,s:'02B',p:'PT_BINOMIAL_THEOREM',t:'TPL_BINOMIAL_TERM_COEFFICIENT',rpm:['경우의 수','이항정리','이항정리','특정 항의 계수'],method:'두 인수의 일반항을 곱해 지수 2가 되는 항 조합을 찾음',integration:'SEQUENTIAL',condition:['COND_NATURAL_NUMBER'],cross:[],level:'중',bucket:3,diff:'일반항 작성 후 두 지수 조합으로 계수식을 세워 자연수 n을 결정',visual:'(r,s)와 지수 r+2s 조건을 식으로 보이는 것으로 충분하다.'},
25:{u:4,s:'04B',p:'PT_PROBABILITY_REPEATED_TRIALS',t:'TPL_INDEPENDENT_TRIAL_PROBABILITY',rpm:['확률','조건부확률','독립시행','이항형 시행'],method:'위치 방정식으로 약수 눈이 두 번임을 정한 뒤 이항형 확률 계산',integration:'SEQUENTIAL',condition:['COND_INTEGER'],cross:['CC_COMBINATORICS_COUNTING'],level:'중',bucket:3,diff:'이동량 제약으로 성공 횟수를 구한 다음 이항확률을 계산',visual:'정수 k의 위치방정식과 성공횟수 확률식이 해설을 완전히 표현한다.',conditionDebt:{field:'exactSuccessCount',reason:'조건 registry에는 정확히 k회 성공 전용 key가 없으므로 임의 condition key 없이 정수 횟수 조건만 기록한다.'}}
};
const imgRef={3:'assets/images/18_강남여고_1학기_중간_고2_확률과통계/q03.png',6:'assets/images/18_강남여고_1학기_중간_고2_확률과통계/q06.png',11:'assets/images/18_강남여고_1학기_중간_고2_확률과통계/q11.png'};
for(const q of questions){const id=Number(q.id),m=meta[id],u=units[m.u],s=sub[m.s]; if(!m||!u||!s||!solutions[id]||answers[id]===undefined)throw Error('QID_CONFIGURATION_MISSING:'+id);
 const uid='qid_v1_'+h(prodRel+'#'+id);
 q.level=m.level; q.category=u.label; q.originalCategory='확률과 통계'; q.standardCourse='확률과 통계'; q.standardUnitKey=u.key; q.standardUnit=u.label; q.standardUnitOrder=u.order;
 q.questionType=q.questionType; q.layoutTag='grid'; q.tags=(id===3||id===6||id===11)?['문제그림']:((id>=23)?['서술형']:[]); q.wide=false;
 q.subUnitKey=s[0]; q.subUnit=s[1]; q.subUnitConfidence='candidate_evidence'; q.subUnitClassificationDepth='complete_candidate';
 q.problemTypeKey=m.p; q.templateKey=m.t; q.crossConceptKeys=m.cross; q.conditionKeys=m.condition; q.integrationPattern=m.integration;
 q.difficultyBucket=m.bucket; q.difficultyConfidence='high'; q.difficultyBoundaryFlag='NONE'; q.legacyLevelCompatibility='NORMAL';
 q.tagConfidence='medium'; q.tagStatus='manual_review';
 q.answer=answers[id]; q.solution=solutions[id];
 q.questionUid=uid; q.sourceQid=id; q.sourceMode='ORIGINAL'; q.sourceProvenance={sourceJsPath:prodRel,sourceExamUid:examTitle,sourceQid:id,sourceRawSha256:baseSha,sourceIntakeEvidencePath:'archive/analysis/source-only-h2-1mid-20261011-b5/18_강남여고_1학기_중간_고2_확률과통계.evidence.json',sourceIntakeEvidenceSha256:'9E10CCFBEF105B8B037DDE989AC596D3DD8FA92C34B058516A0E5EAA1D023D9D'};

 if(id===11){q.itemStatus='HOLD';q.itemHoldReason='원문 도로망의 최단경로 수는 48이나 원문 보기 82, 96, 120, 144, 160 중 일치 항목이 없음. qid 11 page-2 source region checked; preserve original and hold.';}
}
const output='window.examTitle = '+JSON.stringify(examTitle)+';\nwindow.questionBank = '+JSON.stringify(questions,null,2)+';\n';
fs.writeFileSync(production,output,'utf8');
console.log(JSON.stringify({examTitle,count:questions.length,sourceBaselineSha256:baseSha,updatedQids:questions.map(q=>q.id),q11Answer:questions.find(q=>q.id===11).answer,q11Status:questions.find(q=>q.id===11).itemStatus,finalRawSha256:crypto.createHash('sha256').update(fs.readFileSync(production)).digest('hex').toUpperCase()},null,2));


