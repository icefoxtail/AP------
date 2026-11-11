/* ==========================================================================
   중3 · 원의 성질 — 공용 도구 (core.js)
   - 일곱 개 탭 모듈(t1~t7.js)이 함께 쓰는 작은 도구 모음입니다. 전역은 APL_CI(도구)와 APL_CI_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구 → 먼저 문제 풀기 → 현재 문항의 단계별 풀이 → 답 확인.
   - 색의 역할(이 실험실 전체): 하늘 = 주어진 길이·각 · 분홍 = 구하는 값 x · 노랑 = 끌 수 있는 점·같은 길이 눈금 · 초록 = 보조선·정리로 알아낸 값 · 기본 = 도형의 변.
   - 같은 크기의 각은 같은 표시(호 1개, 2개, 3개), 직각은 네모, 같은 길이는 눈금, 평행선은 화살표.
   - 움직임은 가로 이동만(세로 이동 없음). 제자리 회전·접기·서서히 나타남은 허용. 호 위의 점은 막대로, 접선 위의 점 P는 가로로 끕니다.
   - 도형 좌표계: figure (y 아래쪽). 각도는 mp(c,r,deg)처럼 수학 방향(반시계, 위쪽이 +)을 씁니다.
   ========================================================================== */
(function () {
  'use strict';
  const PI = Math.PI, DEG = PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const seg01 = (t, a, b) => ease((t - a) / (b - a));
  const NUM = ['①', '②', '③', '④', '⑤'];
  const LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ------------------------------------------------------------------ 숫자 서식 */
  const r1 = (v) => Math.round(v * 10) / 10;
  const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
  const fmtN = (v) => { const x = r1(v); return (Number.isInteger(x) ? String(x) : x.toFixed(1)).replace('-', '−'); };
  const dg = (v) => fmtN(v) + '°';
  const eqs = (v) => (isInt(v * 10) ? '=' : '≈');
  const tx = (v) => fmtN(v).replace('−', '-');
  const texDeg = (v) => tx(v) + '^{\\circ}';
  const ol = (s) => `\\overline{${s}}`; // 선분 이름(TeX)

  /* ------------------------------------------------------------------ 기하 (figure: y 아래쪽) */
  const pt = (x, y) => ({ x, y });
  const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
  const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
  const mul = (a, k) => ({ x: a.x * k, y: a.y * k });
  const len = (a) => Math.hypot(a.x, a.y);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const unit = (a) => { const l = len(a) || 1; return { x: a.x / l, y: a.y / l }; };
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const lerp = (a, b, f) => ({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
  const polar = (c, r, deg) => ({ x: c.x + r * Math.cos(deg * DEG), y: c.y + r * Math.sin(deg * DEG) });
  const dirDeg = (a, b) => Math.atan2(b.y - a.y, b.x - a.x) / DEG;
  const rotP = (p, c, deg) => { // 점 p 를 c 둘레로 deg(도, 화면에서 시계 방향 +) 만큼 돌린 점
    const t = deg * DEG, d = sub(p, c);
    return { x: c.x + d.x * Math.cos(t) - d.y * Math.sin(t), y: c.y + d.x * Math.sin(t) + d.y * Math.cos(t) };
  };
  const angBetween = (V, A, B) => {
    const u = sub(A, V), w = sub(B, V);
    return Math.acos(clamp((u.x * w.x + u.y * w.y) / (len(u) * len(w) || 1), -1, 1)) / DEG;
  };
  const cross = (a, b) => a.x * b.y - a.y * b.x;
  function inter(P, Q, R, S) {
    const d1 = sub(Q, P), d2 = sub(S, R), den = cross(d1, d2);
    if (Math.abs(den) < 1e-12) return null;
    const t = cross(sub(R, P), d2) / den;
    return { x: P.x + d1.x * t, y: P.y + d1.y * t };
  }
  const polyArea = (P) => P.reduce((a, p, i) => a + cross(p, P[(i + 1) % P.length]), 0) / 2;
  const centroid = (P) => ({ x: P.reduce((a, p) => a + p.x, 0) / P.length, y: P.reduce((a, p) => a + p.y, 0) / P.length });
  const pick = (list, cur) => { const pool = list.filter((x) => x !== cur); return pool[Math.floor(Math.random() * pool.length)]; };
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const bboxOf = (pts, pad = 0) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
  };
  const unionBox = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });
  const shiftPts = (P, dx, dy = 0) => P.map((p) => pt(p.x + dx, p.y + dy));

  /* ------------------------------------------------------------------ 그리기 도우미 */
  const hasFrac = (t) => /\\frac\{/.test(String(t));
  const textW = (t, size0) => { const hf = hasFrac(t), size = hf ? size0 * 1.25 : size0; t = String(t).replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, x, y) => (x.length >= y.length ? x : y)).replace(/\\sqrt\{([^{}]*)\}/g, '√$1').replace(/\\pi/g, 'π'); let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size * 1.0 : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };
  // 구하는 값 x 가 들어간 글자(x · AB=x …)는 자동으로 분홍·크게 그립니다.
  function T(b, p, str, o = {}) {
    if (str == null || str === '') return;
    const isX = str === 'x' || /=x$/.test(String(str)) || /^x=/.test(String(str));
    b.text(p, str, { dx: o.dx || 0, dy: o.dy || 0, color: isX ? 'rose' : o.color || 'ink', size: (isX ? Math.max(o.size && o.size > 17 ? o.size : 0, 19) : o.size || 16) * (hasFrac(str) ? 1.25 : 1), weight: 800, align: o.align || 'center', baseline: 'middle', alpha: o.alpha, ref: o.ref, leaderAnchor: o.leaderAnchor, leader: o.leader });
  }
  function tagOut(b, p, c, str, o = {}) {
    const u = unit(sub(p, c)), size = o.size || 17, w = textW(str, size), g = o.gap == null ? 12 : o.gap;
    const d = Math.abs(u.x) * (w / 2) + Math.abs(u.y) * size * 0.55 + g;
    T(b, p, str, { ...o, size, dx: u.x * d, dy: u.y * d, leaderAnchor: p });
  }
  function vtx(b, p, c, name, o = {}) {
    b.point(p, { color: o.color || 'ink', r: o.r || 4.5 });
    if (name) tagOut(b, p, c, name, { size: o.size || 17, gap: o.gap == null ? 11 : o.gap, color: o.nameColor || 'ink' });
  }
  // 변 pq 의 바깥쪽(중심 c 의 반대쪽)에 글자를 놓습니다.
  function sideTag(b, p, q, c, str, o = {}) {
    const m = mid(p, q), size = o.size || 16;
    let n = unit({ x: -(q.y - p.y), y: q.x - p.x });
    if (n.x * (m.x - c.x) + n.y * (m.y - c.y) < 0) n = mul(n, -1);
    const w = textW(str, size), g = o.gap == null ? 12 : o.gap;
    const d = Math.abs(n.x) * (w / 2) + Math.abs(n.y) * size * 0.55 + g;
    T(b, m, str, { color: o.color || 'ink', size, dx: n.x * d + (o.dx || 0), dy: n.y * d + (o.dy || 0), alpha: o.alpha, leaderAnchor: m, leader: o.leader });
  }
  /* 각 표시: 꼭짓점 V 에서 반직선 VA → VB 방향의 작은 각. rings = 호 개수(같은 각은 같은 개수). 직각이면 네모. */
  function ang(b, V, A, B, o = {}) {
    const k = b.k || 60, requestedR = (o.r || 26) * (b.thumb ? 0.7 : 1);
    // On the short problem board a fixed pixel arc can reach the next vertex.
    // Keep it local to its two rays; a callout identifies its value separately.
    const r = b.ciMobileProblem ? Math.min(requestedR, Math.min(dist(V, A), dist(V, B)) * k * .28) : requestedR;
    const a0 = Math.atan2(A.y - V.y, A.x - V.x), a1 = Math.atan2(B.y - V.y, B.x - V.x);
    let d = ((a1 - a0 + PI * 3) % (PI * 2)) - PI;
    if (o.big) d = d > 0 ? d - PI * 2 : d + PI * 2;
    const deg = Math.abs(d) / DEG, col = o.color || 'sky', am = a0 + d / 2;
    const rw = r / k;
    if (!o.noMark) {
      if (!o.big && Math.abs(deg - 90) < 0.6 && !o.noRight) {
        b.right(V, A, B, { size: Math.min(r * 0.62, 17), color: col });
      } else {
        b.arc(V, rw, a0, a0 + d, { sector: true, fill: col, fillAlpha: o.fa == null ? 0.2 : o.fa, color: null, ccw: d < 0, ref: o.ref });
        const rings = o.rings || 1;
        b.arc(V, rw, a0, a0 + d, { color: col, width: 2.4, ccw: d < 0, ref: o.ref });
        const ringGap = b.ciMobileProblem ? Math.min(4.6, r / (rings + 1)) : 4.6;
        for (let i = 1; i < rings; i++) b.arc(V, rw - (i * ringGap) / k, a0, a0 + d, { color: col, width: 2.2, ccw: d < 0, ref: o.ref });
      }
    }
    if (o.label) {
      const size = o.size || 15;
      const need = (textW(o.label, size) / 2 + 5) / Math.max(0.2, Math.sin(clamp(Math.abs(d) / 2, 0.12, 1.5)));
      const dst = o.labelDist != null ? o.labelDist : b.ciMobileProblem ? Math.max(r + 10, Math.min(need, r + 22)) : Math.max(r + 14, Math.min(need, r + 34));
      const la = am + (o.labelRot || 0) * DEG;
      // Keep the continuous angle-bisector placement. Only an explicit rotation
      // outside the angle needs a callout before collision avoidance moves it.
      const turn = (((d < 0 ? -1 : 1) * (la - a0)) % (PI * 2) + PI * 2) % (PI * 2);
      const outside = o.labelRot != null && turn > Math.abs(d) + 1e-6;
      const square = !o.big && Math.abs(deg - 90) < .6 && !o.noRight, corner = Math.min(r * .62, 17) / k;
      const anchor = square ? add(V, add(mul(unit(sub(A, V)), corner), mul(unit(sub(B, V)), corner))) : pt(V.x + Math.cos(am) * rw, V.y + Math.sin(am) * rw);
      T(b, V, o.label, { dx: Math.cos(la) * dst, dy: Math.sin(la) * dst, color: o.labelColor || col, size, alpha: o.alpha, leaderAnchor: o.noMark ? null : anchor, leader: outside || !!b.ciMobileProblem });
    }
    return { deg, mid: am };
  }
  function tick(b, p, q, count = 1, color = 'amber') { b.ticks(p, q, { color, count, size: 7 }); }
  function par(b, p, q, count = 1, color = 'green', f = 0.5) {
    const k = b.k || 60, u = unit(sub(q, p)), n = { x: -u.y, y: u.x }, m = lerp(p, q, f), s = 8 / k;
    for (let i = 0; i < count; i++) {
      const c = add(m, mul(u, (i - (count - 1) / 2) * 7 / k));
      b.path([add(sub(c, mul(u, s)), mul(n, s)), c, sub(sub(c, mul(u, s)), mul(n, s))], { color, width: 2.4 });
    }
  }
  const fillPoly = (b, pts, color, alpha = 0.18, o = {}) => b.path(pts, { close: true, fill: color, fillAlpha: alpha, color: null, ref: o.ref });
  const line = (b, p, q, color = 'ink', width = 3, o = {}) => b.path([p, q], { color, width, dash: o.dash, alpha: o.alpha, ref: o.ref });
  const poly = (b, pts, color = 'ink', width = 3.2, o = {}) => b.path(pts, { close: true, color, width, dash: o.dash, alpha: o.alpha, ref: o.ref, fill: o.fill, fillAlpha: o.fillAlpha });
  // 일부만 그려진 호: 중심 c, 반지름 r, 시작 a0 → 끝 a1 (도, 화면 각도) 중 비율 f 만큼. 끝에 펜 점을 찍습니다.
  function arcPart(b, c, r, a0, a1, f, color = 'ink', o = {}) {
    if (f <= 0) return;
    const e = a0 + (a1 - a0) * clamp(f, 0, 1);
    b.arc(c, r, a0 * DEG, e * DEG, { color, width: o.width || 2.6, ccw: a1 < a0, dash: o.dash, alpha: o.alpha });
    if (f < 0.999 && o.pen !== false) b.point(polar(c, r, e), { color: 'amber', r: 4.2 });
  }
  // 선분 pq 에 길이 글자 (바깥쪽)
  const lenTag = (b, p, q, c, v, color = 'sky', o = {}) => sideTag(b, p, q, c, fmtN(v), { color, size: o.size || 16, gap: o.gap, dx: o.dx, dy: o.dy });


  function fit(b, box, o = {}) {
    const narrow = b.W < 560;
    const aw = Math.max(10, b.W - b.insets.left - b.insets.right), ah = Math.max(10, b.H - b.insets.top - b.insets.bottom);
    const pp = b.pad * Math.min(aw, ah), W = aw - 2 * pp, H = ah - 2 * pp;
    const base = b.thumb ? 5 : narrow ? 30 : 46;
    const compact = b.ciMobileProblem;
    const pad = { l: o.l == null ? base : o.l, r: o.r == null ? base : o.r,
      t: compact ? 28 : Math.max(o.t == null ? base : o.t, b.thumb ? 0 : 58),
      b: compact ? (compact === 'c4-3' ? 44 : 32) : o.b == null ? base : o.b };
    let bw = Math.max(1e-6, box.x1 - box.x0), bh = Math.max(1e-6, box.y1 - box.y0);
    let k = Math.max(3, Math.min((W - pad.l - pad.r) / bw, (H - pad.t - pad.b) / bh));
    if (o.maxK) k = Math.min(k, o.maxK);
    b.focus = { x: [box.x0 - pad.l / k, box.x1 + pad.r / k], y: [box.y0 - pad.t / k, box.y1 + pad.b / k] };
    return b.k;
  }

  /* ------------------------------------------------------------------ 원 그림 도우미 (수학 방향 각: 반시계, 위쪽이 +) */
  const mp = (c, r, deg) => ({ x: c.x + r * Math.cos(deg * DEG), y: c.y - r * Math.sin(deg * DEG) });
  const degOf = (c, p) => Math.atan2(-(p.y - c.y), p.x - c.x) / DEG;
  const norm360 = (d) => ((d % 360) + 360) % 360;
  function circle(b, O, R, color = 'ink', w = 3.6, o = {}) { b.circle(O, R, { color, width: w, fill: o.fill, fillAlpha: o.fa, dash: o.dash, alpha: o.alpha, ref: o.ref }); }
  // 호 d0 → d1 (수학 각, 반시계 방향으로 d1 > d0)
  function arcD(b, O, R, d0, d1, color = 'amber', w = 5.4, o = {}) { b.arc(O, R, -d0 * DEG, -d1 * DEG, { color, width: w, ccw: true, alpha: o.alpha, ref: o.ref, dash: o.dash }); }
  const arcPts = (O, R, d0, d1, n = 56) => Array.from({ length: n + 1 }, (_, i) => mp(O, R, d0 + ((d1 - d0) * i) / n));
  function fillSector(b, O, R, d0, d1, color = 'sky', alpha = 0.2) { b.path([O].concat(arcPts(O, R, d0, d1)), { close: true, fill: color, fillAlpha: alpha, color: null }); }
  function fillSeg(b, O, R, d0, d1, color = 'sky', alpha = 0.2) { b.path(arcPts(O, R, d0, d1), { close: true, fill: color, fillAlpha: alpha, color: null }); }
  // 두 원 사이(큰 반지름 R, 작은 반지름 r)
  function fillRing(b, O, R, r, color = 'rose', alpha = 0.22) { b.path(arcPts(O, R, 0, 360, 96).concat(arcPts(O, r, 360, 0, 96)), { close: true, fill: color, fillAlpha: alpha, color: null }); }
  const circBox = (O, R, pad = 0) => ({ x0: O.x - R - pad, x1: O.x + R + pad, y0: O.y - R - pad, y1: O.y + R + pad });
  const dot = (b, p, color = 'ink', r = 4.6) => b.point(p, { color, r });
  // 원 밖 점 P 에서 원 (O,R) 에 그은 두 접선의 접점 [위쪽, 아래쪽]
  function tangentPts(O, R, Pp) {
    const d = dist(O, Pp), th = dirDeg(O, Pp), a = Math.acos(clamp(R / d, -1, 1)) / DEG;
    return [polar(O, R, th - a), polar(O, R, th + a)];
  }
  // 점 p 에 이름(바깥 방향은 c 의 반대쪽)
  function pname(b, p, c, name, o = {}) { dot(b, p, o.color || 'ink', o.r || 4.6); if (name) tagOut(b, p, c, name, { size: o.size || 17, gap: o.gap == null ? 11 : o.gap, color: o.nameColor || 'ink' }); }
  // 선분 pq 옆 글자: toward 점 쪽(또는 away 점의 반대쪽)에 놓습니다.
  function segTag(b, p, q, str, o = {}) {
    const m = lerp(p, q, o.f == null ? 0.5 : o.f), size = o.size || 16;
    let n = unit({ x: -(q.y - p.y), y: q.x - p.x });
    if (o.toward && n.x * (o.toward.x - m.x) + n.y * (o.toward.y - m.y) < 0) n = mul(n, -1);
    if (o.away && n.x * (m.x - o.away.x) + n.y * (m.y - o.away.y) < 0) n = mul(n, -1);
    const w = textW(str, size), g = o.gap == null ? 12 : o.gap;
    const d = Math.abs(n.x) * (w / 2) + Math.abs(n.y) * size * 0.55 + g;
    T(b, m, str, { color: o.color || 'sky', size, dx: n.x * d + (o.dx || 0), dy: n.y * d + (o.dy || 0), alpha: o.alpha, leaderAnchor: m, leader: o.leader });
  }
  const sz = (b, a = 16) => (b.W < 560 ? a - 1 : a);

  /* ------------------------------------------------------------------ 수 표기 (제곱근·분수) */
  const radSimp = (n) => { let a = 1, m = Math.round(n); for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { a *= f; m /= f * f; } return { a, b: m }; };
  const isSq = (n) => { const r = Math.round(Math.sqrt(n)); return r * r === Math.round(n) && Math.abs(n - Math.round(n)) < 1e-9; };
  function fracOf(v, maxD = 12) { for (let d = 1; d <= maxD; d++) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-9) return [Math.round(n), d]; } return null; }
  // 값 v 의 그림 글자: 정수 · 기약분수(\frac{n}{d}) · a√b · 소수 첫째 자리
  function cv(v) {
    if (!Number.isFinite(v)) return '?';
    const f = fracOf(v);
    if (f) return f[1] === 1 ? String(f[0]) : `\\frac{${f[0]}}{${f[1]}}`;
    const q = v * v;
    if (v > 0 && Math.abs(q - Math.round(q)) < 1e-9 && q <= 2000) { const { a, b } = radSimp(q); return (a === 1 ? '' : String(a)) + '√' + b; }
    return fmtN(v);
  }
  // 값 v 의 패널 글(TeX, $ 없이)
  function nt(v) {
    if (!Number.isFinite(v)) return '?';
    const f = fracOf(v);
    if (f) return f[1] === 1 ? String(f[0]) : `\\frac{${f[0]}}{${f[1]}}`;
    const q = v * v;
    if (v > 0 && Math.abs(q - Math.round(q)) < 1e-9 && q <= 2000) { const { a, b } = radSimp(q); return (a === 1 ? '' : String(a)) + `\\sqrt{${b}}`; }
    return tx(v);
  }
  const npl = (v) => nt(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$2분의$1').replace(/\\sqrt\{(\d+)\}/g, '√$1');
  const ntD = (v) => `$${nt(v)}$`;
  const exactQ = (v) => !!fracOf(v) || (Number.isFinite(v) && v > 0 && Math.abs(v * v - Math.round(v * v)) < 1e-9 && v * v <= 2000);
  const eqv = (v) => (exactQ(v) ? '=' : '≈');
  const mkNum = (correct, wrongs, o = {}) => mkChoices(correct, wrongs, { tex: (v) => nt(v) + (o.unit ? `\\,\\mathrm{${o.unit}}` : ''), plain: (v) => npl(v) + (o.unit ? o.unit : ''), valid: (v) => v > 0 && exactQ(v), pad: o.pad || 1 });
  const Pi = (k) => (k === 1 ? '\\pi' : `${k}\\pi`);
  // 넓이 보기: k π
  const mkPi = (correct, wrongs, o = {}) => mkChoices(correct, wrongs, { tex: (v) => (Number.isInteger(v) ? `${v === 1 ? '' : v}\\pi` : `${nt(v)}\\pi`), plain: (v) => (v === 1 ? 'π' : `${v}π`), valid: (v) => v > 0 && exactQ(v), pad: o.pad || 2 });

  /* ------------------------------------------------------------------ 조절 값 만들기 */
  const P = (label, min, max, step, value, o = {}) => ({ value, min, max, step, color: o.color || 'sky', label, hint: o.hint, format: o.format || ((v) => fmtN(v)) });
  const degF = (v) => fmtN(v) + '°';
  const cmF = (v) => fmtN(v) + ' cm';

  // 숫자 뒤 조사: 받침 있는 숫자(0 1 3 6 7 8)는 첫째, 없으면 둘째
  const josa = (n, a, b) => ([0, 1, 3, 6, 7, 8].includes(Math.abs(Math.round(n)) % 10) ? a : b);

  /* ------------------------------------------------------------------ 안정된 무작위(같은 키 → 같은 순서) */
  function seeded(key) {
    let h = 1779033703 ^ String(key).length;
    for (let i = 0; i < String(key).length; i++) { h = Math.imul(h ^ String(key).charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  /* ------------------------------------------------------------------ 5지선다 만들기 */
  // 숫자 보기: correct = 정답 값, wrongs = [[값, 힌트], …]. 모자라면 정답 ± 간격으로 채웁니다. 작은 값부터 놓습니다.
  function mkChoices(correct, wrongs, o = {}) {
    const tex = o.tex || ((v) => texDeg(v)), plain = o.plain || ((v) => dg(v)), valid = o.valid || ((v) => v > 0);
    const same = (a, b) => Math.abs(a - b) < 1e-6;
    const list = [{ v: correct, ok: true, hint: '' }];
    for (const w of wrongs) {
      const v = w[0];
      if (!Number.isFinite(v) || !valid(v) || list.some((x) => same(x.v, v))) continue;
      list.push({ v, ok: false, hint: w[1] || '' });
      if (list.length === 5) break;
    }
    const gap = o.pad || 10;
    for (let k = 1; list.length < 5 && k < 60; k++) {
      for (const sg of [1, -1]) {
        const v = correct + sg * gap * k;
        if (list.length < 5 && valid(v) && !list.some((x) => same(x.v, v))) list.push({ v, ok: false, hint: '풀이 순서대로 다시 계산해 보세요.' });
      }
    }
    for (const m of [2, 0.5, 3, 1 / 3, 1.5, 4, 0.25, 5]) {
      const v = correct * m;
      if (list.length < 5 && Number.isFinite(v) && valid(v) && !list.some((x) => same(x.v, v))) list.push({ v, ok: false, hint: '풀이 순서대로 다시 계산해 보세요.' });
    }
    list.sort((a, b) => a.v - b.v);
    return list.map((x) => ({ t: tex(x.v), p: plain(x.v), ok: x.ok, hint: x.hint, value: x.v }));
  }
  // 글 보기: items = [{h: 보기(글·$수식$ 가능), ok, hint}] 5개를 key 로 안정되게 섞어 놓습니다.
  function mkTextChoices(items, key) {
    const list = shuffle(items, seeded('tc|' + key));
    return list.map((x) => ({ h: x.h, p: x.p || String(x.h).replace(/\$/g, ''), ok: !!x.ok, hint: x.hint || '', value: x.v }));
  }

  /* ------------------------------------------------------------------ 장면 상태 (탭·단계) */
  function baseCtx(s, lab, thumb) {
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    const lesson = !thumb && !!(s.lessonOn || s.lessonEntry), entry = lesson && !!s.lessonEntry;
    return { tab, problem, review, step: entry ? 0 : lesson ? s.step || 0 : review ? s.step || 1 : problem ? 0 : 99,
      txt: !thumb, thumb: !!thumb, full: !lesson && (tab === 'explore' || thumb), lesson, entry,
      answer: lesson && !entry && !!s.ciShowAnswer, calculation: lesson && !entry && !!s.ciCalculationReady };
  }
  const showAt = (C, n) => C.step >= n;

  /* ------------------------------------------------------------------ 문제 탭 (보기 5개 · 숫자 바꾸기) */
  function problemHTML(D, s) {
    const M = D.model(s, PC), Q = D.prob(M, s);
    const key = D.id + '|' + Q.key + '|' + (s.ciSeed || 0);
    const pk = s.ciPick && s.ciPick.key === key ? s.ciPick : null;
    let h = Q.html ? `<div class="ci-q">${Q.html}</div>` : `<div class="ci-q">${esc(Q.stem).replace(/&amp;/g, '&')}</div>`;
    h += '<div class="ci-choices' + (Q.wide ? ' wide' : '') + '">';
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="ci-ch${cls}" data-ci-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.h != null ? o.h : '$' + o.t + '$'}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="ci-fb ok"><b>정답이에요!</b> 풀이 탭에서 이 문제의 풀이 과정을 확인해 보세요.</div>' : `<div class="ci-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 계산해 보세요.')}</div>`;
    }
    h += `<div class="ci-tools"><button type="button" class="apl-btn sm" data-ci-new>숫자 바꾸기</button>${Q.note ? `<span class="ci-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const Q = D.prob(D.model(s, PC), s), i = Q.choices.findIndex((o) => o.ok);
    const o = Q.choices[i];
    return `${NUM[i]} ${o.h != null ? o.h : '$' + o.t + '$'}`;
  }

  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.ciBound) return;
    root.dataset.ciBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-ci-pick],[data-ci-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.ci) return;
      const D = sc.ci, s = lab.s;
      if (hit.hasAttribute('data-ci-new')) {
        D.roll(s);
        s.ciSeed = (s.ciSeed || 0) + 1; s.ciPick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-ci-pick'), 10);
      const Q = D.prob(D.model(s, PC), s);
      s.ciPick = { key: D.id + '|' + Q.key + '|' + (s.ciSeed || 0), idx };
      if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('ci-css')) return;
    const st = document.createElement('style');
    st.id = 'ci-css';
    st.textContent = `
.ci-q{font-size:var(--fs-md);line-height:1.85}
.ci-q ol,.ci-q ul{margin:8px 0 0;padding-left:0;list-style:none;display:grid;gap:3px}
.ci-q li{line-height:1.6}
.ci-q li b{color:var(--m-amber);margin-right:4px}
.ci-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:12px 0 4px}
.ci-choices.wide{grid-template-columns:1fr}
.ci-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.ci-ch:hover{background:var(--hover)}
.ci-ch .n{color:var(--m-amber);flex:none}
.ci-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.ci-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.ci-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.ci-fb.ok{border-left-color:var(--m-green)}
.ci-fb.bad{border-left-color:var(--m-red)}
.ci-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.ci-note{font-size:var(--fs-xs);color:var(--text-3)}
.ci-current{padding:12px 14px;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--card-2);line-height:1.8}
.ci-current b{display:block;color:var(--m-sky);margin-bottom:5px}
.ci-notes{margin:0;padding-left:18px;display:grid;gap:4px}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();

  /* ------------------------------------------------------------------ 장면 만들기
     D = { id, title, short, question, ctl:[조절 값 id…], presets?(s), init(s), reroll(s),
           model(s)→M, draw(b,s,M,C), steps(M)→[글…], view(M,C,s)→{guide,readouts,status?,formula?,rule?,notes?,alert?},
           prob(M,s)→{tag,stem|html,choices,key,note?}, anim?:{key,dur,label,start}, stepT?(n,M) } */
  // $…$ 안의 < > 는 HTML 로 이스케이프되어 수식 오류가 나므로 \lt \gt 로 바꿉니다.
  const texSafe = (t) => String(t == null ? t : t).replace(/\$([^$]+)\$/g, (m, x) => '$' + x.replace(/</g, '\\lt ').replace(/>/g, '\\gt ') + '$');
  /* 문제 변형(숫자 바꾸기) 하나를 고릅니다. first=true 이면 정해진 첫 변형(그림과 보기를 처음부터 채웁니다). */
  const PC = { tab: 'problem', problem: true, review: false, step: 0, txt: true, thumb: false, full: false };
  // 탐구의 슬라이더 값은 그대로 보존하고, 문제와 풀이만 같은 문항 모델을 읽습니다.
  function currentSolution(D, s) {
    const M = D.model(s, PC), Q = D.prob(M, s);
    const solution = D.solve ? D.solve(M, s) : { steps: D.steps(M, s) };
    return { ...solution, model: M, question: Q, key: Q.key };
  }

  // 단원 안에서만 적용하는 라벨 배치. 도형 크기를 줄이지 않고 겹치는 글자를
  // 화면 픽셀 단위로 벌리고, 멀어진 라벨은 원래 위치와 가는 지시선으로 연결합니다.
  // These six actual short-screen problem diagrams need more drawing room.
  // Scope the override to one draw so exploration and other scenes cannot inherit it.
  const mobileProblemScenes = new Set(['c2-2', 'c4-3', 'c4-5', 'c4-6', 'c4-8', 'c5-3']);
  function drawLabels(b, draw, answer) {
    if (b.thumb || !b.toS || !b.toW) { draw(); return; }
    const original = b.text, queue = [];
    b.text = (p, str, o = {}) => {
      if (answer != null && typeof str === 'string' && /(?:^x$|=\s*x$)/.test(str)) {
        str = str.replace(/x$/, answer);
        if (textW(str, o.size || 16) > b.W - 40) str = 'x = ' + answer;
      }
      if (str != null && str !== '' && !(o.alpha != null && o.alpha <= 0)) queue.push({ p, str: String(str), o: { ...o } });
      return b;
    };
    try { draw(); } finally { b.text = original; }
    const placed = [], labels = [], overlap = (a, z) => Math.max(0, Math.min(a.r, z.r) - Math.max(a.l, z.l)) * Math.max(0, Math.min(a.b, z.b) - Math.max(a.t, z.t));
    queue.sort((a, z) => Number(!/^[A-Z][′']?$/.test(a.str)) - Number(!/^[A-Z][′']?$/.test(z.str)));
    for (const item of queue) {
      const { p, str, o } = item, anchor = b.toS(p), x0 = anchor.x + (o.dx || 0), y0 = anchor.y + (o.dy || 0);
      const size = Math.max(14, o.size || 16), width = Math.min(b.W - 24, textW(str, size) + 8), height = size * (hasFrac(str) ? 1.65 : 1.15) + 6;
      const toolbar = Math.max(60, b.insets && b.insets.bottom || 0);
      const shifts = [[0, 0], [0, -14], [0, 14], [-16, 0], [16, 0], [0, -28], [0, 28], [-28, -14], [28, -14], [-28, 14], [28, 14], [-40, 0], [40, 0], [0, -44], [0, 44], [-44, -28], [44, -28], [-44, 28], [44, 28]];
      let best;
      for (const [dx, dy] of shifts) {
        const x = clamp(x0 + dx, 12 + width / 2, b.W - 12 - width / 2), y = clamp(y0 + dy, (b.ciMobileProblem ? 12 : 48) + height / 2, b.H - toolbar - 14 - height / 2);
        const box = { l: x - width / 2, r: x + width / 2, t: y - height / 2, b: y + height / 2 };
        const score = placed.reduce((n, a) => n + overlap(a, box) * 1000, 0) + (x - x0) ** 2 + (y - y0) ** 2;
        if (!best || score < best.score) best = { x, y, box, score };
      }
      // A displaced label must point to the actual point, segment or angle arc,
      // never to its former text position. Unanchored explanatory text has no leader.
      if (o.leaderAnchor && (o.leader || Math.hypot(best.x - x0, best.y - y0) > 13)) {
        const target = b.toS(o.leaderAnchor), alpha = o.alpha == null ? .72 : o.alpha;
        if (b.leader) b.leader(target, best, { px: true, width, height, alpha, ref: o.ref,
          ...(b.ciMobileProblem ? { color: o.color || 'muted', lineWidth: 1.4 } : {}) });
        else {
          // Lightweight renderers can omit Board.leader; keep the same geometric
          // anchor and stop outside the final text box in that path as well.
          const dx = best.x - target.x, dy = best.y - target.y, length = Math.hypot(dx, dy);
          const trim = Math.min(width / (2 * Math.abs(dx || 1e-9)), height / (2 * Math.abs(dy || 1e-9))) + 4 / (length || 1);
          if (trim < 1) line(b, o.leaderAnchor, b.toW(best.x - dx * trim, best.y - dy * trim), o.color || 'muted', 1.2, { alpha });
        }
      }
      labels.push({ p, str, options: { ...o, size, dx: best.x - anchor.x, dy: best.y - anchor.y } });
      placed.push({ ...best.box, text: str });
    }
    // Later callouts must not paint over a vertex name placed earlier.
    for (const label of labels) original.call(b, label.p, label.str, label.options);
    b.ciLabels = placed;
  }
  function rollPk(D, s, first) {
    if (!D.gen) return;
    const prev = s.ciPk;
    const rnd = first ? seeded('first|' + D.id) : Math.random;
    s.ciN = first ? 0 : (s.ciN || 0) + 1;
    let pk = null;
    for (let t = 0; t < 40; t++) {
      pk = D.gen(rnd, s.ciN + t);
      if (first || !prev || pk.key !== prev.key) break;
    }
    s.ciPk = pk;
  }
  const inLesson = (s) => !!(s.lessonOn || s.lessonEntry);
  // Each original generator accepts its own random stream and variant number.
  // A lesson fixes that source packet without touching manual-question randomness.
  function fixedPk(id, variant = 0, seed = 1) {
    const scene = (window.APL_CI_GROUPS || []).flatMap(group => group.scenes).find(item => item.id === id);
    if (!scene || !scene.ci || typeof scene.ci.gen !== 'function') throw new Error('해설 원본 장면 없음: ' + id);
    const packet = scene.ci.gen(seeded('lesson|' + id + '|' + seed), variant), seen = new WeakSet();
    const freeze = value => {
      if (!value || typeof value !== 'object' || seen.has(value)) return value;
      seen.add(value);
      Object.values(value).forEach(freeze);
      return Object.freeze(value);
    };
    return freeze(packet);
  }
  function lessonQuestion(D, s) {
    const M = D.model(s, PC), Q = D.prob(M, s);
    const custom = D.lessonQuestion && D.lessonQuestion(M, s, Q);
    if (custom != null) return texSafe(custom);
    if (!s.ciLessonProblem) return texSafe(typeof D.question === 'function' ? D.question(s) : D.question);
    let body = Q.html != null ? Q.html : Q.stem || '';
    const choices = (Q.choices || []).map(c => c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p);
    if (choices.length && !choices.every(text => body.includes(String(text)))) body += '<br>' + choices.map((text, i) => NUM[i] + ' ' + text).join('<br>');
    return texSafe(body);
  }
  function makeScene(D) {
    const A = D.anim;
    D.roll = (s) => { if (D.reroll) D.reroll(s); rollPk(D, s, false); };
    const actions = A ? () => [
      {
        id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
        label: (s) => (s.playing ? '일시 정지' : s[A.key] >= 0.999 ? '다시 재생' : A.label || '움직여 보기'),
        on: (s) => s.playing,
        run: (s) => { if (s.playing) s.playing = false; else { if (s[A.key] >= 0.999) s[A.key] = 0; s.playing = true; } }
      },
      { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s[A.key] = 0; } }
    ] : undefined;
    const RC = { ...PC, tab: 'review', review: true };
    return {
      id: D.id, title: D.title, short: D.short || D.title, ci: D,
      question: (s) => inLesson(s) ? lessonQuestion(D, s) : (typeof D.question === 'function' ? D.question(s) : D.question),
      tabs: { order: ['explore', 'problem', 'review'], labels: { explore: '탐구', problem: '문제', review: '풀이' } },
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl),
      presets: (s) => (D.presets ? D.presets(s) : []),
      actions,
      solution: (s) => currentSolution(D, s),
      steps: (s) => currentSolution(D, s).steps.map((t) => texSafe(String(t).replace(/<\/?b>/g, ''))),
      reviewTop: (s) => { if (inLesson(s)) return ''; const Q = D.prob(D.model(s, PC), s); return `<div class="ci-current"><b>지금 풀고 있는 문제</b>${texSafe(Q.html || esc(Q.stem))}</div>`; },
      reviewTitles: { steps: '현재 문제의 풀이', solution: '답 확인' },
      notesTitle: '자주 틀리는 부분',
      problem: D.prob ? {
        // 배지는 장면 진입 때 만들어집니다. 새 문항에서 구하는 선분이
        // 바뀌어도 처음 선분명이 남지 않도록 장면의 주제로 표시합니다.
        tag: () => D.title,
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(D, s)
      } : undefined,
      enter: (s, lab) => {
        D.init(s);
        s.ciSeed = 0; s.ciPick = null; s.playing = false;
        rollPk(D, s, true);
        if (A) s[A.key] = A.start || 0;
        if (lab) curLab = lab;
      },
      tick: (s, dt, lab) => {
        if (inLesson(s)) return false;
        let again = false;
        if (A && s.playing) {
          s[A.key] = Math.min(1, (s[A.key] || 0) + dt / (A.dur || 6));
          if (s[A.key] >= 1) s.playing = false;
          again = true;
        } else if (A && D.stepT && lab && lab.tab === 'review' && !D.solve && !s.dragging) {
          const tg = D.stepT(s.step || 0, D.model(s, RC)), d = tg - s[A.key];
          if (Math.abs(d) > 8e-4) { s[A.key] += clamp(d, -0.35 * dt, 0.35 * dt); again = true; }
        }
        return again;
      },
      view: (s, lab) => {
        if (lab) curLab = lab;
        if (inLesson(s)) return { guide: null, card: null, readouts: [], formula: null, rule: null, status: null, alert: null, notes: [], chips: [] };
        const C = baseCtx(s, lab, false);
        if (C.problem) return { guide: '주어진 조건과 구하는 값을 그림에서 찾고 먼저 풀어 보세요. 풀이 탭에서도 같은 문항이 이어져요.', readouts: [], status: { tone: 'info', text: '현재 문제 · 먼저 풀어 보기' } };
        if (C.review && D.solve) {
          const sol = currentSolution(D, s), n = sol.steps.length, step = clamp(s.step || 1, 1, n);
          return { guide: texSafe(sol.steps[step - 1]), readouts: [], status: { tone: step === n ? 'ok' : 'info', text: `현재 문제 · 풀이 ${step} / ${n}단계` } };
        }
        const M = D.model(s, C);
        const v = D.view(M, C, s) || {};
        ['formula', 'rule', 'notes', 'guide'].forEach((k) => { if (typeof v[k] === 'string') v[k] = texSafe(v[k]); });
        if (C.tab === 'problem') v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' };
        else if (C.tab === 'review') { const n = D.steps(M, s).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb), previousLayout = b.ciMobileProblem;
        b.ciMobileProblem = !b.thumb && b.W < 560 && (C.problem || C.review && D.solve) && mobileProblemScenes.has(D.id) ? D.id : null;
        try {
          if (b.thumb) C.step = 99;
          if (C.lesson) {
            const useSource = s.ciLessonProblem || s.ciLessonSource;
            const sol = currentSolution(D, s), original = useSource ? sol.model : D.model(s, C);
            const M = D.lessonModel ? D.lessonModel(original, s) : original;
            C.t = A ? (s[A.key] || 0) : 1;
            C.last = C.answer;
            drawLabels(b, () => {
              const custom = D.lessonDraw ? D.lessonDraw(b, s, M, C, sol) : false;
              if (custom === false) {
                if (useSource) {
                  const n = sol.steps.length;
                  const stage = C.entry ? 0 : C.answer ? n : Math.max(0, Math.min(C.step, C.calculation ? n - 1 : 3));
                  D.draw(b, s, M, { ...C, ...PC, lesson: true, review: true, t: C.t });
                  if (sol.draw) sol.draw(b, stage);
                } else D.draw(b, s, M, C);
              }
              if (D.lessonAfterDraw) D.lessonAfterDraw(b, s, M, C, sol);
            }, C.answer && useSource ? sol.display : null);
            return;
          }
          if (C.review && D.solve) {
            const sol = currentSolution(D, s), step = clamp(s.step || 1, 1, sol.steps.length);
            drawLabels(b, () => {
              D.draw(b, s, sol.model, { ...PC, review: true, t: 1 });
              if (sol.draw) sol.draw(b, step);
            }, step === sol.steps.length ? sol.display : null);
            return;
          }
          const M = D.model(s, C);
          C.t = A ? (C.tab === 'explore' || b.thumb ? (s[A.key] || 0) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : 1)) : 1;
          drawLabels(b, () => D.draw(b, s, M, C));
        } finally { b.ciMobileProblem = previousLayout; }
      }
    };
  }

  function register(order, id, title, short, params, scenes) {
    (window.APL_CI_GROUPS = window.APL_CI_GROUPS || []).push({ order, id, title, short, params, scenes: scenes.map(makeScene) });
  }
  const notes = (...li) => `<ul class="ci-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  window.APL_CI = {
    PI, DEG, clamp, ease, seg01, NUM, LET, esc, r1, isInt, fmtN, dg, eqs, tx, texDeg, ol,
    pt, add, sub, mul, len, dist, unit, mid, lerp, polar, dirDeg, rotP, angBetween, cross, inter, polyArea, centroid, pick, rint, bboxOf, unionBox, shiftPts,
    textW, T, tagOut, vtx, sideTag, lenTag, ang, tick, par, fillPoly, line, poly, arcPart, fit,
    mp, degOf, norm360, circle, arcD, arcPts, fillSector, fillSeg, fillRing, circBox, dot, tangentPts, pname, segTag, sz, radSimp, isSq, fracOf, cv, nt, npl, ntD, eqv, exactQ, mkNum, mkPi, Pi, P, degF, cmF,
    josa, seeded, shuffle, mkChoices, mkTextChoices, baseCtx, showAt, makeScene, register, notes, rd,
    PC, currentSolution, texSafe, fixedPk
  };
})();
