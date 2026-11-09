/* ==========================================================================
   중3 · 삼각비 — 탭 ② 「30°·45°·60°」 (t2.js, order 20) — 장면 7개
   · cut3060 정삼각형 반 자르기   · cut45 정사각형 대각선 자르기   · chainSpecial 이어 붙인 두 직각삼각형
   · r2-1 특수각의 삼각비 표 만들기   · r2-2 식의 값   · r2-3 크기 비교   · absSignJudge [킬러] √(sin x − cos x)²
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const { clamp, pt, add, sub, mul, mid, lerp, T, tagOut, ang, sideTag, tick, line, poly, fillPoly, fit, rtGeo, drawRT, rtBox, P, rd, notes, dashed, rint, pick, sample, bboxOf, DEG,
    vi, vsq, vf, vadd, vsub, vmul, vdiv, vsqrt, vtex, vcan, vsame, sinD, cosD, tanD, mkChoices, degChoices, mkTextChoices, checkQ, fmtN, decS, nmRand, ov, triName, FN, FNK } = G;

  const PARAMS = {
    t2s: P('반으로 자르기', 0, 1, 0.01, 0, { color: 'amber', format: (v) => Math.round(v * 100) + '%', hint: '▶를 누르거나 막대를 끌면 두 조각이 가로로 벌어져요' }),
    t2L: P('한 변의 길이 L', 2, 12, 1, 6, { color: 'sky' }),
    t2h: P('공통 변 AH', 1, 10, 1, 4, { color: 'violet' }),
    t2th: P('각 θ', 30, 60, 15, 30, { color: 'amber', format: G.degF, hint: '30°, 45°, 60° 중에서 골라요' }),
    t2a: P('첫째 항의 각', 30, 60, 15, 30, { color: 'rose', format: G.degF }),
    t2b: P('둘째 항의 각', 30, 60, 15, 60, { color: 'sky', format: G.degF }),
    t2c: P('셋째 항의 각', 30, 60, 15, 45, { color: 'green', format: G.degF }),
    t23: P('각 θ', 0, 90, 1, 30, { color: 'amber', format: G.degF }),
    t24: P('각 x', 1, 89, 1, 30, { color: 'amber', format: G.degF }),
    t2k: P('크기 k', 1, 8, 1, 3, { color: 'sky', hint: '삼각형의 크기를 바꿔도 비는 그대로예요' })
  };
  const sg = (v) => vi(v);
  const half = (L) => vi(L, 2);
  const s3 = vsq(3), s2 = vsq(2);
  // 특수각 직각삼각형의 변의 비 (각 θ 는 위치 A): 대변 : 이웃변 : 빗변
  const RATIO = { 30: [vi(1), s3, vi(2)], 45: [vi(1), vi(1), s2], 60: [s3, vi(1), vi(2)] };

  /* ---- 문제: 특수각 직각삼각형에서 변의 길이 (공용) ---- */
  function specialProblem(thetas, tagKey, opt = {}) {
    const th = pick(thetas), nm = nmRand(), mirror = Math.random() < 0.4;
    const r = RATIO[th], k = pick([vi(1), vi(2), vi(3), vi(4), vi(5), vi(6), vi(8), vi(10), vi(1, 2), vi(3, 2)]);
    const sides = { a: vmul(k, r[0]), b: vmul(k, r[1]), c: vmul(k, r[2]) };
    // 모양
    const shape = { a: r[0].v, b: r[1].v };
    const kinds = ['a', 'b', 'c']; let gk = pick(opt.given || kinds), ak = pick((opt.ask || kinds).filter((x) => x !== gk));
    if (th === 45 && gk !== 'c' && ak !== 'c') { if (!opt.ask || opt.ask.includes('c')) ak = 'c'; else gk = 'c'; }
    const ans = sides[ak], gv = sides[gk];
    const pool = [];
    const other = kinds.find((x) => x !== gk && x !== ak);
    pool.push([sides[other], '구하는 변이 아니에요. 어느 변을 구하는지 다시 봐요.']);
    pool.push([vmul(ans, s3), '변의 비를 거꾸로 적용했어요.'], [vdiv(ans, s3), '변의 비를 거꾸로 적용했어요.'], [vmul(ans, vi(2)), '변의 비를 거꾸로 적용했어요.'], [vdiv(ans, vi(2)), '변의 비를 거꾸로 적용했어요.'], [vmul(ans, s2), '변의 비를 거꾸로 적용했어요.'], [vdiv(ans, s2), '변의 비를 거꾸로 적용했어요.'], [gv, '주어진 변의 길이예요.']);
    const side = {};
    side[gk] = { t: vcan(gv), c: 'sky' }; side[ak] = { t: 'x', c: 'amber', size: 21 };
    const atB = Math.random() < 0.0;
    const q = {
      tag: th === 45 ? '45° 직각삼각형' : '30°·60° 직각삼각형', key: [tagKey, th, vtex(k), gk, ak, nm.A + nm.B + nm.C, mirror].join('|'),
      stem: `$\\angle ${nm.C}=90^{\\circ}$, $\\angle ${nm.A}=${th}^{\\circ}$ 인 직각삼각형 ${triName(nm)}에서 $${G.sideTag2(nm, gk)}=${vtex(gv)}$ 일 때, $${G.sideTag2(nm, ak)}$의 길이는?`,
      choices: mkChoices(ans, pool),
      fig: { a: shape.a, b: shape.b, mirror, rot: 0, names: nm, side, angA: { t: `${th}°`, c: 'sky' }, ticks: null },
      given: [vcan(gv), `${th}°`], ans: [vcan(ans)]
    };
    q.fig.reference = 'A'; q.fig.solutionSide = Object.fromEntries(Object.entries(sides).map(([key, v]) => [key, vcan(v)]));
    return checkQ(q, [
      `기준각은 $\\angle ${nm.A}=${th}^{\\circ}$이며, 주어진 변은 $${G.sideTag2(nm, gk)}=${vtex(gv)}$입니다.`,
      `이 직각삼각형의 대변 : 이웃변 : 빗변은 $${r.map((v) => vtex(v)).join(':')}$입니다. 주어진 변과 구하는 변의 위치를 짝지어요.`,
      `세 변의 공통 배율은 $k=\\frac{${vtex(gv)}}{${vtex(r[kinds.indexOf(gk)])}}=${vtex(k)}$입니다.`,
      `따라서 구하는 변은 $x=k\\times${vtex(r[kinds.indexOf(ak)])}=${vtex(k)}\\times${vtex(r[kinds.indexOf(ak)])}$입니다.`
    ], { kind: 'special-side', theta: th, givenSide: gk, askedSide: ak, given: gv.v, answer: ans.v });
  }
  const pdrawSP = (b, q, C) => G.pdrawRT(b, q.fig, C);

  /* ---- 정삼각형·정사각형을 반으로 자르기(가로로 벌어짐) ---- */
  const r3 = (v) => vcan(v);
  const cut3060 = {
    id: 'cut3060', title: '정삼각형 반 자르기 — 30°·60°', short: '정삼각형 반 자르기',
    question: '한 변이 L인 정삼각형을 높이로 반으로 자르면 어떤 직각삼각형이 될까? 세 변의 비는?',
    ctl: ['t2L', 't2s'], anim: { key: 't2s', dur: 3, label: '반으로 자르기', start: 0 }, stepT: (n) => (n >= 2 ? 1 : 0),
    init: (s) => { s.t2L = 6; s.t2s = 0; },
    model: (s) => { const L = Math.round(s.t2L); return { L, bh: half(L), ah: vmul(vi(L, 2), s3), l: vi(L), t: s.t2s }; },
    draw(b, s, M, C) {
      const L = M.L, H = (L * Math.sqrt(3)) / 2, t = C.review ? C.t : M.t, gap = L * 0.32 * t;
      const A1 = pt(-gap, -H), B1 = pt(-L / 2 - gap, 0), H1 = pt(-gap, 0), A2 = pt(gap, -H), H2 = pt(gap, 0), C2 = pt(L / 2 + gap, 0);
      const compact = !C.thumb && b.W < 560;
      fit(b, bboxOf([pt(-L / 2 - L * 0.32, 0), pt(L / 2 + L * 0.32, 0), A1]), compact ? { t: 36, b: 82, l: 44, r: 44 } : { t: 50, b: 100, l: 66, r: 66 });
      const st = C.step;
      fillPoly(b, [A1, B1, H1], 'sky', 0.14); fillPoly(b, [A2, H2, C2], 'sky', 0.14);
      poly(b, [A1, B1, H1], 'ink', 3.4); poly(b, [A2, H2, C2], 'ink', 3.4);
      if (t < 0.02) line(b, A1, H1, 'violet', 3, { dash: dashed });
      ang(b, H1, B1, A1, { color: 'ink', r: 20 }); ang(b, H2, A2, C2, { color: 'ink', r: 20 });
      ang(b, B1, H1, A1, { color: 'amber', r: 34, label: '60°', size: 16 }); ang(b, C2, A2, H2, { color: 'amber', r: 34, label: '60°', size: 16 });
      ang(b, A1, B1, H1, { color: 'rose', r: 38, label: '30°', size: 16, rings: 2 }); ang(b, A2, H2, C2, { color: 'rose', r: 38, label: '30°', size: 16, rings: 2 });
      const cen1 = G.centroid([A1, B1, H1]), cen2 = G.centroid([A2, H2, C2]);
      sideTag(b, A1, B1, cen1, st >= 1 || st === 99 ? `${r3(M.l)}` : 'L', { color: 'green', size: 17 });
      sideTag(b, B1, H1, cen1, r3(M.bh), { color: 'sky', size: 17, flip: true, gap: 14 });
      const heightAt = compact ? lerp(A1, H1, .62) : mid(A1, H1);
      T(b, heightAt, r3(M.ah), { dx: -26, size: 16, color: 'rose', ...(compact ? { leaderAnchor: heightAt, leader: true } : {}) });
      sideTag(b, A2, C2, cen2, r3(M.l), { color: 'green', size: 17 }); sideTag(b, H2, C2, cen2, r3(M.bh), { color: 'sky', size: 17, flip: true, gap: 14 });
      tick(b, A1, B1, 1, 'green'); tick(b, A2, C2, 1, 'green'); tick(b, B1, H1, 2, 'sky'); tick(b, H2, C2, 2, 'sky');
      [[A1, 'A', cen1], [B1, 'B', cen1], [H1, 'H', cen1], [A2, 'A', cen2], [H2, 'H', cen2], [C2, 'C', cen2]].forEach(([p0, n, c]) => { b.point(p0, { color: 'ink', r: 4 }); if (t > 0.5 ? true : (n !== 'A' || p0 === A1) && (n !== 'H' || p0 === H1)) tagOut(b, p0, c, n, { size: 17, gap: 10 }); });
      if (st >= 3 || st === 99) T(b, pt(0, 0), 'BH : AH : AB = 1 : √3 : 2', { dy: 62, size: 17, color: 'amber' });
      else T(b, pt(0, 0), `빗변 ${r3(M.l)} 일 때 짧은 변은 ${r3(M.bh)}`, { dy: 62, size: 16, color: 'sky' });
    },
    steps: (M) => [
      `한 변이 $${M.L}$ 인 정삼각형 $ABC$ 의 꼭짓점 $A$ 에서 높이 $AH$ 를 그어요. $\\angle B=60^{\\circ}$, $\\angle BAH=30^{\\circ}$ 이고 $BH=\\frac{${M.L}}{2}$ 예요.`,
      `반으로 자른 직각삼각형 $ABH$ 에서 $AH=\\sqrt{${M.L}^2-(\\frac{${M.L}}{2})^2}=${vtex(M.ah)}$ 이에요.`,
      `세 변의 비는 $BH:AH:AB=1:\\sqrt{3}:2$ 이에요. 30°의 맞은편 변이 가장 짧아요.`,
      `$\\sin30^{\\circ}=\\frac{1}{2}$, $\\cos30^{\\circ}=\\frac{\\sqrt{3}}{2}$, $\\tan30^{\\circ}=\\frac{\\sqrt{3}}{3}$, $\\sin60^{\\circ}=\\frac{\\sqrt{3}}{2}$, $\\cos60^{\\circ}=\\frac{1}{2}$, $\\tan60^{\\circ}=\\sqrt{3}$`
    ],
    view: (M) => ({
      guide: '<b>L</b>을 바꾸고 ▶를 눌러 정삼각형을 높이로 반으로 잘라 보세요. 두 조각이 가로로 벌어지며 합동인 직각삼각형이 나타나요. 변의 비는 L과 관계없이 $1:\\sqrt{3}:2$ 예요.',
      readouts: [rd('짧은 변 $BH$', `$${vtex(M.bh)}$`, 'sky'), rd('높이 $AH$', `$${vtex(M.ah)}$`, 'rose'), rd('빗변 $AB$', `$${vtex(M.l)}$`, 'green')],
      rule: '30°·60°·90° 직각삼각형의 세 변의 비 = $1:\\sqrt{3}:2$',
      notes: notes('$1:\\sqrt{3}:2$ 에서 $\\sqrt{3}$ 은 60°의 맞은편(높이)이에요. 30°의 맞은편은 1이에요.', '정삼각형의 높이는 $\\frac{\\sqrt{3}}{2}L$ 이에요. 반으로 자른 직각삼각형의 빗변이 정삼각형의 한 변이에요.')
    }),
    gen: () => specialProblem([30, 60], 'c3060'),
    pdraw: pdrawSP
  };
  // (s 안에서 쓰는 문자열 속 분수 표기는 \frac 로 씁니다)

  const cut45 = {
    id: 'cut45', title: '정사각형 대각선 자르기 — 45°', short: '정사각형 자르기',
    question: '한 변이 s인 정사각형을 대각선으로 자르면 어떤 직각삼각형이 될까? 세 변의 비는?',
    ctl: ['t2L', 't2s'], anim: { key: 't2s', dur: 3, label: '대각선으로 자르기', start: 0 }, stepT: (n) => (n >= 2 ? 1 : 0),
    init: (s) => { s.t2L = 5; s.t2s = 0; },
    model: (s) => { const L = Math.round(s.t2L); return { L, d: vmul(vi(L), s2), l: vi(L), t: s.t2s }; },
    draw(b, s, M, C) {
      const L = M.L, t = C.review ? C.t : M.t, gap = L * 0.34 * t;
      // 정사각형 A(왼쪽 위) B(왼쪽 아래) C(오른쪽 아래) D(오른쪽 위), 대각선 BD 로 자름 → 삼각형 ABD(왼쪽 위), CBD(오른쪽 아래)
      const A = pt(-gap, -L), Bq = pt(-gap, 0), D1 = pt(L - gap, -L);
      const C2 = pt(L + gap, 0), B2 = pt(gap, 0), D2 = pt(L + gap, -L);
      fit(b, bboxOf([pt(-L * 0.34, -L), pt(L * 1.34, 0)]), { t: 50, b: 84, l: 56, r: 56 });
      fillPoly(b, [A, Bq, D1], 'sky', 0.14); fillPoly(b, [B2, C2, D2], 'sky', 0.14);
      poly(b, [A, Bq, D1], 'ink', 3.4); poly(b, [B2, C2, D2], 'ink', 3.4);
      ang(b, A, D1, Bq, { color: 'ink', r: 20 }); ang(b, C2, B2, D2, { color: 'ink', r: 20 });
      ang(b, Bq, D1, A, { color: 'amber', r: 34, label: '45°', size: 16 }); ang(b, D1, A, Bq, { color: 'amber', r: 34, label: '45°', size: 16, rings: 1 });
      ang(b, B2, D2, C2, { color: 'amber', r: 34, label: '45°', size: 16 }); ang(b, D2, B2, C2, { color: 'amber', r: 34, label: '45°', size: 16 });
      const c1 = G.centroid([A, Bq, D1]), c2 = G.centroid([B2, C2, D2]);
      sideTag(b, A, Bq, c1, r3(M.l), { color: 'sky', size: 17 }); sideTag(b, A, D1, c1, r3(M.l), { color: 'sky', size: 17 }); sideTag(b, Bq, D1, c1, r3(M.d), { color: 'green', size: 17 });
      sideTag(b, B2, C2, c2, r3(M.l), { color: 'sky', size: 17 }); sideTag(b, C2, D2, c2, r3(M.l), { color: 'sky', size: 17 }); sideTag(b, B2, D2, c2, r3(M.d), { color: 'green', size: 17 });
      tick(b, A, Bq, 1, 'sky'); tick(b, A, D1, 1, 'sky'); tick(b, B2, C2, 1, 'sky'); tick(b, C2, D2, 1, 'sky');
      [[A, 'A', c1], [Bq, 'B', c1], [D1, 'D', c1]].forEach(([p0, n, c]) => { b.point(p0, { color: 'ink', r: 4 }); tagOut(b, p0, c, n, { size: 17, gap: 10 }); });
      [[B2, 'B', c2], [C2, 'C', c2], [D2, 'D', c2]].forEach(([p0, n, c]) => { b.point(p0, { color: 'ink', r: 4 }); tagOut(b, p0, c, n, { size: 17, gap: 10 }); });
      T(b, pt(L / 2, 0), `한 변 : 한 변 : 대각선 = ${r3(M.l)} : ${r3(M.l)} : ${r3(M.d)} = 1 : 1 : √2`, { dy: 50, size: 16, color: 'amber' });
    },
    steps: (M) => [
      `한 변이 $${M.L}$ 인 정사각형의 대각선 $BD$ 로 자르면 합동인 직각이등변삼각형 두 개가 생겨요. 두 예각은 모두 $45^{\\circ}$ 예요.`,
      `피타고라스 정리로 대각선을 구해요. $BD=\\sqrt{${M.L}^2+${M.L}^2}=${vtex(M.d)}$`,
      `세 변의 비는 $1:1:\\sqrt{2}$ 예요. $\\sin45^{\\circ}=\\cos45^{\\circ}=\\frac{\\sqrt{2}}{2}$, $\\tan45^{\\circ}=1$`
    ],
    view: (M) => ({
      guide: '<b>한 변</b>을 바꾸고 ▶를 눌러 정사각형을 대각선으로 잘라 보세요. 변의 비는 한 변의 길이와 관계없이 $1:1:\\sqrt{2}$ 예요.',
      readouts: [rd('한 변', `$${vtex(M.l)}$`, 'sky'), rd('대각선', `$${vtex(M.d)}$`, 'green'), rd('$\\sin45^{\\circ}$', '$\\frac{\\sqrt{2}}{2}$', 'rose')],
      rule: '45°·45°·90° 직각삼각형의 세 변의 비 = $1:1:\\sqrt{2}$',
      notes: notes('정사각형의 대각선의 길이는 $\\sqrt{2}\\times$(한 변)이에요.', '$\\sin45^{\\circ}=\\frac{1}{\\sqrt{2}}=\\frac{\\sqrt{2}}{2}$ 처럼 분모를 유리화해요.')
    }),
    gen: () => specialProblem([45], 'c45'),
    pdraw: pdrawSP
  };

  /* ---- 이어 붙인 두 직각삼각형 ---- */
  const PAIRS = [[45, 30], [45, 60], [30, 60], [60, 30], [30, 45], [60, 45]];
  const chain = {
    id: 'chainSpecial', title: '이어 붙인 두 직각삼각형', short: '이어 붙인 직각삼각형',
    question: '높이 AH를 공유한 두 직각삼각형(밑각이 30°·45°·60°)에서 밑변 BC의 길이는 어떻게 구할까?',
    ctl: ['t2h'],
    presets: () => PAIRS.map((p, i) => ({ group: i === 0 ? '밑각 (∠B, ∠C)' : '', label: `${p[0]}°, ${p[1]}°`, apply: (s) => { s.t2pair = i; }, on: (s) => (s.t2pair || 0) === i })),
    init: (s) => { s.t2h = 4; s.t2pair = 0; },
    model: (s) => chainModel(Math.round(s.t2h), PAIRS[s.t2pair || 0]),
    draw(b, s, M, C) { drawChain(b, M, { step: C.step, full: true }); },
    steps: (M) => [
      `두 직각삼각형 $ABH$, $AHC$ 가 높이 $AH=${vtex(M.h)}$ 를 공유해요. $\\angle B=${M.pair[0]}^{\\circ}$, $\\angle C=${M.pair[1]}^{\\circ}$`,
      `$\\triangle ABH$ 에서 $BH=\\frac{AH}{\\tan ${M.pair[0]}^{\\circ}}=${vtex(M.bh)}$, $\\triangle AHC$ 에서 $CH=\\frac{AH}{\\tan ${M.pair[1]}^{\\circ}}=${vtex(M.ch)}$`,
      `$BC=BH+CH=${vtex(M.bc)}$, $AB=${vtex(M.ab)}$, $AC=${vtex(M.ac)}$`
    ],
    view: (M) => ({
      guide: '<b>AH</b>를 바꾸고 칩으로 두 밑각을 골라 보세요. 공통인 변 <b>AH</b>를 먼저 구하면 두 직각삼각형을 따로 풀 수 있어요.',
      readouts: [rd('$BH$', `$${vtex(M.bh)}$`, 'sky'), rd('$CH$', `$${vtex(M.ch)}$`, 'green'), rd('$BC$', `$${vtex(M.bc)}$`, 'amber')],
      rule: '두 직각삼각형을 이어 붙인 도형 → 공통인 변(높이)을 기준으로 각각 풀고 더한다',
      notes: notes('각 삼각형의 변은 따로 구해요. 한 삼각형의 비를 다른 삼각형에 쓰지 않아요.', '$BC=BH+CH$ 예요. 분모의 근호는 유리화해서 더해요.')
    }),
    gen: () => {
      const pair = pick(PAIRS), nm = nmRand(), h0 = pick([2, 3, 4, 5, 6]);
      const hv = pick([vi(h0), vmul(vi(h0), s3), vmul(vi(h0), s2)]);
      const M = chainModel(hv, pair, true), mirror = Math.random() < 0.0;
      const givenK = pick(['ab', 'ac']), askK = pick(['bc', 'bc', 'ab', 'ac'].filter((x) => x !== givenK)), gv = M[givenK];
      const ans = M[askK];
      const wr = [[M.bh, '한 삼각형의 밑변만 구했어요.'], [M.ch, '한 삼각형의 밑변만 구했어요.'], [vmul(vi(2), M.bh), 'BH 를 두 번 더했어요.'], [vadd(M.ab, M.ac), '빗변끼리 더했어요.'], [M.h, '공통 변의 길이예요.'], [vsub(M.bh, M.ch), '더해야 하는데 뺐어요.'], [vadd(M.bc, M.h), '높이까지 더했어요.']];
      const q = {
        tag: '이어 붙인 두 직각삼각형', key: ['chain', pair.join(','), vtex(hv), givenK, askK].join('|'),
        stem: `그림과 같이 $\\angle B=${pair[0]}^{\\circ}$, $\\angle C=${pair[1]}^{\\circ}$ 이고 $AH\\perp BC$ 인 $\\triangle ABC$ 에서 $\\overline{${givenK[0].toUpperCase()}${givenK[1].toUpperCase()}}=${vtex(gv)}$ 일 때, $\\overline{${askK[0].toUpperCase()}${askK[1].toUpperCase()}}$ 의 길이는?`,
        choices: mkChoices(ans, wr),
        fig: { pair, hv: hv.v, givenK, askK, g: vcan(gv) }, given: [vcan(gv), `${pair[0]}°`, `${pair[1]}°`], ans: [vcan(ans)]
      };
      q.fig.exact = M;
      return checkQ(q, [
        `주어진 길이는 $${givenK.toUpperCase()}=${vtex(gv)}$, 두 밑각은 $${pair[0]}^{\\circ}$, $${pair[1]}^{\\circ}$입니다.`,
        `주어진 빗변을 가진 직각삼각형에서 공통 높이 $AH=${vtex(gv)}\\sin ${pair[givenK === 'ab' ? 0 : 1]}^{\\circ}=${vtex(M.h)}$입니다.`,
        `$BH=\\frac{${vtex(M.h)}}{\\tan ${pair[0]}^{\\circ}}=${vtex(M.bh)}$, $CH=\\frac{${vtex(M.h)}}{\\tan ${pair[1]}^{\\circ}}=${vtex(M.ch)}$입니다.`,
        askK === 'bc' ? `수선의 발 $H$가 $BC$ 위에 있으므로 $BC=BH+CH=${vtex(M.bh)}+${vtex(M.ch)}$입니다.` : `구하는 빗변 $${askK.toUpperCase()}=\\frac{AH}{\\sin ${pair[askK === 'ab' ? 0 : 1]}^{\\circ}}=\\frac{${vtex(M.h)}}{${vtex(sinD(pair[askK === 'ab' ? 0 : 1]))}}$입니다.`
      ], { kind: 'chain', pair, height: hv.v, givenSide: givenK, askedSide: askK, answer: ans.v });
    },
    pdraw: (b, q, C) => {
      const f = q.fig, M = f.exact;
      drawChain(b, M, { step: C.review ? C.step : 0, review: C.review, last: C.last, problem: true, givenK: f.givenK, askK: f.askK, g: f.g });
    }
  };
  function chainModel(h, pair, hIsV) {
    const hv = hIsV ? h : vi(h), t1 = tanD(pair[0]), t2 = tanD(pair[1]), s1 = sinD(pair[0]), s2_ = sinD(pair[1]);
    const bh = vdiv(hv, t1), ch = vdiv(hv, t2);
    return { h: hv, hn: hv.v, pair, bh, ch, bc: vadd(bh, ch), ab: vdiv(hv, s1), ac: vdiv(hv, s2_) };
  }
  function drawChain(b, M, o) {
    const hn = M.hn, Hp = pt(0, 0), A = pt(0, -hn), B = pt(-M.bh.v, 0), C = pt(M.ch.v, 0), st = o.step;
    fit(b, bboxOf([A, B, C]), { t: 46, b: 62, l: 60, r: 60 });
    fillPoly(b, [A, B, Hp], 'sky', 0.15); fillPoly(b, [A, Hp, C], 'green', 0.15);
    poly(b, [A, B, C], 'ink', 3.4); line(b, A, Hp, 'violet', 3.2, { dash: dashed });
    ang(b, Hp, B, A, { color: 'ink', r: 18 });
    ang(b, B, Hp, A, { color: 'amber', r: 34, label: `${M.pair[0]}°`, size: 16 }); ang(b, C, A, Hp, { color: 'rose', r: 34, label: `${M.pair[1]}°`, size: 16 });
    const cen = G.centroid([A, B, C]);
    [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, cen, n, { size: 17, gap: 11 }); });
    b.point(Hp, { color: 'violet', r: 4 }); T(b, Hp, 'H', { dy: 20, size: 17, color: 'violet' });
    const lab = (k, v) => (o.problem ? (o.givenK === k ? o.g : o.askK === k ? (o.last ? v : 'x') : null) : v);
    const col = (k) => (o.problem && o.askK === k ? 'amber' : 'sky');
    const sz = (k) => (o.problem && o.askK === k ? 21 : 17);
    const labs = { ab: lab('ab', vcan(M.ab)), ac: lab('ac', vcan(M.ac)), bc: lab('bc', vcan(M.bc)) };
    if (labs.ab) sideTag(b, A, B, cen, labs.ab, { color: col('ab'), size: sz('ab') });
    if (labs.ac) sideTag(b, A, C, cen, labs.ac, { color: o.problem ? col('ac') : 'green', size: sz('ac') });
    if (labs.bc) sideTag(b, B, C, cen, labs.bc, { color: col('bc'), size: sz('bc'), flip: false, gap: 24 });
    if (!o.problem || (o.review && st >= 2)) {
      T(b, mid(A, Hp), `AH = ${vcan(M.h)}`, { dx: -4, dy: 0, size: 16, color: 'violet', align: 'right' });
      if ((!o.problem && st >= 2) || (o.review && st >= 3)) { T(b, mid(B, Hp), `BH = ${vcan(M.bh)}`, { dy: 16, size: 15, color: 'amber' }); T(b, mid(Hp, C), `CH = ${vcan(M.ch)}`, { dy: 16, size: 15, color: 'rose' }); }
    }
  }

  /* ====================================================================== r2-1 특수각의 삼각비 표 */
  const TH = [30, 45, 60];
  const r21 = {
    id: 'r2-1', title: '특수각의 삼각비 표 만들기', short: '삼각비 표 만들기',
    question: '30°, 45°, 60°일 때 직각삼각형의 변의 비를 정리하면 sin, cos, tan 값의 표가 만들어진다. 표를 직접 채워 보자.',
    ctl: ['t2th', 't2k'],
    init: (s) => { s.t2th = 30; s.t2k = 2; },
    model: (s) => { const th = Math.round(s.t2th / 15) * 15, r = RATIO[th], k = vi(Math.round(s.t2k)); return { th, r, k, a: vmul(k, r[0]), b: vmul(k, r[1]), c: vmul(k, r[2]) }; },
    draw(b, s, M, C) {
      const g = rtGeo(M.r[0].v, M.r[1].v), st = C.step;
      const narrow = b.W < 560, cw = narrow ? Math.min(78, (b.W - 70) / 4) : 100, cx0 = (g.A.x + g.C.x) / 2;
      fit(b, rtBox(g), { t: 46, b: 190, l: 64, r: 64 });
      drawRT(b, g, {
        names: { A: 'A', B: 'B', C: 'C' }, fill: 'sky', fa: 0.08, col: { a: 'rose', b: 'sky', c: 'green' },
        side: { a: { t: st >= 1 || st === 99 ? vcan(M.a) : '', c: 'rose' }, b: { t: st >= 1 || st === 99 ? vcan(M.b) : '', c: 'sky' }, c: { t: st >= 1 || st === 99 ? vcan(M.c) : '', c: 'green' } },
        angA: { t: `${M.th}°`, c: 'amber' }
      });
      // 표: 가로 4칸(θ, 30°, 45°, 60°) · 세로 4줄
      const yb = Math.max(g.A.y, g.B.y, g.C.y), rows = [['', ...TH.map((t) => `${t}°`)], ['sin', ...TH.map((t) => vcan(sinD(t)))], ['cos', ...TH.map((t) => vcan(cosD(t)))], ['tan', ...TH.map((t) => vcan(tanD(t)))]];
      const showCol = (j) => st >= 3 || st === 99 ? true : st >= 2 ? TH[j] === M.th : false;
      rows.forEach((row, i) => row.forEach((cell, j) => {
        const x = (j - 1.5) * cw, y = 58 + i * 32;
        if (i === 0 || j === 0 ? true : showCol(j - 1)) { const cur = j > 0 && TH[j - 1] === M.th; T(b, pt(cx0, yb), cell, { dx: x, dy: y, size: i === 0 || j === 0 ? 16 : 15, color: cur ? 'amber' : i === 0 || j === 0 ? 'ink' : ['', 'rose', 'sky', 'green'][i] }); }
      }));
    },
    steps: (M) => [
      '30°, 45°, 60° 직각삼각형의 세 변의 비는 각각 $1:\\sqrt{3}:2$ (30°), $1:1:\\sqrt{2}$ (45°), $\\sqrt{3}:1:2$ (60°) 이에요.',
      `지금 $\\theta=${M.th}^{\\circ}$ 이면 대변 $${vtex(M.a)}$, 이웃변 $${vtex(M.b)}$, 빗변 $${vtex(M.c)}$ 이므로 $\\sin\\theta=${vtex(sinD(M.th))}$, $\\cos\\theta=${vtex(cosD(M.th))}$, $\\tan\\theta=${vtex(tanD(M.th))}$`,
      '세 각에 대해 모두 구하면 아래 표와 같아요. 외우기보다 변의 비 삼각형을 그려서 읽을 수 있으면 돼요.'
    ],
    view: (M) => ({
      guide: '<b>각 θ</b>를 30°, 45°, 60° 중에서 골라 보세요. 직각삼각형의 변의 비가 바뀌고 표의 해당 칸이 노랗게 표시돼요. 크기 k를 바꿔도 비의 값은 같아요.',
      readouts: [rd('$\\sin\\theta$', `$${vtex(sinD(M.th))}$`, 'rose'), rd('$\\cos\\theta$', `$${vtex(cosD(M.th))}$`, 'sky'), rd('$\\tan\\theta$', `$${vtex(tanD(M.th))}$`, 'green')],
      formula: '<p>$\\begin{array}{c|ccc} & 30^{\\circ} & 45^{\\circ} & 60^{\\circ} \\\\ \\hline \\sin & \\frac{1}{2} & \\frac{\\sqrt{2}}{2} & \\frac{\\sqrt{3}}{2} \\\\ \\cos & \\frac{\\sqrt{3}}{2} & \\frac{\\sqrt{2}}{2} & \\frac{1}{2} \\\\ \\tan & \\frac{\\sqrt{3}}{3} & 1 & \\sqrt{3} \\end{array}$</p>',
      rule: '표를 외우지 않고 변의 비 삼각형 $1:\\sqrt{3}:2$, $1:1:\\sqrt{2}$ 를 그려서 읽는다',
      notes: notes('30°와 60°에서 sin과 cos가 서로 바뀌어요. $\\sin30^{\\circ}=\\cos60^{\\circ}$', '$\\tan45^{\\circ}=1$ 은 대변과 이웃변이 같기 때문이에요.')
    }),
    gen: () => {
      // 두 변이 주어진 특수각 직각삼각형에서 각 x 구하기
      const th = pick(TH), r = RATIO[th], k = pick([vi(1), vi(2), vi(3), vi(4), vi(5)]);
      const sides = { a: vmul(k, r[0]), b: vmul(k, r[1]), c: vmul(k, r[2]) };
      const pairs = [['a', 'c'], ['b', 'c'], ['a', 'b']], nm = nmRand(), mirror = Math.random() < 0.4;
      const [k1, k2] = pick(pairs), side = {};
      side[k1] = { t: vcan(sides[k1]), c: 'sky' }; side[k2] = { t: vcan(sides[k2]), c: 'sky' };
      const q = {
        tag: '변의 비로 각 구하기', key: ['r21', th, vtex(k), k1, k2, nm.A + nm.B + nm.C, mirror].join('|'),
        stem: `$\\angle ${nm.C}=90^{\\circ}$ 인 직각삼각형 ${triName(nm)}에서 $${G.sideTag2(nm, k1)}=${vtex(sides[k1])}$, $${G.sideTag2(nm, k2)}=${vtex(sides[k2])}$ 일 때, $\\angle ${nm.A}=x$ 의 크기는? (단, $0^{\\circ}<x<90^{\\circ}$)`,
        choices: degChoices(th, [[90 - th, '대변과 이웃변이 바뀌었어요. 기준각이 어느 각인지 다시 봐요.'], [th === 45 ? 30 : 45, '변의 비가 달라요. $1:\\sqrt{3}:2$ 인지 $1:1:\\sqrt{2}$ 인지 확인해요.'], [15, '특수각이 아니에요.'], [75, '특수각이 아니에요.'], [60, '변의 비를 다시 확인해요.'], [30, '변의 비를 다시 확인해요.']], {}),
        fig: { a: r[0].v, b: r[1].v, mirror, rot: 0, names: nm, side, angA: { t: 'x', c: 'amber', size: 20 } }, given: Object.values(side).map((x) => x.t)
      };
      q.fig.reference = 'A';
      q.fig.solutionSide = Object.fromEntries(Object.entries(sides).map(([key, v]) => [key, vcan(v)]));
      const fn = k2 === 'c' ? (k1 === 'a' ? 's' : 'c') : 't';
      return checkQ(q, [
        `기준각은 $\\angle ${nm.A}=x$입니다. 주어진 두 변 $${G.sideTag2(nm, k1)}=${vtex(sides[k1])}$, $${G.sideTag2(nm, k2)}=${vtex(sides[k2])}$를 찾아요.`,
        `$${FN[fn]} x=\\frac{${vtex(sides[k1])}}{${vtex(sides[k2])}}=${vtex(vdiv(sides[k1], sides[k2]))}$입니다.`,
        '특수각의 변의 비 $1:\\sqrt{3}:2$와 $1:1:\\sqrt{2}$를 비교하되, 대변과 이웃변의 위치를 구별해요.',
        `구한 $${FN[fn]} x$의 값과 일치하는 예각을 특수각 표에서 찾습니다. $0^{\\circ}<x<90^{\\circ}$이므로 그 각 하나로 정해져요.`
      ], { kind: 'special-angle', theta: th, numerator: sides[k1].v, denominator: sides[k2].v, fn, answer: th });
    },
    pdraw: pdrawSP
  };

  /* ====================================================================== r2-2 식의 값 */
  const FORMS = [
    { id: 'f1', n: 'sin + cos − tan', sym: (a, b, c) => `\\sin ${a}^{\\circ}+\\cos ${b}^{\\circ}-\\tan ${c}^{\\circ}`, ev: (a, b, c, f) => vsub(vadd(f[0](a), f[1](b)), f[2](c)), fn: ['s', 'c', 't'], tp: (a, b, c, f) => [f[0](a), f[1](b), f[2](c)], op: ['+', '−'] },
    { id: 'f2', n: 'sin × cos + tan', sym: (a, b, c) => `\\sin ${a}^{\\circ}\\times\\cos ${b}^{\\circ}+\\tan ${c}^{\\circ}`, ev: (a, b, c, f) => vadd(vmul(f[0](a), f[1](b)), f[2](c)), fn: ['s', 'c', 't'] },
    { id: 'f3', n: 'tan × cos ÷ sin', sym: (a, b, c) => `\\tan ${a}^{\\circ}\\times\\cos ${b}^{\\circ}\\div\\sin ${c}^{\\circ}`, ev: (a, b, c, f) => vdiv(vmul(f[0](a), f[1](b)), f[2](c)), fn: ['t', 'c', 's'] },
    { id: 'f4', n: 'sin² + cos² + tan', sym: (a, b, c) => `\\sin^2 ${a}^{\\circ}+\\cos^2 ${b}^{\\circ}+\\tan ${c}^{\\circ}`, ev: (a, b, c, f) => vadd(vadd(vmul(f[0](a), f[0](a)), vmul(f[1](b), f[1](b))), f[2](c)), fn: ['s', 'c', 't'] }
  ];
  const FNF = { s: sinD, c: cosD, t: tanD };
  const fnsOf = (f) => f.fn.map((k) => FNF[k]);
  const canSym = (f, a, b, c) => ({ f1: `sin ${a}° + cos ${b}° − tan ${c}°`, f2: `sin ${a}° × cos ${b}° + tan ${c}°`, f3: `tan ${a}° × cos ${b}° ÷ sin ${c}°`, f4: `sin²${a}° + cos²${b}° + tan ${c}°` }[f.id]);
  const canVal = (f, a, b, c) => { const F = fnsOf(f), v = [F[0](a), F[1](b), F[2](c)].map(vcan); return { f1: `${v[0]} + ${v[1]} − ${v[2]}`, f2: `${v[0]} × ${v[1]} + ${v[2]}`, f3: `${v[0]} × ${v[1]} ÷ ${v[2]}`, f4: `(${v[0]})² + (${v[1]})² + ${v[2]}` }[f.id]; };
  // 기준 삼각형 두 개를 가로로 나란히 그림
  function drawRefTris(b, hl, o = {}) {
    const compact = !!o.compactQuestion && !b.thumb && b.W < 560;
    const g1 = rtGeo(1, Math.sqrt(3)), g2 = rtGeo(1, 1), narrow = b.W < 560, dx = compact ? Math.sqrt(3) + 1 : narrow ? 0 : Math.sqrt(3) + 1.3, dy = narrow && !compact ? -1.7 : 0;
    const mv = (g, d, e) => ({ A: pt(g.A.x + d, g.A.y + e), B: pt(g.B.x + d, g.B.y + e), C: pt(g.C.x + d, g.C.y + e), cen: pt(g.cen.x + d, g.cen.y + e) });
    const t1 = g1, t2 = mv(g2, dx, dy);
    fit(b, bboxOf([t1.A, t1.B, t1.C, t2.A, t2.B, t2.C]), compact ? { t: 28, b: 40, l: 32, r: 32, problemTop: 28 } : { t: 46, b: o.pb || 130, l: 56, r: 56 });
    const angle = compact ? { r: 18, d: 32 } : {};
    const mk = (g, ratio, th) => drawRT(b, g, { fill: 'sky', fa: 0.08, side: { a: { t: vcan(ratio[0]), c: 'rose' }, b: { t: vcan(ratio[1]), c: 'sky' }, c: { t: vcan(ratio[2]), c: 'green' } }, angA: { ...angle, t: `${th}°`, c: hl && hl.includes(th) ? 'amber' : 'sky' }, angB: th === 30 ? { ...angle, t: '60°', c: hl && hl.includes(60) ? 'amber' : 'sky', rings: 2 } : { ...angle, t: '45°', c: hl && hl.includes(45) ? 'amber' : 'sky', rings: 2 } });
    mk(t1, RATIO[30], 30); mk(t2, RATIO[45], 45);
    return { yb: 0, cx: (t1.A.x + t2.C.x) / 2 };
  }
  const r22 = {
    id: 'r2-2', title: '특수각의 삼각비로 식의 값 구하기', short: '식의 값',
    question: '30°, 45°, 60°의 삼각비가 섞인 식은 어떻게 계산할까? 각 항을 변의 비로 바꿔 넣어 보자.',
    ctl: ['t2a', 't2b', 't2c'],
    presets: () => FORMS.map((f, i) => ({ group: i === 0 ? '식의 모양' : '', label: f.n, apply: (s) => { s.t22f = i; }, on: (s) => (s.t22f || 0) === i })),
    init: (s) => { s.t2a = 30; s.t2b = 60; s.t2c = 45; s.t22f = 0; },
    model: (s) => { const f = FORMS[s.t22f || 0], a = Math.round(s.t2a / 15) * 15, b = Math.round(s.t2b / 15) * 15, c = Math.round(s.t2c / 15) * 15, F = fnsOf(f); return { f, a, b, c, terms: [F[0](a), F[1](b), F[2](c)], val: f.ev(a, b, c, F) }; },
    draw(b, s, M, C) {
      const st = C.step, hl = [M.a, M.b, M.c];
      const { cx } = drawRefTris(b, hl, { pb: 120 });
      const rows = [{ t: canSym(M.f, M.a, M.b, M.c), c: 'ink' }];
      if (st >= 1) rows.push({ t: '= ' + canVal(M.f, M.a, M.b, M.c), c: 'sky' });
      if (st >= 3) rows.push({ t: `= ${vcan(M.val)}`, c: 'amber' });
      rows.forEach((r, i) => T(b, pt(cx, 0), r.t, { dy: 52 + i * 30, size: 17, color: r.c }));
    },
    steps: (M) => [
      `각 항의 삼각비를 변의 비 삼각형에서 읽어요. $${M.f.sym(M.a, M.b, M.c)}$`,
      `값을 대입해요. $= ${(() => { const F = fnsOf(M.f), v = [F[0](M.a), F[1](M.b), F[2](M.c)].map(vtex); return { f1: `${v[0]}+${v[1]}-${v[2]}`, f2: `${v[0]}\\times${v[1]}+${v[2]}`, f3: `${v[0]}\\times${v[1]}\\div${v[2]}`, f4: `(${v[0]})^2+(${v[1]})^2+${v[2]}` }[M.f.id]; })()}$`,
      '곱셈·나눗셈을 먼저 하고, 분모가 다르면 통분해서 덧셈·뺄셈을 해요. 분모의 근호는 유리화해요.',
      `계산하면 $${vtex(M.val)}$ 이에요.`
    ],
    view: (M) => ({
      guide: '<b>식의 모양</b>을 칩으로 고르고 세 <b>각</b>을 바꿔 보세요. 노란 각이 지금 식에 쓰이는 각이에요. 값이 바로 계산돼요.',
      readouts: [rd('식', `$${M.f.sym(M.a, M.b, M.c)}$`, 'ink', null, null, true), rd('값', `$${vtex(M.val)}$`, 'amber', `$\\approx ${decS(M.val.v, 3)}$`)],
      rule: '각 항의 값을 대입 → 곱셈·나눗셈 먼저 → 통분해서 덧셈·뺄셈 → 분모의 유리화',
      notes: notes('$\\sin^2 30^{\\circ}$ 는 $(\\sin30^{\\circ})^2$ 이에요. $\\sin(30^{\\circ})^2$ 처럼 각을 제곱하지 않아요.', '$\\sin30^{\\circ}+\\sin60^{\\circ}\\ne\\sin90^{\\circ}$ 예요. 삼각비의 합은 각의 합의 삼각비가 아니에요.')
    }),
    gen: () => {
      const f = pick(FORMS), a = pick(TH), b = pick(TH), c = pick(TH), F = fnsOf(f), ans = f.ev(a, b, c, F);
      const alt = (g0) => { const G0 = [F[0], F[1], F[2]].map((x, i) => (g0 === i ? FNF[{ s: 'c', c: 's', t: 't' }[f.fn[i]]] : x)); return f.ev(a, b, c, G0); };
      const wr = [[alt(0), '첫째 항의 삼각비를 잘못 읽었어요. sin과 cos를 구별해요.'], [alt(1), '둘째 항의 삼각비를 잘못 읽었어요. sin과 cos를 구별해요.'], [f.ev(90 - a, b, c, F), '각을 90°에서 뺀 값으로 읽었어요.'], [f.ev(a, 90 - b, c, F), '각을 90°에서 뺀 값으로 읽었어요.'], [vadd(ans, vi(1)), '계산 과정에서 1이 달라졌어요. 한 항씩 다시 계산해요.'], [vsub(ans, vi(1)), '계산 과정에서 1이 달라졌어요. 한 항씩 다시 계산해요.'], [vmul(ans, vi(2)), '계산 과정을 다시 확인해요.']];
      const q = {
        tag: '특수각의 삼각비로 식의 값', key: ['r22', f.id, a, b, c].join('|'),
        stem: `다음 식의 값을 구하면? $${f.sym(a, b, c)}$`,
        choices: mkChoices(ans, wr, { valid: (v) => true }),
        fig: { hl: [a, b, c] }, given: []
      };
      return checkQ(q, r22.steps({ f, a, b, c, val: ans }).slice(0, 3), { kind: 'expression', form: f.id, angles: [a, b, c], answer: ans.v });
    },
    pdraw: (b, q) => { const { cx } = drawRefTris(b, q.fig.hl, { pb: 52, compactQuestion: true }); }
  };

  /* ====================================================================== r2-3 크기 비교 */
  const BAR = { sin: 'rose', cos: 'sky', tan: 'green' };
  const r23 = {
    id: 'r2-3', title: '0°~90°에서 삼각비의 크기 비교', short: '크기 비교',
    question: '각이 커지면 sin, cos, tan의 값은 어떻게 변할까? 45°를 기준으로 크기를 비교해 보자.',
    ctl: ['t23'],
    init: (s) => { s.t23 = 30; },
    model: (s) => { const th = Math.round(s.t23); const sn = th === 90 ? vi(1) : sinD(th), cs = th === 90 ? vi(0) : cosD(th), tn = th === 90 ? null : tanD(th); return { th, sn, cs, tn }; },
    draw(b, s, M, C) {
      const st = C.step, W = 3;
      fit(b, { x0: -0.1, x1: W + 0.1, y0: -0.7, y1: 4.4 }, { t: 56, b: 70, l: 70, r: 62 });
      const rows = [['sin θ', 'sin', M.sn, 0.4], ['cos θ', 'cos', M.cs, 1.7], ['tan θ', 'tan', M.tn, 3.0]];
      line(b, pt(0, -0.5), pt(0, 3.7), 'muted', 1.6); line(b, pt(1, -0.5), pt(1, 3.7), 'amber', 2.2, { dash: dashed });
      T(b, pt(1, -0.5), '1', { dy: -14, size: 16, color: 'amber' });
      rows.forEach(([nm, k, v, y]) => {
        const val = v ? v.v : null, len = val == null ? W : Math.min(W, val);
        b.path([pt(0, y), pt(len, y)], { color: BAR[k], width: 16, alpha: 0.85 });
        T(b, pt(0, y), nm, { dx: -8, size: 16, color: BAR[k], align: 'right' });
        const txt = val == null ? '없음' : val > W ? `${decS(val, 2)} …` : decS(val, 3);
        T(b, pt(len, y), txt, { dx: 10, size: 16, color: BAR[k], align: 'left' });
      });
      T(b, pt(W / 2, 4.15), `θ = ${M.th}°`, { size: 20, color: 'amber' });
      if (st >= 1 && st !== 99) { T(b, pt(0, 0.4), '↑ 커져요', { dy: -22, dx: 70, size: 14, color: 'rose' }); T(b, pt(0, 1.7), '↓ 작아져요', { dy: -22, dx: 70, size: 14, color: 'sky' }); T(b, pt(0, 3.0), '↑ 커져요', { dy: -22, dx: 70, size: 14, color: 'green' }); }
      const cmp = M.th < 45 ? 'sin θ < cos θ' : M.th > 45 ? 'sin θ > cos θ' : 'sin θ = cos θ';
      const tcmp = M.th < 45 ? 'tan θ < 1' : M.th > 45 ? 'tan θ > 1' : 'tan θ = 1';
      if (st >= 2 || st === 99) T(b, pt(W / 2, 4.15), `${cmp},  ${tcmp}`, { dy: 30, size: 16, color: 'ink' });
    },
    steps: (M) => [
      '각 θ가 0°에서 90°로 커지면 $\\sin\\theta$ 는 0에서 1까지 커지고, $\\cos\\theta$ 는 1에서 0까지 작아지고, $\\tan\\theta$ 는 0에서 한없이 커져요. ($\\tan90^{\\circ}$ 의 값은 정할 수 없어요.)',
      '$45^{\\circ}$ 에서 $\\sin45^{\\circ}=\\cos45^{\\circ}$ 이고, $\\tan45^{\\circ}=1$ 이에요. 45°가 크기가 바뀌는 경계예요.',
      `$\\theta=${M.th}^{\\circ}$ 이면 ${M.th < 45 ? '$\\sin\\theta<\\cos\\theta$, $\\tan\\theta<1$' : M.th > 45 ? '$\\sin\\theta>\\cos\\theta$, $\\tan\\theta>1$' : '$\\sin\\theta=\\cos\\theta$, $\\tan\\theta=1$'} 이에요. 이 규칙으로 보기를 판정해요.`
    ],
    view: (M) => ({
      guide: '<b>각 θ</b>를 0°에서 90°까지 움직여 보세요. 막대가 sin(분홍)·cos(하늘)·tan(초록)의 값이에요. 노란 점선이 값 1이에요. 45°를 지나면 sin과 cos의 크기가 바뀌어요.',
      readouts: [rd('$\\sin\\theta$', M.sn ? decS(M.sn.v, 4) : '', 'rose'), rd('$\\cos\\theta$', M.cs ? decS(M.cs.v, 4) : '', 'sky'), rd('$\\tan\\theta$', M.tn ? decS(M.tn.v, 4) : '없음', 'green')],
      rule: '$0^{\\circ}\\le A\\le90^{\\circ}$ 에서 A가 커지면 sin, tan는 커지고 cos는 작아진다. 45°에서 sin = cos, tan = 1',
      notes: notes('$\\sin A$, $\\cos A$ 는 0 이상 1 이하예요. $\\tan A$ 는 1보다 커질 수 있어요.', '$\\tan90^{\\circ}$ 는 정할 수 없어요. 이웃변이 0이 되기 때문이에요.')
    }),
    gen: () => {
      // 보기 5개: 각 보기는 단조성·45° 규칙으로 참 거짓이 정해지는 부등식
      const ang = () => rint(1, 17) * 5, fns = ['sin', 'cos', 'tan'], F = { sin: G.sinD, cos: G.cosD, tan: G.tanD };
      const mk = () => {
        const t = pick(['mono', 'mono', 'mono', 'half', 'one', 'val']);
        if (t === 'mono') {
          const f = pick(fns); let x = ang(), y = ang(); while (x === y || (f === 'tan' && (x >= 90 || y >= 90))) { x = ang(); y = ang(); }
          if (x > 89 || y > 89) { x = rint(2, 16) * 5; y = rint(2, 16) * 5; if (x === y) y = x + 5; }
          const op = pick(['<', '>']);
          const truth = op === '<' ? (f === 'cos' ? x > y : x < y) : (f === 'cos' ? x < y : x > y);
          return { h: `$\\${f}\\,${x}^{\\circ}${op === '<' ? '\\lt' : '\\gt'}\\${f}\\,${y}^{\\circ}$`, truth };
        }
        if (t === 'half') {
          let x = ang(); while (x === 45 || x >= 90) x = ang();
          const op = pick(['<', '>']), truth = op === '<' ? x < 45 : x > 45;
          return { h: `$\\sin\\,${x}^{\\circ}${op === '<' ? '\\lt' : '\\gt'}\\cos\\,${x}^{\\circ}$`, truth };
        }
        if (t === 'one') {
          let x = ang(); while (x === 45 || x >= 90) x = ang();
          const op = pick(['<', '>']), truth = op === '<' ? x < 45 : x > 45;
          return { h: `$\\tan\\,${x}^{\\circ}${op === '<' ? '\\lt' : '\\gt'}1$`, truth };
        }
        const pool = [['\\sin\\,0^{\\circ}=0', true], ['\\cos\\,0^{\\circ}=1', true], ['\\cos\\,90^{\\circ}=0', true], ['\\sin\\,90^{\\circ}=1', true], ['\\tan\\,45^{\\circ}=1', true], ['\\tan\\,0^{\\circ}=1', false], ['\\sin\\,90^{\\circ}=0', false], ['\\cos\\,0^{\\circ}=0', false], ['\\sin\\,45^{\\circ}=1', false], ['\\sin\\,30^{\\circ}=\\cos\\,30^{\\circ}', false], ['\\sin\\,45^{\\circ}=\\cos\\,45^{\\circ}', true]];
        const it = pick(pool); return { h: `$${it[0]}$`, truth: it[1] };
      };
      for (let tries = 0; tries < 400; tries++) {
        const lst = []; const seen = new Set(); let n = 0;
        while (lst.length < 8 && n++ < 60) { const m = mk(); if (!seen.has(m.h)) { seen.add(m.h); lst.push(m); } }
        const T0 = lst.filter((x) => x.truth), F0 = lst.filter((x) => !x.truth), askRight = Math.random() < 0.5;
        if (askRight && T0.length >= 1 && F0.length >= 4) {
          const items = [{ ...T0[0], ok: true }, ...F0.slice(0, 4).map((x) => ({ ...x, ok: false, hint: '이 식은 옳지 않아요. 크기 변화와 45° 기준을 다시 확인해요.' }))];
          return checkQ({ tag: '삼각비의 크기 비교', key: ['r23', items.map((x) => x.h).join('')].join('|'), stem: '다음 중 옳은 것은?', choices: mkTextChoices(items, 'r23' + items.map((x) => x.h).join('')), wide: true, fig: { ask: 'right' }, given: [] }, comparisonWork(true), { kind: 'comparison', askRight: true, items: items.map((x) => ({ expression: x.h, truth: x.truth, correct: x.ok })) });
        }
        if (!askRight && F0.length >= 1 && T0.length >= 4) {
          const items = [{ ...F0[0], ok: true }, ...T0.slice(0, 4).map((x) => ({ ...x, ok: false, hint: '이 식은 옳아요. 옳지 않은 것을 찾아요.' }))];
          return checkQ({ tag: '삼각비의 크기 비교', key: ['r23', items.map((x) => x.h).join('')].join('|'), stem: '다음 중 옳지 않은 것은?', choices: mkTextChoices(items, 'r23' + items.map((x) => x.h).join('')), wide: true, fig: { ask: 'wrong' }, given: [] }, comparisonWork(false), { kind: 'comparison', askRight: false, items: items.map((x) => ({ expression: x.h, truth: x.truth, correct: x.ok })) });
        }
      }
      throw new Error('r2-3 문제 생성 실패');
    },
    pdraw: (b, q) => drawTrigGraph(b)
  };
  function comparisonWork(askRight) {
    return [
      `이번 문제는 ${askRight ? '옳은' : '옳지 않은'} 식을 고릅니다. 각 식의 함수와 각도를 따로 읽어요.`,
      '$0^{\\circ}$에서 $90^{\\circ}$로 갈수록 $\\sin$은 증가하고 $\\cos$는 감소합니다. $\\tan$도 $0^{\\circ}\\le x<90^{\\circ}$에서 증가하지만 $\\tan90^{\\circ}$는 정의되지 않아요.',
      '$45^{\\circ}$에서는 $\\sin x=\\cos x$, $\\tan x=1$입니다. $45^{\\circ}$보다 작으면 $\\sin x<\\cos x$, $\\tan x<1$이고 크면 두 부등호가 반대입니다.',
      '$\\sin0^{\\circ}=0$, $\\cos0^{\\circ}=1$, $\\sin90^{\\circ}=1$, $\\cos90^{\\circ}=0$을 포함해 현재 보기의 등식과 부등식을 차례로 확인해요.'
    ];
  }
  // 문제 그림: y = sin x, cos x, tan x 의 그래프(0°~90°, 값 0~2)
  function drawTrigGraph(b, o = {}) {
    const X = 4.5, Y = 2;
    fit(b, { x0: -0.1, x1: X + 0.1, y0: -Y - 0.15, y1: 0.12 }, { t: 56, b: 52, l: 62, r: 56 });
    line(b, pt(0, 0), pt(X, 0), 'muted', 1.8); line(b, pt(0, 0), pt(0, -Y), 'muted', 1.8);
    line(b, pt(0, -1), pt(X, -1), 'muted', 1.3, { dash: dashed }); line(b, pt(X / 2, 0), pt(X / 2, -Y), 'amber', 1.8, { dash: dashed });
    const curve = (f, cl, maxV) => { const pts = []; for (let d = 0; d <= 90; d += 1.5) { const v = f(d); if (v > maxV) break; pts.push(pt((d / 90) * X, -v)); } if (pts.length > 1) b.path(pts, { color: cl, width: 3.4 }); return pts; };
    curve((d) => Math.sin(d * DEG), 'rose', Y); curve((d) => Math.cos(d * DEG), 'sky', Y); const tp = curve((d) => Math.tan(d * DEG), 'green', Y);
    [['0°', 0], ['45°', X / 2], ['90°', X]].forEach(([t, x]) => T(b, pt(x, 0), t, { dy: 18, size: 15 }));
    T(b, pt(0, -1), '1', { dx: -14, size: 15 }); T(b, pt(X, 0), 'θ', { dx: 18, dy: 0, size: 17, color: 'amber' });
    T(b, pt(X * 0.97, -Math.sin(87 * DEG)), 'sin θ', { dy: 16, dx: -26, size: 16, color: 'rose' }); T(b, pt(0.02, -1), 'cos θ', { dx: 36, dy: -18, size: 16, color: 'sky' });
    if (tp.length) T(b, tp[tp.length - 1], 'tan θ', { dx: 36, dy: 4, size: 16, color: 'green' });
  }

  /* ====================================================================== absSignJudge */
  // 식 = k + s·sin x + c·cos x + t·tan x  (계수)
  const E = (k, s, c, t) => ({ k, s, c, t });
  const evE = (e, x) => e.k + e.s * Math.sin(x * DEG) + e.c * Math.cos(x * DEG) + e.t * Math.tan(x * DEG);
  const fmtE = (e) => {
    const parts = [];
    const term = (co, name) => (Math.abs(co) === 1 ? name : `${Math.abs(co)}${name}`);
    const add1 = (co, str) => { if (!co) return; parts.push((parts.length ? (co < 0 ? '-' : '+') : (co < 0 ? '-' : '')) + str); };
    add1(e.k, String(Math.abs(e.k)));
    add1(e.s, term(e.s, '\\sin x')); add1(e.c, term(e.c, '\\cos x')); add1(e.t, term(e.t, '\\tan x'));
    return parts.length ? parts.join('') : '0';
  };
  const ABS_FORMS = [
    { f: '\\sqrt{(\\sin x-\\cos x)^2}', lo: E(0, -1, 1, 0), hi: E(0, 1, -1, 0) },
    { f: '\\sqrt{(\\sin x-\\cos x)^2}+\\sqrt{(\\sin x+\\cos x)^2}', lo: E(0, 0, 2, 0), hi: E(0, 2, 0, 0) },
    { f: '\\sqrt{(\\sin x-\\cos x)^2}+\\sqrt{(\\sin x-1)^2}', lo: E(1, -2, 1, 0), hi: E(1, 0, -1, 0) },
    { f: '\\sqrt{(\\tan x-1)^2}+\\sqrt{(1-\\tan x)^2}', lo: E(2, 0, 0, -2), hi: E(-2, 0, 0, 2) },
    { f: '\\sqrt{(1-\\cos x)^2}+\\sqrt{(\\cos x-\\sin x)^2}', lo: E(1, -1, 0, 0), hi: E(1, 1, -2, 0) },
    { f: '\\sqrt{(\\cos x-\\sin x)^2}-\\sqrt{(\\cos x+\\sin x)^2}', lo: E(0, -2, 0, 0), hi: E(0, 0, -2, 0) },
    { f: '\\sqrt{(\\sin x-\\cos x)^2}-\\sqrt{(\\cos x-1)^2}', lo: E(-1, -1, 2, 0), hi: E(-1, 1, 0, 0) }
  ];
  function drawQuarter(b, x, o = {}) {
    // 반지름 1 사분원 (원점 O, x축 오른쪽, y축 위쪽 → figure y 는 아래쪽)
    const R = 1, O = pt(0, 0);
    fit(b, { x0: -0.1, x1: 1.12, y0: -1.12, y1: 0.12 }, { t: 56, b: o.b || 66, l: 56, r: 56 });
    b.arc(O, R, -Math.PI / 2, 0, { color: 'ink', width: 3.2 });
    line(b, O, pt(1, 0), 'ink', 2.6); line(b, O, pt(0, -1), 'ink', 2.6);
    const ang45 = pt(Math.cos(45 * DEG), -Math.sin(45 * DEG));
    line(b, O, ang45, 'amber', 2.2, { dash: dashed }); T(b, ang45, '45°', { dx: 26, dy: -16, size: 16, color: 'amber' });
    if (o.range) { const [a0, a1] = o.range; b.arc(O, 0.2, -a1 * DEG, -a0 * DEG, { color: 'green', width: 7, alpha: 0.55 }); b.arc(O, R, -a1 * DEG, -a0 * DEG, { color: 'green', width: 7, alpha: 0.5 }); }
    const A = pt(Math.cos(x * DEG), -Math.sin(x * DEG)), Bf = pt(A.x, 0), Cf = pt(0, A.y);
    line(b, O, A, 'ink', 3); if (o.segs) { line(b, Bf, A, 'rose', 4); line(b, O, Bf, 'sky', 4); }
    b.point(A, { color: 'amber', r: 6 }); b.point(O, { color: 'ink', r: 4 });
    ang(b, O, pt(1, 0), A, { color: 'amber', r: 30, label: o.xlabel || 'x', size: 20, labelDist: 46 });
    if (o.segs) { T(b, mid(Bf, A), `sin x`, { dx: 34, size: 15, color: 'rose' }); T(b, mid(O, Bf), `cos x`, { dy: 20, size: 15, color: 'sky' }); ang(b, Bf, O, A, { color: 'ink', r: 14 }); }
    T(b, O, 'O', { dx: -14, dy: 14, size: 16 });
    return A;
  }
  const absJ = {
    id: 'absSignJudge', title: '[킬러] √(sin x − cos x)² 의 부호 판단', short: '[킬러] 부호 판단',
    question: '$\\sqrt{A^2}=|A|$ 이므로 sin x − cos x의 부호를 알아야 한다. 45°를 기준으로 어떻게 판단할까?',
    ctl: ['t24'],
    init: (s) => { s.t24 = 30; },
    model: (s) => { const x = Math.round(s.t24), sn = Math.sin(x * DEG), cs = Math.cos(x * DEG); return { x, sn, cs, d: sn - cs, lo: x < 45, eq: x === 45 }; },
    draw(b, s, M, C) {
      drawQuarter(b, M.x, { segs: true, xlabel: `${M.x}°`, b: 112 });
      const st = C.step, cx = 0.5;
      T(b, pt(cx, 0), `sin x = ${decS(M.sn, 3)}   cos x = ${decS(M.cs, 3)}`, { dy: 40, size: 16, color: 'ink' });
      if (st >= 2 || st === 99) T(b, pt(cx, 0), `sin x − cos x = ${decS(M.d, 3)} ${M.eq ? '= 0' : M.lo ? '< 0' : '> 0'}`, { dy: 68, size: 16, color: M.lo ? 'rose' : 'green' });
      if (st >= 3 || st === 99) T(b, pt(cx, 0), M.eq ? '√(sin x − cos x)² = 0' : `√(sin x − cos x)² = ${M.lo ? 'cos x − sin x' : 'sin x − cos x'}`, { dy: 96, size: 16, color: 'amber' });
    },
    steps: (M) => [
      '$\\sqrt{A^2}=|A|$ 예요. 근호 속 식 $A=\\sin x-\\cos x$ 의 부호를 알아야 절댓값을 풀 수 있어요.',
      `$x=${M.x}^{\\circ}$ 는 $45^{\\circ}$ 보다 ${M.eq ? '같으므로 $\\sin x=\\cos x$' : M.lo ? '작으므로 $\\sin x<\\cos x$ 예요. 그래서 $\\sin x-\\cos x<0$' : '크므로 $\\sin x>\\cos x$ 예요. 그래서 $\\sin x-\\cos x>0$'}`,
      `${M.eq ? '$\\sqrt{(\\sin x-\\cos x)^2}=0$' : M.lo ? '음수의 절댓값은 부호를 바꿔요. $\\sqrt{(\\sin x-\\cos x)^2}=-(\\sin x-\\cos x)=\\cos x-\\sin x$' : '양수의 절댓값은 그대로예요. $\\sqrt{(\\sin x-\\cos x)^2}=\\sin x-\\cos x$'}`
    ],
    view: (M) => ({
      guide: '<b>각 x</b>를 45°의 왼쪽과 오른쪽으로 움직여 보세요. 분홍 선분이 sin x, 하늘색 선분이 cos x예요. 45°에서 두 길이가 같아지고, 그 앞뒤로 부호가 바뀌어요.',
      readouts: [rd('$\\sin x-\\cos x$', decS(M.d, 3), M.lo ? 'rose' : 'green', M.eq ? '0' : M.lo ? '음수' : '양수'), rd('$\\sqrt{(\\sin x-\\cos x)^2}$', M.eq ? '0' : M.lo ? '$\\cos x-\\sin x$' : '$\\sin x-\\cos x$', 'amber')],
      rule: '$0^{\\circ}<x<45^{\\circ}$ 이면 $\\sin x<\\cos x$,  $45^{\\circ}<x<90^{\\circ}$ 이면 $\\sin x>\\cos x$ → 근호 속 부호를 정한 뒤 $\\sqrt{A^2}=|A|$',
      notes: notes('$\\sqrt{A^2}=A$ 가 아니에요. $A$ 가 음수이면 $-A$ 예요.', '각이 45°보다 큰지 작은지를 먼저 확인해요.')
    }),
    gen: () => {
      const f = pick(ABS_FORMS), lo = Math.random() < 0.5, ok = lo ? f.lo : f.hi, other = lo ? f.hi : f.lo;
      const rng = lo ? [0, 45] : [45, 90], xs = lo ? [12, 25, 38] : [52, 65, 80];
      const eqE = (a, b) => xs.every((x) => Math.abs(evE(a, x) - evE(b, x)) < 1e-9);
      const neg = (e) => E(-e.k, -e.s, -e.c, -e.t);
      const cand = [other, neg(ok), neg(other), E(ok.k, -ok.s, ok.c, ok.t), E(ok.k, ok.s, -ok.c, ok.t), E(-ok.k, ok.s, ok.c, ok.t), E(ok.k, ok.s, ok.c, -ok.t), E(0, ok.s, ok.c, ok.t)];
      const wrongs = []; cand.forEach((e) => { if (!eqE(e, ok) && !wrongs.some((w) => eqE(w, e)) && fmtE(e) !== fmtE(ok)) wrongs.push(e); });
      if (wrongs.length < 4) return absJ.gen();
      const items = [{ h: `$${fmtE(ok)}$`, ok: true }, ...sample(wrongs, 4).map((e, i) => ({ h: `$${fmtE(e)}$`, ok: false, hint: '근호 속 식의 부호를 45° 기준으로 다시 판단해요.' }))];
      const xm = Math.round((rng[0] + rng[1]) / 2);
      const q = {
        tag: lo ? '[킬러] 45°보다 작은 각' : '[킬러] 45°보다 큰 각', key: ['abs', f.f, lo, items.map((x) => x.h).join('')].join('|'),
        stem: `$${rng[0]}^{\\circ}<x<${rng[1]}^{\\circ}$ 일 때, $${f.f}$ 를 간단히 하면?`,
        choices: mkTextChoices(items, 'abs' + f.f + lo + items.map((x) => x.h).join('')), wide: true,
        fig: { range: rng, xm }, given: [`${rng[0]}°`, `${rng[1]}°`].filter((t) => t !== '0°' && t !== '90°')
      };
      return checkQ(q, [
        `현재 범위는 $${rng[0]}^{\\circ}<x<${rng[1]}^{\\circ}$입니다. 식 $${f.f}$에서 각 제곱근을 $\\sqrt{U^2}=|U|$로 바꿔요.`,
        lo ? '$x<45^{\\circ}$이므로 $\\sin x<\\cos x$, $\\tan x<1$입니다. 따라서 $\\sin x-\\cos x$와 $\\tan x-1$은 음수예요.' : '$x>45^{\\circ}$이므로 $\\sin x>\\cos x$, $\\tan x>1$입니다. 따라서 $\\sin x-\\cos x$와 $\\tan x-1$은 양수예요.',
        '예각에서는 $0<\\sin x<1$, $0<\\cos x<1$입니다. 따라서 $\\sin x+\\cos x>0$, $\\sin x-1<0$, $\\cos x-1<0$도 함께 확인해요.',
        '음수인 식의 절댓값에는 마이너스를 붙이고, 양수인 식은 그대로 둡니다. 바깥의 덧셈·뺄셈 부호를 유지해 동류항을 정리해요.'
      ], { kind: 'absolute', expression: f.f, range: rng, coefficients: ok });
    },
    pdraw: (b, q, C) => {
      drawQuarter(b, q.fig.xm, { range: q.fig.range, b: 52, segs: C.review && C.step >= 2 });
    }
  };

  G.specialProblem = specialProblem; G.chainModel = chainModel; G.drawChain = drawChain; G.RATIO = RATIO;
  G.register(20, 't2', '② 30°·45°·60°', '30°·45°·60°', PARAMS, [cut3060, cut45, chain, r21, r22, r23, absJ]);
})();
