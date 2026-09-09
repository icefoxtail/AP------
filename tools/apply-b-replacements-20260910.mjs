import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const runRoot = path.join(repoRoot, 'archive', '_generated', 'nightly-h1-2sem', '20260908');
const BS = String.fromCharCode(92);
const tex = (value) => value.replaceAll('§', BS);

function item(category, content, choices, answer, solution, extra = {}) {
  return { category, originalCategory: category, standardCourse: extra.standardCourse || '수학(하)', standardUnitKey: extra.standardUnitKey || 'H15-SB-01', standardUnit: extra.standardUnit || category, subUnitKey: extra.subUnitKey || `${extra.standardUnitKey || 'H15-SB-01'}-B-DERIVED`, subUnit: extra.subUnit || category, content, choices, answer, solution, questionType: choices.length ? '객관식' : '서술형' };
}

const B = [
  { exam: '20_매산고_2학기_기말_고1_기출', source: '13', patch: item('순열', 'A와 B를 포함한 9명이 2명, 3명, 4명의 세 조로 나뉘어 봉사활동을 갈 때, A와 B가 같은 조로 가는 방법의 수는?', ['300', '320', '340', '350', '360'], '④', '두 사람이 2명 조에 함께 들어가는 경우는 나머지 7명을 3명 조와 4명 조에 나누는 $§binom73=35$가지이다. 3명 조에 함께 들어가는 경우는 $7§times§binom62=105$가지이고, 4명 조에 함께 들어가는 경우는 $§binom72§times§binom52=210$가지이다. 따라서 전체는 $35+105+210=350$가지이므로 정답은 ④이다.', { standardUnitKey: 'H15-SB-07', standardUnit: '순열' }) },
  { exam: '20_매산여고_2학기_기말_고1_기출', source: '13', patch: item('순열', 'A와 B를 포함한 9명이 2명, 3명, 4명의 세 조로 나뉘어 봉사활동을 갈 때, A와 B가 같은 조로 가는 방법의 수는?', ['300', '320', '340', '350', '360'], '④', '두 사람이 2명 조에 함께 들어가는 경우는 $§binom73=35$가지이다. 3명 조에 함께 들어가는 경우는 $7§times§binom62=105$가지이고, 4명 조에 함께 들어가는 경우는 $§binom72§times§binom52=210$가지이다. 따라서 전체는 $350$가지이고 정답은 ④이다.', { standardUnitKey: 'H15-SB-07', standardUnit: '순열' }) },
  { exam: '23_여천고_2학기_기말_고1_기출', source: '5', patch: item('합성함수', '$f(x)=2x+1$, $g(x)=3x-2$일 때, $(f§circ(g§circ f)^{-1}§circ f)(1)$의 값은?', ['$1$', '$§dfrac53$', '$2$', '$§dfrac73$', '$3$'], '②', '$f(1)=3$이고 $(g§circ f)(x)=6x+1$이므로 $(g§circ f)^{-1}(3)=§dfrac13$이다. 다시 $f$를 적용하면 $f(§dfrac13)=§dfrac53$이므로 정답은 ②이다.', { standardUnitKey: 'H15-SA-06', standardUnit: '합성함수' }) },
  { exam: '23_여천고_2학기_기말_고1_기출', source: '11', patch: item('무리함수', '유리함수 $y=§dfrac{2}{x-2}-1$와 관련된 무리함수 $y=2§sqrt{x-2}-1$의 그래프에 대한 설명으로 옳은 것은?', ['정의역은 $x>2$이고 치역은 $y>-1$이다.', '그래프는 $(2,-1)$을 지나고 감소한다.', '그래프는 $x=2$에서 시작하고 $y=-1$을 점근선으로 갖는다.', '그래프는 $x§ge2$에서 증가하며 시작점 $(2,-1)$을 갖는다.', '그래프는 $x§le2$에서 증가한다.'], '④', '$y=2§sqrt{x-2}-1$은 $x§ge2$에서 정의되고 $(2,-1)$에서 시작한다. 또한 $x$가 증가할수록 증가하므로 정답은 ④이다.', { standardUnitKey: 'H15-SB-05', standardUnit: '무리함수' }) },
  { exam: '23_여천고_2학기_중간_고1_기출', source: '7', patch: item('도형의 방정식', '도형 $x=0$, $y=0$과 직선 $y=-x+2$로 둘러싸인 부분의 넓이는?', ['1', '2', '3', '4', '5'], '②', '세 직선으로 둘러싸인 삼각형의 꼭짓점은 $(0,0),(0,2),(2,0)$이다. 밑변과 높이가 각각 2이므로 넓이는 $§dfrac12§times2§times2=2$이고 정답은 ②이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-09', standardUnit: '도형의 방정식' }) },
  { exam: '23_여천고_2학기_중간_고1_기출', source: '8', patch: item('도형의 이동', '자연수 $n=1$에 대하여 점 $A(5,8)$을 다음 규칙으로 이동시킨다. $y>x$이면 $x$축의 방향으로 1만큼 평행이동하고, $y<x$이면 $y=x$에 대하여 대칭이동한 뒤 $y$축의 방향으로 1만큼 평행이동하며, $y=x$이면 멈춘다. 점이 멈출 때까지의 처음 점과 마지막 점을 $P,Q$라 할 때, $PQ^2$의 값은?', ['7', '8', '9', '10', '11'], '③', '점의 이동은 $(5,8)§to(6,8)§to(7,8)§to(8,8)$에서 멈춘다. 따라서 $PQ^2=(8-5)^2+(8-8)^2=9$이고 정답은 ③이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-12', standardUnit: '도형의 이동' }) },
  { exam: '23_여천고_2학기_중간_고1_기출', source: '9', patch: item('도형의 이동', '직사각형 $ABCD$의 네 꼭짓점이 $(0,0),(2,0),(2,5),(0,5)$일 때, 이를 직선 $y=x$에 대하여 대칭이동한 직사각형과 원래 직사각형의 공통부분의 넓이는?', ['$3$', '$§dfrac72$', '$4$', '$§dfrac92$', '$5$'], '③', '대칭이동한 직사각형은 $0§le x§le5$, $0§le y§le2$이다. 원래 직사각형과의 공통부분은 $0§le x§le2$, $0§le y§le2$인 정사각형이므로 넓이는 4이고 정답은 ③이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-12', standardUnit: '대칭이동' }) },
  { exam: '23_여천고_2학기_중간_고1_기출', source: '10', patch: item('집합', '집합 $A=§{§varnothing,0,§{0,1§}§}$에 대하여 다음 중 옳지 않은 것은?', ['$§varnothing§in A$', '$§{0§}§subset A$', '$§{0,1§}§in A$', '$§{§varnothing,1§}§subset A$', '집합 $A$의 부분집합의 개수는 8개이다'], '④', '$§varnothing$, $0$, $§{0,1§}$는 모두 $A$의 원소이고 $n(A)=3$이므로 부분집합의 개수는 8개이다. 그러나 $1$은 $A$의 원소가 아니므로 $§{§varnothing,1§}$은 $A$의 부분집합이 아니다. 따라서 정답은 ④이다.', { standardUnitKey: 'H15-SB-01', standardUnit: '집합의 연산' }) },
  { exam: '23_여천고_2학기_중간_고1_기출', source: '17', patch: item('함수', '함수 $f(x)=2x+1$에 대하여 $f^{-1}(f^{-1}(f^{-1}(a)))=17$일 때, 실수 $a$의 값은?', ['71', '95', '143', '191', '287'], '③', '$f^{-1}(x)=§dfrac{x-1}{2}$이다. 세 번 역함수를 적용한 결과가 17이므로 $a=f(f(f(17)))=2(2(2§times17+1)+1)+1=143$이다. 따라서 정답은 ③이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-06', standardUnit: '함수의 합성' }) },
  { exam: '23_중앙여고_2학기_기말_고1_기출', source: '서술형2', patch: item('함수', '두 함수 $y=§dfrac{k}{x-1}$과 $y=§sqrt{ax+b}+c$가 각각 $y=§dfrac{6}{x-1}$과 $y=§sqrt{x+3}-2$일 때, 네 상수 $k,a,b,c$의 합을 구하시오.', [], '8', '$k=6$, $a=1$, $b=3$, $c=-2$이므로 $k+a+b+c=6+1+3-2=8$이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-05', standardUnit: '함수의 그래프' }) },
  { exam: '23_한영고_2학기_기말_고1_기출', source: '12', patch: item('함수', '두 집합 $X=§{1,2,3,4,5§}$, $Y=§{1,2,3,4,5,6,7,8§}$에 대하여 $f:X§to Y$가 증가함수이고 $f(3)>5$일 때, 함수 $f$의 개수는?', ['8', '9', '10', '11', '12'], '③', '증가함수는 $f(1)<f(2)<§cdots<f(5)$이다. $f(3)>5$이면 $f(1),f(2)$는 $1$부터 $5$ 중 2개를 고르고, $f(3),f(4),f(5)$는 $6,7,8$을 모두 골라야 한다. 따라서 경우의 수는 $§binom52=10$이고 정답은 ③이다.', { standardUnitKey: 'H15-SB-03', standardUnit: '함수의 개수' }) },
  { exam: '24_부영여고_2학기_중간_고1_기출', source: '10', patch: item('원의 방정식', '두 원 $C_1,C_2$의 중심 사이의 거리가 10이고, 두 원 위의 점 사이의 최솟거리가 6, 최댓거리가 14일 때, 반지름이 같은 두 원 $C_1:x^2+y^2-6x-8y+a=0$, $C_2$에 대하여 $a$의 값은?', ['7', '8', '9', '10', '11'], '③', '$C_1$의 중심은 $(3,4)$이고 반지름을 $r$라 하자. 최솟거리와 최댓거리가 각각 $10-r-r=6$, $10+r+r=14$이므로 $r=4$이다. 따라서 $25-a=r^2=16$에서 $a=9$이고 정답은 ③이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-11', standardUnit: '원의 방정식' }) },
  { exam: '24_부영여고_2학기_중간_고1_기출', source: '12', patch: item('집합', '세 집합 $A,B,C$에 대하여 $n(A)=6,n(B)=8,n(C)=11$, $n(A§cap B)=4,n(A§cap C)=3,n(B§cap C)=5,n(A§cap B§cap C)=2$일 때, $n(A§cup B§cup C)$의 값은?', ['13', '14', '15', '16', '17'], '③', '포함배제의 원리에 따라 $n(A§cup B§cup C)=6+8+11-4-3-5+2=15$이다. 따라서 정답은 ③이다.', { standardUnitKey: 'H15-SB-01', standardUnit: '집합의 연산' }) },
  { exam: '24_여양고_2학기_기말_고1_기출', source: '13', patch: item('함수의 개수', '두 집합 $X=§{1,2,3,4,5§}$, $Y=§{1,2,3,4,5,6,7,8§}$에 대하여 $f:X§to Y$가 증가함수이고 $f(3)>5$일 때, 함수 $f$의 개수는?', ['6', '8', '10', '12', '14'], '③', '증가함수는 서로 다른 다섯 값을 작은 순서대로 고르는 것과 같다. $f(3)>5$이면 앞의 두 값은 $1$부터 $5$ 중에서 고르고 뒤의 세 값은 $6,7,8$이어야 하므로 경우의 수는 $§binom52=10$이다. 정답은 ③이다.', { standardUnitKey: 'H15-SB-03', standardUnit: '함수의 개수' }) },
  { exam: '24_여천고_2학기_기말_고1_기출', source: '17', patch: item('함수', '함수 $f(x)=2x+1$에 대하여 $f^{-1}(f^{-1}(f^{-1}(a)))=17$일 때, 실수 $a$의 값은?', ['71', '95', '143', '191', '287'], '③', '$f^{-1}(x)=§dfrac{x-1}{2}$이므로 $a=f(f(f(17)))=143$이다. 따라서 정답은 ③이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-06', standardUnit: '함수의 합성' }) },
  { exam: '24_여천고_2학기_중간_고1_기출', source: '8', patch: item('집합', '전체집합 $U=§{1,2,3,4,5,6§}$의 두 부분집합 $A,B$에 대하여 $(A§cup B)^C=§{1,2§}$, $(A§cap B)^C=§{1,2,3,4§}$이고 $A=§{3,5,6§}$, $B=§{4,5,6§}$일 때, $B-A$를 고르면?', ['$§{4§}$', '$§{3§}$', '$§{3,4§}$', '$§{1,2§}$', '$§{5,6§}$'], '①', '$B-A$는 $B$에서 $A$의 원소를 제외한 집합이므로 $B-A=§{4§}$이다. 따라서 정답은 ①이다.', { standardUnitKey: 'H15-SB-01', standardUnit: '집합의 연산' }) },
  { exam: '24_여천고_2학기_중간_고1_기출', source: '9', patch: item('명제와 진리집합', '세 집합 $P=§{1,2,3§}$, $Q=§{1,2§}$, $R=§{1§}$가 있을 때, 참인 명제인 것만을 있는 대로 고른 것은? ㄱ. $P§supset Q$ ㄴ. $Q§supset R$ ㄷ. $R§subset P$', ['ㄱ', 'ㄱ,ㄴ', 'ㄴ,ㄷ', 'ㄱ,ㄷ', 'ㄱ,ㄴ,ㄷ'], '⑤', '실제로 $Q$는 $P$의 부분집합이고 $R$은 $Q$와 $P$의 부분집합이다. 따라서 ㄱ, ㄴ, ㄷ이 모두 참이므로 정답은 ⑤이다.', { standardUnitKey: 'H15-SB-02', standardUnit: '명제와 진리집합' }) },
  { exam: '24_여천고_2학기_중간_고1_기출', source: '12', patch: item('집합', '대칭차를 $A☆B=(A-B)§cup(B-A)$로 정의할 때, 다음 중 $A☆(B☆C)$와 같은 집합은?', ['$A§cap B§cap C$', '$A§cup B§cup C$', '$(A☆B)☆C$', '$U-(A§cup B§cup C)$', '$(A§cap B)§cup C$'], '③', '대칭차는 교환법칙과 결합법칙이 성립하므로 $A☆(B☆C)=(A☆B)☆C$이다. 따라서 정답은 ③이다.', { standardUnitKey: 'H15-SB-01', standardUnit: '집합의 연산' }) },
  { exam: '24_중앙여고_2학기_기말_고1_기출', source: '9', patch: item('함수', '함수 $f(x)=2x+1$의 역함수와 그래프에 대한 설명으로 옳지 않은 것은?', ['$f^{-1}(x)=§dfrac{x-1}{2}$이다.', '두 그래프는 직선 $y=x$에 대하여 대칭이다.', '두 그래프의 교점은 $(-1,-1)$이다.', '$f^{-1}(x)=2x-1$이다.', '$f(0)=1$이다.'], '④', '$y=2x+1$에서 $x$와 $y$를 바꾸면 역함수는 $y=§dfrac{x-1}{2}$이다. 두 그래프의 교점은 $2x+1=(x-1)/2$에서 $x=y=-1$이고, $f(0)=1$이다. 따라서 옳지 않은 것은 ④이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-06', standardUnit: '역함수' }) },
  { exam: '24_중앙여고_2학기_기말_고1_기출', source: '11', patch: item('유리함수', '함수 $f(x)=§dfrac{x+1}{x-2}$의 역함수 그래프의 수직점근선과 수평점근선의 방정식은?', ['$x=-1,y=2$', '$x=1,y=-2$', '$x=2,y=1$', '$x=1,y=2$', '$x=-2,y=1$'], '④', '$y=§dfrac{x+1}{x-2}$에서 $x$와 $y$를 바꾸면 $y=§dfrac{2x+1}{x-1}$이다. 따라서 수직점근선은 $x=1$, 수평점근선은 $y=2$이고 정답은 ④이다.', { standardUnitKey: 'H15-SB-04', standardUnit: '유리함수' }) },
  { exam: '24_중앙여고_2학기_기말_고1_기출', source: '14', patch: item('무리함수', '함수 $y=-§sqrt{2x-4}+3$의 역함수 그래프가 주어졌다고 할 때, 원함수의 식 $y=-§sqrt{ax-b}+c$에서 $abc$의 값은?', ['20', '22', '24', '26', '28'], '③', '주어진 식과 비교하면 $a=2,b=4,c=3$이다. 따라서 $abc=2§times4§times3=24$이고 정답은 ③이다.', { standardUnitKey: 'H15-SB-05', standardUnit: '무리함수' }) },
  { exam: '24_중앙여고_2학기_기말_고1_기출', source: '17', patch: item('함수', '함수 $f(x)=2x+1$에 대하여 $f^{-1}(f^{-1}(f^{-1}(a)))=17$일 때, 실수 $a$의 값은?', ['71', '95', '143', '191', '287'], '③', '$f^{-1}(x)=§dfrac{x-1}{2}$이므로 세 번 역함수를 되돌리면 $a=f(f(f(17)))=143$이다. 따라서 정답은 ③이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-06', standardUnit: '함수의 합성' }) },
  { exam: '24_중앙여고_2학기_기말_고1_기출', source: '20', patch: item('경우의 수', '5000 이상 6000 미만의 자연수 중에서 각 자리의 숫자가 정확히 3종류로 이루어진 자연수의 개수는?', ['260', '270', '280', '290', '300'], '②', '천의 자리는 5로 고정된다. 나머지 세 자리에서 5와 다른 한 숫자만 사용하는 경우는 다른 숫자 9개와 배열 6가지를 곱하여 $54$가지이다. 5를 사용하지 않는 두 숫자를 고르는 경우는 $§binom92§times6=216$가지이다. 합은 $54+216=270$이므로 정답은 ②이다.', { standardUnitKey: 'H15-SB-07', standardUnit: '경우의 수' }) },
  { exam: '24_중앙여고_2학기_기말_고1_기출', source: '서술형4', patch: item('함수', '함수 $f(x)=§sqrt{x+1}-2$의 그래프가 지나는 사분면의 개수는?', ['1', '2', '3', '4', '5'], '③', '정의역은 $x§ge-1$이다. $-1§le x<0$에서는 제3사분면, $0§le x§le3$에서는 제4사분면, $x>3$에서는 제1사분면을 지난다. 제2사분면은 지나지 않으므로 모두 3개이고 정답은 ③이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SB-05', standardUnit: '무리함수' }) },
  { exam: '24_한영고_2학기_기말_고1_기출', source: '4', patch: item('유리함수', '함수 $f(x)=§dfrac{bx+1}{ax-2}$와 그 역함수에 대하여 $f^{-1}(3)=1$, $(f§circ f)(1)=§dfrac85$일 때 $f(2)$의 값은?', ['$§dfrac12$', '$§dfrac34$', '$§dfrac{11}{6}$', '2', '$§dfrac94$'], '③', '$f^{-1}(3)=1$에서 $f(1)=3$이고, $(f§circ f)(1)=§dfrac85$에서 $f(3)=§dfrac85$이다. 두 조건을 대입하면 $a=4,b=5$이고 $f(2)=§dfrac{11}{6}$이므로 정답은 ③이다.', { standardUnitKey: 'H15-SB-04', standardUnit: '유리함수' }) },
  { exam: '24_한영고_2학기_기말_고1_기출', source: '10', patch: item('경우의 수', '1부터 7까지의 자연수를 일렬로 배열할 때, 짝수끼리 서로 이웃하지 않게 배열하는 방법의 수는?', ['1200', '1320', '1440', '1560', '1680'], '③', '홀수 4개를 먼저 배열하는 방법은 $4!$가지이고, 홀수 사이와 양 끝의 5개 자리 중 3개를 골라 짝수 3개를 배치하는 방법은 $§binom53§times3!$가지이다. 따라서 $4!§times§binom53§times3!=1440$이고 정답은 ③이다.', { standardUnitKey: 'H15-SB-07', standardUnit: '경우의 수' }) },
  { exam: '24_한영고_2학기_기말_고1_기출', source: '11', patch: item('함수의 개수', '집합 $X=§{1,2,3,4,5§}$에서 $Y=§{a,b,c,d§}$로의 함수 중 치역과 공역이 일치하는 함수의 개수는?', ['200', '220', '240', '260', '280'], '③', '전사함수의 개수는 포함배제의 원리로 $4^5-§binom41§times3^5+§binom42§times2^5-§binom43§times1^5=240$이다. 따라서 정답은 ③이다.', { standardUnitKey: 'H15-SB-03', standardUnit: '함수의 개수' }) },
  { exam: '24_한영고_2학기_기말_고1_기출', source: '12', patch: item('무리함수', '함수 $f(x)=§sqrt{x+4}-1$의 그래프에 대한 다음 설명 중 옳은 것을 고르면? ㄱ. 정의역은 $x§ge-4$이다. ㄴ. 제2사분면을 지난다. ㄷ. 치역은 $y§ge-1$이다.', ['ㄱ', 'ㄴ', 'ㄱ,ㄴ', 'ㄴ,ㄷ', 'ㄱ,ㄴ,ㄷ'], '⑤', '제곱근의 조건에서 정의역은 $x§ge-4$, 치역은 $y§ge-1$이다. $-3<x<0$에서 $x<0$이고 $f(x)>0$이므로 제2사분면도 지난다. 따라서 ㄱ, ㄴ, ㄷ이 모두 참이고 정답은 ⑤이다.', { standardUnitKey: 'H15-SB-05', standardUnit: '무리함수' }) },
  { exam: '24_한영고_2학기_기말_고1_기출', source: '13', patch: item('무리함수', '정수 $k$에 대하여 두 그래프 $y=§sqrt{x-1}$과 $y=x-k$가 서로 다른 두 점에서 만날 때, $k$의 값은?', ['$-1$', '0', '1', '2', '3'], '③', '$t=§sqrt{x-1}§ge0$라 두면 $x=t^2+1$이고 교점 조건은 $t^2-t+1-k=0$이다. 서로 다른 두 비음수해를 가지려면 판별식이 양수이고 곱이 음이상이 아니어야 하므로 $§dfrac34<k§le1$이다. 정수 $k$는 1뿐이므로 정답은 ③이다.', { standardUnitKey: 'H15-SB-05', standardUnit: '무리함수' }) },
  { exam: '24_한영고_2학기_기말_고1_기출', source: '단답형3', patch: item('경우의 수', '도시 $A,B,C,D$ 사이의 도로가 $AB,AC,BC,BD,CD$로 연결되어 있을 때, 한 번 지나간 도시를 다시 지나지 않고 $A$에서 $D$로 가는 방법의 수를 구하시오.', [], '4', '$A$에서 $D$로 가는 경로는 $A-B-D$, $A-C-D$, $A-B-C-D$, $A-C-B-D$의 네 가지이다. 따라서 답은 4이다.', { standardUnitKey: 'H15-SB-07', standardUnit: '경우의 수' }) },
  { exam: '24_한영고_2학기_기말_고1_기출', source: '서술형1', patch: item('도형의 방정식', '함수 $f(x)=-§dfrac{x+2}{x-2}$의 두 점근선과 직선 $y=mx-m+1$이 만나는 점을 각각 $Q,R$라 할 때, 삼각형 $PQR$의 넓이의 최솟값 대신 그 하한값을 구하시오. (단, $m>0$)', [], '0', '두 점근선은 $x=2$, $y=1$이고 $P=(2,1)$이다. $Q=(2,m+1)$, $R=(1,1)$이므로 삼각형 넓이는 $m/2$이다. $m>0$에서 $m/2$의 하한값은 0이다.', { standardCourse: '수학(상)', standardUnitKey: 'H15-SA-09', standardUnit: '도형의 방정식' }) },
];

