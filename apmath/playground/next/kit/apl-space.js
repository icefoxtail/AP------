/* ==========================================================================
   AP Math Lab Kit · 3D 무대 도우미 (apl-space.js)
   - 공간도형·정사영·공간좌표처럼 3D 그림이 필요한 실험실을 위한 얇은 층입니다.
   - 3D 점을 카메라(yaw·pitch)로 회전해 2D 수학 좌표로 바꾼 뒤, 평범한 무대(cartesian) 위에 그립니다.
     그래서 핸들·라벨·테마·판서·확대 등 무대의 모든 기능을 그대로 씁니다.
   - 좌표: x 가로, y 높이(위), z 깊이 — 기존 3D 실험실(rotatePoint)과 같은 규칙입니다.
   ========================================================================== */
(function () {
  'use strict';
  const APLab = window.APLab;
  const V = (x, y, z) => ({ x, y, z });
  const add = (a, b) => V(a.x + b.x, a.y + b.y, a.z + b.z);
  const sub = (a, b) => V(a.x - b.x, a.y - b.y, a.z - b.z);
  const mul = (v, k) => V(v.x * k, v.y * k, v.z * k);
  const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const norm = (v) => Math.hypot(v.x, v.y, v.z);
  const unit = (v) => mul(v, 1 / Math.max(norm(v), 1e-12));
  APLab.vec3 = { V, add, sub, mul, dot, norm, unit };

  /**
   * @param {APLab.Board} b  무대
   * @param {{yaw:number,pitch:number}} cam 카메라 각(라디안)
   */
  APLab.space = function (b, cam) {
    const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const P = (p) => {
      const x = p.x * cy - p.z * sy;
      const z = p.x * sy + p.z * cy;
      return { x, y: p.y * cp - z * sp, depth: p.y * sp + z * cp };
    };
    const api = {
      P,
      /** 투영한 점들이 모두 들어오는 맞춤 범위(무대 focus) */
      fit(points, margin = 0.9) {
        const ps = points.map(P);
        const xs = ps.map((p) => p.x), ys = ps.map((p) => p.y);
        return { x: [Math.min(...xs) - margin, Math.max(...xs) + margin], y: [Math.min(...ys) - margin, Math.max(...ys) + margin] };
      },
      /**
       * 점들과 drawFn이 그리는 라벨이 모두 화면 안에 들어오도록 무대를 맞춥니다(사용자 확대·이동은 유지).
       * 바닥면처럼 큰 장식 도형은 points에 넣지 않으면 넘쳐도 됩니다. 휴대폰처럼 좁은 화면에서도 라벨이 잘리지 않습니다.
       */
      fitDrawing(points, drawFn, opts = {}) {
        const ps = points.map(P);
        const xs = ps.map((p) => p.x), ys = ps.map((p) => p.y);
        const bb = b.measure(drawFn);
        const box = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys), texts: bb ? bb.texts : [] };
        b.setFocus(b.fitBox(box, { margin: 0.12, px: 8, ...opts }), false);
        return api;
      },
      line(a, c, o = {}) { b.seg(P(a), P(c), o); return api; },
      poly(pts, o = {}) { if (pts.length >= 3) b.poly(pts.map(P), o); return api; },
      point(p, o = {}) { b.point(P(p), o); return api; },
      text(p, str, o = {}) { b.text(P(p), str, o); return api; },
      handle(id, p, o = {}) { b.handle(id, P(p), o); return api; },
      /** 직각 표시: 투영된 두 방향으로 만든 평행사변형(원근 그림에서 직각을 나타내는 표준 표기) */
      right(o3, a, c, o = {}) { b.right(P(o3), P(a), P(c), o); return api; },
      /** 3D 각의 호: 두 방향이 이루는 실제 공간각을 따라 그립니다 */
      arc(o3, a, c, radius = 0.85, o = {}) {
        const u = unit(sub(a, o3)), v = unit(sub(c, o3));
        const th = Math.acos(Math.max(-1, Math.min(1, dot(u, v))));
        if (th < 0.01 || th > Math.PI - 0.01) return api;
        const w = unit(sub(v, mul(u, Math.cos(th))));
        const pts = [];
        for (let i = 0; i <= 36; i++) {
          const t = (th * i) / 36;
          pts.push(P(add(o3, mul(add(mul(u, Math.cos(t)), mul(w, Math.sin(t))), radius))));
        }
        b.path(pts, { width: 2, ...o });
        if (o.label) {
          const m = P(add(o3, mul(add(mul(u, Math.cos(th / 2)), mul(w, Math.sin(th / 2))), radius + 0.36)));
          b.text(m, o.label, { color: o.color, size: 13, align: 'center', baseline: 'middle', weight: 800 });
        }
        return api;
      },
      /** 바닥 격자 (y = 높이) */
      floor(y = -2.7, n = 5, o = {}) {
        for (let i = -n; i <= n; i++) {
          const major = i === 0;
          const st = { color: o.color || 'green', alpha: major ? 0.18 : 0.07, width: major ? 1.3 : 0.8 };
          b.seg(P(V(i, y, -n)), P(V(i, y, n)), st);
          b.seg(P(V(-n, y, i)), P(V(n, y, i)), st);
        }
        return api;
      }
    };
    return api;
  };
})();
