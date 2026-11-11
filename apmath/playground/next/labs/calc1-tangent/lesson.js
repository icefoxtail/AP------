/* First-source lessons. Exploration models are named explicitly in concept questions.
   The HTML adapter owns fixed packets, native drawing, answer labels and manual state. */
(function (global) {
  'use strict';
  const P = (say) => ({ say, pin: true });
  const caption = (say) => typeof say === 'string' ? { say } : say;
  function chapter(title, first, second, move) {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  }
  global.APL_TANGENT_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some((scene) => scene.id === id)) throw new Error('Missing tangent scene: ' + id);
        const concept = !!options.concept, first = chapters[0];
        first.start = {
          a: 1, dx: 1.8, slopeR: 2, gapH: 0, tp: 1.5,
          lo: 0.5, hi: 2, bx: 3.5, by: 3.5,
          ctTrace: 0, ctH: 0.12, ctT: 1.6, ...options.start
        };
        chapters.forEach((ch, i) => { ch.cues[0].step = i === 0 ? 0 : i === chapters.length - 1 ? 3 : Math.min(i, 2); });
        first.cues[0].set = {
          ctQuestion: concept ? options.question : source.question(id),
          ctConcept: concept, ctExplore: concept, ctTarget: options.target || '',
          ctShowAnswer: false, dual: false, ub: options.ub || 'both'
        };
        first.cues.splice(1, 0, { at: 0.1, to: { ctTrace: 1 }, dur: 4 });
        chapters[chapters.length - 1].cues[0].set = { ctShowAnswer: true };
        const item = {
          label, title, tab: 'review', answer,
          answerText: options.answerText || answer,
          summary: options.summary || '조건과 결론을 원래 식에서 확인해요.',
          task: options.task || '직접 해 보기에서 같은 관계를 확인해 보세요.',
          chapters
        };
        (lessons[id] || (lessons[id] = [])).push(item);
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      const C = chapter;
      const cubic = '$f(x)=\\frac12x^3-\\frac32x+1$';

      concept('secant', '평균변화율', '두 변화량으로 읽는 기울기', '$m=\\frac{\\Delta y}{\\Delta x}$',
        cubic + '에서 두 점 A, B를 잇는 할선의 기울기는 두 변화량과 어떤 관계일까요?', [
          C('두 점을 잇기', '고정된 A에서 B를 옮겨 보아요.', '두 점을 잇는 직선을 할선이라 해요.', { dx: 2 }),
          C('가로 변화량', '오른쪽 좌표에서 왼쪽 좌표를 빼요.', P('$\\Delta x=3-1=2$예요.')),
          C('세로 변화량', P('$f(1)=0$, $f(3)=10$이에요.'), P('$\\Delta y=10-0=10$이에요.')),
          C('기울기의 역할', '가로로 한 칸 갈 때 높이가 얼마나 변할까요?', P('$m\\cdot\\Delta x=\\Delta y$를 이용해요.')),
          C('평균변화율', P('$m=\\frac{\\Delta y}{\\Delta x}$가 평균변화율이에요.'), '이 두 점에서는 가로 2칸에 세로 10칸 변해요.')
        ], { start: { a: 1, dx: 1.2 }, summary: '평균변화율은 두 점을 잇는 할선의 기울기예요.' });

      concept('secant', '미분계수', '할선이 접선으로 가까워질 때',
        '$f^{\\prime}(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}h$',
        cubic + '에서 A의 x좌표를 2로 고정하고 B를 A에 가까이 보내면 무엇이 같아질까요?', [
          C('기준점을 고정하기', 'A는 그대로 두고 B를 가까이 보내요.', '움직이는 B와 A 사이의 할선을 보아요.', { dx: 0.3 }),
          C('오른쪽에서 접근', '가로 간격을 양수인 채 줄여요.', '할선이 A에서의 접선에 가까워져요.', { dx: 0.05 }),
          C('반대쪽에서도 비교', 'B를 A의 왼쪽에도 놓아 보아요.', 'A와 겹치는 순간에는 할선이 정해지지 않아요.', { dx: -0.05 }),
          C('대입과 극한 구별', P('$h=0$인 차분몫은 정의되지 않아요.'), P('$h\\ne0$인 비를 보며 0으로 가까이 보내요.'), { dx: -0.02 }),
          C('미분계수의 뜻', P('$f^{\\prime}(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}h$예요.'), P('이 함수는 $f^{\\prime}(2)=\\frac92$예요.'))
        ], { start: { a: 2, dx: 0.8 }, summary: '미분계수는 한 점에서의 접선 기울기예요.' });

      add('secant', '평균 예제', '구간에서 평균변화율 구하기', '$5$', [
        C('주어진 구간', '첫 원문의 구간은 1에서 3까지예요.', '두 끝점을 잇는 할선에 집중해요.'),
        C('끝점의 함숫값', P('$f(1)=\\frac12-\\frac32+1=0$이에요.'), P('$f(3)=\\frac{27}{2}-\\frac92+1=10$이에요.')),
        C('변화량 구분', P('$\\Delta y=f(3)-f(1)=10$이에요.'), P('$\\Delta x=3-1=2$예요.')),
        C('비로 나타내기', '높이 변화량을 가로 변화량으로 나누어요.', P('$\\frac{f(3)-f(1)}{3-1}=\\frac{10}{2}$예요.')),
        C('평균변화율 확인', P('평균변화율은 $5$예요.'), '한 점의 접선 기울기와 구별해요.')
      ], { target: 'average', summary: '두 끝점의 변화량을 나누면 할선 기울기예요.' });

      add('secant', '극한 예제', '분모와 실제 가로 간격 비교', '$\\frac{45}{2}$', [
        C('두 점의 위치', P('두 점은 $2+3h$, $2-2h$에 있어요.'), '두 점 모두 x가 2인 곳으로 가까워져요.'),
        C('실제 가로 간격', P('간격은 $(2+3h)-(2-2h)=5h$예요.'), '분모 h와 실제 간격을 구별해요.'),
        C('움직이는 할선', '가로 간격을 줄이며 할선을 보아요.', P('주어진 비는 할선 기울기의 $5$배예요.'), { ctH: 0.04 }),
        C('미분계수로 연결', P('$3\\frac{f(2+3h)-f(2)}{3h}$를 먼저 보아요.'), P('$2\\frac{f(2-2h)-f(2)}{-2h}$를 더해요.'), { ctH: 0.01 }),
        C('접선의 기울기', P('$f^{\\prime}(x)=\\frac32x^2-\\frac32$예요.'), P('$f^{\\prime}(2)=\\frac92$를 얻어요.')),
        C('극한값 계산', P('$5\\cdot\\frac92=\\frac{45}{2}$예요.'), P('계수의 차 $3-(-2)$를 곱했는지 확인해요.'))
      ], { target: 'limit', summary: '분모 h 대신 실제 가로 간격을 먼저 확인해요.' });

      concept('mvt', '평균값정리', '할선과 평행한 접선 찾기',
        '$f^{\\prime}(c)=\\frac{f(b)-f(a)}{b-a}$',
        cubic + '가 닫힌구간에서 연속이고 내부에서 미분가능하면 할선과 평행한 접선은 어디에 있을까요?', [
          C('할선의 변화', '오른쪽 끝점을 움직여 할선을 비교해요.', '곡선에는 끊어짐이나 꺾임이 없어요.', { dx: 2 }),
          C('필요한 조건', P('$[a,b]$에서 연속인지 먼저 확인해요.'), P('$(a,b)$에서 미분가능해야 해요.')),
          C('평행한 접선', '할선과 접선의 기울기를 비교해요.', '조건을 만족하는 접점은 하나 이상 있어요.'),
          C('열린구간 확인', '끝점을 바꾸면 후보의 위치도 달라져요.', P('구간의 끝점은 $c$의 답에 포함하지 않아요.'), { dx: 3 }),
          C('평균값 정리', P('$f^{\\prime}(c)=\\frac{f(b)-f(a)}{b-a}$예요.'), P('조건을 만족하는 $c$는 $(a,b)$ 안에 있어요.'))
        ], { start: { a: -1, dx: 1.8 }, summary: '평행한 접점은 구간 내부에서 찾아요.' });

      add('mvt', '원문 예제', '평균값 정리의 후보 고르기', '$c=1$', [
        C('정리의 조건', '첫 원문은 구간이 -1에서 2까지예요.', '다항함수이므로 연속·미분가능 조건을 만족해요.'),
        C('할선의 기울기', P('$f(-1)=2$, $f(2)=2$예요.'), P('$\\frac{f(2)-f(-1)}{2-(-1)}=0$이에요.')),
        C('후보 방정식', P('$f^{\\prime}(c)=\\frac32c^2-\\frac32=0$이에요.'), P('$c^2=1$에서 두 후보가 생겨요.')),
        C('끝점 제외', P('후보는 $c=-1,\\ 1$이에요.'), P('$-1$은 열린구간의 끝점이므로 제외해요.')),
        C('구간 안의 답', P('따라서 $c=1$이에요.'), '이 점에서의 접선은 할선과 평행해요.')
      ], { target: 'mvt', summary: '방정식의 해 중 열린구간 안의 값만 골라요.' });

      concept('cusp', '불연속', '높이가 다른 두 조각', '미분가능하지 않음',
        '왼쪽은 $x^2$, 오른쪽은 $2(x-1)+1+\\Delta h$입니다. 높이 차가 남아 있으면 x=1에서 미분가능할까요?', [
          C('높이 차 관찰', '오른쪽 조각의 높이를 바꾸어 보아요.', '경계의 두 높이가 아직 다르게 보여요.', { gapH: 0.6 }),
          C('경계의 두 값', '높이 차를 다시 키워 비교해요.', P('좌극한은 $1$, 함숫값은 $\\frac{11}{5}$예요.'), { gapH: 1.2 }),
          C('연속부터 확인', '좌극한과 경계의 함숫값이 같지 않아요.', '연속 조건이 먼저 충족되어야 해요.'),
          C('기울기와 구별', '왼쪽 조각의 기울기와 좌미분계수는 달라요.', P('차분몫에는 높이 차를 나눈 $-\\frac{6}{5h}$도 있어요.')),
          C('불연속의 결론', '이 상태는 **미분가능하지 않음**으로 판정해요.', '조각의 기울기만 같게 해서는 해결되지 않아요.')
        ], { start: { slopeR: 2, gapH: 1.2 }, summary: '미분가능하려면 먼저 경계에서 연속이어야 해요.' });

      concept('cusp', '꺾인 점', '이어져도 꺾일 수 있어요', '미분가능하지 않음',
        '왼쪽은 $x^2$, 오른쪽은 $p(x-1)+1$입니다. 경계가 이어져도 기울기가 다르면 어떻게 될까요?', [
          C('이어진 두 조각', '높이 차는 0으로 두고 기울기만 바꾸어요.', '두 조각은 계속 같은 점에서 만나요.', { slopeR: -1 }),
          C('연속인 경계', P('좌극한과 함숫값은 모두 $1$이에요.'), '끊어지지 않으므로 연속 조건은 만족해요.'),
          C('왼쪽 기울기', P('왼쪽 식의 도함수는 $2x$예요.'), P('경계에서 왼쪽 기울기는 $2$예요.')),
          C('오른쪽 기울기', P('오른쪽 직선의 기울기는 $-1$이에요.'), '한 점에서 접선 방향이 둘로 달라져요.'),
          C('꺾인 점의 결론', '이 상태는 **미분가능하지 않음**으로 판정해요.', '연속이라는 조건만으로 충분하지 않아요.')
        ], { start: { slopeR: 0.5, gapH: 0 }, summary: '연속이어도 좌·우미분계수가 다르면 미분불가예요.' });

      concept('cusp', '미분가능', '두 조건을 함께 맞추기', '연속이고 좌우 기울기가 같음',
        '왼쪽 $x^2$와 오른쪽 $p(x-1)+1+\\Delta h$가 매끄럽게 이어지려면 어떤 조건 두 개가 필요할까요?', [
          C('높이부터 맞추기', '기울기를 고정하고 높이 차를 줄여요.', '높이 차가 없어지면 두 조각이 이어져요.', { gapH: 0 }),
          C('첫 번째 조건', P('$\\Delta h=0$이면 경계에서 연속이에요.'), '아직 두 접선의 방향은 같지 않을 수 있어요.'),
          C('기울기 맞추기', '이제 오른쪽 기울기를 왼쪽에 맞추어요.', '접선의 방향이 하나로 일치하는지 보아요.', { slopeR: 2 }),
          C('두 조건 확인', P('경계의 함숫값이 $1$로 같아요.'), P('왼쪽과 오른쪽의 기울기도 모두 $2$예요.')),
          C('미분가능한 접합', '**연속이고 좌우 기울기가 같음**이 핵심이에요.', '두 조건을 함께 만족하므로 미분가능해요.')
        ], { start: { slopeR: -1, gapH: 1 }, summary: '함숫값과 미분계수를 각각 맞추어요.' });

      add('cusp', '원문 예제', '미정계수 두 개를 결정하기', '$p=2,\\ q=-1$', [
        C('경계의 두 식', P('왼쪽은 $x^2$, 오른쪽은 $px+q$예요.'), 'x가 1인 경계에서 두 조건을 세워요.'),
        C('연속 조건', P('왼쪽에서의 극한은 $1$이에요.'), P('오른쪽 함숫값과 같으므로 $p+q=1$이에요.')),
        C('미분계수 조건', P('왼쪽의 미분계수는 $2$예요.'), P('오른쪽의 미분계수는 $p$예요.')),
        C('두 조건 연립', '같은 높이와 같은 기울기를 함께 맞추어요.', '기울기로 p를 정한 뒤 연속 식에 넣어요.'),
        C('미정계수의 값', P('$p=2,\\ q=-1$이에요.'), P('$p+q=1$과 양쪽 기울기를 검산해요.'))
      ], { target: 'pair', summary: '연속 조건과 미분계수 조건을 함께 풀어요.' });

      return lessons;
    }
  };
})(window);
