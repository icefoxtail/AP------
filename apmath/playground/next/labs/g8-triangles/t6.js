/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ⑥ 「내심」 (t6.js, order 60) — 장면 8개
   · n1 내심 I            · 세 각의 이등분선이 한 점 I에서 만남, I에서 세 변까지의 거리(수선의 발 D·E·F)가 같음
   · n2 내접원과 넓이      · S = ½·r·(a+b+c) — 삼각형 I를 세 조각으로 나누기
   · n3 접선의 길이        · AF=AE, BF=BD, CD=CE를 색 막대로
   · n4 직각삼각형의 내접원 · 직각 꼭짓점 쪽 정사각형, r=(a+b−c)÷2
   · n5 내심의 각          · x+y+z=90°, ∠BIC=90°+½∠A
   · n6 내심을 지나는 평행선 · △ADE의 둘레 = AB+AC
   · n7 각의 비            · ∠AIB:∠BIC:∠CIA=a:b:c → ∠A
   · n8 변의 길이로 접선 길이 구하기 · AB, AC, BC → AF
   각은 정수(도), 길이는 정수(cm)만 보입니다. 피타고라스 정리(√)는 쓰지 않습니다(정수 변의 삼각형 표만 사용).
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, polar, angBetween, inter, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, numProb, mkStmtChoices, degOpts, cmOpts, rd, notes, fmtN, dg, bboxOf, fs, dim, foot, incenter, triBC, triSSS } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const S = (n) => `$\\overline{${n}}$`;
  const fr = (n, d) => `\\frac{${n}}{${d}}`;
  const ARn = { tex: (x) => `${x}\\text{ cm}^2`, plain: (x) => x + ' cm²', pad: 2, valid: (x) => Number.isInteger(x) && x > 0 };

  // 정수 변의 삼각형 표 (a=BC, b=CA, c=AB, 내접원 반지름 r): r 이 정수
  const TRI = [[3, 4, 5, 1], [6, 8, 10, 2], [5, 12, 13, 2], [13, 14, 15, 4], [9, 10, 17, 2], [8, 15, 17, 3], [9, 12, 15, 3]];
  const triF = (v) => { const t = TRI[clamp(Math.round(v), 0, TRI.length - 1)]; return `${t[0]}, ${t[1]}, ${t[2]} cm`; };

  const PARAMS = {
    trNa: P('∠A의 반 (●)', 20, 40, 1, 30, { color: 'sky', format: (v) => v + '°' }),
    trNb: P('∠B의 반 (×)', 20, 40, 1, 30, { color: 'green', format: (v) => v + '°' }),
    trNr: P('내접원의 반지름 r', 2, 6, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    trNi: P('삼각형 고르기 (BC, CA, AB)', 0, 6, 1, 3, { color: 'sky', format: triF }),
    trNx: P('AF = AE', 2, 8, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    trNy: P('BF = BD', 2, 8, 1, 3, { color: 'sky', format: (v) => v + ' cm' }),
    trNz: P('CD = CE', 2, 8, 1, 5, { color: 'green', format: (v) => v + ' cm' }),
    trNj: P('삼각형 고르기 (직각변, 직각변, 빗변)', 0, 6, 1, 1, { color: 'sky', format: (v) => { const t = RT[clamp(Math.round(v), 0, RT.length - 1)]; return `${t[0]}, ${t[1]}, ${t[2]} cm`; } }),
    trNp: P('AB', 4, 12, 1, 9, { color: 'sky', format: (v) => v + ' cm' }),
    trNq: P('AC', 4, 12, 1, 7, { color: 'green', format: (v) => v + ' cm' }),
    trNs: P('BC', 3, 20, 1, 8, { color: 'amber', format: (v) => v + ' cm' }),
    trNm: P('비 a', 1, 8, 1, 3, { color: 'sky', format: (v) => String(v) }),
    trNn: P('비 b', 1, 8, 1, 3, { color: 'green', format: (v) => String(v) }),
    trNo: P('비 c', 1, 8, 1, 4, { color: 'amber', format: (v) => String(v) })
  };
  const RT = [[3, 4, 5, 1], [6, 8, 10, 2], [5, 12, 13, 2], [9, 12, 15, 3], [8, 15, 17, 3], [12, 16, 20, 4], [7, 24, 25, 3]];

  // 꼭짓점 A,B,C 로 내심·내접원·접점
  function incGeom(A, B, Cc) {
    const I = incenter(A, B, Cc), D = foot(I, B, Cc), E = foot(I, Cc, A), F = foot(I, A, B);
    return { A, B, C: Cc, I, D, E, F, r: dist(I, D) };
  }
  const fromAngles = (Ad, Bd, Cd) => { const [A, B, Cc] = triBC(2, Bd, Cd); return incGeom(A, B, Cc); };
  const fromSides = (a, b, c) => { const T3 = triSSS(a, b, c); // A=(0,0), B=(c,0), C 위
    // triSSS(a,b,c): A=(0,0),B=(c,0),C=(x,−h) → 이름 그대로 사용(B 오른쪽 아래, A 왼쪽 아래). 우리는 B 왼쪽·C 오른쪽·A 위로 다시 놓음
    const Bp = pt(0, 0), Cp = pt(a, 0), xx = (c * c - b * b + a * a) / (2 * a), hh = Math.sqrt(Math.max(1e-9, c * c - xx * xx)); void T3; return incGeom(pt(xx, -hh), Bp, Cp); };
  const nameV = (b, g, cen, o = {}) => { tagOut(b, g.A, cen, 'A', { size: 18 }); tagOut(b, g.B, cen, 'B', { size: 18 }); tagOut(b, g.C, cen, 'C', { size: 18 }); };
  const drawBase = (b, g, o = {}) => {
    const { A, B, C: Cc, I } = g;
    b.circle(I, g.r, { color: 'amber', width: 2.6, alpha: 0.85 });
    fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.6);
  };
  const feetNames = (b, g, I) => { tagOut(b, g.D, I, 'D', { size: 16, gap: 8, color: 'green', nameColor: 'green' }); tagOut(b, g.E, I, 'E', { size: 16, gap: 8 }); tagOut(b, g.F, I, 'F', { size: 16, gap: 8 }); };

  /* ====================================================================== 1. 내심 */
  const n1 = {
    id: 't6-1', title: '내심 I와 내접원', short: '내심',
    question: '삼각형의 세 각의 이등분선은 한 점에서 만날까? 그 점에서 세 변까지의 거리는?',
    ctl: ['trNa', 'trNb', 'trNr'],
    init: (s) => { s.trNa = 30; s.trNb = 30; s.trNr = 3; s.trV = 0; },
    reroll: (s) => { s.trNa = rint(22, 38); s.trNb = rint(22, 38); s.trNr = rint(2, 6); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const al = clamp(Math.round(s.trNa), 20, 40), be = clamp(Math.round(s.trNb), 20, 40), ga = 90 - al - be, r = clamp(Math.round(s.trNr), 2, 6); return { al, be, ga, r, g: fromAngles(2 * al, 2 * be, 2 * ga) }; },
    draw(b, s, M, C) {
      const { al, be, ga, r, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g);
      [A, B, Cc].forEach((z) => line(b, z, I, 'green', 3, { dash: [7, 5] }));
      [[D, B, Cc], [E, Cc, A], [F, A, B]].forEach(([Q, p, q]) => { line(b, I, Q, 'rose', 3); ang(b, Q, I, p, { color: 'rose', r: 14 }); });
      ang(b, A, B, I, { color: 'sky', r: 30, rings: 1 }); ang(b, A, I, Cc, { color: 'sky', r: 30, rings: 1 });
      ang(b, B, A, I, { color: 'green', r: 30, rings: 2 }); ang(b, B, I, Cc, { color: 'green', r: 30, rings: 2 });
      ang(b, Cc, B, I, { color: 'violet', r: 30, rings: 3 }); ang(b, Cc, I, A, { color: 'violet', r: 30, rings: 3 });
      if (C.problem) {
        tick(b, I, D, 1, 'amber'); tick(b, I, E, 1, 'amber');
        if (v === 0) T(b, A, `${2 * al}°`, { dy: 84, size: fs(b, 16), color: 'sky' });
        if (v === 1) { G.sideTag(b, I, D, pt(I.x, I.y - 50), `${r} cm`, { color: 'rose', size: fs(b, 16), gap: 8 }); }
      } else {
        tick(b, I, D, 1, 'rose'); tick(b, I, E, 1, 'rose'); tick(b, I, F, 1, 'rose');
        if (show(1)) { T(b, A, `${al}°`, { dx: 0, dy: 50, size: fs(b, 14), color: 'sky' }); T(b, B, `${be}°`, { dx: 50, dy: -12, size: fs(b, 14), color: 'green' }); T(b, Cc, `${ga}°`, { dx: -50, dy: -12, size: fs(b, 14), color: 'violet' }); }
        if (show(3)) G.sideTag(b, I, D, pt(I.x, I.y - 50), `r = ${r} cm`, { color: 'rose', size: fs(b, 15), gap: 8 });
      }
      b.point(I, { color: 'amber', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'rose', r: 3.8 }));
      T(b, I, 'I', { dx: 0, dy: -16, size: 18, color: 'amber' }); nameV(b, g, I); feetNames(b, g, I);
      if (C.problem && v === 0) ang(b, A, B, I, { color: 'amber', r: 38, label: 'x', size: 17, labelDist: 54 });
      if (C.problem && v === 1) { G.sideTag(b, I, E, pt(I.x, I.y + 30), 'x', { color: 'amber', size: fs(b, 18), gap: 8 }); }
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '세 각의 이등분선이 한 점 I에서 만나요';
        else if (C.review && st === 2) { row = 'ID⊥BC, IE⊥CA, IF⊥AB → △IBD≡△IBF 등 (RHA)'; col = 'rose'; }
        else if (C.review && st === 3) { row = `ID=IE=IF=r=${r} cm`; col = 'rose'; }
        else row = `I는 내심: ID=IE=IF=${r} cm (내접원의 반지름)`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `삼각형 ABC의 세 내각의 이등분선을 그으면 한 점 I에서 만나요. 이 점이 내심이에요. ∠A, ∠B, ∠C를 이등분한 각은 각각 ${M.al}°, ${M.be}°, ${M.ga}°예요.`,
      `I에서 세 변에 내린 수선의 발을 D, E, F라 하면 △IBD≡△IBF, △ICD≡△ICE, △IAE≡△IAF (RHA 합동, 빗변 공통 · 이등분된 각)이에요.`,
      `따라서 $\\overline{ID}=\\overline{IE}=\\overline{IF}=r=${M.r}$ cm이고, I를 중심으로 하고 반지름이 r인 원이 세 변에 접해요. 이 원이 내접원이에요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A, ∠B의 반</b>과 <b>내접원의 반지름 r</b>을 바꿔 보세요. 같은 표시(호의 개수)의 각이 같아요. 세 각의 이등분선은 늘 <b>한 점 I</b>에서 만나고, I에서 세 변까지의 거리는 모두 같아요.',
      readouts: [rd('∠A · ∠B · ∠C', `${2 * M.al}° · ${2 * M.be}° · ${2 * M.ga}°`, 'sky'), rd('ID = IE = IF', `${M.r} cm`, 'rose', '내접원의 반지름 r', null, true)],
      formula: `<p>$\\overline{ID}=\\overline{IE}=\\overline{IF}=r=${M.r}$ cm</p><p>$\\angle IAB=\\angle IAC=${M.al}^{\\circ},\\ \\angle IBA=\\angle IBC=${M.be}^{\\circ},\\ \\angle ICA=\\angle ICB=${M.ga}^{\\circ}$</p>`,
      rule: '삼각형의 세 내각의 이등분선은 한 점(내심)에서 만나고, 내심에서 세 변까지의 거리는 같다.',
      notes: notes('내심에서 <b>변</b>까지의 거리(ID, IE, IF)가 같아요. 꼭짓점까지의 거리(IA, IB, IC)는 같지 않아요.', '접점 D, E, F는 변의 중점이 아니에요. 변에 내린 <b>수선의 발</b>이에요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { al, r } = M, key = `${v}:${al}:${M.be}:${r}`;
      const head = '그림에서 점 I는 삼각형 ABC의 내심이고, 점 D, E, F는 I에서 각 변에 내린 수선의 발이다.';
      if (v === 0) return numProb({ tag: '내심 · 각의 이등분선', key, stem: `${head} ∠A=${2 * al}°일 때, ∠IAB의 크기 $x$는?`, correct: al, wrongs: [[2 * al, '∠A 그대로예요. AI는 ∠A의 이등분선이라 반이에요.'], [90 - al, '다시 생각해 보세요.'], [al + 10, '다시 계산해 보세요.'], [Math.max(5, al - 10), '다시 계산해 보세요.'], [180 - 2 * al, '다시 생각해 보세요.']].filter((q) => q[0] !== al), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '내심 · 거리', key, stem: `${head} ${S('ID')}=${r} cm일 때, ${S('IE')}의 길이 $x$는?`, correct: r, wrongs: [[r * 2, '두 배가 아니에요. 내심에서 세 변까지의 거리는 같아요.'], [r + 1, '다시 생각해 보세요.'], [r + 2, '다시 생각해 보세요.'], [Math.max(1, r - 1), '다시 생각해 보세요.'], [r * 3, '다시 생각해 보세요.']].filter((q) => q[0] !== r), ...cmOpts });
      const pool = [
        { h: '$\\overline{ID}=\\overline{IE}=\\overline{IF}$', f: () => true }, { h: '$\\angle IAB=\\angle IAC$', f: () => true }, { h: '$\\overline{ID}\\perp\\overline{BC}$', f: () => true }, { h: '$\\overline{AE}=\\overline{AF}$', f: () => true }, { h: '$\\overline{BD}=\\overline{BF}$', f: () => true },
        { h: '$\\overline{IA}=\\overline{IB}=\\overline{IC}$', f: (m) => Math.abs(dist(m.g.I, m.g.A) - dist(m.g.I, m.g.B)) < 1e-6 && Math.abs(dist(m.g.I, m.g.B) - dist(m.g.I, m.g.C)) < 1e-6 }, { h: '$\\overline{BD}=\\overline{CD}$', f: (m) => Math.abs(dist(m.g.B, m.g.D) - dist(m.g.C, m.g.D)) < 1e-6 }, { h: '$\\angle IAB=\\angle IBA$', f: (m) => m.al === m.be }, { h: '$\\overline{AF}=\\overline{BF}$', f: (m) => Math.abs(dist(m.g.A, m.g.F) - dist(m.g.B, m.g.F)) < 1e-6 }, { h: '$\\overline{AD}=\\overline{BD}$', f: (m) => Math.abs(dist(m.g.A, m.g.D) - dist(m.g.B, m.g.D)) < 1e-6 }
      ];
      const r2 = mkStmtChoices(pool, M, key + 'F', false);
      return { tag: '내심의 성질 · 옳지 않은 것', key: key + 'F', stem: `${head} 다음 중 옳지 않은 것은?`, choices: r2.choices, wide: true };
    },
    verify: (s) => { const M = n1.model(s), g = M.g; return { ans: dist(g.I, g.D), model: dist(g.I, g.E), extra: [[dist(g.I, g.F), dist(g.I, g.D)], [angBetween(g.A, g.B, g.I), M.al], [angBetween(g.B, g.A, g.I), M.be], [angBetween(g.C, g.B, g.I), M.ga]] }; }
  };

  /* ====================================================================== 2. 내접원과 넓이 */
  const n2 = {
    id: 't6-2', title: '내접원과 삼각형의 넓이', short: '내접원과 넓이',
    question: '내접원의 반지름 r과 세 변의 길이 a, b, c로 삼각형의 넓이를 구할 수 있을까?',
    ctl: ['trNi'],
    init: (s) => { s.trNi = 3; s.trV = 0; },
    reroll: (s) => { s.trNi = rint(0, 6); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const t = TRI[clamp(Math.round(s.trNi), 0, 6)], [a, b, c, r] = t, g = fromSides(a, b, c), L = a + b + c; return { a, b, c, r, L, area: (r * L) / 2, g, tri: t }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, r, L, area, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(I, g.r, { color: 'amber', width: 2.6, alpha: 0.85 });
      if (show(2)) { fillPoly(b, [I, B, Cc], 'sky', 0.22); fillPoly(b, [I, Cc, A], 'green', 0.22); fillPoly(b, [I, A, B], 'violet', 0.22); } else fillPoly(b, [A, B, Cc], 'sky', 0.08);
      poly(b, [A, B, Cc], 'ink', 3.6);
      [A, B, Cc].forEach((z) => line(b, z, I, 'ink', 2.4, { alpha: show(2) || C.problem ? 0.9 : 0.35 }));
      [[D, B, Cc], [E, Cc, A], [F, A, B]].forEach(([Q, p, q]) => { line(b, I, Q, 'rose', 3); ang(b, Q, I, p, { color: 'rose', r: 14 }); });
      const cen = I;
      G.sideTag(b, B, Cc, cen, `${a} cm`, { color: 'sky', size: fs(b, 16), gap: 8 }); G.sideTag(b, Cc, A, cen, `${bb} cm`, { color: 'green', size: fs(b, 16), gap: 8 }); G.sideTag(b, A, B, cen, `${c} cm`, { color: 'violet', size: fs(b, 16), gap: 8 });
      if (C.problem) {
        if (v === 0) G.sideTag(b, I, D, pt(I.x, I.y - 50), `${r} cm`, { color: 'rose', size: fs(b, 15), gap: 6 });
        else T(b, I, `넓이 ${area} cm²`, { dy: 26, size: fs(b, 15), color: 'amber' });
        if (v === 1) G.sideTag(b, I, D, pt(I.x, I.y - 50), 'x', { color: 'rose', size: fs(b, 18), gap: 6 });
      } else {
        G.sideTag(b, I, D, pt(I.x, I.y - 50), `r = ${r} cm`, { color: 'rose', size: fs(b, 15), gap: 6 });
      }
      b.point(I, { color: 'amber', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'rose', r: 3.6 }));
      T(b, I, 'I', { dy: -16, dx: 14, size: 17, color: 'amber' }); nameV(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `a+b+c = ${a}+${bb}+${c} = ${L} cm, r=${r} cm`;
        else if (C.review && st === 2) { row = `밑변 a, b, c · 높이 r인 세 삼각형`; col = 'green'; }
        else if (C.review && st === 3) { row = `S = \\frac{1}{2}×${r}×${L} = ${area} cm²`; col = 'amber'; }
        else row = `S = \\frac{1}{2}×r×(a+b+c) = ${area} cm²`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `내접원의 반지름 $r=${M.r}$ cm이고, 세 변은 $a=${M.a}$, $b=${M.b}$, $c=${M.c}$ cm예요. 둘레는 $a+b+c=${M.L}$ cm.`,
      `내심 I로 삼각형 ABC를 세 삼각형 IBC, ICA, IAB로 나눠요. 밑변이 각각 a, b, c이고 높이가 모두 r(내접원의 반지름)이에요.`,
      `$S=\\triangle IBC+\\triangle ICA+\\triangle IAB=${fr('1', 2)}ra+${fr('1', 2)}rb+${fr('1', 2)}rc=${fr('1', 2)}r(a+b+c)=${fr('1', 2)}\\times${M.r}\\times${M.L}=${M.area}$ (cm²)`
    ],
    view: (M) => ({
      guide: '막대로 <b>삼각형</b>을 골라 보세요(내접원의 반지름이 정수인 삼각형만 있어요). 내심 I로 나눈 세 삼각형은 높이가 모두 <b>r</b>이라서 넓이는 <b>S = ½ r (a+b+c)</b>예요.',
      readouts: [rd('a · b · c', `${M.a} · ${M.b} · ${M.c} cm`, 'sky'), rd('내접원의 반지름 r', `${M.r} cm`, 'rose'), rd('둘레 a+b+c', `${M.L} cm`, 'sky'), rd('넓이 S', `${M.area} cm²`, 'amber', '½ × r × 둘레', null, true)],
      formula: `<p>$S=${fr('1', 2)}r(a+b+c)=${fr('1', 2)}\\times${M.r}\\times${M.L}=${M.area}$ (cm²)</p>`,
      rule: '내접원의 반지름을 r, 세 변의 길이를 a, b, c라 하면 삼각형의 넓이 S = ½ r (a+b+c)이다.',
      notes: notes('높이는 <b>r</b>이에요(꼭짓점에서 내린 높이가 아니에요). 밑변 a, b, c 세 개를 모두 더해요.', '(a+b+c)는 삼각형의 <b>둘레</b>예요. 둘레와 r을 곱해 2로 나누면 돼요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, r, L, area } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}:${c}`;
      const head = `그림에서 점 I는 삼각형 ABC의 내심이고 ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm, ${S('AB')}=${c} cm이다.`;
      if (v === 0) return numProb({ tag: '내접원과 넓이 · 넓이', key, stem: `${head} 내접원의 반지름의 길이가 ${r} cm일 때, 삼각형 ABC의 넓이 $x$는?`, correct: area, wrongs: [[r * L, '2로 나누지 않았어요. S=½r(a+b+c)예요.'], [area * 2 - L, '다시 계산해 보세요.'], [(r * (a + bb)) / 2, '세 변을 모두 더해야 해요.'], [area + 2, '다시 계산해 보세요.'], [Math.max(1, area - 2), '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== area), ...ARn });
      return numProb({ tag: '내접원과 넓이 · 반지름', key, stem: `${head} 삼각형 ABC의 넓이가 ${area} cm²일 때, 내접원의 반지름 $x$는?`, correct: r, wrongs: [[(2 * area) / (a + bb), '세 변을 모두 더해야 해요.'], [area / L, '2를 곱해야 해요. S=½r(a+b+c)이므로 r=2S÷(a+b+c)예요.'], [r + 1, '다시 계산해 보세요.'], [r + 2, '다시 계산해 보세요.'], [Math.max(1, r - 1), '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== r && q[0] > 0), ...cmOpts });
    },
    verify: (s) => { const M = n2.model(s), g = M.g; const ar = Math.abs(G.polyArea([g.A, g.B, g.C])); return { ans: ar, model: M.area, extra: [[g.r, M.r], [dist(g.B, g.C), M.a], [dist(g.C, g.A), M.b], [dist(g.A, g.B), M.c]] }; }
  };

  /* ====================================================================== 3. 접선의 길이 */
  const tanGeom = (x, y, z) => fromSides(y + z, z + x, x + y);
  const n3 = {
    id: 't6-3', title: '꼭짓점에서 접점까지의 거리', short: '접선의 길이',
    question: '내접원의 접점 D, E, F에서 꼭짓점까지의 거리 AF와 AE, BF와 BD, CD와 CE는 어떤 관계일까?',
    ctl: ['trNx', 'trNy', 'trNz'],
    init: (s) => { s.trNx = 4; s.trNy = 3; s.trNz = 5; s.trV = 0; },
    reroll: (s) => { s.trNx = rint(2, 8); s.trNy = rint(2, 8); s.trNz = rint(2, 8); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const x = clamp(Math.round(s.trNx), 2, 8), y = clamp(Math.round(s.trNy), 2, 8), z = clamp(Math.round(s.trNz), 2, 8); return { x, y, z, a: y + z, b: z + x, c: x + y, g: tanGeom(x, y, z) }; },
    draw(b, s, M, C) {
      const { x, y, z, a, b: bb, c, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g);
      [[D, B, Cc], [E, Cc, A], [F, A, B]].forEach(([Q, p, q]) => line(b, I, Q, 'rose', 2.4, { alpha: 0.6 }));
      // 접선 길이 색 막대
      line(b, A, F, 'amber', 5.5); line(b, A, E, 'amber', 5.5); line(b, B, F, 'sky', 5.5); line(b, B, D, 'sky', 5.5); line(b, Cc, D, 'green', 5.5); line(b, Cc, E, 'green', 5.5);
      tick(b, A, F, 1, 'amber'); tick(b, A, E, 1, 'amber'); tick(b, B, F, 2, 'sky'); tick(b, B, D, 2, 'sky'); tick(b, Cc, D, 3, 'green'); tick(b, Cc, E, 3, 'green');
      const q = fs(b, 15);
      if (C.problem) {
        G.sideTag(b, A, B, I, `${c} cm`, { color: 'ink', size: q, gap: 26 }); G.sideTag(b, B, Cc, I, `${a} cm`, { color: 'ink', size: q, gap: 26 }); G.sideTag(b, Cc, A, I, `${bb} cm`, { color: 'ink', size: q, gap: 26 });
        if (v === 0) G.sideTag(b, A, F, I, 'x', { color: 'amber', size: fs(b, 18), gap: 14 });
        else if (v === 1) G.sideTag(b, B, D, I, 'x', { color: 'sky', size: fs(b, 18), gap: 14 });
      } else {
        G.sideTag(b, A, F, I, `${x}`, { color: 'amber', size: q, gap: 14 }); G.sideTag(b, A, E, I, `${x}`, { color: 'amber', size: q, gap: 14 });
        G.sideTag(b, B, F, I, `${y}`, { color: 'sky', size: q, gap: 14 }); G.sideTag(b, B, D, I, `${y}`, { color: 'sky', size: q, gap: 14 });
        G.sideTag(b, Cc, D, I, `${z}`, { color: 'green', size: q, gap: 14 }); G.sideTag(b, Cc, E, I, `${z}`, { color: 'green', size: q, gap: 14 });
        if (show(2)) { G.sideTag(b, A, B, I, `AB=${c}`, { color: 'ink', size: q, gap: 30 }); G.sideTag(b, B, Cc, I, `BC=${a}`, { color: 'ink', size: q, gap: 30 }); G.sideTag(b, Cc, A, I, `CA=${bb}`, { color: 'ink', size: q, gap: 30 }); }
      }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((zp) => b.point(zp, { color: 'ink', r: 4.5 })); [D, E, F].forEach((zp) => b.point(zp, { color: 'rose', r: 3.8 }));
      T(b, I, 'I', { dy: -2, dx: 14, size: 17, color: 'amber' }); nameV(b, g, I); feetNames(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `AF=AE=${x}, BF=BD=${y}, CD=CE=${z} (cm)`;
        else if (C.review && st === 2) { row = `AB=${x}+${y}=${c}, BC=${y}+${z}=${a}, CA=${z}+${x}=${bb}`; col = 'ink'; }
        else if (C.review && st === 3) { row = `AF = (AB+CA−BC)÷2 = (${c}+${bb}−${a})÷2 = ${x} cm`; col = 'amber'; }
        else row = `AF=AE=${x}, BF=BD=${y}, CD=CE=${z} → 둘레 ${2 * (x + y + z)} cm`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 66, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `꼭짓점에서 내접원에 그은 두 접선의 길이는 같아요. $\\overline{AF}=\\overline{AE}=${M.x}$, $\\overline{BF}=\\overline{BD}=${M.y}$, $\\overline{CD}=\\overline{CE}=${M.z}$ (cm)`,
      `세 변을 접선의 길이로 나타내요. $\\overline{AB}=\\overline{AF}+\\overline{BF}=${M.x}+${M.y}=${M.c}$, $\\overline{BC}=${M.y}+${M.z}=${M.a}$, $\\overline{CA}=${M.z}+${M.x}=${M.b}$`,
      `세 식을 이용하면 $\\overline{AF}=${fr('\\overline{AB}+\\overline{CA}-\\overline{BC}', 2)}=${fr(`${M.c}+${M.b}-${M.a}`, 2)}=${M.x}$ (cm)이고, 둘레는 $2(${M.x}+${M.y}+${M.z})=${2 * (M.x + M.y + M.z)}$ cm예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AF, BF, CD</b>를 바꿔 보세요. 같은 색의 두 선분(눈금의 개수가 같은 두 선분)은 길이가 같아요. 세 변은 두 접선의 길이를 <b>더한 것</b>이에요.',
      readouts: [rd('AF = AE', `${M.x} cm`, 'amber'), rd('BF = BD', `${M.y} cm`, 'sky'), rd('CD = CE', `${M.z} cm`, 'green'), rd('AB · BC · CA', `${M.c} · ${M.a} · ${M.b} cm`, 'sky', '두 접선 길이의 합', null, true)],
      formula: `<p>$\\overline{AF}=${fr('\\overline{AB}+\\overline{CA}-\\overline{BC}', 2)}=${fr(`${M.c}+${M.b}-${M.a}`, 2)}=${M.x}$ (cm)</p><p>(둘레) $=2(${M.x}+${M.y}+${M.z})=${2 * (M.x + M.y + M.z)}$ cm</p>`,
      rule: '삼각형 밖의 한 점(꼭짓점)에서 원에 그은 두 접선의 길이는 같다. 따라서 AF=AE, BF=BD, CD=CE이다.',
      notes: notes('같은 점에서 그은 <b>두 접선</b>만 길이가 같아요. AF와 BF는 같지 않아요.', '변의 길이 = 양 끝 점의 접선 길이의 <b>합</b>이에요.')
    }),
    prob: (M, s) => {
      const { x, y, z, a, b: bb, c } = M, v = (s.trV || 0) % 3, key = `${v}:${x}:${y}:${z}`;
      const head = `그림에서 원 I는 삼각형 ABC의 내접원이고 세 점 D, E, F는 접점이다. ${S('AB')}=${c} cm, ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm이다.`;
      if (v === 0) return numProb({ tag: '접선의 길이 · AF', key, stem: `${head} ${S('AF')}의 길이 $x$는?`, correct: x, wrongs: [[c - x, 'BF의 길이예요. AF=(AB+CA−BC)÷2예요.'], [y, 'BF의 길이예요.'], [z, 'CD의 길이예요.'], [x + 1, '다시 계산해 보세요.'], [Math.max(1, x - 1), '다시 계산해 보세요.']].filter((q) => q[0] !== x && q[0] > 0), ...cmOpts });
      if (v === 1) return numProb({ tag: '접선의 길이 · BD', key, stem: `${head} ${S('BD')}의 길이 $x$는?`, correct: y, wrongs: [[x, 'AF의 길이예요.'], [z, 'CD의 길이예요.'], [a - y, 'CD의 길이예요. BD=(AB+BC−CA)÷2예요.'], [y + 1, '다시 계산해 보세요.'], [Math.max(1, y - 1), '다시 계산해 보세요.']].filter((q) => q[0] !== y && q[0] > 0), ...cmOpts });
      return numProb({ tag: '접선의 길이 · 둘레', key, stem: `그림에서 원 I는 삼각형 ABC의 내접원이고 세 점 D, E, F는 접점이다. ${S('AF')}=${x} cm, ${S('BC')}=${a} cm일 때, 삼각형 ABC의 둘레 $x$는?`, correct: 2 * x + 2 * a, wrongs: [[x + a, '둘레는 AF+AE+...가 아니라 (AF+BC)의 2배예요.'], [2 * x + a, 'BC를 한 번만 더했어요.'], [x + 2 * a, 'AF를 한 번만 더했어요.'], [2 * x + 2 * a + 2, '다시 계산해 보세요.'], [2 * x + 2 * a - 2, '다시 계산해 보세요.']].filter((q) => q[0] !== 2 * x + 2 * a), ...cmOpts });
    },
    verify: (s) => { const M = n3.model(s), g = M.g; return { ans: dist(g.A, g.F), model: M.x, extra: [[dist(g.A, g.E), M.x], [dist(g.B, g.F), M.y], [dist(g.B, g.D), M.y], [dist(g.C, g.D), M.z], [dist(g.C, g.E), M.z]] }; }
  };

  /* ====================================================================== 4. 직각삼각형의 내접원 */
  const rtGeom = (a, b) => { const C0 = pt(0, 0), B = pt(a, 0), A = pt(0, -b), c = Math.hypot(a, b), r = (a + b - c) / 2, I = pt(r, -r); return { A, B, C: C0, I, D: pt(r, 0), E: pt(0, -r), F: foot(I, A, B), r }; };
  const n4 = {
    id: 't6-4', title: '직각삼각형의 내접원', short: '직각삼각형의 내접원',
    question: '∠C=90°인 직각삼각형의 내접원의 반지름 r을 세 변의 길이로 구할 수 있을까?',
    ctl: ['trNj'],
    init: (s) => { s.trNj = 0; s.trV = 0; },
    reroll: (s) => { s.trNj = rint(0, 6); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const t = RT[clamp(Math.round(s.trNj), 0, 6)], [a, b, c, r] = t; return { a, b, c, r, g: rtGeom(a, b), ar: (a * b) / 2 }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, r, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 60, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(I, r, { color: 'amber', width: 2.6, alpha: 0.85 });
      fillPoly(b, [A, B, Cc], 'sky', 0.08);
      if (show(1)) fillPoly(b, [Cc, D, I, E], 'rose', 0.25);
      poly(b, [A, B, Cc], 'ink', 3.6);
      ang(b, Cc, A, B, { color: 'sky', r: 26 });
      [[D, B, Cc], [E, Cc, A], [F, A, B]].forEach(([Q]) => line(b, I, Q, 'rose', 3));
      ang(b, D, I, Cc, { color: 'rose', r: 12 }); ang(b, E, I, Cc, { color: 'rose', r: 12 });
      const cen = I;
      G.sideTag(b, Cc, B, pt(I.x, I.y - 50), `${a} cm`, { color: 'sky', size: fs(b, 16), gap: 8 }); G.sideTag(b, Cc, A, pt(50, I.y), `${bb} cm`, { color: 'green', size: fs(b, 16), gap: 8 }); G.sideTag(b, A, B, cen, `${c} cm`, { color: 'violet', size: fs(b, 16), gap: 8 });
      if (C.problem) {
        if (v === 0) G.sideTag(b, I, D, pt(I.x + 50, I.y), 'x', { color: 'rose', size: fs(b, 18), gap: 6 });
        else { G.sideTag(b, I, D, pt(I.x + 50, I.y), `${r} cm`, { color: 'rose', size: fs(b, 15), gap: 6 }); }
      } else if (show(1)) { G.sideTag(b, I, D, pt(I.x + 50, I.y), `r`, { color: 'rose', size: fs(b, 16), gap: 6 }) }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'rose', r: 3.6 }));
      T(b, I, 'I', { dy: -14, dx: 10, size: 16, color: 'amber' }); tagOut(b, A, I, 'A', { size: 18 }); tagOut(b, B, I, 'B', { size: 18 }); tagOut(b, Cc, I, 'C', { size: 18 });
      T(b, D, 'D', { dy: 16, size: 16, color: 'green' }); T(b, E, 'E', { dx: -14, dy: 0, size: 16 }); tagOut(b, F, I, 'F', { size: 16, gap: 8 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'CDIE는 한 변이 r인 정사각형 → CD=CE=r';
        else if (C.review && st === 2) { row = `AE=AF=${bb}−r, BD=BF=${a}−r`; col = 'violet'; }
        else if (C.review && st === 3) { row = `r = (${a}+${bb}−${c})÷2 = ${r} cm`; col = 'amber'; }
        else row = `r = (a+b−c)÷2 = (${a}+${bb}−${c})÷2 = ${r} cm`;
        rowT(b, pt(a / 2, 0), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `∠C=90°이고 ID⊥BC, IE⊥CA이므로 사각형 CDIE는 한 변이 r인 정사각형이에요. 따라서 $\\overline{CD}=\\overline{CE}=r$.`,
      `접선의 길이는 같으므로 $\\overline{AE}=\\overline{AF}=${M.b}-r$, $\\overline{BD}=\\overline{BF}=${M.a}-r$예요.`,
      `$\\overline{AB}=\\overline{AF}+\\overline{BF}$이므로 $${M.c}=(${M.b}-r)+(${M.a}-r)$. 따라서 $r=${fr(`${M.a}+${M.b}-${M.c}`, 2)}=${M.r}$ (cm)예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>삼각형</b>을 골라 보세요(세 변이 정수인 직각삼각형이에요). 직각 꼭짓점 C 쪽에는 한 변이 <b>r</b>인 정사각형 CDIE가 생겨서 <b>r=(a+b−c)÷2</b>예요.',
      readouts: [rd('직각을 낀 두 변', `${M.a} cm, ${M.b} cm`, 'sky'), rd('빗변 c', `${M.c} cm`, 'violet'), rd('내접원의 반지름 r', `${M.r} cm`, 'rose', '(a + b − c) ÷ 2', null, true)],
      formula: `<p>$r=${fr('a+b-c', 2)}=${fr(`${M.a}+${M.b}-${M.c}`, 2)}=${M.r}$ (cm)</p><p>(넓이) $=${fr('1', 2)}\\times${M.a}\\times${M.b}=${M.ar}$, $=${fr('1', 2)}r(a+b+c)$로도 구할 수 있어요.</p>`,
      rule: '직각삼각형의 내접원의 반지름은 r = (직각을 낀 두 변의 합 − 빗변) ÷ 2 이다.',
      notes: notes('빗변을 <b>빼는</b> 것을 잊지 마세요. 세 변의 합이 아니라 두 변의 합 − 빗변이에요.', '직각 꼭짓점에서 접점까지의 거리가 r이에요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, r } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}`;
      const head = `그림과 같이 ∠C=90°인 직각삼각형 ABC의 내접원의 접점이 D, E, F이고 ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm, ${S('AB')}=${c} cm이다.`;
      if (v === 0) return numProb({ tag: '직각삼각형의 내접원 · 반지름', key, stem: `${head} 내접원의 반지름의 길이 $x$는?`, correct: r, wrongs: [[a + bb - c, '2로 나누지 않았어요.'], [(a + bb + c) / 2, '둘레의 반이에요. r=(두 변의 합−빗변)÷2예요.'], [(a + bb) / 2, '빗변을 빼야 해요.'], [r + 1, '다시 계산해 보세요.'], [r + 2, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== r && q[0] > 0), ...cmOpts });
      return numProb({ tag: '직각삼각형의 내접원 · 빗변', key, stem: `그림과 같이 ∠C=90°인 직각삼각형 ABC의 내접원의 반지름이 ${r} cm이고 ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm이다. 빗변 ${S('AB')}의 길이 $x$는?`, correct: c, wrongs: [[a + bb, '두 변의 합이에요. 빗변=두 변의 합−2r이에요.'], [a + bb - r, 'r을 한 번만 뺐어요. 2r을 빼야 해요.'], [a + bb + 2 * r, '더하지 않고 빼야 해요.'], [c + 1, '다시 계산해 보세요.'], [c - 1, '다시 계산해 보세요.']].filter((q) => q[0] !== c && q[0] > 0), ...cmOpts });
    },
    verify: (s) => { const M = n4.model(s), g = M.g; return { ans: g.r, model: M.r, extra: [[dist(g.I, g.F), g.r], [dist(g.A, g.B), M.c], [angBetween(g.C, g.A, g.B), 90]] }; }
  };

  /* ====================================================================== 5. 내심의 각 */
  const n5 = {
    id: 't6-5', title: '내심의 각 (x+y+z=90°, ∠BIC=90°+½∠A)', short: '내심의 각',
    question: '내심 I에서 만든 각 ∠BIC는 ∠A와 어떤 관계일까?',
    ctl: ['trNa', 'trNb'],
    init: (s) => { s.trNa = 30; s.trNb = 30; s.trV = 0; },
    reroll: (s) => { s.trNa = rint(22, 38); s.trNb = rint(22, 38); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const al = clamp(Math.round(s.trNa), 20, 40), be = clamp(Math.round(s.trNb), 20, 40), ga = 90 - al - be; return { al, be, ga, bic: 90 + al, aib: 90 + ga, cia: 90 + be, g: fromAngles(2 * al, 2 * be, 2 * ga) }; },
    draw(b, s, M, C) {
      const { al, be, ga, bic, g } = M, { A, B, C: Cc, I } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g); [A, B, Cc].forEach((z) => line(b, z, I, 'green', 3, { dash: [7, 5] }));
      const pairs = (n) => { ang(b, A, B, I, { color: 'sky', r: 30, rings: 1 }); ang(b, A, I, Cc, { color: 'sky', r: 30, rings: 1 }); void n; };
      if (C.problem) {
        pairs();
        ang(b, B, A, I, { color: 'green', r: 30, rings: 2 }); ang(b, B, I, Cc, { color: 'green', r: 30, rings: 2 });
        ang(b, Cc, B, I, { color: 'violet', r: 30, rings: 3 }); ang(b, Cc, I, A, { color: 'violet', r: 30, rings: 3 });
        if (v === 0) { T(b, A, `${2 * al}°`, { dy: 44, size: fs(b, 16), color: 'sky' }); ang(b, I, B, Cc, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 54 }); }
        else if (v === 1) { ang(b, I, B, Cc, { color: 'sky', r: 34, label: dg(bic), size: 16, labelDist: 54 }); T(b, A, 'x', { dy: 44, size: fs(b, 18), color: 'amber' }); }
        else { T(b, B, `${be}°`, { dx: 50, dy: -12, size: fs(b, 15), color: 'green' }); T(b, Cc, `${ga}°`, { dx: -50, dy: -12, size: fs(b, 15), color: 'violet' }); T(b, A, 'x', { dy: 44, size: fs(b, 18), color: 'amber' }); }
      } else {
        ang(b, A, B, I, { color: 'sky', r: 30, rings: 1 }); ang(b, A, I, Cc, { color: 'sky', r: 30, rings: 1 });
        ang(b, B, A, I, { color: 'green', r: 30, rings: 2 }); ang(b, B, I, Cc, { color: 'green', r: 30, rings: 2 }); ang(b, Cc, B, I, { color: 'violet', r: 30, rings: 3 }); ang(b, Cc, I, A, { color: 'violet', r: 30, rings: 3 });
        if (show(1)) { T(b, A, `${al}°`, { dy: 50, size: fs(b, 14), color: 'sky' }); T(b, B, `${be}°`, { dx: 50, dy: -12, size: fs(b, 14), color: 'green' }); T(b, Cc, `${ga}°`, { dx: -50, dy: -12, size: fs(b, 14), color: 'violet' }); }
        if (show(3)) ang(b, I, B, Cc, { color: 'amber', r: 36, label: dg(bic), size: 15, labelDist: 56 });
      }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, I, 'I', { dy: -16, size: 18, color: 'amber' }); nameV(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠IAB=∠IAC=●, ∠IBA=∠IBC=×, ∠ICA=∠ICB=■`;
        else if (C.review && st === 2) { row = `●+×+■ = 90° (${al}°+${be}°+${ga}°)`; col = 'green'; }
        else if (C.review && st === 3) { row = `∠BIC = 180°−(×+■) = 90°+● = ${bic}°`; col = 'amber'; }
        else row = `x+y+z=${al + be + ga}°, ∠BIC=90°+\\frac{1}{2}∠A=${bic}°`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `내심 I에서 세 꼭짓점을 이으면 각의 이등분선이므로 $\\angle IAB=\\angle IAC=●$, $\\angle IBA=\\angle IBC=×$, $\\angle ICA=\\angle ICB=■$라 할 수 있어요.`,
      `삼각형 ABC의 내각의 합: $2●+2×+2■=180^{\\circ}$이므로 $●+×+■=90^{\\circ}$ (이 그림: ${M.al}°+${M.be}°+${M.ga}°=90°).`,
      `△IBC에서 $\\angle BIC=180^{\\circ}-(×+■)=180^{\\circ}-(90^{\\circ}-●)=90^{\\circ}+●=90^{\\circ}+${fr('1', 2)}\\angle A=90^{\\circ}+${fr('1', 2)}\\times${2 * M.al}^{\\circ}=${M.bic}^{\\circ}$`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A의 반(●), ∠B의 반(×)</b>을 바꿔 보세요. 세 반쪽 각의 합은 늘 <b>90°</b>이고, 그래서 <b>∠BIC는 90°보다 ∠A의 반만큼 커요</b>.',
      readouts: [rd('● · × · ■', `${M.al}° · ${M.be}° · ${M.ga}°`, 'sky', '합 90°'), rd('∠BIC', `${M.bic}°`, 'amber', '90° + ½∠A', null, true)],
      formula: `<p>$x+y+z=90^{\\circ}$</p><p>$\\angle BIC=90^{\\circ}+${fr('1', 2)}\\angle A=90^{\\circ}+${fr('1', 2)}\\times${2 * M.al}^{\\circ}=${M.bic}^{\\circ}$</p>`,
      rule: '삼각형의 내심 I에 대하여 ∠BIC = 90° + ½∠A 이다. (세 이등분각의 합 x+y+z=90°)',
      notes: notes('∠BIC는 <b>90°보다 커요</b>. 90°−½∠A가 아니라 90°+½∠A예요(외각의 이등분선일 때가 90°−½∠A).', '½∠A는 ∠A를 <b>이등분한 각</b> ●이에요. ∠A 자체를 더하면 안 돼요.')
    }),
    prob: (M, s) => {
      const { al, be, ga, bic } = M, v = (s.trV || 0) % 3, key = `${v}:${al}:${be}`;
      const head = '그림에서 점 I는 삼각형 ABC의 내심이다.';
      if (v === 0) return numProb({ tag: '내심의 각 · ∠BIC', key, stem: `${head} ∠A=${2 * al}°일 때, ∠BIC의 크기 $x$는?`, correct: bic, wrongs: [[90 - al, '내각의 이등분선 둘이 만나면 90°보다 커요. 90°+½∠A예요.'], [180 - 2 * al, '다시 생각해 보세요.'], [90 + 2 * al, '∠A의 반을 더해야 해요.'], [2 * al, '다시 생각해 보세요.'], [bic + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== bic && q[0] > 0 && q[0] < 180), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '내심의 각 · ∠A', key, stem: `${head} ∠BIC=${bic}°일 때, ∠A의 크기 $x$는?`, correct: 2 * al, wrongs: [[bic - 90, '∠A의 반이에요. ∠A는 그 2배예요.'], [180 - bic, '다시 생각해 보세요.'], [bic, '∠BIC 그대로예요.'], [2 * (180 - bic), '다시 생각해 보세요.'], [2 * al + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== 2 * al && q[0] > 0 && q[0] < 180), ...degOpts(5) });
      return numProb({ tag: '내심의 각 · x+y+z=90°', key, stem: `${head} ∠IBA=∠IBC=${be}°, ∠ICA=∠ICB=${ga}°일 때, ∠A의 크기 $x$는?`, correct: 2 * al, wrongs: [[al, '∠A의 반이에요. ∠A는 그 2배예요.'], [180 - be - ga, '∠BIC예요.'], [90 - be - ga, '∠A의 반이에요.'], [be + ga, '다시 생각해 보세요.'], [2 * al + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== 2 * al && q[0] > 0 && q[0] < 180), ...degOpts(5) });
    },
    verify: (s) => { const M = n5.model(s), g = M.g; return { ans: angBetween(g.I, g.B, g.C), model: M.bic, extra: [[M.al + M.be + M.ga, 90], [angBetween(g.A, g.B, g.C), 2 * M.al]] }; }
  };

  /* ====================================================================== 6. 내심을 지나는 평행선 */
  const n6 = {
    id: 't6-6', title: '내심을 지나는 평행선', short: '내심을 지나는 평행선',
    question: '내심 I를 지나고 BC에 평행한 선이 AB, AC와 만나는 점을 D, E라 할 때 △ADE의 둘레는?',
    ctl: ['trNx', 'trNy', 'trNz'],
    init: (s) => { s.trNx = 4; s.trNy = 3; s.trNz = 5; s.trV = 0; },
    reroll: (s) => { s.trNx = rint(3, 8); s.trNy = rint(3, 8); s.trNz = rint(3, 8); s.trV = (s.trV + 1) % 2; },
    model: (s) => {
      const x = clamp(Math.round(s.trNx), 2, 8), y = clamp(Math.round(s.trNy), 2, 8), z = clamp(Math.round(s.trNz), 2, 8), g = tanGeom(x, y, z), { A, B, C: Cc, I } = g;
      const D = inter(A, B, I, add(I, sub(Cc, B))), E = inter(A, Cc, I, add(I, sub(Cc, B)));
      return { x, y, z, a: y + z, b: z + x, c: x + y, g, D, E, per: (z + x) + (x + y) };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, g, D, E, per } = M, { A, B, C: Cc, I } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      fillPoly(b, [A, D, E], 'green', 0.2); drawBase(b, g);
      line(b, B, I, 'sky', 3, { dash: [7, 5] }); line(b, Cc, I, 'violet', 3, { dash: [7, 5] });
      line(b, D, E, 'green', 3.6);
      ang(b, B, A, I, { color: 'sky', r: 30, rings: 1 }); ang(b, B, I, Cc, { color: 'sky', r: 30, rings: 1 }); ang(b, Cc, B, I, { color: 'violet', r: 30, rings: 2 }); ang(b, Cc, I, A, { color: 'violet', r: 30, rings: 2 });
      if (!C.problem || v === 0) { G.sideTag(b, A, B, I, `${c} cm`, { color: 'ink', size: fs(b, 15), gap: 8 }); G.sideTag(b, Cc, A, I, `${bb} cm`, { color: 'ink', size: fs(b, 15), gap: 8 }); }
      if (C.problem && v === 1) T(b, I, `△ABC의 둘레 ${a + bb + c} cm`, { dy: 40, size: fs(b, 14), color: 'ink' });
      if (C.problem) { G.sideTag(b, B, Cc, I, `${a} cm`, { color: 'ink', size: fs(b, 15), gap: 8 }); }
      else if (show(2)) { tick(b, D, B, 2, 'sky'); tick(b, D, I, 2, 'sky'); tick(b, E, Cc, 3, 'violet'); tick(b, E, I, 3, 'violet'); }
      if (C.problem) { tick(b, D, B, 2, 'sky'); tick(b, D, I, 2, 'sky'); tick(b, E, Cc, 3, 'violet'); tick(b, E, I, 3, 'violet'); }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E].forEach((z) => b.point(z, { color: 'green', r: 4.5 }));
      T(b, I, 'I', { dy: 16, size: 17, color: 'amber' }); nameV(b, g, I); tagOut(b, D, I, 'D', { size: 17, gap: 8 }); tagOut(b, E, I, 'E', { size: 17, gap: 8 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'DE∥BC → ∠DIB=∠IBC (엇각), ∠IBC=∠IBD → DB=DI';
        else if (C.review && st === 2) { row = 'DB=DI, EC=EI → DE=DB+EC'; col = 'green'; }
        else if (C.review && st === 3) { row = `△ADE 둘레 = AB+AC = ${c}+${bb} = ${per} cm`; col = 'amber'; }
        else row = `△ADE의 둘레 = AB+AC = ${c}+${bb} = ${per} cm`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `DE∥BC이므로 $\\angle DIB=\\angle IBC$ (엇각)이고, BI가 ∠B의 이등분선이므로 $\\angle IBD=\\angle IBC$예요. 그래서 $\\angle DIB=\\angle DBI$이고 △DBI는 이등변삼각형이므로 $\\overline{DB}=\\overline{DI}$예요.`,
      `같은 방법으로 $\\angle EIC=\\angle ICB=\\angle ICE$이므로 $\\overline{EC}=\\overline{EI}$예요. 따라서 $\\overline{DE}=\\overline{DI}+\\overline{IE}=\\overline{DB}+\\overline{EC}$.`,
      `△ADE의 둘레 $=\\overline{AD}+\\overline{DE}+\\overline{EA}=\\overline{AD}+(\\overline{DB}+\\overline{EC})+\\overline{EA}=\\overline{AB}+\\overline{AC}=${M.c}+${M.b}=${M.per}$ (cm)`
    ],
    view: (M) => ({
      guide: '막대로 <b>접선의 길이</b>를 바꿔 삼각형을 바꿔 보세요. 내심 I를 지나 BC에 평행하게 그은 선분 DE에서 <b>DB=DI, EC=EI</b>가 돼요. 그래서 △ADE의 둘레는 늘 <b>AB+AC</b>예요.',
      readouts: [rd('AB · AC · BC', `${M.c} · ${M.b} · ${M.a} cm`, 'sky'), rd('△ADE의 둘레', `${M.per} cm`, 'amber', 'AB + AC', null, true)],
      formula: `<p>$\\overline{DB}=\\overline{DI},\\ \\overline{EC}=\\overline{EI}$</p><p>(△ADE의 둘레) $=\\overline{AB}+\\overline{AC}=${M.c}+${M.b}=${M.per}$ (cm)</p>`,
      rule: '삼각형 ABC의 내심 I를 지나고 BC에 평행한 직선이 AB, AC와 만나는 점을 D, E라 하면 △ADE의 둘레 = AB + AC 이다.',
      notes: notes('△ADE의 둘레에 <b>BC는 들어가지 않아요</b>. AB와 AC의 합이에요.', 'DB=DI, EC=EI의 이유는 <b>엇각과 각의 이등분선</b>이에요. 내심을 지나기 때문에 성립해요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, per } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}:${c}`;
      const head = `그림에서 점 I는 삼각형 ABC의 내심이고, I를 지나고 ${S('BC')}에 평행한 직선이 ${S('AB')}, ${S('AC')}와 만나는 점을 각각 D, E라 하자.`;
      if (v === 0) return numProb({ tag: '내심을 지나는 평행선 · 둘레', key, stem: `${head} ${S('AB')}=${c} cm, ${S('AC')}=${bb} cm, ${S('BC')}=${a} cm일 때, △ADE의 둘레 $x$는?`, correct: per, wrongs: [[a + bb + c, '삼각형 ABC의 둘레예요. △ADE의 둘레는 AB+AC예요.'], [per - a, '다시 생각해 보세요.'], [per + a, '다시 생각해 보세요.'], [bb + a, '다시 생각해 보세요.'], [c + a, '다시 생각해 보세요.']].filter((q) => q[0] !== per), ...cmOpts });
      return numProb({ tag: '내심을 지나는 평행선 · 변의 길이', key, stem: `${head} 삼각형 ABC의 둘레가 ${a + bb + c} cm이고 ${S('BC')}=${a} cm일 때, △ADE의 둘레 $x$는?`, correct: per, wrongs: [[a + bb + c, '삼각형 ABC의 둘레예요. BC를 빼야 해요.'], [per - a, '다시 생각해 보세요.'], [per + a, '다시 생각해 보세요.'], [a + bb + c - 2 * a, '다시 계산해 보세요.'], [(a + bb + c) / 2, '다시 생각해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== per), ...cmOpts });
    },
    verify: (s) => { const M = n6.model(s), g = M.g; return { ans: dist(g.A, M.D) + dist(M.D, M.E) + dist(M.E, g.A), model: M.per / 1, extra: [[dist(M.D, g.B), dist(M.D, g.I)], [dist(M.E, g.C), dist(M.E, g.I)]] }; }
  };

  /* ====================================================================== 7. 각의 비 */
  const validTri = (a, b, c) => { const S0 = a + b + c; return [a, b, c].every((q) => (360 * q) % S0 === 0 && (360 * q) / S0 > 90 && (360 * q) / S0 < 180); };
  const VALID = []; for (let a = 1; a <= 8; a++) for (let b = 1; b <= 8; b++) for (let c = 1; c <= 8; c++) if (validTri(a, b, c)) VALID.push([a, b, c]);
  const n7 = {
    id: 't6-7', title: '∠AIB : ∠BIC : ∠CIA 의 비', short: '각의 비',
    question: '내심 I에서 만든 세 각 ∠AIB, ∠BIC, ∠CIA의 비를 알면 ∠A, ∠B, ∠C를 구할 수 있을까?',
    ctl: ['trNm', 'trNn', 'trNo'],
    init: (s) => { s.trNm = 3; s.trNn = 3; s.trNo = 4; s.trV = 0; },
    reroll: (s) => { const p = pick(VALID, null); s.trNm = p[0]; s.trNn = p[1]; s.trNo = p[2]; s.trV = (s.trV + 1) % 2; },
    model: (s) => {
      const a0 = clamp(Math.round(s.trNm), 1, 8), b0 = clamp(Math.round(s.trNn), 1, 8), c0 = clamp(Math.round(s.trNo), 1, 8);
      let best = VALID[0], bd = 1e9; VALID.forEach((t) => { const d = Math.abs(t[0] - a0) + Math.abs(t[1] - b0) + Math.abs(t[2] - c0); if (d < bd) { bd = d; best = t; } });
      const [a, b, c] = best, S0 = a + b + c, aib = (360 * a) / S0, bic = (360 * b) / S0, cia = (360 * c) / S0;
      const A = 2 * (bic - 90), B = 2 * (cia - 90), Cd = 2 * (aib - 90);
      return { a, b, c, adj: bd > 0, aib, bic, cia, A, B, C: Cd, g: fromAngles(A, B, Cd) };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, aib, bic, cia, A: Ad, B: Bd, C: Cd, g } = M, { A, B, C: Cc, I } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g); [A, B, Cc].forEach((z) => line(b, z, I, 'green', 3, { dash: [7, 5] }));
      if (C.problem) {
        ang(b, I, A, B, { color: 'sky', r: 24, label: String(a), size: 15, labelDist: 40 }); ang(b, I, B, Cc, { color: 'green', r: 24, label: String(bb), size: 15, labelDist: 40 }); ang(b, I, Cc, A, { color: 'violet', r: 24, label: String(c), size: 15, labelDist: 40 });
        if (v === 0) ang(b, A, B, Cc, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 54 }); else ang(b, B, A, Cc, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 54 });
      } else {
        ang(b, I, A, B, { color: 'sky', r: 24, label: dg(aib), size: 13, labelDist: 42 }); ang(b, I, B, Cc, { color: 'green', r: 24, label: dg(bic), size: 13, labelDist: 42 }); ang(b, I, Cc, A, { color: 'violet', r: 24, label: dg(cia), size: 13, labelDist: 42 });
        if (show(3)) { T(b, A, `${Ad}°`, { dy: 50, size: fs(b, 15), color: 'amber' }); T(b, B, `${Bd}°`, { dx: 50, dy: -12, size: fs(b, 15), color: 'amber' }); T(b, Cc, `${Cd}°`, { dx: -50, dy: -12, size: fs(b, 15), color: 'amber' }); }
      }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, I, 'I', { dy: 26, dx: 14, size: 17, color: 'amber' }); nameV(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠AIB:∠BIC:∠CIA = ${a}:${bb}:${c}, 합 360°`;
        else if (C.review && st === 2) { row = `∠BIC=${bic}° = 90°+\\frac{1}{2}∠A`; col = 'green'; }
        else if (C.review && st === 3) { row = `∠A=${Ad}°, ∠B=${Bd}°, ∠C=${Cd}°`; col = 'amber'; }
        else row = `∠AIB=${aib}°, ∠BIC=${bic}°, ∠CIA=${cia}° → ∠A=${Ad}°, ∠B=${Bd}°, ∠C=${Cd}°`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 14), color: col });
      }
    },
    steps: (M) => [
      `내심 I에서 만든 세 각의 합은 $360^{\\circ}$이고 비가 $${M.a}:${M.b}:${M.c}$이므로 $\\angle AIB=${M.aib}^{\\circ}$, $\\angle BIC=${M.bic}^{\\circ}$, $\\angle CIA=${M.cia}^{\\circ}$예요.`,
      `내심의 각의 성질 $\\angle BIC=90^{\\circ}+${fr('1', 2)}\\angle A$에서 $\\angle A=2(\\angle BIC-90^{\\circ})=2(${M.bic}^{\\circ}-90^{\\circ})=${M.A}^{\\circ}$예요.`,
      `같은 방법으로 $\\angle B=2(\\angle CIA-90^{\\circ})=${M.B}^{\\circ}$, $\\angle C=2(\\angle AIB-90^{\\circ})=${M.C}^{\\circ}$예요. (세 각의 합 ${M.A + M.B + M.C}°)`
    ],
    view: (M) => ({
      guide: '막대로 <b>비 a : b : c</b>를 바꿔 보세요(각이 정수가 되고 삼각형이 만들어지는 비로 가장 가까운 것을 골라 줘요). ∠BIC=90°+½∠A이므로 <b>∠A=2(∠BIC−90°)</b>예요.',
      readouts: [rd('비 a : b : c', `${M.a} : ${M.b} : ${M.c}`, 'sky', M.adj ? '가까운 올바른 비로 맞췄어요' : null), rd('∠AIB · ∠BIC · ∠CIA', `${M.aib}° · ${M.bic}° · ${M.cia}°`, 'green'), rd('∠A · ∠B · ∠C', `${M.A}° · ${M.B}° · ${M.C}°`, 'amber', null, null, true)],
      formula: `<p>$\\angle A=2(\\angle BIC-90^{\\circ})=2(${M.bic}^{\\circ}-90^{\\circ})=${M.A}^{\\circ}$</p>`,
      rule: '∠BIC=90°+½∠A, ∠CIA=90°+½∠B, ∠AIB=90°+½∠C 이므로 ∠A=2(∠BIC−90°)이다.',
      notes: notes('∠BIC가 가장 큰 쪽이 ∠A가 가장 큰 쪽이에요. 대응을 헷갈리지 마세요.', '비의 합은 360°예요(내심 둘레의 한 바퀴).')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, A, B, C: Cd } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}:${c}`;
      const head = `그림에서 점 I는 삼각형 ABC의 내심이고 ∠AIB : ∠BIC : ∠CIA = ${a} : ${bb} : ${c}이다.`;
      if (v === 0) return numProb({ tag: '내심의 각의 비 · ∠A', key, stem: `${head} ∠A의 크기 $x$는?`, correct: A, wrongs: [[M.bic, '∠BIC예요. ∠A=2(∠BIC−90°)예요.'], [M.bic - 90, '∠A의 반이에요.'], [B, '∠B예요.'], [Cd, '∠C예요.'], [A + 10, '다시 계산해 보세요.'], [A - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== A && q[0] > 0 && q[0] < 180), ...degOpts(5) });
      return numProb({ tag: '내심의 각의 비 · ∠B', key, stem: `${head} ∠B의 크기 $x$는?`, correct: B, wrongs: [[M.cia, '∠CIA예요. ∠B=2(∠CIA−90°)예요.'], [M.cia - 90, '∠B의 반이에요.'], [A, '∠A예요.'], [Cd, '∠C예요.'], [B + 10, '다시 계산해 보세요.'], [B - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== B && q[0] > 0 && q[0] < 180), ...degOpts(5) });
    },
    verify: (s) => { const M = n7.model(s), g = M.g; return { ans: angBetween(g.I, g.B, g.C), model: M.bic, extra: [[angBetween(g.I, g.A, g.B), M.aib], [angBetween(g.I, g.C, g.A), M.cia], [M.A + M.B + M.C, 180]] }; }
  };

  /* ====================================================================== 8. 변의 길이로 접선의 길이 구하기 */
  const n8 = {
    id: 't6-8', title: '세 변의 길이로 접선의 길이 구하기', short: '변의 길이로 접선',
    question: '세 변의 길이 AB, BC, CA를 알면 꼭짓점에서 접점까지의 거리 AF, BD, CE를 구할 수 있을까?',
    ctl: ['trNp', 'trNq', 'trNs'],
    init: (s) => { s.trNp = 9; s.trNq = 7; s.trNs = 8; s.trV = 0; },
    reroll: (s) => { s.trNp = rint(5, 12); s.trNq = rint(5, 12); s.trNs = rint(3, 20); s.trV = (s.trV + 1) % 3; },
    model: (s) => {
      const c = clamp(Math.round(s.trNp), 4, 12), bb = clamp(Math.round(s.trNq), 4, 12);
      let a = clamp(Math.round(s.trNs), 3, 20);
      const lo = Math.abs(c - bb) + 1, hi = c + bb - 1;
      a = clamp(a, lo, hi);
      if ((c + bb - a) % 2) a = a + 1 <= hi ? a + 1 : a - 1;
      const x = (c + bb - a) / 2, y = (c + a - bb) / 2, z = (a + bb - c) / 2;
      return { a, b: bb, c, x, y, z, adj: a !== clamp(Math.round(s.trNs), 3, 20), g: tanGeom(x, y, z) };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, x, y, z, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g);
      line(b, A, F, 'amber', 5); line(b, A, E, 'amber', 5); line(b, B, F, 'sky', 5); line(b, B, D, 'sky', 5); line(b, Cc, D, 'green', 5); line(b, Cc, E, 'green', 5);
      tick(b, A, F, 1, 'amber'); tick(b, A, E, 1, 'amber'); tick(b, B, F, 2, 'sky'); tick(b, B, D, 2, 'sky'); tick(b, Cc, D, 3, 'green'); tick(b, Cc, E, 3, 'green');
      const q = fs(b, 15);
      G.sideTag(b, A, B, I, `${c} cm`, { color: 'ink', size: q, gap: 26 }); G.sideTag(b, B, Cc, I, `${a} cm`, { color: 'ink', size: q, gap: 26 }); G.sideTag(b, Cc, A, I, `${bb} cm`, { color: 'ink', size: q, gap: 26 });
      if (C.problem) { if (v === 0) G.sideTag(b, A, F, I, 'x', { color: 'amber', size: fs(b, 18), gap: 12 }); else if (v === 1) G.sideTag(b, B, D, I, 'x', { color: 'sky', size: fs(b, 18), gap: 12 }); else G.sideTag(b, Cc, E, I, 'x', { color: 'green', size: fs(b, 18), gap: 12 }); }
      else { if (show(3)) { G.sideTag(b, A, F, I, `${x}`, { color: 'amber', size: q, gap: 12 }); G.sideTag(b, B, D, I, `${y}`, { color: 'sky', size: q, gap: 12 }); G.sideTag(b, Cc, E, I, `${z}`, { color: 'green', size: q, gap: 12 }); } }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((zp) => b.point(zp, { color: 'ink', r: 4.5 })); [D, E, F].forEach((zp) => b.point(zp, { color: 'rose', r: 3.8 }));
      T(b, I, 'I', { dy: -2, dx: 14, size: 17, color: 'amber' }); nameV(b, g, I); feetNames(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'AF=AE=x, BF=BD=y, CD=CE=z';
        else if (C.review && st === 2) { row = `x+y=${c}, y+z=${a}, z+x=${bb}`; col = 'ink'; }
        else if (C.review && st === 3) { row = `x=${x}, y=${y}, z=${z} (cm)`; col = 'amber'; }
        else row = `AB=${c}, BC=${a}, CA=${bb} → AF=${x}, BD=${y}, CE=${z} (cm)`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 66, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `접선의 길이는 같으므로 $\\overline{AF}=\\overline{AE}=x$, $\\overline{BF}=\\overline{BD}=y$, $\\overline{CD}=\\overline{CE}=z$라 해요.`,
      `세 변은 $\\overline{AB}=x+y=${M.c}$, $\\overline{BC}=y+z=${M.a}$, $\\overline{CA}=z+x=${M.b}$예요.`,
      `세 식을 모두 더하면 $2(x+y+z)=${M.a + M.b + M.c}$이므로 $x+y+z=${(M.a + M.b + M.c) / 2}$. 따라서 $x=${(M.a + M.b + M.c) / 2}-${M.a}=${M.x}$, $y=${(M.a + M.b + M.c) / 2}-${M.b}=${M.y}$, $z=${(M.a + M.b + M.c) / 2}-${M.c}=${M.z}$ (cm)예요.`
    ],
    view: (M) => ({
      guide: `막대로 <b>AB, AC, BC</b>를 바꿔 보세요(접선의 길이가 정수가 되도록 BC를 맞춰 줘요${M.adj ? ' — 지금 맞췄어요' : ''}). 세 변의 길이를 알면 <b>AF=(AB+AC−BC)÷2</b>처럼 구해요.`,
      readouts: [rd('AB · BC · CA', `${M.c} · ${M.a} · ${M.b} cm`, 'sky'), rd('AF · BD · CE', `${M.x} · ${M.y} · ${M.z} cm`, 'amber', '접선의 길이', null, true)],
      formula: `<p>$\\overline{AF}=${fr('\\overline{AB}+\\overline{CA}-\\overline{BC}', 2)}=${fr(`${M.c}+${M.b}-${M.a}`, 2)}=${M.x}$</p><p>$\\overline{BD}=${M.y}$, $\\overline{CE}=${M.z}$ (cm)</p>`,
      rule: '접선의 길이 = (두 변의 합 − 나머지 한 변) ÷ 2. 예: AF = (AB + CA − BC) ÷ 2',
      notes: notes('AF는 꼭짓점 <b>A</b>를 낀 두 변 AB, CA의 합에서 <b>BC</b>를 빼요.', '나눈 값이 정수가 되는지 확인해요. 정수가 아니면 계산이 틀린 거예요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, x, y, z } = M, v = (s.trV || 0) % 3, key = `${v}:${a}:${bb}:${c}`;
      const head = `그림에서 원 I는 삼각형 ABC의 내접원이고 세 점 D, E, F는 접점이다. ${S('AB')}=${c} cm, ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm이다.`;
      const f = (name, ans, bad) => numProb({ tag: `접선의 길이 · ${name}`, key, stem: `${head} ${S(name)}의 길이 $x$는?`, correct: ans, wrongs: bad.concat([[ans + 1, '다시 계산해 보세요.'], [Math.max(1, ans - 1), '다시 계산해 보세요.']]).filter((q) => q[0] !== ans && q[0] > 0), ...cmOpts });
      if (v === 0) return f('AF', x, [[y, 'BF의 길이예요.'], [z, 'CE의 길이예요.'], [c - x, 'BF의 길이예요. AF=(AB+CA−BC)÷2예요.'], [(c + bb) / 2, 'BC를 빼야 해요.']].filter((q) => Number.isInteger(q[0])));
      if (v === 1) return f('BD', y, [[x, 'AF의 길이예요.'], [z, 'CE의 길이예요.'], [a - y, 'CD의 길이예요.'], [(c + a) / 2, 'CA를 빼야 해요.']].filter((q) => Number.isInteger(q[0])));
      return f('CE', z, [[x, 'AF의 길이예요.'], [y, 'BD의 길이예요.'], [bb - z, 'AE의 길이예요.'], [(a + bb) / 2, 'AB를 빼야 해요.']].filter((q) => Number.isInteger(q[0])));
    },
    verify: (s) => { const M = n8.model(s), g = M.g; return { ans: dist(g.A, g.F), model: M.x, extra: [[dist(g.B, g.D), M.y], [dist(g.C, g.E), M.z], [dist(g.B, g.C), M.a], [dist(g.A, g.B), M.c], [dist(g.C, g.A), M.b]] }; }
  };

  G.register(60, 't6', '⑥ 내심', '내심', PARAMS, [n1, n2, n3, n4, n5, n6, n7, n8]);
})();
