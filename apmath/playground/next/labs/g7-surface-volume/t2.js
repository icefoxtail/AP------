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
  const { PI, DEG, clamp, ease, seg01, lin01, v3, add3, sub3, mul3, lerp3, mid3, dot3, unit3, len3, V, vadd, vsub, vmul, vnum, tx, plainVal, mkV, P, fmtN, pick, rint, notes, rd, span, scene3, solidNet, circleBase, netScene, roleStyle, layoutTiles, drawTiles, polyMesh, revolveMesh, shiftT, centroid } = G;

  const TRI = { A: [3, 4, 5], B: [4, 3, 5], C: [5, 12, 13], D: [6, 8, 10] }; // [r, h, R]
  const TRI_LABEL = { A: 'r:h:R = 3:4:5', B: 'r:h:R = 4:3:5', C: 'r:h:R = 5:12:13', D: 'r:h:R = 6:8:10' };
  const TRI_ORDER = ['A', 'B', 'C'];
  const PARAMS = {
    s2A: P('정육면체의 한 모서리 a', 2, 8, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    s2R: P('밑면의 반지름 r', 1, 6, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s2H: P('높이 h', 2, 9, 1, 6, { color: 'sky', format: (v) => v + ' cm' }),
    s2T: P('움직여 보기', 0, 1, 0.01, 0, { color: 'green', format: (v, s) => ((s && s.svMode2 === 'pour') ? (v < 0.02 ? '비어 있음' : v > 0.98 ? '3번 부음' : `${Math.min(3, Math.floor(v * 3 + 0.001) + (v * 3 % 1 > 0.0 ? 1 : 0))}번째 붓는 중`) : (v < 0.02 ? '합쳐진 정육면체' : v > 0.98 ? '모두 갈라 놓음' : Math.round(v * 100) + '%')) }),
    // sv2-2
    s2r: P('밑면의 반지름 r', 2, 6, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s2G: P('모선의 길이 R', 3, 12, 1, 5, { color: 'sky', hint: 'R은 r보다 커야 해요(작으면 r+1로 맞춰요)', format: (v) => v + ' cm' }),
    s2U: P('펼치기', 0, 1, 0.01, 0, { color: 'green', format: (v) => (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%') }),
    // sv2-3
    s3K: P('크기 배율 k', 1, 2, 1, 1, { color: 'amber', hint: '세 수 (r, h, R)를 k배 해요', format: (v) => `${v}배` }),
    // sv2-4
    s4K: P('큰 원뿔의 크기 k', 2, 5, 1, 3, { color: 'sky', format: (v) => `k = ${v}` }),
    s4J: P('자르는 위치 (작은 원뿔의 크기 j)', 1, 4, 1, 1, { color: 'amber', hint: '작은 원뿔은 큰 원뿔과 같은 모양이고 j/k 배예요', format: (v) => `j = ${v}` }),
    s4T: P('작은 원뿔 빼내기', 0, 1, 0.01, 0, { color: 'green', format: (v) => (v < 0.02 ? '붙어 있음' : v > 0.98 ? '빠짐' : Math.round(v * 100) + '%') }),
    // sv2-5
    s5K: P('큰 각뿔의 크기 k', 2, 4, 1, 3, { color: 'sky', format: (v) => `밑면 한 변 ${6 * v} cm` }),
    s5J: P('자르는 위치 (작은 각뿔의 크기 j)', 1, 3, 1, 1, { color: 'amber', hint: '각뿔대의 윗면은 한 변이 6j cm인 정사각형', format: (v) => `j = ${v}` }),
    s5T: P('펼치기', 0, 1, 0.01, 0, { color: 'green', format: (v) => (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%') })
  };
  const oneOf = (v, list, d) => (list.includes(v) ? v : d);

  /* ================================================================ sv2-1 뿔 = 기둥의 1/3 */
  function sv21() {
    const model = (s) => {
      const mode = s.svMode2 === 'pour' ? 'pour' : 'cube';
      const a = clamp(Math.round(s.s2A), 2, 8), r = clamp(Math.round(s.s2R), 1, 6), h = clamp(Math.round(s.s2H), 2, 9);
      if (mode === 'cube') {
        const cubeV = V(a * a * a), pyr = V((a * a * a) / 3);
        return { mode, a, cubeV, pyr, ans: pyr, big: cubeV, S: V(a * a), hh: a };
      }
      const cyl = V(0, r * r * h), cone = V(0, (r * r * h) / 3);
      return { mode, r, h, cyl, cone, ans: cone, big: cyl, S: V(0, r * r), hh: h };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, t = C.problem ? (M.mode === 'cube' ? 0.75 : 1) : C.t;
      if (M.mode === 'cube') {
        const hf = 1.6, V0 = v3(hf, hf, hf), dd = ease(t) * hf * 2.35;
        const faces = [
          { name: 'L', col: 'sky', pts: [v3(-hf, -hf, -hf), v3(-hf, hf, -hf), v3(-hf, hf, hf), v3(-hf, -hf, hf)], off: -dd },
          { name: 'B', col: 'green', pts: [v3(-hf, -hf, -hf), v3(hf, -hf, -hf), v3(hf, -hf, hf), v3(-hf, -hf, hf)], off: 0 },
          { name: 'K', col: 'violet', pts: [v3(-hf, -hf, -hf), v3(hf, -hf, -hf), v3(hf, hf, -hf), v3(-hf, hf, -hf)], off: dd }
        ];
        const bodies = faces.map((f) => {
          const polys = [{ pts: f.pts, tag: 'base' }];
          for (let i = 0; i < 4; i++) polys.push({ pts: [f.pts[i], f.pts[(i + 1) % 4], V0], tag: 'side' });
          const mesh = G.xfMesh(polyMesh(polys, centroid(f.pts.concat([V0]))), shiftT(D.hx(f.off)));
          return { mesh, fill: f.col, alpha: st === 3 && f.name === 'B' && C.review ? 0.42 : 0.24, edge: 'ink', edgeW: 2.2, f };
        });
        const pts = [];
        [-dd, 0, dd].forEach((o) => [-hf, hf].forEach((x) => [-hf, hf].forEach((y) => [-hf, hf].forEach((z) => pts.push(add3(v3(x, y, z), D.hx(o)))))));
        D.fit(pts, [], { l: 36, r: 36, t: 44, b: 40 });
        // 정육면체의 윤곽(갈라 놓기 전에만)
        const cornersAll = [];
        for (const x of [-hf, hf]) for (const y of [-hf, hf]) for (const z of [-hf, hf]) cornersAll.push(v3(x, y, z));
        if (t < 0.98) {
          const cm = polyMesh([{ pts: [cornersAll[0], cornersAll[1], cornersAll[3], cornersAll[2]] }], v3(0, 0, 0));
          void cm;
          const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
          E.forEach(([i, j]) => D.line(cornersAll[i], cornersAll[j], 'muted', 1.6, { dash: [5, 4], alpha: 0.55 * (1 - ease(t)) }));
        }
        D.bodies(bodies);
        // 공통 꼭짓점과 길이
        D.dot(V0, 'amber', 5.5);
        D.label(V0, '꼭짓점', { dir: { x: 1, y: -0.4 }, color: 'amber', size: 14, gap: 6 });
        D.elabel(v3(-hf, -hf, hf), v3(hf, -hf, hf), `a=${M.a}`, { side: { x: 0, y: 1 }, color: 'amber', size: 15 });
        if (!C.problem && t > 0.5) bodies.forEach((bd, k) => {
          const c = centroid(bd.f.pts.concat([V0])), q = add3(c, D.hx(bd.f.off));
          D.tag(q, `⅓a³ = ${plainVal(M.pyr)}`, { size: 14, dy: 22 });
        });
        if (!C.problem) D.tag(v3(0, hf, 0), t < 0.5 ? `정육면체 a³ = ${plainVal(M.cubeV)}` : `사각뿔 3개 = 정육면체 1개`, { dy: -62, size: 15, color: 'amber' });
        return;
      }
      // 원뿔 3번 붓기
      const u = 2.2 / Math.max(M.r, M.h * 0.5), ru = M.r * u, hu = M.h * u, gap = ru * 1.25;
      const xc = -(ru + gap / 2), xy = ru + gap / 2;
      const q = t * 3, k = Math.min(3, Math.floor(q + 1e-9)), fracq = q - Math.floor(q + 1e-9), nPour = t >= 0.999 ? 3 : k + (fracq > 0.001 ? 1 : 0);
      const coneFill = t >= 0.999 ? 0 : t <= 0.001 ? 1 : 1 - fracq;
      const water = t * hu;
      const coneM = revolveMesh([[0, 0], [ru, hu], [0, hu]], { O: v3(xc, 0, 0), N: 36, tags: ['side', 'top'] });
      const cylM = revolveMesh([[0, 0], [ru, 0], [ru, hu], [0, hu]], { O: v3(xy, 0, 0), N: 36, tags: ['bot', 'side', 'top'] });
      const pts = [v3(xc - ru, 0, -ru), v3(xy + ru, hu, ru), v3(xc - ru, hu, ru), v3(xy + ru, 0, -ru)];
      const bb = G.bboxOf(pts.map(D.P));
      D.fit(pts, [{ x: bb.x0, y: bb.y1 + 1.5 }], { l: 36, r: 36, t: 50, b: 44 });
      D.body({ mesh: cylM, fill: 'sky', alpha: 0.1, edge: 'ink', edgeW: 2.4 });
      if (water > 0.01) D.body({ mesh: revolveMesh([[0, 0], [ru * 0.98, 0], [ru * 0.98, water], [0, water]], { O: v3(xy, 0, 0), N: 36 }), fill: 'sky', alpha: 0.4, edge: 'sky', edgeW: 1.6, hidden: false });
      D.body({ mesh: coneM, fill: 'amber', alpha: 0.1, edge: 'ink', edgeW: 2.4 });
      if (coneFill > 0.01) {
        const qh = Math.cbrt(coneFill);
        D.body({ mesh: revolveMesh([[0, hu * (1 - qh)], [ru * qh * 0.98, hu], [0, hu]], { O: v3(xc, 0, 0), N: 36 }), fill: 'sky', alpha: 0.5, edge: 'sky', edgeW: 1.6, hidden: false });
      }
      D.elabel(v3(xc + ru, hu, 0), v3(xc + ru, 0, 0), `h=${M.h}`, { side: { x: 1, y: 0 }, color: 'amber', size: 15, gap: 10 });
      D.line(v3(xc, hu, 0), v3(xc + ru, hu, 0), 'amber', 2.4, {});
      D.tag(v3(xc + ru / 2, hu, 0), `r=${M.r}`, { dy: -11, size: 14, color: 'amber' });
      D.line(v3(xy, hu, 0), v3(xy + ru, hu, 0), 'amber', 2.4, {});
      D.tag(v3(xy + ru / 2, hu, 0), `r=${M.r}`, { dy: -11, size: 14, color: 'amber' });
      if (!C.problem) {
        D.label(v3(xc, 0, 0), `원뿔 ⅓πr²h = ${plainVal(M.cone)}`, { dir: { x: 0, y: 1 }, gap: 12, size: 14, color: 'ink' });
        D.label(v3(xy, 0, 0), `원기둥 πr²h = ${plainVal(M.cyl)}`, { dir: { x: 0, y: 1 }, gap: 12, size: 14, color: 'ink' });
        // 가로 막대: 부은 횟수
        const y0 = bb.y1 + 1.1, wTot = (xy + ru - (xc - ru)) * 0.8, x0 = (xc - ru + xy + ru) / 2 - wTot / 2;
        for (let i = 0; i < 3; i++) {
          const seg = clamp(q - i, 0, 1);
          b.path([{ x: x0 + (wTot * i) / 3, y: y0 }, { x: x0 + (wTot * (i + 1)) / 3, y: y0 }, { x: x0 + (wTot * (i + 1)) / 3, y: y0 + 0.5 }, { x: x0 + (wTot * i) / 3, y: y0 + 0.5 }], { close: true, color: 'muted', width: 1.6, alpha: 0.6 });
          if (seg > 0) b.path([{ x: x0 + (wTot * i) / 3, y: y0 }, { x: x0 + (wTot * (i + seg)) / 3, y: y0 }, { x: x0 + (wTot * (i + seg)) / 3, y: y0 + 0.5 }, { x: x0 + (wTot * i) / 3, y: y0 + 0.5 }], { close: true, fill: 'sky', fillAlpha: 0.7, color: null });
          b.text({ x: x0 + (wTot * (i + 0.5)) / 3, y: y0 + 0.25 }, `${i + 1}통`, { size: D.fs(14), color: 'ink', weight: 800 });
        }
        b.text({ x: x0 + wTot / 2, y: y0 }, `원뿔 ${nPour}통 = 원기둥의 ${nPour}/3`, { dy: -14, size: D.fs(15), color: 'amber', weight: 800 });
      }
    };
    return {
      id: 'sv2-1', title: '뿔은 기둥의 1/3', short: '뿔 = 기둥의 ⅓',
      question: '밑면과 높이가 같은 뿔과 기둥이 있어. 뿔 몇 개가 모이면 기둥 하나와 부피가 같아질까?',
      anim: { key: 's2T', dur: 7, label: '움직여 보기' }, cam0: { yaw: 28, pitch: 22 }, stepT: () => 1, thumbT: 0.8, problemT: 1,
      ctl: (s) => (s.svMode2 === 'pour' ? ['s2R', 's2H', 's2T'] : ['s2A', 's2T']),
      presets: () => [{ group: '실험', label: '정육면체 → 사각뿔 3개', apply: (st) => { st.svMode2 = 'cube'; st.s2T = 0; }, on: (st) => st.svMode2 !== 'pour' }, { label: '원뿔로 물 3번 붓기', apply: (st) => { st.svMode2 = 'pour'; st.s2T = 0; }, on: (st) => st.svMode2 === 'pour' }],
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
        `사각뿔의 부피 $=\\frac{1}{3}\\times${M.a}^3=${tx(M.pyr)}\\,\\mathrm{cm}^3$. 밑넓이 $S=${M.a}^2$, 높이 $h=${M.a}$이므로 $V=\\frac{1}{3}Sh$예요.`
      ] : [
        `원기둥의 부피는 $\\pi\\times${M.r}^2\\times${M.h}=${tx(M.cyl)}\\,\\mathrm{cm}^3$예요.`,
        `밑면과 높이가 같은 원뿔에 물을 가득 담아 원기둥에 부으면 3번에 가득 차요. 원뿔 3개 = 원기둥 1개예요.`,
        `원뿔의 부피 $=\\frac{1}{3}\\times${tx(M.cyl)}=${tx(M.cone)}\\,\\mathrm{cm}^3$, 즉 $V=\\frac{1}{3}Sh$예요.`
      ],
      view: (M) => ({
        guide: M.mode === 'cube'
          ? `<b>움직여 보기</b> 막대를 끌어 정육면체를 ${span('sky', '합동인 사각뿔 3개')}로 가로로 갈라 놓아 보세요. 세 뿔은 노란 꼭짓점을 함께 써요. 위 칩에서 <b>물 붓기</b>로도 확인해 볼 수 있어요.`
          : `<b>움직여 보기</b> 막대를 끌어 원뿔의 물을 원기둥에 부어 보세요. 3번 부으면 가득 차요. 위 칩에서 <b>정육면체</b> 실험으로도 확인해 볼 수 있어요.`,
        readouts: M.mode === 'cube'
          ? [rd('정육면체의 부피', plainVal(M.cubeV) + ' cm³', 'sky', 'a³'), rd('사각뿔 하나', plainVal(M.pyr) + ' cm³', 'amber', '⅓ × 정육면체'), rd('뿔 3개의 합', plainVal(vmul(M.pyr, 3)) + ' cm³', 'green')]
          : [rd('원기둥의 부피', plainVal(M.cyl) + ' cm³', 'sky', 'πr²h'), rd('원뿔의 부피', plainVal(M.cone) + ' cm³', 'amber', '⅓ × 원기둥'), rd('원뿔 3개의 합', plainVal(vmul(M.cone, 3)) + ' cm³', 'green')],
        formula: `<p>(뿔의 부피) $V=\\frac{1}{3}\\times S\\times h$ &nbsp; ($S$ 밑넓이, $h$ 높이)</p>`,
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
  function sv22() {
    const model = (s) => coneModel(clamp(Math.round(s.s2r), 2, 6), clamp(Math.round(s.s2G), 3, 12));
    const draw = (b, s, M, C) => {
      const { r, R, h } = M, sc = 4.6 / Math.max(R, 2 * r), ru = r * sc, hu = h * sc, Ru = R * sc, st = C.step;
      const sn = solidNet(circleBase(ru, 36), hu, 0, Array(36).fill(true), 18);
      const lvB = !C.review ? 1 : st === 1 ? 2 : 3, lvL = !C.review ? 1 : st === 1 ? 0 : st === 2 ? 2 : 3;
      const t = C.problem ? 0 : C.t;
      netScene(b, s, C, {
        sn, t, fitOpt: { l: 40, r: 40, t: 40, b: 40 },
        style: (pc) => roleStyle(pc.tag === 'lat' ? 'lat' : 'base', pc.tag === 'lat' ? lvL : lvB),
        labels: (ctx) => {
          const { D, tp } = ctx, vw = D.vw, A = sn.A, apex = sn.B[0], m = 18;
          // 모선 R: 뿌리 옆면의 왼쪽 모서리
          D.elabel(ctx.at(sn.root, apex), ctx.at(sn.root, A[m]), `R=${R}`, { side: { x: -1, y: 0 }, color: 'amber', size: 15, gap: 8 });
          // 밑면: 반지름 r
          const k = sn.bot;
          const c0 = ctx.at(k, centroid(A)), rim = ctx.at(k, A[27]);
          const front = tp[k].front;
          D.line(c0, rim, 'ink', 2.4, { dash: front ? undefined : [5, 4] });
          D.dot(c0, 'ink', 3.5);
          D.tag(mid3(c0, rim), `r=${r}`, { dy: front ? -12 : 14, size: 14, color: 'amber' });
          if (front && !C.problem) D.tag(c0, `πr²=${plainVal(M.S)}`, { dy: 16, size: 14 });
          // 호의 길이 = 밑면의 둘레
          if (!C.problem && ctx.e > 0.7) {
            const bm = mid3(ctx.at(sn.root, A[m]), ctx.at(sn.root, A[m + 1]));
            D.label(bm, `호 = 밑면의 둘레 2πr = ${plainVal(M.arc)}`, { dir: D.out(bm, ctx.at(sn.root, apex)), gap: 14, color: 'amber', size: 15 });
            const cs = sn.lat.map((idx) => ctx.at(idx, centroid(sn.net.pieces[idx].pts)));
            D.tag(centroid(cs), `옆넓이 πRr = ${plainVal(M.lat)}`, { size: 15 });
          }
        }
      });
    };
    return {
      id: 'sv2-2', title: '원뿔의 옆넓이 πRr', short: '원뿔 옆넓이',
      question: '원뿔의 옆면을 펼치면 어떤 모양이 될까? 그 모양의 반지름과 호의 길이는 원뿔의 어디와 같을까?',
      anim: { key: 's2U', dur: 5, label: '펼쳐 보기' }, cam0: { yaw: 28, pitch: 22 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['s2r', 's2G', 's2U'],
      init: (s) => { s.s2r = 3; s.s2G = 5; s.s2U = 0; },
      reroll: (s) => { s.s2r = rint(2, 6); s.s2G = rint(s.s2r + 1, Math.min(12, s.s2r * 3)); s.s2U = 0; },
      model, draw,
      check: (s) => { const M = model(s); let a = 0; const N = 4000, th = (2 * PI * M.r) / M.R; for (let i = 0; i < N; i++) a += 0.5 * M.R * M.R * (th / N); return { ans: PI * M.r * M.r + a, model: vnum(M.tot) }; },
      steps: (M) => [
        `밑면은 반지름 $${M.r}$인 원이에요. 밑넓이 $\\pi r^2=\\pi\\times${M.r}^2=${tx(M.S)}\\,\\mathrm{cm}^2$예요.`,
        `옆면을 펼치면 반지름이 모선 $R=${M.R}$이고 호의 길이가 밑면의 둘레 $2\\pi r=${tx(M.arc)}$인 부채꼴이에요. 넓이 $=\\frac{1}{2}\\times R\\times(\\text{호})=\\frac{1}{2}\\times${M.R}\\times${tx(M.arc)}=${tx(M.lat)}\\,\\mathrm{cm}^2$ ($=\\pi Rr$)예요.`,
        `(겉넓이) $=${tx(M.S)}+${tx(M.lat)}=${tx(M.tot)}\\,\\mathrm{cm}^2$ ($=\\pi r(r+R)$)예요.`
      ],
      view: (M) => ({
        guide: `<b>펼치기</b> 막대를 끌거나 ▶를 눌러 원뿔을 펼쳐 보세요. ${span('green', '옆면')}은 부채꼴이에요. <b>반지름 r</b>과 <b>모선 R</b>을 바꾸면 부채꼴의 모양이 어떻게 달라지는지 살펴보세요.`,
        readouts: [
          rd('밑넓이 πr²', plainVal(M.S) + ' cm²', 'sky'),
          rd('부채꼴의 호 2πr', plainVal(M.arc) + ' cm', 'amber', '밑면의 둘레'),
          rd('옆넓이 πRr', plainVal(M.lat) + ' cm²', 'green', `½ × ${M.R} × ${plainVal(M.arc)}`),
          rd('겉넓이', plainVal(M.tot) + ' cm²', 'amber', 'πr² + πRr')
        ],
        formula: `<p>(원뿔의 겉넓이) $=\\pi r^2+\\pi R r=\\pi r(r+R)$ &nbsp; ($r$ 밑면의 반지름, $R$ 모선의 길이)</p>`,
        rule: '원뿔의 옆면은 부채꼴: 반지름 = 모선 R, 호의 길이 = 밑면의 둘레 2πr',
        notes: notes('부채꼴의 반지름은 밑면의 반지름 $r$이 아니라 <b>모선 $R$</b>이에요.', '옆넓이는 $\\pi R r$이에요. 높이 $h$를 곱하지 않아요.')
      }),
      prob: (M) => {
        const wrongs = [
          [M.lat, '옆넓이만 구했어요. 밑넓이 $\\pi r^2$도 더해야 해요.'],
          [vadd(M.S, vmul(V(0, M.r * M.R), 2)), '옆넓이는 $\\pi Rr$이에요. 두 배로 계산했어요.'],
          [vadd(M.S, V(0, M.R * M.R)), '부채꼴 전체(반지름 $R$인 원)의 넓이를 썼어요. 부채꼴은 $\\frac{r}{R}$만큼이에요.'],
          [vadd(M.S, V(0, M.r * M.r)), '옆넓이를 $\\pi r^2$으로 계산했어요. 모선 $R$을 써야 해요.'],
          [vadd(V(0, 2 * M.r * M.r), M.lat), '밑면은 1개예요(뿔의 꼭대기에는 밑면이 없어요).']
        ];
        return { tag: '원뿔의 겉넓이', key: `${M.r}|${M.R}`, stem: `그림과 같이 밑면의 반지름이 $${M.r}\\,\\mathrm{cm}$이고 모선의 길이가 $${M.R}\\,\\mathrm{cm}$인 원뿔의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv2-3 원뿔 종합 (r, h, R) */
  function sv23() {
    const model = (s) => {
      const key = oneOf(s.svTri, TRI_ORDER, 'A'), k = clamp(Math.round(s.s3K), 1, 2), [r0, h0, R0] = TRI[key], r = r0 * k, h = h0 * k, R = R0 * k, mode = s.svMode === 'vol' ? 'vol' : 'surf';
      const S = V(0, r * r), lat = V(0, r * R), tot = vadd(S, lat), vol = V(0, (r * r * h) / 3);
      return { key, k, r, h, R, mode, S, lat, tot, vol, ans: mode === 'vol' ? vol : tot };
    };
    const draw = (b, s, M, C) => {
      const sc = 4.4 / Math.max(M.h, 1.6 * M.r), ru = M.r * sc, hu = M.h * sc, Ru = M.R * sc, D = scene3(b, s, C), st = C.step;
      const mesh = revolveMesh([[0, 0], [ru, 0], [0, hu]], { O: v3(0, -hu / 2, 0), N: 44, tags: ['bot', 'side'] });
      const yawR = (D.cam.cy >= 0 ? Math.atan2(D.cam.sy, D.cam.cy) : 0), yaw = Math.atan2(D.cam.sy, D.cam.cy);
      void yawR;
      const thL = PI - yaw, thR = -yaw, pb = (th, rr, y) => v3(rr * Math.cos(th), y, rr * Math.sin(th));
      const y0 = -hu / 2, apex = v3(0, y0 + hu, 0), c0 = v3(0, y0, 0);
      D.fit([pb(thL, ru, y0), pb(thR, ru, y0), apex, v3(0, y0, ru), v3(0, y0, -ru)], [], { l: 44, r: 44, t: 40, b: 40 });
      const lvB = !C.review ? (M.mode === 'surf' ? 1 : 2) : M.mode === 'surf' ? (st === 1 ? 2 : 1) : (st === 1 ? 2 : 1), lvL = !C.review ? 1 : M.mode === 'surf' ? (st === 2 ? 2 : 1) : 1;
      D.body({ mesh, fill: 'sky', alpha: 0.2, faceStyle: (f) => (f.tag === 'bot' && lvB === 2 ? { fill: 'amber', alpha: 0.4 } : f.tag === 'side' && lvL === 2 ? { fill: 'amber', alpha: 0.3 } : f.tag === 'side' ? { fill: 'green', alpha: 0.2 } : {}) });
      // 높이 h (점선) + 직각 표시
      D.line(c0, apex, 'amber', 2.8, { dash: [6, 5] });
      D.right(c0, pb(thR, 1, 0), v3(0, 1, 0), Math.min(0.32, ru * 0.25), 'amber');
      D.tag(mid3(c0, apex), `h=${M.h}`, { dx: -22, size: 15, color: 'amber' });
      // 반지름 r
      const rp = pb(thR, ru, y0);
      D.line(c0, rp, 'ink', 2.6);
      D.dot(c0, 'ink', 3.5);
      D.tag(mid3(c0, rp), `r=${M.r}`, { dy: 14, size: 15 });
      // 모선 R (오른쪽 윤곽)
      D.elabel(rp, apex, `R=${M.R}`, { side: { x: 1, y: 0 }, size: 15, gap: 8 });
      if (!C.problem) {
        D.tag(add3(c0, v3(0, 0, 0)), M.mode === 'surf' ? `πr²=${plainVal(M.S)}` : `S=${plainVal(M.S)}`, { dy: 36, size: 14, color: 'ink' });
        if (M.mode === 'surf') D.tag(mid3(mid3(rp, apex), v3(0, y0 + hu * 0.4, 0)), `πRr=${plainVal(M.lat)}`, { size: 14, dx: -6, dy: -4 });
        else D.tag(v3(0, y0 + hu * 0.35, 0), `V=⅓Sh`, { size: 14, color: 'green', dx: -8 });
      }
    };
    return {
      id: 'sv2-3', title: '원뿔 종합', short: '원뿔 종합',
      question: '반지름 r, 높이 h, 모선 R이 모두 주어진 원뿔의 겉넓이와 부피를 구할 때 어떤 길이를 어디에 쓸까?',
      cam0: { yaw: 28, pitch: 20 }, problemT: 1,
      ctl: () => ['s3K'],
      presets: (s) => TRI_ORDER.map((k, i) => ({ group: i === 0 ? '(r, h, R)의 모양' : '', label: TRI_LABEL[k], apply: (st) => { st.svTri = k; }, on: (st) => oneOf(st.svTri, TRI_ORDER, 'A') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }]),
      init: (s) => { s.svTri = 'A'; s.s3K = 1; s.svMode = 'surf'; },
      reroll: (s) => { s.svTri = pick(TRI_ORDER, s.svTri); s.s3K = 1; s.svMode = pick(['surf', 'vol'], s.svMode); },
      model, draw,
      check: (s) => {
        const M = model(s);
        if (Math.abs(M.r * M.r + M.h * M.h - M.R * M.R) > 1e-9) return { ans: -1, model: 0 };
        if (M.mode === 'vol') { let sum = 0; const n = 4000; for (let i = 0; i < n; i++) { const y = ((i + 0.5) / n) * M.h, rr = (M.r * y) / M.h; sum += PI * rr * rr * (M.h / n); } return { ans: sum, model: vnum(M.vol) }; }
        let lat = 0; const n = 4000; for (let i = 0; i < n; i++) { const y0 = (i / n) * M.h, y1 = ((i + 1) / n) * M.h; const r0 = (M.r * y0) / M.h, r1 = (M.r * y1) / M.h; lat += PI * (r0 + r1) * Math.hypot(r1 - r0, y1 - y0); }
        return { ans: PI * M.r * M.r + lat, model: vnum(M.tot) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `밑면은 반지름 $${M.r}$인 원이에요. 밑넓이 $S=\\pi\\times${M.r}^2=${tx(M.S)}\\,\\mathrm{cm}^2$예요.`,
        `부피에는 꼭짓점에서 밑면까지의 수직 거리인 높이 $h=${M.h}$를 써요. (모선 $R=${M.R}$는 쓰지 않아요.)`,
        `(부피) $=\\frac{1}{3}\\times S\\times h=\\frac{1}{3}\\times${tx(M.S)}\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ] : [
        `밑넓이 $\\pi r^2=\\pi\\times${M.r}^2=${tx(M.S)}\\,\\mathrm{cm}^2$예요.`,
        `겉넓이에는 모선 $R=${M.R}$를 써요. 옆넓이 $\\pi Rr=\\pi\\times${M.R}\\times${M.r}=${tx(M.lat)}\\,\\mathrm{cm}^2$예요. (높이 $h$는 쓰지 않아요.)`,
        `(겉넓이) $=${tx(M.S)}+${tx(M.lat)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `위 칩에서 <b>(r, h, R) 모양</b>과 <b>겉넓이/부피</b>를 골라 보세요. ${span('amber', '높이 h')}는 수직으로 내린 점선, <b>모선 R</b>은 비스듬한 변이에요. 겉넓이에는 <b>R</b>, 부피에는 <b>h</b>를 써요.`,
        readouts: [
          rd('반지름 r', M.r + ' cm', 'ink'), rd('높이 h', M.h + ' cm', 'amber'), rd('모선 R', M.R + ' cm', 'sky'),
          rd('겉넓이 πr(r+R)', plainVal(M.tot) + ' cm²', M.mode === 'surf' ? 'green' : 'muted'), rd('부피 ⅓πr²h', plainVal(M.vol) + ' cm³', M.mode === 'vol' ? 'green' : 'muted')
        ],
        formula: `<p>(겉넓이) $=\\pi r^2+\\pi R r$ &nbsp;,&nbsp; (부피) $=\\frac{1}{3}\\pi r^2 h$</p>`,
        rule: '겉넓이는 모선 R, 부피는 높이 h',
        notes: notes('겉넓이에 높이 $h$를, 부피에 모선 $R$를 쓰는 실수가 많아요. <b>수직인 점선이 $h$, 비스듬한 변이 $R$</b>이에요.', '부피에는 $\\frac{1}{3}$을 꼭 곱해요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        const base = `밑면의 반지름이 $${M.r}\\,\\mathrm{cm}$, 높이가 $${M.h}\\,\\mathrm{cm}$, 모선의 길이가 $${M.R}\\,\\mathrm{cm}$인 원뿔`;
        if (M.mode === 'vol') {
          wrongs = [[vmul(M.vol, 3), '$\\frac{1}{3}$을 곱하지 않았어요.'], [V(0, (M.r * M.r * M.R) / 3), '부피에는 높이 $h$를 써요. 모선 $R$를 썼어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$이 아니라 $\\frac{1}{2}$을 곱했어요.'], [V(0, (M.r * M.h) / 3), '밑넓이는 $\\pi r^2$이에요.'], [M.tot, '겉넓이를 구했어요.']];
          stem = `그림과 같이 ${base}의 부피는?`;
        } else {
          wrongs = [[vadd(M.S, V(0, M.r * M.h)), '옆넓이에는 모선 $R$를 써요. 높이 $h$를 썼어요.'], [M.lat, '옆넓이만 구했어요. 밑넓이도 더해야 해요.'], [vmul(M.vol, 1), '부피를 구했어요.'], [vadd(M.S, V(0, M.R * M.h)), '옆넓이는 $\\pi Rr$이에요.'], [vadd(vmul(M.S, 2), M.lat), '밑면은 1개예요.']];
          stem = `그림과 같이 ${base}의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '원뿔의 부피 (종합)' : '원뿔의 겉넓이 (종합·함정: h와 R)', key: `${M.mode}|${M.key}|${M.k}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  /* ================================================================ sv2-4 원뿔대 (큰 뿔 − 작은 뿔) */
  function sv24() {
    const model = (s) => {
      const fam = oneOf(s.svTri4, TRI_ORDER, 'A'), [a, c, d] = TRI[fam], k = clamp(Math.round(s.s4K), 2, 5), j = clamp(Math.round(s.s4J), 1, k - 1), mode = s.svMode === 'vol' ? 'vol' : 'surf';
      const r2 = a * k, h2 = c * k, R2 = d * k, r1 = a * j, h1 = c * j, R1 = d * j, hf = h2 - h1, Rf = R2 - R1;
      const lat2 = V(0, r2 * R2), lat1 = V(0, r1 * R1), latF = vsub(lat2, lat1), top = V(0, r1 * r1), bot = V(0, r2 * r2), surf = vadd(latF, vadd(top, bot));
      const v2 = V(0, (r2 * r2 * h2) / 3), v1 = V(0, (r1 * r1 * h1) / 3), vol = vsub(v2, v1);
      return { fam, k, j, r2, h2, R2, r1, h1, R1, hf, Rf, lat2, lat1, latF, top, bot, surf, v2, v1, vol, mode, ans: mode === 'vol' ? vol : surf };
    };
    const draw = (b, s, M, C) => {
      const sc = 4.8 / Math.max(M.h2, 2.2 * M.r2), r2 = M.r2 * sc, r1 = M.r1 * sc, h2 = M.h2 * sc, h1 = M.h1 * sc, hf = M.hf * sc, st = C.step;
      const t = C.problem ? 0.62 : C.t, D = scene3(b, s, C);
      const slide = ease(t) * (r1 * 2.4 + 0.5);
      const yaw = Math.atan2(D.cam.sy, D.cam.cy), thL = PI - yaw, thR = -yaw, pb = (th, rr, y) => v3(rr * Math.cos(th), y, rr * Math.sin(th));
      const y0 = -h2 / 2, yc = y0 + hf;
      const frM = revolveMesh([[0, 0], [r2, 0], [r1, hf], [0, hf]], { O: v3(0, y0, 0), N: 44, tags: ['bot', 'side', 'top'] });
      const smM = G.xfMesh(revolveMesh([[0, 0], [r1, 0], [0, h1]], { O: v3(0, yc, 0), N: 44, tags: ['bot', 'side'] }), shiftT(D.hx(slide)));
      D.fit([pb(thL, r2, y0), pb(thR, r2, y0), v3(0, y0 + h2, 0), add3(pb(thR, r1, yc), D.hx(slide)), add3(pb(thL, r1, yc), D.hx(slide)), add3(v3(0, yc + h1, 0), D.hx(slide)), add3(v3(0, yc + h1, 0), D.hx(slide * 0.0)), v3(0, y0, r2), v3(0, y0, -r2)], [], { l: 52, r: 52, t: 40, b: 44 });
      const lvF = !C.review ? 1 : st === 1 ? 0 : st === 3 ? 2 : st === 4 ? 2 : 1;
      // 큰 원뿔의 윤곽(작은 뿔이 빠지기 전: 점선)
      if (t < 0.98) {
        D.line(pb(thL, r2, y0), v3(0, y0 + h2, 0), 'muted', 1.8, { dash: [5, 4], alpha: 0.7 * (1 - ease(t)) });
        D.line(pb(thR, r2, y0), v3(0, y0 + h2, 0), 'muted', 1.8, { dash: [5, 4], alpha: 0.7 * (1 - ease(t)) });
      }
      const big = C.review && ((M.mode === 'surf' && st === 1) || (M.mode === 'vol' && st === 1)), sm = C.review && st === 2;
      D.body({ mesh: frM, fill: lvF === 2 ? 'amber' : 'sky', alpha: lvF === 2 ? 0.34 : 0.22, edge: 'ink', edgeW: 2.6, faceStyle: (f) => (f.tag === 'bot' || f.tag === 'top' ? { fill: C.review && st === 4 ? 'amber' : 'sky', alpha: C.review && st === 4 ? 0.42 : 0.24 } : {}) });
      D.body({ mesh: smM, fill: sm || big ? 'amber' : 'violet', alpha: sm ? 0.42 : 0.24, edge: 'ink', edgeW: 2.6 });
      // 길이: 큰 뿔 r₂·R₂, 작은 뿔 r₁·R₁
      const cb = v3(0, y0, 0), rpB = pb(thR, r2, y0);
      D.line(cb, rpB, 'ink', 2.4, { dash: [5, 4] });
      D.tag(mid3(cb, rpB), `r₂=${M.r2}`, { dy: 14, size: 14 });
      const ctop = v3(0, yc, 0), rpT = pb(thR, r1, yc);
      D.line(ctop, rpT, 'ink', 2.4, { dash: [5, 4] });
      D.tag(mid3(ctop, rpT), `r₁=${M.r1}`, { dy: -12, size: 14 });
      D.elabel(pb(thL, r2, y0), pb(thL, r1, yc), `R₂−R₁=${M.Rf}`, { side: { x: -1, y: 0 }, size: 14, gap: 8, color: 'amber' });
      const sh = D.hx(slide);
      D.elabel(add3(pb(thR, r1, yc), sh), add3(v3(0, yc + h1, 0), sh), `R₁=${M.R1}`, { side: { x: 1, y: 0 }, size: 15, gap: 8, color: 'violet' });
      D.tag(add3(v3(0, yc + h1 * 0.38, 0), sh), `h₁=${M.h1}`, { size: 13, color: 'violet' });
      const ey = (D.P(v3(0, y0, r2)).y - D.P(v3(0, y0, 0)).y) * (b.k || 40);
      D.tag(v3(0, y0, 0), `큰 원뿔  r₂=${M.r2}  h₂=${M.h2}  R₂=${M.R2}`, { dy: ey + 22, size: 14 });
      if (!C.problem) D.tag(v3(0, y0 + hf * 0.45, 0), M.mode === 'surf' ? `πR₂r₂−πR₁r₁` : `V₂−V₁`, { size: 14, color: 'green' });
    };
    return {
      id: 'sv2-4', title: '원뿔대', short: '원뿔대',
      question: '원뿔의 윗부분을 잘라 내고 남은 원뿔대의 겉넓이와 부피는 큰 원뿔과 작은 원뿔로 어떻게 구할까?',
      anim: { key: 's4T', dur: 4, label: '작은 원뿔 빼내기' }, cam0: { yaw: 28, pitch: 20 }, stepT: (st) => (st >= 2 ? 1 : 0.55), thumbT: 0.7, problemT: 0.62,
      ctl: () => ['s4K', 's4J', 's4T'],
      presets: () => TRI_ORDER.map((k, i) => ({ group: i === 0 ? '(r, h, R)의 모양' : '', label: TRI_LABEL[k], apply: (st) => { st.svTri4 = k; }, on: (st) => oneOf(st.svTri4, TRI_ORDER, 'A') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }]),
      init: (s) => { s.svTri4 = 'A'; s.s4K = 3; s.s4J = 1; s.s4T = 0.0; s.svMode = 'surf'; },
      reroll: (s) => { s.svTri4 = pick(TRI_ORDER, s.svTri4); s.s4K = rint(2, s.svTri4 === 'C' ? 3 : 4); s.s4J = rint(1, s.s4K - 1); s.svMode = pick(['surf', 'vol'], s.svMode); s.s4T = 0; },
      model, draw,
      check: (s) => {
        const M = model(s), n = 4000;
        if (M.mode === 'vol') { let sum = 0; for (let i = 0; i < n; i++) { const y = M.h1 + ((i + 0.5) / n) * M.hf, rr = (M.r2 * y) / M.h2; sum += PI * rr * rr * (M.hf / n); } return { ans: sum, model: vnum(M.vol) }; }
        let lat = 0; const slope = (M.r2 - M.r1) / M.hf; for (let i = 0; i < n; i++) { const y0 = (i / n) * M.hf, y1 = ((i + 1) / n) * M.hf, r0 = M.r1 + slope * y0, rr1 = M.r1 + slope * y1; lat += PI * (r0 + rr1) * Math.hypot(rr1 - r0, y1 - y0); }
        return { ans: lat + PI * M.r1 * M.r1 + PI * M.r2 * M.r2, model: vnum(M.surf) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `큰 원뿔(반지름 $${M.r2}$, 높이 $${M.h2}$)의 부피 $V_2=\\frac{1}{3}\\times\\pi\\times${M.r2}^2\\times${M.h2}=${tx(M.v2)}$예요.`,
        `잘라 낸 작은 원뿔(반지름 $${M.r1}$, 높이 $${M.h1}$)의 부피 $V_1=\\frac{1}{3}\\times\\pi\\times${M.r1}^2\\times${M.h1}=${tx(M.v1)}$예요.`,
        `(원뿔대의 부피) $=V_2-V_1=${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ] : [
        `큰 원뿔의 옆넓이 $\\pi R_2r_2=\\pi\\times${M.R2}\\times${M.r2}=${tx(M.lat2)}$예요.`,
        `잘라 낸 작은 원뿔의 옆넓이 $\\pi R_1r_1=\\pi\\times${M.R1}\\times${M.r1}=${tx(M.lat1)}$예요.`,
        `원뿔대의 옆넓이 $=$ 큰 것 $-$ 작은 것 $=${tx(M.lat2)}-${tx(M.lat1)}=${tx(M.latF)}$예요.`,
        `(겉넓이) $=$ (옆넓이) $+$ (윗면) $+$ (아랫면) $=${tx(M.latF)}+${tx(M.top)}+${tx(M.bot)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `<b>작은 원뿔 빼내기</b> 막대를 끌어 보세요. 작은 원뿔이 ${span('violet', '가로로')} 빠져나가요. <b>k·j 막대</b>로 큰 원뿔과 자르는 위치를 바꾸면 작은 원뿔은 큰 원뿔의 $\\frac{j}{k}$배예요.`,
        readouts: M.mode === 'vol'
          ? [rd('큰 원뿔 V₂', plainVal(M.v2) + ' cm³', 'sky'), rd('작은 원뿔 V₁', plainVal(M.v1) + ' cm³', 'violet'), rd('원뿔대의 부피', plainVal(M.vol) + ' cm³', 'green', 'V₂ − V₁')]
          : [rd('큰 원뿔 옆넓이', plainVal(M.lat2) + ' cm²', 'sky', 'πR₂r₂'), rd('작은 원뿔 옆넓이', plainVal(M.lat1) + ' cm²', 'violet', 'πR₁r₁'), rd('원뿔대의 옆넓이', plainVal(M.latF) + ' cm²', 'amber', '큰 것 − 작은 것'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'green', '옆넓이 + 두 밑면')],
        formula: `<p>(원뿔대의 부피) $=$ (큰 뿔) $-$ (작은 뿔) &nbsp;,&nbsp; (겉넓이) $=$ (큰 뿔의 옆넓이 $-$ 작은 뿔의 옆넓이) $+$ (두 밑면)</p>`,
        rule: '원뿔대 = 큰 원뿔 − 작은 원뿔 (겉넓이는 두 밑면을 꼭 더해요)',
        notes: notes('원뿔대의 겉넓이에는 <b>위·아래 두 밑면</b>이 모두 들어가요. 작은 원뿔을 잘라 낸 자리(윗면)도 밑면이에요.', '뺄 것은 <b>옆넓이끼리</b>예요. 밑넓이까지 빼지 않아요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        const base = `밑면의 반지름이 $${M.r2}\\,\\mathrm{cm}$, 윗면의 반지름이 $${M.r1}\\,\\mathrm{cm}$인 원뿔대(큰 원뿔의 높이 $${M.h2}\\,\\mathrm{cm}$, 모선 $${M.R2}\\,\\mathrm{cm}$, 잘라 낸 작은 원뿔의 높이 $${M.h1}\\,\\mathrm{cm}$, 모선 $${M.R1}\\,\\mathrm{cm}$)`;
        if (M.mode === 'vol') {
          wrongs = [[vadd(M.v2, M.v1), '작은 원뿔은 더하지 않고 빼요.'], [M.v2, '큰 원뿔의 부피예요. 작은 원뿔을 빼야 해요.'], [vmul(vsub(V(0, M.r2 * M.r2 * M.h2), V(0, M.r1 * M.r1 * M.h1)), 1), '$\\frac{1}{3}$을 곱하지 않았어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.'], [V(0, (M.r2 * M.r2 - M.r1 * M.r1) * M.hf / 3 + 0), '높이는 큰 원뿔의 높이를 써서 각각 구한 뒤 빼야 해요(원뿔대의 높이에 밑넓이의 차를 곱하면 안 돼요).']];
          stem = `그림과 같이 ${base}의 부피는?`;
        } else {
          wrongs = [[vadd(M.latF, M.bot), '윗면(작은 원)을 빠뜨렸어요.'], [M.latF, '옆넓이만 구했어요. 위·아래 두 밑면도 더해야 해요.'], [vadd(M.lat2, vadd(M.top, M.bot)), '큰 원뿔의 옆넓이를 그대로 썼어요. 작은 원뿔의 옆넓이를 빼야 해요.'], [vadd(vsub(M.lat2, M.lat1), vsub(M.bot, M.top)), '밑면은 빼지 않고 더해요.'], [vadd(vadd(M.lat2, M.lat1), vadd(M.top, M.bot)), '작은 원뿔의 옆넓이는 더하지 않고 빼요.']];
          stem = `그림과 같이 ${base}의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '원뿔대의 부피' : '원뿔대의 겉넓이 (함정: 두 밑면)', key: `${M.mode}|${M.fam}|${M.k}|${M.j}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  /* ================================================================ sv2-5 각뿔·각뿔대 (정사각, 전개도) */
  function sv25() {
    const model = (s) => {
      const kind = s.svKind5 === 'pyr' ? 'pyr' : 'frus', k = clamp(Math.round(s.s5K), 2, 4), j = kind === 'frus' ? clamp(Math.round(s.s5J), 1, k - 1) : 0, mode = s.svMode === 'vol' ? 'vol' : 'surf';
      const a2 = 6 * k, h2 = 4 * k, l2 = 5 * k, a1 = 6 * j, h1 = 4 * j, l1 = 5 * j, hf = h2 - h1, lf = l2 - l1;
      const bot = V(a2 * a2), top = V(a1 * a1), lat = V(2 * (a1 + a2) * lf), tot = vadd(vadd(bot, top), lat);
      const v2 = V((a2 * a2 * h2) / 3), v1 = V((a1 * a1 * h1) / 3), vol = vsub(v2, v1);
      return { kind, k, j, mode, a2, h2, l2, a1, h1, l1, hf, lf, bot, top, lat, tot, v2, v1, vol, ans: mode === 'vol' ? vol : tot };
    };
    const draw = (b, s, M, C) => {
      const sc = 4.6 / Math.max(M.a2, M.h2 * 1.1), a2 = M.a2 * sc, a1 = M.a1 * sc, hf = M.hf * sc, st = C.step;
      const base = [[-a2 / 2, -a2 / 2], [a2 / 2, -a2 / 2], [a2 / 2, a2 / 2], [-a2 / 2, a2 / 2]];
      const scale = M.kind === 'pyr' ? 0 : M.a1 / M.a2;
      const sn = solidNet(base, hf, scale, null, 0);
      const lvB = !C.review ? 1 : M.mode === 'surf' ? (st === 1 ? 2 : 3) : (st === 3 ? 2 : 1), lvL = !C.review ? 1 : M.mode === 'surf' ? (st === 1 ? 0 : st === 2 ? 2 : 3) : 1;
      const t = C.problem ? 0 : C.t;
      netScene(b, s, C, {
        sn, t, fitOpt: { l: 40, r: 40, t: 40, b: 40 },
        style: (pc) => roleStyle(pc.tag === 'lat' ? 'lat' : 'base', pc.tag === 'lat' ? lvL : lvB),
        labels: (ctx) => {
          const { D, tp } = ctx, vw = D.vw, A = sn.A, B = sn.B;
          sn.lat.forEach((idx, k) => {
            if (dot3(tp[idx].n, vw) < 0.35) return;
            const bm = mid3(A[k], A[(k + 1) % 4]), tm = M.kind === 'pyr' ? B[0] : mid3(B[k], B[(k + 1) % 4]);
            D.tag(ctx.at(idx, lerp3(bm, tm, 0.14)), `${M.a2}`, { size: 14 });
            if (M.kind === 'frus') D.tag(ctx.at(idx, lerp3(bm, tm, 0.88)), `${M.a1}`, { size: 14 });
            if (idx === sn.root || (ctx.e > 0.5 && k === 0)) {
              D.line(ctx.at(idx, bm), ctx.at(idx, tm), 'amber', 2.6, { dash: [5, 4] });
              D.tag(ctx.at(idx, lerp3(bm, tm, 0.5)), `${M.lf}`, { size: 15, color: 'amber', dx: 12 });
              D.right(ctx.at(idx, bm), sub3(ctx.at(idx, A[(k + 1) % 4]), ctx.at(idx, A[k])), sub3(ctx.at(idx, tm), ctx.at(idx, bm)), 0.24, 'amber');
            }
          });
          // 밑면 넓이
          [sn.bot, sn.top].forEach((k) => {
            if (k < 0) return;
            if (dot3(tp[k].n, vw) < 0.3) return;
            const isTop = k === sn.top, pts = sn.net.pieces[k].pts;
            if (!C.problem) D.tag(ctx.at(k, centroid(pts)), `${isTop ? M.a1 : M.a2}²=${plainVal(isTop ? M.top : M.bot)}`, { size: 14 });
            else D.tag(ctx.at(k, centroid(pts)), `${isTop ? M.a1 : M.a2}`, { size: 14 });
          });
          if (M.mode === 'vol' && ctx.e < 0.5) {
            const cB = centroid(sn.A), cT = M.kind === 'pyr' ? sn.B[0] : centroid(sn.B);
            D.line(cB, cT, 'amber', 2.6, { dash: [6, 5] });
            D.tag(mid3(cB, cT), `h=${M.hf}`, { size: 15, color: 'amber', dx: 16 });
          }
        }
      });
    };
    return {
      id: 'sv2-5', title: '각뿔·각뿔대', short: '각뿔대',
      question: '정사각뿔과 정사각뿔대를 펼치면 옆면은 어떤 모양이 될까? 옆면의 높이(5, 10, …)는 어디에 쓸까?',
      anim: { key: 's5T', dur: 5, label: '펼쳐 보기' }, cam0: { yaw: 28, pitch: 24 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: (s) => (s.svKind5 === 'pyr' ? ['s5K', 's5T'] : ['s5K', 's5J', 's5T']),
      presets: () => [{ group: '입체', label: '정사각뿔대', apply: (st) => { st.svKind5 = 'frus'; if (st.s5J >= st.s5K) st.s5J = st.s5K - 1; }, on: (st) => st.svKind5 !== 'pyr' }, { label: '정사각뿔', apply: (st) => { st.svKind5 = 'pyr'; }, on: (st) => st.svKind5 === 'pyr' }, { group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }],
      init: (s) => { s.svKind5 = 'frus'; s.s5K = 3; s.s5J = 1; s.s5T = 0; s.svMode = 'surf'; },
      reroll: (s) => { s.svKind5 = pick(['pyr', 'frus'], s.svKind5); s.s5K = rint(2, 4); s.s5J = rint(1, s.s5K - 1); s.svMode = pick(['surf', 'vol'], s.svMode); s.s5T = 0; },
      model, draw,
      check: (s) => {
        const M = model(s), n = 3000;
        if (M.mode === 'vol') { let sum = 0; for (let i = 0; i < n; i++) { const y = M.h1 + ((i + 0.5) / n) * M.hf, side = (M.a2 * y) / M.h2; sum += side * side * (M.hf / n); } return { ans: sum, model: vnum(M.vol) }; }
        // 옆면 4개 = 사다리꼴(높이 lf, 위변 a1, 아랫변 a2)을 적분으로: 폭이 선형으로 변하는 띠
        let lat = 0; for (let i = 0; i < n; i++) { const f = (i + 0.5) / n, w = M.a1 + (M.a2 - M.a1) * f; lat += w * (M.lf / n); }
        return { ans: M.a2 * M.a2 + M.a1 * M.a1 + 4 * lat, model: vnum(M.tot) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `큰 각뿔(밑면 한 변 $${M.a2}$, 높이 $${M.h2}$)의 부피 $V_2=\\frac{1}{3}\\times${M.a2}^2\\times${M.h2}=${tx(M.v2)}$예요.`,
        M.kind === 'pyr' ? `각뿔이므로 잘라 낸 부분이 없어요. 부피는 $V_2$ 하나예요.` : `잘라 낸 작은 각뿔(한 변 $${M.a1}$, 높이 $${M.h1}$)의 부피 $V_1=\\frac{1}{3}\\times${M.a1}^2\\times${M.h1}=${tx(M.v1)}$예요.`,
        M.kind === 'pyr' ? `(부피) $=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.` : `(각뿔대의 부피) $=V_2-V_1=${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ] : [
        M.kind === 'pyr' ? `밑면은 정사각형 1개예요. 밑넓이 $${M.a2}^2=${tx(M.bot)}$예요.` : `밑면은 위·아래 정사각형 2개예요. $${M.a1}^2+${M.a2}^2=${tx(M.top)}+${tx(M.bot)}=${tx(vadd(M.top, M.bot))}$예요.`,
        M.kind === 'pyr' ? `옆면은 밑변 $${M.a2}$, 높이 $${M.lf}$인 삼각형 4개예요. $4\\times\\frac{1}{2}\\times${M.a2}\\times${M.lf}=${tx(M.lat)}$예요.` : `옆면은 윗변 $${M.a1}$, 아랫변 $${M.a2}$, 높이 $${M.lf}$인 사다리꼴 4개예요. $4\\times\\frac{1}{2}\\times(${M.a1}+${M.a2})\\times${M.lf}=${tx(M.lat)}$예요.`,
        `(겉넓이) $=${tx(vadd(M.top, M.bot))}+${tx(M.lat)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `위 칩에서 <b>정사각뿔대/정사각뿔</b>과 <b>겉넓이/부피</b>를 고르고 <b>펼치기</b>를 끌어 보세요. ${span('green', '옆면')}은 합동인 ${M.kind === 'pyr' ? '삼각형' : '사다리꼴'} 4개예요. 옆면의 ${span('amber', '높이')}(점선)를 넓이에 써요.`,
        readouts: M.mode === 'vol'
          ? [rd('큰 각뿔 V₂', plainVal(M.v2) + ' cm³', 'sky'), rd('작은 각뿔 V₁', plainVal(M.v1) + ' cm³', 'violet'), rd(M.kind === 'pyr' ? '부피' : '각뿔대의 부피', plainVal(M.vol) + ' cm³', 'green')]
          : [rd('밑면의 넓이 합', plainVal(vadd(M.top, M.bot)) + ' cm²', 'sky'), rd('옆면 1개의 넓이', plainVal(V(((M.a1 + M.a2) * M.lf) / 2)) + ' cm²', 'amber'), rd('옆넓이(4개)', plainVal(M.lat) + ' cm²', 'green'), rd('겉넓이', plainVal(M.tot) + ' cm²', 'amber')],
        formula: `<p>(각뿔대의 옆면 1개) $=\\frac{1}{2}\\times(\\text{윗변}+\\text{아랫변})\\times(\\text{높이})$ &nbsp;,&nbsp; (겉넓이) $=$ (두 밑면) $+$ (옆면 4개)</p>`,
        rule: '각뿔의 옆면은 삼각형, 각뿔대의 옆면은 사다리꼴 (높이는 옆면의 높이)',
        notes: notes('옆면의 높이(점선)는 각뿔대의 높이 $h$와 달라요. 옆면 사다리꼴의 높이를 써요.', '각뿔대의 겉넓이에는 위·아래 <b>두 밑면</b>이 모두 들어가요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        const shape = M.kind === 'pyr' ? `밑면이 한 변 $${M.a2}\\,\\mathrm{cm}$인 정사각형이고 옆면의 높이가 $${M.lf}\\,\\mathrm{cm}$, 높이가 $${M.hf}\\,\\mathrm{cm}$인 정사각뿔` : `아랫면이 한 변 $${M.a2}\\,\\mathrm{cm}$, 윗면이 한 변 $${M.a1}\\,\\mathrm{cm}$인 정사각형이고 옆면의 높이가 $${M.lf}\\,\\mathrm{cm}$, 높이가 $${M.hf}\\,\\mathrm{cm}$인 정사각뿔대(큰 각뿔의 높이 $${M.h2}\\,\\mathrm{cm}$, 잘라 낸 작은 각뿔의 높이 $${M.h1}\\,\\mathrm{cm}$)`;
        if (M.mode === 'vol') {
          wrongs = M.kind === 'pyr'
            ? [[vmul(M.vol, 3), '$\\frac{1}{3}$을 곱하지 않았어요.'], [V((M.a2 * M.a2 * M.lf) / 3), '부피에는 옆면의 높이가 아니라 높이 $h$를 써요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.'], [M.tot, '겉넓이를 구했어요.'], [vmul(M.vol, 2 / 3), '$\\frac{1}{3}$을 곱해야 해요.']]
            : [[vadd(M.v2, M.v1), '작은 각뿔은 더하지 않고 빼요.'], [M.v2, '큰 각뿔의 부피예요. 작은 각뿔을 빼야 해요.'], [V(((M.a2 * M.a2 - M.a1 * M.a1) * M.hf)), '$\\frac{1}{3}$을 곱하지 않았어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.'], [M.tot, '겉넓이를 구했어요.']];
          stem = `그림과 같이 ${shape}의 부피는?`;
        } else {
          wrongs = M.kind === 'pyr'
            ? [[vadd(M.bot, vmul(M.lat, 2)), '옆면은 삼각형이에요. $\\frac{1}{2}$을 곱해야 해요.'], [M.lat, '옆넓이만 구했어요. 밑넓이도 더해야 해요.'], [vadd(M.bot, V(2 * M.a2 * M.hf)), '옆면의 높이(점선)가 아니라 각뿔의 높이를 썼어요.'], [vadd(vmul(M.bot, 2), M.lat), '밑면은 1개예요.'], [V((M.a2 * M.a2 * M.hf) / 3), '부피를 구했어요.']]
            : [[vadd(M.bot, M.lat), '윗면(작은 정사각형)을 빠뜨렸어요.'], [M.lat, '옆넓이만 구했어요. 위·아래 두 밑면도 더해야 해요.'], [vadd(vadd(M.bot, M.top), vmul(M.lat, 2)), '옆면은 사다리꼴이에요. $\\frac{1}{2}$을 곱해야 해요.'], [vadd(vadd(M.bot, M.top), V(2 * (M.a1 + M.a2) * M.hf)), '옆면의 높이(점선)가 아니라 각뿔대의 높이를 썼어요.'], [vadd(vsub(M.bot, M.top), M.lat), '윗면은 빼지 않고 더해요.']];
          stem = `그림과 같이 ${shape}의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '각뿔(대)의 부피' : '각뿔(대)의 겉넓이 (함정: 옆면의 높이)', key: `${M.kind}|${M.mode}|${M.k}|${M.j}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  G.register(20, 't2', '② 뿔', '뿔', PARAMS, [sv21(), sv22(), sv23(), sv24(), sv25()]);
})();
