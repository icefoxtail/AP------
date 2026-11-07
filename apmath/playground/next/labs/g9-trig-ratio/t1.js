/* ==========================================================================
   중3 · 삼각비 — 탭 ① 「삼각비의 뜻」 (t1.js, order 10) — 장면 6개
   · r1-1 두 변으로 삼각비 구하기   · refAngleSwap 기준각 A↔B   · r1-2 한 삼각비로 나머지 구하기
   · r1-3 ∠A가 공통인 닮은 직각삼각형   · simRightTri 빗변에 수선을 내린 닮은 삼각형   · r1-4 기울어진 직각삼각형
   모든 글자·표시·정답은 지금의 변·각으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const { clamp, pt, add, sub, mul, mid, lerp, polar, rotP, T, tagOut, ang, sideTag, tick, line, poly, fillPoly, fit, rtGeo, drawRT, rtBox, P, rd, notes, tex, dashed, rint, pick, sample,
    vi, vsq, vf, vadd, vsub, vmul, vdiv, vsqrt, vpow2, vtex, vcan, veqT, veq, vsame, mkChoices, mkTextChoices, checkQ, fmtN, DEG, textW2, bboxOf, rowsBelow, texDeg } = G;

  const PARAMS = {
    t11a: P('높이 a (대변)', 1, 12, 1, 3, { color: 'rose', hint: '막대를 움직이면 직각삼각형이 바뀌어요' }),
    t11b: P('밑변 b (이웃변)', 1, 12, 1, 4, { color: 'sky' }),
    t12p: P('분자 p (대변)', 1, 11, 1, 3, { color: 'rose', hint: '$\\sin A=\\frac{p}{q}$ 의 p' }),
    t12q: P('분모 q (빗변)', 2, 12, 1, 5, { color: 'green' }),
    t13t: P('각 A', 15, 75, 1, 35, { color: 'amber', format: G.degF, hint: '세 삼각형이 모두 같은 각 A를 가져요' }),
    t13u1: P('AB의 길이', 2, 12, 1, 3, { color: 'sky' }),
    t13u2: P('AD의 길이', 2, 12, 1, 6, { color: 'sky' }),
    t13u3: P('AF의 길이', 2, 12, 1, 9, { color: 'sky' }),
    t15p: P('AB의 길이', 3, 12, 1, 6, { color: 'rose' }),
    t15q: P('AC의 길이', 3, 12, 1, 8, { color: 'sky' }),
    t16a: P('높이 a', 1, 10, 1, 3, { color: 'rose' }),
    t16b: P('밑변 b', 1, 10, 1, 4, { color: 'sky' }),
    t16r: P('돌리기', -180, 180, 5, 40, { color: 'amber', format: G.degF, hint: '삼각형을 제자리에서 돌려 보세요. 변의 이름은 바뀌지 않아요' })
  };
  const ROLE = { a: '대변', b: '이웃변', c: '빗변' };
  const COLA = { a: 'rose', b: 'sky', c: 'green' };
  const colFor = (base) => (base === 'A' ? COLA : { a: 'sky', b: 'rose', c: 'green' });
  const roleFor = (base) => (base === 'A' ? ROLE : { a: '이웃변', b: '대변', c: '빗변' });
  const FN = { s: '\\sin', c: '\\cos', t: '\\tan' };
  const FNK = { s: 'sin', c: 'cos', t: 'tan' };

  /* ---- 삼각형 이름 · 변 이름 (그림 위치 → 글자) ---- */
  const nmRand = () => { const l = sample(['A', 'B', 'C'], 3); return { A: l[0], B: l[1], C: l[2] }; };
  const ov = (x, y) => `\\overline{${x}${y}}`;
  const sideTex = (nm, k) => ({ a: ov(nm.B, nm.C), b: ov(nm.C, nm.A), c: ov(nm.A, nm.B) }[k]);
  const triName = (nm) => [nm.A, nm.B, nm.C].sort().join('');
  // 변·각 값
  const rtVals = (a, b) => { const c = vsqrt(vadd(vpow2(a), vpow2(b))); return { a, b, c, sA: vdiv(a, c), cA: vdiv(b, c), tA: vdiv(a, b), sB: vdiv(b, c), cB: vdiv(a, c), tB: vdiv(b, a) }; };
  const degOf = (a, b) => Math.atan2(a, b) / DEG;
  const same = (x, y) => vtex(x) === vtex(y);

  // The wide shell floats its toolbar over the lower-right corner (right inset
  // 16); narrow layouts already reserve the toolbar with a bottom inset.
  const toolbarBottomPad = (b) => !b.thumb && b.insets.right > 0 ? 32 : 0;

  /* ---- 문제 그림: 직각삼각형(공용) ---- */
  // f = { a, b(모양용 실수), mirror, rot, names, side:{a,b,c:{t,c}}, angA:{t,c}, angB:{t,c}, ticks, notes:[{t,c}] }
  function pdrawRT(b, f, C = {}) {
    const g = rtGeo(f.a, f.b, { mirror: f.mirror, rot: f.rot });
    const nn = (f.notes || []).length;
    fit(b, rtBox(g), { t: 44, b: 52 + nn * 28 + toolbarBottomPad(b), l: 60, r: 60 });
    const base = f.swap && C.review && C.step >= 3 ? 'B' : f.reference || 'A';
    const roles = roleFor(base), col = colFor(base), showRole = C.review && C.step >= 2;
    const side = Object.fromEntries(Object.entries(f.side || {}).map(([k, v]) => [k, { ...v }]));
    if (C.review && C.step >= 3 && f.solutionSide) Object.entries(f.solutionSide).forEach(([k, t]) => {
      if (!side[k] || side[k].t !== 'x' || C.last) side[k] = { t, c: col[k] };
    });
    if (showRole) Object.entries(side).forEach(([k, v]) => { v.c = col[k]; v.t = `${roles[k]} ${v.t}`; });
    drawRT(b, g, { names: f.names, side, angA: f.angA, angB: f.angB, ticks: f.ticks, fill: 'sky', fa: 0.08, col: showRole ? col : null });
    const yb = Math.max(g.A.y, g.B.y, g.C.y), cx = (Math.min(g.A.x, g.B.x, g.C.x) + Math.max(g.A.x, g.B.x, g.C.x)) / 2;
    (f.notes || []).forEach((n, i) => T(b, pt(cx, yb), n.t, { dy: 54 + i * 28, size: 17, color: n.c || 'sky' }));
  }
  G.pdrawRT = pdrawRT;
  G.nmRand = nmRand; G.ov = ov; G.sideTag2 = sideTex; G.triName = triName; G.rtVals = rtVals; G.degOf = degOf;
  G.colFor = colFor; G.roleFor = roleFor; G.FN = FN; G.FNK = FNK;

  /* 직각삼각형 + 역할 글씨 · 삼각비 줄 (탐구·정리 공용) */
  function drawBase(b, M, C, o = {}) {
    const { a, b: bb } = M, g = rtGeo(a.v, bb.v, { rot: o.rot || 0, mirror: o.mirror });
    const base = o.base || 'A', col = colFor(base), role = roleFor(base);
    const rowsN = o.rows ? o.rows.length : 0;
    fit(b, rtBox(g), { t: 44, b: 48 + rowsN * 26, l: 64, r: 64 });
    const st = C.step;
    const showRole = st >= (o.roleStep || 2), showRows = st >= (o.rowStep || 3);
    const lab = (k, v) => (showRole ? `${role[k]} ${v}` : v);
    drawRT(b, g, {
      names: { A: 'A', B: 'B', C: 'C' }, fill: 'sky', fa: 0.08, col: showRole ? col : null, curveDim: o.curve,
      side: { a: { t: lab('a', vcan(a)), c: showRole ? col.a : 'ink' }, b: { t: lab('b', vcan(bb)), c: showRole ? col.b : 'ink' }, c: { t: lab('c', vcan(M.c)), c: showRole ? col.c : 'ink' } },
      angA: base === 'A' ? { t: o.angA, c: 'amber' } : null, angB: base === 'B' ? { t: o.angB, c: 'amber' } : null
    });
    if (showRows && o.rows) {
      const yb = Math.max(g.A.y, g.B.y, g.C.y), cx = (Math.min(g.A.x, g.B.x, g.C.x) + Math.max(g.A.x, g.B.x, g.C.x)) / 2;
      o.rows.forEach((r, i) => T(b, pt(cx, yb), r.t, { dy: 50 + i * 26, size: 16, color: r.c }));
    }
    return g;
  }
  // "sin A = \frac{3}{5}" 줄: 기호식 + 값
  const ratioRow = (fnk, nm, num, den, val, color) => {
    const v = vcan(val), sym = `\\frac{${num}}{${den}}`;
    return { t: `${fnk} ${nm} = ${sym}` + (v !== `\\frac{${num}}{${den}}` ? ` = ${v}` : ''), c: color };
  };

  /* ====================================================================== 1. 두 변으로 삼각비 구하기 */
  const r11 = {
    id: 'r1-1', title: '두 변으로 삼각비 구하기', short: '삼각비의 뜻',
    question: '직각삼각형의 두 변을 바꾸면 sin A, cos A, tan A는 어떻게 변할까? 대변·이웃변·빗변을 먼저 찾아 보자.',
    ctl: ['t11a', 't11b'],
    init: (s) => { s.t11a = 3; s.t11b = 4; },
    model: (s) => { const a = vi(Math.round(s.t11a)), b = vi(Math.round(s.t11b)), V = rtVals(a, b); V.deg = degOf(a.v, b.v); V.sp = vame(V); return V; },
    draw(b, s, M, C) {
      const A = 'A', rows = [ratioRow('sin', A, 'a', 'c', M.sA, 'rose'), ratioRow('cos', A, 'b', 'c', M.cA, 'sky'), ratioRow('tan', A, 'a', 'b', M.tA, 'green')];
      const num = [ratioRow('sin', A, vcan(M.a), vcan(M.c), M.sA, 'rose'), ratioRow('cos', A, vcan(M.b), vcan(M.c), M.cA, 'sky'), ratioRow('tan', A, vcan(M.a), vcan(M.b), M.tA, 'green')];
      const use = C.step >= 4 ? num : rows;
      drawBase(b, M, C, { rows: use, rowStep: 3, roleStep: 2, curve: true, angA: C.step >= 1 ? `${M.sp}${fmtN(M.deg)}°` : '' });
    },
    steps: (M) => [
      '기준이 되는 각 $\\angle A$를 정해요. 이 각을 기준으로 변의 이름을 붙여요.',
      `기준각의 맞은편 변이 대변 $a=${vtex(M.a)}$, 기준각에 이웃한 변(빗변이 아닌 것)이 이웃변 $b=${vtex(M.b)}$, 직각의 맞은편이 빗변 $c=${vtex(M.c)}$ 예요.`,
      '세 비를 써요. $\\sin A=\\frac{\\text{대변}}{\\text{빗변}}=\\frac{a}{c}$, $\\cos A=\\frac{\\text{이웃변}}{\\text{빗변}}=\\frac{b}{c}$, $\\tan A=\\frac{\\text{대변}}{\\text{이웃변}}=\\frac{a}{b}$',
      `값을 넣어요. $\\sin A=\\frac{${vtex(M.a)}}{${vtex(M.c)}}=${vtex(M.sA)}$, $\\cos A=${vtex(M.cA)}$, $\\tan A=${vtex(M.tA)}$`
    ],
    view: (M) => ({
      guide: '<b>높이 a</b>와 <b>밑변 b</b>를 바꿔 보세요. 분홍 변이 대변, 하늘색 변이 이웃변, 초록 변이 빗변이에요. 빗변은 피타고라스 정리로 자동으로 구해져요.',
      readouts: [rd('$\\sin A$', `$${vtex(M.sA)}$`, 'rose', '대변 ÷ 빗변'), rd('$\\cos A$', `$${vtex(M.cA)}$`, 'sky', '이웃변 ÷ 빗변'), rd('$\\tan A$', `$${vtex(M.tA)}$`, 'green', '대변 ÷ 이웃변')],
      formula: `<p>$c=\\sqrt{a^2+b^2}=\\sqrt{${M.a.v}^2+${M.b.v}^2}=${vtex(M.c)}$</p><p>$\\sin A=\\frac{a}{c}=${vtex(M.sA)}$ , $\\cos A=\\frac{b}{c}=${vtex(M.cA)}$ , $\\tan A=\\frac{a}{b}=${vtex(M.tA)}$</p>`,
      rule: '$\\sin A=\\frac{\\text{대변}}{\\text{빗변}}$, $\\cos A=\\frac{\\text{이웃변}}{\\text{빗변}}$, $\\tan A=\\frac{\\text{대변}}{\\text{이웃변}}$',
      notes: notes('빗변은 직각의 맞은편에서 가장 긴 변이에요. 대변·이웃변은 기준각에 따라 정해져요.', '분모에 근호가 남으면 분모를 유리화해요. 예: $\\frac{3}{\\sqrt{13}}=\\frac{3\\sqrt{13}}{13}$')
    }),
    gen: (prev) => ratioProblem(prev, false, 'r11')
  };
  function vame(M) { return M.sA.x && Math.abs(M.deg - Math.round(M.deg)) < 1e-6 && [30, 45, 60].includes(Math.round(M.deg)) ? '' : '≈'; }
  r11.pdraw = (b, q, C) => pdrawRT(b, q.fig, C);

  /* 공용 문제: 두 변이 주어진 직각삼각형에서 삼각비 구하기 (기울어짐 선택) */
  const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15], [4, 3, 5], [12, 5, 13], [15, 8, 17], [10, 24, 26]];
  function ratioProblem(prev, tilt, tagKey) {
    const nm = nmRand();
    let a, b, c, given, kind = pick(['legs', 'legs', 'hyp']);
    if (kind === 'legs') {
      if (Math.random() < 0.55) { const t = pick(TRI); a = vi(t[0]); b = vi(t[1]); } else { const t = pick([[1, 2], [2, 3], [1, 3], [3, 1], [2, 1], [3, 2], [2, 5], [4, 3], [5, 2]]); a = vi(t[0]); b = vi(t[1]); }
      c = vsqrt(vadd(vpow2(a), vpow2(b)));
      given = { a, b };
    } else {
      const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [4, 3, 5], [12, 5, 13], [2, 0, 4], [1, 0, 3], [3, 0, 6], [2, 0, 6]]);
      const cc = t[2], aa = t[0];
      a = vi(aa); c = vi(cc); b = vsqrt(vsub(vpow2(c), vpow2(a)));
      given = { a, c };
    }
    const atB = Math.random() < 0.4, fn = pick(['s', 'c', 't']);
    const rv = rtVals(a, b);
    // 그림 쪽 기준: 위치 A = 기준각(왼쪽 아래), 위치 B = 다른 예각
    const val = atB ? { s: rv.sB, c: rv.cB, t: rv.tB }[fn] : { s: rv.sA, c: rv.cA, t: rv.tA }[fn];
    const wrongs = [];
    const mine = atB ? { s: rv.sB, c: rv.cB, t: rv.tB } : { s: rv.sA, c: rv.cA, t: rv.tA };
    const other = atB ? { s: rv.sA, c: rv.cA, t: rv.tA } : { s: rv.sB, c: rv.cB, t: rv.tB };
    const names = { s: '다른 각의 삼각비를 구했어요. 기준각이 어느 각인지 다시 봐요.', c: '다른 삼각비를 구했어요. 대변·이웃변·빗변을 다시 짝지어 봐요.', t: '다른 삼각비를 구했어요. 대변·이웃변·빗변을 다시 짝지어 봐요.' };
    ['s', 'c', 't'].forEach((k) => { if (k !== fn) wrongs.push([mine[k], names[k]]); });
    wrongs.push([other[fn], names[fn]]);
    wrongs.push([vdiv(vi(1), val), '분자와 분모를 거꾸로 썼어요.']);
    const rot = tilt ? pick([-150, -120, -100, -60, -35, 25, 50, 80, 110, 140, 170]) : 0, mirror = Math.random() < 0.4;
    const side = {};
    if (given.a) side.a = { t: vcan(given.a), c: 'sky' };
    if (given.b) side.b = { t: vcan(given.b), c: 'sky' };
    if (given.c) side.c = { t: vcan(given.c), c: 'sky' };
    const vname = atB ? nm.B : nm.A;
    const gtxt = [];
    if (given.a) gtxt.push(`$${sideTex(nm, 'a')}=${vtex(given.a)}$`);
    if (given.b) gtxt.push(`$${sideTex(nm, 'b')}=${vtex(given.b)}$`);
    if (given.c) gtxt.push(`$${sideTex(nm, 'c')}=${vtex(given.c)}$`);
    const q = {
      tag: tilt ? '기울어진 직각삼각형의 삼각비' : '삼각비의 값', key: [tagKey, kind, fn, atB, a.v, b.v, nm.A + nm.B + nm.C, rot, mirror].join('|'),
      stem: `$\\angle ${nm.C}=90^{\\circ}$인 직각삼각형 ${triName(nm)}에서 ${gtxt.join(', ')}일 때, $${FN[fn]} ${vname}$의 값은?`,
      choices: mkChoices(val, wrongs, {}),
      fig: { a: a.v, b: b.v, mirror, rot, names: nm, side, angA: atB ? null : { t: '', c: 'amber' }, angB: atB ? { t: '', c: 'amber' } : null },
      given: Object.values(side).map((x) => x.t)
    };
    q.fig.reference = atB ? 'B' : 'A';
    q.fig.solutionSide = { a: vcan(a), b: vcan(b), c: vcan(c) };
    const opp = atB ? 'b' : 'a', adj = atB ? 'a' : 'b';
    const num = fn === 'c' ? adj : opp, den = fn === 't' ? adj : 'c';
    return checkQ(q, [
      `직각은 $\\angle ${nm.C}$, 기준각은 $\\angle ${vname}$입니다. 주어진 길이 ${gtxt.join(', ')}를 그림에서 확인해요.`,
      `기준각 $${vname}$의 대변은 $${sideTex(nm, opp)}$, 이웃변은 $${sideTex(nm, adj)}$, 빗변은 $${sideTex(nm, 'c')}$입니다.`,
      kind === 'legs' ? `피타고라스 정리로 빗변은 $\\sqrt{${vtex(vpow2(a))}+${vtex(vpow2(b))}}=${vtex(c)}$입니다.` : `피타고라스 정리로 나머지 변은 $\\sqrt{${vtex(vpow2(c))}-${vtex(vpow2(a))}}=${vtex(b)}$입니다.`,
      `$${FN[fn]} ${vname}=\\frac{${sideTex(nm, num)}}{${sideTex(nm, den)}}=\\frac{${vtex(rv[num])}}{${vtex(rv[den])}}$를 계산해요.`
    ], { kind: 'ratio', a: a.v, b: b.v, c: c.v, ref: atB ? 'B' : 'A', fn, answer: val.v });
  }

  /* ====================================================================== 2. 기준각 A ↔ B */
  const swap = {
    id: 'refAngleSwap', title: '기준각 A ↔ B', short: '기준각 바꾸기',
    question: '기준각을 ∠A에서 ∠B로 바꾸면 대변과 이웃변이 서로 바뀐다. sin A와 cos B는 어떤 관계일까?',
    ctl: ['t11a', 't11b'],
    presets: () => [{ group: '기준각', label: '∠A 로 보기', apply: (s) => { s.t12base = 'A'; }, on: (s) => s.t12base !== 'B' }, { label: '∠B 로 보기', apply: (s) => { s.t12base = 'B'; }, on: (s) => s.t12base === 'B' }],
    init: (s) => { s.t11a = 3; s.t11b = 4; s.t12base = 'A'; },
    model: (s) => { const a = vi(Math.round(s.t11a)), b = vi(Math.round(s.t11b)), V = rtVals(a, b); V.base = s.t12base === 'B' ? 'B' : 'A'; V.degA = degOf(a.v, b.v); return V; },
    draw(b, s, M, C) {
      const base = C.step === 4 ? 'B' : C.step >= 1 && C.step <= 3 ? 'A' : M.base, nmB = base;
      const v = base === 'A' ? { s: M.sA, c: M.cA, t: M.tA, n: ['a', 'b'] } : { s: M.sB, c: M.cB, t: M.tB, n: ['b', 'a'] };
      const rows = [ratioRow('sin', nmB, base === 'A' ? 'a' : 'b', 'c', v.s, 'rose'), ratioRow('cos', nmB, base === 'A' ? 'b' : 'a', 'c', v.c, 'sky'), ratioRow('tan', nmB, base === 'A' ? 'a' : 'b', base === 'A' ? 'b' : 'a', v.t, 'green')];
      const st = C.step;
      const eq = st >= 3 || C.step === 99 ? [{ t: base === 'A' ? `sin A = cos B = ${vcan(M.sA)}` : `sin B = cos A = ${vcan(M.sB)}`, c: 'amber' }] : [];
      drawBase(b, M, C, { base, rows: [...rows, ...eq], rowStep: 3, roleStep: 2, angA: `${fmtN(M.degA)}°`, angB: `${fmtN(90 - M.degA)}°` });
    },
    steps: (M) => [
      '$\\angle A$를 기준각으로 정하면 $a$가 대변, $b$가 이웃변이에요.',
      `$\\sin A=\\frac{a}{c}=${vtex(M.sA)}$, $\\cos A=\\frac{b}{c}=${vtex(M.cA)}$`,
      `$\\angle B$로 보면 $b$가 대변, $a$가 이웃변이에요. $\\sin B=\\frac{b}{c}=${vtex(M.sB)}$, $\\cos B=\\frac{a}{c}=${vtex(M.cB)}$`,
      `$\\sin A=\\cos B$, $\\cos A=\\sin B$ 이고 $\\angle A+\\angle B=90^{\\circ}$ 예요. $\\tan A\\times\\tan B=1$ 도 확인해요.`
    ],
    view: (M) => ({
      guide: '칩으로 <b>기준각</b>을 ∠A와 ∠B로 바꿔 보세요. 기준각이 바뀌면 분홍(대변)과 하늘색(이웃변)이 서로 바뀌어요.',
      readouts: [rd('$\\sin A=\\cos B$', `$${vtex(M.sA)}$`, 'rose'), rd('$\\cos A=\\sin B$', `$${vtex(M.cA)}$`, 'sky'), rd('$\\tan A\\times\\tan B$', '$1$', 'green')],
      rule: '$\\sin A=\\cos(90^{\\circ}-A)$, $\\cos A=\\sin(90^{\\circ}-A)$ — 기준각이 바뀌면 대변과 이웃변이 바뀐다',
      notes: notes('삼각비를 구할 때는 먼저 어느 각이 기준인지 확인해요.', '두 예각의 합은 $90^{\\circ}$ 이므로, 한 각의 sin은 다른 각의 cos 와 같아요.')
    }),
    gen: () => {
      const nm = nmRand(), t = pick(TRI), a = vi(t[0]), b = vi(t[1]), c = vi(t[2]), rv = rtVals(a, b);
      const A = nm.A, B = nm.B;
      const forms = [
        { s: `\\sin ${A}+\\cos ${B}`, v: vmul(vi(2), rv.sA), w: [[rv.sA, `sin ${A} 하나만 구했어요. cos ${B}도 더해요.`], [vadd(rv.sA, rv.sB), `cos ${B} 는 sin ${B} 가 아니라 sin ${A} 와 같아요.`], [vmul(vi(2), rv.sB), '대변과 이웃변이 바뀌었어요.'], [vi(1), `$\\sin^2 ${A}+\\cos^2 ${A}$ 가 아니에요.`]] },
        { s: `\\sin ${A}\\times\\cos ${B}`, v: vmul(rv.sA, rv.cB), w: [[vmul(rv.sA, rv.cA), `cos ${B} 가 아니라 cos ${A} 를 곱했어요.`], [rv.sA, `cos ${B} 를 곱하지 않았어요.`], [vmul(rv.sB, rv.cB), `기준각이 ${B}로 바뀌었어요.`], [vmul(rv.sA, rv.sB), `sin ${A} 와 sin ${B} 를 곱했어요.`]] },
        { s: `\\cos ${A}+\\sin ${B}`, v: vmul(vi(2), rv.cA), w: [[rv.cA, `cos ${A} 하나만 구했어요. sin ${B}도 더해요.`], [vmul(vi(2), rv.sA), '대변과 이웃변이 바뀌었어요.'], [vadd(rv.cA, rv.cB), `sin ${B} 는 cos ${B} 가 아니라 cos ${A} 와 같아요.`], [vi(1), `$\\sin^2 ${A}+\\cos^2 ${A}$ 가 아니에요.`]] },
        { s: `\\tan ${A}\\times\\tan ${B}`, v: vi(1), w: [[rv.tA, `tan ${B} 를 곱하지 않았어요.`], [vadd(rv.tA, rv.tB), '곱이 아니라 합을 구했어요.'], [vmul(rv.sA, rv.cA), 'tan 이 아니라 sin·cos 를 곱했어요.'], [rv.tB, `tan ${A} 를 곱하지 않았어요.`]] },
        { s: `\\sin ${A}\\times\\sin ${B}`, v: vmul(rv.sA, rv.sB), w: [[vmul(rv.sA, rv.sA), `sin ${B} 가 아니라 sin ${A} 를 곱했어요.`], [vadd(rv.sA, rv.sB), '곱이 아니라 합을 구했어요.'], [vmul(rv.cA, rv.sB), `sin ${A} 가 아니라 cos ${A} 예요.`], [vmul(rv.tA, rv.sB), 'tan 을 곱했어요.']] }
      ];
      const f = pick(forms), mirror = Math.random() < 0.4;
      const q = {
        tag: '기준각이 바뀌면', key: ['sw', f.s, t.join(','), A + B].join('|'),
        stem: `$\\angle ${nm.C}=90^{\\circ}$인 직각삼각형 ${triName(nm)}에서 $${sideTex(nm, 'a')}=${t[0]}$, $${sideTex(nm, 'b')}=${t[1]}$일 때, $${f.s}$의 값은?`,
        choices: mkChoices(f.v, f.w),
        fig: { a: t[0], b: t[1], mirror, rot: 0, names: nm, side: { a: { t: String(t[0]), c: 'sky' }, b: { t: String(t[1]), c: 'sky' } }, angA: { t: '', c: 'amber', rings: 1 }, angB: { t: '', c: 'rose', rings: 2 } },
        given: [String(t[0]), String(t[1])]
      };
      q.fig.reference = 'A'; q.fig.swap = true;
      q.fig.solutionSide = { a: vcan(a), b: vcan(b), c: vcan(c) };
      return checkQ(q, [
        `주어진 두 변은 $${sideTex(nm, 'a')}=${vtex(a)}$, $${sideTex(nm, 'b')}=${vtex(b)}$입니다. $${f.s}$를 구해요.`,
        `피타고라스 정리로 빗변 $${sideTex(nm, 'c')}=\\sqrt{${t[0]}^2+${t[1]}^2}=${vtex(c)}$입니다.`,
        `기준각이 $${A}$에서 $${B}$로 바뀌면 대변과 이웃변이 바뀝니다. $\\sin ${A}=\\cos ${B}=${vtex(rv.sA)}$, $\\cos ${A}=\\sin ${B}=${vtex(rv.cA)}$입니다.`,
        `$\\tan ${A}=${vtex(rv.tA)}$, $\\tan ${B}=${vtex(rv.tB)}$도 확인한 뒤, 문제의 식 $${f.s}$에 해당하는 값만 넣어 계산해요.`
      ], { kind: 'swap', a: a.v, b: b.v, expression: f.s, answer: f.v.v });
    },
    pdraw: (b, q, C) => pdrawRT(b, q.fig, C)
  };

  /* ====================================================================== 3. 한 삼각비로 나머지 구하기 */
  const r12 = {
    id: 'r1-2', title: '한 삼각비로 나머지 구하기', short: '삼각비 하나로',
    question: 'sin A의 값 하나만 알면 cos A와 tan A도 구할 수 있을까? 값을 변의 비로 바꿔 직각삼각형을 그려 보자.',
    ctl: ['t12p', 't12q'],
    init: (s) => { s.t12p = 3; s.t12q = 5; },
    model: (s) => {
      const q = Math.round(s.t12q), p = Math.min(Math.round(s.t12p), q - 1), a = vi(p), c = vi(q), b = vsqrt(vsub(vpow2(c), vpow2(a)));
      const V = rtVals(a, b); V.p = p; V.q = q; V.b = b; return V;
    },
    draw(b, s, M, C) {
      const g = rtGeo(M.a.v, M.b.v), st = C.step;
      const rows = [{ t: `sin A = \\frac{${M.p}}{${M.q}}`, c: 'rose' }];
      if (st >= 3) rows.push({ t: `cos A = ${vcan(M.cA)}`, c: 'sky' }, { t: `tan A = ${vcan(M.tA)}`, c: 'green' });
      fit(b, rtBox(g), { t: 44, b: 48 + rows.length * 26, l: 64, r: 64 });
      drawRT(b, g, {
        names: { A: 'A', B: 'B', C: 'C' }, fill: 'sky', fa: 0.08, col: st >= 1 ? { a: 'rose', c: 'green', b: st >= 2 ? 'sky' : null } : null,
        side: { a: { t: st >= 1 ? String(M.p) : '', c: 'rose' }, c: { t: st >= 1 ? String(M.q) : '', c: 'green' }, b: { t: st >= 2 ? vcan(M.b) : '', c: 'sky' } },
        angA: { t: 'A', c: 'amber' }
      });
      const yb = Math.max(g.A.y, g.B.y, g.C.y), cx = (g.A.x + g.C.x) / 2;
      rows.forEach((r, i) => T(b, pt(cx, yb), r.t, { dy: 50 + i * 26, size: 16, color: r.c }));
    },
    steps: (M) => [
      `$\\sin A=\\frac{${M.p}}{${M.q}}$ 이므로 대변이 $${M.p}$, 빗변이 $${M.q}$ 인 직각삼각형을 그려요.`,
      `피타고라스 정리로 이웃변을 구해요. $b=\\sqrt{${M.q}^2-${M.p}^2}=${vtex(M.b)}$`,
      `$\\cos A=\\frac{b}{c}=${vtex(M.cA)}$, $\\tan A=\\frac{a}{b}=${vtex(M.tA)}$`
    ],
    view: (M) => ({
      guide: '<b>p</b>와 <b>q</b>를 바꿔 $\\sin A=\\frac{p}{q}$ 를 만들어 보세요. 그 비로 직각삼각형이 그려지고 나머지 변과 비가 자동으로 구해져요.',
      readouts: [rd('이웃변 $b$', `$${vtex(M.b)}$`, 'sky'), rd('$\\cos A$', `$${vtex(M.cA)}$`, 'sky'), rd('$\\tan A$', `$${vtex(M.tA)}$`, 'green')],
      rule: '삼각비의 값 하나가 주어지면 → 그 비로 직각삼각형을 그리고 → 피타고라스 정리로 나머지 변 → 나머지 삼각비',
      notes: notes('$\\sin A=\\frac{3}{5}$ 이라고 해서 대변이 꼭 3인 것은 아니에요. 비가 $3:5$ 인 삼각형이면 돼요.', '이웃변은 $b=\\sqrt{c^2-a^2}$ 로 구해요. $\\sqrt{c^2+a^2}$ 가 아니에요.')
    }),
    gen: (prev) => {
      const nm = nmRand(), kind = pick(['ratio', 'length', 'length']), fn = pick(['s', 'c', 't']);
      const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [4, 3, 5], [12, 5, 13], [7, 24, 25]]);
      const [aa, bb, cc] = t, a = vi(aa), b = vi(bb), c = vi(cc), rv = rtVals(a, b);
      const mirror = Math.random() < 0.4;
      // 기준각: 위치 A. 주어진 비
      const gr0 = { s: [aa, cc], c: [bb, cc], t: [aa, bb] }[fn], gg = G.gcd(gr0[0], gr0[1]), givenRatio = [gr0[0] / gg, gr0[1] / gg];
      const gtex = `${FN[fn]} ${nm.A}=\\frac{${givenRatio[0]}}{${givenRatio[1]}}`, gcan = `${FNK[fn]} ${nm.A} = \\frac{${givenRatio[0]}}{${givenRatio[1]}}`;
      let q;
      if (kind === 'ratio') {
        const ask = pick(['s', 'c', 't'].filter((k) => k !== fn)), val = { s: rv.sA, c: rv.cA, t: rv.tA }[ask];
        const wr = [];
        ['s', 'c', 't'].forEach((k) => { if (k !== ask) { const w = { s: rv.sA, c: rv.cA, t: rv.tA }[k]; wr.push([w, '다른 삼각비예요. 구하는 것이 무엇인지 확인해요.']); } });
        wr.push([vdiv(vi(1), val), '분자와 분모를 거꾸로 썼어요.']);
        wr.push([{ s: rv.sB, c: rv.cB, t: rv.tB }[ask], `기준각이 ∠${nm.B} 로 바뀌었어요.`]);
        q = {
          tag: '삼각비 하나로 나머지 구하기', key: ['r12', 'ratio', fn, ask, t.join(','), nm.A + nm.B + nm.C, mirror].join('|'),
          stem: `$\\angle ${nm.C}=90^{\\circ}$인 직각삼각형 ${triName(nm)}에서 $${gtex}$일 때, $${FN[ask]} ${nm.A}$의 값은?`,
          choices: mkChoices(val, wr),
          fig: { a: aa, b: bb, mirror, rot: 0, names: nm, side: {}, angA: { t: '', c: 'amber' }, notes: [{ t: gcan, c: 'sky' }] },
          given: [gcan]
        };
        q.fig.reference = 'A'; q.fig.solutionSide = { a: vcan(a), b: vcan(b), c: vcan(c) };
        checkQ(q, [
          `주어진 비는 $${gtex}$이고, 구하는 것은 $${FN[ask]} ${nm.A}$입니다.`,
          `삼각비는 크기가 아닌 비이므로 대변·이웃변·빗변의 비가 $${aa}:${bb}:${cc}$인 닮은 직각삼각형을 사용할 수 있어요.`,
          `피타고라스 정리 $${aa}^2+${bb}^2=${cc}^2$로 세 변의 관계를 확인해요.`,
          `$\\sin ${nm.A}=\\frac{${aa}}{${cc}}$, $\\cos ${nm.A}=\\frac{${bb}}{${cc}}$, $\\tan ${nm.A}=\\frac{${aa}}{${bb}}$ 중 $${FN[ask]} ${nm.A}$를 골라 약분해요.`
        ], { kind: 'ratio', a: aa, b: bb, c: cc, ref: 'A', fn: ask, answer: val.v });
      } else {
        // 빗변 L 이 주어지고 한 변 x 를 구함
        const k = rint(1, 3), L = cc * k, askAdj = Math.random() < 0.5;
        const ans = askAdj ? vi(bb * k) : vi(aa * k);
        const oth = askAdj ? aa : bb, mine = askAdj ? bb : aa;
        const wr = [[vi(oth * k), '대변과 이웃변이 바뀌었어요.'], [vi(L), '빗변의 길이예요. 구하는 변이 아니에요.'], [vi(aa * k + bb * k), '두 변의 합이에요.'], [vmul(vi(L), vdiv(vi(cc), vi(mine))), '비를 거꾸로 적용했어요. 곱해야 할 것을 나누었어요.']];
        const side = { c: { t: String(L), c: 'sky' } };
        side[askAdj ? 'b' : 'a'] = { t: 'x', c: 'amber', size: 21 };
        q = {
          tag: '삼각비 하나로 변의 길이 구하기', key: ['r12', 'len', fn, askAdj, t.join(','), k, nm.A + nm.B + nm.C, mirror].join('|'),
          stem: `$\\angle ${nm.C}=90^{\\circ}$인 직각삼각형 ${triName(nm)}에서 $${gtex}$, $${sideTex(nm, 'c')}=${L}$일 때, $${sideTex(nm, askAdj ? 'b' : 'a')}$의 길이는?`,
          choices: mkChoices(ans, wr),
          fig: { a: aa, b: bb, mirror, rot: 0, names: nm, side, angA: { t: '', c: 'amber' }, notes: [{ t: gcan, c: 'sky' }] },
          given: [String(L), gcan]
        };
        q.fig.reference = 'A'; q.fig.solutionSide = { a: String(aa * k), b: String(bb * k), c: String(L) };
        checkQ(q, [
          `주어진 비는 $${gtex}$이고 빗변 $${sideTex(nm, 'c')}=${L}$입니다. 기준각은 $${nm.A}$입니다.`,
          `주어진 비와 피타고라스 정리로 대변 : 이웃변 : 빗변 $=${aa}:${bb}:${cc}$입니다.`,
          `빗변이 $${cc}$에서 $${L}$로 $${k}$배가 되었으므로 같은 삼각형의 다른 변도 $${k}$배가 됩니다.`,
          `구하는 $${sideTex(nm, askAdj ? 'b' : 'a')}$는 ${askAdj ? '이웃변' : '대변'}이므로 $x=${L}\\times\\frac{${mine}}{${cc}}$를 계산해요.`
        ], { kind: 'ratio-length', a: aa * k, b: bb * k, c: L, ask: askAdj ? 'b' : 'a', answer: ans.v });
        // tan 이 주어지고 빗변이 주어지는 경우도 같은 삼각형(두 비는 같은 각) — 정답은 위에서 정수
      }
      return checkQ(q);
    },
    pdraw: (b, q, C) => pdrawRT(b, q.fig, C)
  };

  /* ====================================================================== 4. ∠A 가 공통인 닮은 직각삼각형 */
  // 점: A(원점), 땅 위 B D F, 반직선 위 C E G
  function nest(s) {
    const us = [Math.round(s.t13u1), Math.round(s.t13u2), Math.round(s.t13u3)].sort((x, y) => x - y);
    if (us[1] <= us[0]) us[1] = us[0] + 1;
    if (us[2] <= us[1]) us[2] = us[1] + 1;
    return nestOf(clamp(s.t13t, 15, 75), us);
  }
  function nestOf(th, us) {
    const t = Math.tan(th * DEG), A = pt(0, 0);
    const feet = us.map((u) => pt(u, 0)), tops = us.map((u) => pt(u, -u * t));
    const hyp = us.map((u) => u / Math.cos(th * DEG)), leg = us.map((u) => u * t);
    return { th, us, A, feet, tops, hyp, leg, s: Math.sin(th * DEG), c: Math.cos(th * DEG), t };
  }
  const NN = [['B', 'C'], ['D', 'E'], ['F', 'G']];
  function drawNest(b, N, o = {}) {
    const { A, feet, tops } = N, st = o.step == null ? 99 : o.step;
    const xmax = N.us[2];
    fit(b, bboxOf([A, feet[2], tops[2]]), { t: 44, b: 52 + (o.rows ? o.rows.length * 26 : 0) + toolbarBottomPad(b), l: 52, r: 54 });
    const cols = ['sky', 'green', 'rose'];
    if (st >= 1) { fillPoly(b, [A, feet[0], tops[0]], cols[0], 0.2); fillPoly(b, [feet[0], feet[1], tops[1], tops[0]], cols[1], 0.16); fillPoly(b, [feet[1], feet[2], tops[2], tops[1]], cols[2], 0.14); }
    line(b, A, feet[2], 'ink', 3.4); line(b, A, tops[2], 'ink', 3.4);
    for (let i = 0; i < 3; i++) {
      line(b, feet[i], tops[i], 'ink', 3);
      ang(b, feet[i], A, tops[i], { color: 'ink', r: 22 });
      b.point(feet[i], { color: 'ink', r: 4.5 }); b.point(tops[i], { color: 'ink', r: 4.5 });
      tagOut(b, feet[i], pt(feet[i].x, -50), NN[i][0], { size: 17, gap: 11 });
      tagOut(b, tops[i], pt(tops[i].x - 3, tops[i].y + 3), NN[i][1], { size: 17, gap: 11 });
      if (o.sideLabels) sideTag(b, feet[i], tops[i], A, o.sideLabels[i], { color: cols[i], size: 16, gap: 10 });
    }
    b.point(A, { color: 'ink', r: 4.5 }); tagOut(b, A, pt(5, -4), 'A', { size: 17, gap: 11 });
    ang(b, A, feet[2], tops[2], { color: 'amber', label: o.angLabel, r: 34, size: 16 });
    (o.rows || []).forEach((r, i) => T(b, pt(xmax / 2, 0), r.t, { dy: 50 + i * 26, size: 16, color: r.c }));
    return cols;
  }
  const r13 = {
    id: 'r1-3', title: '∠A가 공통인 닮은 직각삼각형', short: '공통각 닮음',
    question: '크기가 다른 직각삼각형이 ∠A를 공통으로 가지면 sin A의 값도 같을까? 세 삼각형의 비를 비교해 보자.',
    ctl: ['t13t', 't13u1', 't13u2', 't13u3'],
    init: (s) => { s.t13t = 35; s.t13u1 = 3; s.t13u2 = 6; s.t13u3 = 9; },
    model: (s) => { const N = nest(s); N.val = { s: N.s, c: N.c, t: N.t }; return N; },
    draw(b, s, M, C) {
      const st = C.step;
      // Keep the full drawing area for the nested triangles. The ratio chains
      // remain in the readout cards directly below, including on mobile.
      drawNest(b, M, { step: st, angLabel: `${fmtN(M.th)}°`, sideLabels: st >= 2 || st === 99 ? M.leg.map((v) => G.decS(v, 1)) : null });
    },
    steps: (M) => [
      '세 직각삼각형 $\\triangle ABC$, $\\triangle ADE$, $\\triangle AFG$ 는 $\\angle A$ 가 공통이고 직각도 같아요. 두 각이 같으므로 서로 닮음이에요.',
      '닮은 도형은 대응하는 변의 비가 같아요. 예를 들어 $\\frac{BC}{AC}=\\frac{DE}{AE}=\\frac{FG}{AG}$ 예요.',
      '$\\sin A$, $\\cos A$, $\\tan A$ 는 어느 삼각형으로 구해도 같아요. 삼각비는 각의 크기에만 달라져요.'
    ],
    view: (M) => ({
      guide: '<b>각 A</b>와 세 삼각형의 크기를 바꿔 보세요. 삼각형의 크기가 달라도 $\\sin A$, $\\cos A$, $\\tan A$ 는 변하지 않아요. 세로 길이는 각 세로변 옆의 숫자로 확인해요.',
      readouts: [rd('$\\sin A$', G.decS(M.s, 4), 'rose', `$\\frac{BC}{AC}=\\frac{DE}{AE}=\\frac{FG}{AG}$`), rd('$\\cos A$', G.decS(M.c, 4), 'sky', '$\\frac{AB}{AC}=\\frac{AD}{AE}=\\frac{AF}{AG}$'), rd('$\\tan A$', G.decS(M.t, 4), 'green', '$\\frac{BC}{AB}=\\frac{DE}{AD}=\\frac{FG}{AF}$')],
      rule: '$\\angle A$ 가 같으면 직각삼각형의 크기와 관계없이 삼각비의 값은 같다',
      notes: notes('삼각비는 변의 길이가 아니라 <b>변의 비</b>예요. 큰 삼각형도 작은 삼각형도 비는 같아요.', '$\\sin A=\\frac{BC}{AC}$ 처럼 같은 삼각형의 변끼리 짝을 지어야 해요. $\\frac{BC}{AE}$ 는 sin A 가 아니에요.')
    }),
    gen: () => {
      const th = pick([25, 30, 35, 40, 50, 55, 60]), us = pick([[3, 6, 9], [2, 5, 8], [4, 6, 10], [3, 7, 11], [2, 4, 9]]);
      const N = nestOf(th, us);
      const T3 = [['B', 'C'], ['D', 'E'], ['F', 'G']];
      const fr = (n, d) => `$\\frac{\\overline{${n}}}{\\overline{${d}}}$`;
      const trueS = [];
      T3.forEach(([f, t0]) => {
        trueS.push({ h: `$\\sin A=\\frac{\\overline{${f}${t0}}}{\\overline{A${t0}}}$` }, { h: `$\\cos A=\\frac{\\overline{A${f}}}{\\overline{A${t0}}}$` }, { h: `$\\tan A=\\frac{\\overline{${f}${t0}}}{\\overline{A${f}}}$` });
      });
      const falseS = [];
      T3.forEach(([f, t0]) => {
        falseS.push({ h: `$\\sin A=\\frac{\\overline{A${f}}}{\\overline{A${t0}}}$` }, { h: `$\\cos A=\\frac{\\overline{${f}${t0}}}{\\overline{A${t0}}}$` }, { h: `$\\tan A=\\frac{\\overline{A${f}}}{\\overline{${f}${t0}}}$` }, { h: `$\\sin A=\\frac{\\overline{${f}${t0}}}{\\overline{A${f}}}$` });
      });
      // 서로 다른 삼각형의 변을 섞은 것(크기가 달라 값이 달라짐)
      falseS.push({ h: '$\\sin A=\\frac{\\overline{BC}}{\\overline{AE}}$' }, { h: '$\\cos A=\\frac{\\overline{AB}}{\\overline{AG}}$' }, { h: '$\\sin A=\\frac{\\overline{FG}}{\\overline{AC}}$' }, { h: '$\\tan A=\\frac{\\overline{DE}}{\\overline{AB}}$' });
      const askWrong = Math.random() < 0.5;
      const hintBad = '삼각비는 같은 삼각형의 대변·이웃변·빗변을 바르게 짝지어야 해요.';
      let items;
      if (askWrong) { const f = pick(falseS); items = [{ ...f, ok: true, hint: '' }, ...sample(trueS, 4).map((x) => ({ ...x, ok: false, hint: '이 식은 옳아요. 옳지 않은 것을 찾아요.' }))]; }
      else { const t0 = pick(trueS); items = [{ ...t0, ok: true, hint: '' }, ...sample(falseS, 4).map((x) => ({ ...x, ok: false, hint: hintBad }))]; }
      const q = {
        tag: '공통각을 가진 직각삼각형', key: ['r13', th, us.join(','), askWrong, items.map((x) => x.h).join('')].join('|'),
        stem: `그림과 같이 $\\angle B=\\angle D=\\angle F=90^{\\circ}$ 인 세 직각삼각형 $ABC$, $ADE$, $AFG$ 가 $\\angle A$ 를 공통으로 가질 때, 다음 중 ${askWrong ? '옳지 않은 것' : '옳은 것'}은?`,
        choices: mkTextChoices(items, 'r13' + th + us.join('') + askWrong + items.map((x) => x.h).join('')), wide: true,
        fig: { th, us }, given: []
      };
      return checkQ(q, [
        '세 삼각형은 직각을 하나씩 갖고 $\\angle A$를 공유하므로 AA 닮음입니다.',
        '같은 삼각형 안에서 대변은 $BC,DE,FG$, 이웃변은 $AB,AD,AF$, 빗변은 $AC,AE,AG$입니다. 각 열의 대응 순서를 지켜요.',
        '$\\sin A=\\frac{BC}{AC}=\\frac{DE}{AE}=\\frac{FG}{AG}$, $\\cos A=\\frac{AB}{AC}=\\frac{AD}{AE}=\\frac{AF}{AG}$입니다.',
        `$\\tan A=\\frac{BC}{AB}=\\frac{DE}{AD}=\\frac{FG}{AF}$입니다. 서로 다른 크기의 삼각형에서 분자와 분모를 하나씩 섞지 않으며, 이번 문제는 ${askWrong ? '옳지 않은' : '옳은'} 식을 고릅니다.`
      ], { kind: 'nested', askWrong, angle: th, lengths: us });
    },
    pdraw: (b, q, C) => drawNest(b, nestOf(q.fig.th, q.fig.us), { step: C.review ? C.step - 1 : 0 })
  };

  /* ====================================================================== 5. 빗변에 수선을 내린 닮은 삼각형 */
  // ∠A=90°, A 위, B 왼쪽 아래, C 오른쪽 아래, H 는 BC 위의 수선의 발
  function sim(p, q) {
    const r = Math.hypot(p, q), B = pt(0, 0), C = pt(r, 0), cb = p / r, sb = q / r;
    // AB=p, AC=q, ∠B: cos B = AB/BC = p/r
    const A = pt(p * cb, -p * (q / r)), H = pt(p * cb, 0);
    return { p, q, r, A, B, C, H };
  }
  function drawSim(b, S, o = {}) {
    const { A, B, C, H } = S, st = o.step == null ? 99 : o.step, cen = G.centroid([A, B, C]);
    fit(b, bboxOf([A, B, C]), { t: 44, b: 52 + (o.rows ? o.rows.length * 26 : 0), l: 52, r: 52 });
    if (st >= 1) { fillPoly(b, [A, B, H], 'sky', 0.14); fillPoly(b, [A, H, C], 'rose', 0.14); }
    poly(b, [A, B, C], 'ink', 3.4);
    if (st >= 1) line(b, A, H, 'violet', 3.4, { dash: dashed });
    ang(b, A, B, C, { color: 'ink', r: 22 });
    if (st >= 1) ang(b, H, A, C, { color: 'violet', r: 18 });
    // ∠B (한 겹) = ∠HAC , ∠C (두 겹) = ∠BAH
    if (st >= 2 || st === 99) {
      ang(b, B, C, A, { color: 'sky', rings: 1, r: 34, label: o.labB, size: 16 });
      ang(b, A, H, C, { color: 'sky', rings: 1, r: 26 });
      ang(b, C, A, B, { color: 'rose', rings: 2, r: 36, label: o.labC, size: 16 });
      ang(b, A, B, H, { color: 'rose', rings: 2, r: 32 });
    }
    [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    if (st >= 1) { b.point(H, { color: 'violet', r: 4 }); T(b, H, 'H', { dy: 22, size: 17, color: 'violet' }); }
    if (o.side) {
      if (o.side.AB) sideTag(b, A, B, cen, o.side.AB.t, { color: o.side.AB.c || 'sky', size: 16 });
      if (o.side.AC) sideTag(b, A, C, cen, o.side.AC.t, { color: o.side.AC.c || 'sky', size: 16 });
      if (o.side.BC) sideTag(b, B, C, cen, o.side.BC.t, { color: o.side.BC.c || 'green', size: 16, flip: false });
      if (o.side.AH) T(b, mid(A, H), o.side.AH.t, { dx: 22, size: 16, color: o.side.AH.c || 'violet' });
    }
    (o.rows || []).forEach((r, i) => T(b, pt((B.x + C.x) / 2, 0), r.t, { dy: 54 + i * 26, size: 16, color: r.c }));
  }
  const simR = {
    id: 'simRightTri', title: '빗변에 수선을 내린 닮은 삼각형', short: '수선과 닮음',
    question: '∠A=90°인 삼각형의 빗변에 수선 AH를 그으면 닮은 직각삼각형 세 개가 생긴다. 같은 각을 찾아 삼각비를 바꿔 쓸 수 있을까?',
    ctl: ['t15p', 't15q'],
    init: (s) => { s.t15p = 6; s.t15q = 8; },
    model: (s) => {
      const p = Math.round(s.t15p), q = Math.round(s.t15q), a = vi(p), b = vi(q), V = rtVals(a, b), S = sim(p, q);
      const r = V.c; const ah = vdiv(vmul(a, b), r), bh = vdiv(vpow2(a), r), ch = vdiv(vpow2(b), r);
      return { p, q, S, r, ah, bh, ch, sB: vdiv(b, r), cB: vdiv(a, r), tB: vdiv(b, a), sC: vdiv(a, r), cC: vdiv(b, r), tC: vdiv(a, b), a, b };
    },
    draw(b, s, M, C) {
      const st = C.step, rows = st >= 3 || st === 99 ? [{ t: `sin B = \\frac{AC}{BC} = \\frac{AH}{AB} = ${vcan(M.sB)}`, c: 'sky' }, { t: `sin C = \\frac{AB}{BC} = \\frac{AH}{AC} = ${vcan(M.sC)}`, c: 'rose' }] : [];
      drawSim(b, M.S, { step: st, rows, labB: '∠B', labC: '∠C', side: { AB: { t: String(M.p), c: 'sky' }, AC: { t: String(M.q), c: 'rose' }, BC: { t: vcan(M.r), c: 'green' }, AH: st >= 1 ? { t: vcan(M.ah) } : null } });
    },
    steps: (M) => [
      '$\\angle A=90^{\\circ}$ 인 $\\triangle ABC$ 의 빗변 $BC$ 에 수선 $AH$ 를 그으면, 직각삼각형 $ABC$, $HBA$, $HAC$ 가 생겨요.',
      '세 삼각형은 모두 닮음이에요. $\\angle B=\\angle HAC$ (한 겹 호), $\\angle C=\\angle BAH$ (두 겹 호)',
      `같은 각의 삼각비는 어느 삼각형에서 구해도 같아요. $\\sin B=\\frac{AC}{BC}=\\frac{AH}{AB}=${vtex(M.sB)}$`,
      `$\\angle BAH=\\angle C$ 이므로 $\\sin(\\angle BAH)=\\sin C=\\frac{AB}{BC}=${vtex(M.sC)}$`
    ],
    view: (M) => ({
      guide: '<b>AB</b>와 <b>AC</b>를 바꿔 보세요. 보라 점선 AH를 그으면 같은 각이 두 쌍 생겨요(한 겹 호끼리, 두 겹 호끼리).',
      readouts: [rd('$\\sin B$', `$${vtex(M.sB)}$`, 'sky', '$\\angle HAC$ 와 같아요'), rd('$\\sin C$', `$${vtex(M.sC)}$`, 'rose', '$\\angle BAH$ 와 같아요'), rd('$AH$', `$${vtex(M.ah)}$`, 'violet')],
      rule: '빗변에 수선을 그으면 닮은 직각삼각형 셋 → 같은 각끼리 삼각비를 바꿔 쓴다',
      notes: notes('$\\angle BAH$ 는 $\\angle B$ 가 아니라 $\\angle C$ 와 같아요. 맞꼭지가 아니라 <b>닮음</b>에서 나온 각이에요.')
    }),
    gen: () => {
      const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [4, 3, 5], [12, 5, 13], [9, 12, 15]]);
      const p = t[0], q = t[1], a = vi(p), b = vi(q), V = rtVals(a, b), fn = pick(['s', 'c', 't']), x = pick(['BAH', 'HAC']);
      // ∠BAH = ∠C , ∠HAC = ∠B
      const val = x === 'BAH' ? { s: V.cB, c: V.cA, t: V.tB } : null;
      // 직접: ∠C : sin=AB/BC=p/r, cos=AC/BC=q/r, tan=AB/AC=p/q ; ∠B : sin=q/r, cos=p/r, tan=q/p
      const C0 = { s: vdiv(a, V.c), c: vdiv(b, V.c), t: vdiv(a, b) }, B0 = { s: vdiv(b, V.c), c: vdiv(a, V.c), t: vdiv(b, a) };
      const mine = x === 'BAH' ? C0 : B0, other = x === 'BAH' ? B0 : C0, ans = mine[fn];
      const wr = [[other[fn], '$\\angle BAH$ 와 $\\angle HAC$ 를 바꾸었어요. 닮음에서 같은 각을 다시 찾아요.']];
      ['s', 'c', 't'].forEach((k) => { if (k !== fn) wr.push([mine[k], '다른 삼각비예요.']); });
      wr.push([vdiv(vi(1), ans), '분자와 분모를 거꾸로 썼어요.']);
      const S = sim(p, q);
      const q0 = {
        tag: '닮은 삼각형으로 삼각비 바꾸기', key: ['sim', fn, x, p, q].join('|'),
        stem: `그림과 같이 $\\angle A=90^{\\circ}$ 인 직각삼각형 $ABC$ 의 꼭짓점 $A$ 에서 빗변 $BC$ 에 내린 수선의 발을 $H$ 라 하자. $\\overline{AB}=${p}$, $\\overline{AC}=${q}$ 이고 $\\angle ${x[0]}${x[1]}${x[2]}=x$ 일 때, $${FN[fn]} x$ 의 값은?`,
        choices: mkChoices(ans, wr),
        fig: { p, q, x }, given: [String(p), String(q)]
      };
      return checkQ(q0, [
        `직각삼각형 $ABC$에서 $AB=${p}$, $AC=${q}$이고, $AH$는 빗변에 내린 수선입니다. 구하는 기준각은 $\\angle ${x}=x$입니다.`,
        `$\\angle ${x}=\\angle ${x === 'BAH' ? 'C' : 'B'}$입니다. 직각삼각형의 두 예각의 합이 $90^{\\circ}$이므로 같은 각을 찾을 수 있어요.`,
        `피타고라스 정리로 $BC=\\sqrt{${p}^2+${q}^2}=${vtex(V.c)}$입니다.`,
        `$${FN[fn]} x=${FN[fn]} ${x === 'BAH' ? 'C' : 'B'}$이므로 큰 삼각형의 ${fn === 's' ? '대변과 빗변' : fn === 'c' ? '이웃변과 빗변' : '대변과 이웃변'}의 비를 이용해요.`
      ], { kind: 'altitude-ratio', p, q, ref: x, fn, answer: ans.v });
    },
    pdraw: (b, qq, C) => {
      const f = qq.fig, S = sim(f.p, f.q);
      drawSim(b, S, { step: C.review ? Math.min(C.step, 2) : 1, side: { AB: { t: String(f.p), c: 'sky' }, AC: { t: String(f.q), c: 'sky' } } });
      // x 표시: ∠BAH 또는 ∠HAC (주황 호 + x)
      if (f.x === 'BAH') ang(b, S.A, S.B, S.H, { color: 'amber', r: 38, label: 'x', size: 20, labelDist: 56 });
      else ang(b, S.A, S.H, S.C, { color: 'amber', r: 38, label: 'x', size: 20, labelDist: 56 });
    }
  };

  /* ====================================================================== 6. 기울어진 직각삼각형 */
  const r14 = {
    id: 'r1-4', title: '기울어진 직각삼각형', short: '기울어진 삼각형',
    question: '삼각형을 돌려 놓아도 대변·이웃변·빗변은 그대로일까? 기준각과 직각의 위치로 변의 이름을 찾아 보자.',
    ctl: ['t16a', 't16b', 't16r'],
    presets: () => [{ group: '기준각', label: '∠A', apply: (s) => { s.t14base = 'A'; }, on: (s) => s.t14base !== 'B' }, { label: '∠B', apply: (s) => { s.t14base = 'B'; }, on: (s) => s.t14base === 'B' }],
    init: (s) => { s.t16a = 3; s.t16b = 4; s.t16r = 40; s.t14base = 'A'; },
    model: (s) => { const a = vi(Math.round(s.t16a)), b = vi(Math.round(s.t16b)), V = rtVals(a, b); V.base = s.t14base === 'B' ? 'B' : 'A'; V.rot = s.t16r; V.deg = degOf(a.v, b.v); return V; },
    draw(b, s, M, C) {
      const base = M.base, v = base === 'A' ? { s: M.sA, c: M.cA, t: M.tA } : { s: M.sB, c: M.cB, t: M.tB };
      const nu = base === 'A' ? ['a', 'b'] : ['b', 'a'];
      const rows = [ratioRow('sin', base, nu[0], 'c', v.s, 'rose'), ratioRow('cos', base, nu[1], 'c', v.c, 'sky'), ratioRow('tan', base, nu[0], nu[1], v.t, 'green')];
      drawBase(b, M, C, { base, rot: M.rot, rows, rowStep: 3, roleStep: 2, angA: '', angB: '' });
    },
    steps: (M) => [
      `직각삼각형을 돌려 놓았어요. 먼저 직각( $\\angle C=90^{\\circ}$ )의 위치를 찾아요. 직각의 맞은편 변이 빗변 $c$ 예요.`,
      `기준각 $\\angle ${M.base}$ 를 찾아요. 기준각의 맞은편 변이 대변, 기준각에 이웃한 변(빗변이 아닌 것)이 이웃변이에요.`,
      `$\\sin ${M.base}=\\frac{\\text{대변}}{\\text{빗변}}$, $\\cos ${M.base}=\\frac{\\text{이웃변}}{\\text{빗변}}$, $\\tan ${M.base}=\\frac{\\text{대변}}{\\text{이웃변}}$`
    ],
    view: (M) => ({
      guide: '<b>돌리기</b> 막대로 삼각형을 제자리에서 돌려 보세요. 칩으로 기준각을 ∠A와 ∠B로 바꾸면 대변과 이웃변의 색이 서로 바뀌어요.',
      readouts: [rd('빗변', '직각의 맞은편', 'green'), rd('대변', '기준각의 맞은편', 'rose'), rd('이웃변', '기준각에 이웃한 변', 'sky')],
      rule: '삼각형이 기울어져 있어도 → 직각의 맞은편이 빗변 → 기준각의 맞은편이 대변',
      notes: notes('가로·세로로 놓인 변이 대변·이웃변이라고 정해져 있지 않아요. 기준각이 어디인지로 정해져요.')
    }),
    gen: (prev) => ratioProblem(prev, true, 'r14'),
    pdraw: (b, q, C) => pdrawRT(b, q.fig, C)
  };

  G.register(10, 't1', '① 삼각비의 뜻', '삼각비의 뜻', PARAMS, [r11, swap, r12, r13, simR, r14]);
})();
