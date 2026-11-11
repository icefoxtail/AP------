/* 삼각형·사각형 넓이와 입체·결합도형: 원본 문항의 정확한 값으로 재생. */
(function () {
  'use strict';
  const G = window.APL_TG;
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g9-trig-ratio'] = all['g9-trig-ratio'] || {};
  const scenes = (window.APL_TG_GROUPS || []).flatMap(group => group.scenes);
  const source = id => scenes.find(scene => scene.id === id).tg;
  const fixed = (id, accept = () => true) => G.fixedQuestion(id, 1, accept);
  const text = value => '$' + G.vtex(value) + '$';
  const value = q => q.choices.find(choice => choice.ok).t;
  const result = (q, symbol) => `$${symbol}=${value(q)}$`;
  const ending = (q, symbol) => `따라서 ${result(q, symbol)}예요.`;
  const cue = (at, say, step) => ({ at, say, ...(step == null ? {} : { step }) });
  const ch = (title, a, b, sa = 2, sb = 3) => ({ title, length: 12, cues: [cue(0, a, sa), cue(6, b, sb)] });
  const defaults = { tgCTrace: 0, tgYaw: -32, tgPitch: 22,
    t61b: 6, t61c: 8, t61a: 60, t62a: 120, t63a: 6, t64s: 12, t64c: 6, t64a: 60, t65a: 60, t66n: 6, t66r: 6,
    t71p: 8, t71q: 6, t71t: 60, t71k: 0, t71x: .5, t72a: 8, t72b: 5, t72t: 60, t73a: 6, t74p: 8, t74a: 6, t74c: 4, t74b: 60, t74d: 45,
    t81a: 6, t82a: 4, t82b: 4, t82c: 7, t83l: 8, t83t: 60, t84a: 6, t85s: 6, t85u: 3, t85f: 3, t86w: 6, t86k: 0 };
  function make(id, q, label, title, symbol, chapters, options = {}) {
    chapters[0].start = { ...defaults, ...(options.start || {}) };
    const first = chapters[0].cues[0], last = chapters.at(-1).cues.at(-1);
    first.set = { q, tgSeed: 0, tgLessonProblem: !options.concept, tgShowAnswer: false,
      tgCalculationReady: false, tgCQuestion: options.question || '', tgCMode: options.mode || '' };
    delete first.step;
    if (!first.to) Object.assign(first, { to: { tgCTrace: 1 }, dur: 4 });
    chapters.at(-1).cues[0].set = { tgCalculationReady: true };
    last.set = { tgShowAnswer: true, tgCalculationReady: true };
    last.step = q.solution.steps.length;
    const answer = options.answer || result(q, symbol);
    return { label, title, tab: 'review', answer, answerText: answer,
      summary: '직각삼각형과 넓이의 관계로 구하는 값을 계산해요',
      task: '직접 해 보기에서 조건을 바꾸고 같은 전략을 적용해 보세요', chapters };
  }
  const concept = (id, q, label, title, answer, chapters, question, options = {}) => make(id, q, label, title, '', chapters,
    { ...options, concept: true, answer, question });

  for (const [id, obtuse] of [['areaAcute', false], ['areaObtuse', true]]) {
    const q = fixed(id), f = q.fig, w = obtuse ? 180 - f.A : f.A;
    lessons[id] = [
      concept(id, q, '넓이 원리', '높이를 삼각비로 바꾸기', obtuse ? '$S=bc\\sin(180^\\circ-A)/2$' : '$S=bc\\sin A/2$', [
        ch('두 변과 끼인각 확인', 'AC를 b, AB를 c라 해요. A는 두 변 사이의 각이에요.', 'C에서 직선 AB에 수선 CH를 내려 높이를 만들어요.', 0, 1),
        ch('높이와 사인의 관계', obtuse ? '수선의 발 H는 연장선 위에 있고 바깥각은 180°−A예요.' : '직각삼각형 ACH에서 A의 대변이 높이 CH예요.', obtuse ? 'sin(180°−A)=CH/b이므로 높이를 나타낼 수 있어요.' : 'sin A=CH/b이므로 빗변 b에 sin A를 곱해요.'),
        ch('밑변과 높이로 넓이', '삼각형의 넓이는 AB×CH÷2예요.', obtuse ? '따라서 $S=bc\\sin(180^\\circ-A)/2$예요.' : '따라서 $S=bc\\sin A/2$예요.', 4, 5)
      ], '그림의 두 변과 끼인각으로 삼각형의 넓이를 나타내는 식을 설명해 보세요.'),
      make(id, q, '넓이 계산', obtuse ? '둔각삼각형의 넓이 계산' : '예각삼각형의 넓이 계산', 'S', [
        ch('길이와 각을 그림에 연결', `AB=${f.c0}, AC=${f.b0}, A=${f.A}°예요.`, 'C에서 직선 AB에 내린 수선 CH가 높이예요.', 0, 1),
        ch('높이를 먼저 구하기', obtuse ? `바깥각은 180°−${f.A}°=${w}°예요.` : `높이는 ${f.b0}sin ${w}°예요.`, `$CH=${f.b0}\\times${G.vtex(G.sinD(w))}=${G.vtex(G.vmul(G.vi(f.b0), G.sinD(w)))}$예요.`),
        ch('삼각형의 넓이 계산', `$S=\\frac12\\times${f.c0}\\times${G.vtex(G.vmul(G.vi(f.b0), G.sinD(w)))}$예요.`, ending(q, 'S'), 4, 5)
      ])
    ];
  }
  {
    const id = 'equilFormula', qs = Object.fromEntries(['h', 'S', 'a'].map(kind => [kind, fixed(id, q => q.fig.kind === kind)]));
    lessons[id] = [
      concept(id, qs.h, '높이 원리', '정삼각형의 높이 구하는 법', '$h=\\frac{\\sqrt3}{2}a$', [
        ch('정삼각형에 수선 긋기', '한 변을 a, 꼭짓점 A에서 내린 높이를 h라 해요.', '정삼각형의 각은 60°이고 수선은 직각을 만들어요.', 0, 1),
        ch('빗변과 대변 고르기', '밑각 60°에서 빗변은 a, 대변은 높이 h예요.', '$\\sin60^\\circ=h/a$이고 사인의 값은 $\\sqrt3/2$예요.'),
        ch('높이의 식 정리', '양변에 빗변 a를 곱해 높이를 나타내요.', '따라서 $h=\\frac{\\sqrt3}{2}a$예요.', 4, 5)
      ], '한 변이 a인 정삼각형에서 높이 h를 나타내는 식을 설명해 보세요.'),
      concept(id, qs.S, '넓이 원리', '정삼각형의 넓이 구하는 법', '$S=\\frac{\\sqrt3}{4}a^2$', [
        ch('밑변과 높이를 구별', '밑변은 한 변 a이고 높이는 수선의 길이예요.', '60° 직각삼각형에서 높이는 $\\sqrt3a/2$예요.', 0, 1),
        ch('삼각형의 넓이식', '넓이는 밑변 a와 높이의 곱을 2로 나눈 값이에요.', '$S=\\frac12\\times a\\times\\frac{\\sqrt3}{2}a$로 나타내요.'),
        ch('곱을 정리하기', '두 번 곱한 a는 제곱이고 분모의 2도 두 번 곱해요.', '따라서 $S=\\frac{\\sqrt3}{4}a^2$예요.', 4, 5)
      ], '한 변이 a인 정삼각형에서 넓이 S를 나타내는 식을 설명해 보세요.'),
      ...['h', 'S', 'a'].map(kind => {
        const q = qs[kind], f = q.fig, symbol = kind === 'a' ? 'x' : kind;
        return make(id, q, { h: '높이 계산', S: '넓이 계산', a: '한 변 역산' }[kind], '정삼각형의 주어진 값 활용', symbol, [
          ch('구할 길이와 넓이 구별', kind === 'a' ? `주어진 넓이는 $${f.work.S}$이고 한 변이 x예요.` : `한 변은 $${f.work.a}$이고 ${kind === 'h' ? '높이' : '넓이'}를 구해요.`, '꼭짓점에서 수선을 내려 60° 직각삼각형을 만들어요.', 0, 1),
          ch('높이와 넓이의 식 선택', kind === 'h' ? '$\\sin60^\\circ=h/a$를 이용해요.' : '$S=\\frac{\\sqrt3}{4}a^2$를 이용해요.', kind === 'a' ? `$${f.work.S}=\\frac{\\sqrt3}{4}x^2$에요.` : kind === 'h' ? `높이는 $${f.work.a}\\times\\frac{\\sqrt3}{2}$예요.` : `높이는 $${f.work.h}$이므로 밑변과 곱해요.`),
          ch('마지막 계산과 단위 확인', kind === 'a' ? 'x의 제곱을 구한 뒤 길이이므로 양의 제곱근을 택해요.' : kind === 'h' ? '지금은 수선의 길이를 묻고 있어요.' : `$S=\\frac12\\times${f.work.a}\\times${f.work.h}$예요.`, ending(q, symbol), 4, 5)
        ]);
      })
    ];
  }
  {
    const id = 'r6-1', acute = fixed(id, q => q.fig.A < 90), obtuse = fixed(id, q => q.fig.A > 90);
    lessons[id] = [
      concept(id, acute, '역산 원리', '넓이로 모르는 변 구하기', '$b=\\frac{2S}{c\\sin A}$', [
        ch('주어진 넓이와 변', '삼각형의 넓이를 S, 주어진 변 AB를 c라 해요.', 'AC를 b라 놓고 두 변 사이의 각 A를 확인해요.', 0, 1),
        ch('넓이식에 조건 넣기', '$S=\\frac12bc\\sin A$로 관계를 세워요.', '양변에 2를 곱하면 모르는 변 b에 곱해진 양이 보여요.'),
        ch('모르는 변만 남기기', '양변을 c와 sin A의 곱으로 나누어요.', '따라서 $b=\\frac{2S}{c\\sin A}$예요.', 4, 5)
      ], '삼각형의 넓이, 한 변, 끼인각으로 다른 변을 구하는 식을 설명해 보세요.'),
      ...[[acute, '예각 역산'], [obtuse, '둔각 역산']].map(([q, label]) => {
        const f = q.fig, w = Math.min(f.A, 180 - f.A);
        return make(id, q, label, '넓이식을 거꾸로 풀기', 'x', [
          ch('넓이와 변의 조건', `넓이는 $${f.S}$, AB=${f.c0}, A=${f.A}°예요.`, '구하는 AC를 x라 해요. 넓이식에서 찾을 변이에요.', 0, 1),
          ch('삼각비와 넓이식 연결', f.A > 90 ? `바깥각 ${w}°의 sin을 사용해 높이를 구해요.` : `두 변의 끼인각 ${w}°의 sin을 사용해요.`, `$${f.S}=\\frac12\\times${f.c0}\\times x\\times${G.vtex(G.sinD(w))}$예요.`),
          ch('변의 길이 계산', `$x=\\frac{2\\times${f.S}}{${f.c0}\\times${G.vtex(G.sinD(w))}}$로 계산해요.`, ending(q, 'x'), 4, 5)
        ]);
      })
    ];
  }
  {
    const id = 'angleBisectLen', q = fixed(id), f = q.fig, half = f.A / 2;
    lessons[id] = [
      concept(id, q, '넓이의 합', '이등분선을 넓이로 구하기', '$bc\\sin A=(b+c)x\\sin(A/2)$', [
        ch('이등분선이 만드는 두 각', 'AC를 b, AB를 c, 이등분선 AD를 x라 해요.', 'AD가 각 A를 나누므로 두 작은 각은 모두 A/2예요.', 0, 1),
        ch('전체와 작은 넓이 비교', '전체 넓이는 두 변 b, c와 끼인각 A로 구해요.', '작은 두 삼각형은 공통변 x와 절반인 각을 사용해요.'),
        ch('두 넓이식 정리', '$\\frac12bc\\sin A=\\frac12cx\\sin(A/2)+\\frac12bx\\sin(A/2)$예요.', '따라서 $bc\\sin A=(b+c)x\\sin(A/2)$예요.', 4, 5)
      ], '각의 이등분선 AD의 길이를 전체 넓이와 두 작은 넓이의 합으로 연결해 보세요.'),
      make(id, q, 'AD 계산', '이등분선 길이 계산', 'x', [
        ch('같이 나뉘는 각 확인', `AB=${f.c0}, AC=${f.b0}, A=${f.A}°예요.`, `AD=x이고 두 작은 끼인각은 ${half}°씩이에요.`, 0, 1),
        ch('전체 삼각형의 넓이', `$S=\\frac12\\times${f.b0}\\times${f.c0}\\sin${f.A}^\\circ$예요.`, '이 넓이는 ABD와 ACD의 넓이의 합과 같아요.', 2, 2),
        ch('두 작은 넓이 더하기', `$S=\\frac12(${f.b0}+${f.c0})x\\sin${half}^\\circ$예요.`, '두 식을 같게 두고 공통으로 곱해진 1/2를 없애요.', 3, 4),
        ch('이등분선의 길이 결론', `$x=\\frac{${f.b0}\\times${f.c0}\\times${G.vtex(G.sinD(f.A))}}{(${f.b0}+${f.c0})\\times${G.vtex(G.sinD(half))}}$예요.`, ending(q, 'x'), 4, 5)
      ])
    ];
  }
  {
    const id = 'regPolygonArea', qs = [6, 8, 12].map(n => fixed(id, q => q.fig.n === n));
    lessons[id] = [
      concept(id, qs[0], '분할 원리', '중심에서 나눈 정다각형', '$S=\\frac n2R^2\\sin(360^\\circ/n)$', [
        ch('중심과 꼭짓점 연결', '반지름을 R, 변의 수를 n이라 해요.', '중심에서 꼭짓점들을 이으면 합동인 삼각형 n개예요.', 0, 1),
        ch('한 삼각형의 넓이', '두 변이 모두 R이고 중심각은 360°÷n이에요.', '한 삼각형의 넓이는 $\\frac12R^2\\sin(360^\\circ/n)$예요.'),
        ch('같은 삼각형을 모두 더하기', '한 삼각형의 넓이에 조각 수 n을 곱해요.', '따라서 $S=\\frac n2R^2\\sin(360^\\circ/n)$예요.', 4, 5)
      ], '외접원의 반지름이 R인 정n각형을 같은 삼각형으로 나누어 넓이를 설명해 보세요.'),
      ...qs.map(q => { const f = q.fig, angle = 360 / f.n; return make(id, q, `정${f.n}각형`, '정다각형의 넓이 계산', 'S', [
        ch('같은 삼각형으로 분할', `반지름 ${f.R}인 원에 정${f.n}각형이 내접해요.`, `중심에서 나누면 같은 삼각형 ${f.n}개가 생겨요.`, 0, 1),
        ch('중심각과 두 변 확인', `중심각은 360°÷${f.n}=${angle}°예요.`, `한 조각의 넓이는 $\\frac12\\times${f.R}^2\\times${G.vtex(G.sinD(angle))}$예요.`),
        ch('전체 넓이 계산', `한 조각의 넓이에 ${f.n}을 곱해요.`, ending(q, 'S'), 4, 5)
      ]); })
    ];
  }

  function drawTrace(b, paths, amount, id, q) {
    if (!(amount > 0)) return;
    const color = id === 'solid3DTrig' ? 'rose' : id === 'r8-2' || id === 'r8-3' ? 'green'
      : id === 'regPolygonArea' ? 'sky' : ['quadUnfold2x', 'quadDiagHalf', 'r9-2'].includes(id) || id === 'rhombusSquare' && q.fig.ask === 'pq' ? 'violet' : 'ink';
    const chosen = paths.find(path => path.options.color === color && path.options.width >= 2.5 && !path.options.fill)
      || paths.find(path => path.options.color === 'ink' && path.points.length >= 2);
    if (!chosen) throw new Error('해설의 원본 도형 추적선 없음: ' + id);
    const points = chosen.points.slice();
    if (chosen.options.close) points.push(points[0]);
    const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
    let remaining = lengths.reduce((a, n) => a + n, 0) * Math.min(1, amount);
    const traced = [points[0]];
    for (let i = 0; i < lengths.length && remaining > 0; i++) {
      const part = Math.min(1, remaining / lengths[i]);
      traced.push(G.lerp(points[i], points[i + 1], part)); remaining -= lengths[i];
    }
    if (traced.length > 1) b.path(traced, { color: 'amber', width: 4.8, alpha: .78 });
  }
  for (const id of Object.keys(lessons).filter(id => ['areaAcute', 'areaObtuse', 'equilFormula', 'r6-1', 'angleBisectLen', 'regPolygonArea', 'quadUnfold2x', 'paraArea', 'rhombusSquare', 'quadDiagHalf', 'quadSplitSum', 'solid3DTrig', 'r8-1', 'r8-2', 'r8-3', 'r9-1', 'r9-2'].includes(id))) {
    const D = source(id);
    D.lessonQuestion = (M, s) => s.tgLessonProblem ? null : s.tgCQuestion;
    D.lessonDraw = (b, s, M, C) => {
      const paths = [], original = b.path;
      b.path = function (points, options = {}) { paths.push({ points: points.map(p => ({ x: p.x ?? p[0], y: p.y ?? p[1] })), options }); return original.call(this, points, options); };
      try {
        const n = s.q.solution.steps.length, step = C.entry ? 0 : C.answer ? n : Math.max(0, Math.min(C.step, n - 1));
        if (s.tgCMode === 'unfold' || s.tgCMode === 'slide') D.draw(b, s, M, { ...C, review: true, tab: 'review', step, t: s.t71k || 0 });
        else D.pdraw(b, s.q, { ...C, review: true, step, last: C.answer }, s);
      } finally { b.path = original; }
      drawTrace(b, paths, C.entry ? 0 : s.tgCTrace || 0, id, s.q);
    };
  }
})();
