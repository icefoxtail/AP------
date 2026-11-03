/* ==========================================================================
   중1 · 다면체와 정다면체 — 입체 도구 (geo.js)
   - 볼록다면체를 꼭짓점 목록만으로 만들고(볼록 껍질의 면을 찾아 줌), 면·모서리·꼭짓점을 세고, 장면 위에 그립니다.
   - 각기둥·각뿔·각뿔대·정다면체 5가지·꼭짓점을 자른 입체를 만듭니다.
   - 전개도: 정육면체 11가지(칸 목록), 정다면체 전개도(입체를 펼쳐 겹치지 않는 것만 고름). 경첩을 축으로 「제자리에서 회전」해 접습니다.
   - 가로 이동 도구 hx(cam, d): 월드 벡터 (d·cosY, −d·sinY, 0) 를 더하면 화면에서 정확히 가로로만 d 이동합니다(세로 변화 0, 깊이 변화 0).
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PH;
  if (!G) return;
  const { PI, DEG, clamp, v3, add3, sub3, mul3, dot3, cross3, len3, unit3, lerp3, mid3, rotAxis, camOf, LET, rint, pick } = G;
  const PHI = (1 + Math.sqrt(5)) / 2;
  /* ---- 정다면체 장면이 쓰는 전개도 목록(선생님이 고름). 숫자는 「정팔면체 전개도 11가지 접촉 시트」의 번호이고, 첫 번째가 처음에 뜨는 기본입니다.
     바꾸려면 이 배열만 고치면 됩니다(단추 이름 ㉮㉯㉰는 개수에 맞춰 저절로 붙습니다). */
  const OCTA_PICK = [4, 1, 8];
  const TETRA_PICK = [1, 2];
  // 선생님 교과서 그림과 같은 모양·방향·이름 시작점(번호 → { rot: 돌림(60°씩), flip: 뒤집기, start0: 이름 시작점의 테두리 번호 이동 }).
  // 정사면체 1번 = 평행사변형 띠(위 줄 A·F·E, 아래 줄 B·C·D), 정팔면체 4번 = 가운데 띠 양 끝에 삼각형 2개씩(A~J, 반시계).
  const NET_ORIENT = { tetra: { 1: { rot: 2, flip: 0, start0: 0 } }, octa: { 4: { rot: 1, flip: 1, start0: 0 } } };
  const cen3 = (pts) => mul3(pts.reduce((a, p) => add3(a, p), v3(0, 0, 0)), 1 / pts.length);

  /* ------------------------------------------------------------------ 가로 이동 */
  const hx = (cam, d) => v3(d * cam.cy, -d * cam.sy, 0);
  const hxOf = (s, d) => hx(camOf(s), d);

  /* ------------------------------------------------------------------ 볼록 껍질 → 입체 */
  function hullFaces(V) {
    const n = V.length, ctr = cen3(V);
    let scale = 0; V.forEach((p) => { scale = Math.max(scale, len3(sub3(p, ctr))); });
    const eps = 1e-6 * Math.max(1, scale), seen = new Set(), faces = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
      let nr = cross3(sub3(V[j], V[i]), sub3(V[k], V[i]));
      const l = len3(nr);
      if (l < 1e-9) continue;
      nr = mul3(nr, 1 / l);
      const d = dot3(nr, V[i]);
      let pos = 0, neg = 0; const on = [];
      for (let m = 0; m < n; m++) { const sd = dot3(nr, V[m]) - d; if (sd > eps) pos++; else if (sd < -eps) neg++; else on.push(m); }
      if (pos && neg) continue;
      const key = on.join(',');
      if (seen.has(key)) continue;
      seen.add(key);
      const c = cen3(on.map((m) => V[m]));
      if (dot3(nr, sub3(c, ctr)) < 0) nr = mul3(nr, -1);
      const u = unit3(sub3(V[on[0]], c)), w = cross3(nr, u);
      on.sort((a, b) => Math.atan2(dot3(sub3(V[a], c), w), dot3(sub3(V[a], c), u)) - Math.atan2(dot3(sub3(V[b], c), w), dot3(sub3(V[b], c), u)));
      faces.push({ i: on, n: nr, c });
    }
    return faces;
  }
  function solidOf(V0) {
    const V = [];
    V0.forEach((p) => { if (!V.some((q) => len3(sub3(p, q)) < 1e-7)) V.push(p); });
    const F = hullFaces(V), ctr = cen3(V), ek = new Map();
    F.forEach((f, fi) => f.i.forEach((a, k) => {
      const b = f.i[(k + 1) % f.i.length], key = a < b ? a + '-' + b : b + '-' + a;
      let e = ek.get(key);
      if (!e) { e = { a: Math.min(a, b), b: Math.max(a, b), f: [] }; ek.set(key, e); }
      e.f.push(fi);
    }));
    const E = Array.from(ek.values()), vf = V.map(() => []);
    F.forEach((f, fi) => f.i.forEach((v) => vf[v].push(fi)));
    return { V, F, E, vf, ctr, R: Math.max(...V.map((p) => len3(sub3(p, ctr)))) };
  }
  // 밑면의 변의 수 n 마다 기본 시점(옆 -30°, 위 24°)에서 위·아래 꼭짓점이 포개지지 않도록 정한 돌림(도). 점수 탐색: 투영 꼭짓점 사이·꼭짓점-모서리 최소 거리를 가장 크게.
  const RING_DEG = { 3: 12, 4: 14, 5: 0, 6: -3, 7: 22, 8: 4, 9: 5, 10: -3, 11: 30, 12: 21 };
  const ring = (n, R, z, rot) => Array.from({ length: n }, (_, i) => { const a = -PI / 2 + (rot == null ? (RING_DEG[n] || 0) * DEG : rot) + (2 * PI * i) / n; return v3(R * Math.cos(a), R * Math.sin(a), z); });

  const SOL_CACHE = new Map();
  const cached = (key, fn) => { if (!SOL_CACHE.has(key)) { if (SOL_CACHE.size > 60) SOL_CACHE.clear(); SOL_CACHE.set(key, fn()); } return SOL_CACHE.get(key); };
  const prismS = (n, R = 1.6, h = 2.3) => cached(`pr${n}|${R}|${h}`, () => solidOf(ring(n, R, h / 2).concat(ring(n, R, -h / 2))));
  const pyrS = (n, R = 1.7, h = 2.5) => cached(`py${n}|${R}|${h}`, () => solidOf(ring(n, R, -h / 2).concat([v3(0, 0, h / 2)])));
  // 각뿔을 위에서 k(0~1) 만큼의 높이 비로 잘라 낸 각뿔대 (윗밑면의 크기 = 원래 크기 × k)
  const frustumS = (n, k, R = 1.8, h = 2.6) => cached(`fr${n}|${k.toFixed(3)}|${R}|${h}`, () => solidOf(ring(n, R, -h / 2).concat(ring(n, R * k, h / 2 - k * h))));
  // 잘려 나간 윗 각뿔
  const topPyrS = (n, k, R = 1.8, h = 2.6) => cached(`tp${n}|${k.toFixed(3)}|${R}|${h}`, () => solidOf(ring(n, R * k, h / 2 - k * h).concat([v3(0, 0, h / 2)])));

  const PLAT = {
    tetra: { name: '정사면체', p: 3, q: 3, F: 4, E: 6, V: 4, face: '정삼각형' },
    cube: { name: '정육면체', p: 4, q: 3, F: 6, E: 12, V: 8, face: '정사각형' },
    octa: { name: '정팔면체', p: 3, q: 4, F: 8, E: 12, V: 6, face: '정삼각형' },
    dodeca: { name: '정십이면체', p: 5, q: 3, F: 12, E: 30, V: 20, face: '정오각형' },
    icosa: { name: '정이십면체', p: 3, q: 5, F: 20, E: 30, V: 12, face: '정삼각형' }
  };
  const PLAT_KEYS = ['tetra', 'cube', 'octa', 'dodeca', 'icosa'];
  // 정다면체를 "밑면(또는 꼭짓점)이 아래, 대칭축이 세로"로 세웁니다(교과서 겨냥도). 그 뒤 z 축 둘레로 tilt 만큼 돌려
  // 기본 시점(옆 -30°, 위 24°)에서 꼭짓점·모서리가 포개지지 않게 합니다(tilt 는 점수 탐색으로 정한 값, 도 단위).
  const PLAT_TILT = { tetra: 64, cube: 0, octa: 75, dodeca: 10, icosa: 24 };
  function platV(key, tiltDeg) {
    let V = [], axis = null;
    if (key === 'tetra') { V = [v3(1, 1, 1), v3(1, -1, -1), v3(-1, 1, -1), v3(-1, -1, 1)]; axis = v3(1, 1, 1); }
    else if (key === 'cube') for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) V.push(v3(x, y, z));
    else if (key === 'octa') V = [v3(1, 0, 0), v3(-1, 0, 0), v3(0, 1, 0), v3(0, -1, 0), v3(0, 0, 1), v3(0, 0, -1)];
    else if (key === 'icosa') { for (const a of [-1, 1]) for (const b of [-PHI, PHI]) V.push(v3(0, a, b), v3(a, b, 0), v3(b, 0, a)); axis = v3(0, 1, PHI); }
    else {
      for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) V.push(v3(x, y, z));
      for (const a of [-1, 1]) for (const b of [-PHI, PHI]) V.push(v3(0, a / PHI, b), v3(a / PHI, b, 0), v3(b, 0, a / PHI));
      axis = null; // 면의 중심 방향(아래에서 찾음)
    }
    if (key === 'dodeca') { const f = hullFaces(V)[0]; axis = f.n; }
    const R = Math.max(...V.map(len3));
    let pts = V.map((p) => mul3(p, 1.75 / R));
    if (axis) { // axis → +z
      const a = unit3(axis), k = cross3(a, v3(0, 0, 1)), kl = len3(k);
      if (kl > 1e-9) { const ang = Math.acos(clamp(dot3(a, v3(0, 0, 1)), -1, 1)); pts = pts.map((p) => rotAxis(p, v3(0, 0, 0), mul3(k, 1 / kl), ang)); }
    }
    const tilt = (tiltDeg == null ? PLAT_TILT[key] : tiltDeg) * DEG;
    return pts.map((q) => v3(q.x * Math.cos(tilt) - q.y * Math.sin(tilt), q.x * Math.sin(tilt) + q.y * Math.cos(tilt), q.z));
  }
  const platS = (key) => cached('pl' + key, () => solidOf(platV(key)));
  // 모든 꼭짓점을 변의 길이의 t(0~0.5) 만큼 잘라 낸 입체. 0.5 이면 변의 가운데만 남습니다.
  function truncS(base, t) {
    const key = 'tr' + base.V.length + '|' + base.F.length + '|' + base.R.toFixed(3) + '|' + t.toFixed(3);
    return cached(key, () => {
      const pts = [];
      base.E.forEach((e) => { const A = base.V[e.a], B = base.V[e.b]; pts.push(lerp3(A, B, t), lerp3(B, A, t)); });
      const S = solidOf(pts);
      // 꼭짓점을 자른 면(원래 입체의 면과 방향이 다름)을 표시
      S.F.forEach((f) => { f.cut = !base.F.some((g) => dot3(g.n, f.n) > 0.9999); });
      return S;
    });
  }
  const dualDeg = (S) => S.vf.map((l) => l.length);

  /* ------------------------------------------------------------------ 입체 그리기 */
  // D = scene3 상자. o.off(v3 이동) · o.face(fi, visible) → {c,a,hidden?} | null · o.edge(ei, visible) → {color,width,alpha,dash?}
  function drawPoly(D, S, o = {}) {
    const off = o.off || v3(0, 0, 0);
    const V = off.x || off.y || off.z ? S.V.map((p) => add3(p, off)) : S.V;
    const vis = S.F.map((f) => D.facing(f.n));
    const only = o.only ? new Set(o.only) : null;
    if (D.addHull && !o.noHull) D.addHull(V);
    const dense = S.E.length > 40; // 모서리가 아주 많은 입체(축구공 등)는 뒤쪽 점선을 더 옅고 가늘게: 앞쪽 모양이 먼저 읽히게
    S.F.forEach((f, fi) => {
      if (only && !only.has(fi)) return;
      const st = o.face ? o.face(fi, vis[fi]) : { c: 'green', a: 0.08 };
      if (!st) return;
      if (!vis[fi] && !st.hidden) return;
      D.fill(f.i.map((i) => V[i]), st.c, st.a);
    });
    const inG = (e) => e.f.filter((fi) => !only || only.has(fi));
    const eVis = S.E.map((e) => inG(e).some((fi) => vis[fi]));
    const dr = (e, ei, hidden) => {
      if (!inG(e).length) return;
      const st = (o.edge ? o.edge(ei, !hidden) : null) || { color: 'ink', width: 3 };
      if (st.skip) return;
      D.line(V[e.a], V[e.b], st.color || 'ink', (st.width || 3) * (hidden ? (dense ? 0.6 : 0.8) : 1), { dash: hidden ? [6, 5] : st.dash, alpha: (st.alpha == null ? 1 : st.alpha) * (hidden ? (dense ? 0.55 : 0.7) : 1), glow: st.glow });
    };
    S.E.forEach((e, ei) => { if (!eVis[ei]) dr(e, ei, true); });
    S.E.forEach((e, ei) => { if (eVis[ei]) dr(e, ei, false); });
    return { V, vis, eVis };
  }
  const faceMid = (V, f) => cen3(f.i.map((i) => V[i]));

  /* ------------------------------------------------------------------ 곡면 입체 (다면체가 아닌 것) */
  function circlePts(D, c, r, n = 40) { // 수평 원(월드)을 화면 점으로
    return Array.from({ length: n + 1 }, (_, i) => { const a = (2 * PI * i) / n; return add3(c, v3(r * Math.cos(a), r * Math.sin(a), 0)); });
  }
  function drawCurved(D, kind, c, r, h, o = {}) {
    const col = o.color || 'orange', a = o.alpha == null ? 0.14 : o.alpha, w = o.width || 3;
    const P2 = D.P;
    const ell = (z) => circlePts(D, add3(c, v3(0, 0, z)), r).map(P2);
    if (kind === 'sphere') {
      const pc = P2(c);
      const outline = Array.from({ length: 49 }, (_, i) => ({ x: pc.x + r * Math.cos((2 * PI * i) / 48), y: pc.y + r * Math.sin((2 * PI * i) / 48) }));
      D.b.path(outline, { close: true, fill: col, fillAlpha: a, color: col, width: w });
      D.b.path(ell(0), { color: col, width: w * 0.6, alpha: 0.7, dash: [6, 5] });
      return;
    }
    const top = ell(h / 2), bot = ell(-h / 2);
    if (kind === 'cylinder') {
      const xs = top.map((p) => p.x), l = top[xs.indexOf(Math.min(...xs))], rr = top[xs.indexOf(Math.max(...xs))];
      const xb = bot.map((p) => p.x), lb = bot[xb.indexOf(Math.min(...xb))], rb = bot[xb.indexOf(Math.max(...xb))];
      // 옆면(앞쪽 호 둘 사이)과 윗면 타원을 따로 칠합니다(한 도형으로 이으면 윗면에 흰 쐐기가 생겼음)
      const frontArc2 = (arr, p0, p1, back) => arr.filter((p) => (back ? p.y <= (p0.y + p1.y) / 2 + 1e-9 : p.y >= (p0.y + p1.y) / 2 - 1e-9)).sort((u, v) => u.x - v.x);
      const frontArc = (arr, p0, p1) => arr.filter((p) => p.y >= (p0.y + p1.y) / 2 - 1e-9).sort((u, v) => u.x - v.x);
      const topFront = frontArc(top, l, rr), botFront = frontArc(bot, lb, rb);
      D.b.path([l].concat(topFront, [rr, rb], botFront.slice().reverse(), [lb]), { close: true, fill: col, fillAlpha: a, color: null });
      D.b.path(top, { close: true, fill: col, fillAlpha: a, color: null });
      D.b.path(top, { close: true, color: col, width: w });
      D.b.path(botFront, { color: col, width: w });
      D.b.path(frontArc2(bot, lb, rb, true), { color: col, width: w * 0.7, alpha: 0.7, dash: [6, 5] }); // 뒤쪽 반(안 보이는 밑면의 둘레)은 점선
      D.b.path([l, lb], { color: col, width: w }); D.b.path([rr, rb], { color: col, width: w });
    } else { // cone
      const ap = P2(add3(c, v3(0, 0, h / 2))), xb = bot.map((p) => p.x), lb = bot[xb.indexOf(Math.min(...xb))], rb = bot[xb.indexOf(Math.max(...xb))];
      D.b.path([ap, lb].concat(bot).concat([rb]), { close: true, fill: col, fillAlpha: a, color: null });
      const mid = (lb.y + rb.y) / 2;
      D.b.path(bot.filter((p) => p.y >= mid - 1e-9).sort((u, v) => u.x - v.x), { color: col, width: w });
      D.b.path(bot.filter((p) => p.y <= mid + 1e-9).sort((u, v) => u.x - v.x), { color: col, width: w * 0.7, alpha: 0.7, dash: [6, 5] }); // 뒤쪽 반은 점선
      D.b.path([ap, lb], { color: col, width: w }); D.b.path([ap, rb], { color: col, width: w });
    }
  }

  /* ------------------------------------------------------------------ 전개도 */
  const hingeOf = (p1, p2, childC, ang) => (cross3(sub3(p2, p1), sub3(childC, mid3(p1, p2))).z > 0 ? { p1, p2, ang } : { p1: p2, p2: p1, ang });
  const applyChain = (p, chain, t) => {
    let cur = p;
    for (let i = chain.length - 1; i >= 0; i--) { const h = chain[i]; cur = rotAxis(cur, h.p1, unit3(sub3(h.p2, h.p1)), h.ang * t); }
    return cur;
  };
  const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  /* ---- 점 이름표(전개도 위 점 → 알파벳): 테두리를 따라 붙이는 방식과 그 변형 ----
     bd = 테두리 점 번호(반시계, 기본 시작점부터). nameVars[i] = 점 번호 → 글자 (0번이 기본). 접힌 입체·정답은 점 번호(위치)로만 계산하므로 이름이 바뀌어도 정답은 같습니다. */
  function nameVariantsOf(net, start0) {
    const n = net.pt.length, flatIdx = net.pt.map((_, i) => i);
    const posNames = flatIdx.map((i) => (i < 26 ? LET[i] : ''));
    const cnt = new Map();
    net.faces.forEach((f, fi) => f.poly.forEach((_, vi) => { const a = net.ptOf[fi][vi], b = net.ptOf[fi][(vi + 1) % f.poly.length], k = a < b ? a + '-' + b : b + '-' + a; cnt.set(k, (cnt.get(k) || 0) + 1); }));
    const nb = net.pt.map(() => []);
    cnt.forEach((c, k) => { if (c === 1) { const [a, b] = k.split('-').map(Number); nb[a].push(b); nb[b].push(a); } });
    let seq = [];
    if (nb.every((l) => l.length === 2)) {
      let prev = -1, cur = 0;
      for (let g = 0; g < n; g++) { seq.push(cur); const nx = nb[cur].find((x) => x !== prev); prev = cur; cur = nx; if (cur === 0) break; }
    }
    if (seq.length !== n || n < 3) return { bd: null, bdOk: false, nameVars: [posNames], nameDef: { dir: 1, s: 0 } };
    let area = 0; seq.forEach((a, i) => { const p = net.pt[a], q = net.pt[seq[(i + 1) % n]]; area += p.x * q.y - q.x * p.y; });
    if (area < 0) seq.reverse();
    const maxY = Math.max(...net.pt.map((p) => p.y)), isTop = (i) => net.pt[seq[i]].y > maxY - 1e-4;
    let st = -1;
    seq.forEach((_, i) => { if (isTop(i) && !isTop((i + 1) % n) && (st < 0 || net.pt[seq[i]].x < net.pt[seq[st]].x)) st = i; });
    seq = seq.slice(st < 0 ? 0 : st).concat(seq.slice(0, st < 0 ? 0 : st));
    const corner = (i) => { const p = net.pt[seq[(i + n - 1) % n]], q = net.pt[seq[i]], r = net.pt[seq[(i + 1) % n]], ax = q.x - p.x, ay = q.y - p.y, bx = r.x - q.x, by = r.y - q.y; return Math.abs(ax * by - ay * bx) > 1e-3 * Math.hypot(ax, ay) * Math.hypot(bx, by); };
    const def = { dir: 1, s: ((start0 % n) + n) % n }, rest = [];
    [1, -1].forEach((dir) => seq.forEach((_, i) => { if (corner(i) && !(dir === 1 && i === def.s)) rest.push({ dir, s: i }); }));
    const seed = n * 7919 + Math.round(net.pt.reduce((a, p) => a + p.x * 31 + p.y * 17, 0) * 100);
    const rnd = mulberry(seed);
    for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
    const vars = [def].concat(rest);
    const nameVars = vars.map((v) => { const arr = new Array(n); for (let j = 0; j < n; j++) arr[seq[(((v.s + v.dir * j) % n) + n) % n]] = j < 26 ? LET[j] : ''; return arr; });
    return { bd: seq, bdOk: true, nameVars, nameVarDefs: vars, nameDef: def };
  }
  // 이름 배치 seed(0 = 기본) → 그 배치의 이름을 쓰는 전개도(원래 전개도의 사본). 위치·접힘·정답 계산은 그대로이고 ptName 만 다릅니다.
  function namedNet(net, seed) {
    const n = net.nameVars.length, vi = (((seed | 0) % n) + n) % n;
    if (vi === 0) return net;
    net._nv = net._nv || {};
    if (!net._nv[vi]) { foldInfoOf(net); const v = Object.assign({}, net, { ptName: net.nameVars[vi], nameIdx: vi }); delete v._land; delete v._nv; net._nv[vi] = v; }
    return net._nv[vi];
  }
  const nameIdxOf = (net, seed) => { const n = net.nameVars.length; return (((seed | 0) % n) + n) % n; };
  // def: { kind, faces:[{poly:[v3…], parent, ang}] } → 접기 도구 모음
  function finishNet(def) {
    const faces = def.faces.map((f) => Object.assign({}, f));
    const doChain = (f) => {
      if (f.chain) return;
      if (f.parent == null || f.parent < 0) { f.chain = []; return; }
      const par = faces[f.parent];
      doChain(par);
      let sh = null;
      for (let a = 0; a < f.poly.length; a++) for (let c = 0; c < par.poly.length; c++) {
        const a1 = f.poly[a], a2 = f.poly[(a + 1) % f.poly.length], c1 = par.poly[c], c2 = par.poly[(c + 1) % par.poly.length];
        if ((len3(sub3(a1, c1)) < 1e-6 && len3(sub3(a2, c2)) < 1e-6) || (len3(sub3(a1, c2)) < 1e-6 && len3(sub3(a2, c1)) < 1e-6)) sh = [a1, a2];
      }
      f.hinge = hingeOf(sh[0], sh[1], cen3(f.poly), f.ang);
      f.chain = par.chain.concat([f.hinge]);
    };
    faces.forEach(doChain);
    const net = { kind: def.kind, faces, name: def.name, label: def.label };
    net.at = (t) => faces.map((f) => f.poly.map((p) => applyChain(p, f.chain, t)));
    // 전개도 위의 점(겹치는 점은 하나로). 점 번호는 위에서 아래·왼쪽에서 오른쪽 차례(위치 기준이라 이름이 바뀌어도 그대로)
    const flat = [], pi = faces.map((f) => f.poly.map((p) => { let k = flat.findIndex((q) => len3(sub3(q, p)) < 1e-5); if (k < 0) { flat.push(p); k = flat.length - 1; } return k; }));
    const ord = flat.map((p, i) => i).sort((a, b) => (Math.abs(flat[a].y - flat[b].y) > 1e-4 ? flat[b].y - flat[a].y : flat[a].x - flat[b].x));
    const rank = []; ord.forEach((i, r) => { rank[i] = r; });
    net.pt = ord.map((i) => flat[i]);
    net.ptOf = pi.map((row) => row.map((i) => rank[i]));
    // 이름: 교과서처럼 전개도의 테두리를 따라 반시계 방향으로 A, B, C … (기본은 맨 위 왼쪽 점에서 시작). 「이름 바꾸기」는 시작점과 방향만 바꿉니다.
    // 테두리가 한 바퀴로 이어지지 않는 전개도(드묾)는 위→아래·왼쪽→오른쪽 차례로 붙입니다.
    Object.assign(net, nameVariantsOf(net, def.start0 || 0));
    net.ptName = net.nameVars[0];
    // 접으면(t=1) 한 점이 되는 꼭짓점끼리 묶습니다.
    const end = net.at(1), cl = [];
    net.clOf = faces.map(() => []);
    end.forEach((pts, fi) => pts.forEach((p, vi) => {
      let k = cl.findIndex((c) => len3(sub3(c.p, p)) < 1e-5);
      if (k < 0) { cl.push({ p, members: [] }); k = cl.length - 1; }
      cl[k].members.push([fi, vi]); net.clOf[fi][vi] = k;
    }));
    net.cl = cl;
    net.ptCl = net.pt.map(() => -1);
    faces.forEach((f, fi) => f.poly.forEach((_, vi) => { const k = net.ptOf[fi][vi]; if (net.ptCl[k] < 0) net.ptCl[k] = net.clOf[fi][vi]; }));
    // 모서리 이름: 접어서 만나는 꼭짓점 번호 쌍
    net.cname = cl.map((_, i) => (i < 26 ? LET[i] : ''));
    const verts = {}; cl.forEach((c, i) => { verts[net.cname[i]] = c.p; });
    net.sol = { verts, ctr: cen3(cl.map((c) => c.p)), order: Object.keys(verts) };
    net.faceInfo = faces.map((f, fi) => {
      const pts = end[fi], c = cen3(pts);
      let n = unit3(cross3(sub3(pts[1], pts[0]), sub3(pts[2], pts[0])));
      if (dot3(n, sub3(c, net.sol.ctr)) < 0) n = mul3(n, -1);
      return { c, n };
    });
    net.flatC = faces.map((f) => cen3(f.poly));
    // 전개도 위 한 면의 변 번호 → 접은 입체의 모서리 열쇠(문자 쌍)
    net.edgeKey = (fi, vi) => { const a = net.cname[net.clOf[fi][vi]], b = net.cname[net.clOf[fi][(vi + 1) % faces[fi].poly.length]]; return a < b ? a + b : b + a; };
    const em = new Map();
    faces.forEach((f, fi) => f.poly.forEach((_, vi) => {
      const k = net.edgeKey(fi, vi);
      if (!em.has(k)) { const a = net.cname[net.clOf[fi][vi]], b = net.cname[net.clOf[fi][(vi + 1) % f.poly.length]]; em.set(k, { u: a < b ? a : b, v: a < b ? b : a, key: k, name: k }); }
    }));
    net.sol.edges = Array.from(em.values());
    // 접은 입체의 마주 보는 면(법선이 반대) / 겹치는 면(법선·중심이 같음)
    net.opposite = faces.map((_, i) => net.faceInfo.findIndex((q, j) => j !== i && dot3(q.n, net.faceInfo[i].n) < -0.999));
    net.overlap = faces.map((_, i) => faces.some((__, j) => j !== i && len3(sub3(net.faceInfo[j].c, net.faceInfo[i].c)) < 1e-4));
    return net;
  }

  /* ---- 접은 모양 정보: 접으면 한 점이 되는 꼭짓점의 모둠 · 붙어서 한 모서리가 되는 모서리 짝
     (손으로 정해 둔 표가 아니라, 접은 모양(t=1)의 3차원 위치를 허용 오차 안에서 맞춰 보아 구합니다) */
  function foldInfoOf(net) {
    if (net._fi) return net._fi;
    const faces = net.faces, same = (p, q) => len3(sub3(p, q)) < 1e-5;
    const E = [], at = [];
    faces.forEach((f, fi) => { at[fi] = []; f.poly.forEach((_, vi) => { const vj = (vi + 1) % f.poly.length; at[fi][vi] = E.length; E.push({ fi, vi, vj, ka: net.ptOf[fi][vi], kb: net.ptOf[fi][vj], ca: net.clOf[fi][vi], cb: net.clOf[fi][vj], hinge: false, pair: -1 }); }); });
    // 전개도에서 이미 이어져 있는(접는 선) 모서리
    faces.forEach((f, fi) => {
      if (!f.hinge) return;
      [fi, f.parent].forEach((gi) => faces[gi].poly.forEach((a, vi) => {
        const b = faces[gi].poly[(vi + 1) % faces[gi].poly.length];
        if ((same(a, f.hinge.p1) && same(b, f.hinge.p2)) || (same(a, f.hinge.p2) && same(b, f.hinge.p1))) E[at[gi][vi]].hinge = true;
      }));
    });
    // 접었을 때 같은 모서리(양 끝이 같은 꼭짓점 둘)가 되는 모서리끼리 묶기
    const grp = new Map();
    E.forEach((e, i) => { const k = Math.min(e.ca, e.cb) + '-' + Math.max(e.ca, e.cb); if (!grp.has(k)) grp.set(k, []); grp.get(k).push(i); });
    const pairs = [], folds = [];
    let ok = true;
    grp.forEach((ids) => {
      const es = ids.map((i) => E[i]);
      if (es.length !== 2) ok = false;
      if (es.length === 2 && es.every((e) => !e.hinge)) pairs.push(es);
      else if (es.length === 2 && es.every((e) => e.hinge)) folds.push(es);
      else ok = false;
    });
    const sk = (es) => es.map((e) => [Math.min(e.ka, e.kb), Math.max(e.ka, e.kb)]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    pairs.sort((A, B) => { const a = sk(A), b = sk(B); return a[0][0] - b[0][0] || a[0][1] - b[0][1] || a[1][0] - b[1][0]; });
    pairs.forEach((es, i) => es.forEach((e) => { e.pair = i; }));
    // 꼭짓점 모둠: 접으면 한 점이 되는 전개도의 점들(둘 이상일 때만 색을 줍니다)
    const groups = [], ptGrp = net.pt.map(() => -1);
    net.cl.forEach((_, c) => {
      const pts = net.pt.map((__, k) => k).filter((k) => net.ptCl[k] === c);
      if (pts.length > 1) groups.push({ c, pts });
    });
    groups.sort((a, b) => a.pts[0] - b.pts[0]);
    groups.forEach((g, gi) => g.pts.forEach((k) => { ptGrp[k] = gi; }));
    const info = { E, at, pairs, folds, groups, ptGrp, ok, nPairs: pairs.length, nFolds: folds.length, nVerts: net.cl.length, nNetPts: net.pt.length };
    net._fi = info;
    return info;
  }

  /* ---- 칸(정사각형) 전개도: 정육면체 */
  const LCUBE = 1.2;
  function cellNet(cells0, label, start0) {
    const cells = cells0.map((c) => c.slice());
    const nb = (c) => cells.filter((d) => Math.abs(d[0] - c[0]) + Math.abs(d[1] - c[1]) === 1).length;
    let root = cells[0]; cells.forEach((c) => { if (nb(c) > nb(root)) root = c; });
    const mx = cells.reduce((a, c) => a + c[0], 0) / cells.length, my = cells.reduce((a, c) => a + c[1], 0) / cells.length;
    const poly = (c) => { const x0 = (c[0] - mx - 0.5) * LCUBE, x1 = x0 + LCUBE, y1 = -(c[1] - my - 0.5) * LCUBE, y0 = y1 - LCUBE; return [v3(x0, y1, 0), v3(x1, y1, 0), v3(x1, y0, 0), v3(x0, y0, 0)]; };
    const order = [root], parent = [-1];
    for (let i = 0; i < order.length; i++) cells.forEach((d) => { if (!order.includes(d) && Math.abs(d[0] - order[i][0]) + Math.abs(d[1] - order[i][1]) === 1) { order.push(d); parent.push(i); } });
    const net = finishNet({ kind: 'cube', name: '정육면체', label, start0, faces: order.map((c, i) => ({ poly: poly(c), parent: parent[i], ang: PI / 2, cell: c })) });
    // 면 번호 ①~⑥: 전개도에서 위→아래, 왼쪽→오른쪽
    const rk = net.faces.map((f, i) => i).sort((a, b) => (net.faces[a].cell[1] - net.faces[b].cell[1]) || (net.faces[a].cell[0] - net.faces[b].cell[0]));
    net.num = []; rk.forEach((fi, k) => { net.num[fi] = k + 1; });
    net.cells = cells;
    return net;
  }
  const hasBlock = (cells) => cells.some((c) => [[1, 0], [0, 1], [1, 1]].every((d) => cells.some((e) => e[0] === c[0] + d[0] && e[1] === c[1] + d[1])));
  const connected = (cells) => { const seen = [cells[0]]; for (let i = 0; i < seen.length; i++) cells.forEach((d) => { if (!seen.includes(d) && Math.abs(d[0] - seen[i][0]) + Math.abs(d[1] - seen[i][1]) === 1) seen.push(d); }); return seen.length === cells.length; };
  // 칸 목록이 정육면체의 전개도가 되는가 (접어서 여섯 면이 모두 다른 방향으로 놓이는가)
  function cubeNetOK(cells) {
    if (cells.length !== 6 || !connected(cells) || hasBlock(cells)) return false;
    const n = cellNet(cells);
    const dirs = n.faceInfo.map((q) => q.n);
    return dirs.every((a, i) => dirs.every((b, j) => i === j || dot3(a, b) < 0.999));
  }
  const CUBE_NETS = [
    { key: 'a1', g: '1-4-1형', cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]] },
    { key: 'a2', g: '1-4-1형', cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] },
    { key: 'a3', g: '1-4-1형', cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]] },
    { key: 'a4', g: '1-4-1형', cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]] },
    { key: 'a5', g: '1-4-1형', cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] },
    { key: 'a6', g: '1-4-1형', cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]] },
    { key: 'b1', g: '2-3-1형', cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [1, 2]] },
    { key: 'b2', g: '2-3-1형', cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [2, 2]] },
    { key: 'b3', g: '2-3-1형', cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]] },
    { key: 'c1', g: '2-2-2형', cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]] },
    { key: 'd1', g: '3-3형', cells: [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]] }
  ];
  // 정육면체가 되지 않는 모양
  const BAD_NETS = [
    { key: 'x1', g: '양끝이 같은 쪽', cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 0]] },
    { key: 'x2', g: '한 줄에 5개', cells: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [1, 0]] },
    { key: 'x3', g: 'ㄷ자 모양', cells: [[0, 2], [0, 1], [0, 0], [1, 0], [1, 2], [2, 2]] }
  ];
  const NET_CACHE = {};
  const cubeNetOf = (key) => {
    if (NET_CACHE[key]) return NET_CACHE[key];
    const d = CUBE_NETS.concat(BAD_NETS).find((x) => x.key === key) || CUBE_NETS[0];
    return (NET_CACHE[key] = cellNet(d.cells, d.g));
  };
  // 칸 목록의 회전·뒤집기
  function transformCells(cells, rot, flip) {
    let c = cells.map((q) => q.slice());
    if (flip) c = c.map((q) => [-q[0], q[1]]);
    for (let r = 0; r < rot; r++) c = c.map((q) => [-q[1], q[0]]);
    const mx = Math.min(...c.map((q) => q[0])), my = Math.min(...c.map((q) => q[1]));
    return c.map((q) => [q[0] - mx, q[1] - my]);
  }
  const canonCells = (cells) => {
    let best = '';
    for (let f = 0; f < 2; f++) for (let r = 0; r < 4; r++) { const k = transformCells(cells, r, f).sort((a, b) => a[1] - b[1] || a[0] - b[0]).map((q) => q.join(',')).join(';'); if (!best || k < best) best = k; }
    return best;
  };
  function randCells(n = 6) {
    const cells = [[0, 0]];
    while (cells.length < n) {
      const c = cells[Math.floor(Math.random() * cells.length)], d = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)];
      const e = [c[0] + d[0], c[1] + d[1]];
      if (!cells.some((q) => q[0] === e[0] && q[1] === e[1])) cells.push(e);
    }
    const mx = Math.min(...cells.map((q) => q[0])), my = Math.min(...cells.map((q) => q[1]));
    return cells.map((q) => [q[0] - mx, q[1] - my]);
  }
  // 전개도 그림(보기용 작은 그림): 칸 목록 → 인라인 SVG 문자열. marks = { 칸번호: 글자 }
  function netSvg(cells, o = {}) {
    const u = o.u || 16, w = Math.max(...cells.map((c) => c[0])) + 1, h = Math.max(...cells.map((c) => c[1])) + 1;
    let g = '';
    cells.forEach((c) => { g += `<rect x="${c[0] * u + 1}" y="${c[1] * u + 1}" width="${u}" height="${u}" fill="var(--m-green)" fill-opacity=".28" stroke="currentColor" stroke-width="1.6"/>`; });
    return `<svg viewBox="0 0 ${w * u + 2} ${h * u + 2}" width="${(w * u + 2) * (o.sc || 1)}" height="${(h * u + 2) * (o.sc || 1)}" role="img" aria-hidden="true" style="display:block;max-width:100%;height:auto">${g}</svg>`;
  }

  /* ---- 정다면체 전개도: 입체를 펼쳐 서로 겹치지 않는 것만 고릅니다(정다각형 면 → 평면 위에 차례로 붙이기) */
  function polyOverlap(A, B) { // 볼록다각형 둘이 겹치는가(분리축 정리, 살짝 줄여서 맞닿는 것은 허용)
    const sh = (P) => { const c = { x: P.reduce((a, q) => a + q.x, 0) / P.length, y: P.reduce((a, q) => a + q.y, 0) / P.length }; return P.map((q) => ({ x: c.x + (q.x - c.x) * 0.96, y: c.y + (q.y - c.y) * 0.96 })); };
    const a = sh(A), b = sh(B);
    for (const P of [a, b]) for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length], ax = -(q.y - p.y), ay = q.x - p.x;
      let a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9;
      a.forEach((r) => { const d = r.x * ax + r.y * ay; a0 = Math.min(a0, d); a1 = Math.max(a1, d); });
      b.forEach((r) => { const d = r.x * ax + r.y * ay; b0 = Math.min(b0, d); b1 = Math.max(b1, d); });
      if (a1 <= b0 + 1e-9 || b1 <= a0 + 1e-9) return false;
    }
    return true;
  }
  function unfoldTry(S, rnd, tree) { // tree(선택): 접는 선(펼치며 붙일 모서리 번호의 집합) — 주면 그 모서리로만 붙입니다
    const nF = S.F.length, p = S.F[0].i.length, l = len3(sub3(S.V[S.F[0].i[0]], S.V[S.F[0].i[1]]));
    const adj = S.F.map(() => []);
    S.E.forEach((e, ei) => { if (tree && !tree.has(ei)) return; adj[e.f[0]].push({ to: e.f[1], a: e.a, b: e.b }); adj[e.f[1]].push({ to: e.f[0], a: e.a, b: e.b }); });
    const placed = new Array(nF).fill(null), parent = new Array(nF).fill(-1), order = [];
    const place = (fi, pos, center) => { placed[fi] = { pos, center }; order.push(fi); };
    const R0 = l / (2 * Math.sin(PI / p));
    const pos0 = {}; S.F[0].i.forEach((vi, k) => { const a = PI / 2 + PI / p + (2 * PI * k) / p; pos0[vi] = { x: R0 * Math.cos(a), y: R0 * Math.sin(a) }; });
    place(0, pos0, { x: 0, y: 0 });
    const front = [];
    const pushFront = (fi) => adj[fi].forEach((q) => { if (!placed[q.to]) front.push({ from: fi, ...q }); });
    pushFront(0);
    while (order.length < nF) {
      const k = Math.floor(rnd() * front.length), e = front.splice(k, 1)[0];
      if (placed[e.to]) continue;
      const par = placed[e.from], Pa = par.pos[e.a], Pb = par.pos[e.b];
      const m = { x: (Pa.x + Pb.x) / 2, y: (Pa.y + Pb.y) / 2 }, ex = Pb.x - Pa.x, ey = Pb.y - Pa.y, el = Math.hypot(ex, ey);
      let nx = -ey / el, ny = ex / el;
      if (nx * (m.x - par.center.x) + ny * (m.y - par.center.y) < 0) { nx = -nx; ny = -ny; }
      const ap = l / (2 * Math.tan(PI / S.F[e.to].i.length)), C = { x: m.x + nx * ap, y: m.y + ny * ap };
      const idx = S.F[e.to].i, pp = idx.length, ia = idx.indexOf(e.a), ib = idx.indexOf(e.b);
      const th = Math.atan2(Pa.y - C.y, Pa.x - C.x), thb = Math.atan2(Pb.y - C.y, Pb.x - C.x);
      const sg = Math.sin(thb - th) > 0 ? 1 : -1, fwd = (ib - ia + pp) % pp === 1 ? 1 : -1, R = l / (2 * Math.sin(PI / pp));
      const pos = {}; idx.forEach((vi, j) => { const a = th + sg * fwd * ((2 * PI) / pp) * (((j - ia) % pp + pp) % pp ? (j - ia) : 0); pos[vi] = { x: C.x + R * Math.cos(a), y: C.y + R * Math.sin(a) }; });
      parent[e.to] = e.from;
      place(e.to, pos, C);
      pushFront(e.to);
    }
    // 겹침 검사
    const polys = S.F.map((f, fi) => f.i.map((vi) => placed[fi].pos[vi]));
    for (let i = 0; i < nF; i++) for (let j = i + 1; j < nF; j++) {
      if (Math.hypot(placed[i].center.x - placed[j].center.x, placed[i].center.y - placed[j].center.y) > 2.2 * l) continue;
      if (polyOverlap(polys[i], polys[j])) return null;
    }
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    polys.forEach((P) => P.forEach((q) => { x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y); }));
    return { placed, parent, order, polys, l, w: x1 - x0, h: y1 - y0, area: (x1 - x0) * (y1 - y0), box: { x0, x1, y0, y1 } };
  }
  /* ---- 정사면체·정팔면체: 서로 다른 전개도를 모두 찾습니다(펼치는 방법 = 면을 잇는 접는 선의 모음 = 면 그래프의 신장 트리).
     삼각형 8개를 삼각 격자 위에 놓고 회전·뒤집기가 같은 것은 하나로 묶으면 정팔면체 11가지, 정사면체 2가지입니다. */
  const SQ3 = Math.sqrt(3) / 2;
  const latOf = (q, l) => { const j = Math.round(q.y / (l * SQ3)); return [Math.round(q.x / l - j / 2), j]; };
  const latXY = (c) => ({ x: c[0] + c[1] / 2, y: c[1] * SQ3 });
  const latTf = (c, rot, flip) => { let i = c[0], j = c[1]; if (flip) { const t = i; i = j; j = t; } for (let r = 0; r < rot; r++) { const t = i; i = -j; j = t + j; } return [i, j]; };
  const latSig = (lat, rot, flip) => {
    const T = lat.map((tri) => tri.map((c) => latTf(c, rot, flip))), all = T.flat();
    const mi = Math.min(...all.map((c) => c[0])), mj = Math.min(...all.map((c) => c[1]));
    return T.map((tri) => tri.map((c) => (c[0] - mi) + ',' + (c[1] - mj)).sort().join('/')).sort().join('|');
  };
  const latBox = (lat, rot, flip) => { const P = lat.flat().map((c) => latXY(latTf(c, rot, flip))); const xs = P.map((p) => p.x), ys = P.map((p) => p.y); return { w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };
  // 전개도를 놓는 방향: 가로로 가장 길게(같으면 표시 글자가 작은 쪽). 선생님이 정한 모양은 NET_ORIENT 가 따로 정합니다.
  function bestOrient(lat) {
    let best = null;
    for (let flip = 0; flip < 2; flip++) for (let rot = 0; rot < 6; rot++) {
      const bx = latBox(lat, rot, flip), r = Math.round((bx.w / bx.h) * 1e6), sg = latSig(lat, rot, flip);
      if (!best || r > best.r || (r === best.r && sg < best.sg)) best = { rot, flip, r, sg };
    }
    return best;
  }
  const rowsOf = (lat, rot, flip) => { const m = {}; lat.forEach((tri) => { const T = tri.map((c) => latTf(c, rot, flip)); const j = Math.min(...T.map((c) => c[1])); m[j] = (m[j] || 0) + 1; }); return Object.keys(m).map(Number).sort((a, b) => b - a).map((j) => m[j]); };
  const SHAPES = {};
  function netShapes(key) {
    if (SHAPES[key]) return SHAPES[key];
    const S = platS(key), nF = S.F.length, nE = S.E.length, seen = new Map();
    for (let mask = 0; mask < (1 << nE); mask++) {
      let c = 0; for (let b = 0; b < nE; b++) if (mask >> b & 1) c++;
      if (c !== nF - 1) continue;
      const tree = new Set(); for (let b = 0; b < nE; b++) if (mask >> b & 1) tree.add(b);
      const uf = S.F.map((_, i) => i), fd = (x) => (uf[x] === x ? x : (uf[x] = fd(uf[x])));
      let joined = 0; tree.forEach((ei) => { const a = fd(S.E[ei].f[0]), b = fd(S.E[ei].f[1]); if (a !== b) { uf[a] = b; joined++; } });
      if (joined !== nF - 1) continue; // 순환이 있거나 끊어진 모음은 건너뜀
      const r = unfoldTry(S, () => 0, tree);
      if (!r) continue;
      const o0 = r.placed[0].pos[S.F[0].i[0]]; // 첫 면의 꼭짓점을 격자의 원점으로
      const lat = S.F.map((f, fi) => f.i.map((vi) => { const q = r.placed[fi].pos[vi]; return latOf({ x: q.x - o0.x, y: q.y - o0.y }, r.l); }));
      // 접는 선이 아닌 모서리끼리 평면에서 맞닿은 모양은 제외(진짜 전개도는 맞닿은 변이 모두 접는 선)
      const ec = new Map(); lat.forEach((tri) => tri.forEach((c0, k) => { const a = tri[(k + 1) % tri.length], kk = [c0.join(','), a.join(',')].sort().join('>'); ec.set(kk, (ec.get(kk) || 0) + 1); }));
      let shared = 0; ec.forEach((v) => { if (v === 2) shared++; });
      if (shared !== nF - 1) continue;
      let canon = null; for (let flip = 0; flip < 2; flip++) for (let rot = 0; rot < 6; rot++) { const sg = latSig(lat, rot, flip); if (canon == null || sg < canon) canon = sg; }
      if (seen.has(canon)) continue;
      seen.set(canon, { canon, lat, parent: r.parent, l: r.l });
    }
    const list = Array.from(seen.values());
    list.forEach((q) => { const o = bestOrient(q.lat); q.rot = o.rot; q.flip = o.flip; q.rows = rowsOf(q.lat, o.rot, o.flip); q.start0 = 0; });
    // 번호: 줄이 적은 것(가로로 긴 것)부터, 같으면 줄별 삼각형 수의 사전순
    list.sort((a, b) => a.rows.length - b.rows.length || (a.rows.join('') < b.rows.join('') ? -1 : a.rows.join('') > b.rows.join('') ? 1 : a.canon < b.canon ? -1 : 1));
    list.forEach((q, i) => { q.id = i + 1; const f = (NET_ORIENT[key] || {})[q.id]; if (f) { q.rot = f.rot; q.flip = f.flip; q.start0 = f.start0 || 0; q.rows = rowsOf(q.lat, q.rot, q.flip); q.fixed = true; } });
    return (SHAPES[key] = list);
  }
  const polyNets = {};
  function shapeNet(key, sh, ni) {
    const S = platS(key), info = PLAT[key], scale = key === 'octa' ? 0.95 : 1.2;
    const P = sh.lat.map((tri) => tri.map((c) => latXY(latTf(c, sh.rot, sh.flip))));
    const all = P.flat(), cx = (Math.min(...all.map((p) => p.x)) + Math.max(...all.map((p) => p.x))) / 2, cy = (Math.min(...all.map((p) => p.y)) + Math.max(...all.map((p) => p.y))) / 2;
    const faces = S.F.map((f, fi) => ({
      poly: P[fi].map((q) => v3((q.x - cx) * sh.l * scale, (q.y - cy) * sh.l * scale, 0)),
      parent: sh.parent[fi],
      ang: sh.parent[fi] < 0 ? 0 : Math.acos(clamp(dot3(f.n, S.F[sh.parent[fi]].n), -1, 1))
    }));
    const net = finishNet({ kind: key, name: info.name, label: `전개도 ${'㉮㉯㉰㉱㉲㉳'[ni]}`, faces, start0: sh.start0 });
    net.shapeId = sh.id;
    return net;
  }
  function polyNetsOf(key) {
    if (polyNets[key]) return polyNets[key];
    if (key === 'tetra' || key === 'octa') {
      const sh = netShapes(key), pick = key === 'octa' ? OCTA_PICK : TETRA_PICK;
      return (polyNets[key] = pick.map((id, ni) => shapeNet(key, sh[id - 1], ni)));
    }
    const S = platS(key), rnd = mulberry(key.length * 977 + 13), cand = [];
    const tries = 1500; // 정십이면체·정이십면체(정사면체·정팔면체는 위에서 모두 찾음)
    for (let t = 0; t < tries; t++) {
      const r = unfoldTry(S, rnd);
      if (!r) continue;
      const sig = r.order.length + ':' + r.parent.map((q, i) => (q < 0 ? 0 : 1 + S.F[i].i.length)).join('') + ':' + Math.round(r.w * 10) + 'x' + Math.round(r.h * 10);
      if (cand.some((c) => c.sig === sig)) continue;
      cand.push(Object.assign(r, { sig }));
      if (cand.length > 40) break;
    }
    // 작고 반듯한 것(가로세로 비가 크지 않은 것) 두 가지
    cand.sort((a, b) => a.area * (1 + Math.abs(Math.log(a.w / a.h)) * 0.35) - b.area * (1 + Math.abs(Math.log(b.w / b.h)) * 0.35));
    const picked = [];
    for (const c of cand) { if (picked.length >= 2) break; if (picked.every((q) => Math.abs(q.w - c.w) + Math.abs(q.h - c.h) > 0.5)) picked.push(c); }
    if (picked.length < 2 && cand.length) picked.push(cand[Math.min(1, cand.length - 1)]);
    const info = PLAT[key], scale = key === 'dodeca' ? 0.62 : 0.7;
    polyNets[key] = picked.map((r, ni) => {
      const cx = (r.box.x0 + r.box.x1) / 2, cy = (r.box.y0 + r.box.y1) / 2;
      const faces = S.F.map((f, fi) => ({
        poly: r.polys[fi].map((q) => v3((q.x - cx) * scale, (q.y - cy) * scale, 0)),
        parent: r.parent[fi],
        ang: r.parent[fi] < 0 ? 0 : Math.acos(clamp(dot3(f.n, S.F[r.parent[fi]].n), -1, 1))
      }));
      const net = finishNet({ kind: key, name: info.name, label: `전개도 ${'㉮㉯㉰'[ni]}`, faces });
      return net;
    });
    return polyNets[key];
  }

  /* ------------------------------------------------------------------ 이름·개수·글 도우미 */
  const NK = ['', '', '', '삼', '사', '오', '육', '칠', '팔', '구', '십', '십일', '십이'];
  const KNAME = { prism: '각기둥', pyr: '각뿔', fr: '각뿔대' };
  const nameOf = (kind, n) => NK[n] + KNAME[kind];
  const countsOf = (kind, n) => (kind === 'pyr' ? { F: n + 1, E: 2 * n, V: n + 1 } : { F: n + 2, E: 3 * n, V: 2 * n });
  const solidOfKind = (kind, n, k = 0.5) => (kind === 'pyr' ? pyrS(n) : kind === 'fr' ? frustumS(n, k) : prismS(n));
  // 그림 맨 위 줄글(화면 좌표). lines: [{t, c, size}]
  function banner(b, lines, C, o = {}) {
    if (!C.txt) return;
    let y = b.insets.top + (o.y0 == null ? 16 : o.y0);
    const x = b.W / 2 - b.insets.right / 2;
    lines.forEach((l) => {
      if (!l) return;
      const sz = l.size || 15;
      b.stext(x, y, l.t, { color: l.c || 'ink', size: sz, weight: 800, align: 'center', baseline: 'middle' });
      y += sz + 9;
    });
  }
  // 화면 좌표(px) 사각형을 보드 좌표로 칠하기
  function sRect(b, x0, y0, x1, y1, color, alpha = 0.35, edge = true) {
    const p = [b.toW(x0, y0), b.toW(x1, y0), b.toW(x1, y1), b.toW(x0, y1)];
    b.path(p, { close: true, fill: color, fillAlpha: alpha, color: edge ? color : null, width: 2 });
  }
  const shuf = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

  Object.assign(G, {
    NK, KNAME, nameOf, countsOf, solidOfKind, banner, sRect, shuf,
    PHI, cen3, hx, hxOf, platV, PLAT_TILT, hullFaces, solidOf, ring, prismS, pyrS, frustumS, topPyrS, PLAT, PLAT_KEYS, platS, truncS, dualDeg,
    drawPoly, faceMid, drawCurved, finishNet, foldInfoOf, cellNet, cubeNetOK, CUBE_NETS, BAD_NETS, cubeNetOf, transformCells, canonCells, randCells, netSvg, polyNetsOf, hasBlock,
    namedNet, nameIdxOf, netShapes, shapeNet, OCTA_PICK, TETRA_PICK
  });
})();
