/* ==========================================================================
   중2 · 도형의 닮음 — 탭 ② 「닮음비와 넓이·부피의 비」 (t2.js, order 20) — 장면 4개
   · s2-1 넓이의 비        · 정삼각형 타일: 길이의 비 1 : k → 넓이의 비 1 : k²
   · s2-2 부피의 비        · 쌓기나무: 길이의 비 1 : k → 겉넓이의 비 1 : k², 부피의 비 1 : k³
   · s2-3 닮은 입체의 겉넓이·부피 · 직육면체 둘의 닮음비 m : n → 겉넓이 m² : n², 부피 m³ : n³
   · s2-4 [심화] 원뿔 자르기 · 높이를 나눠 자른 조각의 부피의 비 (1 : 7 : 19)
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SM;
  if (!G) return;
  const { clamp, pt, lerp, add, sub, seeded, ri, rpick, shuffle, T, sideTag, fillPoly, line, poly, fit, P, rd, notes, mkChoices, mkTextChoices, mkRatioChoices, gcd, fmtN, bboxOf, phone, capSize, textW, frT, tagOut } = G;

  const PARAMS = {
    smT: P('닮음비 1 : k (큰 도형의 k)', 1, 6, 1, 3, { color: 'green', hint: '큰 삼각형의 한 변이 작은 삼각형의 몇 배인가요' }),
    smCk: P('닮음비 1 : k (큰 정육면체의 k)', 1, 4, 1, 3, { color: 'green', hint: '큰 정육면체의 한 모서리가 작은 것의 몇 배인가요' }),
    smSm: P('작은 입체의 크기 m', 1, 3, 1, 2, { color: 'sky' }),
    smSn: P('큰 입체의 크기 n', 2, 5, 1, 3, { color: 'green' }),
    smH1: P('위 조각의 높이', 1, 3, 1, 1, { color: 'sky', format: (v) => v + ' cm' }),
    smH2: P('가운데 조각의 높이', 1, 3, 1, 1, { color: 'amber', format: (v) => v + ' cm' }),
    smH3: P('아래 조각의 높이', 1, 3, 1, 1, { color: 'green', format: (v) => v + ' cm' })
  };
  const SQ = (v) => `${v}^{2}`, CB = (v) => `${v}^{3}`;
  const ratioTxt = (a, b) => `${a} : ${b}`;

  /* ====================================================================== 1. 넓이의 비 (정삼각형 타일) */
  const HH = Math.sqrt(3) / 2;
  const tile = {
    id: 'sm2-tile', title: '닮음비와 넓이의 비', short: '넓이의 비',
    question: '닮음비가 1 : k인 두 도형에서 넓이의 비는 얼마일까? 작은 삼각형 타일을 얼마나 붙여야 큰 삼각형이 될까?',
    ctl: ['smT'],
    init: (s) => { s.smT = 3; },
    gen: (seed) => {
      const r = seeded('d1' + seed), kind = ri(r, 0, 2), p = ri(r, 1, 4), q = p + ri(r, 1, 3), c = rpick(r, [1, 2, 3, 4, 5]);
      return { seed, kind, p, q, c };
    },
    model: (s) => { const k = clamp(Math.round(s.smT), 1, 6); return { k, area: k * k }; },
    draw(b, s, M, C) {
      if (C.problem) { drawTwoSim(b, M.pk); return; }
      const k = M.k, st = C.step, gap = 1.1, X2 = 1 + gap, h = HH;
      fit(b, { x0: -0.1, x1: X2 + k + 0.1, y0: -h * k - 0.2, y1: 0.2 }, { t: 40, b: 80, l: 30, r: 30 });
      // 작은 삼각형(변 1)
      const T1 = [pt(0, 0), pt(1, 0), pt(0.5, -h)];
      fillPoly(b, T1, 'sky', 0.2); poly(b, T1, 'ink', 3.4);
      // 큰 삼각형(변 k) = 작은 삼각형 k²개
      const T2 = [pt(X2, 0), pt(X2 + k, 0), pt(X2 + k / 2, -h * k)];
      fillPoly(b, T2, 'green', 0.1); poly(b, T2, 'ink', 3.6);
      const showTiles = C.problem ? false : (C.review ? st >= 2 : true);
      if (showTiles) {
        const row = (r, j) => pt(X2 + k / 2 - r / 2 + j, -h * (k - r));
        for (let r = 1; r <= k; r++) { line(b, row(r, 0), row(r, r), 'green', k > 4 ? 1.8 : 2.2); }
        for (let r = 0; r < k; r++) for (let j = 0; j <= r; j++) { line(b, row(r, j), row(r + 1, j), 'green', k > 4 ? 1.8 : 2.2); line(b, row(r, j), row(r + 1, j + 1), 'green', k > 4 ? 1.8 : 2.2); }
        // 칸 수(작은 삼각형의 개수): 줄마다 1, 3, 5 …
        if (C.txt && k <= 4) for (let r = 0; r < k; r++) T(b, pt(X2 + k / 2, -h * (k - r - 0.62)), `${2 * r + 1}개`, { size: 13, color: 'amber' });
      }
      // 길이
      sideTag(b, T1[0], T1[1], centroidOf(T1), '1', { color: 'sky', size: 17 });
      sideTag(b, T2[0], T2[1], centroidOf(T2), String(k), { color: 'green', size: 17 });
      if (C.txt) {
        const cx = (X2 + k) / 2;
        const cap = st >= 3 ? `넓이의 비 1 : ${k * k}  (= 1 : ${k}²)` : st >= 2 ? `큰 삼각형 = 작은 삼각형 ${k * k}개` : st >= 1 || !C.review ? `길이의 비 1 : ${k}  →  넓이의 비 1 : ${k * k}` : '';
        T(b, pt(cx, 0), cap, { dy: 44, size: capSize(b), color: 'amber' });
        if (!C.review || st >= 2) T(b, pt(0.5, -h / 2), '1', { size: 13, color: 'sky' });
      }
    },
    steps: (M) => [
      `작은 삼각형의 한 변이 1일 때 큰 삼각형의 한 변은 ${M.k}예요. 닮음비는 $1:${M.k}$예요.`,
      `큰 삼각형을 작은 삼각형으로 채우면 $1+3+5+\\cdots=${M.k}^{2}=${M.area}$(개)가 들어가요.`,
      `그러므로 넓이의 비는 $1:${M.area}$, 곧 닮음비가 $1:${M.k}$이면 넓이의 비는 $1^{2}:${M.k}^{2}$이에요.`
    ],
    view: (M) => ({
      guide: '<b>k</b> 막대로 큰 삼각형의 크기를 바꿔 보세요. 큰 삼각형을 채우는 작은 삼각형의 수가 <b>k²</b>개가 되는 것을 확인해요.',
      readouts: [rd('길이의 비', `1 : ${M.k}`, 'sky'), rd('작은 삼각형의 개수', `${M.area}개`, 'amber', `${M.k} × ${M.k}`), rd('넓이의 비', `1 : ${M.area}`, 'green', `1² : ${M.k}²`)],
      formula: `<p>닮음비 $1:k=1:${M.k}$ → 넓이의 비 $1^{2}:k^{2}=1:${M.area}$</p>`,
      rule: '닮음비가 m : n 이면 넓이의 비는 m² : n² 이다',
      notes: notes('<b>[함정]</b> 길이가 2배면 넓이도 2배가 아니에요. <b>4배</b>예요.', '넓이의 비는 닮음비를 <b>제곱</b>해서 구해요.')
    }),
    prob: (M) => {
      const pk = M.pk;
      if (pk.kind === 0) { const S1 = pk.p * pk.p * pk.c, S2 = pk.q * pk.q * pk.c; return { tag: '넓이의 비', key: `a${pk.p}-${pk.q}-${pk.c}`, stem: `두 도형 A, B가 닮은 도형이고 닮음비가 ${pk.p} : ${pk.q}이다. A의 넓이가 ${S1} cm²일 때, B의 넓이는?`, choices: mkChoices(S2, [[S1 * pk.q / pk.p, '닮음비를 그대로 곱했어요. 넓이는 제곱의 비예요.'], [S1 + (pk.q - pk.p) * pk.c, '비의 차를 더했어요.'], [S1 * pk.q * pk.q * 1 / (pk.p * pk.p) === S2 ? S2 + 1 : 0, ''], [Math.round(S1 * pk.q * pk.q * pk.q / (pk.p * pk.p * pk.p)), '부피의 비(세제곱)를 썼어요. 넓이는 제곱이에요.'], [S2 + pk.c, '']], { pad: pk.c }), fig: 'two' }; }
      if (pk.kind === 1) return { tag: '닮음비와 넓이의 비', key: `b${pk.p}-${pk.q}`, stem: `닮은 두 도형 A, B의 닮음비가 ${pk.p} : ${pk.q}일 때, 넓이의 비는?`, choices: mkRatioChoices([pk.p * pk.p, pk.q * pk.q], [[[pk.p, pk.q], '닮음비를 그대로 썼어요. 제곱해야 해요.'], [[pk.p * pk.p * pk.p, pk.q * pk.q * pk.q], '세제곱은 부피의 비예요.'], [[pk.p * 2, pk.q * 2], '닮음비를 2배 했어요. 제곱을 해야 해요.']]) };
      return { tag: '넓이의 비로 닮음비 구하기', key: `c${pk.p}-${pk.q}`, stem: `닮은 두 도형 A, B의 넓이의 비가 ${pk.p * pk.p} : ${pk.q * pk.q}일 때, 닮음비는?`, choices: mkRatioChoices([pk.p, pk.q], [[[pk.p * pk.p, pk.q * pk.q], '넓이의 비를 그대로 썼어요. 두 항이 각각 어떤 수의 제곱인지 생각해요.'], [[pk.p * pk.p * pk.p, pk.q * pk.q * pk.q], '세제곱은 부피예요.'], [[pk.p + 1, pk.q + 1], '각 항에 1을 더하면 비가 달라져요.']]) };
    }
  };
  const centroidOf = (Pn) => G.centroid(Pn);
  // 문제 그림(넓이): 닮은 두 도형 A, B — 값은 그림 안에
  function drawTwoSim(b, pk) {
    const p = pk.p, q = pk.q, c = pk.c, bx = Math.max(p, q);
    const sa = p / bx * 3.8, sb = q / bx * 3.8, X2 = sa + 1.4;
    fit(b, { x0: -0.2, x1: X2 + sb + 0.2, y0: -Math.max(sa, sb) * HH - 0.2, y1: 0.4 }, { t: 40, b: 56, l: 30, r: 30 });
    const A = [pt(0, 0), pt(sa, 0), pt(sa / 2, -sa * HH)], Bt = [pt(X2, 0), pt(X2 + sb, 0), pt(X2 + sb / 2, -sb * HH)];
    fillPoly(b, A, 'sky', 0.14); poly(b, A, 'ink', 3.6); fillPoly(b, Bt, 'green', 0.14); poly(b, Bt, 'ink', 3.6);
    const pre = pk.kind === 0 ? [String(p * p * c) + ' cm²', 'x'] : pk.kind === 1 ? [`닮음비 ${p}`, `${q}`] : [`넓이 ${p * p}`, `넓이 ${q * q}`];
    if (pk.kind === 0) { T(b, centroidOf(A), `${p * p * c}`, { size: 16, color: 'sky', dy: 8 }); T(b, centroidOf(Bt), 'x', { size: 18, color: 'amber', dy: 8 }); sideTag(b, A[0], A[1], centroidOf(A), String(p), { color: 'sky', size: 17 }); sideTag(b, Bt[0], Bt[1], centroidOf(Bt), String(q), { color: 'green', size: 17 }); }
    else if (pk.kind === 1) { sideTag(b, A[0], A[1], centroidOf(A), String(p), { color: 'sky', size: 17 }); sideTag(b, Bt[0], Bt[1], centroidOf(Bt), String(q), { color: 'green', size: 17 }); }
    else { T(b, centroidOf(A), `${p * p}`, { size: 16, color: 'sky', dy: 8 }); T(b, centroidOf(Bt), `${q * q}`, { size: 16, color: 'green', dy: 8 }); }
    T(b, pt(sa / 2, 0), 'A', { dy: pk.kind <= 1 ? 46 : 26, size: 17 }); T(b, pt(X2 + sb / 2, 0), 'B', { dy: pk.kind <= 1 ? 46 : 26, size: 17 });
  }

  /* ====================================================================== 2. 부피의 비 (쌓기나무) */
  const OB = { x: 0.5, y: 0.32 };
  const cubeP = (ox, x, y, z) => pt(ox + x + OB.x * z, -(y + OB.y * z));
  // 한 모서리 k 인 정육면체, 단위 칸 격자 포함(grid)
  function drawCube(b, ox, k, o = {}) {
    const p = (x, y, z) => cubeP(ox, x, y, z), col = o.col || 'ink';
    const F = [p(0, 0, 0), p(k, 0, 0), p(k, k, 0), p(0, k, 0)], Bk = [p(0, 0, k), p(k, 0, k), p(k, k, k), p(0, k, k)];
    fillPoly(b, F, o.fill || 'sky', 0.12); fillPoly(b, [F[3], F[2], Bk[2], Bk[3]], o.fill || 'sky', 0.2); fillPoly(b, [F[1], Bk[1], Bk[2], F[2]], o.fill || 'sky', 0.07);
    if (o.grid && k > 1) {
      for (let i = 1; i < k; i++) {
        line(b, p(i, 0, 0), p(i, k, 0), 'green', 1.4); line(b, p(0, i, 0), p(k, i, 0), 'green', 1.4);
        line(b, p(i, k, 0), p(i, k, k), 'green', 1.4); line(b, p(0, k, i), p(k, k, i), 'green', 1.4);
        line(b, p(k, i, 0), p(k, i, k), 'green', 1.4); line(b, p(k, 0, i), p(k, k, i), 'green', 1.4);
      }
    }
    [[Bk[0], Bk[1]], [Bk[0], Bk[3]], [Bk[0], F[0]]].forEach(([u, v]) => line(b, u, v, col, 2, { dash: [6, 5], alpha: 0.7 }));
    line(b, Bk[3], Bk[2], col, 3.2); line(b, Bk[2], Bk[1], col, 3.2); line(b, F[2], Bk[2], col, 3.2); line(b, F[3], Bk[3], col, 3.2); poly(b, F, col, 3.4); line(b, F[1], Bk[1], col, 3.2);
    return { F, Bk };
  }
  const cubeExt = (k) => ({ w: k * (1 + OB.x), h: k * (1 + OB.y) });
  const cube = {
    id: 'sm2-cube', title: '닮음비와 겉넓이·부피의 비', short: '부피의 비',
    question: '정육면체의 한 모서리가 k배가 되면 겉넓이와 부피는 각각 몇 배가 될까? 작은 블록을 쌓아서 확인해 보자.',
    ctl: ['smCk'],
    init: (s) => { s.smCk = 3; },
    gen: (seed) => {
      const r = seeded('d2' + seed), kind = ri(r, 0, 2), p = ri(r, 1, 3), q = p + ri(r, 1, 2), a = ri(r, 1, 3), k = ri(r, 2, 4);
      return { seed, kind, p, q, a, k };
    },
    model: (s) => { const k = clamp(Math.round(s.smCk), 1, 4); return { k, face: k * k, vol: k * k * k, surf: 6 * k * k }; },
    draw(b, s, M, C) {
      const pk = M.pk, prob = C.problem;
      let k1, k2, g1 = false, lab1, lab2;
      if (prob) {
        if (pk.kind === 0) { k1 = 1; k2 = pk.k; g1 = true; lab1 = `${pk.a}`; lab2 = `${pk.a * pk.k}`; }
        else { k1 = pk.p; k2 = pk.q; lab1 = `${pk.p}`; lab2 = `${pk.q}`; if (pk.kind === 2) { lab1 = `부피 ${pk.p ** 3}`; lab2 = `부피 ${pk.q ** 3}`; } }
      } else { k1 = 1; k2 = M.k; lab1 = '1'; lab2 = String(M.k); }
      const e1 = cubeExt(k1), e2 = cubeExt(k2), gap = 1.5, X2 = e1.w + gap, st = C.step;
      fit(b, { x0: -0.2, x1: X2 + e2.w + 0.2, y0: -e2.h - 0.2, y1: 0.3 }, { t: 40, b: 84, l: 30, r: 30 });
      drawCube(b, 0, k1, { fill: 'sky' });
      drawCube(b, X2, k2, { fill: 'green', grid: !prob && (!C.review || st >= 2) || (prob && pk.kind === 0 && k2 > 1) || (C.solution && C.solStep >= 3 && pk.kind !== 2) });
      const mm = (ox, k) => lerp(cubeP(ox, 0, 0, 0), cubeP(ox, k, 0, 0), 0.5);
      if (prob && pk.kind === 0) { T(b, mm(0, k1), lab1, { dy: 20, size: 16, color: 'sky' }); T(b, mm(X2, k2), lab2, { dy: 20, size: 16, color: 'green' }); }
      else if (prob && pk.kind === 2) { T(b, add(mm(0, k1), pt(0, 0)), lab1, { dy: 22, size: 16, color: 'sky' }); T(b, mm(X2, k2), lab2, { dy: 22, size: 16, color: 'green' }); }
      else { T(b, mm(0, k1), lab1, { dy: 20, size: 17, color: 'sky' }); T(b, mm(X2, k2), lab2, { dy: 20, size: 17, color: 'green' }); }
      if (C.txt && !prob) {
        const cx = (X2 + e2.w) / 2;
        const k = M.k;
        const cap = st >= 3 ? `부피의 비 1 : ${k * k * k}  (= 1 : ${k}³)` : st >= 2 ? `한 면 ${k * k}칸 → 겉넓이의 비 1 : ${k * k}` : `길이의 비 1 : ${k}`;
        T(b, pt(cx, 0), C.review ? cap : `길이 1 : ${k}  넓이 1 : ${k * k}  부피 1 : ${k * k * k}`, { dy: 50, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `작은 정육면체의 한 모서리가 1일 때 큰 정육면체의 한 모서리는 ${M.k}예요. 닮음비는 $1:${M.k}$예요.`,
      `큰 정육면체의 한 면에는 작은 정사각형이 $${M.k}\\times${M.k}=${M.face}$(칸)이므로 겉넓이의 비는 $1:${M.face}$예요. (겉넓이의 비 $=1^{2}:${M.k}^{2}$)`,
      `큰 정육면체는 작은 블록을 $${M.k}\\times${M.k}\\times${M.k}=${M.vol}$(개) 쌓은 것이므로 부피의 비는 $1:${M.vol}$예요. (부피의 비 $=1^{3}:${M.k}^{3}$)`
    ],
    view: (M) => ({
      guide: '<b>k</b> 막대로 큰 정육면체의 크기를 바꿔 보세요. 한 모서리가 k배가 될 때 <b>한 면의 칸 수는 k²개, 쌓은 블록은 k³개</b>가 돼요.',
      readouts: [rd('길이의 비', `1 : ${M.k}`, 'sky'), rd('겉넓이의 비', `1 : ${M.face}`, 'amber', `1² : ${M.k}²`), rd('부피의 비', `1 : ${M.vol}`, 'green', `1³ : ${M.k}³`)],
      formula: `<p>닮음비 $1:${M.k}$ → 겉넓이의 비 $1:${M.k}^{2}=1:${M.face}$ → 부피의 비 $1:${M.k}^{3}=1:${M.vol}$</p>`,
      rule: '닮음비가 m : n 이면 겉넓이의 비는 m² : n², 부피의 비는 m³ : n³ 이다',
      notes: notes('겉넓이는 <b>제곱</b>, 부피는 <b>세제곱</b>의 비예요. 서로 바꿔 쓰지 마세요.', '<b>[함정]</b> 모서리가 2배면 부피는 2배가 아니라 8배예요.')
    }),
    prob: (M) => {
      const pk = M.pk;
      if (pk.kind === 0) { const ans = pk.k ** 3; return { tag: '쌓은 블록의 수', key: `a${pk.a}-${pk.k}`, stem: `한 모서리의 길이가 ${pk.a} cm인 작은 정육면체 블록을 쌓아서 한 모서리의 길이가 ${pk.a * pk.k} cm인 큰 정육면체를 만들려고 한다. 블록은 모두 몇 개 필요한가?`, choices: mkChoices(ans, [[pk.k * pk.k, '한 면에 놓는 블록의 수예요. 층을 모두 쌓아야 해요.'], [pk.k * 3, '모서리의 비를 곱했어요. 부피이므로 세제곱이에요.'], [pk.k * pk.k * pk.k - pk.k, ''], [2 * pk.k * pk.k, '']], { pad: 1 }) }; }
      if (pk.kind === 1) return { tag: '겉넓이의 비', key: `b${pk.p}-${pk.q}`, stem: `두 정육면체의 한 모서리의 길이가 각각 ${pk.p} cm, ${pk.q} cm일 때, 두 정육면체의 겉넓이의 비는?`, choices: mkRatioChoices([pk.p * pk.p, pk.q * pk.q], [[[pk.p, pk.q], '모서리의 비 그대로예요. 겉넓이는 제곱의 비예요.'], [[pk.p ** 3, pk.q ** 3], '세제곱은 부피의 비예요.'], [[2 * pk.p, 2 * pk.q], '']]) };
      return { tag: '부피의 비로 겉넓이의 비 구하기', key: `c${pk.p}-${pk.q}`, stem: `두 정육면체의 부피가 각각 ${pk.p ** 3} cm³, ${pk.q ** 3} cm³일 때, 두 정육면체의 겉넓이의 비는?`, choices: mkRatioChoices([pk.p * pk.p, pk.q * pk.q], [[[pk.p ** 3, pk.q ** 3], '부피의 비 그대로예요. 겉넓이의 비는 닮음비의 제곱이에요.'], [[pk.p, pk.q], '닮음비예요. 겉넓이는 한 번 더 제곱해요.'], [[pk.p * pk.p * 2, pk.q * pk.q * 2], '']]) };
    }
  };

  /* ====================================================================== 3. 닮은 입체의 겉넓이·부피 (직육면체) */
  const BX = [1, 2, 3]; // 직육면체 기준 모서리(가로·세로·높이)
  const surf0 = 2 * (1 * 2 + 2 * 3 + 3 * 1), vol0 = 6; // 22, 6
  function drawBox(b, ox, k, o = {}) {
    const w = BX[0] * k, d = BX[1] * k, h = BX[2] * k, p = (x, y, z) => cubeP(ox, x, y, z), col = o.col || 'ink';
    const F = [p(0, 0, 0), p(w, 0, 0), p(w, h, 0), p(0, h, 0)], Bk = [p(0, 0, d), p(w, 0, d), p(w, h, d), p(0, h, d)];
    fillPoly(b, F, o.fill, 0.12); fillPoly(b, [F[3], F[2], Bk[2], Bk[3]], o.fill, 0.2); fillPoly(b, [F[1], Bk[1], Bk[2], F[2]], o.fill, 0.07);
    [[Bk[0], Bk[1]], [Bk[0], Bk[3]], [Bk[0], F[0]]].forEach(([u, v]) => line(b, u, v, col, 2, { dash: [6, 5], alpha: 0.7 }));
    line(b, Bk[3], Bk[2], col, 3.2); line(b, Bk[2], Bk[1], col, 3.2); line(b, F[2], Bk[2], col, 3.2); line(b, F[3], Bk[3], col, 3.2); poly(b, F, col, 3.4); line(b, F[1], Bk[1], col, 3.2);
    return { F, Bk, w, d, h };
  }
  const boxExt = (k) => ({ w: (BX[0] + OB.x * BX[1]) * k, h: (BX[2] + OB.y * BX[1]) * k });
  const solidSV = {
    id: 'sm2-solid', title: '닮은 입체의 겉넓이와 부피', short: '입체의 넓이·부피',
    question: '닮음비가 m : n인 두 입체에서 겉넓이의 비와 부피의 비는 어떻게 될까? 작은 입체의 겉넓이와 부피를 알면 큰 입체의 값도 구할 수 있을까?',
    ctl: ['smSm', 'smSn'],
    init: (s) => { s.smSm = 2; s.smSn = 3; },
    gen: (seed) => {
      const r = seeded('d3' + seed), kind = ri(r, 0, 3), m = ri(r, 1, 3), n = m + ri(r, 1, 2), ask = ri(r, 0, 1), v0 = ri(r, 1, 5);
      return { seed, kind, m, n, ask, v0 };
    },
    model: (s) => { const m = clamp(Math.round(s.smSm), 1, 3), n = clamp(Math.round(s.smSn), 2, 5), g = gcd(m, n); return { m, n, g, S1: surf0 * m * m, S2: surf0 * n * n, V1: vol0 * m ** 3, V2: vol0 * n ** 3 }; },
    draw(b, s, M, C) {
      const pk = M.pk, prob = C.problem, m = prob ? pk.m : M.m, n = prob ? pk.n : M.n;
      const e1 = boxExt(m), e2 = boxExt(n), gap = 1.6 + 0.2 * n, X2 = e1.w + gap, st = C.step;
      fit(b, { x0: -0.2, x1: X2 + e2.w + 0.2, y0: -Math.max(e1.h, e2.h) - 0.2, y1: 0.3 }, { t: 40, b: prob ? 70 : 84, l: 30, r: 30 });
      const A = drawBox(b, 0, m, { fill: 'sky' }), B = drawBox(b, X2, n, { fill: 'green' });
      const edge = (X, k, who) => { // 대응 모서리 하나(가로)의 길이
        const c = who ? 'green' : 'sky';
        T(b, lerp(X.F[0], X.F[1], 0.5), prob ? (who ? (pk.kind <= 1 ? String(BX[0] * n) : String(BX[0] * n)) : String(BX[0] * m)) : fmtN(BX[0] * k), { dy: 18, size: 16, color: c });
      };
      if (!prob || pk.kind <= 1) { edge(A, m, 0); edge(B, n, 1); } // 비를 구하는 문제(kind 2, 3)는 모서리 길이를 그리지 않는다(닮음비가 곧 답의 단서)
      if (!prob) {
        T(b, lerp(A.F[1], A.Bk[1], 0.5), fmtN(BX[1] * m), { dx: 14, dy: 12, size: 15, color: 'sky' }); T(b, lerp(B.F[1], B.Bk[1], 0.5), fmtN(BX[1] * n), { dx: 14, dy: 12, size: 15, color: 'green' });
        T(b, lerp(A.F[1], A.F[2], 0.5), fmtN(BX[2] * m), { dx: 14, size: 15, color: 'sky' }); T(b, lerp(B.F[1], B.F[2], 0.5), fmtN(BX[2] * n), { dx: 14, size: 15, color: 'green' });
      }
      if (C.txt && !prob) {
        const mid1 = (e1.w) / 2, mid2 = X2 + e2.w / 2, g = M.g;
        const a1 = st >= 2 || !C.review ? `겉넓이 ${M.S1}` : '', a2 = st >= 2 || !C.review ? `겉넓이 ${M.S2}` : '', v1 = st >= 3 || !C.review ? `부피 ${M.V1}` : '', v2 = st >= 3 || !C.review ? `부피 ${M.V2}` : '';
        T(b, pt(mid1, 0), a1, { dy: 44, size: phone(b) ? 13 : 16, color: 'sky' }); T(b, pt(mid2, 0), a2, { dy: 44, size: phone(b) ? 13 : 16, color: 'green' });
        T(b, pt(mid1, 0), v1, { dy: 68, size: phone(b) ? 13 : 16, color: 'sky' }); T(b, pt(mid2, 0), v2, { dy: 68, size: phone(b) ? 13 : 16, color: 'green' });
        T(b, pt((mid1 + mid2) / 2, 0), `닮음비 ${m} : ${n}`, { dy: 94, size: capSize(b), color: 'amber' });
      }
      if (C.txt && prob) {
        const mid1 = e1.w / 2, mid2 = X2 + e2.w / 2, sz = phone(b) ? 14 : 16;
        if (pk.kind === 0) { T(b, pt(mid1, 0), `겉넓이 ${surf0 * pk.m * pk.m}`, { dy: 42, size: sz, color: 'sky' }); T(b, pt(mid2, 0), '겉넓이 x', { dy: 42, size: sz, color: 'amber' }); }
        else if (pk.kind === 1) { T(b, pt(mid1, 0), `부피 ${vol0 * pk.m ** 3}`, { dy: 42, size: sz, color: 'sky' }); T(b, pt(mid2, 0), '부피 x', { dy: 42, size: sz, color: 'amber' }); }
        else if (pk.kind === 2) { T(b, pt(mid1, 0), `겉넓이 ${surf0 * pk.m * pk.m}`, { dy: 42, size: sz, color: 'sky' }); T(b, pt(mid2, 0), `겉넓이 ${surf0 * pk.n * pk.n}`, { dy: 42, size: sz, color: 'green' }); }
        else { T(b, pt(mid1, 0), `부피 ${vol0 * pk.m ** 3}`, { dy: 42, size: sz, color: 'sky' }); T(b, pt(mid2, 0), `부피 ${vol0 * pk.n ** 3}`, { dy: 42, size: sz, color: 'green' }); }
      }
    },
    steps: (M) => [
      `두 직육면체는 대응하는 모서리의 비가 모두 $${M.m}:${M.n}$인 닮은 도형이에요. 닮음비는 $${M.m}:${M.n}$예요.`,
      `겉넓이의 비는 닮음비의 제곱이에요. $${M.m}^{2}:${M.n}^{2}=${M.m ** 2}:${M.n ** 2}$이므로 ${M.S1} : ${M.S2}예요.`,
      `부피의 비는 닮음비의 세제곱이에요. $${M.m}^{3}:${M.n}^{3}=${M.m ** 3}:${M.n ** 3}$이므로 ${M.V1} : ${M.V2}예요.`
    ],
    view: (M) => ({
      guide: '<b>m, n</b> 막대로 두 직육면체의 크기를 바꿔 보세요. 겉넓이와 부피의 값이 닮음비의 <b>제곱, 세제곱</b>으로 바뀌는 것을 살펴보세요.',
      readouts: [rd('닮음비', `${M.m} : ${M.n}`, 'amber'), rd('겉넓이의 비', `${M.S1} : ${M.S2}`, 'sky', `${M.m ** 2} : ${M.n ** 2}`), rd('부피의 비', `${M.V1} : ${M.V2}`, 'green', `${M.m ** 3} : ${M.n ** 3}`)],
      formula: `<p>겉넓이: $${M.S1}:${M.S2}=${M.m}^{2}:${M.n}^{2}$</p><p>부피: $${M.V1}:${M.V2}=${M.m}^{3}:${M.n}^{3}$</p>`,
      rule: '닮은 두 입체도형의 닮음비가 m : n 이면 겉넓이의 비는 m² : n², 부피의 비는 m³ : n³ 이다',
      notes: notes('겉넓이의 비는 <b>제곱</b>, 부피의 비는 <b>세제곱</b>이에요.', '두 입체의 높이를 비교할 때도 대응하는 모서리의 비가 닮음비예요.')
    }),
    prob: (M) => {
      const pk = M.pk, S1 = surf0 * pk.m ** 2, S2 = surf0 * pk.n ** 2, V1 = vol0 * pk.m ** 3, V2 = vol0 * pk.n ** 3;
      if (pk.kind === 0) return { tag: '닮은 입체의 겉넓이', key: `a${pk.m}-${pk.n}`, stem: `두 직육면체 A, B가 닮은 도형이다. A의 겉넓이가 ${S1} cm²일 때, B의 겉넓이 $x$는? (단위: cm²)`, choices: mkChoices(S2, [[S1 * pk.n / pk.m, '닮음비를 그대로 곱했어요. 겉넓이는 제곱의 비예요.'], [S1 * pk.n ** 3 / pk.m ** 3, '세제곱을 썼어요. 부피의 비예요.'], [S2 + surf0, ''], [S2 - surf0, '']], { pad: surf0 }) };
      if (pk.kind === 1) return { tag: '닮은 입체의 부피', key: `b${pk.m}-${pk.n}`, stem: `두 직육면체 A, B가 닮은 도형이다. A의 부피가 ${V1} cm³일 때, B의 부피 $x$는? (단위: cm³)`, choices: mkChoices(V2, [[V1 * pk.n / pk.m, '닮음비를 그대로 곱했어요. 부피는 세제곱의 비예요.'], [V1 * pk.n ** 2 / pk.m ** 2, '제곱을 썼어요. 넓이의 비예요.'], [V2 + vol0, ''], [V2 - vol0, '']], { pad: vol0 }) };
      if (pk.kind === 2) return { tag: '겉넓이의 비로 부피의 비 구하기', key: `c${pk.m}-${pk.n}`, stem: `두 직육면체 A, B가 닮은 도형이고 겉넓이가 각각 ${S1} cm², ${S2} cm²일 때, 부피의 비는?`, choices: mkRatioChoices([pk.m ** 3, pk.n ** 3], [[[pk.m ** 2, pk.n ** 2], '겉넓이의 비 그대로예요. 부피의 비는 닮음비의 세제곱이에요.'], [[pk.m, pk.n], '닮음비예요. 세제곱을 해야 해요.'], [[pk.m ** 4, pk.n ** 4], '']]) };
      return { tag: '부피의 비로 겉넓이의 비 구하기', key: `d${pk.m}-${pk.n}`, stem: `두 직육면체 A, B가 닮은 도형이고 부피가 각각 ${V1} cm³, ${V2} cm³일 때, 겉넓이의 비는?`, choices: mkRatioChoices([pk.m ** 2, pk.n ** 2], [[[pk.m ** 3, pk.n ** 3], '부피의 비 그대로예요. 겉넓이의 비는 닮음비의 제곱이에요.'], [[pk.m, pk.n], '닮음비예요. 제곱을 해야 해요.'], [[pk.m ** 4, pk.n ** 4], '']]) };
    }
  };

  /* ====================================================================== 4. [심화] 원뿔 자르기 */
  const ellipse = (cx, cy, rx, ry, a0, a1, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return pt(cx + rx * Math.cos(a), cy + ry * Math.sin(a)); });
  // 꼭짓점이 위인 원뿔: 높이 H, 밑면 반지름 H/2. 깊이 z(꼭짓점에서 아래로)에서의 반지름 z/2.
  function drawConeCut(b, ox, hs, o = {}) {
    const H = hs[0] + hs[1] + hs[2], cuts = [0, hs[0], hs[0] + hs[1], H], rad = (z) => z / 2, ry = (z) => Math.max(0.05, rad(z) * 0.28);
    const cols = ['sky', 'amber', 'green'], A = pt(ox, 0);
    // 조각 색칠: 위·아래 타원의 앞쪽 반을 경계로
    for (let i = 0; i < 3; i++) {
      const z0 = cuts[i], z1 = cuts[i + 1];
      const top = i === 0 ? [A] : ellipse(ox, z0, rad(z0), ry(z0), Math.PI, 0, 24).map((p) => pt(p.x, 2 * z0 - p.y));
      const topF = i === 0 ? [A] : ellipse(ox, z0, rad(z0), ry(z0), Math.PI, 0, 24);
      const bot = ellipse(ox, z1, rad(z1), ry(z1), 0, Math.PI, 24);
      fillPoly(b, topF.concat(bot), cols[i], o.fa == null ? 0.12 : o.fa);
    }
    // 잘린 면(타원): 뒤쪽 점선, 앞쪽 실선
    for (let i = 1; i <= 3; i++) {
      const z = cuts[i];
      b.path(ellipse(ox, z, rad(z), ry(z), Math.PI, 2 * Math.PI), { color: 'ink', width: i === 3 ? 2.4 : 2.2, dash: [6, 5], alpha: 0.8 });
      b.path(ellipse(ox, z, rad(z), ry(z), 0, Math.PI), { color: i === 3 ? 'ink' : cols[i - 1], width: i === 3 ? 3.4 : 3 });
    }
    line(b, A, pt(ox - rad(H), H), 'ink', 3.4); line(b, A, pt(ox + rad(H), H), 'ink', 3.4);
    b.point(A, { color: 'ink', r: 4 });
    return { H, cuts, rad, ry };
  }
  const cone = {
    id: 'sm2-cone', title: '[심화] 원뿔 자르기 1 : 7 : 19', short: '[심화] 원뿔 자르기',
    question: '원뿔을 밑면에 평행한 두 평면으로 잘랐더니 세 조각이 되었어. 높이를 같게 나눠 자르면 세 조각의 부피의 비는 어떻게 될까?',
    ctl: ['smH1', 'smH2', 'smH3'],
    init: (s) => { s.smH1 = 1; s.smH2 = 1; s.smH3 = 1; },
    gen: (seed) => {
      const r = seeded('d4' + seed), kind = ri(r, 0, 1), h1 = ri(r, 1, 2), h2 = ri(r, 1, 2), h3 = ri(r, 1, 2), c = ri(r, 1, 4);
      return { seed, kind, h1, h2, h3, c };
    },
    model: (s) => {
      const h = [clamp(Math.round(s.smH1), 1, 3), clamp(Math.round(s.smH2), 1, 3), clamp(Math.round(s.smH3), 1, 3)], l1 = h[0], l2 = h[0] + h[1], l3 = h[0] + h[1] + h[2];
      const v = [l1 ** 3, l2 ** 3 - l1 ** 3, l3 ** 3 - l2 ** 3];
      return { h, l: [l1, l2, l3], v, g: gcd(gcd(v[0], v[1]), v[2]) };
    },
    draw(b, s, M, C) {
      const prob = C.problem, hs = prob ? [M.pk.h1, M.pk.h2, M.pk.h3] : M.h, H = hs[0] + hs[1] + hs[2], st = C.step;
      const R = H / 2;
      fit(b, { x0: -R - 0.2, x1: R + 0.2, y0: -0.3, y1: H + R * 0.28 + 0.2 }, { t: 30, b: 56, l: 54, r: 54 });
      const g = drawConeCut(b, 0, hs);
      const sz = phone(b) ? 14 : 16, col = ['sky', 'amber', 'green'];
      const vv = prob ? (() => { const l1 = hs[0], l2 = hs[0] + hs[1], l3 = H; return [l1 ** 3, l2 ** 3 - l1 ** 3, l3 ** 3 - l2 ** 3]; })() : M.v;
      const zmid = [hs[0] * 0.72, hs[0] + hs[1] / 2, hs[0] + hs[1] + hs[2] / 2];
      for (let i = 0; i < 3; i++) {
        // 높이(왼쪽 바깥)
        const zl = g.cuts[i] + hs[i] / 2, xr = -g.rad(zl);
        T(b, pt(xr, zl), String(hs[i]), { dx: -14, size: sz, color: col[i] });
        if (!prob && (!C.review || st >= 2)) T(b, pt(0, zmid[i]), `${vv[i]}`, { dy: i === 0 ? 10 : 4, size: sz + 1, color: col[i] });
      }
      if (prob) {
        if (M.pk.kind === 1) { T(b, pt(0, zmid[0]), `${M.pk.h1 ** 3 * M.pk.c}`, { dy: 10, size: sz + 1, color: 'sky' }); T(b, pt(0, zmid[1]), 'x', { size: sz + 3, color: 'amber' }); }
        else { T(b, pt(0, zmid[0]), '①', { dy: 10, size: Math.round((sz + 1) * 1.55), color: 'sky' }); T(b, pt(0, zmid[1]), '②', { size: Math.round((sz + 1) * 1.55), color: 'amber' }); T(b, pt(0, zmid[2]), '③', { size: Math.round((sz + 1) * 1.55), color: 'green' }); }
      }
      if (C.txt && !prob) {
        const cap = st >= 3 || !C.review ? `부피의 비 ${vv[0]} : ${vv[1]} : ${vv[2]}` : st >= 2 ? `닮음비 ${M.l[0]} : ${M.l[1]} : ${M.l[2]}` : '높이 ' + hs.join(' : ');
        T(b, pt(0, H + R * 0.28), cap, { dy: 30, size: capSize(b), color: 'amber' });
      }
    },
    steps: (M) => [
      `위에서부터 높이가 ${M.l[0]}, ${M.l[1]}, ${M.l[2]}인 세 원뿔은 모두 닮은 도형이에요. 닮음비는 $${M.l[0]}:${M.l[1]}:${M.l[2]}$예요.`,
      `부피의 비는 닮음비의 세제곱이에요. $${M.l[0]}^{3}:${M.l[1]}^{3}:${M.l[2]}^{3}=${M.l[0] ** 3}:${M.l[1] ** 3}:${M.l[2] ** 3}$`,
      `각 조각의 부피는 큰 원뿔에서 작은 원뿔을 뺀 값이에요. 위 조각 ${M.l[0] ** 3}, 가운데 조각 ${M.l[1] ** 3}-${M.l[0] ** 3}=${M.v[1]}, 아래 조각 ${M.l[2] ** 3}-${M.l[1] ** 3}=${M.v[2]}이므로 $${M.v[0]}:${M.v[1]}:${M.v[2]}$예요.`
    ],
    view: (M) => ({
      guide: '세 막대로 <b>위·가운데·아래 조각의 높이</b>를 바꿔 보세요. 높이가 모두 같으면(1, 1, 1) 부피의 비는 <b>1 : 7 : 19</b>가 돼요.',
      readouts: [rd('닮음비 (위 3개의 원뿔)', `${M.l[0]} : ${M.l[1]} : ${M.l[2]}`, 'amber'), rd('부피의 비 (닮음비의 세제곱)', `${M.l[0] ** 3} : ${M.l[1] ** 3} : ${M.l[2] ** 3}`, 'sky'), rd('세 조각의 부피의 비', `${M.v[0]} : ${M.v[1]} : ${M.v[2]}`, 'green', M.g > 1 ? `간단히 ${M.v.map((x) => x / M.g).join(' : ')}` : '', null, true)],
      formula: `<p>$${M.l[0]}^{3}:(${M.l[1]}^{3}-${M.l[0]}^{3}):(${M.l[2]}^{3}-${M.l[1]}^{3})=${M.v[0]}:${M.v[1]}:${M.v[2]}$</p>`,
      rule: '원뿔을 평행한 평면으로 자르면 위의 작은 원뿔은 처음 원뿔과 닮음 → 부피는 닮음비의 세제곱, 조각의 부피는 뺄셈으로 구한다',
      notes: notes('<b>[킬러]</b> 세 조각의 부피의 비는 높이의 비 1 : 1 : 1이 아니에요. 닮음비 1 : 2 : 3의 <b>세제곱 1 : 8 : 27을 뺄셈</b>으로 나눠야 해요.', '가운데 조각은 (가운데까지의 원뿔) − (위 작은 원뿔)이에요.')
    }),
    prob: (M) => {
      const pk = M.pk, l1 = pk.h1, l2 = pk.h1 + pk.h2, l3 = pk.h1 + pk.h2 + pk.h3, v = [l1 ** 3, l2 ** 3 - l1 ** 3, l3 ** 3 - l2 ** 3], g = gcd(gcd(v[0], v[1]), v[2]);
      if (pk.kind === 0) {
        const ok = `${v.map((x) => x / g).join(' : ')}`, bad = [[`${pk.h1} : ${pk.h2} : ${pk.h3}`, '높이의 비예요. 부피의 비는 세제곱이에요.'], [`${l1 ** 3} : ${l2 ** 3} : ${l3 ** 3}`, '세 원뿔의 부피의 비예요. 조각의 부피는 뺄셈으로 구해요.'], [`${l1 ** 2} : ${l2 ** 2 - l1 ** 2} : ${l3 ** 2 - l2 ** 2}`, '넓이의 비(제곱)를 썼어요. 부피는 세제곱이에요.'], [`${l1} : ${l2 - l1 + 1} : ${l3 - l2 + 2}`, '']];
        const items = [{ h: `$${ok.replace(/ : /g, ':')}$`, ok: true }];
        bad.forEach(([t, h]) => { const tt = t.replace(/ : /g, ':'); if (tt !== ok.replace(/ : /g, ':') && !items.some((x) => x.h === `$${tt}$`) && items.length < 5) items.push({ h: `$${tt}$`, hint: h }); });
        for (let k = 1; items.length < 5; k++) { const tt = `${v[0] / g + k}:${v[1] / g}:${v[2] / g + k}`; if (!items.some((x) => x.h === `$${tt}$`)) items.push({ h: `$${tt}$`, hint: '조각의 부피를 뺄셈으로 다시 구해 보세요.' }); }
        return { tag: '킬러 · 원뿔을 자른 조각의 부피의 비', key: `k0-${pk.h1}${pk.h2}${pk.h3}`, stem: `원뿔 모양 얼음을 밑면에 평행한 두 평면으로 잘라 높이가 위에서부터 ${pk.h1} cm, ${pk.h2} cm, ${pk.h3} cm인 세 조각 ①, ②, ③을 만들었다. 세 조각의 부피의 비는?`, choices: mkTextChoices(items, `k${pk.seed}`) };
      }
      const V1 = pk.h1 ** 3 * pk.c, ans = v[1] * pk.c;
      return { tag: '킬러 · 원뿔대의 부피', key: `k1-${pk.h1}${pk.h2}${pk.h3}-${pk.c}`, stem: `원뿔 모양 얼음을 밑면에 평행한 두 평면으로 잘라 높이가 위에서부터 ${pk.h1} cm, ${pk.h2} cm, ${pk.h3} cm인 세 조각을 만들었다. 가장 위의 조각 ①의 부피가 ${V1} cm³일 때, 가운데 조각 ②의 부피 $x$는? (단위: cm³)`, choices: mkChoices(ans, [[(l2 ** 3) * pk.c, '가운데까지 이어진 원뿔의 부피예요. 위 조각을 빼야 해요.'], [(l2 - l1) ** 3 * pk.c, '가운데 조각의 높이만으로 닮음비를 세웠어요.'], [V1 * pk.h2 / pk.h1, '높이의 비를 부피에 그대로 썼어요. 세제곱이에요.'], [ans + pk.c, '']], { pad: pk.c }), note: '위 조각 = 작은 원뿔, 가운데 = 큰 원뿔 − 작은 원뿔' };
    }
  };

  G.geo = Object.assign(G.geo || {}, { cubeP, cubeExt, boxExt, drawCube, drawBox });
  G.register(20, 't2', '② 닮음비와 넓이·부피의 비', '넓이·부피의 비', PARAMS, [tile, cube, solidSV, cone]);
})();
