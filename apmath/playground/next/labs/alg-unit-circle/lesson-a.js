/* The original circle/graph exploration scenes: one button for each goal. */
(function (global) {
  'use strict';
  const R = String.raw, PI = Math.PI;
  (global.APL_UC_LESSON_BUILDERS = global.APL_UC_LESSON_BUILDERS || []).push(function ({ concept, C, P }) {
    const stage = (chapter, value) => { chapter.cues[0].step = value; return chapter; };
    const set = (chapter, values) => { chapter.cues[0].set = values; return chapter; };
    const base = (fn, view = 'circle', extra = {}) => ({ set: { fn, view, mode: 'continuous', showApprox: false, showDeg: true, snapSpecial: false, domain: 'one', common: false, ...extra }, start: { theta: 0, x0: -.25, x1: 2 * PI + .25 } });
    const SC = { sin: true, cos: true, tan: false };

    concept('coords', '좌표읽기', '특수각에서 단위원의 좌표 읽기', R`$P=(\sqrt3/2,1/2)$`,
      R`반지름이 1인 원 위의 점 P를 $\theta=\pi/6$으로 옮깁니다. P의 좌표를 구합니다.`, [
        C('특수각으로 이동', P(R`P를 $\theta=\pi/6$까지 옮겨요.`), '반지름 1이 직각삼각형의 빗변이에요.', { theta: PI / 6 }),
        C('세로 좌표', P(R`$30^\circ$를 마주 보는 변은 빗변의 절반이에요.`), P(R`따라서 세로 좌표는 $\sin(\pi/6)=1/2$예요.`)),
        C('가로 좌표', P(R`피타고라스 정리로 $x^2=1-(1/2)^2=3/4$예요.`), P(R`제1사분면이므로 $x=\cos(\pi/6)=\sqrt3/2$예요.`)),
        C('좌표의 순서', '가로 좌표를 먼저, 세로 좌표를 뒤에 적어요.', P(R`단위원에서는 순서가 $(\cos\theta,\sin\theta)$예요.`)),
        stage(C('점의 좌표', P(R`따라서 $P=(\sqrt3/2,1/2)$예요.`), 'cos가 가로, sin이 세로라는 순서를 기억해요.'), 2)
      ], base(SC));

    concept('coords', '사분면부호', '길이와 삼각함수의 부호', 'cos는 음수, sin은 양수, tan은 음수',
      R`단위원의 점 P를 제2사분면의 $\theta=2\pi/3$으로 옮깁니다. 세 삼각함수의 부호를 좌표로 판단합니다.`, [
        C('제2사분면으로 이동', P(R`P를 $\theta=2\pi/3$까지 옮겨요.`), '원점의 왼쪽이면서 위쪽인 점이에요.', { theta: 2 * PI / 3 }),
        C('가로 방향의 부호', '가로 선분의 길이는 양수지만 좌표에는 방향이 있어요.', P(R`왼쪽이므로 $\cos\theta<0$이에요.`)),
        C('세로 방향의 부호', P(R`위쪽이므로 $\sin\theta>0$이에요.`), '양의 세로 좌표와 음의 가로 좌표를 구별해요.'),
        stage(C('탄젠트의 부호', P(R`$\tan\theta=\sin\theta/\cos\theta$예요.`), '양수를 음수로 나누면 음수예요.'), 3),
        C('세 함수의 부호', 'cos는 음수, sin은 양수, tan은 음수예요.', '선분의 길이에 부호를 붙이는 대신 좌표의 방향을 읽어요.')
      ], { ...base({ sin: true, cos: true, tan: true }), start: { theta: PI / 3, x0: -.25, x1: 2 * PI + .25 } });

    concept('coords', '접선과탄젠트', '접선 위에서 탄젠트 읽기', R`$\tan(\pi/4)=1$`,
      R`$\theta=\pi/4$인 동경과 직선 $x=1$의 교점을 T라 합니다. T의 높이를 닮음으로 구합니다.`, [
        C('동경의 각도', P(R`동경을 $\theta=\pi/4$까지 돌려요.`), '동경은 원점에서 점 P를 향하는 직선이에요.', { theta: PI / 4 }),
        C('단위원의 직각삼각형', P(R`P의 가로와 세로는 $\cos\theta,\sin\theta$예요.`), '원점과 수선의 발을 연결하면 직각삼각형이 보여요.'),
        stage(C('접선까지 늘리기', P(R`$x=1$까지 늘린 큰 삼각형의 밑변은 1이에요.`), P(R`닮음에서 T의 높이는 $\sin\theta/\cos\theta$예요.`)), 3),
        stage(C('같은 두 좌표', P(R`$\theta=\pi/4$에서는 $\sin\theta=\cos\theta\ne0$예요.`), '같은 양수를 나눈 값을 T의 높이로 읽어요.'), 3),
        C('접선 위의 높이', P(R`따라서 $\tan(\pi/4)=1$이에요.`), P(R`이 비는 $\cos\theta\ne0$일 때 정의돼요.`))
      ], base({ sin: true, cos: true, tan: true }));

    concept('wave', '사인곡선', '원의 높이가 사인곡선이 되기', R`$\sin(\theta+2\pi)=\sin\theta$`,
      R`단위원에서 P의 세로 좌표를 각도에 따라 기록합니다. 가로축은 각도, 세로축은 $\sin\theta$입니다.`, [
        stage(C('점의 높이를 기록', P(R`P를 0에서 $\pi/2$까지 올려요.`), '원의 높이를 그래프의 세로 좌표로 사용해요.', { theta: PI / 2 }), 1),
        set(stage(C('그래프의 점으로', P(R`$\theta=\pi/2$에서 그래프 높이는 1이에요.`), '원의 점 자체를 옮기는 것이 아니라 높이를 기록해요.'), 2), { view: 'graph' }),
        stage(C('반 바퀴까지 이동', P(R`각도를 $\pi$까지 늘리면 높이가 다시 0이에요.`), '그래프의 가로 좌표는 계속 오른쪽으로 증가해요.', { theta: PI }), 2),
        stage(C('한 바퀴의 나머지', P(R`$3\pi/2$에서 -1, $2\pi$에서 0이 돼요.`), '아래쪽 반원은 그래프의 음수인 부분에 대응해요.', { theta: 2 * PI }), 2),
        stage(C('한 바퀴마다 반복', P(R`$\sin(\theta+2\pi)=\sin\theta$예요.`), '한 바퀴 뒤 같은 높이로 돌아와 그래프가 반복돼요.'), 2)
      ], base({ sin: true, cos: false, tan: false }));

    concept('wave', '코사인곡선', '가로 좌표가 코사인곡선이 되기', R`$\cos(\theta+2\pi)=\cos\theta$`,
      R`단위원에서 P의 가로 좌표를 각도에 따라 기록합니다. 그래프의 높이는 $\cos\theta$입니다.`, [
        stage(C('가로 좌표의 변화', P(R`P를 0에서 $\pi/2$까지 돌려요.`), '가로 좌표는 1에서 0으로 줄어들어요.', { theta: PI / 2 }), 1),
        set(stage(C('좌표를 그래프 높이로', '단위원의 가로 좌표를 그래프에서는 높이로 그려요.', P(R`$\theta=0$에서 1, $\theta=\pi/2$에서 0이에요.`)), 2), { view: 'graph' }),
        stage(C('왼쪽 끝까지 이동', P(R`$\theta=\pi$에서는 가로 좌표가 -1이에요.`), '원의 왼쪽이 그래프의 음수 높이에 대응해요.', { theta: PI }), 2),
        stage(C('다시 오른쪽 끝으로', P(R`$3\pi/2$에서 0, $2\pi$에서 1로 돌아와요.`), '한 바퀴 동안 가로 좌표가 연속으로 바뀌었어요.', { theta: 2 * PI }), 2),
        stage(C('반복되는 가로 좌표', P(R`$\cos(\theta+2\pi)=\cos\theta$예요.`), '한 바퀴 뒤의 가로 좌표가 같아 그래프가 반복돼요.'), 2)
      ], base({ sin: false, cos: true, tan: false }));

    concept('wave', '탄젠트주기', '탄젠트의 끊김과 반복', R`$\tan(\theta+\pi)=\tan\theta$`,
      R`$\tan\theta=\sin\theta/\cos\theta$의 그래프를 봅니다. 정의되지 않는 각과 반복 간격을 구별합니다.`, [
        stage(C('접선 위 높이', P(R`각도를 0에서 $\pi/4$까지 옮겨요.`), '동경이 x=1과 만나는 높이를 기록해요.', { theta: PI / 4 }), 3),
        set(stage(C('분모가 영인 각', P(R`$\theta=\pi/2$에서는 $\cos\theta=0$이에요.`), '이 각에서는 탄젠트가 정의되지 않아 그래프가 끊겨요.', { theta: PI / 2 }), 3), { view: 'graph' }),
        stage(C('반 바퀴 뒤의 점', P(R`각도를 $5\pi/4$까지 옮겨요.`), P(R`$\sin,\cos$가 모두 음수여서 비는 다시 양수예요.`), { theta: 5 * PI / 4 }), 3),
        stage(C('두 부호가 함께 바뀜', P(R`$\theta+\pi$에서는 두 좌표가 모두 반대 부호예요.`), '분자와 분모의 -가 약분돼 비는 같아요.'), 3),
        C('탄젠트의 반복 간격', P(R`$\tan(\theta+\pi)=\tan\theta$예요.`), '단, 두 변의 탄젠트가 정의되는 각에서 비교해요.')
      ], base({ sin: false, cos: false, tan: true }));

    for (const [fn, label, k, kTex, a, aTex, other, answer] of [
      ['sin', '사인방정식', .5, '1/2', PI/6, R`\pi/6`, R`\pi-\theta_1`, R`$\theta=\pi/6,5\pi/6$`],
      ['cos', '코사인방정식', .5, '1/2', PI/3, R`\pi/3`, R`2\pi-\theta_1`, R`$\theta=\pi/3,5\pi/3$`],
      ['tan', '탄젠트방정식', 1, '1', PI/4, R`\pi/4`, R`\theta_1+\pi`, R`$\theta=\pi/4,5\pi/4$`]
    ]) {
      concept('equation', label, '단위원과 그래프에서 해 찾기', answer,
        `$0\\le\\theta\\lt2\\pi$에서 $\\${fn}\\theta=${kTex}$의 모든 해를 구합니다.`, [
          C('함수와 기준값', P(`$\\${fn}\\theta=${kTex}$인 점을 찾아요.`), '먼저 단위원에서 조건에 맞는 위치를 살펴봐요.', { theta: PI / 12 }),
          C('단위원의 조건', P(fn==='sin'?R`사인은 y좌표이므로 수평선 $y=1/2$를 그려요.`:fn==='cos'?R`코사인은 x좌표이므로 수직선 $x=1/2$를 그려요.`:R`탄젠트는 접선 위 $T(1,1)$을 지나는 동경이에요.`), '단위원과 만나는 두 방향을 구별해요.'),
          set(stage(C('첫 번째 각', P(`제1사분면의 각은 $\\theta_1=${aTex}$예요.`), '그래프에서는 이 각이 교점의 가로 좌표예요.'), 2), { view:'graph', revealedRoot:a }),
          C('다른 해의 위치', P(`다른 각은 $\\theta_2=${other}$예요.`), fn==='tan'?'반 바퀴 뒤의 동경에서도 같은 비를 얻어요.':'대칭인 점에서 같은 좌표값을 얻어요.'),
          C('정의역 안의 모든 해', P(`따라서 ${answer}예요.`), P(R`$2\pi$는 주어진 구간의 오른쪽 끝에서 제외해요.`))
        ], { ...base({sin:fn==='sin',cos:fn==='cos',tan:fn==='tan'}), start:{theta:0,k,x0:-.25,x1:2*PI+.25} });
    }

    concept('equation', '공통해', '두 함수의 해와 공통해 구별', R`$\theta=\pi/4$`,
      R`$0\le\theta\lt2\pi$에서 $\sin\theta=\sqrt2/2$와 $\cos\theta=\sqrt2/2$를 모두 만족하는 각을 찾습니다.`, [
        C('두 좌표의 조건', '단위원에서 가로와 세로 좌표를 함께 확인해요.', P(R`두 좌표 모두 양수인 $\sqrt2/2$예요.`), { theta:PI/12 }),
        C('각 조건의 해', '수평선은 사인의 조건, 수직선은 코사인의 조건이에요.', '각 조건의 두 점을 모두 합치는 문제와 구별해요.'),
        C('두 조건을 함께 만족', P(R`공통인 점은 $x=y$인 제1사분면의 점이에요.`), '한 점에서 두 좌표 조건이 동시에 맞아야 해요.'),
        set(C('같은 두 직각변', '직각삼각형의 가로·세로 길이가 같아요.', '밑각이 같은 직각이등변삼각형이 돼요.'), { common:true }),
        set(C('공통인 각', P(R`따라서 공통해는 $\theta=\pi/4$예요.`), '각 식의 해를 합친 집합과 공통인 해를 구별해요.'), { revealedRoot:PI/4 })
      ], { ...base(SC), start:{theta:0,k:Math.SQRT1_2,x0:-.25,x1:2*PI+.25} });

    concept('inequality', '사인부등식', '사인곡선 위쪽 구간 읽기', R`$\pi/6\lt\theta\lt5\pi/6$`,
      R`$0\le\theta\lt2\pi$에서 $\sin\theta>1/2$의 해를 구합니다.`, [
        C('기준선보다 높은 부분', P(R`그래프의 높이가 $y=1/2$보다 큰 구간을 찾아요.`), '먼저 등호일 때의 경계점을 확인해요.', { theta:PI/12 }),
        set(C('경계가 되는 두 각', P(R`$\sin\theta=1/2$인 각은 $\pi/6,5\pi/6$예요.`), '단위원에서는 수평선 위의 두 경계점이에요.'), { view:'circle' }),
        set(C('사이의 대표점 확인', P(R`$\theta=\pi/2$이면 $\sin\theta=1>1/2$예요.`), '두 경계 사이의 위쪽 호와 곡선을 선택해요.'), { view:'graph' }),
        C('경계점의 포함 여부', '부등호에 등호가 없으므로 두 경계는 포함하지 않아요.', '빈 원으로 표시된 양 끝을 확인해요.'),
        C('해 구간', P(R`따라서 $\pi/6\lt\theta\lt5\pi/6$예요.`), '색칠된 곡선 구간의 가로 좌표를 해로 읽어요.')
      ], { ...base({sin:true,cos:false,tan:false},'graph',{op:'gt'}), start:{theta:0,k:.5,x0:-.25,x1:2*PI+.25} });

    concept('inequality', '코사인부등식', '코사인의 닫힌 해 구간', R`$\pi/3\le\theta\le5\pi/3$`,
      R`$0\le\theta\lt2\pi$에서 $\cos\theta\le1/2$의 해를 구합니다.`, [
        C('기준선 이하의 구간', P(R`그래프가 $y=1/2$ 아래이거나 같은 곳을 찾아요.`), '등호가 포함된 부등식이에요.', { theta:PI/12 }),
        set(C('단위원의 가로 조건', P(R`단위원에서는 $x\le1/2$인 부분을 골라요.`), P(R`경계의 각은 $\pi/3,5\pi/3$예요.`)), { view:'circle' }),
        set(C('대표점으로 확인', P(R`$\theta=\pi$에서는 $\cos\theta=-1\le1/2$예요.`), '두 경계 사이의 큰 호가 조건을 만족해요.'), { view:'graph' }),
        C('닫힌 경계점', '등호가 있으므로 두 경계점도 해예요.', '채운 점은 경계가 포함된다는 뜻이에요.'),
        C('해 구간', P(R`따라서 $\pi/3\le\theta\le5\pi/3$예요.`), '양 끝을 포함하여 구간을 적어요.')
      ], { ...base({sin:false,cos:true,tan:false},'graph',{op:'le'}), start:{theta:0,k:.5,x0:-.25,x1:2*PI+.25} });

    concept('inequality', '탄젠트부등식', '점근선을 제외한 탄젠트 구간', R`$\theta\in(\pi/4,\pi/2)\cup(5\pi/4,3\pi/2)$`,
      R`$0\le\theta\lt2\pi$에서 $\tan\theta>1$의 해를 구합니다. 탄젠트가 정의되지 않는 각은 제외합니다.`, [
        C('높이 1보다 큰 부분', P(R`그래프가 $y=1$보다 위에 있는 구간을 찾아요.`), '끊어진 그래프의 각 가지를 따로 살펴봐요.', { theta:PI/12 }),
        C('등호와 점근선', P(R`등호가 되는 각은 $\pi/4,5\pi/4$예요.`), P(R`$\pi/2,3\pi/2$에서는 분모가 0이므로 제외해요.`)),
        C('첫 번째 가지', P(R`$\theta=\pi/3$에서는 $\tan\theta=\sqrt3>1$예요.`), '첫 등호점과 첫 점근선 사이의 구간을 선택해요.'),
        C('반 바퀴 뒤의 가지', '반 바퀴 뒤에도 같은 모양이 반복돼요.', '등호점과 점근선은 모두 빈 점으로 남겨요.'),
        C('두 구간의 합집합', P(R`$\theta\in(\pi/4,\pi/2)\cup(5\pi/4,3\pi/2)$예요.`), '점근선에서는 함수가 정의되지 않아 포함할 수 없어요.')
      ], { ...base({sin:false,cos:false,tan:true},'graph',{op:'gt'}), start:{theta:0,k:1,x0:-.25,x1:2*PI+.25} });
  });
})(window);
