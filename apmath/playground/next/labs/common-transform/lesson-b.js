/* Original reflection-path and composition inquiries, with fixed first problems. */
(function (global) {
  'use strict';
  (global.APL_CT_LESSON_BUILDERS = global.APL_CT_LESSON_BUILDERS || []).push(function (api) {
    const { add, concept, C, P } = api;
    const mark = (chapter, part, set) => {
      chapter.cues[0].part = part;
      if (set) chapter.cues[0].set = set;
      return chapter;
    };

    concept('shortest', '반사로펴기', '꺾인 경로를 직선으로', '$A^{\\prime},P,B\\text{가 이 순서로 일직선}$',
      'x축의 같은 쪽에 있는 A(2,1), B(6,2)에서 P를 x축 위로 움직이면 AP+PB는 언제 가장 짧을까요?', [
        C('거울 위의 점 움직이기', P('$A(2,1),\\ B(6,2)$는 x축의 같은 쪽에 있어요.'), 'P를 x축 위에서 옮기며 두 선분의 길이를 비교해요.', { pp: 1.5 }),
        mark(C('한 끝점을 반사', P('A를 x축에 대칭이동하면 $A^{\\prime}(2,-1)$이에요.'), 'P는 거울 위에 있으므로 A와 대칭점까지의 거리가 같아요.'), 'ap', { lctStage: 1 }),
        mark(C('거리 보존으로 바꾸기', P('$AP=A^{\\prime}P$이므로 합은 $A^{\\prime}P+PB$예요.'), '원래 경로와 반사한 경로의 총길이는 같아요.'), 'ap'),
        mark(C('두 선분을 펴기', P('$A^{\\prime}P+PB\\ge A^{\\prime}B$를 사용해요.'), '두 선분이 한 선분이 되는 곳으로 P를 옮겨요.', { pp: 10 / 3 }), 'min', { lctStage: 2 }),
        mark(C('등호 조건의 결론', P('$A^{\\prime},P,B$가 이 순서로 일직선일 때 가장 짧아요.'), '두 끝점이 같은 쪽이라 이 선분은 거울을 지나가요.'), 'min')
      ], { set: { mode: 'pt', mir: 'x', lctStage: 0 }, start: { pp: 0.5, qq: 4 }, summary: '같은 쪽의 한 점을 반사해 두 선분을 한 선분으로 펴요.' });

    concept('shortest', '원까지거리', '중심까지 거리에서 반지름', '$\\min(AP+PQ)=4$',
      'A(2,1), 중심 C(5,3)·반지름 1인 원과 x축 위의 P에서, 원 위의 Q까지 가는 AP+PQ는 언제 최소일까요?', [
        C('점에서 원으로 가기', P('원의 중심은 $C(5,3)$이고 반지름은 $1$이에요.'), 'P를 옮기면 원 위의 가까운 점 Q도 함께 바뀌어요.', { pp: 1.5 }),
        mark(C('원 밖이라는 조건', P('P가 x축 위이므로 $PC\\ge3\\gt1$이에요.'), P('따라서 가까운 점까지의 거리는 $PQ=PC-1$이에요.')), 'pb'),
        mark(C('첫 거리를 반사', P('A의 대칭점은 $A^{\\prime}(2,-1)$이에요.'), P('$AP+PQ=A^{\\prime}P+PC-1$로 바꿔요.')), 'ap', { lctStage: 1 }),
        mark(C('중심까지 곧게 잇기', P('$A^{\\prime}P+PC-1\\ge A^{\\prime}C-1$이에요.'), '원 전체가 거울의 한쪽에 있어 이 직선 경로가 가능해요.'), 'min', { lctStage: 2 }),
        mark(C('등호가 되는 위치', '대칭점과 중심을 이은 선분 위로 P를 옮겨요.', P('$A^{\\prime},P,Q,C$가 이 순서로 놓이는지 확인해요.'), { pp: 11 / 4 }), 'min'),
        mark(C('최솟값의 결론', P('$A^{\\prime}C=\\sqrt{3^2+4^2}=5$예요.'), P('따라서 최솟값은 $5-1=4$예요.')), 'min')
      ], { set: { mode: 'circ', mir: 'x', lctStage: 0 }, start: { pp: 0.5, qq: 4 }, summary: 'P가 원 밖인지 확인한 뒤 반사점과 중심 거리에서 반지름을 빼요.' });

    concept('shortest', '두거울순서', '둘레를 한 선분으로 펴기', '$\\min(AP+PQ+QA)=10$',
      'A(7,1), x축 위의 P, y=x 위의 Q가 만드는 삼각형의 둘레를 어떻게 최소로 만들까요?', [
        C('두 거울 위의 꼭짓점', P('$A(7,1)$이고 P는 x축, Q는 y=x 위에 있어요.'), '세 점이 삼각형을 이루는 상태에서 둘레를 비교해요.'),
        mark(C('A를 각각 반사하기', P('x축 대칭점은 $A_x(7,-1)$이에요.'), P('A를 y=x에 따로 대칭하면 $A_d(1,7)$이에요.')), 'ap', { lctStage: 1 }),
        C('두 끝의 거리 바꾸기', P('$AP=A_xP,\\ AQ=A_dQ$예요.'), P('둘레는 $A_xP+PQ+QA_d$와 같아요.')),
        mark(C('순서까지 확인', P('$A_xP+PQ+QA_d\\ge A_xA_d$예요.'), '이 선분이 x축을 먼저, y=x를 나중에 지나는지 보아요.'), 'min', { lctStage: 2 }),
        mark(C('두 꼭짓점을 옮기기', P('$P\\left(\\dfrac{25}4,0\\right),\\ Q\\left(\\dfrac{25}7,\\dfrac{25}7\\right)$로 옮겨요.'), P('$A_x,P,Q,A_d$의 순서와 삼각형이 되는 조건을 확인해요.'), { pp: 25 / 4, qq: 25 / 7 }), 'min'),
        mark(C('둘레의 결론', P('$A_xA_d=\\sqrt{6^2+8^2}=10$이에요.'), '지정된 순서로 한 선분 위에 놓이므로 최솟값에 도달해요.'), 'min')
      ], { set: { mode: 'tri', mir: 'x', lctStage: 0 }, start: { pp: 3, qq: 4 }, summary: '각 거울에 따로 반사하고 두 교점의 통과 순서까지 확인해요.' });

    concept('shortest', '반대쪽조건', '반대쪽 점은 직접 잇기', '$\\min(AP+PB)=AB=5$',
      'A(2,1), B(6,-2)가 x축의 반대쪽에 있다면, x축 위의 P를 지나는 최단 경로도 반사해야 할까요?', [
        C('반대쪽에 있는 두 점', P('이번에는 $A(2,1),\\ B(6,-2)$예요.'), '두 점을 잇는 선분이 이미 x축을 가로질러요.', { pp: 1.5 }),
        C('원래 두 점을 사용', P('삼각부등식으로 $AP+PB\\ge AB$예요.'), 'A와 B를 직접 잇는 길이가 가능한 경로인지 확인해요.'),
        C('거울과 만나는 위치', P('선분 위의 점은 $(2+4t,1-3t)$로 쓸 수 있어요.'), P('x축에서는 $1-3t=0$이므로 $t=\\dfrac13$이에요.')),
        C('교점으로 옮기기', 'P를 선분 AB와 x축의 교점으로 옮겨요.', 'A에서 P를 거쳐 B까지 되돌아가지 않고 곧게 나아가요.', { pp: 10 / 3 }),
        C('직선 경로의 결론', P('$AP+PB=AB=\\sqrt{4^2+3^2}=5$예요.'), '반사 방법을 쓰기 전에 두 점이 거울의 어느 쪽인지 보아요.')
      ], { set: { mode: 'pt', mir: 'x', lctMode: 'opposite', lctStage: 0 }, start: { pp: 0.5, qq: 4 }, summary: '두 끝점이 반대쪽이면 원래 두 점을 잇는 선분이 최단이에요.' });

    add('shortest', '원문풀이', 'x축을 거치는 길이의 최솟값', '$5$', [
      C('처음 원문의 조건', P('$A(2,1),\\ B(6,2)$이고 P는 x축 위예요.'), '구할 것은 두 선분 AP와 PB의 길이 합의 최솟값이에요.'),
      C('A를 x축에 반사', P('$A^{\\prime}(2,-1)$로 두면 $AP=A^{\\prime}P$예요.'), '두 점이 x축의 같은 쪽에 있으므로 한 점을 반사해요.'),
      C('직선거리와 비교', P('$AP+PB=A^{\\prime}P+PB\\ge A^{\\prime}B$예요.'), P('$A^{\\prime},P,B$가 한 선분 위에 있을 때 등호가 돼요.')),
      C('거리의 제곱 계산', P('가로 차이는 $6-2=4$, 세로 차이는 $2-(-1)=3$이에요.'), P('따라서 $(A^{\\prime}B)^2=4^2+3^2=25$예요.')),
      C('최솟값의 결론', P('길이는 양수이므로 최솟값은 $\\sqrt{25}=5$예요.'), '반사점과 B를 이은 선분이 x축을 지나므로 실제로 도달해요.')
    ], { summary: '한 점을 x축에 반사하고 두 점 사이의 거리를 계산해요.' });
  });
})(window);
