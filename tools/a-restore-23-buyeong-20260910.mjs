import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const workRoot = path.join(repoRoot, 'archive', '_generated', 'nightly-h1-2sem', '20260908', 'work', '23_buyeong_2mid');
const BS = String.fromCharCode(92);
const tex = (value) => value.replaceAll('§', BS);

const common = {
  1: { category: '집합', standardCourse: '수학(하)', standardUnitKey: 'H15-SB-01', standardUnit: '집합의 연산', subUnitKey: 'H15-SB-01-SET_OPERATION', subUnit: '집합의 연산', content: '집합 $A=§{§varnothing,1,3§}$에 대하여 다음 중 옳지 않은 것은? [3.9점]', choices: ['§{§varnothing§}§subset A', '$A§subset A$', '$§varnothing§in A$', '§{3§}§in A', '$n(A)=3$'], answer: '④', solution: '$§{3§}$은 $A$의 원소가 아니므로 옳지 않다. 나머지 선택지는 모두 참이다. 따라서 정답은 ④이다.' },
  2: { category: '명제', standardCourse: '수학(하)', standardUnitKey: 'H15-SB-02', standardUnit: '명제와 진리집합', subUnitKey: 'H15-SB-02-PROPOSITION_BASIC', subUnit: '명제와 진리집합', content: '다음 <보기> 중 참인 명제를 있는 대로 고르면 모두 몇 개인가? [4.1점] ㄱ. $x$는 실수이다. ㄴ. $§pi$는 유리수이다. ㄷ. 김○원 선생님은 예쁘다. ㄹ. $x§le9$이면 $x<3$이다. ㅁ. $x^3=4x$이면 $x^2=4$이다. ㅂ. 모든 사각형은 사다리꼴이다. ㅅ. 어떤 정삼각형은 이등변삼각형이 아니다. ㅇ. 모든 실수 $x$에 대하여 $x^2+x+1§ge§dfrac34$이다.', choices: ['1', '2', '3', '4', '5'], answer: '②', solution: '참인 명제는 ㄱ과 ㅇ이다. ㄴ은 $§pi$가 무리수이므로 거짓이다. ㄹ, ㅁ, ㅅ도 반례가 있으므로 거짓이다. ㅂ은 이 시험의 정의에서 사다리꼴을 평행한 한 쌍의 변을 갖는 사각형으로 보므로 거짓이다. 따라서 참인 명제는 2개이고 정답은 ②이다.' },
  3: { category: '도형의 방정식', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-11', standardUnit: '원의 방정식', subUnitKey: 'H15-SA-11-CIRCLE_EQUATION', subUnit: '원의 방정식', content: '$x$축과 $y$축에 동시에 접하고 중심이 제3사분면에 속하며 반지름의 길이가 2인 원의 방정식은? [3.9점]', choices: ['$(x-2)^2+(y-2)^2=2$', '$(x+2)^2+(y+2)^2=2$', '$(x-2)^2+(y-2)^2=4$', '$(x+2)^2+(y+2)^2=4$', '$(x+2)^2+(y-2)^2=4$'], answer: '④', solution: '두 축에 접하고 반지름이 2이므로 중심의 좌표는 각 좌표의 절댓값이 2이다. 중심이 제3사분면이므로 중심은 $(-2,-2)$이고, 원의 방정식은 $(x+2)^2+(y+2)^2=4$이다. 따라서 정답은 ④이다.' },
  4: { category: '도형의 방정식', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-10', standardUnit: '원의 접선', subUnitKey: 'H15-SA-10-TANGENT', subUnit: '원의 접선', content: '원 $x^2+y^2=10$ 위의 점 $(1,a)$에서의 접선의 방정식이 점 $(4,b)$를 지날 때, $a+b$의 값은? (단, $a>0$) [4점]', choices: ['5', '6', '7', '8', '9'], answer: '①', solution: '점 $(1,a)$가 원 위에 있으므로 $1+a^2=10$, $a>0$에서 $a=3$이다. 이 점에서의 접선은 $x+3y=10$이다. 점 $(4,b)$를 대입하면 $4+3b=10$이므로 $b=2$이다. 따라서 $a+b=5$이고 정답은 ①이다.' },
  5: { category: '도형의 이동', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-12', standardUnit: '평행이동', subUnitKey: 'H15-SA-12-TRANSLATION', subUnit: '평행이동', content: '점 $A(3,1)$을 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 2만큼 평행이동 하였더니 직선 $y=2x-5$를 지날 때, $a$의 값은? [4.2점]', choices: ['$-1$', '0', '1', '2', '3'], answer: '③', solution: '이동한 점은 $(3+a,3)$이다. 이 점이 직선 위에 있으므로 $3=2(3+a)-5$이고, $a=1$이다. 따라서 정답은 ③이다.' },
  6: { category: '도형의 이동', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-12', standardUnit: '평행이동', subUnitKey: 'H15-SA-12-TRANSLATION', subUnit: '평행이동', content: '원 $C_1:(x-1)^2+y^2=9$를 원 $C_2:(x+1)^2+(y-3)^2=9$로 옮기는 평행이동에 의하여 직선 $l:x-2y+1=0$은 직선 $l\'$:$x+ay+b=0$으로 옮겨진다. 이때 $a+b$의 값은? (단, $a,b$는 상수) [4.3점]', choices: ['1', '3', '5', '7', '9'], answer: '④', solution: '두 원의 중심은 각각 $(1,0),(-1,3)$이므로 평행이동 벡터는 $(-2,3)$이다. 원래 직선의 점 $(x,y)$가 $(X,Y)=(x-2,y+3)$으로 이동하므로 $x=X+2$, $y=Y-3$을 $x-2y+1=0$에 대입하면 $X-2Y+9=0$이다. 따라서 $a=-2,b=9$이고 $a+b=7$이므로 정답은 ④이다.' },
  7: { content: '함수 $f(x)=§dfrac{bx+1}{ax-2}$와 그 역함수 $f^{-1}(x)$에 대하여 $f^{-1}(3)=1$, $(f§circ f)(1)=§dfrac85$일 때, $f(2)$의 값은? [3.9점]', choices: ['$§dfrac12$', '$§dfrac34$', '$§dfrac{11}{6}$', '2', '$§dfrac94$'], answer: '③', solution: '$f^{-1}(3)=1$에서 $f(1)=3$이고, $(f§circ f)(1)=§dfrac85$에서 $f(3)=§dfrac85$이다. 두 식을 대입하면 $a=4,b=5$이고, $f(2)=§dfrac{11}{6}$이다. 따라서 정답은 ③이다.' },
  8: { category: '여러 가지 부등식', standardCourse: '수학(하)', standardUnitKey: 'H15-SA-08', standardUnit: '부등식의 풀이', subUnitKey: 'H15-SA-08-INEQUALITY_BASIC', subUnit: '부등식의 풀이', content: '실수 $a,b$에 대하여 옳은 것만을 고르면? [4.2점] ㄱ. $|a|+|b|§ge|a+b|$  ㄴ. $a>0,b>0$일 때 $§dfrac{a+b}{2}§ge§sqrt{ab}$  ㄷ. $a^2-ab+b^2<0$', choices: ['ㄱ', 'ㄴ', 'ㄱ,ㄴ', 'ㄴ,ㄷ', 'ㄱ,ㄴ,ㄷ'], answer: '③', solution: 'ㄱ은 삼각부등식으로 참이고, ㄴ은 산술-기하평균 부등식으로 참이다. ㄷ의 왼쪽은 $a^2-ab+b^2=§dfrac12((a-b)^2+a^2+b^2)§ge0$이므로 거짓이다. 따라서 정답은 ③이다.' },
  9: { category: '집합', standardCourse: '수학(하)', standardUnitKey: 'H15-SB-01', standardUnit: '집합의 연산', subUnitKey: 'H15-SB-01-SET_CARDINALITY', subUnit: '집합의 원소의 개수', content: '전체집합 $U$의 두 부분집합 $A,B$에 대하여 $n(A§cup B)=6$, $n(A§cap B^C)=4$를 만족할 때, $n(A^C§cap B)$의 최댓값은? [4.1점]', choices: ['2', '3', '4', '5', '6'], answer: '①', solution: '$n(A§cap B^C)=n(A-B)=4$이다. $n(A§cup B)=n(A-B)+n(A§cap B)+n(B-A)=6$이므로 $n(B-A)$는 $n(A§cap B)$가 최소일 때 최대이다. 교집합을 0으로 둘 수 있으므로 최댓값은 $6-4=2$이고 정답은 ①이다.' },
  10: { category: '도형의 방정식', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-09', standardUnit: '도형의 방정식 활용', subUnitKey: 'H15-SA-09-GEOMETRY_APPLICATION', subUnit: '도형의 방정식 활용', content: '원 $x^2+y^2-2x-8=0$ 위의 점 $P(a,b)$에 대하여 $§dfrac{b-3}{a-5}$의 최댓값을 $§dfrac{q}{p}$라 할 때, $p+q$의 값은? (단, $p,q$는 서로소인 자연수) [4.6점]', choices: ['29', '30', '31', '32', '33'], answer: '③', solution: '점 $(5,3)$에서 원 $(x-1)^2+y^2=9$에 그은 접선의 기울기가 비의 최댓값이다. 직선 $y-3=m(x-5)$가 원에 접할 조건은 $§dfrac{|3-4m|}{§sqrt{m^2+1}}=3$이므로 $m=0$ 또는 $m=§dfrac{24}{7}$이다. 최댓값은 $§dfrac{24}{7}$이므로 $p+q=31$이고 정답은 ③이다.' },
  11: { category: '도형의 이동', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-12', standardUnit: '평행이동', subUnitKey: 'H15-SA-12-TRANSLATION', subUnit: '평행이동', content: '직선 $l:y=2x-3$을 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 3만큼 평행이동한 직선이 원 $C:x^2+y^2+4x-4y+4=0$의 넓이를 이등분할 때, $a$의 값은? [4.5점]', choices: ['$-3$', '$-2$', '$-1$', '0', '1'], answer: '①', solution: '평행이동한 직선은 $y=2x-2a$이다. 원은 $(x+2)^2+(y-2)^2=4$이므로 넓이를 이등분하는 직선은 중심 $(-2,2)$를 지난다. 따라서 $2=2(-2)-2a$에서 $a=-3$이고 정답은 ①이다.' },
  12: { category: '도형의 이동', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-12', standardUnit: '대칭이동', subUnitKey: 'H15-SA-12-REFLECTION', subUnit: '대칭이동', content: '좌표평면에서 자연수 $n$에 대하여 점 $A_n$과 점 $B_n$을 다음과 같이 정하자. (가) $A_1(2,1)$  (나) 점 $B_n$은 점 $A_n$을 원점에 대하여 대칭이동시킨 점이다. (다) 점 $A_{n+1}$은 점 $B_n$을 $y=x$에 대하여 대칭이동시킨 점이다. 점 $A_{50}$의 $x$좌표를 $§alpha$, 점 $B_{53}$의 $y$좌표를 $§beta$라 할 때, $§alpha-§beta$의 값은? [4.6점]', choices: ['0', '1', '2', '3', '4'], answer: '④', solution: '$A_{n+1}=(-y_n,-x_n)$이므로 $A_{n+2}=A_n$이다. 따라서 $A_{50}=A_1=(2,1)$이고 $A_{53}=A_1=(2,1)$이다. $B_{53}=(-2,-1)$이므로 $§alpha-§beta=2-(-1)=3$이고 정답은 ④이다.' },
  13: { category: '집합', standardCourse: '수학(하)', standardUnitKey: 'H15-SB-01', standardUnit: '집합의 연산', subUnitKey: 'H15-SB-01-SET_OPERATION', subUnit: '집합의 연산', content: '집합 $A=§{x§mid x는 자연수§}$에 대하여 다음 조건을 만족시키는 집합 $B$의 개수는? (가) $B§subset A$이고 $n(B)§ne0$ (나) $x§in B$이면 $§dfrac{16}{x}§in B$ [4.7점]', choices: ['2', '4', '6', '7', '10'], answer: '④', solution: '$B$에 들어갈 수 있는 원소는 $1,2,4,8,16$이다. 조건 (나)에 따른 원소의 묶음은 $§{1,16§}$, $§{2,8§}$, $§{4§}$의 세 개이다. 이 중 하나 이상을 선택하는 방법은 $2^3-1=7$이므로 정답은 ④이다.' },
  14: { category: '함수', standardCourse: '수학(하)', standardUnitKey: 'H15-SB-04', standardUnit: '유리함수', subUnitKey: 'H15-SB-04-RATIONAL_GRAPH', subUnit: '유리함수의 그래프', content: '유리함수 $f(x)=§dfrac{8x-43}{2x-11}$에 대하여 $f(1)+f(2)+§cdots+f(m)<62$를 만족시키는 자연수 $m$의 최댓값은? [5.0점]', choices: ['13', '14', '15', '16', '17'], answer: '③', solution: '$f(x)=4+§dfrac{1}{2x-11}$이다. $m=15$일 때 합은 $60+§dfrac1{11}+§dfrac1{13}+§dfrac1{15}+§dfrac1{17}+§dfrac1{19}<62$이고, $m=16$일 때에는 여기에 $4+§dfrac1{21}$을 더하므로 $62$를 넘는다. 따라서 최댓값은 15이고 정답은 ③이다.' },
  15: { category: '도형의 방정식', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-11', standardUnit: '원의 방정식', subUnitKey: 'H15-SA-11-CIRCLE_EQUATION', subUnit: '원의 방정식', content: '두 원 $(x-3)^2+(y+3)^2=4$, $(x+1)^2+(y-5)^2=4$이 직선 $l$에 대하여 서로 대칭일 때, 직선 $l$의 방정식은? [4.9점]', choices: ['$x-y=0$', '$x-2y+1=0$', '$x-2y+2=0$', '$2x-y+1=0$', '$2x-y+2=0$'], answer: '②', solution: '두 원의 중심은 $(3,-3)$과 $(-1,5)$이다. 대칭축은 두 중심을 잇는 선분의 수직이등분선이다. 중점은 $(1,1)$이고 중심을 잇는 직선의 기울기는 $-2$이므로 대칭축의 기울기는 $§dfrac12$이다. 따라서 $y-1=§dfrac12(x-1)$, 즉 $x-2y+1=0$이고 정답은 ②이다.' },
  16: { category: '명제', standardCourse: '수학(하)', standardUnitKey: 'H15-SB-02', standardUnit: '명제와 진리집합', subUnitKey: 'H15-SB-02-IMPLICATION', subUnit: '명제의 참과 거짓', content: '세 조건 $p,q,r$가 다음과 같을 때, 다음 중 참인 명제는? $p$: 삼차방정식 $x^3-3x^2+2x=0$, $q$: 이차부등식 $x^2-2x-3>0$, $r$: 절댓값을 포함한 부등식 $|x|+|x-3|§le7$ [5점]', choices: ['$p§to q$', '$q§to r$', '$r§to§sim p$', '$§sim p§to q$', '$§sim r§to§sim p$'], answer: '⑤', solution: '$p$의 해는 $§{0,1,2§}$, $q$의 해는 $x<-1$ 또는 $x>3$, $r$의 해는 $-2§le x§le5$이다. $r$의 해집합은 $p$의 해집합을 포함하므로 $§sim r§to§sim p$가 참이다. 나머지 명제는 각각 반례를 가지므로 정답은 ⑤이다.' },
  17: { category: '집합', standardCourse: '수학(하)', standardUnitKey: 'H15-SB-01', standardUnit: '집합의 연산', subUnitKey: 'H15-SB-01-SET_CARDINALITY', subUnit: '집합의 원소의 개수', content: '서로 다른 세 자연수를 원소로 갖는 집합 $A$에 대하여 집합 $B=§{x+y§mid x,y§in A§}$라 하자. $B$의 원소의 최솟값은 8, 최댓값은 24이고 $n(B)=5$일 때, 집합 $B-A$의 모든 원소의 합은? [5점]', choices: ['44', '48', '52', '56', '60'], answer: '⑤', solution: 'A의 세 원소를 $4,b,12$라 두면 $2§times4=8$, $2§times12=24$이므로 중간 원소는 $b$이다. $n(B)=5$가 되려면 $b=8$이고, $B=§{8,12,16,20,24§}$이다. 따라서 $B-A=§{16,20,24§}$의 원소의 합은 $60$이므로 정답은 ⑤이다.' },
  18: { category: '도형의 방정식', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-11', standardUnit: '원의 방정식', subUnitKey: 'H15-SA-11-CIRCLE_EQUATION', subUnit: '원의 방정식', content: '원 $x^2+y^2=36$과 합동인 원 모양의 종이를 좌표평면 위에 이 원과 겹쳐 놓았다. 그림과 같이 이 원 위의 두 점 $P,Q$를 지나는 직선을 접는 선으로 하여 원 모양의 종이를 접었더니 접힌 부분이 점 $(2,0)$에서 $x$축에 접하였다. 직선 $PQ$의 방정식을 $x+ay+b=0$이라 하고, 선분 $PQ$의 길이를 $c$라 할 때, $a+b+c^2$의 값은? (단, $a,b$는 상수) [5.1점]', choices: ['90', '91', '92', '93', '94'], answer: '②', image: 'assets/images/23_부영여고_2학기_중간_고1_기출/q18.png', visualAsset: 'assets/images/23_부영여고_2학기_중간_고1_기출/q18.png', hasVisualAsset: true, visualAssetType: 'diagram', visualAssetBBoxOnPage: { x1: 900, y1: 570, x2: 1700, y2: 1160 }, visualAssetStatus: 'source_visual_asset', solution: '접힌 원은 원래 원의 중심 $(0,0)$을 직선 $PQ$에 대하여 대칭이동한 원이다. 접힌 원이 $(2,0)$에서 $x$축에 접하므로 대칭된 중심은 $(2,-6)$이다. 따라서 $PQ$는 $(0,0)$과 $(2,-6)$을 잇는 선분의 수직이등분선이다. 중점은 $(1,-3)$이고, 수직이등분선은 $x-3y-10=0$이다. 원점에서 이 직선까지의 거리는 $§dfrac{10}{§sqrt{10}}=§sqrt{10}$이므로 $c^2=4(36-10)=104$이다. 따라서 $a=-3,b=-10$에서 $a+b+c^2=91$이고 정답은 ②이다.' },
  '서술형1': { category: '도형의 방정식', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-11', standardUnit: '원의 방정식', subUnitKey: 'H15-SA-11-CIRCLE_EQUATION', subUnit: '원의 방정식', content: '서술형1. 세 직선 $y=x$, $x+2y=0$, $y=2$로 만들어지는 삼각형의 외접원의 중심과 반지름을 각각 구하고, 그 과정을 서술하시오. [6점, 부분점수 있음]', answer: '중심=(-1,3), 반지름=§sqrt{10}', solution: '세 직선의 교점은 $(0,0),(2,2),(-4,2)$이다. 세 점을 지나는 원의 수직이등분선을 구하면 중심은 $(-1,3)$이고, 반지름은 $§sqrt{10}$이다.' },
  '서술형2': { category: '여러 가지 부등식', standardCourse: '수학(하)', standardUnitKey: 'H15-SA-08', standardUnit: '부등식의 풀이', subUnitKey: 'H15-SA-08-INEQUALITY_BASIC', subUnit: '부등식의 풀이', content: '서술형2. $a,b>0$일 때, 부등식 $§dfrac{a+b}{2}§ge§sqrt{ab}§ge§dfrac{2ab}{a+b}$가 성립함을 증명하시오. [7점, 부분점수 있음]', answer: '증명', solution: '첫째 부등식은 $(§sqrt a-§sqrt b)^2§ge0$에서 얻는다. 둘째 부등식은 $a+b>0$이므로 $(§sqrt a-§sqrt b)^2§ge0$을 정리하여 얻는다.' },
  '서술형3': { category: '도형의 방정식', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-11', standardUnit: '원의 방정식', subUnitKey: 'H15-SA-11-CIRCLE_EQUATION', subUnit: '원의 방정식', content: '서술형3. 그림과 같이 좌표평면 위에 원 $C:(x-1)^2+(y-4)^2=1$과 직선 $y=x$가 있다. 점 $Q$는 원 $C$ 위에 있고, 점 $A$는 $y$축 위에 있으며 점 $P$는 직선 $y=x$ 위에 있다. 점 $B(-2,1)$에 대하여 $§overline{QA}+§overline{AP}+§overline{PB}$의 최솟값을 $n§sqrt{10}-m$라 할 때, $n+m$의 값을 구하고 그 과정을 서술하시오. (단, $n과 m$은 자연수이다.) [7점, 부분점수 있음]', answer: '3', solution: '반사와 최단거리 원리를 적용하면 세 선분의 합의 최솟값은 $2§sqrt{10}-1$이다. 따라서 $n=2,m=1$이고 $n+m=3$이다.' }
};

const pageFor = (sourceNo) => {
  const n = Number(sourceNo);
  if (n >= 1 && n <= 4) return 1;
  if (n >= 5 && n <= 8) return 2;
  if (n >= 9 && n <= 12) return 3;
  if (n >= 13 && n <= 16) return 4;
  if (n >= 17 && n <= 18) return 5;
  return 6;
};

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function bankSpan(source) {
  const marker = source.indexOf('window.questionBank');
  const open = source.indexOf('[', marker);
  let depth = 0;
  let quote = null;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === BS) i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '[') depth += 1;
    else if (ch === ']' && --depth === 0) return { open, close: i };
  }
  throw new Error('questionBank not found');
}

function load(source) {
  const context = { window: {} };
  vm.runInNewContext(source, context, { timeout: 5000 });
  return context.window.questionBank;
}

function save(source, bank) {
  const { open, close } = bankSpan(source);
  return source.slice(0, open) + '[\n' + bank.map((q) => JSON.stringify(q)).join(',\n') + '\n]' + source.slice(close + 1);
}

function applyFile(file) {
  const source = fs.readFileSync(file, 'utf8');
  let bank;
  try { bank = load(source); } catch { return false; }
  const bySource = new Map(bank.map((q) => [String(q.sourceQuestionNo), q]));
  const template = bank[0] || {};
  for (const [sourceNo, patch0] of Object.entries(common)) {
    const patch = Object.fromEntries(Object.entries(patch0).map(([k, v]) => [k, typeof v === 'string' ? tex(v) : v]));
    let q = bySource.get(String(sourceNo));
    if (!q) {
      q = JSON.parse(JSON.stringify(template));
      q.sourceQuestionNo = String(sourceNo);
      q.displayNo = String(sourceNo);
      q.id = 0;
      bank.push(q);
      bySource.set(String(sourceNo), q);
    }
    Object.assign(q, patch);
    const pageNo = pageFor(sourceNo);
    q.pageNo = pageNo;
    q.fullPageImageRelPath = `pages/page_p${String(pageNo).padStart(3, '0')}.png`;
    if (typeof q.fullPageImagePath === 'string') q.fullPageImagePath = q.fullPageImagePath.replace(/page_p\d+\.png$/, `page_p${String(pageNo).padStart(3, '0')}.png`);
    q.reviewStatus = 'source_checked';
    q.reviewReason = [];
    q.answerStatus = 'answer_filled_A_restoration';
    q.solutionStatus = 'solution_filled_A_restoration';
    q.extractionStatus = 'vision_extracted';
    q.contentSource = 'vision_page';
    q.choicesSource = q.questionType === '서술형' ? 'vision_required' : 'vision_page';
    q.visualAssetConfidence = q.hasVisualAsset ? 0.95 : 0;
  }
  bank.sort((a, b) => {
    const aa = String(a.sourceQuestionNo);
    const bb = String(b.sourceQuestionNo);
    const num = (s) => /^\d+$/.test(s) ? Number(s) : 1000 + Number(s.replace('서술형', ''));
    return num(aa) - num(bb);
  });
  bank.forEach((q, index) => { q.id = index + 1; q.displayNo = String(q.sourceQuestionNo); });
  fs.writeFileSync(file, save(source, bank), 'utf8');
  return true;
}

const files = walk(workRoot).filter((file) => file.includes(`${path.sep}fresh-extract-final${path.sep}`) || file.includes(`${path.sep}candidate${path.sep}`));
const changed = files.filter(applyFile);
console.log(JSON.stringify({ files: files.length, changedFiles: changed.length, sourceQuestionCount: Object.keys(common).length }, null, 2));
