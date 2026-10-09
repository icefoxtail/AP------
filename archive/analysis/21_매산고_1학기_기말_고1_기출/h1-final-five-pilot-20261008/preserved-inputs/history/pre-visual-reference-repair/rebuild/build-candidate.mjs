import fs from 'node:fs';
import path from 'node:path';
const uid='21_매산고_1학기_기말_고1_기출';
const base=path.resolve('.tmp/archive/h1-final-five-pilot-20261008/21_매산고_1학기_기말_고1_기출/history/pre-visual-reference-repair/rebuild');
const imageRef=id=>`assets/images/${uid}/q${String(id)}-solution.svg`;
function make(id,x){
 const labels={8:'여러 가지 부등식',9:'평면좌표',10:'직선의 방정식',11:'원의 방정식',12:'도형의 이동'};
 return {
  id,level:x.level,category:x.category||labels[x.unit],originalCategory:x.originalCategory||labels[x.unit],
  standardCourse:'수학(상)',standardUnitKey:`H15-SA-${String(x.unit).padStart(2,'0')}`,standardUnit:labels[x.unit],standardUnitOrder:x.unit,
  subUnitKey:x.subUnit,subUnit:x.subLabel,subUnitConfidence:'candidate_evidence',subUnitClassificationDepth:'complete_candidate',
  problemTypeKey:x.pt,templateKey:x.tpl,crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',
  difficultyBucket:x.diff,difficultyConfidence:x.confidence||'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:x.level==='하'&&x.diff>1||x.level==='중'&&x.diff===1||x.level==='상'&&x.diff<4?'BORDERLINE_REVIEW':'NORMAL',
  questionType:x.type||'객관식',layoutTag:'grid',tags:x.tags||[],wide:false,
  content:x.content,choices:x.choices||[],answer:x.answer,solution:x.solution,
  ...(x.image?{image:x.image}:{}),...(x.svg?{solutionImage:imageRef(id)}:{}),
  ...(x.hold?{itemStatus:'HOLD',itemHoldReason:x.hold}:{}),
 };
}
const Q=[];
Q.push(make(1,{unit:8,subUnit:'H15-SA-08-SYSTEM_INEQUALITY',subLabel:'연립부등식',pt:'PT_H1_LINEAR_SYSTEM_INEQUALITY',tpl:'TPL_H1_LINEAR_INEQUALITY_INTERVAL',diff:1,level:'하',content:String.raw`※ 1번부터 15번까지는 객관식입니다.
다음 연립부등식의 해로 옳은 것은?
$\left\{\begin{aligned}4x-2&<3x\\2-x&\le 5x-4\end{aligned}\right.$\quad [3.9점]`,choices:[String.raw`1\le x\le 2`,String.raw`1<x\le 3`,String.raw`1\le x<2`,String.raw`1\le x<3`,String.raw`1<x\le 2`],answer:'③',solution:String.raw`첫째 부등식을 풀면
\(4x-2<3x\)
\(x<2\)이다.

둘째 부등식을 풀면
\(2-x\le5x-4\)
\(6\le6x\)
\(x\ge1\)이다.

두 해의 공통부분은
\(1\le x<2\)이다.

따라서 정답은 ③이다.`}));
Q.push(make(2,{unit:10,subUnit:'H15-SA-10-DISTANCE_ANGLE',subLabel:'직선 사이의 거리와 각',pt:'PT_POINT_LINE_DISTANCE',tpl:'TPL_POINT_LINE_DISTANCE_DIRECT',diff:2,level:'중',content:String.raw`점 \((3,-3)\)과 직선 \(y=2x+1\) 사이의 거리는? [3.8점]`,choices:[String.raw`2\sqrt5`,String.raw`3\sqrt5`,String.raw`4\sqrt5`,String.raw`5\sqrt5`,String.raw`6\sqrt5`],answer:'①',svg:true,solution:String.raw`직선의 방정식을 일반형으로 나타내면
\(2x-y+1=0\)이다.

점 \((3,-3)\)과 직선 사이의 거리는
\(\dfrac{|2\cdot3-(-3)+1|}{\sqrt{2^2+(-1)^2}}\)
\(=\dfrac{10}{\sqrt5}=2\sqrt5\)이다.

따라서 정답은 ①이다.`}));
Q.push(make(3,{unit:10,subUnit:'H15-SA-10-LINE_EQUATION',subLabel:'직선의 방정식',pt:'PT_LINE_EQUATION',tpl:'TPL_LINE_PARALLEL',diff:1,level:'하',content:String.raw`점 \((-1,1)\)을 지나고 직선 \(y=4x+7\)에 평행한 직선의 방정식은? [4.0점]`,choices:[String.raw`y=4x+5`,String.raw`y=-\dfrac14x+5`,String.raw`y=4x+7`,String.raw`y=-\dfrac14x+7`,String.raw`y=4x+11`],answer:'①',svg:true,solution:String.raw`구하는 직선은 \(y=4x+b\)로 놓을 수 있다.

점 \((-1,1)\)을 지나므로
\(1=4(-1)+b\)
\(b=5\)이다.

따라서 직선의 방정식은 \(y=4x+5\)이고, 정답은 ①이다.`}));
Q.push(make(4,{unit:9,subUnit:'H15-SA-09-COORDINATE_METRIC',subLabel:'좌표와 거리',pt:'PT_COORD_SECTION',tpl:'TPL_SECTION_INTERNAL',diff:2,level:'중',content:String.raw`두 점 \(A(1,2), B(6,7)\)에 대하여 선분 \(AB\)를 \(3:2\)로 내분하는 점의 좌표를 \((a,b)\)라고 할 때, \(a+b\)의 값은? [4.0점]`,choices:['6','7','8','9','10'],answer:'④',svg:true,solution:String.raw`\(AP:PB=3:2\)이므로 내분점은
\(P=\left(\dfrac{2\cdot1+3\cdot6}{3+2},\dfrac{2\cdot2+3\cdot7}{3+2}\right)\)
\(=(4,5)\)이다.

따라서 \(a+b=4+5=9\)이고, 정답은 ④이다.`}));
Q.push(make(5,{unit:11,subUnit:'H15-SA-11-TANGENT',subLabel:'원과 접선',pt:'PT_CIRCLE_TANGENT',tpl:'TM_TANGENT_GIVEN_SLOPE',diff:2,level:'중',content:String.raw`원 \(x^2+y^2=4\)에 접하고, 기울기가 \(2\)인 직선의 방정식이 될 수 있는 것은? [4.1점]`,choices:[String.raw`y=2x+2\sqrt3`,String.raw`y=2x-2\sqrt5`,String.raw`y=2x+2\sqrt6`,String.raw`y=2x-2\sqrt7`,String.raw`y=2x+2\sqrt{10}`],answer:'②',svg:true,solution:String.raw`기울기가 \(2\)인 직선을 \(y=2x+b\)라고 놓으면
\(2x-y+b=0\)이다.

원점에서 이 직선까지의 거리는
\(\dfrac{|b|}{\sqrt{2^2+(-1)^2}}=\dfrac{|b|}{\sqrt5}\)이다.

접선이므로 이 거리는 반지름 \(2\)와 같아야 한다.
\(\dfrac{|b|}{\sqrt5}=2\), 따라서 \(|b|=2\sqrt5\)이다.

보기 중 가능한 식은 \(y=2x-2\sqrt5\)이므로 정답은 ②이다.`}));
Q.push(make(6,{unit:9,subUnit:'H15-SA-09-COORDINATE_METRIC',subLabel:'좌표와 거리',pt:'PT_COORD_DISTANCE',tpl:'TPL_COORD_DISTANCE_DIRECT',diff:2,level:'중',content:String.raw`다음은 두 점 사이의 거리를 구하는 매산고 학생들의 대화이다. \(a,b,c\)에 들어갈 수로 알맞은 것은? (단, \(a,b,c\)는 상수) [4.2점]`,choices:[String.raw`(3,0,0)`,String.raw`(3,2,4)`,String.raw`(4,0,1)`,String.raw`(4,2,2)`,String.raw`(4,2,5)`],answer:'⑤',image:`assets/images/${uid}/q6.png`,tags:['표'],solution:String.raw`점 \(A(3,0), B(4,2)\)와 \(C(4,0)\)를 보면
\(AC=4-3=1\), \(BC=2-0=2\)이다.

\(\triangle ACB\)는 \(C\)에서 직각이므로
\(AB^2=AC^2+BC^2=1^2+2^2=5\)이다.

따라서 \(AB=\sqrt5\)이고 \(a=4, b=2, c=5\)이므로 정답은 ⑤이다.`}));
Q.push(make(7,{unit:11,subUnit:'H15-SA-11-INTERSECTION',subLabel:'원과 직선·원의 교점',pt:'PT_TWO_CIRCLES',tpl:'TM_TWO_CIRCLES_CENTER_LINE',diff:2,level:'중',content:String.raw`두 원 \(C:x^2+y^2=1,\ C':(x+4)^2+(y-3)^2=4\) 위를 움직이는 점을 각각 \(P,Q\)라 할 때, 선분 \(PQ\)의 길이의 최솟값은? [4.3점]`,choices:['0','1',String.raw`\sqrt2`,String.raw`\sqrt3`,'2'],answer:'⑤',svg:true,solution:String.raw`원의 중심과 반지름은 각각
\(C:(0,0),\ r_1=1\), \(C':(-4,3),\ r_2=2\)이다.

두 중심 사이의 거리는
\(\sqrt{(-4)^2+3^2}=5\)이다.

두 원의 중심을 잇는 선분 위에서 원 사이의 간격이 가장 작으므로
\(PQ_{\min}=5-1-2=2\)이다.

따라서 정답은 ⑤이다.`}));
Q.push(make(8,{unit:12,subUnit:'H15-SA-12-COMPOSITE_TRANSFORMATION',subLabel:'합성 변환',pt:'PT_MOVE_EQUATION_TRANSFORM',tpl:'TT_EQUATION_RELATION',diff:3,level:'중',content:String.raw`평행이동 \((x,y)\mapsto(x+1,y-1)\)에 의하여 점 \(P(1,3)\)은 점 \(P'\)로, 직선 \(l:x+2y-3=0\)은 직선 \(l'\)로 옮겨질 때, \(P'\)에서 \(l'\)로 내린 수선의 발의 좌표를 \((a,b)\)라 하자. \(10(a+b)\)의 값으로 알맞은 것은? [4.5점]`,choices:['8','16','24','28','32'],answer:'②',svg:true,solution:String.raw`점 \(P(1,3)\)은 \(P'(2,2)\)로 옮겨진다.

이동 후 직선의 식은 원래 좌표를 \((x-1,y+1)\)로 바꾸어
\((x-1)+2(y+1)-3=0\), 즉 \(x+2y-2=0\)이다.

점 \((2,2)\)에서 이 직선까지의 수선의 발은 법선벡터 \((1,2)\) 방향으로
\(\dfrac{2+2\cdot2-2}{1^2+2^2}=\dfrac45\)만큼 이동한 점이다.
\((a,b)=(2,2)-\dfrac45(1,2)=\left(\dfrac65,\dfrac25\right)\).

따라서 \(10(a+b)=10\cdot\dfrac85=16\)이고, 정답은 ②이다.`}));
Q.push(make(9,{unit:8,subUnit:'H15-SA-08-ABSOLUTE_INEQUALITY',subLabel:'절댓값 부등식',pt:'PT_H1_ABSOLUTE_VALUE_EQUATION_INEQUALITY',tpl:'TPL_H1_ABSOLUTE_PIECEWISE_CASE',diff:3,level:'중',content:String.raw`부등식 \(|2x-4|+|x-3|\le2\)의 해 중 정수 해의 개수는? [4.4점]`,choices:['1개','2개','3개','4개','5개'],answer:'②',solution:String.raw`절댓값 안의 식이 0이 되는 점은 \(x=2,3\)이다.

\(x\le2\)이면 \(-2x+4+3-x\le2\)이므로 \(x\ge\dfrac53\)이다. 이 구간의 정수 해는 \(2\)이다.

\(2\le x\le3\)이면 \(2x-4+3-x\le2\), 즉 \(x\le3\)이므로 정수 해는 \(2,3\)이다.

\(x\ge3\)이면 \(2x-4+x-3\le2\), 즉 \(x\le3\)이므로 정수 해는 \(3\)이다.

서로 다른 정수 해는 \(2,3\)의 두 개이다. 따라서 정답은 ②이다.`}));
Q.push(make(10,{unit:9,subUnit:'H15-SA-09-COORDINATE_METRIC',subLabel:'좌표와 거리',pt:'PT_COORD_DISTANCE_OPTIMIZATION',tpl:'TPL_DISTANCE_SQSUM_MIN',diff:3,level:'중',content:String.raw`두 점 \(A(5,-1), B(-3,1)\)과 직선 \(y=x-1\) 위의 점 \(P\)에 대하여 \(\overline{AP}^{\,2}+\overline{BP}^{\,2}\)가 최솟값을 가질 때, \(P\)를 중심으로 하고 \(y\)축에 접하는 원의 방정식이 \((x+a)^2+(y+b)^2=r^2\)이다. \(a+b+r\)의 값은? (단, \(a,b,r\)는 상수) [4.5점]`,choices:['0','1','2','3','4'],answer:'①',svg:true,solution:String.raw`\(\overline{AP}^{\,2}+\overline{BP}^{\,2}\)는 두 점 \(A,B\)의 중점에서 최솟값을 갖는다.
\(AB\)의 중점은 \(M=\left(\dfrac{5+(-3)}2,\dfrac{-1+1}2\right)=(1,0)\)이다.

\(M\)은 직선 \(y=x-1\) 위에 있으므로 최솟값을 주는 점은 \(P=(1,0)\)이다.

중심이 \((1,0)\)이고 \(y\)축에 접하므로 반지름은 \(1\)이다.
\((x-1)^2+y^2=1\)에서 \(a=-1,b=0,r=1\)이므로 \(a+b+r=0\).

따라서 정답은 ①이다.`}));
Q.push(make(11,{unit:11,subUnit:'H15-SA-11-INTERSECTION',subLabel:'원과 직선·원의 교점',pt:'PT_TWO_CIRCLES',tpl:'TM_TWO_CIRCLES_CENTER_LINE',diff:4,level:'상',content:String.raw`점 \((-1,2)\)에서 만나는 두 원이 \(x\)축에 접하고, 두 원의 중심이 직선 \(y=x+2\) 위에 있을 때, 각각의 원의 중심을 \(A,B\)라고 하자. 점 \(A,B\)에서 \(x\)축에 내린 수선의 발을 각각 \(A',B'\)라고 할 때, 도형 \(ABB'A'\)를 직선 \(y=x\)에 대칭이동하여 생긴 도형과 도형 \(ABB'A'\)가 겹치는 부분의 넓이는? [4.6점]`,choices:['4','6','8','10','12'],answer:'③',svg:true,solution:String.raw`중심을 \((t,t+2)\)라고 하면 반지름은 \(t+2\)이다. 이 원이 \((-1,2)\)를 지나므로
\((t+1)^2+t^2=(t+2)^2\).
\(t^2-2t-3=0\)에서 \(t=-1,3\)이므로 두 중심은 \(A=(-1,1), B=(3,5)\)이다.

따라서 \(A'=(-1,0), B'=(3,0)\)이다. \(ABB'A'\)와 그 대칭도형의 겹치는 영역을 \(x\)좌표로 나누면
\(0\le x\le1\)에서 높이는 \(x+2\),
\(1\le x\le2\)에서 높이는 \(3\),
\(2\le x\le3\)에서 높이는 \(5-x\)이다.

겹치는 넓이는
\(\int_0^1(x+2)\,dx+\int_1^2 3\,dx+\int_2^3(5-x)\,dx\)
\(=\dfrac52+3+\dfrac52=8\)이다.

따라서 정답은 ③이다.`}));
Q.push(make(12,{unit:8,subUnit:'H15-SA-08-SYSTEM_INEQUALITY',subLabel:'연립부등식',pt:'PT_H1_QUADRATIC_INEQUALITY',tpl:'TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL',diff:4,level:'상',content:String.raw`연립부등식 \(\left\{\begin{aligned}x^2+px+q&<0\\x^2-5x&\ge0\end{aligned}\right.\)의 해가 \(-3<x\le0\)이고, 실수 \(p,q\)가 \(|p|+|q|=7\)을 만족시킬 때, \(p^2+q^2\)의 값은? [4.6점]`,choices:['25','29','34','37','40'],answer:'④',solution:String.raw`첫째 이차식의 두 근을 \(-3,t\)라 하자. 해가 두 근 사이이고 둘째 부등식의 해와 교집합이 \((-3,0]\)이므로 \(t>0\)이다.

따라서 \(x^2+px+q=(x+3)(x-t)\)이고
\(p=3-t,\ q=-3t\)이다.

\(|p|+|q|=7\)이므로 \(|3-t|+3t=7\).
\(0<t\le3\)일 때 \(3-t+3t=7\)에서 \(t=2\)이다. \(t>3\)이면 \(t-3+3t=7\)에서 \(t=\dfrac52\)가 되어 조건에 맞지 않는다.

따라서 \(p=1,q=-6\)이고
\(p^2+q^2=1+36=37\)이다.

따라서 정답은 ④이다.`}));
Q.push(make(13,{unit:12,subUnit:'H15-SA-12-COMPOSITE_TRANSFORMATION',subLabel:'합성 변환',pt:'PT_MOVE_EQUATION_TRANSFORM',tpl:'TT_EQUATION_POINT_MAPPING',diff:3,level:'중',content:String.raw`좌표평면 위의 도형 \(f(x,y)=0\)을 \(x\)축 방향으로 \(5\)만큼, \(y\)축 방향으로 \(-3\)만큼 평행이동한 후, \(y=x\)에 대한 대칭이동을 하고 다시 \(y\)축에 대칭이동한 도형의 방정식이 \(f(ax+by+c,px+qy+r)=0\)이다. 이때 \(a+b+c+p+q+r\)의 값은? [4.6점]`,choices:['-4','-3','-2','-1','0'],answer:'③',svg:true,solution:String.raw`원래 점 \((X,Y)\)는 평행이동 후 \((X+5,Y-3)\)이 된다.
\(y=x\) 대칭 후에는 \((Y-3,X+5)\), 다시 \(y\)축 대칭 후에는 \((3-Y,X+5)\)이다.

최종 좌표를 \((x,y)=(3-Y,X+5)\)라 하면 역변환은
\(X=y-5,\quad Y=3-x\)이다.

따라서 새 도형의 방정식은 \(f(y-5,3-x)=0\)이고
\((a,b,c,p,q,r)=(0,1,-5,-1,0,3)\)이다.
\(a+b+c+p+q+r=-2\)이므로 정답은 ③이다.`}));
Q.push(make(14,{unit:9,subUnit:'H15-SA-09-TRIANGLE_CENTROID_AREA',subLabel:'삼각형의 좌표와 무게중심',pt:'PT_COORD_CENTROID',tpl:'TPL_CENTROID_APPLICATION',diff:3,level:'중',content:String.raw`원 \(C:x^2+y^2=25\) 위에 정점 \(A(5,0)\)와 동점 \(B\)가 있다. 삼각형 \(OAB\)의 움직이는 무게중심이 그리는 도형의 길이는? (단, \(O\)는 원점이다.) [4.8점]`,choices:[String.raw`\dfrac5{12}\pi`,String.raw`\dfrac56\pi`,String.raw`\dfrac53\pi`,String.raw`\dfrac{10}3\pi`,String.raw`\dfrac{20}3\pi`],answer:'②',svg:true,solution:String.raw`\(B=(x,y)\)라 하면 무게중심은
\(G=\left(\dfrac{5+x}{3},\dfrac y3\right)\)이다.

\(B\)는 반지름 \(5\)인 원의 제1사분원 위를 움직이므로 \(G\)는 중심 \(\left(\dfrac53,0\right)\), 반지름 \(\dfrac53\)인 원의 \(\dfrac14\)호를 그린다.

따라서 그 길이는
\(\dfrac14\cdot2\pi\cdot\dfrac53=\dfrac56\pi\)이다.

정답은 ②이다.`}));
Q.push(make(15,{unit:8,subUnit:'H15-SA-08-INEQUALITY_BASIC',subLabel:'부등식의 풀이',pt:'PT_H1_QUADRATIC_INEQUALITY',tpl:'TPL_H1_QUADRATIC_INEQUALITY_GLOBAL_PARAMETER',diff:4,level:'상',content:String.raw`모든 실수 \(x\)에 대하여 \(x^2+3|x-a|-a^2\ge0\)이 성립할 때, 상수 \(a\)의 최댓값을 구하면 \(p\)이다. 이때, \(4p\)의 값은? [4.7점]`,choices:['1','2','4','6','8'],answer:'④',solution:String.raw`\(x\ge a\)이면 \(x^2+3|x-a|-a^2=(x-a)(x+a+3)\)이다. 이 식이 모든 \(x\ge a\)에서 음이 아니려면 \(2a+3\ge0\), 즉 \(a\ge-\dfrac32\)이어야 한다.

\(x<a\)이면 \(x^2+3|x-a|-a^2=(x-a)(x+a-3)\)이다. 이 식이 모든 \(x<a\)에서 음이 아니려면 \(2a-3\le0\), 즉 \(a\le\dfrac32\)이어야 한다.

따라서 \(-\dfrac32\le a\le\dfrac32\)이고 최댓값은 \(p=\dfrac32\)이다.
\(4p=6\)이므로 정답은 ④이다.`}));
Q.push(make(16,{unit:11,subUnit:'H15-SA-11-INTERSECTION',subLabel:'원과 직선·원의 교점',pt:'PT_CIRCLE_LINE_RELATION',tpl:'TM_CIRCLE_LINE_POSITION',diff:2,level:'중',type:'단답형',content:String.raw`<단답형 1>
원 \(x^2+y^2=2\)와 직선 \(y=2x+k\)가 만나지 않도록 하는 실수 \(k\)의 범위를 구하시오. [4점]`,answer:String.raw`k<-\sqrt{10}\quad\text{또는}\quad k>\sqrt{10}`,svg:true,solution:String.raw`원의 중심은 \((0,0)\), 반지름은 \(\sqrt2\)이다.

직선은 \(2x-y+k=0\)이므로 원점에서 직선까지의 거리는
\(\dfrac{|k|}{\sqrt{2^2+(-1)^2}}=\dfrac{|k|}{\sqrt5}\)이다.

원이 직선과 만나지 않으려면 이 거리가 반지름보다 커야 하므로
\(\dfrac{|k|}{\sqrt5}>\sqrt2\), 즉 \(|k|>\sqrt{10}\)이다.

따라서 \(k<-\sqrt{10}\) 또는 \(k>\sqrt{10}\)이다.`}));
Q.push(make(17,{unit:10,subUnit:'H15-SA-10-PARALLEL_PERPENDICULAR',subLabel:'두 직선의 평행과 수직',pt:'PT_LINE_RELATION',tpl:'TPL_RELATION_PERPENDICULAR_PARAMETER',diff:4,level:'상',confidence:'low',type:'단답형',content:String.raw`<단답형 2>
두 직선 \(y=m(x-2),\ y=-\dfrac1m x+6\)의 교점을 \(P\)라고 하자. 점 \(P\)는 \((p,q)\)를 제외한 원 \(C\) 위를 움직일 때, 원 \(C\)의 방정식을 구하면 중심이 \((a,b)\)이고 반지름이 \(r\)인 원이다. \(a+b+r^2-p-q\)의 값을 구하시오. (단, \(m\ne0\)은 실수) [5점]`,answer:'[정답불가]',svg:false,hold:'두 직선의 교점 자취는 중심 (1,3), 반지름 √10인 원에서 m=0에 해당하는 (0,0)과 유한한 실수 m으로 얻을 수 없는 (2,6)을 모두 제외한다. 원문은 제외점을 하나 (p,q)만 지정하므로 p,q가 유일하지 않아 요구값이 14 또는 6으로 달라진다.',solution:String.raw`두 직선은 각각 \(A(2,0)\), \(B(0,6)\)을 지나고 기울기의 곱이 \(-1\)이므로 \(\angle APB=90^\circ\)이다.

따라서 \(P\)는 지름 \(AB\)인 원 위에 있고, 그 원의 중심은 \((1,3)\), 반지름은 \(\dfrac{AB}{2}=\sqrt{10}\)이다.

교점을 계산하면 \(P=(0,0)\)은 \(m=0\)일 때만 나오고, \(P=(2,6)\)은 유한한 실수 \(m\)으로는 나오지 않는다. 따라서 실제 자취에서는 두 점이 제외된다.

원문은 제외점을 하나 \((p,q)\)로만 적어 \((p,q)=(0,0)\)인지 \((2,6)\)인지 결정하지 못한다. 두 경우 요구값은 각각 \(1+3+10=14\), \(1+3+10-2-6=6\)으로 달라진다. 원문의 조건으로는 답이 하나로 정해지지 않는다.`}));
Q.push(make(18,{unit:8,subUnit:'H15-SA-08-QUADRATIC_INEQUALITY',subLabel:'이차부등식',pt:'PT_H1_QUADRATIC_INEQUALITY',tpl:'TPL_H1_QUADRATIC_INEQUALITY_GLOBAL_PARAMETER',diff:5,level:'상',type:'단답형',content:String.raw`<단답형 3>
최고차항의 계수가 \(a\)인 이차함수 \(f(x)\)와 이차함수 \(g(x)=-x^2+2x+b\)에 대하여 함수
\(h(x)=\begin{cases}f(x)&(f(x)\ge g(x))\\g(x)&(f(x)<g(x))\end{cases}\)
는 다음 조건을 만족시킨다.
(가) 모든 실수 \(x\)에 대하여 \(f(4-x)=f(x)\).
(나) 부등식 \(h(x)\le5\)의 해는 \(\dfrac32\le x\le\dfrac52\)이다.
모든 실수 \(x\)에 대하여 부등식 \(f(x)\ge0\)이 성립하도록 하는 실수 \(a,b\)에 대하여 \(a+b\)의 최댓값을 구하시오. [6점]`,answer:String.raw`\dfrac{97}{4}`,svg:true,solution:String.raw`(가)에서 \(f\)의 대칭축은 \(x=2\)이다. 또 \(f(x)\ge0\)이 모든 실수에서 성립하므로 \(f(x)=a(x-2)^2+d\)에서 \(a>0,d\ge0\)이다.

\(h(x)\le5\)의 해가 \([\frac32,\frac52]\)이므로 특히 양 끝점에서 \(f(x)\le5\)이다.
\(f(\frac32)=f(\frac52)=\frac a4+d\le5\)이므로 \(a\le20\).

\(g(\frac32)=b+\frac34\le5\)이므로 \(b\le\frac{17}{4}\).

두 상한은 \(f(x)=20(x-2)^2\), \(b=\frac{17}{4}\)에서 동시에 가능하다. 이때 \(f(x)\le5\)의 해가 정확히 \([\frac32,\frac52]\)이고 그 구간에서 \(g(x)\le5\)도 성립한다.

따라서 \(a+b\)의 최댓값은 \(20+\frac{17}{4}=\frac{97}{4}\)이다.`}));
Q.push(make(19,{unit:10,subUnit:'H15-SA-10-DISTANCE_ANGLE',subLabel:'직선 사이의 거리와 각',pt:'PT_TRIANGLE_INCENTER_FROM_LINES',tpl:'TPL_INCENTER_BY_EQUAL_DISTANCE',diff:5,level:'상',type:'서술형',content:String.raw`<서술형 1>
반지름의 길이가 \(2\)인 원이 있다. 원의 넓이를 이등분하고 \(y\)축과 평행한 직선이 원과 만나는 점을 \(y\)값이 큰 값을 차례로 \(A,B\)라 하면 원 위의 한 점 \(C(3,2)\)에 대하여 삼각형 \(ABC\)의 넓이가 \(4\)이다. 이때 직선 \(AC\)와 직선 \(AC\)를 \(x\)축, \(y\)축, 원점에 대하여 대칭이동하여 생긴 직선들로 둘러싸인 도형에 내접하는 원의 넓이를 구하시오. (단, 점 \(A\)는 점 \(C\)보다 왼쪽에 위치) [10점]`,answer:String.raw`\dfrac{25\pi}{2}`,svg:true,solution:String.raw`원의 넓이를 이등분하는 \(y\)축과 평행한 직선은 원의 중심을 지난다. \(A,B\)는 지름의 양 끝점이므로 \(AB=4\)이다.

삼각형 \(ABC\)의 넓이가 \(4\)이므로 \(AB\)와 점 \(C\) 사이의 거리는
\(\dfrac{2\cdot4}{4}=2\)이다.

\(C=(3,2)\)이고 중심은 \(AB\) 위에 있으며 반지름이 \(2\)이므로 중심의 \(y\)좌표는 \(2\), \(x\)좌표는 \(1\) 또는 \(5\)이다. 조건에서 \(A\)는 \(C\)보다 왼쪽이므로 중심은 \((1,2)\)이다.
\(A=(1,4), B=(1,0)\)이고 \(AC\)의 방정식은 \(y=-x+5\)이다.

이를 네 방향으로 대칭이동한 직선은
\(y=-x+5,\ y=x-5,\ y=x+5,\ y=-x-5\)이다. 이 네 직선이 만드는 마름모의 중심에서 각 변까지의 거리는 \(\dfrac5{\sqrt2}\)이다.

따라서 내접원의 넓이는 \(\pi(\frac5{\sqrt2})^2=\frac{25\pi}{2}\)이다.`}));
Q.push(make(20,{unit:10,subUnit:'H15-SA-10-EQUATION_APPLICATION',subLabel:'방정식과 부등식의 활용',pt:'PT_LINE_INTERSECTION_CONDITION',tpl:'TPL_INTERSECTION_TRIANGLE_FORMATION',diff:4,level:'상',confidence:'low',type:'서술형',content:String.raw`<서술형 2>
서로소인 두 자연수 \(a,b\) (단, \(1<a<b\))와 양수 \(c\)에 대하여 다음 세 직선 \(l,m,n\)이 만드는 삼각형의 꼭짓점의 \(x\)좌표와 \(y\)좌표가 모두 정수이다. 이 삼각형의 넓이가 \(150\) 이하의 자연수가 되도록 하는 \(a,b\)의 순서쌍 \((a,b)\)의 개수를 구하시오.
\(l:y=-\dfrac ab x+c,\quad m:y=\dfrac ba x,\quad n:y=\dfrac{b-a}{a+b}x\) [10점]`,answer:'[정답불가]',svg:false,hold:'원문에는 양수 c의 고정값도, (a,b)별 c의 존재·선택 조건도 없다. 교점 정수 조건은 t=bc/(a²+b²)가 양의 정수임을 주지만, 삼각형 넓이는 t²(a²+b²)/2라서 허용되는 (a,b)의 집합은 c 또는 양화 해석에 따라 달라진다. 예를 들어 (2,3)은 c=13/3이면 넓이 13/2로 자연수가 아니고 c=26/3이면 넓이 26으로 조건을 만족한다. 따라서 순서쌍의 개수를 하나로 정할 수 없다.',solution:String.raw`두 직선 \(m,n\)은 원점을 지나고 기울기의 곱은
\(\dfrac ba\cdot\dfrac{b-a}{a+b}\)이다. 각 교점을 직접 구해 삼각형의 넓이를 계산해야 한다.

\(l\)과 \(m\)의 교점은 \(M=(\frac{abc}{a^2+b^2},\frac{b^2c}{a^2+b^2})\), \(l\)과 \(n\)의 교점은 \(N=(\frac{bc(a+b)}{a^2+b^2},\frac{bc(b-a)}{a^2+b^2})\)이다.

\(t=\dfrac{bc}{a^2+b^2}\)라 놓으면 \(M=(at,bt)\), \(N=((a+b)t,(b-a)t)\)이다. \(a,b\)가 서로소이므로 두 점의 좌표가 모두 정수일 조건은 \(t\)가 정수인 것이다. 이때 삼각형 넓이는 \(\dfrac{t^2(a^2+b^2)}2\)이다.

그러나 원문은 양수 \(c\)의 값을 고정하지 않고, 각 \((a,b)\)에 대해 \(c\)를 선택할 수 있는지도 명시하지 않았다. 따라서 정수 \(t\)가 달라지면 넓이 조건을 만족하는 순서쌍도 달라져 개수를 하나로 결정할 수 없다.`}));
const out=`window.examTitle = ${JSON.stringify(uid)};\nwindow.questionBank = ${JSON.stringify(Q,null,2)};\n`;
fs.writeFileSync(path.join(base,`${uid}.js`),out,'utf8');
console.log(JSON.stringify({path:path.join(base,`${uid}.js`),questionCount:Q.length,holdQids:Q.filter(q=>q.itemStatus==='HOLD').map(q=>q.id)}));






