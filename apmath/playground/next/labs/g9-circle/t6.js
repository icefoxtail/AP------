/* ==========================================================================
   중3 · 원의 성질 — 탭 ⑥ 「접선과 현」 (t6.js, order 60) — 장면 8개
   · c6-1 접선과 현이 이루는 각       · ∠BAT = ∠ACB (지름 보조선)
   · c6-2 접선 양쪽의 각과 내접삼각형 · ∠TAB=∠ACB, ∠T′AC=∠ABC → ∠BAC = 180°−…
   · c6-3 [킬러] 지름의 연장선과 접선  · 지름 AB의 연장선 위의 점 P에서 접선 PT
   · c6-4 접선과 평행한 현            · BC∥접선이면 AB=AC (이등변삼각형)
   · c6-5 접선·현·이등변삼각형        · AB=BC일 때 ∠BAT 구하기
   · c6-6 [심화] 원 안에서 만나는 두 현   · PA·PB = PC·PD
   · c6-7 [심화] 원 밖에서 만나는 두 할선 · PA·PB = PC·PD
   · c6-8 [심화] 접선과 할선           · PT² = PA·PB
   값은 모두 지금의 각·길이로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, lerp, mp, T, tick, line, fit, P, rd, notes, fmtN, circle, arcD, dot, pname, segTag, tagOut, ang, cv, nt, ntD, mkNum, sz, fillPoly, mkChoices, degOf, norm360, inter, bboxOf, tangentPts } = G;
  const lenF = (v) => fmtN(v), degF = G.degF, dgx = (v) => fmtN(v) + '°';
  const pickR = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
  const S = (b, a = 16) => sz(b, a);
  const O = pt(0, 0), R = 6;
  const pp = (deg) => mp(O, R, deg);
  const ok180 = (v) => v > 0 && v < 180 && Math.abs(v - Math.round(v)) < 1e-9;
  const mkDeg = (ans, wr, pad = 5) => mkChoices(ans, wr, { pad, valid: ok180 });
  const angAt = (V, X, Y) => { const u = sub(X, V), v = sub(Y, V); return Math.acos(clamp((u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)), -1, 1)) / DEG; };
  const FIT = (b, o = {}) => fit(b, { x0: -R, x1: R, y0: -R, y1: R }, { t: 62, b: 44, l: 44, r: 44, ...o });
  const arcB = (b, d0, d1, col = 'rose', w = 6) => { const a = norm360(d0); let e = norm360(d1); if (e <= a) e += 360; arcD(b, O, R, a, e, col, w); };

  const PARAMS = {
    c6t: P('호 AB의 크기', 40, 160, 10, 100, { color: 'sky', format: degF }),
    c6u: P('점 C의 위치', 30, 300, 5, 200, { color: 'amber', hint: '호 위에서 점 C를 움직여요', format: (v) => Math.round(v) + '°' }),
    c6a: P('접선과 AB 사이각 ∠TAB', 30, 80, 5, 50, { color: 'sky', format: degF }),
    c6b: P('접선과 AC 사이각 ∠T′AC', 30, 80, 5, 60, { color: 'green', format: degF }),
    c6P: P('∠P의 크기', 20, 50, 2, 30, { color: 'rose', format: degF }),
    c6h: P('현 BC의 높이(∠BAT)', 30, 70, 5, 40, { color: 'sky', format: degF }),
    c6be: P('∠ABC의 크기', 40, 80, 2, 64, { color: 'sky', format: degF }),
    c6pa: P('PA', 2, 8, 1, 4, { color: 'sky', format: lenF }),
    c6pb: P('PB', 2, 12, 1, 6, { color: 'green', format: lenF }),
    c6pc: P('PC', 2, 10, 1, 3, { color: 'amber', format: lenF })
  };

  /* ====================================================================== 1. 접선과 현이 이루는 각 */
  // A 는 원의 맨 아래, 접선은 가로. B 는 A 에서 호 θ 만큼 오른쪽 위, C 는 반대쪽 큰 호 위
  const tcG = (th, u) => { const A = pp(270), B = pp(270 + th), C = pp(270 + th + u), D = pp(90), Tt = pt(R * 1.15, R), Tl = pt(-R * 1.15, R); return { th, u, A, B, C, D, T: Tt, T2: Tl }; };
  const alt = {
    id: 'c6-1', title: '접선과 현이 이루는 각', short: '접선과 현이 이루는 각',
    question: '원 위의 점 A에서 접선 TT′를 긋고 현 AB를 그으면 접선과 현이 이루는 각 ∠BAT는 호 AB에 대한 원주각 ∠ACB와 어떤 관계일까? 점 C를 움직여 보자.',
    ctl: ['c6t', 'c6u'],
    init: (s) => { s.c6t = 100; s.c6u = 200; },
    gen(rnd, n) { const kind = n % 3, th = pickR(rnd, [60, 70, 80, 100, 110, 120, 140]), u = pickR(rnd, [90, 130, 180, 220]); return { kind, th, u: Math.min(u, 330 - th), key: `a${kind}.${th}.${u}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: tcG(q.th, q.u) }; } const th = clamp(s.c6t, 40, 160); return { g: tcG(th, clamp(s.c6u, 30, 330 - th)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D, T: Tt, T2 } = g;
      fit(b, { x0: -R * 1.2, x1: R * 1.2, y0: -R, y1: R + 0.8 }, { t: 62, b: 44, l: 44, r: 44 });
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      line(b, pt(-R * 1.2, R), pt(R * 1.2, R), 'ink', 3.2);
      arcB(b, 270, 270 + g.th, 'sky', 5);
      line(b, A, B, 'ink', 3.2); line(b, A, Cc, 'ink', 3.2); line(b, B, Cc, 'ink', 3.2);
      if (!pr && (ex ? false : st >= 1)) { line(b, A, D, 'green', 2.6, { dash: [6, 5] }); line(b, B, D, 'green', 2.6, { dash: [6, 5] }); dot(b, D, 'green', 4.4); }
      pname(b, A, Cc, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C'); dot(b, O, 'ink', 3.6);
      if (!C.txt) return;
      T(b, Tt, 'T', { dx: 8, dy: 18, size: 17 }); T(b, T2, "T′", { dx: -8, dy: 18, size: 17 });
      if (!pr && st >= 1 && !ex) tagOut(b, D, O, 'D', { size: 16, color: 'green' });
      const half = g.th / 2;
      if (pr) {
        if (q.kind === 0) { ang(b, A, Tt, B, { color: 'sky', rings: 1, label: dgx(q.th / 2), r: 34, size: S(b) }); ang(b, Cc, A, B, { color: 'rose', rings: 1, label: 'x', r: 24, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, Cc, A, B, { color: 'sky', rings: 1, label: dgx(q.th / 2), r: 24, size: S(b) }); ang(b, A, Tt, B, { color: 'rose', rings: 1, label: 'x', r: 34, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, A, Tt, B, { color: 'sky', rings: 1, label: dgx(q.th / 2), r: 34, size: S(b) }); ang(b, O, A, B, { color: 'rose', rings: 2, label: 'x', r: 28, size: S(b) + 3 }); line(b, O, A, 'ink', 2.4); line(b, O, B, 'ink', 2.4); }
        return;
      }
      ang(b, A, Tt, B, { color: 'rose', rings: 1, label: dgx(half), r: 34, size: S(b) });
      ang(b, Cc, A, B, { color: 'rose', rings: 1, label: dgx(half), r: 24, size: S(b) });
      if (ex || st >= 4) ang(b, A, T2, B, { color: 'green', rings: 2, label: dgx(180 - half), r: 40, size: S(b) - 1 });
    },
    steps: (M) => [
      `점 A를 지나는 지름 AD를 그어요. 접선은 반지름에 수직이므로 $\\angle DAT=90^{\\circ}$.`,
      '지름에 대한 원주각이므로 $\\angle ABD=90^{\\circ}$이고, 삼각형 ABD에서 $\\angle BAD+\\angle ADB=90^{\\circ}$.',
      '$\\angle BAT=\\angle DAT-\\angle BAD=90^{\\circ}-\\angle BAD=\\angle ADB$.',
      `∠ADB와 ∠ACB는 같은 호 AB에 대한 원주각이므로 $\\angle ADB=\\angle ACB$. 그래서 $\\angle BAT=\\angle ACB=${fmtN(M.g.th / 2)}^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>호 AB</b>와 <b>점 C의 위치</b>를 바꿔 보세요. 접선과 현이 이루는 ∠BAT는 늘 <b>호 AB에 대한 원주각 ∠ACB와 같아요</b>(같은 표시). 반대쪽 각 ∠BAT′는 180°에서 뺀 값이에요.',
      readouts: [rd('∠BAT', dgx(M.g.th / 2), 'rose'), rd('∠ACB', dgx(M.g.th / 2), 'rose', '같아요'), rd('호 AB', dgx(M.g.th), 'sky', '∠BAT의 2배'), rd('∠BAT′', dgx(180 - M.g.th / 2), 'green', '180° − ∠BAT')],
      rule: '접선과 현이 이루는 각의 크기는 그 각의 안쪽에 있는 호에 대한 원주각의 크기와 같다',
      notes: notes('각의 <b>안쪽에 있는 호</b>에 대한 원주각과 같아요. ∠BAT는 호 AB(파란 호) 쪽이에요.', '접선과 현이 이루는 각의 크기는 그 안쪽 호의 크기의 절반이에요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), th = q.th, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '직선 TT′는 원 O의 접선이고 점 A는 접점이다.';
      if (q.kind === 0) {
        tag = '접선과 현이 이루는 각 · ∠ACB'; ans = th / 2; meas = angAt(g.C, g.A, g.B);
        stem = `${pre} $\\angle BAT=${th / 2}^{\\circ}$일 때, $\\angle ACB$의 크기 $x$는? (C는 호 AB의 반대쪽 호 위의 점)`;
        wr = [[th, '접선과 현이 이루는 각은 그 안쪽 호에 대한 원주각과 같아요.'], [180 - th / 2, '이것은 ∠BAT′예요.'], [90 - th / 2, '∠BAT=∠ACB예요.'], [th / 4 + 5, '∠BAT=∠ACB예요.'], [th / 2 + 10, '∠BAT=∠ACB예요.']];
      } else if (q.kind === 1) {
        tag = '접선과 현이 이루는 각 · ∠BAT'; ans = th / 2; meas = angAt(g.A, g.T, g.B);
        stem = `${pre} $\\angle ACB=${th / 2}^{\\circ}$일 때, $\\angle BAT$의 크기 $x$는? (C는 호 AB의 반대쪽 호 위의 점)`;
        wr = [[th, '∠BAT는 중심각이 아니라 원주각 ∠ACB와 같아요.'], [180 - th / 2, '이것은 ∠BAT′예요.'], [90 - th / 2, '∠BAT=∠ACB예요.'], [th / 2 + 10, '∠BAT=∠ACB예요.'], [th / 4 + 5, '∠BAT=∠ACB예요.']];
      } else {
        tag = '접선과 현이 이루는 각 · ∠AOB'; ans = th; meas = angAt(O, g.A, g.B);
        stem = `${pre} $\\angle BAT=${th / 2}^{\\circ}$일 때, 중심각 $\\angle AOB$의 크기 $x$는?`;
        wr = [[th / 2, '중심각은 접선과 현이 이루는 각의 2배예요.'], [th * 2, '중심각은 접선과 현이 이루는 각의 2배예요.'], [180 - th, '삼각형 OAB는 이등변삼각형이에요. ∠OAB=90°−∠BAT.'], [90 - th / 2, '이것은 ∠OAB예요.'], [th + 10, '중심각은 접선과 현이 이루는 각의 2배예요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 2. 접선 양쪽의 각과 내접삼각형 */
  const bothG = (a, b2) => { const A = pp(270), B = pp(270 + 2 * a), C = pp(270 - 2 * b2); return { a, b2, A, B, C, Tt: pt(R * 1.15, R), T2: pt(-R * 1.15, R) }; };
  const both = {
    id: 'c6-2', title: '접선 양쪽의 각과 내접삼각형의 각', short: '접선 양쪽의 각',
    question: '점 A에서의 접선 TT′와 두 현 AB, AC가 이루는 각 ∠TAB, ∠T′AC는 삼각형 ABC의 어느 각과 같을까? 세 각의 합이 180°인 것을 이용할 수 있을까?',
    ctl: ['c6a', 'c6b'],
    init: (s) => { s.c6a = 50; s.c6b = 60; },
    gen(rnd, n) { const kind = n % 3, a = pickR(rnd, [30, 35, 40, 45, 50, 55, 60]), b2 = pickR(rnd, [30, 35, 40, 50, 55, 60, 65]); return { kind, a, b2, key: `b${kind}.${a}.${b2}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: bothG(q.a, q.b2) }; } return { g: bothG(clamp(s.c6a, 30, 80), clamp(s.c6b, 30, 80)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, Tt, T2 } = g;
      fit(b, { x0: -R * 1.2, x1: R * 1.2, y0: -R, y1: R + 0.8 }, { t: 62, b: 44, l: 44, r: 44 });
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      line(b, pt(-R * 1.2, R), pt(R * 1.2, R), 'ink', 3.2);
      b.path([A, B, Cc], { close: true, color: 'ink', width: 3.4 });
      pname(b, A, Cc, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C');
      if (!C.txt) return;
      T(b, Tt, 'T', { dx: 8, dy: 18, size: 17 }); T(b, T2, "T′", { dx: -8, dy: 18, size: 17 });
      const al = 180 - g.a - g.b2;
      if (pr) {
        if (q.kind === 0) { ang(b, A, Tt, B, { color: 'sky', rings: 1, label: dgx(q.a), r: 32, size: S(b) }); ang(b, A, T2, Cc, { color: 'sky', rings: 2, label: dgx(q.b2), r: 32, size: S(b) }); ang(b, A, B, Cc, { color: 'rose', rings: 3, label: 'x', r: 26, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, A, Tt, B, { color: 'sky', rings: 1, label: dgx(q.a), r: 32, size: S(b) }); ang(b, A, B, Cc, { color: 'sky', rings: 3, label: dgx(al), r: 26, size: S(b) }); ang(b, A, T2, Cc, { color: 'rose', rings: 2, label: 'x', r: 32, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, A, Tt, B, { color: 'sky', rings: 1, label: dgx(q.a), r: 32, size: S(b) }); ang(b, A, T2, Cc, { color: 'sky', rings: 2, label: dgx(q.b2), r: 32, size: S(b) }); ang(b, Cc, A, B, { color: 'rose', rings: 1, label: 'x', r: 26, size: S(b) + 3 }); }
        return;
      }
      ang(b, A, Tt, B, { color: 'sky', rings: 1, label: dgx(g.a), r: 32, size: S(b) }); ang(b, A, T2, Cc, { color: 'green', rings: 2, label: dgx(g.b2), r: 32, size: S(b) });
      if (ex || st >= 1) ang(b, Cc, A, B, { color: 'sky', rings: 1, label: dgx(g.a), r: 24, size: S(b) - 1 });
      if (ex || st >= 2) ang(b, B, A, Cc, { color: 'green', rings: 2, label: dgx(g.b2), r: 24, size: S(b) - 1 });
      if (ex || st >= 3) ang(b, A, B, Cc, { color: 'rose', rings: 3, label: dgx(al), r: 26, size: S(b) - 1 });
    },
    steps: (M) => [
      `접선과 현이 이루는 각은 안쪽 호에 대한 원주각과 같아요: $\\angle TAB=\\angle ACB=${fmtN(M.g.a)}^{\\circ}$.`,
      `마찬가지로 $\\angle T^{\\prime}AC=\\angle ABC=${fmtN(M.g.b2)}^{\\circ}$.`,
      `접선 위의 세 각은 일직선: $\\angle TAB+\\angle BAC+\\angle CAT^{\\prime}=180^{\\circ}$.`,
      `그래서 $\\angle BAC=180^{\\circ}-${fmtN(M.g.a)}^{\\circ}-${fmtN(M.g.b2)}^{\\circ}=${fmtN(180 - M.g.a - M.g.b2)}^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠TAB</b>와 <b>∠T′AC</b>를 바꿔 보세요. 삼각형 ABC의 세 각은 접선 위의 두 각과 <b>같은 표시</b>끼리 같고, 나머지 ∠BAC는 180°에서 뺀 값이에요.',
      readouts: [rd('∠ACB', dgx(M.g.a), 'sky', '= ∠TAB'), rd('∠ABC', dgx(M.g.b2), 'green', '= ∠T′AC'), rd('∠BAC', dgx(180 - M.g.a - M.g.b2), 'rose', '180° − 두 각')],
      rule: '접선과 현이 이루는 두 각은 각각 삼각형의 두 내각과 같고, 접선 위의 세 각의 합은 180°이다',
      notes: notes('같은 표시(호 개수)가 같은 각이에요.', '접선 위의 각은 <b>일직선(180°)</b>이에요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g, al = 180 - q.a - q.b2;
      let stem, ans, wr, meas, tag;
      const pre = '직선 TT′는 원의 접선이고 점 A는 접점이며, 삼각형 ABC는 이 원에 내접한다.';
      if (q.kind === 0) {
        tag = '접선 양쪽의 각 · ∠BAC'; ans = al; meas = angAt(g.A, g.B, g.C);
        stem = `${pre} $\\angle TAB=${q.a}^{\\circ}$, $\\angle T^{\\prime}AC=${q.b2}^{\\circ}$일 때, $\\angle BAC$의 크기 $x$는?`;
        wr = [[q.a + q.b2, '접선 위의 세 각의 합이 180°예요.'], [180 - q.a, '접선 위의 세 각의 합이 180°예요.'], [90 - (q.a + q.b2) / 2, '접선 위의 세 각의 합이 180°예요.'], [al + 10, '접선 위의 세 각의 합이 180°예요.'], [al - 10, '접선 위의 세 각의 합이 180°예요.']];
      } else if (q.kind === 1) {
        tag = '접선 양쪽의 각 · ∠T′AC'; ans = q.b2; meas = angAt(g.A, g.T2, g.C);
        stem = `${pre} $\\angle TAB=${q.a}^{\\circ}$, $\\angle BAC=${al}^{\\circ}$일 때, $\\angle T^{\\prime}AC$의 크기 $x$는?`;
        wr = [[180 - q.a - al + 10, '접선 위의 세 각의 합이 180°예요.'], [al, '이것은 ∠BAC예요.'], [180 - al, '접선 위의 세 각의 합이 180°예요.'], [q.b2 - 10, '접선 위의 세 각의 합이 180°예요.'], [q.a, '이것은 ∠TAB예요.']];
      } else {
        tag = '접선 양쪽의 각 · ∠ACB'; ans = q.a; meas = angAt(g.C, g.A, g.B);
        stem = `${pre} $\\angle TAB=${q.a}^{\\circ}$, $\\angle T^{\\prime}AC=${q.b2}^{\\circ}$일 때, $\\angle ACB$의 크기 $x$는?`;
        wr = [[q.b2, '이것은 ∠ABC예요. ∠ACB=∠TAB.'], [al, '이것은 ∠BAC예요.'], [180 - q.a, '∠ACB는 ∠TAB와 같아요.'], [q.a / 2 + 10, '∠ACB는 ∠TAB와 같아요.'], [q.a + 10, '∠ACB는 ∠TAB와 같아요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 3. [킬러] 지름의 연장선과 접선 */
  const killG = (th) => { const f = 90 - th, Tt = pp(f), A = pp(180), B = pp(0), Pp = pt(R / Math.cos(f * DEG), 0); return { th, f, A, B, T: Tt, P: Pp }; };
  const kill = {
    id: 'c6-3', title: '[킬러] 지름의 연장선 위의 점에서 그은 접선', short: '[킬러] 지름의 연장선과 접선',
    question: '지름 AB의 연장선 위의 점 P에서 원에 접선 PT를 그었다. ∠P를 알면 ∠TAB, ∠PTB, ∠ATP를 구할 수 있을까?',
    ctl: ['c6P'],
    init: (s) => { s.c6P = 30; },
    gen(rnd, n) { const kind = n % 3, th = pickR(rnd, [20, 24, 30, 36, 40, 44, 50]); return { kind, th, key: `k${kind}.${th}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: killG(q.th) }; } return { g: killG(clamp(s.c6P, 20, 50)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, T: Tt, P: Pp } = g;
      fit(b, { x0: -R, x1: Pp.x + 0.6, y0: -R, y1: 0.8 }, { t: 62, b: 44, l: 44, r: 44 });
      b.arc(O, R, Math.PI, 2 * Math.PI, { color: 'ink', width: 3.6 }); b.arc(O, R, 0, Math.PI, { color: 'ink', width: 2, dash: [6, 6], alpha: 0.35 });
      line(b, A, Pp, 'ink', 3.4); line(b, Tt, Pp, 'ink', 3.4); line(b, A, Tt, 'ink', 3.2); line(b, Tt, B, 'ink', 3.2);
      if (pr || ex || st >= 1) line(b, O, Tt, 'green', 2.6, { dash: [6, 5] });
      b.right(Tt, A, B, { size: 13, color: 'amber' });
      pname(b, A, Tt, 'A'); pname(b, B, Tt, 'B'); dot(b, Tt, 'ink', 4.6); dot(b, Pp, 'ink', 4.6); dot(b, O, 'ink', 3.8);
      if (!C.txt) return;
      T(b, O, 'O', { dy: 17, size: 16 }); tagOut(b, Tt, O, 'T', { size: 17 }); T(b, Pp, 'P', { dy: 18, size: 17 });
      if (pr) {
        if (q.kind === 0) { ang(b, Pp, Tt, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 28, size: S(b), labelRot: 180, labelDist: 34 }); ang(b, A, Tt, B, { color: 'rose', rings: 2, label: 'x', r: 30, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, Pp, Tt, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 28, size: S(b), labelRot: 180, labelDist: 34 }); ang(b, Tt, A, Pp, { color: 'rose', rings: 3, label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, Tt, B, Pp, { color: 'sky', rings: 2, label: dgx(45 - q.th / 2), r: 28, size: S(b) }); ang(b, Pp, Tt, B, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3, labelRot: 180, labelDist: 34 }); }
        return;
      }
      ang(b, Pp, Tt, B, { color: 'rose', rings: 1, label: dgx(g.th), r: 28, size: S(b), labelRot: 180, labelDist: 34 });
      if (ex || st >= 1) ang(b, O, Tt, B, { color: 'sky', rings: 2, label: dgx(g.f), r: 26, size: S(b) - 1 });
      if (ex || st >= 2) ang(b, A, Tt, B, { color: 'green', rings: 2, label: dgx(g.f / 2), r: 28, size: S(b) - 1 });
      if (ex || st >= 3) ang(b, Tt, B, Pp, { color: 'green', rings: 2, label: dgx(g.f / 2), r: 28, size: S(b) - 1 });
    },
    steps: (M) => [
      `접선은 반지름에 수직이므로 $\\angle OTP=90^{\\circ}$. 삼각형 OTP에서 $\\angle TOP=90^{\\circ}-\\angle P=${fmtN(M.g.f)}^{\\circ}$.`,
      `∠TOB(=∠TOP)는 호 TB에 대한 중심각이므로 원주각 $\\angle TAB=\\frac{1}{2}\\angle TOB=${fmtN(M.g.f / 2)}^{\\circ}$.`,
      `접선과 현이 이루는 각: $\\angle PTB=\\angle TAB=${fmtN(M.g.f / 2)}^{\\circ}$.`,
      `AB가 지름이므로 $\\angle ATB=90^{\\circ}$이고 $\\angle ATP=\\angle ATB+\\angle PTB=90^{\\circ}+${fmtN(M.g.f / 2)}^{\\circ}=${fmtN(90 + M.g.f / 2)}^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠P</b>를 바꿔 보세요. 반지름 OT를 그으면 <b>∠TOP = 90° − ∠P</b>이고, 접선과 현이 이루는 각 ∠PTB는 ∠TAB와 같아요.',
      readouts: [rd('∠P', dgx(M.g.th), 'rose'), rd('∠TOB', dgx(M.g.f), 'sky', '90° − ∠P'), rd('∠TAB = ∠PTB', dgx(M.g.f / 2), 'green', '중심각의 절반'), rd('∠ATP', dgx(90 + M.g.f / 2), 'amber', '90° + ∠PTB')],
      status: { tone: 'key', text: '[킬러] 반지름 OT + 접선과 현이 이루는 각' },
      rule: '지름 AB의 연장선 위의 점 P에서 접선 PT를 그으면 $\\angle TOP=90^{\\circ}-\\angle P$, $\\angle PTB=\\angle TAB=\\frac{1}{2}\\angle TOB$',
      notes: notes('핵심 보조선은 <b>반지름 OT</b>(접선⊥반지름)와 <b>BT</b>(지름의 원주각 90°)예요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), th = q.th, g = M.g, f = 90 - th;
      let stem, ans, wr, meas, tag;
      const pre = '선분 AB는 원 O의 지름이고, 그 연장선 위의 점 P에서 원에 그은 접선의 접점을 T라 하자.';
      if (q.kind === 0) {
        tag = '[킬러] 지름의 연장선과 접선 · ∠TAB'; ans = f / 2; meas = angAt(g.A, g.T, g.B);
        stem = `${pre} $\\angle P=${th}^{\\circ}$일 때, $\\angle TAB$의 크기 $x$는?`;
        wr = [[f, '이것은 ∠TOB예요. ∠TAB는 그 절반이에요.'], [th, '∠TOP=90°−∠P를 먼저 구해요.'], [th / 2, '∠TOP=90°−∠P이고 ∠TAB는 그 절반이에요.'], [90 - th / 2, '∠TAB=∠TOB÷2, ∠TOB=90°−∠P예요.'], [f / 2 + 5, '∠TAB=∠TOB÷2, ∠TOB=90°−∠P예요.']];
      } else if (q.kind === 1) {
        tag = '[킬러] 지름의 연장선과 접선 · ∠ATP'; ans = 90 + f / 2; meas = angAt(g.T, g.A, g.P);
        stem = `${pre} $\\angle P=${th}^{\\circ}$일 때, $\\angle ATP$의 크기 $x$는?`;
        wr = [[90 - f / 2, '∠ATP=∠ATB+∠PTB=90°+∠PTB예요.'], [f / 2, '이것은 ∠PTB예요. ∠ATP에는 90°가 더해져요.'], [90, '∠ATB=90°에 ∠PTB를 더해요.'], [180 - th, '∠ATP=90°+∠PTB예요.'], [90 + f / 2 + 5, '∠ATP=90°+∠PTB예요.']];
      } else {
        tag = '[킬러] 지름의 연장선과 접선 · ∠P'; ans = th; meas = angAt(g.P, g.T, g.B) * 1;
        stem = `${pre} $\\angle PTB=${f / 2}^{\\circ}$일 때, $\\angle P$의 크기 $x$는?`;
        wr = [[f / 2, '이것은 ∠PTB예요.'], [f, '이것은 ∠TOP예요. ∠P=90°−∠TOP.'], [90 - f / 2, '∠TOP=2∠PTB, ∠P=90°−∠TOP예요.'], [th + 10, '∠TOP=2∠PTB, ∠P=90°−∠TOP예요.'], [th - 6, '∠TOP=2∠PTB, ∠P=90°−∠TOP예요.']];
      }
      void f;
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 4. 접선과 평행한 현 */
  const pcG = (t) => { const A = pp(270), B = pp(270 + 2 * t), C = pp(270 - 2 * t); return { t, A, B, C, Tt: pt(R * 1.15, R), T2: pt(-R * 1.15, R) }; };
  const parl = {
    id: 'c6-4', title: '접선과 평행한 현', short: '접선과 평행한 현',
    question: '점 A에서의 접선과 평행한 현 BC를 그으면 삼각형 ABC는 어떤 삼각형이 될까? 현의 높이를 바꿔 ∠BAT와 ∠ABC를 비교해 보자.',
    ctl: ['c6h'],
    init: (s) => { s.c6h = 40; },
    gen(rnd, n) { const kind = n % 3, t = pickR(rnd, [30, 35, 40, 45, 50, 55, 60]); return { kind, t, key: `p${kind}.${t}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: pcG(q.t) }; } return { g: pcG(clamp(s.c6h, 30, 70)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, Tt, T2 } = g;
      fit(b, { x0: -R * 1.2, x1: R * 1.2, y0: -R, y1: R + 0.8 }, { t: 62, b: 44, l: 44, r: 44 });
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      line(b, pt(-R * 1.2, R), pt(R * 1.2, R), 'ink', 3.2); line(b, B, Cc, 'ink', 3.4); line(b, A, B, 'ink', 3.2); line(b, A, Cc, 'ink', 3.2);
      G.par(b, pt(-R * 0.8, R), pt(R * 0.8, R), 1, 'amber', 0.85); G.par(b, B, Cc, 1, 'amber', 0.5);
      pname(b, A, Cc, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C');
      if (!C.txt) return;
      T(b, Tt, 'T', { dx: 8, dy: 18, size: 17 }); T(b, T2, "T′", { dx: -8, dy: 18, size: 17 });
      if (pr) {
        if (q.kind === 0) { ang(b, A, Tt, B, { color: 'sky', rings: 1, label: dgx(q.t), r: 34, size: S(b) }); ang(b, A, B, Cc, { color: 'rose', rings: 3, label: 'x', r: 26, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, A, B, Cc, { color: 'sky', rings: 3, label: dgx(180 - 2 * q.t), r: 26, size: S(b) }); ang(b, A, Tt, B, { color: 'rose', rings: 1, label: 'x', r: 34, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, B, A, Cc, { color: 'sky', rings: 2, label: dgx(q.t), r: 28, size: S(b) }); ang(b, Cc, A, B, { color: 'rose', rings: 2, label: 'x', r: 28, size: S(b) + 3 }); }
        return;
      }
      const t = g.t;
      ang(b, A, Tt, B, { color: 'rose', rings: 1, label: dgx(t), r: 34, size: S(b) });
      if (ex || st >= 1) ang(b, B, A, Cc, { color: 'rose', rings: 1, label: dgx(t), r: 26, size: S(b) - 1 });
      if (ex || st >= 2) ang(b, Cc, A, B, { color: 'rose', rings: 1, label: dgx(t), r: 26, size: S(b) - 1 });
      if (ex || st >= 3) ang(b, A, B, Cc, { color: 'green', rings: 3, label: dgx(180 - 2 * t), r: 26, size: S(b) - 1 });
    },
    steps: (M) => [
      `BC // TT′이므로 엇각이 같아요: $\\angle ABC=\\angle BAT=${fmtN(M.g.t)}^{\\circ}$.`,
      `같은 방법으로 $\\angle ACB=\\angle CAT^{\\prime}=${fmtN(M.g.t)}^{\\circ}$ (접선과 현이 이루는 각 = 원주각으로도 확인).`,
      '두 밑각이 같으므로 삼각형 ABC는 <b>AB=AC인 이등변삼각형</b>이에요.',
      `$\\angle BAC=180^{\\circ}-2\\times ${fmtN(M.g.t)}^{\\circ}=${fmtN(180 - 2 * M.g.t)}^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>현 BC의 높이</b>를 바꿔 보세요. BC가 접선과 평행하면 <b>AB=AC</b>이고 두 밑각은 ∠BAT와 같아요.',
      readouts: [rd('∠BAT = ∠ABC', dgx(M.g.t), 'rose', '엇각'), rd('∠ACB', dgx(M.g.t), 'rose', '= ∠ABC'), rd('∠BAC', dgx(180 - 2 * M.g.t), 'green', '180° − 2∠BAT')],
      rule: '원의 접선과 평행한 현을 한 변으로 하는 삼각형은 접점을 꼭짓점으로 하는 이등변삼각형이다',
      notes: notes('평행선의 <b>엇각</b>과 접선과 현이 이루는 각을 함께 써요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), t = q.t, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '직선 TT′는 원의 접선이고 점 A는 접점이며, $\\overline{BC}\\parallel\\overline{TT^{\\prime}}$이다.';
      if (q.kind === 0) {
        tag = '접선과 평행한 현 · ∠BAC'; ans = 180 - 2 * t; meas = angAt(g.A, g.B, g.C);
        stem = `${pre} $\\angle BAT=${t}^{\\circ}$일 때, $\\angle BAC$의 크기 $x$는?`;
        wr = [[2 * t, '삼각형 ABC는 이등변삼각형이에요. 두 밑각의 합을 빼요.'], [180 - t, '밑각이 두 개예요.'], [t, '∠BAC는 꼭지각이에요.'], [90 - t, '꼭지각=180°−2×밑각이에요.'], [180 - 2 * t + 10, '꼭지각=180°−2×밑각이에요.']];
      } else if (q.kind === 1) {
        tag = '접선과 평행한 현 · ∠BAT'; ans = t; meas = angAt(g.A, g.Tt, g.B);
        stem = `${pre} $\\angle BAC=${180 - 2 * t}^{\\circ}$일 때, $\\angle BAT$의 크기 $x$는?`;
        wr = [[180 - 2 * t, '이것은 ∠BAC예요. ∠BAT는 밑각과 같아요.'], [2 * t, '∠BAT=밑각=(180°−∠BAC)÷2예요.'], [90 - t, '∠BAT=밑각=(180°−∠BAC)÷2예요.'], [t + 10, '∠BAT=밑각=(180°−∠BAC)÷2예요.'], [t - 5, '∠BAT=밑각=(180°−∠BAC)÷2예요.']];
      } else {
        tag = '접선과 평행한 현 · ∠ACB'; ans = t; meas = angAt(g.C, g.A, g.B);
        stem = `${pre} $\\angle ABC=${t}^{\\circ}$일 때, $\\angle ACB$의 크기 $x$는?`;
        wr = [[180 - 2 * t, '이것은 ∠BAC예요. 삼각형 ABC는 이등변삼각형이에요.'], [2 * t, '밑각 ∠ACB=∠ABC예요.'], [90 - t, '밑각 ∠ACB=∠ABC예요.'], [t + 10, '밑각 ∠ACB=∠ABC예요.'], [180 - t, '밑각 ∠ACB=∠ABC예요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 5. 접선·현·이등변삼각형 */
  const isoG = (be) => { const a = 180 - be, A = pp(270), B = pp(270 + a), C = pp(270 + 2 * a); return { be, a, A, B, C, Tt: pt(R * 1.15, R), T2: pt(-R * 1.15, R) }; };
  const iso = {
    id: 'c6-5', title: '접선과 현, 이등변삼각형', short: '접선·현·이등변',
    question: '원에 내접하는 삼각형 ABC에서 AB=BC이고 점 A에서의 접선이 TT′일 때, ∠ABC를 알면 ∠BAT를 구할 수 있을까?',
    ctl: ['c6be'],
    init: (s) => { s.c6be = 64; },
    gen(rnd, n) { const kind = n % 3, be = pickR(rnd, [40, 44, 50, 56, 60, 64, 70, 76]); return { kind, be, key: `i${kind}.${be}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: isoG(q.be) }; } return { g: isoG(clamp(Math.round(s.c6be / 2) * 2, 40, 80)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, Tt, T2 } = g;
      fit(b, { x0: -R * 1.2, x1: R * 1.2, y0: -R, y1: R + 0.8 }, { t: 62, b: 44, l: 44, r: 44 });
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      line(b, pt(-R * 1.2, R), pt(R * 1.2, R), 'ink', 3.2); b.path([A, B, Cc], { close: true, color: 'ink', width: 3.4 });
      tick(b, A, B, 1, 'amber'); tick(b, B, Cc, 1, 'amber');
      pname(b, A, Cc, 'A'); pname(b, B, O, 'B'); pname(b, Cc, O, 'C');
      if (!C.txt) return;
      T(b, Tt, 'T', { dx: 8, dy: 18, size: 17 }); T(b, T2, "T′", { dx: -8, dy: 18, size: 17 });
      const bs = (180 - g.be) / 2;
      if (pr) {
        if (q.kind === 0) { ang(b, B, A, Cc, { color: 'sky', rings: 1, label: dgx(q.be), r: 28, size: S(b) }); ang(b, A, Tt, B, { color: 'rose', rings: 2, label: 'x', r: 34, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, B, A, Cc, { color: 'sky', rings: 1, label: dgx(q.be), r: 28, size: S(b) }); ang(b, Cc, A, B, { color: 'rose', rings: 2, label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, A, Tt, B, { color: 'sky', rings: 2, label: dgx(bs), r: 34, size: S(b) }); ang(b, A, B, Cc, { color: 'rose', rings: 1, label: 'x', r: 28, size: S(b) + 3 }); }
        return;
      }
      ang(b, B, A, Cc, { color: 'sky', rings: 1, label: dgx(g.be), r: 28, size: S(b) });
      if (ex || st >= 1) ang(b, Cc, A, B, { color: 'green', rings: 2, label: dgx(bs), r: 28, size: S(b) - 1 });
      if (ex || st >= 3) ang(b, A, Tt, B, { color: 'green', rings: 2, label: dgx(bs), r: 34, size: S(b) - 1 });
    },
    steps: (M) => [
      `$\\overline{AB}=\\overline{BC}$이므로 삼각형 ABC는 B가 꼭지각인 이등변삼각형이고, $\\angle BAC=\\angle BCA=\\frac{180^{\\circ}-${fmtN(M.g.be)}^{\\circ}}{2}=${fmtN((180 - M.g.be) / 2)}^{\\circ}$.`,
      '접선과 현이 이루는 각은 그 안쪽 호에 대한 원주각과 같아요. ∠BAT는 호 AB 쪽이므로 $\\angle BAT=\\angle ACB$.',
      `$\\angle BAT=\\angle ACB=${fmtN((180 - M.g.be) / 2)}^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠ABC</b>를 바꿔 보세요. AB=BC이므로 밑각 ∠ACB는 (180°−∠ABC)÷2이고, <b>∠BAT는 ∠ACB와 같아요</b>.',
      readouts: [rd('∠ABC', dgx(M.g.be), 'sky'), rd('∠ACB = ∠BAC', dgx((180 - M.g.be) / 2), 'green', '밑각'), rd('∠BAT', dgx((180 - M.g.be) / 2), 'rose', '= ∠ACB')],
      rule: '접선과 현이 이루는 각 ∠BAT = 호 AB에 대한 원주각 ∠ACB (이등변삼각형의 밑각)',
      notes: notes('∠BAT와 ∠BAC를 헷갈리지 마세요. ∠BAT는 <b>접선</b>과 현 AB가 이루는 각이에요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), be = q.be, bs = (180 - be) / 2, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '직선 TT′는 원의 접선이고 점 A는 접점이며, 삼각형 ABC는 이 원에 내접하고 $\\overline{AB}=\\overline{BC}$이다.';
      if (q.kind === 0) {
        tag = '접선·현·이등변 · ∠BAT'; ans = bs; meas = angAt(g.A, g.Tt, g.B);
        stem = `${pre} $\\angle ABC=${be}^{\\circ}$일 때, $\\angle BAT$의 크기 $x$는?`;
        wr = [[be, '이것은 ∠ABC예요.'], [180 - be, '밑각을 구한 뒤 ∠BAT=∠ACB를 써요.'], [be / 2, '밑각은 (180°−∠B)÷2예요.'], [bs + 10, '밑각은 (180°−∠B)÷2이고 ∠BAT=∠ACB예요.'], [90 + bs / 2 > 170 ? 100 : 90 + bs / 2, '∠BAT=∠ACB예요.']];
      } else if (q.kind === 1) {
        tag = '접선·현·이등변 · ∠ACB'; ans = bs; meas = angAt(g.C, g.A, g.B);
        stem = `${pre} $\\angle ABC=${be}^{\\circ}$일 때, $\\angle ACB$의 크기 $x$는?`;
        wr = [[be, '이것은 ∠ABC예요.'], [180 - be, '이등변삼각형의 밑각을 구해요.'], [be / 2, '밑각은 (180°−∠B)÷2예요.'], [bs + 10, '밑각은 (180°−∠B)÷2예요.'], [bs - 6, '밑각은 (180°−∠B)÷2예요.']];
      } else {
        tag = '접선·현·이등변 · ∠BAC'; ans = bs; meas = angAt(g.A, g.B, g.C);
        stem = `${pre} $\\angle BAT=${bs}^{\\circ}$일 때, $\\angle BAC$의 크기 $x$는?`;
        wr = [[be, '이것은 ∠ABC=180°−2×밑각이에요.'], [2 * bs, '∠BAC는 밑각이에요. ∠BAT=∠ACB=∠BAC.'], [180 - bs, '밑각 ∠BAC=∠ACB=∠BAT예요.'], [bs + 10, '밑각 ∠BAC=∠ACB=∠BAT예요.'], [90 - bs / 2, '밑각 ∠BAC=∠ACB=∠BAT예요.']];
      }
      return { tag, key, stem, choices: mkDeg(ans, wr), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 6~8. [심화] 방멱 */
  // 세 점 A,B,C 를 지나는 원의 중심
  function circum(A, B, C) {
    const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
    const ux = ((A.x ** 2 + A.y ** 2) * (B.y - C.y) + (B.x ** 2 + B.y ** 2) * (C.y - A.y) + (C.x ** 2 + C.y ** 2) * (A.y - B.y)) / d;
    const uy = ((A.x ** 2 + A.y ** 2) * (C.x - B.x) + (B.x ** 2 + B.y ** 2) * (A.x - C.x) + (C.x ** 2 + C.y ** 2) * (B.x - A.x)) / d;
    const c = pt(ux, uy); return { c, r: dist(c, A) };
  }
  const uvec = (deg) => pt(Math.cos(deg * DEG), -Math.sin(deg * DEG));
  const PW = [[2, 6, 3, 4], [3, 8, 4, 6], [4, 6, 3, 8], [2, 9, 3, 6], [4, 9, 6, 6], [3, 10, 5, 6], [2, 12, 4, 6], [4, 10, 5, 8], [2, 15, 3, 10], [3, 12, 4, 9], [6, 8, 4, 12], [5, 6, 3, 10]];
  const pwBox = (pts, cc) => { const bb = bboxOf(pts.concat([pt(cc.c.x - cc.r, cc.c.y - cc.r), pt(cc.c.x + cc.r, cc.c.y + cc.r)]), 0.5); return bb; };
  // 6. 원 안에서 만나는 두 현: P=(0,0). A=(-a,0), B=(b,0), 다른 현은 각도 φ
  const inG = (a, b, c) => { const d = (a * b) / c, u = uvec(55), A = pt(-a, 0), B = pt(b, 0), Cc = mul(u, -c), D = mul(u, d), cc = circum(A, B, Cc); return { a, b, c, d, A, B, C: Cc, D, P: pt(0, 0), cc }; };
  const pin = {
    id: 'c6-6', title: '[심화] 원 안에서 만나는 두 현의 길이', short: '[심화] 두 현의 교점',
    question: '원 안의 점 P에서 만나는 두 현 AB, CD에서 PA·PB와 PC·PD는 어떤 관계일까? PA, PB, PC를 바꿔 보자.',
    ctl: ['c6pa', 'c6pb', 'c6pc'],
    init: (s) => { s.c6pa = 4; s.c6pb = 6; s.c6pc = 3; },
    gen(rnd, n) { const [a, b, c, d] = pickR(rnd, PW), kind = n % 3; return { kind, a, b, c, d, key: `w${kind}.${a}.${b}.${c}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: inG(q.a, q.b, q.c) }; } return { g: inG(s.c6pa, s.c6pb, s.c6pc) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D, P: Pp, cc } = g;
      fit(b, pwBox([A, B, Cc, D], cc), { t: 62, b: 44, l: 44, r: 44 });
      circle(b, cc.c, cc.r, 'ink', 3.4, { fill: 'sky', fa: 0.04 });
      line(b, A, B, 'ink', 3.4); line(b, Cc, D, 'ink', 3.4);
      [A, B, Cc, D].forEach((p) => dot(b, p, 'ink', 4.6)); dot(b, Pp, 'amber', 5);
      if (!C.txt) return;
      tagOut(b, A, cc.c, 'A', { size: 17 }); tagOut(b, B, cc.c, 'B', { size: 17 }); tagOut(b, Cc, cc.c, 'C', { size: 17 }); tagOut(b, D, cc.c, 'D', { size: 17 }); T(b, Pp, 'P', { dx: 12, dy: 14, size: 17 });
      const away = pt(Pp.x + 3, Pp.y + 3);
      if (pr) {
        const L = (p1, p2, v) => segTag(b, p1, p2, v, { toward: away, color: 'sky', size: S(b), gap: 12 });
        L(A, Pp, q.kind === 1 ? 'x' : String(q.a)); L(Pp, B, q.kind === 2 ? 'x' : String(q.b)); L(Cc, Pp, String(q.c)); L(Pp, D, q.kind === 0 ? 'x' : String(q.d));
        return;
      }
      segTag(b, A, Pp, 'PA=' + cv(g.a), { toward: away, color: 'sky', size: S(b) - 1, gap: 12 }); segTag(b, Pp, B, 'PB=' + cv(g.b), { toward: away, color: 'sky', size: S(b) - 1, gap: 12 });
      segTag(b, Cc, Pp, 'PC=' + cv(g.c), { toward: away, color: 'green', size: S(b) - 1, gap: 12 }); segTag(b, Pp, D, 'PD=' + cv(g.d), { toward: away, color: 'green', size: S(b) - 1, gap: 12 });
    },
    steps: (M) => [
      '점 A와 D, 점 C와 B를 이어 삼각형 PAD와 PCB를 만들어요. ∠APD=∠CPB(맞꼭지각).',
      '∠PAD와 ∠PCB는 호 BD에 대한 원주각이므로 같아요. 두 쌍의 각이 같으므로 △PAD ∽ △PCB (AA 닮음).',
      '닮음비에서 $\\overline{PA}:\\overline{PC}=\\overline{PD}:\\overline{PB}$ → $\\overline{PA}\\cdot\\overline{PB}=\\overline{PC}\\cdot\\overline{PD}$.',
      `지금: $${fmtN(M.g.a)}\\times ${fmtN(M.g.b)}=${fmtN(M.g.a * M.g.b)}$, $${fmtN(M.g.c)}\\times ${nt(M.g.d)}=${nt(M.g.a * M.g.b)}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>PA, PB, PC</b>를 바꿔 보세요. PD는 늘 <b>PA·PB÷PC</b>로 정해지고 PA·PB와 PC·PD는 같아요. [심화]',
      readouts: [rd('PA·PB', fmtN(M.g.a * M.g.b), 'sky'), rd('PC·PD', fmtN(M.g.c * M.g.d), 'green', '늘 같아요'), rd('PD', ntD(M.g.d), 'rose', 'PA·PB÷PC')],
      rule: '[심화] 원 안의 한 점 P에서 만나는 두 현 AB, CD에 대하여 $PA\\cdot PB=PC\\cdot PD$',
      notes: notes('이 장면은 <b>심화</b>예요. 닮은 삼각형(AA)으로 설명해요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '원 안의 점 P에서 두 현 AB, CD가 만난다.';
      if (q.kind === 0) {
        tag = '[심화] 두 현의 교점 · PD'; ans = q.d; meas = dist(g.P, g.D);
        stem = `${pre} $\\overline{PA}=${q.a}$, $\\overline{PB}=${q.b}$, $\\overline{PC}=${q.c}$일 때, $\\overline{PD}$의 길이 $x$는?`;
        wr = [[q.a + q.b - q.c, 'PA·PB=PC·PD예요(곱).'], [q.c, 'PD를 구해야 해요. PA·PB=PC·PD.'], [q.a * q.b, '이것은 PA·PB예요. PD=PA·PB÷PC.'], [q.d + 1, 'PA·PB=PC·PD.'], [q.d + 2, 'PA·PB=PC·PD.']];
      } else if (q.kind === 1) {
        tag = '[심화] 두 현의 교점 · PA'; ans = q.a; meas = dist(g.A, g.P);
        stem = `${pre} $\\overline{PB}=${q.b}$, $\\overline{PC}=${q.c}$, $\\overline{PD}=${q.d}$일 때, $\\overline{PA}$의 길이 $x$는?`;
        wr = [[q.c * q.d / q.b + 1, 'PA·PB=PC·PD예요.'], [q.c + q.d - q.b, 'PA·PB=PC·PD예요(곱).'], [q.b, 'PA를 구해야 해요.'], [q.a + 1, 'PA·PB=PC·PD.'], [q.c * q.d, '이것은 PC·PD예요. PA=PC·PD÷PB.']];
      } else {
        tag = '[심화] 두 현의 교점 · PB'; ans = q.b; meas = dist(g.P, g.B);
        stem = `${pre} $\\overline{PA}=${q.a}$, $\\overline{PC}=${q.c}$, $\\overline{PD}=${q.d}$일 때, $\\overline{PB}$의 길이 $x$는?`;
        wr = [[q.c + q.d - q.a, 'PA·PB=PC·PD예요(곱).'], [q.a, 'PB를 구해야 해요.'], [q.c * q.d, '이것은 PC·PD예요. PB=PC·PD÷PA.'], [q.b + 1, 'PA·PB=PC·PD.'], [q.b + 2, 'PA·PB=PC·PD.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: '' }), chk: [meas, ans] };
    }
  };
  // 7. 원 밖에서 만나는 두 할선: P=(0,0). A=(a,0),B=(b,0) (a<b), C=c·u, D=d·u (c<d)
  const outG = (a, b, c) => { const d = (a * b) / c, u = uvec(35), A = pt(a, 0), B = pt(b, 0), Cc = mul(u, c), D = mul(u, d), cc = circum(A, B, Cc); return { a, b, c, d, A, B, C: Cc, D, P: pt(0, 0), cc }; };
  const POUT = [[3, 12, 4, 9], [4, 6, 3, 8], [4, 9, 3, 12], [6, 8, 4, 12], [5, 12, 4, 15], [4, 15, 5, 12], [3, 20, 6, 10], [6, 10, 4, 15], [5, 9, 3, 15]]; // PA<PB, PC<PD
  const pout = {
    id: 'c6-7', title: '[심화] 원 밖에서 만나는 두 할선', short: '[심화] 두 할선',
    question: '원 밖의 점 P에서 두 직선이 원과 A, B와 C, D에서 만난다. (A, C가 P에서 가까운 점) PA·PB와 PC·PD는 어떤 관계일까?',
    ctl: ['c6pa', 'c6pb', 'c6pc'],
    init: (s) => { s.c6pa = 3; s.c6pb = 8; s.c6pc = 4; },
    gen(rnd, n) { const [a, b, c, d] = pickR(rnd, POUT), kind = n % 3; return { kind, a, b, c, d, key: `u${kind}.${a}.${b}.${c}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: outG(q.a, q.b, q.c) }; } const a = Math.min(s.c6pa, s.c6pb - 1), b2 = Math.max(s.c6pb, a + 1); return { g: outG(a, b2, Math.min(s.c6pc, Math.max(2, Math.ceil(Math.sqrt(a * b2)) - 1))) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, D, P: Pp, cc } = g;
      fit(b, pwBox([A, B, Cc, D, Pp], cc), { t: 62, b: 44, l: 44, r: 44 });
      circle(b, cc.c, cc.r, 'ink', 3.4, { fill: 'sky', fa: 0.04 });
      line(b, Pp, B, 'ink', 3.4); line(b, Pp, D, 'ink', 3.4);
      [A, B, Cc, D].forEach((p) => dot(b, p, 'ink', 4.6)); dot(b, Pp, 'amber', 5);
      if (!C.txt) return;
      tagOut(b, A, cc.c, 'A', { size: 17 }); tagOut(b, B, cc.c, 'B', { size: 17 }); tagOut(b, Cc, cc.c, 'C', { size: 17 }); tagOut(b, D, cc.c, 'D', { size: 17 }); T(b, Pp, 'P', { dx: -14, dy: 6, size: 17 });
      const out = cc.c;
      const L = (p1, p2, v, col, f) => segTag(b, p1, p2, v, { away: out, f: f == null ? 0.5 : f, color: col || 'sky', size: S(b) - (pr ? 0 : 1), gap: 12 });
      if (pr) {
        if (q.kind !== 1) L(Pp, A, 'PA=' + q.a, 'sky', 0.45); else L(Pp, A, 'PA=x', 'sky', 0.45);
        if (q.kind !== 2) L(Pp, B, 'PB=' + q.b, 'sky', (q.a + q.b) / (2 * q.b));
        else segTag(b, A, B, 'x', { away: Pp, color: 'rose', size: S(b, 18), gap: 14 });
        L(Pp, Cc, 'PC=' + q.c, 'sky', 0.55); L(Pp, D, q.kind === 0 ? 'PD=x' : 'PD=' + q.d, 'sky', (q.c + q.d) / (2 * q.d));
        return;
      }
      L(Pp, A, 'PA=' + cv(g.a), 'sky', 0.45); L(Pp, B, 'PB=' + cv(g.b), 'sky', (g.a + g.b) / (2 * g.b)); L(Pp, Cc, 'PC=' + cv(g.c), 'green', 0.55); L(Pp, D, 'PD=' + cv(g.d), 'green', (g.c + g.d) / (2 * g.d));
    },
    steps: (M) => [
      '점 A와 D, 점 C와 B를 이어요. 삼각형 PAD와 PCB에서 ∠P는 공통이에요.',
      '내접사각형 ABDC에서 $\\angle PAD$의 외각 성질로 $\\angle PAD=\\angle PCB$. 두 각이 같으므로 △PAD ∽ △PCB.',
      '$\\overline{PA}:\\overline{PC}=\\overline{PD}:\\overline{PB}$ → $\\overline{PA}\\cdot\\overline{PB}=\\overline{PC}\\cdot\\overline{PD}$.',
      `지금: $${fmtN(M.g.a)}\\times ${fmtN(M.g.b)}=${fmtN(M.g.a * M.g.b)}$, $${fmtN(M.g.c)}\\times ${nt(M.g.d)}=${nt(M.g.a * M.g.b)}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>PA, PB, PC</b>를 바꿔 보세요. 원 밖의 점에서는 <b>가까운 점까지 × 먼 점까지</b>의 곱이 두 직선에서 같아요. [심화]',
      readouts: [rd('PA·PB', fmtN(M.g.a * M.g.b), 'sky'), rd('PC·PD', fmtN(M.g.c * M.g.d), 'green', '늘 같아요'), rd('PD', ntD(M.g.d), 'rose')],
      rule: '[심화] 원 밖의 한 점 P에서 원과 만나는 두 직선에 대하여 $PA\\cdot PB=PC\\cdot PD$',
      notes: notes('이 장면은 <b>심화</b>예요. 곱의 순서는 <b>가까운 점 × 먼 점</b>(PA×PB)이에요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '원 밖의 점 P에서 그은 두 직선이 원과 각각 A, B와 C, D에서 만난다. (A, C가 P에서 가까운 점)';
      if (q.kind === 0) {
        tag = '[심화] 두 할선 · PD'; ans = q.d; meas = dist(g.P, g.D);
        stem = `${pre} $\\overline{PA}=${q.a}$, $\\overline{PB}=${q.b}$, $\\overline{PC}=${q.c}$일 때, $\\overline{PD}$의 길이 $x$는?`;
        wr = [[q.a * q.b, '이것은 PA·PB예요. PD=PA·PB÷PC.'], [q.b - q.a + q.c, 'PA·PB=PC·PD예요(곱).'], [q.c, 'PD를 구해야 해요.'], [q.d + 1, 'PA·PB=PC·PD.'], [q.d + 2, 'PA·PB=PC·PD.']];
      } else if (q.kind === 1) {
        tag = '[심화] 두 할선 · PA'; ans = q.a; meas = dist(g.P, g.A);
        stem = `${pre} $\\overline{PB}=${q.b}$, $\\overline{PC}=${q.c}$, $\\overline{PD}=${q.d}$일 때, $\\overline{PA}$의 길이 $x$는?`;
        wr = [[q.c * q.d, '이것은 PC·PD예요. PA=PC·PD÷PB.'], [q.d - q.c + q.b, 'PA·PB=PC·PD예요(곱).'], [q.b, 'PA를 구해야 해요.'], [q.a + 1, 'PA·PB=PC·PD.'], [q.a + 2, 'PA·PB=PC·PD.']];
      } else {
        tag = '[심화] 두 할선 · AB'; ans = q.b - q.a; meas = dist(g.A, g.B);
        stem = `${pre} $\\overline{PA}=${q.a}$, $\\overline{PC}=${q.c}$, $\\overline{PD}=${q.d}$일 때, $\\overline{AB}$의 길이 $x$는?`;
        wr = [[q.b, '이것은 PB예요. AB=PB−PA.'], [q.a, '이것은 PA예요.'], [q.c * q.d / q.a * q.a, 'PA·PB=PC·PD로 PB를 먼저 구해요.'], [q.b - q.a + 1, 'AB=PB−PA예요.'], [q.b + q.a, 'AB=PB−PA예요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: '' }), chk: [meas, ans] };
    }
  };
  // 8. 접선과 할선: PT² = PA·PB
  const TS = [[2, 8, 4], [4, 9, 6], [3, 12, 6], [4, 16, 8], [5, 20, 10], [9, 16, 12], [8, 18, 12], [6, 24, 12], [2, 18, 6]]; // PA, PB, PT (PT²=PA·PB)
  const tsG = (a, b) => {
    // 점 P=(0,0), 할선은 x축 위. 원의 중심은 현 AB 의 수직이등분선 위(위쪽)에 둡니다.
    const A = pt(a, 0), B = pt(b, 0), t = Math.sqrt(a * b), Cc = pt(0, 0), rr = (b - a) / 2, yc = -rr * 0.9, c = pt((a + b) / 2, yc), r = Math.hypot(rr, yc);
    // 직각삼각형 PCT에서 P의 각은 sin(∠CPT)=r/PC로 구합니다.
    // 중심 C의 각을 사용하면 PT 길이는 맞아도 T가 원 위에 놓이지 않습니다.
    const d = Math.hypot(c.x, c.y), th = Math.atan2(c.y, c.x) / DEG, al = Math.asin(clamp(r / d, -1, 1)) / DEG, Tt = add(Cc, mul(pt(Math.cos((th - al) * DEG), Math.sin((th - al) * DEG)), Math.sqrt(d * d - r * r)));
    return { a, b, t, A, B, P: Cc, T: Tt, c, r, pt: Math.sqrt(d * d - r * r) };
  };
  const tsc = {
    id: 'c6-8', title: '[심화] 접선과 할선의 길이', short: '[심화] 접선과 할선',
    question: '원 밖의 점 P에서 접선 PT와 할선 PAB를 그으면 PT²는 PA·PB와 어떤 관계일까? PA, PB를 바꿔 보자.',
    ctl: ['c6pa', 'c6pb'],
    init: (s) => { s.c6pa = 4; s.c6pb = 9; },
    gen(rnd, n) { const [a, b, t] = pickR(rnd, TS), kind = n % 3; return { kind, a, b, t, key: `s${kind}.${a}.${b}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: tsG(q.a, q.b) }; } const a = Math.min(s.c6pa, s.c6pb - 1); return { g: tsG(a, Math.max(s.c6pb, a + 1)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, P: Pp, T: Tt, c, r } = g;
      fit(b, bboxOf([A, B, Pp, Tt, pt(c.x - r, c.y - r), pt(c.x + r, c.y + r)], 0.5), { t: 62, b: 44, l: 44, r: 44 });
      circle(b, c, r, 'ink', 3.4, { fill: 'sky', fa: 0.04 });
      line(b, Pp, B, 'ink', 3.4); line(b, Pp, Tt, 'ink', 3.4);
      [A, B, Tt].forEach((p) => dot(b, p, 'ink', 4.6)); dot(b, Pp, 'amber', 5);
      if (!pr && (ex || st >= 1)) { line(b, Tt, A, 'green', 2.4, { dash: [6, 5] }); line(b, Tt, B, 'green', 2.4, { dash: [6, 5] }); }
      if (!C.txt) return;
      tagOut(b, A, c, 'A', { size: 17 }); tagOut(b, B, c, 'B', { size: 17 }); tagOut(b, Tt, c, 'T', { size: 17 }); T(b, Pp, 'P', { dx: -14, dy: 6, size: 17 });
      if (pr) {
        segTag(b, Pp, A, q.kind === 1 ? 'PA=x' : 'PA=' + q.a, { toward: c, color: 'sky', size: S(b), gap: 12 });
        if (q.kind !== 2) segTag(b, Pp, B, 'PB=' + q.b, { toward: c, f: 0.7, color: 'sky', size: S(b), gap: 12 });
        else segTag(b, A, B, 'x', { toward: c, color: 'rose', size: S(b, 18), gap: 14 });
        segTag(b, Pp, Tt, q.kind === 0 ? 'PT=x' : 'PT=' + q.t, { away: c, color: 'sky', size: S(b), gap: 12 });
        return;
      }
      segTag(b, Pp, A, 'PA=' + cv(g.a), { toward: c, color: 'sky', size: S(b) - 1, gap: 12 }); segTag(b, Pp, B, 'PB=' + cv(g.b), { toward: c, f: 0.7, color: 'sky', size: S(b) - 1, gap: 12 }); segTag(b, Pp, Tt, 'PT=' + cv(g.t), { away: c, color: 'green', size: S(b) - 1, gap: 12 });
    },
    steps: (M) => [
      '점 T와 A, T와 B를 이어요. 삼각형 PTA와 PBT에서 ∠P는 공통이에요.',
      '접선과 현이 이루는 각이므로 $\\angle PTA=\\angle PBT$. 두 각이 같으므로 △PTA ∽ △PBT.',
      '$\\overline{PT}:\\overline{PB}=\\overline{PA}:\\overline{PT}$ → $\\overline{PT}^2=\\overline{PA}\\cdot\\overline{PB}$.',
      `지금: $\\overline{PT}^2=${fmtN(M.g.a)}\\times ${fmtN(M.g.b)}=${fmtN(M.g.a * M.g.b)}$, $\\overline{PT}=${nt(M.g.t)}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>PA, PB</b>를 바꿔 보세요. 접선의 길이 PT는 늘 <b>√(PA·PB)</b>예요. [심화]',
      readouts: [rd('PA·PB', fmtN(M.g.a * M.g.b), 'sky'), rd('PT²', fmtN(M.g.t * M.g.t), 'green', '늘 같아요'), rd('PT', ntD(M.g.t), 'rose', '√(PA·PB)')],
      rule: '[심화] 원 밖의 점 P에서 접선 PT와 할선 PAB에 대하여 $PT^2=PA\\cdot PB$',
      notes: notes('이 장면은 <b>심화</b>예요. 접선과 현이 이루는 각으로 닮음을 찾아요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '원 밖의 점 P에서 원에 그은 접선의 접점을 T, 할선이 원과 만나는 두 점을 A, B라 하자. (A가 P에서 더 가까운 점)';
      if (q.kind === 0) {
        tag = '[심화] 접선과 할선 · PT'; ans = q.t; meas = dist(g.P, g.T);
        stem = `${pre} $\\overline{PA}=${q.a}$, $\\overline{PB}=${q.b}$일 때, $\\overline{PT}$의 길이 $x$는?`;
        wr = [[q.a * q.b, '이것은 PT²이에요. PT=√(PA·PB).'], [q.b - q.a, 'PT²=PA·PB예요.'], [(q.a + q.b) / 2 + 1, 'PT²=PA·PB예요.'], [q.t + 1, 'PT²=PA·PB.'], [q.t + 2, 'PT²=PA·PB.']];
      } else if (q.kind === 1) {
        tag = '[심화] 접선과 할선 · PA'; ans = q.a; meas = dist(g.P, g.A);
        stem = `${pre} $\\overline{PT}=${q.t}$, $\\overline{PB}=${q.b}$일 때, $\\overline{PA}$의 길이 $x$는?`;
        wr = [[q.t * q.t, '이것은 PT²이에요. PA=PT²÷PB.'], [q.b - q.t, 'PT²=PA·PB예요(곱).'], [q.t, 'PA를 구해야 해요.'], [q.a + 1, 'PT²=PA·PB.'], [q.a + 2, 'PT²=PA·PB.']];
      } else {
        tag = '[심화] 접선과 할선 · AB'; ans = q.b - q.a; meas = dist(g.A, g.B);
        stem = `${pre} $\\overline{PT}=${q.t}$, $\\overline{PA}=${q.a}$일 때, $\\overline{AB}$의 길이 $x$는?`;
        wr = [[q.b, '이것은 PB예요. AB=PB−PA.'], [q.a, '이것은 PA예요.'], [q.t * q.t / q.a - q.a + 1, 'PB=PT²÷PA를 구한 뒤 PB−PA예요.'], [q.b - q.a + 1, 'AB=PB−PA예요.'], [q.t * q.t, '이것은 PT²이에요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: '' }), chk: [meas, ans] };
    }
  };

  G.register(60, 'c6', '접선과 현', '접선과 현', PARAMS, [alt, both, kill, parl, iso, pin, pout, tsc]);
})();
