/* ==========================================================================
   중1 · 다면체와 정다면체 — 탭 ④ 「도전: 단면과 꼭짓점 자르기」 (t4.js, order 40) — 장면 2개
   · p4-1 정육면체의 단면 — 단면판이 화면 가로로만 움직이도록 입체를 제자리에서 돌려 놓고, 판을 좌우로 밉니다.
   · p4-2 꼭짓점을 잘라 낸 입체(축구공) — 면·모서리·꼭짓점의 수가 어떻게 달라지는지
   교육과정을 조금 넘어서는 도전 탭입니다(선택).
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PH;
  if (!G || !G.prismS) return;
  const { clamp, rint, shuf, PI, DEG, v3, add3, sub3, mul3, dot3, cross3, len3, unit3, scene3, P, VIEW, mkChoices, mkText, rd, notes, solidOf, platS, PLAT, PLAT_KEYS, truncS, drawPoly, faceMid, banner, sRect, cen3 } = G;

  const PARAMS = {
    phTa: P('자르는 방향 ①', 0, 45, 1, 45, { color: 'sky', hint: '막대를 움직이면 입체가 제자리에서 돌아요', format: (v) => Math.round(v) + '°' }),
    phTb: P('자르는 방향 ②', 0, 45, 1, 45, { color: 'violet', hint: '입체를 다른 쪽으로 기울여요', format: (v) => Math.round(v) + '°' }),
    phTd: P('단면판의 위치', -1, 1, 0.01, 0, { color: 'amber', hint: '단면판을 가로로 밀어 보세요', format: (v) => (Math.abs(v) < 0.015 ? '가운데' : (v > 0 ? '오른쪽 ' : '왼쪽 ') + Math.round(Math.abs(v) * 100) + '%') }),
    phTr: P('자르는 깊이', 0.05, 0.45, 0.01, 1 / 3, { color: 'amber', hint: '모서리의 길이의 몇 분의 몇을 잘라 낼까요?', format: (v) => `모서리의 ${Math.round(v * 100)}%` })
  };
  const AMB = 'amber', SKY = 'sky', GRN = 'green', RED = 'red', VIO = 'violet';
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;
  const stepOf = (C) => (C.problem ? 0 : C.review ? C.step : 4);
  const Y0 = -30 * DEG;
  const FR = { e1: v3(Math.cos(Y0), -Math.sin(Y0), 0), e2: v3(Math.sin(Y0), Math.cos(Y0), 0), e3: v3(0, 0, 1) };
  const NAME_N = { 3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형' };

  /* ------------------------------------------------------------------ 정육면체와 평면 */
  const CV = []; for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CV.push(v3(x, y, z));
  const CE = []; for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const d = sub3(CV[i], CV[j]); if (Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z) === 2) CE.push([i, j]); }
  const CF = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
  // 방향 n(정육면체 좌표)을 화면 가로 e1 로 보내는 기저 (n, u, w)
  function basisOf(n) {
    let w = sub3(v3(0, 0, 1), mul3(n, n.z));
    if (len3(w) < 1e-6) w = sub3(v3(1, 0, 0), mul3(n, n.x));
    w = unit3(w);
    return { n, u: cross3(w, n), w };
  }
  const toWorld = (B, p) => add3(add3(mul3(FR.e1, dot3(p, B.n)), mul3(FR.e2, dot3(p, B.u))), mul3(FR.e3, dot3(p, B.w)));
  function normalOf(aDeg, bDeg) { return unit3(v3(1, Math.tan(aDeg * DEG), Math.tan(bDeg * DEG))); }
  // 평면 n·p = d 로 자른 단면의 꼭짓점(순서대로)과 자른 면
  function sectionOf(n, d, B) {
    const pts = [], sd = CV.map((p) => dot3(n, p) - d);
    CE.forEach(([i, j]) => {
      if (Math.abs(sd[i]) < 1e-9) { if (!pts.some((q) => len3(sub3(q, CV[i])) < 1e-7)) pts.push(CV[i]); return; }
      if (Math.abs(sd[j]) < 1e-9) return;
      if (sd[i] * sd[j] < 0) { const t = sd[i] / (sd[i] - sd[j]), p = add3(CV[i], mul3(sub3(CV[j], CV[i]), t)); if (!pts.some((q) => len3(sub3(q, p)) < 1e-7)) pts.push(p); }
    });
    if (pts.length < 3) return { pts: [], faces: [], count: 0 };
    const c = cen3(pts), ang = (p) => Math.atan2(dot3(sub3(p, c), B.w), dot3(sub3(p, c), B.u));
    pts.sort((p, q) => ang(p) - ang(q));
    const faces = CF.map((f, fi) => fi).filter((fi) => { const s2 = CF[fi].map((i) => sd[i]); return Math.min(...s2) < -1e-9 && Math.max(...s2) > 1e-9; });
    return { pts, faces, count: pts.length, n, d, B };
  }
  function shapeName(sec) {
    const k = sec.count, B = sec.B;
    if (k < 3) return '단면 없음';
    const p2 = sec.pts.map((p) => [dot3(p, B.u), dot3(p, B.w)]);
    const side = p2.map((p, i) => { const q = p2[(i + 1) % k]; return Math.hypot(p[0] - q[0], p[1] - q[1]); });
    const eq = (a, b) => Math.abs(a - b) < 1e-5;
    const allEq = side.every((x) => eq(x, side[0]));
    const ang = p2.map((p, i) => { const a = p2[(i + k - 1) % k], c = p2[(i + 1) % k], v1 = [a[0] - p[0], a[1] - p[1]], v2 = [c[0] - p[0], c[1] - p[1]]; return Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2))) / DEG; });
    if (k === 3) return allEq ? '정삼각형' : '삼각형';
    if (k === 4) { const rect = ang.every((x) => Math.abs(x - 90) < 1e-3); return rect ? (allEq ? '정사각형' : '직사각형') : '사각형'; }
    if (k === 6) return allEq && ang.every((x) => Math.abs(x - 120) < 1e-3) ? '정육각형' : '육각형';
    return NAME_N[k] || `${k}각형`;
  }
  const secAt = (a, b, dn) => { const n = normalOf(a, b), B = basisOf(n), dmax = Math.abs(n.x) + Math.abs(n.y) + Math.abs(n.z); return sectionOf(n, dn * dmax, B); };

  /* ------------------------------------------------------------------ p4-1 정육면체의 단면 */
  const PRE = [
    { label: '정삼각형', a: 45, b: 45, d: 0.7 }, { label: '정사각형', a: 0, b: 0, d: 0.2 }, { label: '직사각형', a: 45, b: 0, d: 0.1 },
    { label: '오각형', a: 24, b: 14, d: 0.37 }, { label: '정육각형', a: 45, b: 45, d: 0 }
  ];
  // 세 모서리 위의 점 P, Q, R 를 지나는 평면으로 자른 단면의 변의 수
  function rollTri() {
    for (let g = 0; g < 300; g++) {
      const es = shuf(CE.map((e, i) => i)).slice(0, 3), ts = es.map(() => [0.25, 0.5, 0.75][rint(0, 2)]);
      const P3 = es.map((ei, k) => { const [i, j] = CE[ei]; return add3(CV[i], mul3(sub3(CV[j], CV[i]), ts[k])); });
      let n = cross3(sub3(P3[1], P3[0]), sub3(P3[2], P3[0]));
      if (len3(n) < 1e-6) continue;
      n = unit3(n);
      const d = dot3(n, P3[0]), sd = CV.map((p) => dot3(n, p) - d);
      if (sd.some((x) => Math.abs(x) < 1e-6)) continue; // 꼭짓점을 지나면 건너뜀
      let cnt = 0; CE.forEach(([i, j]) => { if (sd[i] * sd[j] < 0) cnt++; });
      if (cnt < 3) continue;
      return { es, ts, cnt, P3 };
    }
    return { es: [0, 5, 10], ts: [0.5, 0.5, 0.5], cnt: 3, P3: [CV[0], CV[1], CV[2]] };
  }
  const T1 = {
    id: 'p4-1', title: '정육면체의 단면', short: '정육면체의 단면',
    question: '정육면체를 한 평면으로 자르면 단면은 어떤 모양이 될까? 단면판을 가로로 밀고 입체를 돌려 가며 단면의 모양을 알아보자.',
    cam0: { yaw: -80, pitch: 0 },
    ctl: () => ['phTa', 'phTb', 'phTd'].concat(['phYaw']),
    presets: () => PRE.map((p, i) => ({ group: i === 0 ? '단면의 모양' : '', label: p.label, apply: (st) => { st.phTa = p.a; st.phTb = p.b; st.phTd = p.d; }, on: (st) => Math.abs(st.phTa - p.a) < 0.5 && Math.abs(st.phTb - p.b) < 0.5 && Math.abs(st.phTd - p.d) < 0.02 })),
    init: (s) => { s.phTa = 45; s.phTb = 45; s.phTd = 0; s.phQ = rollTri(); },
    reroll: (s) => { s.phQ = rollTri(); },
    model: (s) => {
      const sec = secAt(s.phTa, s.phTb, s.phTd);
      return { sec, name: shapeName(sec), k: sec.count, Q: s.phQ };
    },
    draw(b, s, M, C) {
      const st = stepOf(C), cam = Object.assign({}, s, { phPitch: 0 });
      const D = scene3(b, cam, C);
      if (C.problem) {
        // 문제: 위에서 본 정육면체와 세 점 P, Q, R
        const D2 = scene3(b, Object.assign({}, s, { phYaw: -30, phPitch: 24 }), C), Q = M.Q;
        const W = (p) => mul3(p, 1.3);
        D2.fitPts(CV.map(W), { t: 50, b: 50, l: 60, r: 60 });
        const S = solidOf(CV.map(W));
        drawPoly(D2, S, { face: (fi, vis) => (vis ? { c: 'green', a: 0.1 } : null), edge: () => ({ color: 'ink', width: 3 }) });
        ['P', 'Q', 'R'].forEach((nm, k) => { const p = W(Q.P3[k]); D2.dot(p, AMB, 7); D2.label(p, nm, { color: AMB, size: 19, dir: D2.out(p, v3(0, 0, 0)), gap: 12 }); });
        if (C.txt) banner(b, [{ t: '정육면체의 세 모서리 위의 점 P, Q, R', c: 'ink', size: 15 }], C);
        D2.flush();
        return;
      }
      const sec = M.sec, B = secAt(s.phTa, s.phTb, s.phTd).B || basisOf(normalOf(s.phTa, s.phTb)), n = normalOf(s.phTa, s.phTb), Bs = basisOf(n);
      const dmax = Math.abs(n.x) + Math.abs(n.y) + Math.abs(n.z), d = s.phTd * dmax;
      void B;
      const wv = CV.map((p) => toWorld(Bs, p));
      const L = 1.55;
      const corners = [-1, 1].flatMap((sx) => [-1, 1].flatMap((sy) => [add3(mul3(FR.e1, sx * dmax), add3(mul3(FR.e2, sy * L), mul3(FR.e3, L))), add3(mul3(FR.e1, sx * dmax), add3(mul3(FR.e2, sy * L), mul3(FR.e3, -L)))]));
      D.fitPts(wv.concat(corners), { t: 84, b: 40, l: 40, r: 40 });
      const S = solidOf(wv);
      const hit = (fi) => sec.faces.includes(fi);
      // 입체 면: 단면이 지나는 면을 강조
      const idxOf = (f) => CF.findIndex((c) => c.every((q) => f.i.map((v) => wv.findIndex((w) => len3(sub3(w, S.V[v])) < 1e-7)).includes(q)));
      const faceHit = S.F.map((f) => hit(idxOf(f)));
      drawPoly(D, S, { face: (fi, vis) => (vis ? (faceHit[fi] && (st === 1 || st === 4) ? { c: AMB, a: 0.2 } : { c: 'green', a: 0.2 }) : null), edge: () => ({ color: 'ink', width: 3.4 }) });
      // 단면판(화면에서 세로로 선 판) — 가로로만 움직임
      const plane = [add3(mul3(FR.e1, d), add3(mul3(FR.e2, -L), mul3(FR.e3, -L))), add3(mul3(FR.e1, d), add3(mul3(FR.e2, L), mul3(FR.e3, -L))), add3(mul3(FR.e1, d), add3(mul3(FR.e2, L), mul3(FR.e3, L))), add3(mul3(FR.e1, d), add3(mul3(FR.e2, -L), mul3(FR.e3, L)))];
      D.panel(plane, SKY, 0.05, SKY, 2, { dash: [6, 5], alpha: 0.7 });
      if (sec.count >= 3) {
        const poly = sec.pts.map((p) => toWorld(Bs, p));
        D.panel(poly, AMB, 0.5, AMB, 4);
        poly.forEach((p) => D.dot(p, RED, 5));
      }
      // 단면의 실제 모양(정면에서 본 그림)
      if (sec.count >= 3 && C.txt) {
        const sz = b.W < 560 ? 104 : 140, x0 = b.insets.left + 12, y1 = b.H - b.insets.bottom - 12, y0 = y1 - sz, cx = x0 + sz / 2, cy = (y0 + y1) / 2;
        sRect(b, x0, y0, x0 + sz, y1, SKY, 0.07, true);
        const p2 = sec.pts.map((p) => [dot3(p, Bs.u), dot3(p, Bs.w)]);
        const ext = Math.max(...p2.map((q) => Math.hypot(q[0], q[1])), 0.5), k = (sz / 2 - 16) / ext;
        const pc = p2.reduce((a, q) => [a[0] + q[0] / p2.length, a[1] + q[1] / p2.length], [0, 0]);
        b.path(p2.map((q) => b.toW(cx + (q[0] - pc[0]) * k, cy - (q[1] - pc[1]) * k)), { close: true, fill: AMB, fillAlpha: 0.45, color: AMB, width: 3 });
        b.stext(x0 + sz / 2, y0 + 11, '단면의 실제 모양', { color: 'ink', size: 12, weight: 700, align: 'center', baseline: 'middle' });
      }
      if (C.txt) {
        const lines = [{ t: sec.count >= 3 ? `단면: ${M.name} (${sec.count}개의 변)` : '단면판이 입체 밖에 있어요', c: AMB, size: 17 }];
        if (st === 1) lines.push({ t: `평면이 지나는 면 ${sec.faces.length}개`, c: AMB, size: 15 });
        if (st === 2) lines.push({ t: `변의 수 = 자른 면의 수 = ${sec.faces.length}`, c: GRN, size: 15 });
        if (st === 3) lines.push({ t: '정육면체의 면은 6개 → 단면은 최대 육각형', c: GRN, size: 15 });
        banner(b, lines, C);
      }
      D.flush();
      if (C.tab === 'explore' && !C.thumb) {
        const a0 = D.P(mul3(FR.e1, -dmax)), a1 = D.P(mul3(FR.e1, dmax));
        b.handle('plane', D.P(add3(mul3(FR.e1, d), mul3(FR.e3, L))), { color: 'amber', r: 9, ariaLabel: '단면판 밀기', drag: (w) => { const tt = ((w.x - a0.x) * (a1.x - a0.x) + (w.y - a0.y) * (a1.y - a0.y)) / ((a1.x - a0.x) ** 2 + (a1.y - a0.y) ** 2); s.phTd = clamp(tt * 2 - 1, -1, 1); } });
      }
    },
    steps: (M) => [
      `평면이 정육면체의 어느 면을 지나는지 살펴요. 평면이 지나는 면은 $${M.sec.faces.length}$개예요.`,
      `단면의 변은 평면이 자른 면에서 하나씩 생겨요. 변의 수 $=$ 자른 면의 수 $=${M.k}$이므로 단면은 ${NAME_N[M.k] || ''}이에요.`,
      `정육면체의 면은 $6$개뿐이므로 단면의 변은 $6$개를 넘을 수 없어요. 단면은 삼각형·사각형·오각형·육각형 중 하나예요.`
    ],
    view: (M) => ({
      guide: `<b>방향 막대</b>로 입체를 제자리에서 돌리고 <b>단면판의 위치</b> 막대나 <b>노란 손잡이</b>로 단면판을 가로로 밀어 보세요. ${span('amber', '노란 도형')}이 단면이에요. 왼쪽 아래 작은 상자에는 단면의 실제 모양이 보여요. 위의 버튼으로 모양을 바로 만들 수 있어요.`,
      readouts: [rd('단면의 모양', M.k >= 3 ? M.name : '없음', AMB), rd('변의 개수', M.k >= 3 ? `${M.k}개` : '—', AMB), rd('평면이 지나는 면', `${M.sec.faces.length}개`, SKY)],
      formula: '<p>(단면의 변의 수) = (평면이 지나는 면의 수) ≤ 6</p>',
      rule: '정육면체를 한 평면으로 자른 단면은 삼각형·사각형·오각형·육각형 중 하나이다',
      notes: notes('단면의 변은 평면이 지나는 면에서 하나씩 생겨요.', '정육면체에서는 정삼각형·정사각형·정육각형 단면도 만들 수 있어요. 정오각형 단면은 만들 수 없어요.')
    }),
    prob: (M) => {
      const Q = M.Q, names = [3, 4, 5, 6, 7];
      return {
        tag: '정육면체의 단면', key: `${Q.es.join(',')}|${Q.ts.join(',')}`,
        stem: '정육면체의 세 모서리 위의 점 P, Q, R를 지나는 평면으로 정육면체를 자를 때, 단면의 모양은?',
        choices: mkText(names.map((k) => ({ h: `${NAME_N[k] || '칠각형'}`, ok: k === Q.cnt, hint: k === 7 ? '정육면체의 면은 6개뿐이라 단면은 6각형을 넘을 수 없어요.' : '평면이 지나는 면의 수를 세어 보세요.' })))
      };
    }
  };

  /* ------------------------------------------------------------------ p4-2 꼭짓점을 잘라 낸 입체 */
  function rollT2() { return { k: PLAT_KEYS[rint(0, 4)], ask: ['F', 'V', 'E'][rint(0, 2)] }; }
  const cutCounts = (I) => ({ F: I.F + I.V, V: 2 * I.E, E: 3 * I.E });
  const T2 = {
    id: 'p4-2', title: '꼭짓점을 잘라 낸 입체', short: '꼭짓점 자르기',
    question: '정다면체의 꼭짓점을 모두 잘라 내면 면·모서리·꼭짓점은 몇 개가 될까? 정이십면체를 알맞게 자르면 축구공 모양이 돼요.',
    ctl: () => ['phTr'].concat(VIEW),
    presets: () => PLAT_KEYS.map((k, i) => ({ group: i === 0 ? '입체 고르기' : '', label: PLAT[k].name, apply: (st) => { st.phSel6 = k; }, on: (st) => st.phSel6 === k })),
    init: (s) => { s.phSel6 = 'icosa'; s.phTr = 1 / 3; s.phQ = rollT2(); },
    reroll: (s) => { s.phQ = rollT2(); },
    model: (s) => {
      const k = s.phSel6 || 'icosa', I = PLAT[k], r = clamp(s.phTr, 0.05, 0.45), c = cutCounts(I);
      return { k, I, r, c, S: truncS(platS(k), r), Q: s.phQ };
    },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C);
      const k = C.problem ? M.Q.k : M.k, I = PLAT[k], r = C.problem ? 1 / 3 : C.review ? 1 / 3 : M.r, S = truncS(platS(k), r);
      D.fitPts(platS(k).V, { t: C.problem ? 40 : 96, b: 40, l: 50, r: 50 });
      // 잘려 나간 부분(원래 입체의 윤곽)은 옅은 점선으로
      const O = platS(k);
      drawPoly(D, O, { face: () => null, edge: () => ({ color: VIO, width: 1.6, alpha: 0.35, dash: [5, 5] }) });
      const cutEdge = (ei) => { const e = S.E[ei]; return e.f.some((fi) => S.F[fi].cut); };
      drawPoly(D, S, {
        face: (fi, vis) => (vis ? (S.F[fi].cut ? { c: AMB, a: st === 1 || st === 4 || C.problem ? 0.3 : 0.18 } : { c: 'green', a: 0.12 }) : null),
        edge: (ei) => ({ color: st === 3 && cutEdge(ei) ? RED : st === 2 ? 'ink' : 'ink', width: st === 3 && cutEdge(ei) ? 4 : 2.8 })
      });
      if (st === 2) S.V.forEach((p) => D.dot(p, RED, 4));
      if (C.txt) {
        const c = cutCounts(I);
        if (C.problem) banner(b, [{ t: `${I.name}의 모든 꼭짓점을 각 모서리의 $\\frac{1}{3}$만큼 잘라 낸 입체`.replace('$\\frac{1}{3}$', '3분의 1'), c: 'ink', size: 14 }], C);
        else banner(b, [{ t: `${I.name}의 꼭짓점 ${I.V}개를 잘라 내요`, c: 'ink', size: 16 }, st === 1 || st === 4 ? { t: `면 ${I.F}+${I.V} = ${c.F}개`, c: AMB, size: 15 } : null, st === 2 || st === 4 ? { t: `꼭짓점 2×${I.E} = ${c.V}개`, c: RED, size: 15 } : null, st === 3 || st === 4 ? { t: `모서리 3×${I.E} = ${c.E}개`, c: RED, size: 15 } : null], C);
      }
      D.flush();
    },
    steps: (M) => [
      `꼭짓점을 하나 잘라 낼 때마다 새 면이 하나씩 생겨요. 면은 원래 $${M.I.F}$개에 꼭짓점의 수 $${M.I.V}$를 더한 $${M.c.F}$개예요.`,
      `새로 생긴 꼭짓점은 원래 모서리마다 양 끝에 하나씩이에요. $2\\times ${M.I.E}=${M.c.V}$ (개)예요.`,
      `모서리는 원래 모서리 $${M.I.E}$개에 새 면의 모서리 $${2 * M.I.E}$개를 더해 $${M.c.E}$개예요. 오일러의 공식 $${M.c.V}-${M.c.E}+${M.c.F}=2$가 맞는지 확인해요.`
    ],
    view: (M) => ({
      guide: `입체를 고르고 <b>자르는 깊이</b> 막대로 꼭짓점을 잘라 보세요. ${span('amber', '노란 면')}이 새로 생긴 면이에요. 정이십면체를 모서리의 $\\frac13$만큼 자르면 정오각형 12개와 정육각형 20개로 된 축구공 모양(32면체)이 돼요.`.replace('$\\frac13$', '3분의 1'),
      readouts: [rd('원래 입체', M.I.name, 'ink', `면 ${M.I.F} · 모서리 ${M.I.E} · 꼭짓점 ${M.I.V}`), rd('면의 개수', `${M.c.F}개`, AMB, `${M.I.F} + ${M.I.V}`), rd('꼭짓점의 개수', `${M.c.V}개`, RED, `2 × ${M.I.E}`), rd('모서리의 개수', `${M.c.E}개`, RED, `3 × ${M.I.E}`)],
      formula: `<p>$V-E+F=${M.c.V}-${M.c.E}+${M.c.F}=2$ ✓</p>`,
      rule: '꼭짓점을 모두 잘라 내면 면은 (원래 면 + 꼭짓점의 수), 꼭짓점은 (원래 모서리 × 2), 모서리는 (원래 모서리 × 3)',
      notes: notes('절반(모서리의 가운데)까지 자르면 꼭짓점이 겹쳐서 개수가 달라져요. 이 장면은 절반보다 조금만 잘라요.', '새로 생긴 면의 변의 수는 잘려 나간 꼭짓점에 모여 있던 면의 수와 같아요.')
    }),
    prob: (M) => {
      const I = PLAT[M.Q.k], c = cutCounts(I), ask = M.Q.ask, nm = { F: '면', V: '꼭짓점', E: '모서리' }[ask], val = c[ask];
      const wr = [[I[ask], `원래 입체의 ${nm}의 개수예요. 잘라 낸 뒤의 개수를 구해야 해요.`], [c.F, '면의 개수예요.'], [c.V, '꼭짓점의 개수예요.'], [c.E, '모서리의 개수예요.'], [val + I.V, ''], [val - 2, ''], [val + 2, '']];
      return { tag: '꼭짓점을 자른 입체', key: `${M.Q.k}|${ask}`, stem: `${I.name}의 모든 꼭짓점을 각 모서리의 3분의 1만큼씩 잘라 냈다. 이때 생기는 입체의 ${nm}의 개수는?`, choices: mkChoices(val, wr) };
    }
  };

  G.register(40, 't4', '④ 도전: 단면과 꼭짓점 자르기', '도전', PARAMS, [T1, T2]);
})();
