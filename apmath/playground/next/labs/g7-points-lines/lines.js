/* ==========================================================================
   중1 · 기본 도형 — 탭 "② 직선·반직선·선분" (lines.js, order 20)
   개념 5장면(반직선 AB와 BA · 직선·반직선·선분 · 같은 반직선 · 공통부분 · 두 점 사이의 거리) +
   개수 3장면(한 직선 위의 n점 · 어느 세 점도 한 직선 위에 없는 n점 · 일부 점이 한 직선 위)
   - 점은 눈금 위(cm)에서 가로로만 끕니다. 길이·개수·이름은 모두 지금 위치에서 다시 계산합니다.
   - 색: 하늘=직선 · 보라=반직선 · 초록=선분(구하는 값) · 분홍=비교(다른 것) · 노랑=끌 수 있는 점
   ========================================================================== */
(function () {
  'use strict';
  const PL = window.APL_PL;
  if (!PL) return;
  const { clamp, T, C2 } = PL;
  const LET = 'ABCDEFGH';
  const XL = -1.0, XR = 13.0; // 직선·반직선이 그려지는 왼쪽·오른쪽 끝
  const al = (st, on) => (st >= 99 || on ? 1 : 0.28);

  const PARAMS = {
    lrA: { value: 3, min: 0, max: 12, step: 1, color: 'amber', label: '점 A의 위치', format: (v) => `${v} cm`, onInput: (s) => { if (s.lrA === s.lrB) s.lrB = s.lrA < 12 ? s.lrA + 1 : s.lrA - 1; } },
    lrB: { value: 8, min: 0, max: 12, step: 1, color: 'amber', label: '점 B의 위치', format: (v) => `${v} cm`, onInput: (s) => { if (s.lrA === s.lrB) s.lrA = s.lrB < 12 ? s.lrB + 1 : s.lrB - 1; } },
    ltL: { value: 5, min: 1, max: 10, step: 1, color: 'green', label: '선분 AB의 길이', format: (v) => `${v} cm` },
    lsH: { value: 2, min: 1.5, max: 3, step: 0.5, color: 'rose', label: '돌아가는 길의 높이', format: (v) => `${v}` },
    lcn: { value: 5, min: 3, max: 7, step: 1, color: 'amber', label: '점의 개수 n', format: (v) => `${v}개`, onInput: (s) => { s.lcf = Math.min(s.lcf, s.lcn - 1); s.lcx = null; } },
    lcf: { value: 0, min: 0, max: 6, step: 1, color: 'green', label: '선분을 세는 기준 점', format: (v, s) => LET[Math.min(v, (s ? s.lcn : 7) - 1)], onInput: (s) => { s.lcf = Math.min(s.lcf, s.lcn - 1); } },
    lgn: { value: 5, min: 3, max: 8, step: 1, color: 'amber', label: '점의 개수 n', format: (v) => `${v}개`, onInput: (s) => { s.lgm = s.lgn; } },
    lgm: { value: 5, min: 2, max: 8, step: 1, color: 'green', label: '이어 본 점의 개수', hint: '점을 하나씩 더하며 새로 생기는 선을 세어 보세요', format: (v, s) => `${Math.min(v, s ? s.lgn : 8)}개`, onInput: (s) => { s.lgm = Math.min(s.lgm, s.lgn); } },
    lkn: { value: 6, min: 4, max: 7, step: 1, color: 'amber', label: '전체 점의 개수 n', format: (v) => `${v}개`, onInput: (s) => { s.lkk = Math.min(s.lkk, s.lkn - 1); } },
    lkk: { value: 4, min: 3, max: 6, step: 1, color: 'green', label: '한 직선 위의 점 k', format: (v, s) => `${Math.min(v, s ? s.lkn - 1 : 6)}개`, onInput: (s) => { s.lkk = Math.min(s.lkk, s.lkn - 1); } }
  };
  // 네 점 A·B·C·D 의 위치(공통 상태): lp0 < lp1 < lp2 < lp3
  ['lp0', 'lp1', 'lp2', 'lp3'].forEach((k, i) => { PARAMS[k] = { value: [1, 4, 8, 11][i], min: 0, max: 12, step: 1, color: 'amber', label: `점 ${LET[i]}의 위치`, format: (v) => `${v} cm` }; });
  const P4 = ['lp0', 'lp1', 'lp2', 'lp3'];
  // 정렬을 지키며 i번째 점 옮기기(점 사이 간격 ≥ 1 cm)
  const move4 = (s, i, x) => { const lo = i === 0 ? 0 : s[P4[i - 1]] + 1, hi = i === 3 ? 12 : s[P4[i + 1]] - 1; s[P4[i]] = clamp(Math.round(x), lo, hi); };
  PARAMS.lp0.onInput = (s) => { s.lp0 = Math.min(s.lp0, s.lp1 - 1); };
  PARAMS.lp1.onInput = (s) => { s.lp1 = clamp(s.lp1, s.lp0 + 1, s.lp2 - 1); };
  PARAMS.lp2.onInput = (s) => { s.lp2 = clamp(s.lp2, s.lp1 + 1, s.lp3 - 1); };
  PARAMS.lp3.onInput = (s) => { s.lp3 = Math.max(s.lp3, s.lp2 + 1); };
  const xs4 = (s) => P4.map((k) => s[k]);

  const rowLabel = (b, y, text, color, st, on) => b.text({ x: XL, y: y - 0.62 }, text, { color, size: 15, weight: 800, align: 'left', baseline: 'middle', alpha: al(st, on) });
  const straight = (b, y, color, alpha, w = 3.8) => {
    const m = (XL + XR) / 2;
    PL.arrow(b, { x: m, y }, { x: XL, y }, { color, alpha, width: w });
    PL.arrow(b, { x: m, y }, { x: XR, y }, { color, alpha, width: w });
  };
  // 반직선: 시작점 x0 에서 dir(+1 오른쪽, −1 왼쪽)으로
  const ray = (b, y, x0, dir, color, alpha, w = 3.8) => {
    PL.arrow(b, { x: x0, y }, { x: dir > 0 ? XR : XL, y }, { color, alpha, width: w });
    b.point({ x: x0, y }, { color, r: 6 });
  };
  const guide = (b, xsList, y0, y1) => xsList.forEach((x) => b.seg({ x, y: y0 }, { x, y: y1 }, { color: 'muted', width: 1.4, dash: [4, 6], alpha: 0.6 }));
  const pointsRow = (b, xs, names, y, colors) => xs.forEach((x, i) => { b.point({ x, y }, { color: 'ink', r: 5.5 }); PL.T(b, { x, y }, names[i], { dy: 21, size: 17, color: (colors && colors[i]) || 'ink' }); });
  const mainLine = (b, y) => b.seg({ x: XL, y }, { x: XR, y }, { color: 'muted', width: 1.8, alpha: 0.5 });

  // 해설에서는 주어진 점을 움직이지 않고, 그 점을 지나는 선을 실제로 그린다.
  // 직접 해 보기의 기존 도형·핸들·문제 생성은 아래 원래 경로를 그대로 사용한다.
  const lessonReady = (s, key = 'plShowAnswer') => !s.lessonEntry && s[key] === true;
  const lessonProgress = (s) => s.lessonEntry ? 0 : clamp(Number(s.plTrace) || 0, 0, 1);
  const trace = (b, A, B, s, color, arrowHead = false, width = 4) => {
    const p = lessonProgress(s);
    if (p <= 0) return;
    const end = { x: A.x + (B.x - A.x) * p, y: A.y + (B.y - A.y) * p };
    if (arrowHead && Math.hypot(end.x - A.x, end.y - A.y) * b.k > 18) PL.arrow(b, A, end, { color, width, head: 10 });
    else b.seg(A, end, { color, width });
  };
  const lessonLine = (b, s, y, color = 'sky') => {
    straight(b, y, 'muted', .3, 2);
    const A = { x: 6, y };
    trace(b, A, { x: XL, y }, s, color, true);
    trace(b, A, { x: XR, y }, s, color, true);
  };
  const lessonPairLine = (b, s, A, B, color) => {
    const len = Math.hypot(B.x - A.x, B.y - A.y), dx = .35 * (B.x - A.x) / len, dy = .35 * (B.y - A.y) / len;
    const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }, lo = { x: A.x - dx, y: A.y - dy }, hi = { x: B.x + dx, y: B.y + dy };
    PL.arrow(b, mid, lo, { color: 'muted', width: 1.4, alpha: .2, head: 7 }); PL.arrow(b, mid, hi, { color: 'muted', width: 1.4, alpha: .2, head: 7 });
    trace(b, mid, lo, s, color, true, 2); trace(b, mid, hi, s, color, true, 2);
  };
  const lessonRay = (b, s, y, x, dir, color) => {
    const A = { x, y }, B = { x: dir > 0 ? XR : XL, y };
    PL.arrow(b, A, B, { color: 'muted', width: 2, alpha: .3 });
    trace(b, A, B, s, color, true);
    b.point(A, { color, r: 6 });
  };
  const lessonLabel = (b, y, text, color = 'ink') => rowLabel(b, y, text, color, 99, true);
  const lessonText = (b, y, text, color = 'green') => T(b, { x: (XL + XR) / 2, y }, text, { color, size: 16 });
  const tracePath = (b, points, s, color, width = 3) => {
    const p = lessonProgress(s), f = p * (points.length - 1), i = Math.floor(f);
    if (p <= 0) return;
    const out = points.slice(0, i + 1);
    if (i < points.length - 1) out.push({ x: points[i].x + (points[i + 1].x - points[i].x) * (f - i), y: points[i].y + (points[i + 1].y - points[i].y) * (f - i) });
    if (out.length >= 2) b.path(out, { color, width });
  };
  const pairArc = (a, c, y = 0, sign = -1) => Array.from({ length: 25 }, (_, k) => {
    const t = k / 24, h = .45 + .1 * Math.abs(c - a);
    return { x: a + (c - a) * t, y: y + sign * 4 * h * t * (1 - t) };
  });

  /* ================================================================== 반직선 AB와 BA */
  const TRUE_R = [
    { t: '직선 AB와 직선 BA는 같다.' }, { t: '선분 AB와 선분 BA는 같다.' }, { t: '반직선 AB의 시작점은 점 A이다.' },
    { t: '반직선 AB와 반직선 BA의 공통부분은 선분 AB이다.' }, { t: '반직선 BA의 시작점은 점 B이다.' }
  ];
  const FALSE_R = [
    { t: '반직선 AB와 반직선 BA는 같다.', hint: '시작점도 방향도 달라서 서로 다른 반직선이에요.' },
    { t: '반직선 AB의 시작점은 점 B이다.', hint: '반직선은 처음 쓴 글자가 시작점이에요. AB는 A에서 시작해요.' },
    { t: '선분 AB는 양쪽으로 끝없이 늘인 선이다.', hint: '선분은 점 A와 B 사이에서 끝나요. 끝없이 늘인 것은 직선이에요.' },
    { t: '직선 AB와 직선 BA는 서로 다른 직선이다.', hint: '직선은 글자 순서를 바꿔도 같은 직선이에요.' },
    { t: '반직선 AB와 반직선 BA의 공통부분은 반직선이다.', hint: '두 반직선이 겹치는 곳은 A와 B 사이의 선분이에요.' },
    { t: '직선 AB는 시작점이 점 A이다.', hint: '시작점이 있는 것은 반직선이에요. 직선은 양쪽으로 끝이 없어요.' }
  ];
  const sRay = PL.scene({
    id: 'l-ray', title: '반직선 AB와 BA', short: '반직선 AB·BA',
    box: [-1.2, -1.4, 13.2, 10.3],
    question: '두 점 A, B로 그을 수 있는 직선·반직선·선분은 각각 무엇이 같고 무엇이 다를까요?',
    lessonQuestion: (M, s) => s.plLessonMode === 'rayCommon' ? `눈금 A는 ${M.A}, B는 ${M.B}입니다. 반직선 AB와 BA의 공통부분과 그 길이는? (단위: cm)` : s.plLessonMode === 'rayOrder' ? '반직선 AB와 반직선 BA는 같은 반직선일까요? 시작점과 방향을 비교해 보세요.' : 'AB의 이름 순서를 BA로 바꾸면 직선과 선분은 각각 같은 도형일까요?',
    init: { lrA: 3, lrB: 8 },
    controls: ['lrA', 'lrB'],
    model: (s) => ({ A: s.lrA, B: s.lrB, d: Math.abs(s.lrB - s.lrA), dir: s.lrB > s.lrA ? 1 : -1 }),
    guide: () => '노랑 점 <b>A, B</b>를 가로로 끌어 보세요. <b>직선</b>은 A, B를 순서만 바꾸면 같고, <b>반직선</b>은 시작점과 방향이 달라서 AB와 BA가 <b>다릅니다</b>. 두 반직선이 겹치는 곳은 <b>선분 AB</b>예요.',
    readouts: (M) => [
      { label: '직선 AB와 직선 BA', value: '같다', color: 'sky' },
      { label: '반직선 AB와 반직선 BA', value: '다르다', color: 'rose', note: `시작점 A ≠ B, 방향 ${M.dir > 0 ? '→ ≠ ←' : '← ≠ →'}` },
      { label: '공통부분 (선분 AB)', value: `${M.d} cm`, color: 'green' }
    ],
    steps: (M) => [
      '직선 AB: 두 점 A, B를 지나 양쪽으로 끝없이 뻗은 선입니다. 글자 순서를 바꿔도 같은 직선입니다. 직선 AB = 직선 BA',
      `반직선 AB는 A에서 시작해 B쪽으로, 반직선 BA는 B에서 시작해 A쪽으로 뻗습니다. 시작점과 방향이 달라 반직선 AB ≠ 반직선 BA`,
      `두 반직선이 겹치는 곳(공통부분)은 A와 B 사이의 선분 AB입니다. 길이는 ${M.d} cm`
    ],
    rule: () => '반직선: 처음 쓴 글자가 시작점. 직선·선분은 순서를 바꿔도 같다',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>반직선 AB의 \'A\'는 시작점, \'B\'는 가는 방향을 알려 주는 점입니다.</li><li>직선·반직선은 끝이 없어서 길이를 잴 수 없습니다.</li></ul>',
    draw: (b, s, M, C) => {
      const st = C.step, y = [0, 2.7, 4.8, 6.9, 9.3];
      if (C.lesson) {
        const mode = s.plLessonMode, done = lessonReady(s);
        mainLine(b, 0);
        pointsRow(b, [M.A, M.B], [`A(${M.A})`, `B(${M.B})`], 0);
        guide(b, [M.A, M.B], 0, 8.9);
        lessonLabel(b, y[1], done && mode === 'lineOrder' ? '직선 AB = 직선 BA' : '직선 AB, 직선 BA', 'sky');
        lessonLine(b, s, y[1]);
        lessonLabel(b, y[2], '반직선 AB · 시작점 A', 'violet');
        lessonRay(b, s, y[2], M.A, M.dir, 'violet');
        lessonLabel(b, y[3], '반직선 BA · 시작점 B', 'rose');
        lessonRay(b, s, y[3], M.B, -M.dir, 'rose');
        if (done && mode !== 'rayOrder') {
          const A = { x: M.A, y: y[4] }, B = { x: M.B, y: y[4] };
          b.seg(A, B, { color: 'green', width: 7 });
          b.point(A, { color: 'green', r: 6 }); b.point(B, { color: 'green', r: 6 });
          lessonLabel(b, y[4], mode === 'lineOrder' ? '선분 AB = 선분 BA' : `공통부분: 선분 AB · ${M.d} cm`, 'green');
        } else lessonText(b, 8.8, done ? '반직선 AB ≠ 반직선 BA' : '이름과 방향을 비교해 보세요', done ? 'green' : 'muted');
        return;
      }
      guide(b, [M.A, M.B], y[0], y[4] - 0.35);
      mainLine(b, y[0]);
      b.point({ x: M.A, y: 0 }, { color: 'ink', r: 5.5 }); b.point({ x: M.B, y: 0 }, { color: 'ink', r: 5.5 });
      const nameDy = !C.thumb && C.tab !== 'explore' && b.W < 560 ? -20 : 22;
      T(b, { x: M.A, y: 0 }, 'A', { dy: nameDy, size: 18 }); T(b, { x: M.B, y: 0 }, 'B', { dy: nameDy, size: 18 });
      rowLabel(b, y[1], '직선 AB = 직선 BA', 'sky', st, st === 1);
      straight(b, y[1], 'sky', al(st, st === 1));
      rowLabel(b, y[2], '반직선 AB (A에서 B쪽으로)', 'violet', st, st === 2);
      ray(b, y[2], M.A, M.dir, 'violet', al(st, st === 2));
      rowLabel(b, y[3], '반직선 BA (B에서 A쪽으로)', 'rose', st, st === 2);
      ray(b, y[3], M.B, -M.dir, 'rose', al(st, st === 2));
      if (!C.hide || st < 99) {
        const a = Math.min(M.A, M.B), c = Math.max(M.A, M.B);
        b.seg({ x: a, y: y[4] }, { x: c, y: y[4] }, { color: 'green', width: 7, alpha: al(st, st === 3), glow: st === 3 });
        b.point({ x: a, y: y[4] }, { color: 'green', r: 6 }); b.point({ x: c, y: y[4] }, { color: 'green', r: 6 });
        rowLabel(b, y[4], C.hide ? '공통부분' : `공통부분 = 선분 AB (${M.d} cm)`, 'green', st, st === 3);
      }
      b.handle('A', { x: M.A, y: 0 }, { color: 'amber', ariaLabel: '점 A', drag: (w) => { const v = clamp(Math.round(w.x), 0, 12); if (v !== s.lrB) s.lrA = v; } });
      b.handle('B', { x: M.B, y: 0 }, { color: 'amber', ariaLabel: '점 B', drag: (w) => { const v = clamp(Math.round(w.x), 0, 12); if (v !== s.lrA) s.lrB = v; } });
    },
    quiz: (M, s, rng) => PL.truthQuiz(rng, TRUE_R, FALSE_R, '두 점 A, B에 대한 설명으로 옳은 것은?', '직선·반직선·선분'),
    reroll: (s, rng) => { s.lrA = PL.randInt(rng, 0, 5); s.lrB = PL.randInt(rng, 7, 12); if (rng() < 0.5) { const t = s.lrA; s.lrA = s.lrB; s.lrB = t; } }
  });

  /* ================================================================== 직선·반직선·선분 */
  const TRUE_T = [
    { t: '선분 AB는 길이를 잴 수 있다.' }, { t: '서로 다른 두 점을 지나는 직선은 오직 하나이다.' },
    { t: '선분은 끝점이 2개이다.' }, { t: '반직선은 끝점이 1개이다.' }, { t: '직선은 끝점이 없다.' }
  ];
  const FALSE_T = [
    { t: '직선 AB의 길이는 반직선 AB의 길이의 2배이다.', hint: '직선도 반직선도 끝이 없어서 길이를 잴 수 없어요.' },
    { t: '반직선은 끝점이 2개이다.', hint: '반직선은 시작점 1개만 있고 한쪽은 끝없이 뻗어요.' },
    { t: '직선 AB는 끝점이 2개이다.', hint: '직선은 양쪽으로 끝없이 뻗어서 끝점이 없어요.' },
    { t: '한 점을 지나는 직선은 오직 하나이다.', hint: '한 점을 지나는 직선은 무수히 많아요. 두 점을 지나는 직선이 하나예요.' },
    { t: '반직선 AB의 길이는 선분 AB의 길이와 같다.', hint: '반직선은 끝없이 뻗어서 길이를 잴 수 없어요.' }
  ];
  const sTypes = PL.scene({
    id: 'l-types', title: '직선·반직선·선분', short: '직선·반직선·선분',
    box: [-1.2, -1.4, 13.2, 9.0],
    question: '직선·반직선·선분 중 길이를 잴 수 있는 것은 무엇일까요?',
    lessonQuestion: (M, s) => s.plLessonMode === 'typeLine' ? '직선 AB의 끝점은 몇 개이고, 길이를 잴 수 있을까요?' : s.plLessonMode === 'typeRay' ? '반직선 AB의 끝점은 몇 개이고, 길이를 잴 수 있을까요?' : `눈금 A는 ${M.A}, B는 ${M.B}입니다. 선분 AB의 끝점은 몇 개이고 길이는 얼마일까요? (단위: cm)`,
    init: { lrA: 3, ltL: 5 },
    controls: ['ltL'],
    model: (s) => { const L = s.ltL, A = Math.min(s.lrA, 12 - L); return { A, L, B: A + L }; },
    guide: () => '<b>선분 AB의 길이</b>를 막대로 바꾸거나 노랑 점을 가로로 끌어 보세요. 세 도형 중 <b>양쪽 끝이 막혀 있어 길이를 잴 수 있는 것은 선분</b>뿐입니다.',
    readouts: (M) => [
      { label: '직선 AB', value: '끝점 0개', color: 'sky', note: '길이를 잴 수 없다' },
      { label: '반직선 AB', value: '끝점 1개 (A)', color: 'violet', note: '길이를 잴 수 없다' },
      { label: '선분 AB', value: `끝점 2개 · ${M.L} cm`, color: 'green', note: '길이를 잴 수 있다' }
    ],
    steps: (M) => [
      '직선 AB는 양쪽으로 끝없이 뻗어서 끝점이 없고, 길이를 잴 수 없습니다.',
      '반직선 AB는 점 A에서 시작해 한쪽으로 끝없이 뻗습니다. 끝점은 A 하나이고, 길이를 잴 수 없습니다.',
      `선분 AB는 점 A에서 점 B까지 막혀 있어서 끝점이 2개이고, 길이 ${M.L} cm를 잴 수 있습니다.`
    ],
    rule: () => '끝이 막힌 선분만 길이를 잴 수 있다',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>\'직선 AB의 길이는 반직선 AB의 길이의 2배이다\'는 <b>틀린 말</b>입니다. 둘 다 길이를 잴 수 없습니다.</li><li>서로 다른 두 점을 지나는 직선은 오직 1개입니다.</li></ul>',
    draw: (b, s, M, C) => {
      const st = C.step, y = [2.2, 4.6, 7.0];
      if (C.lesson) {
        const mode = s.plLessonMode, done = lessonReady(s);
        mainLine(b, 0); pointsRow(b, [M.A, M.B], [`A(${M.A})`, `B(${M.B})`], 0);
        guide(b, [M.A, M.B], 0, y[2]);
        lessonLabel(b, y[0], '직선 AB', 'sky'); lessonLine(b, s, y[0]);
        lessonLabel(b, y[1], '반직선 AB', 'violet'); lessonRay(b, s, y[1], M.A, 1, 'violet');
        lessonLabel(b, y[2], '선분 AB', 'green');
        b.seg({ x: M.A, y: y[2] }, { x: M.B, y: y[2] }, { color: 'muted', width: 2, alpha: .3 });
        trace(b, { x: M.A, y: y[2] }, { x: M.B, y: y[2] }, s, 'green', false, 6);
        [M.A, M.B].forEach(x => b.point({ x, y: y[2] }, { color: 'green', r: 6 }));
        if (done) lessonText(b, 8.25, mode === 'typeLine' ? '직선: 끝점 0개 · 길이 측정 불가' : mode === 'typeRay' ? '반직선: 끝점 1개 · 길이 측정 불가' : `선분: 끝점 2개 · 길이 ${M.L} cm`);
        return;
      }
      rowLabel(b, y[0], '직선 AB  (끝점 없음)', 'sky', st, st === 1);
      straight(b, y[0], 'sky', al(st, st === 1));
      rowLabel(b, y[1], '반직선 AB  (끝점 A 하나)', 'violet', st, st === 2);
      ray(b, y[1], M.A, 1, 'violet', al(st, st === 2));
      rowLabel(b, y[2], C.hide ? '선분 AB  (끝점 A, B 둘)' : `선분 AB  (끝점 A, B 둘)  길이 ${M.L} cm`, 'green', st, st === 3);
      b.seg({ x: M.A, y: y[2] }, { x: M.B, y: y[2] }, { color: 'green', width: 6, alpha: al(st, st === 3), glow: st === 3 });
      [M.A, M.B].forEach((x) => b.point({ x, y: y[2] }, { color: 'green', r: 6.5 }));
      guide(b, [M.A, M.B], 0, y[2]);
      PL.ruler(b, 0, 12, y[2] + 0.5, { every: 1 });
      [[M.A, 'A'], [M.B, 'B']].forEach(([x, n]) => T(b, { x, y: 0 }, n, { dy: -16, size: 18 }));
      b.point({ x: M.A, y: 0 }, { color: 'ink', r: 5.5 }); b.point({ x: M.B, y: 0 }, { color: 'ink', r: 5.5 });
      b.seg({ x: XL, y: 0 }, { x: XR, y: 0 }, { color: 'muted', width: 1.6, alpha: 0.4 });
      b.handle('A', { x: M.A, y: 0 }, { color: 'amber', ariaLabel: '점 A', drag: (w) => { s.lrA = clamp(Math.round(w.x), 0, 12 - s.ltL); } });
      b.handle('B', { x: M.B, y: 0 }, { color: 'amber', ariaLabel: '점 B', drag: (w) => { s.ltL = clamp(Math.round(w.x) - M.A, 1, 10); } });
    },
    quiz: (M, s, rng) => PL.truthQuiz(rng, TRUE_T, FALSE_T, '다음 중 옳은 것은?', '직선·반직선·선분'),
    reroll: (s, rng) => { s.ltL = PL.randInt(rng, 2, 9); s.lrA = PL.randInt(rng, 0, 12 - s.ltL); }
  });

  /* ================================================================== 같은 반직선 */
  // 반직선(시작점 s, 방향 dir) 의 이름들: 시작점 + 그 방향의 점
  const rayNames = (s0, dir, n) => { const o = []; for (let j = s0 + dir; j >= 0 && j < n; j += dir) o.push(LET[s0] + LET[j]); return o; };
  const sSame = PL.scene({
    id: 'l-same', title: '같은 반직선 찾기', short: '같은 반직선',
    box: [-1.2, -1.4, 13.2, 6.0],
    question: '이름이 다른 두 반직선이 같은 반직선일 때는 언제일까요?',
    lessonQuestion: (M, s, Q) => s.plLessonMode === 'sameStart' ? 'A, B, C, D가 이 순서로 한 직선 위에 있습니다. 반직선 BC와 CD는 같은 반직선일까요?' : s.plLessonMode === 'sameDirection' ? 'A, B, C, D가 이 순서로 한 직선 위에 있습니다. 반직선 BC와 BA는 같은 반직선일까요?' : Q.stem,
    init: { lp0: 1, lp1: 4, lp2: 8, lp3: 11, lsS: 1 },
    controls: ['lp0', 'lp1', 'lp2', 'lp3'],
    presets: (s) => [0, 1, 2, 3].map((i) => ({ group: i === 0 ? '시작점' : '', label: `점 ${LET[i]}`, color: 'violet', apply: (st) => { st.lsS = i; }, on: (st) => st.lsS === i })),
    model: (s) => { const xs = xs4(s), S = s.lsS == null ? 1 : s.lsS; return { xs, S, R: rayNames(S, 1, 4), L: rayNames(S, -1, 4) }; },
    guide: (M) => `점 <b>${LET[M.S]}</b>에서 시작하는 반직선을 살펴보세요. 시작점이 같고 <b>같은 방향</b>이면 이름이 달라도 <b>같은 반직선</b>입니다. 점을 끌어 위치를 바꾸거나 시작점 칩을 눌러 보세요.`,
    readouts: (M) => [
      { label: `점 ${LET[M.S]}에서 오른쪽(→)`, value: M.R.length ? M.R.map((n) => `반직선 ${n}`).join(' = ') : '이름 붙일 점이 없음', color: 'violet' },
      { label: `점 ${LET[M.S]}에서 왼쪽(←)`, value: M.L.length ? M.L.map((n) => `반직선 ${n}`).join(' = ') : '이름 붙일 점이 없음', color: 'rose' }
    ],
    steps: (M) => [
      `반직선은 처음 쓴 글자가 시작점입니다. 점 ${LET[M.S]}에서 시작하는 반직선을 찾습니다.`,
      M.R.length ? `점 ${LET[M.S]}에서 오른쪽으로 뻗는 반직선은 ${M.R.map((n) => `반직선 ${n}`).join(', ')}이고, 모두 같은 반직선입니다.` : `점 ${LET[M.S]}의 오른쪽에는 점이 없어서 이름을 붙일 수 없습니다.`,
      M.L.length ? `점 ${LET[M.S]}에서 왼쪽으로 뻗는 반직선은 ${M.L.map((n) => `반직선 ${n}`).join(', ')}이고, 오른쪽으로 뻗는 반직선과는 방향이 달라 다릅니다.` : `점 ${LET[M.S]}의 왼쪽에는 점이 없어서 이름을 붙일 수 없습니다.`
    ],
    rule: () => '시작점과 방향이 모두 같으면 같은 반직선',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>이름을 비교할 때는 <b>맨 앞 글자(시작점)</b>가 같은지 먼저 확인하세요.</li><li>시작점이 달라도 방향이 같으면 <b>다른</b> 반직선입니다.</li></ul>',
    draw: (b, s, M, C) => {
      const st = C.step, S = M.S, y = [0, 2.8, 5.0];
      if (C.lesson) {
        const mode = s.plLessonMode, other = mode === 'sameStart' ? 'CD' : mode === 'sameDirection' ? 'BA' : 'BD';
        const start = other === 'CD' ? 2 : 1, dir = other === 'BA' ? -1 : 1;
        mainLine(b, 0); pointsRow(b, M.xs, ['A', 'B', 'C', 'D'], 0);
        guide(b, M.xs, 0, 4.6);
        lessonLabel(b, 2.2, '반직선 BC', 'violet'); lessonRay(b, s, 2.2, M.xs[1], 1, 'violet');
        lessonLabel(b, 4.4, `반직선 ${other}`, 'rose'); lessonRay(b, s, 4.4, M.xs[start], dir, 'rose');
        if (lessonReady(s)) lessonText(b, 5.65, `반직선 BC ${other === 'BD' ? '=' : '≠'} 반직선 ${other}`);
        return;
      }
      mainLine(b, y[0]);
      if (C.hide) {
        pointsRow(b, M.xs, ['A', 'B', 'C', 'D'], y[0]);
        M.xs.forEach((x, i) => b.handle('P' + i, { x, y: 0 }, { color: 'amber', ariaLabel: `점 ${LET[i]}`, drag: (w) => move4(s, i, w.x) }));
        return;
      }
      pointsRow(b, M.xs, LET.split('').slice(0, 4), y[0], M.xs.map((_, i) => (i === S ? 'violet' : 'ink')));
      b.point({ x: M.xs[S], y: 0 }, { color: 'violet', r: 7 });
      guide(b, M.xs, y[0], y[2] + 0.3);
      if (st >= 2) {
        rowLabel(b, y[1], M.R.length ? `${M.R.map((n) => '반직선 ' + n).join(' = ')}  (→)` : '→ 방향: 이름 붙일 점 없음', 'violet', st, true);
        if (M.R.length) ray(b, y[1], M.xs[S], 1, 'violet', 1);
      }
      if (st >= 3) {
        rowLabel(b, y[2], M.L.length ? `${M.L.map((n) => '반직선 ' + n).join(' = ')}  (←)` : '← 방향: 이름 붙일 점 없음', 'rose', st, true);
        if (M.L.length) ray(b, y[2], M.xs[S], -1, 'rose', 1);
      }
      if (st === 1 || st >= 99) T(b, { x: M.xs[S], y: 0 }, '시작점', { dy: -24, color: 'violet', size: 15 });
      M.xs.forEach((x, i) => b.handle('P' + i, { x, y: 0 }, { color: 'amber', r: i === S ? 6.5 : 6, ariaLabel: `점 ${LET[i]}`, drag: (w) => move4(s, i, w.x) }));
    },
    quiz: (M, s, rng) => {
      const cls = [];
      for (let a = 0; a < 4; a++) for (const d of [1, -1]) { const nm = rayNames(a, d, 4); if (nm.length >= 2) cls.push({ a, d, nm }); }
      const tgt = PL.pick(rng, cls.filter((c) => c.a === M.S)), names = tgt.nm, pickN = PL.shuffle(rng, names);
      const asked = pickN[0], right = pickN[1];
      const all = [];
      for (let a = 0; a < 4; a++) for (const d of [1, -1]) rayNames(a, d, 4).forEach((n) => all.push({ a, d, n }));
      const wrong = PL.shuffle(rng, all.filter((x) => !(x.a === tgt.a && x.d === tgt.d))).slice(0, 4);
      const hint = (w) => (w.a !== tgt.a ? `시작점이 달라요. 반직선 ${asked}의 시작점은 ${LET[tgt.a]}예요.` : `시작점은 같지만 방향이 반대예요.`);
      const choices = PL.shuffle(rng, [{ t: `반직선 ${right}`, ok: true, hint: '' }, ...wrong.map((w) => ({ t: `반직선 ${w.n}`, ok: false, hint: hint(w) }))]);
      return { tag: '같은 반직선', stem: `네 점 A, B, C, D가 이 순서로 한 직선 위에 있을 때, 반직선 ${asked}와 같은 것은?`, choices, note: '점의 위치를 끌어 보며 생각해 보세요.' };
    },
    reroll: (s, rng) => { const gaps = [PL.randInt(rng, 1, 3), PL.randInt(rng, 2, 4), PL.randInt(rng, 2, 4)]; const x0 = PL.randInt(rng, 0, 2); s.lp0 = x0; s.lp1 = x0 + gaps[0]; s.lp2 = s.lp1 + gaps[1]; s.lp3 = Math.min(12, s.lp2 + gaps[2]); s.lsS = PL.randInt(rng, 0, 3); }
  });

  /* ================================================================== 공통부분 */
  // 구간 표현: lo, hi (±Infinity)
  const interName = (r1, r2, names) => { // 점 인덱스 기준 교집합 이름
    const iv = (r) => (r.d > 0 ? [r.s, Infinity] : [-Infinity, r.s]);
    const a = iv(r1), c = iv(r2), lo = Math.max(a[0], c[0]), hi = Math.min(a[1], c[1]);
    if (lo > hi) return { kind: 'none' };
    if (lo === hi) return { kind: 'point', p: lo };
    if (Number.isFinite(lo) && Number.isFinite(hi)) return { kind: 'seg', a: lo, c: hi };
    return Number.isFinite(lo) ? { kind: 'ray', s: lo, d: 1 } : { kind: 'ray', s: hi, d: -1 };
  };
  const shapeText = (sh, rng) => {
    if (sh.kind === 'none') return '공통부분이 없다';
    if (sh.kind === 'point') return `점 ${LET[sh.p]}`;
    if (sh.kind === 'seg') return `선분 ${LET[sh.a]}${LET[sh.c]}`;
    const nm = rayNames(sh.s, sh.d, 4);
    return `반직선 ${rng ? PL.pick(rng, nm) : nm[0]}`;
  };
  const CASES = [
    { r1: { s: 1, d: 1 }, r2: { s: 2, d: -1 } }, // BD, CA
    { r1: { s: 0, d: 1 }, r2: { s: 1, d: 1 } },  // AC, BD
    { r1: { s: 2, d: 1 }, r2: { s: 1, d: -1 } }, // CD, BA
    { r1: { s: 1, d: -1 }, r2: { s: 1, d: 1 } }  // BA, BC
  ];
  const rname = (r) => `반직선 ${rayNames(r.s, r.d, 4).slice(-1)[0]}`; // 가장 먼 점으로 이름 붙임(BD, CA …)
  const sCommon = PL.scene({
    id: 'l-common', title: '두 반직선의 공통부분', short: '공통부분',
    box: [-1.2, -1.4, 13.2, 8.2],
    question: '두 반직선이 겹치는 부분(공통부분)은 어떤 도형일까요?',
    lessonQuestion: (M, s, Q) => s.plLessonMode === 'commonEnds' ? 'A, B, C, D 순서입니다. CD와 BA처럼 서로 등진 경우, BA와 BD처럼 시작점이 같은 경우의 공통부분을 비교해 보세요.' : Q.stem,
    init: { lp0: 1, lp1: 4, lp2: 8, lp3: 11, lcs: 0 },
    controls: ['lp0', 'lp1', 'lp2', 'lp3'],
    presets: (s) => ['마주 봄', '같은 방향', '서로 등짐', '시작점이 같음'].map((nm, i) => ({ group: i === 0 ? '두 반직선' : '', label: `${nm} (${rname(CASES[i].r1).slice(4)}, ${rname(CASES[i].r2).slice(4)})`, color: 'violet', apply: (st) => { st.lcs = i; }, on: (st) => (st.lcs || 0) === i })),
    model: (s) => { const xs = xs4(s), cs = CASES[s.lcs || 0]; return { xs, cs, r1: cs.r1, r2: cs.r2, n1: rname(cs.r1), n2: rname(cs.r2), sh: interName(cs.r1, cs.r2) }; },
    guide: (M) => `${M.n1}과 ${M.n2}를 위아래로 놓고, <b>두 줄 모두에 칠해진 곳</b>을 찾으세요. 그곳이 공통부분입니다. 칩으로 두 반직선을 바꾸고 점을 끌어 보세요.`,
    readouts: (M) => [{ label: M.n1, value: '시작점 ' + LET[M.r1.s], color: 'violet' }, { label: M.n2, value: '시작점 ' + LET[M.r2.s], color: 'rose' }, { label: '공통부분', value: shapeText(M.sh), color: 'green' }],
    steps: (M) => [
      `${M.n1}은 점 ${LET[M.r1.s]}에서 시작해 ${M.r1.d > 0 ? '오른쪽' : '왼쪽'}으로 끝없이 뻗습니다.`,
      `${M.n2}는 점 ${LET[M.r2.s]}에서 시작해 ${M.r2.d > 0 ? '오른쪽' : '왼쪽'}으로 끝없이 뻗습니다.`,
      `두 반직선이 모두 지나는 곳을 찾으면 공통부분은 ${shapeText(M.sh)}입니다.`
    ],
    rule: () => '마주 보면 선분, 같은 방향이면 반직선, 등지면 없다, 시작점이 같고 반대 방향이면 점',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>한 줄 위에 겹쳐 그리면 헷갈려요. 위·아래 두 줄로 나누어 놓고 <b>둘 다 칠해진 곳</b>만 찾으세요.</li></ul>',
    draw: (b, s, M, C) => {
      const st = C.step, y = [0, 2.8, 4.9, 7.2];
      if (C.lesson) {
        const done = lessonReady(s);
        mainLine(b, 0); pointsRow(b, M.xs, ['A', 'B', 'C', 'D'], 0);
        guide(b, M.xs, 0, 7.2);
        if (s.plLessonMode === 'commonEnds') {
          lessonLabel(b, 1.7, '서로 등짐: CD, BA', 'ink');
          lessonRay(b, s, 1.7, M.xs[2], 1, 'violet');
          lessonRay(b, s, 2.8, M.xs[1], -1, 'rose');
          lessonLabel(b, 5.0, '같은 시작점: BA, BD', 'ink');
          lessonRay(b, s, 5.0, M.xs[1], -1, 'violet');
          lessonRay(b, s, 6.1, M.xs[1], 1, 'rose');
          if (done) {
            lessonText(b, 3.75, '공통부분 없음');
            b.point({ x: M.xs[1], y: 7.2 }, { color: 'green', r: 7 });
            T(b, { x: M.xs[1], y: 7.2 }, '공통부분: 점 B', { dy: 22, color: 'green', size: 16 });
          }
        } else {
          lessonLabel(b, y[1], M.n1, 'violet'); lessonRay(b, s, y[1], M.xs[M.r1.s], M.r1.d, 'violet');
          lessonLabel(b, y[2], M.n2, 'rose'); lessonRay(b, s, y[2], M.xs[M.r2.s], M.r2.d, 'rose');
          if (done) {
            lessonLabel(b, y[3], `공통부분: ${shapeText(M.sh)}`, 'green');
            if (M.sh.kind === 'seg') {
              const A = { x: M.xs[M.sh.a], y: y[3] }, B = { x: M.xs[M.sh.c], y: y[3] };
              b.seg(A, B, { color: 'green', width: 7 }); b.point(A, { color: 'green', r: 6 }); b.point(B, { color: 'green', r: 6 });
            } else if (M.sh.kind === 'ray') lessonRay(b, s, y[3], M.xs[M.sh.s], M.sh.d, 'green');
          } else lessonLabel(b, y[3], '둘 다 칠해진 곳은?', 'green');
        }
        return;
      }
      mainLine(b, y[0]);
      pointsRow(b, M.xs, ['A', 'B', 'C', 'D'], y[0]);
      guide(b, M.xs, y[0], y[3]);
      rowLabel(b, y[1], M.n1, 'violet', st, st === 1);
      ray(b, y[1], M.xs[M.r1.s], M.r1.d, 'violet', al(st, st === 1));
      rowLabel(b, y[2], M.n2, 'rose', st, st === 2);
      ray(b, y[2], M.xs[M.r2.s], M.r2.d, 'rose', al(st, st === 2));
      const sh = M.sh, xs = M.xs, a3 = al(st, st === 3);
      if (!C.hide && (C.tab !== 'review' || st >= 3)) {
        if (sh.kind === 'none') { rowLabel(b, y[3], '공통부분: 없다', 'muted', st, st === 3); }
        else {
          const label = shapeText(sh);
          rowLabel(b, y[3], `공통부분: ${label}`, 'green', st, st === 3);
          if (sh.kind === 'point') b.point({ x: xs[sh.p], y: y[3] }, { color: 'green', r: 8 });
          else if (sh.kind === 'seg') { b.seg({ x: xs[sh.a], y: y[3] }, { x: xs[sh.c], y: y[3] }, { color: 'green', width: 7, alpha: a3, glow: st === 3 }); b.point({ x: xs[sh.a], y: y[3] }, { color: 'green', r: 6 }); b.point({ x: xs[sh.c], y: y[3] }, { color: 'green', r: 6 }); }
          else { PL.arrow(b, { x: xs[sh.s], y: y[3] }, { x: sh.d > 0 ? XR : XL, y: y[3] }, { color: 'green', width: 6, alpha: a3 }); b.point({ x: xs[sh.s], y: y[3] }, { color: 'green', r: 6.5 }); }
        }
      } else rowLabel(b, y[3], '공통부분은?', 'green', st, true);
      M.xs.forEach((x, i) => b.handle('P' + i, { x, y: 0 }, { color: 'amber', ariaLabel: `점 ${LET[i]}`, drag: (w) => move4(s, i, w.x) }));
    },
    quiz: (M, s, rng) => {
      const { r1, r2, sh } = M;
      const key = (x) => (x.kind === 'none' ? 'n' : x.kind === 'point' ? 'p' + x.p : x.kind === 'seg' ? 's' + x.a + x.c : 'r' + x.s + x.d);
      const cand = [{ kind: 'none' }];
      for (let i = 0; i < 4; i++) cand.push({ kind: 'point', p: i });
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) cand.push({ kind: 'seg', a: i, c: j });
      for (let a = 0; a < 4; a++) for (const d of [1, -1]) if (rayNames(a, d, 4).length) cand.push({ kind: 'ray', s: a, d });
      const wrong = PL.shuffle(rng, cand.filter((c) => key(c) !== key(sh))).slice(0, 4);
      const mk = (c, ok) => ({ t: shapeText(c, rng), ok, hint: ok ? '' : '두 반직선이 모두 지나는 곳이 아니에요. 위·아래 두 줄에 모두 칠해진 곳을 다시 찾아보세요.' });
      return { tag: '반직선의 공통부분', stem: `네 점 A, B, C, D가 이 순서로 한 직선 위에 있을 때, ${rname(r1)}와 ${rname(r2)}의 공통부분은?`, choices: PL.shuffle(rng, [mk(sh, true), ...wrong.map((w) => mk(w, false))]) };
    },
    reroll: (s, rng) => { s.lcs = PL.randInt(rng, 0, CASES.length - 1); }
  });

  /* ================================================================== 두 점 사이의 거리 */
  const bez = (A, B, h, n = 36) => { const o = []; for (let i = 0; i <= n; i++) { const t = i / n; o.push({ x: (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * ((A.x + B.x) / 2) + t * t * B.x, y: (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * (-2 * h) + t * t * B.y }); } return o; };
  const sShort = PL.scene({
    id: 'l-short', title: '두 점 사이의 거리', short: '두 점 사이의 거리',
    box: [-0.8, -3.6, 12.8, 7.6],
    question: '두 점 A, B를 잇는 길 중 가장 짧은 길은 무엇이고, 그 길이를 무엇이라 부를까요?',
    lessonQuestion: (M, s, Q) => s.plLessonMode === 'shortDistance' ? Q.stem : '두 점 A, B를 잇는 길 중 가장 짧은 길은 무엇이고, 두 점 사이의 거리는 무엇의 길이일까요?',
    init: { lrA: 2, lrB: 9, lsH: 2 },
    controls: ['lrA', 'lrB', 'lsH'],
    model: (s) => ({ A: Math.min(s.lrA, s.lrB), B: Math.max(s.lrA, s.lrB), d: Math.abs(s.lrB - s.lrA), h: s.lsH }),
    guide: () => '점 A, B를 끌어 보세요. 두 점을 잇는 길은 많지만, <b>가장 짧은 길은 곧게 이은 선분 AB</b>입니다. 이 선분의 길이를 <b>두 점 A, B 사이의 거리</b>라고 합니다.',
    readouts: (M) => [{ label: '두 점 사이의 거리', value: `${M.d} cm`, color: 'green', note: '선분 AB의 길이' }, { label: '돌아가는 길', value: `${M.d} cm보다 길다`, color: 'rose' }],
    steps: (M) => [
      '두 점 A, B를 잇는 길은 곡선, 꺾인 선, 선분처럼 여러 가지입니다.',
      '그중 가장 짧은 길은 두 점을 곧게 이은 선분 AB입니다. 돌아가는 길은 모두 선분보다 깁니다.',
      `두 점 A, B 사이의 거리는 선분 AB의 길이입니다. 눈금에서 B의 값 − A의 값 = ${M.B} − ${M.A} = ${M.d} (cm)`
    ],
    rule: () => '두 점 사이의 거리 = 두 점을 잇는 가장 짧은 선분의 길이',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>\'두 점 A, B를 잇는 가장 짧은 선은 <b>직선</b> AB\'가 아니라 <b>선분</b> AB입니다.</li><li>거리는 눈금을 읽어서 <b>큰 값 − 작은 값</b>으로 구합니다.</li></ul>',
    draw: (b, s, M, C) => {
      const st = C.step, A = { x: M.A, y: 0 }, B = { x: M.B, y: 0 };
      if (C.lesson) {
        const curve = bez(A, B, M.h), zz = [A, { x: M.A + M.d * .3, y: M.h * .9 }, { x: M.A + M.d * .62, y: M.h * .35 }, B];
        b.path(curve, { color: 'rose', width: 3, alpha: .7 }); b.path(zz, { color: 'rose', width: 3, alpha: .7 });
        b.seg(A, B, { color: 'muted', width: 2 }); trace(b, A, B, s, 'green', false, 6);
        PL.pt(b, A, 'A', { dx: -17, dy: 0 }); PL.pt(b, B, 'B', { dx: 17, dy: 0 });
        T(b, curve[18], '돌아가는 길', { dy: -16, color: 'rose', size: 15 });
        const ry = M.h + 1.9;
        PL.ruler(b, 0, 12, ry, { every: 1 });
        [M.A, M.B].forEach(x => b.seg({ x, y: 0 }, { x, y: ry }, { color: 'muted', width: 1, dash: [4, 5], alpha: .4 }));
        T(b, { x: M.A, y: ry }, `A(${M.A})`, { dy: -18, color: 'amber' }); T(b, { x: M.B, y: ry }, `B(${M.B})`, { dy: -18, color: 'amber' });
        if (lessonReady(s)) lessonText(b, 6.6, s.plLessonMode === 'shortPath' ? '두 점 사이의 거리 = 선분 AB의 길이' : `${M.B} − ${M.A} = ${M.d} cm`);
        return;
      }
      b.path(bez(A, B, M.h), { color: 'rose', width: 3.6, alpha: al(st, st === 1) });
      const zz = [A, { x: M.A + M.d * 0.3, y: M.h * 0.9 }, { x: M.A + M.d * 0.62, y: M.h * 0.35 }, B];
      b.path(zz, { color: 'rose', width: 3.6, alpha: al(st, st === 1) });
      T(b, bez(A, B, M.h)[18], '돌아가는 길', { dy: -14, color: 'rose', size: 15 });
      T(b, zz[1], '꺾인 길', { dx: -34, dy: 6, color: 'rose', size: 15 });
      b.seg(A, B, { color: 'green', width: 7, alpha: al(st, st >= 2), glow: st >= 2 });
      b.point(A, { color: 'ink', r: 6 }); b.point(B, { color: 'ink', r: 6 });
      T(b, A, 'A', { dx: -17, dy: 2, size: 18 }); T(b, B, 'B', { dx: 17, dy: 2, size: 18 });
      const ry = M.h + 1.9, dy2 = ry + 1.45;
      PL.ruler(b, 0, 12, ry, { every: 1 });
      [M.A, M.B].forEach((x) => { b.seg({ x, y: ry - 0.4 }, { x, y: ry }, { color: 'amber', width: 3 }); b.seg({ x, y: ry + 0.9 }, { x, y: dy2 }, { color: 'green', width: 1.6, dash: [3, 4], alpha: 0.8 }); });
      PL.dim(b, { x: M.A, y: dy2 }, { x: M.B, y: dy2 }, '', { color: 'green', width: 4 });
      if (!C.hide) T(b, { x: clamp((M.A + M.B) / 2, 3.4, 8.6), y: dy2 }, `두 점 사이의 거리 = ${M.d} cm`, { dy: 22, color: 'green', size: 17 });
      b.handle('A', A, { color: 'amber', ariaLabel: '점 A', drag: (w) => { const v = clamp(Math.round(w.x), 0, 12); if (v !== s.lrB) s.lrA = v; } });
      b.handle('B', B, { color: 'amber', ariaLabel: '점 B', drag: (w) => { const v = clamp(Math.round(w.x), 0, 12); if (v !== s.lrA) s.lrB = v; } });
    },
    quiz: (M, s) => {
      const wrongs = [
        { v: M.B, hint: 'B의 눈금을 그대로 읽었어요. A의 눈금을 빼야 해요.' },
        { v: M.A + M.B, hint: '두 눈금을 더했어요. 거리는 큰 값에서 작은 값을 뺀 차예요.' },
        { v: M.d + 1, hint: '눈금 사이의 칸 수를 다시 세어 보세요.' },
        { v: M.d - 1, hint: '눈금 사이의 칸 수를 다시 세어 보세요.' },
        { v: M.A, hint: 'A의 눈금만 읽었어요.' }
      ];
      return { tag: '두 점 사이의 거리', stem: `눈금자 위에서 점 A는 ${M.A}, 점 B는 ${M.B}를 가리킵니다. 두 점 A, B 사이의 거리는? (단위: cm)`, choices: PL.numChoices(M.d, wrongs, { fmt: (v) => `${v} cm` }) };
    },
    reroll: (s, rng) => { s.lrA = PL.randInt(rng, 1, 5); s.lrB = s.lrA + PL.randInt(rng, 3, 7); }
  });

  /* ================================================================== 개수: 한 직선 위의 n점 */
  const names = (n) => LET.slice(0, n).split('');
  const defaultXs = (n) => Array.from({ length: n }, (_, i) => 1 + (i * 10.5) / (n - 1));
  const sCol = PL.scene({
    id: 'l-col', title: '한 직선 위의 n개의 점', short: '한 직선 위 n점',
    box: [-1.2, -4.2, 13.2, 5.9],
    question: '한 직선 위에 점이 n개 있을 때, 직선·반직선·선분은 각각 몇 개일까요?',
    lessonQuestion: (M, s, Q) => Q.stem,
    init: { lcn: 5, lcf: 0, lcx: null },
    controls: ['lcn', 'lcf'],
    model: (s) => {
      const n = s.lcn, f = Math.min(s.lcf || 0, n - 1);
      let xs = s.lcx && s.lcx.length === n ? s.lcx : defaultXs(n);
      return { n, f, xs, seg: C2(n), ray: 2 * (n - 1), line: 1 };
    },
    guide: (M) => `한 직선 위에 점이 <b>${M.n}개</b> 있습니다. 노랑 점을 가로로 끌어 위치를 바꿔도 개수는 그대로예요. 기준 점 <b>${LET[M.f]}</b>에서 시작하는 선분(초록 호)이 ${M.n - 1}개인 것을 확인하세요.`,
    readouts: (M) => [
      { label: '직선', value: '1개', color: 'sky', note: '점이 몇 개든 한 직선' },
      { label: '반직선', value: `${M.ray}개`, color: 'violet', note: `2 × (${M.n} − 1)` },
      { label: '선분', value: `${M.seg}개`, color: 'green', note: `${M.n} × ${M.n - 1} ÷ 2` }
    ],
    steps: (M) => [
      `점이 ${M.n}개이지만 모두 한 직선 위에 있으므로 직선은 1개입니다.`,
      `반직선: 끝에 있는 점은 안쪽 한 방향으로만, 안쪽 점은 양쪽 방향으로 반직선이 생깁니다. 시작점마다 방향이 2가지인데 양 끝점은 1가지뿐이므로 2 × (${M.n} − 1) = ${M.ray}개 (반직선 AB와 BA는 다릅니다)`,
      `선분: 한 점에서 시작하는 선분이 ${M.n - 1}개씩, ${M.n}개 점이면 ${M.n} × ${M.n - 1} = ${M.n * (M.n - 1)}개입니다. 선분 AB와 BA는 같은 선분이므로 2번씩 센 것을 2로 나누어 ${M.seg}개`
    ],
    formula: (M) => `<p>점이 $n$개일 때: 직선 $1$개, 반직선 $2(n-1)$개, 선분 $\\dfrac{n(n-1)}{2}$개</p><p>지금: 직선 $1$, 반직선 $2\\times${M.n - 1}=${M.ray}$, 선분 $\\dfrac{${M.n}\\times${M.n - 1}}{2}=${M.seg}$</p>`,
    rule: () => '한 직선 위의 n점: 직선 1, 반직선 2(n−1), 선분 n(n−1)÷2',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li><b>한 직선 위</b>의 점은 반직선이 2(n−1)개입니다. 점이 직선 밖에도 있는 다음 장면과 규칙이 달라요.</li><li>반직선은 시작점과 방향이 같을 때만 같은 반직선입니다.</li></ul>',
    draw: (b, s, M, C) => {
      const st = C.step, xs = M.xs, nm = names(M.n), y0 = 0;
      if (C.lesson) {
        const mode = s.plLessonMode, support = lessonReady(s, 'plSupportReady'), other = lessonReady(s, 'plOtherReady'), done = lessonReady(s);
        const rays = mode === 'colRay', sum = mode === 'colSum';
        mainLine(b, 0);
        for (let i = 0; i < M.n; i++) for (let j = i + 1; j < M.n; j++) {
          const points = pairArc(xs[i], xs[j]);
          b.path(points, { color: 'muted', width: 1.5, alpha: .2 });
          if (!rays) tracePath(b, points, s, i === 0 || other || done ? 'green' : 'muted', i === 0 ? 3.4 : 1.6);
        }
        lessonText(b, -3.1, `한 직선 위의 ${M.n}개 점`, 'ink');
        lessonText(b, -2.35, '위쪽 호는 선분의 끝점 쌍 표시', 'muted');
        for (let i = 0; i < M.n; i++) {
          if (i < M.n - 1) {
            const A = { x: xs[i] + .1, y: 1.5 }, B = { x: xs[i] + 1.05, y: 1.5 };
            PL.arrow(b, A, B, { color: 'muted', width: 2, alpha: .25, head: 8 });
            if (rays || sum) trace(b, A, B, s, 'violet', true, 3);
          }
          if (i > 0) {
            const A = { x: xs[i] - .1, y: 2.35 }, B = { x: xs[i] - 1.05, y: 2.35 };
            PL.arrow(b, A, B, { color: 'muted', width: 2, alpha: .25, head: 8 });
            if (rays || sum) trace(b, A, B, s, 'rose', true, 3);
          }
        }
        pointsRow(b, xs, nm, 0);
        if (rays) {
          if (support) lessonText(b, 3.35, `양 끝점: 1개씩 · 안쪽 ${M.n - 2}점: 2개씩`, 'violet');
          if (done) lessonText(b, 4.6, `반직선: 1 + ${M.n - 2}×2 + 1 = ${M.ray}개`);
        } else if (sum) {
          if (support) lessonText(b, 3.35, `선분: ${M.n}×${M.n - 1}÷2 = ${M.seg}개`, 'green');
          if (other) lessonText(b, 4.1, `반직선: 2×(${M.n}−1) = ${M.ray}개`, 'violet');
          if (done) lessonText(b, 5.1, `합: ${M.seg} + ${M.ray} = ${M.seg + M.ray}개`);
        } else {
          if (support) lessonText(b, 3.35, `한 점에서 다른 ${M.n - 1}개 점으로`, 'green');
          if (other) lessonText(b, 4.1, `${M.n}×${M.n - 1} = ${M.n * (M.n - 1)}번 · 두 번씩 셈`, 'ink');
          if (done) lessonText(b, 5.1, `선분: ${M.n * (M.n - 1)}÷2 = ${M.seg}개`);
        }
        return;
      }
      const fill = (i) => (i === M.f ? 'green' : 'ink');
      // 선분(호): 기준 점에서 시작하는 것은 진하게, 나머지는 희미하게
      const arc = (i, j, col, alpha, w) => {
        const a = xs[i], c = xs[j], h = 0.45 + 0.1 * Math.abs(c - a), pts = [];
        for (let k = 0; k <= 24; k++) { const t = k / 24; pts.push({ x: a + (c - a) * t, y: -4 * h * t * (1 - t) }); }
        b.path(pts, { color: col, width: w, alpha });
      };
      for (let i = 0; i < M.n; i++) for (let j = i + 1; j < M.n; j++) {
        const focus = i === M.f || j === M.f;
        if (!focus) arc(i, j, 'green', st === 3 ? 0.42 : st >= 99 ? 0.16 : 0.08, 1.6);
      }
      for (let j = 0; j < M.n; j++) if (j !== M.f) arc(Math.min(M.f, j), Math.max(M.f, j), 'green', 0.95, 3.4);
      // 직선
      straight(b, y0, 'sky', al(st, st === 1), 3.4);
      // 반직선: 각 점에서 짧은 화살표
      for (let i = 0; i < M.n; i++) {
        if (i < M.n - 1) PL.arrow(b, { x: xs[i] + 0.12, y: 1.8 }, { x: xs[i] + 0.12 + Math.min(1.0, (xs[i + 1] - xs[i]) * 0.55), y: 1.8 }, { color: 'violet', alpha: al(st, st === 2), width: 3.2, head: 10 });
        if (i > 0) PL.arrow(b, { x: xs[i] - 0.12, y: 2.7 }, { x: xs[i] - 0.12 - Math.min(1.0, (xs[i] - xs[i - 1]) * 0.55), y: 2.7 }, { color: 'violet', alpha: al(st, st === 2), width: 3.2, head: 10 });
        if (i < M.n - 1) b.point({ x: xs[i] + 0.12, y: 1.8 }, { color: 'violet', r: 3.5 });
        if (i > 0) b.point({ x: xs[i] - 0.12, y: 2.7 }, { color: 'violet', r: 3.5 });
      }
      xs.forEach((x, i) => { b.point({ x, y: y0 }, { color: fill(i), r: 6 }); T(b, { x, y: y0 }, nm[i], { dy: 22, size: 17, color: fill(i) }); });
      if (!C.hide) {
        T(b, { x: XL, y: -2.5 }, `선분 ${M.seg}개  (기준 점 ${LET[M.f]}에서 ${M.n - 1}개)`, { align: 'left', color: 'green', size: 16 });
        T(b, { x: XL, y: 3.9 }, `반직선 ${M.ray}개  (→ ${M.n - 1}개 + ← ${M.n - 1}개)`, { align: 'left', color: 'violet', size: 16 });
        T(b, { x: XL, y: 4.9 }, '직선 1개', { align: 'left', color: 'sky', size: 16 });
      }
      xs.forEach((x, i) => b.handle('P' + i, { x, y: y0 }, { color: 'amber', r: 5.5, ariaLabel: `점 ${nm[i]}`, drag: (w) => { const a = M.xs.slice(); const lo = i === 0 ? 0 : a[i - 1] + 0.8, hi = i === M.n - 1 ? 12 : a[i + 1] - 0.8; a[i] = clamp(w.x, lo, hi); s.lcx = a; } }));
    },
    quiz: (M, s, rng) => {
      const kind = (s.plSeed || 0) % 3; // 선분 → 반직선 → 선분+반직선
      const n = M.n, seg = C2(n), ray = 2 * (n - 1);
      let right, wrongs, word;
      if (kind === 0) { right = seg; word = '서로 다른 선분'; wrongs = [{ v: n * (n - 1), hint: '선분 AB와 BA는 같은 선분이에요. 2번 센 것을 2로 나누어야 해요.' }, { v: ray, hint: '반직선의 개수예요.' }, { v: n - 1, hint: '한 점에서 시작하는 선분만 센 거예요.' }, { v: seg + 1, hint: '직선 1개를 더하지 않아도 돼요. 선분만 세세요.' }]; }
      else if (kind === 1) { right = ray; word = '서로 다른 반직선'; wrongs = [{ v: n * (n - 1), hint: '한 직선 위에서는 양 끝점이 한 방향으로만 반직선을 만들어요.' }, { v: seg, hint: '선분의 개수예요.' }, { v: 2 * n, hint: '양 끝점은 방향이 1가지뿐이에요.' }, { v: n - 1, hint: '방향이 2가지씩이에요.' }]; }
      else { right = seg + ray; word = '서로 다른 선분과 반직선의 개수의 합'; wrongs = [{ v: seg + n * (n - 1), hint: '한 직선 위에서 반직선은 2(n−1)개예요.' }, { v: seg + seg, hint: '반직선은 선분의 2배가 아니에요.' }, { v: seg + ray + 1, hint: '직선은 더하지 않아요.' }, { v: seg, hint: '반직선도 더하세요.' }]; }
      return { tag: '직선 위의 점으로 만든 도형의 개수', stem: `한 직선 위에 점 ${n}개가 있다. 이 중 두 점을 이어 만들 수 있는 ${word}의 개수는?`, choices: PL.numChoices(right, wrongs, { fmt: (v) => `${v}개` }) };
    },
    reroll: (s, rng) => { s.lcn = PL.randInt(rng, 4, 7); s.lcx = null; }
  });

  /* ================================================================== 개수: 어느 세 점도 한 직선 위에 없는 n점 */
  const circPts = (n, rot) => Array.from({ length: n }, (_, i) => ({ x: 3.4 * Math.cos(rot - (2 * Math.PI * i) / n), y: -3.4 * Math.sin(rot - (2 * Math.PI * i) / n) }));
  const sGen = PL.scene({
    id: 'l-gen', title: '어느 세 점도 한 직선 위에 없을 때', short: '세 점이 일직선이 아닐 때',
    box: [-5.2, -4.5, 5.2, 5.7],
    question: '어느 세 점도 한 직선 위에 있지 않은 n개의 점으로 직선·반직선·선분은 몇 개 만들 수 있을까요?',
    lessonQuestion: (M, s, Q) => s.plLessonMode === 'genLine' ? `어느 세 점도 한 직선 위에 있지 않은 점 ${M.m}개가 있습니다. 서로 다른 직선과 선분은 각각 몇 개일까요?` : Q.stem,
    init: { lgn: 5, lgm: 5, lgr: 0.7 },
    controls: ['lgn', 'lgm'],
    model: (s) => { const n = s.lgn, m = Math.min(s.lgm, n); return { n, m, rot: s.lgr, pts: circPts(n, s.lgr), line: C2(m), seg: C2(m), ray: m * (m - 1), full: { line: C2(n), ray: n * (n - 1) } }; },
    guide: (M) => `점 <b>${M.n}개</b> 중 <b>${M.m}개</b>를 이어 본 모양입니다. 점을 하나씩 더하면 새 점에서 이전 점마다 선이 하나씩, 곧 <b>${M.m - 1}개</b> 늘어납니다(초록). 노랑 점을 끌면 돌아갑니다.`,
    readouts: (M) => [
      { label: '직선', value: `${M.line}개`, color: 'sky', note: `${M.m} × ${M.m - 1} ÷ 2` },
      { label: '선분', value: `${M.seg}개`, color: 'green', note: `${M.m} × ${M.m - 1} ÷ 2` },
      { label: '반직선', value: `${M.ray}개`, color: 'violet', note: `${M.m} × ${M.m - 1}` }
    ],
    steps: (M) => [
      `한 점에서 다른 점으로 선을 그으면 ${M.m - 1}개입니다. 점이 ${M.m}개이니 ${M.m} × ${M.m - 1} = ${M.m * (M.m - 1)}개를 셉니다.`,
      `직선 AB와 직선 BA, 선분 AB와 선분 BA는 같은 것이라 2번씩 센 것입니다. 2로 나누면 직선 ${M.line}개, 선분 ${M.seg}개`,
      `반직선 AB와 반직선 BA는 시작점과 방향이 달라 다른 반직선이므로 나누지 않습니다. 반직선은 ${M.m} × ${M.m - 1} = ${M.ray}개`
    ],
    formula: (M) => `<p>어느 세 점도 한 직선 위에 있지 않을 때, 점이 $n$개이면</p><p>직선·선분 $\\dfrac{n(n-1)}{2}$개, 반직선 $n(n-1)$개</p><p>지금($n=${M.m}$): 직선·선분 $${M.line}$개, 반직선 $${M.ray}$개</p>`,
    rule: () => '세 점이 일직선이 아닐 때: 직선·선분 n(n−1)÷2, 반직선 n(n−1)',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>반직선은 방향이 있어서 <b>2로 나누지 않습니다</b>. 직선·선분은 나눕니다.</li><li>점이 한 직선 위에 모두 있을 때(앞 장면)는 반직선이 2(n−1)개로 규칙이 달라요.</li></ul>',
    draw: (b, s, M, C) => {
      const st = C.step, P = M.pts, nm = names(M.n), mm = M.m;
      if (C.lesson) {
        const mode = s.plLessonMode, support = lessonReady(s, 'plSupportReady'), other = lessonReady(s, 'plOtherReady'), done = lessonReady(s);
        b.circle({ x: 0, y: 0 }, 3.4, { color: 'muted', width: 1.3, dash: [4, 6], alpha: .3 });
        for (let i = 0; i < mm; i++) for (let j = i + 1; j < mm; j++) {
          b.seg(P[i], P[j], { color: 'muted', width: 1.6, alpha: .3 });
          if (mode === 'genLine') lessonPairLine(b, s, P[i], P[j], i === 0 ? 'green' : 'sky');
          else if (mode !== 'genRay') trace(b, P[i], P[j], s, i === 0 ? 'green' : 'sky', false, i === 0 ? 3.4 : 2);
          if (mode === 'genRay' || (mode === 'genSum' && other)) {
            const at = (A, B) => ({ x: A.x + .38 * (B.x - A.x), y: A.y + .38 * (B.y - A.y) });
            trace(b, P[i], at(P[i], P[j]), s, 'violet', true, 3);
            trace(b, P[j], at(P[j], P[i]), s, 'rose', true, 3);
          }
        }
        P.slice(0, mm).forEach((p, i) => PL.pt(b, p, nm[i], { dx: p.x / 3.4 * 20, dy: p.y / 3.4 * 20 }));
        const label = (y, text, color = 'ink') => T(b, { x: 0, y }, text, { color, size: 15 });
        if (support) label(4.0, mode === 'genSum' ? `선분: ${mm}×${mm - 1}÷2 = ${M.seg}개` : `각 점에서 다른 ${mm - 1}개 점으로`, 'green');
        if (other) label(4.7, mode === 'genSum' ? `반직선: ${mm}×${mm - 1} = ${M.ray}개` : `${mm}×${mm - 1} = ${mm * (mm - 1)}번`, mode === 'genSum' ? 'violet' : 'ink');
        if (done) label(5.45, mode === 'genLine' ? `직선 ${M.line}개 · 선분 ${M.seg}개` : mode === 'genRay' ? `반직선 ${M.ray}개` : `합: ${M.seg} + ${M.ray} = ${M.seg + M.ray}개`, 'green');
        return;
      }
      b.circle({ x: 0, y: 0 }, 3.4, { color: 'muted', width: 1.4, alpha: 0.35, dash: [4, 6] });
      for (let i = 0; i < mm; i++) for (let j = i + 1; j < mm; j++) {
        const fresh = !C.hide && j === mm - 1;
        b.seg(P[i], P[j], { color: fresh ? 'green' : 'sky', width: fresh ? 3.4 : 2.2, alpha: fresh ? 0.95 : 0.8 });
        if (st === 3) {
          const t = 0.38, f = (A, B2) => ({ x: A.x + (B2.x - A.x) * t, y: A.y + (B2.y - A.y) * t });
          PL.arrow(b, P[i], f(P[i], P[j]), { color: 'violet', width: 4, head: 9 });
          PL.arrow(b, P[j], f(P[j], P[i]), { color: 'violet', width: 4, head: 9 });
        }
      }
      P.forEach((p, i) => {
        if (C.hide && i >= mm) return;
        const on = i < mm, nx = p.x / 3.4, ny = p.y / 3.4;
        b.point(p, { color: on ? 'ink' : 'muted', r: on ? 5.5 : 4.5, hollow: !on });
        T(b, p, nm[i], { dx: nx * 20, dy: ny * 20, size: 17, color: on ? 'ink' : 'muted' });
      });
      if (!C.hide) {
        T(b, { x: 0, y: 4.55 }, `직선 ${M.line}개 · 선분 ${M.seg}개 · 반직선 ${M.ray}개`, { size: 16, color: 'ink' });
        if (M.m > 1) T(b, { x: 0, y: 5.25 }, `새 점 ${nm[M.m - 1]}에서 ${M.m - 1}개 추가 (초록)`, { size: 15, color: 'green' });
      }
      b.handle('A', P[0], { color: 'amber', ariaLabel: '점들을 돌리기', drag: (w) => { s.lgr = Math.atan2(-w.y, w.x); } });
    },
    quiz: (M, s, rng) => {
      const n = M.m, kind = (s.plSeed || 0) % 3;
      let right, wrongs, word;
      if (kind === 0) { right = C2(n); word = '서로 다른 직선'; wrongs = [{ v: n * (n - 1), hint: '직선 AB와 BA는 같은 직선이에요. 2번 센 것을 2로 나누세요.' }, { v: n - 1, hint: '한 점에서 그은 직선만 센 거예요.' }, { v: C2(n) + 1, hint: '더할 것이 없어요.' }, { v: n, hint: '점의 개수와 직선의 개수는 달라요.' }]; }
      else if (kind === 1) { right = n * (n - 1); word = '서로 다른 반직선'; wrongs = [{ v: C2(n), hint: '반직선 AB와 BA는 방향이 달라서 서로 다른 반직선이에요. 나누지 않아요.' }, { v: n - 1, hint: '한 점에서 시작하는 반직선만 센 거예요.' }, { v: 2 * (n - 1), hint: '이 식은 점이 한 직선 위에 있을 때의 개수예요.' }, { v: n * n, hint: '자기 자신으로 가는 반직선은 없어요.' }]; }
      else { right = C2(n) + n * (n - 1); word = '서로 다른 선분과 반직선의 개수의 합'; wrongs = [{ v: 2 * C2(n), hint: '반직선은 선분의 2배인데 선분도 더해야 해요: 선분 + 반직선.' }, { v: n * (n - 1) * 2, hint: '반직선 + 반직선이 되었어요.' }, { v: C2(n), hint: '반직선도 더하세요.' }, { v: n * (n - 1), hint: '선분도 더하세요.' }]; }
      return { tag: '점으로 만든 도형의 개수', stem: `어느 세 점도 한 직선 위에 있지 않은 점 ${n}개가 있다. 두 점을 이어 만들 수 있는 ${word}의 개수는?`, choices: PL.numChoices(right, wrongs, { fmt: (v) => `${v}개` }) };
    },
    reroll: (s, rng) => { s.lgn = PL.randInt(rng, 4, 8); s.lgm = s.lgn; }
  });

  /* ================================================================== 개수: 일부 점이 한 직선 위 */
  // 한 직선 밖의 점(좌표는 세 점이 한 직선 위에 놓이지 않도록 고른 값)
  const OFF = [{ x: 2.3, y: -3.1 }, { x: 5.9, y: -4.6 }, { x: 9.4, y: -3.4 }, { x: 11.2, y: -5.3 }];
  const sMix = PL.scene({
    id: 'l-mix', title: '일부 점이 한 직선 위에 있을 때', short: '일부 점이 한 직선 위',
    box: [-1.0, -6.4, 13.0, 4.5],
    question: '점 n개 중 k개가 한 직선 위에 있으면 직선은 몇 개가 될까요?',
    lessonQuestion: (M, s, Q) => s.plLessonMode === 'mixSegment' ? `점 ${M.n}개 중 ${M.k}개가 한 직선 위에 있고, 나머지에는 세 점이 한 직선 위에 놓이는 경우가 없습니다. 두 점을 이어 만드는 서로 다른 선분은 몇 개일까요?` : Q.stem,
    init: { lkn: 6, lkk: 4, lkx: null },
    controls: ['lkn', 'lkk'],
    model: (s) => {
      const n = s.lkn, k = Math.min(s.lkk, n - 1);
      const on = s.lkx && s.lkx.length === k ? s.lkx : Array.from({ length: k }, (_, i) => 1.5 + (i * 9.5) / Math.max(1, k - 1));
      return { n, k, on, off: OFF.slice(0, n - k), line: C2(n) - C2(k) + 1, seg: C2(n), ray: n * (n - 1) - k * (k - 1) + 2 * (k - 1) };
    },
    guide: (M) => `점 ${M.n}개 중 <b>${M.k}개가 한 직선 위</b>에 있습니다(노랑 점은 가로로 끌 수 있어요). 그 ${M.k}개 점끼리 만든 직선은 모두 <b>같은 직선 하나</b>가 되어, 세는 개수가 줄어듭니다.`,
    readouts: (M) => [
      { label: '직선', value: `${M.line}개`, color: 'sky', note: `${C2(M.n)} − ${C2(M.k)} + 1` },
      { label: '선분', value: `${M.seg}개`, color: 'green', note: '점이 일직선이어도 선분은 줄지 않음' },
      { label: '반직선', value: `${M.ray}개`, color: 'violet', note: `${M.n}×${M.n - 1} − ${M.k}×${M.k - 1} + 2×${M.k - 1}` }
    ],
    steps: (M) => [
      `어느 세 점도 한 직선 위에 없다고 보고 먼저 셉니다. 직선은 ${M.n} × ${M.n - 1} ÷ 2 = ${C2(M.n)}개`,
      `한 직선 위의 ${M.k}개 점끼리 만든 직선 ${M.k} × ${M.k - 1} ÷ 2 = ${C2(M.k)}개는 실제로는 모두 같은 직선입니다. ${C2(M.k)}개를 빼면 ${C2(M.n) - C2(M.k)}개`,
      `빼 버린 그 직선은 1개 있으므로 1을 더합니다. 직선은 ${C2(M.n)} − ${C2(M.k)} + 1 = ${M.line}개`
    ],
    formula: (M) => `<p>직선의 개수 $=\\dfrac{n(n-1)}{2}-\\dfrac{k(k-1)}{2}+1$</p><p>지금: $${C2(M.n)}-${C2(M.k)}+1=${M.line}$</p>`,
    rule: () => '직선 = (전체 두 점의 쌍) − (한 직선 위의 쌍) + 1',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>한 직선 위의 점끼리 만든 직선은 <b>모두 같은 직선 1개</b>이므로, 뺀 뒤에 <b>1을 다시 더하는 것</b>을 잊지 마세요.</li><li>선분은 점이 일직선이어도 줄지 않습니다(선분 AB와 AC는 다른 선분).</li></ul>',
    draw: (b, s, M, C) => {
      const st = C.step, all = [...M.on.map((x) => ({ x, y: 0, on: true })), ...M.off.map((p) => ({ ...p, on: false }))];
      const nm = names(M.n);
      if (C.lesson) {
        const mode = s.plLessonMode, support = lessonReady(s, 'plSupportReady'), other = lessonReady(s, 'plOtherReady'), extra = lessonReady(s, 'plExtraReady'), done = lessonReady(s);
        for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
          if (all[i].on && all[j].on) {
            if (mode === 'mixSegment') {
              const points = pairArc(all[i].x, all[j].x, 0, 1);
              b.path(points, { color: 'muted', width: 1.2, alpha: .25 }); tracePath(b, points, s, 'green', 2);
            }
            continue;
          }
          b.seg(all[i], all[j], { color: 'muted', width: 1.8, alpha: .3 });
          if (mode === 'mixRay') {
            const at = (A, B) => ({ x: A.x + .38 * (B.x - A.x), y: A.y + .38 * (B.y - A.y) });
            trace(b, all[i], at(all[i], all[j]), s, 'violet', true, 2.5);
            trace(b, all[j], at(all[j], all[i]), s, 'rose', true, 2.5);
          } else trace(b, all[i], all[j], s, mode === 'mixSegment' ? 'green' : 'sky', false, 2.2);
        }
        if (mode === 'mixRay') {
          mainLine(b, 0);
          M.on.forEach((x, i) => {
            if (i > 0) trace(b, { x, y: 0 }, { x: x - .35 * (x - M.on[i - 1]), y: 0 }, s, 'rose', true, 3);
            if (i < M.k - 1) trace(b, { x, y: 0 }, { x: x + .35 * (M.on[i + 1] - x), y: 0 }, s, 'violet', true, 3);
          });
        } else lessonLine(b, s, 0, other ? 'rose' : 'sky');
        all.forEach((p, i) => PL.pt(b, p, nm[i], { color: p.on ? 'amber' : 'ink', dy: p.on ? 22 : -17 }));
        if (mode === 'mixSegment') {
          if (support) lessonText(b, 2.5, `${M.n}×${M.n - 1} = ${M.n * (M.n - 1)}번 · 두 번씩 셈`, 'ink');
          if (done) lessonText(b, 3.6, `선분 ${M.seg}개 · 일직선 위라도 끝점 쌍은 다름`);
        } else if (mode === 'mixRay') {
          if (support) lessonText(b, 1.5, `전체 방향 있는 쌍: ${M.n}×${M.n - 1} = ${M.n * (M.n - 1)}`, 'ink');
          if (other) lessonText(b, 2.3, `일직선 위의 쌍: ${M.k}×${M.k - 1} = ${M.k * (M.k - 1)}`, 'rose');
          if (extra) lessonText(b, 3.1, `실제 반직선: 2×(${M.k}−1) = ${2 * (M.k - 1)}`, 'violet');
          if (done) lessonText(b, 4.0, `반직선: ${M.n * (M.n - 1)}−${M.k * (M.k - 1)}+${2 * (M.k - 1)} = ${M.ray}개`);
        } else {
          if (support) lessonText(b, 1.5, `전체 두 점의 쌍: ${M.n}×${M.n - 1}÷2 = ${C2(M.n)}`, 'ink');
          if (other) lessonText(b, 2.3, `한 직선 위의 쌍: ${M.k}×${M.k - 1}÷2 = ${C2(M.k)}`, 'rose');
          if (extra) lessonText(b, 3.1, '겹친 직선은 1개만 다시 더해요', 'sky');
          if (done) lessonText(b, 4.0, `직선: ${C2(M.n)}−${C2(M.k)}+1 = ${M.line}개`);
        }
        return;
      }
      for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
        if (all[i].on && all[j].on) continue;
        b.seg(all[i], all[j], { color: 'sky', width: 1.8, alpha: st === 1 || st >= 99 ? 0.65 : 0.3 });
      }
      const lineCol = st === 2 ? 'rose' : 'sky';
      straight(b, 0, st >= 3 || st >= 99 ? 'green' : lineCol, st === 1 ? 0.5 : 1, st === 2 ? 5 : 4.2);
      all.forEach((p, i) => { b.point(p, { color: p.on ? 'amber' : 'ink', r: 6 }); T(b, p, nm[i], { dy: p.on ? 22 : -17, size: 17 }); });
      if (!C.hide) {
        T(b, { x: XL, y: 2.7 }, `한 직선 위의 점 ${M.k}개 → 이 직선 1개`, { align: 'left', color: st === 2 ? 'rose' : 'green', size: 16 });
        T(b, { x: XL, y: 3.7 }, `직선 ${M.line}개 = ${C2(M.n)} − ${C2(M.k)} + 1`, { align: 'left', color: 'ink', size: 16 });
      }
      M.on.forEach((x, i) => b.handle('P' + i, { x, y: 0 }, { color: 'amber', r: 6, ariaLabel: `한 직선 위의 점 ${i + 1}`, drag: (w) => { const a = M.on.slice(); const lo = i === 0 ? 0 : a[i - 1] + 0.8, hi = i === M.k - 1 ? 12 : a[i + 1] - 0.8; a[i] = clamp(Math.round(w.x * 2) / 2, lo, hi); s.lkx = a; } }));
    },
    quiz: (M, s, rng) => {
      const n = M.n, k = M.k, kind = (s.plSeed || 0) % 2;
      let right, wrongs, word;
      if (kind === 0) { right = M.line; word = '서로 다른 직선'; wrongs = [{ v: C2(n), hint: '한 직선 위의 점들이 만든 직선이 겹치는 것을 빼지 않았어요.' }, { v: C2(n) - C2(k), hint: '겹쳐서 하나가 된 직선 1개를 다시 더해야 해요.' }, { v: C2(n) - C2(k) + 2, hint: '한 직선 위의 점이 만든 직선은 1개만 더해요.' }, { v: C2(n) - k + 1, hint: '한 직선 위에서 겹치는 직선은 C(k,2) = k(k−1)÷2개예요.' }]; }
      else { right = M.ray; word = '서로 다른 반직선'; wrongs = [{ v: n * (n - 1), hint: '한 직선 위의 점들이 만든 반직선이 겹치는 것을 빼지 않았어요.' }, { v: n * (n - 1) - k * (k - 1), hint: '한 직선 위의 반직선 2(k−1)개를 다시 더해야 해요.' }, { v: 2 * M.line, hint: '반직선의 개수는 직선의 2배가 아니에요.' }, { v: n * (n - 1) - k * (k - 1) + k, hint: '한 직선 위의 반직선은 2(k−1)개예요.' }]; }
      return { tag: '일부 점이 한 직선 위', stem: `점 ${n}개 중 ${k}개가 한 직선 위에 있고, 나머지는 어느 세 점도 한 직선 위에 있지 않다. 두 점을 이어 만들 수 있는 ${word}의 개수는?`, choices: PL.numChoices(right, wrongs, { fmt: (v) => `${v}개` }) };
    },
    reroll: (s, rng) => { s.lkn = PL.randInt(rng, 5, 7); s.lkk = PL.randInt(rng, 3, s.lkn - 1); s.lkx = null; }
  });

  PL.lines = { rayNames, interName };
  PL.group({
    order: 20, id: 'lines', title: '직선·반직선·선분', short: '직선·반직선·선분', params: PARAMS,
    scenes: [sRay, sTypes, sSame, sCommon, sShort, sCol, sGen, sMix]
  });
})();
