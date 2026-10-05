import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING_ARCHIVE = path.join(REPORTS, 'staging', 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));

const sol = (raw) => String.raw({ raw: [raw] }).replaceAll('\\ne', '__NE_TOKEN__').replaceAll('\\n', '\n').replaceAll('__NE_TOKEN__', '\\ne').replaceAll(',quad', ',\\quad');
const repairs = new Map([
  ['original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js_4', sol('무게중심의 좌표는 세 꼭짓점의 각 좌표를 더한 뒤 3으로 나눈 값이다.\n\n따라서\n$G=\\left(\\dfrac{5+2+(-1)}{3},\\dfrac{2+4+(-3)}{3}\\right)=(2,1)$이다.\n\n$G=(a,b)$이므로 $a=2$, $b=1$이고,\n$a+b=2+1=3$이다.\n\n따라서 정답은 ③이다.')],
  ['original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js_3', sol('기울기가 $1$이고 점 $(1,3)$을 지나는 직선의 방정식을 점-기울기형으로 쓰면\n$y-3=1(x-1)$이다.\n\n이를 정리하면\n$y=x+2$이므로 $m=1$, $n=2$이다.\n\n따라서\n$m+n=1+2=3$이므로 정답은 ③이다.')],
  ['original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js_5', sol('주어진 직선 $y=2x+4$의 기울기는 $2$이다. 평행한 두 직선은 기울기가 같으므로 구하는 직선의 기울기도 $2$이다.\n\n점 $(1,1)$을 지나므로\n$y-1=2(x-1)$이다.\n이를 정리하면 $y=2x-1$이다.\n\n따라서 정답은 ④이다.')],
  ['original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js_3', sol('선분 $AB$의 중점을 $(p,q)$라 하면, 중점 공식에 따라 각 좌표의 평균을 구한다.\n\n$p=\\dfrac{3+5}{2}=4$,\quad $q=\\dfrac{2+0}{2}=1$이다.\n\n따라서\n$p+q=4+1=5$이므로 정답은 ②이다.')],
  ['original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js_4', sol('직선 $y=4x+k$가 점 $(3,2)$를 지나므로 그 점의 좌표를 식에 대입하면 등식이 성립한다.\n\n$2=4\\cdot3+k=12+k$이므로\n$k=-10$이다.\n\n따라서 정답은 ④이다.')],
  ['original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js_6', sol('직선 $y=3x+5$의 기울기는 $3$이다. 이 직선에 수직인 직선의 기울기를 $m$이라 하면, 두 기울기의 곱이 $-1$이므로\n$3m=-1$이다.\n\n따라서 $m=-\\dfrac{1}{3}$이고, 정답은 ③이다.')],
  ['original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_3', sol('원 $(x-2)^2+(y+1)^2=9$의 중심은 $(2,-1)$이고 반지름은 $3$이다.\n$(m,n)$만큼 평행이동한 뒤의 중심은 $(2+m,-1+n)$이다.\n\n이 중심이 제2사분면에 있고 두 좌표축에 동시에 접하려면, 중심에서 각 좌표축까지의 거리가 반지름 $3$이어야 한다. 제2사분면에서는 $x$좌표가 $-3$, $y$좌표가 $3$이므로 옮긴 중심은 $(-3,3)$이다.\n\n따라서 $2+m=-3$에서 $m=-5$, $-1+n=3$에서 $n=4$이다.\n그러므로 $m+n=-5+4=-1$이므로 정답은 ①이다.')],
  ['original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_4', sol('원점에 대한 대칭이동은 각 점의 두 좌표의 부호를 모두 바꾸는 변환이다.\n\n따라서\n$(-3,-1)\\mapsto(3,1)$이다.\n\n그러므로 정답은 ⑤이다.')],
  ['original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_10', sol('직선 $(k+3)x-2y+8=0$을 $x$축 방향으로 $2$만큼 평행이동하면, 새 점 $(x,y)$에 대응하는 원래 점의 좌표는 $(x-2,y)$이다. 따라서\n$(k+3)(x-2)-2y+8=0$이고, 정리하면\n$k(x-2)+3x-2y+2=0$이다.\n\n이 식이 $k$의 값과 관계없이 성립하려면 $k$의 계수인 $x-2$가 $0$이어야 하므로 $x=2$이다. 이를 대입하면\n$3\\cdot2-2y+2=0$에서 $y=4$를 얻는다.\n\n따라서 구하는 점은 $(2,4)$이고 정답은 ②이다.')],
  ['original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_22', sol('주어진 원을 완전제곱식으로 정리하면\n$(x-4)^2+(y-3)^2=9$이다. 따라서 중심은 $(4,3)$, 반지름은 $3$이다.\n\n중심 $(4,3)$을 직선 $y=x$에 대칭이동하면 좌표가 서로 바뀌어 $(3,4)$가 된다. 직선 $y=-x$에 대칭이동하면 $(x,y)\\mapsto(-y,-x)$이므로 $(-3,-4)$가 된다. 대칭이동은 거리를 보존하므로 $P_1$은 중심 $(3,4)$, 반지름 $3$인 원 위에 있고, $Q_1$은 중심 $(-3,-4)$, 반지름 $3$인 원 위에 있다.\n\n두 중심 사이의 거리는\n$\\sqrt{(3-(-3))^2+(4-(-4))^2}=\\sqrt{36+64}=10$이다. 두 원 위의 두 점 사이의 최댓값은 중심 사이 거리와 두 반지름의 합이므로\n$10+3+3=16$이다.\n\n따라서 정답은 $16$이다.')],
  ['original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js_11', sol('평행이동 $(5,-3)$은 $x$좌표에 $5$, $y$좌표에 $-3$을 각각 더하는 변환이다.\n\n따라서\n$(-3,4)\\mapsto(-3+5,4-3)=(2,1)$이다.\n\n그러므로 정답은 ②이다.')],
  ['original/high/h1/2mid/23_팔마고_2학기_중간_고1_기출.js_3', sol('평행이동 $(x,y)\\mapsto(x+a,y+2)$에 의해 점 $(3,5)$가 $(2,b)$로 옮겨진다.\n\n$x$좌표를 비교하면 $3+a=2$이므로 $a=-1$이다.\n$y$좌표를 비교하면 $5+2=b$이므로 $b=7$이다.\n\n따라서\n$a+b=-1+7=6$이므로 정답은 ②이다.')],
  ['original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js_2', sol('직선 $y=2x-3$의 기울기는 $2$이다. 평행한 두 직선의 기울기는 같으므로 구하는 직선 $y=ax+b$에서 $a=2$이다.\n\n이 직선이 점 $(1,7)$을 지나므로\n$7=2\\cdot1+b$이고, $b=5$이다.\n\n따라서\n$a+b=2+5=7$이므로 정답은 ③이다.')],
  ['original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js_5', sol('$(x+5)^2+(y-5)^2=1$의 중심은 $(-5,5)$이고 반지름은 $1$이다.\n평행이동은 중심에도 같은 이동량을 더하고 반지름은 바꾸지 않으므로, $(3,-2)$만큼 옮긴 뒤의 중심은\n$(-5+3,5-2)=(-2,3)$이다.\n\n따라서 $a=-2$, $b=3$, $r=1$이고\n$a+b+r=-2+3+1=2$이다.\n\n그러므로 정답은 ②이다.')],
  ['original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js_6', sol('점 $(5,1)$을 $(a,-3)$만큼 평행이동하면\n$(5+a,1-3)=(5+a,-2)$가 된다.\n\n이를 직선 $y=x$에 대하여 대칭이동하면 두 좌표가 서로 바뀌므로\n$(-2,5+a)$이다. 이 점이 $(b,7)$과 같으므로\n$b=-2$, $5+a=7$에서 $a=2$이다.\n\n따라서\n$a+b=2+(-2)=0$이므로 정답은 ③이다.')],
  ['original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js_16', sol('두 점 $(4,-2)$, $(-1,3)$ 사이의 거리는 거리 공식에 따라\n$\\sqrt{(-1-4)^2+\{3-(-2)\}^2}=\\sqrt{25+25}=\\sqrt{50}=5\\sqrt2$이다.\n\n따라서 $a=5$, $b=2$이므로\n$a+b=7$이다.\n\n그러므로 구하는 값은 $7$이다.')],
  ['original/high/h1/2mid/25_순천고_2학기_중간_고1_기출.js_3', sol('평행사변형 $ABCD$에서는 대각선의 중점이 서로 같으므로\n$A+C=B+D$가 성립한다. 따라서\n$C=B+D-A$이다.\n\n주어진 좌표를 대입하면\n$C=(-1,-1)+(3,0)-(1,2)=(1,-3)$이다.\n실제로 $C$는 제4사분면에 있으므로 조건에도 맞는다.\n\n따라서 $a=1$, $b=-3$이고\n$ab=-3$이므로 정답은 ①이다.')],
  ['original/high/h1/2mid/25_순천고_2학기_중간_고1_기출.js_6', sol('두 직선은 $x$와 $y$의 계수 비가 같으므로 평행하다. 두 평행선\n$x+y+3=0$, $x+y+k=0$ 사이의 거리는\n$\\dfrac{|k-3|}{\\sqrt{1^2+1^2}}=\\dfrac{|k-3|}{\\sqrt2}$이다.\n\n거리가 $4\\sqrt2$이므로\n$\\dfrac{|k-3|}{\\sqrt2}=4\\sqrt2$에서 $|k-3|=8$이다.\n따라서 $k=11$ 또는 $k=-5$이고, 두 값의 합은 $6$이다.\n\n그러므로 정답은 ①이다.')],
  ['original/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2.js_9', sol('삼각형의 무게중심은 꼭짓점 $A$와 변 $BC$의 중점 $M$을 잇는 중선 위에서\n$AG:GM=2:1$을 만족한다. 좌표식으로 쓰면\n$G=\\dfrac{A+2M}{3}$이다.\n\n따라서\n$A=3G-2M=3(6,4)-2(3,7)=(18,12)-(6,14)=(12,-2)$이다.\n\n그러므로 점 $A$의 좌표는 $(12,-2)$이고 정답은 ①이다.')],
  ['original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js_2', sol('점 $(4,1)$을 점 $(-1,3)$으로 옮기는 평행이동의 이동벡터는\n$(-1-4,3-1)=(-5,2)$이다. 평행이동에서는 모든 점에 같은 벡터를 더하므로, 점 $(2,5)$의 이동 후 좌표는\n$(2,5)+(-5,2)=(-3,7)$이다.\n\n따라서 정답은 ②이다.')],
  ['original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_2', sol('원 $x^2+y^2=5$ 위의 점 $P(a,b)$에서의 접선은\n$ax+by=5$이다. 이 접선이 $x+2y=1$과 평행하려면 두 직선의 법선 방향이 같아야 하므로\n$(a,b)=\\lambda(1,2)$로 둘 수 있다.\n\n점 $P(a,b)$가 원 위에 있으므로\n$a^2+b^2=5$이고, $5\\lambda^2=5$에서 $\\lambda=1$ 또는 $-1$이다.\n따라서 $(a,b)=(1,2)$ 또는 $(-1,-2)$이고 두 경우 모두 $ab=2$이다.\n\n그러므로 정답은 ⑤이다.')],
  ['original/high/h1/2mid/23_팔마고_2학기_중간_고1_기출.js_7', sol('직선 $y=2x-1$을 $(2,a)$만큼 평행이동하면, 새 좌표 $(x,y)$에 대응하는 원래 좌표가 $(x-2,y-a)$이므로\n$y-a=2(x-2)-1$이다. 따라서 이동한 직선은\n$y=2x+a-5$이다.\n\n이 직선이 포물선 $y=-x^2+2x+3$에 접하므로 두 식을 연립한다.\n$2x+a-5=-x^2+2x+3$에서\n$x^2+a-8=0$을 얻는다.\n\n접할 때에는 교점의 $x$좌표가 중근이므로 판별식이 $0$이다.\n$0^2-4(a-8)=0$에서 $a=8$이다.\n\n따라서 정답은 ④이다.')],
  ['original/high/h1/2mid/23_팔마고_2학기_중간_고1_기출.js_13', sol('점 $A(0,4)$를 직선 $y=-2x-1$에 대하여 대칭이동한 점을 $A_1$라 하자. 직선 $y=-2x-1$의 기울기는 $-2$이므로 $A$에서 이 직선에 내린 수선의 기울기는 $\\dfrac12$이다.\n\n수선의 방정식은 $y=\\dfrac12x+4$이고, 주어진 직선과의 교점은\n$\\dfrac12x+4=-2x-1$에서 $H=(-2,3)$이다. $H$는 $AA_1$의 중점이므로\n$A_1=2H-A=(-4,2)$이다.\n\n$P$가 대칭축 위에 있으므로 $AP=A_1P$이다. 따라서\n$AP+BP=A_1P+BP\\ge A_1B$이고, 선분 $A_1B$가 대칭축과 만나는 점에서 등호가 성립한다.\n\n그러므로 최솟값은\n$A_1B=\\sqrt{(2-(-4))^2+(0-2)^2}=\\sqrt{40}=2\\sqrt{10}$이다.\n따라서 정답은 ⑤이다.')],
  ['original/high/h1/2mid/23_팔마고_2학기_중간_고1_기출.js_15', sol('직선 $l$을 $y=2x+k$로 두면 표준형은 $2x-y+k=0$이다. 원점 $O$에서 직선 $l$까지의 거리를 $d$라 하자.\n\n원의 반지름은 $\\sqrt{10}$이고 현 $AB=2\\sqrt5$이므로, 현의 중점에서 현까지의 수직거리와 반지름으로 직각삼각형을 이루어\n$d^2+\\left(\\dfrac{AB}{2}\\right)^2=10$이다.\n따라서 $d^2+5=10$에서 $d=\\sqrt5$이다.\n\n한편 $d=\\dfrac{|k|}{\\sqrt5}$이므로 $|k|=5$이다. 두 교점이 제2·제3사분면에 있으려면 직선은 $y=2x+5$이어야 하므로 $k=5$이다.\n\n원과 직선의 교점을 구하면\n$x^2+(2x+5)^2=10$에서 $x=-1,-3$이고, 제2사분면의 점은 $A=(-1,3)$이다. 원점과 $A$를 잇는 직선은 원과 다시 $C=(1,-3)$에서 만난다.\n\n$C$를 지나는 수평선 $y=-3$과 $l$의 교점은 $D=(-4,-3)$이므로\n$OD=\\sqrt{(-4)^2+(-3)^2}=5$이다.\n따라서 정답은 ①이다.')],
  ['original/high/h1/2mid/23_팔마고_2학기_중간_고1_기출.js_16', sol('점 $A$를 직선 $y=x$에 대칭이동한 점을 $A_1$, 점 $B$를 $y$축에 대칭이동한 점을 $B_1$라 하자. 그러면 대칭의 성질에 의해\n$AP=A_1P$, $QB=QB_1$이다.\n\n따라서\n$AP+PQ+QB=A_1P+PQ+QB_1\\ge A_1B_1$이다.\n$A_1$가 움직이는 원은 중심 $(8,2)$, 반지름 $2$이고, $B_1$가 움직이는 원은 중심 $(-4,2)$, 반지름 $1$이다.\n\n두 중심 사이의 거리는 $12$이므로 두 원 위의 점 사이의 최솟거리는\n$12-2-1=9$이다. 실제로 두 원의 가장 가까운 점 $A_1=(6,2)$, $B_1=(-3,2)$를 잇는 선분은 $y=x$와 $y$축을 차례로 지나므로 조건을 만족한다.\n\n따라서 최솟값은 $9$이고 정답은 ①이다.')],
  ['original/high/h1/2mid/23_팔마고_2학기_중간_고1_기출.js_18', sol('반지름이 $1$인 원의 중심을 $(x,y)$라 하자. 이를 $(m,m)$만큼 평행이동한 뒤 두 좌표축에 동시에 접하려면 이동한 중심의 좌표가 각각 $1$ 또는 $-1$이어야 한다.\n\n따라서 $|x+m|=|y+m|=1$이고, 두 식을 빼면 $x-y$는 $0$, $2$, $-2$ 중 하나이다. 그러므로 가능한 중심은 직선\n$y=x$, $y=x-2$, $y=x+2$ 위에 놓인다.\n\n원 $C$의 중심도 $y=x$ 위에 있으므로, 원 $C$와 가운데 직선의 교점은 항상 2개이다. 바깥 두 직선은 원 $C$의 중심에서 각각 $\\sqrt2$만큼 떨어져 있다.\n\n조건을 만족하는 중심이 모두 4개가 되려면 바깥 두 직선과 원 $C$가 각각 한 점에서 만나야 한다. 따라서 원 $C$의 반지름은 $r=\\sqrt2$이고\n$r^2=2$이다.\n\n그러므로 정답은 ②이다.')],
  ['original/high/h1/2mid/23_팔마고_2학기_중간_고1_기출.js_20', sol('원 $x^2+y^2-2x-6y+6=0$을 완전제곱식으로 정리하면\n$(x-1)^2+(y-3)^2=4$이다. 따라서 중심은 $(1,3)$, 반지름은 $2$이다.\n\n대칭이동한 원의 방정식에서 중심은 $(5,-3)$이다. 두 중심을 잇는 선분의 중점은 $(3,0)$이고, 중심을 잇는 직선의 기울기는\n$\\dfrac{-3-3}{5-1}=-\\dfrac32$이다. 따라서 대칭축의 기울기는 $\\dfrac23$이고, 중점 $(3,0)$을 지나므로\n$y=\\dfrac23(x-3)$, 즉 $2x-3y-6=0$이다.\n\n두 번째 원 $x^2+y^2-10x+6y+c=0$을 정리하면\n$(x-5)^2+(y+3)^2=34-c$이다. 반지름이 원래 원과 같은 $2$이므로\n$34-c=4$에서 $c=30$이다.\n\n따라서 $a=2$, $b=-3$, $c=30$이다.')],
  ['original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_20', sol('삼각형 $AOB$의 넓이는\n$\\dfrac12\\cdot6\\cdot4=12$이므로 이등분되어야 하는 넓이는 $6$이다.\n\n직선 $y=-2x+k$가 변 $OB$($y=0$)와 만나는 점을 $R$이라 하면 $R=(k/2,0)$이다. 변 $OA$는 $y=\\dfrac45x$이므로, 이 직선과의 교점 $S$는\n$\\dfrac45x=-2x+k$에서 $S=\\left(\\dfrac{5k}{14},\\dfrac{2k}{7}\\right)$이다.\n\n직선이 원점 쪽에서 삼각형을 잘라 내는 경우에는\n$[OSR]=\\dfrac12\\cdot\\dfrac{k}{2}\\cdot\\dfrac{2k}{7}=\\dfrac{k^2}{14}$이다. 이를 $6$과 같게 두면\n$k^2=84$이므로 양의 절편을 갖는 경우 $k=2\\sqrt{21}$이다.\n\n이 경우가 실제로 두 변 $OA$, $OB$를 자르는지 확인하면 $0<k<12$이고 $2\\sqrt{21}<12$이므로 조건을 만족한다. 반대쪽에서 자르는 경우는 $k\\ge12$인데, 이때 직선이 $A$와 $B$ 사이를 지나지 않아 잘린 부분의 넓이가 이미 $6$ 이상이므로 등분 조건을 새로 만들지 못한다.\n\n따라서 구하는 값은 $k=2\\sqrt{21}$이다.')],
  ['original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_21', sol('점 $(-1,1)$에서 직선 $3ax+4ay+a^2+1=0$까지의 거리는\n$\\dfrac{|3a(-1)+4a(1)+a^2+1|}{\\sqrt{(3a)^2+(4a)^2}}=\\dfrac{|a^2+a+1|}{5|a|}$이다. 거리가 $1$이므로 $a\\ne0$이고\n$|a^2+a+1|=5|a|$이다.\n\n$ a^2+a+1=(a+\\dfrac12)^2+\\dfrac34>0$이므로\n$a^2+a+1=5|a|$로 바꿀 수 있다.\n\n$a>0$일 때\n$a^2+a+1=5a$에서 $a^2-4a+1=0$이므로\n$a=2\\pm\\sqrt3$이다. 두 값 모두 양수이다.\n\n$a<0$일 때\n$a^2+a+1=-5a$에서 $a^2+6a+1=0$이므로\n$a=-3\\pm2\\sqrt2$이다. 두 값 모두 음수이다.\n\n따라서 모든 $a$의 값은 $2\\pm\\sqrt3$, $-3\\pm2\\sqrt2$이다.')],
  ['original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js_8', sol('직선 $AB$의 기울기는\n$\\dfrac{5-3}{4-(-2)}=\\dfrac13$이므로\n$y-3=\\dfrac13(x+2)$, 즉 $y=\\dfrac13x+\\dfrac{11}{3}$이다.\n\n점 $C$가 $y$축 위에 있으므로 $C=\\left(0,\\dfrac{11}{3}\\right)$이다.\n\n이제 길이비 조건도 확인한다.\n$AB=\\sqrt{6^2+2^2}=2\\sqrt{10}$이고,\n$BC=\\sqrt{4^2+(-\\dfrac43)^2}=\\dfrac{4\\sqrt{10}}3$이므로\n$2AB=4\\sqrt{10}=3BC$이다. 따라서 이 점 $C$는 주어진 조건을 만족한다.\n\n그러므로 정답은 ②이다.')],
  ['original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js_20', sol('점 $P,Q$는 각각 $AB,AC$를 $1:k$로 내분하고, $P_1,Q_1$은 각각 외분한다고 쓰자. $k>1$이므로\n$AP=\\dfrac{AB}{k+1}$, $AQ=\\dfrac{k\\,AC}{k+1}$이고\n$AP_1=\\dfrac{AB}{k-1}$, $AQ_1=\\dfrac{k\\,AC}{k-1}$이다.\n\n두 삼각형은 꼭짓점 $A$에서 이루는 각이 같으므로 넓이는 두 변의 곱에 비례한다. 따라서\n$\\dfrac{S_1}{S_2}=\\dfrac{AP\\cdot AQ}{AP_1\\cdot AQ_1}=\\left(\\dfrac{k-1}{k+1}\\right)^2$이다.\n\n$7S_1=2S_2$에서\n$\\left(\\dfrac{k-1}{k+1}\\right)^2=\\dfrac27$이다. $k>1$이므로 양의 제곱근을 취해\n$\\dfrac{k-1}{k+1}=\\sqrt{\\dfrac27}$이다.\n\n$\\sqrt7(k-1)=\\sqrt2(k+1)$이므로\n$(\\sqrt7-\\sqrt2)k=\\sqrt7+\\sqrt2$이다. 따라서\n$k=\\dfrac{\\sqrt7+\\sqrt2}{\\sqrt7-\\sqrt2}=\\dfrac{(\\sqrt7+\\sqrt2)^2}{5}=\\dfrac{9+2\\sqrt{14}}5$이다.\n\n따라서 구하는 값은 $\\dfrac{9+2\\sqrt{14}}5$이다.')],
  ['original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js_4', sol('두 점 $(2,1)$, $(-4,a)$를 지나는 직선의 기울기는\n$\\dfrac{a-1}{-4-2}=\\dfrac{1-a}{6}$이다.\n\n$a\\ne0$이면 직선 $3x+ay=1$의 기울기는 $-\\dfrac3a$이므로 수직 조건에서\n$\\dfrac{1-a}{6}\\cdot\\left(-\\dfrac3a\\right)=-1$이다. 양변을 정리하면\n$\\dfrac{1-a}{2a}=1$이므로 $1-a=2a$, 즉 $3a=1$이다. 따라서 $a=\\dfrac13$이다.\n\n분모 때문에 빠진 $a=0$도 확인한다. 이때 두 점을 지나는 직선은 기울기 $\\dfrac16$이고, $3x=1$은 수직선이므로 두 직선은 수직이 아니다. 따라서 $a=0$은 해가 아니다.\n\n그러므로 정답은 ②이다.')],
  ['original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js_5', sol('첫 번째 직선의 법선벡터는 $(1-m,3)$, 두 번째 직선의 법선벡터는 $(2,-m)$이다. 두 직선이 평행하려면\n$(1-m)(-m)-3\\cdot2=0$이므로\n$m^2-m-6=0$이다. 따라서 $m=-2$ 또는 $m=3$이다.\n\n$m=3$이면 첫 번째 직선은 $-2x+3y-5=0$, 두 번째 직선은 $2x-3y+5=0$으로 두 식이 서로 상수배이다. 즉 같은 직선이므로 서로 다른 평행선 조건에서 제외한다.\n\n$m=-2$이면 두 직선은 서로 다른 평행선이다. 기울기식으로 나눌 때 빠질 수 있는 $m=0$은 원래 법선벡터 조건에 대입하면 평행 조건을 만족하지 않는다.\n\n따라서 정답은 ①이다.')],
  ['original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js_17', sol('직사각형의 크기를 $AB=10$, $AD=6$으로 두고, 출발점을 $S$라 하자. $S$는 $AD$의 중점이므로 $S$에서 $AB$까지의 세로 거리는 $3$이다. 도착점 $T$는 $CD$를 $1:4$로 내분하므로 $CT:TD=1:4$이고 $CT=2$, $TD=8$이다.\n\n경로가 $AB$, $BC$를 차례로 지나므로, $AB$와 $BC$를 넘어가는 면을 한 평면으로 펼친다. 이때 첫 번째로 만나는 변과 두 번째로 만나는 변을 반사해도 거리와 각은 보존되므로, 원래의 꺾인 경로는 펼친 도형에서 $S$와 $T$를 잇는 선분으로 바뀐다.\n\n펼친 그림에서 $S$와 $T$의 가로 차이는 $8+1=9$, 세로 차이는 $3+6+?=12$가 된다. 즉 두 번의 반사 뒤 두 점을 좌표로 나타내면 차이가 $(9,12)$이므로 최단거리는\n$\\sqrt{9^2+12^2}=\\sqrt{225}=15$이다.\n\n따라서 정답은 ⑤이다.')],
  ['original/high/h1/1final/23_복성고_1학기_기말_고1_기출.js_15', sol('직사각형의 대각선으로 접힌 뒤 겹치는 부분을 삼각형으로 보고, 그 삼각형의 밑변을 $d$라 하자. 접힌 선분은 대각선의 양 끝을 서로 포개므로, 그림에서 밑변에 대응하는 접힌 선분의 길이도 $d$이다.\n\n가로 길이가 $4$이므로 이 삼각형의 가로 방향 남은 길이는 $4-d$이고, 세로 방향 길이는 $a$이다. 따라서 생기는 직각삼각형에서 피타고라스 정리를 적용하면\n$d^2=a^2+(4-d)^2$이다. 정리하여\n$d=\\dfrac{a^2+16}{8}$을 얻는다.\n\n겹친 부분의 밑변이 $d$, 높이가 $a$인 삼각형이므로 넓이 조건은\n$\\dfrac12ad=\\dfrac52$이다. 위의 $d$를 대입하면\n$a(a^2+16)=40$, 즉\n$a^3+16a-40=0$이다.\n\n$a=2$를 대입하면 식을 만족하고,\n$a^3+16a-40=(a-2)(a^2+2a+20)$이다. 그런데\n$a^2+2a+20=(a+1)^2+19>0$이므로 실수해는 $a=2$뿐이다. 조건 $0<a<4$도 만족하므로 정답은 ③이다.')],
  ['original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js_17', sol('직선 $AB$의 방정식은 $y+1=2(x-a)$, 즉 $2x-y-2a-1=0$이다. $B$는 $x=2$ 위에 있으므로 $B=(2,3-2a)$이고,\n$AB=\\sqrt{(2-a)^2+(4-2a)^2}=\\sqrt5(2-a)$이다.\n\n점 $C$는 직선 $4x-3y+12=0$의 제2사분면 부분에 있으므로, 두 축과 만나는 끝점 $(-3,0)$과 $(0,4)$를 제외한 열린 선분 위에 있다. 직선 $AB$에 대한 두 끝점의 식의 값은 각각 $-(2a+7)$, $-(2a+5)$이므로 $C$에서의 넓이는 두 끝점에서의 극한 사이에 있다.\n\n따라서 모든 $C$에 대해 넓이가 $\\dfrac12$보다 크고 $\\dfrac52$보다 작으려면, 끝점에서 얻는 극한값을 사용하여\n$\\dfrac12(2-a)(2a+5)\\ge\\dfrac12$,\quad $\\dfrac12(2-a)(2a+7)\\le\\dfrac52$\n이어야 한다. 등호가 허용되는 이유는 두 축 위의 끝점이 제2사분면에 포함되지 않기 때문이다.\n\n첫 번째 부등식에서\n$2a^2+a-9\\le0$이므로 $a\\le\\dfrac{-1+\\sqrt{73}}4$ (주어진 $-2<a<2$와 함께 사용)이다. 두 번째에서\n$2a^2+3a-9\\ge0$이므로 $a\\ge\\dfrac32$이다.\n\n따라서 $m=\\dfrac32$, $M=\\dfrac{-1+\\sqrt{73}}4$이고\n$M+m=\\dfrac{5+\\sqrt{73}}4$이다. 그러므로 $p=4$, $q=5$여서 $p+q=9$이므로 정답은 ①이다.')],
  ['original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_18', sol('삼각형 $OAB$에서\n$OA=3\\sqrt2$, $OB=4$, $AB=\\sqrt{(4-3)^2+(0-3)^2}=\\sqrt{10}$이므로 세 각이 모두 예각이다. 예각삼각형에서 세 변 위의 점을 연결한 삼각형의 둘레가 최소가 되는 경우는 세 꼭짓점에서 각각 맞은편 변에 내린 수선의 발을 잡는 경우이다. 이 사실은 각 변에서 경로를 반사하면 임의의 꺾인 둘레가 직선거리의 합보다 작아질 수 없고, 수선의 발에서 세 번의 등호가 동시에 성립하는 것으로 확인할 수 있다.\n\n$D$는 $O$에서 $AB$에 내린 수선의 발이다. $AB$의 방정식은 $3x+y-12=0$이므로\n$D=\\left(\\dfrac{18}{5},\\dfrac65\\right)$이다. $E$는 $B$에서 $AO:y=x$에 내린 수선의 발이므로 $E=(2,2)$이고, $F$는 $A$에서 $BO:y=0$에 내린 수선의 발이므로 $F=(3,0)$이다.\n\n그러면\n$DE=\\sqrt{(\\dfrac{18}{5}-2)^2+(\\dfrac65-2)^2}=\\dfrac{4\\sqrt5}{5}$,\n$EF=\\sqrt{1^2+(-2)^2}=\\sqrt5$,\n$FD=\\sqrt{(\\dfrac{18}{5}-3)^2+(\\dfrac65)^2}=\\dfrac{3\\sqrt5}{5}$이다.\n\n최소 둘레는 $\\dfrac{4\\sqrt5}{5}+\\sqrt5+\\dfrac{3\\sqrt5}{5}=\\dfrac{12\\sqrt5}{5}$이므로 $a=12$, $b=5$이다. 따라서 $a-b=7$이고 정답은 ④이다.')],
  ['original/high/h1/2mid/21_효천고_2학기_중간_고1_기출.js_19', sol('$a=0$인 경우와 $a\\ne0$인 경우를 나누어 확인한다.\n\n먼저 $a\\ne0$이면 $(5,1)$만큼 평행이동한 직선은\n$y-1=a(x-5)+2$, 즉 $y=ax-5a+3$이다. 이를 $y=x$에 대칭이동하면\n$x=ay-5a+3$이다. 따라서\n$y=\\dfrac1a x+5-\\dfrac3a$이다. 원래 직선 $l:y=ax+2$와 $l_1$의 교점이 $y$축 위에 있으므로 $x=0$에서 두 직선의 $y$값이 같아야 한다.\n$2=5-\\dfrac3a$에서 $a=1$이다.\n\n다음으로 $a=0$이면 $l$은 $y=2$이고, 평행이동 후 대칭한 직선은 $x=3$이다. 두 직선의 교점 $(3,2)$는 $y$축 위가 아니므로 이 경우는 조건을 만족하지 않는다.\n\n따라서 구하는 값은 $1$이다.')],
  ['original/high/h1/2mid/25_순천고_2학기_중간_고1_기출.js_18', sol('변 $BC$의 중점을 $M$이라 하자. 무게중심의 성질에 따라\n$G=\\dfrac{A+2M}{3}$이므로 $A=3G-2M$이다.\n\n직선 $BC$를 $L(x,y)=3x-y-1=0$으로 나타내면 $M$은 $BC$ 위에 있으므로 $L(M)=0$이다. 또\n$L(G)=3\\cdot3-1-1=7$이다.\n\n$L$은 일차식이므로 $A=3G-2M$을 대입하면\n$L(A)=L(3G-2M)=3L(G)-2L(M)=3\\cdot7-0=21$이다.\n\n따라서 점 $A$에서 직선 $BC$까지의 거리는\n$AH=\\dfrac{|3x_A-y_A-1|}{\\sqrt{3^2+(-1)^2}}=\\dfrac{21}{\\sqrt{10}}$이다. 구하는 자연수는 $n=21$이므로 정답은 $21$이다.')],
]);

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

