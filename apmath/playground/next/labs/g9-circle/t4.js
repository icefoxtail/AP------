/* ==========================================================================
   중3 · 원의 성질 — 탭 ④ 「원주각」 (t4.js, order 40) — 장면 8개
   · c4-1 원주각과 중심각             · ∠APB = ½∠AOB (지름 PQ 보조선, 세 가지 경우) · 호 위의 점 P는 막대로
   · c4-2 한 호에 대한 원주각은 같다  · 같은 호의 원주각은 모두 같고 반대쪽 호의 원주각은 180°−
   · c4-3 호의 길이와 원주각          · 호 CD=k·호 AB이면 원주각도 k배 · 현의 길이는 k배가 아니에요
   · c4-4 반원에 대한 원주각 90°      · 지름 AB, 점 P가 반원 위를 움직여도 ∠APB=90°
   · c4-5 원주각과 삼각비             · 지름 보조선으로 BC = 2R·sin A
   · c4-6 지름과 평행한 현            · AB∥CD이면 호 AC = 호 DB, 호의 길이는 중심각에 비례
   · c4-7 네 점이 한 원 위에 있을 조건 · ∠BAC=∠BDC이면 A, B, C, D는 한 원 위 · 점 D를 가로로 끌기
   · c4-8 외심과 원주각               · ∠BOC=2∠A, ∠OBC=90°−∠A
   값은 모두 지금의 각·호의 크기로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, lerp, mp, T, tick, line, fit, P, rd, notes, fmtN, circle, arcD, dot, pname, segTag, tagOut, ang, cv, nt, ntD, mkNum, mkPi, sz, fillPoly, mkChoices, degOf, norm360, inter } = G;
  const lenF = (v) => fmtN(v), degF = G.degF, dgx = (v) => fmtN(v) + '°';
  const pickR = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
  const S = (b, a = 16) => sz(b, a);
  const O = pt(0, 0), R = 6;
  const FIT = (b, o = {}) => fit(b, { x0: -R, x1: R, y0: -R, y1: R }, { t: 62, b: 44, l: 44, r: 44, ...o });
  const A3 = (rnd, arr) => pickR(rnd, arr);
  const ok180 = (v) => v > 0 && v < 180 && Math.abs(v - Math.round(v)) < 1e-9;
  const mkDeg = (ans, wr, pad = 5) => mkChoices(ans, wr, { pad, valid: ok180 });
  const pp = (deg) => mp(O, R, deg);
  // 호 d0 → d1 (반시계 방향) 두껍게
  const arcB = (b, d0, d1, col = 'rose', w = 6) => { const a = norm360(d0); let e = norm360(d1); if (e <= a) e += 360; arcD(b, O, R, a, e, col, w); };
  const arcBetween = (b, from, to, col = 'rose', w = 6) => arcB(b, degOf(O, from), degOf(O, to), col, w);

  const PARAMS = {
    c4t: P('호 AB의 크기 (∠AOB)', 40, 120, 10, 100, { color: 'sky', format: degF }),
    c4u: P('점 P의 위치', 45, 275, 5, 200, { color: 'amber', hint: '호 위에서 점 P를 움직여요', format: (v) => Math.round(v) + '°' }),
    c4a: P('호 AB의 크기', 20, 60, 2, 40, { color: 'sky', format: degF }),
    c4k: P('호 CD = k × 호 AB', 1, 3, 1, 2, { color: 'rose', format: (v) => (v === 1 ? '1배 (같다)' : fmtN(v) + '배') }),
    c4p: P('점 P의 위치', 15, 165, 5, 70, { color: 'amber', hint: '반원 위에서 점 P를 움직여요', format: (v) => Math.round(v) + '°' }),
    c4A: P('∠A의 크기', 20, 80, 5, 40, { color: 'sky', format: degF }),
    c4R: P('반지름 R', 3, 8, 1, 5, { color: 'amber', format: lenF }),
    c4h: P('∠ADC의 크기', 10, 40, 2, 20, { color: 'sky', format: degF }),
    c4d: P('점 D의 가로 위치', -5.6, 5.6, 0.1, 2.2, { color: 'amber', hint: '노란 점 D를 가로로 끌어도 돼요', format: (v) => fmtN(v) }),
    c4s: P('∠A의 크기', 30, 75, 5, 50, { color: 'sky', format: degF })
  };

  /* ====================================================================== 1. 원주각과 중심각 */
  const casesOf = (th, u) => (Math.abs(u - 180) < 0.51 || Math.abs(u - (180 - th)) < 0.51 ? 'side' : u > 180 - th && u < 180 ? 'in' : 'out');
  const abpG = (th, u) => { const A = pp(90 + th / 2), B = pp(90 - th / 2), Pp = pp(90 - th / 2 - u), Q = pp(90 - th / 2 - u + 180); return { A, B, P: Pp, Q, th, u, cs: casesOf(th, u) }; };
  const c1 = {
    id: 'c4-1', title: '원주각과 중심각', short: '원주각과 중심각',
    question: '호 AB에 대한 원주각 ∠APB는 중심각 ∠AOB와 어떤 관계일까? 점 P를 호 위에서 움직이면 중심 O가 각의 안쪽, 한 변 위, 바깥에 놓이는 세 경우가 나와. 모두 같은 관계일까?',
    ctl: ['c4t', 'c4u'],
    presets: () => [['in', 'O가 ∠APB의 안쪽'], ['side', 'O가 한 변 위(PB가 지름)'], ['out', 'O가 바깥']].map(([id, label], i) => ({ group: i === 0 ? '세 가지 경우' : '', label, apply: (s) => { const th = s.c4t; s.c4u = id === 'in' ? 180 - th / 2 : id === 'side' ? 180 : (180 - th) / 2; s.c4u = clamp(Math.round(s.c4u / 5) * 5, 45, 315 - th); }, on: (s) => casesOf(s.c4t, s.c4u) === id })),
    init: (s) => { s.c4t = 100; s.c4u = 200; },
    gen(rnd, n) { const kind = n % 3, th = pickR(rnd, [60, 70, 80, 100, 110, 120]), hi = 315 - th, u0 = pickR(rnd, [60, 100, 130, 180, Math.round((180 + hi) / 10) * 5]), u = clamp(u0, 55, hi); return { kind, th, u, key: `a${kind}.${th}.${u}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: abpG(q.th, q.u) }; } const th = clamp(s.c4t, 40, 120), u = clamp(s.c4u, 45, 315 - th); return { g: abpG(th, u) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, P: Pp, Q } = g;
      FIT(b);
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      arcBetween(b, B, A, 'sky', 4.6);
      line(b, Pp, A, 'ink', 3.2); line(b, Pp, B, 'ink', 3.2); line(b, O, A, 'ink', 2.6); line(b, O, B, 'ink', 2.6); line(b, A, B, 'ink', 2.6);
      if (!pr && (ex ? false : st >= 1)) { line(b, Pp, Q, 'green', 2.6, { dash: [6, 5] }); dot(b, Q, 'green', 4.4); }
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Pp, O, 'P'); dot(b, O, 'ink', 4.4);
      if (!C.txt) return;
      T(b, O, 'O', { dx: 12, dy: 13, size: 16 });
      if (!pr && st >= 1 && !ex) tagOut(b, Q, O, 'Q', { size: 16, color: 'green' });
      const ao = 180 - g.th / 2 * 0 ;
      void ao;
      const rA = 24, rO = 30;
      if (pr) {
        const a = (q.kind === 0 || q.kind === 2) ? { v: q.th, kind: 'O' } : { v: q.th / 2, kind: 'P' };
        if (q.kind === 0) { ang(b, O, A, B, { color: 'sky', rings: 2, label: dgx(q.th), r: rO, size: S(b) }); ang(b, Pp, A, B, { color: 'rose', rings: 1, label: 'x', r: rA, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, Pp, A, B, { color: 'sky', rings: 1, label: dgx(q.th / 2), r: rA, size: S(b) }); ang(b, O, A, B, { color: 'rose', rings: 2, label: 'x', r: rO, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, Pp, A, B, { color: 'sky', rings: 1, label: dgx(q.th / 2), r: rA, size: S(b) }); ang(b, A, O, B, { color: 'rose', rings: 3, label: 'x', r: 26, size: S(b) + 3 }); }
        void a;
        return;
      }
      ang(b, Pp, A, B, { color: 'rose', rings: 1, label: dgx(g.th / 2), r: rA, size: S(b) });
      ang(b, O, A, B, { color: 'sky', rings: 2, label: dgx(g.th), r: rO, size: S(b) });
    },
    steps: (M) => {
      const g = M.g, cs = g.cs;
      return [
        `점 P에서 지름 $\\overline{PQ}$를 그어요. ${cs === 'in' ? '중심 O가 ∠APB의 안쪽에 있는 경우예요.' : cs === 'side' ? '이 경우 PA 또는 PB가 지름이라서 Q가 A 또는 B와 같아요.' : '중심 O가 ∠APB의 바깥에 있는 경우예요.'}`,
        '삼각형 OPA는 $\\overline{OP}=\\overline{OA}$(반지름)인 이등변삼각형이에요. $\\angle OPA=\\angle OAP$이고 외각의 성질로 $\\angle AOQ=2\\angle APQ$.',
        '삼각형 OPB도 마찬가지로 $\\angle BOQ=2\\angle BPQ$.',
        cs === 'out' ? '두 각의 큰 쪽에서 작은 쪽을 빼면 $\\angle AOB=2\\lvert\\angle APQ-\\angle BPQ\\rvert=2\\angle APB$.' : cs === 'side' ? '한 변이 지름이면 다른 이등변삼각형의 외각 관계만 사용해 $\\angle AOB=2\\angle APB$를 얻어요.' : '두 식을 더하면 $\\angle AOB=\\angle AOQ+\\angle BOQ=2(\\angle APQ+\\angle BPQ)=2\\angle APB$.',
        `따라서 $\\angle APB=\\frac{1}{2}\\angle AOB=\\frac{1}{2}\\times ${fmtN(g.th)}^{\\circ}=${fmtN(g.th / 2)}^{\\circ}$.`
      ];
    },
    view: (M) => {
      const g = M.g, cs = g.cs;
      return {
        guide: '막대로 <b>호 AB의 크기</b>와 <b>점 P의 위치</b>를 바꿔 보세요. P가 어디에 있어도 <b>∠APB는 ∠AOB의 절반</b>이에요. 칩으로 O의 세 가지 위치를 확인해 보세요.',
        readouts: [rd('∠AOB (중심각)', dgx(g.th), 'sky'), rd('∠APB (원주각)', dgx(g.th / 2), 'rose', '중심각의 절반'), rd('O의 위치', cs === 'in' ? '∠APB의 안쪽' : cs === 'side' ? '한 변 위' : '∠APB의 바깥', 'green')],
        status: { tone: 'key', text: `∠APB = ∠AOB ÷ 2 = ${fmtN(g.th / 2)}°` },
        rule: '한 호에 대한 원주각의 크기는 그 호에 대한 중심각의 크기의 $\\frac{1}{2}$이다',
        notes: notes('중심 O가 각의 <b>안쪽·변 위·바깥</b> 어디에 있어도 결과는 같아요. 지름 PQ를 그어 이등변삼각형의 외각으로 설명해요.', '원주각이 90°가 되려면 중심각이 180°(반원)여야 해요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), th = q.th, g = M.g;
      let stem, ans, wr, meas, tag;
      const ang0 = (Math.abs(degOf(O, g.A) - degOf(O, g.B)) + 360) % 360;
      const pre = '그림과 같이 원 O 위의 세 점 A, B, P에 대하여';
      if (q.kind === 0) {
        tag = '원주각과 중심각 · ∠APB'; ans = th / 2; meas = (() => { const u = sub(g.A, g.P), v = sub(g.B, g.P); return Math.acos((u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y))) / DEG; })();
        stem = `${pre} $\\angle AOB=${th}^{\\circ}$일 때, $\\angle APB$의 크기 $x$는?`;
        wr = [[th, '원주각은 중심각의 절반이에요.'], [th * 2, '원주각은 중심각의 절반이에요.'], [180 - th / 2, '이것은 반대쪽 호에 대한 원주각이에요.'], [90 - th / 2, '∠OAB예요. ∠APB는 중심각의 절반이에요.'], [th / 2 + 10, '원주각은 중심각의 절반이에요.']];
      } else if (q.kind === 1) {
        tag = '원주각과 중심각 · ∠AOB'; ans = th; meas = Math.acos(((g.A.x - O.x) * (g.B.x - O.x) + (g.A.y - O.y) * (g.B.y - O.y)) / (R * R)) / DEG;
        stem = `${pre} $\\angle APB=${th / 2}^{\\circ}$일 때, $\\angle AOB$의 크기 $x$는?`;
        wr = [[th / 2, '중심각은 원주각의 2배예요.'], [th * 2, '중심각은 원주각의 2배예요.'], [180 - th, '중심각=원주각×2예요.'], [th + 10, '중심각=원주각×2예요.'], [90 - th / 2, '중심각=원주각×2예요.']];
      } else {
        tag = '원주각과 중심각 · ∠OAB'; ans = 90 - th / 2; meas = Math.acos(((g.B.x - g.A.x) * (O.x - g.A.x) + (g.B.y - g.A.y) * (O.y - g.A.y)) / (dist(g.A, g.B) * R)) / DEG;
        stem = `${pre} $\\angle APB=${th / 2}^{\\circ}$일 때, $\\angle OAB$의 크기 $x$는?`;
        wr = [[th / 2, '∠AOB=2∠APB를 구한 뒤 이등변삼각형 OAB의 밑각을 구해요.'], [th, '이것은 ∠AOB예요.'], [180 - th, '삼각형 OAB는 이등변삼각형이에요.'], [90 - th, '밑각=(180°−∠AOB)÷2예요.'], [(180 - th) / 2 + 10, '밑각=(180°−∠AOB)÷2예요.']];
      }
      void ang0;
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 2. 한 호에 대한 원주각은 모두 같다 */
  const eqG = (th, u) => { const A = pp(90 + th / 2), B = pp(90 - th / 2), L = 360 - th, u2 = u < L / 2 ? u + L * 0.35 : u - L * 0.35; return { A, B, P: pp(90 - th / 2 - u), Q: pp(90 - th / 2 - u2), Rr: pp(90), th }; };
  const eqs2 = {
    id: 'c4-2', title: '한 호에 대한 원주각은 모두 같다', short: '원주각은 모두 같다',
    question: '호 AB 위가 아닌 원 위의 점 P를 움직여도 ∠APB는 변할까? 반대쪽 호 위의 점 R에서 본 ∠ARB는 어떻게 다를까?',
    ctl: ['c4t', 'c4u'],
    init: (s) => { s.c4t = 100; s.c4u = 150; },
    gen(rnd, n) { const kind = n % 3, th = pickR(rnd, [60, 70, 80, 100, 110, 120, 140]), u = pickR(rnd, [60, 110, 160, 210]); return { kind, th, u: Math.min(u, 330 - th), key: `e${kind}.${th}.${u}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: eqG(q.th, q.u) }; } const th = clamp(s.c4t, 40, 160), u = clamp(s.c4u, 20, 340 - th); return { g: eqG(th, u) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, P: Pp, Q, Rr } = g;
      FIT(b);
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      arcBetween(b, B, A, 'sky', 4.6);
      const showQ = pr ? true : (ex || st >= 1), showR = pr ? q.kind === 1 : (ex || st >= 2), showO = pr ? q.kind === 2 : false;
      line(b, Pp, A, 'ink', 3.2); line(b, Pp, B, 'ink', 3.2);
      if (showQ) { line(b, Q, A, 'ink', 2.8); line(b, Q, B, 'ink', 2.8); }
      if (showR) { line(b, Rr, A, 'ink', 2.8, { alpha: 0.9 }); line(b, Rr, B, 'ink', 2.8, { alpha: 0.9 }); }
      if (showO) { line(b, O, A, 'ink', 2.6); line(b, O, B, 'ink', 2.6); }
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Pp, O, 'P'); if (showQ) pname(b, Q, O, 'Q'); if (showR) pname(b, Rr, O, 'R'); if (showO) dot(b, O, 'ink', 4.4);
      if (!C.txt) return;
      if (showO) T(b, O, 'O', { dx: 12, dy: 13, size: 16 });
      if (pr) {
        if (q.kind === 0) { ang(b, Pp, A, B, { color: 'sky', rings: 1, label: dgx(q.th / 2), r: 22, size: S(b) }); ang(b, Q, A, B, { color: 'rose', rings: 1, label: 'x', r: 24, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, Pp, A, B, { color: 'sky', rings: 1, label: dgx(q.th / 2), r: 22, size: S(b) }); ang(b, Rr, A, B, { color: 'rose', rings: 2, label: 'x', r: 24, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, O, A, B, { color: 'sky', rings: 2, label: dgx(q.th), r: 28, size: S(b) }); ang(b, Pp, A, B, { color: 'rose', rings: 1, label: 'x', r: 22, size: S(b) + 3 }); ang(b, Q, A, B, { color: 'rose', rings: 1, r: 24, noMark: false }); }
        return;
      }
      ang(b, Pp, A, B, { color: 'rose', rings: 1, label: dgx(g.th / 2), r: 22, size: S(b) });
      if (showQ) ang(b, Q, A, B, { color: 'rose', rings: 1, label: dgx(g.th / 2), r: 24, size: S(b) });
      if (showR) ang(b, Rr, A, B, { color: 'green', rings: 3, label: dgx(180 - g.th / 2), r: 26, size: S(b) });
    },
    steps: (M) => [
      `호 AB의 중심각을 ${fmtN(M.g.th)}°라 하면 이 호(아래쪽 호가 아닌 호 AB)에 대한 원주각은 모두 $\\frac{1}{2}\\times ${fmtN(M.g.th)}^{\\circ}=${fmtN(M.g.th / 2)}^{\\circ}$예요.`,
      '그래서 호 AB에 대한 원주각 ∠APB, ∠AQB는 점이 어디에 있든 같은 크기(같은 호 표시)예요.',
      `반대쪽 호 위의 점 R에서 보면 큰 호에 대한 원주각이 되어 $\\angle ARB=\\frac{1}{2}(360^{\\circ}-${fmtN(M.g.th)}^{\\circ})=${fmtN(180 - M.g.th / 2)}^{\\circ}$. (∠APB+∠ARB=180°)`
    ],
    view: (M) => ({
      guide: '막대로 <b>점 P의 위치</b>를 움직여 보세요. P, Q 어디에서 봐도 <b>∠APB=∠AQB</b>예요. 하지만 반대쪽 호의 점 R에서 보면 <b>180°−∠APB</b>로 달라요.',
      readouts: [rd('∠APB', dgx(M.g.th / 2), 'rose'), rd('∠AQB', dgx(M.g.th / 2), 'rose', '같은 호 → 같아요'), rd('∠ARB', dgx(180 - M.g.th / 2), 'green', '반대쪽 호 → 180°−')],
      rule: '한 호에 대한 원주각의 크기는 모두 같다',
      notes: notes('같은 호에 대한 원주각만 같아요. 점이 <b>반대쪽 호</b>에 있으면 크기가 달라져요(합이 180°).')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), th = q.th, g = M.g;
      let stem, ans, wr, meas, tag;
      const aOf = (V) => angAt(V, g.A, g.B);
      const pre = '원 위의 네 점 A, B, P, Q에 대하여';
      if (q.kind === 0) {
        tag = '같은 호의 원주각 · ∠AQB'; ans = th / 2; meas = aOf(g.Q);
        stem = `${pre} 점 P, Q가 호 AB의 같은 쪽에 있고 $\\angle APB=${th / 2}^{\\circ}$일 때, $\\angle AQB$의 크기 $x$는?`;
        wr = [[th, '이것은 중심각이에요. 같은 호의 원주각은 같아요.'], [th / 2 * 2 - 10, '같은 호의 원주각은 같아요.'], [180 - th / 2, '이것은 반대쪽 호에 대한 원주각이에요.'], [th / 4 + 5, '같은 호의 원주각은 모두 같아요.'], [90 - th / 2, '같은 호의 원주각은 모두 같아요.']];
      } else if (q.kind === 1) {
        tag = '반대쪽 호의 원주각 · ∠ARB'; ans = 180 - th / 2; meas = aOf(g.Rr);
        stem = `원 위의 세 점 A, B, P와 반대쪽 호 위의 점 R에 대하여 $\\angle APB=${th / 2}^{\\circ}$일 때, $\\angle ARB$의 크기 $x$는? (단, P와 R은 호 AB의 서로 반대쪽에 있다.)`;
        wr = [[th / 2, '반대쪽 호에서는 크기가 달라요. 합이 180°예요.'], [th, '이것은 중심각이에요.'], [360 - th, '합이 180°예요.'], [90 + th / 2, '∠APB+∠ARB=180°를 써요.'], [180 - th, '∠APB+∠ARB=180°를 써요.']];
      } else {
        tag = '원주각과 같은 호 · ∠APB'; ans = th / 2; meas = aOf(g.P);
        stem = `원 O 위의 점 P, Q와 호 AB에 대하여 $\\angle AOB=${th}^{\\circ}$이다. P, Q가 호 AB의 같은 쪽에 있을 때, $\\angle APB$의 크기 $x$는? ($\\angle AQB$와 같다.)`;
        wr = [[th, '원주각은 중심각의 절반이에요.'], [th * 2, '원주각은 중심각의 절반이에요.'], [180 - th / 2, '이것은 반대쪽 호에 대한 원주각이에요.'], [90 - th / 2, '원주각은 중심각의 절반이에요.'], [th / 2 + 10, '원주각은 중심각의 절반이에요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 3. 호의 길이와 원주각 */
  // 시계 방향으로 A, B, C, D 놓기. 호 AB=a, 호 BC=70, 호 CD=k·a, 나머지 DA.
  const arcG = (a, k, gam = 70) => {
    const aA = 150, aB = aA - a, aC = aB - gam, aD = aC - k * a, A = pp(aA), B = pp(aB), C = pp(aC), D = pp(aD), Pp = inter(A, C, B, D);
    return { a, k, gam, A, B, C, D, P: Pp, aA, aB, aC, aD, rest: 360 - a - gam - k * a };
  };
  const arcs = {
    id: 'c4-3', title: '호의 길이와 원주각의 크기', short: '호와 원주각의 비',
    question: '한 원에서 호 CD의 크기가 호 AB의 k배이면 원주각 ∠CAD는 ∠ADB의 몇 배일까? 현의 길이 CD도 AB의 k배일까?',
    ctl: ['c4a', 'c4k'],
    init: (s) => { s.c4a = 40; s.c4k = 2; },
    gen(rnd, n) { const kind = n % 3, k = pickR(rnd, [1, 2, 2, 3]), th = pickR(rnd, [18, 20, 24, 26, 30, 32, 34].filter((t) => t * (1 + k) <= 124)); return { kind, k, th, key: `p${kind}.${k}.${th}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: arcG(2 * q.th, q.k) }; } return { g: arcG(clamp(s.c4a, 20, 60), clamp(Math.round(s.c4k), 1, 3)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D, P: Pp } = g;
      if (pr) FIT(b, { b: 92 }); else FIT(b);
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      arcB(b, g.aB, g.aA, 'sky', 6); arcB(b, g.aD, g.aC, g.k === 1 && !pr ? 'sky' : 'rose', 6);
      line(b, A, Cc, 'ink', 3); line(b, B, D, 'ink', 3);
      if (pr || st >= 3 || ex) { b.path([A, B, Cc, D], { close: true, color: 'ink', width: 2.2, alpha: 0.7 }); }
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); pname(b, D, O, 'D'); dot(b, Pp, 'ink', 4);
      if (!C.txt) return;
      { const X = pr && q.kind === 0 ? D : B, d1 = unit(sub(A, Pp)), d2 = unit(sub(X, Pp)), dr = unit(add(d1, d2)); T(b, Pp, 'P', { dx: -dr.x * 17, dy: -dr.y * 17, size: 16 }); }
      const th = g.a / 2, kth = g.k * g.a / 2, rk = g.k === 1 ? 1 : 2;
      if (pr) {
        // 호 AB 에 대한 원주각 ∠ADB, 호 CD 에 대한 원주각 ∠CAD / ∠CBD
        if (q.kind === 0) { ang(b, D, A, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 26, size: S(b) }); ang(b, Pp, A, D, { color: 'rose', rings: 3, label: 'x', r: 24, size: S(b) + 3 }); T(b, mp(O, R, 270), `호 CD = ${q.k === 1 ? '호 AB' : q.k + '×호 AB'}`, { dy: 50, size: S(b), color: 'rose', noBig: true }); }
        if (q.kind === 1) { ang(b, D, A, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 26, size: S(b) }); ang(b, A, Cc, D, { color: 'rose', rings: 2, label: 'x', r: 28, size: S(b) + 3 }); T(b, mp(O, R, 270), `호 CD = ${q.k === 1 ? '호 AB' : q.k + '×호 AB'}`, { dy: 50, size: S(b), color: 'sky', noBig: true }); }
        if (q.kind === 2) { ang(b, D, A, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 26, size: S(b) }); ang(b, B, Cc, D, { color: 'sky', rings: 2, label: dgx(q.k * q.th), r: 28, size: S(b) }); ang(b, Pp, A, B, { color: 'rose', rings: 3, label: 'x', r: 24, size: S(b) + 3 }); }
        return;
      }
      if (ex || st >= 1) { ang(b, D, A, B, { color: 'sky', rings: 1, label: dgx(th), r: 26, size: S(b) - 1 }); }
      if (ex || st >= 2) { ang(b, A, Cc, D, { color: g.k === 1 ? 'sky' : 'rose', rings: rk, label: dgx(kth), r: 28, size: S(b) - 1 }); }
    },
    steps: (M) => {
      const g = M.g, th = g.a / 2, kth = g.k * th;
      return [
        `호 AB의 크기가 ${fmtN(g.a)}°이므로 호 AB에 대한 원주각 $\\angle ADB=${fmtN(th)}^{\\circ}$.`,
        `호 CD의 크기는 호 AB의 ${g.k === 1 ? '같은' : g.k + '배'}이므로 ${fmtN(g.k * g.a)}°이고, 호 CD에 대한 원주각 $\\angle CAD=${fmtN(kth)}^{\\circ}$.`,
        '한 원에서 호의 길이(크기)와 원주각의 크기는 <b>정비례</b>해요. 호가 k배이면 원주각도 k배예요.',
        `두 현이 만나는 점 P에서 $\\angle APB=\\angle ADB+\\angle CAD=${fmtN(th + kth)}^{\\circ}$이고 $\\angle APD=180^{\\circ}-${fmtN(th + kth)}^{\\circ}=${fmtN(180 - th - kth)}^{\\circ}$.`
      ];
    },
    view: (M) => {
      const g = M.g, ratio = Math.sin((g.k * g.a / 2) * DEG) / Math.sin((g.a / 2) * DEG);
      return {
        guide: '막대로 <b>호 AB</b>와 <b>k</b>를 바꿔 보세요. 호 CD가 k배가 되면 원주각도 k배예요. 하지만 <b>현의 길이 CD는 k배가 아니에요</b>.',
        readouts: [rd('호 AB : 호 CD', `1 : ${g.k}`, 'sky'), rd('∠ADB : ∠CAD', `1 : ${g.k}`, 'rose', '원주각의 비도 같아요'), rd('현 AB : 현 CD', `1 : ${fmtN(Math.round(ratio * 100) / 100)}`, 'amber', g.k === 1 ? '같아요' : `${g.k}배가 아니에요`), rd('∠APB', dgx(g.a / 2 + g.k * g.a / 2), 'green', '두 원주각의 합')],
        rule: '한 원에서 호의 길이와 원주각의 크기는 정비례한다 (현의 길이는 정비례하지 않는다)',
        notes: notes('<b>호의 크기 ∝ 중심각 ∝ 원주각</b>이에요. 현의 길이는 비례하지 않아요(2배 호의 현은 2배보다 짧아요).')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), th = q.th, k = q.k, g = M.g;
      let stem, ans, wr, meas, tag;
      const ang3 = (V, X, Y) => { const u = sub(X, V), v = sub(Y, V); return Math.acos((u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y))) / DEG; };
      const kk = k === 1 ? '호 CD의 길이는 호 AB의 길이와 같고' : `호 CD의 길이는 호 AB의 길이의 ${k}배이고`;
      const pre = '그림에서 두 현 AC, BD의 교점을 P라 하자.';
      if (q.kind === 0) {
        tag = '호와 원주각의 비 · ∠APD'; ans = 180 - th * (1 + k); meas = ang3(g.P, g.A, g.D);
        stem = `${pre} ${kk} $\\angle ADB=${th}^{\\circ}$일 때, $\\angle APD$의 크기 $x$는?`;
        wr = [[th * (1 + k), '이것은 ∠APB예요. ∠APD=180°−∠APB.'], [th * k, '이것은 ∠CAD예요.'], [180 - th, '호 CD에 대한 원주각도 더해야 해요.'], [90 - th, '∠APB=∠ADB+∠CAD를 먼저 구해요.'], [ans + 10, '∠APD=180°−(∠ADB+∠CAD)예요.']];
      } else if (q.kind === 1) {
        tag = '호와 원주각의 비 · ∠CAD'; ans = k * th; meas = ang3(g.A, g.Cc || g.C, g.D);
        stem = `${pre} ${kk} $\\angle ADB=${th}^{\\circ}$일 때, $\\angle CAD$의 크기 $x$는?`;
        wr = [[th, k === 1 ? '호가 같으므로 원주각도 같아요(이 문제는 다른 변형).' : '호가 k배이면 원주각도 k배예요.'], [th * (1 + k), '이것은 두 원주각의 합이에요.'], [2 * th * k, '원주각은 호의 절반이에요. 호가 아니라 원주각을 구해요.'], [th * k + 10, '호가 k배이면 원주각도 k배예요.'], [th * k - 4, '호가 k배이면 원주각도 k배예요.']];
      } else {
        tag = '호와 원주각의 비 · ∠APB'; ans = th * (1 + k); meas = ang3(g.P, g.A, g.B);
        stem = `${pre} $\\angle ADB=${th}^{\\circ}$, $\\angle CBD=${k * th}^{\\circ}$일 때, $\\angle APB$의 크기 $x$는?`;
        wr = [[180 - th * (1 + k), '이것은 ∠APD예요.'], [th * k, '이것은 ∠CBD예요.'], [th, '이것은 ∠ADB예요. ∠APB는 두 원주각의 합이에요.'], [th * (1 + k) + 10, '∠APB=∠ADB+∠CAD(=∠CBD)예요.'], [2 * th * (1 + k), '∠APB=∠ADB+∠CAD예요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 4. 반원에 대한 원주각 */
  const thG = (p) => ({ A: pp(180), B: pp(0), P: pp(p), p, alpha: p / 2, beta: (180 - p) / 2 });
  const THL = [[10, 6, 8], [10, 8, 6], [26, 10, 24], [26, 24, 10], [20, 12, 16], [20, 16, 12], [30, 18, 24], [30, 24, 18], [50, 14, 48]];
  const thales = {
    id: 'c4-4', title: '반원에 대한 원주각은 90°', short: '반원의 원주각 90°',
    question: '지름 AB의 양 끝과 원 위의 점 P를 이으면 ∠APB는 몇 도일까? 점 P를 반원 위에서 움직여도 변할까?',
    ctl: ['c4p'],
    init: (s) => { s.c4p = 70; },
    gen(rnd, n) { const kind = n % 3; if (kind === 1) { const [d, a, b2] = pickR(rnd, THL); return { kind, d, a, b2, p: 2 * Math.atan2(b2, a) / DEG, key: `h1.${d}.${a}` }; } const th = pickR(rnd, [20, 25, 30, 35, 40, 50, 55, 60, 65]); return { kind, th, p: 2 * th, key: `h${kind}.${th}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; let p = q.p; if (q.kind === 1) p = 2 * Math.atan2(q.b2, q.a) / DEG; return { q, g: thG(clamp(p, 15, 165)) }; }
      return { g: thG(clamp(s.c4p, 15, 165)) };
    },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, P: Pp } = g;
      fit(b, { x0: -R, x1: R, y0: -R - 0.2, y1: 0.8 }, { t: 62, b: 50, l: 44, r: 44 });
      b.arc(O, R, Math.PI, 2 * Math.PI, { color: 'ink', width: 3.6 });
      b.arc(O, R, 0, Math.PI, { color: 'ink', width: 2, dash: [6, 6], alpha: 0.35 });
      line(b, A, B, 'ink', 3.4); line(b, A, Pp, 'ink', 3.2); line(b, B, Pp, 'ink', 3.2);
      if (pr && q.kind === 2) line(b, O, Pp, 'ink', 2.6);
      if (!pr && (ex || st >= 2)) { line(b, O, Pp, 'green', 2.4, { dash: [6, 5] }); }
      b.right(Pp, A, B, { size: 14, color: pr ? 'sky' : 'rose' });
      pname(b, A, Pp, 'A'); pname(b, B, Pp, 'B'); pname(b, Pp, O, 'P'); dot(b, O, 'ink', 4.4);
      if (!C.txt) return;
      T(b, O, 'O', { dy: -15, size: 16 });
      if (pr) {
        if (q.kind === 0) { ang(b, A, Pp, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 30, size: S(b) }); ang(b, B, A, Pp, { color: 'rose', rings: 2, label: 'x', r: 30, size: S(b) + 3 }); }
        if (q.kind === 1) { segTag(b, A, B, String(q.d), { away: Pp, color: 'sky', size: S(b), gap: 14 }); segTag(b, A, Pp, String(q.a), { away: B, color: 'sky', size: S(b), gap: 12 }); segTag(b, Pp, B, 'x', { away: A, gap: 12 }); }
        if (q.kind === 2) { ang(b, A, Pp, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 30, size: S(b) }); ang(b, O, Pp, B, { color: 'rose', rings: 2, label: 'x', r: 26, size: S(b) + 3 }); }
        return;
      }
      if (ex || st >= 1) { ang(b, A, Pp, B, { color: 'sky', rings: 1, label: dgx(g.alpha), r: 34, size: S(b) - 1 }); ang(b, B, A, Pp, { color: 'green', rings: 2, label: dgx(g.beta), r: 32, size: S(b) - 1 }); }
      if (ex || st >= 3) T(b, Pp, '', {});
    },
    steps: (M) => [
      '지름 AB는 원의 중심 O를 지나요. 호 AB(반원)의 중심각은 $180^{\\circ}$.',
      '한 호에 대한 원주각은 중심각의 $\\frac{1}{2}$이므로 $\\angle APB=\\frac{1}{2}\\times 180^{\\circ}=90^{\\circ}$.',
      `보조선 OP를 그으면 OA=OP=OB(반지름)이므로 삼각형 OAP, OPB는 이등변삼각형이고 $\\angle APB=\\angle OPA+\\angle OPB=\\angle A+\\angle B=90^{\\circ}$.`,
      `따라서 삼각형 PAB는 ∠P=90°인 직각삼각형이고 $\\angle A+\\angle B=90^{\\circ}$ (지금: ${fmtN(M.g.alpha)}°+${fmtN(M.g.beta)}°).`
    ],
    view: (M) => ({
      guide: '막대로 <b>점 P의 위치</b>를 바꿔 보세요. P가 반원 위 어디에 있어도 <b>∠APB는 늘 90°</b>예요. ∠A와 ∠B만 서로 달라지며 합은 90°예요.',
      readouts: [rd('∠APB', '90°', 'rose', '반원에 대한 원주각'), rd('∠PAB', dgx(M.g.alpha), 'sky'), rd('∠PBA', dgx(M.g.beta), 'green', '합이 90°')],
      rule: '반원에 대한 원주각의 크기는 90°이다 (지름을 한 변으로 하는 삼각형은 직각삼각형)',
      notes: notes('거꾸로, ∠P=90°이면 빗변 AB가 지름이에요.', '지름이 보이면 <b>끝점에서 원 위의 점을 이어</b> 직각삼각형을 만들어 보세요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '선분 AB는 원 O의 지름이고 점 P는 원 위의 점이다.';
      if (q.kind === 0) {
        tag = '반원의 원주각 · ∠PBA'; ans = 90 - q.th; meas = g.beta * 0 + (() => { const u = sub(g.A, g.B), v = sub(g.P, g.B); return Math.acos((u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y))) / DEG; })();
        stem = `${pre} $\\angle PAB=${q.th}^{\\circ}$일 때, $\\angle PBA$의 크기 $x$는?`;
        wr = [[q.th, '삼각형 PAB는 직각삼각형이에요(∠P=90°).'], [180 - q.th, '∠APB=90°를 이용해요.'], [90 + q.th, '∠APB=90°이므로 나머지 두 각의 합은 90°예요.'], [2 * q.th, '∠APB=90°를 이용해요.'], [90 - q.th + 10, '∠APB=90°이므로 나머지 두 각의 합은 90°예요.']];
        return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
      } else if (q.kind === 1) {
        tag = '반원의 원주각 · 피타고라스'; ans = q.b2; meas = dist(g.P, g.B) * (q.d / (2 * R)) * 0 + dist(g.P, g.B) / (2 * R) * q.d;
        stem = `${pre} $\\overline{AB}=${q.d}$ cm, $\\overline{AP}=${q.a}$ cm일 때, $\\overline{PB}$의 길이 $x$는?`;
        wr = [[q.d - q.a, '∠APB=90°이므로 피타고라스 정리를 써요.'], [q.d + q.a, '∠APB=90°이므로 피타고라스 정리를 써요.'], [Math.sqrt(q.d * q.d + q.a * q.a), '빗변이 AB(지름)예요.'], [q.a, 'AP와 PB는 달라요.'], [q.d / 2, '이것은 반지름이에요.']];
        return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
      }
      tag = '반원의 원주각 · ∠POB'; ans = 2 * q.th; meas = g.p;
      stem = `${pre} $\\angle PAB=${q.th}^{\\circ}$일 때, $\\angle POB$의 크기 $x$는?`;
      wr = [[q.th, '중심각은 원주각의 2배예요.'], [90 - q.th, '이것은 ∠PBA예요. ∠POB는 ∠PAB의 2배예요.'], [180 - 2 * q.th, '중심각=원주각×2예요.'], [90, '∠APB예요.'], [3 * q.th, '중심각=원주각×2예요.']];
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 5. 원주각과 삼각비 */
  const trigG = (A0, Rr = 6) => { const Bp = mp(O, Rr, 270 - A0), Cp = mp(O, Rr, 270 + A0), Ap = mp(O, Rr, 90), Dp = mp(O, Rr, 270 - A0 + 180); return { A0, R: Rr, A: Ap, B: Bp, C: Cp, D: Dp, bc: 2 * Rr * Math.sin(A0 * DEG) }; };
  const TRG = [[30, 1, 2], [45, 1.41421356, 2], [60, 1.7320508, 2]];
  const trig = {
    id: 'c4-5', title: '원주각과 삼각비: BC = 2R sin A', short: '원주각과 삼각비',
    question: '원에 내접하는 삼각형 ABC에서 변 BC의 길이는 외접원의 반지름 R과 ∠A로 어떻게 나타낼 수 있을까? 지름을 한 변으로 하는 직각삼각형을 만들어 보자.',
    ctl: ['c4A', 'c4R'],
    init: (s) => { s.c4A = 40; s.c4R = 5; },
    gen(rnd, n) { const kind = n % 6, A0 = [30, 45, 60][kind % 3], a = 2 + Math.floor(rnd() * 8); return { kind, A0, a, ask: kind < 3 ? 'R' : 'BC', key: `s${kind}.${a}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: trigG(q.A0, q.a) }; } return { g: trigG(clamp(s.c4A, 20, 80), s.c4R) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', Rr = g.R;
      { const bx = pr ? Rr * 1.05 : 8.2; fit(b, { x0: -bx, x1: bx, y0: -bx, y1: bx }, { t: 62, b: 44, l: 44, r: 44 }); }
      circle(b, O, Rr, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      b.path([g.A, g.B, g.C], { close: true, color: 'ink', width: 3.6 });
      if (!pr && (ex || st >= 1)) { line(b, g.B, g.D, 'green', 2.8, { dash: [6, 5] }); line(b, g.C, g.D, 'green', 2.8); dot(b, g.D, 'green', 4.4); b.right(g.C, g.B, g.D, { size: 12, color: 'amber' }); }
      if (pr) line(b, O, g.B, 'ink', 2.4);
      pname(b, g.A, O, 'A'); pname(b, g.B, O, 'B'); pname(b, g.C, O, 'C'); dot(b, O, 'ink', 4.4);
      if (!C.txt) return;
      T(b, O, 'O', { dx: 12, dy: -13, size: 16 });
      if (!pr && (ex || st >= 1)) tagOut(b, g.D, O, 'D', { size: 16, color: 'green' });
      if (pr) {
        ang(b, g.A, g.B, g.C, { color: 'sky', rings: 1, label: dgx(q.A0), r: 30, size: S(b) });
        const bcv = { 30: 1, 45: Math.SQRT2, 60: Math.sqrt(3) }[q.A0], bcs = q.A0 === 30 ? String(q.a) : q.A0 === 45 ? `${q.a}√2` : `${q.a}√3`;
        if (q.ask === 'R') { segTag(b, g.B, g.C, 'BC=' + bcs, { away: g.A, color: 'sky', size: S(b), gap: 14 }); segTag(b, O, g.B, 'x', { away: g.C, gap: 12 }); }
        else { segTag(b, g.B, g.C, 'x', { away: g.A, gap: 14 }); segTag(b, O, g.B, String(q.a), { away: g.C, color: 'sky', size: S(b), gap: 12 }); }
        return;
      }
      ang(b, g.A, g.B, g.C, { color: 'rose', rings: 1, label: dgx(g.A0), r: 30, size: S(b) });
      if (ex || st >= 2) ang(b, g.D, g.B, g.C, { color: 'rose', rings: 1, label: dgx(g.A0 > 90 ? 180 - g.A0 : g.A0), r: 24, size: S(b) - 2 });
      segTag(b, g.B, g.C, 'BC=' + cv(g.bc), { away: g.A, color: 'sky', size: S(b), gap: 14 });
      if (ex || st >= 1) segTag(b, g.B, g.D, '2R=' + cv(2 * Rr), { away: g.C, f: 0.3, size: S(b) - 2, color: 'green', gap: 14 });
    },
    steps: (M) => [
      '꼭짓점 B에서 지름 BD를 그어요. 지름의 길이는 $\\overline{BD}=2R$.',
      '반원에 대한 원주각이므로 $\\angle BCD=90^{\\circ}$이고, 같은 호 BC에 대한 원주각이므로 $\\angle BDC=\\angle BAC$.',
      '직각삼각형 BCD에서 $\\sin A=\\sin D=\\frac{\\overline{BC}}{\\overline{BD}}=\\frac{\\overline{BC}}{2R}$.',
      `따라서 $\\overline{BC}=2R\\sin A=2\\times ${fmtN(M.g.R)}\\times\\sin ${fmtN(M.g.A0)}^{\\circ}=${nt(M.g.bc)}$ (≈ ${fmtN(M.g.bc)}).`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A</b>와 <b>반지름 R</b>을 바꿔 보세요. 변 BC의 길이는 늘 <b>2R·sin A</b>예요. 지름 BD를 그으면 직각삼각형이 생겨요.',
      readouts: [rd('∠A', dgx(M.g.A0), 'sky'), rd('R', fmtN(M.g.R), 'amber'), rd('BC', fmtN(M.g.bc), 'rose', '2R·sin A'), rd('BC ÷ sin A', fmtN(M.g.bc / Math.sin(M.g.A0 * DEG)), 'green', '늘 2R')],
      rule: '삼각형 ABC의 외접원의 반지름이 R이면 $\\dfrac{BC}{\\sin A}=2R$',
      notes: notes('이 장면은 지름이 보일 때 <b>보조선 BD(지름)</b>를 긋는 연습이에요.', '삼각비의 값: sin30°=$\\frac{1}{2}$, sin45°=$\\frac{\\sqrt{2}}{2}$, sin60°=$\\frac{\\sqrt{3}}{2}$.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), a = q.a, A0 = q.A0, g = M.g;
      const fac = { 30: 1, 45: Math.SQRT2, 60: Math.sqrt(3) }[A0];
      let stem, ans, wr, meas, tag;
      const pre = '반지름이 R인 원 O에 삼각형 ABC가 내접한다.';
      if (q.ask === 'R') {
        tag = '원주각과 삼각비 · 반지름'; ans = a; meas = dist(g.B, g.C) / (2 * Math.sin(A0 * DEG));
        const bcTex = A0 === 30 ? `${a}` : A0 === 45 ? `${a}\\sqrt{2}` : `${a}\\sqrt{3}`;
        stem = `${pre} $\\angle A=${A0}^{\\circ}$, $\\overline{BC}=${bcTex}$일 때, 반지름 $R$의 값 $x$는?`;
        wr = [[2 * a, 'BC=2R·sin A이므로 R=BC÷(2 sin A)예요.'], [a / 2, 'BC=2R·sin A이므로 R=BC÷(2 sin A)예요.'], [a * fac, 'BC=2R·sin A이므로 R=BC÷(2 sin A)예요.'], [a + 1, 'BC=2R·sin A이므로 R=BC÷(2 sin A)예요.'], [a * 2 * fac, 'BC=2R·sin A이므로 R=BC÷(2 sin A)예요.']];
      } else {
        tag = '원주각과 삼각비 · BC'; ans = a * fac; meas = dist(g.B, g.C);
        stem = `${pre} $\\angle A=${A0}^{\\circ}$이고 반지름이 ${a}일 때, $\\overline{BC}$의 길이 $x$는?`;
        wr = [[a, A0 === 30 ? '이 경우 BC=R이에요. 다시 계산해 보세요.' : 'BC=2R·sin A예요.'], [2 * a, 'BC=2R·sin A예요. sin A가 곱해져요.'], [a / 2, 'BC=2R·sin A예요.'], [a * fac * 2, 'BC=2R·sin A예요. 2R에 sin A를 곱해요.'], [a * fac / 2, 'BC=2R·sin A예요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: '' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 6. 지름과 평행한 현 */
  const parG = (th) => { const dd = 2 * th, Dp = pp(dd), Cp = pp(180 - dd), A = pp(180), B = pp(0); return { th, dd, A, B, C: Cp, D: Dp, arcCD: 180 - 2 * dd }; };
  const PAR = [[20, 4], [20, 2], [30, 3], [15, 2], [10, 1], [18, 2], [36, 4], [12, 2], [24, 4], [15, 1], [30, 2], [20, 6]];
  const para = {
    id: 'c4-6', title: '지름과 평행한 현', short: '지름과 평행한 현',
    question: '지름 AB와 평행한 현 CD가 있다. ∠ADC를 알면 호 AC, 호 DB, 호 CD의 크기와 길이를 구할 수 있을까?',
    ctl: ['c4h'],
    init: (s) => { s.c4h = 20; },
    gen(rnd, n) { const kind = n % 3, [th, k] = pickR(rnd, PAR); return { kind, th, k, key: `v${kind}.${th}.${k}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: parG(q.th) }; } return { g: parG(clamp(s.c4h, 10, 40)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D } = g;
      FIT(b);
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      line(b, A, B, 'ink', 3.4); line(b, Cc, D, 'ink', 3.4); line(b, A, D, 'ink', 3); line(b, O, A, 'ink', 1.6, { alpha: 0.4 });
      G.par(b, A, B, 1, 'amber', 0.25); G.par(b, Cc, D, 1, 'amber', 0.25);
      if (pr) { if (q.kind === 0) { arcB(b, 0, g.dd, 'sky', 6); arcB(b, g.dd, 180 - g.dd, 'rose', 6); } if (q.kind === 1) arcB(b, g.dd, 180 - g.dd, 'rose', 6); }
      else { if (ex || st >= 1) { arcB(b, 180 - g.dd, 180, 'sky', 6); } if (ex || st >= 2) arcB(b, 0, g.dd, 'sky', 6); if (ex || st >= 3) arcB(b, g.dd, 180 - g.dd, 'rose', 6); }
      if (pr && q.kind === 2) line(b, A, Cc, 'ink', 3);
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); pname(b, D, O, 'D'); dot(b, O, 'ink', 4.4);
      if (!C.txt) return;
      T(b, O, 'O', { dx: 0, dy: 16, size: 16 });
      if (pr) {
        ang(b, D, A, Cc, { color: 'sky', rings: 1, label: dgx(q.th), r: 32, size: S(b) });
        if (q.kind === 0) { T(b, mp(O, R + 1.0, g.dd / 2), (q.k === 1 ? "π" : `${q.k}π`), { size: S(b), color: 'sky', noBig: true, leaderAnchor: mp(O, R, g.dd / 2), leader: true }); T(b, mp(O, R + 1.0, 90), 'x', { size: S(b) + 3, color: 'rose', leaderAnchor: mp(O, R, 90), leader: true }); }
        if (q.kind === 1) T(b, mp(O, R + 1.0, 90), 'x', { size: S(b) + 3, color: 'rose', leaderAnchor: mp(O, R, 90), leader: true });
        if (q.kind === 2) ang(b, A, Cc, D, { color: 'rose', rings: 2, label: 'x', r: 26, size: S(b) + 3 });
        return;
      }
      ang(b, D, A, Cc, { color: 'sky', rings: 1, label: dgx(g.th), r: 32, size: S(b) });
      if (ex || st >= 2) ang(b, A, B, D, { color: 'sky', rings: 1, label: dgx(g.th), r: 30, size: S(b) - 1 });
      if (ex || st >= 1) T(b, mp(O, R + 1.0, 180 - g.dd / 2), dgx(2 * g.th), { size: S(b) - 1, color: 'sky', noBig: true, leaderAnchor: mp(O, R, 180 - g.dd / 2), leader: true });
      if (ex || st >= 2) T(b, mp(O, R + 1.0, g.dd / 2), dgx(2 * g.th), { size: S(b) - 1, color: 'sky', noBig: true, leaderAnchor: mp(O, R, g.dd / 2), leader: true });
      if (ex || st >= 3) T(b, mp(O, R + 1.0, 90), dgx(g.arcCD), { size: S(b) - 1, color: 'rose', noBig: true, leaderAnchor: mp(O, R, 90), leader: true });
    },
    steps: (M) => [
      `∠ADC=${fmtN(M.g.th)}°는 호 AC에 대한 원주각이므로 호 AC의 크기는 $2\\times ${fmtN(M.g.th)}^{\\circ}=${fmtN(2 * M.g.th)}^{\\circ}$.`,
      `$\\overline{AB}\\parallel\\overline{CD}$이므로 엇각 $\\angle DAB=\\angle ADC=${fmtN(M.g.th)}^{\\circ}$. 이 각은 호 DB에 대한 원주각이므로 호 DB의 크기도 ${fmtN(2 * M.g.th)}°.`,
      `윗반원은 180°이므로 호 CD의 크기는 $180^{\\circ}-${fmtN(2 * M.g.th)}^{\\circ}-${fmtN(2 * M.g.th)}^{\\circ}=${fmtN(M.g.arcCD)}^{\\circ}$.`,
      `한 원에서 호의 길이는 중심각(크기)에 정비례하므로 호 CD : 호 DB = ${fmtN(M.g.arcCD)} : ${fmtN(2 * M.g.th)}.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠ADC</b>를 바꿔 보세요. 평행한 현 사이의 두 호 AC와 DB는 <b>항상 같고</b>, 나머지 호 CD는 180°에서 그 두 호를 뺀 값이에요.',
      readouts: [rd('∠ADC = ∠DAB', dgx(M.g.th), 'sky', '엇각'), rd('호 AC = 호 DB', dgx(2 * M.g.th), 'sky', '원주각의 2배'), rd('호 CD', dgx(M.g.arcCD), 'rose', '180° − 4∠ADC')],
      rule: '평행한 두 현 사이의 호의 크기는 같다. 호의 길이는 호의 크기(중심각)에 정비례한다',
      notes: notes('평행선의 <b>엇각</b>과 <b>원주각</b>을 함께 써요.', '호의 길이를 구할 때는 크기의 비를 이용해 $\\text{호 CD}:\\text{호 DB}$를 세워요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), th = q.th, g = M.g;
      let stem, ans, wr, meas, tag, ch;
      const pre = '그림에서 $\\overline{AB}$는 원 O의 지름이고 $\\overline{AB}\\parallel\\overline{CD}$이다.';
      if (q.kind === 0) {
        const arc = ((180 - 4 * th) / (2 * th)) * q.k; tag = '평행한 현 · 호의 길이'; ans = arc; meas = (g.arcCD / (2 * th)) * q.k;
        stem = `${pre} $\\angle ADC=${th}^{\\circ}$, $\\widehat{DB}=${q.k === 1 ? "" : q.k}\\pi$일 때, $\\widehat{CD}$의 길이 $x$는?`;
        const fr = (v) => (Number.isInteger(v) ? v : v);
        wr = [[q.k, '호 CD와 호 DB는 길이가 달라요. 크기의 비를 이용해요.'], [q.k * 2, '크기의 비 호 CD : 호 DB를 이용해요.'], [arc + q.k, '크기의 비를 이용해요.'], [arc * 2, '크기의 비를 이용해요.'], [Math.max(1, Math.round(arc / 2)), '크기의 비를 이용해요.'], [arc + 2, '크기의 비를 이용해요.'], [arc - 1, '크기의 비를 이용해요.']].map(([v, h]) => [fr(v), h]);
        ch = mkPi(ans, wr, { pad: 1 });
      } else if (q.kind === 1) {
        tag = '평행한 현 · 호 CD의 크기'; ans = 180 - 4 * th; meas = g.arcCD;
        stem = `${pre} $\\angle ADC=${th}^{\\circ}$일 때, 호 CD의 크기(중심각) $x$는?`;
        wr = [[180 - 2 * th, '평행한 현 사이의 두 호 AC, DB를 모두 빼야 해요.'], [2 * th, '이것은 호 AC의 크기예요.'], [90 - 2 * th, '윗반원 180°에서 호 AC와 호 DB를 빼요.'], [180 - th, '원주각이 아니라 호의 크기(2배)를 써요.'], [180 - 4 * th + 10, '윗반원 180°에서 호 AC와 호 DB를 빼요.']];
        ch = mkDeg(ans, wr, 10);
      } else {
        tag = '평행한 현 · ∠CAD'; ans = 90 - 2 * th; meas = g.arcCD / 2;
        stem = `${pre} $\\angle ADC=${th}^{\\circ}$일 때, $\\angle CAD$의 크기 $x$는?`;
        wr = [[180 - 4 * th, '이것은 호 CD의 크기예요. 원주각은 그 절반이에요.'], [th, '이것은 ∠ADC예요.'], [90 - th, '호 CD의 크기를 먼저 구해요.'], [2 * th, '이것은 호 AC의 크기예요.'], [90 - 2 * th + 10, '∠CAD=호 CD÷2예요.']];
        ch = mkDeg(ans, wr, 10);
      }
      return { tag, key, stem, choices: ch, chk: [meas, ans] };
    }
  };

  /* ====================================================================== 7. 네 점이 한 원 위에 있을 조건 */
  const fpB = pp(225), fpC = pp(315), fpA = pp(90), YD = -0.55 * R;
  const angAt = (V, X, Y) => { const u = sub(X, V), v = sub(Y, V); return Math.acos(clamp((u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)), -1, 1)) / DEG; };
  const dOnCircle = Math.sqrt(R * R - YD * YD);
  const four = {
    id: 'c4-7', title: '네 점이 한 원 위에 있을 조건', short: '네 점이 한 원 위에',
    question: '두 점 A, D가 직선 BC의 같은 쪽에 있을 때 ∠BAC와 ∠BDC가 같으면 네 점 A, B, C, D는 한 원 위에 있을까? 점 D를 가로로 끌어 확인해 보자.',
    ctl: ['c4d'],
    presets: () => [{ group: '맞춰 보기', label: '오른쪽 원 위로', apply: (s) => { s.c4d = Math.round(dOnCircle * 10) / 10; }, on: () => false }, { label: '왼쪽 원 위로', apply: (s) => { s.c4d = -Math.round(dOnCircle * 10) / 10; }, on: () => false }],
    init: (s) => { s.c4d = 2.2; },
    gen(rnd, n) {
      const kind = n % 3, a1 = pickR(rnd, [50, 60, 70, 80]), a2 = pickR(rnd, [70, 90, 100, 110]), a3 = pickR(rnd, [60, 70, 80, 90]);
      const a4 = 360 - a1 - a2 - a3; return { kind, arcs: [a1, a2, a3, a4], key: `f${kind}.${a1}.${a2}.${a3}` };
    },
    model(s, C) {
      if (C.problem) {
        const q = s.ciPk, ar = q.arcs, a0 = 100, pts2 = [0, 1, 2, 3].map((i) => pp(a0 - ar.slice(0, i).reduce((p, v) => p + v, 0)));
        return { q, A: pts2[0], B: pts2[1], C: pts2[2], D: pts2[3], arcs: ar, abc: angAt(pts2[0], pts2[1], pts2[2]), bdc: angAt(pts2[3], pts2[1], pts2[2]) };
      }
      const d = clamp(s.c4d, -5.6, 5.6), D = pt(d, YD);
      return { A: fpA, B: fpB, C: fpC, D, d, abc: angAt(fpA, fpB, fpC), bdc: angAt(D, fpB, fpC) };
    },
    draw(b, s, M, C) {
      const { q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D } = M;
      FIT(b);
      if (pr) {
        circle(b, O, R, 'ink', 3.4, { fill: 'sky', fa: 0.04 });
        b.path([A, B, Cc, D], { close: true, color: 'ink', width: 3.2 }); line(b, A, Cc, 'ink', 2.6); line(b, B, D, 'ink', 2.6);
        pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); pname(b, D, O, 'D');
        if (!C.txt) return;
        const ar = M.arcs, half = ar.map((v) => v / 2);
        // 변 BC(호 ar[1]) → ∠BAC, ∠BDC / 변 CD(ar[2]) → ∠CAD, ∠CBD / 변 DA(ar[3]) → ∠DBA?, 아래 규칙
        const sides = [[B, Cc, 1, A, D], [Cc, D, 2, B, A], [D, A, 3, C, B]]; void sides;
        let V1, V2, X, Y, hv;
        if (q.kind === 0) { V1 = A; V2 = D; X = B; Y = Cc; hv = half[1]; }
        else if (q.kind === 1) { V1 = B; V2 = A; X = Cc; Y = D; hv = half[2]; }
        else { V1 = B; V2 = Cc; X = D; Y = A; hv = half[3]; }
        ang(b, V1, X, Y, { color: 'sky', rings: 1, label: dgx(hv), r: 26, size: S(b) });
        ang(b, V2, X, Y, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3 });
        return;
      }
      const same = Math.abs(M.abc - M.bdc) < 0.6;
      const k = 8; void k;
      circle(b, O, R, same ? 'green' : 'ink', same ? 3.8 : 2.2, { fill: 'sky', fa: 0.04, dash: same ? undefined : [7, 6], alpha: same ? 1 : 0.55 });
      b.path([A, B, Cc], { close: true, color: 'ink', width: 3.4 }); line(b, D, B, 'ink', 3); line(b, D, Cc, 'ink', 3);
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); dot(b, D, 'amber', 5.6);
      if (ex) b.handle('D', D, { color: 'amber', r: 8, ariaLabel: '점 D를 가로로 끌기', drag: (w) => { s.c4d = clamp(Math.round(w.x * 10) / 10, -5.6, 5.6); } });
      if (!C.txt) return;
      T(b, D, 'D', { dy: 20, size: 17 });
      ang(b, A, B, Cc, { color: 'rose', rings: 1, label: dgx(M.abc), r: 26, size: S(b) });
      ang(b, D, B, Cc, { color: same ? 'rose' : 'green', rings: same ? 1 : 2, label: dgx(M.bdc), r: 28, size: S(b) });
    },
    steps: (M) => [
      '점 A, D는 직선 BC의 같은 쪽에 있어요. ∠BAC와 ∠BDC는 모두 선분 BC가 보이는 각이에요.',
      `삼각형 ABC의 외접원을 그려요. D가 이 원 위에 있으면 호 BC에 대한 원주각이므로 $\\angle BDC=\\angle BAC=${fmtN(M.abc || 0)}^{\\circ}$.`,
      '거꾸로 $\\angle BAC=\\angle BDC$이면 D는 그 원 위에 있어요 → <b>네 점 A, B, C, D는 한 원 위에 있다</b>.',
      '$\\angle BDC\\ne\\angle BAC$이면 D는 원 위에 있지 않아요(안쪽이면 더 크고, 바깥쪽이면 더 작아요).'
    ],
    view: (M) => {
      const same = Math.abs(M.abc - M.bdc) < 0.6;
      return {
        guide: '노란 점 <b>D를 가로로</b> 끌어 보세요(또는 막대). D가 원 위에 오면 <b>∠BDC가 ∠BAC와 같아지고</b> 원이 초록으로 바뀌어요. 안쪽이면 더 크고 바깥쪽이면 더 작아요.',
        readouts: [rd('∠BAC', dgx(M.abc), 'rose'), rd('∠BDC', dgx(M.bdc), same ? 'rose' : 'green'), rd('판정', same ? '한 원 위에 있어요' : M.bdc > M.abc ? '원 안쪽' : '원 바깥쪽', same ? 'green' : 'amber')],
        status: same ? { tone: 'ok', text: '∠BAC = ∠BDC → 네 점이 한 원 위' } : { tone: 'info', text: M.bdc > M.abc ? '∠BDC > ∠BAC → D는 원 안쪽' : '∠BDC < ∠BAC → D는 원 바깥쪽' },
        rule: '선분 BC에 대하여 두 점 A, D가 같은 쪽에 있고 ∠BAC=∠BDC이면 네 점 A, B, C, D는 한 원 위에 있다',
        notes: notes('두 점이 직선 BC의 <b>같은 쪽</b>에 있어야 해요.', '반대쪽에 있으면 두 각의 합이 180°일 때 한 원 위에 있어요(내접사각형).')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), ar = q.arcs;
      const idx = q.kind === 0 ? 1 : q.kind === 1 ? 2 : 3, ans = ar[idx] / 2;
      const sd = ['BC', 'CD', 'DA'][q.kind], pr2 = [['A', 'D', 'B', 'C'], ['B', 'A', 'C', 'D'], ['B', 'C', 'D', 'A']][q.kind];
      const meas = angAt(q.kind === 0 ? M.D : q.kind === 1 ? M.A : M.C, q.kind === 0 ? M.B : q.kind === 1 ? M.C : M.D, q.kind === 0 ? M.C : q.kind === 1 ? M.D : M.A);
      const stem = `네 점 A, B, C, D가 한 원 위에 있고 $\\angle ${pr2[2]}${pr2[0]}${pr2[3]}=${ans}^{\\circ}$일 때, $\\angle ${pr2[2]}${pr2[1]}${pr2[3]}$의 크기 $x$는? (선분 ${sd}에 대한 원주각)`;
      const wr = [[2 * ans, '같은 호에 대한 원주각은 같아요. 중심각이 아니에요.'], [180 - ans, '같은 쪽에 있으면 같아요.'], [ans / 2 + 5, '같은 호에 대한 원주각은 같아요.'], [90 - ans, '같은 호에 대한 원주각은 같아요.'], [ans + 10, '같은 호에 대한 원주각은 같아요.']];
      return { tag: `한 원 위의 네 점 · ∠${pr2[2]}${pr2[1]}${pr2[3]}`, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 8. 외심과 원주각 */
  const ocG = (A0, be) => { const b2 = be == null ? (180 - A0) / 2 : be, gam = 180 - A0 - b2, Bp = pp(90 - 2 * gam), Cp = pp(90 - 2 * gam - 2 * A0); return { A0, be: b2, A: pp(90), B: Bp, C: Cp }; };
  const oc = {
    id: 'c4-8', title: '원의 중심과 원주각: ∠OBC = 90° − ∠A', short: '중심과 원주각',
    question: '원 O에 내접하는 삼각형 ABC에서 중심 O와 BC를 이은 삼각형 OBC의 밑각 ∠OBC는 ∠A와 어떤 관계일까?',
    ctl: ['c4A'],
    init: (s) => { s.c4A = 40; },
    gen(rnd, n) { const kind = n % 3, th = pickR(rnd, [30, 35, 40, 45, 50, 55, 60, 65, 70]), be = pickR(rnd, [60, 65, 70, 75]); return { kind, th, be: Math.max(be, 91 - th + 1), key: `o${kind}.${th}.${be}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: ocG(q.th, q.be) }; } return { g: ocG(clamp(s.c4A, 20, 80)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc } = g;
      FIT(b);
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      b.path([A, B, Cc], { close: true, color: 'ink', width: 3.4 });
      line(b, O, B, 'ink', 2.6); line(b, O, Cc, 'ink', 2.6);
      if (pr && q.kind === 2) line(b, O, A, 'ink', 2);
      if (ex || st >= 3) fillPoly(b, [O, B, Cc], 'green', 0.12);
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); dot(b, O, 'ink', 4.4);
      if (!C.txt) return;
      T(b, O, 'O', { dx: 12, dy: -13, size: 16 });
      const a = g.A0;
      if (pr) {
        if (q.kind === 0) { ang(b, A, B, Cc, { color: 'sky', rings: 1, label: dgx(q.th), r: 28, size: S(b) }); ang(b, B, Cc, O, { color: 'rose', rings: 2, label: 'x', r: 30, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, B, Cc, O, { color: 'sky', rings: 2, label: dgx(90 - q.th), r: 30, size: S(b) }); ang(b, A, B, Cc, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, A, B, Cc, { color: 'sky', rings: 1, label: dgx(q.th), r: 26, size: S(b) }); ang(b, B, Cc, A, { color: 'sky', rings: 3, label: dgx(q.be), r: 54, size: S(b) }); ang(b, B, A, O, { color: 'rose', rings: 2, label: 'x', r: 24, size: S(b) + 3 }); }
        return;
      }
      ang(b, A, B, Cc, { color: 'rose', rings: 1, label: dgx(a), r: 28, size: S(b) });
      if (ex || st >= 1) ang(b, O, B, Cc, { color: 'sky', rings: 2, label: dgx(2 * a), r: 28, size: S(b) - 1 });
      if (ex || st >= 3) { ang(b, B, Cc, O, { color: 'green', rings: 3, label: dgx(90 - a), r: 30, size: S(b) - 1 }); ang(b, Cc, O, B, { color: 'green', rings: 3, r: 28 }); }
    },
    steps: (M) => [
      `∠BAC=${fmtN(M.g.A0)}°는 호 BC에 대한 원주각이에요.`,
      `호 BC에 대한 중심각은 원주각의 2배이므로 $\\angle BOC=2\\angle A=${fmtN(2 * M.g.A0)}^{\\circ}$.`,
      '삼각형 OBC는 $\\overline{OB}=\\overline{OC}$(반지름)인 이등변삼각형이므로 $\\angle OBC=\\angle OCB$.',
      `$\\angle OBC=\\frac{180^{\\circ}-\\angle BOC}{2}=\\frac{180^{\\circ}-${fmtN(2 * M.g.A0)}^{\\circ}}{2}=${fmtN(90 - M.g.A0)}^{\\circ}$ → <b>∠OBC=90°−∠A</b>.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A</b>를 바꿔 보세요. 중심각 ∠BOC는 늘 ∠A의 2배이고, 이등변삼각형 OBC의 밑각은 <b>90°−∠A</b>예요.',
      readouts: [rd('∠A (원주각)', dgx(M.g.A0), 'rose'), rd('∠BOC (중심각)', dgx(2 * M.g.A0), 'sky', '2×∠A'), rd('∠OBC = ∠OCB', dgx(90 - M.g.A0), 'green', '90° − ∠A')],
      rule: '원 O에 내접하는 삼각형 ABC에서 $\\angle BOC=2\\angle A$, $\\angle OBC=\\angle OCB=90^{\\circ}-\\angle A$',
      notes: notes('원의 중심 O는 삼각형 ABC의 <b>외심</b>이에요.', 'O와 두 꼭짓점을 이으면 반지름 두 개로 이등변삼각형이 생겨요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), th = q.th, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '원 O에 삼각형 ABC가 내접한다.';
      if (q.kind === 0) {
        tag = '외심과 원주각 · ∠OBC'; ans = 90 - th; meas = angAt(g.B, g.C, O);
        stem = `${pre} $\\angle A=${th}^{\\circ}$일 때, $\\angle OBC$의 크기 $x$는?`;
        wr = [[th, '∠OBC=90°−∠A예요.'], [2 * th, '이것은 ∠BOC예요.'], [180 - 2 * th, '이것은 ∠BOC의 보각이 아니라 ∠BOC=2∠A를 써요.'], [90 - th / 2, '∠BOC=2∠A를 먼저 구해요.'], [180 - th, '∠OBC=90°−∠A예요.']];
      } else if (q.kind === 1) {
        tag = '외심과 원주각 · ∠A'; ans = th; meas = angAt(g.A, g.B, g.C);
        stem = `${pre} $\\angle OBC=${90 - th}^{\\circ}$일 때, $\\angle A$의 크기 $x$는?`;
        wr = [[90 - th, '이것은 ∠OBC예요. ∠A=90°−∠OBC.'], [2 * th, '이것은 ∠BOC예요.'], [180 - 2 * th, '∠BOC=180°−2∠OBC, ∠A는 그 절반이에요.'], [th + 10, '∠A=90°−∠OBC예요.'], [90 + th, '∠A=90°−∠OBC예요.']];
      } else {
        tag = '외심과 원주각 · ∠OBA'; ans = q.be - (90 - th); meas = angAt(g.B, g.A, O);
        stem = `${pre} $\\angle A=${th}^{\\circ}$, $\\angle ABC=${q.be}^{\\circ}$일 때, $\\angle OBA$의 크기 $x$는? (단, O는 삼각형 ABC의 내부에 있다.)`;
        wr = [[90 - th, '이것은 ∠OBC예요. ∠OBA=∠ABC−∠OBC.'], [q.be, '이것은 ∠ABC예요.'], [q.be + 90 - th, '∠OBA=∠ABC−∠OBC예요.'], [180 - q.be - th, '이것은 ∠ACB예요.'], [ans + 10, '∠OBA=∠ABC−∠OBC예요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  G.register(40, 'c4', '원주각', '원주각', PARAMS, [c1, eqs2, arcs, thales, trig, para, four, oc]);
})();
