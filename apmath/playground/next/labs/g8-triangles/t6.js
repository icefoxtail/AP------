/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ⑥ 「내심」 (t6.js, order 60) — 장면 8개
   · n1 내심 I            · 세 각의 이등분선이 한 점 I에서 만남, I에서 세 변까지의 거리(수선의 발 D·E·F)가 같음
   · n2 내접원과 넓이      · S = ½·r·(a+b+c) — 삼각형 I를 세 조각으로 나누기
   · n3 접선의 길이        · AF=AE, BF=BD, CD=CE를 색 막대로
   · n4 직각삼각형의 내접원 · 직각 꼭짓점 쪽 정사각형, r=(a+b−c)÷2
   · n5 내심의 각          · x+y+z=90°, ∠BIC=90°+½∠A
   · n6 내심을 지나는 평행선 · △ADE의 둘레 = AB+AC
   · n7 각의 비            · ∠AIB:∠BIC:∠CIA=a:b:c → ∠A
   · n8 변의 길이로 접선 길이 구하기 · AB, AC, BC → AF
   각은 정수(도), 길이는 정수(cm)만 보입니다. 피타고라스 정리(√)는 쓰지 않습니다(정수 변의 삼각형 표만 사용).
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, polar, angBetween, inter, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, numProb, mkStmtChoices, degOpts, cmOpts, rd, notes, fmtN, dg, bboxOf, fs, dim, foot, incenter, triBC, triSSS } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const S = (n) => `$\\overline{${n}}$`;
  const fr = (n, d) => `\\frac{${n}}{${d}}`;
  const ARn = { tex: (x) => `${x}\\text{ cm}^2`, plain: (x) => x + ' cm²', pad: 2, valid: (x) => Number.isInteger(x) && x > 0 };

  // 정수 변의 삼각형 표 (a=BC, b=CA, c=AB, 내접원 반지름 r): r 이 정수
  const TRI = [[3, 4, 5, 1], [6, 8, 10, 2], [5, 12, 13, 2], [13, 14, 15, 4], [9, 10, 17, 2], [8, 15, 17, 3], [9, 12, 15, 3]];
  const triF = (v) => { const t = TRI[clamp(Math.round(v), 0, TRI.length - 1)]; return `${t[0]}, ${t[1]}, ${t[2]} cm`; };

  const PARAMS = {
    trNa: P('∠A의 반 (●)', 20, 40, 1, 30, { color: 'sky', format: (v) => v + '°' }),
    trNb: P('∠B의 반 (×)', 20, 40, 1, 30, { color: 'green', format: (v) => v + '°' }),
    trNr: P('내접원의 반지름 r', 2, 6, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    trNi: P('삼각형 고르기 (BC, CA, AB)', 0, 6, 1, 3, { color: 'sky', format: triF }),
    trNx: P('AF = AE', 2, 8, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    trNy: P('BF = BD', 2, 8, 1, 3, { color: 'sky', format: (v) => v + ' cm' }),
    trNz: P('CD = CE', 2, 8, 1, 5, { color: 'green', format: (v) => v + ' cm' }),
    trNj: P('삼각형 고르기 (직각변, 직각변, 빗변)', 0, 6, 1, 1, { color: 'sky', format: (v) => { const t = RT[clamp(Math.round(v), 0, RT.length - 1)]; return `${t[0]}, ${t[1]}, ${t[2]} cm`; } }),
    trNp: P('AB', 4, 12, 1, 9, { color: 'sky', format: (v) => v + ' cm' }),
    trNq: P('AC', 4, 12, 1, 7, { color: 'green', format: (v) => v + ' cm' }),
    trNs: P('BC', 3, 20, 1, 8, { color: 'amber', format: (v) => v + ' cm' }),
    trNm: P('비 a', 1, 13, 1, 7, { color: 'sky', format: (v) => String(v) }),
    trNn: P('비 b', 1, 13, 1, 8, { color: 'green', format: (v) => String(v) }),
    trNo: P('비 c', 1, 13, 1, 9, { color: 'amber', format: (v) => String(v) })
  };
  const RT = [[3, 4, 5, 1], [6, 8, 10, 2], [5, 12, 13, 2], [9, 12, 15, 3], [8, 15, 17, 3], [12, 16, 20, 4], [7, 24, 25, 3]];

  // 꼭짓점 A,B,C 로 내심·내접원·접점
  function incGeom(A, B, Cc) {
    const I = incenter(A, B, Cc), D = foot(I, B, Cc), E = foot(I, Cc, A), F = foot(I, A, B);
    return { A, B, C: Cc, I, D, E, F, r: dist(I, D) };
  }
  const fromAngles = (Ad, Bd, Cd) => { const [A, B, Cc] = triBC(2, Bd, Cd); return incGeom(A, B, Cc); };
  const fromSides = (a, b, c) => { const T3 = triSSS(a, b, c); // A=(0,0), B=(c,0), C 위
    // triSSS(a,b,c): A=(0,0),B=(c,0),C=(x,−h) → 이름 그대로 사용(B 오른쪽 아래, A 왼쪽 아래). 우리는 B 왼쪽·C 오른쪽·A 위로 다시 놓음
    const Bp = pt(0, 0), Cp = pt(a, 0), xx = (c * c - b * b + a * a) / (2 * a), hh = Math.sqrt(Math.max(1e-9, c * c - xx * xx)); void T3; return incGeom(pt(xx, -hh), Bp, Cp); };
  const nameV = (b, g, cen, o = {}) => { tagOut(b, g.A, cen, 'A', { size: 18 }); tagOut(b, g.B, cen, 'B', { size: 18 }); tagOut(b, g.C, cen, 'C', { size: 18 }); };
  const drawBase = (b, g, o = {}) => {
    const { A, B, C: Cc, I } = g;
    b.circle(I, g.r, { color: 'amber', width: 2.6, alpha: 0.85 });
    fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.6);
  };
  const feetNames = (b, g, I) => { tagOut(b, g.D, I, 'D', { size: 16, gap: 8, color: 'green', nameColor: 'green' }); tagOut(b, g.E, I, 'E', { size: 16, gap: 8 }); tagOut(b, g.F, I, 'F', { size: 16, gap: 8 }); };

  /* -------------------------------------------------------------------- 풀이 흐름: 장면별 풀이 (문제와 같은 상태·같은 숫자)
     원칙: 그림 안에는 점 이름만 · 지금 단계만 색(앞 단계는 회색) · 대칭으로 같은 쪽은 주어진 것에서만 진하게 · 좁은 각은 x 만 두고 값은 그림 아래 한 줄에 */
  const SVB = G.svB, { stmtDyn, xLbl, xOut, mobileQuestionFrame } = SVB; void xOut;
  const nBase = (o = {}) => (b, M) => { const g = M.g; if (!o.noCirc) b.circle(g.I, g.r, { color: 'green', width: 2.4, alpha: 0.8 }); fillPoly(b, [g.A, g.B, g.C], 'sky', 0.07); poly(b, [g.A, g.B, g.C], 'ink', 3.4); };
  const nTop = (o = {}) => (b, M, s, X) => {
    const g = o.geom ? o.geom(M) : M.g, { A, B, C: Cc, I, D, E, F } = g;
    b.point(I, { color: 'green', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
    if (!o.noFeet) [D, E, F].forEach((z) => b.point(z, { color: 'rose', r: 3.8 }));
    T(b, I, 'I', { dx: o.idx == null ? 14 : o.idx, dy: o.idy == null ? -14 : o.idy, size: 18, color: 'green' });
    tagOut(b, A, I, 'A', { size: 18 }); tagOut(b, B, I, 'B', { size: 18 }); tagOut(b, Cc, I, 'C', { size: 18 });
    if (!o.noFeet) { tagOut(b, D, I, 'D', { size: 16, gap: 8 }); tagOut(b, E, I, 'E', { size: 16, gap: 8 }); tagOut(b, F, I, 'F', { size: 16, gap: 8 }); }
  };
  const nBox = (M) => bboxOf([M.g.A, M.g.B, M.g.C]);
  const ringMarks = (L, g, o = {}) => {
    const { A, B, C: Cc, I } = g, r = o.r || 30, fa = 0.4;
    L.ang(A, B, I, { color: 'sky', r, rings: 1, fa }); L.ang(A, I, Cc, { color: 'sky', r, rings: 1, fa });
    L.ang(B, A, I, { color: 'green', r, rings: 2, fa }); L.ang(B, I, Cc, { color: 'green', r, rings: 2, fa });
    L.ang(Cc, B, I, { color: 'violet', r, rings: 3, fa }); L.ang(Cc, I, A, { color: 'violet', r, rings: 3, fa });
  };
  const bisL = (L, g, col = 'green', w = 3) => [g.A, g.B, g.C].forEach((z) => L.ln(z, g.I, col, w, { dash: [7, 5] }));
  const feetL = (L, g, col = 'rose', w = 3) => [[g.D, g.B], [g.E, g.C], [g.F, g.A]].forEach(([Q, p]) => { L.ln(g.I, Q, col, w); L.ang(Q, g.I, p, { color: col, r: 14 }); });
  const feetTags = (L, g, X, f, col = 'rose') => { const { I, D, E, F } = g; [D, E, F].forEach((Q) => L.sd(I, Q, pt(I.x, I.y - 50), f, { color: col, size: fs(X.b, 15), gap: 8 })); };
  const NLEG = 'I: 내심 · D, E, F: 접점(수선의 발)';
  const abO = (b, g, f = 0.2) => ({ dx: (g.B.x - g.A.x) * f * (b.k || 60), dy: -(g.B.y - g.A.y) * f * (b.k || 60) }); // 빗변·AB 의 길이 글자는 접점 F 이름과 겹치지 않게 B 쪽으로 옮겨요
  const bcDx = (b, g, avoidBD) => (avoidBD ? ((g.D.x + g.C.x) / 2 - (g.B.x + g.C.x) / 2) * (b.k || 60) : -0.3 * dist(g.B, g.C) * (b.k || 60)); // 밑변 BC 의 길이 글자는 접점 D 이름과 겹치지 않게 왼쪽으로 옮겨요

  /* ---------------------------------------------------------------- 1. 내심 */
  const N1POOL = [
    { h: '$\\overline{ID}=\\overline{IE}=\\overline{IF}$', f: () => true, w: () => '내심 I는 각의 이등분선 위의 점이고, 각의 이등분선 위의 점은 그 각의 두 변에서 같은 거리에 있어요. 세 각 모두 그래서 I에서 세 변까지의 거리가 같아요.', c: () => 'ID=IE=IF (내접원의 반지름)', d: (L, M, s, X) => { const g = M.g; feetL(L, g, 'rose', 4); [g.D, g.E, g.F].forEach((Q) => L.tk(g.I, Q, 1, 'rose')); L.circ(g.I, g.r, 'green', 3); } },
    { h: '$\\angle IAB=\\angle IAC$', f: () => true, w: () => 'I는 세 내각의 이등분선의 교점이에요. AI는 ∠A의 이등분선이라서 두 각이 같아요.', c: () => 'AI는 ∠A의 이등분선 → ∠IAB=∠IAC', d: (L, M) => { const { A, B, C: Cc, I } = M.g; L.ln(A, I, 'green', 4.4); L.ang(A, B, I, { color: 'sky', r: 30, fa: 0.4 }); L.ang(A, I, Cc, { color: 'sky', r: 30, fa: 0.4 }); } },
    { h: '$\\overline{ID}\\perp\\overline{BC}$', f: () => true, w: () => 'D는 I에서 BC에 내린 수선의 발이라고 문제에 주어졌어요.', c: () => 'D는 수선의 발 → ID⊥BC', d: (L, M) => { const { I, D, B } = M.g; L.ln(I, D, 'rose', 4.4); L.ang(D, I, B, { color: 'rose', r: 18 }); } },
    { h: '$\\overline{AE}=\\overline{AF}$', f: () => true, w: () => '△IAE와 △IAF에서 AI가 공통이고 ∠IAE=∠IAF, ∠IEA=∠IFA=90°이므로 RHA 합동이에요. 그래서 AE=AF.', c: () => '△IAE≡△IAF (RHA) → AE=AF', d: (L, M) => { const { A, E, F, I } = M.g; L.fl([I, A, E], 'sky', 0.2); L.fl([I, A, F], 'sky', 0.2); L.ln(A, E, 'amber', 5); L.ln(A, F, 'amber', 5); L.tk(A, E, 1, 'amber'); L.tk(A, F, 1, 'amber'); L.ln(A, I, 'green', 3, { dash: [7, 5] }); } },
    { h: '$\\overline{BD}=\\overline{BF}$', f: () => true, w: () => '△IBD와 △IBF에서 BI가 공통이고 ∠IBD=∠IBF, ∠IDB=∠IFB=90°이므로 RHA 합동이에요. 그래서 BD=BF.', c: () => '△IBD≡△IBF (RHA) → BD=BF', d: (L, M) => { const { B, D, F, I } = M.g; L.fl([I, B, D], 'green', 0.2); L.fl([I, B, F], 'green', 0.2); L.ln(B, D, 'amber', 5); L.ln(B, F, 'amber', 5); L.tk(B, D, 2, 'amber'); L.tk(B, F, 2, 'amber'); L.ln(B, I, 'green', 3, { dash: [7, 5] }); } },
    { h: '$\\overline{IA}=\\overline{IB}=\\overline{IC}$', f: (m) => Math.abs(dist(m.g.I, m.g.A) - dist(m.g.I, m.g.B)) < 1e-6 && Math.abs(dist(m.g.I, m.g.B) - dist(m.g.I, m.g.C)) < 1e-6, w: () => '내심에서 같은 거리인 것은 세 변까지의 거리(ID, IE, IF)예요. 꼭짓점까지의 거리 IA, IB, IC는 서로 달라요 (이 그림에서도 달라요). 외심과 헷갈리지 않게 조심해요.', c: () => 'IA, IB, IC의 길이가 서로 달라요 (반례)', d: (L, M) => { const { A, B, C: Cc, I } = M.g; L.ln(I, A, 'rose', 4.4); L.ln(I, B, 'rose', 4.4); L.ln(I, Cc, 'rose', 4.4); L.tk(I, A, 1, 'rose'); L.tk(I, B, 2, 'rose'); L.tk(I, Cc, 3, 'rose'); } },
    { h: '$\\overline{BD}=\\overline{CD}$', f: (m) => Math.abs(dist(m.g.B, m.g.D) - dist(m.g.C, m.g.D)) < 1e-6, w: () => 'BD=BF, CD=CE이고 BF, CE는 일반적으로 서로 달라요. D는 BC의 중점이 아니에요 (이 그림에서도 BD와 CD가 달라요).', c: () => 'BD, CD의 길이가 달라요 (반례)', d: (L, M) => { const { B, C: Cc, D } = M.g; L.ln(B, D, 'sky', 5); L.ln(D, Cc, 'violet', 5); L.tk(B, D, 1, 'sky'); L.tk(D, Cc, 2, 'violet'); } },
    { h: '$\\angle IAB=\\angle IBA$', f: (m) => m.al === m.be, w: (M) => `∠IAB=½∠A=${M.al}°이고 ∠IBA=½∠B=${M.be}°로 서로 달라요 (반례). ∠IAB=∠IAC, ∠IBA=∠IBC는 맞지만 ∠IAB와 ∠IBA가 같은 건 아니에요.`, c: (M) => `∠IAB=${M.al}°, ∠IBA=${M.be}° — 달라요`, d: (L, M) => { const { A, B, I } = M.g; L.ang(A, B, I, { color: 'sky', r: 34, label: dg(M.al), size: 15, labelDist: 56 }); L.ang(B, A, I, { color: 'green', r: 34, label: dg(M.be), size: 15, labelDist: 56 }); } },
    { h: '$\\overline{AF}=\\overline{BF}$', f: (m) => Math.abs(dist(m.g.A, m.g.F) - dist(m.g.B, m.g.F)) < 1e-6, w: () => 'AF=AE, BF=BD이지만 AF와 BF는 서로 다른 점에서 그은 접선의 길이라서 일반적으로 같지 않아요 (반례).', c: () => 'AF, BF의 길이가 달라요 (반례)', d: (L, M) => { const { A, B, F } = M.g; L.ln(A, F, 'amber', 5); L.ln(F, B, 'sky', 5); L.tk(A, F, 1, 'amber'); L.tk(F, B, 2, 'sky'); } },
    { h: '$\\overline{AD}=\\overline{BD}$', f: (m) => Math.abs(dist(m.g.A, m.g.D) - dist(m.g.B, m.g.D)) < 1e-6, w: () => 'AD는 꼭짓점 A에서 접점 D까지의 선분이고 BD는 접선의 길이예요. 일반적으로 서로 달라요 (반례).', c: () => 'AD, BD의 길이가 달라요 (반례)', d: (L, M) => { const { A, B, D } = M.g; L.ln(A, D, 'amber', 5); L.ln(B, D, 'sky', 5); L.tk(A, D, 1, 'amber'); L.tk(B, D, 2, 'sky'); } }
  ];
  const n1Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 3, { al, r } = M, out = [];
      if (v === 2) return SVB.stmtSteps(n1.prob(M, s), N1POOL, M, false, s);
      if (v === 0) {
        out.push({ k: 'given', f: 'given', t: `점 I는 △ABC의 내심이고 $\\angle A=${2 * al}^{\\circ}$예요. $\\angle IAB$의 크기 $x$를 구해요.`, cap: `∠A=${2 * al}°, ∠IAB=x` });
        out.push({ k: 'idea', f: 'idea', t: '내심은 세 내각의 이등분선이 만나는 점이에요. 그래서 AI는 ∠A를 똑같이 둘로 나누는 선이에요.', cap: 'I는 내심 → AI는 ∠A의 이등분선' });
        out.push({ k: 'fig', f: 'bis', lb: '이등분선', t: 'AI가 ∠A의 이등분선이므로 $\\angle IAB=\\angle IAC=\\frac{1}{2}\\angle A$.', cap: '∠IAB=∠IAC=\\frac{1}{2}∠A' });
        out.push({ k: 'eq', f: 'eq', t: `$x=\\frac{1}{2}\\angle A=\\frac{1}{2}\\times${2 * al}^{\\circ}=${al}^{\\circ}$`, cap: `x=\\frac{1}{2}×${2 * al}°=${al}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${al}^{\\circ}$`, cap: `x = ${al}°` });
      } else {
        out.push({ k: 'given', f: 'given', t: `점 I는 △ABC의 내심이고 D, E, F는 I에서 각 변에 내린 수선의 발이에요. $\\overline{ID}=${r}$ cm일 때 $\\overline{IE}$의 길이 $x$를 구해요.`, cap: `ID=${r} cm, IE=x` });
        out.push({ k: 'idea', f: 'idea', t: '내심은 각의 이등분선 위의 점이에요. 각의 이등분선 위의 점은 그 각의 두 변에서 같은 거리에 있어요. 그러니 I에서 세 변까지의 거리가 모두 같을 거예요.', cap: '각의 이등분선 위의 점 → 두 변까지의 거리가 같다' });
        out.push({ k: 'fig', f: 'bisC', lb: '이등분선', t: 'CI는 ∠C의 이등분선이에요. I는 CI 위의 점이라서 두 변 CB, CA까지의 거리가 같아요: $\\overline{ID}=\\overline{IE}$.', cap: 'CI는 ∠C의 이등분선 → ID=IE' });
        out.push({ k: 'fig', f: 'all', lb: '세 거리', t: `AI, BI도 각의 이등분선이라서 $\\overline{IE}=\\overline{IF}$, $\\overline{IF}=\\overline{ID}$예요. 세 거리 ID, IE, IF는 모두 내접원의 반지름이고 ${r} cm예요.`, cap: `ID=IE=IF=${r} cm (내접원의 반지름)` });
        out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{IE}=\\overline{ID}=${r}$ cm`, cap: `x=IE=ID=${r} cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${r}\\text{ cm}$`, cap: `x = ${r} cm` });
      }
      return out;
    },
    draw: SVB.runner({
      ...mobileQuestionFrame(nBox, NLEG), base: nBase(), top: nTop(),
      dyn: (name, M, s) => stmtDyn(N1POOL, n1.prob)(name, M, s),
      st: {
        given: (L, M, s, X) => {
          const g = M.g, v = (s.trV || 0) % 3, { A, B, C: Cc, I, D } = g;
          bisL(L, g); feetL(L, g); ringMarks(L, g);
          // 전체 각의 숫자는 A 바깥에 연결하고 반쪽 x는 A 안쪽에 둡니다.
          // 고정 82px 거리가 내심 I를 넘어가지 않도록 모바일만 조정합니다.
          if (v === 0) L.ang(A, B, Cc, { color: 'sky', r: X.nw ? Math.min(50, .4 * dist(A, I) * X.b.k) : 62, fa: 0.06, label: dg(2 * M.al), size: 16, labelDist: X.nw ? 40 : 82, labelRot: X.nw ? -65 : 0, keep: true });
          if (v === 1) L.sd(I, D, pt(I.x, I.y - 50), `${M.r} cm`, { color: 'rose', size: fs(X.b, 15), gap: 8, keep: true });
        },
        bis: (L, M) => { const { A, B, C: Cc, I } = M.g; L.ln(A, I, 'green', 4.4); L.ang(A, B, I, { color: 'sky', r: 32, fa: 0.4 }); L.ang(A, I, Cc, { color: 'sky', r: 32, fa: 0.4 }); },
        bisC: (L, M, s, X) => { const { B, C: Cc, A, I, D, E } = M.g; L.ln(Cc, I, 'green', 4.4); L.ang(Cc, B, I, { color: 'violet', r: 32, fa: 0.4 }); L.ang(Cc, I, A, { color: 'violet', r: 32, fa: 0.4 }); L.ln(I, D, 'rose', 4.4); L.ln(I, E, 'rose', 4.4); L.tk(I, D, 1, 'rose'); L.tk(I, E, 1, 'rose'); },
        all: (L, M, s, X) => { const g = M.g; feetL(L, g, 'rose', 4); [g.D, g.E, g.F].forEach((Q) => L.tk(g.I, Q, 1, 'rose')); L.circ(g.I, g.r, 'green', 3.2); }
      },
      x: (b, M, s, X) => {
        const { A, B, I, E } = M.g, v = (s.trV || 0) % 3;
        if (v === 0) ang(b, A, B, I, { noMark: true, color: 'amber', label: xLbl(X, M.al), size: 17, labelDist: X.nw ? Math.min(46, .32 * dist(A, I) * b.k) : 46 });
        else if (v === 1) { if (!X.at('all')) G.sideTag(b, I, E, pt(I.x, I.y + 30), X.xVal ? `${M.r} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 15 : 18), gap: 8 }); }
      }
    })
  };

  /* ---------------------------------------------------------------- 2. 내접원과 넓이 */
  const n2Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 2, { a, b: bb, c, r, L: L0, area } = M, out = [];
      out.push({ k: 'given', f: 'given', t: v === 0 ? `점 I는 △ABC의 내심이고 $\\overline{BC}=${a}$ cm, $\\overline{CA}=${bb}$ cm, $\\overline{AB}=${c}$ cm, 내접원의 반지름은 ${r} cm예요. △ABC의 넓이 $x$를 구해요.` : `점 I는 △ABC의 내심이고 $\\overline{BC}=${a}$ cm, $\\overline{CA}=${bb}$ cm, $\\overline{AB}=${c}$ cm, △ABC의 넓이는 ${area} cm²예요. 내접원의 반지름 $x$를 구해요.`, cap: v === 0 ? `BC=${a}, CA=${bb}, AB=${c}, r=${r} (cm), 넓이=x` : `BC=${a}, CA=${bb}, AB=${c} (cm), 넓이=${area} cm², r=x` });
      out.push({ k: 'idea', f: 'idea', t: '내심 I에서 세 꼭짓점으로 선을 그으면 삼각형이 세 조각으로 나뉘어요. 세 조각의 높이가 모두 내접원의 반지름 r이라서, 밑변만 다르고 높이가 같은 삼각형의 넓이를 더하면 돼요.', cap: '△ABC = △IBC + △ICA + △IAB (높이는 모두 r)' });
      out.push({ k: 'fig', f: 'split', lb: '세 조각', t: 'IA, IB, IC를 그으면 △ABC가 △IBC, △ICA, △IAB 세 삼각형으로 나뉘어요.', cap: '△ABC = △IBC + △ICA + △IAB' });
      out.push({ k: 'fig', f: 'h', lb: '높이와 밑변', t: v === 0 ? `내접원의 반지름 ID, IE, IF는 각 변에 수직이라서 세 삼각형의 높이는 모두 $r=${r}$ cm예요. 밑변은 각각 ${a}, ${bb}, ${c} cm.` : `내접원의 반지름 ID, IE, IF는 각 변에 수직이라서 세 삼각형의 높이는 모두 $r$이에요. 밑변은 각각 ${a}, ${bb}, ${c} cm.`, cap: v === 0 ? `밑변 ${a}, ${bb}, ${c} · 높이 모두 r=${r}` : `밑변 ${a}, ${bb}, ${c} · 높이 모두 r` });
      if (v === 0) {
        out.push({ k: 'eq', f: 'eq', t: `$\\triangle ABC=\\frac{1}{2}\\times${a}\\times${r}+\\frac{1}{2}\\times${bb}\\times${r}+\\frac{1}{2}\\times${c}\\times${r}=\\frac{1}{2}\\times${r}\\times(${a}+${bb}+${c})$`, cap: `x=\\frac{1}{2}×${r}×(${a}+${bb}+${c})` });
        out.push({ k: 'eq', f: 'eq2', t: `$x=\\frac{1}{2}\\times${r}\\times${L0}=${area}$ (cm²)`, cap: `x=\\frac{1}{2}×${r}×${L0}=${area} cm²` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${area}\\text{ cm}^2$`, cap: `x = ${area} cm²` });
      } else {
        out.push({ k: 'eq', f: 'eq', t: `$\\triangle ABC=\\frac{1}{2}\\times${a}\\times r+\\frac{1}{2}\\times${bb}\\times r+\\frac{1}{2}\\times${c}\\times r=\\frac{1}{2}\\times r\\times(${a}+${bb}+${c})=\\frac{1}{2}\\times r\\times${L0}$이고 넓이가 ${area}이므로 $\\frac{1}{2}\\times r\\times${L0}=${area}$.`, cap: `\\frac{1}{2}×r×${L0}=${area}` });
        out.push({ k: 'eq', f: 'eq2', t: `$x=r=\\frac{2\\times${area}}{${L0}}=${r}$ (cm)`, cap: `x=\\frac{2×${area}}{${L0}}=${r} cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${r}\\text{ cm}$`, cap: `x = ${r} cm` });
      }
      return out;
    },
    draw: SVB.runner({
      box: nBox, base: nBase(), top: nTop(), legend: (M, s) => NLEG + ((s.trV || 0) % 2 === 0 ? ' · x: △ABC의 넓이' : ` · 넓이 ${M.area} cm²`),
      st: {
        given: (L, M, s, X) => {
          const g = M.g, { A, B, C: Cc, I, D } = g, v = (s.trV || 0) % 2;
          feetL(L, g);
          L.sd(B, Cc, I, `${M.a} cm`, { color: 'sky', size: fs(X.b, 16), gap: 8, dx: bcDx(X.b, g), keep: true }); L.sd(Cc, A, I, `${M.b} cm`, { color: 'green', size: fs(X.b, 16), gap: 8, keep: true }); L.sd(A, B, I, `${M.c} cm`, { ...abO(X.b, M.g), color: 'violet', size: fs(X.b, 16), gap: 8, keep: true });
          if (v === 0) L.sd(I, D, pt(I.x, I.y - 50), `${M.r} cm`, { color: 'rose', size: fs(X.b, 15), gap: 6, keep: true });
          
        },
        split: (L, M) => { const { A, B, C: Cc, I } = M.g; L.fl([I, B, Cc], 'sky', 0.24); L.fl([I, Cc, A], 'green', 0.24); L.fl([I, A, B], 'violet', 0.24); [A, B, Cc].forEach((z) => L.ln(z, I, 'ink', 3)); },
        h: (L, M, s, X) => { const g = M.g, v = (s.trV || 0) % 2; L.fl([g.I, g.B, g.C], 'sky', 0.16); L.fl([g.I, g.C, g.A], 'green', 0.16); L.fl([g.I, g.A, g.B], 'violet', 0.16); feetL(L, g, 'rose', 3.6); const tg = v === 0 ? `${M.r}` : 'r'; [g.E, g.F].concat(v === 0 ? [] : [g.D]).forEach((Q) => L.sd(g.I, Q, pt(g.I.x, g.I.y - 50), tg, { color: 'rose', size: fs(X.b, 15), gap: 8 })); },
        eq: (L, M) => { const { A, B, C: Cc, I } = M.g; L.fl([I, B, Cc], 'sky', 0.24); L.fl([I, Cc, A], 'green', 0.24); L.fl([I, A, B], 'violet', 0.24); }
      },
      x: (b, M, s, X) => {
        const { A, I, D } = M.g, v = (s.trV || 0) % 2;
        if (v === 0) { if (!X.at('h') && !X.at('split') && !X.at('eq') && !X.at('eq2')) T(b, G.lerp(G.lerp(A, I, 0.5), G.centroid([A, M.g.B, M.g.C]), 0.5), X.xVal ? `${M.area} cm²` : 'x', { size: fs(b, X.xVal ? 16 : 18), color: 'amber' }); }
        else if (!X.at('h')) G.sideTag(b, I, D, pt(I.x, I.y - 50), X.xVal ? `${M.r} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 15 : 18), gap: 6 });
      }
    })
  };

  /* ---------------------------------------------------------------- 3·8. 접선의 길이 (공용) */
  // 세 접선 길이 p=AF=AE, q=BF=BD, r=CD=CE. 막대는 같은 쪽끼리 같은 색·같은 눈금.
  const tanBars = (L, g, o = {}) => {
    const { A, B, C: Cc, D, E, F } = g;
    [[A, F, 'amber', 1], [A, E, 'amber', 1], [B, F, 'sky', 2], [B, D, 'sky', 2], [Cc, D, 'green', 3], [Cc, E, 'green', 3]].forEach(([p, q, col, n]) => { L.ln(p, q, col, o.w || 5.5); L.tk(p, q, n, col); });
  };
  const tanLetters = (L, g, X) => { const { A, B, C: Cc, D, E, F, I } = g, q = fs(X.b, 15); [[A, F, 'p', 'amber'], [A, E, 'p', 'amber'], [B, F, 'q', 'sky'], [B, D, 'q', 'sky'], [Cc, D, 'r', 'green'], [Cc, E, 'r', 'green']].forEach(([a, c, t, col]) => L.sd(a, c, I, t, { color: col, size: q, gap: 14 })); };
  const TK = { AF: { t: 'p', num: (M) => M.x, f: (M) => `(\\overline{AB}+\\overline{CA}-\\overline{BC})`, sum: 'AB+CA−BC', fx: (M) => `${M.c}+${M.b}-${M.a}`, e2: '(p+q)+(r+p)−(q+r)=2p', val: (M) => M.x, seg: 'AF', pair: 'AE' },
    BD: { t: 'q', f: () => '', sum: 'AB+BC−CA', fx: (M) => `${M.c}+${M.a}-${M.b}`, e2: '(p+q)+(q+r)−(r+p)=2q', val: (M) => M.y, seg: 'BD', pair: 'BF' },
    CE: { t: 'r', f: () => '', sum: 'BC+CA−AB', fx: (M) => `${M.a}+${M.b}-${M.c}`, e2: '(q+r)+(r+p)−(p+q)=2r', val: (M) => M.z, seg: 'CE', pair: 'CD' } };
  const tanSteps = (M, kind, head) => {
    const out = [], K = TK[kind], { a, b: bb, c } = M, val = K.val(M), sumTex = { AF: '\\overline{AB}+\\overline{CA}-\\overline{BC}', BD: '\\overline{AB}+\\overline{BC}-\\overline{CA}', CE: '\\overline{BC}+\\overline{CA}-\\overline{AB}' }[kind];
    const twoEq = { AF: '(p+q)+(r+p)-(q+r)=2p', BD: '(p+q)+(q+r)-(r+p)=2q', CE: '(q+r)+(r+p)-(p+q)=2r' }[kind];
    out.push({ k: 'given', f: 'given', t: `${head}에서 $\\overline{${K.seg}}$의 길이 $x$를 구해요.`, cap: `AB=${c}, BC=${a}, CA=${bb} (cm), ${K.seg}=x` });
    out.push({ k: 'idea', f: 'idea', t: '한 꼭짓점에서 원에 그은 두 접선의 길이는 같아요. A에서는 AF=AE, B에서는 BF=BD, C에서는 CD=CE. 그러면 각 변을 접선의 길이 둘의 합으로 나타낼 수 있어요.', cap: '한 점에서 그은 두 접선의 길이는 같다' });
    out.push({ k: 'fig', f: 'tan', lb: '접선의 길이', t: '$\\overline{AF}=\\overline{AE}=p$, $\\overline{BF}=\\overline{BD}=q$, $\\overline{CD}=\\overline{CE}=r$로 놓아요.', cap: 'AF=AE=p, BF=BD=q, CD=CE=r' });
    out.push({ k: 'fig', f: 'sides', lb: '변을 합으로', t: `세 변은 $\\overline{AB}=p+q=${c}$, $\\overline{BC}=q+r=${a}$, $\\overline{CA}=r+p=${bb}$예요.`, cap: `p+q=${c}, q+r=${a}, r+p=${bb}` });
    out.push({ k: 'eq', f: 'eq', t: `${K.t}만 남기려고 식을 더하고 빼면 $${twoEq}$이므로 $${K.t}=\\frac{${sumTex}}{2}=\\frac{${K.fx(M)}}{2}=${val}$ (cm).`, cap: `${K.t}=\\frac{${K.sum}}{2}=\\frac{${K.fx(M)}}{2}=${val}` });
    out.push({ k: 'ans', f: 'ans', t: `$x=${val}\\text{ cm}$`, cap: `x = ${val} cm` });
    return out;
  };
  const tanQuick = (M, kind) => { const K = TK[kind]; return { steps: `<p>$\\overline{${K.seg}}=\\frac{${{ AF: '\\overline{AB}+\\overline{CA}-\\overline{BC}', BD: '\\overline{AB}+\\overline{BC}-\\overline{CA}', CE: '\\overline{BC}+\\overline{CA}-\\overline{AB}' }[kind]}}{2}=\\frac{${K.fx(M)}}{2}=${K.val(M)}$ (cm)</p>`, note: '접선의 길이 = (그 점을 낀 두 변의 합 − 나머지 한 변) ÷ 2 예요.' }; };
  const tanSpec = (kindOf, opts = {}) => ({
    box: nBox, base: nBase(), top: nTop(), legend: () => NLEG,
    st: {
      given: (L, M, s, X) => {
        const g = M.g, { A, B, C: Cc, I, F } = g, v = (s.trV || 0) % 3, q = fs(X.b, 15);
        feetL(L, g, 'rose', 2.4); tanBars(L, g, { w: 4.4 });
        const kp = !X.at('sides') && !X.at('tan'), bd = kindOf(M, s) === 'BD' && !(opts.n3 && v === 2);
        if (!(opts.n3 && v === 2)) { L.sd(A, B, I, `${M.c} cm`, { ...abO(X.b, M.g, kindOf(M, s) === 'AF' ? 0.36 : 0.2), color: 'sky', size: q, gap: 24, keep: kp }); L.sd(B, Cc, I, `${M.a} cm`, { color: 'sky', size: q, gap: 22, dx: bcDx(X.b, g, bd), keep: kp }); L.sd(Cc, A, I, `${M.b} cm`, { color: 'sky', size: q, gap: 24, keep: kp }); }
        else { L.sd(A, F, I, `${M.x} cm`, { color: 'sky', size: q, gap: 14, keep: kp }); L.sd(B, Cc, I, `${M.a} cm`, { color: 'sky', size: q, gap: 22, dx: bcDx(X.b, g, bd), keep: kp }); }
      },
      tan: (L, M, s, X) => { const g = M.g; tanBars(L, g); tanLetters(L, g, X); },
      sides: (L, M, s, X) => { const { A, B, C: Cc, I } = M.g, q = fs(X.b, 15); L.pl([A, B, Cc], 'ink', 3.6); const v3 = (s.trV || 0) % 3; if (!(opts.n3 && v3 === 2)) { L.sd(A, B, I, `p+q=${M.c}`, { ...abO(X.b, M.g), color: 'ink', size: q, gap: 24 }); L.sd(B, Cc, I, `q+r=${M.a}`, { color: 'ink', size: q, gap: 22, dx: bcDx(X.b, M.g) }); L.sd(Cc, A, I, `r+p=${M.b}`, { color: 'ink', size: q, gap: 24 }); } else { L.sd(A, B, I, 'p+q', { ...abO(X.b, M.g), color: 'ink', size: q, gap: 24 }); L.sd(B, Cc, I, `q+r=${M.a}`, { color: 'ink', size: q, gap: 22, dx: bcDx(X.b, M.g) }); L.sd(Cc, A, I, 'r+p', { color: 'ink', size: q, gap: 24 }); } },
      sum: (L, M, s, X) => { const { A, B, C: Cc, I, F } = M.g; L.pl([A, B, Cc], 'amber', 4.4); L.ln(B, Cc, 'sky', 6); L.ln(A, F, 'green', 6); },
      eq: (L, M, s, X) => { if (opts.n3 && (s.trV || 0) % 3 === 2) { const { A, B, C: Cc } = M.g; L.pl([A, B, Cc], 'amber', 4.4); } else { const g = M.g, k = kindOf(M, s), bars = { AF: [[g.A, g.F], [g.A, g.E], 'amber'], BD: [[g.B, g.F], [g.B, g.D], 'sky'], CE: [[g.C, g.D], [g.C, g.E], 'green'] }[k]; L.ln(bars[0][0], bars[0][1], bars[2], 6); L.ln(bars[1][0], bars[1][1], bars[2], 6); } }
    },
    x: (b, M, s, X) => {
      const { A, B, C: Cc, I, D, E, F } = M.g, k = kindOf(M, s), v = (s.trV || 0) % 3;
      if (opts.n3 && v === 2) { if (X.K === 'ans' || X.at('eq') || X.at('sum')) { T(b, G.lerp(A, I, 0.5), X.xVal ? `${2 * M.x + 2 * M.a} cm` : 'x', { size: fs(b, X.xVal ? 16 : 18), color: 'amber' }); } else T(b, G.lerp(A, I, 0.5), 'x', { size: fs(b, 18), color: 'amber' }); poly(b, [A, B, Cc], 'amber', X.xArc ? 3.6 : 0.01, { alpha: X.xArc ? 0.9 : 0 }); return; }
      if (X.at('tan') || X.at('sides') || X.at('eq')) return;
      const pairs = { AF: [A, F, 'amber', M.x], BD: [B, D, 'sky', M.y], CE: [Cc, E, 'green', M.z] }[k];
      G.sideTag(b, pairs[0], pairs[1], I, X.xVal ? `${pairs[3]} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 15 : 18), gap: 14 });
    }
  });
  const n3kind = (M, s) => (['AF', 'BD'][(s.trV || 0) % 3] || 'AF');
  const n3Solve = {
    quickTitle: '10초 컷 · (두 변의 합 − 나머지 한 변) ÷ 2',
    quick: (M, s) => { const v = (s.trV || 0) % 3; if (v === 2) return { steps: `<p>둘레 $=2(\\overline{AF}+\\overline{BC})=2\\times(${M.x}+${M.a})=${2 * M.x + 2 * M.a}$ (cm)</p>`, note: '둘레는 (AF의 길이 + BC)의 2배예요.' }; return tanQuick(M, n3kind(M, s)); },
    steps: (M, s) => {
      const v = (s.trV || 0) % 3, { x, a, b: bb, c } = M;
      if (v < 2) return tanSteps(M, n3kind(M, s), `원 I는 △ABC의 내접원이고 D, E, F는 접점이에요. $\\overline{AB}=${c}$ cm, $\\overline{BC}=${a}$ cm, $\\overline{CA}=${bb}$ cm인 이 삼각형`);
      const out = [];
      out.push({ k: 'given', f: 'given', t: `원 I는 △ABC의 내접원이고 D, E, F는 접점이에요. $\\overline{AF}=${x}$ cm, $\\overline{BC}=${a}$ cm일 때 △ABC의 둘레 $x$를 구해요.`, cap: `AF=${x} cm, BC=${a} cm, 둘레=x` });
      out.push({ k: 'idea', f: 'idea', t: '둘레는 AB+BC+CA예요. AB와 CA를 접선의 길이로 쪼개면, A에서 그은 두 접선(AF=AE)가 두 번 나타나고 나머지는 BC로 묶여요.', cap: '둘레 = AB+BC+CA, 접선의 길이는 같다' });
      out.push({ k: 'fig', f: 'tan', lb: '접선의 길이', t: '$\\overline{AF}=\\overline{AE}=p$, $\\overline{BF}=\\overline{BD}=q$, $\\overline{CD}=\\overline{CE}=r$로 놓으면 $p=' + x + '$, 그리고 $\\overline{BC}=q+r=' + a + '$.', cap: `AF=AE=p=${x}, BC=q+r=${a}` });
      out.push({ k: 'fig', f: 'sides', lb: '변을 합으로', t: `$\\overline{AB}=p+q$, $\\overline{BC}=q+r$, $\\overline{CA}=r+p$예요.`, cap: 'AB=p+q, BC=q+r, CA=r+p' });
      out.push({ k: 'eq', f: 'eq', t: `(둘레) $=(p+q)+(q+r)+(r+p)=2(p+q+r)=2\\{p+(q+r)\\}=2\\times(${x}+${a})=${2 * x + 2 * a}$ (cm)`, cap: `x=2(p+q+r)=2×(${x}+${a})=${2 * x + 2 * a} cm` });
      out.push({ k: 'ans', f: 'ans', t: `$x=${2 * x + 2 * a}\\text{ cm}$`, cap: `x = ${2 * x + 2 * a} cm` });
      return out;
    },
    draw: SVB.runner(tanSpec(n3kind, { n3: true }))
  };
  const n8kind = (M, s) => ['AF', 'BD', 'CE'][(s.trV || 0) % 3];
  const n8Solve = {
    quickTitle: '10초 컷 · (두 변의 합 − 나머지 한 변) ÷ 2', quick: (M, s) => tanQuick(M, n8kind(M, s)),
    steps: (M, s) => tanSteps(M, n8kind(M, s), `원 I는 △ABC의 내접원이고 D, E, F는 접점이에요. $\\overline{AB}=${M.c}$ cm, $\\overline{BC}=${M.a}$ cm, $\\overline{CA}=${M.b}$ cm인 이 삼각형`),
    draw: SVB.runner(tanSpec(n8kind))
  };

  /* ---------------------------------------------------------------- 4. 직각삼각형의 내접원 */
  const n4Solve = {
    quickTitle: '10초 컷 · r = (두 변의 합 − 빗변) ÷ 2',
    quick: (M, s) => ((s.trV || 0) % 2 === 0 ? { steps: `<p>$r=\\frac{${M.a}+${M.b}-${M.c}}{2}=${M.r}$ (cm)</p>`, note: '직각삼각형의 내접원: 반지름 = (직각을 낀 두 변의 합 − 빗변) ÷ 2' } : { steps: `<p>빗변 $=${M.a}+${M.b}-2\\times${M.r}=${M.c}$ (cm)</p>`, note: 'r=(a+b−c)÷2를 거꾸로 쓰면 c=a+b−2r예요.' }),
    steps: (M, s) => {
      const v = (s.trV || 0) % 2, { a, b: bb, c, r } = M, out = [];
      out.push({ k: 'given', f: 'given', t: v === 0 ? `∠C=90°인 직각삼각형 ABC의 내접원의 접점이 D, E, F이고 $\\overline{BC}=${a}$ cm, $\\overline{CA}=${bb}$ cm, $\\overline{AB}=${c}$ cm예요. 내접원의 반지름 $x$를 구해요.` : `∠C=90°인 직각삼각형 ABC의 내접원의 접점이 D, E, F이고 $\\overline{BC}=${a}$ cm, $\\overline{CA}=${bb}$ cm, 내접원의 반지름은 ${r} cm예요. 빗변 $\\overline{AB}$의 길이 $x$를 구해요.`, cap: v === 0 ? `∠C=90°, BC=${a}, CA=${bb}, AB=${c} (cm), r=x` : `∠C=90°, BC=${a}, CA=${bb} (cm), r=${r} cm, AB=x` });
      out.push({ k: 'idea', f: 'idea', t: '직각 꼭짓점 C 옆에는 정사각형이 숨어 있어요. 그러면 CD=CE=r이고, 나머지 변은 접선의 길이는 같다는 성질로 a−r, b−r로 나타낼 수 있어요. 이 둘이 빗변 AB를 이루니까 식 하나가 나와요.', cap: 'CDIE는 정사각형 → CD=CE=r' });
      out.push({ k: 'fig', f: 'sq', lb: '정사각형', t: '∠C=90°이고 $\\overline{ID}\\perp\\overline{BC}$, $\\overline{IE}\\perp\\overline{CA}$이므로 사각형 CDIE는 네 각이 모두 직각이고 이웃한 두 변 ID, IE가 같아서 정사각형이에요. 그래서 $\\overline{CD}=\\overline{CE}=r$.', cap: 'CDIE는 정사각형 → CD=CE=r' });
      out.push({ k: 'fig', f: 'tan', lb: '접선의 길이', t: `$\\overline{BD}=\\overline{BC}-\\overline{CD}=${a}-r$이고 $\\overline{AE}=\\overline{CA}-\\overline{CE}=${bb}-r$이에요. 접선의 길이는 같으므로 $\\overline{BF}=\\overline{BD}=${a}-r$, $\\overline{AF}=\\overline{AE}=${bb}-r$.`, cap: `BF=BD=${a}−r, AF=AE=${bb}−r` });
      if (v === 0) {
        out.push({ k: 'eq', f: 'eq', t: `$\\overline{AB}=\\overline{AF}+\\overline{BF}$이므로 $${c}=(${bb}-r)+(${a}-r)$. 따라서 $r=\\frac{${a}+${bb}-${c}}{2}=${r}$ (cm).`, cap: `${c}=(${bb}−r)+(${a}−r) → r=\\frac{${a}+${bb}−${c}}{2}=${r}` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${r}\\text{ cm}$`, cap: `x = ${r} cm` });
      } else {
        out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{AB}=\\overline{AF}+\\overline{BF}=(${bb}-${r})+(${a}-${r})=${bb - r}+${a - r}=${c}$ (cm)`, cap: `x=(${bb}−${r})+(${a}−${r})=${c} cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${c}\\text{ cm}$`, cap: `x = ${c} cm` });
      }
      return out;
    },
    draw: SVB.runner({
      box: (M) => bboxOf([M.g.A, M.g.B, M.g.C]), padL: 60,
      base: (b, M) => { const { A, B, C: Cc, I } = M.g; b.circle(I, M.r, { color: 'green', width: 2.4, alpha: 0.8 }); fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.4); },
      legend: () => NLEG,
      top: (b, M) => {
        const { A, B, C: Cc, I, D, E, F } = M.g;
        b.point(I, { color: 'green', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'rose', r: 3.6 }));
        T(b, I, 'I', { dy: -14, dx: 10, size: 16, color: 'green' }); tagOut(b, A, I, 'A', { size: 18 }); tagOut(b, B, I, 'B', { size: 18 }); tagOut(b, Cc, I, 'C', { size: 18 });
        T(b, D, 'D', { dy: 16, size: 16 }); T(b, E, 'E', { dx: -14, dy: 0, size: 16 }); tagOut(b, F, I, 'F', { size: 16, gap: 8 });
      },
      st: {
        given: (L, M, s, X) => {
          const { A, B, C: Cc, I, D, E, F } = M.g, v = (s.trV || 0) % 2, q = fs(X.b, 16);
          L.ang(Cc, A, B, { color: 'sky', r: 26 }); [[D, Cc], [E, Cc], [F, A]].forEach(([Q]) => L.ln(I, Q, 'rose', 3)); L.ang(D, I, Cc, { color: 'rose', r: 12 }); L.ang(E, I, Cc, { color: 'rose', r: 12 });
          L.sd(Cc, B, pt(I.x, I.y - 50), `${M.a} cm`, { color: 'sky', size: q, gap: 22, dx: 0.3 * M.a * (X.b.k || 60), keep: true }); L.sd(Cc, A, pt(50, I.y), `${M.b} cm`, { color: 'green', size: q, gap: 8, keep: true });
          if (v === 0) L.sd(A, B, I, `${M.c} cm`, { ...abO(X.b, M.g), color: 'violet', size: q, gap: 8, keep: true }); else L.sd(I, D, pt(I.x - 50, I.y), `${M.r} cm`, { color: 'rose', size: fs(X.b, 15), gap: 6, keep: true });
        },
        sq: (L, M, s, X) => { const { C: Cc, D, I, E } = M.g; L.fl([Cc, D, I, E], 'rose', 0.3); L.ln(I, D, 'rose', 4); L.ln(I, E, 'rose', 4); L.ln(Cc, D, 'amber', 4.4); L.ln(Cc, E, 'amber', 4.4); },
        tan: (L, M, s, X) => { const { A, B, F, D, E } = M.g; L.ln(B, D, 'sky', 5.5); L.ln(B, F, 'sky', 5.5); L.ln(A, E, 'amber', 5.5); L.ln(A, F, 'amber', 5.5); },
        eq: (L, M) => { const { A, B, F } = M.g; L.ln(A, F, 'amber', 5.5); L.ln(B, F, 'sky', 5.5); }
      },
      x: (b, M, s, X) => {
        const { I, D, A, B } = M.g, v = (s.trV || 0) % 2;
        if (v === 0) G.sideTag(b, I, D, pt(I.x - 50, I.y), X.xVal ? `${M.r} cm` : (X.at('sq') ? 'r' : 'x'), { color: 'amber', size: fs(b, X.xVal ? 15 : 18), gap: 6 });
        else G.sideTag(b, A, B, I, X.xVal ? `${M.c} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 16 : 18), gap: 8 });
      }
    })
  };

  /* ---------------------------------------------------------------- 5. 내심의 각 */
  // 짧은 문제 무대에서도 ∠BIC의 값이 밑변 BC의 길이처럼 보이지 않게
  // 내심에서 BC까지의 실제 화면 높이 안에 호와 글자를 함께 둡니다.
  const n5CompactAngle = (b, g) => b.W < 560 || dist(g.I, g.D) * b.k < 100;
  const n5BicLayout = (b, g) => {
    if (!n5CompactAngle(b, g)) return { r: 34, labelDist: 56 };
    const h = dist(g.I, g.D) * b.k, u = unit(sub(g.B, g.I)), v = unit(sub(g.C, g.I));
    const midAngle = Math.atan2(u.y + v.y, u.x + v.x);
    const labelRot = clamp((angBetween(g.C, g.B, g.I) - angBetween(g.B, g.I, g.C)) * .4, -12, 12);
    return { r: Math.min(34, .25 * h), labelDist: Math.min(56, (h - 1) / (2 * Math.sin(midAngle + labelRot * DEG))), labelRot };
  };
  const n5Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 3, { al, be, ga, bic } = M, out = [];
      out.push({ k: 'given', f: 'given', t: v === 0 ? `점 I는 △ABC의 내심이고 $\\angle A=${2 * al}^{\\circ}$예요. $\\angle BIC$의 크기 $x$를 구해요.` : v === 1 ? `점 I는 △ABC의 내심이고 $\\angle BIC=${bic}^{\\circ}$예요. $\\angle A$의 크기 $x$를 구해요.` : `점 I는 △ABC의 내심이고 $\\angle IBC=${be}^{\\circ}$, $\\angle ICB=${ga}^{\\circ}$예요. $\\angle A$의 크기 $x$를 구해요.`, cap: v === 0 ? `∠A=${2 * al}°, ∠BIC=x` : v === 1 ? `∠BIC=${bic}°, ∠A=x` : `∠IBC=${be}°, ∠ICB=${ga}°, ∠A=x` });
      out.push({ k: 'idea', f: 'idea', t: v === 0 ? '∠BIC는 △IBC의 한 각이에요. 나머지 두 각 ∠IBC, ∠ICB는 ∠B, ∠C의 반(이등분선 때문)이니까, ∠B+∠C=180°−∠A를 이용해서 그 합을 먼저 구해요.' : v === 1 ? '△IBC의 두 각 ∠IBC, ∠ICB는 ∠B, ∠C의 반이에요. ∠BIC를 알면 그 두 각의 합을 알고, 그 합의 2배가 ∠B+∠C이니까 ∠A까지 갈 수 있어요.' : 'BI, CI가 이등분선이니까 ∠B, ∠C는 주어진 각의 2배예요. 삼각형의 내각의 합 180°에서 ∠B, ∠C를 빼면 ∠A가 나와요.', cap: v === 2 ? 'BI, CI는 이등분선 → ∠B=2×∠IBC, ∠C=2×∠ICB' : 'BI, CI는 이등분선 → ∠IBC=\\frac{1}{2}∠B, ∠ICB=\\frac{1}{2}∠C' });
      if (v === 0) {
        out.push({ k: 'fig', f: 'half', lb: '이등분선', t: 'BI는 ∠B를, CI는 ∠C를 이등분하므로 $\\angle IBC=\\frac{1}{2}\\angle B=\\times$, $\\angle ICB=\\frac{1}{2}\\angle C=\\blacksquare$라 해요.', cap: '∠IBC=\\frac{1}{2}∠B (×), ∠ICB=\\frac{1}{2}∠C (■)' });
        out.push({ k: 'fig', f: 'sum', lb: '반쪽의 합', t: `$\\angle B+\\angle C=180^{\\circ}-\\angle A=180^{\\circ}-${2 * al}^{\\circ}=${180 - 2 * al}^{\\circ}$이므로 $\\times+\\blacksquare=\\frac{1}{2}(\\angle B+\\angle C)=\\frac{${180 - 2 * al}^{\\circ}}{2}=${90 - al}^{\\circ}$.`, cap: `×+■=\\frac{180°−${2 * al}°}{2}=${90 - al}°` });
        out.push({ k: 'eq', f: 'eq', t: `△IBC에서 $x=\\angle BIC=180^{\\circ}-(\\times+\\blacksquare)=180^{\\circ}-${90 - al}^{\\circ}=${bic}^{\\circ}$ ($=90^{\\circ}+\\frac{1}{2}\\angle A$).`, cap: `x=180°−${90 - al}°=${bic}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${bic}^{\\circ}$`, cap: `x = ${bic}°` });
      } else if (v === 1) {
        out.push({ k: 'fig', f: 'half', lb: '이등분선', t: 'BI는 ∠B를, CI는 ∠C를 이등분하므로 $\\angle IBC=\\frac{1}{2}\\angle B=\\times$, $\\angle ICB=\\frac{1}{2}\\angle C=\\blacksquare$라 해요.', cap: '∠IBC=\\frac{1}{2}∠B (×), ∠ICB=\\frac{1}{2}∠C (■)' });
        out.push({ k: 'fig', f: 'sum', lb: '반쪽의 합', t: `△IBC의 내각의 합: $\\times+\\blacksquare+${bic}^{\\circ}=180^{\\circ}$이므로 $\\times+\\blacksquare=180^{\\circ}-${bic}^{\\circ}=${180 - bic}^{\\circ}$.`, cap: `×+■=180°−${bic}°=${180 - bic}°` });
        out.push({ k: 'eq', f: 'eq', t: `$\\angle B+\\angle C=2(\\times+\\blacksquare)=2\\times${180 - bic}^{\\circ}=${2 * (180 - bic)}^{\\circ}$이므로 $x=\\angle A=180^{\\circ}-${2 * (180 - bic)}^{\\circ}=${2 * al}^{\\circ}$.`, cap: `∠B+∠C=2×${180 - bic}°=${2 * (180 - bic)}°, x=180°−${2 * (180 - bic)}°=${2 * al}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${2 * al}^{\\circ}$`, cap: `x = ${2 * al}°` });
      } else {
        out.push({ k: 'fig', f: 'dbl', lb: '두 배', t: `BI가 ∠B를, CI가 ∠C를 이등분하므로 $\\angle B=2\\angle IBC=2\\times${be}^{\\circ}=${2 * be}^{\\circ}$, $\\angle C=2\\angle ICB=2\\times${ga}^{\\circ}=${2 * ga}^{\\circ}$.`, cap: `∠B=2×${be}°=${2 * be}°, ∠C=2×${ga}°=${2 * ga}°` });
        out.push({ k: 'eq', f: 'eq', t: `삼각형의 내각의 합: $x=\\angle A=180^{\\circ}-\\angle B-\\angle C=180^{\\circ}-${2 * be}^{\\circ}-${2 * ga}^{\\circ}=${2 * al}^{\\circ}$.`, cap: `x=180°−${2 * be}°−${2 * ga}°=${2 * al}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${2 * al}^{\\circ}$`, cap: `x = ${2 * al}°` });
      }
      return out;
    },
    draw: SVB.runner({
      ...mobileQuestionFrame(nBox, 'I: 내심'), base: nBase({ noCirc: true }),
      top: (b, M, s, X) => nTop({ noFeet: true, idx: n5CompactAngle(b, M.g) ? 14 : 0, idy: n5CompactAngle(b, M.g) ? -14 : 22 })(b, M, s, X),
      st: {
        given: (L, M, s, X) => {
          const g = M.g, { A, B, C: Cc, I } = g, v = (s.trV || 0) % 3;
          bisL(L, g); ringMarks(L, g);
          if (v === 0) L.ang(A, B, Cc, { noMark: true, color: 'sky', label: dg(2 * M.al), size: 16, labelDist: X.nw ? Math.min(70, .42 * dist(A, I) * X.b.k) : 70, keep: true });
          else if (v === 1) L.ang(I, B, Cc, { color: 'sky', ...n5BicLayout(X.b, g), label: dg(M.bic), size: 16, keep: true });
          else { L.ang(B, A, Cc, { noMark: true, color: 'green', label: dg(M.be), size: 15, labelDist: 56, keep: !X.has('dbl') }); L.ang(Cc, B, A, { noMark: true, color: 'violet', label: dg(M.ga), size: 15, labelDist: 56, keep: !X.has('dbl') }); }
        },
        half: (L, M, s, X) => {
          const { A, B, C: Cc, I } = M.g, near = (P) => X.nw ? Math.min(54, .38 * dist(P, I) * X.b.k) : 54;
          L.ln(B, I, 'green', 4.2); L.ln(Cc, I, 'violet', 4.2);
          L.ang(B, I, Cc, { color: 'green', r: 36, rings: 2, label: '×', size: 17, labelDist: near(B), fa: 0.4 });
          L.ang(Cc, B, I, { color: 'violet', r: 36, rings: 3, label: '■', size: 15, labelDist: near(Cc), fa: 0.4 });
        },
        sum: (L, M, s) => { const { A, B, C: Cc, I } = M.g, v = (s.trV || 0) % 3; L.fl([I, B, Cc], 'amber', 0.2); L.ang(B, I, Cc, { color: 'green', r: 36, rings: 2, fa: 0.4 }); L.ang(Cc, B, I, { color: 'violet', r: 36, rings: 3, fa: 0.4 }); void v; },
        dbl: (L, M) => { const { A, B, C: Cc } = M.g; L.ang(B, A, Cc, { color: 'green', r: 40, label: dg(2 * M.be), size: 15, labelDist: 60, fa: 0.3, keep: true }); L.ang(Cc, B, A, { color: 'violet', r: 40, label: dg(2 * M.ga), size: 15, labelDist: 60, fa: 0.3, keep: true }); },
        eq: (L, M, s) => { const { A, B, C: Cc, I } = M.g, v = (s.trV || 0) % 3; if (v === 0) { L.ang(B, I, Cc, { color: 'green', r: 36, rings: 2, fa: 0.3 }); L.ang(Cc, B, I, { color: 'violet', r: 36, rings: 3, fa: 0.3 }); } else if (v === 1) { L.ang(B, A, Cc, { color: 'green', r: 40, label: dg(2 * M.be), size: 15, labelDist: 60, fa: 0.3 }); } }
      },
      x: (b, M, s, X) => {
        const { A, B, C: Cc, I } = M.g, v = (s.trV || 0) % 3;
        if (v === 0) ang(b, I, B, Cc, { color: 'amber', ...n5BicLayout(b, M.g), label: xLbl(X, M.bic), size: X.nw ? 16 : 17, noMark: !X.xArc, fa: 0.3 });
        else ang(b, A, B, Cc, { color: 'amber', r: 44, label: xLbl(X, 2 * M.al), size: 17, labelDist: 70, noMark: !X.xArc, fa: 0.3 });
      }
    })
  };
  // 삼각형 ABC 의 내각을 한 번에 (v1, v2 에서 B 쪽 이등분 각 값 표시에 씁니다)

  /* ---------------------------------------------------------------- 6. 내심을 지나는 평행선 */
  const n6Solve = {
    quickTitle: '10초 컷 · △ADE의 둘레 = AB + AC',
    quick: (M, s) => ((s.trV || 0) % 2 === 0 ? { steps: `<p>$\\triangle ADE$의 둘레 $=\\overline{AB}+\\overline{AC}=${M.c}+${M.b}=${M.per}$ (cm)</p>`, note: 'BC는 둘레에 들어가지 않아요.' } : { steps: `<p>(△ABC의 둘레) − BC $=${M.a + M.b + M.c}-${M.a}=${M.per}$ (cm)</p>`, note: '△ADE의 둘레 = AB+AC = (△ABC의 둘레) − BC' }),
    steps: (M, s) => {
      const v = (s.trV || 0) % 2, { a, b: bb, c, per } = M, out = [], tot = a + bb + c;
      out.push({ k: 'given', f: 'given', t: v === 0 ? `점 I는 △ABC의 내심이고, I를 지나고 $\\overline{BC}$에 평행한 직선이 $\\overline{AB}$, $\\overline{AC}$와 만나는 점이 D, E예요. $\\overline{AB}=${c}$ cm, $\\overline{AC}=${bb}$ cm, $\\overline{BC}=${a}$ cm일 때 △ADE의 둘레 $x$를 구해요.` : `점 I는 △ABC의 내심이고, I를 지나고 $\\overline{BC}$에 평행한 직선이 $\\overline{AB}$, $\\overline{AC}$와 만나는 점이 D, E예요. △ABC의 둘레가 ${tot} cm이고 $\\overline{BC}=${a}$ cm일 때 △ADE의 둘레 $x$를 구해요.`, cap: v === 0 ? `AB=${c}, AC=${bb}, BC=${a} (cm), △ADE의 둘레=x` : `△ABC의 둘레=${tot} cm, BC=${a} cm, △ADE의 둘레=x` });
      out.push({ k: 'idea', f: 'idea', t: '△ADE의 둘레는 AD+DE+EA예요. DE를 DI+IE로 나눠서 DI=DB, EI=EC임을 보이면, AD+DB=AB, AE+EC=AC로 묶여서 BC가 사라지고 AB+AC만 남아요.', cap: '둘레 = AD+DI+IE+EA → DI=DB, EI=EC이면 AB+AC' });
      out.push({ k: 'fig', f: 'alt', lb: '엇각', t: 'DE∥BC이므로 엇각이 같아서 $\\angle DIB=\\angle IBC$.', cap: 'DE∥BC → ∠DIB=∠IBC (엇각)' });
      out.push({ k: 'fig', f: 'iso', lb: 'DB=DI', t: 'BI는 ∠B의 이등분선이라 $\\angle IBD=\\angle IBC$예요. 그래서 $\\angle DBI=\\angle DIB$이고 △DBI는 이등변삼각형이므로 $\\overline{DB}=\\overline{DI}$.', cap: '∠DBI=∠DIB → DB=DI' });
      out.push({ k: 'fig', f: 'sym', lb: 'EC=EI', t: '같은 방법으로 CI는 ∠C의 이등분선이고 DE∥BC이므로 $\\angle ECI=\\angle EIC$. 그래서 $\\overline{EC}=\\overline{EI}$.', cap: '같은 방법으로 EC=EI' });
      out.push({ k: 'fig', f: 'sum', lb: '둘레', t: `△ADE의 둘레 $=\\overline{AD}+\\overline{DI}+\\overline{IE}+\\overline{EA}=\\overline{AD}+\\overline{DB}+\\overline{EC}+\\overline{EA}=\\overline{AB}+\\overline{AC}$.`, cap: 'AD+DB=AB, AE+EC=AC → 둘레=AB+AC' });
      if (v === 0) { out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{AB}+\\overline{AC}=${c}+${bb}=${per}$ (cm)`, cap: `x=AB+AC=${c}+${bb}=${per} cm` }); }
      else out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{AB}+\\overline{AC}=(\\triangle ABC\\text{의 둘레})-\\overline{BC}=${tot}-${a}=${per}$ (cm)`, cap: `x=${tot}−${a}=${per} cm` });
      out.push({ k: 'ans', f: 'ans', t: `$x=${per}\\text{ cm}$`, cap: `x = ${per} cm` });
      return out;
    },
    draw: SVB.runner({
      box: (M) => bboxOf([M.g.A, M.g.B, M.g.C]),
      base: (b, M) => { const { A, B, C: Cc } = M.g; fillPoly(b, [A, B, Cc], 'sky', 0.07); poly(b, [A, B, Cc], 'ink', 3.4); },
      legend: () => 'I: 내심 · D, E: DE와 AB, AC의 교점',
      top: (b, M, s, X) => { const { A, B, C: Cc, I } = M.g, { D, E } = M; [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E].forEach((z) => b.point(z, { color: 'green', r: 4.5 })); b.point(I, { color: 'green', r: 5 }); T(b, I, 'I', { dy: 16, size: 17, color: 'green' }); tagOut(b, A, I, 'A', { size: 18 }); tagOut(b, B, I, 'B', { size: 18 }); tagOut(b, Cc, I, 'C', { size: 18 }); tagOut(b, D, I, 'D', { size: 17, gap: 8 }); tagOut(b, E, I, 'E', { size: 17, gap: 8 }); },
      st: {
        given: (L, M, s, X) => {
          const { A, B, C: Cc, I } = M.g, { D, E } = M, v = (s.trV || 0) % 2, q = fs(X.b, 15);
          L.ln(B, I, 'sky', 3, { dash: [7, 5] }); L.ln(Cc, I, 'violet', 3, { dash: [7, 5] }); L.ln(D, E, 'green', 3.6);
          L.ang(B, A, I, { color: 'sky', r: 30, fa: 0.4 }); L.ang(B, I, Cc, { color: 'sky', r: 30, fa: 0.4 }); L.ang(Cc, B, I, { color: 'violet', r: 30, rings: 2, fa: 0.4 }); L.ang(Cc, I, A, { color: 'violet', r: 30, rings: 2, fa: 0.4 });
          if (v === 0) { L.sd(A, B, I, `${M.c} cm`, { ...abO(X.b, M.g), color: 'sky', size: q, gap: 8, keep: true }); L.sd(Cc, A, I, `${M.b} cm`, { color: 'sky', size: q, gap: 8, keep: true }); }
          L.sd(B, Cc, I, `${M.a} cm`, { color: 'sky', size: q, gap: 8, keep: true });
          if (v === 1) { const mAB = G.lerp(A, B, 0.28), cg = G.centroid([A, B, Cc]), u = G.unit(G.sub(mAB, cg)); L.tx(mAB, `△ABC의 둘레 ${M.a + M.b + M.c} cm`, { dx: (u.x < 0 ? -1 : 1) * (G.textW(`△ABC의 둘레 ${M.a + M.b + M.c} cm`, fs(X.b, 14)) / 2 + 8), dy: -u.y * 24 - 4, size: fs(X.b, 14), color: 'sky', keep: true }); }
        },
        alt: (L, M) => { const { B, I, C: Cc } = M.g, { D, E } = M; L.ln(D, E, 'green', 4.6); L.ln(B, I, 'sky', 3.6); L.ang(I, D, B, { color: 'amber', r: 28, fa: 0.4 }); L.ang(B, I, Cc, { color: 'amber', r: 34, fa: 0.4 }); },
        iso: (L, M) => { const { A, B, I } = M.g, { D } = M; L.fl([D, B, I], 'sky', 0.22); L.ln(D, B, 'sky', 4.6); L.ln(D, I, 'sky', 4.6); L.tk(D, B, 2, 'sky'); L.tk(D, I, 2, 'sky'); L.ang(B, I, D, { color: 'sky', r: 30, fa: 0.4 }); L.ang(I, D, B, { color: 'sky', r: 24, fa: 0.4 }); },
        sym: (L, M) => { const { A, B, C: Cc, I } = M.g, { E } = M; L.fl([E, Cc, I], 'violet', 0.22); L.ln(E, Cc, 'violet', 4.6); L.ln(E, I, 'violet', 4.6); L.tk(E, Cc, 3, 'violet'); L.tk(E, I, 3, 'violet'); L.ang(Cc, I, E, { color: 'violet', r: 30, rings: 2, fa: 0.4 }); L.ang(I, E, Cc, { color: 'violet', r: 24, rings: 2, fa: 0.4 }); },
        sum: (L, M) => { const { A, B, C: Cc } = M.g; L.ln(A, B, 'amber', 5.5); L.ln(A, Cc, 'amber', 5.5); },
        eq: (L, M) => { const { A, B, C: Cc } = M.g; L.ln(A, B, 'amber', 4); L.ln(A, Cc, 'amber', 4); }
      },
      x: (b, M, s, X) => {
        const { A } = M.g, { D, E } = M;
        if (X.xArc && !X.at('eq')) poly(b, [A, D, E], 'amber', 3.6);
        if (!X.at('sum') && !X.at('eq')) T(b, G.centroid([A, D, E]), X.xVal ? `${M.per} cm` : 'x', { size: fs(b, X.xVal ? 15 : 18), color: 'amber', dy: X.xVal ? 0 : 4 });
      }
    })
  };

  /* ---------------------------------------------------------------- 7. 각의 비 */
  const n7Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 2, { a, b: bb, c, aib, bic, cia, A, B } = M, S0 = a + bb + c, out = [];
      const tgtAng = v === 0 ? '∠A' : '∠B', tgtI = v === 0 ? '∠BIC' : '∠CIA', tgtVal = v === 0 ? bic : cia, tgtRatio = v === 0 ? bb : c, ansV = v === 0 ? A : B, stg = v === 0 ? 'bic' : 'cia';
      out.push({ k: 'given', f: 'given', t: `점 I는 △ABC의 내심이고 $\\angle AIB:\\angle BIC:\\angle CIA=${a}:${bb}:${c}$예요. ${tgtAng}의 크기 $x$를 구해요.`, cap: `∠AIB:∠BIC:∠CIA=${a}:${bb}:${c}, ${tgtAng}=x` });
      out.push({ k: 'idea', f: 'idea', t: `내심의 각의 성질 ${v === 0 ? '∠BIC=90°+½∠A' : '∠CIA=90°+½∠B'}를 거꾸로 쓰면 ${tgtAng}=2(${tgtI}−90°)예요. 그러니 ${tgtI}만 구하면 돼요. ${tgtI}는 I를 둘러싼 세 각을 비로 나눠서 얻을 수 있어요.`, cap: `${tgtI}=90°+\\frac{1}{2}${tgtAng} → ${tgtAng}=2(${tgtI}−90°)` });
      out.push({ k: 'fig', f: 'sum', lb: '비의 합', t: `I를 둘러싼 세 각의 합은 360°이고 비가 $${a}:${bb}:${c}$이므로 비의 합은 $${a}+${bb}+${c}=${S0}$예요.`, cap: `세 각의 합 360°, 비의 합 ${a}+${bb}+${c}=${S0}` });
      out.push({ k: 'fig', f: stg, lb: tgtI, t: `$\\angle ${tgtI.slice(1)}=360^{\\circ}\\times\\frac{${tgtRatio}}{${S0}}=${tgtVal}^{\\circ}$ (나머지는 ∠AIB=${aib}°, ${v === 0 ? '∠CIA=' + cia : '∠BIC=' + bic}°).`.replace('\\angle ∠', '\\angle '), cap: `${tgtI}=360°×\\frac{${tgtRatio}}{${S0}}=${tgtVal}°` });
      out.push({ k: 'eq', f: 'eq', t: `$x=${v === 0 ? '\\angle A' : '\\angle B'}=2(${v === 0 ? '\\angle BIC' : '\\angle CIA'}-90^{\\circ})=2(${tgtVal}^{\\circ}-90^{\\circ})=${ansV}^{\\circ}$`, cap: `x=2(${tgtVal}°−90°)=${ansV}°` });
      out.push({ k: 'ans', f: 'ans', t: `$x=${ansV}^{\\circ}$`, cap: `x = ${ansV}°` });
      return out;
    },
    draw: SVB.runner({
      box: nBox, base: nBase({ noCirc: true }), top: nTop({ noFeet: true, idx: 0, idy: 26 }), legend: () => 'I: 내심',
      st: {
        given: (L, M, s, X) => {
          const g = M.g, { A, B, C: Cc, I } = g;
          bisL(L, g);
          L.ang(I, A, B, { color: 'sky', r: 24, label: String(M.a), size: 15, labelDist: 42, keep: !X.has('sum') }); L.ang(I, B, Cc, { color: 'green', r: 24, label: String(M.b), size: 15, labelDist: 42, keep: !X.has('sum') }); L.ang(I, Cc, A, { color: 'violet', r: 24, label: String(M.c), size: 15, labelDist: 42, keep: !X.has('sum') });
        },
        idea: (L, M) => { const { A, B, C: Cc, I } = M.g; L.fl([I, B, Cc], 'green', 0.14); },
        sum: (L, M, s, X) => { const { A, B, C: Cc, I } = M.g; L.ang(I, A, B, { color: 'sky', r: 24, label: String(M.a), size: 15, labelDist: 42, keep: true }); L.ang(I, B, Cc, { color: 'green', r: 24, label: String(M.b), size: 15, labelDist: 42, keep: !X.has('bic') }); L.ang(I, Cc, A, { color: 'violet', r: 24, label: String(M.c), size: 15, labelDist: 42, keep: !X.has('cia') }); },
        bic: (L, M, s, X) => { const { B, C: Cc, I, D } = M.g; L.ang(I, B, Cc, { color: 'green', r: 26, label: dg(M.bic), size: 15, labelDist: Math.max(40, Math.min(46, dist(I, D) * (X.b.k || 60) - 14)), fa: 0.4, keep: true }); },
        cia: (L, M) => { const { A, C: Cc, I } = M.g; L.ang(I, Cc, A, { color: 'violet', r: 26, label: dg(M.cia), size: 15, labelDist: 46, fa: 0.4, keep: true }); }
      },
      x: (b, M, s, X) => {
        const { A, B, C: Cc, I } = M.g, v = (s.trV || 0) % 2, kk = b.k || 60;
        // 라벨은 호 바로 바깥(이등분선 위)에 두되, 내심 I 점을 덮지 않도록 꼭짓점에서 I 까지 거리의 60% 안쪽으로
        const ld = (V) => Math.max(46, Math.min(60, 0.6 * dist(V, I) * kk));
        if (v === 0) ang(b, A, B, Cc, { color: 'amber', r: 34, label: xLbl(X, M.A), size: 17, labelDist: ld(A), noMark: !X.xArc, fa: 0.3 });
        else ang(b, B, A, Cc, { color: 'amber', r: 34, label: xLbl(X, M.B), size: 17, labelDist: ld(B), noMark: !X.xArc, fa: 0.3 });
      }
    })
  };

  /* ====================================================================== 1. 내심 */
  const n1 = {
    id: 't6-1', title: '내심 I와 내접원', short: '내심', solve: n1Solve,
    question: '삼각형의 세 각의 이등분선은 한 점에서 만날까? 그 점에서 세 변까지의 거리는?',
    ctl: ['trNa', 'trNb', 'trNr'],
    init: (s) => { s.trNa = 30; s.trNb = 30; s.trNr = 3; s.trV = 0; },
    reroll: (s) => { let a, b2; do { a = rint(22, 38); b2 = rint(22, 38); } while (Math.abs(a - b2) < 5 || Math.abs(90 - a - b2 - a) < 5 || Math.abs(90 - a - b2 - b2) < 5); // 세 각이 눈에 띄게 달라서 「같지 않다」는 반례를 그림에서 볼 수 있게
      s.trNa = a; s.trNb = b2; s.trNr = rint(2, 6); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const al = clamp(Math.round(s.trNa), 20, 40), be = clamp(Math.round(s.trNb), 20, 40), ga = 90 - al - be, r = clamp(Math.round(s.trNr), 2, 6); return { al, be, ga, r, g: fromAngles(2 * al, 2 * be, 2 * ga) }; },
    draw(b, s, M, C) {
      const { al, be, ga, r, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g);
      [A, B, Cc].forEach((z) => line(b, z, I, 'green', 3, { dash: [7, 5] }));
      [[D, B, Cc], [E, Cc, A], [F, A, B]].forEach(([Q, p, q]) => { line(b, I, Q, 'rose', 3); ang(b, Q, I, p, { color: 'rose', r: 14 }); });
      ang(b, A, B, I, { color: 'sky', r: 30, rings: 1 }); ang(b, A, I, Cc, { color: 'sky', r: 30, rings: 1 });
      ang(b, B, A, I, { color: 'green', r: 30, rings: 2 }); ang(b, B, I, Cc, { color: 'green', r: 30, rings: 2 });
      ang(b, Cc, B, I, { color: 'violet', r: 30, rings: 3 }); ang(b, Cc, I, A, { color: 'violet', r: 30, rings: 3 });
      if (C.problem) {
        if (v === 0) ang(b, A, B, Cc, { color: 'sky', r: 54, label: dg(2 * al), size: 16, labelDist: 74, fa: 0.04 });
        if (v === 1) { G.sideTag(b, I, D, pt(I.x, I.y - 50), `${r} cm`, { color: 'rose', size: fs(b, 16), gap: 8 }); }
      } else {
        tick(b, I, D, 1, 'rose'); tick(b, I, E, 1, 'rose'); tick(b, I, F, 1, 'rose');
        if (show(1)) { T(b, A, `${al}°`, { dx: 0, dy: 50, size: fs(b, 14), color: 'sky' }); T(b, B, `${be}°`, { dx: 50, dy: -12, size: fs(b, 14), color: 'green' }); T(b, Cc, `${ga}°`, { dx: -50, dy: -12, size: fs(b, 14), color: 'violet' }); }
        if (show(3)) G.sideTag(b, I, D, pt(I.x, I.y - 50), `r = ${r} cm`, { color: 'rose', size: fs(b, 15), gap: 8 });
      }
      b.point(I, { color: 'amber', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'rose', r: 3.8 }));
      T(b, I, 'I', { dx: 0, dy: -16, size: 18, color: 'amber' }); nameV(b, g, I); feetNames(b, g, I);
      if (C.problem && v === 0) ang(b, A, B, I, { color: 'amber', r: 38, label: 'x', size: 17, labelDist: 54 });
      if (C.problem && v === 1) { G.sideTag(b, I, E, pt(I.x, I.y + 30), 'x', { color: 'amber', size: fs(b, 18), gap: 8 }); }
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '세 각의 이등분선이 한 점 I에서 만나요';
        else if (C.review && st === 2) { row = 'ID⊥BC, IE⊥CA, IF⊥AB → △IBD≡△IBF 등 (RHA)'; col = 'rose'; }
        else if (C.review && st === 3) { row = `ID=IE=IF=r=${r} cm`; col = 'rose'; }
        else row = `I는 내심: ID=IE=IF=${r} cm (내접원의 반지름)`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `삼각형 ABC의 세 내각의 이등분선을 그으면 한 점 I에서 만나요. 이 점이 내심이에요. ∠A, ∠B, ∠C를 이등분한 각은 각각 ${M.al}°, ${M.be}°, ${M.ga}°예요.`,
      `I에서 세 변에 내린 수선의 발을 D, E, F라 하면 △IBD≡△IBF, △ICD≡△ICE, △IAE≡△IAF (RHA 합동, 빗변 공통 · 이등분된 각)이에요.`,
      `따라서 $\\overline{ID}=\\overline{IE}=\\overline{IF}=r=${M.r}$ cm이고, I를 중심으로 하고 반지름이 r인 원이 세 변에 접해요. 이 원이 내접원이에요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A, ∠B의 반</b>과 <b>내접원의 반지름 r</b>을 바꿔 보세요. 같은 표시(호의 개수)의 각이 같아요. 세 각의 이등분선은 늘 <b>한 점 I</b>에서 만나고, I에서 세 변까지의 거리는 모두 같아요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('∠A · ∠B · ∠C', `${2 * M.al}° · ${2 * M.be}° · ${2 * M.ga}°`, 'sky'), rd('ID = IE = IF', `${M.r} cm`, 'rose', '내접원의 반지름 r', null, true)],
      formula: `<p>$\\overline{ID}=\\overline{IE}=\\overline{IF}=r=${M.r}$ cm</p><p>$\\angle IAB=\\angle IAC=${M.al}^{\\circ},\\ \\angle IBA=\\angle IBC=${M.be}^{\\circ},\\ \\angle ICA=\\angle ICB=${M.ga}^{\\circ}$</p>`,
      rule: '삼각형의 세 내각의 이등분선은 한 점(내심)에서 만나고, 내심에서 세 변까지의 거리는 같다.',
      notes: notes('내심에서 <b>변</b>까지의 거리(ID, IE, IF)가 같아요. 꼭짓점까지의 거리(IA, IB, IC)는 같지 않아요.', '접점 D, E, F는 변의 중점이 아니에요. 변에 내린 <b>수선의 발</b>이에요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { al, r } = M, key = `${v}:${al}:${M.be}:${r}`;
      const head = '그림에서 점 I는 삼각형 ABC의 내심이고, 점 D, E, F는 I에서 각 변에 내린 수선의 발이다.';
      if (v === 0) return numProb({ tag: '내심 · 각의 이등분선', key, stem: `${head} ∠A=${2 * al}°일 때, ∠IAB의 크기 $x$는?`, correct: al, wrongs: [[2 * al, '∠A 그대로예요. AI는 ∠A의 이등분선이라 반이에요.'], [90 - al, '다시 생각해 보세요.'], [al + 10, '다시 계산해 보세요.'], [Math.max(5, al - 10), '다시 계산해 보세요.'], [180 - 2 * al, '다시 생각해 보세요.']].filter((q) => q[0] !== al), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '내심 · 거리', key, stem: `${head} ${S('ID')}=${r} cm일 때, ${S('IE')}의 길이 $x$는?`, correct: r, wrongs: [[r * 2, '두 배가 아니에요. 내심에서 세 변까지의 거리는 같아요.'], [r + 1, '다시 생각해 보세요.'], [r + 2, '다시 생각해 보세요.'], [Math.max(1, r - 1), '다시 생각해 보세요.'], [r * 3, '다시 생각해 보세요.']].filter((q) => q[0] !== r), ...cmOpts });
      const pool = N1POOL; // 풀이 흐름의 문장 풀과 같은 목록
      const r2 = mkStmtChoices(pool, M, key + 'F', false);
      return { tag: '내심의 성질 · 옳지 않은 것', key: key + 'F', stem: `${head} 다음 중 옳지 않은 것은?`, choices: r2.choices, wide: true };
    },
    verify: (s) => { const M = n1.model(s), g = M.g; return { ans: dist(g.I, g.D), model: dist(g.I, g.E), extra: [[dist(g.I, g.F), dist(g.I, g.D)], [angBetween(g.A, g.B, g.I), M.al], [angBetween(g.B, g.A, g.I), M.be], [angBetween(g.C, g.B, g.I), M.ga]] }; }
  };

  /* ====================================================================== 2. 내접원과 넓이 */
  const n2 = {
    id: 't6-2', title: '내접원과 삼각형의 넓이', short: '내접원과 넓이', solve: n2Solve,
    question: '내접원의 반지름 r과 세 변의 길이 a, b, c로 삼각형의 넓이를 구할 수 있을까?',
    ctl: ['trNi'],
    init: (s) => { s.trNi = 3; s.trV = 0; },
    reroll: (s) => { s.trNi = rint(0, 6); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const t = TRI[clamp(Math.round(s.trNi), 0, 6)], [a, b, c, r] = t, g = fromSides(a, b, c), L = a + b + c; return { a, b, c, r, L, area: (r * L) / 2, g, tri: t }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, r, L, area, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(I, g.r, { color: 'amber', width: 2.6, alpha: 0.85 });
      if (show(2)) { fillPoly(b, [I, B, Cc], 'sky', 0.22); fillPoly(b, [I, Cc, A], 'green', 0.22); fillPoly(b, [I, A, B], 'violet', 0.22); } else fillPoly(b, [A, B, Cc], 'sky', 0.08);
      poly(b, [A, B, Cc], 'ink', 3.6);
      [A, B, Cc].forEach((z) => line(b, z, I, 'ink', 2.4, { alpha: show(2) || C.problem ? 0.9 : 0.35 }));
      [[D, B, Cc], [E, Cc, A], [F, A, B]].forEach(([Q, p, q]) => { line(b, I, Q, 'rose', 3); ang(b, Q, I, p, { color: 'rose', r: 14 }); });
      const cen = I;
      G.sideTag(b, B, Cc, cen, `${a} cm`, { color: 'sky', size: fs(b, 16), gap: 8 }); G.sideTag(b, Cc, A, cen, `${bb} cm`, { color: 'green', size: fs(b, 16), gap: 8 }); G.sideTag(b, A, B, cen, `${c} cm`, { color: 'violet', size: fs(b, 16), gap: 8 });
      if (C.problem) {
        if (v === 0) { G.sideTag(b, I, D, pt(I.x, I.y - 50), `${r} cm`, { color: 'rose', size: fs(b, 15), gap: 6 }); T(b, I, '△ABC의 넓이 = x', { dy: -38, size: fs(b, 16), color: 'amber' }); }
        else T(b, I, `넓이 ${area} cm²`, { dy: -38, size: fs(b, 15), color: 'amber' });
        if (v === 1) G.sideTag(b, I, D, pt(I.x, I.y - 50), 'x', { color: 'rose', size: fs(b, 18), gap: 6 });
      } else {
        G.sideTag(b, I, D, pt(I.x, I.y - 50), `r = ${r} cm`, { color: 'rose', size: fs(b, 15), gap: 6 });
      }
      b.point(I, { color: 'amber', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'rose', r: 3.6 }));
      T(b, I, 'I', { dy: -16, dx: 14, size: 17, color: 'amber' }); nameV(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `a+b+c = ${a}+${bb}+${c} = ${L} cm, r=${r} cm`;
        else if (C.review && st === 2) { row = `밑변 a, b, c · 높이 r인 세 삼각형`; col = 'green'; }
        else if (C.review && st === 3) { row = `S = \\frac{1}{2}×${r}×${L} = ${area} cm²`; col = 'amber'; }
        else row = `S = \\frac{1}{2}×r×(a+b+c) = ${area} cm²`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `내접원의 반지름 $r=${M.r}$ cm이고, 세 변은 $a=${M.a}$, $b=${M.b}$, $c=${M.c}$ cm예요. 둘레는 $a+b+c=${M.L}$ cm.`,
      `내심 I로 삼각형 ABC를 세 삼각형 IBC, ICA, IAB로 나눠요. 밑변이 각각 a, b, c이고 높이가 모두 r(내접원의 반지름)이에요.`,
      `$S=\\triangle IBC+\\triangle ICA+\\triangle IAB=${fr('1', 2)}ra+${fr('1', 2)}rb+${fr('1', 2)}rc=${fr('1', 2)}r(a+b+c)=${fr('1', 2)}\\times${M.r}\\times${M.L}=${M.area}$ (cm²)`
    ],
    view: (M) => ({
      guide: '막대로 <b>삼각형</b>을 골라 보세요(내접원의 반지름이 정수인 삼각형만 있어요). 내심 I로 나눈 세 삼각형은 높이가 모두 <b>r</b>이라서 넓이는 <b>S = ½ r (a+b+c)</b>예요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('a · b · c', `${M.a} · ${M.b} · ${M.c} cm`, 'sky'), rd('내접원의 반지름 r', `${M.r} cm`, 'rose'), rd('둘레 a+b+c', `${M.L} cm`, 'sky'), rd('넓이 S', `${M.area} cm²`, 'amber', '½ × r × 둘레', null, true)],
      formula: `<p>$S=${fr('1', 2)}r(a+b+c)=${fr('1', 2)}\\times${M.r}\\times${M.L}=${M.area}$ (cm²)</p>`,
      rule: '내접원의 반지름을 r, 세 변의 길이를 a, b, c라 하면 삼각형의 넓이 S = ½ r (a+b+c)이다.',
      notes: notes('높이는 <b>r</b>이에요(꼭짓점에서 내린 높이가 아니에요). 밑변 a, b, c 세 개를 모두 더해요.', '(a+b+c)는 삼각형의 <b>둘레</b>예요. 둘레와 r을 곱해 2로 나누면 돼요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, r, L, area } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}:${c}`;
      const head = `그림에서 점 I는 삼각형 ABC의 내심이고 ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm, ${S('AB')}=${c} cm이다.`;
      if (v === 0) return numProb({ tag: '내접원과 넓이 · 넓이', key, stem: `${head} 내접원의 반지름의 길이가 ${r} cm일 때, 삼각형 ABC의 넓이 $x$는?`, correct: area, wrongs: [[r * L, '2로 나누지 않았어요. S=½r(a+b+c)예요.'], [area * 2 - L, '다시 계산해 보세요.'], [(r * (a + bb)) / 2, '세 변을 모두 더해야 해요.'], [area + 2, '다시 계산해 보세요.'], [Math.max(1, area - 2), '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== area), ...ARn });
      return numProb({ tag: '내접원과 넓이 · 반지름', key, stem: `${head} 삼각형 ABC의 넓이가 ${area} cm²일 때, 내접원의 반지름 $x$는?`, correct: r, wrongs: [[(2 * area) / (a + bb), '세 변을 모두 더해야 해요.'], [area / L, '2를 곱해야 해요. S=½r(a+b+c)이므로 r=2S÷(a+b+c)예요.'], [r + 1, '다시 계산해 보세요.'], [r + 2, '다시 계산해 보세요.'], [Math.max(1, r - 1), '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== r && q[0] > 0), ...cmOpts });
    },
    verify: (s) => { const M = n2.model(s), g = M.g; const ar = Math.abs(G.polyArea([g.A, g.B, g.C])); return { ans: ar, model: M.area, extra: [[g.r, M.r], [dist(g.B, g.C), M.a], [dist(g.C, g.A), M.b], [dist(g.A, g.B), M.c]] }; }
  };

  /* ====================================================================== 3. 접선의 길이 */
  const tanGeom = (x, y, z) => fromSides(y + z, z + x, x + y);
  const n3 = {
    id: 't6-3', title: '꼭짓점에서 접점까지의 거리', short: '접선의 길이', solve: n3Solve,
    question: '내접원의 접점 D, E, F에서 꼭짓점까지의 거리 AF와 AE, BF와 BD, CD와 CE는 어떤 관계일까?',
    ctl: ['trNx', 'trNy', 'trNz'],
    init: (s) => { s.trNx = 4; s.trNy = 3; s.trNz = 5; s.trV = 0; },
    reroll: (s) => { do { s.trNx = rint(2, 8); s.trNy = rint(2, 8); s.trNz = rint(2, 8); } while (s.trNx === s.trNy && s.trNy === s.trNz); /* 세 변이 모두 같은 정삼각형은 변 길이 문제로 의미가 없어요 */ s.trV = (s.trV + 1) % 3; },
    model: (s) => { const x = clamp(Math.round(s.trNx), 2, 8), y = clamp(Math.round(s.trNy), 2, 8), z = clamp(Math.round(s.trNz), 2, 8); return { x, y, z, a: y + z, b: z + x, c: x + y, g: tanGeom(x, y, z) }; },
    draw(b, s, M, C) {
      const { x, y, z, a, b: bb, c, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g);
      [[D, B, Cc], [E, Cc, A], [F, A, B]].forEach(([Q, p, q]) => line(b, I, Q, 'rose', 2.4, { alpha: 0.6 }));
      // 접선 길이 색 막대
      line(b, A, F, 'amber', 5.5); line(b, A, E, 'amber', 5.5); line(b, B, F, 'sky', 5.5); line(b, B, D, 'sky', 5.5); line(b, Cc, D, 'green', 5.5); line(b, Cc, E, 'green', 5.5);
      tick(b, A, F, 1, 'amber'); tick(b, A, E, 1, 'amber'); tick(b, B, F, 2, 'sky'); tick(b, B, D, 2, 'sky'); tick(b, Cc, D, 3, 'green'); tick(b, Cc, E, 3, 'green');
      const q = fs(b, 15);
      if (C.problem) {
        if (v < 2) { G.sideTag(b, A, B, I, `${c} cm`, { color: 'ink', size: q, gap: 26 }); G.sideTag(b, B, Cc, I, `${a} cm`, { color: 'ink', size: q, gap: 26 }); G.sideTag(b, Cc, A, I, `${bb} cm`, { color: 'ink', size: q, gap: 26 }); }
        if (v === 0) G.sideTag(b, A, F, I, 'x', { color: 'amber', size: fs(b, 18), gap: 14 });
        else if (v === 1) G.sideTag(b, B, D, I, 'x', { color: 'sky', size: fs(b, 18), gap: 14 });
        else { G.sideTag(b, A, F, I, `${x} cm`, { color: 'amber', size: q, gap: 14 }); G.sideTag(b, B, Cc, I, `${a} cm`, { color: 'ink', size: q, gap: 26 }); T(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), '△ABC의 둘레 = x', { dy: 66, size: fs(b, 16), color: 'amber' }); }
      } else {
        G.sideTag(b, A, F, I, `${x}`, { color: 'amber', size: q, gap: 14 }); G.sideTag(b, A, E, I, `${x}`, { color: 'amber', size: q, gap: 14 });
        G.sideTag(b, B, F, I, `${y}`, { color: 'sky', size: q, gap: 14 }); G.sideTag(b, B, D, I, `${y}`, { color: 'sky', size: q, gap: 14 });
        G.sideTag(b, Cc, D, I, `${z}`, { color: 'green', size: q, gap: 14 }); G.sideTag(b, Cc, E, I, `${z}`, { color: 'green', size: q, gap: 14 });
        if (show(2)) { G.sideTag(b, A, B, I, `AB=${c}`, { color: 'ink', size: q, gap: 30 }); G.sideTag(b, B, Cc, I, `BC=${a}`, { color: 'ink', size: q, gap: 30 }); G.sideTag(b, Cc, A, I, `CA=${bb}`, { color: 'ink', size: q, gap: 30 }); }
      }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((zp) => b.point(zp, { color: 'ink', r: 4.5 })); [D, E, F].forEach((zp) => b.point(zp, { color: 'rose', r: 3.8 }));
      T(b, I, 'I', { dy: -2, dx: 14, size: 17, color: 'amber' }); nameV(b, g, I); feetNames(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `AF=AE=${x}, BF=BD=${y}, CD=CE=${z} (cm)`;
        else if (C.review && st === 2) { row = `AB=${x}+${y}=${c}, BC=${y}+${z}=${a}, CA=${z}+${x}=${bb}`; col = 'ink'; }
        else if (C.review && st === 3) { row = `AF = (AB+CA−BC)÷2 = (${c}+${bb}−${a})÷2 = ${x} cm`; col = 'amber'; }
        else row = `AF=AE=${x}, BF=BD=${y}, CD=CE=${z} → 둘레 ${2 * (x + y + z)} cm`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 66, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `꼭짓점에서 내접원에 그은 두 접선의 길이는 같아요. $\\overline{AF}=\\overline{AE}=${M.x}$, $\\overline{BF}=\\overline{BD}=${M.y}$, $\\overline{CD}=\\overline{CE}=${M.z}$ (cm)`,
      `세 변을 접선의 길이로 나타내요. $\\overline{AB}=\\overline{AF}+\\overline{BF}=${M.x}+${M.y}=${M.c}$, $\\overline{BC}=${M.y}+${M.z}=${M.a}$, $\\overline{CA}=${M.z}+${M.x}=${M.b}$`,
      `세 식을 이용하면 $\\overline{AF}=${fr('\\overline{AB}+\\overline{CA}-\\overline{BC}', 2)}=${fr(`${M.c}+${M.b}-${M.a}`, 2)}=${M.x}$ (cm)이고, 둘레는 $2(${M.x}+${M.y}+${M.z})=${2 * (M.x + M.y + M.z)}$ cm예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AF, BF, CD</b>를 바꿔 보세요. 같은 색의 두 선분(눈금의 개수가 같은 두 선분)은 길이가 같아요. 세 변은 두 접선의 길이를 <b>더한 것</b>이에요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('AF = AE', `${M.x} cm`, 'amber'), rd('BF = BD', `${M.y} cm`, 'sky'), rd('CD = CE', `${M.z} cm`, 'green'), rd('AB · BC · CA', `${M.c} · ${M.a} · ${M.b} cm`, 'sky', '두 접선 길이의 합', null, true)],
      formula: `<p>$\\overline{AF}=${fr('\\overline{AB}+\\overline{CA}-\\overline{BC}', 2)}=${fr(`${M.c}+${M.b}-${M.a}`, 2)}=${M.x}$ (cm)</p><p>(둘레) $=2(${M.x}+${M.y}+${M.z})=${2 * (M.x + M.y + M.z)}$ cm</p>`,
      rule: '삼각형 밖의 한 점(꼭짓점)에서 원에 그은 두 접선의 길이는 같다. 따라서 AF=AE, BF=BD, CD=CE이다.',
      notes: notes('같은 점에서 그은 <b>두 접선</b>만 길이가 같아요. AF와 BF는 같지 않아요.', '변의 길이 = 양 끝 점의 접선 길이의 <b>합</b>이에요.')
    }),
    prob: (M, s) => {
      const { x, y, z, a, b: bb, c } = M, v = (s.trV || 0) % 3, key = `${v}:${x}:${y}:${z}`;
      const head = `그림에서 원 I는 삼각형 ABC의 내접원이고 세 점 D, E, F는 접점이다. ${S('AB')}=${c} cm, ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm이다.`;
      if (v === 0) return numProb({ tag: '접선의 길이 · AF', key, stem: `${head} ${S('AF')}의 길이 $x$는?`, correct: x, wrongs: [[c - x, 'BF의 길이예요. AF=(AB+CA−BC)÷2예요.'], [y, 'BF의 길이예요.'], [z, 'CD의 길이예요.'], [x + 1, '다시 계산해 보세요.'], [Math.max(1, x - 1), '다시 계산해 보세요.']].filter((q) => q[0] !== x && q[0] > 0), ...cmOpts });
      if (v === 1) return numProb({ tag: '접선의 길이 · BD', key, stem: `${head} ${S('BD')}의 길이 $x$는?`, correct: y, wrongs: [[x, 'AF의 길이예요.'], [z, 'CD의 길이예요.'], [a - y, 'CD의 길이예요. BD=(AB+BC−CA)÷2예요.'], [y + 1, '다시 계산해 보세요.'], [Math.max(1, y - 1), '다시 계산해 보세요.']].filter((q) => q[0] !== y && q[0] > 0), ...cmOpts });
      return numProb({ tag: '접선의 길이 · 둘레', key, stem: `그림에서 원 I는 삼각형 ABC의 내접원이고 세 점 D, E, F는 접점이다. ${S('AF')}=${x} cm, ${S('BC')}=${a} cm일 때, 삼각형 ABC의 둘레 $x$는?`, correct: 2 * x + 2 * a, wrongs: [[x + a, '둘레는 AF+AE+...가 아니라 (AF+BC)의 2배예요.'], [2 * x + a, 'BC를 한 번만 더했어요.'], [x + 2 * a, 'AF를 한 번만 더했어요.'], [2 * x + 2 * a + 2, '다시 계산해 보세요.'], [2 * x + 2 * a - 2, '다시 계산해 보세요.']].filter((q) => q[0] !== 2 * x + 2 * a), ...cmOpts });
    },
    verify: (s) => { const M = n3.model(s), g = M.g; return { ans: dist(g.A, g.F), model: M.x, extra: [[dist(g.A, g.E), M.x], [dist(g.B, g.F), M.y], [dist(g.B, g.D), M.y], [dist(g.C, g.D), M.z], [dist(g.C, g.E), M.z]] }; }
  };

  /* ====================================================================== 4. 직각삼각형의 내접원 */
  const rtGeom = (a, b) => { const C0 = pt(0, 0), B = pt(a, 0), A = pt(0, -b), c = Math.hypot(a, b), r = (a + b - c) / 2, I = pt(r, -r); return { A, B, C: C0, I, D: pt(r, 0), E: pt(0, -r), F: foot(I, A, B), r }; };
  const n4 = {
    id: 't6-4', title: '직각삼각형의 내접원', short: '직각삼각형의 내접원', solve: n4Solve,
    question: '∠C=90°인 직각삼각형의 내접원의 반지름 r을 세 변의 길이로 구할 수 있을까?',
    ctl: ['trNj'],
    init: (s) => { s.trNj = 0; s.trV = 0; },
    reroll: (s) => { s.trNj = rint(0, 6); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const t = RT[clamp(Math.round(s.trNj), 0, 6)], [a, b, c, r] = t; return { a, b, c, r, g: rtGeom(a, b), ar: (a * b) / 2 }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, r, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 60, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(I, r, { color: 'amber', width: 2.6, alpha: 0.85 });
      fillPoly(b, [A, B, Cc], 'sky', 0.08);
      if (show(1)) fillPoly(b, [Cc, D, I, E], 'rose', 0.25);
      poly(b, [A, B, Cc], 'ink', 3.6);
      ang(b, Cc, A, B, { color: 'sky', r: 26 });
      [[D, B, Cc], [E, Cc, A], [F, A, B]].forEach(([Q]) => line(b, I, Q, 'rose', 3));
      ang(b, D, I, Cc, { color: 'rose', r: 12 }); ang(b, E, I, Cc, { color: 'rose', r: 12 });
      const cen = I;
      G.sideTag(b, Cc, B, pt(I.x, I.y - 50), `${a} cm`, { color: 'sky', size: fs(b, 16), gap: C.problem ? 24 : 8 }); G.sideTag(b, Cc, A, pt(50, I.y), `${bb} cm`, { color: 'green', size: fs(b, 16), gap: 8 }); G.sideTag(b, A, B, cen, C.problem && v === 1 ? 'x' : `${c} cm`, { color: C.problem && v === 1 ? 'amber' : 'violet', size: fs(b, C.problem && v === 1 ? 18 : 16), gap: 8 });
      if (C.problem) {
        if (v === 0) G.sideTag(b, I, D, pt(I.x + 50, I.y), 'x', { color: 'rose', size: fs(b, 18), gap: 6 });
        else { G.sideTag(b, I, D, pt(I.x + 50, I.y), `${r} cm`, { color: 'rose', size: fs(b, 15), gap: 6 }); }
      } else if (show(1)) { G.sideTag(b, I, D, pt(I.x + 50, I.y), `r`, { color: 'rose', size: fs(b, 16), gap: 6 }) }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'rose', r: 3.6 }));
      T(b, I, 'I', { dy: -14, dx: 10, size: 16, color: 'amber' }); tagOut(b, A, I, 'A', { size: 18 }); tagOut(b, B, I, 'B', { size: 18 }); tagOut(b, Cc, I, 'C', { size: 18 });
      T(b, D, 'D', { dy: 16, size: 16, color: 'green' }); T(b, E, 'E', { dx: -14, dy: 0, size: 16 }); tagOut(b, F, I, 'F', { size: 16, gap: 8 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'CDIE는 한 변이 r인 정사각형 → CD=CE=r';
        else if (C.review && st === 2) { row = `AE=AF=${bb}−r, BD=BF=${a}−r`; col = 'violet'; }
        else if (C.review && st === 3) { row = `r = (${a}+${bb}−${c})÷2 = ${r} cm`; col = 'amber'; }
        else row = `r = (a+b−c)÷2 = (${a}+${bb}−${c})÷2 = ${r} cm`;
        rowT(b, pt(a / 2, 0), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `∠C=90°이고 ID⊥BC, IE⊥CA이므로 사각형 CDIE는 한 변이 r인 정사각형이에요. 따라서 $\\overline{CD}=\\overline{CE}=r$.`,
      `접선의 길이는 같으므로 $\\overline{AE}=\\overline{AF}=${M.b}-r$, $\\overline{BD}=\\overline{BF}=${M.a}-r$예요.`,
      `$\\overline{AB}=\\overline{AF}+\\overline{BF}$이므로 $${M.c}=(${M.b}-r)+(${M.a}-r)$. 따라서 $r=${fr(`${M.a}+${M.b}-${M.c}`, 2)}=${M.r}$ (cm)예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>삼각형</b>을 골라 보세요(세 변이 정수인 직각삼각형이에요). 직각 꼭짓점 C 쪽에는 한 변이 <b>r</b>인 정사각형 CDIE가 생겨서 <b>r=(a+b−c)÷2</b>예요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('직각을 낀 두 변', `${M.a} cm, ${M.b} cm`, 'sky'), rd('빗변 c', `${M.c} cm`, 'violet'), rd('내접원의 반지름 r', `${M.r} cm`, 'rose', '(a + b − c) ÷ 2', null, true)],
      formula: `<p>$r=${fr('a+b-c', 2)}=${fr(`${M.a}+${M.b}-${M.c}`, 2)}=${M.r}$ (cm)</p><p>(넓이) $=${fr('1', 2)}\\times${M.a}\\times${M.b}=${M.ar}$, $=${fr('1', 2)}r(a+b+c)$로도 구할 수 있어요.</p>`,
      rule: '직각삼각형의 내접원의 반지름은 r = (직각을 낀 두 변의 합 − 빗변) ÷ 2 이다.',
      notes: notes('빗변을 <b>빼는</b> 것을 잊지 마세요. 세 변의 합이 아니라 두 변의 합 − 빗변이에요.', '직각 꼭짓점에서 접점까지의 거리가 r이에요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, r } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}`;
      const head = `그림과 같이 ∠C=90°인 직각삼각형 ABC의 내접원의 접점이 D, E, F이고 ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm, ${S('AB')}=${c} cm이다.`;
      if (v === 0) return numProb({ tag: '직각삼각형의 내접원 · 반지름', key, stem: `${head} 내접원의 반지름의 길이 $x$는?`, correct: r, wrongs: [[a + bb - c, '2로 나누지 않았어요.'], [(a + bb + c) / 2, '둘레의 반이에요. r=(두 변의 합−빗변)÷2예요.'], [(a + bb) / 2, '빗변을 빼야 해요.'], [r + 1, '다시 계산해 보세요.'], [r + 2, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== r && q[0] > 0), ...cmOpts });
      return numProb({ tag: '직각삼각형의 내접원 · 빗변', key, stem: `그림과 같이 ∠C=90°인 직각삼각형 ABC의 내접원의 반지름이 ${r} cm이고 ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm이다. 빗변 ${S('AB')}의 길이 $x$는?`, correct: c, wrongs: [[a + bb, '두 변의 합이에요. 빗변=두 변의 합−2r이에요.'], [a + bb - r, 'r을 한 번만 뺐어요. 2r을 빼야 해요.'], [a + bb + 2 * r, '더하지 않고 빼야 해요.'], [c + 1, '다시 계산해 보세요.'], [c - 1, '다시 계산해 보세요.']].filter((q) => q[0] !== c && q[0] > 0), ...cmOpts });
    },
    verify: (s) => { const M = n4.model(s), g = M.g; return { ans: g.r, model: M.r, extra: [[dist(g.I, g.F), g.r], [dist(g.A, g.B), M.c], [angBetween(g.C, g.A, g.B), 90]] }; }
  };

  /* ====================================================================== 5. 내심의 각 */
  const n5 = {
    id: 't6-5', title: '내심과 이등분선이 만드는 각', short: '내심의 각', solve: n5Solve,
    question: '내심 I에서 만든 각 ∠BIC는 ∠A와 어떤 관계일까?',
    ctl: ['trNa', 'trNb'],
    init: (s) => { s.trNa = 30; s.trNb = 30; s.trV = 0; },
    reroll: (s) => { s.trNa = rint(22, 38); s.trNb = rint(22, 38); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const al = clamp(Math.round(s.trNa), 20, 40), be = clamp(Math.round(s.trNb), 20, 40), ga = 90 - al - be; return { al, be, ga, bic: 90 + al, aib: 90 + ga, cia: 90 + be, g: fromAngles(2 * al, 2 * be, 2 * ga) }; },
    draw(b, s, M, C) {
      const { al, be, ga, bic, g } = M, { A, B, C: Cc, I } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g); [A, B, Cc].forEach((z) => line(b, z, I, 'green', 3, { dash: [7, 5] }));
      const pairs = (n) => { ang(b, A, B, I, { color: 'sky', r: 30, rings: 1 }); ang(b, A, I, Cc, { color: 'sky', r: 30, rings: 1 }); void n; };
      if (C.problem) {
        pairs();
        ang(b, B, A, I, { color: 'green', r: 30, rings: 2 }); ang(b, B, I, Cc, { color: 'green', r: 30, rings: 2 });
        ang(b, Cc, B, I, { color: 'violet', r: 30, rings: 3 }); ang(b, Cc, I, A, { color: 'violet', r: 30, rings: 3 });
        if (v === 0) { T(b, A, `${2 * al}°`, { dy: 44, size: fs(b, 16), color: 'sky' }); ang(b, I, B, Cc, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 54 }); }
        else if (v === 1) { ang(b, I, B, Cc, { color: 'sky', r: 34, label: dg(bic), size: 16, labelDist: 54 }); T(b, A, 'x', { dy: 44, size: fs(b, 18), color: 'amber' }); }
        else { T(b, B, `${be}°`, { dx: 50, dy: -12, size: fs(b, 15), color: 'green' }); T(b, Cc, `${ga}°`, { dx: -50, dy: -12, size: fs(b, 15), color: 'violet' }); T(b, A, 'x', { dy: 44, size: fs(b, 18), color: 'amber' }); }
      } else {
        ang(b, A, B, I, { color: 'sky', r: 30, rings: 1 }); ang(b, A, I, Cc, { color: 'sky', r: 30, rings: 1 });
        ang(b, B, A, I, { color: 'green', r: 30, rings: 2 }); ang(b, B, I, Cc, { color: 'green', r: 30, rings: 2 }); ang(b, Cc, B, I, { color: 'violet', r: 30, rings: 3 }); ang(b, Cc, I, A, { color: 'violet', r: 30, rings: 3 });
        if (show(1)) { T(b, A, `${al}°`, { dy: 50, size: fs(b, 14), color: 'sky' }); T(b, B, `${be}°`, { dx: 50, dy: -12, size: fs(b, 14), color: 'green' }); T(b, Cc, `${ga}°`, { dx: -50, dy: -12, size: fs(b, 14), color: 'violet' }); }
        if (show(3)) ang(b, I, B, Cc, { color: 'amber', r: 36, label: dg(bic), size: 15, labelDist: 56 });
      }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, I, 'I', { dy: -16, size: 18, color: 'amber' }); nameV(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠IAB=∠IAC=●, ∠IBA=∠IBC=×, ∠ICA=∠ICB=■`;
        else if (C.review && st === 2) { row = `●+×+■ = 90° (${al}°+${be}°+${ga}°)`; col = 'green'; }
        else if (C.review && st === 3) { row = `∠BIC = 180°−(×+■) = 90°+● = ${bic}°`; col = 'amber'; }
        else row = `x+y+z=${al + be + ga}°, ∠BIC=90°+\\frac{1}{2}∠A=${bic}°`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `내심 I에서 세 꼭짓점을 이으면 각의 이등분선이므로 $\\angle IAB=\\angle IAC=●$, $\\angle IBA=\\angle IBC=×$, $\\angle ICA=\\angle ICB=■$라 할 수 있어요.`,
      `삼각형 ABC의 내각의 합: $2●+2×+2■=180^{\\circ}$이므로 $●+×+■=90^{\\circ}$ (이 그림: ${M.al}°+${M.be}°+${M.ga}°=90°).`,
      `△IBC에서 $\\angle BIC=180^{\\circ}-(×+■)=180^{\\circ}-(90^{\\circ}-●)=90^{\\circ}+●=90^{\\circ}+${fr('1', 2)}\\angle A=90^{\\circ}+${fr('1', 2)}\\times${2 * M.al}^{\\circ}=${M.bic}^{\\circ}$`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A의 반(●), ∠B의 반(×)</b>을 바꿔 보세요. 세 반쪽 각의 합은 늘 <b>90°</b>이고, 그래서 <b>∠BIC는 90°보다 ∠A의 반만큼 커요</b>. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('● · × · ■', `${M.al}° · ${M.be}° · ${M.ga}°`, 'sky', '합 90°'), rd('∠BIC', `${M.bic}°`, 'amber', '90° + ½∠A', null, true)],
      formula: `<p>$x+y+z=90^{\\circ}$</p><p>$\\angle BIC=90^{\\circ}+${fr('1', 2)}\\angle A=90^{\\circ}+${fr('1', 2)}\\times${2 * M.al}^{\\circ}=${M.bic}^{\\circ}$</p>`,
      rule: '삼각형의 내심 I에 대하여 ∠BIC = 90° + ½∠A 이다. (세 이등분각의 합 x+y+z=90°)',
      notes: notes('∠BIC는 <b>90°보다 커요</b>. 90°−½∠A가 아니라 90°+½∠A예요(외각의 이등분선일 때가 90°−½∠A).', '½∠A는 ∠A를 <b>이등분한 각</b> ●이에요. ∠A 자체를 더하면 안 돼요.')
    }),
    prob: (M, s) => {
      const { al, be, ga, bic } = M, v = (s.trV || 0) % 3, key = `${v}:${al}:${be}`;
      const head = '그림에서 점 I는 삼각형 ABC의 내심이다.';
      if (v === 0) return numProb({ tag: '내심의 각 · ∠BIC', key, stem: `${head} ∠A=${2 * al}°일 때, ∠BIC의 크기 $x$는?`, correct: bic, wrongs: [[90 - al, '내각의 이등분선 둘이 만나면 90°보다 커요. 90°+½∠A예요.'], [180 - 2 * al, '다시 생각해 보세요.'], [90 + 2 * al, '∠A의 반을 더해야 해요.'], [2 * al, '다시 생각해 보세요.'], [bic + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== bic && q[0] > 0 && q[0] < 180), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '내심의 각 · ∠A', key, stem: `${head} ∠BIC=${bic}°일 때, ∠A의 크기 $x$는?`, correct: 2 * al, wrongs: [[bic - 90, '∠A의 반이에요. ∠A는 그 2배예요.'], [180 - bic, '다시 생각해 보세요.'], [bic, '∠BIC 그대로예요.'], [2 * (180 - bic), '다시 생각해 보세요.'], [2 * al + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== 2 * al && q[0] > 0 && q[0] < 180), ...degOpts(5) });
      return numProb({ tag: '내심의 각 · x+y+z=90°', key, stem: `${head} ∠IBA=∠IBC=${be}°, ∠ICA=∠ICB=${ga}°일 때, ∠A의 크기 $x$는?`, correct: 2 * al, wrongs: [[al, '∠A의 반이에요. ∠A는 그 2배예요.'], [180 - be - ga, '∠BIC예요.'], [90 - be - ga, '∠A의 반이에요.'], [be + ga, '다시 생각해 보세요.'], [2 * al + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== 2 * al && q[0] > 0 && q[0] < 180), ...degOpts(5) });
    },
    verify: (s) => { const M = n5.model(s), g = M.g; return { ans: angBetween(g.I, g.B, g.C), model: M.bic, extra: [[M.al + M.be + M.ga, 90], [angBetween(g.A, g.B, g.C), 2 * M.al]] }; }
  };

  /* ====================================================================== 6. 내심을 지나는 평행선 */
  const n6 = {
    id: 't6-6', title: '내심을 지나는 평행선', short: '내심을 지나는 평행선', solve: n6Solve,
    question: '내심 I를 지나고 BC에 평행한 선이 AB, AC와 만나는 점을 D, E라 할 때 △ADE의 둘레는?',
    ctl: ['trNx', 'trNy', 'trNz'],
    init: (s) => { s.trNx = 4; s.trNy = 3; s.trNz = 5; s.trV = 0; },
    reroll: (s) => { s.trNx = rint(3, 8); s.trNy = rint(3, 8); s.trNz = rint(3, 8); s.trV = (s.trV + 1) % 2; },
    model: (s) => {
      const x = clamp(Math.round(s.trNx), 2, 8), y = clamp(Math.round(s.trNy), 2, 8), z = clamp(Math.round(s.trNz), 2, 8), g = tanGeom(x, y, z), { A, B, C: Cc, I } = g;
      const D = inter(A, B, I, add(I, sub(Cc, B))), E = inter(A, Cc, I, add(I, sub(Cc, B)));
      return { x, y, z, a: y + z, b: z + x, c: x + y, g, D, E, per: (z + x) + (x + y) };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, g, D, E, per } = M, { A, B, C: Cc, I } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? (v === 1 ? 84 : 64) : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      fillPoly(b, [A, D, E], 'green', 0.2); drawBase(b, g);
      line(b, B, I, 'sky', 3, { dash: [7, 5] }); line(b, Cc, I, 'violet', 3, { dash: [7, 5] });
      line(b, D, E, 'green', 3.6);
      ang(b, B, A, I, { color: 'sky', r: 30, rings: 1 }); ang(b, B, I, Cc, { color: 'sky', r: 30, rings: 1 }); ang(b, Cc, B, I, { color: 'violet', r: 30, rings: 2 }); ang(b, Cc, I, A, { color: 'violet', r: 30, rings: 2 });
      if (!C.problem || v === 0) { G.sideTag(b, A, B, I, `${c} cm`, { color: 'ink', size: fs(b, 15), gap: 8 }); G.sideTag(b, Cc, A, I, `${bb} cm`, { color: 'ink', size: fs(b, 15), gap: 8 }); }
      if (C.problem) {
        const by = Math.max(B.y, Cc.y), cx = (A.x + B.x + Cc.x) / 3;
        poly(b, [A, D, E], 'amber', 3.6);
        if (v === 1) T(b, pt(cx, by), `△ABC의 둘레 = ${a + bb + c} cm`, { dy: 34, size: fs(b, 15), color: 'ink' });
        T(b, pt(cx, by), '△ADE의 둘레 = x', { dy: v === 1 ? 58 : 34, size: fs(b, 16), color: 'amber' });
      }
      if (C.problem) { G.sideTag(b, B, Cc, I, `${a} cm`, { color: 'ink', size: fs(b, 15), gap: 8 }); }
      else if (show(2)) { tick(b, D, B, 2, 'sky'); tick(b, D, I, 2, 'sky'); tick(b, E, Cc, 3, 'violet'); tick(b, E, I, 3, 'violet'); }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E].forEach((z) => b.point(z, { color: 'green', r: 4.5 }));
      T(b, I, 'I', { dy: 16, size: 17, color: 'amber' }); nameV(b, g, I); tagOut(b, D, I, 'D', { size: 17, gap: 8 }); tagOut(b, E, I, 'E', { size: 17, gap: 8 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'DE∥BC → ∠DIB=∠IBC (엇각), ∠IBC=∠IBD → DB=DI';
        else if (C.review && st === 2) { row = 'DB=DI, EC=EI → DE=DB+EC'; col = 'green'; }
        else if (C.review && st === 3) { row = `△ADE 둘레 = AB+AC = ${c}+${bb} = ${per} cm`; col = 'amber'; }
        else row = `△ADE의 둘레 = AB+AC = ${c}+${bb} = ${per} cm`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `DE∥BC이므로 $\\angle DIB=\\angle IBC$ (엇각)이고, BI가 ∠B의 이등분선이므로 $\\angle IBD=\\angle IBC$예요. 그래서 $\\angle DIB=\\angle DBI$이고 △DBI는 이등변삼각형이므로 $\\overline{DB}=\\overline{DI}$예요.`,
      `같은 방법으로 $\\angle EIC=\\angle ICB=\\angle ICE$이므로 $\\overline{EC}=\\overline{EI}$예요. 따라서 $\\overline{DE}=\\overline{DI}+\\overline{IE}=\\overline{DB}+\\overline{EC}$.`,
      `△ADE의 둘레 $=\\overline{AD}+\\overline{DE}+\\overline{EA}=\\overline{AD}+(\\overline{DB}+\\overline{EC})+\\overline{EA}=\\overline{AB}+\\overline{AC}=${M.c}+${M.b}=${M.per}$ (cm)`
    ],
    view: (M) => ({
      guide: '막대로 <b>접선의 길이</b>를 바꿔 삼각형을 바꿔 보세요. 내심 I를 지나 BC에 평행하게 그은 선분 DE에서 <b>DB=DI, EC=EI</b>가 돼요. 그래서 △ADE의 둘레는 늘 <b>AB+AC</b>예요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('AB · AC · BC', `${M.c} · ${M.b} · ${M.a} cm`, 'sky'), rd('△ADE의 둘레', `${M.per} cm`, 'amber', 'AB + AC', null, true)],
      formula: `<p>$\\overline{DB}=\\overline{DI},\\ \\overline{EC}=\\overline{EI}$</p><p>(△ADE의 둘레) $=\\overline{AB}+\\overline{AC}=${M.c}+${M.b}=${M.per}$ (cm)</p>`,
      rule: '삼각형 ABC의 내심 I를 지나고 BC에 평행한 직선이 AB, AC와 만나는 점을 D, E라 하면 △ADE의 둘레 = AB + AC 이다.',
      notes: notes('△ADE의 둘레에 <b>BC는 들어가지 않아요</b>. AB와 AC의 합이에요.', 'DB=DI, EC=EI의 이유는 <b>엇각과 각의 이등분선</b>이에요. 내심을 지나기 때문에 성립해요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, per } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}:${c}`;
      const head = `그림에서 점 I는 삼각형 ABC의 내심이고, I를 지나고 ${S('BC')}에 평행한 직선이 ${S('AB')}, ${S('AC')}와 만나는 점을 각각 D, E라 하자.`;
      if (v === 0) return numProb({ tag: '내심을 지나는 평행선 · 둘레', key, stem: `${head} ${S('AB')}=${c} cm, ${S('AC')}=${bb} cm, ${S('BC')}=${a} cm일 때, △ADE의 둘레 $x$는?`, correct: per, wrongs: [[a + bb + c, '삼각형 ABC의 둘레예요. △ADE의 둘레는 AB+AC예요.'], [per - a, '다시 생각해 보세요.'], [per + a, '다시 생각해 보세요.'], [bb + a, '다시 생각해 보세요.'], [c + a, '다시 생각해 보세요.']].filter((q) => q[0] !== per), ...cmOpts });
      return numProb({ tag: '내심을 지나는 평행선 · 변의 길이', key, stem: `${head} 삼각형 ABC의 둘레가 ${a + bb + c} cm이고 ${S('BC')}=${a} cm일 때, △ADE의 둘레 $x$는?`, correct: per, wrongs: [[a + bb + c, '삼각형 ABC의 둘레예요. BC를 빼야 해요.'], [per - a, '다시 생각해 보세요.'], [per + a, '다시 생각해 보세요.'], [a + bb + c - 2 * a, '다시 계산해 보세요.'], [(a + bb + c) / 2, '다시 생각해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== per), ...cmOpts });
    },
    verify: (s) => { const M = n6.model(s), g = M.g; return { ans: dist(g.A, M.D) + dist(M.D, M.E) + dist(M.E, g.A), model: M.per / 1, extra: [[dist(M.D, g.B), dist(M.D, g.I)], [dist(M.E, g.C), dist(M.E, g.I)]] }; }
  };

  /* ====================================================================== 7. 각의 비 */
  const validTri = (a, b, c) => { const S0 = a + b + c; return [a, b, c].every((q) => (360 * q) % S0 === 0 && (360 * q) / S0 > 90 && (360 * q) / S0 < 180); };
  const VALID = []; for (let a = 1; a <= 13; a++) for (let b = 1; b <= 13; b++) for (let c = 1; c <= 13; c++) if (validTri(a, b, c)) VALID.push([a, b, c]);
  const VALID_D = VALID.filter((t) => new Set(t).size === 3 && (360 * Math.min(...t)) / (t[0] + t[1] + t[2]) >= 105); // 문제는 세 값이 서로 다르고 삼각형의 세 각이 모두 30° 이상(각 ∠AIB 등이 105° 이상)인 비만 — 7:8:9, 9:10:11, 11:12:13
  const n7 = {
    id: 't6-7', title: '∠AIB : ∠BIC : ∠CIA 의 비', short: '각의 비', solve: n7Solve,
    question: '내심 I에서 만든 세 각 ∠AIB, ∠BIC, ∠CIA의 비를 알면 ∠A, ∠B, ∠C를 구할 수 있을까?',
    ctl: ['trNm', 'trNn', 'trNo'],
    init: (s) => { s.trNm = 7; s.trNn = 8; s.trNo = 9; s.trV = 0; },
    reroll: (s) => { const p = pick(VALID_D, null); s.trNm = p[0]; s.trNn = p[1]; s.trNo = p[2]; s.trV = (s.trV + 1) % 2; },
    model: (s) => {
      const a0 = clamp(Math.round(s.trNm), 1, 13), b0 = clamp(Math.round(s.trNn), 1, 13), c0 = clamp(Math.round(s.trNo), 1, 13);
      let best = VALID[0], bd = 1e9; VALID.forEach((t) => { const d = Math.abs(t[0] - a0) + Math.abs(t[1] - b0) + Math.abs(t[2] - c0); if (d < bd) { bd = d; best = t; } });
      const [a, b, c] = best, S0 = a + b + c, aib = (360 * a) / S0, bic = (360 * b) / S0, cia = (360 * c) / S0;
      const A = 2 * (bic - 90), B = 2 * (cia - 90), Cd = 2 * (aib - 90);
      return { a, b, c, adj: bd > 0, aib, bic, cia, A, B, C: Cd, g: fromAngles(A, B, Cd) };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, aib, bic, cia, A: Ad, B: Bd, C: Cd, g } = M, { A, B, C: Cc, I } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g); [A, B, Cc].forEach((z) => line(b, z, I, 'green', 3, { dash: [7, 5] }));
      if (C.problem) {
        ang(b, I, A, B, { color: 'sky', r: 24, label: String(a), size: 15, labelDist: 40 }); ang(b, I, B, Cc, { color: 'green', r: 24, label: String(bb), size: 15, labelDist: 40 }); ang(b, I, Cc, A, { color: 'violet', r: 24, label: String(c), size: 15, labelDist: 40 });
        if (v === 0) ang(b, A, B, Cc, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 54 }); else ang(b, B, A, Cc, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 54 });
      } else {
        ang(b, I, A, B, { color: 'sky', r: 24, label: dg(aib), size: 13, labelDist: 42 }); ang(b, I, B, Cc, { color: 'green', r: 24, label: dg(bic), size: 13, labelDist: 42 }); ang(b, I, Cc, A, { color: 'violet', r: 24, label: dg(cia), size: 13, labelDist: 42 });
        if (show(3)) { T(b, A, `${Ad}°`, { dy: 50, size: fs(b, 15), color: 'amber' }); T(b, B, `${Bd}°`, { dx: 50, dy: -12, size: fs(b, 15), color: 'amber' }); T(b, Cc, `${Cd}°`, { dx: -50, dy: -12, size: fs(b, 15), color: 'amber' }); }
      }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, I, 'I', { dy: 26, dx: 14, size: 17, color: 'amber' }); nameV(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠AIB:∠BIC:∠CIA = ${a}:${bb}:${c}, 합 360°`;
        else if (C.review && st === 2) { row = `∠BIC=${bic}° = 90°+\\frac{1}{2}∠A`; col = 'green'; }
        else if (C.review && st === 3) { row = `∠A=${Ad}°, ∠B=${Bd}°, ∠C=${Cd}°`; col = 'amber'; }
        else row = `∠AIB=${aib}°, ∠BIC=${bic}°, ∠CIA=${cia}° → ∠A=${Ad}°, ∠B=${Bd}°, ∠C=${Cd}°`;
        rowT(b, pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y)), row, { dy: 40, size: fs(b, 14), color: col });
      }
    },
    steps: (M) => [
      `내심 I에서 만든 세 각의 합은 $360^{\\circ}$이고 비가 $${M.a}:${M.b}:${M.c}$이므로 $\\angle AIB=${M.aib}^{\\circ}$, $\\angle BIC=${M.bic}^{\\circ}$, $\\angle CIA=${M.cia}^{\\circ}$예요.`,
      `내심의 각의 성질 $\\angle BIC=90^{\\circ}+${fr('1', 2)}\\angle A$에서 $\\angle A=2(\\angle BIC-90^{\\circ})=2(${M.bic}^{\\circ}-90^{\\circ})=${M.A}^{\\circ}$예요.`,
      `같은 방법으로 $\\angle B=2(\\angle CIA-90^{\\circ})=${M.B}^{\\circ}$, $\\angle C=2(\\angle AIB-90^{\\circ})=${M.C}^{\\circ}$예요. (세 각의 합 ${M.A + M.B + M.C}°)`
    ],
    view: (M) => ({
      guide: '막대로 <b>비 a : b : c</b>를 바꿔 보세요(각이 정수가 되고 삼각형이 만들어지는 비로 가장 가까운 것을 골라 줘요). ∠BIC=90°+½∠A이므로 <b>∠A=2(∠BIC−90°)</b>예요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('비 a : b : c', `${M.a} : ${M.b} : ${M.c}`, 'sky', M.adj ? '가까운 올바른 비로 맞췄어요' : null), rd('∠AIB · ∠BIC · ∠CIA', `${M.aib}° · ${M.bic}° · ${M.cia}°`, 'green'), rd('∠A · ∠B · ∠C', `${M.A}° · ${M.B}° · ${M.C}°`, 'amber', null, null, true)],
      formula: `<p>$\\angle A=2(\\angle BIC-90^{\\circ})=2(${M.bic}^{\\circ}-90^{\\circ})=${M.A}^{\\circ}$</p>`,
      rule: '∠BIC=90°+½∠A, ∠CIA=90°+½∠B, ∠AIB=90°+½∠C 이므로 ∠A=2(∠BIC−90°)이다.',
      notes: notes('∠BIC가 가장 큰 쪽이 ∠A가 가장 큰 쪽이에요. 대응을 헷갈리지 마세요.', '비의 합은 360°예요(내심 둘레의 한 바퀴).')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, A, B, C: Cd } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}:${c}`;
      const head = `그림에서 점 I는 삼각형 ABC의 내심이고 ∠AIB : ∠BIC : ∠CIA = ${a} : ${bb} : ${c}이다.`;
      if (v === 0) return numProb({ tag: '내심의 각의 비 · ∠A', key, stem: `${head} ∠A의 크기 $x$는?`, correct: A, wrongs: [[M.bic, '∠BIC예요. ∠A=2(∠BIC−90°)예요.'], [M.bic - 90, '∠A의 반이에요.'], [B, '∠B예요.'], [Cd, '∠C예요.'], [A + 10, '다시 계산해 보세요.'], [A - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== A && q[0] > 0 && q[0] < 180), ...degOpts(5) });
      return numProb({ tag: '내심의 각의 비 · ∠B', key, stem: `${head} ∠B의 크기 $x$는?`, correct: B, wrongs: [[M.cia, '∠CIA예요. ∠B=2(∠CIA−90°)예요.'], [M.cia - 90, '∠B의 반이에요.'], [A, '∠A예요.'], [Cd, '∠C예요.'], [B + 10, '다시 계산해 보세요.'], [B - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== B && q[0] > 0 && q[0] < 180), ...degOpts(5) });
    },
    verify: (s) => { const M = n7.model(s), g = M.g; return { ans: angBetween(g.I, g.B, g.C), model: M.bic, extra: [[angBetween(g.I, g.A, g.B), M.aib], [angBetween(g.I, g.C, g.A), M.cia], [M.A + M.B + M.C, 180]] }; }
  };

  /* ====================================================================== 8. 변의 길이로 접선의 길이 구하기 */
  const n8 = {
    id: 't6-8', title: '세 변의 길이로 접선의 길이 구하기', short: '변의 길이로 접선', solve: n8Solve,
    question: '세 변의 길이 AB, BC, CA를 알면 꼭짓점에서 접점까지의 거리 AF, BD, CE를 구할 수 있을까?',
    ctl: ['trNp', 'trNq', 'trNs'],
    init: (s) => { s.trNp = 9; s.trNq = 7; s.trNs = 8; s.trV = 0; },
    reroll: (s) => { let m; do { s.trNp = rint(5, 12); s.trNq = rint(5, 12); s.trNs = rint(3, 20); m = n8.model(s); } while (m.a === m.b && m.b === m.c); /* 세 변이 모두 같은 정삼각형은 변 길이 문제로 의미가 없어요 */ s.trV = (s.trV + 1) % 3; },
    model: (s) => {
      const c = clamp(Math.round(s.trNp), 4, 12), bb = clamp(Math.round(s.trNq), 4, 12);
      let a = clamp(Math.round(s.trNs), 3, 20);
      const lo = Math.abs(c - bb) + 1, hi = c + bb - 1;
      a = clamp(a, lo, hi);
      if ((c + bb - a) % 2) a = a + 1 <= hi ? a + 1 : a - 1;
      const x = (c + bb - a) / 2, y = (c + a - bb) / 2, z = (a + bb - c) / 2;
      return { a, b: bb, c, x, y, z, adj: a !== clamp(Math.round(s.trNs), 3, 20), g: tanGeom(x, y, z) };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, x, y, z, g } = M, { A, B, C: Cc, I, D, E, F } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawBase(b, g);
      line(b, A, F, 'amber', 5); line(b, A, E, 'amber', 5); line(b, B, F, 'sky', 5); line(b, B, D, 'sky', 5); line(b, Cc, D, 'green', 5); line(b, Cc, E, 'green', 5);
      tick(b, A, F, 1, 'amber'); tick(b, A, E, 1, 'amber'); tick(b, B, F, 2, 'sky'); tick(b, B, D, 2, 'sky'); tick(b, Cc, D, 3, 'green'); tick(b, Cc, E, 3, 'green');
      const q = fs(b, 15);
      G.sideTag(b, A, B, I, `${c} cm`, { color: 'ink', size: q, gap: 26 }); G.sideTag(b, B, Cc, I, `${a} cm`, { color: 'ink', size: q, gap: 26 }); G.sideTag(b, Cc, A, I, `${bb} cm`, { color: 'ink', size: q, gap: 26 });
      if (C.problem) { if (v === 0) G.sideTag(b, A, F, I, 'x', { color: 'amber', size: fs(b, 18), gap: 12 }); else if (v === 1) G.sideTag(b, B, D, I, 'x', { color: 'sky', size: fs(b, 18), gap: 12 }); else G.sideTag(b, Cc, E, I, 'x', { color: 'green', size: fs(b, 18), gap: 12 }); }
      else { if (show(3)) { G.sideTag(b, A, F, I, `${x}`, { color: 'amber', size: q, gap: 12 }); G.sideTag(b, B, D, I, `${y}`, { color: 'sky', size: q, gap: 12 }); G.sideTag(b, Cc, E, I, `${z}`, { color: 'green', size: q, gap: 12 }); } }
      b.point(I, { color: 'amber', r: 5 }); [A, B, Cc].forEach((zp) => b.point(zp, { color: 'ink', r: 4.5 })); [D, E, F].forEach((zp) => b.point(zp, { color: 'rose', r: 3.8 }));
      T(b, I, 'I', { dy: -2, dx: 14, size: 17, color: 'amber' }); nameV(b, g, I); feetNames(b, g, I);
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'AF=AE=x, BF=BD=y, CD=CE=z';
        else if (C.review && st === 2) { row = `x+y=${c}, y+z=${a}, z+x=${bb}`; col = 'ink'; }
        else if (C.review && st === 3) { row = `x=${x}, y=${y}, z=${z} (cm)`; col = 'amber'; }
        else row = `AB=${c}, BC=${a}, CA=${bb} → AF=${x}, BD=${y}, CE=${z} (cm)`;
        // 주어진 세 변은 그림에도 있으므로 좁은 탐구 무대에서는 접선 길이만 한 줄로 씁니다.
        // 두 줄로 나눈 요약이 접점 D와 BD의 길이 위로 밀려 올라오지 않게 합니다.
        const compactCaption = !C.review && b.W < 560 && G.textW(row, fs(b, 15)) * 1.1 > Math.max(180, b.W - 28);
        if (compactCaption) row = `AF=${x}, BD=${y}, CE=${z} (cm)`;
        const captionPoint = pt((A.x + B.x + Cc.x) / 3, Math.max(B.y, Cc.y));
        const captionDy = compactCaption ? b.H - (b.insets.bottom || 0) - 24 - b.toS(captionPoint).y : 66;
        rowT(b, captionPoint, row, { dy: captionDy, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `접선의 길이는 같으므로 $\\overline{AF}=\\overline{AE}=x$, $\\overline{BF}=\\overline{BD}=y$, $\\overline{CD}=\\overline{CE}=z$라 해요.`,
      `세 변은 $\\overline{AB}=x+y=${M.c}$, $\\overline{BC}=y+z=${M.a}$, $\\overline{CA}=z+x=${M.b}$예요.`,
      `세 식을 모두 더하면 $2(x+y+z)=${M.a + M.b + M.c}$이므로 $x+y+z=${(M.a + M.b + M.c) / 2}$. 따라서 $x=${(M.a + M.b + M.c) / 2}-${M.a}=${M.x}$, $y=${(M.a + M.b + M.c) / 2}-${M.b}=${M.y}$, $z=${(M.a + M.b + M.c) / 2}-${M.c}=${M.z}$ (cm)예요.`
    ],
    view: (M) => ({
      guide: `막대로 <b>AB, AC, BC</b>를 바꿔 보세요(접선의 길이가 정수가 되도록 BC를 맞춰 줘요${M.adj ? ' — 지금 맞췄어요' : ''}). 세 변의 길이를 알면 <b>AF=(AB+AC−BC)÷2</b>처럼 구해요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.`,
      readouts: [rd('AB · BC · CA', `${M.c} · ${M.a} · ${M.b} cm`, 'sky'), rd('AF · BD · CE', `${M.x} · ${M.y} · ${M.z} cm`, 'amber', '접선의 길이', null, true)],
      formula: `<p>$\\overline{AF}=${fr('\\overline{AB}+\\overline{CA}-\\overline{BC}', 2)}=${fr(`${M.c}+${M.b}-${M.a}`, 2)}=${M.x}$</p><p>$\\overline{BD}=${M.y}$, $\\overline{CE}=${M.z}$ (cm)</p>`,
      rule: '접선의 길이 = (두 변의 합 − 나머지 한 변) ÷ 2. 예: AF = (AB + CA − BC) ÷ 2',
      notes: notes('AF는 꼭짓점 <b>A</b>를 낀 두 변 AB, CA의 합에서 <b>BC</b>를 빼요.', '구한 접선의 길이를 다시 더해 AB, BC, CA의 주어진 길이와 맞는지 확인해요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, x, y, z } = M, v = (s.trV || 0) % 3, key = `${v}:${a}:${bb}:${c}`;
      const head = `그림에서 원 I는 삼각형 ABC의 내접원이고 세 점 D, E, F는 접점이다. ${S('AB')}=${c} cm, ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm이다.`;
      const f = (name, ans, bad) => numProb({ tag: `접선의 길이 · ${name}`, key, stem: `${head} ${S(name)}의 길이 $x$는?`, correct: ans, wrongs: bad.concat([[ans + 1, '다시 계산해 보세요.'], [Math.max(1, ans - 1), '다시 계산해 보세요.']]).filter((q) => q[0] !== ans && q[0] > 0), ...cmOpts });
      if (v === 0) return f('AF', x, [[y, 'BF의 길이예요.'], [z, 'CE의 길이예요.'], [c - x, 'BF의 길이예요. AF=(AB+CA−BC)÷2예요.'], [(c + bb) / 2, 'BC를 빼야 해요.']].filter((q) => Number.isInteger(q[0])));
      if (v === 1) return f('BD', y, [[x, 'AF의 길이예요.'], [z, 'CE의 길이예요.'], [a - y, 'CD의 길이예요.'], [(c + a) / 2, 'CA를 빼야 해요.']].filter((q) => Number.isInteger(q[0])));
      return f('CE', z, [[x, 'AF의 길이예요.'], [y, 'BD의 길이예요.'], [bb - z, 'AE의 길이예요.'], [(a + bb) / 2, 'AB를 빼야 해요.']].filter((q) => Number.isInteger(q[0])));
    },
    verify: (s) => { const M = n8.model(s), g = M.g; return { ans: dist(g.A, g.F), model: M.x, extra: [[dist(g.B, g.D), M.y], [dist(g.C, g.E), M.z], [dist(g.B, g.C), M.a], [dist(g.A, g.B), M.c], [dist(g.C, g.A), M.b]] }; }
  };


  // 풀이 흐름: 보기가 글인 문제는 5지선다 대신 문장 ①~⑤ 를 발문 아래에 보여 줍니다
  const n1p = n1.prob;
  n1.prob = (M, s) => (((s.trV || 0) % 3 === 2) ? SVB.listStmts(n1p(M, s)) : n1p(M, s));

  G.register(60, 't6', '⑥ 내심', '내심', PARAMS, [n1, n2, n3, n4, n5, n6, n7, n8]);
})();
