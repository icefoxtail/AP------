/* ==========================================================================
   중1 · 겉넓이와 부피 — 탭 ⑤ 「붙이고 파낸 입체」 (t5.js, order 50) — 장면 6개
   · sv5-1 구멍(관통, 안쪽 벽이 새로 생김) · sv5-2 막힌 구멍·사각 구멍 · sv5-3 모퉁이 절단(겉넓이 그대로)
   · sv5-4 모서리·가운데 홈(확장: 위치에 따라 달라짐) · sv5-5 원뿔 속 원뿔 · sv5-6 붙인 입체 종합(붙은 면 제외)
   핵심 생각: 파내거나 붙이면 「없어지는 겉면」과 「새로 생기는 겉면」이 생겨요. 둘을 따로 구해 빼고 더해요.
   모든 입체는 밑면이 아래로 서 있고, 움직임은 왼쪽 → 오른쪽 가로로만: 잘린 조각·붙인 입체·열리는 절반은 오른쪽으로 빠지고, 구멍 막대는 제자리에서 나타났다 사라져요. 조각 줄도 왼쪽에서 오른쪽으로 펼쳐져요.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SV;
  if (!G) return;
  const { cube8, PI, DEG, TAU, clamp, ease, seg01, lin01, v3, add3, sub3, mul3, lerp3, mid3, dot3, V, vadd, vsub, vmul, vnum, tx, plainVal, mkV, P, fmtN, pick, rint, notes, rd, span, scene3, revolveMesh, sphereProfile, xfMesh, shiftT, rotM, centroid, bboxOf, prismMesh, boxMesh, boxMinusBoxes, meshArea, flipMesh, polyMesh, layoutTiles, drawTiles } = G;

  const PARAMS = {
    s51A: P('정사각형의 한 변 a', 4, 10, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    s51H: P('기둥의 길이(높이) h', 1, 10, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    s51Q: P('구멍의 반지름 q', 1, 4, 1, 2, { color: 'red', hint: 'a의 절반보다 작아야 해요', format: (v) => v + ' cm', clampTo: (s) => [1, Math.min(4, Math.floor((Math.round(s.s51A) - 1) / 2))] }),
    s51T: P('뚫기 · 열기 · 분해', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '구멍 없음' : v < 0.25 ? '구멍 막대가 가로로 관통' : v < 0.55 ? '앞쪽 절반을 옆으로 열기' : v > 0.99 ? '분해 완료' : '조각을 가로로 늘어놓기') }),
    s52D: P('구멍의 깊이 d', 1, 9, 1, 3, { color: 'red', format: (v) => v + ' cm', clampTo: (s) => [1, Math.max(1, Math.round(s.s51H) - 1)] }),
    s52U: P('구멍의 크기', 1, 5, 1, 2, { color: 'red', format: (v) => v + ' cm', clampTo: (s) => [1, (s.svK52 || 'cb') === 'cb' ? Math.min(4, Math.floor((Math.round(s.s51A) - 1) / 2)) : Math.min(5, Math.round(s.s51A) - 2)] }),
    s52T: P('구멍 막대 · 조각 줄', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '구멍 없음' : v < 0.5 ? '구멍 막대가 가로로' : v > 0.99 ? '분해 완료' : '조각을 가로로 늘어놓기') }),
    s53A: P('정육면체의 한 모서리 a', 4, 10, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    s53P: P('잘라 내는 크기 p', 1, 8, 1, 2, { color: 'red', hint: 'p×p×p 정육면체를 잘라 내요', format: (v) => v + ' cm', clampTo: (s) => [1, (s.svCnt || 1) === 1 ? Math.round(s.s53A) - 1 : Math.floor((Math.round(s.s53A) - 1) / 2)] }),
    s53T: P('조각 빼내기 · 합동 확인', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '붙어 있음' : v < 0.3 ? '반짝이는 중' : v < 0.6 ? '가로로 빠지는 중' : v > 0.99 ? '합동 확인' : '타일이 가로로 겹치는 중') }),
    s54A: P('정육면체의 한 모서리 a', 4, 10, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    s54P: P('파낸 깊이 p (위쪽)', 1, 9, 1, 2, { color: 'red', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 1] }),
    s54Q: P('파낸 깊이 q (앞쪽)', 1, 9, 1, 2, { color: 'red', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 1] }),
    s54C: P('모서리를 따라 파낸 길이 c', 1, 8, 1, 3, { color: 'sky', hint: 'a보다 짧아야 양 끝이 남아요', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 2] }),
    s54W: P('홈의 폭 w', 1, 8, 1, 2, { color: 'sky', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 2] }),
    s54Z: P('홈의 깊이', 1, 9, 1, 2, { color: 'red', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 1] }),
    s54T: P('조각 빼내기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '붙어 있음' : v > 0.99 ? '빠짐' : Math.round(v * 100) + '%') }),
    s55K: P('큰 원뿔의 크기 k', 2, 5, 1, 4, { color: 'sky', format: (v) => `k = ${v}` }),
    s55J: P('파낸 원뿔의 크기 j', 1, 4, 1, 2, { color: 'red', hint: '파낸 원뿔은 큰 원뿔과 같은 모양이고 $\\frac{j}{k}$ 배예요', format: (v) => `j = ${v}`, clampTo: (s) => [1, Math.round(s.s55K) - 1] }),
    s55T: P('파낸 원뿔 빼내기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '구멍에 들어 있음' : v > 0.99 ? '빠짐' : Math.round(v * 100) + '%') }),
    s56A: P('아래 상자의 한 변 a', 4, 12, 1, 8, { color: 'amber', hint: '위 입체의 지름(2r)보다 커야 해요', format: (v) => v + ' cm', clampTo: (s) => [Math.max(4, 2 * Math.round(s.s56R)), 12] }),
    s56H: P('아래 상자의 높이', 2, 8, 1, 4, { color: 'sky', format: (v) => v + ' cm' }),
    s56R: P('위 입체의 반지름 r', 1, 5, 1, 3, { color: 'red', hint: '밑면의 반지름은 a의 절반 이하예요(원뿔은 3·4·6 cm)', format: (v) => v + ' cm', clampTo: (s) => { if (s.svTop === 'cone') { const r = Math.round(s.s56R), near = [3, 4, 6].reduce((p, q) => (Math.abs(q - r) < Math.abs(p - r) ? q : p)); return [near, near]; } return [1, 5]; } }),
    s56Z: P('위 원기둥의 높이', 1, 6, 1, 3, { color: 'red', format: (v) => v + ' cm' }),
    s56T: P('위 입체 떼어 놓기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '붙어 있음' : v > 0.99 ? '떼어 놓음' : Math.round(v * 100) + '%') })
  };
  const oneOf = (v, list, d) => (list.includes(v) ? v : d);
  const circPts = (c, u, v, r, n = 48) => { const o = []; for (let i = 0; i < n; i++) { const t = (TAU * i) / n; o.push(add3(c, add3(mul3(u, r * Math.cos(t)), mul3(v, r * Math.sin(t))))); } return o; };
  const ROT_X = (T) => T;
  void ROT_X;

  // 밑면이 아래로 서 있는 기둥을 x=0 평면으로 반씩 나눈 모양(가운데 세로 구멍)
  function holeHalvesUp(A, Hh, qu, N) {
    N = N || 16;
    const y0 = -Hh / 2, y1 = Hh / 2;
    const left = [[-A, -A], [0, -A], [0, -qu]], ls = [false, false, false];
    for (let i = 1; i < N; i++) { const a = -PI / 2 - (PI * i) / N; left.push([qu * Math.cos(a), qu * Math.sin(a)]); ls.push(true); }
    left.push([0, qu], [0, A], [-A, A]); ls.push(false, false, false);
    const right = [[0, -A], [A, -A], [A, A], [0, A], [0, qu]], rs = [false, false, false, false, false];
    for (let i = 1; i < N; i++) { const a = PI / 2 - (PI * i) / N; right.push([qu * Math.cos(a), qu * Math.sin(a)]); rs.push(true); }
    right.push([0, -qu]); rs.push(false);
    const tagger = (m) => { m.faces.forEach((f) => { if (f.pts.every((p) => Math.abs(p.x) < 1e-9)) f.tag = 'cut'; else if (f.tag === 'side' && f.pts.every((p) => Math.abs(Math.hypot(p.x, p.z) - qu) < 1e-6)) f.tag = 'wall'; }); return m; };
    return { left: tagger(prismMesh(left, y0, y1, { simple: true, smooth: ls })), right: tagger(prismMesh(right, y0, y1, { simple: true, smooth: rs })) };
  }
  // 타일을 왼쪽 끝에 모아 두었다가 오른쪽으로 가로로 펼칩니다(줄마다)
  function slideTiles(R, te) { R.rows.forEach((L) => { const st = -L.total / 2; L.tiles.forEach((tl) => { tl.x = st + (tl.x - st) * te; }); }); }
  const totalText = (D, R, topY, text) => { const px = D.b.toS({ x: 0, y: topY + R.height }); D.b.stext(px.x, px.y + 50, text, { size: D.fs(15), weight: 800, color: 'green', align: 'center', baseline: 'middle' }); };

  /* ================================================================ sv5-1 구멍 뚫린 입체 (Ⅳ-1) */
  function sv51() {
    const model = (s) => {
      const a = clamp(Math.round(s.s51A), 4, 10), h = clamp(Math.round(s.s51H), 1, 10), q = clamp(Math.round(s.s51Q), 1, Math.min(4, Math.floor((a - 1) / 2)));
      s.s51A = a; s.s51H = h; s.s51Q = q;
      const S0 = V(2 * a * a + 4 * a * h), minus = V(0, -2 * q * q), plus = V(0, 2 * q * h), delta = vadd(minus, plus), tot = vadd(S0, delta), trend = h > q ? 'up' : h < q ? 'down' : 'same';
      return { a, h, q, S0, minus, plus, delta, tot, trend, ans: tot };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, sc = 3.4 / Math.max(M.a, M.h * 0.9), A = (M.a * sc) / 2, Hh = M.h * sc, qu = M.q * sc, narrow = b.W < 560;
      const t = C.problem ? 0.3 : C.t, rodA = t < 0.3 ? Math.sin((PI * t) / 0.3) : 0, open = ease(lin01(t, 0.3, 0.6)), te = ease(lin01(t, 0.6, 0.95));
      const dMax = C.problem ? 0 : A * 2 + 0.9, dOpen = open * (A * 2 + 0.9), closed = open < 0.02, plain = t < 0.15 && !C.problem, y0 = -Hh / 2, y1 = Hh / 2;
      const hlOf = (k) => (!C.review ? 1 : st === k ? 2 : st === 4 ? 3 : 1);
      const t0 = { w: M.a, h: M.a, shape: 'hole', holeR: (M.q / M.a) * 0.5, count: 2, fill: 'sky', label: plainVal(V(M.a * M.a, -M.q * M.q)), cap: '뚫린 면 ×2', hl: hlOf(2) };
      const t1 = { w: M.a, h: M.h, shape: 'rect', count: 4, fill: 'sky', label: `${M.a * M.h}`, cap: '바깥 옆면 ×4', hl: hlOf(1) };
      const t2 = { w: 2 * PI * M.q, h: M.h, shape: 'rect', fill: 'amber', label: plainVal(M.plus), cap: '안쪽 옆면 2πq×h', hl: hlOf(3) };
      const R = C.problem ? null : G.layoutTileRows(narrow ? [[t0, t1], [t2]] : [[t0, t1, t2]], narrow ? 4.6 : 6.4, narrow ? 1.6 : 2.0, 0.7, 1.9);
      const pts = cube8(v3(0, 0, 0), Math.max(A, Hh / 2)).concat(cube8(D.hx(dMax), Math.max(A, Hh / 2)));
      const bb = bboxOf(pts.map(D.P));
      const blend = narrow && R ? ease(lin01(te, 0, 0.4)) : 0, rowTop = bb.y1 + 0.9;
      if (blend > 0) {
        const mix = (p, q) => p + (q - p) * blend;
        D.fit([], [{ x: mix(bb.x0, -R.total / 2), y: mix(bb.y0, rowTop) }, { x: mix(bb.x1, R.total / 2), y: mix(bb.y1, rowTop + R.height + 2.6) }], { l: 36, r: 36, t: 44, b: 40 });
      } else D.fit(pts, R && !narrow ? [{ x: -R.total / 2, y: rowTop }, { x: R.total / 2, y: rowTop + R.height + 2.6 }] : [], { l: 36, r: 36, t: 44, b: 40 });
      const showSolid = !(narrow && te > 0.35);
      const lvAll = !C.review ? 1 : st === 1 ? 2 : 1, lvWall = !C.review ? 1 : st === 3 ? 2 : 1;
      if (!showSolid) {
        // 휴대폰: 조각 줄이 펼쳐지는 동안 입체는 물러나요
      } else if (plain) {
        D.body({ mesh: boxMesh(-A, A, y0, y1, -A, A), fill: 'sky', alpha: 0.22, edge: 'ink' });
        [y0, y1].forEach((y) => D.path(D.circ(v3(0, y, 0), v3(1, 0, 0), v3(0, 0, 1), qu, 0, TAU, 60), 'red', 2.4, { dash: [6, 5], alpha: 0.85 }));
        [qu, -qu].forEach((xx) => D.line(v3(xx, y0, 0), v3(xx, y1, 0), 'red', 2, { dash: [6, 5], alpha: 0.7 }));
      } else {
        const { left, right } = holeHalvesUp(A, Hh, qu), rightM = xfMesh(right, shiftT(D.hx(dOpen)));
        const cutSkip = (m) => (e) => (closed && ((m.faces[e.f1] && m.faces[e.f1].tag === 'cut') || (m.faces[e.f2] && m.faces[e.f2].tag === 'cut')) ? { skip: true } : {});
        const sty = (f) => (f.tag === 'wall' ? { fill: 'amber', alpha: lvWall === 2 ? 0.55 : 0.34 } : f.tag === 'cut' ? (closed ? { skip: true } : { fill: 'sky', alpha: 0.12 }) : lvAll === 2 ? { fill: 'amber', alpha: 0.3 } : {});
        const list = [{ mesh: left, fill: 'sky', alpha: 0.22, edge: 'ink', faceStyle: sty, edgeFn: cutSkip(left) }, { mesh: rightM, fill: 'sky', alpha: 0.22, edge: 'ink', faceStyle: sty, edgeFn: cutSkip(rightM) }];
        if (rodA > 0.02) list.push({ mesh: revolveMesh([[0, y0 - 0.5], [qu * 0.97, y0 - 0.5], [qu * 0.97, y1 + 0.5], [0, y1 + 0.5]], { N: 28 }), fill: 'amber', alpha: 0.42 * rodA, edge: 'amber', edgeW: 2.2, hidden: false, edgeFn: () => ({ alpha: rodA }) });
        D.bodies(list);
        if (C.review && st === 2) [y0, y1].forEach((y) => D.disc(v3(0, y, 0), v3(1, 0, 0), v3(0, 0, 1), qu, 'red', 0.45, 'red', 2.6));
      }
      // 길이: 바깥 모서리에
      if (showSolid) {
        D.elabel(v3(-A, y0, A), v3(A, y0, A), `a=${M.a}`, { side: { x: 0, y: 1 }, size: 15, color: 'amber', gap: 8 });
        D.elabel(v3(A, y0, A), v3(A, y1, A), `h=${M.h}`, { side: { x: 1, y: 0 }, size: 15, color: 'amber', gap: 8 });
        // 구멍의 반지름 q (윗면)
        D.line(v3(0, y1, 0), v3(-qu, y1, 0), 'red', 2.8);
        D.dot(v3(0, y1, 0), 'ink', 3.5);
        D.tag(v3(-qu / 2, y1, 0), `q=${M.q}`, { dy: -12, size: 15, color: 'red' });
      }
      if (!C.problem) {
        if (!showSolid) { /* 입체 글자 없음 */ } else if (plain) D.tag(v3(0, y1, 0), `구멍 없는 기둥  S₀ = 2a²+4ah = ${plainVal(M.S0)}`, { dy: -40, size: 15, color: 'ink' });
        else if (open > 0.3) D.tag(v3(0, y1, 0), `노란 면 = 안쪽 벽 (높이 ${M.h}, 둘레 2πq)`, { dy: -40, size: 14, color: 'amber' });
        if (R && te > 0.01) {
          slideTiles(R, te);
          const top = rowTop;
          G.drawTileRows(D, R, 0, top);
          if (te > 0.95) totalText(D, R, top, `겉넓이 = ${plainVal(M.tot)}`);
        }
      }
    };
    return {
      id: 'sv5-1', title: '구멍 뚫린 입체', short: '구멍 [함정]',
      question: '기둥에 구멍을 뚫으면 겉넓이는 어떻게 달라질까? 없어지는 면과 새로 생기는 면을 각각 찾아보자.',
      anim: { key: 's51T', dur: 12, label: '뚫고 열어 보기' }, cam0: { yaw: 28, pitch: 22 }, stepT: (n) => [0, 0.02, 0.3, 0.5, 1][Math.min(n, 4)], thumbT: 0.5, problemT: 0.3,
      ctl: () => ['s51A', 's51H', 's51Q', 's51T'],
      init: (s) => { s.s51A = 6; s.s51H = 5; s.s51Q = 2; s.s51T = 0; },
      reroll: (s) => { s.s51A = rint(4, 10); s.s51H = rint(2, 10); s.s51Q = rint(1, Math.min(4, Math.floor((s.s51A - 1) / 2))); s.s51T = 0; },
      model, draw,
      check: (s) => {
        const M = model(s), N = 6000;
        let area = 2 * (M.a * M.a) + 4 * M.a * M.h, wall = 0, hole = 0;
        for (let i = 0; i < N; i++) { const a0 = (TAU * i) / N, a1 = (TAU * (i + 1)) / N; hole += 0.5 * M.q * M.q * Math.sin(a1 - a0); wall += Math.hypot(M.q * (Math.cos(a1) - Math.cos(a0)), M.q * (Math.sin(a1) - Math.sin(a0))) * M.h; }
        area = area - 2 * hole + wall;
        return { ans: area, model: vnum(M.tot) };
      },
      steps: (M) => [
        `구멍이 없을 때의 겉넓이는 $S_0=2a^2+4ah=2\\times${M.a}^2+4\\times${M.a}\\times${M.h}=${tx(M.S0)}\\,\\mathrm{cm}^2$예요.`,
        `기둥의 양쪽 면에 구멍 입구(반지름 $${M.q}$인 원)가 2개 생겨 겉면이 없어져요. $-2\\pi q^2=-2\\pi\\times${M.q}^2=${tx(M.minus)}$예요.`,
        `구멍 안쪽에 새로운 <b>옆면</b>이 생겨요. 가로가 둘레 $2\\pi q$, 세로가 $h$인 직사각형이므로 $+2\\pi qh=${tx(M.plus)}$예요.`,
        `(새 겉넓이) $=S_0-2\\pi q^2+2\\pi qh=${tx(M.S0)}${vnum(M.delta) < 0 ? '' : '+'}${tx(M.delta)}=${tx(M.tot)}\\,\\mathrm{cm}^2$ ($=S_0+2\\pi q(h-q)$)예요.`
      ],
      view: (M) => ({
        guide: `<b>뚫기·열기·분해</b> 막대를 끌거나 ▶를 눌러 보세요. ${span('amber', '구멍 막대')}가 기둥을 가로로 관통하고, 앞쪽 절반이 옆으로 열려 ${span('amber', '안쪽 벽')}이 드러나요. 아래 조각 줄에서 면을 가로로 늘어놓아 합해 보세요. <b>q</b>와 <b>h</b>를 바꿔 겉넓이가 늘고 주는 경우를 찾아보세요.`,
        alert: { tone: M.trend === 'up' ? 'warn' : 'key', text: M.trend === 'up' ? `구멍이 뚫리면 안쪽에 새로운 벽면이 생겨요! 높이 $h=${M.h}$가 구멍의 반지름 $q=${M.q}$보다 크므로 겉넓이가 <b>늘어요</b> ($+2\\pi q(h-q)=${tx(M.delta)}$).` : M.trend === 'down' ? `높이 $h=${M.h}$가 반지름 $q=${M.q}$보다 작은 얇은 판이에요. 이때는 입구 두 원이 안쪽 벽보다 커서 겉넓이가 <b>줄어요</b> ($${tx(M.delta)}$).` : `높이 $h$와 반지름 $q$가 같아서 겉넓이가 <b>변하지 않아요</b>.` },
        readouts: [rd('구멍 없을 때 S₀', plainVal(M.S0) + ' cm²', 'sky'), rd('없어진 입구 2개', plainVal(M.minus) + ' cm²', 'red', '−2πq²'), rd('생긴 안쪽 벽', '+' + plainVal(M.plus) + ' cm²', 'amber', '2πq × h'), rd('새 겉넓이', plainVal(M.tot) + ' cm²', 'green', `변화 ${vnum(M.delta) >= 0 ? '+' : ''}${plainVal(M.delta)}`)],
        formula: `<p>(구멍 뚫린 입체의 겉넓이) $=S_0-2\\pi q^2+2\\pi qh=S_0+2\\pi q(h-q)$</p>`,
        rule: '구멍을 뚫으면: 입구 두 원은 빼고, 안쪽 옆면(2πq × h)은 더해요',
        notes: notes('<b>함정</b>: 안쪽 옆면을 빠뜨리거나, 입구의 원을 빼는 것을 잊거나, 입구를 한 개만 빼기 쉬워요.', '안쪽 옆면은 가로가 원의 둘레 $2\\pi q$예요. $\\pi q^2$(넓이)가 아니에요.', '높이가 반지름보다 <b>크면</b> 늘고, <b>작으면</b> 줄어요. 슬라이더로 확인해 보세요.')
      }),
      prob: (M) => {
        const wrongs = [[vadd(M.S0, M.minus), '안쪽 옆면(구멍 안쪽 벽)을 더하지 않았어요.'], [vadd(M.S0, M.plus), '구멍 입구의 원 2개를 빼지 않았어요.'], [vadd(M.S0, vadd(V(0, -M.q * M.q), M.plus)), '구멍 입구는 양쪽에 2개라 $2\\pi q^2$을 빼야 해요. 한 개만 뺐어요.'], [vadd(M.S0, vadd(M.minus, V(0, M.q * M.q * M.h))), '안쪽 옆면의 가로는 둘레 $2\\pi q$예요. $\\pi q^2$을 썼어요.'], [M.S0, '구멍을 무시했어요.']];
        return { tag: '구멍 뚫린 입체의 겉넓이 (함정)', key: `${M.a}|${M.h}|${M.q}`, stem: `그림과 같이 한 변이 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 길이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 가운데를 반지름이 $${M.q}\\,\\mathrm{cm}$인 원기둥 모양으로 관통하게 뚫었다. 이 입체의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv5-2 막힌 구멍·사각 구멍 */
  const K52 = { cb: '원기둥 구멍(막힘)', st: '정사각 구멍(관통)', sb: '정사각 구멍(막힘)' };
  function sv52() {
    const model = (s) => {
      const kind = oneOf(s.svK52, ['cb', 'st', 'sb'], 'cb'), a = clamp(Math.round(s.s51A), 4, 10), h = clamp(Math.round(s.s51H), 2, 10);
      const size = kind === 'cb' ? clamp(Math.round(s.s52U), 1, Math.min(4, Math.floor((a - 1) / 2))) : clamp(Math.round(s.s52U), 1, Math.min(5, a - 2));
      const d = kind === 'st' ? h : clamp(Math.round(s.s52D), 1, h - 1);
      s.s51A = a; s.s51H = h; s.s52U = size; if (kind !== 'st') s.s52D = d;
      const S0 = V(2 * a * a + 4 * a * h);
      let removed, added, delta, parts;
      if (kind === 'cb') { removed = V(0, -size * size); added = V(0, 2 * size * d + size * size); delta = V(0, 2 * size * d); parts = [{ w: 2 * size, h: 2 * size, shape: 'circle', fill: 'red', label: plainVal(V(0, size * size)), cap: '입구 −πq²' }, { w: 2 * PI * size, h: d, shape: 'rect', fill: 'amber', label: plainVal(V(0, 2 * size * d)), cap: '안쪽 옆면 +2πq×d' }, { w: 2 * size, h: 2 * size, shape: 'circle', fill: 'amber', label: plainVal(V(0, size * size)), cap: '바닥 +πq²' }]; }
      else if (kind === 'st') { removed = V(-2 * size * size); added = V(4 * size * h); delta = V(4 * size * h - 2 * size * size); parts = [{ w: size, h: size, shape: 'rect', count: 2, fill: 'red', label: `${size * size}`, cap: '입구 −u² ×2' }, { w: size, h: h, shape: 'rect', count: 4, fill: 'amber', label: `${size * h}`, cap: '안쪽 옆면 +u×h ×4' }]; }
      else { removed = V(-size * size); added = V(4 * size * d + size * size); delta = V(4 * size * d); parts = [{ w: size, h: size, shape: 'rect', fill: 'red', label: `${size * size}`, cap: '입구 −u²' }, { w: size, h: d, shape: 'rect', count: 4, fill: 'amber', label: `${size * d}`, cap: '안쪽 옆면 +u×d ×4' }, { w: size, h: size, shape: 'rect', fill: 'amber', label: `${size * size}`, cap: '바닥 +u²' }]; }
      const tot = vadd(S0, delta);
      return { kind, a, h, size, d, S0, removed, added, delta, tot, parts, ans: tot };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, sc = 3.4 / Math.max(M.a, M.h * 0.9), A = (M.a * sc) / 2, Hh = M.h * sc, qu = M.size * sc, du = M.d * sc, narrow = b.W < 560, y0 = -Hh / 2, y1 = Hh / 2;
      const t = C.problem ? 0.55 : C.t, rodA = t < 0.5 ? Math.sin((PI * t) / 0.5) : 0, te = ease(lin01(t, 0.5, 0.9));
      const hot = (fill) => (!C.review ? 1 : (st === 2 && fill === 'red') || (st === 3 && fill === 'amber') ? 2 : st === 4 ? 3 : 1);
      const parts = M.parts.map((p) => Object.assign({}, p, { hl: hot(p.fill) }));
      const rows = narrow && parts.length >= 3 ? [parts.slice(0, 2), parts.slice(2)] : [parts];
      const R = C.problem ? null : G.layoutTileRows(rows, narrow ? 4.6 : 6.4, narrow ? 1.6 : 1.9, 0.7, 1.9);
      const pts = cube8(v3(0, 0, 0), Math.max(A, Hh / 2)), bb = bboxOf(pts.map(D.P)), rowTop = bb.y1 + 0.9;
      const blend = narrow && R ? ease(lin01(te, 0, 0.4)) : 0, showSolid = !(narrow && te > 0.35);
      if (blend > 0) { const mix = (p, q2) => p + (q2 - p) * blend; D.fit([], [{ x: mix(bb.x0, -R.total / 2), y: mix(bb.y0, rowTop) }, { x: mix(bb.x1, R.total / 2), y: mix(bb.y1, rowTop + R.height + 2.6) }], { l: 36, r: 36, t: 44, b: 40 }); }
      else D.fit(pts, R && !narrow ? [{ x: -R.total / 2, y: rowTop }, { x: R.total / 2, y: rowTop + R.height + 2.6 }] : [], { l: 36, r: 36, t: 44, b: 40 });
      const mats = [];
      if (M.kind === 'cb') {
        const box = boxMesh(-A, A, y0, y1, -A, A);
        box.faces.forEach((f) => { if (f.n.y > 0.9) f.holes = [circPts(v3(0, y1, 0), v3(1, 0, 0), v3(0, 0, 1), qu, 48)]; });
        const hole = flipMesh(revolveMesh([[0, y1 - du], [qu, y1 - du], [qu, y1]], { N: 32, tags: ['bot', 'wall'] }));
        mats.push({ mesh: box, fill: 'sky', alpha: 0.22, edge: 'ink', faceStyle: () => ({}) });
        mats.push({ mesh: hole, fill: 'amber', alpha: 0.36, edge: 'amber', edgeW: 1.8, sil: true, edgeFn: (e) => (e.chain && e.chain.indexOf('r2_') === 0 ? { skip: true } : {}), faceStyle: (f) => ((f.tag === 'bot' || f.tag === 'wall') && C.review && st === 3 ? { fill: 'amber', alpha: 0.55 } : {}) });
      } else {
        const O = [-A, A, y0, y1, -A, A], hb = M.kind === 'st' ? [-qu / 2, qu / 2, y0, y1, -qu / 2, qu / 2] : [-qu / 2, qu / 2, y1 - du, y1, -qu / 2, qu / 2];
        mats.push({ mesh: boxMinusBoxes(O, [hb]), fill: 'sky', alpha: 0.22, edge: 'ink', faceStyle: (f) => (f.tag === 'in' ? { fill: 'amber', alpha: C.review && st === 3 ? 0.55 : 0.36 } : {}) });
      }
      // 구멍 만드는 막대: 제자리에서 나타났다 사라져요(위아래로 움직이지 않아요)
      if (rodA > 0.02) mats.push({ mesh: M.kind === 'cb' ? revolveMesh([[0, (M.kind === 'st' ? y0 : y1 - du)], [qu * 0.95, y1 - du], [qu * 0.95, y1 + 0.5], [0, y1 + 0.5]], { N: 28 }) : boxMesh(-qu * 0.47, qu * 0.47, M.kind === 'st' ? y0 - 0.4 : y1 - du, y1 + 0.5, -qu * 0.47, qu * 0.47), fill: 'red', alpha: 0.36 * rodA, edge: 'red', edgeW: 2, hidden: false, edgeFn: () => ({ alpha: rodA }) });
      if (showSolid) {
        D.bodies(mats);
        if (M.kind === 'cb') D.path(D.circ(v3(0, y1, 0), v3(1, 0, 0), v3(0, 0, 1), qu, 0, TAU, 60), 'ink', 2.6, {});
        D.elabel(v3(-A, y0, A), v3(A, y0, A), `a=${M.a}`, { side: { x: 0, y: 1 }, size: 15, color: 'amber', gap: 8 });
        D.elabel(v3(A, y0, A), v3(A, y1, A), `h=${M.h}`, { side: { x: 1, y: 0 }, size: 15, color: 'amber', gap: 8 });
        if (M.kind === 'cb') { D.line(v3(0, y1, 0), v3(-qu, y1, 0), 'red', 2.8); D.dot(v3(0, y1, 0), 'ink', 3.5); D.tag(v3(-qu / 2, y1, 0), `q=${M.size}`, { dy: -12, size: 15, color: 'red' }); }
        else D.elabel(v3(-qu / 2, y1, qu / 2), v3(qu / 2, y1, qu / 2), `u=${M.size}`, { side: { x: 0, y: 1 }, size: 15, color: 'red', gap: 6 });
        if (M.kind !== 'st') { D.line(v3(0, y1, 0), v3(0, y1 - du, 0), 'red', 3, { dash: [5, 4] }); D.tag(v3(0, y1 - du / 2, 0), `d=${M.d}`, { dx: 22, size: 14, color: 'red' }); }
      }
      if (R && te > 0.01) {
        slideTiles(R, te);
        G.drawTileRows(D, R, 0, rowTop);
        if (te > 0.95) totalText(D, R, rowTop, `변화 = ${vnum(M.delta) >= 0 ? '+' : ''}${plainVal(M.delta)}  →  겉넓이 ${plainVal(M.tot)}`);
      }
    };
    return {
      id: 'sv5-2', title: '막힌 구멍·사각 구멍', short: '막힌·사각 구멍',
      question: '구멍이 끝까지 뚫리지 않았거나(막힌 구멍) 모양이 정사각형이면 겉넓이는 어떻게 달라질까?',
      anim: { key: 's52T', dur: 9, label: '구멍 뚫기' }, cam0: { yaw: 28, pitch: 22 }, stepT: (n) => [0, 0.02, 0.5, 0.5, 1][Math.min(n, 4)], thumbT: 0.95, problemT: 0.55,
      ctl: (s) => (oneOf(s.svK52, ['cb', 'st', 'sb'], 'cb') === 'st' ? ['s51A', 's51H', 's52U', 's52T'] : ['s51A', 's51H', 's52U', 's52D', 's52T']),
      presets: () => Object.keys(K52).map((k, i) => ({ group: i === 0 ? '구멍의 모양' : '', label: K52[k], apply: (st) => { st.svK52 = k; st.s52T = 0; }, on: (st) => oneOf(st.svK52, ['cb', 'st', 'sb'], 'cb') === k })),
      init: (s) => { s.svK52 = 'cb'; s.s51A = 6; s.s51H = 5; s.s52U = 2; s.s52D = 3; s.s52T = 0; },
      reroll: (s) => { s.svK52 = pick(['cb', 'st', 'sb'], s.svK52); s.s51A = rint(4, 10); s.s51H = rint(3, 10); s.s52U = rint(1, s.svK52 === 'cb' ? Math.min(4, Math.floor((s.s51A - 1) / 2)) : Math.min(5, s.s51A - 2)); s.s52D = rint(1, s.s51H - 1); s.s52T = 0; },
      model, draw,
      check: (s) => {
        const M = model(s), a = M.a, h = M.h, z = M.size;
        if (M.kind === 'cb') { const N = 6000; let hole = 0, wall = 0; for (let i = 0; i < N; i++) { const a0 = (TAU * i) / N, a1 = (TAU * (i + 1)) / N; hole += 0.5 * z * z * Math.sin(a1 - a0); wall += Math.hypot(z * (Math.cos(a1) - Math.cos(a0)), z * (Math.sin(a1) - Math.sin(a0))) * M.d; } return { ans: 2 * a * a + 4 * a * h - hole + wall + hole, model: vnum(M.tot) }; }
        const O = [-h / 2, h / 2, -a / 2, a / 2, -a / 2, a / 2], hb = M.kind === 'st' ? [-h / 2, h / 2, -z / 2, z / 2, -z / 2, z / 2] : [h / 2 - M.d, h / 2, -z / 2, z / 2, -z / 2, z / 2];
        return { ans: meshArea(boxMinusBoxes(O, [hb])), model: vnum(M.tot) };
      },
      steps: (M) => {
        const sz = M.kind === 'cb' ? 'q' : 'u';
        const s1 = `구멍이 없을 때의 겉넓이 $S_0=2a^2+4ah=${tx(M.S0)}\\,\\mathrm{cm}^2$예요.`;
        if (M.kind === 'cb') return [s1, `입구의 원 1개가 없어져요. $-\\pi q^2=${tx(M.removed)}$예요.`, `안쪽 옆면 $2\\pi qd=${tx(V(0, 2 * M.size * M.d))}$와 구멍 바닥의 원 $\\pi q^2=${tx(V(0, M.size * M.size))}$이 새로 생겨요.`, `입구와 바닥의 원이 서로 같아 지워져서, (새 겉넓이) $=S_0+2\\pi qd=${tx(M.S0)}+${tx(M.delta)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`];
        if (M.kind === 'st') return [s1, `양쪽에 정사각형 입구가 2개 있어서 $-2u^2=${tx(M.removed)}$예요.`, `안쪽 옆면은 $u\\times h$인 직사각형 4개이므로 $+4uh=${tx(V(4 * M.size * M.h))}$예요.`, `(새 겉넓이) $=S_0-2u^2+4uh=${tx(M.S0)}${vnum(M.delta) >= 0 ? '+' : ''}${tx(M.delta)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.${vnum(M.delta) < 0 ? ' (입구 두 개가 안쪽 벽보다 커서 겉넓이가 줄어요)' : ''}`];
        return [s1, `입구의 정사각형 1개가 없어져요. $-u^2=${tx(M.removed)}$예요.`, `안쪽 옆면 $4\\times u\\times d=${tx(V(4 * M.size * M.d))}$와 바닥의 정사각형 $u^2=${tx(V(M.size * M.size))}$이 새로 생겨요.`, `입구와 바닥이 같아 지워져서 (새 겉넓이) $=S_0+4ud=${tx(M.S0)}+${tx(M.delta)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`];
      },
      view: (M) => ({
        guide: `위 칩에서 <b>구멍의 모양</b>을 골라 보세요. <b>구멍 뚫기</b> 막대를 끌면 ${span('red', '구멍 막대')}가 구멍 자리에 나타났다 사라져요. 막힌 구멍은 <b>바닥</b>이 새로 생기고, 입구와 바닥이 서로 <b>지워져요</b>.`,
        readouts: [rd('구멍 없을 때 S₀', plainVal(M.S0) + ' cm²', 'sky'), rd('없어진 입구', plainVal(M.removed) + ' cm²', 'red'), rd('생긴 안쪽 면', '+' + plainVal(M.added) + ' cm²', 'amber', M.kind === 'cb' || M.kind === 'sb' ? '벽 + 바닥' : '벽 4개'), rd('새 겉넓이', plainVal(M.tot) + ' cm²', 'green', `변화 ${vnum(M.delta) >= 0 ? '+' : ''}${plainVal(M.delta)}`)],
        formula: M.kind === 'cb' ? `<p>(막힌 원기둥 구멍) 겉넓이 $=S_0+2\\pi qd$ &nbsp;(입구와 바닥의 $\\pi q^2$는 서로 지워져요)</p>` : M.kind === 'st' ? `<p>(관통하는 정사각 구멍) 겉넓이 $=S_0-2u^2+4uh$</p>` : `<p>(막힌 정사각 구멍) 겉넓이 $=S_0+4ud$ &nbsp;(입구와 바닥의 $u^2$는 서로 지워져요)</p>`,
        rule: '파낸 곳마다 「없어지는 겉면」과 「새로 생기는 겉면」을 따로 구해요',
        notes: notes('막힌 구멍은 <b>바닥</b>이 새로 생겨요. 입구에서 없어진 넓이와 같아서 늘어나는 것은 <b>안쪽 옆면</b>뿐이에요.', '정사각 구멍의 안쪽 옆면은 <b>4개</b>예요. 원 구멍은 둘레 $2\\pi q$인 하나의 곡면이에요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        if (M.kind === 'cb') {
          wrongs = [[vadd(M.S0, V(0, -M.size * M.size + 2 * M.size * M.d)), '입구를 빼면 바닥의 원을 더해야 해요(서로 지워져요).'], [vadd(M.S0, V(0, 2 * M.size * M.d + M.size * M.size)), '입구의 원 $\\pi q^2$을 빼지 않았어요.'], [vadd(M.S0, V(0, M.size * M.size * M.d)), '안쪽 옆면의 가로는 둘레 $2\\pi q$예요.'], [vadd(M.S0, V(0, 2 * M.size * M.h)), '깊이 $d$가 아니라 기둥의 길이 $h$를 썼어요.'], [M.S0, '구멍을 무시했어요.']];
          stem = `그림과 같이 한 변이 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 길이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 한쪽 면에서 반지름 $${M.size}\\,\\mathrm{cm}$, 깊이 $${M.d}\\,\\mathrm{cm}$인 원기둥 모양의 구멍을 팠다(구멍은 끝까지 뚫리지 않았다). 이 입체의 겉넓이는?`;
        } else if (M.kind === 'st') {
          wrongs = [[vadd(M.S0, V(4 * M.size * M.h)), '입구의 정사각형 2개($2u^2$)를 빼지 않았어요.'], [vadd(M.S0, V(-2 * M.size * M.size)), '안쪽 옆면(직사각형 4개)을 더하지 않았어요.'], [vadd(M.S0, V(4 * M.size * M.h - M.size * M.size)), '입구는 양쪽에 2개예요. 한 개만 뺐어요.'], [vadd(M.S0, V(2 * M.size * M.h - 2 * M.size * M.size)), '안쪽 옆면은 4개예요. 2개만 더했어요.'], [M.S0, '구멍을 무시했어요.']];
          stem = `그림과 같이 한 변이 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 길이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 가운데를 한 변이 $${M.size}\\,\\mathrm{cm}$인 정사각형 모양으로 관통하게 뚫었다. 이 입체의 겉넓이는?`;
        } else {
          wrongs = [[vadd(M.S0, V(4 * M.size * M.d - M.size * M.size)), '입구를 빼면 바닥을 더해야 해요(서로 지워져요).'], [vadd(M.S0, V(4 * M.size * M.d + M.size * M.size)), '입구의 정사각형 $u^2$을 빼지 않았어요.'], [vadd(M.S0, V(2 * M.size * M.d)), '안쪽 옆면은 4개예요.'], [vadd(M.S0, V(4 * M.size * M.h)), '깊이 $d$가 아니라 길이 $h$를 썼어요.'], [M.S0, '구멍을 무시했어요.']];
          stem = `그림과 같이 한 변이 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 길이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 한쪽 면에서 한 변이 $${M.size}\\,\\mathrm{cm}$, 깊이 $${M.d}\\,\\mathrm{cm}$인 정사각형 모양의 구멍을 팠다(끝까지 뚫리지 않았다). 이 입체의 겉넓이는?`;
        }
        return { tag: M.kind === 'st' ? '사각 구멍의 겉넓이' : '막힌 구멍의 겉넓이 (함정: 바닥)', key: `${M.kind}|${M.a}|${M.h}|${M.size}|${M.d}`, stem, choices: mkV(M.ans, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv5-3 모퉁이 절단 (Ⅳ-4) */
  const CORN = { 1: [[1, 1, 1]], 4: [[1, 1, 1], [-1, 1, 1], [1, 1, -1], [-1, 1, -1]], 8: [] };
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) CORN[8].push([sx, sy, sz]);
  const cornerBoxes = (A, p, cnt) => CORN[cnt].map(([sx, sy, sz]) => [sx > 0 ? A - p : -A, sx > 0 ? A : -A + p, sy > 0 ? A - p : -A, sy > 0 ? A : -A + p, sz > 0 ? A - p : -A, sz > 0 ? A : -A + p]);
  function sv53() {
    const model = (s) => {
      const a = clamp(Math.round(s.s53A), 4, 10), cnt = [1, 4, 8].includes(s.svCnt) ? s.svCnt : 1, pMax = cnt === 1 ? a - 1 : Math.floor((a - 1) / 2), p = clamp(Math.round(s.s53P), 1, pMax);
      s.s53A = a; s.s53P = p;
      const S0 = V(6 * a * a), out3 = V(3 * p * p), in3 = V(3 * p * p), tot = vadd(vsub(S0, vmul(out3, cnt)), vmul(in3, cnt));
      return { a, cnt, p, S0, out3, in3, tot, ans: tot };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, sc = 3.4 / M.a, A = (M.a * sc) / 2, pu = M.p * sc;
      const t = C.problem ? 0.2 : C.t, glow = lin01(t, 0, 0.3), slide = ease(lin01(t, 0.3, 0.6)), te = ease(lin01(t, 0.6, 1));
      const blist = cornerBoxes(A, pu, M.cnt), body = boxMinusBoxes([-A, A, -A, A, -A, A], blist);
      const pulse = 0.35 + 0.25 * Math.sin(glow * PI * 3 + 0.0);
      const hotOut = C.review ? (st === 2 ? 1 : 0) : (t > 0.02 && t < 0.3 ? 1 : 0), hotIn = C.review ? (st === 3 ? 1 : 0) : (t > 0.02 && t < 0.3 ? 1 : 0), settled = !C.review && t >= 0.3;
      // 모든 조각은 오른쪽으로만(가로로) 빠집니다. 왼쪽 조각은 더 멀리 가서 오른쪽 조각 곁에 놓여요
      const sdR = slide * (1.6 * pu + 0.3 * A), sdL = slide * (2.3 * A + 2.3 * pu), sd = sdR;
      const piece = (bx, sg) => { const sx = bx[1] > 0 && bx[1] === A ? 1 : -1; const m = boxMesh(bx[0], bx[1], bx[2], bx[3], bx[4], bx[5]); const sgn = [sx, bx[3] === A ? 1 : -1, bx[5] === A ? 1 : -1]; return { m: xfMesh(m, shiftT(D.hx(sx > 0 ? sdR : sdL))), sgn }; };
      const pcs = blist.map((bx) => piece(bx));
      const xMax = C.problem ? A : A + (M.cnt === 1 ? 1.1 * pu + 0.3 * A + pu : 2.8 * pu + 0.3 * A + pu), pts = cube8(v3(0, 0, 0), A).concat([v3(xMax, A, A), v3(xMax, -A, -A), v3(xMax, A, -A), v3(xMax, -A, A)]);
      const row = C.problem ? null : (() => {
        const mk = (fill, i) => ({ w: M.p, h: M.p, shape: 'rect', fill, label: `${M.p * M.p}`, hl: 1 });
        return layoutTiles([mk('red', 0), mk('red', 1), mk('red', 2)], 3.6, 1.2, 0.35);
      })();
      const bbx = bboxOf(pts.map(D.P));
      D.fit(pts, row ? [{ x: -4.3, y: bbx.y1 + 0.7 }, { x: 4.3, y: bbx.y1 + 0.7 + row.height + 1.2 }] : [], { l: 40, r: 40, t: 40, b: 40 });
      D.body({ mesh: body, fill: 'sky', alpha: 0.2, edge: 'ink', faceStyle: (f) => (f.tag === 'in' ? { fill: 'amber', alpha: hotIn || settled || (C.review && st >= 3) ? (hotIn ? pulse + 0.1 : 0.42) : 0.28 } : {}) });
      pcs.forEach((pc) => D.body({ mesh: pc.m, fill: 'violet', alpha: 0.16, edge: 'ink', edgeW: 2.2, faceStyle: (f) => (f.n && (f.n.x * pc.sgn[0] + f.n.y * pc.sgn[1] + f.n.z * pc.sgn[2]) > 0.5 && (hotOut || settled || (C.review && st >= 2)) ? { fill: 'red', alpha: hotOut ? pulse + 0.1 : 0.45 } : {}) }));
      D.elabel(v3(-A, -A, A), v3(A, -A, A), `a=${M.a}`, { side: { x: 0, y: 1 }, size: 15, color: 'amber', gap: 8 });
      if (blist.length) { const bx = blist[0]; D.elabel(add3(v3(bx[0], bx[3], bx[5]), D.hx(sd)), add3(v3(bx[1], bx[3], bx[5]), D.hx(sd)), `p=${M.p}`, { side: { x: 0, y: -1 }, size: 14, color: 'red', gap: 6 }); }
      if (!C.problem) {
        D.tag(v3(0, A, 0), t < 0.3 && !C.review ? `정육면체 6a² = ${plainVal(M.S0)}` : `겉넓이 6a² = ${plainVal(M.S0)} 그대로`, { dy: -34, size: 15, color: 'ink' });
        if (t >= 0.3 || (C.review && st >= 2)) { const bx = blist[0]; D.tag(add3(v3((bx[0] + bx[1]) / 2, (bx[2] + bx[3]) / 2, (bx[4] + bx[5]) / 2), D.hx(sd)), `−3p² = −${plainVal(M.out3)}`, { size: 14, color: 'red', dy: 24 }); }
        if (t >= 0.3 || (C.review && st >= 3)) D.tag(v3(A * 0.55, A * 0.55, A * 0.55), `+3p² = +${plainVal(M.in3)}`, { size: 14, color: 'amber', dy: -2, dx: -8 });
        if (row) {
          // 같은 줄 안에서 가로로: 빨강(없어진 바깥 3면)과 노랑(새로 생긴 안쪽 3면)이 포개져요
          const off = (row.total + 0.8) / 2, y0 = bbx.y1 + 0.7, xB = (1 - te) * 2 * off; // 빨강은 오른쪽에 고정, 노랑이 왼쪽에서 오른쪽으로 가로로 겹쳐요
          const L1 = { tiles: row.tiles.map((tl) => Object.assign({}, tl, { x: tl.x + off, fill: 'red', label: '', cap: '' })), height: row.height }, L2 = { tiles: row.tiles.map((tl) => Object.assign({}, tl, { x: tl.x + off - xB, fill: 'amber', label: tl.label })), height: row.height };
          drawTiles(D, L1, 0, y0); drawTiles(D, L2, 0, y0);
          if (te < 0.45) b.text({ x: off, y: y0 }, '없어진 바깥 3면', { dy: -13, size: D.fs(13), weight: 800, color: 'red', baseline: 'middle', align: 'center' });
          if (te < 0.45) b.text({ x: off - xB, y: y0 }, '생긴 안쪽 3면', { dy: -13, size: D.fs(13), weight: 800, color: 'amber', baseline: 'middle', align: 'center' });
          if (te > 0.95) b.text({ x: off, y: y0 + row.height }, '합동 · 넓이 같음', { dy: 18, size: D.fs(15), weight: 800, color: 'green', baseline: 'middle' });
          if (te > 0.95) b.text({ x: off, y: y0 }, `변화 = −3p² + 3p² = 0${M.cnt > 1 ? ` (모퉁이 ${M.cnt}개 모두 0)` : ''}`, { dy: -32, size: D.fs(14), weight: 800, color: 'green', baseline: 'middle' });
        }
      }
    };
    return {
      id: 'sv5-3', title: '모퉁이를 잘라 낸 정육면체', short: '모퉁이 절단',
      question: '정육면체의 모퉁이를 정육면체 모양으로 잘라 내면 겉넓이는 늘어날까, 줄어들까?',
      anim: { key: 's53T', dur: 10, label: '잘라 내기' }, cam0: { yaw: 28, pitch: 24 }, stepT: (n) => [0, 0.02, 0.45, 0.6, 1][Math.min(n, 4)], thumbT: 1, problemT: 0.2,
      ctl: () => ['s53A', 's53P', 's53T'],
      presets: () => [{ group: '자르는 모퉁이', label: '1개', apply: (st) => { st.svCnt = 1; }, on: (st) => (st.svCnt || 1) === 1 }, { label: '4개', apply: (st) => { st.svCnt = 4; }, on: (st) => st.svCnt === 4 }, { label: '8개', apply: (st) => { st.svCnt = 8; }, on: (st) => st.svCnt === 8 }],
      init: (s) => { s.svCnt = 1; s.s53A = 6; s.s53P = 2; s.s53T = 0; },
      reroll: (s) => { s.svCnt = pick([1, 4, 8], s.svCnt); s.s53A = rint(5, 10); s.s53P = rint(1, s.svCnt === 1 ? s.s53A - 2 : Math.floor((s.s53A - 1) / 2)); s.s53T = 0; },
      model, draw,
      check: (s) => { const M = model(s), A = M.a / 2; return { ans: meshArea(boxMinusBoxes([-A, A, -A, A, -A, A], cornerBoxes(A, M.p, M.cnt))), model: vnum(M.tot) }; },
      steps: (M) => [
        `처음 정육면체의 겉넓이는 $6a^2=6\\times${M.a}^2=${tx(M.S0)}\\,\\mathrm{cm}^2$예요.`,
        `모퉁이 조각(한 변 $${M.p}$인 정육면체)을 떼면 <b>바깥 3면</b>(각 $${M.p}\\times${M.p}$)이 없어져요. $-3p^2=-${tx(M.out3)}$예요.`,
        `조각을 떼어 낸 자리에 <b>안쪽 3면</b>(각 $${M.p}\\times${M.p}$)이 새로 생겨요. $+3p^2=+${tx(M.in3)}$예요.`,
        `없어진 면과 생긴 면이 합동이라 넓이가 같아요. (겉넓이) $=6a^2-3p^2+3p^2=${tx(M.S0)}\\,\\mathrm{cm}^2$ — ${M.cnt > 1 ? `모퉁이 ${M.cnt}개를 모두 잘라도 ` : ''}<b>변하지 않아요</b>.`
      ],
      view: (M) => ({
        guide: `<b>잘라 내기</b> 막대를 끌거나 ▶를 눌러 보세요. 모퉁이 조각이 모두 ${span('violet', '오른쪽으로')} 빠지고, 아래 타일 줄에서 ${span('amber', '생긴 안쪽 3면')}이 왼쪽에서 오른쪽으로 가로로 밀려 ${span('red', '없어진 바깥 3면')}과 <b>겹쳐져요</b>. 위 칩으로 모퉁이 개수를 바꿔 보세요.`,
        readouts: [rd('처음 겉넓이 6a²', plainVal(M.S0) + ' cm²', 'sky'), rd('없어진 바깥 3면', '−' + plainVal(vmul(M.out3, M.cnt)) + ' cm²', 'red', `3p² × ${M.cnt}개`), rd('생긴 안쪽 3면', '+' + plainVal(vmul(M.in3, M.cnt)) + ' cm²', 'amber', `3p² × ${M.cnt}개`), rd('자른 뒤 겉넓이', plainVal(M.tot) + ' cm²', 'green', '변화 없음')],
        formula: `<p>(자른 뒤 겉넓이) $=6a^2-3p^2+3p^2=6a^2$</p>`,
        rule: '모퉁이를 정육면체(직육면체) 모양으로 잘라 내도 겉넓이는 그대로',
        notes: notes('없어지는 바깥 3면과 새로 생기는 안쪽 3면의 넓이가 <b>같아요</b>. 그래서 6a²이 그대로예요.', '<b>함정</b>: $6a^2-3p^2$(줄어든다)나 $6a^2+3p^2$(늘어난다)를 고르기 쉬워요. 빠진 면과 생긴 면을 <b>둘 다</b> 세어 보세요.', '모서리 한가운데나 가운데를 파내면 달라져요(다음 장면).')
      }),
      prob: (M) => {
        const q = M.p * M.p, a2 = M.a * M.a;
        const wrongs = [[V(6 * a2 - 3 * q), '없어진 바깥 3면만 뺐어요. 새로 생긴 안쪽 3면을 더해야 해요.'], [V(6 * a2 + 3 * q), '새로 생긴 안쪽 3면만 더했어요. 없어진 바깥 3면을 빼야 해요.'], [V(6 * a2 - q), '면 1개만 뺐어요. 바깥에서 3면이 없어져요.'], [V(6 * a2 + 6 * q), '조각의 겉넓이 $6p^2$를 더했어요.'], [V(6 * a2 - 6 * q), '조각의 겉넓이 $6p^2$를 뺐어요.']];
        return { tag: '모퉁이를 잘라 낸 입체의 겉넓이 (킬러: 변하지 않음)', key: `${M.a}|${M.p}|${M.cnt}`, stem: `한 모서리의 길이가 $${M.a}\\,\\mathrm{cm}$인 정육면체에서 ${M.cnt === 1 ? '한 모퉁이를' : `${M.cnt}개의 모퉁이를 각각`} 한 모서리의 길이가 $${M.p}\\,\\mathrm{cm}$인 작은 정육면체 모양으로 잘라 냈다. 남은 입체의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv5-4 모서리·가운데 홈 (확장) */
  const K54 = { mid: '모서리 중간 파내기', thru: '모서리 따라 끝까지', groove: '가운데 홈' };
  function sv54() {
    const model = (s) => {
      const kind = oneOf(s.svK54, ['mid', 'thru', 'groove'], 'mid'), a = clamp(Math.round(s.s54A), 4, 10);
      let p = clamp(Math.round(s.s54P), 1, a - 1), q = clamp(Math.round(s.s54Q), 1, a - 1), c = kind === 'thru' ? a : clamp(Math.round(s.s54C), 1, a - 2), w = clamp(Math.round(s.s54W), 1, a - 2), z = clamp(Math.round(s.s54Z), 1, a - 1);
      const S0 = V(6 * a * a);
      let rem, add, delta, blk, detail;
      if (kind === 'groove') { rem = a * w + 2 * w * z; add = a * w + 2 * a * z; delta = 2 * a * z - 2 * w * z; blk = [-a / 2, a / 2, a / 2 - z, a / 2, -w / 2, w / 2]; detail = { removed: `윗면 띠 ${a}×${w} + 양 끝 ${w}×${z} 두 개`, added: `홈 바닥 ${a}×${w} + 옆벽 ${a}×${z} 두 개` }; }
      else { rem = c * q + c * p + (kind === 'thru' ? 2 * p * q : 0); add = c * q + c * p + (kind === 'thru' ? 0 : 2 * p * q); delta = add - rem; blk = [-c / 2, c / 2, a / 2 - p, a / 2, a / 2 - q, a / 2]; detail = { removed: kind === 'thru' ? `윗면 ${c}×${q} + 앞면 ${c}×${p} + 양 끝 ${p}×${q} 두 개` : `윗면 ${c}×${q} + 앞면 ${c}×${p}`, added: kind === 'thru' ? `홈 바닥 ${c}×${q} + 홈 뒷벽 ${c}×${p}` : `홈 바닥 ${c}×${q} + 홈 뒷벽 ${c}×${p} + 양 끝벽 ${p}×${q} 두 개` }; }
      const tot = vadd(S0, V(delta));
      s.s54A = a; s.s54P = p; s.s54Q = q; if (kind !== 'thru') s.s54C = c; s.s54W = w; s.s54Z = z;
      return { kind, a, p, q, c, w, z, S0, rem, add, delta, blk, detail, tot, ans: tot };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, sc = 3.4 / M.a, A = (M.a * sc) / 2, t = C.problem ? 0.2 : C.t, slide = ease(lin01(t, 0, 0.55)), sd = slide * (A * 1.5 + 0.5);
      const bx = M.blk.map((v) => v * sc), body = boxMinusBoxes([-A, A, -A, A, -A, A], [bx]);
      const pieceM = xfMesh(boxMesh(bx[0], bx[1], bx[2], bx[3], bx[4], bx[5]), shiftT(D.hx(sd)));
      const pts = cube8(v3(0, 0, 0), A).concat(cube8(D.hx(sd), A * 0.6));
      const bbx = bboxOf(pts.map(D.P));
      D.fit(pts, C.problem ? [] : [{ x: -3, y: bbx.y1 + 0.7 }, { x: 3, y: bbx.y1 + 1.7 }], { l: 40, r: 40, t: 44, b: 40 });
      const lvR = !C.review ? 1 : st === 2 ? 2 : 1, lvA = !C.review ? 1 : st === 3 ? 2 : 1;
      D.body({ mesh: body, fill: 'sky', alpha: 0.2, edge: 'ink', faceStyle: (f) => (f.tag === 'in' ? { fill: 'amber', alpha: lvA === 2 ? 0.55 : 0.36 } : {}) });
      D.body({ mesh: pieceM, fill: 'violet', alpha: 0.18, edge: 'ink', edgeW: 2.2, faceStyle: (f) => { const onTop = f.n.y > 0.5 || (M.kind !== 'groove' && f.n.z > 0.5) || (M.kind === 'thru' && Math.abs(f.n.x) > 0.5); return onTop ? { fill: 'red', alpha: lvR === 2 ? 0.55 : 0.38 } : {}; } });
      D.elabel(v3(-A, -A, A), v3(A, -A, A), `a=${M.a}`, { side: { x: 0, y: 1 }, size: 15, color: 'amber', gap: 8 });
      const lab = (txt, p0, p1, side, col) => D.elabel(add3(p0, D.hx(sd)), add3(p1, D.hx(sd)), txt, { side, size: 14, color: col, gap: 6 });
      if (M.kind === 'groove') { lab(`w=${M.w}`, v3(bx[0], bx[3], bx[4]), v3(bx[0], bx[3], bx[5]), { x: -1, y: -0.3 }, 'sky'); lab(`${M.z}`, v3(bx[1], bx[2], bx[5]), v3(bx[1], bx[3], bx[5]), { x: 1, y: 0 }, 'red'); }
      else { lab(`c=${M.c}`, v3(bx[0], bx[3], bx[5]), v3(bx[1], bx[3], bx[5]), { x: 0, y: -1 }, 'sky'); lab(`p=${M.p}`, v3(bx[1], bx[2], bx[5]), v3(bx[1], bx[3], bx[5]), { x: 1, y: 0 }, 'red'); lab(`q=${M.q}`, v3(bx[1], bx[3], bx[4]), v3(bx[1], bx[3], bx[5]), { x: 1, y: -0.3 }, 'red'); }
      if (!C.problem) {
        const y0 = bbx.y1 + 0.7;
        G.drawBars(D, [{ v: Math.max(M.rem, 1), fill: 'red', label: `없어진 ${M.rem}`, hl: lvR }, { v: Math.max(M.add, 1), fill: 'amber', label: `생긴 ${M.add}`, hl: lvA }], 0, y0, 5.6, 0, { total: undefined });
        b.text({ x: 0, y: y0 + 0.62 }, `겉넓이 변화 = ${M.add} − ${M.rem} = ${M.delta >= 0 ? '+' : ''}${M.delta}  →  ${plainVal(M.tot)}`, { dy: 18, size: D.fs(15), weight: 800, color: M.delta === 0 ? 'green' : M.delta > 0 ? 'amber' : 'red', baseline: 'middle' });
      }
    };
    return {
      id: 'sv5-4', title: '모서리·가운데 홈 (확장)', short: '모서리·홈 (확장)',
      question: '파내는 위치가 모퉁이에서 모서리 중간이나 가운데로 바뀌면 겉넓이는 어떻게 달라질까?',
      anim: { key: 's54T', dur: 6, label: '조각 빼내기' }, cam0: { yaw: 28, pitch: 24 }, stepT: (n) => [0, 0.6, 0.6, 1, 1][Math.min(n, 4)], thumbT: 1, problemT: 0.2,
      ctl: (s) => ({ mid: ['s54A', 's54P', 's54Q', 's54C', 's54T'], thru: ['s54A', 's54P', 's54Q', 's54T'], groove: ['s54A', 's54W', 's54Z', 's54T'] }[oneOf(s.svK54, ['mid', 'thru', 'groove'], 'mid')]),
      presets: () => Object.keys(K54).map((k, i) => ({ group: i === 0 ? '파내는 위치' : '', label: K54[k], apply: (st) => { st.svK54 = k; st.s54T = 0; }, on: (st) => oneOf(st.svK54, ['mid', 'thru', 'groove'], 'mid') === k })),
      init: (s) => { s.svK54 = 'mid'; s.s54A = 6; s.s54P = 2; s.s54Q = 2; s.s54C = 3; s.s54W = 2; s.s54Z = 2; s.s54T = 0; },
      reroll: (s) => { s.svK54 = pick(['mid', 'thru', 'groove'], s.svK54); s.s54A = rint(5, 10); s.s54P = rint(1, 3); s.s54Q = rint(1, 3); s.s54C = rint(1, s.s54A - 2); s.s54W = rint(1, 3); s.s54Z = rint(1, 3); s.s54T = 0; },
      model, draw,
      check: (s) => { const M = model(s); return { ans: meshArea(boxMinusBoxes([-M.a / 2, M.a / 2, -M.a / 2, M.a / 2, -M.a / 2, M.a / 2], [M.blk])), model: vnum(M.tot) }; },
      steps: (M) => [
        `처음 정육면체의 겉넓이는 $6a^2=${tx(M.S0)}\\,\\mathrm{cm}^2$예요.`,
        `파낸 조각이 겉면과 닿아 있던 곳이 없어져요: ${M.detail.removed}. 합은 $${M.rem}$예요.`,
        `파낸 자리 안쪽에 새로 생기는 면: ${M.detail.added}. 합은 $${M.add}$예요.`,
        `(겉넓이의 변화) $=${M.add}-${M.rem}=${M.delta >= 0 ? '+' : ''}${M.delta}$이므로 (겉넓이) $=${tx(M.S0)}${M.delta >= 0 ? '+' : ''}${M.delta}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `위 칩에서 <b>파내는 위치</b>를 골라 보세요. <b>조각 빼내기</b>를 끌면 조각이 ${span('violet', '가로로')} 빠져나가요. ${span('red', '없어진 겉면')}과 ${span('amber', '생긴 겉면')}의 넓이를 비교하면 위치에 따라 결과가 달라지는 걸 볼 수 있어요. (이 장면은 확장 탐구예요.)`,
        readouts: [rd('처음 6a²', plainVal(M.S0) + ' cm²', 'sky'), rd('없어진 겉면', '−' + M.rem + ' cm²', 'red'), rd('생긴 겉면', '+' + M.add + ' cm²', 'amber'), rd('자른 뒤 겉넓이', plainVal(M.tot) + ' cm²', 'green', `변화 ${M.delta >= 0 ? '+' : ''}${M.delta}`)],
        formula: M.kind === 'mid' ? `<p>(모서리 중간) 변화 $=+2pq$ &nbsp;(양 끝벽 두 개가 더해져요)</p>` : M.kind === 'thru' ? `<p>(모서리를 따라 끝까지) 변화 $=-2pq$ &nbsp;(양 끝에서 없어지는 면 두 개)</p>` : `<p>(가운데 홈) 변화 $=2z(a-w)$ &nbsp;($z$ 깊이, $w$ 폭)</p>`,
        rule: '변화 = (생긴 겉면) − (없어진 겉면): 파낸 위치에 따라 늘기도, 줄기도, 그대로이기도 해요',
        notes: notes('모퉁이는 바깥 3면 = 안쪽 3면이라 변화가 <b>0</b>이에요.', '모서리 중간은 <b>늘고</b>, 모서리를 따라 끝까지 파면 <b>줄어요</b>. 조각의 면이 겉면과 닿은 개수가 달라지기 때문이에요.')
      }),
      prob: (M) => {
        const S = 6 * M.a * M.a;
        const wr = M.kind === 'groove' ? [[V(S - M.rem), '없어진 면만 뺐어요. 생긴 면을 더해야 해요.'], [V(S + M.add), '생긴 면만 더했어요. 없어진 면을 빼야 해요.'], [V(S), '변화가 없다고 생각했어요(모퉁이 절단과 달라요).'], [V(S + 2 * M.a * M.z), '홈 양 끝에서 없어진 면 $2wz$를 빼지 않았어요.'], [V(S + 2 * M.z * M.w)]]
          : [[V(S - M.rem), '없어진 면만 뺐어요. 생긴 면을 더해야 해요.'], [V(S + M.add), '생긴 면만 더했어요. 없어진 면을 빼야 해요.'], [V(S), '변화가 없다고 생각했어요(모퉁이 절단과 달라요).'], [V(S + (M.kind === 'mid' ? -2 : 2) * M.p * M.q), M.kind === 'mid' ? '모서리 중간은 양 끝벽이 더해져서 늘어요.' : '끝까지 파면 양 끝의 겉면이 없어져서 줄어요.'], [V(S + M.p * M.q)]];
        const stem = M.kind === 'groove' ? `한 모서리의 길이가 $${M.a}\\,\\mathrm{cm}$인 정육면체의 윗면 한가운데에, 한쪽 옆면에서 반대쪽 옆면까지 폭 $${M.w}\\,\\mathrm{cm}$, 깊이 $${M.z}\\,\\mathrm{cm}$인 홈을 팠다. 이 입체의 겉넓이는?` : M.kind === 'mid' ? `한 모서리의 길이가 $${M.a}\\,\\mathrm{cm}$인 정육면체의 한 모서리 중간(양 끝은 남김)에서 길이 $${M.c}\\,\\mathrm{cm}$, 단면이 $${M.p}\\,\\mathrm{cm}\\times${M.q}\\,\\mathrm{cm}$인 직육면체 모양을 파냈다. 이 입체의 겉넓이는?` : `한 모서리의 길이가 $${M.a}\\,\\mathrm{cm}$인 정육면체의 한 모서리를 따라 끝에서 끝까지, 단면이 $${M.p}\\,\\mathrm{cm}\\times${M.q}\\,\\mathrm{cm}$인 직육면체 모양으로 파냈다. 이 입체의 겉넓이는?`;
        return { tag: M.kind === 'groove' ? '가운데 홈의 겉넓이' : M.kind === 'mid' ? '모서리 중간을 파낸 입체 (킬러)' : '모서리를 파낸 입체 (킬러)', key: `${M.kind}|${M.a}|${M.p}|${M.q}|${M.c}|${M.w}|${M.z}`, stem, choices: mkV(M.tot, wr, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv5-5 원뿔 속 원뿔 */
  function sv55() {
    const model = (s) => {
      const K = clamp(Math.round(s.s55K), 2, 5), j = clamp(Math.round(s.s55J), 1, K - 1), mode = s.svMode === 'vol' ? 'vol' : 'surf';
      s.s55K = K; s.s55J = j;
      const r2 = 3 * K, h2 = 4 * K, R2 = 5 * K, r1 = 3 * j, h1 = 4 * j, R1 = 5 * j;
      const lat2 = V(0, r2 * R2), ann = V(0, r2 * r2 - r1 * r1), lat1 = V(0, r1 * R1), surf = vadd(lat2, vadd(ann, lat1)), v2 = V(0, (r2 * r2 * h2) / 3), v1 = V(0, (r1 * r1 * h1) / 3), vol = vsub(v2, v1);
      return { K, j, mode, r2, h2, R2, r1, h1, R1, lat2, ann, lat1, surf, v2, v1, vol, ans: mode === 'vol' ? vol : surf };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, sc = 4.4 / Math.max(M.h2, 2 * M.r2), r2 = M.r2 * sc, h2 = M.h2 * sc, r1 = M.r1 * sc, h1 = M.h1 * sc, t = C.problem ? 0 : C.t, slide = ease(t) * (r2 + r1 * 1.7);
      // 밑면이 아래: 원뿔의 밑면(아래)에서 같은 모양의 작은 원뿔만큼 파냈어요. 아래에서 조금 올려다본 모습이에요.
      const y0 = -h2 / 2, yt = y0 + h2;
      const outer = revolveMesh([[r2, y0], [0, yt]], { N: 48 });
      const cav = flipMesh(revolveMesh([[r1, y0], [0, y0 + h1]], { N: 48 }));
      const ann = { faces: [{ pts: circPts(v3(0, y0, 0), v3(1, 0, 0), v3(0, 0, 1), r2, 64), holes: [circPts(v3(0, y0, 0), v3(1, 0, 0), v3(0, 0, 1), r1, 64)], n: v3(0, -1, 0), c: v3(0, y0, 0), tag: 'ann' }], edges: [] };
      const piece = xfMesh(revolveMesh([[0, y0], [r1, y0], [0, y0 + h1]], { N: 48, tags: ['bot', 'side'] }), shiftT(D.hx(slide)));
      D.fit(cube8(v3(0, 0, 0), Math.max(r2, h2 / 2)).concat(cube8(D.hx(C.problem ? 0 : r2 + r1 * 1.7), Math.max(r1, h1 / 2))), [], { l: 44, r: 44, t: 40, b: 40 });
      const lvL = !C.review ? 1 : st === 1 ? 2 : 1, lvA = !C.review ? 1 : st === 2 ? 2 : 1, lvI = !C.review ? 1 : st === 3 ? 2 : 1;
      D.body({ mesh: outer, fill: lvL === 2 ? 'amber' : 'sky', alpha: lvL === 2 ? 0.36 : 0.2, edge: 'ink', edgeW: 2.6 });
      D.body({ mesh: ann, fill: lvA === 2 ? 'amber' : 'sky', alpha: lvA === 2 ? 0.5 : 0.3, edge: 'ink', edgeW: 2.4, sil: false });
      D.path(D.circ(v3(0, y0, 0), v3(1, 0, 0), v3(0, 0, 1), r2, 0, TAU, 72), 'ink', 2.6, {});
      D.path(D.circ(v3(0, y0, 0), v3(1, 0, 0), v3(0, 0, 1), r1, 0, TAU, 72), 'ink', 2.4, {});
      D.body({ mesh: cav, fill: lvI === 2 ? 'amber' : 'red', alpha: lvI === 2 ? 0.55 : 0.32, edge: 'red', edgeW: 1.8, edgeFn: (e) => (e.chain ? { skip: true } : {}), hidden: false });
      D.body({ mesh: piece, fill: 'red', alpha: 0.2, edge: 'red', edgeW: 2, hidden: true });
      const yaw = Math.atan2(D.cam.sy, D.cam.cy), thR = -yaw, pa = (rr, yy, off) => add3(v3(rr * Math.cos(thR), yy, rr * Math.sin(thR)), off || v3(0, 0, 0));
      const c0 = v3(0, y0, 0);
      D.line(c0, pa(r2, y0), 'amber', 2.4, { dash: [5, 4] }); D.dot(c0, 'ink', 3.5);
      D.tag(pa(r2 * 0.8, y0), `r₂=${M.r2}`, { dy: 14, size: 14, color: 'amber' });
      D.tag(pa(r1 * 0.5, y0), `r₁=${M.r1}`, { dy: -12, size: 14, color: 'red' });
      D.elabel(pa(r2, y0), v3(0, yt, 0), `R₂=${M.R2}`, { side: { x: 1, y: 0.2 }, size: 15, gap: 8 });
      const sh = D.hx(slide);
      D.elabel(add3(pa(r1, y0), sh), add3(v3(0, y0 + h1, 0), sh), `R₁=${M.R1}`, { side: { x: 1, y: 0 }, size: 15, color: 'red', gap: 8 });
      D.tag(add3(v3(0, y0 + h1 / 2, 0), sh), `h₁=${M.h1}`, { size: 13, color: 'red', dx: -2 });
    };
    return {
      id: 'sv5-5', title: '원뿔 속을 원뿔로 판 입체', short: '원뿔 속 원뿔',
      question: '원뿔 모양 그릇의 속을 같은 모양의 작은 원뿔만큼 파내면 부피와 겉넓이는 각각 어떻게 될까?',
      anim: { key: 's55T', dur: 5, label: '파낸 원뿔 빼내기' }, cam0: { yaw: 28, pitch: -22 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['s55K', 's55J', 's55T'],
      presets: () => [{ group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }],
      init: (s) => { s.s55K = 4; s.s55J = 2; s.s55T = 0; s.svMode = 'surf'; },
      reroll: (s) => { s.s55K = rint(2, 4); s.s55J = rint(1, s.s55K - 1); s.svMode = pick(['surf', 'vol'], s.svMode); s.s55T = 0; },
      model, draw,
      check: (s) => {
        const M = model(s), n = 4000;
        if (M.mode === 'vol') { let v = 0; for (let i = 0; i < n; i++) { const y = ((i + 0.5) / n) * M.h2, rr = (M.r2 * y) / M.h2; v += PI * rr * rr * (M.h2 / n); const yc = ((i + 0.5) / n) * M.h1, rc = (M.r1 * yc) / M.h1; v -= PI * rc * rc * (M.h1 / n); } return { ans: v, model: vnum(M.vol) }; }
        let lat = 0, cav = 0; for (let i = 0; i < n; i++) { const y0 = (i / n) * M.h2, y1 = ((i + 1) / n) * M.h2, r0 = (M.r2 * y0) / M.h2, r1 = (M.r2 * y1) / M.h2; lat += PI * (r0 + r1) * Math.hypot(r1 - r0, y1 - y0); const c0 = (i / n) * M.h1, c1 = ((i + 1) / n) * M.h1, q0 = (M.r1 * c0) / M.h1, q1 = (M.r1 * c1) / M.h1; cav += PI * (q0 + q1) * Math.hypot(q1 - q0, c1 - c0); }
        return { ans: lat + PI * (M.r2 * M.r2 - M.r1 * M.r1) + cav, model: vnum(M.surf) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `큰 원뿔(반지름 $${M.r2}$, 높이 $${M.h2}$)의 부피 $V_2=\\frac{1}{3}\\times\\pi\\times${M.r2}^2\\times${M.h2}=${tx(M.v2)}$예요.`,
        `파낸 작은 원뿔(반지름 $${M.r1}$, 높이 $${M.h1}$)의 부피 $V_1=\\frac{1}{3}\\times\\pi\\times${M.r1}^2\\times${M.h1}=${tx(M.v1)}$예요.`,
        `(남은 부피) $=V_2-V_1=${tx(M.vol)}\\,\\mathrm{cm}^3$예요. (부피는 줄어요)`
      ] : [
        `바깥 원뿔의 옆넓이 $\\pi R_2r_2=\\pi\\times${M.R2}\\times${M.r2}=${tx(M.lat2)}$예요.`,
        `윗면은 큰 원에서 작은 원(구멍 입구)을 뺀 고리 모양이에요. $\\pi r_2^2-\\pi r_1^2=${tx(M.ann)}$예요.`,
        `파낸 구멍의 안쪽 면(작은 원뿔의 옆면)이 새로 생겨요. $\\pi R_1r_1=\\pi\\times${M.R1}\\times${M.r1}=${tx(M.lat1)}$예요.`,
        `(겉넓이) $=${tx(M.lat2)}+${tx(M.ann)}+${tx(M.lat1)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요. (겉넓이는 늘어요)`
      ],
      view: (M) => ({
        guide: `<b>파낸 원뿔 빼내기</b> 막대를 끌면 파낸 ${span('red', '작은 원뿔')}이 구멍에서 ${span('red', '가로로')} 빠져나가요. 밑면이 아래에 있고, 아래에서 조금 올려다본 모습이에요. 부피는 <b>줄고</b> 겉넓이는 <b>늘어요</b>.`,
        readouts: M.mode === 'vol' ? [rd('큰 원뿔 V₂', plainVal(M.v2) + ' cm³', 'sky'), rd('파낸 원뿔 V₁', plainVal(M.v1) + ' cm³', 'red'), rd('남은 부피', plainVal(M.vol) + ' cm³', 'green', 'V₂ − V₁')] : [rd('바깥 옆면 πR₂r₂', plainVal(M.lat2) + ' cm²', 'sky'), rd('윗면의 고리', plainVal(M.ann) + ' cm²', 'amber', 'πr₂² − πr₁²'), rd('구멍 안쪽 πR₁r₁', plainVal(M.lat1) + ' cm²', 'red'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'green')],
        formula: `<p>(부피) $=V_2-V_1$ &nbsp;,&nbsp; (겉넓이) $=\\pi R_2r_2+(\\pi r_2^2-\\pi r_1^2)+\\pi R_1r_1$</p>`,
        rule: '속을 파내면 부피는 줄고(큰 뿔 − 작은 뿔), 겉넓이는 안쪽 면만큼 늘어요',
        notes: notes('윗면은 원 전체가 아니라 <b>고리 모양</b>($\\pi r_2^2-\\pi r_1^2$)이에요.', '구멍의 안쪽 면 $\\pi R_1r_1$은 <b>더해요</b>. 부피와 겉넓이의 증감이 서로 반대예요.')
      }),
      prob: (M) => {
        let wrongs;
        if (M.mode === 'vol') wrongs = [[vadd(M.v2, M.v1), '파낸 부분은 빼요.'], [M.v2, '파내기 전 큰 원뿔의 부피예요.'], [M.v1, '파낸 작은 원뿔의 부피예요.'], [V(0, M.r2 * M.r2 * M.h2 - M.r1 * M.r1 * M.h1), '$\\frac{1}{3}$을 곱하지 않았어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.']];
        else wrongs = [[vadd(M.lat2, vadd(V(0, M.r2 * M.r2), M.lat1)), '윗면은 큰 원에서 작은 원을 뺀 고리 모양이에요.'], [vadd(M.lat2, M.ann), '구멍 안쪽 면을 더하지 않았어요.'], [vadd(vsub(M.lat2, M.lat1), M.ann), '구멍 안쪽 면은 빼는 것이 아니라 더해요.'], [vadd(M.lat2, M.lat1), '윗면의 고리를 빠뜨렸어요.'], [M.lat2, '바깥 옆면만 구했어요.']];
        const stem = `그림과 같이 밑면의 반지름이 $${M.r2}\\,\\mathrm{cm}$, 높이가 $${M.h2}\\,\\mathrm{cm}$, 모선의 길이가 $${M.R2}\\,\\mathrm{cm}$인 원뿔의 밑면에서, 같은 모양의 작은 원뿔(밑면의 반지름 $${M.r1}\\,\\mathrm{cm}$, 높이 $${M.h1}\\,\\mathrm{cm}$, 모선 $${M.R1}\\,\\mathrm{cm}$)을 파냈다. 이 입체의 ${M.mode === 'vol' ? '부피' : '겉넓이'}는?`;
        return { tag: M.mode === 'vol' ? '속을 파낸 원뿔의 부피' : '속을 파낸 원뿔의 겉넓이 (함정: 윗면의 고리)', key: `${M.mode}|${M.K}|${M.j}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  /* ================================================================ sv5-6 붙인 입체 종합 */
  const TOP56 = { cyl: '원기둥', hemi: '반구', cone: '원뿔' };
  const CONE56 = { 3: [4, 5], 4: [3, 5], 6: [8, 10] }; // r → [높이, 모선]
  function sv56() {
    const model = (s) => {
      const top = oneOf(s.svTop, ['cyl', 'hemi', 'cone'], 'cyl'), mode = s.svMode === 'vol' ? 'vol' : 'surf', H = clamp(Math.round(s.s56H), 2, 8);
      let r = clamp(Math.round(s.s56R), 1, 5);
      if (top === 'cone') r = [3, 4, 6].includes(r) ? r : 3;
      const a = clamp(Math.max(Math.round(s.s56A), 2 * r), 4, 12), z = clamp(Math.round(s.s56Z), 1, 6);
      s.s56A = a; s.s56R = r; s.s56H = H; s.s56Z = z;
      const box = V(2 * a * a + 4 * a * H), cover = V(0, -r * r), vBox = V(a * a * H);
      let add, vTop, topText, hc = 0, R = 0;
      if (top === 'cyl') { add = V(0, r * r + 2 * r * z); vTop = V(0, r * r * z); topText = `원기둥(높이 ${z})`; }
      else if (top === 'hemi') { add = V(0, 2 * r * r); vTop = V(0, (2 * r * r * r) / 3); topText = '반구'; }
      else { [hc, R] = CONE56[r]; add = V(0, r * R); vTop = V(0, (r * r * hc) / 3); topText = `원뿔(높이 ${hc}, 모선 ${R})`; }
      const surf = vadd(box, vadd(cover, add)), vol = vadd(vBox, vTop);
      return { top, mode, a, H, r, z, hc, R, box, cover, add, vBox, vTop, topText, surf, vol, ans: mode === 'vol' ? vol : surf };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, tot = M.a + (M.top === 'cyl' ? M.z : M.top === 'hemi' ? M.r : M.hc), sc = 4.2 / Math.max(M.a, tot), a = M.a * sc, H = M.H * sc, r = M.r * sc, t = C.problem ? 0 : C.t, sd = ease(t) * (a / 2 + r * 1.5), yTop = H / 2;
      const boxM = boxMesh(-a / 2, a / 2, -H / 2, H / 2, -a / 2, a / 2);
      let topM;
      if (M.top === 'cyl') topM = revolveMesh([[0, 0], [r, 0], [r, M.z * sc], [0, M.z * sc]], { O: v3(0, yTop, 0), N: 40, tags: ['bot', 'side', 'top'] });
      else if (M.top === 'hemi') topM = revolveMesh([[0, 0], [r, 0], ...sphereProfile(r, 0, 90, 14).slice(1)], { O: v3(0, yTop, 0), N: 40, tags: ['bot'] });
      else topM = revolveMesh([[0, 0], [r, 0], [0, M.hc * sc]], { O: v3(0, yTop, 0), N: 40, tags: ['bot', 'side'] });
      const topY = M.top === 'cyl' ? M.z * sc : M.top === 'hemi' ? r : M.hc * sc;
      topM = xfMesh(topM, shiftT(D.hx(sd)));
      const pts = cube8(v3(0, 0, 0), Math.max(a / 2, H / 2)).concat([add3(v3(0, yTop + topY, 0), D.hx(sd)), add3(v3(r, yTop, r), D.hx(sd)), add3(v3(-r, yTop, -r), D.hx(sd))]);
      const bbx = bboxOf(pts.map(D.P));
      const parts = C.problem ? null : M.mode === 'surf' ? [{ v: vnum(M.box), fill: 'sky', label: `상자 ${plainVal(M.box)}`, hl: !C.review ? 1 : st === 1 ? 2 : 1 }, { v: vnum(vmul(M.cover, -1)), fill: 'red', label: `−${plainVal(vmul(M.cover, -1))}`, hl: !C.review ? 1 : st === 2 ? 2 : 1 }, { v: vnum(M.add), fill: 'amber', label: `+${plainVal(M.add)}`, hl: !C.review ? 1 : st === 3 ? 2 : 1 }] : [{ v: vnum(M.vBox), fill: 'sky', label: `상자 ${plainVal(M.vBox)}`, hl: !C.review ? 1 : st === 1 ? 2 : 1 }, { v: vnum(M.vTop), fill: 'amber', label: `+${plainVal(M.vTop)}`, hl: !C.review ? 1 : st === 2 ? 2 : 1 }];
      D.fit(pts, parts ? [{ x: -3, y: bbx.y1 + 0.7 }, { x: 3, y: bbx.y1 + 2.4 }] : [], { l: 40, r: 40, t: 40, b: 44 });
      const lvC = !C.review || M.mode === 'vol' ? 1 : st === 2 ? 2 : 1, lvT = !C.review ? 1 : M.mode === 'surf' ? (st === 3 ? 2 : 1) : (st === 2 ? 2 : 1);
      D.body({ mesh: boxM, fill: 'sky', alpha: 0.2, edge: 'ink', faceStyle: (f) => (f.n && f.n.y > 0.9 && lvC === 2 ? { fill: 'red', alpha: 0.4 } : {}) });
      D.body({ mesh: topM, fill: lvT === 2 ? 'amber' : 'green', alpha: lvT === 2 ? 0.4 : 0.26, edge: 'ink', faceStyle: (f) => (f.tag === 'bot' ? { fill: 'red', alpha: sd > r * 0.5 ? 0.42 : 0.06 } : {}) });
      // 붙은 자리(상자 윗면의 원)
      const cyc = v3(0, yTop, 0);
      if (sd > r * 0.4 && !C.problem) D.disc(cyc, v3(1, 0, 0), v3(0, 0, 1), r, 'red', 0.4, 'red', 2.6);
      D.elabel(v3(-a / 2, -H / 2, a / 2), v3(a / 2, -H / 2, a / 2), `a=${M.a}`, { side: { x: 0, y: 1 }, size: 15, color: 'amber', gap: 8 });
      D.elabel(v3(a / 2, -H / 2, a / 2), v3(a / 2, H / 2, a / 2), `${M.H}`, { side: { x: 1, y: 0 }, size: 15, color: 'amber', gap: 8 });
      const ytopC = add3(v3(0, yTop, 0), D.hx(sd));
      D.line(ytopC, add3(ytopC, D.hx(r)), 'ink', 2.4); D.dot(ytopC, 'ink', 3.5);
      D.tag(add3(ytopC, D.hx(r / 2)), `r=${M.r}`, { dy: -11, size: 14, color: 'amber' });
      if (M.top === 'cyl') D.elabel(add3(v3(r, yTop, 0), D.hx(sd)), add3(v3(r, yTop + M.z * sc, 0), D.hx(sd)), `${M.z}`, { side: { x: 1, y: 0 }, size: 14, color: 'amber', gap: 6 });
      if (M.top === 'cone') { D.elabel(add3(v3(r, yTop, 0), D.hx(sd)), add3(v3(0, yTop + M.hc * sc, 0), D.hx(sd)), `${M.R}`, { side: { x: 1, y: 0 }, size: 14, gap: 6 }); D.line(ytopC, add3(ytopC, v3(0, M.hc * sc, 0)), 'amber', 2.2, { dash: [5, 4] }); D.tag(add3(ytopC, v3(0, M.hc * sc / 2, 0)), `${M.hc}`, { dx: -12, size: 13, color: 'amber' }); }
      if (!C.problem) {
        G.drawBars(D, parts, 0, bbx.y1 + 0.7, 5.6, 0, {});
        b.text({ x: 0, y: bbx.y1 + 0.7 + 0.62 }, M.mode === 'surf' ? `겉넓이 = ${plainVal(M.surf)}` : `부피 = ${plainVal(M.vol)}`, { dy: 36, size: D.fs(15), weight: 800, color: 'green', baseline: 'middle' });
      }
    };
    return {
      id: 'sv5-6', title: '붙인 입체 종합', short: '붙인 입체 종합',
      question: '상자 위에 다른 입체를 올려 붙이면 겉넓이는 어떻게 구할까? 붙은 자리는 어떻게 될까?',
      anim: { key: 's56T', dur: 4, label: '위 입체 떼어 놓기' }, cam0: { yaw: 28, pitch: 24 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: (s) => ['s56A', 's56H', 's56R'].concat(oneOf(s.svTop, ['cyl', 'hemi', 'cone'], 'cyl') === 'cyl' ? ['s56Z'] : [], ['s56T']),
      presets: () => Object.keys(TOP56).map((k, i) => ({ group: i === 0 ? '위에 올린 입체' : '', label: TOP56[k], apply: (st) => { st.svTop = k; }, on: (st) => oneOf(st.svTop, ['cyl', 'hemi', 'cone'], 'cyl') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }]),
      init: (s) => { s.svTop = 'cyl'; s.svMode = 'surf'; s.s56A = 8; s.s56H = 4; s.s56R = 3; s.s56Z = 3; s.s56T = 0; },
      reroll: (s) => { s.svTop = pick(['cyl', 'hemi', 'cone'], s.svTop); s.svMode = pick(['surf', 'vol'], s.svMode); s.s56R = s.svTop === 'cone' ? pick([3, 4, 6], -1) : rint(1, 5); s.s56A = rint(Math.max(4, 2 * s.s56R), 12); s.s56H = rint(2, 8); s.s56Z = rint(1, 6); s.s56T = 0; },
      model, draw,
      check: (s) => {
        const M = model(s), N = 5000;
        if (M.mode === 'vol') { let v = M.a * M.a * M.H; if (M.top === 'cyl') v += PI * M.r * M.r * M.z; else if (M.top === 'hemi') for (let i = 0; i < N; i++) { const y = ((i + 0.5) / N) * M.r; v += PI * (M.r * M.r - y * y) * (M.r / N); } else for (let i = 0; i < N; i++) { const y = ((i + 0.5) / N) * M.hc, rr = (M.r * (M.hc - y)) / M.hc; v += PI * rr * rr * (M.hc / N); } return { ans: v, model: vnum(M.vol) }; }
        let sArea = 2 * M.a * M.a + 4 * M.a * M.H - PI * M.r * M.r;
        if (M.top === 'cyl') sArea += PI * M.r * M.r + 2 * PI * M.r * M.z;
        else if (M.top === 'hemi') for (let i = 0; i < N; i++) { const a0 = (PI / 2) * (i / N), a1 = (PI / 2) * ((i + 1) / N); sArea += PI * (M.r * Math.cos(a0) + M.r * Math.cos(a1)) * Math.hypot(M.r * (Math.sin(a1) - Math.sin(a0)), M.r * (Math.cos(a1) - Math.cos(a0))); }
        else for (let i = 0; i < N; i++) { const y0 = (i / N) * M.hc, y1 = ((i + 1) / N) * M.hc, r0 = (M.r * (M.hc - y0)) / M.hc, r1 = (M.r * (M.hc - y1)) / M.hc; sArea += PI * (r0 + r1) * Math.hypot(r1 - r0, y1 - y0); }
        return { ans: sArea, model: vnum(M.surf) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `아래 상자의 부피는 $${M.a}\\times${M.a}\\times${M.H}=${tx(M.vBox)}\\,\\mathrm{cm}^3$예요.`,
        `위에 올린 ${M.topText}의 부피는 ${M.top === 'cyl' ? `$\\pi\\times${M.r}^2\\times${M.z}$` : M.top === 'hemi' ? `$\\frac{1}{2}\\times\\frac{4}{3}\\pi\\times${M.r}^3$` : `$\\frac{1}{3}\\times\\pi\\times${M.r}^2\\times${M.hc}$`}$=${tx(M.vTop)}$예요.`,
        `(부피) $=${tx(M.vBox)}+${tx(M.vTop)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요. (붙은 면은 부피에 영향이 없어요)`
      ] : [
        `아래 상자의 겉넓이는 $2a^2+4aH=2\\times${M.a}^2+4\\times${M.a}\\times${M.H}=${tx(M.box)}\\,\\mathrm{cm}^2$예요.`,
        `위 입체가 붙은 자리(반지름 $${M.r}$인 원)는 겉면에서 없어져요. $-\\pi r^2=${tx(M.cover)}$예요.`,
        `위에 올린 ${M.topText}의 겉면(붙은 밑면은 제외)을 더해요: ${M.top === 'cyl' ? `옆면 $2\\pi\\times${M.r}\\times${M.z}$ + 윗면 $\\pi\\times${M.r}^2$` : M.top === 'hemi' ? `곡면 $2\\pi\\times${M.r}^2$` : `옆면 $\\pi\\times${M.R}\\times${M.r}$`} $=${tx(M.add)}$예요.`,
        `(겉넓이) $=${tx(M.box)}${tx(M.cover).startsWith('-') ? '' : '+'}${tx(M.cover)}+${tx(M.add)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `위 칩에서 <b>위에 올린 입체</b>와 <b>구하는 것</b>을 골라 보세요. <b>위 입체 떼어 놓기</b>를 끌면 올린 입체가 ${span('green', '가로로')} 옮겨지고 상자 위에 ${span('red', '붙어 있던 원')}이 드러나요. 겉넓이는 이 원을 <b>빼고</b> 위 입체의 겉면을 <b>더해요</b>.`,
        readouts: M.mode === 'vol' ? [rd('상자의 부피', plainVal(M.vBox) + ' cm³', 'sky'), rd(`${TOP56[M.top]}의 부피`, plainVal(M.vTop) + ' cm³', 'green'), rd('부피', plainVal(M.vol) + ' cm³', 'amber')] : [rd('상자의 겉넓이', plainVal(M.box) + ' cm²', 'sky'), rd('붙은 자리(제외)', plainVal(M.cover) + ' cm²', 'red', 'πr²'), rd(`위 입체의 겉면`, '+' + plainVal(M.add) + ' cm²', 'green', M.top === 'cyl' ? '옆면+윗면' : M.top === 'hemi' ? '곡면' : '옆면'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'amber')],
        formula: `<p>(겉넓이) $=$ (상자의 겉넓이) $-$ (붙은 자리) $+$ (위 입체의 겉면, 붙은 밑면 제외) &nbsp;·&nbsp; (부피) $=$ (상자) $+$ (위 입체)</p>`,
        rule: '붙인 입체: 붙은 면은 양쪽에서 빼고, 겉으로 드러난 면만 더해요',
        notes: notes('위에 올린 입체의 <b>밑면(붙은 면)은 더하지 않아요</b>. 상자의 윗면에서도 그 자리를 빼요.', '원기둥을 올리면 붙은 원을 빼고 윗면의 원을 더해서 서로 <b>지워져요</b>($+2\\pi rz$만 늘어요).', '원뿔의 옆넓이에는 모선을, 부피에는 높이를 써요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        const topDesc = M.top === 'cyl' ? `반지름 $${M.r}\\,\\mathrm{cm}$, 높이 $${M.z}\\,\\mathrm{cm}$인 원기둥` : M.top === 'hemi' ? `반지름 $${M.r}\\,\\mathrm{cm}$인 반구` : `밑면의 반지름 $${M.r}\\,\\mathrm{cm}$, 높이 $${M.hc}\\,\\mathrm{cm}$, 모선 $${M.R}\\,\\mathrm{cm}$인 원뿔`;
        if (M.mode === 'vol') {
          wrongs = [[vadd(M.vBox, vmul(M.vTop, 3)), M.top === 'hemi' ? '반구의 부피는 구의 절반이에요.' : '뿔의 부피에는 $\\frac{1}{3}$을 곱해요. 높이를 곱하는 값을 확인하세요.'], [M.vBox, '위에 올린 입체를 빠뜨렸어요.'], [vadd(M.vBox, V(0, 2 * M.r * M.r * M.r)), '위 입체의 부피를 잘못 구했어요.'], [vsub(M.vBox, M.vTop), '붙인 입체의 부피는 더해요.'], [M.surf, '겉넓이를 구했어요.']];
          stem = `그림과 같이 밑면이 한 변 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 높이가 $${M.H}\\,\\mathrm{cm}$인 사각기둥 위에 ${topDesc}을(를) 붙였다. 이 입체의 부피는?`.replace('을(를)', M.top === 'hemi' ? '를' : '을');
        } else {
          wrongs = [[vadd(M.box, M.add), '상자 윗면에서 붙은 자리(원)를 빼지 않았어요.'], [vadd(M.box, vadd(M.cover, vadd(M.add, V(0, M.r * M.r)))), '위 입체의 붙은 밑면은 더하지 않아요.'], [vadd(M.box, M.cover), '위 입체의 겉면을 더하지 않았어요.'], [vadd(M.box, vadd(vmul(M.cover, 2), M.add)), '붙은 자리는 한 번만 빼요.'], [M.vol, '부피를 구했어요.']];
          if (M.top === 'cyl') wrongs[1] = [vadd(M.box, vadd(M.cover, V(0, 2 * M.r * M.z + 2 * M.r * M.r))), '위 원기둥의 붙은 밑면은 더하지 않아요.'];
          stem = `그림과 같이 밑면이 한 변 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 높이가 $${M.H}\\,\\mathrm{cm}$인 사각기둥 위에 ${topDesc}${M.top === 'hemi' ? '를' : '을'} 붙였다(붙은 면은 원 전체가 상자의 윗면 안에 있다). 이 입체의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '붙인 입체의 부피' : '붙인 입체의 겉넓이 (함정: 붙은 면)', key: `${M.top}|${M.mode}|${M.a}|${M.H}|${M.r}|${M.z}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  G.register(50, 't5', '⑤ 붙이고 파낸 입체', '붙이고 파낸', PARAMS, [sv51(), sv52(), sv53(), sv54(), sv55(), sv56()]);
})();
