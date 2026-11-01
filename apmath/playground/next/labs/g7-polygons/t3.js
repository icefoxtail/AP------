/* ==========================================================================
   중1 · 다각형 — 탭 ③ 「다각형의 내각과 외각의 합」 (t3.js, order 30) — 장면 5개
   · p3-inO     내각의 합 180°×(n−2): 다각형 안의 한 점 O 와 모든 꼭짓점을 이어 삼각형 n개로        · 점 O 끌기, n 조절
   · p3-concave 오목다각형: 꼭짓점 하나를 가로로 밀어 볼록 → 오목, 보조선(대각선)으로 삼각형 나누기    · 꼭짓점 P 끌기
   · p3-ext360  외각의 합 360°: 다각형을 한 점으로 줄이면 외각이 모여 한 바퀴                          · n 조절, 줄이기
   · p3-given   내각 몇 개가 주어진 오각형: 내각을 외각으로 바꿔 합 360° 로 x 구하기
   · p3-mixed   내각과 외각이 섞여 주어진 오각형
   내각이 정수(도)가 되도록 "외각 → 변의 길이(닫힘 조건)" 순서로 다각형을 만듭니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PG;
  if (!G) return;
  const { DEG, clamp, seg01, pt, add, sub, mul, unit, mid, lerp, len, polar, cross, angBetween, centroid, regUp, regPoly, pick, rint, bboxOf, T, tagOut, ang, tick, fillPoly, line, poly, fit, P, mkChoices, LET, rd, notes, fmtN, dg, tx, polyArea } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const dv = (d) => pt(cos(d), sin(d));
  // 합이 total 이 되도록 정수로 맞춰 반올림(가장 큰 소수부부터 올림)
  const lr = (vals, total) => {
    const fl = vals.map((v) => Math.floor(v + 1e-9));
    let rem = Math.round(total - fl.reduce((a, c) => a + c, 0));
    const idx = vals.map((v, i) => [v - fl[i], i]).sort((a, b) => b[0] - a[0]);
    for (let k = 0; k < rem; k++) fl[idx[k % idx.length][1]]++;
    return fl;
  };
  // 외각 eps[i](꼭짓점 V_i 에서 꺾는 각, 합 360°) 로 볼록다각형을 만듭니다. 변 i 는 V_i → V_{i+1}, 방향은 화면 각도(시계 방향이 +).
  function convexFromExt(eps) {
    const n = eps.length, th = [0];
    for (let i = 1; i < n; i++) th[i] = th[i - 1] + eps[i];
    const d = th.map((a) => dv(a));
    let sxx = 0, sxy = 0, syy = 0, rx = 0, ry = 0;
    d.forEach((q) => { sxx += q.x * q.x; sxy += q.x * q.y; syy += q.y * q.y; rx += q.x; ry += q.y; });
    const det = sxx * syy - sxy * sxy || 1e-9, l0 = (syy * rx - sxy * ry) / det, l1 = (-sxy * rx + sxx * ry) / det;
    const L = d.map((q) => 1 - (q.x * l0 + q.y * l1));
    const V = [pt(0, 0)];
    for (let i = 0; i < n - 1; i++) V.push(add(V[i], mul(d[i], L[i])));
    const c = centroid(V);
    let R = 0; V.forEach((p) => { R = Math.max(R, Math.hypot(p.x - c.x, p.y - c.y)); });
    return { V: V.map((p) => pt((p.x - c.x) / R, (p.y - c.y) / R)), th, minL: Math.min(...L), edges: L };
  }
  const intAng = (V, i) => angBetween(V[i], V[(i + V.length - 1) % V.length], V[(i + 1) % V.length]);

  const PARAMS = {
    pgOn: P('꼭짓점의 수 n', 3, 12, 1, 7, { color: 'amber', hint: '막대를 움직여 다각형을 바꿔 보세요', format: (v) => `${v}각형` }),
    pgOt: P('삼각형 나누기', 0, 1, 0.01, 1, { color: 'green', hint: '▶를 누르거나 막대를 끌면 삼각형이 하나씩 나뉘어요', format: (v) => Math.round(v * 100) + '%' }),
    pgCf: P('꼭짓점 P 가로로 밀기', 0, 1, 0.01, 0.3, { color: 'amber', hint: '그림의 노란 점 P를 가로로 끌어도 돼요 (오른쪽 = 볼록, 왼쪽 = 오목)', format: (v) => (v > 0.6 ? '볼록' : '오목') }),
    pgXn: P('꼭짓점의 수 n', 3, 12, 1, 6, { color: 'amber', format: (v) => `${v}각형` }),
    pgXt: P('다각형 줄이기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 다각형이 한 점으로 줄어들어요', format: (v) => Math.round(v * 100) + '%' }),
    pgGa: P('내각 ∠A', 100, 115, 1, 105, { color: 'sky', format: (v) => v + '°' }),
    pgGb: P('내각 ∠B', 100, 115, 1, 110, { color: 'sky', format: (v) => v + '°' }),
    pgGc: P('내각 ∠C', 100, 115, 1, 100, { color: 'sky', format: (v) => v + '°' }),
    pgGd: P('내각 ∠D', 100, 115, 1, 115, { color: 'sky', format: (v) => v + '°' }),
    pgMa: P('내각 ∠A', 100, 115, 1, 110, { color: 'sky', format: (v) => v + '°' }),
    pgMb: P('내각 ∠B', 100, 115, 1, 105, { color: 'sky', format: (v) => v + '°' }),
    pgMc: P('C의 외각', 65, 80, 1, 70, { color: 'rose', format: (v) => v + '°' }),
    pgMd: P('D의 외각', 65, 80, 1, 75, { color: 'rose', format: (v) => v + '°' })
  };

  /* ====================================================================== 1. 안의 한 점 O */
  const inO = {
    id: 'p3-inO', title: '다각형의 내각의 합', short: '내각의 합 180°(n−2)',
    question: 'n각형 안의 한 점 O와 모든 꼭짓점을 이으면 삼각형이 몇 개 생기고, 내각의 합은 어떻게 구할까?',
    ctl: ['pgOn', 'pgOt'], anim: { key: 'pgOt', dur: 6, label: '삼각형 하나씩 나누기', start: 1 },
    init: (s) => { s.pgOn = 7; s.pgOx = 0.2; s.pgOy = 0.12; s.pgOt = 1; },
    reroll: (s) => { s.pgOn = pick([5, 6, 7, 8, 9, 10, 11, 12], s.pgOn); s.pgOx = (Math.random() - 0.5) * 0.5; s.pgOy = (Math.random() - 0.5) * 0.5; },
    model: (s) => {
      const n = clamp(Math.round(s.pgOn), 3, 12), V = regUp(n, 1), lim = 0.78 * Math.cos(Math.PI / n);
      let o = pt(+s.pgOx || 0, +s.pgOy || 0); const l = Math.hypot(o.x, o.y); if (l > lim) o = mul(o, lim / l);
      return { n, V, O: o, lim, tri: 180 * n, S: 180 * (n - 2) };
    },
    draw(b, s, M, C) {
      const { n, V, O } = M;
      fit(b, { x0: -1, x1: 1, y0: -1, y1: 1 }, { t: 40, b: 92 });
      const k = C.problem ? 0 : C.review ? (C.step >= 2 ? n : C.step >= 1 ? n : 0) : C.t * n;
      const nTri = Math.min(n, Math.floor(k + 1e-6));
      const part = clamp(k - nTri, 0, 1);
      const cen = pt(0, 0);
      fillPoly(b, V, 'sky', 0.08);
      for (let i = 0; i < n; i++) {
        if (i < nTri) fillPoly(b, [O, V[i], V[(i + 1) % n]], i % 2 ? 'green' : 'sky', 0.24);
      }
      poly(b, V, 'ink', 3.4);
      if (!C.problem) for (let i = 0; i < n; i++) {
        const f = i < nTri ? 1 : i === nTri ? part : 0;
        if (f > 0) line(b, O, lerp(O, V[i], f), 'green', n > 9 ? 2.6 : 3.4);
      }
      V.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); if (C.txt) tagOut(b, p, cen, LET[i], { size: n > 9 ? 15 : 17, gap: 10 }); });
      if (C.problem) { b.point(O, { color: 'amber', r: 6 }); }
      else {
        if (nTri >= 1 || part > 0 || C.review) b.circle(O, 17 / (b.k || 60), { color: 'amber', width: 3 });
        if (C.txt && !C.thumb && !C.review) b.handle('O', O, { color: 'amber', r: 8, ariaLabel: '점 O 끌기', drag: (w) => { s.pgOx = w.x; s.pgOy = w.y; } });
        else b.point(O, { color: 'amber', r: 6 });
      }
      if (C.txt) {
        if (!C.problem) T(b, O, 'O', { dx: 16, dy: -16, size: 17, color: 'amber' });
        const yb = Math.max(...V.map((p) => p.y));
        let r1 = '', r2 = '', c1 = 'sky', c2 = 'amber';
        if (C.problem) r1 = `${n}각형의 내각의 합은?`;
        else {
          const full = nTri >= n;
          r1 = `삼각형 ${nTri}개 → 180°×${nTri} = ${180 * nTri}°`;
          if (full) r2 = C.review && C.step < 3 ? '' : `점 O 둘레 360° 빼기 → ${M.S}° = 180°×(${n}−2)`;
          if (C.review && C.step === 1) { r1 = `O와 꼭짓점을 이으면 삼각형 ${n}개`; r2 = ''; }
        }
        T(b, pt(0, yb), r1, { dy: 48, size: 17, color: c1 });
        T(b, pt(0, yb), r2, { dy: 74, size: 16, color: c2 });
      }
    },
    steps: (M) => [
      `다각형 안에 점 O를 잡고 모든 꼭짓점과 이어요. ${M.n}각형은 삼각형 ${M.n}개로 나뉘어요.`,
      `삼각형 ${M.n}개의 내각의 합은 180°×${M.n}=${M.tri}°예요.`,
      `이 속에는 다각형의 내각이 아닌 점 O 둘레의 각 360°가 들어 있어요. 빼면 ${M.tri}°−360°=${M.S}° 이므로 내각의 합은 180°×(${M.n}−2)=${M.S}°예요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 O</b>를 다각형 안에서 끌어 보세요. O가 어디에 있어도 결과는 같아요. 막대로 <b>n</b>을 바꾸고 ▶를 누르면 삼각형이 하나씩 나뉘어요.',
      readouts: [rd('삼각형의 수', `${M.n}개`, 'sky'), rd('삼각형의 내각의 합', `${M.tri}°`, 'green', `180° × ${M.n}`), rd('내각의 합', `${M.S}°`, 'amber', `180° × (${M.n} − 2)`, null, true)],
      formula: `<p>$180^{\\circ}\\times n-360^{\\circ}=180^{\\circ}\\times(n-2)$</p><p>$180^{\\circ}\\times${M.n}-360^{\\circ}=${M.S}^{\\circ}$</p>`,
      rule: 'n각형의 내각의 크기의 합 = 180° × (n − 2)',
      notes: notes('점 O 둘레의 각 360°는 다각형의 내각이 아니에요. <b>꼭 빼야</b> 해요.', '꼭짓점 하나에서 대각선을 그으면 삼각형이 (n−2)개 생겨요. 같은 결과(180°×(n−2))예요.')
    }),
    prob: (M) => {
      const { n, S } = M;
      return {
        tag: '다각형의 내각의 합', key: `n${n}`,
        stem: `${n}각형의 내각의 크기의 합은?`,
        choices: mkChoices(S, [[180 * n, '점 O 둘레의 각 360°를 빼지 않았어요.'], [180 * (n - 1), '삼각형의 수는 n−2예요. n−1이 아니에요.'], [180 * (n - 3), '삼각형의 수는 n−2예요.'], [360 * (n - 2), '삼각형 한 개의 내각의 합은 180°예요.'], [S + 180, '다시 계산해 보세요.']], { pad: 180 })
      };
    },
    verify: (s) => { const M = inO.model(s); let tot = 0; for (let i = 0; i < M.n; i++) tot += intAng(M.V, i); return { ans: tot, model: M.S }; }
  };

  /* ====================================================================== 2. 오목다각형 */
  const XMIN = -0.5;
  function concaveGeom(n, f) {
    const V = regPoly(n, 1, 0), xl = cos(360 / n), x = XMIN + f * (1 - XMIN);
    V[0] = pt(x, 0);
    // 안쪽 각: 방향을 정해 합이 180(n−2)가 되게
    const S = 180 * (n - 2), raw = (sg) => V.map((p, i) => { const u = V[(i + n - 1) % n], w = V[(i + 1) % n], a = sub(p, u), c = sub(w, p); const turn = Math.atan2(cross(a, c), a.x * c.x + a.y * c.y) / DEG; return 180 - sg * turn; });
    let ints = raw(1); if (Math.abs(ints.reduce((p, q) => p + q, 0) - S) > 1e-6) ints = raw(-1);
    return { V, x, xl, ints, fc: (xl - XMIN) / (1 - XMIN), concave: ints[0] > 180 + 1e-9 };
  }
  const concave = {
    id: 'p3-concave', title: '오목다각형의 각', short: '오목다각형',
    question: '볼록하던 다각형의 꼭짓점 하나를 안쪽으로 밀어 오목하게 만들면 내각의 합은 달라질까?',
    ctl: ['pgCf'],
    presets: () => [4, 5, 6].map((k, i) => ({ group: i === 0 ? '다각형' : '', label: `${k}각형`, apply: (s) => { s.pgCn = k; }, on: (s) => s.pgCn === k })),
    init: (s) => { s.pgCn = 4; s.pgCf = 0.14; },
    reroll: (s) => { const g = concaveGeom(s.pgCn, 1); s.pgCf = 0.08 + Math.random() * 0.6 * g.fc; },
    model: (s) => {
      const n = [4, 5, 6].includes(s.pgCn) ? s.pgCn : 4, f = clamp(+s.pgCf, 0, 1), g = concaveGeom(n, f);
      const fp = Math.min(f, g.fc * 0.78), gp = concaveGeom(n, fp), S = 180 * (n - 2);
      const mk = (q) => { const iv = lr(q.ints, S); return { iv, x: 360 - iv[0], others: iv.slice(1).reduce((a, c) => a + c, 0) }; };
      return { n, f, g, gp, S, ...mk(g), p: mk(gp) };
    },
    draw(b, s, M, C) {
      const n = M.n, gg = C.problem ? M.gp : M.g, iv = C.problem ? M.p.iv : M.iv, x = C.problem ? M.p.x : M.x, V = gg.V, cen = pt(0, 0.0);
      fit(b, { x0: -1.05, x1: 1.05, y0: -1.05, y1: 1.05 }, { t: 36, b: 92, l: 48, r: 44 });
      const concaveNow = gg.concave, st = C.step;
      fillPoly(b, V, 'sky', 0.1);
      // 보조선: 오목한 꼭짓점 P(=V0)에서 이웃하지 않는 꼭짓점으로 (n−3개)
      const showFan = !C.problem && (st >= 1);
      if (showFan) for (let j = 2; j <= n - 2; j++) line(b, V[0], V[j], 'green', st >= 1 && st < 99 ? 3.6 : 2.6, { dash: st < 99 ? undefined : [7, 6] });
      poly(b, V, 'ink', 3.4);
      V.forEach((p, i) => {
        const nm = i === 0 ? 'P' : LET[i - 1];
        const u = V[(i + n - 1) % n], w = V[(i + 1) % n], isP = i === 0, big = iv[i] > 180;
        const given = !(C.problem && isP);
        const col = isP ? 'amber' : 'sky';
        ang(b, p, u, w, { color: isP ? 'rose' : 'sky', big: big, r: isP ? 28 : 26, label: given ? `${iv[i]}°` : '', size: 16, fa: 0.22, labelRot: isP && big ? 45 : 0 });
        b.point(p, { color: 'ink', r: 4.5 });
        void col; void nm;
      });
      // 오목한 꼭짓점의 바깥(움푹한) 각 x
      if (concaveNow && (C.full || st >= 3 || C.problem)) ang(b, V[0], V[n - 1], V[1], { color: 'amber', r: 40, label: C.problem ? 'x' : `x=${x}°`, size: 17, fa: 0.18, labelDist: 66 });
      if (C.txt) {
        V.forEach((p, i) => { const q = V[(i + n - 1) % n]; void q; tagOut(b, p, i === 0 ? pt(-5, 0) : cen, i === 0 ? 'P' : LET[i - 1], { size: 18, gap: 11 }); });
        if (!C.problem && !C.thumb && !C.review) b.handle('P', V[0], { color: 'amber', r: 8, ariaLabel: '꼭짓점 P 가로로 끌기', drag: (w) => { s.pgCf = clamp((w.x - XMIN) / (1 - XMIN), 0, 1); } });
        else b.point(V[0], { color: 'amber', r: 6.5 });
        const yb = 1.05;
        let r1, r2 = '', c1 = 'sky', c2 = 'amber';
        if (C.problem) { r1 = `내각의 합 = 180°×(${n}−2) = ${M.S}°`; r2 = ''; }
        else if (st === 1) { r1 = `P에서 대각선 ${n - 3}개 → 삼각형 ${n - 2}개`; c1 = 'green'; }
        else if (st === 2) { r1 = `내각의 합 = 180°×(${n}−2) = ${M.S}°`; }
        else if (concaveNow) { r1 = `안쪽 각 ${iv[0]}° (180° 넘어요)`; r2 = `x = 360° − ${iv[0]}° = ${x}°`; }
        else { r1 = `볼록: 안쪽 각 ${iv[0]}° < 180°`; r2 = `내각의 합 = ${M.S}°`; c2 = 'sky'; }
        if (!C.problem && st >= 99 && concaveNow) r1 = `내각의 합 = 180°×(${n}−2) = ${M.S}°  ·  P의 안쪽 각 ${iv[0]}°`;
        T(b, pt(0, yb), r1, { dy: 44, size: b.W < 560 ? 15 : 17, color: c1 });
        T(b, pt(0, yb), r2, { dy: 72, size: 17, color: c2 });
      }
    },
    steps: (M) => {
      const p = M.p, n = M.n;
      return [
        `오목한 꼭짓점 P에서 이웃하지 않는 꼭짓점으로 대각선(보조선)을 그어요. ${n}각형이 삼각형 ${n - 2}개로 나뉘어요.`,
        `삼각형 ${n - 2}개의 내각의 합이므로 ${n}각형의 내각의 합은 180°×(${n}−2)=${M.S}°예요. P의 안쪽 각(180°보다 큰 각)도 포함해요.`,
        `P의 안쪽 각 = ${M.S}° − (나머지 내각의 합 ${p.others}°) = ${p.iv[0]}° 이므로 x = 360° − ${p.iv[0]}° = ${p.x}°`
      ];
    },
    view: (M) => ({
      guide: '<b>노란 점 P</b>를 가로로 끌어 보세요. 왼쪽으로 밀면 P의 안쪽 각이 <b>180°를 넘는 오목다각형</b>이 돼요. 그래도 내각의 합은 180°×(n−2) 그대로예요.',
      readouts: [
        rd('내각의 합', `${M.S}°`, 'sky', `180° × (${M.n} − 2)`), rd('P의 안쪽 각', `${M.iv[0]}°`, M.g.concave ? 'rose' : 'sky', M.g.concave ? '180°보다 커요 (오목)' : '180°보다 작아요 (볼록)'),
        rd('나머지 내각의 합', `${M.others}°`, 'sky'), rd('x = 360° − P의 안쪽 각', M.g.concave ? `${M.x}°` : '오목일 때만', 'amber', null, null, true)
      ],
      status: M.g.concave ? { tone: 'warn', text: `오목다각형: P의 안쪽 각 ${M.iv[0]}°` } : { tone: 'ok', text: '볼록다각형: 모든 내각이 180°보다 작아요' },
      formula: `<p>(내각의 합) $=180^{\\circ}\\times(${M.n}-2)=${M.S}^{\\circ}$</p><p>$x=360^{\\circ}-(${M.S}^{\\circ}-${M.others}^{\\circ})=${M.x}^{\\circ}$</p>`,
      rule: '오목다각형도 내각의 합은 180°×(n−2). 안쪽 각이 180°보다 큰 꼭짓점도 내각이에요.',
      notes: notes('오목사각형에서 x는 나머지 세 내각의 합과 같아요. (x = ∠A+∠B+∠C)', '내각 P는 <b>안쪽</b>에서 재요. x는 움푹 들어간 쪽(바깥)의 각이라 360°에서 뺀 값이에요.')
    }),
    prob: (M) => {
      const { n, p } = M, S = M.S, nm = (i) => (i === 0 ? 'P' : LET[i - 1]);
      const given = p.iv.slice(1).map((v, i) => `∠${LET[i]}=${v}°`).join(', ');
      return {
        tag: '오목다각형에서 각의 크기', key: `n${n}f${M.f.toFixed(2)}`,
        stem: `그림과 같이 꼭짓점 P가 안쪽으로 들어간 오목${n}각형에서 ${given}일 때, P에서 움푹 들어간 쪽의 각 $x$의 크기는?`,
        choices: mkChoices(p.x, [[360 - p.x, 'P의 안쪽 각을 구했어요. 구하는 것은 움푹한 쪽의 각 x예요.'], [p.others, '나머지 내각의 합이에요. 오각형 이상은 180°×(n−4)를 더 빼야 해요.'], [180 - p.x > 0 ? 180 - p.x : p.x + 20, '다시 계산해 보세요.'], [S - p.others, '내각의 합에서 나머지를 뺀 안쪽 각이에요.'], [p.x + 20, '다시 계산해 보세요.']], { pad: 15, valid: (v) => v > 0 && v < 360 })
      };
    },
    verify: (s) => { const M = concave.model(s); const g = M.gp, V = g.V, n = M.n; const raw = angBetween(V[0], V[n - 1], V[1]); const sm = g.ints.reduce((a, c) => a + c, 0); return { ans: raw, model: M.p.x, tol: 1.0001, extra: [[sm, M.S], [g.concave ? 1 : 0, 1]] }; }
  };

  /* ====================================================================== 3. 외각의 합 360° */
  const WTS = [1, 1.3, 0.85, 1.15, 0.9, 1.25, 0.8, 1.1, 1, 0.95, 1.2, 0.85];
  function extList(n) { const w = WTS.slice(0, n), sw = w.reduce((a, c) => a + c, 0); return lr(w.map((v) => (360 * v) / sw), 360); }
  const ext360 = {
    id: 'p3-ext360', title: '다각형의 외각의 합', short: '외각의 합 360°',
    question: '다각형의 외각을 모두 더하면 몇 도일까? 다각형을 한 점으로 줄이면 외각은 어떻게 모일까?',
    ctl: ['pgXn', 'pgXt'], anim: { key: 'pgXt', dur: 6, label: '다각형 줄이기' },
    stepT: (n) => [0, 0, 1, 1][Math.min(3, n)],
    init: (s) => { s.pgXn = 6; s.pgXt = 0; },
    reroll: (s) => { s.pgXn = pick([5, 6, 7, 8, 9, 10], s.pgXn); s.pgXt = 0; },
    model: (s) => { const n = clamp(Math.round(s.pgXn), 3, 12), eps = extList(n), g = convexFromExt(eps); return { n, eps, V: g.V, minL: g.minL }; },
    draw(b, s, M, C) {
      const { n, eps, V } = M, th = (() => { const t = [0]; for (let i = 1; i < n; i++) t[i] = t[i - 1] + eps[i]; return t; })();
      fit(b, { x0: -1.1, x1: 1.1, y0: -1.1, y1: 1.1 }, { t: 40, b: 90, l: 50, r: 50 });
      const t = C.problem ? 0 : C.t, f = 1 - 0.97 * t, G0 = pt(0, 0), W = V.map((p) => lerp(G0, p, f));
      const showN = n <= 8, k = b.k || 60, rpx = 34 + 74 * G.ease(t), labelOn = !C.problem;
      fillPoly(b, W, 'sky', 0.08 * (1 - t));
      // 외각: 변을 늘인 선(점선) + 부채꼴
      for (let i = 0; i < n; i++) {
        const p = W[i], aIn = th[(i + n - 1) % n], aOut = i === 0 ? th[0] + 360 : th[i];
        const a0 = aIn, a1 = i === 0 ? 360 + th[0] : aOut; // 늘인 변 방향 → 다음 변 방향 (시계 방향으로 ε)
        const a1c = a0 + eps[i];
        b.arc(p, rpx / k, a0 * DEG, a1c * DEG, { sector: true, fill: 'rose', fillAlpha: i % 2 ? 0.34 : 0.5, color: 'rose', width: 2 });
        if (t < 0.6) b.path([p, polar(p, 44 / k, a0)], { color: 'rose', width: 2, dash: [5, 4] });
        void a1; void a1c;
        if (C.txt && showN && labelOn && t < 0.95) {
          const am = a0 + eps[i] / 2;
          T(b, p, `${eps[i]}°`, { dx: cos(am) * (rpx + 20), dy: sin(am) * (rpx + 20), color: 'rose', size: 15 });
        }
      }
      if (f > 0.04) poly(b, W, 'ink', 3.4 * Math.max(0.5, f));
      W.forEach((p, i) => { if (f > 0.08) { b.point(p, { color: 'ink', r: 4.5 }); } });
      if (!C.txt) return;
      if (f > 0.35) W.forEach((p, i) => tagOut(b, p, G0, LET[i], { size: n > 9 ? 14 : 16, gap: rpx * 0.55 + 12, color: 'ink', alpha: 0.9 }));
      if (t >= 0.95) T(b, G0, '360°', { size: 22, color: 'amber' });
      const yb = 1.1;
      let r1, r2 = '', c1 = 'rose';
      if (C.problem) r1 = '다각형의 외각의 크기의 합은?';
      else if (C.review && C.step === 1) r1 = `꼭짓점마다 외각이 하나씩 있어요 (${n}개)`;
      else if (t < 0.95) r1 = n <= 6 ? `외각의 합 = ${eps.join('° + ')}° = 360°` : `외각 ${n}개의 합 = ${eps.reduce((a, c) => a + c, 0)}°`;
      else { r1 = '한 점에 모인 외각 = 한 바퀴'; r2 = `${n}개의 외각의 합 = 360°`; c1 = 'amber'; }
      T(b, pt(0, yb), r1, { dy: 44, size: b.W < 560 ? 15 : 17, color: c1 });
      T(b, pt(0, yb), r2, { dy: 72, size: 17, color: 'amber' });
    },
    steps: (M) => [
      `다각형의 꼭짓점마다 한 변을 늘여 외각을 하나씩 그려요. 외각은 모두 ${M.n}개예요.`,
      `다각형을 한 점으로 줄이면 ${M.n}개의 외각이 한 점에 모여 겹치지 않고 빈틈없이 한 바퀴를 채워요.`,
      `그러므로 외각의 합은 360°예요. (${M.n}각형이 아무리 달라져도 늘 360°)`
    ],
    view: (M) => ({
      guide: '막대나 ▶로 <b>다각형을 한 점으로 줄여</b> 보세요. 꼭짓점마다 있던 <b>분홍 외각</b>이 한 점에 모여 <b>한 바퀴(360°)</b>를 이뤄요. 막대로 n을 바꿔 보세요.',
      readouts: [rd('꼭짓점의 수', `${M.n}개`, 'ink'), rd('외각의 개수', `${M.n}개`, 'rose'), rd('외각의 합', '360°', 'amber', 'n에 상관없이 늘 360°', null, true)],
      formula: `<p>(외각의 합) $=360^{\\circ}$ (꼭짓점의 수와 상관없음)</p><p>${M.eps.map((e) => `$${e}^{\\circ}$`).join(' + ')} $=360^{\\circ}$</p>`,
      rule: '다각형의 외각의 크기의 합은 항상 360°',
      notes: notes('한 꼭짓점에서 내각과 외각을 더하면 180°예요. 외각은 한 꼭짓점에 <b>하나만</b> 생각해요.', '내각의 합은 n에 따라 달라지지만(180°×(n−2)) 외각의 합은 <b>항상 360°</b>예요.')
    }),
    prob: (M) => {
      const { n } = M, S = 180 * (n - 2);
      return {
        tag: '다각형의 외각의 합', key: `n${n}`,
        stem: `${n}각형의 외각의 크기의 합은?`,
        choices: mkChoices(360, [[S, '내각의 합이에요. 외각의 합은 n에 상관없이 일정해요.'], [180 * n, '삼각형 n개의 내각의 합이에요.'], [180, '다시 생각해 보세요.'], [720, '다시 생각해 보세요.'], [540, '오각형의 내각의 합이에요.'], [90, '다시 생각해 보세요.']], { pad: 90 })
      };
    },
    verify: (s) => { const M = ext360.model(s); let tot = 0; for (let i = 0; i < M.n; i++) tot += 180 - intAng(M.V, i); return { ans: tot, model: 360, extra: [[M.minL > 0.15 ? 1 : 0, 1], [M.eps.reduce((a, c) => a + c, 0), 360]] }; }
  };

  /* ====================================================================== 4·5. 외각으로 바꿔 구하기 (오각형) */
  function pentDraw(b, M, C, given, kind) {
    // given[i] : {kind:'int'|'ext', v} (i=0..3), x 는 꼭짓점 E(i=4)
    const { V, eps, ints } = M;
    const th = [0]; for (let i = 1; i < 5; i++) th[i] = th[i - 1] + eps[i];
    fit(b, { x0: -1.05, x1: 1.05, y0: -1.05, y1: 1.05 }, { t: 40, b: 124, l: 52, r: 52 });
    const cen = pt(0, 0), st = C.step;
    fillPoly(b, V, 'sky', 0.1);
    poly(b, V, 'ink', 3.4);
    const showAllExt = !C.problem && (C.full || st >= 1);
    const k = b.k || 60;
    for (let i = 0; i < 5; i++) {
      const p = V[i], u = V[(i + 4) % 5], w = V[(i + 1) % 5], g = i < 4 ? given[i] : { kind: 'int' };
      const isX = i === 4;
      const showInt = g.kind === 'int' ? true : (C.full || st >= 1) && !C.problem;
      const showExt = g.kind === 'ext' ? true : showAllExt && !isX ? true : (isX && (C.full || st >= 3) && !C.problem);
      if (showInt) {
        const lab = isX ? (C.problem ? 'x' : `x=${ints[i]}°`) : `${ints[i]}°`;
        ang(b, p, u, w, { color: isX ? 'amber' : 'sky', r: 30, label: lab, size: 16, fa: isX ? 0.28 : 0.22 });
      }
      if (showExt) {
        const a0 = th[(i + 4) % 5];
        const ext = pt(p.x + cos(a0) * 0.4, p.y + sin(a0) * 0.4);
        b.path([p, ext], { color: 'rose', width: 2, dash: [5, 4] });
        const faded = (g.kind === 'int' && !isX);
        ang(b, p, ext, w, { color: 'rose', r: 46, label: `${eps[i]}°`, size: 15, fa: faded ? 0.12 : 0.26, alpha: faded ? 0.8 : 1, labelDist: 76 });
      }
    }
    V.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); if (C.txt) tagOut(b, p, cen, LET[i], { size: 18, gap: 11 }); });
    return { yb: Math.max(...V.map((p) => p.y)) };
  }
  const penta = (id, title, short, q, kind) => {
    const isMix = kind === 'mix';
    const keys = isMix ? ['pgMa', 'pgMb', 'pgMc', 'pgMd'] : ['pgGa', 'pgGb', 'pgGc', 'pgGd'];
    const model = (s) => {
      const v = keys.map((kk, i) => clamp(Math.round(s[kk]), PARAMS[kk].min, PARAMS[kk].max));
      let eps, given;
      if (isMix) { eps = [180 - v[0], 180 - v[1], v[2], v[3], 0]; given = [{ kind: 'int', v: v[0] }, { kind: 'int', v: v[1] }, { kind: 'ext', v: v[2] }, { kind: 'ext', v: v[3] }]; }
      else { eps = v.map((a) => 180 - a).concat([0]); given = v.map((a) => ({ kind: 'int', v: a })); }
      eps[4] = 360 - eps[0] - eps[1] - eps[2] - eps[3];
      const ints = eps.map((e) => 180 - e), g = convexFromExt(eps);
      return { v, eps, ints, given, x: ints[4], ex: eps[4], V: g.V, minL: g.minL, sum4: eps[0] + eps[1] + eps[2] + eps[3] };
    };
    return {
      id, title, short, question: q,
      ctl: keys,
      init: (s) => { keys.forEach((k) => { s[k] = PARAMS[k].value; }); },
      reroll: (s) => { keys.forEach((k) => { s[k] = rint(PARAMS[k].min, PARAMS[k].max); }); },
      model,
      draw(b, s, M, C) {
        const r = pentDraw(b, M, C, M.given, kind);
        if (!C.txt) return;
        const st = C.step, yb = r.yb;
        let r1, r2 = '', c1 = 'sky';
        const sumE = M.sum4;
        if (C.problem) r1 = '∠E = x 의 크기는?';
        else if (st === 1) { r1 = '내각 → 외각 : 180° − 내각'; c1 = 'rose'; }
        else if (st === 2) { r1 = `외각 5개의 합 = 360°`; r2 = `${sumE}° + ${M.ex}° = 360°`; c1 = 'rose'; }
        else if (st === 3) { r1 = `E의 외각 = 360° − ${sumE}° = ${M.ex}°`; r2 = `x = 180° − ${M.ex}° = ${M.x}°`; c1 = 'rose'; }
        else { r1 = `외각의 합: ${sumE}° + ${M.ex}° = 360°`; r2 = `x = 180° − ${M.ex}° = ${M.x}°`; c1 = 'rose'; }
        T(b, pt(0, yb), r1, { dy: 74, size: b.W < 560 ? 16 : 17, color: c1 });
        T(b, pt(0, yb), r2, { dy: 102, size: 17, color: 'amber' });
      },
      steps: (M) => {
        const f = M.given.map((g, i) => (g.kind === 'int' ? `∠${LET[i]}=${g.v}° → 외각 ${M.eps[i]}°` : `${LET[i]}의 외각 ${g.v}°`));
        return [
          `주어진 각을 모두 외각으로 바꿔요. (외각) = 180° − (내각): ${f.join(', ')}`,
          `다각형의 외각의 합은 360°이므로 ${M.sum4}° + (E의 외각) = 360°`,
          `E의 외각 = 360° − ${M.sum4}° = ${M.ex}° 이므로 x = 180° − ${M.ex}° = ${M.x}°`
        ];
      },
      view: (M) => ({
        guide: isMix ? '<b>A, B는 내각, C, D는 외각</b>으로 주어졌어요. 막대로 값을 바꿔 보세요. 내각은 <b>180°−내각</b>으로 외각으로 바꾸면 외각의 합 <b>360°</b>로 풀 수 있어요.' : '막대로 ∠A, ∠B, ∠C, ∠D를 바꿔 보세요. 내각을 <b>외각(180°−내각)</b>으로 바꾸고 외각의 합 <b>360°</b>에서 E의 외각을 구한 뒤 x를 구해요.',
        readouts: [rd('주어진 네 각의 외각의 합', `${M.sum4}°`, 'rose'), rd('E의 외각', `${M.ex}°`, 'rose', '360° − 위의 값'), rd('x = ∠E', `${M.x}°`, 'amber', '180° − E의 외각', null, true)],
        formula: `<p>$x=180^{\\circ}-(360^{\\circ}-${M.sum4}^{\\circ})=${M.x}^{\\circ}$</p><p>(외각) $=180^{\\circ}-$ (내각)</p>`,
        rule: '내각을 외각(180° − 내각)으로 바꾸어 외각의 합 360°로 구한다',
        notes: notes('외각을 구할 때 180°에서 <b>내각을 빼요</b>. 외각이 주어졌으면 그대로 써요.', isMix ? '내각과 외각이 섞여 있으면 <b>모두 외각으로</b> 통일한 뒤 더해요.' : '내각의 합 540°로도 풀 수 있지만, 외각의 합 360°를 쓰면 더 간단해요.')
      }),
      prob: (M) => {
        const { x, ex, sum4 } = M;
        const given = M.given.map((g, i) => (g.kind === 'int' ? `∠${LET[i]}=${g.v}°` : `${LET[i]}의 외각 ${g.v}°`)).join(', ');
        return {
          tag: isMix ? '내각과 외각이 섞여 주어진 문제' : '외각의 합으로 구하는 문제', key: M.v.join(','),
          stem: `그림과 같은 오각형 ABCDE에서 ${given}일 때, ∠E=$x$의 크기는?`,
          choices: mkChoices(x, [[ex, '외각을 구했어요. x는 외각이 아니라 내각 ∠E예요.'], [sum4, '외각의 합이에요. 360°에서 빼야 해요.'], [540 - M.ints.slice(0, 4).reduce((a, c) => a + c, 0) + 10, '다시 계산해 보세요.'], [360 - sum4 + 20, '다시 계산해 보세요.'], [x + 10, '다시 계산해 보세요.'], [x - 15, '다시 계산해 보세요.']], { pad: 8, valid: (v) => v > 0 && v < 180 })
        };
      },
      verify: (s) => { const M = model(s); const V = M.V; return { ans: intAng(V, 4), model: M.x, extra: [[M.minL > 0.15 ? 1 : 0, 1], [intAng(V, 0) + intAng(V, 1) + intAng(V, 2) + intAng(V, 3) + intAng(V, 4), 540]] }; }
    };
  };
  const given = penta('p3-given', '외각으로 바꿔 구하기', '외각으로 바꿔 구하기', '내각이 몇 개 주어진 다각형에서 나머지 한 각은 외각의 합 360°를 이용하면 어떻게 구할까?', 'int');
  const mixed = penta('p3-mixed', '내각과 외각이 섞인 문제', '내각·외각 섞인 문제', '내각과 외각이 섞여 주어진 다각형에서 나머지 한 각을 구하려면 무엇부터 해야 할까?', 'mix');

  G.register(30, 't3', '③ 다각형의 내각과 외각의 합', '내각과 외각의 합', PARAMS, [inO, concave, ext360, given, mixed]);
})();
