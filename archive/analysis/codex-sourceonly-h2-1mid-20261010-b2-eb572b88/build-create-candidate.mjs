import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const examUid='24_순천여고_1학기_중간_고2_확률과통계';
const jsPath='archive/exams/original/high/h2/1mid/'+examUid+'.js';
const jsFile=path.join(root,jsPath);
const expected='D984AA045ABE842ACF2908B2BF27E1CE3689EEBADF1FCF54AC569704DDD82DC3';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const before=fs.readFileSync(jsFile);
if(sha(before).toUpperCase()!==expected)throw Error('CORRECTED_SOURCE_SHA_MISMATCH:'+sha(before));
const box={window:{}};vm.runInNewContext(before.toString('utf8'),box,{timeout:5000});const qs=box.window.questionBank;if(qs.length!==23||qs.some(q=>q.answer!==''||q.solution!==''))throw Error('CURRENT_SOURCE_NOT_BLANK_23');
const currentQ20=qs.find(q=>q.id===20).question;
const fixedQ20='다음 그림과 같은 도로망이 있다. A지점에서 출발하여 B지점까지 최단 거리로 가는 경우의 수를 구하면? [4.5]';
if(!currentQ20.includes('출발하여')||!currentQ20.includes('최단 거리'))throw Error('Q20_EXPECTED_LOCUS_MISSING');
const lines=[
'①','④','③','③','⑤','④','⑤','①','②','④','②','⑤','①','①','③','①','⑤','④','③','②','30','유일한 값이 정해지지 않음','144'
];
const solutions={
1:String.raw`중복조합, 조합, 순열의 값을 차례로 비교합니다.
${''}`,
};
// Literal small-board solutions; no previous-source answer is reused.
const sol={
1:String.raw`각 표현의 값을 구해 비교합니다.
${''}`,
};
// Build without interpolating TeX/backslashes in authored strings.
const solutionText={
1:'각 표현의 값을 구해 비교합니다.\n$\\displaystyle {}_2\\mathrm{H}_8=\\binom{9}{8}=9$\n$\\displaystyle {}_7\\mathrm{H}_3=\\binom{9}{3}=84$\n$\\displaystyle {}_6\\mathrm{C}_3=20,\\quad {}_4\\mathrm{P}_3=24$\n$\\displaystyle {}_3\\Pi_4=3^4=81$\n따라서 가장 큰 값은 $84$이므로 정답은 ②입니다.',
2:'먼저 $A,B$를 포함해 나머지 세 학생을 고릅니다.\n$\\displaystyle \\binom{5}{3}=10$\n선택한 다섯 명을 원탁에 앉힐 때 $A,B$를 한 묶음으로 보면 네 묶음의 원순열은 $3!$가지이고, 묶음 안의 순서는 $2$가지입니다.\n$\\displaystyle 10\\times 3!\\times2=120$\n따라서 정답은 ④입니다.',
3:'$R,G$가 이웃하므로 두 문자를 한 묶음으로 봅니다. 그러면 $R,G$ 묶음과 나머지 여섯 글자, 즉 $E$ 세 개를 포함한 여덟 대상을 배열하는 수는\n$\\displaystyle \\frac{8!}{3!}\\times2$\n입니다. 조건 (가), (나)는 서로 다른 $M,N,C$의 상대적 순서가 $M,N,C$ 하나로 정해지므로 전체의 $\\frac16$입니다.\n$\\displaystyle \\frac{8!}{3!}\\times2\\times\\frac16=2240$\n따라서 정답은 ③입니다.',
4:'먼저 $b,b,c$를 배열하면 $\\frac{3!}{2!}=3$가지입니다. 이 배열의 양끝과 문자 사이를 합쳐 $a$를 놓을 수 있는 자리는 네 곳입니다. $a$ 세 개가 이웃하지 않으려면 네 자리 중 세 자리를 골라 하나씩 놓습니다.\n$\\displaystyle 3\\times\\binom{4}{3}=12$\n따라서 정답은 ③입니다.',
5:'일반항에서 $\\left(-\\frac2x\\right)$를 $k$번 선택하면 $x$의 지수는 $2(6-k)-k=12-3k$입니다. 상수항이 되려면 $12-3k=0$, 즉 $k=4$입니다.\n$\\displaystyle \\binom64(-2)^4=15\\times16=240$\n따라서 정답은 ⑤입니다.',
6:'서로 다른 사탕 네 개는 각각 세 사람 중 한 명에게 가므로 $3^4$가지입니다. 쿠키 네 개는 같은 종류이고 세 사람 모두 적어도 한 개씩 받으므로 양의 정수해\n$\\displaystyle x+y+z=4$\n의 수와 같습니다. $x_1=x-1,y_1=y-1,z_1=z-1$로 두면 $x_1+y_1+z_1=1$이어서 $\\binom32=3$가지입니다.\n$\\displaystyle 3^4\\times3=243$\n따라서 정답은 ④입니다.',
7:'$(x+y+z+w)^n$의 서로 다른 항은 지수 네 개의 음이 아닌 정수해 $a+b+c+d=n$에 대응합니다. 따라서 항의 수는\n$\\displaystyle \\binom{n+3}{3}=56$\n입니다. $n=5$이면 $\\binom83=56$이므로 정답은 ⑤입니다.',
8:'$(1+2x)^k$에서 $x^2$의 계수는 $\\binom{k}{2}2^2=4\\binom{k}{2}$입니다. 따라서 전체 계수는\n$\\displaystyle 4\\sum_{k=1}^{10}\\binom{k}{2}=4\\binom{11}{3}=660$\n입니다. 정답은 ①입니다.',
9:'합집합이 네 원소인 집합을 먼저 고릅니다. 빠지는 원소를 고르는 방법은 $\\binom54=5$가지입니다. 합집합에 속한 각 원소는 $A$에만, $B$에만, 또는 둘 다에 속합니다. 교집합이 비지 않도록 하려면 세 번째 배정이 한 번 이상 있어야 하므로 한 고정 합집합에 대해\n$\\displaystyle 3^4-2^4=65$\n가지입니다. 전체는 $5\\times65=325$가지이므로 정답은 ②입니다.',
10:'기준값은\n$\\displaystyle \\sum_{k=1}^{10}\\binom{10}{k}=2^{10}-1=1023$\n입니다. ㄱ은 홀수 번째 이항계수의 합이 $2^{10}=1024$이므로 다릅니다. ㄴ은 짝수 번째 이항계수 합에서 $\\binom{11}{0}$을 뺀 값이 $1023$입니다. ㄷ은 홀수 $11$에 대한 대칭성으로 $\\sum_{k=0}^{5}\\binom{11}{k}=2^{10}$이므로 $k=0$항을 빼면 $1023$입니다. 따라서 ㄴ, ㄷ이고 정답은 ④입니다.',
11:'치역을 먼저 나눕니다. 치역이 한 원소인 경우 합이 홀수가 되려면 치역은 $\\{1\\}$ 또는 $\\{3\\}$이므로 각 1개, 합 2개입니다. 두 원소 치역은 $\\{1,2\\}$ 또는 $\\{2,3\\}$일 때 합이 홀수입니다. 정해진 두 원소를 모두 치역에 쓰는 함수는 $2^3-2=6$개이므로 두 경우 합은 12개입니다. 세 원소 치역의 합은 짝수입니다.\n$\\displaystyle 2+12=14$\n따라서 정답은 ②입니다.',
12:'회전하여 같은 배열을 하나로 보므로 전체 원형 배열은 $5!=120$가지입니다. 조건을 만족하는 이웃 쌍은 $4,6$ 또는 $5,6$입니다. 각 쌍이 이웃한 배열은 둘을 한 묶음으로 보아\n$\\displaystyle 2\\times4!=48$\n가지씩입니다. 두 조건이 동시에 일어나면 $4-6-5$가 한 덩어리가 되고, 덩어리의 방향이 2가지이며 네 덩어리의 원순열이 $3!$가지이므로 $2\\times3!=12$가지입니다. 포함배제로\n$\\displaystyle 48+48-12=84$\n가지입니다. 따라서 정답은 ⑤입니다.',
13:'$y_1=y-2,z_1=z-1,w_1=w-1$로 두면 조건은\n$\\displaystyle x+y_1+z_1+3w_1=5$\n가 됩니다. $w_1=0,1$만 가능합니다. $w_1=0$이면 $x+y_1+z_1=5$의 해는 $\\binom72=21$개입니다. $w_1=1$이면 $x+y_1+z_1=2$의 해는 $\\binom42=6$개입니다.\n$\\displaystyle 21+6=27$\n이므로 정답은 ①입니다.',
14:'$f(2)=a<f(3)=b<f(4)=c$라 두면 $f(1)$은 $1$부터 $a$까지 $a$가지, $f(5)$는 $c$부터 $7$까지 $8-c$가지입니다. 중간 세 값 $a<b<c$를 고정해 더합니다. $c=3,4,5,6,7$일 때 각각의 합은 $5,16,30,40,35$입니다.\n$\\displaystyle 5+16+30+40+35=126$\n따라서 정답은 ①입니다.',
15:'$ae=10$이고 $a\\le e$이므로 가능한 끝값은 $(a,e)=(1,10),(2,5)$입니다.\n$(1,10)$일 때 $1\\le b\\le c\\le d\\le10$의 수는 $\\binom{12}{3}=220$입니다. 곱이 홀수인 경우는 세 수가 모두 홀수여야 하므로 $\\binom{7}{3}=35$개입니다. 따라서 곱이 짝수인 경우는 $220-35=185$개입니다.\n$(2,5)$일 때 중간 세 수는 2부터 5까지에서 중복을 허용해 고르는 $\\binom63=20$개이고, 세 수가 모두 홀수인 경우는 3,5만 사용하므로 $\\binom43=4$개입니다. 짝수 곱은 $20-4=16$개입니다.\n$\\displaystyle185+16=201$\n따라서 정답은 ③입니다.',
16:'네 칸에 서로 다른 네 색을 모두 한 번씩 놓는 배열은 $4!=24$가지입니다. 네 색이 모두 다르므로 $90^\\circ,180^\\circ,270^\\circ$ 회전은 어느 배열도 자기 자신으로 되돌리지 않습니다. 따라서 회전 동치류 하나에는 서로 다른 배열 네 개가 들어갑니다.\n$\\displaystyle \\frac{4!}{4}=6$\n가지이므로 정답은 ①입니다.',
17:'먼저 사용할 두 색을 고르면 $\\binom42=6$가지입니다. 두 색을 $A,B$라 할 때 네 칸을 채우되 둘 다 쓰는 배열은 $2^4-2=14$개입니다. 회전 동치류는 $A$ 한 개, $A$ 세 개가 각각 한 종류씩이고, 두 개씩 쓰는 경우에는 이웃 배치와 마주 보는 배치 두 종류이므로 색 쌍마다 4종류입니다.\n$\\displaystyle \\binom42\\times4=24$\n따라서 정답은 ⑤입니다.',
18:'자릿수별 개수는 한 자리 4개, 두 자리 $4\\times5=20$개, 세 자리 $4\\times5^2=100$개입니다. 여기까지 $124$개입니다. 네 자리 수 중 천의 자리가 1인 수는 $5^3=125$개이고, 이들이 모두 2000보다 앞섭니다. 따라서 2000은\n$\\displaystyle124+125+1=250$\n번째입니다. 정답은 ④입니다.',
19:'200번째는 네 자리 수 구간에 있습니다. 앞의 한·두·세 자리 수가 $4+20+100=124$개이므로 네 자리 구간에서 $200-124=76$번째입니다. 천의 자리가 1인 125개 중 76번째이므로 뒤 세 자릿수의 0부터 시작한 순번은 75입니다.\n$\\displaystyle 75=3\\times5^2+0\\times5+0$\n이므로 그 수는 1300입니다. 정답은 ③입니다.',
20:'그림은 가로·세로 4칸의 격자 도로와 세 개의 북동쪽 대각선 도로로 이루어져 있습니다. 대각선을 두 개 사용할 수는 없습니다. 한 대각선이 이동한 뒤에는 다른 대각선의 시작점이 이미 지나간 격자 층에 있기 때문입니다. 대각선을 쓰지 않는 길이는 8이고, 대각선을 하나 쓰는 길이는 $6+\\sqrt2<8$이므로 최단 경로는 대각선을 정확히 하나 씁니다.\n첫째 대각선은 시작점까지 $\\binom41=4$가지, 끝점부터 $B$까지 1가지여서 4가지입니다. 가운데 대각선은 $\\binom42\\times\\binom21=12$가지입니다. 셋째 대각선은 $\\binom43=4$가지입니다.\n$\\displaystyle4+12+4=20$\n따라서 정답은 ②입니다.',
21:'서로 같은 문자를 구별하여 먼저 $6!$가지로 배열한 뒤, 각 문자의 두 복사본이 이웃하는 배열을 포함배제로 뺍니다. 특정 한 쌍이 이웃하는 경우는 두 복사본을 한 묶음으로 보아 $2\\times5!$가지입니다. 두 쌍이 동시에 이웃하는 경우는 $2^2\\times4!$가지이고, 세 쌍 모두 이웃하면 $2^3\\times3!$가지입니다. 따라서 라벨을 구별한 유효 배열은\n$\\displaystyle 6!-\\binom31(2\\times5!)+\\binom32(2^2\\times4!)-2^3\\times3!=240$\n가지입니다. 같은 글자 두 개의 라벨을 제거하려면 $2^3$으로 나눕니다.\n$\\displaystyle \\frac{240}{8}=30$\n입니다.',
22:'문항의 조건만으로는 $a,b,c,n$이 유일하게 정해지지 않습니다. 왼쪽 합은\n$\\displaystyle \\sum_{k=1}^{8}\\binom8k(2^k+1)=(3^8-1)+(2^8-1)=6815$\n입니다. 예를 들어 $(a,b,c,n)=(2,3,-2,8)$도 등식을 만족하고, $(0,1,6814,1)$도 $a<b$와 정수 조건을 만족하며 $0^1+1^1+6814=6815$입니다. 두 값이 모두 가능하므로 유일한 정답을 정할 수 없습니다. 이 문항은 answer-cardinality 결함으로 HOLD합니다.',
23:'삼각형의 세 변마다 자리 세 개씩 있으므로 전체 자리는 9개입니다. 다섯 남학생 자리를 고를 때 전체는 $\\binom95=126$가지입니다. 한 변에 남학생이 없으면 그 변의 세 자리를 제외한 여섯 자리에서 다섯 자리를 고르므로 변 하나당 $\\binom65=6$가지입니다. 두 변이 동시에 비면 남학생이 앉을 수 있는 자리가 세 개뿐이어서 불가능합니다. 따라서 각 변에 남학생이 적어도 한 명 앉는 자리 선택은\n$\\displaystyle126-3\\times6=108$\n가지입니다. 사람을 배치하는 방법은 $5!4!$가지이고, 삼각형의 회전 세 가지는 같은 배열이므로 3으로 나눕니다.\n$\\displaystyle\\frac{108\\times5!\\times4!}{3}=103680=144\\times6!$\n따라서 $n=144$입니다.'
};
const factRows=[
{qid:1,answer:'②',fact:'2H8=9, 7H3=84, 6C3=20, 4P3=24, 3Π4=81.'},
{qid:2,answer:'④',fact:'C(5,3)×3!×2=120.'},{qid:3,answer:'③',fact:'(8!/3!)×2×1/6=2240.'},{qid:4,answer:'③',fact:'3!/(2!)×C(4,3)=12.'},{qid:5,answer:'⑤',fact:'k=4; C(6,4)×(-2)^4=240.'},{qid:6,answer:'④',fact:'3^4×C(3,2)=243.'},{qid:7,answer:'⑤',fact:'C(n+3,3)=56 gives n=5.'},{qid:8,answer:'①',fact:'4×ΣC(k,2)=4C(11,3)=660.'},{qid:9,answer:'②',fact:'C(5,4)×(3^4−2^4)=325.'},{qid:10,answer:'④',fact:'Target 1023; statements ㄴ,ㄷ equal it.'},{qid:11,answer:'②',fact:'Range cases produce 2+6+6=14 functions.'},{qid:12,answer:'⑤',fact:'120−(48+48−12)=84.'},{qid:13,answer:'①',fact:'w′=0,1 cases 21+6=27.'},{qid:14,answer:'①',fact:'Monotone endpoint count grouped by c: 5+16+30+40+35=126.'},{qid:15,answer:'③',fact:'(220−35)+(20−4)=201.'},{qid:16,answer:'①',fact:'24 distinct color placements /4 rotations=6.'},{qid:17,answer:'⑤',fact:'6 unordered color pairs×4 rotational orbits=24.'},{qid:18,answer:'④',fact:'4+20+100+125+1=250.'},{qid:19,answer:'③',fact:'124 earlier numbers; 76th four-digit base-5 numeral is 1300.'},{qid:20,answer:'②',fact:'Exactly one of three NE diagonals in shortest path; counts 4+12+4=20.'},{qid:21,answer:'30',fact:'(6!−3·2·5!+3·4·4!−8·3!)/8=30.'},{qid:22,answer:'유일하게 정해지지 않음',fact:'Sum=6815; distinct integer tuples (2,3,−2,8) and (0,1,6814,1) both satisfy it; true item HOLD.'},{qid:23,answer:'144',fact:'(C(9,5)−3C(6,5))×5!×4!/3=144×6!.'}
];
const mathProof={schemaVersion:'JS_ARCHIVE_CODEX_CREATE_MATH_FACTS_FREEZE_V1',examUid,stage:'CREATE',sourceJsRawSha256:expected,sourceIntakeEvidencePath:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/intake-repair/source-intake-repair.evidence.json',sourceIntakeEvidenceSha256:'4D536AE905F1AFDFF2DFB278CF99578F356D86841323E1B290889A18C3859EE3',rows:factRows,scopedSourceReview:{qid:20,field:'question/content',pdfPage:4,column:'col1',observedSourceText:'20. 다음 그림과 같은 도로망이 있다. A지점에서 출발하여 B지점까지 최단 거리로 가는 경우의 수를 구하면? [4.5]',change:'restore only missing A/B labels in stem'},q22SourceCheck:{qid:22,page:4,column:'col2',promptExact:'${}_8C_1(2+1)+{}_8C_2(2^2+1)+...+{}_8C_8(2^8+1)$ 값과 $a^n+b^n+c$ 값이 같을 때, 정수 $a,b,c,n$의 값을 구하시오. (단, a<b이다.)',choicesPresent:false,boxedConditionsPresent:false,imagePresent:false,itemStatus:'HOLD',reason:'Integer tuple is not unique under the exact bound prompt.'}};
const factsPath=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/CREATE.math-facts-freeze.json');fs.writeFileSync(factsPath,JSON.stringify(mathProof,null,2)+'\n',{flag:'wx'});
const unit={
 'H15-PS-01':{standardUnit:'순열과 조합',standardUnitOrder:1},
 'H15-PS-02':{standardUnit:'이항정리',standardUnitOrder:2},
 'H15-PS-03':{standardUnit:'확률의 뜻과 활용',standardUnitOrder:3}
};
const subunit={
 'H15-PS-01-PERMUTATION':'순열',
 'H15-PS-01-COMBINATION':'조합',
 'H15-PS-01-COUNTING_APPLICATION':'경우의 수의 활용',
 'H15-PS-02-BINOMIAL_BASIC':'이항정리',
 'H15-PS-03-PROBABILITY_BASIC':'확률의 뜻과 계산'
};
const meta={
1:{u:'H15-PS-01',s:'H15-PS-01-COUNTING_APPLICATION',rpm:['경우의 수','순열과 조합',null,null],pt:null,tk:null,confidence:'medium',bucket:2,level:'중',debt:['problemTypeKey','templateKey','rpmL3','rpmL4'],debtReason:'Five expressions span combinations, permutations, repeated combinations and repeated arrangements; current exact lookup has no unique primary problem type/template or single RPM L3/L4 for the comparison task.'},
2:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','중복·원순열'],pt:'PT_COUNTING_ARRANGEMENT',tk:'TPL_CIRCULAR_PERMUTATION',confidence:'high',bucket:2,level:'중'},
3:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','일렬 배열'],pt:'PT_COUNTING_ARRANGEMENT',tk:'TPL_IDENTICAL_OBJECT_PERMUTATION',confidence:'medium',bucket:4,level:'상'},
4:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','일렬 배열'],pt:'PT_COUNTING_ARRANGEMENT',tk:'TPL_IDENTICAL_OBJECT_PERMUTATION',confidence:'high',bucket:3,level:'중'},
5:{u:'H15-PS-02',s:'H15-PS-02-BINOMIAL_BASIC',rpm:['경우의 수','이항정리','이항정리','특정 항의 계수'],pt:'PT_BINOMIAL_THEOREM',tk:'TPL_BINOMIAL_TERM_COEFFICIENT',confidence:'high',bucket:3,level:'중'},
6:{u:'H15-PS-01',s:'H15-PS-01-COUNTING_APPLICATION',rpm:['경우의 수','순열과 조합','조합','분할·분배'],pt:'PT_COUNTING_SELECTION_DISTRIBUTION',tk:'TPL_REPEATED_COMBINATION_DISTRIBUTION',confidence:'high',bucket:3,level:'중',integration:'SEQUENTIAL'},
7:{u:'H15-PS-02',s:'H15-PS-02-BINOMIAL_BASIC',rpm:['경우의 수','이항정리','이항정리','전개식의 항'],pt:'PT_BINOMIAL_THEOREM',tk:'TPL_BINOMIAL_TERM_COEFFICIENT',confidence:'high',bucket:2,level:'중'},
8:{u:'H15-PS-02',s:'H15-PS-02-BINOMIAL_BASIC',rpm:['경우의 수','이항정리','이항정리','특정 항의 계수'],pt:'PT_BINOMIAL_THEOREM',tk:'TPL_BINOMIAL_TERM_COEFFICIENT',confidence:'high',bucket:2,level:'중'},
9:{u:'H15-PS-01',s:'H15-PS-01-COUNTING_APPLICATION',rpm:['경우의 수','순열과 조합','조합','선택'],pt:'PT_COUNTING_SELECTION_DISTRIBUTION',tk:'TPL_COMBINATION_SELECTION',confidence:'medium',bucket:3,level:'중',cross:['CC_SET_CARDINALITY'],integration:'CASE_BRANCH'},
10:{u:'H15-PS-02',s:'H15-PS-02-BINOMIAL_BASIC',rpm:['경우의 수','이항정리','이항계수','조합 항등식'],pt:'PT_BINOMIAL_THEOREM',tk:'TPL_BINOMIAL_COEFFICIENT_IDENTITY',confidence:'high',bucket:4,level:'상'},
11:{u:'H15-PS-01',s:'H15-PS-01-COUNTING_APPLICATION',rpm:['경우의 수','순열과 조합',null,null],pt:'PT_FUNCTION_COUNTING',tk:'TPL_CONSTRAINED_FUNCTION_COUNT',confidence:'medium',bucket:3,level:'중',debt:['rpmL3','rpmL4'],debtReason:'The exact active functions-graphs PT/TPL projection is reused for constrained function counting; the H15-PS-01 RPM Primary L3/L4 tree has no function-count leaf. Keep RPM leaf EVIDENCE_DEBT; do not invent a locked key.'},
12:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','중복·원순열'],pt:'PT_COUNTING_ARRANGEMENT',tk:'TPL_CIRCULAR_PERMUTATION',confidence:'medium',bucket:4,level:'상',visual:true,integration:'CASE_BRANCH'},
13:{u:'H15-PS-01',s:'H15-PS-01-COMBINATION',rpm:['경우의 수','순열과 조합','중복조합','정수해 개수'],pt:'PT_COUNTING_SELECTION_DISTRIBUTION',tk:'TPL_REPEATED_COMBINATION_DISTRIBUTION',confidence:'high',bucket:3,level:'중',conditions:['COND_INTEGER'],integration:'CASE_BRANCH'},
14:{u:'H15-PS-01',s:'H15-PS-01-COUNTING_APPLICATION',rpm:['경우의 수','순열과 조합',null,null],pt:'PT_FUNCTION_COUNTING',tk:'TPL_MONOTONE_FUNCTION_COUNT',confidence:'medium',bucket:4,level:'상',debt:['rpmL3','rpmL4'],debtReason:'The solution uses monotone finite-function counting and matches ACTIVE PT_FUNCTION_COUNTING/TPL_MONOTONE_FUNCTION_COUNT; H15-PS-01 RPM Primary has no function-count L3/L4 leaf.'},
15:{u:'H15-PS-01',s:'H15-PS-01-COMBINATION',rpm:['경우의 수','순열과 조합','중복조합','중복을 허용한 선택'],pt:'PT_COUNTING_SELECTION_DISTRIBUTION',tk:'TPL_REPEATED_COMBINATION_DISTRIBUTION',confidence:'medium',bucket:4,level:'상',conditions:['COND_NATURAL_NUMBER','COND_RANGE'],cross:['CC_NUMBER_PARITY'],integration:'CASE_BRANCH'},
16:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','중복·원순열'],pt:'PT_COUNTING_ARRANGEMENT',tk:'TPL_CIRCULAR_PERMUTATION',confidence:'medium',bucket:2,level:'중',visual:true,integration:'REINTERPRETATION'},
17:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','중복·원순열'],pt:'PT_COUNTING_ARRANGEMENT',tk:'TPL_CIRCULAR_PERMUTATION',confidence:'medium',bucket:4,level:'상',visual:true,integration:'CASE_BRANCH'},
18:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','일렬 배열'],pt:'PT_COUNTING_REPEATED_ASSIGNMENT',tk:'TPL_REPEATED_PERMUTATION_ASSIGNMENT',confidence:'high',bucket:4,level:'상',conditions:['COND_NATURAL_NUMBER'],integration:'REINTERPRETATION'},
19:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','일렬 배열'],pt:'PT_COUNTING_REPEATED_ASSIGNMENT',tk:'TPL_REPEATED_PERMUTATION_ASSIGNMENT',confidence:'high',bucket:4,level:'상',conditions:['COND_NATURAL_NUMBER'],integration:'REINTERPRETATION'},
20:{u:'H15-PS-01',s:'H15-PS-01-COUNTING_APPLICATION',rpm:['경우의 수','순열과 조합','조합','선택'],pt:'PT_COUNTING_SELECTION_DISTRIBUTION',tk:'TPL_COMBINATION_SELECTION',confidence:'medium',bucket:4,level:'상',visual:true,integration:'CASE_BRANCH'},
21:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','일렬 배열'],pt:'PT_COUNTING_ARRANGEMENT',tk:'TPL_IDENTICAL_OBJECT_PERMUTATION',confidence:'high',bucket:4,level:'상'},
22:{u:'H15-PS-02',s:'H15-PS-02-BINOMIAL_BASIC',rpm:['경우의 수','이항정리','이항계수','조합 항등식'],pt:'PT_BINOMIAL_THEOREM',tk:'TPL_BINOMIAL_COEFFICIENT_IDENTITY',confidence:'low',bucket:4,level:'상',conditions:['COND_INTEGER'],itemHold:true,debt:['itemAnswerCardinality'],debtReason:'Exact source prompt supplies only integer a,b,c,n and a<b. The evaluated sum is 6815, and at least two distinct integer quadruples satisfy the equality, so no unique requested tuple exists.'},
23:{u:'H15-PS-01',s:'H15-PS-01-PERMUTATION',rpm:['경우의 수','순열과 조합','순열','중복·원순열'],pt:'PT_COUNTING_ARRANGEMENT',tk:'TPL_CIRCULAR_PERMUTATION',confidence:'medium',bucket:5,level:'상',visual:true,integration:'SEQUENTIAL',conditions:['COND_NATURAL_NUMBER']}
};
const visualRefs={12:'assets/images/'+examUid+'/q12-solution.svg',16:'assets/images/'+examUid+'/q16-solution.svg',17:'assets/images/'+examUid+'/q17-solution.svg',20:'assets/images/'+examUid+'/q20-solution.svg',23:'assets/images/'+examUid+'/q23-solution.svg'};
const correctChoice={1:'②',2:'④',3:'③',4:'③',5:'⑤',6:'④',7:'⑤',8:'①',9:'②',10:'④',11:'②',12:'⑤',13:'①',14:'①',15:'③',16:'①',17:'⑤',18:'④',19:'③',20:'②'};
for(const q of qs){const m=meta[q.id],u=unit[m.u];if(!m||!u||!subunit[m.s])throw Error('META_MAP_MISSING_Q'+q.id);const oldQuestion=q.question;if(q.id===20){q.question=fixedQ20;if(oldQuestion===fixedQ20)throw Error('Q20_EXPECTED_SOURCE_DEFECT_NOT_PRESENT');}q.content=q.question;q.answer=correctChoice[q.id]??lines[q.id-1];q.solution=solutionText[q.id];q.decisiveStep=factRows.find(x=>x.qid===q.id).fact;if(!q.solution||!q.answer)throw Error('ANSWER_OR_SOLUTION_MISSING_Q'+q.id);
q.level=m.level;q.category='확률과 통계';q.originalCategory='확률과 통계';q.standardCourse='확률과 통계';q.standardUnitKey=m.u;q.standardUnit=u.standardUnit;q.standardUnitOrder=u.standardUnitOrder;q.subUnitKey=m.s;q.subUnit=subunit[m.s];q.subUnitConfidence='candidate_evidence';q.subUnitClassificationDepth='complete_candidate';q.problemTypeKey=m.pt??null;q.templateKey=m.tk??null;q.crossConceptKeys=m.cross||[];q.conditionKeys=m.conditions||[];q.integrationPattern=m.integration||'NONE';q.difficultyBucket=m.bucket;q.difficultyConfidence=m.confidence;q.difficultyBoundaryFlag=m.itemHold?'B34':'NONE';q.legacyLevelCompatibility='NORMAL';q.questionType=q.type==='multiple_choice'?'객관식':'서술형';q.layoutTag='grid';q.tags=['확률과통계',m.u==='H15-PS-02'?'이항정리':'경우의 수'];if(['12','16','17','20','23'].includes(String(q.id)))q.tags.push('도형');if([16,17,18,19].includes(q.id))q.tags.push('공통자료');if(q.type==='short_answer')q.tags.push('서술형');q.wide=false;q.sourceExamUid=examUid;q.sourceQid=q.id;q.sourceJsPath=jsPath;q.sourceMode='EXTRACTED_JS_ASSETS';q.sourceType='ORIGINAL';q.sourcePdfSha256='BD5002EC7ABE21FEEDCEC9D05E25152ABA915F74DDA466C5A06686DD192013AD';q.sourceIntakeEvidencePath='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/intake-repair/source-intake-repair.evidence.json';q.sourceIntakeEvidenceSha256='4D536AE905F1AFDFF2DFB278CF99578F356D86841323E1B290889A18C3859EE3';if(m.itemHold)q.itemStatus='HOLD';if(visualRefs[q.id])q.solutionImage=visualRefs[q.id];q.rpmL1=m.rpm[0];q.rpmL2=m.rpm[1];q.rpmL3=m.rpm[2];q.rpmL4=m.rpm[3];q.rpmCurriculum='2015';q.rpmSemanticStatus=m.debt?.includes('rpmL3')?'EVIDENCE_DEBT':'FINAL';q.rpmSemanticReason=m.debtReason||'';q.problemVisualDisposition=visualRefs[q.id]?'REQUIRED_SOURCE_ASSET':'EXEMPT_TEXT_COMPLETE';q.solutionVisualDisposition=visualRefs[q.id]?'BENEFICIAL_SOLUTION_SVG':'EXEMPT_NO_DECISIVE_SPATIAL_RELATION';q.visualDisposition={problem:q.problemVisualDisposition,solution:q.solutionVisualDisposition};}
const beforeSource=before.toString('utf8');const targetStart='다음 그림과 같은 도로망이 있다.';const q20SourceFinding={qid:20,pdfSha256:'BD5002EC7ABE21FEEDCEC9D05E25152ABA915F74DDA466C5A06686DD192013AD',page:4,column:'col1',confirmedText:'A지점에서 출발하여 B지점까지',before:currentQ20,after:fixedQ20};
const jsOut='window.examTitle = '+JSON.stringify(box.window.examTitle)+';\nwindow.questionBank = '+JSON.stringify(qs,null,2)+';\n';fs.writeFileSync(jsFile,jsOut,'utf8');
const after=fs.readFileSync(jsFile);if(sha(after)===expected)throw Error('SOURCE_DID_NOT_CHANGE');
const record={schemaVersion:'JS_ARCHIVE_CODEX_CREATE_BUILD_RECORD_V1',examUid,stage:'CREATE',priorCorrectedSourceSha256:expected,finalSourceSha256:sha(after),questionCount:qs.length,answered:qs.filter(q=>q.answer!=='').length,solved:qs.filter(q=>q.solution!=='').length,q20SourceFinding,q22ItemStatus:'HOLD',q22ExactAnswerCardinalityDebt:meta[22].debtReason,qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',sourceIntakeEvidencePath:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/intake-repair/source-intake-repair.evidence.json',sourceIntakeEvidenceSha256:'4D536AE905F1AFDFF2DFB278CF99578F356D86841323E1B290889A18C3859EE3'};
const buildPath=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/CREATE.build-record.json');fs.writeFileSync(buildPath,JSON.stringify(record,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({buildPath,record},null,2));
