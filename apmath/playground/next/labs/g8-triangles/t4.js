/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ④ 「각의 이등분선·수직이등분선」 (t4.js, order 40) — 장면 6개
   · b1 각의 이등분선 위의 점 P   · 점 P를 이등분선 위에서 가로로 끌어 PE=PF 확인 (RHA)
   · b2 PE=PF이면 이등분선        · 거리 PE, PF를 따로 조절 → 같을 때만 P가 이등분선 위 (RHS)
   · b3 수직이등분선 위의 점 P    · 점 P를 수직이등분선 위에서 가로로 끌어 PA=PB 확인 (SAS)
   · b4 이등분선과 넓이의 비       · AB:AC = △ABD : △ACD
   · b5 거리는 수선의 길이         · 비스듬한 선분은 더 길다 (PQ > PE)
   · b6 중점 M, MD=ME             · ∠B, ∠C 조절 → MD=ME일 때 ∠B=∠C (RHS)
   각은 정수(도), 길이는 정수(cm)만 보입니다. 피타고라스 정리(√)는 쓰지 않습니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, angBetween, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, numProb, mkStmtChoices, mkTextChoices, degOpts, cmOpts, rd, notes, fmtN, dg, bboxOf, fs, dim, foot, triBC } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG), tan = (d) => Math.tan(d * DEG);
  const S = (n) => `$\\overline{${n}}$`;
  const fr = (n, d) => `\\frac{${n}}{${d}}`;
  const gcdf = (a, b) => (b ? gcdf(b, a % b) : a);

  const PARAMS = {
    trBh: P('∠XOP = ∠YOP', 15, 40, 1, 25, { color: 'sky', format: (v) => v + '°' }),
    trBd: P('PE = PF', 2, 8, 1, 4, { color: 'amber', hint: '점 P를 가로로 끌어도 돼요', format: (v) => v + ' cm' }),
    trB1: P('PE', 2, 8, 1, 4, { color: 'sky', format: (v) => v + ' cm' }),
    trB2: P('PF', 2, 8, 1, 4, { color: 'green', format: (v) => v + ' cm' }),
    trBm: P('AM = BM', 2, 6, 1, 3, { color: 'sky', format: (v) => v + ' cm' }),
    trBq: P('PM', 1, 9, 1, 4, { color: 'amber', hint: '점 P를 수직이등분선 위에서 가로로 끌어도 돼요', format: (v) => v + ' cm' }),
    trBc: P('AB', 4, 12, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    trBb: P('AC', 4, 12, 1, 3, { color: 'green', format: (v) => v + ' cm' }),
    trBa: P('∠A', 40, 100, 2, 70, { color: 'amber', format: (v) => v + '°' }),
    trBe: P('EQ', 0, 6, 1, 3, { color: 'rose', hint: '점 Q를 변 OX 위에서 가로로 끌어도 돼요', format: (v) => v + ' cm' }),
    trCb: P('∠B', 30, 75, 1, 50, { color: 'sky', format: (v) => v + '°' }),
    trCc: P('∠C', 30, 75, 1, 50, { color: 'green', format: (v) => v + '°' })
  };

  // O=(0,0), 변 OX 는 위쪽(각 −h), 변 OY 는 아래쪽(각 +h), 이등분선은 가로축. PE=d1(변 OX까지), PF=d2(변 OY까지)
  function angGeom(h, d1, d2) {
    const O = pt(0, 0), u1 = pt(cos(h), -sin(h)), u2 = pt(cos(h), sin(h));
    const Pp = pt((d1 + d2) / (2 * sin(h)), (d1 - d2) / (2 * cos(h)));
    // 위 식에서 y 부호: d1 이 크면 P 는 OX(위쪽) 쪽에서 멀다 → 아래로(+y)
    const E = foot(Pp, O, u1), F = foot(Pp, O, u2), L = Math.max(dist(O, E), dist(O, F)) + 1.1 + Math.max(d1, d2) * 0.1;
    return { O, u1, u2, P: Pp, E, F, X: mul(u1, L), Y: mul(u2, L) };
  }
  function drawAngle(b, g, o = {}) {
    const { O, P: Pp, E, F, X, Y } = g;
    line(b, O, X, 'ink', 3.6); line(b, O, Y, 'ink', 3.6);
    b.point(O, { color: 'ink', r: 4.5 });
    T(b, X, 'X', { dx: 8, dy: -14, size: 18 }); T(b, Y, 'Y', { dx: 8, dy: 14, size: 18 }); T(b, O, 'O', { dx: -16, dy: 6, size: 18 });
  }

  /* ====================================================================== 1. 각의 이등분선 위의 점 */
  const b1 = {
    id: 't4-1', title: '각의 이등분선 위의 점', short: '이등분선 위의 점',
    question: '각의 이등분선 위의 점 P에서 그 각의 두 변까지의 거리는 어떤 관계일까?',
    ctl: ['trBh', 'trBd'],
    init: (s) => { s.trBh = 25; s.trBd = 4; s.trV = 0; },
    reroll: (s) => { s.trBh = pick([20, 25, 30, 35, 40], s.trBh); s.trBd = rint(3, 8); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const h = clamp(Math.round(s.trBh), 15, 40), d = clamp(Math.round(s.trBd), 2, 8); return { h, d, g: angGeom(h, d, d), rest: 90 - h }; },
    draw(b, s, M, C) {
      const { h, d, g } = M, { O, P: Pp, E, F, X, Y } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([O, X, Y, Pp, E, F]), { t: 46, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const cen = pt(Pp.x * 0.5, 0), show = (k) => (C.problem ? false : C.review ? st >= k : true);
      if (show(2)) { fillPoly(b, [O, E, Pp], 'sky', 0.2); fillPoly(b, [O, F, Pp], 'green', 0.2); } else fillPoly(b, [O, X, Y], 'sky', 0.06);
      drawAngle(b, g);
      line(b, O, Pp, 'green', 3.2, { dash: [7, 5] });
      line(b, Pp, E, 'amber', 3.4); line(b, Pp, F, 'amber', 3.4);
      ang(b, E, O, Pp, { color: 'amber', r: 18 }); ang(b, F, O, Pp, { color: 'amber', r: 18 });
      ang(b, O, X, Pp, { color: 'sky', r: 40, rings: 1, cut: [0, 7] }); ang(b, O, Pp, Y, { color: 'sky', r: 40, rings: 1, cut: [7, 0] });
      if (C.problem) {
        if (v === 1) T(b, O, dg(h), { dx: 62, dy: -16, size: fs(b, 16), color: 'sky' });
        if (v === 0) { G.sideTag(b, Pp, E, pt(-50, 0), `${d} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, Pp, F, pt(-50, 0), 'x', { color: 'amber', size: fs(b, 18), gap: 6 }); }
        else if (v === 1) ang(b, Pp, E, F, { color: 'amber', r: 36, label: 'x', size: 17, labelDist: 50 });
      } else {
        tick(b, Pp, E, 2, 'rose'); tick(b, Pp, F, 2, 'rose');
        G.sideTag(b, Pp, E, pt(-50, 0), `${d} cm`, { color: 'rose', size: fs(b, 16), gap: 6 }); G.sideTag(b, Pp, F, pt(-50, 0), `${d} cm`, { color: 'rose', size: fs(b, 16), gap: 6 });
        if (show(1)) T(b, O, dg(h), { dx: 66, dy: -14, size: fs(b, 14), color: 'sky' });
        if (show(3)) { ang(b, Pp, O, E, { color: 'green', r: 34, rings: 2 }); ang(b, Pp, O, F, { color: 'green', r: 34, rings: 2 }); T(b, Pp, dg(90 - h), { dx: -52, dy: -22, size: fs(b, 14), color: 'green' }); T(b, Pp, dg(90 - h), { dx: -52, dy: 22, size: fs(b, 14), color: 'green' }); }
      }
      [Pp, E, F].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, Pp, 'P', { dx: 14, dy: -2, size: 18, color: 'amber' }); T(b, E, 'E', { dx: 4, dy: -14, size: 18 }); T(b, F, 'F', { dx: 4, dy: 16, size: 18 });
      if (!C.thumb && !C.problem && !C.review) b.handle('P', Pp, { color: 'amber', r: 8, ariaLabel: '점 P를 이등분선 위에서 가로로 끌기', drag: (w) => { s.trBd = clamp(Math.round(w.x * sin(h)), 2, 8); } });
      else b.point(Pp, { color: 'amber', r: 5.5 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'PE⊥OX, PF⊥OY (거리 = 수선의 길이)';
        else if (C.review && st === 2) { row = '△POE ≡ △POF (RHA)'; col = 'green'; }
        else if (C.review && st === 3) { row = `PE=PF=${d} cm`; col = 'rose'; }
        else row = `PE=PF=${d} cm  (∠POE=∠POF=${h}°)`;
        rowT(b, pt(Pp.x * 0.5, Math.max(Y.y, F.y)), row, { dy: 40, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `점 P에서 두 변 OX, OY에 내린 수선의 발을 E, F라 하면 $\\overline{PE}\\perp\\overline{OX}$, $\\overline{PF}\\perp\\overline{OY}$이고, PE, PF의 길이가 각각 점 P에서 두 변까지의 거리예요.`,
      `△POE와 △POF에서 $\\angle PEO=\\angle PFO=90^{\\circ}$, $\\overline{OP}$는 공통, $\\angle POE=\\angle POF=${M.h}^{\\circ}$이므로 △POE≡△POF (RHA 합동)이에요.`,
      `대응변의 길이가 같으므로 $\\overline{PE}=\\overline{PF}=${M.d}$ cm예요. 즉 각의 이등분선 위의 점은 두 변에서 같은 거리에 있어요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠XOP</b>와 <b>PE=PF</b>를 바꾸거나 점 P를 이등분선 위에서 가로로 끌어 보세요. P가 어디에 있어도 두 변까지의 거리 <b>PE와 PF는 같아요</b>.',
      readouts: [rd('∠XOP = ∠YOP', `${M.h}°`, 'sky'), rd('PE = PF', `${M.d} cm`, 'rose'), rd('∠OPE = ∠OPF', `${M.rest}°`, 'green', '90° − ∠XOP', null, true)],
      formula: `<p>△POE≡△POF (RHA)</p><p>$\\overline{PE}=\\overline{PF}=${M.d}$ cm, $\\angle OPE=\\angle OPF=${M.rest}^{\\circ}$</p>`,
      rule: '각의 이등분선 위의 한 점에서 그 각의 두 변까지의 거리는 같다.',
      notes: notes('거리는 <b>수선의 길이</b>예요. 비스듬한 선분은 거리가 아니에요.', 'P가 이등분선 <b>위</b>에 있을 때만 PE=PF예요.')
    }),
    prob: (M, s) => {
      const { h, d, rest } = M, v = (s.trV || 0) % 3, key = `${v}:${h}:${d}`;
      const head = `그림에서 점 P는 ∠XOY의 이등분선 위의 점이고, 점 E, F는 P에서 두 변 OX, OY에 내린 수선의 발이다.`;
      if (v === 0) return numProb({ tag: '각의 이등분선 위의 점 · 거리', key, stem: `${head} ${S('PE')}=${d} cm일 때, ${S('PF')}의 길이 $x$는?`, correct: d, wrongs: [[d * 2, '두 배가 아니에요. 이등분선 위의 점은 두 변에서 같은 거리에 있어요.'], [d + 1, '다시 생각해 보세요.'], [d - 1, '다시 생각해 보세요.'], [d + 2, '다시 생각해 보세요.'], [d - 2, '다시 생각해 보세요.']], ...cmOpts });
      if (v === 1) return numProb({ tag: '각의 이등분선 위의 점 · 각', key, stem: `${head} ∠XOP=${h}°일 때, ∠EPF의 크기 $x$는?`, correct: 180 - 2 * h, wrongs: [[90 - h, '∠OPE의 크기예요. ∠EPF는 ∠OPE의 2배예요.'], [2 * h, '∠XOY의 크기예요.'], [180 - h, '다시 생각해 보세요.'], [90, '직각이에요.'], [180 - 2 * h + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== 180 - 2 * h), ...degOpts(5) });
      const pool = [
        { h: '$\\overline{PE}=\\overline{PF}$', f: () => true }, { h: '$\\angle OPE=\\angle OPF$', f: () => true }, { h: '$\\overline{OE}=\\overline{OF}$', f: () => true }, { h: '$\\triangle POE\\equiv\\triangle POF$', f: () => true }, { h: '$\\angle PEO=90^{\\circ}$', f: () => true },
        { h: '$\\overline{PE}=\\overline{OE}$', f: (m) => Math.abs(dist(m.g.P, m.g.E) - dist(m.g.O, m.g.E)) < 1e-6 }, { h: '$\\overline{OP}=\\overline{PE}$', f: (m) => Math.abs(dist(m.g.O, m.g.P) - dist(m.g.P, m.g.E)) < 1e-6 }, { h: '$\\angle POE=\\angle OPE$', f: (m) => Math.abs(m.h - m.rest) < 1e-6 }, { h: '$\\overline{OE}=\\overline{PE}$', f: (m) => Math.abs(dist(m.g.O, m.g.E) - dist(m.g.P, m.g.E)) < 1e-6 }, { h: '$\\overline{OP}=\\overline{EF}$', f: (m) => Math.abs(dist(m.g.O, m.g.P) - dist(m.g.E, m.g.F)) < 1e-6 }
      ];
      const t = (s.trV % 2 === 0), r = mkStmtChoices(pool, M, key + (t ? 'T' : 'F'), t);
      return { tag: t ? '각의 이등분선 위의 점 · 옳은 것' : '각의 이등분선 위의 점 · 옳지 않은 것', key: key + (t ? 'T' : 'F'), stem: `${head} 다음 중 ${t ? '옳은' : '옳지 않은'} 것은?`, choices: r.choices, wide: true };
    },
    verify: (s) => { const M = b1.model(s), g = M.g; return { ans: dist(g.P, g.E), model: dist(g.P, g.F), extra: [[dist(g.P, g.E), M.d], [angBetween(g.O, g.X, g.P), M.h]] }; }
  };

  /* ====================================================================== 2. PE=PF 이면 이등분선 */
  const b2 = {
    id: 't4-2', title: 'PE=PF이면 이등분선 위의 점', short: '거리가 같으면',
    question: '각의 두 변까지의 거리가 같은 점 P는 어디에 있을까?',
    ctl: ['trBh', 'trB1', 'trB2'],
    init: (s) => { s.trBh = 25; s.trB1 = 4; s.trB2 = 4; s.trV = 0; },
    reroll: (s) => { s.trBh = pick([20, 25, 30, 35, 40], s.trBh); s.trV = (s.trV + 1) % 2; s.trM = rint(3, 8); },
    model: (s) => { const h = clamp(Math.round(s.trBh), 15, 40), d1 = clamp(Math.round(s.trB1), 2, 8), d2 = clamp(Math.round(s.trB2), 2, 8); return { h, d1, d2, eq: d1 === d2, g: angGeom(h, d1, d2), m: s.trM || 5 }; },
    draw(b, s, M, C) {
      const eqF = C.problem || C.review ? true : M.eq;
      const h = M.h, d1 = C.problem || C.review ? M.d1 : M.d1, d2 = C.problem || C.review ? M.d1 : M.d2;
      const g = C.problem || C.review ? angGeom(h, d1, d1) : M.g, { O, P: Pp, E, F, X, Y } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([O, X, Y, Pp, E, F]), { t: 46, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      fillPoly(b, [O, X, Y], 'sky', 0.06);
      drawAngle(b, g);
      line(b, Pp, E, 'amber', 3.4); line(b, Pp, F, 'amber', 3.4);
      ang(b, E, O, Pp, { color: 'amber', r: 18 }); ang(b, F, O, Pp, { color: 'amber', r: 18 });
      if (C.problem) {
        tick(b, Pp, E, 2, 'rose'); tick(b, Pp, F, 2, 'rose'); line(b, O, Pp, 'ink', 3, { dash: [7, 5] });
        if (v === 0) { ang(b, O, Pp, E, { color: 'amber', r: 30 }); T(b, O, 'x', { dx: 54 * cos(h / 2), dy: -54 * sin(h / 2), size: 18, color: 'amber' }); ang(b, O, X, Y, { color: 'sky', r: 58 }); T(b, O, dg(2 * h), { dx: 92 * cos(h / 2), dy: 92 * sin(h / 2), size: fs(b, 16), color: 'sky' }); }
        else { G.sideTag(b, Pp, E, pt(-50, 0), `${M.m} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); ang(b, O, X, Pp, { color: 'amber', r: 40, label: dg(h), size: 16, labelDist: 62 }); ang(b, O, Pp, Y, { color: 'amber', r: 40, label: 'x', size: 17, labelDist: 62 }); }
        if (v === 0) {}
      } else {
        G.sideTag(b, Pp, E, pt(-50, 0), `${d1} cm`, { color: 'rose', size: fs(b, 16), gap: 6 }); G.sideTag(b, Pp, F, pt(-50, 0), `${d2} cm`, { color: 'rose', size: fs(b, 16), gap: 6 });
        if (eqF) { tick(b, Pp, E, 2, 'rose'); tick(b, Pp, F, 2, 'rose'); line(b, O, Pp, 'green', 3.4); ang(b, O, X, Pp, { color: 'sky', r: 40, rings: 1, label: dg(h), size: 14, labelDist: 62 }); ang(b, O, Pp, Y, { color: 'sky', r: 40, rings: 1, label: dg(h), size: 14, labelDist: 62 }); }
        else line(b, O, Pp, 'ink', 3, { dash: [7, 5], alpha: 0.7 });
      }
      [Pp, E, F].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, Pp, 'P', { dx: 14, dy: -2, size: 18, color: 'amber' }); T(b, E, 'E', { dx: 4, dy: -14, size: 18 }); T(b, F, 'F', { dx: 4, dy: 16, size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = eqF ? 'green' : 'sky';
        if (C.review && st === 1) row = 'PE=PF, ∠PEO=∠PFO=90°';
        else if (C.review && st === 2) { row = '△POE ≡ △POF (RHS, OP 공통)'; col = 'green'; }
        else if (C.review && st === 3) { row = `∠POE=∠POF=${h}° → OP는 이등분선`; col = 'green'; }
        else row = M.eq ? `PE=PF=${d1} cm → ∠POE=∠POF (P가 이등분선 위에 있어요)` : `PE=${d1} cm ≠ PF=${d2} cm → P는 이등분선 위가 아니에요`;
        rowT(b, pt(Pp.x * 0.5, Math.max(Y.y, F.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `점 P에서 두 변에 내린 수선의 발을 E, F라 하면 $\\angle PEO=\\angle PFO=90^{\\circ}$이고 $\\overline{PE}=\\overline{PF}$예요.`,
      `△POE와 △POF에서 $\\angle PEO=\\angle PFO=90^{\\circ}$, $\\overline{OP}$는 공통(빗변), $\\overline{PE}=\\overline{PF}$이므로 △POE≡△POF (RHS 합동)이에요.`,
      `대응각의 크기가 같으므로 $\\angle POE=\\angle POF$예요. 즉 OP는 ∠XOY의 이등분선이에요. (이 그림에서는 각각 ${M.h}°)`
    ],
    view: (M) => ({
      guide: '막대로 <b>PE</b>와 <b>PF</b>를 따로 바꿔 보세요. 두 길이가 <b>같을 때만</b> 점 P가 이등분선 위에 놓이고 ∠POE=∠POF가 돼요. 다르면 점 P는 한쪽으로 치우쳐요.',
      readouts: [rd('PE', `${M.d1} cm`, 'sky'), rd('PF', `${M.d2} cm`, 'green'), rd('점 P', M.eq ? '이등분선 위' : '이등분선 위가 아니에요', M.eq ? 'green' : 'rose', null, null, true)],
      status: M.eq ? { tone: 'ok', text: 'PE=PF — OP는 ∠XOY의 이등분선' } : { tone: 'info', text: 'PE와 PF가 같아지는 곳을 찾아보세요' },
      formula: `<p>$\\overline{PE}=\\overline{PF}\\ \\Rightarrow\\ \\triangle POE\\equiv\\triangle POF$ (RHS)</p><p>$\\Rightarrow\\ \\angle POE=\\angle POF$</p>`,
      rule: '각의 두 변에서 같은 거리에 있는 점은 그 각의 이등분선 위에 있다.',
      notes: notes('합동 조건은 RHS예요. 공통인 <b>빗변 OP</b>와 <b>PE=PF</b>를 써요.', '거리가 같을 때만이에요. 다르면 점 P는 이등분선 위가 아니에요.')
    }),
    prob: (M, s) => {
      const { h, m } = M, v = (s.trV || 0) % 2, key = `${v}:${h}:${m}`;
      const head = `그림에서 점 E, F는 점 P에서 ∠XOY의 두 변 OX, OY에 내린 수선의 발이고 ${S('PE')}=${S('PF')}이다.`;
      if (v === 0) return numProb({ tag: '이등분선의 역 · 각', key, stem: `${head} ∠XOY=${2 * h}°일 때, ∠POE의 크기 $x$는?`, correct: h, wrongs: [[2 * h, '∠XOY의 크기예요. OP가 이등분하므로 ∠POE는 그 반이에요.'], [90 - h, '∠OPE의 크기예요.'], [h * 2 - 10, '다시 계산해 보세요.'], [h + 10, '다시 계산해 보세요.'], [h - 5, '다시 계산해 보세요.']], ...degOpts(5) });
      return numProb({ tag: '이등분선의 역 · 각', key, stem: `${head} ∠XOP=${h}°일 때, ∠POY의 크기 $x$는?`, correct: h, wrongs: [[2 * h, '∠XOY의 크기예요.'], [90 - h, '∠OPE의 크기예요.'], [180 - h, '다시 생각해 보세요.'], [h + 10, '다시 계산해 보세요.'], [h - 5, '다시 계산해 보세요.']], ...degOpts(5) });
    },
    verify: (s) => { const M = b2.model(s), g = M.g; return { ans: M.eq ? 1 : 0, model: Math.abs(angBetween(g.O, g.X, g.P) - angBetween(g.O, g.P, g.Y)) < 1e-6 ? 1 : 0 }; }
  };

  /* ====================================================================== 3. 수직이등분선 위의 점 */
  // AB 세로(A 위, B 아래), M 중점=원점, 수직이등분선은 가로축. P=(q,0)
  const b3 = {
    id: 't4-3', title: '수직이등분선 위의 점', short: '수직이등분선 위의 점',
    question: '선분 AB의 수직이등분선 위의 점 P에서 두 끝점 A, B까지의 거리는 어떤 관계일까?',
    ctl: ['trBm', 'trBq'],
    init: (s) => { s.trBm = 3; s.trBq = 4; s.trV = 0; },
    reroll: (s) => { s.trBm = rint(2, 6); s.trBq = rint(2, 8); s.trV = (s.trV + 1) % 3; s.trM = rint(5, 12); s.trAl = pick([20, 24, 30, 34, 40, 44], s.trAl || 30); },
    model: (s) => { const m = clamp(Math.round(s.trBm), 2, 6), q = clamp(Math.round(s.trBq), 1, 9); return { m, q, A: pt(0, -m), B: pt(0, m), Mm: pt(0, 0), Pp: pt(q, 0), pm: s.trM || 7, al: s.trAl || 30 }; },
    draw(b, s, M, C) {
      const { m, q, A, B, Mm, Pp, al, pm } = M, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Pp, pt(-1.2, 0), pt(q + 1.2, 0)]), { t: 50, b: C.problem ? 54 : 92, l: 56, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      line(b, pt(-1.2, 0), pt(q + 1.2, 0), 'green', 3, { dash: [8, 6] });
      line(b, A, B, 'ink', 3.8);
      if (show(2) || !C.review) { fillPoly(b, [A, Mm, Pp], 'sky', 0.16); fillPoly(b, [B, Mm, Pp], 'violet', 0.16); }
      line(b, Pp, A, 'ink', 3.4); line(b, Pp, B, 'ink', 3.4);
      ang(b, Mm, A, Pp, { color: 'green', r: 20 }); ang(b, Mm, B, Pp, { color: 'green', r: 20 });
      tick(b, A, Mm, 1, 'amber'); tick(b, Mm, B, 1, 'amber');
      if (C.problem) {
        if (v === 0) { G.sideTag(b, Pp, A, pt(-50, 0), `${pm} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, Pp, B, pt(-50, 0), 'x', { color: 'amber', size: fs(b, 18), gap: 6 }); }
        else if (v === 1) { ang(b, A, B, Pp, { color: 'sky', r: 30, label: dg(al), size: 16, labelDist: 52 }); ang(b, B, A, Pp, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 52 }); }
        else { ang(b, Pp, A, Mm, { color: 'sky', r: 34, label: dg(al), size: 16, labelDist: 56 }); ang(b, Pp, A, B, { color: 'amber', r: 44, label: 'x', size: 17, labelDist: 70 }); }
      } else {
        if (show(3)) { tick(b, Pp, A, 2, 'rose'); tick(b, Pp, B, 2, 'rose'); }
        G.sideTag(b, A, Mm, pt(50, 0), `${m} cm`, { color: 'amber', size: fs(b, 15), gap: 6 }); G.sideTag(b, Mm, B, pt(50, 0), `${m} cm`, { color: 'amber', size: fs(b, 15), gap: 6 });
        G.sideTag(b, Mm, Pp, pt(0, -50), `${q} cm`, { color: 'sky', size: fs(b, 15), gap: 8 });
        if (show(3)) { ang(b, A, Mm, Pp, { color: 'violet', r: 40, rings: 2 }); }
      }
      [A, B, Mm, Pp].forEach((z) => b.point(z, { color: z === Pp ? 'amber' : 'ink', r: z === Pp ? 5.5 : 4.5 }));
      T(b, A, 'A', { dx: -14, dy: -6, size: 18 }); T(b, B, 'B', { dx: -14, dy: 8, size: 18 }); T(b, Mm, 'M', { dx: -14, dy: -2, size: 18 }); T(b, Pp, 'P', { dx: 14, dy: -2, size: 18, color: 'amber' });
      T(b, pt(-1.2, 0), 'l', { dx: -2, dy: -14, size: 17 });
      if (!C.thumb && !C.problem && !C.review) b.handle('P', Pp, { color: 'amber', r: 8, ariaLabel: '점 P를 수직이등분선 위에서 가로로 끌기', drag: (w) => { s.trBq = clamp(Math.round(w.x), 1, 9); } });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `AM=BM=${m} cm, l⊥AB`;
        else if (C.review && st === 2) { row = '△PAM ≡ △PBM (SAS)'; col = 'green'; }
        else if (C.review && st === 3) { row = 'PA=PB'; col = 'rose'; }
        else row = `AM=BM=${m} cm, PM=${q} cm → PA=PB`;
        rowT(b, pt(q / 2, B.y), row, { dy: 44, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `직선 l은 선분 AB의 수직이등분선이므로 $\\overline{AM}=\\overline{BM}=${M.m}$ cm이고 $\\angle PMA=\\angle PMB=90^{\\circ}$이에요.`,
      `△PAM과 △PBM에서 $\\overline{AM}=\\overline{BM}$, $\\angle PMA=\\angle PMB=90^{\\circ}$, $\\overline{PM}$은 공통이므로 △PAM≡△PBM (SAS 합동)이에요.`,
      `대응변의 길이가 같으므로 $\\overline{PA}=\\overline{PB}$예요. 즉 수직이등분선 위의 점은 선분의 양 끝점에서 같은 거리에 있어요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AM=BM</b>과 <b>PM</b>을 바꾸거나 점 P를 수직이등분선 위에서 가로로 끌어 보세요. P가 어디에 있어도 <b>PA=PB</b>예요.',
      readouts: [rd('AM = BM', `${M.m} cm`, 'amber'), rd('PM', `${M.q} cm`, 'sky'), rd('PA와 PB', '길이가 같아요', 'rose', null, null, true)],
      formula: `<p>△PAM≡△PBM (SAS)</p><p>$\\overline{PA}=\\overline{PB}$</p>`,
      rule: '선분의 수직이등분선 위의 한 점에서 그 선분의 양 끝점까지의 거리는 같다.',
      notes: notes('합동 조건은 SAS예요. 끼인각 90°를 꼭 확인해요.', '이 성질은 <b>수직이등분선 위</b>의 점에서만 성립해요. 선분 AB 위의 다른 점에서는 아니에요.')
    }),
    prob: (M, s) => {
      const { pm, al } = M, v = (s.trV || 0) % 3, key = `${v}:${pm}:${al}`;
      const head = `그림에서 직선 l은 선분 AB의 수직이등분선이고, 점 M은 AB와 l의 교점이며 점 P는 l 위의 점이다.`;
      if (v === 0) return numProb({ tag: '수직이등분선 위의 점 · 길이', key, stem: `${head} ${S('PA')}=${pm} cm일 때, ${S('PB')}의 길이 $x$는?`, correct: pm, wrongs: [[pm * 2, '두 배가 아니에요. 수직이등분선 위의 점은 두 끝점에서 같은 거리에 있어요.'], [pm + 1, '다시 생각해 보세요.'], [pm - 1, '다시 생각해 보세요.'], [Math.floor(pm / 2), '반이 아니에요.'], [pm + 2, '다시 생각해 보세요.']], ...cmOpts });
      if (v === 1) return numProb({ tag: '수직이등분선 위의 점 · 각', key, stem: `${head} ∠PAB=${al}°일 때, ∠PBA의 크기 $x$는?`, correct: al, wrongs: [[90 - al, '다시 생각해 보세요. △PAB는 PA=PB인 이등변삼각형이에요.'], [180 - 2 * al, '꼭지각 ∠APB예요.'], [2 * al, '다시 생각해 보세요.'], [al + 10, '다시 계산해 보세요.'], [al - 5, '다시 계산해 보세요.']], ...degOpts(5) });
      return numProb({ tag: '수직이등분선 위의 점 · 각', key, stem: `${head} ∠APM=${al}°일 때, ∠APB의 크기 $x$는?`, correct: 2 * al, wrongs: [[al, '∠APM의 크기예요. ∠APB는 ∠APM의 2배예요.'], [90 - al, '∠PAM의 크기예요.'], [180 - 2 * al, '다시 생각해 보세요.'], [2 * al + 10, '다시 계산해 보세요.'], [2 * al - 10, '다시 계산해 보세요.']], ...degOpts(5) });
    },
    verify: (s) => { const M = b3.model(s); return { ans: dist(M.Pp, M.A), model: dist(M.Pp, M.B) }; }
  };

  /* ====================================================================== 4. 이등분선과 넓이의 비 */
  function areaGeom(c, bb, a) {
    const A = pt(0, 0), B = pt(c * cos(a / 2), -c * sin(a / 2)), Cc = pt(bb * cos(a / 2), bb * sin(a / 2));
    // 이등분선(가로축)과 BC의 교점 D: B + t(C−B) 에서 y=0
    const t = B.y / (B.y - Cc.y), D = pt(B.x + t * (Cc.x - B.x), 0);
    return { A, B, C: Cc, D, E: foot(D, A, B), F: foot(D, A, Cc) };
  }
  const b4 = {
    id: 't4-4', title: '각의 이등분선과 넓이의 비', short: '이등분선과 넓이비',
    question: '삼각형 ABC에서 ∠A의 이등분선 AD가 나누는 두 삼각형 ABD, ACD의 넓이의 비는?',
    ctl: ['trBc', 'trBb', 'trBa'],
    init: (s) => { s.trBc = 5; s.trBb = 3; s.trBa = 70; s.trV = 0; },
    reroll: (s) => { const c = rint(4, 12); let b2 = rint(4, 12); if (b2 === c) b2 = c > 4 ? c - 1 : c + 1; s.trBc = c; s.trBb = b2; s.trBa = pick([50, 60, 70, 80, 90], s.trBa); s.trK = rint(2, 9); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const c = clamp(Math.round(s.trBc), 4, 12), bb = clamp(Math.round(s.trBb), 4, 12), a = clamp(Math.round(s.trBa / 2) * 2, 40, 100), g = gcdf(c, bb); return { c, b: bb, a, rc: c / g, rb: bb / g, geo: areaGeom(c, bb, a), k: s.trK || 4 }; },
    draw(b, s, M, C) {
      const { c, b: bb, a, rc, rb, geo, k } = M, { A, B, C: Cc, D, E, F } = geo, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([A, B, Cc, D, E, F]), { t: 50, b: C.problem ? 50 : 92, l: 44, r: 48 });
      const cen = pt(D.x * 0.6, 0), show = (n) => (C.problem ? false : C.review ? st >= n : true);
      fillPoly(b, [A, B, D], 'sky', 0.2); fillPoly(b, [A, D, Cc], 'green', 0.2);
      poly(b, [A, B, Cc], 'ink', 3.6); line(b, A, D, 'ink', 3.4, { dash: [8, 5] });
      if (!C.problem) { line(b, D, E, 'amber', 3.2); line(b, D, F, 'amber', 3.2);
      ang(b, E, A, D, { color: 'amber', r: 16 }); ang(b, F, A, D, { color: 'amber', r: 16 }); }
      ang(b, A, B, D, { color: 'sky', r: 34, rings: 1, cut: [0, 7] }); ang(b, A, D, Cc, { color: 'sky', r: 34, rings: 1, cut: [7, 0] });
      if (!C.problem) { tick(b, D, E, 2, 'rose'); tick(b, D, F, 2, 'rose'); }
      if (C.problem) {
        const area1 = k * c, area2 = k * bb;
        G.sideTag(b, A, B, pt(D.x, 5), `${c} cm`, { color: "sky", size: fs(b, 16), gap: 30 }); G.sideTag(b, A, Cc, pt(D.x, -5), `${bb} cm`, { color: "green", size: fs(b, 16), gap: 30 });
        T(b, pt(mid(A, mid(B, D)).x, mid(A, mid(B, D)).y), v === 0 ? `${area1} cm²` : 'x', { size: fs(b, 16), color: v === 0 ? 'sky' : 'amber', dx: 0, dy: 0 });
        T(b, pt(mid(A, mid(Cc, D)).x, mid(A, mid(Cc, D)).y), v === 0 ? 'x' : `${area2} cm²`, { size: fs(b, 18), color: v === 0 ? 'amber' : 'green' });
      } else {
        G.sideTag(b, A, B, pt(D.x, 5), `${c} cm`, { color: "sky", size: fs(b, 16), gap: 30 }); G.sideTag(b, A, Cc, pt(D.x, -5), `${bb} cm`, { color: "green", size: fs(b, 16), gap: 30 });
        T(b, A, dg(a / 2), { dx: 58, dy: -12, size: fs(b, 14), color: 'sky' }); T(b, A, dg(a / 2), { dx: 58, dy: 14, size: fs(b, 14), color: 'sky' });
        if (show(3)) { T(b, mid(A, mid(B, D)), `△ABD`, { size: fs(b, 14), color: 'sky' }); T(b, mid(A, mid(Cc, D)), `△ACD`, { size: fs(b, 14), color: 'green' }); }
      }
      (C.problem ? [A, B, Cc, D] : [A, B, Cc, D, E, F]).forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, A, 'A', { dx: -16, dy: 0, size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, D, 'D', { dx: 14, dy: 0, size: 18 }); if (!C.problem) { tagOut(b, E, cen, 'E', { size: 17 }); tagOut(b, F, cen, 'F', { size: 17 }); }
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'DE⊥AB, DF⊥AC → DE=DF (이등분선 위의 점)';
        else if (C.review && st === 2) { row = `△ABD = \\frac{1}{2}×AB×DE, △ACD = \\frac{1}{2}×AC×DF`; col = 'green'; }
        else if (C.review && st === 3) { row = `△ABD : △ACD = AB : AC = ${c} : ${bb} = ${rc} : ${rb}`; col = 'amber'; }
        else row = `AB:AC = ${c} : ${bb} = ${rc} : ${rb}  →  △ABD : △ACD = ${rc} : ${rb}`;
        rowT(b, pt(D.x * 0.5, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `점 D에서 AB, AC에 내린 수선의 발을 E, F라 하면 D는 ∠A의 이등분선 위의 점이므로 $\\overline{DE}=\\overline{DF}$예요.`,
      `$\\triangle ABD=${fr('1', 2)}\\times\\overline{AB}\\times\\overline{DE}$, $\\triangle ACD=${fr('1', 2)}\\times\\overline{AC}\\times\\overline{DF}$이고 DE=DF이므로 높이가 같아요.`,
      `따라서 $\\triangle ABD:\\triangle ACD=\\overline{AB}:\\overline{AC}=${M.c}:${M.b}=${M.rc}:${M.rb}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AB</b>, <b>AC</b>, <b>∠A</b>를 바꿔 보세요. ∠A를 이등분하는 선 AD가 나눈 두 삼각형의 넓이의 비는 <b>늘 AB : AC</b>예요.',
      readouts: [rd('AB : AC', `${M.c} : ${M.b}`, 'sky', `간단히 ${M.rc} : ${M.rb}`), rd('△ABD : △ACD', `${M.rc} : ${M.rb}`, 'amber', '넓이의 비', null, true), rd('DE = DF', '같아요', 'rose')],
      formula: `<p>$\\triangle ABD:\\triangle ACD=${fr('1', 2)}\\overline{AB}\\cdot\\overline{DE}:${fr('1', 2)}\\overline{AC}\\cdot\\overline{DF}$</p><p>$=\\overline{AB}:\\overline{AC}=${M.c}:${M.b}=${M.rc}:${M.rb}$</p>`,
      rule: '각의 이등분선이 나눈 두 삼각형은 높이(DE=DF)가 같으므로 넓이의 비는 밑변의 길이의 비(AB : AC)와 같다.',
      notes: notes('넓이의 비는 <b>밑변 AB, AC</b>의 비예요. BD:CD가 아니라 AB:AC로 써요.', '높이 DE, DF가 같다는 것은 D가 <b>이등분선 위</b>에 있기 때문이에요.')
    }),
    prob: (M, s) => {
      const { c, b: bb, k } = M, v = (s.trV || 0) % 2, a1 = k * c, a2 = k * bb, key = `${v}:${c}:${bb}:${k}`;
      const ar = { tex: (x) => `${x}\\text{ cm}^2`, plain: (x) => x + ' cm²', pad: 2, valid: (x) => Number.isInteger(x) && x > 0 };
      const head = `그림과 같은 삼각형 ABC에서 AD는 ∠A의 이등분선이고 ${S('AB')}=${c} cm, ${S('AC')}=${bb} cm이다.`;
      if (v === 0) return numProb({ tag: '이등분선과 넓이의 비', key, stem: `${head} △ABD의 넓이가 ${a1} cm²일 때, △ACD의 넓이 $x$는?`, correct: a2, wrongs: [[a1, '넓이가 같지 않아요. 넓이의 비는 AB : AC예요.'], [(a1 * c) / bb, '비를 거꾸로 썼어요. △ABD : △ACD = AB : AC예요.'], [a1 + (bb - c), '넓이의 차가 아니라 비로 구해요.'], [a2 + 2, '다시 계산해 보세요.'], [a2 - 2, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== a2), ...ar });
      return numProb({ tag: '이등분선과 넓이의 비', key, stem: `${head} △ACD의 넓이가 ${a2} cm²일 때, △ABD의 넓이 $x$는?`, correct: a1, wrongs: [[a2, '넓이가 같지 않아요. 넓이의 비는 AB : AC예요.'], [(a2 * bb) / c, '비를 거꾸로 썼어요.'], [a2 + (c - bb), '넓이의 차가 아니라 비로 구해요.'], [a1 + 2, '다시 계산해 보세요.'], [a1 - 2, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== a1), ...ar });
    },
    verify: (s) => { const M = b4.model(s), g = M.geo; const ar = (X, Y, Z) => Math.abs(G.polyArea([X, Y, Z])); return { ans: ar(g.A, g.B, g.D) / ar(g.A, g.C, g.D), model: M.c / M.b, extra: [[dist(g.D, g.E), dist(g.D, g.F)], [angBetween(g.A, g.B, g.D), M.a / 2]] }; }
  };

  /* ====================================================================== 5. 거리는 수선의 길이 */
  const b5 = {
    id: 't4-5', title: '거리는 수선의 길이 (비스듬한 선분은 더 길다)', short: '거리는 수선의 길이',
    question: '점 P에서 변 OX 위의 여러 점까지 선분을 그으면 그중 가장 짧은 것은?',
    ctl: ['trBh', 'trBd', 'trBe'],
    init: (s) => { s.trBh = 25; s.trBd = 4; s.trBe = 3; s.trV = 0; s.trOf = [-3, -1, 0, 2, 4]; },
    reroll: (s) => { s.trBh = pick([20, 25, 30, 35], s.trBh); s.trBd = rint(3, 8); s.trBe = rint(1, 6); s.trV = (s.trV + 1) % 3; const pool = [-4, -3, -2, -1, 1, 2, 3, 4], o = []; while (o.length < 4) { const x = pool[rint(0, 7)]; if (!o.includes(x)) o.push(x); } o.push(0); s.trOf = o.sort((p, q) => p - q); },
    model: (s) => { const h = clamp(Math.round(s.trBh), 15, 40), d = clamp(Math.round(s.trBd), 2, 8), q = clamp(Math.round(s.trBe), 0, 6), g = angGeom(h, d, d), Q = add(g.E, mul(g.u1, q)); return { h, d, q, g, Q, of: s.trOf || [-3, -1, 0, 2, 4] }; },
    draw(b, s, M, C) {
      const v = (s.trV || 0) % 3;
      if (C.problem && v === 0) {
        const of = M.of, Pp = pt(0, -3), pts = of.map((x) => pt(x, 0)), nm = ['A', 'B', 'C', 'D', 'E'];
        fit(b, bboxOf([pt(-5, -3.4), pt(5, 0.5)]), { t: 40, b: 50, l: 44, r: 44 });
        line(b, pt(-5, 0), pt(5, 0), 'ink', 3.4);
        pts.forEach((p) => line(b, Pp, p, 'ink', 3));
        pts.forEach((p, i) => { b.point(p, { color: 'ink', r: 4 }); T(b, p, nm[i], { dy: 18, size: 17 }); });
        b.point(Pp, { color: 'amber', r: 5 }); T(b, Pp, 'P', { dy: -16, size: 18, color: 'amber' }); T(b, pt(5, 0), 'l', { dy: -14, size: 17 });
        return;
      }
      const { h, d, q } = M, st = C.step, show = (k) => (C.problem ? false : C.review ? st >= k : true);
      if (!C.problem) { // 직선 l, 점 P, 수선의 발 E, 비스듬한 선분 PQ
        const Pp = pt(0, -d), E = pt(0, 0), Q = pt(q, 0);
        fit(b, { x0: -7.5, x1: 7.5, y0: -8.6, y1: 0.5 }, { t: 40, b: C.thumb ? 20 : 96, l: 40, r: 40 });
        line(b, pt(-7.5, 0), pt(7.5, 0), 'ink', 3.4);
        fillPoly(b, [Pp, E, Q], 'rose', q > 0 ? 0.12 : 0);
        line(b, Pp, E, 'amber', 4); line(b, Pp, Q, show(2) ? 'rose' : 'ink', 3.4);
        ang(b, E, Pp, Q, { color: 'amber', r: 20 });
        G.sideTag(b, Pp, E, pt(50, 0), `PE = ${d} cm`, { color: 'amber', size: fs(b, 16), gap: 8 });
        if (q > 0) dim(b, E, Q, pt(0, -5), `EQ = ${q} cm`, { color: 'rose', size: fs(b, 15), off: 24 });
        if (show(3) && q > 0) T(b, mid(Pp, Q), 'PQ', { dx: 16, dy: -8, size: fs(b, 16), color: 'rose' });
        [Pp, E, Q].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
        T(b, Pp, 'P', { dx: 0, dy: -16, size: 18, color: 'amber' }); T(b, E, 'E', { dx: -14, dy: 16, size: 18 }); if (q > 0) T(b, Q, 'Q', { dx: 6, dy: 16, size: 18, color: 'rose' }); T(b, pt(7.5, 0), 'l', { dx: 0, dy: -14, size: 17 });
        if (!C.thumb && !C.review) b.handle('Q', Q, { color: 'rose', r: 8, ariaLabel: '점 Q를 직선 l 위에서 가로로 끌기', drag: (w) => { s.trBe = clamp(Math.round(w.x), 0, 6); } });
        if (!C.thumb) {
          let row, col = 'sky';
          if (C.review && st === 1) row = `PE⊥l 이므로 거리는 PE=${d} cm`;
          else if (C.review && st === 2) { row = 'PQ는 비스듬한 선분'; col = 'rose'; }
          else if (C.review && st === 3) { row = '직각삼각형 PEQ에서 빗변 PQ > 직각변 PE'; col = 'rose'; }
          else row = q === 0 ? `Q가 E와 같아지면 PQ=PE=${d} cm` : `PQ는 PE=${d} cm보다 길어요 (PQ > PE)`;
          rowT(b, pt(0, 0), row, { dy: 62, size: fs(b, 16), color: col });
        }
        return;
      }
      // 문제 (이등분선 위의 점 P, 변 OX 위의 점 Q)
      const g = M.g, qp = Math.max(1, M.q), { O, P: Pp, E, F, Y } = g, Q = add(E, mul(g.u1, qp)), X = mul(g.u1, dist(O, Q) + 1);
      fit(b, bboxOf([O, X, Y, Pp, E, F, Q]), { t: 46, b: 50, l: 50, r: 50 });
      drawAngle(b, { ...g, X });
      line(b, O, Pp, 'green', 3, { dash: [7, 5] });
      line(b, Pp, E, 'amber', 3.6); line(b, Pp, F, 'amber', 3.6); if (v === 2) line(b, Pp, Q, 'ink', 3.4);
      ang(b, E, O, Pp, { color: 'amber', r: 18 }); ang(b, F, O, Pp, { color: 'amber', r: 18 });
      ang(b, O, X, Pp, { color: 'sky', r: 40, cut: [0, 7] }); ang(b, O, Pp, Y, { color: 'sky', r: 40, cut: [7, 0] });
      if (v === 1) { G.sideTag(b, Pp, E, pt(-50, 0), `${d} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, Pp, F, pt(-50, 0), 'x', { color: 'amber', size: fs(b, 18), gap: 6 }); }
      [Pp, E, F].concat(v === 2 ? [Q] : []).forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, Pp, 'P', { dx: 14, dy: -2, size: 18, color: 'amber' }); T(b, E, 'E', { dx: -14, dy: -14, size: 18 }); T(b, F, 'F', { dx: 4, dy: 16, size: 18 }); if (v === 2) T(b, Q, 'Q', { dx: 6, dy: -14, size: 18 });
    },
    steps: (M) => [
      `점 P에서 변 OX까지의 거리는 P에서 OX에 내린 <b>수선의 길이</b>예요. $\\overline{PE}\\perp\\overline{OX}$이므로 거리는 $\\overline{PE}=${M.d}$ cm예요.`,
      `변 OX 위의 다른 점 Q에 대하여 선분 PQ는 비스듬한 선분이에요. △PEQ는 $\\angle PEQ=90^{\\circ}$인 직각삼각형이에요.`,
      `직각삼각형에서 빗변(PQ)이 직각을 낀 변(PE)보다 길어요. 따라서 $\\overline{PQ}\\gt\\overline{PE}$ (Q가 E와 같을 때만 같아요). 이등분선 위의 점이라도 PE=PF는 <b>수선의 길이끼리</b>만 같아요.`
    ],
    view: (M) => ({
      guide: '점 Q를 변 OX 위에서 가로로 끌거나 막대로 EQ를 바꿔 보세요. Q가 E에서 멀어질수록 <b>PQ가 길어져요</b>. 점과 직선 사이의 거리는 가장 짧은 선분, 즉 <b>수선의 길이</b>예요.',
      readouts: [rd('거리 PE', `${M.d} cm`, 'amber'), rd('EQ', `${M.q} cm`, 'rose'), rd('PQ와 PE', M.q === 0 ? 'PQ = PE' : 'PQ > PE', M.q === 0 ? 'green' : 'rose', null, null, true)],
      status: M.q === 0 ? { tone: 'ok', text: 'Q=E — 수선이에요' } : { tone: 'info', text: 'PQ는 거리가 아니에요 (PQ > PE)' },
      formula: `<p>PE⊥OX 이므로 (거리) $=\\overline{PE}=${M.d}$ cm</p><p>$\\overline{PQ}\\gt\\overline{PE}$ (빗변 &gt; 직각변)</p>`,
      rule: '점에서 직선까지의 거리는 그 점에서 직선에 내린 수선의 길이이고, 비스듬한 선분은 그보다 길다.',
      notes: notes('거리를 구할 때는 <b>수선의 길이</b>를 재요. 비스듬한 선분은 거리가 아니에요.', '이등분선 위의 점에서 두 변에 <b>수선</b>을 내렸을 때만 PE=PF예요. 점 Q가 있는 비스듬한 선분은 다른 길이를 가져요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { h, d, of } = M, key = `${v}:${h}:${d}:${of.join(',')}`;
      if (v === 0) {
        const nm = ['A', 'B', 'C', 'D', 'E'], ok = of.indexOf(0);
        return { tag: '점과 직선 사이의 거리', key, stem: '그림에서 점 P에서 직선 l까지의 거리를 나타내는 선분은?', choices: nm.map((q, i) => ({ h: `$\\overline{P${q}}$`, p: `선분 P${q}`, ok: i === ok, hint: '거리는 점에서 직선에 내린 수선의 길이예요. 가장 짧은 선분을 찾아보세요.' })), note: '가장 짧은 선분이 거리예요' };
      }
      if (v === 1) return numProb({ tag: '각의 이등분선 위의 점 · 거리', key, stem: `그림에서 점 P는 ∠XOY의 이등분선 위의 점이고, 점 E, F는 P에서 두 변 OX, OY에 내린 수선의 발이다. ${S('PE')}=${d} cm일 때, 점 P에서 변 OY까지의 거리 ${S('PF')}의 길이 $x$는?`, correct: d, wrongs: [[d * 2, '두 배가 아니에요.'], [d + 1, '다시 생각해 보세요.'], [d - 1, '다시 생각해 보세요.'], [d + 2, '다시 생각해 보세요.'], [d - 2, '다시 생각해 보세요.']], ...cmOpts });
      const pool = [
        { h: '$\\overline{PE}=\\overline{PF}$', f: () => true }, { h: '$\\overline{PE}\\perp\\overline{OX}$', f: () => true }, { h: '$\\overline{PQ}\\ge\\overline{PE}$', f: () => true }, { h: '점 P에서 OX까지의 거리는 $\\overline{PE}$의 길이이다.', f: () => true },
        { h: '$\\overline{PQ}=\\overline{PE}$', f: () => false }, { h: '$\\overline{PQ}\\lt\\overline{PE}$', f: () => false }, { h: '$\\overline{PQ}=\\overline{PF}$', f: () => false }, { h: '점 P에서 OX까지의 거리는 $\\overline{PQ}$의 길이이다.', f: () => false }
      ];
      const r = mkStmtChoices(pool, M, key, true);
      return { tag: '[함정] 거리와 비스듬한 선분', key, stem: `그림에서 점 P는 ∠XOY의 이등분선 위의 점이고, 점 E, F는 P에서 두 변에 내린 수선의 발, 점 Q는 변 OX 위의 점이다. 다음 중 옳은 것은?`, choices: r.choices, wide: true };
    },
    verify: (s) => { const M = b5.model(s); return { ans: dist(M.g.P, M.Q) >= dist(M.g.P, M.g.E) - 1e-9 ? 1 : 0, model: 1 }; }
  };

  /* ====================================================================== 6. 중점 M, MD=ME */
  function midGeom(bd, cd) {
    const [A, B0, C0] = triBC(2, bd, cd), A2 = A, Bp = pt(0, 0), Cp = pt(2, 0), Mm = pt(1, 0);
    return { A: A2, B: Bp, C: Cp, M: Mm, D: foot(Mm, Bp, A2), E: foot(Mm, Cp, A2) };
  }
  const b6 = {
    id: 't4-6', title: '중점 M에서 두 변에 내린 수선이 같으면', short: 'MD=ME',
    question: '변 BC의 중점 M에서 두 변 AB, AC에 내린 수선의 길이 MD, ME가 같으면 삼각형 ABC는 어떤 삼각형일까?',
    ctl: ['trCb', 'trCc'],
    init: (s) => { s.trCb = 50; s.trCc = 50; s.trV = 0; s.trM = 7; },
    reroll: (s) => { s.trCb = pick([36, 40, 44, 50, 54, 60, 66], s.trCb); s.trV = (s.trV + 1) % 3; s.trM = rint(4, 12); },
    model: (s) => { const bd = clamp(Math.round(s.trCb), 30, 75), cd = clamp(Math.round(s.trCc), 30, 75); return { b: bd, c: cd, eq: bd === cd, m: s.trM || 7 }; },
    draw(b, s, M, C) {
      const bd = M.b, cd = C.review || C.problem ? M.b : M.c, v = (s.trV || 0) % 3, st = C.step;
      const g = midGeom(bd, cd), { A, B, C: Cc, M: Mm, D, E } = g, eq = bd === cd;
      fit(b, bboxOf([A, B, Cc, D, E]), { t: 50, b: C.problem ? 54 : 92, l: 50, r: 50 });
      const cen = pt(1, A.y * 0.3), show = (k) => (C.problem ? false : C.review ? st >= k : true);
      fillPoly(b, [B, Mm, D], 'sky', 0.2); fillPoly(b, [Cc, Mm, E], 'green', 0.2);
      poly(b, [A, B, Cc], 'ink', 3.6); line(b, Mm, D, 'amber', 3.2); line(b, Mm, E, 'amber', 3.2);
      ang(b, D, B, Mm, { color: 'amber', r: 16 }); ang(b, E, Cc, Mm, { color: 'amber', r: 16 });
      tick(b, B, Mm, 1, 'amber'); tick(b, Mm, Cc, 1, 'amber');
      if (C.problem) {
        tick(b, Mm, D, 2, 'rose'); tick(b, Mm, E, 2, 'rose');
        if (v === 0) { ang(b, B, Cc, A, { color: 'sky', r: 34, label: dg(M.b), size: 16, labelDist: 54 }); ang(b, Cc, A, B, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 54 }); }
        else if (v === 1) { ang(b, A, B, Cc, { color: 'sky', r: 40, label: dg(180 - 2 * M.b), size: 16, labelDist: 62 }); ang(b, B, A, Cc, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 56 }); }
        else { G.sideTag(b, A, B, cen, `${M.m} cm`, { color: 'sky', size: fs(b, 16), gap: 8, dy: -22 }); G.sideTag(b, A, Cc, cen, 'x', { color: 'amber', size: fs(b, 18), gap: 8, dy: -22 }); }
      } else {
        ang(b, B, Cc, A, { color: eq ? 'green' : 'sky', r: 32, rings: 2, label: dg(bd), size: 15, labelDist: 52 });
        ang(b, Cc, A, B, { color: eq ? 'green' : 'rose', r: 32, rings: eq ? 2 : 3, label: dg(cd), size: 15, labelDist: 52 });
        if (eq && show(3)) ang(b, A, B, Cc, { color: 'amber', r: 34, rings: 1, label: dg(180 - 2 * bd), size: 15, labelDist: 56 });
        if (eq) { tick(b, Mm, D, 2, 'rose'); tick(b, Mm, E, 2, 'rose'); }
      }
      [A, B, Cc, Mm, D, E].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, Mm, 'M', { dy: 18, size: 18 }); tagOut(b, D, cen, 'D', { size: 17 }); tagOut(b, E, cen, 'E', { size: 17 });
      if (!C.thumb && !C.problem) {
        let row, col = eq ? 'green' : 'rose';
        if (C.review && st === 1) row = 'BM=CM, MD=ME, ∠BDM=∠CEM=90°';
        else if (C.review && st === 2) { row = '△BMD ≡ △CME (RHS) → ∠B=∠C'; col = 'green'; }
        else if (C.review && st === 3) { row = `∠A=180°−2×${bd}°=${180 - 2 * bd}°`; col = 'amber'; }
        else row = eq ? `MD=ME → ∠B=∠C=${bd}°, ∠A=${180 - 2 * bd}°` : `∠B=${bd}° ≠ ∠C=${cd}° → MD≠ME`;
        rowT(b, pt(1, 0), row, { dy: b.W < 560 ? 44 : 54, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `중점 M이므로 $\\overline{BM}=\\overline{CM}$이고, 수선이므로 $\\angle BDM=\\angle CEM=90^{\\circ}$, 조건에서 $\\overline{MD}=\\overline{ME}$예요.`,
      `△BMD와 △CME에서 $\\angle D=\\angle E=90^{\\circ}$, $\\overline{BM}=\\overline{CM}$(빗변), $\\overline{MD}=\\overline{ME}$이므로 △BMD≡△CME (RHS 합동)이에요. 대응각이므로 $\\angle B=\\angle C=${M.b}^{\\circ}$예요.`,
      `삼각형 ABC의 내각의 합에서 $\\angle A=180^{\\circ}-2\\times\\angle B=180^{\\circ}-2\\times${M.b}^{\\circ}=${180 - 2 * M.b}^{\\circ}$이고, $\\angle B=\\angle C$이므로 $\\overline{AB}=\\overline{AC}$ (이등변삼각형)이에요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠B</b>와 <b>∠C</b>를 바꿔 보세요. 중점 M에서 AB, AC에 내린 수선의 길이 <b>MD와 ME가 같을 때는 ∠B=∠C</b>일 때뿐이에요. 같을 때 눈금(=)이 나타나요.',
      readouts: [rd('∠B', `${M.b}°`, 'sky'), rd('∠C', `${M.c}°`, M.eq ? 'green' : 'rose'), rd('MD와 ME', M.eq ? '같아요' : '달라요', M.eq ? 'green' : 'rose'), rd('∠A', M.eq ? `${180 - 2 * M.b}°` : `${180 - M.b - M.c}°`, 'amber', null, null, true)],
      status: M.eq ? { tone: 'ok', text: 'MD=ME → 이등변삼각형 (∠B=∠C)' } : { tone: 'info', text: '∠B와 ∠C가 달라서 MD≠ME예요' },
      formula: `<p>△BMD≡△CME (RHS) $\\Rightarrow\\ \\angle B=\\angle C$</p><p>$\\angle A=180^{\\circ}-2\\times${M.b}^{\\circ}=${180 - 2 * M.b}^{\\circ}$ (∠B=∠C일 때)</p>`,
      rule: '변 BC의 중점 M에서 두 변 AB, AC에 내린 수선의 길이가 같으면 ∠B=∠C이고 삼각형 ABC는 이등변삼각형이다.',
      notes: notes('합동 조건은 RHS예요. 빗변 BM=CM과 직각변 MD=ME를 써요.', '∠B=∠C일 때만 MD=ME가 성립해요. 둘이 다르면 수선의 길이도 달라요.')
    }),
    prob: (M, s) => {
      const { b: bd, m } = M, v = (s.trV || 0) % 3, key = `${v}:${bd}:${m}`;
      const head = `그림과 같은 삼각형 ABC에서 점 M은 변 BC의 중점이고, 점 M에서 두 변 AB, AC에 내린 수선의 발을 각각 D, E라 하면 ${S('MD')}=${S('ME')}이다.`;
      if (v === 0) return numProb({ tag: '중점에서 내린 수선 · ∠C', key, stem: `${head} ∠B=${bd}°일 때, ∠C의 크기 $x$는?`, correct: bd, wrongs: [[180 - 2 * bd, '∠A의 크기예요. ∠C는 ∠B와 같아요.'], [90 - bd, '다시 생각해 보세요.'], [90, '직각이에요.'], [bd + 10, '다시 계산해 보세요.'], [bd - 5, '다시 계산해 보세요.']].filter((q) => q[0] !== bd), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '중점에서 내린 수선 · ∠A', key, stem: `${head} ∠A=${180 - 2 * bd}°일 때, ∠B의 크기 $x$는?`, correct: bd, wrongs: [[180 - 2 * bd, '∠A의 크기예요.'], [(180 - 2 * bd) / 2, '다시 생각해 보세요.'], [90 - bd, '다시 생각해 보세요.'], [bd + 10, '다시 계산해 보세요.'], [bd - 5, '다시 계산해 보세요.']].filter((q) => q[0] !== bd), ...degOpts(5) });
      return numProb({ tag: '중점에서 내린 수선 · 변의 길이', key, stem: `${head} ${S('AB')}=${m} cm일 때, ${S('AC')}의 길이 $x$는?`, correct: m, wrongs: [[m * 2, '두 배가 아니에요. ∠B=∠C이면 AB=AC예요.'], [m + 1, '다시 생각해 보세요.'], [m - 1, '다시 생각해 보세요.'], [m + 2, '다시 생각해 보세요.'], [Math.max(1, m - 2), '다시 생각해 보세요.']].filter((q) => q[0] !== m), ...cmOpts });
    },
    verify: (s) => { const M = b6.model(s), g = midGeom(M.b, M.b); return { ans: dist(g.M, g.D), model: dist(g.M, g.E), extra: [[angBetween(g.A, g.B, g.C), angBetween(g.A, g.C, g.B)]] }; }
  };

  G.register(40, 't4', '④ 각의 이등분선·수직이등분선', '이등분선·수직이등분선', PARAMS, [b1, b2, b3, b4, b5, b6]);
})();
