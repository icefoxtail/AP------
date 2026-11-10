/* ==========================================================================
   중3 · 삼각비 — 탭 ⑤ 「높이·거리」 (t5.js, order 50) — 장면 7개
   · r5-1 두 지점에서 올려본 각(예각)   · heightObtuse [심화] 같은 쪽에서 올려본 각   · std4560Height 45°·60°   · std3060Mountain 30°·60°(이등변)
   · treeEyeHeight 눈높이가 있는 나무   · pendulumSwing 흔들리는 추   · brokenTreeCone 부러진 나무
   관측점 B·C 는 가로로만 움직입니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const { clamp, pt, mid, T, tagOut, ang, sideTag, tick, line, poly, fillPoly, fit, P, rd, notes, dashed, rint, pick, sample, bboxOf, DEG,
    vi, vsq, vf, vadd, vsub, vmul, vdiv, vsqrt, vpow2, vsame, vtex, vcan, sinD, cosD, tanD, mkChoices, degChoices, checkQ, fmtN, decS } = G;

  const PARAMS = {
    t51h: P('탑의 높이 h', 3, 12, 1, 6, { color: 'rose' }),
    t51b: P('관측점 B의 거리 BH', 2, 12, 1, 5, { color: 'sky', hint: '그림의 점 B를 가로로 끌어도 돼요' }),
    t51c: P('관측점 C의 거리 CH', 2, 12, 1, 4, { color: 'green', hint: '그림의 점 C를 가로로 끌어도 돼요' }),
    t52b: P('관측점 B의 거리 BH', 6, 16, 1, 12, { color: 'sky' }),
    t52c: P('관측점 C의 거리 CH', 2, 10, 1, 5, { color: 'green' }),
    t53a: P('두 지점 사이의 거리 a', 2, 20, 1, 12, { color: 'sky' }),
    t55d: P('나무까지의 거리 d', 4, 30, 1, 15, { color: 'sky', hint: '사람을 가로로 움직여요' }),
    t55a: P('올려본 각 A', 10, 70, 5, 35, { color: 'amber', format: G.degF }),
    t55e: P('눈높이 h₀', 1, 2.5, 0.5, 1.5, { color: 'violet' }),
    t56l: P('줄의 길이 L', 3, 15, 1, 8, { color: 'sky' }),
    t56t: P('흔들린 각 θ', 10, 80, 5, 45, { color: 'amber', format: G.degF, hint: '추를 제자리에서 흔들어요' }),
    t57d: P('꼭대기가 닿은 거리 d', 3, 20, 1, 8, { color: 'sky' }),
    t57t: P('땅과 이루는 각 θ', 20, 70, 5, 45, { color: 'amber', format: G.degF })
  };

  /* ---- 탑과 두 관측점 ---- */
  // A text box may fit the canvas while lying on a different side of the triangle.
  // Test the projected sides themselves before relocating the two standard heights.
  function heightBoxHits(a, z, q, gap = 4) {
    let lo = 0, hi = 1;
    for (const [axis, min, max] of [['x', q.x0 - gap, q.x1 + gap], ['y', q.y0 - gap, q.y1 + gap]]) {
      const d = z[axis] - a[axis];
      if (Math.abs(d) < 1e-9) { if (a[axis] < min || a[axis] > max) return false; }
      else { const t0 = (min - a[axis]) / d, t1 = (max - a[axis]) / d; lo = Math.max(lo, Math.min(t0, t1)); hi = Math.min(hi, Math.max(t0, t1)); }
    }
    return lo <= hi;
  }
  function standardHeightTag(b, A, H, B, C, value) {
    const a = b.toS(A), h = b.toS(H), sides = [b.toS(B), b.toS(C)];
    let size = b.annotationSize(value, { size: 16, weight: 800 }), w = size.width, hh = size.height + 2;
    const box = (x, y) => ({ x0: x - w / 2, x1: x + w / 2, y0: y - hh / 2, y1: y + hh / 2 });
    const original = box(a.x - 8 - w / 2, a.y + (h.y - a.y) * .3);
    if (!sides.some(p => heightBoxHits(a, p, original))) return false;
    value = value.replace(/\s*=\s*/, '=');
    size = b.annotationSize(value, { size: 16, weight: 800 }); w = size.width; hh = size.height + 2;
    const clear = q => q.x0 >= 6 && q.x1 <= b.W - 32 && q.y0 >= 48 && q.y1 <= h.y - 32 &&
      !sides.some(p => heightBoxHits(a, p, q)) && !(b._tgBoxes || []).some(p => q.x0 < p.x1 + 3 && q.x1 > p.x0 - 3 && q.y0 < p.y1 + 3 && q.y1 > p.y0 - 3);
    const candidates = [];
    // Prefer a value on AH itself, clear of both oblique sides. If the interior
    // is too narrow, use the empty exterior and retain a connector to AH.
    for (let dy = 0; dy <= (h.y - a.y) * .25; dy += 2) for (const dx of [0, -8, 8, -16, 16]) candidates.push({ x: clamp(a.x + dx, w / 2 + 6, b.W - 32 - w / 2), y: (a.y + h.y) / 2 + dy });
    candidates.push({ x: clamp(a.x - w / 2 - 28, w / 2 + 6, b.W - 32 - w / 2), y: Math.max(48 + hh / 2, a.y - 28) });
    for (const f of [.5, .4, .3, .6]) for (const x of [w / 2 + 10, b.W - 36 - w / 2]) candidates.push({ x, y: a.y + (h.y - a.y) * f });
    const target = candidates.find(p => clear(box(p.x, p.y)));
    if (!target) return false;
    const anchor = mid(A, H), at = b.toS(anchor);
    line(b, A, H, 'rose', 3);
    T(b, anchor, value, { dx: target.x - at.x, dy: target.y - at.y, size: 16, color: 'rose', leaderAnchor: anchor, leader: true });
    return true;
  }
  // o = { h, xb, xc, side:'opp'|'same', step, L:{a,h,B,C,x,y,hx}, handle, s }
  function drawTower(b, o) {
    const { h, xb } = o, xc = o.same ? -o.xc : o.xc, st = o.step == null ? 99 : o.step;
    const H0 = pt(0, 0), A = pt(0, -h), B = pt(-xb, 0), Cc = pt(xc, 0), L = o.L || {};
    const xs = [B.x, Cc.x, 0];
    fit(b, bboxOf([pt(Math.min(...xs), -h), pt(Math.max(...xs), 0)]), { t: 54, b: 58 + (L.a && (L.BH === 'x' || L.CH === 'x') ? 44 : 0) + (o.rows ? o.rows.length * 26 : 0), l: 58, r: 58 });
    // A current standard-height question has no top chip on a narrow stage.
    // Its fixed reservations previously shrank AH below the angle-label span.
    // Refit only when that actual projection is too small; keep the dimension
    // line under BC and the original taller/wider arrangements unchanged.
    if (o.currentStandard && !b.thumb && b.W < 560 && h * b.k < 110) {
      const groundUnknown = L.a && (L.BH === 'x' || L.CH === 'x');
      fit(b, bboxOf([pt(Math.min(...xs), -h), pt(Math.max(...xs), 0)]), { t: 28, problemTop: 28, b: groundUnknown ? 88 : 64, l: 50, r: 50 });
    }
    const gx0 = Math.min(...xs) - 0.6, gx1 = Math.max(...xs) + 0.6;
    line(b, pt(gx0, 0), pt(gx1, 0), 'muted', 3);
    if (st >= 1) { fillPoly(b, [A, B, H0], 'sky', 0.14); fillPoly(b, o.same ? [A, Cc, H0] : [A, H0, Cc], 'green', 0.16); }
    if (o.mountain) fillPoly(b, [pt(gx0, 0), A, pt(gx1, 0)], 'green', 0.1);
    line(b, A, H0, 'ink', 5); line(b, A, B, 'ink', 2.6); line(b, A, Cc, 'ink', 2.6);
    if (o.iso) { tick(b, A, Cc, 1, 'amber'); tick(b, B, Cc, 1, 'amber'); }
    ang(b, H0, o.same ? Cc : B, A, { color: 'ink', r: 16 });
    const angleRadius = (V, U, Z, radius) => o.currentStandard && !b.thumb
      ? Math.min(radius, Math.max(12, .34 * b.k * Math.min(Math.hypot(U.x - V.x, U.y - V.y), Math.hypot(Z.x - V.x, Z.y - V.y)))) : radius;
    ang(b, B, H0, A, { color: 'sky', r: angleRadius(B, H0, A, 38), label: L.B, size: 16 });
    ang(b, Cc, H0, A, { color: 'green', r: angleRadius(Cc, H0, A, 36), label: L.C, size: 16, rings: 2 });
    if (L.x) ang(b, A, B, H0, { color: 'sky', r: 30, label: L.x, size: 15, labelDist: 46 });
    if (L.y) ang(b, A, H0, Cc, { color: 'green', r: 30, label: L.y, size: 15, rings: 2, labelDist: 46 });
    b.point(A, { color: 'ink', r: 5 }); tagOut(b, A, pt(0, 3), 'A', { size: 17, gap: 11 });
    b.point(H0, { color: 'ink', r: 4.5 }); T(b, H0, 'H', { dy: 20, size: 17 });
    if (o.handle) { b.handle('B', B, { color: 'sky', r: 8, ariaLabel: '관측점 B 끌기', drag: o.handle.B }); b.handle('C', Cc, { color: 'green', r: 8, ariaLabel: '관측점 C 끌기', drag: o.handle.C }); }
    else { b.point(B, { color: 'sky', r: 5 }); b.point(Cc, { color: 'green', r: 5 }); }
    T(b, B, 'B', { dy: 22, dx: -4, size: 17, color: 'sky' }); T(b, Cc, 'C', { dy: 22, dx: 4, size: 17, color: 'green' });
    if (L.h && !(o.identifyHeight && !b.thumb && standardHeightTag(b, A, H0, B, Cc, L.h))) {
      const heightCallout = o.heightCallout && !b.thumb && b.W < 560, at = G.lerp(A, H0, heightCallout ? .56 : .3);
      T(b, at, L.h, { dx: L.hx ? 0 : -8, size: L.hx ? 21 : 16, color: L.hx ? 'amber' : 'rose', align: L.hx ? 'center' : 'right', ...(heightCallout ? { leaderAnchor: at, leader: true } : {}) });
    }
    const askG = L.BH === 'x' || L.CH === 'x';
    if (L.a && !askG) { line(b, pt(Math.min(B.x, Cc.x), 0), pt(Math.max(B.x, Cc.x), 0), 'amber', 4); T(b, mid(B, Cc), L.a, { dy: 44, size: 17, color: 'amber' }); }
    else if (L.a) { // 구하는 것이 BH·CH 일 때: BC 는 땅 아래의 치수선으로 따로 표시
      const off = 46 / (b.k || 60), x0 = Math.min(B.x, Cc.x), x1 = Math.max(B.x, Cc.x), cap = 6 / (b.k || 60);
      line(b, pt(x0, off), pt(x1, off), 'violet', 3); line(b, pt(x0, off - cap), pt(x0, off + cap), 'violet', 3); line(b, pt(x1, off - cap), pt(x1, off + cap), 'violet', 3);
      T(b, pt((x0 + x1) / 2, off), 'BC = ' + L.a, { dy: 20, size: 17, color: 'violet' });
    }
    if (L.BH && (st >= 1 || L.BH === 'x')) { if (L.BH === 'x') { line(b, B, H0, 'amber', 5.5); T(b, mid(B, H0), 'BH = x', { dy: 30, size: 19, color: 'amber' }); } else T(b, mid(B, H0), L.BH, { dy: -14, size: 15, color: 'sky' }); }
    if (L.CH && (st >= 1 || L.CH === 'x')) { if (L.CH === 'x') { line(b, Cc, H0, 'amber', 5.5); T(b, mid(Cc, H0), 'CH = x', { dy: 30, size: 19, color: 'amber' }); } else T(b, mid(Cc, H0), L.CH, { dy: -14, size: 15, color: 'green' }); }
    (o.rows || []).forEach((r, i) => T(b, pt((Math.min(...xs) + Math.max(...xs)) / 2, 0), r.t, { dy: 72 + i * 26, size: 16, color: r.c }));
  }
  const px = (s, key, sgn) => (w) => { s[key] = clamp(Math.round(sgn * w.x), 2, 12); };

  /* ---- 높이 공식 계산 (V) ---- */
  // 각 B, C(올려본 각), 두 지점 사이의 거리 a 로부터. same: 같은 쪽(둔각)
  function heightFrom(a, Bd, Cd, same) {
    const cb = vdiv(vi(1), tanD(Bd)), cc = vdiv(vi(1), tanD(Cd)), den = same ? vsub(cb, cc) : vadd(cb, cc);
    const h = vdiv(a, den), bh = vmul(h, cb), ch = vmul(h, cc);
    return { h, bh, ch, den, cb, cc };
  }
  function heightProblem(pairs, tag, askKinds, same) {
    const pair = pick(pairs), a0 = pick([4, 6, 8, 10, 12]), a = vi(a0), R = heightFrom(a, pair[0], pair[1], same);
    const ask = pick(askKinds);
    const ans = ask === 'h' ? R.h : ask === 'bh' ? R.bh : R.ch;
    const wr = [[vmul(a, vsq(3)), '높이를 구하는 식을 다시 세워요. 변의 비를 잘못 짝지었어요.'], [vdiv(a, vsq(3)), '높이를 구하는 식을 다시 세워요.'], [vdiv(a, vi(2)), '높이는 $BC$ 의 반이 아니에요.'], [vmul(a, vdiv(vi(1), vadd(tanD(pair[0]), tanD(pair[1])))), '$\\tan$ 의 합으로 나누었어요. 올려본 각이 아니라 높이를 기준으로 식을 세워요.'], [vadd(R.bh, R.ch), '$BH+CH$ 는 $BC$ 예요.'], [R.h, ''], [R.bh, ''], [R.ch, ''], [vmul(R.h, vsq(2)), '']].filter((w) => !vsame(w[0], ans));
    const lab = { h: 'x' };
    const L = { B: `${pair[0]}°`, C: `${pair[1]}°`, a: `${a0}` };
    if (ask === 'h') L.h = 'x'; else if (ask === 'bh') L.BH = 'x'; else L.CH = 'x';
    const nameAsk = { h: '\\overline{AH}', bh: '\\overline{BH}', ch: '\\overline{CH}' }[ask];
    const q = {
      tag, key: [tag, pair.join(','), a0, ask, same].join('|'),
      stem: same ? `그림과 같이 지면에 수직인 탑 $AH$ 가 있고, 지면의 세 점 $B$, $C$, $H$ 는 한 직선 위에 있다. $\\angle ABH=${pair[0]}^{\\circ}$, $\\angle ACH=${pair[1]}^{\\circ}$, $\\overline{BC}=${a0}$ 일 때, $${nameAsk}=x$ 의 값은?` : `그림과 같이 지면에 수직인 탑 $AH$ 가 있고, 지면의 세 점 $B$, $H$, $C$ 는 한 직선 위에 있다. $\\angle ABH=${pair[0]}^{\\circ}$, $\\angle ACH=${pair[1]}^{\\circ}$, $\\overline{BC}=${a0}$ 일 때, $${nameAsk}=x$ 의 값은?`,
      choices: mkChoices(ans, wr), fig: { pair, a0, same, ask, R: { h: R.h.v, bh: R.bh.v, ch: R.ch.v }, L }, given: [`${pair[0]}°`, `${pair[1]}°`, `${a0}`], ans: [vcan(ans)]
    };
    q.fig.work = { h: vcan(R.h), bh: vcan(R.bh), ch: vcan(R.ch) };
    return checkQ(q, [
      `두 관측점의 각은 $${pair[0]}^{\\circ}$, $${pair[1]}^{\\circ}$이고 $BC=${a0}$입니다. ${same ? '$B,C$는 수선의 발 $H$의 같은 쪽에 있어요.' : '수선의 발 $H$가 $B,C$ 사이에 있어요.'}`,
      `높이를 $h$라 두면 $BH=\\frac{h}{\\tan ${pair[0]}^{\\circ}}$, $CH=\\frac{h}{\\tan ${pair[1]}^{\\circ}}$입니다.`,
      `$BC=BH${same ? '-' : '+'}CH$이므로 $h\\left(${vtex(R.cb)}${same ? '-' : '+'}${vtex(R.cc)}\\right)=${a0}$입니다.`,
      ask === 'h' ? `$h=\\frac{${a0}}{${vtex(R.den)}}$를 계산해요.` : `먼저 $h=${vtex(R.h)}$를 구한 뒤, $${ask.toUpperCase()}=\\frac{${vtex(R.h)}}{\\tan ${pair[ask === 'bh' ? 0 : 1]}^{\\circ}}$로 거리를 구해요.`
    ], { kind: 'height', angles: pair, distance: a0, same, ask, answer: ans.v });
  }
  function pdrawTower(b, q, C) {
    const f = q.fig;
    // 보기 좋게 그리기: 그림의 높이·거리는 비율만 맞춰요(값은 그리지 않음)
    const L = { ...f.L, hx: f.ask === 'h' && !C.last };
    if (C.review && C.step >= 2) {
      if (f.ask !== 'h') L.h = C.step >= 4 ? f.work.h : 'h';
      if (f.ask !== 'bh') L.BH = C.last ? f.work.bh : 'BH';
      if (f.ask !== 'ch') L.CH = C.last ? f.work.ch : 'CH';
    }
    if (C.last) L[{ h: 'h', bh: 'BH', ch: 'CH' }[f.ask]] = f.work[f.ask];
    drawTower(b, { h: f.R.h, xb: f.R.bh, xc: Math.abs(f.R.ch), same: f.same, step: C.review ? C.step - 1 : 0, mountain: f.mount, L,
      currentStandard: !!C.standardHeight, identifyHeight: !!C.standardHeight && !L.hx });
  }

  /* ====================================================================== 1. 두 지점에서 올려본 각 */
  const tw = (id, title, short, same, defs, extra) => ({ id, title, short, ...extra });
  const r51 = {
    id: 'r5-1', title: '두 지점에서 탑을 올려본 각', short: '두 지점에서 올려보기',
    question: '탑의 양쪽 지면에서 꼭대기를 올려본 각을 알면 탑의 높이를 구할 수 있을까? 관측점 B, C를 가로로 움직여 높이가 변하지 않는 것을 확인해 보자.',
    ctl: ['t51h', 't51b', 't51c'],
    init: (s) => { s.t51h = 6; s.t51b = 5; s.t51c = 4; },
    model: (s) => {
      const h = Math.round(s.t51h), xb = Math.round(s.t51b), xc = Math.round(s.t51c), a = xb + xc;
      const B = Math.atan2(h, xb) / DEG, C = Math.atan2(h, xc) / DEG, x = 90 - B, y = 90 - C;
      return { h, xb, xc, a, B, C, x, y, den: Math.tan(x * DEG) + Math.tan(y * DEG) };
    },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99, d1 = (v) => `≈${fmtN(v)}°`;
      drawTower(b, { h: M.h, xb: M.xb, xc: M.xc, step: st, heightCallout: true, L: { B: d1(M.B), C: d1(M.C), x: show(1) ? 'x' : '', y: show(1) ? 'y' : '', a: `${M.a}`, h: `${M.h}`, BH: show(1) ? `${M.xb}` : '', CH: show(1) ? `${M.xc}` : '' }, handle: C.tab === 'explore' && !C.thumb ? { B: px(s, 't51b', -1), C: px(s, 't51c', 1) } : null, rows: show(3) ? [{ t: `h = \\frac{${M.a}}{tan x + tan y} = ${M.h}`, c: 'amber' }] : [] });
    },
    steps: (M) => [
      `탑의 높이를 $h=AH$ 라 하고 $\\angle BAH=x$, $\\angle CAH=y$ 라 해요. 올려본 각이 $\\angle B=${fmtN(M.B)}^{\\circ}$, $\\angle C=${fmtN(M.C)}^{\\circ}$ 이면 $x=90^{\\circ}-\\angle B$, $y=90^{\\circ}-\\angle C$ 예요.`,
      '직각삼각형 $ABH$, $ACH$ 에서 $BH=h\\tan x$, $CH=h\\tan y$ 예요.',
      `$BC=BH+CH=h(\\tan x+\\tan y)=${M.a}$ 이므로 $h=\\frac{${M.a}}{\\tan x+\\tan y}=\\frac{${M.a}}{${decS(M.den, 3)}}=${M.h}$`
    ],
    view: (M) => ({
      guide: '<b>점 B와 C를 가로로 끌어</b> 보세요(또는 막대). 두 지점 사이의 거리와 올려본 각은 바뀌지만, 탑의 높이 h는 그대로예요. 높이를 기준으로 식을 세우면 $h=\\frac{a}{\\tan x+\\tan y}$ 예요.',
      readouts: [rd('$BC=a$', String(M.a), 'amber'), rd('$\\angle B$ , $\\angle C$', `${fmtN(M.B)}° , ${fmtN(M.C)}°`, 'sky'), rd('탑의 높이 $h$', String(M.h), 'rose', '관측점을 움직여도 같아요')],
      rule: '$h=\\frac{a}{\\tan x+\\tan y}$ ($x$, $y$ 는 수선 $AH$ 가 꼭대기 $A$ 에서 이루는 각)',
      notes: notes('밑각 대신 <b>높이를 기준으로 한 위쪽 각</b> $x$, $y$ 를 쓰면 $BH=h\\tan x$ 로 곱셈 식이 돼요.', '$BH=\\frac{h}{\\tan B}$ 로 써도 같아요. 어느 각을 기준으로 하는지 헷갈리지 않게 해요.')
    }),
    gen: () => heightProblem([[45, 60], [60, 45], [45, 30], [30, 45], [60, 30], [30, 60]], '두 지점에서 올려본 각', ['h', 'h', 'bh', 'ch'], false),
    pdraw: pdrawTower
  };

  /* ====================================================================== 2. [심화] 같은 쪽에서 올려본 각 */
  const r52 = {
    id: 'heightObtuse', title: '[심화] 같은 쪽의 두 지점에서 올려본 각', short: '[심화] 같은 쪽에서',
    question: '두 관측점이 탑의 같은 쪽에 있으면 BC = BH − CH 가 된다. 높이는 어떻게 구할까?',
    ctl: ['t51h', 't52b', 't52c'],
    init: (s) => { s.t51h = 6; s.t52b = 12; s.t52c = 5; },
    model: (s) => {
      const h = Math.round(s.t51h), xb = Math.round(s.t52b), xc = Math.min(Math.round(s.t52c), xb - 1), a = xb - xc;
      const B = Math.atan2(h, xb) / DEG, C = Math.atan2(h, xc) / DEG;
      return { h, xb, xc, a, B, C, den: xb / h - xc / h };
    },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99, d1 = (v) => `≈${fmtN(v)}°`;
      drawTower(b, { h: M.h, xb: M.xb, xc: M.xc, same: true, step: st, L: { B: d1(M.B), C: d1(M.C), a: `${M.a}`, h: `${M.h}`, BH: show(1) ? `${M.xb}` : '', CH: show(1) ? `${M.xc}` : '' }, rows: show(3) ? [{ t: `BC = BH − CH,   h = \\frac{${M.a}}{tan x − tan y}`, c: 'amber' }] : [] });
    },
    steps: (M) => [
      '두 지점 $B$, $C$ 가 수선의 발 $H$ 의 같은 쪽에 있어요. $x=90^{\\circ}-\\angle B$, $y=90^{\\circ}-\\angle ACH$ 로 높이 $AH$ 를 기준으로 해요.',
      '$BH=h\\tan x$, $CH=h\\tan y$ 예요. 큰 삼각형의 밑변에서 작은 삼각형의 밑변을 빼면 $BC$ 예요.',
      `$BC=BH-CH=h(\\tan x-\\tan y)=${M.a}$ 이므로 $h=\\frac{${M.a}}{\\tan x-\\tan y}=${M.h}$`
    ],
    view: (M) => ({
      guide: '<b>BH</b>와 <b>CH</b>를 바꿔 보세요. 같은 쪽에서 재면 두 밑변의 <b>차</b>가 두 지점 사이의 거리예요.',
      readouts: [rd('$BC=BH-CH$', String(M.a), 'amber'), rd('탑의 높이 $h$', String(M.h), 'rose')],
      rule: '같은 쪽에서 올려본 두 각 → $h=\\frac{a}{\\tan x-\\tan y}$ (큰 밑변 − 작은 밑변)',
      notes: notes('둔각삼각형 $ABC$ 가 만들어져요. $\\angle ACH$ 는 삼각형 $ABC$ 의 <b>외각</b>이에요.')
    }),
    gen: () => heightProblem([[30, 60], [30, 45], [45, 60]], '[심화] 같은 쪽에서 올려본 각', ['h', 'h', 'bh'], true),
    pdraw: pdrawTower
  };

  /* ====================================================================== 3. 45°·60° 표준형 */
  const r53 = {
    id: 'std4560Height', title: '양 끝각이 45°·60°인 삼각형의 높이', short: '45°·60° 높이',
    question: '밑변 BC의 양 끝각이 45°, 60°이면 BH와 CH는 높이로 어떻게 나타낼까?',
    ctl: ['t53a'],
    init: (s) => { s.t53a = 12; },
    model: (s) => { const a = vi(Math.round(s.t53a)), R = heightFrom(a, 45, 60, false); return { a, ...R }; },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99;
      drawTower(b, { h: M.h.v, xb: M.bh.v, xc: M.ch.v, step: st, identifyHeight: true, L: { B: '45°', C: '60°', a: `${M.a.v}`, h: show(3) ? `h = ${vcan(M.h)}` : 'h', BH: show(1) ? 'BH = h' : '', CH: show(1) ? `CH = ${vcan(vdiv(vi(1), vsq(3)))}h` : '' }, rows: show(2) ? [{ t: `BH + CH = h + \\frac{√3}{3}h = ${M.a.v}`, c: 'amber' }] : [] });
    },
    steps: (M) => [
      '$\\angle B=45^{\\circ}$ 이므로 $BH=AH=h$, $\\angle C=60^{\\circ}$ 이므로 $CH=\\frac{h}{\\tan60^{\\circ}}=\\frac{\\sqrt{3}}{3}h$ 예요.',
      `$BC=BH+CH=h+\\frac{\\sqrt{3}}{3}h=${M.a.v}$`,
      `$h=\\frac{${M.a.v}}{1+\\frac{\\sqrt{3}}{3}}=${vtex(M.h)}$ (분모를 유리화해요.)`
    ],
    view: (M) => ({
      guide: '<b>BC의 길이</b>를 바꿔 보세요. 높이는 $h=\\frac{3(3-\\sqrt{3})}{6}\\cdot$ 처럼 $BC$ 의 일정한 배수예요.',
      readouts: [rd('$BH$', `$${vtex(M.bh)}$`, 'sky'), rd('$CH$', `$${vtex(M.ch)}$`, 'green'), rd('$h$', `$${vtex(M.h)}$`, 'rose')],
      rule: '45°·60° 인 삼각형: $BH=h$, $CH=\\frac{\\sqrt{3}}{3}h$',
      notes: notes('$h$ 에 대한 일차방정식 $(1+\\frac{\\sqrt{3}}{3})h=a$ 를 풀 때 분모를 유리화해요.')
    }),
    gen: () => heightProblem([[45, 60]], '45°·60°인 삼각형의 높이', ['h', 'h', 'bh', 'ch'], false),
    pdraw: (b, q, C) => pdrawTower(b, q, { ...C, standardHeight: true })
  };

  /* ====================================================================== 4. 30°·60° 이등변 (산의 높이) */
  const r54 = {
    id: 'std3060Mountain', title: '양 끝각이 30°·60°인 둔각삼각형 — 산의 높이', short: '30°·60° 산의 높이',
    question: '같은 쪽에서 올려본 각이 30°, 60°이면 삼각형 ABC는 어떤 삼각형일까?',
    ctl: ['t53a'],
    init: (s) => { s.t53a = 10; },
    model: (s) => { const a = vi(Math.round(s.t53a)), h = vmul(vdiv(vsq(3), vi(2)), a); return { a, h, R: heightFrom(a, 30, 60, true) }; },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99, R = M.R;
      drawTower(b, { h: R.h.v, xb: R.bh.v, xc: R.ch.v, same: true, step: st, mountain: true, iso: show(1), identifyHeight: true, L: { B: '30°', C: '60°', a: `${M.a.v}`, h: show(3) ? `h = ${vcan(M.h)}` : 'h' }, rows: show(1) ? [{ t: '∠BAC = 60° − 30° = 30° → AC = BC', c: 'amber' }] : [] });
    },
    steps: (M) => [
      '$\\angle ACH=60^{\\circ}$ 는 $\\triangle ABC$ 의 외각이에요. 외각은 이웃하지 않는 두 내각의 합이므로 $\\angle BAC=60^{\\circ}-30^{\\circ}=30^{\\circ}$ 예요.',
      `$\\angle B=\\angle BAC=30^{\\circ}$ 이므로 $\\triangle ABC$ 는 이등변삼각형이에요. $AC=BC=${M.a.v}$`,
      `$\\triangle ACH$ 에서 $h=AC\\sin60^{\\circ}=${M.a.v}\\times\\frac{\\sqrt{3}}{2}=${vtex(M.h)}$`
    ],
    view: (M) => ({
      guide: '<b>BC</b>를 바꿔 보세요. 30°와 60°이면 삼각형 ABC가 이등변삼각형이 되어 높이가 $\\frac{\\sqrt{3}}{2}BC$ 로 바로 구해져요.',
      readouts: [rd('$AC=BC$', String(M.a.v), 'sky'), rd('높이 $h$', `$${vtex(M.h)}$`, 'rose')],
      rule: '30°·60°(같은 쪽) → $\\triangle ABC$ 는 $AC=BC$ 인 이등변삼각형 → $h=\\frac{\\sqrt{3}}{2}BC$',
      notes: notes('이 경우는 $\\tan$ 의 차를 쓰지 않고 이등변삼각형을 찾는 것이 더 빨라요.')
    }),
    gen: () => { const q = heightProblem([[30, 60]], '30°·60°인 둔각삼각형의 높이', ['h'], true); q.fig.mount = true; q.stem = q.stem.replace('지면에 수직인 탑 $AH$ 가 있고', '산 꼭대기 $A$ 에서 지면에 내린 수선의 발이 $H$ 이고'); return q; },
    pdraw: (b, q, C) => pdrawTower(b, q, { ...C, standardHeight: true })
  };

  /* ====================================================================== 5. 눈높이가 있는 나무 */
  function drawTree(b, o) {
    const { d, e, th, H } = o, tipY = -H, eye = pt(-d, -e), top = pt(0, -H), gnd = pt(-d, 0), base = pt(0, 0), st = o.step == null ? 99 : o.step;
    fit(b, bboxOf([pt(-d, -H), pt(0, 0)]), { t: 54, b: 60, l: 70, r: 76 });
    line(b, pt(-d - 1, 0), pt(1, 0), 'muted', 3);
    line(b, pt(0, 0), top, 'ink', 7); b.circle(pt(0, -H), 0.001, { color: 'green' });
    const k = b.k, hd = 7 / k;
    b.path([pt(-d, -e + hd * 3), pt(-d, -hd * 0)], { color: 'ink', width: 5 });
    b.point(pt(-d, -e - 0.0), { color: 'amber', r: 7, glow: false });
    line(b, eye, pt(0, -e), 'violet', 2.4, { dash: dashed });
    line(b, eye, top, 'ink', 3);
    ang(b, eye, pt(0, -e), top, { color: 'amber', r: 38, label: o.thL || `${th}°`, size: 16 });
    ang(b, pt(0, -e), eye, top, { color: 'ink', r: 14 });
    const L = o.L || {};
    if (L.e) T(b, mid(gnd, eye), L.e, { dx: -10, size: 16, color: 'violet', align: 'right' });
    if (L.d) T(b, mid(gnd, base), L.d, { dy: 22, size: 17, color: 'sky' });
    if (L.up && st >= 1) T(b, mid(pt(0, -e), top), L.up, { dx: 10, size: 16, color: 'rose', align: 'left' });
    if (L.H) { const x = 0.35; line(b, pt(x, 0), pt(x, -H), 'amber', 3); T(b, pt(x, -H / 2), L.H, { dx: 12, size: L.Hx ? 21 : 17, color: 'amber', align: 'left' }); }
    T(b, top, '나무 꼭대기', { dy: -18, size: 15, color: 'green' });
    (o.rows || []).forEach((r, i) => T(b, pt(-d / 2, 0), r.t, { dy: 46 + i * 26, size: 16, color: r.c }));
  }
  const tree = {
    id: 'treeEyeHeight', title: '눈높이가 있는 나무의 높이', short: '눈높이와 나무',
    question: '눈높이가 h₀인 사람이 나무에서 d만큼 떨어져 꼭대기를 올려보면 나무의 높이는? 눈높이를 빠뜨리지 않도록 해 보자.',
    ctl: ['t55d', 't55a', 't55e'],
    init: (s) => { s.t55d = 15; s.t55a = 35; s.t55e = 1.5; },
    model: (s) => { const d = Math.round(s.t55d), th = Math.round(s.t55a), e = s.t55e, up = d * Math.tan(th * DEG); return { d, th, e, up, H: up + e, exact: [30, 45, 60].includes(th) }; },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99;
      drawTree(b, { d: M.d, e: M.e, th: M.th, H: M.H, step: st, L: { e: `${fmtN(M.e)}`, d: `${M.d}`, up: show(1) ? `≈${decS(M.up, 2)}` : '', H: show(2) ? `≈${decS(M.H, 2)}` : '' }, rows: show(2) ? [{ t: `나무의 높이 = ${decS(M.up, 2)} + ${fmtN(M.e)} ≈ ${decS(M.H, 2)}`, c: 'amber' }] : [] });
    },
    steps: (M) => [
      `눈의 높이에서 나무 꼭대기를 올려본 각이 $${M.th}^{\\circ}$ 예요. 눈에서 나무까지의 거리 $d=${M.d}$ 가 밑변이에요.`,
      `눈높이 위로 올라간 높이는 $d\\tan ${M.th}^{\\circ}=${M.d}\\times${decS(Math.tan(M.th * DEG), 4)}\\approx${decS(M.up, 2)}$ 예요.`,
      `나무의 전체 높이는 눈높이를 더해서 $${decS(M.up, 2)}+${fmtN(M.e)}\\approx${decS(M.H, 2)}$ 예요.`
    ],
    view: (M) => ({
      guide: '<b>거리 d</b>와 <b>올려본 각</b>, <b>눈높이</b>를 바꿔 보세요. 사람이 가로로 움직이면 눈높이 위의 높이가 바뀌어요. 눈높이는 따로 더해야 해요.',
      readouts: [rd('눈높이 위의 높이', decS(M.up, 2), 'rose', '$d\\tan A$'), rd('나무의 높이', decS(M.H, 2), 'amber', '$d\\tan A+h_0$')],
      rule: '(나무의 높이) = (거리) × $\\tan A$ + (눈높이)',
      notes: notes('눈높이 $h_0$ 를 더하는 것을 잊지 마세요. 삼각비로 구한 값은 눈높이 위의 부분이에요.')
    }),
    gen: () => {
      const th = pick([30, 45, 60]), e = pick([1, 2]), d = th === 30 ? pick([6, 9, 12, 15]) : th === 60 ? pick([3, 4, 5, 6]) : pick([4, 6, 8, 10]);
      const up = vmul(vi(d), tanD(th)), H = vadd(up, vi(e));
      const wr = [[up, '눈높이를 더하지 않았어요.'], [vadd(vmul(vi(d), cosD(th)), vi(e)), '$\\tan$ 대신 $\\cos$ 을 곱했어요.'], [vadd(vmul(vi(d), sinD(th)), vi(e)), '$\\tan$ 대신 $\\sin$ 을 곱했어요.'], [vadd(vdiv(vi(d), tanD(th)), vi(e)), '곱해야 하는데 나누었어요.'], [vadd(vmul(vi(d), tanD(90 - th)), vi(e)), '기준각이 $90^{\\circ}-A$ 가 되었어요.']];
      const q = {
        tag: '눈높이가 있는 나무', key: ['tree', th, e, d].join('|'),
        stem: `눈높이가 $${e}$ 인 사람이 나무에서 $${d}$ 만큼 떨어진 곳에서 나무의 꼭대기를 올려본 각이 $${th}^{\\circ}$ 일 때, 나무의 높이 $x$ 는? (단, 땅은 평평하고 나무는 땅과 수직이다.)`,
        choices: mkChoices(H, wr), fig: { d, e, th }, given: [`${d}`, `${e}`, `${th}°`], ans: [vcan(H)]
      };
      q.fig.up = vcan(up); q.fig.height = vcan(H);
      return checkQ(q, [
        `나무까지 수평 거리는 $${d}$, 눈높이는 $${e}$, 올려본 각은 $${th}^{\\circ}$입니다. 눈높이에서 나무까지 수평 보조선을 그어요.`,
        `보조선 위쪽 높이를 $h$라고 하면 $\\tan ${th}^{\\circ}=\\frac{h}{${d}}$입니다.`,
        `$h=${d}\\tan ${th}^{\\circ}=${d}\\times${vtex(tanD(th))}=${vtex(up)}$입니다.`,
        `문제는 나무 전체 높이를 묻습니다. 따라서 $x=h+${e}=${vtex(up)}+${e}$입니다.`
      ], { kind: 'tree', distance: d, angle: th, eye: e, answer: H.v });
    },
    pdraw: (b, q, C) => { const f = q.fig, H = f.d * Math.tan(f.th * DEG) + f.e; drawTree(b, { d: f.d, e: f.e, th: f.th, H, step: C.review ? C.step : 0, L: { e: `${f.e}`, d: `${f.d}`, up: C.review && C.step >= 3 ? f.up : '', H: C.last ? f.height : 'x', Hx: !C.last } }); }
  };

  /* ====================================================================== 6. 흔들리는 추 */
  function drawPend(b, L, th, o = {}) {
    const t = th * DEG, O = pt(0, 0), R0 = pt(0, L), Sw = pt(L * Math.sin(t), L * Math.cos(t)), F = pt(0, L * Math.cos(t));
    fit(b, bboxOf([pt(-L * 0.25, -0.3), pt(L * Math.sin(t) + 0.5, L)]), { t: 50, b: 56, l: 56, r: 70 });
    line(b, pt(-L * 0.45, 0), pt(L * 0.45, 0), 'ink', 5);
    line(b, O, R0, 'muted', 2, { dash: dashed }); line(b, O, Sw, 'ink', 3.4);
    line(b, F, Sw, 'violet', 2.2, { dash: dashed });
    b.circle(R0, 0.22, { color: 'muted', width: 2, dash: [4, 4] }); b.point(Sw, { color: 'amber', r: 9 });
    ang(b, O, R0, Sw, { color: 'amber', r: 36, label: `${th}°`, size: 16 });
    ang(b, F, O, Sw, { color: 'ink', r: 12 });
    T(b, mid(O, Sw), o.Lt || `${L}`, { dx: 16, dy: -8, size: 17, color: 'sky', align: 'left' });
    const x = L * Math.sin(t) * 0.35 + 0.4; // 올라간 높이 표시(오른쪽)
    line(b, pt(Sw.x + 0.35, Sw.y), pt(Sw.x + 0.35, L), 'amber', 3);
    T(b, pt(Sw.x + 0.35, (Sw.y + L) / 2), o.ht || '', { dx: 12, size: o.hx ? 21 : 17, color: 'amber', align: 'left' });
    if (o.drop) T(b, mid(O, F), o.drop, { dx: -8, size: 15, color: 'violet', align: 'right' });
    b.point(O, { color: 'ink', r: 4.5 }); (o.rows || []).forEach((r, i) => T(b, pt(0, L), r.t, { dy: 40 + i * 26, size: 16, color: r.c }));
  }
  const pend = {
    id: 'pendulumSwing', title: '[주의] 흔들리는 추가 올라간 높이', short: '흔들리는 추',
    question: '길이가 L인 줄에 매달린 추가 θ만큼 흔들렸을 때 가장 낮은 곳보다 얼마나 올라갔을까? L cos θ와 헷갈리지 않도록 해 보자.',
    ctl: ['t56l', 't56t'],
    init: (s) => { s.t56l = 8; s.t56t = 45; },
    model: (s) => { const L = Math.round(s.t56l), th = Math.round(s.t56t), drop = L * Math.cos(th * DEG); return { L, th, drop, h: L - drop, hv: vmul(vi(L), vsub(vi(1), cosD(th))), dv: vmul(vi(L), cosD(th)) }; },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99;
      drawPend(b, M.L, M.th, { drop: show(1) ? `L cos θ ${M.dv.x ? '= ' + vcan(M.dv) : '≈ ' + decS(M.drop, 2)}` : '', ht: show(2) ? `h ${M.hv.x ? '= ' + vcan(M.hv) : '≈ ' + decS(M.h, 2)}` : 'h', rows: show(2) ? [{ t: 'h = L − L cos θ = L(1 − cos θ)', c: 'amber' }] : [] });
    },
    steps: (M) => [
      `추가 $\\theta=${M.th}^{\\circ}$ 흔들렸을 때 걸이에서 추까지의 수직 거리(내려간 거리)는 $L\\cos\\theta=${vtex(M.dv)}$ ${M.dv.x ? '' : '(근삿값)'}`,
      `가장 낮은 곳까지의 거리는 줄의 길이 $L=${M.L}$ 이에요.`,
      `올라간 높이는 $h=L-L\\cos\\theta=L(1-\\cos\\theta)=${vtex(M.hv)}$ ${M.hv.x ? '' : '(근삿값)'}`
    ],
    view: (M) => ({
      guide: '<b>줄의 길이</b>와 <b>흔들린 각</b>을 바꿔 보세요. 추가 올라간 높이는 줄의 길이에서 내려간 수직 거리를 뺀 값이에요.',
      readouts: [rd('$L\\cos\\theta$', `$${vtex(M.dv)}$`, 'violet'), rd('올라간 높이 $h$', `$${vtex(M.hv)}$`, 'amber')],
      rule: '추가 올라간 높이 $h=L(1-\\cos\\theta)$',
      notes: notes('$L\\cos\\theta$ 는 걸이에서 추까지의 수직 거리예요. 올라간 높이가 아니에요.', '$\\theta$ 가 커질수록 $\\cos\\theta$ 가 작아져서 $h$ 는 커져요.')
    }),
    gen: () => {
      const th = pick([30, 45, 60]), L = th === 30 ? pick([4, 6, 8, 10]) : th === 45 ? pick([4, 6, 8, 10]) : pick([4, 6, 8, 10, 12]);
      const h = vmul(vi(L), vsub(vi(1), cosD(th))), wr = [[vmul(vi(L), cosD(th)), '$L\\cos\\theta$ 는 내려간 수직 거리예요.'], [vmul(vi(L), sinD(th)), '$\\sin$ 을 썼어요.'], [vmul(vi(L), vsub(vi(1), sinD(th))), '$\\cos$ 대신 $\\sin$ 을 썼어요.'], [vi(L), '줄의 길이예요.'], [vmul(vi(L), vsub(cosD(th), vi(1))), '부호가 반대예요.']];
      const q = {
        tag: '[주의] 올라간 높이', key: ['pend', th, L].join('|'),
        stem: `길이가 $${L}$ 인 줄에 매달린 추가 수직선과 $${th}^{\\circ}$ 의 각을 이루도록 흔들렸다. 추가 가장 낮은 곳에 있을 때보다 올라간 높이 $x$ 는?`,
        choices: mkChoices(h, wr, { valid: (v) => v.v > 0 }), fig: { L, th }, given: [`${L}`, `${th}°`], ans: [vcan(h)]
      };
      q.fig.drop = vcan(vmul(vi(L), cosD(th))); q.fig.height = vcan(h);
      return checkQ(q, [
        `줄의 길이는 $L=${L}$, 수직선과 줄이 이루는 각은 $${th}^{\\circ}$입니다. 가장 낮은 위치를 점선으로 표시해요.`,
        `추에서 수직선에 수선을 내리면, 걸이부터 추 높이까지의 수직 거리는 $${L}\\cos ${th}^{\\circ}$입니다.`,
        `그 수직 거리는 $${L}\\times${vtex(cosD(th))}=${vtex(vmul(vi(L), cosD(th)))}$입니다.`,
        `올라간 높이는 전체 줄 길이에서 이 거리를 빼므로 $x=${L}-${vtex(vmul(vi(L), cosD(th)))}$입니다.`
      ], { kind: 'pendulum', length: L, angle: th, answer: h.v });
    },
    pdraw: (b, q, C) => drawPend(b, q.fig.L, q.fig.th, { ht: C.last ? q.fig.height : 'x', hx: !C.last, drop: C.review && C.step >= 3 ? q.fig.drop : '' })
  };

  /* ====================================================================== 7. 부러진 나무 */
  function drawBroken(b, d, th, o = {}) {
    const t = th * DEG, h = d * Math.tan(t), Lb = d / Math.cos(t), O = pt(0, 0), Pp = pt(0, -h), Q = pt(d, 0), Rr = pt(0, -h - Lb);
    const compact = o.compactQuestion && !b.thumb && b.W < 560;
    fit(b, bboxOf([pt(-0.5, -h - Lb), pt(d + 0.5, 0)]), compact ? { t: 28, b: 40, l: 58, r: 58, problemTop: 28 } : { t: 60, b: 58, l: 70, r: 54 });
    line(b, pt(-1.2, 0), pt(d + 1.2, 0), 'muted', 3);
    line(b, O, Pp, 'ink', 6); line(b, Pp, Q, 'green', 5);
    line(b, Pp, Rr, 'muted', 3, { dash: dashed });
    const angleR = compact ? Math.min(24, d * (b.k || 60) * .26) : 36;
    ang(b, Q, Pp, O, { color: 'amber', r: angleR, label: compact ? '' : o.tl || `${th}°`, size: 16 }); ang(b, O, Q, Pp, { color: 'ink', r: 16 });
    const L = o.L || {};
    T(b, mid(O, Q), L.d || '', { dy: 22, size: 17, color: 'sky' });
    if (L.h) T(b, mid(O, Pp), L.h, { dx: -8, size: L.hx ? 21 : 17, color: L.hx ? 'amber' : 'rose', align: 'right' });
    if (L.L) T(b, mid(Pp, Q), L.L, { dx: 12, dy: -6, size: L.Lx ? 21 : 17, color: L.Lx ? 'amber' : 'green', align: 'left' });
    if (L.H) { const x = -0.9; line(b, pt(x, 0), pt(x, -h - Lb), 'amber', 3); T(b, pt(x, -(h + Lb) / 2), L.H, { dx: -8, size: 21, color: 'amber', align: 'right' }); }
    b.point(Pp, { color: 'ink', r: 4.5 }); b.point(Q, { color: 'ink', r: 4.5 }); b.point(O, { color: 'ink', r: 4.5 });
    if (compact) {
      const am = -Math.PI + t / 2, anchor = pt(Q.x + Math.cos(am) * angleR / b.k, Q.y + Math.sin(am) * angleR / b.k);
      T(b, Q, o.tl || `${th}°`, { dx: 34, dy: -30, color: 'amber', size: 16, leaderAnchor: anchor, leader: true });
    }
    (o.rows || []).forEach((r, i) => T(b, pt(d / 2, 0), r.t, { dy: 46 + i * 26, size: 16, color: r.c }));
  }
  const broken = {
    id: 'brokenTreeCone', title: '부러진 나무의 높이', short: '부러진 나무',
    question: '나무가 부러져 꼭대기가 땅에 닿았다. 땅과 이루는 각과 닿은 거리를 알면 부러지기 전 나무의 높이는?',
    ctl: ['t57d', 't57t'],
    init: (s) => { s.t57d = 8; s.t57t = 45; },
    model: (s) => { const d = Math.round(s.t57d), th = Math.round(s.t57t), h = vmul(vi(d), tanD(th)), L = vdiv(vi(d), cosD(th)); return { d, th, h, L, H: vadd(h, L) }; },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99, vv = (v) => (v.x ? vcan(v) : '≈' + decS(v.v, 2));
      drawBroken(b, M.d, M.th, { L: { d: `${M.d}`, h: show(1) ? `h = ${vv(M.h)}` : '', L: show(2) ? `L = ${vv(M.L)}` : '', H: show(3) ? vv(M.H) : '' }, rows: show(3) ? [{ t: `부러지기 전 높이 = h + L = ${vv(M.H)}`, c: 'amber' }] : [] });
    },
    steps: (M) => [
      `꼭대기가 땅에 닿은 점을 $Q$ 라 해요. 남은 줄기 $h$, 땅 $d=${M.d}$, 부러진 부분 $L$ 이 직각삼각형을 이루고 $\\angle Q=${M.th}^{\\circ}$ 예요.`,
      `$h=d\\tan ${M.th}^{\\circ}=${vtex(M.h)}$, $L=\\frac{d}{\\cos ${M.th}^{\\circ}}=${vtex(M.L)}$`,
      `부러지기 전 나무의 높이는 남은 줄기와 부러진 부분을 더한 $h+L=${vtex(M.H)}$ 예요.`
    ],
    view: (M) => ({
      guide: '<b>닿은 거리 d</b>와 <b>각 θ</b>를 바꿔 보세요. 부러진 부분(초록)이 직각삼각형의 빗변이고, 점선이 부러지기 전의 나무예요.',
      readouts: [rd('남은 줄기 $h$', `$${vtex(M.h)}$`, 'rose'), rd('부러진 부분 $L$', `$${vtex(M.L)}$`, 'green'), rd('원래 높이', `$${vtex(M.H)}$`, 'amber')],
      rule: '(부러지기 전 높이) = (남은 줄기) + (부러진 부분) = $d\\tan\\theta+\\frac{d}{\\cos\\theta}$',
      notes: notes('원래 높이를 구할 때 부러진 부분의 길이를 더하는 것을 잊지 마세요. $h$ 만 구하면 안 돼요.')
    }),
    gen: () => {
      const th = pick([30, 45, 60]), d = th === 30 ? pick([3, 6, 9]) : th === 60 ? pick([2, 3, 4, 5]) : pick([2, 4, 6, 8]), kind = pick(th === 45 ? ['H', 'H', 'L'] : ['H', 'H', 'h', 'L']);
      const h = vmul(vi(d), tanD(th)), Lb = vdiv(vi(d), cosD(th)), ans = kind === 'H' ? vadd(h, Lb) : kind === 'h' ? h : Lb;
      const wr = [[h, '남은 줄기만 구했어요. 부러진 부분도 더해요.'], [Lb, '부러진 부분만 구했어요. 남은 줄기도 더해요.'], [vadd(vmul(vi(d), sinD(th)), Lb), '$\\tan$ 대신 $\\sin$ 을 썼어요.'], [vadd(vmul(vi(d), cosD(th)), Lb), '$\\tan$ 대신 $\\cos$ 을 썼어요.'], [vmul(vi(2), h), ''], [vadd(h, vmul(vi(d), vi(1))), '$d$ 를 그대로 더했어요.'], [vmul(vi(d), sinD(th)), ''], [vdiv(vi(d), tanD(th)), '곱해야 하는데 나누었어요.']].filter((w) => !vsame(w[0], ans));
      const L = { d: `${d}` }; if (kind === 'H') L.H = 'x'; else if (kind === 'h') { L.h = 'x'; L.hx = true; } else { L.L = 'x'; L.Lx = true; }
      const ask = { H: '부러지기 전 나무의 높이', h: '땅에 서 있는 부분의 높이', L: '부러져 땅에 닿은 부분의 길이' }[kind];
      const q = {
        tag: '부러진 나무', key: ['broken', th, d, kind].join('|'),
        stem: `나무가 부러져 꼭대기가 뿌리에서 $${d}$ 떨어진 땅에 닿았고, 부러진 부분이 땅과 이루는 각이 $${th}^{\\circ}$ 이다. ${ask} $x$ 는? (단, 땅은 평평하고 나무는 땅과 수직이다.)`,
        choices: mkChoices(ans, wr), fig: { d, th, L }, given: [`${d}`, `${th}°`], ans: [vcan(ans)]
      };
      q.fig.kind = kind; q.fig.work = { h: vcan(h), L: vcan(Lb), H: vcan(vadd(h, Lb)) };
      return checkQ(q, [
        `뿌리에서 꼭대기가 닿은 점까지는 $d=${d}$, 땅과 부러진 부분의 각은 $${th}^{\\circ}$입니다. 이번에는 ${ask}를 구해요.`,
        `남은 줄기를 $h$, 부러진 부분을 $L$이라 하면 직각삼각형에서 $h=d\\tan ${th}^{\\circ}$, $L=\\frac{d}{\\cos ${th}^{\\circ}}$입니다.`,
        `$h=${d}\\times${vtex(tanD(th))}=${vtex(h)}$, $L=\\frac{${d}}{${vtex(cosD(th))}}=${vtex(Lb)}$입니다.`,
        kind === 'H' ? `부러지기 전 높이는 두 부분의 합 $h+L=${vtex(h)}+${vtex(Lb)}$입니다.` : `문제에서 요구한 부분은 ${kind === 'h' ? '남은 줄기 $h$' : '부러진 부분 $L$'}입니다. 전체 높이와 구별해요.`
      ], { kind: 'broken-tree', distance: d, angle: th, ask: kind, answer: ans.v });
    },
    pdraw: (b, q, C) => drawBroken(b, q.fig.d, q.fig.th, { compactQuestion: true, L: { ...q.fig.L, ...(C.review && C.step >= 3 ? Object.fromEntries(['h', 'L'].filter((k) => k !== q.fig.kind).map((k) => [k, q.fig.work[k]])) : {}), ...(C.last ? { [q.fig.kind]: q.fig.work[q.fig.kind], hx: false, Lx: false } : {}) } })
  };

  G.register(50, 't5', '⑤ 높이·거리', '높이·거리', PARAMS, [r51, r52, r53, r54, tree, pend, broken]);
})();
