/* ==========================================================================
   중2 · 삼각형의 성질 — 공용 도구 (core.js)
   - 일곱 개 탭 모듈(t1~t7.js)이 함께 쓰는 작은 도구 모음입니다. 전역은 APL_TR(도구)와 APL_TR_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구(조절·움직임·실시간 값) → 정리(교과서 해결 전략 순서, 단계마다 그림이 강조) → 문제(먼저 풀기 · 답 보기 · 풀이 보기 + 숫자 바꾸기).
   - 색의 역할(이 실험실 전체): 하늘 = 주어진 각·변 · 노랑 = 구하는 값 x·끌 수 있는 점·같은 길이 눈금 · 초록 = 보조선·합동·성질이 성립하는 곳 · 분홍 = 반례·주의 · 기본 = 도형의 변.
   - 같은 크기의 각은 같은 표시(호 1개, 2개, 3개), 직각은 네모, 같은 길이는 눈금, 평행선은 화살표.
   - 움직임은 가로 이동만(세로 이동 없음). 제자리 회전·접기·서서히 나타남은 허용. 중2 범위라 제곱근(√)·피타고라스 정리는 쓰지 않고, 길이와 각은 정수만 보입니다.
   - 도형 좌표계: figure (y 아래쪽). 각도는 화면 기준(시계 방향이 +).
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

  /* ------------------------------------------------------------------ 삼각형 만들기 (A 왼쪽 아래 · B 오른쪽 아래 · C 위, y 아래쪽) */
  // 세 변: a=BC, b=CA, c=AB (삼각형이 안 되면 null)
  function triSSS(a, b, c) {
    const x = (b * b + c * c - a * a) / (2 * c), h2 = b * b - x * x;
    if (!(c > 0) || h2 <= 1e-9) return null;
    return [pt(0, 0), pt(c, 0), pt(x, -Math.sqrt(h2))];
  }
  // 두 변 b=CA, c=AB 와 그 끼인각 A
  const triSAS = (b, c, A) => [pt(0, 0), pt(c, 0), pt(b * Math.cos(A * DEG), -b * Math.sin(A * DEG))];
  // 한 변 c=AB 와 양 끝각 A, B (A+B<180)
  function triASA(c, A, B) {
    if (A + B >= 179.5 || A <= 0 || B <= 0) return null;
    const bb = (c * Math.sin(B * DEG)) / Math.sin((A + B) * DEG);
    return [pt(0, 0), pt(c, 0), pt(bb * Math.cos(A * DEG), -bb * Math.sin(A * DEG))];
  }
  const sidesOf = (T3) => ({ a: dist(T3[1], T3[2]), b: dist(T3[2], T3[0]), c: dist(T3[0], T3[1]) });
  const anglesOf = (T3) => ({ A: angBetween(T3[0], T3[1], T3[2]), B: angBetween(T3[1], T3[0], T3[2]), C: angBetween(T3[2], T3[0], T3[1]) });
  const sameTri = (X, Y) => { // 합동(변의 길이가 같은 집합) 인가
    const s = (T3) => { const q = sidesOf(T3); return [q.a, q.b, q.c].sort((m, n) => m - n); };
    const p = s(X), q = s(Y);
    return p.every((v, i) => Math.abs(v - q[i]) < 1e-6);
  };

  /* ------------------------------------------------------------------ 그리기 도우미 */
  const textW = (t, size) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size * 1.0 : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };
  function T(b, p, str, o = {}) {
    if (str == null || str === '') return;
    let dx = o.dx || 0, dy = o.dy || 0;
    if (!b._bbox && !b.thumb && b.W && (o.align || 'center') === 'center') { // 화면 가장자리에서 잘리지 않게 밀어 넣기
      const sc = b.toS(b._P(p)), size = (o.size || 16) * (b.fs || 1) * 0.95, w = Math.min(b.W - 12, textW(String(str).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1$2'), size) * 1.08);
      const x = sc.x + dx;
      if (x - w / 2 < 6) dx += 6 - (x - w / 2); else if (x + w / 2 > b.W - 6) dx -= x + w / 2 - (b.W - 6);
      const y = sc.y + dy, hh = size * 0.62;
      if (y - hh < 3) dy += 3 - (y - hh); else if (y + hh > b.H - 3) dy -= y + hh - (b.H - 3);
    }
    b.text(p, str, { dx, dy, color: o.color || 'ink', size: o.size || 16, weight: 800, align: o.align || 'center', baseline: 'middle', alpha: o.alpha, ref: o.ref, leaderAnchor: o.leaderAnchor, leader: o.leader || Math.hypot(dx - (o.dx || 0), dy - (o.dy || 0)) > 16, noLeader: o.noLeader });
  }
  // 그림 아래 설명 줄: 화면 폭보다 길면 가장 가까운 구분(→, 쉼표, 공백)에서 두 줄로 나눕니다.
  function rowT(b, p, str, o = {}) {
    if (b._trBox && !b._bbox && !b.thumb && b.H) { // 그림 아래쪽 끝보다 위로 올라오지 않게(그림과 겹침 방지)
      const sc = b.toS(b._P(p)), bot = b.toS(b._P({ x: p.x, y: b._trBox.y1 })).y, want = bot + (o.size || 16) * 2.0, y = sc.y + (o.dy || 0);
      if (y < want) o = { ...o, dy: Math.min((o.dy || 0) + want - y, b.H - (o.size || 16) * 1.6 - sc.y) };
    }
    const size = o.size || 16, plain = String(str).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1$2'), lim = Math.max(180, b.W - 28);
    if (textW(plain, size) * 1.1 <= lim) { T(b, p, str, o); return; }
    const s = String(str), seps = [' → ', ', ', ' / ', ' '];
    for (const sp of seps) {
      let best = -1, bd = 1e9;
      for (let i = s.indexOf(sp); i >= 0; i = s.indexOf(sp, i + 1)) { const d = Math.abs(i - s.length / 2); if (d < bd) { bd = d; best = i; } }
      if (best > 0) {
        const keep = sp === ', ' ? 1 : 0, head = s.slice(0, best + keep), tail = sp === ' → ' ? '→ ' + s.slice(best + 3) : s.slice(best + sp.length);
        T(b, p, head, { ...o, dy: (o.dy || 0) - size * 0.6 }); T(b, p, tail, { ...o, dy: (o.dy || 0) + size * 0.75 });
        return;
      }
    }
    T(b, p, str, o);
  }
  function tagOut(b, p, c, str, o = {}) {
    const u = unit(sub(p, c)), size = o.size || 17, w = textW(str, size), g = o.gap == null ? 12 : o.gap;
    const d = Math.abs(u.x) * (w / 2) + Math.abs(u.y) * size * 0.55 + g;
    T(b, p, str, { ...o, size, dx: u.x * d, dy: u.y * d });
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
    T(b, m, str, { color: o.color || 'ink', size, dx: n.x * d + (o.dx || 0), dy: n.y * d + (o.dy || 0), alpha: o.alpha, leaderAnchor: m, leader: o.leader, noLeader: o.noLeader });
  }
  /* 각 표시: 꼭짓점 V 에서 반직선 VA → VB 방향의 작은 각. rings = 호 개수(같은 각은 같은 개수). 직각이면 네모. */
  function ang(b, V, A, B, o = {}) {
    const k = b.k || 60, r = (o.r || 26) * (b.thumb ? 0.7 : 1);
    const a0 = Math.atan2(A.y - V.y, A.x - V.x), a1 = Math.atan2(B.y - V.y, B.x - V.x);
    let d = ((a1 - a0 + PI * 3) % (PI * 2)) - PI;
    if (o.big) d = d > 0 ? d - PI * 2 : d + PI * 2;
    const deg = Math.abs(d) / DEG, col = o.color || 'sky', am = a0 + d / 2, sg = d < 0 ? -1 : 1, e0 = a0 + sg * (o.cut ? o.cut[0] : 0) * DEG, e1 = a0 + d - sg * (o.cut ? o.cut[1] : 0) * DEG;
    const rw = r / k;
    if (!o.noMark) {
      if (!o.big && Math.abs(deg - 90) < 0.6 && !o.noRight && o.label !== 'x') {
        b.right(V, A, B, { size: Math.min(r * 0.62, 17), color: col });
      } else {
        b.arc(V, rw, e0, e1, { sector: true, fill: col, fillAlpha: o.fa == null ? 0.2 : o.fa, color: null, ccw: d < 0, ref: o.ref });
        const rings = o.rings || 1;
        b.arc(V, rw, e0, e1, { color: col, width: o.w || 2.4, ccw: d < 0, ref: o.ref, alpha: o.alpha });
        for (let i = 1; i < rings; i++) b.arc(V, rw - (i * 4.6) / k, e0, e1, { color: col, width: o.w ? o.w * 0.9 : 2.2, ccw: d < 0, ref: o.ref, alpha: o.alpha });
      }
    }
    if (o.label) {
      const size = o.size || 15;
      const need = (textW(o.label, size) / 2 + 5) / Math.max(0.2, Math.sin(clamp(Math.abs(d) / 2, 0.12, 1.5)));
      const dst = o.labelDist != null ? o.labelDist : Math.max(r + 14, Math.min(need, r + 70));
      const la = am + (o.labelRot || 0) * DEG;
      // 충돌 배치가 끝난 뒤에도 같은 각을 가리키도록 실제 호/직각 표시의 위치를 보존합니다.
      const sgn0 = d < 0 ? -1 : 1; let tt0 = (sgn0 * (la - a0)) % (PI * 2); if (tt0 < 0) tt0 += PI * 2;
      const markerR = !o.big && Math.abs(deg - 90) < 0.6 && !o.noRight && o.label !== 'x' ? Math.min(r * 0.62, 17) * Math.SQRT2 / k : rw;
      // 꼭짓점 뒤쪽에 둔 글자는 호에서 점을 관통하지 않고 실제 꼭짓점에 연결합니다.
      const behindVertex = Math.cos(la - am) < -1e-6;
      const leaderAnchor = o.noMark || behindVertex ? V : { x: V.x + Math.cos(am) * markerR, y: V.y + Math.sin(am) * markerR };
      T(b, V, o.label, { dx: Math.cos(la) * dst, dy: Math.sin(la) * dst, color: o.labelColor || col, size, alpha: o.alpha, leaderAnchor, leader: tt0 > Math.abs(d) + 1e-6, noLeader: o.noLeader });
    }
    return { deg, mid: am };
  }
  // 지난 단계의 각 표시: 가는 회색 호(값 글자는 label 을 줄 때만). 풀이 그림에서 지금 단계만 색으로 강조하기 위해 씁니다.
  const faded = (b, V, A, B, o = {}) => ang(b, V, A, B, { color: 'ink', alpha: 0.38, w: 1.4, fa: 0, rings: o.rings, r: o.r || 24, label: o.label, labelDist: o.labelDist, labelRot: o.labelRot, size: o.size, labelColor: 'ink', noRight: o.noRight });
  function tick(b, p, q, count = 1, color = 'amber') { if (count > 0) b.ticks(p, q, { color, count, size: 9 }); }
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


  /* 삼각형 하나: 변(BC=a, CA=b, AB=c)·각(A,B,C)·이름·눈금을 한 번에 그립니다.
     o = { color, w, alpha, fill, fa, names:[A,B,C 이름], nameColor, sides:{a:{t,c,size,gap},…}, ticks:{a:개수|{n,color},…}, angs:{A:{t,c,rings,r,d},…} } */
  function drawTri(b, Tr, o = {}) {
    const A = Tr[0], B = Tr[1], C = Tr[2], cen = centroid(Tr);
    if (o.fill) fillPoly(b, Tr, o.fill, o.fa == null ? 0.1 : o.fa);
    poly(b, Tr, o.color || 'ink', o.w || 3.4, { alpha: o.alpha, dash: o.dash });
    [[B, C, 'a'], [C, A, 'b'], [A, B, 'c']].forEach(([p, q, k]) => {
      const n = o.ticks && o.ticks[k];
      if (n) tick(b, p, q, n.n || n, n.color || 'amber');
      const sd = o.sides && o.sides[k];
      if (sd) sideTag(b, p, q, cen, sd.t, { color: sd.c || 'sky', size: sd.size || 16, gap: sd.gap, dx: sd.dx, dy: sd.dy });
    });
    [[A, B, C, 'A'], [B, C, A, 'B'], [C, A, B, 'C']].forEach(([v, p, q, k]) => {
      const a = o.angs && o.angs[k];
      if (a) ang(b, v, p, q, { color: a.c || 'sky', rings: a.rings || 1, label: a.t, r: a.r || 26, labelDist: a.d, labelColor: a.lc, size: a.size, noMark: a.noMark });
    });
    if (o.names) [A, B, C].forEach((p, i) => { b.point(p, { color: o.dotColor || 'ink', r: 4.5 }); if (o.names[i]) tagOut(b, p, cen, o.names[i], { size: o.nameSize || 17, gap: 11, color: o.nameColor || 'ink' }); });
  }

  function fit(b, box, o = {}) {
    const narrow = b.W < 560;
    const aw = Math.max(10, b.W - b.insets.left - b.insets.right), ah = Math.max(10, b.H - b.insets.top - b.insets.bottom);
    const pp = b.pad * Math.min(aw, ah), W = aw - 2 * pp, H = ah - 2 * pp;
    const base = b.thumb ? 5 : narrow ? 30 : 46;
    const pad = { l: o.l == null ? base : o.l, r: o.r == null ? base : o.r, t: o.t == null ? base : o.t, b: o.b == null ? base : o.b };
    let bw = Math.max(1e-6, box.x1 - box.x0), bh = Math.max(1e-6, box.y1 - box.y0);
    let k = Math.max(3, Math.min((W - pad.l - pad.r) / bw, (H - pad.t - pad.b) / bh));
    if (o.maxK) k = Math.min(k, o.maxK);
    b.focus = { x: [box.x0 - pad.l / k, box.x1 + pad.r / k], y: [box.y0 - pad.t / k, box.y1 + pad.b / k] };
    b._trBox = box;
    return b.k;
  }

  /* ------------------------------------------------------------------ 조절 값 만들기 */
  const P = (label, min, max, step, value, o = {}) => ({ value, min, max, step, color: o.color || 'sky', label, hint: o.hint, format: o.format || ((v) => fmtN(v)) });
  const degF = (v) => fmtN(v) + '°';
  const cmF = (v) => fmtN(v) + ' cm';

  // 숫자 뒤 조사: 받침 있는 숫자(0 1 3 6 7 8)는 첫째, 없으면 둘째
  const josa = (n, a, b) => ([0, 1, 3, 6, 7, 8].includes(Math.abs(Math.round(n)) % 10) ? a : b);


  /* ------------------------------------------------------------------ 삼각형 도구 (이 실험실 전용) */
  // 밑변 BC 가 가로(B 왼쪽·C 오른쪽), 꼭짓점 A 가 위. B=(0,0), C=(L,0). 각 B, C 는 도(°). (B+C<180)
  function triBC(L, Bd, Cd) {
    const Ad = 180 - Bd - Cd, bb = (L * Math.sin(Bd * DEG)) / Math.sin(Ad * DEG); // bb = CA ... (사인법칙) 대신 직접 교점
    void bb;
    const c = (L * Math.sin(Cd * DEG)) / Math.sin(Ad * DEG); // AB
    return [pt(c * Math.cos(Bd * DEG), -c * Math.sin(Bd * DEG)), pt(0, 0), pt(L, 0)]; // [A, B, C]
  }
  // 점 P 에서 직선 QR 에 내린 수선의 발
  function foot(Pp, Q, R) {
    const d = sub(R, Q), t = ((Pp.x - Q.x) * d.x + (Pp.y - Q.y) * d.y) / (d.x * d.x + d.y * d.y);
    return pt(Q.x + d.x * t, Q.y + d.y * t);
  }
  function circumcenter(A, B, C) {
    const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
    const a2 = A.x * A.x + A.y * A.y, b2 = B.x * B.x + B.y * B.y, c2 = C.x * C.x + C.y * C.y;
    return pt((a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / d, (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / d);
  }
  function incenter(A, B, C) {
    const a = dist(B, C), b = dist(C, A), c = dist(A, B), s = a + b + c;
    return pt((a * A.x + b * B.x + c * C.x) / s, (a * A.y + b * B.y + c * C.y) / s);
  }
  // 선분 PQ 위 방향으로 양 끝을 e(세계 길이)만큼 늘린 두 점
  const extend = (p, q, e1, e2 = e1) => { const u = unit(sub(q, p)); return [sub(p, mul(u, e1)), add(q, mul(u, e2))]; };
  // 꼭짓점 점·이름 한꺼번에: names[i] 를 pts[i] 바깥(기준점 c 의 반대쪽)에
  function dots(b, pts, names, c, o = {}) {
    pts.forEach((p, i) => { b.point(p, { color: o.color || 'ink', r: o.r || 4.5 }); if (names[i]) tagOut(b, p, c, names[i], { size: o.size || 17, gap: o.gap == null ? 11 : o.gap, color: o.nameColor || 'ink' }); });
  }
  // 선분 중간에 길이·값 글자: 기준점 c 의 반대쪽(side=1) 또는 같은 쪽(side=-1)
  function segVal(b, p, q, c, str, o = {}) { sideTag(b, p, q, o.side === -1 ? add(mul(c, 2), mul(mid(p, q), -1)) : c, str, { color: o.color || 'sky', size: o.size || 16, gap: o.gap == null ? 12 : o.gap, dx: o.dx, dy: o.dy }); }

  // 치수선: 선분 pq 와 나란히 화면 off 픽셀 바깥(기준점 c 의 반대쪽)에 그린 가는 선 + 양 끝 막대 + 가운데 글자
  function dim(b, p, q, c, str, o = {}) {
    const k = b.k || 60, off = (o.off || 30) / k;
    let n = unit({ x: -(q.y - p.y), y: q.x - p.x });
    const m0 = mid(p, q);
    if (n.x * (m0.x - c.x) + n.y * (m0.y - c.y) < 0) n = mul(n, -1);
    const p2 = add(p, mul(n, off)), q2 = add(q, mul(n, off)), e = 6 / k, col = o.color || 'sky';
    line(b, p2, q2, col, 2, { alpha: 0.9 });
    [[p, p2], [q, q2]].forEach(([u, v]) => line(b, u, add(v, mul(n, e)), col, 1.6, { alpha: 0.6 }));
    const u = unit(sub(q, p)), a1 = 7 / k;
    [p2, q2].forEach((z, i) => { const d = i ? -1 : 1; b.path([add(add(z, mul(u, a1 * d)), mul(n, a1 * 0.5)), z, add(add(z, mul(u, a1 * d)), mul(n, -a1 * 0.5))], { color: col, width: 2 }); });
    T(b, mid(p2, q2), str, { color: col, size: o.size || 16, dx: n.x * (o.gap == null ? 14 : o.gap), dy: n.y * (o.gap == null ? 14 : o.gap), leaderAnchor: mid(p2, q2) });
  }
  // 접힌 가로 이동 없이 같은 자리에서 서서히 나타남
  const fade = (t) => clamp(t, 0, 1);
  const narrow = (b) => b.W < 560;
  const fs = (b, big = 17) => (b.W < 560 ? Math.max(14, big - 2) : big);

  /* ------------------------------------------------------------------ 보기가 글인 문제: 참·거짓을 도형에서 직접 재서 정합니다.
     pool = [{h: 보기 글, f: (M)=>참인가, hint?}], wantTrue=true 이면 「옳은 것」(참 1 + 거짓 4), false 이면 「옳지 않은 것」(거짓 1 + 참 4). */
  // 옳은/옳지 않은 것 고르기. 학생이 문제에 주어진 것(그림의 표시)만으로 판단할 수 있어야 하므로:
  //  · 'T' 보기 = 늘 성립하는 구조적 성질(f 가 항상 true 인 보기)
  //  · 'F' 보기 = 일반적으로 성립하지 않는 보기(f 가 숫자에 따라 달라지는 보기, 또는 항상 false). 그림의 값으로 우연히 성립하는 경우는 빼고 씁니다.
  // 우연히 성립하는 보기를 '옳은 것'의 정답으로 쓰지 않습니다.
  function mkStmtChoices(pool, M, key, wantTrue) {
    const rnd = seeded('st|' + key);
    const kind = (x) => (x.g ? x.g : x.f.length === 0 && x.f(M) ? 'T' : 'F');
    const T0 = shuffle(pool.filter((x) => kind(x) === 'T'), rnd), F0 = shuffle(pool.filter((x) => kind(x) === 'F' && !x.f(M)), rnd);
    const need = wantTrue ? [T0, F0] : [F0, T0]; // 정답 1개를 낼 쪽, 오답 4개를 낼 쪽
    const ok = need[0][0], bad = need[1].slice(0, 4);
    const meta = (x) => ({ g: kind(x), now: !!x.f(M) });
    const items = [{ h: ok.h, ok: true, hint: '', ...meta(ok) }].concat(bad.map((x) => ({ h: x.h, ok: false, ...meta(x), hint: x.hint || (wantTrue ? '이 보기는 늘 성립하는 것이 아니에요. 그림의 표시를 다시 확인해 보세요.' : '이 보기는 늘 성립하는 내용이에요. 옳지 않은 것을 찾아야 해요.') })));
    return { choices: mkTextChoices(items, key), n: 1 + bad.length };
  }
  // 문제 만들기 도우미: 숫자 정답 + 흔한 실수 오답
  const numProb = (o) => ({ tag: o.tag, key: o.key, stem: o.stem, html: o.html, note: o.note, wide: o.wide, choices: mkChoices(o.correct, o.wrongs || [], { tex: o.tex, plain: o.plain, pad: o.pad, valid: o.valid }) });
  const intOK = (v) => Number.isInteger(v) && v > 0;
  // 길이 보기 (정수 cm)
  const cmTex = (v) => `${fmtN(v)}\\text{ cm}`;
  const cmOpts = { tex: (v) => `${v}\\text{ cm}`, plain: (v) => v + ' cm', pad: 1, valid: intOK };
  const degOpts = (pad = 5) => ({ tex: (v) => `${v}^{\\circ}`, plain: (v) => v + '°', pad, valid: (v) => Number.isInteger(v) && v > 0 && v < 180 });
  // 같은 조건으로 만든 문제 상태를 위한 가장 작은 서식: 점 이름 이어 붙이기
  const nm = (...L) => L.join('');

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
    list.sort((a, b) => a.v - b.v);
    return list.map((x) => ({ t: tex(x.v), p: plain(x.v), ok: x.ok, hint: x.hint }));
  }
  // 글 보기: items = [{h: 보기(글·$수식$ 가능), ok, hint}] 5개를 key 로 안정되게 섞어 놓습니다.
  function mkTextChoices(items, key) {
    const list = shuffle(items, seeded('tc|' + key));
    return list.map((x) => ({ h: x.h, p: x.p || String(x.h).replace(/\$/g, ''), ok: !!x.ok, hint: x.hint || '', g: x.g, now: x.now }));
  }

  /* ------------------------------------------------------------------ 장면 상태 (탭·단계) */
  function baseCtx(s, lab, thumb) {
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    return { tab, problem, review, step: review ? s.step || 0 : 99, txt: !thumb, thumb: !!thumb, full: tab === 'explore' || thumb };
  }
  const showAt = (C, n) => C.step >= n;

  // 각·길이·점 이름을 화면 크기에 맞춰 서로 떨어뜨립니다. 도형의 좌표나
  // 수학적 대응색은 그대로 두고, 움직인 짧은 라벨에는 지시선을 남깁니다.
  function layoutLabels(b, draw) {
    if (b.thumb || b._bbox || !b.toS || !b.toW) { draw(); return; }
    const original = b.text, queue = [];
    b.text = (p, str, o = {}) => {
      if (str != null && str !== '' && o.alpha !== 0) queue.push({ p, str: String(str), o: { ...o } });
      return b;
    };
    try { draw(); } finally { b.text = original; }
    const boxes = [], placed = [], overlap = (a, z) => Math.max(0, Math.min(a.r, z.r) - Math.max(a.l, z.l)) * Math.max(0, Math.min(a.b, z.b) - Math.max(a.t, z.t));
    const isName = (s) => /^(?:[A-Z](?:[′']|=[A-Z])?|ℓ)$/.test(s);
    const measure = (str, o) => {
      const size = Math.max(14, o.size || 16), scaled = size * (b.fs || 1) * (b._ts ? b._ts() : 1), c = b.ctx;
      const widthOf = (text, fontSize) => {
        if (!c || !c.measureText) return textW(text, fontSize);
        c.font = `${o.weight || 800} ${fontSize}px ${b.font}`;
        return c.measureText(text).width;
      };
      if (c) c.save();
      const parts = b._fracSplit ? b._fracSplit(str) : null;
      let width;
      if (parts) {
        const small = Math.max(scaled * .72, Math.min(scaled * .9, 9.5));
        width = parts.reduce((n, p) => n + (p.t != null ? widthOf(p.t, scaled) : Math.max(widthOf(p.n, small), widthOf(p.d, small)) + small * .34), 0);
      } else width = widthOf(str.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, (_, n, d) => textW(n, 1) >= textW(d, 1) ? n : d), scaled);
      if (c) c.restore();
      return { size, width: Math.min(b.W - 24, width + 8), height: scaled * (parts || /\\frac/.test(str) ? 1.7 : 1.12) + 6 };
    };
    queue.sort((a, z) => Number(!isName(a.str)) - Number(!isName(z.str)));
    for (const { p, str, o } of queue) {
      const anchor = b.toS(b._P ? b._P(p) : p), m = measure(str, o);
      const align = o.align || 'center', shift = align === 'left' || align === 'start' ? (m.width - 8) / 2 : align === 'right' || align === 'end' ? -(m.width - 8) / 2 : 0;
      const x0 = anchor.x + (o.dx || 0) + shift, y0 = anchor.y + (o.dy || 0), long = m.width > b.W * .65;
      const candidates = [[0, 0]];
      for (const d of [12, 24, 38, 54]) {
        candidates.push([0, -d], [0, d]);
        if (!long) candidates.push([-d, 0], [d, 0], [-d, -d * .6], [d, -d * .6], [-d, d * .6], [d, d * .6]);
      }
      let best;
      for (const [dx, dy] of candidates) {
        const x = clamp(x0 + dx, 10 + m.width / 2, b.W - 10 - m.width / 2);
        const y = clamp(y0 + dy, (b.insets.top || 0) + 8 + m.height / 2, b.H - (b.insets.bottom || 0) - 8 - m.height / 2);
        const box = { l: x - m.width / 2, r: x + m.width / 2, t: y - m.height / 2, b: y + m.height / 2 };
        const score = boxes.reduce((n, q) => n + overlap(q, box) * 1000, 0) + (x - x0) ** 2 + (y - y0) ** 2;
        if (!best || score < best.score) best = { x, y, box, score };
      }
      const source = o.leaderAnchor || (isName(str) ? p : null);
      const needsLeader = source && !o.noLeader && !long && (o.leader || Math.hypot(best.x - x0, best.y - y0) > 16);
      placed.push({ p, str, o, m, anchor, shift, best, source: needsLeader ? source : null });
      boxes.push({ ...best.box, text: str });
    }
    // 모든 지시선을 글자 아래에 그립니다. 예전 글자 위치를 임의의 대상처럼 연결하지 않습니다.
    for (const e of placed) if (e.source && b.leader) {
      b.leader(b.toS(b._P ? b._P(e.source) : e.source), { x: e.best.x, y: e.best.y }, { px: true, width: e.m.width, height: e.m.height, color: 'muted', alpha: Math.min(.78, e.o.alpha == null ? 1 : e.o.alpha) });
    }
    for (const e of placed) original.call(b, e.p, e.str, { ...e.o, size: e.m.size, dx: e.best.x - e.anchor.x - e.shift, dy: e.best.y - e.anchor.y });
    b.trLabels = boxes;
  }

  /* ------------------------------------------------------------------ 문제 탭 (보기 5개 · 숫자 바꾸기) */
  function problemHTML(D, s) {
    const M = D.model(s), Q = D.prob(M, s);
    const key = D.id + '|' + Q.key + '|' + (s.trSeed || 0);
    const pk = s.trPick && s.trPick.key === key ? s.trPick : null;
    let h = Q.html ? `<div class="tr-q">${Q.html}</div>` : `<div class="tr-q">${esc(Q.stem).replace(/&amp;/g, '&')}</div>`;
    h += '<div class="tr-choices' + (Q.wide ? ' wide' : '') + '">';
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="tr-ch${cls}" data-tr-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.h != null ? o.h : '$' + o.t + '$'}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="tr-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="tr-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 계산해 보세요.')}</div>`;
    }
    h += `<div class="tr-tools"><button type="button" class="apl-btn sm" data-tr-new>숫자 바꾸기</button>${Q.note ? `<span class="tr-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const Q = D.prob(D.model(s), s), i = Q.choices.findIndex((o) => o.ok);
    if (Q.ansHTML != null || Q.ansHtml != null) return Q.ansHTML != null ? Q.ansHTML : Q.ansHtml;
    const o = Q.choices[i];
    return `${NUM[i]} ${o.h != null ? o.h : '$' + o.t + '$'}`;
  }

  /* ------------------------------------------------------------------ 풀이 흐름 (장면이 D.solve 를 줄 때만 쓰입니다)
     탐구 · 문제 · 풀이. 문제는 5지선다 없이 발문과 그림만 · 「먼저 풀어 보세요」 · 「답 보기」(정답만) · 「풀이 보기」.
     풀이는 같은 문제 상태(숫자 바꾸기로 둘이 함께 바뀜)로 그림 위에서 단계마다 새로 생기는 것만 강조합니다.
     D.solve = { steps(M,s)→[{k:'given'|'idea'|'fig'|'eq'|'ans'|'trap', lb?, t, cap?, …}], draw(b,s,M,C,ST,idx), quick?(M,s)→{steps,note}, quickTitle? }
     idx = -1 이면 문제 탭 그림(풀이 정보 없음), 0… 이면 그 단계까지의 풀이 그림. */
  const SOLVE_LB = { given: '주어진 것', idea: '발상', eq: '식', ans: '답', trap: '흔한 실수' };
  const stepText = (st) => `${st.lb || SOLVE_LB[st.k] || ''} · ${st.t}`;
  function solveKey(D, s) { const Q = D.prob(D.model(s), s); return D.id + '|' + Q.key + '|' + (s.trSeed || 0); }
  const stemHTML = (Q) => (Q.html ? Q.html : esc(Q.stem).replace(/&amp;/g, '&'));
  function solveProblemHTML(D, s) {
    const Q = D.prob(D.model(s), s), shown = s.trShow === solveKey(D, s);
    const ok = Q.choices.find((o) => o.ok);
    // 문제 종류 태그는 숫자를 바꿀 때마다 달라지므로(예: [함정]) 글 안에 함께 그립니다
    let h = Q.tag ? `<div class="tr-tagline"><span class="apl-tag" style="--c:var(--m-amber)">${esc(Q.tag)}</span></div>` : '';
    h += `<div class="tr-q">${stemHTML(Q)}</div>`;
    h += '<div class="tr-try"><b>먼저 풀어 보세요.</b> 종이에 직접 풀어 본 뒤에 답을 확인해요.</div>';
    if (shown) h += `<div class="tr-fb ok tr-ans"><span class="k">답</span> <span class="v">${Q.ansHTML != null ? Q.ansHTML : (Q.ansHtml != null ? Q.ansHtml : '$x=' + ok.t + '$')}</span></div>`; // Q.ansHTML/Q.ansHtml(둘 다 허용): 답이 x= 꼴이 아닌 문제(합동 여부, 참·거짓 판별, 식 답)는 답을 글로 보여 줍니다
    h += '<div class="tr-tools">';
    if (!shown) h += '<button type="button" class="apl-btn sm" data-tr-show>답 보기</button>';
    h += `<button type="button" class="apl-btn sm primary" data-tr-go="review">풀이 보기</button><button type="button" class="apl-btn sm ghost" data-tr-new>숫자 바꾸기</button></div>`;
    if (Q.note) h += `<div class="tr-note" style="margin-top:6px">${esc(Q.note)}</div>`;
    return h;
  }
  function solveRecapHTML(D, s) {
    const Q = D.prob(D.model(s), s);
    return `<div class="tr-recap"><div class="tr-recap-h">문제</div><div class="tr-recap-q">${stemHTML(Q)}</div><div class="tr-tools"><button type="button" class="apl-btn sm" data-tr-go="problem">문제로</button><button type="button" class="apl-btn sm ghost" data-tr-new>숫자 바꾸기</button></div></div>`;
  }
  // 풀이 그림의 아래 설명 줄(단계마다 한 줄). 종류별 색.
  const SOLVE_COL = { given: 'sky', idea: 'violet', fig: 'green', eq: 'amber', ans: 'amber', trap: 'rose' };
  const solveCol = (st) => st.col || SOLVE_COL[st.k] || 'sky';

  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.trBound) return;
    root.dataset.trBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-tr-pick],[data-tr-new],[data-tr-show],[data-tr-go]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.tr) return;
      const D = sc.tr, s = lab.s;
      if (hit.hasAttribute('data-tr-show')) { // 풀이 흐름: 「답 보기」(정답만 보여 줍니다)
        s.trShow = solveKey(D, s);
        lab.invalidate(true);
        return;
      }
      if (hit.hasAttribute('data-tr-go')) { // 풀이 흐름: 「풀이 보기」/「문제로」
        const to = hit.getAttribute('data-tr-go');
        if (to === 'review') lab.setStep(1);
        lab.setTab(to);
        return;
      }
      if (hit.hasAttribute('data-tr-new')) {
        D.reroll(s);
        s.trSeed = (s.trSeed || 0) + 1; s.trPick = null; s.trShow = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-tr-pick'), 10);
      const Q = D.prob(D.model(s), s);
      s.trPick = { key: D.id + '|' + Q.key + '|' + (s.trSeed || 0), idx };
      if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('tr-css')) return;
    const st = document.createElement('style');
    st.id = 'tr-css';
    st.textContent = `
.tr-q{font-size:var(--fs-md);line-height:1.85}
.tr-q ol,.tr-q ul{margin:8px 0 0;padding-left:0;list-style:none;display:grid;gap:3px}
.tr-q li{line-height:1.6}
.tr-q li b{color:var(--m-amber);margin-right:4px}
.tr-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:12px 0 4px}
.tr-choices.wide{grid-template-columns:1fr}
.tr-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.tr-ch:hover{background:var(--hover)}
.tr-ch .n{color:var(--m-amber);flex:none}
.tr-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.tr-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.tr-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.tr-fb.ok{border-left-color:var(--m-green)}
.tr-fb.bad{border-left-color:var(--m-red)}
.tr-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.tr-tagline{margin-bottom:8px}
.apl-scene-head[data-tab=problem] .apl-question,.apl-scene-head[data-tab=review] .apl-question{display:none}
.tr-try{margin-top:10px;padding:8px 12px;border-radius:var(--r-md);background:var(--card-2);border-left:3px solid var(--m-amber);font-size:var(--fs-sm);line-height:1.7}
.tr-ans{display:flex;gap:10px;align-items:center;font-size:var(--fs-md)}
.tr-ans .k{font-weight:800;color:var(--m-green)}
.tr-recap{padding:10px 12px;border-radius:var(--r-md);background:var(--card-2);border:1px solid var(--line)}
.tr-recap-h{font-size:var(--fs-2xs);font-weight:800;color:var(--text-3);letter-spacing:.04em;margin-bottom:4px}
.tr-recap-q{font-size:var(--fs-sm);line-height:1.75}
.tr-note{font-size:var(--fs-xs);color:var(--text-3)}
.tr-notes{margin:0;padding-left:18px;display:grid;gap:4px}`;
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
  function makeScene(D, sceneParams) {
    const A = D.anim, SV = D.solve;
    const actions = A ? () => [
      {
        id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
        label: (s) => (s.playing ? '일시 정지' : s[A.key] >= 0.999 ? '다시 재생' : A.label || '움직여 보기'),
        on: (s) => s.playing,
        run: (s) => { if (s.playing) s.playing = false; else { if (s[A.key] >= 0.999) s[A.key] = 0; s.playing = true; } }
      },
      { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s[A.key] = 0; } }
    ] : undefined;
    return {
      id: D.id, title: D.title, short: D.short || D.title, tr: D,
      question: D.question,
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl),
      presets: (s) => (D.presets ? D.presets(s) : []),
      actions,
      steps: (s) => (SV ? SV.steps(D.model(s), s).map((st) => texSafe(stepText(st))) : D.steps(D.model(s)).map((t) => texSafe(String(t).replace(/<\/?b>/g, '')))),
      notesTitle: '자주 틀리는 부분',
      problem: D.prob ? {
        tag: SV ? undefined : (s) => D.prob(D.model(s), s).tag,
        text: (s) => (SV ? solveProblemHTML(D, s) : problemHTML(D, s)),
        answer: (s) => answerText(D, s),
        noAnswer: !!SV
      } : undefined,
      // 풀이 흐름(opt-in): 탭 순서·이름을 탐구 · 문제 · 풀이 로, 풀이 탭 맨 위에 문제 다시 보기, 빠른 풀이는 접어서
      tabs: SV ? { order: ['explore', 'problem', 'review'], labels: { review: '풀이' } } : undefined,
      reviewTop: SV ? (s) => solveRecapHTML(D, s) : undefined,
      reviewTitles: SV ? { steps: '풀이 · 단계마다 그림이 바뀌어요', solution: '빠른 풀이' } : undefined,
      solution: SV && SV.quick ? { quickTitle: SV.quickTitle || '10초 컷', quickTag: '10초 컷', quick: (s) => SV.quick(D.model(s), s) } : undefined,
      enter: (s, lab) => {
        // Several modules reuse a state key for different sides or angles.
        // Keep the existing share/hash keys while restoring the active module's
        // labels, units and ranges before controls and hash values are built.
        // Thumbnail entry uses a separate state and must not alter live controls.
        if (lab && s === lab.s && lab.params && sceneParams) Object.assign(lab.params, sceneParams);
        D.init(s);
        s.trSeed = 0; s.trPick = null; s.trShow = null; s.playing = false;
        if (A) s[A.key] = A.start || 0;
        if (lab) curLab = lab;
      },
      tick: (s, dt, lab) => {
        let again = false;
        if (A && s.playing) {
          s[A.key] = Math.min(1, (s[A.key] || 0) + dt / (A.dur || 6));
          if (s[A.key] >= 1) s.playing = false;
          again = true;
        } else if (A && D.stepT && lab && lab.tab === 'review' && !s.dragging) {
          const tg = D.stepT(s.step || 0, D.model(s)), d = tg - s[A.key];
          if (Math.abs(d) > 8e-4) { s[A.key] += clamp(d, -0.35 * dt, 0.35 * dt); again = true; }
        }
        return again;
      },
      view: (s, lab) => {
        if (lab) curLab = lab;
        const C = baseCtx(s, lab, false);
        const M = D.model(s);
        const v = D.view(M, C, s) || {};
        if (SV) { // 풀이 흐름에서는 풀이 단계가 정리를 대신합니다. 성질 한 줄은 탐구 안내에 짧게 남깁니다.
          if (v.rule && C.tab === 'explore') v.guide = `${v.guide || ''}<br><b>성질</b> · ${v.rule}`;
          delete v.formula; delete v.rule; delete v.notes;
        }
        ['formula', 'rule', 'notes', 'guide'].forEach((k) => { if (typeof v[k] === 'string') v[k] = texSafe(v[k]); });
        if (C.tab === 'problem') v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' };
        else if (C.tab === 'review') { const n = SV ? SV.steps(M, s).length : D.steps(M).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        if (b.thumb) C.step = 99;
        const M = D.model(s);
        C.t = A ? (C.tab === 'explore' || b.thumb ? (s[A.key] || 0) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : 1)) : 1;
        layoutLabels(b, () => {
          if (SV && !b.thumb && (C.problem || C.review)) { // 문제·풀이 그림은 같은 그리기(같은 숫자·같은 배치)로
            const ST = SV.steps(M, s);
            SV.draw(b, s, M, C, ST, C.problem ? -1 : clamp((s.step || 1) - 1, 0, ST.length - 1));
          } else D.draw(b, s, M, C);
        });
      }
    };
  }

  function register(order, id, title, short, params, scenes) {
    (window.APL_TR_GROUPS = window.APL_TR_GROUPS || []).push({ order, id, title, short, params, scenes: scenes.map((D) => makeScene(D, params)) });
  }
  const notes = (...li) => `<ul class="tr-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  // 풀이 그림 아래 설명 한 줄 (그림 아래쪽 끝에 붙여 그립니다)
  function solveCap(b, p, st, o = {}) {
    if (!st || !st.cap) return;
    rowT(b, p, st.cap, { dy: o.dy != null ? o.dy : (b.W < 560 ? 44 : 54), size: fs(b, o.size || 16), color: solveCol(st) });
  }

  window.APL_TR = {
    PI, DEG, clamp, ease, seg01, NUM, LET, esc, r1, isInt, fmtN, dg, eqs, tx, texDeg, ol,
    pt, add, sub, mul, len, dist, unit, mid, lerp, polar, dirDeg, rotP, angBetween, cross, inter, polyArea, centroid, pick, rint, bboxOf, unionBox, shiftPts,
    triSSS, triSAS, triASA, sidesOf, anglesOf, sameTri,
    textW, T, rowT, tagOut, vtx, sideTag, lenTag, ang, faded, tick, par, fillPoly, line, poly, arcPart, drawTri, fit, P, degF, cmF,
    josa, seeded, shuffle, mkChoices, mkTextChoices, baseCtx, showAt, makeScene, register, notes, rd,
    triBC, dim, foot, circumcenter, incenter, extend, dots, segVal, fade, narrow, fs, mkStmtChoices, numProb, intOK, cmTex, cmOpts, degOpts, nm, solveCap, solveCol
  };
})();

/* ---- solve helpers (A) ---------------------------------------------------------------
   풀이 그림을 「항목 목록」으로 선언하면 단계마다 알아서 그려 줍니다(t1~t4 풀이에서 씁니다).
   · plan(M,s) = { fit:[점…], steps:[{id,k,t,cap,…}], items:[…], base(b), names(b) } 를 돌려줍니다.
   · 항목은 SVK.fill/seg/poly/tick/ang/txt/len/dim/dot/fn 으로 만들고, 어느 단계에서 색으로 보일지 정합니다.
       at: 처음 나오는 단계(id 또는 번호) · to: 색으로 보이는 마지막 단계 · on: 색으로 보일 단계들(배열) · gone: 끝나면 사라짐
       labels: { 단계id: 그 단계의 글자 } · cols: { 단계id: 그 단계의 색 } · gl: 지난 단계에도 회색으로 남길 글자(true 이면 같은 글자) · glTo: 그 회색 글자를 남길 마지막 단계
   · 지금 단계의 항목만 색, 앞 단계 항목은 회색(풀이 그림 정리 원칙 2), 문제 탭 그림은 「주어진 것」 단계 그림입니다. */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { T, ang, tick, line, fillPoly, poly, fit, bboxOf, pt, sideTag, dim, solveCap } = G;
  const K = {
    fill: (pts, o) => ({ ty: 'fill', pts, ...o }),
    seg: (p, q, o) => ({ ty: 'seg', p, q, ...o }),
    poly: (pts, o) => ({ ty: 'poly', pts, ...o }),
    tick: (p, q, n, o) => ({ ty: 'tick', p, q, n, ...o }),
    ang: (V, A, B, o) => ({ ty: 'ang', V, A, B, ...o }),
    txt: (p, str, o) => ({ ty: 'txt', p, str, ...o }),
    len: (p, q, c, str, o) => ({ ty: 'len', p, q, c, str, ...o }),
    dim: (p, q, c, str, o) => ({ ty: 'dim', p, q, c, str, ...o }),
    dot: (p, name, o) => ({ ty: 'dot', p, name, ...o }),
    fn: (f, o) => ({ ty: 'fn', f, ...o })
  };
  function render(b, pl, idx) {
    const ids = pl.steps.map((s) => s.id || s.k);
    const ix = (v, d) => (v == null ? d : typeof v === 'number' ? v : Math.max(0, ids.indexOf(v)));
    const cur = idx < 0 ? 0 : idx, nar = b.W < 560;
    const sidePad = (v) => nar ? Math.max(28, (v == null ? 50 : v) - 8) : v == null ? 50 : v;
    fit(b, bboxOf(pl.fit), { t: pl.t != null ? pl.t : nar ? 48 : 60, b: idx < 0 ? (pl.bp != null ? pl.bp : 44) : (nar ? 104 : 100), l: sidePad(pl.l), r: sidePad(pl.r) });
    const stateOf = (it) => {
      if (idx < 0 && it.noProb) return null;
      const set = it.on ? it.on.map((v) => ix(v, 0)) : null, a = set ? Math.min(...set) : ix(it.at, 0);
      if (cur < a) return null;
      const on = set ? set.includes(cur) : cur <= (it.hold ? 99 : ix(it.to, a));
      return on ? 'on' : it.gone ? null : 'ghost';
    };
    const stId = ids[cur];
    const items = pl.items.map((it) => ({ it, st: stateOf(it) })).filter((x) => x.st);
    items.filter((x) => x.it.ty === 'fill' && x.st === 'on').forEach(({ it }) => fillPoly(b, it.pts, it.col || 'sky', it.a == null ? 0.22 : it.a));
    if (pl.base) pl.base(b);
    items.forEach(({ it, st }) => {
      const on = st === 'on', c = (it.cols && it.cols[stId]) || it.col || 'sky', sz = it.size || 16, lab = (it.labels && it.labels[stId] != null ? it.labels[stId] : it.label);
      const gl = it.glTo != null && cur > ix(it.glTo, 0) ? undefined : (it.gl === true ? it.label : it.gl); // glTo: 이 단계까지만 회색 글자를 남김
      switch (it.ty) {
        case 'seg': if (on) line(b, it.p, it.q, c, it.w || 4.4, { dash: it.dash }); else line(b, it.p, it.q, 'ink', 2.2, { alpha: 0.4, dash: it.dash }); break;
        case 'poly': if (on) poly(b, it.pts, c, it.w || 4, { dash: it.dash }); else poly(b, it.pts, 'ink', 2.2, { alpha: 0.4, dash: it.dash }); break;
        case 'tick': tick(b, it.p, it.q, it.n, on ? c : 'ink'); break;
        case 'ang':
          if (on) ang(b, it.V, it.A, it.B, { color: c, rings: it.rings, r: it.r || 28, label: lab, labelDist: it.ld, labelRot: it.lr, size: it.size || 15, fa: it.fa == null ? 0.38 : it.fa, big: it.big, cut: it.cut, noRight: it.noRight, noMark: it.noMark });
          else ang(b, it.V, it.A, it.B, { color: 'ink', alpha: 0.38, w: 1.4, fa: 0, rings: it.rings, r: it.r || 28, label: gl, labelDist: it.ld, labelRot: it.lr, size: it.size || 15, labelColor: 'ink', big: it.big, cut: it.cut });
          break;
        case 'txt': T(b, it.p, lab == null ? it.str : lab, { color: on ? c : 'ink', size: sz, dx: it.dx, dy: it.dy, alpha: on ? undefined : 0.55 }); break;
        case 'len': sideTag(b, it.p, it.q, it.c, lab == null ? it.str : lab, { color: on ? c : 'ink', size: sz, gap: it.gap == null ? 8 : it.gap, dx: it.dx, dy: it.dy, alpha: on ? undefined : 0.55 }); break;
        case 'dim': dim(b, it.p, it.q, it.c, lab == null ? it.str : lab, { color: on ? c : 'ink', size: sz, off: it.off || 30 }); break;
        case 'dot': b.point(it.p, { color: on ? c : 'ink', r: 4.5 }); T(b, it.p, it.name, { color: on ? c : 'ink', size: it.size || 18, dx: it.dx, dy: it.dy, alpha: on ? undefined : 0.6 }); break;
        case 'fn': it.f(b, st, stId); break;
        default: break;
      }
    });
    if (pl.names) pl.names(b);
    if (idx >= 0 && pl.steps[idx]) {
      const bx = bboxOf(pl.fit);
      solveCap(b, pt((bx.x0 + bx.x1) / 2, bx.y1), pl.steps[idx], { dy: nar ? 44 : 54 });
    }
  }
  function mkSolve(plan, extra) {
    return Object.assign({ steps: (M, s) => plan(M, s).steps, draw: (b, s, M, C, ST, idx) => render(b, plan(M, s), idx) }, extra || {});
  }
  G.SVK = K; G.mkSolve = mkSolve;
  // 좁은 각의 라벨 위치: 각 VA–VB 의 이등분선에서 변 VA 쪽(side='A') 또는 VB 쪽(side='B')으로 (반각+extra)° 돌린 labelRot.
  // 라벨이 부채꼴 밖에 놓이면 G.ang 이 호의 이등분선에서 시작하는 지시선을 그려 그 각을 분명히 가리켜요.
  G.sideRot = (V, A, B, side, extra = 14) => {
    const a0 = Math.atan2(A.y - V.y, A.x - V.x), a1 = Math.atan2(B.y - V.y, B.x - V.x), d = ((a1 - a0 + Math.PI * 3) % (Math.PI * 2)) - Math.PI, sgn = d < 0 ? -1 : 1;
    return (side === 'A' ? -1 : 1) * sgn * (Math.abs(d) / (Math.PI / 180) / 2 + extra);
  };
})();
