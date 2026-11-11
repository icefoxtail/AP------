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
    trBb: P('AC', 4, 12, 1, 4, { color: 'green', format: (v) => v + ' cm' }),
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
      // Keep the upper ray name below the inquiry/review status badge.
      fit(b, bboxOf([O, X, Y, Pp, E, F]), { t: !C.thumb && !C.problem ? 70 : 46, b: C.problem ? 50 : 92, l: 50, r: 50 });
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
      T(b, pt(-1.2, 0), 'ℓ', { dx: -2, dy: -14, size: 17 });
      if (!C.thumb && !C.problem && !C.review) b.handle('P', Pp, { color: 'amber', r: 8, ariaLabel: '점 P를 수직이등분선 위에서 가로로 끌기', drag: (w) => { s.trBq = clamp(Math.round(w.x), 1, 9); } });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `AM=BM=${m} cm, ℓ⊥AB`;
        else if (C.review && st === 2) { row = '△PAM ≡ △PBM (SAS)'; col = 'green'; }
        else if (C.review && st === 3) { row = 'PA=PB'; col = 'rose'; }
        else row = `AM=BM=${m} cm, PM=${q} cm → PA=PB`;
        rowT(b, pt(q / 2, B.y), row, { dy: 44, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `직선 ℓ은 선분 AB의 수직이등분선이므로 $\\overline{AM}=\\overline{BM}=${M.m}$ cm이고 $\\angle PMA=\\angle PMB=90^{\\circ}$이에요.`,
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
      const head = `그림에서 직선 ℓ은 선분 AB의 수직이등분선이고, 점 M은 AB와 ℓ의 교점이며 점 P는 ℓ 위의 점이다.`;
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
    init: (s) => { s.trBc = 5; s.trBb = 4; s.trBa = 70; s.trK = 1; s.trV = 0; },
    reroll: (s) => { const c = rint(4, 12); let b2 = rint(4, 12); if (b2 === c) b2 = c > 4 ? c - 1 : c + 1; s.trBc = c; s.trBb = b2; s.trBa = pick([50, 60, 70, 80, 90], s.trBa); s.trK = rint(1, Math.floor(c * b2 / (2 * (c + b2)))); s.trV = (s.trV + 1) % 2; },
    model: (s) => {
      const c = clamp(Math.round(s.trBc), 4, 12), bb = clamp(Math.round(s.trBb), 4, 12), a = clamp(Math.round(s.trBa / 2) * 2, 40, 100), g = gcdf(c, bb);
      // 두 부분의 넓이가 kc, kb이면 전체 넓이는 k(c+b)이며 cb/2 이하여야 해요.
      // 문제 그림의 끼인각은 이 실제 넓이로 정하고, 탐구의 각도 조절은 별도로 유지해요.
      const k = clamp(Math.round(s.trK || 1), 1, Math.floor(c * bb / (2 * (c + bb))));
      const questionAngle = Math.asin(clamp(2 * k * (c + bb) / (c * bb), 0, 1)) / DEG;
      return { c, b: bb, a, rc: c / g, rb: bb / g, geo: areaGeom(c, bb, a), questionGeo: areaGeom(c, bb, questionAngle), k };
    },
    draw(b, s, M, C) {
      const { c, b: bb, a, rc, rb, k } = M, geo = C.problem ? M.questionGeo : M.geo, { A, B, C: Cc, D, E, F } = geo, st = C.step, v = (s.trV || 0) % 2;
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
      notes: notes('주어진 <b>AB, AC</b>를 각각 밑변으로 보면 같은 높이 DE, DF를 바로 이용할 수 있어요.', '높이 DE, DF가 같다는 것은 D가 <b>이등분선 위</b>에 있기 때문이에요.')
    }),
    prob: (M, s) => {
      const { c, b: bb, k } = M, v = (s.trV || 0) % 2, a1 = k * c, a2 = k * bb, key = `${v}:${c}:${bb}:${k}`;
      const ar = { tex: (x) => `${x}\\text{ cm}^2`, plain: (x) => x + ' cm²', pad: 2, valid: (x) => Number.isInteger(x) && x > 0 };
      const head = `그림과 같은 삼각형 ABC에서 AD는 ∠A의 이등분선이고 ${S('AB')}=${c} cm, ${S('AC')}=${bb} cm이다.`;
      if (v === 0) return numProb({ tag: '이등분선과 넓이의 비', key, stem: `${head} △ABD의 넓이가 ${a1} cm²일 때, △ACD의 넓이 $x$는?`, correct: a2, wrongs: [[a1, '넓이가 같지 않아요. 넓이의 비는 AB : AC예요.'], [(a1 * c) / bb, '비를 거꾸로 썼어요. △ABD : △ACD = AB : AC예요.'], [a1 + (bb - c), '넓이의 차가 아니라 비로 구해요.'], [a2 + 2, '다시 계산해 보세요.'], [a2 - 2, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== a2), ...ar });
      return numProb({ tag: '이등분선과 넓이의 비', key, stem: `${head} △ACD의 넓이가 ${a2} cm²일 때, △ABD의 넓이 $x$는?`, correct: a1, wrongs: [[a2, '넓이가 같지 않아요. 넓이의 비는 AB : AC예요.'], [(a2 * bb) / c, '비를 거꾸로 썼어요.'], [a2 + (c - bb), '넓이의 차가 아니라 비로 구해요.'], [a1 + 2, '다시 계산해 보세요.'], [a1 - 2, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== a1), ...ar });
    },
    verify: (s) => { const M = b4.model(s), g = M.geo, q = M.questionGeo; const ar = (X, Y, Z) => Math.abs(G.polyArea([X, Y, Z])); return { ans: ar(g.A, g.B, g.D) / ar(g.A, g.C, g.D), model: M.c / M.b, extra: [[dist(g.D, g.E), dist(g.D, g.F)], [angBetween(g.A, g.B, g.D), M.a / 2], [ar(q.A, q.B, q.D), M.k * M.c], [ar(q.A, q.C, q.D), M.k * M.b]] }; }
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
        b.point(Pp, { color: 'amber', r: 5 }); T(b, Pp, 'P', { dy: -16, size: 18, color: 'amber' }); T(b, pt(5, 0), 'ℓ', { dy: -14, size: 17 });
        return;
      }
      const { h, d, q } = M, st = C.step, show = (k) => (C.problem ? false : C.review ? st >= k : true);
      if (!C.problem) { // 직선 ℓ, 점 P, 수선의 발 E, 비스듬한 선분 PQ
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
        T(b, Pp, 'P', { dx: 0, dy: -16, size: 18, color: 'amber' }); T(b, E, 'E', { dx: -14, dy: 16, size: 18 }); if (q > 0) T(b, Q, 'Q', { dx: 6, dy: 16, size: 18, color: 'rose' }); T(b, pt(7.5, 0), 'ℓ', { dx: 0, dy: -14, size: 17 });
        if (!C.thumb && !C.review) b.handle('Q', Q, { color: 'rose', r: 8, ariaLabel: '점 Q를 직선 ℓ 위에서 가로로 끌기', drag: (w) => { s.trBe = clamp(Math.round(w.x), 0, 6); } });
        if (!C.thumb) {
          let row, col = 'sky';
          if (C.review && st === 1) row = `PE⊥ℓ 이므로 거리는 PE=${d} cm`;
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
        return { tag: '점과 직선 사이의 거리', key, stem: '그림에서 점 P에서 직선 ℓ까지의 거리를 나타내는 선분은?', choices: nm.map((q, i) => ({ h: `$\\overline{P${q}}$`, p: `선분 P${q}`, ok: i === ok, hint: '거리는 점에서 직선에 내린 수선의 길이예요. 가장 짧은 선분을 찾아보세요.' })), note: '가장 짧은 선분이 거리예요' };
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

  /* ====================================================================== 풀이 흐름 (t4-1 ~ t4-6) */
  const SK = G.SVK, mkSolve = G.mkSolve;
  const ov = (n) => `\\overline{${n}}`;
  const dd = (v) => `${v}^{\\circ}`;
  // 각 XOY 위의 그림(점 O, P, E, F)의 바탕: 두 변, 점 이름
  const angBaseDraw = (b, g, extra) => { G.fillPoly(b, [g.O, g.X, g.Y], 'sky', 0.06); drawAngle(b, g); if (extra) extra(b); };
  const angNames = (b, g, withQ) => { [g.P, g.E, g.F].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); T(b, g.P, 'P', { dx: 14, dy: -2, size: 18, color: 'amber' }); T(b, g.E, 'E', { dx: 4, dy: -14, size: 18 }); T(b, g.F, 'F', { dx: 4, dy: 16, size: 18 }); if (withQ) { b.point(withQ, { color: 'ink', r: 4.5 }); T(b, withQ, 'Q', { dx: 6, dy: -14, size: 18 }); } };

  /* ---- t4-1 각의 이등분선 위의 점 · v0: PE → PF · v1: ∠XOP → ∠EPF · v2: OE → OF ---- */
  // 한 눈금은 OE=OF, 두 눈금은 PE=PF, 세 눈금은 공통 빗변 OP를 나타낸다.
  // OP는 직각변보다 길므로 수선과 같은 눈금을 사용하지 않는다.
  const b1Plan = (M, s) => {
    const { h, d, g } = M, { O, P: Pp, E, F, X, Y } = g, v = (s.trV || 0) % 3, m = 3 + ((h + d) % 6), steps = [], items = [], rest = 90 - h;
    const head = '점 P는 ∠XOY의 이등분선 위의 점이고, 점 E, F는 P에서 두 변 OX, OY에 내린 수선의 발이에요.';
    steps.push({ id: 'given', k: 'given', t: v === 0 ? `${head} $${ov('PE')}=${d}$ cm이고, 구하는 것은 $${ov('PF')}=x$.` : v === 1 ? `${head} $\\angle XOP=${dd(h)}$이고, 구하는 것은 $\\angle EPF=x$.` : `${head} $${ov('OE')}=${m}$ cm이고, 구하는 것은 $${ov('OF')}=x$.`, cap: v === 0 ? `∠XOP=∠YOP, PE=${d} cm` : v === 1 ? `∠XOP=∠YOP=${h}°` : `∠XOP=∠YOP, OE=${m} cm` });
    steps.push({ id: 'idea', k: 'idea', t: v === 0 ? 'PE와 PF가 같다는 것을 보이려면, 이 두 선분을 변으로 가진 두 직각삼각형 POE, POF가 합동인지 확인하면 돼요.' : v === 1 ? '∠EPF는 두 직각삼각형 POE, POF의 각 ∠OPE, ∠OPF를 합친 각이에요. 두 삼각형이 합동이면 이 두 각이 같아서 하나만 구하면 돼요.' : 'OE와 OF는 두 직각삼각형 POE, POF의 대응하는 변이에요. 두 삼각형이 합동인지 확인하면 길이가 같다고 말할 수 있어요.', cap: '직각삼각형 POE, POF가 합동인지 확인' });
    steps.push({ id: 'R', k: 'fig', lb: '합동 조건 ①', t: '$\\angle PEO=\\angle PFO=90^{\\circ}$ (Right angle)', cap: '∠PEO=∠PFO=90° (R)' });
    steps.push({ id: 'H', k: 'fig', lb: '합동 조건 ②', t: '$\\overline{OP}$는 두 삼각형의 공통인 빗변이에요 (Hypotenuse)', cap: 'OP는 공통인 빗변 (H)' });
    steps.push({ id: 'A', k: 'fig', lb: '합동 조건 ③', t: '$\\angle POE=\\angle POF$ (OP는 ∠XOY의 이등분선, Angle)', cap: '∠POE=∠POF (A)' });
    steps.push({ id: 'cong', k: 'fig', lb: '합동', t: '직각삼각형에서 빗변과 한 예각이 각각 같으므로 △POE≡△POF (RHA 합동)이에요.', cap: '△POE≡△POF (RHA 합동)' });
    if (v === 0) { steps.push({ id: 'eq', k: 'eq', t: `대응변의 길이는 같으므로 $x=${ov('PF')}=${ov('PE')}=${d}$ cm`, cap: `PF=PE=${d} cm` }); steps.push({ id: 'ans', k: 'ans', t: `$x=${d}\\text{ cm}$`, cap: `x = ${d} cm` }); }
    else if (v === 1) { steps.push({ id: 'eq', k: 'eq', t: `△POE에서 $\\angle OPE=90^{\\circ}-${dd(h)}=${dd(rest)}$이고, 합동이므로 $\\angle OPF=${dd(rest)}$. 따라서 $x=\\angle EPF=2\\times${dd(rest)}=${dd(2 * rest)}$`, cap: `x=2×(90°−${h}°)=${2 * rest}°` }); steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(180 - 2 * h)}$`, cap: `x = ${180 - 2 * h}°` }); }
    else { steps.push({ id: 'eq', k: 'eq', t: `대응변의 길이는 같으므로 $x=${ov('OF')}=${ov('OE')}=${m}$ cm`, cap: `OF=OE=${m} cm` }); steps.push({ id: 'ans', k: 'ans', t: `$x=${m}\\text{ cm}$`, cap: `x = ${m} cm` }); }
    items.push(SK.seg(O, Pp, { at: 'given', col: 'green', dash: [7, 5], w: 3.2 }), SK.seg(Pp, E, { at: 'given', col: 'amber', w: 3.6 }), SK.seg(Pp, F, { at: 'given', col: 'amber', w: 3.6 }),
      SK.ang(E, O, Pp, { r: 18, on: ['given', 'R'], col: 'amber', cols: { R: 'green' } }), SK.ang(F, O, Pp, { r: 18, on: ['given', 'R'], col: 'amber', cols: { R: 'green' } }),
      SK.ang(O, X, Pp, { r: 40, cut: [0, 7], on: ['given', 'A'], col: 'sky', cols: { A: 'green' }, label: v === 1 ? dg(h) : '', ld: 66, gl: true, glTo: 'eq' }), SK.ang(O, Pp, Y, { r: 40, cut: [7, 0], on: ['given', 'A'], col: 'sky', cols: { A: 'green' } }),
      SK.tick(O, Pp, 3, { at: 'H', col: 'rose' }), SK.fill([O, E, Pp], { at: 'cong', to: 'eq', col: 'sky', a: 0.24 }), SK.fill([O, F, Pp], { at: 'cong', to: 'eq', col: 'green', a: 0.24 }));
    if (v === 0) items.push(SK.len(Pp, E, pt(-50, 0), `${d} cm`, { on: ['given', 'eq'], col: 'sky', size: 16, gap: 6 }), SK.len(Pp, F, pt(-50, 0), 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 6, labels: { ans: `x=${d} cm` } }), SK.tick(Pp, E, 2, { at: 'eq', col: 'rose' }), SK.tick(Pp, F, 2, { at: 'eq', col: 'rose' }));
    else if (v === 1) items.push(SK.ang(Pp, E, F, { r: 34, ld: 52, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${180 - 2 * h}°` }, gl: true }), SK.ang(Pp, O, E, { r: 24, at: 'eq', col: 'green', label: dg(rest), size: 14, ld: 38 }));
    else items.push(SK.len(O, E, Pp, `${m} cm`, { on: ['given', 'eq'], col: 'sky', size: 16, gap: 8 }), SK.len(O, F, Pp, 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 8, labels: { ans: `x=${m} cm` } }), SK.tick(O, E, 1, { at: 'eq', col: 'rose' }), SK.tick(O, F, 1, { at: 'eq', col: 'rose' }));
    return { fit: [O, X, Y, Pp, E, F], steps, items, l: 50, r: 50, base: (b) => angBaseDraw(b, g), names: (b) => angNames(b, g) };
  };
  b1.solve = mkSolve(b1Plan);
  b1.reroll = ((r0) => (s) => { r0(s); s.trM = rint(3, 9); })(b1.reroll);
  { const p0 = b1.prob; b1.prob = (M, s) => { const v = (s.trV || 0) % 3; if (v !== 2) return p0(M, s); const m = 3 + ((M.h + M.d) % 6); return numProb({ tag: '각의 이등분선 위의 점 · 길이', key: `2:${M.h}:${m}`, stem: `그림에서 점 P는 ∠XOY의 이등분선 위의 점이고, 점 E, F는 P에서 두 변 OX, OY에 내린 수선의 발이다. ${S('OE')}=${m} cm일 때, ${S('OF')}의 길이 $x$는?`, correct: m, wrongs: [[m * 2, '두 배가 아니에요.'], [m + 1, '다시 생각해 보세요.'], [m - 1, '다시 생각해 보세요.'], [m + 2, '다시 생각해 보세요.'], [m - 2, '다시 생각해 보세요.']], ...cmOpts }); }; }

  /* ---- t4-2 PE=PF이면 이등분선 · v0: ∠XOY → ∠POE · v1: ∠XOP → ∠POY ---- */
  const b2Plan = (M, s) => {
    const { h } = M, g = angGeom(h, M.d1, M.d1), { O, P: Pp, E, F, X, Y } = g, v = (s.trV || 0) % 2, steps = [], items = [];
    const head = '점 E, F는 점 P에서 ∠XOY의 두 변 OX, OY에 내린 수선의 발이고 $\\overline{PE}=\\overline{PF}$예요.';
    steps.push({ id: 'given', k: 'given', t: v === 0 ? `${head} $\\angle XOY=${dd(2 * h)}$이고, 구하는 것은 $\\angle POE=x$.` : `${head} $\\angle XOP=${dd(h)}$이고, 구하는 것은 $\\angle POY=x$.`, cap: v === 0 ? `PE=PF, ∠XOY=${2 * h}°` : `PE=PF, ∠XOP=${h}°` });
    steps.push({ id: 'idea', k: 'idea', t: '두 변까지의 거리가 같은 점이 이등분선 위에 있다면 ∠POE=∠POF예요. 이것을 보이려고 각을 하나씩 가진 두 직각삼각형 POE, POF가 합동인지 확인해요.', cap: '직각삼각형 POE, POF가 합동 → ∠POE=∠POF' });
    steps.push({ id: 'R', k: 'fig', lb: '합동 조건 ①', t: '$\\angle PEO=\\angle PFO=90^{\\circ}$ (Right angle)', cap: '∠PEO=∠PFO=90° (R)' });
    steps.push({ id: 'H', k: 'fig', lb: '합동 조건 ②', t: '$\\overline{OP}$는 두 삼각형의 공통인 빗변이에요 (Hypotenuse)', cap: 'OP는 공통인 빗변 (H)' });
    steps.push({ id: 'S', k: 'fig', lb: '합동 조건 ③', t: '$\\overline{PE}=\\overline{PF}$ (다른 한 변이 같아요, Side)', cap: 'PE=PF (S)' });
    steps.push({ id: 'cong', k: 'fig', lb: '합동', t: '직각삼각형에서 빗변과 다른 한 변이 각각 같으므로 △POE≡△POF (RHS 합동)이에요.', cap: '△POE≡△POF (RHS 합동)' });
    steps.push({ id: 'eq', k: 'eq', t: v === 0 ? `대응각이므로 $\\angle POE=\\angle POF$예요. 두 각의 합이 $\\angle XOY=${dd(2 * h)}$이므로 $x=\\frac{${dd(2 * h)}}{2}=${dd(h)}$` : `대응각이므로 $\\angle POY=\\angle POE=\\angle XOP=${dd(h)}$ (OP는 ∠XOY의 이등분선)`, cap: v === 0 ? `x=\\frac{${2 * h}°}{2}=${h}°` : `∠POY=∠XOP=${h}°` });
    steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(h)}$`, cap: `x = ${h}°` });
    items.push(SK.seg(O, Pp, { at: 'given', to: 'S', col: 'ink', dash: [7, 5], w: 3 }), SK.seg(Pp, E, { at: 'given', col: 'amber', w: 3.6 }), SK.seg(Pp, F, { at: 'given', col: 'amber', w: 3.6 }),
      SK.ang(E, O, Pp, { r: 18, on: ['given', 'R'], col: 'amber', cols: { R: 'green' } }), SK.ang(F, O, Pp, { r: 18, on: ['given', 'R'], col: 'amber', cols: { R: 'green' } }),
      SK.tick(Pp, E, 2, { on: ['given', 'S'], col: 'rose' }), SK.tick(Pp, F, 2, { on: ['given', 'S'], col: 'rose' }), SK.tick(O, Pp, 3, { at: 'H', col: 'rose' }),
      SK.fill([O, E, Pp], { at: 'cong', to: 'eq', col: 'sky', a: 0.24 }), SK.fill([O, F, Pp], { at: 'cong', to: 'eq', col: 'green', a: 0.24 }));
    if (v === 0) items.push(SK.ang(O, X, Y, { r: 66, ld: 94, lr: 0, on: ['given'], col: 'sky', fa: 0.05, label: dg(2 * h), gl: true, glTo: 'cong' }), SK.ang(O, E, Pp, { r: 34, ld: 54, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${h}°` }, gl: true }), SK.ang(O, Pp, F, { r: 34, ld: 54, at: 'eq', col: 'green', label: dg(h), size: 14 }));
    else items.push(SK.ang(O, X, Pp, { r: 34, ld: 56, on: ['given', 'eq'], col: 'sky', label: dg(h), gl: true }), SK.ang(O, Pp, Y, { r: 34, ld: 56, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${h}°` }, gl: true }));
    return { fit: [O, X, Y, Pp, E, F], steps, items, l: 50, r: 50, base: (b) => angBaseDraw(b, g), names: (b) => angNames(b, g) };
  };
  b2.solve = mkSolve(b2Plan);

  /* ---- t4-3 수직이등분선 위의 점 · v0: PA → PB · v1: ∠PAB → ∠PBA · v2: ∠APM → ∠APB ---- */
  const b3Plan = (M, s) => {
    const { m, q, A, B, Mm, Pp, al, pm } = M, v = (s.trV || 0) % 3, steps = [], items = [], Lp = pt(-1.2, 0), Rp = pt(q + 1.2, 0);
    const head = '직선 $\\ell$은 선분 AB의 수직이등분선이고, 점 M은 AB와 $\\ell$의 교점이며, 점 P는 $\\ell$ 위의 점이에요.';
    steps.push({ id: 'given', k: 'given', t: v === 0 ? `${head} $${ov('PA')}=${pm}$ cm이고, 구하는 것은 $${ov('PB')}=x$.` : v === 1 ? `${head} $\\angle PAB=${dd(al)}$이고, 구하는 것은 $\\angle PBA=x$.` : `${head} $\\angle APM=${dd(al)}$이고, 구하는 것은 $\\angle APB=x$.`, cap: v === 0 ? `AM=BM, ℓ⊥AB, PA=${pm} cm` : v === 1 ? `AM=BM, ℓ⊥AB, ∠PAB=${al}°` : `AM=BM, ℓ⊥AB, ∠APM=${al}°` });
    steps.push({ id: 'idea', k: 'idea', t: 'P에서 A, B까지의 거리 PA, PB를 비교하려면, 이 둘을 변으로 가진 두 삼각형 PAM, PBM이 합동인지 확인하면 돼요. ℓ이 AB의 수직이등분선이라는 것이 합동 조건을 줘요.', cap: '△PAM과 △PBM이 합동인지 확인' });
    steps.push({ id: 'S1', k: 'fig', lb: '합동 조건 ①', t: `$${ov('AM')}=${ov('BM')}$ (M은 AB의 중점, Side)`, cap: 'AM=BM (S)' });
    steps.push({ id: 'A', k: 'fig', lb: '합동 조건 ②', t: '$\\angle PMA=\\angle PMB=90^{\\circ}$ ($l\\perp AB$, Angle)', cap: '∠PMA=∠PMB=90° (A)' });
    steps.push({ id: 'S2', k: 'fig', lb: '합동 조건 ③', t: '$\\overline{PM}$은 공통이에요 (Side)', cap: 'PM은 공통 (S)' });
    steps.push({ id: 'cong', k: 'fig', lb: '합동', t: '두 변과 그 끼인각이 각각 같으므로 △PAM≡△PBM (SAS 합동)이에요.', cap: '△PAM≡△PBM (SAS 합동)' });
    if (v === 0) steps.push({ id: 'eq', k: 'eq', t: `대응변의 길이는 같으므로 $x=${ov('PB')}=${ov('PA')}=${pm}$ cm`, cap: `PB=PA=${pm} cm` });
    else if (v === 1) steps.push({ id: 'eq', k: 'eq', t: `대응각의 크기는 같으므로 $x=\\angle PBA=\\angle PAB=${dd(al)}$`, cap: `∠PBA=∠PAB=${al}°` });
    else steps.push({ id: 'eq', k: 'eq', t: `대응각의 크기는 같으므로 $\\angle BPM=\\angle APM=${dd(al)}$이고, $x=\\angle APB=\\angle APM+\\angle BPM=${dd(al)}+${dd(al)}=${dd(2 * al)}$`, cap: `x=∠APM+∠BPM=${al}°+${al}°=${2 * al}°` });
    const val = v === 0 ? `${pm} cm` : dg(v === 1 ? al : 2 * al);
    steps.push({ id: 'ans', k: 'ans', t: v === 0 ? `$x=${pm}\\text{ cm}$` : `$x=${dd(v === 1 ? al : 2 * al)}$`, cap: `x = ${val}` });
    items.push(SK.ang(Mm, A, Pp, { r: 20, on: ['given', 'A'], col: 'sky', cols: { A: 'green' } }), SK.ang(Mm, B, Pp, { r: 20, on: ['given', 'A'], col: 'sky', cols: { A: 'green' } }),
      SK.tick(A, Mm, 1, { on: ['given', 'S1'], col: 'amber' }), SK.tick(Mm, B, 1, { on: ['given', 'S1'], col: 'amber' }), SK.seg(Mm, Pp, { at: 'S2', col: 'green', w: 4 }),
      SK.fill([A, Mm, Pp], { at: 'cong', to: 'eq', col: 'sky', a: 0.24 }), SK.fill([B, Mm, Pp], { at: 'cong', to: 'eq', col: 'violet', a: 0.24 }));
    if (v === 0) items.push(SK.len(Pp, A, pt(-50, 0), `${pm} cm`, { on: ['given', 'eq'], col: 'sky', size: 16, gap: 6 }), SK.len(Pp, B, pt(-50, 0), 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 6, labels: { ans: `x=${pm} cm` } }), SK.tick(Pp, A, 2, { at: 'eq', col: 'rose' }), SK.tick(Pp, B, 2, { at: 'eq', col: 'rose' }));
    else if (v === 1) items.push(SK.ang(A, Pp, B, { r: 30, ld: 54, on: ['given', 'eq'], col: 'sky', label: dg(al), gl: true }), SK.ang(B, Pp, A, { r: 30, ld: 54, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${al}°` }, gl: true }));
    else items.push(SK.ang(Pp, A, Mm, { r: 34, ld: 62, on: ['given', 'eq'], col: 'sky', label: dg(al), gl: true }), SK.ang(Pp, A, B, { r: 46, ld: 44, lr: 180, on: ['given', 'eq', 'ans'], col: 'amber', fa: 0.12, label: 'x', size: 17, labels: { ans: `x=${2 * al}°` }, gl: true }), SK.ang(Pp, Mm, B, { r: 34, ld: 62, at: 'eq', col: 'green', label: dg(al), size: 14 }));
    return {
      fit: [A, B, Pp, Lp, Rp], steps, items, l: 56, r: 50,
      base: (b) => { G.line(b, Lp, Rp, 'green', 3, { dash: [8, 6] }); G.line(b, A, B, 'ink', 3.8); G.line(b, Pp, A, 'ink', 3.4); G.line(b, Pp, B, 'ink', 3.4); },
      names: (b) => { [A, B, Mm, Pp].forEach((z) => b.point(z, { color: z === Pp ? 'amber' : 'ink', r: z === Pp ? 5.5 : 4.5 })); T(b, A, 'A', { dx: -14, dy: -6, size: 18 }); T(b, B, 'B', { dx: -14, dy: 8, size: 18 }); T(b, Mm, 'M', { dx: -14, dy: -2, size: 18 }); T(b, Pp, 'P', { dx: 14, dy: -2, size: 18, color: 'amber' }); T(b, Lp, 'ℓ', { dx: -2, dy: -14, size: 17 }); }
    };
  };
  b3.solve = mkSolve(b3Plan);

  /* ---- t4-4 이등분선과 넓이의 비 · v0: △ABD → △ACD · v1: △ACD → △ABD ---- */
  const b4Plan = (M, s) => {
    const { c, b: bb, rc, rb, questionGeo: geo, k } = M, { A, B, C: Cc, D, E, F } = geo, v = (s.trV || 0) % 2, a1 = k * c, a2 = k * bb, steps = [], items = [], cen = pt(D.x * 0.6, 0);
    const xv = v === 0 ? a2 : a1, hasT = v === 0 ? `$\\triangle ABD=${a1}\\text{ cm}^2$` : `$\\triangle ACD=${a2}\\text{ cm}^2$`;
    steps.push({ id: 'given', k: 'given', t: `$\\overline{AD}$는 $\\angle A$의 이등분선이고 $${ov('AB')}=${c}$ cm, $${ov('AC')}=${bb}$ cm, ${hasT}예요. 구하는 것은 ${v === 0 ? '$\\triangle ACD$' : '$\\triangle ABD$'}의 넓이 $x$.`, cap: `AB=${c} cm, AC=${bb} cm, ${v === 0 ? `△ABD=${a1} cm²` : `△ACD=${a2} cm²`}` });
    steps.push({ id: 'idea', k: 'idea', t: '두 삼각형 ABD, ACD의 넓이는 (밑변)×(높이)÷2예요. 높이가 같다면 넓이의 비는 밑변 AB, AC의 비와 같아요. AD가 이등분선이면 D에서 AB, AC까지의 거리(높이)가 같아요.', cap: '높이가 같으면 넓이의 비 = 밑변의 비' });
    steps.push({ id: 'h', k: 'fig', lb: '그림 변화', t: 'D에서 AB, AC에 수선 DE, DF를 그어요. D는 ∠A의 이등분선 위의 점이므로 $\\overline{DE}=\\overline{DF}$ (두 변까지의 거리가 같아요).', cap: 'DE⊥AB, DF⊥AC, DE=DF' });
    steps.push({ id: 'area', k: 'fig', lb: '넓이 식', t: `$\\triangle ABD=\\frac{1}{2}\\times${ov('AB')}\\times${ov('DE')}$, $\\triangle ACD=\\frac{1}{2}\\times${ov('AC')}\\times${ov('DF')}$이고 $\\overline{DE}=\\overline{DF}$이므로 $\\triangle ABD:\\triangle ACD=${ov('AB')}:${ov('AC')}=${c}:${bb}$`, cap: `△ABD : △ACD = AB : AC = ${c} : ${bb}` });
    steps.push({ id: 'eq', k: 'eq', t: v === 0 ? `$${a1}:x=${c}:${bb}$이므로 $x=\\frac{${a1}\\times${bb}}{${c}}=${a2}$ (cm²)` : `$x:${a2}=${c}:${bb}$이므로 $x=\\frac{${a2}\\times${c}}{${bb}}=${a1}$ (cm²)`, cap: v === 0 ? `${a1} : x = ${c} : ${bb} → x=\\frac{${a1}×${bb}}{${c}}=${a2}` : `x : ${a2} = ${c} : ${bb} → x=\\frac{${a2}×${c}}{${bb}}=${a1}` });
    steps.push({ id: 'ans', k: 'ans', t: `$x=${xv}\\text{ cm}^2$`, cap: `x = ${xv} cm²` });
    const pA = G.centroid([A, B, D]), pB = G.centroid([A, D, Cc]);
    items.push(SK.fill([A, B, D], { at: 'given', to: 'area', col: 'sky', a: 0.2 }), SK.fill([A, D, Cc], { at: 'given', to: 'area', col: 'green', a: 0.2 }),
      SK.len(A, B, pt(D.x, 5), `${c} cm`, { at: 'given', to: 'area', col: 'sky', size: 16, gap: 30 }), SK.len(A, Cc, pt(D.x, -5), `${bb} cm`, { at: 'given', to: 'area', col: 'green', size: 16, gap: 30 }),
      SK.ang(A, B, D, { r: 34, cut: [0, 7], on: ['given'], col: 'sky' }), SK.ang(A, D, Cc, { r: 34, cut: [7, 0], on: ['given'], col: 'sky' }),
      SK.seg(D, E, { at: 'h', col: 'amber', w: 3.4 }), SK.seg(D, F, { at: 'h', col: 'amber', w: 3.4 }), SK.ang(E, A, D, { r: 16, at: 'h', col: 'amber' }), SK.ang(F, A, D, { r: 16, at: 'h', col: 'amber' }), SK.tick(D, E, 2, { at: 'h', col: 'rose' }), SK.tick(D, F, 2, { at: 'h', col: 'rose' }),
      SK.dot(E, 'E', { at: 'h', col: 'amber', size: 17, dx: -6, dy: -16 }), SK.dot(F, 'F', { at: 'h', col: 'amber', size: 17, dx: -6, dy: 16 }),
      SK.txt(pA, v === 0 ? `${a1} cm²` : 'x', { on: ['given', 'eq', 'ans'], col: v === 0 ? 'sky' : 'amber', size: v === 0 ? 16 : 18, labels: { ans: v === 0 ? `${a1} cm²` : `x=${a1} cm²` } }),
      SK.txt(pB, v === 0 ? 'x' : `${a2} cm²`, { on: ['given', 'eq', 'ans'], col: v === 0 ? 'amber' : 'green', size: v === 0 ? 18 : 16, labels: { ans: v === 0 ? `x=${a2} cm²` : `${a2} cm²` } }));
    return {
      fit: [A, B, Cc, D, E, F], steps, items, l: 44, r: 52,
      base: (b) => { G.poly(b, [A, B, Cc], 'ink', 3.6); G.line(b, A, D, 'ink', 3.4, { dash: [8, 5] }); },
      names: (b) => { [A, B, Cc, D].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); T(b, A, 'A', { dx: -16, size: 18 }); G.tagOut(b, B, cen, 'B', { size: 18 }); G.tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, D, 'D', { dx: 14, size: 18 }); }
    };
  };
  b4.solve = mkSolve(b4Plan);

  /* ---- t4-5 거리는 수선의 길이 · v0: 거리를 나타내는 선분 · v1: PE → PF · v2 [함정]: 거리는 PE ---- */
  const b5Plan = (M, s) => {
    const v = (s.trV || 0) % 3, { h, d } = M, steps = [], items = [];
    if (v === 0) {
      const of = M.of, Pp = pt(0, -3), pts = of.map((x) => pt(x, 0)), nm = ['A', 'B', 'C', 'D', 'E'], ok = of.indexOf(0), Fp = pts[ok];
      steps.push({ id: 'given', k: 'given', t: '점 P와 직선 $\\ell$ 위의 다섯 점 A, B, C, D, E를 잇는 선분이 그려져 있어요. 구하는 것은 점 P에서 직선 $\\ell$까지의 거리를 나타내는 선분.', cap: '점 P에서 직선 ℓ까지의 거리 = ?' });
      steps.push({ id: 'idea', k: 'idea', t: '점에서 직선까지의 거리는 그 점에서 직선에 내린 수선의 길이예요. 수선은 점과 직선 위의 점을 잇는 선분 가운데 가장 짧은 선분이에요.', cap: '거리 = 수선의 길이 = 가장 짧은 선분' });
      steps.push({ id: 'perp', k: 'fig', lb: '그림 변화', t: `직선 $\\ell$과 직각을 이루는 선분을 찾아요. $\\overline{P${nm[ok]}}$는 $\\ell$과 수직이에요 (직각 표시).`, cap: `P${nm[ok]} ⊥ ℓ` });
      steps.push({ id: 'cmp', k: 'fig', lb: '비교하기', t: `나머지 선분은 모두 비스듬해서, 직각삼각형의 빗변이 되므로 $\\overline{P${nm[ok]}}$보다 길어요. 가장 짧은 선분이 $\\overline{P${nm[ok]}}$예요.`, cap: `비스듬한 선분은 P${nm[ok]}보다 길다` });
      steps.push({ id: 'ans', k: 'ans', t: `$\\overline{P${nm[ok]}}$`, cap: `답: 선분 P${nm[ok]}` });
      pts.forEach((p, i) => items.push(SK.seg(Pp, p, { at: 'given', to: i === ok ? 'perp' : 'idea', col: 'ink', w: 3 })));
      items.push(SK.seg(Pp, Fp, { at: 'perp', to: 'cmp', col: 'amber', w: 5 }), SK.ang(Fp, pts[ok > 0 ? ok - 1 : ok + 1], Pp, { r: 20, at: 'perp', col: 'green' }), SK.seg(Pp, Fp, { at: 'ans', col: 'amber', w: 5 }));
      return { fit: [pt(-5, -3.4), pt(5, 0.5)], steps, items, l: 44, r: 44, base: (b) => { G.line(b, pt(-5, 0), pt(5, 0), 'ink', 3.4); }, names: (b) => { pts.forEach((p, i) => { b.point(p, { color: 'ink', r: 4 }); T(b, p, nm[i], { dy: 18, size: 17 }); }); b.point(Pp, { color: 'amber', r: 5 }); T(b, Pp, 'P', { dy: -16, size: 18, color: 'amber' }); T(b, pt(5, 0), 'ℓ', { dy: -14, size: 17 }); } };
    }
    const g = M.g, qp = Math.max(1, M.q), { O, P: Pp, E, F, Y } = g, Qp = add(E, mul(g.u1, qp)), X = mul(g.u1, v === 2 ? dist(O, Qp) + 1 : dist(O, E) + 1.1), gg = { ...g, X };
    const head = '점 P는 ∠XOY의 이등분선 위의 점이고, 점 E, F는 P에서 두 변 OX, OY에 내린 수선의 발이에요.';
    if (v === 1) {
      steps.push({ id: 'given', k: 'given', t: `${head} $${ov('PE')}=${d}$ cm이고, 구하는 것은 점 P에서 변 OY까지의 거리 $${ov('PF')}=x$.`, cap: `∠XOP=∠YOP, PE=${d} cm` });
      steps.push({ id: 'idea', k: 'idea', t: '거리는 수선의 길이이므로 PF가 바로 구하는 거리예요. 이등분선 위의 점은 두 변까지의 거리가 같다는 성질을 쓰고, 합동인 두 직각삼각형 POE, POF로 확인해요.', cap: '거리 = 수선의 길이, 이등분선 위의 점 → PE=PF' });
      steps.push({ id: 'cong', k: 'fig', lb: '합동 찾기', t: '△POE와 △POF에서 $\\angle PEO=\\angle PFO=90^{\\circ}$, $\\overline{OP}$는 공통, $\\angle POE=\\angle POF$이므로 △POE≡△POF (RHA 합동)이에요.', cap: '∠PEO=∠PFO=90°, OP 공통, ∠POE=∠POF → RHA' });
      steps.push({ id: 'eq', k: 'eq', t: `대응변의 길이는 같으므로 $x=${ov('PF')}=${ov('PE')}=${d}$ cm`, cap: `PF=PE=${d} cm` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${d}\\text{ cm}$`, cap: `x = ${d} cm` });
      items.push(SK.seg(O, Pp, { at: 'given', col: 'green', dash: [7, 5], w: 3 }), SK.seg(Pp, E, { at: 'given', col: 'amber', w: 3.6 }), SK.seg(Pp, F, { at: 'given', col: 'amber', w: 3.6 }), SK.ang(E, O, Pp, { r: 18, on: ['given', 'cong'], col: 'amber', cols: { cong: 'green' } }), SK.ang(F, O, Pp, { r: 18, on: ['given', 'cong'], col: 'amber', cols: { cong: 'green' } }),
        SK.ang(O, X, Pp, { r: 40, cut: [0, 7], on: ['given', 'cong'], col: 'sky', cols: { cong: 'green' } }), SK.ang(O, Pp, Y, { r: 40, cut: [7, 0], on: ['given', 'cong'], col: 'sky', cols: { cong: 'green' } }),
        SK.fill([O, E, Pp], { at: 'cong', to: 'eq', col: 'sky', a: 0.24 }), SK.fill([O, F, Pp], { at: 'cong', to: 'eq', col: 'green', a: 0.24 }),
        SK.len(Pp, E, pt(-50, 0), `${d} cm`, { on: ['given', 'eq'], col: 'sky', size: 16, gap: 6 }), SK.len(Pp, F, pt(-50, 0), 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 6, labels: { ans: `x=${d} cm` } }), SK.tick(Pp, E, 2, { at: 'eq', col: 'rose' }), SK.tick(Pp, F, 2, { at: 'eq', col: 'rose' }));
    } else {
      steps.push({ id: 'given', k: 'given', t: `${head} 점 Q는 변 OX 위의 점이고 $${ov('PE')}=${d}$ cm예요. 구하는 것은 점 P에서 변 OX까지의 거리 $x$.`, cap: `PE=${d} cm, Q는 OX 위의 점` });
      steps.push({ id: 'idea', k: 'idea', t: '점에서 직선까지의 거리는 그 점에서 직선에 내린 수선의 길이예요. 그림에는 두 선분 PE, PQ가 있으니, 어느 쪽이 수선인지 가려내야 해요.', cap: '거리 = 수선의 길이' });
      steps.push({ id: 'perp', k: 'fig', lb: '그림 변화', t: '$\\overline{PE}$는 변 OX에 내린 수선이에요 (직각 표시). $\\overline{PQ}$는 변 OX와 직각이 아닌 비스듬한 선분이에요.', cap: 'PE ⊥ OX → 수선, PQ는 비스듬한 선분' });
      steps.push({ id: 'cmp', k: 'fig', lb: '비교하기', t: '직각삼각형 PEQ에서 빗변 PQ가 직각변 PE보다 길어요. 가장 짧은 선분 PE가 거리예요.', cap: '빗변 PQ > 직각변 PE' });
      steps.push({ id: 'eq', k: 'eq', t: `거리는 수선의 길이이므로 $x=${ov('PE')}=${d}$ cm`, cap: `거리 = PE = ${d} cm` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${d}\\text{ cm}$`, cap: `x = ${d} cm` });
      steps.push({ id: 'trap', k: 'trap', t: '$\\overline{PQ}$의 길이를 거리로 생각하면 안 돼요. PQ는 비스듬한 선분이라서 PE보다 길어요. 거리는 수선 PE의 길이예요.', cap: 'PQ는 거리가 아니에요 (비스듬한 선분은 더 길다)' });
      items.push(SK.seg(O, Pp, { at: 'given', col: 'green', dash: [7, 5], w: 3 }), SK.seg(Pp, E, { at: 'given', to: 'cmp', col: 'amber', w: 3.8 }), SK.seg(Pp, F, { at: 'given', col: 'amber', w: 3 }), SK.seg(Pp, Qp, { at: 'given', to: 'cmp', col: 'rose', w: 3.4 }),
        SK.ang(E, O, Pp, { r: 18, on: ['given', 'perp'], col: 'amber', cols: { perp: 'green' } }), SK.ang(F, O, Pp, { r: 18, at: 'given', col: 'amber' }),
        SK.ang(O, X, Pp, { r: 40, cut: [0, 7], on: ['given'], col: 'sky' }), SK.ang(O, Pp, Y, { r: 40, cut: [7, 0], on: ['given'], col: 'sky' }),
        SK.fill([Pp, E, Qp], { at: 'cmp', col: 'rose', a: 0.16 }), SK.len(Pp, E, pt(-50, 0), `${d} cm`, { on: ['given', 'eq', 'ans'], col: 'sky', cols: { ans: 'amber' }, size: 16, gap: 6, labels: { ans: `x=${d} cm` } }));
    }
    return { fit: [O, X, Y, Pp, E, F, v === 2 ? Qp : E], steps, items, l: 50, r: 50, base: (b) => angBaseDraw(b, gg), names: (b) => angNames(b, g, v === 2 ? Qp : null) };
  };
  b5.solve = mkSolve(b5Plan);
  { const p0 = b5.prob; b5.prob = (M, s) => { const v = (s.trV || 0) % 3; if (v === 1) return p0(M, s); if (v === 0) { const Q = p0(M, s), ok = Q.choices.find((q) => q.ok); return { ...Q, ansHTML: ok.h }; } const d = M.d; return numProb({ tag: '[함정] 거리와 비스듬한 선분', key: `2:${M.h}:${d}`, stem: `그림에서 점 P는 ∠XOY의 이등분선 위의 점이고, 점 E는 P에서 변 OX에 내린 수선의 발, 점 Q는 변 OX 위의 점이다. ${S('PE')}=${d} cm일 때, 점 P에서 변 OX까지의 거리 $x$는?`, correct: d, wrongs: [[d + 1, '다시 생각해 보세요.'], [d + 2, '비스듬한 선분의 길이가 아니라 수선의 길이예요.'], [d - 1, '다시 생각해 보세요.'], [d * 2, '다시 생각해 보세요.'], [d - 2, '다시 생각해 보세요.']], ...cmOpts }); }; }

  /* ---- t4-6 중점 M 에서 MD=ME · v0: ∠B → ∠C · v1: ∠A → ∠B · v2: AB → AC ---- */
  const b6Plan = (M, s) => {
    const bd = M.b, m = M.m, v = (s.trV || 0) % 3, g = midGeom(bd, bd), { A, B, C: Cc, M: Mm, D, E } = g, cen = pt(1, A.y * 0.3), steps = [], items = [], aa = 180 - 2 * bd;
    const head = '점 M은 변 BC의 중점이고, M에서 두 변 AB, AC에 내린 수선의 발을 D, E라 하면 $\\overline{MD}=\\overline{ME}$예요.';
    steps.push({ id: 'given', k: 'given', t: v === 0 ? `${head} $\\angle B=${dd(bd)}$이고, 구하는 것은 $\\angle C=x$.` : v === 1 ? `${head} $\\angle A=${dd(aa)}$이고, 구하는 것은 $\\angle B=x$.` : `${head} $${ov('AB')}=${m}$ cm이고, 구하는 것은 $${ov('AC')}=x$.`, cap: v === 0 ? `BM=CM, MD=ME, ∠B=${bd}°` : v === 1 ? `BM=CM, MD=ME, ∠A=${aa}°` : `BM=CM, MD=ME, AB=${m} cm` });
    steps.push({ id: 'idea', k: 'idea', t: v === 2 ? 'AB=AC이려면 ∠B=∠C여야 해요. ∠B, ∠C를 하나씩 가진 두 직각삼각형 BMD, CME가 합동이면 ∠B=∠C이고, 두 내각이 같으면 대변인 AC와 AB도 같아요.' : '∠B와 ∠C를 하나씩 가진 두 직각삼각형 BMD, CME가 합동이면 ∠B=∠C예요. 합동인지 먼저 확인해요.', cap: '직각삼각형 BMD, CME가 합동인지 확인' });
    steps.push({ id: 'R', k: 'fig', lb: '합동 조건 ①', t: '$\\angle BDM=\\angle CEM=90^{\\circ}$ (Right angle)', cap: '∠BDM=∠CEM=90° (R)' });
    steps.push({ id: 'H', k: 'fig', lb: '합동 조건 ②', t: '$\\overline{BM}=\\overline{CM}$ (M은 BC의 중점, 빗변이 같아요, Hypotenuse)', cap: 'BM=CM (H)' });
    steps.push({ id: 'S', k: 'fig', lb: '합동 조건 ③', t: '$\\overline{MD}=\\overline{ME}$ (다른 한 변이 같아요, Side)', cap: 'MD=ME (S)' });
    steps.push({ id: 'cong', k: 'fig', lb: '합동', t: '직각삼각형에서 빗변과 다른 한 변이 각각 같으므로 △BMD≡△CME (RHS 합동)이에요. 대응각이므로 $\\angle B=\\angle C$.', cap: '△BMD≡△CME (RHS 합동) → ∠B=∠C' });
    if (v === 0) steps.push({ id: 'eq', k: 'eq', t: `$x=\\angle C=\\angle B=${dd(bd)}$`, cap: `∠C=∠B=${bd}°` });
    else if (v === 1) steps.push({ id: 'eq', k: 'eq', t: `$\\angle B=\\angle C$이므로 $\\angle B+\\angle C=180^{\\circ}-${dd(aa)}=${dd(2 * bd)}$이고 $x=\\frac{${dd(2 * bd)}}{2}=${dd(bd)}$`, cap: `x=\\frac{180°−${aa}°}{2}=${bd}°` });
    else steps.push({ id: 'eq', k: 'eq', t: `$\\angle B=\\angle C$이므로 삼각형 ABC는 이등변삼각형이에요. 같은 각의 대변이 같으므로 $x=${ov('AC')}=${ov('AB')}=${m}$ cm`, cap: `∠B=∠C → AC=AB=${m} cm` });
    steps.push({ id: 'ans', k: 'ans', t: v === 2 ? `$x=${m}\\text{ cm}$` : `$x=${dd(bd)}$`, cap: v === 2 ? `x = ${m} cm` : `x = ${bd}°` });
    items.push(SK.seg(Mm, D, { at: 'given', col: 'amber', w: 3.4 }), SK.seg(Mm, E, { at: 'given', col: 'amber', w: 3.4 }),
      SK.ang(D, B, Mm, { r: 16, on: ['given', 'R'], col: 'amber', cols: { R: 'green' } }), SK.ang(E, Cc, Mm, { r: 16, on: ['given', 'R'], col: 'amber', cols: { R: 'green' } }),
      SK.tick(B, Mm, 1, { on: ['given', 'H'], col: 'amber' }), SK.tick(Mm, Cc, 1, { on: ['given', 'H'], col: 'amber' }), SK.tick(Mm, D, 2, { on: ['given', 'S'], col: 'rose' }), SK.tick(Mm, E, 2, { on: ['given', 'S'], col: 'rose' }),
      SK.fill([B, Mm, D], { at: 'cong', to: 'eq', col: 'sky', a: 0.24 }), SK.fill([Cc, Mm, E], { at: 'cong', to: 'eq', col: 'green', a: 0.24 }));
    if (v === 0) items.push(SK.ang(B, Cc, A, { r: 34, ld: 56, on: ['given', 'cong'], col: 'sky', label: dg(bd), gl: true, glTo: 'eq' }), SK.ang(Cc, A, B, { r: 34, ld: 56, on: ['given', 'cong', 'eq', 'ans'], col: 'amber', cols: { cong: 'green' }, label: 'x', size: 17, labels: { ans: `x=${bd}°` }, gl: true }));
    else if (v === 1) items.push(SK.ang(A, B, Cc, { r: 40, ld: 62, on: ['given', 'eq'], col: 'sky', label: dg(aa), gl: true }), SK.ang(B, Cc, A, { r: 34, ld: 56, on: ['given', 'cong', 'eq', 'ans'], col: 'amber', cols: { cong: 'green' }, label: 'x', size: 17, labels: { ans: `x=${bd}°` }, gl: true }), SK.ang(Cc, A, B, { r: 34, ld: 56, at: 'cong', col: 'green', gl: false }));
    else items.push(SK.len(A, B, cen, `${m} cm`, { on: ['given', 'eq'], col: 'sky', size: 16, gap: 8, dy: -22 }), SK.len(A, Cc, cen, 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 8, dy: -22, labels: { ans: `x=${m} cm` } }), SK.ang(B, Cc, A, { r: 32, at: 'cong', to: 'eq', col: 'green', rings: 2 }), SK.ang(Cc, A, B, { r: 32, at: 'cong', to: 'eq', col: 'green', rings: 2 }));
    return {
      fit: [A, B, Cc, D, E], steps, items, l: 50, r: 50,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.06); G.poly(b, [A, B, Cc], 'ink', 3.6); },
      names: (b) => { [A, B, Cc, Mm, D, E].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); G.tagOut(b, A, cen, 'A', { size: 18 }); G.tagOut(b, B, cen, 'B', { size: 18 }); G.tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, Mm, 'M', { dy: 18, size: 18 }); G.tagOut(b, D, cen, 'D', { size: 17 }); G.tagOut(b, E, cen, 'E', { size: 17 }); }
    };
  };
  b6.solve = mkSolve(b6Plan);

  /* @@SOLVE-END */

  // 원클릭 해설은 원본의 합동 그림을 재사용하고, 자막의 cue가 설명을 맡아요.
  // 고정된 문제의 수치를 바꾸지 않고 실제 보조선 위를 따라 그립니다.
  b1.lessonModel = (M, s) => {
    if (s.trLessonProblem && (s.trV || 0) % 3 === 2) {
      const oe = 3 + ((M.h + M.d) % 6), d = oe * tan(M.h);
      return { ...M, g: angGeom(M.h, d, d) };
    }
    return M;
  };
  b3.lessonModel = (M, s) => {
    const v = (s.trV || 0) % 3;
    const q = v === 0 ? Math.sqrt(M.pm * M.pm - M.m * M.m) : v === 1 ? M.m * tan(M.al) : M.m / tan(M.al);
    return { ...M, q, Pp: pt(q, 0) };
  };
  const lessonPlans = [b1Plan, b2Plan, b3Plan, b4Plan, b5Plan, b6Plan];
  [b1, b2, b3, b4, b5, b6].forEach((D, i) => {
    const solve = mkSolve((M, s) => {
      const plan = lessonPlans[i](M, s);
      return { ...plan, steps: plan.steps.map(st => ({ ...st, cap: '' })) };
    });
    D.lessonDraw = (b, s, M, C, SV, ST, idx) => solve.draw(b, s, M, C, ST, idx);
    D.lessonAfterDraw = (b, s, M, C) => {
      const t = C.entry ? 0 : clamp(Number(s.trBT) || 0, 0, 1);
      let p, q;
      if (i === 0 || i === 1) { p = M.g.O; q = M.g.P; }
      else if (i === 2) { p = M.Mm; q = M.Pp; }
      else if (i === 3) { p = M.questionGeo.D; q = M.questionGeo.E; }
      else if (i === 4 && (s.trV || 0) % 3 === 0) {
        M.of.forEach((x, j) => { const u = clamp(t * M.of.length - j, 0, 1); if (u > 0) G.line(b, pt(0, -3), G.lerp(pt(0, -3), pt(x, 0), u), 'sky', 5); });
        return;
      }
      else if (i === 4) { p = M.g.P; q = M.g.E; }
      else { const g = midGeom(M.b, M.b); p = g.M; q = g.D; }
      if (t > 0) G.line(b, p, G.lerp(p, q, t), 'green', 5);
    };
  });

  G.register(40, 't4', '④ 각의 이등분선·수직이등분선', '이등분선·수직이등분선', PARAMS, [b1, b2, b3, b4, b5, b6]);
})();
