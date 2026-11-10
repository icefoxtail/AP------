/* ==========================================================================
   중1 · 다면체와 정다면체 — 탭 ④ 「도전: 단면과 꼭짓점 자르기」 (t4.js, order 40) — 장면 4개
   · p4-1 정육면체의 단면 — 단면판이 화면 가로로만 움직이도록 입체를 제자리에서 돌려 놓고, 판을 좌우로 밉니다.
   · p4-3 세 꼭짓점을 지나는 단면 — 교과서 겨냥도의 꼭짓점 이름 A~H, 세 점을 골라 단면을 칠하고 이름(예: 직사각형 ABGH)을 표시. 계산은 cubesec.js
   · p4-2 꼭짓점을 잘라 낸 입체(축구공) — 면·모서리·꼭짓점의 수가 어떻게 달라지는지
   · p4-4 면의 중심을 이으면? — 정다면체 5종의 각 면의 중심에 점을 찍고 이웃한 점끼리 이어 만든 새 입체(면과 꼭짓점의 수가 서로 바뀜). 점 이름(A, B…)은 쓰지 않고 모양과 색으로만 보여 줍니다. 새 입체는 좌표(면 중심 + 볼록 껍질)에서 계산합니다.
   교육과정을 조금 넘어서는 도전 탭입니다(선택).
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PH;
  if (!G || !G.prismS) return;
  const CS = G.cubeSec;
  const { ease, lerp3, clamp, rint, shuf, jo, NUM, PI, DEG, v3, add3, sub3, mul3, dot3, cross3, len3, unit3, scene3, P, VIEW, mkChoices, mkText, rd, notes, solidOf, platS, PLAT, PLAT_KEYS, truncS, drawPoly, faceMid, banner, sRect, cen3 } = G;

  const PARAMS = {
    phTa: P('자르는 방향 ①', 0, 45, 1, 45, { color: 'sky', hint: '막대를 움직이면 입체가 제자리에서 돌아요', format: (v) => Math.round(v) + '°' }),
    phTb: P('자르는 방향 ②', 0, 45, 1, 45, { color: 'violet', hint: '입체를 다른 쪽으로 기울여요', format: (v) => Math.round(v) + '°' }),
    phTd: P('단면판의 위치', -1, 1, 0.01, 0, { color: 'amber', hint: '단면판을 가로로 밀어 보세요', format: (v) => (Math.abs(v) < 1e-9 ? '가운데' : (v > 0 ? '오른쪽 ' : '왼쪽 ') + Math.round(Math.abs(v) * 100) + '%') }),
    phTe: P('평면 넓히기', 0, 1, 0.01, 1, { color: 'amber', hint: '0이면 세 점을 이은 삼각형만, 1이면 정육면체를 끝까지 자른 단면', format: (v) => (v < 0.01 ? '세 점 삼각형만' : v > 0.99 ? '끝까지 자름' : Math.round(v * 100) + '%'), onInput: (s) => { s.playing = false; } }),
    phDu: P('잇기', 0, 1, 0.01, 0, { color: 'amber', hint: '오른쪽으로 밀면 ① 점 찍기 → ② 선분 잇기 → ③ 새 입체 칠하기 순서로 보여 줘요', format: (v) => (v < 0.02 ? '처음' : v < 0.32 ? '① 점 찍기' : v < 0.655 ? '② 선분 잇기' : v < 0.99 ? '③ 새 입체 칠하기' : '완성'), onInput: (s) => { s.playing = false; } }),
    phTr: P('자르는 깊이', 0.05, 0.45, 0.01, 1 / 3, { color: 'amber', hint: '모서리의 길이의 몇 분의 몇을 잘라 낼까요?', format: (v) => Math.abs(v - 1 / 3) < 1e-9 ? '모서리의 1/3' : `모서리의 ${Math.round(v * 100)}%` })
  };
  const AMB = 'amber', SKY = 'sky', GRN = 'green', RED = 'red', VIO = 'violet';
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;
  const stepOf = (C) => (C.problem ? 0 : C.review ? C.step : 4);
  // 맨 위 줄글(banner)이 차지하는 높이(px): n = 줄 수, sz = 글자 크기
  const topFor = (n, sz = 15, extra = 8) => 16 + n * (sz + 9) + extra;
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
    const add = (p) => { if (!pts.some((q) => len3(sub3(q, p)) < 1e-7)) pts.push(p); };
    CE.forEach(([i, j]) => {
      // 모서리의 어느 끝점이 평면 위에 놓여도 같은 교점입니다. 둘 다 놓이면 둘 다 보존합니다.
      if (Math.abs(sd[i]) < 1e-9) add(CV[i]);
      if (Math.abs(sd[j]) < 1e-9) add(CV[j]);
      if ((sd[i] < -1e-9 && sd[j] > 1e-9) || (sd[j] < -1e-9 && sd[i] > 1e-9)) {
        const t = sd[i] / (sd[i] - sd[j]); add(add3(CV[i], mul3(sub3(CV[j], CV[i]), t)));
      }
    });
    const edgeCount = CE.filter(([i, j]) => Math.abs(sd[i]) < 1e-9 && Math.abs(sd[j]) < 1e-9).length;
    if (pts.length < 3) return { pts, faces: [], count: 0, edgeCount, touchCount: pts.length, n, d, B };
    const c = cen3(pts), ang = (p) => Math.atan2(dot3(sub3(p, c), B.w), dot3(sub3(p, c), B.u));
    pts.sort((p, q) => ang(p) - ang(q));
    const faces = CF.map((f, fi) => fi).filter((fi) => { const s2 = CF[fi].map((i) => sd[i]); return Math.min(...s2) < -1e-9 && Math.max(...s2) > 1e-9; });
    return { pts, faces, count: pts.length, edgeCount, touchCount: 0, n, d, B };
  }
  function shapeName(sec) {
    const k = sec.count, B = sec.B;
    if (k < 3) return sec.touchCount === 1 ? '꼭짓점에서만 만남' : sec.touchCount === 2 ? '모서리에서만 만남' : '단면 없음';
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
    // 같은 꼭짓점에 모인 세 모서리의 중점은 실제 삼각형 단면을 만듭니다.
    const es = [0, 1, 2], ts = [0.5, 0.5, 0.5];
    return { es, ts, cnt: 3, P3: es.map((ei) => lerp3(CV[CE[ei][0]], CV[CE[ei][1]], 0.5)) };
  }
  const T1 = {
    id: 'p4-1', title: '정육면체의 단면', short: '정육면체의 단면',
    question: '정육면체를 한 평면으로 자르면 단면은 어떤 모양이 될까? 단면판을 가로로 밀고 입체를 돌려 가며 단면의 모양을 알아보자.',
    cam0: { yaw: -70, pitch: 24 }, // 위에서 내려다보는 시점: 정육면체가 입체로 보이게
    ctl: () => ['phTa', 'phTb', 'phTd'].concat(['phYaw']),
    presets: () => PRE.map((p, i) => ({ group: i === 0 ? '단면의 모양' : '', label: p.label, apply: (st) => { st.phTa = p.a; st.phTb = p.b; st.phTd = p.d; }, on: (st) => Math.abs(st.phTa - p.a) < 0.5 && Math.abs(st.phTb - p.b) < 0.5 && Math.abs(st.phTd - p.d) < 0.02 })),
    init: (s) => { s.phTa = 45; s.phTb = 45; s.phTd = 0; s.phQ = rollTri(); },
    reroll: (s) => { s.phQ = rollTri(); },
    model: (s) => {
      const sec = secAt(s.phTa, s.phTb, s.phTd);
      return { sec, name: shapeName(sec), k: sec.count, Q: s.phQ };
    },
    draw(b, s, M, C) {
      const st = stepOf(C);
      const D = scene3(b, s, C);
      if (C.problem) {
        // 문제: 위에서 본 정육면체와 세 점 P, Q, R
        const D2 = scene3(b, Object.assign({}, s, { phYaw: -30, phPitch: 24 }), C), Q = M.Q;
        const W = (p) => mul3(p, 1.3);
        D2.fitPts(CV.map(W), { t: 50, b: 50, l: 60, r: 60 });
        const S = solidOf(CV.map(W));
        drawPoly(D2, S, { face: (fi, vis) => (vis ? { c: 'green', a: 0.1 } : null), edge: () => ({ color: 'ink', width: 3 }) });
        if (C.questionReview && C.solutionStep >= 2) {
          const n = unit3(cross3(sub3(Q.P3[1], Q.P3[0]), sub3(Q.P3[2], Q.P3[0])));
          const sec = sectionOf(n, dot3(n, Q.P3[0]), basisOf(n));
          D2.panel(sec.pts.map(W), RED, 0.22, RED, 3.4);
        }
        ['P', 'Q', 'R'].forEach((nm, k) => { const p = W(Q.P3[k]); D2.dot(p, AMB, 7); D2.label(p, nm, { color: AMB, size: 19, dir: D2.out(p, v3(0, 0, 0)), gap: 12 }); });
        if (C.txt) banner(b, [{ t: C.questionReview && C.solutionStep >= 4 ? `단면은 ${NAME_N[Q.cnt]}: 변 ${Q.cnt}개` : '정육면체의 세 모서리 위의 점 P, Q, R', c: C.questionReview && C.solutionStep >= 4 ? RED : 'ink', size: 15 }], C);
        D2.flush();
        return;
      }
      const sec = M.sec, B = secAt(s.phTa, s.phTb, s.phTd).B || basisOf(normalOf(s.phTa, s.phTb)), n = normalOf(s.phTa, s.phTb), Bs = basisOf(n);
      const dmax = Math.abs(n.x) + Math.abs(n.y) + Math.abs(n.z), d = s.phTd * dmax;
      void B;
      const wv = CV.map((p) => toWorld(Bs, p));
      const L = 1.45;
      // 화면 틀: 입체 + 지금 놓인 단면판만 담습니다(판이 끝까지 가는 자리를 미리 잡지 않아 입체가 크게 보여요)
      const corners = [-1, 1].flatMap((sy) => [-1, 1].map((sz2) => add3(mul3(FR.e1, d), add3(mul3(FR.e2, sy * L), mul3(FR.e3, sz2 * L)))));
      const narrow = b.W < 560, boxSz = narrow ? 80 : 140, showBox = sec.count >= 3 && C.txt, keepBox = narrow && showBox; // 넓이 0인 끝점에서는 없는 실제 모양 상자의 자리를 비워 두지 않아 큐브와 접촉점을 크게 보여 줍니다.
      const nLines = st >= 1 && st <= 3 ? 2 : 1;
      // 휴대폰의 실제 모양 상자는 왼쪽 아래에 두고 그 오른쪽에 입체를 맞춥니다.
      // 상자 높이를 화면 전체 아래 여백으로 빼면 원래 정육면체가 손잡이만큼 작아집니다.
      D.fitPts(wv.concat(corners), { t: topFor(nLines, 17), b: keepBox ? 32 : 40, l: keepBox ? boxSz + 24 : 36, r: 36 });
      const S = solidOf(wv);
      const hit = (fi) => sec.faces.includes(fi);
      // 입체 면: 단면이 지나는 면을 강조
      const idxOf = (f) => CF.findIndex((c) => c.every((q) => f.i.map((v) => wv.findIndex((w) => len3(sub3(w, S.V[v])) < 1e-7)).includes(q)));
      const faceHit = S.F.map((f) => hit(idxOf(f)));
      drawPoly(D, S, { face: (fi, vis) => (vis ? (faceHit[fi] && (st === 1 || st === 4) ? { c: AMB, a: 0.13 } : { c: SKY, a: 0.08 }) : null), edge: () => ({ color: 'ink', width: 3.4 }) });
      // 단면판(화면에서 세로로 선 판) — 가로로만 움직임
      const plane = [add3(mul3(FR.e1, d), add3(mul3(FR.e2, -L), mul3(FR.e3, -L))), add3(mul3(FR.e1, d), add3(mul3(FR.e2, L), mul3(FR.e3, -L))), add3(mul3(FR.e1, d), add3(mul3(FR.e2, L), mul3(FR.e3, L))), add3(mul3(FR.e1, d), add3(mul3(FR.e2, -L), mul3(FR.e3, L)))];
      D.panel(plane, SKY, 0.05, SKY, 2, { dash: [6, 5], alpha: 0.7 });
      if (sec.count >= 3) {
        const poly = sec.pts.map((p) => toWorld(Bs, p));
        D.panel(poly, RED, 0.16, RED, 3.4);
        poly.forEach((p) => D.dot(p, AMB, 5));
      }
      // 단면의 실제 모양(정면에서 본 그림)
      if (sec.count >= 3 && C.txt) {
        const sz = boxSz, x0 = b.insets.left + 12, y1 = b.H - b.insets.bottom - 12, y0 = y1 - sz, cx = x0 + sz / 2, cy = (y0 + y1) / 2;
        sRect(b, x0, y0, x0 + sz, y1, SKY, 0.07, true);
        const p2 = sec.pts.map((p) => [dot3(p, Bs.u), dot3(p, Bs.w)]);
        const ext = Math.max(...p2.map((q) => Math.hypot(q[0], q[1])), 0.5), k = (sz / 2 - 16) / ext;
        const pc = p2.reduce((a, q) => [a[0] + q[0] / p2.length, a[1] + q[1] / p2.length], [0, 0]);
        b.path(p2.map((q) => b.toW(cx + (q[0] - pc[0]) * k, cy - (q[1] - pc[1]) * k)), { close: true, fill: RED, fillAlpha: 0.16, color: RED, width: 3 });
        b.stext(x0 + sz / 2, y0 + 11, narrow ? '실제 모양' : '단면의 실제 모양', { color: 'ink', size: 12, weight: 700, align: 'center', baseline: 'middle' });
      }
      if (C.txt) {
        const lines = [{ t: sec.count >= 3 ? `단면: ${M.name} (${sec.count}개의 변)` : sec.touchCount ? `${M.name} (넓이 0)` : '단면판이 입체 밖에 있어요', c: RED, size: 17 }];
        if (st === 1 && sec.count >= 3) lines.push({ t: `새 절단선 ${sec.faces.length}개 · 원래 모서리 ${sec.edgeCount}개`, c: AMB, size: 15 });
        if (st === 2 && sec.count >= 3) lines.push({ t: `단면의 변: ${sec.faces.length} + ${sec.edgeCount} = ${sec.count}개`, c: GRN, size: 15 });
        if (st === 3) lines.push({ t: '정육면체의 면은 6개 → 단면은 최대 육각형', c: GRN, size: 15 });
        banner(b, lines, C);
      }
      D.flush();
      if (C.tab === 'explore' && !C.thumb) {
        const a0 = D.P(mul3(FR.e1, -dmax)), a1 = D.P(mul3(FR.e1, dmax));
        b.handle('plane', D.P(add3(mul3(FR.e1, d), mul3(FR.e3, L))), { color: 'amber', r: 9, ariaLabel: '단면판 밀기', drag: (w) => { const tt = ((w.x - a0.x) * (a1.x - a0.x) + (w.y - a0.y) * (a1.y - a0.y)) / ((a1.x - a0.x) ** 2 + (a1.y - a0.y) ** 2); s.phTd = clamp(tt * 2 - 1, -1, 1); } });
      }
    },
    steps: (M) => M.k < 3 ? [
      M.sec.touchCount ? `평면은 정육면체의 ${M.sec.touchCount === 1 ? '꼭짓점' : '모서리'}에서만 만나요.` : '평면이 정육면체와 만나지 않아요.',
      '넓이가 있는 다각형 단면이 생기지 않았어요.',
      '단면판을 입체 안쪽으로 옮겨 넓이가 있는 단면을 만들어 보세요.'
    ] : [
      `평면이 면 내부를 가로질러 만드는 선분은 $${M.sec.faces.length}$개, 원래 모서리와 겹치는 변은 $${M.sec.edgeCount}$개예요.`,
      `두 종류를 합하면 단면의 변은 $${M.sec.faces.length}+${M.sec.edgeCount}=${M.k}$개예요. 단면은 ${M.name}이에요.`,
      `정육면체의 면은 $6$개뿐이므로 단면의 변은 $6$개를 넘을 수 없어요. 단면은 삼각형·사각형·오각형·육각형 중 하나예요.`
    ],
    view: (M) => ({
      guide: `<b>방향 막대</b>로 입체를 제자리에서 돌리고 <b>단면판의 위치</b> 막대나 <b>노란 손잡이</b>로 단면판을 가로로 밀어 보세요. ${span('red', '붉은 도형')}이 단면이에요. 왼쪽 아래 작은 상자에는 단면의 실제 모양이 보여요. 원래 모서리를 지날 때는 그 모서리도 단면의 변이 돼요.`,
      readouts: [rd('단면의 모양', M.name, RED), rd('변의 개수', M.k >= 3 ? `${M.k}개` : '—', RED), rd('새 절단선', `${M.sec.faces.length}개`, RED), rd('원래 모서리와 겹친 변', M.k >= 3 ? `${M.sec.edgeCount}개` : '—', AMB)],
      formula: '<p>(단면의 변) = (면 내부의 새 절단선) + (원래 모서리와 겹친 변) ≤ 6</p>',
      rule: '정육면체를 한 평면으로 자른 단면은 삼각형·사각형·오각형·육각형 중 하나이다',
      notes: notes('원래 모서리와 겹치는 변이 없을 때에는 단면의 변의 수가 평면이 가로지른 면의 수와 같아요.', '정육면체에서는 정삼각형·정사각형·정육각형 단면도 만들 수 있어요. 정오각형 단면은 만들 수 없어요.')
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
      D.fitPts(platS(k).V, { t: C.problem ? 56 : 100, b: 36, l: 40, r: 40 });
      // 잘려 나간 부분(원래 입체의 윤곽)은 옅은 점선으로
      const O = platS(k);
      drawPoly(D, O, { face: () => null, edge: (ei, vis) => (vis ? { color: RED, width: 1.6, alpha: 0.3, dash: [5, 5] } : { skip: true }) }); // 앞쪽 윤곽만: 뒤쪽 점선이 겹쳐 복잡해지지 않게
      const cutEdge = (ei) => { const e = S.E[ei]; return e.f.some((fi) => S.F[fi].cut); };
      drawPoly(D, S, {
        face: (fi, vis) => (vis ? (S.F[fi].cut ? { c: RED, a: st === 1 || st === 4 || C.problem ? 0.18 : 0.12 } : { c: 'green', a: 0.1 }) : null),
        edge: (ei, vis) => ({ color: st === 3 && cutEdge(ei) ? RED : 'ink', width: st === 3 && cutEdge(ei) ? 4 : 2.8, alpha: vis ? 1 : 0.5 })
      });
      if (st === 2) S.V.forEach((p) => D.dot(p, AMB, 4));
      if (C.txt) {
        const c = cutCounts(I);
        if (C.problem) banner(b, [{ t: `${I.name}의 모든 꼭짓점을`, c: 'ink', size: 14 }, { t: '각 모서리의 3분의 1만큼 잘라 낸 입체', c: 'ink', size: 14 }], C); // 폰 폭에서 한 줄로는 잘려서 두 줄로
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
      guide: `입체를 고르고 <b>자르는 깊이</b> 막대로 꼭짓점을 잘라 보세요. ${span('red', '붉은 단면')}이 새로 생긴 면이고, 초록색은 남은 원래 면이에요. 옅은 붉은 점선은 잘려 나간 원래 윤곽이에요. 정이십면체를 모서리의 $\\frac13$만큼 자르면 정오각형 12개와 정육각형 20개로 된 축구공 모양(32면체)이 돼요.`.replace('$\\frac13$', '3분의 1'),
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

  /* ------------------------------------------------------------------ p4-3 세 꼭짓점을 지나는 단면 */
  // 교과서 겨냥도: 윗면 A(뒤 왼쪽)·D(뒤 오른쪽)·B(앞 왼쪽)·C(앞 오른쪽), 아랫면 E(뒤 왼쪽, 가려진 점)·F·G·H. 계산은 모두 cubesec.js
  // 학생 오개념: 「세 점을 이은 삼각형 = 단면」. 평면은 세 점에서 끝나지 않고 끝없이 넓어지는 면이라, 정육면체 안에서 평면이 지나는 부분 전체가 단면입니다.
  // 그래서 「평면 넓히기」(phTe 0~1)로 삼각형 → 단면이 되는 과정을 보여 줍니다(정삼각형 단면은 넓혀도 그대로).
  const T3 = (function () {
    if (!CS) return null;
    const LET8 = CS.NAMES.split(''), V8 = LET8.map((L) => v3(...CS.POS[L]));
    const vp = (L) => V8[LET8.indexOf(L)];
    const a3 = (p) => v3(p[0], p[1], p[2]);
    const SHAPES = ['정삼각형', '직각삼각형', '정사각형', '직사각형', '오각형'];
    const REL_COL = { edge: SKY, face: GRN, space: VIO };
    const count = (k) => CS.ALL.filter((x) => x.kind === k).length;
    const mt = (x) => `$${x}$`, seg = (p, q) => `$\\overline{${[p, q].sort().join('')}}$`;
    const letters = (a) => a.map(mt).join(', ');
    const yo = (w) => (jo(w, 'i') === '이' ? '이에요' : '예요');
    const relTxt = (pr) => (pr.rel === 'face' ? `${pr.face.name}의 대각선` : CS.REL_KO[pr.rel]);
    const sameSel = (a, b) => !!a && a.length === 3 && b.every((x) => a.includes(x));
    const toggle = (st, L) => {
      const a = (st.phC3 || []).slice(), i = a.indexOf(L);
      if (i >= 0) a.splice(i, 1); else { a.push(L); if (a.length > 3) a.shift(); }
      st.phC3 = a;
      st.phTe = 1; st.playing = false; // 점을 새로 고르면 완성된 단면부터 보여 줍니다(막대를 0으로 내려 삼각형만 볼 수 있어요)
    };
    // 새 문제: 정삼각형·직사각형 위주, 한 면 위의 세 점(정사각형)은 가끔
    function rollQ(prev) {
      for (let g = 0; g < 50; g++) {
        const r = Math.random(), kind = r < 0.45 ? 'rect' : r < 0.9 ? 'tri' : 'square';
        const pool = CS.ALL.filter((x) => x.kind === kind), pick = pool[rint(0, pool.length - 1)];
        if (!prev || pick.tri.join('') !== prev.join('')) return { tri: pick.tri };
      }
      return { tri: ['A', 'G', 'H'] };
    }
    // 선생님 문항(A·G·H)은 삼각형(0)에서 시작해 저절로 넓어집니다. 나머지 대표 단면은 완성된 단면(1)으로 바로 보여 줍니다.
    const PRESETS3 = [{ label: '직사각형 (A·G·H)', tri: ['A', 'G', 'H'], play: true }, { label: '정삼각형 (B·D·E)', tri: ['B', 'D', 'E'] }, { label: '정사각형 (A·B·C)', tri: ['A', 'B', 'C'] }];
    const ans = (sec) => SHAPES.indexOf(sec.name);
    const triLab = (sec) => sec.tri.join('');
    // 평면 넓히기 단계의 맨 위 줄글(항상 2줄이라 그림 크기가 흔들리지 않습니다)
    function extLines(sec, t) {
      const l1 = t < 0.01 ? { t: `세 점을 이은 삼각형 ${triLab(sec)}: ${CS.triName(sec)}`, c: SKY, size: 17 } : t > 0.99 ? { t: `단면: ${sec.label}`, c: RED, size: 17 } : { t: '평면을 넓히는 중…', c: AMB, size: 17 };
      const l2 = t < 0.01 ? { t: '이 삼각형이 곧 단면일까?', c: 'ink', size: 14 }
        : t > 0.99 ? { t: sec.fourth ? `삼각형은 시작일 뿐, 평면이 ${sec.fourth}까지 닿아요` : '넓혀도 삼각형 그대로예요', c: GRN, size: 14 }
          : { t: '평면은 끝없이 넓어요', c: 'ink', size: 14 };
      return [l1, l2];
    }
    const extMsg = (sec) => (sec ? (sec.fourth ? `세 점 삼각형은 시작일 뿐, 평면을 넓히면 ${sec.fourth}까지 닿아요` : '세 점 삼각형이 이미 정육면체의 꼭짓점 끝까지 닿아 있어, 넓혀도 그대로예요') : '세 점을 고르면 알려 드려요');
    // 평면 위에서 단면을 둘러싼 직사각형 판(밖으로 나가는 부분을 옅게 보여 주기 위함). k = 0~1 로 중심에서 커집니다.
    function planeCorners(sec, k) {
      const ps = sec.poly.map((L) => vp(L)), c = cen3(ps), n = unit3(v3(...sec.n)), u = unit3(sub3(ps[1], ps[0])), w = cross3(n, u);
      let u0 = 1e9, u1 = -1e9, w0 = 1e9, w1 = -1e9;
      ps.forEach((p) => { const d = sub3(p, c), a = dot3(d, u), e = dot3(d, w); u0 = Math.min(u0, a); u1 = Math.max(u1, a); w0 = Math.min(w0, e); w1 = Math.max(w1, e); });
      const m = 0.5, hu = (u1 - u0) / 2 + m, hw = (w1 - w0) / 2 + m, O = add3(c, add3(mul3(u, (u0 + u1) / 2), mul3(w, (w0 + w1) / 2)));
      return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => add3(O, add3(mul3(u, x * hu * k), mul3(w, y * hw * k))));
    }
    // 정리 탭 풀이(4단계): 두 점씩 이어 본다 → 세 점 삼각형은 단면이 아니다, 평면을 넓힌다 → 평행한 모서리로 넷째 점 → 모양
    function stepsOf(sec) {
      const t = sec.tri, last = relTxt(sec.pairs[2]), pairs = sec.pairs.map((pr) => `${seg(pr.p, pr.q)}${jo(pr.p + pr.q, 'eun')} ${relTxt(pr)}`).join(', ') + (last.endsWith('리') ? '예요' : '이에요');
      const sides = sec.poly.map((_, i) => ({ p: sec.poly[i], q: sec.poly[(i + 1) % sec.poly.length] }));
      const nm = `${sec.name} ${mt(sec.poly.join(''))}`, ok = `정답은 ${NUM[ans(sec)]}번이에요.`;
      const tl = triLab(sec), tn = CS.triName(sec), rv = CS.rightVertex(sec);
      if (sec.kind === 'square' || sec.kind === 'rect') {
        const widen = `세 점을 이은 삼각형 ${mt(tl)}${jo(tl, 'eun')} ${mt(rv)}에서 직각인 ${tn}이지만, 단면은 이 삼각형이 아니에요. 평면은 세 점에서 끝나지 않고 끝없이 넓어지는 면이에요. 정육면체 안에서 평면이 지나는 부분 전체가 단면이므로, 평면을 넓혀 정육면체를 끝까지 잘라 보아요.`;
        if (sec.kind === 'square') {
          const f = sec.face;
          return [
            `세 점 ${letters(t)}를 두 점씩 이어 봐요. ${pairs}. 세 점은 모두 ${f.name} 위에 있어요.`,
            widen,
            `세 점이 한 면 위에 있으면 평면은 그 면과 같아요. 평면을 넓히면 ${f.name}의 나머지 꼭짓점 ${mt(sec.fourth)}${jo(sec.fourth, 'i')} 넷째 점이에요.`,
            `단면은 ${f.name} ${mt(sec.poly.join(''))} 그대로예요. 정육면체의 면은 정사각형이므로 단면은 ${nm}이에요. ${ok}`
          ];
        }
        const [x, y] = sec.par.edge, z = sec.par.z, w = sec.par.w;
        const eds = sides.filter((e) => CS.relOf(e.p, e.q) === 'edge'), dgs = sides.filter((e) => CS.relOf(e.p, e.q) === 'face');
        return [
          `세 점 ${letters(t)}를 두 점씩 이어 봐요. ${pairs}. 세 점은 한 면 위에 있지 않아요.`,
          widen,
          `모서리 ${seg(x, y)}와 평행하면서 점 ${mt(z)}를 지나는 모서리는 ${seg(z, w)}${yo(z + w)}. 평행한 두 모서리는 한 평면 위에 있으므로 평면은 점 ${mt(w)}도 지나요. 평면을 넓히면 넷째 점 ${mt(w)}까지 닿아요.`,
          `평면은 ${seg(z, w)}와 ${seg(x, y)}를 포함하므로 단면은 ${letters(sec.poly)}를 꼭짓점으로 하는 사각형이에요. 모서리 ${eds.map((e) => seg(e.p, e.q)).join(', ')}와 면의 대각선 ${dgs.map((e) => seg(e.p, e.q)).join(', ')}가 마주 보는 변끼리 같고, 모서리는 면에 수직이라 네 각이 모두 직각이에요. 이웃한 두 변은 모서리와 면의 대각선이라 길이가 달라서 정사각형은 아니에요. 단면은 ${nm}이에요. ${ok}`
        ];
      }
      return [
        `세 점 ${letters(t)}를 두 점씩 이어 봐요. ${pairs}. 세 선분이 모두 면의 대각선이에요.`,
        `세 점을 이은 삼각형 ${mt(tl)}${jo(tl, 'eun')} 세 변이 모두 면의 대각선인 ${tn}이에요. 평면은 끝없이 넓어지지만, 정육면체 안에서 평면이 지나는 부분은 이 삼각형뿐이에요(꼭짓점 ${mt(sec.hub)}${jo(sec.hub, 'eul')} 잘라 낸 모양). 평면을 넓혀도 단면은 그대로예요.`,
        `세 선분이 모두 면의 대각선이면 평행한 모서리가 없어 넷째 점이 생기지 않아요. 세 점은 모두 꼭짓점 ${mt(sec.hub)}에 모서리로 이웃한 점이고, 평면은 다른 꼭짓점을 지나지 않아요. 단면은 삼각형 ${mt(sec.poly.join(''))}이에요.`,
        `세 변 ${sec.pairs.map((pr) => seg(pr.p, pr.q)).join(', ')}는 모두 크기가 같은 정사각형 면의 대각선이라 길이가 같아요. 세 변의 길이가 같으므로 단면은 ${nm}이에요. ${ok}`
      ];
    }
    // 오답 힌트: 이름은 실제 문제의 이름을 씁니다. 직각삼각형을 고른 학생에게는 「삼각형은 직각삼각형이 맞지만 평면은 더 넓다」를 알려 줍니다.
    function hintFor(shape, sec) {
      const tl = triLab(sec);
      if (shape === '정삼각형') return sec.kind === 'rect' ? '세 점 사이에 모서리가 있어 세 변의 길이가 같지 않아요. 세 선분이 모두 면의 대각선일 때만 정삼각형이에요.' : '세 점이 한 면 위에 있으면 평면은 그 면과 같아요. 면은 사각형이에요.';
      if (shape === '직각삼각형') return sec.kind === 'tri' ? `세 점을 이은 삼각형 ${tl}${jo(tl, 'eun')} 세 변이 모두 면의 대각선이라 길이가 같아요. 직각삼각형이 아니에요.` : `세 점을 이은 삼각형 ${tl}${jo(tl, 'eun')} 직각삼각형이지만, 평면은 더 넓어요. 평면이 정육면체를 끝까지 자르면 어디까지 닿을까요?`;
      if (shape === '정사각형') return sec.kind === 'tri' ? '평면은 세 점만 지나는 삼각형 모양이에요.' : '단면의 이웃한 변이 모서리와 면의 대각선이라 길이가 달라요. 정사각형이 아니에요.';
      if (shape === '직사각형') return sec.kind === 'tri' ? '평면이 지나는 꼭짓점은 세 개뿐이라 단면은 삼각형이에요.' : '네 변이 모두 모서리라 길이가 같아요. 더 알맞은 이름이 있어요.';
      return '단면의 꼭짓점은 세 점과 평행한 모서리로 찾은 넷째 점뿐이에요. 오각형은 될 수 없어요.';
    }
    return {
      id: 'p4-3', title: '세 꼭짓점을 지나는 단면', short: '세 꼭짓점 단면',
      question: '세 점을 이은 삼각형이 곧 단면일까? 정육면체의 꼭짓점 세 개를 골라 그 세 점을 지나는 평면으로 자르고, 평면을 넓혀 단면이 어떻게 되는지 알아보자.',
      cam0: { yaw: -30, pitch: 22 },
      anim: { key: 'phTe', dur: 3.2, label: '평면 넓혀 보기', start: 0 },
      stepT: (n) => (n >= 2 ? 1 : 0),
      ctl: () => ['phTe'].concat(VIEW),
      presets: () => PRESETS3.map((p, i) => ({ group: i === 0 ? '대표 단면' : '', label: p.label, apply: (st) => { st.phC3 = p.tri.slice(); st.phTe = p.play ? 0 : 1; st.playing = !!p.play; }, on: (st) => sameSel(st.phC3, p.tri) }))
        .concat(LET8.map((L, i) => ({ group: i === 0 ? '꼭짓점 고르기 (3개)' : '', label: L, apply: (st) => toggle(st, L), on: (st) => (st.phC3 || []).includes(L) }))),
      init: (s) => { s.phC3 = ['A', 'G', 'H']; s.phQ = { tri: ['A', 'G', 'H'] }; s.phTe = 0; s.phVa = { yaw: s.phYaw, pitch: s.phPitch }; s.phVman = false; },
      // 평면을 옆에서 보면 단면이 가는 선이 되므로, 단면이 충분히 보이는 시점으로 부드럽게 돌립니다(기본 시점이 괜찮으면 그대로).
      // 학생이 돌려 보기 막대·끌기로 직접 시점을 바꾼 뒤에는 이 장면에서 더는 자동으로 돌리지 않습니다.
      viewTick: (s, dt, lab) => {
        if (s.phVman) return false;
        if (s.phVa && (Math.abs(s.phYaw - s.phVa.yaw) > 0.02 || Math.abs(s.phPitch - s.phVa.pitch) > 0.02)) { s.phVman = true; return false; } // 우리가 둔 값과 달라졌다 = 학생이 돌렸다
        const M = T3.model(s), sec = lab.tab === 'problem' ? M.qsec : M.sec;
        const tg = sec ? CS.viewFor(sec) : CS.DEFAULT_VIEW, dy = tg.yaw - s.phYaw, dp = tg.pitch - s.phPitch;
        if (Math.abs(dy) < 0.05 && Math.abs(dp) < 0.05) { s.phVa = { yaw: s.phYaw, pitch: s.phPitch }; return false; }
        const k = 1 - Math.exp(-Math.min(dt, 0.1) * 6);
        s.phYaw += dy * k; s.phPitch += dp * k;
        s.phVa = { yaw: s.phYaw, pitch: s.phPitch };
        return true;
      },
      reroll: (s) => { s.phQ = rollQ(s.phQ && s.phQ.tri); },
      model: (s) => {
        const sel = (s.phC3 || []).slice(), Q = s.phQ || { tri: ['A', 'G', 'H'] };
        return { sel, sec: sel.length === 3 ? CS.sectionOf3(sel[0], sel[1], sel[2]) : null, Q, qsec: CS.sectionOf3(Q.tri[0], Q.tri[1], Q.tri[2]) };
      },
      draw(b, s, M, C) {
        const st = C.review ? Math.max(1, C.step) : stepOf(C), asQ = C.problem || C.questionReview, sec = asQ ? M.qsec : M.sec, sel = asQ ? M.qsec.tri : M.sel;
        const D = scene3(b, s, C), S = solidOf(V8);
        const ext = C.thumb || C.problem ? 1 : C.review ? clamp(C.t, 0, 1) : clamp(s.phTe == null ? 1 : s.phTe, 0, 1); // 평면 넓히기(0 = 세 점 삼각형, 1 = 단면)
        const showPatch = !!sec && !C.problem && (!C.review || st >= 2);
        const show4 = !!(sec && sec.fourth) && !C.problem && (!C.review || st >= 3 || (st === 2 && ext > 0.01)) && ext > 0.01;
        // 맨 위 줄글
        let lines = [];
        if (C.problem) lines.push({ t: `세 꼭짓점 ${M.qsec.tri.join(', ')}를 지나는 평면으로 자른다`, c: 'ink', size: 15 });
        else if (C.review && sec) {
          if (st === 1) sec.pairs.forEach((pr) => lines.push({ t: `${pr.p}${pr.q}: ${relTxt(pr)}`, c: REL_COL[pr.rel], size: 15 }));
          else if (st === 2) lines = extLines(sec, ext);
          else if (st === 3) {
            if (sec.kind === 'rect') lines.push({ t: `평행한 모서리 ${sec.par.edge.join('')} ∥ ${[sec.par.z, sec.par.w].sort().join('')}`, c: SKY, size: 15 }, { t: `넷째 점 ${sec.par.w}`, c: AMB, size: 15 });
            else if (sec.kind === 'square') lines.push({ t: `${sec.face.name} ${sec.poly.join('')}`, c: AMB, size: 15 }, { t: `넷째 점 ${sec.fourth}`, c: AMB, size: 15 });
            else lines.push({ t: '넷째 점이 없어요', c: RED, size: 15 }, { t: `세 점 모두 ${sec.hub}에 이웃해요`, c: SKY, size: 15 });
          } else lines.push({ t: `단면: ${sec.label}`, c: RED, size: 17 });
        } else if (sec) lines = extLines(sec, ext);
        else lines.push({ t: `꼭짓점 ${sel.length}/3 — 세 점을 골라 주세요`, c: 'ink', size: 16 }, { t: '세 점을 고르면 단면이 보여요', c: 'ink', size: 14 });
        const pc = showPatch ? planeCorners(sec, 1) : [];
        D.fitPts(V8.concat(pc), { t: topFor(lines.length, 16) + 14, b: 44, l: 46, r: 46 });
        const faceLet = (f) => f.i.map((i) => LET8[i]);
        const hl = sec && C.review && st === 3 && sec.kind === 'square' ? sec.face : null; // 한 면 위의 세 점: 그 면을 강조
        const hlSet = hl ? CS.lettersOnFace(hl).join('') : '';
        const parE = sec && C.review && st === 3 && sec.kind === 'rect' ? [sec.par.edge.join(''), [sec.par.z, sec.par.w].sort().join('')] : [];
        drawPoly(D, S, {
          face: (fi, vis) => (vis ? (faceLet(S.F[fi]).sort().join('') === hlSet ? { c: AMB, a: 0.16 } : { c: SKY, a: 0.08 }) : null),
          edge: (ei, vis) => (parE.includes([LET8[S.E[ei].a], LET8[S.E[ei].b]].sort().join('')) ? { color: SKY, width: 5.4 } : { color: 'ink', width: 3.2 })
        });
        if (sec && C.review && st === 1) sec.pairs.forEach((pr) => D.line(vp(pr.p), vp(pr.q), REL_COL[pr.rel], 4.6));
        if (showPatch) {
          if (ext > 0.005) D.panel(planeCorners(sec, ext), SKY, 0.05, SKY, 1.8, { dash: [6, 5], alpha: 0.85 }); // 정육면체 밖으로 끝없이 넓어지는 평면(옅게)
          D.panel(CS.patchAt(sec, ext).map(a3), RED, 0.16, RED, 4); // 정육면체 안의 부분: 삼각형 → 단면
        }
        const rv = sec && !C.problem ? CS.rightVertex(sec) : null;
        if (rv) { const o = sec.tri.filter((L) => L !== rv); D.right(vp(rv), sub3(vp(o[0]), vp(rv)), sub3(vp(o[1]), vp(rv)), 0.3, AMB); } // 세 점 삼각형의 직각 표시
        if (parE.length) { D.par(vp(sec.par.edge[0]), vp(sec.par.edge[1]), 1, SKY); D.par(vp(sec.par.z), vp(sec.par.w), 1, SKY); }
        const hidden = (i) => !S.vf[i].some((fi) => D.facing(S.F[fi].n));
        const four4 = (L) => show4 && sec.fourth === L && ext > 0.99; // 넷째 점이 제자리에 닿은 순간
        LET8.forEach((L) => {
          const p = vp(L), on = sel.includes(L);
          D.dot(p, on ? AMB : 'ink', on ? 7 : 4);
          D.obstacle(p, on ? 10 : 7);
        });
        if (show4) { // 넷째 점: 삼각형의 한 변 위에서 출발해 제자리로 옮겨 가고, 닿으면 고리로 강조
          const j = sec.poly.indexOf(sec.fourth), q = a3(CS.patchAt(sec, ext)[j]);
          D.dot(q, AMB, 6.5);
          if (ext > 0.99) b.point(D.P(q), { color: AMB, r: 13, hollow: true });
        }
        if (C.txt) {
          LET8.forEach((L, i) => {
            const p = vp(L), on = sel.includes(L);
            D.label(p, L, { dir: D.out(p, v3(0, 0, 0)), gap: 12, size: 20, color: on || four4(L) ? AMB : 'ink', alpha: hidden(i) ? 0.85 : 1, inside: hidden(i) });
          });
          banner(b, lines, C);
        }
        D.flush();
      },
      steps: (M) => M.sec ? stepsOf(M.sec) : ['서로 다른 세 꼭짓점을 골라요.', '세 점을 지나는 평면을 정육면체 끝까지 넓혀요.', '정육면체와 평면이 겹치는 부분 전체가 단면이에요.'],
      problemSteps: (M) => stepsOf(M.qsec),
      questionReviewDraw: true,
      view: (M) => {
        const sec = M.sec, k = (x) => `${count(x)}가지`;
        return {
          guide: `아래 <b>꼭짓점 단추</b>에서 세 점을 골라 보세요(네 번째 점을 누르면 가장 먼저 고른 점이 빠져요). ${span('amber', '노란 점')}은 고른 점, ${span('red', '붉은 도형')}은 정육면체 안의 단면이에요. 움직이는 노란 점이 넷째 꼭짓점에 닿으면 <b>고리</b>로 강조해요. <b>평면 넓히기</b> 막대를 0으로 내리면 세 점을 이은 삼각형만 보이고, 1로 올리면 평면이 정육면체를 끝까지 잘라 단면이 돼요(옅은 판이 끝없이 넓은 평면이에요). 점선은 가려진 모서리이고, <b>대표 단면</b> 단추로 세 가지 경우를 바로 볼 수 있어요.`,
          readouts: [
            rd('고른 꼭짓점', M.sel.length ? M.sel.join(' · ') : '—', AMB, `${M.sel.length} / 3`),
            rd('세 점을 이은 삼각형', sec ? `${triLab(sec)}: ${CS.triName(sec)}` : '—', SKY),
            rd('단면의 모양', sec ? sec.label : '—', RED),
            rd('단면이 지나는 꼭짓점', sec ? `${sec.poly.length}개` : '—', AMB, sec ? (sec.fourth ? `넷째 점 ${sec.fourth}` : '넷째 점 없음') : ''),
            rd('평면을 넓히면', extMsg(sec), 'green', null, null, true)
          ],
          formula: '<p>한 면 위의 세 점 → 정사각형 · 마주 보는 두 모서리 → 직사각형 · 한 꼭짓점에 이웃한 세 점 → 정삼각형</p>',
          rule: `세 점을 이은 삼각형이 아니라, 세 점을 지나는 평면이 정육면체를 자른 부분 전체가 단면이다. 서로 다른 세 꼭짓점을 고르는 방법 ${CS.ALL.length}가지의 단면은 정사각형(${k('square')}), 직사각형(${k('rect')}), 정삼각형(${k('tri')}) 중 하나이다`,
          notes: notes('세 점을 이은 삼각형이 직각삼각형이어도 단면이 직각삼각형인 것은 아니에요. 평면은 세 점에서 끝나지 않고 끝없이 넓어져요.', '두 점을 이은 선분이 모서리인지, 면의 대각선인지, 공간의 대각선인지 먼저 살펴보세요.', '직사각형 단면은 평행한 두 모서리를 포함해요. 모서리 하나와 그와 평행한 모서리의 한 끝점을 찾으면 넷째 점이 정해져요.', '세 점이 모두 면의 대각선으로 이어지면 단면은 꼭짓점 세 개뿐인 정삼각형이에요. 넓혀도 그대로예요.')
        };
      },
      prob: (M) => {
        const sec = M.qsec;
        return {
          tag: '세 꼭짓점을 지나는 단면', key: sec.tri.join(''),
          stem: `정육면체를 세 꼭짓점 ${sec.tri.join(', ')}를 지나는 평면으로 자를 때 생기는 단면의 모양은?`,
          note: '점선은 가려진 모서리예요.',
          choices: mkText(SHAPES.map((nmS) => ({ h: nmS, ok: nmS === sec.name, hint: hintFor(nmS, sec) })))
        };
      }
    };
  })();


  /* ------------------------------------------------------------------ p4-4 면의 중심을 이으면? */
  // 정다면체의 각 면의 중심 → 새 입체의 꼭짓점. 새 입체의 면·모서리는 중심들의 볼록 껍질(좌표)에서 구하고,
  // 모서리가 「이웃한 면 둘」에서 생기는 것과 같은지는 tools/polyhedra-dual.test.mjs 가 확인합니다. 이름은 PLAT 표의 (면·꼭짓점·모서리 수)와 맞춰 찾습니다(정답 표를 따로 두지 않음).
  const DUAL_CACHE = {};
  const dualOf = (k) => {
    if (DUAL_CACHE[k]) return DUAL_CACHE[k];
    const S = platS(k), centers = S.F.map((f) => faceMid(S.V, f)), T = solidOf(centers);
    const len = T.E.map((e) => len3(sub3(T.V[e.a], T.V[e.b])));
    const same = len.every((x) => Math.abs(x - len[0]) < 1e-6 * Math.max(1, len[0]));
    const deg = T.vf.map((l) => l.length), nSide = T.F.map((f) => f.i.length);
    const regular = same && deg.every((x) => x === deg[0]) && nSide.every((x) => x === nSide[0]);
    const cnt = { V: T.V.length, F: T.F.length, E: T.E.length };
    const key = regular ? PLAT_KEYS.find((q) => PLAT[q].V === cnt.V && PLAT[q].F === cnt.F && PLAT[q].E === cnt.E) || null : null;
    return (DUAL_CACHE[k] = { S, T, centers, cnt, regular, key, name: key ? PLAT[key].name : '정다면체가 아닌 입체', side: nSide[0], deg: deg[0] });
  };
  const POLY_KO = { 3: '정삼각형', 4: '정사각형', 5: '정오각형' };
  const NM_VFE = { V: '꼭짓점', F: '면', E: '모서리' };
  const DU = { dot: [0, 0.3], edge: [0.33, 0.64], fill: [0.68, 1] }; // 잇기 막대 0~1 에서 세 단계가 차지하는 구간
  const ph01 = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const stg = (p, i, n) => clamp((p - 0.5 * i / Math.max(1, n)) / 0.5, 0, 1); // i번째가 차례로 나타나게
  const duStage = (t) => (t < 0.01 ? 0 : t < 0.32 ? 1 : t < 0.655 ? 2 : 3);
  function rollT4(prev) {
    for (let g = 0; g < 30; g++) {
      const r = Math.random(), q = { k: PLAT_KEYS[rint(0, 4)], ask: r < 0.4 ? 'shape' : ['V', 'F', 'E'][rint(0, 2)] };
      if (!prev || q.k !== prev.k || q.ask !== prev.ask) return q;
    }
    return { k: 'cube', ask: 'shape' };
  }
  const T4 = {
    id: 'p4-4', title: '면의 중심을 이으면?', short: '면의 중심 잇기',
    question: '정육면체의 각 면의 한가운데에 점을 찍고 이웃한 점끼리 이으면 어떤 입체가 될까? 입체를 바꿔 가며 새 입체의 꼭짓점·면·모서리의 수를 비교해 보자.',
    cam0: { yaw: -36, pitch: 22 },
    anim: { key: 'phDu', dur: 7, label: '면의 중심 이어 보기', start: 0 },
    stepT: (n) => (n <= 0 ? 0 : n === 1 ? 0.31 : n === 2 ? 0.65 : 1),
    ctl: () => ['phDu'].concat(VIEW),
    presets: () => PLAT_KEYS.map((k, i) => ({ group: i === 0 ? '입체 고르기' : '', label: PLAT[k].name, apply: (st) => { st.phSel7 = k; st.phDu = 0; st.playing = true; }, on: (st) => st.phSel7 === k })),
    init: (s) => { s.phSel7 = 'cube'; s.phDu = 0; s.phQ = { k: 'cube', ask: 'shape' }; },
    reroll: (s) => { s.phQ = rollT4(s.phQ); },
    model: (s) => ({ k: s.phSel7 || 'cube', Q: s.phQ || { k: 'cube', ask: 'shape' } }),
    draw(b, s, M, C) {
      const D = scene3(b, s, C), asQ = C.problem || C.review;
      const k = asQ ? M.Q.k : M.k, X = dualOf(k), S = X.S, T = X.T, I = PLAT[k], dense = S.E.length > 20;
      const t = C.problem ? 0 : C.thumb ? 1 : clamp(C.t, 0, 1);
      const pd = ph01(t, DU.dot[0], DU.dot[1]), pe = ph01(t, DU.edge[0], DU.edge[1]), pf = ph01(t, DU.fill[0], DU.fill[1]);
      const nF = S.F.length, nE = T.E.length;
      const rD = dense ? 5.4 : 7, rH = dense ? 3.6 : 4.4;
      const sx = b.W < 560 ? 20 : 40;
      D.fitPts(S.V, { t: topFor(2, 17) + 4, b: 40, l: sx, r: sx });
      // 맨 위 줄글(항상 2줄)
      if (C.txt) {
        const st3 = duStage(t);
        let l1, l2;
        if (C.problem) { l1 = { t: I.name, c: 'ink', size: 17 }; l2 = { t: '각 면의 한가운데에 점을 찍었어요', c: AMB, size: 14 }; }
        else if (st3 === 0) { l1 = { t: I.name, c: GRN, size: 17 }; l2 = { t: `면 ${I.F}개 · 꼭짓점 ${I.V}개 · 모서리 ${I.E}개`, c: 'ink', size: 14 }; }
        else if (st3 === 1) { l1 = { t: '각 면의 한가운데에 점을 찍어요', c: AMB, size: 16 }; l2 = { t: `점 ${nF}개 중 ${Math.min(nF, Math.round(pd * nF + 0.4))}개`, c: 'ink', size: 14 }; }
        else if (st3 === 2) { l1 = { t: '이웃한 면의 점끼리 이어요', c: AMB, size: 16 }; l2 = { t: `선분 ${nE}개 중 ${Math.min(nE, Math.round(pe * nE + 0.4))}개`, c: 'ink', size: 14 }; }
        else { l1 = { t: pf > 0.99 ? `새 입체: ${X.name}` : '새 입체를 칠해요', c: AMB, size: 17 }; l2 = { t: `꼭짓점 ${X.cnt.V} · 면 ${X.cnt.F} · 모서리 ${X.cnt.E}`, c: GRN, size: 14 }; }
        banner(b, [l1, l2], C);
      }
      const V = S.V, vis = S.F.map((f) => D.facing(f.n));
      const eVis = S.E.map((e) => e.f.some((fi) => vis[fi]));
      const fadeA = 1 - 0.62 * pf;
      // ① 원래 입체의 뒤쪽 모서리(점선, 옅게)
      S.E.forEach((e, ei) => { if (!eVis[ei]) D.line(V[e.a], V[e.b], 'ink', dense ? 1.5 : 2, { dash: [6, 5], alpha: (dense ? 0.26 : 0.38) * fadeA }); });
      // ② 새 입체: 뒤쪽 선 → 앞쪽 면 칠 → 앞쪽 선
      const grow = (e, j) => {
        const g = pf > 0 ? 1 : ease(stg(pe, j, nE));
        return g <= 0 ? null : [T.V[e.a], lerp3(T.V[e.a], T.V[e.b], g)];
      };
      const tVis = T.F.map((f) => D.facing(f.n)), teVis = T.E.map((e) => e.f.some((fi) => tVis[fi]));
      T.E.forEach((e, j) => { if (!teVis[j]) { const sg = grow(e, j); if (sg) D.line(sg[0], sg[1], AMB, dense ? 1.8 : 2.4, { dash: [5, 5], alpha: 0.55 }); } });
      if (pf > 0) T.F.forEach((f, fi) => { if (tVis[fi]) D.fill(f.i.map((i) => T.V[i]), AMB, 0.4 * ease(pf)); });
      T.E.forEach((e, j) => { if (teVis[j]) { const sg = grow(e, j); if (sg) D.line(sg[0], sg[1], AMB, dense ? 3.4 : 4.4, { glow: false }); } });
      // ③ 가려진 면의 중심: 속이 빈 작은 점
      const dotP = (fi) => (C.problem ? 1 : ease(stg(pd, fi, nF)));
      X.centers.forEach((c, fi) => { if (!vis[fi]) { const p = dotP(fi); if (p > 0) b.point(D.P(c), { color: AMB, r: rH * (0.5 + 0.5 * p), hollow: true }); } });
      // ④ 원래 입체의 앞쪽 면(옅은 초록)과 앞쪽 모서리 — 새 입체가 안에 들어 있는 것처럼 보이도록 위에 겹침
      S.F.forEach((f, fi) => { if (vis[fi]) D.fill(f.i.map((i) => V[i]), 'green', 0.13 * (1 - 0.7 * pf)); });
      S.E.forEach((e, ei) => { if (eVis[ei]) D.line(V[e.a], V[e.b], 'ink', dense ? 2.4 : 3, { alpha: fadeA }); });
      // ⑤ 앞쪽 면의 중심: 또렷한 점
      X.centers.forEach((c, fi) => { if (vis[fi]) { const p = dotP(fi); if (p > 0) b.point(D.P(c), { color: AMB, r: rD * (0.4 + 0.6 * p) }); } });
      D.flush();
    },
    steps: (M) => {
      const Q = M.Q, I = PLAT[Q.k], X = dualOf(Q.k), N = X.name, nm = I.name;
      return [
        `${nm}${jo(nm, 'eun')} 면이 $${I.F}$개예요. 면 하나마다 한가운데에 점을 하나씩 찍으면 점이 $${I.F}$개 생기고, 이 점들이 새 입체의 꼭짓점이에요. (새 입체의 꼭짓점의 수) $=$ (원래 면의 수) $=${I.F}$예요.`,
        `이웃한 두 면의 점끼리 이으면, 두 면이 만나는 모서리 하나마다 선분이 하나씩 생겨요. 그래서 새 입체의 모서리는 원래와 같은 $${I.E}$개예요. 또 원래 꼭짓점 하나를 둘러싼 면 $${I.q}$개의 점이 새 입체의 면 하나를 이루므로 (새 입체의 면의 수) $=$ (원래 꼭짓점의 수) $=${I.V}$예요.`,
        `새 입체의 면은 모두 합동인 ${POLY_KO[X.side] || '정다각형'}이고, 각 꼭짓점에 모이는 면의 수도 $${X.deg}$개로 같아요. 그래서 새 입체도 정다면체예요. 꼭짓점이 $${X.cnt.V}$개인 정다면체는 ${N}뿐이므로 새 입체는 ${N}이에요.`
      ];
    },
    view: (M) => {
      const I = PLAT[M.k], X = dualOf(M.k), c = X.cnt, N = X.name;
      return {
        guide: `입체를 고르고 <b>▶</b>를 누르거나 <b>잇기</b> 막대를 밀어 보세요. ${span('amber', '노란 점')}이 각 면의 중심, ${span('amber', '노란 입체')}가 새 입체이고 옅은 초록 입체가 원래 입체예요. 끌어서 돌려 보면 새 입체가 안에 들어 있는 것이 보여요. 가려진 선은 점선이에요.`,
        readouts: [
          rd('원래 입체', I.name, GRN, `면 ${I.F} · 꼭짓점 ${I.V} · 모서리 ${I.E}`),
          rd('새 입체', N, AMB, `꼭짓점 ${c.V} · 면 ${c.F} · 모서리 ${c.E}`),
          rd('새 입체의 꼭짓점', `${c.V}개`, AMB, `= 원래 면의 수 ${I.F}`),
          rd('새 입체의 면', `${c.F}개`, AMB, `= 원래 꼭짓점의 수 ${I.V}`),
          rd('새 입체의 모서리', `${c.E}개`, AMB, `= 원래 모서리의 수 ${I.E}`),
          rd('면과 꼭짓점이 서로 바뀌어요', `${I.name}: 면 ${I.F} · 꼭짓점 ${I.V} · 모서리 ${I.E} → ${N}: 꼭짓점 ${c.V} · 면 ${c.F} · 모서리 ${c.E}`, 'ink', null, null, true)
        ],
        formula: '<p>(새 꼭짓점) = (원래 면) · (새 면) = (원래 꼭짓점) · (새 모서리) = (원래 모서리)</p>',
        rule: '정다면체의 각 면의 중심을 이웃한 것끼리 이으면 면과 꼭짓점의 수가 서로 바뀐 정다면체가 되고, 모서리의 수는 그대로이다',
        notes: notes('정사면체는 면과 꼭짓점이 모두 4개라서 새 입체도 정사면체예요(거꾸로 선 모양).', '정육면체와 정팔면체, 정십이면체와 정이십면체는 서로 짝이에요. 한쪽의 면의 중심을 이으면 다른 쪽이 돼요.')
      };
    },
    prob: (M) => {
      const Q = M.Q, I = PLAT[Q.k], X = dualOf(Q.k), key = `${Q.k}|${Q.ask}`, note = '초록 입체의 각 면 한가운데에 점이 찍혀 있어요. 점선은 가려진 선이에요.';
      if (Q.ask === 'shape') {
        return {
          tag: '면의 중심을 이은 입체', key, note,
          stem: `${I.name}의 각 면의 중심을 꼭짓점으로 하는 입체도형은?`,
          choices: mkText(PLAT_KEYS.map((j) => {
            const J = PLAT[j];
            return { h: J.name, ok: j === X.key, hint: `${J.name}${jo(J.name, 'eun')} 꼭짓점이 ${J.V}개예요. 새 입체의 꼭짓점은 원래 면의 수와 같은 ${I.F}개예요.${j === Q.k && j !== X.key ? ' 원래 입체와 같은 모양이 아니에요. 면과 꼭짓점의 수가 서로 바뀌어요.' : ''}` };
          }))
        };
      }
      const a = Q.ask, val = X.cnt[a];
      const tip = { V: '새 입체의 꼭짓점은 원래 면마다 하나씩 생겨요.', F: '새 입체의 면은 원래 꼭짓점마다 하나씩 생겨요.', E: '새 입체의 모서리는 이웃한 면 둘마다 하나씩, 원래 모서리와 같은 수만큼 생겨요.' }[a];
      const wr = ['V', 'F', 'E'].map((c2) => [I[c2], `원래 입체의 ${NM_VFE[c2]}의 수예요. ${tip}`]);
      return {
        tag: '면의 중심을 이은 입체', key, note,
        stem: `${I.name}의 각 면의 중심을 꼭짓점으로 하는 입체도형을 만들었다. 이 입체의 ${NM_VFE[a]}의 개수는?`,
        choices: mkChoices(val, wr)
      };
    }
  };
  G.dualOf = dualOf;

  function problemSteps(id, M, Q) {
    const q = M.Q;
    if (id === 'p4-1') return [
      '문제의 세 점 P, Q, R를 지나는 평면을 정육면체의 끝까지 넓혀요. 세 점을 이은 삼각형에서 멈추지 않아요.',
      '한 면 위에 있는 두 절단점을 선분으로 잇고, 다음 면에서도 절단선을 이어 닫힌 다각형을 만들어요.',
      `이 문제의 평면은 정육면체의 ${q.cnt}개 면을 지나며, 단면의 변이 ${q.cnt}개 생겨요.`,
      `따라서 단면은 ${NAME_N[q.cnt]}이에요. 세 점이 주어졌다고 단면이 항상 삼각형인 것은 아니에요.`
    ];
    if (id === 'p4-2') {
      const I = PLAT[q.k], c = cutCounts(I), nm = { F: '면', V: '꼭짓점', E: '모서리' };
      const first = `${I.name}는 면 ${I.F}개, 모서리 ${I.E}개, 꼭짓점 ${I.V}개예요. 모서리의 3분의 1만큼 잘라 가운데 남은 모서리와 새 단면을 구별해요.`;
      const why = { F: `원래 면 ${I.F}개가 남고, 원래 꼭짓점 ${I.V}개마다 새 면이 하나씩 생겨요.`, V: `원래 모서리 ${I.E}개마다 양 끝에서 잘려 새 꼭짓점이 2개씩 생겨요.`, E: `원래 모서리의 가운데 ${I.E}개가 남아요. 새 단면의 변은 잘린 꼭짓점에 모인 모서리 수의 합만큼, 원래 모서리마다 양 끝에 하나씩 모두 ${2 * I.E}개 생겨요.` };
      const calc = { F: `${I.F}+${I.V}=${c.F}`, V: `2\\times${I.E}=${c.V}`, E: `${I.E}+2\\times${I.E}=${c.E}` };
      return [first, why[q.ask], `따라서 구하는 ${nm[q.ask]}는 $${calc[q.ask]}$개예요.`];
    }
    const I = PLAT[q.k], X = dualOf(q.k), names = { F: '면', E: '모서리', V: '꼭짓점' };
    return [`${I.name}의 면마다 중심을 하나씩 잡아요. 새 입체의 꼭짓점은 원래 면의 개수인 ${I.F}개예요.`,
      `이웃한 두 면의 중심을 이으면 원래 모서리마다 새 모서리가 하나씩 생겨 ${I.E}개예요. 원래 꼭짓점마다 새 면이 생겨 면은 ${I.V}개예요.`,
      q.ask === 'shape' ? `따라서 ${X.name}가 만들어져요.` : `문제는 ${names[q.ask]}의 개수를 물었으므로 답은 ${X.cnt[q.ask]}개예요.`];
  }
  const scenes = CS ? [T1, T3, T2, T4] : [T1, T2, T4];
  scenes.forEach((D) => { if (!D.problemSteps) D.problemSteps = (M, Q) => problemSteps(D.id, M, Q); });
  G.register(40, 't4', '④ 도전: 단면과 꼭짓점 자르기', '도전', PARAMS, scenes);
})();
