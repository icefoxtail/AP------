/* ==========================================================================
   공통수학 · 이차함수 — 옛 탐구관 4~6 의 정리·문제 탭 (15장면)
   4: 근의 분리(f(p)의 부호·축·판별식)   5: 항상 성립하는 부등식 · 제한된 범위   6: 함정 연구소
   그래프에서 "근의 위치"를 읽는 것이 핵심입니다: 포물선이 x축과 만나는 점, 대칭축, 기준점에서의 높이 f(p).
   ========================================================================== */
(function () {
  'use strict';
  const O = window.APL_CQ_OLD;
  if (!O || !window.APLab) return;
  const { T, frTex, par, polyTex, linTex, sgn, varier, dot, lbl, autoBox, nameOn } = O.H;
  const add = O.add;
  const INF = Infinity;

  /* ---------- 식 글자 ---------- */
  const lin = (a, b) => polyTex(0, a, b, 'k'); // a k + b
  // 경계는 정수 계수의 일차식·이차식에서 얻은 정확한 유리수입니다.
  // 1/2 단위로 반올림하면 11/4 같은 끝점과 합성부등식의 답이 달라집니다.
  const exactT = (x) => {
    if (!Number.isFinite(x)) return x < 0 ? '-\\infty' : '\\infty';
    for (let d = 1; d <= 10000; d++) {
      const n = Math.round(x * d);
      if (Math.abs(x - n / d) < 1e-10) return frTex(n, d);
    }
    return '\\approx ' + x.toFixed(6);
  };
  const exactL = (x) => { for (let d = 1; d <= 10000; d++) { const n = Math.round(x * d); if (Math.abs(x - n / d) < 1e-10) return lbl(d === 1 ? n : n + '/' + d); } return '≈ ' + x.toFixed(4); };
  const kfac = (r) => (r === 0 ? 'k' : r > 0 ? '(k-' + r + ')' : '(k+' + -r + ')');
  // x²+(uk+v)x+wk+z
  const fam = (u, v, w, z) => {
    const bx = v === 0 ? (u < 0 ? '-' : '+') + (Math.abs(u) === 1 ? '' : Math.abs(u)) + 'kx' : '+(' + lin(u, v) + ')x';
    const ct = w === 0 ? sgn(z) : (lin(w, z)[0] === '-' ? '' : '+') + lin(w, z);
    return 'x^2' + bx + ct;
  };
  const famVal = (c, k, x) => x * x + (c.u * k + c.v) * x + c.w * k + c.z;
  const Db = (c, k) => { const b = c.u * k + c.v, cc = c.w * k + c.z; return b * b - 4 * cc; };
  const droots = (c) => { const a = c.u * c.u, b = 2 * c.u * c.v - 4 * c.w, d = c.v * c.v - 4 * c.z, s = Math.sqrt(b * b - 4 * a * d); return [(-b - s) / (2 * a), (-b + s) / (2 * a)]; };
  const dfac = (c) => `${c.u * c.u === 1 ? '' : c.u * c.u}${kfac(c.r1)}${kfac(c.r2)}`;
  const kInts = (pred) => { const o = []; for (let k = -60; k <= 60; k++) if (pred(k)) o.push(k); return o; };
  // 일차부등식 A k + B (>|<) 0 의 구간
  const linIv = (A, B, gt) => { if (A === 0) return (gt ? B > 0 : B < 0) ? [[-INF, INF]] : []; const r = -B / A; return (A > 0) === gt ? [[r, INF]] : [[-INF, r]]; };
  const inter = (X, Y) => { const o = []; X.forEach((p) => Y.forEach((q) => { const a = Math.max(p[0], q[0]), b = Math.min(p[1], q[1]); if (a < b) o.push([a, b]); })); return o; };
  const ivTex = (iv) => !iv.length ? '\\varnothing' : iv.map(([a, b]) => (a === -INF && b === INF ? 'k\\in\\mathbb{R}' : a === -INF ? 'k\\lt ' + exactT(b) : b === INF ? 'k\\gt ' + exactT(a) : exactT(a) + '\\lt k\\lt ' + exactT(b))).join('\\ \\text{또는}\\ ');
  const askOf = (S, ask) => (ask === 'C' ? S.length : ask === 'S' ? S.reduce((p, q) => p + q, 0) : ask === 'M' ? Math.max(...S) : Math.min(...S));
  const askName = { C: '개수', S: '합', M: '최댓값', m: '최솟값' };
  const cycle = (pool, asks) => pool.flatMap((c) => asks.map((ask) => ({ ...c, ask })));
  const sameKey = (x, y) => x.ask === y.ask && x.u === y.u && x.v === y.v && x.w === y.w && x.z === y.z;
  // 표본 포물선 y=famVal(c,ks,x) 의 상자
  function famBox(c, ks, xs, extraY) {
    const b = c.u * ks + c.v, cc = c.w * ks + c.z, d = b * b - 4 * cc;
    const xv = -b / 2, yv = famVal(c, ks, xv);
    const xl = [xv].concat(d >= 0 ? [(-b - Math.sqrt(d)) / 2, (-b + Math.sqrt(d)) / 2] : []).concat(xs);
    return autoBox(Math.min(...xl) - 2.6, Math.max(...xl) + 2.6, [yv, ...extraY], 1.4);
  }
  // 표본으로 그릴 k 를 고릅니다: 가능한 k 중 그림 상자가 가장 덜 길쭉한 것(핵심 그림이 무대를 크게 쓰도록)
  function bestKs(c, S, xs, ys) {
    let best = S[0], br = Infinity;
    S.slice(0, 40).forEach((k) => { const bx = famBox(c, k, xs, ys(k)); const r = (bx.y[1] - bx.y[0]) / (bx.x[1] - bx.x[0]); if (r < br - 1e-9) { br = r; best = k; } });
    return best;
  }
  const rootsOf = (c, k) => { const b = c.u * k + c.v, cc = c.w * k + c.z, d = b * b - 4 * cc; return d < 0 ? [] : d === 0 ? [-b / 2] : [(-b - Math.sqrt(d)) / 2, (-b + Math.sqrt(d)) / 2]; };
  const vline = (b, x, color) => b.vline(x, { color, width: 1.9, dash: [6, 5], alpha: 0.9 });
  const xlab = (b, box, x, text, color) => b.text([x, box.y[1] - 1.6], text, { color, size: 13, weight: 800, dx: x < 0 ? -6 : 6, align: x < 0 ? 'right' : 'left' });
  const kIneq = (u, v, p) => `-\\dfrac{${lin(u, v)}}{2}`; // 축의 식 글자

  /* ======================================================================
     4-A  sepBothGreater · 서로 다른 두 근이 모두 p 보다 크다 (판·축·함 3중 잠금)   [핵심]
     ====================================================================== */
  const P16 = cycle([
    { u: 2, v: -2, w: 3, z: 1, p: -1 }, { u: -2, v: -2, w: -1, z: 5, p: 0 }, { u: -1, v: -1, w: -2, z: 3, p: -1 }, { u: 2, v: 0, w: -3, z: 4, p: 2 },
    { u: 1, v: -3, w: 1, z: 5, p: 0 }, { u: -1, v: -2, w: -1, z: 6, p: 0 }, { u: 2, v: 0, w: 1, z: 6, p: 0 }
  ], ['C', 'M', 'm', 'S']);
  const var16 = varier(P16, (c, i) => {
    const S = kInts((k) => Db(c, k) > 0 && -(c.u * k + c.v) / 2 > c.p && famVal(c, k, c.p) > 0);
    const r = droots(c);
    const ivD = [[-INF, r[0]], [r[1], INF]], ivA = linIv(-c.u, -c.v - 2 * c.p, true), ivF = linIv(c.u * c.p + c.w, c.p * c.p + c.v * c.p + c.z, true);
    const iv = inter(inter(ivD, ivA), ivF);
    const ks = bestKs(c, S, [c.p], (k) => [famVal(c, k, c.p), 0]);
    return { ...c, key: 's16_' + i, S, r, ivD, ivA, ivF, iv, ks, val: askOf(S, c.ask) };
  }, sameKey);
  add('sepBothGreater', {
    fast: '핵심', vary: var16,
    tag: '25 매산고 기출 유형 · 2022학년도 6월 학평(부산) 유형 (두 근이 모두 p보다 클 조건)', time: '목표 시간: 60초',
    text: (v) => `${T('x')}에 대한 이차방정식 ${T(fam(v.u, v.v, v.w, v.z) + '=0')}의 서로 다른 두 실근이 모두 ${T(v.p)}보다 크도록 하는 정수 ${T('k')}의 ${askName[v.ask]}을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `서로 다른 두 실근 ⇒ 포물선 ${T('y=f(x)')}가 ${T('x')}축과 두 점에서 만납니다(그림의 초록 점). 판별식 ${T('D\\gt0')} ⇒ ${T(ivTex(v.ivD))}.`,
      `두 근이 모두 ${T('x=' + v.p)}의 오른쪽이면 두 근의 한가운데인 <strong>대칭축</strong> ${T('x=' + kIneq(v.u, v.v))}도 ${T('x=' + v.p)}의 오른쪽(금색 점선)이어야 합니다 ⇒ ${T(ivTex(v.ivA))}.`,
      `기준선 ${T('x=' + v.p)}에서 포물선이 ${T('x')}축보다 <strong>위</strong>에 있어야 합니다(초록 점이 ${T('x')}축 위): ${T('f(' + v.p + ')\\gt0')} ⇒ ${T(ivTex(v.ivF))}. 세 조건의 공통 범위 ${T(ivTex(v.iv))}에서 정수 ${T('k=' + v.S.join(',\\ '))}이므로 ${askName[v.ask]}은 ${T(v.val)}.`
    ],
    quick: (v) => ({
      steps: `그림으로 두 근이 모두 ${T('x=' + v.p)} 오른쪽에 있을 조건을 읽으면 <strong>① ${T('D\\gt0')} (축과 두 점) ② 축이 ${T(v.p)}의 오른쪽 ③ ${T('f(' + v.p + ')\\gt0')} (기준선에서 ${T('x')}축 위)</strong> 세 가지입니다. ${T(ivTex(v.ivD))}, ${T(ivTex(v.ivA))}, ${T(ivTex(v.ivF))}의 공통 부분 ${T(ivTex(v.iv))}에서 정수는 ${T(v.S.join(',\\ '))} ⇒ ${askName[v.ask]} ${T(v.val)}.`,
      highlight: `💡 서술형 문장: "${T('f(x)=0')}의 두 근이 모두 ${T(v.p)}보다 크려면 ① ${T('D\\gt0')}, ② 축 ${T('x=-\\dfrac b2\\gt ' + v.p)}, ③ ${T('f(' + v.p + ')\\gt0')}이어야 한다."`
    }),
    std: (v) => ({
      steps: `두 근을 ${T('\\alpha,\\ \\beta')}라 놓고 ${T('(\\alpha-' + par(v.p) + ')+(\\beta-' + par(v.p) + ')\\gt0')}, ${T('(\\alpha-' + par(v.p) + ')(\\beta-' + par(v.p) + ')\\gt0')}, ${T('D\\gt0')}에 근과 계수의 관계를 대입해 ${T('k')}에 대한 부등식 세 개를 푼 뒤 공통 범위를 구합니다.`,
      warning: `⚠️ 조건 하나라도 빠뜨리면 틀립니다(특히 ${T('f(' + v.p + ')\\gt0')}). 세 조건이 그림의 어느 부분인지 보면 빠뜨리지 않습니다.`
    }),
    box: (v) => famBox(v, v.ks, [v.p], [famVal(v, v.ks, v.p), 0]),
    draw: (b, s, v, c) => {
      b.plot((x) => famVal(v, v.ks, x), { color: 'sky', width: 3.6, glow: true });
      vline(b, v.p, 'violet'); xlab(b, c.box, v.p, 'x = ' + lbl(v.p), 'violet');
      if (c.st(1)) rootsOf(v, v.ks).forEach((x) => b.point([x, 0], { color: 'green', r: 6 }));
      if (c.st(2)) { const xa = -(v.u * v.ks + v.v) / 2; b.vline(xa, { color: 'amber', width: 2, dash: [6, 5] }); b.text([xa, c.box.y[0] + 0.7], '축', { color: 'amber', size: 13, weight: 800, dx: 8, align: 'left' }); }
      if (c.st(3)) dot(b, [v.p, famVal(v, v.ks, v.p)], 'green', 'f(' + lbl(v.p) + ') > 0', 10, -12, { r: 6 });
    }
  });

  /* ======================================================================
     4-B  sepBetweenOneShot · 두 근 사이에 p 가 있다 ⟺ f(p)<0 하나   [핵심]
     ====================================================================== */
  const P17 = [
    { u: 1, v: 3, w: 1, z: -2, p: 1 }, { u: -1, v: 3, w: -3, z: -5, p: 2 }, { u: -2, v: -2, w: 1, z: 6, p: 2 }, { u: -2, v: -2, w: 1, z: 3, p: -1 },
    { u: -2, v: -2, w: 3, z: 2, p: 2 }, { u: -1, v: 0, w: -2, z: -2, p: -1 }, { u: -2, v: -2, w: 4, z: 1, p: 3 }, { u: -2, v: -2, w: 4, z: 3, p: -1 }
  ];
  const var17 = varier(P17, (c, i) => {
    const A = c.u * c.p + c.w, B = c.p * c.p + c.v * c.p + c.z, kb = -B / A;
    const dirGt = A < 0; // f(p)<0 ⟺ k > kb  (A<0)
    const val = dirGt ? Math.floor(kb) + 1 : Math.ceil(kb) - 1;
    const cand = []; for (let k = -12; k <= 12; k++) if (famVal(c, k, c.p) < 0) cand.push(k);
    const ks = bestKs(c, cand, [c.p], (k) => [famVal(c, k, c.p), 0]);
    return { ...c, key: 's17_' + i, A, B, kb, dirGt, val, ks };
  });
  add('sepBetweenOneShot', {
    fast: '핵심', vary: var17,
    tag: '24 매산고 기출 유형 · 2023학년도 3월 학평(서울) 유형 (두 근 사이에 놓이는 수)', time: '목표 시간: 40초',
    text: (v) => `${T('x')}에 대한 이차방정식 ${T(fam(v.u, v.v, v.w, v.z) + '=0')}의 두 실근 사이에 ${T(v.p)}가 있도록 하는 정수 ${T('k')}의 ${v.dirGt ? '최솟값' : '최댓값'}을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('x=' + v.p)}가 두 근 사이에 있다는 것은 포물선이 <strong>${T('x=' + v.p)}에서 ${T('x')}축 아래</strong>에 있다는 뜻입니다(그림에서 ${T('x=' + v.p)}의 점이 ${T('x')}축 아래). 그러면 ${T('x')}축과 반드시 두 점에서 만나므로 판별식은 따로 볼 필요가 없습니다.`,
      `${T('f(' + v.p + ')=' + lin(v.A, v.B) + '\\lt0')} ⇒ ${T('k' + (v.dirGt ? '\\gt ' : '\\lt ') + exactT(v.kb))}.`,
      `이를 만족하는 정수 ${T('k')}의 ${v.dirGt ? '최솟값은 ' : '최댓값은 '}${T(v.val)}.`
    ],
    quick: (v) => ({
      steps: `두 근 사이에 ${T(v.p)}가 있으면 ${T('x=' + v.p)}에서 그래프는 ${T('x')}축 <strong>아래</strong>입니다. 아래로 볼록한 포물선이 ${T('x')}축 아래의 점을 지나면 근이 두 개 있고 ${T(v.p)}는 그 사이입니다. 그래서 조건은 ${T('f(' + v.p + ')\\lt0')} 하나: ${T(lin(v.A, v.B) + '\\lt0')} ⇒ ${T('k' + (v.dirGt ? '\\gt ' : '\\lt ') + exactT(v.kb))}. 정수 ${T('k')}의 ${v.dirGt ? '최솟값' : '최댓값'} ${T(v.val)}.`,
      highlight: `💡 서술형 문장: "이차항의 계수가 양수이므로 두 근 사이에 ${T(v.p)}가 있을 필요충분조건은 ${T('f(' + v.p + ')\\lt0')}이다."`
    }),
    std: (v) => ({
      steps: `${T('D\\gt0')}과 ${T('\\alpha\\lt ' + v.p + '\\lt\\beta')}에 해당하는 조건(축, 양쪽 부호)을 모두 세운 뒤 공통 범위를 구합니다(판별식과 축을 따로 확인).`,
      warning: `⚠️ 이 경우는 ${T('f(' + v.p + ')\\lt0')} 하나면 충분합니다. 판별식·축까지 풀면 시간만 늘어납니다.`
    }),
    box: (v) => famBox(v, v.ks, [v.p], [famVal(v, v.ks, v.p), 0]),
    draw: (b, s, v, c) => {
      b.plot((x) => famVal(v, v.ks, x), { color: 'sky', width: 3.6, glow: true });
      vline(b, v.p, 'violet'); xlab(b, c.box, v.p, 'x = ' + lbl(v.p), 'violet');
      rootsOf(v, v.ks).forEach((x) => b.point([x, 0], { color: 'ink', r: 5, hollow: true }));
      if (c.st(1)) dot(b, [v.p, famVal(v, v.ks, v.p)], 'green', 'f(' + lbl(v.p) + ') < 0', 10, 20, { r: 6 });
      if (c.st(2)) b.seg([v.p, 0], [v.p, famVal(v, v.ks, v.p)], { color: 'green', width: 3.4 });
    }
  });

  /* ======================================================================
     4-C  sepInsideInterval · 두 근이 모두 (p, q) 사이 (4조건)   [핵심]
     ====================================================================== */
  const P18 = cycle([
    { u: -1, v: -3, w: 4, z: -3, p: 0, q: 4 }, { u: 1, v: 0, w: 1, z: 0, p: -1, q: 3 }, { u: -1, v: 1, w: 1, z: -1, p: 1, q: 5 }, { u: 1, v: -1, w: -2, z: -1, p: 2, q: 6 },
    { u: 1, v: -3, w: -4, z: -3, p: 0, q: 4 }, { u: -1, v: -3, w: 3, z: 1, p: -1, q: 3 }, { u: 1, v: -3, w: -1, z: 3, p: 1, q: 5 }
  ], ['C', 'S', 'M', 'm']);
  const var18 = varier(P18, (c, i) => {
    const S = kInts((k) => Db(c, k) > 0 && -(c.u * k + c.v) / 2 > c.p && -(c.u * k + c.v) / 2 < c.q && famVal(c, k, c.p) > 0 && famVal(c, k, c.q) > 0);
    const r = droots(c);
    const ivD = [[-INF, r[0]], [r[1], INF]], ivA = inter(linIv(-c.u, -c.v - 2 * c.p, true), linIv(-c.u, -c.v - 2 * c.q, false));
    const ivP = linIv(c.u * c.p + c.w, c.p * c.p + c.v * c.p + c.z, true), ivQ = linIv(c.u * c.q + c.w, c.q * c.q + c.v * c.q + c.z, true);
    const iv = inter(inter(inter(ivD, ivA), ivP), ivQ);
    return { ...c, key: 's18_' + i, S, r, ivD, ivA, ivP, ivQ, iv, ks: bestKs(c, S, [c.p, c.q], (k) => [famVal(c, k, c.p), famVal(c, k, c.q), 0]), val: askOf(S, c.ask) };
  }, sameKey);
  add('sepInsideInterval', {
    fast: '핵심', vary: var18,
    tag: '26 금당고 기출 유형 · 2021학년도 9월 학평(인천) 유형 (두 근이 한 구간 안에 있을 조건)', time: '목표 시간: 70초',
    text: (v) => `${T('x')}에 대한 이차방정식 ${T(fam(v.u, v.v, v.w, v.z) + '=0')}의 서로 다른 두 실근이 모두 구간 ${T('(' + v.p + ',\\ ' + v.q + ')')}에 있도록 하는 정수 ${T('k')}의 ${askName[v.ask]}을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `두 근이 모두 두 기준선 ${T('x=' + v.p)}, ${T('x=' + v.q)} 사이에 있도록 그림을 그립니다. 먼저 ${T('x')}축과 두 점에서 만나야 하므로 ${T('D\\gt0')} ⇒ ${T(ivTex(v.ivD))}.`,
      `대칭축이 두 기준선 사이에 있어야 합니다(금색 점선): ${T(v.p + '\\lt' + kIneq(v.u, v.v) + '\\lt ' + v.q)} ⇒ ${T(ivTex(v.ivA))}.`,
      `두 기준선에서 포물선이 모두 ${T('x')}축 위에 있어야 합니다(초록 점): ${T('f(' + v.p + ')\\gt0')} ⇒ ${T(ivTex(v.ivP))}, ${T('f(' + v.q + ')\\gt0')} ⇒ ${T(ivTex(v.ivQ))}. 네 조건의 공통 범위 ${T(ivTex(v.iv))}에서 정수 ${T('k=' + v.S.join(',\\ '))}이므로 ${askName[v.ask]}은 ${T(v.val)}.`
    ],
    quick: (v) => ({
      steps: `두 근이 구간 ${T('(' + v.p + ',\\ ' + v.q + ')')} 안에 들어가는 그림은 <strong>① ${T('D\\gt0')} ② ${T(v.p)} < 축 < ${T(v.q)} ③ ${T('f(' + v.p + ')\\gt0')} ④ ${T('f(' + v.q + ')\\gt0')}</strong> 네 가지 조건으로 읽힙니다. 공통 범위 ${T(ivTex(v.iv))}의 정수 ${T(v.S.join(',\\ '))} ⇒ ${askName[v.ask]} ${T(v.val)}.`,
      highlight: `💡 서술형 문장: "두 근이 모두 ${T('(' + v.p + ',\\ ' + v.q + ')')}에 있으려면 ${T('D\\gt0')}, ${T(v.p + '\\lt-\\dfrac b2\\lt ' + v.q)}, ${T('f(' + v.p + ')\\gt0')}, ${T('f(' + v.q + ')\\gt0')}이어야 한다."`
    }),
    std: (v) => ({
      steps: `두 근을 ${T('\\alpha,\\ \\beta')}라 놓고 ${T(v.p + '\\lt\\alpha\\lt\\beta\\lt ' + v.q)}를 ${T('(\\alpha-' + par(v.p) + ')(\\beta-' + par(v.p) + ')\\gt0')} 등의 근과 계수 관계로 옮겨 풉니다. 식이 길고 부등호 방향을 틀리기 쉽습니다.`,
      warning: `⚠️ 축의 조건을 빠뜨리면 두 근이 모두 구간의 한쪽 바깥에 있는 경우를 거르지 못합니다.`
    }),
    box: (v) => famBox(v, v.ks, [v.p, v.q], [famVal(v, v.ks, v.p), famVal(v, v.ks, v.q), 0]),
    draw: (b, s, v, c) => {
      b.poly([[v.p, -50], [v.q, -50], [v.q, 50], [v.p, 50]], { fill: 'green', fillAlpha: 0.08, color: null });
      b.plot((x) => famVal(v, v.ks, x), { color: 'sky', width: 3.6, glow: true });
      vline(b, v.p, 'violet'); xlab(b, c.box, v.p, 'x = ' + lbl(v.p), 'violet');
      vline(b, v.q, 'violet'); xlab(b, c.box, v.q, 'x = ' + lbl(v.q), 'violet');
      if (c.st(1)) rootsOf(v, v.ks).forEach((x) => b.point([x, 0], { color: 'green', r: 6 }));
      if (c.st(2)) b.vline(-(v.u * v.ks + v.v) / 2, { color: 'amber', width: 2, dash: [6, 5] });
      if (c.st(3)) {
        [v.p, v.q].forEach((x) => b.point([x, famVal(v, v.ks, x)], { color: 'green', r: 6 }));
        b.text([v.p, famVal(v, v.ks, v.p)], 'f(p)>0', { color: 'green', size: 13, weight: 800, dx: -8, dy: -12, align: 'right' });
        b.text([v.q, famVal(v, v.ks, v.q)], 'f(q)>0', { color: 'green', size: 13, weight: 800, dx: 8, dy: -12, align: 'left' });
      }
    }
  });

  /* ======================================================================
     4-D  sepOneRootInInterval · 구간 (p,q) 에 오직 한 실근: f(p)f(q)<0   [핵심]
     ====================================================================== */
  const P19 = cycle([
    { u: 2, v: 3, w: 0, z: 1, p: 2, q: 6 }, { u: -2, v: -1, w: -2, z: -1, p: 0, q: 4 }, { u: -1, v: 3, w: -3, z: 1, p: 2, q: 4 }, { u: -2, v: 1, w: -4, z: 2, p: 1, q: 5 },
    { u: -1, v: 2, w: -4, z: 1, p: 0, q: 3 }, { u: -1, v: -2, w: -1, z: -2, p: 2, q: 5 }, { u: -1, v: 3, w: -3, z: 1, p: -1, q: 2 }
  ], ['C', 'S']);
  const var19 = varier(P19, (c, i) => {
    const S = kInts((k) => famVal(c, k, c.p) * famVal(c, k, c.q) < 0);
    const Ap = c.u * c.p + c.w, Bp = c.p * c.p + c.v * c.p + c.z, Aq = c.u * c.q + c.w, Bq = c.q * c.q + c.v * c.q + c.z;
    const kp = -Bp / Ap, kq = -Bq / Aq;
    const doubles = droots(c).filter(Number.isInteger).map(k => ({ k, x: -(c.u * k + c.v) / 2 }));
    return { ...c, key: 's19_' + i, S, Ap, Bp, Aq, Bq, kp, kq, doubles, lo: Math.min(kp, kq), hi: Math.max(kp, kq), ks: bestKs(c, S, [c.p, c.q], (k) => [famVal(c, k, c.p), famVal(c, k, c.q), 0]), val: c.ask === 'C' ? S.length : S.reduce((x, y) => x + y, 0) };
  }, sameKey);
  const oneRootBoundaryNote = (v) => `끝점이 근인 두 경계는 모두 정수가 아닙니다. ${v.doubles.length ? '중근이 생기는 정수 k는 ' + v.doubles.map(d => T('k=' + d.k + ', x=' + d.x)).join(', ') + '이며 그 중근은 모두 주어진 열린구간 밖입니다.' : '판별식 D=0을 만드는 정수 k도 없습니다.'}`;
  add('sepOneRootInInterval', {
    fast: '핵심', vary: var19,
    tag: '25 제일고 기출 유형 · 2024학년도 3월 학평(서울) 유형 (구간에 오직 한 근)', time: '목표 시간: 60초',
    text: (v) => `${T('x')}에 대한 이차방정식 ${T(fam(v.u, v.v, v.w, v.z) + '=0')}이 구간 ${T('(' + v.p + ',\\ ' + v.q + ')')}에서 오직 한 개의 실근을 갖도록 하는 정수 ${T('k')}의 ${v.ask === 'C' ? '개수' : '합'}을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `구간 ${T('(' + v.p + ',\\ ' + v.q + ')')}에서 포물선이 ${T('x')}축을 정확히 한 번 가로지르는 경우에는 ${T('x=' + v.p)}와 ${T('x=' + v.q)}에서의 포물선의 높이가 <strong>서로 반대쪽(한쪽은 ${T('x')}축 위, 한쪽은 아래)</strong>이면 충분합니다 ⇒ ${T('f(' + v.p + ')f(' + v.q + ')\\lt0')}.`,
      `${T('f(' + v.p + ')=' + lin(v.Ap, v.Bp) + '')}, ${T('f(' + v.q + ')=' + lin(v.Aq, v.Bq) + '')}이고 각각 0이 되는 ${T('k')}는 ${T(exactT(v.kp))}, ${T(exactT(v.kq))}. 두 값 사이에서 두 높이의 부호가 반대가 됩니다 ⇒ ${T(exactT(v.lo) + '\\lt k\\lt ' + exactT(v.hi))}.`,
      `${oneRootBoundaryNote(v)} 정수 ${T('k=' + v.S.join(',\\ '))} ⇒ ${v.ask === 'C' ? '개수 ' : '합 '}${T(v.val)}.`
    ],
    quick: (v) => ({
      steps: `구간의 두 끝 ${T('x=' + v.p)}, ${T('x=' + v.q)}에서 높이가 반대쪽이면 그 사이에서 포물선이 ${T('x')}축을 정확히 한 번 지납니다. ${T('f(' + v.p + ')f(' + v.q + ')\\lt0')} ⇒ ${T('(' + lin(v.Ap, v.Bp) + ')(' + lin(v.Aq, v.Bq) + ')\\lt0')} ⇒ ${T(exactT(v.lo) + '\\lt k\\lt ' + exactT(v.hi))}. ${oneRootBoundaryNote(v)} 정수 ${T(v.S.join(',\\ '))}.`,
      highlight: `💡 서술형 문장: "연속인 이차함수가 ${T('x=' + v.p)}와 ${T('x=' + v.q)}에서 부호가 다르면 사이에 근이 하나 있다."`
    }),
    std: (v) => ({
      steps: `${T('D\\ge0')}과 두 근의 위치(한 근만 구간 안)를 경우로 나누어 따져야 하고, 끝점이 근인 경우와 중근인 경우도 각각 확인해야 합니다.`,
      warning: `⚠️ ${T('f(' + v.p + ')f(' + v.q + ')\\lt0')}이면 충분하지만, 끝점이 근인 경우와 구간 안의 중근도 따로 확인해야 필요충분조건이 됩니다.`
    }),
    box: (v) => famBox(v, v.ks, [v.p, v.q], [famVal(v, v.ks, v.p), famVal(v, v.ks, v.q), 0]),
    draw: (b, s, v, c) => {
      b.poly([[v.p, -50], [v.q, -50], [v.q, 50], [v.p, 50]], { fill: 'green', fillAlpha: 0.08, color: null });
      b.plot((x) => famVal(v, v.ks, x), { color: 'sky', width: 3.6, glow: true });
      vline(b, v.p, 'violet'); xlab(b, c.box, v.p, 'x = ' + lbl(v.p), 'violet');
      vline(b, v.q, 'violet'); xlab(b, c.box, v.q, 'x = ' + lbl(v.q), 'violet');
      if (c.st(1)) {
        dot(b, [v.p, famVal(v, v.ks, v.p)], 'rose', 'f(p)', -10, famVal(v, v.ks, v.p) > 0 ? -12 : 20, { r: 6, align: 'right' });
        dot(b, [v.q, famVal(v, v.ks, v.q)], 'rose', 'f(q)', 10, famVal(v, v.ks, v.q) > 0 ? -12 : 20, { r: 6 });
      }
      if (c.st(2)) rootsOf(v, v.ks).filter((x) => x > v.p && x < v.q).forEach((x) => b.point([x, 0], { color: 'green', r: 6.5 }));
    }
  });

  /* ======================================================================
     4-E  rootSignZero · 실근의 부호 (두 양근 / 두 음근 / 서로 다른 부호)   [핵심]
     ====================================================================== */
  const P20 = [
    { t: 'P', u: 1, v: -2, w: 1, z: 6 }, { t: 'P', u: -2, v: -3, w: -2, z: 5 }, { t: 'P', u: -2, v: -2, w: -1, z: 5 }, { t: 'P', u: -2, v: 0, w: -1, z: 6 }, { t: 'P', u: 2, v: -3, w: 2, z: 5 },
    { t: 'N', u: 2, v: 2, w: -1, z: 5 }, { t: 'N', u: -1, v: 2, w: 1, z: 6 }, { t: 'N', u: -2, v: 3, w: 2, z: 5 }, { t: 'N', u: 1, v: 2, w: -1, z: 6 }, { t: 'N', u: 2, v: 0, w: -1, z: 6 },
    { t: 'X', u: 1, v: -2, w: -1, z: 5 }, { t: 'X', u: -2, v: 3, w: 2, z: -2 }, { t: 'X', u: -1, v: -1, w: -2, z: 1 }, { t: 'X', u: -1, v: -2, w: 2, z: 4 }, { t: 'X', u: -2, v: -1, w: -1, z: 1 }
  ];
  const var20 = varier(P20, (c, i) => {
    const S = kInts((k) => { const b = c.u * k + c.v, cc = c.w * k + c.z; return c.t === 'P' ? b * b - 4 * cc > 0 && -b > 0 && cc > 0 : c.t === 'N' ? b * b - 4 * cc > 0 && -b < 0 && cc > 0 : cc < 0; });
    const lim = c.t === 'X' ? (S.includes(-60) ? 'max' : 'min') : 'C';
    const inner = S.filter((k) => k > -60 && k < 60);
    const val = c.t === 'X' ? (lim === 'max' ? Math.max(...inner) : Math.min(...inner)) : S.length;
    const inS = S.filter((k) => k > -60 && k < 60);
    const ks = bestKs(c, c.t === 'X' ? inS.filter((k) => Math.abs(k - val) < 6) : inS, [0], (k) => [famVal(c, k, 0), 0]);
    return { ...c, key: 's20_' + i, S, lim, val, ks };
  }, (x, y) => x.t === y.t && x.u === y.u && x.v === y.v && x.w === y.w && x.z === y.z);
  const kind20 = { P: '양수', N: '음수' };
  add('rootSignZero', {
    fast: '핵심', vary: var20,
    tag: '24 제일고 기출 유형 · 2022학년도 6월 학평(부산) 유형 (두 근의 부호)', time: '목표 시간: 50초',
    text: (v) => `${T('x')}에 대한 이차방정식 ${T(fam(v.u, v.v, v.w, v.z) + '=0')}이 ${v.t === 'X' ? '서로 다른 부호의 두 실근을 갖도록 하는 정수 ' + T('k') + '의 ' + (v.lim === 'max' ? '최댓값' : '최솟값') : '서로 다른 두 ' + kind20[v.t] + '인 근을 갖도록 하는 정수 ' + T('k') + '의 개수'}을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => v.t === 'X' ? [
      `서로 다른 부호의 두 근은 포물선이 ${T('y')}축 왼쪽과 오른쪽에서 각각 ${T('x')}축과 만난다는 뜻입니다. 그러려면 ${T('x=0')}(${T('y')}축)에서 포물선이 ${T('x')}축 <strong>아래</strong>에 있어야 합니다.`,
      `${T('f(0)=' + lin(v.w, v.z) + '\\lt0')} (두 근의 곱 ${T('\\lt0')}과 같은 조건). 이때 ${T('D')}는 자동으로 양수라 따로 보지 않습니다 ⇒ ${T('k' + (v.w > 0 ? '\\lt ' : '\\gt ') + exactT(-v.z / v.w))}.`,
      `정수 ${T('k')}의 ${v.lim === 'max' ? '최댓값' : '최솟값'}은 ${T(v.val)}.`
    ] : [
      `두 근이 모두 ${kind20[v.t]}이면 포물선은 ${T('x')}축과 두 점에서 만나고(${T('D\\gt0')}), 두 점이 모두 ${T('y')}축의 ${v.t === 'P' ? '오른쪽' : '왼쪽'}에 있습니다.`,
      `그러려면 ${T('y')}축에서 포물선이 ${T('x')}축 <strong>위</strong>에 있어야 하고(${T('f(0)\\gt0')}) 대칭축도 ${T('y')}축의 ${v.t === 'P' ? '오른쪽' : '왼쪽'}이어야 합니다: ${T('f(0)=' + lin(v.w, v.z) + '\\gt0')}, 축 ${T('-\\dfrac{' + lin(v.u, v.v) + '}{2}' + (v.t === 'P' ? '\\gt0' : '\\lt0'))}.`,
      `세 조건(${T('D\\gt0')}, 축, ${T('f(0)\\gt0')})을 모두 만족하는 정수는 ${T('k=' + v.S.join(',\\ '))} ⇒ ${T(v.val)}개.`
    ],
    quick: (v) => ({
      steps: v.t === 'X' ? `서로 다른 부호의 근 ⇒ ${T('y')}축(${T('x=0')})에서 그래프가 ${T('x')}축 아래: ${T('f(0)\\lt0')} 하나. ${T(lin(v.w, v.z) + '\\lt0')} ⇒ ${T('k' + (v.w > 0 ? '\\lt ' : '\\gt ') + exactT(-v.z / v.w))}. 정수 ${T('k')}의 ${v.lim === 'max' ? '최댓값' : '최솟값'} ${T(v.val)}.`
        : `${T('y')}축에서 ${T('x')}축 위(${T('f(0)\\gt0')}), 축이 ${T('y')}축의 ${v.t === 'P' ? '오른쪽' : '왼쪽'}, ${T('x')}축과 두 점(${T('D\\gt0')}). 정수 ${T(v.S.join(',\\ '))}로 ${T(v.val)}개.`,
      highlight: `💡 서술형 문장: "두 근이 서로 다른 부호이면 두 근의 곱이 음수이므로 ${T('f(0)\\lt0')}이다. 두 근이 모두 ${v.t === 'P' ? '양수' : '음수'}이면 ${T('D\\gt0')}, 합 ${v.t === 'P' ? T('\\gt0') : T('\\lt0')}, 곱 ${T('\\gt0')}이다."`
    }),
    std: (v) => ({
      steps: `근과 계수의 관계 합 ${T('\\alpha+\\beta=-(' + lin(v.u, v.v) + ')')}, 곱 ${T('\\alpha\\beta=' + lin(v.w, v.z))}와 ${T('D')}의 부호 조건을 연립합니다.`,
      warning: `⚠️ 서로 다른 부호는 곱이 음수 하나만, 두 양근·두 음근은 합·곱·판별식 세 조건이 모두 필요합니다.`
    }),
    box: (v) => famBox(v, v.ks, [0], [famVal(v, v.ks, 0), 0]),
    draw: (b, s, v, c) => {
      b.plot((x) => famVal(v, v.ks, x), { color: 'sky', width: 3.6, glow: true });
      rootsOf(v, v.ks).forEach((x) => b.point([x, 0], { color: c.st(1) ? 'green' : 'ink', r: 5.5, hollow: !c.st(1) }));
      if (c.st(1)) { b.seg([0, 0], [0, famVal(v, v.ks, 0)], { color: 'rose', width: 3.4 }); dot(b, [0, famVal(v, v.ks, 0)], 'rose', 'f(0)', 12, famVal(v, v.ks, 0) > 0 ? -12 : 20, { r: 5.5 }); }
      if (c.st(2) && v.t !== 'X') b.vline(-(v.u * v.ks + v.v) / 2, { color: 'amber', width: 2, dash: [6, 5] });
    }
  });

  /* ======================================================================
     5-A  alwaysPositiveAll · 모든 실수 x 에서 f(x)>0 (또는 ≥0) : D<0 (또는 ≤0)   [핵심]
     ====================================================================== */
  const P21 = [
    { u: -2, v: -2, w: 3, z: 3, r1: -1, r2: 2 }, { u: 2, v: -2, w: 4, z: 1, r1: 0, r2: 6 }, { u: -1, v: -3, w: 3, z: 1, r1: 1, r2: 5 }, { u: -2, v: 2, w: 2, z: 6, r1: -1, r2: 5 },
    { u: 1, v: 2, w: -1, z: -2, r1: -6, r2: -2 }, { u: -2, v: 0, w: -1, z: 6, r1: -3, r2: 2 }, { u: -2, v: 2, w: 2, z: 1, r1: 0, r2: 4 }, { u: -1, v: -1, w: 1, z: 1, r1: -1, r2: 3 }
  ].flatMap((c) => [{ ...c, ge: false }, { ...c, ge: true }]);
  const var21 = varier(P21, (c, i) => {
    const S = kInts((k) => (c.ge ? Db(c, k) <= 0 : Db(c, k) < 0));
    return { ...c, key: 's21_' + i, S, ks: c.r1 + 1, val: S.length };
  }, (x, y) => x.ge === y.ge && x.u === y.u && x.v === y.v);
  add('alwaysPositiveAll', {
    fast: '핵심', vary: var21,
    tag: '25 금당고 기출 유형 · 2023학년도 3월 학평(서울) 유형 (항상 성립하는 이차부등식)', time: '목표 시간: 50초',
    text: (v) => `모든 실수 ${T('x')}에 대하여 이차부등식 ${T(fam(v.u, v.v, v.w, v.z) + (v.ge ? '\\ge0' : '\\gt0'))}이 성립하도록 하는 정수 ${T('k')}의 개수를 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `모든 ${T('x')}에서 ${T('f(x)' + (v.ge ? '\\ge0' : '\\gt0'))}이려면 아래로 볼록한 포물선이 ${T('x')}축 <strong>${v.ge ? '위에 있거나 접해야' : '위에만 있어야'}</strong> 합니다. 그림에서 ${T('x')}축과 ${v.ge ? '만나는 점이 없거나 한 점에서 접하는' : '만나지 않는'} 모양입니다.`,
      `그러려면 판별식 ${T(v.ge ? 'D\\le0' : 'D\\lt0')}. ${T('D=(' + lin(v.u, v.v) + ')^2-4(' + lin(v.w, v.z) + ')=' + dfac(v))}이고, 접하는 순간(점선 포물선)은 ${T('k=' + v.r1)}, ${T('k=' + v.r2)}입니다.`,
      `${T(v.r1 + (v.ge ? '\\le k\\le ' : '\\lt k\\lt ') + v.r2)}에서 정수 ${T('k')}는 ${T(v.S[0] + ',\\ \\cdots,\\ ' + v.S[v.S.length - 1])} ⇒ ${T(v.val)}개. ${v.ge ? '(양 끝은 접하는 경우라 포함)' : '(양 끝은 접하므로 제외)'}`
    ],
    quick: (v) => ({
      steps: `아래로 볼록한 포물선이 ${T('x')}축 위에만 있으면(${v.ge ? '접해도 됨' : '접하면 안 됨'}) 꼭짓점이 ${T('x')}축 ${v.ge ? '위 또는 위에 닿음' : '위'}입니다. 이는 ${T(v.ge ? 'D\\le0' : 'D\\lt0')}과 같고, ${T('D')}가 ${T('k')}의 이차식이므로 두 근 ${T('k=' + v.r1)}, ${T('k=' + v.r2)} 사이: ${T(v.r1 + (v.ge ? '\\le k\\le ' : '\\lt k\\lt ') + v.r2)} ⇒ 정수 ${T(v.val)}개.`,
      highlight: `💡 서술형 문장: "모든 실수 ${T('x')}에서 ${T('f(x)' + (v.ge ? '\\ge0' : '\\gt0'))}이려면 ${T('x^2')}의 계수가 양수이고 ${T(v.ge ? 'D\\le0' : 'D\\lt0')}이어야 한다."`
    }),
    std: (v) => ({
      steps: `이차부등식이 항상 성립할 조건을 외워 ${T(v.ge ? 'D\\le0' : 'D\\lt0')}을 세우고 ${T('k')}에 대한 이차부등식을 풉니다 ⇒ ${T(v.r1 + (v.ge ? '\\le k\\le ' : '\\lt k\\lt ') + v.r2)}.`,
      warning: `⚠️ "${v.ge ? '≥' : '>'}"에 따라 양 끝(${T('k=' + v.r1)}, ${T('k=' + v.r2)})의 포함 여부가 달라집니다. 포물선이 ${T('x')}축에 접하는 그림으로 확인하세요.`
    }),
    box: (v) => famBox(v, v.ks, [0], [famVal(v, v.ks, 0), 0]),
    draw: (b, s, v, c) => {
      b.plot((x) => famVal(v, v.ks, x), { color: 'sky', width: 3.6, glow: true });
      if (c.st(1)) b.text([-(v.u * v.ks + v.v) / 2, 0], v.ge ? 'x축 위 또는 접함' : 'x축 위', { color: 'green', size: 13, weight: 800, dy: -4, align: 'center' });
      if (c.st(2)) [v.r1, v.r2].forEach((kk) => { b.plot((x) => famVal(v, kk, x), { color: 'amber', width: 2.4, dash: [6, 5] }); rootsOf(v, kk).forEach((x) => b.point([x, 0], { color: 'amber', r: 5.5 })); });
    }
  });

  /* ======================================================================
     5-B  restrictedIneqMinMax · 0≤x≤L 에서 x²−2kx+c≥0 : 원점을 지나는 직선을 돌려 접선 찾기   [핵심]
     ====================================================================== */
  const P22 = [{ L: 2, c: 1 }, { L: 2, c: 4 }, { L: 3, c: 4 }, { L: 3, c: 1 }, { L: 2, c: 6 }, { L: 2, c: 8 }, { L: 1, c: 5 }, { L: 1, c: 3 }];
  const var22 = varier(P22, (c, i) => {
    const tang = c.c <= c.L * c.L, r = Math.sqrt(c.c);
    const k = tang ? r : (c.L * c.L + c.c) / (2 * c.L);
    return { ...c, key: 's22_' + i, tang, k, xt: tang ? r : c.L, val: k, tex: tang ? String(r) : frTex(c.L * c.L + c.c, 2 * c.L) };
  });
  add('restrictedIneqMinMax', {
    fast: '핵심', vary: var22,
    tag: '26 매산고 기출 유형 · 2020학년도 11월 학평(경기) 유형 (제한된 범위에서 항상 성립)', time: '목표 시간: 60초',
    text: (v) => `${T('0\\le x\\le ' + v.L)}에서 부등식 ${T('x^2-2kx+' + v.c + '\\ge0')}이 항상 성립하도록 하는 실수 ${T('k')}의 최댓값을 구하시오.`,
    ans: (v) => v.tex,
    steps: (v) => [
      `부등식을 ${T('x^2+' + v.c + '\\ge2kx')}로 바꿔 두 그래프로 읽습니다: 포물선 ${T('y=x^2+' + v.c)}가 원점을 지나는 직선 ${T('y=2kx')}보다 <strong>구간 ${T('0\\le x\\le ' + v.L)} 전체에서 위(또는 접함)</strong>에 있어야 합니다.`,
      `직선을 원점에서 돌려 기울기 ${T('2k')}를 키우면 포물선에 처음 닿는 순간이 한계입니다. ${v.tang ? '닿는 점(접점)은 구간 안 ' + T('x=\\sqrt{' + v.c + '}=' + Math.sqrt(v.c)) + '에서 생깁니다(접선).' : '접점 ' + T('x=\\sqrt{' + v.c + '}') + '가 구간 밖이라 구간의 끝점 ' + T('x=' + v.L) + '에서 먼저 닿습니다.'}`,
      v.tang ? `접점 ${T('x=' + v.xt)}에서 ${T('x^2+' + v.c + '=2kx')}가 중근 ⇒ ${T('x=\\sqrt{' + v.c + '}')}, ${T('2k=2\\sqrt{' + v.c + '}')} ⇒ ${T('k=' + v.tex)}.`
        : `끝점 ${T('(' + v.L + ',\\ ' + (v.L * v.L + v.c) + ')')}를 지나는 직선의 기울기는 ${T('\\dfrac{' + (v.L * v.L + v.c) + '}{' + v.L + '}')}이므로 ${T('2k=\\dfrac{' + (v.L * v.L + v.c) + '}{' + v.L + '}')} ⇒ ${T('k=' + v.tex)}.`
    ],
    quick: (v) => ({
      steps: `${T('x^2+' + v.c + '\\ge 2kx')}는 "포물선이 원점을 지나는 직선보다 위"라는 뜻입니다. 직선을 돌려 올리다 포물선과 처음 닿는 곳이 한계입니다. ${v.tang ? '접점이 구간 안(' + T('x=' + Math.sqrt(v.c)) + ')에 있으므로 ' + T('x^2-2kx+' + v.c + '=0') + '이 중근: ' + T('k^2=' + v.c) + ' ⇒ ' + T('k=' + v.tex) + '.' : '접점이 구간 밖이어서 끝점 ' + T('x=' + v.L) + '에서 닿고 ' + T('k=\\dfrac{' + v.L + '^2+' + v.c + '}{2\\cdot' + v.L + '}=' + v.tex) + '.'}`,
      highlight: `💡 서술형 문장: "${T('x^2+' + v.c + '\\ge 2kx')}를 만족하려면 직선 ${T('y=2kx')}가 곡선 ${T('y=x^2+' + v.c)}보다 위로 올라가면 안 된다."`
    }),
    std: (v) => ({
      steps: `${T('f(x)=x^2-2kx+' + v.c)}의 구간 ${T('[0,\\ ' + v.L + ']')}에서의 최솟값이 ${T('0')} 이상이어야 합니다. 축 ${T('x=k')}의 위치(${T('k\\lt0')}, ${T('0\\le k\\le ' + v.L)}, ${T('k\\gt ' + v.L)})로 세 경우로 나누어 최솟값을 구하고 ${T('\\ge0')}을 풉니다.`,
      warning: `⚠️ 축 ${T('x=k')}가 구간 안인지 밖인지에 따라 최솟값의 위치가 바뀌므로 경우 나누기가 필요합니다. 그림에서는 직선이 닿는 위치로 바로 읽힙니다.`
    }),
    box: (v) => autoBox(-1.2, v.L + 2.4, [v.L * v.L + v.c + 0.5], 1.2),
    draw: (b, s, v, c) => {
      b.poly([[0, -50], [v.L, -50], [v.L, 50], [0, 50]], { fill: 'green', fillAlpha: 0.08, color: null });
      b.vline(0, { color: 'green', width: 1.8, dash: [6, 4], alpha: 0.8 }); b.vline(v.L, { color: 'green', width: 1.8, dash: [6, 4], alpha: 0.8 });
      b.plot((x) => x * x + v.c, { color: 'sky', width: 3.6, glow: true });
      b.text([v.L, c.box.y[1] - 0.7], 'x = ' + v.L, { color: 'green', size: 13, weight: 800, dx: 6, align: 'left' });
      const kk = c.st(3) ? v.k : v.k * 0.55;
      b.line([0, 0], 2 * kk, { color: c.st(3) ? 'green' : 'rose', width: 3.2, glow: true, alpha: c.st(2) && !c.st(3) ? 0.45 : 1 });
      b.text([c.box.x[1] - 0.2, c.box.y[0] + 0.7], '직선 y = 2kx', { color: c.st(3) ? 'green' : 'rose', size: 13, weight: 800, align: 'right' });
      if (c.st(2) || c.st(3)) dot(b, [v.xt, v.xt * v.xt + v.c], c.st(3) ? 'green' : 'amber', v.tang ? '접점' : '끝점', -12, -10, { r: 6.5, align: 'right' });
    }
  });

  /* ======================================================================
     5-C  specialSol4Cases · D=0 인 이차부등식 4가지 (접할 때의 해)   [보통]
     1: ≤0 의 해가 오직 하나 ⇒ D=0 (k 의 합/곱),  2: <0 의 해가 없다 ⇒ D≤0,  3: ≤0 의 해가 없다 ⇒ D<0
     ====================================================================== */
  const P23 = cycle([
    { u: -2, v: -2, w: 3, z: 3, r1: -1, r2: 2 }, { u: 2, v: -2, w: 4, z: 1, r1: 0, r2: 6 }, { u: -1, v: -3, w: 3, z: 1, r1: 1, r2: 5 }, { u: -2, v: 2, w: 2, z: 6, r1: -1, r2: 5 },
    { u: 1, v: 2, w: -1, z: -2, r1: -6, r2: -2 }, { u: -2, v: 0, w: -1, z: 6, r1: -3, r2: 2 }, { u: -1, v: -1, w: 1, z: 1, r1: -1, r2: 3 }
  ], ['1S', '1P', '2', '3']);
  const var23 = varier(P23, (c, i) => {
    const val = c.ask === '1S' ? c.r1 + c.r2 : c.ask === '1P' ? c.r1 * c.r2 : c.ask === '2' ? c.r2 - c.r1 + 1 : c.r2 - c.r1 - 1;
    return { ...c, key: 's23_' + i, val, ks: Math.round((c.r1 + c.r2) / 2) };
  }, sameKey);
  add('specialSol4Cases', {
    fast: '보통', vary: var23,
    tag: '26 금당고 기출 유형 · 2022학년도 9월 학평(인천) 유형 (D=0일 때 이차부등식의 해)', time: '목표 시간: 50초',
    text: (v) => {
      const f = T(fam(v.u, v.v, v.w, v.z));
      return v.ask[0] === '1' ? `${T('x')}에 대한 이차부등식 ${f}${T('\\le0')}의 해가 오직 하나가 되도록 하는 모든 실수 ${T('k')}의 값의 ${v.ask === '1S' ? '합' : '곱'}을 구하시오.`
        : v.ask === '2' ? `이차부등식 ${f}${T('\\lt0')}의 해가 존재하지 않도록 하는 정수 ${T('k')}의 개수를 구하시오.`
          : `이차부등식 ${f}${T('\\le0')}의 해가 존재하지 않도록 하는 정수 ${T('k')}의 개수를 구하시오.`;
    },
    ans: (v) => String(v.val),
    steps: (v) => [
      v.ask[0] === '1' ? `해가 오직 하나 ⇒ 아래로 볼록한 포물선이 ${T('x')}축에 <strong>한 점에서 접합니다</strong>(${T('f(x)\\le0')}인 곳이 접점 하나뿐). ${T('D=0')}.`
        : v.ask === '2' ? `${T('f(x)\\lt0')}의 해가 없다 ⇒ 포물선이 ${T('x')}축 아래로 내려가지 않는다. <strong>${T('x')}축에 접해도 됩니다</strong>(접점에서 ${T('f=0')}이라 ${T('\\lt0')}이 아님) ⇒ ${T('D\\le0')}.`
          : `${T('f(x)\\le0')}의 해가 없다 ⇒ 포물선이 ${T('x')}축에 닿지도 않고 위쪽에만 있다 ⇒ <strong>접하면 안 됩니다</strong> ⇒ ${T('D\\lt0')}.`,
      `${T('D=(' + lin(v.u, v.v) + ')^2-4(' + lin(v.w, v.z) + ')=' + dfac(v))}. 그래프가 ${T('x')}축에 접하는 두 순간(점선 포물선)이 ${T('k=' + v.r1)}, ${T('k=' + v.r2)}입니다.`,
      v.ask === '1S' ? `접하는 ${T('k')}는 ${T(v.r1)}, ${T(v.r2)}이므로 합은 ${T(v.r1 + '+' + par(v.r2) + '=' + v.val)}.`
        : v.ask === '1P' ? `접하는 ${T('k')}는 ${T(v.r1)}, ${T(v.r2)}이므로 곱은 ${T(par(v.r1) + '\\times' + par(v.r2) + '=' + v.val)}.`
          : v.ask === '2' ? `${T('D\\le0')} ⇒ ${T(v.r1 + '\\le k\\le ' + v.r2)} (양 끝 포함) ⇒ 정수 ${T(v.val)}개.` : `${T('D\\lt0')} ⇒ ${T(v.r1 + '\\lt k\\lt ' + v.r2)} (양 끝 제외) ⇒ 정수 ${T(v.val)}개.`
    ],
    quick: (v) => ({
      steps: `${T('D=0')}인 순간은 포물선이 ${T('x')}축에 접하는 두 그림(${T('k=' + v.r1)}, ${T('k=' + v.r2)})입니다. ${v.ask[0] === '1' ? '해가 오직 하나이면 접하는 순간이므로 ' + T('k=' + v.r1) + ', ' + T('k=' + v.r2) + ' ⇒ ' + (v.ask === '1S' ? '합 ' : '곱 ') + T(v.val) + '.' : v.ask === '2' ? '"<0의 해가 없다"는 접해도 되므로 두 접하는 순간을 포함한 ' + T(v.r1 + '\\le k\\le ' + v.r2) + ' ⇒ ' + T(v.val) + '개.' : '"≤0의 해가 없다"는 접하면 안 되므로 두 접하는 순간을 뺀 ' + T(v.r1 + '\\lt k\\lt ' + v.r2) + ' ⇒ ' + T(v.val) + '개.'}`,
      highlight: `💡 서술형 문장: "${T('D=0')}이면 포물선이 ${T('x')}축에 접하므로 ${T('f(x)\\le0')}의 해는 접점의 ${T('x')}좌표 하나뿐이고, ${T('f(x)\\lt0')}의 해는 없다."`
    }),
    std: (v) => ({
      steps: `${T('D\\gt0')}, ${T('D=0')}, ${T('D\\lt0')} 각각에서 해를 적어 보고 "해가 없다/하나" 조건에 맞는 경우를 골라 ${T('k')}에 대한 이차부등식(또는 방정식)을 풉니다.`,
      warning: `⚠️ <strong>${T('\\lt')}과 ${T('\\le')}에 따라 접하는 경우의 포함 여부가 바뀝니다.</strong> ${T('f(x)\\lt0')}의 해가 없을 때는 접해도 되지만, ${T('f(x)\\le0')}의 해가 없을 때는 접하면 안 됩니다.`
    }),
    box: (v) => famBox(v, v.ks, [0], [famVal(v, v.ks, 0), 0]),
    draw: (b, s, v, c) => {
      b.plot((x) => famVal(v, v.ks, x), { color: 'sky', width: 3.6, glow: true });
      if (c.st(2)) [v.r1, v.r2].forEach((kk) => { b.plot((x) => famVal(v, kk, x), { color: 'amber', width: 2.4, dash: [6, 5] }); rootsOf(v, kk).forEach((x) => b.point([x, 0], { color: 'amber', r: 6 })); });
    }
  });

  /* ======================================================================
     5-D  integerCountBoundary · 정수 해의 개수와 경계의 포함 여부   [보통]
     (x−p)(x−k)≤0 또는 <0 (k>p) 의 정수 해가 n 개가 되는 k 의 범위 α, β 의 α+β
     ====================================================================== */
  const P24 = [{ p: 1, n: 3, le: true }, { p: 1, n: 3, le: false }, { p: -1, n: 3, le: true }, { p: 2, n: 4, le: false }, { p: 0, n: 4, le: true }, { p: -2, n: 3, le: false }, { p: 1, n: 4, le: true }, { p: 0, n: 5, le: false }];
  const var24 = varier(P24, (c, i) => {
    const al = c.le ? c.p + c.n - 1 : c.p + c.n, be = c.le ? c.p + c.n : c.p + c.n + 1;
    return { ...c, key: 's24_' + i, al, be, val: al + be };
  });
  add('integerCountBoundary', {
    fast: '보통', vary: var24,
    tag: '24 제일고 기출 유형 · 2023학년도 6월 학평(부산) 유형 (정수 해의 개수와 경계)', time: '목표 시간: 60초',
    text: (v) => `${T('k\\gt ' + v.p)}인 실수 ${T('k')}에 대하여 이차부등식 ${T('(x-' + par(v.p) + ')(x-k)' + (v.le ? '\\le0' : '\\lt0'))}을 만족하는 정수 ${T('x')}의 개수가 ${T(v.n)}이 되도록 하는 ${T('k')}의 값의 범위가 ${T(v.le ? '\\alpha\\le k\\lt\\beta' : '\\alpha\\lt k\\le\\beta')}일 때, ${T('\\alpha+\\beta')}의 값을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('y=(x-' + par(v.p) + ')(x-k)')}의 그래프에서 ${v.le ? T('y\\le0') : T('y\\lt0')}인 ${T('x')}의 범위는 두 근 ${T(v.p)}와 ${T('k')} 사이(${v.le ? '양 끝 포함' : '양 끝 제외'})입니다. ${T('k')}를 키우면 오른쪽 끝이 늘어나며 ${T('k')}가 정수를 지날 때마다 정수 해가 하나씩 늘어납니다.`,
      v.le ? `${T('x=' + v.p)}부터 시작해 정수 해가 ${T(v.n)}개: ${T(v.p + ',\\ \\cdots,\\ ' + (v.p + v.n - 1))}. ${T('k')}가 ${T(v.al)}에 <strong>도달하는 순간</strong>(등호 포함) ${T(v.al)}이 해에 들어옵니다.`
        : `${T('x=' + v.p)}은 양 끝이라 빠지고 정수 해는 ${T(v.p + 1 + ',\\ \\cdots,\\ ' + (v.p + v.n))}. ${T('k')}가 ${T(v.al)}을 <strong>넘어서야</strong>(등호 제외) ${T(v.al)}이 해에 들어옵니다.`,
      v.le ? `${T('k=' + v.be)}이 되면 ${T(v.be)}도 해에 들어와 ${T(v.n + 1)}개가 되므로 ${T('k\\lt ' + v.be)}. 범위 ${T(v.al + '\\le k\\lt ' + v.be)} ⇒ ${T('\\alpha+\\beta=' + v.al + '+' + v.be + '=' + v.val)}.`
        : `${T('k=' + v.be)}까지는 ${T(v.be)}이 양 끝이라 빠지므로 ${T('k\\le ' + v.be)}. 범위 ${T(v.al + '\\lt k\\le ' + v.be)} ⇒ ${T('\\alpha+\\beta=' + v.al + '+' + v.be + '=' + v.val)}.`
    ],
    quick: (v) => ({
      steps: `${T('x')}축 위의 정수점을 세면서 ${T('k')}를 오른쪽으로 움직입니다. ${v.le ? T('\\le0') + '이면 오른쪽 끝 ' + T('x=k') + '도 해에 들어가므로 ' + T('k') + '가 정수에 닿는 순간 하나 늘어납니다' : T('\\lt0') + '이면 오른쪽 끝 ' + T('x=k') + '는 해가 아니므로 ' + T('k') + '가 정수를 넘어서야 하나 늘어납니다'}. ${T(v.n)}개인 구간은 ${T(v.le ? v.al + '\\le k\\lt ' + v.be : v.al + '\\lt k\\le ' + v.be)} ⇒ ${T(v.val)}.`,
      highlight: `💡 서술형 문장: "${T('k\\gt ' + v.p)}일 때 해는 ${v.le ? T(v.p + '\\le x\\le k') : T(v.p + '\\lt x\\lt k')}이므로 정수 해는 ${v.le ? T('x=' + v.p + ',\\ \\cdots,\\ \\lfloor k\\rfloor') : T('x=' + (v.p + 1) + ',\\ \\cdots,\\ \\lceil k\\rceil-1')}이다."`
    }),
    std: (v) => ({
      steps: `${T('k')}를 정수 사이의 구간으로 나누어 정수 해를 직접 나열하고 개수를 ${T(v.n)}과 비교합니다.`,
      warning: `⚠️ 경계 ${T('k=' + v.al)}, ${T('k=' + v.be)}에서 직접 개수를 세어 포함 여부를 확인하세요(${v.le ? '≤' : '<'}이므로 ${v.le ? '오른쪽 끝 ' + T('x=k') + '가 해에 포함' : '오른쪽 끝 ' + T('x=k') + '가 해에서 제외'}).`
    }),
    box: (v) => autoBox(v.p - 2.4, v.p + v.n + 3, [-(((v.n + 1) / 2) ** 2), 3], 1.0),
    draw: (b, s, v, c) => {
      const kk = c.st(3) ? v.be : c.st(2) ? v.al : v.p + 1.5;
      b.plot((x) => (x - v.p) * (x - kk), { color: c.st(2) ? 'green' : 'sky', width: 3.6, glow: true });
      dot(b, [v.p, 0], 'ink', 'x = ' + lbl(v.p), 0, 22, { hollow: !v.le, r: 5.5, align: 'center', size: 13 });
      for (let x = v.p + 1; x <= v.p + v.n + 2; x++) { const inSol = v.le ? (x - v.p) * (x - kk) <= 1e-9 : (x - v.p) * (x - kk) < -1e-9; if (x !== kk) b.point([x, 0], { color: inSol ? 'green' : 'muted', r: inSol ? 5 : 3.2, hollow: !inSol }); }
      dot(b, [kk, 0], 'rose', c.st(2) ? 'k = ' + lbl(kk) : 'k', 0, 22, { r: 5, hollow: !v.le, align: 'center', size: 13 });
      if (c.st(2)) b.text([c.box.x[1] - 0.2, c.box.y[1] - 1.2], c.st(3) ? '정수 해 ' + (v.le ? v.n + 1 : v.n) + '개 (k = ' + v.be + ')' : '정수 해 ' + v.n + '개', { color: c.st(3) ? 'amber' : 'green', size: 13, weight: 800, align: 'right' });
    }
  });

  /* ======================================================================
     5-E  compIneqTransform · f(x)<0 의 해 (α,β) ⇒ f(mx+n)<0 의 해   [핵심]
     ====================================================================== */
  const P25 = cycle([
    { al: -2, be: 4, m: 2, n: -1 }, { al: -3, be: 5, m: 2, n: 1 }, { al: -2, be: 6, m: 2, n: 0 }, { al: -4, be: 2, m: 3, n: -1 }, { al: -1, be: 5, m: -2, n: 1 }, { al: 0, be: 6, m: 3, n: -3 }, { al: -2, be: 4, m: -3, n: 1 }
  ], ['S', 'W']);
  const var25 = varier(P25, (c, i) => {
    const e1 = (c.al - c.n) / c.m, e2 = (c.be - c.n) / c.m, ga = Math.min(e1, e2), de = Math.max(e1, e2);
    const f = (x) => 0.32 * (x - c.al) * (x - c.be);
    return { ...c, key: 's25_' + i, ga, de, f, g: (x) => f(c.m * x + c.n), val: c.ask === 'S' ? ga + de : de - ga };
  }, sameKey);
  add('compIneqTransform', {
    fast: '핵심', vary: var25,
    tag: '25 금당고 기출 유형 · 2021학년도 6월 학평(부산) 유형 (f(x)<0의 해로 f(mx+n)<0의 해 구하기)', time: '목표 시간: 40초',
    text: (v) => `이차함수 ${T('f(x)')}에 대하여 부등식 ${T('f(x)\\lt0')}의 해가 ${T(v.al + '\\lt x\\lt ' + v.be)}이다. 부등식 ${T('f(' + linTex(v.m, v.n) + ')\\lt0')}의 해가 ${T('\\gamma\\lt x\\lt\\delta')}일 때, ${v.ask === 'S' ? T('\\gamma+\\delta') : T('\\delta-\\gamma')}의 값을 구하시오.`,
    ans: (v) => exactT(v.val),
    steps: (v) => [
      `${T('f(x)\\lt0')}의 해 ${T(v.al + '\\lt x\\lt ' + v.be)}는 그래프에서 ${T('x')}축 아래에 있는 부분(초록 구간)입니다.`,
      `${T('y=f(' + linTex(v.m, v.n) + ')')}의 그래프는 ${T('f')}의 그래프를 가로로 ${T('\\dfrac{1}{' + Math.abs(v.m) + '}')}배 하고${v.m < 0 ? ' y축에 대칭시킨 뒤' : ''} 옮긴 것입니다(금색 포물선). 이 그래프가 ${T('x')}축 아래에 있는 것은 ${T(v.al + '\\lt ' + linTex(v.m, v.n) + '\\lt ' + v.be)}일 때입니다.`,
      `${v.m > 0 ? '' : '(음수를 곱하면 부등호 방향이 바뀌므로 작은 쪽과 큰 쪽을 바꿔 읽습니다) '}${T('\\gamma=' + exactT(v.ga) + ',\\ \\delta=' + exactT(v.de))}. ${v.ask === 'S' ? T('\\gamma+\\delta=' + exactT(v.ga + v.de)) : T('\\delta-\\gamma=' + exactT(v.de - v.ga))}.`
    ],
    quick: (v) => ({
      steps: `${T('f(x)\\lt0')}이 되는 "${T('x')}축 아래 구간"의 가로 값이 ${T(v.al + '\\lt(\\ \\ )\\lt ' + v.be)}이므로 ( ) 자리에 ${T(linTex(v.m, v.n))}를 넣어 ${T(v.al + '\\lt ' + linTex(v.m, v.n) + '\\lt ' + v.be)}. 이를 풀면 ${T('\\gamma=' + exactT(v.ga))}, ${T('\\delta=' + exactT(v.de))}. 폭은 원래 폭 ${T(v.be - v.al)}의 ${T('\\dfrac{1}{' + Math.abs(v.m) + '}')}배인 ${T(exactT(v.de - v.ga))}.`,
      highlight: `💡 서술형 문장: "${T('f(x)\\lt0')}의 해가 ${T(v.al + '\\lt x\\lt ' + v.be)}이므로 ${T('f(' + linTex(v.m, v.n) + ')\\lt0')}은 ${T(v.al + '\\lt ' + linTex(v.m, v.n) + '\\lt ' + v.be)}와 같다."`
    }),
    std: (v) => ({
      steps: `${T('f(x)=a(x-' + par(v.al) + ')(x-' + par(v.be) + ')')} (${T('a\\gt0')})로 놓고 ${T('f(' + linTex(v.m, v.n) + ')')}를 직접 전개해 부등식을 풉니다(계산이 길어짐).`,
      warning: `⚠️ ${T('f')}의 식을 구할 필요가 없습니다. 해의 구간에 ${T(linTex(v.m, v.n))}를 대응시키면 됩니다.`
    }),
    box: (v) => autoBox(Math.min(v.al, v.ga) - 2.6, Math.max(v.be, v.de) + 2.6, [-0.32 * (v.be - v.al) ** 2 / 4 - 0.3, 1.2], 0.9),
    draw: (b, s, v, c) => {
      b.plot(v.f, { color: 'sky', width: 3.6, glow: true, alpha: c.st(2) ? 0.5 : 1 });
      b.seg([v.al, 0], [v.be, 0], { color: 'green', width: 5 });
      dot(b, [v.al, 0], 'ink', lbl(v.al), 0, -14, { hollow: true, r: 5, align: 'center', size: 13 });
      dot(b, [v.be, 0], 'ink', lbl(v.be), 0, -14, { hollow: true, r: 5, align: 'center', size: 13 });
      nameOn(b, c.box, v.f, v.be + 1.4, 'y = f(x)', { color: 'sky', size: 13, weight: 800, dx: 2, dy: -6, align: 'left' });
      if (c.st(2)) b.plot(v.g, { color: 'amber', width: 3.4 });
      if (c.st(3)) {
        b.seg([v.ga, 0], [v.de, 0], { color: 'rose', width: 5 });
        dot(b, [v.ga, 0], 'rose', 'γ = ' + exactL(v.ga), 0, 40, { r: 5, align: 'center', size: 13 });
        dot(b, [v.de, 0], 'rose', 'δ = ' + exactL(v.de), 0, 40, { r: 5, align: 'center', size: 13 });
      }
    }
  });

  /* ======================================================================
     6-A  trapLeadingZero · kx²+2mkx+c>0  "부등식" 과 "이차부등식" (k=0 확인)   [함정]
     ====================================================================== */
  const P26 = cycle([{ m: 1, c: 3 }, { m: 1, c: 4 }, { m: 1, c: 5 }, { m: 2, c: 10 }, { m: 2, c: 12 }, { m: 1, c: 6 }, { m: 2, c: 8 }, { m: 3, c: 18 }], ['ineq', 'quad']);
  const var26 = varier(P26, (c, i) => {
    const Sq = []; for (let k = 1; k <= 60; k++) if (c.m * c.m * k < c.c) Sq.push(k);
    const S = c.ask === 'ineq' ? [0].concat(Sq) : Sq;
    const B = c.c / (c.m * c.m);
    return { ...c, key: 's26_' + i, S, Sq, B, val: S.length, ks: B / 2, kz: B };
  }, (x, y) => x.ask === y.ask && x.m === y.m && x.c === y.c);
  const tex26 = (v) => `kx^2+${2 * v.m === 1 ? '' : 2 * v.m}kx+${v.c}`;
  add('trapLeadingZero', {
    fast: '해당 없음', vary: var26,
    tag: '25 매산고 기출 유형 · 2020학년도 6월 학평(부산) 유형 (최고차항의 계수가 0인 경우)', time: '목표 시간: 50초',
    text: (v) => `모든 실수 ${T('x')}에 대하여 ${v.ask === 'ineq' ? '<strong>부등식</strong> ' : '<strong>이차부등식</strong> '}${T(tex26(v) + '\\gt0')}이 성립하도록 하는 정수 ${T('k')}의 개수를 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('k\\gt0')}이면 아래로 볼록한 포물선이 ${T('x')}축 위에만 있어야 하므로 ${T('D\\lt0')}: ${T('\\dfrac D4=(' + v.m + 'k)^2-' + v.c + 'k=k(' + v.m * v.m + 'k-' + v.c + ')\\lt0')} ⇒ ${T('0\\lt k\\lt ' + frTex(v.c, v.m * v.m))}. (${T('k\\lt0')}이면 위로 볼록하여 항상 성립할 수 없습니다.)`,
      `<strong>${T('k=0')}인 경우</strong>는 포물선이 아니라 수평선 ${T('y=' + v.c)}(그림의 금색 직선)입니다. ${T(v.c + '\\gt0')}이므로 모든 실수 ${T('x')}에서 성립합니다.`,
      v.ask === 'ineq' ? `"부등식"이라 했으므로 ${T('k=0')}도 포함합니다: ${T('0\\le k\\lt ' + frTex(v.c, v.m * v.m))}의 정수 ${T(v.S.join(',\\ '))} ⇒ ${T(v.val)}개.`
        : `"이차부등식"은 ${T('x^2')}의 계수 ${T('k')}가 0이 아니어야 하므로 ${T('k=0')}은 제외합니다: ${T('0\\lt k\\lt ' + frTex(v.c, v.m * v.m))}의 정수 ${T(v.S.join(',\\ '))} ⇒ ${T(v.val)}개.`
    ],
    quick: (v) => ({
      steps: `${T('k\\ne0')}이면 ${T('0\\lt k\\lt ' + frTex(v.c, v.m * v.m))}. ${T('k=0')}이면 식이 ${T(v.c + '\\gt0')}(수평선 ${T('y=' + v.c)}가 ${T('x')}축 위)이라 항상 성립합니다. 문제가 ${v.ask === 'ineq' ? '"부등식"이므로 ' + T('k=0') + '을 포함하여' : '"이차부등식"이므로 ' + T('k=0') + '을 제외하여'} ${T(v.val)}개.`,
      warning: `⚠️ <strong>"부등식"과 "이차부등식"은 다릅니다.</strong> 최고차항의 계수 ${T('k')}가 0이 될 수 있는지 문제의 말을 먼저 확인하세요. ${v.ask === 'ineq' ? '"이차부등식"이었다면 답이 ' + T(v.Sq.length) + '개로 달라집니다.' : '"부등식"이었다면 답이 ' + T(v.Sq.length + 1) + '개로 달라집니다.'}`
    }),
    std: (v) => ({
      steps: `이차부등식이 항상 성립할 조건 "${T('k\\gt0')}이고 ${T('D\\lt0')}"만 쓰면 ${T('0\\lt k\\lt ' + frTex(v.c, v.m * v.m))}의 정수 ${T(v.Sq.length)}개를 얻습니다.`,
      warning: `⚠️ ${v.ask === 'ineq' ? '"부등식"이라고 했으므로 ' + T('k=0') + '을 따로 확인해 더해야 합니다 (' + T(v.Sq.length) + '개가 아니라 ' + T(v.Sq.length + 1) + '개).' : '"이차부등식"이므로 위 조건만으로 충분합니다 (' + T('k=0') + '은 이차식이 아님).'}`
    }),
    box: (v) => autoBox(-v.m - 3.6, -v.m + 3.6, [v.c + 0.6, v.c - v.m * v.m * v.ks, 0], 1.0),
    draw: (b, s, v, c) => {
      b.plot((x) => v.ks * x * x + 2 * v.m * v.ks * x + v.c, { color: 'sky', width: 3.6, glow: true, alpha: c.st(2) ? 0.45 : 1 });
      b.text([c.box.x[0] + 0.2, v.c * 0.55], '(k > 0일 때)', { color: 'sky', size: 13, weight: 800, align: 'left' });
      if (c.st(2)) { b.hline(v.c, { color: 'amber', width: 3.4 }); b.text([c.box.x[1] - 0.2, v.c], 'k = 0 : y = ' + v.c, { color: 'amber', size: 13, weight: 800, dy: -14, align: 'right' }); }
      if (c.st(1)) { b.plot((x) => v.kz * x * x + 2 * v.m * v.kz * x + v.c, { color: 'violet', width: 2.2, dash: [6, 5], alpha: 0.9 }); b.text([-v.m, 0], 'D = 0 (경계)', { color: 'violet', size: 13, weight: 800, dy: 22, align: 'center' }); }
    }
  });

  /* ======================================================================
     6-B  trapMaxLtMin · 임의의 x₁, x₂ 에 대해 f(x₁)≥g(x₂) ⟺ min f ≥ max g   [함정]
     ====================================================================== */
  const P27 = [
    { a: 1, p: 2, q: 1, b: 1, r: -1, s: -2 }, { a: 2, p: 1, q: 3, b: 1, r: 0, s: 1 }, { a: 1, p: 0, q: 4, b: 2, r: 3, s: 0 }, { a: 1, p: -1, q: 2, b: 1, r: 2, s: -3 },
    { a: 2, p: 2, q: -1, b: 1, r: 0, s: -4 }, { a: 1, p: 3, q: 0, b: 3, r: 1, s: -2 }
  ];
  const var27 = varier(P27, (c, i) => {
    const f = (x) => c.a * (x - c.p) ** 2 + c.q, g = (x, k) => -c.b * (x - c.r) ** 2 + c.s + k;
    const den = c.a + c.b, sameNum = (c.q - c.s) * den + c.a * c.b * (c.p - c.r) ** 2;
    return { ...c, key: 's27_' + i, f, g, val: c.q - c.s, sameTex: frTex(sameNum, den) };
  });
  add('trapMaxLtMin', {
    fast: '보통', vary: var27,
    tag: '26 제일고 기출 유형 · 2021학년도 3월 학평(서울) 유형 (임의의 x₁, x₂에 대한 부등식)', time: '목표 시간: 60초',
    text: (v) => `두 이차함수 ${T('f(x)=' + polyTex(v.a, -2 * v.a * v.p, v.a * v.p * v.p + v.q))}, ${T('g(x)=' + polyTex(-v.b, 2 * v.b * v.r, -v.b * v.r * v.r + v.s) + '+k')}에 대하여 <strong>임의의 실수 ${T('x_1,\\ x_2')}</strong>에 대하여 ${T('f(x_1)\\ge g(x_2)')}가 성립하도록 하는 실수 ${T('k')}의 최댓값을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('x_1,\\ x_2')}가 서로 관계없이 움직이므로 ${T('f(x_1)')}의 모든 값이 ${T('g(x_2)')}의 모든 값 이상이어야 합니다. 그림에서 ${T('f')}가 가질 수 있는 가장 낮은 값(최솟값)이 ${T('g')}가 가질 수 있는 가장 높은 값(최댓값) 이상이어야 합니다.`,
      `${T('f')}의 최솟값은 꼭짓점의 높이 ${T(v.q)}(파란 점선), ${T('g')}의 최댓값은 꼭짓점의 높이 ${T(v.s + '+k')}(분홍 점선은 ${T('k=0')}일 때 ${T(v.s)}). ${T('f')}의 최솟값 ≥ ${T('g')}의 최댓값: ${T(v.q + '\\ge ' + v.s + '+k')}.`,
      `${T('k\\le ' + v.q + '-' + par(v.s) + '=' + v.val)}이므로 ${T('k')}의 최댓값은 ${T(v.val)}. (그림: ${T('g')}를 위로 ${T(v.val)}만큼 올리면 꼭대기가 ${T('f')}의 바닥에 닿습니다.)`
    ],
    quick: (v) => ({
      steps: `<strong>임의의 ${T('x_1,\\ x_2')}</strong>이므로 두 함수의 높이를 각각 따로 봅니다. ${T('f')}의 바닥 높이 ${T(v.q)} ≥ ${T('g')}의 꼭대기 높이 ${T(v.s + '+k')}. 두 그래프를 아래·위로 완전히 떼어 놓는 조건이므로 ${T('k\\le ' + v.val)}, 최댓값 ${T(v.val)}.`,
      warning: `⚠️ "모든 실수 ${T('x')}에 대하여 ${T('f(x)\\ge g(x)')}"(같은 ${T('x')}에서만 비교)이면 조건이 훨씬 약해져 ${T('k\\le ' + v.sameTex)}이 됩니다. 두 포물선이 가로로 겹쳐 있어도 되기 때문입니다. 문제의 "임의의 ${T('x_1,\\ x_2')}"를 놓치지 마세요.`
    }),
    std: (v) => ({
      steps: `${T('f(x)')}의 최솟값 ${T(v.q)}와 ${T('g(x)')}의 최댓값 ${T(v.s + '+k')}를 각각 완전제곱식으로 구한 뒤 ${T('f')}의 최솟값 ≥ ${T('g')}의 최댓값을 풉니다. (같은 ${T('x')}라고 착각하면 ${T('f(x)-g(x)\\ge0')}으로 가서 ${T('k\\le ' + v.sameTex)}를 얻는 실수를 합니다.)`,
      warning: `⚠️ ${T('x_1')}과 ${T('x_2')}는 서로 다른 변수입니다. 두 포물선이 가로로 겹쳐도 높이 범위가 겹치면 안 됩니다.`
    }),
    box: (v) => autoBox(Math.min(v.p, v.r) - 4.2, Math.max(v.p, v.r) + 4.2, [v.q, v.s, v.q + 0.5], 1.5),
    draw: (b, s, v, c) => {
      b.plot(v.f, { color: 'sky', width: 3.6, glow: true });
      b.plot((x) => v.g(x, c.st(3) ? v.val : 0), { color: c.st(3) ? 'green' : 'rose', width: 3.6, glow: true });
      nameOn(b, c.box, v.f, v.p + 2.4, 'f', { color: 'sky', size: 14, weight: 800, dx: 12 });
      nameOn(b, c.box, (x) => v.g(x, c.st(3) ? v.val : 0), v.r - 2.2, c.st(3) ? 'g (k = ' + v.val + ')' : 'g (k = 0)', { color: c.st(3) ? 'green' : 'rose', size: 13, weight: 800, dx: -12, align: 'right' });
      if (c.st(2)) {
        b.hline(v.q, { color: 'sky', width: 1.8, dash: [5, 5] });
        if (!c.st(3)) b.hline(v.s, { color: 'rose', width: 1.8, dash: [5, 5] });
        dot(b, [v.p, v.q], 'sky', 'f의 최솟값 ' + lbl(v.q), 0, 22, { r: 5.5, align: 'center' });
        if (!c.st(3)) dot(b, [v.r, v.s], 'rose', 'g의 최댓값(k=0) ' + lbl(v.s), 0, -14, { r: 5.5, align: 'center' });
      }
      if (c.st(3)) dot(b, [v.r, v.q], 'green', 'g의 최댓값 = ' + lbl(v.q), 0, -14, { r: 6, align: 'center' });
    }
  });

  /* ======================================================================
     6-C  trapKIndepDoubleRoot · k 에 관계없이 항상 중근 : D=0 을 k 에 대한 항등식으로   [함정]
     x²−2(k+a)x+k²+bk+c=0,  D/4=(2a−b)k+a²−c ≡ 0 ⇒ b=2a, c=a²
     ====================================================================== */
  const P28 = cycle([{ a: 1 }, { a: 2 }, { a: 3 }, { a: -1 }, { a: -2 }, { a: -3 }], ['S', 'P']);
  const var28 = varier(P28, (c, i) => {
    const b = 2 * c.a, cc = c.a * c.a;
    return { ...c, key: 's28_' + i, b, cc, val: c.ask === 'S' ? b + cc : b * cc };
  }, (x, y) => x.a === y.a && x.ask === y.ask);
  add('trapKIndepDoubleRoot', {
    fast: '해당 없음', vary: var28,
    tag: '24 제일고 기출 유형 · 2022학년도 11월 학평(경기) 유형 (k의 값에 관계없이 항상 성립)', time: '목표 시간: 60초',
    text: (v) => `${T('x')}에 대한 이차방정식 ${T('x^2-2(k' + sgn(v.a) + ')x+k^2+bk+c=0')}이 실수 ${T('k')}의 값에 관계없이 항상 중근을 가질 때, 상수 ${T('b,\\ c')}에 대하여 ${v.ask === 'S' ? T('b+c') : T('bc')}의 값을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('k')}가 어떤 값이든 중근이면 포물선이 늘 ${T('x')}축에 접합니다. 그림은 ${T('k=-1,\\ 0,\\ 1')}일 때의 포물선입니다(꼭짓점이 ${T('x')}축 위의 ${T('x=k' + sgn(v.a))}에서 접함).`,
      `<strong>풀이 순서</strong>: ① 중근이므로 ${T('\\dfrac D4=0')} ⇒ ${T('(k' + sgn(v.a) + ')^2-(k^2+bk+c)=' + (2 * v.a) + 'k-bk+' + v.cc + '-c=0')}. ② 이 식이 <strong>모든 ${T('k')}에서 성립</strong>하는 ${T('k')}에 대한 항등식이므로 ${T('k')}의 계수와 상수항이 모두 ${T(0)}.`,
      `${T('b=' + v.b)}, ${T('c=' + v.cc)}. ${v.ask === 'S' ? T('b+c=' + v.b + '+' + v.cc + '=' + v.val) : T('bc=' + v.b + '\\times' + v.cc + '=' + v.val)}.`
    ],
    quick: (v) => ({
      steps: `항상 중근이면 ${T('(x-(k' + sgn(v.a) + '))^2=0')}꼴이어야 하므로 ${T('x^2-2(k' + sgn(v.a) + ')x+(k' + sgn(v.a) + ')^2')}과 같아야 합니다. ${T('(k' + sgn(v.a) + ')^2=k^2+' + (2 * v.a) + 'k+' + v.cc)}를 ${T('k^2+bk+c')}와 비교하면 ${T('b=' + v.b)}, ${T('c=' + v.cc)} ⇒ ${v.ask === 'S' ? T('b+c=' + v.val) : T('bc=' + v.val)}.`,
      warning: `⚠️ <strong>풀이 순서 함정</strong>: ${T('k')}에 구체적인 값(예: ${T('k=0')})을 넣어 ${T('b,\\ c')}를 구하면 필요조건만 얻을 뿐입니다. 먼저 ${T('D=0')}을 쓰고, 그 식이 모든 ${T('k')}에 대해 성립하는 항등식(계수 = 0)이라는 순서를 지키세요.`
    }),
    std: (v) => ({
      steps: `① ${T('D=0')} ⇒ ${T((2 * v.a) + 'k-bk+' + v.cc + '-c=0')}. ② ${T('(' + (2 * v.a) + '-b)k+(' + v.cc + '-c)=0')}이 모든 ${T('k')}에서 성립 ⇒ ${T('b=' + v.b + ',\\ c=' + v.cc)}.`,
      warning: `⚠️ 순서를 바꿔 ${T('k')}에 숫자를 대입하면 조건이 부족합니다.`
    }),
    box: (v) => autoBox(v.a - 4.2, v.a + 4.2, [6.5], 1.0),
    draw: (b, s, v, c) => {
      [-1, 0, 1].forEach((kk) => {
        b.plot((x) => (x - kk - v.a) ** 2, { color: kk === 0 ? 'sky' : 'violet', width: kk === 0 ? 3.6 : 2.6, glow: kk === 0, alpha: kk === 0 ? 1 : 0.8 });
        dot(b, [kk + v.a, 0], kk === 0 ? 'sky' : 'violet', c.st(1) ? 'k = ' + lbl(kk) : '', kk * 8, kk === 0 ? 42 : 22, { r: 5.5, align: kk < 0 ? 'right' : kk > 0 ? 'left' : 'center', size: 13 });
      });
      if (c.st(2)) b.text([v.a, 5.8], '항상 x축에 접함: D = 0', { color: 'amber', size: 13, weight: 800, align: 'center' });
    }
  });

  /* ======================================================================
     6-D  trapIrrationalCoeffs · 유리수 계수의 이차방정식과 켤레근   [보통]
     x²+ax+b=0 (a, b 유리수) 의 한 근이 p+q√r ⇒ 다른 근은 p−q√r, a=−2p, b=p²−q²r
     ====================================================================== */
  const P29 = [{ p: 1, q: 1, r: 2 }, { p: 2, q: 1, r: 3 }, { p: 1, q: 2, r: 2 }, { p: 3, q: 1, r: 2 }, { p: -1, q: 1, r: 3 }, { p: 2, q: 2, r: 2 }, { p: 0, q: 1, r: 5 }, { p: 1, q: 1, r: 5 }];
  const var29 = varier(P29, (c, i) => {
    const a = -2 * c.p, b = c.p * c.p - c.q * c.q * c.r;
    const rt = (sg) => (c.p === 0 ? '' : String(c.p)) + (sg < 0 ? '-' : c.p === 0 ? '' : '+') + (c.q === 1 ? '' : c.q) + '\\sqrt{' + c.r + '}';
    const rl = (sg) => (c.p === 0 ? '' : lbl(c.p)) + (sg < 0 ? '−' : c.p === 0 ? '' : '+') + (c.q === 1 ? '' : c.q) + '√' + c.r;
    return { ...c, key: 's29_' + i, a, b, val: a + b, rt, rl, x1: c.p + c.q * Math.sqrt(c.r), x2: c.p - c.q * Math.sqrt(c.r) };
  });
  add('trapIrrationalCoeffs', {
    fast: '보통', vary: var29,
    tag: '25 금당고 기출 유형 · 2020학년도 3월 학평(서울) 유형 (유리수 계수 이차방정식의 무리수 근)', time: '목표 시간: 50초',
    text: (v) => `${T('x')}에 대한 이차방정식 ${T('x^2+ax+b=0')}의 한 근이 ${T(v.rt(1))}일 때, <strong>유리수</strong> ${T('a,\\ b')}에 대하여 ${T('a+b')}의 값을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `포물선 ${T('y=x^2+ax+b')}는 대칭축 ${T('x=-\\dfrac a2')}에 대해 좌우 대칭이고, 두 근(${T('x')}절편)은 축에서 같은 거리에 있습니다. 한 근 ${T(v.rt(1))}은 그림의 점 A입니다. ${T('a')}가 유리수이면 축도 유리수이므로, 다른 근은 무리수 부분만 반대 부호인 ${T('t-' + (v.q === 1 ? '' : v.q) + '\\sqrt{' + v.r + '}')}(${T('t')}는 유리수) 꼴입니다.`,
      `${T('b')}도 유리수이므로 두 근의 곱의 무리수 부분이 ${T(0)}이어야 합니다 ⇒ ${T('t=' + v.p)}. 곧 다른 근은 ${T(v.rt(-1))}이고 축은 ${T('x=' + v.p)}입니다(점 B).`,
      `${T('a=-(\\text{두 근의 합})=-2\\cdot' + par(v.p) + '=' + v.a)}, ${T('b=\\text{두 근의 곱}=' + par(v.p) + '^2-' + v.q * v.q + '\\cdot' + v.r + '=' + v.b)}. ${T('a+b=' + v.val)}.`
    ],
    quick: (v) => ({
      steps: `계수가 모두 유리수이면 무리수 근은 <strong>켤레</strong>(${T(v.rt(1))}와 ${T(v.rt(-1))})로 짝지어 나옵니다(그림에서 두 근은 축 ${T('x=' + v.p)}에 대해 좌우 대칭). 합 ${T(2 * v.p)}, 곱 ${T(v.b)} ⇒ ${T('a=' + v.a + ',\\ b=' + v.b)}, ${T('a+b=' + v.val)}.`,
      warning: `⚠️ 켤레근 성질은 <strong>계수가 유리수일 때만</strong> 씁니다. 계수에 무리수가 있으면(예: ${T('a=\\sqrt2')}) 다른 근이 ${T(v.rt(-1))}가 아닐 수 있습니다. 문제의 "유리수"를 꼭 확인하세요.`
    }),
    std: (v) => ({
      steps: `${T('x=' + v.rt(1))}를 대입해 ${T('(\\text{유리수})+(\\text{유리수})\\sqrt{' + v.r + '}=0')}으로 정리하고 유리수·무리수 부분을 각각 ${T(0)}으로 놓아 ${T('a,\\ b')}를 구합니다 ⇒ ${T('a=' + v.a + ',\\ b=' + v.b)}.`,
      warning: `⚠️ 대입·전개가 길고 부호 실수가 잦습니다. 켤레근(축 대칭)으로 읽으면 합과 곱만 필요합니다.`
    }),
    box: (v) => autoBox(Math.min(v.x2, v.x1) - 2.6, Math.max(v.x2, v.x1) + 2.6, [-v.q * v.q * v.r - 0.5, 1], 1.0),
    draw: (b, s, v, c) => {
      b.plot((x) => (x - v.p) ** 2 - v.q * v.q * v.r, { color: 'sky', width: 3.6, glow: true });
      dot(b, [v.x1, 0], 'rose', 'A(' + v.rl(1) + ', 0)', 6, -14, { r: 6, size: 13 });
      if (c.st(1)) { b.vline(v.p, { color: 'amber', width: 2, dash: [6, 5] }); b.text([v.p, c.box.y[0] + 0.8], '축 x = ' + lbl(v.p), { color: 'amber', size: 13, weight: 800, dx: 6, align: 'left' }); }
      if (c.st(2)) dot(b, [v.x2, 0], 'green', 'B(' + v.rl(-1) + ', 0)', -6, -14, { r: 6, size: 13, align: 'right' });
    }
  });

  /* ======================================================================
     6-E  trapParabolaMeetSegment · 포물선 y=x²+bx+k 가 선분 AB 와 서로 다른 두 점에서 만날 k   [핵심]
     선분 위의 점 (x, mx+n) 이 포물선 위에 있을 조건 k=φ(x)=n−x²−(b−m)x 의 값 범위로 읽는다
     ====================================================================== */
  const P30 = [
    { m: 1, n: 1, x1: 0, x2: 3, b: -2 }, { m: 0, n: 1, x1: 0, x2: 4, b: -3 }, { m: 0, n: 3, x1: 0, x2: 4, b: -4 }, { m: 1, n: 1, x1: 0, x2: 4, b: -3 },
    { m: -1, n: 2, x1: -1, x2: 3, b: -3 }, { m: 1, n: 0, x1: -1, x2: 3, b: -1 }, { m: -1, n: 2, x1: 0, x2: 4, b: -4 }, { m: 0, n: 1, x1: -1, x2: 3, b: -2 }
  ];
  const var30 = varier(P30, (c, i) => {
    const phi = (x) => c.n - x * x - (c.b - c.m) * x, xv = -(c.b - c.m) / 2;
    const lo = Math.max(phi(c.x1), phi(c.x2)), hi = phi(xv);
    const S = []; for (let k = Math.ceil(lo - 1e-9); k < hi - 1e-9; k++) S.push(k);
    const A = [c.x1, c.m * c.x1 + c.n], B = [c.x2, c.m * c.x2 + c.n];
    return { ...c, key: 's30_' + i, phi, xv, lo, hi, S, A, B, para: (k) => (x) => x * x + c.b * x + k, val: S.length };
  });
  const bx30 = (v) => (v.b === 0 ? '' : v.b < 0 ? v.b + 'x' : '+' + v.b + 'x');
  const loTex30 = (v) => exactT(v.lo), hiTex30 = (v) => (Math.abs(v.hi * 4 - Math.round(v.hi * 4)) < 1e-9 ? frTex(Math.round(v.hi * 4), 4) : String(v.hi));
  add('trapParabolaMeetSegment', {
    fast: '핵심', vary: var30,
    tag: '26 매산고 기출 유형 · 2022학년도 6월 학평(부산) 유형 (포물선과 선분의 교점)', time: '목표 시간: 60초',
    text: (v) => `좌표평면 위의 두 점 ${T('A(' + v.A[0] + ',\\ ' + v.A[1] + ')')}, ${T('B(' + v.B[0] + ',\\ ' + v.B[1] + ')')}에 대하여 포물선 ${T('y=x^2' + bx30(v) + '+k')}가 선분 AB와 서로 다른 두 점에서 만나도록 하는 정수 ${T('k')}의 개수를 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `선분 AB는 직선 ${T('y=' + linTex(v.m, v.n))}의 ${T(v.A[0] + '\\le x\\le ' + v.B[0])}인 부분입니다. 그 위의 점이 포물선 위에 있을 조건 ${T('x^2' + bx30(v) + '+k=' + linTex(v.m, v.n))}은 ${T('k=-x^2' + (v.b - v.m === 0 ? '' : (-(v.b - v.m) < 0 ? '' : '+') + -(v.b - v.m) + 'x') + (v.n === 0 ? '' : sgn(v.n)))}. 포물선 위의 점이 선분에 닿는 데 필요한 <strong>수직 이동량 ${T('k=\\varphi(x)')}</strong>을 읽는 방법입니다(그림의 두 장면).`,
      `포물선을 아래에서 올리면 <strong>두 끝점에서 필요한 이동량 중 큰 값</strong>에 도달할 때(초록 포물선) 두 점으로 만나기 시작하고(${T('k=' + loTex30(v))}), 포물선이 선분에 <strong>접하는 순간</strong>(분홍 포물선, 접점 ${T('x=' + exactT(v.xv))})에는 한 점으로 줄어듭니다(${T('k=' + hiTex30(v))}).`,
      `서로 다른 두 점: ${T(loTex30(v) + '\\le k\\lt ' + hiTex30(v))} (시작 ${T('k=' + loTex30(v))}은 선분의 두 점을 지나므로 포함, 접하는 ${T('k=' + hiTex30(v))}는 한 점이라 제외). 정수 ${T(v.S.join(',\\ '))} ⇒ ${T(v.val)}개.`
    ],
    quick: (v) => ({
      steps: `포물선과 선분의 교점이 두 개인 구간은 <strong>(두 끝점에서 구한 이동량 k의 큰 값) ≤ k < (선분에 접할 때)</strong>입니다. 끝점을 지날 때 ${T('k=' + loTex30(v))}, 접할 때 ${T('k=' + hiTex30(v))}. 정수 ${T(v.S.join(',\\ '))} ⇒ ${T(v.val)}개.`,
      warning: `⚠️ 끝점을 지나는 경우(포함)와 접하는 경우(제외)를 각각 그림으로 확인하세요. 한쪽만 맞추면 정수 ${T('k')}의 개수가 하나 어긋납니다.`
    }),
    std: (v) => ({
      steps: `${T('x^2' + (v.b - v.m === 0 ? '' : (v.b - v.m < 0 ? '' : '+') + (v.b - v.m) + 'x') + '+k-' + par(v.n) + '=0')}이 ${T(v.A[0] + '\\le x\\le ' + v.B[0])}에서 서로 다른 두 실근을 가질 조건을 ${T('D\\gt0')}, 축의 위치, 양 끝 ${T('f(' + v.A[0] + ')\\ge0')}, ${T('f(' + v.B[0] + ')\\ge0')}로 정리해 푸는 풀이입니다(조건 네 개).`,
      warning: `⚠️ 끝점이 근이 되는 경우(등호)를 포함하는지 확인하지 않으면 정수 하나가 틀립니다.`
    }),
    box: (v) => autoBox(Math.min(v.A[0], v.B[0]) - 2.6, Math.max(v.A[0], v.B[0]) + 2.6, [v.A[1], v.B[1], v.para(v.hi)(v.xv), v.para(v.S[0] + 0.45)(v.xv), v.para(v.lo)(v.A[0] - 1.6)], 1.3),
    draw: (b, s, v, c) => {
      b.seg(v.A, v.B, { color: 'green', width: 5 });
      dot(b, v.A, 'ink', `A(${lbl(v.A[0])}, ${lbl(v.A[1])})`, -8, v.m > 0 ? 22 : -12, { align: 'right', size: 13, r: 5.5 });
      dot(b, v.B, 'ink', `B(${lbl(v.B[0])}, ${lbl(v.B[1])})`, 8, v.m < 0 ? 22 : -12, { size: 13, r: 5.5 });
      const ks = v.S[0] + 0.45;
      b.plot(v.para(ks), { color: 'sky', width: 3.4, glow: true, alpha: c.st(2) ? 0.35 : 1 });
      b.text([c.box.x[0] + 0.3, c.box.y[1] - 0.8], 'y = x²' + (v.b === 0 ? '' : v.b < 0 ? ' − ' + -v.b + 'x' : ' + ' + v.b + 'x') + ' + k', { color: 'sky', size: 13, weight: 800, align: 'left' });
      if (c.st(2)) {
        b.plot(v.para(v.lo), { color: 'green', width: 3.2 });
        b.plot(v.para(v.hi), { color: 'rose', width: 3.2 });
        dot(b, [v.xv, v.para(v.hi)(v.xv)], 'rose', '접점', 10, -12, { r: 6 });
        [v.A, v.B].forEach((P) => { if (Math.abs(P[1] - v.para(v.lo)(P[0])) < 1e-9) b.point(P, { color: 'green', r: 6.5 }); });
      }
    }
  });
})();
