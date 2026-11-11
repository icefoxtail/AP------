/* Similarity lessons A: source t1–t3, with immutable original problem inputs.
 * The exploration drawings and source question generators remain the authority.
 * Full mobile/browser visual review is a separate follow-up, not claimed here.
 */
(function () {
  'use strict';
  const G = window.APL_SM;
  const defs = Object.fromEntries((window.APL_SM_GROUPS || []).flatMap(g => g.scenes.map(sc => [sc.id, sc.sm])));
  const lessons = (window.APL_LESSONS = window.APL_LESSONS || {})['g8-similarity'] = (window.APL_LESSONS['g8-similarity'] || {});
  const fraction = (a, b) => `\\frac{${a}}{${b}}`;
  const value = x => String(x).replace(/\s*:\s*/g, ':');
  const base = id => { const s = {}; defs[id].init(s); return s; };
  const cue = (at, say, step, set) => ({ at, ...(say ? { say } : {}), ...(step == null ? {} : { step }), ...(set ? { set } : {}) });
  const chapter = (title, cues) => ({ title, length: 12, cues });
  const traceConcepts = ['sm1-len', 'sm2-solid', 'sm3-par', 'sm3-flip', 'sm3-sas', 'sm3-multi', 'sm3-ssa', 'sm3-trap'];
  function add(id, label, title, answer, captions, options = {}) {
    const D = defs[id], initial = { ...base(id), ...(options.initial || {}) };
    const nums = Object.fromEntries(Object.entries(initial).filter(([, v]) => typeof v === 'number'));
    const sets = Object.fromEntries(Object.entries(initial).filter(([, v]) => typeof v !== 'number'));
    const pk = Object.freeze({ ...D.gen(options.seed || 1) });
    const start = { ...nums, smATrace: 0, ...(options.motion ? { [options.motion]: 0 } : {}) };
    const first = { ...sets, smSeed: 0, smPk: pk, smLessonProblem: !!options.problem,
      smShowAnswer: false, smCalculationReady: false, smALine: '', smAMode: options.mode || label };
    const trace = id === 'sm1-always' || (!options.problem && traceConcepts.includes(id));
    const transition = options.motion ? { at: .5, to: { [options.motion]: 1 }, dur: 4 }
      : trace ? { at: .5, to: { smATrace: 1 }, dur: 4 } : cue(.5, null, 2);
    const line = options.lines || ['', '', ''];
    const chapters = [
      { ...chapter('조건과 대응 찾기', [cue(0, captions[0], 0, first), transition, cue(6, captions[1], 2, { smALine: line[0] })]), start },
      chapter('관계와 비례식', [cue(0, captions[2], 3), cue(6, captions[3], 3, { smCalculationReady: true, smALine: line[1] })]),
      chapter('계산과 결론', [cue(0, captions[4], 3), cue(6, captions[5], 5, { smShowAnswer: true, smALine: line[2] || answer })])
    ];
    const lesson = { label, title, tab: 'review', answer, answerText: options.answerText || answer,
      summary: '같은 각과 대응변을 찾아 비례식을 세워요.',
      task: '직접 해 보기에서 값을 바꾸고 대응하는 변의 순서를 다시 확인해 보세요.', chapters };
    (lessons[id] = lessons[id] || []).push(lesson);
    return lesson;
  }
  function concept(id, label, title, answer, captions, options = {}) {
    return add(id, label, title, answer, captions, options);
  }
  function problem(id, label, seed, build) {
    const D = defs[id], p = D.gen(seed), state = { ...base(id), smPk: p, smSeed: 0 }, M = D.model(state);
    const Q = D.prob(M, state), solution = G.solveQuestion(id, p, Q), correct = Q.choices.findIndex(c => c.ok);
    const item = Q.choices[correct], display = item.h != null ? item.h : item.t != null ? '$' + item.t + '$' : item.p;
    const data = build(p, solution), answer = G.NUM[correct];
    data.captions[5] += ` 정답은 ${answer}이에요.`;
    return add(id, label, data.title || '대응하는 부분으로 계산', answer, data.captions, {
      problem: true, seed, answerText: `${answer} ${display}`,
      lines: data.lines || ['', '', `${label}: ${value(solution.answer)}`],
      motion: data.motion, initial: data.initial
    });
  }

  // Source geometry, with the original exploration summaries hidden during a
  // concept lesson. Only the lesson's current short calculation is added back.
  // In particular, cone/trapezoid area numbers do not appear before the last card.
  function drawWithTrace(b, s, C, draw, all = false) {
    const progress = C.entry || C.step !== 0 ? 0 : G.clamp(s.smATrace || 0, 0, 1);
    if (!progress) { draw(); return; }
    const path = b.path, circle = b.circle, edges = [], circles = [], seen = new Set();
    b.path = function (points, options = {}) {
      if (points.length > 1 && (options.fill || options.width >= 2.5) && (all || edges.length < 2)) {
        const a = points[0], z = points[1], key = `${a.x},${a.y}:${z.x},${z.y}`;
        if (!seen.has(key)) { seen.add(key); edges.push([a, z]); }
      }
      return path.call(this, points, options);
    };
    b.circle = function (at, radius, options = {}) {
      if (options.fill) circles.push([at, radius]);
      return circle.call(this, at, radius, options);
    };
    try { draw(); } finally { b.path = path; b.circle = circle; }
    // Trace source edges themselves; in the five-option problem every shape
    // receives identical treatment, without selecting the correct option.
    for (const [a, z] of edges) G.line(b, a, G.lerp(a, z, progress), 'violet', 4.8, { alpha: .8 });
    for (const [at, radius] of circles) b.arc(at, radius, 0, 2 * Math.PI * progress, { color: 'violet', width: 4.8, alpha: .8 });
  }
  const ids = ['sm1-corr', 'sm1-solid', 'sm1-len', 'sm1-always', 'sm2-tile', 'sm2-cube', 'sm2-solid', 'sm2-cone',
    'sm3-par', 'sm3-flip', 'sm3-rot', 'sm3-sas', 'sm3-multi', 'sm3-ssa', 'sm3-foldrect', 'sm3-foldequi', 'sm3-trap'];
  for (const id of ids) {
    const D = defs[id];
    D.lessonDraw = (b, s, M, C, solution) => {
      if (s.smLessonProblem) {
        // In the count problem the two constructed triangles are the answer.
        // Keep the perpendicular-distance comparison visible while deferring
        // those intersections until the final chapter's answer cue.
        if (id === 'sm3-ssa' && M.pk.kind === 0 && !C.answer) {
          G.drawSolution(b, D, s, M, { ...C, step: Math.min(C.step, 2) }, solution);
          return;
        }
        if (id === 'sm1-always') {
          const stage = C.answer ? solution.steps.length : Math.max(1, Math.min(C.step, solution.steps.length - 1));
          drawWithTrace(b, s, C, () => G.drawSolution(b, D, s, M, { ...C, step: stage }, solution), true);
          return;
        }
        return false;
      }
      const cap = !C.answer && (id === 'sm2-cone' || id === 'sm3-trap');
      const moving = !!D.anim;
      drawWithTrace(b, s, C, () => D.draw(b, s, M, { ...C, problem: false, review: !moving, full: false, txt: false,
        step: cap ? Math.min(C.step, 1) : C.step, t: moving ? s[D.anim.key] : C.t }));
      // Follow the source's actual cone sections rather than drawing an unrelated
      // illustration. The cumulative cone is the object used by the explanation.
      if (id === 'sm2-cone' && C.step >= 2) {
        const h = C.step >= 3 ? M.l[1] : M.l[0];
        G.line(b, G.pt(0, 0), G.pt(-h / 2, h), 'sky', 4);
        G.line(b, G.pt(0, 0), G.pt(h / 2, h), 'sky', 4);
        G.line(b, G.pt(-h / 2, h), G.pt(h / 2, h), 'violet', 3, { dash: [6, 4] });
      }
    };
    D.lessonAfterDraw = (b, s) => {
      if (s.smALine && !s.lessonEntry) b.stext(b.W / 2, b.H - 24, s.smALine,
        { color: s.smShowAnswer ? 'green' : 'amber', size: b.W < 560 ? 13 : 16, weight: 800, align: 'center', baseline: 'middle' });
    };
  }

  concept('sm1-corr', '대응변', '꼭짓점 순서로 대응 찾기', '대응변의 비는 모두 같다', [
    '두 사다리꼴의 같은 위치에 있는 점을 짝지어요.', 'A↔E, B↔F, C↔G, D↔H예요.',
    '같은 색 두 변을 작은 도형부터 읽어요.', '$6:12=5:10=2:4=3:6$이에요.',
    '각 비를 간단히 하면 모두 같은 비가 돼요.', '대응변의 비는 모두 같다: 이것이 닮음비예요.'
  ], { lines: ['A↔E, B↔F, C↔G, D↔H', '6:12 = 5:10 = 2:4 = 3:6', '대응변의 비는 모두 같다'] });
  concept('sm1-corr', '대응각', '같은 각 표시 따라가기', '대응각의 크기는 같다', [
    '꼭짓점 A와 E, D와 H의 직각 표시를 보아요.', 'B와 F, C와 G도 같은 모양의 각이에요.',
    '크기를 늘려도 각이 벌어진 정도는 같아요.', '길이의 비와 각의 크기를 구별해요.',
    '닮음비는 길이에 적용해요. 각을 배로 하지 않아요.', '따라서 닮은 도형의 대응각의 크기는 같다.'
  ], { lines: ['A↔E, B↔F, C↔G, D↔H', '길이의 비와 각의 크기는 다르다', '대응각의 크기는 같다'] });
  problem('sm1-corr', '대응 길이', 3, p => {
    const v = [6, 5, 2, 3], a = ['AB', 'BC', 'CD', 'DA'], b = ['EF', 'FG', 'GH', 'HE'];
    return { captions: [`${a[p.given]}=${v[p.given] * p.m}, ${b[p.given]}=${v[p.given] * p.n}을 짝지어요.`, `${b[p.ask]}=x는 ${a[p.ask]}와 대응해요.`,
      `작은 도형과 큰 도형의 비는 $${p.m}:${p.n}$예요.`, `$${v[p.ask] * p.m}:x=${p.m}:${p.n}$으로 놓아요.`,
      '작은 길이에 큰 도형의 확대 비율을 곱해요.', `$x=${v[p.ask] * p.m}\\times${fraction(p.n, p.m)}=${v[p.ask] * p.n}$이에요.`] };
  });
  problem('sm1-corr', '둘레', 1, p => ({ captions: [
    `$AB=${6 * p.m}$, $EF=${6 * p.n}$이고 작은 둘레는 ${16 * p.m}이에요.`, 'AB와 EF처럼 대응하는 변끼리 비를 구해요.',
    `작은 도형에서 큰 도형으로 $${fraction(p.n, p.m)}$배 해요.`, '둘레는 대응하는 모든 변을 더한 길이예요.',
    '네 변에 각각 곱한 비율을 둘레에도 곱해요.', `$${16 * p.m}\\times${fraction(p.n, p.m)}=${16 * p.n}$이에요.`
  ] }));

  concept('sm1-solid', '모서리 대응', '입체의 같은 위치 찾기', '입체의 대응 길이도 같은 비', [
    '사면체의 같은 위치에 있는 꼭짓점을 짝지어요.', '작은 모서리 4, 3, 2에 큰 8, 6, 4가 대응해요.',
    '$4:8=3:6=2:4$로 세 쌍의 비를 비교해요.', '입체에서도 모서리의 길이는 길이끼리 비교해요.',
    '넓이와 부피가 아닌 길이를 구한다는 점을 기억해요.', '입체의 대응 길이도 같은 비로 변해요.'
  ], { lines: ['4↔8, 3↔6, 2↔4', '4:8 = 3:6 = 2:4', '입체의 대응 길이도 같은 비'] });
  for (const [label, seed] of [['사면체 합', 1], ['직육면체', 2], ['원기둥', 9]]) problem('sm1-solid', label, seed, (p, sol) => {
    const b = { tet: [4, 3, 2], box: [3, 2, 2], cyl: [2, 4] }[p.type];
    return { captions: ['작은 입체와 큰 입체의 같은 위치를 짝지어요.',
      `주어진 대응 길이는 $${b[p.given] * p.m}$과 $${b[p.given] * p.n}$이에요.`,
      `모든 대응 길이의 비는 $${p.m}:${p.n}$이에요.`,
      `$${b[p.ask] * p.m}:x=${p.m}:${p.n}$으로 놓아요.`,
      p.type === 'tet' ? `같은 방법으로 $x=${sol.targets.x}$, $y=${sol.targets.y}$예요.` : '대응 길이에 확대 비율을 곱해요.',
      p.type === 'tet' ? `$x+y=${sol.targets.x}+${sol.targets.y}=${sol.answer}$이에요.` : `$x=${b[p.ask] * p.m}\\times${fraction(p.n, p.m)}=${sol.answer}$이에요.`] };
  });
  concept('sm1-len', '비례식', '가로끼리 세로끼리 비교', '가로와 세로의 비가 같다', [
    '작은 직사각형은 가로 6, 세로 4예요.', '큰 직사각형의 가로 9와 세로 6을 대응시켜요.',
    '작은 가로와 큰 가로의 비를 먼저 구해요.', '$6:9$의 비율을 세로에도 똑같이 적용해요.',
    '가로를 늘린 만큼 세로도 늘어나야 닮아요.', '닮은 직사각형은 가로와 세로의 비가 같다.'
  ], { lines: ['가로 6↔9, 세로 4↔6', '6:9 = 4:6', '가로와 세로의 비가 같다'] });
  for (const [label, seed] of [['가로 구하기', 3], ['세로 구하기', 1]]) problem('sm1-len', label, seed, p => {
    const known = p.ask === 0 ? p.q : p.p, ask = p.ask === 0 ? p.p : p.q;
    return { captions: [`x는 큰 직사각형의 ${p.ask === 0 ? '가로' : '세로'}예요.`,
      `알고 있는 대응 길이는 $${known * p.m}$과 $${known * p.n}$이에요.`,
      `닮음비 $${p.m}:${p.n}$을 같은 순서로 적용해요.`, `$${ask * p.m}:x=${p.m}:${p.n}$이에요.`,
      '차를 더하지 않고 같은 비율을 곱해요.', `$x=${ask * p.m}\\times${fraction(p.n, p.m)}=${ask * p.n}$이에요.`] };
  });
  concept('sm1-always', '항상 닮음', '모양이 하나로 정해지는가', '두 정삼각형은 항상 닮는다', [
    '크기가 다른 정삼각형 두 개를 비교해요.', '각각 세 변이 같고 각은 모두 60°예요.',
    '한 변을 맞춰 확대하면 나머지 두 변도 맞아요.', '크기만 바뀌고 세 각의 크기는 바뀌지 않아요.',
    '정사각형·같은 정다각형·원도 같은 원리예요.', '따라서 두 정삼각형은 항상 닮는다.'
  ], { lines: ['세 변이 같고, 세 각은 60°', '크기만 달라진다', '두 정삼각형은 항상 닮는다'] });
  concept('sm1-always', '반례', '직사각형의 모양 비교', '직사각형은 항상 닮지 않는다', [
    '네 각이 직각인 두 직사각형을 비교해요.', '오른쪽 세로만 길어지면 가로세로 비가 달라져요.',
    '각이 같다는 조건만으로는 충분하지 않아요.', '한 번의 같은 배율로 두 변을 모두 맞춰야 해요.',
    '마름모·이등변삼각형도 모양이 달라질 수 있어요.', '따라서 직사각형은 항상 닮지 않는다.'
  ], { initial: { smFam: 'rec', smRq: 1 }, lines: ['같은 직각, 다른 가로세로 비', '한 배율로 가로와 세로를 맞춰야 한다', '직사각형은 항상 닮지 않는다'] });
  for (const [label, seed] of [['보기 판별', 2], ['보기 반례', 1]]) problem('sm1-always', label, seed, (p, sol) => ({ captions: [
    p.askAlways ? '항상 닮은 도형을 고르는 문제예요.' : '항상 닮는다고 할 수 없는 도형을 찾아요.', '지금 그림 하나만 보고 종류 전체를 판단하지 않아요.',
    '모든 대응각이 같고 대응변의 비도 같아야 해요.', '크기 외에 가로세로 비나 각을 바꿀 수 있는지 보아요.',
    p.askAlways ? '네 변과 네 직각이 정해진 도형을 고르세요.' : '직각 외의 두 예각은 달라질 수 있어요.',
    `${sol.answer}${p.askAlways ? '은 크기만 달라져요.' : '은 예각이 달라질 수 있어요.'}`
  ] }));

  concept('sm2-tile', '타일로 설명', '삼각형 타일로 넓이 세기', '넓이의 비는 1:9', [
    '작은 삼각형의 한 변은 1, 큰 삼각형은 3이에요.', '큰 삼각형 안에 같은 작은 삼각형을 채워요.',
    '위에서부터 한 줄에 1개, 3개, 5개예요.', '길이가 늘어나면 높이도 같은 비로 늘어나요.',
    '칸 수를 더하면 $1+3+5=3^2$예요.', '총 9칸이므로 넓이의 비는 1:9예요.'
  ], { lines: ['한 변 1 : 3', '한 줄씩 1개, 3개, 5개', '넓이의 비는 1:9'] });
  for (const [label, seed] of [['넓이 계산', 1], ['넓이비', 2], ['닮음비 찾기', 3]]) problem('sm2-tile', label, seed, (p, sol) => ({ captions: [
    p.kind === 2 ? `넓이의 비는 $${p.p ** 2}:${p.q ** 2}$예요.` : `길이의 비는 $${p.p}:${p.q}$예요.`,
    p.kind === 0 ? `작은 도형의 넓이는 ${p.p ** 2 * p.c} cm²예요.` : '길이와 넓이를 구별해서 읽어요.',
    '넓이는 가로와 높이를 함께 곱해서 구해요.',
    p.kind === 2 ? `$${p.p ** 2}=${p.p}^2$, $${p.q ** 2}=${p.q}^2$를 확인해요.` : `$${p.p}^2:${p.q}^2$으로 넓이의 비를 세워요.`,
    p.kind === 0 ? `큰 넓이는 $${p.p ** 2 * p.c}\\times${fraction(p.q ** 2, p.p ** 2)}$예요.` : '두 항을 간단한 자연수의 비로 나타내요.',
    p.kind === 0 ? `넓이는 $${sol.answer}$ cm²예요.` : `${p.kind === 1 ? '넓이의 비' : '닮음비'}는 $${sol.answer}$예요.`
  ] }));
  for (const volume of [false, true]) concept('sm2-cube', volume ? '부피 원리' : '겉넓이 원리', '모서리에서 면과 층으로', volume ? '부피의 비는 1:27' : '겉넓이의 비는 1:9', [
    '모서리가 1인 블록과 3인 정육면체를 보아요.', '한 모서리 방향에 작은 길이가 3번 들어가요.',
    '한 면에는 가로 3칸, 세로 3칸이 있어요.', volume ? '같은 층을 높이 방향으로 3층 쌓아요.' : '두 정육면체 모두 같은 면을 6개씩 가지고 있어요.',
    volume ? '블록 수는 $3\\times3\\times3$으로 세요.' : '양쪽에 같은 6을 곱해도 넓이의 비는 같아요.',
    volume ? '따라서 부피의 비는 1:27이에요.' : '따라서 겉넓이의 비는 1:9예요.'
  ], { lines: ['모서리 1 : 3', volume ? '한 층 3×3, 높이 3층' : '한 면 3×3, 면의 수는 모두 6', volume ? '부피의 비는 1:27' : '겉넓이의 비는 1:9'] });
  for (const [label, seed] of [['블록 개수', 2], ['겉넓이비', 11], ['부피에서 면', 1]]) problem('sm2-cube', label, seed, (p, sol) => ({ captions: [
    p.kind === 0 ? `블록의 모서리 ${p.a}, 큰 모서리 ${p.a * p.k}예요.` : p.kind === 1 ? `모서리는 ${p.p} cm와 ${p.q} cm예요.` : `부피는 ${p.p ** 3} cm³와 ${p.q ** 3} cm³예요.`,
    p.kind === 0 ? `한 줄에 $${p.a * p.k}\\div${p.a}=${p.k}$개가 들어가요.` : p.kind === 2 ? '각 부피를 세 번 곱한 수로 나타내요.' : '같은 위치에 있는 모서리끼리 비교해요.',
    p.kind === 0 ? `한 층에는 $${p.k}\\times${p.k}$개가 있어요.` : `모서리의 비는 $${p.p}:${p.q}$예요.`,
    p.kind === 0 ? `높이 방향으로 같은 층이 ${p.k}개 있어요.` : `겉넓이에는 $${p.p}^2:${p.q}^2$을 사용해요.`,
    p.kind === 0 ? '한 층의 개수에 층 수를 곱해요.' : '같은 면 6개를 더해도 두 겉넓이의 비는 같아요.',
    p.kind === 0 ? `총 $${p.k}^3=${sol.answer}$개예요.` : `겉넓이의 비는 $${sol.answer}$예요.`
  ] }));
  for (const volume of [false, true]) concept('sm2-solid', volume ? '부피 원리' : '겉넓이 원리', '입체의 대응 길이 비교', volume ? '부피의 비는 8:27' : '겉넓이의 비는 4:9', [
    '대응하는 가로의 길이 2와 3을 비교해요.', '세로 4와 6, 높이 6과 9도 같은 비예요.',
    volume ? '부피는 가로·세로·높이를 곱해요.' : '한 면은 두 대응 길이를 곱한 넓이예요.',
    volume ? '세 방향에 같은 비율이 각각 한 번 들어가요.' : '모든 면이 같은 제곱의 비율로 변해요.',
    volume ? '$2^3:3^3$으로 세제곱을 계산해요.' : '$2^2:3^2$으로 제곱을 계산해요.',
    volume ? '따라서 부피의 비는 8:27이에요.' : '따라서 겉넓이의 비는 4:9예요.'
  ], { lines: ['2:3 = 4:6 = 6:9', volume ? '세 방향의 비율을 곱한다' : '각 면의 두 길이 비율을 곱한다', volume ? '부피의 비는 8:27' : '겉넓이의 비는 4:9'] });
  for (const [label, seed] of [['겉넓이 계산', 4], ['부피 계산', 5], ['넓이에서 체', 9], ['부피에서 면', 1]]) problem('sm2-solid', label, seed, (p, sol) => {
    const exp = p.kind === 0 || p.kind === 3 ? 2 : 3;
    return { captions: [p.kind < 2 ? `대응 모서리의 비는 $${p.m}:${p.n}$예요.` : p.kind === 2 ? `겉넓이는 $${22 * p.m ** 2}$와 $${22 * p.n ** 2}$예요.` : `부피는 $${6 * p.m ** 3}$와 $${6 * p.n ** 3}$예요.`,
      p.kind < 2 ? '구하는 것이 겉넓이인지 부피인지 확인해요.' : p.kind === 2 ? '겉넓이의 비에서 두 항을 제곱수로 읽어요.' : '부피의 비에서 두 항을 세제곱수로 읽어요.',
      `기준이 되는 닮음비는 $${p.m}:${p.n}$이에요.`, `${exp === 2 ? '겉넓이' : '부피'}에는 $${p.m}^{${exp}}:${p.n}^{${exp}}$을 써요.`,
      p.kind < 2 ? '작은 값에 두 항의 비율을 곱해요.' : '두 항을 같은 수로 나누어 간단히 해요.',
      `${p.kind < 2 ? (exp === 2 ? '겉넓이' : '부피') : '구하는 비'}는 $${sol.answer}$예요.`] };
  });
  concept('sm2-cone', '자르는 원리', '꼭짓점부터 높이를 누적', '조각의 부피비는 1:7:19', [
    '세 조각의 높이가 각각 1인 원뿔을 보아요.', '꼭짓점부터 높이는 차례로 1, 2, 3이에요.',
    '작은 원뿔들이 평행한 단면에서 끝나요.', '누적 원뿔의 부피는 $1^3:2^3:3^3$이에요.',
    '가운데는 $8-1$, 아래는 $27-8$을 계산해요.', '따라서 조각의 부피비는 1:7:19예요.'
  ], { lines: ['누적 높이 1, 2, 3', '누적 부피 1³, 2³, 3³', '조각의 부피비는 1:7:19'] });
  for (const [label, seed] of [['조각의 비', 2], ['가운데 부피', 1]]) problem('sm2-cone', label, seed, (p, sol) => {
    const h = [p.h1, p.h1 + p.h2, p.h1 + p.h2 + p.h3];
    return { captions: [`조각 높이는 $${p.h1}, ${p.h2}, ${p.h3}$이에요.`, `꼭짓점부터 높이는 $${h.join(', ')}$이에요.`,
      '단면이 평행하므로 누적 원뿔끼리 닮아요.', `$${h[0]}^3:${h[1]}^3:${h[2]}^3$으로 누적 부피를 비교해요.`,
      p.kind === 0 ? '옆 조각은 연속한 두 누적 부피의 차예요.' : `가운데는 $( ${h[1] ** 3}-${h[0] ** 3})\\times${p.c}$예요.`,
      p.kind === 0 ? `조각의 부피의 비는 $${sol.answer}$예요.` : `가운데 부피는 $${sol.answer}$ cm³예요.`] };
  });

  concept('sm3-par', '평행과 닮음', '평행선에서 같은 각 찾기', '△ADE∽△ABC', [
    'DE와 BC의 평행 표시를 확인해요.', 'AD와 AB는 같은 꼭짓점 A에서 시작해요.',
    '평행선의 동위각 ADE와 ABC가 같아요.', '다른 동위각 AED와 ACB도 같아요.',
    'D↔B, E↔C 순서로 대응을 정해요.', '두 각이 같으므로 △ADE∽△ABC예요.'
  ], { lines: ['DE ∥ BC', 'D↔B, E↔C', '△ADE∽△ABC'] });
  for (const [label, seed] of [['DE 길이', 3], ['BC 길이', 1], ['EC 길이', 9], ['전체와 부분', 2]]) problem('sm3-par', label, seed, (p, sol) => {
    const g = G.geo.parGeo(p.m, p.k, p.r);
    return { captions: [p.kind === 3 ? `$AD=${g.AD}$, $AB=${g.AB}$, $DE=${g.DE}$예요.` : `$AD=${g.AD}$, $DB=${g.DB}$이므로 $AB=${g.AB}$예요.`,
      '평행한 DE와 BC에서 동위각을 찾아요.', '△ADE와 △ABC는 두 각이 같아 닮아요.',
      p.kind === 2 ? `$AE:EC=AD:DB=${p.m}:${p.k}$이에요.` : `$AD:AB=DE:BC=${p.m}:${p.m + p.k}$이에요.`,
      p.kind === 2 ? `$EC=${g.AE}\\times${fraction(p.k, p.m)}$을 계산해요.` : p.kind === 0 ? `$DE=${g.BC}\\times${fraction(p.m, p.m + p.k)}$을 계산해요.` : `$BC=${g.DE}\\times${fraction(p.m + p.k, p.m)}$을 계산해요.`,
      `$x=${sol.answer}$ cm예요.`] };
  });
  concept('sm3-flip', '엇갈린 대응', '뒤집힌 순서로 짝짓기', '△ADE∽△ACB', [
    '∠A는 공통이고 표시된 D의 각과 C의 각이 같아요.', 'D는 B가 아니라 C와 대응해요.',
    '남은 E의 각은 B의 각과 같아요.', 'AD↔AC, AE↔AB, DE↔CB로 짝지어요.',
    '대응점의 순서를 엇갈리게 적어야 해요.', '따라서 △ADE∽△ACB예요.'
  ], { lines: ['D↔C, E↔B', 'AD↔AC, AE↔AB, DE↔CB', '△ADE∽△ACB'] });
  for (const [label, seed] of [['EC 길이', 1], ['BC 길이', 3]]) problem('sm3-flip', label, seed, (p, sol) => {
    const g = G.geo.flipGeo(p.m, p.n, p.r);
    return { captions: [`$AD=${g.AD}$, $AE=${g.AE}$, $AB=${g.AB}$을 확인해요.`, '공통각 A와 같은 각 D, C를 짝지어요.',
      '△ADE와 △ACB가 닮아요. E는 B에 대응해요.', `$AE:AB=AD:AC=DE:CB=${p.m}:${p.n}$예요.`,
      p.kind === 0 ? `$AC=${g.AD}\\times${fraction(p.n, p.m)}$에서 AE를 빼요.` : `$BC=${g.DE}\\times${fraction(p.n, p.m)}$을 계산해요.`,
      p.kind === 0 ? `$EC=${g.AC}-${g.AE}=${sol.answer}$예요.` : `$BC=${sol.answer}$예요.`] };
  });
  concept('sm3-rot', '돌려서 대응', '회전해 같은 방향 맞추기', 'AD:AB=AE:AC=DE:BC', [
    '작은 삼각형을 꼭짓점 A 주위로 돌려요.', '돌려도 길이와 각의 크기는 바뀌지 않아요.',
    '같은 각 표시끼리 A↔A, D↔B, E↔C예요.', '놓인 방향이 달라도 대응 순서는 같아요.',
    '작은 변을 먼저 적고 큰 대응변을 뒤에 적어요.', '따라서 AD:AB=AE:AC=DE:BC예요.'
  ], { motion: 'smOt', lines: ['A↔A, D↔B, E↔C', '회전은 길이와 각을 보존한다', 'AD:AB=AE:AC=DE:BC'] });
  for (const [label, seed] of [['AE 길이', 1], ['BC 길이', 3]]) problem('sm3-rot', label, seed, (p, sol) => ({
    motion: 'smOt', captions: [`$AD=${3 * p.m}$, $AB=${3 * p.n}$을 짝지어요.`, 'A 주위로 돌려 대응하는 두 변의 방향을 맞춰요.',
      `대응 길이의 비는 $${p.m}:${p.n}$이에요.`, p.kind === 0 ? '$AE:AC=AD:AB$로 놓아요.' : '$DE:BC=AD:AB$로 놓아요.',
      p.kind === 0 ? `$AE=${4 * p.n}\\times${fraction(p.m, p.n)}$을 계산해요.` : `$BC=${5 * p.m}\\times${fraction(p.n, p.m)}$을 계산해요.`, `$x=${sol.answer}$ cm예요.`]
  }));
  concept('sm3-sas', '끼인각', '두 비와 그 사이의 각', 'SAS 닮음 조건', [
    '작은 두 변 AD, AE와 큰 두 변 AB, AC를 보아요.', '두 변 사이의 A가 같은 각이에요.',
    '$AD:AB=6:12$, $AE:AC=8:16$을 비교해요.', '두 대응변의 비가 같고 그 사이의 각도 같아요.',
    '끼인각이 아닌 다른 각과 혼동하지 않아요.', '이 조건이 SAS 닮음 조건이에요.'
  ], { lines: ['∠DAE = ∠BAC', '6:12 = 8:16', 'SAS 닮음 조건'] });
  for (const [label, seed] of [['조건 판별', 1], ['EC 길이', 2]]) problem('sm3-sas', label, seed, (p, sol) => {
    const g = G.geo.sasGeo(p.m, p.n, p.q, p.a);
    return { captions: [`$AD=${g.AD}$, $DB=${g.DB}$, $AE=${g.AE}$예요.`, `$AB=AD+DB=${g.AB}$을 먼저 구해요.`,
      p.kind === 0 ? `$AD:AB=${g.AD}:${g.AB}$을 비교해요.` : `주어진 닮음비 $${p.m}:${p.n}$을 사용해요.`,
      p.kind === 0 ? `$AE:AC=${g.AE}:${g.AC}$도 같은 비예요.` : `$AE:AC=AD:AB$로 AC 전체를 구해요.`,
      p.kind === 0 ? '∠A는 방금 비교한 두 변 사이의 각이에요.' : `$AC=${g.AE}\\times${fraction(p.n, p.m)}$에서 AE를 빼요.`,
      p.kind === 0 ? 'SAS 닮음 조건을 이용해요.' : `$EC=${g.AC}-${g.AE}=${sol.answer}$예요.`] };
  });
  concept('sm3-multi', '누적 길이', '공통 꼭짓점부터 재기', 'AD:AF:AB=DE:FG:BC', [
    '평행한 DE, FG, BC가 세 삼각형을 만들어요.', '세 삼각형은 모두 꼭짓점 A에서 시작해요.',
    'AD, AF, AB를 A부터 누적해서 재요.', '조각 AD, DF, FB끼리의 비와 구별해요.',
    '같은 두 각으로 세 삼각형이 서로 닮아요.', '따라서 AD:AF:AB=DE:FG:BC예요.'
  ], { lines: ['DE ∥ FG ∥ BC', 'A부터 AD, AF, AB를 잰다', 'AD:AF:AB=DE:FG:BC'] });
  for (const [label, seed] of [['DE 길이', 2], ['FG 길이', 1], ['BC 길이', 4]]) problem('sm3-multi', label, seed, (p, sol) => {
    const g = G.geo.multiGeo(p.a, p.bb, p.c, p.r), target = ['DE', 'FG', 'BC'][p.kind];
    return { captions: [`$AD=${g.AD}$, $DF=${g.DF}$, $FB=${g.FB}$예요.`, `$AF=${g.AD + g.DF}$, $AB=${g.AD + g.DF + g.FB}$로 누적해요.`,
      '평행선의 동위각 때문에 세 삼각형이 닮아요.', `$DE:FG:BC=${p.a}:${p.a + p.bb}:${p.a + p.bb + p.c}$예요.`,
      `${target}와 주어진 밑변의 비를 골라 계산해요.`, `$${target}=${sol.answer}$ cm예요.`] };
  });
  concept('sm3-ssa', '두 모양', '끼인각이 아닌 각의 함정', 'SSA는 닮음 조건이 아니다', [
    'AB=10, ∠A=30°를 고정한 그림이에요.', 'B를 중심으로 반지름 7인 호를 그려요.',
    '호와 반직선의 만나는 점에 C를 놓을 수 있어요.', '같은 두 변과 각으로 서로 다른 두 모양이 나와요.',
    '주어진 각이 두 변 사이의 끼인각인지 확인해요.', '삼각형이 하나로 정해지지 않아 SSA는 닮음 조건이 아니다.'
  ], { lines: ['AB=10, ∠A=30°, BC=7', '같은 조건을 만족하는 두 모양', 'SSA는 닮음 조건이 아니다'] });
  for (const [label, seed] of [['교점 수①', 1], ['교점 수②', 4], ['교점 수③', 17], ['정수 길이', 2]]) problem('sm3-ssa', label, seed, (p, sol) => {
    const lo = Math.floor(p.c / 2) + 1, hi = p.c - 1;
    return { captions: [`$AB=${p.c}$, $\\angle A=30^{\\circ}$를 확인해요.`, p.kind === 0 ? `B를 중심으로 반지름 ${p.a}인 호를 생각해요.` : '가능한 BC의 정수 길이를 찾는 문제예요.',
      'B에서 반직선에 내린 수선의 발을 H라 해요.', `$BH=${fraction(p.c, 2)}$를 호의 반지름과 비교해요.`,
      p.kind === 0 ? `호와 반직선이 만나는 점을 세어 보아요.` : `$${fraction(p.c, 2)}\\lt BC\\lt${p.c}$에서 ${lo}부터 ${hi}까지예요.`,
      p.kind === 0 ? `삼각형은 ${sol.answer}개 그릴 수 있어요.` : `정수 길이는 모두 ${sol.answer}개예요.`] };
  });
  concept('sm3-foldrect', '접기와 닮음', '접힌 직각에서 같은 각 찾기', '△ABF∽△FCE', [
    '직사각형의 D를 접는 선 AE를 따라 F로 옮겨요.', '접어도 각은 같아서 ∠AFE는 직각이에요.',
    'F에서 두 나머지 각의 합은 90°예요.', '△ABF의 두 예각도 합이 90°예요.',
    '∠BAF=∠CFE이고 ∠B=∠C=90°예요.', '두 각이 같으므로 △ABF∽△FCE예요.'
  ], { motion: 'smFt', lines: ['D를 F로 포개기', '두 예각의 합은 각각 90°', '△ABF∽△FCE'] });
  for (const [label, seed] of [['CE 길이', 5], ['DE 길이', 1]]) problem('sm3-foldrect', label, seed, (p, sol) => {
    const g = G.geo.foldGeo(p.typ, p.j, 1);
    return { captions: [`$AB=${g.AB}$, $BF=${g.BF}$, $FC=${g.FC}$예요.`, '접어서 생긴 직각 AFE를 확인해요.',
      '두 직각과 같은 예각으로 △ABF와 △FCE가 닮아요.', `$AB:FC=BF:CE$, 즉 $${g.AB}:${g.FC}=${g.BF}:CE$예요.`,
      p.kind === 0 ? `$CE=${fraction(g.BF + '\\times' + g.FC, g.AB)}$을 계산해요.` : `$CE=${g.CE}$를 구한 뒤 DC에서 빼요.`,
      p.kind === 0 ? `$CE=${sol.answer}$ cm예요.` : `$DE=${g.AB}-${g.CE}=${sol.answer}$ cm예요.`] };
  });
  concept('sm3-foldequi', '접기와 닮음', '접힌 각과 같은 두 각', '△DBF∽△FCE', [
    '정삼각형의 A를 접는 선 DE를 따라 F로 옮겨요.', '∠DFE는 원래의 ∠A와 같은 60°예요.',
    'F의 양옆 나머지 각의 합은 120°예요.', '△DBF의 B가 60°라 다른 두 각의 합도 120°예요.',
    '∠BDF=∠CFE이고 ∠B=∠C=60°예요.', '따라서 △DBF∽△FCE예요.'
  ], { motion: 'smFt', lines: ['A를 F로 포개기', '나머지 두 각의 합은 각각 120°', '△DBF∽△FCE'] });
  for (const [label, seed] of [['CE 길이', 1], ['EF 길이', 4]]) problem('sm3-foldequi', label, seed, (p, sol) => {
    const g0 = G.geo.eqGeo('off', 30, 1), g = p.flip ? G.geo.mirrorEq(g0) : g0;
    return { captions: [`$BD=${g.BD}$, $BF=${g.BF}$을 확인해요.`, '접어도 길이와 각이 보존돼요.',
      '같은 두 각으로 △DBF와 △FCE가 닮아요.', `$BD:FC=BF:CE$, 즉 $${g.BD}:${g.FC}=${g.BF}:CE$예요.`,
      p.kind === 0 ? `$CE=${fraction(g.BF + '\\times' + g.FC, g.BD)}$을 계산해요.` : `$CE=${g.CE}$를 구해 $EF=EA=30-CE$로 놓아요.`,
      p.kind === 0 ? `$CE=${sol.answer}$ cm예요.` : `$EF=${sol.answer}$ cm예요.`] };
  });
  concept('sm3-trap', '네 넓이', '닮은 삼각형과 같은 높이', '네 넓이는 4:6:6:9', [
    'AD∥BC인 사다리꼴의 대각선 교점은 O예요.', '평행선의 엇각과 맞꼭지각을 짝지어요.',
    '위아래 삼각형의 닮음비는 AD:BC=2:3이에요.', '위아래 넓이는 닮음비의 제곱으로 비교해요.',
    '옆 삼각형은 같은 높이에서 밑변 비를 사용해요.', '양옆의 넓이가 같아 네 넓이는 4:6:6:9예요.'
  ], { lines: ['AD ∥ BC, 교점 O', '위아래 넓이 2² : 3²', '네 넓이는 4:6:6:9'] });
  for (const [label, seed] of [['옆 넓이', 2], ['아래 넓이', 1]]) problem('sm3-trap', label, seed, (p, sol) => ({ captions: [
    p.kind === 0 ? `위쪽 넓이 ${p.a ** 2 * p.c}, 아래쪽 넓이 ${p.bb ** 2 * p.c}예요.` : `윗변 ${2 * p.a}, 아랫변 ${2 * p.bb}, 위쪽 넓이 ${p.a ** 2 * p.c}예요.`,
    '맞꼭지각과 엇각으로 △AOD와 △COB가 닮아요.',
    p.kind === 0 ? `넓이의 비를 $${p.a}^2:${p.bb}^2$으로 읽어요.` : `길이의 비 $${p.a}:${p.bb}$을 제곱해요.`,
    p.kind === 0 ? `닮음비 $${p.a}:${p.bb}$으로 같은 높이의 넓이를 비교해요.` : '위쪽 넓이에 제곱한 두 항의 비율을 곱해요.',
    p.kind === 0 ? `$${p.a ** 2 * p.c}\\times${fraction(p.bb, p.a)}$을 계산해요.` : `$${p.a ** 2 * p.c}\\times${fraction(p.bb ** 2, p.a ** 2)}$을 계산해요.`,
    `구하는 넓이는 $${sol.answer}$예요.`
  ] }));
})();
