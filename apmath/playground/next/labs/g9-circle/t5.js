/* ==========================================================================
   중3 · 원의 성질 — 탭 ⑤ 「내접사각형」 (t5.js, order 50) — 장면 5개
   · c5-1 내접사각형의 대각           · ∠A+∠C=180°, ∠B+∠D=180°
   · c5-2 내접사각형의 한 외각        · 한 외각의 크기 = 그 이웃한 내각의 대각의 크기
   · c5-3 두 쌍의 대변의 연장선       · 교점 P, Q와 ∠A+∠P+∠Q 관계 (∠P+∠Q=180°−2∠A)
   · c5-4 [킬러] 내접오각형           · 보조선 AC, CE로 ∠ACE = ∠B+∠D−180°
   · c5-5 사각형이 원에 내접할 조건   · 점 D를 가로로 끌며 세 조건을 한꺼번에 확인
   값은 모두 지금의 각·호의 크기로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, lerp, mp, T, tick, line, fit, P, rd, notes, fmtN, circle, arcD, dot, pname, segTag, tagOut, ang, cv, nt, ntD, sz, fillPoly, mkChoices, degOf, norm360, inter, bboxOf } = G;
  const degF = G.degF, dgx = (v) => fmtN(v) + '°';
  const pickR = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
  const S = (b, a = 16) => sz(b, a);
  const O = pt(0, 0), R = 6;
  const pp = (deg) => mp(O, R, deg);
  const ok180 = (v) => v > 0 && v < 180 && Math.abs(v - Math.round(v)) < 1e-9;
  const mkDeg = (ans, wr, pad = 5) => mkChoices(ans, wr, { pad, valid: ok180 });
  const angAt = (V, X, Y) => { const u = sub(X, V), v = sub(Y, V); return Math.acos(clamp((u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)), -1, 1)) / DEG; };
  // 대각쌍의 비교색과 등각 표식은 구분합니다. 실제로 같은 각만 같은 호 개수를 씁니다.
  const angleRings = (values) => {
    const seen = [];
    return values.map(value => {
      let i = seen.findIndex(x => Math.abs(x - value) < 1e-7);
      if (i < 0) { i = seen.length; seen.push(value); }
      return i + 1;
    });
  };
  const FIT = (b, o = {}) => fit(b, { x0: -R, x1: R, y0: -R, y1: R }, { t: 62, b: 44, l: 44, r: 44, ...o });

  const TYN = ['직사각형', '정사각형', '등변사다리꼴', '평행사변형', '마름모', '등변이 아닌 사다리꼴'];
  const PARAMS = {
    c5A: P('∠A의 크기', 50, 130, 5, 70, { color: 'sky', format: degF }),
    c5B: P('∠B의 크기', 50, 130, 5, 100, { color: 'green', format: degF }),
    c5p: P('∠P의 크기', 20, 40, 2, 30, { color: 'sky', format: degF }),
    c5q: P('∠Q의 크기', 20, 40, 2, 24, { color: 'green', format: degF }),
    c5b: P('호 BC의 크기', 30, 80, 5, 50, { color: 'amber', format: degF }),
    c5pb: P('∠B (오각형)', 100, 130, 5, 110, { color: 'sky', format: degF }),
    c5pd: P('∠D (오각형)', 100, 130, 5, 120, { color: 'green', format: degF }),
    c5d: P('점 D의 가로 위치', -5.6, 2.4, 0.1, -1.2, { color: 'amber', hint: '노란 점 D를 가로로 끌어도 돼요', format: (v) => fmtN(v) }),
    c5ty: P('사각형의 종류', 0, 5, 1, 2, { color: 'amber', format: (v) => TYN[Math.round(v)] || '' }),
    c5th: P('기준 각도', 55, 80, 5, 65, { color: 'sky', format: degF })
  };

  /* ---- 내접사각형: ∠A, ∠B 로 호를 정한다. 반시계 아님: 시계 방향으로 A→B→C→D ---- */
  function quadG(A0, B0) {
    const lo = Math.max(20, 2 * A0 + 2 * B0 - 340), hi = Math.min(2 * A0, 2 * B0) - 20, gam = lo <= hi ? Math.round((lo + hi) / 4) * 2 : Math.max(20, lo);
    const be = 2 * A0 - gam, de = 2 * B0 - gam, al = 360 - be - gam - de, a0 = 150;
    const A = pp(a0), B = pp(a0 - al), C = pp(a0 - al - be), D = pp(a0 - al - be - gam);
    return { A0, B0, C0: 180 - A0, D0: 180 - B0, arcs: [al, be, gam, de], angleRings: angleRings([A0, B0, 180 - A0, 180 - B0]), A, B, C, D };
  }
  const setAB = (s) => { s.c5A = clamp(Math.round(s.c5A / 5) * 5, 50, 130); s.c5B = clamp(Math.round(s.c5B / 5) * 5, 50, 130); };
  const qgen = (rnd) => { const a = pickR(rnd, [60, 65, 70, 75, 80, 85, 95, 100, 105, 110]), b = pickR(rnd, [60, 70, 75, 80, 85, 95, 100, 110, 115]); return [a, b]; };
  const drawQuad = (b, g, o) => {
    circle(b, O, R, 'ink', 3.4, { fill: 'sky', fa: 0.04 });
    b.path([g.A, g.B, g.C, g.D], { close: true, color: 'ink', width: 3.6 });
    pname(b, g.A, O, 'A'); pname(b, g.B, O, 'B'); pname(b, g.C, O, 'C'); pname(b, g.D, O, 'D');
  };

  /* ====================================================================== 1. 내접사각형의 대각 */
  const opp = {
    id: 'c5-1', title: '내접사각형에서 마주 보는 두 각의 합 = 180°', short: '내접사각형의 대각',
    question: '원에 내접하는 사각형 ABCD에서 마주 보는 두 각 ∠A와 ∠C의 합은 얼마일까? ∠B와 ∠D는? ∠A, ∠B를 바꿔 확인해 보자.',
    ctl: ['c5A', 'c5B'],
    init: (s) => { s.c5A = 70; s.c5B = 100; setAB(s); },
    gen(rnd, n) { const kind = n % 3, [a, b] = qgen(rnd); let x = 0, a1 = 0, c1 = 0; if (kind === 2) { x = pickR(rnd, [25, 30, 35, 40, 45, 50]); a1 = pickR(rnd, [10, 15, 20, 30]); c1 = 180 - a1 - 3 * x; if (c1 === 0) { a1 += 5; c1 = 180 - a1 - 3 * x; } } return { kind, a, b, x, a1, c1, key: `o${kind}.${a}.${b}.${x}.${a1}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; if (q.kind === 2) return { q, g: quadG(q.x + q.a1, q.b) }; return { q, g: quadG(q.a, q.b) }; }
      setAB(s); return { g: quadG(s.c5A, s.c5B) };
    },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D } = g;
      FIT(b); drawQuad(b, g);
      if (!C.txt) return;
      if (pr) {
        if (q.kind === 0) { ang(b, B, A, Cc, { color: 'sky', rings: g.angleRings[1], label: dgx(q.b), r: 28, size: S(b) }); ang(b, D, A, Cc, { color: 'rose', rings: g.angleRings[3], label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, A, B, D, { color: 'sky', rings: g.angleRings[0], label: dgx(q.a), r: 28, size: S(b) }); ang(b, Cc, B, D, { color: 'rose', rings: g.angleRings[2], label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, A, B, D, { color: 'sky', rings: g.angleRings[0], label: `(x+${q.a1})°`, r: 26, size: S(b) - 1 }); ang(b, Cc, B, D, { color: 'sky', rings: g.angleRings[2], label: `(${q.c1 >= 0 ? '2x+' + q.c1 : '2x−' + (-q.c1)})°`, r: 26, size: S(b) - 1 }); }
        return;
      }
      if (ex || st >= 1) { ang(b, A, B, D, { color: 'sky', rings: g.angleRings[0], label: dgx(g.A0), r: 28, size: S(b) }); ang(b, Cc, B, D, { color: 'sky', rings: g.angleRings[2], label: dgx(g.C0), r: 28, size: S(b) }); }
      if (ex || st >= 2) { ang(b, B, A, Cc, { color: 'rose', rings: g.angleRings[1], label: dgx(g.B0), r: 28, size: S(b) }); ang(b, D, A, Cc, { color: 'rose', rings: g.angleRings[3], label: dgx(g.D0), r: 28, size: S(b) }); }
    },
    steps: (M) => [
      `대각선 BD를 그어요. ∠A는 호 BCD에 대한 원주각이고 ∠C는 호 DAB에 대한 원주각이에요.`,
      `두 호를 합치면 원 전체(360°)이므로 $\\angle A+\\angle C=\\frac{1}{2}\\times 360^{\\circ}=180^{\\circ}$. 지금: $${fmtN(M.g.A0)}^{\\circ}+${fmtN(M.g.C0)}^{\\circ}=180^{\\circ}$.`,
      `같은 방법으로 $\\angle B+\\angle D=180^{\\circ}$. 지금: $${fmtN(M.g.B0)}^{\\circ}+${fmtN(M.g.D0)}^{\\circ}=180^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A</b>와 <b>∠B</b>를 바꿔 보세요. 마주 보는 두 각(A와 C, B와 D)의 합은 늘 <b>180°</b>예요.',
      readouts: [rd('∠A', dgx(M.g.A0), 'sky'), rd('∠C', dgx(M.g.C0), 'sky', '∠A+∠C=180°'), rd('∠B', dgx(M.g.B0), 'rose'), rd('∠D', dgx(M.g.D0), 'rose', '∠B+∠D=180°')],
      rule: '원에 내접하는 사각형에서 마주 보는 두 각의 크기의 합은 180°이다',
      notes: notes('이웃한 두 각의 합은 180°가 아니에요. <b>마주 보는</b> 두 각이에요.', '거꾸로, 마주 보는 두 각의 합이 180°인 사각형은 원에 내접해요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '사각형 ABCD가 원에 내접한다.';
      if (q.kind === 0) {
        tag = '내접사각형의 대각 · ∠D'; ans = 180 - q.b; meas = angAt(g.D, g.A, g.C) * 0 + angAt(g.D, g.C, g.A);
        stem = `${pre} $\\angle B=${q.b}^{\\circ}$일 때, $\\angle D$의 크기 $x$는?`;
        wr = [[q.b, '마주 보는 두 각의 합이 180°예요.'], [360 - q.b, '두 각의 합은 180°예요.'], [90 - q.b / 2, '두 각의 합은 180°예요.'], [180 - q.b + 10, '두 각의 합은 180°예요.'], [90 + q.b / 2, '두 각의 합은 180°예요.']];
        return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
      }
      if (q.kind === 1) {
        tag = '내접사각형의 대각 · ∠C'; ans = 180 - q.a; meas = angAt(g.C, g.B, g.D);
        stem = `${pre} $\\angle A=${q.a}^{\\circ}$일 때, $\\angle C$의 크기 $x$는?`;
        wr = [[q.a, '마주 보는 두 각의 합이 180°예요.'], [360 - q.a, '두 각의 합은 180°예요.'], [90 - q.a / 2, '두 각의 합은 180°예요.'], [180 - q.a + 10, '두 각의 합은 180°예요.'], [90 + q.a / 2, '두 각의 합은 180°예요.']];
        return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
      }
      tag = '내접사각형의 대각 · 방정식'; ans = q.x; meas = g.A0 - q.a1;
      stem = `${pre} $\\angle A=(x+${q.a1})^{\\circ}$, $\\angle C=(${q.c1 >= 0 ? '2x+' + q.c1 : '2x-' + (-q.c1)})^{\\circ}$일 때, $x$의 값은?`;
      wr = [[q.x + 5, '∠A+∠C=180°로 식을 세워요.'], [q.x - 5, '∠A+∠C=180°로 식을 세워요.'], [q.x + 10, '∠A+∠C=180°로 식을 세워요.'], [Math.round((360 - q.a1 - q.c1) / 3), '∠A+∠C=180°예요(360°가 아니에요).'], [q.x - 10, '∠A+∠C=180°로 식을 세워요.']];
      return { tag, key, stem, choices: mkChoices(ans, wr, { pad: 5, tex: (v) => String(v), plain: (v) => String(v), valid: (v) => v > 0 && Number.isInteger(v) }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 2. 내접사각형의 한 외각 */
  const ext = {
    id: 'c5-2', title: '내접사각형의 한 외각', short: '내접사각형의 외각',
    question: '내접사각형 ABCD에서 변 BC를 점 C 쪽으로 연장한 점을 E라 하자. 외각 ∠DCE의 크기는 어느 각과 같을까?',
    ctl: ['c5A', 'c5B'],
    init: (s) => { s.c5A = 75; s.c5B = 100; setAB(s); },
    gen(rnd, n) { const kind = n % 3, [a, b] = qgen(rnd); return { kind, a, b, key: `x${kind}.${a}.${b}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; const g = quadG(q.a, q.b); g.E = add(g.C, mul(unit(sub(g.C, g.B)), 2.4)); return { q, g }; } setAB(s); const g = quadG(s.c5A, s.c5B); g.E = add(g.C, mul(unit(sub(g.C, g.B)), 2.4)); return { g }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D, E } = g;
      fit(b, { x0: -R, x1: Math.max(R, E.x) + 0.2, y0: Math.min(-R, E.y) - 0.2, y1: Math.max(R, E.y) + 0.2 }, { t: 62, b: 44, l: 44, r: 44 });
      drawQuad(b, g); line(b, Cc, E, 'ink', 3.6); dot(b, E, 'ink'); tagOut(b, E, O, 'E', { size: 17 });
      if (!C.txt) return;
      if (pr) {
        if (q.kind === 0) { ang(b, Cc, D, E, { color: 'rose', rings: 2, label: 'x', r: 28, size: S(b) + 3 }); ang(b, A, B, D, { color: 'sky', rings: 1, label: dgx(q.a), r: 28, size: S(b) }); }
        if (q.kind === 1) { ang(b, Cc, D, E, { color: 'sky', rings: 2, label: dgx(q.a), r: 28, size: S(b) }); ang(b, A, B, D, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, Cc, D, E, { color: 'sky', rings: 2, label: dgx(q.a), r: 28, size: S(b) }); ang(b, Cc, B, D, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3 }); }
        return;
      }
      if (ex || st >= 1) ang(b, Cc, D, B, { color: 'sky', rings: 1, label: dgx(g.C0), r: 26, size: S(b) - 1 });
      if (ex || st >= 2) ang(b, Cc, D, E, { color: 'rose', rings: 2, label: dgx(g.A0), r: 28, size: S(b) });
      if (ex || st >= 3) ang(b, A, B, D, { color: 'rose', rings: 2, label: dgx(g.A0), r: 28, size: S(b) });
    },
    steps: (M) => [
      `내접사각형이므로 $\\angle BCD+\\angle A=180^{\\circ}$ → $\\angle BCD=${fmtN(M.g.C0)}^{\\circ}$.`,
      `점 B, C, E는 한 직선 위에 있으므로 $\\angle BCD+\\angle DCE=180^{\\circ}$.`,
      `두 식에서 $\\angle DCE=\\angle A=${fmtN(M.g.A0)}^{\\circ}$.`,
      '그래서 <b>내접사각형의 한 외각의 크기는 그 외각에 이웃한 내각의 대각의 크기와 같다</b>.'
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A</b>를 바꿔 보세요. 연장선 위의 외각 ∠DCE는 늘 <b>∠A와 같아요</b>(같은 호 표시).',
      readouts: [rd('∠A', dgx(M.g.A0), 'rose'), rd('∠BCD', dgx(M.g.C0), 'sky', '180°−∠A'), rd('외각 ∠DCE', dgx(M.g.A0), 'rose', '= ∠A')],
      rule: '내접사각형의 한 외각의 크기는 그 외각과 이웃한 내각의 대각의 크기와 같다',
      notes: notes('외각 ∠DCE와 <b>이웃한 내각</b>은 ∠BCD이고, 그 <b>대각</b>이 ∠A예요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '사각형 ABCD가 원에 내접하고 변 BC의 연장선 위에 점 E가 있다.';
      if (q.kind === 0) {
        tag = '내접사각형의 외각 · ∠DCE'; ans = q.a; meas = angAt(g.C, g.D, g.E);
        stem = `${pre} $\\angle A=${q.a}^{\\circ}$일 때, $\\angle DCE$의 크기 $x$는?`;
        wr = [[180 - q.a, '이것은 ∠BCD예요. 외각은 대각 ∠A와 같아요.'], [q.a / 2, '외각은 대각 ∠A와 같아요.'], [90 - q.a / 2, '외각은 대각 ∠A와 같아요.'], [q.a + 10, '외각은 대각 ∠A와 같아요.'], [2 * q.a > 170 ? q.a - 10 : 2 * q.a, '외각은 대각 ∠A와 같아요.']];
      } else if (q.kind === 1) {
        tag = '내접사각형의 외각 · ∠A'; ans = q.a; meas = angAt(g.A, g.B, g.D);
        stem = `${pre} $\\angle DCE=${q.a}^{\\circ}$일 때, $\\angle A$의 크기 $x$는?`;
        wr = [[180 - q.a, '이것은 ∠BCD예요. ∠A는 외각과 같아요.'], [q.a / 2, '∠A는 외각과 같아요.'], [90 - q.a / 2, '∠A는 외각과 같아요.'], [q.a + 10, '∠A는 외각과 같아요.'], [2 * q.a > 170 ? q.a - 10 : 2 * q.a, '∠A는 외각과 같아요.']];
      } else {
        tag = '내접사각형의 외각 · ∠BCD'; ans = 180 - q.a; meas = angAt(g.C, g.B, g.D);
        stem = `${pre} $\\angle DCE=${q.a}^{\\circ}$일 때, $\\angle BCD$의 크기 $x$는?`;
        wr = [[q.a, '이것은 외각 ∠DCE예요. ∠BCD=180°−∠DCE.'], [q.a / 2, '∠BCD+∠DCE=180°예요.'], [90 - q.a / 2, '∠BCD+∠DCE=180°예요.'], [180 - q.a + 10, '∠BCD+∠DCE=180°예요.'], [90 + q.a / 2, '∠BCD+∠DCE=180°예요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 3. 두 쌍의 대변의 연장선 */
  // 호: AB=α, BC=β, CD=γ, DA=δ (시계 방향). ∠P=½(δ−β), ∠Q=½(α−γ)
  function crossG(p, q, be) {
    const ga = 180 - be - p - q, de = be + 2 * p, al = ga + 2 * q, a0 = 200;
    const A = pp(a0), B = pp(a0 - al), C = pp(a0 - al - be), D = pp(a0 - al - be - ga);
    const Pp = inter(A, B, D, C), Qq = inter(A, D, B, C);
    return { p, q, be, ga, de, al, A, B, C, D, P: Pp, Q: Qq, A0: (be + ga) / 2, B0: (ga + de) / 2, C0: (de + al) / 2, D0: (al + be) / 2 };
  }
  const crossOK = (p, q, be) => { const ga = 180 - be - p - q; return ga >= 25 && ga <= 110; };
  const cross = {
    id: 'c5-3', title: '두 쌍의 대변을 연장한 교점 P, Q', short: '대변의 연장선 P, Q',
    question: '내접사각형 ABCD에서 BA, CD의 연장선이 만나는 점 P와 AD, BC의 연장선이 만나는 점 Q에 대하여 ∠A, ∠P, ∠Q 사이에는 어떤 관계가 있을까?',
    ctl: ['c5p', 'c5q', 'c5b'],
    init: (s) => { s.c5p = 30; s.c5q = 24; s.c5b = 50; },
    gen(rnd, n) { const kind = n % 3; for (let t = 0; t < 60; t++) { const p = pickR(rnd, [20, 24, 28, 30, 32, 36, 40]), q = pickR(rnd, [20, 24, 28, 30, 32, 36, 40]), be = pickR(rnd, [30, 40, 50, 60, 70]); if (crossOK(p, q, be) && (180 - p - q) % 2 === 0) return { kind, p, q, be, key: `p${kind}.${p}.${q}.${be}` }; } return { kind, p: 32, q: 44 - 12, be: 40, key: `p${kind}.fb` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, g: crossG(q.p, q.q, q.be) }; }
      let be = s.c5b; if (!crossOK(s.c5p, s.c5q, be)) { const ga0 = 180 - s.c5p - s.c5q; be = clamp(ga0 - 25 >= 30 ? 30 : 30, 30, 80); for (let v = 30; v <= 80; v += 5) if (crossOK(s.c5p, s.c5q, v)) { be = v; break; } s.c5b = be; }
      return { g: crossG(s.c5p, s.c5q, be) };
    },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D, P: Pp, Q: Qq } = g;
      const bb = bboxOf([A, B, Cc, D, Pp, Qq, pt(-R, -R), pt(R, R)], 0.5);
      fit(b, bb, { t: 62, b: 44, l: 44, r: 44 });
      circle(b, O, R, 'ink', 3.4, { fill: 'sky', fa: 0.04 });
      b.path([A, B, Cc, D], { close: true, color: 'ink', width: 3.6 });
      line(b, B, Pp, 'ink', 3); line(b, Cc, Pp, 'ink', 3); line(b, D, Qq, 'ink', 3); line(b, Cc, Qq, 'ink', 3);
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); pname(b, D, O, 'D'); dot(b, Pp, 'ink', 4.6); dot(b, Qq, 'ink', 4.6);
      if (!C.txt) return;
      tagOut(b, Pp, O, 'P', { size: 17 }); tagOut(b, Qq, O, 'Q', { size: 17 });
      if (pr) {
        if (q.kind === 0) { ang(b, Pp, B, Cc, { color: 'sky', rings: 2, label: dgx(q.p), r: 30, size: S(b) }); ang(b, Qq, D, Cc, { color: 'sky', rings: 3, label: dgx(q.q), r: 30, size: S(b) }); ang(b, A, B, D, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, A, B, D, { color: 'sky', rings: 1, label: dgx(g.A0), r: 28, size: S(b) }); ang(b, Pp, B, Cc, { color: 'sky', rings: 2, label: dgx(q.p), r: 30, size: S(b) }); ang(b, Qq, D, Cc, { color: 'rose', rings: 3, label: 'x', r: 30, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, Pp, B, Cc, { color: 'sky', rings: 2, label: dgx(q.p), r: 30, size: S(b) }); ang(b, Qq, D, Cc, { color: 'sky', rings: 3, label: dgx(q.q), r: 30, size: S(b) }); ang(b, B, A, Cc, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3 }); }
        return;
      }
      ang(b, A, B, D, { color: 'rose', rings: 1, label: dgx(g.A0), r: 28, size: S(b) });
      if (ex || st >= 1) ang(b, Pp, B, Cc, { color: 'sky', rings: 2, label: dgx(g.p), r: 30, size: S(b) });
      if (ex || st >= 2) ang(b, Qq, D, Cc, { color: 'green', rings: 3, label: dgx(g.q), r: 30, size: S(b) });
    },
    steps: (M) => [
      `삼각형 PAD에서 $\\angle P=180^{\\circ}-\\angle A-\\angle ADP$이고, $\\angle ADP=\\angle ADC$이므로 $\\angle P=180^{\\circ}-\\angle A-\\angle D$.`,
      `삼각형 QAB에서 $\\angle Q=180^{\\circ}-\\angle A-\\angle ABQ=180^{\\circ}-\\angle A-\\angle B$.`,
      `두 식을 더하면 $\\angle P+\\angle Q=360^{\\circ}-2\\angle A-(\\angle B+\\angle D)$이고 내접사각형이므로 $\\angle B+\\angle D=180^{\\circ}$.`,
      `그래서 $\\angle P+\\angle Q=180^{\\circ}-2\\angle A$, 즉 $\\angle A=\\frac{180^{\\circ}-\\angle P-\\angle Q}{2}=\\frac{180^{\\circ}-${fmtN(M.g.p)}^{\\circ}-${fmtN(M.g.q)}^{\\circ}}{2}=${fmtN(M.g.A0)}^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠P</b>, <b>∠Q</b>, <b>호 BC</b>를 바꿔 보세요. ∠A가 어떻게 변하든 <b>∠P+∠Q+2∠A=180°</b>예요.',
      readouts: [rd('∠A', dgx(M.g.A0), 'rose'), rd('∠P', dgx(M.g.p), 'sky'), rd('∠Q', dgx(M.g.q), 'green'), rd('∠P+∠Q+2∠A', dgx(M.g.p + M.g.q + 2 * M.g.A0), 'amber', '늘 180°')],
      rule: '내접사각형에서 BA와 CD의 연장선의 교점 P, AD와 BC의 연장선의 교점 Q에 대하여 $\\angle P+\\angle Q+2\\angle A=180^{\\circ}$',
      notes: notes('이 관계는 두 삼각형(PAD, QAB)의 내각의 합과 대각의 합 180°에서 나와요.', '∠A는 P와 Q에서 가장 먼 꼭짓점의 각이에요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '원에 내접하는 사각형 ABCD에서 BA, CD의 연장선의 교점을 P, AD, BC의 연장선의 교점을 Q라 하자.';
      const Aa = g.A0;
      if (q.kind === 0) {
        tag = '두 연장선의 교점 · ∠A'; ans = Aa; meas = angAt(g.A, g.B, g.D);
        stem = `${pre} $\\angle P=${q.p}^{\\circ}$, $\\angle Q=${q.q}^{\\circ}$일 때, $\\angle A$의 크기 $x$는?`;
        wr = [[q.p + q.q, '∠P+∠Q+2∠A=180°예요.'], [180 - q.p - q.q, '이것은 2∠A예요. ∠A는 그 절반이에요.'], [Aa + 10, '∠P+∠Q+2∠A=180°예요.'], [(q.p + q.q) / 2, '∠P+∠Q+2∠A=180°예요.'], [Aa - 10, '∠P+∠Q+2∠A=180°예요.']];
      } else if (q.kind === 1) {
        tag = '두 연장선의 교점 · ∠Q'; ans = q.q; meas = angAt(g.Q, g.D, g.C);
        stem = `${pre} $\\angle A=${Aa}^{\\circ}$, $\\angle P=${q.p}^{\\circ}$일 때, $\\angle Q$의 크기 $x$는?`;
        wr = [[180 - Aa - q.p, '∠P+∠Q+2∠A=180°예요. 2∠A를 써요.'], [q.q + 10, '∠P+∠Q+2∠A=180°예요.'], [Aa, '∠A와 ∠Q는 달라요.'], [q.q - 6, '∠P+∠Q+2∠A=180°예요.'], [180 - 2 * Aa, '이것은 ∠P+∠Q예요.']];
      } else {
        tag = '두 연장선의 교점 · ∠ABC'; ans = 180 - Aa - q.q; meas = angAt(g.B, g.A, g.C);
        stem = `${pre} $\\angle P=${q.p}^{\\circ}$, $\\angle Q=${q.q}^{\\circ}$일 때, $\\angle ABC$의 크기 $x$는?`;
        wr = [[Aa, '이것은 ∠A예요. 삼각형 QAB에서 ∠B를 구해요.'], [180 - Aa, '삼각형 QAB: ∠A+∠B+∠Q=180°예요.'], [180 - q.q, '삼각형 QAB: ∠A+∠B+∠Q=180°예요.'], [ans + 10, '삼각형 QAB: ∠A+∠B+∠Q=180°예요.'], [ans - 10, '삼각형 QAB: ∠A+∠B+∠Q=180°예요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 4. [킬러] 내접오각형 */
  const pentG = (B0, D0) => {
    let x = B0 + D0 - 180; x = clamp(x, 15, 60);
    const ea = 2 * x, cd = B0 - x, de = B0 - x, ab = D0 - x, bc = D0 - x, a0 = 120;
    // 시계 방향 A,B,C,D,E : 호 AB=ab, BC=bc, CD=cd, DE=de, EA=ea
    const arcs = [ab, bc, cd, de, ea], tot = arcs.reduce((p, v) => p + v, 0), k = 360 / tot;
    const ang2 = []; let cur = a0; const pts = [];
    for (let i = 0; i < 5; i++) { pts.push(pp(cur)); cur -= arcs[i] * k; }
    void ang2;
    return { B0, D0, x: B0 + D0 - 180, A: pts[0], B: pts[1], C: pts[2], D: pts[3], E: pts[4], arcs: arcs.map((v) => v * k) };
  };
  const clampPD = (s) => { s.c5pb = clamp(Math.round(s.c5pb / 5) * 5, 100, 130); s.c5pd = clamp(Math.round(s.c5pd / 5) * 5, 100, 130); let t = 0; while (s.c5pb + s.c5pd - 180 > 60 && t++ < 30) { s.c5pd -= 5; } while (s.c5pb + s.c5pd - 180 < 15 && t++ < 60) { s.c5pd += 5; } };
  const pent = {
    id: 'c5-4', title: '[킬러] 내접오각형에 보조선 긋기', short: '[킬러] 내접오각형',
    question: '원에 내접하는 오각형 ABCDE에서 ∠B와 ∠D를 알 때 대각선 AC, CE가 이루는 ∠ACE의 크기는? 보조선을 그어 내접사각형을 찾아보자.',
    ctl: ['c5pb', 'c5pd'],
    init: (s) => { s.c5pb = 110; s.c5pd = 120; clampPD(s); },
    gen(rnd, n) { const kind = n % 3; for (let t = 0; t < 40; t++) { const B0 = pickR(rnd, [105, 110, 115, 120, 125]), D0 = pickR(rnd, [105, 110, 115, 120, 125]), x = B0 + D0 - 180; if (x >= 30 && x <= 60) return { kind, B0, D0, key: `n${kind}.${B0}.${D0}` }; } return { kind, B0: 110, D0: 120, key: `n${kind}.fb` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: pentG(q.B0, q.D0) }; } clampPD(s); return { g: pentG(s.c5pb, s.c5pd) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D, E } = g;
      FIT(b);
      circle(b, O, R, 'ink', 3.4, { fill: 'sky', fa: 0.04 });
      b.path([A, B, Cc, D, E], { close: true, color: 'ink', width: 3.6 });
      line(b, A, Cc, ex || pr || st >= 1 ? 'green' : 'ink', ex || pr || st >= 1 ? 2.8 : 1.4, { dash: ex || pr || st >= 1 ? [6, 5] : [3, 6], alpha: ex || pr || st >= 1 ? 1 : 0 });
      line(b, Cc, E, 'green', 2.8, { dash: [6, 5], alpha: ex || pr || st >= 1 ? 1 : 0 });
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); pname(b, D, O, 'D'); pname(b, E, O, 'E');
      if (!C.txt) return;
      if (pr) {
        const bv = q.kind === 2 ? q.B0 : q.B0, dv = q.D0;
        if (q.kind === 0) { ang(b, B, A, Cc, { color: 'sky', rings: 1, label: dgx(q.B0), r: 26, size: S(b) }); ang(b, D, Cc, E, { color: 'sky', rings: 2, label: dgx(q.D0), r: 26, size: S(b) }); ang(b, Cc, A, E, { color: 'rose', rings: 3, label: 'x', r: 26, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, B, A, Cc, { color: 'sky', rings: 1, label: dgx(q.B0), r: 26, size: S(b) }); ang(b, Cc, A, E, { color: 'sky', rings: 3, label: dgx(g.x), r: 26, size: S(b) }); ang(b, D, Cc, E, { color: 'rose', rings: 2, label: 'x', r: 26, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, D, Cc, E, { color: 'sky', rings: 2, label: dgx(q.D0), r: 26, size: S(b) }); ang(b, Cc, A, E, { color: 'sky', rings: 3, label: dgx(g.x), r: 26, size: S(b) }); ang(b, B, A, Cc, { color: 'rose', rings: 1, label: 'x', r: 26, size: S(b) + 3 }); }
        void bv; void dv;
        return;
      }
      ang(b, B, A, Cc, { color: 'sky', rings: 1, label: dgx(g.B0), r: 26, size: S(b) - 1 }); ang(b, D, Cc, E, { color: 'green', rings: 2, label: dgx(g.D0), r: 26, size: S(b) - 1 });
      if (ex || st >= 3) ang(b, Cc, A, E, { color: 'rose', rings: 3, label: dgx(g.x), r: 26, size: S(b) });
    },
    steps: (M) => {
      const g = M.g;
      return [
        '대각선 AC, CE를 그어요. ∠B는 호 CDEA에 대한 원주각이므로 호 CDEA의 크기는 $2\\angle B$예요.',
        '∠D는 호 EABC에 대한 원주각이므로 호 EABC의 크기는 $2\\angle D$예요.',
        '두 호를 더하면 원 전체(360°)에 호 EA가 한 번 더 들어가요: $2\\angle B+2\\angle D=360^{\\circ}+\\text{호 EA}$.',
        `호 EA에 대한 원주각 $\\angle ACE=\\frac{1}{2}\\text{호 EA}=\\angle B+\\angle D-180^{\\circ}=${fmtN(g.B0)}^{\\circ}+${fmtN(g.D0)}^{\\circ}-180^{\\circ}=${fmtN(g.x)}^{\\circ}$.`
      ];
    },
    view: (M) => ({
      guide: '막대로 <b>∠B</b>와 <b>∠D</b>를 바꿔 보세요. 점선 AC, CE를 그으면 <b>∠ACE = ∠B + ∠D − 180°</b>가 돼요.',
      readouts: [rd('∠B', dgx(M.g.B0), 'sky'), rd('∠D', dgx(M.g.D0), 'green'), rd('∠ACE', dgx(M.g.x), 'rose', '∠B+∠D−180°')],
      status: { tone: 'key', text: '[킬러] 보조선으로 ∠ACE 만들기' },
      rule: '원에 내접하는 오각형 ABCDE에서 $\\angle ACE=\\angle B+\\angle D-180^{\\circ}$',
      notes: notes('오각형의 각은 모두 <b>원주각</b>이에요. 호의 크기를 이용하면 쉬워져요.', '$\\angle ABC+\\angle AEC=180^{\\circ}$(내접사각형 ABCE)로도 풀 수 있어요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g, x = q.B0 + q.D0 - 180;
      let stem, ans, wr, meas, tag;
      const pre = '원에 내접하는 오각형 ABCDE에서';
      if (q.kind === 0) {
        tag = '[킬러] 내접오각형 · ∠ACE'; ans = x; meas = angAt(g.C, g.A, g.E);
        stem = `${pre} $\\angle B=${q.B0}^{\\circ}$, $\\angle D=${q.D0}^{\\circ}$일 때, $\\angle ACE$의 크기 $x$는?`;
        wr = [[q.B0 + q.D0 - 180 + 10, '호의 크기를 이용해 ∠ACE=∠B+∠D−180°예요.'], [180 - q.B0, '∠B+∠D−180°를 써요.'], [360 - q.B0 - q.D0, '∠ACE=∠B+∠D−180°예요.'], [(q.B0 + q.D0) / 2 - 90 + 10, '∠ACE=∠B+∠D−180°예요.'], [q.D0 - 90, '∠ACE=∠B+∠D−180°예요.']];
      } else if (q.kind === 1) {
        tag = '[킬러] 내접오각형 · ∠D'; ans = q.D0; meas = angAt(g.D, g.C, g.E);
        stem = `${pre} $\\angle B=${q.B0}^{\\circ}$, $\\angle ACE=${x}^{\\circ}$일 때, $\\angle D$의 크기 $x$는?`;
        wr = [[q.D0 - 10, '∠D=∠ACE+180°−∠B예요.'], [q.D0 + 10, '∠D=∠ACE+180°−∠B예요.'], [180 - x, '∠ACE=∠B+∠D−180°로 ∠D를 구해요.'], [q.B0, '∠B와 ∠D는 달라요.'], [x + q.B0, '∠D=∠ACE+180°−∠B예요.']];
      } else {
        tag = '[킬러] 내접오각형 · ∠B'; ans = q.B0; meas = angAt(g.B, g.A, g.C);
        stem = `${pre} $\\angle D=${q.D0}^{\\circ}$, $\\angle ACE=${x}^{\\circ}$일 때, $\\angle B$의 크기 $x$는?`;
        wr = [[q.B0 - 10, '∠B=∠ACE+180°−∠D예요.'], [q.B0 + 10, '∠B=∠ACE+180°−∠D예요.'], [180 - x, '∠ACE=∠B+∠D−180°로 ∠B를 구해요.'], [q.D0, '∠B와 ∠D는 달라요.'], [x + q.D0, '∠B=∠ACE+180°−∠D예요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 5. 사각형이 원에 내접하기 위한 조건 */
  const cA = pp(160), cB = pp(50), cC = pp(-35), YD = R * Math.sin(130 * DEG) * 1; // D 의 높이(화면 아래쪽)
  const cD0 = pp(-130);
  const condG = (d) => { const D = pt(d, cD0.y); return { A: cA, B: cB, C: cC, D, d, bd: angAt(D, cC, cA) + angAt(cB, cA, cC), c1: angAt(cB, cA, cC) + angAt(D, cC, cA), c3a: angAt(cB, cA, D) , c3b: angAt(cC, cA, D) }; };
  const conds = (g) => {
    const t = 0.6, B = g.B, A = g.A, C = g.C, D = g.D;
    const sum = angAt(B, A, C) + angAt(D, A, C); // ∠ABC + ∠ADC
    const ext = 180 - angAt(C, B, D); // 외각(변 BC 연장) = ∠DCE
    const a = angAt(A, B, D), c = angAt(C, B, D); // ∠BAD, ∠BCD
    return [
      { k: '∠B+∠D = 180°', ok: Math.abs(sum - 180) < t, v: `${fmtN(angAt(B, A, C))}°+${fmtN(angAt(D, A, C))}°` },
      { k: '외각 ∠DCE = ∠A', ok: Math.abs(ext - a) < t, v: `${fmtN(ext)}° , ${fmtN(a)}°` },
      { k: '∠ABD = ∠ACD', ok: Math.abs(angAt(B, A, D) - angAt(C, A, D)) < t, v: `${fmtN(angAt(B, A, D))}° , ${fmtN(angAt(C, A, D))}°` }
    ];
  };
  const cyc = {
    id: 'c5-5', title: '사각형이 원에 내접하기 위한 조건', short: '내접하기 위한 조건',
    question: '세 점 A, B, C가 한 원 위에 있을 때, 점 D를 가로로 끌면 사각형 ABCD가 원에 내접하는 순간이 있을까? 세 가지 조건이 함께 성립하는지 확인해 보자.',
    ctl: ['c5d'],
    presets: () => [{ group: '맞춰 보기', label: '원 위에 맞추기', apply: (s) => { s.c5d = Math.round(cD0.x * 10) / 10; }, on: () => false }],
    init: (s) => { s.c5d = -1.2; },
    gen(rnd, n) { const kind = n % 3, a = pickR(rnd, [55, 60, 65, 70, 75, 80, 85, 95, 100, 105]); return { kind, a, key: `c${kind}.${a}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk, g = q.kind === 0 ? quadG(80, q.a) : quadG(q.a, 100); g.E = add(g.C, mul(unit(sub(g.C, g.B)), 2.4)); return { q, g }; }
      const d = clamp(s.c5d, -5.6, 2.4), g = condG(d); g.cs = conds(g); return { g };
    },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      if (pr) fit(b, { x0: Math.min(-R, g.E.x - 0.5), x1: Math.max(R, g.E.x + 0.5), y0: Math.min(-R, g.E.y - 0.5), y1: Math.max(R, g.E.y + 0.5) }, { t: 62, b: 44, l: 44, r: 44 }); else FIT(b);
      if (pr) {
        const { A, B, C: Cc, D, E } = g;
        circle(b, O, R, 'ink', 3.4, { fill: 'sky', fa: 0.04, dash: [7, 6], alpha: 0.5 });
        b.path([A, B, Cc, D], { close: true, color: 'ink', width: 3.6 }); line(b, Cc, E, 'ink', 3); dot(b, E, 'ink');
        if (q.kind === 2) { line(b, B, D, 'ink', 2.6); line(b, A, Cc, 'ink', 2.6); }
        pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); pname(b, D, O, 'D'); tagOut(b, E, O, 'E', { size: 17 });
        if (!C.txt) return;
        if (q.kind === 0) { ang(b, B, A, Cc, { color: 'sky', rings: 1, label: dgx(q.a), r: 28, size: S(b) }); ang(b, D, A, Cc, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, Cc, D, E, { color: 'sky', rings: 2, label: dgx(q.a), r: 28, size: S(b) }); ang(b, A, B, D, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, B, A, D, { color: 'sky', rings: 1, label: dgx(angAt(B, A, D)), r: 24, size: S(b) - 1 }); ang(b, Cc, A, D, { color: 'rose', rings: 1, label: 'x', r: 24, size: S(b) + 3 }); }
        return;
      }
      const { A, B, C: Cc, D } = g, all = g.cs.every((c) => c.ok);
      circle(b, O, R, all ? 'green' : 'ink', all ? 3.8 : 2.2, { fill: 'sky', fa: 0.04, dash: all ? undefined : [7, 6], alpha: all ? 1 : 0.5 });
      b.path([A, B, Cc, D], { close: true, color: 'ink', width: 3.6 });
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); dot(b, D, 'amber', 5.6);
      if (ex) b.handle('D', D, { color: 'amber', r: 8, ariaLabel: '점 D를 가로로 끌기', drag: (w) => { s.c5d = clamp(Math.round(w.x * 10) / 10, -5.6, 2.4); } });
      if (!C.txt) return;
      T(b, D, 'D', { dy: 20, size: 17 });
      ang(b, B, A, Cc, { color: 'sky', rings: 1, label: dgx(angAt(B, A, Cc)), r: 26, size: S(b) - 1 });
      ang(b, D, A, Cc, { color: all ? 'sky' : 'rose', rings: 1, label: dgx(angAt(D, A, Cc)), r: 26, size: S(b) - 1 });
    },
    steps: (M) => [
      '사각형이 원에 내접하려면 네 꼭짓점이 모두 한 원 위에 있어야 해요. A, B, C를 지나는 원을 그려요.',
      '점 D가 이 원 위에 있을 때 <b>① 마주 보는 두 각의 합이 180°</b>',
      '<b>② 한 외각의 크기가 이웃한 내각의 대각의 크기와 같다</b>',
      '<b>③ 한 변에 대하여 같은 쪽에 있는 두 각이 같다 (∠ABD=∠ACD)</b>',
      '세 조건은 모두 같은 말이에요. 하나만 성립하면 나머지도 성립해요.'
    ],
    view: (M) => {
      const cs = M.g.cs || [], all = cs.every((c) => c.ok);
      return {
        guide: '노란 점 <b>D를 가로로</b> 끌어 보세요(또는 칩). D가 원 위에 오면 세 조건이 <b>한꺼번에</b> ✓가 돼요.',
        readouts: cs.map((c, i) => rd(`조건 ${'①②③'[i]}`, `${c.ok ? '✓' : '✗'} ${c.k}`, c.ok ? 'green' : 'rose', c.v, null, true)),
        status: all ? { tone: 'ok', text: '세 조건이 모두 성립 → 원에 내접' } : { tone: 'info', text: '조건이 성립하지 않아요 → 원에 내접하지 않아요' },
        rule: '사각형이 원에 내접할 조건: ① 대각의 합 180° ② 외각 = 대각 ③ 한 변에 대한 같은 쪽 두 각이 같다 (셋은 서로 같은 조건)',
        notes: notes('세 조건 중 <b>하나만</b> 확인해도 돼요.', '조건 ③은 두 점이 한 변의 <b>같은 쪽</b>에 있을 때만 쓸 수 있어요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '사각형 ABCD가 원에 내접하도록 하는 값을 구하자.';
      if (q.kind === 0) {
        tag = '내접 조건 · 대각의 합'; ans = 180 - q.a; meas = angAt(g.D, g.C, g.A);
        stem = `${pre} $\\angle B=${q.a}^{\\circ}$일 때 사각형 ABCD가 원에 내접하려면 $\\angle D$의 크기 $x$는?`;
        wr = [[q.a, '대각의 합이 180°가 되어야 해요.'], [360 - q.a, '대각의 합이 180°가 되어야 해요.'], [90 - q.a / 2, '대각의 합이 180°가 되어야 해요.'], [180 - q.a + 10, '대각의 합이 180°가 되어야 해요.'], [90 + q.a / 2, '대각의 합이 180°가 되어야 해요.']];
        return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
      }
      if (q.kind === 1) {
        tag = '내접 조건 · 외각'; ans = q.a; meas = angAt(g.A, g.B, g.D);
        stem = `${pre} 변 BC의 연장선 위의 점 E에 대하여 $\\angle DCE=${q.a}^{\\circ}$일 때, 사각형 ABCD가 원에 내접하려면 $\\angle A$의 크기 $x$는?`;
        wr = [[180 - q.a, '외각은 이웃한 내각의 대각과 같아야 해요.'], [q.a / 2, '외각은 대각과 같아야 해요.'], [90 - q.a / 2, '외각은 대각과 같아야 해요.'], [q.a + 10, '외각은 대각과 같아야 해요.'], [q.a - 10, '외각은 대각과 같아야 해요.']];
        return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
      }
      tag = '내접 조건 · 같은 호의 원주각'; ans = Math.round(angAt(g.C, g.A, g.D)); meas = angAt(g.C, g.A, g.D);
      const given = Math.round(angAt(g.B, g.A, g.D));
      stem = `${pre} 선분 AD에 대하여 B, C가 같은 쪽에 있고 $\\angle ABD=${given}^{\\circ}$일 때, 사각형 ABCD가 원에 내접하려면 $\\angle ACD$의 크기 $x$는?`;
      wr = [[180 - given, '같은 쪽의 두 각이 같아야 해요.'], [given / 2, '같은 쪽의 두 각이 같아야 해요.'], [90 - given / 2, '같은 쪽의 두 각이 같아야 해요.'], [given + 10, '같은 쪽의 두 각이 같아야 해요.'], [given - 10, '같은 쪽의 두 각이 같아야 해요.']];
      return { tag, key, stem, choices: mkDeg(given, wr), chk: [meas, given] };
    }
  };


  /* ====================================================================== 6. [함정] 항상 원에 내접하는 사각형 */
  const trapG = (ty, th) => {
    let A, B, C, D;
    const rad = th * DEG;
    if (ty === 0) { A = pt(-4, -2.5); B = pt(-4, 2.5); C = pt(4, 2.5); D = pt(4, -2.5); }
    else if (ty === 1) { A = pt(-3, -3); B = pt(-3, 3); C = pt(3, 3); D = pt(3, -3); }
    else if (ty === 2) { const h = 4, top = 4, bot = top + 2 * h / Math.tan(rad); A = pt(-top / 2, -h / 2); D = pt(top / 2, -h / 2); B = pt(-bot / 2, h / 2); C = pt(bot / 2, h / 2); }
    else if (ty === 3 || ty === 4) {
      const base = ty === 3 ? 7 : 5, side = 5, dx = side * Math.cos(rad), h = side * Math.sin(rad);
      B = pt(-base / 2 - dx / 2, h / 2); C = pt(base / 2 - dx / 2, h / 2); A = pt(B.x + dx, -h / 2); D = pt(C.x + dx, -h / 2);
    } else { const h = 4, r2 = (th + 15) * DEG; B = pt(-4, h / 2); C = pt(4, h / 2); A = pt(-4 + h / Math.tan(rad), -h / 2); D = pt(4 - h / Math.tan(r2), -h / 2); }
    const pts = [A, B, C, D], cx = pts.reduce((a, p) => a + p.x, 0) / 4, cy = pts.reduce((a, p) => a + p.y, 0) / 4;
    const mv = (p) => pt(p.x - cx, p.y - cy); A = mv(A); B = mv(B); C = mv(C); D = mv(D);
    // A,B,C 를 지나는 원
    const dd = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
    const ux = ((A.x ** 2 + A.y ** 2) * (B.y - C.y) + (B.x ** 2 + B.y ** 2) * (C.y - A.y) + (C.x ** 2 + C.y ** 2) * (A.y - B.y)) / dd;
    const uy = ((A.x ** 2 + A.y ** 2) * (C.x - B.x) + (B.x ** 2 + B.y ** 2) * (A.x - C.x) + (C.x ** 2 + C.y ** 2) * (B.x - A.x)) / dd;
    const c = pt(ux, uy), r = dist(c, A), cyc = Math.abs(dist(c, D) - r) < 1e-6;
    const a = Math.round(angAt(A, B, D)), b2 = Math.round(angAt(B, A, C)), c2 = Math.round(angAt(C, B, D)), d2 = Math.round(angAt(D, A, C));
    return { ty, th, A, B, C, D, c, r, cyc, a, b: b2, cc: c2, d: d2, angleRings: angleRings([a, b2, c2, d2]), name: TYN[ty] };
  };
  const trap = {
    id: 'c5-6', title: '[함정] 항상 원에 내접하는 사각형은?', short: '[함정] 내접하는 사각형',
    question: '직사각형·정사각형·등변사다리꼴·평행사변형·마름모 중 항상 원에 내접하는 사각형은 무엇일까? 마주 보는 두 각의 합을 확인해 보자.',
    ctl: ['c5ty', 'c5th'],
    init: (s) => { s.c5ty = 2; s.c5th = 65; },
    gen(rnd, n) { const kind = n % 3, ty = kind === 0 ? pickR(rnd, [0, 1, 2]) : kind === 1 ? pickR(rnd, [3, 4]) : 5, th = pickR(rnd, [55, 60, 65, 70, 75, 80]); return { kind, ty, th, key: `t${ty}.${th}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: trapG(q.ty, q.th) }; } return { g: trapG(clamp(Math.round(s.c5ty), 0, 5), clamp(Math.round(s.c5th / 5) * 5, 55, 80)) }; },
    draw(b, s, M, C) {
      const { g } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D, c, r, ty } = g;
      const bb = bboxOf([A, B, Cc, D, pt(c.x - r, c.y - r), pt(c.x + r, c.y + r)], 0.3);
      fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 }, { t: 62, b: 44, l: 44, r: 44 });
      const showCirc = pr ? false : (ex || st >= 3);
      if (showCirc) circle(b, c, r, g.cyc ? 'green' : 'ink', g.cyc ? 3.4 : 2.4, { fill: g.cyc ? 'green' : 'sky', fa: 0.05, dash: g.cyc ? undefined : [7, 6], alpha: g.cyc ? 1 : 0.6 });
      b.path([A, B, Cc, D], { close: true, color: 'ink', width: 3.6, fill: 'sky', fillAlpha: 0.1 });
      // 같은 변·평행 표시
      if (ty === 1 || ty === 4) { tick(b, A, B, 1, 'amber'); tick(b, B, Cc, 1, 'amber'); tick(b, Cc, D, 1, 'amber'); tick(b, D, A, 1, 'amber'); }
      if (ty === 0 || ty === 3) { tick(b, A, B, 1, 'amber'); tick(b, Cc, D, 1, 'amber'); tick(b, B, Cc, 2, 'amber'); tick(b, D, A, 2, 'amber'); }
      if (ty === 2) { tick(b, A, B, 1, 'amber'); tick(b, Cc, D, 1, 'amber'); }
      G.par(b, D, A, 1, 'rose', 0.5); G.par(b, B, Cc, 1, 'rose', 0.5);
      if (ty <= 4 && ty !== 2) { G.par(b, A, B, 2, 'rose', 0.5); G.par(b, Cc, D, 2, 'rose', 0.5); }
      const cen = pt((A.x + B.x + Cc.x + D.x) / 4, (A.y + B.y + Cc.y + D.y) / 4);
      pname(b, A, cen, 'A'); pname(b, B, cen, 'B'); pname(b, Cc, cen, 'C'); pname(b, D, cen, 'D');
      if (!C.txt) return;
      const sa = S(b) - 1, show1 = pr || ex || st >= 0, show2 = pr || ex || st >= 1;
      if (show1) { ang(b, A, B, D, { color: 'rose', rings: g.angleRings[0], label: dgx(g.a), r: 26, size: sa }); ang(b, Cc, B, D, { color: 'rose', rings: g.angleRings[2], label: dgx(g.cc), r: 26, size: sa }); }
      if (show2) { ang(b, B, A, Cc, { color: 'sky', rings: g.angleRings[1], label: dgx(g.b), r: 26, size: sa }); ang(b, D, A, Cc, { color: 'sky', rings: g.angleRings[3], label: dgx(g.d), r: 26, size: sa }); }
    },
    steps: (M) => { const g = M.g; return [
      `마주 보는 두 각 ∠A와 ∠C의 합: $${g.a}^{\\circ}+${g.cc}^{\\circ}=${g.a + g.cc}^{\\circ}$.`,
      `마주 보는 다른 두 각 ∠B와 ∠D의 합: $${g.b}^{\\circ}+${g.d}^{\\circ}=${g.b + g.d}^{\\circ}$.`,
      g.cyc ? '두 쌍의 대각의 합이 모두 $180^{\\circ}$이므로 이 사각형은 원에 내접해요.' : '대각의 합이 $180^{\\circ}$가 아니므로 이 사각형은 원에 내접하지 않아요.',
      '직사각형·정사각형·등변사다리꼴은 대각의 합이 항상 $180^{\\circ}$라서 원에 내접해요. 일반적인 평행사변형은 직사각형일 때, 마름모는 정사각형일 때만 원에 내접해요.'
    ]; },
    view: (M) => { const g = M.g; return {
      guide: '막대로 <b>사각형의 종류</b>와 <b>각도</b>를 바꿔 보세요. 마주 보는 두 각의 합이 <b>180°</b>이면 원(초록 실선)이 네 꼭짓점을 지나고, 아니면 점선 원이 점 D를 지나가지 못해요.',
      readouts: [rd('종류', g.name, 'amber'), rd('∠A + ∠C', dgx(g.a + g.cc), 'rose', g.a + g.cc === 180 ? '= 180°' : '≠ 180°'), rd('∠B + ∠D', dgx(g.b + g.d), 'sky', g.b + g.d === 180 ? '= 180°' : '≠ 180°'), rd('판정', g.cyc ? '원에 내접해요' : '내접하지 않아요', g.cyc ? 'green' : 'rose')],
      status: { tone: g.cyc ? 'ok' : 'key', text: '[함정] ' + (g.cyc ? '항상 내접: 직사각형·정사각형·등변사다리꼴' : '내접하지 않는 사각형이에요') },
      rule: '사각형이 원에 내접하려면 마주 보는 두 각의 합이 $180^{\\circ}$이어야 한다',
      notes: notes('평행사변형은 <b>이웃한</b> 두 각의 합이 180°일 뿐, 마주 보는 두 각의 합은 180°가 아니에요(직사각형만 예외).', '마름모는 네 변이 같아도 원에 내접하지 않아요(정사각형만 예외).')
    }; },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g, cyc = q.ty <= 2;
      const meas = (Math.abs(dist(g.c, g.D) - g.r) < 1e-6 ? 1 : 0), ans = cyc ? 1 : 0;
      const pre = '그림과 같은 사각형 ABCD의 각의 크기가 표시되어 있다. 이 사각형에 대한 설명으로 옳은 것은?';
      const a = g.a, cc = g.cc;
      const t1 = `∠A + ∠C = ${a}° + ${cc}° = ${a + cc}°이므로 원에 내접한다.`, t2 = `∠A + ∠C = ${a}° + ${cc}° = ${a + cc}°이므로 원에 내접하지 않는다.`;
      const items = [
        { h: cyc ? t1 : t2, ok: true, hint: '' },
        { h: cyc ? `∠A + ∠C = ${a}° + ${cc}°이지만 원에 내접하지 않는다.` : `∠A + ∠C = ${a}° + ${cc}°이므로 원에 내접한다.`, ok: false, hint: cyc ? '마주 보는 두 각의 합이 180°이면 내접해요.' : '마주 보는 두 각의 합이 180°가 아니면 내접하지 않아요.' },
        { h: '이웃한 두 각 ∠A, ∠B의 합이 180°이면 원에 내접한다.', ok: false, hint: '이웃한 각이 아니라 마주 보는 두 각의 합이 180°여야 해요.' }
      ];
      const pool = [{ h: '네 변의 길이가 모두 같으면 항상 원에 내접한다.', hint: '마름모는 네 변이 같아도 내접하지 않아요.' }, { h: '대각선이 서로 수직으로 만나면 항상 원에 내접한다.', hint: '마름모는 대각선이 수직이어도 내접하지 않아요.' }, { h: '한 쌍의 대변이 평행하면 항상 원에 내접한다.', hint: '평행사변형은 대변이 평행해도 내접하지 않아요.' }];
      const sk = Math.round(q.th / 5) % 3;
      [pool[sk], pool[(sk + 1) % 3]].forEach((x) => items.push({ h: x.h, ok: false, hint: x.hint }));
      return { tag: '[함정] 항상 원에 내접하는 사각형은?', key, stem: pre, choices: G.mkTextChoices(items, key), chk: [meas, ans] };
    }
  };

  G.register(50, 'c5', '내접사각형', '내접사각형', PARAMS, [opp, ext, cross, pent, cyc, trap]);
})();
