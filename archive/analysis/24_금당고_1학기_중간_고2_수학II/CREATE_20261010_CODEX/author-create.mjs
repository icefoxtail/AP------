import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
const root = process.argv.at(-1);
const target = 'archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js';
const expected = '11A9171A61CFB1F640067C964019F0EDA0E07859919C540FA438A772DAB03296';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const baseline = execFileSync('git',['show','HEAD:'+target],{cwd:root});
if (sha(baseline).toUpperCase() !== expected) throw new Error('ASSIGNED_SOURCE_SHA_MISMATCH:' + sha(baseline));
const source = fs.readFileSync(root + '/' + target);
const context = { window: {} }; vm.createContext(context); vm.runInContext(source.toString('utf8'), context, { timeout: 5000 });
const bank = context.window.questionBank;
const baseContext={window:{}};vm.createContext(baseContext);vm.runInContext(baseline.toString('utf8'),baseContext,{timeout:5000});
const baseBank=baseContext.window.questionBank;
if (bank.length !== 19 || baseBank.length!==19 || bank.some((q,i)=>q.id!==i+1 || q.id!==baseBank[i].id || q.content!==baseBank[i].content || JSON.stringify(q.choices)!==JSON.stringify(baseBank[i].choices) || (q.image||'')!==(baseBank[i].image||''))) throw new Error('STUDENT_SOURCE_PARITY_MISMATCH');
const U={
 limit:['H15-M2-01','함수의 극한',1,'H15-M2-01-LIMIT','함수의 극한'],
 continuity:['H15-M2-02','함수의 연속',2,'H15-M2-02-CONTINUITY','함수의 연속'],
 derivative:['H15-M2-03','미분계수',3,'H15-M2-03-DERIVATIVE_DEFINITION','미분계수'],
 derivativeFunction:['H15-M2-04','도함수',4,'H15-M2-04-DERIVATIVE','도함수'],
 tangent:['H15-M2-05','접선의 방정식',5,'H15-M2-05-TANGENT','접선의 방정식'],
 application:['H15-M2-06','도함수의 활용',6,'H15-M2-06-DERIVATIVE_APPLICATION','도함수의 활용'],
};
const A={
1:{answer:'②',unit:'limit',category:'함수의 극한값 계산',level:'하',bucket:1,pt:'PT_LIMIT_VALUE_CALC',tpl:'TPL_LIMIT_RATIONALIZATION',method:'극한식에 각각 직접 대입하거나 약분하여 참값을 확인한다.',step:'유리화하여 ②의 극한값이 1/4임을 확인한다.',integration:'NONE',solution:String.raw`각 선택지의 극한값을 확인한다.

① $x=2$를 대입하면 $3\cdot2+2=8$이므로 옳다.

② 분자와 분모를 각각 유리화하면
$$\frac{\sqrt{x+2}-2}{x-2}=\frac{1}{\sqrt{x+2}+2}$$
이므로 극한값은 $\frac14$이다. 보기의 $\frac12$와 다르므로 틀렸다.

③ $x^2+x-2=(x-1)(x+2)$이므로 극한값은 $1+2=3$이다.

④ 두 항은 각각 $0$으로 수렴하므로 합도 $0$이다.

⑤ 분자와 분모를 $x^2$으로 나누면 최고차항의 계수비 $2$로 수렴한다.

따라서 틀린 것은 ②이다.`},
2:{answer:'⑤',unit:'limit',category:'함수의 극한의 계산',level:'중',bucket:2,pt:'PT_LIMIT_VALUE_CALC',tpl:'TPL_LIMIT_OPERATION_LAWS',method:'분자와 분모를 x로 나누어 각 함수의 x에 대한 상대적 크기를 비교한다.',step:'분자와 분모를 x로 나누어 각각 1과 3으로 수렴함을 확인한다.',integration:'SEQUENTIAL',solution:String.raw`주어진 조건에서
$$\frac{f(x)}x=\frac{f(x)}{x^2}\,x\longrightarrow 1\cdot0=0,$$
$$\frac{g(x)}x\longrightarrow2$$
이다.

구하려는 식의 분자와 분모를 $x$로 나누면
$$\frac{f(x)+x}{g(x)+x}=\frac{\frac{f(x)}x+1}{\frac{g(x)}x+1}.$$
따라서 분자는 $1$, 분모는 $3$으로 수렴한다.

그러므로 극한값은 $\frac13$이고 정답은 ⑤이다.`},
3:{answer:'④',unit:'continuity',category:'구간별 함수의 연속 조건',level:'중',bucket:2,pt:'PT_CONTINUITY_CONDITION',tpl:'TPL_CONTINUITY_FACTOR_CONDITION',method:'분모가 0이 되는 점에서 분자의 값이 0이 되도록 계수를 정한 뒤 약분한 극한으로 함수값을 정한다.',step:'x=3에서 분자가 0이 되도록 m을 정하고 연속 조건으로 n을 구한다.',integration:'SEQUENTIAL',solution:String.raw`$x=3$에서 연속이려면 분자의 값이 $0$이어야 한다.
$$9-3m+3=0$$
따라서 $m=4$이다.

이때 $x^2-4x+3=(x-3)(x-1)$이므로 $x\ne3$에서
$$f(x)=x-1.$$
따라서
$$\lim_{x\to3}f(x)=2$$
이고 연속 조건에서 $n=f(3)=2$이다.

그러므로 $m+n=4+2=6$이며 정답은 ④이다.`},
4:{answer:'①',unit:'continuity',category:'연속함숫값의 결정',level:'중',bucket:2,pt:'PT_CONTINUITY_CONDITION',tpl:'TPL_CONTINUITY_PRODUCT_ZERO_CANCELLATION',method:'연속인 함수의 특정 함숫값을 주변에서 정의된 식의 극한으로 결정한다.',step:'x≠2에서 f(x)를 유리화해 극한을 구하고 연속성으로 f(2)를 정한다.',integration:'SEQUENTIAL',solution:String.raw`$x\ne2$에서 식을 정리하기 위해 분자와 분모에 $\sqrt{x-1}+1$을 곱한다.
$$f(x)=\frac{\sqrt{x-1}-1}{x-2}=\frac{1}{\sqrt{x-1}+1}.$$

$f$가 $x=2$에서 연속이므로
$$f(2)=\lim_{x\to2}f(x)=\frac{1}{\sqrt{1}+1}=\frac12.$$

따라서 정답은 ①이다.`},
5:{answer:'③',unit:'derivativeFunction',category:'미분가능 조건으로 계수 결정',level:'중',bucket:2,pt:'PT_DIFFERENTIABILITY_CONDITION',tpl:'TPL_DIFFERENTIABILITY_POINT_CONDITION',method:'인수분해한 식의 극한값과 미분가능성에 따른 함수값 일치를 이용한다.',step:'x≠2에서 약분한 식의 극한으로 f(2)=7을 결정한다.',integration:'SEQUENTIAL',solution:String.raw`분자를 인수분해하면
$$x^2+3x-10=(x-2)(x+5)$$
이므로 $x\ne2$에서 $f(x)=x+5$이다.

미분가능한 함수는 연속이므로
$$m+1=f(2)=\lim_{x\to2}(x+5)=7.$$
따라서 $m=6$이고 정답은 ③이다.`},
6:{answer:'②',unit:'continuity',category:'좌우극한을 이용한 연속 조건',level:'하',bucket:1,pt:'PT_CONTINUITY_CONDITION',tpl:'TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH',method:'한 점에서 연속이면 좌극한·우극한과 함숫값이 모두 같다는 조건을 적용한다.',step:'1−2k=k−5를 풀어 k와 f(0)을 차례로 구한다.',integration:'SEQUENTIAL',solution:String.raw`$x=0$에서 연속이므로 좌극한과 우극한이 같다.
$$1-2k=k-5$$
따라서 $k=2$이다.

연속성에 의해
$$f(0)=\lim_{x\to0}f(x)=1-2\cdot2=-3.$$
그러므로 $k+f(0)=2+(-3)=-1$이고 정답은 ②이다.`},
7:{answer:'④',unit:'tangent',category:'기울기가 주어진 접선의 방정식',level:'중',bucket:2,pt:'PT_TANGENT_DERIVATIVE',tpl:'TPL_TANGENT_CONSTRUCTION',method:'도함수값을 접선의 기울기와 같게 두어 접점을 찾고 점기울기식에 대입한다.',step:'f′(x)=1에서 접점 x=1을 구한 뒤 접선식을 세운다.',integration:'SEQUENTIAL',visual:'q7-solution.svg',solution:String.raw`곡선의 접선 기울기는 도함수값이므로
$$f'(x)=2x-1=1$$
을 풀면 접점의 $x$좌표는 $1$이다.

$f(1)=1-1+5=5$이므로 접점은 $(1,5)$이다. 점 $(1,5)$를 지나고 기울기가 $1$인 직선은
$$y-5=x-1,$$
즉 $y=x+4$이다.

따라서 정답은 ④이다.`},
8:{answer:'③',unit:'application',category:'평균값 정리의 값 결정',level:'중',bucket:2,pt:'PT_MEAN_VALUE_THEOREM',tpl:'TPL_MVT_ROLLE_DIRECT',method:'평균값 정리의 평균변화율을 구하고 이를 도함수값과 같게 둔다.',step:'평균변화율 −5를 f′(c)=−4c+1과 같게 둔다.',integration:'SEQUENTIAL',solution:String.raw`평균값 정리에 따라
$$f'(c)=\frac{f(2)-f(1)}{2-1}.$$
$f(2)=-5$, $f(1)=0$이므로 평균변화율은 $-5$이다.

한편 $f'(x)=-4x+1$이므로
$$-4c+1=-5,$$
따라서 $c=\frac32$이다. 정답은 ③이다.`},
9:{answer:'①',unit:'limit',category:'함수의 극한에 대한 명제 판정',level:'상',bucket:4,pt:'PT_LIMIT_STATEMENT_LOGIC',tpl:'TPL_LIMIT_STATEMENT_COUNTEREXAMPLE',method:'극한의 대수적 성질을 적용하고 각 진술의 조건 부족 여부를 반례로 검사한다.',step:'ㄱ만 항상 참임을 보이고 ㄴ·ㄷ·ㄹ의 조건 부족은 반례로 확인한다.',cross:['CC_COUNTEREXAMPLE'],crossReasons:['ㄴ·ㄷ·ㄹ이 일반적으로 성립하지 않음을 각기 다른 반례로 판정하는 과정이 정답 결정에 필요하다.'],integration:'CASE_BRANCH',solution:String.raw`각 진술을 따로 확인한다.

**ㄱ.** 두 극한이 존재하면
$$f(x)=\{f(x)+2g(x)\}-2g(x)$$
의 극한도 존재한다. 참이다.

**ㄴ.** $a=0$에서 $f(x)=1+x$, $g(t)=\sin\frac1{t-1}$로 두자. $x\to0$일 때 $f(x)\to1$, $g(x)\to\sin(-1)$이므로 두 극한은 존재한다. 그러나 $g(f(x))=\sin(1/x)$는 극한이 없다. 거짓이다.

**ㄷ.** $f(x)=1$, $g(x)=1+x$로 두면 $f(x)+g(x)=2+x$, $f(x)-g(x)=-x$의 극한은 모두 존재하고 $f(x)\ne g(x)$ $(x\ne0)$이다. 그러나
$$\frac{f(x)}{f(x)-g(x)}=-\frac1x$$
의 유한한 극한은 존재하지 않는다. 거짓이다.

**ㄹ.** $f(x)=g(x)=\sin(1/x)$ $(x\ne0)$이면 각각의 극한은 없지만 $f(x)-g(x)=0$의 극한은 존재한다. 거짓이다.

따라서 ㄱ만 참이고 정답은 ①이다.`},
10:{answer:'2',unit:'derivative',category:'차분극한으로 미분계수 결정',level:'중',bucket:3,pt:'PT_DERIVATIVE_DEFINITION',tpl:'TPL_DERIVATIVE_LIMIT_REDUCTION',method:'두 입력이 1에서 각각 h와 −3h만큼 이동한 차분을 f′(1)로 환원한다.',step:'주어진 극한을 2f′(1)=6으로 바꾸어 m을 결정한다.',integration:'SEQUENTIAL',solution:String.raw`$h\to0$에서 두 입력 $1+h$, $1-3h$는 모두 $1$로 간다. 미분계수의 정의에 따라
$$\lim_{h\to0}\frac{f(1+h)-f(1-3h)}{2h}=2f'(1).$$
따라서 $f'(1)=3$이다.

$f'(x)=3x^2+2mx-4$이므로
$$f'(1)=3+2m-4=2m-1=3.$$
따라서 $m=2$이다.`},
11:{answer:'⑤',unit:'derivativeFunction',category:'함수 관계식에서 도함수 결정',level:'중',bucket:3,pt:'PT_DERIVATIVE_FUNCTION_DETERMINATION',tpl:'TPL_DERIVATIVE_RELATION_FUNCTION_DETERMINE',method:'함수의 덧셈 관계식을 x에 대해 미분한 뒤 x=0을 대입해 미지의 도함수를 결정한다.',step:'x=0을 대입한 미분 관계 f′(y)=f′(0)+6y를 얻는다.',integration:'SEQUENTIAL',solution:String.raw`주어진 식을 $x$에 대하여 미분하면
$$f'(x+y)=f'(x)+6y$$
이다.

여기에 $x=0$을 대입하고 $f'(0)=4$를 사용하면
$$f'(y)=4+6y.$$
문제의 변수로 바꾸어 쓰면 $f'(x)=6x+4$이므로 정답은 ⑤이다.`},
12:{answer:'②',unit:'tangent',category:'평행한 두 접선 사이의 거리',level:'중',bucket:3,pt:'PT_TANGENT_DERIVATIVE',tpl:'TPL_TANGENCY_RELATION_GEOMETRY',method:'주어진 직선의 기울기를 접선 기울기로 놓아 두 접점을 찾고 두 평행선의 거리를 계산한다.',step:'f′(x)=3에서 접점 x=0,2를 얻어 접선 y=3x+1과 y=3x−3의 거리를 구한다.',cross:['CC_PARALLEL_LINE_DISTANCE'],crossReasons:['서로 다른 두 접선의 평행성을 이용해 두 직선 사이의 거리를 구하는 개념이 최종값 계산에 필요하다.'],integration:'SEQUENTIAL',visual:'q12-solution.svg',solution:String.raw`곡선의 도함수는
$$f'(x)=3x^2-6x+3=3(x-1)^2$$
이다. 주어진 직선의 기울기는 $3$이므로 접점의 $x$좌표는
$$3(x-1)^2=3,$$
즉 $x=0$ 또는 $x=2$이다.

$f(0)=1$, $f(2)=3$이므로 접점은 $(0,1)$, $(2,3)$이다. 각 접선은
$$y=3x+1,\qquad y=3x-3$$
이다.

두 평행선 사이의 거리는
$$\frac{|1-(-3)|}{\sqrt{3^2+(-1)^2}}=\frac4{\sqrt{10}}.$$
따라서 정답은 ②이다.`},
13:{answer:'⑤',unit:'application',category:'그래프에서 평균값 정리의 값 개수',level:'상',bucket:4,pt:'PT_MEAN_VALUE_THEOREM',tpl:'TPL_MVT_ROLLE_DIRECT',method:'양 끝점을 잇는 할선의 기울기와 같은 접선을 그래프에서 센다.',step:'주어진 그래프에서 할선과 평행한 접선이 생기는 위치를 구간별로 센다.',integration:'SEQUENTIAL',solution:String.raw`평균값 정리에 의해 구하는 $c$는 양 끝점 $(-2,f(-2))$, $(4,f(4))$를 잇는 할선과 접선의 기울기가 같은 점의 $x$좌표이다.

그래프에서 이 할선은 오른쪽으로 갈수록 내려가는 직선이다. 따라서 같은 기울기의 접선은 그래프가 내려가는 구간들에서 센다. 첫 번째 내려가는 부분에서는 1개, 두 개의 봉우리 사이의 내려가는 부분마다 각각 2개씩 나타난다.

모두 $1+2+2=5$개이므로 정답은 ⑤이다.`},
14:{answer:'①',unit:'limit',category:'극한 조건으로 다항함수 결정',level:'상',bucket:4,pt:'PT_LIMIT_PARAMETER_DETERMINATION',tpl:'TPL_LIMIT_FINITE_CONDITION_PARAMETER',method:'이동 관계를 g(x)=f(x−p)로 두고 두 유한 극한이 요구하는 영점과 중복도를 비교한다.',step:'두 극한에서 f(0)=f′(0)=0 및 f(−p)=0을 얻어 f(x)=x²(x+p), p=1을 결정한다.',conditions:['COND_POSITIVE'],conditionReasons:['p>0 조건이 양의 매개변수를 선택하고 1/p=p에서 p=1을 확정한다.'],integration:'INTERDEPENDENT',solution:String.raw`$x$축 방향으로 오른쪽으로 $p$만큼 옮겼으므로 $g(x)=f(x-p)$이다.

첫째 극한이 유한하므로 $f(0)=0$이다. 둘째 극한에서 $t=x-p$로 놓으면
$$\lim_{t\to0}\frac{f(t)}{t f(t+p)}=0.$$
$f(p)=0$이면 분모의 영점 차수가 $1$보다 더해져 극한이 0이 될 수 없다. 따라서 $f(p)\ne0$이고 위 극한이 0이려면 $f'(0)=0$이어야 한다. 최고차항 계수가 1인 삼차함수이므로 $f(x)=x^2(x-a)$ 꼴이다.

첫째 극한이 양수 $p$이므로 $f(-p)=0$이어야 한다. 이에 따라 $a=-p$이고 $f(x)=x^2(x+p)$이다. 이때
$$\lim_{x\to0}\frac{f(x)}{xg(x)}=\lim_{x\to0}\frac{x+p}{(x-p)^2}=\frac1p.$$
따라서 $1/p=p$이고 $p>0$이므로 $p=1$이다.

그러면 $g(2)=f(1)=1^2(1+1)=2$이다. 정답은 ①이다.`},
15:{answer:'④',unit:'continuity',category:'교점 개수 함수의 불연속',level:'상',bucket:4,pt:'PT_CONTINUITY_JUDGMENT',tpl:'TPL_COUNT_FUNCTION_DISCONTINUITY_FIND',method:'원과 각 변의 교점 수가 바뀌는 반지름을 변의 가장 가까운 거리와 끝점 거리에서 찾는다.',step:'변 AB의 최소 거리 12/5와 끝점 거리 3,4에서 교점 수가 달라지는 것을 확인한다.',conditions:['COND_POSITIVE'],conditionReasons:['r>0인 정의역에서 교점 수가 변하는 임계 반지름만 조사한다.'],cross:['CC_CIRCLE_TANGENCY'],crossReasons:['원과 변 AB가 접하는 최소거리 12/5에서 교점 수의 점프가 시작된다.'],integration:'CASE_BRANCH',visual:'q15-solution.svg',solution:String.raw`각 변과 원점 $O$ 사이의 거리가 원의 반지름이 될 때 교점 수가 바뀐다.

**변 $OA$, $OB$**의 점들은 원점에서의 거리가 각각 $[0,4]$, $[0,3]$의 모든 값을 갖는다.

**변 $AB$**의 직선식은 $3x+4y=12$이다. 원점에서 이 직선까지의 거리는
$$\frac{12}{\sqrt{3^2+4^2}}=\frac{12}{5}.$$
이 거리는 선분 $AB$ 안에서 수선의 발을 이루므로 $r=\frac{12}{5}$에서 접하고, $\frac{12}{5}<r<3$에서는 두 점에서 만난다. 그 다음 $r=3$에서는 꼭짓점 $B$에서, $r=4$에서는 꼭짓점 $A$에서 교점 수가 다시 바뀐다.

따라서 불연속점은 $\frac{12}{5},3,4$이고 합은
$$\frac{12}{5}+3+4=\frac{47}{5}.$$
정답은 ④이다.`},
16:{answer:'④',unit:'derivativeFunction',category:'절댓값 함수의 미분가능 조건',level:'상',bucket:5,pt:'PT_DIFFERENTIABILITY_CONDITION',tpl:'TPL_NONDIFFERENTIABILITY_STRUCTURE',conditions:['COND_POSITIVE'],conditionReasons:['p,q>0이 절댓값의 영점과 허용된 이동량을 결정한다.'],cross:['CC_ABSOLUTE_VALUE_FUNCTION'],crossReasons:['|f(x)−p|와 |f(x+q)|의 영점에서 미분가능성을 판정하는 데 절댓값 함수의 구간별 형태가 필요하다.'],integration:'INTERDEPENDENT',visual:'q16-solution.svg',solution:String.raw`왼쪽 식은 위로 열린 이차함수이고 오른쪽 식은 아래로 열린 이차함수이다. $f$가 $x=-1$에서 미분가능하므로 두 도함수값이 같다.
$$-2+a=2+c,\qquad a-c=4.$$

$|f(x)-p|$가 모든 실수에서 미분가능하려면 $f(x)-p$의 부호가 바뀌는 영점에서 뾰족점이 생기지 않아야 한다. $f(x)-p$는 $x\to-\infty$에서 양수이고 $x\to\infty$에서 음수이므로 부호가 바뀌는 영점이 적어도 하나 있다. 각 이차식 내부의 꼭짓점에서 생기는 영점은 부호가 바뀌지 않으므로, 부호가 바뀌는 영점은 이음점 $x=-1$이어야 한다. 따라서
$$f(-1)=p,\qquad f'(-1)=0.$$
이로부터 $a=2$, $c=-2$, $b=p+1$, $d=p-1$이다. 즉 $x\le-1$에서는 $f(x)=(x+1)^2+p$이고, $x>-1$에서는 $f(x)=-(x+1)^2+p$이다.

$f(x)=0$은 오른쪽 가지에서 $x=-1+\sqrt p$일 때만 성립한다. $|f(x+q)|$가 $x=0$에서만 미분가능하지 않으므로 이 영점은 $x+q=-1+\sqrt p$일 때 나타난다. 따라서 $q=-1+\sqrt p$이다.

$p>0$이므로 $p$는 오른쪽 식에 대입되어
$$f(p)=-(p+1)^2+p=-p^2-p-1=-21.$$
따라서 $p^2+p-20=0$이고 양수 조건에서 $p=4$이다. 그러면 $q=1$이고
$$f'(q)=-2(q+1)=-4.$$
정답은 ④이다.`},17:{answer:'49',unit:'derivative',category:'미분계수의 정의를 이용한 계산',level:'중',bucket:2,pt:'PT_DERIVATIVE_DEFINITION',tpl:'TPL_DERIVATIVE_LIMIT_REDUCTION',method:'미분계수 정의의 차분을 전개해 h의 1차 계수를 읽는다.',step:'[f(2+h)−f(2)]/h의 극한을 정의대로 계산해 49를 얻는다.',integration:'NONE',solution:''},
18:{answer:'116',unit:'limit',category:'극한과 연속 조건으로 다항함수 결정',level:'상',bucket:4,pt:'PT_LIMIT_PARAMETER_DETERMINATION',tpl:'TPL_LIMIT_FINITE_CONDITION_PARAMETER',method:'유한한 무한대 극한으로 이차다항식의 형태를 제한하고, 연속성으로 분모의 실근을 배제한다.',step:'f(x)=x²+ax+b, b=5a−16을 얻고 판별식 음수 조건으로 a=5,…,15를 정한다.',conditions:['COND_INTEGER','COND_NONZERO'],conditionReasons:['정수 계수 조건은 a,b를 정수로 제한하고 x/f(x)의 전 실수 연속성은 분모 f(x)의 실근을 배제한다.'],cross:['CC_DISCRIMINANT'],crossReasons:['이차식 f(x)가 모든 실수에서 0이 되지 않는지를 판별식으로 검사해 허용되는 정수 계수를 결정한다.'],integration:'INTERDEPENDENT',solution:String.raw`무한대에서
$$\frac{f(x)-x^2}{x}$$
가 유한한 값으로 수렴하므로 $f(x)-x^2$의 차수는 1 이하이다. 따라서 정수 $a,b$에 대해
$$f(x)=x^2+ax+b$$
로 쓸 수 있다.

주어진 극한은 $a$이고,
$$f(-4)=16-4a+b$$
이므로 $a=16-4a+b$, 즉 $b=5a-16$이다.

함수 $x/f(x)$가 모든 실수에서 연속이려면 $f(x)$가 실근을 가져서는 안 된다. 판별식은
$$D=a^2-4b=a^2-20a+64=(a-4)(a-16)$$
이다. $D<0$이어야 하므로 $4<a<16$. 정수 조건으로 $a=5,6,\ldots,15$이다.

$f(2)=4+2a+b=7a-12$이므로 최솟값은 $23$, 최댓값은 $93$이다. 두 값의 합은 $116$이다.`},
19:{answer:String.raw`$\pi(30-10\sqrt5)$`,unit:'tangent',category:'도함수와 원의 접선 조건',level:'상',bucket:4,pt:'PT_TANGENT_DERIVATIVE',tpl:'TPL_TANGENCY_RELATION_GEOMETRY',cross:['CC_CIRCLE_TANGENCY'],crossReasons:['곡선의 접선 l을 정한 뒤 중심에서 l과 x축까지의 거리가 반지름과 같다는 원의 접선 조건으로 원을 결정한다.'],integration:'INTERDEPENDENT',visual:'q19-solution.svg',method:'곡선의 도함수로 l을 구하고, P에서 l에 수직인 중심 방향과 x축 접선 조건으로 원을 결정한다.',step:'C=P+t(2,−1), r=√5|t|=4−t에서 t=√5−1, r=5−√5를 얻는다.',solution:String.raw`곡선 위의 점 $P(1,4)$이므로
$$(-2)f(1)=4,\qquad f(1)=-2.$$
곡선을 미분하면
$$\frac{d}{dx}\{(x^2-3)f(x)\}=2xf(x)+(x^2-3)f'(x).$$
따라서 $x=1$에서 접선의 기울기는
$$2f(1)-2f'(1)=-4+6=2.$$
그러므로 $l$은 $y-4=2(x-1)$, 즉 $y=2x+2$이다.

$l$의 법선 방향벡터는 $(2,-1)$이다. 원의 중심을 $C=P+t(2,-1)=(1+2t,4-t)$라 하자. 원이 $x$축에 접하므로 반지름은 $r=4-t$이고, $P$에서 $l$에 접하므로 $CP=r$이다. 따라서
$$\sqrt5|t|=4-t.$$
$t<0$인 경우 $t=\frac4{1-\sqrt5}=-1-\sqrt5$이고 중심의 $x$좌표 $1+2t<0$이므로 제1사분면 조건에 어긋난다. 따라서 $t>0$이고
$$t=\frac4{1+\sqrt5}=\sqrt5-1.$$
따라서 $r=4-t=5-\sqrt5$이다.

원의 넓이는
$$\pi r^2=\pi(5-\sqrt5)^2=\pi(30-10\sqrt5).$$`},
};
A[9].solution=fs.readFileSync(root+'/archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX/q9-solution.txt','utf8').replace(/^\uFEFF/,'').trimEnd();
A[14].solution=fs.readFileSync(root+'/archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX/q14-solution.txt','utf8').replace(/^\uFEFF/,'').trimEnd();
const categories = Object.fromEntries(Object.entries(A).map(([id,a])=>[id,a.category]));
const originalCats={1:'함수의 극한',2:'함수의 극한',3:'함수의 연속',4:'함수의 연속',5:'미분계수와 도함수',6:'함수의 연속',7:'도함수의 활용',8:'도함수의 활용',9:'함수의 극한',10:'미분계수와 도함수',11:'미분계수와 도함수',12:'도함수의 활용',13:'도함수의 활용',14:'함수의 극한',15:'함수의 연속',16:'미분계수와 도함수',17:'미분계수와 도함수',18:'함수의 극한',19:'도함수의 활용'};
for (const q of bank) {
 const a=A[q.id]; if(!a)throw new Error('MISSING_AUTHORING:'+q.id);
 const before={content:q.content,choices:JSON.stringify(q.choices),image:q.image||''};
 const [standardUnitKey,standardUnit,standardUnitOrder,subUnitKey,subUnit]=U[a.unit];
 Object.assign(q,{answer:a.answer,solution:[16,17].includes(q.id)?fs.readFileSync(root+'/archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX/q'+q.id+'-solution.txt','utf8').replace(/^\uFEFF/,'').trimEnd():a.solution,level:a.level,category:a.category,originalCategory:originalCats[q.id],standardCourse:'수학II',standardUnitKey,standardUnit,standardUnitOrder,subUnitKey,subUnit,subUnitConfidence:'candidate_evidence',subUnitClassificationDepth:'complete_candidate',layoutTag:'grid',wide:false,problemTypeKey:a.pt,templateKey:a.tpl,crossConceptKeys:a.cross||[],conditionKeys:a.conditions||[],integrationPattern:a.integration,difficultyBucket:a.bucket,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',primaryMethod:a.method,decisiveStep:a.step});
 if(a.visual)q.solutionImage='assets/images/24_금당고_1학기_중간_고2_수학II/'+a.visual;
 if(JSON.stringify(q.choices)!==before.choices||q.content!==before.content||(q.image||'')!==before.image)throw new Error('SOURCE_STUDENT_INPUT_MUTATED:'+q.id);
}
context.window.examTitle='24_금당고_1학기_중간_고2_수학II';
const output=`window.examTitle = ${JSON.stringify(context.window.examTitle)};\nwindow.questionBank = ${JSON.stringify(bank,null,2)};\n`;
fs.writeFileSync(root+'/'+target,output,{encoding:'utf8'});
console.log(JSON.stringify({path:root+'/'+target,sourceBaselineSha256:expected,updatedSha256:sha(Buffer.from(output)),questionCount:bank.length,answers:Object.fromEntries(bank.map(q=>[q.id,q.answer])),solutionVisualQids:bank.filter(q=>q.solutionImage).map(q=>q.id)}));
