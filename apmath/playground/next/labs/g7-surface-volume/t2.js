/* ==========================================================================
   중1 · 겉넓이와 부피 — 탭 ② 「뿔의 겉넓이와 부피」 (t2.js, order 20) — 장면 5개
   · sv2-1 뿔 = 기둥의 1/3 (정육면체를 사각뿔 3개로 · 원뿔 물 붓기 3번) · sv2-2 원뿔의 옆넓이 πRr(전개도 부채꼴)
   · sv2-3 원뿔 종합(r·h·R) · sv2-4 원뿔대(큰 뿔 − 작은 뿔, 작은 뿔이 가로로 빠짐) · sv2-5 각뿔대(전개도 사다리꼴)
   √ 없이: 모선·높이·반지름은 (3,4,5)·(5,12,13) 같은 세 수가 함께 주어집니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SV;
  if (!G) return;
  const { cube8, PI, DEG, clamp, ease, seg01, lin01, v3, add3, sub3, mul3, lerp3, mid3, dot3, unit3, len3, V, vadd, vsub, vmul, vnum, tx, plainVal, mkV, P, fmtN, pick, rint, notes, rd, span, scene3, solidNet, circleBase, netScene, roleStyle, layoutTiles, drawTiles, polyMesh, revolveMesh, shiftT, centroid } = G;

  const TRI = { A: [3, 4, 5], B: [4, 3, 5], C: [5, 12, 13], D: [8, 15, 17], E: [12, 5, 13], F: [15, 8, 17] }; // [r, h, R]
  const KMAX3 = { A: 5, B: 3, C: 2, D: 1, E: 1, F: 1 }; // sv2-3: 세 길이를 k배 할 수 있는 최대(반지름 12·높이 20 안팎)
  const TRI_LABEL = { A: '반지름 3 · 높이 4 · 모선 5', B: '반지름 4 · 높이 3 · 모선 5', C: '반지름 5 · 높이 12 · 모선 13', D: '반지름 8 · 높이 15 · 모선 17', E: '반지름 12 · 높이 5 · 모선 13', F: '반지름 15 · 높이 8 · 모선 17' };
  const TRI_ORDER = ['A', 'B', 'C'];
  const TRI_ORDER3 = ['A', 'B', 'C', 'D', 'E', 'F'];
  const PARAMS = {
    s2A: P('정육면체의 한 모서리', 2, 15, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    s2R: P('밑면의 반지름', 1, 15, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s2H: P('높이', 2, 20, 1, 6, { color: 'sky', format: (v) => v + ' cm' }),
    s2T: P('움직여 보기', 0, 1, 0.01, 0, { color: 'green', format: (v, s) => ((s && s.svMode2 === 'pour') ? (v < 0.02 ? '비어 있음' : v > 0.98 ? '3번 부음' : `${Math.min(3, Math.floor(v * 3 + 0.001) + (v * 3 % 1 > 0.0 ? 1 : 0))}번째 붓는 중`) : (v < 0.02 ? '합쳐진 정육면체' : v > 0.98 ? '모두 갈라 놓음' : Math.round(v * 100) + '%')) }),
    // sv2-2
    s2r: P('밑면의 반지름', 2, 15, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s2G: P('모선의 길이', 3, 17, 1, 5, { color: 'sky', hint: '모선의 길이는 반지름보다 길어야 해요(짧으면 반지름+1로 맞춰요)', format: (v) => v + ' cm', clampTo: (s) => [Math.round(s.s2r) + 1, 17] }),
    s2U: P('펼치기', 0, 1, 0.01, 0, { color: 'green', format: (v) => (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%') }),
    // sv2-3
    s3K: P('크기 배율', 1, 5, 1, 1, { color: 'amber', hint: '반지름·높이·모선을 모두 몇 배 할지 정해요(모양마다 고를 수 있는 배수가 달라요)', format: (v) => `${v}배`, clampTo: (s) => [1, KMAX3[oneOf(s.svTri, TRI_ORDER3, 'A')]] }),
    s3U: P('펼치기', 0, 1, 0.01, 0, { color: 'green', format: (v) => (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%') }),
    // sv2-4
    s4K: P('아랫면의 반지름', 2, 5, 1, 2, { color: 'sky', hint: '선택한 비율에 따라 높이와 모선도 함께 바뀌어요.', format: (v, s) => `${v * (TRI[s?.svTri4] || TRI.A)[0]} cm` }),
    s4J: P('윗면의 반지름', 1, 4, 1, 1, { color: 'amber', hint: '윗면의 반지름은 아랫면보다 작아요.', format: (v, s) => `${v * (TRI[s?.svTri4] || TRI.A)[0]} cm`, clampTo: (s) => [1, Math.round(s.s4K) - 1] }),
    s4T: P('움직여 보기', 0, 1, 0.01, 0, { color: 'green', hint: '겉넓이는 펼치기, 부피는 작은 원뿔 빼내기예요', format: (v, s) => ((s && s.svMode === 'vol') ? (v < 0.02 ? '붙어 있음' : v > 0.98 ? '빠짐' : Math.round(v * 100) + '%') : (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%')) }),
    // sv2-5: 밑면의 실제 길이를 1 cm 단위로 조절합니다.
    // 이전 공유 링크의 배수 값은 별도로 보존하고 실제 길이 값을 새 키에 저장합니다.
    s5K: P('이전 큰 각뿔 배수', 2, 4, 1, 3),
    s5J: P('이전 작은 각뿔 배수', 1, 3, 1, 1),
    s5A: P('아랫면의 한 변', 4, 24, 1, 9, { color: 'sky', format: (v) => `${v} cm` }),
    s5B: P('윗면의 한 변', 1, 23, 1, 3, { color: 'amber', hint: '윗면은 아랫면보다 작아요.', format: (v) => `${v} cm`, clampTo: (s) => [1, Math.round(s.s5A) - 1] }),
    s5T: P('움직여 보기', 0, 1, 0.01, 0, { color: 'green', hint: '겉넓이는 펼치고, 각뿔대의 부피는 작은 각뿔을 빼서 살펴봐요', format: (v, s) => ((s && s.svMode === 'vol') ? (v < 0.02 ? '붙어 있음' : v > 0.98 ? '빠짐' : Math.round(v * 100) + '%') : (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%')) })
  };
  const oneOf = (v, list, d) => (list.includes(v) ? v : d);

  /* ================================================================ sv2-1 뿔 = 기둥의 1/3 */
  function sv21() {
    const model = (s) => {
      const mode = s.svMode2 === 'pour' ? 'pour' : 'cube';
      const a = clamp(Math.round(s.s2A), 2, 15), r = clamp(Math.round(s.s2R), 1, 15), h = clamp(Math.round(s.s2H), 2, 20);
      if (mode === 'cube') {
        const cubeV = V(a * a * a), pyr = V((a * a * a) / 3);
        return { mode, a, cubeV, pyr, ans: pyr, big: cubeV, S: V(a * a), hh: a };
      }
      const cyl = V(0, r * r * h), cone = V(0, (r * r * h) / 3);
      return { mode, r, h, cyl, cone, ans: cone, big: cyl, S: V(0, r * r), hh: h };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, t = C.problem ? 1 : C.t;
      if (M.mode === 'cube') {
        const hf = 1.6, V0 = v3(hf, hf, hf), dd = ease(lin01(t, 0, 0.5)) * hf * 3.7, rotE = ease(lin01(t, 0.5, 1));
        const faces = [
          { name: 'L', col: 'sky', pts: [v3(-hf, -hf, -hf), v3(-hf, hf, -hf), v3(-hf, hf, hf), v3(-hf, -hf, hf)], off: 2 * dd, ax: v3(0, 0, 1), ang: (PI / 2) * rotE },
          { name: 'B', col: 'green', pts: [v3(-hf, -hf, -hf), v3(hf, -hf, -hf), v3(hf, -hf, hf), v3(-hf, -hf, hf)], off: 0, ax: v3(0, 1, 0), ang: 0 },
          { name: 'K', col: 'violet', pts: [v3(-hf, -hf, -hf), v3(hf, -hf, -hf), v3(hf, hf, -hf), v3(-hf, hf, -hf)], off: dd, ax: v3(1, 0, 0), ang: -(PI / 2) * rotE }
        ];
        // 가로(왼쪽 → 오른쪽)로만 옮기고, 밑면이 아래로 가도록 제자리에서 돌려 세웁니다
        const bodies = faces.map((f) => {
          const polys = [{ pts: f.pts, tag: 'base' }];
          for (let i = 0; i < 4; i++) polys.push({ pts: [f.pts[i], f.pts[(i + 1) % 4], V0], tag: 'side' });
          const cen = centroid(f.pts.concat([V0])), T = G.compose(shiftT(D.hx(f.off)), G.rotAbout(cen, f.ax, f.ang));
          const mesh = G.xfMesh(polyMesh(polys, cen), T);
          return { mesh, fill: f.col, alpha: st === 3 && f.name === 'B' && C.review ? 0.42 : 0.24, edge: 'ink', edgeW: 2.2, f, T, cen };
        });
        const origin = D.hx(-hf * 3.4);
        const original = G.xfMesh(G.boxMesh(-hf, hf, -hf, hf, -hf, hf), shiftT(origin));
        const pts = cube8(origin, hf);
        bodies.forEach((bd) => cube8(G.applyT(bd.T, bd.cen), hf * 0.9).forEach((p) => pts.push(p)));
        D.fit(pts, [], { l: 30, r: (C.tab === 'explore' && !b.thumb && window.innerWidth >= 700 && b.W >= 560 ? 255 : 30), t: 24, b: 45 });
        D.body({ mesh: original, fill: 'sky', alpha: 0.025, edge: 'ink', edgeW: 2 });
        if (!b.thumb) { const bb = G.bboxOf(original.faces.flatMap(f => f.pts.map(D.P))); b.text({x:(bb.x0+bb.x1)/2,y:bb.y0}, '원래 입체', {dy:-14,size:D.fs(13),color:'ink',weight:700}); }
        const cornersAll = [];
        for (const x of [-hf, hf]) for (const y of [-hf, hf]) for (const z of [-hf, hf]) cornersAll.push(v3(x, y, z));
        if (t < 0.5) {
          const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
          E.forEach(([i, j]) => D.line(cornersAll[i], cornersAll[j], 'muted', 1.6, { dash: [5, 4], alpha: 0.55 * (1 - ease(t * 2)) }));
        }
        D.bodies(bodies);
        bodies.forEach((bd) => D.dot(G.applyT(bd.T, V0), 'ink', 3));
        if (t < 0.02) D.label(V0, '꼭짓점', { dir: { x: 1, y: -0.4 }, color: 'ink', size: 14, gap: 6 });
        D.dim(add3(origin, v3(-hf, -hf, hf)), add3(origin, v3(hf, -hf, hf)), `모서리 ${M.a}`, { side: { x: 0, y: 1 }, off: 22, color: 'ink' });
        return;
      }
      // 원뿔 3번 붓기
      const u = 2.2 / Math.max(M.r, M.h * 0.5), ru = M.r * u, hu = M.h * u, gap = ru * 0.8;
      const xc = -(ru + gap / 2), xy = ru + gap / 2;
      const q = t * 3, k = Math.min(3, Math.floor(q + 1e-9)), fracq = q - Math.floor(q + 1e-9), nPour = t >= 0.999 ? 3 : k + (fracq > 0.001 ? 1 : 0);
      const coneFill = t >= 0.999 ? 0 : t <= 0.001 ? 1 : 1 - fracq;
      const water = t * hu;
      const coneM = revolveMesh([[0, 0], [ru, 0], [0, hu]], { O: v3(xc, 0, 0), N: 36, tags: ['bot', 'side'] });
      const cylM = revolveMesh([[0, 0], [ru, 0], [ru, hu], [0, hu]], { O: v3(xy, 0, 0), N: 36, tags: ['bot', 'side', 'top'] });
      const pts = C.problem ? coneM.faces.flatMap((face) => face.pts) : [v3(xc - ru, 0, -ru), v3(xy + ru, hu, ru), v3(xc - ru, hu, ru), v3(xy + ru, 0, -ru)];
      const bb = G.bboxOf(pts.map(D.P));
      D.fit(pts, C.problem ? [] : [{ x: bb.x0, y: bb.y1 + 2.7 }], C.problem ? { l: b.W < 500 ? 25 : 70, r: b.W < 500 ? 25 : 70, t: b.W < 500 ? 25 : 95, b: b.W < 500 ? 25 : 95 } : { l: 30, r: (C.tab === 'explore' && !b.thumb && window.innerWidth >= 700 && b.W >= 560 ? 255 : 30), t: 40, b: 44 });
      if (!C.problem) D.body({ mesh: cylM, fill: 'sky', alpha: 0.1, edge: 'ink', edgeW: 2.4 });
      if (!C.problem && water > 0.01) D.body({ mesh: revolveMesh([[0, 0], [ru * 0.98, 0], [ru * 0.98, water], [0, water]], { O: v3(xy, 0, 0), N: 36 }), fill: 'sky', alpha: 0.07, edge: 'ink', edgeW: 1.5, hidden: false });
      D.body({ mesh: coneM, fill: 'amber', alpha: 0.1, edge: 'ink', edgeW: 2.4 });
      if (coneFill > 0.01) D.body({ mesh: coneM, fill: 'sky', alpha: 0.07 * coneFill, edge: 'ink', edgeW: 1.4, hidden: false, edgeFn: () => ({ alpha: coneFill }) });
      const rf = D.rightFront(35);
      D.height(v3(xc, 0, 0), v3(xc, hu, 0), b.W < 500 ? '' : `높이 ${M.h}`, { side: { x: -1, y: 0 }, alongFrac: -0.2, color: 'ink' });
      if (b.W < 500) D.label(v3(xc, hu * .5, 0), `높이 ${M.h}`, { dir: { x: -1, y: 0 }, gap: 12, color: 'ink', size: 13 });
      D.radius(v3(xc, 0, 0), add3(v3(xc, 0, 0), mul3(rf, ru)), b.W < 500 && !C.problem ? '' : `반지름 ${M.r}`, { dash: true, color: 'ink' });
      if (!C.problem) D.radius(v3(xy, hu, 0), add3(v3(xy, hu, 0), mul3(rf, ru)), `반지름 ${M.r}`, { color: 'ink' });
      if (!C.problem) {
        // 가로 막대: 부은 횟수
        const y0 = bb.y1 + 2.0, wTot = (xy + ru - (xc - ru)) * 0.8, x0 = (xc - ru + xy + ru) / 2 - wTot / 2;
        for (let i = 0; i < 3; i++) {
          const seg = clamp(q - i, 0, 1);
          b.path([{ x: x0 + (wTot * i) / 3, y: y0 }, { x: x0 + (wTot * (i + 1)) / 3, y: y0 }, { x: x0 + (wTot * (i + 1)) / 3, y: y0 + 0.5 }, { x: x0 + (wTot * i) / 3, y: y0 + 0.5 }], { close: true, color: 'muted', width: 1.6, alpha: 0.6 });
          if (seg > 0) b.path([{ x: x0 + (wTot * i) / 3, y: y0 }, { x: x0 + (wTot * (i + seg)) / 3, y: y0 }, { x: x0 + (wTot * (i + seg)) / 3, y: y0 + 0.5 }, { x: x0 + (wTot * i) / 3, y: y0 + 0.5 }], { close: true, fill: 'sky', fillAlpha: 0.18, color: null });
          b.text({ x: x0 + (wTot * (i + 0.5)) / 3, y: y0 + 0.25 }, `${i + 1}통`, { size: D.fs(14), color: 'ink', weight: 800 });
        }
        b.text({ x: x0 + wTot / 2, y: y0 }, `원뿔 ${nPour}번 붓기`, { dy: -14, size: D.fs(15), color: 'ink', weight: 800 });
      }
    };
    return {
      id: 'sv2-1', title: '뿔은 기둥의 1/3', short: '뿔 = 기둥의 ⅓',
      question: '밑면과 높이가 같은 뿔과 기둥이 있어. 뿔 몇 개가 모이면 기둥 하나와 부피가 같아질까?',
      anim: { key: 's2T', dur: 3.5, label: '움직여 보기' }, cam0: { yaw: 28, pitch: 22 }, stepT: () => 1, thumbT: 0.8, problemT: 1,
      ctl: (s) => (s.svMode2 === 'pour' ? ['s2R', 's2H', 's2T'] : ['s2A', 's2T']),
      presets: () => [{ group: '실험', label: '정육면체 → 사각뿔 3개', apply: (st, lab) => { st.svMode2 = 'cube'; st.s2T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svMode2 !== 'pour' }, { label: '원뿔로 물 3번 붓기', apply: (st, lab) => { st.svMode2 = 'pour'; st.s2T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svMode2 === 'pour' }],
      init: (s) => { s.svMode2 = 'cube'; s.s2A = 4; s.s2R = 3; s.s2H = 6; s.s2T = 0; },
      reroll: (s) => { s.svMode2 = pick(['cube', 'pour'], s.svMode2); s.s2A = rint(2, 8); s.s2R = rint(1, 6); s.s2H = pick([3, 6, 9], -1); s.s2T = 0; },
      model, draw,
      check: (s) => {
        const M = model(s);
        if (M.mode === 'cube') { // 공통 꼭짓점 (a,a,a) 에서 x=0 면까지 얇게 썰어(단면은 한 변이 a−x 인 정사각형) 부피를 더합니다
          let sum = 0; const n = 4000;
          for (let i = 0; i < n; i++) { const x = ((i + 0.5) / n) * M.a, side = M.a - x; sum += side * side * (M.a / n); }
          return { ans: sum, model: vnum(M.ans) };
        }
        let sum = 0; const n = 4000;
        for (let i = 0; i < n; i++) { const y = ((i + 0.5) / n) * M.h, rr = (M.r * y) / M.h; sum += PI * rr * rr * (M.h / n); }
        return { ans: sum, model: vnum(M.ans) };
      },
      steps: (M) => M.mode === 'cube' ? [
        `한 모서리가 $${M.a}$인 정육면체의 부피는 $${M.a}^3=${M.a ** 3}\\,\\mathrm{cm}^3$예요.`,
        `정육면체는 한 꼭짓점에서 마주 보는 세 면을 밑면으로 하는 합동인 사각뿔 3개로 나뉘어요. 그래서 사각뿔 하나는 정육면체의 $\\frac{1}{3}$이에요.`,
        `사각뿔의 부피 $=\\frac{1}{3}\\times${M.a}^3=${tx(M.pyr)}\\,\\mathrm{cm}^3$. 밑넓이 $${M.a}^2$, 높이 $${M.a}$이므로 (부피) $=\\frac{1}{3}\\times$ (밑넓이) $\\times$ (높이)예요.`
      ] : [
        `원기둥의 부피는 $\\pi\\times${M.r}^2\\times${M.h}=${tx(M.cyl)}\\,\\mathrm{cm}^3$예요.`,
        `밑면과 높이가 같은 원뿔에 물을 가득 담아 원기둥에 부으면 3번에 가득 차요. 원뿔 3개 = 원기둥 1개예요.`,
        `원뿔의 부피 $=\\frac{1}{3}\\times${tx(M.cyl)}=${tx(M.cone)}\\,\\mathrm{cm}^3$, 즉 (부피) $=\\frac{1}{3}\\times$ (밑넓이) $\\times$ (높이)예요.`
      ],
      view: (M, C) => ({
        guide: M.mode === 'cube'
          ? `<b>움직여 보기</b> 왼쪽의 원래 정육면체와 비교하며, 막대를 끌어 정육면체를 ${span('sky', '합동인 사각뿔 3개')}로 갈라 보세요. 뿔이 오른쪽으로 옮겨지고 밑면이 아래로 오도록 제자리에서 돌아 서요. 세 뿔은 한 꼭짓점을 함께 써요. 칩에서 <b>물 붓기</b>로도 확인해 볼 수 있어요.`
          : `<b>움직여 보기</b> 막대를 끌어 원뿔의 물이 서서히 줄면서(사라지면서) 원기둥에 채워져요. 3번 부으면 가득 차요. 칩에서 <b>정육면체</b> 실험으로도 확인해 볼 수 있어요.`,
        card: C.tab === 'explore' && window.innerWidth >= 700 ? { title: '뿔의 부피', lines: M.mode === 'cube' ? [
          { text: '정육면체의 부피' }, { text: `$${M.a}^3=${tx(M.cubeV)}$` },
          { text: '사각뿔 하나의 부피' }, { text: `$\\frac{1}{3}\\times${tx(M.cubeV)}=${tx(M.pyr)}$` }
        ] : [
          { text: '원기둥의 부피' }, { text: `$\\pi\\times${M.r}^2\\times${M.h}=${tx(M.cyl)}$` },
          { text: '원뿔의 부피' }, { text: `$\\frac{1}{3}\\times${tx(M.cyl)}=${tx(M.cone)}$` }
        ] } : null,
        readouts: C.tab === 'explore' && window.innerWidth >= 700 ? [] : M.mode === 'cube'
          ? [rd('정육면체의 부피', plainVal(M.cubeV) + ' cm³', 'sky', `${M.a} × ${M.a} × ${M.a}`), rd('사각뿔 하나', plainVal(M.pyr) + ' cm³', 'amber', '⅓ × 정육면체'), rd('뿔 3개의 합', plainVal(vmul(M.pyr, 3)) + ' cm³', 'green')]
          : [rd('원기둥의 부피', plainVal(M.cyl) + ' cm³', 'sky', `π × ${M.r} × ${M.r} × ${M.h}`), rd('원뿔의 부피', plainVal(M.cone) + ' cm³', 'amber', '⅓ × 원기둥'), rd('원뿔 3개의 합', plainVal(vmul(M.cone, 3)) + ' cm³', 'green')],
        formula: `<p>(뿔의 부피) $=\\frac{1}{3}\\times$ (밑넓이) $\\times$ (높이)</p>`,
        rule: '밑면과 높이가 같으면: 뿔의 부피 = 기둥의 부피의 ⅓',
        notes: notes('뿔의 부피는 기둥의 부피에 <b>$\\frac{1}{3}$</b>을 곱해요. 높이는 모선이 아니라 꼭짓점에서 밑면까지의 수직 거리예요.', '밑면과 높이가 같을 때만 뿔 3개가 기둥 1개예요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        if (M.mode === 'cube') {
          wrongs = [[M.cubeV, '정육면체 전체의 부피예요. 사각뿔은 그것의 $\\frac{1}{3}$이에요.'], [vmul(M.cubeV, 1 / 2), '$\\frac{1}{2}$이 아니라 $\\frac{1}{3}$이에요.'], [vmul(M.cubeV, 1 / 6), '$\\frac{1}{3}$을 한 번 더 곱했어요.'], [vmul(M.cubeV, 3), '3개를 합친 값이 아니라 하나의 부피예요.'], [vmul(M.cubeV, 2 / 3), '뿔 2개의 부피예요.']];
          stem = `그림은 한 모서리의 길이가 $${M.a}\\,\\mathrm{cm}$인 정육면체를 합동인 사각뿔 3개로 나눈 것이다. 사각뿔 하나의 부피는?`;
        } else {
          wrongs = [[M.cyl, '원기둥의 부피예요. 원뿔은 그것의 $\\frac{1}{3}$이에요.'], [vmul(M.cyl, 1 / 2), '$\\frac{1}{2}$이 아니라 $\\frac{1}{3}$이에요.'], [vmul(M.cyl, 2 / 3), '원뿔 2개의 부피예요.'], [V(0, M.r * M.h / 3), '밑넓이는 $\\pi r^2$이에요. $r$을 한 번만 곱했어요.'], [vmul(M.cyl, 3), '원뿔이 원기둥보다 커질 수는 없어요.']];
          stem = `그림과 같이 밑면의 반지름이 $${M.r}\\,\\mathrm{cm}$, 높이가 $${M.h}\\,\\mathrm{cm}$인 원뿔의 부피는?`;
        }
        return { tag: '뿔의 부피', key: `${M.mode}|${M.a}|${M.r}|${M.h}`, stem, choices: mkV(M.ans, wrongs, { dim: 3 }) };
      }
    };
  }

  /* ================================================================ sv2-2 원뿔의 옆넓이 πRr (전개도) */
  function coneModel(r, R) {
    R = Math.max(R, r + 1);
    const S = V(0, r * r), arc = V(0, 2 * r), lat = V(0, r * R), tot = vadd(S, lat);
    return { r, R, h: Math.sqrt(R * R - r * r), S, arc, lat, tot };
  }
    const drawConeComparison = (b,s,M,C) => {
      const e=ease(C.t), N=36, sn=solidNet(circleBase(M.r,N),M.h,0,Array(N).fill(true),18), src=scene3(b,s,C);
      const frame=u=>{
        const cam=G.camOf((s.svYaw==null?28:s.svYaw)*(1-u),(s.svPitch==null?20:s.svPitch)*(1-u));
        const pose=G.netPose(sn.net,u), pts=[];
        sn.net.pieces.forEach((pc,k)=>pc.pts.forEach(p=>pts.push(G.proj(cam,G.applyT(pose[k],p)))));
        const box=G.bboxOf(pts);return {pose,box,cx:(box.x0+box.x1)/2,cy:(box.y0+box.y1)/2};
      };
      const frames=Array.from({length:9},(_,i)=>frame(i/8));
      const maxW=Math.max(...frames.map(f=>f.box.x1-f.box.x0)), maxH=Math.max(...frames.map(f=>f.box.y1-f.box.y0));
      const O=src.hx(-maxW/2-M.r-2), body=revolveMesh([[0,0],[M.r,0],[0,M.h]],{O,N:48,tags:['bot','side']});
      const bb=G.bboxOf(body.faces.flatMap(f=>f.pts.map(src.P))), sy=-(bb.y0+bb.y1)/2, pair=b.W>=600;
      src.fit([],[{x:(pair?Math.min(-maxW/2,bb.x0):-maxW/2)-1,y:(pair?Math.min(-maxH/2,bb.y0+sy):-maxH/2)-1},{x:maxW/2+1,y:(pair?Math.max(maxH/2,bb.y1+sy):maxH/2)+1}],{l:15,r:(!b.thumb&&window.innerWidth>=700&&b.W>=560?230:15),t:(b.W<900?18:45),b:(b.W<900?18:45)});
      const sp=src.P;src.P=p=>{const q=sp(p);return{x:q.x,y:q.y+sy};};
      if(pair){
        src.body({mesh:body,fill:'sky',alpha:.035,edge:'ink',edgeW:2,dashBack:edge=>edge.chain&&Math.abs(edge.a.y)<1e-6?O:null});
        b.text({x:(bb.x0+bb.x1)/2,y:bb.y1+sy+.6},'원래 입체',{dy:12,size:src.fs(13),color:'ink',weight:700});
      }
      const f=frame(e), nd=scene3(b,s,C,{yaw:(s.svYaw==null?28:s.svYaw)*(1-e),pitch:(s.svPitch==null?20:s.svPitch)*(1-e)}), np=nd.P;
      nd.P=p=>{const q=np(p);return{x:q.x-f.cx,y:q.y-f.cy};};
      G.netDraw(nd,sn.net,f.pose,pc=>({fill:'sky',alpha:.025+.045*e,edge:'ink',ew:2}));
      if(e>.99){
        // 부채꼴 양쪽 모선은 펼친 뒤에도 바깥 경계로 남습니다.
        const edges=new Map(), key=p=>`${Math.round(p.x*1e4)},${Math.round(p.y*1e4)}`;
        sn.lat.forEach(k=>{const pts=sn.net.pieces[k].pts.map(p=>nd.P(G.applyT(f.pose[k],p)));for(let j=0;j<pts.length;j++){const p=pts[j],q=pts[(j+1)%pts.length],ka=key(p),kb=key(q),id=ka<kb?ka+'|'+kb:kb+'|'+ka,old=edges.get(id);if(old)old.n++;else edges.set(id,{p,q,n:1});}});
        edges.forEach(v=>{if(v.n===1)b.path([v.p,v.q],{color:'ink',width:2});});
        const bot=sn.net.pieces[sn.bot], bc=nd.P(G.applyT(f.pose[sn.bot],G.centroid(bot.pts)));
        const rim=bot.pts.map(p=>nd.P(G.applyT(f.pose[sn.bot],p))).reduce((a,p)=>p.x>a.x?p:a);
        b.path([bc,rim],{color:'ink',width:1.4});
        b.text({x:(bc.x+rim.x)/2,y:bc.y-.25},String(M.r),{size:nd.fs(12),color:'ink',weight:700});
        b.text(bc,'밑면',{dy:15,size:nd.fs(12),color:'ink',weight:700});
        const mid=sn.lat[Math.floor(sn.lat.length/2)], face=sn.net.pieces[mid], fc=nd.P(G.applyT(f.pose[mid],G.centroid(face.pts)));
        b.text(fc,'옆면',{size:nd.fs(13),color:'ink',weight:700});
        const k=sn.lat[0], ap=nd.P(G.applyT(f.pose[k],sn.B[0])), edge=nd.P(G.applyT(f.pose[k],sn.A[0]));
        b.text({x:(ap.x+edge.x)/2,y:(ap.y+edge.y)/2},`모선 ${M.R}`,{dy:-12,size:nd.fs(12),color:'ink',weight:700});
      }
      if(pair&&-maxW/2-bb.x1>0.3)src.arrow({x:bb.x1+.2,y:0},{x:-maxW/2-.2,y:0},'muted',1.5);
    };

  function sv22() {
    const model = (s) => { const r = clamp(Math.round(s.s2r), 2, 15), R = Math.max(clamp(Math.round(s.s2G), 3, 17), r + 1); s.s2r = r; s.s2G = R; return coneModel(r, R); };
    const draw = (b, s, M, C) => {
      if (C.tab === 'explore' && !b.thumb && C.t > 0) { drawConeComparison(b, s, M, C); return; }
      const { r, R, h } = M, sc = 4.6 / Math.max(R, 2 * r), ru = r * sc, hu = h * sc, st = C.step;
      const sn = solidNet(circleBase(ru, 36), hu, 0, Array(36).fill(true), 18);
      const lvB = !C.review ? 1 : st === 1 ? 2 : 3, lvL = !C.review ? 1 : st === 1 ? 0 : st === 2 ? 2 : 3;
      const t = C.problem ? 0 : C.t, eNow = G.ease(t), glue = eNow > 0.3 && !C.problem && !b.thumb;
      const hInt = Math.abs(h - Math.round(h)) < 1e-9; // 높이가 √ 꼴이면 숫자는 쓰지 않고 이름만
      netScene(b, s, C, {
        sn, t, fitOpt: { l: 40, r: (!b.thumb && window.innerWidth >= 700 && b.W >= 560 ? 245 : 40), t: 44, b: 56 },
        // 부채꼴의 호 ↔ 밑면의 둘레(둘레가 같다)는 같은 색
        style: (pc) => Object.assign(roleStyle(pc.tag === 'lat' ? 'lat' : 'base', pc.tag === 'lat' ? lvL : lvB), {
          edgeStyle: (e, p) => (glue && ((p.tag === 'lat' && e.i === 0) || p.tag === 'bot') ? { color: 'ink', width: 2 } : null)
        }),
        labels: (ctx) => {
          if (b.thumb) return;
          const { D, tp, e } = ctx, A = sn.A, apex = sn.B[0], L = sn.lat, at = ctx.at, kb = sn.bot;
          const solidA = 1 - G.lin01(e, 0.05, 0.45), flatA = G.lin01(e, 0.78, 0.98);
          const c0 = at(kb, centroid(A)), cs3 = centroid(L.map((idx) => at(idx, centroid(sn.net.pieces[idx].pts))));
          // 반지름: 밑면 중심에서 오른쪽 앞으로(밑면이 가려지면 점선)
          D.radius(c0, D.rimPick(c0, A.map((p) => at(kb, p))), `반지름 ${r}`, { dash: !tp[kb].front });
          // 입체: 왼쪽 윤곽선의 모선 + 높이(점선·직각 표시)
          if (solidA > 0.02) {
            const ap = D.px(at(L[0], apex));
            let best = 0, ba = -9;
            A.forEach((p, k) => { const q = D.px(at(L[k], p)), ang = Math.atan2(q.y - ap.y, q.x - ap.x); if (ang > ba) { ba = ang; best = k; } });
            D.edgeLab(at(L[best], apex), at(L[best], A[best]), `모선 ${R}`, { from: c0, alpha: solidA });
            if (!C.problem) D.height(c0, at(L[0], apex), hInt ? `높이 ${Math.round(h)}` : '높이', { alpha: solidA, side: { x: 1, y: 0 }, color: 'ink' });
          }
          // 전개도: 부채꼴의 반지름 = 모선, 호의 길이 = 밑면의 둘레, 넓이 이름표
          if (flatA > 0.02) {
            if (C.review && flatA > 0.95) {
              D.line(at(L[0], apex), at(L[0], A[1]), 'ink', 2);
              D.line(at(L[1], apex), at(L[1], A[1]), 'ink', 2);
            }
            D.edgeLab(at(L[1], apex), at(L[1], A[1]), `모선 ${R}`, { from: cs3, alpha: flatA });
            if (!C.problem) {
              D.edgeLab(at(L[9], A[9]), at(L[9], A[10]), `호의 길이 ${plainVal(M.arc)}`, { from: c0, color: 'ink', alpha: flatA });
              let k2 = 0, bs = -2;
              const dir = { x: Math.cos(1.0), y: Math.sin(1.0) }, cp = D.px(c0);
              A.forEach((p, k) => { const q = D.px(at(kb, p)), l = Math.hypot(q.x - cp.x, q.y - cp.y) || 1, sc2 = ((q.x - cp.x) * dir.x + (q.y - cp.y) * dir.y) / l; if (sc2 > bs) { bs = sc2; k2 = k; } });
              D.edgeLab(at(kb, A[k2]), at(kb, A[(k2 + 1) % A.length]), `밑면의 둘레 ${plainVal(M.arc)}`, { from: c0, color: 'ink', alpha: flatA });
              const rr = Math.hypot(D.px(at(kb, A[0])).x - cp.x, D.px(at(kb, A[0])).y - cp.y);
              if (!C.review) D.areaLab(c0, '밑넓이', plainVal(M.S), { dx: -0.4 * rr, dy: -0.04 * rr, maxW: rr * 1.05, alpha: flatA });
              const ra = at(L[18], apex), rb = G.mid3(at(L[18], A[18]), at(L[18], A[19]));
              D.areaLab(G.lerp3(ra, rb, 0.3), '옆넓이', plainVal(M.lat), { alpha: flatA });
            }
          }
        }
      });
    };
    return {
      id: 'sv2-2', title: '원뿔의 옆넓이 πrl', short: '원뿔 옆넓이',
      question: '원뿔의 옆면을 펼치면 어떤 모양이 될까? 그 모양의 반지름과 호의 길이는 원뿔의 어디와 같을까?',
      anim: { key: 's2U', dur: 2.5, label: '펼쳐 보기' }, cam0: { yaw: 28, pitch: 22 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['s2r', 's2G', 's2U'],
      init: (s) => { s.s2r = 3; s.s2G = 5; s.s2U = 0; },
      reroll: (s) => { s.s2r = rint(2, 6); s.s2G = rint(s.s2r + 1, Math.min(12, s.s2r * 3)); s.s2U = 0; },
      model, draw,
      check: (s) => { const M = model(s); let a = 0; const N = 4000, th = (2 * PI * M.r) / M.R; for (let i = 0; i < N; i++) a += 0.5 * M.R * M.R * (th / N); return { ans: PI * M.r * M.r + a, model: vnum(M.tot) }; },
      steps: (M) => [
        `밑면은 반지름 $${M.r}$인 원이에요. 밑넓이 $=\\pi\\times${M.r}^2=${tx(M.S)}\\,\\mathrm{cm}^2$예요.`,
        `옆면을 펼치면 반지름이 모선의 길이 $${M.R}$이고 호의 길이가 밑면의 둘레 $2\\times\\pi\\times${M.r}=${tx(M.arc)}$인 부채꼴이에요. 넓이 $=\\frac{1}{2}\\times(\\text{반지름})\\times(\\text{호의 길이})=\\frac{1}{2}\\times${M.R}\\times${tx(M.arc)}=${tx(M.lat)}\\,\\mathrm{cm}^2$ ($=\\pi\\times${M.r}\\times${M.R}=\\pi rl$)예요.`,
        `(겉넓이) $=$ (밑넓이) $+$ (옆넓이) $=${tx(M.S)}+${tx(M.lat)}=${tx(M.tot)}\\,\\mathrm{cm}^2$ ($=\\pi r^2+\\pi rl$)예요.`
      ],
      view: (M, C) => ({
        guide: `<b>펼치기</b> 막대를 끌거나 ▶를 눌러 원뿔을 펼쳐 보세요. ${span('green', '옆면')}은 부채꼴이에요. <b>반지름</b>과 <b>모선의 길이</b>를 바꾸면 부채꼴의 모양이 어떻게 달라지는지 살펴보세요.`,
        card: C.tab === 'explore' && window.innerWidth >= 700 ? { title: '원뿔의 겉넓이', lines: [
          { text: '밑넓이' }, { text: `$\\pi\\times${M.r}^2=${tx(M.S)}$` },
          { text: '밑면의 둘레' }, { text: `$2\\times\\pi\\times${M.r}=${tx(M.arc)}$` },
          { text: '옆넓이' }, { text: `$\\frac{1}{2}\\times${M.R}\\times${tx(M.arc)}=${tx(M.lat)}$` },
          { text: '겉넓이' }, { text: `$${tx(M.S)}+${tx(M.lat)}=${tx(M.tot)}$` }
        ] } : null,
        readouts: C.tab === 'explore' && window.innerWidth >= 700 ? [] : [
          rd('밑넓이', plainVal(M.S) + ' cm²', 'sky', `π × ${M.r} × ${M.r}`),
          rd('부채꼴의 호의 길이', plainVal(M.arc) + ' cm', 'amber', `밑면의 둘레 2 × π × ${M.r}`),
          rd('옆넓이', plainVal(M.lat) + ' cm²', 'green', `½ × ${M.R} × ${plainVal(M.arc)}`),
          rd('겉넓이', plainVal(M.tot) + ' cm²', 'amber', `${plainVal(M.S)} + ${plainVal(M.lat)}`)
        ],
        formula: `<p>(원뿔의 겉넓이) $=\\pi r^2+\\pi r l$ &nbsp; ($r$ 밑면의 반지름, $l$ 모선의 길이)</p>`,
        rule: '원뿔의 옆면은 부채꼴: 반지름 = 모선의 길이, 호의 길이 = 밑면의 둘레',
        notes: notes('부채꼴의 반지름은 밑면의 반지름 $r$이 아니라 <b>모선의 길이 $l$</b>이에요.', '옆넓이는 $\\pi r l$이에요. 높이를 곱하지 않아요.')
      }),
      prob: (M) => {
        const wrongs = [
          [M.lat, '옆넓이만 구했어요. 밑넓이 $\\pi r^2$도 더해야 해요.'],
          [vadd(M.S, vmul(V(0, M.r * M.R), 2)), '옆넓이는 $\\pi rl$이에요. 두 배로 계산했어요.'],
          [vadd(M.S, V(0, M.R * M.R)), '부채꼴 전체(반지름이 모선의 길이인 원)의 넓이를 썼어요. 부채꼴은 그중 $\\frac{r}{l}$만큼이에요.'],
          [vadd(M.S, V(0, M.r * M.r)), '옆넓이를 $\\pi r^2$으로 계산했어요. 모선의 길이 $l$을 써야 해요.'],
          [vadd(V(0, 2 * M.r * M.r), M.lat), '밑면은 1개예요(뿔의 꼭대기에는 밑면이 없어요).']
        ];
        return { tag: '원뿔의 겉넓이', key: `${M.r}|${M.R}`, stem: `그림과 같이 밑면의 반지름이 $${M.r}\\,\\mathrm{cm}$이고 모선의 길이가 $${M.R}\\,\\mathrm{cm}$인 원뿔의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv2-3 원뿔 종합 (r, h, R) */
  function sv23() {
    const model = (s) => {
      const key = oneOf(s.svTri, TRI_ORDER3, 'A'), k = clamp(Math.round(s.s3K), 1, KMAX3[key]), [r0, h0, R0] = TRI[key], r = r0 * k, h = h0 * k, R = R0 * k, mode = s.svMode === 'vol' ? 'vol' : 'surf';
      s.s3K = k;
      const S = V(0, r * r), lat = V(0, r * R), tot = vadd(S, lat), vol = V(0, (r * r * h) / 3);
      return { key, k, r, h, R, mode, started: !!s.sv23Started, S, lat, tot, vol, ans: mode === 'vol' ? vol : tot };
    };
    // 원래 원뿔을 같은 눈금으로 남겨 두고 옆에서 전개합니다.
    // 원뿔을 평면으로 자른 것처럼 표현하지 않고, 같은 밑면·높이의 기둥과 비교합니다.
    const drawVolumeComparison = (b,s,M,C) => {
      const D=scene3(b,s,C), dx=M.r*1.6, left=D.hx(-dx), right=D.hx(dx);
      const cone=revolveMesh([[0,0],[M.r,0],[0,M.h]],{O:left,N:48,tags:['bot','side']});
      const cylinder=revolveMesh([[0,0],[M.r,0],[M.r,M.h],[0,M.h]],{O:right,N:48,tags:['bot','side','top']});
      const all=cone.faces.flatMap(f=>f.pts).concat(cylinder.faces.flatMap(f=>f.pts));
      D.fit(all,[],{l:b.W<450?16:35,r:(window.innerWidth>=700&&b.W>=560?245:(b.W<450?16:35)),t:b.W<450?18:65,b:b.W<450?35:85});
      D.body({mesh:cone,fill:'sky',alpha:.035,edge:'ink',edgeW:2,dashBack:e=>e.chain&&Math.abs(e.a.y)<1e-6?left:null});
      D.body({mesh:cylinder,fill:'sky',alpha:.055,edge:'ink',edgeW:2,dashBack:e=>e.chain&&Math.abs(e.a.y)<1e-6?right:null});
      const cb=G.bboxOf(cone.faces.flatMap(f=>f.pts.map(D.P))), pb=G.bboxOf(cylinder.faces.flatMap(f=>f.pts.map(D.P)));
      b.text({x:(cb.x0+cb.x1)/2,y:cb.y1},b.W<450?'원뿔':'원래 원뿔',{dy:14,size:D.fs(13),color:'ink',weight:700});
      b.text({x:(pb.x0+pb.x1)/2,y:pb.y1},b.W<450?'원기둥':'같은 밑면·높이의 기둥',{dy:14,size:D.fs(13),color:'ink',weight:700});
      if(pb.x0-cb.x1>0.4){const y=Math.min(cb.y0,pb.y0);D.arrow({x:cb.x1+.15,y},{x:pb.x0-.15,y},'muted',1.5);b.text({x:(cb.x1+pb.x0)/2,y},'부피 3배',{dy:-12,size:D.fs(12),color:'ink',weight:700});}
      if (b.W >= 450) {
        D.height(right,add3(right,v3(0,M.h,0)),`높이 ${M.h}`,{side:{x:1,y:0},color:'ink'});
        D.radius(left,add3(left,v3(M.r,0,0)),`반지름 ${M.r}`,{color:'ink'});
      }
    };
    // 겉넓이 = 전개도(부채꼴 + 원), 부피 = 입체(겨냥도): 반지름·높이·모선과 밑넓이, ⅓ × 밑넓이 × 높이
    const draw = (b, s, M, C) => {
      const st = C.step, rv = C.review, surf = M.mode === 'surf';
      if(surf && M.started && C.tab==='explore' && !b.thumb){drawConeComparison(b,s,M,C);return;}
      if(!surf && M.started && C.tab==='explore' && !b.thumb){drawVolumeComparison(b,s,M,C);return;}
      const hl = !rv ? {} : surf ? (st <= 1 ? { bot: 2 } : st === 2 ? { ring: 2 } : { ring: 3, bot: 2 }) : (st <= 1 ? { bot: 2 } : st === 2 ? {} : { ring: 3, bot: 2 });
      const o = { r2: M.r, r1: 0, hf: M.h, R2: M.R, R1: 0, hSide: { x: 1, y: 0 }, hColor: 'ink', hAlongFrac: 0.2, problemAlpha: 0.02, reviewAlpha: 0.08, textbookReview: true, fitL: C.problem ? (b.W < 450 ? 12 : 80) : (b.W < 450 ? 18 : undefined), fitR: C.problem ? (b.W < 450 ? 12 : 80) : (b.W < 450 ? 18 : undefined), fitT: C.problem ? (b.W < 450 ? 12 : 100) : (b.W < 450 ? 18 : undefined), fitB: C.problem ? (b.W < 450 ? 12 : 100) : (b.W < 450 ? 18 : undefined), t: !surf ? 0 : C.problem ? 0 : rv ? 1 : C.t, problem: C.problem || !surf, review: rv, hl, vals: { ring: plainVal(M.lat), bot: plainVal(M.S), arcBig: plainVal(V(0, 2 * M.r)), tot: plainVal(M.tot) } };
      if (!surf && C.review) { o.fitL = 80; o.fitR = 80; o.fitT = 80; o.fitB = 80; }
      const res = G.coneNet(b, s, C, o);
    };
    return {
      id: 'sv2-3', title: '원뿔 종합', short: '원뿔 종합',
      question: '반지름, 높이, 모선이 모두 주어진 원뿔의 겉넓이와 부피를 구할 때 어떤 길이를 어디에 쓸까?',
      anim: { key: 's3U', dur: 2.8, label: '펼쳐 보기', start: 0, hideActions: true }, cam0: { yaw: 28, pitch: 20 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => [],
      presets: (s) => TRI_ORDER3.map((k, i) => ({ group: i === 0 ? '반지름·높이·모선' : '', label: TRI_LABEL[k], apply: (st,lab) => { st.svTri = k; st.s3K = 1; st.svPitch = TRI[k][1] / TRI[k][0] < 0.65 ? 8 : 20; st.sv23Started = false; st.s3U = 0; st.playing = false; st.svPick = null; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => oneOf(st.svTri, TRI_ORDER3, 'A') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st,lab) => { st.svMode = 'surf'; st.sv23Started = true; st.s3U = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.playing = st.s3U === 0; st.svPick=null; st.revealed=false; st.step=0; lab?._buildProblem?.(); }, on: (st) => st.sv23Started && st.svMode !== 'vol' }, { label: '부피', apply: (st,lab) => { st.svMode = 'vol'; st.sv23Started = true; st.playing = false; st.svPick=null; st.revealed=false; st.step=0; lab?._buildProblem?.(); }, on: (st) => st.sv23Started && st.svMode === 'vol' }]),
      init: (s) => { s.svTri = 'A'; s.s3K = 1; s.svMode = 'surf'; s.sv23Started = false; s.s3U = 0; },
      reroll: (s) => { s.svTri = pick(['A', 'B', 'C'], s.svTri); s.s3K = 1; s.svMode = pick(['surf', 'vol'], s.svMode); s.s3U = 1; },
      model, draw,
      check: (s) => {
        const M = model(s);
        if (Math.abs(M.r * M.r + M.h * M.h - M.R * M.R) > 1e-9) return { ans: -1, model: 0 };
        if (M.mode === 'vol') { let sum = 0; const n = 4000; for (let i = 0; i < n; i++) { const y = ((i + 0.5) / n) * M.h, rr = (M.r * y) / M.h; sum += PI * rr * rr * (M.h / n); } return { ans: sum, model: vnum(M.vol) }; }
        let lat = 0; const n = 4000; for (let i = 0; i < n; i++) { const y0 = (i / n) * M.h, y1 = ((i + 1) / n) * M.h; const r0 = (M.r * y0) / M.h, r1 = (M.r * y1) / M.h; lat += PI * (r0 + r1) * Math.hypot(r1 - r0, y1 - y0); }
        return { ans: PI * M.r * M.r + lat, model: vnum(M.tot) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `밑면은 반지름 $${M.r}$인 원이에요. 밑넓이 $=\\pi\\times${M.r}^2=${tx(M.S)}\\,\\mathrm{cm}^2$예요.`,
        `부피에는 꼭짓점에서 밑면까지의 수직 거리인 높이 $${M.h}$를 써요. (모선 $${M.R}$은 쓰지 않아요.)`,
        `(부피) $=\\frac{1}{3}\\times$ (밑넓이) $\\times$ (높이) $=\\frac{1}{3}\\times${tx(M.S)}\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ] : [
        `밑넓이 $=\\pi\\times${M.r}^2=${tx(M.S)}\\,\\mathrm{cm}^2$예요.`,
        `겉넓이에는 모선 $${M.R}$을 써요. 전개도의 부채꼴은 반지름이 모선 $${M.R}$이고 호의 길이가 밑면의 둘레 $${tx(V(0, 2 * M.r))}$이에요. 옆넓이 $=\\pi\\times${M.R}\\times${M.r}=${tx(M.lat)}\\,\\mathrm{cm}^2$예요. (높이는 쓰지 않아요.)`,
        `(겉넓이) $=$ (옆넓이) $+$ (밑넓이) $=${tx(M.lat)}+${tx(M.S)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M,C) => C.tab==='explore'&&!M.started ? {guide:'겉넓이나 부피를 눌러 필요한 길이를 살펴보세요.',readouts:[]} : ({
        card: (C.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?{title:'',lines:M.mode==='vol'?[{text:'밑넓이',color:'ink'},{text:`$\\pi\\times${M.r}^2=${tx(M.S)}\\,\\mathrm{cm}^2$`,color:'ink'},{text:'부피',color:'ink'},{text:`$\\frac13\\times${tx(M.S)}\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^3$`,color:'ink'}]:[{text:'밑넓이',color:'ink'},{text:`$\\pi\\times${M.r}^2=${tx(M.S)}$`,color:'ink'},{text:'옆넓이',color:'ink'},{text:`$\\pi\\times${M.r}\\times${M.R}=${tx(M.lat)}$`,color:'ink'},{text:'겉넓이',color:'ink'},{text:`$${tx(M.S)}+${tx(M.lat)}=${tx(M.tot)}\\,\\mathrm{cm}^2$`,color:'ink'}]}:null,
        guide: M.mode==='vol' ? '원뿔과 밑면·높이가 같은 원기둥을 비교해요. 원뿔의 부피는 원기둥 부피의 1/3이에요.' : `부채꼴의 반지름은 원뿔의 모선이고 호의 길이는 밑면의 둘레예요. 옆넓이와 밑넓이를 더해 겉넓이를 구해요.`,
        readouts: (C.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?[]:[
          rd('반지름', M.r + ' cm', 'ink'), rd('높이', M.h + ' cm', 'amber'), rd('모선', M.R + ' cm', 'sky'),
          rd('겉넓이', plainVal(M.tot) + ' cm²', M.mode === 'surf' ? 'green' : 'muted', `옆넓이 ${plainVal(M.lat)} + 밑넓이 ${plainVal(M.S)}`), rd('부피', plainVal(M.vol) + ' cm³', M.mode === 'vol' ? 'green' : 'muted', `⅓ × ${plainVal(M.S)} × ${M.h}`)
        ],
        formula: `<p>(겉넓이) $=$ (옆넓이) $+$ (밑넓이) $=\\pi r l+\\pi r^2$ &nbsp;,&nbsp; (부피) $=\\frac{1}{3}\\times$ (밑넓이) $\\times$ (높이) $=\\frac{1}{3}\\pi r^2 h$ &nbsp; ($l$ 모선의 길이)</p>`,
        rule: '겉넓이에는 모선, 부피에는 높이',
        notes: notes('겉넓이에 높이를, 부피에 모선을 쓰는 실수가 많아요. <b>수직인 점선이 높이, 비스듬한 변이 모선</b>이에요.', '부피에는 $\\frac{1}{3}$을 꼭 곱해요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        const base = `밑면의 반지름이 $${M.r}\\,\\mathrm{cm}$, 높이가 $${M.h}\\,\\mathrm{cm}$, 모선의 길이가 $${M.R}\\,\\mathrm{cm}$인 원뿔`;
        if (M.mode === 'vol') {
          wrongs = [[vmul(M.vol, 3), '$\\frac{1}{3}$을 곱하지 않았어요.'], [V(0, (M.r * M.r * M.R) / 3), '부피에는 높이를 써요. 모선을 썼어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$이 아니라 $\\frac{1}{2}$을 곱했어요.'], [V(0, (M.r * M.h) / 3), '밑넓이는 $\\pi\\times r\\times r$이에요.'], [M.tot, '겉넓이를 구했어요.']];
          stem = `그림과 같이 ${base}의 부피는?`;
        } else {
          wrongs = [[vadd(M.S, V(0, M.r * M.h)), '옆넓이에는 모선을 써요. 높이를 썼어요.'], [M.lat, '옆넓이만 구했어요. 밑넓이도 더해야 해요.'], [vmul(M.vol, 1), '부피를 구했어요.'], [vadd(M.S, V(0, M.R * M.h)), '옆넓이는 $\\pi\\times$ (모선) $\\times$ (반지름)이에요.'], [vadd(vmul(M.S, 2), M.lat), '밑면은 1개예요.']];
          stem = `그림과 같이 ${base}의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '원뿔의 부피' : '원뿔의 겉넓이', key: `${M.mode}|${M.key}|${M.k}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  /* ================================================================ sv2-4 원뿔대 (큰 뿔 − 작은 뿔) */
  function sv24() {
    const model = (s) => {
      const fam = oneOf(s.svTri4, TRI_ORDER, 'A'), [a, c, d] = TRI[fam], k = clamp(Math.round(s.s4K), 2, 5), j = clamp(Math.round(s.s4J), 1, k - 1), mode = s.svMode === 'vol' ? 'vol' : 'surf';
      s.s4K = k; s.s4J = j;
      const r2 = a * k, h2 = c * k, R2 = d * k, r1 = a * j, h1 = c * j, R1 = d * j, hf = h2 - h1, Rf = R2 - R1;
      const lat2 = V(0, r2 * R2), lat1 = V(0, r1 * R1), latF = vsub(lat2, lat1), top = V(0, r1 * r1), bot = V(0, r2 * r2), surf = vadd(latF, vadd(top, bot));
      const v2 = V(0, (r2 * r2 * h2) / 3), v1 = V(0, (r1 * r1 * h1) / 3), vol = vsub(v2, v1);
      return { fam, k, j, r2, h2, R2, r1, h1, R1, hf, Rf, lat2, lat1, latF, top, bot, surf, v2, v1, vol, mode, ans: mode === 'vol' ? vol : surf };
    };
    // 겉넓이: 전개도(부채꼴 고리 + 원 2개) — solid3d.js 의 coneNet 이 그립니다
    const drawSurf = (b, s, M, C) => {
      const st = C.step, rv = C.review;
      const hl = !rv ? {} : st <= 1 ? { big: true } : st === 2 ? { small: true } : st === 3 ? { ring: 2 } : { ring: 3, bot: 2, top: 2 };
      G.coneNet(b, s, C, {
        r2: M.r2, r1: M.r1, hf: M.hf, R2: M.R2, R1: M.R1, hColor: 'ink', cleanFrustum: true, showOriginal: true, problemAlpha: 0.02, fitL: C.problem ? (b.W < 450 ? 12 : 95) : (b.W < 600 ? 12 : undefined), fitR: C.problem ? (b.W < 450 ? 12 : 95) : (b.W < 600 ? 12 : undefined), fitT: C.problem ? (b.W < 450 ? 18 : 85) : (b.W < 600 ? 35 : undefined), fitB: C.problem ? (b.W < 450 ? 12 : 85) : (b.W < 600 ? 12 : undefined), t: C.problem ? 0 : rv ? 1 : C.t, problem: C.problem, review: rv, hl,
        vals: { ring: plainVal(M.latF), top: plainVal(M.top), bot: plainVal(M.bot), arcBig: plainVal(V(0, 2 * M.r2)), arcSmall: plainVal(V(0, 2 * M.r1)), tot: plainVal(M.surf), big: plainVal(M.lat2), small: plainVal(M.lat1) }
      });
    };
    // 부피: 겨냥도 — 큰 원뿔 − 작은 원뿔(작은 원뿔이 가로로 빠져나감). solid3d.js 의 frustumVol
    const drawVol = (b, s, M, C) => {
      G.frustumVol(b, s, C, { minimal: true, showOriginal: true, r2: M.r2, r1: M.r1, h2: M.h2, h1: M.h1, t: C.problem ? 1 : C.t, problem: C.problem, review: C.review, step: C.step, vals: { v2: plainVal(M.v2), v1: plainVal(M.v1), vol: plainVal(M.vol) } });
    };
    const draw = (b, s, M, C) => (M.mode === 'vol' ? drawVol(b, s, M, C) : drawSurf(b, s, M, C));
    return {
      id: 'sv2-4', title: '원뿔대', short: '원뿔대',
      question: '원뿔의 윗부분을 잘라 내고 남은 원뿔대의 겉넓이와 부피는 큰 원뿔과 작은 원뿔로 어떻게 구할까?',
      anim: { key: 's4T', dur: 2.5, label: '움직여 보기', hideActions: true }, cam0: { yaw: 28, pitch: 20 }, stepT: (st) => { const lab = window.lab, v = lab && lab.s && lab.s.svMode === 'vol'; return v ? (st <= 1 ? 0 : 1) : 1; }, thumbT: 1, problemT: 0.62,
      ctl: () => ['s4K', 's4J', 's4T'],
      presets: () => TRI_ORDER.map((k, i) => ({ group: i === 0 ? '큰 원뿔의 반지름 : 높이 : 모선 비율' : '', label: TRI[k].join(' : '), apply: (st, lab) => { st.svTri4 = k; st.s4T = 0; st.playing = false; st.svPick = null; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => oneOf(st.svTri4, TRI_ORDER, 'A') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st, lab) => { st.svMode = 'surf'; st.s4T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.playing = st.s4T === 0; st.svPick = null; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st, lab) => { st.svMode = 'vol'; st.s4T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.playing = st.s4T === 0; st.svPick = null; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svMode === 'vol' }]),
      init: (s) => { s.svTri4 = 'A'; s.s4K = 2; s.s4J = 1; s.s4T = 0.0; s.svMode = 'surf'; },
      reroll: (s) => { s.svTri4 = pick(TRI_ORDER, s.svTri4); s.s4K = rint(2, s.svTri4 === 'C' ? 3 : 4); s.s4J = rint(1, s.s4K - 1); s.svMode = pick(['surf', 'vol'], s.svMode); s.s4T = 0; },
      model, draw,
      check: (s) => {
        const M = model(s), n = 4000;
        if (M.mode === 'vol') { let sum = 0; for (let i = 0; i < n; i++) { const y = M.h1 + ((i + 0.5) / n) * M.hf, rr = (M.r2 * y) / M.h2; sum += PI * rr * rr * (M.hf / n); } return { ans: sum, model: vnum(M.vol) }; }
        let lat = 0; const slope = (M.r2 - M.r1) / M.hf; for (let i = 0; i < n; i++) { const y0 = (i / n) * M.hf, y1 = ((i + 1) / n) * M.hf, r0 = M.r1 + slope * y0, rr1 = M.r1 + slope * y1; lat += PI * (r0 + rr1) * Math.hypot(rr1 - r0, y1 - y0); }
        return { ans: lat + PI * M.r1 * M.r1 + PI * M.r2 * M.r2, model: vnum(M.surf) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `큰 원뿔(반지름 $${M.r2}$, 높이 $${M.h2}$)의 부피는 $\\frac{1}{3}\\times\\pi\\times${M.r2}^2\\times${M.h2}=${tx(M.v2)}$예요.`,
        `잘라 낸 작은 원뿔(반지름 $${M.r1}$, 높이 $${M.h1}$)의 부피는 $\\frac{1}{3}\\times\\pi\\times${M.r1}^2\\times${M.h1}=${tx(M.v1)}$예요.`,
        `(원뿔대의 부피) $=$ (큰 원뿔) $-$ (작은 원뿔) $=${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ] : [
        `전개도에서 큰 부채꼴은 반지름이 큰 원뿔의 모선 $${M.R2}$이고 호의 길이가 아랫면의 둘레 $2\\times\\pi\\times${M.r2}=${tx(V(0, 2 * M.r2))}$예요. 넓이는 $\\pi\\times${M.r2}\\times${M.R2}=${tx(M.lat2)}$예요.`,
        `잘라 낸 작은 부채꼴은 반지름이 작은 원뿔의 모선 $${M.R1}$이고 호의 길이가 윗면의 둘레 $2\\times\\pi\\times${M.r1}=${tx(V(0, 2 * M.r1))}$예요. 넓이는 $\\pi\\times${M.r1}\\times${M.R1}=${tx(M.lat1)}$예요.`,
        `원뿔대의 옆넓이는 부채꼴 고리의 넓이예요. (큰 부채꼴) $-$ (작은 부채꼴) $=${tx(M.lat2)}-${tx(M.lat1)}=${tx(M.latF)}$예요.`,
        `(겉넓이) $=$ (옆넓이) $+$ (윗면) $+$ (아랫면) $=${tx(M.latF)}+${tx(M.top)}+${tx(M.bot)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: M.mode === 'vol'
          ? `<b>부피</b>를 누르면 ${span('violet', '작은 원뿔')}이 가로로 빠져나가고 ${span('sky', '원뿔대')}가 남아요. <b>아랫면</b>과 <b>윗면의 반지름</b>을 바꿔 보세요. 부피는 <b>큰 원뿔 − 작은 원뿔</b>이에요.`
          : `<b>겉넓이</b>를 누르면 원뿔대가 펼쳐져요. 옆면은 ${span('green', '부채꼴 고리')}(큰 부채꼴 − 작은 부채꼴)이고, ${span('violet', '큰 호')}는 아랫면의 둘레, ${span('orange', '작은 호')}는 윗면의 둘레와 같아요. 겉넓이는 옆넓이에 <b>두 밑면</b>을 더해요.`,
        readouts: M.mode === 'vol'
          ? [rd('큰 원뿔의 부피', plainVal(M.v2) + ' cm³', 'sky', `⅓ × π × ${M.r2} × ${M.r2} × ${M.h2}`), rd('작은 원뿔의 부피', plainVal(M.v1) + ' cm³', 'violet', `⅓ × π × ${M.r1} × ${M.r1} × ${M.h1}`), rd('원뿔대의 부피', plainVal(M.vol) + ' cm³', 'green', '큰 원뿔 − 작은 원뿔')]
          : [rd('큰 부채꼴의 넓이', plainVal(M.lat2) + ' cm²', 'sky', `π × ${M.r2} × ${M.R2}`), rd('작은 부채꼴의 넓이', plainVal(M.lat1) + ' cm²', 'violet', `π × ${M.r1} × ${M.R1}`), rd('원뿔대의 옆넓이', plainVal(M.latF) + ' cm²', 'amber', '큰 부채꼴 − 작은 부채꼴'), rd('두 밑면의 넓이', plainVal(vadd(M.top, M.bot)) + ' cm²', 'orange', `${plainVal(M.top)} + ${plainVal(M.bot)}`), rd('겉넓이', plainVal(M.surf) + ' cm²', 'green', '옆넓이 + 두 밑면')],
        formula: `<p>(원뿔대의 부피) $=$ (큰 원뿔) $-$ (작은 원뿔) &nbsp;,&nbsp; (겉넓이) $=$ (옆넓이) $+$ (윗면) $+$ (아랫면), (옆넓이) $=$ (큰 부채꼴) $-$ (작은 부채꼴)</p>`,
        rule: '원뿔대 = 큰 원뿔 − 작은 원뿔 (겉넓이는 두 밑면을 꼭 더해요)',
        notes: notes('원뿔대의 겉넓이에는 <b>위·아래 두 밑면</b>이 모두 들어가요. 작은 원뿔을 잘라 낸 자리(윗면)도 밑면이에요.', '뺄 것은 <b>옆넓이끼리</b>(부채꼴끼리)예요. 밑넓이까지 빼지 않아요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        const base = M.mode === 'vol'
          ? `밑면의 반지름이 $${M.r2}\\,\\mathrm{cm}$, 윗면의 반지름이 $${M.r1}\\,\\mathrm{cm}$이고 큰 원뿔의 높이가 $${M.h2}\\,\\mathrm{cm}$, 잘라 낸 작은 원뿔의 높이가 $${M.h1}\\,\\mathrm{cm}$인 원뿔대`
          : `밑면의 반지름이 $${M.r2}\\,\\mathrm{cm}$, 윗면의 반지름이 $${M.r1}\\,\\mathrm{cm}$이고 큰 원뿔의 모선이 $${M.R2}\\,\\mathrm{cm}$, 잘라 낸 작은 원뿔의 모선이 $${M.R1}\\,\\mathrm{cm}$인 원뿔대`;
        if (M.mode === 'vol') {
          wrongs = [[vadd(M.v2, M.v1), '작은 원뿔은 더하지 않고 빼요.'], [M.v2, '큰 원뿔의 부피예요. 작은 원뿔을 빼야 해요.'], [vmul(vsub(V(0, M.r2 * M.r2 * M.h2), V(0, M.r1 * M.r1 * M.h1)), 1), '$\\frac{1}{3}$을 곱하지 않았어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.'], [V(0, (M.r2 * M.r2 - M.r1 * M.r1) * M.hf / 3 + 0), '높이는 큰 원뿔의 높이를 써서 각각 구한 뒤 빼야 해요(원뿔대의 높이에 밑넓이의 차를 곱하면 안 돼요).']];
          stem = `그림과 같이 ${base}의 부피는?`;
        } else {
          wrongs = [[vadd(M.latF, M.bot), '윗면(작은 원)을 빠뜨렸어요.'], [M.latF, '옆넓이만 구했어요. 위·아래 두 밑면도 더해야 해요.'], [vadd(M.lat2, vadd(M.top, M.bot)), '큰 원뿔의 옆넓이를 그대로 썼어요. 작은 원뿔의 옆넓이를 빼야 해요.'], [vadd(vsub(M.lat2, M.lat1), vsub(M.bot, M.top)), '밑면은 빼지 않고 더해요.'], [vadd(vadd(M.lat2, M.lat1), vadd(M.top, M.bot)), '작은 원뿔의 옆넓이는 더하지 않고 빼요.']];
          stem = `그림과 같이 ${base}의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '원뿔대의 부피' : '원뿔대의 겉넓이', key: `${M.mode}|${M.fam}|${M.k}|${M.j}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  /* ================================================================ sv2-5 각뿔·각뿔대 (정사각, 전개도) */
  function sv25() {
    const model = (s) => {
      const kind = s.svKind5 === 'pyr' ? 'pyr' : 'frus', k = clamp(Math.round(s.s5A), 4, 24), j = kind === 'frus' ? clamp(Math.round(s.s5B), 1, k - 1) : 0, mode = s.svMode === 'vol' ? 'vol' : 'surf';
      s.s5A = k; if (kind === 'frus') s.s5B = j;
      const a2 = k, a1 = kind === 'frus' ? j : 0, h2 = 2 * a2 / 3, h1 = 2 * a1 / 3, l2 = 5 * a2 / 6, l1 = 5 * a1 / 6, hf = h2 - h1, lf = l2 - l1;
      const bot = V(a2 * a2), top = V(a1 * a1), lat = V(2 * (a1 + a2) * lf), tot = vadd(vadd(bot, top), lat);
      const v2 = V((a2 * a2 * h2) / 3), v1 = V((a1 * a1 * h1) / 3), vol = vsub(v2, v1);
      return { kind, k, j, mode, a2, h2, l2, a1, h1, l1, hf, lf, bot, top, lat, tot, v2, v1, vol, ans: mode === 'vol' ? vol : tot };
    };
    // 겉넓이: 전개도(옆면 4개 + 밑면) — 면마다 이름과 넓이, 밑면의 변 ↔ 옆면의 변은 같은 색
    const drawSurf = (b, s, M, C) => {
      const sc = 4.6 / Math.max(M.a2, M.h2 * 1.1), a2 = M.a2 * sc, hf = M.hf * sc, st = C.step, pyr = M.kind === 'pyr';
      const base = [[-a2 / 2, -a2 / 2], [a2 / 2, -a2 / 2], [a2 / 2, a2 / 2], [-a2 / 2, a2 / 2]];
      const sn = solidNet(base, hf, pyr ? 0 : M.a1 / M.a2, null, 0);
      const lvB = !C.review ? 1 : st === 1 ? 2 : 3, lvL = !C.review ? 1 : st === 1 ? 0 : st === 2 ? 2 : 3;
      const t = C.problem ? 0 : C.t, e = ease(t), glue = e > 0.3 && !C.problem && !b.thumb, BIG = (C.tab === 'explore' || C.problem) ? 'ink' : 'violet', SMALL = (C.tab === 'explore' || C.problem) ? 'ink' : 'orange';
      const eachLat = V(pyr ? (M.a2 * M.lf) / 2 : ((M.a1 + M.a2) * M.lf) / 2);
      netScene(b, s, C, {
        sn, t, showOriginal: b.W >= 1000,
        refLabels: (R) => {
          const A = sn.A, B = sn.B, center = add3(centroid(A), v3(0, hf / 2, 0));
          R.dim(A[1], A[2], pyr ? `밑변 ${M.a2}` : `아랫변 ${M.a2}`, { from: center, off: 12, color: 'ink' });
          if (!pyr) R.dim(B[0], B[1], `윗변 ${M.a1}`, { from: center, off: 12, color: 'ink' });
        },
        fitOpt: { l: b.W < 900 ? 18 : 54, r: (C.tab === 'explore' && b.W >= 560 && window.innerWidth >= 700) ? 245 : (b.W < 900 ? 18 : 54), t: C.problem ? 40 : (b.W < 900 ? 24 : 40 + 56 * e), b: C.problem ? 40 : (b.W < 900 ? 24 : 40 + 40 * e) },
        style: (pc) => {
          const tag = pc.tag, lv = tag === 'lat' ? lvL : lvB, stl = roleStyle(tag === 'lat' ? 'lat' : 'base', lv);
          if (lv !== 2) { if (tag === 'bot') stl.fill = BIG; else if (tag === 'top') stl.fill = SMALL; }
          if (lv === 1 || lv === 3) stl.alpha = tag === 'lat' ? 0.3 : 0.24;
          if (C.tab === 'explore' || C.problem) stl.alpha = Math.min(stl.alpha, C.problem ? 0.02 : 0.06);
          stl.edgeStyle = (ed, p) => (glue && ((p.tag === 'lat' && ed.i === 0) || p.tag === 'bot') ? { color: BIG, width: 3.4 } : glue && !pyr && ((p.tag === 'lat' && ed.i === 2) || p.tag === 'top') ? { color: SMALL, width: 3.4 } : null);
          return stl;
        },
        labels: (ctx) => {
          if (b.thumb) return;
          const { D, tp } = ctx, vw = D.vw, A = sn.A, B = sn.B, at = ctx.at, px = D.px;
          const solidA = 1 - G.lin01(ctx.e, 0.05, 0.45), flatA = G.lin01(ctx.e, 0.78, 0.98);
          const cen = at(sn.root, add3(centroid(A), v3(0, hf / 2, 0)));
          const f1 = sn.lat[1], fr = sn.lat[0];
          // 원래 입체와 병치될 때 왼쪽 치수선이 겹치지 않도록 펼친 화면에서는 생략합니다.
          if (!(C.tab === 'explore' && ctx.e > 0.3 && b.W >= 1000)) {
            D.dim(at(f1, A[1]), at(f1, A[2]), b.W < 450 ? `${M.a2}` : (pyr ? `밑변 ${M.a2}` : `아랫변 ${M.a2}`), { from: cen, off: 16, color: BIG });
            if (!pyr) D.dim(at(f1, B[1]), at(f1, B[2]), b.W < 450 ? `${M.a1}` : `윗변 ${M.a1}`, { from: cen, off: 16, color: SMALL });
          }
          // 옆면의 높이: 점선 + 직각 표시
          const bm = mid3(at(fr, A[0]), at(fr, A[1])), tm = pyr ? at(fr, B[0]) : mid3(at(fr, B[0]), at(fr, B[1]));
          const hpxEarly = Math.hypot(px(bm).x - px(tm).x, px(bm).y - px(tm).y);
          D.height(bm, tm, hpxEarly < 50 ? '' : `옆면의 높이 ${plainVal(V(M.lf))}`, { a: unit3(sub3(at(fr, A[1]), at(fr, A[0]))), side: { x: 1, y: 0 }, size: 14, alongFrac: -0.35, color: 'ink' });
          if (C.problem || C.tab === 'explore') return;
          // 면마다 넓이 이름표
          const hpx = Math.hypot(px(bm).x - px(tm).x, px(bm).y - px(tm).y), thinF = hpx < 50;
          sn.lat.forEach((idx, k) => {
            if (dot3(tp[idx].n, vw) < 0.35) return;
            const bmid = mid3(A[k], A[(k + 1) % 4]), tmid = pyr ? B[0] : mid3(B[k], B[(k + 1) % 4]), f = pyr ? 0.34 : 0.5;
            const pl = px(at(idx, lerp3(A[k], pyr ? B[0] : B[k], f))), pr = px(at(idx, lerp3(A[(k + 1) % 4], pyr ? B[0] : B[(k + 1) % 4], f))), wpx = Math.hypot(pl.x - pr.x, pl.y - pr.y);
            D.areaLab(at(idx, lerp3(bmid, tmid, f)), thinF ? '' : '옆면', plainVal(eachLat), { maxW: wpx * 0.9, dx: idx === fr ? -0.22 * wpx : 0, size: thinF ? 13 : 15, color: thinF ? 'green' : 'ink' });
          });
          [sn.bot, sn.top].forEach((k) => {
            if (k < 0 || !tp[k].front) return;
            const isTop = k === sn.top, pts = sn.net.pieces[k].pts, xs = pts.map((p) => px(at(k, p)).x), faceW = Math.max(...xs) - Math.min(...xs);
            D.areaLab(at(k, centroid(pts)), isTop ? '윗면' : (pyr ? '밑면' : '아랫면'), plainVal(isTop ? M.top : M.bot), { maxW: faceW * 0.86 });
          });
          if (flatA > 0.02) {
            const parts = pyr ? [['옆면 4개', plainVal(M.lat), 'green'], ['밑면', plainVal(M.bot), BIG]] : [['옆면 4개', plainVal(M.lat), 'green'], ['윗면', plainVal(M.top), SMALL], ['아랫면', plainVal(M.bot), BIG]];
            const r1s = [{ t: '겉넓이 = ' }]; parts.forEach((p, i) => { if (i) r1s.push({ t: ' + ' }); r1s.push({ t: p[0], c: p[2] }); });
            const r2s = [{ t: '= ' }]; parts.forEach((p, i) => { if (i) r2s.push({ t: ' + ' }); r2s.push({ t: p[1], c: p[2] }); }); r2s.push({ t: ` = ${plainVal(M.tot)}` });
            G.sumRows(D, [r1s, r2s], flatA);
            G.sumRows(D, [[{ t: pyr ? `옆면 1개 = ${M.a2} × ${plainVal(V(M.lf))} ÷ 2 = ${plainVal(eachLat)}` : `옆면 1개 = (${M.a1} + ${M.a2}) × ${plainVal(V(M.lf))} ÷ 2 = ${plainVal(eachLat)}`, c: 'green' }]], flatA, true);
          }
        }
      });
    };
    // 부피: 겨냥도 — 큰 각뿔 − 작은 각뿔(작은 각뿔이 가로로 빠져나감), 각뿔은 ⅓ × 밑넓이 × 높이
    const drawVol = (b, s, M, C) => {
      const pyr = M.kind === 'pyr', sc = 4.6 / Math.max(M.a2, M.h2 * 1.1), w2 = (M.a2 * sc) / 2, w1 = (M.a1 * sc) / 2, h2 = M.h2 * sc, h1 = M.h1 * sc, hf = M.hf * sc, st = C.step, thumb = !!b.thumb;
      const t = pyr ? 0 : C.problem ? 1 : C.t, D = scene3(b, s, C), slide = ease(t) * (w1 * 2 * 1.5 + w1 + 0.4), sh = D.hx(slide);
      const sq = (w) => [[-w, -w], [w, -w], [w, w], [-w, w]];
      const y0 = -h2 / 2, yc = y0 + hf, cb = v3(0, y0, 0), apexBig = v3(0, y0 + h2, 0), ct = v3(0, yc, 0);
      const frM = pyr ? G.loftMesh(sq(w2), y0, y0 + h2, 0) : G.loftMesh(sq(w2), y0, yc, M.a1 / M.a2);
      const smM = pyr ? null : G.xfMesh(G.loftMesh(sq(w1), yc, yc + h1, 0), shiftT(sh));
      const pts = [v3(-w2, y0, -w2), v3(w2, y0, -w2), v3(w2, y0, w2), v3(-w2, y0, w2), apexBig];
      if (!pyr) [v3(-w1, yc, -w1), v3(w1, yc, w1), v3(w1, yc, -w1), v3(-w1, yc, w1), v3(0, yc + h1, 0)].forEach((p) => pts.push(add3(p, sh)));
      D.fit(pts, [], { l: 54, r: 54, t: thumb ? 5 : (C.problem ? 40 : 84), b: thumb ? 5 : (C.problem ? 50 : 76) });
      const rv = C.review, big = rv && st <= 1, sm = rv && st === 2, fr = rv && st >= 3;
      if (!pyr && t < 0.98) {
        [[-w2, -w2], [w2, -w2], [w2, w2], [-w2, w2]].forEach((q) => D.line(v3(q[0], y0, q[1]), apexBig, 'muted', 1.6, { dash: [5, 4], alpha: 0.55 * (1 - ease(t)) }));
      }
      D.body({ mesh: frM, fill: pyr ? (big || fr ? 'amber' : 'sky') : (fr || big ? 'amber' : 'sky'), alpha: (C.tab === 'explore' || C.problem) ? 0.05 : (big || fr ? 0.34 : 0.22), edge: 'ink', edgeW: 2.6, dashBack: () => null });
      if (smM) D.body({ mesh: smM, fill: sm || big ? 'amber' : 'violet', alpha: (C.tab === 'explore' || C.problem) ? 0.05 : (sm || big ? 0.42 : 0.24), edge: 'ink', edgeW: 2.6 });
      if (thumb) return;
      const aBig = 1 - ease(lin01(t, 0, 0.35)), aSm = ease(lin01(t, 0.25, 0.6));
      D.dim(v3(-w2, y0, w2), v3(w2, y0, w2), `한 변 ${M.a2}`, { side: { x: 0, y: 1 }, off: 18, color: 'ink' });
      D.height(cb, apexBig, `높이 ${plainVal(V(M.h2))}`, { alpha: aBig, color: 'ink', side: { x: 1, y: 0 } });
      if (!pyr) {
        D.dim(add3(v3(-w1, yc, w1), sh), add3(v3(w1, yc, w1), sh), `한 변 ${M.a1}`, { side: { x: 0, y: 1 }, off: 16, color: 'ink', alpha: aSm });
        D.height(add3(ct, sh), add3(v3(0, yc + h1, 0), sh), `높이 ${plainVal(V(M.h1))}`, { alpha: aSm, color: 'ink', side: { x: 1, y: 0 } });
      }
      if (C.problem) return;
      const k = b.k || 40;
      const showCard = C.tab === 'explore' && b.W >= 560 && window.innerWidth >= 700;
      if (showCard) return;
      if (pyr) {
        D.areaLab(cb, '밑넓이', plainVal(M.bot), { dx: -0.3 * w2 * k, dy: 4, color: 'sky' });
        G.sumRows(D, [[{ t: '부피 = ' }, { t: '⅓', c: 'amber' }, { t: ' × ' }, { t: '밑넓이', c: 'sky' }, { t: ' × ' }, { t: '높이', c: 'amber' }], [{ t: `= ⅓ × ${plainVal(M.bot)} × ${plainVal(V(M.h2))} = ${plainVal(M.vol)}` }]], 1);
        return;
      }
      const a3 = ease(lin01(t, 0.55, 0.95));
      D.areaLab(v3(0, y0, 0), '큰 각뿔', plainVal(M.v2), { dx: -0.38 * w2 * k, dy: -4, maxW: w2 * k * 0.8, alpha: 1 - ease(lin01(t, 0.1, 0.45)) });
      D.areaLab(add3(v3(0, yc + h1, 0), sh), '작은 각뿔', plainVal(M.v1), { alpha: aSm, color: 'violet', dy: -18 });
      D.areaLab(v3(0, y0 + hf * 0.4, 0), '각뿔대', plainVal(M.vol), { alpha: a3, color: 'green', maxW: w2 * k * 1.2 });
      G.sumRows(D, [[{ t: '각뿔대의 부피 = ' }, { t: '큰 각뿔', c: 'sky' }, { t: ' − ' }, { t: '작은 각뿔', c: 'violet' }], [{ t: '= ' }, { t: plainVal(M.v2), c: 'sky' }, { t: ' − ' }, { t: plainVal(M.v1), c: 'violet' }, { t: ` = ${plainVal(M.vol)}` }]], 1);
    };
    const draw = (b, s, M, C) => (M.mode === 'vol' ? drawVol(b, s, M, C) : drawSurf(b, s, M, C));
    return {
      id: 'sv2-5', title: '각뿔·각뿔대', short: '각뿔대',
      question: '정사각뿔과 정사각뿔대를 펼치면 옆면은 어떤 모양이 될까? 옆면의 높이는 어디에 쓸까?',
      anim: { key: 's5T', dur: 2.5, label: '움직여 보기', hideActions: true }, cam0: { yaw: 28, pitch: 24 }, stepT: (st) => { const lab = window.lab, s0 = lab && lab.s; return s0 && s0.svMode === 'vol' && s0.svKind5 !== 'pyr' && st <= 1 ? 0 : 1; }, thumbT: 1, problemT: 0,
      ctl: (s) => (s.svMode === 'vol' ? (s.svKind5 === 'pyr' ? ['s5A'] : ['s5A', 's5B', 's5T']) : (s.svKind5 === 'pyr' ? ['s5A', 's5T'] : ['s5A', 's5B', 's5T'])),
      presets: () => [{ group: '입체', label: '정사각뿔대', apply: (st, lab) => { st.svKind5 = 'frus'; if (st.s5B >= st.s5A) st.s5B = st.s5A - 1; st.s5T = 0; st.playing = false; st.svPick = null; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svKind5 !== 'pyr' }, { label: '정사각뿔', apply: (st, lab) => { st.svKind5 = 'pyr'; st.s5T = 0; st.playing = false; st.svPick = null; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svKind5 === 'pyr' }, { group: '구하는 것', label: '겉넓이', apply: (st, lab) => { st.svMode = 'surf'; st.s5T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.playing = st.s5T === 0; st.svPick = null; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st, lab) => { st.svMode = 'vol'; st.s5T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.playing = st.s5T === 0 && st.svKind5 !== 'pyr'; st.svPick = null; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svMode === 'vol' }],
      init: (s) => {
        s.svKind5 = 'frus'; s.s5A = 9; s.s5B = 3; s.s5T = 0; s.svMode = 'surf';
        if (typeof location !== 'undefined') {
          const q = new URLSearchParams(location.hash.slice(1)), id = q.get('s') || '';
          const oldK = Number(q.get('s5K')), oldJ = Number(q.get('s5J'));
          if (id.split('@')[0] === 'sv2-5' && !q.has('s5A') && oldK >= 2 && oldK <= 4 && oldJ >= 1 && oldJ < oldK) { s.s5A = 6 * oldK; s.s5B = 6 * oldJ; }
        }
      },
      reroll: (s) => { s.svKind5 = pick(['pyr', 'frus'], s.svKind5); s.s5A = pick([9, 12, 15], s.s5A); s.s5B = s.s5A - 6; s.svMode = pick(['surf', 'vol'], s.svMode); s.s5T = 0; },
      model, draw,
      check: (s) => {
        const M = model(s), n = 3000;
        if (M.mode === 'vol') { let sum = 0; for (let i = 0; i < n; i++) { const y = M.h1 + ((i + 0.5) / n) * M.hf, side = (M.a2 * y) / M.h2; sum += side * side * (M.hf / n); } return { ans: sum, model: vnum(M.vol) }; }
        // 옆면 4개 = 사다리꼴(높이 lf, 위변 a1, 아랫변 a2)을 적분으로: 폭이 선형으로 변하는 띠
        let lat = 0; for (let i = 0; i < n; i++) { const f = (i + 0.5) / n, w = M.a1 + (M.a2 - M.a1) * f; lat += w * (M.lf / n); }
        return { ans: M.a2 * M.a2 + M.a1 * M.a1 + 4 * lat, model: vnum(M.tot) };
      },
      steps: (M) => M.mode === 'vol' ? [
        M.kind === 'pyr' ? `밑면은 한 변이 $${M.a2}$인 정사각형이에요. 밑넓이는 $${M.a2}^2=${tx(M.bot)}$예요.` : `큰 각뿔(밑면 한 변 $${M.a2}$, 높이 $${tx(V(M.h2))}$)의 부피는 $\\frac{1}{3}\\times${M.a2}^2\\times${tx(V(M.h2))}=${tx(M.v2)}$예요.`,
        M.kind === 'pyr' ? `각뿔의 부피는 밑넓이와 높이의 곱에 $\\frac{1}{3}$을 곱해요. $\\frac{1}{3}\\times${tx(M.bot)}\\times${tx(V(M.h2))}=${tx(M.vol)}$예요.` : `잘라 낸 작은 각뿔(한 변 $${M.a1}$, 높이 $${tx(V(M.h1))}$)의 부피는 $\\frac{1}{3}\\times${M.a1}^2\\times${tx(V(M.h1))}=${tx(M.v1)}$예요.`,
        M.kind === 'pyr' ? `(부피) $=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.` : `(각뿔대의 부피) $=$ (큰 각뿔) $-$ (작은 각뿔) $=${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ] : [
        M.kind === 'pyr' ? `밑면은 정사각형 1개예요. 밑넓이 $${M.a2}^2=${tx(M.bot)}$예요.` : `밑면은 위·아래 정사각형 2개예요. $${M.a1}^2+${M.a2}^2=${tx(M.top)}+${tx(M.bot)}=${tx(vadd(M.top, M.bot))}$예요.`,
        M.kind === 'pyr' ? `옆면은 밑변 $${M.a2}$, 높이 $${tx(V(M.lf))}$인 삼각형 4개예요. $4\\times\\frac{1}{2}\\times${M.a2}\\times${tx(V(M.lf))}=${tx(M.lat)}$예요.` : `옆면은 윗변 $${M.a1}$, 아랫변 $${M.a2}$, 높이 $${tx(V(M.lf))}$인 사다리꼴 4개예요. $4\\times\\frac{1}{2}\\times(${M.a1}+${M.a2})\\times${tx(V(M.lf))}=${tx(M.lat)}$예요.`,
        `(겉넓이) $=${tx(vadd(M.top, M.bot))}+${tx(M.lat)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? { title: '', lines: M.mode === 'vol'
          ? (M.kind === 'pyr' ? [{ text: '밑넓이', color: 'ink' }, { text: `$${M.a2}^2=${tx(M.bot)}\\,\\mathrm{cm}^2$`, color: 'ink' }, { text: '부피', color: 'ink' }, { text: `$\\frac13\\times${tx(M.bot)}\\times${tx(V(M.h2))}=${tx(M.vol)}\\,\\mathrm{cm}^3$`, color: 'ink' }]
            : [{ text: '큰 각뿔', color: 'ink' }, { text: `$\\frac13\\times${M.a2}^2\\times${tx(V(M.h2))}=${tx(M.v2)}$`, color: 'ink' }, { text: '작은 각뿔', color: 'ink' }, { text: `$\\frac13\\times${M.a1}^2\\times${tx(V(M.h1))}=${tx(M.v1)}$`, color: 'ink' }, { text: '각뿔대의 부피', color: 'ink' }, { text: `$${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^3$`, color: 'ink' }])
          : [{ text: M.kind === 'pyr' ? '밑넓이' : '두 밑면의 넓이', color: 'ink' }, { text: M.kind === 'pyr' ? `$${M.a2}^2=${tx(M.bot)}$` : `$${M.a2}^2+${M.a1}^2=${tx(vadd(M.top, M.bot))}$`, color: 'ink' }, { text: '옆면 네 개의 넓이', color: 'ink' }, { text: M.kind === 'pyr' ? `$4\\times\\frac12\\times${M.a2}\\times${tx(V(M.lf))}=${tx(M.lat)}$` : `$4\\times\\frac12\\times(${M.a2}+${M.a1})\\times${tx(V(M.lf))}=${tx(M.lat)}$`, color: 'ink' }, { text: '겉넓이', color: 'ink' }, { text: `$${tx(vadd(M.top, M.bot))}+${tx(M.lat)}=${tx(M.tot)}\\,\\mathrm{cm}^2$`, color: 'ink' }] } : null,
        guide: M.mode === 'vol'
          ? (M.kind === 'pyr' ? '각뿔의 부피는 밑넓이와 밑면에 수직인 높이로 구해요.' : '각뿔대의 부피는 큰 각뿔에서 잘라 낸 작은 각뿔을 빼서 구해요.')
          : `겉넓이에는 밑면과 옆면이 모두 들어가요. ${span('green', '옆면')}은 합동인 ${M.kind === 'pyr' ? '삼각형' : '사다리꼴'} 4개예요. 옆면의 ${span('amber', '높이')}(점선)를 넓이에 써요.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : M.mode === 'vol'
          ? M.kind === 'pyr'
            ? [rd('밑넓이', plainVal(M.bot) + ' cm²', 'sky'), rd('부피', plainVal(M.vol) + ' cm³', 'green', `⅓ × ${M.a2} × ${M.a2} × ${plainVal(V(M.h2))}`)]
            : [rd('큰 각뿔의 부피', plainVal(M.v2) + ' cm³', 'sky', `⅓ × ${M.a2} × ${M.a2} × ${plainVal(V(M.h2))}`), rd('작은 각뿔의 부피', plainVal(M.v1) + ' cm³', 'violet', `⅓ × ${M.a1} × ${M.a1} × ${plainVal(V(M.h1))}`), rd('각뿔대의 부피', plainVal(M.vol) + ' cm³', 'green', '큰 각뿔 − 작은 각뿔')]
          : [rd('밑면의 넓이 합', plainVal(vadd(M.top, M.bot)) + ' cm²', 'sky'), rd('옆면 1개의 넓이', plainVal(V(M.kind === 'pyr' ? (M.a2 * M.lf) / 2 : ((M.a1 + M.a2) * M.lf) / 2)) + ' cm²', 'amber'), rd('옆면 4개의 넓이', plainVal(M.lat) + ' cm²', 'green'), rd('겉넓이', plainVal(M.tot) + ' cm²', 'amber', '옆면 4개 + 밑면')],
        formula: M.mode === 'vol'
          ? (M.kind === 'pyr'
            ? `<p>부피<br>$\\frac{1}{3}\\times\\text{밑넓이}\\times\\text{높이}=${tx(M.vol)}\\,\\mathrm{cm}^3$</p>`
            : `<p>각뿔대의 부피<br>$\\text{큰 각뿔의 부피}-\\text{작은 각뿔의 부피}=${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^3$</p>`)
          : (M.kind === 'pyr'
            ? `<p>옆면 한 개의 넓이<br>$\\frac{1}{2}\\times\\text{밑변}\\times\\text{옆면의 높이}$</p><p>겉넓이<br>$\\text{밑넓이}+\\text{옆면 4개의 넓이}=${tx(M.tot)}\\,\\mathrm{cm}^2$</p>`
            : `<p>옆면 한 개의 넓이<br>$\\frac{1}{2}\\times(\\text{윗변}+\\text{아랫변})\\times\\text{옆면의 높이}$</p><p>겉넓이<br>$\\text{두 밑면의 넓이}+\\text{옆면 4개의 넓이}=${tx(M.tot)}\\,\\mathrm{cm}^2$</p>`),
        rule: '각뿔의 옆면은 삼각형, 각뿔대의 옆면은 사다리꼴 (높이는 옆면의 높이)',
        notes: M.mode === 'vol'
          ? (M.kind === 'pyr' ? notes('부피에는 옆면의 높이가 아니라 꼭짓점에서 밑면에 수직인 높이를 써요.') : notes('큰 각뿔과 작은 각뿔의 높이를 각각 사용한 뒤 부피를 빼요.'))
          : (M.kind === 'pyr' ? notes('옆면의 넓이는 삼각형의 높이로 구해요.', '겉넓이에는 밑면과 옆면 네 개가 들어가요.') : notes('옆면의 높이는 각뿔대의 높이와 달라요. 옆면 사다리꼴의 높이를 써요.', '각뿔대의 겉넓이에는 위·아래 두 밑면이 모두 들어가요.'))
      }),
      prob: (M) => {
        let wrongs, stem;
        const square = M.kind === 'pyr'
          ? `밑면이 한 변 $${M.a2}\\,\\mathrm{cm}$인 정사각뿔`
          : `아랫면이 한 변 $${M.a2}\\,\\mathrm{cm}$, 윗면이 한 변 $${M.a1}\\,\\mathrm{cm}$인 정사각뿔대`;
        const details = M.mode === 'surf'
          ? `옆면의 높이는 $${tx(V(M.lf))}\\,\\mathrm{cm}$이다.`
          : M.kind === 'pyr'
            ? `높이는 $${tx(V(M.h2))}\\,\\mathrm{cm}$이다.`
            : `큰 각뿔의 높이는 $${tx(V(M.h2))}\\,\\mathrm{cm}$, 잘라 낸 작은 각뿔의 높이는 $${tx(V(M.h1))}\\,\\mathrm{cm}$이다.`;
        const shape = `${square}이다. ${details}`;
        if (M.mode === 'vol') {
          wrongs = M.kind === 'pyr'
            ? [[vmul(M.vol, 3), '$\\frac{1}{3}$을 곱하지 않았어요.'], [V((M.a2 * M.a2 * M.lf) / 3), '부피에는 옆면의 높이가 아니라 높이 $h$를 써요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.'], [M.tot, '겉넓이를 구했어요.'], [vmul(M.vol, 2 / 3), '$\\frac{1}{3}$을 곱해야 해요.']]
            : [[vadd(M.v2, M.v1), '작은 각뿔은 더하지 않고 빼요.'], [M.v2, '큰 각뿔의 부피예요. 작은 각뿔을 빼야 해요.'], [V(((M.a2 * M.a2 - M.a1 * M.a1) * M.hf)), '$\\frac{1}{3}$을 곱하지 않았어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.'], [M.tot, '겉넓이를 구했어요.']];
          stem = `그림과 같이 ${shape} 이 입체의 부피는?`;
        } else {
          wrongs = M.kind === 'pyr'
            ? [[vadd(M.bot, vmul(M.lat, 2)), '옆면은 삼각형이에요. $\\frac{1}{2}$을 곱해야 해요.'], [M.lat, '옆넓이만 구했어요. 밑넓이도 더해야 해요.'], [vadd(M.bot, V(2 * M.a2 * M.hf)), '옆면의 높이(점선)가 아니라 각뿔의 높이를 썼어요.'], [vadd(vmul(M.bot, 2), M.lat), '밑면은 1개예요.'], [V((M.a2 * M.a2 * M.hf) / 3), '부피를 구했어요.']]
            : [[vadd(M.bot, M.lat), '윗면(작은 정사각형)을 빠뜨렸어요.'], [M.lat, '옆넓이만 구했어요. 위·아래 두 밑면도 더해야 해요.'], [vadd(vadd(M.bot, M.top), vmul(M.lat, 2)), '옆면은 사다리꼴이에요. $\\frac{1}{2}$을 곱해야 해요.'], [vadd(vadd(M.bot, M.top), V(2 * (M.a1 + M.a2) * M.hf)), '옆면의 높이(점선)가 아니라 각뿔대의 높이를 썼어요.'], [vadd(vsub(M.bot, M.top), M.lat), '윗면은 빼지 않고 더해요.']];
          stem = `그림과 같이 ${shape} 이 입체의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '각뿔(대)의 부피' : '각뿔(대)의 겉넓이', key: `${M.kind}|${M.mode}|${M.k}|${M.j}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  G.register(20, 't2', '② 뿔', '뿔', PARAMS, [sv21(), sv22(), sv23(), sv24(), sv25()]);
})();
