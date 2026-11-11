/* ==========================================================================
   중2 · 피타고라스 정리 — 공용 도구 (core.js)
   - 여덟 개 탭 모듈(t1~t8.js)이 함께 쓰는 작은 도구 모음입니다. 전역은 APL_PY(도구)와 APL_PY_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구(조절·움직임·실시간 값) → 문제(5지선다 + 숫자 바꾸기) → 풀이(현재 문항의 조건·보조선·계산).
   - 색의 역할(이 실험실 전체): 하늘 = 직각을 낀 변 a·넓이 a² · 초록 = 직각을 낀 변 b·넓이 b² · 노랑 = 빗변 c·구하는 값 x·끌 수 있는 점 · 분홍 = 보조선·비교 · 기본 = 도형의 변.
   - 중2는 제곱근(√)을 배우기 전입니다 → √ 표기 없음. 정수 변(피타고라스 수)이거나 x²=값 꼴로만 씁니다.
   - 같은 길이는 눈금, 직각은 네모, 평행은 화살표. 움직임은 가로로만(제자리 회전·접기·서서히 나타남은 허용).
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
    b.text(p, str, { dx: o.dx || 0, dy: o.dy || 0, color: o.color || 'ink', size: o.size || 16, weight: 800, align: o.align || 'center', baseline: 'middle', alpha: o.alpha, ref: o.ref });
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
    T(b, m, str, { color: o.color || 'ink', size, dx: n.x * d + (o.dx || 0), dy: n.y * d + (o.dy || 0), alpha: o.alpha });
  }
  /* 각 표시: 꼭짓점 V 에서 반직선 VA → VB 방향의 작은 각. rings = 호 개수(같은 각은 같은 개수). 직각이면 네모. */
  function ang(b, V, A, B, o = {}) {
    const k = b.k || 60, r = (o.r || 26) * (b.thumb ? 0.7 : 1);
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
        for (let i = 1; i < rings; i++) b.arc(V, rw - (i * 4.6) / k, a0, a0 + d, { color: col, width: 2.2, ccw: d < 0, ref: o.ref });
      }
    }
    if (o.label) {
      const size = o.size || 15;
      const need = (textW(o.label, size) / 2 + 5) / Math.max(0.2, Math.sin(clamp(Math.abs(d) / 2, 0.12, 1.5)));
      const dst = o.labelDist != null ? o.labelDist : Math.max(r + 14, Math.min(need, r + 70));
      const la = am + (o.labelRot || 0) * DEG;
      T(b, V, o.label, { dx: Math.cos(la) * dst, dy: Math.sin(la) * dst, color: o.labelColor || col, size, alpha: o.alpha });
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
    if (!narrow && !b.thumb) {
      pad.t = Math.max(pad.t, 56); // 상태 칩 아래에 그림을 둡니다.
      // 가로 태블릿에서는 도구 막대가 캔버스 하단을 덮습니다.
      // 아래쪽 꼭짓점 이름까지 막대 위에 남도록 여백을 확보합니다.
      pad.b = Math.max(pad.b, 76);
    }
    let bw = Math.max(1e-6, box.x1 - box.x0), bh = Math.max(1e-6, box.y1 - box.y0);
    let k = Math.max(3, Math.min((W - pad.l - pad.r) / bw, (H - pad.t - pad.b) / bh));
    if (o.maxK) k = Math.min(k, o.maxK);
    b.focus = { x: [box.x0 - pad.l / k, box.x1 + pad.r / k], y: [box.y0 - pad.t / k, box.y1 + pad.b / k] };
    return b.k;
  }

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
    list.sort((a, b) => a.v - b.v);
    return list.map((x) => ({ t: tex(x.v), p: plain(x.v), ok: x.ok, hint: x.hint }));
  }
  // 글 보기: items = [{h: 보기(글·$수식$ 가능), ok, hint}] 5개를 key 로 안정되게 섞어 놓습니다.
  function mkTextChoices(items, key) {
    const list = shuffle(items, seeded('tc|' + key));
    return list.map((x) => ({ h: x.h, p: x.p || String(x.h).replace(/\$/g, ''), ok: !!x.ok, hint: x.hint || '' }));
  }

  /* ------------------------------------------------------------------ 장면 상태 (탭·단계) */
  function baseCtx(s, lab, thumb) {
    const lesson = !thumb && !!(s.lessonOn || s.lessonEntry);
    const tab = thumb ? 'explore' : lesson && s.lessonEntry ? 'review' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    return { tab, problem, review, step: lesson && s.lessonEntry ? 0 : review ? s.step || 0 : 99, txt: !thumb, thumb: !!thumb, full: !lesson && (tab === 'explore' || thumb), lesson };
  }
  const showAt = (C, n) => C.step >= n;

  /* ------------------------------------------------------------------ 피타고라스 도구 (정수·x² 꼴만, 제곱근 없음) */
  const sup2 = (v) => fmtN(v) + '²';
  const isSqN = (n) => { const r = Math.round(Math.sqrt(n)); return Math.abs(n - Math.round(n)) < 1e-9 && r * r === Math.round(n); };
  const isq = (n) => Math.round(Math.sqrt(n)); // 완전제곱수일 때만 정수 변을 구하는 데 씁니다(화면에 √를 쓰지 않음)
  const gcdI = (a, b) => (b ? gcdI(b, a % b) : Math.abs(a));
  // 실수 v 를 기약분수 n/d (분모 60 이하)로. 없으면 null
  function ratOf(v) {
    for (let d = 1; d <= 60; d++) { const n = Math.round(v * d); if (Math.abs(v * d - n) < 1e-7) { const g = gcdI(n, d); return { n: n / g, d: d / g }; } }
    return null;
  }
  const texFrac = (n, d) => (d === 1 ? `${n}` : `\\frac{${n}}{${d}}`);
  const texRat = (v) => { const q = ratOf(v); return q ? texFrac(q.n, q.d) : fmtN(v).replace('−', '-'); };
  const plainRat = (v) => { const q = ratOf(v); return q ? (q.d === 1 ? `${q.n}` : `${q.d}분의 ${q.n}`) : fmtN(v); };
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [15, 20, 25], [7, 24, 25], [20, 21, 29], [12, 35, 37]];
  // 직각삼각형 (직각 C = 원점, 가로 변 BC = a, 세로 변 CA = b). 직각이 왼쪽 아래.
  const rtTri = (a, b) => ({ C: pt(0, 0), B: pt(a, 0), A: pt(0, -b) });
  // 선분 PQ 위에 세운 정사각형: ref(삼각형 안쪽 점)의 반대쪽으로 나옵니다. [P, Q, Q', P']
  function squareOn(P, Q, ref) {
    const d = sub(Q, P); let n = pt(-d.y, d.x);
    const m = mid(P, Q);
    if (n.x * (ref.x - m.x) + n.y * (ref.y - m.y) > 0) n = mul(n, -1);
    return [P, Q, add(Q, n), add(P, n)];
  }
  const cenOf = (Pts) => pt(Pts.reduce((a, p) => a + p.x, 0) / Pts.length, Pts.reduce((a, p) => a + p.y, 0) / Pts.length);
  // 정사각형 그리기: 면 색 + 테두리 + (선택) 안쪽 글자
  function drawSq(b, sq, color, label, o = {}) {
    fillPoly(b, sq, color, o.fa == null ? 0.16 : o.fa);
    poly(b, sq, o.line || color, o.w || 2.6, { alpha: o.alpha, dash: o.dash });
    if (label != null && label !== '') T(b, cenOf(sq), label, { size: o.size || 16, color: o.lc || color, alpha: o.alpha });
  }

  // 선분 PQ 를 지름으로 하는 반원의 꼭짓점 목록. ref 의 반대쪽으로 부풀어 나옵니다.
  function semiPts(P, Q, ref, n = 48) {
    const m = mid(P, Q), r = len(sub(Q, P)) / 2, a0 = Math.atan2(P.y - m.y, P.x - m.x);
    let nn = pt(-(Q.y - P.y), Q.x - P.x); nn = unit(nn);
    if (nn.x * (ref.x - m.x) + nn.y * (ref.y - m.y) > 0) nn = mul(nn, -1);
    // P 쪽 반지름에서 시작해 nn 방향을 지나 Q 쪽까지
    const dir = Math.sign(cross(sub(P, m), nn)) || 1; // P→nn 이 시계(+)인지
    const pts = [];
    for (let i = 0; i <= n; i++) { const t = a0 + dir * PI * (i / n); pts.push(pt(m.x + r * Math.cos(t), m.y + r * Math.sin(t))); }
    return pts;
  }
  // 원 바깥만 칠하기: draw() 안에서 그린 도형이 원(중심 c, 반지름 r) 안쪽에는 칠해지지 않습니다.
  function outsideCircle(b, c, r, draw) {
    const ctx = b.ctx, s0 = b.toS(c), R = r * b.k;
    ctx.save();
    ctx.beginPath(); ctx.rect(-5, -5, b.W + 10, b.H + 10); ctx.moveTo(s0.x + R, s0.y); ctx.arc(s0.x, s0.y, R, 0, PI * 2, true);
    ctx.clip('evenodd');
    try { draw(); } finally { ctx.restore(); }
  }
  // 다각형 영역 바깥만 / 안쪽만 칠하기는 필요한 곳에서 b.ctx 로 직접 합니다.

  // 현재 문항의 숫자·유형은 pyQ에 보존합니다. 탐구의 조절 값은 문항을 바꾸지 않습니다.
  // 문제, 풀이 글, 풀이 그림, 정답 모두 이 모델을 사용합니다.
  const qState = (s) => Object.assign({}, s, s.pyQ || {});

  /* ------------------------------------------------------------------ 문제 탭 (보기 5개 · 숫자 바꾸기) */
  function problemHTML(D, s) {
    const s2 = qState(s), M = D.model(s2), Q = D.prob(M, s2);
    const key = D.id + '|' + Q.key + '|' + (s.pySeed || 0);
    const pk = s.pyPick && s.pyPick.key === key ? s.pyPick : null;
    let h = Q.html ? `<div class="py-q">${Q.html}</div>` : `<div class="py-q">${esc(Q.stem).replace(/&amp;/g, '&')}</div>`;
    h += '<div class="py-choices' + (Q.wide ? ' wide' : '') + '">';
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="py-ch${cls}" data-py-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.h != null ? o.h : '$' + o.t + '$'}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="py-fb ok"><b>정답이에요!</b> 풀이 탭에서 이 문제의 풀이 그림을 확인해 보세요.</div>' : `<div class="py-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 계산해 보세요.')}</div>`;
    }
    h += `<div class="py-tools"><button type="button" class="apl-btn sm" data-py-new>숫자 바꾸기</button>${Q.note ? `<span class="py-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const s2 = qState(s), Q = D.prob(D.model(s2), s2), i = Q.choices.findIndex((o) => o.ok);
    const o = Q.choices[i];
    return `${NUM[i]} ${o.h != null ? o.h : '$' + o.t + '$'}`;
  }

  function reviewTop(D, s) {
    const qs = qState(s), Q = D.prob(D.model(qs), qs);
    return `<details class="py-recap" open><summary>지금 푸는 문제</summary><div class="py-q">${Q.html || esc(Q.stem)}</div></details>`;
  }

  // 새 문제: 숫자를 새로 뽑고, 탐구·정리 화면도 같은 숫자로 맞춥니다(정리 탭에서 이 문제의 풀이를 볼 수 있게).
  function newProblem(D, s) {
    s.pyQ = D.gen(s, s.pyQ);
    Object.assign(s, s.pyQ);
  }

  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.pyBound) return;
    root.dataset.pyBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-py-pick],[data-py-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.py) return;
      const D = sc.py, s = lab.s;
      if (hit.hasAttribute('data-py-new')) {
        newProblem(D, s);
        s.pySeed = (s.pySeed || 0) + 1; s.pyPick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); lab._buildProblem(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ } // 문제 머리말(태그)도 새 문제에 맞춰 다시 만듭니다
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-py-pick'), 10);
      const s2 = qState(s), Q = D.prob(D.model(s2), s2);
      s.pyPick = { key: D.id + '|' + Q.key + '|' + (s.pySeed || 0), idx };
      if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('py-css')) return;
    const st = document.createElement('style');
    st.id = 'py-css';
    st.textContent = `
.py-q{font-size:var(--fs-md);line-height:1.85}
.py-q ol,.py-q ul{margin:8px 0 0;padding-left:0;list-style:none;display:grid;gap:3px}
.py-q li{line-height:1.6}
.py-q li b{color:var(--m-amber);margin-right:4px}
.py-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:12px 0 4px}
.py-choices.wide{grid-template-columns:1fr}
.py-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.py-ch:hover{background:var(--hover)}
.py-ch .n{color:var(--m-amber);flex:none}
.py-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.py-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.py-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.py-fb.ok{border-left-color:var(--m-green)}
.py-fb.bad{border-left-color:var(--m-red)}
.py-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.py-note{font-size:var(--fs-xs);color:var(--text-3)}
.py-notes{margin:0;padding-left:18px;display:grid;gap:4px}`;
    st.textContent += '\n.py-recap{margin:0 0 12px;padding:12px 14px;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--card-2)}.py-recap summary{cursor:pointer;font-weight:800;color:var(--m-sky);margin-bottom:8px}';
    document.head.append(st);
  }
  installStyle();
  installClicks();

  /* ------------------------------------------------------------------ 장면 만들기
     D = { id, title, short, question, ctl:[조절 값 id…] | (s)=>[…], presets?(s), init(s), gen(s,prev)→{슬라이더 값 묶음}(문제 숫자),
           model(s)→M, draw(b,s,M,C), steps(M)→[글…], view(M,C,s)→{guide,readouts,status?,formula?,rule?,notes?,alert?},
           prob(M,s)→{tag,stem|html,choices,key,note?}, anim?:{key,dur,label,start}, stepT?(n,M) }
     문제·풀이 탭은 s.pyQ(= gen 이 뽑은 슬라이더 값 묶음)를 덮어쓴 같은 상태로 만듭니다. */
  const texSafe = (t) => String(t == null ? t : t).replace(/\$([^$]+)\$/g, (m, x) => '$' + x.replace(/</g, '\\lt ').replace(/>/g, '\\gt ') + '$');
  function makeScene(D, sceneParams) {
    const A = D.anim;
    // A lesson fixes the source question independently of the manual exercise.
    // Keep animated values in state, not in its fixed pyQ condition object.
    const inLesson = (s) => !!(s.lessonOn || s.lessonEntry);
    const stateFor = (s, review) => inLesson(s)
      ? D.lessonState ? D.lessonState(s) : s.pyLessonProblem ? qState(s) : s
      : review ? qState(s) : s;
    const modelFor = (s, review) => {
      const M = D.model(stateFor(s, review));
      return inLesson(s) && D.lessonModel ? D.lessonModel(M, s) : M;
    };
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
      id: D.id, title: D.title, short: D.short || D.title, py: D,
      question: (s) => inLesson(s) && D.lessonQuestion ? D.lessonQuestion(modelFor(s, true), s, D.prob(D.model(qState(s)), qState(s))) : typeof D.question === 'function' ? D.question(s) : D.question,
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl),
      presets: (s) => (D.presets ? D.presets(s) : []),
      actions,
      tabs: { order: ['explore', 'problem', 'review'], labels: { review: '풀이' } },
      reviewTop: (s) => inLesson(s) ? '' : reviewTop(D, s),
      reviewTitles: { steps: '현재 문제의 풀이 · 단계마다 그림이 바뀌어요', solution: '풀이 확인' },
      steps: (s) => D.steps(modelFor(s, true)).map((t) => texSafe(String(t).replace(/<\/?b>/g, ''))),
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: (s) => { const s2 = qState(s); return D.prob(D.model(s2), s2).tag; },
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(D, s)
      },
      enter: (s, lab) => {
        // pyIb is a right-triangle leg in t5 and an isosceles base in t6.
        // Restore this module's label/range before the shell builds controls or
        // restores hash values; global parameter merge order must not choose it.
        if (lab && s === lab.s && lab.params && sceneParams) Object.assign(lab.params, sceneParams);
        D.init(s);
        s.pySeed = 0; s.pyPick = null; s.playing = false; s.pyQ = null;
        s.pyQ = D.gen(s, null);
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
        } else if (A && D.stepT && lab && lab.tab === 'review' && !s.dragging) {
          const tg = D.stepT(s.step || 0, D.model(s)), d = tg - s[A.key];
          if (Math.abs(d) > 8e-4) { s[A.key] += clamp(d, -0.35 * dt, 0.35 * dt); again = true; }
        }
        return again;
      },
      view: (s, lab) => {
        if (lab) curLab = lab;
        const C = baseCtx(s, lab, false);
        if (C.lesson) return { guide: '문제의 조건을 확인하고 ▶ 해설을 시작해 보세요.', card: null, readouts: [], formula: null, rule: null, status: null, alert: null, notes: null, chips: [] };
        const s2 = stateFor(s, C.problem || C.review);
        const M = modelFor(s, C.problem || C.review);
        const v = D.view(M, C, s2) || {};
        if (C.problem || C.review) {
          // 탐구용 완성 수식/측정값이 풀이 첫 단계에서 답을 먼저 보여 주지 않도록 합니다.
          delete v.formula; delete v.rule; delete v.alert;
          v.readouts = [];
          if (C.problem || (s.step || 1) < D.steps(M).length) delete v.notes;
        }
        ['formula', 'rule', 'notes', 'guide'].forEach((k) => { if (typeof v[k] === 'string') v[k] = texSafe(v[k]); });
        if (C.tab === 'problem') v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' };
        else if (C.tab === 'review') { const n = D.steps(M).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; v.guide = '문제의 조건을 유지한 채 단계를 눌러 보조선과 계산을 확인해 보세요.'; }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        if (b.thumb) C.step = 99;
        const s2 = stateFor(s, C.problem || C.review);
        const M = modelFor(s, C.problem || C.review);
        if (C.review && !C.lesson) C.step = Math.max(1, C.step);
        C.answer = C.lesson ? !s.lessonEntry && !!s.pyShowAnswer : C.full || (C.review && C.step >= D.steps(M).length);
        C.calculation = C.lesson ? !s.lessonEntry && !!s.pyCalculationReady : C.full || (C.review && C.step >= D.steps(M).length - 1);
        C.givens = C.lesson ? !!s.pyLessonProblem : C.problem || C.review;
        C.t = A ? (C.lesson || C.tab === 'explore' || b.thumb ? (s[A.key] || 0) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : 1)) : 1;
        D.draw(b, s2, M, C);
      }
    };
  }

  function register(order, id, title, short, params, scenes) {
    (window.APL_PY_GROUPS = window.APL_PY_GROUPS || []).push({ order, id, title, short, params, scenes: scenes.map((D) => makeScene(D, params)) });
  }
  const notes = (...li) => `<ul class="py-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  window.APL_PY = {
    PI, DEG, clamp, ease, seg01, NUM, LET, esc, r1, isInt, fmtN, dg, eqs, tx, texDeg, ol,
    pt, add, sub, mul, len, dist, unit, mid, lerp, polar, dirDeg, rotP, angBetween, cross, inter, polyArea, centroid, pick, rint, bboxOf, unionBox, shiftPts,
    triSSS, sidesOf, anglesOf,
    textW, T, tagOut, vtx, sideTag, lenTag, ang, tick, par, fillPoly, line, poly, arcPart, drawTri, fit, P, degF, cmF,
    josa, seeded, shuffle, mkChoices, mkTextChoices, baseCtx, showAt, makeScene, register, notes, rd,
    sup2, semiPts, outsideCircle, isSqN, isq, gcdI, ratOf, texFrac, texRat, plainRat, TRIPLES, rtTri, squareOn, cenOf, drawSq, qState
  };
})();
