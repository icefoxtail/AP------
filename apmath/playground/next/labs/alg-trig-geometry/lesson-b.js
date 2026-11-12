/* Advanced source questions and the distinct ideas already present in their inquiry. */
(function (global) {
  'use strict';
  const R = String.raw;
  (global.APL_TRIG_GEOMETRY_LESSON_BUILDERS || (global.APL_TRIG_GEOMETRY_LESSON_BUILDERS = [])).push(({ add, concept, C }) => {
    add('adv-1', '대칭각합', '세 조건을 모두 만족하는 동경', R`$\dfrac{3\pi}{2}$`, [
      C('세 조건을 구별하기', R`$P$와 $Q$의 동경은 각각 $\theta,5\theta$예요.`, R`$y=x$ 대칭, $P$의 위치, 삼각형 성립을 모두 확인해요.`),
      C('대칭 조건의 후보', R`$\theta+5\theta=2n\pi+\dfrac\pi2$예요.`, R`$\theta=\dfrac{n\pi}{3}+\dfrac\pi{12}$이고 $n=0,1,\ldots,5$예요.`, { stage: 1, after: ['candidates'] }),
      C('위쪽 반평면에 있는 점', R`$\sin\theta\gt\cos\theta$이므로 $\dfrac\pi4\lt\theta\lt\dfrac{5\pi}4$예요.`, R`남는 후보는 $\dfrac{5\pi}{12},\dfrac{3\pi}{4},\dfrac{13\pi}{12}$예요.`, { stage: 2 }),
      C('일직선인 후보 제외', R`$\theta=\dfrac{3\pi}4$에서는 $4\theta=3\pi$예요.`, R`두 동경이 반대 방향이어서 $O,P,Q$가 일직선이에요.`, { stage: 3, start: { t: 3 / 8 }, show: ['angle'] }),
      C('남은 두 각 확인', R`$\theta=\dfrac{5\pi}{12},\dfrac{13\pi}{12}$에서는 삼각형이 생겨요.`, R`두 값 모두 $0\lt\theta\lt2\pi$와 위치 조건을 만족해요.`, { start: { t: 5 / 24 }, show: ['eligible'] }),
      C('대칭각의 합', R`따라서 $\dfrac{5\pi}{12}+\dfrac{13\pi}{12}=\dfrac{3\pi}2$예요.`, '대칭 조건만 풀고 일직선인 후보까지 더하지 않아요.')
    ]);
    concept('adv-1', '퇴화제외', '대칭이어도 삼각형이 아닐 수 있어요', R`$\theta=\dfrac{3\pi}4$이면 넓이가 $0$이므로 제외`,
      R`$\theta=\dfrac{3\pi}4$는 $y=x$ 대칭과 위쪽 위치 조건을 만족해요. 그런데 삼각형 조건에서는 왜 제외할까요?`, [
        C('두 동경의 차이', R`두 동경의 각도 차이는 $5\theta-\theta=4\theta$예요.`, '동경이 같은 직선 위에 놓이는 순간을 살펴봐요.'),
        C('문제의 후보에 맞추기', R`$\theta=\dfrac{3\pi}4$이면 $5\theta=\dfrac{15\pi}4$예요.`, R`한 바퀴를 빼면 $Q$의 방향은 $\dfrac{7\pi}4$예요.`, { stage: 1, start: { t: 3 / 8 }, show: ['angle'] }),
        C('반대쪽 두 반지름', R`두 방향의 차이는 $\pi$예요.`, R`따라서 $Q=-P$이고 선분 $PQ$가 원점을 지나요.`, { stage: 2 }),
        C('넓이로도 확인', R`$OP=OQ=1$이므로 넓이는 $\dfrac12|\sin4\theta|$예요.`, R`여기서는 $\sin3\pi=0$이에요.`),
        C('퇴화한 삼각형 제외', R`넓이가 $0$이므로 세 점은 삼각형을 만들지 못해요.`, '대칭과 위치 조건을 통과해도 이 후보는 제외해야 해요.', { stage: 3 })
      ], { start: { t: .34 } });

    add('adv-2', '대칭넓이', '정삼각형 높이와 좌표 대칭', R`$2k^2+4\sin\alpha\sin\beta=4$`, [
      C('단위원의 넓이 조건', R`$OP=OQ=1$이고 넓이는 $\dfrac{\sqrt3}{4}$예요.`, R`$\phi=\angle POQ$라 하면 넓이는 $\dfrac12\sin\phi$예요.`),
      C('예각을 선택하는 이유', R`$\sin\phi=\dfrac{\sqrt3}{2}$예요.`, R`두 점이 제1사분면에 있으므로 $0\lt\phi\lt\dfrac\pi2$예요.`, { stage: 1, third: R`따라서 $\phi=\dfrac\pi3$이고 정삼각형이에요.`, thirdShow: ['center'] }),
      C('현의 중점과 높이', R`현의 중점 $M$에 내린 높이는 $OM=\dfrac{\sqrt3}{2}$예요.`, R`직선까지의 거리 $OM=\dfrac{k}{\sqrt2}$와 같아요.`, { stage: 2, show: ['height'], after: ['heightFormula'], third: R`두 식을 제곱하면 $k^2=\dfrac32$예요.` }),
      C('대칭인 두 좌표', R`$Q$는 $P$의 두 좌표를 바꾼 점이에요.`, R`그러므로 $\sin\beta=\cos\alpha$, $\sin\alpha+\cos\alpha=k$예요.`, { stage: 3, show: ['mid'] }),
      C('구하려는 곱', R`$k^2=1+2\sin\alpha\cos\alpha$예요.`, R`따라서 $\sin\alpha\sin\beta=\dfrac{k^2-1}{2}=\dfrac14$예요.`),
      C('식의 값 결론', R`$2k^2+4\sin\alpha\sin\beta=2\cdot\dfrac32+4\cdot\dfrac14=4$예요.`, '주어진 넓이를 만족하는 위치에서만 이 값을 사용해요.')
    ]);
    concept('adv-2', '예각조건', '넓이의 사인값에서 각을 고르기', R`$1\lt k\lt\sqrt2$에서는 $0\lt\angle POQ\lt\dfrac\pi2$`,
      R`넓이에서 $\sin\phi=\dfrac{\sqrt3}{2}$를 얻었어요. 왜 $\phi=\dfrac{2\pi}3$을 선택하면 안 될까요?`, [
        C('직선과 원의 교점', R`직선은 $x+y=k$이고 $1\lt k\lt\sqrt2$예요.`, '두 교점이 있는 위치부터 확인해요.'),
        C('좌표의 부호', R`두 교점의 좌표는 $\dfrac{k\pm\sqrt{2-k^2}}2$예요.`, R`$k\gt1$이면 $k\gt\sqrt{2-k^2}$이므로 모두 양수예요.`),
        C('경계와 비교하기', R`경계 $k=1$에서는 교점이 두 좌표축 위에 있어요.`, R`이때의 중심각 $\dfrac\pi2$는 원문의 범위에 포함되지 않아요.`, { stage: 1, start: { t: 0 }, show: ['center'] }),
        C('직선이 안쪽으로 들어가면', R`$k\gt1$로 돌아가면 두 동경이 모두 제1사분면 안에 있어요.`, '서로 다른 두 동경 사이의 각은 직각보다 작아요.', { move: { t: .24 } }),
        C('예각 조건의 결론', R`따라서 $0\lt\phi\lt\dfrac\pi2$이고 $\dfrac{2\pi}3$은 제외돼요.`, '사인값만 보고 각을 정하지 않고 교점의 위치를 함께 봐요.')
      ], { start: { t: .24 } });

    add('adv-3', '사각넓이', '기울기 비를 밑변과 높이로 바꾸기', R`$[ABDC]=12$`, [
      C('그래프의 대칭축', R`$f(x)=3\sin\left(\dfrac\pi6x\right)$의 주기는 $12$예요.`, R`첫 봉우리의 축은 $x=3$이므로 $x_1+x_2=6$이에요.`, { stage: 1, after: ['axis'] }),
      C('기울기 비를 좌표 비로', R`$\dfrac{k/x_1}{k/x_2}=\dfrac{x_2}{x_1}=5$예요.`, R`$x_2=5x_1$과 합 조건으로 $x_1=1$, $x_2=5$예요.`, { stage: 2, after: ['topX'] }),
      C('높이와 밑변', R`$k=f(1)=3\sin\dfrac\pi6=\dfrac32$예요.`, R`따라서 $AB=5-1=4$예요.`, { show: ['top'], after: ['width'] }),
      C('점대칭으로 사각형 확인', R`그래프의 점대칭 중심은 $M(6,0)$이에요.`, R`$C=(7,-k)$, $D=(11,-k)$이고 두 대각선의 중점이 $M$이에요.`, { stage: 3, show: ['mid'], after: ['bottom'] }),
      C('평행사변형의 높이', R`따라서 $ABDC$는 평행사변형이에요.`, R`두 수평선의 거리는 $k-(-k)=2k=3$이에요.`),
      C('넓이의 결론', R`넓이는 밑변 곱하기 높이, $4\cdot3=12$예요.`, '비스듬한 옆변의 길이를 높이로 사용하지 않아요.')
    ]);
    concept('adv-3', '점대칭', '두 대각선의 중점에서 평행사변형 읽기', R`두 대각선이 $M(6,0)$에서 서로를 이등분하므로 평행사변형`,
      R`$0\lt k\lt3$에서 수평선 $y=\pm k$를 움직여도 왜 사각형 $ABDC$는 평행사변형일까요?`, [
        C('반 주기와 부호', R`$f(x+6)=-f(x)$이고 주기는 $12$예요.`, '위의 양수 봉우리와 아래의 음수 봉우리를 비교해요.'),
        C('가운데 점에 대한 대칭', R`$f(12-x)=-f(x)$예요.`, R`따라서 그래프는 $M(6,0)$에 대하여 점대칭이에요.`, { stage: 1, show: ['mid'] }),
        C('대각선의 양 끝', R`$A(x_1,k)$에 대응하는 점은 $D(12-x_1,-k)$예요.`, R`$B(x_2,k)$에는 $C(12-x_2,-k)$가 대응해요.`),
        C('높이가 바뀌어도 같은 중점', R`각 쌍의 중점은 $\left(\dfrac{x+12-x}{2},\dfrac{k-k}{2}\right)$예요.`, '수평선을 움직여도 두 대각선의 중점은 바뀌지 않아요.', { move: { t: .2 } }),
        C('평행사변형의 결론', R`두 대각선이 $M(6,0)$에서 서로를 이등분해요.`, '따라서 수평선의 높이와 관계없이 평행사변형이에요.', { stage: 3 })
      ], { start: { t: .58 } });

    add('adv-4', '경계값', '세 근을 만드는 두 높이의 조건', R`$a-b+M=10$`, [
      C('절댓값과 끝점', R`$c=|b|\gt0$라 놓으면 $f(x)=|a\sin x-c|$예요.`, R`닫힌 구간의 $x=0,\pi,2\pi$는 모두 높이 $c$예요.`, { stage: 1, third: R`실근이 $3$개인 높이는 정확히 $1,2$여야 해요.` }),
      C('가능하지 않은 세 경우', R`$a\le c$이면 $f=c-a\sin x$여서 세 근의 높이는 $c$ 하나예요.`, R`$a=2c$이면 높이 $c$에서 끝점들과 꼭짓점까지 $4$개예요.`, { third: R`$a\gt2c$이면 높이 $c$는 $5$개, $a-c$만 $3$개예요.` }),
      C('두 높이가 생기는 경우', R`따라서 $c\lt a\lt2c$, 즉 $0\lt a-c\lt c$예요.`, R`세 근의 두 높이를 비교하면 $a-c=1$, $c=2$예요.`, { third: R`그러므로 $a=3$, $b=-c=-2$예요.` }),
      C('닫힌 구간의 두 경계', R`높이 $1$에서는 작은 봉우리 한 점과 다른 두 점을 만나요.`, R`높이 $2$에서는 $0,\pi,2\pi$의 세 점을 만나요.`, { stage: 2, start: { t: 1 / 5.5 }, move: { t: 2 / 5.5 }, show: ['params', 'level'] }),
      C('최댓값 구하기', R`$-1\le\sin x\le1$에서 가장 큰 절댓값은 $|-3-2|$예요.`, R`따라서 $M=a+c=5$예요.`, { stage: 3, after: ['maximum'] }),
      C('식의 값 결론', R`$a-b+M=3-(-2)+5=10$이에요.`, '다른 크기 관계와 닫힌 끝점까지 확인한 결과예요.')
    ]);
    concept('adv-4', '닫힌끝점', '오른쪽 끝점을 포함하면 근이 달라져요', R`$[0,2\pi]$에서는 $3$개, $[0,2\pi)$에서는 $2$개`,
      R`$|3\sin x-2|=2$를 풀 때, 닫힌 구간 $[0,2\pi]$와 반열린 구간 $[0,2\pi)$의 근 개수는 왜 달라질까요?`, [
        C('두 부호로 풀기', R`$3\sin x-2=2$ 또는 $3\sin x-2=-2$예요.`, R`즉 $\sin x=\dfrac43$ 또는 $\sin x=0$이에요.`, { stage: 1, show: ['level'] }),
        C('사인의 범위 확인', R`$\sin x\le1$이므로 $\dfrac43$이 될 수 없어요.`, R`따라서 $\sin x=0$만 남아요.`),
        C('한 주기의 후보', R`$0\le x\le2\pi$에서 후보는 $0,\pi,2\pi$예요.`, '왼쪽 끝점과 오른쪽 끝점은 서로 다른 가로 좌표예요.', { stage: 2, show: ['params'] }),
        C('구간의 괄호 비교', R`$[0,2\pi]$는 오른쪽 끝점도 포함해요.`, R`$[0,2\pi)$에서는 $x=2\pi$를 제외해요.`),
        C('서로 다른 근의 개수', R`닫힌 구간은 $3$개, 반열린 구간은 $2$개예요.`, '주기 때문에 함수값이 같아도 두 끝점을 같은 근으로 합치지 않아요.')
      ], { start: { t: 2 / 5.5 } });

    add('adv-5', '조건곱합', '새 근 하나를 보태는 두 접점', R`$-\dfrac52$`, [
      C('두 사인 조건으로 분리', R`$2\sin^2x-(2k+1)\sin x+k=0$이에요.`, R`$(2\sin x-1)(\sin x-k)=0$으로 묶어요.`),
      C('먼저 고정된 두 근', R`$\sin x=\dfrac12$에서 $\dfrac\pi6,\dfrac{5\pi}6$을 얻어요.`, R`두 근의 합은 $\pi$이고, 새 근이 하나 더 필요해요.`, { stage: 1, show: ['roots'] }),
      C('겹침과 범위 확인', R`$k=\dfrac12$이면 두 고정근과 겹쳐 총 $2$개예요.`, R`$|k|\gt1$이면 새 근이 없고, $k=0$이면 $0,\pi$가 더해져요.`, { third: R`$-1\lt k\lt1$, $k\ne\dfrac12$이면 새 근이 두 개예요.` }),
      C('새 근이 하나인 경계', R`따라서 $k=1$ 또는 $k=-1$인 접점만 가능해요.`, R`$k=1$의 근의 합은 $\pi+\dfrac\pi2=\dfrac{3\pi}2$예요.`, { stage: 2, start: { t: 11 / 12 }, show: ['extrema', 'level'] }),
      C('곱과 더 큰 근의 합', R`$k=-1$의 근의 합은 $\pi+\dfrac{3\pi}2=\dfrac{5\pi}2$예요.`, R`두 $k$의 곱은 $P=-1$, 최대 합은 $S=\dfrac{5\pi}2$예요.`, { stage: 3, start: { t: 1 / 12 } }),
      C('구하는 값', R`$P\cdot\dfrac S\pi=-1\cdot\dfrac{5\pi/2}{\pi}=-\dfrac52$예요.`, '사인값의 개수와 서로 다른 가로 좌표의 개수를 구별했어요.')
    ]);
    concept('adv-5', '근합집합', '겹친 사인 조건의 근 세기', R`$k=\dfrac12$이면 서로 다른 실근은 $2$개`,
      R`$(2\sin x-1)(\sin x-k)=0$에서 $k=\dfrac12$이면 왜 두 조건의 근 개수를 더할 수 없을까요?`, [
        C('고정 조건과 이동 조건', R`첫 조건은 $\sin x=\dfrac12$, 둘째는 $\sin x=k$예요.`, '전체 해는 두 조건을 만족하는 가로 좌표들의 합집합이에요.', { stage: 1, show: ['roots', 'level'] }),
        C('겹치지 않는 위치와 비교', R`$k=0$이면 이동 조건의 근은 $0,\pi$예요.`, R`고정근 $\dfrac\pi6,\dfrac{5\pi}6$과 달라 이때는 $4$개예요.`, { stage: 3, start: { t: .5 } }),
        C('두 수평선을 일치시키기', R`이동선을 $k=\dfrac12$까지 올려요.`, '두 식이 같은 사인값을 요구하므로 교점이 포개져요.', { move: { t: 17 / 24 } }),
        C('중근과 가로 좌표 구별', R`$u=\sin x$로 보면 $u=\dfrac12$는 중근이에요.`, R`하지만 가로 좌표의 집합은 $\left\{\dfrac\pi6,\dfrac{5\pi}6\right\}$이에요.`),
        C('합집합의 개수', R`같은 가로 좌표는 한 번만 세므로 서로 다른 실근은 $2$개예요.`, '인수의 개수나 중복도를 실근 개수로 더하지 않아요.')
      ], { start: { t: .5 } });

    add('adv-6', '최대값식', '고정 현에서 높이를 최대로 만들기', R`$39$`, [
      C('예각과 고정 현', R`$R=2\sqrt3$, $\sin A=\dfrac{\sqrt3}{2}$이고 $A$는 예각이에요.`, R`따라서 $A=\dfrac\pi3$, $BC=2R\sin A=6$이에요.`, { stage: 1, after: ['angleA', 'base'] }),
      C('외심에서 현까지', R`현의 중점을 $M$이라 하면 $BM=3$이에요.`, R`$OM=\sqrt{R^2-3^2}=\sqrt3$이에요.`, { stage: 2 }),
      C('높이의 최댓값', R`원 위에서 $A$의 세로 좌표는 $R$ 이하예요.`, R`따라서 $h\le R+OM=3\sqrt3$이고 맨 위 점에서 등호예요.`, { move: { t: .5 }, after: ['height'] }),
      C('최대일 때 두 변의 합', R`이 위치에서 $AB=AC$이고 $A=\dfrac\pi3$이므로 정삼각형이에요.`, R`$AB=AC=BC=6$이므로 $L=12$예요.`, { stage: 3, after: ['L'] }),
      C('최대 넓이', R`$S_{\max}=\dfrac12\cdot6\cdot3\sqrt3=9\sqrt3$예요.`, '밑변은 고정되어 있으므로 높이가 최대일 때 넓이도 최대예요.'),
      C('식의 값 결론', R`$L+\sqrt3S_{\max}=12+\sqrt3\cdot9\sqrt3=39$예요.`, '최대 위치에서 얻은 길이와 넓이를 같은 식에 넣었어요.')
    ], { start: { t: .22 } });
    concept('adv-6', '높이최대', '원 위의 최고점과 삼각형 넓이', R`$h_{\max}=3\sqrt3$`,
      R`현 $BC=6$을 고정하고 큰 호 위에서 점 $A$를 움직일 때, 높이는 어디에서 최대가 될까요?`, [
        C('고정된 밑변', R`넓이는 $S=\dfrac12\cdot6h=3h$예요.`, '넓이를 비교하려면 노란 수선의 길이를 비교하면 돼요.', { stage: 1, show: ['base', 'angleA'] }),
        C('기준 높이 정하기', R`외심을 높이 $0$으로 잡으면 현의 높이는 $-\sqrt3$예요.`, R`반지름은 $R=2\sqrt3$이에요.`, { stage: 2 }),
        C('점의 높이와 삼각형 높이', R`$A$의 세로 좌표를 $y_A$라 하면 $h=y_A+\sqrt3$예요.`, R`원 위에서 $y_A\le R$이에요.`, { move: { t: .78 } }),
        C('등호가 되는 위치', R`$y_A=R$은 원의 맨 위 점에서만 가능해요.`, '이 점은 현의 수직이등분선 위에 있어요.', { move: { t: .5 } }),
        C('최대 높이 결론', R`$h_{\max}=R+\sqrt3=3\sqrt3$예요.`, '고정된 밑변에서는 이 위치가 최대 넓이의 위치예요.', { stage: 3, show: ['height'] })
      ], { start: { t: .22 } });

    add('adv-7', '원넓이식', '넓이 비에서 변을 구하고 외접원으로', R`$22$`, [
      C('마주보는 두 각', R`$B=\dfrac\pi3$이므로 $D=\pi-B=\dfrac{2\pi}3$예요.`, R`따라서 $\sin B=\sin D=\dfrac{\sqrt3}{2}$예요.`, { stage: 1, show: ['angleD'] }),
      C('넓이 비에서 변 찾기', R`두 넓이의 비는 $\dfrac{AB\cdot BC}{CD\cdot DA}=\dfrac{15}{2DA}=\dfrac52$예요.`, R`$30=10DA$이므로 $DA=3$이에요.`, { after: ['DA'] }),
      C('공통 대각선 구하기', R`$AC^2=3^2+5^2-2\cdot3\cdot5\cos\dfrac\pi3=19$예요.`, R`따라서 $AC=\sqrt{19}$예요.`, { stage: 2, after: ['diagonal'] }),
      C('삼각형의 외접원', R`사인법칙에서 $2R=\dfrac{AC}{\sin B}=\dfrac{2\sqrt{19}}{\sqrt3}$예요.`, R`따라서 $R^2=\dfrac{19}{3}$이에요.`, { stage: 3, after: ['radius'] }),
      C('원의 넓이', R`$S_{\text{원}}=\pi R^2=\dfrac{19\pi}{3}$이에요.`, R`세 점 $A,B,C$의 외접원이 원래 사각형의 외접원이에요.`),
      C('식의 값 결론', R`$\dfrac3\pi S_{\text{원}}+DA=19+3=22$예요.`, '넓이 비와 사인법칙을 서로 다른 목적에 사용했어요.')
    ]);
    concept('adv-7', '보각넓이', '내접사각형의 넓이 비에서 사인 약분', R`$[ABC]:[ACD]=(AB\cdot BC):(CD\cdot DA)$`,
      R`원에 내접한 사각형에서 두 삼각형의 끼인각이 달라도, 왜 넓이의 비를 두 변의 곱으로 비교할 수 있을까요?`, [
        C('두 삼각형으로 나누기', R`대각선 $AC$를 기준으로 두 영역을 나눠요.`, R`넓이는 각각 $\dfrac12AB\cdot BC\sin B$, $\dfrac12CD\cdot DA\sin D$예요.`, { stage: 1 }),
        C('마주보는 각은 보각', R`내접사각형에서는 $B+D=\pi$예요.`, R`따라서 $\sin D=\sin(\pi-B)=\sin B$예요.`, { show: ['angleD'] }),
        C('호 위에서 점을 옮기기', R`$D$를 옮기면 $CD,DA$와 아래쪽 넓이가 변해요.`, '마주보는 각의 관계는 같은 원 위에서 유지돼요.', { move: { t: .85 } }),
        C('같은 인수 확인', R`두 넓이에 같은 양수 $\dfrac12\sin B$가 곱해져 있어요.`, '비를 구할 때 이 공통 인수를 약분해요.', { move: { t: .62 } }),
        C('넓이 비의 결론', R`따라서 $[ABC]:[ACD]=(AB\cdot BC):(CD\cdot DA)$예요.`, '끼인각 자체가 같아서가 아니라 보각의 사인값이 같아서예요.')
      ], { start: { t: .28 } });

    add('adv-8', '분할선분', '정사영과 수직이등분선으로 길이 구하기', R`$AD=5$`, [
      C('내분점의 두 길이', R`$BC=6$을 $1:2$로 나누므로 $BD=2$, $DC=4$예요.`, R`전체 삼각형의 다른 두 변은 $AB=5$, $AC=7$이에요.`, { stage: 1, show: ['parts'] }),
      C('공통각의 코사인', R`$\cos B=\dfrac{5^2+6^2-7^2}{2\cdot5\cdot6}$예요.`, R`$\cos B=\dfrac{12}{60}=\dfrac15$이에요.`),
      C('정사영 길이', R`$A$에서 $BC$에 내린 수선의 발을 $H$라 해요.`, R`$BH=AB\cos B=5\cdot\dfrac15=1$이에요.`, { stage: 2, after: ['foot'] }),
      C('수직이등분선 확인', R`$HD=BD-BH=2-1=1$이므로 $BH=HD$예요.`, R`또 $AH\perp BD$이므로 $AH$는 $BD$의 수직이등분선이에요.`),
      C('선분 길이 결론', R`수직이등분선 위의 점 $A$에서 $AB=AD$예요.`, R`따라서 $AD=5$예요.`, { stage: 3, after: ['AD'] })
    ]);
    concept('adv-8', '인접보각', '두 삼각형의 코사인 항 소거', R`$\cos\alpha+\cos(\pi-\alpha)=0$으로 공통 선분을 계산`,
      R`같은 원문의 두 삼각형 $ABD,ACD$에서, 점 $D$의 두 각을 이용하면 어떻게 코사인 항을 없앨 수 있을까요?`, [
        C('공통 선분을 미지수로', R`$AD=x$, $BD=2$, $DC=4$로 놓아요.`, R`$\angle BDA=\alpha$라 하면 $\angle ADC=\pi-\alpha$예요.`, { stage: 1, show: ['parts'], end: { ltgStage: 2 } }),
        C('첫 삼각형의 코사인', R`$AB^2=x^2+2^2-4x\cos\alpha=25$예요.`, R`따라서 $\cos\alpha=\dfrac{x^2-21}{4x}$예요.`),
        C('둘째 삼각형의 코사인', R`$AC^2=x^2+4^2-8x\cos(\pi-\alpha)=49$예요.`, R`따라서 $\cos(\pi-\alpha)=\dfrac{x^2-33}{8x}$예요.`),
        C('두 코사인의 합', R`보각이므로 $\cos(\pi-\alpha)=-\cos\alpha$예요.`, R`두 식을 더하고 $8x$를 곱하면 $2(x^2-21)+(x^2-33)=0$이에요.`),
        C('소거 뒤 선분 확인', R`$3x^2=75$이므로 양수인 길이는 $x=5$예요.`, R`인접한 보각의 코사인 항을 소거하여 $AD=5$를 얻어요.`, { stage: 3, show: ['AD'] })
      ], { set: { ltgMode: 'cosine' } });
  });
})(window);
