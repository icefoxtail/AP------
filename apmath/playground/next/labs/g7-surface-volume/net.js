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
    const poses = G.netPose(spec.sn.net, e);
    const all = [];
    spec.sn.net.pieces.forEach((pc, k) => pc.pts.forEach((p) => all.push(G.applyT(poses[k], p))));
    D.fit(all, spec.extra || [], spec.fitOpt || {});
    const tp = G.netDraw(D, spec.sn.net, poses, spec.style);
    const ctx = { D, tp, poses, e, all, at: (k, p) => G.applyT(poses[k], p), front: (k) => tp[k].front };
    if (spec.labels) spec.labels(ctx);
    return ctx;
  }
  Object.assign(G, { netScene, roleStyle });
})();
