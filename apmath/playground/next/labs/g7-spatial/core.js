/* ==========================================================================
   중1 · 위치 관계 — 공용 도구 (core.js)
   - 다섯 개 탭 모듈(t1~t5.js)과 stmt.js(공간 명제 그림)가 함께 쓰는 도구 모음입니다.
     전역은 APL_SP(도구)와 APL_SP_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구(조절·돌려 보기·실시간 값) → 정리(교과서 해결 전략 순서, 단계마다 그림이 강조) → 문제(5지선다 + 숫자 바꾸기).
   - 입체는 평행투영(원근 없음)이라 평행한 모서리는 화면에서도 평행하게 보입니다. 안 보이는 모서리는 점선입니다.
   - 색의 역할(이 실험실 전체): 노랑 = 기준 모서리·구하는 것·끌 수 있는 점 · 빨강 = 만나는 · 파랑 = 평행한 · 초록 = 꼬인 위치·평면 ·
     보라 = 연장선·보조 · 기본 = 입체의 모서리.
   - 같은 크기의 각은 같은 표시, 직각은 네모, 평행한 선에는 화살표.
   - 입체의 시점 돌리기(제자리 회전)는 이동이 아니므로 허용합니다. 위치 이동은 쓰지 않습니다.
   - 좌표: 수학 3차원(x 오른쪽, y 안쪽, z 위쪽). 화면은 figure 좌표(y 아래쪽)로 투영해 그립니다.
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
  const pick = (list, cur) => { const pool = list.filter((x) => x !== cur); return pool[Math.floor(Math.random() * pool.length)]; };
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // 받침에 따라 조사를 고릅니다: kind = 'wa'(과/와) · 'eul'(을/를) · 'eun'(은/는) · 'i'(이/가). 영어 이름은 읽는 소리 기준(L·M·N·R 은 받침 있음).
  const PAIR = { wa: ['과', '와'], eul: ['을', '를'], eun: ['은', '는'], i: ['이', '가'] };
  const hasBatchim = (w) => {
    const ch = String(w).trim().slice(-1), code = ch.charCodeAt(0) - 0xac00;
    if (code >= 0 && code <= 11171) return code % 28 !== 0;
    if (/[ㄱ-ㅎ]/.test(ch)) return true;
    return /[LMNRlmnr]/.test(ch);
  };
  const jo = (w, kind) => PAIR[kind][hasBatchim(w) ? 0 : 1];
  const fmtN = (v) => { const x = Math.round(v * 10) / 10; return (Number.isInteger(x) ? String(x) : x.toFixed(1)).replace('-', '−'); };

  /* ------------------------------------------------------------------ 3차원 벡터 */
  const v3 = (x, y, z) => ({ x, y, z });
  const add3 = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
  const sub3 = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
  const mul3 = (a, k) => ({ x: a.x * k, y: a.y * k, z: a.z * k });
  const dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const cross3 = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
  const len3 = (a) => Math.hypot(a.x, a.y, a.z);
  const unit3 = (a) => { const l = len3(a) || 1; return { x: a.x / l, y: a.y / l, z: a.z / l }; };
  const lerp3 = (a, b, f) => ({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, z: a.z + (b.z - a.z) * f });
  const mid3 = (a, b) => lerp3(a, b, 0.5);
  // 축 k(단위벡터)를 중심으로 p 를 angle(라디안) 돌립니다(오른손 법칙).
  function rotAxis(p, o, k, angle) {
    const v = sub3(p, o), c = Math.cos(angle), s = Math.sin(angle), kv = cross3(k, v), kd = dot3(k, v);
    return add3(o, { x: v.x * c + kv.x * s + k.x * kd * (1 - c), y: v.y * c + kv.y * s + k.y * kd * (1 - c), z: v.z * c + kv.z * s + k.z * kd * (1 - c) });
  }

  /* ------------------------------------------------------------------ 카메라(평행투영) */
  const camOf = (s) => {
    const y = (s.spYaw == null ? -30 : s.spYaw) * DEG, p = (s.spPitch == null ? 24 : s.spPitch) * DEG;
    return { cy: Math.cos(y), sy: Math.sin(y), cp: Math.cos(p), sp: Math.sin(p) };
  };
  function proj(cam, P) {
    const x1 = P.x * cam.cy - P.y * cam.sy, y1 = P.x * cam.sy + P.y * cam.cy;
    return { x: x1, y: -(P.z * cam.cp + y1 * cam.sp), d: y1 * cam.cp - P.z * cam.sp };
  }
  // 방향 n(벡터)이 화면 쪽(보는 사람 쪽)을 향하면 true
  function facing(cam, n) {
    const y1 = n.x * cam.sy + n.y * cam.cy;
    return y1 * cam.cp - n.z * cam.sp < -1e-9;
  }

  /* ------------------------------------------------------------------ 두 직선(무한)의 위치 관계 */
  // 직선 (P0, d0), (P1, d1) → 'same' | 'parallel' | 'meet' | 'skew'
  function lineRel(P0, d0, P1, d1) {
    const cr = cross3(d0, d1), cl = len3(cr), sc = len3(d0) * len3(d1);
    const w = sub3(P1, P0);
    if (cl < sc * 1e-6) return len3(cross3(w, d0)) < len3(d0) * 1e-6 * Math.max(1, len3(w)) ? 'same' : 'parallel';
    return Math.abs(dot3(w, cr)) < cl * 1e-6 * Math.max(1, len3(w)) ? 'meet' : 'skew';
  }
  // 한 평면 위의 두 직선의 교점
  function lineMeetPoint(A, B, C, D) {
    const u = sub3(B, A), v = sub3(D, C), w = sub3(C, A), cr = cross3(u, v), den = dot3(cr, cr);
    if (den < 1e-12) return null;
    const t = dot3(cross3(w, v), cr) / den;
    return add3(A, mul3(u, t));
  }

  /* ------------------------------------------------------------------ 입체 만들기 (꼭짓점·모서리·면) */
  const SHAPE_NAME = { cuboid: '직육면체', tri: '삼각기둥', trap: '사다리꼴기둥', pyr4: '정사각뿔', tetra: '정사면체', prism: null };
  const PRISM_NAME = ['', '', '', '삼각기둥', '사각기둥', '오각기둥', '육각기둥', '칠각기둥', '팔각기둥'];
  function finishSolid(sol) {
    const names = Object.keys(sol.verts);
    sol.order = names;
    let c = v3(0, 0, 0);
    names.forEach((k) => { c = add3(c, sol.verts[k]); });
    sol.ctr = mul3(c, 1 / names.length);
    sol.edges.forEach((e) => { e.name = e.u + e.v; if (!e.key) e.key = e.name; });
    // 면: 바깥 방향 법선
    sol.faces = sol.faces.map((vs) => {
      const pts = vs.map((k) => sol.verts[k]);
      let n = v3(0, 0, 0);
      for (let i = 0; i < pts.length; i++) n = add3(n, cross3(pts[i], pts[(i + 1) % pts.length]));
      n = unit3(n);
      const fc = pts.reduce((a, p) => add3(a, p), v3(0, 0, 0));
      if (dot3(n, sub3(mul3(fc, 1 / pts.length), sol.ctr)) < 0) n = mul3(n, -1);
      return { v: vs, n, c: mul3(fc, 1 / pts.length) };
    });
    // 모서리가 속한 면
    sol.edgeFaces = {};
    sol.edges.forEach((e) => { sol.edgeFaces[e.key] = []; });
    sol.faces.forEach((f, fi) => {
      for (let i = 0; i < f.v.length; i++) {
        const a = f.v[i], b = f.v[(i + 1) % f.v.length];
        const e = sol.edges.find((q) => (q.u === a && q.v === b) || (q.u === b && q.v === a));
        if (e) sol.edgeFaces[e.key].push(fi);
      }
    });
    sol.R = Math.max(...names.map((k) => len3(sub3(sol.verts[k], sol.ctr))));
    return sol;
  }
  const SOLID_CACHE = {};
  function buildSolid(kind, n) {
    const key = kind + (kind === 'prism' ? n : '');
    if (SOLID_CACHE[key]) return SOLID_CACHE[key];
    let verts = {}, edges = [], faces = [], name = SHAPE_NAME[kind], formula = '';
    const E = (u, v, k) => ({ u, v, key: k });
    if (kind === 'cuboid') {
      const wx = 1.65, wy = 1.15, hz = 1.15;
      verts = { A: v3(-wx, -wy, hz), B: v3(wx, -wy, hz), C: v3(wx, wy, hz), D: v3(-wx, wy, hz), E: v3(-wx, -wy, -hz), F: v3(wx, -wy, -hz), G: v3(wx, wy, -hz), H: v3(-wx, wy, -hz) };
      edges = [E('A', 'B'), E('B', 'C'), E('C', 'D'), E('D', 'A'), E('E', 'F'), E('F', 'G'), E('G', 'H'), E('H', 'E'), E('A', 'E'), E('B', 'F'), E('C', 'G'), E('D', 'H')];
      faces = [['A', 'B', 'C', 'D'], ['E', 'F', 'G', 'H'], ['A', 'B', 'F', 'E'], ['D', 'C', 'G', 'H'], ['A', 'D', 'H', 'E'], ['B', 'C', 'G', 'F']];
    } else if (kind === 'trap') {
      const hz = 1.15;
      verts = { A: v3(-1.7, -1.1, hz), B: v3(-0.85, 1.1, hz), C: v3(0.85, 1.1, hz), D: v3(1.7, -1.1, hz), E: v3(-1.7, -1.1, -hz), F: v3(-0.85, 1.1, -hz), G: v3(0.85, 1.1, -hz), H: v3(1.7, -1.1, -hz) };
      edges = [E('A', 'B'), E('B', 'C'), E('C', 'D'), E('D', 'A'), E('E', 'F'), E('F', 'G'), E('G', 'H'), E('H', 'E'), E('A', 'E'), E('B', 'F'), E('C', 'G'), E('D', 'H')];
      faces = [['A', 'B', 'C', 'D'], ['E', 'F', 'G', 'H'], ['A', 'B', 'F', 'E'], ['B', 'C', 'G', 'F'], ['C', 'D', 'H', 'G'], ['D', 'A', 'E', 'H']];
    } else if (kind === 'tri' || kind === 'prism') {
      const nn = kind === 'tri' ? 3 : n, hz = 1.2;
      const R = 1.65, top = [], bot = [];
      let base;
      if (nn === 3) base = [[-1.65, -0.9], [1.65, -0.9], [0, 1.4]];
      else if (nn === 4) base = [[-1.65, -1.15], [1.65, -1.15], [1.65, 1.15], [-1.65, 1.15]];
      else base = Array.from({ length: nn }, (_, i) => { const a = -PI / 2 - PI / nn + (2 * PI * i) / nn; return [R * Math.cos(a), R * Math.sin(a)]; });
      for (let i = 0; i < nn; i++) {
        top.push(LET[i]); bot.push(LET[nn + i]);
        verts[LET[i]] = v3(base[i][0], base[i][1], hz);
        verts[LET[nn + i]] = v3(base[i][0], base[i][1], -hz);
      }
      for (let i = 0; i < nn; i++) {
        edges.push(E(top[i], top[(i + 1) % nn], 't' + i));
        edges.push(E(bot[i], bot[(i + 1) % nn], 'b' + i));
        edges.push(E(top[i], bot[i], 's' + i));
      }
      faces = [top, bot.slice().reverse()];
      for (let i = 0; i < nn; i++) faces.push([top[i], top[(i + 1) % nn], bot[(i + 1) % nn], bot[i]]);
      name = PRISM_NAME[nn] || nn + '각기둥';
      if (kind === 'prism' && nn === 4) name = '사각기둥';
    } else if (kind === 'pyr4') {
      const w = 1.55;
      verts = { V: v3(0, 0, 1.45), A: v3(-w, -w, -0.95), B: v3(w, -w, -0.95), C: v3(w, w, -0.95), D: v3(-w, w, -0.95) };
      edges = [E('A', 'B'), E('B', 'C'), E('C', 'D'), E('D', 'A'), E('V', 'A'), E('V', 'B'), E('V', 'C'), E('V', 'D')];
      faces = [['A', 'B', 'C', 'D'], ['V', 'A', 'B'], ['V', 'B', 'C'], ['V', 'C', 'D'], ['V', 'D', 'A']];
    } else { // tetra
      const r = 1.75;
      verts = { V: v3(0, 0, 1.45), A: v3(-r, -0.95, -0.95), B: v3(r, -0.95, -0.95), C: v3(0, 1.55, -0.95) };
      edges = [E('A', 'B'), E('B', 'C'), E('C', 'A'), E('V', 'A'), E('V', 'B'), E('V', 'C')];
      faces = [['A', 'B', 'C'], ['V', 'A', 'B'], ['V', 'B', 'C'], ['V', 'C', 'A']];
    }
    void formula;
    const sol = finishSolid({ kind, n: kind === 'prism' ? n : kind === 'tri' ? 3 : kind === 'cuboid' ? 4 : null, name, verts, edges, faces });
    SOLID_CACHE[key] = sol;
    return sol;
  }
  // 모서리 ref 와 e 의 위치 관계: 'ref' | 'meet'(끝점에서 만남) | 'ext'(연장하면 만남) | 'par' | 'skew'
  function relEdges(sol, ref, e) {
    if (e.key === ref.key) return 'ref';
    if (e.u === ref.u || e.u === ref.v || e.v === ref.u || e.v === ref.v) return 'meet';
    const A = sol.verts[ref.u], B = sol.verts[ref.v], C = sol.verts[e.u], D = sol.verts[e.v];
    const r = lineRel(A, sub3(B, A), C, sub3(D, C));
    return r === 'parallel' || r === 'same' ? 'par' : r === 'meet' ? 'ext' : 'skew';
  }
  function classify(sol, ref) {
    const g = { ref: [], meet: [], ext: [], par: [], skew: [] };
    let k = 0;
    sol.edges.forEach((e) => { const r = relEdges(sol, ref, e); e.rel = r; g[r].push(e); });
    g.skew.forEach((e) => { e.idx = ++k; });
    return { g, total: sol.edges.length, nMeet: g.meet.length, nExt: g.ext.length, nPar: g.par.length, nSkew: g.skew.length };
  }
  const edgeByKey = (sol, key, dflt) => sol.edges.find((e) => e.key === key) || sol.edges.find((e) => e.key === dflt) || sol.edges[0];
  const ov = (name) => `\\overline{${name}}`; // 선분 이름(TeX)
  const nm = (e) => e.name;

  /* ------------------------------------------------------------------ 숫자 서식 */
  const cnt = (v) => v + '개';

  /* ------------------------------------------------------------------ 그리기 도우미 */
  const textW = (t, size) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size * 1.0 : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };
  const bboxOf = (pts, pad = 0) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
  };

  // 그림 상자(box)를 무대에 꼭 맞춥니다. 라벨이 상자 밖으로 나갈 자리는 화면 픽셀(pad)로 따로 줍니다.
  function fit(b, box, o = {}) {
    const narrow = b.W < 560;
    const aw = Math.max(10, b.W - b.insets.left - b.insets.right), ah = Math.max(10, b.H - b.insets.top - b.insets.bottom);
    const pp = b.pad * Math.min(aw, ah), W = aw - 2 * pp, H = ah - 2 * pp;
    const base = b.thumb ? 5 : narrow ? 32 : 50;
    // 작은 미리보기(모든 장면 화면)에서는 글자·손잡이 자리를 따로 두지 않고 그림을 가득 채웁니다.
    const pad = b.thumb ? { l: 5, r: 5, t: 5, b: 5 } : { l: o.l == null ? base : o.l, r: o.r == null ? base : o.r, t: o.t == null ? base : o.t, b: o.b == null ? base : o.b };
    const bw = Math.max(1e-6, box.x1 - box.x0), bh = Math.max(1e-6, box.y1 - box.y0);
    let k = Math.max(3, Math.min((W - pad.l - pad.r) / bw, (H - pad.t - pad.b) / bh));
    if (o.maxK) k = Math.min(k, o.maxK);
    b.focus = { x: [box.x0 - pad.l / k, box.x1 + pad.r / k], y: [box.y0 - pad.t / k, box.y1 + pad.b / k] };
    return b.k;
  }

  /* 3차원 장면 그리기 상자: 투영·라벨 배치(겹치지 않게)·기본 도형 */
  function scene3(b, s, C) {
    const cam = camOf(s);
    const D = { b, s, C, cam, boxes: [], queue: [] };
    const P2 = (p) => { const q = proj(cam, p); return { x: q.x, y: q.y }; };
    D.P = P2;
    D.depth = (p) => proj(cam, p).d;
    D.facing = (n) => facing(cam, n);
    D.fitPts = (pts3, o = {}) => fit(b, bboxOf(pts3.map(P2)), o);
    D.line = (p, q, color = 'ink', width = 3, o = {}) => b.path([P2(p), P2(q)], { color, width, dash: o.dash, alpha: o.alpha, glow: o.glow, ref: o.ref });
    D.path = (pts, color = 'ink', width = 3, o = {}) => b.path(pts.map(P2), { color, width, dash: o.dash, alpha: o.alpha, close: o.close, fill: o.fill, fillAlpha: o.fillAlpha, glow: o.glow, ref: o.ref });
    D.fill = (pts, color, alpha = 0.16, o = {}) => b.path(pts.map(P2), { close: true, fill: color, fillAlpha: alpha, color: null, ref: o.ref });
    D.panel = (pts, color, fa = 0.14, ec = null, ew = 2.2, o = {}) => b.path(pts.map(P2), { close: true, fill: color, fillAlpha: fa, color: ec === null ? color : ec, width: ew, dash: o.dash, alpha: o.alpha });
    D.dot = (p, color = 'ink', r = 4.5) => b.point(P2(p), { color, r });
    D.obstacle = (p, r = 8) => { const s0 = b.toS(P2(p)); D.boxes.push({ x0: s0.x - r, x1: s0.x + r, y0: s0.y - r, y1: s0.y + r }); };
    // 화살표(평행 표시): 선분 pq 의 f 위치에 count 개
    D.par = (p, q, count = 1, color = 'sky', f = 0.5) => {
      const a = P2(p), c = P2(q), k = b.k || 60, dx = c.x - a.x, dy = c.y - a.y, l = Math.hypot(dx, dy) || 1, u = { x: dx / l, y: dy / l }, n = { x: -u.y, y: u.x }, sz = 8 / k;
      const m = { x: a.x + dx * f, y: a.y + dy * f };
      for (let i = 0; i < count; i++) {
        const cc = { x: m.x + u.x * ((i - (count - 1) / 2) * 7 / k), y: m.y + u.y * ((i - (count - 1) / 2) * 7 / k) };
        b.path([{ x: cc.x - u.x * sz + n.x * sz, y: cc.y - u.y * sz + n.y * sz }, cc, { x: cc.x - u.x * sz - n.x * sz, y: cc.y - u.y * sz - n.y * sz }], { color, width: 2.6 });
      }
    };
    D.tick = (p, q, count = 1, color = 'amber') => b.ticks(P2(p), P2(q), { color, count, size: 7 });
    // 직각 표시: 점 O 에서 방향 a, c 사이(3차원)
    D.right = (O, a, c, size = 0.4, color = 'amber') => {
      const ua = mul3(unit3(a), size), uc = mul3(unit3(c), size);
      const p0 = P2(O), p1 = P2(add3(O, ua)), p2 = P2(add3(add3(O, ua), uc)), p3 = P2(add3(O, uc));
      b.path([p0, p1, p2, p3], { close: true, fill: color, fillAlpha: 0.22, color: null });
      b.path([p1, p2, p3], { color, width: 2.6 });
    };
    // 두 방향 사이의 각 호(3차원, 같은 평면): O 에서 a → c, 반지름 r
    D.arc = (O, a, c, r = 0.5, color = 'sky', rings = 1) => {
      const ua = unit3(a), uc = unit3(c), cs = clamp(dot3(ua, uc), -1, 1), th = Math.acos(cs);
      const w = unit3(sub3(uc, mul3(ua, cs)));
      for (let k = 0; k < rings; k++) {
        const rr = r - k * 0.07, pts = [];
        for (let i = 0; i <= 24; i++) { const t = (th * i) / 24; pts.push(P2(add3(O, add3(mul3(ua, rr * Math.cos(t)), mul3(w, rr * Math.sin(t)))))); }
        b.path(pts, { color, width: 2.4 });
      }
      const sec = [P2(O)];
      for (let i = 0; i <= 24; i++) { const t = (th * i) / 24; sec.push(P2(add3(O, add3(mul3(ua, r * Math.cos(t)), mul3(w, r * Math.sin(t)))))); }
      b.path(sec, { close: true, fill: color, fillAlpha: 0.2, color: null });
      return th / DEG;
    };
    /* 글자 놓기: 점 p(3차원)에서 선호 방향(화면 단위벡터 dir)부터 둘레를 돌며 다른 글자·점과 겹치지 않는 자리를 찾습니다.
       o.at = [[dx,dy],…] 화면 픽셀 후보(점 둘레, 앞쪽이 우선)를 주면 그 자리들을 차례로 봅니다. */
    D.label = (p3, str, o = {}) => {
      if (!C.txt || str == null || str === '') return;
      const p = o.fig ? p3 : P2(p3);
      const size = (o.size || 16) * (b.W < 560 ? 0.92 : 1);
      const eff = size * b.fs * b._ts();
      const w = textW(str, eff) + 4, h = eff * 1.2;
      const s0 = b.toS(p);
      const bx = (cx, cy) => ({ x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 });
      const area = (a, c) => Math.max(0, Math.min(a.x1, c.x1) - Math.max(a.x0, c.x0)) * Math.max(0, Math.min(a.y1, c.y1) - Math.max(a.y0, c.y0));
      const lo = { x: b.insets.left + 3, y: b.insets.top + 3 }, hi = { x: b.W - b.insets.right - 3, y: b.H - b.insets.bottom - 3 };
      let cands = [];
      if (o.at) cands = o.at.map((q) => [s0.x + q[0], s0.y + q[1]]);
      else {
        let ux = o.dir ? o.dir.x : 0, uy = o.dir ? o.dir.y : -1;
        const l = Math.hypot(ux, uy) || 1; ux /= l; uy /= l;
        const g = o.gap == null ? 11 : o.gap;
        [0, 40, -40, 80, -80, 120, -120, 160, 180, 20, -20, 60, -60].forEach((deg) => {
          const a = Math.atan2(uy, ux) + deg * DEG, dx = Math.cos(a), dy = Math.sin(a);
          const d = g + Math.abs(dx) * w / 2 + Math.abs(dy) * h / 2;
          cands.push([s0.x + dx * d, s0.y + dy * d]);
        });
      }
      let best = null, bs = 1e18;
      cands.forEach((c, i) => {
        const q = bx(c[0], c[1]);
        let sc = i * 2;
        D.boxes.forEach((r) => { sc += area(q, r) * 3; });
        sc += (Math.max(0, lo.x - q.x0) + Math.max(0, q.x1 - hi.x) + Math.max(0, lo.y - q.y0) + Math.max(0, q.y1 - hi.y)) * 40;
        if (sc < bs) { bs = sc; best = c; }
      });
      if (!best) return;
      D.boxes.push(bx(best[0], best[1]));
      b.text(p, str, { dx: best[0] - s0.x, dy: best[1] - s0.y, color: o.color || 'ink', size, weight: 800, align: 'center', baseline: 'middle', alpha: o.alpha, ref: o.ref });
    };
    // 화면에서 점 p 가 입체 중심(c)의 어느 쪽 바깥인지 단위벡터
    D.out = (p3, c3) => { const a = P2(p3), c = P2(c3), dx = a.x - c.x, dy = a.y - c.y, l = Math.hypot(dx, dy); return l < 1e-6 ? { x: 0, y: -1 } : { x: dx / l, y: dy / l }; };
    // 깊이 순서(먼 것부터)로 그릴 일을 모아 두었다가 한꺼번에 그립니다.
    D.later = (depth, fn) => { D.queue.push({ depth, fn }); };
    D.flush = () => { D.queue.sort((a, c) => c.depth - a.depth).forEach((q) => q.fn()); D.queue = []; };
    return D;
  }

  /* 입체 그리기: 보이는 모서리는 실선, 안 보이는 모서리는 점선. style(e) → {color,width,alpha,dash?,glow?} */
  function drawSolid(D, sol, style, o = {}) {
    const { b } = D;
    const vis = (e) => (sol.edgeFaces[e.key] || []).some((fi) => D.facing(sol.faces[fi].n));
    if (o.fillFaces !== false) sol.faces.forEach((f) => { if (D.facing(f.n)) D.fill(f.v.map((k) => sol.verts[k]), o.faceColor || 'green', o.faceAlpha == null ? 0.07 : o.faceAlpha); });
    const hid = sol.edges.filter((e) => !vis(e)), shown = sol.edges.filter((e) => vis(e));
    const dr = (e, hidden) => {
      const st = style(e) || {};
      D.line(sol.verts[e.u], sol.verts[e.v], st.color || 'ink', (st.width || 3) * (hidden ? 0.8 : 1), { dash: hidden ? [6, 5] : st.dash, alpha: (st.alpha == null ? 1 : st.alpha) * (hidden ? 0.75 : 1), glow: st.glow, ref: st.ref });
    };
    hid.forEach((e) => dr(e, true));
    shown.forEach((e) => dr(e, false));
    return { vis };
  }
  // 꼭짓점 점 + 이름(겹치지 않게)
  function drawVerts(D, sol, o = {}) {
    const { b, C } = D;
    sol.order.forEach((k) => {
      const p = sol.verts[k];
      const hot = o.hot && o.hot(k);
      b.point(D.P(p), { color: hot ? 'amber' : 'ink', r: hot ? 5.5 : 4 });
      D.obstacle(p, 7);
    });
    if (C.txt && o.names !== false) sol.order.forEach((k) => D.label(sol.verts[k], k, { dir: D.out(sol.verts[k], sol.ctr), size: sol.order.length > 12 ? 15 : 17, gap: 9, color: o.hot && o.hot(k) ? 'amber' : 'ink' }));
  }

  /* ------------------------------------------------------------------ 조절 값 만들기 */
  const P = (label, min, max, step, value, o = {}) => ({ value, min, max, step, color: o.color || 'sky', label, hint: o.hint, format: o.format || ((v) => fmtN(v)) });
  const VIEW_PARAMS = {
    spYaw: P('좌우로 돌려 보기', -180, 180, 1, -30, { color: 'muted', format: (v) => Math.round(v) + '°' }),
    spPitch: P('위아래로 기울여 보기', -10, 80, 1, 24, { color: 'muted', format: (v) => Math.round(v) + '°' })
  };
  const VIEW = ['spYaw', 'spPitch'];

  /* ------------------------------------------------------------------ 5지선다 만들기 */
  // 숫자 보기: correct 정답, wrongs [[값, 힌트], …]. 모자라면 간격으로 채우고 작은 값부터 놓습니다.
  function mkChoices(correct, wrongs, o = {}) {
    const unitTxt = o.unit == null ? '개' : o.unit, valid = o.valid || ((v) => Number.isInteger(v) && v >= 0);
    const same = (a, b) => Math.abs(a - b) < 1e-6;
    const list = [{ v: correct, ok: true, hint: '' }];
    for (const w of wrongs) {
      const v = w[0];
      if (!Number.isFinite(v) || !valid(v) || list.some((x) => same(x.v, v))) continue;
      list.push({ v, ok: false, hint: w[1] || '' });
      if (list.length === 5) break;
    }
    for (let k = 1; list.length < 5 && k < 40; k++) {
      for (const sg of [1, -1]) {
        const v = correct + sg * k;
        if (list.length < 5 && valid(v) && !list.some((x) => same(x.v, v))) list.push({ v, ok: false, hint: '풀이 순서대로 다시 세어 보세요.' });
      }
    }
    list.sort((a, b) => a.v - b.v);
    return list.map((x) => ({ h: x.v + unitTxt, p: x.v + unitTxt, ok: x.ok, hint: x.hint }));
  }
  // 글 보기: items [{h(보이는 글), ok, hint}] 순서 그대로(섞기는 호출하는 쪽에서)
  const mkText = (items) => items.map((x) => ({ h: x.h, p: x.p || x.h, ok: !!x.ok, hint: x.hint || '' }));

  /* ------------------------------------------------------------------ 장면 상태 (탭·단계) */
  function baseCtx(s, lab, thumb) {
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    return { tab, problem, review, step: review ? s.step || 0 : 99, txt: !thumb, thumb: !!thumb, full: tab === 'explore' || thumb };
  }

  /* ------------------------------------------------------------------ 문제 탭 (보기 5개 · 숫자 바꾸기) */
  function problemHTML(D, s) {
    const M = D.model(s), Q = D.prob(M, s);
    const key = D.id + '|' + Q.key + '|' + (s.spSeed || 0);
    const pk = s.spPick && s.spPick.key === key ? s.spPick : null;
    let h = `<div class="sp-q">${esc(Q.stem).replace(/&amp;/g, '&')}</div>`;
    h += `<div class="sp-choices${Q.wide ? ' wide' : ''}">`;
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="sp-ch${cls}" data-sp-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.h}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="sp-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="sp-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 생각해 보세요.')}</div>`;
    }
    h += `<div class="sp-tools"><button type="button" class="apl-btn sm" data-sp-new>숫자 바꾸기</button>${Q.note ? `<span class="sp-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const Q = D.prob(D.model(s), s), i = Q.choices.findIndex((o) => o.ok);
    return `${NUM[i]} ${Q.choices[i].h}`;
  }

  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.spBound) return;
    root.dataset.spBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-sp-pick],[data-sp-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.sp) return;
      const D = sc.sp, s = lab.s;
      if (hit.hasAttribute('data-sp-new')) {
        D.reroll(s);
        s.spSeed = (s.spSeed || 0) + 1; s.spPick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-sp-pick'), 10);
      const Q = D.prob(D.model(s), s);
      s.spPick = { key: D.id + '|' + Q.key + '|' + (s.spSeed || 0), idx };
      if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('sp-css')) return;
    const st = document.createElement('style');
    st.id = 'sp-css';
    st.textContent = `
.sp-q{font-size:var(--fs-md);line-height:1.85}
.sp-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:12px 0 4px}
.sp-choices.wide{grid-template-columns:1fr}
.sp-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left;line-height:1.5}
.sp-ch:hover{background:var(--hover)}
.sp-ch .n{color:var(--m-amber);flex:none}
.sp-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.sp-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.sp-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.sp-fb.ok{border-left-color:var(--m-green)}
.sp-fb.bad{border-left-color:var(--m-red)}
.sp-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.sp-note{font-size:var(--fs-xs);color:var(--text-3)}
.sp-notes{margin:0;padding-left:18px;display:grid;gap:4px}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();

  /* ------------------------------------------------------------------ 장면 만들기
     D = { id, title, short, question, ctl:[조절 값 id…] 또는 (s)=>[…], presets?(), init(s), reroll(s),
           model(s)→M, draw(b,s,M,C), steps(M)→[글…], view(M,C,s)→{guide,readouts,status?,formula?,rule?,notes?,alert?},
           prob(M,s)→{tag,stem,choices,key,note?}, anim?:{key,dur,label,start}, stepT?(n), cam0?:{yaw,pitch}, spin?:false } */
  function makeScene(D) {
    const A = D.anim;
    const actions = () => {
      const out = [];
      if (A) {
        out.push({
          id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
          label: (s) => (s.playing ? '일시 정지' : s[A.key] >= 0.999 ? '다시 재생' : A.label || '움직여 보기'),
          on: (s) => s.playing,
          run: (s) => { if (s.playing) s.playing = false; else { if (s[A.key] >= 0.999) s[A.key] = 0; s.playing = true; } }
        });
        out.push({ id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s[A.key] = 0; if (D.onAnim) D.onAnim(s, 0); } });
      }
      if (D.spin !== false) out.push({ id: 'spin', icon: (s) => (s.spSpin ? 'pause' : 'play'), label: (s) => (s.spSpin ? '돌리기 멈춤' : '빙글 돌려 보기'), on: (s) => !!s.spSpin, run: (s) => { s.spSpin = !s.spSpin; } });
      return out.length ? out : undefined;
    };
    return {
      id: D.id, title: D.title, short: D.short || D.title, sp: D,
      question: D.question,
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl),
      presets: (s) => (D.presets ? D.presets(s) : []),
      actions,
      steps: (s) => D.steps(D.model(s)),
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: (s) => D.prob(D.model(s), s).tag,
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(D, s)
      },
      enter: (s, lab) => {
        const c0 = D.cam0 || { yaw: -30, pitch: 24 };
        s.spYaw = c0.yaw; s.spPitch = c0.pitch; s.spSpin = false;
        D.init(s);
        s.spSeed = 0; s.spPick = null; s.playing = false;
        if (A) s[A.key] = A.start || 0;
        if (lab) curLab = lab;
      },
      tick: (s, dt, lab) => {
        let again = false;
        if (s.spSpin && lab && lab.tab === 'explore' && !s.dragging) { s.spYaw += 26 * dt; if (s.spYaw > 180) s.spYaw -= 360; again = true; }
        if (A && s.playing) {
          s[A.key] = Math.min(1, (s[A.key] || 0) + dt / (A.dur || 6));
          if (s[A.key] >= 1) s.playing = false;
          if (D.onAnim && lab && lab.tab === 'explore') D.onAnim(s, s[A.key]); // 막대 값이 움직임을 따라가게
          again = true;
        } else if (A && D.stepT && lab && lab.tab === 'review' && !s.dragging) {
          const tg = D.stepT(s.step || 0), d = tg - s[A.key];
          if (Math.abs(d) > 8e-4) { s[A.key] += clamp(d, -1 * dt, 1 * dt); again = true; }
        }
        return again;
      },
      view: (s, lab) => {
        if (lab) curLab = lab;
        const C = baseCtx(s, lab, false);
        const M = D.model(s);
        const v = D.view(M, C, s) || {};
        if (C.tab === 'problem') v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' };
        else if (C.tab === 'review') { const n = D.steps(M).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        if (b.thumb) C.step = 99;
        const M = D.model(s);
        C.t = A ? (C.tab === 'explore' || b.thumb ? (s[A.key] || 0) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : (D.problemT == null ? 1 : D.problemT))) : 1;
        D.draw(b, s, M, C);
      }
    };
  }

  function register(order, id, title, short, params, scenes) {
    (window.APL_SP_GROUPS = window.APL_SP_GROUPS || []).push({ order, id, title, short, params: Object.assign({}, VIEW_PARAMS, params), scenes: scenes.map(makeScene) });
  }
  const notes = (...li) => `<ul class="sp-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  window.APL_SP = {
    PI, DEG, clamp, ease, seg01, NUM, LET, esc, pick, rint, shuffle, fmtN, jo,
    v3, add3, sub3, mul3, dot3, cross3, len3, unit3, lerp3, mid3, rotAxis, camOf, proj, facing, lineRel, lineMeetPoint,
    buildSolid, relEdges, classify, edgeByKey, ov, nm, SHAPE_NAME, PRISM_NAME,
    textW, bboxOf, fit, scene3, drawSolid, drawVerts, P, VIEW_PARAMS, VIEW, mkChoices, mkText, cnt, baseCtx, makeScene, register, notes, rd
  };
})();
