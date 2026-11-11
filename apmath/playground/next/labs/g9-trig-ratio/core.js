/* ==========================================================================
   중3 · 삼각비 — 공용 도구 (core.js)
   - 여덟 개 탭 모듈(t1~t8.js)이 함께 쓰는 도구 모음입니다. 전역은 APL_TG(도구)와 APL_TG_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구(조절·움직임·실시간 값) → 정리(교과서 해결 전략 순서, 단계마다 그림이 강조) → 문제(5지선다 + 숫자 바꾸기).
   - 색의 역할(이 실험실 전체): 분홍 = 대변(기준각의 맞은편) · 하늘 = 이웃변·주어진 값 · 초록 = 빗변·결과 · 노랑 = 구하는 값 x·끌 수 있는 점 · 보라 = 보조선 · 기본 = 도형의 변.
   - 같은 크기의 각은 같은 표시, 직각은 네모, 같은 길이는 눈금.
   - 움직임은 가로 이동만(세로 이동 없음). 제자리 회전·접기·서서히 나타남은 허용.
   - 수는 정확한 값(√·분수)으로 계산합니다(수 엔진 V). 특수각이 아닌 각은 소수(≈)로 나타냅니다.
   - 도형 좌표계: figure (y 아래쪽). 각도는 화면 기준(시계 방향이 +).
   ========================================================================== */
