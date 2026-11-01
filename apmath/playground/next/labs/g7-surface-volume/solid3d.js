/* ==========================================================================
   중1 · 겉넓이와 부피 — 3차원 도우미 (solid3d.js)
   - 이 실험실 전용 도구입니다. 전역은 APL_SV 하나(다른 실험실과 공유하지 않아요).
   - 좌표: x 오른쪽, y 위, z 앞(보는 사람 쪽). 평행투영(원근 없음)이라 평행한 모서리는 화면에서도 평행합니다.
   - 가로 이동 도구 hx(d): 카메라를 돌려도 화면에서 정확히 가로로만 d 만큼 움직이는 월드 벡터.
   - 입체는 면(face) 목록(mesh)으로 만들고 body() 로 그립니다: 보이는 면은 반투명 색, 가려진 모서리는 점선.
     원기둥·원뿔·구는 회전체(revolve) 면으로 만들고 윤곽선은 수식으로 구해 매끈하게 그립니다.
   - 전개도는 조각(piece)을 경첩(hinge)으로 이어 접었다 펴는 방식(netBuild/netPose/netDraw)입니다. 접기·펴기는 제자리 회전이라 허용됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = (window.APL_SV = window.APL_SV || {});
  const PI = Math.PI, DEG = PI / 180, TAU = 2 * PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const seg01 = (t, a, b) => ease((t - a) / (b - a));
  const lin01 = (t, a, b) => clamp((t - a) / (b - a), 0, 1);

  /* ------------------------------------------------------------ 벡터·변환 */
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
  const centroid = (pts) => mul3(pts.reduce((s, p) => add3(s, p), v3(0, 0, 0)), 1 / pts.length);

  const ID = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const rotM = (k, a) => {
    const c = Math.cos(a), s = Math.sin(a), t = 1 - c, { x, y, z } = k;
    return [[t * x * x + c, t * x * y - s * z, t * x * z + s * y], [t * x * y + s * z, t * y * y + c, t * y * z - s * x], [t * x * z - s * y, t * y * z + s * x, t * z * z + c]];
  };
  const mulM = (M, p) => ({ x: M[0][0] * p.x + M[0][1] * p.y + M[0][2] * p.z, y: M[1][0] * p.x + M[1][1] * p.y + M[1][2] * p.z, z: M[2][0] * p.x + M[2][1] * p.y + M[2][2] * p.z });
  const matMul = (A, B) => A.map((row) => [0, 1, 2].map((j) => row[0] * B[0][j] + row[1] * B[1][j] + row[2] * B[2][j]));
  const Tid = () => ({ R: ID, t: v3(0, 0, 0) });
  const applyT = (T, p) => add3(mulM(T.R, p), T.t);
  const compose = (T2, T1) => ({ R: matMul(T2.R, T1.R), t: add3(mulM(T2.R, T1.t), T2.t) });
  const rotAbout = (o, k, a) => { const R = rotM(k, a); return { R, t: sub3(o, mulM(R, o)) }; }; // 점 o 를 지나는 축 k 로 a 라디안
  const shiftT = (v) => ({ R: ID, t: v });
  const rotYAt = (o, a) => rotAbout(o, v3(0, 1, 0), a);

  /* ------------------------------------------------------------ 카메라 */
  const camOf = (yaw, pitch) => { const y = yaw * DEG, p = pitch * DEG; return { cy: Math.cos(y), sy: Math.sin(y), cp: Math.cos(p), sp: Math.sin(p) }; };
  const proj = (cam, p) => { const x1 = p.x * cam.cy - p.z * cam.sy, z1 = p.x * cam.sy + p.z * cam.cy; return { x: x1, y: -(p.y * cam.cp - z1 * cam.sp), d: p.y * cam.sp + z1 * cam.cp }; };

  /* ------------------------------------------------------------ 글자 폭 */
  const textW = (t, size) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size * 1.0 : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };

  /* ------------------------------------------------------------ 면 목록(mesh) 만들기 */
  const keyOf = (p) => Math.round(p.x * 1e4) + ',' + Math.round(p.y * 1e4) + ',' + Math.round(p.z * 1e4);
  function newellN(pts) {
    let n = v3(0, 0, 0);
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n = add3(n, v3((a.y - b.y) * (a.z + b.z), (a.z - b.z) * (a.x + b.x), (a.x - b.x) * (a.y + b.y))); }
    return unit3(n);
  }
  function autoEdges(faces) {
    const map = new Map();
    faces.forEach((f, fi) => {
      for (let i = 0; i < f.pts.length; i++) {
        const a = f.pts[i], b = f.pts[(i + 1) % f.pts.length], ka = keyOf(a), kb = keyOf(b);
        if (ka === kb) continue;
        const k = ka < kb ? ka + '|' + kb : kb + '|' + ka;
        if (map.has(k)) map.get(k).f2 = fi; else map.set(k, { a, b, f1: fi, f2: -1 });
      }
    });
    // 같은 평면 위의 이웃 면 사이(이음매)는 모서리가 아니에요
    return [...map.values()].filter((e) => !(e.f2 >= 0 && faces[e.f1].n && faces[e.f2].n && dot3(faces[e.f1].n, faces[e.f2].n) > 0.99999));
  }
  // 볼록 다면체: 각 면의 바깥 법선을 중심 기준으로 정합니다.
  function polyMesh(polys, ctr) {
    const faces = polys.map((q) => {
      const pts = q.pts, n0 = newellN(pts), c = centroid(pts);
      const n = q.n ? q.n : dot3(n0, sub3(c, ctr)) < 0 ? mul3(n0, -1) : n0;
      return Object.assign({}, q, { pts, n, c });
    });
    return { faces, edges: autoEdges(faces) };
  }
  // 밑면 다각형 poly=[[x,z]…] 을 y0~y1 로 쌓은 기둥
  function prismMesh(poly, y0, y1, o = {}) {
    const n = poly.length, A = poly.map((p) => v3(p[0], y0, p[1])), B = poly.map((p) => v3(p[0], y1, p[1]));
    const polys = [{ pts: A.slice().reverse(), tag: 'bot' }, { pts: B, tag: 'top' }];
    for (let i = 0; i < n; i++) polys.push({ pts: [A[i], A[(i + 1) % n], B[(i + 1) % n], B[i]], tag: 'side', k: i });
    if (o.simple) { // 오목한 밑면도 안전: 밑면 다각형의 방향으로 바깥 법선을 정합니다
      let ar = 0;
      for (let i = 0; i < n; i++) { const p = poly[i], q = poly[(i + 1) % n]; ar += p[0] * q[1] - q[0] * p[1]; }
      polys.forEach((q) => {
        if (q.tag === 'bot') q.n = v3(0, -1, 0);
        else if (q.tag === 'top') q.n = v3(0, 1, 0);
        else { const p = poly[q.k], r = poly[(q.k + 1) % n], dx = r[0] - p[0], dz = r[1] - p[1]; q.n = unit3(ar > 0 ? v3(dz, 0, -dx) : v3(-dz, 0, dx)); }
      });
    }
    const m = polyMesh(polys, o.ctr || v3(poly.reduce((s, p) => s + p[0], 0) / n, (y0 + y1) / 2, poly.reduce((s, p) => s + p[1], 0) / n));
    if (o.smooth) { // 곡면 위의 세로 모서리는 윤곽선일 때만 그립니다
      const sm = new Set(); poly.forEach((p, i) => { if (o.smooth[i]) sm.add(Math.round(p[0] * 1e4) + ',' + Math.round(p[1] * 1e4)); });
      m.edges.forEach((e) => { if (Math.abs(e.a.x - e.b.x) < 1e-9 && Math.abs(e.a.z - e.b.z) < 1e-9 && sm.has(Math.round(e.a.x * 1e4) + ',' + Math.round(e.a.z * 1e4)) && e.f1 >= 0 && e.f2 >= 0) e.smooth = true; });
    }
    return m;
  }
  const boxMesh = (x0, x1, y0, y1, z0, z1) => prismMesh([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], y0, y1);
  // 밑면 polyA(y=yA) 과 같은 꼴을 scale 배(중심 cx,cz 기준)로 줄여 yB 에 올린 뿔대. scale=0 이면 뿔.
  function loftMesh(poly, yA, yB, scale, cx = 0, cz = 0) {
    const n = poly.length, A = poly.map((p) => v3(p[0], yA, p[1])), B = poly.map((p) => v3(cx + (p[0] - cx) * scale, yB, cz + (p[1] - cz) * scale));
    const polys = [{ pts: A.slice().reverse(), tag: 'bot' }];
    if (scale > 1e-9) polys.push({ pts: B, tag: 'top' });
    for (let i = 0; i < n; i++) {
      const q = [A[i], A[(i + 1) % n], B[(i + 1) % n], B[i]], pts = q.filter((p, j) => keyOf(p) !== keyOf(q[(j + 1) % 4]));
      polys.push({ pts, tag: 'side', k: i });
    }
    return polyMesh(polys, v3(cx, (yA + yB) / 2, cz));
  }

  /* ------------------------------------------------------------ 회전체 면 */
  // prof=[[r,y],…] (아래에서 위로). 축에서 시작하면 밑뚜껑, 축에서 끝나면 윗뚜껑·꼭짓점이 됩니다.
  // o: O 중심, axis 'x'|'y'|'z', N 방위 분할, a0·a1 방위 범위, tags 구간 이름, lines 얇은 고리를 그릴 꼭짓점 번호, flat 면을 따로 그릴 꼭짓점
  function revolveMesh(prof, o = {}) {
    const N = o.N || 40, a0 = o.a0 == null ? 0 : o.a0, a1 = o.a1 == null ? TAU : o.a1, full = Math.abs(a1 - a0 - TAU) < 1e-9;
    const O = o.O || v3(0, 0, 0), axis = o.axis || 'y';
    const fr = axis === 'y' ? { a: v3(0, 1, 0), u: v3(1, 0, 0), v: v3(0, 0, 1) } : axis === 'x' ? { a: v3(1, 0, 0), u: v3(0, 1, 0), v: v3(0, 0, 1) } : { a: v3(0, 0, 1), u: v3(1, 0, 0), v: v3(0, 1, 0) };
    const pt = (r, y, th) => add3(O, add3(mul3(fr.a, y), mul3(add3(mul3(fr.u, Math.cos(th)), mul3(fr.v, Math.sin(th))), r)));
    const dirAt = (th) => add3(mul3(fr.u, Math.cos(th)), mul3(fr.v, Math.sin(th)));
    const tanAt = (th) => add3(mul3(fr.u, -Math.sin(th)), mul3(fr.v, Math.cos(th)));
    const nS = prof.length - 1, faces = [], idx = [];
    // 구간 법선 (nr, ny)
    const segs = [];
    for (let i = 0; i < nS; i++) {
      const [r0, y0] = prof[i], [r1, y1] = prof[i + 1], dr = r1 - r0, dy = y1 - y0, l = Math.hypot(dr, dy) || 1;
      segs.push({ i, r0, y0, r1, y1, nr: dy / l, ny: -dr / l, tag: (o.tags && o.tags[i]) || 'seg' + i });
    }
    // 꼭짓점 법선(매끈하면 평균)
    const smooth = [];
    for (let i = 0; i <= nS; i++) {
      if (i === 0 || i === nS) { smooth.push(false); continue; }
      const p = segs[i - 1], q = segs[i];
      smooth.push(p.nr * q.nr + p.ny * q.ny > Math.cos(28 * DEG));
    }
    segs.forEach((sg, i) => {
      const vn = (k, other) => { if (!smooth[k]) return { nr: sg.nr, ny: sg.ny }; const a = segs[k - 1], b = segs[k], x = a.nr + b.nr, y = a.ny + b.ny, l = Math.hypot(x, y) || 1; return { nr: x / l, ny: y / l }; };
      sg.nE = [vn(i), vn(i + 1)];
    });
    const M = N;
    for (let i = 0; i < nS; i++) {
      idx.push([]);
      const sg = segs[i];
      if (sg.r0 < 1e-9 && sg.r1 < 1e-9) { for (let j = 0; j < M; j++) idx[i].push(-1); continue; }
      for (let j = 0; j < M; j++) {
        const t0 = a0 + ((a1 - a0) * j) / M, t1 = a0 + ((a1 - a0) * (j + 1)) / M, tm = (t0 + t1) / 2;
        let pts;
        if (sg.r0 < 1e-9) pts = [pt(0, sg.y0, t0), pt(sg.r1, sg.y1, t0), pt(sg.r1, sg.y1, t1)];
        else if (sg.r1 < 1e-9) pts = [pt(sg.r0, sg.y0, t0), pt(sg.r0, sg.y0, t1), pt(0, sg.y1, t1)];
        else pts = [pt(sg.r0, sg.y0, t0), pt(sg.r0, sg.y0, t1), pt(sg.r1, sg.y1, t1), pt(sg.r1, sg.y1, t0)];
        const n = add3(mul3(dirAt(tm), sg.nr), mul3(fr.a, sg.ny));
        idx[i].push(faces.length);
        faces.push({ pts, n, c: centroid(pts), tag: sg.tag, seg: i, j });
      }
    }
    const edges = [];
    // 모서리 고리(뚜껑 테두리 등)·얇은 고리
    let chain = 0;
    for (let i = 0; i <= nS; i++) {
      const r = prof[i][0], y = prof[i][1];
      if (r < 1e-9) continue;
      const crease = !smooth[i], thin = o.lines && o.lines.includes(i);
      if (!crease && !thin) continue;
      chain++;
      for (let j = 0; j < M; j++) {
        const t0 = a0 + ((a1 - a0) * j) / M, t1 = a0 + ((a1 - a0) * (j + 1)) / M;
        const f1 = i > 0 ? idx[i - 1][j] : -1, f2 = i < nS ? idx[i][j] : -1;
        edges.push({ a: pt(r, y, t0), b: pt(r, y, t1), f1, f2, chain: 'r' + i + '_' + chain, thin: !crease && thin });
      }
    }
    // 방위 절단면 (일부만 돌린 회전체)
    if (!full && o.cap !== false) {
      const poly = (th) => {
        const q = prof.map((p) => pt(p[0], p[1], th));
        const out = [];
        if (prof[0][0] > 1e-9) out.push(pt(0, prof[0][1], th));
        q.forEach((p) => { if (!out.length || keyOf(out[out.length - 1]) !== keyOf(p)) out.push(p); });
        if (prof[nS][0] > 1e-9) out.push(pt(0, prof[nS][1], th));
        return out;
      };
      [[a0, 0], [a1, M - 1]].forEach(([th, jj], which) => {
        const pts = poly(th), n = which === 0 ? mul3(tanAt(th), -1) : tanAt(th), fi = faces.length;
        faces.push({ pts, n, c: centroid(pts), tag: which === 0 ? 'cut0' : 'cut1', cut: true });
        for (let k = 0; k < pts.length; k++) {
          const a = pts[k], b = pts[(k + 1) % pts.length];
          // 이 변이 어느 구간의 윤곽인지 찾아 이웃 면을 잇습니다
          let f2 = -1;
          for (let i = 0; i < nS; i++) {
            const p0 = pt(prof[i][0], prof[i][1], th), p1 = pt(prof[i + 1][0], prof[i + 1][1], th);
            if ((keyOf(p0) === keyOf(a) && keyOf(p1) === keyOf(b)) || (keyOf(p0) === keyOf(b) && keyOf(p1) === keyOf(a))) { f2 = idx[i][jj]; break; }
          }
          edges.push({ a, b, f1: fi, f2 });
        }
      });
    }
    return { faces, edges, round: o.round ? { c: O, R: Math.max(...prof.map((p) => p[0])) } : null, rev: { a: fr.a, u: fr.u, v: fr.v, O, segs, a0, a1, full, pt } };
  }
  const sphereProfile = (R, from = -90, to = 90, n = 26) => {
    const p = [];
    for (let i = 0; i <= n; i++) { const a = (from + ((to - from) * i) / n) * DEG; p.push([Math.max(0, R * Math.cos(a)), R * Math.sin(a)]); }
    p[0][0] = from <= -90 ? 0 : p[0][0]; p[n][0] = to >= 90 ? 0 : p[n][0];
    return p;
  };

  // 직육면체 O=[x0,x1,y0,y1,z0,z1] 에서 직육면체 조각들(boxes)을 파낸 입체. 조각은 겉면 위에 놓이거나 걸친 것(서로 겹치지 않음).
  function boxMinusBoxes(O, boxes) {
    const faces = [], uniq = (arr) => [...new Set(arr.map((v) => Math.round(v * 1e6) / 1e6))].sort((a, b) => a - b);
    const mk = (d, c, u0, u1, w0, w1) => {
      const u = (d + 1) % 3, w = (d + 2) % 3, P = (uu, ww) => { const a = [0, 0, 0]; a[d] = c; a[u] = uu; a[w] = ww; return v3(a[0], a[1], a[2]); };
      return [P(u0, w0), P(u1, w0), P(u1, w1), P(u0, w1)];
    };
    const unitAxis = (d, sg) => { const a = [0, 0, 0]; a[d] = sg; return v3(a[0], a[1], a[2]); };
    for (let d = 0; d < 3; d++) for (let s = 0; s < 2; s++) {
      const c = O[2 * d + s], u = (d + 1) % 3, w = (d + 2) % 3;
      const rects = boxes.filter((B) => Math.abs(B[2 * d + s] - c) < 1e-9).map((B) => [B[2 * u], B[2 * u + 1], B[2 * w], B[2 * w + 1]]);
      const us = uniq([O[2 * u], O[2 * u + 1]].concat(...rects.map((r) => [r[0], r[1]]))), ws = uniq([O[2 * w], O[2 * w + 1]].concat(...rects.map((r) => [r[2], r[3]])));
      for (let i = 0; i + 1 < us.length; i++) for (let j = 0; j + 1 < ws.length; j++) {
        const cu = (us[i] + us[i + 1]) / 2, cw = (ws[j] + ws[j + 1]) / 2;
        if (rects.some((r) => cu > r[0] && cu < r[1] && cw > r[2] && cw < r[3])) continue;
        const pts = mk(d, c, us[i], us[i + 1], ws[j], ws[j + 1]);
        faces.push({ pts, n: unitAxis(d, s ? 1 : -1), c: centroid(pts), tag: 'out' });
      }
    }
    boxes.forEach((B, bi) => {
      for (let d = 0; d < 3; d++) for (let s = 0; s < 2; s++) {
        const c = B[2 * d + s];
        if (Math.abs(c - O[2 * d + s]) < 1e-9) continue;
        const u = (d + 1) % 3, w = (d + 2) % 3, pts = mk(d, c, B[2 * u], B[2 * u + 1], B[2 * w], B[2 * w + 1]);
        faces.push({ pts, n: unitAxis(d, s ? -1 : 1), c: centroid(pts), tag: 'in', box: bi });
      }
    });
    return { faces, edges: autoEdges(faces) };
  }
  function meshArea(m) {
    let tot = 0;
    m.faces.forEach((f) => { let c = v3(0, 0, 0); for (let i = 0; i < f.pts.length; i++) c = add3(c, cross3(f.pts[i], f.pts[(i + 1) % f.pts.length])); let a = len3(c) / 2; (f.holes || []).forEach((h) => { let hc = v3(0, 0, 0); for (let i = 0; i < h.length; i++) hc = add3(hc, cross3(h[i], h[(i + 1) % h.length])); a -= len3(hc) / 2; }); tot += a; });
    return tot;
  }
  const flipMesh = (m) => Object.assign({}, m, { faces: m.faces.map((f) => Object.assign({}, f, { n: mul3(f.n, -1) })) });
  // 메시 이동·회전
  function xfMesh(m, T) {
    const f = m.faces.map((q) => { const pts = q.pts.map((p) => applyT(T, p)); return Object.assign({}, q, { pts, n: q.n ? mulM(T.R, q.n) : q.n, c: applyT(T, q.c), holes: q.holes ? q.holes.map((h) => h.map((p) => applyT(T, p))) : undefined }); });
    const e = m.edges.map((q) => Object.assign({}, q, { a: applyT(T, q.a), b: applyT(T, q.b) }));
    const out = { faces: f, edges: e, round: m.round ? { c: applyT(T, m.round.c), R: m.round.R * Math.cbrt(Math.abs(T.R[0][0] * (T.R[1][1] * T.R[2][2] - T.R[1][2] * T.R[2][1]) - T.R[0][1] * (T.R[1][0] * T.R[2][2] - T.R[1][2] * T.R[2][0]) + T.R[0][2] * (T.R[1][0] * T.R[2][1] - T.R[1][1] * T.R[2][0]))) } : null };
    if (m.rev) {
      const r = m.rev;
      out.rev = Object.assign({}, r, { a: mulM(T.R, r.a), u: mulM(T.R, r.u), v: mulM(T.R, r.v), O: applyT(T, r.O) });
      out.rev.pt = (rr, y, th) => add3(out.rev.O, add3(mul3(out.rev.a, y), mul3(add3(mul3(out.rev.u, Math.cos(th)), mul3(out.rev.v, Math.sin(th))), rr)));
    }
    return out;
  }
  const mergeMeshes = (list) => ({ faces: [].concat(...list.map((m) => m.faces)), edges: [].concat(...list.map((m) => m.edges)) });

  // 회전체의 윤곽선(보는 방향에 수직인 점들)
  function silLines(m, V) {
    const R = m.rev, out = [];
    if (!R) return out;
    const ux = dot3(R.u, V), vx = dot3(R.v, V), aw = dot3(R.a, V), A2 = Math.hypot(ux, vx);
    if (A2 < 1e-6) return out;
    const phi = Math.atan2(vx, ux);
    const inRange = (th) => { if (R.full) return true; let x = (th - R.a0) % TAU; if (x < 0) x += TAU; return x <= R.a1 - R.a0 + 1e-9; };
    R.segs.forEach((sg) => {
      for (const br of [1, -1]) {
        const ps = [];
        for (let e = 0; e < 2; e++) {
          const nn = sg.nE[e], r = e ? sg.r1 : sg.r0, y = e ? sg.y1 : sg.y0;
          if (r < 1e-9) { if (Math.abs(nn.nr) < 0.15) { ps.length = 0; break; } ps.push(R.pt(0, y, 0)); continue; } // 구의 극은 윤곽 위의 점이 아니에요(원뿔의 꼭짓점과 달라요)
          if (Math.abs(nn.nr) < 1e-6) { ps.length = 0; break; }
          const kap = (-nn.ny * aw) / (nn.nr * A2);
          if (Math.abs(kap) > 1) { ps.length = 0; break; }
          const th = phi + br * Math.acos(kap);
          if (!inRange(th)) { ps.length = 0; break; }
          ps.push(R.pt(r, y, th));
        }
        if (ps.length === 2 && len3(sub3(ps[0], ps[1])) > 1e-6) out.push(ps);
      }
    });
    return out;
  }

  /* ------------------------------------------------------------ 전개도 (경첩으로 이은 조각들) */
  // piece: { pts, n, parent, hinge:[p,q], tag, edges:[{i, kind:'c'|'s', nb}] }
  function netBuild(pieces, root) {
    pieces.forEach((pc, k) => { pc.c = centroid(pc.pts); pc.k = k; });
    pieces.forEach((pc, k) => {
      if (pc.parent == null || pc.parent < 0) { pc.beta = 0; return; }
      const par = pieces[pc.parent], e = unit3(sub3(pc.hinge[1], pc.hinge[0]));
      pc.beta = Math.atan2(dot3(cross3(pc.n, par.n), e), dot3(pc.n, par.n));
    });
    return { pieces, root };
  }
  // t=0 닫힌 입체, t=1 평평한 전개도. 반환: 조각마다의 변환
  function netPose(net, t) {
    const { pieces, root } = net, memo = [];
    const get = (k) => {
      if (memo[k]) return memo[k];
      const pc = pieces[k];
      let T;
      if (pc.parent == null || pc.parent < 0) T = Tid();
      else T = compose(get(pc.parent), rotAbout(pc.hinge[0], unit3(sub3(pc.hinge[1], pc.hinge[0])), pc.beta * t));
      memo[k] = T;
      return T;
    };
    const Ts = pieces.map((_, k) => get(k));
    // 전체를 x축으로 돌려 뿌리 조각의 면이 (t=1에서) 정면을 보게 합니다
    const rn = pieces[root].n, psi = Math.atan2(rn.y, rn.z), rc = pieces[root].c;
    const Gt = rotAbout(rc, v3(1, 0, 0), psi * t);
    return Ts.map((T) => compose(Gt, T));
  }
  // 조각의 점을 변환 위치로
  const netAt = (net, poses, k, p) => applyT(poses[k], p);

  /* ------------------------------------------------------------ 장면 도우미 */
  function fitBox(b, box, o = {}) {
    const narrow = b.W < 560;
    const aw = Math.max(10, b.W - b.insets.left - b.insets.right), ah = Math.max(10, b.H - b.insets.top - b.insets.bottom);
    const pp = b.pad * Math.min(aw, ah), W = aw - 2 * pp, H = ah - 2 * pp;
    const base = b.thumb ? 5 : narrow ? 30 : 46;
    const pad = b.thumb ? { l: 5, r: 5, t: 5, b: 5 } : { l: o.l == null ? base : o.l, r: o.r == null ? base : o.r, t: o.t == null ? base : o.t, b: o.b == null ? base : o.b };
    const bw = Math.max(1e-6, box.x1 - box.x0), bh = Math.max(1e-6, box.y1 - box.y0);
    let k = Math.max(3, Math.min((W - pad.l - pad.r) / bw, (H - pad.t - pad.b) / bh));
    if (o.maxK) k = Math.min(k, o.maxK);
    b.focus = { x: [box.x0 - pad.l / k, box.x1 + pad.r / k], y: [box.y0 - pad.t / k, box.y1 + pad.b / k] };
    return b.k;
  }
  const bboxOf = (pts) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }); return { x0, y0, x1, y1 }; };

  // 같은 방향 면들을 한 번에 칠해 이음매가 생기지 않게 합니다
  function fillPolys(b, polys, color, alpha, evenodd) {
    const c = b.ctx;
    c.save();
    c.beginPath();
    polys.forEach((pts) => {
      let area = 0;
      const ss = pts.map((p) => b.toS(p));
      for (let i = 0; i < ss.length; i++) { const p = ss[i], q = ss[(i + 1) % ss.length]; area += p.x * q.y - q.x * p.y; }
      const arr = evenodd || area >= 0 ? ss : ss.slice().reverse();
      arr.forEach((s, i) => (i ? c.lineTo(s.x, s.y) : c.moveTo(s.x, s.y)));
      c.closePath();
    });
    c.fillStyle = b.color(color, alpha);
    c.fill(evenodd ? 'evenodd' : 'nonzero');
    c.restore();
  }

  function scene3(b, s, C, o = {}) {
    const yaw = o.yaw != null ? o.yaw : s.svYaw == null ? 28 : s.svYaw, pitch = o.pitch != null ? o.pitch : s.svPitch == null ? 22 : s.svPitch;
    const cam = camOf(yaw, pitch);
    const D = { b, s, C, cam, vw: v3(cam.sy * cam.cp, cam.sp, cam.cy * cam.cp), boxes: [], narrow: b.W < 560 };
    D.P = (p) => { const q = proj(cam, p); return { x: q.x, y: q.y }; };
    D.depth = (p) => proj(cam, p).d;
    D.hx = (d) => v3(d * cam.cy, 0, -d * cam.sy); // 화면에서 정확히 가로로 d 만큼
    D.facing = (n) => dot3(n, D.vw) > 1e-6;
    D.fit = (pts3, extra, opt) => {
      const ps = pts3.map(D.P).concat(extra || []);
      return fitBox(b, bboxOf(ps), opt || {});
    };
    D.fs = (v) => (D.narrow ? v * 0.93 : v);
    /* ---- 선·면·점 */
    D.line = (p, q, color = 'ink', width = 2.6, op = {}) => b.path([D.P(p), D.P(q)], { color, width, dash: op.dash, alpha: op.alpha, glow: op.glow, ref: op.ref });
    D.path = (pts, color = 'ink', width = 2.6, op = {}) => b.path(pts.map(D.P), { color, width, dash: op.dash, alpha: op.alpha, close: op.close, fill: op.fill, fillAlpha: op.fillAlpha, glow: op.glow, ref: op.ref });
    D.panel = (pts, fill, fa = 0.2, edge = null, ew = 2.4, op = {}) => b.path(pts.map(D.P), { close: true, fill, fillAlpha: fa, color: edge, width: ew, dash: op.dash, alpha: op.alpha, ref: op.ref });
    D.dot = (p, color = 'ink', r = 4.5) => b.point(D.P(p), { color, r });
    D.circ = (c, u, v, r, t0 = 0, t1 = TAU, n = 72) => { const out = []; for (let i = 0; i <= n; i++) { const t = t0 + ((t1 - t0) * i) / n; out.push(add3(c, add3(mul3(u, r * Math.cos(t)), mul3(v, r * Math.sin(t))))); } return out; };
    D.disc = (c, u, v, r, fill, fa = 0.25, edge = null, ew = 2.4, op = {}) => D.panel(D.circ(c, u, v, r, 0, TAU, 72), fill, fa, edge, ew, op);
    /* ---- 입체 그리기 */
    D.body = (bd) => {
      const m = bd.mesh, V = D.vw, P = D.P, fr = m.faces.map((f) => (f.n ? dot3(f.n, V) : 1));
      const order = [];
      m.faces.forEach((f, i) => { if (fr[i] > 1e-6 && !f.hide) order.push(i); });
      order.sort((a, c) => D.depth(m.faces[a].c) - D.depth(m.faces[c].c));
      let cur = null, group = [];
      const flush = () => { if (group.length) fillPolys(b, group, cur.fill, cur.alpha); group = []; };
      order.forEach((i) => {
        const f = m.faces[i], st = (bd.faceStyle && bd.faceStyle(f, i)) || {}, fill = st.fill || bd.fill;
        if (!fill || st.skip) return;
        const base = st.alpha != null ? st.alpha : bd.alpha == null ? 0.2 : bd.alpha, q = Math.min(4, Math.floor(clamp(fr[i], 0, 0.999) * 5));
        const alpha = bd.flat ? base : base * (0.72 + 0.1 * q);
        if (f.holes) { flush(); fillPolys(b, [f.pts.map(P)].concat(f.holes.map((h) => h.map(P))), fill, alpha, true); return; }
        const key = fill + '|' + alpha.toFixed(3);
        if (!cur || cur.key !== key) { flush(); cur = { key, fill, alpha }; }
        group.push(f.pts.map(P));
      });
      flush();
      // 모서리: 가려진 것은 점선, 보이는 것은 실선 (같은 고리에 속한 조각은 이어서)
      const vis = (fi) => fi >= 0 && fr[fi] > 1e-6;
      const color = bd.edge || 'ink', w0 = bd.edgeW || 2.6;
      const run = (list, hidden) => {
        let pts = null, last = null, key = null;
        const end = () => { if (pts && pts.length > 1) b.path(pts, { color: last.color, width: last.width, dash: hidden ? [6, 5] : undefined, alpha: last.alpha }); pts = null; };
        list.forEach((e) => {
          const es = (bd.edgeFn && bd.edgeFn(e)) || {};
          if (es.skip) { end(); return; }
          const st = { color: es.color || color, width: es.width || (e.thin ? Math.max(1.3, w0 * 0.55) : w0), alpha: (es.alpha != null ? es.alpha : e.thin ? 0.75 : 1) * (hidden ? (bd.hiddenAlpha == null ? 0.7 : bd.hiddenAlpha) : 1) };
          const same = pts && e.chain && e.chain === key && last.color === st.color && last.width === st.width && last.alpha === st.alpha;
          if (!same) { end(); pts = [P(e.a)]; key = e.chain || null; }
          pts.push(P(e.b));
          last = st;
          if (!e.chain) end();
        });
        end();
      };
      const hid = [], shown = [];
      m.edges.forEach((e) => {
        if (e.smooth) { if (vis(e.f1) !== vis(e.f2)) shown.push(e); return; }
        (vis(e.f1) || vis(e.f2) || (e.f1 < 0 && e.f2 < 0) ? shown : hid).push(e);
      });
      if (bd.hidden !== false) run(hid, true);
      run(shown, false);
      if (m.round && bd.sil !== false) b.circle(P(m.round.c), m.round.R, { color, width: w0, alpha: bd.edgeAlpha == null ? 1 : bd.edgeAlpha });
      else if (m.rev && bd.sil !== false) silLines(m, V).forEach(([p, q]) => b.path([P(p), P(q)], { color, width: w0, alpha: 1 }));
    };
    // 깊이 순으로 여러 입체를 그립니다 (먼 것부터)
    D.bodies = (list) => list.slice().sort((a, c) => D.depth(centroid(a.mesh.faces.map((f) => f.c))) - D.depth(centroid(c.mesh.faces.map((f) => f.c)))).forEach((bd) => D.body(bd));
    /* ---- 글자 */
    D.obstacle = (p, r = 8, fig) => { const s0 = b.toS(fig ? p : D.P(p)); D.boxes.push({ x0: s0.x - r, x1: s0.x + r, y0: s0.y - r, y1: s0.y + r }); };
    D.tag = (p3, str, op = {}) => {
      if (str == null || str === '') return;
      const p = op.fig ? p3 : D.P(p3), size = D.fs(op.size || 15);
      b.text(p, str, { dx: op.dx || 0, dy: op.dy || 0, color: op.color || 'ink', size, weight: op.weight || 800, align: op.align || 'center', baseline: op.baseline || 'middle', alpha: op.alpha, ref: op.ref });
      const eff = size * b.fs * b._ts(), w = textW(str, eff) + 4, h = eff * 1.2, s0 = b.toS(p), cx = s0.x + (op.dx || 0), cy = s0.y + (op.dy || 0);
      D.boxes.push({ x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 });
    };
    // 겹치지 않는 자리를 찾아 놓는 글자. op.dir(화면 방향) 앞쪽 우선, op.at = [[dx,dy]…] 화면 픽셀 후보
    D.label = (p3, str, op = {}) => {
      if (str == null || str === '') return;
      const p = op.fig ? p3 : D.P(p3), size = D.fs(op.size || 15), eff = size * b.fs * b._ts();
      const w = textW(str, eff) + 4, h = eff * 1.2, s0 = b.toS(p);
      const bx = (cx, cy) => ({ x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 });
      const area = (a, c) => Math.max(0, Math.min(a.x1, c.x1) - Math.max(a.x0, c.x0)) * Math.max(0, Math.min(a.y1, c.y1) - Math.max(a.y0, c.y0));
      const lo = { x: b.insets.left + 3, y: b.insets.top + 3 }, hi = { x: b.W - b.insets.right - 3, y: b.H - b.insets.bottom - 3 };
      let cands = [];
      if (op.at) cands = op.at.map((q) => [s0.x + q[0], s0.y + q[1]]);
      else {
        let ux = op.dir ? op.dir.x : 0, uy = op.dir ? op.dir.y : -1;
        const l = Math.hypot(ux, uy) || 1; ux /= l; uy /= l;
        const g = op.gap == null ? 11 : op.gap;
        [0, 40, -40, 80, -80, 120, -120, 160, 180, 20, -20, 60, -60].forEach((deg) => {
          const a = Math.atan2(uy, ux) + deg * DEG, dx = Math.cos(a), dy = Math.sin(a), d = g + Math.abs(dx) * w / 2 + Math.abs(dy) * h / 2;
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
      b.text(p, str, { dx: best[0] - s0.x, dy: best[1] - s0.y, color: op.color || 'ink', size, weight: 800, align: 'center', baseline: 'middle', alpha: op.alpha, ref: op.ref });
    };
    D.out = (p3, c3) => { const a = D.P(p3), c = D.P(c3), dx = a.x - c.x, dy = a.y - c.y, l = Math.hypot(dx, dy); return l < 1e-6 ? { x: 0, y: -1 } : { x: dx / l, y: dy / l }; };
    // 선분 p-q 의 길이 표시: 가운데에 글자(옆으로 약간 비켜), side 는 화면 방향 단위벡터(어느 쪽으로 비킬지)
    D.elabel = (p3, q3, str, op = {}) => {
      const a = D.P(p3), c = D.P(q3), dx = c.x - a.x, dy = c.y - a.y, l = Math.hypot(dx, dy) || 1;
      let nx = -dy / l, ny = dx / l;
      const want = op.side || (op.from ? D.out(mid3(p3, q3), op.from) : { x: 0, y: -1 });
      if (nx * want.x + ny * want.y < 0) { nx = -nx; ny = -ny; }
      D.label(mid3(p3, q3), str, { dir: { x: nx, y: ny }, gap: op.gap == null ? 7 : op.gap, color: op.color || 'ink', size: op.size || 15 });
    };
    // 같은 길이 표시(눈금)
    D.tick = (p, q, count = 1, color = 'amber') => b.ticks(D.P(p), D.P(q), { color, count, size: 7 });
    // 직각 표시: 점 O 에서 방향 a, c
    D.right = (O, a, c, size = 0.3, color = 'amber') => {
      const ua = mul3(unit3(a), size), uc = mul3(unit3(c), size);
      const p0 = D.P(O), p1 = D.P(add3(O, ua)), p2 = D.P(add3(add3(O, ua), uc)), p3 = D.P(add3(O, uc));
      b.path([p0, p1, p2, p3], { close: true, fill: color, fillAlpha: 0.22, color: null });
      b.path([p1, p2, p3], { color, width: 2.4 });
    };
    // 두 방향 사이의 각 호 (같은 평면)
    D.arc3 = (O, a, c, r, color = 'sky', label) => {
      const ua = unit3(a), uc = unit3(c), cs = clamp(dot3(ua, uc), -1, 1), th = Math.acos(cs);
      if (th < 0.02) return;
      const w = unit3(sub3(uc, mul3(ua, cs))), pts = [];
      for (let i = 0; i <= 24; i++) { const t = (th * i) / 24; pts.push(D.P(add3(O, mul3(add3(mul3(ua, Math.cos(t)), mul3(w, Math.sin(t))), r)))); }
      b.path(pts, { color, width: 2.4 });
      if (label) D.label(add3(O, mul3(add3(mul3(ua, Math.cos(th / 2)), mul3(w, Math.sin(th / 2))), r * 1.5)), label, { color, dir: { x: 0, y: -1 } });
    };
    // 화살표(화면 좌표계 그림 평면)
    D.arrow = (p0, p1, color = 'amber', width = 3) => {
      const dx = p1.x - p0.x, dy = p1.y - p0.y, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, k = b.k || 40, hs = 11 / k;
      b.path([p0, p1], { color, width });
      b.path([{ x: p1.x - ux * hs - uy * hs * 0.55, y: p1.y - uy * hs + ux * hs * 0.55 }, p1, { x: p1.x - ux * hs + uy * hs * 0.55, y: p1.y - uy * hs - ux * hs * 0.55 }], { color, width });
    };
    return D;
  }

  /* ------------------------------------------------------------ 전개도 그리기 */
  // pose 를 적용한 조각들을 그립니다. style(piece) → {fill, alpha, edge, ew, skipEdges}
  function netDraw(D, net, poses, style) {
    const { b } = D;
    const tp = net.pieces.map((pc, k) => ({ pc, k, pts: pc.pts.map((p) => applyT(poses[k], p)), n: mulM(poses[k].R, pc.n) }));
    tp.forEach((q) => { q.c = centroid(q.pts); q.front = dot3(q.n, D.vw) > 1e-6; });
    const order = tp.slice().sort((a, c) => D.depth(a.c) - D.depth(c.c));
    // 채우기
    order.forEach((q) => {
      const st = (style && style(q.pc, q.k)) || {};
      if (st.skip) return;
      const fill = st.fill || 'sky', alpha = st.alpha == null ? 0.22 : st.alpha;
      if (q.front) fillPolys(b, [q.pts.map(D.P)], fill, alpha);
      else if (st.back !== false) fillPolys(b, [q.pts.map(D.P)], fill, alpha * 0.35);
    });
    // 모서리
    order.forEach((q) => {
      const st = (style && style(q.pc, q.k)) || {};
      if (st.skip) return;
      const col = st.edge || 'ink', ew = st.ew || 2.4;
      q.pc.edges.forEach((e) => {
        const nb = e.nb != null && e.nb >= 0 ? tp[e.nb] : null;
        const a = q.pts[e.i], c = q.pts[(e.i + 1) % q.pts.length];
        if (e.kind === 's') {
          if (nb && nb.front !== q.front) b.path([D.P(a), D.P(c)], { color: col, width: ew });
          return;
        }
        const seen = q.front || (nb && nb.front);
        b.path([D.P(a), D.P(c)], { color: col, width: seen ? ew : ew * 0.8, dash: seen ? undefined : [6, 5], alpha: seen ? 1 : 0.7 });
      });
    });
    return tp;
  }

  /* ---- 전개도 조각 만들기: 기둥·뿔·뿔대 (밑면 다각형 base=[[x,z]…], smooth[i]=그 꼭짓점이 곡면 위의 점인가) */
  function rotateBaseFront(base, m, extraSmooth) {
    // 변 m 의 바깥 법선이 +z 를 향하도록 밑면 전체를 원점 둘레로 돌립니다
    const n = base.length, a = base[m], c = base[(m + 1) % n];
    let area2 = 0;
    for (let i = 0; i < n; i++) { const p = base[i], q = base[(i + 1) % n]; area2 += p[0] * q[1] - q[0] * p[1]; }
    let nx = c[1] - a[1], nz = -(c[0] - a[0]);
    if (area2 < 0) { nx = -nx; nz = -nz; }
    const ang = Math.atan2(nx, nz); // +z 로 가져오려면 -ang 만큼
    const cs = Math.cos(-ang), sn = Math.sin(-ang);
    return base.map((p) => [p[0] * cs + p[1] * sn, -p[0] * sn + p[1] * cs]);
  }
  /**
   * 기둥(scale=1)·뿔(0)·뿔대(0<scale<1)의 전개 조각.
   * base: 밑면 꼭짓점(x,z), h: 높이, scale: 윗면 비율, smooth: 꼭짓점이 곡면 위인지(없으면 모두 각진 꼭짓점), root: 옆면 번호(기본 가운데)
   * 반환 { net, lat:[조각 번호], bot, top, root }
   */
  function solidNet(base0, h, scale, smooth, root) {
    const n = base0.length;
    const m = root == null ? Math.floor(n / 2) : root;
    const base = rotateBaseFront(base0, m);
    const cx = base.reduce((s, p) => s + p[0], 0) / n, cz = base.reduce((s, p) => s + p[1], 0) / n;
    const A = base.map((p) => v3(p[0], 0, p[1])), B = base.map((p) => v3(cx + (p[0] - cx) * scale, h, cz + (p[1] - cz) * scale));
    const sm = smooth || base.map(() => false), apex = scale < 1e-9, ctr = v3(cx, h / 2, cz);
    const pieces = [];
    let area2 = 0;
    for (let i = 0; i < n; i++) { const p = base[i], q = base[(i + 1) % n]; area2 += p[0] * q[1] - q[0] * p[1]; }
    const outN = (pts, k) => {
      if (scale > 1 - 1e-9) { // 기둥: 밑면 다각형의 방향으로 바깥 법선을 정합니다(오목한 밑면도 안전)
        const p = base[k], q = base[(k + 1) % n], dx = q[0] - p[0], dz = q[1] - p[1];
        return unit3(area2 > 0 ? v3(dz, 0, -dx) : v3(-dz, 0, dx));
      }
      const n0 = newellN(pts), c = centroid(pts);
      return dot3(n0, sub3(c, ctr)) < 0 ? mul3(n0, -1) : n0;
    };
    const latIdx = [];
    for (let k = 0; k < n; k++) {
      const k1 = (k + 1) % n;
      let pts, edges;
      if (apex) {
        pts = [A[k], A[k1], B[0]];
        edges = [{ i: 0, kind: 'c' }, { i: 1, kind: sm[k1] ? 's' : 'c', nb: -2 }, { i: 2, kind: sm[k] ? 's' : 'c', nb: -3 }];
      } else {
        pts = [A[k], A[k1], B[k1], B[k]];
        edges = [{ i: 0, kind: 'c' }, { i: 1, kind: sm[k1] ? 's' : 'c', nb: -2 }, { i: 2, kind: 'c' }, { i: 3, kind: sm[k] ? 's' : 'c', nb: -3 }];
      }
      latIdx.push(pieces.length);
      pieces.push({ pts, n: outN(pts, k), tag: 'lat', k, edges, parent: -1, hinge: null });
    }
    // 이웃 옆면 연결(nb: -2 오른쪽 이웃, -3 왼쪽 이웃)
    for (let k = 0; k < n; k++) pieces[latIdx[k]].edges.forEach((e) => { if (e.nb === -2) e.nb = latIdx[(k + 1) % n]; else if (e.nb === -3) e.nb = latIdx[(k + n - 1) % n]; });
    // 경첩: 뿌리 옆면에서 양쪽으로 한 장씩 이어 붙입니다
    const hingeOf = (k1) => (apex ? [A[k1], B[0]] : [A[k1], B[k1]]); // 옆면 k1-1 과 k1 이 만나는 모서리
    const nR = Math.ceil((n - 1) / 2), nL = n - 1 - nR;
    for (let d = 1; d <= nR; d++) { const kr = (m + d) % n, pr = (m + d - 1) % n; pieces[latIdx[kr]].parent = latIdx[pr]; pieces[latIdx[kr]].hinge = hingeOf(kr); }
    for (let d = 1; d <= nL; d++) { const kl = (m - d + n) % n, pl = (m - d + 1 + n) % n; pieces[latIdx[kl]].parent = latIdx[pl]; pieces[latIdx[kl]].hinge = hingeOf(pl); }
    const botPts = A.slice().reverse();
    const bot = { pts: botPts, n: v3(0, -1, 0), tag: 'bot', parent: latIdx[m], hinge: [A[m], A[(m + 1) % n]], edges: [], k: -1 };
    // 밑면의 변 i(원래 순서의 변 e)는 역순이라 위치가 다릅니다
    for (let i = 0; i < n; i++) {
      const a = botPts[i], c = botPts[(i + 1) % n];
      // 이 변이 어느 옆면의 밑변인지
      let nbk = -1;
      for (let k = 0; k < n; k++) if ((keyOf(A[k]) === keyOf(a) && keyOf(A[(k + 1) % n]) === keyOf(c)) || (keyOf(A[k]) === keyOf(c) && keyOf(A[(k + 1) % n]) === keyOf(a))) nbk = k;
      bot.edges.push({ i, kind: 'c', nb: nbk >= 0 ? latIdx[nbk] : -1 });
    }
    const botIdx = pieces.length;
    pieces.push(bot);
    let topIdx = -1;
    if (!apex) {
      const top = { pts: B.slice(), n: v3(0, 1, 0), tag: 'top', parent: latIdx[m], hinge: [B[m], B[(m + 1) % n]], edges: [], k: -2 };
      for (let i = 0; i < n; i++) top.edges.push({ i, kind: 'c', nb: latIdx[i] });
      topIdx = pieces.length;
      pieces.push(top);
    }
    for (let k = 0; k < n; k++) { pieces[latIdx[k]].edges[0].nb = botIdx; if (!apex) pieces[latIdx[k]].edges[2].nb = topIdx; }
    const net = netBuild(pieces, latIdx[m]);
    return { net, lat: latIdx, bot: botIdx, top: topIdx, root: latIdx[m], A, B, base };
  }
  // 원 밑면 N각형 (반지름 r)
  const circleBase = (r, N = 36) => { const p = []; for (let i = 0; i < N; i++) { const a = (TAU * i) / N; p.push([r * Math.cos(a), r * Math.sin(a)]); } return p; };
  // 부채꼴 밑면 (반지름 r, 중심각 deg): 꼭짓점 0 이 중심. smooth 는 호 위의 안쪽 꼭짓점
  function sectorBase(r, deg, N) {
    N = N || Math.max(8, Math.round(deg / 10));
    const p = [[0, 0]], sm = [false];
    for (let i = 0; i <= N; i++) { const a = (deg * DEG * i) / N; p.push([r * Math.cos(a), r * Math.sin(a)]); sm.push(i > 0 && i < N); }
    return { pts: p, smooth: sm };
  }

  const cube8 = (c, R) => { const o = []; for (const x of [-R, R]) for (const y of [-R, R]) for (const z of [-R, R]) o.push(add3(c, v3(x, y, z))); return o; };
  Object.assign(G, {
    boxMinusBoxes, meshArea, flipMesh, cube8, PI, DEG, TAU, clamp, ease, seg01, lin01, v3, add3, sub3, mul3, dot3, cross3, len3, unit3, lerp3, mid3, centroid, rotM, mulM, rotAbout, rotYAt, shiftT, compose, applyT, Tid,
    camOf, proj, textW, polyMesh, prismMesh, boxMesh, loftMesh, revolveMesh, sphereProfile, xfMesh, mergeMeshes, silLines, netBuild, netPose, netAt, netDraw, solidNet, circleBase, sectorBase,
    fitBox, bboxOf, fillPolys, scene3, newellN
  });
})();
