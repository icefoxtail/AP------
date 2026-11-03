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
  const cross = (a, b) => V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  /* 문제 탭 그림의 상태: 풀이 단계·강조 렌즈를 끄고(patch 로 문제에 주어진 값만 고정) 원래 도형만 보여 줍니다. 문제 탭이 아니면 s 그대로. */
  APLab.problemState = (lab, s, patch = {}) => (lab && lab.tab === 'problem' ? { ...s, step: 0, part: 0, lens: 'all', ...patch } : s);
  APLab.vec3 = { V, add, sub, mul, dot, norm, unit, cross };

  /* 면 목록 만들기(겨냥도 숨은선용). 점은 장면이 그리는 점 객체를 그대로 넘기면 됩니다.
     tetra(A,B,C,D): 사면체의 네 면. prism(밑면[...], 윗면[...]): 밑면 i번 꼭짓점 바로 위가 윗면 i번 꼭짓점인 기둥(직육면체·정육면체 포함). */
  APLab.solidFaces = {
    tetra: (A, B, C, D) => [[A, B, C], [A, B, D], [A, C, D], [B, C, D]],
    prism: (bottom, top) => [bottom, top, ...bottom.map((p, i) => { const j = (i + 1) % bottom.length; return [p, bottom[j], top[j], top[i]]; })]
  };

  /**
   * @param {APLab.Board} b  무대
   * @param {{yaw:number,pitch:number}} cam 카메라 각(라디안)
   * @param {{problem?:boolean}} [opts] problem:true 이면 문제 탭 그림입니다. answer:true 로 표시한 점·글·선은 그리지 않고,
   *        problemLabel 을 준 점·글은 그 글자로 바꿔 그립니다(답이나 중간값이 그림에 찍히지 않게).
   */
  APLab.space = function (b, cam, opts = {}) {
    const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const P = (p) => {
      const x = p.x * cy - p.z * sy;
      const z = p.x * sy + p.z * cy;
      return { x, y: p.y * cp - z * sp, depth: p.y * sp + z * cp };
    };
    const problem = !!opts.problem;
    const skip = (o) => problem && o && o.answer;
    const relabel = (o) => (problem && o && o.problemLabel !== undefined ? { ...o, label: o.problemLabel } : o);
    /* ----- 겨냥도 숨은선: 볼록 입체의 면 목록(solid)을 알려 주면 뒷면에만 속한 선분을 자동으로 점선으로 그립니다 ----- */
    const solids = [];
    const HIDDEN_DASH = [6, 6];
    const onFace = (p, f, tol) => {
      if (Math.abs(dot(f.n, sub(p, f.p0))) > tol) return false;
      for (let i = 0; i < f.pts.length; i++) {
        const a = f.pts[i], c = f.pts[(i + 1) % f.pts.length], e = sub(c, a);
        if (dot(cross(e, sub(p, a)), f.nr) < -tol * Math.max(norm(e), 1)) return false;
      }
      return true;
    };
    const facesOn = (s, ...ps) => s.faces.filter((f) => ps.every((p) => onFace(p, f, s.tol)));
    const api = {
      P,
      /** 이 카메라에서 문제 탭 그림인지 */
      problem,
      /**
       * 볼록 입체의 면 목록을 등록합니다(면 = 꼭짓점 배열). 등록한 뒤 line()은 dash를 따로 주지 않으면,
       * 그 입체의 모서리·면 위의 선분 중 뒷면에만 속한 것을 점선으로 그립니다. dash를 직접 준 선은 그대로 둡니다.
       * 옵션 hide:false 인 선은 자동 판정에서 뺍니다. 입체의 꼭짓점이 뒤에 있으면 점·글자를 흐리게 그립니다.
       */
      solid(faces) {
        const pts = faces.flat();
        if (!pts.length) return api;
        const c = mul(pts.reduce(add, V(0, 0, 0)), 1 / pts.length);
        const size = Math.max(...pts.map((p) => norm(sub(p, c))), 1);
        const fs = faces.filter((f) => f.length >= 3).map((fp) => {
          let n = V(0, 0, 0);
          fp.forEach((a, i) => { const d = fp[(i + 1) % fp.length]; n = V(n.x + (a.y - d.y) * (a.z + d.z), n.y + (a.z - d.z) * (a.x + d.x), n.z + (a.x - d.x) * (a.y + d.y)); });
          const nr = unit(n);
          const p0 = mul(fp.reduce(add, V(0, 0, 0)), 1 / fp.length);
          const out = dot(nr, sub(p0, c)) >= 0 ? nr : mul(nr, -1); // 바깥쪽 법선
          return { pts: fp, nr, n: out, p0, front: P(out).depth > 1e-4 }; // P().depth 가 클수록 보는 사람 쪽
        });
        solids.push({ faces: fs, tol: 1e-6 * size });
        return api;
      },
      /** 선분 a–c 가 등록한 입체의 면 위에 있으면 숨었는지(true/false), 아니면 null */
      hidden(a, c) {
        for (const s of solids) {
          const fs = facesOn(s, a, c);
          if (fs.length) return fs.every((f) => !f.front);
        }
        return null;
      },
      /** 점 p 가 입체의 꼭짓점이면서 뒤에 있는지 */
      vertexHidden(p) {
        for (const s of solids) {
          if (!s.faces.some((f) => f.pts.some((q) => norm(sub(p, q)) <= s.tol))) continue;
          const fs = facesOn(s, p);
          return fs.length > 0 && fs.every((f) => !f.front);
        }
        return false;
      },
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
      line(a, c, o = {}) {
        if (skip(o)) return api;
        if (solids.length && o.dash == null && o.hide !== false && api.hidden(a, c)) o = { ...o, dash: HIDDEN_DASH, glow: false };
        b.seg(P(a), P(c), o);
        return api;
      },
      poly(pts, o = {}) {
        if (pts.length < 3 || skip(o)) return api;
        // 입체의 면 위에 놓인 다각형(단면 등): 테두리 중 뒷면에 속한 변만 점선으로 그립니다
        if (solids.length && o.dash == null && o.hide !== false && o.color !== null && o.stroke !== false
          && pts.some((p, i) => api.hidden(p, pts[(i + 1) % pts.length]))) {
          if (o.fill) b.poly(pts.map(P), { ...o, color: null });
          pts.forEach((p, i) => api.line(p, pts[(i + 1) % pts.length], { ...o, fill: null }));
          return api;
        }
        b.poly(pts.map(P), o);
        return api;
      },
      point(p, o = {}) {
        if (skip(o)) return api;
        o = relabel(o);
        if (solids.length && o.dim !== false && api.vertexHidden(p)) {
          const c = b.ctx;
          c.save();
          c.globalAlpha *= 0.6;
          b.point(P(p), o);
          c.restore();
        } else b.point(P(p), o);
        return api;
      },
      text(p, str, o = {}) { if (skip(o)) return api; if (problem && o.problemLabel !== undefined) str = o.problemLabel; if (str !== '' && str != null) b.text(P(p), str, o); return api; },
      handle(id, p, o = {}) { b.handle(id, P(p), o); return api; },
      /** 직각 표시: 투영된 두 방향으로 만든 평행사변형(원근 그림에서 직각을 나타내는 표준 표기) */
      right(o3, a, c, o = {}) { if (skip(o)) return api; b.right(P(o3), P(a), P(c), o); return api; },
      /** 3D 각의 호: 두 방향이 이루는 실제 공간각을 따라 그립니다 */
      arc(o3, a, c, radius = 0.85, o = {}) {
        if (skip(o)) return api;
        if (problem && o.problemLabel !== undefined) o = { ...o, label: o.problemLabel };
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
