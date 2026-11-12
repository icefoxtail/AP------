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
    s51A: P('정사각형의 한 변', 4, 15, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    s51H: P('기둥의 길이(높이)', 1, 20, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    s51Q: P('구멍의 반지름', 1, 7, 1, 2, { color: 'red', hint: '정사각형의 한 변의 절반보다 작아야 해요', format: (v) => v + ' cm', clampTo: (s) => [1, Math.min(7, Math.floor((Math.round(s.s51A) - 1) / 2))] }),
    s51T: P('뚫기 · 열기 · 분해', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '구멍 없음' : v < 0.25 ? '구멍 막대가 가로로 관통' : v < 0.55 ? '앞쪽 절반을 옆으로 열기' : v > 0.99 ? '분해 완료' : '조각을 가로로 늘어놓기') }),
    s52D: P('구멍의 깊이', 1, 19, 1, 3, { color: 'red', format: (v) => v + ' cm', clampTo: (s) => [1, Math.max(1, Math.round(s.s51H) - 1)] }),
    s52U: P('구멍의 크기', 1, 13, 1, 2, { color: 'red', hint: '원 구멍은 반지름, 정사각 구멍은 한 변의 길이예요', format: (v) => v + ' cm', clampTo: (s) => [1, (s.svK52 || 'cb') === 'cb' ? Math.min(7, Math.floor((Math.round(s.s51A) - 1) / 2)) : Math.min(13, Math.round(s.s51A) - 2)] }),
    s52T: P('구멍 살펴보기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '구멍 모형' : v < 0.5 ? '구멍 표시' : v > 0.99 ? '확인 완료' : '구멍 살펴보기') }),
    s53A: P('정육면체의 한 모서리', 4, 15, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    s53P: P('잘라 내는 작은 정육면체의 한 모서리', 1, 14, 1, 2, { color: 'red', hint: '한 모서리가 이 길이인 작은 정육면체를 잘라 내요', format: (v) => v + ' cm', clampTo: (s) => [1, (s.svCnt || 1) === 1 ? Math.round(s.s53A) - 1 : Math.floor((Math.round(s.s53A) - 1) / 2)] }),
    s53T: P('조각 빼내기 · 합동 확인', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '붙어 있음' : v < 0.3 ? '반짝이는 중' : v < 0.6 ? '가로로 빠지는 중' : v > 0.99 ? '합동 확인' : '타일이 가로로 겹치는 중') }),
    s54A: P('정육면체의 한 모서리', 4, 15, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    s54P: P('파낸 높이(위에서 아래로)', 1, 14, 1, 2, { color: 'red', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 1] }),
    s54Q: P('파낸 폭(앞에서 뒤로)', 1, 14, 1, 2, { color: 'red', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 1] }),
    s54C: P('모서리를 따라 파낸 길이', 1, 13, 1, 3, { color: 'sky', hint: '정육면체의 한 모서리보다 짧아야 양 끝이 남아요', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 2] }),
    s54W: P('홈의 폭', 1, 13, 1, 2, { color: 'sky', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 2] }),
    s54Z: P('홈의 깊이', 1, 14, 1, 2, { color: 'red', format: (v) => v + ' cm', clampTo: (s) => [1, Math.round(s.s54A) - 1] }),
    s54T: P('조각 빼내기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '붙어 있음' : v > 0.99 ? '빠짐' : Math.round(v * 100) + '%') }),
    s55K: P('큰 원뿔의 크기', 2, 5, 1, 4, { color: 'sky', hint: '반지름 3·높이 4·모선 5인 원뿔의 몇 배인지 정해요', format: (v) => `반지름 ${3 * v}, 모선 ${5 * v}` }),
    s55J: P('파낸 원뿔의 크기', 1, 4, 1, 2, { color: 'red', hint: '파낸 원뿔은 큰 원뿔과 같은 모양이고 더 작아요', format: (v) => `반지름 ${3 * v}, 모선 ${5 * v}`, clampTo: (s) => [1, Math.round(s.s55K) - 1] }),
    s55T: P('파낸 원뿔 빼내기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '구멍에 들어 있음' : v > 0.99 ? '빠짐' : Math.round(v * 100) + '%') }),
    s56A: P('아래 상자의 한 변', 4, 15, 1, 8, { color: 'amber', hint: '위 입체의 지름보다 커야 해요', format: (v) => v + ' cm', clampTo: (s) => [Math.max(4, 2 * Math.round(s.s56R)), 15] }),
    s56H: P('아래 상자의 높이', 2, 20, 1, 4, { color: 'sky', format: (v) => v + ' cm' }),
    s56R: P('위 입체의 반지름', 1, 7, 1, 3, { color: 'red', hint: '밑면의 반지름은 상자의 한 변의 절반 이하예요(원뿔은 3·4·6 cm)', format: (v) => v + ' cm', clampTo: (s) => { if (s.svTop === 'cone') { const r = Math.round(s.s56R), near = [3, 4, 6].reduce((p, q) => (Math.abs(q - r) < Math.abs(p - r) ? q : p)); return [near, near]; } return [1, 7]; } }),
    s56Z: P('위 원기둥의 높이', 1, 20, 1, 3, { color: 'red', format: (v) => v + ' cm' }),
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
  // 입체 윗면의 가장 위 모서리보다 위에, 가운데 맞춰 글을 둡니다(입체 선과 겹치지 않게)
  const topText = (D, y, hx, hz, str, o = {}) => {
    const sh = o.shift || 0, ps = [[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([i, j]) => [D.P(v3(i * hx, y, j * hz)), D.P(add3(v3(i * hx, y, j * hz), D.hx(sh)))]), x0 = Math.min(...ps.map((q) => q.x)), x1 = Math.max(...ps.map((q) => q.x)), yy = Math.min(...ps.map((q) => q.y));
    D.b.text({ x: (x0 + x1) / 2, y: yy }, str, Object.assign({ dy: -18, size: D.fs(15), weight: 800, color: 'ink', baseline: 'middle' }, o));
  };
  function slideTiles(R, te) { R.rows.forEach((L) => { const st = -L.total / 2; L.tiles.forEach((tl) => { tl.x = st + (tl.x - st) * te; }); }); }
  const totalText = (D, R, topY, text, dy = 50) => { if(D.lessonHide)return; const px = D.b.toS({ x: 0, y: topY + R.height }); D.b.stext(px.x, px.y + dy, text, { size: D.fs(15), weight: 800, color: 'green', align: 'center', baseline: 'middle' }); };
  // 조각 줄의 이름표·값이 옆 조각의 글자와 겹치지 않게 조각 사이 간격을 넓힙니다(조각 크기·축척은 그대로, 조각은 자기 칸 가운데).
  // 화면 배율은 직전 그림의 배율(b.k)을 쓰고, 줄 전체 폭은 Wt 의 1.12배로 막아 되먹임으로 줄이 끝없이 넓어지지 않게 합니다.
  function spaceRows(D, R, Wt, margin = 12) {
    const { b } = D, k = Math.max(30, Math.min(b.k || 70, (b.W - 60) / Wt)), eff = D.fs(15) * b.fs * b._ts(), effC = D.fs(13) * b.fs * b._ts();
    let tot = 0;
    R.rows.forEach((L) => {
      const slots = L.tiles.map((t) => {
        const lab = t.label || t.lab || '', cap = t.cap || t.capt || '', sPx = t.sw * k;
        const below = t.lab ? true : !!t.label && (t.shape === 'hole' || G.textW(t.label, eff) + 6 > sPx || t.sh * k < eff * 1.4);
        const wPx = Math.max(cap ? G.textW(cap, effC) + 8 : 0, below ? G.textW(lab, eff) + 8 : 0, sPx + (t.count > 1 ? 12 : 0));
        return Math.max(t.sw, (wPx + margin) / k);
      });
      let total = slots.reduce((u, v) => u + v, 0);
      const lim = Wt * 1.12;
      if (total > lim) { const f = lim / total; for (let i = 0; i < slots.length; i++) slots[i] = Math.max(L.tiles[i].sw, slots[i] * f); total = slots.reduce((u, v) => u + v, 0); }
      let x = -total / 2;
      L.tiles.forEach((t, i) => { t.x = x + (slots[i] - t.sw) / 2; x += slots[i]; });
      L.total = total; tot = Math.max(tot, total);
    });
    R.total = tot;
    return R;
  }
  const fanPts = (ax, ay, R, deg, n = 56) => { const o = [{ x: ax, y: ay }]; for (let i = 0; i <= n; i++) { const th = PI / 2 - (deg * DEG) / 2 + (deg * DEG * i) / n; o.push({ x: ax + R * Math.cos(th), y: ay + R * Math.sin(th) }); } return o; };
  // 조각 줄을 그립니다. drawTiles 에 없는 「정사각형 구멍이 난 정사각형」(shape 'sqhole', t.holeW = 구멍의 한 변)을 이 장면 안에서 덧그립니다.
  // 글자는 t.lab(값)·t.capt(이름)로 줍니다(공용으로 올릴 후보).
  function drawRows(D, R, cx, top) {
    G.drawTileRows(D, R, cx, top);
    const { b } = D, c0 = b.ctx;
    R.rows.forEach((L) => {
      const base = top + L.offset + L.height;
      L.tiles.forEach((t) => {
        if (t.shape === 'fan') { // 부채꼴(꼭짓점이 위): t.R 반지름, t.deg 중심각, t.top 꼭짓점 위로 올라온 높이(같은 단위). 글자는 t.lab·t.capt
          const hl = t.hl == null ? 1 : t.hl, alpha = (t.alpha == null ? 0.3 : t.alpha) * (hl === 0 ? 0.35 : hl === 2 ? 1.35 : 1), mx = cx + t.x + t.sw / 2;
          b.path(fanPts(mx, base - t.sh + t.top * t.k, t.R * t.k, t.deg), { close: true, fill: t.fill, fillAlpha: alpha, color: t.fill, width: hl === 2 ? 3.4 : 2.4 });
          const eff = D.fs(15) * b.fs * b._ts();
          if (t.lab) b.text({ x: mx, y: base }, t.lab, { dy: eff * 0.95, color: 'ink', size: D.fs(15), weight: 800, align: 'center', baseline: 'middle' });
          if (t.capt) b.text({ x: mx, y: base }, t.capt, { dy: eff * 2.5, color: 'muted', size: D.fs(13), weight: 750, align: 'center', baseline: 'middle' });
          return;
        }
        if (t.shape !== 'sqhole') return;
        const n = t.count || 1, hl = t.hl == null ? 1 : t.hl, alpha = (t.alpha == null ? 0.3 : t.alpha) * (hl === 0 ? 0.35 : hl === 2 ? 1.35 : 1);
        const ecol = t.edge || t.fill || 'sky', ew = hl === 2 ? 3.4 : hl === 0 ? 1.3 : 2.4, ea = hl === 0 ? 0.45 : 1, g = t.holeW * t.k;
        for (let c = n - 1; c >= 0; c--) {
          const o = c * 0.09 * Math.min(1, t.k * 2), X0 = cx + t.x + o, Y0 = base - t.sh - o, sw = t.sw;
          const s0 = b.toS({ x: X0, y: Y0 }), s1 = b.toS({ x: X0 + sw, y: Y0 + t.sh }), h0 = b.toS({ x: X0 + (sw - g) / 2, y: Y0 + (t.sh - g) / 2 }), h1 = b.toS({ x: X0 + (sw + g) / 2, y: Y0 + (t.sh + g) / 2 });
          c0.save(); c0.beginPath(); c0.rect(s0.x, s0.y, s1.x - s0.x, s1.y - s0.y); c0.rect(h0.x, h0.y, h1.x - h0.x, h1.y - h0.y);
          c0.fillStyle = b.color(t.fill, c === 0 ? alpha : alpha * 0.7); c0.fill('evenodd'); c0.restore();
          b.path([{ x: X0, y: Y0 }, { x: X0 + sw, y: Y0 }, { x: X0 + sw, y: Y0 + t.sh }, { x: X0, y: Y0 + t.sh }], { close: true, color: ecol, width: ew, alpha: ea });
          b.path([{ x: X0 + (sw - g) / 2, y: Y0 + (t.sh - g) / 2 }, { x: X0 + (sw + g) / 2, y: Y0 + (t.sh - g) / 2 }, { x: X0 + (sw + g) / 2, y: Y0 + (t.sh + g) / 2 }, { x: X0 + (sw - g) / 2, y: Y0 + (t.sh + g) / 2 }], { close: true, color: ecol, width: ew, alpha: ea });
        }
        const eff = D.fs(15) * b.fs * b._ts(), mx = cx + t.x + t.sw / 2;
        if (t.lab) b.text({ x: mx, y: base }, t.lab, { dy: eff * 0.95, color: 'ink', size: D.fs(15), weight: 800, align: 'center', baseline: 'middle' });
        if (t.capt) b.text({ x: mx, y: base }, t.capt, { dy: eff * 2.5, color: 'muted', size: D.fs(13), weight: 750, align: 'center', baseline: 'middle' });
      });
    });
  }

  /* ================================================================ sv5-1 구멍 뚫린 입체 (Ⅳ-1) */
  function sv51() {
    const model = (s) => {
      const a = clamp(Math.round(s.s51A), 4, 15), h = clamp(Math.round(s.s51H), 1, 20), q = clamp(Math.round(s.s51Q), 1, Math.min(7, Math.floor((a - 1) / 2)));
      s.s51A = a; s.s51H = h; s.s51Q = q;
      const S0 = V(2 * a * a + 4 * a * h), minus = V(0, -2 * q * q), plus = V(0, 2 * q * h), delta = vadd(minus, plus), tot = vadd(S0, delta), trend = h > q ? 'up' : h < q ? 'down' : 'same';
      return { a, h, q, S0, minus, plus, delta, tot, trend, ans: tot };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, sc = 3.4 / Math.max(M.a, M.h * 0.9), A = (M.a * sc) / 2, Hh = M.h * sc, qu = M.q * sc, narrow = b.W < 560;
      const t = C.problem ? 0.3 : C.t, rodA = t < 0.3 ? Math.sin((PI * t) / 0.3) : 0, open = ease(lin01(t, 0.3, 0.6)), te = ease(lin01(t, 0.6, 0.95));
      const dMax = C.problem ? 0 : A * 2 + 0.9, dOpen = open * (A * 2 + 0.9), closed = open < 0.02, plain = t < 0.15 && !C.problem, y0 = -Hh / 2, y1 = Hh / 2;
      const hlOf = (k) => (!C.review ? 1 : st === k ? 2 : st === 4 ? 3 : 1);
      const t0 = { w: M.a, h: M.a, shape: 'hole', holeR: M.q / M.a, count: 2, fill: 'sky', label: plainVal(V(M.a * M.a, -M.q * M.q)), cap: '뚫린 면 ×2', hl: hlOf(2) };
      const t1 = { w: M.a, h: M.h, shape: 'rect', count: 4, fill: 'sky', label: `${M.a * M.h}`, cap: '바깥 옆면 ×4', hl: hlOf(1) };
      const t2 = { w: 2 * PI * M.q, h: M.h, shape: 'rect', fill: 'amber', label: `2×π×${M.q}×${M.h} = ${plainVal(M.plus)}`, cap: '안쪽 옆면', hl: hlOf(3) };
      const R = null;
      const pts = cube8(v3(0, 0, 0), Math.max(A, Hh / 2)).concat(cube8(D.hx(C.problem ? 0 : dOpen), Math.max(A, Hh / 2))); // 지금 프레임(열린 만큼)만으로 맞춰요
      const bb = bboxOf(pts.map(D.P));
      // 구멍 뚫기 전(첫 화면): 직육면체의 면 6개를 조각 줄로 보여 줍니다(겉넓이 식이 입체 위에 뜨지 않게)
      const Rp = null;
      const blend = narrow && R ? ease(lin01(te, 0, 0.15)) : 0, rowTop = bb.y1 + 0.9;
      if (blend > 0) {
        const mix = (p, q) => p + (q - p) * blend;
        D.fit([], [{ x: mix(bb.x0, -R.total / 2), y: mix(bb.y0, rowTop) }, { x: mix(bb.x1, R.total / 2), y: mix(bb.y1, rowTop + R.height + 2.6) }], { l: 82, r: (C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 38), t: 32, b: 34 });
      } else D.fit(pts, R && !narrow && te > 0.01 ? [{ x: -R.total / 2, y: rowTop }, { x: R.total / 2, y: rowTop + R.height + 2.6 }] : Rp ? [{ x: -Rp.total / 2, y: rowTop }, { x: Rp.total / 2, y: rowTop + Rp.height + 2.6 }] : [], { l: 82, r: (C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 38), t: 32, b: 34 });
      if (R) spaceRows(D, R, narrow ? 4.6 : 6.4); // 화면 배율이 정해진 뒤 한 번 더: 글자가 겹치지 않게 간격 조정
      if (Rp) spaceRows(D, Rp, 6.4);
      const showSolid = !(R && narrow && te > 0.15);
      const lvAll = !C.review ? 1 : st === 1 ? 2 : 1, lvWall = !C.review ? 1 : st === 3 ? 2 : 1;
      if (!showSolid) {
        // 휴대폰: 조각 줄이 펼쳐지는 동안 입체는 물러나요
      } else if (plain) {
        D.body({ mesh: boxMesh(-A, A, y0, y1, -A, A), fill: 'sky', alpha: 0.22, edge: 'ink' });
        // 뚫릴 자리: 붉은 반투명 원기둥(윗면의 원은 실선, 상자 속에 가려진 부분은 점선)
        const ghost = revolveMesh([[0, y0], [qu, y0], [qu, y1], [0, y1]], { N: 40 });
        D.body({ mesh: ghost, fill: 'red', alpha: 0.18, edgeFn: () => ({ skip: true }), hidden: false, sil: false });
        D.path(D.circ(v3(0, y1, 0), v3(1, 0, 0), v3(0, 0, 1), qu, 0, TAU, 60), 'red', 2.6);
        D.path(D.circ(v3(0, y0, 0), v3(1, 0, 0), v3(0, 0, 1), qu, 0, TAU, 60), 'red', 2.2, { dash: [6, 5], alpha: 0.85 });
        G.silLines(ghost, D.vw).forEach(([pa, pb]) => D.line(pa, pb, 'red', 2.2, { dash: [6, 5], alpha: 0.85 }));
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
        // 정사각형의 두 변(앞 · 오른쪽 아래 모서리)과 높이(왼쪽 세로 모서리): 도형 바깥 치수선. 입체가 벌어지면 두 변은 사라집니다.
        const dimA = 1 - lin01(open, 0, 0.25), c0 = v3(0, 0, 0);
        D.dim(v3(-A, y0, A), v3(A, y0, A), `${M.a}`, { from: c0, off: 15, alpha: dimA });
        D.dim(v3(A, y0, A), v3(A, y0, -A), `${M.a}`, { from: c0, off: 15, alpha: dimA });
        D.dim(v3(-A, y0, A), v3(-A, y1, A), `높이 ${M.h}`, { side: { x: -1, y: 0 }, off: 18, color: 'amber' });
        // 구멍의 반지름: 윗면 중심에서 오른쪽 앞으로
        if (open < 0.02) { const ct = v3(0, y1, 0); D.radius(ct, add3(ct, mul3(D.rightFront(), qu)), `반지름 ${M.q}`, { color: 'red', end: true, gap: 14 }); }
      }
      if (!C.problem) {
        if (!showSolid) { /* 입체 글자 없음 */ } else if (plain) { if (Rp) { G.drawTileRows(D, Rp, 0, rowTop); totalText(D, Rp, rowTop, `구멍 뚫기 전 겉넓이 = ${M.a * M.a}×2 + ${M.a * M.h}×4 = ${plainVal(M.S0)}`, 64); } }
        else if (open > 0.3 && !C.review && C.tab !== 'explore') topText(D, y1, A, A, `노란 면 = 안쪽 벽 (높이 ${M.h}, 둘레 2×π×${M.q})`, { shift: dOpen, size: D.fs(14), color: 'amber' });
        if (R && te > (narrow ? 0.15 : 0.01)) {
          slideTiles(R, te);
          const top = rowTop;
          G.drawTileRows(D, R, 0, top);
          if (te > 0.95) totalText(D, R, top, `겉넓이 = ${plainVal(M.tot)}`, 64);
        }
      }
      // 정리 탭: 지금 단계의 식 한 줄. 결과 줄은 해설 재생 중 svShowV 까지 숨김.
      G.stepRow(D, C, [null,
        [{ t: `뚫기 전 겉넓이 = ${M.a}×${M.a}×2 + ${M.a}×${M.h}×4 = ${plainVal(M.S0)}`, c: 'ink' }],
        [{ t: `없어지는 입구 2개: −2×π×${M.q}² = ${plainVal(M.minus).replace('-', '−')}`, c: 'red' }],
        [{ t: `새로 생기는 안쪽 옆면: 2×π×${M.q}×${M.h} = ${plainVal(M.plus)}`, c: 'amber' }],
        [{ t: `겉넓이 = ${plainVal(M.S0)} ${plainVal(M.minus).replace('-', '− ')} + ${plainVal(M.plus)} = ${plainVal(M.tot)}`, c: 'green' }]][Math.min(Math.max(C.step || 0, 0), 4)], { gated: (C.step || 0) >= 4 });
    };
    return {
      id: 'sv5-1', title: '구멍 뚫린 입체', short: '구멍 뚫린 입체',
      question: '기둥에 구멍을 뚫으면 겉넓이는 어떻게 달라질까? 없어지는 면과 새로 생기는 면을 각각 찾아보자.',
      anim: { key: 's51T', dur: 4, label: '뚫고 열어 보기' }, cam0: { yaw: 28, pitch: 22 }, stepT: (n) => [0, 0.02, 0.3, 0.5, 1][Math.min(n, 4)], thumbT: 0.5, problemT: 0.3,
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
        `구멍을 뚫기 전 직육면체의 겉넓이는 $${M.a}\\times${M.a}\\times2+4\\times${M.a}\\times${M.h}=${M.a * M.a * 2}+${4 * M.a * M.h}=${tx(M.S0)}\\,\\mathrm{cm}^2$예요.`,
        `기둥의 양쪽 면에 구멍 입구(반지름 $${M.q}$인 원)가 2개 생겨 겉면이 없어져요. $-2\\times\\pi\\times${M.q}^2=${tx(M.minus)}$예요.`,
        `구멍 안쪽에 새로운 <b>옆면</b>이 생겨요. 가로가 둘레 $2\\times\\pi\\times${M.q}=${tx(V(0, 2 * M.q))}$, 세로가 높이 $${M.h}$인 직사각형이므로 $${tx(V(0, 2 * M.q))}\\times${M.h}=${tx(M.plus)}$예요.`,
        `(새 겉넓이) $=$ (뚫기 전 겉넓이) $-$ (입구 2개) $+$ (안쪽 옆면) $=${tx(M.S0)}${tx(M.minus)}+${tx(M.plus)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines:[{text:'겉넓이 = 원래 겉넓이 − 입구 2개 + 안쪽 벽',color:'ink'},{text:`$${tx(M.S0)}${tx(M.minus)}+${tx(M.plus)}=${tx(M.tot)}\\,\\mathrm{cm}^{2}$`,color:'ink'},{text:'구멍 안쪽에도 새로운 면이 생겨요.',color:'ink'}]} : null,
        guide: `<b>뚫기·열기·분해</b> 막대를 끌거나 ▶를 눌러 보세요. ${span('amber', '구멍 막대')}가 기둥을 가로로 관통하고, 앞쪽 절반이 옆으로 열려 ${span('amber', '안쪽 벽')}이 드러나요. 없어진 입구와 새로 생긴 안쪽 벽을 살펴보세요. <b>구멍의 반지름</b>과 <b>기둥의 길이</b>를 바꿔 겉넓이가 늘고 주는 경우를 찾아보세요.`,
        alert: { tone: M.trend === 'up' ? 'warn' : 'key', text: M.trend === 'up' ? `구멍이 뚫리면 안쪽에 새로운 벽면이 생겨요! 기둥의 길이 $${M.h}$가 구멍의 반지름 $${M.q}$보다 크므로 겉넓이가 <b>늘어요</b> (변화 $${tx(M.minus)}+${tx(M.plus)}=+${tx(M.delta)}$).` : M.trend === 'down' ? `기둥의 길이 $${M.h}$가 구멍의 반지름 $${M.q}$보다 작은 얇은 판이에요. 이때는 입구 두 원이 안쪽 벽보다 커서 겉넓이가 <b>줄어요</b> (변화 $${tx(M.delta)}$).` : `기둥의 길이와 구멍의 반지름이 같아서 겉넓이가 <b>변하지 않아요</b>.` },
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : [rd('구멍 뚫기 전', plainVal(M.S0) + ' cm²', 'sky', `${M.a}×${M.a}×2 + 4×${M.a}×${M.h}`), rd('없어진 입구 2개', plainVal(M.minus) + ' cm²', 'red', `−2×π×${M.q}×${M.q}`), rd('생긴 안쪽 벽', '+' + plainVal(M.plus) + ' cm²', 'amber', `2×π×${M.q}×${M.h}`), rd('새 겉넓이', plainVal(M.tot) + ' cm²', 'green', `변화 ${vnum(M.delta) >= 0 ? '+' : ''}${plainVal(M.delta)}`)],
        formula: `<p>(구멍 뚫린 입체의 겉넓이) $=$ (뚫기 전 겉넓이) $-$ (입구 2개) $+$ (안쪽 옆면)</p>`,
        rule: '구멍을 뚫으면: 입구 두 원은 빼고, 안쪽 옆면(둘레 × 길이)은 더해요',
        notes: notes('<b>함정</b>: 안쪽 옆면을 빠뜨리거나, 입구의 원을 빼는 것을 잊거나, 입구를 한 개만 빼기 쉬워요.', '안쪽 옆면은 가로가 원의 <b>둘레</b>예요. 원의 넓이가 아니에요.', '기둥의 길이가 구멍의 반지름보다 <b>크면</b> 늘고, <b>작으면</b> 줄어요. 막대로 확인해 보세요.')
      }),
      prob: (M) => {
        const wrongs = [[vadd(M.S0, M.minus), '안쪽 옆면(구멍 안쪽 벽)을 더하지 않았어요.'], [vadd(M.S0, M.plus), '구멍 입구의 원 2개를 빼지 않았어요.'], [vadd(M.S0, vadd(V(0, -M.q * M.q), M.plus)), '구멍 입구는 양쪽에 2개라 원의 넓이를 2번 빼야 해요. 한 개만 뺐어요.'], [vadd(M.S0, vadd(M.minus, V(0, M.q * M.q * M.h))), '안쪽 옆면의 가로는 원의 둘레예요. 원의 넓이를 썼어요.'], [M.S0, '구멍을 무시했어요.']];
        return { tag: '구멍 뚫린 입체의 겉넓이', key: `${M.a}|${M.h}|${M.q}`, stem: `그림과 같이 밑면이 한 변 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 높이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 가운데를 반지름이 $${M.q}\\,\\mathrm{cm}$인 원기둥 모양으로 관통하게 뚫었다. 이 입체의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv5-2 막힌 구멍·사각 구멍 */
  const K52 = { cb: '원기둥 구멍(막힘)', st: '정사각 구멍(관통)', sb: '정사각 구멍(막힘)' };
  function sv52() {
    const model = (s) => {
      const kind = oneOf(s.svK52, ['cb', 'st', 'sb'], 'cb'), a = clamp(Math.round(s.s51A), 4, 15), h = clamp(Math.round(s.s51H), 2, 20);
      const size = kind === 'cb' ? clamp(Math.round(s.s52U), 1, Math.min(7, Math.floor((a - 1) / 2))) : clamp(Math.round(s.s52U), 1, Math.min(13, a - 2));
      const d = kind === 'st' ? h : clamp(Math.round(s.s52D), 1, h - 1);
      s.s51A = a; s.s51H = h; s.s52U = size; if (kind !== 'st') s.s52D = d;
      const S0 = V(2 * a * a + 4 * a * h);
      let removed, added, delta, parts;
      // 조각 줄 = 구멍 뚫린 입체의 겉면을 하나씩(그림의 면과 같은 색): 하늘색 = 원래 겉면, 노랑 = 새로 생긴 안쪽 면. step = 정리 탭에서 강조되는 단계
      const outer = { w: a, h: h, shape: 'rect', count: 4, fill: 'sky', label: `${a * h}`, cap: '바깥 옆면 ×4' }, floor = { w: a, h: a, shape: 'rect', fill: 'sky', label: `${a * a}`, cap: '아랫면' };
      if (kind === 'cb') {
        removed = V(0, -size * size); added = V(0, 2 * size * d + size * size); delta = V(0, 2 * size * d);
        parts = [{ w: a, h: a, shape: 'hole', holeR: size / a, fill: 'sky', label: plainVal(V(a * a, -size * size)), cap: '입구가 있는 윗면', step: 2 }, floor, outer, { w: 2 * PI * size, h: d, shape: 'rect', fill: 'amber', label: `2×π×${size}×${d} = ${plainVal(V(0, 2 * size * d))}`, cap: '안쪽 옆면', step: 3 }, { w: 2 * size, h: 2 * size, shape: 'circle', fill: 'amber', label: plainVal(V(0, size * size)), cap: '구멍 바닥', step: 3 }];
      } else if (kind === 'st') {
        removed = V(-2 * size * size); added = V(4 * size * h); delta = V(4 * size * h - 2 * size * size);
        parts = [{ w: a, h: a, shape: 'sqhole', holeW: size, count: 2, fill: 'sky', lab: `${a * a}−${size * size}`, capt: '입구가 있는 위·아래 면 ×2', step: 2 }, outer, { w: size, h: h, shape: 'rect', count: 4, fill: 'amber', label: `${size * h}`, cap: '안쪽 옆면 ×4', step: 3 }];
      } else {
        removed = V(-size * size); added = V(4 * size * d + size * size); delta = V(4 * size * d);
        parts = [{ w: a, h: a, shape: 'sqhole', holeW: size, fill: 'sky', lab: `${a * a}−${size * size}`, capt: '입구가 있는 윗면', step: 2 }, floor, outer, { w: size, h: d, shape: 'rect', count: 4, fill: 'amber', label: `${size * d}`, cap: '안쪽 옆면 ×4', capN: '옆면 ×4', step: 3 }, { w: size, h: size, shape: 'rect', fill: 'amber', label: `${size * size}`, cap: '구멍 바닥', capN: '바닥', step: 3 }];
      }
      const tot = vadd(S0, delta);
      return { kind, a, h, size, d, S0, removed, added, delta, tot, parts, ans: tot };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, sc = 3.4 / Math.max(M.a, M.h * 0.9), A = (M.a * sc) / 2, Hh = M.h * sc, qu = M.size * sc, du = M.d * sc, narrow = b.W < 560, y0 = -Hh / 2, y1 = Hh / 2;
      const t = C.problem ? 0.5 : C.t, rodA = t < 0.5 ? Math.sin((PI * t) / 0.5) : 0, te = ease(lin01(t, 0.5, 0.9));
      const parts = M.parts.map((p) => Object.assign({}, p, { hl: !C.review ? 1 : p.step === st ? 2 : 1 }, narrow && p.capN ? { cap: p.capN } : {}));
      const rows = [parts.filter((p) => p.fill === 'sky'), parts.filter((p) => p.fill === 'amber')]; // 위 줄: 원래 있던 겉면, 아래 줄: 새로 생긴 안쪽 면
      const R = null;
      const pts = cube8(v3(0, 0, 0), Math.max(A, Hh / 2)), bb = bboxOf(pts.map(D.P)), rowTop = bb.y1 + 0.9;
      const blend = narrow && R ? ease(lin01(te, 0, 0.15)) : 0, showSolid = true;
      if (blend > 0) { const mix = (p, q2) => p + (q2 - p) * blend; D.fit([], [{ x: mix(bb.x0, -R.total / 2), y: mix(bb.y0, rowTop) }, { x: mix(bb.x1, R.total / 2), y: mix(bb.y1, rowTop + R.height + 2.6) }], { l: 36, r: 36, t: 44, b: 40 }); }
      else D.fit(pts, R && !narrow ? [{ x: -R.total / 2, y: rowTop }, { x: R.total / 2, y: rowTop + R.height + 2.6 }] : [], { l: narrow ? 78 : 38, r: (C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 38), t: 36, b: 38 });
      if (R) spaceRows(D, R, narrow ? 4.6 : 6.4);
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
        // 길이: 바깥 치수선(정사각형의 두 변·높이) + 구멍의 크기(반지름 또는 한 변)와 깊이
        const c0 = v3(0, 0, 0);
        D.dim(v3(-A, y0, A), v3(A, y0, A), `${M.a}`, { from: c0, off: 15 });
        D.dim(v3(A, y0, A), v3(A, y0, -A), `${M.a}`, { from: c0, off: 15 });
        D.dim(v3(-A, y0, A), v3(-A, y1, A), `높이 ${M.h}`, { side: { x: -1, y: 0 }, off: 18, color: 'amber' });
        if (M.kind === 'cb') { const ct = v3(0, y1, 0); D.radius(ct, add3(ct, mul3(D.rightFront(), qu)), `반지름 ${M.size}`, { color: 'red', end: true, gap: 14 }); }
        else D.dim(v3(-qu / 2, y1, qu / 2), v3(-qu / 2, y1, -qu / 2), `한 변 ${M.size}`, { side: { x: -1, y: 0 }, off: 10, color: 'red', gap: 8 });
        if (M.kind !== 'st') D.height(v3(0, y1 - du, 0), v3(0, y1, 0), `깊이 ${M.d}`, { color: 'red', side: { x: M.kind === 'cb' ? -1 : 1, y: 0 }, right: false, gap: M.kind === 'cb' ? 8 : 30 });
      }
      if (R && te > (narrow ? 0.15 : 0.01)) {
        slideTiles(R, te);
        drawRows(D, R, 0, rowTop);
        if (te > 0.95) totalText(D, R, rowTop, `겉넓이 = 면 넓이의 합 = ${plainVal(M.tot)}`, 64);
      }
      if(C.lesson) {
        const stage=s.svBStage||0;
        G.stepRow(D,C,[null,
          [{t:`원래 겉넓이 = 2×${M.a}² + 4×${M.a}×${M.h} = ${plainVal(M.S0)}`,c:'ink'}],
          [{t:`없어진 입구 = ${plainVal(M.removed).replace('-','−')}`,c:'red'}],
          [{t:`새 안쪽 면 = ${plainVal(M.added)}`,c:'amber'}],
          [{t:`겉넓이 = ${plainVal(M.S0)} ${plainVal(M.removed).replace('-','− ')} + ${plainVal(M.added)} = ${plainVal(M.tot)}`,c:'green'}]][stage],{gated:stage===4});
      }
    };
    return {
      id: 'sv5-2', title: '막힌 구멍·사각 구멍', short: '막힌·사각 구멍',
      question: '구멍이 끝까지 뚫리지 않았거나(막힌 구멍) 모양이 정사각형이면 겉넓이는 어떻게 달라질까?',
      anim: { key: 's52T', dur: 4, label: '구멍 뚫기' }, cam0: { yaw: 28, pitch: 22 }, stepT: (n) => [0, 0.02, 0.5, 0.5, 1][Math.min(n, 4)], thumbT: 0.95, problemT: 0.55,
      ctl: (s) => (oneOf(s.svK52, ['cb', 'st', 'sb'], 'cb') === 'st' ? ['s51A', 's51H', 's52U', 's52T'] : ['s51A', 's51H', 's52U', 's52D', 's52T']),
      presets: () => Object.keys(K52).map((k, i) => ({ group: i === 0 ? '구멍의 모양' : '', label: K52[k], apply: (st, lab) => { st.svK52 = k; st.s52T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => oneOf(st.svK52, ['cb', 'st', 'sb'], 'cb') === k })),
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
        const s1 = `구멍이 없을 때의 겉넓이는 $${M.a}\\times${M.a}\\times2+4\\times${M.a}\\times${M.h}=${tx(M.S0)}\\,\\mathrm{cm}^2$예요.`;
        if (M.kind === 'cb') return [s1, `입구의 원 1개가 없어져요. $-\\pi\\times${M.size}^2=${tx(M.removed)}$예요.`, `안쪽 옆면 $2\\times\\pi\\times${M.size}\\times${M.d}=${tx(V(0, 2 * M.size * M.d))}$와 구멍 바닥의 원 $\\pi\\times${M.size}^2=${tx(V(0, M.size * M.size))}$이 새로 생겨요.`, `입구와 바닥의 원이 서로 같아 지워져서, (새 겉넓이) $=${tx(M.S0)}+${tx(M.delta)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`];
        if (M.kind === 'st') return [s1, `양쪽에 정사각형 입구가 2개 있어서 $-2\\times${M.size}\\times${M.size}=${tx(M.removed)}$예요.`, `안쪽 옆면은 가로 $${M.size}$, 세로 $${M.h}$인 직사각형 4개이므로 $+4\\times${M.size}\\times${M.h}=${tx(V(4 * M.size * M.h))}$예요.`, `(새 겉넓이) $=${tx(M.S0)}${vnum(M.delta) >= 0 ? '+' : ''}${tx(M.delta)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.${vnum(M.delta) < 0 ? ' (입구 두 개가 안쪽 벽보다 커서 겉넓이가 줄어요)' : ''}`];
        return [s1, `입구의 정사각형 1개가 없어져요. $-${M.size}\\times${M.size}=${tx(M.removed)}$예요.`, `안쪽 옆면 $4\\times${M.size}\\times${M.d}=${tx(V(4 * M.size * M.d))}$와 구멍 바닥의 정사각형 $${M.size}\\times${M.size}=${tx(V(M.size * M.size))}$이 새로 생겨요.`, `입구와 바닥이 같아 지워져서 (새 겉넓이) $=${tx(M.S0)}+${tx(M.delta)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`];
      },
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines:[{text:'겉넓이 = 원래 겉넓이 − 없어진 면 + 새 면',color:'ink'},{text:`$${tx(M.S0)}${tx(M.removed)}+${tx(M.added)}=${tx(M.tot)}\\,\\mathrm{cm}^{2}$`,color:'ink'},{text:M.kind === 'st' ? '안쪽 옆면은 네 개예요.' : '막힌 구멍에는 바닥도 생겨요.',color:'ink'}]} : null,
        guide: `칩에서 <b>구멍의 모양</b>을 골라 보세요. <b>구멍 뚫기</b> 막대를 끌면 ${span('red', '구멍 막대')}가 구멍 자리에 나타났다 사라져요. 그림에서 없어진 입구와 새로 생긴 안쪽 면을 살펴보세요. 막힌 구멍은 <b>바닥</b>이 새로 생기고, 입구와 바닥이 서로 <b>지워져요</b>.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : [rd('구멍 없을 때 겉넓이', plainVal(M.S0) + ' cm²', 'sky'), rd('없어진 입구', plainVal(M.removed) + ' cm²', 'red'), rd('생긴 안쪽 면', '+' + plainVal(M.added) + ' cm²', 'amber', M.kind === 'cb' || M.kind === 'sb' ? '벽 + 바닥' : '벽 4개'), rd('새 겉넓이', plainVal(M.tot) + ' cm²', 'green', `변화 ${vnum(M.delta) >= 0 ? '+' : ''}${plainVal(M.delta)}`)],
        formula: M.kind === 'cb' ? `<p>(막힌 원기둥 구멍의 겉넓이) $=$ (구멍이 없을 때) $+$ (안쪽 옆면) &nbsp;(입구의 원과 바닥의 원은 서로 지워져요)</p>` : M.kind === 'st' ? `<p>(관통하는 정사각 구멍의 겉넓이) $=$ (구멍이 없을 때) $-$ (입구 2개) $+$ (안쪽 옆면 4개)</p>` : `<p>(막힌 정사각 구멍의 겉넓이) $=$ (구멍이 없을 때) $+$ (안쪽 옆면 4개) &nbsp;(입구와 바닥의 정사각형은 서로 지워져요)</p>`,
        rule: '파낸 곳마다 「없어지는 겉면」과 「새로 생기는 겉면」을 따로 구해요',
        notes: notes('막힌 구멍은 <b>바닥</b>이 새로 생겨요. 입구에서 없어진 넓이와 같아서 늘어나는 것은 <b>안쪽 옆면</b>뿐이에요.', '정사각 구멍의 안쪽 옆면은 <b>4개</b>예요. 원 구멍은 둘레(원주)를 가로로 하는 하나의 곡면이에요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        if (M.kind === 'cb') {
          wrongs = [[vadd(M.S0, V(0, -M.size * M.size + 2 * M.size * M.d)), '입구를 빼면 바닥의 원을 더해야 해요(서로 지워져요).'], [vadd(M.S0, V(0, 2 * M.size * M.d + M.size * M.size)), '입구의 원을 빼지 않았어요.'], [vadd(M.S0, V(0, M.size * M.size * M.d)), '안쪽 옆면의 가로는 원의 둘레(2×π×반지름)예요.'], [vadd(M.S0, V(0, 2 * M.size * M.h)), '구멍의 깊이가 아니라 기둥의 길이를 썼어요.'], [M.S0, '구멍을 무시했어요.']];
          stem = `그림과 같이 밑면이 한 변 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 높이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 한쪽 면에서 반지름 $${M.size}\\,\\mathrm{cm}$, 깊이 $${M.d}\\,\\mathrm{cm}$인 원기둥 모양의 구멍을 팠다(구멍은 끝까지 뚫리지 않았다). 이 입체의 겉넓이는?`;
        } else if (M.kind === 'st') {
          wrongs = [[vadd(M.S0, V(4 * M.size * M.h)), '입구의 정사각형 2개를 빼지 않았어요.'], [vadd(M.S0, V(-2 * M.size * M.size)), '안쪽 옆면(직사각형 4개)을 더하지 않았어요.'], [vadd(M.S0, V(4 * M.size * M.h - M.size * M.size)), '입구는 양쪽에 2개예요. 한 개만 뺐어요.'], [vadd(M.S0, V(2 * M.size * M.h - 2 * M.size * M.size)), '안쪽 옆면은 4개예요. 2개만 더했어요.'], [M.S0, '구멍을 무시했어요.']];
          stem = `그림과 같이 밑면이 한 변 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 높이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 가운데를 한 변이 $${M.size}\\,\\mathrm{cm}$인 정사각형 모양으로 관통하게 뚫었다. 이 입체의 겉넓이는?`;
        } else {
          wrongs = [[vadd(M.S0, V(4 * M.size * M.d - M.size * M.size)), '입구를 빼면 바닥을 더해야 해요(서로 지워져요).'], [vadd(M.S0, V(4 * M.size * M.d + M.size * M.size)), '입구의 정사각형을 빼지 않았어요.'], [vadd(M.S0, V(2 * M.size * M.d)), '안쪽 옆면은 4개예요.'], [vadd(M.S0, V(4 * M.size * M.h)), '구멍의 깊이가 아니라 기둥의 길이를 썼어요.'], [M.S0, '구멍을 무시했어요.']];
          stem = `그림과 같이 밑면이 한 변 $${M.a}\\,\\mathrm{cm}$인 정사각형이고 높이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 한쪽 면에서 한 변이 $${M.size}\\,\\mathrm{cm}$, 깊이 $${M.d}\\,\\mathrm{cm}$인 정사각형 모양의 구멍을 팠다(끝까지 뚫리지 않았다). 이 입체의 겉넓이는?`;
        }
        return { tag: M.kind === 'st' ? '사각 구멍의 겉넓이' : '막힌 구멍의 겉넓이', key: `${M.kind}|${M.a}|${M.h}|${M.size}|${M.d}`, stem, choices: mkV(M.ans, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv5-3 모퉁이 절단 (Ⅳ-4) */
  const CORN = { 1: [[1, 1, 1]], 4: [[1, 1, 1], [-1, 1, 1], [1, 1, -1], [-1, 1, -1]], 8: [] };
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) CORN[8].push([sx, sy, sz]);
  const cornerBoxes = (A, p, cnt) => CORN[cnt].map(([sx, sy, sz]) => [sx > 0 ? A - p : -A, sx > 0 ? A : -A + p, sy > 0 ? A - p : -A, sy > 0 ? A : -A + p, sz > 0 ? A - p : -A, sz > 0 ? A : -A + p]);
  function sv53() {
    const model = (s) => {
      const a = clamp(Math.round(s.s53A), 4, 15), cnt = [1, 4, 8].includes(s.svCnt) ? s.svCnt : 1, pMax = cnt === 1 ? a - 1 : Math.floor((a - 1) / 2), p = clamp(Math.round(s.s53P), 1, pMax);
      s.s53A = a; s.s53P = p;
      const S0 = V(6 * a * a), out3 = V(3 * p * p), in3 = V(3 * p * p), tot = vadd(vsub(S0, vmul(out3, cnt)), vmul(in3, cnt));
      return { a, cnt, p, S0, out3, in3, tot, ans: tot };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, sc = 3.4 / M.a, A = (M.a * sc) / 2, pu = M.p * sc;
      const t = C.problem ? 0.6 : C.t, glow = lin01(t, 0, 0.3), slide = ease(lin01(t, 0.3, 0.6)), te = ease(lin01(t, 0.6, 1));
      const blist = cornerBoxes(A, pu, M.cnt), body = boxMinusBoxes([-A, A, -A, A, -A, A], blist);
      const pulse = 0.35 + 0.25 * Math.sin(glow * PI * 3 + 0.0);
      const hotOut = C.review ? (st === 2 ? 1 : 0) : (t > 0.02 && t < 0.3 ? 1 : 0), hotIn = C.review ? (st === 3 ? 1 : 0) : (t > 0.02 && t < 0.3 ? 1 : 0), settled = !C.review && t >= 0.3;
      // 모든 조각은 오른쪽으로만(가로로) 빠집니다. 왼쪽 조각은 더 멀리 가서 오른쪽 조각 곁에 놓여요
      const sdR = slide * (1.6 * pu + 0.3 * A), sdL = slide * (2.3 * A + 2.3 * pu), sd = sdR;
      const piece = (bx, i) => { const sx = bx[1] > 0 && bx[1] === A ? 1 : -1; const m = boxMesh(bx[0], bx[1], bx[2], bx[3], bx[4], bx[5]); const sgn = [sx, bx[3] === A ? 1 : -1, bx[5] === A ? 1 : -1]; let shift = D.hx(sx > 0 ? sdR : sdL); if (M.cnt > 1) { const cp = D.P(v3((bx[0]+bx[1])/2,(bx[2]+bx[3])/2,(bx[4]+bx[5])/2)), rows = Math.ceil(M.cnt/2), destX = A * 2.0 + (i % 2) * pu * 1.7, destY = (Math.floor(i/2) - (rows-1)/2) * pu * 1.7; shift = add3(D.hx(slide * (destX - cp.x)), v3(0, -slide * (destY - cp.y) / D.cam.cp, 0)); } return { m: xfMesh(m, shiftT(shift)), sgn }; };
      const pcs = blist.map((bx, i) => piece(bx, i));
      const xMax = C.problem ? A : A + (M.cnt === 1 ? 1.1 * pu + 0.3 * A + pu : 2.8 * pu + 0.3 * A + pu), xNow = A + (xMax - A) * slide, pts = cube8(v3(0, 0, 0), A).concat([v3(xNow, A, A), v3(xNow, -A, -A), v3(xNow, A, -A), v3(xNow, -A, A)]); // 지금 프레임(빠져나간 만큼)만으로 맞춰요
      const isN = D.narrow && !b.thumb; // 폰: 조각 줄을 작게 해서 입체를 키워요
      const row = (C.problem || te < 0.1) ? null : (() => {
        const mk = (fill, i) => ({ w: M.p, h: M.p, shape: 'rect', fill, label: `${M.p * M.p}`, hl: 1 });
        return layoutTiles([mk('red', 0), mk('red', 1), mk('red', 2)], isN ? 2.4 : 3.6, 1.2, Math.max(0.35, 0.3 * M.p));
      })();
      if (!C.problem && M.cnt > 1 && slide > 0) pcs.forEach(pc => pc.m.faces.forEach(f => f.pts.forEach(p => pts.push(p))));
      const bbx = bboxOf(pts.map(D.P));
      const offN = row ? (row.total + 0.8) / 2 : 0, xBN = (1 - te) * 2 * offN;
      D.fit(pts, row ? (isN ? [{ x: offN - xBN - row.total / 2, y: bbx.y1 + 1.15 }, { x: offN + row.total / 2, y: bbx.y1 + 1.15 + row.height + 1.0 }] : [{ x: -4.3, y: bbx.y1 + 0.7 }, { x: 4.3, y: bbx.y1 + 0.7 + row.height + 1.0 }]) : [], { l: C.problem ? 12 : 28, r: (!row && C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : (C.problem ? 12 : 28)), t: C.problem ? 24 : 40, b: C.problem ? 12 : 30 });
      D.body({ mesh: body, fill: 'sky', alpha: 0.2, edge: 'ink', faceStyle: (f) => (f.tag === 'in' ? { fill: 'amber', alpha: hotIn || settled || (C.review && st >= 3) ? (hotIn ? pulse + 0.1 : 0.42) : 0.28 } : {}) });
      if (!C.problem) pcs.forEach((pc) => D.body({ mesh: pc.m, fill: 'violet', alpha: 0.16, edge: 'ink', edgeW: 2.2, faceStyle: (f) => (f.n && (f.n.x * pc.sgn[0] + f.n.y * pc.sgn[1] + f.n.z * pc.sgn[2]) > 0.5 && (hotOut || settled || (C.review && st >= 2)) ? { fill: 'red', alpha: hotOut ? pulse + 0.1 : 0.45 } : {}) }));
      // 길이: 정육면체의 두 모서리와, 잘라 낸 조각의 한 모서리(조각을 따라 움직여요)
      const c0 = v3(0, 0, 0);
      D.dim(v3(-A, -A, A), v3(A, -A, A), `${M.a}`, { from: c0, off: 15 });
      D.dim(v3(A, -A, A), v3(A, -A, -A), `${M.a}`, { from: c0, off: 15 });
      if (blist.length && (C.problem || M.cnt === 1 || slide < 0.01)) { const bx = blist[0]; D.dim(add3(v3(bx[0], bx[3], bx[5]), D.hx(C.problem ? 0 : sd)), add3(v3(bx[1], bx[3], bx[5]), D.hx(C.problem ? 0 : sd)), `한 변 ${M.p}`, { side: { x: 0, y: -1 }, off: 12, color: 'red' }); }
      if (!C.problem) {
        if (row) {
          // 같은 줄 안에서 가로로: 빨강(없어진 바깥 3면)과 노랑(새로 생긴 안쪽 3면)이 포개져요
          const off = (row.total + 0.8) / 2, y0 = bbx.y1 + (isN ? 1.15 : 0.7), xB = (1 - te) * 2 * off; // 빨강은 오른쪽에 고정, 노랑이 왼쪽에서 오른쪽으로 가로로 겹쳐요
          const L1 = { tiles: row.tiles.map((tl) => Object.assign({}, tl, { x: tl.x + off, fill: 'red', cap: '' })), height: row.height }, L2 = { tiles: row.tiles.map((tl) => Object.assign({}, tl, { x: tl.x + off - xB, fill: 'amber', label: tl.label })), height: row.height };
          drawTiles(D, L1, 0, y0); drawTiles(D, L2, 0, y0);
          if (te < 0.45) b.text({ x: off, y: y0 }, '없어진 바깥 3면', { dy: -13, size: D.fs(13), weight: 800, color: 'red', baseline: 'middle', align: 'center' });
          if (te < 0.45) b.text({ x: off - xB, y: y0 }, '생긴 안쪽 3면', { dy: -13, size: D.fs(13), weight: 800, color: 'amber', baseline: 'middle', align: 'center' });

        }
      }
      // 정리 탭: 지금 단계의 식 한 줄. 결과 줄은 해설 재생 중 svShowV 까지 숨김.
      G.stepRow(D, C, [null,
        [{ t: `처음 겉넓이 = 6×${M.a}×${M.a}${D.lessonHide ? '' : ` = ${plainVal(M.S0)}`}`, c: 'ink' }], // 정답(변화 없음)이 처음 겉넓이와 같아 재생 중에는 숫자를 결론까지 아낌
        [{ t: `없어지는 바깥 3면: −3×${M.p}×${M.p}${M.cnt > 1 ? ` (${M.cnt}곳)` : ''} = −${plainVal(vmul(M.out3, M.cnt))}`, c: 'red' }],
        [{ t: `생기는 안쪽 3면: +3×${M.p}×${M.p}${M.cnt > 1 ? ` (${M.cnt}곳)` : ''} = +${plainVal(vmul(M.in3, M.cnt))}`, c: 'amber' }],
        [{ t: `겉넓이 = ${plainVal(M.S0)} − ${plainVal(vmul(M.out3, M.cnt))} + ${plainVal(vmul(M.in3, M.cnt))} = ${plainVal(M.tot)}`, c: 'green' }]][Math.min(Math.max(C.step || 0, 0), 4)], { gated: (C.step || 0) >= 4 });
    };
    return {
      id: 'sv5-3', title: '모퉁이를 잘라 낸 정육면체', short: '모퉁이 절단',
      question: '정육면체의 모퉁이를 정육면체 모양으로 잘라 내면 겉넓이는 늘어날까, 줄어들까?',
      anim: { key: 's53T', dur: 3, label: '잘라 내기' }, cam0: { yaw: 28, pitch: 24 }, stepT: (n) => [0, 0.02, 0.45, 0.6, 1][Math.min(n, 4)], thumbT: 1, problemT: 0.2,
      ctl: () => ['s53A', 's53P', 's53T'],
      presets: () => [{ group: '자르는 모퉁이', label: '1개', apply: (st, lab) => { st.svCnt = 1; st.s53T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => (st.svCnt || 1) === 1 }, { label: '4개', apply: (st, lab) => { st.svCnt = 4; st.s53T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svCnt === 4 }, { label: '8개', apply: (st, lab) => { st.svCnt = 8; st.s53T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svCnt === 8 }],
      init: (s) => { s.svCnt = 1; s.s53A = 6; s.s53P = 2; s.s53T = 0; },
      reroll: (s) => { s.svCnt = pick([1, 4, 8], s.svCnt); s.s53A = rint(5, 10); s.s53P = rint(1, s.svCnt === 1 ? s.s53A - 2 : Math.floor((s.s53A - 1) / 2)); s.s53T = 0; },
      model, draw,
      check: (s) => { const M = model(s), A = M.a / 2; return { ans: meshArea(boxMinusBoxes([-A, A, -A, A, -A, A], cornerBoxes(A, M.p, M.cnt))), model: vnum(M.tot) }; },
      steps: (M) => [
        `처음 정육면체의 겉넓이는 $6\\times${M.a}\\times${M.a}=${tx(M.S0)}\\,\\mathrm{cm}^2$예요.`,
        `모퉁이 조각(한 모서리가 $${M.p}$인 정육면체)을 떼면 <b>바깥 3면</b>(각 $${M.p}\\times${M.p}$)이 없어져요. $-3\\times${M.p}\\times${M.p}=-${tx(M.out3)}$예요.${M.cnt > 1 ? ` 모퉁이가 ${M.cnt}개이면 $-${tx(vmul(M.out3, M.cnt))}$예요.` : ''}`,
        `조각을 떼어 낸 자리에 <b>안쪽 3면</b>(각 $${M.p}\\times${M.p}$)이 새로 생겨요. $+3\\times${M.p}\\times${M.p}=+${tx(M.in3)}$예요.${M.cnt > 1 ? ` 모퉁이가 ${M.cnt}개이면 $+${tx(vmul(M.in3, M.cnt))}$예요.` : ''}`,
        `없어진 면과 생긴 면이 합동이라 넓이가 같아요. (겉넓이) $=${tx(M.S0)}-${tx(vmul(M.out3, M.cnt))}+${tx(vmul(M.in3, M.cnt))}=${tx(M.S0)}\\,\\mathrm{cm}^2$ — ${M.cnt > 1 ? `모퉁이 ${M.cnt}개를 모두 잘라도 ` : ''}<b>변하지 않아요</b>.`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines:[{text:'겉넓이는 그대로예요.',color:'ink'},{text:`$${tx(M.S0)}-${tx(vmul(M.out3,M.cnt))}+${tx(vmul(M.in3,M.cnt))}=${tx(M.tot)}\\,\\mathrm{cm}^{2}$`,color:'ink'},{text:'없어진 면과 새로 생긴 면은 넓이가 같아요.',color:'ink'}]} : null,
        guide: `<b>잘라 내기</b> 막대를 끌거나 ▶를 눌러 보세요. 모퉁이 조각이 모두 ${span('violet', '오른쪽으로')} 빠지고, 아래 타일 줄에서 ${span('amber', '생긴 안쪽 3면')}이 왼쪽에서 오른쪽으로 가로로 밀려 ${span('red', '없어진 바깥 3면')}과 <b>겹쳐져요</b>. 칩으로 모퉁이 개수를 바꿔 보세요.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : [rd('처음 겉넓이', plainVal(M.S0) + ' cm²', 'sky', `6×${M.a}×${M.a}`), rd('없어진 바깥 3면', '−' + plainVal(vmul(M.out3, M.cnt)) + ' cm²', 'red', `${M.p}×${M.p}×3 × ${M.cnt}개`), rd('생긴 안쪽 3면', '+' + plainVal(vmul(M.in3, M.cnt)) + ' cm²', 'amber', `${M.p}×${M.p}×3 × ${M.cnt}개`), rd('자른 뒤 겉넓이', plainVal(M.tot) + ' cm²', 'green', '변화 없음')],
        formula: `<p>(자른 뒤 겉넓이) $=$ (처음 겉넓이) $-$ (없어진 바깥 3면) $+$ (생긴 안쪽 3면) $=$ (처음 겉넓이)</p>`,
        rule: '모퉁이를 정육면체(직육면체) 모양으로 잘라 내도 겉넓이는 그대로',
        notes: notes('없어지는 바깥 3면과 새로 생기는 안쪽 3면의 넓이가 <b>같아요</b>. 그래서 처음 겉넓이 그대로예요.', '<b>함정</b>: 처음 겉넓이에서 3면만 뺀 값(줄어든다)이나 3면만 더한 값(늘어난다)을 고르기 쉬워요. 빠진 면과 생긴 면을 <b>둘 다</b> 세어 보세요.', '모서리 한가운데나 가운데를 파내면 달라져요(다음 장면).')
      }),
      prob: (M) => {
        const q = M.p * M.p, a2 = M.a * M.a;
        const wrongs = [[V(6 * a2 - 3 * q), '없어진 바깥 3면만 뺐어요. 새로 생긴 안쪽 3면을 더해야 해요.'], [V(6 * a2 + 3 * q), '새로 생긴 안쪽 3면만 더했어요. 없어진 바깥 3면을 빼야 해요.'], [V(6 * a2 - q), '면 1개만 뺐어요. 바깥에서 3면이 없어져요.'], [V(6 * a2 + 6 * q), '조각의 겉넓이(작은 정육면체의 6면)를 더했어요.'], [V(6 * a2 - 6 * q), '조각의 겉넓이(작은 정육면체의 6면)를 뺐어요.']];
        return { tag: '모퉁이를 잘라 낸 입체의 겉넓이', key: `${M.a}|${M.p}|${M.cnt}`, stem: `한 모서리의 길이가 $${M.a}\\,\\mathrm{cm}$인 정육면체에서 ${M.cnt === 1 ? '한 모퉁이를' : `${M.cnt}개의 모퉁이를 각각`} 한 모서리의 길이가 $${M.p}\\,\\mathrm{cm}$인 작은 정육면체 모양으로 잘라 냈다. 남은 입체의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv5-4 모서리·가운데 홈 (확장) */
  const K54 = { mid: '모서리 중간 파내기', thru: '모서리 따라 끝까지', groove: '가운데 홈' };
  function sv54() {
    const model = (s) => {
      const kind = oneOf(s.svK54, ['mid', 'thru', 'groove'], 'mid'), a = clamp(Math.round(s.s54A), 4, 15);
      let p = clamp(Math.round(s.s54P), 1, a - 1), q = clamp(Math.round(s.s54Q), 1, a - 1), c = kind === 'thru' ? a : clamp(Math.round(s.s54C), 1, a - 2), w = clamp(Math.round(s.s54W), 1, a - 2), z = clamp(Math.round(s.s54Z), 1, a - 1);
      const S0 = V(6 * a * a);
      let rem, add, delta, blk, detail, rt, at;
      // 조각 줄: 없어진 겉면(빨강)과 새로 생긴 겉면(노랑)을 면 하나씩. 그림의 빨강·노랑 면과 같은 색
      const T = (w0, h0, fill, nm, n) => Object.assign({ w: w0, h: h0, shape: 'rect', fill, label: `${w0 * h0}`, cap: `${nm} ${w0}×${h0}` }, n > 1 ? { count: n } : {});
      if (kind === 'groove') {
        rem = a * w + 2 * w * z; add = a * w + 2 * a * z; delta = 2 * a * z - 2 * w * z; blk = [-a / 2, a / 2, a / 2 - z, a / 2, -w / 2, w / 2]; detail = { removed: `윗면 띠 ${a}×${w} + 양 끝 ${w}×${z} 두 개`, added: `홈 바닥 ${a}×${w} + 옆벽 ${a}×${z} 두 개` };
        rt = [T(a, w, 'red', '윗면'), T(w, z, 'red', '양 끝 면', 2)]; at = [T(a, w, 'amber', '홈 바닥'), T(a, z, 'amber', '홈 옆벽', 2)];
      } else {
        rem = c * q + c * p + (kind === 'thru' ? 2 * p * q : 0); add = c * q + c * p + (kind === 'thru' ? 0 : 2 * p * q); delta = add - rem; blk = [-c / 2, c / 2, a / 2 - p, a / 2, a / 2 - q, a / 2]; detail = { removed: kind === 'thru' ? `윗면 ${c}×${q} + 앞면 ${c}×${p} + 양 끝 ${p}×${q} 두 개` : `윗면 ${c}×${q} + 앞면 ${c}×${p}`, added: kind === 'thru' ? `홈 바닥 ${c}×${q} + 홈 뒷벽 ${c}×${p}` : `홈 바닥 ${c}×${q} + 홈 뒷벽 ${c}×${p} + 양 끝벽 ${p}×${q} 두 개` };
        rt = [T(c, q, 'red', '윗면'), T(c, p, 'red', '앞면')].concat(kind === 'thru' ? [T(p, q, 'red', '양 끝 면', 2)] : []);
        at = [T(c, q, 'amber', '홈 바닥'), T(c, p, 'amber', '홈 뒷벽')].concat(kind === 'thru' ? [] : [T(p, q, 'amber', '양 끝벽', 2)]);
      }
      const tot = vadd(S0, V(delta));
      s.s54A = a; s.s54P = p; s.s54Q = q; if (kind !== 'thru') s.s54C = c; s.s54W = w; s.s54Z = z;
      return { kind, a, p, q, c, w, z, S0, rem, add, delta, blk, detail, rt, at, tot, ans: tot };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, sc = 3.4 / M.a, A = (M.a * sc) / 2, t = C.problem ? 1 : C.t, slide = ease(lin01(t, 0, 0.55)), narrow = b.W < 560;
      const bx = M.blk.map((v) => v * sc), body = boxMinusBoxes([-A, A, -A, A, -A, A], [bx]);
      // 조각은 가로로만 빠지되, 입체 옆으로 완전히 비켜서 홈이 그대로 보이게 합니다
      const sdMax = A - bx[0] + (bx[1] - bx[0]) + 0.6, sd = C.problem ? 0 : slide * sdMax;
      const pieceM = xfMesh(boxMesh(bx[0], bx[1], bx[2], bx[3], bx[4], bx[5]), shiftT(D.hx(sd)));
      const corners = [bx[0], bx[1]].flatMap((x) => [bx[2], bx[3]].flatMap((y) => [bx[4], bx[5]].map((zz) => v3(x, y, zz))));
      const pts = cube8(v3(0, 0, 0), A).concat(corners.map((q) => add3(q, D.hx(sd))));
      const bbx = bboxOf(pts.map(D.P));
      const lvR = !C.review ? 1 : st === 2 ? 2 : 1, lvA = !C.review ? 1 : st === 3 ? 2 : 1;
      const R = null;
      const rowTop = bbx.y1 + 0.8, te = ease(lin01(t, 0.55, 0.95));
      // 휴대폰: 조각이 다 빠지면 입체는 물러나고 조각 줄이 화면을 써요
      const blend = narrow && R ? ease(lin01(te, 0, 0.15)) : 0, showSolid = !(narrow && R && te > 0.15), rowsReg = R ? [{ x: -R.total / 2, y: rowTop }, { x: R.total / 2, y: rowTop + R.height + 3.4 }] : [];
      if (blend > 0) { const mix = (p0, q0) => p0 + (q0 - p0) * blend; D.fit([], [{ x: mix(bbx.x0, rowsReg[0].x), y: mix(bbx.y0, rowTop) }, { x: mix(bbx.x1, rowsReg[1].x), y: mix(bbx.y1, rowsReg[1].y) }], { l: 24, r: 24, t: 40, b: 30 }); }
      // The removed piece's vertical dimension sits outside the left edge:
      // reserve its line offset and full label width on a narrow canvas.
      else D.fit(pts, [], { l: narrow ? 72 : 35, r: C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 35, t: 35, b: 30 });
      if (R) spaceRows(D, R, narrow ? 4.4 : 6.2);
      if (showSolid) {
      D.body({ mesh: body, fill: 'sky', alpha: 0.2, edge: 'ink', faceStyle: (f) => (f.tag === 'in' ? { fill: 'amber', alpha: lvA === 2 ? 0.55 : 0.36 } : {}) });
      if (!C.problem) D.body({ mesh: pieceM, fill: 'violet', alpha: 0.18, edge: 'ink', edgeW: 2.2, faceStyle: (f) => { const onTop = f.n.y > 0.5 || (M.kind !== 'groove' && f.n.z > 0.5) || (M.kind === 'thru' && Math.abs(f.n.x) > 0.5); return onTop ? { fill: 'red', alpha: lvR === 2 ? 0.55 : 0.38 } : {}; } });
      // 길이: 정육면체의 두 모서리, 파낸 조각의 길이·높이·폭(조각을 따라 움직여요)
      const c0 = v3(0, 0, 0), sh = D.hx(C.problem ? 0 : sd), at3 = (x, y, z) => add3(v3(x, y, z), sh);
      D.dim(v3(-A, -A, A), v3(A, -A, A), `${M.a}`, { from: c0, off: 15 });
      D.dim(v3(A, -A, A), v3(A, -A, -A), `${M.a}`, { from: c0, off: 15 });
      if (M.kind !== 'groove') D.dim(at3(bx[0], bx[2], bx[5]), at3(bx[1], bx[2], bx[5]), `길이 ${M.c}`, { side: { x: 0, y: 1 }, off: 12, color: 'sky' });
      D.dim(at3(bx[0], bx[2], bx[5]), at3(bx[0], bx[3], bx[5]), M.kind === 'groove' ? `깊이 ${M.z}` : `높이 ${M.p}`, { side: { x: -1, y: 0 }, off: 12, color: 'red' });
      D.dim(at3(bx[1], bx[3], bx[4]), at3(bx[1], bx[3], bx[5]), `폭 ${M.kind === 'groove' ? M.w : M.q}`, { side: { x: 1, y: -0.5 }, off: 12, color: 'red', gap: 7 });
      }
      if (R && (!narrow || te > 0.15)) {
        const sum = (arr) => arr.map((x) => x.w * x.h).join('+'), sumN = (arr) => arr.reduce((u, x) => u + x.w * x.h * (x.count || 1), 0);
        const expr = (arr) => arr.map((x) => `${x.w * x.h}${x.count > 1 ? `×${x.count}` : ''}`).join(' + ');
        void sum;
        drawTiles(D, R.rows[0], 0, rowTop); drawTiles(D, R.rows[1], 0, rowTop + R.rows[1].offset);
        const lineAt = (i, str, col, dy) => { const base = rowTop + R.rows[i].offset + R.rows[i].height, px = b.toS({ x: 0, y: base }); b.stext(px.x, px.y + dy, str, { size: D.fs(14), weight: 800, color: col, align: 'center', baseline: 'middle' }); };
        lineAt(0, `없어진 겉면 ${expr(M.rt)} = ${sumN(M.rt)}`, 'red', 56);
        lineAt(1, `생긴 겉면 ${expr(M.at)} = ${sumN(M.at)}`, 'amber', 56);
        lineAt(1, `겉넓이 = ${plainVal(M.S0)} − ${M.rem} + ${M.add} = ${plainVal(M.tot)}`, 'green', 82);
      }
      if(C.lesson) {
        const stage=s.svBStage||0;
        G.stepRow(D,C,[null,
          [{t:`원래 정육면체 = 6×${M.a}² = ${plainVal(M.S0)}`,c:'ink'}],
          [{t:`없어진 겉면 = ${M.rem}`,c:'red'}],
          [{t:`새로 생긴 면 = ${M.add}`,c:'amber'}],
          [{t:`겉넓이 = ${plainVal(M.S0)} − ${M.rem} + ${M.add} = ${plainVal(M.tot)}`,c:'green'}]][stage],{gated:stage===4});
      }
    };
    return {
      id: 'sv5-4', title: '모서리·가운데 홈 (확장)', short: '모서리·홈 (확장)',
      question: '파내는 위치가 모퉁이에서 모서리 중간이나 가운데로 바뀌면 겉넓이는 어떻게 달라질까?',
      anim: { key: 's54T', dur: 3, label: '조각 빼내기' }, cam0: { yaw: 28, pitch: 24 }, stepT: (n) => [0, 0.6, 0.6, 1, 1][Math.min(n, 4)], thumbT: 1, problemT: 0.2,
      ctl: (s) => ({ mid: ['s54A', 's54P', 's54Q', 's54C', 's54T'], thru: ['s54A', 's54P', 's54Q', 's54T'], groove: ['s54A', 's54W', 's54Z', 's54T'] }[oneOf(s.svK54, ['mid', 'thru', 'groove'], 'mid')]),
      presets: () => Object.keys(K54).map((k, i) => ({ group: i === 0 ? '파내는 위치' : '', label: K54[k], apply: (st, lab) => { st.svK54 = k; st.s54T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => oneOf(st.svK54, ['mid', 'thru', 'groove'], 'mid') === k })),
      init: (s) => { s.svK54 = 'mid'; s.s54A = 6; s.s54P = 2; s.s54Q = 2; s.s54C = 3; s.s54W = 2; s.s54Z = 2; s.s54T = 0; },
      reroll: (s) => { s.svK54 = pick(['mid', 'thru', 'groove'], s.svK54); s.s54A = rint(5, 10); s.s54P = rint(1, 3); s.s54Q = rint(1, 3); s.s54C = rint(1, s.s54A - 2); s.s54W = rint(1, 3); s.s54Z = rint(1, 3); s.s54T = 0; },
      model, draw,
      check: (s) => { const M = model(s); return { ans: meshArea(boxMinusBoxes([-M.a / 2, M.a / 2, -M.a / 2, M.a / 2, -M.a / 2, M.a / 2], [M.blk])), model: vnum(M.tot) }; },
      steps: (M) => [
        `처음 정육면체의 겉넓이는 $6\\times${M.a}\\times${M.a}=${tx(M.S0)}\\,\\mathrm{cm}^2$예요.`,
        `파낸 조각이 겉면과 닿아 있던 곳이 없어져요: ${M.detail.removed}. 합은 $${M.rem}$예요.`,
        `파낸 자리 안쪽에 새로 생기는 면: ${M.detail.added}. 합은 $${M.add}$예요.`,
        `(겉넓이의 변화) $=${M.add}-${M.rem}=${M.delta >= 0 ? '+' : ''}${M.delta}$이므로 (겉넓이) $=${tx(M.S0)}${M.delta >= 0 ? '+' : ''}${M.delta}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines:[{text:'겉넓이 = 처음 − 없어진 면 + 새 면',color:'ink'},{text:`$${tx(M.S0)}-${M.rem}+${M.add}=${tx(M.tot)}\\,\\mathrm{cm}^{2}$`,color:'ink'},{text:'파내는 위치에 따라 달라져요.',color:'ink'}]} : null,
        guide: `칩에서 <b>파내는 위치</b>를 골라 보세요. <b>조각 빼내기</b>를 끌면 조각이 ${span('violet', '가로로')} 빠져나가요. 파내면서 없어진 면과 새로 생긴 면을 살펴보세요. 두 합을 비교하면 위치에 따라 결과가 달라지는 걸 볼 수 있어요. (이 장면은 확장 탐구예요.)`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : [rd('처음 겉넓이', plainVal(M.S0) + ' cm²', 'sky', `6×${M.a}×${M.a}`), rd('없어진 겉면', '−' + M.rem + ' cm²', 'red'), rd('생긴 겉면', '+' + M.add + ' cm²', 'amber'), rd('자른 뒤 겉넓이', plainVal(M.tot) + ' cm²', 'green', `변화 ${M.delta >= 0 ? '+' : ''}${M.delta}`)],
        formula: M.kind === 'mid' ? `<p>(모서리 중간) 겉넓이의 변화 $=$ (양 끝벽 두 개)만큼 늘어요</p>` : M.kind === 'thru' ? `<p>(모서리를 따라 끝까지) 겉넓이의 변화 $=$ (양 끝에서 없어지는 면 두 개)만큼 줄어요</p>` : `<p>(가운데 홈) 겉넓이의 변화 $=$ (홈 옆벽 두 개) $-$ (양 끝에서 없어지는 면 두 개)</p>`,
        rule: '변화 = (생긴 겉면) − (없어진 겉면): 파낸 위치에 따라 늘기도, 줄기도, 그대로이기도 해요',
        notes: notes('모퉁이는 바깥 3면 = 안쪽 3면이라 변화가 <b>0</b>이에요.', '모서리 중간은 <b>늘고</b>, 모서리를 따라 끝까지 파면 <b>줄어요</b>. 조각의 면이 겉면과 닿은 개수가 달라지기 때문이에요.')
      }),
      prob: (M) => {
        const S = 6 * M.a * M.a;
        const wr = M.kind === 'groove' ? [[V(S - M.rem), '없어진 면만 뺐어요. 생긴 면을 더해야 해요.'], [V(S + M.add), '생긴 면만 더했어요. 없어진 면을 빼야 해요.'], [V(S), '변화가 없다고 생각했어요(모퉁이 절단과 달라요).'], [V(S + 2 * M.a * M.z), '홈 양 끝에서 없어진 면 2개를 빼지 않았어요.'], [V(S + 2 * M.z * M.w)]]
          : [[V(S - M.rem), '없어진 면만 뺐어요. 생긴 면을 더해야 해요.'], [V(S + M.add), '생긴 면만 더했어요. 없어진 면을 빼야 해요.'], [V(S), '변화가 없다고 생각했어요(모퉁이 절단과 달라요).'], [V(S + (M.kind === 'mid' ? -2 : 2) * M.p * M.q), M.kind === 'mid' ? '모서리 중간은 양 끝벽이 더해져서 늘어요.' : '끝까지 파면 양 끝의 겉면이 없어져서 줄어요.'], [V(S + M.p * M.q)]];
        const stem = M.kind === 'groove' ? `한 모서리의 길이가 $${M.a}\\,\\mathrm{cm}$인 정육면체의 윗면 한가운데에, 한쪽 옆면에서 반대쪽 옆면까지 폭 $${M.w}\\,\\mathrm{cm}$, 깊이 $${M.z}\\,\\mathrm{cm}$인 홈을 팠다. 이 입체의 겉넓이는?` : M.kind === 'mid' ? `한 모서리의 길이가 $${M.a}\\,\\mathrm{cm}$인 정육면체의 한 모서리 중간(양 끝은 남김)에서 길이 $${M.c}\\,\\mathrm{cm}$, 단면이 $${M.p}\\,\\mathrm{cm}\\times${M.q}\\,\\mathrm{cm}$인 직육면체 모양을 파냈다. 이 입체의 겉넓이는?` : `한 모서리의 길이가 $${M.a}\\,\\mathrm{cm}$인 정육면체의 한 모서리를 따라 끝에서 끝까지, 단면이 $${M.p}\\,\\mathrm{cm}\\times${M.q}\\,\\mathrm{cm}$인 직육면체 모양으로 파냈다. 이 입체의 겉넓이는?`;
        return { tag: M.kind === 'groove' ? '가운데 홈의 겉넓이' : M.kind === 'mid' ? '모서리 중간을 파낸 입체' : '모서리를 파낸 입체', key: `${M.kind}|${M.a}|${M.p}|${M.q}|${M.c}|${M.w}|${M.z}`, stem, choices: mkV(M.tot, wr, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv5-5 원뿔 속 원뿔 */
  // 겉넓이 전개도: 바깥 원뿔의 옆면(부채꼴) + 바닥의 고리 + 파낸 원뿔의 옆면(부채꼴). 그림의 하늘색·노랑·빨강 면과 같은 색.
  // 부채꼴: 꼭짓점이 위, 호가 아래. 반지름 = 모선, 호의 길이 = 밑면의 둘레, 중심각 = 360×반지름÷모선
  const FAN = { W: 1.9021, H: 1.309, TOP: 0.309, MID: 0.3455, BOT: 0.6545 }; // 중심각 216° 부채꼴(반지름 1)의 가로·세로·꼭짓점 위 여유·상자 중심까지·세로 중심에서 아래까지
  // 조각 줄의 배치(그림 좌표). 태블릿: 한 줄(큰 부채꼴 · 고리 · 작은 부채꼴), 휴대폰: 두 줄(큰 부채꼴 / 고리 · 작은 부채꼴)
  function netLayout(M, narrow, rowTop) {
    const R2 = M.R2, R1 = M.R1, r2 = M.r2, g = 0.3 * R2, items = [], rows = [];
    if (!narrow) {
      const total = FAN.W * R2 + 2 * r2 + FAN.W * R1 + 2 * g, kw = 6.8 / total, Hm = Math.max(FAN.H * R2, 2 * r2) * kw, yc = rowTop + Hm / 2, x0 = -(total * kw) / 2;
      items.push({ k: 'big', ax: x0 + (FAN.W * R2 * kw) / 2, ay: yc - FAN.MID * R2 * kw, R: R2 * kw, cm: R2, row: 0 });
      items.push({ k: 'ring', cx: x0 + (FAN.W * R2 + g + r2) * kw, cy: yc, R: r2 * kw, r: M.r1 * kw, row: 0 });
      items.push({ k: 'small', ax: x0 + (FAN.W * R2 + g + 2 * r2 + g + (FAN.W * R1) / 2) * kw, ay: yc - FAN.MID * R1 * kw, R: R1 * kw, cm: R1, row: 0 });
      rows.push({ bot: yc + FAN.BOT * R2 * kw });
      return { items, rows, kw, bottom: rows[0].bot, textBottom: rows[0].bot + 1.6 };
    }
    const g2 = 0.48 * R2, w2 = 2 * r2 + g2 + FAN.W * R1, kw = Math.min(4.4 / (FAN.W * R2), 4.4 / w2), H1 = FAN.H * R2 * kw, yc1 = rowTop + H1 / 2, gapW = 2.7;
    const H2 = Math.max(2 * r2, FAN.H * R1) * kw, top2 = rowTop + H1 + gapW, yc2 = top2 + H2 / 2, x0 = -(w2 * kw) / 2;
    items.push({ k: 'big', ax: 0, ay: yc1 - FAN.MID * R2 * kw, R: R2 * kw, cm: R2, row: 0 });
    items.push({ k: 'ring', cx: x0 + r2 * kw, cy: yc2, R: r2 * kw, r: M.r1 * kw, row: 1 });
    items.push({ k: 'small', ax: x0 + (2 * r2 + g2 + (FAN.W * R1) / 2) * kw, ay: yc2 - FAN.MID * R1 * kw, R: R1 * kw, cm: R1, row: 1 });
    rows.push({ bot: yc1 + FAN.BOT * R2 * kw }, { bot: yc2 + Math.max(FAN.BOT * R1, r2) * kw });
    return { items, rows, kw, bottom: rows[1].bot, textBottom: rows[1].bot + 2.0 };
  }
  function sv55() {
    const model = (s) => {
      const K = clamp(Math.round(s.s55K), 2, 5), j = clamp(Math.round(s.s55J), 1, K - 1), mode = s.svMode === 'vol' ? 'vol' : 'surf';
      s.s55K = K; s.s55J = j;
      const r2 = 3 * K, h2 = 4 * K, R2 = 5 * K, r1 = 3 * j, h1 = 4 * j, R1 = 5 * j;
      const lat2 = V(0, r2 * R2), ann = V(0, r2 * r2 - r1 * r1), lat1 = V(0, r1 * R1), surf = vadd(lat2, vadd(ann, lat1)), v2 = V(0, (r2 * r2 * h2) / 3), v1 = V(0, (r1 * r1 * h1) / 3), vol = vsub(v2, v1);
      return { K, j, mode, r2, h2, R2, r1, h1, R1, lat2, ann, lat1, surf, v2, v1, vol, ans: mode === 'vol' ? vol : surf };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, narrow = b.W < 560, sc = 4.4 / Math.max(M.h2, 2 * M.r2), r2 = M.r2 * sc, h2 = M.h2 * sc, r1 = M.r1 * sc, h1 = M.h1 * sc, t = C.problem ? 0 : C.t;
      const surfMode = M.mode === 'surf', slide = ease(lin01(t, 0, 0.5)) * (r2 + r1 * 1.7), te = ease(lin01(t, 0.5, 0.9));
      // 밑면이 아래: 원뿔의 밑면(아래)에서 같은 모양의 작은 원뿔만큼 파냈어요. 아래에서 조금 올려다본 모습이에요.
      const y0 = -h2 / 2, yt = y0 + h2;
      const outer = revolveMesh([[r2, y0], [0, yt]], { N: 48 });
      const cav = flipMesh(revolveMesh([[r1, y0], [0, y0 + h1]], { N: 48 }));
      const ann = { faces: [{ pts: circPts(v3(0, y0, 0), v3(1, 0, 0), v3(0, 0, 1), r2, 64), holes: [circPts(v3(0, y0, 0), v3(1, 0, 0), v3(0, 0, 1), r1, 64)], n: v3(0, -1, 0), c: v3(0, y0, 0), tag: 'ann' }], edges: [] };
      const piece = xfMesh(revolveMesh([[0, y0], [r1, y0], [0, y0 + h1]], { N: 48, tags: ['bot', 'side'] }), shiftT(D.hx(slide)));
      const outerBox = [-1, 1].flatMap((i) => [y0, yt].flatMap((yv) => [-1, 1].map((k2) => v3(i * r2, yv, k2 * r2))));
      const solidPts = slide > 1e-3 ? outerBox.concat([-1, 1].flatMap((i) => [y0, y0 + h1].flatMap((yv) => [-1, 1].map((k2) => add3(v3(i * r1, yv, k2 * r1), D.hx(slide)))))) : outerBox;
      const bb = bboxOf(outerBox.map(D.P)), sbb = bboxOf(solidPts.map(D.P)), rowTop = bb.y1 + 0.9;
      const showNet = surfMode && !C.problem && te > 0.02, L = showNet ? netLayout(M, narrow, rowTop) : null;
      // 부피 풀이는 겨냥도 아래 글로(입체 위에 띄우지 않아요)
      const volTop = rowTop + 0.1, showVol = !surfMode && !C.problem && C.tab !== 'explore';
      if (L && C.tab === 'explore') L.textBottom = L.bottom + 0.8;
      const blend = (narrow || C.tab === 'explore') && L ? ease(lin01(te, 0, 0.15)) : 0, showSolid = !((narrow || C.tab === 'explore') && L && te > 0.15);
      if (blend > 0) { const mix = (p0, q0) => p0 + (q0 - p0) * blend, xr = Math.max(...L.items.map((it) => (it.k === 'ring' ? it.cx + it.R : it.ax + FAN.W * it.R / 2))), xl = Math.min(...L.items.map((it) => (it.k === 'ring' ? it.cx - it.R : it.ax - FAN.W * it.R / 2))); D.fit([], [{ x: mix(sbb.x0, xl), y: mix(sbb.y0, rowTop) }, { x: mix(sbb.x1, xr), y: mix(sbb.y1, L.textBottom) }], { l: 24, r: (C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 34), t: 30, b: 30 }); }
      else D.fit(solidPts, L && !narrow ? [{ x: -3.4, y: rowTop }, { x: 3.4, y: L.textBottom }] : showVol ? [{ x: -3, y: volTop }, { x: 3, y: volTop + 1.3 }] : [], { l: 24, r: (!L && C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 34), t: 30, b: 30 });
      const lvL = !C.review ? 1 : st === 1 ? 2 : 1, lvA = !C.review ? 1 : st === 2 ? 2 : 1, lvI = !C.review ? 1 : st === 3 ? 2 : 1;
      if (showSolid) {
        D.body({ mesh: outer, fill: 'sky', alpha: lvL === 2 ? 0.4 : 0.2, edge: 'ink', edgeW: 2.6 });
        D.body({ mesh: ann, fill: 'amber', alpha: lvA === 2 ? 0.62 : 0.4, edge: 'ink', edgeW: 2.4, sil: false });
        D.path(D.circ(v3(0, y0, 0), v3(1, 0, 0), v3(0, 0, 1), r2, 0, TAU, 72), 'ink', 2.6, {});
        D.path(D.circ(v3(0, y0, 0), v3(1, 0, 0), v3(0, 0, 1), r1, 0, TAU, 72), 'ink', 2.4, {});
        D.body({ mesh: cav, fill: 'red', alpha: lvI === 2 ? 0.55 : 0.32, edge: 'red', edgeW: 1.8, edgeFn: (e) => (e.chain ? { skip: true } : {}), hidden: false });
        if (!C.problem && slide > 0.01) D.body({ mesh: piece, fill: 'red', alpha: 0.2, edge: 'red', edgeW: 2, hidden: true });
        const yaw = Math.atan2(D.cam.sy, D.cam.cy), thR = -yaw, pa = (rr, yy) => v3(rr * Math.cos(thR), yy, rr * Math.sin(thR));
        const c0 = v3(0, y0, 0), sh = D.hx(slide), c1 = add3(c0, sh), apex = v3(0, yt, 0);
        // 길이: 반지름은 중심에서 선으로(바깥 원은 오른쪽 앞, 안쪽 구멍은 왼쪽 앞), 모선은 모서리 바깥에 붙여
        D.radius(c0, add3(c0, mul3(D.rightFront(150), r2)), `반지름 ${M.r2}`, { color: 'amber', end: true, gap: 12 });
        D.radius(c0, add3(c0, mul3(D.rightFront(215), r1)), `반지름 ${M.r1}`, { color: 'red', end: true, gap: 8 });
        D.edgeLab(pa(r2, y0), apex, `모선 ${M.R2}`, { side: { x: 1, y: 0.2 }, color: 'sky', gap: 6 });
        D.edgeLab(add3(pa(r1, y0), sh), add3(v3(0, y0 + h1, 0), sh), `모선 ${M.R1}`, { side: { x: 1, y: 0 }, color: 'red', gap: 6 });
        if (!surfMode) {
          D.height(c0, apex, `높이 ${M.h2}`, { color: 'sky', side: { x: -1, y: 0 }, right: false, alongFrac: 0.35 });
          D.height(c1, add3(c1, v3(0, h1, 0)), `높이 ${M.h1}`, { color: 'red', side: { x: 1, y: 0 }, right: false, alongFrac: -0.2, gap: 16 });
        }
      }
      if (showVol) {
        const px = b.toS({ x: 0, y: volTop }), line = (dy, str, col) => b.stext(px.x, px.y + dy, str, { size: D.fs(14), weight: 800, color: col, align: 'center', baseline: 'middle' });
        if(!C.lesson||(s.svBStage||0)>=1) line(14, `큰 원뿔의 부피 (1/3)×π×${M.r2}×${M.r2}×${M.h2} = ${plainVal(M.v2)}`, 'sky');
        if(!C.lesson||(s.svBStage||0)>=2) line(38, `파낸 원뿔의 부피 (1/3)×π×${M.r1}×${M.r1}×${M.h1} = ${plainVal(M.v1)}`, 'red');
        if(!D.lessonHide) line(64, `남은 부피 = ${plainVal(M.v2)} − ${plainVal(M.v1)} = ${plainVal(M.vol)}`, 'green');
      }
      if (L && te > (narrow ? 0.15 : 0.02)) {
        const kw = L.kw, hlOf = { big: lvL, ring: lvA, small: lvI }, col = { big: 'sky', ring: 'amber', small: 'red' }, ctx = b.ctx;
        const info = { big: { nm: '바깥 옆면', ex: `π×${M.r2}×${M.R2} = ${plainVal(M.lat2)}`, arc: 2 * M.r2, area: M.lat2 }, ring: { nm: '바닥의 고리', ex: `${M.r2 * M.r2}π−${M.r1 * M.r1}π = ${plainVal(M.ann)}` }, small: { nm: '안쪽 옆면', ex: `π×${M.r1}×${M.R1} = ${plainVal(M.lat1)}`, arc: 2 * M.r1, area: M.lat1 } };
        const tx0 = (x, y, str, o) => b.text({ x, y }, str, Object.assign({ size: D.fs(14), weight: 800, color: 'ink', align: 'center', baseline: 'middle' }, o));
        const a0 = te * 1; // 펼쳐지는 동안 점점 나타나요
        L.items.forEach((it) => {
          const ready=!C.lesson||(s.svBStage||0)>={big:1,ring:2,small:3}[it.k];
          const hl = hlOf[it.k], c = col[it.k], rowBot = L.rows[it.row].bot, alpha = (C.tab === 'explore' ? 0.07 : (hl === 2 ? 0.55 : 0.3)) * a0, ew = hl === 2 ? 3.4 : 2.4;
          if (it.k === 'ring') {
            const sc0 = b.toS({ x: it.cx, y: it.cy }), Ro = it.R * b.k, Ri = it.r * b.k;
            ctx.save(); ctx.beginPath(); ctx.arc(sc0.x, sc0.y, Ro, 0, TAU); ctx.moveTo(sc0.x + Ri, sc0.y); ctx.arc(sc0.x, sc0.y, Ri, 0, TAU, true); ctx.fillStyle = b.color(c, alpha); ctx.fill('evenodd'); ctx.restore();
            b.circle({ x: it.cx, y: it.cy }, it.R, { color: C.tab === 'explore' ? 'ink' : c, width: ew, alpha: a0 }); b.circle({ x: it.cx, y: it.cy }, it.r, { color: C.tab === 'explore' ? 'ink' : c, width: ew, alpha: a0 });
            // 반지름: 안쪽 구멍은 위쪽으로, 바깥 원은 아래쪽으로(글자가 고리 안·아래에 놓여요)
            if (C.tab !== 'explore') D.radius({ x: it.cx, y: it.cy }, { x: it.cx, y: it.cy - it.r }, `반지름 ${M.r1}`, { fig: true, color: 'red', end: true, gap: 5, alpha: a0 });
            if (C.tab !== 'explore') D.radius({ x: it.cx, y: it.cy }, { x: it.cx, y: it.cy + it.R }, `반지름 ${M.r2}`, { fig: true, color: 'amber', end: true, gap: 5, alpha: a0 });
          } else {
            b.path(fanPts(it.ax, it.ay, it.R, 216), { close: true, fill: c, fillAlpha: alpha, color: C.tab === 'explore' ? 'ink' : c, width: ew, alpha: a0 });
            if (C.tab !== 'explore') {
            const rEnd = { x: it.ax + it.R * Math.cos(-18 * DEG), y: it.ay + it.R * Math.sin(-18 * DEG) };
            D.edgeLab({ x: it.ax, y: it.ay }, rEnd, `모선 ${it.cm}`, { fig: true, side: { x: 0.3, y: -1 }, color: c, alpha: a0, gap: 3 });
            if (it.k === 'big' && !C.lesson) tx0(it.ax, it.ay, '중심각 216°', { dy: 0.2 * it.R * b.k, size: D.fs(13), alpha: a0 });
            if(ready) D.areaLab({ x: it.ax, y: it.ay + 0.62 * it.R }, '넓이', plainVal(info[it.k].area), { fig: true, maxW: it.k === 'big' ? 110 : 70, alpha: a0, dy: it.k === 'big' ? 14 : 4 });
            if(!C.lesson) tx0(it.ax, it.ay + it.R, `호의 길이 ${plainVal(V(0, info[it.k].arc))}`, { dy: 16, color: c, alpha: a0 });
            }
          }
          tx0(it.k === 'ring' ? it.cx : it.ax, rowBot, (narrow && C.tab === 'explore' ? ({big:'바깥 옆면',ring:'고리',small:'안쪽'}[it.k]) : info[it.k].nm), { dy: C.tab === 'explore' ? 15 : 40, color: C.tab === 'explore' ? 'ink' : c, alpha: a0 });
          if (C.tab === 'explore' || !ready) return;
          const exParts = narrow ? info[it.k].ex.split(' = ') : [info[it.k].ex];
          exParts.forEach((ln, li) => tx0(it.k === 'ring' ? it.cx : it.ax, rowBot, li ? `= ${ln}` : ln, { dy: 60 + li * 19, alpha: a0 }));
        });
        if (te > 0.95 && C.tab !== 'explore' && !D.lessonHide) { const pxT = b.toS({ x: 0, y: L.bottom }); b.stext(pxT.x, pxT.y + (narrow ? 108 : 88), `겉넓이 = 면 넓이의 합 = ${plainVal(M.lat2)} + ${plainVal(M.ann)} + ${plainVal(M.lat1)} = ${plainVal(M.surf)}`, { size: D.fs(15), weight: 800, color: 'green', align: 'center', baseline: 'middle' }); }
      }
    };
    return {
      id: 'sv5-5', title: '원뿔 속을 원뿔로 판 입체', short: '원뿔 속 원뿔',
      question: '원뿔 모양 그릇의 속을 같은 모양의 작은 원뿔만큼 파내면 부피와 겉넓이는 각각 어떻게 될까?',
      anim: { key: 's55T', dur: 3, label: '파낸 원뿔 빼내기' }, cam0: { yaw: 28, pitch: -22 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['s55K', 's55J', 's55T'],
      presets: () => [{ group: '구하는 것', label: '겉넓이', apply: (st, lab) => { st.svMode = 'surf'; st.s55T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s55T === 0; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st, lab) => { st.svMode = 'vol'; st.s55T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s55T === 0; }, on: (st) => st.svMode === 'vol' }],
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
        `큰 원뿔(반지름 $${M.r2}$, 높이 $${M.h2}$)의 부피는 $\\frac{1}{3}\\times\\pi\\times${M.r2}^2\\times${M.h2}=${tx(M.v2)}$예요.`,
        `파낸 작은 원뿔(반지름 $${M.r1}$, 높이 $${M.h1}$)의 부피는 $\\frac{1}{3}\\times\\pi\\times${M.r1}^2\\times${M.h1}=${tx(M.v1)}$예요.`,
        `(남은 부피) $=${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요. (부피는 줄어요)`
      ] : [
        `바깥 원뿔의 옆면은 모선 $${M.R2}$, 밑면의 반지름 $${M.r2}$인 부채꼴이에요. 옆넓이는 $\\pi\\times${M.r2}\\times${M.R2}=${tx(M.lat2)}$예요.`,
        `윗면(바닥)은 큰 원에서 작은 원(구멍 입구)을 뺀 고리 모양이에요. $\\pi\\times${M.r2}^2-\\pi\\times${M.r1}^2=${tx(M.ann)}$예요.`,
        `파낸 구멍의 안쪽 면(작은 원뿔의 옆면)이 새로 생겨요. 모선 $${M.R1}$, 반지름 $${M.r1}$이므로 $\\pi\\times${M.r1}\\times${M.R1}=${tx(M.lat1)}$예요.`,
        `(겉넓이) $=${tx(M.lat2)}+${tx(M.ann)}+${tx(M.lat1)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요. (겉넓이는 늘어요)`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines: M.mode === 'vol' ? [{text:'남은 부피 = 큰 원뿔 − 파낸 원뿔',color:'ink'},{text:`$${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^{3}$`,color:'ink'}] : [{text:'겉넓이 = 바깥 옆면 + 고리 + 안쪽 옆면',color:'ink'},{text:`$${tx(M.lat2)}+${tx(M.ann)}+${tx(M.lat1)}=${tx(M.surf)}\\,\\mathrm{cm}^{2}$`,color:'ink'}]} : null,
        guide: `<b>파낸 원뿔 빼내기</b> 막대를 끌면 파낸 ${span('red', '작은 원뿔')}이 구멍에서 ${span('red', '가로로')} 빠져나가요. 밑면이 아래에 있고, 아래에서 조금 올려다본 모습이에요. <b>겉넓이</b>는 아래 전개도의 ${span('sky', '바깥 옆면(부채꼴)')}, ${span('amber', '바닥의 고리')}, ${span('red', '안쪽 옆면(부채꼴)')}을 모두 더해요. 부피는 <b>줄고</b> 겉넓이는 <b>늘어요</b>.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : M.mode === 'vol' ? [rd('큰 원뿔의 부피', plainVal(M.v2) + ' cm³', 'sky', `(1/3)×π×${M.r2}×${M.r2}×${M.h2}`), rd('파낸 원뿔의 부피', plainVal(M.v1) + ' cm³', 'red', `(1/3)×π×${M.r1}×${M.r1}×${M.h1}`), rd('남은 부피', plainVal(M.vol) + ' cm³', 'green', '큰 원뿔 − 파낸 원뿔')] : [rd('바깥 옆면', plainVal(M.lat2) + ' cm²', 'sky', `π×${M.r2}×${M.R2}`), rd('바닥의 고리', plainVal(M.ann) + ' cm²', 'amber', `${M.r2 * M.r2}π − ${M.r1 * M.r1}π`), rd('안쪽 옆면', plainVal(M.lat1) + ' cm²', 'red', `π×${M.r1}×${M.R1}`), rd('겉넓이', plainVal(M.surf) + ' cm²', 'green')],
        formula: `<p>(부피) $=$ (큰 원뿔) $-$ (파낸 원뿔) &nbsp;,&nbsp; (겉넓이) $=$ (바깥 옆면) $+$ (바닥의 고리) $+$ (안쪽 옆면)</p>`,
        rule: '속을 파내면 부피는 줄고(큰 뿔 − 작은 뿔), 겉넓이는 안쪽 면만큼 늘어요',
        notes: notes('바닥은 원 전체가 아니라 <b>고리 모양</b>(큰 원 − 작은 원)이에요.', '구멍의 안쪽 면(작은 원뿔의 옆면)은 <b>더해요</b>. 부피와 겉넓이의 증감이 서로 반대예요.')
      }),
      prob: (M) => {
        let wrongs;
        if (M.mode === 'vol') wrongs = [[vadd(M.v2, M.v1), '파낸 부분은 빼요.'], [M.v2, '파내기 전 큰 원뿔의 부피예요.'], [M.v1, '파낸 작은 원뿔의 부피예요.'], [V(0, M.r2 * M.r2 * M.h2 - M.r1 * M.r1 * M.h1), '$\\frac{1}{3}$을 곱하지 않았어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.']];
        else wrongs = [[vadd(M.lat2, vadd(V(0, M.r2 * M.r2), M.lat1)), '바닥은 큰 원에서 작은 원을 뺀 고리 모양이에요.'], [vadd(M.lat2, M.ann), '구멍 안쪽 면을 더하지 않았어요.'], [vadd(vsub(M.lat2, M.lat1), M.ann), '구멍 안쪽 면은 빼는 것이 아니라 더해요.'], [vadd(M.lat2, M.lat1), '바닥의 고리를 빠뜨렸어요.'], [M.lat2, '바깥 옆면만 구했어요.']];
        const stem = `그림과 같이 밑면의 반지름이 $${M.r2}\\,\\mathrm{cm}$, 높이가 $${M.h2}\\,\\mathrm{cm}$, 모선의 길이가 $${M.R2}\\,\\mathrm{cm}$인 원뿔의 밑면에서, 같은 모양의 작은 원뿔(밑면의 반지름 $${M.r1}\\,\\mathrm{cm}$, 높이 $${M.h1}\\,\\mathrm{cm}$, 모선 $${M.R1}\\,\\mathrm{cm}$)을 파냈다. 이 입체의 ${M.mode === 'vol' ? '부피' : '겉넓이'}는?`;
        return { tag: M.mode === 'vol' ? '속을 파낸 원뿔의 부피' : '속을 파낸 원뿔의 겉넓이', key: `${M.mode}|${M.K}|${M.j}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  /* ================================================================ sv5-6 붙인 입체 종합 */
  const TOP56 = { cyl: '원기둥', hemi: '반구', cone: '원뿔' };
  const CONE56 = { 3: [4, 5], 4: [3, 5], 6: [8, 10] }; // r → [높이, 모선]
  function sv56() {
    const model = (s) => {
      const top = oneOf(s.svTop, ['cyl', 'hemi', 'cone'], 'cyl'), mode = s.svMode === 'vol' ? 'vol' : 'surf', H = clamp(Math.round(s.s56H), 2, 20);
      let r = clamp(Math.round(s.s56R), 1, 7);
      if (top === 'cone') r = [3, 4, 6].includes(r) ? r : 3;
      const a = clamp(Math.max(Math.round(s.s56A), 2 * r), 4, 15), z = clamp(Math.round(s.s56Z), 1, 20);
      s.s56A = a; s.s56R = r; s.s56H = H; s.s56Z = z;
      const box = V(2 * a * a + 4 * a * H), cover = V(0, -r * r), vBox = V(a * a * H);
      let add, vTop, topText, hc = 0, R = 0;
      if (top === 'cyl') { add = V(0, r * r + 2 * r * z); vTop = V(0, r * r * z); topText = `원기둥(높이 ${z})`; }
      else if (top === 'hemi') { add = V(0, 2 * r * r); vTop = V(0, (2 * r * r * r) / 3); topText = '반구'; }
      else { [hc, R] = CONE56[r]; add = V(0, r * R); vTop = V(0, (r * r * hc) / 3); topText = `원뿔(높이 ${hc}, 모선 ${R})`; }
      const surf = vadd(box, vadd(cover, add)), vol = vadd(vBox, vTop);
      return { top, mode, a, H, r, z, hc, R, box, cover, add, vBox, vTop, topText, surf, vol, ans: mode === 'vol' ? vol : surf };
    };
    const simpleNet56 = (b,s,M,C) => {
      const D=G.scene3(b,s,C,{yaw:0,pitch:0}), a=M.a, h=M.H, r=M.r, gap=Math.max(1,a*0.15), width=3*a+2*gap, secR=M.R, deg=M.top==='cone'?360*r/secR:0;
      const topY=0, lowY=-(a+gap*2), x0=-width/2;
      const rect=(x,y,w,h)=>D.panel([v3(x,y,0),v3(x+w,y,0),v3(x+w,y+h,0),v3(x,y+h,0)],'sky',0.06,'ink',2);
      const r2w=M.top==='cyl'?2*PI*r:2*secR, r2h=M.top==='cyl'?M.z:secR*1.8, lowLeft=-Math.max(r2w+2*r+gap,width)/2;
      const topHeight=Math.max(a,h), lowerDepth=M.top==='cyl'?Math.max(r2h,M.z/2+r):r2h;
      D.fit([v3(x0,topY,0),v3(x0+width,topY+topHeight,0),v3(lowLeft,lowY-lowerDepth,0),v3(lowLeft+r2w+2*r+gap,lowY,0)],[],{l:16,r:(window.innerWidth>=700&&b.W>=560?245:16),t:20,b:30});
      rect(x0,topY,a,a); D.path(D.circ(v3(x0+a/2,topY+a/2,0),v3(1,0,0),v3(0,1,0),r,0,TAU,64),'ink',2,{});
      rect(x0+a+gap,topY,a,a); rect(x0+2*(a+gap),topY,a,h);
      D.areaLab(v3(x0+a/2,topY+a/2,0),'윗면','',{size:11,dy: a*b.k*0.6}); D.areaLab(v3(x0+a+gap+a/2,topY+a/2,0),'아랫면','',{size:11}); D.areaLab(v3(x0+2*(a+gap)+a/2,topY+h/2,0),'옆면 ×4','',{size:11});
      if(M.top==='cyl'){rect(lowLeft,lowY-M.z,2*PI*r,M.z); const ct=v3(lowLeft+2*PI*r+gap+r,lowY-M.z/2,0); D.panel(D.circ(ct,v3(1,0,0),v3(0,1,0),r,0,TAU,64),'sky',0.06,'ink',2); D.areaLab(v3(lowLeft+PI*r,lowY-M.z/2,0),'원기둥 옆면','',{size:11}); D.areaLab(ct,'윗면','',{size:11});}
      else { const cx=lowLeft+secR, apex=v3(cx,lowY,0), pts=[apex]; for(let i=0;i<=48;i++){const th=(-90-deg/2+deg*i/48)*DEG;pts.push(v3(cx+secR*Math.cos(th),lowY+secR*Math.sin(th),0));} D.panel(pts,'sky',0.06,'ink',2); D.areaLab(v3(cx,lowY-secR*0.55,0),'원뿔 옆면','',{size:11});}
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, tot = M.a + (M.top === 'cyl' ? M.z : M.top === 'hemi' ? M.r : M.hc), sc = 4.2 / Math.max(M.a, tot), a = M.a * sc, H = M.H * sc, r = M.r * sc, t = C.problem ? 0 : C.t, sd = ease(t) * (a / 2 + r * 1.5), narrow = b.W < 560, surfMode = M.mode === 'surf';
      const te = ease(lin01(t, 0.5, 0.95)), yTop = H / 2;
      if (!C.problem && C.tab === 'explore' && surfMode && M.top !== 'hemi' && t >= 0.6) return simpleNet56(b,s,M,C);
      const boxM = boxMesh(-a / 2, a / 2, -H / 2, H / 2, -a / 2, a / 2);
      let topM;
      if (M.top === 'cyl') topM = revolveMesh([[0, 0], [r, 0], [r, M.z * sc], [0, M.z * sc]], { O: v3(0, yTop, 0), N: 40, tags: ['bot', 'side', 'top'] });
      else if (M.top === 'hemi') topM = revolveMesh([[0, 0], [r, 0], ...sphereProfile(r, 0, 90, 14).slice(1)], { O: v3(0, yTop, 0), N: 40, tags: ['bot'] });
      else topM = revolveMesh([[0, 0], [r, 0], [0, M.hc * sc]], { O: v3(0, yTop, 0), N: 40, tags: ['bot', 'side'] });
      const topY = M.top === 'cyl' ? M.z * sc : M.top === 'hemi' ? r : M.hc * sc;
      topM = xfMesh(topM, shiftT(D.hx(sd)));
      const pts = cube8(v3(0, 0, 0), Math.max(a / 2, H / 2)).concat([add3(v3(0, yTop + topY, 0), D.hx(sd)), add3(v3(r, yTop, r), D.hx(sd)), add3(v3(-r, yTop, -r), D.hx(sd))]);
      const bbx = bboxOf(pts.map(D.P));
      // 겉넓이: 겉면을 하나씩 늘어놓은 조각 줄(그림과 같은 색: 하늘색 = 상자, 초록 = 위에 올린 입체). 맞붙어 가려진 면(빨강 원)은 상자 윗면에서 빠져요.
      const hlBox = !C.review ? 1 : st === 1 ? 2 : st === 2 ? 2 : 1, hlTop = !C.review ? 1 : st === 3 ? 2 : 1;
      let rows = null;
      if (!C.problem && surfMode && M.top !== 'hemi' && (C.review || te > 0.02)) {
        const fr = M.r / M.R, deg = M.top === 'cone' ? Math.round(360 * M.r / M.R) : 0, half = deg / 2, xh = half >= 90 ? M.R : M.R * Math.sin(half * DEG), topH = half > 90 ? -Math.cos(half * DEG) * M.R : 0;
        void fr;
        const row1 = [{ w: M.a, h: M.a, shape: 'hole', holeR: M.r / M.a, fill: 'sky', label: plainVal(V(M.a * M.a, -M.r * M.r)), cap: '상자 윗면', hl: hlBox }, { w: M.a, h: M.a, shape: 'rect', fill: 'sky', label: `${M.a * M.a}`, cap: '상자 아랫면', capN: '아랫면', hl: hlBox }, { w: M.a, h: M.H, shape: 'rect', count: 4, fill: 'sky', label: `${M.a * M.H}`, cap: '상자 옆면 ×4', capN: '옆면 ×4', hl: hlBox }];
        let row2;
        if (M.top === 'cyl') row2 = [{ w: 2 * PI * M.r, h: M.z, shape: 'rect', fill: 'green', label: `2×π×${M.r}×${M.z} = ${plainVal(V(0, 2 * M.r * M.z))}`, cap: '원기둥의 옆면', hl: hlTop }, { w: 2 * M.r, h: 2 * M.r, shape: 'circle', fill: 'green', label: plainVal(V(0, M.r * M.r)), cap: '원기둥의 윗면', hl: hlTop }];
        else if (M.top === 'hemi') row2 = [{ w: 2 * PI * M.r, h: M.r, shape: 'rect', fill: 'green', label: `2×π×${M.r}×${M.r} = ${plainVal(V(0, 2 * M.r * M.r))}`, cap: '반구의 곡면', hl: hlTop }];
        else row2 = [{ w: 2 * xh, h: M.R + topH, shape: 'fan', R: M.R, deg, top: topH, fill: 'green', lab: `π×${M.r}×${M.R} = ${plainVal(V(0, M.r * M.R))}`, capt: `원뿔의 옆면 (모선 ${M.R}, 중심각 ${deg}°)`, hl: hlTop }];
        row1.forEach((q) => { if (narrow && q.capN) q.cap = q.capN; });
        if(C.lesson) {
          row1.forEach((q,i)=>{if(!(i===0?s.svSideReady:s.svBaseReady)){q.label='';q.lab='';}});
          if(!s.svOtherReady)row2.forEach(q=>{q.label='';q.lab='';});
        }
        if (C.tab === 'explore') { [...row1,...row2].forEach(q => { q.label = ''; q.lab = ''; q.cap = ''; q.capt = ''; q.fill = 'sky'; q.edge = 'ink'; q.alpha = 0.06; q.size = 11; }); ['윗면','아랫면','옆면'].forEach((v,i)=>{row1[i].label=v;}); if(M.top === 'cyl') { row2[0].label='옆면'; row2[1].label='윗면'; } else row2[0].capt='원뿔 옆면'; }
        rows = spaceRows(D, G.layoutTileRows([row1, row2], narrow ? 4.6 : 6.4, narrow ? 1.9 : 1.7, 2.2, 2.2), narrow ? 4.6 : 6.4);
      }
      const volParts = !C.problem && !surfMode && C.tab !== 'explore' ? [{ v: vnum(M.vBox), fill: 'sky', label: C.lesson&&!s.svBigReady?'상자':`상자 ${plainVal(M.vBox)}`, hl: !C.review ? 1 : st === 1 ? 2 : 1 }, { v: vnum(M.vTop), fill: 'green', label: C.lesson&&!s.svSmallReady?TOP56[M.top]:`${TOP56[M.top]} ${plainVal(M.vTop)}`, hl: !C.review ? 1 : st === 2 ? 2 : 1 }] : null;
      const rowTop = bbx.y1 + 0.8, rowsReg = rows ? [{ x: -rows.total / 2, y: rowTop }, { x: rows.total / 2, y: rowTop + rows.height + (C.tab === 'explore' ? 0.5 : 3.0) }] : volParts ? [{ x: -3, y: rowTop }, { x: 3, y: rowTop + 2.4 }] : [];
      const blend = (narrow || C.tab === 'explore') && rows ? ease(lin01(te, 0, 0.15)) : 0, showSolid = !((narrow || C.tab === 'explore') && rows && te > 0.15);
      const showRows = rows && te > (narrow ? 0.15 : 0.01);
      const fitPad=blend>0?26:30, fitOpt={l:fitPad,r:(C.tab==='explore'&&window.innerWidth>=700&&b.W>=560?245:fitPad),t:30,b:30};
      // 조각 줄로 넘어가는 중에도 아직 보이는 입체는 화면 맞춤에 포함합니다.
      const fitPts=showSolid?pts:[], mix=(p0,q0)=>p0+(q0-p0)*blend;
      // 조각은 가로로만 펼쳐지므로, 보이기 시작한 줄은 이름표 여백까지 전체 높이를 맞춥니다.
      const fitExtra=showRows?rowsReg:blend>0?[{x:mix(bbx.x0,rowsReg[0].x),y:mix(bbx.y0,rowTop)},{x:mix(bbx.x1,rowsReg[1].x),y:mix(bbx.y1,rowsReg[1].y)}]:narrow&&rows?[]:rowsReg;
      D.fit(fitPts,fitExtra,fitOpt);
      if(showSolid&&!C.thumb){
        // 바깥 높이와 끝점 밖 반지름 글자까지 맞춥니다. 이미 들어가면 배치를 유지합니다.
        const labelW=G.textW(`높이 ${M.H}`,D.fs(15)*b.fs*b._ts())+6;
        const radiusSize=D.fs(14)*b.fs*b._ts(), radiusW=G.textW(`반지름 ${M.r}`,radiusSize)+6, radiusH=radiusSize*1.2;
        const radiusCenter=add3(v3(0,yTop,0),D.hx(sd)), radiusEnd=add3(radiusCenter,mul3(D.rightFront(),r));
        const rightLimit=b.W-fitOpt.r; // 목차 탭·데스크톱 카드의 기존 여백도 지킵니다.
        for(let pass=0;pass<3;pass++){
          const left=D.px(v3(-a/2,0,a/2)).x-18-5-labelW;
          const A=D.px(radiusCenter), B=D.px(radiusEnd), L=Math.hypot(B.x-A.x,B.y-A.y), ux=(B.x-A.x)/L, uy=(B.y-A.y)/L;
          const right=L<3?0:B.x+ux*(12+Math.abs(ux)*radiusW/2+Math.abs(uy)*radiusH/2)+radiusW/2;
          const dl=Math.max(0,8-left), dr=Math.max(0,right-rightLimit);
          if(dl<0.01&&dr<0.01)break;
          fitOpt.l+=(pass?2:1)*dl;fitOpt.r+=(pass?2:1)*dr;D.fit(fitPts,fitExtra,fitOpt);
        }
      }
      if (rows) spaceRows(D, rows, narrow ? 4.6 : 6.4);
      const lvC = !C.review || !surfMode ? 1 : st === 2 ? 2 : 1, lvT = !C.review ? 1 : surfMode ? (st === 3 ? 2 : 1) : (st === 2 ? 2 : 1);
      if (showSolid) {
        D.body({ mesh: boxM, fill: 'sky', alpha: 0.2, edge: 'ink', faceStyle: (f) => (f.n && f.n.y > 0.9 && lvC === 2 ? { fill: 'red', alpha: 0.4 } : {}) });
        D.body({ mesh: topM, fill: lvT === 2 ? 'amber' : 'green', alpha: lvT === 2 ? 0.4 : 0.26, edge: 'ink', faceStyle: (f) => (f.tag === 'bot' ? { fill: 'red', alpha: sd > r * 0.5 ? 0.42 : 0.06 } : {}) });
        // 붙은 자리(상자 윗면의 원)
        const cyc = v3(0, yTop, 0), sh = D.hx(sd), c0 = v3(0, 0, 0);
        if (sd > r * 0.4 && !C.problem) D.disc(cyc, v3(1, 0, 0), v3(0, 0, 1), r, 'red', 0.4, 'red', 2.6);
        // 길이: 상자(바깥 치수선) · 위에 올린 입체(반지름·높이·모선)
        D.dim(v3(-a / 2, -H / 2, a / 2), v3(a / 2, -H / 2, a / 2), `${M.a}`, { from: c0, off: 15 });
        D.dim(v3(a / 2, -H / 2, a / 2), v3(a / 2, -H / 2, -a / 2), `${M.a}`, { from: c0, off: 15 });
        D.dim(v3(-a / 2, -H / 2, a / 2), v3(-a / 2, H / 2, a / 2), `높이 ${M.H}`, { side: { x: -1, y: 0 }, off: 18, color: 'amber' });
        const ytopC = add3(cyc, sh);
        D.radius(ytopC, add3(ytopC, mul3(D.rightFront(), r)), `반지름 ${M.r}`, { color: 'amber', end: true, gap: 12 });
        if (M.top === 'cyl') D.dim(add3(v3(-r, yTop, 0), sh), add3(v3(-r, yTop + M.z * sc, 0), sh), `높이 ${M.z}`, { side: { x: -1, y: 0 }, off: 14, color: 'amber' });
        if (M.top === 'cone') {
          D.edgeLab(add3(v3(r, yTop, 0), sh), add3(v3(0, yTop + M.hc * sc, 0), sh), `모선 ${M.R}`, { side: { x: 1, y: 0 }, color: 'ink', gap: 6 });
          D.height(ytopC, add3(ytopC, v3(0, M.hc * sc, 0)), `높이 ${M.hc}`, { color: 'amber', side: { x: -1, y: 0 }, right: false });
        }
      }
      if (showRows) {
        slideTiles(rows, te);
        // 좁은 정리 화면에서는 조각이 겹친 채 이동하는 동안 계산값까지
        // 겹쳐 읽히지 않게 합니다. 면은 계속 보이고, 펼침을 마치면 값이 나타납니다.
        const movingReview = C.review && narrow && te < 0.999;
        const shownRows = movingReview ? { ...rows, rows: rows.rows.map(L => ({ ...L,
          tiles: L.tiles.map(tile => ({ ...tile, label: '', lab: '', cap: '', capt: '' }))
        })) } : rows;
        drawRows(D, shownRows, 0, rowTop);
        if (te > 0.95 && !movingReview && C.tab !== 'explore' && (!C.review || st >= 4)) totalText(D, rows, rowTop, `겉넓이 = 면 넓이의 합 = ${plainVal(M.surf)}`, 64);
      }
      if (volParts) {
        G.drawBars(D, volParts, 0, rowTop, 5.6, 0, {});
        if(!D.lessonHide) b.text({ x: 0, y: rowTop + 0.62 }, `부피 = ${plainVal(M.vBox)} + ${plainVal(M.vTop)}${(plainVal(M.vBox) + '+' + plainVal(M.vTop)) === plainVal(M.vol) ? '' : ` = ${plainVal(M.vol)}`}`, { dy: 36, size: D.fs(15), weight: 800, color: 'green', baseline: 'middle' });
      }
      // 정리 탭: 지금 단계의 식 한 줄(해설이 말하는 값이 그림에 보이게). 결과 줄은 해설 재생 중 svShowV 까지 숨김. 탐구·문제 탭·썸네일은 그대로.
      if (M.mode === 'surf') {
        const rowSegs = [null,
          [{ t: `상자의 겉넓이 = 2×${M.a}×${M.a} + 4×${M.a}×${M.H} = ${plainVal(M.box)}`, c: 'ink' }],
          [{ t: `붙은 자리가 없어져요: −π×${M.r}² = ${plainVal(M.cover).replace('-', '−')}`, c: 'red' }],
          [{ t: `위 입체의 겉면(붙은 밑면 제외): +${plainVal(M.add)}`, c: 'green' }],
          [{ t: `겉넓이 = ${plainVal(M.box)} ${plainVal(M.cover).replace('-', '− ')} + ${plainVal(M.add)} = ${plainVal(M.surf)}`, c: 'green' }]][Math.min(Math.max(C.step || 0, 0), 4)];
        G.stepRow(D, C, rowSegs, { gated: (C.step || 0) >= 4 });
      } else if(C.lesson) {
        const stage=s.svShowV?3:s.svSmallReady?2:s.svBigReady?1:0;
        G.stepRow(D,C,[null,
          [{t:`상자 부피 = ${M.a}×${M.a}×${M.H} = ${plainVal(M.vBox)}`,c:'sky'}],
          [{t:`위 ${TOP56[M.top]}의 부피 = ${plainVal(M.vTop)}`,c:'green'}],
          [{t:`전체 부피 = ${plainVal(M.vBox)} + ${plainVal(M.vTop)} = ${plainVal(M.vol)}`,c:'green'}]][Math.min(stage,3)],{gated:stage>=3});
      }
    };
    return {
      id: 'sv5-6', title: '붙인 입체 종합', short: '붙인 입체 종합',
      question: '상자 위에 다른 입체를 올려 붙이면 겉넓이는 어떻게 구할까? 붙은 자리는 어떻게 될까?',
      anim: { key: 's56T', dur: 3, label: '위 입체 떼어 놓기' }, cam0: { yaw: 28, pitch: 24 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: (s) => ['s56A', 's56H', 's56R'].concat(oneOf(s.svTop, ['cyl', 'hemi', 'cone'], 'cyl') === 'cyl' ? ['s56Z'] : [], ['s56T']),
      presets: () => Object.keys(TOP56).map((k, i) => ({ group: i === 0 ? '위에 올린 입체' : '', label: TOP56[k], apply: (st, lab) => { st.svTop = k; st.s56T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => oneOf(st.svTop, ['cyl', 'hemi', 'cone'], 'cyl') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st, lab) => { st.svMode = 'surf'; st.s56T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s56T === 0; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st, lab) => { st.svMode = 'vol'; st.s56T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s56T === 0; }, on: (st) => st.svMode === 'vol' }]),
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
        `아래 상자의 겉넓이는 $2\\times${M.a}\\times${M.a}+4\\times${M.a}\\times${M.H}=${tx(M.box)}\\,\\mathrm{cm}^2$예요.`,
        `위 입체가 붙은 자리(반지름 $${M.r}$인 원)는 겉면에서 없어져요. $-\\pi\\times${M.r}^2=${tx(M.cover)}$예요.`,
        `위에 올린 ${M.topText}의 겉면(붙은 밑면은 제외)을 더해요: ${M.top === 'cyl' ? `옆면 $2\\times\\pi\\times${M.r}\\times${M.z}$ + 윗면 $\\pi\\times${M.r}^2$` : M.top === 'hemi' ? `곡면 $2\\times\\pi\\times${M.r}^2$` : `옆면 $\\pi\\times${M.r}\\times${M.R}$`} $=${tx(M.add)}$예요.`,
        `(겉넓이) $=${tx(M.box)}${tx(M.cover).startsWith('-') ? '' : '+'}${tx(M.cover)}+${tx(M.add)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines: M.mode === 'vol' ? [{text:'부피 = 상자 + 위 입체',color:'ink'},{text:`$${tx(M.vBox)}+${tx(M.vTop)}=${tx(M.vol)}\\,\\mathrm{cm}^{3}$`,color:'ink'}] : [{text:'겉넓이 = 상자 − 붙은 면 + 위 겉면',color:'ink'},{text:`$${tx(M.box)}${tx(M.cover)}+${tx(M.add)}=${tx(M.surf)}\\,\\mathrm{cm}^{2}$`,color:'ink'},{text:M.top === 'hemi' ? '반구 곡면은 구 겉넓이의 절반이에요.' : '맞붙은 면은 겉에 드러나지 않아요.',color:'ink'}]} : null,
        guide: `<b>위에 올린 입체</b>와 <b>구하는 것</b> 칩을 골라 보세요. <b>위 입체 떼어 놓기</b>를 끌면 올린 입체가 ${span('green', '가로로')} 옮겨지고 상자 위에 ${span('red', '붙어 있던 원')}이 드러나요. 겉넓이는 ${M.top === 'hemi' ? '반구의 곡면과 ' : '전개된 '}${span('sky', '상자의 겉면')}(윗면은 이 원을 뺀 모양)과 ${span('green', '위 입체의 겉면')}을 모두 더해요.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : M.mode === 'vol' ? [rd('상자의 부피', plainVal(M.vBox) + ' cm³', 'sky', `${M.a}×${M.a}×${M.H}`), rd(`${TOP56[M.top]}의 부피`, plainVal(M.vTop) + ' cm³', 'green'), rd('부피', plainVal(M.vol) + ' cm³', 'amber')] : [rd('상자의 겉넓이', plainVal(M.box) + ' cm²', 'sky', `2×${M.a}×${M.a} + 4×${M.a}×${M.H}`), rd('맞붙어 가려진 면', plainVal(M.cover) + ' cm²', 'red', '겉넓이에서 빼요'), rd('위 입체의 겉면', '+' + plainVal(M.add) + ' cm²', 'green', M.top === 'cyl' ? '옆면 + 윗면' : M.top === 'hemi' ? '곡면' : '옆면'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'amber')],
        formula: `<p>(겉넓이) $=$ (상자의 겉넓이) $-$ (맞붙어 가려진 면) $+$ (위 입체의 겉면, 붙은 밑면 제외) &nbsp;·&nbsp; (부피) $=$ (상자) $+$ (위 입체)</p>`,
        rule: '붙인 입체: 붙은 면은 양쪽에서 빼고, 겉으로 드러난 면만 더해요',
        notes: notes('위에 올린 입체의 <b>밑면(붙은 면)은 더하지 않아요</b>. 상자의 윗면에서도 그 자리를 빼요.', '원기둥을 올리면 붙은 원을 빼고 윗면의 원을 더해서 서로 <b>지워져요</b>(옆면만 늘어요).', '원뿔의 옆넓이에는 모선을, 부피에는 높이를 써요.')
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
