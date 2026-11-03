/* ==========================================================================
   중1 · 위치 관계 — 탭 ④ 「전개도와 위치 관계」 (t4.js, order 40) — 장면 4개
   · s4-1 정육면체 전개도 → 꼬인 모서리   · s4-2 정육면체 전개도 → 평행한 면·수직인 면
   · s4-3 삼각기둥 전개도 → 모서리 관계    · s4-4 정사각뿔 전개도 → 꼬인 모서리
   전개도는 접는 선(경첩)을 축으로 「제자리에서 회전」해 접힙니다(이동 없음). 접으면 한 점으로 모이는 꼭짓점에는 같은 문자를 붙여
   전개도에서도 꼭짓점이 어디로 모이는지 보입니다. 모든 글자·색·정답은 지금의 전개도와 기준에서 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SP;
  if (!G) return;
  const { jo, DEG, PI, clamp, pick, rint, shuffle, v3, add3, sub3, mul3, dot3, cross3, len3, unit3, lerp3, mid3, rotAxis, scene3, classify, ov, P, VIEW, mkChoices, mkText, rd, notes, LET, NUM } = G;

  const PARAMS = {
    spFold: P('접기', 0, 1, 0.005, 0, { color: 'amber', hint: '막대를 끌거나 ▶를 눌러 전개도를 접어 보세요', format: (v) => (v < 0.01 ? '펼친 전개도' : v > 0.99 ? '다 접음' : Math.round(v * 100) + '%') }),
    // 전개도는 위에서 내려다보는 각도가 커야 펼친 모양이 보이므로 입체용(15~50°)과 따로 둡니다. 접을수록 camFold 가 이 값에서 낮춥니다.
    spPitchN: P('위아래로 기울여 보기', 50, 80, 1, 62, { color: 'muted', format: (v) => Math.round(v) + '°' })
  };
  const VIEW_N = ['spYaw', 'spPitchN'];
  // 전개도 장면 공통 시점 설정: 접은 모양(입체)에서 꼭짓점이 포개지지 않도록 시점 검사는 접힌 정도가 절반을 넘을 때 접은 입체로 합니다.
  const NET_CAM = { pitchKey: 'spPitchN', pitchRange: [50, 80], yawOff: -20, safeSol: (s, M) => ((s.spFold || 0) > 0.5 && M && M.sol ? M.sol : false) };
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;
  const FACE_NAMES = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];

  /* ------------------------------------------------------------ 전개도 만들기 */
  // 접는 선 p1→p2 를 축으로 올리는 방향(자식 면이 위로 올라가도록)에 맞춥니다.
  function hinge(p1, p2, childC, ang) {
    const k = sub3(p2, p1), c = sub3(childC, mid3(p1, p2));
    return cross3(k, c).z > 0 ? { p1, p2, ang } : { p1: p2, p2: p1, ang };
  }
  function applyChain(p, chain, t) {
    let cur = p;
    for (let i = chain.length - 1; i >= 0; i--) { const h = chain[i]; cur = rotAxis(cur, h.p1, unit3(sub3(h.p2, h.p1)), h.ang * t); }
    return cur;
  }
  const cen = (pts) => mul3(pts.reduce((a, p) => add3(a, p), v3(0, 0, 0)), 1 / pts.length);
  const key3 = (p) => `${Math.round(p.x * 1e4)},${Math.round(p.y * 1e4)},${Math.round(p.z * 1e4)}`;

  // 전개도 정의 { kind, faces:[{ poly:[v3…], parent, ang }] } → 접기 도구 모음
  function finishNet(def) {
    const faces = def.faces.map((f) => Object.assign({}, f));
    faces.forEach((f, i) => {
      if (f.parent == null || f.parent < 0) { f.chain = []; return; }
      const par = faces[f.parent];
      // 두 면이 공유하는 변(접는 선)
      let sh = null;
      for (let a = 0; a < f.poly.length; a++) for (let c = 0; c < par.poly.length; c++) {
        const a1 = f.poly[a], a2 = f.poly[(a + 1) % f.poly.length], c1 = par.poly[c], c2 = par.poly[(c + 1) % par.poly.length];
        if ((len3(sub3(a1, c1)) < 1e-6 && len3(sub3(a2, c2)) < 1e-6) || (len3(sub3(a1, c2)) < 1e-6 && len3(sub3(a2, c1)) < 1e-6)) sh = [a1, a2];
      }
      f.hinge = hinge(sh[0], sh[1], cen(f.poly), f.ang);
      f.chain = par.chain.concat([f.hinge]);
    });
    const net = { kind: def.kind, faces, name: def.name, nameOf: def.nameOf };
    net.at = (t) => faces.map((f) => f.poly.map((p) => applyChain(p, f.chain, t)));
    // 접으면(t=1) 한 점이 되는 꼭짓점끼리 묶고 문자를 붙입니다.
    const end = net.at(1), cl = [];
    const idOf = Array.from(faces, () => []);
    end.forEach((pts, fi) => pts.forEach((p, vi) => {
      let k = cl.findIndex((c) => len3(sub3(c.p, p)) < 1e-5);
      if (k < 0) { cl.push({ p, members: [] }); k = cl.length - 1; }
      cl[k].members.push([fi, vi]); idOf[fi][vi] = k;
    }));
    const names = cl.map((c, i) => LET[i]);
    if (def.apex) { const ap = cl.findIndex((c) => c.members.length >= 4); if (ap >= 0) { names[ap] = 'V'; let n = 0; cl.forEach((c, i) => { if (i !== ap) names[i] = LET[n++]; }); } }
    net.cl = cl; net.idOf = idOf; net.vname = (fi, vi) => names[idOf[fi][vi]];
    net.names = names;
    // 입체의 꼭짓점과 모서리(문자 쌍)
    const verts = {}; cl.forEach((c, i) => { verts[names[i]] = c.p; });
    const eset = new Map();
    faces.forEach((f, fi) => f.poly.forEach((_, vi) => {
      const a = net.vname(fi, vi), b = net.vname(fi, (vi + 1) % f.poly.length);
      const nmE = edgeName(a, b);
      if (!eset.has(nmE)) eset.set(nmE, { u: a, v: b, key: nmE, name: nmE });
    }));
    const sol = { verts, edges: Array.from(eset.values()), order: Object.keys(verts).sort(), ctr: cen(Object.values(verts)), kind: def.kind };
    sol.R = Math.max(...sol.order.map((k) => len3(sub3(verts[k], sol.ctr))));
    net.sol = sol;
    // 면의 법선(바깥쪽)
    net.faceInfo = faces.map((f, fi) => {
      const pts = end[fi], c = cen(pts);
      let n = unit3(cross3(sub3(pts[1], pts[0]), sub3(pts[2], pts[0])));
      if (dot3(n, sub3(c, sol.ctr)) < 0) n = mul3(n, -1);
      return { c, n };
    });
    // 문자 정렬(전개도 위쪽부터)
    net.flatC = faces.map((f) => cen(f.poly));
    return net;
  }
  const edgeName = (a, b) => (a === 'V' ? 'V' + b : b === 'V' ? 'V' + a : a < b ? a + b : b + a);

  // 정육면체 전개도: 칸(열, 행) 목록. 가장 이웃이 많은 칸을 바닥(고정)으로 삼습니다.
  const CUBE_NETS = {
    cross: { label: '십자형', cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] },
    off: { label: '1-4-1형', cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]] },
    n231: { label: '2-3-1형', cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]] },
    stair: { label: '계단형', cells: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3]] }
  };
  const LCUBE = 1.25;
  function cubeNet(key) {
    const def = CUBE_NETS[key], cells = def.cells.slice();
    const nb = (c) => cells.filter((d) => Math.abs(d[0] - c[0]) + Math.abs(d[1] - c[1]) === 1).length;
    let root = cells[0]; cells.forEach((c) => { if (nb(c) > nb(root)) root = c; });
    const mx = cells.reduce((a, c) => a + c[0], 0) / cells.length, my = cells.reduce((a, c) => a + c[1], 0) / cells.length;
    const poly = (c) => { const x0 = (c[0] - mx - 0.5) * LCUBE, x1 = x0 + LCUBE, y1 = -(c[1] - my - 0.5) * LCUBE, y0 = y1 - LCUBE; return [v3(x0, y1, 0), v3(x1, y1, 0), v3(x1, y0, 0), v3(x0, y0, 0)]; }; // 왼쪽 위부터 시계 방향
    const order = [root], parent = [-1];
    for (let i = 0; i < order.length; i++) cells.forEach((d) => { if (!order.includes(d) && Math.abs(d[0] - order[i][0]) + Math.abs(d[1] - order[i][1]) === 1) { order.push(d); parent.push(i); } });
    const net = finishNet({ kind: 'cube', name: '정육면체', faces: order.map((c, i) => ({ poly: poly(c), parent: parent[i], ang: PI / 2, cell: c })) });
    // 면 이름 ㄱ~ㅂ: 전개도에서 위→아래, 왼쪽→오른쪽
    const rank = net.faces.map((f, i) => i).sort((a, b) => (net.faces[a].cell[1] - net.faces[b].cell[1]) || (net.faces[a].cell[0] - net.faces[b].cell[0]));
    net.faceName = []; rank.forEach((fi, k) => { net.faceName[fi] = FACE_NAMES[k]; });
    return net;
  }
  function prismNet() {
    const s = 1.65, H = 2.1, hs = s / 2, hh = H / 2, th = (Math.sqrt(3) / 2) * s;
    const R = (x0, y0, x1, y1) => [v3(x0, y1, 0), v3(x1, y1, 0), v3(x1, y0, 0), v3(x0, y0, 0)];
    return finishNet({
      kind: 'prism3', name: '삼각기둥',
      faces: [
        { poly: R(-hs, -hh, hs, hh), parent: -1 },
        { poly: R(-hs - s, -hh, -hs, hh), parent: 0, ang: (2 * PI) / 3 },
        { poly: R(hs, -hh, hs + s, hh), parent: 0, ang: (2 * PI) / 3 },
        { poly: [v3(-hs, hh, 0), v3(hs, hh, 0), v3(0, hh + th, 0)], parent: 0, ang: PI / 2 },
        { poly: [v3(-hs, -hh, 0), v3(hs, -hh, 0), v3(0, -hh - th, 0)], parent: 0, ang: PI / 2 }
      ]
    });
  }
  function pyrNet() {
    const s = 1.9, hs = s / 2, slant = 2.1, ang = PI - Math.acos(hs / slant);
    return finishNet({
      kind: 'pyr4', name: '정사각뿔', apex: true,
      faces: [
        { poly: [v3(-hs, hs, 0), v3(hs, hs, 0), v3(hs, -hs, 0), v3(-hs, -hs, 0)], parent: -1 },
        { poly: [v3(-hs, hs, 0), v3(hs, hs, 0), v3(0, hs + slant, 0)], parent: 0, ang },
        { poly: [v3(hs, -hs, 0), v3(-hs, -hs, 0), v3(0, -hs - slant, 0)], parent: 0, ang },
        { poly: [v3(-hs, -hs, 0), v3(-hs, hs, 0), v3(-hs - slant, 0, 0)], parent: 0, ang },
        { poly: [v3(hs, hs, 0), v3(hs, -hs, 0), v3(hs + slant, 0, 0)], parent: 0, ang }
      ]
    });
  }
  const NETS = {};
  const netOf = (kind, key) => { const k = kind + (key || ''); return NETS[k] || (NETS[k] = kind === 'cube' ? cubeNet(key || 'cross') : kind === 'prism3' ? prismNet() : pyrNet()); };

  /* ------------------------------------------------------------ 모서리 판별 (전개도의 모서리 → 입체의 모서리) */
  function netModel(s, kind, withFace) {
    const key = kind === 'cube' ? (CUBE_NETS[s.spNet] ? s.spNet : 'cross') : '';
    const net = netOf(kind, key), sol = net.sol;
    const dflt = kind === 'cube' ? defRef(net) : kind === 'prism3' ? edgeNm(net, 0, 0) : edgeNm(net, 0, 0);
    const ref = sol.edges.find((e) => e.key === s.spRefN) || sol.edges.find((e) => e.key === dflt) || sol.edges[0];
    const c = classify(sol, ref);
    return { net, sol, ref, c, key };
  }
  const edgeNm = (net, fi, vi) => edgeName(net.vname(fi, vi), net.vname(fi, (vi + 1) % net.faces[fi].poly.length));
  const defRef = (net) => edgeNm(net, 0, 0);

  // 접을수록 시점이 낮아지고(위에서 → 비스듬히) 조금 돌아가서(정면이 아니라 모서리가 보이게) 접은 입체의 앞뒤·옆면이 잘 보여요.
  const camFold = (s, t) => Object.assign({}, s, { spYaw: (s.spYaw == null ? -12 : s.spYaw) + NET_CAM.yawOff * t, spPitch: clamp((s.spPitchN == null ? 62 : s.spPitchN) - 34 * t, 15, 85) });

  /* ------------------------------------------------------------ 그리기 */
  function drawNet(D, M, C, st, t, o = {}) {
    const { b } = D, { net, sol, ref, c } = M;
    const faces = net.at(t), flat = net.at(0), end = net.at(1);
    // 화면 틀: 지금 그려지는 모양(펼친 정도)에 맞춥니다. 다 접은 입체가 작게 남지 않도록 접을수록 확대돼요.
    void flat; void end;
    D.fitPts(faces.flat(), { t: C.problem ? 46 : C.thumb ? 5 : 58, b: C.problem ? 46 : 56, l: 44, r: 44 });
    // 다 접힌 모양(입체)이면 뒤쪽 면·모서리·꼭짓점은 안 보이는 것으로 다룹니다(뒤쪽 면은 그리지 않고, 뒤쪽 모서리는 점선, 뒤쪽 꼭짓점 글자는 흐리게).
    const fin = t >= 0.97 && !o.noHide;
    const fvis = faces.map((_, fi) => !fin || D.facing(net.faceInfo[fi].n));
    const eVis = {}, vVis = {};
    faces.forEach((pts, fi) => pts.forEach((p, vi) => { if (fvis[fi]) { eVis[edgeNm(net, fi, vi)] = true; vVis[net.vname(fi, vi)] = true; } }));
    // 면(먼 것부터)
    const order = faces.map((pts, i) => ({ i, d: D.depth(cen(pts)) })).sort((a, c2) => c2.d - a.d);
    order.forEach(({ i }) => {
      if (!fvis[i]) return;
      const col = o.faceColor ? o.faceColor(i) : null;
      if (col) D.panel(faces[i], col.c, col.a, col.c, 2.4); else D.panel(faces[i], 'green', 0.09, 'ink', 1.4, { alpha: 0.5 });
    });
    // 모서리: 기준 모서리와의 관계로 색칠
    const sty = (e) => {
      const r = e.rel;
      if (r === 'ref') return { color: 'amber', width: 6.4, glow: true };
      if (st === 0) return { color: 'ink', width: 3 };
      if (r === 'meet') return st === 4 || st === 1 ? { color: 'red', width: st === 1 ? 5 : 4 } : { color: 'red', width: 2, alpha: 0.42 };
      if (r === 'par') return st === 4 || st === 2 ? { color: 'sky', width: st === 2 ? 5 : 4 } : st > 2 ? { color: 'sky', width: 2, alpha: 0.42 } : { color: 'ink', width: 3 };
      if (r === 'skew' || r === 'ext') return st === 4 || st === 3 ? { color: 'green', width: 5.6, glow: st === 3 } : { color: 'ink', width: 3 };
      return { color: 'ink', width: 3 };
    };
    if (!o.noEdges) {
      const byName = {}; sol.edges.forEach((e) => { byName[e.key] = e; });
      [true, false].forEach((hidPass) => faces.forEach((pts, fi) => pts.forEach((p, vi) => {
        const k = edgeNm(net, fi, vi), hid = fin && !eVis[k];
        if (hid !== hidPass || (!hid && !fvis[fi])) return; // 보이는 모서리는 보이는 면에서만 한 번 그립니다
        const q = pts[(vi + 1) % pts.length], e = byName[k], s0 = sty(e);
        D.line(p, q, s0.color, s0.width * (hid ? 0.85 : 1), { alpha: (s0.alpha == null ? 1 : s0.alpha) * (hid ? 0.8 : 1), glow: s0.glow, dash: hid ? [6, 5] : undefined });
      })));
    }
    // 점과 문자
    const seen = [];
    if (!o.noVerts) faces.forEach((pts, fi) => pts.forEach((p, vi) => {
      const nmv = net.vname(fi, vi), sp = D.P(p), sc = b.toS(sp), hot = (nmv === ref.u || nmv === ref.v) && !o.noRef, back = fin && !vVis[nmv];
      if (fin && !fvis[fi] && vVis[nmv]) return; // 같은 점은 보이는 면에서 한 번만
      b.point(sp, { color: hot ? 'amber' : back ? 'muted' : 'ink', r: back && !hot ? 3.2 : 4 });
      if (seen.some((q) => q.n === nmv && Math.hypot(q.x - sc.x, q.y - sc.y) < 9)) return;
      seen.push({ n: nmv, x: sc.x, y: sc.y });
      if (C.txt) D.label(p, nmv, { color: hot ? 'amber' : 'ink', size: 17, dir: D.out(p, cen(faces.flat())), gap: 9, alpha: back && !hot ? 0.55 : undefined });
    }));
    return { faces };
  }

  /* ---------------- 공통: 장면 틀 (전개도 모서리 판별 scene: s4-1, s4-3, s4-4) */
  function edgeScene(o) {
    const D = {
      id: o.id, title: o.title, short: o.short, question: o.question,
      cam0: { yaw: -12, pitch: 62 }, pitchKey: NET_CAM.pitchKey, pitchRange: NET_CAM.pitchRange, yawOff: NET_CAM.yawOff, safeSol: NET_CAM.safeSol,
      ctl: () => ['spFold'].concat(VIEW_N),
      anim: { key: 'spFold', dur: 5, label: '접어 보기', start: 0 },
      stepT: (n) => (n >= 2 ? 1 : 0),
      presets: (s) => (o.kind === 'cube' ? Object.keys(CUBE_NETS).map((k, i) => ({ group: i === 0 ? '전개도 모양' : '', label: CUBE_NETS[k].label, apply: (st) => { st.spNet = k; st.spRefN = null; st.spFold = 0; }, on: (st) => (st.spNet || 'cross') === k })) : []),
      init: (s) => { s.spNet = 'cross'; s.spRefN = null; s.spFold = 0; },
      reroll: (s) => {
        if (o.kind === 'cube') s.spNet = pick(Object.keys(CUBE_NETS), s.spNet || 'cross');
        const M = netModel(s, o.kind), keys = M.sol.edges.map((e) => e.key);
        s.spRefN = pick(keys, s.spRefN || M.ref.key); s.spFold = 0;
      },
      model: (s) => netModel(s, o.kind),
      draw(b, s, M, C) {
        const st = C.problem ? 0 : C.review ? C.step : 4;
        const t = C.problem ? 0 : C.review ? C.t : (C.thumb ? 0.6 : s.spFold);
        const Dr = scene3(b, camFold(s, t), C); // 접을수록 시점이 낮아져(위에서 → 비스듬히) 입체가 잘 보여요
        const { faces } = drawNet(Dr, M, C, st, t, { noRef: false });
        if (C.txt && !C.problem) {
          const nm = M.c.g.skew.map((e) => e.name);
          const cap = C.review ? (st === 1 ? `접으면 만나는 모서리 ${M.c.nMeet}개 지우기` : st === 2 ? `평행한 모서리 ${M.c.nPar}개 지우기` : st === 3 ? (nm.length <= 5 ? `꼬인 위치: ${nm.join(', ')} → ${M.c.nSkew}개` : `남은 ${M.c.nSkew}개 = 꼬인 위치`) : '') : '';
          if (cap) b.stext(b.W / 2 - b.insets.right / 2, b.insets.top + 20, cap, { color: st === 1 ? 'red' : st === 2 ? 'sky' : 'green', size: 17, weight: 800, align: 'center', baseline: 'middle' });
        }
        Dr.flush();
        if (C.tab === 'explore' && C.txt && !C.thumb) {
          const cands = []; faces.forEach((pts, fi) => pts.forEach((p, vi) => cands.push({ key: edgeNm(M.net, fi, vi), p: Dr.P(mid3(p, pts[(vi + 1) % pts.length])) })));
          const ce = cands.find((q) => q.key === M.ref.key) || cands[0];
          b.handle('ref', ce.p, { color: 'amber', r: 8.5, ariaLabel: '기준 모서리 고르기', drag: (w) => { let best = cands[0], bd = 1e18; cands.forEach((q) => { const d = (q.p.x - w.x) ** 2 + (q.p.y - w.y) ** 2; if (d < bd) { bd = d; best = q; } }); s.spRefN = best.key; } });
        }
      },
      steps: (M) => {
        const { ref, c } = M, r = ov(ref.name);
        return o.steps(M, r);
      },
      view: (M, C, s) => {
        const { ref, c } = M, r = ov(ref.name);
        return {
          guide: `${o.guide} <b>노란 손잡이</b>를 끌어 기준 모서리를 바꿔 보세요. 같은 문자는 접으면 한 점으로 모이는 꼭짓점이에요.`,
          readouts: [rd('기준 모서리', ref.name, 'amber'), rd('만나는 모서리', `${c.nMeet + c.nExt}개`, 'red'), rd('평행한 모서리', `${c.nPar}개`, 'sky'), rd('꼬인 위치', `${c.nSkew}개`, 'green', `${c.total} − 1 − ${c.nMeet + c.nExt} − ${c.nPar}`)].concat(o.extraRead ? o.extraRead(M) : []),
          formula: `<p>(꼬인 위치의 개수) $=${c.total}-1-${c.nMeet + c.nExt}-${c.nPar}=${c.nSkew}$ (개)</p>`,
          rule: '전개도를 접어 입체를 그린 뒤, 같은 문자를 찾아 위치 관계를 판별한다',
          notes: o.notes(M)
        };
      },
      prob: (M) => o.prob(M)
    };
    return D;
  }
  const names2 = (e) => e.name;
  const stepsSkew = (M, r) => [
    `전개도를 접어 입체를 만들어요. 같은 문자의 꼭짓점이 한 점으로 모여요. 기준 모서리 $${r}$${jo(M.ref.name, 'wa')} 끝점에서 만나는 모서리 $${M.c.nMeet + M.c.nExt}$개를 지워요.`,
    `$${r}$${jo(M.ref.name, 'wa')} 평행한 모서리 $${M.c.nPar}$개도 지워요.`,
    `남은 모서리 $${M.c.total}-1-${M.c.nMeet + M.c.nExt}-${M.c.nPar}=${M.c.nSkew}$개가 꼬인 위치예요. 꼬인 위치: ${M.c.g.skew.map((e) => `$${ov(e.name)}$`).join(', ')} → $${M.c.nSkew}$개`
  ];
  // 5지선다: 꼬인 위치인 모서리 이름 고르기 / 개수 고르기
  const probSkewName = (M, shape, key) => {
    // 같은 문제는 늘 같은 보기·같은 순서여야 하므로(고른 보기가 정답 판정과 어긋나지 않게) 기준 모서리로 정한 값으로 고릅니다.
    const { sol, ref, c } = M, hash = (str) => { let h = 7; for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }, h0 = hash(key + ref.key);
    const byName = (a, d) => a.slice().sort((x, y) => (x.name < y.name ? -1 : 1));
    const skewL = byName(c.g.skew), othL = byName(c.g.meet.concat(c.g.par, c.g.ext));
    const items = [skewL[h0 % skewL.length]];
    for (let k = 0; items.length < 5 && k < othL.length; k++) items.push(othL[(h0 + k * 3) % othL.length]);
    items.splice(0, items.length, ...items.filter((e, i) => items.indexOf(e) === i));
    for (let k = 0; items.length < 5 && k < othL.length; k++) if (!items.includes(othL[k])) items.push(othL[k]);
    const order = items.map((e, i) => ({ e, o: hash(key + ref.key + e.name + i) })).sort((x, y) => x.o - y.o).map((q) => q.e);
    const hint = (e) => (e.rel === 'meet' ? '접으면 기준 모서리와 한 점에서 만나요.' : e.rel === 'par' ? '접으면 기준 모서리와 평행해요.' : e.rel === 'ext' ? '늘이면 기준 모서리와 만나요.' : '');
    return { tag: '전개도에서 꼬인 위치', key: key + M.ref.key, stem: `그림은 ${shape}의 전개도이다. 이 전개도를 접어 만든 입체에서 모서리 $${ov(ref.name)}$${jo(ref.name, 'wa')} 꼬인 위치에 있는 모서리는? (같은 문자는 접으면 한 점으로 모인다.)`, choices: mkText(order.map((e) => ({ h: `$${ov(e.name)}$`, p: e.name, ok: e.rel === 'skew', hint: hint(e) }))) };
  };

  const S = [];
  S.push(edgeScene({
    id: 's4-1', kind: 'cube', title: '정육면체 전개도에서 꼬인 위치', short: '정육면체 전개도',
    question: '정육면체의 전개도에서 떨어져 보이는 모서리가, 접으면 꼬인 위치가 될까? 눈으로만 판단하면 왜 틀릴까?',
    guide: '막대로 전개도를 <b>접어</b> 보세요. 칩으로 전개도 모양을 바꿀 수 있어요.',
    steps: stepsSkew,
    notes: () => notes('전개도 위에서 가까이 있어도 접으면 꼬인 위치일 수 있고, 멀리 있어도 평행할 수 있어요. 반드시 접어서 확인해요.', '문자가 같은 꼭짓점은 접으면 하나로 겹쳐요. 모서리의 양 끝 문자로 이름을 불러요.'),
    prob: (M) => probSkewName(M, '정육면체', 'c' + M.key)
  }));
  /* s4-2: 면
     면 이름 ㄱ~ㅂ 은 처음에 회색으로만 두고, 기준 면을 고르면 그 면과 마주 보는(평행한) 면만 같은 강조색(노랑)으로 보입니다. 수직인 면은 정리 3단계에서 하늘색으로 보입니다.
     접은 모양은 불투명하게 그려 뒤쪽 글자가 앞면에 비치지 않게 하고, 가려진 면은 점선으로 보여 줍니다. 화면 맞춤은 지금 그려지는 모양만 기준으로 합니다. */
  const inPoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], q = poly[j]; if ((a.y > p.y) !== (q.y > p.y) && p.x < ((q.x - a.x) * (p.y - a.y)) / (q.y - a.y) + a.x) c = !c; } return c; };
  // 그림을 직접 눌러 면 고르기: 손가락·마우스가 거의 움직이지 않은 채 떼면 누른 면을 고릅니다(끄는 동작은 시점 돌리기).
  const TAP4 = { fn: null };
  function bindTap4(b) {
    const cv = b.canvas;
    if (!cv || cv.__spTap) return;
    cv.__spTap = true;
    let down = null;
    cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: Date.now(), id: e.pointerId }; });
    cv.addEventListener('pointerup', (e) => {
      const d = down; down = null;
      if (!d || d.id !== e.pointerId || !TAP4.fn) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 || Date.now() - d.t > 700) return;
      const r = cv.getBoundingClientRect();
      TAP4.fn({ x: e.clientX - r.left, y: e.clientY - r.top });
    });
  }
  const IDEA4 = '한 줄로 이어진 세 칸의 양 끝은 마주 봐요. ㄹ자로 이어진 네 칸의 양 끝도 마주 봐요(ㄷ자는 아니에요). 그래도 남은 두 면이 마지막 한 쌍이에요.';
  const ROLE4 = { a: { c: 'amber', a: 0.42, w: 3.2 }, p: { c: 'sky', a: 0.26, w: 2.4 } };
  const faceScene = {
    id: 's4-2', title: '정육면체 전개도에서 평행한 면과 수직인 면', short: '평행한 면·수직인 면',
    question: '정육면체의 전개도에서 한 면과 평행한 면은 몇 개이고 수직인 면은 몇 개일까? 전개도에서 어느 면이 평행한 면이 될까?',
    cam0: { yaw: -12, pitch: 62 }, pitchKey: NET_CAM.pitchKey, pitchRange: NET_CAM.pitchRange, yawOff: NET_CAM.yawOff, safeSol: NET_CAM.safeSol,
    ctl: () => ['spFold'].concat(VIEW_N),
    anim: { key: 'spFold', dur: 5, label: '접어 보기', start: 0 },
    stepT: (n) => (n >= 2 ? 1 : 0),
    presets: (s) => Object.keys(CUBE_NETS).map((k, i) => ({ group: i === 0 ? '전개도 모양' : '', label: CUBE_NETS[k].label, apply: (st) => { st.spNet = k; st.spBase = -1; st.spFold = 0; }, on: (st) => (st.spNet || 'cross') === k })).concat(FACE_NAMES.map((n, i) => ({ group: i === 0 ? '기준 면 고르기' : '', label: `면 ${n}`, apply: (st) => { st.spBase = st.spBase === i ? -1 : i; }, on: (st) => st.spBase === i }))),
    init: (s) => { s.spNet = 'cross'; s.spBase = -1; s.spFold = 0; },
    reroll: (s) => { s.spNet = pick(Object.keys(CUBE_NETS), s.spNet || 'cross'); s.spBase = rint(0, 5); s.spFold = 0; },
    model: (s) => {
      const net = netOf('cube', CUBE_NETS[s.spNet] ? s.spNet : 'cross'), none = !(s.spBase >= 0 && s.spBase < 6), bi0 = none ? 0 : s.spBase, base = net.faceName.findIndex((n) => n === FACE_NAMES[bi0]);
      const rel = net.faces.map((f, i) => (i === base ? 'base' : dot3(net.faceInfo[i].n, net.faceInfo[base].n) < -0.99 ? 'par' : 'perp'));
      return { net, base, none, rel, bname: net.faceName[base], par: rel.indexOf('par'), perp: rel.map((r, i) => (r === 'perp' ? i : -1)).filter((i) => i >= 0), label: CUBE_NETS[s.spNet] ? CUBE_NETS[s.spNet].label : CUBE_NETS.cross.label };
    },
    draw(b, s, M, C) {
      const { net, rel } = M;
      const st = C.problem ? 0 : C.review ? C.step : 4, t = C.problem ? 0 : C.review ? C.t : (C.thumb ? 0.6 : s.spFold);
      const Dr = scene3(b, camFold(s, t), C);
      Dr.fitPts(net.at(t).flat(), { t: C.problem ? 40 : C.thumb ? 5 : 64, b: C.problem ? 40 : 18, l: 40, r: 40 }); // 지금 그려지는 모양만 화면에 맞춥니다
      const faces = net.at(t), fin = t >= 0.97;
      const vis = faces.map((_, i) => !fin || Dr.facing(net.faceInfo[i].n));
      // 색: 한 단계에 한 쌍만(탐구는 고른 면과 마주 보는 면). 고르지 않았으면 모두 회색.
      const role = faces.map((_, i) => {
        if (C.problem) return rel[i] === 'base' ? 'a' : 0;
        if (C.review) { if (rel[i] === 'base') return 'a'; if (st === 2 && rel[i] === 'par') return 'a'; if (st >= 3 && rel[i] === 'perp') return 'p'; return 0; }
        if (M.none || C.thumb) return 0;
        return rel[i] === 'base' || rel[i] === 'par' ? 'a' : 0;
      });
      const any = role.some((r) => r);
      faces.map((p, i) => ({ i, d: Dr.depth(cen(p)) })).sort((a, c2) => c2.d - a.d).forEach(({ i }) => {
        const r = ROLE4[role[i]];
        Dr.fill(faces[i], 'stage', 1);
        Dr.panel(faces[i], r ? r.c : 'green', r ? r.a : 0.09, r ? r.c : 'ink', r ? r.w : 1.8, { alpha: r ? 1 : any ? 0.72 : 1 });
      });
      if (C.txt && !C.thumb) {
        faces.forEach((p, i) => {
          const hi = role[i] ? ROLE4[role[i]].c : null;
          if (fin && !vis[i]) { if (!hi) return; Dr.panel(p, hi, 0.14, hi, 3, { dash: [7, 5], alpha: 0.9 }); }
          Dr.label(cen(p), net.faceName[i], { color: hi || 'ink', alpha: hi || C.problem ? 1 : 0.8, size: 32, badge: fin && !vis[i], at: [[0, 0], [0, -17], [0, 17], [-17, 0], [17, 0]] });
        });
        // 그림 위 글(2줄)
        const x = b.W / 2 - b.insets.right / 2, y0 = b.insets.top + 16, line = (y, str, color) => b.stext(x, y, str, { color, size: 15, weight: 800, align: 'center', baseline: 'middle' });
        if (C.problem) line(y0, '정육면체의 전개도', 'ink');
        else {
          line(y0, `정육면체의 전개도 (${M.label})`, 'ink');
          const nb = M.bname, np = net.faceName[M.par];
          if (C.review && st <= 1) line(y0 + 24, `면 ${nb}${jo(nb, 'eul')} 골랐어요`, 'amber');
          else if (C.review && st >= 3) line(y0 + 24, `나머지 네 면은 면 ${nb}${jo(nb, 'wa')} 수직이에요`, 'sky');
          else if (M.none && !C.review) line(y0 + 24, '면을 눌러 보세요', 'muted');
          else line(y0 + 24, `면 ${nb}${jo(nb, 'wa')} 마주 보는 면 ${np}${jo(np, 'eun')} 평행해요`, 'amber');
        }
      }
      Dr.flush();
      // 그림을 눌러 기준 면 고르기(탐구 탭에서만)
      if (!C.thumb && !b.thumb) {
        bindTap4(b);
        const polys = faces.map((p) => p.map((q) => b.toS(Dr.P(q)))), dep = faces.map((p) => Dr.depth(cen(p)));
        TAP4.fn = C.tab === 'explore' ? (pt) => {
          const lab = window.lab;
          if (!lab || !lab.scene || lab.scene.id !== 's4-2' || lab.tab !== 'explore') return;
          const hit = faces.map((_, i) => i).filter((i) => vis[i] && inPoly(pt, polys[i])).sort((a, c2) => dep[a] - dep[c2])[0];
          const hi = hit == null ? -1 : FACE_NAMES.indexOf(net.faceName[hit]);
          lab.s.spBase = hi < 0 || lab.s.spBase === hi ? -1 : hi;
          lab.invalidate(true);
        } : null;
      }
    },
    steps: (M) => [
      `전개도를 접어 면 ${M.bname}${jo(M.bname, 'eul')} 바닥으로 놓아요. 바닥에 닿은 면을 기준으로 삼아요.`,
      `접었을 때 면 ${M.bname}${jo(M.bname, 'wa')} 마주 보는 면은 면 ${M.net.faceName[M.par]}이에요. 마주 보는 면은 항상 세 쌍이지만, 어느 면끼리 마주 보는지는 전개도마다 접어 봐야 알 수 있어요.`,
      `나머지 면 ${M.perp.map((i) => M.net.faceName[i]).join(', ')} ${M.perp.length}개는 기준 면과 90°로 만나서 수직이에요.`
    ],
    view: (M) => ({
      guide: '그림의 <b>면을 누르거나</b> 버튼으로 기준 면을 고른 뒤 <b>접기</b> 막대로 접어 보세요. 기준 면과 마주 보는 면이 <b style="color:var(--m-amber)">같은 노랑</b>으로 보이고, 이 두 면은 평행해요. 나머지 4개 면은 수직이에요.',
      readouts: [rd('기준 면', M.none ? '아직 없어요' : `면 ${M.bname}`, M.none ? 'muted' : 'amber'), rd('평행한 면', M.none ? '면을 눌러 보세요' : `면 ${M.net.faceName[M.par]} (1개)`, M.none ? 'muted' : 'amber'), rd('수직인 면', `${M.perp.map((i) => M.net.faceName[i]).join(' ')} (${M.perp.length}개)`, 'sky', null, null, true)],
      formula: `<p>평행한 면: $1$개 (마주 보는 면) · 수직인 면: $6-1-1=${M.perp.length}$개</p><p>마주 보는 면 찾는 법: ${IDEA4}</p>`,
      rule: '정육면체에서 한 면과 평행한 면은 마주 보는 1개, 나머지 4개 면은 수직이다',
      notes: notes(IDEA4, '접었을 때 마주 보는 면이 평행한 면이에요. 어느 면끼리 마주 보는지는 전개도 모양에 따라 달라서 접어 봐야 알 수 있어요.', '마주 보는 면은 항상 세 쌍이고, 나머지 이웃한 면은 접으면 90°로 만나 수직이에요.')
    }),
    prob: (M) => {
      const items = M.net.faces.map((f, i) => ({ h: `면 ${M.net.faceName[i]}`, ok: M.rel[i] === 'par', skip: i === M.base, hint: '접으면 기준 면과 한 모서리를 공유하여 90°로 만나요. 마주 보는 면이 평행해요.' })).filter((x) => !x.skip);
      return { tag: '전개도에서 평행한 면', key: 'f' + M.bname + M.net.faces.length + M.par, stem: `그림은 정육면체의 전개도이다. 이 전개도를 접어 정육면체를 만들 때, 면 ${M.bname}${jo(M.bname, 'wa')} 평행한 면은?`, choices: mkText(items.map((x) => ({ h: x.h, ok: x.ok, hint: x.hint }))) };
    }
  };
  S.push(faceScene);
  S.push(edgeScene({
    id: 's4-3', kind: 'prism3', title: '삼각기둥 전개도에서 모서리 관계', short: '삼각기둥 전개도',
    question: '삼각기둥의 전개도를 접으면 두 밑면은 어떤 관계이고, 옆면은 밑면과 어떻게 만날까? 모서리의 위치 관계는 어떻게 될까?',
    guide: '막대로 삼각기둥 전개도를 <b>접어</b> 보세요. 두 삼각형(밑면)은 서로 <b>평행</b>하고 세 직사각형(옆면)은 밑면과 <b>수직</b>이에요.',
    steps: stepsSkew,
    extraRead: () => [rd('밑면', '평행 1쌍', 'sky'), rd('옆면과 밑면', '수직 3개', 'amber')],
    notes: () => notes('삼각기둥에서 한 밑면과 평행한 면은 다른 밑면 하나예요. 옆면 세 개는 밑면과 수직이에요.', '옆면끼리는 수직이 아니라 삼각형의 각(정삼각형이면 $60^{\\circ}$)으로 만나요.'),
    prob: (M) => {
      const c = M.c, wr = [[c.nMeet + c.nExt, '만나는 모서리의 개수예요.'], [c.nPar, '평행한 모서리의 개수예요.'], [c.nSkew + 1, '기준 모서리 자신은 꼬인 위치가 아니에요.'], [c.nSkew + c.nPar, '평행한 모서리를 꼬인 위치로 잘못 셌어요.'], [c.nSkew - 1, '빠뜨리지 않고 세어 보세요.']];
      return { tag: '전개도에서 꼬인 위치의 개수', key: 'p' + M.ref.key, stem: `그림은 삼각기둥의 전개도이다. 이 전개도를 접어 삼각기둥을 만들 때, 모서리 $${ov(M.ref.name)}$${jo(M.ref.name, 'wa')} 꼬인 위치에 있는 모서리의 개수는? (같은 문자는 접으면 한 점으로 모인다.)`, choices: mkChoices(c.nSkew, wr, { unit: '개' }) };
    }
  }));
  S.push(edgeScene({
    id: 's4-4', kind: 'pyr4', title: '정사각뿔 전개도에서 꼬인 위치', short: '사각뿔 전개도',
    question: '정사각뿔의 전개도에서 네 삼각형의 꼭짓점은 접으면 어디로 모일까? 옆모서리끼리는 꼬인 위치가 될 수 있을까?',
    guide: '막대로 별 모양 전개도를 <b>접어</b> 보세요. 네 삼각형의 뾰족한 꼭짓점이 모두 <b>V</b> 하나로 모여요.',
    steps: stepsSkew,
    notes: () => notes('접으면 네 삼각형의 꼭짓점이 모두 V 하나로 모여요. 그래서 옆모서리끼리는 모두 V에서 만나요.', '밑면의 모서리를 기준으로 하면, 반대쪽으로 올라가는 옆모서리 두 개가 꼬인 위치예요.'),
    prob: (M) => probSkewName(M, '정사각뿔', 'y')
  }));

  G.register(40, 't4', '④ 전개도와 위치 관계', '전개도와 위치', PARAMS, S);
  // 문제 탭(휴대폰): 그림 아래에서 질문이 스크롤 없이 보이도록 s4-2 의 '탐구 질문' 카드는 문제 탭에서 접습니다(셸의 장면 선택 사항 sc.tabs 로 머리말에 data-tab 을 켭니다).
  (function () {
    const gs = window.APL_SP_GROUPS || [], g = gs[gs.length - 1], sc = g && g.scenes.find((x) => x.id === 's4-2');
    if (sc) sc.tabs = {};
    if (document.getElementById('sp-t4-css')) return;
    const st = document.createElement('style');
    st.id = 'sp-t4-css';
    st.textContent = '@media (max-width:859px){.apl-scene-head[data-tab="problem"] .apl-question{display:none}body:has(.apl-scene-head[data-tab="problem"]) .apl-stage{height:clamp(240px,36svh,560px)}}';
    document.head.append(st);
  })();
  window.APL_SP.netOf = netOf;
})();
