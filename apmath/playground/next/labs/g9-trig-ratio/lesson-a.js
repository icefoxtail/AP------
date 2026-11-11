/* 삼각비 A — 원본 t1–t3의 문제·정확값을 고정한 원클릭 해설.
 * Source generators and exploration remain unchanged; lesson hooks stage only
 * the lesson drawing. Browser/mobile visual review is recorded separately.
 */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const ids = ['r1-1', 'refAngleSwap', 'r1-2', 'r1-3', 'simRightTri', 'r1-4',
    'cut3060', 'cut45', 'chainSpecial', 'r2-1', 'r2-2', 'r2-3', 'absSignJudge',
    'unitCircle', 'whyOuterTan', 'r3-1', 'r3-2', 'trigTableCalc', 'lineSlope'];
  const defs = Object.fromEntries((window.APL_TG_GROUPS || []).flatMap(g => g.scenes).filter(s => ids.includes(s.id)).map(s => [s.id, s.tg]));
  const lessons = (window.APL_LESSONS = window.APL_LESSONS || {})['g9-trig-ratio'] = window.APL_LESSONS['g9-trig-ratio'] || {};
  const S = String.raw, frac = (a, b) => `\\frac{${a}}{${b}}`, tex = v => G.vtex(v);
  const exact = q => q.choices.find(c => c.ok).t;
  const choice = q => { const c = q.choices.find(c => c.ok); return c.h != null ? c.h : `$${c.t}$`; };
  const fixed = (id, accept) => G.fixedQuestion(id, 1, accept);
  const fnName = { s: 'sin', c: 'cos', t: 'tan' }, role = { a: '대변', b: '이웃변', c: '빗변' };
  const given = q => Object.entries(q.fig.side || {}).filter(([, v]) => v.t !== 'x').map(([k, v]) => `$${G.sideTag2(q.fig.names, k)}=${v.t}$`).join(', ');
  const cue = (at, say, step, set) => ({ at, ...(say ? { say } : {}), ...(step == null ? {} : { step }), ...(set ? { set } : {}) });
  function add(id, label, captions, options = {}) {
    // Source canvas labels use √n; caption math uses the equivalent KaTeX root.
    captions = captions.map(text => text?.replace(/\$([^$]+)\$/g, (_, math) => '$' + math.replace(/√(\d+)/g, '\\sqrt{$1}') + '$'));
    const initial = {}; defs[id].init(initial); Object.assign(initial, options.initial || {});
    const q = options.q || fixed(id), ordinal = G.NUM[q.choices.findIndex(c => c.ok)];
    const answer = options.problem ? ordinal : options.answer;
    const start = { ...Object.fromEntries(Object.entries(initial).filter(([, v]) => typeof v === 'number')), tgATrace: 0 };
    const first = { ...Object.fromEntries(Object.entries(initial).filter(([, v]) => typeof v !== 'number')),
      q, tgSeed: 0, tgLessonProblem: !!options.problem, tgShowAnswer: false, tgCalculationReady: false,
      tgAQuestion: options.question || '', tgAUseProblemFigure: !!options.useProblem, tgAMode: options.mode || label, tgALine: '' };
    const motion = options.motion || { tgATrace: 1 };
    const final = options.problem ? `${choice(q)}이므로 정답은 ${ordinal}이에요.` : captions[5];
    const item = { label, title: options.title || '기준각과 변의 비 연결', tab: 'review', answer,
      answerText: options.problem ? `${ordinal} ${choice(q)}` : answer,
      summary: '기준각을 정하고 같은 삼각형의 변을 짝지어요.',
      task: '직접 해 보기에서 각과 길이를 바꾸고 같은 방법으로 변의 비를 다시 확인해 보세요.',
      chapters: [
        { title: '조건과 기준각', length: 12, start, cues: [cue(0, captions[0], 0, first), { at: .5, to: motion, dur: 4, ease: 'linear' }, cue(6, captions[1], 2)] },
        { title: '풀이 전략과 관계', length: 12, cues: [cue(0, captions[2], 3), cue(6, captions[3], 3, { tgCalculationReady: true })] },
        { title: '계산과 결론', length: 12, cues: [cue(0, captions[4], 3), cue(6, final, q.solution.steps.length, { tgShowAnswer: true, tgALine: options.line || '' })] }
      ] };
    (lessons[id] = lessons[id] || []).push(item);
    return item;
  }
  const concept = (id, label, answer, captions, options = {}) => add(id, label, captions, { ...options, answer });
  function problem(id, label, accept, build) {
    const q = fixed(id, accept), data = build(q, q.solution.math);
    return add(id, label, data.captions || data, { ...data, q, problem: true });
  }

  // The animated stroke follows actual source drawing edges. Table scenes use
  // their existing grid edges; no unrelated decorative geometry is substituted.
  function trace(b, s, C, draw) {
    const t = C.entry || C.step !== 0 ? 0 : G.clamp(s.tgATrace || 0, 0, 1);
    if (!t) { draw(); return; }
    const path = b.path, edges = [], seen = new Set();
    b.path = function (points, options = {}) {
      if (points.length > 1 && (options.fill || options.width >= 1.5) && edges.length < 3) {
        const a = points[0], z = points[1], key = `${a.x},${a.y}:${z.x},${z.y}`;
        if (!seen.has(key)) { seen.add(key); edges.push([a, z]); }
      }
      return path.call(this, points, options);
    };
    try { draw(); } finally { b.path = path; }
    for (const [a, z] of edges) G.line(b, a, G.lerp(a, z, t), 'violet', 4.8, { alpha: .8 });
  }
  for (const id of ids) {
    const D = defs[id];
    D.lessonQuestion = (M, s) => s.tgLessonProblem ? null : s.tgAQuestion || D.question;
    D.lessonDraw = (b, s, M, C) => {
      const stage = C.entry ? 0 : C.answer ? s.q.solution.steps.length : Math.min(C.step, s.q.solution.steps.length - 1);
      if (s.tgLessonProblem || s.tgAUseProblemFigure) {
        trace(b, s, C, () => {
          if (id === 'r2-1' && C.answer) {
            // The source angle problem keeps its x marker. Resolve that marker
            // only at the lesson conclusion, without mutating the frozen q.
            G.pdrawRT(b, { ...s.q.fig, angA: { ...s.q.fig.angA, t: `${s.q.solution.math.answer}°` } }, { ...C, review: true, step: stage, last: true });
          } else D.pdraw(b, s.q, { ...C, review: true, step: stage, last: C.answer }, s);
        });
        return;
      }
      if (id === 'refAngleSwap') {
        const ref = C.step >= 3 ? 'B' : 'A';
        trace(b, s, C, () => G.pdrawRT(b, { a: M.a.v, b: M.b.v, names: { A: 'A', B: 'B', C: 'C' }, reference: ref,
          side: { a: { t: tex(M.a) }, b: { t: tex(M.b) }, c: { t: tex(M.c) } },
          angA: ref === 'A' ? { t: 'A', c: 'amber' } : null, angB: ref === 'B' ? { t: 'B', c: 'amber' } : null },
        { ...C, review: true, step: C.entry ? 0 : Math.min(C.step, 2) }));
        return;
      }
      if (id === 'chainSpecial') {
        trace(b, s, C, () => G.drawChain(b, M, { problem: true, givenK: 'h', askK: 'bc', g: tex(M.h), review: true, step: Math.max(2, stage), last: C.answer }));
        return;
      }
      const caps = { 'r1-1': 2, 'r1-2': 2, simRightTri: 2, 'r1-4': 2, cut3060: 2, cut45: 2,
        'r2-1': 1, 'r2-2': 2, 'r2-3': 0, absSignJudge: 2, unitCircle: 3, trigTableCalc: 1 };
      const step = C.answer ? 4 : Math.min(stage, caps[id] ?? stage);
      trace(b, s, C, () => D.draw(b, s, M, { ...C, problem: false, review: true, full: false, step,
        t: D.anim ? s[D.anim.key] : C.t }));
    };
    D.lessonAfterDraw = (b, s) => {
      if (s.tgALine && s.tgShowAnswer && !s.lessonEntry) b.stext(b.W / 2, b.H - 22, s.tgALine,
        { color: 'green', size: b.W < 560 ? 13 : 16, weight: 800, align: 'center', baseline: 'middle' });
    };
  }

  // ① 삼각비의 뜻 — 함수·기준각·주어진 변의 종류를 각각 다룬다.
  for (const fn of ['s', 'c', 't']) {
    const num = fn === 'c' ? 4 : 3, den = fn === 't' ? 4 : 5, answer = `$${G.FN[fn]} A=${frac(num, den)}$`;
    concept('r1-1', `${fnName[fn]} 뜻`, answer, [
      '직각은 C이고 기준이 되는 각은 A예요.', '맞은편 BC는 3, 이웃한 CA는 4예요.',
      '직각 맞은편 AB는 빗변이며 길이는 5예요.', `${fnName[fn]}은 ${fn === 'c' ? '이웃변÷빗변' : fn === 't' ? '대변÷이웃변' : '대변÷빗변'}이에요.`,
      `$${G.FN[fn]} A=${frac(num, den)}$로 길이를 대입해요.`, `따라서 ${answer}예요.`
    ], { question: `직각삼각형 ABC에서 BC=3, CA=4, AB=5일 때 ${fnName[fn]} A의 값은?` });
  }
  function ratioCaptions(q, m) {
    const f = q.fig, nm = f.names, ref = nm[m.ref], opp = m.ref === 'A' ? 'a' : 'b', adj = m.ref === 'A' ? 'b' : 'a';
    const num = m.fn === 'c' ? adj : opp, den = m.fn === 't' ? adj : 'c', ss = f.solutionSide;
    return [`직각은 ${nm.C}, 기준각은 ${ref}예요.`, `주어진 길이는 ${given(q)}예요.`,
      `대변은 $${G.sideTag2(nm, opp)}$, 이웃변은 $${G.sideTag2(nm, adj)}$예요.`,
      q.key.split('|')[1] === 'legs' ? `$${G.sideTag2(nm, 'c')}=\\sqrt{${ss.a}^2+${ss.b}^2}$예요.` : `$${G.sideTag2(nm, 'b')}=\\sqrt{${ss.c}^2-${ss.a}^2}$예요.`,
      `$${G.FN[m.fn]} ${ref}=${frac(ss[num], ss[den])}$를 정리해요.`];
  }
  for (const [label, kind, radical, fn, ref] of [
    ['정수 빗변', 'legs', false, 's', 'A'], ['근호 빗변', 'legs', true, 'c', 'B'],
    ['빗변 주어짐', 'hyp', false, 't', 'B'], ['근호 이웃변', 'hyp', true, 's', 'A']
  ]) problem('r1-1', label, q => { const m = q.solution.math; return q.key.split('|')[1] === kind && m.fn === fn && m.ref === ref && !Number.isInteger(kind === 'legs' ? m.c : m.b) === radical; }, ratioCaptions);

  concept('refAngleSwap', '두 각 관계', '$\\sin A=\\cos B$', [
    '직각은 C이며 A와 B의 합은 90°예요.', 'A를 기준으로 BC는 대변, CA는 이웃변이에요.',
    '기준각을 B로 바꾸면 변의 역할이 서로 바뀌어요.', 'BC는 B의 이웃변이고 빗변 AB는 그대로예요.',
    '$\\sin A=BC/AB$, $\\cos B=BC/AB$예요.', '따라서 $\\sin A=\\cos B$예요.'
  ], { question: '직각삼각형에서 기준각을 A에서 B로 바꾸면 sin A와 cos B는 어떤 관계일까요?', line: 'sin A = cos B, cos A = sin B' });
  concept('refAngleSwap', 'tan 곱', '$\\tan A\\tan B=1$', [
    'A와 B는 직각삼각형의 두 예각이에요.', 'A를 기준으로 대변은 3, 이웃변은 4예요.',
    'B를 기준으로 대변은 4, 이웃변은 3이 돼요.', 'tan은 대변을 이웃변으로 나눈 값이에요.',
    '$\\frac34\\times\\frac43$에서 같은 수를 약분해요.', '따라서 $\\tan A\\tan B=1$이에요.'
  ], { question: '대변과 이웃변이 바뀔 때 tan A와 tan B의 곱은 얼마일까요?', line: 'tan A × tan B = 1' });
  const swapForms = [
    ['sin합', (e, n) => e === `\\sin ${n.A}+\\cos ${n.B}`],
    ['혼합곱', (e, n) => e === `\\sin ${n.A}\\times\\cos ${n.B}`],
    ['cos합', (e, n) => e === `\\cos ${n.A}+\\sin ${n.B}`],
    ['tan곱', (e, n) => e === `\\tan ${n.A}\\times\\tan ${n.B}`],
    ['sin곱', (e, n) => e === `\\sin ${n.A}\\times\\sin ${n.B}`]
  ];
  for (const [label, accept] of swapForms) problem('refAngleSwap', label, q => accept(q.solution.math.expression, q.fig.names), (q, m) => {
    const n = q.fig.names, c = tex(G.vsqrt(G.vi(m.a * m.a + m.b * m.b)));
    return [`구하는 식은 $${m.expression}$예요.`, `주어진 두 변은 ${given(q)}예요.`,
      `빗변은 $\\sqrt{${m.a}^2+${m.b}^2}=${c}$예요.`, `기준각 ${n.A}와 ${n.B}의 대변·이웃변을 바꿔요.`,
      `$\\sin ${n.A}=\\cos ${n.B}=${frac(m.a, c)}$, $\\cos ${n.A}=\\sin ${n.B}=${frac(m.b, c)}$를 써요.`];
  });

  for (const fn of ['c', 't']) concept('r1-2', `${fnName[fn]} 찾기`, fn === 'c' ? '$\\cos A=\\frac45$' : '$\\tan A=\\frac34$', [
    '$\\sin A=\\frac35$가 주어졌어요.', '대변을 3, 빗변을 5로 놓은 닮은 삼각형을 써요.',
    '나머지 이웃변은 피타고라스 정리로 찾아요.', '$b=\\sqrt{5^2-3^2}=4$예요.',
    fn === 'c' ? 'cos은 이웃변을 빗변으로 나누어요.' : 'tan은 대변을 이웃변으로 나누어요.',
    fn === 'c' ? '따라서 $\\cos A=\\frac45$예요.' : '따라서 $\\tan A=\\frac34$예요.'
  ], { question: `sin A=3/5인 예각 A의 ${fnName[fn]} A를 구해 보세요.` });
  for (const fn of ['s', 'c', 't']) for (const kind of ['ratio', 'len']) problem('r1-2', `${fnName[fn]}→${kind === 'ratio' ? '비' : '변'}`,
    q => q.key.split('|')[1] === kind && q.key.split('|')[2] === fn, (q, m) => {
      const n = q.fig.names, ss = q.fig.solutionSide, a = q.fig.a, b = q.fig.b, c = Math.hypot(a, b);
      return [`주어진 비 $${q.fig.notes[0].t}$를 확인해요.`, `기준각은 ${n.A}이고 직각은 ${n.C}예요.`,
        `피타고라스로 세 변의 비 $${a}:${b}:${c}$를 얻어요.`,
        kind === 'len' ? `빗변은 비의 ${c}에서 실제 길이 ${m.c}로 바뀌어요.` : '길이 자체가 아닌 같은 삼각형의 비를 써요.',
        kind === 'len' ? `$x=${m.c}\\times${frac(m.ask === 'a' ? a : b, c)}$를 계산해요.` : `$${G.FN[m.fn]} ${n.A}=${frac(m.fn === 'c' ? ss.b : ss.a, m.fn === 't' ? ss.b : ss.c)}$예요.`];
    });

  const chains = { s: S`\frac{BC}{AC}=\frac{DE}{AE}=\frac{FG}{AG}`, c: S`\frac{AB}{AC}=\frac{AD}{AE}=\frac{AF}{AG}`, t: S`\frac{BC}{AB}=\frac{DE}{AD}=\frac{FG}{AF}` };
  for (const fn of ['s', 'c', 't']) concept('r1-3', `${fnName[fn]} 일정`, `${fnName[fn]}은 크기와 무관`, [
    '세 직각삼각형은 각 A를 함께 가지고 있어요.', '직각도 같아서 AA 닮음이에요.',
    '작은 삼각형의 변끼리 먼저 한 쌍을 골라요.', '큰 삼각형에서도 같은 역할의 변을 골라요.',
    `$${chains[fn]}$가 성립해요.`, `같은 각의 ${fnName[fn]}은 크기와 무관해요.`
  ], { question: `각 A가 같은 세 직각삼각형의 ${fnName[fn]} A는 크기에 따라 달라질까요?`, initial: { t13t: 45 }, line: `${fnName[fn]} A: 크기가 달라도 같은 비` });
  for (const askWrong of [false, true]) problem('r1-3', askWrong ? '틀린 식' : '옳은 식', q => q.solution.math.askWrong === askWrong, () => [
    askWrong ? '이번에는 옳지 않은 식을 골라요.' : '이번에는 옳은 식을 골라요.', '직각과 공통각 A를 가진 세 삼각형을 보아요.',
    '대변은 BC·DE·FG, 이웃변은 AB·AD·AF예요.', '빗변은 AC·AE·AG로 같은 삼각형끼리 짝지어요.',
    'sin은 대변÷빗변, cos은 이웃변÷빗변이에요.'
  ]);
  concept('simRightTri', '수선의 각', '$\\angle BAH=\\angle C$', [
    '직각 A에서 빗변 BC에 수선 AH를 내려요.', '삼각형 ABH와 ABC는 각 B를 공유해요.',
    '두 삼각형에서 나머지 두 각의 합은 90°예요.', '같은 각 B를 빼면 남는 예각도 같아요.',
    '각 BAH 대신 큰 삼각형의 각 C를 사용해요.', '따라서 $\\angle BAH=\\angle C$예요.'
  ], { question: '빗변에 수선 AH를 그었을 때 각 BAH는 큰 삼각형의 어느 각과 같을까요?', line: '∠BAH = ∠C, ∠HAC = ∠B' });
  for (const ref of ['BAH', 'HAC']) for (const fn of ['s', 'c', 't']) problem('simRightTri', `${ref}${fnName[fn]}`,
    q => q.solution.math.ref === ref && q.solution.math.fn === fn, (q, m) => {
      const r = tex(G.vsqrt(G.vi(m.p * m.p + m.q * m.q))), atC = ref === 'BAH', num = fn === 'c' ? (atC ? m.q : m.p) : (atC ? m.p : m.q), den = fn === 't' ? (atC ? m.q : m.p) : r;
      return [`$AB=${m.p}$, $AC=${m.q}$이고 A는 직각이에요.`, '수선 AH가 만든 같은 크기의 각을 찾아요.',
        `$\\angle ${ref}=\\angle ${atC ? 'C' : 'B'}$예요.`, `$BC=\\sqrt{${m.p}^2+${m.q}^2}=${r}$예요.`,
        `$${G.FN[fn]}(\\angle ${ref})=${frac(num, den)}$를 계산해요.`];
    });
  concept('r1-4', '돌려도 일정', '회전해도 삼각비는 같다', [
    '같은 직각삼각형을 제자리에서 돌려 보아요.', '화면의 위아래 대신 직각과 기준각 A를 찾아요.',
    '대변 3, 이웃변 4, 빗변 5의 길이는 그대로예요.', '각 A가 변하지 않으므로 각 변의 역할도 같아요.',
    '$\\sin A=3/5$, $\\cos A=4/5$, $\\tan A=3/4$예요.', '따라서 회전해도 삼각비는 같아요.'
  ], { question: '삼각형을 회전하면 같은 각 A의 삼각비는 달라질까요?', motion: { t16r: 100 }, line: '회전해도 대변·이웃변·빗변의 역할은 같다' });
  for (const kind of ['legs', 'hyp']) for (const fn of ['s', 'c', 't']) problem('r1-4', `${kind === 'legs' ? '두 변' : '빗변'}${fnName[fn]}`,
    q => q.key.split('|')[1] === kind && q.solution.math.fn === fn, ratioCaptions);

  // ② 특수각 — 반 자르기, 모든 주어진 변/구할 변 유형과 식의 구조.
  concept('cut3060', '반 자르기', '$1:\\sqrt3:2$', [
    '한 변 6인 정삼각형을 높이 AH로 나누어요.', '밑변도 반으로 나뉘므로 BH는 3이에요.',
    '직각삼각형 ABH의 빗변 AB는 6이에요.', '$AH=\\sqrt{6^2-3^2}=3\\sqrt3$예요.',
    '세 길이 3, 3√3, 6을 모두 3으로 나누어요.', '짧은 변:긴 변:빗변은 $1:\\sqrt3:2$예요.'
  ], { question: '정삼각형을 높이로 반으로 자르면 30°·60°·90° 삼각형의 세 변의 비는?', motion: { t2s: 1 } });
  function specialCaptions(q, m) {
    const r = G.RATIO[m.theta], order = ['a', 'b', 'c'], g = q.fig.side[m.givenSide].t;
    const rg = tex(r[order.indexOf(m.givenSide)]), ra = tex(r[order.indexOf(m.askedSide)]);
    return [`기준각은 ${m.theta}°이고 주어진 ${role[m.givenSide]}은 $${g}$예요.`, `구하는 x는 기준각의 ${role[m.askedSide]}이에요.`,
      `대변:이웃변:빗변은 $${r.map(tex).join(':')}$예요.`, `$k=${frac(g, rg)}$로 공통 배율을 구해요.`,
      `$x=${frac(g, rg)}\\times${ra}$를 계산해요.`];
  }
  const sidePairs = [['a', 'b'], ['a', 'c'], ['b', 'a'], ['b', 'c'], ['c', 'a'], ['c', 'b']];
  sidePairs.forEach(([g, a], i) => problem('cut3060', `${g}→${a}`, q => { const m = q.solution.math; return m.givenSide === g && m.askedSide === a && m.theta === (i % 2 ? 60 : 30); }, specialCaptions));
  concept('cut45', '대각선 절단', '$1:1:\\sqrt2$', [
    '한 변 5인 정사각형을 대각선 BD로 잘라요.', '각 조각에는 길이 5인 두 변과 직각이 있어요.',
    '두 예각이 같아서 각각 45°예요.', '$BD=\\sqrt{5^2+5^2}=5\\sqrt2$예요.',
    '세 변 5, 5, 5√2를 모두 5로 나누어요.', '따라서 세 변의 비는 $1:1:\\sqrt2$예요.'
  ], { question: '정사각형의 대각선이 만든 45° 직각삼각형의 세 변의 비를 구해 보세요.', motion: { t2s: 1 } });
  for (const [g, a] of [['a', 'c'], ['b', 'c'], ['c', 'a'], ['c', 'b']]) problem('cut45', `${g}→${a}`,
    q => q.solution.math.givenSide === g && q.solution.math.askedSide === a, specialCaptions);
  concept('chainSpecial', '공통 높이', '$BC=4+4\\sqrt3$', [
    '공통 높이는 AH=4, 밑각은 45°와 30°예요.', '두 직각삼각형을 높이 AH로 연결해요.',
    '$BH=4/\\tan45^{\\circ}=4$예요.', '$CH=4/\\tan30^{\\circ}=4\\sqrt3$예요.',
    'H가 B와 C 사이에 있으므로 두 밑변을 더해요.', '따라서 $BC=4+4\\sqrt3$예요.'
  ], { question: 'AH=4, 각 B=45°, 각 C=30°일 때 두 밑변을 더해 BC를 구해 보세요.' });
  for (const [g, a] of [['ab', 'ac'], ['ab', 'bc'], ['ac', 'ab'], ['ac', 'bc']]) problem('chainSpecial', `${g.toUpperCase()}→${a.toUpperCase()}`,
    q => q.solution.math.givenSide === g && q.solution.math.askedSide === a, (q, m) => {
      const M = q.fig.exact, angle = m.pair[g === 'ab' ? 0 : 1];
      return [`$${g.toUpperCase()}=${tex(M[g])}$이고 밑각은 ${m.pair[0]}°, ${m.pair[1]}°예요.`, '공통 높이 AH부터 구해 다른 삼각형으로 넘어가요.',
        `$AH=${tex(M[g])}\\sin${angle}^{\\circ}=${tex(M.h)}$예요.`,
        a === 'bc' ? `$BH=${frac(tex(M.h), tex(G.tanD(m.pair[0])))}$, $CH=${frac(tex(M.h), tex(G.tanD(m.pair[1])))}$예요.` : '구할 빗변을 가진 쪽에서 높이÷sin을 써요.',
        a === 'bc' ? `$BC=${tex(M.bh)}+${tex(M.ch)}$를 계산해요.` : `$${a.toUpperCase()}=${frac(tex(M.h), tex(G.sinD(m.pair[a === 'ab' ? 0 : 1])))}$예요.`];
    });
  for (const theta of [30, 45, 60]) {
    const r = G.RATIO[theta], answer = `$\\sin${theta}^{\\circ}=${tex(G.sinD(theta))}$`;
    concept('r2-1', `${theta}°표`, answer, [
      `표의 ${theta}° 열을 완성해 보아요.`, `대변:이웃변:빗변은 $${r.map(tex).join(':')}$예요.`,
      'sin은 대변÷빗변, cos은 이웃변÷빗변이에요.', 'tan은 대변÷이웃변으로 세 값을 구해요.',
      `$\\cos${theta}^{\\circ}=${tex(G.cosD(theta))}$, $\\tan${theta}^{\\circ}=${tex(G.tanD(theta))}$예요.`,
      `또한 ${answer}예요. 같은 열에 함께 적어요.`
    ], { initial: { t2th: theta }, question: `${theta}° 직각삼각형의 변의 비로 sin, cos, tan 표의 한 열을 채워 보세요.` });
  }
  for (const [fn, theta] of [['s', 30], ['c', 60], ['t', 45]]) problem('r2-1', `${fnName[fn]}→각`, q => q.solution.math.fn === fn && q.solution.math.theta === theta, (q, m) => {
    const side = q.fig.side, k = fn === 's' ? ['a', 'c'] : fn === 'c' ? ['b', 'c'] : ['a', 'b'];
    return [`기준각 x의 두 변은 ${given(q)}예요.`, `이 두 변의 비는 ${fnName[fn]}으로 연결해요.`,
      `$${G.FN[fn]} x=${frac(side[k[0]].t, side[k[1]].t)}$예요.`, '30°, 45°, 60° 표에서 같은 값을 찾아요.',
      '대변과 이웃변의 위치까지 맞는 예각을 골라요.'];
  });
  concept('r2-2', '계산 순서', '식의 값은 0', [
    '$\\sin30^{\\circ}+\\cos60^{\\circ}-\\tan45^{\\circ}$를 계산해요.', '각 항의 함수와 각을 따로 확인해요.',
    '$\\sin30^{\\circ}=1/2$, $\\cos60^{\\circ}=1/2$예요.', '$\\tan45^{\\circ}=1$을 대입해요.',
    '$1/2+1/2-1$에서 분수를 먼저 더해요.', '따라서 식의 값은 0이에요.'
  ], { question: '특수각 표를 이용해 sin 30° + cos 60° − tan 45°의 값을 구해 보세요.' });
  for (const form of ['f1', 'f2', 'f3', 'f4']) problem('r2-2', { f1: '합과 차', f2: '곱셈 먼저', f3: '곱과 나눔', f4: '제곱 계산' }[form], q => q.solution.math.form === form, (q, m) => {
    const [a, b, c] = m.angles, fns = form === 'f3' ? ['t', 'c', 's'] : ['s', 'c', 't'], funcs = { s: G.sinD, c: G.cosD, t: G.tanD };
    const v = m.angles.map((th, i) => tex(funcs[fns[i]](th)));
    const substitution = { f1: `${v[0]}+${v[1]}-${v[2]}`, f2: `${v[0]}\\times${v[1]}+${v[2]}`, f3: `${v[0]}\\times${v[1]}\\div${v[2]}`, f4: `(${v[0]})^2+(${v[1]})^2+${v[2]}` }[form];
    return [`세 각 ${a}°, ${b}°, ${c}°를 각각 확인해요.`, '그림의 특수각 삼각형에서 필요한 비를 읽어요.',
      `$${G.FN[fns[0]]}${a}^{\\circ}=${v[0]}$, $${G.FN[fns[1]]}${b}^{\\circ}=${v[1]}$예요.`,
      `$${G.FN[fns[2]]}${c}^{\\circ}=${v[2]}$도 준비해요.`,
      `$${substitution}$에서 제곱·곱셈·나눗셈부터 해요.`];
  });
  for (const fn of ['s', 'c', 't']) concept('r2-3', `${fnName[fn]} 변화`, `${fnName[fn]}은 ${fn === 'c' ? '감소' : '증가'}한다`, [
    '예각 θ를 30°에서 60°까지 키워 보아요.', `${fnName[fn]}에 해당하는 ${fn === 's' ? '분홍' : fn === 'c' ? '하늘색' : '초록'} 막대를 따라가요.`,
    '각이 변할 때 같은 색 막대의 길이를 비교해요.', '45°에서는 sin과 cos가 같고 tan은 1이에요.',
    fn === 't' ? '90°에 가까울수록 길어지며 tan 90°는 없어요.' : '0°와 90°에서 0과 1의 끝값도 확인해요.',
    `예각이 커지면 ${fnName[fn]}은 ${fn === 'c' ? '감소' : '증가'}한다는 규칙이에요.`
  ], { motion: { t23: 60 }, question: `0°<θ<90°에서 각 θ가 커질수록 ${fnName[fn]} θ는 어떻게 변할까요?` });
  for (const right of [false, true]) problem('r2-3', right ? '옳은 비교' : '틀린 비교', q => q.solution.math.askRight === right, () => [
    right ? '보기 중 옳은 부등식이나 등식을 골라요.' : '보기 중 옳지 않은 부등식이나 등식을 골라요.', 'sin과 tan은 커지고 cos은 작아져요.',
    '45°에서 sin=cos이고 tan=1이에요.', '0°와 90°의 sin·cos 값도 따로 확인해요.',
    '각의 크기와 함수 종류를 함께 보고 기호를 판단해요.'
  ]);
  // Source ABS_FORMS has seven expressions, but three regenerate because they
  // cannot form four distinct distractors. These four are the returned families.
  // Both source ranges are covered; the first two lessons teach the sign method.
  const absForms = [
    [S`\sqrt{(\sin x-\cos x)^2}+\sqrt{(\sin x-1)^2}`, 'sin두근'],
    [S`\sqrt{(\tan x-1)^2}+\sqrt{(1-\tan x)^2}`, 'tan두근'],
    [S`\sqrt{(1-\cos x)^2}+\sqrt{(\cos x-\sin x)^2}`, 'cos두근'],
    [S`\sqrt{(\sin x-\cos x)^2}-\sqrt{(\cos x-1)^2}`, '근호 차']
  ];
  for (let f = 0; f < absForms.length; f++) for (const lo of [true, false]) {
    const [expression, label] = absForms[f], q = fixed('absSignJudge', q => q.solution.math.expression === expression && (q.solution.math.range[0] === 0) === lo);
    const opened = [
      lo ? S`(\cos x-\sin x)+(1-\sin x)` : S`(\sin x-\cos x)+(1-\sin x)`,
      lo ? S`(1-\tan x)+(1-\tan x)` : S`(\tan x-1)+(\tan x-1)`,
      lo ? S`(1-\cos x)+(\cos x-\sin x)` : S`(1-\cos x)+(\sin x-\cos x)`,
      lo ? S`(\cos x-\sin x)-(1-\cos x)` : S`(\sin x-\cos x)-(1-\cos x)`
    ][f];
    const captions = [lo ? '$0^{\\circ}\\lt x\\lt45^{\\circ}$인 범위를 먼저 읽어요.' : '$45^{\\circ}\\lt x\\lt90^{\\circ}$인 범위를 먼저 읽어요.',
      '각 제곱근을 $\\sqrt{U^2}=|U|$로 바꾸어요.',
      lo ? '$\\sin x<\\cos x$, $\\tan x<1$이에요.' : '$\\sin x>\\cos x$, $\\tan x>1$이에요.',
      '예각에서는 sin과 cos가 0보다 크고 1보다 작아요.', `$${opened}$로 풀고 동류항을 모아요.`, `정리하면 ${choice(q)}예요.`];
    add('absSignJudge', f === 0 ? (lo ? '음수 원리' : '양수 원리') : `${label}${lo ? '↓' : '↑'}`, captions,
      { q, problem: f !== 0, useProblem: true, answer: choice(q), question: q.stem });
  }

  // ③ 사분원과 표 — 선분↔각, 행/열 읽기, 근삿값 계산과 기울기.
  concept('unitCircle', '길이로 읽기', '$AB=\\frac12,\\ OB=\\frac{\\sqrt3}{2},\\ CD=\\frac{\\sqrt3}{3}$', [
    '반지름 OA와 OC는 1이고 θ는 30°예요.', 'A에서 수선 AB를 내려 직각삼각형 OAB를 보아요.',
    '안쪽은 빗변 OA=1, 바깥쪽은 이웃변 OC=1이에요.', 'sin은 AB/OA, cos은 OB/OA, tan은 CD/OC예요.',
    '각 분모가 1이므로 특수각 값을 길이로 읽어요.',
    '$AB=\\frac12,\\ OB=\\frac{\\sqrt3}{2},\\ CD=\\frac{\\sqrt3}{3}$예요.'
  ], { initial: { t31: 30 }, question: '반지름 1, θ=30°인 사분원에서 AB, OB, CD의 길이를 삼각비로 구해 보세요.' });
  for (const ask of ['seg', 'ang']) for (const fn of ['s', 'c', 't']) problem('unitCircle', `${fnName[fn]}${ask === 'seg' ? '→변' : '→각'}`,
    q => q.solution.math.ask === ask && q.solution.math.fn === fn, (q, m) => {
      const sg = q.fig.seg, inner = fn !== 't';
      return [ask === 'seg' ? `반지름은 1, 기준각은 ${m.theta}°예요.` : `반지름은 1이고 $${sg}=${q.fig.value}$예요.`,
        `${inner ? 'OAB' : 'OCD'}에서 ${fnName[fn]}의 두 변을 골라요.`,
        inner ? 'sin·cos의 분모는 빗변 OA=1이에요.' : 'tan의 분모는 이웃변 OC=1이에요.',
        ask === 'seg' ? `$x=${G.FN[fn]}${m.theta}^{\\circ}$의 특수각 값을 찾아요.` : `$${G.FN[fn]} x=${q.fig.value}$인 예각을 찾아요.`,
        ask === 'seg' ? '분모가 1이므로 구한 비가 곧 선분 길이예요.' : `특수각 표의 ${fnName[fn]} 열에서 같은 값을 읽어요.`];
    });
  {
    const q = fixed('whyOuterTan', q => q.solution.math.expression === S`\tan\theta` && q.fig.th === 30);
    concept('whyOuterTan', '바깥 높이', '$\\tan\\theta=CD$', [
      '안쪽 OAB와 바깥쪽 OCD는 각 θ를 공유해요.', '두 삼각형은 직각도 같아서 AA 닮음이에요.',
      '안쪽의 tan은 높이 AB를 밑변 OB로 나눈 값이에요.', '바깥쪽에서는 높이를 CD, 밑변을 OC로 읽어요.',
      '$OC=1$이므로 $CD/OC=CD/1$이에요.', '따라서 $\\tan\\theta=CD$예요.'
    ], { q, useProblem: true, question: '반지름이 1인 사분원에서 tan θ를 바깥 선분 하나로 읽는 이유를 알아보세요.', line: 'tan θ = AB/OB = CD/OC = CD' });
  }
  for (const [label, expression] of [['sin 선분', S`\sin\theta`], ['cos 선분', S`\cos\theta`], ['tan 선분', S`\tan\theta`],
    ['여각sin', S`\sin(90^{\circ}-\theta)`], ['여각cos', S`\cos(90^{\circ}-\theta)`]]) problem('whyOuterTan', label,
    q => q.solution.math.expression === expression, (q, m) => [
      `지금 구하는 삼각비는 $${m.expression}$예요.`, '반지름 OA와 OC의 길이가 1인지 확인해요.',
      '안쪽 OAB와 바깥쪽 OCD를 구별해요.',
      expression.includes('90') ? '90°−θ는 θ와 대변·이웃변의 역할이 바뀌어요.' : '분모가 빗변인지 이웃변인지 확인해요.',
      `$${m.expression}=\\overline{${m.segment}}$로 연결해요.`
    ]);
  {
    const q = fixed('r3-1'), m = q.solution.math;
    concept('r3-1', '표 읽기', '각의 행과 함수의 열이 만나는 칸', [
      `먼저 표 왼쪽에서 ${m.angles[0]}°의 행을 찾아요.`, `다음은 ${fnName[m.functions[0]]}이라는 열 이름을 찾아요.`,
      '그 행을 가로로 따라가 해당 열의 칸을 읽어요.', `$${G.FN[m.functions[0]]}${m.angles[0]}^{\\circ}\\approx${G.d4(m.values[0])}$예요.`,
      '다른 항도 같은 방법으로 각과 함수를 확인해요.', '각의 행과 함수의 열이 만나는 칸을 읽으면 돼요.'
    ], { q, useProblem: true, question: '삼각비의 표에서 원하는 값을 읽을 때 어느 행과 어느 열을 찾아야 할까요?' });
  }
  for (const op of ['+', '-']) problem('r3-1', op === '+' ? '표에서 합' : '표에서 차', q => q.solution.math.op === op, (q, m) => [
    `$${G.FN[m.functions[0]]}${m.angles[0]}^{\\circ}${op}${G.FN[m.functions[1]]}${m.angles[1]}^{\\circ}$를 구해요.`,
    '각은 행에서, 함수 이름은 열에서 찾아요.',
    `첫 칸은 $${G.FN[m.functions[0]]}${m.angles[0]}^{\\circ}\\approx${G.d4(m.values[0])}$예요.`,
    `둘째 칸은 $${G.FN[m.functions[1]]}${m.angles[1]}^{\\circ}\\approx${G.d4(m.values[1])}$예요.`,
    `표의 값으로 $${G.d4(m.values[0])}${op}${G.d4(m.values[1])}$를 계산해요.`
  ]);
  {
    const q = fixed('r3-2', q => q.solution.math.fn === 's'), m = q.solution.math;
    concept('r3-2', '값→각 원리', `$x=${m.answer}^{\\circ}$`, [
      `$\\sin x=${G.d4(m.value)}$가 주어졌어요.`, '표의 sin 열에서 같은 소수를 먼저 찾아요.',
      'cos나 tan 열에 같은 수가 있어도 사용하지 않아요.', '찾은 칸에서 왼쪽으로 가서 각도 열을 읽어요.',
      '읽은 각의 sin 값이 주어진 수와 같은지 확인해요.', `따라서 $x=${m.answer}^{\\circ}$예요.`
    ], { q, useProblem: true, question: q.html });
  }
  for (const fn of ['s', 'c', 't']) problem('r3-2', `${fnName[fn]}역읽기`, q => q.solution.math.fn === fn, (q, m) => [
    `$${G.FN[fn]} x=${G.d4(m.value)}$에서 함수를 먼저 확인해요.`, `이번에는 표의 ${fnName[fn]} 열만 내려가며 읽어요.`,
    `주어진 값 $${G.d4(m.value)}$와 일치하는 칸을 찾아요.`, '그 칸과 같은 가로줄의 각도 열로 이동해요.',
    '각을 다시 같은 함수에 넣어 표의 값과 비교해요.'
  ]);
  for (const fn of ['s', 'c']) {
    const n = fn === 's' ? 'a' : 'b', value = fn === 's' ? .5736 : .8192, result = fn === 's' ? 5.736 : 8.192;
    concept('trigTableCalc', fn === 's' ? '대변 원리' : '이웃변 원리', `$${n}=${result}$`, [
      '빗변은 10이고 기준각 A는 35°예요.', `구하는 ${n}는 ${fn === 's' ? '맞은편 대변' : '옆의 이웃변'}이에요.`,
      `$${G.FN[fn]}35^{\\circ}=${frac(n, 10)}$로 놓아요.`, `주어진 표에서 $${G.FN[fn]}35^{\\circ}\\approx${value}$예요.`,
      `양변에 10을 곱해 $${n}=10\\times${value}$를 계산해요.`, `표의 근삿값으로 계산하면 $${n}=${result}$예요.`
    ], { question: `빗변 10, 각 A=35°일 때 ${fn === 's' ? 'sin 35°≈0.5736으로 대변 a' : 'cos 35°≈0.8192로 이웃변 b'}를 구해 보세요.` });
  }
  for (const kind of ['hs', 'hc', 'bt']) problem('trigTableCalc', { hs: '빗변×sin', hc: '빗변×cos', bt: '밑변×tan' }[kind],
    q => q.key.split('|')[2] === kind, (q, m) => [
      `각은 ${m.theta}°, 주어진 ${kind === 'bt' ? '이웃변' : '빗변'}은 ${m.length}예요.`, `x는 ${kind === 'hc' ? '이웃변' : '대변'}이므로 ${fnName[m.fn]}을 써요.`,
      `$${G.FN[m.fn]}${m.theta}^{\\circ}=${frac('x', m.length)}$예요.`, `문제에서 준 표의 값은 $${G.d4(m.value)}$예요.`,
      `$x=${m.length}\\times${G.d4(m.value)}$를 계산해요.`
    ]);
  {
    const q = fixed('lineSlope', q => q.solution.math.fn === 't' && q.solution.math.opposite === 3 && q.solution.math.adjacent === 4);
    concept('lineSlope', '기울기 원리', '기울기는 tan a와 같다', [
      '직선의 두 절편은 (−4, 0), (0, 3)이에요.', '두 점과 원점을 이어 직각삼각형을 만들어요.',
      '가로로 4만큼 갈 때 세로로 3만큼 올라가요.', '기울기는 세로 증가량÷가로 증가량이에요.',
      '$\\tan a=\\frac{3}{4}$도 같은 높이÷밑변이에요.', '따라서 이 직선의 기울기는 tan a와 같아요.'
    ], { q, useProblem: true, question: '이 직선이 x축과 이루는 예각 a의 tan 값은 기울기와 어떤 관계일까요?', line: '기울기 = tan a = 3/4' });
  }
  for (const fn of ['s', 'c', 't']) problem('lineSlope', `${fnName[fn]}구하기`, q => q.solution.math.fn === fn, (q, m) => {
    const c = Math.hypot(m.adjacent, m.opposite), n = fn === 'c' ? m.adjacent : m.opposite, d = fn === 't' ? m.adjacent : c;
    return [`절편은 $(-${m.adjacent},0)$, $(0,${m.opposite})$예요.`, '음수인 좌표와 양수인 선분 길이를 구별해요.',
      `기준각 a의 이웃변은 ${m.adjacent}, 대변은 ${m.opposite}예요.`, `$c=\\sqrt{${m.adjacent}^2+${m.opposite}^2}=${c}$예요.`,
      `$${G.FN[fn]} a=${frac(n, d)}$를 약분해요.`];
  });
})();
