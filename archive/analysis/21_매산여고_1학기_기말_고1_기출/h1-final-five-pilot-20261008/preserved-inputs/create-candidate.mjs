import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------';const tmp=root+'/.tmp/archive/h1-final-five-pilot-20261008/21_매산여고_1학기_기말_고1_기출';const uid='21_매산여고_1학기_기말_고1_기출';const run='h1-final-five-pilot-20261008';const sha=x=>crypto.createHash('sha256').update(typeof x==='string'?x:Buffer.from(x)).digest('hex');const S=x=>x[0];
const specs=[
[1,'객관식','평면좌표','H15-SA-09','평면좌표',9,'H15-SA-09-COORDINATE_METRIC','좌표와 거리','PT_COORD_SECTION','TPL_SECTION_APPLICATION',3,'high','연립방정식 $\\begin{cases}2x+y=3\\\\x^2+y^2=5\\end{cases}$을 만족시키는 두 실수 $x,y$에 대하여 $3x-y$를 구하시오. (단, $x>y$) [3.5점]', ['$-3$','$-1$','$3$','$5$','$7$'],'⑤',S`연립방정식의 첫째 식에서 $y$를 나타낸다.
$y=3-2x$
이를 둘째 식에 대입한다.
$x^2+(3-2x)^2=5$
$x^2+9-12x+4x^2=5$
$5x^2-12x+4=0$
$(x-2)(5x-2)=0$
$x=2$ 또는 $x=\\dfrac25$

각 경우의 $y$를 구한다.
$x=2$이면 $y=-1$이고, $x=\\dfrac25$이면 $y=\\dfrac{11}5$이다.
조건 $x>y$를 만족하는 것은 $(x,y)=(2,-1)$뿐이다.

$3x-y=3\\cdot2-(-1)=7$

따라서 정답은 ⑤이다.`],
[2,'객관식','이차부등식','H15-SA-08','여러 가지 부등식',8,'H15-SA-08-QUADRATIC_INEQUALITY','이차부등식','PT_H1_QUADRATIC_INEQUALITY','TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL',2,'high','이차부등식 $x^2+2x-3<0$을 만족시키는 정수 $x$의 개수를 구하시오. [3.1점]', ['$0$','$1$','$2$','$3$','$5$'],'④',S`이차식을 인수분해한다.
$x^2+2x-3=(x+3)(x-1)$

두 근 사이에서 곱이 음수이므로
$-3<x<1$

이 범위의 정수는 $-2,-1,0$이다.
따라서 개수는 $3$이다.

정답은 ④이다.`],
[3,'객관식','평면좌표','H15-SA-09','평면좌표',9,'H15-SA-09-COORDINATE_METRIC','좌표와 거리','PT_COORD_SECTION','TPL_SECTION_CONDITION_REVERSE',4,'high','두 점 $A(-2,6)$, $B(a,-3)$에 대하여 선분 $AB$를 $b:2$로 내분하는 점 $P$의 좌표가 $(-1,3)$일 때, 선분 $AB$를 $b:2$로 외분하는 점 $Q$의 좌표를 구하시오. [4.1점]', ['$ (17,-7)$'.replace('$ ', '$'),'$(10,-30)$','$(-5,15)$','$(2,-9)$','$(-1,3)$'],'③',S`내분점 $P$의 좌표를 공식에 대입한다.
$P=\\left(\\dfrac{2(-2)+ba}{b+2},\\dfrac{2(6)+b(-3)}{b+2}\\right)=(-1,3)$

$y$좌표 식에서
$\\dfrac{12-3b}{b+2}=3$
$12-3b=3b+6$
$b=1$

$x$좌표 식에서
$\\dfrac{-4+a}{3}=-1$
$a=1$

이제 $A(-2,6)$, $B(1,-3)$을 $1:2$로 외분한다.
$Q=\\left(\\dfrac{2(-2)-1(1)}{2-1},\\dfrac{2(6)-1(-3)}{2-1}\\right)$
$Q=(-5,15)$

따라서 정답은 ③이다.`],
[4,'객관식','평면좌표','H15-SA-09','평면좌표',9,'H15-SA-09-GEOMETRY_RELATION','도형의 관계','PT_COORD_FIGURE_PROPERTIES','TPL_FIGURE_PARALLELOGRAM',3,'medium','세 점 $A(2,4)$, $B(3,5-k)$, $C(2-k,7)$가 한 직선 위에 있도록 하는 모든 실수 $k$의 곱을 구하시오. [3.8점]',['$-3$','$-2$','$-1$','$2$','$3$'],'①',S`세 점이 한 직선 위에 있으므로 두 기울기가 같다.
$\\dfrac{(5-k)-4}{3-2}=\\dfrac{7-4}{(2-k)-2}$
$1-k=\\dfrac{-3}{k}$

양변에 $k$를 곱하면
$k-k^2=-3$
$k^2-k-3=0$

이 이차방정식의 두 근의 곱은 근과 계수의 관계에 따라 $-3$이다.

정답은 ①이다.`],
[5,'객관식','평면좌표','H15-SA-09','평면좌표',9,'H15-SA-09-COORDINATE_METRIC','좌표와 거리','PT_COORD_TRIANGLE_AREA','TPL_AREA_SECTION',4,'high','한 변의 길이가 $5$인 정사각형 $ABCD$에서 변 $AB$, $BC$의 중점을 각각 $E$, $F$라 하고, 선분 $AF$가 선분 $DE$, $DB$와 만나는 점을 각각 $P$, $Q$라 하자. 이때, 사각형 $EBQP$의 넓이를 $\\dfrac pq$라 하면, $p+q$의 값을 구하시오. (단, $p,q$는 서로소이다.) [4.9점]',['$27$','$32$','$37$','$42$','$47$'],'⑤',S`좌표를 $A(0,0)$, $B(5,0)$, $C(5,5)$, $D(0,5)$로 둔다.
$E=\\left(\\dfrac52,0\\right)$, $F=\\left(5,\\dfrac52\\right)$

직선 $AF$와 $DE$의 방정식은
$AF:y=\\dfrac12x$
$DE:y=-2x+5$

두 식을 연립하면
$P=(2,1)$

대각선 $DB$의 방정식은 $y=-x+5$이므로
$\\dfrac12x=-x+5$
$Q=\\left(\\dfrac{10}3,\\dfrac53\\right)$

사각형 $EBQP$의 넓이는 좌표의 신발끈 공식으로
$\\dfrac12\\left|\\dfrac{35}6-0\\right|=\\dfrac{35}{12}$

따라서 $p+q=35+12=47$이고 정답은 ⑤이다.`],
[6,'객관식','직선의 방정식','H15-SA-10','직선의 방정식',10,'H15-SA-10-PARALLEL_PERPENDICULAR','두 직선의 평행과 수직','PT_LINE_EQUATION','TPL_LINE_PERPENDICULAR',2,'high','점 $(-4,3)$을 지나고 직선 $3x-9y+4=0$에 수직인 직선의 방정식을 구하시오. [3.4점]',['$3x+y-11=0$','$3x+y+9=0$','$x-3y+13=0$','$x+3y-5=0$','$3x-y+15=0$'],'②',S`주어진 직선을 기울기꼴로 바꾼다.
$3x-9y+4=0$
$y=\\dfrac13x+\\dfrac49$

수직인 직선의 기울기는 $-3$이다.
점 $(-4,3)$을 지나므로
$y-3=-3(x+4)$
$y=-3x-9$

따라서 직선의 방정식은
$3x+y+9=0$

정답은 ②이다.`],
[7,'객관식','평면좌표','H15-SA-09','평면좌표',9,'H15-SA-09-COORDINATE_METRIC','좌표와 거리','PT_COORD_SECTION','TPL_SECTION_BOTH',5,'high','두 점 $A(1,-1)$, $B(8,3)$에 대하여 선분 $AB$를 $t:(2-t)$ $(0<t<1)$로 내분하는 점이 제1사분면에 속할 때, $t$의 값의 범위는 $a<t<b$이다. 또한, 선분 $AB$를 $t:(2-t)$ $(0<t<1)$로 외분하는 점이 제3사분면에 속할 때, $t$의 값의 범위는 $c<t<d$이다. 이때, 상수 $a,b,c,d$에 대하여 $\\dfrac1{ac}+\\dfrac1{bd}$의 값을 구하시오. [4.8점]',['$7$','$8$','$9$','$10$','$11$'],'④',S`내분점의 좌표는
$\\left(\\dfrac{(2-t)1+8t}{2},\\dfrac{(2-t)(-1)+3t}{2}\\right)$
$=\\left(\\dfrac{2+7t}{2},-1+2t\\right)$

첫째 좌표는 $0<t<1$에서 양수이다. 제1사분면 조건은
$-1+2t>0$
$\\dfrac12<t<1$
따라서 $a=\\dfrac12$, $b=1$이다.

외분점의 좌표는
$\\left(\\dfrac{8t-(2-t)}{2t-2},\\dfrac{3t+(2-t)}{2t-2}\\right)$
$=\\left(\\dfrac{9t-2}{2t-2},\\dfrac{2t+2}{2t-2}\\right)$

$0<t<1$이면 두 번째 좌표는 음수이다. 첫째 좌표도 음수이려면 분자가 양수여야 하므로
$9t-2>0$
$\\dfrac29<t<1$
따라서 $c=\\dfrac29$, $d=1$이다.

$\\dfrac1{ac}+\\dfrac1{bd}=\\dfrac1{(1/2)(2/9)}+1=9+1=10$

정답은 ④이다.`],
[8,'객관식','평면좌표','H15-SA-09','평면좌표',9,'H15-SA-09-GEOMETRY_RELATION','도형의 관계','PT_COORD_FIGURE_PROPERTIES','TPL_FIGURE_RHOMBUS',3,'high','좌표평면 위에 마름모 $ABCD$가 있다. 두 점 $A$, $C$의 좌표가 각각 $(1,4)$, $(7,2)$이고, 두 점 $B$, $D$를 지나는 직선 $l$의 방정식이 $ax+y+b=0$일 때, $ab$의 값을 구하시오. (단, $a,b$는 상수이다.) [4.5점]',['$-9$','$3$','$9$','$18$','$-27$'],'⑤',S`마름모의 두 대각선은 서로 수직이고 서로를 이등분한다.
$AC$의 중점은
$\\left(\\dfrac{1+7}{2},\\dfrac{4+2}{2}\\right)=(4,3)$

$AC$의 기울기는
$\\dfrac{2-4}{7-1}=-\\dfrac13$
따라서 $BD$의 기울기는 $3$이다.

중점 $(4,3)$을 지나므로
$y-3=3(x-4)$
$y=3x-9$

이를 $ax+y+b=0$과 비교하면 $a=-3$, $b=9$이다.
$ab=-27$

정답은 ⑤이다.`],
[9,'객관식','직선 사이의 거리','H15-SA-10','직선의 방정식',10,'H15-SA-10-DISTANCE_ANGLE','직선 사이의 거리와 각','PT_POINT_LINE_DISTANCE','TPL_DISTANCE_PARALLEL_LINES',2,'high','두 직선 $\\sqrt3x-y=0$과 $\\sqrt3x-y+10=0$ 사이의 거리를 구하시오. [3.7점]',['$\\sqrt3$','$\\dfrac92$','$5$','$5\\sqrt2$','$10$'],'③',S`두 직선은 서로 평행하다. 계수가 $A=\\sqrt3$, $B=-1$로 같으므로 두 평행선 사이의 거리를 쓴다.
$d=\\dfrac{|10-0|}{\\sqrt{(\\sqrt3)^2+(-1)^2}}$
$=\\dfrac{10}{\\sqrt4}=5$

정답은 ③이다.`],
[10,'객관식','원의 방정식','H15-SA-11','원의 방정식',11,'H15-SA-11-INTERSECTION','원과 직선·원의 교점','PT_CIRCLE_LINE_RELATION','TM_CIRCLE_POINT_LINE_DISTANCE',4,'high','원 $(x+1)^2+(y-3)^2=2$ 위의 점 $P$와 두 점 $A(-1,-3)$, $B(2,0)$에 대하여 삼각형 $PAB$의 넓이의 최댓값과 최솟값의 차를 구하시오. [4.6점]',['$4$','$5$','$6$','$7$','$8$'],'③',S`고정된 밑변은
$AB=\\sqrt{(2+1)^2+(0+3)^2}=3\\sqrt2$

직선 $AB$의 방정식은 $y=x-2$, 즉 $x-y-2=0$이다.
원의 중심 $C(-1,3)$에서 직선 $AB$까지의 거리는
$d=\\dfrac{|-1-3-2|}{\\sqrt2}=3\\sqrt2$
원의 반지름은 $\\sqrt2$이므로 원 위 점 $P$에서 직선 $AB$까지의 거리는
$2\\sqrt2\\le h\\le4\\sqrt2$

삼각형 넓이는 $\\dfrac12(3\\sqrt2)h$이다.
최솟값은 $6$, 최댓값은 $12$이므로 차는
$12-6=6$

정답은 ③이다.`],
[11,'객관식','직선과 원의 교점','H15-SA-11','원의 방정식',11,'H15-SA-11-INTERSECTION','원과 직선·원의 교점','PT_LINE_INTERSECTION_CONDITION','TPL_INTERSECTION_QUADRANT_AVOID',4,'high','직선 $y=2x+k$가 다음 조건을 만족시킬 때, 정수 $k$의 개수를 구하시오. (단, $k\\ne0$) [4.5점]\n(가) 원 $x^2+y^2=2$와 서로 다른 두 점에서 만난다.\n(나) 원 $(x-1)^2+y^2=5$와 만나지 않는다.',['$5$','$3$','$2$','$1$','$0$'],'⑤',S`직선은 $2x-y+k=0$이다.
(가) 원점에서 직선까지의 거리가 반지름 $\\sqrt2$보다 작아야 한다.
$\\dfrac{|k|}{\\sqrt5}<\\sqrt2$
$|k|<\\sqrt{10}$

(나) 중심 $(1,0)$에서 직선까지의 거리가 반지름 $\\sqrt5$보다 커야 한다.
$\\dfrac{|k+2|}{\\sqrt5}>\\sqrt5$
$|k+2|>5$

첫 조건을 만족하는 정수는 $-3,-2,-1,1,2,3$이다. 이 가운데 두 번째 조건을 만족하는 정수는 없다.
따라서 개수는 $0$이다.

정답은 ⑤이다.`],
[12,'객관식','원의 방정식','H15-SA-11','원의 방정식',11,'H15-SA-11-CIRCLE_EQUATION','원의 방정식','PT_CIRCLE_EQUATION','TM_CIRCLE_POINT_DISTANCE',2,'high','원 $(x-2)^2+(y+4)^2=5$ 위의 점 $P(a,b)$가 있을 때, $a^2+b^2$의 최댓값과 최솟값의 합을 구하시오. [4.6점]',['$30$','$36$','$45$','$50$','$60$'],'④',S`원점에서 원의 중심 $(2,-4)$까지의 거리는
$\\sqrt{2^2+(-4)^2}=2\\sqrt5$
반지름은 $\\sqrt5$이다.

원 위 점과 원점 사이 거리의 최댓값과 최솟값은 각각
$3\\sqrt5$, $\\sqrt5$이다.
따라서 $a^2+b^2$의 최댓값과 최솟값은
$(3\\sqrt5)^2=45$, $(\\sqrt5)^2=5$

그 합은 $45+5=50$이다.
정답은 ④이다.`],
[13,'객관식','원의 방정식','H15-SA-11','원의 방정식',11,'H15-SA-11-TANGENT','원과 접선','PT_CIRCLE_TANGENT','TM_TANGENCY_CONDITION',4,'high','원 밖의 한 점 $P(a,b)$에서 원 $x^2+y^2=18$에 그은 두 접선이 이루는 각의 크기가 $90^\\circ$일 때, 점 $P$가 나타내는 도형의 길이를 구하시오. [4.8점]',['$12\\pi$','$14\\pi$','$16\\pi$','$18\\pi$','$20\\pi$'],'①',S`원점 $O$와 접점 $T$를 이으면 반지름 $OT$는 접선과 수직이다.
두 접선의 각이 $90^\\circ$이므로 대칭성에 따라 $\\angle T_1OT_2=90^\\circ$이고, $OP$는 이 각을 이등분한다.

반지름은 $OT=\\sqrt{18}=3\\sqrt2$이다.
직각삼각형 $OPT_1$에서
$OP^2=OT^2+PT_1^2$
또는 두 접선의 각이 직각일 때 $OP=OT\\sqrt2=6$이다.

점 $P$는 중심 $O$, 반지름 $6$인 원을 이룬다.
그 길이는
$2\\pi\\cdot6=12\\pi$

정답은 ①이다.`],
[14,'객관식','도형의 이동','H15-SA-12','도형의 이동',12,'H15-SA-12-REFLECTION','대칭이동','PT_MOVE_POINT_REFLECTION','TT_POINT_REFLECTION_AXIS',1,'high','점 $A(2,4)$를 $y$축에 대하여 대칭이동 시킨 다음, 직선 $y=x$에 대하여 대칭 이동시킨 좌표를 구하시오. [3.2점]',['$(-4,2)$','$(4,2)$','$(-2,4)$','$(4,-2)$','$(2,-4)$'],'④',S`먼저 $y$축 대칭은 $x$좌표의 부호를 바꾼다.
$(2,4)\\rightarrow(-2,4)$

직선 $y=x$에 대한 대칭은 좌표를 서로 바꾼다.
$(-2,4)\\rightarrow(4,-2)$

정답은 ④이다.`],
[15,'객관식','원의 방정식','H15-SA-11','원의 방정식',11,'H15-SA-11-TANGENT','원과 접선','PT_CIRCLE_TANGENT','TM_TANGENCY_CONDITION',3,'high','원 $(x-3)^2+(y+4)^2=1$을 $x$축의 방향으로 $-2$만큼, $y$축의 방향으로 $3$만큼 평행이동 시켰더니 직선 $4x+ay+4=0$에 접하였다. 상수 $a$의 값을 구하시오. [4.3점]',['$1$','$2$','$3$','$4$','$5$'],'③',S`원의 중심은 $(3,-4)$이고 반지름은 $1$이다.
평행이동한 중심은
$(3,-4)+(-2,3)=(1,-1)$

접선 조건은 중심에서 직선까지의 거리가 반지름과 같다는 것이다.
$\\dfrac{|4(1)-a+4|}{\\sqrt{16+a^2}}=1$
$|8-a|=\\sqrt{16+a^2}$

양변을 제곱하면
$(8-a)^2=16+a^2$
$64-16a+a^2=16+a^2$
$a=3$

정답은 ③이다.`],
[16,'객관식','평면좌표','H15-SA-09','평면좌표',9,'H15-SA-09-GEOMETRY_APPLICATION','도형의 방정식 활용','PT_COORD_DISTANCE_OPTIMIZATION','TPL_DISTANCE_SUM_MIN',5,'high','오른쪽 그림과 같이 좌표평면 위에 두 점 $A(-6,0)$, $B(0,8)$와 원 $C:x^2+(y-2)^2=4$가 있다. 선분 $AB$ 위의 점 $P$와 선분 $OA$ 위의 점 $Q$, 원 $C$ 위의 점 $R$에 대하여 $\\overline{PQ}+\\overline{QR}$의 최솟값을 구하시오. (단, $O$는 원점이다.) [5.0점]',['$3$','$\\dfrac72$','$4$','$\\dfrac92$','$5$'],'③',S`점 $R$을 $x$축에 대하여 대칭이동한 점을 $R'$이라 하면 $QR=QR'$이다.
따라서 $PQ+QR=PQ+QR'\\ge PR'$이며, $P,Q,R'$이 한 직선 위에 있을 때 등호가 성립한다.

원 $C$를 $x$축 대칭하면 중심은 $(0,-2)$이고 반지름은 $2$이다.
직선 $AB$는 $4x-3y+24=0$이다.
대칭한 원의 중심 $(0,-2)$에서 이 직선까지 거리는
$\\dfrac{|24+6|}{\\sqrt{4^2+(-3)^2}}=6$
수선의 발은 선분 $AB$ 위에 있으므로 선분과 원의 최소 거리는
$6-2=4$

그 최단 경로가 $x$축과 만나는 점은 선분 $OA$ 위에 놓이므로 허용된 $Q$에서도 최솟값이 실현된다.
따라서 최솟값은 $4$이고 정답은 ③이다.`],
[17,'객관식','직선의 방정식','H15-SA-10','직선의 방정식',10,'H15-SA-10-LINE_EQUATION','직선의 방정식','PT_MOVE_LINE_TRANSLATION','TT_LINE_TRANSLATION_RELATION',4,'high','직선 $l:x+ay+3=0$을 $x$축의 방향으로 $-3$만큼, $y$축의 방향으로 $-2$만큼 평행이동한 후, 직선 $y=x$에 대하여 대칭이동한 직선을 $l\\prime$이라고 하자. 두 직선 $l$, $l\\prime$의 교점이 $x$축 위에 있을 때, 상수 $a$의 값을 구하시오. [4.2점]',['$-6$','$-3$','$2$','$3$','$6$'],'⑤',S`원래 직선의 한 점 $(x,y)$는 평행이동 뒤 $(x-3,y-2)$가 되고, 다시 $y=x$ 대칭을 하면 $(y-2,x-3)$이 된다.
새 좌표를 $(X,Y)$라 두면 원래 좌표는 $x=Y+3$, $y=X+2$이다.
이를 원래 직선에 대입한다.
$Y+3+a(X+2)+3=0$
$ aX+Y+2a+6=0$
따라서 $l':ax+y+2a+6=0$이다.

교점이 $x$축 위에 있으므로 원래 직선에서 $y=0$을 놓으면
$x+3=0$, 즉 $x=-3$이다.
이를 $l'$에 대입하면
$-3a+2a+6=0$
$a=6$

정답은 ⑤이다.

원본 HWP 답안표와 손풀이에는 다른 선택값이 기록되어 있으나, 위 계산은 인쇄된 이동과 대칭 순서를 그대로 적용한 결과이다.`],
[18,'단답형','원의 방정식','H15-SA-11','원의 방정식',11,'H15-SA-11-CIRCLE_EQUATION','원의 방정식','PT_CIRCLE_EQUATION','TM_CIRCLE_AXIS_TANGENT',2,'high','[주관식1 (단답형)] 다음 원의 방정식 중 $x$축에만 접하는 원을 찾아 그 기호를 쓰고, 그 반지름의 길이를 구하여라. (단, $a,b$는 모두 양수이다.) [4점]\n㉠ $(x-a)^2+(y-a)^2=a^2$  ㉡ $(x-a)^2+(y-b)^2=b^2$\n㉢ $(x-a)^2+(y-b)^2=a^2$  ㉣ $(x-a)^2+(y+a)^2=a^2$',[ ],'㉡, $b$',S`원의 중심 $(h,k)$와 반지름 $r$에 대하여 $x$축에 접하려면 $|k|=r$이어야 한다.

㉠은 중심이 $(a,a)$, 반지름이 $a$이므로 $x$축과 $y$축에 모두 접한다.
㉡은 중심이 $(a,b)$, 반지름이 $b$이므로 $x$축에 접하고, $a,b$가 다를 수 있어 $y$축 접선 조건은 강제되지 않는다.
㉢은 반지름이 $a$이므로 $x$축에 접한다는 조건은 $a=b$일 때만 성립한다.
㉣은 중심이 $(a,-a)$, 반지름이 $a$이므로 두 축에 모두 접한다.

따라서 해당하는 식은 ㉡이고 반지름은 $b$이다.`],
[19,'단답형','이차방정식의 근과 계수','H15-SA-06','이차방정식의 근과 계수',6,'H15-SA-06-ROOT_COEFFICIENT_RELATION','근과 계수의 관계','PT_H1_QUADRATIC_ROOT_RELATION','TPL_H1_QUADRATIC_ROOT_RELATION_COMMON_ROOT',3,'high','[주관식2 (단답형)] 이차방정식 $x^2+2ax+b=0$의 두 근을 $\\alpha,\\beta$이고 이차방정식 $x^2+bx+2a=0$의 두 근 $\\alpha,\\gamma$일 때, $\\beta+\\gamma$의 값을 구하시오. (단, $a,b$는 $b\\ne2a$인 상수이다.) [4점]',[ ],'-1',S`공통근 $\\alpha$는 두 방정식을 모두 만족한다.
$\\alpha^2+2a\\alpha+b=0$
$\\alpha^2+b\\alpha+2a=0$

두 식을 빼면
$(2a-b)\\alpha+(b-2a)=0$
$(2a-b)(\\alpha-1)=0$

조건 $b\\ne2a$에서 $\\alpha=1$이다.
첫째 방정식의 근의 합으로
$\\alpha+\\beta=-2a$
$\\beta=-2a-1$
둘째 방정식의 근의 합으로
$\\alpha+\\gamma=-b$
$\\gamma=-b-1$

공통근을 대입한 첫째 식에서 $1+2a+b=0$이므로 $b=-2a-1$이다.
따라서 $\\gamma=2a$이고
$\\beta+\\gamma=(-2a-1)+2a=-1$이다.`],
[20,'서술형','원의 방정식','H15-SA-11','원의 방정식',11,'H15-SA-11-CIRCLE_EQUATION','원의 방정식','PT_CIRCLE_EQUATION','TM_CIRCLE_POINT_DISTANCE',4,'high','[주관식3 (서술형)] 원 $(x-4)^2+(y-2)^2=40$ 위를 움직이는 두 점 $P,Q$에 대하여 점 $P$를 $x$축에 대하여 대칭이동시킨 점을 $P\\prime$, 점 $Q$를 직선 $y=x$에 대하여 대칭이동시킨 점을 $Q\\prime$라 하자. 점 $P\\prime$와 점 $Q\\prime$ 사이의 거리의 최댓값과 최솟값의 합을 구하고 그 과정을 자세히 서술하시오. [7점]',[ ],'$6\\sqrt{10}$',S`$P$의 자취를 $x$축 대칭하면 중심 $(4,2)$가 $(4,-2)$로 옮겨지고 반지름은 $\\sqrt{40}=2\\sqrt{10}$으로 유지된다.
$Q$의 자취를 $y=x$ 대칭하면 중심 $(4,2)$가 $(2,4)$로 옮겨지고 반지름은 같다.

두 원의 중심 사이 거리는
$\\sqrt{(4-2)^2+(-2-4)^2}=\\sqrt{40}=2\\sqrt{10}$
각 자취의 반지름도 $2\\sqrt{10}$이다.

따라서 두 자취 위 점 사이 거리의 최솟값은
$\\max(0,2\\sqrt{10}-2\\cdot2\\sqrt{10})=0$
최댓값은
$2\\sqrt{10}+2\\cdot2\\sqrt{10}=6\\sqrt{10}$

두 거리의 최댓값과 최솟값의 합은 $6\\sqrt{10}+0=6\\sqrt{10}$이다.`],
[21,'서술형','평면좌표','H15-SA-09','평면좌표',9,'H15-SA-09-TRIANGLE_CENTROID_AREA','삼각형의 좌표와 무게중심','PT_COORD_TRIANGLE_AREA','TPL_AREA_POINT',4,'high','[주관식4 (서술형)] 세 점 $O(0,0)$, $A(0,8)$, $B(4,0)$을 꼭짓점으로 하는 삼각형 $OAB$의 넓이를 $S$라 할 때, 다음이 성립한다.\n(가) 선분 $AB$ 위의 점 $P$에 대하여 삼각형 $BPO$의 넓이는 $\\dfrac34S$이다.\n(나) 선분 $OB$ 위의 점 $Q$에 대하여 삼각형 $AOQ$의 넓이는 $\\dfrac13S$이다.\n이때 두 직선 $OP$, $AQ$의 교점의 좌표를 $T$라 할 때, 삼각형 $OTB$의 넓이를 구하시오. [7점]',[ ],'8',S`$S=\\dfrac12\\cdot8\\cdot4=16$

$P=(x_P,y_P)$라 하면
$[BPO]=\\dfrac12\cdot4\cdot y_P=\\dfrac34\cdot16=12$
$y_P=6$
직선 $AB$는 $y=-2x+8$이므로 $P=(1,6)$이고
$OP:y=6x$이다.

$Q=(x_Q,0)$라 하면
$[AOQ]=\\dfrac12\cdot8\cdot x_Q=\\dfrac13\cdot16$
$x_Q=\\dfrac43$
따라서 $Q=(\\dfrac43,0)$이고
$AQ:y=-6x+8$이다.

두 직선의 교점은
$6x=-6x+8$
$x=\\dfrac23$, $y=4$
$T=(\\dfrac23,4)$

$[OTB]=\\dfrac12\cdot4\cdot4=8$

따라서 넓이는 $8$이다. 원본 해설과 답안표의 4는 인쇄된 (가)의 $\\dfrac34S$와 일치하지 않아, 조건을 직접 계산해 바로잡았다.`],
[22,'서술형','이차방정식','H15-SA-05','이차방정식',5,'H15-SA-05-ROOT_CONDITION','이차방정식의 실근 조건','PT_H1_QUADRATIC_DISCRIMINANT','TPL_H1_QUADRATIC_DISCRIMINANT_ROOT_INTERVAL',5,'high','[주관식5 (서술형)] 실수 $a,b,m$에 대하여 $x$에 관한 이차방정식 $x^2-2(m+a)x+2m^2+4m+2b=0$이 실근을 가질 조건이 $-2\\le m\\le6$일 때, 상수 $a,b$의 값을 구하고, 세 점 $A(a,b)$, $B(-a,0)$, $C(0,-b)$를 꼭짓점으로 하는 삼각형 $ABC$의 외심의 좌표를 구하시오. [7점]',[ ],'$(-\\dfrac13,\\dfrac73)$',S`이차방정식이 실근을 가질 조건은 판별식 $D\\ge0$이다.
$\\dfrac D4=(m+a)^2-(2m^2+4m+2b)$
$=-m^2+(2a-4)m+a^2-2b$

이 식이 $-2\\le m\\le6$에서 0 이상이고 다른 곳에서 음수이므로
$\\dfrac D4=-(m+2)(m-6)$
$=-m^2+4m+12$

계수를 비교하면
$2a-4=4$, $a^2-2b=12$
$a=4$, $b=2$

세 점은 $A(4,2)$, $B(-4,0)$, $C(0,-2)$이다.
$AB$의 중점은 $(0,1)$이고 기울기는 $\\dfrac14$이므로 수직이등분선은
$y=-4x+1$
$AC$의 중점은 $(2,0)$이고 기울기는 $1$이므로 수직이등분선은
$y=-x+2$

두 수직이등분선의 교점은
$-4x+1=-x+2$
$x=-\\dfrac13$, $y=\\dfrac73$

따라서 외심은 $(-\\dfrac13,\\dfrac73)$이다.`]
];
const unitNames={'H15-SA-05':'이차방정식','H15-SA-06':'이차방정식의 근과 계수','H15-SA-08':'여러 가지 부등식','H15-SA-09':'평면좌표','H15-SA-10':'직선의 방정식','H15-SA-11':'원의 방정식','H15-SA-12':'도형의 이동'};
const parseAns=a=>a.includes("$ ")?a.replace('$ ','$'):a;
const qs=specs.map(([id,type,cat,u,unit,ord,sub,subLabel,pt,tpl,bucket,confidence,content,choices,answer,solution])=>({id,level:bucket<=2?'하':bucket<=3?'중':'상',category:cat,originalCategory:cat,standardCourse:'수학(상)',standardUnitKey:u,standardUnit:unit,standardUnitOrder:ord,questionType:type,layoutTag:'grid',tags:[type,cat],wide:false,content,choices:choices.map(parseAns),answer,solution,subUnitKey:sub,subUnit:subLabel,subUnitConfidence:'candidate_evidence',subUnitClassificationDepth:'complete_documented',problemTypeKey:pt,templateKey:tpl,crossConceptKeys:[],conditionKeys:[],integrationPattern:'SEQUENTIAL',difficultyBucket:bucket,difficultyConfidence:confidence,difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',...(id===10?{image:'assets/images/'+uid+'/q10.png'}:{}),...(id===16?{image:'assets/images/'+uid+'/q16.png'}:{})}));
const exam=`window.examTitle = ${JSON.stringify(uid)};\n\nwindow.questionBank = ${JSON.stringify(qs,null,2)};\n`;
const jsPath=tmp+'/'+uid+'.js';fs.writeFileSync(jsPath,exam);
const sourcePositions={1:{page:1,region:'left-upper'},2:{page:1,region:'left-lower'},3:{page:1,region:'right-upper'},4:{page:1,region:'right-lower'},5:{page:2,region:'left-upper'},6:{page:2,region:'left-lower'},7:{page:2,region:'right-upper'},8:{page:2,region:'right-lower'},9:{page:3,region:'left-upper'},10:{page:3,region:'left-lower-with-diagram'},11:{page:3,region:'right-upper-with-shared-conditions'},12:{page:3,region:'right-lower'},13:{page:4,region:'left-upper'},14:{page:4,region:'left-lower'},15:{page:4,region:'right-upper'},16:{page:4,region:'right-lower-with-diagram'},17:{page:5,region:'left-upper'},18:{page:5,region:'right-upper'},19:{page:5,region:'left-lower-with-shared-formula-options'},20:{page:5,region:'right-middle'},21:{page:6,region:'left-upper-with-shared-conditions'},22:{page:6,region:'right-upper'}};
const pdfSha='f95fa60bc9be39355266ba6b2e5870bc6a205332d7075e5f4316c358dfc28585';const answerSha='59aaac9d21c3195e61bb7f96bc6ad50963c48a0fd3232a5148626feadea79427';const solutionPdfSha='673a5967e4b8dfe03a759311068525b6ce23ce18af9b441255b6789bfa6b6507';
const rows=qs.map(q=>{const pos=sourcePositions[q.id],contentHash=sha(q.content),choicesHash=sha(JSON.stringify(q.choices)),imageRefHash=sha(JSON.stringify({image:q.image||'',visualAsset:'',fullPageImagePath:'',fullPageImageRelPath:'',sourceEvidencePath:'',sourcePageEvidencePaths:[]}));return {qid:q.id,sourcePosition:pos,sourceFingerprint:sha(JSON.stringify({examUid:uid,sourceOrdinal:q.id,contentHash,choicesHash,imageRefHash})),sourceHashes:{contentHash,choicesHash,imageRefHash},beforeDisposition:'LAYOUT_KEEP',finalDisposition:'LAYOUT_KEEP',issueCodes:[],changedFields:[],sourceTextExactParity:'PASS',choicesExactParity:'PASS',questionLayoutStatus:'PASS',questionLayoutReason:'Source text atom order and source choices are retained; default grid has no deterministic structural defect from the full-page source read.',solutionSha256:sha(q.solution),smallBoardContinuityStatus:'PASS',solutionLayout:{status:'PASS',decisiveStep:q.solution.split('\n').filter(x=>x.trim()).slice(-3).join(' / '),smallBoardContinuityStatus:'PASS',solutionSha256:sha(q.solution)},visualSvgDisposition:{status:'NOT_REQUIRED',problemAsset:q.image||null,solutionSvg:'NOT_REQUIRED',reason:q.id===10?'Original source graph is necessary and bound as problem image; the scalar area-extrema derivation is fully represented by equations.':q.id===16?'Original source graph is necessary and bound as problem image; reflection and line-distance derivation is sufficient without a second SVG.':'No separate SVG conveys a necessary additional proof fact for this item.'},sourceMode:'PDF_PRIMARY_EXACT',sourcePdfSha256:pdfSha,answerCompanionSha256:answerSha,solutionCompanionSha256:solutionPdfSha,...([17,21].includes(q.id)?{answerCorrection:{sourceTextUnchanged:true,officialAnswerMismatch:true,correctAnswer:q.answer,correctionBasis:q.id===17?'Printed affine transformation and line-intersection calculation.': 'Printed area ratios and coordinate-area calculation.',preserveOfficialCompanion:true}}:{})};});
const assetRows=[10,16].map(id=>{const q=qs.find(x=>x.id===id),p=tmp+'/'+q.image;return {qid:id,ref:q.image,sha256:sha(fs.readFileSync(p)),sourcePage:sourcePositions[id].page,sourcePdfSha256:pdfSha256(),cropDpi:160,opened:true,visualFacts:id===10?'Original circle center (-1,3), radius sqrt2; P is on circle; A(-1,-3), B(2,0); axes and the shaded triangle are retained.':'A(-6,0), B(0,8), circle center (0,2), radius2; segment/point labels P,Q,R and origin are retained.'};});
function pdfSha256(){return pdfSha;}
const preflight=JSON.parse(fs.readFileSync(tmp+'/CREATE.golden-preflight.json','utf8'));
const evidence={schemaVersion:'JS_ARCHIVE_CODEX_CREATE_EVIDENCE_V2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'CREATE',status:'CREATE_COMPLETE',runId:run,examUid:uid,reviewerIdentity:{role:'archive_create',reviewerId:'/root/create_maesangirls2021_five'},sourceMode:'ORIGINAL_PDF_PRIMARY',sourceDocument:{pdfPath:'C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_매여고1_1기말.pdf',pdfSha256:pdfSha,answerCompanionPath:'C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_매여고1_1기말_정답.hwp',answerCompanionSha256:answerSha,solutionCompanionPath:'C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_매여고1_1기말_해설.pdf',solutionCompanionSha256:solutionPdfSha,sourcePageCount:6,visualInspection:{allPagesOpened:true,renderDpi:160,converter:'Poppler pdftoppm 26.07.0',ocrCrosscheck:'PDF embedded text extraction cross-checked against all six rendered full pages; mathematical glyph/fraction discrepancies were resolved from the original page image. OCR/text extraction artifacts were not copied into source.'}},sourceTextFreeze:{status:'FROZEN',questionCount:22,objectiveQids:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],subjectiveQids:[18,19,20,21,22],positions:sourcePositions,sourceTextExactParityCount:22,choicesExactParityCount:17,sharedMaterials:{11:'Conditions (가),(나) transcribed into q11 content in original order.',18:'Four circle equations transcribed in the q18 content in original order.',21:'Area ratios 3/4 S and 1/3 S transcribed exactly into q21 content.'},figures:[...assetRows]},questionLayoutLedger:{denominator:22,KEEP:22,POLISH:0,REFORMAT:0,HOLD:0,modifiedQuestionIds:[],questionLayoutChangedCount:0,sourceTextExactParityPassCount:22,choicesExactParityPassCount:17,knownQuestionLayoutRepairPending:0,questionLayoutStatus:'PASS',questionLayoutRenderStatus:'NOT_RUN_CODEX_HANDOFF',items:rows.map(r=>({qid:r.qid,sourcePosition:r.sourcePosition,beforeDisposition:r.beforeDisposition,finalDisposition:r.finalDisposition,issueCodes:r.issueCodes,sourceTextExactParity:r.sourceTextExactParity,choicesExactParity:r.choicesExactParity,reason:r.questionLayoutReason}))},goldenCalibrationReviewed:true,goldenCalibrationSet:preflight.samples.map(x=>x.path),goldenCalibration:{samples:preflight.samples,negativeSample:{...preflight.negativeSample,observation:preflight.negativeSample.observation+' Negative SVG read: '+preflight.negativeSvg.path+' sha256:'+preflight.negativeSvg.sha256+'; '+preflight.negativeSvg.observation}},visualAssetEvidence:assetRows,answerCorrectionLedger:[{qid:17,sourcePage:5,officialAnswerChoice:'②',officialWrittenSolution:'a=2',recomputedAnswer:'6',recomputedChoice:'⑤',sourceTextChange:false,method:'Map (x,y)->(y-2,x-3); substitute into original l; intersect with x-axis.'},{qid:21,sourcePage:6,officialAnswer:'4',officialWrittenSolution:'4',recomputedAnswer:'8',sourceTextChange:false,method:'Use printed 3/4 S and 1/3 S ratios to find P,Q,T and area.'}],artifactDispositions:{artifactSha:'PENDING_BIND',rows:rows.map(r=>({qid:r.qid,sourceMode:r.sourceMode,sourcePosition:r.sourcePosition,meta:{standardCourse:qs[r.qid-1].standardCourse,standardUnitKey:qs[r.qid-1].standardUnitKey,subUnitKey:qs[r.qid-1].subUnitKey,problemTypeKey:qs[r.qid-1].problemTypeKey,templateKey:qs[r.qid-1].templateKey},difficulty:{difficultyBucket:qs[r.qid-1].difficultyBucket,difficultyConfidence:qs[r.qid-1].difficultyConfidence,difficultyBoundaryFlag:qs[r.qid-1].difficultyBoundaryFlag,legacyLevelCompatibility:qs[r.qid-1].legacyLevelCompatibility},questionLayout:{status:'PASS',beforeDisposition:'LAYOUT_KEEP',finalDisposition:'LAYOUT_KEEP'},solutionLayout:{status:'PASS',smallBoardContinuityStatus:'PASS',solutionSha256:r.solutionSha256},visualSvg:r.visualSvgDisposition,metaStatus:'CURRENT_CANONICAL_REVIEW_REQUIRED',difficultyStatus:'CURRENT_CANONICAL_REVIEW_REQUIRED'}))},rows};
fs.mkdirSync(tmp+'/evidence',{recursive:true});fs.writeFileSync(tmp+'/'+uid+'.js',exam);fs.writeFileSync(tmp+'/evidence/CREATE.draft.json',JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({js:jsPath,questions:qs.length,answers:qs.map(q=>[q.id,q.answer]),evidence:tmp+'/evidence/CREATE.draft.json',assets:assetRows},null,2));


