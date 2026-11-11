/* 원의 성질 A — 현과 접선의 원문 문제를 고정하고 실제 도형을 단계별로 재생합니다. */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const groups = window.APL_CI_GROUPS || [];
  const ids = [...Array.from({ length: 7 }, (_, i) => `c1-${i + 1}`), ...Array.from({ length: 7 }, (_, i) => `c2-${i + 1}`)];
  const defs = Object.fromEntries(groups.flatMap(g => g.scenes).filter(s => ids.includes(s.id)).map(s => [s.id, s.ci]));
  const defaults = Object.fromEntries(groups.flatMap(g => Object.entries(g.params).map(([key, p]) => [key, p.value])));
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g9-circle'] = window.APL_LESSONS['g9-circle'] || {};
  const n = G.nt, S = String.raw, O = G.pt(0, 0);
  // Several source initializers clamp neighbouring controls. Seed those controls
  // from their real defaults, then retain only keys written by this initializer.
  function initialState(id) {
    const touched = new Set(), target = { ...defaults };
    defs[id].init(new Proxy(target, { set(obj, key, value) { obj[key] = value; touched.add(key); return true; } }));
    return Object.fromEntries([...touched].map(key => [key, target[key]]));
  }
  function source(id, variant = 0, accept) {
    for (let seed = 1; seed <= 200; seed++) {
      const pk = G.fixedPk(id, variant, seed);
      if (accept && !accept(pk)) continue;
      const state = { ...defaults, ...initialState(id), ciPk: pk, ciN: variant, ciSeed: 0 };
      return { pk, variant, solution: G.currentSolution(defs[id], state) };
    }
    throw new Error(`Missing circle A source family: ${id}/${variant}`);
  }
  const chosen = f => f.solution.question.choices.find(c => c.ok);
  const ordinal = f => G.NUM[f.solution.question.choices.findIndex(c => c.ok)];
  const answerLine = f => `따라서 $${f.solution.target}=${chosen(f).t}$, 정답은 ${ordinal(f)}이에요.`;
  const cue = (at, say, step, set) => ({ at, ...(say ? { say } : {}), ...(step == null ? {} : { step }), ...(set ? { set } : {}) });
  function add(id, label, f, lines, options = {}) {
    const init = { ...initialState(id), ...(options.initial || {}) }, concept = !options.problem;
    const folding = id === 'c1-5' || id === 'c1-6';
    if (folding) init.c1f = 0;
    const start = { ...Object.fromEntries(Object.entries(init).filter(([, v]) => typeof v === 'number')), ciATrace: 0 };
    const first = { ...Object.fromEntries(Object.entries(init).filter(([, v]) => typeof v !== 'number')),
      ciPk: f.pk, ciN: f.variant, ciSeed: 0, ciLessonProblem: !concept, ciLessonSource: options.source !== false,
      ciShowAnswer: false, ciCalculationReady: false, ciAQuestion: options.question || '',
      ciAHideQuery: concept && options.hideQuery !== false, ciACap: options.cap ?? 4, ciAMode: options.mode || '', ciALine: '' };
    const long = lines.length === 8, endIndex = long ? 7 : 5;
    const final = concept ? lines[endIndex] : lines[endIndex] || answerLine(f);
    const finalSet = { ciShowAnswer: true, ciALine: options.line || '' };
    const chapters = [
      { title: '조건과 구할 부분', length: 12, start, cues: [cue(0, lines[0], 0, first),
        { at: .5, to: folding ? { c1f: 1 } : { ciATrace: 1 }, dur: 4, ease: 'linear' }, cue(6, lines[1], 2)] },
      { title: '성질과 풀이 전략', length: 12, cues: [cue(0, lines[2], 3), cue(6, lines[3], 3)] }
    ];
    if (long) {
      chapters.push({ title: '식을 세우고 정리', length: 12, cues: [cue(0, lines[4], 4, { ciCalculationReady: true }), cue(6, lines[5], 4)] });
      chapters.push({ title: '계산과 결론', length: 12, cues: [cue(0, lines[6], 4), cue(6, final, 5, finalSet)] });
    } else chapters.push({ title: '계산과 결론', length: 12, cues: [cue(0, lines[4], 4, { ciCalculationReady: true }), cue(6, final, 5, finalSet)] });
    (lessons[id] = lessons[id] || []).push({ label, title: options.title || label, tab: 'review',
      answer: concept ? options.answer : ordinal(f), answerText: concept ? options.answer : `${ordinal(f)} $${chosen(f).t}$`,
      summary: '조건에서 직각삼각형과 같은 길이를 찾아 식으로 연결해요.',
      task: '직접 해 보기에서 길이나 위치를 바꾸고 같은 성질을 다시 확인해 보세요.', chapters });
  }
  const concept = (id, label, f, answer, lines, options = {}) => add(id, label, f, lines, { ...options, answer });
  function problem(id, label, variant, build, options = {}) {
    const f = source(id, variant, options.accept), content = build(f.pk, f.solution);
    add(id, label, f, content.lines || content, { ...options, ...(content.lines ? content : {}), problem: true });
  }

  // Trace actual source edges and a source circle, with no independent geometry.
  // The visible portion grows before one second; replay initializes the progress.
  function trace(b, s, C, draw) {
    const t = C.entry || C.step !== 0 ? 0 : G.clamp(s.ciATrace || 0, 0, 1);
    if (!t) { draw(); return; }
    const path = b.path, circle = b.circle, edges = [], circles = [], seen = new Set();
    b.path = function (points, options = {}) {
      if (points.length > 1 && options.width >= 2.4 && !options.dash && edges.length < 2) {
        const a = points[0], z = points[1], key = `${a.x},${a.y}:${z.x},${z.y}`;
        if (!seen.has(key)) { seen.add(key); edges.push([a, z]); }
      }
      return path.call(this, points, options);
    };
    b.circle = function (center, radius, options) { if (!circles.length && radius > 0) circles.push([center, radius]); return circle.call(this, center, radius, options); };
    try { draw(); } finally { b.path = path; b.circle = circle; }
    for (const [a, z] of edges) G.line(b, a, G.lerp(a, z, t), 'violet', 4.8, { alpha: .8 });
    for (const [center, radius] of circles) G.arcD(b, center, radius, 0, 120 * t, 'violet', 4.8);
  }
  for (const id of ids) {
    const D = defs[id];
    D.lessonQuestion = (M, s) => s.ciLessonProblem ? null : s.ciAQuestion || D.question;
    if (id === 'c1-5' || id === 'c1-6') D.lessonModel = (M, s) => ({ ...M, f: s.lessonEntry ? 0 : s.c1f });
    D.lessonDraw = (b, s, M, C, sol) => {
      const stage = C.entry ? 0 : C.answer ? 5 : Math.min(C.step, C.calculation ? 4 : 3, s.ciACap ?? 4);
      const text = b.text;
      // A theorem lesson uses the same givens without asking the unrelated
      // numerical query from its source example. Keep all given labels intact.
      if (s.ciAHideQuery) b.text = function (x, y, value, options) { if (typeof value === 'string' && /(?:^x$|=x$|둘레 x$)/.test(value)) return; return text.call(this, x, y, value, options); };
      try {
        trace(b, s, C, () => {
          if (s.ciLessonProblem || s.ciLessonSource) {
            D.draw(b, s, M, { ...C, ...G.PC, lesson: true, review: true, t: C.t });
            if (sol.draw) sol.draw(b, stage);
          } else D.draw(b, s, M, { ...C, problem: false, review: true, full: false, step: stage });
        });
      } finally { b.text = text; }
      return true;
    };
    D.lessonAfterDraw = (b, s, M, C) => {
      if (C.entry) return;
      if (id === 'c1-5' && C.step >= 3 && (s.ciLessonProblem && M.q.kind !== 2 || s.ciAMode === 'fold-angle')) {
        const H = G.pt(0, M.R / 2), A = G.pt(-M.R * Math.sqrt(3) / 2, M.R / 2);
        G.segTag(b, O, H, M.q.kind === 1 ? 'OM=R/2' : `OM=${G.cv(M.R / 2)}`, { toward: G.pt(M.R, 0), color: 'green', size: 15 });
        if (C.calculation && M.q.kind === 3) {
          G.ang(b, O, A, H, { label: '60°', color: 'green', r: 23, size: 14 });
          G.ang(b, A, O, H, { label: '30°', color: 'green', r: 23, size: 14 });
        }
      }
      if (id === 'c1-6' && s.ciLessonProblem && M.q.kind === 1 && C.step >= 3)
        G.segTag(b, O, G.pt(-M.R * Math.sqrt(3) / 2, M.R / 2), `R=${M.R}`, { away: G.pt(0, M.R / 2), color: 'green', size: 15 });
      if (s.ciALine && C.answer) b.stext(b.W / 2, b.H - 22, s.ciALine, { color: 'green', size: b.W < 560 ? 13 : 16, weight: 800, align: 'center', baseline: 'middle' });
    };
  }

  // ① 현 — 합동, 피타고라스, 접기, 아치의 방정식.
  concept('c1-1', '수직이등분', source('c1-1'), '$AM=BM$', [
    'O는 원의 중심이고 OM은 현 AB에 수직이에요.', '직각삼각형 OAM과 OBM을 나누어 보아요.',
    'OA와 OB는 같은 원의 반지름이에요.', 'OM은 공통이므로 두 삼각형은 RHS 합동이에요.',
    '합동인 두 삼각형에서 대응하는 변을 찾아요.', '따라서 AM=BM, 수선은 현을 이등분해요.'
  ], { question: '원의 중심에서 현 AB에 내린 수선의 발 M은 현의 어디에 있을까요?', cap: 1, line: 'AM = BM : 중심에서 내린 수선은 현을 이등분' });
  for (const [k, label] of ['거리 OM', '현 AB', '반지름 R'].entries()) problem('c1-1', label, k, q => [
    k === 0 ? `$OA=${q.R}$, $AB=${2 * q.am}$이고 OM을 구해요.` : k === 1 ? `$OA=${q.R}$, $OM=${q.om}$이고 AB를 구해요.` : `$AB=${2 * q.am}$, $OM=${q.om}$에서 R을 구해요.`,
    '중심에서 내린 수선이므로 AM과 BM은 같아요.',
    k === 1 ? '현 전체보다 반쪽 AM을 먼저 구해요.' : `$AM=AB/2=${q.am}$으로 현을 나누어요.`,
    '직각삼각형 OAM의 빗변은 OA예요.',
    k === 0 ? `$OM^2=${q.R}^2-${q.am}^2$에서 양의 길이를 찾아요.` : k === 1 ? `$AM=\\sqrt{${q.R}^2-${q.om}^2}$의 두 배가 AB예요.` : `$R=\\sqrt{${q.am}^2+${q.om}^2}$를 계산해요.`
  ]);
  const distanceFixture = source('c1-2', 0, q => q.d1 !== q.d2);
  concept('c1-2', '거리와 현', distanceFixture, '중심에서 멀수록 현이 짧다', [
    '같은 원에 두 현 AB와 CD가 있어요.', '중심에서 현까지 내린 수선 OM과 ON을 보아요.',
    '두 직각삼각형의 빗변은 같은 반지름이에요.', '거리의 제곱이 커지면 현 반쪽의 제곱은 작아져요.',
    '$AM^2=R^2-OM^2$로 두 길이를 비교해요.', '따라서 중심에서 멀수록 현의 길이는 짧아요.'
  ], { question: '반지름이 같은 원에서 중심과 현 사이의 거리가 커지면 현의 길이는 어떻게 될까요?', line: '중심에서 멀수록 현은 짧아진다' });
  concept('c1-2', '가장 긴 현', source('c1-2'), '중심을 지나는 지름', [
    '현 AB가 중심 O를 지나도록 놓았어요.', '중심에서 현까지의 거리는 0이에요.',
    '현의 반쪽은 한 반지름과 같아져요.', '다른 현은 중심에서 떨어져 있어 반쪽이 더 짧아요.',
    '현의 전체 길이는 반쪽 길이의 두 배예요.', '가장 긴 현은 중심을 지나는 지름이에요.'
  ], { source: false, initial: { c1R: 10, c1d: 0 }, cap: 2, question: '한 원에서 어떤 현의 길이가 가장 길까요?', line: '가장 긴 현 = 지름 = 2R' });
  for (const [k, label] of ['현 CD', '다른 거리'].entries()) problem('c1-2', label, k, q => [
    `$AB=${2 * q.a1}$, $OM=${q.d1}$을 먼저 확인해요.`,
    k === 0 ? `$ON=${q.d2}$에서 현 CD를 구해요.` : `$CD=${2 * q.a2}$에서 거리 ON을 구해요.`,
    `$AM=${q.a1}$이므로 $R^2=${q.a1}^2+${q.d1}^2$예요.`,
    '다른 직각삼각형 OCN도 빗변이 같은 반지름이에요.',
    k === 0 ? `$CN=\\sqrt{${q.R ** 2}-${q.d2}^2}$의 두 배가 CD예요.` : `$ON=\\sqrt{${q.R ** 2}-${q.a2}^2}$를 계산해요.`
  ]);
  for (const reverse of [false, true]) concept('c1-3', reverse ? '같은 현' : '같은 거리', source('c1-3', reverse ? 1 : 0), reverse ? '$OM=ON$' : '$AB=CD$', [
    reverse ? '같은 원에서 현 AB와 CD의 길이가 같아요.' : '같은 원에서 두 현까지의 거리 OM과 ON이 같아요.',
    '두 현에 내린 수선은 각각 현을 이등분해요.',
    reverse ? '두 현의 반쪽 AM과 CN도 같은 길이예요.' : '직각삼각형 OAM과 OCN의 빗변은 반지름이에요.',
    '두 직각삼각형은 RHS 합동이 돼요.',
    '합동인 삼각형의 대응변을 연결해요.',
    reverse ? '따라서 같은 길이의 현은 중심까지 거리도 같아요.' : '따라서 같은 거리에 있는 두 현의 길이는 같아요.'
  ], { question: reverse ? '한 원에서 길이가 같은 두 현은 중심에서의 거리도 같을까요?' : '한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 어떨까요?', cap: 1, line: reverse ? 'AB = CD → OM = ON' : 'OM = ON → AB = CD' });
  for (const [k, label] of ['현 CD', '거리 ON', '반지름'].entries()) problem('c1-3', label, k, q => [
    k === 0 ? `$R=${q.R}$, $OM=ON=${q.om}$에서 CD를 구해요.` : k === 1 ? `$R=${q.R}$, $AB=CD=${2 * q.am}$에서 ON을 구해요.` : `$OM=ON=${q.om}$, $CD=${2 * q.am}$에서 R을 구해요.`,
    '중심에서 내린 수선은 두 현을 이등분해요.',
    '직각삼각형 OCN에서 OC가 빗변이에요.',
    k === 0 ? '반쪽 CN을 구하고 두 배 하면 CD예요.' : `$CN=CD/2=${q.am}$이에요.`,
    k === 0 ? `$CD=2\\sqrt{${q.R}^2-${q.om}^2}$를 계산해요.` : k === 1 ? `$ON=\\sqrt{${q.R}^2-${q.am}^2}$를 계산해요.` : `$R=\\sqrt{${q.am}^2+${q.om}^2}$를 계산해요.`
  ]);
  concept('c1-4', '넓이와 현', source('c1-4', 1), '$S=\\pi AM^2$', [
    '두 원은 중심이 같고 현 AB는 작은 원에 접해요.', '접점 M의 반지름 OM은 현 AB와 수직이에요.',
    '따라서 AM은 현 AB의 절반이에요.', '$OA^2-OM^2=AM^2$인 직각삼각형을 보아요.',
    '두 원의 넓이 차는 반지름 제곱의 차에 π를 곱해요.', '따라서 두 원 사이의 넓이는 $\\pi AM^2$예요.'
  ], { question: '큰 원의 현 AB가 작은 원에 접할 때 두 원 사이의 넓이를 현의 길이로 나타내 보세요.', line: '두 원 사이의 넓이 = π × (현의 절반)²' });
  for (const [k, label] of ['반지름→넓이', '현→넓이', '작은원 넓이'].entries()) problem('c1-4', label, k, q => [
    k === 0 ? `$R=${q.R}$, $r=${q.om}$인 두 원 사이의 넓이를 구해요.` : `$AB=${2 * q.am}$이고 작은 원에 접하는 현이에요.`,
    '접점 M에서 OM과 AB는 수직이에요.',
    k === 0 ? '큰 원의 넓이에서 작은 원의 넓이를 빼요.' : `$AM=AB/2=${q.am}$이에요.`,
    k === 2 ? `$R=${q.R}$이고 $r^2=R^2-AM^2$예요.` : '$R^2-r^2=AM^2$를 넓이 차에 사용해요.',
    k === 0 ? `$S=\\pi(${q.R}^2-${q.om}^2)$를 계산해요.` : k === 1 ? `$S=\\pi\\times${q.am}^2$를 계산해요.` : `$S=\\pi(${q.R}^2-${q.am}^2)$를 계산해요.`
  ]);
  concept('c1-5', '접기와 거리', source('c1-5', 2), '$OM=R/2$', [
    '호 AB를 접어 중심 O를 지나게 만들어요.', '접힌 원의 중심 O′은 O를 대칭이동한 점이에요.',
    '접는 선 AB는 선분 OO′의 수직이등분선이에요.', 'O가 접힌 원 위에 있으므로 O′O는 반지름이에요.',
    'M은 OO′의 중점이므로 반지름을 둘로 나누어요.', '따라서 접는 선까지의 거리는 $OM=R/2$예요.'
  ], { question: '접힌 호가 원의 중심 O를 지날 때 OM과 반지름 R은 어떤 관계일까요?', line: 'OO′ = R, OM = OO′/2 = R/2' });
  concept('c1-5', '접기와 각', source('c1-5', 3), '$\\angle AOB=120^{\\circ}$', [
    '접힌 호가 중심 O를 지나도록 접어요.', '대칭인 중심 O′을 표시하면 O′O는 반지름이에요.',
    'M은 OO′의 중점이므로 OM은 R의 절반이에요.', '직각삼각형 OAM에서 OA는 OM의 두 배예요.',
    '각 AOM은 60°이고 OM은 각 AOB를 이등분해요.', '따라서 $\\angle AOB=120^{\\circ}$예요.'
  ], { question: '접힌 호가 원의 중심을 지날 때 두 반지름 OA, OB 사이의 각은 얼마일까요?', hideQuery: false, mode: 'fold-angle', line: '∠AOB = 2 × 60° = 120°' });
  for (const [k, label] of ['현 AB', '현→반지름', '접는 거리', '중심각'].entries()) problem('c1-5', label, k, q => [
    k === 1 ? `$AB=${n(Math.sqrt(3) * q.R)}$인 원을 중심까지 접어요.` : `$R=${q.R}$인 원의 호를 중심 O까지 접어요.`,
    '접힌 중심 O′과 원래 중심 O는 현에 대해 대칭이에요.',
    'O′O는 반지름이고 M은 OO′의 중점이에요.',
    k === 2 ? '$OM=R/2$로 접는 거리를 구해요.' : '직각삼각형 OAM에서 $OM=R/2$예요.',
    k === 0 ? `$AB=\\sqrt3\\times${q.R}$를 계산해요.` : k === 1 ? `$${n(Math.sqrt(3) * q.R)}=\\sqrt3R$을 풀어요.` : k === 2 ? `$OM=${q.R}/2$를 계산해요.` : '각 AOM=60°이므로 중심각은 그 두 배예요.'
  ]);
  for (const [d, label, answer] of [[3, '중심 넘어감', '접힌 호가 O를 지나 넘어간다'], [5, '중심 지남', '접힌 호가 O를 지난다'], [7, '중심 미도달', '접힌 호가 O에 닿지 못한다']]) concept('c1-6', label, source('c1-6'), answer, [
    `반지름은 10이고 접는 거리 OM은 ${d}예요.`, '접는 선에 대해 원의 중심 O도 O′으로 이동해요.',
    `대칭이므로 $OO′=2OM=${2 * d}$예요.`, '접힌 원의 반지름은 원래 반지름 10과 같아요.',
    '중심 사이의 거리 OO′과 반지름 10을 비교해요.',
    d < 5 ? 'O가 접힌 원 안에 있어 호는 O를 넘어가요.' : d === 5 ? 'OO′이 반지름과 같아서 접힌 호가 O를 지나요.' : 'OO′이 반지름보다 커서 접힌 호가 O에 못 닿아요.'
  ], { source: false, initial: { c1R: 10, c1d: d }, question: `반지름 10인 원을 OM=${d}인 현을 따라 접으면 접힌 호와 O는 어떤 위치 관계일까요?`, line: `OO′ = ${2 * d} ${d < 5 ? '<' : d === 5 ? '=' : '>'} R = 10` });
  for (const [k, label] of ['거리 OM', '현 AB', '원 반지름'].entries()) problem('c1-6', label, k, q => [
    k === 0 ? `$R=${2 * q.k}$인 원의 접힌 호가 O를 지나요.` : `$OM=${q.k}$이고 접힌 호가 중심 O를 지나요.`,
    '접힌 중심 O′은 O를 현 AB에 대칭이동한 점이에요.',
    'M은 OO′의 중점이고 OO′은 반지름이에요.',
    k === 1 ? `$R=2OM=${2 * q.k}$인 직각삼각형 OAM을 보아요.` : '$R=2OM$의 관계를 사용해요.',
    k === 0 ? `$OM=${2 * q.k}/2$를 계산해요.` : k === 1 ? `$AB=2\\sqrt{${2 * q.k}^2-${q.k}^2}$를 계산해요.` : `$R=2\\times${q.k}$를 계산해요.`
  ]);
  const archFixture = source('c1-7');
  concept('c1-7', '반지름 식', archFixture, '$R=(AM^2+CM^2)/(2CM)$', [
    '현의 반쪽 AM과 아치 높이 CM을 알고 있어요.', '현의 수직이등분선 위에 원의 중심 O가 있어요.',
    '반지름을 R, 높이를 h라 두면 OM은 R−h예요.', '$R^2=AM^2+(R-h)^2$로 식을 세워요.',
    '양변의 R²을 지우고 R이 있는 항을 모아요.', '따라서 $R=(AM^2+h^2)/(2h)$예요.'
  ], { question: '현의 길이와 아치의 높이만으로 원의 반지름을 구하는 식을 만들어 보세요.', line: 'R = (AM² + CM²) ÷ (2CM)' });
  for (const [k, label] of ['반지름 계산', '아치의 현', '아치의 높이'].entries()) problem('c1-7', label, k, q => k === 0 ? [
    `$AB=${2 * q.am}$, $CM=${q.h}$에서 반지름 R을 구해요.`, `$AM=${q.am}$이고 O, M, C는 일직선이에요.`,
    `$OM=R-${q.h}$로 나타내요.`, '직각삼각형 OAM에서 OA가 빗변이에요.',
    `$R^2=${q.am}^2+(R-${q.h})^2$를 전개해요.`, `$R^2=${q.am ** 2}+R^2-${2 * q.h}R+${q.h ** 2}$예요.`,
    `$${2 * q.h}R=${q.am ** 2 + q.h ** 2}$에서 R을 구해요.`, null
  ] : [
    k === 1 ? `$R=${q.R}$, $CM=${q.h}$에서 현 AB를 구해요.` : `$R=${q.R}$, $AB=${2 * q.am}$에서 CM을 구해요.`,
    'O, M, C는 현의 수직이등분선 위에 있어요.',
    k === 1 ? `$OM=R-CM=${q.R - q.h}$이에요.` : `$AM=AB/2=${q.am}$이에요.`,
    '직각삼각형 OAM의 빗변은 반지름 OA예요.',
    k === 1 ? `$AB=2\\sqrt{${q.R}^2-${q.R - q.h}^2}$를 계산해요.` : `$CM=${q.R}-\\sqrt{${q.R}^2-${q.am}^2}$를 계산해요.`
  ]);
})();