function readBank(filePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  return context.window.questionBank || [];
}

function locateObject(text, id) {
  const marker = new RegExp(`\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*${id},`);
  const found = marker.exec(text);
  if (!found) throw new Error(`Question object not found: ${id}`);
  const start = found.index + 1;
  let depth = 0; let quoted = false; let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quoted = false; continue; }
    if (ch === '"') { quoted = true; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') { depth -= 1; if (depth === 0) return { start, end: i + 1 }; }
  }
  throw new Error(`Question object closing brace not found: ${id}`);
}

function replaceSolution(text, id, nextSolution) {
  const object = locateObject(text, id);
  const block = text.slice(object.start, object.end);
  const pattern = /(^[ \t]*"solution"\s*:\s*)("(?:\\.|[^"\\])*")/m;
  const found = pattern.exec(block);
  if (!found) throw new Error(`Solution property not found: ${id}`);
  const previous = JSON.parse(found[2]);
  const replacement = `${found[1]}${JSON.stringify(nextSolution)}`;
  const nextBlock = block.slice(0, found.index) + replacement + block.slice(found.index + found[0].length);
  return { text: text.slice(0, object.start) + nextBlock + text.slice(object.end), previous };
}

const manifestByKey = new Map(manifest.rows.map((row) => [row.qKey, row]));
const ledger = [];
const touched = new Map();
for (const [qKey, nextSolution] of repairs) {
  const row = manifestByKey.get(qKey);
  if (!row) throw new Error(`Repair qKey not in frozen manifest: ${qKey}`);
  const filePath = path.join(STAGING_ARCHIVE, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  const beforeFile = fs.readFileSync(filePath, 'utf8');
  const current = touched.get(filePath) || beforeFile;
  const question = readBank(filePath).find((item) => item.id === row.id);
  if (!question || question.answer !== (row.answer || question.answer)) throw new Error(`Protected answer identity mismatch: ${qKey}`);
  const result = replaceSolution(current, row.id, nextSolution);
  touched.set(filePath, result.text);
  ledger.push({ questionUid: row.questionUid, qKey, sourceJsPath: row.sourceJsPath, id: row.id, field: 'solution', beforeHash: sha(result.previous), afterHash: sha(nextSolution), reasonCode: 'FAIL_SOLUTION_LOGIC_OR_STUDENT_REPRODUCIBILITY', reviewSource: 'independent_A', artifactShaBefore: sha(current), artifactShaAfter: sha(result.text), protectedFieldsTouched: [], carryForwardEligible: false });
}

for (const [filePath, text] of touched) {
  new vm.Script(text, { filename: filePath });
  fs.writeFileSync(filePath, text, 'utf8');
}
fs.writeFileSync(path.join(REPORTS, 'solution_upgrade_ledger_v2.json'), JSON.stringify({ status: 'A_REPAIR_APPLIED_TO_STAGING', repairedQuestionCount: repairs.size, changedSourceFileCount: touched.size, ledger }, null, 2) + '\n', 'utf8');
const headers = Object.keys(ledger[0]);
const csv = [headers.join(',')];
for (const entry of ledger) csv.push(headers.map((key) => { const value = Array.isArray(entry[key]) ? entry[key].join('|') : String(entry[key] ?? ''); return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value; }).join(','));
fs.writeFileSync(path.join(REPORTS, 'solution_upgrade_ledger_v2.csv'), `${csv.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ status: 'A_REPAIR_APPLIED_TO_STAGING', repairedQuestionCount: repairs.size, changedSourceFileCount: touched.size }, null, 2));
