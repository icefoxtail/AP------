/* ==========================================================================
   중1 · 겉넓이와 부피 — 탭 ③ 「구」 (t3.js, order 30) — 장면 6개
   · sv3-1 구의 겉넓이 4πr²(껍질이 원 4개로) · sv3-2 반구(레이저로 자르고 가로로 갈라 3πr²)
   · sv3-3 원뿔·구·원기둥 부피 1:2:3(수조에 넣어 넘친 물) · sv3-4 수조 문제(넘친 물·남은 물)
   · sv3-5 1/4·1/8 구 · sv3-6 구 종합(겉넓이·부피)
   움직임은 가로로만: 레이저 평면·반구·조각·물체는 가로 레일, 수위 상승은 채움(가로 막대 병행), 물속으로 들어가는 동작은 페이드입니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SV;
  if (!G) return;
  const { cube8, PI, DEG, clamp, ease, seg01, lin01, v3, add3, sub3, mul3, lerp3, mid3, dot3, V, vadd, vsub, vmul, vnum, tx, plainVal, mkV, P, fmtN, pick, rint, notes, rd, span, scene3, revolveMesh, sphereProfile, xfMesh, shiftT, rotM, rotAbout, compose, centroid, layoutTiles, drawTiles, bboxOf } = G;

  const PARAMS = {
    s6R: P('구의 반지름 r', 1, 8, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s6T: P('껍질 펼치기', 0, 1, 0.01, 0, { color: 'green', hint: '구의 껍질이 원 4개로 가로로 늘어서요', format: (v) => (v < 0.02 ? '구' : v > 0.98 ? '원 4개' : Math.round(v * 100) + '%') }),
    s7R: P('구의 반지름 r', 1, 8, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s7T: P('자르고 · 가르고 · 돌리고 · 합치기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '구' : v < 0.3 ? '레이저로 자르는 중' : v < 0.55 ? '가로로 갈라지는 중' : v < 0.8 ? '단면이 돌아서 보이는 중' : v > 0.99 ? '합치기 완료' : '막대로 합치는 중') }),
    s8R: P('수조의 반지름 r', 2, 6, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s8K: P('수조를 2r보다 더 높게', 0, 4, 1, 0, { color: 'sky', hint: '0이면 높이가 2r예요. 높이를 바꾸면 1:2:3이 깨져요', format: (v, s) => `+${v} cm` }),
    s8T: P('넣기 · 넘치기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.02 ? '레일 위' : v < 0.3 ? '가로 레일로 이동' : v < 0.5 ? '물속에 잠기는 중' : v > 0.99 ? '끝' : '물이 넘치는 중') }),
    s9R: P('구의 반지름 r', 1, 8, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s9T: P('조각 줄 합치기', 0, 1, 0.01, 0, { color: 'green', format: (v) => (v < 0.02 ? '떼어 놓음' : v > 0.98 ? '합침' : Math.round(v * 100) + '%') }),
    sAR: P('구의 반지름 r', 1, 8, 1, 3, { color: 'amber', format: (v) => v + ' cm' })
  };
  const sph = (R, from, to, extra = {}) => revolveMesh(sphereProfile(R, from, to, 48), Object.assign({ N: 40, lines: from === -90 && to === 90 ? [24] : [], round: from === -90 && to === 90 }, extra));

  // 가로 막대 줄(합쳐지는 조각 줄)
  function drawBars(D, parts, cx, top, W, merge, op = {}) {
    const { b } = D, tot = parts.reduce((s, p) => s + p.v, 0), gap = merge >= 1 ? 0 : 0.35;
    const gapE = 0.35 * (1 - ease(merge)), scale = (W - gapE * (parts.length - 1)) / tot, H = op.h || 0.62;
    let x = cx - W / 2;
    parts.forEach((p) => {
      const w = p.v * scale, hl = p.hl == null ? 1 : p.hl;
      b.path([{ x, y: top }, { x: x + w, y: top }, { x: x + w, y: top + H }, { x, y: top + H }], { close: true, fill: p.fill, fillAlpha: hl === 2 ? 0.55 : hl === 0 ? 0.1 : 0.34, color: hl === 2 ? 'amber' : p.fill, width: hl === 2 ? 3.2 : 2.2, alpha: hl === 0 ? 0.5 : 1 });
      const eff = D.fs(14) * b.fs * b._ts(), tw = G.textW(p.label, eff) + 8;
      if (tw <= w * b.k) b.text({ x: x + w / 2, y: top + H / 2 }, p.label, { color: 'ink', size: D.fs(14), weight: 800, baseline: 'middle' });
      else b.text({ x: x + w / 2, y: top + H }, p.label, { dy: eff * 0.9, color: 'ink', size: D.fs(14), weight: 800, baseline: 'middle' });
      x += w + gapE;
    });
    void gap;
    if (op.total && merge > 0.7) b.text({ x: cx, y: top }, op.total, { dy: -13, color: 'green', size: D.fs(16), weight: 800, baseline: 'middle' });
  }
  const sphereLabels = (D, R, c, rLabel, op = {}) => {
    const p0 = c, p1 = add3(c, D.hx(R));
    D.line(p0, p1, op.color || 'ink', 2.6);
    D.dot(p0, 'ink', 3.5);
    D.tag(mid3(p0, p1), rLabel, { dy: -12, size: 15, color: 'amber' });
  };

  /* ================================================================ sv3-1 구의 겉넓이 4πr² */
  function sv31() {
    const model = (s) => {
      const r = clamp(Math.round(s.s6R), 1, 8), one = V(0, r * r), tot = V(0, 4 * r * r);
      return { r, one, tot };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, narrow = b.W < 560, t = C.problem ? 0 : C.t, e = ease(t);
      const R = 1.7, cs = V(0, 0), sphM = sph(R, -90, 90);
      const lvS = !C.review ? 1 : st === 3 ? 2 : 1, lvD = !C.review ? 1 : st === 1 ? 3 : st === 2 ? 2 : 1;
      // 원 4개의 줄(가로로만 이동)
      const rows = narrow ? 2 : 1, perRow = 4 / rows;
      const dR = R, gapD = 0.45, rowW = perRow * 2 * dR + (perRow - 1) * gapD;
      const sphereY = 0, rowTop = D.P(v3(0, -R, R)).y + 0.9 + 0.0;
      const finals = [];
      for (let i = 0; i < 4; i++) { const rw = Math.floor(i / perRow), cidx = i % perRow; finals.push({ x: -rowW / 2 + dR + cidx * (2 * dR + gapD), y: rowTop + dR + rw * (2 * dR + 0.55) }); }
      const pts = cube8(v3(0, 0, 0), R);
      const bbS = bboxOf([D.P(v3(-R, -R, -R)), D.P(v3(R, R, R)), D.P(v3(R, -R, -R)), D.P(v3(-R, R, R))]);
      const ext = [{ x: -rowW / 2, y: rowTop }, { x: rowW / 2, y: rowTop + rows * 2 * dR + (rows - 1) * 0.55 + 0.6 }];
      D.fit(pts, C.problem ? [] : ext, { l: 30, r: 30, t: 40, b: 36 });
      D.body({ mesh: sphM, fill: lvS === 2 ? 'amber' : 'sky', alpha: lvS === 2 ? 0.36 : 0.24, edge: 'ink', edgeW: 2.6, hidden: true });
      sphereLabels(D, R, v3(0, 0, 0), `r=${M.r}`);
      if (!C.problem) {
        D.tag(v3(0, 0, 0), `4πr² = ${plainVal(M.tot)}`, { dy: 26, size: 15, color: 'ink' });
        const startCenter = rowW / 2;
        for (let i = 0; i < 4; i++) {
          const f = finals[i], rw = Math.floor(i / perRow), x0 = finals[rw * perRow].x /* 줄의 왼쪽 끝에 겹쳐 있다가 오른쪽으로 */, x = x0 + (f.x - x0) * e;
          const al = 0.12 + 0.28 * e, hl = lvD, ec = hl === 2 ? 'amber' : 'sky';
          b.circle({ x, y: f.y }, dR, { fill: hl === 2 ? 'amber' : 'sky', fillAlpha: hl === 2 ? 0.4 : al * (hl === 3 ? 1.25 : 1), color: ec, width: hl === 2 ? 3.2 : 2.4, alpha: 0.5 + 0.5 * e });
          if (e > 0.55) b.text({ x, y: f.y }, plainVal(M.one), { size: D.fs(15), weight: 800, color: 'ink', baseline: 'middle' });
          if (e > 0.55 && i === 0 || (e > 0.55 && i === perRow)) b.text({ x, y: f.y }, 'πr²', { dy: D.fs(18), size: D.fs(13), weight: 750, color: 'muted', baseline: 'middle' });
        }
        void startCenter;
        if (e > 0.9) b.text({ x: 0, y: rowTop - 0.35 }, `원 4개 → 4 × πr² = 4πr²`, { size: D.fs(15), weight: 800, color: 'amber', baseline: 'middle' });
      } else {
        // 문제: 반지름만 보여 줌
      }
    };
    return {
      id: 'sv3-1', title: '구의 겉넓이 4πr²', short: '구의 겉넓이',
      question: '구의 겉넓이는 구를 꼭 맞게 감싸는 껍질의 넓이야. 이 껍질을 평평하게 펴면 반지름이 같은 원 몇 개의 넓이와 같을까?',
      anim: { key: 's6T', dur: 5, label: '껍질 펼치기' }, cam0: { yaw: 28, pitch: 22 }, stepT: () => 1, thumbT: 1, problemT: 0, view3: false,
      ctl: () => ['s6R', 's6T'],
      init: (s) => { s.s6R = 3; s.s6T = 0; },
      reroll: (s) => { s.s6R = rint(1, 8); s.s6T = 0; },
      model, draw,
      check: (s) => { const M = model(s); let a = 0; const n = 4000; for (let i = 0; i < n; i++) { const th0 = (PI * i) / n, th1 = (PI * (i + 1)) / n; a += PI * (M.r * Math.sin(th0) + M.r * Math.sin(th1)) * Math.hypot(M.r * (Math.cos(th1) - Math.cos(th0)), M.r * (Math.sin(th1) - Math.sin(th0))); } return { ans: a, model: vnum(M.tot) }; },
      steps: (M) => [
        `구를 반으로 자른 단면은 반지름 $${M.r}$인 원이에요. 그 넓이는 $\\pi r^2=\\pi\\times${M.r}^2=${tx(M.one)}\\,\\mathrm{cm}^2$예요.`,
        `구의 껍질을 펼치면 이 원 $4$개의 넓이와 같아요. 그래서 겉넓이는 $4\\times\\pi r^2$이에요.`,
        `(구의 겉넓이) $=4\\pi r^2=4\\pi\\times${M.r}^2=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `<b>껍질 펼치기</b> 막대를 끌거나 ▶를 눌러 보세요. 구의 껍질이 ${span('sky', '반지름이 같은 원 4개')}로 가로로 늘어서요. 막대로 반지름을 바꾸면 원의 넓이와 겉넓이가 같이 바뀌어요.`,
        readouts: [rd('원 하나의 넓이 πr²', plainVal(M.one) + ' cm²', 'sky'), rd('원의 개수', '4개', 'amber'), rd('구의 겉넓이 4πr²', plainVal(M.tot) + ' cm²', 'green', `4 × ${plainVal(M.one)}`)],
        formula: `<p>(구의 겉넓이) $=4\\pi r^2$ &nbsp; ($r$ 구의 반지름)</p>`,
        rule: '구의 겉넓이 = 반지름이 같은 원 4개의 넓이 = 4πr²',
        notes: notes('지름이 주어지면 반으로 나누어 <b>반지름</b>을 써요.', '겉넓이는 $4\\pi r^2$, 부피는 $\\frac{4}{3}\\pi r^3$이에요. 헷갈리지 않아요.')
      }),
      prob: (M) => {
        const wrongs = [[V(0, 2 * M.r * M.r), '반구의 곡면 $2\\pi r^2$이에요. 구는 $4\\pi r^2$이에요.'], [V(0, 3 * M.r * M.r), '반구의 겉넓이 $3\\pi r^2$이에요.'], [V(0, M.r * M.r), '원 하나의 넓이예요. 4개분이에요.'], [V(0, (4 * M.r * M.r * M.r) / 3), '구의 부피 $\\frac{4}{3}\\pi r^3$을 구했어요.'], [V(0, 16 * M.r * M.r), '지름 $2r$을 반지름으로 착각했어요.']];
        return { tag: '구의 겉넓이', key: `${M.r}`, stem: `그림과 같이 반지름이 $${M.r}\\,\\mathrm{cm}$인 구의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv3-2 반구 / sv3-5 1/4·1/8 구 : 자른 구의 겉넓이 */
  // frac: 'half' | 'quarter' | 'eighth'
  const FR = {
    half: { name: '반구', curveK: 2, flats: [{ k: 1, name: '원' }], factor: '½', fracTex: '\\frac{1}{2}' },
    quarter: { name: '1/4 구', curveK: 1, flats: [{ k: 0.5, name: '반원' }, { k: 0.5, name: '반원' }], factor: '¼', fracTex: '\\frac{1}{4}' },
    eighth: { name: '1/8 구', curveK: 0.5, flats: [{ k: 0.25, name: '사분원' }, { k: 0.25, name: '사분원' }, { k: 0.25, name: '사분원' }], factor: '⅛', fracTex: '\\frac{1}{8}' }
  };
  function cutModel(s, frac, key) {
    const r = clamp(Math.round(s[key]), 1, 8), f = FR[frac], rr = r * r;
    const curve = V(0, f.curveK * rr), flatsV = f.flats.map((q) => V(0, q.k * rr)), flat = flatsV.reduce((a, c) => vadd(a, c), V(0)), tot = vadd(curve, flat);
    return { frac, r, f, curve, flatsV, flat, tot, sphere: V(0, 4 * rr) };
  }
  function cutScene(frac) {
    const isHalf = frac === 'half';
    const key = isHalf ? 's7R' : 's9R', tkey = isHalf ? 's7T' : 's9T';
    const model = (s) => {
      const fr = isHalf ? 'half' : (s.svFrac === 'eighth' ? 'eighth' : 'quarter');
      return cutModel(s, fr, key);
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, R = 1.6, bcx = (isHalf ? 1.25 : 0.95) * 1.6, t = C.problem ? (isHalf ? 0.8 : 1) : C.t, fr = M.frac;
      const sph0 = (a, c) => sph(R, a, c);
      let bodies = [], extra = [], ptsFit = [];
      const lvC = !C.review ? 1 : (st === 2 || st === 1) ? (st === 2 ? 2 : 1) : 1, lvF = !C.review ? 1 : st === 3 ? 2 : 1;
      let sweep = 0, sep = 0, rot = 0, merge = 0, pop = 1, flipB = 0;
      if (isHalf) { sweep = lin01(t, 0, 0.25); sep = ease(lin01(t, 0.25, 0.55)); rot = 1; merge = ease(lin01(t, 0.8, 1)); flipB = ease(lin01(t, 0.55, 0.72)); }
      else { sep = ease(lin01(t, 0, 0.5)); merge = ease(lin01(t, 0.5, 1)); }
      if (C.problem && isHalf) { sep = 0; merge = 0; pop = 1; }
      const dsep = sep * R * 2.5;
      const curveStyle = (f) => (f.tag === 'cap' || f.cut ? {} : lvC === 2 ? { fill: 'amber', alpha: 0.36 } : {});
      if (isHalf) {
        // 밑면(평평한 면)이 아래인 반구: 수평 레이저 판이 나타나(제자리에서 번짐) 구를 가르고, 윗 반구가 오른쪽으로 가로 이동해요
        const hn = 36, cutOn = t >= 0.25 || C.problem;
        const domeProf = [[0, 0], [R, 0]];
        for (let i = 1; i <= hn; i++) { const a2 = (PI / 2) * (i / hn); domeProf.push([R * Math.cos(a2), R * Math.sin(a2)]); }
        domeProf[domeProf.length - 1][0] = 0;
        const bowlProf = [[0, -R]];
        for (let i = 1; i <= hn; i++) { const a2 = (PI / 2) * (1 - i / hn); bowlProf.push([R * Math.cos(a2), -R * Math.sin(a2)]); }
        bowlProf.push([0, 0]);
        let dome = revolveMesh(domeProf, { N: 44, tags: ['cap'] }), bowl = revolveMesh(bowlProf, { N: 44, tags: Array(hn).fill('curve').concat('cap') });
        dome = xfMesh(dome, shiftT(D.hx(dsep)));
        // 자른 뒤 아래 반구는 제자리에서 뒤집어(회전) 밑면이 아래로 오는 반구가 돼요
        const Tb = G.rotAbout(v3(0, -R / 2, 0), v3(0, 0, 1), PI * flipB), cF = G.applyT(Tb, v3(0, 0, 0));
        bowl = xfMesh(bowl, Tb);
        const domeB = { mesh: dome, fill: 'sky', alpha: 0.26, edge: 'ink', edgeW: 2.6, faceStyle: (f) => (f.tag === 'cap' ? { skip: true } : curveStyle(f)) };
        const bowlB = { mesh: bowl, fill: 'sky', alpha: 0.26, edge: 'ink', edgeW: 2.6, faceStyle: (f) => (f.tag === 'cap' ? (!cutOn ? { skip: true } : { fill: lvF === 2 ? 'amber' : 'red', alpha: 0.46 }) : curveStyle(f)) };
        D.fit(cube8(v3(0, 0, 0), R).concat(cube8(D.hx(C.problem ? 0 : R * 2.5), R)), C.problem ? [] : [{ x: bcx - 3.2, y: D.P(v3(0, -R, R)).y + 3.0 }, { x: bcx + 3.2, y: D.P(v3(0, -R, R)).y + 3.0 }], { l: 34, r: 34, t: 36, b: 34 });
        D.bodies(C.problem ? [domeB] : [bowlB, domeB]);
        // 평평한 밑면의 자리(점선 원)
        const baseC = add3(v3(0, 0, 0), D.hx(dsep));
        if (C.problem || sep > 0.3) D.disc(baseC, v3(1, 0, 0), v3(0, 0, 1), R, 'red', 0.16, 'red', 2.2, { dash: [6, 5] });
        // 수평 레이저 판
        if (sweep > 0 && t < 0.25) {
          D.disc(v3(0, 0, 0), v3(1, 0, 0), v3(0, 0, 1), R * (0.5 + 0.85 * sweep), 'amber', 0.2 * sweep, 'amber', 2.2, { alpha: sweep });
          D.path(D.circ(v3(0, 0, 0), v3(1, 0, 0), v3(0, 0, 1), R, 0, 2 * PI, 72), 'amber', 3.6, { alpha: sweep });
        }
        if (!C.problem && t >= 0.25 && sep < 0.02) D.path(D.circ(v3(0, 0, 0), v3(1, 0, 0), v3(0, 0, 1), R, 0, 2 * PI, 72), 'red', 3, { alpha: 0.7 });
        // 라벨: 반지름은 평평한 면 위에(가로 방향)
        if (C.problem) sphereLabels(D, R, baseC, `r=${M.r}`);
        else sphereLabels(D, R, t < 0.25 ? v3(0, 0, 0) : cF, `r=${M.r}`);
        if (!C.problem && flipB > 0.3) D.disc(cF, v3(1, 0, 0), v3(0, 0, 1), R, lvF === 2 ? 'amber' : 'red', lvF === 2 ? 0.5 : 0.3, lvF === 2 ? 'amber' : 'red', 2.4, { dash: [6, 5] });
        if (!C.problem) {
          if (t < 0.25) D.tag(v3(0, 0, 0), `4πr² = ${plainVal(M.sphere)}`, { dy: 28, size: 15 });
          if (t >= 0.25) D.tag(add3(v3(0, R * 0.55, 0), D.hx(dsep)), `4πr²×½ = ${plainVal(M.curve)}`, { size: 14, dy: -10 });
          if (t >= 0.5) D.tag(cF, `πr² = ${plainVal(M.flat)}`, { size: 15, color: 'ink', dy: 20 });
        }
      } else {
        // 1/4, 1/8 구
        const wedge = fr === 'quarter' ? revolveMesh(sphereProfile(R, -90, 90, 48), { axis: 'y', N: 40, a0: -3 * PI / 4, a1: -PI / 4 }) : revolveMesh([[0, 0], ...sphereProfile(R, 0, 90, 36)], { axis: 'y', N: 40, a0: -3 * PI / 4, a1: -PI / 4, tags: ['cap'] });
        const ghost = sph(R, -90, 90);
        const dd = sep * R * 1.9;
        const wm = xfMesh(wedge, shiftT(D.hx(dd)));
        D.fit(cube8(v3(0, 0, 0), R).concat(cube8(D.hx(dd), R)), [{ x: bcx - 3.2, y: D.P(v3(0, -R, R)).y + 3.0 }, { x: bcx + 3.2, y: D.P(v3(0, -R, R)).y + 3.0 }], { l: 34, r: 34, t: 36, b: 34 });
        D.body({ mesh: ghost, fill: null, edge: 'muted', edgeW: 1.6, hiddenAlpha: 0.5, sil: true });
        D.body({ mesh: wm, fill: 'sky', alpha: 0.3, edge: 'ink', edgeW: 2.6, faceStyle: (f) => (f.cut || f.tag === 'cap' ? { fill: lvF === 2 ? 'amber' : 'red', alpha: 0.42 } : curveStyle(f)) });
        sphereLabels(D, R, add3(v3(0, 0, 0), D.hx(dd)), `r=${M.r}`);
        if (!C.problem) D.tag(add3(v3(0, 0, 0), D.hx(dd)), `${M.f.factor} 구`, { dy: -R * 38, size: 15, color: 'amber' });
      }
      if (!C.problem) {
        const flatsLabel = M.f.flats[0].name;
        const parts = [{ v: M.f.curveK, fill: 'sky', label: `곡면 ${plainVal(M.curve)}`, hl: lvC }].concat(M.f.flats.map((q, i) => ({ v: q.k, fill: 'red', label: M.f.flats.length > 1 ? `${q.name} ${plainVal(V(0, q.k * M.r * M.r))}` : `${flatsLabel} ${plainVal(M.flat)}`, hl: lvF })));
        const y0 = D.P(v3(0, -R, R)).y + 1.9;
        drawBars(D, parts, bcx, y0, 6.2, merge, { total: `겉넓이 = ${plainVal(M.tot)}` });
      }
    };
    const stemName = (M) => (M.frac === 'half' ? '반구' : M.frac === 'quarter' ? '구를 $\\frac{1}{4}$만큼 잘라 낸 입체(중심을 지나는 평면 2개로 자른 쐐기 모양)' : '구를 $\\frac{1}{8}$만큼 잘라 낸 입체(서로 수직인 세 평면으로 자른 조각)');
    return {
      id: isHalf ? 'sv3-2' : 'sv3-5', title: isHalf ? '반구의 겉넓이' : '1/4 구·1/8 구', short: isHalf ? '반구' : '1/4·1/8 구',
      question: isHalf ? '구를 반으로 자른 반구의 겉넓이는 구 겉넓이의 반일까? 잘린 평평한 면은 어떻게 될까?' : '구를 더 잘게 자른 조각의 겉넓이는? 곡면의 몇 분의 몇만 더하면 될까, 새로 생긴 평평한 면은 몇 개일까?',
      anim: { key: tkey, dur: isHalf ? 11 : 7, label: isHalf ? '자르고 합치기' : '조각 떼어 내기' }, cam0: { yaw: 28, pitch: 20 }, stepT: (st) => (isHalf ? [0, 0.02, 0.5, 0.75, 1][Math.min(st, 4)] : [0, 0.02, 0.47, 0.82, 1][Math.min(st, 4)]) , thumbT: 1, problemT: isHalf ? 0 : 0.2, view3: true,
      ctl: () => [key, tkey],
      presets: isHalf ? undefined : () => [{ group: '조각', label: '1/4 구', apply: (st) => { st.svFrac = 'quarter'; }, on: (st) => st.svFrac !== 'eighth' }, { label: '1/8 구', apply: (st) => { st.svFrac = 'eighth'; }, on: (st) => st.svFrac === 'eighth' }],
      init: (s) => { s[key] = 3; s[tkey] = 0; s.svFrac = 'quarter'; },
      reroll: (s) => { s[key] = rint(1, 8); s[tkey] = 0; if (!isHalf) s.svFrac = pick(['quarter', 'eighth'], s.svFrac); },
      model, draw,
      check: (s) => {
        const M = model(s), r = M.r, n = 3000;
        // 곡면: 구 곡면의 해당 비율(방위각 비율 × 위도 범위)을 띠 적분으로, 단면은 원판의 분수로 직접 계산
        const azFrac = M.frac === 'half' ? 0.5 : M.frac === 'quarter' ? 0.25 : 0.25, latFrac = M.frac === 'eighth' ? 0.5 : M.frac === 'quarter' ? 1 : 1;
        let curve = 0; for (let i = 0; i < n; i++) { const a0 = (PI / 2) * (i / n), a1 = (PI / 2) * ((i + 1) / n); curve += 2 * PI * (r * Math.cos(a0) + r * Math.cos(a1)) / 2 * Math.hypot(r * (Math.sin(a1) - Math.sin(a0)), r * (Math.cos(a1) - Math.cos(a0))); }
        // 위 곡면은 반구 한쪽(위쪽) = curve. 전체 구 = 2*curve
        const sphereArea = 2 * curve;
        let curved;
        if (M.frac === 'half') curved = sphereArea * 0.5; else if (M.frac === 'quarter') curved = sphereArea * azFrac; else curved = sphereArea * azFrac * latFrac;
        const disc = PI * r * r, flats = M.frac === 'half' ? disc : M.frac === 'quarter' ? 2 * (disc / 2) : 3 * (disc / 4);
        return { ans: curved + flats, model: vnum(M.tot) };
      },
      steps: (M) => {
        const f = M.f, r = M.r;
        const s1 = `구의 겉넓이는 $4\\pi r^2=4\\pi\\times${r}^2=${tx(M.sphere)}\\,\\mathrm{cm}^2$예요.`;
        const s2 = `곡면은 구의 ${f.fracTex}이므로 $4\\pi r^2\\times${f.fracTex}=${tx(M.curve)}\\,\\mathrm{cm}^2$예요.`;
        const s3 = M.frac === 'half' ? `자른 면은 반지름 $${r}$인 원이에요. $\\pi r^2=${tx(M.flat)}$을 <b>더해야</b> 해요(빠뜨리기 쉬워요).` : M.frac === 'quarter' ? `자른 면은 반원 $2$개예요. $\\frac{1}{2}\\pi r^2\\times2=${tx(M.flat)}$을 더해요.` : `자른 면은 사분원 $3$개예요. $\\frac{1}{4}\\pi r^2\\times3=${tx(M.flat)}$을 더해요.`;
        const s4 = `(겉넓이) $=${tx(M.curve)}+${tx(M.flat)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`;
        return [s1, s2, s3, s4];
      },
      view: (M) => ({
        guide: isHalf
          ? `<b>자르고 합치기</b> 막대를 끌거나 ▶를 눌러 보세요. 노란 ${span('amber', '레이저 판')}이 구의 가운데에 나타나 구를 둘로 가르고, 위쪽 반구(밑면이 아래)가 오른쪽으로 옮겨 가요. 아래쪽 반구에 ${span('red', '자른 면(원)')}이 드러나고, 아래 막대로 합쳐져요.`
          : `위 칩에서 <b>1/4 구</b>와 <b>1/8 구</b>를 골라 보세요. <b>조각 떼어 내기</b>를 끌면 조각이 가로로 빠져나가요. 곡면(${span('sky', '파랑')})에 새로 생긴 ${span('red', '자른 면(빨강)')}을 더해요.`,
        readouts: [rd('구의 겉넓이', plainVal(M.sphere) + ' cm²', 'ink', '4πr²'), rd(`곡면 (${M.f.factor})`, plainVal(M.curve) + ' cm²', 'sky'), rd('자른 면', plainVal(M.flat) + ' cm²', 'red', M.f.flats.length > 1 ? `${M.f.flats[0].name} ${M.f.flats.length}개` : '원 1개'), rd(`${M.f.name}의 겉넓이`, plainVal(M.tot) + ' cm²', 'green')],
        formula: `<p>(${M.f.name}의 겉넓이) $=4\\pi r^2\\times${M.f.fracTex}+$ (자른 면의 넓이)</p>`,
        rule: '자른 입체의 겉넓이 = 곡면 + 새로 생긴 자른 면',
        notes: notes('<b>함정</b>: 곡면만 구하고 <b>자른 면</b>을 빠뜨리지 않아요.', '반구의 자른 면은 <b>원 전체 $\\pi r^2$</b>이고, 1/4 구는 반원 2개, 1/8 구는 사분원 3개예요.')
      }),
      prob: (M) => {
        const r2 = M.r * M.r;
        let wrongs;
        if (M.frac === 'half') wrongs = [[M.curve, '곡면만 구했어요. 자른 면(원)을 더해야 해요.'], [M.sphere, '구 전체의 겉넓이예요.'], [vadd(M.curve, V(0, r2 / 2)), '자른 면은 반원이 아니라 원 전체예요.'], [vadd(M.curve, vmul(V(0, 2 * r2), 1)), '자른 면은 곡면이 아니라 원 $\\pi r^2$이에요.'], [V(0, r2 / 2), '반원의 넓이만 구했어요.']];
        else if (M.frac === 'quarter') wrongs = [[M.curve, '곡면만 구했어요. 반원 2개를 더해야 해요.'], [vadd(M.curve, V(0, r2 / 2)), '자른 면은 반원이 2개예요.'], [vadd(M.curve, V(0, 2 * r2)), '자른 면은 원이 아니라 반원 2개예요.'], [M.sphere, '구 전체의 겉넓이예요.'], [vadd(M.curve, V(0, r2 / 4)), '반원은 $\\frac{1}{2}\\pi r^2$이에요.']];
        else wrongs = [[M.curve, '곡면만 구했어요. 사분원 3개를 더해야 해요.'], [vadd(M.curve, V(0, r2 / 4)), '자른 면은 사분원이 3개예요.'], [vadd(M.curve, V(0, r2 / 2)), '사분원은 $\\frac{1}{4}\\pi r^2$이에요.'], [vadd(M.curve, V(0, (3 * r2) / 2)), '사분원은 반원이 아니에요.'], [M.sphere, '구 전체의 겉넓이예요.']];
        return { tag: M.frac === 'half' ? '반구의 겉넓이 (함정: 자른 면)' : `${M.f.name}의 겉넓이 (함정: 자른 면)`, key: `${M.frac}|${M.r}`, stem: `그림과 같이 반지름이 $${M.r}\\,\\mathrm{cm}$인 ${stemName(M)}의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv3-3 / sv3-4 수조 (넘친 물·남은 물) */
  const BODY = { cone: '원뿔', sph: '구', cyl: '원기둥' };
  function tankModel(s, mode) {
    const r = clamp(Math.round(s.s8R), 2, 6), k = clamp(Math.round(s.s8K), 0, 4), h = 2 * r + k, body = ['cone', 'sph', 'cyl'].includes(s.svBody) ? s.svBody : 'sph';
    const tank = V(0, r * r * h), vols = { cone: V(0, (r * r * h) / 3), sph: V(0, (4 * r * r * r) / 3), cyl: tank };
    const over = vols[body], remain = vsub(tank, over);
    const unit = V(0, (r * r * h) / 3), unitsOf = (v) => vnum(v) / vnum(unit);
    return { r, k, h, body, mode, tank, vols, over, remain, unit, unitsOf, ans: mode === 'remain' ? remain : over, even: k === 0 };
  }
  function tankScene(fixedMode) {
    const model = (s) => tankModel(s, fixedMode || (s.svTankMode === 'over' ? 'over' : 'remain'));
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, t = C.problem ? 0.3 : C.t, hT = M.h / M.r, sink = lin01(t, 0.3, 0.5), q = ease(lin01(t, 0.5, 1)), mv = ease(lin01(t, 0, 0.3));
      const sx = -2.3, bx = lerp3(v3(sx, 0, 0), v3(0, 0, 0), mv).x, yRail = hT + 1.5;
      const tankM = revolveMesh([[0, 0], [1, 0], [1, hT], [0, hT]], { N: 40, tags: ['bot', 'side', 'top'] });
      const bkM = revolveMesh([[0, 0], [1, 0], [1, hT], [0, hT]], { O: v3(3.1, 0, 0), N: 40, tags: ['bot', 'side', 'top'] });
      const fracOver = vnum(M.over) / vnum(M.tank), wl = q * fracOver * hT;
      D.fit([v3(sx - 1, 0, -1), v3(4.6, yRail + 1, 1), v3(sx - 1, yRail + 1, 1), v3(4.6, 0, -1)], [{ x: 0, y: D.P(v3(0, 0, 1)).y + (C.problem ? 0.6 : 4.0) }], { l: 34, r: 34, t: 34, b: 34 });
      // 수조·물
      D.body({ mesh: tankM, fill: 'sky', alpha: 0.1, edge: 'ink', edgeW: 2.6 });
      D.body({ mesh: revolveMesh([[0, 0], [0.985, 0], [0.985, hT], [0, hT]], { N: 40 }), fill: 'sky', alpha: M.mode === 'remain' && st >= 3 && C.review ? 0.5 : 0.3, hidden: false, edge: 'sky', edgeW: 1.4 });
      // 수조 오른쪽 주둥이(가로 관)와 비커
      const py = hT - 0.12;
      D.line(v3(1, py + 0.06, 0), v3(2.1, py + 0.06, 0), 'ink', 2.4);
      D.line(v3(1, py - 0.06, 0), v3(2.1, py - 0.06, 0), 'ink', 2.4);
      D.body({ mesh: bkM, fill: 'sky', alpha: 0.08, edge: 'ink', edgeW: 2.4 });
      if (wl > 0.01) D.body({ mesh: revolveMesh([[0, 0], [0.985, 0], [0.985, wl], [0, wl]], { O: v3(3.1, 0, 0), N: 40 }), fill: 'sky', alpha: 0.5, hidden: false, edge: 'sky', edgeW: 1.4 });
      if (q > 0.02 && q < 0.999) { D.line(v3(1, py, 0), v3(2.1, py, 0), 'sky', 4.5, { dash: [7, 6] }); }
      // 비커 눈금(1칸 = 원뿔 부피)
      [1, 2, 3].forEach((i) => { const yy = (hT * i) / 3; D.line(v3(3.1 + 1, yy, 0), v3(3.1 + 0.82, yy, 0), 'ink', 2.2); D.tag(v3(4.2, yy, 0), `${i}칸`, { size: 13, align: 'left', dx: 2 }); });
      // 물체
      const bodyMesh = (cx, cy) => (M.body === 'sph' ? revolveMesh(sphereProfile(1, -90, 90, 24), { O: v3(cx, cy + 1, 0), N: 36, round: true }) : M.body === 'cone' ? revolveMesh([[0, 0], [1, 0], [0, hT]], { O: v3(cx, cy, 0), N: 36 }) : revolveMesh([[0, 0], [0.97, 0], [0.97, hT], [0, hT]], { O: v3(cx, cy, 0), N: 36 }));
      const colr = M.body === 'sph' ? 'green' : M.body === 'cone' ? 'amber' : 'violet';
      const bodyTop = M.body === 'cyl' ? hT + 0.2 : M.body === 'cone' ? hT + 0.25 : hT + 0.25;
      const topAlpha = 1 - ease(sink);
      if (sink < 0.02 || C.problem) D.line(v3(sx - 0.4, yRail - 0.0, 0), v3(0.5, yRail - 0.0, 0), 'muted', 2, { dash: [6, 5] });
      if (topAlpha > 0.02) {
        const cy = yRail - (M.body === 'sph' ? 1 : M.body === 'cone' ? 0.5 * hT : 0.5 * hT);
        D.body({ mesh: bodyMesh(bx, M.body === 'sph' ? yRail - 1 : yRail - hT / 2), fill: colr, alpha: 0.36 * topAlpha, edge: 'ink', edgeW: 2.4 * topAlpha + 0.2, edgeFn: () => ({ alpha: topAlpha }) });
        void cy; void bodyTop;
      }
      const inAlpha = ease(sink);
      if (inAlpha > 0.02) D.body({ mesh: bodyMesh(0, 0), fill: colr, alpha: 0.42 * inAlpha, edge: 'ink', edgeW: 2.2, hidden: true, edgeFn: () => ({ alpha: inAlpha }) });
      // 길이: r, h
      D.line(v3(0, hT, 0), v3(1, hT, 0), 'amber', 2.4);
      D.dot(v3(0, hT, 0), 'ink', 3.5);
      D.tag(v3(0.5, hT, 0), `r=${M.r}`, { dy: -11, size: 14, color: 'amber' });
      D.elabel(v3(-1, 0, 0), v3(-1, hT, 0), M.k === 0 ? `2r=${M.h}` : `h=${M.h}`, { side: { x: -1, y: 0 }, size: 15, color: 'amber', gap: 8 });
      if (!C.problem) {
        const formula = { cone: `원뿔 ⅓πr²h = ${plainVal(M.vols.cone)}`, sph: `구 4/3πr³ = ${plainVal(M.vols.sph)}`, cyl: `원기둥 πr²h = ${plainVal(M.vols.cyl)}` }[M.body];
        if (sink < 0.02) D.tag(v3(0, yRail, 0), formula, { dy: -58, size: 14, color: colr });
        // 가로 막대: 원뿔·구·원기둥 (1칸 = 원뿔)
        const rowsV = ['cone', 'sph', 'cyl'].map((k2) => ({ k: k2, units: M.mode === 'remain' ? 3 - M.unitsOf(M.vols[k2]) : M.unitsOf(M.vols[k2]), val: M.mode === 'remain' ? vsub(M.tank, M.vols[k2]) : M.vols[k2] }));
        const y0 = D.P(v3(0, 0, 1)).y + 0.7, W = 5.4, x0 = -W / 2 - 0.2, H = 0.42;
        rowsV.forEach((rw, i) => {
          const y = y0 + i * (H + 0.2), cur = rw.k === M.body, w = (rw.units / 3) * W, wc = cur ? (M.mode === 'remain' ? w * 1 : w * q) : 0;
          b.path([{ x: x0, y }, { x: x0 + W, y }, { x: x0 + W, y: y + H }, { x: x0, y: y + H }], { close: true, color: 'muted', width: 1.2, alpha: 0.5 });
          b.path([{ x: x0, y }, { x: x0 + (cur ? Math.max(wc, 0) : w * 0.0), y }, { x: x0 + (cur ? Math.max(wc, 0) : 0), y: y + H }, { x: x0, y: y + H }], { close: true, fill: colorOf(rw.k), fillAlpha: 0.7, color: null });
          if (!cur) b.path([{ x: x0, y }, { x: x0 + w, y }, { x: x0 + w, y: y + H }, { x: x0, y: y + H }], { close: true, fill: colorOf(rw.k), fillAlpha: 0.2, color: colorOf(rw.k), width: 1.6, alpha: 0.7 });
          b.text({ x: x0, y: y + H / 2 }, `${BODY[rw.k]}`, { dx: -6, size: D.fs(13), weight: 800, align: 'right', baseline: 'middle' });
          b.text({ x: x0 + Math.max(w, 0), y: y + H / 2 }, `${plainVal(rw.val)}`, { dx: 6, size: D.fs(13), weight: 800, align: 'left', baseline: 'middle', color: cur ? 'ink' : 'muted' });
        });
        b.text({ x: x0 + W / 2, y: y0 }, M.mode === 'remain' ? '남은 물 (칸 수: 전체 3칸 − 넣은 것)' : '넘친 물의 부피 (1칸 = 원뿔 한 개)', { dy: -11, size: D.fs(13), weight: 750, color: 'muted', baseline: 'middle' });
        if (q > 0.99 && M.even) b.text({ x: 0, y: y0 + 3 * (H + 0.2) + 0.1 }, M.mode === 'remain' ? '남은 물:  원뿔 2 : 구 1 : 원기둥 0' : '넘친 물:  원뿔 1 : 구 2 : 원기둥 3', { size: D.fs(15), weight: 800, color: 'amber', baseline: 'middle' });
        else if (q > 0.99 && !M.even) b.text({ x: 0, y: y0 + 3 * (H + 0.2) + 0.1 }, '높이가 2r이 아니면 1:2:3이 깨져요', { size: D.fs(14), weight: 800, color: 'red', baseline: 'middle' });
      }
      function colorOf(k2) { return k2 === 'sph' ? 'green' : k2 === 'cone' ? 'amber' : 'violet'; }
    };
    const id = fixedMode === 'over' ? 'sv3-3' : 'sv3-4';
    return {
      id, title: fixedMode === 'over' ? '원뿔·구·원기둥 부피 1:2:3' : '수조 문제: 넘친 물·남은 물', short: fixedMode === 'over' ? '부피비 1:2:3' : '수조 문제',
      question: fixedMode === 'over' ? '물이 가득 찬 수조에 지름이 같은 원뿔·구·원기둥을 넣으면 넘치는 물의 양은 어떤 비가 될까?' : '물체를 넣고 물이 넘친 뒤 수조에 남은 물은 얼마일까? 구를 넣었을 때 남은 물과 같은 부피의 물체는 무엇일까?',
      anim: { key: 's8T', dur: 9, label: '물체 넣기' }, cam0: { yaw: 24, pitch: 18 }, stepT: (n) => [0, 0.2, 0.52, 1, 1][Math.min(n, 4)], thumbT: 1, problemT: 0.3,
      ctl: () => ['s8R', 's8K', 's8T'],
      presets: () => [{ group: '넣는 물체', label: '원뿔', color: 'amber', apply: (st) => { st.svBody = 'cone'; st.s8T = 0; }, on: (st) => st.svBody === 'cone' }, { label: '구', color: 'green', apply: (st) => { st.svBody = 'sph'; st.s8T = 0; }, on: (st) => st.svBody === 'sph' || !st.svBody }, { label: '원기둥', color: 'violet', apply: (st) => { st.svBody = 'cyl'; st.s8T = 0; }, on: (st) => st.svBody === 'cyl' }].concat(fixedMode === 'over' ? [] : [{ group: '구하는 것', label: '넘친 물', apply: (st) => { st.svTankMode = 'over'; }, on: (st) => st.svTankMode === 'over' }, { label: '남은 물', apply: (st) => { st.svTankMode = 'remain'; }, on: (st) => st.svTankMode !== 'over' }]),
      init: (s) => { s.svBody = 'sph'; s.s8R = 3; s.s8K = 0; s.s8T = 0; s.svTankMode = fixedMode === 'over' ? 'over' : 'remain'; },
      reroll: (s) => { s.svBody = pick(fixedMode === 'over' ? ['cone', 'sph', 'cyl'] : ['cone', 'sph'], s.svBody); s.s8R = rint(2, 6); s.s8K = pick([0, 0, 0, 1, 2, 3, 4], -1); s.s8T = 0; if (fixedMode !== 'over') s.svTankMode = pick(['over', 'remain'], s.svTankMode); },
      model, draw,
      check: (s) => {
        const M = model(s), n = 4000; let over = 0;
        if (M.body === 'sph') for (let i = 0; i < n; i++) { const y = -M.r + ((i + 0.5) / n) * 2 * M.r; over += PI * (M.r * M.r - y * y) * ((2 * M.r) / n); }
        else if (M.body === 'cone') for (let i = 0; i < n; i++) { const y = ((i + 0.5) / n) * M.h, rr = (M.r * (M.h - y)) / M.h; over += PI * rr * rr * (M.h / n); }
        else for (let i = 0; i < n; i++) over += PI * M.r * M.r * (M.h / n);
        const tank = PI * M.r * M.r * M.h;
        return { ans: M.mode === 'remain' ? tank - over : over, model: vnum(M.ans) };
      },
      steps: (M) => {
        const bn = BODY[M.body], tkV = tx(M.tank);
        const v = tx(M.vols[M.body]);
        const f = { cone: `\\frac{1}{3}\\pi r^2h=\\frac{1}{3}\\pi\\times${M.r}^2\\times${M.h}`, sph: `\\frac{4}{3}\\pi r^3=\\frac{4}{3}\\pi\\times${M.r}^3`, cyl: `\\pi r^2h=\\pi\\times${M.r}^2\\times${M.h}` }[M.body];
        const s1 = `수조는 반지름 $${M.r}$, 높이 $${M.h}$인 원기둥이므로 부피 $\\pi r^2h=${tkV}$예요. ${bn}의 부피는 $${f}=${v}$예요.`;
        const s2 = M.even ? `높이가 $2r$이면 원뿔 $\\frac{2}{3}\\pi r^3$, 구 $\\frac{4}{3}\\pi r^3$, 원기둥 $2\\pi r^3$이에요. $\\frac{2}{3}:\\frac{4}{3}:2=1:2:3$이에요.` : `높이가 $2r$이 아니라 $${M.h}$이므로 원뿔 $\\frac{1}{3}\\pi r^2h$, 구 $\\frac{4}{3}\\pi r^3$, 원기둥 $\\pi r^2h$의 비가 $1:2:3$이 <b>아니에요</b>. 부피를 하나씩 계산해야 해요.`;
        const s3 = `넘친 물의 부피 = 물체의 부피 $=${v}\\,\\mathrm{cm}^3$예요.`;
        const s4 = M.mode === 'remain' ? `남은 물의 부피 $=$ (수조의 부피) $-$ (물체의 부피) $=${tkV}-${v}=${tx(M.remain)}\\,\\mathrm{cm}^3$예요.${M.body === 'sph' && M.even ? ' (구를 넣고 남은 물은 원뿔의 부피와 같아요.)' : ''}` : `따라서 넘친 물은 $${tx(M.over)}\\,\\mathrm{cm}^3$예요.`;
        return [s1, s2, s3, s4];
      },
      view: (M) => ({
        guide: `위 칩에서 <b>넣는 물체</b>를 고르고 <b>물체 넣기</b> 막대를 끌거나 ▶를 눌러 보세요. 물체가 ${span('sky', '가로 레일')}을 따라 수조 위로 이동한 뒤 물속으로 <b>잠기면</b>(서서히 사라져요) 물이 가로 관을 지나 비커로 넘쳐 채워져요. 아래 막대는 부피를 가로로 보여 줘요.${M.mode === 'remain' ? ' 지금은 <b>남은 물</b>(수조 − 물체)을 구해요.' : ''}`,
        readouts: [rd('수조의 부피 πr²h', plainVal(M.tank) + ' cm³', 'sky', '3칸'), rd(`${BODY[M.body]}의 부피`, plainVal(M.vols[M.body]) + ' cm³', 'amber', `${fmtN(M.unitsOf(M.vols[M.body]))}칸`), rd('넘친 물', plainVal(M.over) + ' cm³', 'green', '물체의 부피와 같음'), rd('남은 물', plainVal(M.remain) + ' cm³', 'violet', `3칸 − ${fmtN(M.unitsOf(M.vols[M.body]))}칸`)],
        formula: `<p>원뿔 $\\frac{1}{3}\\pi r^2h$ : 구 $\\frac{4}{3}\\pi r^3$ : 원기둥 $\\pi r^2h$ &nbsp;$(h=2r)$ &nbsp;$=\\ 1:2:3$</p>`,
        rule: '넘친 물 = 넣은 물체의 부피 · 남은 물 = 수조의 부피 − 물체의 부피',
        alert: M.even ? undefined : { tone: 'warn', text: `수조의 높이가 $2r$이 아니라 $${M.h}$예요. 원뿔과 원기둥의 부피는 높이에 따라 달라져서 <b>1:2:3이 깨져요</b>.` },
        notes: notes('1:2:3은 <b>(반지름이 같고) 원뿔·원기둥의 높이가 $2r$(= 구의 지름)</b>일 때만 성립해요.', '넘친 물은 물체의 부피이고, <b>남은 물</b>은 수조에서 그 부피를 뺀 거예요.')
      }),
      prob: (M) => {
        const r = M.r, h = M.h, cyl = M.tank, cone = M.vols.cone, sphv = M.vols.sph;
        const H = `수조(반지름 $${r}\\,\\mathrm{cm}$, 높이 $${h}\\,\\mathrm{cm}$)`;
        let wrongs;
        if (M.mode === 'remain') {
          const others = [['cone', cone], ['sph', sphv]].filter((x) => x[0] !== M.body);
          wrongs = [[M.over, '물체의 부피예요(넘친 물). 남은 물은 수조에서 그것을 빼요.'], [cyl, '수조 전체의 부피예요. 물체의 부피를 빼야 해요.'], [vsub(cyl, others[0][1]), '다른 물체의 부피를 뺐어요.'], [vadd(cyl, M.over), '물체의 부피는 더하지 않고 빼요.'], [V(0, 4 * r * r), '구의 겉넓이예요.']];
        } else {
          wrongs = [[vsub(cyl, M.over), '남은 물을 구했어요. 넘친 물은 물체의 부피예요.'], [cyl, '수조 전체의 부피예요.'], [M.body === 'sph' ? cone : sphv, '다른 물체의 부피예요.'], [M.body === 'sph' ? V(0, 4 * r * r) : V(0, 2 * r * h), '겉넓이를 구했어요.'], [vmul(M.over, 2), '두 배로 계산했어요.']];
        }
        const act = { cone: `밑면의 반지름이 $${r}\\,\\mathrm{cm}$, 높이가 $${h}\\,\\mathrm{cm}$인 원뿔을 꼭짓점이 위로 가게 꼭 맞게 넣었다.`, sph: `반지름이 $${r}\\,\\mathrm{cm}$인 구를 완전히 잠기게 넣었다.`, cyl: `수조에 꼭 맞는 원기둥을 넣었다.` }[M.body];
        return { tag: M.mode === 'remain' ? '수조에 남은 물 (킬러)' : '넘친 물의 부피', key: `${M.mode}|${M.body}|${r}|${h}`, stem: `물이 가득 찬 ${H}에 ${act} 이때 ${M.mode === 'remain' ? '수조에 남아 있는 물의 부피는?' : '넘친 물의 부피는?'}`, choices: mkV(M.ans, wrongs, { dim: 3 }) };
      }
    };
  }

  /* ================================================================ sv3-6 구 종합 */
  function sv36() {
    const model = (s) => {
      const r = clamp(Math.round(s.sAR), 1, 8), shape = s.svShape6 === 'half' ? 'half' : 'full', ask = ['S', 'V', 'rev'].includes(s.svAsk) ? s.svAsk : 'S';
      const S = shape === 'full' ? V(0, 4 * r * r) : V(0, 3 * r * r), Vv = shape === 'full' ? V(0, (4 * r * r * r) / 3) : V(0, (2 * r * r * r) / 3);
      const ans = ask === 'V' ? Vv : S;
      return { r, shape, ask, S, V: Vv, ans, curve: V(0, (shape === 'full' ? 4 : 2) * r * r) };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), R = 1.7, st = C.step;
      const mesh = M.shape === 'full' ? sph(R, -90, 90) : revolveMesh([[0, 0], [R, 0], ...sphereProfile(R, 0, 90, 36).slice(1)], { N: 40, tags: ['cap'] });
      const mv = M.shape === 'half' ? shiftT(v3(0, -R / 2, 0)) : shiftT(v3(0, 0, 0));
      const m2 = xfMesh(mesh, mv), c = v3(0, M.shape === 'half' ? -R / 2 : 0, 0);
      D.fit(cube8(v3(0, 0, 0), R), [], { l: 40, r: 40, t: 40, b: 50 });
      D.body({ mesh: m2, fill: 'sky', alpha: 0.26, edge: 'ink', edgeW: 2.6, faceStyle: (f) => (f.tag === 'cap' && (st === 2 || !C.review) ? { fill: 'red', alpha: 0.4 } : C.review && st === 1 && f.tag !== 'cap' ? { fill: 'amber', alpha: 0.34 } : {}) });
      // 지름 방향 선: 중심에서 곡면까지 몇 개(반지름)
      const dirs = [0.0, 0.9, -0.9];
      dirs.forEach((a) => { const th = a, p = add3(c, v3(R * Math.cos(th) * 0.0, 0, 0)); void p; });
      sphereLabels(D, R, c, `r=${M.r}`);
      if (!C.problem) {
        if (M.ask !== 'rev') D.tag(add3(c, v3(0, 0, 0)), M.ask === 'S' ? `S=${plainVal(M.S)}` : `V=${plainVal(M.V)}`, { dy: 28, size: 15, color: 'ink' });
        D.label(add3(c, v3(0, -R, 0)), M.shape === 'full' ? 'S=4πr² · V=⁴⁄₃πr³' : 'S=3πr² · V=⅔πr³', { dir: { x: 0, y: 1 }, gap: 18, size: 15, color: 'amber' });
      }
    };
    return {
      id: 'sv3-6', title: '구 종합', short: '구 종합',
      question: '구의 겉넓이와 부피를 모두 구할 수 있어야 풀리는 문제는 어떻게 풀까? 부피가 주어지면 반지름부터 구해야 할까?',
      cam0: { yaw: 28, pitch: 22 }, problemT: 1,
      ctl: () => ['sAR'],
      presets: () => [{ group: '입체', label: '구', apply: (st) => { st.svShape6 = 'full'; }, on: (st) => st.svShape6 !== 'half' }, { label: '반구', apply: (st) => { st.svShape6 = 'half'; }, on: (st) => st.svShape6 === 'half' }, { group: '문제 유형', label: '겉넓이', apply: (st) => { st.svAsk = 'S'; }, on: (st) => (st.svAsk || 'S') === 'S' }, { label: '부피', apply: (st) => { st.svAsk = 'V'; }, on: (st) => st.svAsk === 'V' }, { label: '부피 → 겉넓이', apply: (st) => { st.svAsk = 'rev'; }, on: (st) => st.svAsk === 'rev' }],
      init: (s) => { s.sAR = 3; s.svShape6 = 'full'; s.svAsk = 'S'; },
      reroll: (s) => { s.sAR = rint(1, 8); s.svShape6 = pick(['full', 'half'], s.svShape6); s.svAsk = pick(['S', 'V', 'rev'], s.svAsk); },
      model, draw,
      check: (s) => {
        const M = model(s), n = 4000; let vol = 0, curve = 0;
        for (let i = 0; i < n; i++) { const y = ((i + 0.5) / n) * M.r; vol += PI * (M.r * M.r - y * y) * (M.r / n); const a0 = (PI / 2) * (i / n), a1 = (PI / 2) * ((i + 1) / n); curve += PI * (M.r * Math.cos(a0) + M.r * Math.cos(a1)) * Math.hypot(M.r * (Math.sin(a1) - Math.sin(a0)), M.r * (Math.cos(a1) - Math.cos(a0))); }
        const half = { S: curve + PI * M.r * M.r, V: vol }, full = { S: 2 * curve, V: 2 * vol };
        const w = M.shape === 'full' ? full : half;
        return { ans: M.ask === 'V' ? w.V : w.S, model: vnum(M.ans) };
      },
      steps: (M) => {
        const r = M.r, nm = M.shape === 'full' ? '구' : '반구';
        if (M.ask === 'rev') {
          const vf = M.shape === 'full' ? `\\frac{4}{3}\\pi r^3` : `\\frac{2}{3}\\pi r^3`;
          return [`부피 $${vf}=${tx(M.V)}$에서 $r^3=${r * r * r}$이므로 반지름 $r=${r}$예요.`, M.shape === 'full' ? `겉넓이는 $4\\pi r^2=4\\pi\\times${r}^2$이에요.` : `반구의 겉넓이는 곡면 $2\\pi r^2$에 자른 면 $\\pi r^2$을 더한 $3\\pi r^2=3\\pi\\times${r}^2$이에요.`, `(겉넓이) $=${tx(M.S)}\\,\\mathrm{cm}^2$예요.`];
        }
        const f = M.shape === 'full' ? { S: `4\\pi r^2`, V: `\\frac{4}{3}\\pi r^3` } : { S: `2\\pi r^2+\\pi r^2=3\\pi r^2`, V: `\\frac{1}{2}\\times\\frac{4}{3}\\pi r^3=\\frac{2}{3}\\pi r^3` };
        return [`${nm}의 반지름은 $r=${r}$예요.`, `${M.ask === 'S' ? '겉넓이' : '부피'}의 식은 $${f[M.ask]}$예요.${M.shape === 'half' && M.ask === 'S' ? ' (곡면 + 자른 면의 원)' : ''}`, `대입하면 $${tx(M.ans)}\\,\\mathrm{${M.ask === 'S' ? 'cm}^2' : 'cm}^3'}$예요.`];
      },
      view: (M) => ({
        guide: `<b>반지름 막대</b>와 위 칩으로 <b>구/반구</b>, <b>구하는 것</b>을 골라 보세요. 겉넓이 $4\\pi r^2$과 부피 $\\frac{4}{3}\\pi r^3$을 반지름 하나로 모두 구할 수 있어요. 부피가 주어지면 ${span('amber', '반지름부터')} 구해요.`,
        readouts: [rd('반지름 r', M.r + ' cm', 'amber'), rd(M.shape === 'full' ? '겉넓이 4πr²' : '겉넓이 3πr²', plainVal(M.S) + ' cm²', 'sky'), rd(M.shape === 'full' ? '부피 ⁴⁄₃πr³' : '부피 ⅔πr³', plainVal(M.V) + ' cm³', 'green')],
        formula: `<p>(구) $S=4\\pi r^2,\\ V=\\frac{4}{3}\\pi r^3$ &nbsp;,&nbsp; (반구) $S=3\\pi r^2,\\ V=\\frac{2}{3}\\pi r^3$</p>`,
        rule: '구는 반지름 r 하나로 겉넓이(4πr²)와 부피(4/3πr³)가 모두 정해져요',
        notes: notes('반구의 겉넓이는 $2\\pi r^2$이 아니라 자른 면 $\\pi r^2$까지 더한 <b>$3\\pi r^2$</b>이에요.', '부피 → 겉넓이 문제는 먼저 $r^3$을 구해 <b>반지름</b>을 찾고 겉넓이 식에 넣어요.')
      }),
      prob: (M) => {
        const r = M.r;
        let wrongs, stem;
        const nm = M.shape === 'full' ? '구' : '반구';
        if (M.ask === 'rev') {
          wrongs = [[V(0, (4 * r * r * r) / 3 * (M.shape === 'full' ? 1 : 0.5)), '부피 값 그대로예요. 반지름을 구해서 겉넓이 식에 넣어야 해요.'], [V(0, 2 * r * r), '곡면의 넓이만 구했어요.'], [V(0, 4 * M.r * 3), '반지름을 잘못 구했어요.'], [V(0, M.shape === 'full' ? 3 * r * r : 4 * r * r), '구와 반구의 식을 헷갈렸어요.'], [V(0, 16 * r * r), '지름을 반지름으로 착각했어요.']];
          stem = `부피가 $${tx(M.V)}\\,\\mathrm{cm}^3$인 ${nm}의 겉넓이는?`;
        } else if (M.ask === 'S') {
          wrongs = M.shape === 'full' ? [[V(0, 2 * r * r), '반구의 곡면이에요. 구는 $4\\pi r^2$이에요.'], [V(0, 3 * r * r), '반구의 겉넓이예요.'], [V(0, (4 * r * r * r) / 3), '부피 공식을 썼어요.'], [V(0, r * r), '원 하나의 넓이예요.'], [V(0, 16 * r * r), '지름을 반지름으로 썼어요.']] : [[V(0, 2 * r * r), '곡면만 구했어요. 자른 면(원)을 더해야 해요.'], [V(0, 4 * r * r), '구의 겉넓이예요.'], [V(0, 5 * r * r), '자른 면을 두 번 더했어요.'], [V(0, (2 * r * r * r) / 3), '부피를 구했어요.'], [V(0, r * r * 3 / 2), '곡면이 $\\frac{1}{2}$이 아니에요.']];
          stem = `그림과 같이 반지름이 $${r}\\,\\mathrm{cm}$인 ${nm}의 겉넓이는?`;
        } else {
          wrongs = M.shape === 'full' ? [[V(0, 4 * r * r), '겉넓이를 구했어요.'], [V(0, (2 * r * r * r) / 3), '반구의 부피예요.'], [V(0, 4 * r * r * r), '$\\frac{1}{3}$을 곱하지 않았어요.'], [V(0, (4 * r * r) / 3), '$r^3$이 아니라 $r^2$을 썼어요.'], [V(0, (4 * r * r * r * 8) / 3), '지름을 반지름으로 썼어요.']] : [[V(0, (4 * r * r * r) / 3), '구 전체의 부피예요. 반구는 그 절반이에요.'], [V(0, 3 * r * r), '겉넓이를 구했어요.'], [V(0, 2 * r * r * r), '$\\frac{1}{3}$을 빠뜨렸어요.'], [V(0, (2 * r * r) / 3), '$r^3$이 아니라 $r^2$을 썼어요.'], [V(0, (8 * r * r * r) / 3), '반구가 아니라 구의 지름 값이에요.']];
          stem = `그림과 같이 반지름이 $${r}\\,\\mathrm{cm}$인 ${nm}의 부피는?`;
        }
        return { tag: M.ask === 'rev' ? '구 종합 (킬러: 부피 → 반지름 → 겉넓이)' : M.ask === 'V' ? '구의 부피' : '구의 겉넓이', key: `${M.shape}|${M.ask}|${r}`, stem, choices: mkV(M.ans, wrongs, { dim: M.ask === 'V' ? 3 : 2 }) };
      }
    };
  }

  G.drawBars = drawBars;
  G.register(30, 't3', '③ 구', '구', PARAMS, [sv31(), cutScene('half'), tankScene('over'), tankScene(null), cutScene('quarter'), sv36()]);
})();
