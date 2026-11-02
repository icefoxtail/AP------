/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ⑤ 「외심」 (t5.js, order 50) — 장면 7개
   · o1 외심 O          · 세 변의 수직이등분선(중점 D·E·F)이 한 점 O에서 만남, OA=OB=OC=R
   · o2 직각삼각형의 외심 · 외심은 빗변의 중점, R = 빗변 ÷ 2
   · o3 30°-60°-90°      · 외심 O와 정삼각형 OBC
   · o4 외심에서의 각    · x+y+z=90°, ∠BOC=2∠A
   · o5 둔각삼각형의 외심 · 외심이 삼각형 바깥에 놓이고 ∠BOC=360°−2∠A
   · o6 중심각의 비      · ∠AOB:∠BOC:∠COA = a:b:c → ∠ACB=½∠AOB
   · o7 외접원의 둘레    · △OBC의 둘레와 BC로 R을 구하고 2πR
   각은 정수(도), 길이는 정수(cm)만 보입니다. 피타고라스 정리(√)는 쓰지 않습니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, polar, angBetween, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, numProb, mkStmtChoices, degOpts, cmOpts, rd, notes, fmtN, dg, bboxOf, fs, dim, foot, circumcenter } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const S = (n) => `$\\overline{${n}}$`;
  const fr = (n, d) => `\\frac{${n}}{${d}}`;

  const PARAMS = {
    trOa: P('∠A', 45, 75, 1, 60, { color: 'sky', format: (v) => v + '°' }),
    trOb: P('∠B', 45, 75, 1, 65, { color: 'green', format: (v) => v + '°' }),
    trOr: P('외접원의 반지름 R', 3, 10, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    trPr: P('OA = OB = OC', 2, 7, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    trPa: P('∠A', 20, 70, 2, 50, { color: 'sky', format: (v) => v + '°' }),
    trQa: P('∠A', 100, 130, 2, 112, { color: 'amber', format: (v) => v + '°' }),
    trQb: P('∠B', 15, 40, 1, 25, { color: 'green', format: (v) => v + '°' }),
    trRa: P('a', 1, 6, 1, 2, { color: 'sky', format: (v) => String(v) }),
    trRb: P('b', 1, 6, 1, 3, { color: 'green', format: (v) => String(v) }),
    trRc: P('c', 1, 6, 1, 4, { color: 'amber', format: (v) => String(v) }),
    trSr: P('R', 3, 9, 1, 5, { color: 'amber', format: (v) => v + ' cm' }),
    trSa: P('BC', 2, 9, 1, 6, { color: 'sky', format: (v) => v + ' cm' })
  };

  // 단위원(반지름 1, 중심 O=원점) 위의 삼각형. A 위쪽, B 왼쪽, C 오른쪽. 각 A,B,C (도)
  function circGeom(Ad, Bd, Cd) {
    const O = pt(0, 0), A = polar(O, 1, -90), B = polar(O, 1, -90 - 2 * Cd), Cc = polar(O, 1, -90 + 2 * Bd);
    const D = mid(B, Cc), E = mid(Cc, A), F = mid(A, B);
    return { O, A, B, C: Cc, D, E, F, a: Ad, b: Bd, c: Cd };
  }
  function drawCirc(b, g, o = {}) {
    const { O, A, B, C: Cc } = g;
    b.circle(O, 1, { color: 'sky', width: 2.4, alpha: 0.7, dash: [6, 5] });
    fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.6);
  }
  const RBOX = { x0: -1.25, x1: 1.25, y0: -1.2, y1: 1.2 };

  /* ====================================================================== 1. 외심 */
  const o1 = {
    id: 't5-1', title: '외심 O와 세 변의 수직이등분선', short: '외심',
    question: '삼각형 세 변의 수직이등분선은 한 점에서 만날까? 그 점에서 세 꼭짓점까지의 거리는?',
    ctl: ['trOa', 'trOb', 'trOr'],
    init: (s) => { s.trOa = 60; s.trOb = 65; s.trOr = 6; s.trV = 0; },
    reroll: (s) => { s.trOa = rint(50, 70); s.trOb = rint(50, 70); s.trOr = rint(4, 9); s.trV = (s.trV + 1) % 3; },
    model: (s) => {
      const a = clamp(Math.round(s.trOa), 45, 75), b = clamp(Math.round(s.trOb), 45, 75), c = 180 - a - b, R = clamp(Math.round(s.trOr), 3, 10);
      return { a, b, c, R, g: circGeom(a, b, c), z: 90 - c };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, R, g } = M, { O, A, B, C: Cc, D, E, F } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawCirc(b, g);
      const mids = [[D, B, Cc, 1], [E, Cc, A, 2], [F, A, B, 3]];
      mids.forEach(([Mm, p, q, n]) => { line(b, O, Mm, show(1) || C.problem ? 'green' : 'green', 3, { dash: [7, 5] }); tick(b, p, Mm, n, 'amber'); tick(b, Mm, q, n, 'amber'); });
      if (!C.problem) { ang(b, D, O, Cc, { color: 'green', r: 18 }); ang(b, E, O, A, { color: 'green', r: 18 }); ang(b, F, O, B, { color: 'green', r: 18 }); }
      [[O, A, 1], [O, B, 2], [O, Cc, 3]].forEach(([p, q]) => line(b, p, q, show(2) || C.problem ? 'rose' : 'ink', show(2) || C.problem ? 3.2 : 1.4, { alpha: show(2) || C.problem ? 1 : 0.35 }));
      if (C.problem) {
        if (v === 0) { G.sideTag(b, O, A, pt(1, 1), `${R} cm`, { color: 'sky', size: fs(b, 16), gap: 8 }); G.sideTag(b, O, B, pt(1, -1), 'x', { color: 'amber', size: fs(b, 18), gap: 10 }); }
        else if (v === 1) { ang(b, O, A, B, { color: 'sky', r: 22, label: dg(180 - 2 * M.z), size: 15, labelDist: 40, labelRot: 40 }); ang(b, A, O, B, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 50 }); }
      } else {
        const lf = fs(b, 15);
        if (show(2)) { G.sideTag(b, O, A, pt(1, 1), `${R} cm`, { color: 'rose', size: lf, gap: 8 }); G.sideTag(b, O, B, pt(1, -1), `${R} cm`, { color: 'rose', size: lf, gap: 10 }); G.sideTag(b, O, Cc, pt(-1, -1), `${R} cm`, { color: 'rose', size: lf, gap: 10 }); }
      }
      b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'green', r: 3.8 }));
      T(b, O, 'O', { dx: 12, dy: 4, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      tagOut(b, D, O, 'D', { size: 16, color: 'green', nameColor: 'green', gap: 8 }); tagOut(b, E, O, 'E', { size: 16, gap: 8 }); tagOut(b, F, O, 'F', { size: 16, gap: 8 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '세 변의 수직이등분선이 한 점 O에서 만나요';
        else if (C.review && st === 2) { row = `OA=OB=OC=${R} cm`; col = 'rose'; }
        else if (C.review && st === 3) { row = `O는 외접원의 중심, 반지름 R=${R} cm`; col = 'rose'; }
        else row = `OA=OB=OC=${R} cm  (외접원의 반지름)`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 16), color: col });
      }
      void a; void bb; void c;
    },
    steps: (M) => [
      `삼각형 ABC의 세 변 BC, CA, AB의 수직이등분선을 그으면 한 점 O에서 만나요. 이 점이 외심이에요. 각 변의 중점은 D, E, F예요.`,
      `수직이등분선 위의 점은 선분의 양 끝점에서 같은 거리에 있으므로 $\\overline{OB}=\\overline{OC}$, $\\overline{OC}=\\overline{OA}$예요. 즉 $\\overline{OA}=\\overline{OB}=\\overline{OC}=${M.R}$ cm.`,
      `외심 O에서 세 꼭짓점까지의 거리가 같으므로 O를 중심으로 하고 세 꼭짓점을 지나는 원(외접원)이 있어요. 반지름 $R=${M.R}$ cm예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A, ∠B</b>와 <b>반지름 R</b>을 바꿔 보세요. 세 변의 수직이등분선(초록 점선)은 늘 <b>한 점 O</b>에서 만나고, O에서 세 꼭짓점까지의 거리는 모두 같아요.',
      readouts: [rd('∠A · ∠B · ∠C', `${M.a}° · ${M.b}° · ${M.c}°`, 'sky'), rd('OA = OB = OC', `${M.R} cm`, 'rose', '외접원의 반지름 R', null, true)],
      formula: `<p>$\\overline{OA}=\\overline{OB}=\\overline{OC}=R=${M.R}$ cm</p><p>$\\overline{BD}=\\overline{CD},\\ \\overline{CE}=\\overline{AE},\\ \\overline{AF}=\\overline{BF}$ (D, E, F는 변의 중점)</p>`,
      rule: '삼각형의 세 변의 수직이등분선은 한 점(외심)에서 만나고, 외심에서 세 꼭짓점까지의 거리는 같다.',
      notes: notes('외심 O는 변의 <b>중점</b>(D, E, F)이 아니에요. 수직이등분선이 만나는 점이에요.', '외심에서 <b>꼭짓점</b>까지의 거리(OA, OB, OC)가 같아요. 변까지의 거리(OD, OE, OF)는 같지 않아요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { R, z } = M, key = `${v}:${R}:${M.a}:${M.b}`;
      const head = '그림에서 점 O는 삼각형 ABC의 외심이고, 점 D, E, F는 각 변의 중점이다.';
      if (v === 0) return numProb({ tag: '외심 · 외접원의 반지름', key, stem: `${head} ${S('OA')}=${R} cm일 때, ${S('OB')}의 길이 $x$는?`, correct: R, wrongs: [[R * 2, '두 배가 아니에요. 외심에서 세 꼭짓점까지의 거리는 같아요.'], [R + 1, '다시 생각해 보세요.'], [R - 1, '다시 생각해 보세요.'], [R + 2, '다시 생각해 보세요.'], [Math.max(1, R - 2), '다시 생각해 보세요.']], ...cmOpts });
      if (v === 1) return numProb({ tag: '외심 · 이등변삼각형', key, stem: `${head} ∠AOB=${180 - 2 * z}°일 때, ∠OAB의 크기 $x$는?`, correct: z, wrongs: [[180 - 2 * z, '∠AOB예요.'], [90 - z, '다시 생각해 보세요.'], [2 * z, '다시 생각해 보세요.'], [z + 10, '다시 계산해 보세요.'], [z - 5, '다시 계산해 보세요.']].filter((q) => q[0] !== z), ...degOpts(5) });
      const pool = [
        { h: '$\\overline{OA}=\\overline{OB}=\\overline{OC}$', f: () => true }, { h: '$\\overline{BD}=\\overline{CD}$', f: () => true }, { h: '$\\overline{OD}\\perp\\overline{BC}$', f: () => true }, { h: '$\\angle OAB=\\angle OBA$', f: () => true }, { h: '$\\angle ODB=90^{\\circ}$', f: () => true },
        { h: '$\\overline{OD}=\\overline{OE}$', f: (m) => Math.abs(dist(m.g.O, m.g.D) - dist(m.g.O, m.g.E)) < 1e-6 }, { h: '$\\angle AOB=\\angle BOC$', f: (m) => m.c === m.a }, { h: '$\\overline{OA}=\\overline{AD}$', f: (m) => Math.abs(dist(m.g.O, m.g.A) - dist(m.g.A, m.g.D)) < 1e-6 }, { h: '$\\angle OBC=\\angle OBA$', f: (m) => Math.abs(angBetween(m.g.B, m.g.O, m.g.C) - angBetween(m.g.B, m.g.O, m.g.A)) < 1e-6 }, { h: '$\\overline{AB}=\\overline{BC}$', f: (m) => m.c === m.a }
      ];
      const r = mkStmtChoices(pool, M, key + 'F', false);
      return { tag: '외심의 성질 · 옳지 않은 것', key: key + 'F', stem: `${head} 다음 중 옳지 않은 것은?`, choices: r.choices, wide: true };
    },
    verify: (s) => { const M = o1.model(s), g = M.g; return { ans: dist(g.O, g.A), model: dist(g.O, g.B), extra: [[dist(g.O, g.C), dist(g.O, g.A)], [angBetween(g.A, g.B, g.C), M.a], [angBetween(g.B, g.A, g.C), M.b]] }; }
  };

  /* ====================================================================== 2. 직각삼각형의 외심 */
  const rightGeom = (al) => { const O = pt(0, 0), A = pt(-1, 0), B = pt(1, 0), Cc = polar(O, 1, -2 * al); return { O, A, B, C: Cc }; };
  const o2 = {
    id: 't5-2', title: '직각삼각형의 외심은 빗변의 중점', short: '직각삼각형의 외심',
    question: '∠C=90°인 직각삼각형 ABC의 외심 O는 어디에 있을까?',
    ctl: ['trPa', 'trPr'],
    init: (s) => { s.trPa = 50; s.trPr = 4; s.trV = 0; },
    reroll: (s) => { s.trPa = pick([24, 30, 36, 40, 50, 56, 64], s.trPa); s.trPr = rint(2, 7); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const al = clamp(Math.round(s.trPa / 2) * 2, 20, 70), R = clamp(Math.round(s.trPr), 2, 7); return { al, R, g: rightGeom(al), be: 90 - al }; },
    draw(b, s, M, C) {
      const { al, R, g, be } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, { x0: -1.25, x1: 1.25, y0: -1.1, y1: 1.1 }, { t: 40, b: C.problem ? 40 : 56, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'sky', width: 2.4, alpha: 0.6, dash: [6, 5] });
      fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.6);
      ang(b, Cc, A, B, { color: 'sky', r: 24 });
      line(b, O, Cc, 'rose', 3.2);
      tick(b, A, O, 1, 'amber'); tick(b, O, B, 1, 'amber');
      if (C.problem) {
        tick(b, O, Cc, 1, 'amber');
        if (v === 0) { dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 }); G.sideTag(b, O, Cc, pt(1, 1), 'x', { color: 'amber', size: fs(b, 18), gap: 10 }); }
        else if (v === 1) { ang(b, A, B, Cc, { color: 'sky', r: 36, label: dg(al), size: 16, labelDist: 54 }); ang(b, Cc, O, B, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 46 }); }
        else { G.sideTag(b, O, Cc, pt(1, 1), `${R} cm`, { color: 'sky', size: fs(b, 16), gap: 10 }); dim(b, A, B, pt(0, -2), 'x', { color: 'amber', size: fs(b, 18), off: 28 }); }
      } else {
        if (show(2)) { tick(b, O, Cc, 1, 'amber'); G.sideTag(b, O, Cc, pt(1, 1), `${R} cm`, { color: 'rose', size: fs(b, 16), gap: 10 }); }
        if (show(3)) dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 });
        ang(b, A, O, Cc, { color: 'sky', r: 30, rings: 1, label: dg(al), size: 14, labelDist: 46, noMark: true });
        if (show(2)) { ang(b, B, Cc, A, { color: 'green', r: 28, rings: 2, label: dg(be), size: 14, labelDist: 48 }); ang(b, A, B, Cc, { color: 'sky', r: 28, rings: 1, label: dg(al), size: 14, labelDist: 46 }); }
      }
      [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); b.point(O, { color: 'rose', r: 5.5 });
      T(b, A, 'A', { dx: -14, dy: 4, size: 18 }); T(b, B, 'B', { dx: 14, dy: 4, size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 }); T(b, O, 'O', { dy: 18, size: 18, color: 'rose' });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '∠C=90° → 빗변 AB가 외접원의 지름';
        else if (C.review && st === 2) { row = `외심 O는 AB의 중점: OA=OB=OC=${R} cm`; col = 'rose'; }
        else if (C.review && st === 3) { row = `AB=2×${R}=${2 * R} cm`; col = 'amber'; }
        else row = `외심 O = 빗변의 중점 → R=${R} cm, AB=${2 * R} cm`;
        rowT(b, pt(0, 0), row, { dy: 70, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `$\\angle C=90^{\\circ}$이면 빗변 AB는 외접원의 지름이에요. (한 호에 대한 원주각이 90°)`,
      `따라서 외심 O는 빗변 AB의 중점이에요. $\\overline{OA}=\\overline{OB}=\\overline{OC}=${M.R}$ cm.`,
      `외접원의 반지름은 $R=${fr('\\overline{AB}', 2)}=${fr(String(2 * M.R), 2)}=${M.R}$ cm, 즉 $\\overline{AB}=2R=${2 * M.R}$ cm예요. 또 △OBC가 이등변삼각형이므로 $\\angle OCB=\\angle B=${M.be}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A</b>와 <b>OA=OB=OC</b>를 바꿔 보세요. ∠C=90°인 직각삼각형의 외심 O는 늘 <b>빗변 AB의 중점</b>이에요. 그래서 OC는 빗변의 반이에요.',
      readouts: [rd('∠A · ∠B', `${M.al}° · ${M.be}°`, 'sky'), rd('OA = OB = OC', `${M.R} cm`, 'rose'), rd('빗변 AB', `${2 * M.R} cm`, 'amber', '반지름의 2배', null, true)],
      formula: `<p>R $=\\overline{OA}=\\overline{OB}=\\overline{OC}=${fr('\\overline{AB}', 2)}=${M.R}$ cm</p><p>$\\overline{AB}=2R=${2 * M.R}$ cm</p>`,
      rule: '직각삼각형의 외심은 빗변의 중점이고, 외접원의 반지름은 빗변의 길이의 반이다.',
      notes: notes('직각이 있는 꼭짓점 C가 아니라 <b>빗변의 중점</b>이 외심이에요.', 'OC도 반지름이에요. 직각 꼭짓점에서 빗변의 중점까지의 거리 = 빗변의 반이에요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { al, R, be } = M, key = `${v}:${al}:${R}`;
      const head = '그림에서 ∠C=90°인 직각삼각형 ABC의 외심 O는 빗변 AB의 중점이다.';
      if (v === 0) return numProb({ tag: '직각삼각형의 외심 · 반지름', key, stem: `${head} ${S('AB')}=${2 * R} cm일 때, ${S('OC')}의 길이 $x$는?`, correct: R, wrongs: [[2 * R, '빗변의 길이예요. OC는 외접원의 반지름이라 빗변의 반이에요.'], [3 * R, '다시 계산해 보세요.'], [R + 1, '다시 계산해 보세요.'], [R - 1, '다시 계산해 보세요.'], [R + 2, '다시 계산해 보세요.']].filter((q) => q[0] > 0), ...cmOpts });
      if (v === 1) return numProb({ tag: '직각삼각형의 외심 · 각', key, stem: `${head} ∠A=${al}°일 때, ∠OCB의 크기 $x$는?`, correct: be, wrongs: [[al, '∠A와 같다고 했어요. OC=OB이므로 ∠OCB=∠B예요.'], [90, '직각이에요.'], [2 * be, '다시 생각해 보세요.'], [be + 10, '다시 계산해 보세요.'], [be - 5, '다시 계산해 보세요.']].filter((q) => q[0] !== be), ...degOpts(5) });
      return numProb({ tag: '직각삼각형의 외심 · 빗변', key, stem: `${head} ${S('OC')}=${R} cm일 때, 빗변 ${S('AB')}의 길이 $x$는?`, correct: 2 * R, wrongs: [[R, 'OC의 길이예요. 빗변은 반지름의 2배예요.'], [3 * R, '다시 계산해 보세요.'], [2 * R + 2, '다시 계산해 보세요.'], [2 * R - 1, '다시 계산해 보세요.'], [2 * R + 1, '다시 계산해 보세요.']], ...cmOpts });
    },
    verify: (s) => { const M = o2.model(s), g = M.g; return { ans: dist(g.O, g.C), model: dist(g.O, g.A), extra: [[angBetween(g.C, g.A, g.B), 90], [angBetween(g.A, g.B, g.C), M.al]] }; }
  };

  /* ====================================================================== 3. 30°-60°-90° */
  const o3 = {
    id: 't5-3', title: '30°-60°-90° 직각삼각형의 외심', short: '30°-60°-90°',
    question: '∠A=30°, ∠B=60°, ∠C=90°인 직각삼각형에서 BC와 외접원의 반지름은 어떤 관계일까?',
    ctl: ['trSr'],
    init: (s) => { s.trSr = 5; s.trV = 0; },
    reroll: (s) => { s.trSr = rint(3, 9); s.trV = (s.trV + 1) % 3; },
    model: (s) => ({ R: clamp(Math.round(s.trSr), 3, 9), g: rightGeom(30) }),
    draw(b, s, M, C) {
      const { R, g } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, { x0: -1.25, x1: 1.25, y0: -1.1, y1: 1.1 }, { t: 40, b: C.problem ? (v === 2 ? 64 : 40) : 56, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'sky', width: 2.4, alpha: 0.6, dash: [6, 5] });
      fillPoly(b, [A, B, Cc], 'sky', 0.08); fillPoly(b, [O, B, Cc], 'green', show(2) ? 0.28 : 0.1); poly(b, [A, B, Cc], 'ink', 3.6); line(b, O, Cc, 'rose', 3.2);
      ang(b, Cc, A, B, { color: 'sky', r: 24 });
      tick(b, A, O, 1, 'amber'); tick(b, O, B, 1, 'amber');
      if (C.problem) {
        tick(b, O, Cc, 1, 'amber');
        ang(b, A, B, Cc, { color: 'sky', r: 36, label: '30°', size: 16, labelDist: 56 }); ang(b, B, A, Cc, { color: 'sky', r: 30, label: '60°', size: 16, labelDist: 50 });
        if (v === 0) { dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 }); G.sideTag(b, B, Cc, pt(-1, 1), 'x', { color: 'amber', size: fs(b, 18), gap: 10 }); }
        else if (v === 1) { G.sideTag(b, B, Cc, pt(-1, 1), `${R} cm`, { color: 'sky', size: fs(b, 16), gap: 10 }); dim(b, A, B, pt(0, -2), 'x', { color: 'amber', size: fs(b, 18), off: 28 }); }
        else { dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 }); poly(b, [O, B, Cc], 'amber', 4.2); T(b, pt(0, 1.1), '△OBC의 둘레 = x', { dy: 20, size: fs(b, 17), color: 'amber' }); }
      } else {
        ang(b, A, B, Cc, { color: 'sky', r: 36, label: '30°', size: 14, labelDist: 56 });
        if (show(2)) { ang(b, B, A, Cc, { color: 'green', r: 30, rings: 1, label: '60°', size: 14, labelDist: 50 }); ang(b, Cc, B, O, { color: 'green', r: 26, label: '60°', size: 14, labelDist: 40 }); ang(b, O, Cc, B, { color: 'green', r: 22, label: '60°', size: 14, labelDist: 40 }); tick(b, O, Cc, 1, 'amber'); tick(b, B, Cc, 1, 'amber'); }
        G.sideTag(b, O, Cc, pt(1, 1), `${R} cm`, { color: 'rose', size: fs(b, 15), gap: 10 });
        if (show(3)) G.sideTag(b, B, Cc, pt(-1, 1), `${R} cm`, { color: 'green', size: fs(b, 16), gap: 10 });
        dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 });
      }
      [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); b.point(O, { color: 'rose', r: 5.5 });
      T(b, A, 'A', { dx: -14, dy: 4, size: 18 }); T(b, B, 'B', { dx: 14, dy: 4, size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 }); T(b, O, 'O', { dy: 18, size: 18, color: 'rose' });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '외심 O는 빗변 AB의 중점 → OB=OC=R';
        else if (C.review && st === 2) { row = '△OBC: ∠B=60°, OB=OC → 정삼각형'; col = 'green'; }
        else if (C.review && st === 3) { row = `BC=OB=OC=R=${R} cm`; col = 'green'; }
        else row = `AB=${2 * R} cm → BC=${R} cm (빗변의 반)`;
        rowT(b, pt(0, 0), row, { dy: 70, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `∠C=90°이므로 외심 O는 빗변 AB의 중점이에요. $\\overline{OB}=\\overline{OC}=R=${M.R}$ cm.`,
      `△OBC에서 $\\overline{OB}=\\overline{OC}$이므로 $\\angle OCB=\\angle B=60^{\\circ}$이고, 세 각이 모두 60°예요. 따라서 △OBC는 정삼각형이에요.`,
      `정삼각형이므로 $\\overline{BC}=\\overline{OB}=${M.R}$ cm예요. 즉 $\\overline{BC}=${fr('1', 2)}\\overline{AB}=${fr(String(2 * M.R), 2)}=${M.R}$ cm (∠A=30°일 때 마주 보는 변은 빗변의 반).`
    ],
    view: (M) => ({
      guide: '막대로 <b>외접원의 반지름 R</b>을 바꿔 보세요. 30°-60°-90° 직각삼각형에서 외심 O를 찍으면 <b>△OBC가 정삼각형</b>이 돼요. 그래서 BC=R=AB의 반이에요.',
      readouts: [rd('외접원의 반지름 R', `${M.R} cm`, 'rose'), rd('AB (빗변)', `${2 * M.R} cm`, 'sky'), rd('BC', `${M.R} cm`, 'green', '= R, △OBC는 정삼각형', null, true)],
      formula: `<p>△OBC는 정삼각형 $\\Rightarrow\\ \\overline{BC}=\\overline{OB}=R=${M.R}$ cm</p><p>$\\overline{AB}=2R=${2 * M.R}$ cm</p>`,
      rule: '∠A=30°인 직각삼각형에서 BC = 빗변 AB의 반 = 외접원의 반지름 R이다.',
      notes: notes('∠A=30°의 <b>마주 보는 변</b> BC가 빗변의 반이에요. 다른 직각변 AC는 아니에요.', '정삼각형임을 보이려면 두 변이 같고 한 각이 60°임을 확인해요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { R } = M, key = `${v}:${R}`;
      const head = '그림에서 ∠C=90°, ∠A=30°, ∠B=60°인 직각삼각형 ABC의 외심은 점 O이다.';
      if (v === 0) return numProb({ tag: '30°-60°-90° · 변의 길이', key, stem: `${head} ${S('AB')}=${2 * R} cm일 때, ${S('BC')}의 길이 $x$는?`, correct: R, wrongs: [[2 * R, '빗변의 길이예요. BC는 빗변의 반이에요.'], [R * 3, '다시 계산해 보세요.'], [R + 1, '다시 계산해 보세요.'], [R - 1, '다시 계산해 보세요.'], [R + 2, '다시 계산해 보세요.']].filter((q) => q[0] > 0), ...cmOpts });
      if (v === 1) return numProb({ tag: '30°-60°-90° · 빗변', key, stem: `${head} ${S('BC')}=${R} cm일 때, ${S('AB')}의 길이 $x$는?`, correct: 2 * R, wrongs: [[R, 'BC의 길이예요. 빗변은 BC의 2배예요.'], [3 * R, '다시 계산해 보세요.'], [2 * R + 1, '다시 계산해 보세요.'], [2 * R - 1, '다시 계산해 보세요.'], [2 * R + 2, '다시 계산해 보세요.']], ...cmOpts });
      return numProb({ tag: '30°-60°-90° · 정삼각형 OBC의 둘레', key, stem: `${head} ${S('AB')}=${2 * R} cm일 때, △OBC의 둘레 $x$는?`, correct: 3 * R, wrongs: [[2 * R, '다시 생각해 보세요. △OBC는 정삼각형이에요.'], [R, '한 변의 길이예요.'], [4 * R, '다시 계산해 보세요.'], [3 * R + 1, '다시 계산해 보세요.'], [3 * R - 1, '다시 계산해 보세요.']], ...cmOpts });
    },
    verify: (s) => { const M = o3.model(s), g = M.g; return { ans: dist(g.B, g.C), model: dist(g.O, g.B), extra: [[dist(g.O, g.C), 1], [angBetween(g.B, g.O, g.C), 60]] }; }
  };

  /* ====================================================================== 4. 외심의 각 */
  const o4 = {
    id: 't5-4', title: '외심에서의 각 (x+y+z=90°, ∠BOC=2∠A)', short: '외심의 각',
    question: '외심 O에서 세 꼭짓점을 이으면 생기는 이등변삼각형의 밑각 x, y, z의 합은 얼마일까?',
    ctl: ['trOa', 'trOb'],
    init: (s) => { s.trOa = 60; s.trOb = 65; s.trV = 0; },
    reroll: (s) => { s.trOa = rint(50, 70); s.trOb = rint(50, 70); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const a = clamp(Math.round(s.trOa), 45, 75), b = clamp(Math.round(s.trOb), 45, 75), c = 180 - a - b; return { a, b, c, x: 90 - c, y: 90 - a, z: 90 - b, g: circGeom(a, b, c) }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, x, y, z, g } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawCirc(b, g);
      [[O, A], [O, B], [O, Cc]].forEach(([p, q]) => line(b, p, q, 'rose', 3.2));
      const lab = (val, nm, prob) => (prob ? '' : dg(val) );
      if (C.problem) {
        if (v === 0) { ang(b, B, Cc, O, { color: 'sky', r: 34, label: dg(y), size: 15, labelDist: 54 }); ang(b, Cc, A, O, { color: 'green', r: 34, label: dg(z), size: 15, labelDist: 54 }); ang(b, A, B, O, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 54 }); }
        else if (v === 1) { ang(b, A, B, Cc, { color: 'sky', r: 34, label: dg(a), size: 16, labelDist: 56 }); ang(b, O, B, Cc, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 52 }); }
        else { ang(b, A, B, O, { color: 'amber', r: 34, label: dg(x), size: 15, labelDist: 54 }); ang(b, B, Cc, O, { color: 'sky', r: 34, label: dg(y), size: 15, labelDist: 54 }); ang(b, Cc, A, B, { color: 'green', r: 40, label: 'x', size: 17, labelDist: 62 }); }
      } else {
        const rg = (n) => show(n);
        if (rg(1)) { ang(b, B, A, O, { color: 'amber', r: 34, rings: 1, label: dg(x), size: 14, labelDist: 52 }); ang(b, A, B, O, { color: 'amber', r: 34, rings: 1 }); }
        if (rg(1)) { ang(b, Cc, B, O, { color: 'sky', r: 34, rings: 2, label: dg(y), size: 14, labelDist: 52 }); ang(b, B, Cc, O, { color: 'sky', r: 34, rings: 2 }); }
        if (rg(1)) { ang(b, A, Cc, O, { color: 'green', r: 34, rings: 3, label: dg(z), size: 14, labelDist: 52 }); ang(b, Cc, A, O, { color: 'green', r: 34, rings: 3 }); }
        if (rg(3)) { T(b, mid(B, Cc), `∠BOC=2∠A=${2 * a}°`, { dy: 30, size: fs(b, 14), color: 'rose' }); }
      }
      b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 12, dy: -10, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'OA=OB=OC → 세 이등변삼각형의 밑각 x, y, z';
        else if (C.review && st === 2) { row = `x+y+z=${x}°+${y}°+${z}°=90°`; col = 'green'; }
        else if (C.review && st === 3) { row = `∠BOC=180°−2y=${180 - 2 * y}°=2∠A`; col = 'rose'; }
        else row = `x+y+z=${x + y + z}°, ∠BOC=2∠A=${2 * a}°`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 16), color: col });
      }
      void bb; void c;
    },
    steps: (M) => [
      `외심 O에서 $\\overline{OA}=\\overline{OB}=\\overline{OC}$이므로 △OAB, △OBC, △OCA는 모두 이등변삼각형이에요. 밑각을 각각 $\\angle OAB=\\angle OBA=x$, $\\angle OBC=\\angle OCB=y$, $\\angle OCA=\\angle OAC=z$라 해요.`,
      `삼각형 ABC의 세 내각의 합: $2x+2y+2z=180^{\\circ}$이므로 $x+y+z=90^{\\circ}$ (이 그림: ${M.x}°+${M.y}°+${M.z}°=90°).`,
      `$\\angle A=x+z$이고 $\\angle BOC=180^{\\circ}-2y=2(90^{\\circ}-y)=2(x+z)$이므로 $\\angle BOC=2\\angle A=${2 * M.a}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A, ∠B</b>를 바꿔 보세요. 외심 O에서 세 꼭짓점까지는 같은 거리이므로 이등변삼각형이 셋 생기고, 같은 표시(호의 개수)의 각이 같아요. <b>x+y+z는 늘 90°</b>, <b>∠BOC는 ∠A의 2배</b>예요.',
      readouts: [rd('x (∠OAB=∠OBA)', `${M.x}°`, 'amber'), rd('y (∠OBC=∠OCB)', `${M.y}°`, 'sky'), rd('z (∠OCA=∠OAC)', `${M.z}°`, 'green'), rd('x + y + z', '90°', 'rose', `∠BOC = 2∠A = ${2 * M.a}°`, null, true)],
      formula: `<p>$x+y+z=90^{\\circ}$</p><p>$\\angle BOC=2\\angle A=2\\times${M.a}^{\\circ}=${2 * M.a}^{\\circ}$</p>`,
      rule: '삼각형의 외심에서 세 꼭짓점을 이으면 이등변삼각형 셋이 생기고, 밑각의 합 x+y+z=90°, ∠BOC=2∠A이다.',
      notes: notes('같은 표시의 <b>밑각</b>끼리만 같아요. x, y, z는 서로 달라도 돼요.', '∠BOC는 ∠A의 <b>2배</b>예요. 이 성질은 예각삼각형일 때 성립해요. 둔각삼각형은 다음 장면에서 달라져요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { a, x, y, z, c } = M, key = `${v}:${a}:${M.b}`;
      const head = '그림에서 점 O는 예각삼각형 ABC의 외심이다.';
      if (v === 0) return numProb({ tag: '외심의 각 · x+y+z=90°', key, stem: `${head} ∠OBC=${y}°, ∠OCA=${z}°일 때, ∠OAB의 크기 $x$는?`, correct: x, wrongs: [[y + z, '두 각의 합이에요. x+y+z=90°를 이용해요.'], [180 - y - z, '다시 생각해 보세요.'], [90 + y + z, '다시 계산해 보세요.'], [x + 10, '다시 계산해 보세요.'], [Math.max(1, x - 5), '다시 계산해 보세요.']].filter((q) => q[0] !== x), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '외심의 각 · ∠BOC=2∠A', key, stem: `${head} ∠A=${a}°일 때, ∠BOC의 크기 $x$는?`, correct: 2 * a, wrongs: [[a, '∠A 그대로예요. ∠BOC는 ∠A의 2배예요.'], [180 - 2 * a, '이등변삼각형 OBC의 밑각의 합이에요.'], [90 - a, '다시 생각해 보세요.'], [2 * a + 10, '다시 계산해 보세요.'], [2 * a - 10, '다시 계산해 보세요.']].filter((q) => q[0] > 0), ...degOpts(5) });
      return numProb({ tag: '외심의 각 · ∠C', key, stem: `${head} ∠OAB=${x}°, ∠OBC=${y}°일 때, ∠ACB의 크기 $x$는?`, correct: c, wrongs: [[x + y, 'x+y는 ∠B예요. ∠C=y+z이고 z=90°−x−y예요.'], [90 - y, '다시 생각해 보세요.'], [z, '다시 생각해 보세요.'], [c + 10, '다시 계산해 보세요.'], [c - 5, '다시 계산해 보세요.']].filter((q) => q[0] !== c), ...degOpts(5) });
    },
    verify: (s) => { const M = o4.model(s), g = M.g; return { ans: angBetween(g.O, g.B, g.C), model: 2 * M.a, extra: [[angBetween(g.A, g.B, g.O), M.x], [angBetween(g.B, g.C, g.O), M.y], [angBetween(g.C, g.A, g.O), M.z], [M.x + M.y + M.z, 90]] }; }
  };

  /* ====================================================================== 5. 둔각삼각형의 외심 */
  const o5 = {
    id: 't5-5', title: '둔각삼각형의 외심은 삼각형의 바깥', short: '둔각삼각형의 외심',
    question: '∠A가 둔각인 삼각형의 외심 O는 삼각형 안에 있을까, 밖에 있을까?',
    ctl: ['trQa', 'trQb'],
    init: (s) => { s.trQa = 112; s.trQb = 25; s.trV = 0; },
    reroll: (s) => { s.trQa = pick([100, 104, 110, 116, 120, 126], s.trQa); s.trQb = rint(15, 35); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const a = clamp(Math.round(s.trQa / 2) * 2, 100, 130), b = clamp(Math.round(s.trQb), 15, 40), c = 180 - a - b; return { a, b, c, boc: 360 - 2 * a, g: circGeom(a, b, c) }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, boc, g } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawCirc(b, g);
      [[O, B], [O, Cc], [O, A]].forEach(([p, q]) => line(b, p, q, 'rose', 3.2));
      ang(b, A, B, Cc, { color: 'sky', r: 24, label: C.problem && v === 1 ? 'x' : dg(a), size: 16, labelDist: 40 });
      if (C.problem) { ang(b, O, B, Cc, { color: v === 1 ? 'sky' : 'amber', r: 22, label: v === 1 ? dg(boc) : 'x', size: 17, labelDist: 38 }); if (v === 1) { /* A 의 각이 x */ } }
      else if (show(2)) ang(b, O, B, Cc, { color: 'rose', r: 22, label: dg(boc), size: 15, labelDist: 38 });
      b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 12, dy: -10, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠A=${a}° (둔각) → 외심 O는 삼각형의 바깥`;
        else if (C.review && st === 2) { row = `∠BOC=360°−2∠A=${boc}°`; col = 'rose'; }
        else row = `∠A=${a}° 둔각: O는 밖에 있고 ∠BOC=360°−2×${a}°=${boc}°`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 15), color: col });
      }
      void bb; void c;
    },
    steps: (M) => [
      `∠A=${M.a}°가 둔각이면 외심 O는 삼각형 ABC의 바깥쪽(변 BC 너머)에 놓여요. 세 변의 수직이등분선이 삼각형 밖에서 만나기 때문이에요.`,
      `호 BC(점 A를 지나지 않는 쪽)의 중심각은 $360^{\\circ}-\\angle BOC$이고, 원주각 ∠A는 이 호에 대한 각이므로 $\\angle A=${fr('1', 2)}\\times(360^{\\circ}-\\angle BOC)$예요. 따라서 $\\angle BOC=360^{\\circ}-2\\angle A=360^{\\circ}-2\\times${M.a}^{\\circ}=${M.boc}^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A(둔각)</b>와 ∠B를 바꿔 보세요. ∠A가 90°보다 크면 외심 O는 <b>삼각형 바깥</b>에 있고, ∠BOC는 2∠A가 아니라 <b>360°−2∠A</b>예요.',
      readouts: [rd('∠A (둔각)', `${M.a}°`, 'sky'), rd('외심 O', '삼각형의 바깥', 'rose'), rd('∠BOC', `${M.boc}°`, 'rose', '360° − 2∠A', null, true)],
      formula: `<p>$\\angle BOC=360^{\\circ}-2\\angle A=360^{\\circ}-2\\times${M.a}^{\\circ}=${M.boc}^{\\circ}$</p>`,
      rule: '둔각삼각형의 외심은 삼각형의 바깥에 있고, ∠BOC = 360° − 2∠A (예각삼각형은 2∠A)이다.',
      notes: notes('둔각삼각형에서는 ∠BOC를 <b>2∠A</b>로 쓰면 안 돼요. 360°보다 크거나 정리의 모양이 달라져요.', '직각삼각형의 외심은 변 위(빗변의 중점), 둔각삼각형의 외심은 바깥이에요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 2, { a, boc } = M, key = `${v}:${a}`;
      const head = '그림에서 점 O는 ∠A가 둔각인 삼각형 ABC의 외심이다.';
      if (v === 0) return numProb({ tag: '[함정] 둔각삼각형의 외심 · ∠BOC', key, stem: `${head} ∠A=${a}°일 때, ∠BOC의 크기 $x$는?`, correct: boc, wrongs: [[2 * a, '예각삼각형일 때의 공식이에요. 둔각이면 360°−2∠A예요.'], [180 - 2 * (a - 90), '다시 생각해 보세요.'], [a, '∠A 그대로예요.'], [boc + 10, '다시 계산해 보세요.'], [boc - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== boc && q[0] > 0 && q[0] < 360), ...degOpts(5), valid: (v2) => Number.isInteger(v2) && v2 > 0 && v2 < 360 });
      return numProb({ tag: '[함정] 둔각삼각형의 외심 · ∠A', key, stem: `${head} ∠BOC=${boc}°일 때, ∠A의 크기 $x$는?`, correct: a, wrongs: [[boc / 2, '예각삼각형일 때의 공식이에요. 둔각이면 ∠A=(360°−∠BOC)÷2예요.'], [boc, '∠BOC 그대로예요.'], [180 - boc / 2, '다시 생각해 보세요.'], [a + 10, '다시 계산해 보세요.'], [a - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== a && Number.isInteger(q[0])), ...degOpts(5), valid: (v2) => Number.isInteger(v2) && v2 > 0 && v2 < 360 });
    },
    verify: (s) => { const M = o5.model(s), g = M.g; return { ans: angBetween(g.O, g.B, g.C), model: M.boc, extra: [[angBetween(g.A, g.B, g.C), M.a]] }; }
  };

  /* ====================================================================== 6. 중심각의 비 */
  const validRatio = (a, b, c) => { const S0 = a + b + c; return [a, b, c].every((q) => (360 * q) % S0 === 0 && ((360 * q) / S0) % 2 === 0 && (360 * q) / S0 < 180); };
  const o6 = {
    id: 't5-6', title: '중심각의 비로 구하는 원주각', short: '중심각의 비',
    question: '∠AOB : ∠BOC : ∠COA = a : b : c 일 때 ∠ACB는 얼마일까?',
    ctl: ['trRa', 'trRb', 'trRc'],
    init: (s) => { s.trRa = 2; s.trRb = 3; s.trRc = 4; s.trV = 0; },
    reroll: (s) => { const c = [[2, 3, 4], [3, 4, 5], [2, 3, 5], [3, 3, 4], [1, 2, 3], [4, 5, 6], [3, 4, 5]].filter((q) => validRatio(...q)); const p = pick(c, null); s.trRa = p[0]; s.trRb = p[1]; s.trRc = p[2]; s.trV = (s.trV + 1) % 2; },
    model: (s) => {
      const a = clamp(Math.round(s.trRa), 1, 6), b = clamp(Math.round(s.trRb), 1, 6), c0 = clamp(Math.round(s.trRc), 1, 6);
      let c = c0, ok = validRatio(a, b, c0);
      if (!ok) { for (let k = 1; k <= 6 && !ok; k++) for (const sg of [1, -1]) { const t = c0 + sg * k; if (t >= 1 && t <= 6 && validRatio(a, b, t)) { c = t; ok = true; break; } } }
      if (!ok) { c = 4; const aa = 2, bb = 3; return { a: aa, b: bb, c, adj: true, ...ratioGeo(aa, bb, c) }; }
      return { a, b, c, adj: c !== c0, ...ratioGeo(a, b, c) };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, g, ab, bc, ca } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'sky', width: 2.4, alpha: 0.6, dash: [6, 5] });
      fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.6);
      [[O, A], [O, B], [O, Cc]].forEach(([p, q]) => line(b, p, q, 'rose', 3));
      if (C.problem) {
        ang(b, O, A, B, { color: 'rose', r: 22, label: String(a), size: 15, labelDist: 40 }); ang(b, O, B, Cc, { color: 'green', r: 22, label: String(bb), size: 15, labelDist: 40 }); ang(b, O, Cc, A, { color: 'violet', r: 22, label: String(c), size: 15, labelDist: 40 });
        ang(b, Cc, A, B, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 56 });
      } else {
        ang(b, O, A, B, { color: 'rose', r: 22, label: dg(ab), size: 13, labelDist: 40 }); ang(b, O, B, Cc, { color: 'green', r: 22, label: dg(bc), size: 13, labelDist: 40 }); ang(b, O, Cc, A, { color: 'violet', r: 22, label: dg(ca), size: 13, labelDist: 40 });
        if (show(3)) { ang(b, Cc, A, B, { color: 'amber', r: 34, label: dg(ab / 2), size: 15, labelDist: 56 }); }
      }
      b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 12, dy: -10, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠AOB:∠BOC:∠COA = ${a}:${bb}:${c}, 합 360°`;
        else if (C.review && st === 2) { row = `∠AOB = 360°×${a}/${a + bb + c} = ${ab}°`.replace(/(\d+)\/(\d+)/, '$1÷$2'); col = 'rose'; }
        else if (C.review && st === 3) { row = `∠ACB = ${ab}°÷2 = ${ab / 2}°`; col = 'amber'; }
        else row = `∠AOB=${ab}°, ∠BOC=${bc}°, ∠COA=${ca}° → ∠ACB=${ab / 2}°`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `세 중심각의 합은 $360^{\\circ}$이고 비가 $${M.a}:${M.b}:${M.c}$이므로 비의 합은 $${M.a}+${M.b}+${M.c}=${M.a + M.b + M.c}$예요.`,
      `$\\angle AOB=360^{\\circ}\\times${fr(String(M.a), String(M.a + M.b + M.c))}=${M.ab}^{\\circ}$, $\\angle BOC=${M.bc}^{\\circ}$, $\\angle COA=${M.ca}^{\\circ}$`,
      `한 호에 대한 원주각은 중심각의 반이므로 $\\angle ACB=${fr('1', 2)}\\angle AOB=${fr('1', 2)}\\times${M.ab}^{\\circ}=${M.ab / 2}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>비 a : b : c</b>를 바꿔 보세요. 중심각이 정수(짝수)가 되도록 c를 자동으로 맞춰요. 중심각 ∠AOB의 반이 <b>∠ACB</b>예요.',
      readouts: [rd('비 a : b : c', `${M.a} : ${M.b} : ${M.c}`, 'sky', M.adj ? '정수 각이 되도록 c를 맞췄어요' : null), rd('∠AOB · ∠BOC · ∠COA', `${M.ab}° · ${M.bc}° · ${M.ca}°`, 'rose'), rd('∠ACB', `${M.ab / 2}°`, 'amber', '∠AOB의 반', null, true)],
      formula: `<p>$\\angle AOB=360^{\\circ}\\times${fr(String(M.a), String(M.a + M.b + M.c))}=${M.ab}^{\\circ}$</p><p>$\\angle ACB=${fr('1', 2)}\\times${M.ab}^{\\circ}=${M.ab / 2}^{\\circ}$</p>`,
      rule: '세 중심각의 합은 360°이고, 한 호에 대한 원주각의 크기는 중심각의 크기의 반이다.',
      notes: notes('중심각의 합은 360°예요. 180°가 아니에요.', '∠ACB는 호 AB에 대한 원주각이므로 ∠AOB의 반이에요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, ab, bc, ca } = M, key = `${a}:${bb}:${c}`;
      return numProb({ tag: '중심각의 비와 원주각', key, stem: `그림에서 점 O는 삼각형 ABC의 외심이고 ∠AOB : ∠BOC : ∠COA = ${a} : ${bb} : ${c}이다. ∠ACB의 크기 $x$는?`, correct: ab / 2, wrongs: [[ab, '중심각 ∠AOB예요. ∠ACB는 그 반이에요.'], [bc / 2, '다른 호에 대한 원주각이에요.'], [ca / 2, '다른 호에 대한 원주각이에요.'], [(180 * a) / (a + bb + c), '비의 합이 360°이에요. 180°가 아니에요.'], [ab / 2 + 10, '다시 계산해 보세요.'], [ab / 2 - 10, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== ab / 2 && q[0] > 0), ...degOpts(5) });
    },
    verify: (s) => { const M = o6.model(s), g = M.g; return { ans: angBetween(g.C, g.A, g.B), model: M.ab / 2, extra: [[angBetween(g.O, g.A, g.B), M.ab], [M.ab + M.bc + M.ca, 360]] }; }
  };
  function ratioGeo(a, b, c) {
    const S0 = a + b + c, ab = (360 * a) / S0, bc = (360 * b) / S0, ca = (360 * c) / S0, O = pt(0, 0), A = polar(O, 1, -90), B = polar(O, 1, -90 + ab), Cc = polar(O, 1, -90 + ab + bc);
    return { ab, bc, ca, g: { O, A, B, C: Cc } };
  }

  /* ====================================================================== 7. 외접원의 둘레 */
  const o7 = {
    id: 't5-7', title: '△OBC의 둘레로 구하는 외접원의 둘레', short: '외접원의 둘레',
    question: '△OBC의 둘레와 BC의 길이를 알면 외접원의 반지름과 둘레를 구할 수 있을까?',
    ctl: ['trSr', 'trSa'],
    init: (s) => { s.trSr = 5; s.trSa = 6; s.trV = 0; },
    reroll: (s) => { s.trSr = rint(4, 9); s.trSa = rint(3, 8); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const R = clamp(Math.round(s.trSr), 3, 9), a = clamp(Math.round(s.trSa), 2, Math.min(9, 2 * R - 1)), per = 2 * R + a; return { R, a, per, circ: 2 * R }; },
    draw(b, s, M, C) {
      const { R, a, per } = M, st = C.step, v = (s.trV || 0) % 2;
      const phi = Math.asin(clamp(a / (2 * R), 0.05, 0.98)) / DEG, O = pt(0, 0), B = polar(O, 1, 90 + phi), Cc = polar(O, 1, 90 - phi), A = polar(O, 1, -60);
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'sky', width: 2.6, alpha: 0.75 });
      fillPoly(b, [O, B, Cc], 'rose', 0.14);
      line(b, O, B, 'rose', 3.4); line(b, O, Cc, 'rose', 3.4); line(b, B, Cc, 'ink', 3.6);
      tick(b, O, B, 1, 'amber'); tick(b, O, Cc, 1, 'amber');
      if (C.problem) {
        T(b, mid(B, Cc), `${a} cm`, { dy: -22, size: fs(b, 17), color: 'sky' }); if (v === 0) G.sideTag(b, O, B, pt(1, 0.2), 'R', { color: 'amber', size: fs(b, 18), gap: 8 }); else T(b, O, '원의 둘레 = x', { dy: -48, size: fs(b, 16), color: 'amber' });
        T(b, mid(B, Cc), `△OBC의 둘레 ${per} cm`, { dy: 36, size: fs(b, 15), color: 'rose' });
      } else {
        T(b, mid(B, Cc), `BC = ${a} cm`, { dy: -22, size: fs(b, 16), color: 'sky' });
        if (show(2)) { G.sideTag(b, O, B, pt(1, 0.2), `R = ${R} cm`, { color: 'rose', size: fs(b, 15), gap: 8 }); G.sideTag(b, O, Cc, pt(-1, 0.2), `R = ${R} cm`, { color: 'rose', size: fs(b, 15), gap: 8 }); }
        T(b, mid(B, Cc), `△OBC의 둘레 = ${per} cm`, { dy: 36, size: fs(b, 15), color: 'rose' });
        if (show(3)) T(b, O, `원의 둘레 = ${2 * R}π cm`, { dy: -48, size: fs(b, 15), color: 'amber' });
      }
      b.point(O, { color: 'rose', r: 5.5 }); [B, Cc].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 0, dy: -16, size: 18, color: 'rose' }); T(b, B, 'B', { dx: -14, dy: -8, size: 18 }); T(b, Cc, 'C', { dx: 14, dy: -8, size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `OB=OC=R, BC=${a} cm, 둘레 ${per} cm`;
        else if (C.review && st === 2) { row = `2R+${a}=${per} → R=${R} cm`; col = 'rose'; }
        else if (C.review && st === 3) { row = `2πR = 2π×${R} = ${2 * R}π cm`; col = 'amber'; }
        else row = `R=${R} cm → 외접원의 둘레 ${2 * R}π cm`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `외심 O에서 두 꼭짓점 B, C까지의 거리는 외접원의 반지름이므로 $\\overline{OB}=\\overline{OC}=R$이에요. △OBC의 둘레는 $2R+\\overline{BC}=${M.per}$ cm예요.`,
      `$2R+${M.a}=${M.per}$에서 $2R=${M.per - M.a}$, 따라서 $R=${M.R}$ cm예요.`,
      `외접원의 둘레는 $2\\pi R=2\\pi\\times${M.R}=${2 * M.R}\\pi$ (cm)예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>R</b>과 <b>BC</b>를 바꿔 보세요(BC는 2R보다 작아요). △OBC의 둘레는 <b>2R+BC</b>예요. 거꾸로 둘레와 BC를 알면 R을 구할 수 있고, 외접원의 둘레는 <b>2πR</b>이에요.',
      readouts: [rd('R', `${M.R} cm`, 'rose'), rd('BC', `${M.a} cm`, 'sky'), rd('△OBC의 둘레', `${M.per} cm`, 'rose', '2R + BC'), rd('외접원의 둘레', `${M.circ}π cm`, 'amber', '2πR', null, true)],
      formula: `<p>$2R+\\overline{BC}=${M.per}$ → $R=${fr(`${M.per}-${M.a}`, 2)}=${M.R}$ (cm)</p><p>(원의 둘레) $=2\\pi R=${M.circ}\\pi$ (cm)</p>`,
      rule: '외심에서 두 꼭짓점까지의 거리는 모두 외접원의 반지름 R이다. △OBC의 둘레 = 2R + BC, 외접원의 둘레 = 2πR.',
      notes: notes('△OBC의 둘레에는 BC도 들어 있어요. <b>둘레에서 BC를 먼저 빼고</b> 2로 나눠요.', '원의 둘레는 2πR이에요. 반지름 R과 지름 2R을 헷갈리지 마세요.')
    }),
    prob: (M, s) => {
      const { R, a, per } = M, v = (s.trV || 0) % 2, key = `${v}:${R}:${a}`;
      const head = `그림에서 점 O는 삼각형 ABC의 외심이고 △OBC의 둘레는 ${per} cm, ${S('BC')}=${a} cm이다.`;
      if (v === 0) return numProb({ tag: '외접원의 반지름', key, stem: `${head} 삼각형 ABC의 외접원의 반지름 $R$은?`, correct: R, wrongs: [[per - a, '2R이에요. 반으로 나누어야 해요.'], [per, '둘레 그대로예요.'], [(per - a) / 2 + 1, '다시 계산해 보세요.'], [(per - a) / 2 - 1, '다시 계산해 보세요.'], [per / 2, '다시 생각해 보세요. BC를 빼야 해요.']].filter((q) => Number.isInteger(q[0]) && q[0] > 0 && q[0] !== R), ...cmOpts });
      const pi = { tex: (x) => `${x}\\pi\\text{ cm}`, plain: (x) => `${x}π cm`, pad: 2, valid: (x) => Number.isInteger(x) && x > 0 };
      return numProb({ tag: '외접원의 둘레', key, stem: `${head} 삼각형 ABC의 외접원의 둘레는?`, correct: 2 * R, wrongs: [[R, '반지름이에요. 둘레는 2πR이에요.'], [R * R, '넓이의 공식이에요.'], [per - a, '2R이에요. 둘레는 2πR이에요.'], [4 * R, '다시 계산해 보세요.'], [2 * R + 2, '다시 계산해 보세요.']].filter((q) => q[0] !== 2 * R), ...pi });
    },
    verify: (s) => { const M = o7.model(s); return { ans: (M.per - M.a) / 2, model: M.R }; }
  };

  G.register(50, 't5', '⑤ 외심', '외심', PARAMS, [o1, o2, o3, o4, o5, o6, o7]);
})();
