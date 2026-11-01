/* ==========================================================================
   중1 · 평행선의 성질 — 탭 ④ 「종이 접기」 (t4.js, order 40)
   - p4-1 종이 테이프 접기: 접은 각 a = 원래 각, 엇각 a → 이등변삼각형, ∠x = 180° − 2a.
   - p4-2 귀퉁이 접기: 직각 90° = a + a + x → x = 90° − 2a.
   - p4-3 귀퉁이 두 번 접기: 90° = a + a + x + b + b → x = 90° − 2a − 2b.
   접기: 접는 선(분홍)을 축으로 접힌 부분이 제자리에서 돌아 포개집니다(s.pat 0=펼침 → 1=접힘). 위치 이동은 가로로만.
   접힌 부분은 호박색, 접기 전 모양은 점선, 같은 각은 같은 호 개수.
   ========================================================================== */
(function () {
  'use strict';
  const K = window.APL_PA_KIT;
  if (!K) return;
  const { DEG, clamp, dir, at, angOf, norm, T, dot, parLine, wedge, ticks, mkChoices, makeScene, pick, mi, foldActions, foldTick } = K;

  const wdeg = (d1, d2) => { let w = norm(d2 - d1); if (w > 180) w = 360 - w; return Math.round(w * 1000) / 1000; };
  const ease = K.ease;
  // 점 P 를 접는 선(점 B, 방향 u)을 축으로 c(=cos πt: 1 → −1)만큼 돌린 위치
  const spin = (P, B, u, c) => {
    const d = { x: P.x - B.x, y: P.y - B.y }, al = d.x * u.x + d.y * u.y;
    return { x: B.x + al * u.x + (d.x - al * u.x) * c, y: B.y + al * u.y + (d.y - al * u.y) * c };
  };
  const refl = (P, B, u) => spin(P, B, u, -1);
  const tc = (pat) => Math.cos(Math.PI * clamp(pat, 0, 1)); // 접힘 정도 → 돌림 계수

  /* ======================================================================
     p4-1 종이 테이프 접기
     ====================================================================== */
  const YT = -1.3, YB = 1.3, TH = YB - YT, XL = -3.75;
  function tapeGeom(a, bx) {
    const B = { x: bx, y: YB }, C = { x: bx + TH / Math.tan(a * DEG), y: YT };
    const A = { x: bx + TH / Math.tan(2 * a * DEG), y: YT };
    const u = dir(a), xe = C.x + 0.7, E = { x: xe, y: YB }, F = { x: xe, y: YT };
    return { a, x: 180 - 2 * a, B, C, A, u, E, F, ab: Math.hypot(A.x - B.x, A.y - B.y), ac: Math.hypot(A.x - C.x, A.y - C.y), xw: wdeg(angOf(A, B), 0) };
  }
  const T1 = {
    fA: K.param({ value: 55, min: 40, max: 70, label: '접은 각 a', hint: '그림의 점 C를 좌우로 끌어도 돼요', color: 'amber' }),
    fX: K.param({ value: -1.2, min: -2.4, max: -0.2, step: 0.05, label: '접는 선의 위치', hint: '그림의 점 B를 좌우로 끌어도 돼요', color: 'sky', format: (v) => v.toFixed(1) })
  };
  const D41 = {
    id: 'p4-1', title: '직사각형 종이 테이프 접기', short: '종이 테이프 접기',
    question: '직사각형 종이 테이프를 점 B에서 점 C로 접으면 겹친 삼각형 ABC가 생겨요. 이 삼각형은 어떤 삼각형일까요?',
    focus: { x: [-3.85, 3.85], y: [-3.45, 2.55] }, t0: 1, ctl: ['fA', 'fX'], actions: () => foldActions(), tick: foldTick(1.8, () => 1),
    init: (s) => { s.fA = 55; s.fX = -1.2; },
    reroll: (s) => { s.fA = pick([42, 46, 50, 54, 58, 62, 66], s.fA); s.fX = pick([-2.0, -1.4, -0.8], s.fX); s.pat = 1; },
    model: (s) => Object.assign(tapeGeom(s.fA, s.fX), { pat: s.pat == null ? 1 : s.pat }),
    draw(b, s, M, C) {
      const G = M, prob = C.mode === 'problem', pat = C.mode === 'review' || prob ? 1 : G.pat, c = tc(pat), st = C.mode === 'review' ? C.step : 99;
      const { B, C: Cc, A, u, E, F, a } = G;
      // 종이(고정 부분)
      b.path([{ x: XL, y: YB }, B, Cc, { x: XL, y: YT }], { close: true, fill: 'sky', fillAlpha: 0.14, color: null });
      parLine(b, { x: 0, y: YT }, 0, { e0: -3.6, e1: 3.6, arrows: [-2.8, 2.6], name: 'l', nameAt: 3.3 });
      parLine(b, { x: 0, y: YB }, 0, { e0: -3.6, e1: 3.6, arrows: [-2.8, 2.6], name: 'm', nameAt: 3.3, nameDy: 18 });
      // 접기 전 모양(점선)과 접힌 조각
      const flap = [B, Cc, F, E];
      if (pat < 0.98) b.path(flap, { close: true, color: 'muted', width: 2, dash: [6, 6], alpha: 0.8 });
      const fl = flap.map((p) => spin(p, B, u, c));
      b.path(fl, { close: true, fill: 'amber', fillAlpha: 0.3, color: 'ink', width: 2.4, alpha: 0.85 });
      b.seg(B, Cc, { color: 'rose', width: 4 });
      dot(b, B, 'rose', 5); dot(b, Cc, 'rose', 5);
      T(b, B, 'B', { dy: 19, size: 17 }); T(b, Cc, 'C', { dy: -17, size: 17 });
      const folded = pat >= 0.98;
      // 원래 각
      wedge(b, B, 0, a, { color: 'amber', rings: 1, text: prob ? mi(a) + '°' : mi(a) + '°', r: 28, size: 17 });
      if (folded) {
        wedge(b, B, a, 2 * a, { color: 'amber', rings: 1, text: mi(a) + '°', r: 28, size: 17 });
        T(b, A, 'A', { dy: -17, size: 17 });
        dot(b, A, 'ink', 5);
        if (C.mode !== 'review' || st >= 2) wedge(b, Cc, 180, a + 180, { color: 'amber', rings: 1, text: mi(a) + '°', r: 28, size: 17 });
        if (C.mode !== 'review' || st >= 3) {
          ticks(b, A, B, 1, 'rose'); ticks(b, A, Cc, 1, 'rose');
          wedge(b, A, angOf(A, B), 0, { color: 'green', rings: 3, text: prob ? 'x' : 'x=' + mi(G.x) + '°', r: 34, size: prob ? 20 : 18, fa: 0.16 });
        }
      } else if (C.mode === 'explore') T(b, { x: 0, y: 2.1 }, pat < 0.02 ? '펼친 모양 (접어 보기를 눌러요)' : '접는 중...', { color: 'muted', size: 16 });
      if (C.mode === 'explore') {
        b.handle('hB', B, { color: 'sky', ariaLabel: '접는 선의 아래쪽 점 B(좌우)', priority: 1, drag: (w) => { s.fX = clamp(Math.round(w.x * 20) / 20, -2.4, -0.2); } });
        b.handle('hC', Cc, { color: 'amber', ariaLabel: '접는 선의 위쪽 점 C(접은 각 조절)', drag: (w) => { s.fA = clamp(Math.round(Math.atan2(TH, w.x - s.fX) / DEG), 40, 70); } });
      }
    },
    steps: (M) => [
      `접은 각은 원래 각과 같아요. ∠ABC = ∠EBC = ${mi(M.a)}° (노랑 호 하나로 표시)`,
      `l ∥ m 이므로 엇각의 크기가 같아요. ∠ACB = ∠EBC = ${mi(M.a)}°`,
      `△ABC에서 두 밑각이 ${mi(M.a)}°로 같으므로 AB = AC 인 이등변삼각형이에요. ∠x = 180° − ${mi(M.a)}° − ${mi(M.a)}° = ${mi(M.x)}°`
    ],
    view(M, C, s) {
      return {
        guide: `<b>접어 보기</b>를 누르면 종이 오른쪽이 접는 선 BC를 축으로 돌아 접혀요. 노란 점 C(또는 막대)로 접은 각 a를 바꿔 보세요. 접은 각 = 원래 각 = 엇각이라서 삼각형 ABC는 늘 <b>이등변삼각형</b>이에요.`,
        readouts: [
          { label: '접은 각 = 원래 각', value: mi(M.a) + '°', color: 'amber' }, { label: '엇각 ∠ACB', value: mi(M.a) + '°', color: 'amber' },
          { label: '∠x = 180° − 2a', value: mi(M.x) + '°', color: 'green', note: `180° − ${mi(M.a)}° − ${mi(M.a)}°`, wide: true }
        ],
        status: { tone: 'ok', text: `밑각 ${mi(M.a)}°, ${mi(M.a)}° → x = ${mi(M.x)}°` },
        formula: '<p>접은 각 = 원래 각 = a</p><p>엇각: ∠ACB = a</p><p>∠x = 180° − a − a = 180° − 2a</p>',
        rule: '접은 각 = 원래 각 = 엇각 → 이등변삼각형, ∠x = 180° − 2a',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>길이가 같은 두 변은 <b>AB와 AC</b>예요. 접는 선 BC가 아니에요.</li><li>종이를 접으면 접는 선 양쪽의 각이 같아요. 접기 전·후의 같은 각에 같은 표시를 먼저 해요.</li></ul>'
      };
    },
    prob(M) {
      const a = M.a, x = 180 - 2 * a;
      const wrongs = [
        { v: 180 - a, hint: '삼각형의 세 각의 합 180°에서 밑각 두 개(a, a)를 빼야 해요.' },
        { v: 2 * a, hint: '2a는 두 밑각의 합이에요. ∠x는 180°에서 뺀 나머지예요.' },
        { v: 90 - a, hint: '직각 삼각형이 아니에요. 이등변삼각형의 꼭지각을 구해요.' },
        { v: 180 - a / 2, hint: '밑각은 a, a 예요. a의 절반이 아니에요.' },
        { v: 180 - 3 * a, hint: '밑각 두 개만 빼요. 세 번 빼지 않아요.' }
      ];
      return { tag: '종이 테이프 접기', stem: `그림은 직사각형 모양의 종이 테이프를 접은 것이다. ∠x의 크기는? (원래 각 ∠EBC = ${mi(a)}°)`, key: `${a}`, choices: mkChoices(x, wrongs, { lo: 5, hi: 175 }) };
    }
  };

  /* ======================================================================
     귀퉁이 접기 (p4-2: 한 번, p4-3: 두 번) — 꼭짓점 A 를 지나는 접는 선
     ====================================================================== */
  const RY0 = -2.0, RY1 = 2.0, RH = RY1 - RY0;
  function cornerGeom(w, a, b2, two) {
    const xl = -w / 2, xr = w / 2, A = { x: xl, y: RY1 };
    const Bc = { x: xr, y: RY1 }, Dc = { x: xl, y: RY0 }, TR = { x: xr, y: RY0 };
    const E1 = { x: xr, y: RY1 - w * Math.tan(a * DEG) }, u1 = dir(a);
    const o = { w, xl, xr, A, B: Bc, D: Dc, TR, E1, u1, a, two };
    o.B1 = at(A, 2 * a, w); // 접힌 B 의 자리
    if (two) { const F2 = { x: xl + RH * Math.tan(b2 * DEG), y: RY0 }; Object.assign(o, { b: b2, F2, u2: dir(90 - b2), D2: at(A, 90 - 2 * b2, RH) }); o.x = 90 - 2 * a - 2 * b2; o.xw = wdeg(2 * a, 90 - 2 * b2); }
    else { o.x = 90 - 2 * a; o.xw = wdeg(2 * a, 90); }
    return o;
  }
  function drawCorner(b, G, C, s, o) {
    const prob = C.mode === 'problem', pat = C.mode === 'review' || prob ? 1 : G.pat, c = tc(pat), st = C.mode === 'review' ? C.step : 99;
    const { A, B, D, TR, E1, u1, a } = G, two = G.two;
    const fixed = two ? [A, E1, TR, G.F2] : [A, E1, TR, D];
    b.path(fixed, { close: true, fill: 'sky', fillAlpha: 0.14, color: null });
    // 종이 둘레
    b.path([A, B, TR, D], { close: true, color: 'sky', width: 3.2 });
    const flap1 = [A, B, E1];
    if (pat < 0.98) b.path(flap1, { close: true, color: 'muted', width: 2, dash: [6, 6], alpha: 0.8 });
    if (two && pat < 0.98) b.path([A, D, G.F2], { close: true, color: 'muted', width: 2, dash: [6, 6], alpha: 0.8 });
    b.path(flap1.map((p) => spin(p, A, u1, c)), { close: true, fill: 'amber', fillAlpha: 0.3, color: 'ink', width: 2.4, alpha: 0.85 });
    if (two) b.path([A, D, G.F2].map((p) => spin(p, A, G.u2, c)), { close: true, fill: 'violet', fillAlpha: 0.3, color: 'ink', width: 2.4, alpha: 0.85 });
    b.seg(A, E1, { color: 'rose', width: 4 });
    if (two) b.seg(A, G.F2, { color: 'rose', width: 4 });
    dot(b, A, 'ink', 5.5); dot(b, E1, 'rose', 5); if (two) dot(b, G.F2, 'rose', 5);
    T(b, A, 'A', { dx: -17, dy: 14, size: 17 }); T(b, B, 'B', { dx: 6, dy: 17, size: 17 }); T(b, D, 'D', { dx: -6, dy: -17, size: 17 });
    T(b, E1, 'E', { dx: 16, dy: 0, size: 17 });
    if (two) T(b, G.F2, 'F', { dy: -17, size: 17 });
    const folded = pat >= 0.98, bn = two ? G.b : 0;
    wedge(b, A, 0, a, { color: 'amber', rings: 1, text: mi(a) + '°', r: 38, size: 17, fa: 0.2, at: { dx: 50, dy: 22 } });
    if (two) wedge(b, A, 90 - bn, 90, { color: 'violet', rings: 2, text: mi(bn) + '°', r: 38, size: 17, fa: 0.2, at: { dx: -34, dy: -52 } });
    if (folded) {
      wedge(b, A, a, 2 * a, { color: 'amber', rings: 1, r: 38, fa: 0.2 });
      T(b, G.B1, 'B′', { dx: 20, dy: 0, size: 16, color: 'amber' });
      dot(b, G.B1, 'amber', 4.5);
      if (two) { wedge(b, A, 90 - 2 * bn, 90 - bn, { color: 'violet', rings: 2, r: 38, fa: 0.2 }); T(b, G.D2, 'D′', { dx: -4, dy: -15, size: 16, color: 'violet' }); dot(b, G.D2, 'violet', 4.5); }
      if (C.mode !== 'review' || st >= 3) {
        const lo = 2 * a, hi = two ? 90 - 2 * bn : 90;
        wedge(b, A, lo, hi, { color: 'green', rings: 3, text: prob ? 'x' : 'x=' + mi(G.x) + '°', r: 46, size: prob ? 20 : 18, fa: 0.16 });
      }
      if (C.mode === 'review' && st === 2) T(b, { x: 0, y: 2.75 }, two ? '90° = a + a + x + b + b' : '90° = a + a + x', { color: 'green', size: 18 });
    } else if (C.mode === 'explore') T(b, { x: 0, y: 2.75 }, pat < 0.02 ? '펼친 모양 (접어 보기를 눌러요)' : '접는 중...', { color: 'muted', size: 16 });
    if (!prob && (st === 99 || st === 2)) b.right(A, at(A, 0, 1), at(A, 90, 1), { size: 15, color: 'muted' });
  }
  const PR = {
    kW: K.param({ value: 3.6, min: 3, max: 4.2, step: 0.05, label: '종이의 가로', hint: '그림의 점 B를 좌우로 끌어도 돼요', color: 'sky', format: (v) => v.toFixed(1) }),
    kA: K.param({ value: 22, min: 15, max: 30, label: '접은 각 a', hint: '그림의 접힌 점 B′을 끌어도 돼요', color: 'amber' }),
    k2A: K.param({ value: 14, min: 8, max: 20, label: '접은 각 a (아래쪽 접기)', hint: '그림의 접힌 점 B′을 끌어도 돼요', color: 'amber' }),
    k2B: K.param({ value: 12, min: 8, max: 20, label: '접은 각 b (왼쪽 접기)', hint: '그림의 접힌 점 D′을 끌어도 돼요', color: 'violet' })
  };
  const FOCUS_C = { x: [-3.3, 3.3], y: [-3.0, 3.3] };

  /* ---------------- p4-2 ---------------- */
  const D42 = {
    id: 'p4-2', title: '귀퉁이 접어 올리기', short: '귀퉁이 접기',
    question: '직사각형 종이의 한 귀퉁이를 접는 선 AE로 접어 올렸어요. 직각 90°는 어떻게 나뉘고, ∠x는 얼마일까요?',
    focus: FOCUS_C, t0: 1, ctl: ['kW', 'kA'], actions: () => foldActions(), tick: foldTick(1.8, () => 1),
    init: (s) => { s.kW = 3.6; s.kA = 22; },
    reroll: (s) => { s.kA = pick([16, 18, 20, 22, 24, 26, 28], s.kA); s.kW = pick([3.2, 3.6, 4.0], s.kW); s.pat = 1; },
    model: (s) => Object.assign(cornerGeom(s.kW, s.kA, 0, false), { pat: s.pat == null ? 1 : s.pat }),
    draw(b, s, M, C) {
      drawCorner(b, M, C, s);
      if (C.mode === 'explore') {
        const A = M.A;
        if (M.pat >= 0.98) b.handle('hB1', M.B1, { color: 'amber', ariaLabel: '접힌 점 B′ 손잡이(접은 각 조절)', priority: 1, drag: (w) => { s.pat = 1; s.playing = false; s.kA = clamp(Math.round(angOf(A, w) / 2), 15, 30); } });
        b.handle('hB', M.B, { color: 'sky', ariaLabel: '점 B 손잡이(종이 가로 조절)', drag: (w) => { s.kW = clamp(Math.round((w.x - M.xl) * 20) / 20, 3, 4.2); } });
      }
    },
    steps: (M) => [
      `접은 각은 원래 각과 같아요. ∠B′AE = ∠BAE = ${mi(M.a)}° (노랑 호 하나로 표시)`,
      '직각 ∠BAD = 90°가 ∠BAE, ∠B′AE, ∠x 세 각으로 나뉘어요. 90° = a + a + x',
      `∠x = 90° − ${mi(M.a)}° − ${mi(M.a)}° = ${mi(M.x)}°`
    ],
    view(M, C, s) {
      return {
        guide: '<b>접어 보기</b>를 누르면 귀퉁이가 접는 선 AE를 축으로 돌아 접혀요. 접힌 점 <b>B′</b>를 끌면 접은 각 a가 바뀌어요. 직각 90°가 a, a, x로 나뉘는 것을 확인해 보세요.',
        readouts: [
          { label: '접은 각 = 원래 각', value: mi(M.a) + '°', color: 'amber', note: '∠B′AE = ∠BAE' }, { label: '직각', value: '90°', color: 'muted' },
          { label: '∠x = 90° − 2a', value: mi(M.x) + '°', color: 'green', note: `90° − ${mi(M.a)}° − ${mi(M.a)}°`, wide: true }
        ],
        status: { tone: 'ok', text: `90° = ${mi(M.a)}° + ${mi(M.a)}° + x → x = ${mi(M.x)}°` },
        formula: '<p>접은 각 = 원래 각 = a</p><p>90° = a + a + ∠x</p><p>∠x = 90° − 2a</p>',
        rule: '귀퉁이 접기: ∠x = 90° − 2 × (접은 각)',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>접은 각 a는 <b>두 번</b> 빼야 해요. 접기 전의 각과 접은 후의 각이 모두 직각 안에 들어 있어요.</li><li>접을 때 직각이 그대로 남아 있는 부분이 ∠x예요.</li></ul>'
      };
    },
    prob(M) {
      const a = M.a, x = 90 - 2 * a;
      const wrongs = [
        { v: 90 - a, hint: '접은 각 a가 두 번 들어 있어요. 90°에서 a를 두 번 빼야 해요.' },
        { v: 180 - 2 * a, hint: '직각 90°가 기준이에요. 180°가 아니에요.' },
        { v: 2 * a, hint: '2a는 접은 각 두 개의 합이에요. x는 나머지 각이에요.' },
        { v: 90 - 3 * a, hint: 'a는 두 번만 빼요.' },
        { v: 90 + a, hint: '직각에서 빼는 거예요. 더하지 않아요.' }
      ];
      return { tag: '귀퉁이 접기', stem: `그림은 직사각형 모양의 종이의 한 귀퉁이를 선분 AE를 접는 선으로 하여 접은 것이다. ∠x의 크기는? (∠BAE = ${mi(a)}°)`, key: `${a}`, choices: mkChoices(x, wrongs, { lo: 3, hi: 89 }) };
    }
  };

  /* ---------------- p4-3 ---------------- */
  const D43 = {
    id: 'p4-3', title: '귀퉁이를 두 번 접기', short: '두 번 접기',
    question: '한 귀퉁이에서 아래쪽 변과 왼쪽 변을 차례로 접었어요. 직각 90°는 어떻게 나뉘고, ∠x는 얼마일까요?',
    focus: FOCUS_C, t0: 1, ctl: ['kW', 'k2A', 'k2B'], actions: () => foldActions(), tick: foldTick(1.8, () => 1),
    init: (s) => { s.kW = 3.6; s.k2A = 14; s.k2B = 12; },
    reroll: (s) => { s.k2A = pick([10, 12, 14, 16, 18], s.k2A); s.k2B = pick([9, 11, 13, 15, 17], s.k2B); s.kW = pick([3.2, 3.6, 4.0], s.kW); s.pat = 1; },
    model: (s) => { const a = s.k2A, b2 = Math.min(s.k2B, 40 - a); return Object.assign(cornerGeom(s.kW, a, b2, true), { pat: s.pat == null ? 1 : s.pat }); },
    draw(b, s, M, C) {
      drawCorner(b, M, C, s);
      if (C.mode === 'explore') {
        const A = M.A;
        if (M.pat >= 0.98) b.handle('hB1', M.B1, { color: 'amber', ariaLabel: '접힌 점 B′ 손잡이(접은 각 a 조절)', priority: 1, drag: (w) => { s.pat = 1; s.playing = false; s.k2A = clamp(Math.round(angOf(A, w) / 2), 8, 20); } });
        if (M.pat >= 0.98) b.handle('hD2', M.D2, { color: 'violet', ariaLabel: '접힌 점 D′ 손잡이(접은 각 b 조절)', priority: 1, drag: (w) => { s.pat = 1; s.playing = false; s.k2B = clamp(Math.round((90 - angOf(A, w)) / 2), 8, 20); } });
      }
    },
    steps: (M) => [
      `접은 각은 원래 각과 같아요. 아래쪽 ∠B′AE = ∠BAE = ${mi(M.a)}° (호 1개), 왼쪽 ∠D′AF = ∠DAF = ${mi(M.b)}° (호 2개)`,
      '직각 90°가 a, a, x, b, b 다섯 각으로 나뉘어요. 90° = a + a + x + b + b',
      `∠x = 90° − ${mi(M.a)}° − ${mi(M.a)}° − ${mi(M.b)}° − ${mi(M.b)}° = ${mi(M.x)}°`
    ],
    view(M, C, s) {
      return {
        guide: '<b>접어 보기</b>를 누르면 두 귀퉁이가 각각 접는 선 AE, AF를 축으로 돌아 접혀요. 접힌 점 <b>B′</b>, <b>D′</b>를 끌어 접은 각 a, b를 바꿔 보세요. 직각 90°가 다섯 부분으로 나뉘어요.',
        readouts: [
          { label: '아래쪽 접은 각 a', value: mi(M.a) + '°', color: 'amber' }, { label: '왼쪽 접은 각 b', value: mi(M.b) + '°', color: 'violet' },
          { label: '∠x = 90° − 2a − 2b', value: mi(M.x) + '°', color: 'green', note: `90° − ${mi(2 * M.a)}° − ${mi(2 * M.b)}°`, wide: true }
        ],
        status: { tone: 'ok', text: `x = 90° − 2a − 2b = ${mi(M.x)}°` },
        formula: '<p>90° = a + a + ∠x + b + b</p><p>∠x = 90° − 2a − 2b</p>',
        rule: '두 번 접기: ∠x = 90° − 2a − 2b',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>접는 선이 두 개면 접은 각도 <b>각각 두 번씩</b> 빼요. a는 호 1개, b는 호 2개로 구분해요.</li><li>접은 부분끼리 겹치지 않을 때(x가 0°보다 클 때)만 ∠x가 보여요.</li></ul>'
      };
    },
    prob(M) {
      const a = M.a, b2 = M.b, x = 90 - 2 * a - 2 * b2;
      const wrongs = [
        { v: 90 - a - b2, hint: '접은 각은 각각 두 번씩 들어 있어요. 90°에서 2a와 2b를 빼야 해요.' },
        { v: 90 - 2 * a, hint: '왼쪽 접기의 각 b도 두 번 빼야 해요.' },
        { v: 90 - 2 * b2, hint: '아래쪽 접기의 각 a도 두 번 빼야 해요.' },
        { v: 90 - 2 * a - b2, hint: 'b도 두 번 빼야 해요. 접기 전과 후의 각이 모두 직각 안에 있어요.' },
        { v: 90 + 2 * a + 2 * b2 - 180 + 20, hint: '직각 90°에서 접은 각들을 빼요.' }
      ];
      return { tag: '귀퉁이 두 번 접기', stem: `그림은 직사각형 모양의 종이를 선분 AE와 선분 AF를 접는 선으로 하여 접은 것이다. ∠x의 크기는? (∠BAE = ${mi(a)}°, ∠DAF = ${mi(b2)}°)`, key: `${a}-${b2}`, choices: mkChoices(x, wrongs, { lo: 3, hi: 89 }) };
    }
  };

  K.register({
    order: 40, id: 'parallel-fold', title: '종이 접기', short: '종이 접기',
    params: Object.assign({}, T1, PR),
    scenes: [D41, D42, D43].map(makeScene)
  });
})();
