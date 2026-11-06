/* ==========================================================================
   중3 · 삼각비 — 탭 ⑦ 「사각형의 넓이」 (t7.js, order 70) — 장면 5개
   · quadUnfold2x 대각선으로 넓이 ½pq sin θ   · paraArea 평행사변형 ab sin θ   · rhombusSquare 마름모
   · quadDiagHalf 두 대각선과 사잇각   · quadSplitSum 대각선으로 나누어 넓이의 합
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const { clamp, pt, mid, T, tagOut, ang, sideTag, tick, line, poly, fillPoly, fit, P, rd, notes, dashed, rint, pick, sample, bboxOf, DEG, centroid, lerp, projOn,
    vi, vsq, vf, vadd, vsub, vmul, vdiv, vsqrt, vpow2, vsame, vtex, vcan, sinD, cosD, tanS, mkChoices, checkQ, fmtN, decS } = G;

  const PARAMS = {
    t71p: P('대각선 p (AC)', 3, 12, 1, 8, { color: 'sky' }),
    t71q: P('대각선 q (BD)', 3, 12, 1, 6, { color: 'green' }),
    t71t: P('두 대각선이 이루는 각 θ', 30, 150, 15, 60, { color: 'amber', format: G.degF }),
    t71k: P('2배 평행사변형', 0, 1, 0.01, 0, { color: 'amber', format: (v) => Math.round(v * 100) + '%', hint: '▶를 누르거나 막대를 끌면 나타나요' }),
    t71x: P('두 대각선이 만나는 위치', 0.25, 0.75, 0.05, 0.5, { color: 'violet', format: (v) => `AC를 ${Math.round(v * 100)}% 지점`, hint: '교점 P를 가로로 끌어도 돼요' }),
    t72a: P('변 AB = a', 2, 12, 1, 8, { color: 'sky' }),
    t72b: P('변 AD = b', 2, 12, 1, 5, { color: 'green' }),
    t72t: P('각 θ', 30, 150, 15, 60, { color: 'amber', format: G.degF }),
    t73a: P('한 변 a', 2, 12, 1, 6, { color: 'sky' }),
    t74p: P('BD = p', 4, 14, 1, 8, { color: 'sky' }),
    t74a: P('BA = a', 2, 10, 1, 6, { color: 'green' }),
    t74c: P('BC = c', 2, 10, 1, 4, { color: 'rose' }),
    t74b: P('∠ABD = β', 30, 150, 15, 60, { color: 'amber', format: G.degF }),
    t74d: P('∠CBD = δ', 30, 150, 15, 45, { color: 'violet', format: G.degF })
  };
  const vv = (v) => (v.x ? vcan(v) : '≈' + decS(v.v, 2));
  const TH = [30, 45, 60, 90, 120, 135, 150];

  /* ---- 두 대각선으로 만든 사각형 ---- */
  // P 원점, AC 가로(길이 p, P 가 A 에서 t 지점), BD 는 θ 방향(P 에서 위쪽으로 길이 q·u, 아래쪽 q(1−u))
  function diagGeo(p, q, th, t, u = 0.45) {
    const d = pt(Math.cos(th * DEG), -Math.sin(th * DEG));
    return { P: pt(0, 0), A: pt(-t * p, 0), C: pt((1 - t) * p, 0), B: pt(d.x * q * u, d.y * q * u), D: pt(-d.x * q * (1 - u), -d.y * q * (1 - u)) };
  }
  function drawDiag(b, g, o = {}) {
    const { A, B, C, D, P: Pp } = g, st = o.step == null ? 99 : o.step, cen = centroid([A, B, C, D]);
    // 평행사변형(2배)
    const wide = [pt(A.x + (B.x - Pp.x), A.y + (B.y - Pp.y)), pt(C.x + (B.x - Pp.x), C.y + (B.y - Pp.y)), pt(C.x + (D.x - Pp.x), C.y + (D.y - Pp.y)), pt(A.x + (D.x - Pp.x), A.y + (D.y - Pp.y))];
    const k2 = o.k2 || 0;
    const rowsD = [...(o.th ? [{ t: `두 대각선이 이루는 각 = ${o.th}`, c: 'amber' }] : []), ...(o.rows || [])];
    const visible = [A, B, C, D, ...(o.reserveWide || k2 > 0 ? wide : [])];
    fit(b, bboxOf(visible), { t: 54, b: 58 + rowsD.length * 26, l: 56, r: 56 });
    if (k2 > 0) { b.path(wide, { close: true, color: 'amber', width: 2.6, fill: 'amber', fillAlpha: 0.1 * k2, alpha: k2, dash: dashed }); }
    fillPoly(b, [A, B, C, D], 'sky', 0.12); poly(b, [A, B, C, D], 'ink', 3.4);
    line(b, A, C, 'violet', 3, { dash: dashed }); line(b, B, D, 'violet', 3, { dash: dashed });
    ang(b, Pp, C, B, { color: 'amber', r: 28 });
    [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    if (o.handle) b.handle('P', Pp, { color: 'violet', r: 8, ariaLabel: '교점 P 끌기', drag: o.handle }); else b.point(Pp, { color: 'violet', r: 4.5 });
    if (o.p) T(b, lerp(A, C, 0.28), o.p, { dy: 20, size: 16, color: 'sky' });
    if (o.q) T(b, lerp(B, D, /= x$/.test(o.q) ? 0.64 : 0.18), o.q, { dx: 14, dy: /= x$/.test(o.q) ? 6 : -4, size: /= x$/.test(o.q) ? 20 : 16, color: /= x$/.test(o.q) ? 'amber' : 'green', align: 'left' });
    rowsD.forEach((r, i) => T(b, pt(0, Math.max(...visible.map((w) => w.y))), r.t, { dy: 44 + i * 26, size: r.size || 16, color: r.c }));
  }
  const diagM = (p, q, th) => { const S = vdiv(vmul(vi(p * q), sinD(th)), vi(2)); return { p, q, th, S, dbl: vmul(vi(p * q), sinD(th)) }; };

  const uf = {
    id: 'quadUnfold2x', title: '[핵심] 두 대각선과 끼인각으로 사각형의 넓이 구하기', short: '대각선으로 넓이',
    question: '대각선의 길이가 p, q이고 두 대각선이 이루는 각이 θ인 사각형의 넓이는? 각 꼭짓점에서 대각선에 평행선을 그어 평행사변형을 만들어 보자.',
    ctl: ['t71p', 't71q', 't71t', 't71k'], anim: { key: 't71k', dur: 3, label: '2배 평행사변형 만들기', start: 0 }, stepT: (n) => (n >= 2 ? 1 : 0),
    init: (s) => { s.t71p = 8; s.t71q = 6; s.t71t = 60; s.t71k = 0; },
    model: (s) => ({ ...diagM(Math.round(s.t71p), Math.round(s.t71q), Math.round(s.t71t)), k: s.t71k }),
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99;
      drawDiag(b, diagGeo(M.p, M.q, M.th, 0.5), { step: st, k2: C.t, reserveWide: true, th: `${M.th}°`, p: `p = ${M.p}`, q: `q = ${M.q}`, rows: show(3) ? [{ t: `S = \\frac{1}{2} × ${M.p} × ${M.q} × sin ${M.th}° = ${vv(M.S)}`, c: 'amber' }] : [] });
    },
    steps: (M) => [
      '사각형 $ABCD$ 의 네 꼭짓점에서 각각 다른 대각선에 평행한 직선을 그어요. 겹치는 부분 없이 평행사변형이 만들어져요. 이 평행사변형의 넓이는 사각형의 <b>2배</b>예요.',
      `평행사변형의 두 이웃한 변은 $p=${M.p}$, $q=${M.q}$ 이고 끼인각이 $\\theta=${M.th}^{\\circ}$ 이므로 넓이는 $pq\\sin\\theta=${vtex(M.dbl)}$ 예요.`,
      `사각형의 넓이는 그 반이에요. $S=\\frac{1}{2}pq\\sin\\theta=${vtex(M.S)}$ ${M.S.x ? '' : '(근삿값)'}`
    ],
    view: (M) => ({
      guide: '<b>p, q, θ</b>를 바꾸고 ▶를 눌러 보세요. 노란 점선 평행사변형이 사각형 ABCD의 <b>2배</b> 넓이예요. 그래서 사각형의 넓이는 $\\frac{1}{2}pq\\sin\\theta$ 예요.',
      readouts: [rd('평행사변형(2배)', `$${vtex(M.dbl)}$`, 'amber', '$pq\\sin\\theta$'), rd('사각형의 넓이 $S$', `$${vtex(M.S)}$`, 'sky', '$\\frac{1}{2}pq\\sin\\theta$')],
      rule: '두 대각선의 길이가 $p$, $q$ 이고 이루는 각이 $\\theta$ 인 사각형의 넓이 $S=\\frac{1}{2}pq\\sin\\theta$',
      notes: notes('$\\theta$ 는 두 대각선이 이루는 각이에요. 두 변이 이루는 각이 아니에요.', '$\\theta$ 가 예각이든 둔각이든 $\\sin\\theta=\\sin(180^{\\circ}-\\theta)$ 라 넓이는 같아요.')
    }),
    gen: () => diagProblem('uf', false),
    pdraw: (b, q, C) => diagPdraw(b, q, C)
  };
  function diagProblem(tag, askQ) {
    const th = pick(TH), p = pick([4, 6, 8, 10, 12]), q = pick([3, 4, 5, 6, 8]);
    if (!askQ) {
      const S = diagM(p, q, th).S, bc = vi(p * q);
      const wr = [[vmul(bc, sinD(th)), '$\\frac{1}{2}$ 을 곱하지 않았어요.'], [vdiv(vmul(bc, cosD(th)), vi(2)), '$\\sin$ 대신 $\\cos$ 을 썼어요.'], [vdiv(bc, vi(2)), '$\\sin\\theta$ 를 곱하지 않았어요.'], [vdiv(vmul(bc, tanS(th)), vi(2)), '$\\sin$ 대신 $\\tan$ 을 썼어요.'], [vdiv(vmul(bc, sinD(th)), vi(4)), '$\\frac{1}{2}$ 을 두 번 곱했어요.']].filter((w) => w[0].x && !vsame(w[0], S));
      if (vsame(S, vi(p)) || vsame(S, vi(q))) return diagProblem(tag, askQ);
      return checkQ({ tag: '두 대각선으로 사각형의 넓이', key: [tag, th, p, q].join('|'), stem: `사각형 $ABCD$ 에서 두 대각선 $AC$, $BD$ 의 길이가 각각 $${p}$, $${q}$ 이고 두 대각선이 이루는 각의 크기가 $${th}^{\\circ}$ 일 때, 사각형 $ABCD$ 의 넓이는?`, choices: mkChoices(S, wr), fig: { p, q, th, ask: 'area' }, given: [`${p}`, `${q}`, `${th}°`], ans: [vcan(S)] }, diagonalWork(p, q, th, S, false), { kind: 'diagonal-area', p, q, angle: th, answer: S.v });
    }
    const S = diagM(p, q, th).S, bc = vi(p * 1);
    const ans = vi(q), wr = [[vmul(vi(q), vi(2)), '넓이 공식 $S=\\frac{1}{2}pq\\sin\\theta$ 에서 $q$ 를 다시 구해요.'], [vdiv(vi(q), vi(2)), ''], [vmul(vi(q), sinD(th)), ''], [vi(p), ''], [vdiv(vmul(vi(q), vi(p)), vi(2)), '']];
    if (vsame(S, vi(p)) || vsame(S, vi(q)) || p === q) return diagProblem(tag, askQ);
    return checkQ({ tag: '넓이로 대각선의 길이 구하기', key: [tag, 'q', th, p, q].join('|'), stem: `사각형 $ABCD$ 의 두 대각선이 이루는 각의 크기가 $${th}^{\\circ}$ 이고 대각선 $\\overline{AC}=${p}$, 넓이가 $${vtex(S)}$ 일 때, 대각선 $\\overline{BD}$ 의 길이는?`, choices: mkChoices(ans, wr.filter((w) => !vsame(w[0], ans))), fig: { p, q, th, ask: 'q', S: vcan(S) }, given: [`${p}`, `${th}°`, vcan(S)], ans: [`${q}`] }, diagonalWork(p, q, th, S, true), { kind: 'diagonal-side', p, area: S.v, angle: th, answer: q });
  }
  function diagonalWork(p, q, th, S, askQ) {
    return [
      askQ ? `대각선 $AC=${p}$, 두 대각선의 사잇각 $${th}^{\\circ}$, 넓이 $${vtex(S)}$가 주어졌습니다. 구하는 대각선을 $BD=x$라 해요.` : `두 대각선은 $AC=${p}$, $BD=${q}$이고 그 사잇각은 $${th}^{\\circ}$입니다.`,
      '각 꼭짓점에서 다른 대각선에 평행한 선을 그으면 원래 사각형의 넓이의 2배인 평행사변형을 만들 수 있어요.',
      askQ ? `따라서 $${vtex(S)}=\\frac{1}{2}\\times${p}\\times x\\times\\sin ${th}^{\\circ}$입니다.` : `사각형의 넓이는 $S=\\frac{1}{2}\\times${p}\\times${q}\\times\\sin ${th}^{\\circ}$입니다.`,
      askQ ? `$x=\\frac{2\\times${vtex(S)}}{${p}\\times${vtex(sinD(th))}}$를 계산해요.` : `$\\sin ${th}^{\\circ}=${vtex(sinD(th))}$를 대입해요. 이 각은 두 변의 끼인각이 아니라 두 대각선의 사잇각입니다.`
    ];
  }
  function diagPdraw(b, qq, C) {
    const f = qq.fig, rows = f.ask === 'area' ? [{ t: C.last ? `□ABCD의 넓이 = ${qq.ans[0]}` : '□ABCD의 넓이 = x', c: 'amber', size: 18 }] : [{ t: `□ABCD의 넓이 = ${f.S}`, c: 'amber', size: 17 }];
    drawDiag(b, diagGeo(f.p, f.q, f.th, 0.5), { step: C.review ? C.step : 0, k2: C.review && C.step >= 2 ? 1 : 0, th: `${f.th}°`, p: `AC = ${f.p}`, q: f.ask === 'q' && !C.last ? 'BD = x' : `BD = ${f.q}`, rows });
  }

  /* ====================================================================== 평행사변형 */
  function paraGeo(a, b0, th) { const A = pt(0, 0), B = pt(a, 0), D = pt(b0 * Math.cos(th * DEG), -b0 * Math.sin(th * DEG)); return { A, B, D, C: pt(B.x + D.x, D.y) }; }
  function drawPara(b, g, o = {}) {
    const { A, B, C, D } = g, st = o.step == null ? 99 : o.step, cen = centroid([A, B, C, D]), Hh = pt(D.x, 0);
    fit(b, bboxOf([A, B, C, D, Hh]), { t: 54, b: 58 + (o.rows ? o.rows.length * 26 : 0), l: 56, r: 56 });
    fillPoly(b, [A, B, C, D], 'sky', 0.12); poly(b, [A, B, C, D], 'ink', 3.4);
    if (st >= 1) { line(b, D, Hh, 'violet', 3, { dash: dashed }); if (D.x < 0) line(b, Hh, A, 'violet', 2.4, { dash: dashed }); else if (D.x > B.x) line(b, B, Hh, 'violet', 2.4, { dash: dashed }); ang(b, Hh, D, B, { color: 'violet', r: 14 }); }
    ang(b, A, B, D, { color: 'amber', r: 32, label: o.th, size: 16 });
    tick(b, A, B, 1, 'sky'); tick(b, D, C, 1, 'sky'); tick(b, A, D, 2, 'green'); tick(b, B, C, 2, 'green');
    [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    if (o.a) sideTag(b, A, B, cen, o.a, { color: 'sky', size: o.as || 17, flip: false, gap: 22 });
    if (o.b) sideTag(b, A, D, cen, o.b, { color: 'green', size: o.bs || 17 });
    if (o.h && st >= 1) T(b, mid(D, Hh), o.h, { dx: 9, size: 15, color: 'violet', align: 'left' });
    (o.rows || []).forEach((r, i) => T(b, pt(cen.x, Math.max(A.y, B.y)), r.t, { dy: 62 + i * 26, size: r.size || 16, color: r.c }));
  }
  const pa = {
    id: 'paraArea', title: '평행사변형의 넓이 S = ab sin θ', short: '평행사변형 넓이',
    question: '이웃한 두 변이 a, b이고 끼인각이 θ인 평행사변형의 넓이는? 높이를 sin으로 나타내 보자.',
    ctl: ['t72a', 't72b', 't72t'],
    init: (s) => { s.t72a = 8; s.t72b = 5; s.t72t = 60; },
    model: (s) => { const a = Math.round(s.t72a), b0 = Math.round(s.t72b), th = Math.round(s.t72t), h = vmul(vi(b0), sinD(th)), S = vmul(vi(a), h); return { a, b0, th, h, S }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawPara(b, paraGeo(M.a, M.b0, M.th), { step: st, th: `${M.th}°`, a: `${M.a}`, b: `${M.b0}`, h: show(1) ? `h = ${vv(M.h)}` : '', rows: show(2) ? [{ t: `S = ${M.a} × ${vv(M.h)} = ${vv(M.S)}`, c: 'amber' }] : [] }); },
    steps: (M) => [
      `꼭짓점 $D$ 에서 변 $AB$ 에 수선을 내려 높이 $h$ 를 만들어요. $\\triangle AHD$ 에서 $h=b\\sin\\theta=${vtex(M.h)}$ ${M.h.x ? '' : '(근삿값)'}`,
      `(평행사변형의 넓이) = (밑변) × (높이) $=a\\times h=${M.a}\\times${vtex(M.h)}$`,
      `$S=ab\\sin\\theta=${vtex(M.S)}$ ${M.S.x ? '' : '(근삿값)'}`
    ],
    view: (M) => ({
      guide: '<b>두 변</b>과 <b>끼인각 θ</b>를 바꿔 보세요. 보라색 점선이 높이예요. θ가 90°에 가까울수록 넓이가 커져요.',
      readouts: [rd('높이 $h$', `$${vtex(M.h)}$`, 'violet'), rd('넓이 $S$', `$${vtex(M.S)}$`, 'amber', '$ab\\sin\\theta$')],
      rule: '평행사변형의 넓이 $S=ab\\sin\\theta$ ($a$, $b$ 는 이웃한 두 변, $\\theta$ 는 그 끼인각)',
      notes: notes('삼각형의 넓이 $\\frac{1}{2}ab\\sin\\theta$ 의 2배예요. $\\frac{1}{2}$ 이 없어요.', '$\\theta$ 가 둔각이어도 $\\sin\\theta=\\sin(180^{\\circ}-\\theta)$ 로 같은 넓이예요.')
    }),
    gen: function g() {
      const th = pick(TH), a = pick([4, 5, 6, 8, 10]), b0 = pick([2, 3, 4, 5, 6]), kind = pick(['area', 'area', 'side']), S = vmul(vmul(vi(a), vi(b0)), sinD(th)), ab = vi(a * b0);
      if (vsame(S, vi(a)) || vsame(S, vi(b0)) || a === b0) return g();
      let q;
      if (kind === 'area') { const wr = [[vdiv(vmul(ab, sinD(th)), vi(2)), '삼각형의 넓이예요. 평행사변형은 $\\frac{1}{2}$ 을 곱하지 않아요.'], [vmul(ab, cosD(th)), '$\\sin$ 대신 $\\cos$ 을 썼어요.'], [ab, '$\\sin\\theta$ 를 곱하지 않았어요.'], [vmul(ab, tanS(th)), '$\\sin$ 대신 $\\tan$ 을 썼어요.'], [vmul(vmul(vi(a), vi(a)), sinD(th)), '']]; q = { tag: '평행사변형의 넓이', key: ['pa', th, a, b0].join('|'), stem: `평행사변형 $ABCD$ 에서 $\\overline{AB}=${a}$, $\\overline{AD}=${b0}$, $\\angle A=${th}^{\\circ}$ 일 때, 평행사변형 $ABCD$ 의 넓이는?`, choices: mkChoices(S, wr.filter((w) => w[0].x && !vsame(w[0], S))), fig: { a, b0, th, ask: 'area' }, given: [`${a}`, `${b0}`, `${th}°`], ans: [vcan(S)] }; }
      else { const wr = [[vmul(vi(b0), vi(2)), ''], [vdiv(vi(b0), vi(2)), ''], [vdiv(vmul(vi(2), S), vi(a)), '넓이 공식에서 $\\sin\\theta$ 로 나누는 것을 빠뜨렸어요.'], [vi(a), ''], [vmul(vi(b0), sinD(th)), '']]; q = { tag: '평행사변형의 넓이로 변 구하기', key: ['pa', 'side', th, a, b0].join('|'), stem: `평행사변형 $ABCD$ 에서 $\\overline{AB}=${a}$, $\\angle A=${th}^{\\circ}$ 이고 넓이가 $${vtex(S)}$ 일 때, $\\overline{AD}$ 의 길이는?`, choices: mkChoices(vi(b0), wr.filter((w) => !vsame(w[0], vi(b0)))), fig: { a, b0, th, ask: 'side', S: vcan(S) }, given: [`${a}`, `${th}°`, vcan(S)], ans: [`${b0}`] }; }
      q.fig.h = vcan(vmul(vi(b0), sinD(th))); q.fig.area = vcan(S);
      return checkQ(q, [
        kind === 'area' ? `평행사변형의 이웃한 두 변은 $AB=${a}$, $AD=${b0}$, 끼인각은 $${th}^{\\circ}$입니다.` : `평행사변형의 밑변 $AB=${a}$, 끼인각 $${th}^{\\circ}$, 넓이 $${vtex(S)}$가 주어졌습니다. $AD=x$라 해요.`,
        `꼭짓점 $D$에서 직선 $AB$에 수선을 내리면 높이는 $AD\\sin ${th}^{\\circ}$입니다.`,
        kind === 'area' ? `$h=${b0}\\times${vtex(sinD(th))}=${vtex(vmul(vi(b0), sinD(th)))}$입니다.` : `$${vtex(S)}=${a}\\times x\\times${vtex(sinD(th))}$입니다.`,
        kind === 'area' ? `넓이는 $S=${a}\\times${vtex(vmul(vi(b0), sinD(th)))}$입니다. 평행사변형이므로 $\\frac{1}{2}$를 곱하지 않아요.` : `$x=\\frac{${vtex(S)}}{${a}\\times${vtex(sinD(th))}}$를 계산해요.`
      ], { kind: 'parallelogram', base: a, side: b0, angle: th, ask: kind, area: S.v, answer: kind === 'area' ? S.v : b0 });
    },
    pdraw: (b, q, C) => { const f = q.fig; drawPara(b, paraGeo(f.a, f.b0, f.th), { step: C.review ? C.step : 0, th: `${f.th}°`, a: `${f.a}`, b: f.ask === 'side' && !C.last ? 'x' : `${f.b0}`, h: C.review && C.step >= 3 && f.ask === 'area' ? f.h : '', bs: f.ask === 'side' ? 21 : 17, rows: [{ t: f.ask === 'side' ? `□ABCD의 넓이 = ${f.S}` : C.last ? `□ABCD의 넓이 = ${f.area}` : '□ABCD의 넓이 = x', c: 'amber', size: 18 }] }); }
  };

  /* ====================================================================== 마름모 */
  function rhGeo(a, th) { const pL = 2 * a * Math.sin((th / 2) * DEG), qL = 2 * a * Math.cos((th / 2) * DEG), O = pt(0, 0); return { O, A: pt(-qL / 2, 0), C: pt(qL / 2, 0), B: pt(0, -pL / 2), D: pt(0, pL / 2), p: pL, q: qL }; }
  function drawRh(b, a, th, o = {}) {
    const g = rhGeo(a, th), { A, B, C, D, O } = g, cen = O;
    fit(b, bboxOf([A, B, C, D]), { t: 54, b: 58 + (o.rows ? o.rows.length * 26 : 0), l: 56, r: 56 });
    fillPoly(b, [A, B, C, D], 'sky', 0.12); poly(b, [B, C, D, A], 'ink', 3.4);
    if (o.diag !== false) { line(b, A, C, 'violet', 2.6, { dash: dashed }); line(b, B, D, 'violet', 2.6, { dash: dashed }); ang(b, O, C, B, { color: 'ink', r: 14 }); }
    if (o.th) ang(b, A, B, D, { color: 'amber', r: 34, label: o.th, size: 16 });
    [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    [[A, B], [B, C], [C, D], [D, A]].forEach(([p0, q0]) => tick(b, p0, q0, 1, 'sky'));
    if (o.a) sideTag(b, A, B, cen, o.a, { color: 'sky', size: o.as || 17 });
    if (o.p) T(b, mid(B, O), o.p, { dx: 10, size: 16, color: 'violet', align: 'left' });
    if (o.q) T(b, mid(O, C), o.q, { dy: 18, size: 16, color: 'violet' });
    (o.rows || []).forEach((r, i) => T(b, pt(0, D.y), r.t, { dy: 40 + i * 26, size: r.size || 16, color: r.c }));
  }
  const rh = {
    id: 'rhombusSquare', title: '마름모의 넓이 — 한 변과 각, 두 대각선', short: '마름모 넓이',
    question: '한 변이 a이고 한 각이 θ인 마름모의 넓이를 두 가지 방법으로 구해 보자. 같은 값이 나올까?',
    ctl: ['t73a', 't72t'],
    init: (s) => { s.t73a = 6; s.t72t = 60; },
    model: (s) => { const a = Math.round(s.t73a), th = Math.round(s.t72t), S = vmul(vi(a * a), sinD(th)), p = vmul(vi(2 * a), sinD(th / 2)), q = vmul(vi(2 * a), cosD(th / 2)); return { a, th, S, p, q, S2: vdiv(vmul(p, q), vi(2)) }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawRh(b, M.a, M.th, { th: `${M.th}°`, a: `${M.a}`, p: show(2) ? `p = ${vv(M.p)}` : '', q: show(2) ? `q = ${vv(M.q)}` : '', rows: [show(1) ? { t: `S = ${M.a} × ${M.a} × sin ${M.th}° = ${vv(M.S)}`, c: 'amber' } : null, show(3) ? { t: `S = \\frac{1}{2}pq = ${vv(M.S2)}`, c: 'sky' } : null].filter(Boolean) }); },
    steps: (M) => [
      `마름모는 평행사변형이에요. 이웃한 두 변이 모두 $a=${M.a}$ 이므로 $S=a\\times a\\times\\sin ${M.th}^{\\circ}=${vtex(M.S)}$`,
      `두 대각선은 수직으로 만나요. $p=2a\\sin\\frac{\\theta}{2}=${vtex(M.p)}$, $q=2a\\cos\\frac{\\theta}{2}=${vtex(M.q)}$`,
      `$S=\\frac{1}{2}pq=${vtex(M.S2)}$ 로 구해도 같은 값이에요. ($\\theta=90^{\\circ}$ 이면 $\\frac{1}{2}pq\\sin90^{\\circ}$ 와 같아요.)`
    ],
    view: (M) => ({
      guide: '<b>한 변 a</b>와 <b>각 θ</b>를 바꿔 보세요. 마름모의 대각선은 서로 수직이고 서로를 이등분해요. 두 방법으로 구한 넓이가 같아요.',
      readouts: [rd('$a^2\\sin\\theta$', `$${vtex(M.S)}$`, 'amber'), rd('$\\frac{1}{2}pq$', `$${vtex(M.S2)}$`, 'sky')],
      rule: '마름모의 넓이 $S=a^2\\sin\\theta=\\frac{1}{2}pq$',
      notes: notes('마름모는 네 변이 모두 같으므로 평행사변형 공식 $ab\\sin\\theta$ 에서 $b=a$ 예요.', '대각선이 주어지면 $\\frac{1}{2}pq$ 를, 변과 각이 주어지면 $a^2\\sin\\theta$ 를 써요.')
    }),
    gen: function g() {
      const kind = pick(['sa', 'sa', 'pq']);
      if (kind === 'sa') {
        const th = pick(TH), a = pick([2, 3, 4, 5, 6, 8]), S = vmul(vi(a * a), sinD(th));
        if (vsame(S, vi(a))) return g();
        const wr = [[vdiv(S, vi(2)), '마름모는 $\\frac{1}{2}$ 을 곱하지 않아요. ($a^2\\sin\\theta$)'], [vmul(vi(a * a), cosD(th)), '$\\sin$ 대신 $\\cos$ 을 썼어요.'], [vi(a * a), '$\\sin\\theta$ 를 곱하지 않았어요.'], [vmul(vi(a * 2), sinD(th)), '$a$ 를 한 번만 곱했어요.'], [vmul(vi(a * a), tanS(th)), '']].filter((w) => w[0].x && !vsame(w[0], S));
        return checkQ({ tag: '마름모의 넓이', key: ['rh', 'sa', th, a].join('|'), stem: `한 변의 길이가 $${a}$ 이고 한 내각의 크기가 $${th}^{\\circ}$ 인 마름모 $ABCD$ 의 넓이는?`, choices: mkChoices(S, wr), fig: { a, th, ask: 'sa' }, given: [`${a}`, `${th}°`], ans: [vcan(S)] }, [
          `마름모의 네 변은 모두 $${a}$이고, 한 내각은 $${th}^{\\circ}$입니다.`,
          '마름모는 평행사변형이므로 넓이는 밑변 × 높이입니다. 한 변과 그에 수직인 높이를 구별해요.',
          `높이는 $h=${a}\\sin ${th}^{\\circ}$입니다.`,
          `$S=${a}\\times${a}\\times${vtex(sinD(th))}$를 계산해요.`
        ], { kind: 'rhombus-side', side: a, angle: th, answer: S.v });
      }
      const p = pick([4, 6, 8, 10, 12]), q = pick([3, 5, 6, 8, 9]);
      if (p === q) return g();
      const S = vi((p * q) / 2 === Math.round((p * q) / 2) ? (p * q) / 2 : 0);
      if (!Number.isInteger((p * q) / 2)) return g();
      const wr = [[vi(p * q), '$\\frac{1}{2}$ 을 곱하지 않았어요.'], [vi(p + q), '합을 구했어요.'], [vi((p * q) / 4 === Math.round((p * q) / 4) ? (p * q) / 4 : p * q * 2), ''], [vdiv(vi(p * q), vi(3)), ''], [vi(p * q * 2), '']].filter((w) => !vsame(w[0], S));
      return checkQ({ tag: '마름모의 넓이(두 대각선)', key: ['rh', 'pq', p, q].join('|'), stem: `두 대각선의 길이가 $${p}$, $${q}$ 인 마름모의 넓이는?`, choices: mkChoices(S, wr), fig: { p, q, ask: 'pq' }, given: [`${p}`, `${q}`], ans: [vcan(S)] }, [
        `두 대각선의 전체 길이는 $${p}$, $${q}$입니다.`,
        '마름모의 두 대각선은 서로를 이등분하고 직각으로 만납니다. 네 직각삼각형으로 나누어요.',
        `작은 삼각형 하나의 넓이는 $\\frac{1}{2}\\times\\frac{${p}}{2}\\times\\frac{${q}}{2}$입니다.`,
        `네 개의 합은 $S=\\frac{1}{2}\\times${p}\\times${q}$입니다. 주어진 값이 대각선의 전체 길이라는 점을 확인해요.`
      ], { kind: 'rhombus-diagonals', p, q, answer: S.v });
    },
    pdraw: (b, q, C) => {
      const f = q.fig;
      if (f.ask === 'sa') drawRh(b, f.a, f.th, { diag: C.review && C.step >= 2, th: `${f.th}°`, a: `${f.a}`, rows: [{ t: C.last ? `□ABCD의 넓이 = ${q.ans[0]}` : '□ABCD의 넓이 = x', c: 'amber', size: 18 }] });
      else { const a = Math.sqrt(f.p * f.p + f.q * f.q) / 2, th = 2 * Math.atan2(f.p / 2, f.q / 2) / DEG; drawRh(b, a, th, { p: `${f.p}`, q: `${f.q}`, rows: [{ t: C.last ? `□ABCD의 넓이 = ${q.ans[0]}` : '□ABCD의 넓이 = x', c: 'amber', size: 18 }] }); }
    }
  };

  /* ====================================================================== 두 대각선과 사잇각 — 교점을 옮겨도 넓이는 같다 */
  const dh = {
    id: 'quadDiagHalf', title: '두 대각선의 길이와 사잇각으로 넓이 구하기', short: '대각선과 넓이',
    question: '두 대각선이 만나는 위치를 가로로 옮기면 사각형의 모양이 변한다. 그래도 넓이는 같을까?',
    ctl: ['t71p', 't71q', 't71t', 't71x'],
    init: (s) => { s.t71p = 8; s.t71q = 6; s.t71t = 60; s.t71x = 0.5; },
    model: (s) => ({ ...diagM(Math.round(s.t71p), Math.round(s.t71q), Math.round(s.t71t)), x: s.t71x }),
    draw(b, s, M, C) {
      const st = C.step, g = diagGeo(M.p, M.q, M.th, M.x), show = (n) => st >= n || st === 99;
      const sl = (w) => { s.t71x = clamp(Math.round(((w.x + M.x * M.p) / M.p) * 20) / 20, 0.25, 0.75); };
      drawDiag(b, g, { step: st, th: `${M.th}°`, p: `p = ${M.p}`, q: `q = ${M.q}`, handle: C.tab === 'explore' && !C.thumb ? sl : null, rows: show(2) ? [{ t: `S = \\frac{1}{2} × ${M.p} × ${M.q} × sin ${M.th}° = ${vv(M.S)}`, c: 'amber' }] : [] });
    },
    steps: (M) => [
      '대각선 $AC=p$, $BD=q$ 와 사잇각 $\\theta$ 가 주어지면, 교점 $P$ 의 위치와 관계없이 넓이가 정해져요.',
      '네 삼각형 $PAB$, $PBC$, $PCD$, $PDA$ 의 넓이를 모두 더하면 $\\frac{1}{2}pq\\sin\\theta$ 예요.',
      `$S=\\frac{1}{2}\\times${M.p}\\times${M.q}\\times\\sin ${M.th}^{\\circ}=${vtex(M.S)}$ ${M.S.x ? '' : '(근삿값)'}`
    ],
    view: (M) => ({
      guide: '<b>점 P를 가로로 끌어</b> 보세요(또는 막대). 사각형 모양은 달라져도 $p$, $q$, $\\theta$ 가 같으면 넓이는 그대로예요.',
      readouts: [rd('넓이 $S$', `$${vtex(M.S)}$`, 'amber', '교점을 옮겨도 같아요'), rd('$\\sin\\theta$', `$${vtex(sinD(M.th))}$`, 'sky')],
      rule: '$S=\\frac{1}{2}pq\\sin\\theta$ — 대각선의 길이와 사잇각만 알면 된다',
      notes: notes('대각선이 서로 수직이면 $\\sin90^{\\circ}=1$ 이라 $S=\\frac{1}{2}pq$ 예요.')
    }),
    gen: () => diagProblem('dh', true),
    pdraw: (b, q, C) => diagPdraw(b, q, C)
  };

  /* ====================================================================== 대각선으로 나누어 넓이의 합 */
  function splitGeo(p, a, c, be, de) { const B = pt(0, 0), Dd = pt(p, 0); return { B, D: Dd, A: pt(a * Math.cos(be * DEG), -a * Math.sin(be * DEG)), C: pt(c * Math.cos(de * DEG), c * Math.sin(de * DEG)) }; }
  function drawSplit2(b, g, o = {}) {
    const { A, B, C, D } = g, st = o.step == null ? 99 : o.step, cen = centroid([A, B, C, D]);
    const rowsS = [{ t: `∠ABD = ${o.be}`, c: 'sky' }, { t: `∠CBD = ${o.de}`, c: 'green' }, ...(o.rows || [])];
    fit(b, bboxOf([A, B, C, D]), { t: 54, b: 58 + rowsS.length * 26, l: 56, r: 56 });
    fillPoly(b, [A, B, D], 'sky', st >= 2 ? 0.14 : 0.05); fillPoly(b, [C, B, D], 'green', st >= 3 ? 0.14 : 0.05); poly(b, [A, B, C, D], 'ink', 3.4);
    line(b, B, D, 'violet', 3, { dash: dashed });
    ang(b, B, D, A, { color: 'sky', r: 34 }); ang(b, B, D, C, { color: 'green', r: 34 });
    [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    if (o.p) T(b, mid(B, D), o.p, { dy: -14, dx: 0, size: 16, color: 'violet' });
    if (o.a) sideTag(b, A, B, cen, o.a, { color: 'sky', size: 17 });
    if (o.c) sideTag(b, C, B, cen, o.c, { color: 'green', size: 17 });
    rowsS.forEach((r, i) => T(b, pt((B.x + D.x) / 2, Math.max(C.y, B.y)), r.t, { dy: 46 + i * 26, size: r.size || 16, color: r.c }));
  }
  const sp = {
    id: 'quadSplitSum', title: '대각선으로 나누어 넓이의 합 구하기', short: '넓이의 합',
    question: '사각형 ABCD를 대각선 BD로 나누면 삼각형 두 개가 생긴다. 두 삼각형의 넓이를 각각 구해 더해 보자.',
    ctl: ['t74p', 't74a', 't74b', 't74c', 't74d'],
    init: (s) => { s.t74p = 8; s.t74a = 6; s.t74c = 4; s.t74b = 60; s.t74d = 45; },
    model: (s) => {
      const p = Math.round(s.t74p), a = Math.round(s.t74a), c = Math.round(s.t74c), be = Math.round(s.t74b), de = Math.round(s.t74d);
      const S1 = vdiv(vmul(vmul(vi(p), vi(a)), sinD(be)), vi(2)), S2 = vdiv(vmul(vmul(vi(p), vi(c)), sinD(de)), vi(2));
      return { p, a, c, be, de, S1, S2, S: vadd(S1, S2) };
    },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawSplit2(b, splitGeo(M.p, M.a, M.c, M.be, M.de), { step: st, be: `${M.be}°`, de: `${M.de}°`, p: `${M.p}`, a: `${M.a}`, c: `${M.c}`, rows: [show(1) ? { t: `S₁ = ${vv(M.S1)},  S₂ = ${vv(M.S2)}`, c: 'sky' } : null, show(2) ? { t: `S = S₁ + S₂ = ${vv(M.S)}`, c: 'amber' } : null].filter(Boolean) }); },
    steps: (M) => [
      '대각선 $BD$ 로 사각형을 두 삼각형 $ABD$, $CBD$ 로 나눠요. 각 삼각형은 두 변과 그 끼인각을 알아요.',
      `$S_1=\\frac{1}{2}\\times BD\\times BA\\times\\sin ${M.be}^{\\circ}=${vtex(M.S1)}$, $S_2=\\frac{1}{2}\\times BD\\times BC\\times\\sin ${M.de}^{\\circ}=${vtex(M.S2)}$`,
      `$S=S_1+S_2=${vtex(M.S)}$ ${M.S.x ? '' : '(근삿값)'}`
    ],
    view: (M) => ({
      guide: '<b>BD, BA, BC</b>와 두 각을 바꿔 보세요. 하늘색 삼각형 $ABD$ 와 초록 삼각형 $CBD$ 의 넓이를 각각 구해 더해요.',
      readouts: [rd('$S_1$', `$${vtex(M.S1)}$`, 'sky'), rd('$S_2$', `$${vtex(M.S2)}$`, 'green'), rd('$S=S_1+S_2$', `$${vtex(M.S)}$`, 'amber')],
      rule: '사각형의 넓이 = 대각선으로 나눈 두 삼각형의 넓이의 합, 각 삼각형은 $\\frac{1}{2}\\times$(두 변)$\\times\\sin$(끼인각)',
      notes: notes('끼인각이 어느 두 변 사이의 각인지 확인해요. 두 삼각형 모두 변 $BD$ 를 한 변으로 해요.')
    }),
    gen: function g() {
      const p = pick([4, 6, 8, 10]), a = pick([2, 3, 4, 6]), c = pick([2, 3, 4, 6]), be = pick(TH), de = pick(TH);
      const S1 = vdiv(vmul(vmul(vi(p), vi(a)), sinD(be)), vi(2)), S2 = vdiv(vmul(vmul(vi(p), vi(c)), sinD(de)), vi(2)), S = vadd(S1, S2);
      if (S1.v < 1e-9 || vsame(S1, S2) || vsame(S, vi(p)) || vsame(S, vi(a)) || vsame(S, vi(c))) return g();
      const wr = [[S1, '삼각형 하나의 넓이만 구했어요. 나머지 삼각형도 더해요.'], [S2, '삼각형 하나의 넓이만 구했어요. 나머지 삼각형도 더해요.'], [vmul(S, vi(2)), '$\\frac{1}{2}$ 을 곱하지 않았어요.'], [vsub(S1, S2), '더해야 하는데 뺐어요.'], [vadd(vdiv(vmul(vmul(vi(p), vi(a)), cosD(be)), vi(2)), S2), '$\\sin$ 대신 $\\cos$ 을 썼어요.']].filter((w) => w[0].x && !vsame(w[0], S) && w[0].v > 0);
      const q = {
        tag: '대각선으로 나눈 사각형의 넓이', key: ['sp', p, a, c, be, de].join('|'),
        stem: `사각형 $ABCD$ 에서 $\\overline{BD}=${p}$, $\\overline{BA}=${a}$, $\\overline{BC}=${c}$, $\\angle ABD=${be}^{\\circ}$, $\\angle CBD=${de}^{\\circ}$ 일 때, 사각형 $ABCD$ 의 넓이는?`,
        choices: mkChoices(S, wr), fig: { p, a, c, be, de }, given: [`${p}`, `${a}`, `${c}`, `${be}°`, `${de}°`], ans: [vcan(S)]
      };
      q.fig.work = { s1: vcan(S1), s2: vcan(S2), total: vcan(S) };
      return checkQ(q, [
        `대각선 $BD=${p}$로 사각형을 $\\triangle ABD$, $\\triangle CBD$로 나눕니다. 각 삼각형의 끼인각은 각각 $${be}^{\\circ}$, $${de}^{\\circ}$입니다.`,
        `위쪽 삼각형의 넓이 $S_1=\\frac{1}{2}\\times${p}\\times${a}\\times\\sin ${be}^{\\circ}=${vtex(S1)}$입니다.`,
        `아래쪽 삼각형의 넓이 $S_2=\\frac{1}{2}\\times${p}\\times${c}\\times\\sin ${de}^{\\circ}=${vtex(S2)}$입니다.`,
        `두 삼각형은 대각선의 반대쪽에 있으므로 넓이를 더해요. $S=S_1+S_2=${vtex(S1)}+${vtex(S2)}$입니다.`
      ], { kind: 'split-area', diagonal: p, a, c, angles: [be, de], answer: S.v });
    },
    pdraw: (b, q, C) => { const f = q.fig; drawSplit2(b, splitGeo(f.p, f.a, f.c, f.be, f.de), { step: C.review ? C.step : 0, be: `${f.be}°`, de: `${f.de}°`, p: `${f.p}`, a: `${f.a}`, c: `${f.c}`, rows: [{ t: C.last ? `□ABCD의 넓이 = ${f.work.total}` : C.review && C.step >= 3 ? `S₁ = ${f.work.s1}, S₂ = ${f.work.s2}` : C.review && C.step >= 2 ? `S₁ = ${f.work.s1}` : '□ABCD의 넓이 = x', c: 'amber', size: 18 }] }); }
  };

  G.register(70, 't7', '⑦ 사각형의 넓이', '사각형의 넓이', PARAMS, [uf, pa, rh, dh, sp]);
})();