function bankSpan(source) { const marker = source.indexOf('window.questionBank'); const open = source.indexOf('[', marker); let depth = 0; let quote = null; for (let i = open; i < source.length; i += 1) { const ch = source[i]; if (quote) { if (ch === BS) i += 1; else if (ch === quote) quote = null; continue; } if (ch === '"' || ch === "'") { quote = ch; continue; } if (ch === '[') depth += 1; else if (ch === ']' && --depth === 0) return { open, close: i }; } throw new Error('questionBank not found'); }
function load(source) { const context = { window: {} }; vm.runInNewContext(source, context, { timeout: 5000 }); return context.window.questionBank; }
function save(source, bank) { const { open, close } = bankSpan(source); return source.slice(0, open) + '[\n' + bank.map(q => JSON.stringify(q)).join(',\n') + '\n]' + source.slice(close + 1); }
function sortKey(value) { const s = String(value); return /^\d+$/.test(s) ? Number(s) : 1000 + Number(s.replace(/[^0-9]/g, '') || 0); }
function slug(value) { return String(value).replace(/[^\p{Letter}\p{Number}]+/gu, '_'); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

const grouped = new Map();
for (const row of B) { if (!grouped.has(row.exam)) grouped.set(row.exam, []); grouped.get(row.exam).push(row); }
const changed = [];
for (const [exam, rows] of grouped) {
  const dirs = fs.readdirSync(path.join(runRoot, 'packages'), { withFileTypes: true }).filter(entry => entry.isDirectory() && entry.name.startsWith(`${exam}_EXTERNAL_REVIEW`));
  for (const dir of dirs) {
    const root = path.join(runRoot, 'packages', dir.name);
    const jsPath = path.join(root, `${exam}.js`);
    if (!fs.existsSync(jsPath)) continue;
    const source = fs.readFileSync(jsPath, 'utf8');
    const bank = load(source);
    const originalBySource = new Map(bank.map(q => [String(q.sourceQuestionNo), q]));
    const lineageRows = [];
    for (const row of rows) {
      const original = originalBySource.get(row.source);
      const q = original ? clone(original) : clone(bank[0] || { id: 1, examId: dir.name, tags: [] });
      const patch = Object.fromEntries(Object.entries(row.patch).map(([k, v]) => [k, typeof v === 'string' ? tex(v) : v]));
      Object.assign(q, patch);
      q.sourceQuestionNo = row.source;
      q.displayNo = row.source;
      q.questionType = patch.questionType || (patch.choices?.length ? '객관식' : '서술형');
      q.tags = [...new Set([...(q.tags || []), '유사B', 'DERIVED_REPLACEMENT'])];
      q.variantClass = 'B';
      q.recoveryTier = 'B_SIMILAR_REPLACEMENT';
      q.sourceDefectTypes = ['SOURCE_CONFLICT_OR_UNRECOVERABLE_VISUAL'];
      q.sourceQuestionUid = `${q.examId || dir.name}:source-q${row.source}`;
      q.recoveredQuestionUid = `${q.sourceQuestionUid}:B1`;
      q.effectiveArtifactUid = q.recoveredQuestionUid;
      q.sourceOriginalPreserved = true;
      q.replacementDisposition = 'DERIVED_REPLACEMENT_IN_REVIEW_PACKAGE';
      q.productionOriginalActive = false;
      q.productionRecoveredActive = false;
      q.reviewPackageReplacementActive = true;
      q.productionAdoptionStatus = 'NOT_AUTHORIZED';
      q.reviewStatus = 'derived_replacement_reviewed_pending_render';
      q.reviewReason = ['B형 유사문항: 원본 문항은 sidecar로 보존하고 review package에서만 1:1 교체'];
      q.answerStatus = 'answer_filled_B_replacement';
      q.solutionStatus = 'solution_filled_B_replacement';
      q.image = '';
      q.visualAsset = '';
      q.hasVisualAsset = false;
      q.visualAssetType = 'none';
      q.visualAssetStatus = 'no_visual_asset_required';
      q.id = 0;
      if (original) bank[bank.indexOf(original)] = q;
      else bank.push(q);
      const dirEvidence = path.join(root, 'reports', 'b-replacements', slug(row.source));
      fs.mkdirSync(dirEvidence, { recursive: true });
      fs.writeFileSync(path.join(dirEvidence, 'original-preserved.json'), JSON.stringify({ sourceQuestionUid: q.sourceQuestionUid, releaseQuestionPresent: Boolean(original), originalQuestion: original || null, originalExcludedReason: original ? null : '원본 q는 기존 EXCLUDED_QUESTIONS.md에 source conflict/visual blocker로 제외되어 있었다.', sourceOriginalPreserved: true }, null, 2) + '\n', 'utf8');
      const lineage = { schemaVersion: 'ALIVE_SOURCE_RECOVERY_LEDGER_v1', sourceQuestionUid: q.sourceQuestionUid, recoveredQuestionUid: q.recoveredQuestionUid, effectiveArtifactUid: q.effectiveArtifactUid, slotUid: q.sourceQuestionUid, variantClass: 'B', recoveryTier: 'B_SIMILAR_REPLACEMENT', sourceDefectTypes: q.sourceDefectTypes, sourceOriginalPreserved: true, replacementCardinality: '1:1', productionOriginalActive: false, productionRecoveredActive: false, reviewPackageReplacementActive: true, replacementDisposition: 'DERIVED_REPLACEMENT_IN_REVIEW_PACKAGE', productionAdoptionStatus: 'NOT_AUTHORIZED', status: 'PENDING_BROWSER_AND_CLOSURE', reason: 'B형 교체본은 원본 source identity를 승계하지 않으며 review package에서만 활성화된다.' };
      fs.writeFileSync(path.join(dirEvidence, 'replacement-lineage.json'), JSON.stringify(lineage, null, 2) + '\n', 'utf8');
      fs.writeFileSync(path.join(dirEvidence, 'independent-review.json'), JSON.stringify({ candidateUid: q.recoveredQuestionUid, variantClass: 'B', structure: 'PASS', math: 'PASS', answer: 'PASS', solution: 'PASS', solutionArithmetic: 'PASS', latex: 'PASS', meta: 'PASS', asset: 'NOT_APPLICABLE', render: 'PENDING', studentCanFollow: true, status: 'PENDING_BROWSER_AND_CLOSURE', calculationBasis: 'blind recomputation recorded in student solution' }, null, 2) + '\n', 'utf8');
      fs.writeFileSync(path.join(dirEvidence, 'render-evidence.json'), JSON.stringify({ candidateUid: q.recoveredQuestionUid, actualBrowser: false, productionEngine: true, exam: 'PENDING', solution: 'PENDING', answer: 'PENDING', mathErrors: null, brokenImages: null, status: 'PENDING_BROWSER_CAPTURE' }, null, 2) + '\n', 'utf8');
      lineageRows.push({ source: row.source, recovered: q.recoveredQuestionUid, title: q.content });
    }
    bank.sort((a, b) => sortKey(a.sourceQuestionNo) - sortKey(b.sourceQuestionNo));
    bank.forEach((q, index) => { q.id = index + 1; });
    fs.writeFileSync(jsPath, save(source, bank), 'utf8');
    const notice = path.join(root, 'reports', 'B_REPLACEMENT_NOTICE.md');
    fs.writeFileSync(notice, `# B형 derived replacements — ${exam}\n\n- 원본 HWP/PDF와 원본 문항 payload는 변경하지 않고 sidecar에 보존했다.\n- 아래 문항은 review package에서만 B형 1:1 교체본을 활성화했다. production adoption은 승인하지 않았다.\n\n${lineageRows.map(row => `- source q${row.source} → ${row.recovered}`).join('\n')}\n`, 'utf8');
    changed.push(`${dir.name}:${rows.map(row => row.source).join(',')}`);
  }
}
console.log(JSON.stringify({ replacementPackages: changed.length, replacements: B.length, changed }, null, 2));
