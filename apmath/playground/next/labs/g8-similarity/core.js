/* ==========================================================================
   중2 · 도형의 닮음 — 공용 도구 (core.js)
   - 여덟 개 탭 모듈(t1~t8.js)이 함께 쓰는 작은 도구 모음입니다. 전역은 APL_SM(도구)과 APL_SM_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구(조절·움직임·실시간 값) → 먼저 문제 풀기 → 현재 문제의 단계별 풀이.
   - 색의 역할(이 실험실 전체): 하늘 = 작은(첫째) 도형·주어진 값 · 초록 = 큰(둘째) 도형·평행선·완성 · 분홍 = 같은 각 · 노랑 = 구하는 값 x·끌 수 있는 점 · 기본 = 도형의 변.
   - 같은 크기의 각은 같은 표시(호 1개, 2개), 직각은 네모, 같은 길이는 눈금, 평행선은 화살표.
   - 움직임은 가로 이동만(세로 이동 없음). 제자리 회전·뒤집기·서서히 나타남은 허용. 길이는 모두 정수(√ 없음, 중2).
   - 도형 좌표계: figure (y 아래쪽). 각도는 화면 기준(시계 방향이 +).
   - 문제는 gen(seed)가 만든 값(pk)으로만 정해집니다. 보기 순서는 pk 의 seed 로 한 번만 섞입니다(그리는 중에 바뀌지 않음).
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
  const tx = (v) => fmtN(v).replace('−', '-');
  const texDeg = (v) => tx(v) + '^{\\circ}';
  const ol = (s) => `\\overline{${s}}`;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (a, b) => `\\frac{${a}}{${b}}`; // 그림·수식용 위아래 분수
  const frT = (a, b) => `$\\frac{${a}}{${b}}$`; // 패널 글용
  const cm = (v) => fmtN(v) + ' cm';
  const cm2 = (v) => fmtN(v) + ' cm²';
  const cm3 = (v) => fmtN(v) + ' cm³';
  // 숫자 뒤 조사: 받침 있는 숫자(0 1 3 6 7 8)는 첫째, 없으면 둘째
  const josa = (n, a, b) => ([0, 1, 3, 6, 7, 8].includes(Math.abs(Math.round(n)) % 10) ? a : b);

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
  const rotP = (p, c, deg) => { const t = deg * DEG, d = sub(p, c); return { x: c.x + d.x * Math.cos(t) - d.y * Math.sin(t), y: c.y + d.x * Math.sin(t) + d.y * Math.cos(t) }; };
  const angBetween = (V, A, B) => { const u = sub(A, V), w = sub(B, V); return Math.acos(clamp((u.x * w.x + u.y * w.y) / (len(u) * len(w) || 1), -1, 1)) / DEG; };
  const cross = (a, b) => a.x * b.y - a.y * b.x;
  function inter(P, Q, R, S) {
    const d1 = sub(Q, P), d2 = sub(S, R), den = cross(d1, d2);
    if (Math.abs(den) < 1e-12) return null;
    const t = cross(sub(R, P), d2) / den;
    return { x: P.x + d1.x * t, y: P.y + d1.y * t };
  }
  const polyArea = (Pn) => Math.abs(Pn.reduce((a, p, i) => a + cross(p, Pn[(i + 1) % Pn.length]), 0) / 2);
  const centroid = (Pn) => ({ x: Pn.reduce((a, p) => a + p.x, 0) / Pn.length, y: Pn.reduce((a, p) => a + p.y, 0) / Pn.length });
  const bboxOf = (pts, pad = 0) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
  };
  const unionBox = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });
  const shiftPts = (Pn, dx, dy = 0) => Pn.map((p) => pt(p.x + dx, p.y + dy));
  const scalePts = (Pn, k, o = pt(0, 0)) => Pn.map((p) => pt(o.x + (p.x - o.x) * k, o.y + (p.y - o.y) * k));

  /* 삼각형 만들기: 세 변 a=BC, b=CA, c=AB 로 B(왼쪽 아래)·C(오른쪽 아래)·A(위)를 놓습니다(안 되면 null) */
  function triTop(a, b, c) {
    const x = (c * c + a * a - b * b) / (2 * a), h2 = c * c - x * x;
    if (!(a > 0) || h2 <= 1e-9) return null;
    return { A: pt(x, -Math.sqrt(h2)), B: pt(0, 0), C: pt(a, 0) };
  }

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
  const ri = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1));
  const rpick = (rnd, list) => list[Math.floor(rnd() * list.length)];

  /* ------------------------------------------------------------------ 그리기 도우미 */
  const textW = (t, size) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size * 1.0 : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };
  function T(b, p, str, o = {}) {
    if (str == null || str === '') return;
    b.text(p, str, { dx: o.dx || 0, dy: o.dy || 0, color: o.color || 'ink', size: o.size || 16, weight: 800, align: o.align || 'center', baseline: 'middle', alpha: o.alpha, ref: o.ref, leaderAnchor: o.leaderAnchor, leader: o.leader, noLeader: o.noLeader, ...(o.leaderSegment ? { leaderSegment: o.leaderSegment } : {}) });
  }
  const phone = (b) => b.W < 560;
  const capSize = (b) => (phone(b) ? 14 : 17);
  // 점 p 에서 중심 c 의 반대쪽(바깥)으로 비켜 놓은 글자
  function tagOut(b, p, c, str, o = {}) {
    const u = unit(sub(p, c)), size = o.size || 17, w = textW(str, size), g = o.gap == null ? 12 : o.gap;
    const d = Math.abs(u.x) * (w / 2) + Math.abs(u.y) * size * 0.55 + g;
    T(b, p, str, { ...o, size, dx: u.x * d, dy: u.y * d });
  }
  function vtx(b, p, c, name, o = {}) {
    b.point(p, { color: o.color || 'ink', r: o.r || 4.5 });
    if (name) tagOut(b, p, c, name, { size: o.size || 17, gap: o.gap == null ? 11 : o.gap, color: o.nameColor || 'ink' });
  }
  // 변 pq 의 바깥쪽(중심 c 의 반대쪽)에 글자. 쌓은 분수(\frac)는 키가 커서 더 비켜 놓습니다.
  function sideTag(b, p, q, c, str, o = {}) {
    const m = lerp(p, q, o.f == null ? 0.5 : o.f), size = o.size || 16;
    let n = unit({ x: -(q.y - p.y), y: q.x - p.x });
    if (n.x * (m.x - c.x) + n.y * (m.y - c.y) < 0) n = mul(n, -1);
    const metrics = labelMetrics(str, size), sh = metrics.height / 2, w = metrics.width, g = o.gap == null ? 12 : o.gap;
    const d = Math.abs(n.x) * (w / 2) + Math.abs(n.y) * sh + g;
    T(b, m, str, { color: o.color || 'ink', size, dx: n.x * d + (o.dx || 0), dy: n.y * d + (o.dy || 0), alpha: o.alpha, leaderAnchor: m, leader: o.leader, noLeader: o.noLeader, leaderSegment: o.leaderSegment });
  }
  /* 각 표시: 꼭짓점 V 에서 반직선 VA → VB 방향의 작은 각. rings = 호 개수(같은 각은 같은 개수). 직각이면 네모. */
  function ang(b, V, A, B, o = {}) {
    const k = b.k || 60, r = (o.r || 26) * (b.thumb ? 0.7 : 1);
    const a0 = Math.atan2(A.y - V.y, A.x - V.x), a1 = Math.atan2(B.y - V.y, B.x - V.x);
    let d = ((a1 - a0 + PI * 3) % (PI * 2)) - PI;
    if (o.big) d = d > 0 ? d - PI * 2 : d + PI * 2;
    const deg = Math.abs(d) / DEG, col = o.color || 'rose', am = a0 + d / 2;
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
      const sg = d < 0 ? -1 : 1; let t = (sg * (la - a0)) % (PI * 2); if (t < 0) t += PI * 2;
      const markerR = !o.big && Math.abs(deg - 90) < 0.6 && !o.noRight ? Math.min(r * 0.62, 17) * Math.SQRT2 / k : rw;
      const leaderAnchor = o.noMark ? V : { x: V.x + Math.cos(am) * markerR, y: V.y + Math.sin(am) * markerR };
      T(b, V, o.label, { dx: Math.cos(la) * dst, dy: Math.sin(la) * dst, color: o.labelColor || col, size, alpha: o.alpha, leaderAnchor, leader: t > Math.abs(d) + 1e-6, noLeader: o.noLeader });
    }
    return { deg, mid: am };
  }
  // 치수선: 변 pq 에서 중심 c 의 반대쪽으로 off(px)만큼 띄운 선과 양 끝 눈금, 그리고 길이 글자
  function dim(b, p, q, c, str, o = {}) {
    const k = b.k || 60, off = (o.off || 30) / k, col = o.color || 'ink', m = mid(p, q);
    let n = unit({ x: -(q.y - p.y), y: q.x - p.x });
    if (n.x * (m.x - c.x) + n.y * (m.y - c.y) < 0) n = mul(n, -1);
    const p2 = add(p, mul(n, off)), q2 = add(q, mul(n, off));
    b.path([p, p2], { color: col, width: 1.3, alpha: 0.55 }); b.path([q, q2], { color: col, width: 1.3, alpha: 0.55 });
    b.path([p2, q2], { color: col, width: 2.4 });
    const size = o.size || 16, metrics = labelMetrics(str, size), w = metrics.width;
    const d = Math.abs(n.x) * (w / 2) + Math.abs(n.y) * metrics.height / 2 + 12;
    T(b, mid(p2, q2), str, { color: col, size, dx: n.x * d, dy: n.y * d, leaderAnchor: mid(p2, q2) });
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

  function fit(b, box, o = {}) {
    const narrow = b.W < 560;
    const aw = Math.max(10, b.W - b.insets.left - b.insets.right), ah = Math.max(10, b.H - b.insets.top - b.insets.bottom);
    const pp = b.pad * Math.min(aw, ah), W = aw - 2 * pp, H = ah - 2 * pp;
    const base = b.thumb ? 5 : narrow ? 30 : 46;
    const pad = { l: o.l == null ? base : o.l, r: o.r == null ? base : o.r, t: o.t == null ? base : o.t, b: o.b == null ? base : o.b };
    const bw = Math.max(1e-6, box.x1 - box.x0), bh = Math.max(1e-6, box.y1 - box.y0);
    let k = Math.max(3, Math.min((W - pad.l - pad.r) / bw, (H - pad.t - pad.b) / bh));
    if (o.maxK) k = Math.min(k, o.maxK);
    b.focus = { x: [box.x0 - pad.l / k, box.x1 + pad.r / k], y: [box.y0 - pad.t / k, box.y1 + pad.b / k] };
    return b.k;
  }
  // 선분 pq 를 앞뒤로 a, c 만큼 늘인 두 끝점 (그림의 직선)
  const extend = (p, q, a, c) => { const u = unit(sub(q, p)); return [sub(p, mul(u, a)), add(q, mul(u, c))]; };

  /* ------------------------------------------------------------------ 조절 값 만들기 */
  const P = (label, min, max, step, value, o = {}) => ({ value, min, max, step, color: o.color || 'sky', label, hint: o.hint, format: o.format || ((v) => fmtN(v)) });
  const degF = (v) => fmtN(v) + '°';
  const cmF = (v) => fmtN(v) + ' cm';

  /* ------------------------------------------------------------------ 5지선다 만들기 */
  // 숫자 보기: correct = 정답 값, wrongs = [[값, 힌트], …]. 모자라면 정답 ± 간격으로 채웁니다. 작은 값부터 놓습니다(교재 방식).
  function mkChoices(correct, wrongs, o = {}) {
    const tex = o.tex || ((v) => tx(v)), plain = o.plain || ((v) => fmtN(v)), valid0 = o.valid || ((v) => v > 0), valid = (v) => valid0(v) && Math.abs(v - Math.round(v)) < 1e-9; // 보기는 모두 정수
    const same = (a, b) => Math.abs(a - b) < 1e-6;
    const cands = [];
    for (const w of wrongs) {
      const v = w[0];
      if (!Number.isFinite(v) || !valid(v) || same(v, correct) || cands.some((x) => same(x.v, v))) continue;
      cands.push({ v, ok: false, hint: w[1] || '' });
    }
    const gap = o.pad || 1;
    for (let k = 1; k < 80 && cands.length < 14; k++) {
      for (const sg of [1, -1]) {
        const v = correct + sg * gap * k;
        if (valid(v) && !same(v, correct) && !cands.some((x) => same(x.v, v))) cands.push({ v, ok: false, hint: '풀이 순서대로 다시 계산해 보세요.' });
      }
    }
    // 정답이 늘 가운데에 오지 않도록, 정답보다 작은 보기의 개수를 문제마다 0~4 사이에서 달리한다(값으로 정해 문제마다 안정적)
    const below = cands.filter((x) => x.v < correct), above = cands.filter((x) => x.v > correct);
    let h = Math.round(Math.abs(correct) * 31) + cands.length * 17;
    cands.slice(0, 4).forEach((x) => { h += Math.round(Math.abs(x.v) * 7); });
    let lo = h % 5; lo = Math.min(lo, below.length); let hi = 4 - lo;
    if (hi > above.length) { hi = above.length; lo = Math.min(below.length, 4 - hi); }
    const list = [{ v: correct, ok: true, hint: '' }].concat(below.slice(0, lo), above.slice(0, hi));
    for (const x of cands) { if (list.length >= 5) break; if (!list.includes(x)) list.push(x); }
    list.sort((a, b) => a.v - b.v);
    return list.map((x) => ({ t: tex(x.v), p: plain(x.v), ok: x.ok, hint: x.hint }));
  }
  // 글·수식 보기: items = [{h, ok, hint}] 5개를 seed 로 안정되게 섞어 놓습니다.
  function mkTextChoices(items, seed) {
    const list = shuffle(items, seeded('tc|' + seed));
    return list.map((x) => ({ h: x.h, p: x.p || String(x.h).replace(/\$/g, '').replace(/\\[a-z]+/g, ''), ok: !!x.ok, hint: x.hint || '' }));
  }
  // 비 보기(m:n) — 값은 [m,n] 쌍. 값이 작은 비부터 놓습니다.
  function mkRatioChoices(correct0, wrongs0, o = {}) {
    // 비는 가장 간단한 자연수의 비로 줄여서 보여 준다 (9 : 36 대신 1 : 4)
    const red = (v) => { const g = gcd(v[0], v[1]) || 1; return [v[0] / g, v[1] / g]; };
    const correct = red(correct0), wrongs = wrongs0.map((w) => [red(w[0]), w[1]]);
    const key = (v) => v.join(':');
    const list = [{ v: correct, ok: true, hint: '' }];
    for (const w of wrongs) { if (w[0].some((x) => !(x > 0)) || list.some((x) => key(x.v) === key(w[0]))) continue; list.push({ v: w[0], ok: false, hint: w[1] || '' }); if (list.length === 5) break; }
    for (let k = 1; list.length < 5 && k < 40; k++) { const v = red([correct[0] + k, correct[1] + k]); if (!list.some((x) => key(x.v) === key(v))) list.push({ v, ok: false, hint: '비의 각 항에 같은 수를 더하면 비가 달라져요.' }); }
    list.sort((a, b) => a.v[0] / a.v[1] - b.v[0] / b.v[1] || a.v[0] - b.v[0]);
    const pre = o.pre || '';
    return list.map((x) => ({ h: `$${pre}${x.v[0]}:${x.v[1]}$`, p: `${x.v[0]} : ${x.v[1]}`, ok: x.ok, hint: x.hint }));
  }

  /* ------------------------------------------------------------------ 장면 상태 (탭·단계) */
  function baseCtx(s, lab, thumb) {
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    const lesson = !thumb && !!(s.lessonOn || s.lessonEntry), entry = lesson && !!s.lessonEntry;
    return { tab, problem, review, step: entry ? 0 : lesson || review ? s.step || 0 : 99, txt: !thumb, thumb: !!thumb, full: !lesson && (tab === 'explore' || thumb), lesson, entry, answer: lesson && !entry && !!s.smShowAnswer, calculation: lesson && !entry && !!s.smCalculationReady };
  }
  const showAt = (C, n) => C.step >= n;

  /* ------------------------------------------------------------------ 문제 탭 (보기 5개 · 숫자 바꾸기) */
  const qOf = (D, s) => { const Q = D.prob(D.model(s), s); Q.key = D.id + '|' + (Q.key == null ? '' : Q.key) + '|' + (s.smSeed || 0); return Q; };
  const solutionOf = (D, s) => {
    const M = D.model(s), Q = qOf(D, s);
    const solution = window.APL_SM.solveQuestion(D.id, M.pk, Q);
    return { ...solution, key: Q.key, steps: solution.steps.map(texSafe) };
  };
  function problemHTML(D, s) {
    const Q = qOf(D, s);
    const pk = s.smPick && s.smPick.key === Q.key ? s.smPick : null;
    let h = Q.html ? `<div class="sm-q">${Q.html}</div>` : `<div class="sm-q">${esc(Q.stem).replace(/&amp;/g, '&')}</div>`;
    h += '<div class="sm-choices' + (Q.wide ? ' wide' : '') + '">';
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="sm-ch${cls}" data-sm-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.h != null ? o.h : '$' + o.t + '$'}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="sm-fb ok"><b>정답이에요!</b> 풀이 탭에서 지금 문제의 풀이 그림을 확인해 보세요.</div>' : `<div class="sm-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 계산해 보세요.')}</div>`;
    }
    h += `<div class="sm-tools"><button type="button" class="apl-btn sm" data-sm-new>숫자 바꾸기</button>${Q.note ? `<span class="sm-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const Q = qOf(D, s), i = Q.choices.findIndex((o) => o.ok), o = Q.choices[i];
    return `${NUM[i]} ${o.h != null ? o.h : '$' + o.t + '$'}`;
  }

  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.smBound) return;
    root.dataset.smBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-sm-pick],[data-sm-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.sm) return;
      const D = sc.sm, s = lab.s;
      if (hit.hasAttribute('data-sm-new')) {
        const strip = (k) => k.replace(/\|\d+$/, '');
        const cur = strip(qOf(D, s).key);
        for (let t = 0; t < 12; t++) { D.reroll(s); if (strip(qOf(D, s).key) !== cur) break; }
        s.smSeed = (s.smSeed || 0) + 1; s.smPick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-sm-pick'), 10);
      const Q = qOf(D, s);
      s.smPick = { key: Q.key, idx };
      if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('sm-css')) return;
    const st = document.createElement('style');
    st.id = 'sm-css';
    st.textContent = `
.sm-q{font-size:var(--fs-md);line-height:1.85}
.sm-q ol,.sm-q ul{margin:8px 0 0;padding-left:0;list-style:none;display:grid;gap:3px}
.sm-q li{line-height:1.6}
.sm-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:12px 0 4px}
.sm-choices.wide{grid-template-columns:1fr}
.sm-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.sm-ch:hover{background:var(--hover)}
.sm-ch .n{color:var(--m-amber);flex:none}
.sm-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.sm-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.sm-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.sm-fb.ok{border-left-color:var(--m-green)}
.sm-fb.bad{border-left-color:var(--m-red)}
.sm-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.sm-note{font-size:var(--fs-xs);color:var(--text-3)}
.sm-notes{margin:0;padding-left:18px;display:grid;gap:4px}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();

  /* ------------------------------------------------------------------ 장면 만들기
     D = { id, title, short, question, ctl:[조절 값 id…] | (s)=>[…], presets?(s), init(s), gen(seed)→pk, model(s)→M(탐구 값; M.pk 는 자동으로 붙음),
           draw(b,s,M,C), steps(M)→[글…], view(M,C,s)→{guide,readouts,status?,formula?,rule?,notes?}, prob(M,s)→{tag,stem|html,choices,key,note?},
           anim?:{key,dur,label,start}, stepT?(n,M) }
     pk 는 gen(seed)가 만든 문제 값입니다(첫 문제도 enter 에서 gen(1)로 채워져 숫자 바꾸기 전에도 완전합니다). */
  const texSafe = (t) => String(t == null ? t : t).replace(/\$([^$]+)\$/g, (m, x) => '$' + x.replace(/</g, '\\lt ').replace(/>/g, '\\gt ') + '$');
  /* ------------------------------------------------------------------ 글자 겹침 풀기
     한 장면을 그리는 동안 b.text 를 모아 두었다가 마지막에 한꺼번에 그린다. 점 이름(대문자 한 글자)이 먼저 자리를 잡고,
     길이·각·넓이 같은 값 글자는 점 이름, 점(원), 이미 놓인 다른 글자와 겹치면 가까운 빈자리로 조금(최대 ~44px) 비켜 놓는다. */
  // Fraction width depends on the numerator/denominator, and its height is
  // nearly twice a single line. The former fixed box let two fractions overlap.
  function labelMetrics(str, size) {
    const t = String(str), re = /\\(?:d?frac)\{([^{}]*)\}\{([^{}]*)\}/g;
    let width = 0, cursor = 0, fractions = false, m;
    while ((m = re.exec(t))) {
      fractions = true;
      width += textW(t.slice(cursor, m.index), size) + Math.max(textW(m[1], size * .88), textW(m[2], size * .88)) + 6;
      cursor = m.index + m[0].length;
    }
    width += textW(t.slice(cursor), size);
    return { width, height: size * (fractions ? 2.2 : 1.12) };
  }
  function segmentHitsBox(a, z, r) {
    let lo = 0, hi = 1;
    for (const [v, d, min, max] of [[a.x, z.x - a.x, r.x0, r.x1], [a.y, z.y - a.y, r.y0, r.y1]]) {
      if (Math.abs(d) < 1e-9) { if (v < min || v > max) return false; }
      else { const t0 = (min - v) / d, t1 = (max - v) / d; lo = Math.max(lo, Math.min(t0, t1)); hi = Math.min(hi, Math.max(t0, t1)); }
      if (lo > hi) return false;
    }
    return true;
  }
  // Opt-in whole-side labels keep their text position. If a name hides the
  // connector, move only its anchor along that same side, in screen-pixel steps.
  function clearSideAnchor(anchor, label, width, height, ends, names) {
    const blocked = a => {
      const dx = a.x - label.x, dy = a.y - label.y, length = Math.hypot(dx, dy);
      if (length < 1) return null;
      const edge = Math.min(Math.abs(dx) > 1e-9 ? width / (2 * Math.abs(dx)) : Infinity, Math.abs(dy) > 1e-9 ? height / (2 * Math.abs(dy)) : Infinity);
      const stop = edge * length + 4; // Same text-box gap as Board.leader.
      if (length <= stop + 1) return null;
      const end = { x: label.x + dx * stop / length, y: label.y + dy * stop / length };
      return names.some(r => segmentHitsBox(a, end, r));
    };
    if (!blocked(anchor)) return anchor;
    const [p, q] = ends, dx = q.x - p.x, dy = q.y - p.y, length = Math.hypot(dx, dy);
    if (length < 2) return anchor;
    const at = ((anchor.x - p.x) * dx + (anchor.y - p.y) * dy) / (length * length);
    for (let pixels = 1; pixels < length; pixels++) for (const sign of [-1, 1]) {
      const t = at + sign * pixels / length;
      if (t <= 0 || t >= 1) continue;
      const candidate = { x: p.x + t * dx, y: p.y + t * dy };
      // A disappearing connector is not a successful avoidance.
      if (blocked(candidate) === false) return candidate;
    }
    return anchor;
  }
  function drawResolved(b, run) {
    if (b.thumb || b._bbox) { run(); return; }
    const oText = b.text, oPoint = b.point, hadT = Object.prototype.hasOwnProperty.call(b, 'text'), hadP = Object.prototype.hasOwnProperty.call(b, 'point');
    const q = [], marks = [];
    b.text = (p, str, o = {}) => { if (str == null || str === '' || o.alpha === 0) return; q.push({ p, str, o }); };
    b.point = function (p, o = {}) { marks.push({ p, r: (o.r || 5) }); return oPoint.call(b, p, o); };
    try { run(); } finally {
      if (hadT) b.text = oText; else delete b.text;
      if (hadP) b.point = oPoint; else delete b.point;
    }
    const k = b.k || 60;
    const isName = (e) => /^[A-Z][′'’]?$/.test(String(e.str));
    const rectOf = (e, ox, oy) => {
      const size = e.o.size || 16, metrics = labelMetrics(e.str, size), w = metrics.width + 4, h = metrics.height, al = e.o.align || 'center';
      const cx = e.p.x * k + (e.o.dx || 0) + ox, cy = e.p.y * k + (e.o.dy || 0) + oy;
      const x0 = al === 'left' || al === 'start' ? cx : al === 'right' || al === 'end' ? cx - w : cx - w / 2;
      return { x0, x1: x0 + w, y0: cy - h / 2, y1: cy + h / 2 };
    };
    const hit = (a, c) => a.x0 < c.x1 && a.x1 > c.x0 && a.y0 < c.y1 && a.y1 > c.y0;
    const mrect = marks.map((m) => ({ x0: m.p.x * k - m.r - 1, x1: m.p.x * k + m.r + 1, y0: m.p.y * k - m.r - 1, y1: m.p.y * k + m.r + 1, px: m.p.x, py: m.p.y }));
    const ring = [[0, 0]];
    for (let d = 7; d <= 44; d += 7) [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([a, c]) => ring.push([a * d * (a && c ? 0.72 : 1), c * d * (a && c ? 0.72 : 1)]));
    const placed = [];
    const place = (e) => {
      const own = (m) => Math.abs(m.px - e.p.x) < 1e-6 && Math.abs(m.py - e.p.y) < 1e-6;
      let best = [0, 0];
      for (const [ox, oy] of ring) {
        const r = rectOf(e, ox, oy);
        if (!placed.some((c) => hit(r, c)) && !mrect.some((m) => !own(m) && hit(r, m))) { best = [ox, oy]; break; }
      }
      e.ox = best[0]; e.oy = best[1];
      placed.push(rectOf(e, best[0], best[1]));
    };
    q.filter(isName).forEach(place);
    q.filter((e) => !isName(e)).forEach(place);
    const screen = p => b.toS(b._P ? b._P(p) : p);
    const nameBoxes = b.leader && q.some(e => e.o.leaderSegment) ? q.filter(isName).map(e => {
      const at = screen(e.p), m = b.annotationSize(e.str, e.o), al = e.o.align || 'center';
      const x = at.x + (e.o.dx || 0) + (e.ox || 0) + (al === 'left' || al === 'start' ? (m.width - 6) / 2 : al === 'right' || al === 'end' ? -(m.width - 6) / 2 : 0);
      const y = at.y + (e.o.dy || 0) + (e.oy || 0);
      // T uses a middle baseline; annotationSize includes the actual font and halo.
      return { x0: x - m.width / 2, x1: x + m.width / 2, y0: y - m.height / 2, y1: y + m.height / 2 };
    }) : [];
    // 배치로 밀려난 값은 해당 선분/각에, 점 이름은 실제 점에 연결합니다.
    // 라벨 전체를 그리기 전에 가는 실선으로 그려 수학적 보조선과 구별합니다.
    q.forEach((e) => {
      const source = e.o.leaderAnchor || (isName(e) ? e.p : null);
      if (!source || e.o.noLeader || !b.leader || !(e.o.leader || Math.hypot(e.ox || 0, e.oy || 0) > 12)) return;
      const r = rectOf(e, e.ox || 0, e.oy || 0), at = b.toS(b._P ? b._P(e.p) : e.p);
      const label = { x: at.x + (r.x0 + r.x1) / 2 - e.p.x * k, y: at.y + (r.y0 + r.y1) / 2 - e.p.y * k };
      const anchor = e.o.leaderSegment ? clearSideAnchor(screen(source), label, r.x1 - r.x0, r.y1 - r.y0, e.o.leaderSegment.map(screen), nameBoxes) : screen(source);
      b.leader(anchor, label, { px: true, width: r.x1 - r.x0, height: r.y1 - r.y0, color: 'muted', alpha: Math.min(.78, e.o.alpha == null ? 1 : e.o.alpha) });
    });
    q.forEach((e) => oText.call(b, e.p, e.str, { ...e.o, dx: (e.o.dx || 0) + (e.ox || 0), dy: (e.o.dy || 0) + (e.oy || 0) }));
  }

  const inLesson = (s) => !!(s.lessonOn || s.lessonEntry);
  function lessonQuestion(D, s) {
    const M = D.model(s), Q = D.questionOf(s);
    const custom = D.lessonQuestion && D.lessonQuestion(M, s, Q);
    if (custom != null) return texSafe(custom);
    if (!s.smLessonProblem) return texSafe(typeof D.question === 'function' ? D.question(s) : D.question);
    let body = Q.html || Q.stem || '';
    const choices = (Q.choices || []).map(c => c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p);
    if (choices.length && !choices.every(text => body.includes(String(text)))) body += '<br>' + choices.map((text, i) => NUM[i] + ' ' + text).join('<br>');
    return texSafe(body);
  }
  function makeScene(D) {
    const A = D.anim;
    const actions = A ? () => [
      {
        id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
        label: (s) => (s.playing ? '일시 정지' : s[A.key] >= 0.999 ? '다시 재생' : A.label || '움직여 보기'),
        on: (s) => s.playing,
        run: (s) => { if (s.playing) s.playing = false; else { if (s[A.key] >= 0.999) s[A.key] = 0; s.playing = true; } }
      },
      { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s[A.key] = 0; } }
    ] : undefined;
    const model = (s) => { if (!s.smPk) s.smPk = D.gen(1); const M = D.model(s); M.pk = s.smPk; return M; };
    const DD = { ...D, model, reroll: (s) => { s.smPk = D.gen(1 + Math.floor(Math.random() * 1e9)); } };
    DD.questionOf = (s) => qOf(DD, s);
    DD.solution = (s) => solutionOf(DD, s);
    const modelFor = (s) => { const M = model(s); return inLesson(s) && DD.lessonModel ? DD.lessonModel(M, s) : M; };
    return {
      id: D.id, title: D.title, short: D.short || D.title, sm: DD,
      tabs: { order: ['explore', 'problem', 'review'], labels: { review: '풀이' } },
      question: (s) => inLesson(s) ? lessonQuestion(DD, s) : (typeof D.question === 'function' ? D.question(s) : D.question),
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl),
      presets: (s) => (D.presets ? D.presets(s) : []),
      actions,
      steps: (s) => solutionOf(DD, s).steps,
      reviewTop: (s) => { if (inLesson(s)) return ''; const Q = qOf(DD, s); return `<div class="sm-current"><b>지금 푸는 문제</b><div class="sm-q">${texSafe(Q.html != null ? Q.html : Q.stem)}</div></div>`; },
      notesTitle: '자주 틀리는 부분',
      problem: D.prob ? {
        tag: (s) => D.prob(model(s), s).tag,
        text: (s) => problemHTML(DD, s),
        answer: (s) => answerText(DD, s)
      } : undefined,
      enter: (s, lab) => {
        D.init(s);
        s.smPk = D.gen(1);
        s.smSeed = 0; s.smPick = null; s.playing = false; s.step = 1; s.revealed = false;
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
        }
        return again;
      },
      view: (s, lab) => {
        if (lab) curLab = lab;
        if (inLesson(s)) return { guide: null, card: null, readouts: [], formula: null, rule: null, status: null, alert: null, notes: [], chips: [] };
        const C = baseCtx(s, lab, false);
        const M = model(s);
        const v = D.view(M, C, s) || {};
        ['formula', 'rule', 'notes', 'guide'].forEach((k) => { if (typeof v[k] === 'string') v[k] = texSafe(v[k]); });
        if (C.problem || C.review) {
          v.readouts = []; v.formula = ''; v.rule = ''; v.notes = '';
          v.guide = C.problem ? '주어진 조건과 대응하는 변을 먼저 찾아보세요. 답을 고른 뒤 풀이 탭에서 같은 문제의 그림을 단계별로 확인할 수 있어요.' : '문제의 조건은 그대로 유지됩니다. 단계 버튼으로 대응각, 보조선, 계산을 차례로 확인하세요.';
          if (C.problem) v.status = { tone: 'info', text: '먼저 문제를 풀어 보세요' };
          else { const n = solutionOf(DD, s).steps.length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `현재 문제 풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        if (b.thumb) C.step = 99;
        const M = modelFor(s);
        C.t = A ? (C.lesson || C.tab === 'explore' || b.thumb ? (s[A.key] || 0) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : 1)) : 1;
        drawResolved(b, () => {
          if (C.lesson) {
            const solution = solutionOf(DD, s);
            const custom = DD.lessonDraw ? DD.lessonDraw(b, s, M, C, solution) : false;
            if (custom === false) {
              if (s.smLessonProblem) {
                const stage = C.entry ? 1 : C.answer ? solution.steps.length : Math.max(1, Math.min(C.step, solution.steps.length - 1));
                window.APL_SM.drawSolution(b, DD, s, M, { ...C, step: stage }, solution);
              } else DD.draw(b, s, M, C);
            }
            if (DD.lessonAfterDraw) DD.lessonAfterDraw(b, s, M, C, solution);
          } else if (C.review) window.APL_SM.drawSolution(b, DD, s, M, C, solutionOf(DD, s));
          else D.draw(b, s, M, C);
        });
      }
    };
  }

  function register(order, id, title, short, params, scenes) {
    (window.APL_SM_GROUPS = window.APL_SM_GROUPS || []).push({ order, id, title, short, params, scenes: scenes.map(makeScene) });
  }
  const notes = (...li) => `<ul class="sm-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  window.APL_SM = {
    PI, DEG, clamp, ease, seg01, NUM, LET, esc, r1, isInt, fmtN, dg, tx, texDeg, ol, gcd, fr, frT, cm, cm2, cm3, josa,
    pt, add, sub, mul, len, dist, unit, mid, lerp, polar, rotP, angBetween, cross, inter, polyArea, centroid, bboxOf, unionBox, shiftPts, scalePts, triTop,
    seeded, shuffle, ri, rpick, textW, phone, capSize, T, tagOut, vtx, sideTag, dim, ang, tick, par, fillPoly, line, poly, fit, extend, P, degF, cmF,
    mkChoices, mkTextChoices, mkRatioChoices, baseCtx, showAt, makeScene, register, notes, rd, labelMetrics
  };
})();