(function () {
  'use strict';
  const PI = Math.PI, DEG = PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const NUM = ['①', '②', '③', '④', '⑤'];
  const LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (list, cur) => { const pool = cur === undefined ? list : list.filter((x) => JSON.stringify(x) !== JSON.stringify(cur)); const p = pool.length ? pool : list; return p[Math.floor(Math.random() * p.length)]; };
  const sample = (list, n) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };

  /* ====================================================================== 수 엔진 (정확한 값) */
  // 유리수 {n,d}, 수 X = { 제곱 없는 자연수 m : 유리수 계수 } (m=1 이 유리수 부분), 값 V = { x: X 또는 null(근삿값), v: 실수 }
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
  const fadd = (p, q) => fr(p.n * q.d + q.n * p.d, p.d * q.d);
  const fmul = (p, q) => fr(p.n * q.n, p.d * q.d);
  const sqf = (n) => { let k = 1, m = n; for (let f = 2; f * f <= m; f++) { while (m % (f * f) === 0) { m /= f * f; k *= f; } } return [k, m]; };
  const xClean = (x) => { const o = {}; for (const k in x) if (x[k].n !== 0) o[k] = x[k]; return o; };
  const xQ = (n, d = 1) => xClean({ 1: fr(n, d) });
  const xS = (n) => { if (n <= 0) return {}; const [k, m] = sqf(n); return { [m]: fr(k) }; };
  const xAdd = (x, y) => { const o = { ...x }; for (const k in y) o[k] = o[k] ? fadd(o[k], y[k]) : y[k]; return xClean(o); };
  const xScale = (x, f) => { const o = {}; for (const k in x) o[k] = fmul(x[k], f); return xClean(o); };
  const xMul = (x, y) => {
    const o = {};
    for (const a in x) for (const b in y) {
      const A = +a, B = +b, g = gcd(A, B), m = (A * B) / (g * g), c = fmul(fmul(x[a], y[b]), fr(g));
      o[m] = o[m] ? fadd(o[m], c) : c;
    }
    return xClean(o);
  };
  const xInv = (x) => {
    const ks = Object.keys(x).map(Number);
    if (ks.length === 1) { const m = ks[0], c = x[m]; return { [m]: fr(c.d, c.n * m) }; }
    if (ks.length === 2 && ks.includes(1)) {
      const m = ks.find((k) => k !== 1), a = x[1], b = x[m];
      const den = fadd(fmul(a, a), fmul(fmul(b, b), fr(-m)));
      if (den.n === 0) return null;
      return xClean({ 1: fmul(a, fr(den.d, den.n)), [m]: fmul(fmul(b, fr(-1)), fr(den.d, den.n)) });
    }
    return null;
  };
  const xVal = (x) => { let s = 0; for (const k in x) s += (x[k].n / x[k].d) * Math.sqrt(+k); return s; };
  const xRational = (x) => Object.keys(x).every((k) => k === '1');
  function texX(x, sqrt = '\\sqrt') {
    const keys = Object.keys(x).map(Number);
    if (!keys.length) return '0';
    let D = 1; keys.forEach((k) => { D = (D / gcd(D, x[k].d)) * x[k].d; });
    const nums = {}; keys.forEach((k) => { nums[k] = (x[k].n * D) / x[k].d; });
    let g = D; keys.forEach((k) => { g = gcd(g, nums[k]); });
    const dd = D / g; keys.forEach((k) => { nums[k] /= g; });
    // 양수 항 먼저, 같은 부호끼리는 유리수 → 작은 근호 순
    keys.sort((a, b) => (nums[b] > 0) - (nums[a] > 0) || a - b);
    const lone = keys.length === 1;
    let body = '';
    keys.forEach((k, i) => {
      const c = nums[k], neg = c < 0, ac = Math.abs(c);
      let t;
      if (k === 1) t = String(ac);
      else {
        const r = sqrt === '\\sqrt' ? `\\sqrt{${k}}` : `√${k}`;
        t = (ac === 1 ? '' : String(ac)) + r;
      }
      if (i === 0) body += (neg && !lone ? '-' : '') + t; else body += (neg ? '-' : '+') + t;
    });
    const sign = lone && nums[keys[0]] < 0 ? '-' : '';
    return sign + (dd === 1 ? body : `\\frac{${body}}{${dd}}`);
  }
  const mkV = (x, v) => ({ x, v: v == null ? xVal(x) : v });
  const vi = (n, d = 1) => mkV(xQ(n, d));
  const vsq = (n) => mkV(xS(n));
  const vf = (v) => ({ x: null, v });
  const vnum = (n) => (Number.isInteger(n) ? vi(n) : vf(n));
  const vadd = (a, b) => ({ x: a.x && b.x ? xAdd(a.x, b.x) : null, v: a.v + b.v });
  const vneg = (a) => ({ x: a.x ? xScale(a.x, fr(-1)) : null, v: -a.v });
  const vsub = (a, b) => vadd(a, vneg(b));
  const vmul = (a, b) => ({ x: a.x && b.x ? xMul(a.x, b.x) : null, v: a.v * b.v });
  const vdiv = (a, b) => { let x = null; if (a.x && b.x) { const iv = xInv(b.x); if (iv) x = xMul(a.x, iv); } return { x, v: a.v / b.v }; };
  const vscale = (a, n, d = 1) => vmul(a, vi(n, d));
  const vsqrt = (a) => {
    if (a.x && xRational(a.x) && a.x[1] && a.x[1].n > 0) { const p = a.x[1].n, q = a.x[1].d; return { x: xMul(xS(p * q), xQ(1, q)), v: Math.sqrt(a.v) }; }
    if (a.x && !Object.keys(a.x).length) return vi(0);
    return vf(Math.sqrt(Math.max(0, a.v)));
  };
  const vpow2 = (a) => vmul(a, a);
  const vsame = (a, b) => Math.abs(a.v - b.v) < 1e-9 * Math.max(1, Math.abs(a.v));
  const vrat = (a) => !!(a.x && xRational(a.x));
  const vint = (a) => vrat(a) && a.x[1] && a.x[1].d === 1;
  // 소수 서식(끝의 0 은 떼어 냄)
  const decS = (v, dp = 2) => { let t = (Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp); if (t.indexOf('.') >= 0) t = t.replace(/0+$/, '').replace(/\.$/, ''); return t === '-0' ? '0' : t; };
  // TeX 로: 정확한 값이면 √·분수, 아니면 소수
  const vtex = (a, dp = 2) => (a.x ? texX(a.x) : decS(a.v, dp));
  // 캔버스 글자로(√ 글자, 분수는 \frac{…}{…} 그대로)
  const vcan = (a, dp = 2) => (a.x ? texX(a.x, 'plain').replace(/-/g, '−') : decS(a.v, dp).replace('-', '−'));
  const veq = (a) => (a.x ? '=' : '≈');
  const veqT = (a) => (a.x ? '=' : '\\approx');
  const vplain = (a, dp = 2) => (a.x ? texX(a.x, 'plain') : decS(a.v, dp)).replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$2분의 $1').replace(/-/g, '마이너스 ');

  // 삼각비의 값(특수각은 정확한 값, 아니면 근삿값). d: 도(0~180)
  const S2 = vi(1, 2);
  const SPEC = {};
  const mk3 = (s, c, t) => ({ s, c, t });
  SPEC[0] = mk3(vi(0), vi(1), vi(0));
  SPEC[15] = mk3(mkV(xAdd(xScale(xS(6), fr(1, 4)), xScale(xS(2), fr(-1, 4)))), mkV(xAdd(xScale(xS(6), fr(1, 4)), xScale(xS(2), fr(1, 4)))), mkV(xAdd(xQ(2), xScale(xS(3), fr(-1)))));
  SPEC[30] = mk3(S2, mkV(xScale(xS(3), fr(1, 2))), mkV(xScale(xS(3), fr(1, 3))));
  SPEC[45] = mk3(mkV(xScale(xS(2), fr(1, 2))), mkV(xScale(xS(2), fr(1, 2))), vi(1));
  SPEC[60] = mk3(mkV(xScale(xS(3), fr(1, 2))), S2, vsq(3));
  SPEC[75] = mk3(SPEC[15].c, SPEC[15].s, mkV(xAdd(xQ(2), xS(3))));
  SPEC[90] = mk3(vi(1), vi(0), null);
  function trig(fn, d) {
    d = Math.round(d * 1e6) / 1e6;
    if (d > 90 && d < 180) { const r = trig(fn, 180 - d); return fn === 's' ? r : r ? vneg(r) : null; }
    if (d === 180) return fn === 's' ? vi(0) : fn === 'c' ? vi(-1) : vi(0);
    if (SPEC[d]) return SPEC[d][fn];
    const t = d * DEG, v = fn === 's' ? Math.sin(t) : fn === 'c' ? Math.cos(t) : Math.tan(t);
    return vf(v);
  }
  const sinD = (d) => trig('s', d), cosD = (d) => trig('c', d), tanD = (d) => trig('t', d), tanS = (d) => trig('t', d) || vi(0);
  const isSpec = (d) => [0, 15, 30, 45, 60, 75, 90].includes(d);
  // 삼각비의 표(소수 넷째 자리)
  const tbl = (fn, d) => { const t = d * DEG; const v = fn === 's' ? Math.sin(t) : fn === 'c' ? Math.cos(t) : Math.tan(t); return Math.round(v * 1e4) / 1e4; };
  const d4 = (v) => v.toFixed(4);

  /* ====================================================================== 숫자 서식(각·길이) */
  const r1 = (v) => Math.round(v * 10) / 10;
  const fmtN = (v) => { const x = r1(v); return (Number.isInteger(x) ? String(x) : x.toFixed(1)).replace('-', '−'); };
  const dg = (v) => fmtN(v) + '°';
  const tx = (v) => fmtN(v).replace('−', '-');
  const texDeg = (v) => tx(v) + '^{\\circ}';
  const ol = (s) => `\\overline{${s}}`;

  /* ====================================================================== 기하 (figure: y 아래쪽) */
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
  const angBetween = (V0, A, B) => { const u = sub(A, V0), w = sub(B, V0); return Math.acos(clamp((u.x * w.x + u.y * w.y) / (len(u) * len(w) || 1), -1, 1)) / DEG; };
  const cross = (a, b) => a.x * b.y - a.y * b.x;
  function inter(P, Q, R, S) { const d1 = sub(Q, P), d2 = sub(S, R), den = cross(d1, d2); if (Math.abs(den) < 1e-12) return null; const t = cross(sub(R, P), d2) / den; return { x: P.x + d1.x * t, y: P.y + d1.y * t }; }
  const projOn = (p, a, b) => { const d = sub(b, a), l2 = d.x * d.x + d.y * d.y || 1, t = ((p.x - a.x) * d.x + (p.y - a.y) * d.y) / l2; return { x: a.x + d.x * t, y: a.y + d.y * t }; };
  const polyArea = (P) => P.reduce((a, p, i) => a + cross(p, P[(i + 1) % P.length]), 0) / 2;
  const centroid = (P) => ({ x: P.reduce((a, p) => a + p.x, 0) / P.length, y: P.reduce((a, p) => a + p.y, 0) / P.length });
  const bboxOf = (pts, padv = 0) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }); return { x0: x0 - padv, y0: y0 - padv, x1: x1 + padv, y1: y1 + padv }; };
  const shift = (P, dx, dy = 0) => P.map((p) => pt(p.x + dx, p.y + dy));

  const G_STATE = { problem: false };
  /* ====================================================================== 그리기 도우미 */
  const textW = (t, size) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size * 1.0 : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };
  // 분수(\frac{…}{…})가 들어간 글의 가로 폭 어림
  const textW2 = (t, size) => textW(String(t).replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, d) => (a.length > d.length ? a : d) + ' '), size);
  // A displaced short-side label can sit beyond a vertex name. Keep its real
  // anchor and label fixed, and take a short orthogonal route through free space.
  // T's measured boxes already include the 4px text halo; add stroke clearance.
  function leaderPastNames(b, anchor, box, boxes, o) {
    const obstacles = boxes.map(q => ({ ...q, x0: q.x0 - 1, x1: q.x1 + 1, y0: q.y0 - 1, y1: q.y1 + 1 }));
    const intersects = (a, z, q) => {
      let lo = 0, hi = 1;
      for (const [v, d, min, max] of [[a.x, z.x - a.x, q.x0, q.x1], [a.y, z.y - a.y, q.y0, q.y1]]) {
        if (Math.abs(d) < 1e-9) { if (v < min || v > max) return false; }
        else { const t0 = (min - v) / d, t1 = (max - v) / d; lo = Math.max(lo, Math.min(t0, t1)); hi = Math.min(hi, Math.max(t0, t1)); if (lo > hi) return false; }
      }
      return true;
    };
    // Same box-edge stop as Board.leader, including its 4px label gap.
    const endFrom = a => {
      const dx = a.x - box.x, dy = a.y - box.y, L = Math.hypot(dx, dy);
      if (L < 1 || (Math.abs(dx) <= box.width / 2 && Math.abs(dy) <= box.height / 2)) return null;
      const edge = Math.min(Math.abs(dx) > 1e-9 ? box.width / (2 * Math.abs(dx)) : Infinity, Math.abs(dy) > 1e-9 ? box.height / (2 * Math.abs(dy)) : Infinity), stop = edge * L + 4;
      return L > stop + 1 ? { x: box.x + dx * stop / L, y: box.y + dy * stop / L } : null;
    };
    const end = endFrom(anchor);
    if (!end || !obstacles.some(q => /^[A-Z]$/.test(q.s) && intersects(anchor, end, q))) return false;
    // Do not turn the callout into an extension through a side's endpoint dot.
    for (const p of o.points) { const s = b.toS(b._P(p)); obstacles.push({ x0: s.x - 6, x1: s.x + 6, y0: s.y - 6, y1: s.y + 6 }); }
    const routes = [];
    const addRoute = corners => {
      const end = endFrom(corners[corners.length - 1]);
      if (!end) return;
      const points = [anchor, ...corners, end].filter((p, i, all) => !i || Math.hypot(p.x - all[i - 1].x, p.y - all[i - 1].y) > 1e-6);
      if (points.some(p => p.x < 1 || p.x > b.W - 1 || p.y < 1 || p.y > b.H - 1)) return;
      if (points.some((p, i) => i && obstacles.some(q => intersects(points[i - 1], p, q)))) return;
      routes.push({ points, length: points.reduce((sum, p, i) => sum + (i ? Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) : 0), 0) });
    };
    const gaps = (low, high) => {
      const edges = [...new Set(obstacles.flatMap(q => [q[low], q[high]]))].sort((a, z) => a - z);
      return [...obstacles.flatMap(q => [q[low] - 1, q[high] + 1]), ...edges.slice(1).map((v, i) => (edges[i] + v) / 2)];
    };
    // Start outward from the measured side; the short initial adjustment only
    // reaches a free corridor between the existing labels.
    if (o.normal.x) for (const y of [anchor.y, ...gaps('y0', 'y1')]) addRoute([{ x: anchor.x, y }, { x: box.x, y }]);
    if (o.normal.y) for (const x of [anchor.x, ...gaps('x0', 'x1')]) addRoute([{ x, y: anchor.y }, { x, y: box.y }]);
    const route = routes.sort((a, z) => a.length - z.length)[0];
    if (!route) return false; // Retain the visible original if no clear route exists.
    b.path(route.points.map(p => b.toW(p.x, p.y)), { color: 'muted', width: 1.15, alpha: o.alpha, dash: [], glow: false, ref: o.ref });
    return true;
  }
  function T(b, p, str, o = {}) {
    if (str == null || str === '' || (o.alpha != null && o.alpha <= 0)) return;
    str = String(str).replace(/=\s*≈\s*/g, '≈ '); // "h = ≈4.6" 처럼 기호가 겹치지 않게
    let dx = o.dx || 0, dy = o.dy || 0, labelBox;
    // 글자가 무대 밖으로 나가거나 다른 글자와 겹치면 가까운 빈 곳으로 밀어 놓는다(휴대폰에서 잘림·겹침 방지)
    if (!b.thumb && b.W && b.toS && b._P) {
      try {
        const sp = b.toS(b._P(p)), size = o.size || 16, k = (b.fs || 1) * (b._ts ? b._ts() : 1), al = o.align || 'center';
        let w = textW2(str, size) * k, h = size * k * 1.1;
        // Match the board's actual stacked-fraction metrics. A fraction is taller
        // than one text line; multiplying the entire label width by .66 hid overlaps.
        if (b.ctx && b._fracSplit) {
          const c = b.ctx, px = size * k, segs = b._fracSplit(str);
          c.save(); c.font = `800 ${px}px ${b.font}`;
          if (segs) {
            const fs = Math.max(px * 0.72, Math.min(px * 0.9, 9.5));
            w = segs.reduce((sum, part) => {
              c.font = `800 ${part.t !== undefined ? px : fs}px ${b.font}`;
              return sum + (part.t !== undefined ? c.measureText(part.t).width : Math.max(c.measureText(part.n).width, c.measureText(part.d).width) + fs * 0.34);
            }, 0);
            h = Math.max(h, fs * 2.3);
          } else w = c.measureText(str).width;
          c.restore();
        }
        w += 4; h += 4;
        const ax = al === 'center' ? -w / 2 : al === 'right' || al === 'end' ? -w : 0;
        const inStage = (x, y) => x + ax >= 4 && x + ax + w <= b.W - 4 && y - h / 2 >= 3 && y + h / 2 <= b.H - 3;
        let x = sp.x + dx, y = sp.y + dy;
        if (x + ax < 4) x += 4 - (x + ax); else if (x + ax + w > b.W - 4) x -= x + ax + w - (b.W - 4);
        if (y - h / 2 < 3) y += 3 - (y - h / 2); else if (y + h / 2 > b.H - 3) y -= y + h / 2 - (b.H - 3);
        const boxes = b._tgBoxes || (b._tgBoxes = []);
        const hit = (xx, yy) => boxes.find((q) => { const ox = Math.min(xx + ax + w, q.x1) - Math.max(xx + ax, q.x0), oy = Math.min(yy + h / 2, q.y1) - Math.max(yy - h / 2, q.y0); return ox > -2 && oy > 0 && !(q.s === str && Math.abs(q.x0 - (xx + ax)) < 1 && Math.abs(q.y0 - (yy - h / 2)) < 1); });
        for (let it = 0; it < 6; it++) {
          const q = hit(x, y);
          if (!q) break;
          const cand = [{ x, y: q.y1 + h / 2 + 2 }, { x, y: q.y0 - h / 2 - 2 }, { x: q.x1 - ax + 2, y }, { x: q.x0 - ax - w - 2, y }]
            .filter((c) => inStage(c.x, c.y) && !hit(c.x, c.y)).sort((u, v) => Math.hypot(u.x - x, u.y - y) - Math.hypot(v.x - x, v.y - y));
          if (!cand.length) break;
          x = cand[0].x; y = cand[0].y;
        }
        dx = x - sp.x; dy = y - sp.y;
        labelBox = { x: x + ax + w / 2, y, width: w, height: h };
        boxes.push({ x0: x + ax, x1: x + ax + w, y0: y - h / 2, y1: y + h / 2, s: str });
      } catch (e) { /* 보정 없이 그린다 */ }
    }
    // Keep the geometric target when collision avoidance moves the label.
    if (!b.thumb && o.leaderAnchor && b.leader && (o.leader || Math.hypot(dx - (o.dx || 0), dy - (o.dy || 0)) > 10)) {
      const sp = b.toS(b._P(p)), box = labelBox || { x: sp.x + dx, y: sp.y + dy, ...b.annotationSize(str, { size: o.size || 16, weight: 800 }) };
      const anchor = b.toS(b._P(o.leaderAnchor)), options = { px: true, width: box.width, height: box.height, alpha: o.alpha == null ? .72 : o.alpha, ref: o.ref };
      if (!(b._tgRouteLeaderNames && o.leaderNormal && labelBox && b.toW && b.path && leaderPastNames(b, anchor, box, b._tgBoxes.slice(0, -1), { ...options, normal: o.leaderNormal, points: o.leaderPoints }))) b.leader(anchor, box, options);
    }
    b.text(p, str, { dx, dy, color: o.color || 'ink', size: o.size || 16, weight: 800, align: o.align || 'center', baseline: 'middle', alpha: o.alpha, ref: o.ref });
  }
  function tagOut(b, p, c, str, o = {}) {
    const u = unit(sub(p, c)), size = o.size || 17, w = textW2(str, size), g = o.gap == null ? 12 : o.gap;
    const d = Math.abs(u.x) * (w / 2) + Math.abs(u.y) * size * 0.55 + g;
    T(b, p, str, { ...o, size, dx: u.x * d, dy: u.y * d, leaderAnchor: p });
  }
  function vtx(b, p, c, name, o = {}) {
    b.point(p, { color: o.color || 'ink', r: o.r || 4.5 });
    if (name) tagOut(b, p, c, name, { size: o.size || 17, gap: o.gap == null ? 11 : o.gap, color: o.nameColor || 'ink' });
  }
  // 변 pq 의 바깥쪽(c 의 반대쪽)에 글자
  function sideTag(b, p, q, c, str, o = {}) {
    const m = mid(p, q), size = o.size || 16;
    let n = unit({ x: -(q.y - p.y), y: q.x - p.x });
    if (n.x * (m.x - c.x) + n.y * (m.y - c.y) < 0) n = mul(n, -1);
    if (o.flip) n = mul(n, -1);
    if (o.curve && b.curveDim && !b.thumb) {
      // Let the unit's collision layout place the label, retaining the curve anchor.
      const original = b.text;
      b.text = (at, value, options) => { b.text = original; try { return T(b, at, value, { ...options, leaderNormal: n, leaderPoints: [p, q] }); } finally { b.text = original; } };
      try { b.curveDim(p, q, str, { side: n, size, weight: 800, color: o.color || 'ink', alpha: o.alpha, ref: o.ref, gap: 5 }); }
      finally { b.text = original; }
      return;
    }
    const w = textW2(str, size), g = o.gap == null ? 12 : o.gap;
    const d = Math.abs(n.x) * (w / 2) + Math.abs(n.y) * size * 0.55 + g;
    const anchor = lerp(p, q, o.f == null ? 0.5 : o.f);
    T(b, anchor, str, { color: o.color || 'ink', size, dx: n.x * d + (o.dx || 0), dy: n.y * d + (o.dy || 0), alpha: o.alpha, leaderAnchor: anchor });
  }
  /* 각 표시: 꼭짓점 V 에서 반직선 VA → VB 방향의 작은 각. rings = 호 개수(같은 각은 같은 개수). 직각이면 네모. */
  function ang(b, V0, A, B, o = {}) {
    const k = b.k || 60, r = (o.r || 28) * (b.thumb ? 0.7 : 1);
    const a0 = Math.atan2(A.y - V0.y, A.x - V0.x), a1 = Math.atan2(B.y - V0.y, B.x - V0.x);
    let d = ((a1 - a0 + PI * 3) % (PI * 2)) - PI;
    if (o.big) d = d > 0 ? d - PI * 2 : d + PI * 2;
    const deg = Math.abs(d) / DEG, col = o.color || 'sky', am = a0 + d / 2, rw = r / k;
    if (!o.noMark) {
      if (!o.big && Math.abs(deg - 90) < 0.6 && !o.noRight) b.right(V0, A, B, { size: Math.min(r * 0.62, 17), color: col });
      else {
        b.arc(V0, rw, a0, a0 + d, { sector: true, fill: col, fillAlpha: o.fa == null ? 0.2 : o.fa, color: null, ccw: d < 0 });
        const rings = o.rings || 1;
        b.arc(V0, rw, a0, a0 + d, { color: col, width: 2.4, ccw: d < 0 });
        for (let i = 1; i < rings; i++) b.arc(V0, rw - (i * 4.6) / k, a0, a0 + d, { color: col, width: 2.2, ccw: d < 0 });
      }
    }
    if (o.label) {
      const size = o.size || 16;
      const need = (textW2(o.label, size) / 2 + 5) / Math.max(0.2, Math.sin(clamp(Math.abs(d) / 2, 0.12, 1.5)));
      const dst = o.labelDist != null ? o.labelDist : Math.max(r + 14, Math.min(need, r + 70));
      const la = am + (o.labelRot || 0) * DEG;
      // Keep the continuous angle-bisector placement. Only an explicit rotation
      // outside the angle needs a callout before collision avoidance moves it.
      const turn = (((d < 0 ? -1 : 1) * (la - a0)) % (PI * 2) + PI * 2) % (PI * 2);
      const outside = o.labelRot != null && turn > Math.abs(d) + 1e-6;
      const square = !o.big && Math.abs(deg - 90) < .6 && !o.noRight, corner = Math.min(r * .62, 17) / k;
      const anchor = square ? add(V0, add(mul(unit(sub(A, V0)), corner), mul(unit(sub(B, V0)), corner))) : pt(V0.x + Math.cos(am) * rw, V0.y + Math.sin(am) * rw);
      T(b, V0, o.label, { dx: Math.cos(la) * dst, dy: Math.sin(la) * dst, color: o.labelColor || col, size, alpha: o.alpha, leaderAnchor: o.noMark ? null : anchor, leader: outside });
    }
    return { deg, mid: am };
  }
  const tick = (b, p, q, count = 1, color = 'amber') => b.ticks(p, q, { color, count, size: 7 });
  const fillPoly = (b, pts, color, alpha = 0.18) => b.path(pts, { close: true, fill: color, fillAlpha: alpha, color: null });
  const line = (b, p, q, color = 'ink', width = 3, o = {}) => b.path([p, q], { color, width, dash: o.dash, alpha: o.alpha });
  const poly = (b, pts, color = 'ink', width = 3.2, o = {}) => b.path(pts, { close: true, color, width, dash: o.dash, alpha: o.alpha, fill: o.fill, fillAlpha: o.fillAlpha });
  const dashed = [7, 6];
  // 그림 상자를 무대에 꼭 맞춥니다. 라벨 자리는 화면 픽셀(pad)로 따로 줍니다.
  function fit(b, box, o = {}) {
    const narrow = b.W < 560;
    const aw = Math.max(10, b.W - b.insets.left - b.insets.right), ah = Math.max(10, b.H - b.insets.top - b.insets.bottom);
    const pp = b.pad * Math.min(aw, ah), W = aw - 2 * pp, H = ah - 2 * pp;
    const base = b.thumb ? 5 : narrow ? 34 : 52;
    const pad = { l: o.l == null ? base : o.l, r: o.r == null ? base : o.r, t: o.t == null ? base : o.t, b: o.b == null ? base : o.b };
    // Keep the desktop question-chip clearance by default. Only an explicitly
    // opted-in compact question may use the space where that chip is absent.
    if (G_STATE.problem && !b.thumb) pad.t = Math.max(pad.t, o.problemTop == null ? 62 : o.problemTop);
    const bw = Math.max(1e-6, box.x1 - box.x0), bh = Math.max(1e-6, box.y1 - box.y0);
    let k = Math.max(3, Math.min((W - pad.l - pad.r) / bw, (H - pad.t - pad.b) / bh));
    if (o.maxK) k = Math.min(k, o.maxK);
    b.focus = { x: [box.x0 - pad.l / k, box.x1 + pad.r / k], y: [box.y0 - pad.t / k, box.y1 + pad.b / k] };
    return b.k;
  }
  // 그림 아래 글줄(서식 줄): 가장 아래 점 yb 에서 화면 픽셀로 내려 놓음
  const rowsBelow = (b, cx, yb, rows, o = {}) => rows.forEach((r, i) => { if (r) T(b, pt(cx, yb), r.t, { dy: (o.dy0 || 40) + i * (o.lh || 28), size: r.size || 17, color: r.c || 'ink' }); });

  /* ---- 직각삼각형 (∠C=90°; A 왼쪽 아래 · C 오른쪽 아래 · B 위) ---- */
  // a=BC(대변), b=CA(이웃변). rot(도, 화면 시계 방향)·mirror 로 놓는 방향을 바꿉니다.
  function rtGeo(a, b, o = {}) {
    let A = pt(0, 0), C = pt(b, 0), B = pt(b, -a);
    if (o.mirror) { A = pt(-A.x, A.y); B = pt(-B.x, B.y); C = pt(-C.x, C.y); }
    const cen = centroid([A, B, C]);
    if (o.rot) { A = rotP(A, cen, o.rot); B = rotP(B, cen, o.rot); C = rotP(C, cen, o.rot); }
    return { A, B, C, cen };
  }
  /* 직각삼각형 하나를 한 번에: spec = { names:{A,B,C}, side:{a:{t,c},b:{},c:{}}, col:{a,b,c}(변 색), angA:{t,c,rings,mark}, angB:{…}, right:bool, ticks }  */
  function drawRT(b, g, spec = {}) {
    const { A, B, C, cen } = g, S = spec;
    if (S.fill) fillPoly(b, [A, B, C], S.fill, S.fa == null ? 0.1 : S.fa);
    const col = S.col || {};
    [[B, C, 'a'], [C, A, 'b'], [A, B, 'c']].forEach(([p, q, k]) => line(b, p, q, col[k] || 'ink', col[k] ? 4 : 3.4));
    if (S.right !== false) ang(b, C, A, B, { color: S.rightColor || 'ink', r: 24 });
    [[A, C, B, 'A'], [B, A, C, 'B']].forEach(([v, p, q, k]) => {
      const a = S['ang' + k]; if (!a) return;
      ang(b, v, p, q, { color: a.c || 'amber', rings: a.rings || 1, label: a.t, r: a.r || 30, labelDist: a.d, noMark: a.noMark, size: a.size || 16 });
    });
    const nm = S.names;
    if (nm) [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p, k]) => { b.point(p, { color: 'ink', r: 4.5 }); if (nm[k]) tagOut(b, p, cen, nm[k], { size: 17, gap: 11 }); });
    else [A, B, C].forEach((p) => b.point(p, { color: 'ink', r: 4.5 }));
    [[B, C, 'a'], [C, A, 'b'], [A, B, 'c']].forEach(([p, q, k]) => {
      const sd = S.side && S.side[k];
      if (sd && sd.t != null && sd.t !== '') sideTag(b, p, q, cen, sd.t, { color: sd.c || col[k] || 'ink', size: sd.size || 17, gap: sd.gap, flip: sd.flip, f: sd.f, curve: sd.curve || S.curveDim });
      const tk = S.ticks && S.ticks[k]; if (tk) tick(b, p, q, tk.n || tk, tk.color || 'amber');
    });
  }
  const rtBox = (g, extra = []) => bboxOf([g.A, g.B, g.C, ...extra]);

  /* ====================================================================== 조절 값 · 선택지 */
  const P = (label, min, max, step, value, o = {}) => ({ value, min, max, step, color: o.color || 'sky', label, hint: o.hint, format: o.format || ((v) => fmtN(v)) });
  const degF = (v) => fmtN(v) + '°';
  const josa = (n, a, b) => ([0, 1, 3, 6, 7, 8].includes(Math.abs(Math.round(n)) % 10) ? a : b);

  function seeded(key) {
    let h = 1779033703 ^ String(key).length;
    for (let i = 0; i < String(key).length; i++) { h = Math.imul(h ^ String(key).charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return function () { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  }
  function shuffle(arr, rnd) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* 5지선다(숫자): correct, wrongs=[[값,힌트]…]. 값은 V 이거나 실수. 모자라면 정답에 간단한 배수를 곱해 채웁니다. 작은 값부터 놓습니다.
     o.fmt(V)→TeX, o.plain(V)→글, o.valid(V)→bool */
  function mkChoicesSorted(correct, wrongs, o = {}) {
    const asV = (x) => (x && typeof x === 'object' ? x : vnum(x));
    const fmt = o.fmt || ((v) => vtex(v)), plain = o.plain || ((v) => (o.suf ? vplain(v) + o.suf : vplain(v))), valid = o.valid || ((v) => v.v > 1e-9);
    const list = [{ v: asV(correct), ok: true, hint: '' }];
    const dupe = (v) => list.some((x) => vsame(x.v, v) || fmt(x.v) === fmt(v));
    for (const w of wrongs) {
      const v = asV(w[0]);
      if (!Number.isFinite(v.v) || !valid(v) || dupe(v) || (!o.fmt && !v.x)) continue; // 소수 보기는 쓰지 않습니다(표 문제만 fmt 를 직접 줍니다)
      list.push({ v, ok: false, hint: w[1] || '' });
      if (list.length === 5) break;
    }
    const fillers = [[2, 1], [1, 2], [3, 2], [2, 3], [3, 1], [1, 3], [4, 3], [3, 4], [5, 4], [4, 5], [5, 2], [2, 5]];
    for (const [n, d] of fillers) {
      if (list.length >= 5) break;
      const v = vscale(asV(correct), n, d);
      if (valid(v) && !dupe(v)) list.push({ v, ok: false, hint: '풀이 순서대로 다시 계산해 보세요.' });
    }
    for (let k = 1; list.length < 5 && k < 60; k++) for (const sg of [1, -1]) { const v = vadd(asV(correct), vi(sg * k)); if (list.length < 5 && valid(v) && !dupe(v)) list.push({ v, ok: false, hint: '풀이 순서대로 다시 계산해 보세요.' }); }
    list.sort((a, b) => a.v.v - b.v.v);
    return list.map((x) => ({ t: fmt(x.v), p: plain(x.v), ok: x.ok, hint: x.hint }));
  }
  // 보기를 값의 크기 순으로 늘어놓되, 정답이 ①~⑤ 어디에나 오도록 정답보다 작은 보기·큰 보기의 개수를 무작위로 정한다.
  function mkChoices(correct, wrongs, o = {}) {
    if (o.noSpread) return mkChoicesSorted(correct, wrongs, o);
    const asV = (x) => (x && typeof x === 'object' ? x : vnum(x));
    const fmt = o.fmt || ((v) => vtex(v)), plain = o.plain || ((v) => (o.suf ? vplain(v) + o.suf : vplain(v))), valid = o.valid || ((v) => v.v > 1e-9);
    const C = asV(correct), pool = [];
    const dupe = (v) => vsame(C, v) || fmt(C) === fmt(v) || pool.some((x) => vsame(x.v, v) || fmt(x.v) === fmt(v));
    const add = (v, hint, strict) => { if (!Number.isFinite(v.v) || !valid(v) || dupe(v)) return; if (strict && o.deg && Math.abs(v.v - Math.round(v.v)) > 1e-9) return; pool.push({ v, ok: false, hint: hint || '' }); };
    for (const w of wrongs) { const v = asV(w[0]); if (!o.fmt && !v.x) continue; add(v, w[1], false); } // 소수 보기는 쓰지 않습니다(표 문제만 fmt 를 직접 줍니다)
    [[2, 1], [1, 2], [3, 2], [2, 3], [3, 1], [1, 3], [4, 3], [3, 4], [5, 4], [4, 5], [5, 2], [2, 5], [3, 5], [5, 3]].forEach(([n, d]) => add(vscale(C, n, d), '풀이 순서대로 다시 계산해 보세요.', true));
    for (let k = 1; k < 40; k++) for (const sg of [1, -1]) add(vadd(C, vi(sg * k)), '풀이 순서대로 다시 계산해 보세요.', true);
    const lo = pool.filter((x) => x.v.v < C.v), hi = pool.filter((x) => x.v.v > C.v);
    const feas = [0, 1, 2, 3, 4].filter((t) => lo.length >= t && hi.length >= 4 - t);
    if (!feas.length) return mkChoicesSorted(correct, wrongs, o);
    const t = feas[Math.floor(Math.random() * feas.length)];
    const list = [{ v: C, ok: true, hint: '' }, ...lo.slice(0, t), ...hi.slice(0, 4 - t)];
    list.sort((a, b) => a.v.v - b.v.v);
    return list.map((x) => ({ t: fmt(x.v), p: plain(x.v), ok: x.ok, hint: x.hint }));
  }
  const degChoices = (correct, wrongs, o = {}) => mkChoices(correct, wrongs, { fmt: (v) => texDeg(v.v), plain: (v) => dg(v.v), deg: true, valid: (v) => v.v > 0 && v.v < ((correct && correct.v != null ? correct.v : correct) > 90 ? 180 : 90), ...o });
  // 글 보기: items=[{h, ok, hint}] 5개를 key 로 안정되게 섞음
  function mkTextChoices(items, key) {
    const list = shuffle(items, seeded('tc|' + key));
    return list.map((x) => ({ h: x.h, p: x.p || String(x.h).replace(/\$/g, '').replace(/\\/g, ''), ok: !!x.ok, hint: x.hint || '' }));
  }
  // 한 문제가 올바른 틀(보기 5개, 정답 하나, 같은 보기 없음)인지 확인합니다(어긋나면 예외 → 즉시 눈에 띔)
  function checkQ(q, work, math) {
    if (!q.choices || q.choices.length !== 5) throw new Error('보기 5개가 아님: ' + q.tag);
    if (q.choices.filter((c) => c.ok).length !== 1) throw new Error('정답이 하나가 아님: ' + q.tag);
    const seen = new Set();
    q.choices.forEach((c) => { const k = c.h != null ? c.h : c.t; if (k == null || String(k).trim() === '' || /undefined|NaN|Infinity/.test(String(k))) throw new Error('나쁜 보기: ' + q.tag); if (seen.has(k)) throw new Error('같은 보기: ' + q.tag); seen.add(k); });
    if (/undefined|NaN/.test(q.stem || q.html || '')) throw new Error('나쁜 발문: ' + q.tag);
    if (work) {
      const answer = q.choices.find((c) => c.ok);
      q.solution = {
        key: q.key,
        steps: [...work, `따라서 정답은 ${answer.h != null ? answer.h : '$' + answer.t + '$'}입니다.`],
        math: math || null
      };
    }
    return q;
  }

  /* ====================================================================== 3D (z 위, 평행투영) */
  const camOf = (s) => { const y = (s.tgYaw == null ? -32 : s.tgYaw) * DEG, p = (s.tgPitch == null ? 22 : s.tgPitch) * DEG; return { cy: Math.cos(y), sy: Math.sin(y), cp: Math.cos(p), sp: Math.sin(p) }; };
  const proj3 = (cam, P3) => { const x1 = P3.x * cam.cy - P3.y * cam.sy, y1 = P3.x * cam.sy + P3.y * cam.cy; return { x: x1, y: -(P3.z * cam.cp + y1 * cam.sp), d: y1 * cam.cp - P3.z * cam.sp }; };
  const faceFront = (cam, n) => { const y1 = n.x * cam.sy + n.y * cam.cy; return y1 * cam.cp - n.z * cam.sp < -1e-9; };
  const p3 = (x, y, z) => ({ x, y, z });
  const orbit = (s, dx, dy) => { s.tgYaw = (s.tgYaw == null ? -32 : s.tgYaw) + dx * 0.5; if (s.tgYaw > 180) s.tgYaw -= 360; if (s.tgYaw < -180) s.tgYaw += 360; s.tgPitch = clamp((s.tgPitch == null ? 22 : s.tgPitch) + dy * 0.4, -8, 80); };
  // 직육면체 모서리(앞·뒤 구분해 점선): 꼭짓점 0~7 = 아래 (0,0,0)(a,0,0)(a,b,0)(0,b,0), 위 같은 순서에 z=c
  function boxVerts(a, b, c) { return [p3(0, 0, 0), p3(a, 0, 0), p3(a, b, 0), p3(0, b, 0), p3(0, 0, c), p3(a, 0, c), p3(a, b, c), p3(0, b, c)]; }
  const BOX_EDGES = [[0, 1, [4, 5]], [1, 2, [1, 3]], [2, 3, [4, 5]], [3, 0, [0, 2]], [4, 5, [4, 5]], [5, 6, [1, 3]], [6, 7, [4, 5]], [7, 4, [0, 2]], [0, 4, [0, 2]], [1, 5, [1, 3]], [2, 6, [1, 3]], [3, 7, [0, 2]]];
  // 각 면 법선: 0=앞(y−), 1=오른(x+), 2=뒤(y+), 3=왼(x−), 4=아래(z−), 5=위(z+)
  const FACE_N = [p3(0, -1, 0), p3(1, 0, 0), p3(0, 1, 0), p3(-1, 0, 0), p3(0, 0, -1), p3(0, 0, 1)];
  const EDGE_FACES = [[0, 4], [1, 4], [2, 4], [3, 4], [0, 5], [1, 5], [2, 5], [3, 5], [3, 0], [0, 1], [1, 2], [2, 3]];
  function drawBox(b, cam, V3, o = {}) {
    const P2 = V3.map((v) => { const q = proj3(cam, v); return pt(q.x, q.y); });
    const fr0 = FACE_N.map((n) => faceFront(cam, n));
    BOX_EDGES.forEach(([i, j], e) => {
      const [f1, f2] = EDGE_FACES[e], hidden = !fr0[f1] && !fr0[f2];
      b.path([P2[i], P2[j]], { color: o.color || 'ink', width: hidden ? 2 : 3, dash: hidden ? [6, 5] : undefined, alpha: hidden ? 0.55 : 1 });
    });
    return P2;
  }

  /* ====================================================================== 장면 상태 (탭·단계) */
  function baseCtx(s, lab, thumb) {
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    const lesson = !thumb && !!(s.lessonOn || s.lessonEntry), entry = lesson && !!s.lessonEntry;
    return { tab, problem, review, step: entry ? 0 : lesson || review ? s.step || 0 : 99,
      txt: !thumb, thumb: !!thumb, full: !lesson && (tab === 'explore' || thumb), lesson, entry,
      answer: lesson && !entry && !!s.tgShowAnswer, calculation: lesson && !entry && !!s.tgCalculationReady };
  }

  /* ====================================================================== 문제 탭 (보기 5개 · 숫자 바꾸기) */
  function problemHTML(D, s) {
    const Q = s.q;
    if (!Q) return '';
    const key = D.id + '|' + Q.key + '|' + (s.tgSeed || 0);
    const pk = s.tgPick && s.tgPick.key === key ? s.tgPick : null;
    let h = `<div class="tg-q">${texSafe(Q.html != null ? Q.html : Q.stem)}</div><div class="tg-choices${Q.wide ? ' wide' : ''}">`;
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="tg-ch${cls}" data-tg-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.h != null ? texSafe(o.h) : '$' + o.t + '$'}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="tg-fb ok"><b>정답이에요!</b> 풀이 탭에서 이 문제의 풀이 과정을 확인해 보세요.</div>' : `<div class="tg-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 계산해 보세요.')}</div>`;
    }
    h += `<div class="tg-tools"><button type="button" class="apl-btn sm" data-tg-new>숫자 바꾸기</button>${Q.note ? `<span class="tg-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(s) {
    const Q = s.q, i = Q.choices.findIndex((o) => o.ok), o = Q.choices[i];
    return `${NUM[i]} ${o.h != null ? texSafe(o.h) : '$' + o.t + '$'}`;
  }
  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.tgBound) return;
    root.dataset.tgBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-tg-pick],[data-tg-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.tg) return;
      const D = sc.tg, s = lab.s;
      if (hit.hasAttribute('data-tg-new')) {
        s.q = D.gen(s.q);
        s.tgSeed = (s.tgSeed || 0) + 1; s.tgPick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-tg-pick'), 10);
      s.tgPick = { key: D.id + '|' + s.q.key + '|' + (s.tgSeed || 0), idx };
      if (s.q.choices[idx] && s.q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('tg-css')) return;
    const st = document.createElement('style');
    st.id = 'tg-css';
    st.textContent = `
.tg-q{font-size:var(--fs-md);line-height:1.85}
.tg-current{padding:12px 14px;margin-bottom:12px;border-left:3px solid var(--m-amber);border-radius:var(--r-md);background:var(--card-2)}
.tg-current b{display:block;margin-bottom:4px;color:var(--m-amber)}
.tg-current .tg-q{font-size:var(--fs-sm)}
.tg-q ol,.tg-q ul{margin:8px 0 0;padding-left:0;list-style:none;display:grid;gap:3px}
.tg-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:12px 0 4px}
.tg-choices.wide{grid-template-columns:1fr}
.tg-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.tg-ch:hover{background:var(--hover)}
.tg-ch .n{color:var(--m-amber);flex:none}
.tg-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.tg-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.tg-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.tg-fb.ok{border-left-color:var(--m-green)}
.tg-fb.bad{border-left-color:var(--m-red)}
.tg-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.tg-note{font-size:var(--fs-xs);color:var(--text-3)}
.tg-notes{margin:0;padding-left:18px;display:grid;gap:4px}
.tg-tt{max-height:210px;overflow:auto;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--card-2)}
.tg-tt table{border-collapse:collapse;width:100%;font-size:var(--fs-sm);font-variant-numeric:tabular-nums}
.tg-tt th,.tg-tt td{padding:3px 8px;text-align:right;border-bottom:1px solid var(--line-2)}
.tg-tt th{position:sticky;top:0;background:var(--card);z-index:1}
.tg-tt tr.hl td{background:color-mix(in srgb,var(--m-amber) 22%,var(--card-2));font-weight:800}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();
  // 삼각비 표에서 지금 행이 보이도록 굴려 줍니다
  function scrollTable() {
    setTimeout(() => { try { document.querySelectorAll('.tg-tt').forEach((w) => { const r = w.querySelector('tr.hl'); if (r) w.scrollTop = Math.max(0, r.offsetTop - w.clientHeight / 2 + 12); }); } catch (e) { /* 굴리기는 덤 */ } }, 30);
  }

  /* ====================================================================== 장면 만들기
     D = { id, title, short, question, ctl:[조절 값 id…], presets?(s), init(s), model(s)→M, draw(b,s,M,C), steps(M)→[글…],
           view(M,C,s)→{guide,readouts,status?,formula?,rule?,notes?,alert?}, gen(prevQ)→q, pdraw(b,q,C),
           anim?:{key,dur,label,start}, stepT?(n,M) }
     q = { tag, stem, choices, key, note?, fig, wide?, html? } — 문제 하나가 그림(fig)·발문·보기를 모두 정해 저장합니다(숫자 바꾸기 한 번에 한 번만 만듦). */
  const texSafe = (t) => String(t == null ? t : t).replace(/\$([^$]+)\$/g, (m, x) => '$' + x.replace(/</g, '\\lt ').replace(/>/g, '\\gt ') + '$');
  const inLesson = (s) => !!(s.lessonOn || s.lessonEntry);
  // Keep the original generator, figure and choice order together. The temporary
  // random stream is synchronous and always restored, including failed searches.
  function fixedQuestion(id, seed = 1, accept = () => true) {
    const scene = (window.APL_TG_GROUPS || []).flatMap(group => group.scenes).find(item => item.id === id);
    if (!scene || !scene.tg || typeof scene.tg.gen !== 'function') throw new Error('해설 원본 장면 없음: ' + id);
    const random = Math.random;
    Math.random = seeded('lesson:' + id + ':' + seed);
    try {
      for (let i = 0; i < 1000; i++) {
        const q = scene.tg.gen();
        if (!accept(q)) continue;
        const seen = new WeakSet();
        const freeze = value => {
          if (!value || typeof value !== 'object' || seen.has(value)) return value;
          seen.add(value);
          Object.values(value).forEach(freeze);
          return Object.freeze(value);
        };
        return freeze(q);
      }
      throw new Error('해설 원본 유형을 찾지 못함: ' + id);
    } finally { Math.random = random; }
  }
  function lessonQuestion(D, s) {
    const M = D.model(s), Q = s.q;
    const custom = D.lessonQuestion && D.lessonQuestion(M, s, Q);
    if (custom != null) return texSafe(custom);
    if (!s.tgLessonProblem) return texSafe(typeof D.question === 'function' ? D.question(s) : D.question);
    let body = Q.html != null ? Q.html : Q.stem || '';
    const choices = (Q.choices || []).map(c => c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p);
    if (choices.length && !choices.every(text => body.includes(String(text)))) body += '<br>' + choices.map((text, i) => NUM[i] + ' ' + text).join('<br>');
    return texSafe(body);
  }
  function makeScene(D) {
    const A = D.anim;
    const actions = A ? () => [
      { id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'), label: (s) => (s.playing ? '일시 정지' : s[A.key] >= 0.999 ? '다시 재생' : A.label || '움직여 보기'), on: (s) => s.playing, run: (s) => { if (s.playing) s.playing = false; else { if (s[A.key] >= 0.999) s[A.key] = 0; s.playing = true; } } },
      { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s[A.key] = 0; } }
    ] : undefined;
    return {
      id: D.id, title: D.title, short: D.short || D.title, tg: D,
      tabs: { order: ['explore', 'problem', 'review'], labels: { review: '풀이' } },
      question: (s) => inLesson(s) ? lessonQuestion(D, s) : (typeof D.question === 'function' ? D.question(s) : D.question),
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl),
      presets: (s) => (D.presets ? D.presets(s) : []),
      actions,
      // 탐구와 문항은 독립 상태다. 풀이에서는 생성된 문항의 조건만 읽는다.
      steps: (s) => s.q.solution.steps.map((t) => texSafe(String(t).replace(/<\/?b>/g, ''))),
      reviewTop: (s) => inLesson(s) ? '' : `<div class="tg-current"><b>지금 푸는 문제</b><div class="tg-q">${texSafe(s.q.html != null ? s.q.html : s.q.stem)}</div></div>`,
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: (s) => (s.q ? s.q.tag : ''),
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(s)
      },
      enter: (s, lab) => {
        D.init(s);
        s.q = D.gen();
        s.tgSeed = 0; s.tgPick = null; s.playing = false; s.step = 1; s.revealed = false;
        if (A) s[A.key] = A.start || 0;
        if (lab) curLab = lab;
      },
      tick: (s, dt, lab) => {
        if (inLesson(s)) return false;
        let again = false;
        if (A && s.playing) { s[A.key] = Math.min(1, (s[A.key] || 0) + dt / (A.dur || 6)); if (s[A.key] >= 1) s.playing = false; again = true; }
        return again;
      },
      view: (s, lab) => {
        if (lab) curLab = lab;
        if (inLesson(s)) return { guide: null, card: null, readouts: [], formula: null, rule: null, status: null, alert: null, notes: [], chips: [] };
        const C = baseCtx(s, lab, false);
        if (C.problem || C.review) {
          const n = s.q.solution.steps.length, st = Math.max(1, Math.min(s.step || 1, n));
          return {
            guide: C.problem ? '현재 문제의 조건을 그림에서 찾아 먼저 풀어 보세요. 풀이 탭에서도 같은 문항이 이어져요.' : '한 단계씩 펼치며 현재 문제의 조건, 보조선, 계산을 연결해 보세요.',
            readouts: [], formula: '', rule: '', notes: '',
            status: { tone: C.review && st >= n ? 'ok' : 'info', text: C.problem ? '먼저 문제 풀기' : `풀이 ${st} / ${n}단계` }
          };
        }
        const M = D.model(s);
        const v = D.view(M, C, s) || {};
        ['formula', 'rule', 'notes', 'guide'].forEach((k) => { if (typeof v[k] === 'string') v[k] = texSafe(v[k]); });
        if (v.formula && /tg-tt/.test(v.formula)) scrollTable();
        return v;
      },
      draw: (b, s, v, lab) => {
        b._tgBoxes = [];
        const C = baseCtx(s, lab, !!b.thumb);
        b._tgRouteLeaderNames = D.id === 'r1-1' && !C.problem && !C.review;
        if (b.thumb) C.step = 99;
        G_STATE.problem = !!(C.problem || C.review);
        if (C.lesson) {
          const original = D.model(s), M = D.lessonModel ? D.lessonModel(original, s) : original;
          C.t = A ? (s[A.key] || 0) : 1;
          C.last = C.answer;
          const custom = D.lessonDraw ? D.lessonDraw(b, s, M, C, s.q.solution) : false;
          if (custom === false) {
            if (s.tgLessonProblem) {
              const n = s.q.solution.steps.length;
              const step = C.entry ? 0 : C.answer ? n : Math.max(0, Math.min(C.step, n - 1));
              D.pdraw(b, s.q, { ...C, review: true, step }, s);
            } else D.draw(b, s, M, C);
          }
          if (D.lessonAfterDraw) D.lessonAfterDraw(b, s, M, C, s.q.solution);
          return;
        }
        if (C.problem || C.review) {
          C.last = C.review && C.step >= s.q.solution.steps.length;
          if (s.q) D.pdraw(b, s.q, C, s);
          return;
        }
        const M = D.model(s);
        C.t = A ? (s[A.key] || 0) : 1;
        D.draw(b, s, M, C);
      }
    };
  }
  function register(order, id, title, short, params, scenes) {
    (window.APL_TG_GROUPS = window.APL_TG_GROUPS || []).push({ order, id, title, short, params, scenes: scenes.map(makeScene) });
  }
  const notes = (...li) => `<ul class="tg-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });
  const tex = (s) => '$' + s + '$';

  window.APL_TG = {
    PI, DEG, clamp, ease, NUM, LET, esc, rint, pick, sample, gcd,
    fr, xQ, xS, xAdd, xMul, texX, mkV, vi, vsq, vf, vnum, vadd, vsub, vneg, vmul, vdiv, vscale, vsqrt, vpow2, vsame, vrat, vint, decS, vtex, vcan, veq, veqT, vplain,
    SPEC, trig, sinD, cosD, tanD, tanS, isSpec, tbl, d4,
    r1, fmtN, dg, tx, texDeg, ol,
    pt, add, sub, mul, len, dist, unit, mid, lerp, polar, rotP, angBetween, cross, inter, projOn, polyArea, centroid, bboxOf, shift,
    textW, textW2, T, tagOut, vtx, sideTag, ang, tick, fillPoly, line, poly, dashed, fit, rowsBelow, rtGeo, drawRT, rtBox,
    P, degF, josa, seeded, shuffle, mkChoices, degChoices, mkTextChoices, checkQ,
    camOf, proj3, faceFront, p3, orbit, boxVerts, drawBox, BOX_EDGES, FACE_N,
    baseCtx, makeScene, register, notes, rd, tex, texSafe, fixedQuestion
  };
})();
