/* ==========================================================================
   중2 · 도형의 닮음 — 탭 ③ 「삼각형의 닮음 조건」 (t3.js, order 30) — 장면 9개
   · s3-1 평행선과 닮음(AA)     · DE ∥ BC 이면 △ADE ∽ △ABC
   · s3-2 엇갈린 닮음(AA)       · ∠ADE=∠C 이면 △ADE ∽ △ACB (대응 순서가 뒤집혀요)
   · s3-3 꼭짓점을 공유한 닮음  · 돌아가 있는 작은 삼각형을 제자리에서 돌려 포개어 대응 찾기
   · s3-4 공통 끼인각(SAS)      · 두 변의 길이의 비가 같고 끼인각이 같다
   · s3-5 평행선 2개와 닮은 삼각형 3개 · 닮음비 AD : AF : AB (누적)
   · s3-6 [함정] SSA 반례       · 두 변과 끼인각이 아닌 각 → 삼각형이 2개 생길 수 있어요
   · s3-7 직사각형 종이접기      · 접은 각 ●+×=90°, AA 닮음
   · s3-8 정삼각형 종이접기      · 접은 각 ●+×=120°, AA 닮음
   · s3-9 [심화] 사다리꼴 대각선 · 넓이의 비 a² : ab : ab : b²
   값은 모두 정수(각은 정수 도)이고, 글자·표시·정답은 지금의 슬라이더 값으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SM;
  if (!G) return;
  const { DEG, clamp, ease, seg01, pt, add, sub, mul, mid, lerp, polar, rotP, dist, unit, centroid, triTop, seeded, ri, rpick, shuffle, T, tagOut, sideTag, dim, ang, tick, par, fillPoly, line, poly, fit, P, rd, notes, mkChoices, mkTextChoices, gcd, fmtN, bboxOf, unionBox, phone, capSize, frT, vtx, inter, angBetween, textW } = G;

  const PARAMS = {
    smPm: P('AD (위쪽 조각) m', 1, 3, 1, 2, { color: 'sky', hint: 'AD : DB = m : k 가 되도록 점 D의 자리가 바뀌어요' }),
    smPd: P('DB (아래쪽 조각) k', 1, 3, 1, 1, { color: 'green' }),
    smPr: P('밑변의 단위 r', 2, 4, 1, 3, { color: 'amber', hint: 'BC = r × (m + k)' }),
    smFm: P('AD의 단위 m', 1, 3, 1, 2, { color: 'sky' }),
    smFn: P('AC의 단위 n', 5, 7, 1, 5, { color: 'green' }),
    smFr: P('밑변의 단위 r', 2, 4, 1, 3, { color: 'amber' }),
    smOm: P('작은 삼각형의 크기 m', 1, 2, 1, 1, { color: 'sky' }),
    smOn: P('큰 삼각형의 크기 n', 3, 4, 1, 3, { color: 'green' }),
    smOrot: P('작은 삼각형의 회전 각도', 180, 240, 10, 210, { color: 'rose', format: (v) => v + '°' }),
    smOt: P('돌려서 포개기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 작은 삼각형이 점 A를 중심으로 제자리에서 돌아와 포개져요', format: (v) => (v >= 0.999 ? '포개짐' : Math.round(v * 100) + '%') }),
    smQm: P('작은 삼각형의 크기 m', 1, 3, 1, 2, { color: 'sky' }),
    smQn: P('큰 삼각형의 크기 n', 4, 6, 1, 4, { color: 'green' }),
    smSq: P('변 AC의 단위 q', 2, 5, 1, 4, { color: 'amber' }),
    smSa: P('끼인각 ∠A', 40, 100, 10, 60, { color: 'rose', format: (v) => v + '°' }),
    smMa: P('위 조각 AD', 1, 3, 1, 1, { color: 'sky', format: (v) => `${v} 칸` }),
    smMb: P('가운데 조각 DF', 1, 3, 1, 1, { color: 'amber', format: (v) => `${v} 칸` }),
    smMc: P('아래 조각 FB', 1, 3, 1, 1, { color: 'green', format: (v) => `${v} 칸` }),
    smMw: P('밑변의 단위 r', 2, 4, 1, 3, { color: 'rose' }),
    smXa: P('∠A의 크기', 30, 60, 10, 30, { color: 'rose', format: (v) => v + '°' }),
    smXc: P('AB의 길이', 6, 12, 1, 10, { color: 'sky', format: (v) => v + ' cm' }),
    smXb: P('BC의 길이', 2, 12, 1, 7, { color: 'amber', format: (v) => v + ' cm' }),
    smFt: P('접기', 0, 1, 0.01, 1, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 종이가 접는 선을 축으로 제자리에서 접혀요', format: (v) => (v >= 0.999 ? '접음' : v <= 0.001 ? '펼침' : Math.round(v * 100) + '%') }),
    smFj: P('종이의 크기 배율', 1, 2, 1, 1, { color: 'sky', format: (v) => `${v}배` }),
    smFs: P('정삼각형의 한 변', 8, 20, 2, 12, { color: 'sky', format: (v) => v + ' cm' }),
    smTa: P('윗변 AD의 단위 a', 1, 4, 1, 2, { color: 'sky' }),
    smTb: P('아랫변 BC의 단위 b', 1, 5, 1, 3, { color: 'green' }),
    smTc: P('넓이의 단위 c', 1, 3, 1, 1, { color: 'amber' })
  };

  const roman = (n) => (n === 0 ? 'x' : String(n));

  /* ====================================================================== 공용: DE 가 있는 삼각형 ABC 그리기
     lab = { AD, DB, AE, EC, DE, BC, AB(치수선), AC(치수선) } 각 글자(없으면 null), marks = { par, angs:[…] } */
  function drawNest(b, g, lab, o = {}) {
    const { A, B, C, D, E } = g, cen = centroid([A, B, C]), cl = centroid([D, B, C, E]), cs = centroid([A, D, E]);
    fillPoly(b, [A, D, E], 'sky', o.fillA == null ? 0.2 : o.fillA); fillPoly(b, [D, B, C, E], 'green', 0.07);
    poly(b, [A, B, C], 'ink', 3.6); line(b, D, E, o.deCol || 'green', 3.8);
    if (o.par) { par(b, D, E, 1, 'green', 0.5); par(b, B, C, 1, 'green', 0.5); }
    const sz = 16;
    if (lab.AD != null) sideTag(b, A, D, cen, lab.AD, { color: lab.cAD || 'sky', size: sz, gap: 10 });
    if (lab.DB != null) sideTag(b, D, B, cen, lab.DB, { color: lab.cDB || 'green', size: sz, gap: 10 });
    if (lab.AE != null) sideTag(b, A, E, cen, lab.AE, { color: lab.cAE || 'sky', size: sz, gap: 10 });
    if (lab.EC != null) sideTag(b, E, C, cen, lab.EC, { color: lab.cEC || 'green', size: sz, gap: 10 });
    if (lab.DE != null) sideTag(b, D, E, cl, lab.DE, { color: lab.cDE || 'sky', size: sz, gap: 9 });
    if (lab.BC != null) sideTag(b, B, C, cen, lab.BC, { color: lab.cBC || 'green', size: sz, gap: 11 });
    if (lab.AB != null) dim(b, A, B, cen, lab.AB, { color: 'ink', off: 34, size: sz });
    if (lab.AC != null) dim(b, A, C, cen, lab.AC, { color: 'ink', off: 34, size: sz });
    [[A, 'A', cen], [B, 'B', cen], [C, 'C', cen], [D, 'D', cen], [E, 'E', cen]].forEach(([p, nm, c]) => vtx(b, p, nm === 'D' || nm === 'E' ? cen : cen, nm, { size: 17, gap: nm === 'D' || nm === 'E' ? 12 : 11 }));
  }
  const nestBox = (g) => bboxOf([g.A, g.B, g.C]);
  const fitNest = (b, g, o = {}) => { const bb = nestBox(g); fit(b, bb, { t: o.t == null ? 48 : o.t, b: o.b == null ? 52 : o.b, l: o.l == null ? 64 : o.l, r: o.r == null ? 64 : o.r }); };

  /* ====================================================================== 1. 평행선과 닮음 (AA) */
  function parGeo(m, k, r) {
    const L = m + k, tri = triTop(r * L, 3 * L, 2 * L), A = tri.A, B = tri.B, C = tri.C;
    return { m, k, r, L, AB: 2 * L, AC: 3 * L, BC: r * L, AD: 2 * m, DB: 2 * k, AE: 3 * m, EC: 3 * k, DE: r * m, A, B, C, D: lerp(A, B, m / L), E: lerp(A, C, m / L) };
  }
  const nestPar = {
    id: 'sm3-par', title: '평행선과 닮음 (AA)', short: '평행선과 닮음',
    question: '삼각형 ABC에서 변 BC에 평행한 선분 DE를 그으면 작은 삼각형 ADE와 처음 삼각형 ABC는 닮은 도형이 될까? 변의 길이의 비는 어떻게 될까?',
    ctl: ['smPm', 'smPd', 'smPr'],
    init: (s) => { s.smPm = 2; s.smPd = 1; s.smPr = 3; },
    gen: (seed) => {
      const r = seeded('e1' + seed), m = ri(r, 1, 3), k = ri(r, 1, 3), rr = ri(r, 2, 4), kind = ri(r, 0, 3);
      return { seed, m, k, r: rr, kind };
    },
    model: (s) => { const m = clamp(Math.round(s.smPm), 1, 3), k = clamp(Math.round(s.smPd), 1, 3), r = clamp(Math.round(s.smPr), 2, 4); return { ...parGeo(m, k, r), g: gcd(m, m + k) }; },
    draw(b, s, M, C) {
      const prob = C.problem, g = prob ? parGeo(M.pk.m, M.pk.k, M.pk.r) : M, st = C.step;
      fitNest(b, g);
      let lab;
      if (prob) {
        const pk = M.pk, v = { AD: g.AD, DB: g.DB, AE: g.AE, EC: g.EC, DE: g.DE, BC: g.BC };
        const show = pk.kind === 0 ? { AD: 1, DB: 1, BC: 1, DE: 'x' } : pk.kind === 1 ? { AD: 1, DB: 1, DE: 1, BC: 'x' } : pk.kind === 2 ? { AD: 1, DB: 1, AE: 1, EC: 'x' } : { AD: 1, AB: 1, DE: 1, BC: 'x' };
        lab = {};
        Object.keys(show).forEach((kk) => { lab[kk] = show[kk] === 'x' ? 'x' : kk === 'AB' ? String(g.AB) : String(v[kk]); });
        if (show.AB) { lab.DB = null; }
        lab.cDE = show.DE === 'x' ? 'amber' : 'sky'; lab.cBC = show.BC === 'x' ? 'amber' : 'green'; lab.cEC = show.EC === 'x' ? 'amber' : 'green';
        drawNest(b, g, lab, { par: true });
        return;
      }
      const showV = !C.review || st >= 3;
      lab = { AD: String(g.AD), DB: String(g.DB), AE: String(g.AE), EC: String(g.EC), DE: String(g.DE), BC: String(g.BC) };
      drawNest(b, g, lab, { par: true });
      if (!C.review || st >= 1) { // 같은 각: ∠ADE=∠B (호 1개), ∠AED=∠C (호 2개), ∠A 공통
        ang(b, g.D, g.A, g.E, { color: 'rose', rings: 1, r: 22 }); ang(b, g.B, g.A, g.C, { color: 'rose', rings: 1, r: 26 });
        ang(b, g.E, g.A, g.D, { color: 'violet', rings: 2, r: 22 }); ang(b, g.C, g.A, g.B, { color: 'violet', rings: 2, r: 26 });
      }
      if (C.txt) {
        const cap = st >= 3 ? `AD : AB = DE : BC = ${g.m} : ${g.L}` : st >= 2 ? `△ADE ∽ △ABC  (닮음비 ${g.m} : ${g.L})` : st >= 1 ? '동위각이 같아요: ∠ADE=∠B, ∠AED=∠C' : '';
        if (cap) T(b, pt(g.B.x + (g.C.x - g.B.x) / 2, 0), cap, { dy: 56, size: capSize(b), color: 'amber' });
      }
    },
    steps: (M) => [
      'DE ∥ BC이므로 동위각이 같아요: $\\angle ADE=\\angle ABC$, $\\angle AED=\\angle ACB$. ∠A는 공통이에요. 따라서 $\\triangle ADE\\sim\\triangle ABC$ (AA 닮음)',
      `대응변의 길이의 비가 같아요. $\\overline{AD}:\\overline{AB}=\\overline{AE}:\\overline{AC}=\\overline{DE}:\\overline{BC}$ 이고 $\\overline{AB}=\\overline{AD}+\\overline{DB}=${M.AD}+${M.DB}=${M.AB}$`,
      `$${M.AD}:${M.AB}=\\overline{DE}:${M.BC}$ → $\\overline{DE}=${M.BC}\\times${frT(M.AD, M.AB).slice(1, -1)}=${M.DE}$`
    ],
    view: (M) => ({
      guide: '<b>m, k</b>로 점 D의 위치를, <b>r</b>로 모양을 바꿔 보세요. <b>DE ∥ BC</b>이면 늘 닮은 삼각형이 만들어져요.',
      readouts: [rd('닮음비 AD : AB', `${M.AD} : ${M.AB}`, 'sky', M.g > 1 ? `= ${M.m / M.g} : ${M.L / M.g}` : ''), rd('DE : BC', `${M.DE} : ${M.BC}`, 'green', `= ${M.m} : ${M.L}`), rd('[함정] AD : DB', `${M.AD} : ${M.DB}`, 'amber', 'DE : BC와 달라요')],
      formula: `<p>$\\overline{AD}:\\overline{AB}=\\overline{DE}:\\overline{BC}$ → $${M.AD}:${M.AB}=${M.DE}:${M.BC}$</p><p>$\\dfrac{\\overline{DE}}{\\overline{BC}}=\\dfrac{${M.AD}}{${M.AB}}=\\dfrac{${M.m}}{${M.L}}$</p>`,
      rule: 'DE ∥ BC이면 △ADE ∽ △ABC 이고 AD : AB = AE : AC = DE : BC',
      notes: notes('<b>[함정]</b> 밑변의 비 DE : BC는 AD : DB가 아니라 <b>AD : AB(전체)</b>와 같아요.', '평행선이 있으면 동위각이 같아서 AA 닮음이 돼요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = parGeo(pk.m, pk.k, pk.r);
      if (pk.kind === 0) return { tag: '평행선과 닮음: DE 구하기', key: `p0${pk.m}${pk.k}${pk.r}`, stem: 'DE ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.DE, [[g.BC * g.AD / g.DB, '[함정] AD : DB로 비례식을 세웠어요. 닮음비는 AD : AB예요.'], [g.AD, 'AD의 길이예요.'], [g.BC - g.DB, '길이를 뺐어요. 비로 구해야 해요.'], [g.BC * g.DB / g.AB, '대응하지 않는 변의 비를 썼어요.'], [g.DE + 1, '']], { pad: 1 }) };
      if (pk.kind === 1) return { tag: '평행선과 닮음: BC 구하기', key: `p1${pk.m}${pk.k}${pk.r}`, stem: 'DE ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.DE * g.DB / g.AD, '[함정] AD : DB로 비례식을 세웠어요. 닮음비는 AD : AB예요.'], [g.DE + g.DB, '길이를 더했어요. 비로 구해야 해요.'], [g.DE * g.AB / g.DB, '대응하지 않는 변의 비를 썼어요.'], [g.DE * 2, ''], [g.BC + 1, '']], { pad: 1 }) };
      if (pk.kind === 2) return { tag: '평행선과 선분의 비: EC 구하기', key: `p2${pk.m}${pk.k}${pk.r}`, stem: 'DE ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.EC, [[g.AE * g.AD / g.DB, 'AD : DB = AE : EC 에서 비례식의 위치가 뒤바뀌었어요.'], [g.AE + g.AD - g.DB, ''], [g.AE, 'AE의 길이예요.'], [g.AE * g.DB / g.AB, 'AB 전체가 아니라 DB로 비례식을 세워야 해요.'], [g.EC + 1, '']], { pad: 1 }) };
      return { tag: '평행선과 닮음: 전체 길이 이용', key: `p3${pk.m}${pk.k}${pk.r}`, stem: 'DE ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.DE * g.DB / g.AD, '[함정] AD : DB를 썼어요. 전체 AB와 비교해야 해요.'], [g.DE + g.AB - g.AD, ''], [g.AB, 'AB의 길이예요.'], [g.DE * g.AD / g.AB, '비례식의 위치가 뒤바뀌었어요.'], [g.BC + 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 2. 엇갈린 닮음 (∠ADE = ∠C) */
  function flipGeo(m, n, r) {
    const AB = 2 * n, AC = 3 * n, BC = r * n, tri = triTop(BC, AC, AB), A = tri.A, B = tri.B, C = tri.C, AD = 3 * m, AE = 2 * m;
    return { m, n, r, AB, AC, BC, AD, AE, DB: AB - AD, EC: AC - AE, DE: r * m, A, B, C, D: lerp(A, B, AD / AB), E: lerp(A, C, AE / AC) };
  }
  const nestFlip = {
    id: 'sm3-flip', title: '엇갈린 닮음 (∠ADE=∠C)', short: '엇갈린 닮음',
    question: '삼각형 ABC에서 ∠ADE=∠C가 되도록 선분 DE를 그으면 △ADE와 닮은 삼각형은 △ABC일까, △ACB일까? 대응 순서에 주의해 보자.',
    ctl: ['smFm', 'smFn', 'smFr'],
    init: (s) => { s.smFm = 2; s.smFn = 5; s.smFr = 3; },
    gen: (seed) => { const r = seeded('e2' + seed), m = ri(r, 1, 3), n = ri(r, 5, 7), rr = ri(r, 2, 4), kind = ri(r, 0, 1); return { seed, m, n, r: rr, kind }; },
    model: (s) => ({ ...flipGeo(clamp(Math.round(s.smFm), 1, 3), clamp(Math.round(s.smFn), 5, 7), clamp(Math.round(s.smFr), 2, 4)) }),
    draw(b, s, M, C) {
      const prob = C.problem, g = prob ? flipGeo(M.pk.m, M.pk.n, M.pk.r) : M, st = C.step;
      fitNest(b, g, { l: 70, r: 70 });
      const cen = centroid([g.A, g.B, g.C]);
      if (prob) {
        const k = M.pk.kind;
        drawNest(b, g, k === 0 ? { AD: String(g.AD), DB: String(g.DB), AE: String(g.AE), EC: 'x', cEC: 'amber' } : { AD: String(g.AD), AE: String(g.AE), DE: String(g.DE), AB: String(g.AB), BC: 'x', cBC: 'amber' }, { deCol: 'ink', fillA: 0.18 });
        ang(b, g.D, g.A, g.E, { color: 'rose', r: 22 }); ang(b, g.C, g.A, g.B, { color: 'rose', r: 24 });
        return;
      }
      drawNest(b, g, { AD: String(g.AD), DB: String(g.DB), AE: String(g.AE), EC: String(g.EC), DE: String(g.DE), BC: String(g.BC) }, { deCol: 'ink' });
      ang(b, g.D, g.A, g.E, { color: 'rose', r: 22 }); ang(b, g.C, g.A, g.B, { color: 'rose', r: 24 });
      if (!C.review || st >= 2) { ang(b, g.E, g.A, g.D, { color: 'violet', rings: 2, r: 22 }); ang(b, g.B, g.A, g.C, { color: 'violet', rings: 2, r: 24 }); }
      if (C.txt) {
        const cap = st >= 3 ? `AD : AC = AE : AB = DE : CB = ${g.m} : ${g.n}` : st >= 2 ? '△ADE ∽ △ACB (대응: D↔C, E↔B)' : st >= 1 ? '∠ADE = ∠C, ∠A는 공통 → AA 닮음' : '∠ADE = ∠C';
        T(b, pt(g.B.x + (g.C.x - g.B.x) / 2, 0), cap, { dy: 54, size: capSize(b), color: 'amber' });
      }
    },
    steps: (M) => [
      '∠A는 공통이고 $\\angle ADE=\\angle ACB$이므로 $\\triangle ADE\\sim\\triangle ACB$ (AA 닮음). 점 D는 점 C에, 점 E는 점 B에 대응해요.',
      `∠AED=∠ABC도 같아요. 대응변: $\\overline{AD}\\leftrightarrow\\overline{AC}$, $\\overline{AE}\\leftrightarrow\\overline{AB}$, $\\overline{DE}\\leftrightarrow\\overline{CB}$. 순서가 뒤집힌 닮음이에요.`,
      `$\\overline{AD}:\\overline{AC}=\\overline{AE}:\\overline{AB}=\\overline{DE}:\\overline{CB}$ → $${M.AD}:${M.AC}=${M.AE}:${M.AB}=${M.DE}:${M.BC}$ (닮음비 ${M.m} : ${M.n})`
    ],
    view: (M) => ({
      guide: '<b>m, n, r</b> 막대로 삼각형을 바꿔 보세요. ∠ADE와 ∠C가 같은 표시(●)예요. 같은 각의 표시가 <b>엇갈려</b> 있을 때는 △ADE ∽ △ACB예요.',
      readouts: [rd('AD : AC', `${M.AD} : ${M.AC}`, 'sky', `= ${M.m} : ${M.n}`), rd('AE : AB', `${M.AE} : ${M.AB}`, 'green', `= ${M.m} : ${M.n}`), rd('DE : CB', `${M.DE} : ${M.BC}`, 'amber', `= ${M.m} : ${M.n}`)],
      formula: `<p>$\\overline{AD}:\\overline{AC}=\\overline{AE}:\\overline{AB}$ → $${M.AD}:${M.AC}=${M.AE}:${M.AB}$</p><p>$\\overline{AD}\\times\\overline{AB}=\\overline{AE}\\times\\overline{AC}$ → $${M.AD}\\times${M.AB}=${M.AE}\\times${M.AC}=${M.AD * M.AB}$</p>`,
      rule: '∠ADE = ∠C이면 △ADE ∽ △ACB (AD : AC = AE : AB = DE : CB)',
      notes: notes('<b>[함정]</b> 평행 표시 없이 같은 각만 있으면 △ADE ∽ △ABC가 아니라 <b>△ADE ∽ △ACB</b>예요.', '비례식을 세울 때 AD와 <b>AC</b>, AE와 <b>AB</b>를 짝지어요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = flipGeo(pk.m, pk.n, pk.r);
      if (pk.kind === 0) return { tag: '엇갈린 닮음: 선분의 길이', key: `f0${pk.m}${pk.n}`, stem: '∠ADE=∠C일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.EC, [[g.AC, 'AC 전체의 길이예요. EC = AC − AE예요.'], [g.AE * g.AD / g.DB, '[함정] △ADE ∽ △ABC로 잘못 대응시켰어요.'], [g.AD * g.AB / g.AE - g.AD, ''], [g.AC - g.AD, ''], [g.EC + 1, '']], { pad: 1 }) };
      return { tag: '엇갈린 닮음: 변의 길이', key: `f1${pk.m}${pk.n}${pk.r}`, stem: '∠ADE=∠C일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.DE * g.AD / g.AE, '[함정] 대응변을 AD : AE로 세웠어요. DE : CB = AE : AB예요.'], [g.DE * g.AB / g.AD, '[함정] △ADE ∽ △ABC로 잘못 대응시켰어요.'], [g.DE + g.AB - g.AE, ''], [g.DE * 2, ''], [g.BC + 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 3. 꼭짓점을 공유한 닮음 (회전) */
  function rotGeo(m, n, rho, t) {
    const B = pt(3 * n, 0), Cc = pt(0, -4 * n), A = pt(0, 0), ang0 = rho * (1 - t), k = m / n;
    const D = rotP(pt(3 * m, 0), A, ang0), E = rotP(pt(0, -4 * m), A, ang0);
    return { m, n, A, B, C: Cc, D, E, AB: 3 * n, AC: 4 * n, BC: 5 * n, AD: 3 * m, AE: 4 * m, DE: 5 * m };
  }
  const rotS = {
    id: 'sm3-rot', title: '꼭짓점을 공유한 닮음', short: '회전한 닮음',
    question: '한 꼭짓점 A를 공유하고 돌아가 있는 두 삼각형도 닮은 도형일 수 있어. 작은 삼각형을 점 A를 중심으로 돌려서 포개면 대응변을 어떻게 찾을 수 있을까?',
    ctl: ['smOm', 'smOn', 'smOrot', 'smOt'], anim: { key: 'smOt', dur: 5, label: '돌려서 포개 보기', start: 0 },
    stepT: (n) => (n >= 2 ? 1 : 0),
    init: (s) => { s.smOm = 1; s.smOn = 3; s.smOrot = 210; s.smOt = 0; },
    gen: (seed) => { const r = seeded('e3' + seed), pr = rpick(r, [[1, 3], [2, 3], [1, 4], [2, 4]]), kind = ri(r, 0, 1); return { seed, m: pr[0], n: pr[1], kind }; },
    model: (s) => { const m = clamp(Math.round(s.smOm), 1, 2), n = clamp(Math.round(s.smOn), 3, 4); return { m, n, rho: s.smOrot, t: s.smOt || 0, ...rotGeo(m, n, s.smOrot, s.smOt || 0) }; },
    draw(b, s, M, C) {
      const prob = C.problem, st = C.step, pk = M.pk;
      const g = prob ? rotGeo(pk.m, pk.n, 210, C.solution && C.solStep >= 3 ? 1 : 0) : rotGeo(M.m, M.n, M.rho, C.t);
      const all = [g.A, g.B, g.C, g.D, g.E], bb0 = bboxOf(all);
      const full = prob ? rotGeo(pk.m, pk.n, 210, 0) : rotGeo(M.m, M.n, M.rho, 0);
      const bbU = unionBox(bboxOf([full.A, full.B, full.C, full.D, full.E]), bb0);
      fit(b, { x0: bbU.x0, x1: bbU.x1, y0: bbU.y0, y1: bbU.y1 }, { t: phone(b) ? 30 : 46, b: phone(b) ? 30 : 70, l: 52, r: 52 });
      const done = !prob && C.t >= 0.999;
      fillPoly(b, [g.A, g.B, g.C], 'green', 0.12); poly(b, [g.A, g.B, g.C], 'ink', 3.6);
      fillPoly(b, [g.A, g.D, g.E], 'sky', 0.22); poly(b, [g.A, g.D, g.E], done ? 'sky' : 'ink', 3.6);
      const cB = centroid([g.A, g.B, g.C]), cS = centroid([g.A, g.D, g.E]);
      // 표시: ∠BAC=∠DAE (직각), ∠ABC=∠ADE (호 1개), ∠ACB=∠AED(호 2개)
      ang(b, g.A, g.B, g.C, { color: 'rose', r: 20 }); ang(b, g.A, g.D, g.E, { color: 'rose', r: 14 });
      if (prob || !C.review || st >= 1) { ang(b, g.B, g.A, g.C, { color: 'rose', rings: 1, r: 24 }); ang(b, g.D, g.A, g.E, { color: 'rose', rings: 1, r: 18 }); }
      if (prob) { /* 문제: 두 각이 같다는 표시만 */ }
      else if (!C.review || st >= 2) { ang(b, g.C, g.A, g.B, { color: 'violet', rings: 2, r: 24 }); ang(b, g.E, g.A, g.D, { color: 'violet', rings: 2, r: 18 }); }
      const sz = 16;
      const lb = (p, q, c, txt, col) => sideTag(b, p, q, c, txt, { color: col, size: sz, gap: 10 });
      if (prob) {
        if (pk.kind === 0) { lb(g.A, g.B, cB, String(g.AB), 'green'); lb(g.A, g.C, cB, String(g.AC), 'green'); lb(g.A, g.D, cS, String(g.AD), 'sky'); lb(g.A, g.E, cS, 'x', 'amber'); }
        else { lb(g.A, g.B, cB, String(g.AB), 'green'); lb(g.A, g.D, cS, String(g.AD), 'sky'); lb(g.D, g.E, cS, String(g.DE), 'sky'); lb(g.B, g.C, cB, 'x', 'amber'); }
      } else {
        lb(g.A, g.B, cB, String(g.AB), 'green'); lb(g.A, g.C, cB, String(g.AC), 'green'); lb(g.B, g.C, cB, String(g.BC), 'green');
        lb(g.A, g.D, cS, String(g.AD), 'sky'); lb(g.A, g.E, cS, String(g.AE), 'sky'); lb(g.D, g.E, cS, String(g.DE), 'sky');
      }
      // A belongs to both triangles. Put its name in an empty angular sector,
      // outside both right angles, instead of inside the small rotated triangle.
      const rays = [g.B, g.C, g.D, g.E].map(p => (Math.atan2(p.y - g.A.y, p.x - g.A.x) + 2 * Math.PI) % (2 * Math.PI)).sort((a, c) => a - c);
      const inCorner = (u, p, q) => { const v = sub(p, g.A), w = sub(q, g.A), turn = v.x * w.y - v.y * w.x; return (v.x * u.y - v.y * u.x) * turn > 0 && (u.x * w.y - u.y * w.x) * turn > 0; };
      const empty = rays.map((a, i) => { const gap = (i + 1 < rays.length ? rays[i + 1] : rays[0] + 2 * Math.PI) - a, angle = a + gap / 2; return { gap, u: pt(Math.cos(angle), Math.sin(angle)) }; }).filter(x => !inCorner(x.u, g.B, g.C) && !inCorner(x.u, g.D, g.E)).sort((a, c) => c.gap - a.gap)[0];
      const au = empty.u, ak = b.k || 60;
      b.point(g.A, { color: 'ink', r: 4.5 });
      line(b, add(g.A, mul(au, 7 / ak)), add(g.A, mul(au, 23 / ak)), 'muted', 1.4);
      T(b, g.A, 'A', { dx: au.x * 35, dy: au.y * 35, size: 17 });
      [[g.B, 'B'], [g.C, 'C']].forEach(([p, nm]) => vtx(b, p, cB, nm, { size: 17, gap: 12 }));
      [[g.D, 'D'], [g.E, 'E']].forEach(([p, nm]) => vtx(b, p, cS, nm, { size: 17, gap: 12 }));
      // The correspondence is in the exploration card. Long canvas sentences
      // at this lower edge would run behind the landscape floating toolbar.
    },
    steps: (M) => [
      '∠BAC=∠DAE이고 ∠ABC=∠ADE이므로 $\\triangle ADE\\sim\\triangle ABC$ (AA 닮음)예요. 두 삼각형은 돌아가 있을 뿐 모양은 같아요.',
      '작은 삼각형을 점 A를 중심으로 돌려 포개면 D는 B에, E는 C에 겹쳐져요. 대응변: $\\overline{AD}\\leftrightarrow\\overline{AB}$, $\\overline{AE}\\leftrightarrow\\overline{AC}$, $\\overline{DE}\\leftrightarrow\\overline{BC}$',
      `$\\overline{AD}:\\overline{AB}=\\overline{AE}:\\overline{AC}=\\overline{DE}:\\overline{BC}$ → $${M.AD}:${M.AB}=${M.AE}:${M.AC}=${M.DE}:${M.BC}$ (닮음비 ${M.m} : ${M.n})`
    ],
    view: (M) => ({
      guide: '<b>m, n</b>으로 닮음비를, <b>회전 각도</b>로 작은 삼각형이 놓인 방향을 바꿔 보세요. ▶를 누르면 작은 삼각형이 점 A를 중심으로 <b>제자리에서 돌아</b> 큰 삼각형에 포개져요.<br>두 각의 크기가 같으므로 <b>AA 닮음</b>이에요. 대응변은 <b>AD↔AB, AE↔AC, DE↔BC</b>입니다.',
      readouts: [rd('AD : AB', `${M.AD} : ${M.AB}`, 'sky', `= ${M.m} : ${M.n}`), rd('AE : AC', `${M.AE} : ${M.AC}`, 'green', `= ${M.m} : ${M.n}`), rd('DE : BC', `${M.DE} : ${M.BC}`, 'amber', `= ${M.m} : ${M.n}`)],
      formula: `<p>$\\overline{AD}:\\overline{AB}=\\overline{DE}:\\overline{BC}$ → $${M.AD}:${M.AB}=${M.DE}:${M.BC}$</p>`,
      rule: '돌아가 있는 닮은 삼각형은 같은 각의 표시를 따라 돌려 포개면 대응변이 보인다',
      notes: notes('같은 꼭짓점 A를 공유해도 두 각이 <b>겹친 공통각</b>이 아니라 크기가 같은 <b>대응각</b>이에요.', '대응하는 순서가 달라지지 않게 같은 표시의 각끼리 짝지으세요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = rotGeo(pk.m, pk.n, 210, 0);
      if (pk.kind === 0) return { tag: '회전한 닮음: 선분의 길이', key: `r0${pk.m}${pk.n}`, stem: '△ABC와 △ADE에서 ∠BAC=∠DAE, ∠ABC=∠ADE일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.AE, [[g.AC * g.AB / g.AD, '대응변을 AD : AB가 아니라 AB : AD로 거꾸로 세웠어요.'], [g.AD, 'AD의 길이예요.'], [g.AC - g.AB + g.AD, ''], [g.AC, 'AC의 길이예요.'], [g.AE + 1, '']], { pad: 1 }) };
      return { tag: '회전한 닮음: 변의 길이', key: `r1${pk.m}${pk.n}`, stem: '△ABC와 △ADE에서 ∠BAC=∠DAE, ∠ABC=∠ADE일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.DE * g.AD / g.AB, '비례식의 위치가 뒤바뀌었어요.'], [g.DE + g.AB - g.AD, ''], [g.AB, 'AB의 길이예요.'], [g.DE * 2, ''], [g.BC + 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 4. 공통 끼인각 (SAS) */
  function sasGeo(m, n, q, a) {
    const AB = 3 * n, AC = q * n, AD = 3 * m, AE = q * m, A = pt(0, 0), B = pt(AB, 0), C = polar(A, AC, -a), D = pt(AD, 0), E = polar(A, AE, -a);
    return { m, n, q, a, AB, AC, AD, AE, DB: AB - AD, EC: AC - AE, A, B, C, D, E };
  }
  const sasS = {
    id: 'sm3-sas', title: '공통 끼인각 (SAS)', short: 'SAS 닮음',
    question: '평행선 표시가 없어도 ∠A를 낀 두 변의 길이의 비가 같으면 두 삼각형은 닮은 도형일까?',
    ctl: ['smQm', 'smQn', 'smSq', 'smSa'],
    init: (s) => { s.smQm = 2; s.smQn = 4; s.smSq = 4; s.smSa = 60; },
    gen: (seed) => { const r = seeded('e4' + seed), n = ri(r, 4, 6), m = ri(r, 1, 3), q = ri(r, 2, 5), a = rpick(r, [50, 60, 70, 80]), kind = ri(r, 0, 1); return { seed, m, n, q, a, kind }; },
    model: (s) => { const m = clamp(Math.round(s.smQm), 1, 3), n = clamp(Math.round(s.smQn), 4, 6), q = clamp(Math.round(s.smSq), 2, 5), a = clamp(Math.round(s.smSa), 40, 100); return { ...sasGeo(m, n, q, a), g: gcd(m, n) }; },
    draw(b, s, M, C) {
      const prob = C.problem, g = prob ? sasGeo(M.pk.m, M.pk.n, M.pk.q, M.pk.a) : M, st = C.step, pk = M.pk;
      const bb = bboxOf([g.A, g.B, g.C]);
      fit(b, bb, { t: 46, b: 66, l: 52, r: 52 });
      const cen = centroid([g.A, g.B, g.C]);
      fillPoly(b, [g.A, g.D, g.E], 'sky', 0.22); fillPoly(b, [g.D, g.B, g.C, g.E], 'green', 0.07);
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.D, g.E, 'ink', 3.4);
      const includedRadius = Math.min(28, Math.min(g.AD, g.AE) * (b.k || 60) * .4);
      ang(b, g.A, g.B, g.C, { color: 'rose', r: includedRadius, label: prob ? undefined : `${g.a}°`, size: 15 });
      const lb = (p, q, c, t, col) => sideTag(b, p, q, c, t, { color: col, size: 16, gap: 10 });
      const cl = centroid([g.D, g.B, g.C, g.E]);
      if (prob) {
        if (pk.kind === 0) { lb(g.A, g.D, cen, String(g.AD), 'sky'); lb(g.D, g.B, cen, String(g.DB), 'green'); lb(g.A, g.E, cen, String(g.AE), 'sky'); lb(g.E, g.C, cen, String(g.EC), 'green'); }
        else { lb(g.A, g.D, cen, String(g.AD), 'sky'); lb(g.D, g.B, cen, String(g.DB), 'green'); lb(g.A, g.E, cen, String(g.AE), 'sky'); lb(g.E, g.C, cen, 'x', 'amber'); }
      } else {
        lb(g.A, g.D, cen, String(g.AD), 'sky'); lb(g.D, g.B, cen, String(g.DB), 'green'); lb(g.A, g.E, cen, String(g.AE), 'sky'); lb(g.E, g.C, cen, String(g.EC), 'green');
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      if (C.txt && !prob) {
        const cap = st >= 3 ? 'DE : BC = ' + g.m + ' : ' + g.n + ' (SAS 닮음이면 나머지 변도 같은 비)' : st >= 2 ? `AD : AB = AE : AC = ${g.m} : ${g.n}` : st >= 1 ? '두 변의 비를 구해요' : `끼인각 ∠A = ${g.a}°`;
        T(b, pt((bb.x0 + bb.x1) / 2, bb.y1), cap, { dy: 56, size: capSize(b), color: 'amber' });
      }
    },
    steps: (M) => [
      `두 삼각형 ABC, ADE는 ∠A(${M.a}°)를 공통으로 가지고 있어요. 평행선이 없어도 이 각이 두 변 사이에 끼어 있는지 확인해요.`,
      `끼인각 ∠A 양옆의 두 변의 길이의 비를 구해요. $\\overline{AD}:\\overline{AB}=${M.AD}:${M.AB}=${M.m}:${M.n}$, $\\overline{AE}:\\overline{AC}=${M.AE}:${M.AC}=${M.m}:${M.n}$ → 두 비가 같아요.`,
      `두 변의 길이의 비가 같고 그 끼인각이 같으므로 $\\triangle ADE\\sim\\triangle ABC$ (SAS 닮음)예요. 따라서 $\\overline{DE}:\\overline{BC}=${M.m}:${M.n}$이에요.`
    ],
    view: (M) => ({
      guide: '<b>m, n, q</b>로 두 변의 길이를, <b>끼인각</b> 막대로 ∠A를 바꿔 보세요. 평행선이 없어도 <b>두 변의 비가 같고 끼인각이 같으면</b> 닮음이에요.',
      readouts: [rd('AD : AB', `${M.AD} : ${M.AB}`, 'sky', `= ${M.m} : ${M.n}`), rd('AE : AC', `${M.AE} : ${M.AC}`, 'green', `= ${M.m} : ${M.n}`), rd('끼인각 ∠A', `${M.a}°`, 'rose', '공통')],
      formula: `<p>$\\dfrac{\\overline{AD}}{\\overline{AB}}=\\dfrac{${M.AD}}{${M.AB}}=\\dfrac{${M.m}}{${M.n}},\\ \\dfrac{\\overline{AE}}{\\overline{AC}}=\\dfrac{${M.AE}}{${M.AC}}=\\dfrac{${M.m}}{${M.n}}$</p>`,
      rule: '두 쌍의 대응변의 길이의 비가 같고 그 끼인각의 크기가 같으면 닮음 (SAS 닮음)',
      notes: notes('각이 두 변의 <b>사이(끼인각)</b>에 있어야 해요. 다른 각이면 SAS 닮음이 아니에요.', '두 변의 짝이 뒤바뀌어 AD : AC = AE : AB이면 △ADE ∽ △ACB (뒤집힌 닮음)이에요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = sasGeo(pk.m, pk.n, pk.q, pk.a);
      if (pk.kind === 0) {
        const items = [{ h: 'SAS 닮음', ok: true }, { h: 'SSS 닮음', hint: '세 변의 길이의 비는 알 수 없어요. 두 변과 끼인각이 주어졌어요.' }, { h: 'AA 닮음', hint: '두 각이 주어지지 않았어요. 각은 하나(∠A)만 주어졌어요.' }, { h: 'SAS 합동', hint: '합동이 아니라 닮음이에요. 두 삼각형의 크기가 달라요.' }, { h: 'ASA 합동', hint: '합동이 아니라 닮음이에요.' }];
        return { tag: '닮음 조건 찾기', key: `s0${pk.m}${pk.n}${pk.q}${pk.a}`, stem: '그림의 △ADE와 △ABC가 닮은 도형임을 보이려고 한다. 이때 이용한 닮음 조건은?', choices: mkTextChoices(items, `s${pk.seed}`), wide: false };
      }
      return { tag: 'SAS 닮음으로 길이 구하기', key: `s1${pk.m}${pk.n}${pk.q}${pk.a}`, stem: '△ADE ∽ △ABC (SAS 닮음)일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.EC, [[g.AC, 'AC 전체의 길이예요. EC = AC − AE예요.'], [g.AE * g.DB / g.AD, '[함정] AD : DB와 AE : EC가 같다고 보려면 평행선이 있어야 해요. 여기서는 AD : AB로 닮음비를 구해요.'], [g.AE + g.AD, ''], [g.AC - g.AD, ''], [g.EC + 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 5. 평행선 2개와 닮은 삼각형 3개 */
  function multiGeo(a, bb, c, r) {
    const L = a + bb + c, tri = triTop(r * L, 3 * L, 2 * L), A = tri.A, B = tri.B, C = tri.C, f1 = a / L, f2 = (a + bb) / L;
    return { a, bb, c, r, L, A, B, C, D: lerp(A, B, f1), E: lerp(A, C, f1), F: lerp(A, B, f2), Gp: lerp(A, C, f2), AD: 2 * a, DF: 2 * bb, FB: 2 * c, DE: r * a, FG: r * (a + bb), BC: r * L };
  }
  const multiS = {
    id: 'sm3-multi', title: '평행선 2개와 닮은 삼각형 3개', short: '닮은 삼각형 3개',
    question: '변 AB 위에 점 D, F를 잡고 BC에 평행한 선분을 두 개 그으면 닮은 삼각형이 3개 생겨. 세 삼각형의 닮음비는 얼마일까?',
    ctl: ['smMa', 'smMb', 'smMc', 'smMw'],
    init: (s) => { s.smMa = 1; s.smMb = 1; s.smMc = 1; s.smMw = 3; },
    gen: (seed) => { const r = seeded('e5' + seed), a = ri(r, 1, 3), bb = ri(r, 1, 3), c = ri(r, 1, 3), rr = ri(r, 2, 4), kind = ri(r, 0, 2); return { seed, a, bb, c, r: rr, kind }; },
    model: (s) => { const a = clamp(Math.round(s.smMa), 1, 3), bb = clamp(Math.round(s.smMb), 1, 3), c = clamp(Math.round(s.smMc), 1, 3), r = clamp(Math.round(s.smMw), 2, 4); return multiGeo(a, bb, c, r); },
    draw(b, s, M, C) {
      const prob = C.problem, g = prob ? multiGeo(M.pk.a, M.pk.bb, M.pk.c, M.pk.r) : M, st = C.step, pk = M.pk;
      const bb0 = bboxOf([g.A, g.B, g.C]);
      fit(b, bb0, { t: 46, b: 66, l: 60, r: 60 });
      const cen = centroid([g.A, g.B, g.C]);
      fillPoly(b, [g.A, g.D, g.E], 'sky', 0.26); fillPoly(b, [g.D, g.F, g.Gp, g.E], 'amber', 0.16); fillPoly(b, [g.F, g.B, g.C, g.Gp], 'green', 0.12);
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.D, g.E, 'green', 3.6); line(b, g.F, g.Gp, 'green', 3.6);
      par(b, g.D, g.E, 1, 'green'); par(b, g.F, g.Gp, 1, 'green'); par(b, g.B, g.C, 1, 'green');
      const lb = (p, q, c, t, col, gap) => sideTag(b, p, q, c, t, { color: col, size: 16, gap: gap || 10 });
      const cin = (p, q) => centroid([g.A, p, q]);
      if (prob) {
        const k = pk.kind;
        lb(g.A, g.D, cen, String(g.AD), 'sky'); lb(g.D, g.F, cen, String(g.DF), 'amber'); lb(g.F, g.B, cen, String(g.FB), 'green');
        lb(g.B, g.C, cen, k === 2 ? 'x' : String(g.BC), k === 2 ? 'amber' : 'green', 11);
        lb(g.D, g.E, centroid([g.D, g.B, g.C, g.E]), k === 0 ? 'x' : (k === 1 ? String(g.DE) : String(g.DE)), k === 0 ? 'amber' : 'sky', 9);
        if (k === 1) lb(g.F, g.Gp, centroid([g.F, g.B, g.C, g.Gp]), 'x', 'amber', 9);
        if (k === 0 || k === 2) { /* BC 또는 FG 가 주어짐: kind0 은 BC 가 주어지고 DE 를 구함, kind2 는 DE 가 주어지고 BC 를 구함 */ }
      } else {
        lb(g.A, g.D, cen, String(g.AD), 'sky'); lb(g.D, g.F, cen, String(g.DF), 'amber'); lb(g.F, g.B, cen, String(g.FB), 'green');
        lb(g.D, g.E, centroid([g.D, g.B, g.C, g.E]), String(g.DE), 'sky', 9); lb(g.F, g.Gp, centroid([g.F, g.B, g.C, g.Gp]), String(g.FG), 'amber', 9); lb(g.B, g.C, cen, String(g.BC), 'green', 11);
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E'], [g.F, 'F'], [g.Gp, 'G']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 16, gap: 12 }));
      if (C.txt && !prob) {
        const l1 = g.a, l2 = g.a + g.bb, l3 = g.L;
        const cap = st >= 3 ? `DE : FG : BC = ${l1 * g.r} : ${l2 * g.r} : ${l3 * g.r}` : st >= 2 ? `닮음비 AD : AF : AB = ${l1} : ${l2} : ${l3}` : st >= 1 ? '△ADE ∽ △AFG ∽ △ABC' : '';
        if (cap) T(b, pt((bb0.x0 + bb0.x1) / 2, 0), cap, { dy: 56, size: capSize(b), color: 'amber' });
      }
    },
    steps: (M) => [
      'DE ∥ FG ∥ BC이므로 동위각이 같아서 $\\triangle ADE\\sim\\triangle AFG\\sim\\triangle ABC$예요.',
      `닮음비는 점 A에서부터 <b>누적해서</b> 센 길이의 비예요. $\\overline{AD}:\\overline{AF}:\\overline{AB}=${M.a}:${M.a + M.bb}:${M.L}$ (조각의 비 ${M.a}:${M.bb}:${M.c}가 아니에요)`,
      `밑변도 같은 비예요. $\\overline{DE}:\\overline{FG}:\\overline{BC}=${M.a}:${M.a + M.bb}:${M.L}$ → $${M.DE}:${M.FG}:${M.BC}$`
    ],
    view: (M) => ({
      guide: '<b>세 막대</b>로 AB 위의 세 조각 길이를 바꿔 보세요. 세 삼각형의 닮음비는 조각의 비가 아니라 <b>A에서부터 센 누적 길이</b>의 비예요.',
      readouts: [rd('조각의 비 AD : DF : FB', `${M.a} : ${M.bb} : ${M.c}`, 'amber'), rd('닮음비 AD : AF : AB', `${M.a} : ${M.a + M.bb} : ${M.L}`, 'sky'), rd('DE : FG : BC', `${M.DE} : ${M.FG} : ${M.BC}`, 'green', '', null, true)],
      formula: `<p>$\\overline{DE}:\\overline{FG}:\\overline{BC}=${M.a}:${M.a + M.bb}:${M.L}$</p>`,
      rule: '평행선이 여러 개이면 닮음비는 꼭짓점 A에서부터 센 길이의 비 (누적)',
      notes: notes('<b>[함정]</b> AD : DF : FB = 1 : 1 : 1 이라도 닮음비는 1 : 1 : 1이 아니라 <b>1 : 2 : 3</b>이에요.', '밑변 DE, FG, BC의 비도 누적 비와 같아요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = multiGeo(pk.a, pk.bb, pk.c, pk.r);
      if (pk.kind === 0) return { tag: '닮은 삼각형 3개: DE 구하기', key: `m0${pk.a}${pk.bb}${pk.c}${pk.r}`, stem: 'DE ∥ FG ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.DE, [[g.BC * g.AD / (g.DF + g.FB), '[함정] AD : (DF+FB)로 비를 세웠어요. 닮음비는 AD : AB예요.'], [g.BC * g.AD / g.DF, 'AD : DF는 닮음비가 아니에요.'], [g.BC - g.FB - g.DF, ''], [g.BC / g.L, '']], { pad: 1 }) };
      if (pk.kind === 1) return { tag: '닮은 삼각형 3개: FG 구하기', key: `m1${pk.a}${pk.bb}${pk.c}${pk.r}`, stem: 'DE ∥ FG ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.FG, [[g.DE + g.DF, '길이를 더했어요. 비로 구해야 해요.'], [g.DE * g.DF / g.AD, 'AD : DF로 비를 세웠어요. 닮음비는 AD : AF예요.'], [g.DE * (g.DF + g.AD) / g.AD - g.DE, ''], [g.DE * 2, '']], { pad: 1 }) };
      return { tag: '닮은 삼각형 3개: BC 구하기', key: `m2${pk.a}${pk.bb}${pk.c}${pk.r}`, stem: 'DE ∥ FG ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.DE * (g.AD + g.DF + g.FB) / (g.DF + g.FB), '[함정] AD : (DF+FB)를 썼어요.'], [g.DE * g.L, '조각의 수가 아니라 AD : AB의 비로 구해야 해요.'], [g.DE + g.DF + g.FB, '길이를 더했어요.'], [g.DE * g.FB / g.AD, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 6. [함정] SSA 반례 */
  const sinT = { 30: 0.5, 40: Math.sin(40 * DEG), 50: Math.sin(50 * DEG), 60: Math.sin(60 * DEG) };
  function ssaGeo(a, c, aDeg) {
    const A = pt(0, 0), B = pt(c, 0), u = pt(Math.cos(aDeg * DEG), -Math.sin(aDeg * DEG)), pr = c * Math.cos(aDeg * DEG), hh = c * Math.sin(aDeg * DEG), d2 = a * a - hh * hh;
    const hs = Math.sin(aDeg * DEG) * c, cnt = a < hs - 1e-9 ? 0 : Math.abs(a - hs) < 1e-9 ? 1 : a < c ? 2 : 1;
    let C1 = null, C2 = null;
    if (d2 >= 0) { const s = Math.sqrt(d2); C1 = add(A, mul(u, pr - s)); C2 = add(A, mul(u, pr + s)); if (cnt === 1 && a >= c) C1 = null; if (cnt === 1 && Math.abs(a - hs) < 1e-9) { C1 = add(A, mul(u, pr)); C2 = null; } }
    return { a, c, aDeg, A, B, u, C1, C2, cnt, hs };
  }
  const ssaS = {
    id: 'sm3-ssa', title: '[함정] SSA 반례', short: '[함정] SSA 반례',
    question: '두 변의 길이와 그 끼인각이 아닌 각이 주어지면(SSA) 삼각형이 하나로 정해질까? 컴퍼스로 호를 그려 점 C가 어디에 놓이는지 보자.',
    ctl: ['smXa', 'smXc', 'smXb'],
    init: (s) => { s.smXa = 30; s.smXc = 10; s.smXb = 7; },
    gen: (seed) => {
      const r = seeded('e6' + seed), kind = ri(r, 0, 1);
      if (kind === 0) { const c = ri(r, 6, 12); const lo = Math.floor(c / 2) + 1; let a = rpick(r, [ri(r, 2, Math.floor(c / 2) - 1), ri(r, lo, c - 1), ri(r, lo, c - 1), c + ri(r, 1, 2)]); if (c % 2 === 0 && a === c / 2) a = c / 2 + 1; return { seed, kind, c, a, aDeg: 30 }; }
      return { seed, kind, c: ri(r, 6, 13), aDeg: 30 };
    },
    model: (s) => { const aDeg = clamp(Math.round(s.smXa), 30, 60), c = clamp(Math.round(s.smXc), 6, 12), a = clamp(Math.round(s.smXb), 2, 12); return { ...ssaGeo(a, c, aDeg) }; },
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step;
      const g = prob ? (pk.kind === 0 ? ssaGeo(pk.a, pk.c, pk.aDeg) : ssaGeo(pk.c * 0.75, pk.c, pk.aDeg)) : M;
      const R = Math.max(g.a, g.c) * 1.05, ray = polar(g.A, Math.max(g.c * 1.1, (g.C2 ? dist(g.A, g.C2) : 0) + 1, 3), -g.aDeg);
      const bx = bboxOf([g.A, g.B, ray].concat(g.C1 ? [g.C1] : []).concat(g.C2 ? [g.C2] : []).concat(prob ? [] : [polar(g.B, g.a, -80)]), 0);
      const bbU = { x0: Math.min(bx.x0, g.B.x - g.a) - 0.2, x1: Math.max(bx.x1, g.B.x + g.a * 0.3) + 0.2, y0: Math.min(bx.y0, -g.a * 0.9), y1: 1 };
      const fb = { x0: -0.4, x1: Math.max(g.c + 0.4, ray.x + 0.3), y0: Math.min(ray.y, -g.a) - 0.3, y1: 0.4 };
      fit(b, fb, { t: 40, b: 60, l: 52, r: 44 });
      // 컴퍼스 호는 그림 상자 안쪽 부분만 그린다(화면 밖으로 잘리지 않게)
      const arcIn = (Cn, Rr, a0, a1, o) => { let run = []; const flush = () => { if (run.length > 1) b.path(run, o); run = []; }; for (let d = a0; d <= a1; d += 1.5) { const q = polar(Cn, Rr, d); const ok = q.x >= fb.x0 && q.x <= fb.x1 && q.y >= fb.y0 && q.y <= fb.y1; if (ok) run.push(q); else flush(); } flush(); };
      line(b, g.A, ray, 'ink', 2.6, { dash: [7, 6], alpha: 0.7 });
      line(b, g.A, g.B, 'ink', 3.6);
      ang(b, g.A, g.B, ray, { color: 'rose', r: 28, label: `${g.aDeg}°`, size: 15 });
      // 컴퍼스 호: B 를 중심으로 반지름 a. 반직선과 만나는 점(C, C′)이 모두 들어오도록 각 범위를 잡는다.
      const crossAng = [g.C1, g.C2].filter(Boolean).map((q) => Math.atan2(q.y - g.B.y, q.x - g.B.x) / DEG);
      const arcLo = crossAng.length ? Math.min(...crossAng) - 28 : -140, arcHi = crossAng.length ? Math.max(...crossAng) + 28 : -20;
      if (!prob || pk.kind === 0) arcIn(g.B, g.a, arcLo, arcHi, { color: 'amber', width: 2.4, dash: [6, 5] });
      const cA = [g.C1, g.C2].filter(Boolean);
      const col = ['amber', 'green'];
      const showT = !prob || (C.solution && C.solStep >= 3 && pk.kind === 0);
      if (showT) [g.C1, g.C2].forEach((Cp, i) => { if (Cp) { fillPoly(b, [g.A, g.B, Cp], col[i], 0.15); line(b, g.B, Cp, col[i], 3.6); line(b, g.A, Cp, col[i], 3.6); b.point(Cp, { color: col[i], r: 5.6 }); T(b, Cp, i === 0 || cA.length === 1 ? 'C' : 'C′', { dy: -16, dx: i === 0 ? -6 : 6, size: 17, color: col[i] }); } });
      if (prob && pk.kind === 0) { const Cp = g.C2 || g.C1; if (Cp && g.cnt >= 1) { /* 문제에서는 점 C 의 위치를 그리지 않음(몇 개인지가 질문) */ } }
      /* kind 1(BC 가 정수인 경우의 개수)은 점 C 의 위치를 그리지 않는다: 반직선 AX 와 AB, ∠A 만 주어진다 */
      vtx(b, g.A, pt(g.c / 2, -1), 'A', { size: 17, gap: 12 }); vtx(b, g.B, pt(g.c / 2, -1), 'B', { size: 17, gap: 12 });
      T(b, lerp(g.A, g.B, 0.5), String(g.c), { dy: 20, size: 16, color: 'sky' });
      if (!prob || pk.kind === 0) { const q1 = polar(g.B, g.a, -112); line(b, g.B, q1, 'amber', 2.4, { dash: [3, 4] }); b.point(q1, { color: 'amber', r: 3.4 }); T(b, lerp(g.B, q1, 0.55), String(g.a), { dx: -14, size: 16, color: 'amber' }); }
      if (C.txt && !prob) {
        const msg = g.cnt === 2 ? '삼각형이 2개 그려져요 (SSA는 닮음·합동 조건이 아니에요)' : g.cnt === 1 && Math.abs(g.a - g.hs) < 1e-9 ? '호가 접해요 → 삼각형 1개 (직각삼각형)' : g.cnt === 1 ? '삼각형이 1개만 그려져요' : '호가 닿지 않아요 → 삼각형이 만들어지지 않아요';
        T(b, pt(g.c / 2, 0), msg, { dy: 44, size: phone(b) ? 13 : 16, color: g.cnt === 2 ? 'rose' : 'green' });
      }
    },
    steps: (M) => [
      `∠A=${M.aDeg}°와 $\\overline{AB}=${M.c}$를 그리고, 점 B를 중심으로 반지름 ${M.a}인 호를 그려요. 점 C는 이 호와 반직선 AX가 만나는 곳이에요.`,
      M.cnt === 2 ? '호가 반직선과 두 점에서 만나서 점 C가 2곳(C, C′)에 놓일 수 있어요. 두 삼각형이 모두 조건을 만족해요.' : M.cnt === 1 ? '호가 반직선과 한 점에서만 만나서 삼각형이 1개만 정해져요.' : '호가 반직선에 닿지 못해서 삼각형이 만들어지지 않아요.',
      '그러므로 두 변의 길이와 끼인각이 아닌 한 각(SSA)이 주어진 경우는 삼각형이 하나로 정해지지 않을 수 있어요. SSA는 닮음(합동) 조건이 아니에요.'
    ],
    view: (M) => ({
      guide: '<b>각, AB, BC</b> 막대를 움직여 보세요. 점 B에서 그린 호가 반직선과 <b>두 번 만나면</b> 같은 조건(SSA)인데도 서로 다른 삼각형이 2개 그려져요.',
      readouts: [rd('주어진 조건', `∠A=${M.aDeg}°, AB=${M.c}, BC=${M.a}`, 'sky', '', null, true), rd('삼각형의 개수', `${M.cnt}개`, M.cnt === 2 ? 'rose' : 'green', M.cnt === 2 ? '[함정] 둘 다 조건을 만족해요' : '')],
      formula: `<p>호의 반지름 BC=${M.a}, 점 B에서 반직선까지의 거리 ${fmtN(M.hs)}, AB=${M.c}</p><p>${fmtN(M.hs)} &lt; ${M.a} &lt; ${M.c} 일 때 삼각형이 2개예요.</p>`.replace('&lt;', '<').replace('&lt;', '<').replace(/\$/g, '$'),
      rule: 'SSA(두 변과 끼인각이 아닌 각)는 삼각형이 하나로 정해지지 않아 닮음·합동 조건이 아니다',
      notes: notes('<b>[함정]</b> 두 변과 <b>끼인각</b>일 때만 SAS예요. 끼인각이 아닌 각이면 안 돼요.', '호가 반직선에 딱 접하면 삼각형이 1개(직각삼각형)예요.')
    }),
    prob: (M) => {
      const pk = M.pk;
      if (pk.kind === 0) {
        const g = ssaGeo(pk.a, pk.c, pk.aDeg), items = [0, 1, 2, 3, 4].map((v) => ({ h: v === 4 ? '무수히 많다' : `${v}개`, ok: v === g.cnt, hint: g.cnt === 2 ? '호가 반직선과 두 점에서 만나요. 2개예요.' : g.cnt === 1 ? '호가 반직선과 한 점에서 만나요. 1개예요.' : '호가 반직선에 닿지 않아요. 0개예요.' }));
        return { tag: '[함정] SSA: 삼각형의 개수', key: `q0${pk.c}${pk.a}`, stem: `∠A=${pk.aDeg}°, $\\overline{AB}=${pk.c}$ cm, $\\overline{BC}=${pk.a}$ cm인 △ABC는 몇 개 그릴 수 있는가?`, choices: items.map((it) => ({ h: it.h, p: it.h, ok: it.ok, hint: it.hint })), note: '호의 반지름과 B에서 반직선까지의 거리를 비교해요' };
      }
      const ans = pk.c - 1 - Math.floor(pk.c / 2), c = pk.c;
      return { tag: '[함정] SSA: 삼각형이 2개 생기는 BC', key: `q1${pk.c}`, stem: `∠A=30°, $\\overline{AB}=${c}$ cm인 △ABC에서 BC의 길이가 정수일 때, △ABC가 두 가지로 그려지는 BC의 값은 모두 몇 개인가?`, choices: mkChoices(ans, [[ans + 1, '호가 직선에 접하는 경우(또는 AB와 같은 경우)를 포함했어요.'], [ans - 1, '경계 값 하나를 빼먹었어요.'], [c - 1, '반직선까지의 거리보다 큰 값만 세요.'], [Math.floor(c / 2), '']], { pad: 1, valid: (v) => v >= 0 }), note: 'AB × (삼각형의 높이의 비) 보다 크고 AB보다 작아야 해요' };
    }
  };

  /* ====================================================================== 7. 직사각형 종이접기 */
  const FOLD_R = { a: { W: 8, H: 10, f: 6, CE: 3, DE: 5 }, b: { W: 9, H: 15, f: 12, CE: 4, DE: 5 } };
  function foldGeo(typ, j, t) {
    const F0 = FOLD_R[typ], W = F0.W * j, H = F0.H * j, f = F0.f * j, e = F0.CE * j, dE = F0.DE * j;
    const A = pt(0, 0), Bp = pt(W, 0), Cp = pt(W, -H), Dp = pt(0, -H), F = pt(W, -f), E = pt(W - e, -H);
    // 접히는 점 D: 접는 선 AE 에 대한 반사까지 t 만큼. D(t)=foot + (D-foot) cos(πt)
    const u = unit(sub(E, A)), foot = add(A, mul(u, (Dp.x - A.x) * u.x + (Dp.y - A.y) * u.y)), perp = sub(Dp, foot);
    const cs = Math.cos(Math.PI * t), Dt = add(foot, mul(perp, cs));
    return { typ, j, W, H, f, e, dE, AB: W, BF: f, FC: H - f, CE: e, DE: dE, A, B: Bp, C: Cp, D: Dp, F, E, Dt, t };
  }
  const foldRect = {
    id: 'sm3-foldrect', title: '직사각형 종이접기', short: '직사각형 접기',
    question: '직사각형 모양의 종이를 접어서 꼭짓점 D가 변 BC 위의 점 F에 오게 했어. 접힌 부분에서 닮은 삼각형을 찾아 길이를 구해 보자.',
    ctl: ['smFt', 'smFj'], anim: { key: 'smFt', dur: 4, label: '종이 접어 보기', start: 1 },
    stepT: (n) => (n === 0 ? 0 : 1),
    presets: () => [['a', '8 × 10 종이'], ['b', '9 × 15 종이']].map(([id, label], i) => ({ group: i === 0 ? '종이의 모양' : '', label, apply: (s) => { s.smFtype = id; }, on: (s) => (s.smFtype || 'a') === id })),
    init: (s) => { s.smFt = 1; s.smFj = 1; s.smFtype = 'a'; },
    gen: (seed) => { const r = seeded('e7' + seed), typ = rpick(r, ['a', 'b']), j = ri(r, 1, 2), kind = ri(r, 0, 1); return { seed, typ, j, kind }; },
    model: (s) => ({ ...foldGeo(s.smFtype || 'a', clamp(Math.round(s.smFj), 1, 2), s.smFt == null ? 1 : s.smFt) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step;
      const g = prob ? foldGeo(pk.typ, pk.j, 1) : foldGeo(M.typ, M.j, C.review ? 1 : C.t);
      fit(b, { x0: -0.2, x1: g.W + 0.2, y0: -g.H - 0.2, y1: 0.3 }, { t: 40, b: 60, l: 40, r: 46 });
      const R = [g.A, g.B, g.C, g.D], cen = centroid(R);
      fillPoly(b, R, 'sky', 0.1); poly(b, R, 'ink', 3.4);
      // 접는 선 AE
      line(b, g.A, g.E, 'rose', 3.2, { dash: [8, 6] });
      // 접힌 조각 A-D(t)-E
      fillPoly(b, [g.A, g.Dt, g.E], 'green', 0.24); poly(b, [g.A, g.Dt, g.E], 'green', 3.4);
      const done = prob || g.t >= 0.999;
      if (done) {
        const t1 = [g.A, g.B, g.F], t2 = [g.F, g.C, g.E];
        if (prob || !C.review || st >= 2) { fillPoly(b, t1, 'amber', 0.16); fillPoly(b, t2, 'rose', 0.14); }
        line(b, g.F, g.B, 'ink', 3.4); line(b, g.A, g.F, 'ink', 3.4);
        // 접은 각 표시: ∠AFE = 90°, ∠B, ∠C 직각
        ang(b, g.B, g.A, g.F, { color: 'rose', r: 18 }); ang(b, g.C, g.F, g.E, { color: 'rose', r: 18 }); ang(b, g.F, g.A, g.E, { color: 'rose', r: 17 });
        if (prob || !C.review || st >= 1) { ang(b, g.A, g.B, g.F, { color: 'violet', rings: 1, r: 26 }); ang(b, g.F, g.C, g.E, { color: 'violet', rings: 1, r: 26 }); }
        if (!prob && (!C.review || st >= 2)) { ang(b, g.F, g.B, g.A, { color: 'orange', rings: 2, r: 24 }); ang(b, g.E, g.C, g.F, { color: 'orange', rings: 2, r: 22 }); }
      }
      const sz = 16, lb = (p, q, c, t, col, gap) => sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 10 });
      if (done) {
        tick(b, g.D, g.E, 1, 'amber'); tick(b, g.E, g.F, 1, 'amber'); tick(b, g.A, g.D, 2, 'amber'); tick(b, g.A, g.F, 2, 'amber');
        if (prob) {
          lb(g.A, g.B, cen, String(g.AB), 'sky'); lb(g.B, g.F, cen, String(g.BF), 'sky'); lb(g.F, g.C, cen, String(g.FC), 'sky', 20);
          lb(g.E, g.C, cen, pk.kind === 0 ? 'x' : String(g.CE), pk.kind === 0 ? 'amber' : 'sky', 9);
          if (pk.kind === 1) lb(g.D, g.E, cen, 'x', 'amber', 9);
        } else {
          lb(g.A, g.B, cen, String(g.AB), 'sky'); lb(g.B, g.F, cen, String(g.BF), 'amber'); lb(g.F, g.C, cen, String(g.FC), 'green', 20);
          lb(g.E, g.C, cen, String(g.CE), 'rose', 9); lb(g.D, g.E, cen, String(g.DE), 'ink', 9);
        }
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.F, 'F'], [g.E, 'E']].forEach(([p, nm]) => { if (nm === 'D' || nm === 'F' || nm === 'E' || true) vtx(b, p, nm === 'F' ? pt(g.W / 2, -g.H / 2) : cen, nm, { size: 17, gap: nm === 'F' ? 13 : 12 }); });
      if (C.txt && !prob) {
        const cap = st >= 3 ? `AB : FC = BF : CE → ${g.AB} : ${g.FC} = ${g.BF} : CE → CE = ${g.CE}` : st >= 2 ? '△ABF ∽ △FCE (AA 닮음)' : st >= 1 ? '●+× = 90° 이므로 ∠BAF = ∠CFE' : '종이를 접어 D가 F에 놓였어요';
        T(b, pt(g.W / 2, 0), C.review ? cap : '▶로 접어 보세요. 접힌 모양이 그대로예요', { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `접으면 ∠AFE는 처음 ∠D와 같은 직각이에요. 점 F에서 ∠AFB+∠AFE+∠CFE=180°이므로 ∠AFB+∠CFE=90°. 직각삼각형 ABF에서 ∠BAF+∠AFB=90°이므로 <b>∠BAF=∠CFE</b>(●)예요.`,
      '∠B=∠C=90°이고 ∠BAF=∠CFE이므로 $\\triangle ABF\\sim\\triangle FCE$ (AA 닮음)예요. 대응변: $\\overline{AB}\\leftrightarrow\\overline{FC}$, $\\overline{BF}\\leftrightarrow\\overline{CE}$, $\\overline{AF}\\leftrightarrow\\overline{FE}$',
      `$\\overline{AB}:\\overline{FC}=\\overline{BF}:\\overline{CE}$ → $${M.AB}:${M.FC}=${M.BF}:\\overline{CE}$이므로 $\\overline{CE}=${M.CE}$. 또 $\\overline{DE}=\\overline{DC}-\\overline{CE}=${M.AB}-${M.CE}=${M.DE}$`
    ],
    view: (M) => ({
      guide: '<b>접기</b> 막대나 ▶로 종이를 접어 보세요. 접는 선 AE를 축으로 <b>제자리에서 접혀요</b>. 칩과 배율로 종이의 크기를 바꿔 보세요.',
      readouts: [rd('AB : FC', `${M.AB} : ${M.FC}`, 'sky'), rd('BF : CE', `${M.BF} : ${M.CE}`, 'amber', `= ${M.AB} : ${M.FC}`), rd('DE (= EF)', `${M.DE}`, 'rose', `${M.AB} − ${M.CE}`)],
      formula: `<p>$\\overline{AB}:\\overline{FC}=\\overline{BF}:\\overline{CE}$ → $${M.AB}:${M.FC}=${M.BF}:\\overline{CE}$ → $\\overline{CE}=${M.CE}$</p>`,
      rule: '종이접기: 접힌 각은 같고 직각이 있어서 ●+×=90°로 AA 닮음 삼각형을 찾는다',
      notes: notes('접힌 도형은 처음 도형과 <b>합동</b>이라서 DE=EF, AD=AF예요.', '닮음 비례식은 대응하는 변끼리 세워요: AB와 FC, BF와 CE')
    }),
    prob: (M) => {
      const pk = M.pk, g = foldGeo(pk.typ, pk.j, 1);
      if (pk.kind === 0) return { tag: '종이접기: 닮음으로 길이 구하기', key: `a0${pk.typ}${pk.j}`, stem: '직사각형 ABCD를 선분 AE를 접는 선으로 하여 꼭짓점 D가 변 BC 위의 점 F에 오도록 접었다. $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.CE, [[g.BF * g.FC / g.AB * 2, ''], [g.FC - g.CE + 1, ''], [g.AB - g.BF, 'AB와 BF의 차예요. 닮음비로 구해야 해요.'], [g.BF * g.AB / g.FC, '비례식의 위치가 뒤바뀌었어요. AB : FC = BF : CE예요.'], [g.CE + 1, '']], { pad: 1 }) };
      return { tag: '종이접기: DE의 길이', key: `a1${pk.typ}${pk.j}`, stem: '직사각형 ABCD를 선분 AE를 접는 선으로 하여 꼭짓점 D가 변 BC 위의 점 F에 오도록 접었다. $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.DE, [[g.CE, 'CE의 길이예요. DE = DC − CE예요.'], [g.AB, 'DC의 길이예요. CE를 빼야 해요.'], [g.FC, ''], [g.AB - g.BF, ''], [g.DE + 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 8. 정삼각형 종이접기 */
  const FOLD_E = { mid: (s) => ({ s, p: s / 2, x: s / 2, q: s / 2 }), off: () => ({ s: 30, p: 16, x: 6, q: 9 }) };
  function eqGeo(typ, sIn, t) {
    const f = typ === 'off' ? FOLD_E.off() : FOLD_E.mid(sIn), s = f.s, tri = triTop(s, s, s), A = tri.A, B = tri.B, C = tri.C;
    const D = lerp(B, A, f.p / s), E = lerp(C, A, f.q / s), F = lerp(B, C, f.x / s);
    const u = unit(sub(E, D)), foot = add(D, mul(u, (A.x - D.x) * u.x + (A.y - D.y) * u.y)), perp = sub(A, foot), cs = Math.cos(Math.PI * t), At = add(foot, mul(perp, cs));
    return { typ, s, BD: f.p, BF: f.x, FC: s - f.x, CE: f.q, DF: s - f.p, EF: s - f.q, DA: s - f.p, EA: s - f.q, A, B, C, D, E, F, At, t };
  }
  const foldEq = {
    id: 'sm3-foldequi', title: '정삼각형 종이접기', short: '정삼각형 접기',
    question: '정삼각형 모양의 종이를 접어서 꼭짓점 A가 변 BC 위의 점 F에 오게 했어. 접힌 부분에서 닮은 삼각형을 찾아 길이를 구해 보자.',
    ctl: (s) => ((s.smFtype2 || 'mid') === 'mid' ? ['smFt', 'smFs'] : ['smFt']), anim: { key: 'smFt', dur: 4, label: '종이 접어 보기', start: 1 },
    stepT: (n) => (n === 0 ? 0 : 1),
    presets: () => [['mid', '가운데로 접기'], ['off', '치우쳐 접기']].map(([id, label], i) => ({ group: i === 0 ? '접는 모양' : '', label, apply: (s) => { s.smFtype2 = id; }, on: (s) => (s.smFtype2 || 'mid') === id })),
    init: (s) => { s.smFt = 1; s.smFs = 12; s.smFtype2 = 'mid'; },
    gen: (seed) => { const r = seeded('e8' + seed), flip = ri(r, 0, 1), kind = ri(r, 0, 1); return { seed, flip, kind }; },
    model: (s) => ({ ...eqGeo(s.smFtype2 || 'mid', clamp(Math.round(s.smFs), 8, 20), s.smFt == null ? 1 : s.smFt), typ: s.smFtype2 || 'mid' }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step;
      let g;
      if (prob) { g = eqGeo('off', 30, 1); if (pk.flip) { /* 거울상: x 를 24 쪽으로 */ g = mirrorEq(g); } } else g = eqGeo(M.typ, M.typ === 'mid' ? M.s : 30, C.review ? 1 : C.t);
      const bb = bboxOf([g.A, g.B, g.C]);
      fit(b, bb, { t: 46, b: 60, l: 52, r: 52 });
      const cen = centroid([g.A, g.B, g.C]);
      fillPoly(b, [g.A, g.B, g.C], 'sky', 0.1); poly(b, [g.A, g.B, g.C], 'ink', 3.4);
      line(b, g.D, g.E, 'rose', 3.2, { dash: [8, 6] });
      fillPoly(b, [g.D, g.At, g.E], 'green', 0.24); poly(b, [g.D, g.At, g.E], 'green', 3.4);
      const done = prob || g.t >= 0.999;
      if (done) {
        line(b, g.D, g.F, 'ink', 3.2); line(b, g.E, g.F, 'ink', 3.2);
        if (prob || !C.review || st >= 2) { fillPoly(b, [g.D, g.B, g.F], 'amber', 0.16); fillPoly(b, [g.F, g.C, g.E], 'rose', 0.14); }
        const dm = (k) => 60 + 'x';
        ang(b, g.B, g.C, g.A, { color: 'rose', rings: 1, r: 18 }); ang(b, g.C, g.A, g.B, { color: 'rose', rings: 1, r: 18 }); ang(b, g.F, g.D, g.E, { color: 'rose', rings: 1, r: 18 });
        if (prob || !C.review || st >= 1) { ang(b, g.D, g.B, g.F, { color: 'violet', rings: 2, r: 24 }); ang(b, g.F, g.C, g.E, { color: 'violet', rings: 2, r: 24 }); }
        if (!prob && (!C.review || st >= 2)) { ang(b, g.F, g.B, g.D, { color: 'orange', rings: 3, r: 24 }); ang(b, g.E, g.C, g.F, { color: 'orange', rings: 3, r: 22 }); }
        tick(b, g.D, g.A, 1, 'amber'); tick(b, g.D, g.F, 1, 'amber'); tick(b, g.E, g.A, 2, 'amber'); tick(b, g.E, g.F, 2, 'amber');
      }
      const sz = 16, lb = (p, q, c, t, col, gap) => sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 10 });
      if (done) {
        if (prob) {
          lb(g.B, g.D, cen, String(g.BD), 'sky'); lb(g.B, g.F, cen, String(g.BF), 'sky');
          if (pk.kind === 0) { lb(g.F, g.C, cen, String(g.FC), 'sky'); lb(g.C, g.E, cen, 'x', 'amber', 16); }
          else { lb(g.D, g.A, cen, String(g.DA), 'sky'); lb(g.E, g.F, g.D, 'x', 'amber', 16); T(b, pt((g.B.x + g.C.x) / 2, 0), '', {}); }
        } else {
          lb(g.B, g.D, cen, String(g.BD), 'sky'); lb(g.B, g.F, cen, String(g.BF), 'amber'); lb(g.F, g.C, cen, String(g.FC), 'green'); lb(g.C, g.E, cen, String(g.CE), 'rose');
        }
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E'], [g.F, 'F']].forEach(([p, nm]) => vtx(b, p, nm === 'F' ? pt((g.B.x + g.C.x) / 2, -3) : cen, nm, { size: 17, gap: 12 }));
      if (prob && pk.kind === 1) { /* 한 변의 길이 */ T(b, lerp(g.A, g.C, 0.5), '', {}); }
      if (C.txt && !prob) {
        const cap = st >= 3 ? `BD : CF = BF : CE = DF : FE` : st >= 2 ? '△DBF ∽ △FCE (AA 닮음)' : st >= 1 ? '●+× = 120° 이므로 ∠BDF = ∠CFE' : '종이를 접어 A가 F에 놓였어요';
        T(b, pt((g.B.x + g.C.x) / 2, 0), C.review ? cap : '▶로 접어 보세요. 접힌 모양이 그대로예요', { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      '정삼각형이므로 ∠B=∠C=60°이고, 접으면 ∠DFE도 처음 ∠A와 같은 60°예요. 점 B, F, C가 한 직선 위에 있으므로 ∠BFD+∠DFE+∠CFE=180°, 곧 <b>∠BFD+∠CFE=120°</b>예요.',
      '△DBF에서 ∠BDF+∠BFD=120°이므로 <b>∠BDF=∠CFE</b>(●)예요. ∠B=∠C이므로 $\\triangle DBF\\sim\\triangle FCE$ (AA 닮음)예요.',
      `대응변: $\\overline{BD}\\leftrightarrow\\overline{CF}$, $\\overline{BF}\\leftrightarrow\\overline{CE}$, $\\overline{DF}\\leftrightarrow\\overline{FE}$ → $\\overline{BD}:\\overline{CF}=\\overline{BF}:\\overline{CE}$ → $${M.BD}:${M.FC}=${M.BF}:\\overline{CE}$이므로 $\\overline{CE}=${M.CE}$`
    ],
    view: (M) => ({
      guide: '<b>접기</b>를 움직이거나 ▶를 눌러 종이를 접어 보세요. 접는 선 DE를 축으로 <b>제자리에서 접혀요</b>. ●+×=<b>120°</b>예요(직사각형에서는 90°).',
      readouts: [rd('BD : CF', `${M.BD} : ${M.FC}`, 'sky'), rd('BF : CE', `${M.BF} : ${M.CE}`, 'amber', `= ${M.BD} : ${M.FC}`), rd('접은 변 DF = DA', `${M.DF}`, 'rose', `${M.s} − ${M.BD}`)],
      formula: `<p>$\\overline{BD}:\\overline{CF}=\\overline{BF}:\\overline{CE}$ → $${M.BD}:${M.FC}=${M.BF}:${M.CE}$</p>`,
      rule: '정삼각형 종이접기: ∠BFD+∠CFE=120°에서 ∠BDF=∠CFE → △DBF ∽ △FCE (AA 닮음)',
      notes: notes('접힌 부분은 합동이라 DF=DA, EF=EA예요.', '직사각형은 ●+×=90°, 정삼각형은 ●+×=120°예요.')
    }),
    prob: (M) => {
      const pk = M.pk, g0 = eqGeo('off', 30, 1), g = pk.flip ? mirrorEq(g0) : g0;
      if (pk.kind === 0) return { tag: '정삼각형 접기: 닮음으로 길이 구하기', key: `q0${pk.flip}`, stem: '정삼각형 ABC를 선분 DE를 접는 선으로 하여 꼭짓점 A가 변 BC 위의 점 F에 오도록 접었다. $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.CE, [[g.BF * g.BD / g.FC * 2, ''], [g.FC - g.BD, ''], [g.BD - g.BF, '닮음비로 구해야 해요.'], [g.BF * g.FC / g.BD, '비례식의 위치가 뒤바뀌었어요. BD : CF = BF : CE예요.'], [g.CE + 1, '']], { pad: 1 }) };
      return { tag: '정삼각형 접기: 접은 변의 길이', key: `q1${pk.flip}`, stem: '정삼각형 ABC를 선분 DE를 접는 선으로 하여 꼭짓점 A가 변 BC 위의 점 F에 오도록 접었다. $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.EF, [[g.EA * 1 === g.EF ? g.EF + 2 : g.FC, ''], [g.DA, 'DA(=DF)의 길이예요. EF를 구해야 해요.'], [g.CE + g.DA - g.BD, ''], [g.EF - 2, ''], [g.EF + 3, '']], { pad: 1 }) };
    }
  };
  // 거울상: 좌우 대칭(B↔C)으로 BD↔CE, BF↔FC 가 맞바뀐 모양
  function mirrorEq(g) {
    const tri = triTop(g.s, g.s, g.s), A = tri.A, B = tri.B, C = tri.C;
    const nBD = g.CE, nCE = g.BD, nBF = g.FC;
    const D = lerp(B, A, nBD / g.s), E = lerp(C, A, nCE / g.s), F = lerp(B, C, nBF / g.s);
    return { ...g, BD: nBD, CE: nCE, BF: nBF, FC: g.BF, DA: g.s - nBD, EA: g.s - nCE, DF: g.s - nBD, EF: g.s - nCE, D, E, F, At: F };
  }

  /* ====================================================================== 9. [심화] 사다리꼴 대각선 4분할 */
  function trapGeo(a, bb, c) {
    const t = 2, ADl = a * t, BCl = bb * t, h = c * (a + bb), ox = (BCl - ADl) / 2, B = pt(0, 0), Cp = pt(BCl, 0), A = pt(ox, -h), Dp = pt(ox + ADl, -h);
    const O = inter(A, Cp, B, Dp);
    return { a, bb, c, AD: ADl, BC: BCl, A, B, C: Cp, D: Dp, O, S1: a * a * c, S2: a * bb * c, S3: a * bb * c, S4: bb * bb * c };
  }
  const trapS = {
    id: 'sm3-trap', title: '[심화] 사다리꼴 대각선과 넓이', short: '[심화] 사다리꼴 4분할',
    question: '사다리꼴 ABCD에서 두 대각선의 교점을 O라 하자. 대각선이 나눈 네 삼각형의 넓이는 어떤 비를 이룰까?',
    ctl: ['smTa', 'smTb', 'smTc'],
    init: (s) => { s.smTa = 2; s.smTb = 3; s.smTc = 1; },
    gen: (seed) => { const r = seeded('e9' + seed), a = ri(r, 1, 3), bb = a + ri(r, 1, 2), c = ri(r, 1, 3), kind = ri(r, 0, 1); return { seed, a, bb, c, kind }; },
    model: (s) => ({ ...trapGeo(clamp(Math.round(s.smTa), 1, 4), clamp(Math.round(s.smTb), 1, 5), clamp(Math.round(s.smTc), 1, 3)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? trapGeo(pk.a, pk.bb, pk.c) : M;
      const bb0 = bboxOf([g.A, g.B, g.C, g.D]);
      fit(b, bb0, { t: 44, b: 60, l: 44, r: 44 });
      const cen = centroid([g.A, g.B, g.C, g.D]);
      const show = prob || !C.review || st >= 2;
      fillPoly(b, [g.A, g.O, g.D], 'sky', 0.26); fillPoly(b, [g.B, g.O, g.C], 'green', 0.2);
      fillPoly(b, [g.A, g.B, g.O], 'amber', 0.16); fillPoly(b, [g.D, g.C, g.O], 'amber', 0.16);
      poly(b, [g.A, g.B, g.C, g.D], 'ink', 3.6); line(b, g.A, g.C, 'ink', 3.2); line(b, g.B, g.D, 'ink', 3.2);
      par(b, g.A, g.D, 1, 'green'); par(b, g.B, g.C, 1, 'green');
      if (!prob && (!C.review || st >= 1)) { ang(b, g.A, g.D, g.C, { color: 'rose', rings: 1, r: 18 }); ang(b, g.C, g.B, g.A, { color: 'rose', rings: 1, r: 18 }); ang(b, g.D, g.A, g.B, { color: 'violet', rings: 2, r: 18 }); ang(b, g.B, g.D, g.C, { color: 'violet', rings: 2, r: 18 }); }
      const sz = 16;
      const tl = (Pn, txt, col) => T(b, centroid(Pn), txt, { size: sz + 1, color: col });
      if (prob) {
        if (pk.kind === 0) { tl([g.A, g.O, g.D], String(g.S1), 'sky'); tl([g.B, g.O, g.C], String(g.S4), 'green'); tl([g.A, g.B, g.O], 'x', 'amber'); }
        else { sideTag(b, g.A, g.D, cen, String(g.AD), { color: 'sky', size: sz }); sideTag(b, g.B, g.C, cen, String(g.BC), { color: 'green', size: sz }); tl([g.A, g.O, g.D], String(g.S1), 'sky'); tl([g.B, g.O, g.C], 'x', 'amber'); }
      } else {
        sideTag(b, g.A, g.D, cen, String(g.AD), { color: 'sky', size: sz }); sideTag(b, g.B, g.C, cen, String(g.BC), { color: 'green', size: sz });
        if (show) { tl([g.A, g.O, g.D], String(g.S1), 'sky'); tl([g.B, g.O, g.C], String(g.S4), 'green'); tl([g.A, g.B, g.O], String(g.S2), 'amber'); tl([g.D, g.C, g.O], String(g.S3), 'amber'); }
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      T(b, g.O, 'O', { dy: 0, dx: 0, size: 0 });
      b.point(g.O, { color: 'ink', r: 4 });
      if (C.txt && !prob) {
        const cap = st >= 3 ? `넓이 ${g.S1} : ${g.S2} : ${g.S3} : ${g.S4} = ${g.a * g.a}:${g.a * g.bb}:${g.a * g.bb}:${g.bb * g.bb} (×${g.c})` : st >= 2 ? `△AOD ∽ △COB, 닮음비 ${g.a} : ${g.bb} → 넓이비 ${g.a * g.a} : ${g.bb * g.bb}` : '△AOD와 △COB는 엇각이 같아요';
        T(b, pt((bb0.x0 + bb0.x1) / 2, 0), C.review ? cap : `AD : BC = ${g.a} : ${g.bb}  →  △AOD : △COB = ${g.a * g.a} : ${g.bb * g.bb}`, { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `AD ∥ BC이므로 엇각이 같아서 $\\triangle AOD\\sim\\triangle COB$ (AA 닮음)예요. 닮음비는 $\\overline{AD}:\\overline{CB}=${M.a}:${M.bb}$예요.`,
      `넓이의 비는 닮음비의 제곱이에요. $\\triangle AOD:\\triangle COB=${M.a}^{2}:${M.bb}^{2}=${M.a * M.a}:${M.bb * M.bb}$ → ${M.S1} : ${M.S4}`,
      `높이가 같은 $\\triangle AOD$와 $\\triangle AOB$의 넓이의 비는 밑변의 비 $\\overline{OD}:\\overline{OB}=${M.a}:${M.bb}$예요. 그러므로 $\\triangle AOB=\\triangle COD=${M.S2}$이고, 네 넓이는 $${M.S1}:${M.S2}:${M.S2}:${M.S4}$예요.`
    ],
    view: (M) => ({
      guide: '<b>a, b</b> 막대로 윗변·아랫변을, <b>c</b>로 넓이의 단위를 바꿔 보세요. 마주 보는 두 삼각형(AOD, COB)은 닮음이고, 옆의 두 삼각형(AOB, COD)은 넓이가 같아요.',
      readouts: [rd('윗변 : 아랫변', `${M.AD} : ${M.BC}`, 'sky', `= ${M.a} : ${M.bb}`), rd('네 삼각형의 넓이', `${M.S1} · ${M.S2} · ${M.S3} · ${M.S4}`, 'amber', `${M.a * M.a} : ${M.a * M.bb} : ${M.a * M.bb} : ${M.bb * M.bb}`, null, true)],
      formula: `<p>$\\triangle AOD:\\triangle AOB:\\triangle COD:\\triangle COB=a^{2}:ab:ab:b^{2}=${M.a * M.a}:${M.a * M.bb}:${M.a * M.bb}:${M.bb * M.bb}$</p>`,
      rule: '[심화] 사다리꼴의 두 대각선이 나눈 네 삼각형의 넓이의 비는 a² : ab : ab : b² (AD : BC = a : b)',
      notes: notes('넓이가 같은 것은 마주 보는 삼각형이 아니라 <b>옆의 두 삼각형</b> AOB와 COD예요.', '닮음비가 a : b이면 넓이의 비는 a² : b²이고, 사이의 두 삼각형은 ab예요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = trapGeo(pk.a, pk.bb, pk.c);
      if (pk.kind === 0) return { tag: '[심화] 사다리꼴의 삼각형 넓이', key: `t0${pk.a}${pk.bb}${pk.c}`, stem: 'AD ∥ BC인 사다리꼴 ABCD에서 두 대각선의 교점을 O라 하자. 그림과 같이 △AOD와 △COB의 넓이가 주어졌을 때, △AOB의 넓이 $x$는?', choices: mkChoices(g.S2, [[(g.S1 + g.S4) / 2, '두 넓이의 평균을 구했어요. 닮음비로 구해야 해요.'], [g.S1 + g.S4, ''], [Math.round(Math.sqrt(g.S1 * g.S4)) === g.S2 ? g.S2 + g.c : g.S2 + 1, ''], [g.S4 - g.S1, '']], { pad: pk.c }) };
      return { tag: '[심화] 닮음비로 넓이 구하기', key: `t1${pk.a}${pk.bb}${pk.c}`, stem: 'AD ∥ BC인 사다리꼴 ABCD에서 두 대각선의 교점을 O라 하자. △AOD의 넓이가 주어졌을 때, △COB의 넓이 $x$는?', choices: mkChoices(g.S4, [[g.S1 * g.BC / g.AD, '닮음비를 그대로 곱했어요. 넓이는 제곱의 비예요.'], [g.S1 * g.BC ** 3 / g.AD ** 3, '세제곱을 썼어요. 부피의 비예요.'], [g.S2, '△AOB의 넓이예요.'], [g.S4 + g.c, '']], { pad: pk.c }) };
    }
  };

  G.geo = Object.assign(G.geo || {}, { parGeo, flipGeo, rotGeo, sasGeo, multiGeo, ssaGeo, foldGeo, eqGeo, mirrorEq, trapGeo });
  G.register(30, 't3', '③ 삼각형의 닮음 조건', '삼각형의 닮음 조건', PARAMS, [nestPar, nestFlip, rotS, sasS, multiS, ssaS, foldRect, foldEq, trapS]);
})();
