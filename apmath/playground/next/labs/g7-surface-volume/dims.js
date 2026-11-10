/* ==========================================================================
   중1 · 겉넓이와 부피 — 길이 표시 도구 (dims.js)
   - 이 실험실의 모든 장면이 같은 방식으로 길이를 적도록 scene3() 가 돌려주는 D 에 도구를 더합니다.
     기준 문서: docs/guides/APMATH_LAB_SOLID_FIGURE_STYLE_CURRENT.md
   - 점은 3차원 점(기본) 또는 {x,y} 그림 좌표(op.fig) 또는 화면 픽셀 점(op.px)으로 줍니다. 간격(off·gap)은 화면 픽셀이라
     그림을 키우거나 줄이거나 돌려도 글자와 선의 사이가 같습니다.
   - 길이 글자는 도형 바깥(치수선) 또는 모서리 바로 옆에 둡니다. 면 안에는 「밑넓이 12」처럼 이름 붙은 넓이만 둡니다.
   도구(D.…)
     dim(p,q,글,op)          치수선: 모서리에서 off 만큼 떨어진 선, 양 끝 짧은 막대, 가운데 글자(세로에 가까우면 선 옆).
     brace(p,q,글,op)        긴 괄호: 여러 길이를 한 번에 덮고 아래(바깥)에 글자.
     radius(중심,테두리,글,op) 반지름: 중심에서 테두리까지 선, 중심 점, 선 바로 위 글자.
     height(발,꼭대기,글,op)  높이: 점선 + 발의 직각 표시 + 선 옆 글자.
     edgeLab(p,q,글,op)       모서리 바깥쪽 바로 옆 글자(모선 등).
     areaLab(점,이름,값,op)    면 안의 넓이 글자 「밑넓이 12」(면이 좁으면 두 줄).
     rightFront(deg)          화면에서 오른쪽 앞(기본 35°)을 가리키는 수평 벡터. 반지름 선 방향을 장면마다 같게 합니다.
     rimPick(중심,테두리점들,dir) 테두리 점 중 화면에서 dir 방향에 가장 가까운 점.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SV;
  if (!G) return;
  const DEG = Math.PI / 180;
  const { v3, add3, mul3, unit3, textW } = G;
  // 맞붙는 변을 구별하는 색(밑면의 변 ↔ 옆면의 변): 같은 번호는 같은 색
  const PAIR = ['violet', 'orange', 'rose', 'sky'];
  const pairColor = (k) => PAIR[((k % PAIR.length) + PAIR.length) % PAIR.length];

  function install(D) {
    const b = D.b;
    const sp = (x, y) => b.toW(x, y); // 화면 픽셀 → 그림 좌표
    const pt = (p, o) => (o && o.px ? p : b.toS(o && o.fig ? p : D.P(p))); // 점 → 화면 픽셀
    const eff = (size) => D.fs(size || 15) * b.fs * b._ts(); // 글자 실제 높이(픽셀)
    const seg = (a, c, color, width, alpha, dash) => b.path([sp(a.x, a.y), sp(c.x, c.y)], { color, width, alpha, dash });
    const poly = (pts, color, width, alpha) => b.path(pts.map((q) => sp(q.x, q.y)), { color, width, alpha });
    const text = (cx, cy, str, color, size, alpha) => b.text(sp(cx, cy), str, { color: color || 'ink', size: D.fs(size || 15), weight: 800, align: 'center', baseline: 'middle', alpha });
    const reg = (cx, cy, w, h) => { const bx = { x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 }; D.boxes.push(bx); return bx; };
    const dims = (str, size) => { const e = eff(size); return { w: textW(str, e) + 6, h: e * 1.2 }; };
    // 선 옆(법선 n 쪽)에 글자 상자가 닿지 않게 두는 중심
    const beside = (m, n, w, h, gap) => { const d = (gap == null ? 5 : gap) + Math.abs(n.x) * w / 2 + Math.abs(n.y) * h / 2; return { x: m.x + n.x * d, y: m.y + n.y * d }; };
    // 선 방향 단위벡터와 바깥쪽 법선(want 쪽)
    function frame(A, B, o) {
      const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy);
      if (L < 3) return null;
      const u = { x: dx / L, y: dy / L };
      let n = { x: -u.y, y: u.x };
      let want = o.side;
      if (!want && o.from) { const f = pt(o.from, { fig: o.fig, px: o.fromPx }); want = { x: (A.x + B.x) / 2 - f.x, y: (A.y + B.y) / 2 - f.y }; }
      if (!want) want = { x: 0, y: 1 };
      if (n.x * want.x + n.y * want.y < 0) n = { x: -n.x, y: -n.y };
      return { u, n, L };
    }

    /* ---- 곡선 치수: 호출자가 정확한 바깥 윤곽의 양 끝을 지정합니다. */
    D.curveDim = (p, q, str, o = {}) => {
      const al = o.alpha == null ? 1 : o.alpha;
      if (al < 0.02) return null;
      const A = pt(p, o), B = pt(q, o), fr = frame(A, B, o);
      if (!fr) return null;
      const { n, L } = fr, bow = Math.max(8, Math.min(18, L * 0.09));
      const at = (t) => ({ x: A.x + (B.x-A.x)*t + n.x*4*bow*t*(1-t), y: A.y + (B.y-A.y)*t + n.y*4*bow*t*(1-t) });
      poly(Array.from({length: 25}, (_, i) => at(i/24)), 'ink', 1.5, al);
      if (!str) return null;
      const d = dims(String(str), o.size || 14), c = beside(at(0.5), n, d.w, d.h, o.gap == null ? 5 : o.gap);
      text(c.x, c.y, String(str), 'ink', o.size || 14, al);
      return { box: reg(c.x, c.y, d.w, d.h) };
    };

    /* ---- 치수선 */
    D.dim = (p, q, str, o = {}) => {
      const al = o.alpha == null ? 1 : o.alpha;
      if (al < 0.02) return null;
      const A = pt(p, o), B = pt(q, o), fr = frame(A, B, o);
      if (!fr) return null;
      const { u, n, L } = fr, off = o.off == null ? 20 : o.off, col = o.color || 'ink';
      const A2 = { x: A.x + n.x * off, y: A.y + n.y * off }, B2 = { x: B.x + n.x * off, y: B.y + n.y * off };
      if (o.ext !== false && off > 7) { // 보조선(모서리에서 치수선까지, 선을 3px 넘어감)
        [[A, A2], [B, B2]].forEach(([s0, s1]) => seg({ x: s0.x + n.x * 3, y: s0.y + n.y * 3 }, { x: s1.x + n.x * 5, y: s1.y + n.y * 5 }, col, 1.3, 0.55 * al));
      }
      const mid = { x: (A2.x + B2.x) / 2, y: (A2.y + B2.y) / 2 }, size = o.size || 15;
      let box = null;
      if (str == null || str === '') seg(A2, B2, col, 1.9, 0.92 * al);
      else {
        const { w, h } = dims(str, size), inline = Math.abs(u.y) < 0.8 && L >= w + 18;
        if (inline) { // 선을 글자 자리만큼 비우고 가운데에 글자
          const half = Math.abs(u.x) * w / 2 + Math.abs(u.y) * h / 2 + 2;
          seg(A2, { x: mid.x - u.x * half, y: mid.y - u.y * half }, col, 1.9, 0.92 * al);
          seg({ x: mid.x + u.x * half, y: mid.y + u.y * half }, B2, col, 1.9, 0.92 * al);
          text(mid.x, mid.y, str, o.tcolor || col, size, al);
          box = reg(mid.x, mid.y, w, h);
        } else { // 선 옆(바깥쪽)에 글자
          seg(A2, B2, col, 1.9, 0.92 * al);
          const c = beside(mid, n, w, h, o.gap);
          text(c.x, c.y, str, o.tcolor || col, size, al);
          box = reg(c.x, c.y, w, h);
        }
      }
      [A2, B2].forEach((e) => seg({ x: e.x - n.x * 5, y: e.y - n.y * 5 }, { x: e.x + n.x * 5, y: e.y + n.y * 5 }, col, 2.1, al)); // 양 끝 막대
      return { box, A2, B2, n };
    };

    /* ---- 긴 괄호 */
    D.brace = (p, q, str, o = {}) => {
      const al = o.alpha == null ? 1 : o.alpha;
      if (al < 0.02) return null;
      const A = pt(p, o), B = pt(q, o), fr = frame(A, B, o);
      if (!fr) return null;
      const { u, n, L } = fr, off = o.off == null ? 6 : o.off, col = o.color || 'ink', rr = Math.max(4, Math.min(9, L / 10));
      const at = (a, c) => ({ x: A.x + n.x * off + u.x * a + n.x * c, y: A.y + n.y * off + u.y * a + n.y * c });
      const arc = (cu, cv, a0, a1) => { const out = []; for (let i = 0; i <= 8; i++) { const a = a0 + ((a1 - a0) * i) / 8; out.push(at(cu + rr * Math.cos(a), cv + rr * Math.sin(a))); } return out; };
      const PI = Math.PI, m = L / 2;
      let pts = [].concat(arc(rr, 0, PI, PI / 2), arc(m - rr, 2 * rr, -PI / 2, 0), arc(m + rr, 2 * rr, PI, 1.5 * PI), arc(L - rr, 0, PI / 2, 0));
      poly(pts, col, 2.2, al);
      let box = null;
      if (str) {
        const { w, h } = dims(str, o.size || 15), c = beside(at(m, 2 * rr), n, w, h, o.gap == null ? 3 : o.gap);
        text(c.x, c.y, str, o.tcolor || col, o.size || 15, al);
        box = reg(c.x, c.y, w, h);
      }
      return { box };
    };

    /* ---- 반지름 */
    D.radius = (c, r, str, o = {}) => {
      const al = o.alpha == null ? 1 : o.alpha;
      if (al < 0.02) return null;
      const A = pt(c, o), B = pt(r, o), dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy);
      if (L < 3) return null;
      const col = o.color || 'ink';
      seg(A, B, col, 2.4, al, o.dash ? [5, 4] : undefined);
      b.point(sp(A.x, A.y), { color: col, r: 3.5 });
      let n = { x: -dy / L, y: dx / L };
      if (n.y > 0 || (Math.abs(n.y) < 1e-6 && n.x < 0)) n = { x: -n.x, y: -n.y }; // 글자는 선의 위쪽
      let box = null;
      if (str) {
        const sh = (o.alongFrac || 0) * L, { w, h } = dims(str, o.size || 14);
        // end: 테두리 끝점 바깥(선이 뻗는 방향)에 글자를 둡니다. 작은 원 위에서 다른 글자와 겹치지 않게 할 때
        const c2 = o.end ? beside(B, { x: dx / L, y: dy / L }, w, h, o.gap == null ? 5 : o.gap) : beside({ x: (A.x + B.x) / 2 + (dx / L) * sh, y: (A.y + B.y) / 2 + (dy / L) * sh }, n, w, h, o.gap == null ? 4 : o.gap);
        text(c2.x, c2.y, str, o.tcolor || col, o.size || 14, al);
        box = reg(c2.x, c2.y, w, h);
      }
      return { box };
    };

    /* ---- 높이: 점선 + 발의 직각 표시 + 선 옆 글자 */
    D.height = (foot, top, str, o = {}) => {
      const al = o.alpha == null ? 1 : o.alpha;
      if (al < 0.02) return null;
      const A = pt(foot, o), B = pt(top, o), col = o.color || 'amber';
      seg(A, B, col, 2.3, al, [5, 4]);
      if (o.right !== false && !o.fig && !o.px) { // 발의 직각 표시(밑면 위의 방향 a 와 위쪽)
        const k = b.k || 40, s = (o.rsPx || 13) / k, a = o.a || D.hx(1);
        const O = foot, ua = mul3(unit3(a), s), uc = mul3(unit3(v3(top.x - foot.x, top.y - foot.y, top.z - foot.z)), s);
        const p0 = D.P(O), p1 = D.P(add3(O, ua)), p2 = D.P(add3(add3(O, ua), uc)), p3 = D.P(add3(O, uc));
        b.path([p1, p2, p3], { color: col, width: 2.1, alpha: al });
      }
      let box = null;
      if (str) {
        const { w, h } = dims(str, o.size || 15), side = o.side || { x: -1, y: 0 }, L = Math.hypot(B.x - A.x, B.y - A.y) || 1;
        let n = { x: -(B.y - A.y) / L, y: (B.x - A.x) / L };
        if (n.x * side.x + n.y * side.y < 0) n = { x: -n.x, y: -n.y };
        const f = 0.5 + (o.alongFrac || 0) / 2, c = beside({ x: A.x + (B.x - A.x) * f, y: A.y + (B.y - A.y) * f }, n, w, h, o.gap == null ? 5 : o.gap); // alongFrac: 점선 위 글자 위치(0 가운데, +1 꼭대기, -1 발)
        if (o.backdrop) b.path([sp(c.x-w/2-2,c.y-h/2-1),sp(c.x+w/2+2,c.y-h/2-1),sp(c.x+w/2+2,c.y+h/2+1),sp(c.x-w/2-2,c.y+h/2+1)], {close:true,fill:'stageHi',fillAlpha:0.96,color:null});
        text(c.x, c.y, str, o.tcolor || col, o.size || 15, al);
        box = reg(c.x, c.y, w, h);
      }
      return { box };
    };

    /* ---- 모서리 바깥쪽 바로 옆 글자(모선 등) */
    D.edgeLab = (p, q, str, o = {}) => {
      const al = o.alpha == null ? 1 : o.alpha;
      if (al < 0.02 || !str) return null;
      const A = pt(p, o), B = pt(q, o), fr = frame(A, B, o);
      if (!fr) return null;
      const { w, h } = dims(str, o.size || 15), mid = { x: (A.x + B.x) / 2 + (o.along || 0) * fr.u.x, y: (A.y + B.y) / 2 + (o.along || 0) * fr.u.y };
      const c = beside(mid, fr.n, w, h, o.gap == null ? 4 : o.gap);
      text(c.x, c.y, str, o.color || 'ink', o.size || 15, al);
      return { box: reg(c.x, c.y, w, h) };
    };

    /* ---- 면 안의 넓이 글자: 「밑넓이 12」 (면이 좁으면 이름과 값을 두 줄로) */
    D.areaLab = (p, name, val, o = {}) => {
      const al = o.alpha == null ? 1 : o.alpha;
      if (al < 0.02) return null;
      const c = pt(p, o), size = o.size || 15, one = `${name} ${val}`, { w, h } = dims(one, size);
      const dx = o.dx || 0, dy = o.dy || 0;
      if (o.maxW && w > o.maxW) {
        const a = dims(name, size), v = dims(String(val), size), gap = a.h * 0.64;
        text(c.x + dx, c.y + dy - gap, name, o.color || 'ink', size, al); text(c.x + dx, c.y + dy + gap, String(val), o.color || 'ink', size, al);
        reg(c.x + dx, c.y + dy - gap, a.w, a.h); reg(c.x + dx, c.y + dy + gap, v.w, v.h);
        return { lines: 2 };
      }
      text(c.x + dx, c.y + dy, one, o.color || 'ink', size, al);
      reg(c.x + dx, c.y + dy, w, h);
      return { lines: 1 };
    };

    /* ---- 방향 도우미 */
    // 화면의 오른쪽 앞(오른쪽에서 앞쪽으로 deg 만큼) 을 가리키는 수평 단위벡터
    D.rightFront = (deg = 35) => {
      const cam = D.cam, a = deg * DEG, r = v3(cam.cy, 0, -cam.sy), f = v3(cam.sy, 0, cam.cy);
      return add3(mul3(r, Math.cos(a)), mul3(f, Math.sin(a)));
    };
    // 테두리 점들 중 중심에서 화면 방향 dir(기본: 오른쪽 아래 25°)에 가장 가까운 점
    D.rimPick = (c, pts, dir) => {
      const d = dir || { x: Math.cos(25 * DEG), y: Math.sin(25 * DEG) }, A = b.toS(D.P(c));
      let best = null, bs = -2;
      pts.forEach((q) => { const s = b.toS(D.P(q)), l = Math.hypot(s.x - A.x, s.y - A.y) || 1, sc = ((s.x - A.x) * d.x + (s.y - A.y) * d.y) / l; if (sc > bs) { bs = sc; best = q; } });
      return best;
    };
    // 3차원 점 → 화면 픽셀
    D.px = (p3) => b.toS(D.P(p3));
    return D;
  }

  const base = G.scene3;
  // 해설 재생 중(s.lessonOn)이고 결론을 드러내는 표시(s.svShowV)가 아직 꺼져 있으면 D.lessonHide — 합 식의 결과 줄(sumRows 의 둘째 줄부터)처럼 정답이 들어 있는 글자를 아끼는 신호입니다. 탐구·문제 탭·썸네일은 lessonOn 이 없어 그대로입니다.
  G.scene3 = function (b, s, C, o) { const D = install(base(b, s, C, o)); D.lessonHide = !!(s && s.lessonOn && !s.svShowV); return D; };
  Object.assign(G, { PAIR, pairColor });
})();
