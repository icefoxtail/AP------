/* ==========================================================================
   중1 · 겉넓이와 부피 — 전개도 장면 도우미 (net.js)
   - 입체를 경첩으로 펼치는 장면(기둥·뿔·뿔대)이 함께 쓰는 틀입니다. 접기·펴기는 제자리 회전이라 허용됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SV;
  const ROLE = { base: 'sky', lat: 'green', lat2: 'violet' };
  // 단계 강조: lvl 0 흐리게 · 1 보통 · 2 노랑 강조 · 3 보통(굵게)
  function roleStyle(role, lvl) {
    const col = ROLE[role] || 'sky';
    if (lvl === 2) return { fill: 'amber', alpha: 0.46, edge: 'amber', ew: 3.4 };
    if (lvl === 0) return { fill: col, alpha: 0.07, edge: 'muted', ew: 1.4 };
    if (lvl === 3) return { fill: col, alpha: 0.4, edge: 'ink', ew: 2.8 };
    return { fill: col, alpha: 0.28, edge: 'ink', ew: 2.4 };
  }
  /**
   * spec: { sn(solidNet 결과), t(0~1 펼침), style(piece)→{…}, labels(ctx), extra(그림 좌표 점들), fitOpt }
   * 반환 ctx: { D, tp(변환된 조각들), at(k,p3), e }
   */
  function netScene(b, s, C, spec) {
    const e = G.ease(spec.t);
    const yaw = (s.svYaw == null ? 28 : s.svYaw) * (1 - e), pitch = (s.svPitch == null ? 22 : s.svPitch) * (1 - e);
    const D = G.scene3(b, s, C, { yaw, pitch });
    let reference = null;
    if (spec.showOriginal && C.tab === 'explore' && !b.thumb && b.W >= 600 && e > 0.02) {
      const shift = 5.2 * G.ease(G.lin01(e, 0.02, 0.25)), baseP = D.P;
      D.P = p => { const q = baseP(p); return { x: q.x + shift, y: q.y }; };
      const R = G.scene3(b, s, C, { yaw: s.svYaw == null ? 28 : s.svYaw, pitch: s.svPitch == null ? 22 : s.svPitch }), refP = R.P;
      R.P = p => { const q = refP(p); return { x: q.x - shift, y: q.y }; };
      reference = { R, poses: G.netPose(spec.sn.net, 0) };
    }
    const poses = G.netPose(spec.sn.net, e);
    const all = [];
    spec.sn.net.pieces.forEach((pc, k) => pc.pts.forEach((p) => all.push(G.applyT(poses[k], p))));
    const refPts = reference ? spec.sn.net.pieces.flatMap((pc, k) => pc.pts.map(p => reference.R.P(G.applyT(reference.poses[k], p)))) : [];
    D.fit(all, (spec.extra || []).concat(refPts), spec.fitOpt || {});
    if (reference) {
      b.ctx.save();
      b.ctx.globalAlpha *= G.ease(G.lin01(e, 0.18, 0.5));
      G.netDraw(reference.R, spec.sn.net, reference.poses, () => ({ fill: 'sky', alpha: 0.035, edge: 'ink', ew: 2 }));
      if (spec.refLabels) spec.refLabels(reference.R);
      const rb = G.bboxOf(refPts), nb = G.bboxOf(all.map(D.P));
      b.text({ x: (rb.x0 + rb.x1) / 2, y: rb.y1 }, '원래 입체', { dy: 14, size: reference.R.fs(13), color: 'ink', weight: 700 });
      if (nb.x0 - rb.x1 > 0.45) D.arrow({ x: rb.x1 + 0.12, y: (rb.y0 + rb.y1) / 2 }, { x: nb.x0 - 0.12, y: (rb.y0 + rb.y1) / 2 }, 'muted', 1.5);
      b.ctx.restore();
    }
    const tp = G.netDraw(D, spec.sn.net, poses, (pc, k) => {
      const st = spec.style ? spec.style(pc, k) : {};
      // 처음에는 교과서처럼 흰 입체로, 펼칠 때만 면 구분을 부드럽게 나타냅니다.
      if (!C.review && !C.problem) st.alpha = Math.min(st.alpha == null ? 0.06 : st.alpha, 0.015 + 0.065 * e);
      return st;
    });
    const ctx = { D, tp, poses, e, all, at: (k, p) => G.applyT(poses[k], p), front: (k) => tp[k].front };
    if (spec.labels) spec.labels(ctx);
    return ctx;
  }
  Object.assign(G, { netScene, roleStyle });
})();
