/* ==========================================================================
   중3 · 삼각비 — 탭 ④ 「변의 길이」 (t4.js, order 40) — 장면 8개
   · findFromHyp 빗변과 각   · findFromBase 한 변과 각   · sasAcuteLen 두 변과 끼인각(예각)   · sasObtuseLen [심화] 끼인각이 둔각
   · asaSplit75 [심화] 한 변과 양 끝각(45°·60°)   · r4-2 [심화] 15°·75°의 탄젠트   · r4-3 종이테이프   · trapDontSplit60 [함정] 어느 각에서 수선을?
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const { clamp, pt, mid, T, tagOut, ang, sideTag, tick, line, poly, fillPoly, fit, rtGeo, drawRT, rtBox, P, rd, notes, dashed, rint, pick, sample, bboxOf, DEG, centroid,
    vi, vsq, vf, vadd, vsub, vmul, vdiv, vsqrt, vpow2, vsame, vtex, vcan, sinD, cosD, tanD, mkChoices, degChoices, checkQ, fmtN, decS, nmRand, triName, FN } = G;

  const PARAMS = {
    t41c: P('빗변 c', 2, 20, 1, 10, { color: 'green' }),
    t41a: P('각 A', 10, 80, 5, 35, { color: 'amber', format: G.degF }),
    t41b: P('밑변 b', 2, 20, 1, 8, { color: 'sky' }),
    t43c: P('AB의 길이 c', 2, 12, 1, 6, { color: 'sky' }),
    t43a: P('BC의 길이 a', 2, 16, 1, 10, { color: 'green' }),
    t43b: P('끼인각 B', 20, 80, 5, 60, { color: 'amber', format: G.degF }),
    t44b: P('끼인각 B', 100, 170, 5, 120, { color: 'amber', format: G.degF }),
    t45k: P('AC의 길이', 2, 12, 1, 6, { color: 'sky' }),
    t46k: P('AC의 길이 k', 1, 6, 1, 2, { color: 'sky' }),
    t47w: P('테이프의 폭 w', 1, 8, 1, 4, { color: 'sky' }),
    t47t: P('겹친 각 θ', 25, 90, 5, 60, { color: 'amber', format: G.degF, hint: '두 번째 테이프를 제자리에서 돌려 봐요' })
  };
  const col = { a: 'rose', b: 'sky', c: 'green' };
  const dv = (v) => vcan(v);

  /* ====================================================================== 1·2. 빗변·한 변과 각 */
  function rtLenDraw(b, M, C, o) {
    const g = rtGeo(M.sn, M.cs), st = C.step;
    fit(b, rtBox(g), { t: 46, b: 56, l: 64, r: 64 });
    const show = (n) => st >= n || st === 99;
    drawRT(b, g, { names: { A: 'A', B: 'B', C: 'C' }, fill: 'sky', fa: 0.08, col: show(2) ? col : null, side: { a: { t: show(o.aStep) ? `a = ${dv(M.a)}` : o.aGiven ? dv(M.a) : 'a', c: col.a }, b: { t: show(o.bStep) ? `b = ${dv(M.b)}` : o.bGiven ? dv(M.b) : 'b', c: col.b }, c: { t: o.cGiven ? dv(M.c) : show(o.cStep || 2) ? `c = ${dv(M.c)}` : 'c', c: col.c } }, angA: { t: `${M.A}°`, c: 'amber' } });
    const yb = Math.max(g.A.y, g.C.y);
    T(b, pt((g.A.x + g.C.x) / 2, yb), o.formula(M, st), { dy: 54, size: 16, color: 'amber' });
  }
  const approx = (v) => (v.x ? '=' : '≈');
  const mkRT = (c, A) => { const sn = sinD(A), cs = cosD(A); return { A, sn: sn.v, cs: cs.v, sV: sn, cV: cs, tV: tanD(A) }; };
  const fHyp = {
    id: 'findFromHyp', title: '빗변과 한 각으로 변의 길이 구하기', short: '빗변과 각',
    question: '빗변 c와 한 예각 A를 알면 높이 a와 밑변 b를 어떻게 구할까? 각을 바꿔 가며 확인해 보자.',
    ctl: ['t41c', 't41a'],
    init: (s) => { s.t41c = 10; s.t41a = 35; },
    model: (s) => { const c = vi(Math.round(s.t41c)), A = Math.round(s.t41a), o = mkRT(c, A); return { ...o, c, a: vmul(c, o.sV), b: vmul(c, o.cV) }; },
    draw: (b, s, M, C) => rtLenDraw(b, M, C, { aStep: 2, bStep: 3, cGiven: true, formula: (m, st) => (st >= 3 || st === 99 ? `a = c sin A,  b = c cos A` : 'a = c sin A') }),
    steps: (M) => [
      `빗변 $c=${M.c.v}$ 과 $\\angle A=${M.A}^{\\circ}$ 를 알아요. 구하는 변은 대변 $a$ 와 이웃변 $b$ 예요.`,
      `$\\sin A=\\frac{a}{c}$ 에서 $a=c\\sin A=${M.c.v}\\sin ${M.A}^{\\circ}=${vtex(M.a)}$ ${approx(M.a) === '≈' ? '(근삿값)' : ''}`,
      `$\\cos A=\\frac{b}{c}$ 에서 $b=c\\cos A=${M.c.v}\\cos ${M.A}^{\\circ}=${vtex(M.b)}$ ${approx(M.b) === '≈' ? '(근삿값)' : ''}`
    ],
    view: (M) => ({
      guide: '<b>빗변 c</b>와 <b>각 A</b>를 바꿔 보세요. 대변과 이웃변이 $a=c\\sin A$, $b=c\\cos A$ 로 바로 구해져요. 30°·45°·60°이면 정확한 값, 아니면 근삿값이에요.',
      readouts: [rd('$a=c\\sin A$', `$${vtex(M.a)}$`, 'rose'), rd('$b=c\\cos A$', `$${vtex(M.b)}$`, 'sky')],
      rule: '빗변과 한 각을 알 때: 대변 = $c\\sin A$, 이웃변 = $c\\cos A$',
      notes: notes('빗변이 주어지면 sin, cos 를 곱해요. $\\tan$ 은 쓰지 않아요.', '대변에는 sin, 이웃변에는 cos 예요. 바꿔 곱하지 않도록 해요.')
    }),
    gen: () => G.specialProblem([30, 45, 60], 't4h', { given: ['c'], ask: ['a', 'b'] }),
    pdraw: (b, q, C) => G.pdrawRT(b, q.fig, C)
  };
  const fBase = {
    id: 'findFromBase', title: '밑변과 한 각으로 변의 길이 구하기', short: '밑변과 각',
    question: '이웃변 b와 한 예각 A를 알면 높이 a와 빗변 c를 어떻게 구할까?',
    ctl: ['t41b', 't41a'],
    init: (s) => { s.t41b = 8; s.t41a = 35; },
    model: (s) => { const b0 = vi(Math.round(s.t41b)), A = Math.round(s.t41a), o = mkRT(b0, A); return { ...o, b: b0, a: vmul(b0, o.tV), c: vdiv(b0, o.cV) }; },
    draw: (b, s, M, C) => rtLenDraw(b, M, C, { aStep: 2, bGiven: true, cStep: 3, formula: (m, st) => (st >= 3 || st === 99 ? 'a = b tan A,  c = \\frac{b}{cos A}' : 'a = b tan A') }),
    steps: (M) => [
      `이웃변 $b=${M.b.v}$ 와 $\\angle A=${M.A}^{\\circ}$ 를 알아요. 구하는 변은 대변 $a$ 와 빗변 $c$ 예요.`,
      `$\\tan A=\\frac{a}{b}$ 에서 $a=b\\tan A=${M.b.v}\\tan ${M.A}^{\\circ}=${vtex(M.a)}$ ${M.a.x ? '' : '(근삿값)'}`,
      `$\\cos A=\\frac{b}{c}$ 에서 $c=\\frac{b}{\\cos A}=${vtex(M.c)}$ ${M.c.x ? '' : '(근삿값)'}`
    ],
    view: (M) => ({
      guide: '<b>밑변 b</b>와 <b>각 A</b>를 바꿔 보세요. 대변은 $b\\tan A$, 빗변은 $\\frac{b}{\\cos A}$ 로 구해져요.',
      readouts: [rd('$a=b\\tan A$', `$${vtex(M.a)}$`, 'rose'), rd('$c=\\frac{b}{\\cos A}$', `$${vtex(M.c)}$`, 'green')],
      rule: '이웃변과 한 각을 알 때: 대변 = $b\\tan A$, 빗변 = $\\frac{b}{\\cos A}$',
      notes: notes('빗변을 구할 때는 곱하지 않고 $\\cos A$ 로 <b>나눠요</b>.', '구하는 변과 아는 변이 각 A에 대해 어떤 위치인지로 sin, cos, tan 을 골라요.')
    }),
    gen: () => G.specialProblem([30, 45, 60], 't4b', { given: ['a', 'b'], ask: ['a', 'b', 'c'] }),
    pdraw: (b, q, C) => G.pdrawRT(b, q.fig, C)
  };

  /* ====================================================================== 3·4. 두 변과 끼인각 (수선) */
  // B 원점, C=(a,0), A=(c cos β, −c sin β), H 는 A 의 수선의 발
  function sasGeom(a, c, beta) { const A = pt(c * Math.cos(beta * DEG), -c * Math.sin(beta * DEG)); return { B: pt(0, 0), C: pt(a, 0), A, H: pt(A.x, 0) }; }
  function drawSas(b, g, L, o = {}) {
    const { A, B, C, H } = g, st = o.step == null ? 99 : o.step, cen = centroid([A, B, C]), obt = H.x < 0;
    fit(b, bboxOf([A, B, C, H]), { t: 50, b: 64, l: 54, r: 54 });
    fillPoly(b, [A, B, C], 'sky', 0.08);
    if (st >= 1) { fillPoly(b, [A, B, H], 'rose', 0.14); fillPoly(b, [A, H, C], 'green', 0.12); }
    poly(b, [A, B, C], 'ink', 3.4);
    if (st >= 1) { line(b, A, H, 'violet', 3.2, { dash: dashed }); if (obt) line(b, H, B, 'violet', 2.6, { dash: dashed }); else if (H.x > C.x) line(b, C, H, 'violet', 2.6, { dash: dashed }); ang(b, H, A, C, { color: 'violet', r: 18 }); }
    if (L.angB !== false) ang(b, B, C, A, { color: 'amber', r: 34, label: L.angB, size: 16 });
    if (obt && st >= 2) ang(b, B, H, A, { color: 'rose', r: 30, label: L.angOut, size: 16, rings: 2 });
    [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    if (st >= 1) { b.point(H, { color: 'violet', r: 4 }); T(b, H, 'H', { dy: 20, size: 17, color: 'violet' }); }
    if (L.c) sideTag(b, A, B, cen, L.c.t, { color: L.c.c || 'sky', size: L.c.size || 17 });
    if (L.a) sideTag(b, B, C, cen, L.a.t, { color: L.a.c || 'green', size: L.a.size || 17, flip: false, gap: 24 });
    if (L.AC) sideTag(b, A, C, cen, L.AC.t, { color: L.AC.c || 'amber', size: L.AC.size || 17, f: obt ? 0.88 : 0.5 });
    if (L.AH && st >= 1) T(b, mid(A, H), L.AH, { dx: obt ? 22 : -4, size: 15, color: 'violet', align: obt ? 'left' : 'right' });
    if (L.BH && st >= 1) T(b, mid(B, H), L.BH, { dy: 38, size: 15, color: 'rose' });
    if (L.HC && st >= 1) T(b, mid(H, C), L.HC, { dy: 38, size: 15, color: 'green' });
    (L.rows || []).forEach((r, i) => T(b, pt((Math.min(B.x, A.x) + C.x) / 2, 0), r.t, { dy: 64 + i * 26, size: 16, color: r.c }));
  }
  function sasModel(a, c, beta) {
    const obt = beta > 90, w = obt ? 180 - beta : beta, A = vi(a), Cc = vi(c);
    const ah = vmul(Cc, sinD(w)), bh = vmul(Cc, cosD(w)), past = !obt && bh.v > a, hc = obt ? vadd(A, bh) : past ? vsub(bh, A) : vsub(A, bh);
    const ac = vsqrt(vadd(vpow2(ah), vpow2(hc)));
    return { a, c, beta, obt, past, w, ah, bh, hc, ac };
  }
  const sasScene = (id, title, short, obtuse) => ({
    id, title, short, question: obtuse ? '끼인각이 둔각이면 수선은 어디에 내려야 할까? 변의 연장선에 수선을 내려 AC를 구해 보자.' : '두 변 AB, BC와 그 끼인각 B를 알 때 AC의 길이는? 꼭짓점 A에서 BC에 수선을 내려 직각삼각형으로 나누어 보자.',
    ctl: obtuse ? ['t43c', 't43a', 't44b'] : ['t43c', 't43a', 't43b'],
    init: (s) => { s.t43c = obtuse ? 6 : 6; s.t43a = obtuse ? 4 : 10; s.t43b = 60; s.t44b = 120; },
    model: (s) => sasModel(Math.round(s.t43a), Math.round(s.t43c), Math.round(obtuse ? s.t44b : s.t43b)),
    draw(b, s, M, C) {
      const g = sasGeom(M.a, M.c, M.beta), st = C.step, show = (n) => st >= n || st === 99;
      const rows = show(3) ? [{ t: `AC = √(${M.obt ? '(a + BH)' : '(a − BH)'}² + AH²) ${M.ac.x ? '=' : '≈'} ${vcan(M.ac)}`, c: 'amber' }] : [];
      drawSas(b, g, {
        angB: `${M.beta}°`, angOut: `${M.w}°`, c: { t: `${M.c}`, c: 'sky' }, a: { t: `${M.a}`, c: 'green' }, AC: show(3) ? { t: vcan(M.ac), c: 'amber' } : null,
        AH: show(2) ? `AH = ${vcan(M.ah)}` : null, BH: show(2) ? `BH = ${vcan(M.bh)}` : null, HC: show(2) ? `HC = ${vcan(M.hc)}` : null, rows
      }, { step: st });
    },
    steps: (M) => [
      M.obt ? `$\\angle B=${M.beta}^{\\circ}$ 가 둔각이므로 변 $CB$ 의 <b>연장선</b>에 꼭짓점 $A$ 에서 수선 $AH$ 를 내려요. $\\angle ABH=180^{\\circ}-${M.beta}^{\\circ}=${M.w}^{\\circ}$` : `꼭짓점 $A$에서 직선 $BC$에 수선 $AH$를 내려요.${M.past ? ' 수선의 발 $H$는 $C$ 너머 연장선에 있습니다.' : ' 직각삼각형 $ABH$, $AHC$로 나뉩니다.'} $\\angle B=${M.beta}^{\\circ}$ 는 그대로 남아요.`,
      `$\\triangle ABH$ 에서 $AH=${M.c}\\sin ${M.w}^{\\circ}=${vtex(M.ah)}$, $BH=${M.c}\\cos ${M.w}^{\\circ}=${vtex(M.bh)}$ ${M.ah.x ? '' : '(근삿값)'}`,
      `$HC=${M.obt ? `BC+BH=${M.a}+${vtex(M.bh)}` : M.past ? `BH-BC=${vtex(M.bh)}-${M.a}` : `BC-BH=${M.a}-${vtex(M.bh)}`}=${vtex(M.hc)}$ 를 구하고, $\\triangle AHC$ 에서 피타고라스 정리로 $AC=\\sqrt{AH^2+HC^2}=${vtex(M.ac)}$`
    ],
    view: (M) => ({
      guide: `<b>두 변</b>과 <b>끼인각 B</b>를 바꿔 보세요. 보라색 점선 AH가 수선이에요.${obtuse ? ' 끼인각이 둔각이라 수선의 발 H는 변 BC 밖에 생겨요.' : ''}`,
      readouts: [rd('$AH$', `$${vtex(M.ah)}$`, 'violet'), rd('$HC$', `$${vtex(M.hc)}$`, 'green'), rd('$AC$', `$${vtex(M.ac)}$`, 'amber')],
      rule: obtuse ? '끼인각이 둔각이면 연장선에 수선 → 외각 $180^{\\circ}-B$ 로 직각삼각형 → $AC^2=(BC+BH)^2+AH^2$' : '두 변과 끼인각 → 수선으로 직각삼각형 둘 → $AC^2=(BC-BH)^2+AH^2$',
      notes: obtuse ? notes('수선은 변 위가 아니라 <b>연장선</b>에 내려요. 그래서 $HC=BC+BH$ 예요.', `$\\sin(180^{\\circ}-B)=\\sin B$ 이므로 $AH=c\\sin B$ 로 써도 같아요.`) : notes(M.past ? '수선의 발 H가 C 너머에 있으므로 $HC=BH-BC$입니다. 길이는 양수예요.' : '수선의 발 H는 BC의 중점이 아니에요. $HC=BC-BH$를 확인해요.', '끼인각 B를 나누지 않는 꼭짓점 A에서 수선을 내려요.')
    }),
    gen: function g() {
      const betas = obtuse ? [120, 135, 150] : [30, 45, 60], beta = pick(betas), w = obtuse ? 180 - beta : beta;
      const m = rint(1, 4), cV = w === 60 ? vi(2 * m) : w === 45 ? vmul(vi(m), vsq(2)) : vmul(vi(2 * m), vsq(3));
      const bhv = vmul(cV, cosD(w)), ahv = vmul(cV, sinD(w)), bhn = bhv.v;
      let a = obtuse ? rint(3, 8) : Math.ceil(bhn + 1) + rint(0, 4);
      const A = vi(a), hc = obtuse ? vadd(A, bhv) : vsub(A, bhv), ac = vsqrt(vadd(vpow2(ahv), vpow2(hc)));
      if (vsame(ac, A) || vsame(ac, cV)) return g();
      const wr = [[vsqrt(vadd(vpow2(vi(a)), vpow2(cV))), '두 변을 그냥 피타고라스 정리에 넣었어요. 직각삼각형이 아니에요.'], [vsqrt(vadd(vpow2(ahv), vpow2(obtuse ? vsub(A, bhv) : vadd(A, bhv)))), obtuse ? '$HC$ 를 $BC-BH$ 로 구했어요. 연장선이라 더해야 해요.' : '$HC$ 를 $BC+BH$ 로 구했어요. 빼야 해요.'], [vsqrt(vadd(vpow2(bhv), vpow2(hc))), '$AH$ 대신 $BH$ 를 썼어요.'], [vsqrt(vadd(vpow2(ahv), vpow2(A))), '$HC$ 대신 $BC$ 를 썼어요.'], [vsub(vadd(vi(a), cV), vi(0)), '두 변의 합이에요.']];
      const q = {
        tag: obtuse ? '[심화] 끼인각이 둔각인 삼각형' : '두 변과 끼인각', key: [id, beta, vtex(cV), a].join('|'),
        stem: `△ABC에서 $\\overline{AB}=${vtex(cV)}$, $\\overline{BC}=${a}$, $\\angle B=${beta}^{\\circ}$ 일 때, $\\overline{AC}$ 의 길이는?`,
        choices: mkChoices(ac, wr), fig: { a, c: cV.v, cl: vcan(cV), beta }, given: [`${beta}°`, vcan(cV), `${a}`], ans: [vcan(ac)]
      };
      q.fig.work = { ah: vcan(ahv), bh: vcan(bhv), hc: vcan(hc), ac: vcan(ac), w };
      return checkQ(q, [
        `주어진 조건은 $AB=${vtex(cV)}$, $BC=${a}$, $\\angle B=${beta}^{\\circ}$입니다. $A$에서 ${obtuse ? '$CB$의 연장선' : '$BC$'}에 수선 $AH$를 내려요.`,
        `$\\angle ABH=${w}^{\\circ}$이므로 $AH=${vtex(cV)}\\sin ${w}^{\\circ}=${vtex(ahv)}$, $BH=${vtex(cV)}\\cos ${w}^{\\circ}=${vtex(bhv)}$입니다.`,
        `수선의 발의 위치를 확인하면 $HC=${obtuse ? 'BC+BH' : 'BC-BH'}=${a}${obtuse ? '+' : '-'}${vtex(bhv)}=${vtex(hc)}$입니다.`,
        `직각삼각형 $AHC$에서 $AC^2=AH^2+HC^2=${vtex(vpow2(ahv))}+${vtex(vpow2(hc))}$입니다. 양의 제곱근을 구해요.`
      ], { kind: 'sas', a, c: cV.v, angle: beta, answer: ac.v });
    },
    pdraw: (b, q, C) => { const f = q.fig, g = sasGeom(f.a, f.c, f.beta); drawSas(b, g, { angB: `${f.beta}°`, c: { t: f.cl, c: 'sky' }, a: { t: `${f.a}`, c: 'green' }, AC: { t: C.last ? f.work.ac : 'x', c: 'amber', size: 21 }, angOut: `${f.work.w}°`, AH: C.review && C.step >= 2 ? f.work.ah : null, BH: C.review && C.step >= 2 ? f.work.bh : null, HC: C.review && C.step >= 3 ? f.work.hc : null }, { step: C.review ? C.step : 0 }); }
  });
  const sasA = sasScene('sasAcuteLen', '두 변과 끼인각으로 길이 구하기', '두 변과 끼인각', false);
  const sasO = sasScene('sasObtuseLen', '[심화] 끼인각이 둔각일 때', '[심화] 끼인각이 둔각', true);

  /* ====================================================================== 5·8. 한 변과 양 끝각 (45°·60°) */
  const PAIRS = [[45, 60], [60, 45], [45, 30], [30, 45]];
  function drawSplit(b, M, o = {}) {
    // 삼각형 ABC (밑변 BC, 높이 AH). 올바른 수선(A에서) 또는 잘못된 수선(C 에서 AB 로)
    const hn = M.hn, A = pt(0, -hn), B = pt(-M.bh.v, 0), Cc = pt(M.ch.v, 0), Hp = pt(0, 0), st = o.step == null ? 99 : o.step, cen = centroid([A, B, Cc]);
    fit(b, bboxOf([A, B, Cc]), { t: 52, b: 62, l: 60, r: 60 });
    const wrong = o.wrong;
    fillPoly(b, [A, B, Cc], 'sky', 0.08);
    if (!wrong && st >= 1) { fillPoly(b, [A, B, Hp], 'rose', 0.14); fillPoly(b, [A, Hp, Cc], 'green', 0.12); }
    poly(b, [A, B, Cc], 'ink', 3.4);
    ang(b, B, Cc, A, { color: 'amber', r: 34, label: `${M.pair[0]}°`, size: 16 }); ang(b, Cc, A, B, { color: 'rose', r: 34, label: `${M.pair[1]}°`, size: 16, rings: 2 });
    if (!wrong && st >= 1) {
      line(b, A, Hp, 'violet', 3.2, { dash: dashed }); ang(b, Hp, B, A, { color: 'violet', r: 18 });
      if (st >= 2 || st === 99) { ang(b, A, B, Hp, { color: 'amber', r: 34, label: o.xl === 'B' ? 'x' : o.xl ? '' : `${90 - M.pair[0]}°`, size: o.xl === 'B' ? 20 : 15, labelDist: 52 }); ang(b, A, Hp, Cc, { color: 'rose', r: 34, label: o.xl === 'C' ? 'x' : o.xl ? '' : `${90 - M.pair[1]}°`, size: o.xl === 'C' ? 20 : 15, rings: 2, labelDist: 52 }); }
      b.point(Hp, { color: 'violet', r: 4 }); T(b, Hp, 'H', { dy: 20, size: 17, color: 'violet' });
    }
    if (wrong) {
      const Hq = G.projOn(Cc, A, B); line(b, Cc, Hq, 'red', 3, { dash: dashed }); ang(b, Hq, Cc, A, { color: 'red', r: 16 });
      ang(b, Cc, Hq, B, { color: 'red', r: 30, label: `${M.pair[0]}°`, size: 15, rings: 1, noMark: true });
      ang(b, Cc, A, Hq, { color: 'red', r: 44, label: '?', size: 18, labelDist: 62, noMark: false });
      b.point(Hq, { color: 'red', r: 4 }); T(b, Hq, 'H′', { dx: -22, dy: -4, size: 16, color: 'red' });
    }
    [[A, 'A'], [B, 'B'], [Cc, 'C']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    if (o.labels) {
      if (o.labels.AB) sideTag(b, A, B, cen, o.labels.AB.t, { color: o.labels.AB.c || 'sky', size: o.labels.AB.size || 17 });
      if (o.labels.AC) sideTag(b, A, Cc, cen, o.labels.AC.t, { color: o.labels.AC.c || 'sky', size: o.labels.AC.size || 17 });
      if (o.labels.BC) sideTag(b, B, Cc, cen, o.labels.BC.t, { color: o.labels.BC.c || 'green', size: o.labels.BC.size || 17, flip: false, gap: 24 });
      if (o.labels.AH && !wrong) T(b, mid(A, Hp), o.labels.AH, { dx: -4, size: 15, color: 'violet', align: 'right' });
    }
    if (o.note) T(b, pt(0, 0), o.note, { dy: 56, size: 16, color: o.noteColor || 'amber' });
  }
  const asa = {
    id: 'asaSplit75', title: '[심화] 한 변과 양 끝각 — 75°를 45°+30°로', short: '[심화] 75° 나누기',
    question: '세 각이 45°, 60°, 75°인 삼각형에서 한 변을 알 때, 어느 꼭짓점에서 수선을 내리면 풀릴까?',
    ctl: ['t45k'],
    init: (s) => { s.t45k = 6; },
    model: (s) => { const k = Math.round(s.t45k); const hv = vmul(vi(k), sinD(60)); const M = G.chainModel(hv, [45, 60], true); M.k = k; return M; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawSplit(b, M, { step: st, labels: { AC: { t: `${M.k}`, c: 'sky' }, AB: show(3) ? { t: vcan(M.ab), c: 'rose' } : null, AH: show(2) ? vcan(M.h) : null }, note: show(1) ? '75° = 45° + 30°' : '' }); },
    steps: (M) => [
      '세 내각은 $45^{\\circ}$, $60^{\\circ}$, $75^{\\circ}$ 예요. $45^{\\circ}$ 와 $60^{\\circ}$ 는 나누지 않고, <b>75° 인 꼭짓점 A</b> 에서 $BC$ 에 수선 $AH$ 를 내려요. 그러면 $75^{\\circ}=45^{\\circ}+30^{\\circ}$ 로 나뉘어요.',
      `$\\triangle AHC$ (30°·60°) 에서 $AH=${M.k}\\sin60^{\\circ}=${vtex(M.h)}$, $CH=${M.k}\\cos60^{\\circ}=${vtex(M.ch)}$`,
      `$\\triangle ABH$ (45°) 에서 $BH=AH=${vtex(M.bh)}$, $AB=\\sqrt{2}\\,AH=${vtex(M.ab)}$, $BC=BH+CH=${vtex(M.bc)}$`
    ],
    view: (M) => ({
      guide: '<b>AC</b>의 길이를 바꿔 보세요. 75°인 꼭짓점 A에서 내린 수선 AH가 75°를 45°와 30°로 나눠서 두 직각삼각형이 모두 특수각이 돼요.',
      readouts: [rd('$AH$', `$${vtex(M.h)}$`, 'violet'), rd('$AB$', `$${vtex(M.ab)}$`, 'rose'), rd('$BC$', `$${vtex(M.bc)}$`, 'green')],
      rule: '$75^{\\circ}=45^{\\circ}+30^{\\circ}$ ($105^{\\circ}=45^{\\circ}+60^{\\circ}$) → 그 각의 꼭짓점에서 수선',
      notes: notes('45°, 60°인 꼭짓점에서 수선을 내리면 특수각이 아닌 각이 생겨 풀기 어려워요.')
    }),
    gen: () => chainLike(),
    pdraw: (b, q, C) => { const f = q.fig, M = f.exact, labels = pLabels(f, M); if (C.review && C.step >= 3) labels.AH = vcan(M.h); if (C.last) labels[f.askK.toUpperCase()].t = vcan(M[f.askK]); drawSplit(b, M, { step: C.review ? C.step : 0, labels }); }
  };
  // 문제: 45°·60° 삼각형에서 주어진 변으로 다른 변 구하기
  function pLabels(f, M) { const l = {}; const key = { ab: 'AB', ac: 'AC', bc: 'BC' }; l[key[f.givenK]] = { t: f.g, c: 'sky' }; l[key[f.askK]] = { t: 'x', c: 'amber', size: 21 }; return l; }
  function chainLike() {
    const h0 = pick([2, 3, 4, 6]), hv = pick([vi(h0), vmul(vi(h0), vsq(3))]);
    const M = G.chainModel(hv, [45, 60], true), givenK = pick(['ac', 'bc']), askK = pick(['ab', 'ac', 'bc'].filter((x) => x !== givenK)), gv = M[givenK], ans = M[askK];
    const wr = [[M.bh, '한 쪽 직각삼각형의 변만 구했어요.'], [M.ch, '한 쪽 직각삼각형의 변만 구했어요.'], [M.h, '수선의 길이예요.'], [vadd(M.ab, M.ac), '두 변을 더했어요.'], [vmul(ans, vsq(2)), '변의 비를 거꾸로 적용했어요.'], [vdiv(ans, vsq(2)), '변의 비를 거꾸로 적용했어요.'], [vmul(ans, vsq(3)), '변의 비를 거꾸로 적용했어요.']];
    const nm = { ab: '\\overline{AB}', ac: '\\overline{AC}', bc: '\\overline{BC}' };
    const q = {
      tag: '[심화] 45°·60°인 삼각형', key: ['asa', vtex(hv), givenK, askK].join('|'),
      stem: `△ABC에서 $\\angle B=45^{\\circ}$, $\\angle C=60^{\\circ}$, $${nm[givenK]}=${vtex(gv)}$ 일 때, $${nm[askK]}$ 의 길이는?`,
      choices: mkChoices(ans, wr), fig: { hv: hv.v, givenK, askK, g: vcan(gv) }, given: [vcan(gv), '45°', '60°'], ans: [vcan(ans)]
    };
    q.fig.exact = M;
    return checkQ(q, [
      `삼각형 $ABC$의 밑각은 $45^{\\circ}$, $60^{\\circ}$입니다. 나머지 $75^{\\circ}$인 꼭짓점 $A$에서 $BC$에 수선 $AH$를 내려요.`,
      '$\\angle BAH=45^{\\circ}$, $\\angle CAH=30^{\\circ}$이므로 두 직각삼각형 모두 특수각을 갖습니다. $BH=AH$, $CH=AH/\\sqrt{3}$입니다.',
      givenK === 'ac' ? `$AH=AC\\sin60^{\\circ}=${vtex(gv)}\\times\\frac{\\sqrt{3}}{2}=${vtex(M.h)}$입니다.` : `$BC=AH+AH/\\sqrt{3}=${vtex(gv)}$이므로 $AH=${vtex(M.h)}$입니다.`,
      `$AB=\\sqrt{2}\\,AH$, $AC=2AH/\\sqrt{3}$, $BC=AH+AH/\\sqrt{3}$ 중 구하는 $${askK.toUpperCase()}$의 식에 $AH=${vtex(M.h)}$를 넣어요.`
    ], { kind: 'chain', pair: [45, 60], height: hv.v, givenSide: givenK, askedSide: askK, answer: ans.v });
  }

  /* ====================================================================== 8. [함정] 어느 꼭짓점에서 수선을? */
  const trap = {
    id: 'trapDontSplit60', title: '[함정] 어느 꼭짓점에서 수선을 내릴까?', short: '[함정] 수선의 위치',
    question: '45°·60°인 각이 있는 삼각형에서 60°인 꼭짓점에서 수선을 내리면 왜 어려울까? 올바른 수선과 비교해 보자.',
    ctl: ['t45k'],
    presets: () => [{ group: '수선을 내리는 꼭짓점', label: '75°인 A에서 (올바름)', apply: (s) => { s.t48w = 0; }, on: (s) => !s.t48w }, { label: '60°인 C에서 (함정)', apply: (s) => { s.t48w = 1; }, on: (s) => s.t48w === 1 }],
    init: (s) => { s.t45k = 6; s.t48w = 0; },
    model: (s) => { const k = Math.round(s.t45k), M = G.chainModel(vmul(vi(k), sinD(60)), [45, 60], true); M.k = k; M.wrong = s.t48w === 1; return M; },
    draw(b, s, M, C) { drawSplit(b, M, { step: C.step, wrong: M.wrong || C.step === 2, labels: { AC: { t: `${M.k}`, c: 'sky' } }, note: M.wrong || C.step === 2 ? '60°가 45°와 ?°로 나뉘어요 → 풀기 어려워요' : '75°가 45°와 30°로 나뉘어요 → 특수각', noteColor: M.wrong || C.step === 2 ? 'red' : 'amber' }); },
    steps: (M) => [
      '$\\angle B=45^{\\circ}$, $\\angle C=60^{\\circ}$, $\\angle A=75^{\\circ}$ 예요. 수선을 내리면 그 꼭짓점의 각이 둘로 나뉘어요.',
      '$60^{\\circ}$ 인 꼭짓점 $C$ 에서 $AB$ 에 수선을 내리면 $\\angle ACH=60^{\\circ}-45^{\\circ}=15^{\\circ}$ 처럼 특수각이 아닌 각이 생겨요.',
      '$75^{\\circ}$ 인 꼭짓점 $A$ 에서 $BC$ 에 수선을 내리면 $75^{\\circ}=45^{\\circ}+30^{\\circ}$ 로 두 직각삼각형이 모두 특수각이에요.'
    ],
    view: (M) => ({
      guide: '칩으로 수선을 내리는 꼭짓점을 바꿔 보세요. 45°·60°는 그대로 두고, <b>75°인 꼭짓점</b>에서 수선을 내려야 쉽게 풀려요.',
      readouts: [rd('A에서 내리면', '$75^{\\circ}=45^{\\circ}+30^{\\circ}$', 'green', '두 삼각형이 모두 특수각'), rd('C에서 내리면', '$60^{\\circ}=45^{\\circ}+15^{\\circ}$', 'red', '15°는 다루기 어려워요')],
      alert: { tone: 'warn', text: '60°나 45°인 각을 나누는 수선은 피해요. 나뉜 각이 특수각이 아니게 돼요.' },
      rule: '수선은 특수각(30°·45°·60°)을 그대로 두고, 나머지 각(75°·105°)의 꼭짓점에서 내린다',
      notes: notes('수선의 발에서 생기는 각이 특수각이 되도록 수선을 긋는 위치를 정해요.')
    }),
    gen: () => {
      const pair = pick([[45, 60], [60, 45], [45, 30], [30, 45]]), askB = pair.includes(90 - pair[0]) ? false : pair.includes(90 - pair[1]) ? true : Math.random() < 0.5, ans = askB ? 90 - pair[0] : 90 - pair[1];
      const wr = [[askB ? 90 - pair[1] : 90 - pair[0], '$\\angle BAH$ 와 $\\angle CAH$ 를 바꿨어요.'], [askB ? pair[0] : pair[1], '밑각의 크기예요. 수선과 이루는 각을 구해요.'], [45, ''], [30, ''], [60, ''], [15, ''], [75, '']];
      const hv = vi(6);
      const q = {
        tag: '[함정] 수선이 나누는 각', key: ['trap', pair.join(','), askB].join('|'),
        stem: `△ABC에서 $\\angle B=${pair[0]}^{\\circ}$, $\\angle C=${pair[1]}^{\\circ}$ 이고 $\\overline{AH}\\perp\\overline{BC}$ 일 때, $\\angle ${askB ? 'BAH' : 'CAH'}=x$ 의 크기는?`,
        choices: degChoices(ans, wr), fig: { pair, askB }, given: [`${pair[0]}°`, `${pair[1]}°`], ans: [`${ans}°`]
      };
      return checkQ(q, [
        `현재 밑각은 $\\angle B=${pair[0]}^{\\circ}$, $\\angle C=${pair[1]}^{\\circ}$입니다. 구하는 각은 $\\angle ${askB ? 'BAH' : 'CAH'}=x$입니다.`,
        `$AH\\perp BC$이므로 $\\triangle ${askB ? 'ABH' : 'ACH'}$의 $H$에서의 각은 $90^{\\circ}$입니다.`,
        `이 직각삼각형의 나머지 예각은 $${askB ? pair[0] : pair[1]}^{\\circ}$이므로 $x+${askB ? pair[0] : pair[1]}^{\\circ}=90^{\\circ}$입니다.`,
        `$x=90^{\\circ}-${askB ? pair[0] : pair[1]}^{\\circ}$를 계산해요. 다른 쪽 직각삼각형의 밑각과 바꾸지 않아요.`
      ], { kind: 'complement', angle: askB ? pair[0] : pair[1], answer: ans });
    },
    pdraw: (b, q) => { const M = G.chainModel(vi(6), q.fig.pair, true); drawSplit(b, M, { step: 2, xl: q.fig.askB ? 'B' : 'C' }); }
  };

  /* ====================================================================== 6. [심화] 15°·75° 의 탄젠트 */
  function geo15(k) { const C = pt(0, 0), A = pt(0, -k), Bp = pt(Math.sqrt(3) * k, 0), D = pt(Math.sqrt(3) * k + 2 * k, 0); return { A, B: Bp, C, D }; }
  function draw15(b, k, o = {}) {
    const { A, B, C, D } = geo15(k), st = o.step == null ? 99 : o.step, cen = centroid([A, C, D]);
    fit(b, bboxOf([A, C, D]), { t: 56, b: 70, l: 52, r: 56 });
    fillPoly(b, [A, C, B], 'sky', 0.14); if (st >= 1) fillPoly(b, [A, B, D], 'rose', 0.1);
    poly(b, [A, C, B], 'ink', 3.4); if (st >= 1) { line(b, B, D, 'violet', 3.4); line(b, A, D, 'ink', 3.4); }
    ang(b, C, B, A, { color: 'ink', r: 20 });
    ang(b, B, C, A, { color: 'amber', r: 40, label: '30°', size: 16 });
    if (st >= 1) { if (o.dl !== null) ang(b, D, C, A, { color: 'rose', r: 56, label: o.dl || '15°', size: 16, labelDist: 80 }); if (o.a75) ang(b, A, C, D, { color: 'rose', r: 46, label: '75°', size: 16, labelDist: 60, labelRot: -14 }); tick(b, A, B, 1, 'green'); tick(b, B, D, 1, 'green'); }
    [[A, 'A'], [C, 'C'], [B, 'B']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, n === 'B' ? pt(B.x, -3) : cen, n, { size: 17, gap: 11 }); });
    if (st >= 1) { b.point(D, { color: 'ink', r: 4.5 }); tagOut(b, D, cen, 'D', { size: 17, gap: 11 }); }
    const L = o.L || {};
    if (L.AC) T(b, mid(A, C), L.AC, { dx: -6, size: 16, color: 'sky', align: 'right' });
    if (L.CB) T(b, mid(C, B), L.CB, { dy: 22, size: 16, color: 'sky' });
    if (L.AB) T(b, mid(A, B), L.AB, { dx: 16, dy: -10, size: 16, color: 'green', align: 'left' });
    if (L.BD) T(b, mid(B, D), L.BD, { dy: 22, size: 16, color: 'green' });
    if (L.CD) T(b, mid(C, D), L.CD, { dy: 48, size: 17, color: 'amber' });
    (o.rows || []).forEach((r, i) => T(b, pt(D.x / 2, 0), r.t, { dy: 74 + i * 26, size: 16, color: r.c }));
  }
  const t15 = {
    id: 'r4-2', title: '[심화] 15°·75°의 tan 값', short: '[심화] tan 15°·75°',
    question: '30° 직각삼각형의 빗변을 한 변 길이만큼 연장해 이등변삼각형을 만들면 15°가 생긴다. tan 15°와 tan 75°는 얼마일까?',
    ctl: ['t46k'],
    init: (s) => { s.t46k = 2; },
    model: (s) => { const k = Math.round(s.t46k), cd = vadd(vmul(vsq(3), vi(k)), vi(2 * k)); return { k, cd, t15: vdiv(vi(k), cd), t75: vdiv(cd, vi(k)) }; },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99, k = M.k;
      draw15(b, k, { step: st, L: { AC: `${k}`, CB: show(1) ? `${vcan(vmul(vsq(3), vi(k)))}` : '', AB: `${2 * k}`, BD: show(1) ? `${2 * k}` : '', CD: show(2) ? `CD = ${vcan(M.cd)}` : '' }, rows: show(3) ? [{ t: `tan 15° = ${vcan(M.t15)},  tan 75° = ${vcan(M.t75)}`, c: 'amber' }] : [] });
    },
    steps: (M) => [
      `$\\triangle ABC$ 는 $30^{\\circ}$ 직각삼각형이에요. $AC=${M.k}$, $BC=${vtex(vmul(vsq(3), vi(M.k)))}$, $AB=${2 * M.k}$`,
      `$CB$ 를 연장해 $BD=AB=${2 * M.k}$ 가 되게 점 $D$ 를 잡아요. $\\triangle ABD$ 는 이등변삼각형이고 $\\angle ABC=30^{\\circ}$ 는 외각이므로 $\\angle D=15^{\\circ}$ 예요.`,
      `$CD=BC+BD=${vtex(M.cd)}$ 이므로 $\\tan15^{\\circ}=\\frac{AC}{CD}=${vtex(M.t15)}$`,
      `$\\angle CAD=75^{\\circ}$ 이므로 $\\tan75^{\\circ}=\\frac{CD}{AC}=${vtex(M.t75)}$`
    ],
    view: (M) => ({
      guide: '<b>AC</b>의 길이를 바꿔도 $\\tan15^{\\circ}$ 와 $\\tan75^{\\circ}$ 의 값은 변하지 않아요. 같은 길이(초록 눈금)가 이등변삼각형 ABD를 만들어요.',
      readouts: [rd('$\\tan15^{\\circ}$', `$${vtex(M.t15)}$`, 'rose', `$\\approx${decS(M.t15.v, 3)}$`), rd('$\\tan75^{\\circ}$', `$${vtex(M.t75)}$`, 'green', `$\\approx${decS(M.t75.v, 3)}$`)],
      rule: '$\\tan15^{\\circ}=2-\\sqrt{3}$, $\\tan75^{\\circ}=2+\\sqrt{3}$ — 30° 직각삼각형을 이등변삼각형이 되게 연장한다',
      notes: notes('이 장면은 교육과정 경계의 [심화] 내용이에요. 시험에서는 그림을 주고 묻는 경우가 많아요.', '$\\frac{1}{2+\\sqrt{3}}=2-\\sqrt{3}$ 은 분모의 유리화로 구해요.')
    }),
    gen: () => {
      const k = rint(1, 5), kind = pick(['t15', 't75', 'cd', 'cd']), cd = vadd(vmul(vsq(3), vi(k)), vi(2 * k)), t15v = vdiv(vi(k), cd), t75v = vdiv(cd, vi(k));
      let ans, stem, wr, L = { AC: `${k}` }, dl = '15°';
      if (kind === 't15') { ans = t15v; stem = '그림에서 $\\tan15^{\\circ}$ 의 값은?'; wr = [[t75v, '$75^{\\circ}$ 의 탄젠트예요. 기준각이 어느 각인지 확인해요.'], [vdiv(vi(1), vsq(3)), '$\\tan30^{\\circ}$ 예요.'], [vsub(vsq(3), vi(2)), '부호가 반대예요. 양수여야 해요.'], [vdiv(vi(1), vi(2)), '$\\sin30^{\\circ}$ 와 헷갈렸어요.'], [vsub(vi(2), vdiv(vi(1), vsq(3))), '']]; dl = '15°'; }
      else if (kind === 't75') { ans = t75v; stem = '그림에서 $\\tan75^{\\circ}$ 의 값은? (단, $\\angle CAD=75^{\\circ}$)'; wr = [[t15v, '$15^{\\circ}$ 의 탄젠트예요. 기준각이 어느 각인지 확인해요.'], [vsq(3), '$\\tan60^{\\circ}$ 예요.'], [vadd(vi(2), vdiv(vsq(3), vi(3))), ''], [vsub(vsq(3), vi(2)), ''], [vadd(vsq(3), vi(1)), '']]; }
      else { ans = vmul(vi(k), vadd(vsq(3), vi(2))); stem = '그림에서 $\\overline{CD}=x$ 의 값은?'; wr = [[vmul(vi(k), vsq(3)), '$BC$ 의 길이예요. $BD$ 도 더해야 해요.'], [vmul(vi(2 * k), vsq(3)), ''], [vmul(vi(k), vadd(vsq(3), vi(1))), '$BD=2k$ 예요. $k$ 가 아니에요.'], [vmul(vi(k), vsub(vi(2), vsq(3))), '부호가 반대예요.'], [vi(4 * k), '']]; L.CD = 'x'; }
      const q = { tag: '[심화] 15°·75°', key: ['t15', kind, k].join('|'), stem: `그림에서 $\\angle C=90^{\\circ}$, $\\angle ABC=30^{\\circ}$, $\\overline{AC}=${k}$, $\\overline{AB}=\\overline{BD}$ 일 때, ` + stem.replace(/^그림에서 /, ''), choices: mkChoices(ans, wr), fig: { k, L, dl, kind }, given: [`${k}`, '30°'], ans: [vcan(ans)] };
      q.fig.work = { AC: `${k}`, CB: vcan(vmul(vsq(3), vi(k))), AB: `${2 * k}`, BD: `${2 * k}`, CD: vcan(cd) };
      return checkQ(q, [
        `직각삼각형 $ABC$에서 $AC=${k}$, $\\angle ABC=30^{\\circ}$이므로 $AB=${2 * k}$, $BC=${vtex(vmul(vsq(3), vi(k)))}$입니다.`,
        `$AB=BD$이므로 $BD=${2 * k}$입니다. 이등변삼각형 $ABD$의 외각 $30^{\\circ}$를 이용하면 $\\angle ADB=15^{\\circ}$입니다.`,
        `$CD=CB+BD=${vtex(vmul(vsq(3), vi(k)))}+${2 * k}=${vtex(cd)}$입니다.`,
        kind === 'cd' ? '구하는 선분은 $CD$입니다. 두 선분의 합을 같은 근호끼리 정리해요.' : kind === 't15' ? `$\\tan15^{\\circ}=\\frac{AC}{CD}=\\frac{${k}}{${vtex(cd)}}$를 약분하고 분모를 유리화해요.` : `$\\angle CAD=75^{\\circ}$이므로 $\\tan75^{\\circ}=\\frac{CD}{AC}=\\frac{${vtex(cd)}}{${k}}$입니다.`
      ], { kind: 'tan15', scale: k, ask: kind, answer: ans.v });
    },
    pdraw: (b, q, C) => draw15(b, q.fig.k, { step: 1, L: C.review && C.step >= 2 ? { ...q.fig.work, CD: C.last || q.fig.kind !== 'cd' && C.step >= 3 ? q.fig.work.CD : q.fig.L.CD || '' } : q.fig.L, dl: q.fig.kind === 't15' ? '15°' : null, a75: q.fig.kind === 't75' })
  };

  /* ====================================================================== 7. 종이테이프 */
  function tapeGeo(w, th) {
    const t = th * DEG, s = w / Math.sin(t), cot = w / Math.tan(t);
    return { s, A: pt(0, 0), B: pt(s, 0), C: pt(s + cot, -w), D: pt(cot, -w) };
  }
  function drawTape(b, w, th, o = {}) {
    const g = tapeGeo(w, th), { A, B, C, D } = g, t = th * DEG, dir = pt(Math.cos(t), -Math.sin(t)), st = o.step == null ? 99 : o.step;
    const ext = Math.max(w, g.s) * 0.9, cen = centroid([A, B, C, D]);
    fit(b, bboxOf([pt(-g.s * 0.4, 0.4 * w), pt(B.x + g.s * 0.4, 0.1), pt(C.x + g.s * 0.35, -w - g.s * 0.5), pt(D.x - g.s * 0.5, -w - g.s * 0.6)]), { t: 50, b: 62, l: 56, r: 56 });
    // 테이프 1: 가로, 테이프 2: θ 만큼 기울어짐
    const x0 = -g.s * 0.7, x1 = B.x + g.s * 0.7;
    line(b, pt(x0, 0), pt(x1, 0), 'muted', 2.4); line(b, pt(x0, -w), pt(x1, -w), 'muted', 2.4);
    const up = (p, d) => pt(p.x + dir.x * d, p.y + dir.y * d);
    line(b, up(A, -w * 0.7), up(A, w + g.s * 0.45), 'muted', 2.4); line(b, up(B, -w * 0.7), up(B, w + g.s * 0.45), 'muted', 2.4);
    poly(b, [A, B, C, D], 'ink', 3.4, { fill: 'amber', fillAlpha: 0.22 });
    ang(b, A, B, D, { color: 'amber', r: 32, label: o.thL || `${th}°`, size: 16 });
    // 폭 w: 테이프 1 의 폭(세로)과 테이프 2 의 폭(수직)
    const Hh = pt(B.x + g.s * 0.35, 0); line(b, Hh, pt(Hh.x, -w), 'sky', 3); ang(b, Hh, pt(Hh.x - 1, 0), pt(Hh.x, -1), { color: 'ink', r: 12 }); T(b, mid(Hh, pt(Hh.x, -w)), o.wL || `${w}`, { dx: 14, size: 16, color: 'sky', align: 'left' });
    const foot = G.projOn(D, A, B), dpt = D; // D 에서 AB 에 내린 수선은 변 AB 에 수직인 높이 w
    if (st >= 1) { line(b, D, pt(D.x, 0), 'violet', 2.6, { dash: dashed }); ang(b, pt(D.x, 0), pt(D.x + 1, 0), D, { color: 'violet', r: 12 }); }
    [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    if (o.sideL) sideTag(b, A, B, cen, o.sideL, { color: o.sideC || 'green', size: o.sideSize || 17, flip: false, gap: 22 });
    if (o.inL) T(b, cen, o.inL, { size: 20, color: 'amber' });
    (o.rows || []).forEach((r, i) => T(b, pt((A.x + B.x) / 2, 0), r.t, { dy: 62 + i * 26, size: 16, color: r.c }));
  }
  const tape = {
    id: 'r4-3', title: '종이테이프를 겹쳤을 때', short: '종이테이프',
    question: '폭이 같은 종이테이프 두 장을 θ만큼 비스듬히 겹치면 겹친 부분은 어떤 도형일까? 한 변의 길이는 폭과 θ로 어떻게 구할까?',
    ctl: ['t47w', 't47t'],
    init: (s) => { s.t47w = 4; s.t47t = 60; },
    model: (s) => { const w = Math.round(s.t47w), th = Math.round(s.t47t), sn = sinD(th), sd = vdiv(vi(w), sn); return { w, th, sd, per: vmul(vi(4), sd), area: vmul(sd, vi(w)) }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawTape(b, M.w, M.th, { step: st, sideL: show(2) ? `${vcan(M.sd)}` : '', rows: show(3) ? [{ t: `둘레 = 4 × ${vcan(M.sd)} = ${vcan(M.per)}`, c: 'amber' }, { t: `넓이 = ${vcan(M.sd)} × ${M.w} = ${vcan(M.area)}`, c: 'green' }] : [] }); },
    steps: (M) => [
      `폭이 같은 두 테이프가 겹친 부분은 마주 보는 변이 평행한 <b>마름모</b>예요. 높이는 테이프의 폭 $${M.w}$ 와 같아요.`,
      `한 변을 $s$ 라 하면 $\\sin ${M.th}^{\\circ}=\\frac{${M.w}}{s}$ 이므로 $s=\\frac{${M.w}}{\\sin ${M.th}^{\\circ}}=${vtex(M.sd)}$`,
      `둘레는 $4s=${vtex(M.per)}$, 넓이는 $s\\times${M.w}=${vtex(M.area)}$ 예요.`
    ],
    view: (M) => ({
      guide: '<b>폭 w</b>와 <b>겹친 각 θ</b>를 바꿔 보세요. 두 번째 테이프를 제자리에서 돌리면 노란 마름모가 길어지거나 짧아져요. 높이(보라 점선)는 늘 폭 w예요.',
      readouts: [rd('한 변 $s$', `$${vtex(M.sd)}$`, 'green', M.sd.x ? '' : `$\\approx${decS(M.sd.v, 2)}$`), rd('둘레', `$${vtex(M.per)}$`, 'amber'), rd('넓이', `$${vtex(M.area)}$`, 'sky')],
      rule: '폭이 $w$ 인 두 테이프가 각 $\\theta$ 로 겹치면 마름모의 한 변 = $\\frac{w}{\\sin\\theta}$, 넓이 = $\\frac{w^2}{\\sin\\theta}$',
      notes: notes('각이 작을수록 한 변이 길어져요. $\\theta=90^{\\circ}$ 이면 정사각형이에요.', '마름모의 높이는 변이 아니라 폭 $w$ 예요. $s=w\\sin\\theta$ 로 곱하지 않아요.')
    }),
    gen: () => {
      const th = pick([30, 45, 60]), w = pick([2, 3, 4, 5, 6, 8]), kind = pick(['side', 'side', 'area']), sd = vdiv(vi(w), sinD(th)), area = vmul(sd, vi(w));
      const ans = kind === 'side' ? sd : area, base = kind === 'side' ? sd : area;
      const wr = kind === 'side' ? [[vmul(vi(w), sinD(th)), '$w\\sin\\theta$ 로 곱했어요. 나누어야 해요.'], [vi(w), '폭이에요. 한 변이 아니에요.'], [vmul(vi(w), cosD(th)), '$\\cos$ 을 썼어요.'], [vdiv(vi(w), cosD(th)), '$\\cos$ 을 썼어요.'], [vmul(sd, vi(2)), '']] : [[vmul(vi(w * w), sinD(th)), '$w^2\\sin\\theta$ 로 곱했어요. 나누어야 해요.'], [vmul(sd, vi(2)), ''], [vmul(vi(w), vi(w)), '정사각형으로 봤어요.'], [vmul(sd, sd), '변끼리 곱했어요. 한 변 × 높이예요.'], [vdiv(vmul(sd, vi(w)), vi(2)), '삼각형의 넓이예요. 마름모는 반으로 나누지 않아요.']];
      const q = {
        tag: '종이테이프 겹침', key: ['tape', th, w, kind].join('|'),
        stem: kind === 'side' ? `그림과 같이 폭이 $${w}$ 로 같은 두 종이테이프가 $\\angle A=${th}^{\\circ}$ 로 겹쳐 있을 때, 겹친 사각형 $ABCD$ 의 한 변 $\\overline{AB}=x$ 의 길이는?` : `그림과 같이 폭이 $${w}$ 로 같은 두 종이테이프가 $\\angle A=${th}^{\\circ}$ 로 겹쳐 있을 때, 겹친 사각형 $ABCD$ 의 넓이는?`,
        choices: mkChoices(ans, wr), fig: { w, th, kind }, given: [`${w}`, `${th}°`], ans: [vcan(ans)]
      };
      q.fig.side = vcan(sd); q.fig.area = vcan(area);
      return checkQ(q, [
        `테이프의 폭은 $${w}$, 겹친 각은 $${th}^{\\circ}$입니다. 폭이 같은 두 띠의 겹친 부분은 마름모입니다.`,
        `마름모 한 변을 $s$라 하고 높이를 그으면 높이는 폭 $${w}$와 같습니다. $\\sin ${th}^{\\circ}=\\frac{${w}}{s}$입니다.`,
        `$s=\\frac{${w}}{\\sin ${th}^{\\circ}}=\\frac{${w}}{${vtex(sinD(th))}}=${vtex(sd)}$입니다.`,
        kind === 'area' ? `넓이는 한 변 × 높이이므로 $S=${vtex(sd)}\\times${w}$입니다. 마름모의 두 변을 곱하는 것이 아니에요.` : '구하는 것은 마름모의 한 변입니다. 폭을 삼각비로 나눈 값을 약분해요.'
      ], { kind: 'tape', width: w, angle: th, ask: kind, answer: ans.v });
    },
    pdraw: (b, q, C) => drawTape(b, q.fig.w, q.fig.th, q.fig.kind === 'side' ? { step: C.review ? C.step : 0, sideL: C.last ? q.fig.side : 'x', sideC: 'amber', sideSize: 21 } : { step: C.review ? C.step : 0, sideL: C.review && C.step >= 3 ? q.fig.side : '', rows: [{ t: C.last ? `□ABCD의 넓이 = ${q.fig.area}` : '□ABCD의 넓이 = x', c: 'amber' }] })
  };

  G.register(40, 't4', '④ 변의 길이', '변의 길이', PARAMS, [fHyp, fBase, sasA, sasO, asa, t15, tape, trap]);
})();
