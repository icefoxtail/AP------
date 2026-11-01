/* ==========================================================================
   중1 · 회전체 — 3차원 도우미 (solid3d.js)  ※ 이 실험실 전용(공유 도구 아님)
   - 회전체(원기둥·원뿔·원뿔대·구 …)를 "띠(band) 쌓기"로 정의하고, 평행투영으로 그립니다.
     띠 하나 = 높이 y0~y1, 아랫면 반지름 r0, 윗면 반지름 r1 (원기둥 r0=r1, 원뿔 r1=0).
   - 선은 최소로: 옆 윤곽 2줄(두 원의 접선) + 밑면·윗면 타원 + 점선(가려진 모서리). 위도·경도선 수십 개를 그리지 않습니다.
   - 평면도형을 제자리에서 돌려 만든 자취는 같은 도형을 각도마다 겹쳐 그리는 부채꼴 다발(fan)로 보입니다.
   - 그리는 곳(sink)은 둘: 무대(canvas)와 보기 그림(svg). 같은 그리기 코드가 둘 다에 그립니다.
   - 좌표: 모델은 (x 반지름 방향, y 회전축, z 깊이). 눕힌 장면(lay)은 축을 화면 가로로 옮겨 놓습니다.
     화면 y 는 위쪽이 +(cartesian 무대).  depth 가 클수록 보는 사람에 가깝습니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SO;
  if (!G) return;
  const { PI, DEG, clamp, fmtN, T } = G;

  /* ------------------------------------------------------------------ 카메라 · 투영 */
  const camOf = (s) => {
    const y = (s.soLay ? (s.soYawL == null ? -32 : s.soYawL) : (s.soYaw == null ? 0 : s.soYaw)) * DEG, p = (s.soPitch == null ? 22 : s.soPitch) * DEG;
    return { cy: Math.cos(y), sy: Math.sin(y), cp: Math.cos(p), sp: Math.sin(p) };
  };
  function proj(cam, lay, p) {
    let x = p.x, y = p.y, z = p.z;
    if (lay === 'z') { const t = y; y = -z; z = t; } // 모델 축(y)을 화면 안쪽(z)으로: 바퀴처럼 서 있는 원기둥
    else if (lay) { const t = x; x = y; y = t; z = -z; } // 모델 축(y)을 화면 가로(x)로
    const x1 = x * cam.cy - z * cam.sy, z1 = x * cam.sy + z * cam.cy;
    return { x: x1, y: y * cam.cp - z1 * cam.sp, d: y * cam.sp + z1 * cam.cp };
  }

  /* ------------------------------------------------------------------ 그리는 곳 */
  function boardSink(b) {
    return {
      path: (pts, o = {}) => b.path(pts, { color: o.color === undefined ? 'ink' : o.color, width: o.width || 2.6, dash: o.dash, alpha: o.alpha, close: o.close, fill: o.fill, fillAlpha: o.fillAlpha, ref: o.ref }),
      text: (p, str, color, o = {}) => T(b, p, str, color, o)
    };
  }
  const CSS = { ink: 'var(--text)', muted: 'var(--text-3)', halo: 'var(--card-2)' };
  const css = (c) => CSS[c] || `var(--m-${c})`;
  function svgSink() {
    const ops = [];
    return {
      ops,
      path: (pts, o = {}) => { ops.push({ t: 'p', pts, o }); },
      text: (p, str, color, o = {}) => { ops.push({ t: 't', p, str, color, o }); },
      toSvg(w, h, pad = 8) {
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        ops.forEach((q) => { const ps = q.t === 'p' ? q.pts : [q.p]; ps.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }); });
        const bw = Math.max(1e-6, x1 - x0), bh = Math.max(1e-6, y1 - y0);
        const k = Math.min((w - 2 * pad) / bw, (h - 2 * pad) / bh);
        const ox = (w - bw * k) / 2 - x0 * k, oy = (h - bh * k) / 2 + y1 * k;
        const X = (x) => (x * k + ox).toFixed(1), Y = (y) => (oy - y * k).toFixed(1);
        let out = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">`;
        ops.forEach((q) => {
          if (q.t === 'p') {
            const o = q.o, d = q.pts.map((p, i) => (i ? 'L' : 'M') + X(p.x) + ' ' + Y(p.y)).join('') + (o.close ? 'Z' : '');
            const fill = o.fill ? `fill="${css(o.fill)}" fill-opacity="${o.fillAlpha == null ? 1 : o.fillAlpha}"` : 'fill="none"';
            const st = o.color === null ? 'stroke="none"' : `stroke="${css(o.color || 'ink')}" stroke-width="${(o.width || 2.6) * 0.8}" stroke-linecap="round" stroke-linejoin="round"${o.alpha != null ? ` stroke-opacity="${o.alpha}"` : ''}${o.dash ? ' stroke-dasharray="4 3"' : ''}`;
            out += `<path d="${d}" ${fill} ${st}/>`;
          } else {
            const o = q.o, sz = Math.max(12, (o.size || 14) * 0.95);
            out += `<text x="${(+X(q.p.x) + (o.dx || 0)).toFixed(1)}" y="${(+Y(q.p.y) + (o.dy || 0)).toFixed(1)}" font-size="${sz}" font-weight="800" fill="${css(q.color || 'ink')}" text-anchor="middle" dominant-baseline="middle" style="paint-order:stroke;stroke:var(--card-2);stroke-width:3px">${G.esc(q.str)}</text>`;
          }
        });
        return out + '</svg>';
      }
    };
  }

  /* ------------------------------------------------------------------ 그리기 틀 */
  function mk(cam, lay, g, xf) {
    xf = xf || { k: 1, ox: 0, oy: 0 };
    const D = { cam, lay, g, k: xf.k };
    D.P3 = (p) => { const q = proj(cam, lay, p); return { x: q.x * xf.k + xf.ox, y: q.y * xf.k + xf.oy, d: q.d }; };
    D.P = (p) => { const q = D.P3(p); return { x: q.x, y: q.y }; };
    D.pol = (rho, y, th) => ({ x: rho * Math.cos(th), y, z: rho * Math.sin(th) });
    D.lab = (p3, str, color, o) => g.text(D.P(p3), str, color, o);
    D.line = (p, q, color, width, o = {}) => g.path([D.P(p), D.P(q)], { color, width, dash: o.dash, alpha: o.alpha });
    D.poly3 = (pts, o) => g.path(pts.map(D.P), o);
    D.unproj = (wx, wy) => { // 무대 좌표 → 반지름 방향 평면(z=0)의 (ρ, y) (눕히지 않은 장면)
      const rho = wx / (Math.abs(cam.cy) < 0.2 ? 0.2 : cam.cy);
      return { rho, y: (wy + rho * cam.sy * cam.sp) / Math.max(0.2, cam.cp) };
    };
    return D;
  }
  const ctx = (b, s, o = {}) => mk(camOf(s), o.lay || false, boardSink(b), o.k ? { k: o.k, ox: o.ox || 0, oy: o.oy || 0 } : null);
  const nullCtx = (D) => { const E = Object.create(D); E.g = { path() {}, text() {} }; return E; };
  const svgCtx = (yaw = -25, pitch = 20, lay = false) => { const g = svgSink(); const D = mk(camOf({ soYaw: yaw, soPitch: pitch }), lay, g); D.svg = g; return D; };

  /* ------------------------------------------------------------------ 기하 */
  const ringP = (D, rho, y, a0 = 0, a1 = 2 * PI, n = 72) => {
    const out = [];
    if (rho < 1e-9) { const q = D.P3(D.pol(0, y, 0)); return [{ x: q.x, y: q.y, d: q.d }]; }
    for (let i = 0; i <= n; i++) { const q = D.P3(D.pol(rho, y, a0 + (a1 - a0) * i / n)); out.push({ x: q.x, y: q.y, d: q.d }); }
    return out;
  };
  function hull(P) {
    const p = P.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    if (p.length < 3) return p;
    const cr = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 1e-9) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 1e-9) up.pop(); up.push(q); }
    up.pop(); lo.pop();
    return lo.concat(up);
  }
  // 두 원(점) 띠의 옆 윤곽(두 접선): 아랫원 점과 윗원 점을 잇는 볼록껍질의 변
  function tangents(Bp, Tp) {
    const pts = Bp.map((q) => ({ x: q.x, y: q.y, tag: 'B' })).concat(Tp.map((q) => ({ x: q.x, y: q.y, tag: 'T' })));
    const h = hull(pts), out = [];
    for (let i = 0; i < h.length; i++) { const a = h[i], c = h[(i + 1) % h.length]; if (a.tag !== c.tag) out.push([a, c]); }
    return { hull: h, lines: out };
  }
  const centerD = (D, y) => D.P3(D.pol(0, y, 0)).d;
  // 원둘레를 가까운 쪽(실선)과 먼 쪽(점선)으로 나눕니다.
  function splitRing(D, rho, y) {
    const pts = ringP(D, rho, y), c = centerD(D, y);
    const near = [], far = [];
    let cur = null, curNear = null;
    pts.forEach((q) => {
      const nr = q.d > c;
      if (cur === null || nr !== curNear) { cur = [q]; curNear = nr; (nr ? near : far).push(cur); } else cur.push(q);
    });
    return { near, far, all: pts };
  }

  /* ------------------------------------------------------------------ 띠 쌓기 그리기 */
  function drawBands(D, bands, o = {}) {
    const g = D.g, col = o.color || 'sky', fa = o.fillAlpha == null ? 0.14 : o.fillAlpha, w = o.width || 3;
    const ord = bands.map((bd, i) => ({ bd, i, d: centerD(D, (bd.y0 + bd.y1) / 2) })).sort((a, c) => a.d - c.d);
    const capVis = (y, sg) => centerD(D, y + sg) - centerD(D, y) > 0;
    const post = [];
    ord.forEach(({ bd, i }) => {
      const Bp = ringP(D, bd.r0, bd.y0), Tp = ringP(D, bd.r1, bd.y1);
      const { hull: h, lines } = tangents(Bp, Tp);
      g.path(h, { close: true, fill: 'halo', color: null });
      g.path(h, { close: true, fill: col, fillAlpha: fa, color: null });
      const loExp = i === 0 || bands[i - 1].r1 < bd.r0 - 1e-9, hiExp = i === bands.length - 1 || bd.r1 > bands[i + 1].r0 + 1e-9;
      const end = (rho, y, sg, exposed) => {
        if (rho < 1e-9) return;
        const sp = splitRing(D, rho, y);
        if (exposed && capVis(y, sg)) {
          g.path(sp.all, { close: true, fill: col, fillAlpha: fa + 0.1, color: null });
          g.path(sp.all, { color: col, width: w, close: true });
        } else if (exposed) {
          sp.near.forEach((s2) => g.path(s2, { color: col, width: w }));
          sp.far.forEach((s2) => post.push(() => g.path(s2, { color: col, width: w * 0.7, dash: [6, 5], alpha: 0.6 })));
        } else if (sg < 0) sp.near.forEach((s2) => post.push(() => g.path(s2, { color: col, width: w })));
      };
      end(bd.r0, bd.y0, -1, loExp);
      end(bd.r1, bd.y1, 1, hiExp);
      lines.forEach((ln) => post.push(() => g.path([ln[0], ln[1]], { color: col, width: w })));
    });
    post.forEach((f) => f());
  }
  function drawSphere(D, R, cy, o = {}) {
    const g = D.g, col = o.color || 'sky', c = D.P({ x: 0, y: cy, z: 0 }), pts = [];
    const Rs = R * D.k;
    for (let i = 0; i <= 72; i++) pts.push({ x: c.x + Rs * Math.cos(2 * PI * i / 72), y: c.y + Rs * Math.sin(2 * PI * i / 72) });
    g.path(pts, { close: true, fill: 'halo', color: null });
    g.path(pts, { close: true, fill: col, fillAlpha: o.fillAlpha == null ? 0.14 : o.fillAlpha, color: null });
    g.path(pts, { close: true, color: col, width: o.width || 3 });
    const sp = splitRing(D, R, cy);
    sp.near.forEach((q) => g.path(q, { color: col, width: 2.4 }));
    sp.far.forEach((q) => g.path(q, { color: col, width: 2, dash: [6, 5], alpha: 0.6 }));
  }
  // 속 빈 원기둥의 구멍(축 쪽): 윗면의 안쪽 원은 실선, 안쪽 밑과 옆선은 점선
  function drawHole(D, rho, y0, y1, o = {}) {
    if (rho < 1e-9) return;
    const g = D.g, col = o.color || 'sky';
    const top = ringP(D, rho, y1), bot = ringP(D, rho, y0);
    g.path(top, { close: true, fill: 'halo', color: null });
    g.path(top, { close: true, color: col, width: 2.6 });
    g.path(bot, { close: true, color: col, width: 2, dash: [6, 5], alpha: 0.55 });
    tangents(bot, top).lines.forEach((ln) => g.path([ln[0], ln[1]], { color: col, width: 2, dash: [6, 5], alpha: 0.55 }));
  }

  /* ------------------------------------------------------------------ 평면도형을 돌린 자취(부채꼴 다발) */
  function drawFan(D, poly, sweep, o = {}) {
    const g = D.g, col = o.color || 'sky';
    if (sweep < 0.01) return;
    const n = Math.max(2, Math.ceil(sweep / (4 * DEG)));
    for (let j = 0; j <= n; j++) {
      const th = sweep * j / n;
      g.path(poly.map((p) => D.P(D.pol(p[0], p[1], th))), { close: true, fill: col, fillAlpha: o.fa == null ? 0.05 : o.fa, color: null });
    }
    // 꼭짓점이 남긴 자취(축에서 떨어진 점만)
    poly.forEach((p, i) => {
      if (p[0] < 0.01) return;
      if (o.skipTrail && o.skipTrail(i, p)) return;
      const tr = ringP(D, p[0], p[1], 0, sweep, Math.max(6, Math.ceil(sweep / (5 * DEG))));
      g.path(tr, { color: col, width: 1.8, alpha: 0.75 });
    });
  }
  const figAt = (D, poly, th) => poly.map((p) => D.P(D.pol(p[0], p[1], th)));
  function drawAxis(D, y0, y1, o = {}) {
    const col = o.color || 'rose', e = o.ext == null ? 0.45 : o.ext;
    D.line({ x: 0, y: y0 - e, z: 0 }, { x: 0, y: y1 + e, z: 0 }, col, 2.4, { dash: [8, 5] });
    if (o.label !== false) D.lab({ x: 0, y: y1 + e, z: 0 }, o.label || '회전축 l', col, { dy: o.dy == null ? -15 : o.dy, dx: o.dx || 0, size: 15 });
  }

  /* ------------------------------------------------------------------ 회전체 정의 (모양 + 치수) */
  // d: R(반지름·아랫면 반지름) · r(윗면 반지름) · h1 · h2 (높이) · w, g(속 빈 원기둥: 도형의 너비, 축과의 거리)
  const NAMES = { cyl: '원기둥', cone: '원뿔', frus: '원뿔대', pencil: '원기둥 위에 원뿔을 올린 입체', dbl: '두 원뿔을 밑면끼리 붙인 입체', stairs: '두 원기둥을 포갠 입체', sphere: '구', hollow: '속이 빈 원기둥' };
  function solid(kind, d) {
    const R = d.R, r = d.r, h1 = d.h1, h2 = d.h2;
    let bands = [], poly = [], hole = 0, sphere = null, top = h1;
    switch (kind) {
      case 'cyl': bands = [{ y0: 0, y1: h1, r0: R, r1: R }]; poly = [[0, 0], [R, 0], [R, h1], [0, h1]]; break;
      case 'cone': bands = [{ y0: 0, y1: h1, r0: R, r1: 0 }]; poly = [[0, 0], [R, 0], [0, h1]]; break;
      case 'frus': bands = [{ y0: 0, y1: h1, r0: R, r1: r }]; poly = [[0, 0], [R, 0], [r, h1], [0, h1]]; break;
      case 'pencil': bands = [{ y0: 0, y1: h1, r0: R, r1: R }, { y0: h1, y1: h1 + h2, r0: R, r1: 0 }]; poly = [[0, 0], [R, 0], [R, h1], [0, h1 + h2]]; top = h1 + h2; break;
      case 'dbl': bands = [{ y0: 0, y1: h1, r0: 0, r1: R }, { y0: h1, y1: h1 + h2, r0: R, r1: 0 }]; poly = [[0, 0], [R, h1], [0, h1 + h2]]; top = h1 + h2; break;
      case 'stairs': bands = [{ y0: 0, y1: h1, r0: R, r1: R }, { y0: h1, y1: h1 + h2, r0: r, r1: r }]; poly = [[0, 0], [R, 0], [R, h1], [r, h1], [r, h1 + h2], [0, h1 + h2]]; top = h1 + h2; break;
      case 'sphere': {
        sphere = { R, cy: 0 }; top = R;
        for (let i = 0; i <= 24; i++) { const a = -PI / 2 + PI * i / 24; poly.push([R * Math.cos(a), R * Math.sin(a)]); }
        break;
      }
      case 'hollow': {
        const w = d.w, gp = d.g;
        bands = [{ y0: 0, y1: h1, r0: gp + w, r1: gp + w }]; hole = gp; poly = [[gp, 0], [gp + w, 0], [gp + w, h1], [gp, h1]];
        break;
      }
      default: break;
    }
    const ymin = sphere ? -sphere.R : 0, ymax = sphere ? sphere.R : top;
    const rmax = Math.max(0.01, ...poly.map((p) => p[0]));
    return { kind, name: NAMES[kind], d, bands, poly, hole, sphere, ymin, ymax, rmax, h: ymax - ymin };
  }
  function drawSolid(D, sol, o = {}) {
    if (sol.sphere) drawSphere(D, sol.sphere.R, sol.sphere.cy, o);
    else { drawBands(D, sol.bands, o); if (sol.hole) drawHole(D, sol.hole, sol.bands[0].y0, sol.bands[0].y1, o); }
  }
  // 회전체를 sweep(라디안)만큼 돌린 모습: 한 바퀴면 완성된 입체, 아니면 자취 다발
  function drawRevolve(D, sol, sweep, o = {}) {
    if (sweep >= 2 * PI - 1e-3) drawSolid(D, sol, o);
    else drawFan(D, sol.poly, sweep, o);
  }
  // 입체의 화면 범위(투영한 점들)
  function boxOf(D, sol, extra = []) {
    const pts = [];
    sol.poly.forEach((p) => { for (let i = 0; i < 12; i++) pts.push(D.P(D.pol(p[0], p[1], 2 * PI * i / 12))); });
    extra.forEach((p) => pts.push(p));
    return G.bboxOf(pts);
  }

  /* ------------------------------------------------------------------ 평면도형 그림 (무대·보기 공용) */
  // poly: [[ρ,y]…] 축은 ρ=0. mirror=true 면 축 양쪽에 대칭으로 그립니다. horiz=true 면 축을 가로로 눕힙니다.
  function planeFig(g, poly, o = {}) {
    const col = o.color || 'amber';
    const f = (p) => (o.horiz ? { x: p[1], y: p[0] } : { x: p[0], y: p[1] });
    const ys = poly.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const polys = [poly];
    if (o.mirror) polys.push(poly.map((p) => [-p[0], p[1]]));
    polys.forEach((pl) => g.path(pl.map(f), { close: true, fill: col, fillAlpha: o.fa == null ? 0.26 : o.fa, color: col, width: o.width || 3 }));
    if (o.axis !== false) {
      const e = o.ext == null ? 0.4 : o.ext;
      g.path([f([0, y0 - e]), f([0, y1 + e])], { color: o.axisColor || 'rose', width: 2.2, dash: [7, 5] });
      if (o.axisLabel !== false) g.text(f([0, y1 + e]), o.axisText || 'l', o.axisColor || 'rose', { dx: o.horiz ? (o.axisText && o.axisText.length > 1 ? 36 : 14) : (o.axisDx || 0), dy: o.horiz ? 0 : -14, size: 17 });
    }
  }
  // 보기용 svg: 회전축이 있는 평면도형
  function planeSvg(poly, o = {}) {
    const g = svgSink();
    planeFig(g, poly, Object.assign({ axisText: 'l' }, o));
    return g.toSvg(o.w || 150, o.h || 130, 10);
  }
  function solidSvg(sol, yaw = -25, pitch = 20, w = 150, h = 130) {
    const D = svgCtx(yaw, pitch, false);
    drawSolid(D, sol, {});
    return D.svg.toSvg(w, h, 10);
  }

  /* ------------------------------------------------------------------ 다면체 (회전체가 아닌 것) */
  // 각기둥·각뿔을 점·면으로 만들어 그립니다. rot: 세로축 둘레로 돌린 각(라디안)
  function polyhedron(kind) {
    const v = [], faces = [];
    if (kind === 'cuboid') {
      const a = 1.5, b2 = 1.5, h = 2.2;
      [[-a, 0, -b2], [a, 0, -b2], [a, 0, b2], [-a, 0, b2], [-a, h, -b2], [a, h, -b2], [a, h, b2], [-a, h, b2]].forEach((p) => v.push({ x: p[0], y: p[1], z: p[2] }));
      faces.push([0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]);
    } else if (kind === 'pyr') {
      const a = 1.6;
      [[-a, 0, -a], [a, 0, -a], [a, 0, a], [-a, 0, a], [0, 2.8, 0]].forEach((p) => v.push({ x: p[0], y: p[1], z: p[2] }));
      faces.push([0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]);
    } else { // tri: 삼각기둥
      const R = 1.9, h = 2.2;
      for (let k = 0; k < 2; k++) for (let i = 0; i < 3; i++) { const a = PI / 2 + 2 * PI * i / 3; v.push({ x: R * Math.cos(a), y: k * h, z: R * Math.sin(a) }); }
      faces.push([0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]);
    }
    return { v, faces, kind };
  }
  function drawPolyhedron(D, ph, rot, o = {}) {
    const g = D.g, col = o.color || 'sky';
    const R = (p) => ({ x: p.x * Math.cos(rot) + p.z * Math.sin(rot), y: p.y, z: -p.x * Math.sin(rot) + p.z * Math.cos(rot) });
    const V = ph.v.map(R), Pv = V.map((p) => D.P3(p));
    let c = { x: 0, y: 0, z: 0 };
    V.forEach((p) => { c.x += p.x / V.length; c.y += p.y / V.length; c.z += p.z / V.length; });
    const info = ph.faces.map((f) => {
      const fc = f.reduce((a, i) => ({ x: a.x + V[i].x / f.length, y: a.y + V[i].y / f.length, z: a.z + V[i].z / f.length }), { x: 0, y: 0, z: 0 });
      const out = D.P3({ x: fc.x + (fc.x - c.x) * 0.5, y: fc.y + (fc.y - c.y) * 0.5, z: fc.z + (fc.z - c.z) * 0.5 }).d - D.P3(fc).d;
      return { f, vis: out > 0 };
    });
    const hullPts = hull(Pv.map((q) => ({ x: q.x, y: q.y })));
    g.path(hullPts, { close: true, fill: 'halo', color: null });
    info.forEach((q) => { if (q.vis) g.path(q.f.map((i) => Pv[i]), { close: true, fill: col, fillAlpha: 0.13, color: null }); });
    const seen = {};
    info.forEach((q) => q.f.forEach((a, k) => {
      const bb = q.f[(k + 1) % q.f.length], key = Math.min(a, bb) + '-' + Math.max(a, bb);
      seen[key] = seen[key] || { a, b: bb, vis: false }; if (q.vis) seen[key].vis = true;
    }));
    Object.values(seen).forEach((e) => g.path([Pv[e.a], Pv[e.b]], e.vis ? { color: col, width: 3 } : { color: col, width: 2, dash: [6, 5], alpha: 0.6 }));
    return hullPts;
  }

  G.S3 = { camOf, proj, ctx, nullCtx, svgCtx, boardSink, svgSink, ringP, hull, tangents, splitRing, drawBands, drawSphere, drawHole, drawFan, figAt, drawAxis, solid, drawSolid, drawRevolve, boxOf, planeFig, planeSvg, solidSvg, polyhedron, drawPolyhedron, NAMES, centerD };
})();
