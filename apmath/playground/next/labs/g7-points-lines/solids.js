/* ==========================================================================
   중1 · 기본 도형 — 탭 "① 점·선·면, 교점·교선" (solids.js, order 10)
   - b1-1  각기둥·각뿔·각뿔대의 교점과 교선: 교점 = 꼭짓점, 교선 = 모서리. n·종류를 바꾸면 개수와 식이 다시 계산됩니다.
   - b1-2  면과 면이 만나는 교선 / 선과 면이 만나는 교점: 면 Q를 가로로 밀고 기울이면 교선(교점)이 생기거나 사라집니다.
   - b1-3  두 입체 비교: 두 입체의 교점·교선 개수를 나란히 놓고 같은지 비교합니다.
   입체는 빈 곳을 끌거나 '돌려 보기' 막대로 돌려 볼 수 있습니다(시점 회전만, 위치 이동 없음).
   ========================================================================== */
(function () {
  'use strict';
  const PL = window.APL_PL;
  if (!PL) return;
  const { clamp, T } = PL;
  const DEG = Math.PI / 180;
  const NAMES = ['', '', '', '삼', '사', '오', '육', '칠', '팔'];
  const KIND = ['각기둥', '각뿔', '각뿔대'];
  const kname = (k, n) => NAMES[n] + KIND[k];
  // 꼭짓점 a(교점), 모서리 b(교선), 면 f
  const cnt = (k, n) => (k === 1 ? { a: n + 1, b: 2 * n, f: n + 1 } : { a: 2 * n, b: 3 * n, f: n + 2 });

  /* ------------------------------------------------------------------ 입체 만들기 + 투영 */
  function build(kind, n, R, H) {
    const V = [], F = [], E = [];
    const ring = (r, y) => { for (let i = 0; i < n; i++) { const a = (2 * Math.PI * i) / n + Math.PI / 6; V.push({ x: r * Math.cos(a), y, z: r * Math.sin(a) }); } };
    ring(R, -H / 2);
    if (kind === 1) V.push({ x: 0, y: H / 2, z: 0 }); else ring(kind === 2 ? R * 0.56 : R, H / 2);
    F.push(Array.from({ length: n }, (_, i) => i));
    if (kind !== 1) F.push(Array.from({ length: n }, (_, i) => n + i));
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      F.push(kind === 1 ? [i, j, n] : [i, j, n + j, n + i]);
      E.push({ u: i, v: j, g: 'bot' });
      if (kind === 1) E.push({ u: i, v: n, g: 'side' });
      else { E.push({ u: n + i, v: n + j, g: 'top' }); E.push({ u: i, v: n + i, g: 'side' }); }
    }
    return { V, F, E, n, kind };
  }
  const rot = (yaw, pit) => {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
    return (p) => { const x = p.x * cy - p.z * sy, z = p.x * sy + p.z * cy; return { x, y: p.y * cp - z * sp, d: p.y * sp + z * cp }; };
  };
  // 보이는 면/모서리 판정(볼록 다면체: 바깥 방향 법선이 시선 쪽이면 보임)
  function visibility(S, P) {
    const Q = S.V.map(P);
    const cen = Q.reduce((a, q) => ({ x: a.x + q.x / Q.length, y: a.y + q.y / Q.length, d: a.d + q.d / Q.length }), { x: 0, y: 0, d: 0 });
    const faceVis = S.F.map((f) => {
      const a = Q[f[0]], b = Q[f[1]], c = Q[f[2]];
      const u = { x: b.x - a.x, y: b.y - a.y, d: b.d - a.d }, v = { x: c.x - a.x, y: c.y - a.y, d: c.d - a.d };
      let nx = u.y * v.d - u.d * v.y, ny = u.d * v.x - u.x * v.d, nd = u.x * v.y - u.y * v.x;
      const fc = f.reduce((s, i) => ({ x: s.x + Q[i].x / f.length, y: s.y + Q[i].y / f.length, d: s.d + Q[i].d / f.length }), { x: 0, y: 0, d: 0 });
      if (nx * (fc.x - cen.x) + ny * (fc.y - cen.y) + nd * (fc.d - cen.d) < 0) nd = -nd;
      return nd > 1e-6;
    });
    const edgeVis = S.E.map((e) => S.F.some((f, fi) => faceVis[fi] && f.includes(e.u) && f.includes(e.v)));
    const vertVis = S.V.map((_, i) => S.F.some((f, fi) => faceVis[fi] && f.includes(i)));
    return { Q, faceVis, edgeVis, vertVis };
  }
  const sh = (p, off, sc) => ({ x: off.x + p.x * sc, y: off.y + p.y * sc });
  // 입체 그리기. opt: { off, sc, verts, edges(색 그룹 사용), faces }
  function drawSolid(b, S, cam, opt) {
    const P = rot(cam.yaw, cam.pit), W = visibility(S, P), off = opt.off || { x: 0, y: 0 }, sc = opt.sc || 1;
    const pt = (i) => sh(W.Q[i], off, sc);
    S.F.forEach((f, fi) => { if (W.faceVis[fi] && opt.fill !== false) b.poly(f.map(pt), { fill: 'sky', fillAlpha: 0.1, color: null }); });
    const colorOf = (e) => (opt.edgeColor ? opt.edgeColor(e) : 'sky');
    S.E.forEach((e, i) => { if (!W.edgeVis[i]) b.seg(pt(e.u), pt(e.v), { color: colorOf(e), width: 2, dash: [5, 6], alpha: 0.5 }); });
    S.E.forEach((e, i) => { if (W.edgeVis[i]) b.seg(pt(e.u), pt(e.v), { color: colorOf(e), width: opt.edgeW || 3.6 }); });
    if (opt.verts) S.V.forEach((_, i) => b.point(pt(i), { color: 'amber', r: W.vertVis[i] ? 6.5 : 5, hollow: !W.vertVis[i] }));
    return { pt, W, Q: W.Q };
  }
  const centroid = (pts) => ({ x: pts.reduce((a, p) => a + p.x, 0) / pts.length, y: pts.reduce((a, p) => a + p.y, 0) / pts.length });
  const camOf = (s) => ({ yaw: s.plYaw * DEG, pit: s.plPit * DEG });
  const orbit = (s, dx, dy) => { s.plYaw = ((s.plYaw + dx * 0.5 + 540) % 360) - 180; s.plPit = clamp(s.plPit + dy * 0.4, 5, 80); };

  /* ------------------------------------------------------------------ 공통 묶음 값 */
  const PARAMS = {
    plYaw: { value: -35, min: -180, max: 180, step: 1, color: 'violet', label: '돌려 보기', hint: '빈 곳을 끌어도 돌아갑니다(위치는 그대로, 보는 방향만 바뀜)', format: (v) => `${Math.round(v)}°` },
    p1n: { value: 5, min: 3, max: 8, step: 1, color: 'amber', label: '밑면의 변의 수 n', format: (v) => `${v}각형` },
    p2t: { value: 60, min: 18, max: 90, step: 1, color: 'amber', label: '기울기', hint: '90°이면 곧게 선 모양, 18°이면 거의 누운 모양(‘평행하게 눕히기’를 누르면 완전히 눕습니다)', format: (v) => `${Math.round(v)}°`, onInput: (s) => { s.p2par = 0; } },
    p2x: { value: 0, min: -1.2, max: 1.2, step: 0.1, color: 'sky', label: '면 Q 가로로 밀기', hint: '오른쪽(+)·왼쪽(−)으로만 밀립니다', format: (v) => (v > 0.05 ? `오른쪽 ${v.toFixed(1)}` : v < -0.05 ? `왼쪽 ${(-v).toFixed(1)}` : '가운데') },
    p3a: { value: 4, min: 3, max: 8, step: 1, color: 'amber', label: '왼쪽 입체의 n', format: (v) => `${v}각형` },
    p3b: { value: 6, min: 3, max: 8, step: 1, color: 'rose', label: '오른쪽 입체의 n', format: (v) => `${v}각형` }
  };
  const kindChips = (key, group, color) => KIND.map((nm, i) => ({ group: i === 0 ? group : '', label: nm, color, apply: (s) => { s[key] = i; }, on: (s) => s[key] === i }));

  /* ------------------------------------------------------------------ b1-1 */
  const EXPR = [
    { t: 'b − a', f: (a, b) => b - a, tex: 'b-a', sub: (a, b) => `${b} − ${a}` },
    { t: 'a + b', f: (a, b) => a + b, tex: 'a+b', sub: (a, b) => `${a} + ${b}` },
    { t: '2b − a', f: (a, b) => 2 * b - a, tex: '2b-a', sub: (a, b) => `2×${b} − ${a}` }
  ];
  const s11 = PL.scene({
    id: 'b1-1', title: '교점·교선의 개수', short: '교점·교선 개수', kind: 'cartesian', orbit,
    box: [-2.0, -3.2, 2.0, 2.8],
    question: '다면체에서 교점은 어디이고, 교선은 어디일까요?',
    init: { p1n: 5, p1k: 0, p1e: 0, plYaw: -35, plPit: 30 },
    controls: ['p1n', 'plYaw'],
    presets: (s) => kindChips('p1k', '입체', 'sky'),
    model: (s) => { const n = s.p1n, k = s.p1k, c = cnt(k, n), e = EXPR[s.p1e || 0]; return { n, k, name: kname(k, n), ...c, e, val: e.f(c.a, c.b) }; },
    guide: (M) => `<b>${M.name}</b>의 선과 선이 만나는 곳이 <b>교점</b>(노랑 점), 면과 면이 만나는 선이 <b>교선</b>(하늘 선)입니다. 위 막대에서 n과 입체의 종류를 바꾸고, 입체의 빈 곳을 끌어 돌려 보세요. 점과 선의 개수가 어떻게 달라지나요?`,
    readouts: (M) => [
      { label: '교점 a (꼭짓점)', value: `${M.a}개`, color: 'amber', note: M.k === 1 ? `밑면 ${M.n} + 꼭대기 1` : `윗면 ${M.n} + 아랫면 ${M.n}` },
      { label: '교선 b (모서리)', value: `${M.b}개`, color: 'sky', note: M.k === 1 ? `밑면 ${M.n} + 옆 ${M.n}` : `윗면 ${M.n} + 아랫면 ${M.n} + 옆 ${M.n}` },
      { label: `${M.e.t}`, value: String(M.val), color: 'green', note: `a = ${M.a}, b = ${M.b} 대입` }
    ],
    steps: (M) => [
      `교점은 모서리와 모서리가 만나는 점, 곧 꼭짓점입니다. ${M.name}의 꼭짓점을 세면 ${M.k === 1 ? `밑면 ${M.n}개 + 꼭대기 1개` : `윗면 ${M.n}개 + 아랫면 ${M.n}개`}이므로 a = ${M.a}`,
      `교선은 면과 면이 만나는 선, 곧 모서리입니다. ${M.name}의 모서리를 세면 ${M.k === 1 ? `밑면 ${M.n}개 + 옆 ${M.n}개` : `윗면 ${M.n}개 + 아랫면 ${M.n}개 + 옆 ${M.n}개`}이므로 b = ${M.b}`,
      `구한 a = ${M.a}, b = ${M.b}를 식에 대입합니다. ${M.e.t} = ${M.e.sub(M.a, M.b)} = ${M.val}`
    ],
    formula: (M) => `<p>교점의 개수 $a$ = 꼭짓점의 개수, 교선의 개수 $b$ = 모서리의 개수</p><p>${M.k === 1 ? `$a=n+1=${M.n}+1=${M.a}$, $b=2n=${M.b}$` : `$a=2n=${M.a}$, $b=3n=${M.b}$`}</p>`,
    rule: () => '교점 = 꼭짓점, 교선 = 모서리',
    notes: (M) => `<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>${M.k === 1 ? '각뿔의 꼭짓점은 밑면의 꼭짓점 n개에 <b>꼭대기 1개</b>를 더한 n+1개입니다.' : '각기둥·각뿔대는 윗면과 아랫면의 꼭짓점을 <b>모두</b> 세어야 합니다(2n개).'}</li><li>뒤쪽의 보이지 않는 꼭짓점·모서리(점선)도 빠뜨리지 않고 셉니다.</li></ul>`,
    draw: (b, s, M, C) => {
      const S = build(M.k, M.n, 1.6, 2.3), cam = camOf(s), st = C.step;
      const edgeColor = (e) => (st === 2 && e.g === 'side' ? 'violet' : 'sky');
      const r = drawSolid(b, S, cam, { verts: true, edgeColor, edgeW: st === 2 ? 4.4 : 3.6 });
      T(b, { x: 0, y: 2.5 }, M.name, { size: 19 });
      const top = M.k === 1 ? r.pt(M.n) : centroid(Array.from({ length: M.n }, (_, i) => r.pt(M.n + i)));
      const bot = centroid(Array.from({ length: M.n }, (_, i) => r.pt(i)));
      const xs = r.Q.map((q) => q.x), xL = Math.min(...xs) - 0.3, xR = Math.max(...xs) + 0.3;
      // 값을 나타내는 이름표: 그림 옆에 놓고 가는 점선으로 그 자리를 가리킵니다(입체를 가리지 않도록)
      const tag = (p, text, col, side) => {
        const x = side < 0 ? xL : xR;
        b.seg({ x, y: p.y }, p, { color: col, width: 1.6, dash: [4, 5], alpha: 0.75 });
        b.text({ x, y: p.y }, text, { dx: side * 8, color: col, size: 16, weight: 800, align: side < 0 ? 'right' : 'left', baseline: 'middle' });
      };
      if (st === 1 && !C.hide) {
        if (M.k === 1) { tag(top, '꼭대기 1개', 'amber', -1); tag(bot, `밑면 ${M.n}개`, 'amber', -1); } else { tag(top, `윗면 ${M.n}개`, 'amber', -1); tag(bot, `아랫면 ${M.n}개`, 'amber', -1); }
      }
      if (st === 2 && !C.hide) {
        const sideE = S.E.map((e, i) => ({ e, i })).filter((x) => x.e.g === 'side' && r.W.edgeVis[x.i]);
        const right = sideE.reduce((a, x) => (!a || r.pt(x.e.u).x + r.pt(x.e.v).x > r.pt(a.e.u).x + r.pt(a.e.v).x ? x : a), null);
        if (right) tag({ x: (r.pt(right.e.u).x + r.pt(right.e.v).x) / 2, y: (r.pt(right.e.u).y + r.pt(right.e.v).y) / 2 }, `옆 ${M.n}개`, 'violet', 1);
        if (M.k !== 1) tag(top, `윗면 ${M.n}개`, 'sky', -1);
        tag(bot, `${M.k === 1 ? '밑면' : '아랫면'} ${M.n}개`, 'sky', -1);
      }
      if (!C.hide) {
        T(b, { x: 0, y: -2.4 }, `교점 a = ${M.a}개`, { dx: -80, color: 'amber', size: 18 });
        T(b, { x: 0, y: -2.4 }, `교선 b = ${M.b}개`, { dx: 80, color: 'sky', size: 18 });
        if (st >= 3) T(b, { x: 0, y: -2.95 }, `${M.e.t} = ${M.e.sub(M.a, M.b)} = ${M.val}`, { color: 'green', size: 18 });
      }
    },
    quiz: (M, s, rng) => {
      const e = M.e, v = (k, n) => { const c = cnt(k, n); return e.f(c.a, c.b); };
      const others = [0, 1, 2].filter((k) => k !== M.k);
      const wrongs = [
        { v: v(others[0], M.n), hint: `${kname(others[0], M.n)}의 값이에요. 이 입체의 꼭짓점과 모서리를 다시 세어 보세요.` },
        { v: v(others[1], M.n), hint: `${kname(others[1], M.n)}의 값이에요. 입체의 종류를 확인하세요.` },
        { v: e.f(M.f, M.b), hint: '교점은 꼭짓점의 수예요. 면의 수와 헷갈리지 않았나요?' },
        { v: e.f(M.a, M.f), hint: '교선은 모서리의 수예요. 면의 수와 헷갈리지 않았나요?' },
        { v: e.f(M.b, M.a), hint: 'a와 b를 바꿔 계산했어요. 교점이 a, 교선이 b예요.' }
      ];
      return {
        tag: '교점과 교선의 개수',
        stem: `그림의 ${M.name}에서 교점의 개수를 $a$, 교선의 개수를 $b$라 할 때, $${e.tex}$의 값은?`,
        choices: PL.numChoices(M.val, wrongs, { fmt: (x) => String(x) })
      };
    },
    reroll: (s, rng) => {
      let k = s.p1k, n = s.p1n;
      for (let t = 0; t < 12 && k === s.p1k && n === s.p1n; t++) { k = PL.randInt(rng, 0, 2); n = PL.randInt(rng, 3, 8); }
      s.p1k = k; s.p1n = n; s.p1e = PL.randInt(rng, 0, EXPR.length - 1);
    }
  });

  /* ------------------------------------------------------------------ b1-2 */
  const HY = 0.9, TMAX = 3, PX = 4.6, PZ = 2.1;
  const TRUE2 = [
    { t: '면과 면이 만나서 생기는 선을 교선이라 한다.' },
    { t: '직선과 평면이 한 점에서 만나면 그 점은 교점이다.' },
    { t: '다면체에서 꼭짓점은 교점이고, 모서리는 교선이다.' },
    { t: '평행한 두 평면은 만나지 않으므로 교선이 없다.' },
    { t: '선과 선이 만나서 생기는 점은 교점이다.' },
    { t: '점이 움직인 자취는 선이고, 선이 움직인 자취는 면이다.' }
  ];
  const FALSE2 = [
    { t: '면과 면이 만나서 생기는 것은 교점이다.', hint: '면과 면이 만나서 생기는 것은 선, 곧 교선이에요.' },
    { t: '선과 선이 만나서 생기는 것은 교선이다.', hint: '선과 선이 만나서 생기는 것은 점, 곧 교점이에요.' },
    { t: '서로 다른 두 평면은 항상 만나서 교선이 생긴다.', hint: '평행한 두 평면은 만나지 않아서 교선이 없어요.' },
    { t: '직선과 평면이 만나면 항상 교선이 생긴다.', hint: '직선과 평면이 만나면 점(교점)이 생겨요.' },
    { t: '삼각기둥의 교선의 개수는 교점의 개수와 같다.', hint: '삼각기둥은 교점(꼭짓점)이 6개, 교선(모서리)이 9개예요.' },
    { t: '다면체에서 모서리는 교점이고, 꼭짓점은 교선이다.', hint: '꼭짓점이 교점, 모서리가 교선이에요. 바뀌었어요.' },
    { t: '교선은 항상 곡선이다.', hint: '다면체의 교선(모서리)은 곧은 선이에요. 곡선인 교선도 있지만 항상은 아니에요.' }
  ];
  const model2 = (s) => {
    const par = !!s.p2par, phi = par ? 0 : s.p2t, hx = s.p2x, mode = s.p2m || 0;
    const sin = Math.sin(phi * DEG), cos = Math.cos(phi * DEG);
    const xHit = par ? null : hx - HY * cos / sin;
    return { par, phi, hx, mode, xHit, has: !par };
  };
  const s12 = PL.scene({
    id: 'b1-2', title: '교선·교점이 생기는 때', short: '교선이 생기는 때', kind: 'cartesian', orbit,
    box: [-5.2, -3.9, 5.2, 4.0],
    question: '두 면이 만나면 무엇이 생기고, 언제 만나지 않을까요?',
    init: { p2t: 60, p2x: 0, p2par: 0, p2m: 0, plYaw: -30, plPit: 24 },
    controls: ['p2t', 'p2x', 'plYaw'],
    presets: () => [
      { group: '무엇이 만날까', label: '면과 면', color: 'sky', apply: (s) => { s.p2m = 0; }, on: (s) => !s.p2m },
      { label: '직선과 면', color: 'sky', apply: (s) => { s.p2m = 1; }, on: (s) => s.p2m === 1 },
      { group: '놓는 방법', label: '평행하게 눕히기', color: 'amber', apply: (s) => { s.p2par = 1; }, on: (s) => !!s.p2par },
      { label: '기울여서 만나게', color: 'amber', apply: (s) => { s.p2par = 0; }, on: (s) => !s.p2par }
    ],
    model: model2,
    guide: (M) => (M.mode === 0
      ? `평면 <b>P</b>는 바닥에 놓여 있고, 평면 <b>Q</b>를 기울이거나 가로로 밀어 보세요. Q가 P와 만나면 <b>교선</b>(초록 선)이 생기고, 두 면이 평행하게 누우면 만나지 않아 <b>교선이 없습니다</b>.`
      : `평면 <b>P</b>는 바닥에 놓여 있고, 직선 <b>m</b>을 기울이거나 가로로 밀어 보세요. m이 P를 뚫으면 <b>교점</b>(초록 점) 1개가 생기고, 평행하게 누우면 만나지 않아 <b>교점이 없습니다</b>.`),
    readouts: (M) => [
      M.mode === 0 ? { label: '교선', value: M.has ? '있음 (직선 1개)' : '없음 (평행)', color: M.has ? 'green' : 'rose' } : { label: '교점', value: M.has ? '있음 (점 1개)' : '없음 (평행)', color: M.has ? 'green' : 'rose' },
      { label: M.mode === 0 ? '면 Q의 기울기' : '직선 m의 기울기', value: M.par ? '0° (평행)' : `${Math.round(M.phi)}°`, color: 'amber' }
    ],
    steps: (M) => (M.mode === 0 ? [
      '평면 P와 평면 Q가 어디에서 만나는지 살펴봅니다.',
      M.has ? '면과 면이 만나서 생기는 선이 <b>교선</b>입니다. 두 평면이 만나는 곳에 선이 한 줄 생깁니다.' : '지금은 두 평면이 평행해서 만나지 않으므로 <b>교선이 없습니다</b>.',
      '정리: 면과 면이 만나면 <b>교선</b>(선)이 생기고, 평행하면 만나지 않습니다.'
    ] : [
      '평면 P와 직선 m이 어디에서 만나는지 살펴봅니다.',
      M.has ? '선과 면이 만나서 생기는 점이 <b>교점</b>입니다. 직선이 면을 뚫는 곳에 점이 1개 생깁니다.' : '지금은 직선 m이 평면 P와 평행해서 만나지 않으므로 <b>교점이 없습니다</b>.',
      '정리: 선과 면이 만나면 <b>교점</b>(점)이 생기고, 평행하면 만나지 않습니다.'
    ]).map((t) => t.replace(/<\/?b>/g, '')),
    rule: () => '선과 선, 선과 면이 만나면 교점(점), 면과 면이 만나면 교선(선)',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>교점은 <b>점</b>, 교선은 <b>선</b>입니다. 이름의 \'점\'과 \'선\'을 보고 구별하세요.</li><li>그림의 면은 일부만 그린 것이고, 평면은 끝없이 넓게 펼쳐진 면입니다.</li></ul>',
    draw: (b, s, M, C) => {
      const P = rot(s.plYaw * DEG, s.plPit * DEG), pr = (p) => { const q = P(p); return { x: q.x, y: q.y }; }, st = C.step;
      const Pq = [[-PX, -PZ], [PX, -PZ], [PX, PZ], [-PX, PZ]].map(([x, z]) => pr({ x, y: 0, z }));
      b.poly(Pq, { fill: 'sky', fillAlpha: st === 1 || st >= 99 ? 0.14 : 0.1, color: 'sky', width: 2.6 });
      const phi = M.phi * DEG, u = { x: Math.cos(phi), y: Math.sin(phi), z: 0 }, Cq = { x: M.hx, y: HY, z: 0 };
      const dqPt = (t, w) => pr({ x: Cq.x + u.x * t, y: Cq.y + u.y * t, z: w });
      if (M.mode === 0) {
        const Qq = [[-TMAX, -2], [TMAX, -2], [TMAX, 2], [-TMAX, 2]].map(([t, w]) => dqPt(t, w));
        b.poly(Qq, { fill: 'rose', fillAlpha: 0.14, color: 'rose', width: 2.6 });
        const qTop = Qq.reduce((a, q) => (q.y > a.y ? q : a), Qq[0]);
        T(b, qTop, '평면 Q', { dx: 0, dy: -20, color: 'rose', size: 18 });
        const pLow = Pq.reduce((a, q) => (q.y < a.y ? q : a), Pq[0]);
        T(b, pLow, '평면 P', { dx: 0, dy: 20, color: 'sky', size: 18 });
        if (!M.has) b.seg(pr({ x: M.hx, y: 0, z: 0 }), pr({ x: M.hx, y: HY, z: 0 }), { color: 'muted', width: 2, dash: [4, 5] });
        if (M.has) {
          const a = pr({ x: M.xHit, y: 0, z: -2 }), c = pr({ x: M.xHit, y: 0, z: 2 });
          b.seg(a, c, { color: 'green', width: st === 2 ? 8 : 6, glow: true });
          const front = a.y < c.y ? a : c;
          T(b, front, '교선', { dx: 0, dy: 22, color: 'green', size: 18 });
        }
      } else {
        const a = dqPt(-TMAX - 0.4, 0), c = dqPt(TMAX + 0.4, 0);
        b.seg(a, c, { color: 'rose', width: 4.4 });
        if (!M.has) b.seg(pr({ x: M.hx, y: 0, z: 0 }), pr({ x: M.hx, y: HY, z: 0 }), { color: 'muted', width: 2, dash: [4, 5] });
        const mEnd = a.y > c.y ? a : c;
        T(b, mEnd, '직선 m', { dx: 0, dy: -20, color: 'rose', size: 18 });
        const pLow = Pq.reduce((a2, q) => (q.y < a2.y ? q : a2), Pq[0]);
        T(b, pLow, '평면 P', { dx: 0, dy: 20, color: 'sky', size: 18 });
        if (M.has) {
          const q = pr({ x: M.xHit, y: 0, z: 0 });
          b.point(q, { color: 'green', r: st === 2 ? 9 : 7.5 });
          T(b, q, '교점', { dy: 24, color: 'green', size: 18 });
        }
      }
      const y0 = -3.55;
      if (!C.hide) {
        const msg = M.mode === 0 ? (M.has ? '면과 면이 만나서 생긴 선 = 교선' : '평행해서 만나지 않아요 → 교선 없음') : (M.has ? '선과 면이 만나서 생긴 점 = 교점' : '평행해서 만나지 않아요 → 교점 없음');
        T(b, { x: 0, y: y0 }, msg, { color: M.has ? 'green' : 'rose', size: 17 });
      }
    },
    quiz: (M, s, rng) => ({ ...PL.truthQuiz(rng, TRUE2, FALSE2, '다음 중 옳은 것은?', '교점과 교선'), note: '그림을 돌려 보며 생각해도 좋아요.' }),
    reroll: (s, rng) => { s.p2t = PL.randInt(rng, 25, 90); s.p2x = PL.randInt(rng, -6, 6) / 5; s.p2par = rng() < 0.25 ? 1 : 0; s.p2m = rng() < 0.5 ? 0 : 1; }
  });

  /* ------------------------------------------------------------------ b1-3 */
  const s13 = PL.scene({
    id: 'b1-3', title: '두 입체 비교', short: '두 입체 비교', kind: 'cartesian', orbit,
    box: (b) => (b.W < 640 ? [-3.4, -3.8, 5.0, 3.8] : [-6.6, -3.2, 6.6, 3.0]),
    question: '교점의 수가 같은 입체는 무엇이고, 교선의 수가 같은 입체는 무엇일까요?',
    init: { p3a: 4, p3b: 6, p3ka: 0, p3kb: 1, plYaw: -35, plPit: 30 },
    controls: ['p3a', 'p3b', 'plYaw'],
    presets: () => [...kindChips('p3ka', '왼쪽 입체', 'amber'), ...kindChips('p3kb', '오른쪽 입체', 'rose')],
    model: (s) => { const A = cnt(s.p3ka, s.p3a), B = cnt(s.p3kb, s.p3b); return { ka: s.p3ka, na: s.p3a, kb: s.p3kb, nb: s.p3b, A, B, an: kname(s.p3ka, s.p3a), bn: kname(s.p3kb, s.p3b), sameA: A.a === B.a, sameB: A.b === B.b }; },
    guide: (M) => `왼쪽 <b>${M.an}</b>과 오른쪽 <b>${M.bn}</b>의 교점(꼭짓점)과 교선(모서리) 개수를 비교해 보세요. 막대와 칩으로 두 입체를 바꾸면 개수가 다시 계산됩니다. 교점 수가 같은 입체를 찾아보세요.`,
    readouts: (M) => [
      { label: `${M.an}`, value: `교점 ${M.A.a} · 교선 ${M.A.b}`, color: 'amber' },
      { label: `${M.bn}`, value: `교점 ${M.B.a} · 교선 ${M.B.b}`, color: 'rose' },
      { label: '교점 수', value: M.sameA ? '같다' : '다르다', color: M.sameA ? 'green' : 'muted' },
      { label: '교선 수', value: M.sameB ? '같다' : '다르다', color: M.sameB ? 'green' : 'muted' }
    ],
    steps: (M) => [
      `왼쪽 ${M.an}: 꼭짓점 ${M.A.a}개 → 교점 ${M.A.a}개, 모서리 ${M.A.b}개 → 교선 ${M.A.b}개`,
      `오른쪽 ${M.bn}: 꼭짓점 ${M.B.a}개 → 교점 ${M.B.a}개, 모서리 ${M.B.b}개 → 교선 ${M.B.b}개`,
      `비교: 교점 ${M.A.a}개와 ${M.B.a}개는 ${M.sameA ? '같고' : '다르고'}, 교선 ${M.A.b}개와 ${M.B.b}개는 ${M.sameB ? '같습니다' : '다릅니다'}.`
    ],
    rule: () => '각기둥·각뿔대: 교점 2n, 교선 3n / 각뿔: 교점 n+1, 교선 2n',
    notes: () => '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>각기둥과 각뿔대는 같은 n이면 교점·교선의 수가 같습니다.</li><li>n이 다른 각뿔과 각기둥도 교점(또는 교선) 수가 같을 수 있습니다. 직접 세어 확인하세요.</li></ul>',
    draw: (b, s, M, C) => {
      const cam = camOf(s), st = C.step, tall = b.W < 640;
      const L = build(M.ka, M.na, 1.35, 2.0), R = build(M.kb, M.nb, 1.35, 2.0);
      // 넓은 화면: 입체 둘을 가로로 나란히 / 좁은 화면: 위아래로 놓고 값은 오른쪽에
      const oa = C.hide ? (tall ? { x: -1.2, y: 0 } : { x: 0, y: 0.1 }) : tall ? { x: -1.6, y: 1.95 } : { x: -3.3, y: 0.1 };
      const ob = tall ? { x: -1.6, y: -1.95 } : { x: 3.3, y: 0.1 };
      drawSolid(b, L, cam, { off: oa, verts: true, edgeW: 3.2, edgeColor: () => 'amber' });
      const label = (o, nm, A, col, show) => {
        if (tall) {
          const x = o.x + 2.0;
          T(b, { x, y: o.y + 0.75 }, nm, { color: col, size: 18, align: 'left' });
          if (show) { T(b, { x, y: o.y }, `교점 ${A.a}개`, { color: col, size: 17, align: 'left' }); T(b, { x, y: o.y - 0.55 }, `교선 ${A.b}개`, { color: col, size: 17, align: 'left' }); }
        } else {
          T(b, { x: o.x, y: o.y + 2.25 }, nm, { color: col, size: 18 });
          if (show) { T(b, { x: o.x, y: o.y - 2.3 }, `교점 ${A.a}개`, { color: col, size: 17 }); T(b, { x: o.x, y: o.y - 2.85 }, `교선 ${A.b}개`, { color: col, size: 17 }); }
        }
      };
      if (!C.hide) {
        drawSolid(b, R, cam, { off: ob, verts: true, edgeW: 3.2, edgeColor: () => 'rose' });
        label(oa, M.an, M.A, 'amber', st >= 1);
        label(ob, M.bn, M.B, 'rose', st >= 2);
        if (st >= 3) {
          if (tall) {
            T(b, { x: 2.6, y: 0.28 }, M.sameA ? '교점 수 같다' : '교점 수 다르다', { color: M.sameA ? 'green' : 'muted', size: 16, align: 'center' });
            T(b, { x: 2.6, y: -0.28 }, M.sameB ? '교선 수 같다' : '교선 수 다르다', { color: M.sameB ? 'green' : 'muted', size: 16, align: 'center' });
          } else {
            T(b, { x: 0, y: -2.3 }, M.sameA ? '교점 수 같다' : '교점 수 다르다', { color: M.sameA ? 'green' : 'muted', size: 17 });
            T(b, { x: 0, y: -2.85 }, M.sameB ? '교선 수 같다' : '교선 수 다르다', { color: M.sameB ? 'green' : 'muted', size: 17 });
          }
        }
      } else T(b, tall ? { x: oa.x + 2.6, y: 0 } : { x: 0, y: 2.35 }, M.an, { color: 'amber', size: 18, align: tall ? 'left' : 'center' });
    },
    quiz: (M, s, rng) => {
      // 교점 → 교선 → 교점 … 번갈아 묻되, 같은 개수의 입체가 없는 경우(삼각뿔 등)에는 다른 쪽을 묻고, 둘 다 없으면 개수를 직접 묻습니다.
      const first = (s.plSeed || 0) % 2 === 0;
      const tryMetric = (useA) => {
        const val = (k, n) => (useA ? cnt(k, n).a : cnt(k, n).b), target = val(M.ka, M.na), pool = [];
        for (let k = 0; k < 3; k++) for (let n = 3; n <= 8; n++) if (!(k === M.ka && n === M.na)) pool.push({ k, n, v: val(k, n) });
        return { useA, target, word: useA ? '교점' : '교선', same: pool.filter((x) => x.v === target), diff: pool.filter((x) => x.v !== target), val };
      };
      const A1 = tryMetric(first), A2 = tryMetric(!first), cur = A1.same.length ? A1 : A2.same.length ? A2 : null;
      if (!cur) {
        const sum = M.A.a + M.A.b;
        return { tag: '교점과 교선의 개수', stem: `그림의 ${M.an}에서 교점의 개수와 교선의 개수의 합은?`, choices: PL.numChoices(sum, [{ v: M.A.a, hint: '교점의 개수만 구했어요. 교선의 개수도 더하세요.' }, { v: M.A.b, hint: '교선의 개수만 구했어요. 교점의 개수도 더하세요.' }, { v: M.A.b - M.A.a, hint: '더해야 해요.' }, { v: sum + 1, hint: '꼭짓점과 모서리를 다시 세어 보세요.' }], { fmt: (v) => `${v}개` }) };
      }
      const right = PL.pick(rng, cur.same), wrong = PL.shuffle(rng, cur.diff).slice(0, 4);
      const mk = (x, ok) => ({ t: kname(x.k, x.n), ok, hint: ok ? '' : `${kname(x.k, x.n)}의 ${cur.word}은 ${x.v}개예요. ${M.an}은 ${cur.target}개로 달라요.` });
      return { tag: `${cur.word}의 개수가 같은 입체`, stem: `그림의 ${M.an}과 ${cur.word}의 개수가 같은 입체도형은?`, choices: PL.shuffle(rng, [mk(right, true), ...wrong.map((w) => mk(w, false))]) };
    },
    reroll: (s, rng) => { s.p3ka = PL.randInt(rng, 0, 2); s.p3a = PL.randInt(rng, 3, 8); s.p3kb = PL.randInt(rng, 0, 2); s.p3b = PL.randInt(rng, 3, 8); }
  });

  PL.solids = { build, rot, visibility, cnt, kname };
  PL.group({
    order: 10, id: 'solids', title: '점·선·면, 교점·교선', short: '교점·교선', params: PARAMS,
    scenes: [s11, s12, s13]
  });
})();
