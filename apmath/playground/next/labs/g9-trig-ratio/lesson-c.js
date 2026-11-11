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

  {
    const id = 'quadUnfold2x', q = fixed(id), f = q.fig;
    const unfold = ch('2배 평행사변형 만들기', '각 꼭짓점에서 다른 대각선과 평행한 선을 그어요.', '노란 평행사변형의 두 변은 p와 q, 사잇각은 θ예요.', 1, 2);
    Object.assign(unfold.cues[0], { to: { t71k: 1 }, dur: 4 }); delete unfold.cues[0].step;
    lessons[id] = [
      concept(id, q, '2배 원리', '대각선으로 넓이 나타내기', '$S=\\frac12pq\\sin\\theta$', [
        ch('대각선과 각 확인', 'AC를 p, BD를 q, 두 대각선의 사잇각을 θ라 해요.', '대각선을 이웃한 변으로 갖는 큰 도형을 만들어요.', 0, 1),
        unfold,
        ch('큰 넓이의 절반 구하기', '평행사변형의 넓이 pq sin θ는 원래 넓이의 2배예요.', '따라서 사각형의 넓이는 $S=\\frac12pq\\sin\\theta$예요.', 3, 5)
      ], '두 대각선의 길이와 사잇각으로 사각형의 넓이를 나타내는 원리를 설명해 보세요.', { mode: 'unfold', start: { t71p: f.p, t71q: f.q, t71t: f.th } }),
      make(id, q, '넓이 계산', '두 대각선으로 넓이 계산', 'S', [
        ch('대각선의 전체 길이', `AC=${f.p}, BD=${f.q}, 사잇각은 ${f.th}°예요.`, '지금 주어진 길이는 두 변이 아니라 두 대각선이에요.', 0, 1),
        ch('2배 넓이에서 원래 넓이로', '대각선으로 만든 평행사변형의 넓이를 반으로 나누어요.', `$S=\\frac12\\times${f.p}\\times${f.q}\\sin${f.th}^\\circ$예요.`),
        ch('사인의 값 대입', `$\\sin${f.th}^\\circ=${G.vtex(G.sinD(f.th))}$를 대입해요.`, ending(q, 'S'), 4, 5)
      ])
    ];
  }
  {
    const id = 'paraArea', qs = [fixed(id, q => q.fig.ask === 'area' && q.fig.th < 90), fixed(id, q => q.fig.ask === 'area' && q.fig.th > 90), fixed(id, q => q.fig.ask === 'side')];
    lessons[id] = [
      concept(id, qs[0], '높이 원리', '평행사변형의 넓이 원리', '$S=ab\\sin\\theta$', [
        ch('밑변과 이웃한 변', 'AB를 a, AD를 b, 끼인각을 θ라 해요.', 'D에서 AB에 수선을 내려 높이 DH를 만들어요.', 0, 1),
        ch('기울어진 변과 높이 구별', 'AD는 빗변이고 DH는 θ의 대변이에요.', '높이는 $h=b\\sin\\theta$로 나타낼 수 있어요.'),
        ch('밑변과 높이 곱하기', '평행사변형의 넓이는 밑변 a와 높이 h의 곱이에요.', '따라서 $S=ab\\sin\\theta$예요.', 4, 5)
      ], '평행사변형에서 이웃한 두 변 a, b와 끼인각 θ로 넓이를 설명해 보세요.'),
      ...qs.map((q, i) => { const f = q.fig, side = f.ask === 'side', w = Math.min(f.th, 180 - f.th); return make(id, q, ['예각 넓이', '둔각 넓이', '변 역산'][i], '평행사변형 넓이식 활용', side ? 'x' : 'S', [
        ch('주어진 값과 구하는 값', side ? `AB=${f.a}, 각 A=${f.th}°, 넓이는 $${f.S}$예요.` : `AB=${f.a}, AD=${f.b0}, 각 A=${f.th}°예요.`, side ? '구하는 변 AD를 x로 놓고 넓이식을 세워요.' : 'D에서 AB에 내린 수선이 밑변 AB에 대한 높이예요.', 0, 1),
        ch('사인으로 높이 나타내기', f.th > 90 ? `높이는 바깥각 ${w}°의 사인으로 구할 수 있어요.` : `높이는 이웃한 변에 sin ${w}°를 곱한 값이에요.`, side ? `$${f.S}=${f.a}\\times x\\times${G.vtex(G.sinD(w))}$예요.` : `$h=${f.b0}\\times${G.vtex(G.sinD(w))}$예요.`),
        ch('넓이식 계산', side ? `주어진 넓이를 ${f.a}sin ${w}°로 나누어요.` : '평행사변형이므로 밑변과 높이를 곱해요.', ending(q, side ? 'x' : 'S'), 4, 5)
      ]); })
    ];
  }
  {
    const id = 'rhombusSquare', side = fixed(id, q => q.fig.ask === 'sa'), diagonal = fixed(id, q => q.fig.ask === 'pq');
    lessons[id] = [
      concept(id, side, '변과 각', '마름모의 변과 각으로 넓이', '$S=a^2\\sin\\theta$', [
        ch('모든 변이 같은 사각형', '마름모의 한 변을 a, 한 내각을 θ라 해요.', '마름모도 평행사변형이므로 밑변과 높이를 곱해요.', 0, 1),
        ch('높이를 사인으로 표현', '밑변도 a이고 이웃한 변도 a예요.', '높이는 a sin θ이므로 두 길이를 곱해요.'),
        ch('넓이식 정리', '$S=a\\times(a\\sin\\theta)$로 나타내요.', '따라서 $S=a^2\\sin\\theta$예요.', 4, 5)
      ], '한 변 a와 내각 θ가 주어진 마름모의 넓이를 설명해 보세요.'),
      concept(id, diagonal, '대각선', '마름모의 두 대각선으로 넓이', '$S=\\frac12pq$', [
        ch('대각선의 전체 길이', '마름모의 두 대각선 전체 길이를 p와 q라 해요.', '두 대각선은 서로를 이등분하고 직각으로 만나요.', 0, 1),
        ch('작은 직각삼각형 네 개', '작은 삼각형의 직각변은 p/2와 q/2예요.', '한 조각의 넓이는 $\\frac12\\times\\frac p2\\times\\frac q2$예요.'),
        ch('네 조각의 넓이 합', '한 조각의 넓이에 조각 수 4를 곱해요.', '따라서 $S=\\frac12pq$예요.', 4, 5)
      ], '두 대각선의 전체 길이가 p와 q인 마름모의 넓이를 설명해 보세요.'),
      ...[[side, '변·각 계산'], [diagonal, '대각선 계산']].map(([q, label]) => { const f = q.fig, pq = f.ask === 'pq'; return make(id, q, label, '마름모의 넓이 계산', 'S', [
        ch('어떤 조건이 주어졌을까', pq ? `두 대각선의 전체 길이가 ${f.p}, ${f.q}예요.` : `한 변은 ${f.a}, 한 내각은 ${f.th}°예요.`, pq ? '두 대각선이 수직으로 만나므로 네 직각삼각형이에요.' : '같은 두 이웃한 변과 그 끼인각을 사용해요.', 0, 1),
        ch('조건에 맞는 넓이식', pq ? '$S=\\frac12pq$에 전체 대각선 길이를 넣어요.' : '$S=a^2\\sin\\theta$를 사용해요.', pq ? `$S=\\frac12\\times${f.p}\\times${f.q}$예요.` : `$S=${f.a}^2\\times${G.vtex(G.sinD(f.th))}$예요.`),
        ch('넓이 계산과 확인', pq ? '전체 길이에 이미 1/2를 곱했으므로 다시 나누지 않아요.' : '같은 변의 길이를 두 번 곱해 제곱을 계산해요.', ending(q, 'S'), 4, 5)
      ]); })
    ];
  }
  {
    const id = 'quadDiagHalf', q = fixed(id), f = q.fig;
    const sliding = ch('교점의 위치 바꾸기', '대각선의 길이와 각을 고정하고 교점을 옮겨 보아요.', '네 작은 삼각형의 모양과 넓이는 각각 달라져요.', 1, 2);
    Object.assign(sliding.cues[0], { to: { t71x: .7 }, dur: 4 }); delete sliding.cues[0].step;
    lessons[id] = [
      concept(id, q, '교점 이동', '교점을 옮기면 넓이는', '$S=\\frac12pq\\sin\\theta$', [
        ch('고정하는 조건', 'AC=p, BD=q와 두 대각선의 사잇각 θ를 고정해요.', '점 P가 AC를 나누는 비율만 바꾸려 해요.', 0, 1),
        sliding,
        ch('네 넓이를 더하기', '네 넓이의 합을 정리하면 전체 대각선 p와 q가 남아요.', '따라서 $S=\\frac12pq\\sin\\theta$로 넓이는 같아요.', 4, 5)
      ], '두 대각선의 길이와 사잇각을 고정하고 교점을 옮길 때 넓이를 설명해 보세요.', { mode: 'slide', start: { t71p: f.p, t71q: f.q, t71t: f.th, t71x: .3 } }),
      make(id, q, '대각선 역산', '넓이로 대각선 길이 구하기', 'x', [
        ch('넓이와 한 대각선', `AC=${f.p}, 사잇각은 ${f.th}°, 넓이는 $${f.S}$예요.`, '구하는 다른 대각선 BD의 전체 길이를 x라 해요.', 0, 1),
        ch('대각선 넓이식 세우기', '$S=\\frac12pq\\sin\\theta$에 조건을 넣어요.', `$${f.S}=\\frac12\\times${f.p}\\times x\\times${G.vtex(G.sinD(f.th))}$예요.`),
        ch('전체 길이 구하기', '넓이에 2를 곱하고 AC와 사인의 곱으로 나누어요.', ending(q, 'x'), 4, 5)
      ])
    ];
  }
  {
    const id = 'quadSplitSum', same = fixed(id, q => q.fig.be === 60 && q.fig.de === 60), mixed = fixed(id, q => q.fig.be === 45 && q.fig.de === 60);
    lessons[id] = [
      concept(id, same, '분할 원리', '대각선으로 나눈 넓이의 합', '$S=\\frac12pa\\sin\\beta+\\frac12pc\\sin\\delta$', [
        ch('대각선으로 나누기', 'BD=p를 그어 사각형을 ABD와 CBD로 나누어요.', '위쪽은 BA=a, 아래쪽은 BC=c를 사용해요.', 0, 1),
        ch('각 삼각형의 끼인각', 'ABD에는 β, CBD에는 δ를 써서 두 넓이를 구해요.', '$S_1=\\frac12pa\\sin\\beta$, $S_2=\\frac12pc\\sin\\delta$예요.'),
        ch('겹치지 않는 두 넓이', '두 삼각형은 대각선 BD의 서로 반대쪽에 있어요.', '따라서 $S=\\frac12pa\\sin\\beta+\\frac12pc\\sin\\delta$예요.', 4, 5)
      ], '대각선 BD로 나뉜 두 삼각형에서 각각의 끼인각을 사용해 전체 넓이를 설명해 보세요.'),
      ...[[same, '같은 근호'], [mixed, '다른 근호']].map(([q, label]) => { const f = q.fig; return make(id, q, label, '두 삼각형의 넓이 더하기', 'S', [
        ch('대각선과 두 끼인각', `BD=${f.p}, BA=${f.a}, BC=${f.c}예요.`, `ABD의 끼인각은 ${f.be}°, CBD의 끼인각은 ${f.de}°예요.`, 0, 1),
        ch('위쪽과 아래쪽 넓이', `$S_1=\\frac12\\times${f.p}\\times${f.a}\\sin${f.be}^\\circ=${f.work.s1}$예요.`, `$S_2=\\frac12\\times${f.p}\\times${f.c}\\sin${f.de}^\\circ=${f.work.s2}$예요.`),
        ch('전체 넓이의 합', label === '같은 근호' ? '같은 근호를 가진 항끼리 계수를 더해요.' : '서로 다른 근호는 그대로 두고 두 넓이를 더해요.', ending(q, 'S'), 4, 5)
      ]); })
    ];
  }

  {
    const id = 'solid3DTrig', qs = Object.fromEntries(['ag', 's', 'c', 't'].map(kind => [kind, fixed(id, q => q.fig.kind === kind)]));
    lessons[id] = [
      concept(id, qs.ag, '대각선 원리', '정육면체의 대각선 구하기', '$AG=\\sqrt3a$', [
        ch('입체에서 직각 찾기', '한 모서리를 a라 하고 A, E, G를 이어요.', 'AE는 윗면에 수직이므로 삼각형 AEG는 E에서 직각이에요.', 0, 2),
        ch('면의 대각선부터 구하기', '정사각형 윗면의 대각선은 $EG=\\sqrt2a$예요.', '$AG^2=AE^2+EG^2=a^2+2a^2$예요.', 3, 4),
        ch('입체의 대각선 길이', '$AG^2=3a^2$에서 양의 제곱근을 택해요.', '따라서 $AG=\\sqrt3a$예요.', 4, 5)
      ], '한 모서리가 a인 정육면체에서 면의 대각선을 거쳐 입체 대각선 AG를 구해 보세요.'),
      ...['ag', 's', 'c', 't'].map(kind => { const q = qs[kind], f = q.fig, fn = { s: '\\sin x', c: '\\cos x', t: '\\tan x' }[kind], ratio = { s: '\\frac{AE}{AG}', c: '\\frac{EG}{AG}', t: '\\frac{AE}{EG}' }[kind]; return make(id, q, { ag: '대각선 계산', s: 'sin 계산', c: 'cos 계산', t: 'tan 계산' }[kind], '정육면체 속 직각삼각형', kind === 'ag' ? 'AG' : fn, [
        ch('모서리와 단면 삼각형', `정육면체의 한 모서리는 ${f.a0}예요.`, 'AE가 윗면에 수직이므로 E가 직각이고 AG가 빗변이에요.', 0, 2),
        ch('두 대각선의 관계', `$EG=\\sqrt{${f.a0}^2+${f.a0}^2}=${f.work.EG}$예요.`, kind === 'ag' ? `$AG^2=${f.a0}^2+(${f.work.EG})^2$예요.` : `$AG=${f.work.AG}$이고 기준각 x는 G에 있어요.`, 3, 3),
        ch('구하는 길이와 비 선택', kind === 'ag' ? '면의 대각선이 아니라 AG의 양의 길이를 구해요.' : `$${fn}=${ratio}$에서 분자와 분모를 구별해요.`, ending(q, kind === 'ag' ? 'AG' : fn), 4, 5)
      ]); })
    ];
  }
  {
    const id = 'r8-1', qs = Object.fromEntries(['ag', 's', 'c', 't'].map(kind => [kind, fixed(id, q => q.fig.kind === kind)]));
    lessons[id] = [
      concept(id, qs.ag, '두 번의 정리', '직육면체 대각선의 원리', '$AG=\\sqrt{a^2+b^2+c^2}$', [
        ch('밑면과 높이 구별', '가로 AB=a, 세로 BC=b, 높이 CG=c라 해요.', '먼저 직사각형 밑면의 대각선 AC를 그어요.', 0, 1),
        ch('두 직각삼각형 연결', '$AC^2=a^2+b^2$이고 CG는 밑면에 수직이에요.', '$AG^2=AC^2+CG^2$에 앞의 식을 넣어요.'),
        ch('세 제곱의 합', '$AG^2=a^2+b^2+c^2$에서 길이는 양수예요.', '따라서 $AG=\\sqrt{a^2+b^2+c^2}$예요.', 4, 5)
      ], '가로 a, 세로 b, 높이 c인 직육면체에서 두 번의 피타고라스 정리로 AG를 구해 보세요.'),
      ...['ag', 's', 'c', 't'].map(kind => { const q = qs[kind], f = q.fig, fn = { s: '\\sin x', c: '\\cos x', t: '\\tan x' }[kind], ratio = { s: '\\frac{CG}{AG}', c: '\\frac{AC}{AG}', t: '\\frac{CG}{AC}' }[kind]; return make(id, q, { ag: '대각선 계산', s: 'sin 계산', c: 'cos 계산', t: 'tan 계산' }[kind], '직육면체의 대각선과 삼각비', kind === 'ag' ? 'AG' : fn, [
        ch('직육면체의 세 모서리', `가로 ${f.a}, 세로 ${f.b0}, 높이 ${f.c}예요.`, '밑면의 대각선 AC와 높이 CG를 연결해요.', 0, 1),
        ch('밑면 대각선과 빗변', `$AC=\\sqrt{${f.a}^2+${f.b0}^2}=${f.work.AC}$예요.`, kind === 'ag' ? `$AG^2=${f.a}^2+${f.b0}^2+${f.c}^2$예요.` : `$AG=${f.work.AG}$이고 기준각은 GAC예요.`, 2, 3),
        ch('구하는 값 계산', kind === 'ag' ? '세 모서리의 제곱을 더한 뒤 양의 제곱근을 구해요.' : `$${fn}=${ratio}$에 해당하는 길이를 넣어요.`, ending(q, kind === 'ag' ? 'AG' : fn), 4, 5)
      ]); })
    ];
  }
  {
    const id = 'r8-2', qs = Object.fromEntries(['h', 'r', 'V'].map(kind => [kind, fixed(id, q => q.fig.kind === kind && q.fig.th !== 45)]));
    lessons[id] = [
      concept(id, qs.h, '높이 원리', '원뿔의 모선과 높이', '$h=L\\sin\\theta$', [
        ch('축을 지나는 단면', '모선 AB를 L, 모선과 밑면의 각을 θ라 해요.', '축 AO는 반지름 OB에 수직이므로 O가 직각이에요.', 0, 2),
        ch('높이는 기준각의 대변', 'AB가 빗변이고 높이 AO가 θ의 대변이에요.', '$\\sin\\theta=h/L$로 두 길이의 비를 나타내요.'),
        ch('높이만 남기기', '양변에 모선 L을 곱해요.', '따라서 $h=L\\sin\\theta$예요.', 4, 5)
      ], '원뿔의 모선 L과 모선이 밑면과 이루는 각 θ로 높이 h를 설명해 보세요.'),
      concept(id, qs.r, '반지름 원리', '원뿔의 모선과 반지름', '$r=L\\cos\\theta$', [
        ch('모선과 밑면의 각', '모선 AB를 L, 밑면의 반지름 OB를 r이라 해요.', '기준각 θ는 B에 있고 AOB는 O에서 직각이에요.', 0, 2),
        ch('반지름은 이웃변', '반지름 OB가 θ의 이웃변이고 AB는 빗변이에요.', '$\\cos\\theta=r/L$로 두 길이의 비를 나타내요.'),
        ch('반지름만 남기기', '양변에 모선 L을 곱해요.', '따라서 $r=L\\cos\\theta$예요.', 4, 5)
      ], '원뿔의 모선 L과 모선이 밑면과 이루는 각 θ로 반지름 r을 설명해 보세요.'),
      concept(id, qs.V, '부피 원리', '원뿔의 밑넓이와 높이', '$V=\\frac13\\pi r^2h$', [
        ch('밑면과 높이 구별', '원뿔의 밑면은 원이고 높이는 축 AO예요.', '모선 AB는 기울어진 빗변이므로 높이와 구별해요.', 0, 2),
        ch('삼각비로 두 길이 구하기', '$r=L\\cos\\theta$, $h=L\\sin\\theta$예요.', '밑넓이는 반지름을 제곱한 $\\pi r^2$예요.'),
        ch('원뿔의 부피', '밑넓이와 높이의 곱에 1/3을 곱해요.', '따라서 $V=\\frac13\\pi r^2h$예요.', 4, 5)
      ], '원뿔의 모선과 밑면의 각으로 반지름, 높이를 구한 뒤 부피를 설명해 보세요.'),
      ...['h', 'r', 'V'].map(kind => { const q = qs[kind], f = q.fig, L = q.solution.math.slant; return make(id, q, { h: '높이 계산', r: '반지름 계산', V: '부피 계산' }[kind], '원뿔의 직각삼각형 활용', kind, [
        ch('모선과 기준각 확인', `모선 AB=${L}, 밑면과 이루는 각은 ${f.th}°예요.`, 'AOB에서 AB는 빗변, AO는 대변, OB는 이웃변이에요.', 0, 2),
        ch('필요한 삼각비 선택', kind === 'h' ? '$\\sin\\theta=h/L$를 사용해요.' : kind === 'r' ? '$\\cos\\theta=r/L$를 사용해요.' : '부피에는 반지름과 높이가 모두 필요해요.', kind === 'h' ? `$h=${L}\\times${G.vtex(G.sinD(f.th))}$예요.` : kind === 'r' ? `$r=${L}\\times${G.vtex(G.cosD(f.th))}$예요.` : `$r=${f.work.r}$, $h=${f.work.h}$예요.`, 2, 3),
        ch('길이 또는 부피 계산', kind === 'V' ? `$V=\\frac13\\pi\\times(${f.work.r})^2\\times${f.work.h}$예요.` : kind === 'h' ? '모선에 사인의 값을 곱해 수직 높이를 구해요.' : '모선에 코사인의 값을 곱해 반지름을 구해요.', ending(q, kind), 4, 5)
      ]); })
    ];
  }
  {
    const id = 'r8-3', qs = Object.fromEntries(['h', 'V', 'cos'].map(kind => [kind, fixed(id, q => q.fig.kind === kind)]));
    lessons[id] = [
      concept(id, qs.h, '높이 원리', '정사면체의 높이를 찾기', '$DO=\\frac{\\sqrt6}{3}a$', [
        ch('높이의 발과 무게중심', '모서리가 a인 정사면체에서 높이의 발을 O라 해요.', 'O는 밑면 정삼각형의 무게중심이에요.', 0, 1),
        ch('밑면에서 필요한 길이', '$AO=\\frac23\\times\\frac{\\sqrt3}{2}a=\\frac{\\sqrt3}{3}a$예요.', '직각삼각형 DAO에서 $DO^2=a^2-AO^2$예요.', 2, 3),
        ch('수직 높이 계산', '$DO^2=\\frac23a^2$에서 양의 제곱근을 구해요.', '따라서 $DO=\\frac{\\sqrt6}{3}a$예요.', 4, 5)
      ], '한 모서리가 a인 정사면체에서 밑면의 무게중심을 이용해 수직 높이 DO를 설명해 보세요.'),
      ...['h', 'V', 'cos'].map(kind => { const q = qs[kind], f = q.fig, symbol = kind === 'cos' ? '\\cos x' : kind === 'h' ? 'DO' : 'V'; return make(id, q, { h: '높이 계산', V: '부피 계산', cos: 'cos 계산' }[kind], '정사면체의 단면 삼각형', symbol, [
        ch('모서리와 높이의 발', `정사면체의 모든 모서리는 ${f.a0}예요.`, '높이의 발 O는 밑면 정삼각형 ABC의 무게중심이에요.', 0, 1),
        ch('무게중심까지의 거리', `$AO=\\frac23\\times\\frac{\\sqrt3}{2}\\times${f.a0}=${f.work.R}$예요.`, kind === 'cos' ? '모서리와 밑면의 각 x는 DAO이고 빗변은 DA예요.' : `$DO^2=${f.a0}^2-(${f.work.R})^2$예요.`, 2, 3),
        ch('구하는 값에 맞게 계산', kind === 'h' ? '수직 높이 DO는 앞에서 구한 제곱의 양의 제곱근이에요.' : kind === 'V' ? `$V=\\frac13\\times\\frac{\\sqrt3}{4}\\times${f.a0}^2\\times${f.work.h}$예요.` : `$\\cos x=\\frac{AO}{DA}=\\frac{${f.work.R}}{${f.a0}}$예요.`, ending(q, symbol), 4, 5)
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
