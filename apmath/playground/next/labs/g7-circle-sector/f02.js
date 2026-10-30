/* ==========================================================================
   F02 나누기·합치기 — 색칠한 부분의 넓이의 합·차 (원과 부채꼴 · 실험실 2.0 모듈)
   - 색칠한 부분 = (더하는 조각) + … − (빼는 조각) …  조각을 가로로만 밀어 떼어 놓았다가 다시 합칩니다.
   - 교재 문제(14번 · 서술형 1 · 연습 1-1 · 1-2 · 08번 · 13번 · 15번)의 그림을 그대로 옮기고,
     모든 길이·각을 막대(또는 그림의 손잡이)로 바꾸면 그림·식·문제·정답이 함께 바뀝니다.
   - 페이지가 부르는 방식:  (window.APL_CS_GROUPS = window.APL_CS_GROUPS || []).push({ order: 62, … scenes })
   - 장면이 쓰는 값(막대)은 장면에 들어올 때(enter) lab.params 에 'f02_<장면>_<값>' 이름으로 넣고 나갈 때 치웁니다.
   - 도형은 항상 수학 좌표(y 위쪽)로 계산하고, 무대가 figure(y 아래쪽)이면 y 부호만 바꿔 그립니다.
   ========================================================================== */
(function () {
  'use strict';

  const PI = Math.PI;
  const rad = (d) => (d * PI) / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const MINUS = '−';
  const CIRC = ['①', '②', '③', '④', '⑤'];

  /* ======================= 수 표현: 분수와 (a·π + c) ======================= */
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
  const fadd = (x, y) => fr(x.n * y.d + y.n * x.d, x.d * y.d);
  const fmul = (x, y) => fr(x.n * y.n, x.d * y.d);
  const fneg = (x) => ({ n: -x.n, d: x.d });
  const fnum = (x) => x.n / x.d;
  const ZERO = fr(0);
  const V = (a, c) => ({ a: a || ZERO, c: c || ZERO });
  const vadd = (u, w) => V(fadd(u.a, w.a), fadd(u.c, w.c));
  const vneg = (u) => V(fneg(u.a), fneg(u.c));
  const vsign = (u, sg) => (sg > 0 ? u : vneg(u));

  function fplain(x) { const s = x.d === 1 ? String(Math.abs(x.n)) : `${Math.abs(x.n)}/${x.d}`; return (x.n < 0 ? MINUS : '') + s; }
  function piPlain(a) {
    const n = Math.abs(a.n), ng = a.n < 0 ? MINUS : '';
    return ng + (n === 1 ? 'π' : n + 'π') + (a.d === 1 ? '' : '/' + a.d);
  }
  function vplain(v) {
    const hasA = v.a.n !== 0, hasC = v.c.n !== 0;
    if (hasA && hasC) return piPlain(v.a) + (v.c.n > 0 ? ' + ' : ' − ') + fplain(fr(Math.abs(v.c.n), v.c.d));
    if (hasA) return piPlain(v.a);
    return hasC ? fplain(v.c) : '0';
  }
  function ftex(x) { return (x.n < 0 ? '-' : '') + (x.d === 1 ? String(Math.abs(x.n)) : `\\frac{${Math.abs(x.n)}}{${x.d}}`); }
  function piTex(a) {
    const n = Math.abs(a.n);
    const co = a.d === 1 ? (n === 1 ? '' : String(n)) : `\\frac{${n}}{${a.d}}`;
    return (a.n < 0 ? '-' : '') + co + '\\pi';
  }
  function vtex(v) {
    const hasA = v.a.n !== 0, hasC = v.c.n !== 0;
    if (hasA && hasC) return piTex(v.a) + (v.c.n > 0 ? '+' : '-') + ftex(fr(Math.abs(v.c.n), v.c.d));
    if (hasA) return piTex(v.a);
    return hasC ? ftex(v.c) : '0';
  }
  const num = (x) => String(Math.round(x * 100) / 100);
  // 반지름 표기: 정수·소수(.5)는 그대로, 그 밖의 분수는 괄호
  const rt = (r) => (r.d === 1 ? String(r.n) : r.d === 2 ? String(r.n / 2) : `(${r.n}/${r.d})`);
  const rtex = (r) => (r.d === 1 ? String(r.n) : r.d === 2 ? String(r.n / 2) : `\\left(${ftex(r)}\\right)`);
  const sq = (r) => fmul(r, r);

  /* ======================= 기하 도우미 (수학 좌표, y 위쪽) ======================= */
  function arcPts(cx, cy, r, a0, a1) {
    const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / rad(2.5)));
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = a0 + ((a1 - a0) * i) / n;
      out.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
    }
    return out;
  }
  const halfArc = (cx, cy, r, dir) => arcPts(cx, cy, r, dir - PI / 2, dir + PI / 2);
  function arcBetween(c, p1, p2) { // 중심 c, p1에서 p2까지의 짧은 호
    const r = Math.hypot(p1[0] - c[0], p1[1] - c[1]);
    const a1 = Math.atan2(p1[1] - c[1], p1[0] - c[0]);
    let d = Math.atan2(p2[1] - c[1], p2[0] - c[0]) - a1;
    while (d > PI) d -= 2 * PI;
    while (d < -PI) d += 2 * PI;
    return arcPts(c[0], c[1], r, a1, a1 + d);
  }
  function rotPts(pts, c, ang) {
    const co = Math.cos(ang), si = Math.sin(ang);
    return pts.map((p) => { const x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * co - y * si, c[1] + x * si + y * co]; });
  }
  const shiftPts = (pts, dx) => pts.map((p) => [p[0] + dx, p[1]]);
  function bboxOf(...lists) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const pts of lists) for (const p of pts) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    return { x0, y0, x1, y1 };
  }
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

  /* ======================= 조각(item) 만들기 ======================= */
  const HALF = fr(1, 2);
  function semi(id, name, cx, cy, r, dir, sign) {
    const pts = halfArc(cx, cy, fnum(r), dir);
    return {
      id, name, sign, pts,
      area: V(fmul(sq(r), HALF)),
      aExpr: `π×${rt(r)}²×½`,
      aTex: `\\pi\\times ${rtex(r)}^2\\times\\frac12`,
      arc: { pts, len: V(r), expr: `2π×${rt(r)}×½`, tex: `2\\pi\\times ${rtex(r)}\\times\\frac12` }
    };
  }
  function disk(id, name, cx, cy, r, sign) {
    const pts = arcPts(cx, cy, fnum(r), 0, 2 * PI);
    return {
      id, name, sign, pts,
      area: V(sq(r)),
      aExpr: `π×${rt(r)}²`,
      aTex: `\\pi\\times ${rtex(r)}^2`,
      arc: { pts, len: V(fmul(fr(2), r)), expr: `2π×${rt(r)}`, tex: `2\\pi\\times ${rtex(r)}` }
    };
  }
  // 작은 반원 두 개의 이름: 크기 순서대로 가장 작은/중간 (같으면 모두 작은)
  function sizeNames(a, b) {
    if (a < b) return ['가장 작은 반원', '중간 반원'];
    if (a > b) return ['중간 반원', '가장 작은 반원'];
    return ['작은 반원 ①', '작은 반원 ②'];
  }

  /* ======================= 모델 마무리: 행 배치·부호 합 ======================= */
  function finish(m) {
    m.byId = {};
    m.items.forEach((it) => { m.byId[it.id] = it; it.bb = bboxOf(it.pts); });
    if (!m.order) m.order = m.items.map((it) => it.id);
    const plus = m.order.filter((id) => m.byId[id].sign > 0);
    const minus = m.order.filter((id) => m.byId[id].sign < 0);
    m.order = [...plus, ...minus];
    m.ops = m.order.map((id) => ({ pts: m.byId[id].pts, sign: m.byId[id].sign }));
    m.bbox = bboxOf(...m.order.map((id) => m.byId[id].pts), ...(m.extraPts || []));
    // 조각을 한 줄로 늘어놓을 때의 가로 이동량(세로 이동은 없음)
    const list = m.order.map((id) => m.byId[id]);
    const w = list.map((it) => it.bb.x1 - it.bb.x0);
    const sumW = w.reduce((a, c) => a + c, 0);
    const gap = Math.max(0.24 * Math.max(...w), 0.15 * sumW, 0.4);
    const total = w.reduce((a, c) => a + c, 0) + gap * (list.length - 1);
    const cx = (m.bbox.x0 + m.bbox.x1) / 2;
    let x = cx - total / 2;
    m.dx = {}; m.rowC = {}; m.gapX = [];
    list.forEach((it, i) => {
      m.dx[it.id] = x - it.bb.x0;
      m.rowC[it.id] = x + w[i] / 2;
      x += w[i];
      if (i < list.length - 1) { m.gapX.push(x + gap / 2); x += gap; }
    });
    m.row = { x0: cx - total / 2, x1: cx + total / 2, gap };
    m.area = list.reduce((acc, it) => vadd(acc, vsign(it.area, it.sign)), V());
    const arcs = list.filter((it) => it.arc);
    m.perim = arcs.length ? arcs.reduce((acc, it) => vadd(acc, it.arc.len), V()) : null;
    return m;
  }

  /* ======================= 그리기 도우미 ======================= */
  function mkG(b) {
    const sg = b.kind === 'figure' ? -1 : 1;
    const G = { b, sg };
    Object.defineProperty(G, 'px', { get: () => 1 / b.k });
    G.map = (pts) => pts.map((p) => [p[0], sg * p[1]]);
    G.path = (pts, o) => b.path(G.map(pts), o);
    G.text = (x, y, str, o) => b.text([x, sg * y], str, { align: 'center', baseline: 'middle', size: 15, weight: 800, ...o });
    G.dot = (x, y, o) => b.point([x, sg * y], o);
    return G;
  }
  let OC = null; // 조각을 겹쳐 합·차를 만드는 보조 캔버스
  function paintOps(b, G, ops, fillCss) {
    if (!OC) OC = document.createElement('canvas');
    if (OC.width !== b.canvas.width || OC.height !== b.canvas.height) { OC.width = b.canvas.width; OC.height = b.canvas.height; }
    const c = OC.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalCompositeOperation = 'source-over';
    c.clearRect(0, 0, OC.width, OC.height);
    c.setTransform(b.dpr, 0, 0, b.dpr, 0, 0);
    for (const op of ops) {
      c.globalCompositeOperation = op.sign > 0 ? 'source-over' : 'destination-out';
      c.beginPath();
      op.pts.forEach((p, i) => { const s = b.toS(p[0], G.sg * p[1]); if (i) c.lineTo(s.x, s.y); else c.moveTo(s.x, s.y); });
      c.closePath();
      c.fillStyle = '#000';
      c.fill();
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalCompositeOperation = 'source-in';
    c.fillStyle = fillCss;
    c.fillRect(0, 0, OC.width, OC.height);
    c.globalCompositeOperation = 'source-over';
    const m = b.ctx;
    m.save();
    m.setTransform(1, 0, 0, 1, 0, 0);
    m.drawImage(OC, 0, 0);
    m.restore();
  }
  // 길이 표시선: 두 점 p→q 옆(왼쪽이 +) offPx 만큼 떨어진 곳에 선과 숫자
  function measure(G, p, q, offPx, str, A, o = {}) {
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L, sgn = offPx >= 0 ? 1 : -1, off = offPx * G.px;
    const p2 = [p[0] + nx * off, p[1] + ny * off], q2 = [q[0] + nx * off, q[1] + ny * off];
    const col = o.color || 'amber';
    G.path([p2, q2], { color: col, width: 2.2, alpha: A, dash: o.dash });
    const t = 6 * G.px;
    [p2, q2].forEach((e) => G.path([[e[0] - nx * t, e[1] - ny * t], [e[0] + nx * t, e[1] + ny * t]], { color: col, width: 2.2, alpha: A }));
    const tp = [(p2[0] + q2[0]) / 2 + nx * sgn * (o.gap || 15) * G.px, (p2[1] + q2[1]) / 2 + ny * sgn * (o.gap || 15) * G.px];
    G.text(tp[0], tp[1], str, { color: o.textColor || 'ink', size: o.size || 16, alpha: A });
  }
  function rightMark(G, v, p1, p2, A, px = 11) {
    const n = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
    const d1 = n(v, p1), d2 = n(v, p2), s = px * G.px;
    const a = [v[0] + d1[0] * s, v[1] + d1[1] * s], c = [v[0] + d2[0] * s, v[1] + d2[1] * s];
    const bq = [a[0] + d2[0] * s, a[1] + d2[1] * s];
    G.path([a, bq, c], { color: 'amber', width: 2.2, alpha: A });
  }
  const dotAt = (G, p, A, r = 4.2, col = 'ink') => G.dot(p[0], p[1], { color: col, r, glow: false, alpha: A });

  /* ======================= 장면별 모델 ======================= */
  // ---- 교재 14번: 반원 O를 점 A를 중심으로 θ°만큼 회전 ----
  function buildROT(P) {
    const r = P.r, thFull = P.th, th = Math.max(0, Math.round(P.th * (P.sw == null ? 1 : P.sw))), T = rad(th);
    const rF = fr(r);
    const A = [0, 0], B = [2 * r, 0];
    const S = halfArc(r, 0, r, PI / 2);
    const S2 = rotPts(S, A, T);
    const Q = [[0, 0], ...arcPts(0, 0, 2 * r, 0, T)];
    const B2 = [2 * r * Math.cos(T), 2 * r * Math.sin(T)];
    const O = [r, 0], O2 = [r * Math.cos(T), r * Math.sin(T)];
    const semiV = V(fmul(sq(rF), HALF));
    const items = [
      { id: 'rot', name: '회전한 반원', sign: 1, pts: S2, area: semiV, aExpr: `π×${r}²×½`, aTex: `\\pi\\times ${r}^2\\times\\frac12` },
      { id: 'sec', name: `부채꼴 ABB′`, sign: 1, pts: Q, area: V(fmul(sq(fr(2 * r)), fr(th, 360))), aExpr: `π×${2 * r}²×${th}/360`, aTex: `\\pi\\times ${2 * r}^2\\times\\frac{${th}}{360}` },
      { id: 'orig', name: '처음 반원', sign: -1, pts: S, area: semiV, aExpr: `π×${r}²×½`, aTex: `\\pi\\times ${r}^2\\times\\frac12` }
    ];
    const m = { kind: 'ROT', P, items, order: ['rot', 'sec', 'orig'], A, B, B2, O, O2, T, hasArc: false };
    m.outline = [S2, arcPts(0, 0, 2 * r, 0, T), S];
    m.extraPts = [rotPts(S, A, rad(thFull)), [[0, 0], ...arcPts(0, 0, 2 * r, 0, rad(thFull))]]; // 돌리는 도중에도 그림 크기가 변하지 않게 끝 모양까지 잰다
    m.home = (G, A_, st) => {
      const al = A_;
      const quiet = !!(st && st.flags && st.flags.sector);
      G.path([A, B], { color: 'ink', width: 1.8, alpha: 0.8 * al });
      G.path([A, B2], { color: 'ink', width: 1.8, alpha: 0.8 * al });
      if (!quiet) measure(G, A, O, -17, `${r} cm`, al, { color: 'amber' });
      const ra = Math.min(0.5 * r, 1.4);
      G.path(arcPts(0, 0, ra, 0, T), { color: 'amber', width: 2.8, alpha: al });
      const ta = T / 2, lr = ra + 24 * G.px;
      if (th >= 25) G.text(lr * Math.cos(ta), lr * Math.sin(ta), `${th}°`, { color: 'amber', size: 16, alpha: al });
      if (!quiet) { dotAt(G, O, al, 3.6); dotAt(G, O2, al, 3.6); }
      dotAt(G, A, al); dotAt(G, B, al); dotAt(G, B2, al);
      G.text(A[0], A[1], 'A', { dx: -14, dy: 14, alpha: al });
      G.text(B[0], B[1], 'B', { dx: 13, dy: 14, alpha: al });
      if (!quiet) G.text(O[0], O[1], 'O', { dx: 0, dy: 16, alpha: al, size: 14 });
      const ux = Math.cos(T), uy = Math.sin(T);
      G.text(B2[0], B2[1], 'B′', { dx: 22 * (ux >= -0.1 ? 1 : -1), dy: -16, alpha: al });
      if (!quiet) G.text(O2[0], O2[1], 'O′', { dx: -17 * (ux > -0.2 ? 1 : -1), dy: 6 * (uy >= 0 ? -1 : 1), alpha: al, size: 14 });
    };
    m.extra = (G, st) => {
      const f = st.flags || {};
      if (f.sector) {
        G.path(Q, { close: true, fill: 'amber', fillAlpha: 0.3, color: 'amber', width: 3.2 });
        const inN = 19 * G.px, mx = 1.5 * r * Math.cos(T), my = 1.5 * r * Math.sin(T);
        G.text(1.5 * r, inN, `${2 * r} cm`, { color: 'ink', size: 17 });
        G.text(mx + inN * Math.sin(T), my - inN * Math.cos(T), `${2 * r} cm`, { color: 'ink', size: 17 });
      }
      if (f.congruent) {
        G.path(S2, { close: true, fill: 'green', fillAlpha: 0.2, color: 'green', width: 3 });
        G.path(S, { close: true, fill: 'rose', fillAlpha: 0.2, color: 'rose', width: 3, dash: [7, 5] });
        const c1 = rotPts([[r, r * 0.55]], A, T)[0];
        G.text(c1[0], c1[1], '넓이 같음', { color: 'green', size: 14 });
        G.text(r, r * 0.55, '넓이 같음', { color: 'rose', size: 14 });
      }
    };
    m.handles = (G, s, set) => [{ id: 'B2', p: B2, label: 'B′', drag: (w) => { set({ th: clamp(Math.round(((Math.atan2(G.sg * w.y, w.x) * 180) / PI) / 5) * 5, 5, 180), sw: 1 }); } }];
    return finish(m);
  }

  // ---- 서술형 1 / 연습 1-1: 지름 위에서 나눈 반원 ----
  function buildYY(P, variant) {
    const a = P.a, b = P.b, d = a + b;
    const up = variant === 'sj1'; // 큰 반원이 위(서술형 1) / 아래(연습 1-1)
    const [nl, nr] = sizeNames(a, b);
    const big = semi('big', '가장 큰 반원', d / 2, 0, fr(d, 2), up ? PI / 2 : -PI / 2, 1);
    const left = semi('left', nl, a / 2, 0, fr(a, 2), -PI / 2, up ? 1 : -1);
    const right = semi('right', nr, a + b / 2, 0, fr(b, 2), PI / 2, up ? -1 : 1);
    const m = { kind: 'YY', P, items: [big, left, right], order: ['big', 'left', 'right'], hasArc: true, d };
    m.outline = [big.arc.pts, left.arc.pts, right.arc.pts];
    m.home = (G, A) => {
      G.path([[0, 0], [d, 0]], { color: 'ink', width: 1.8, alpha: 0.75 * A });
      [a / 2, d / 2, a + b / 2].forEach((x) => dotAt(G, [x, 0], A, 3.6));
      dotAt(G, [a, 0], A, 4);
      measure(G, [0, 0], [a, 0], 15, `${a} cm`, A);
      measure(G, [a, 0], [d, 0], -15, `${b} cm`, A);
    };
    m.handles = (G, s, set) => [{ id: 'cut', p: [a, 0], label: '', drag: (w) => { const x = clamp(Math.round(w.x), 1, d - 1); set({ a: x, b: d - x }); } }];
    return finish(m);
  }

  // ---- 연습 1-2: 반원 안의 두 반원 (반지름 p, q) ----
  function buildSJ3(P) {
    const p = P.p, q = P.q, R = p + q;
    const [ns, nm] = sizeNames(p, q);
    const big = semi('big', '큰 반원', R, 0, fr(R), PI / 2, 1);
    const s1 = semi('s1', ns, p, 0, fr(p), PI / 2, -1);
    const s2 = semi('s2', nm, 2 * p + q, 0, fr(q), PI / 2, -1);
    const m = { kind: 'SJ3', P, items: [big, s1, s2], order: ['big', 's1', 's2'], hasArc: true, R };
    m.outline = [big.arc.pts, s1.arc.pts, s2.arc.pts];
    m.home = (G, A) => {
      G.path([[0, 0], [2 * R, 0]], { color: 'ink', width: 1.8, alpha: 0.75 * A });
      [p, R, 2 * p + q].forEach((x) => dotAt(G, [x, 0], A, 4));
      dotAt(G, [2 * p, 0], A, 3.2);
      measure(G, [p, 0], [2 * p, 0], -15, `${p} cm`, A, { dash: [5, 4] });
      measure(G, [2 * p, 0], [2 * p + q, 0], -15, `${q} cm`, A, { dash: [5, 4] });
    };
    m.handles = (G, s, set) => [{ id: 'cut', p: [2 * p, 0], label: '', drag: (w) => { const pp = clamp(Math.round(w.x / 2), 1, R - 1); set({ p: pp, q: R - pp }); } }];
    return finish(m);
  }

  // ---- 문제 08: 큰 원 안의 같은 두 원 ----
  function buildCC(P) {
    const R = P.R, r = fr(R, 2);
    const big = disk('big', '큰 원', R, 0, fr(R), 1);
    const s1 = disk('s1', '작은 원 ①', R / 2, 0, r, -1);
    const s2 = disk('s2', '작은 원 ②', (3 * R) / 2, 0, r, -1);
    const m = { kind: 'CC', P, items: [big, s1, s2], order: ['big', 's1', 's2'], hasArc: true, R };
    m.outline = [big.arc.pts, s1.arc.pts, s2.arc.pts];
    m.home = (G, A) => {
      G.path([[0, 0], [2 * R, 0]], { color: 'ink', width: 1.8, alpha: 0.75 * A });
      [R / 2, R, (3 * R) / 2].forEach((x) => dotAt(G, [x, 0], A, 4));
      measure(G, [0, 0], [R, 0], -15, `${R} cm`, A, { dash: [5, 4] });
      measure(G, [R, 0], [2 * R, 0], -15, `${R} cm`, A, { dash: [5, 4] });
    };
    m.handles = (G, s, set) => [{ id: 'R', p: [2 * R, 0], label: '', drag: (w) => { set({ R: clamp(2 * Math.round(w.x / 4), 4, 14) }); } }];
    return finish(m);
  }

  // ---- 문제 13: 직각삼각형 세 변을 지름으로 하는 반원 (히포크라테스의 달) ----
  function buildLUNE(P) {
    const p = P.p, q = P.q, c2 = p * p + q * q, c = Math.sqrt(c2);
    const B = [0, 0], C = [c, 0], A = [(p * p) / c, (p * q) / c];
    const cInt = Number.isInteger(c);
    const outward = (u, v, away) => { // 변 uv의 수직 방향 중 away 점에서 먼 쪽 각도
      const dx = v[0] - u[0], dy = v[1] - u[1];
      const n1 = Math.atan2(dx, -dy), m0 = mid(u, v);
      const toAway = [away[0] - m0[0], away[1] - m0[1]];
      return Math.cos(n1) * toAway[0] + Math.sin(n1) * toAway[1] < 0 ? n1 : n1 + PI;
    };
    const mAB = mid(A, B), mAC = mid(A, C);
    const sAB = semi('ab', '반원 AB', mAB[0], mAB[1], fr(p, 2), outward(A, B, C), 1);
    const sAC = semi('ac', '반원 AC', mAC[0], mAC[1], fr(q, 2), outward(A, C, B), 1);
    const tri = { id: 'tri', name: '△ABC', sign: 1, pts: [B, C, A], area: V(ZERO, fr(p * q, 2)), aExpr: `½×${p}×${q}`, aTex: `\\frac12\\times ${p}\\times ${q}` };
    const sBC = {
      id: 'bc', name: '반원 BC', sign: -1, pts: halfArc(c / 2, 0, c / 2, PI / 2), area: V(fr(c2, 8)),
      aExpr: cInt ? `π×${num(c / 2)}²×½` : 'π×(BC/2)²×½',
      aTex: cInt ? `\\pi\\times ${num(c / 2)}^2\\times\\frac12` : '\\pi\\times\\left(\\frac{\\overline{BC}}{2}\\right)^2\\times\\frac12'
    };
    sAB.aExpr = `π×${num(p / 2)}²×½`; sAB.aTex = `\\pi\\times ${num(p / 2)}^2\\times\\frac12`;
    sAC.aExpr = `π×${num(q / 2)}²×½`; sAC.aTex = `\\pi\\times ${num(q / 2)}^2\\times\\frac12`;
    sAB.arc = null; sAC.arc = null;
    const alA = Math.atan2(A[1], A[0] - c / 2);
    const m = { kind: 'LUNE', P, items: [sAB, sAC, tri, sBC], order: ['ab', 'ac', 'tri', 'bc'], hasArc: false, A, B, C, c, cInt };
    m.outline = [sAB.pts, sAC.pts, arcPts(c / 2, 0, c / 2, alA, PI), arcPts(c / 2, 0, c / 2, 0, alA)];
    m.home = (G, Al) => {
      G.path([B, C, A], { close: true, color: 'ink', width: 2.4, alpha: Al });
      rightMark(G, A, B, C, Al, 12);
      [A, B, C].forEach((v) => dotAt(G, v, Al));
      G.text(A[0], A[1], 'A', { dy: -15, alpha: Al });
      G.text(B[0], B[1], 'B', { dx: -14, dy: 12, alpha: Al });
      G.text(C[0], C[1], 'C', { dx: 14, dy: 12, alpha: Al });
      const inside = (u, v, w, off) => { // 변 uv 위 중점에서 w쪽으로 off px
        const m0 = mid(u, v), dx = v[0] - u[0], dy = v[1] - u[1], L = Math.hypot(dx, dy);
        let nx = -dy / L, ny = dx / L;
        if (nx * (w[0] - m0[0]) + ny * (w[1] - m0[1]) < 0) { nx = -nx; ny = -ny; }
        return [m0[0] + nx * off * G.px, m0[1] + ny * off * G.px];
      };
      const l1 = inside(A, B, C, 26), l2 = inside(A, C, B, 26), l3 = inside(B, C, A, 18);
      G.text(l1[0], l1[1], `${p} cm`, { color: 'amber', alpha: Al });
      G.text(l2[0], l2[1], `${q} cm`, { color: 'amber', alpha: Al });
      G.text(l3[0], l3[1], cInt ? `${c} cm` : `√${c2} cm`, { color: 'amber', alpha: Al });
    };
    m.extra = (G, st) => {
      const f = st.flags || {};
      if (f.tri) G.path([B, C, A], { close: true, fill: 'amber', fillAlpha: 0.24, color: 'amber', width: 3.4 });
    };
    m.handles = () => [];
    return finish(m);
  }

  // ---- 문제 15: 정삼각형 세 변을 지름으로 하는 반원 (꽃잎 세 개) ----
  function buildPETAL(P) {
    const a = P.a, h = (a * Math.sqrt(3)) / 2, rr = a / 2;
    const A = [a / 2, h], B = [0, 0], C = [a, 0];
    const mAB = mid(A, B), mAC = mid(A, C), mBC = mid(B, C);
    const petal = (V_, M1, M2, Mo) => [...arcBetween(M2, V_, M1), ...arcBetween(Mo, M1, M2).slice(1), ...arcBetween(M1, M2, V_).slice(1)];
    const pr = fr(a * a, 24);
    const mk = (id, name, v, m1, m2, mo) => ({ id, name, sign: 1, pts: petal(v, m1, m2, mo), area: V(pr), aExpr: `π×${rr}²×60/360`, aTex: `\\pi\\times ${rr}^2\\times\\frac{60}{360}`, v, m1, m2, mo });
    const pA = mk('pa', '꽃잎 (A쪽)', A, mAB, mAC, mBC);
    const pB = mk('pb', '꽃잎 (B쪽)', B, mAB, mBC, mAC);
    const pC = mk('pc', '꽃잎 (C쪽)', C, mAC, mBC, mAB);
    const m = { kind: 'PETAL', P, items: [pB, pA, pC], order: ['pb', 'pa', 'pc'], hasArc: false, A, B, C, rr };
    m.outline = m.items.map((it) => it.pts);
    const inw = (c0, u, v, w) => { // 변 uv를 지름으로 하고 w쪽으로 볼록한 반원 호
      const dx = v[0] - u[0], dy = v[1] - u[1];
      let ang = Math.atan2(dx, -dy);
      if (Math.cos(ang) * (w[0] - c0[0]) + Math.sin(ang) * (w[1] - c0[1]) < 0) ang += PI;
      return halfArc(c0[0], c0[1], rr, ang);
    };
    m.home = (G, Al) => {
      G.path([A, B, C], { close: true, color: 'ink', width: 2.2, alpha: Al });
      G.path(inw(mBC, B, C, A), { color: 'ink', width: 1.6, alpha: 0.55 * Al });
      G.path(inw(mAB, A, B, C), { color: 'ink', width: 1.6, alpha: 0.55 * Al });
      G.path(inw(mAC, A, C, B), { color: 'ink', width: 1.6, alpha: 0.55 * Al });
      G.text(A[0], A[1], 'A', { dy: -15, alpha: Al });
      G.text(B[0], B[1], 'B', { dx: -14, dy: 12, alpha: Al });
      G.text(C[0], C[1], 'C', { dx: 14, dy: 12, alpha: Al });
      G.text(mAB[0], mAB[1], `${a} cm`, { dx: -34, dy: 0, color: 'amber', alpha: Al });
    };
    m.extra = (G, st) => {
      const f = st.flags || {};
      if (f.radii) {
        [[A, mAB, mAC], [B, mAB, mBC], [C, mAC, mBC]].forEach(([v, p1, p2]) => {
          [[v, p1], [v, p2]].forEach(([u, w]) => { const mm = mid(u, w); G.path([u, w], { color: 'amber', width: 3 }); G.text(mm[0], mm[1], '', {}); });
        });
        [mAB, mAC, mBC].forEach((c0) => dotAt(G, c0, 1, 5, 'amber'));
        const place = (u, w, side) => { const mm = mid(u, w), dx = w[0] - u[0], dy = w[1] - u[1], L = Math.hypot(dx, dy); let nx = -dy / L, ny = dx / L; if (nx * (side[0] - mm[0]) + ny * (side[1] - mm[1]) > 0) { nx = -nx; ny = -ny; } return [mm[0] + nx * 17 * G.px, mm[1] + ny * 17 * G.px]; };
        const centroid = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
        [[A, mAB], [mAB, B], [A, mAC], [mAC, C], [B, mBC], [mBC, C]].forEach(([u, w]) => { const t = place(u, w, centroid); G.text(t[0], t[1], `${rr}`, { color: 'amber', size: 15 }); });
      }
      if (f.parts) {
        m.items.forEach((it) => {
          const { v, m1, m2, mo } = it;
          // 바깥 활꼴 2개(더함)와 안쪽 활꼴 1개(뺌)
          G.path([...arcBetween(m2, v, m1), v], { close: true, fill: 'green', fillAlpha: 0.5, color: 'green', width: 2 });
          G.path([...arcBetween(m1, m2, v), m2], { close: true, fill: 'green', fillAlpha: 0.5, color: 'green', width: 2 });
          G.path([...arcBetween(mo, m1, m2), m1], { close: true, fill: 'rose', fillAlpha: 0.55, color: 'rose', width: 2, dash: [6, 4] });
          G.path([v, m1, m2], { close: true, fill: 'amber', fillAlpha: 0.28, color: 'amber', width: 2.6 });
        });
        const it = m.byId.pa, cc = [(it.v[0] + it.m1[0] + it.m2[0]) / 3, (it.v[1] + it.m1[1] + it.m2[1]) / 3];
        G.text(cc[0], cc[1] - 0.1 * rr, '정삼각형', { color: 'amber', size: 14 });
      }
      if (f.sector) {
        m.items.forEach((it) => {
          const { v, m1, m2 } = it;
          G.path([m1, ...arcBetween(m1, m2, v), m1], { close: true, fill: 'amber', fillAlpha: 0.26, color: 'amber', width: 3, dash: [8, 5] });
        });
        const it = m.byId.pa, c1 = it.m1, v = it.v, m2 = it.m2;
        const ang = (x) => Math.atan2(x[1] - c1[1], x[0] - c1[0]);
        const a1 = ang(m2), a2 = ang(v);
        const ra = 0.42 * rr;
        G.path(arcPts(c1[0], c1[1], ra, a1, a2 > a1 ? a2 : a2 + 2 * PI), { color: 'amber', width: 3 });
        const am = (a1 + (a2 > a1 ? a2 : a2 + 2 * PI)) / 2, lr = ra + 20 * G.px;
        G.text(c1[0] + lr * Math.cos(am), c1[1] + lr * Math.sin(am), '60°', { color: 'amber', size: 15 });
        const rm = mid(c1, v);
        G.text(rm[0], rm[1], `${rr}`, { dx: -16, dy: -4, color: 'amber', size: 15 });
      }
    };
    m.handles = () => [];
    return finish(m);
  }

  // ---- 확장: 지름을 n등분한 작은 원(반원) n개를 뺀다 ----
  function buildNS(P, variant) {
    const R = P.R, n = P.n, r = fr(R, n);
    const isCircle = variant === 'circle';
    const mk = isCircle ? (id, nm, cx, rr, sg) => disk(id, nm, cx, 0, rr, sg) : (id, nm, cx, rr, sg) => semi(id, nm, cx, 0, rr, PI / 2, sg);
    const big = mk('big', isCircle ? '큰 원' : '큰 반원', R, fr(R), 1);
    const items = [big];
    for (let j = 0; j < n; j++) {
      const it = mk('s' + j, isCircle ? `작은 원 ${CIRC[j]}` : `작은 반원 ${CIRC[j]}`, ((2 * j + 1) * R) / n, r, -1);
      it.group = 'small'; it.groupName = isCircle ? `작은 원 ${n}개` : `작은 반원 ${n}개`;
      items.push(it);
    }
    const m = { kind: 'NS', P, items, order: items.map((i) => i.id), hasArc: true, R, n, isCircle };
    m.outline = items.map((i) => i.arc.pts);
    m.home = (G, A) => {
      G.path([[0, 0], [2 * R, 0]], { color: 'ink', width: 1.8, alpha: 0.75 * A });
      for (let j = 0; j < n; j++) dotAt(G, [((2 * j + 1) * R) / n, 0], A, 3.4);
      dotAt(G, [R, 0], A, 4.2);
      measure(G, [R, 0], [2 * R, 0], -17, `${R} cm`, A, { gap: 15 });
    };
    m.handles = (G, s, set) => [{ id: 'R', p: [2 * R, 0], label: '', drag: (w) => { set({ R: clamp(Math.round(w.x / 2), 4, 12) }); } }];
    return finish(m);
  }

  /* ======================= 보기 상태(탐구/정리/문제)와 그리기 ======================= */
  const gid = (sid, k) => `f02_${sid}_${k}`;

  function stateFor(spec, s, lab, P, m) {
    const tab = lab ? lab.tab : 'explore';
    if (tab === 'problem') return { tab, mode: 'none', target: 0, lab: 0, flags: {} };
    if (tab === 'review') {
      const steps = spec.steps(P, m);
      const k = clamp(s.step || 1, 1, steps.length);
      const v = (steps[k - 1] || {}).v || {};
      return { tab, mode: v.mode || 'area', target: v.u == null ? 1 : v.u, lab: v.lab == null ? 3 : v.lab, flags: v.flags || {}, step: k };
    }
    return { tab: 'explore', mode: s.f02mode === 'arc' && m.hasArc ? 'arc' : 'area', target: s[gid(spec.id, 'u')] || 0, lab: 3, flags: {} };
  }

  const fsz = (b, size) => size * b.fs * b._ts();
  function textW(b, str, size, weight = 800) {
    const c = b.ctx;
    c.save();
    c.font = `${weight} ${fsz(b, size)}px ${b.font}`;
    const w = c.measureText(String(str)).width;
    c.restore();
    return w;
  }

  function fitView(b, G, m, st, u) {
    const sg = G.sg;
    let x0 = Infinity, x1 = -Infinity;
    m.order.forEach((id) => { const it = m.byId[id], d = u * m.dx[id]; x0 = Math.min(x0, it.bb.x0 + d); x1 = Math.max(x1, it.bb.x1 + d); });
    const w0 = clamp(1 - u * 4, 0, 1); // 처음 모양(끝 모양까지 잰 범위)을 u가 작을 때만 반영
    x0 += (Math.min(x0, m.bbox.x0) - x0) * w0;
    x1 += (Math.max(x1, m.bbox.x1) - x1) * w0;
    const rowOn = !b.thumb && st.tab !== 'problem' && st.mode !== 'none' && u > 0.5;
    const y0 = m.bbox.y0, y1 = m.bbox.y1, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const bb = { x0, x1, y0: sg > 0 ? y0 : -y1, y1: sg > 0 ? y1 : -y0, texts: [] };
    bb.texts.push({ x: cx, y: sg * y0, l: -40, r: 40, t: 0, b: rowOn ? 100 : 46 });
    bb.texts.push({ x: cx, y: sg * y1, l: -40, r: 40, t: -38, b: 0 });
    bb.texts.push({ x: x0, y: sg * cy, l: -36, r: 0, t: -12, b: 12 });
    bb.texts.push({ x: x1, y: sg * cy, l: 0, r: 36, t: -12, b: 12 });
    b.setFocus(b.fitBox(bb, { margin: 0.03, px: 12 }), false);
  }

  const PIECE = { plus: 'green', minus: 'rose' };

  function renderModel(b, G, m, st, s, u) {
    const mode = st.mode;
    const hot = s.part;
    const faded = (id) => (hot != null && hot !== id ? 0.3 : 1);
    const compA = mode === 'none' ? 1 : 1 - clamp(u / 0.1, 0, 1);
    const pieceA = 1 - compA;
    const homeA = 1 - clamp(u / 0.08, 0, 1);

    // 1) 합쳐진 모양(색칠한 부분)
    if (compA > 0.01) {
      const quiet = !!(st.flags && (st.flags.parts || st.flags.sector));
      paintOps(b, G, m.ops, b.color('sky', 0.46 * compA * (mode === 'arc' ? 0.5 : 1) * (quiet ? 0.2 : 1)));
      if (mode !== 'arc') for (const pts of m.outline) G.path(pts, { color: 'sky', width: 3.2, alpha: compA });
    }
    // 2) 조각(넓이) 또는 호(둘레)
    const order = m.order;
    const fadeSet = new Set(st.flags.fade || []);
    if (mode === 'area' && pieceA > 0.01) {
      order.forEach((id) => {
        const it = m.byId[id], dx = u * m.dx[id];
        const col = it.sign > 0 ? PIECE.plus : PIECE.minus;
        const fa = faded(id) * (fadeSet.has(id) ? 0.28 : 1) * pieceA;
        G.path(shiftPts(it.pts, dx), { close: true, fill: col, fillAlpha: 0.46 * fa, color: col, alpha: fa, width: hot === id ? 4.2 : 2.8, dash: it.sign < 0 ? [8, 5] : undefined });
      });
    }
    if (mode !== 'arc' && hot != null && m.byId[hot] && pieceA < 0.6) {
      const it = m.byId[hot], col = it.sign > 0 ? PIECE.plus : PIECE.minus;
      G.path(shiftPts(it.pts, u * m.dx[hot]), { close: true, fill: col, fillAlpha: 0.4 * (1 - pieceA), color: col, width: 4.2, alpha: 1 - pieceA, dash: it.sign < 0 ? [8, 5] : undefined });
    }
    if (mode === 'arc') {
      order.forEach((id) => {
        const it = m.byId[id];
        if (!it.arc) return;
        G.path(shiftPts(it.arc.pts, u * m.dx[id]), { color: 'sky', width: hot === id ? 5.4 : 4, alpha: faded(id) });
      });
    }
    // 3) 보조 표시(단계별)
    if (m.extra && !b.thumb) m.extra(G, st, u);
    // 4) 처음 모양의 길이·이름
    if (homeA > 0.01 && m.home) m.home(G, homeA, st);

    // 5) 한 줄로 늘어놓은 조각의 이름·식·값
    const labA = clamp((u - 0.55) / 0.3, 0, 1);
    if (labA > 0.01 && !b.thumb && mode !== 'none') {
      const yb = m.bbox.y0, ymid = (m.bbox.y0 + m.bbox.y1) / 2;
      // 같은 모양이 여러 개(group)이면 하나의 이름표로 묶어 '각각'으로 적습니다(좁은 화면에서 글자가 겹치지 않게).
      const boxes = [], seen = new Set();
      order.forEach((id) => {
        const it = m.byId[id];
        if (mode === 'arc' && !it.arc) return;
        if (it.group) {
          if (seen.has(it.group)) return;
          seen.add(it.group);
          const mem = order.map((i) => m.byId[i]).filter((x) => x.group === it.group && (mode !== 'arc' || x.arc));
          const x0 = Math.min(...mem.map((x) => x.bb.x0 + u * m.dx[x.id])), x1 = Math.max(...mem.map((x) => x.bb.x1 + u * m.dx[x.id]));
          boxes.push({ it, ids: mem.map((x) => x.id), cx: (x0 + x1) / 2, availPx: (x1 - x0 + m.row.gap) * b.k * 0.96, name: it.groupName, each: true });
        } else boxes.push({ it, ids: [id], cx: (it.bb.x0 + it.bb.x1) / 2 + u * m.dx[id], availPx: (it.bb.x1 - it.bb.x0 + m.row.gap) * b.k * 0.96, name: it.name, each: false });
      });
      boxes.forEach((bx) => {
        const it = bx.it, availPx = bx.availPx;
        const fa = labA * (hot != null && !bx.ids.includes(hot) ? 0.3 : 1) * (fadeSet.has(bx.ids[0]) ? 0.45 : 1);
        const sgn = mode === 'arc' ? 1 : it.sign;
        const col = mode === 'arc' ? 'sky' : sgn > 0 ? PIECE.plus : PIECE.minus;
        const valV = mode === 'arc' ? it.arc.len : it.area;
        const lines = [];
        if (st.lab >= 1) {
          const parts = bx.name.split(' ');
          if (textW(b, bx.name, 12) > availPx && parts.length >= 2) { // 좁으면 두 줄로
            const h = Math.ceil(parts.length / 2);
            lines.push({ t: parts.slice(0, h).join(' '), size: 14, color: 'muted', min: 12, always: true }, { t: parts.slice(h).join(' '), size: 14, color: 'muted', min: 12, always: true });
          } else lines.push({ t: bx.name, size: 14, color: 'muted', min: 12, always: st.lab === 1 });
        }
        if (st.lab >= 2) lines.push({ t: mode === 'arc' ? it.arc.expr : it.aExpr, size: 14, color: 'ink', min: 12 });
        if (st.lab >= 3) {
          lines.push({ t: (mode === 'arc' ? '' : sgn > 0 ? '+ ' : '− ') + vplain(valV), size: 19, color: col, min: 14, always: true });
          if (bx.each) lines.push({ t: '(각각)', size: 14, color: 'muted', min: 12, always: true });
        }
        let dy = 24;
        for (const ln of lines) {
          let size = ln.size;
          while (size > ln.min && textW(b, ln.t, size) > availPx) size -= 1;
          if (textW(b, ln.t, size) > availPx && !ln.always) continue;
          G.text(bx.cx, yb, ln.t, { dy, size, color: ln.color, alpha: fa, weight: size >= 17 ? 900 : 800 });
          dy += size + 8;
        }
      });
      // 조각 사이 부호
      m.gapX.forEach((gx, i) => {
        const left = m.byId[order[i]], right = m.byId[order[i + 1]];
        const sgn = mode === 'arc' ? 1 : right.sign;
        const lx = left.bb.x1 + u * m.dx[left.id], rx = right.bb.x0 + u * m.dx[right.id];
        G.text((lx + rx) / 2, ymid, sgn > 0 ? '+' : MINUS, { size: 30, weight: 900, color: sgn > 0 ? PIECE.plus : PIECE.minus, alpha: labA });
      });
    }
    // 6) 손잡이
    if (st.tab === 'explore' && u < 0.04 && !b.thumb && m.handles) {
      const set = (patch) => { for (const k of Object.keys(patch)) s[gid(s.f02sid, k)] = patch[k]; };
      m.handles(G, s, set).forEach((h) => b.handle(h.id, [h.p[0], G.sg * h.p[1]], { color: 'amber', drag: (w) => h.drag({ x: w.x, y: w.y }) }));
    }
  }

  function drawScene(spec, b, s, v, lab) {
    const G = mkG(b);
    const P = spec.read(s, !b.thumb && (!lab || lab.tab === 'explore'));
    const m = spec.build(P);
    let st;
    if (b.thumb) st = { tab: 'thumb', mode: 'none', target: 0, lab: 0, flags: {} };
    else st = stateFor(spec, s, lab, P, m);
    const u = b.thumb || st.tab === 'problem' ? 0 : st.tab === 'review' ? (s.f02uShow == null ? 0 : s.f02uShow) : (s[gid(spec.id, 'u')] || 0);
    if (s.dragging && b.__f02Focus && !b.thumb) b.setFocus(b.__f02Focus, false); // 손잡이를 끄는 동안에는 크기를 고정
    else { fitView(b, G, m, st, u); b.__f02Focus = b.focus; }
    renderModel(b, G, m, st, s, u);
  }

  /* ======================= 문제(5지선다) 도우미 ======================= */
  function ap5(x, unit, pos) { // x 를 pos(0~4)번째에 두고 unit 간격으로 다섯 값
    return [0, 1, 2, 3, 4].map((i) => fadd(x, fmul(fr(i - pos), unit)));
  }
  const pickUnit = (x) => fr(1, x.d); // 선택지 사이 간격(분모를 그대로 둔 1/d)
  function choicesHTML(list) {
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px 14px;margin-top:12px">${list.map((c, i) => `<div style="white-space:nowrap">${CIRC[i]} ${c}</div>`).join('')}</div>`;
  }
  const piCm2 = (x) => `$${piTex(x)}\\text{ cm}^2$`;
  const rerollBtn = `<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="apl-btn sm" data-f02-reroll>숫자 바꾸기</button><span style="font-size:.85em;opacity:.75">그림의 길이·각도는 ‘탐구’ 탭의 막대로도 바꿀 수 있어요.</span></div>`;

  /* ======================= 장면 공장 ======================= */
  const GROUP = { order: 62, id: 'f02', title: 'F02 나누기·합치기', short: 'F02 나누기·합치기', scenes: [] };
  let LAB = null, CUR = null;

  function makeScene(spec) {
    // 막대 정의(전역 이름으로 바꿈)
    const pdefs = {};
    const uKey = gid(spec.id, 'u');
    const defs = [...spec.params, { k: 'u', label: '조각 나누기 ↔ 합치기', min: 0, max: 1, step: 0.01, value: 0, color: 'green', hint: '오른쪽으로 갈수록 조각이 가로로 갈라져 늘어섭니다', fmt: (v) => (v < 0.03 ? '합친 모양' : v > 0.97 ? '모두 나눔' : `${Math.round(v * 100)}%`) }];
    defs.forEach((d) => { pdefs[gid(spec.id, d.k)] = { value: d.value, min: d.min, max: d.max, step: d.step, color: d.color || 'amber', label: d.label, hint: d.hint, format: d.fmt ? (v) => d.fmt(v) : (v) => `${num(v)}${d.unit || ''}` }; });
    // explore=false 이면 '돌리는 중'(sw)은 항상 끝(1)으로 읽어, 정리·문제의 그림과 식이 막대 위치에 흔들리지 않게 합니다.
    spec.read = (s, explore) => {
      const P = {};
      defs.forEach((d) => { // 막대 간격(step)에 맞춰 읽어 중간값(애니메이션)에도 분수·글자가 깨지지 않게 합니다
        const v = s[gid(spec.id, d.k)];
        P[d.k] = v == null ? d.value : +(Math.round(v / d.step) * d.step).toFixed(6);
      });
      if (!explore && 'sw' in P) P.sw = 1;
      return P;
    };
    const memo = { key: '', m: null };
    const buildCached = (P) => { const key = JSON.stringify(P); if (memo.key !== key) { memo.key = key; memo.m = spec.buildRaw(P); } return memo.m; };
    spec.build = buildCached;
    const modelOf = (s) => spec.build(spec.read(s));
    const setP = (s, patch) => { for (const k of Object.keys(patch)) s[gid(spec.id, k)] = patch[k]; };
    const clampAll = (s) => defs.forEach((d) => { const k = gid(spec.id, d.k); if (s[k] != null) s[k] = clamp(s[k], d.min, d.max); });
    const reroll = (s, lab) => {
      const cur = spec.read(s);
      const pool = spec.rolls.filter((r) => Object.keys(r).some((k) => r[k] !== cur[k]));
      const pick = pool[Math.floor(Math.random() * pool.length)] || spec.rolls[0];
      setP(s, pick);
      s[uKey] = 0;
      if (lab) lab.invalidate(true);
    };
    spec.reroll = reroll;

    return {
      id: spec.id, title: spec.title, short: spec.short, question: spec.question,
      enter: (s, lab) => {
        const live = !!lab && s === lab.s;
        s.f02sid = spec.id;
        defs.forEach((d) => { s[gid(spec.id, d.k)] = d.value; });
        s.f02mode = 'area'; s.f02uShow = 0; s.f02dir = 1; s.f02hold = 0; s.playing = false;
        if (live) {
          LAB = lab; CUR = spec;
          const P = lab.params;
          Object.keys(P).forEach((k) => { if (k.indexOf('f02_') === 0) delete P[k]; });
          Object.assign(P, pdefs);
          if (lab.board) lab.board.fit();
          const pane = lab.ui && lab.ui.panes && lab.ui.panes.problem;
          if (pane && !pane.__f02) {
            pane.__f02 = true;
            pane.addEventListener('click', (e) => {
              const bt = e.target.closest && e.target.closest('[data-f02-reroll]');
              if (bt && CUR && LAB) { CUR.reroll(LAB.s, LAB); }
            });
          }
          try { // 공유 링크의 값 되살리기
            const q = new URLSearchParams(location.hash.slice(1));
            if ((q.get('s') || '').split('@')[0] === spec.id) defs.forEach((d) => { const v = q.get(gid(spec.id, d.k)); if (v != null && !isNaN(parseFloat(v))) s[gid(spec.id, d.k)] = parseFloat(v); });
            clampAll(s);
          } catch (e) { /* 무시 */ }
        }
      },
      controls: () => [...spec.params.map((d) => gid(spec.id, d.k)), uKey],
      presets: () => [
        ...(spec.hasArc ? [
          { group: '보기', label: '넓이', apply: (s) => { s.f02mode = 'area'; }, on: (s) => s.f02mode !== 'arc' },
          { group: '보기', label: '둘레', apply: (s) => { s.f02mode = 'arc'; }, on: (s) => s.f02mode === 'arc' }
        ] : []),
        ...(spec.examples || []).map((ex) => ({ group: '숫자 예시', label: ex.label, apply: (s) => { setP(s, ex.set); s[uKey] = 0; }, on: (s) => Object.keys(ex.set).every((k) => s[gid(spec.id, k)] === ex.set[k]) }))
      ],
      actions: () => [
        { id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'), label: (s) => (s.playing ? '멈춤' : spec.playLabel || '조각 나누기 재생'), on: (s) => s.playing, run: (s) => { s.playing = !s.playing; if (s.playing) { const pk = gid(spec.id, spec.playKey || 'u'); if (s[pk] >= 0.995) { s[pk] = 0; s.f02dir = 1; s.f02hold = 0; } } } },
        { id: 'reroll', icon: 'reset', label: '숫자 바꾸기', run: (s, lab) => reroll(s, lab) }
      ],
      tick: (s, dt, lab) => {
        if (s.f02sid !== spec.id) return false;
        let again = false;
        if (lab.tab === 'explore') {
          if (s.playing) {
            if (s.f02hold > 0) s.f02hold -= dt;
            else {
              const pk = gid(spec.id, spec.playKey || 'u');
              s[pk] += (s.f02dir * dt) / 2.6;
              if (s[pk] >= 1) { s[pk] = 1; s.f02dir = -1; s.f02hold = 1; }
              if (s[pk] <= 0) { s[pk] = 0; s.f02dir = 1; s.f02hold = 0.8; }
            }
            again = true;
          }
          s.f02uShow = s[uKey];
        } else {
          s.playing = false;
          const P = spec.read(s), m = spec.build(P);
          const st = stateFor(spec, s, lab, P, m);
          const cur = s.f02uShow == null ? 0 : s.f02uShow;
          const diff = st.target - cur;
          if (Math.abs(diff) > 0.003) { s.f02uShow = cur + diff * Math.min(1, dt * 7); again = true; } else s.f02uShow = st.target;
        }
        return again;
      },
      steps: (s) => spec.steps(spec.read(s), modelOf(s)).map((x) => x.t.replace(/<\/?b>/g, '')),
      problem: {
        tag: spec.tag,
        text: (s) => spec.problem(spec.read(s), modelOf(s)).text + rerollBtn,
        answer: (s) => spec.problem(spec.read(s), modelOf(s)).answer,
        snap: () => { const o = {}; Object.keys(spec.snap).forEach((k) => { o[gid(spec.id, k)] = spec.snap[k]; }); o[uKey] = 0; return o; }
      },
      view: (s, lab) => {
        const P = spec.read(s, !lab || lab.tab === 'explore'), m = spec.build(P);
        const st = stateFor(spec, s, lab, P, m);
        return spec.view(P, m, st, s);
      },
      draw: (b, s, v, lab) => drawScene(spec, b, s, v, lab),
      solution: spec.solution ? { standardTitle: '모범답안 풀이', standardTag: '교재', quickTitle: '빠른 풀이 · 핵심 원리', quickTag: '핵심', standard: (s) => spec.solution.standard(spec.read(s), modelOf(s)), quick: (s) => spec.solution.quick(spec.read(s), modelOf(s)) } : undefined
    };
  }

  /* ======================= 공통 문장 만들기 ======================= */
  const texJoin = (items, f) => items.map((it, i) => (i === 0 ? (it.sign < 0 ? '-' : '') : it.sign > 0 ? '+' : '-') + f(it)).join('');
  const namesJoin = (items, suffix = '') => items.map((it, i) => (i === 0 ? '' : it.sign > 0 ? ' + ' : ' − ') + `(${it.name}${suffix})`).join('');
  const arcItems = (m) => m.order.map((id) => m.byId[id]).filter((it) => it.arc);
  const allItems = (m) => m.order.map((id) => m.byId[id]);

  function solLinesArcArea(m) {
    const arcs = arcItems(m), its = allItems(m);
    const aTexE = arcs.map((it) => it.arc.tex).join('+');
    const aTexV = arcs.map((it) => piTex(it.arc.len.a)).join('+');
    const tot = vtex(m.perim);
    const arTexE = texJoin(its, (it) => it.aTex);
    const arTexV = texJoin(its, (it) => vtex(it.area));
    const arTot = vtex(m.area);
    return [
      { at: 1, h: `<b>❶ (1) (색칠한 부분의 둘레의 길이)</b><br>= ${arcs.map((it) => `(${it.name}의 호의 길이)`).join(' + ')}` },
      { at: 2, h: `$=${aTexE}$` },
      { at: 3, h: `$=${aTexV}$<br>$=${tot}$ (cm)` },
      { at: 4, h: `<b>❷ (2) (색칠한 부분의 넓이)</b><br>= ${namesJoin(its)}` },
      { at: 5, h: `$=${arTexE}$` },
      { at: 6, h: `$=${arTexV}$<br>$=${arTot}$ (cm²)` }
    ];
  }
  function arcAreaSteps(m) {
    const arcs = arcItems(m), its = allItems(m);
    const aTexE = arcs.map((it) => it.arc.tex).join('+');
    const aTexV = arcs.map((it) => piTex(it.arc.len.a)).join('+');
    const arTexE = texJoin(its, (it) => it.aTex);
    const arTexV = texJoin(its, (it) => vtex(it.area));
    const arAreaWord = its[0].id === 'big' && its[0].aExpr.indexOf('½') < 0 ? '원의 넓이는 π × (반지름)² 이므로' : '반원의 넓이는 π × (반지름)² × ½ 이므로';
    return [
      { t: `❶ (1) 둘레: 색칠한 부분의 둘레는 ${arcs.map((it) => it.name).join(' · ')}의 호를 모두 더한 길이예요. 곧은 선(지름)은 둘레에 넣지 않아요.`, v: { mode: 'arc', u: 1, lab: 1 } },
      { t: `호의 길이는 2π × (반지름) × ½ 이므로 $${aTexE}$`, v: { mode: 'arc', u: 1, lab: 2 }, chip: { k: '둘레', tex: aTexE, color: 'sky' } },
      { t: `둘레 $=${aTexV}=${vtex(m.perim)}$ (cm)`, v: { mode: 'arc', u: 1, lab: 3 }, chip: { k: '둘레', tex: `${aTexV}=${vtex(m.perim)}`, color: 'sky' } },
      { t: `❷ (2) 넓이: 색칠한 부분 = ${namesJoin(its)}. 초록은 더하고 분홍은 빼요.`, v: { mode: 'area', u: 1, lab: 1 } },
      { t: `${arAreaWord} $${arTexE}$`, v: { mode: 'area', u: 1, lab: 2 }, chip: { k: '넓이', tex: arTexE, color: 'sky' } },
      { t: `넓이 $=${arTexV}=${vtex(m.area)}$ (cm²)`, v: { mode: 'area', u: 1, lab: 3 }, chip: { k: '넓이', tex: `${arTexV}=${vtex(m.area)}`, color: 'sky' } }
    ];
  }

  function solHTML(lines, step) {
    return `<div class="apl-rich">${lines.filter((l) => l.at <= step).map((l) => `<p>${l.h}</p>`).join('')}</div>`;
  }

  const PERIM_NOTE = '<b>둘레</b>에는 곧은 선(지름)을 넣지 않고 <b>곡선(호)</b>만 더해요. 처음에는 선과 호를 헷갈리기 쉬워요.';
  const SIGN_NOTE = '<b>넓이</b>는 더하는 조각(+)과 빼는 조각(−)을 구분해요. 어느 조각이 안쪽으로 파인 부분인지 먼저 확인하세요.';

  /* ======================= 장면 정의 ======================= */
  // ---------- 14번: 반원의 회전 ----------
  const rotSpec = {
    id: 'rot', title: '[14번] 반원을 60° 돌린 모양', short: '[14번] 반원 회전', tag: '교재 14번',
    question: '반원을 점 A를 중심으로 돌리면, 색칠한 부분의 넓이는 어떤 도형의 넓이와 같아질까요?',
    params: [
      { k: 'r', label: '반원 O의 반지름', min: 1, max: 6, step: 1, value: 3, color: 'sky', unit: ' cm' },
      { k: 'th', label: '돌린 각도', min: 5, max: 180, step: 5, value: 60, color: 'amber', unit: '°', hint: '그림의 B′ 손잡이를 끌어도 됩니다' },
      { k: 'sw', label: '돌리는 중 (0% → 100%)', min: 0, max: 1, step: 0.01, value: 1, color: 'green', hint: '막대를 움직이면 반원이 돌아가며 지나간 자리가 부채꼴이 돼요', fmt: (v) => (v >= 0.995 ? '다 돌림' : v <= 0.005 ? '처음 위치' : `${Math.round(v * 100)}%`) }
    ],
    playKey: 'sw', playLabel: '반원 돌려 보기',
    hasArc: false,
    snap: { r: 3, th: 60, sw: 1 },
    rolls: [{ r: 3, th: 60, sw: 1 }, { r: 2, th: 90, sw: 1 }, { r: 4, th: 45, sw: 1 }, { r: 3, th: 120, sw: 1 }, { r: 6, th: 30, sw: 1 }, { r: 3, th: 30, sw: 1 }, { r: 4, th: 90, sw: 1 }, { r: 2, th: 45, sw: 1 }],
    examples: [{ label: '60° (교재)', set: { r: 3, th: 60, sw: 1 } }, { label: '90°', set: { r: 3, th: 90, sw: 1 } }, { label: '180°', set: { r: 3, th: 180, sw: 1 } }],
    buildRaw: buildROT,
    view: (P, m, st) => {
      const Q = m.byId.sec.area;
      return {
        guide: `반원을 점 <b>A</b>를 중심으로 <b>${P.th}°</b> 돌렸어요. <b>B′ 손잡이</b>를 끌어 보세요. 색칠한 부분(<span style="color:var(--m-sky)">파란색</span>)의 넓이가 어떻게 달라지나요? 아래 막대로 조각을 가로로 떼어 놓을 수도 있어요.<br><span style="opacity:.8">초록 = 더하는 조각(+), 분홍 = 빼는 조각(−)</span>`,
        readouts: [
          { label: '색칠한 부분의 넓이', value: `${vplain(m.area)} cm²`, color: 'sky', note: '= 부채꼴 ABB′의 넓이' },
          { label: '부채꼴 ABB′', value: `반지름 ${2 * P.r} cm, 중심각 ${P.th}°`, color: 'amber', wide: true },
          { label: '반원 하나의 넓이', value: `${vplain(m.byId.orig.area)} cm²`, color: 'green', note: '회전한 반원과 처음 반원은 같아요' }
        ],
        parts: m.order.map((id) => { const it = m.byId[id]; return { id, name: `${it.sign > 0 ? '+' : MINUS} ${it.name}`, desc: it.aExpr, value: vplain(it.area), color: it.sign > 0 ? 'green' : 'rose' }; }),
        chips: [{ k: '넓이', tex: `${texJoin(allItems(m), (it) => vtex(it.area))}=${vtex(m.area)}`, color: 'sky' }],
        notes: '회전한 도형은 모양과 크기가 그대로예요. 그래서 <b>회전한 반원의 넓이 = 처음 반원의 넓이</b>이고, 둘은 더하고 빼면 사라져요. 남는 것은 <b>부채꼴</b>이에요.'
      };
    },
    steps: (P, m) => {
      const r = P.r, th = P.th, R2 = 2 * r;
      return [
        { t: `회전한 반원은 처음 반원과 모양과 크기가 같아요. 그래서 넓이가 같아요. $\\frac12\\pi\\times ${r}^2=${vtex(m.byId.orig.area)}$ (cm²)`, v: { mode: 'none', u: 0, lab: 0, flags: { congruent: true } }, chip: { k: '반원 하나', tex: `\\frac12\\pi\\times ${r}^2=${vtex(m.byId.orig.area)}`, color: 'green' } },
        { t: `색칠한 부분 = (회전한 반원) + (부채꼴 ABB′) − (처음 반원)`, v: { mode: 'area', u: 1, lab: 1 } },
        { t: `회전한 반원과 처음 반원의 넓이가 같으므로 서로 없어지고, <b>부채꼴 ABB′</b>만 남아요. $${vtex(m.byId.rot.area)}-${vtex(m.byId.orig.area)}=0$`, v: { mode: 'area', u: 1, lab: 3, flags: { fade: ['rot', 'orig'] } }, chip: { k: '남는 것', tex: `${vtex(m.byId.rot.area)}-${vtex(m.byId.orig.area)}+${vtex(m.byId.sec.area)}=${vtex(m.area)}`, color: 'sky' } },
        { t: `부채꼴 ABB′의 반지름은 AB = ${R2} cm, 중심각은 ${th}°예요.`, v: { mode: 'none', u: 0, lab: 0, flags: { sector: true } } },
        { t: `(넓이) $=\\pi\\times ${R2}^2\\times\\frac{${th}}{360}=${vtex(m.area)}$ (cm²)`, v: { mode: 'none', u: 0, lab: 0, flags: { sector: true } }, chip: { k: '넓이', tex: `\\pi\\times ${R2}^2\\times\\frac{${th}}{360}=${vtex(m.area)}`, color: 'sky' } }
      ];
    },
    problem: (P, m) => {
      const x = m.area.a, unit = pickUnit(x);
      const isDefault = P.r === 3 && P.th === 60;
      let pos = 4;
      if (!isDefault) { const maxPos = Math.max(0, Math.min(4, Math.floor(fnum(x) / fnum(unit)) - 1)); pos = (P.r * 7 + P.th) % (maxPos + 1); }
      const list = ap5(x, unit, pos);
      return {
        text: `<div>오른쪽 그림은 반지름의 길이가 ${P.r} cm인 반원 O를 점 A를 중심으로 ${P.th}°만큼 회전시킨 것이다. 이때 색칠한 부분의 넓이는?</div>${choicesHTML(list.map(piCm2))}`,
        answer: `${CIRC[pos]} $${piTex(x)}\\text{ cm}^2$ — 회전한 반원과 처음 반원은 넓이가 같으므로 색칠한 부분은 반지름 ${2 * P.r} cm, 중심각 ${P.th}°인 부채꼴의 넓이와 같아요.`
      };
    }
  };

  // ---------- 서술형 1 / 연습 1-1 (지름 위의 반원들) ----------
  function yySpec(variant) {
    const sj = variant === 'sj1';
    return {
      id: sj ? 'sj1' : 'y11',
      title: sj ? '[서술형 1] 지름 6 cm 원의 색칠한 부분' : '[연습 1-1] 지름 14 cm 원의 색칠한 부분',
      short: sj ? '[서술형 1] 지름 위의 세 반원' : '[연습 1-1] 반원 빼고 더하기',
      tag: sj ? '교재 서술형 1 [6점]' : '교재 연습 1-1 [6점]',
      question: sj ? '지름 위의 나눈 점을 움직여도 색칠한 부분의 둘레는 그대로일까요? 넓이는요?' : '지름을 나눈 점을 움직이면 둘레와 넓이는 각각 어떻게 달라질까요?',
      params: sj
        ? [{ k: 'a', label: '작은 반원의 지름 (아래)', min: 1, max: 8, step: 1, value: 2, color: 'green', unit: ' cm', hint: '그림의 노란 점(나눈 점)을 끌어도 됩니다' }, { k: 'b', label: '중간 반원의 지름 (위)', min: 1, max: 8, step: 1, value: 4, color: 'rose', unit: ' cm' }]
        : [{ k: 'a', label: '왼쪽 반원의 지름 (빼는 반원)', min: 1, max: 8, step: 1, value: 8, color: 'rose', unit: ' cm', hint: '그림의 노란 점(나눈 점)을 끌어도 됩니다' }, { k: 'b', label: '오른쪽 반원의 지름 (더하는 반원)', min: 1, max: 8, step: 1, value: 6, color: 'green', unit: ' cm' }],
      hasArc: true,
      snap: sj ? { a: 2, b: 4 } : { a: 8, b: 6 },
      rolls: sj ? [{ a: 2, b: 4 }, { a: 4, b: 6 }, { a: 2, b: 6 }, { a: 6, b: 4 }, { a: 4, b: 4 }, { a: 2, b: 8 }, { a: 4, b: 8 }] : [{ a: 8, b: 6 }, { a: 6, b: 4 }, { a: 4, b: 8 }, { a: 6, b: 6 }, { a: 8, b: 4 }, { a: 4, b: 6 }],
      examples: sj ? [{ label: '2 + 4 (교재)', set: { a: 2, b: 4 } }, { label: '3 + 3', set: { a: 3, b: 3 } }, { label: '1 + 5', set: { a: 1, b: 5 } }, { label: '5 + 1', set: { a: 5, b: 1 } }] : [{ label: '8 + 6 (교재)', set: { a: 8, b: 6 } }, { label: '7 + 7', set: { a: 7, b: 7 } }, { label: '4 + 10', set: { a: 4, b: 8 } }],
      buildRaw: (P) => buildYY(P, variant),
      view: (P, m, st) => {
        const d = m.d, pI = vplain(m.perim), aR = vplain(m.area);
        const chips = st.mode === 'arc' || (st.tab === 'review' && st.mode === 'arc')
          ? [{ k: '둘레', tex: `${arcItems(m).map((it) => piTex(it.arc.len.a)).join('+')}=${vtex(m.perim)}`, color: 'sky' }]
          : [{ k: '넓이', tex: `${texJoin(allItems(m), (it) => vtex(it.area))}=${vtex(m.area)}`, color: 'sky' }];
        return {
          guide: sj
            ? `지름 <b>${d} cm</b>인 원 안에서 <span style="color:var(--m-sky)">파란 부분</span>이 색칠한 부분이에요. <b>노란 점</b>을 끌어 나눈 점을 옮겨 보세요. 둘레와 넓이가 어떻게 변하나요? 막대로 조각을 가로로 떼어 놓으면 + 조각(초록)과 − 조각(분홍)이 보여요.`
            : `지름 <b>${d} cm</b>인 원에서 <span style="color:var(--m-sky)">파란 부분</span>이 색칠한 부분이에요. <b>노란 점</b>을 끌어 나눈 점을 옮겨 보세요. 막대로 조각을 떼어 놓으면 + 조각(초록)과 − 조각(분홍)이 보여요.`,
          readouts: [
            { label: '색칠한 부분의 둘레', value: `${pI} cm`, color: 'sky', note: `= 지름 ${d} cm인 원의 둘레` },
            { label: '색칠한 부분의 넓이', value: `${aR} cm²`, color: 'green' }
          ],
          parts: m.order.map((id) => { const it = m.byId[id]; return { id, name: `${it.sign > 0 ? '+' : MINUS} ${it.name}`, desc: `지름 ${it.id === 'big' ? d : it.id === 'left' ? P.a : P.b} cm · ${it.aExpr}`, value: vplain(it.area), color: it.sign > 0 ? 'green' : 'rose' }; }),
          chips,
          notes: PERIM_NOTE + '<br>' + SIGN_NOTE
        };
      },
      steps: (P, m) => arcAreaSteps(m),
      formulaLines: (m) => solLinesArcArea(m),
      problem: (P, m) => {
        const d = m.d, perim = vplain(m.perim), area = vplain(m.area);
        if (sj) {
          return {
            text: `<div>오른쪽 그림과 같이 지름의 길이가 ${d} cm인 원에 대하여 다음 물음에 답하고, 그 과정을 서술하시오. <span style="opacity:.7">[6점]</span></div><div style="margin-top:8px">(1) 색칠한 부분의 둘레의 길이를 구하시오. (3점)<br>(2) 색칠한 부분의 넓이를 구하시오. (3점)</div>`,
            answer: `(1) $${vtex(m.perim)}\\text{ cm}$ &nbsp; (2) $${vtex(m.area)}\\text{ cm}^2$ — 둘레는 세 반원의 호의 합, 넓이는 (큰 반원) + (작은 반원) − (중간 반원)`
          };
        }
        return {
          text: `<div>오른쪽 그림과 같이 지름의 길이가 ${d} cm인 원에서 색칠한 부분의 둘레의 길이와 넓이를 각각 구하고, 그 과정을 서술하시오. <span style="opacity:.7">[6점]</span></div>`,
          answer: `둘레 $${vtex(m.perim)}\\text{ cm}$ &nbsp; 넓이 $${vtex(m.area)}\\text{ cm}^2$ — 둘레는 세 호의 합, 넓이는 (큰 반원) − (왼쪽 반원) + (오른쪽 반원)`
        };
      },
      solution: {
        standard: (P, m) => ({ steps: solHTML(solLinesArcArea(m), 6), note: sj ? '색칠한 부분의 둘레 = 세 반원의 호의 길이의 합, 넓이 = (가장 큰 반원) + (가장 작은 반원) − (중간 반원)' : '둘레 = 세 호의 합, 넓이 = (가장 큰 반원) − (왼쪽 반원) + (오른쪽 반원)' }),
        quick: (P, m) => ({ steps: `나눈 점이 어디에 있든 <b>둘레는 지름 ${m.d} cm인 원의 둘레</b> $\\pi\\times ${m.d}=${vtex(m.perim)}$ 와 같아요. (두 작은 호의 합 = 큰 호)<br>넓이는 $\\frac{\\pi}{4}\\times ${sj ? P.a : P.b}\\times ${m.d}=${vtex(m.area)}$ 로도 구할 수 있어요.`, highlight: '나눈 점을 움직여 보면 둘레는 변하지 않고 넓이만 변해요.' })
      }
    };
  }

  // ---------- 연습 1-2: 반원 안의 두 반원 ----------
  const sj3Spec = {
    id: 'y12', title: '[연습 1-2] 반원에서 두 반원 빼기', short: '[연습 1-2] 반원 안의 두 반원', tag: '교재 연습 1-2 [6점]',
    question: '큰 반원에서 두 작은 반원을 빼면, 둘레와 넓이는 어떻게 구할까요?',
    params: [
      { k: 'p', label: '왼쪽 작은 반원의 반지름', min: 1, max: 6, step: 1, value: 2, color: 'rose', unit: ' cm', hint: '그림의 노란 점(맞닿은 점)을 끌어도 됩니다' },
      { k: 'q', label: '오른쪽 작은 반원의 반지름', min: 1, max: 6, step: 1, value: 3, color: 'rose', unit: ' cm' }
    ],
    hasArc: true,
    snap: { p: 2, q: 3 },
    rolls: [{ p: 2, q: 3 }, { p: 2, q: 4 }, { p: 3, q: 3 }, { p: 1, q: 4 }, { p: 3, q: 5 }, { p: 2, q: 5 }],
    examples: [{ label: '2, 3 (교재)', set: { p: 2, q: 3 } }, { label: '3, 3', set: { p: 3, q: 3 } }, { label: '1, 4', set: { p: 1, q: 4 } }],
    buildRaw: buildSJ3,
    view: (P, m, st) => {
      const R = m.R;
      return {
        guide: `큰 반원의 반지름은 <b>${R} cm</b>(= ${P.p} + ${P.q})예요. 그림의 점은 각 반원의 <b>중심</b>이고, ${P.p} cm와 ${P.q} cm는 작은 반원의 <b>반지름</b>이에요. <b>노란 점</b>을 끌어 보세요.`,
        readouts: [
          { label: '색칠한 부분의 둘레', value: `${vplain(m.perim)} cm`, color: 'sky', note: `= 지름 ${2 * R} cm인 원의 둘레` },
          { label: '색칠한 부분의 넓이', value: `${vplain(m.area)} cm²`, color: 'green', note: `= π × ${P.p} × ${P.q}` }
        ],
        parts: m.order.map((id) => { const it = m.byId[id]; return { id, name: `${it.sign > 0 ? '+' : MINUS} ${it.name}`, desc: it.aExpr, value: vplain(it.area), color: it.sign > 0 ? 'green' : 'rose' }; }),
        chips: st.mode === 'arc' ? [{ k: '둘레', tex: `${arcItems(m).map((it) => piTex(it.arc.len.a)).join('+')}=${vtex(m.perim)}`, color: 'sky' }] : [{ k: '넓이', tex: `${texJoin(allItems(m), (it) => vtex(it.area))}=${vtex(m.area)}`, color: 'sky' }],
        notes: `<b>두 작은 반원의 반지름</b>을 지름의 절반으로 헷갈리지 마세요. 이 그림의 ${P.p} cm, ${P.q} cm는 점에서 맞닿은 곳까지의 거리, 곧 반지름이에요.<br>` + PERIM_NOTE
      };
    },
    steps: (P, m) => arcAreaSteps(m),
    formulaLines: (m) => solLinesArcArea(m),
    problem: (P, m) => ({
      text: `<div>오른쪽 그림과 같은 반원에서 색칠한 부분의 둘레의 길이와 넓이를 각각 구하고, 그 과정을 서술하시오. <span style="opacity:.7">[6점]</span></div><div style="margin-top:8px;font-size:.9em;opacity:.8">(그림의 ${P.p} cm, ${P.q} cm는 작은 반원의 반지름)</div>`,
      answer: `둘레 $${vtex(m.perim)}\\text{ cm}$ &nbsp; 넓이 $${vtex(m.area)}\\text{ cm}^2$ — 큰 반원의 반지름 ${m.R} cm`
    }),
    solution: {
      standard: (P, m) => ({ steps: solHTML(solLinesArcArea(m), 6) }),
      quick: (P, m) => ({ steps: `둘레: 작은 호 두 개의 합 = 큰 호이므로 둘레 = 큰 호 × 2 = $2\\times\\pi\\times ${m.R}=${vtex(m.perim)}$.<br>넓이: $\\pi\\times ${P.p}\\times ${P.q}=${vtex(m.area)}$ (두 작은 반지름의 곱 × π).`, highlight: '막대로 두 반지름을 바꿔 보세요. 둘레는 π × (큰 반지름) × 2로 늘 같은 규칙이에요.' })
    }
  };

  // ---------- 08번: 큰 원 안의 같은 두 원 ----------
  const ccSpec = {
    id: 'cc08', title: '[08번] 원 안의 같은 두 원', short: '[08번] 큰 원 안의 두 원', tag: '교재 08번 (100발 100중)',
    question: '큰 원에서 작은 원 두 개를 뺀 부분의 둘레와 넓이는 어떻게 구할까요?',
    params: [{ k: 'R', label: '큰 원의 반지름', min: 4, max: 14, step: 2, value: 10, color: 'sky', unit: ' cm', hint: '그림의 오른쪽 노란 점을 끌어도 됩니다' }],
    hasArc: true,
    snap: { R: 10 },
    rolls: [{ R: 10 }, { R: 8 }, { R: 6 }, { R: 12 }, { R: 4 }, { R: 14 }],
    examples: [{ label: '10 cm (교재)', set: { R: 10 } }, { label: '6 cm', set: { R: 6 } }, { label: '12 cm', set: { R: 12 } }],
    buildRaw: buildCC,
    view: (P, m, st) => ({
      guide: `큰 원의 반지름은 <b>${P.R} cm</b>이고, 작은 원 두 개의 <b>지름</b>은 각각 <b>${P.R} cm</b>(= 큰 원의 반지름)예요. 그래서 반지름은 ${P.R / 2} cm예요.`,
      readouts: [
        { label: '색칠한 부분의 둘레', value: `${vplain(m.perim)} cm`, color: 'sky', note: '바깥 원 + 안쪽 두 원' },
        { label: '색칠한 부분의 넓이', value: `${vplain(m.area)} cm²`, color: 'green', note: '큰 원의 절반' }
      ],
      parts: m.order.map((id) => { const it = m.byId[id]; return { id, name: `${it.sign > 0 ? '+' : MINUS} ${it.name}`, desc: it.aExpr, value: vplain(it.area), color: it.sign > 0 ? 'green' : 'rose' }; }),
      chips: st.mode === 'arc' ? [{ k: '둘레', tex: `${arcItems(m).map((it) => piTex(it.arc.len.a)).join('+')}=${vtex(m.perim)}`, color: 'sky' }] : [{ k: '넓이', tex: `${texJoin(allItems(m), (it) => vtex(it.area))}=${vtex(m.area)}`, color: 'sky' }],
      notes: '그림의 ' + P.R + ' cm는 작은 원의 <b>지름</b>이에요. 반지름으로 착각하면 넓이가 4배로 틀려요.<br>' + PERIM_NOTE
    }),
    steps: (P, m) => arcAreaSteps(m).map((x, i) => (i === 0 ? { ...x, t: `❶ 둘레: 색칠한 부분의 둘레는 큰 원의 둘레와 작은 원 두 개의 둘레를 모두 더한 길이예요.` } : x)),
    formulaLines: (m) => solLinesArcArea(m),
    problem: (P, m) => {
      const R = P.R, p4 = fr(4 * R), p5 = fr(5 * R);
      const area = [fr(R * R, 4), fr(R * R, 2), fr(3 * R * R, 4)];
      let list;
      if (R === 10) list = [['40π cm', '40π cm²'], ['40π cm', '50π cm²'], ['40π cm', '75π cm²'], ['50π cm', '40π cm²'], ['50π cm', '50π cm²']];
      else list = [[p4, area[0]], [p4, area[1]], [p4, area[2]], [p5, area[0]], [p5, area[1]]].map(([a, c]) => [`${vplain(V(a))} cm`, `${vplain(V(c))} cm²`]);
      return {
        text: `<div>오른쪽 그림과 같이 반지름의 길이가 ${R} cm인 원에서 색칠한 부분의 둘레의 길이와 넓이를 차례대로 구하면?</div>${choicesHTML(list.map((c) => `${c[0]}, ${c[1]}`))}`,
        answer: `② ${vplain(m.perim)} cm, ${vplain(m.area)} cm² — 둘레는 큰 원 + 작은 원 2개, 넓이는 큰 원 − 작은 원 2개`
      };
    },
    solution: {
      standard: (P, m) => ({ steps: solHTML(solLinesArcArea(m), 6) }),
      quick: (P, m) => ({ steps: `작은 두 원의 지름의 합 = 큰 원의 지름이므로 작은 원 둘레의 합 = 큰 원 둘레. 따라서 둘레 = 큰 원 둘레 × 2 = $2\\times 2\\pi\\times ${P.R}=${vtex(m.perim)}$.<br>넓이는 큰 원($${vtex(V(fr(P.R * P.R)))}$)에서 작은 원 둘($${vtex(V(fr(P.R * P.R, 2)))}$)을 빼면 $${vtex(m.area)}$.`, highlight: '큰 원의 반지름을 바꿔도 색칠한 넓이는 언제나 큰 원의 절반이에요.' })
    }
  };

  // ---------- 13번: 직각삼각형의 세 반원 ----------
  const luneSpec = {
    id: 'lune13', title: '[13번] 직각삼각형 세 변 위의 반원', short: '[13번] 초승달 두 개', tag: '교재 13번',
    question: '직각삼각형 세 변을 지름으로 하는 반원을 그리면, 색칠한 두 초승달의 넓이는 얼마일까요?',
    params: [
      { k: 'p', label: '변 AB의 길이', min: 2, max: 12, step: 1, value: 4, color: 'amber', unit: ' cm' },
      { k: 'q', label: '변 CA의 길이', min: 2, max: 12, step: 1, value: 3, color: 'amber', unit: ' cm' }
    ],
    hasArc: false,
    snap: { p: 4, q: 3 },
    rolls: [{ p: 4, q: 3 }, { p: 6, q: 8 }, { p: 5, q: 12 }, { p: 12, q: 9 }, { p: 8, q: 6 }, { p: 9, q: 12 }],
    examples: [{ label: '4, 3 (교재)', set: { p: 4, q: 3 } }, { label: '6, 8', set: { p: 6, q: 8 } }, { label: '5, 12', set: { p: 5, q: 12 } }, { label: '4, 4 (이등변)', set: { p: 4, q: 4 } }],
    buildRaw: buildLUNE,
    view: (P, m, st) => {
      const tri = m.byId.tri.area;
      const semiSum = vadd(m.byId.ab.area, m.byId.ac.area);
      return {
        guide: `∠A = 90°인 직각삼각형 ABC의 <b>세 변을 지름</b>으로 하는 반원을 그렸어요. <span style="color:var(--m-sky)">파란 두 초승달</span>의 넓이는 얼마일까요? 길이를 바꿔도 초승달의 넓이가 무엇과 같은지 살펴보세요. (막대로 조각을 가로로 떼어 놓을 수도 있어요.)`,
        readouts: [
          { label: '색칠한 부분의 넓이', value: `${vplain(m.area)} cm²`, color: 'sky' },
          { label: '△ABC의 넓이', value: `${vplain(tri)} cm²`, color: 'amber', note: '= 색칠한 부분' },
          { label: '반원 AB + 반원 AC', value: `${vplain(semiSum)} cm²`, color: 'green', note: `반원 BC = ${vplain(m.byId.bc.area)} cm²와 같아요` }
        ],
        parts: m.order.map((id) => { const it = m.byId[id]; return { id, name: `${it.sign > 0 ? '+' : MINUS} ${it.name}`, desc: it.aExpr, value: vplain(it.area), color: it.sign > 0 ? 'green' : 'rose' }; }),
        chips: [{ k: '넓이', tex: `${texJoin(allItems(m), (it) => vtex(it.area))}=${vtex(m.area)}`, color: 'sky' }],
        notes: '색칠한 부분이 곡선으로 둘러싸여 있어도, 반원과 삼각형의 합·차로 나누면 <b>π가 모두 사라지고</b> 삼각형의 넓이만 남아요. (반원 AB + 반원 AC = 반원 BC)'
      };
    },
    steps: (P, m) => {
      const its = allItems(m);
      const ab = m.byId.ab.area, ac = m.byId.ac.area, bc = m.byId.bc.area, tri = m.byId.tri.area;
      return [
        { t: `색칠한 부분 = (반원 AB) + (반원 AC) + (△ABC) − (반원 BC). 초록은 더하고 분홍은 빼요.`, v: { mode: 'area', u: 1, lab: 1 } },
        { t: `각 넓이: 반원 AB $=${vtex(ab)}$, 반원 AC $=${vtex(ac)}$, △ABC $=${vtex(tri)}$, 반원 BC $=${vtex(bc)}$ (cm²)`, v: { mode: 'area', u: 1, lab: 3 }, chip: { k: '넓이', tex: `${texJoin(its, (it) => vtex(it.area))}`, color: 'sky' } },
        { t: `$${vtex(ab)}+${vtex(ac)}=${vtex(bc)}$ 이므로 (반원 AB) + (반원 AC) = (반원 BC) 예요. π가 들어 있는 조각이 모두 사라져요.`, v: { mode: 'area', u: 1, lab: 3, flags: { fade: ['ab', 'ac', 'bc'] } }, chip: { k: '반원 AB + AC', tex: `${vtex(ab)}+${vtex(ac)}=${vtex(bc)}`, color: 'green' } },
        { t: `색칠한 부분의 넓이 = △ABC $=\\frac12\\times ${P.p}\\times ${P.q}=${vtex(m.area)}$ (cm²)`, v: { mode: 'none', u: 0, lab: 0, flags: { tri: true } }, chip: { k: '넓이', tex: `\\frac12\\times ${P.p}\\times ${P.q}=${vtex(m.area)}`, color: 'sky' } }
      ];
    },
    formulaLines: null,
    problem: (P, m) => {
      const pq = P.p * P.q;
      const lst = [fr(pq, 2), fr(3 * pq, 4), fr(pq)].map((x) => `$${ftex(x)}\\text{ cm}^2$`).concat([fr(pq, 6), fr(pq, 4)].map((x) => `$${piTex(x)}\\text{ cm}^2$`));
      const bcTxt = m.cInt ? `, $\\overline{\\mathrm{BC}}=${m.c}$ cm` : '';
      return {
        text: `<div>오른쪽 그림은 ∠A=90°인 직각삼각형 ABC의 각 변을 지름으로 하는 반원을 그린 것이다. $\\overline{\\mathrm{AB}}=${P.p}$ cm${bcTxt}, $\\overline{\\mathrm{CA}}=${P.q}$ cm일 때, 색칠한 부분의 넓이는?</div>${choicesHTML(lst)}`,
        answer: `① $${vtex(m.area)}\\text{ cm}^2$ — (반원 AB) + (반원 AC) = (반원 BC)이므로 색칠한 부분은 △ABC와 같아요.`
      };
    },
    solution: {
      standard: (P, m) => ({ steps: `(색칠한 부분) = (반원 AB) + (반원 AC) + (△ABC) − (반원 BC)<br>$=${vtex(m.byId.ab.area)}+${vtex(m.byId.ac.area)}+${vtex(m.byId.tri.area)}-${vtex(m.byId.bc.area)}$<br>$=${vtex(m.area)}$ (cm²)` }),
      quick: (P, m) => ({ steps: `직각삼각형의 빗변이 아닌 두 변 위의 반원 넓이의 합은 빗변 위의 반원 넓이와 같아요. 그래서 색칠한 두 초승달 = 삼각형, 곧 $\\frac12\\times ${P.p}\\times ${P.q}=${vtex(m.area)}$.`, highlight: '길이를 바꿔 보세요. 색칠한 넓이는 언제나 △ABC의 넓이예요.' })
    }
  };

  // ---------- 15번: 정삼각형의 세 반원 ----------
  const petalSpec = {
    id: 'petal15', title: '[15번] 정삼각형 세 변 위의 반원', short: '[15번] 꽃잎 세 개', tag: '교재 15번 (실수 유발)',
    question: '정삼각형 세 변을 지름으로 하는 반원을 그리면, 색칠한 꽃잎 세 개의 넓이는 얼마일까요?',
    params: [{ k: 'a', label: '정삼각형 한 변의 길이', min: 4, max: 16, step: 2, value: 8, color: 'amber', unit: ' cm' }],
    hasArc: false,
    snap: { a: 8 },
    rolls: [{ a: 8 }, { a: 4 }, { a: 12 }, { a: 16 }],
    examples: [{ label: '8 cm (교재)', set: { a: 8 } }, { label: '4 cm', set: { a: 4 } }, { label: '12 cm', set: { a: 12 } }],
    buildRaw: buildPETAL,
    view: (P, m, st) => ({
      guide: `정삼각형 ABC의 <b>각 변</b>(${P.a} cm)을 지름으로 하는 반원을 그렸어요. 반지름은 <b>${P.a / 2} cm</b>예요. <span style="color:var(--m-sky)">파란 꽃잎 3개</span>의 넓이를 구해요. 막대로 꽃잎을 가로로 떼어 놓으면 세 꽃잎이 똑같다는 것을 볼 수 있어요.`,
      readouts: [
        { label: '꽃잎 하나의 넓이', value: `${vplain(m.byId.pa.area)} cm²`, color: 'green', note: `반지름 ${P.a / 2} cm, 중심각 60°인 부채꼴과 같아요` },
        { label: '색칠한 부분의 넓이', value: `${vplain(m.area)} cm²`, color: 'sky', note: '꽃잎 3개' }
      ],
      parts: m.order.map((id) => { const it = m.byId[id]; return { id, name: `+ ${it.name}`, desc: it.aExpr, value: vplain(it.area), color: 'green' }; }),
      chips: [{ k: '넓이', tex: `${m.order.map((id) => vtex(m.byId[id].area)).join('+')}=${vtex(m.area)}`, color: 'sky' }],
      notes: '꽃잎 하나는 (정삼각형) + (활꼴 2개) − (활꼴 1개)예요. 활꼴은 모두 합동이므로 <b>정삼각형 + 활꼴 1개 = 부채꼴(중심각 60°)</b>이에요.'
    }),
    steps: (P, m) => {
      const rr = P.a / 2;
      return [
        { t: `한 변이 ${P.a} cm이고 각 변이 반원의 지름이에요. 변의 중점이 반원의 중심이므로 반지름은 한 변의 절반인 ${rr} cm예요.`, v: { mode: 'none', u: 0, lab: 0, flags: { radii: true } } },
        { t: `꽃잎 하나는 한 변이 ${rr} cm인 정삼각형(노랑)에 활꼴 2개(초록)를 더하고, 안쪽의 활꼴 1개(분홍)를 뺀 모양이에요.`, v: { mode: 'none', u: 0, lab: 0, flags: { parts: true } } },
        { t: `활꼴은 모두 합동이므로 (정삼각형) + (활꼴 1개)와 같아요. 이것은 반지름 ${rr} cm, 중심각 60°인 부채꼴이에요.`, v: { mode: 'none', u: 0, lab: 0, flags: { sector: true } } },
        { t: `꽃잎 하나 = 부채꼴 $=\\pi\\times ${rr}^2\\times\\frac{60}{360}=${vtex(m.byId.pa.area)}$ (cm²)`, v: { mode: 'area', u: 1, lab: 3 }, chip: { k: '꽃잎 하나', tex: `\\pi\\times ${rr}^2\\times\\frac{60}{360}=${vtex(m.byId.pa.area)}`, color: 'green' } },
        { t: `색칠한 부분은 꽃잎 3개이므로 $3\\times ${vtex(m.byId.pa.area)}=${vtex(m.area)}$ (cm²)`, v: { mode: 'area', u: 1, lab: 3 }, chip: { k: '넓이', tex: `3\\times ${vtex(m.byId.pa.area)}=${vtex(m.area)}`, color: 'sky' } }
      ];
    },
    formulaLines: null,
    problem: (P, m) => {
      const x = fr(P.a * P.a, 16);
      const list = [fr(2), fr(3), fr(4), fr(5), fr(6)].map((k) => fmul(x, fmul(k, HALF)));
      return {
        text: `<div>오른쪽 그림은 한 변의 길이가 ${P.a} cm인 정삼각형 ABC의 각 변을 지름으로 하는 반원을 그린 것이다. 이때 색칠한 부분의 넓이는?</div>${choicesHTML(list.map(piCm2))}`,
        answer: `③ $${vtex(m.area)}\\text{ cm}^2$ — 꽃잎 하나는 반지름 ${P.a / 2} cm, 중심각 60°인 부채꼴과 같으므로 $3\\times ${vtex(m.byId.pa.area)}$`
      };
    },
    solution: {
      standard: (P, m) => ({ steps: `꽃잎 하나 = 부채꼴 $=\\pi\\times ${P.a / 2}^2\\times\\frac{60}{360}=${vtex(m.byId.pa.area)}$<br>색칠한 부분 $=3\\times ${vtex(m.byId.pa.area)}=${vtex(m.area)}$ (cm²)` }),
      quick: (P, m) => ({ steps: `꽃잎 3개는 각각 중심각 60°인 부채꼴이에요. 60° × 3 = 180°이므로 색칠한 부분의 넓이는 <b>반지름 ${P.a / 2} cm인 반원의 넓이</b> $\\frac12\\pi\\times ${P.a / 2}^2=${vtex(m.area)}$와 같아요.`, highlight: '세 꽃잎을 모으면 반원 하나와 같은 넓이예요.' })
    }
  };

  // ---------- 확장: 지름을 n등분 ----------
  function nsSpec(variant) {
    const isC = variant === 'circle';
    return {
      id: isC ? 'nc' : 'ns', title: isC ? '[확장] 지름을 n등분한 작은 원 n개' : '[확장] 반원에서 작은 반원 n개 빼기', short: isC ? '[확장] 작은 원 n개' : '[확장] 작은 반원 n개',
      tag: isC ? '확장 · 08번 변형' : '확장 · 연습 1-2 변형',
      question: isC ? '큰 원의 지름을 n등분해 작은 원 n개를 빼면, 둘레는 n이 바뀌어도 변할까요?' : '큰 반원의 지름을 n등분해 작은 반원 n개를 빼면, 둘레는 n이 바뀌어도 변할까요?',
      params: [
        { k: 'R', label: isC ? '큰 원의 반지름' : '큰 반원의 반지름', min: 4, max: 12, step: 1, value: 6, color: 'sky', unit: ' cm', hint: '그림의 오른쪽 노란 점을 끌어도 됩니다' },
        { k: 'n', label: '나누는 개수 n', min: 2, max: 5, step: 1, value: 3, color: 'rose', unit: '개' }
      ],
      hasArc: true,
      snap: { R: 6, n: 3 },
      rolls: [{ R: 6, n: 3 }, { R: 10, n: 2 }, { R: 12, n: 4 }, { R: 8, n: 2 }, { R: 12, n: 3 }, { R: 10, n: 5 }],
      examples: [{ label: 'n = 2', set: { R: 6, n: 2 } }, { label: 'n = 3', set: { R: 6, n: 3 } }, { label: 'n = 4', set: { R: 6, n: 4 } }],
      buildRaw: (P) => buildNS(P, variant),
      view: (P, m, st) => ({
        guide: `큰 ${isC ? '원' : '반원'}의 반지름은 <b>${P.R} cm</b>이고, 지름을 <b>${P.n}등분</b>해 반지름 ${rt(fr(P.R, P.n))} cm인 작은 ${isC ? '원' : '반원'} ${P.n}개를 빼요. 막대로 n을 바꾸고 둘레와 넓이를 비교해 보세요.`,
        readouts: [
          { label: '색칠한 부분의 둘레', value: `${vplain(m.perim)} cm`, color: 'sky', note: isC ? 'n이 바뀌어도 4π × 반지름으로 같아요' : 'n이 바뀌어도 2π × 반지름으로 같아요' },
          { label: '색칠한 부분의 넓이', value: `${vplain(m.area)} cm²`, color: 'green', note: `큰 ${isC ? '원' : '반원'}의 ${P.n - 1}/${P.n}` }
        ],
        parts: m.order.map((id) => { const it = m.byId[id]; return { id, name: `${it.sign > 0 ? '+' : MINUS} ${it.name}`, desc: it.aExpr, value: vplain(it.area), color: it.sign > 0 ? 'green' : 'rose' }; }),
        chips: st.mode === 'arc' ? [{ k: '둘레', tex: `${vtex(m.perim)}`, color: 'sky' }] : [{ k: '넓이', tex: `${vtex(m.byId.big.area)}-${P.n}\\times ${vtex(m.byId.s0.area)}=${vtex(m.area)}`, color: 'sky' }],
        notes: PERIM_NOTE
      }),
      steps: (P, m) => arcAreaSteps(m).map((x) => ({ ...x, t: x.t.replace(/ · /g, ' · ') })),
      formulaLines: (m) => solLinesArcArea(m),
      problem: (P, m) => ({
        text: `<div>반지름의 길이가 ${P.R} cm인 ${isC ? '원' : '반원'}의 지름을 ${P.n}등분하여, 그 지름을 각각의 지름으로 하는 ${isC ? '원' : '반원'} ${P.n}개를 그렸다. 색칠한 부분의 둘레의 길이와 넓이를 각각 구하시오.</div>`,
        answer: `둘레 $${vtex(m.perim)}\\text{ cm}$ &nbsp; 넓이 $${vtex(m.area)}\\text{ cm}^2$`
      }),
      solution: {
        standard: (P, m) => ({ steps: solHTML(solLinesArcArea(m), 6) }),
        quick: (P, m) => ({ steps: `작은 ${isC ? '원' : '반원'} ${P.n}개의 둘레의 합 = 큰 ${isC ? '원' : '반원'} 하나의 ${isC ? '둘레' : '호'}. 그래서 n과 관계없이 둘레는 ${isC ? '큰 원 둘레의 2배' : '큰 호의 2배'}, 곧 ${vplain(m.perim)} cm예요.`, highlight: 'n을 바꿔도 둘레는 변하지 않고 넓이만 변해요.' })
      }
    };
  }

  // 공통 view 보강(chips가 없으면 비움) / formula 연결
  function attachFormula(scene, spec) {
    const view = scene.view;
    scene.view = (s, lab) => {
      const v = view(s, lab) || {};
      const P = spec.read(s), m = spec.build(P);
      const step = s.step || 0;
      if (spec.formulaLines) v.formula = solHTML(spec.formulaLines(m), step);
      else {
        const st = spec.steps(P, m);
        v.formula = `<div class="apl-rich">${st.slice(0, Math.max(1, step)).map((x) => `<p>${x.t.replace(/\$/g, '$')}</p>`).join('')}</div>`;
      }
      if (lab && lab.tab === 'problem') v.chips = [];
      else if (lab && lab.tab === 'review') {
        const list = spec.steps(P, m), stp = list[clamp(step, 1, list.length) - 1];
        v.chips = stp && stp.chip ? [stp.chip] : [];
      }
      return v;
    };
    return scene;
  }

  [rotSpec, yySpec('sj1'), yySpec('y11'), sj3Spec, ccSpec, luneSpec, petalSpec, nsSpec('circle'), nsSpec('semi')].forEach((spec) => {
    GROUP.scenes.push(attachFormula(makeScene(spec), spec));
  });

  (window.APL_CS_GROUPS = window.APL_CS_GROUPS || []).push(GROUP);
})();
