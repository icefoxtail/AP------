/* ==========================================================================
   중3 · 원의 성질 — 탭 ③ 「내접원·외접사각형」 (t3.js, order 30) — 장면 6개
   · c3-1 삼각형의 내접원과 접선의 길이   · AD=AF=x, BD=BE=y, CE=CF=z, 세 변 = x+y, y+z, z+x
   · c3-2 직각삼각형의 내접원             · r = (a+b−c)/2
   · c3-3 내접원과 삼각형의 넓이          · 넓이 = ½·r·(둘레)
   · c3-4 원에 외접하는 사각형            · AB+CD = AD+BC
   · c3-5 원에 외접하는 직각사다리꼴      · AD·BC = r(AD+BC)
   · c3-6 반원과 직각사다리꼴             · CD = AD+BC, AB = 2√(AD·BC)
   값은 모두 지금의 길이·각으로 다시 계산됩니다. 같은 길이의 접선은 같은 눈금으로 표시해요.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, lerp, mp, T, tick, line, fit, P, rd, notes, fmtN, circle, dot, segTag, tagOut, ang, cv, nt, ntD, mkNum, mkPi, sz, fillPoly, degOf, mkChoices } = G;
  const lenF = (v) => fmtN(v);
  const pickR = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
  const S = (b, a = 16) => sz(b, a);

  const PARAMS = {
    c3a: P('변 BC', 4, 14, 1, 10, { color: 'sky', format: lenF }),
    c3b: P('변 CA', 4, 14, 1, 12, { color: 'green', format: lenF }),
    c3c: P('변 AB', 4, 14, 1, 14, { color: 'amber', format: lenF }),
    c3p: P('직각을 낀 변 AB', 3, 15, 1, 6, { color: 'sky', format: lenF }),
    c3q: P('직각을 낀 변 BC', 3, 15, 1, 8, { color: 'green', format: lenF }),
    c3x: P('아크 α (A–B 사이)', 50, 130, 5, 90, { color: 'sky', format: (v) => fmtN(v) + '°' }),
    c3y: P('아크 β (B–C 사이)', 50, 130, 5, 80, { color: 'green', format: (v) => fmtN(v) + '°' }),
    c3z: P('아크 γ (C–D 사이)', 50, 130, 5, 100, { color: 'amber', format: (v) => fmtN(v) + '°' }),
    c3ad: P('윗변 AD', 1, 16, 1, 4, { color: 'sky', format: lenF }),
    c3bc: P('아랫변 BC', 1, 16, 1, 9, { color: 'amber', format: lenF }),
    c3w: P('윗변 AD', 3, 16, 1, 6, { color: 'sky', format: lenF }),
    c3v: P('아랫변 BC', 3, 20, 1, 12, { color: 'amber', format: lenF })
  };

  /* ---- 삼각형과 내접원: B 왼쪽 아래, C 오른쪽 아래, A 위 (y 아래쪽) ---- */
  function triG(a, b, c) {
    const B = pt(0, 0), C = pt(a, 0), xA = (a * a + c * c - b * b) / (2 * a), yA = -Math.sqrt(Math.max(1e-9, c * c - xA * xA)), A = pt(xA, yA);
    const s = (a + b + c) / 2, area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c))), r = area / s;
    const I = mul(add(add(mul(A, a), mul(B, b)), mul(C, c)), 1 / (a + b + c));
    const D = lerp(A, B, (s - a) / c), E = lerp(B, C, (s - b) / a), F = lerp(C, A, (s - c) / b);
    return { a, b, c, A, B, C, I, r, s, area, D, E, F, x: s - a, y: s - b, z: s - c };
  }
  const clampTri = (s) => { const a = clamp(Math.round(s.c3a), 4, 14); let b = clamp(Math.round(s.c3b), 4, 14), c = clamp(Math.round(s.c3c), 4, 14); b = clamp(b, Math.max(4, Math.abs(a - c) + 3), Math.min(14, a + c - 3)); c = clamp(c, Math.max(4, Math.abs(a - b) + 3), Math.min(14, a + b - 3)); s.c3a = a; s.c3b = b; s.c3c = c; return [a, b, c]; };
  const triFit = (b, g, C) => fit(b, { x0: Math.min(0, g.A.x) - 0.2, x1: Math.max(g.a, g.A.x) + 0.2, y0: g.A.y - 0.2, y1: 0.2 }, { t: 60, b: 46, l: 56, r: 64 });
  const inName = (b, p, I, name, size = 16) => (dist(p, I) * (b.k || 60) < 50 ? tagOut(b, p, I, name, { size, gap: 13 }) : tagOut(b, p, add(p, sub(p, I)), name, { size, gap: 15 }));
  const triNames = (b, g) => { tagOut(b, g.A, g.I, 'A', { size: 17 }); tagOut(b, g.B, g.I, 'B', { size: 17 }); tagOut(b, g.C, g.I, 'C', { size: 17 }); inName(b, g.D, g.I, 'D'); inName(b, g.E, g.I, 'E'); inName(b, g.F, g.I, 'F'); T(b, g.I, 'O', { dx: 0, dy: -16, size: 16 }); };
  function drawTri(b, g, o) {
    fillPoly(b, [g.A, g.B, g.C], 'sky', 0.05);
    circle(b, g.I, g.r, 'ink', 3.2, { fill: 'green', fa: 0.06 });
    b.path([g.A, g.B, g.C], { close: true, color: 'ink', width: 3.6 });
    if (o.ticks) { tick(b, g.A, g.D, 1, 'amber'); tick(b, g.A, g.F, 1, 'amber'); tick(b, g.B, g.D, 2, 'amber'); tick(b, g.B, g.E, 2, 'amber'); tick(b, g.C, g.E, 3, 'amber'); tick(b, g.C, g.F, 3, 'amber'); }
    [g.A, g.B, g.C].forEach((p) => dot(b, p, 'ink', 4.6)); [g.D, g.E, g.F].forEach((p) => dot(b, p, 'amber', 4.6)); dot(b, g.I, 'ink', 4.2);
  }

  /* ====================================================================== 1. 삼각형의 내접원과 접선의 길이 */
  const inc = {
    id: 'c3-1', title: '삼각형의 내접원과 접선의 길이', short: '내접원과 접선의 길이',
    question: '원 O가 삼각형 ABC의 세 변에 접하고 D, E, F는 접점이다. 꼭짓점에서 접점까지의 길이 AD, BD, CE를 x, y, z라 하면 세 변의 길이는 x, y, z로 어떻게 나타날까?',
    ctl: ['c3a', 'c3b', 'c3c'],
    init: (s) => { s.c3a = 10; s.c3b = 12; s.c3c = 14; clampTri(s); },
    gen(rnd, n) { const kind = n % 3; let x = 2 + Math.floor(rnd() * 6), y = 2 + Math.floor(rnd() * 6), z = 2 + Math.floor(rnd() * 6); if (x === y && y === z) z += 1; return { kind, x, y, z, key: `t${kind}.${x}.${y}.${z}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, g: triG(q.y + q.z, q.x + q.z, q.x + q.y) }; }
      const [a, b, c] = clampTri(s); return { g: triG(a, b, c) };
    },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      triFit(b, g, C);
      drawTri(b, g, { ticks: !pr && (ex || st >= 1) });
      if (!C.txt) return;
      triNames(b, g);
      const out = g.I;
      if (pr) {
        const L = (p1, p2, v) => segTag(b, p1, p2, v, { away: out, color: 'sky', size: S(b), gap: 12 });
        if (q.kind === 0) { L(g.B, g.C, String(g.a)); L(g.C, g.A, String(g.b)); L(g.A, g.B, String(g.c)); T(b, g.D, '', {}); segTag(b, g.A, g.D, 'x', { away: out, gap: 12 }); }
        if (q.kind === 1) { L(g.B, g.C, String(g.a)); L(g.C, g.A, String(g.b)); segTag(b, g.B, g.D, String(q.y), { away: out, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.A, g.D, 'x', { away: out, gap: 12 }); }
        if (q.kind === 2) { segTag(b, g.A, g.D, String(q.x), { away: out, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.B, g.E, String(q.y), { away: out, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.C, g.F, String(q.z), { away: out, color: 'sky', size: S(b), gap: 12 }); T(b, mid(g.B, g.C), '둘레=x', { dy: 46, size: S(b) + 3 }); }
        return;
      }
      if (ex || st >= 1) { segTag(b, g.A, g.D, 'x=' + cv(g.x), { away: out, color: 'amber', size: S(b) - 1, gap: 12 }); segTag(b, g.B, g.E, 'y=' + cv(g.y), { away: out, color: 'amber', size: S(b) - 1, gap: 12 }); segTag(b, g.C, g.F, 'z=' + cv(g.z), { away: out, color: 'amber', size: S(b) - 1, gap: 12 }); }
      if (ex || st >= 2) { segTag(b, g.B, g.C, 'a=' + cv(g.a), { away: g.I, color: 'sky', size: S(b) - 1, gap: 36 }); }
    },
    steps: (M) => {
      const g = M.g;
      return [
        '같은 점에서 원에 그은 두 접선의 길이는 같아요. $\\overline{AD}=\\overline{AF}=x$, $\\overline{BD}=\\overline{BE}=y$, $\\overline{CE}=\\overline{CF}=z$.',
        '세 변을 x, y, z로 나타내면 $\\overline{AB}=x+y$, $\\overline{BC}=y+z$, $\\overline{CA}=z+x$.',
        `세 식을 더하면 $\\overline{AB}+\\overline{BC}+\\overline{CA}=2(x+y+z)$이므로 $x+y+z=${nt(g.s)}$.`,
        `$x=(x+y+z)-\\overline{BC}=${nt(g.x)}$, $y=${nt(g.y)}$, $z=${nt(g.z)}$.`
      ];
    },
    view: (M) => {
      const g = M.g;
      return {
        guide: '막대로 <b>세 변의 길이</b>를 바꿔 보세요. 접점까지의 길이 x, y, z는 세 변의 길이로 바로 정해져요: <b>x = (AB+CA−BC)÷2</b>.',
        readouts: [rd('x = AD = AF', ntD(g.x), 'amber'), rd('y = BD = BE', ntD(g.y), 'amber'), rd('z = CE = CF', ntD(g.z), 'amber'), rd('x+y+z', ntD(g.s), 'green', '둘레의 절반')],
        rule: '삼각형의 내접원: 각 꼭짓점에서 두 접점까지의 길이가 같다. $x=\\frac{AB+CA-BC}{2}$',
        notes: notes('| (한 줄) 눈금은 A에서, || (두 줄)은 B에서, ||| (세 줄)은 C에서 그은 접선 길이예요.', '삼각형이 되려면 두 변의 합이 나머지 한 변보다 길어야 해요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { x, y, z } = q, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '원 O가 삼각형 ABC의 세 변에 접하고 D, E, F는 접점이다.';
      if (q.kind === 0) {
        tag = '내접원 · 접선의 길이 AD'; ans = x; meas = dist(g.A, g.D);
        stem = `${pre} $\\overline{AB}=${x + y}$, $\\overline{BC}=${y + z}$, $\\overline{CA}=${x + z}$일 때, $\\overline{AD}$의 길이 $x$는?`;
        wr = [[y, '이것은 BD예요.'], [z, '이것은 CE예요.'], [x + y + z, '이것은 둘레의 절반이에요. AD=(AB+CA−BC)÷2예요.'], [(x + y + z) * 2, '둘레예요.'], [Math.abs(x + y - (y + z)) + 1, 'AD=(AB+CA−BC)÷2를 써요.']];
      } else if (q.kind === 1) {
        tag = '내접원 · 접선의 길이로 AD'; ans = x; meas = dist(g.A, g.D);
        stem = `${pre} $\\overline{BC}=${y + z}$, $\\overline{CA}=${x + z}$, $\\overline{BD}=${y}$일 때, $\\overline{AD}$의 길이 $x$는? (단, 점 D는 변 AB 위의 접점)`;
        wr = [[z, '이것은 CE예요. BE=BD를 이용해 CE부터 구해요.'], [y, '이것은 BD예요.'], [x + z, '이것은 CA예요.'], [x + y, '이것은 AB예요.'], [Math.abs(x - 1) + 1 + y, 'CE=BC−BE, CF=CE, AF=CA−CF예요.']];
      } else {
        tag = '내접원 · 둘레'; ans = 2 * (x + y + z); meas = g.a + g.b + g.c;
        stem = `${pre} $\\overline{AD}=${x}$, $\\overline{BE}=${y}$, $\\overline{CF}=${z}$일 때, 삼각형 ABC의 둘레의 길이 $x$는?`;
        wr = [[x + y + z, '둘레는 2(x+y+z)예요.'], [3 * (x + y + z), '둘레는 2(x+y+z)예요.'], [2 * (x + y + z) - 2, '둘레=2(x+y+z)예요.'], [2 * (x + y + z) + 2, '둘레=2(x+y+z)예요.'], [4 * (x + y + z), '둘레는 2(x+y+z)예요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm', pad: 2 }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 2. 직각삼각형의 내접원 */
  const rtG = (p, q) => {
    const h = Math.hypot(p, q), r = (p + q - h) / 2, A = pt(0, -p), B = pt(0, 0), C = pt(q, 0), I = pt(r, -r);
    return { p, q, h, r, A, B, C, I, D: pt(0, -r), E: pt(r, 0), F: lerp(A, C, (p - r) / h) };
  };
  const RT = [[6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15], [12, 16, 20], [16, 12, 20], [7, 24, 25], [15, 20, 25], [20, 15, 25]];
  const rt = {
    id: 'c3-2', title: '직각삼각형의 내접원', short: '직각삼각형의 내접원',
    question: '∠B=90°인 직각삼각형 ABC의 내접원 반지름 r은 세 변의 길이로 어떻게 구할까? 두 변의 길이를 바꿔 보자.',
    ctl: ['c3p', 'c3q'],
    init: (s) => { s.c3p = 6; s.c3q = 8; },
    gen(rnd, n) { const [p, q, h] = pickR(rnd, RT), kind = n % 3; return { kind, p, q, h, key: `r${kind}.${p}.${q}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: rtG(q.p, q.q) }; } return { g: rtG(clamp(Math.round(s.c3p), 3, 15), clamp(Math.round(s.c3q), 3, 15)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { A, B, C: Cc, I, r } = g;
      fit(b, { x0: -0.3, x1: g.q + 0.3, y0: -g.p - 0.3, y1: 0.3 }, { t: 60, b: 46, l: 40, r: 40 });
      fillPoly(b, [A, B, Cc], 'sky', 0.05);
      circle(b, I, r, 'ink', 3.2, { fill: 'green', fa: 0.07 });
      b.path([A, B, Cc], { close: true, color: 'ink', width: 3.6 });
      b.right(B, A, Cc, { size: 14, color: 'amber' });
      if (ex || pr || st >= 1) { line(b, I, g.D, 'green', 2.6); line(b, I, g.E, 'green', 2.6); line(b, I, g.F, 'green', 2.6); }
      if (ex || st >= 1) fillPoly(b, [B, g.D, I, g.E], 'green', 0.12);
      [A, B, Cc].forEach((p) => dot(b, p, 'ink', 4.6)); [g.D, g.E, g.F].forEach((p) => dot(b, p, 'amber', 4.4)); dot(b, I, 'ink', 4.2);
      if (!C.txt) return;
      tagOut(b, A, I, 'A', { size: 17 }); tagOut(b, B, I, 'B', { size: 17 }); tagOut(b, Cc, I, 'C', { size: 17 }); T(b, I, 'O', { dx: 0, dy: -16, size: 16 });
      const sg = dist(g.D, I) * (b.k || 60) < 50 ? 28 : 12;
      inName(b, g.D, I, 'D'); inName(b, g.E, I, 'E'); inName(b, g.F, I, 'F');
      if (pr) {
        segTag(b, A, B, q.kind === 1 ? String(q.p) : String(q.p), { away: I, color: 'sky', size: S(b), gap: sg });
        segTag(b, B, Cc, q.kind === 0 ? String(q.q) : '', { away: I, color: 'sky', size: S(b), gap: sg });
        if (q.kind === 1) segTag(b, A, Cc, String(q.h), { away: I, color: 'sky', size: S(b), gap: sg });
        if (q.kind === 2) segTag(b, A, Cc, 'x', { away: I, gap: sg });
        segTag(b, I, g.E, q.kind === 2 ? String((q.p + q.q - q.h) / 2) : 'x', { toward: pt(g.E.x + 3, g.E.y - 3), color: 'sky', gap: 10, size: S(b) });
        return;
      }
      segTag(b, A, B, cv(g.p), { away: I, color: 'sky', size: S(b), gap: sg }); segTag(b, B, Cc, cv(g.q), { away: I, color: 'sky', size: S(b), gap: sg }); segTag(b, A, Cc, cv(g.h), { away: I, color: 'sky', size: S(b), gap: sg });
      if (ex || st >= 1) T(b, mid(I, g.E), 'r=' + cv(r), { dx: 14, dy: -2, size: S(b) - 1, color: 'rose' });
    },
    steps: (M) => {
      const g = M.g;
      return [
        `빗변의 길이는 피타고라스 정리로 $\\overline{AC}=\\sqrt{${g.p}^2+${g.q}^2}=${nt(g.h)}$.`,
        '내접원의 중심 O에서 접점 D, E에 반지름을 그으면 □BDOE는 한 변이 r인 정사각형이에요. 그래서 $\\overline{BD}=\\overline{BE}=r$.',
        `같은 접선 길이로 $\\overline{AF}=\\overline{AD}=${g.p}-r$, $\\overline{CF}=\\overline{CE}=${g.q}-r$.`,
        `$\\overline{AC}=\\overline{AF}+\\overline{CF}$이므로 $${nt(g.h)}=(${g.p}-r)+(${g.q}-r)$ → $r=\\frac{AB+BC-AC}{2}=${nt(g.r)}$.`
      ];
    },
    view: (M) => {
      const g = M.g;
      return {
        guide: '막대로 <b>두 직각변의 길이</b>를 바꿔 보세요. 반지름 r은 <b>(두 직각변의 합 − 빗변) ÷ 2</b>예요.',
        readouts: [rd('빗변 AC', ntD(g.h), 'sky'), rd('r', ntD(g.r), 'rose', '(AB+BC−AC)÷2'), rd('BD = BE', ntD(g.r), 'amber', '= r')],
        rule: '직각삼각형의 내접원의 반지름 $r=\\frac{a+b-c}{2}$ (a, b: 직각을 낀 두 변, c: 빗변)',
        notes: notes('□BDOE가 <b>정사각형</b>이라서 BD=BE=r이에요.', '넓이를 써서 $r=\\frac{ab}{a+b+c}$로 구할 수도 있어요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { p, q: qq, h } = q, g = M.g, r = (p + qq - h) / 2;
      let stem, ans, wr, meas, tag;
      const pre = '∠B=90°인 직각삼각형 ABC의 내접원 O가 세 변에 접한다.';
      if (q.kind === 0) {
        tag = '직각삼각형의 내접원 · r'; ans = r; meas = g.r;
        stem = `${pre} $\\overline{AB}=${p}$, $\\overline{BC}=${qq}$일 때, 내접원 O의 반지름의 길이 $x$는?`;
        wr = [[(p + qq) / 2, '빗변을 빼야 해요. r=(AB+BC−AC)÷2예요.'], [h - r, 'r=(AB+BC−AC)÷2예요.'], [p * qq / (2 * r) || 1, 'r=(AB+BC−AC)÷2예요.'], [r + 1, 'r=(AB+BC−AC)÷2예요.'], [r * 2, '반지름은 지름의 절반이에요. r=(AB+BC−AC)÷2예요.']];
      } else if (q.kind === 1) {
        tag = '직각삼각형의 내접원 · 빗변과 한 변으로 r'; ans = r; meas = g.r;
        stem = `${pre} $\\overline{AB}=${p}$, $\\overline{AC}=${h}$일 때, 내접원 O의 반지름의 길이 $x$는?`;
        wr = [[(p + h) / 2 - 1, 'BC를 먼저 피타고라스 정리로 구해요.'], [h - p, '먼저 BC를 구한 뒤 r=(AB+BC−AC)÷2를 써요.'], [qq, '이것은 BC예요.'], [r + 1, 'BC=√(AC²−AB²)를 구한 뒤 r=(AB+BC−AC)÷2예요.'], [r * 2, 'r=(AB+BC−AC)÷2예요.']];
      } else {
        tag = '직각삼각형의 내접원 · 빗변'; ans = h; meas = dist(g.A, g.C);
        stem = `${pre} 내접원의 반지름이 ${r}이고 $\\overline{AB}=${p}$일 때, 빗변 $\\overline{AC}$의 길이 $x$는?`;
        wr = [[p + r, '빗변은 (AB−r)+(BC−r)로 나타나요.'], [p + qq, '이것은 AB+BC예요. 빗변은 그보다 짧아요.'], [h + 1, 'AC=(AB−r)+(BC−r), AC²=AB²+BC²를 연립해요.'], [h - 1, 'AC=(AB−r)+(BC−r), AC²=AB²+BC²를 연립해요.'], [qq, '이것은 BC예요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 3. 내접원과 삼각형의 넓이 */
  const HER = [[13, 14, 15, 4], [5, 12, 13, 2], [6, 8, 10, 2], [9, 10, 17, 2], [8, 15, 17, 3], [9, 12, 15, 3], [7, 15, 20, 2], [12, 16, 20, 4], [10, 24, 26, 4]];
  const areaS = {
    id: 'c3-3', title: '내접원과 삼각형의 넓이', short: '내접원과 넓이',
    question: '삼각형 ABC의 넓이는 내접원의 반지름 r과 둘레로 어떻게 나타낼 수 있을까? 세 변을 바꿔 가며 넓이를 두 가지 방법으로 비교해 보자.',
    ctl: ['c3a', 'c3b', 'c3c'],
    init: (s) => { s.c3a = 13; s.c3b = 14; s.c3c = 15; clampTri(s); },
    gen(rnd, n) { const [a, b, c, r] = pickR(rnd, HER), kind = n % 3; return { kind, a, b, c, r, key: `s${kind}.${a}.${b}.${c}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, g: triG(q.a, q.b, q.c) }; }
      const [a, b, c] = clampTri(s); return { g: triG(a, b, c) };
    },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      triFit(b, g, C);
      fillPoly(b, [g.A, g.B, g.C], 'sky', 0.05);
      circle(b, g.I, g.r, 'ink', 3.2, { fill: 'green', fa: 0.06 });
      b.path([g.A, g.B, g.C], { close: true, color: 'ink', width: 3.6 });
      if (ex || pr || st >= 1) { line(b, g.I, g.D, 'green', 2.4); line(b, g.I, g.E, 'green', 2.4); line(b, g.I, g.F, 'green', 2.4); }
      if (ex || st >= 2) { line(b, g.I, g.A, 'rose', 1.8, { dash: [5, 5], alpha: 0.8 }); line(b, g.I, g.B, 'rose', 1.8, { dash: [5, 5], alpha: 0.8 }); line(b, g.I, g.C, 'rose', 1.8, { dash: [5, 5], alpha: 0.8 }); }
      [g.A, g.B, g.C].forEach((p) => dot(b, p, 'ink', 4.6)); [g.D, g.E, g.F].forEach((p) => dot(b, p, 'amber', 4.2)); dot(b, g.I, 'ink', 4.2);
      if (!C.txt) return;
      tagOut(b, g.A, g.I, 'A', { size: 17 }); tagOut(b, g.B, g.I, 'B', { size: 17 }); tagOut(b, g.C, g.I, 'C', { size: 17 });
      T(b, g.I, 'O', { dx: -13, dy: -13, size: 16 });
      const rr = pt(g.I.x, (g.I.y + g.E.y) / 2);
      if (pr) {
        segTag(b, g.B, g.C, String(q.a), { away: g.I, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.C, g.A, String(q.b), { away: g.I, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.A, g.B, String(q.c), { away: g.I, color: 'sky', size: S(b), gap: 12 });
        segTag(b, g.I, g.E, q.kind === 1 ? String(q.r) : 'x', { toward: pt(g.E.x + 4, g.E.y - 4), color: 'sky', size: S(b), gap: 10 });
        if (q.kind === 1) T(b, mid(g.B, g.C), '넓이=x', { dy: 46, size: S(b) });
        else T(b, mid(g.B, g.C), `넓이=${cv(g.area)}`, { dy: 46, size: S(b), color: 'sky' });
        return;
      }
      segTag(b, g.B, g.C, cv(g.a), { away: g.I, color: 'sky', size: S(b) - 1, gap: 12 }); segTag(b, g.C, g.A, cv(g.b), { away: g.I, color: 'sky', size: S(b) - 1, gap: 12 }); segTag(b, g.A, g.B, cv(g.c), { away: g.I, color: 'sky', size: S(b) - 1, gap: 12 });
      if (ex || st >= 1) T(b, rr, 'r', { dx: 13, size: S(b), color: 'rose' });
    },
    steps: (M) => {
      const g = M.g;
      return [
        `내접원의 중심 O에서 세 접점에 반지름 r을 그으면 각 변에 수직이에요(접선 ⊥ 반지름).`,
        '세 꼭짓점 A, B, C를 O와 이어 삼각형 ABC를 △OBC, △OCA, △OAB 세 개로 나눠요. 밑변은 각 변이고 높이는 모두 r이에요.',
        `$\\triangle ABC=\\frac{1}{2}r(a+b+c)=\\frac{1}{2}\\times ${nt(g.r)}\\times ${nt(g.a + g.b + g.c)}=${nt(g.area)}$.`,
        `거꾸로 넓이와 둘레를 알면 $r=\\frac{2\\triangle ABC}{a+b+c}$로 구할 수 있어요. (지금: 헤론의 넓이 $${nt(g.area)}$)`
      ];
    },
    view: (M) => {
      const g = M.g;
      return {
        guide: '막대로 <b>세 변</b>을 바꿔 보세요. 삼각형을 O를 꼭짓점으로 하는 세 삼각형으로 나누면 <b>넓이 = $\\frac{1}{2}$ × r × 둘레</b>가 돼요.',
        readouts: [rd('둘레', ntD(g.a + g.b + g.c), 'sky'), rd('넓이', ntD(g.area), 'green'), rd('r', ntD(g.r), 'rose', '2×넓이÷둘레'), rd('r × 둘레 ÷ 2', ntD(0.5 * g.r * (g.a + g.b + g.c)), 'green', '넓이와 같아요')],
        rule: '삼각형의 넓이 $S=\\frac{1}{2}r(a+b+c)$ (r: 내접원의 반지름)',
        notes: notes('높이가 모두 r인 세 삼각형으로 나누는 것이 핵심이에요.', '세 변의 길이가 주어지면 헤론의 공식으로 넓이를 구한 뒤 r을 구할 수 있어요(심화).')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { a, b, c, r } = q, g = M.g, per = a + b + c, S0 = (per * r) / 2;
      let stem, ans, wr, meas, tag;
      const pre = `삼각형 ABC의 내접원 O의 반지름을 r이라 하자. $\\overline{AB}=${c}$, $\\overline{BC}=${a}$, $\\overline{CA}=${b}$이다.`;
      if (q.kind === 0) {
        tag = '내접원과 넓이 · r'; ans = r; meas = g.r;
        stem = `${pre} 삼각형 ABC의 넓이가 ${S0}일 때, r의 값 $x$는?`;
        wr = [[S0 / per, '넓이=r×(둘레)÷2이에요. r=2×넓이÷둘레.'], [per / S0, 'r=2×넓이÷둘레예요.'], [r + 1, 'r=2×넓이÷둘레예요.'], [r - 1, 'r=2×넓이÷둘레예요.'], [r * 2, 'r=2×넓이÷둘레예요. 2를 곱하고 둘레로 나눠요.']];
        return { tag, key, stem, choices: mkNum(ans, wr, {}), chk: [meas, ans] };
      } else if (q.kind === 1) {
        tag = '내접원과 넓이 · 넓이'; ans = S0; meas = g.area;
        stem = `${pre} 내접원의 반지름이 ${r}일 때, 삼각형 ABC의 넓이 $x$는?`;
        wr = [[r * per, '넓이=r×(둘레)÷2이에요. 2로 나눠요.'], [r * per / 4, '넓이=r×(둘레)÷2이에요.'], [S0 + r, '넓이=r×(둘레)÷2이에요.'], [S0 - r, '넓이=r×(둘레)÷2이에요.'], [r * a / 2, '세 변 모두의 합(둘레)을 써요.']];
        return { tag, key, stem, choices: mkNum(ans, wr, {}), chk: [meas, ans] };
      }
      tag = '내접원과 넓이 · r (넓이 주어짐)'; ans = r; meas = g.r;
      stem = `${pre} 삼각형 ABC의 넓이가 ${S0}일 때, 내접원의 반지름 $x$는?`;
      wr = [[S0 / per, 'r=2×넓이÷둘레예요.'], [per / S0, 'r=2×넓이÷둘레예요.'], [r + 1, 'r=2×넓이÷둘레예요.'], [r - 1, 'r=2×넓이÷둘레예요.'], [r * 2, 'r=2×넓이÷둘레예요.']];
      return { tag, key, stem, choices: mkNum(ans, wr, {}), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 4. 원에 외접하는 사각형 */
  // 접점의 각 위치(수학 각)를 4개 주면 사각형이 만들어진다. 꼭짓점 = 이웃한 두 접점의 접선의 교점
  function quadFromS(al, be, ga) {
    const de = 360 - al - be - ga, t0 = 90, t = [t0, t0 + al, t0 + al + be, t0 + al + be + ga]; // 변 AB, BC, CD, DA 의 접점들? 아래에서 정리
    const O = pt(0, 0), r = 5, TT = t.map((d) => mp(O, r, d));
    // 접점 T0..T3 (반시계). 꼭짓점 V_i 는 T_i 와 T_{i+1} 사이
    const arcs = [al, be, ga, de];
    const V = t.map((d, i) => mp(O, r / Math.cos((arcs[i] / 2) * DEG), d + arcs[i] / 2));
    // V0: T0,T1 사이 / V1: T1,T2 / V2: T2,T3 / V3: T3,T0
    // 반시계로 A=V0, B=V1, C=V2, D=V3 → 변 AB 는 T1 에서, BC 는 T2, CD 는 T3, DA 는 T0 에서 접한다.
    const A = V[0], B = V[1], C = V[2], D = V[3];
    return { O, r, T: TT, A, B, C, D, ab: dist(A, B), bc: dist(B, C), cd: dist(C, D), da: dist(D, A), arcs, de };
  }
  // 연 모양(AB=CD, BC≠DA): 접선의 길이 (a,b,b,a), ab = r²  → 반지름 r
  function kiteG(a, b) {
    const r = Math.sqrt(a * b), O = pt(0, 0), h1 = Math.atan(a / r) / DEG, h2 = Math.atan(b / r) / DEG; // 반호의 절반각
    // 접점 사이의 호: 꼭짓점 A,D(접선 길이 a) 는 호 2*h1, 꼭짓점 B,C(접선 길이 b)는 호 2*h2  (2h1+2h2+2h2+2h1... 합이 360)
    const arcs = [2 * h1, 2 * h2, 2 * h2, 2 * h1], t0 = 90 - h1, t = [t0]; for (let i = 0; i < 3; i++) t.push(t[i] + arcs[i]);
    const V = t.map((d, i) => mp(O, r / Math.cos((arcs[i] / 2) * DEG), d + arcs[i] / 2));
    const A = V[0], B = V[1], C = V[2], D = V[3];
    return { O, r, T: t.map((d) => mp(O, r, d)), A, B, C, D, a, b, ab: dist(A, B), bc: dist(B, C), cd: dist(C, D), da: dist(D, A) };
  }
  const KITE = [[4, 9], [9, 4], [2, 8], [8, 2], [3, 12], [12, 3], [1, 16], [16, 1], [2, 18], [6, 6], [4, 16], [16, 4], [8, 18], [18, 8], [9, 16], [16, 9]];
  const pit = {
    id: 'c3-4', title: '원에 외접하는 사각형', short: '외접사각형',
    question: '원 O가 사각형 ABCD의 네 변에 모두 접할 때, 마주 보는 두 변의 길이의 합은 어떤 관계일까? 접점의 위치를 바꿔 AB+CD와 BC+DA를 비교해 보자.',
    ctl: ['c3x', 'c3y', 'c3z'],
    init: (s) => { s.c3x = 90; s.c3y = 80; s.c3z = 100; },
    gen(rnd, n) { const [a, b] = pickR(rnd, KITE), kind = n % 3; return { kind, a, b, key: `k${kind}.${a}.${b}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, g: kiteG(q.a, q.b) }; }
      let al = clamp(s.c3x, 50, 130), be = clamp(s.c3y, 50, 130), ga = clamp(s.c3z, 50, 130), de = 360 - al - be - ga;
      if (de < 50) { ga = clamp(310 - al - be, 50, 130); de = 360 - al - be - ga; s.c3z = ga; }
      if (de > 130) { ga = clamp(230 - al - be + 100, 50, 130); de = 360 - al - be - ga; }
      return { g: quadFromS(al, be, ga) };
    },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      const R = g.r, ext = Math.max(...[g.A, g.B, g.C, g.D].map((p) => Math.hypot(p.x, p.y)));
      fit(b, { x0: Math.min(...[g.A, g.B, g.C, g.D].map((p) => p.x)) - 0.3, x1: Math.max(...[g.A, g.B, g.C, g.D].map((p) => p.x)) + 0.3, y0: Math.min(...[g.A, g.B, g.C, g.D].map((p) => p.y)) - 0.3, y1: Math.max(...[g.A, g.B, g.C, g.D].map((p) => p.y)) + 0.3 }, { t: 60, b: 46, l: 40, r: 40 });
      void ext;
      fillPoly(b, [g.A, g.B, g.C, g.D], 'sky', 0.05);
      circle(b, g.O, R, 'ink', 3.2, { fill: 'green', fa: 0.06 });
      b.path([g.A, g.B, g.C, g.D], { close: true, color: 'ink', width: 3.6 });
      if (!pr && (ex || st >= 1)) {
        // 같은 접선 길이: 각 꼭짓점마다 눈금 수가 다르게
        const tk = [[g.A, g.T[0], g.T[1], 1], [g.B, g.T[1], g.T[2], 2], [g.C, g.T[2], g.T[3], 3], [g.D, g.T[3], g.T[0], 4]];
        tk.forEach(([V, T1, T2, n]) => { tick(b, V, T1, n, 'amber'); tick(b, V, T2, n, 'amber'); });
      }
      [g.A, g.B, g.C, g.D].forEach((p) => dot(b, p, 'ink', 4.6)); g.T.forEach((p) => dot(b, p, 'amber', 3.8)); dot(b, g.O, 'ink', 4);
      if (!C.txt) return;
      tagOut(b, g.A, g.O, 'A', { size: 17 }); tagOut(b, g.B, g.O, 'B', { size: 17 }); tagOut(b, g.C, g.O, 'C', { size: 17 }); tagOut(b, g.D, g.O, 'D', { size: 17 }); T(b, g.O, 'O', { dx: 0, dy: -14, size: 16 });
      const L = (p1, p2, v, col) => segTag(b, p1, p2, v, { away: g.O, color: col || 'sky', size: S(b), gap: 14 });
      if (pr) {
        const e = { ab: q.a + q.b, bc: 2 * q.b, cd: q.a + q.b, da: 2 * q.a }, side = q.kind === 0 ? 'da' : q.kind === 1 ? 'bc' : 'cd';
        [['ab', g.A, g.B], ['bc', g.B, g.C], ['cd', g.C, g.D], ['da', g.D, g.A]].forEach(([k, p1, p2]) => { L(p1, p2, k === side ? 'x' : String(e[k])); });
        return;
      }
      L(g.A, g.B, cv(g.ab)); L(g.B, g.C, cv(g.bc)); L(g.C, g.D, cv(g.cd)); L(g.D, g.A, cv(g.da));
    },
    steps: (M) => {
      const g = M.g, f = (v) => fmtN(v);
      return [
        '네 변이 원에 접하므로 각 꼭짓점에서 두 접점까지의 접선 길이가 같아요. A에서 $a$, B에서 $b$, C에서 $c$, D에서 $d$라 해요(같은 눈금).',
        '그러면 $\\overline{AB}=a+b$, $\\overline{BC}=b+c$, $\\overline{CD}=c+d$, $\\overline{DA}=d+a$.',
        `마주 보는 변의 합: $\\overline{AB}+\\overline{CD}=a+b+c+d=\\overline{BC}+\\overline{DA}$.`,
        `지금은 $\\overline{AB}+\\overline{CD}=${f(g.ab + g.cd)}$, $\\overline{BC}+\\overline{DA}=${f(g.bc + g.da)}$로 같아요.`
      ];
    },
    view: (M) => {
      const g = M.g;
      return {
        guide: '막대로 <b>접점 사이의 호</b>를 바꿔 네 변의 길이를 바꿔 보세요. 사각형이 변해도 <b>AB+CD와 BC+DA는 늘 같아요</b>.',
        readouts: [rd('AB + CD', fmtN(g.ab + g.cd), 'sky'), rd('BC + DA', fmtN(g.bc + g.da), 'green', '늘 같아요'), rd('AB', fmtN(g.ab), 'ink'), rd('BC', fmtN(g.bc), 'ink'), rd('CD', fmtN(g.cd), 'ink'), rd('DA', fmtN(g.da), 'ink')],
        status: { tone: 'ok', text: 'AB+CD = BC+DA' },
        rule: '원에 외접하는 사각형에서 두 쌍의 대변의 길이의 합은 같다',
        notes: notes('이 관계는 <b>접선 길이가 같다</b>는 사실에서 나와요.', '원의 네 접점과 같은 길이의 접선을 먼저 확인한 뒤 대변의 합을 비교해요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { a, b } = q, g = M.g;
      const e = { ab: a + b, bc: 2 * b, cd: a + b, da: 2 * a };
      const nm = { ab: 'AB', bc: 'BC', cd: 'CD', da: 'DA' }, side = q.kind === 0 ? 'da' : q.kind === 1 ? 'bc' : 'cd';
      const opp = { da: 'bc', bc: 'da', cd: 'ab' }[side], other = Object.keys(e).filter((k) => k !== side);
      const ans = e[side], tag = `외접사각형 · ${nm[side]}`;
      const meas = { da: g.da, bc: g.bc, cd: g.cd }[side];
      const given = other.map((k) => `$\\overline{${nm[k]}}=${e[k]}$`).join(', ');
      const stem = `원 O가 사각형 ABCD의 네 변에 모두 접한다. ${given}일 때, $\\overline{${nm[side]}}$의 길이 $x$는?`;
      const sum = e[other.find((k) => k !== opp && k !== side)] || 1;
      const wr = [[e.ab + e.cd, '마주 보는 변의 합이 같다는 것을 써요.'], [e.ab + e.bc, '마주 보는 변끼리 합을 비교해요.'], [Math.abs(e[other[0]] - e[other[1]]) + e[other[2]] + 1, 'AB+CD=BC+DA를 써요.'], [ans + 2, 'AB+CD=BC+DA를 써요.'], [ans * 2, 'AB+CD=BC+DA를 써요.']];
      void sum;
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm', pad: 2 }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 5. 원에 외접하는 직각사다리꼴 */
  const trG = (a, b) => {
    const r = (a * b) / (a + b), O = pt(r, r), A = pt(0, 0), D = pt(a, 0), B = pt(0, 2 * r), C = pt(b, 2 * r);
    const tp = pt(r, 0), tb = pt(r, 2 * r), ta = pt(0, r), cd = dist(C, D), tc = lerp(D, C, ((a - r)) / cd);
    return { a, b, r, O, A, B, C, D, cd, tp, tb, ta, tc, ab: 2 * r };
  };
  const TRP = [[3, 6], [6, 3], [4, 12], [12, 4], [6, 12], [12, 6], [10, 15], [15, 10], [5, 20], [20, 5], [9, 18], [18, 9], [8, 24], [24, 8]];
  const trap = {
    id: 'c3-5', title: '원에 외접하는 직각사다리꼴', short: '외접하는 직각사다리꼴',
    question: 'AD∥BC, ∠A=∠B=90°인 사다리꼴 ABCD의 네 변에 원이 접한다. 윗변 AD와 아랫변 BC로 AB, CD, 반지름 r을 구할 수 있을까?',
    ctl: ['c3w', 'c3v'],
    init: (s) => { s.c3w = 6; s.c3v = 12; },
    gen(rnd, n) { const [a, b] = pickR(rnd, TRP), kind = n % 3; return { kind, a, b, key: `z${kind}.${a}.${b}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: trG(q.a, q.b) }; } return { g: trG(s.c3w, s.c3v) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      fit(b, { x0: -0.3, x1: Math.max(g.a, g.b) + 0.3, y0: -0.3, y1: g.ab + 0.3 }, { t: 60, b: 46, l: 40, r: 40 });
      fillPoly(b, [g.A, g.D, g.C, g.B], 'sky', 0.05);
      circle(b, g.O, g.r, 'ink', 3.2, { fill: 'green', fa: 0.06 });
      b.path([g.A, g.D, g.C, g.B], { close: true, color: 'ink', width: 3.6 });
      b.right(g.A, g.D, g.B, { size: 13, color: 'amber' }); b.right(g.B, g.A, g.C, { size: 13, color: 'amber' });
      if (!pr && (ex || st >= 1)) { tick(b, g.A, g.tp, 1, 'amber'); tick(b, g.A, g.ta, 1, 'amber'); tick(b, g.B, g.ta, 2, 'amber'); tick(b, g.B, g.tb, 2, 'amber'); tick(b, g.D, g.tp, 3, 'amber'); tick(b, g.D, g.tc, 3, 'amber'); tick(b, g.C, g.tb, 4, 'amber'); tick(b, g.C, g.tc, 4, 'amber'); }
      [g.A, g.B, g.C, g.D].forEach((p) => dot(b, p, 'ink', 4.6)); [g.tp, g.tb, g.ta, g.tc].forEach((p) => dot(b, p, 'amber', 3.8)); dot(b, g.O, 'ink', 4);
      if (!C.txt) return;
      T(b, g.A, 'A', { dx: -14, dy: -13, size: 17 }); T(b, g.D, 'D', { dx: 14, dy: -13, size: 17 }); T(b, g.B, 'B', { dx: -14, dy: 14, size: 17 }); T(b, g.C, 'C', { dx: 14, dy: 14, size: 17 });
      T(b, pt(g.O.x - 0.0, g.O.y - 0.0), 'O', { dy: -14, size: 16 });
      if (pr) {
        segTag(b, g.A, g.D, String(q.a), { away: g.O, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.B, g.C, String(q.b), { away: g.O, color: 'sky', size: S(b), gap: 12 });
        if (q.kind === 0) segTag(b, g.A, g.B, 'x', { away: g.O, gap: 12 });
        if (q.kind === 1) segTag(b, g.C, g.D, 'x', { away: g.O, gap: 12 });
        if (q.kind === 2) { T(b, g.O, 'r=x', { dy: 24, size: S(b) }); }
        return;
      }
      segTag(b, g.A, g.D, cv(g.a), { away: g.O, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.B, g.C, cv(g.b), { away: g.O, color: 'sky', size: S(b), gap: 12 });
      if (ex || st >= 2) { segTag(b, g.A, g.B, cv(g.ab), { away: g.O, color: 'green', size: S(b) - 1, gap: 12 }); segTag(b, g.C, g.D, cv(g.cd), { away: g.O, color: 'rose', size: S(b) - 1, gap: 12 }); }
    },
    steps: (M) => {
      const g = M.g, f = fmtN;
      return [
        '원이 네 변에 접하므로 AB+CD=AD+BC이고, ∠A=∠B=90°이므로 $\\overline{AB}$는 원의 지름이에요: $\\overline{AB}=2r$.',
        `$\\overline{CD}=\\overline{AD}+\\overline{BC}-\\overline{AB}=${f(g.a)}+${f(g.b)}-2r$.`,
        `점 D에서 $\\overline{BC}$에 수선을 그으면 직각삼각형에서 $\\overline{CD}^2=(\\overline{BC}-\\overline{AD})^2+\\overline{AB}^2$이므로 $(${f(g.a + g.b)}-2r)^2=(${f(Math.abs(g.b - g.a))})^2+(2r)^2$.`,
        `풀면 $r=\\frac{AD\\times BC}{AD+BC}=${nt(g.r)}$, $\\overline{AB}=${nt(g.ab)}$, $\\overline{CD}=${nt(g.cd)}$.`
      ];
    },
    view: (M) => {
      const g = M.g;
      return {
        guide: '막대로 <b>윗변 AD</b>와 <b>아랫변 BC</b>를 바꿔 보세요. 원이 네 변에 접하려면 AB는 지름이 되고 CD=AD+BC−AB가 돼요.',
        readouts: [rd('AB = 2r', ntD(g.ab), 'green'), rd('CD', ntD(g.cd), 'rose', 'AD+BC−AB'), rd('r', ntD(g.r), 'amber', 'AD·BC÷(AD+BC)'), rd('AB+CD', ntD(g.ab + g.cd), 'sky', '= AD+BC')],
        rule: '원에 외접하는 직각사다리꼴: $AB=2r$, $CD=AD+BC-AB$, $r=\\frac{AD\\cdot BC}{AD+BC}$',
        notes: notes('AB+CD=AD+BC(외접사각형의 성질)와 피타고라스 정리를 함께 써요.', 'AD=BC이면 직사각형(정사각형)이 돼요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { a, b } = q, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = `원 O가 사다리꼴 ABCD(AD∥BC, ∠A=∠B=90°)의 네 변에 모두 접하고 $\\overline{AD}=${a}$, $\\overline{BC}=${b}$일 때,`;
      if (q.kind === 0) {
        tag = '외접 직각사다리꼴 · AB'; ans = g.ab; meas = dist(g.A, g.B);
        stem = `${pre} $\\overline{AB}$의 길이 $x$는?`;
        wr = [[a + b, '이것은 AD+BC예요. 피타고라스 정리로 구해요.'], [Math.abs(b - a), '이것은 BC−AD예요.'], [g.cd, '이것은 CD예요.'], [(a + b) / 2, 'AB는 지름이에요. 피타고라스 정리를 써요.'], [g.ab + 2, 'CD=AD+BC−AB, CD²=(BC−AD)²+AB²를 연립해요.']];
      } else if (q.kind === 1) {
        tag = '외접 직각사다리꼴 · CD'; ans = g.cd; meas = dist(g.C, g.D);
        stem = `${pre} $\\overline{CD}$의 길이 $x$는?`;
        wr = [[a + b, '이것은 AD+BC예요. CD=AD+BC−AB.'], [g.ab, '이것은 AB(지름)예요.'], [Math.abs(b - a), '이것은 BC−AD예요.'], [g.cd + 2, 'CD=AD+BC−AB, 그리고 AB를 먼저 구해요.'], [g.cd - 2 > 0 ? g.cd - 2 : g.cd + 3, 'CD=AD+BC−AB를 써요.']];
      } else {
        tag = '외접 직각사다리꼴 · 반지름'; ans = g.r; meas = g.ab / 2;
        stem = `${pre} 원 O의 반지름의 길이 $x$는?`;
        wr = [[(a + b) / 2, '반지름은 AB의 절반이에요. 먼저 AB를 구해요.'], [g.ab, '이것은 지름이에요.'], [g.cd, '이것은 CD예요.'], [Math.abs(b - a), '이것은 BC−AD예요.'], [g.r + 1, 'r=AD·BC÷(AD+BC)예요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 6. 반원과 직각사다리꼴 */
  const SEMI = [[1, 9, 6], [4, 9, 12], [2, 8, 8], [4, 16, 16], [9, 16, 24], [3, 12, 12], [8, 18, 24], [5, 5, 10], [1, 4, 4], [2, 18, 12], [1, 16, 8], [9, 4, 12], [16, 4, 16], [9, 1, 6], [8, 2, 8], [12, 3, 12]];
  const semiG = (a, b) => {
    const r = Math.sqrt(a * b), A = pt(0, 0), B = pt(2 * r, 0), O = pt(r, 0), D = pt(0, -a), C = pt(2 * r, -b), E = lerp(D, C, a / (a + b));
    return { a, b, r, A, B, O, C, D, E, ab: 2 * r, cd: a + b };
  };
  const semi = {
    id: 'c3-6', title: '반원과 직각사다리꼴', short: '반원과 직각사다리꼴',
    question: '지름이 AB인 반원에 AD, BC, CD가 접한다(E는 CD의 접점). AD=a, BC=b일 때 CD와 AB는 어떻게 구할까?',
    ctl: ['c3ad', 'c3bc'],
    init: (s) => { s.c3ad = 4; s.c3bc = 9; },
    gen(rnd, n) { const [a, b, ab] = pickR(rnd, SEMI), kind = n % 3; return { kind, a, b, ab, key: `m${kind}.${a}.${b}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: semiG(q.a, q.b) }; } return { g: semiG(clamp(Math.round(s.c3ad), 1, 16), clamp(Math.round(s.c3bc), 1, 16)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      fit(b, { x0: -0.3, x1: g.ab + 0.3, y0: -Math.max(g.a, g.b, g.r) - 0.3, y1: 0.5 }, { t: 60, b: 50, l: 40, r: 40 });
      fillPoly(b, [g.A, g.B, g.C, g.D], 'sky', 0.05);
      b.arc(g.O, g.r, Math.PI, 2 * Math.PI, { color: 'ink', width: 3.4, ccw: false });
      b.path([g.D, g.A, g.B, g.C, g.D], { color: 'ink', width: 3.6 });
      if (!pr && (ex || st >= 1)) { tick(b, g.A, g.D, 1, 'amber'); tick(b, g.D, g.E, 1, 'amber'); tick(b, g.B, g.C, 2, 'amber'); tick(b, g.C, g.E, 2, 'amber'); }
      if (ex || pr || st >= 3) line(b, g.O, g.E, 'green', 2.4, { dash: [5, 5] });
      b.right(g.A, g.D, g.B, { size: 13, color: 'amber' }); b.right(g.B, g.A, g.C, { size: 13, color: 'amber' });
      [g.A, g.B, g.C, g.D].forEach((p) => dot(b, p, 'ink', 4.6)); dot(b, g.E, 'amber', 4.4); dot(b, g.O, 'ink', 4);
      if (!C.txt) return;
      T(b, g.A, 'A', { dx: -14, dy: 14, size: 17 }); T(b, g.B, 'B', { dx: 14, dy: 14, size: 17 }); T(b, g.D, 'D', { dx: -14, dy: -4, size: 17 }); T(b, g.C, 'C', { dx: 14, dy: -4, size: 17 });
      tagOut(b, g.E, g.O, 'E', { size: 17, gap: 12 }); T(b, g.O, 'O', { dx: -13, dy: -13, size: 16 });
      if (pr) {
        segTag(b, g.A, g.D, q.kind === 2 ? 'x' : String(q.a), { away: g.O, color: 'sky', size: S(b), gap: 12 });
        segTag(b, g.B, g.C, String(q.b), { away: g.O, color: 'sky', size: S(b), gap: 12 });
        if (q.kind === 0) segTag(b, g.A, g.B, 'x', { away: pt(g.r, -1), gap: 14 });
        if (q.kind === 1) segTag(b, g.C, g.D, 'x', { away: g.O, gap: 12 });
        if (q.kind === 2) { segTag(b, g.A, g.B, String(q.ab), { away: pt(g.r, -1), color: 'sky', size: S(b), gap: 14 }); }
        return;
      }
      segTag(b, g.A, g.D, cv(g.a), { away: g.O, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.B, g.C, cv(g.b), { away: g.O, color: 'sky', size: S(b), gap: 12 });
      if (ex || st >= 2) segTag(b, g.C, g.D, 'CD=' + cv(g.cd), { away: g.O, color: 'rose', size: S(b) - 1, gap: 12 });
      if (ex || st >= 3) segTag(b, g.A, g.B, 'AB=' + cv(g.ab), { away: pt(g.r, -1), color: 'green', size: S(b) - 1, gap: 14 });
    },
    steps: (M) => {
      const g = M.g;
      return [
        '∠A=∠B=90°이므로 AD, BC는 지름 AB의 양 끝에서 그은 접선이에요. D, C에서 반원에 그은 접선의 길이는 같아요: $\\overline{DE}=\\overline{DA}=a$, $\\overline{CE}=\\overline{CB}=b$.',
        `따라서 $\\overline{CD}=\\overline{DE}+\\overline{EC}=a+b=${nt(g.a)}+${nt(g.b)}=${nt(g.cd)}$.`,
        '점 D에서 $\\overline{BC}$에 수선 DH를 그으면 직각삼각형 DHC에서 $\\overline{DH}=\\overline{AB}$, $\\overline{HC}=b-a$.',
        `피타고라스 정리: $(a+b)^2=(b-a)^2+\\overline{AB}^2$ → $\\overline{AB}^2=4ab$, $\\overline{AB}=2\\sqrt{ab}=${nt(g.ab)}$.`
      ];
    },
    view: (M) => {
      const g = M.g;
      return {
        guide: '막대로 <b>AD</b>와 <b>BC</b>를 바꿔 보세요. 반원에 접하는 CD의 길이는 늘 <b>AD+BC</b>예요.',
        readouts: [rd('CD', ntD(g.cd), 'rose', 'AD+BC'), rd('AB (지름)', ntD(g.ab), 'green', '2√(AD·BC)'), rd('반지름 r', ntD(g.r), 'amber', '√(AD·BC)')],
        rule: '반원에 접하는 직각사다리꼴: $CD=AD+BC$, $AB=2\\sqrt{AD\\cdot BC}$',
        notes: notes('접점 E에서 $\\overline{DE}=\\overline{DA}$, $\\overline{CE}=\\overline{CB}$ 두 쌍이 핵심이에요.', '두 변의 길이가 같으면(AD=BC) CD는 AB와 평행해져요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { a, b, ab } = q, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '지름이 $\\overline{AB}$인 반원에 $\\overline{AD}$, $\\overline{BC}$, $\\overline{CD}$가 접한다(E는 $\\overline{CD}$의 접점, ∠A=∠B=90°).';
      if (q.kind === 0) {
        tag = '반원과 직각사다리꼴 · AB'; ans = ab; meas = dist(g.A, g.B);
        stem = `${pre} $\\overline{AD}=${a}$, $\\overline{BC}=${b}$일 때, $\\overline{AB}$의 길이 $x$는?`;
        wr = [[a + b, '이것은 CD예요. AB²=CD²−(BC−AD)².'], [Math.abs(b - a), '이것은 BC−AD예요.'], [ab / 2, '이것은 반지름이에요. AB는 지름이에요.'], [Math.sqrt(a * b), '이것은 반지름이에요. 지름은 그 2배예요.'], [a * b, 'AB²=4ab예요.']];
      } else if (q.kind === 1) {
        tag = '반원과 직각사다리꼴 · CD'; ans = a + b; meas = dist(g.C, g.D);
        stem = `${pre} $\\overline{AD}=${a}$, $\\overline{BC}=${b}$일 때, $\\overline{CD}$의 길이 $x$는?`;
        wr = [[ab, '이것은 AB예요. CD=AD+BC.'], [Math.abs(b - a), '이것은 BC−AD예요.'], [(a + b) / 2, 'CD=DE+EC=AD+BC예요.'], [a * b, 'CD=AD+BC예요.'], [a + b + 2, 'CD=DE+EC=AD+BC예요.']];
      } else {
        tag = '반원과 직각사다리꼴 · AD'; ans = a; meas = dist(g.A, g.D);
        stem = `${pre} $\\overline{AB}=${ab}$, $\\overline{BC}=${b}$일 때, $\\overline{AD}$의 길이 $x$는?`;
        wr = [[ab * ab / (2 * b) , 'AB²=4·AD·BC예요. AD=AB²÷(4BC).'], [ab / 2, '이것은 반지름이에요.'], [b - a, '이것은 BC−AD예요.'], [ab - b, '길이를 빼면 안 돼요.'], [a + 1, 'AB²=4·AD·BC를 써요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  G.register(30, 'c3', '내접원·외접사각형', '내접원·외접', PARAMS, [inc, rt, areaS, pit, trap, semi]);
})();
