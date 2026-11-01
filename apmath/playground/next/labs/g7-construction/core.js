/* ==========================================================================
   중1 · 작도와 합동 — 공용 도구 (core.js)
   - 여섯 개 탭 모듈(t1~t6.js)이 함께 쓰는 작은 도구 모음입니다. 전역은 APL_CN(도구)와 APL_CN_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구(조절·움직임·실시간 값) → 정리(교과서 해결 전략 순서, 단계마다 그림이 강조) → 문제(5지선다 + 숫자 바꾸기).
   - 색의 역할(이 실험실 전체): 하늘 = 주어진 각·변 · 분홍 = 구하는 각 x · 노랑 = 끌 수 있는 점·같은 길이 눈금 · 초록 = 완성한 선·합동/평행 · 기본 = 도형의 변.
   - 같은 크기의 각은 같은 표시(호 1개, 2개, 3개), 직각은 네모, 같은 길이는 눈금, 평행선은 화살표.
   - 움직임은 가로 이동만(세로 이동 없음). 제자리 회전·뒤집기·서서히 나타남은 허용. 작도는 학생이 호를 끌지 않고 단계 플레이어로 봅니다.
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
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    return { tab, problem, review, step: review ? s.step || 0 : 99, txt: !thumb, thumb: !!thumb, full: tab === 'explore' || thumb };
  }
  const showAt = (C, n) => C.step >= n;

  /* ------------------------------------------------------------------ 문제 탭 (보기 5개 · 숫자 바꾸기) */
  function problemHTML(D, s) {
    const M = D.model(s), Q = D.prob(M, s);
    const key = D.id + '|' + Q.key + '|' + (s.cnSeed || 0);
    const pk = s.cnPick && s.cnPick.key === key ? s.cnPick : null;
    let h = Q.html ? `<div class="cn-q">${Q.html}</div>` : `<div class="cn-q">${esc(Q.stem).replace(/&amp;/g, '&')}</div>`;
    h += '<div class="cn-choices' + (Q.wide ? ' wide' : '') + '">';
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="cn-ch${cls}" data-cn-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.h != null ? o.h : '$' + o.t + '$'}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="cn-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="cn-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 계산해 보세요.')}</div>`;
    }
    h += `<div class="cn-tools"><button type="button" class="apl-btn sm" data-cn-new>숫자 바꾸기</button>${Q.note ? `<span class="cn-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const Q = D.prob(D.model(s), s), i = Q.choices.findIndex((o) => o.ok);
    const o = Q.choices[i];
    return `${NUM[i]} ${o.h != null ? o.h : '$' + o.t + '$'}`;
  }

  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.cnBound) return;
    root.dataset.cnBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-cn-pick],[data-cn-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.cn) return;
      const D = sc.cn, s = lab.s;
      if (hit.hasAttribute('data-cn-new')) {
        D.reroll(s);
        s.cnSeed = (s.cnSeed || 0) + 1; s.cnPick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-cn-pick'), 10);
      const Q = D.prob(D.model(s), s);
      s.cnPick = { key: D.id + '|' + Q.key + '|' + (s.cnSeed || 0), idx };
      if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('cn-css')) return;
    const st = document.createElement('style');
    st.id = 'cn-css';
    st.textContent = `
.cn-q{font-size:var(--fs-md);line-height:1.85}
.cn-q ol,.cn-q ul{margin:8px 0 0;padding-left:0;list-style:none;display:grid;gap:3px}
.cn-q li{line-height:1.6}
.cn-q li b{color:var(--m-amber);margin-right:4px}
.cn-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:12px 0 4px}
.cn-choices.wide{grid-template-columns:1fr}
.cn-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.cn-ch:hover{background:var(--hover)}
.cn-ch .n{color:var(--m-amber);flex:none}
.cn-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.cn-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.cn-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.cn-fb.ok{border-left-color:var(--m-green)}
.cn-fb.bad{border-left-color:var(--m-red)}
.cn-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.cn-note{font-size:var(--fs-xs);color:var(--text-3)}
.cn-notes{margin:0;padding-left:18px;display:grid;gap:4px}`;
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
    return {
      id: D.id, title: D.title, short: D.short || D.title, cn: D,
      question: D.question,
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl),
      presets: (s) => (D.presets ? D.presets(s) : []),
      actions,
      steps: (s) => D.steps(D.model(s)).map((t) => texSafe(String(t).replace(/<\/?b>/g, ''))),
      notesTitle: '자주 틀리는 부분',
      problem: D.prob ? {
        tag: (s) => D.prob(D.model(s), s).tag,
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(D, s)
      } : undefined,
      enter: (s, lab) => {
        D.init(s);
        s.cnSeed = 0; s.cnPick = null; s.playing = false;
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
        ['formula', 'rule', 'notes', 'guide'].forEach((k) => { if (typeof v[k] === 'string') v[k] = texSafe(v[k]); });
        if (C.tab === 'problem') v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' };
        else if (C.tab === 'review') { const n = D.steps(M).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        if (b.thumb) C.step = 99;
        const M = D.model(s);
        C.t = A ? (C.tab === 'explore' || b.thumb ? (s[A.key] || 0) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : 1)) : 1;
        D.draw(b, s, M, C);
      }
    };
  }

  function register(order, id, title, short, params, scenes) {
    (window.APL_CN_GROUPS = window.APL_CN_GROUPS || []).push({ order, id, title, short, params, scenes: scenes.map(makeScene) });
  }
  const notes = (...li) => `<ul class="cn-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  window.APL_CN = {
    PI, DEG, clamp, ease, seg01, NUM, LET, esc, r1, isInt, fmtN, dg, eqs, tx, texDeg, ol,
    pt, add, sub, mul, len, dist, unit, mid, lerp, polar, dirDeg, rotP, angBetween, cross, inter, polyArea, centroid, pick, rint, bboxOf, unionBox, shiftPts,
    triSSS, triSAS, triASA, sidesOf, anglesOf, sameTri,
    textW, T, tagOut, vtx, sideTag, lenTag, ang, tick, par, fillPoly, line, poly, arcPart, drawTri, fit, P, degF, cmF,
    josa, seeded, shuffle, mkChoices, mkTextChoices, baseCtx, showAt, makeScene, register, notes, rd
  };
})();
