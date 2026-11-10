/* ==========================================================================
   중3 · 삼각비 — 탭 ⑥ 「삼각형의 넓이」 (t6.js, order 60) — 장면 6개
   · areaAcute 예각삼각형 ½bc sin A   · areaObtuse [심화] 둔각삼각형   · equilFormula 정삼각형의 높이·넓이
   · r6-1 넓이로 변 구하기   · angleBisectLen [킬러] 각의 이등분선의 길이   · regPolygonArea [심화] 정다각형의 넓이
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const { clamp, pt, mid, T, tagOut, ang, sideTag, tick, line, poly, fillPoly, fit, P, rd, notes, dashed, rint, pick, sample, bboxOf, DEG, centroid, polar,
    vi, vsq, vf, vadd, vsub, vmul, vdiv, vsqrt, vpow2, vsame, vtex, vcan, sinD, cosD, tanD, mkChoices, checkQ, fmtN, decS } = G;

  const PARAMS = {
    t61b: P('변 AC = b', 2, 12, 1, 6, { color: 'sky' }),
    t61c: P('변 AB = c', 2, 12, 1, 8, { color: 'green' }),
    t61a: P('끼인각 A', 10, 85, 5, 50, { color: 'amber', format: G.degF }),
    t62a: P('끼인각 A', 95, 170, 5, 130, { color: 'amber', format: G.degF }),
    t63a: P('한 변의 길이 a', 1, 12, 1, 6, { color: 'sky' }),
    t64s: P('넓이 S', 3, 30, 1, 12, { color: 'amber' }),
    t64c: P('변 AB = c', 3, 12, 1, 6, { color: 'green' }),
    t64a: P('끼인각 A', 30, 150, 15, 60, { color: 'amber', format: G.degF }),
    t65a: P('끼인각 A', 60, 120, 30, 60, { color: 'amber', format: G.degF }),
    t66n: P('변의 수 n', 3, 12, 1, 6, { color: 'amber', format: (v) => `${v}각형` }),
    t66r: P('반지름 R', 2, 10, 1, 6, { color: 'sky' })
  };

  /* ---- 두 변과 끼인각이 있는 삼각형 ---- */
  // A 원점, B=(c,0), C=(b cos A, −b sin A). 높이: C 에서 직선 AB 에 내린 수선 CH
  function geoAC(b0, c0, A) { return { A: pt(0, 0), B: pt(c0, 0), C: pt(b0 * Math.cos(A * DEG), -b0 * Math.sin(A * DEG)) }; }
  function drawAC(b, g, o = {}) {
    const { A, B, C } = g, Hh = pt(C.x, 0), st = o.step == null ? 99 : o.step, obt = C.x < 0, cen = centroid([A, B, C]);
    fit(b, bboxOf([A, B, C, Hh]), { t: obt ? 88 : 52, b: 56 + (o.rows ? o.rows.length * 26 : 0), l: obt && o.h ? 104 : 56, r: 56 });
    fillPoly(b, [A, B, C], obt ? 'rose' : 'sky', 0.14);
    poly(b, [A, B, C], 'ink', 3.4);
    if (st >= 1) { line(b, C, Hh, 'violet', 3.2, { dash: dashed }); if (obt) line(b, Hh, A, 'violet', 2.6, { dash: dashed }); else if (Hh.x > B.x) line(b, B, Hh, 'violet', 2.6, { dash: dashed }); ang(b, Hh, C, B, { color: 'violet', r: 16 }); }
    ang(b, A, B, C, { color: 'amber', r: 34, label: o.angL, size: 16 });
    if (obt && st >= 1) {
      ang(b, A, Hh, C, { color: 'rose', r: 24, rings: 2 });
      // The exterior 30° label must not concatenate with the short CH = 1 label.
      if (o.outL) T(b, A, `∠CAH = ${o.outL}`, { dy: -78, size: 15, color: 'rose' });
    }
    [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    if (st >= 1) { b.point(Hh, { color: 'violet', r: 4 }); T(b, Hh, 'H', { dy: 20, size: 17, color: 'violet' }); }
    if (o.b) sideTag(b, A, C, cen, o.b, { color: 'sky', size: 17, f: obt ? 0.7 : 0.5 });
    if (o.c) sideTag(b, A, B, cen, o.c, { color: 'green', size: 17, flip: false, gap: 22 });
    if (o.h && st >= 1) T(b, mid(C, Hh), `CH = ${String(o.h).replace(/^h\s*=\s*/, '')}`, { dx: obt ? -16 : 10, size: 15, color: 'violet', align: obt ? 'right' : 'left' });
    (o.rows || []).forEach((r, i) => T(b, pt((Math.min(A.x, C.x) + B.x) / 2, 0), r.t, { dy: 64 + i * 26, size: r.size || 16, color: r.c }));
  }
  function areaScene(id, title, short, obtuse) {
    return {
      id, title, short,
      question: obtuse ? '끼인각이 둔각이면 높이는 삼각형 밖에 생긴다. 넓이를 sin으로 어떻게 나타낼까?' : '두 변의 길이와 그 끼인각을 알 때 삼각형의 넓이는? 높이를 sin으로 나타내 보자.',
      ctl: ['t61b', 't61c', obtuse ? 't62a' : 't61a'],
      init: (s) => { s.t61b = 6; s.t61c = 8; s.t61a = 50; s.t62a = 130; },
      model: (s) => {
        const b0 = Math.round(s.t61b), c0 = Math.round(s.t61c), A = Math.round(obtuse ? s.t62a : s.t61a), w = obtuse ? 180 - A : A;
        const h = vmul(vi(b0), sinD(w)), S = vdiv(vmul(vi(c0), h), vi(2));
        return { b0, c0, A, w, h, S, obt: obtuse };
      },
      draw(b, s, M, C) {
        const st = C.step, show = (n) => st >= n || st === 99, vv = (v) => (v.x ? vcan(v) : '≈' + decS(v.v, 2));
        drawAC(b, geoAC(M.b0, M.c0, M.A), { step: st, angL: `${M.A}°`, outL: `${M.w}°`, b: `${M.b0}`, c: `${M.c0}`, h: show(1) ? `h = ${vv(M.h)}` : '', rows: show(2) ? [{ t: `S = \\frac{1}{2} × ${M.c0} × ${vv(M.h)} = ${vv(M.S)}`, c: 'amber' }] : [] });
      },
      steps: (M) => [
        obtuse ? `꼭짓점 $C$ 에서 변 $AB$ 의 <b>연장선</b>에 수선 $CH$ 를 내려요. $\\angle CAH=180^{\\circ}-${M.A}^{\\circ}=${M.w}^{\\circ}$ 예요.` : `꼭짓점 $C$ 에서 변 $AB$ 에 수선 $CH$ 를 내려요. $\\triangle ACH$ 에서 $h=CH=b\\sin A$ 예요.`,
        `$h=b\\sin ${M.w}^{\\circ}=${M.b0}\\sin ${M.w}^{\\circ}=${vtex(M.h)}$ ${M.h.x ? '' : '(근삿값)'}`,
        `$S=\\frac{1}{2}\\times c\\times h=\\frac{1}{2}bc\\sin ${obtuse ? '(180^{\\circ}-A)' : 'A'}=${vtex(M.S)}$ ${M.S.x ? '' : '(근삿값)'}`
      ],
      view: (M) => ({
        guide: `<b>두 변</b>과 <b>끼인각 A</b>를 바꿔 보세요. ${obtuse ? '각 A가 90°를 넘으면 높이가 삼각형 밖에 생기고 색이 분홍으로 바뀌어요.' : '보라색 점선이 높이 h예요.'}`,
        readouts: [rd('높이 $h$', `$${vtex(M.h)}$`, 'violet', `$b\\sin ${obtuse ? '(180^{\\circ}-A)' : 'A'}$`), rd('넓이 $S$', `$${vtex(M.S)}$`, 'amber')],
        rule: obtuse ? '$S=\\frac{1}{2}bc\\sin(180^{\\circ}-A)$ — 둔각이면 외각을 쓴다' : '$S=\\frac{1}{2}bc\\sin A$ (두 변의 곱 × sin(끼인각) ÷ 2)',
        notes: notes('두 변과 <b>끼인각</b>이어야 해요. 끼인각이 아닌 각의 sin 을 곱하면 안 돼요.', '$\\frac{1}{2}$ 을 곱하는 것을 잊지 마세요.', obtuse ? '$\\sin(180^{\\circ}-A)=\\sin A$ 이므로 $\\sin A$ 를 바로 써도 같은 값이에요.' : '$\\cos$ 이나 $\\tan$ 을 쓰지 않아요.')
      }),
      gen: function g() {
        const A = pick(obtuse ? [120, 135, 150] : [30, 45, 60]), w = obtuse ? 180 - A : A, b0 = pick([2, 3, 4, 5, 6, 8]), c0 = pick([3, 4, 5, 6, 7, 8, 10]);
        const S = vdiv(vmul(vmul(vi(b0), vi(c0)), sinD(w)), vi(2)), bc = vmul(vi(b0), vi(c0));
        if (vsame(S, vi(b0)) || vsame(S, vi(c0))) return g();
        const wr = [[vmul(bc, sinD(w)), '$\\frac{1}{2}$ 을 곱하지 않았어요.'], [vdiv(vmul(bc, cosD(w)), vi(2)), '$\\sin$ 대신 $\\cos$ 을 썼어요.'], [vdiv(vmul(bc, tanD(w)), vi(2)), '$\\sin$ 대신 $\\tan$ 을 썼어요.'], [vdiv(bc, vi(2)), '$\\sin$ 을 곱하지 않았어요.'], [vdiv(vmul(bc, sinD(90 - w)), vi(2)), '각을 $90^{\\circ}$ 에서 뺀 값을 썼어요.']].filter((x) => !vsame(x[0], S));
        const q = {
          tag: obtuse ? '[심화] 둔각삼각형의 넓이' : '두 변과 끼인각으로 넓이', key: [id, A, b0, c0].join('|'),
          stem: `△ABC에서 $\\overline{AB}=${c0}$, $\\overline{AC}=${b0}$, $\\angle A=${A}^{\\circ}$ 일 때, △ABC의 넓이는?`,
          choices: mkChoices(S, wr), fig: { b0, c0, A }, given: [`${b0}`, `${c0}`, `${A}°`], ans: [vcan(S)]
        };
        q.fig.h = vcan(vmul(vi(b0), sinD(w))); q.fig.area = vcan(S);
        return checkQ(q, [
          `두 변은 $AB=${c0}$, $AC=${b0}$, 끼인각은 $${A}^{\\circ}$입니다. 꼭짓점 $C$에서 직선 $AB$에 수선 $CH$를 내려요.`,
          obtuse ? `수선의 발은 변의 연장선에 있습니다. $\\angle CAH=180^{\\circ}-${A}^{\\circ}=${w}^{\\circ}$입니다.` : `직각삼각형 $ACH$에서 기준각 $A=${A}^{\\circ}$의 대변이 높이 $CH$입니다.`,
          `$CH=${b0}\\sin ${w}^{\\circ}=${vtex(vmul(vi(b0), sinD(w)))}$입니다.`,
          `삼각형의 넓이는 $S=\\frac{1}{2}\\times AB\\times CH=\\frac{1}{2}\\times${c0}\\times${vtex(vmul(vi(b0), sinD(w)))}$입니다.`
        ], { kind: 'triangle-area', b: b0, c: c0, angle: A, answer: S.v });
      },
      pdraw: (b, q, C) => { const f = q.fig; drawAC(b, geoAC(f.b0, f.c0, f.A), { step: C.review ? C.step : 0, angL: `${f.A}°`, outL: `${180 - f.A}°`, b: `${f.b0}`, c: `${f.c0}`, h: C.review && C.step >= 3 ? f.h : '', rows: [{ t: C.last ? `△ABC의 넓이 = ${f.area}` : '△ABC의 넓이 = x', c: 'amber', size: 18 }] }); }
    };
  }
  const aAcute = areaScene('areaAcute', '예각삼각형의 넓이 — 두 변과 끼인각', '예각삼각형 넓이', false);
  const aObt = areaScene('areaObtuse', '[심화] 둔각삼각형의 넓이 — 두 변과 끼인각', '[심화] 둔각삼각형 넓이', true);
  aAcute.title = '예각삼각형의 넓이'; aObt.title = '[심화] 둔각삼각형의 넓이';

  /* ====================================================================== 정삼각형 */
  function drawEq(b, a, o = {}) {
    const H = (a * Math.sqrt(3)) / 2, A = pt(0, -H), B = pt(-a / 2, 0), C = pt(a / 2, 0), Hh = pt(0, 0), st = o.step == null ? 99 : o.step;
    const compact = o.compactQuestion && !b.thumb && b.W < 560;
    fit(b, bboxOf([A, B, C]), compact ? { t: 28, b: 40 + (o.rows ? o.rows.length * 32 : 0), l: 42, r: 42, problemTop: 28 } : { t: 54, b: 56 + (o.rows ? o.rows.length * 26 : 0), l: 60, r: 60 });
    fillPoly(b, [A, B, C], 'sky', 0.14); poly(b, [A, B, C], 'ink', 3.4);
    if (st >= 1 || (o.L && o.L.hx)) { line(b, A, Hh, 'violet', 3.2, { dash: dashed }); ang(b, Hh, B, A, { color: 'violet', r: 16 }); b.point(Hh, { color: 'violet', r: 4 }); T(b, Hh, 'H', { dy: 20, size: 17, color: 'violet' }); }
    [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, pt(0, -H / 3), n, { size: 17, gap: 11 }); });
    const angle = compact ? { r: 22, labelDist: 36 } : { r: 32 };
    ang(b, B, C, A, { color: 'amber', ...angle, label: '60°', size: 15 }); ang(b, C, A, B, { color: 'amber', ...angle, label: '60°', size: 15 }); ang(b, A, B, C, { color: 'amber', ...angle, label: '60°', size: 15 });
    tick(b, A, B, 1, 'green'); tick(b, A, C, 1, 'green'); tick(b, B, C, 1, 'green');
    const L = o.L || {}, cen = pt(0, -H / 3);
    if (L.a) sideTag(b, B, C, cen, L.a, { color: L.ax ? 'amber' : 'green', size: L.ax ? 21 : 17, flip: false, gap: compact ? 16 : 24, ...(compact ? { f: .25 } : {}) });
    if (L.h) T(b, mid(A, Hh), L.h, { dx: 6, dy: 6, size: L.hx ? 21 : 16, color: L.hx ? 'amber' : 'violet', align: 'left' });
    (o.rows || []).forEach((r, i) => T(b, pt(0, 0), r.t, { dy: 64 + i * 26, size: r.size || 16, color: r.c }));
  }
  const eq = {
    id: 'equilFormula', title: '정삼각형의 높이와 넓이', short: '정삼각형 공식',
    question: '한 변이 a인 정삼각형의 높이와 넓이를 a로 나타내면? sin 60°를 이용해 보자.',
    ctl: ['t63a'],
    init: (s) => { s.t63a = 6; },
    model: (s) => { const a = vi(Math.round(s.t63a)), h = vmul(vdiv(vsq(3), vi(2)), a), S = vmul(vdiv(vsq(3), vi(4)), vmul(a, a)); return { a, h, S }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawEq(b, M.a.v, { step: st, L: { a: `${M.a.v}`, h: show(1) ? `h = ${vcan(M.h)}` : '' }, rows: show(2) ? [{ t: `S = \\frac{1}{2} × ${M.a.v} × ${vcan(M.h)} = ${vcan(M.S)}`, c: 'amber' }] : [] }); },
    steps: (M) => [
      `꼭짓점 $A$ 에서 수선 $AH$ 를 내려요. $\\triangle ABH$ 는 $30^{\\circ}$, $60^{\\circ}$, $90^{\\circ}$ 직각삼각형이므로 $h=a\\sin60^{\\circ}=\\frac{\\sqrt{3}}{2}a=${vtex(M.h)}$`,
      `$S=\\frac{1}{2}\\times a\\times h=\\frac{1}{2}\\times${M.a.v}\\times${vtex(M.h)}=${vtex(M.S)}$`,
      '일반적으로 정삼각형의 높이는 $\\frac{\\sqrt{3}}{2}a$, 넓이는 $\\frac{\\sqrt{3}}{4}a^2$ 예요. ($S=\\frac{1}{2}a\\cdot a\\sin60^{\\circ}$ 로 구해도 같아요.)'
    ],
    view: (M) => ({
      guide: '<b>한 변 a</b>를 바꿔 보세요. 높이와 넓이가 $a$ 의 식으로 바로 구해져요.',
      readouts: [rd('높이 $h$', `$${vtex(M.h)}$`, 'violet', '$\\frac{\\sqrt{3}}{2}a$'), rd('넓이 $S$', `$${vtex(M.S)}$`, 'amber', '$\\frac{\\sqrt{3}}{4}a^2$')],
      rule: '정삼각형: 높이 $h=\\frac{\\sqrt{3}}{2}a$, 넓이 $S=\\frac{\\sqrt{3}}{4}a^2$',
      notes: notes('넓이 공식의 분모는 4예요. 높이 공식의 분모 2와 헷갈리지 않아요.', '$a^2$ 를 곱하는 것은 넓이일 때만이에요.')
    }),
    gen: () => {
      const kind = pick(['S', 'h', 'a']), a0 = pick([2, 4, 6, 8, 10, 12]), a = pick([vi(a0), vmul(vi(a0 / 2), vsq(3)), vi(a0 / 2 || 1)]), h = vmul(vdiv(vsq(3), vi(2)), a), S = vmul(vdiv(vsq(3), vi(4)), vmul(a, a));
      let ans, stem, wr, rows = [], L = {};
      if (kind === 'S') { ans = S; stem = `한 변의 길이가 $${vtex(a)}$ 인 정삼각형의 넓이는?`; wr = [[vmul(vdiv(vsq(3), vi(2)), vmul(a, a)), '넓이 공식의 분모는 4예요.'], [h, '높이를 구했어요. 넓이는 한 번 더 계산해요.'], [vmul(vdiv(vsq(3), vi(4)), a), '$a^2$ 이 아니라 $a$ 를 썼어요.'], [vmul(vdiv(vsq(3), vi(2)), a), '높이 공식이에요.'], [vdiv(vmul(a, a), vi(2)), '$\\sin60^{\\circ}$ 를 곱하지 않았어요.']]; rows = [{ t: '넓이 = x', c: 'amber', size: 19 }]; L = { a: vcan(a) }; }
      else if (kind === 'h') { ans = h; stem = `한 변의 길이가 $${vtex(a)}$ 인 정삼각형의 높이는?`; wr = [[S, '넓이를 구했어요. 높이는 $\\frac{\\sqrt{3}}{2}a$ 예요.'], [vmul(vdiv(vsq(3), vi(4)), a), '높이의 분모는 2예요.'], [vdiv(a, vi(2)), '$a$ 의 반이에요.'], [vmul(a, vsq(3)), '$\\sqrt{3}a$ 예요. $\\frac{\\sqrt{3}}{2}a$ 가 아니에요.'], [vmul(vdiv(vi(1), vsq(3)), a), '']]; L = { a: vcan(a), h: 'x', hx: true }; }
      else { ans = a; stem = `넓이가 $${vtex(S)}$ 인 정삼각형의 한 변의 길이 $x$ 는?`; wr = [[vmul(a, vsq(3)), '$S=\\frac{\\sqrt{3}}{4}a^2$ 을 거꾸로 풀 때 계산을 다시 확인해요.'], [vmul(a, vi(2)), ''], [vdiv(a, vi(2)), ''], [vmul(a, vmul(a, vi(1))), ''], [vdiv(a, vsq(3)), '']]; rows = [{ t: `넓이 = ${vcan(S)}`, c: 'sky', size: 18 }]; L = { a: 'x', ax: true }; }
      const q = { tag: kind === 'a' ? '정삼각형의 넓이로 한 변 구하기' : '정삼각형의 높이와 넓이', key: ['eq', kind, vtex(a)].join('|'), stem, choices: mkChoices(ans, wr.filter((w) => !vsame(w[0], ans))), fig: { a: a.v, rows, L }, given: kind === 'a' ? [vcan(S)] : [vcan(a)], ans: [vcan(ans)] };
      q.fig.kind = kind; q.fig.work = { a: vcan(a), h: vcan(h), S: vcan(S) };
      return checkQ(q, [
        kind === 'a' ? `주어진 정삼각형의 넓이는 $${vtex(S)}$입니다. 구하는 한 변을 $a=x$라 해요.` : `한 변은 $a=${vtex(a)}$입니다. 구하는 것은 ${kind === 'h' ? '높이' : '넓이'}입니다.`,
        '꼭짓점에서 수선을 내리면 $30^{\\circ},60^{\\circ},90^{\\circ}$인 직각삼각형이 생깁니다. 높이는 $h=a\\sin60^{\\circ}=\\frac{\\sqrt{3}}{2}a$입니다.',
        kind === 'a' ? `넓이 공식에 넣으면 $${vtex(S)}=\\frac{\\sqrt{3}}{4}a^2$입니다.` : `$h=\\frac{\\sqrt{3}}{2}\\times${vtex(a)}=${vtex(h)}$입니다.`,
        kind === 'a' ? `$a^2=\\frac{4\\times${vtex(S)}}{\\sqrt{3}}=${vtex(vpow2(a))}$이므로 양의 제곱근을 택해요.` : kind === 'S' ? `$S=\\frac{1}{2}\\times${vtex(a)}\\times${vtex(h)}$를 계산해요.` : '높이를 묻고 있으므로 구한 수선의 길이를 답으로 써요. 넓이와 구별해요.'
      ], { kind: 'equilateral', side: a.v, ask: kind, answer: ans.v });
    },
    pdraw: (b, q, C) => drawEq(b, q.fig.a, { compactQuestion: true, step: C.review ? C.step : 0, L: { ...q.fig.L, ...(C.review && C.step >= 3 && q.fig.kind === 'S' ? { h: q.fig.work.h } : {}), ...(C.last ? { a: q.fig.work.a, h: q.fig.work.h, hx: false, ax: false } : {}) }, rows: C.last && q.fig.kind === 'S' ? [{ t: `넓이 = ${q.fig.work.S}`, c: 'amber' }] : q.fig.rows })
  };

  /* ====================================================================== r6-1 넓이로 변 구하기 */
  const r61 = {
    id: 'r6-1', title: '넓이로 변의 길이 구하기', short: '넓이로 변 구하기',
    question: '삼각형의 넓이와 한 변, 끼인각이 주어지면 다른 변 b를 구할 수 있을까? 넓이 공식을 거꾸로 써 보자.',
    ctl: ['t64s', 't64c', 't64a'],
    init: (s) => { s.t64s = 12; s.t64c = 6; s.t64a = 60; },
    model: (s) => {
      const S = vi(Math.round(s.t64s)), c0 = Math.round(s.t64c), A = Math.round(s.t64a), w = A > 90 ? 180 - A : A, den = vmul(vi(c0), sinD(A)), b0 = vdiv(vmul(vi(2), S), den);
      return { S, c0, A, b0, w };
    },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99, bn = clamp(M.b0.v, 1, 40);
      drawAC(b, geoAC(bn, M.c0, M.A), { step: 0, angL: `${M.A}°`, b: show(2) ? `b = ${M.b0.x ? vcan(M.b0) : '≈' + decS(M.b0.v, 2)}` : 'b', c: `${M.c0}`, rows: [{ t: `S = ${M.S.v}`, c: 'amber' }, ...(show(1) ? [{ t: `${M.S.v} = \\frac{1}{2} × b × ${M.c0} × sin ${M.A}°`, c: 'sky' }] : [])] });
    },
    steps: (M) => [
      `넓이 공식에 알려진 값을 넣어요. $${M.S.v}=\\frac{1}{2}\\times b\\times${M.c0}\\times\\sin ${M.A}^{\\circ}$`,
      `$\\sin ${M.A}^{\\circ}=${vtex(sinD(M.A))}$ 를 넣고 $b$ 에 대한 식으로 풀어요. $b=\\frac{2\\times${M.S.v}}{${M.c0}\\sin ${M.A}^{\\circ}}$`,
      `$b=${vtex(M.b0)}$ ${M.b0.x ? '' : '(근삿값)'}`
    ],
    view: (M) => ({
      guide: '<b>넓이 S</b>, <b>변 c</b>, <b>각 A</b>를 바꿔 보세요. 넓이 공식 $S=\\frac{1}{2}bc\\sin A$ 를 $b$ 에 대해 풀면 $b=\\frac{2S}{c\\sin A}$ 예요.',
      readouts: [rd('$b$', `$${vtex(M.b0)}$`, 'sky', M.b0.x ? '' : `$\\approx${decS(M.b0.v, 2)}$`), rd('$\\sin A$', `$${vtex(sinD(M.A))}$`, 'amber')],
      rule: '$S=\\frac{1}{2}bc\\sin A$ → $b=\\frac{2S}{c\\sin A}$',
      notes: notes('양변에 2를 곱하는 것을 잊지 마세요. $b=\\frac{S}{c\\sin A}$ 가 아니에요.')
    }),
    gen: function g() {
      const A = pick([30, 45, 60, 120, 135, 150]), w = A > 90 ? 180 - A : A, b0 = pick([2, 3, 4, 5, 6, 8]), c0 = pick(w === 45 ? [4, 6, 8, 10] : [3, 4, 5, 6, 8, 10]);
      let S = vdiv(vmul(vmul(vi(b0), vi(c0)), sinD(w)), vi(2));
      if (b0 === c0 || vsame(S, vi(b0)) || vsame(S, vi(c0))) return g();
      const wr = [[vmul(vi(b0), vi(2)), '양변에 2를 곱하는 것을 잊거나 두 번 곱했어요.'], [vdiv(vi(b0), vi(2)), '넓이 공식의 $\\frac{1}{2}$ 을 처리하지 못했어요.'], [vdiv(vmul(vi(2), S), vmul(vi(c0), cosD(w))), '$\\sin$ 대신 $\\cos$ 을 썼어요.'], [vdiv(S, vmul(vi(c0), sinD(w))), '양변에 2를 곱하지 않았어요.'], [vmul(vi(b0), sinD(w)), '']].filter((x) => x[0].v > 0);
      const q = {
        tag: '넓이로 변의 길이 구하기', key: ['r61', A, b0, c0].join('|'),
        stem: `△ABC에서 $\\overline{AB}=${c0}$, $\\angle A=${A}^{\\circ}$ 이고 넓이가 $${vtex(S)}$ 일 때, $\\overline{AC}$ 의 길이는?`,
        choices: mkChoices(vi(b0), wr), fig: { b0, c0, A, S: vcan(S) }, given: [`${c0}`, `${A}°`, vcan(S)], ans: [`${b0}`]
      };
      return checkQ(q, [
        `주어진 넓이는 $${vtex(S)}$, 변 $AB=${c0}$, 끼인각 $A=${A}^{\\circ}$입니다. 구하는 변은 $AC=x$입니다.`,
        `$S=\\frac{1}{2}\\times AB\\times AC\\times\\sin ${w}^{\\circ}$를 사용해요.${A > 90 ? ` 둔각의 바깥각은 $${w}^{\\circ}$입니다.` : ''}`,
        `$${vtex(S)}=\\frac{1}{2}\\times${c0}\\times x\\times${vtex(sinD(w))}$입니다.`,
        `양변에 2를 곱하고 나누면 $x=\\frac{2\\times${vtex(S)}}{${c0}\\times${vtex(sinD(w))}}$입니다.`
      ], { kind: 'area-side', area: S.v, c: c0, angle: A, answer: b0 });
    },
    pdraw: (b, q, C) => { const f = q.fig; drawAC(b, geoAC(f.b0, f.c0, f.A), { step: C.review ? C.step : 0, angL: `${f.A}°`, outL: `${180 - f.A}°`, b: C.last ? `${f.b0}` : 'x', c: `${f.c0}`, rows: [{ t: `넓이 = ${f.S}`, c: 'amber', size: 18 }] }); }
  };

  /* ====================================================================== 각의 이등분선의 길이 */
  function geoBis(b0, c0, A, x) { const g = geoAC(b0, c0, A), t = (A / 2) * DEG; return { ...g, D: pt(x * Math.cos(t), -x * Math.sin(t)) }; }
  function drawBis(b, g, A, o = {}) {
    const { A: P0, B, C, D } = g, cen = centroid([P0, B, C]), st = o.step == null ? 99 : o.step;
    fit(b, bboxOf([P0, B, C]), { t: 54, b: 58 + ((o.rows ? o.rows.length : 0) + (o.al ? 1 : 0)) * 26, l: 58, r: 58 });
    fillPoly(b, [P0, B, D], 'sky', 0.16); fillPoly(b, [P0, D, C], 'green', 0.16);
    poly(b, [P0, B, C], 'ink', 3.4); line(b, P0, D, 'violet', 3.4);
    ang(b, P0, B, D, { color: 'amber', rings: 2, r: 36, label: o.hl, size: 15, labelDist: 56 }); ang(b, P0, D, C, { color: 'amber', rings: 2, r: 36, label: o.hl, size: 15, labelDist: 56 });
    [[P0, 'A'], [B, 'B'], [C, 'C']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    b.point(D, { color: 'violet', r: 4.5 }); tagOut(b, D, cen, 'D', { size: 17, gap: 11, color: 'violet' });
    if (o.b) sideTag(b, P0, C, cen, o.b, { color: 'sky', size: 17 });
    if (o.c) sideTag(b, P0, B, cen, o.c, { color: 'green', size: 17, flip: false, gap: 22 });
    if (o.x) T(b, mid(P0, D), o.x, { dx: 8, dy: 12, size: o.xs || 17, color: o.xc || 'violet', align: 'left' });
    const rows = [...(o.al ? [{ t: `∠A = ${o.al}`, c: 'amber' }] : []), ...(o.rows || [])];
    rows.forEach((r, i) => T(b, pt((Math.min(P0.x, C.x) + B.x) / 2, 0), r.t, { dy: 66 + i * 26, size: r.size || 16, color: r.c }));
  }
  const bisM = (b0, c0, A) => { const half = A / 2, x = vdiv(vmul(vmul(vi(2), vmul(vi(b0), vi(c0))), cosD(half)), vi(b0 + c0)); return { x, half }; };
  const bis = {
    id: 'angleBisectLen', title: '[킬러] 각의 이등분선의 길이', short: '[킬러] 이등분선',
    question: '삼각형 ABC에서 ∠A의 이등분선 AD의 길이는? 넓이를 둘로 나누어 S = S₁ + S₂ 로 식을 세워 보자.',
    ctl: ['t61b', 't61c', 't65a'],
    init: (s) => { s.t61b = 4; s.t61c = 6; s.t65a = 60; },
    model: (s) => { const b0 = Math.round(s.t61b), c0 = Math.round(s.t61c), A = Math.round(s.t65a), M = bisM(b0, c0, A); return { b0, c0, A, ...M, S: vdiv(vmul(vmul(vi(b0), vi(c0)), sinD(A)), vi(2)) }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawBis(b, geoBis(M.b0, M.c0, M.A, M.x.v), M.A, { step: st, b: `${M.b0}`, c: `${M.c0}`, hl: show(1) ? `${M.half}°` : '', al: `${M.A}°`, x: `x = ${M.x.x ? vcan(M.x) : '≈' + decS(M.x.v, 2)}`, rows: show(2) ? [{ t: 'S = S₁ + S₂', c: 'amber' }] : [] }); },
    steps: (M) => [
      `$\\angle A=${M.A}^{\\circ}$ 의 이등분선 $AD=x$ 는 각을 $${M.half}^{\\circ}$ 와 $${M.half}^{\\circ}$ 로 나눠요.`,
      `전체 넓이는 두 삼각형의 합이에요. $\\frac{1}{2}bc\\sin ${M.A}^{\\circ}=\\frac{1}{2}cx\\sin ${M.half}^{\\circ}+\\frac{1}{2}bx\\sin ${M.half}^{\\circ}$`,
      `$\\frac{1}{2}\\times${M.b0}\\times${M.c0}\\sin ${M.A}^{\\circ}=\\frac{1}{2}(${M.b0}+${M.c0})\\,x\\sin ${M.half}^{\\circ}$ 를 풀면 $x=${vtex(M.x)}$`
    ],
    view: (M) => ({
      guide: '<b>두 변</b>과 <b>각 A</b>를 바꿔 보세요. 이등분선 AD가 삼각형을 넓이 $S_1$, $S_2$ 로 나눠요. 두 넓이의 합이 전체 넓이와 같다는 식으로 $x$ 를 구해요.',
      readouts: [rd('전체 넓이 $S$', `$${vtex(M.S)}$`, 'amber'), rd('$AD=x$', `$${vtex(M.x)}$`, 'violet', M.x.x ? '' : `$\\approx${decS(M.x.v, 2)}$`)],
      rule: '$S=S_1+S_2$ → $\\frac{1}{2}bc\\sin A=\\frac{1}{2}(b+c)\\,x\\sin\\frac{A}{2}$',
      notes: notes('나누어진 두 삼각형의 끼인각은 모두 $\\frac{A}{2}$ 예요. $\\sin A$ 를 그대로 쓰지 않아요.')
    }),
    gen: () => {
      const A = pick([60, 90, 120]), b0 = pick([2, 3, 4, 6]), c0 = pick([3, 4, 6, 12].filter((v) => v !== b0)), M = bisM(b0, c0, A), x = M.x;
      const wr = [[vdiv(vmul(vmul(vi(b0), vi(c0)), sinD(A)), vi(b0 + c0)), '이등분한 각 $\\frac{A}{2}$ 대신 $A$ 를 썼어요.'], [vdiv(vmul(vmul(vi(2), vmul(vi(b0), vi(c0))), sinD(M.half)), vi(b0 + c0)), '$\\cos\\frac{A}{2}$ 대신 $\\sin\\frac{A}{2}$ 를 썼어요.'], [vdiv(vmul(vmul(vi(b0), vi(c0)), cosD(M.half)), vi(b0 + c0)), '양변에 2를 곱하지 않았어요.'], [vdiv(vmul(vi(2), vmul(vi(b0), vi(c0))), vi(b0 + c0)), '$\\cos\\frac{A}{2}$ 를 곱하지 않았어요.'], [vdiv(vi(b0 + c0), vi(2)), '']];
      const q = {
        tag: '[킬러] 각의 이등분선의 길이', key: ['bis', A, b0, c0].join('|'),
        stem: `△ABC에서 $\\overline{AB}=${c0}$, $\\overline{AC}=${b0}$, $\\angle A=${A}^{\\circ}$ 이고 $\\angle A$ 의 이등분선이 변 $BC$ 와 만나는 점을 $D$ 라 할 때, $\\overline{AD}=x$ 의 길이는?`,
        choices: mkChoices(x, wr.filter((w) => !vsame(w[0], x))), fig: { b0, c0, A, x: x.v }, given: [`${b0}`, `${c0}`, `${A}°`], ans: [vcan(x)]
      };
      q.fig.answer = vcan(x);
      return checkQ(q, [
        `주어진 두 변은 $AB=${c0}$, $AC=${b0}$이고 $\\angle A=${A}^{\\circ}$입니다. 이등분선 $AD=x$가 만드는 두 각은 각각 $${M.half}^{\\circ}$입니다.`,
        `전체 넓이는 $S=\\frac{1}{2}\\times${b0}\\times${c0}\\sin ${A}^{\\circ}$입니다.`,
        `나뉜 넓이의 합은 $\\frac{1}{2}\\times${c0}\\times x\\sin ${M.half}^{\\circ}+\\frac{1}{2}\\times${b0}\\times x\\sin ${M.half}^{\\circ}$입니다.`,
        `두 식을 같게 두면 $x=\\frac{${b0}\\times${c0}\\times${vtex(sinD(A))}}{(${b0}+${c0})\\times${vtex(sinD(M.half))}}$입니다. 특수각의 값을 넣어 계산해요.`
      ], { kind: 'angle-bisector', b: b0, c: c0, angle: A, answer: x.v });
    },
    pdraw: (b, q, C) => { const f = q.fig; drawBis(b, geoBis(f.b0, f.c0, f.A, f.x), f.A, { step: C.review ? C.step : 0, b: `${f.b0}`, c: `${f.c0}`, al: `${f.A}°`, hl: C.review ? `${f.A / 2}°` : '', x: C.last ? f.answer : 'x', xs: 21, xc: 'amber' }); }
  };

  /* ====================================================================== [심화] 정다각형의 넓이 */
  function drawReg(b, n, R, o = {}) {
    const O = pt(0, 0), V = Array.from({ length: n }, (_, i) => polar(O, R, -90 + (360 * i) / n));
    fit(b, bboxOf([pt(-R, -R), pt(R, R)]), { t: 58, b: 60 + (o.rows ? o.rows.length * 26 : 0), l: 54, r: 54 });
    const st = o.step == null ? 99 : o.step;
    b.circle(O, R, { color: 'muted', width: 1.8 }); // 반지름 R 인 외접원
    fillPoly(b, V, 'sky', 0.1); poly(b, V, 'ink', 3.4);
    line(b, O, V[0], 'sky', 3.6);
    if (st >= 1) V.forEach((p0) => line(b, O, p0, 'violet', 2));
    if (st >= 1) fillPoly(b, [O, V[0], V[1]], 'amber', 0.28);
    V.forEach((p0, i) => b.point(p0, { color: 'ink', r: 4 }));
    b.point(O, { color: 'ink', r: 4 });
    if (o.R) T(b, mid(O, V[0]), o.R, { dx: -8, size: 17, color: 'sky', align: 'right' });
    if (o.ang && st >= 1) ang(b, O, V[0], V[1], { color: 'amber', r: 30, label: o.ang, size: 15, labelDist: 54 });
    (o.rows || []).forEach((r, i) => T(b, pt(0, R), r.t, { dy: 40 + i * 26, size: r.size || 16, color: r.c }));
  }
  const reg = {
    id: 'regPolygonArea', title: '[심화] 정다각형의 넓이', short: '[심화] 정다각형 넓이',
    question: '반지름이 R인 원에 내접하는 정n각형의 넓이는? n개의 합동인 이등변삼각형으로 나누어 구해 보자.',
    ctl: ['t66n', 't66r'],
    init: (s) => { s.t66n = 6; s.t66r = 6; },
    model: (s) => { const n = Math.round(s.t66n), R = Math.round(s.t66r), th = 360 / n, one = vdiv(vmul(vi(R * R), sinD(th)), vi(2)), tot = vmul(vi(n), one); return { n, R, th, one, tot }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99, vv = (v) => (v.x ? vcan(v) : '≈' + decS(v.v, 2)); drawReg(b, M.n, M.R, { step: st, R: `${M.R}`, ang: show(1) ? `${fmtN(M.th)}°` : '', rows: show(2) ? [{ t: `삼각형 1개 = \\frac{1}{2} × ${M.R} × ${M.R} × sin ${fmtN(M.th)}° = ${vv(M.one)}`, c: 'sky' }, { t: `${M.n}개 → ${vv(M.tot)}`, c: 'amber' }] : [] }); },
    steps: (M) => [
      `정${M.n}각형의 중심 $O$ 와 각 꼭짓점을 이으면 합동인 이등변삼각형 ${M.n}개로 나뉘어요. 중심각은 $\\frac{360^{\\circ}}{${M.n}}=${fmtN(M.th)}^{\\circ}$ 예요.`,
      `삼각형 한 개의 넓이는 $\\frac{1}{2}R^2\\sin ${fmtN(M.th)}^{\\circ}=${vtex(M.one)}$ ${M.one.x ? '' : '(근삿값)'}`,
      `전체 넓이는 ${M.n}배인 $${vtex(M.tot)}$ 예요. ($S=\\frac{n}{2}R^2\\sin\\frac{360^{\\circ}}{n}$)`
    ],
    view: (M) => ({
      guide: '<b>변의 수 n</b>과 <b>반지름 R</b>을 바꿔 보세요. 중심에서 꼭짓점으로 선을 그으면 합동인 이등변삼각형 n개로 나뉘어요. 노란 삼각형 하나의 넓이에 n을 곱해요.',
      readouts: [rd('중심각', `${fmtN(M.th)}°`, 'amber'), rd('삼각형 1개', `$${vtex(M.one)}$`, 'sky'), rd(`정${M.n}각형의 넓이`, `$${vtex(M.tot)}$`, 'green')],
      rule: '반지름 $R$ 인 원에 내접하는 정$n$각형의 넓이 $S=n\\times\\frac{1}{2}R^2\\sin\\frac{360^{\\circ}}{n}$',
      notes: notes('이 장면은 교육과정 경계의 [심화] 내용이에요.', '중심각은 $\\frac{360^{\\circ}}{n}$ 이에요. $\\frac{180^{\\circ}}{n}$ 이 아니에요.')
    }),
    gen: () => {
      const n = pick([6, 8, 12]), R = pick([2, 3, 4, 6]), th = 360 / n, tot = vmul(vi(n), vdiv(vmul(vi(R * R), sinD(th)), vi(2)));
      const wr = [[vdiv(tot, vi(2)), '$\\frac{1}{2}$ 을 한 번 더 곱했어요.'], [vmul(tot, vi(2)), '$\\frac{1}{2}$ 을 곱하지 않았어요.'], [vmul(vi(n), vdiv(vmul(vi(R * R), sinD(180 / n)), vi(2))), '중심각을 $\\frac{180^{\\circ}}{n}$ 으로 썼어요.'], [vmul(vi(n), vdiv(vmul(vi(R * R), cosD(th)), vi(2))), '$\\sin$ 대신 $\\cos$ 을 썼어요.'], [vmul(vi(n), vdiv(vmul(vi(R * R), sinD(th)), vi(1))), ''], [vi(R * R * n), '']].filter((w) => !vsame(w[0], tot));
      const q = {
        tag: '[심화] 정다각형의 넓이', key: ['reg', n, R].join('|'),
        stem: `반지름의 길이가 $${R}$ 인 원에 내접하는 정${n}각형의 넓이는?`,
        choices: mkChoices(tot, wr), fig: { n, R }, given: [`${R}`], ans: [vcan(tot)]
      };
      q.fig.answer = vcan(tot);
      return checkQ(q, [
        `반지름 $R=${R}$인 원에 내접하는 정${n}각형입니다. 중심과 꼭짓점을 이어 합동인 이등변삼각형 ${n}개로 나누어요.`,
        `한 삼각형의 두 변은 모두 $${R}$이고, 끼인 중심각은 $360^{\\circ}\\div${n}=${th}^{\\circ}$입니다.`,
        `삼각형 하나의 넓이는 $\\frac{1}{2}\\times${R}^2\\times\\sin ${th}^{\\circ}=\\frac{1}{2}\\times${R * R}\\times${vtex(sinD(th))}$입니다.`,
        `전체 넓이는 이 값의 $${n}$배이므로 $S=${n}\\times\\frac{1}{2}\\times${R * R}\\times${vtex(sinD(th))}$입니다.`
      ], { kind: 'regular-area', n, radius: R, answer: tot.v });
    },
    pdraw: (b, q, C) => drawReg(b, q.fig.n, q.fig.R, { step: C.review ? C.step : 0, R: `${q.fig.R}`, ang: C.review && C.step >= 2 ? `${360 / q.fig.n}°` : '', rows: [{ t: C.last ? `정${q.fig.n}각형의 넓이 = ${q.fig.answer}` : `정${q.fig.n}각형의 넓이 = x`, c: 'amber', size: 18 }] })
  };

  G.register(60, 't6', '⑥ 삼각형의 넓이', '삼각형의 넓이', PARAMS, [aAcute, aObt, eq, r61, bis, reg]);
})();
