/* ==========================================================================
   중2 · 도형의 닮음 — 탭 ④ 「삼각형과 평행선」 (t4.js, order 40) — 장면 8개
   · s4-1 삼각형과 평행선    · AD : DB = AE : EC 이면 DE ∥ BC (점 D, E를 직접 움직여요)
   · s4-2 X자형 닮음(모래시계)· AD ∥ BC 이면 △OAD ∽ △OCB (엇각·맞꼭지각)
   · s4-3 교점 O를 지나는 평행선 EF · EF = 2ab ÷ (a+b)
   · s4-4 중점연결정리       · 두 변의 중점을 이으면 평행이고 길이는 절반
   · s4-5 세 변의 중점을 모두 이으면 · 합동인 삼각형 4개, 넓이는 4등분
   · s4-6 사각형의 네 변의 중점 · 평행사변형 EFGH (이 실험실에서만 다뤄요)
   · s4-7 삼각형 내각의 이등분선 · AB : AC = BD : DC
   · s4-8 삼각형 외각의 이등분선 · AB : AC = BD : CD
   값은 모두 정수이고, 글자·표시·정답은 지금의 슬라이더 값으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SM;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, mid, lerp, polar, dist, unit, centroid, triTop, seeded, ri, rpick, T, sideTag, dim, ang, tick, par, fillPoly, line, poly, fit, P, rd, notes, mkChoices, mkTextChoices, gcd, fmtN, bboxOf, unionBox, phone, capSize, frT, vtx, inter, textW } = G;

  const PARAMS = {
    smAd: P('점 D의 자리 (AD)', 1, 3, 1, 1, { color: 'sky', format: (v) => `${v} 칸`, hint: 'AB를 4칸으로 나눈 눈금' }),
    smAe: P('점 E의 자리 (AE)', 1, 3, 1, 1, { color: 'green', format: (v) => `${v} 칸`, hint: 'AC를 4칸으로 나눈 눈금' }),
    smXm: P('OA의 단위 m', 1, 3, 1, 1, { color: 'sky' }),
    smXn: P('OC의 단위 n', 1, 4, 1, 2, { color: 'green' }),
    smXr: P('윗변의 단위 r', 2, 4, 1, 3, { color: 'amber' }),
    smEm: P('윗변 AD의 단위 m', 1, 3, 1, 1, { color: 'sky' }),
    smEn: P('아랫변 BC의 단위 n', 1, 3, 1, 2, { color: 'green' }),
    smMp: P('AB의 절반 AD', 3, 5, 1, 4, { color: 'sky' }),
    smMq: P('AC의 절반 AE', 3, 5, 1, 3, { color: 'green' }),
    smMr: P('BC의 절반 DE', 3, 5, 1, 5, { color: 'amber' }),
    smFu: P('삼각형의 크기 t', 1, 3, 1, 1, { color: 'sky', format: (v) => `${v}배` }),
    smVa: P('대각선 AC', 4, 12, 2, 8, { color: 'sky', format: (v) => v + ' cm' }),
    smVb: P('대각선 BD', 4, 12, 2, 6, { color: 'green', format: (v) => v + ' cm' }),
    smVt: P('두 대각선이 이루는 각', 50, 90, 10, 70, { color: 'rose', format: (v) => v + '°' }),
    smBm: P('AB의 단위 m', 2, 4, 1, 3, { color: 'sky' }),
    smBn: P('AC의 단위 n', 2, 4, 1, 2, { color: 'green' }),
    smBx: P('외각: AC의 단위 n', 2, 3, 1, 2, { color: 'green' }),
    smBg: P('외각: AB − AC (단위)', 1, 3, 1, 1, { color: 'sky' })
  };

  const cap = (b, C, st, texts, dflt, y0, dy) => { const t = C.review ? texts[Math.min(st, texts.length - 1)] : dflt; return t; };

  /* ====================================================================== 1. 삼각형과 평행선 */
  function lineGeo(d, e) {
    const AB = 8, AC = 12, BC = 12, tri = triTop(BC, AC, AB), A = tri.A, B = tri.B, C = tri.C, D = lerp(A, B, d / 4), E = lerp(A, C, e / 4);
    return { d, e, AB, AC, BC, AD: 2 * d, DB: 8 - 2 * d, AE: 3 * e, EC: 12 - 3 * e, DE: d === e ? 3 * d : null, par: d === e, A, B, C, D, E };
  }
  function drawLine(b, g, lab, o = {}) {
    const cen = centroid([g.A, g.B, g.C]), cl = centroid([g.D, g.B, g.C, g.E]);
    fillPoly(b, [g.A, g.D, g.E], 'sky', 0.2); fillPoly(b, [g.D, g.B, g.C, g.E], 'green', 0.07);
    poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.D, g.E, o.par ? 'green' : 'rose', 3.8);
    if (o.par) { par(b, g.D, g.E, 1, 'green'); par(b, g.B, g.C, 1, 'green'); }
    const sz = 16, lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 10 });
    lb(g.A, g.D, cen, lab.AD, lab.cAD || 'sky'); lb(g.D, g.B, cen, lab.DB, lab.cDB || 'green'); lb(g.A, g.E, cen, lab.AE, lab.cAE || 'sky'); lb(g.E, g.C, cen, lab.EC, lab.cEC || 'green');
    lb(g.D, g.E, cl, lab.DE, lab.cDE || 'sky', 9); lb(g.B, g.C, cen, lab.BC, lab.cBC || 'green', 11);
    [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
  }
  const nest1 = {
    id: 'sm4-conv', title: '삼각형과 평행선', short: '삼각형과 평행선',
    question: '삼각형 ABC의 변 AB, AC 위에 점 D, E를 잡았을 때, 선분 DE가 BC와 평행해지려면 점의 자리가 어때야 할까?',
    ctl: ['smAd', 'smAe'],
    init: (s) => { s.smAd = 2; s.smAe = 2; },
    gen: (seed) => { const r = seeded('f1' + seed), d = ri(r, 1, 3), kind = ri(r, 0, 2); const sh = rpick(r, [[2, 3, 3], [2, 3, 4], [3, 2, 4], [3, 3, 4], [2, 2, 3], [3, 3, 3], [2, 3, 2], [3, 2, 3]]); return { seed, d, kind, N: ri(r, 3, 5), p: sh[0], q: sh[1], rr: sh[2] }; },
    model: (s) => ({ ...lineGeo(clamp(Math.round(s.smAd), 1, 3), clamp(Math.round(s.smAe), 1, 3)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step;
      if (prob) {
        const N = pk.N, d = ri(seeded('f1d' + pk.seed), 1, N - 1), tri = triTop(pk.rr * N, pk.q * N, pk.p * N), A = tri.A, B = tri.B, Cc = tri.C;
        const g = { A, B, C: Cc, D: lerp(A, B, d / N), E: lerp(A, Cc, d / N) };
        const v = { AD: pk.p * d, DB: pk.p * (N - d), AE: pk.q * d, EC: pk.q * (N - d), DE: pk.rr * d, BC: pk.rr * N };
        fit(b, bboxOf([A, B, Cc]), { t: 48, b: 52, l: 64, r: 64 });
        const L = pk.kind === 0 ? { AD: v.AD, DB: v.DB, AE: v.AE, EC: 'x', cEC: 'amber' } : pk.kind === 1 ? { AD: v.AD, DB: v.DB, BC: v.BC, DE: 'x', cDE: 'amber' } : { AD: v.AD, DB: v.DB, EC: v.EC, AE: 'x', DE: v.DE, BC: v.BC, cAE: 'amber', cBC: 'sky' };
        if (pk.kind === 2) { L.BC = v.BC; L.DE = 'y'; L.cDE = 'amber'; }
        Object.keys(L).forEach((k) => { if (typeof L[k] === 'number') L[k] = String(L[k]); });
        drawLine(b, g, L, { par: true });
        return;
      }
      fit(b, bboxOf([M.A, M.B, M.C]), { t: 48, b: 60, l: 64, r: 64 });
      const lab = { AD: String(M.AD), DB: String(M.DB), AE: String(M.AE), EC: String(M.EC), BC: String(M.BC), DE: M.par ? String(M.DE) : null };
      drawLine(b, M, lab, { par: M.par && (!C.review || st >= 1) });
      if (C.txt) {
        const ok = M.par;
        const m1 = M.AD + ' : ' + M.DB, m2 = M.AE + ' : ' + M.EC;
        const msg = (C.review ? st >= 2 : true) ? (ok ? `AD : DB = AE : EC = ${M.d} : ${4 - M.d}  →  DE ∥ BC ○` : `AD : DB = ${M.d} : ${4 - M.d}, AE : EC = ${M.e} : ${4 - M.e}  →  평행하지 않아요 ×`) : '점 D, E를 움직여 보세요';
        T(b, pt((M.B.x + M.C.x) / 2, 0), msg, { dy: 40, size: phone(b) ? 13 : 16, color: ok ? 'green' : 'rose' });
      }
      const snap = (P0, P1, w) => { const u = sub(P1, P0), f = ((w.x - P0.x) * u.x + (w.y - P0.y) * u.y) / (u.x * u.x + u.y * u.y); return clamp(Math.round(f * 4), 1, 3); };
      b.handle('hd', M.D, { color: 'amber', r: 8, ariaLabel: '점 D 끌기 (AB 위)', drag: (w) => { s.smAd = snap(M.A, M.B, w); } });
      b.handle('he', M.E, { color: 'green', r: 8, ariaLabel: '점 E 끌기 (AC 위)', drag: (w) => { s.smAe = snap(M.A, M.C, w); } });
    },
    steps: (M) => [
      `점 D는 AB를 $${M.d}:${4 - M.d}$로, 점 E는 AC를 $${M.e}:${4 - M.e}$로 나눠요. 두 비가 ${M.par ? '같아요' : '달라요'}.`,
      M.par ? `$\\overline{AD}:\\overline{DB}=\\overline{AE}:\\overline{EC}$이면 $\\overline{DE}\\parallel\\overline{BC}$예요. 거꾸로 $\\overline{DE}\\parallel\\overline{BC}$이면 $\\triangle ADE\\sim\\triangle ABC$이므로 $\\overline{AD}:\\overline{AB}=\\overline{AE}:\\overline{AC}=\\overline{DE}:\\overline{BC}$예요.` : `$\\overline{AD}:\\overline{DB}\\ne\\overline{AE}:\\overline{EC}$이므로 DE는 BC와 평행하지 않아요.`,
      M.par ? `평행할 때 $\\overline{DE}:\\overline{BC}=\\overline{AD}:\\overline{AB}=${M.d}:4$ → $\\overline{DE}=${M.BC}\\times${frT(M.d, 4).slice(1, -1)}=${M.DE}$` : '점 D와 E의 눈금이 같을 때만(AD : DB = AE : EC) 평행해져요.'
    ],
    view: (M) => ({
      guide: '<b>점 D, E의 자리</b> 막대를 움직여 보세요. D와 E가 같은 비로 나누는 자리에 올 때만 DE ∥ BC가 돼요(초록).',
      readouts: [rd('AD : DB', `${M.AD} : ${M.DB}`, 'sky', `= ${M.d} : ${4 - M.d}`), rd('AE : EC', `${M.AE} : ${M.EC}`, 'green', `= ${M.e} : ${4 - M.e}`), rd('DE와 BC', M.par ? '평행 ○' : '평행 아님 ×', M.par ? 'green' : 'rose')],
      formula: M.par ? `<p>$\\overline{AD}:\\overline{DB}=\\overline{AE}:\\overline{EC}$ → $${M.AD}:${M.DB}=${M.AE}:${M.EC}$</p>` : `<p>$${M.AD}:${M.DB}\\ne${M.AE}:${M.EC}$ 이므로 평행하지 않아요</p>`,
      rule: 'AD : DB = AE : EC 이면 DE ∥ BC이고, 거꾸로 DE ∥ BC이면 AD : DB = AE : EC',
      notes: notes('<b>[함정]</b> 평행이면 AD : DB = AE : EC이지만 <b>DE : BC는 AD : AB</b>와 같아요(DB가 아니에요).', 'DE ∥ BC이면 AD : AB = AE : AC = DE : BC도 성립해요.')
    }),
    prob: (M) => {
      const pk = M.pk, N = pk.N, d = ri(seeded('f1d' + pk.seed), 1, N - 1), v = { AD: pk.p * d, DB: pk.p * (N - d), AE: pk.q * d, EC: pk.q * (N - d), DE: pk.rr * d, BC: pk.rr * N };
      if (pk.kind === 0) return { tag: '평행선과 선분의 비: EC', key: `l0${pk.N}${d}${pk.p}${pk.q}`, stem: 'DE ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(v.EC, [[v.AE * v.AD / v.DB, 'AD : DB = AE : EC에서 비례식의 위치가 뒤바뀌었어요.'], [v.AE, 'AE의 길이예요.'], [v.AE + v.DB - v.AD, ''], [v.EC + 1, '']], { pad: 1 }) };
      if (pk.kind === 1) return { tag: '평행선과 닮음비: DE', key: `l1${pk.N}${d}${pk.rr}${pk.p}`, stem: 'DE ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(v.DE, [[v.BC * v.AD / v.DB, '[함정] AD : DB를 썼어요. DE : BC는 AD : AB와 같아요.'], [v.BC - v.DB, ''], [v.AD, ''], [v.BC * v.DB / v.AB || v.BC / N, ''], [v.DE + 1, '']], { pad: 1 }) };
      const ans = v.AE + v.DE;
      return { tag: '평행선과 선분의 비: x+y', key: `l2${pk.N}${d}${pk.p}${pk.q}${pk.rr}`, stem: 'DE ∥ BC일 때, $x+y$의 값을 구하시오. (단위: cm)', choices: mkChoices(ans, [[v.AE + v.BC * v.AD / v.DB, '[함정] y를 AD : DB로 구했어요. DE : BC는 AD : AB예요.'], [v.EC + v.DE, ''], [v.AE + v.DE + 1, ''], [v.AE + v.BC, '']], { pad: 1 }) };
    }
  };
  // 점 D, E 의 끌기: 눈금에 맞춰 슬라이더 값 바꾸기
  const nest1draw = nest1.draw;
  nest1.draw = function (b, s, M, C) {
    nest1draw(b, s, M, C);
  };

  /* ====================================================================== 2. X자형 닮음 (모래시계) */
  function xGeo(m, n, r) {
    const OA = 2 * m, OD = 3 * m, AD = r * m, x = (OA * OA + AD * AD - OD * OD) / (2 * AD), hh = Math.sqrt(Math.max(0.01, OA * OA - x * x));
    const A = pt(0, 0), D = pt(AD, 0), O = pt(x, hh), k = n / m, Cc = sub(O, mul(sub(A, O), k)), Bb = sub(O, mul(sub(D, O), k));
    return { m, n, r, OA, OD, AD, OC: 2 * n, OB: 3 * n, BC: r * n, A, D, O, C: Cc, B: Bb };
  }
  const xS = {
    id: 'sm4-x', title: 'X자형 닮음 (모래시계)', short: 'X자형 닮음',
    question: '두 직선이 점 O에서 만나고 AD ∥ BC이면, 두 삼각형 OAD와 OCB는 닮은 도형일까? 모래시계 모양에서 변의 비를 찾아보자.',
    ctl: ['smXm', 'smXn', 'smXr'],
    init: (s) => { s.smXm = 1; s.smXn = 2; s.smXr = 3; },
    gen: (seed) => { const r = seeded('f2' + seed), pr = rpick(r, [[1, 2], [2, 3], [1, 3], [3, 2], [2, 1], [3, 1]]), rr = ri(r, 2, 4), kind = ri(r, 0, 1); return { seed, m: pr[0], n: pr[1], r: rr, kind }; },
    model: (s) => ({ ...xGeo(clamp(Math.round(s.smXm), 1, 3), clamp(Math.round(s.smXn), 1, 4), clamp(Math.round(s.smXr), 2, 4)), g: gcd(clamp(Math.round(s.smXm), 1, 3), clamp(Math.round(s.smXn), 1, 4)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? xGeo(pk.m, pk.n, pk.r) : M;
      // Keep the outward A/D names below the board's upper status badge.
      // Inverse ratios place the large top triangle directly beneath that badge.
      // The problem has no exploration badge or bottom explanation. Reserving
      // those two rows on a short phone board shrinks the small triangle to 21px.
      const mobileProblem = prob && phone(b) && b.H < 320;
      fit(b, bboxOf([g.A, g.D, g.B, g.C]), mobileProblem ? { t: 30, b: 34, l: 36, r: 36 } : { t: 74, b: 66, l: 52, r: 52 });
      const cen = g.O, upperColor = g.m <= g.n ? 'sky' : 'green', lowerColor = g.m <= g.n ? 'green' : 'sky';
      fillPoly(b, [g.O, g.A, g.D], upperColor, 0.18); fillPoly(b, [g.O, g.B, g.C], lowerColor, 0.18);
      line(b, g.A, g.D, 'ink', 3.6); line(b, g.B, g.C, 'ink', 3.6); line(b, g.A, g.C, 'ink', 3.6); line(b, g.D, g.B, 'ink', 3.6);
      par(b, g.A, g.D, 1, 'green'); par(b, g.B, g.C, 1, 'green');
      const angleR = (v, p, q) => mobileProblem ? Math.max(8, Math.min(20, Math.min(dist(v, p), dist(v, q)) * b.k * 0.28)) : 20;
      if (prob || !C.review || st >= 1) { ang(b, g.A, g.D, g.O, { color: 'rose', rings: 1, r: angleR(g.A, g.D, g.O) }); ang(b, g.C, g.B, g.O, { color: 'rose', rings: 1, r: angleR(g.C, g.B, g.O) }); ang(b, g.D, g.A, g.O, { color: 'violet', rings: 2, r: angleR(g.D, g.A, g.O) }); ang(b, g.B, g.C, g.O, { color: 'violet', rings: 2, r: angleR(g.B, g.C, g.O) }); }
      const mark = (p, q) => 0;
      const sz = 16, lb = (p, q, t, col, gap) => t != null && sideTag(b, p, q, cen, t, { color: col, size: sz, gap: gap || 12 });
      const lbIn = (p, q, t, col) => T(b, lerp(p, q, 0.5), t, { size: sz, color: col, dx: ((p.y > q.y ? 1 : 1) * 14), dy: 0 });
      if (prob) {
        if (pk.kind === 0) { lbIn(g.A, g.O, String(g.OA), upperColor); lbIn(g.O, g.C, String(g.OC), lowerColor); lb(g.A, g.D, String(g.AD), upperColor); lb(g.B, g.C, 'x', 'amber'); }
        else { lbIn(g.A, g.O, 'x', 'amber'); lbIn(g.O, g.C, String(g.OC), lowerColor); lbIn(g.D, g.O, String(g.OD), upperColor); lbIn(g.O, g.B, String(g.OB), lowerColor); }
      } else {
        lbIn(g.A, g.O, String(g.OA), upperColor); lbIn(g.O, g.C, String(g.OC), lowerColor); lbIn(g.D, g.O, String(g.OD), upperColor); lbIn(g.O, g.B, String(g.OB), lowerColor); lb(g.A, g.D, String(g.AD), upperColor); lb(g.B, g.C, String(g.BC), lowerColor);
      }
      [[g.A, 'A'], [g.D, 'D'], [g.B, 'B'], [g.C, 'C']].forEach(([p, nm]) => vtx(b, p, g.O, nm, { size: 17, gap: 12 }));
      b.point(g.O, { color: 'ink', r: 4.2 });
      T(b, g.O, 'O', { dx: -2, dy: -17, size: 17 });
      if (C.txt && !prob) {
        const msg = st >= 3 ? `OA : OC = OD : OB = AD : CB = ${g.m} : ${g.n}` : st >= 2 ? `△OAD ∽ △OCB (닮음비 ${g.m} : ${g.n})` : st >= 1 ? '엇각 ∠OAD=∠OCB, ∠ODA=∠OBC, 맞꼭지각 ∠AOD=∠COB' : `AD ∥ BC`;
        T(b, pt((g.B.x + g.C.x) / 2, Math.max(g.B.y, g.C.y)), msg, { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      'AD ∥ BC이므로 엇각이 같아요: $\\angle OAD=\\angle OCB$, $\\angle ODA=\\angle OBC$. 맞꼭지각 $\\angle AOD=\\angle COB$도 같아요.',
      '두 각이 같으므로 $\\triangle OAD\\sim\\triangle OCB$ (AA 닮음). 점 A와 C, 점 D와 B가 대응해요 (X자 모양으로 마주 보는 점끼리).',
      `$\\overline{OA}:\\overline{OC}=\\overline{OD}:\\overline{OB}=\\overline{AD}:\\overline{CB}$ → $${M.OA}:${M.OC}=${M.OD}:${M.OB}=${M.AD}:${M.BC}$ (닮음비 ${M.m} : ${M.n})`
    ],
    view: (M) => ({
      guide: '<b>m, n, r</b> 막대로 모래시계의 모양을 바꿔 보세요. 마주 보는 두 삼각형은 <b>엇각과 맞꼭지각</b> 때문에 늘 닮은 도형이에요.',
      readouts: [rd('OA : OC', `${M.OA} : ${M.OC}`, 'sky', `= ${M.m} : ${M.n}`), rd('OD : OB', `${M.OD} : ${M.OB}`, 'green', `= ${M.m} : ${M.n}`), rd('AD : CB', `${M.AD} : ${M.BC}`, 'amber', `= ${M.m} : ${M.n}`)],
      formula: `<p>$\\overline{OA}:\\overline{OC}=\\overline{AD}:\\overline{CB}$ → $${M.OA}:${M.OC}=${M.AD}:${M.BC}$</p>`,
      rule: 'AD ∥ BC이면 △OAD ∽ △OCB (X자형) → OA : OC = OD : OB = AD : CB',
      notes: notes('대응점은 <b>마주 보는</b> 점이에요: A와 C, D와 B.', '<b>[함정]</b> △OAD ∽ △OBC라고 쓰면 대응 순서가 틀려요. △OAD ∽ △OCB예요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = xGeo(pk.m, pk.n, pk.r);
      if (pk.kind === 0) return { tag: 'X자형 닮음: 변의 길이', key: `x0${pk.m}${pk.n}${pk.r}`, stem: 'AD ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.AD * g.OA / g.OC, '비례식의 위치가 뒤바뀌었어요. OA : OC = AD : CB예요.'], [g.AD + g.OC - g.OA, ''], [g.OC, 'OC의 길이예요.'], [g.AD * 2, ''], [g.BC + 1, '']], { pad: 1 }) };
      return { tag: 'X자형 닮음: 선분의 길이', key: `x1${pk.m}${pk.n}${pk.r}`, stem: 'AD ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.OA, [[g.OC * g.OB / g.OD, '비례식의 위치가 뒤바뀌었어요. OA : OC = OD : OB예요.'], [g.OC + g.OD - g.OB, ''], [g.OD, 'OD의 길이예요.'], [g.OC, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 3. 교점 O를 지나는 평행선 EF */
  function efGeo(m, n) {
    const AD = m * (m + n), BC = n * (m + n), EF = 2 * m * n, w = BC, hgt = 6, ox = 0;
    const B = pt(0, 0), Cc = pt(BC, 0), A = pt(1.5, -hgt), D = pt(1.5 + AD, -hgt);
    const O = inter(A, Cc, B, D), E = inter(A, B, pt(-100, O.y), pt(100, O.y)), F = inter(D, Cc, pt(-100, O.y), pt(100, O.y));
    return { m, n, AD, BC, EF, EO: m * n, A, B, C: Cc, D, O, E, F };
  }
  const efS = {
    id: 'sm4-ef', title: '교점 O를 지나는 평행선 EF', short: '평행선 EF',
    question: '사다리꼴 ABCD에서 두 대각선의 교점 O를 지나 밑변 BC에 평행한 선분 EF를 그으면, EF의 길이는 윗변 AD와 아랫변 BC로 어떻게 구할까?',
    ctl: ['smEm', 'smEn'],
    init: (s) => { s.smEm = 1; s.smEn = 2; },
    gen: (seed) => { const r = seeded('f3' + seed), m = ri(r, 1, 3), n = ri(r, 1, 3), kind = ri(r, 0, 1); return { seed, m: m === n ? m : m, n: m === n ? (n % 3) + 1 : n, kind }; },
    model: (s) => ({ ...efGeo(clamp(Math.round(s.smEm), 1, 3), clamp(Math.round(s.smEn), 1, 3)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? efGeo(pk.m, pk.n) : M;
      const topColor = g.m <= g.n ? 'sky' : 'green', bottomColor = g.m <= g.n ? 'green' : 'sky';
      fit(b, bboxOf([g.A, g.B, g.C, g.D]), { t: 44, b: 60, l: 52, r: 104 });
      const cen = centroid([g.A, g.B, g.C, g.D]);
      // Once the proof switches to AEO/ABC (or DOF/DBC), its overlay supplies
      // those two relevant fills; the earlier X-shaped comparison is cleared.
      if (!C.solution || C.solStep < 3) {
        fillPoly(b, [g.A, g.D, g.O], topColor, 0.18); fillPoly(b, [g.B, g.C, g.O], bottomColor, 0.18);
      }
      poly(b, [g.A, g.B, g.C, g.D], 'ink', 3.6); line(b, g.A, g.C, 'ink', 3.0); line(b, g.B, g.D, 'ink', 3.0);
      line(b, g.E, g.F, 'amber', 3.8); par(b, g.A, g.D, 1, 'green'); par(b, g.B, g.C, 1, 'green'); par(b, g.E, g.F, 1, 'green', 0.2);
      const sz = 16;
      const lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 11 });
      if (prob) {
        lb(g.A, g.D, cen, String(g.AD), topColor); lb(g.B, g.C, cen, String(g.BC), bottomColor);
        if (pk.kind === 0) T(b, g.F, 'EF = x', { size: 17, color: 'amber', dx: 56, dy: -2 }); else T(b, lerp(g.E, g.O, 0.5), 'EO = x', { size: 17, color: 'amber', dy: -15 }); // EF 전체를 구하는 문제: 점 F 바깥에 'EF = x'
      } else {
        lb(g.A, g.D, cen, String(g.AD), topColor); lb(g.B, g.C, cen, String(g.BC), bottomColor);
        T(b, lerp(g.E, g.O, 0.5), String(g.EO), { size: 16, color: 'amber', dy: -15 });
        if (!C.review || st >= 3) T(b, lerp(g.O, g.F, 0.5), String(g.EO), { size: 16, color: 'amber', dy: -15 });
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E'], [g.F, 'F']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      b.point(g.O, { color: 'ink', r: 4.2 }); T(b, g.O, 'O', { dx: 12, dy: 15, size: 17 });
      if (C.txt && !prob) {
        const msg = st >= 3 ? `EF = EO + OF = ${g.EO} + ${g.EO} = ${g.EF}` : st >= 2 ? `EO : BC = AO : AC = ${g.m} : ${g.m + g.n}` : st >= 1 ? `AO : OC = AD : BC = ${g.m} : ${g.n}` : '점 O를 지나 BC와 평행한 선분 EF';
        T(b, pt((g.B.x + g.C.x) / 2, 0), msg, { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `AD ∥ BC이므로 $\\triangle OAD\\sim\\triangle OCB$이고 $\\overline{AO}:\\overline{OC}=\\overline{AD}:\\overline{BC}=${M.AD}:${M.BC}=${M.m}:${M.n}$이에요.`,
      `$\\overline{EO}\\parallel\\overline{BC}$이므로 $\\triangle AEO\\sim\\triangle ABC$예요. $\\overline{EO}:\\overline{BC}=\\overline{AO}:\\overline{AC}=${M.m}:${M.m + M.n}$이므로 $\\overline{EO}=${M.BC}\\times${frT(M.m, M.m + M.n).slice(1, -1)}=${M.EO}$`,
      `$\\triangle DOF\\sim\\triangle DBC$에서 같은 방법으로 $\\overline{OF}=${M.EO}$이므로 $\\overline{EF}=\\overline{EO}+\\overline{OF}=${M.EO}+${M.EO}=${M.EF}$`
    ].concat([`한 번에: $\\overline{EF}=\\dfrac{2ab}{a+b}=\\dfrac{2\\times${M.AD}\\times${M.BC}}{${M.AD}+${M.BC}}=${M.EF}$ (a = AD, b = BC)`]),
    view: (M) => ({
      guide: '<b>m, n</b> 막대로 윗변과 아랫변의 비를 바꿔 보세요. 교점 O를 지나는 평행선 EF는 O에서 <b>둘로 똑같이 나뉘고</b> 길이가 정수로 딱 떨어져요.',
      readouts: [rd('AD : BC', `${M.AD} : ${M.BC}`, 'sky', `= ${M.m} : ${M.n}`), rd('EO (= OF)', `${M.EO}`, 'amber', `${M.BC} × ${M.m} ÷ ${M.m + M.n}`), rd('EF', `${M.EF}`, 'green', `${M.EO} + ${M.EO}`)],
      formula: `<p>$\\overline{EO}=\\dfrac{${M.m}}{${M.m + M.n}}\\times${M.BC}=${M.EO}$, $\\overline{EF}=2\\times${M.EO}=${M.EF}$</p>`,
      rule: '사다리꼴 ABCD에서 대각선의 교점 O를 지나 BC에 평행한 EF: EO = OF 이고 EF = 2ab ÷ (a+b)',
      notes: notes('EF는 두 밑변의 평균 (a+b)÷2가 아니에요. O가 가운데가 아니라서 값이 더 작아요.', '먼저 AO : OC = AD : BC(X자형 닮음)를 찾는 것이 출발점이에요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = efGeo(pk.m, pk.n), avg = (g.AD + g.BC) / 2;
      if (pk.kind === 0) return { tag: '교점을 지나는 평행선 EF', key: `e0${pk.m}${pk.n}`, stem: 'AD ∥ EF ∥ BC이고 두 대각선의 교점 O가 EF 위에 있을 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.EF, [[avg, '[함정] 두 밑변의 평균이 아니에요. 점 O를 지나는 평행선은 더 짧아요.'], [g.EO, 'EO의 길이예요. EF = EO + OF예요.'], [g.AD + g.BC - g.EF, ''], [g.EF + 1, ''], [g.EF - 1, '']], { pad: 1 }) };
      return { tag: '교점을 지나는 평행선: EO', key: `e1${pk.m}${pk.n}`, stem: 'AD ∥ EF ∥ BC이고 두 대각선의 교점 O가 EF 위에 있을 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.EO, [[g.EF, 'EF 전체의 길이예요. EO는 그 절반이에요.'], [avg / 2, '[함정] 두 밑변의 평균의 절반이 아니에요.'], [g.BC * g.m / g.n, '비례식을 다시 세워 보세요. EO : BC = AO : AC예요.'], [g.EO + 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 4. 중점연결정리 */
  function midGeo(p, q, r) {
    const tri = triTop(2 * r, 2 * q, 2 * p), A = tri.A, B = tri.B, C = tri.C, D = mid(A, B), E = mid(A, C);
    return { p, q, r, AB: 2 * p, AC: 2 * q, BC: 2 * r, DE: r, per1: p + q + r, per2: 2 * (p + q + r), A, B, C, D, E };
  }
  const midS = {
    id: 'sm4-mid', title: '중점연결정리', short: '중점연결정리',
    question: '삼각형의 두 변 AB, AC의 중점 D, E를 이은 선분 DE는 변 BC와 어떤 관계일까? 길이는 BC의 몇 분의 몇일까?',
    ctl: ['smMp', 'smMq', 'smMr'],
    init: (s) => { s.smMp = 4; s.smMq = 3; s.smMr = 5; },
    gen: (seed) => { const r = seeded('f4' + seed), p = ri(r, 3, 6), q = ri(r, 3, 6), rr = clamp(ri(r, 3, 6), Math.abs(p - q) + 1, p + q - 1), kind = ri(r, 0, 2); return { seed, p, q, r: rr, kind }; },
    model: (s) => ({ ...midGeo(clamp(Math.round(s.smMp), 3, 5), clamp(Math.round(s.smMq), 3, 5), clamp(Math.round(s.smMr), 3, 5)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? midGeo(pk.p, pk.q, pk.r) : M;
      fit(b, bboxOf([g.A, g.B, g.C]), { t: 44, b: 60, l: 84, r: 84 });
      const cen = centroid([g.A, g.B, g.C]), cl = centroid([g.D, g.B, g.C, g.E]);
      fillPoly(b, [g.A, g.D, g.E], 'sky', 0.22); fillPoly(b, [g.D, g.B, g.C, g.E], 'green', 0.08);
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.D, g.E, 'green', 3.8);
      tick(b, g.A, g.D, 1, 'amber'); tick(b, g.D, g.B, 1, 'amber'); tick(b, g.A, g.E, 2, 'amber'); tick(b, g.E, g.C, 2, 'amber');
      if (!prob && (!C.review || st >= 1)) { par(b, g.D, g.E, 1, 'green'); par(b, g.B, g.C, 1, 'green'); }
      if (prob) { par(b, g.D, g.E, 1, 'green'); par(b, g.B, g.C, 1, 'green'); }
      const sz = 16, lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 11 });
      if (prob) {
        if (pk.kind === 0) { lb(g.B, g.C, cen, String(g.BC), 'green'); lb(g.D, g.E, cl, 'x', 'amber', 9); }
        else if (pk.kind === 1) { lb(g.D, g.E, cl, String(g.DE), 'sky', 9); lb(g.B, g.C, cen, 'x', 'amber'); }
        else { dim(b, g.A, g.B, cen, String(g.AB), { color: 'sky', off: 34 }); dim(b, g.A, g.C, cen, String(g.AC), { color: 'sky', off: 34 }); lb(g.B, g.C, cen, String(g.BC), 'green'); T(b, centroid([g.A, g.D, g.E]), '△ADE의 둘레 x', { size: phone(b) ? 12 : 14, color: 'amber', dy: 16 }); }
      } else {
        lb(g.A, g.D, cen, String(g.p), 'sky'); lb(g.D, g.B, cen, String(g.p), 'green'); lb(g.A, g.E, cen, String(g.q), 'sky'); lb(g.E, g.C, cen, String(g.q), 'green'); lb(g.D, g.E, cl, String(g.DE), 'sky', 9); lb(g.B, g.C, cen, String(g.BC), 'green', 11);
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      if (C.txt && !prob) {
        const msg = st >= 3 ? `△ADE의 둘레 ${g.per1} = ${g.per2}의 절반 (△ABC의 둘레 ${g.per2})` : st >= 2 ? `DE = ${g.BC} 의 절반 = ${g.DE}` : st >= 1 ? 'AD : AB = AE : AC = 1 : 2 이고 ∠A 공통 (SAS 닮음)' : '점 D, E는 AB, AC의 중점';
        T(b, pt((g.B.x + g.C.x) / 2, 0), msg, { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `점 D, E가 AB, AC의 중점이므로 $\\overline{AD}:\\overline{AB}=\\overline{AE}:\\overline{AC}=1:2$이고 ∠A는 공통이에요. 따라서 $\\triangle ADE\\sim\\triangle ABC$ (SAS 닮음, 닮음비 $1:2$)예요.`,
      `∠ADE=∠ABC(동위각)이므로 $\\overline{DE}\\parallel\\overline{BC}$이고, $\\overline{DE}:\\overline{BC}=1:2$이므로 $\\overline{DE}=\\dfrac{1}{2}\\overline{BC}=\\dfrac{1}{2}\\times${M.BC}=${M.DE}$예요.`,
      `둘레도 닮음비 $1:2$예요. △ADE의 둘레 $=${M.p}+${M.q}+${M.DE}=${M.per1}$, △ABC의 둘레 $=${M.AB}+${M.AC}+${M.BC}=${M.per2}$ → 넓이의 비는 $1:4$예요.`
    ],
    view: (M) => ({
      guide: '세 막대로 삼각형의 변의 길이를 바꿔 보세요. D, E가 <b>중점</b>이면 DE는 늘 BC와 평행하고 길이는 BC의 <b>절반</b>이에요.',
      readouts: [rd('DE', `${M.DE}`, 'sky', `BC ${M.BC}의 절반`), rd('△ADE의 둘레', `${M.per1}`, 'green', `△ABC의 둘레 ${M.per2}의 절반`), rd('넓이의 비', '△ADE : □DBCE = 1 : 3', 'amber', '△ADE : △ABC = 1 : 4', null, true)],
      formula: `<p>$\\overline{DE}\\parallel\\overline{BC},\\ \\overline{DE}=\\dfrac{1}{2}\\overline{BC}=\\dfrac{1}{2}\\times${M.BC}=${M.DE}$</p>`,
      rule: '삼각형의 두 변의 중점을 연결한 선분은 나머지 변과 평행하고, 그 길이는 나머지 변의 길이의 절반이다',
      notes: notes('중점이 <b>두 개</b> 모두 주어져야 해요. 한 점만 중점이면 쓸 수 없어요.', '넓이는 절반이 아니라 <b>4분의 1</b>이에요 (닮음비 1 : 2의 제곱).')
    }),
    prob: (M) => {
      const pk = M.pk, g = midGeo(pk.p, pk.q, pk.r);
      if (pk.kind === 0) return { tag: '중점연결정리: DE', key: `m0${pk.r}`, stem: '점 D, E가 각각 AB, AC의 중점일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.DE, [[g.BC * 2, '2배를 했어요. DE는 BC의 절반이에요.'], [g.BC, 'BC의 길이예요.'], [g.BC - 1, ''], [g.BC / 4, ''], [g.DE + 1, '']], { pad: 1, valid: (v) => v > 0 }) };
      if (pk.kind === 1) return { tag: '중점연결정리: BC', key: `m1${pk.r}`, stem: '점 D, E가 각각 AB, AC의 중점일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.DE / 2, '절반을 했어요. BC는 DE의 2배예요.'], [g.DE, 'DE의 길이예요.'], [g.DE * 3, ''], [g.DE * 4, ''], [g.BC + 1, '']], { pad: 1 }) };
      return { tag: '중점연결정리: 둘레', key: `m2${pk.p}${pk.q}${pk.r}`, stem: '점 D, E가 각각 AB, AC의 중점일 때, △ADE의 둘레의 길이 $x$를 구하시오. (단위: cm)', choices: mkChoices(g.per1, [[g.per2, '△ABC의 둘레예요. △ADE는 그 절반이에요.'], [g.p + g.q, 'DE가 빠졌어요.'], [g.AB + g.AC + g.DE, ''], [g.per1 + 1, ''], [g.per1 - 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 5. 세 변의 중점을 모두 이으면 */
  function fourGeo(t) {
    const AB = 6 * t, AC = 8 * t, BC = 10 * t, A = pt(0, 0), B = pt(AB, 0), Cc = pt(0, -AC), D = mid(A, B), E = mid(B, Cc), F = mid(Cc, A);
    // 직각이 A, B=(AB,0), C=(0,-AC) → 빗변 BC
    return { t, AB, AC, BC, S: 24 * t * t, s4: 6 * t * t, per: 24 * t, per2: 12 * t, A, B, C: Cc, D, E, F };
  }
  const fourS = {
    id: 'sm4-four', title: '세 변의 중점을 모두 이으면', short: '중점 세 개',
    question: '삼각형의 세 변의 중점을 모두 이으면 작은 삼각형이 4개 생겨. 이 삼각형들은 서로 어떤 관계이고 넓이는 얼마일까?',
    ctl: ['smFu'],
    init: (s) => { s.smFu = 1; },
    gen: (seed) => { const r = seeded('f5' + seed), t = ri(r, 1, 3), kind = ri(r, 0, 1); return { seed, t, kind }; },
    model: (s) => ({ ...fourGeo(clamp(Math.round(s.smFu), 1, 3)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? fourGeo(pk.t) : M;
      fit(b, bboxOf([g.A, g.B, g.C]), { t: 44, b: 96, l: 90, r: 90 });
      const cen = centroid([g.A, g.B, g.C]);
      const cols = ['sky', 'green', 'amber', 'rose'];
      const T4 = [[g.A, g.D, g.F], [g.D, g.B, g.E], [g.F, g.E, g.C], [g.D, g.E, g.F]];
      T4.forEach((Tr, i) => fillPoly(b, Tr, !prob && (!C.review || st >= 2) ? cols[i] : 'sky', 0.2));
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); poly(b, [g.D, g.E, g.F], 'ink', 3);
      ang(b, g.A, g.B, g.C, { color: 'rose', r: 20 });
      tick(b, g.A, g.D, 1, 'amber'); tick(b, g.D, g.B, 1, 'amber'); tick(b, g.B, g.E, 2, 'amber'); tick(b, g.E, g.C, 2, 'amber'); tick(b, g.C, g.F, 3, 'amber'); tick(b, g.F, g.A, 3, 'amber');
      const sz = 16, dm = (p, q, c, v) => dim(b, p, q, c, String(v), { color: 'sky', off: 38, size: sz }), lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 11 });
      if (prob) {
        if (pk.kind === 0) { dm(g.A, g.B, cen, g.AB); dm(g.A, g.C, cen, g.AC); dm(g.B, g.C, cen, g.BC); T(b, centroid([g.D, g.E, g.F]), 'x', { size: 17, color: 'amber' }); T(b, pt(g.B.x / 2, g.A.y), '△DEF의 둘레', { dy: 84, size: phone(b) ? 12 : 14, color: 'amber' }); }
        else { T(b, centroid([g.A, g.D, g.F]), '', {}); T(b, cen, `△ABC의 넓이 ${g.S}`, { size: phone(b) ? 12 : 14, color: 'sky', dx: g.B.x * 0 }); T(b, pt(g.B.x / 2, g.A.y), '△DEF의 넓이 x', { dy: 84, size: phone(b) ? 12 : 14, color: 'amber' }); }
      } else {
        dm(g.A, g.B, cen, g.AB); dm(g.A, g.C, cen, g.AC); dm(g.B, g.C, cen, g.BC);
        if (!C.review || st >= 2) T4.forEach((Tr, i) => T(b, centroid(Tr), String(g.s4), { size: 15, color: cols[i] }));
      }
      [[g.A, 'A', cen], [g.B, 'B', cen], [g.C, 'C', cen], [g.D, 'D', cen], [g.E, 'E', cen], [g.F, 'F', cen]].forEach(([p, nm, c]) => vtx(b, p, c, nm, { size: 17, gap: 12 }));
      if (C.txt && !prob) {
        const msg = st >= 3 ? `넓이 ${g.S} = ${g.s4} × 4  (△DEF = ${g.s4})` : st >= 2 ? '네 삼각형이 서로 합동이에요 (SSS)' : st >= 1 ? 'DE는 AC의 절반, EF는 AB의 절반, FD는 BC의 절반' : '세 변의 중점 D, E, F';
        T(b, pt(g.B.x / 2, g.A.y), msg, { dy: 84, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `중점연결정리에 의해 $\\overline{DE}=\\dfrac{1}{2}\\overline{AC}$, $\\overline{EF}=\\dfrac{1}{2}\\overline{AB}$, $\\overline{FD}=\\dfrac{1}{2}\\overline{BC}$예요. △DEF의 둘레 $=\\dfrac{1}{2}\\times${M.per}=${M.per2}$`,
      '△ADF, △DBE, △FEC, △DEF는 세 변의 길이가 각각 같아서 모두 합동이에요 (SSS 합동). 그래서 같은 색 삼각형은 모양과 크기가 같아요.',
      `합동인 삼각형 4개가 △ABC를 나누므로 넓이는 모두 같아요. △ABC의 넓이 ${M.S}를 4로 나누면 △DEF의 넓이는 ${M.s4}예요.`
    ],
    view: (M) => ({
      guide: '<b>t</b> 막대로 삼각형의 크기를 바꿔 보세요. 세 중점을 이으면 합동인 삼각형 4개가 생기고 각각의 넓이는 전체의 <b>4분의 1</b>이에요.',
      readouts: [rd('△DEF의 둘레', `${M.per2}`, 'green', `△ABC의 둘레 ${M.per}의 절반`), rd('△ABC의 넓이', `${M.S}`, 'sky', `${M.AB} × ${M.AC} ÷ 2`), rd('작은 삼각형 하나의 넓이', `${M.s4}`, 'amber', `${M.S} ÷ 4`)],
      formula: `<p>△DEF의 넓이 $=\\dfrac{1}{4}\\times${M.S}=${M.s4}$</p>`,
      rule: '세 변의 중점을 이어 만든 삼각형은 처음 삼각형과 닮음비 1 : 2, 넓이는 4분의 1이고 모두 합동인 삼각형 4개로 나뉜다',
      notes: notes('둘레는 절반, 넓이는 <b>4분의 1</b>이에요.', '네 삼각형이 모두 합동이라서 넓이가 같아요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = fourGeo(pk.t);
      if (pk.kind === 0) return { tag: '세 중점: 둘레', key: `n0${pk.t}`, stem: '점 D, E, F가 각각 △ABC의 세 변의 중점일 때, △DEF의 둘레의 길이 $x$를 구하시오. (단위: cm)', choices: mkChoices(g.per2, [[g.per, '△ABC의 둘레예요. △DEF는 그 절반이에요.'], [g.per2 / 2, '4분의 1을 했어요. 둘레는 절반이에요.'], [g.per2 + 2, ''], [g.per2 - 2, ''], [g.per2 * 2 + 2, '']], { pad: 2 }) };
      return { tag: '세 중점: 넓이', key: `n1${pk.t}`, stem: '점 D, E, F가 각각 직각삼각형 △ABC의 세 변의 중점일 때, △DEF의 넓이 $x$를 구하시오. (단위: cm²)', choices: mkChoices(g.s4, [[g.S / 2, '절반을 했어요. 넓이는 4분의 1이에요.'], [g.S / 3, ''], [g.S, '△ABC의 넓이예요.'], [g.s4 + pk.t, ''], [g.S / 8, '']], { pad: pk.t }) };
    }
  };
  // 넓이 문제 그림: △ABC 의 넓이는 직각의 두 변으로 알 수 있도록 두 변을 함께 보여 준다
  const fourDraw = fourS.draw;
  fourS.draw = function (b, s, M, C) {
    if (C.problem && M.pk.kind === 1) {
      const g = fourGeo(M.pk.t);
      fit(b, bboxOf([g.A, g.B, g.C]), { t: 44, b: 96, l: 90, r: 90 });
      const cen = centroid([g.A, g.B, g.C]);
      fillPoly(b, [g.D, g.E, g.F], 'amber', 0.24); poly(b, [g.A, g.B, g.C], 'ink', 3.6); poly(b, [g.D, g.E, g.F], 'ink', 3);
      ang(b, g.A, g.B, g.C, { color: 'rose', r: 20 });
      dim(b, g.A, g.B, cen, String(g.AB), { color: 'sky', off: 38 }); dim(b, g.A, g.C, cen, String(g.AC), { color: 'sky', off: 38 });
      tick(b, g.A, g.D, 1); tick(b, g.D, g.B, 1); tick(b, g.B, g.E, 2); tick(b, g.E, g.C, 2); tick(b, g.C, g.F, 3); tick(b, g.F, g.A, 3);
      T(b, centroid([g.D, g.E, g.F]), 'x', { size: 18, color: 'amber' });
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E'], [g.F, 'F']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      return;
    }
    fourDraw(b, s, M, C);
  };

  /* ====================================================================== 6. 사각형의 네 변의 중점 */
  function vGeo(a, bb, th) {
    const O = pt(0, 0), u = pt(1, 0), v = polar(O, 1, -th), A = mul(u, -a * 0.4), Cc = mul(u, a * 0.6), Bb = mul(v, -bb * 0.35), Dd = mul(v, bb * 0.65);
    const E = mid(A, Bb), F = mid(Bb, Cc), Gp = mid(Cc, Dd), H = mid(Dd, A);
    return { a, bb, th, O, A, B: Bb, C: Cc, D: Dd, E, F, Gp, H, per: a + bb };
  }
  const vS = {
    id: 'sm4-vari', title: '사각형의 네 변의 중점', short: '네 변의 중점',
    question: '사각형 ABCD의 네 변의 중점 E, F, G, H를 차례로 이으면 어떤 사각형이 될까? 두 대각선의 길이와 둘레는 어떤 관계일까?',
    ctl: ['smVa', 'smVb', 'smVt'],
    init: (s) => { s.smVa = 8; s.smVb = 6; s.smVt = 70; },
    gen: (seed) => { const r = seeded('f6' + seed), a = 2 * ri(r, 2, 6), bb = 2 * ri(r, 2, 6), th = rpick(r, [60, 70, 80]), kind = ri(r, 0, 1); return { seed, a, bb, th, kind }; },
    model: (s) => ({ ...vGeo(clamp(Math.round(s.smVa), 4, 12), clamp(Math.round(s.smVb), 4, 12), s.smVt) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? vGeo(pk.a, pk.bb, pk.th) : M;
      fit(b, bboxOf([g.A, g.B, g.C, g.D]), { t: 44, b: 80, l: 60, r: 60 });
      const cen = centroid([g.A, g.B, g.C, g.D]);
      fillPoly(b, [g.E, g.F, g.Gp, g.H], 'green', 0.2);
      poly(b, [g.A, g.B, g.C, g.D], 'ink', 3.6); line(b, g.A, g.C, 'ink', 2.6, { dash: [7, 6] }); line(b, g.B, g.D, 'ink', 2.6, { dash: [7, 6] });
      poly(b, [g.E, g.F, g.Gp, g.H], 'green', 3.6);
      [[g.A, g.B], [g.B, g.C], [g.C, g.D], [g.D, g.A]].forEach(([p, q], i) => { tick(b, p, mid(p, q), i + 1, 'amber'); tick(b, mid(p, q), q, i + 1, 'amber'); });
      if (!prob && (!C.review || st >= 2)) { par(b, g.E, g.F, 1, 'green'); par(b, g.H, g.Gp, 1, 'green'); par(b, g.F, g.Gp, 2, 'green'); par(b, g.E, g.H, 2, 'green'); }
      const sz = 16;
      const lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 11 });
      const inLab = (p, q, t, col, dxy) => T(b, mid(p, q), t, { size: sz, color: col, dx: dxy[0], dy: dxy[1] });
      if (prob) {
        inLab(g.A, g.C, String(g.a), 'sky', [14, 14]); inLab(g.B, g.D, pk.kind === 1 ? 'x' : String(g.bb), pk.kind === 1 ? 'amber' : 'sky', [-16, 14]); // kind 1 은 BD 가 구하는 값이라 x 로만 표시
        const yb = Math.max(g.B.y, g.D.y);
        if (pk.kind === 0) T(b, pt(cen.x, yb), '□EFGH의 둘레 x', { size: phone(b) ? 13 : 15, color: 'amber', dy: 42 });
        else T(b, pt(cen.x, yb), `□EFGH의 둘레 ${g.per}`, { size: phone(b) ? 13 : 15, color: 'green', dy: 42 });
      } else {
        inLab(g.A, g.C, `AC = ${g.a}`, 'sky', [18, 16]); inLab(g.B, g.D, `BD = ${g.bb}`, 'sky', [-30, 16]);
        if (!C.review || st >= 2) { lb(g.E, g.F, cen, String(g.a / 2), 'green', 8); lb(g.F, g.Gp, cen, String(g.bb / 2), 'green', 8); }
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      [[g.E, 'E'], [g.F, 'F'], [g.Gp, 'G'], [g.H, 'H']].forEach(([p, nm]) => { b.point(p, { color: 'green', r: 4.4 }); tagOutIn(b, p, cen, nm); });
      if (C.txt && !prob) {
        const msg = st >= 3 ? `□EFGH의 둘레 = ${g.a / 2}+${g.bb / 2}+${g.a / 2}+${g.bb / 2} = ${g.per}` : st >= 2 ? `EF = HG = AC의 절반 = ${g.a / 2},  FG = EH = BD의 절반 = ${g.bb / 2}` : st >= 1 ? '삼각형마다 중점연결정리를 써요' : '네 변의 중점 E, F, G, H를 이었어요';
        T(b, pt(cen.x, Math.max(g.B.y, g.D.y)), msg, { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
        T(b, pt(cen.x, Math.max(g.B.y, g.D.y)), g.th === 90 ? '두 대각선이 수직이면 직사각형이 돼요' : '', { dy: 62, size: 13, color: 'green' });
      }
    },
    steps: (M) => [
      '대각선 AC를 그으면 △ABC에서 E, F가 중점이므로 $\\overline{EF}\\parallel\\overline{AC}$, $\\overline{EF}=\\dfrac{1}{2}\\overline{AC}$예요. △ACD에서도 $\\overline{HG}\\parallel\\overline{AC}$, $\\overline{HG}=\\dfrac{1}{2}\\overline{AC}$예요.',
      `$\\overline{EF}\\parallel\\overline{HG}$이고 $\\overline{EF}=\\overline{HG}=${M.a / 2}$이므로 □EFGH는 <b>평행사변형</b>이에요. 같은 방법으로 $\\overline{FG}=\\overline{EH}=\\dfrac{1}{2}\\overline{BD}=${M.bb / 2}$예요.`,
      `□EFGH의 둘레 $=${M.a / 2}+${M.bb / 2}+${M.a / 2}+${M.bb / 2}=${M.per}$ (두 대각선 길이의 합 $\\overline{AC}+\\overline{BD}=${M.a}+${M.bb}$)`
    ],
    view: (M) => ({
      guide: '<b>대각선 AC, BD의 길이</b>와 <b>두 대각선이 이루는 각</b>을 바꿔 보세요. 어떻게 바꿔도 네 중점을 이으면 <b>평행사변형</b>이고, 각이 90°이면 직사각형이 돼요.',
      readouts: [rd('EF = HG', `${M.a / 2}`, 'sky', `AC ${M.a}의 절반`), rd('FG = EH', `${M.bb / 2}`, 'green', `BD ${M.bb}의 절반`), rd('□EFGH의 둘레', `${M.per}`, 'amber', 'AC + BD')],
      formula: `<p>둘레 $=2\\times\\left(\\dfrac{1}{2}\\overline{AC}+\\dfrac{1}{2}\\overline{BD}\\right)=\\overline{AC}+\\overline{BD}=${M.per}$</p>`,
      rule: '사각형의 네 변의 중점을 차례로 이으면 평행사변형이고, 그 둘레는 두 대각선의 길이의 합이다',
      notes: notes('대각선을 한 개 그으면 두 삼각형에서 중점연결정리를 쓸 수 있어요.', '평행사변형이 되는 이유는 한 쌍의 대변이 평행하고 길이가 같기 때문이에요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = vGeo(pk.a, pk.bb, pk.th);
      if (pk.kind === 0) return { tag: '중점을 이은 사각형의 둘레', key: `v0${pk.a}${pk.bb}`, stem: '사각형 ABCD의 네 변의 중점을 차례로 이은 □EFGH의 둘레의 길이 $x$를 구하시오. (단위: cm)', choices: mkChoices(g.per, [[2 * g.per, '대각선의 합의 2배를 했어요. 둘레는 두 대각선의 합과 같아요.'], [g.per / 2, '절반만 했어요. 네 변을 모두 더해야 해요.'], [g.a * g.bb / 2, ''], [g.per + 2, ''], [g.per - 2, '']], { pad: 2 }) };
      const ans = g.bb;
      return { tag: '중점을 이은 사각형으로 대각선 구하기', key: `v1${pk.a}${pk.bb}`, stem: '사각형 ABCD의 네 변의 중점을 차례로 이은 □EFGH의 둘레가 주어졌을 때, 대각선 BD의 길이 $x$를 구하시오. (단위: cm)', choices: mkChoices(ans, [[g.per - g.a / 2, ''], [g.per - 2 * g.a, ''], [g.per / 2, '둘레의 절반이에요. BD는 둘레에서 AC를 뺀 값이에요.'], [g.per, '둘레 그대로예요.'], [ans + 2, '']], { pad: 2 }) };
    }
  };
  function tagOutIn(b, p, c, nm) { const u = unit(sub(p, c)); T(b, p, nm, { dx: u.x * 14, dy: u.y * 14, size: 16, color: 'green' }); }

  /* ====================================================================== 7. 삼각형 내각의 이등분선 */
  function bisGeo(m, n) {
    const AB = 2 * m, AC = 2 * n, BC = m + n, tri = triTop(BC, AC, AB), A = tri.A, B = tri.B, Cc = tri.C, D = lerp(B, Cc, m / (m + n));
    const u = unit(sub(B, A)), E = sub(A, mul(u, AC)); // BA 의 연장선 위 AE = AC
    return { m, n, AB, AC, BC, BD: m, DC: n, A, B, C: Cc, D, E };
  }
  const bisS = {
    id: 'sm4-bis', title: '삼각형 내각의 이등분선', short: '내각의 이등분선',
    question: '삼각형 ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 하자. D는 BC를 어떤 비로 나눌까?',
    ctl: ['smBm', 'smBn'],
    init: (s) => { s.smBm = 3; s.smBn = 2; },
    gen: (seed) => { const r = seeded('f7' + seed), m = ri(r, 2, 4), n = ri(r, 2, 4), kind = ri(r, 0, 2); return { seed, m: m === n ? (m === 4 ? 3 : m + 1) : m, n, kind }; },
    model: (s) => ({ ...bisGeo(clamp(Math.round(s.smBm), 2, 4), clamp(Math.round(s.smBn), 2, 4)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? bisGeo(pk.m, pk.n) : M;
      fit(b, bboxOf(prob && !(C.solution && C.solStep >= 2) ? [g.A, g.B, g.C] : [g.A, g.B, g.C, g.E]), { t: 44, b: 86, l: 56, r: 56 });
      const cen = centroid([g.A, g.B, g.C]);
      fillPoly(b, [g.A, g.B, g.D], 'sky', 0.2); fillPoly(b, [g.A, g.D, g.C], 'green', 0.15);
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.A, g.D, 'amber', 3.6);
      ang(b, g.A, g.B, g.D, { color: 'rose', rings: 1, r: 24 }); ang(b, g.A, g.D, g.C, { color: 'rose', rings: 1, r: 24 });
      if (!prob && C.review && st >= 2) { line(b, g.E, g.A, 'violet', 3, { dash: [6, 5] }); line(b, g.E, g.C, 'violet', 3, { dash: [6, 5] }); b.point(g.E, { color: 'violet', r: 4.4 }); T(b, g.E, 'E', { dy: -14, dx: -8, size: 17, color: 'violet' }); }
      const sz = 16, lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 11 });
      if (prob) {
        const k = pk.kind;
        lb(g.A, g.B, cen, String(g.AB), 'sky'); lb(g.A, g.C, cen, String(g.AC), 'green');
        if (k === 0) { dim(b, g.B, g.C, cen, `BC = ${g.BC}`, { color: 'ink', off: 46, size: 16 }); T(b, mid(g.B, g.D), 'x', { dy: 20, size: 17, color: 'amber' }); }
        else if (k === 1) { lb(g.B, g.D, cen, String(g.BD), 'sky'); T(b, mid(g.D, g.C), 'x', { dy: 20, size: 17, color: 'amber' }); }
        else { /* kind 2 는 아래 draw 보정에서 그립니다 */ }
      } else {
        lb(g.A, g.B, cen, String(g.AB), 'sky'); lb(g.A, g.C, cen, String(g.AC), 'green');
        T(b, mid(g.B, g.D), String(g.BD), { dy: 20, size: 16, color: 'sky' }); T(b, mid(g.D, g.C), String(g.DC), { dy: 20, size: 16, color: 'green' });
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      b.point(g.D, { color: 'amber', r: 5 }); T(b, g.D, 'D', { dy: -17, dx: 8, size: 17 });
      if (C.txt && !prob) {
        const msg = st >= 3 ? `AB : AC = BD : DC = ${g.AB} : ${g.AC} = ${g.BD} : ${g.DC}` : st >= 2 ? '점 C를 지나 AD에 평행한 선을 그으면 AE = AC 인 이등변삼각형' : st >= 1 ? '∠BAD = ∠DAC (같은 표시)' : '∠A의 이등분선 AD';
        T(b, pt((g.B.x + g.C.x) / 2, 0), msg, { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      '∠A의 이등분선 AD이므로 $\\angle BAD=\\angle DAC$예요. 점 C를 지나 AD에 평행한 선을 긋고 BA의 연장선과 만나는 점을 E라 해요.',
      '평행선의 동위각·엇각에서 $\\angle AEC=\\angle ACE$가 되어 △ACE는 이등변삼각형이에요. 그래서 $\\overline{AE}=\\overline{AC}$예요.',
      `△BCE에서 $\\overline{AD}\\parallel\\overline{EC}$이므로 $\\overline{BA}:\\overline{AE}=\\overline{BD}:\\overline{DC}$예요. 따라서 $\\overline{AB}:\\overline{AC}=\\overline{BD}:\\overline{DC}$ → $${M.AB}:${M.AC}=${M.BD}:${M.DC}$`
    ],
    view: (M) => ({
      guide: '<b>m, n</b> 막대로 AB, AC의 길이를 바꿔 보세요. 각의 이등분선은 BC를 <b>AB : AC</b>의 비로 나눠요. 정리 탭에서 보조선(보라색)을 확인해 보세요.',
      readouts: [rd('AB : AC', `${M.AB} : ${M.AC}`, 'sky', `= ${M.m} : ${M.n}`), rd('BD : DC', `${M.BD} : ${M.DC}`, 'green', `= ${M.m} : ${M.n}`), rd('BC', `${M.BC}`, 'amber', 'BD + DC')],
      formula: `<p>$\\overline{AB}:\\overline{AC}=\\overline{BD}:\\overline{DC}$ → $${M.AB}:${M.AC}=${M.BD}:${M.DC}$</p>`,
      rule: '삼각형의 한 내각의 이등분선은 대변을 두 변의 길이의 비 AB : AC 로 나눈다',
      notes: notes('<b>[함정]</b> BD : DC는 AB : AC와 같아요. AB : BC나 AD가 아니에요.', '이등분선의 길이 AD와는 상관이 없어요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = bisGeo(pk.m, pk.n);
      if (pk.kind === 0) return { tag: '내각의 이등분선: BD', key: `b0${pk.m}${pk.n}`, stem: 'AD가 ∠A의 이등분선일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BD, [[g.BC * g.AC / (g.AB + g.AC), '대응이 뒤바뀌었어요. BD는 AB 쪽이에요.'], [g.BC / 2, '이등분선이라고 BC를 반으로 나누지 않아요.'], [g.AB, ''], [g.BD + 1, ''], [g.BD - 1, '']], { pad: 1 }) };
      if (pk.kind === 1) return { tag: '내각의 이등분선: DC', key: `b1${pk.m}${pk.n}`, stem: 'AD가 ∠A의 이등분선일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.DC, [[g.BD * g.AB / g.AC, '비례식의 위치가 뒤바뀌었어요. BD : DC = AB : AC예요.'], [g.AC - g.AB + g.BD, ''], [g.BD, 'BD의 길이예요.'], [g.DC + 1, ''], [g.DC - 1, '']], { pad: 1 }) };
      return { tag: '내각의 이등분선: BD : DC', key: `b2${pk.m}${pk.n}`, stem: 'AD가 ∠A의 이등분선일 때, BD : DC를 가장 간단한 자연수의 비로 나타내시오.', choices: G.mkRatioChoices([pk.m / gcd(pk.m, pk.n), pk.n / gcd(pk.m, pk.n)], [[[pk.n / gcd(pk.m, pk.n), pk.m / gcd(pk.m, pk.n)], '순서가 뒤바뀌었어요. BD는 AB 쪽이에요.'], [[pk.m * pk.m / gcd(pk.m, pk.n) ** 2, pk.n * pk.n / gcd(pk.m, pk.n) ** 2], '제곱은 넓이의 비예요.']]) };
    }
  };
  // kind 2 문제는 BC 를 주지 않는 대신 AB, AC 만 주고 BD : DC 를 묻는다(그림에서 BD, DC 는 표시하지 않는다)
  const bisDraw = bisS.draw;
  bisS.draw = function (b, s, M, C) {
    if (C.problem && M.pk.kind === 2) {
      const g = bisGeo(M.pk.m, M.pk.n), cen = centroid([g.A, g.B, g.C]);
      fit(b, bboxOf(C.solution && C.solStep >= 2 ? [g.A, g.B, g.C, g.E] : [g.A, g.B, g.C]), { t: 44, b: 56, l: 56, r: 56 });
      fillPoly(b, [g.A, g.B, g.D], 'sky', 0.2); fillPoly(b, [g.A, g.D, g.C], 'green', 0.15);
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.A, g.D, 'amber', 3.6);
      ang(b, g.A, g.B, g.D, { color: 'rose', rings: 1, r: 24 }); ang(b, g.A, g.D, g.C, { color: 'rose', rings: 1, r: 24 });
      sideTag(b, g.A, g.B, cen, String(g.AB), { color: 'sky' }); sideTag(b, g.A, g.C, cen, String(g.AC), { color: 'green' });
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      b.point(g.D, { color: 'amber', r: 5 }); T(b, g.D, 'D', { dy: -17, dx: 8, size: 17 });
      return;
    }
    bisDraw(b, s, M, C);
  };

  /* ====================================================================== 8. 삼각형 외각의 이등분선 */
  function bisxGeo(n, g0) {
    const m = n + g0, AB = m + 0, AC = n, BC = 2 * g0, tri = triTop(BC, AC, AB), A = tri.A, B = tri.B, Cc = tri.C;
    const D = add(B, mul(sub(Cc, B), m / (m - n))); // BD : BC = m : (m-n) → BD = 2m, CD = 2n
    const E = add(A, mul(unit(sub(A, B)), AC * 1.0)); // BA 의 연장선 위
    return { m, n, g0, AB, AC, BC, BD: 2 * m, CD: 2 * n, A, B, C: Cc, D, E };
  }
  const bisxS = {
    id: 'sm4-bisx', title: '삼각형 외각의 이등분선', short: '외각의 이등분선',
    question: '삼각형 ABC의 ∠A의 외각의 이등분선이 변 BC의 연장선과 만나는 점을 D라 하자. D는 어디에 놓이고, BD와 CD의 비는 얼마일까?',
    ctl: ['smBx', 'smBg'],
    init: (s) => { s.smBx = 2; s.smBg = 1; },
    gen: (seed) => { const r = seeded('f8' + seed), n = ri(r, 2, 3), g0 = ri(r, 1, 3), kind = ri(r, 0, 1); return { seed, n, g0, kind }; },
    model: (s) => ({ ...bisxGeo(clamp(Math.round(s.smBx), 2, 3), clamp(Math.round(s.smBg), 1, 3)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? bisxGeo(pk.n, pk.g0) : M;
      fit(b, bboxOf([g.A, g.B, g.C, g.D, g.E]), { t: 44, b: 56, l: 50, r: 50 });
      const cen = centroid([g.A, g.B, g.C]);
      fillPoly(b, [g.A, g.B, g.C], 'sky', 0.16);
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.C, g.D, 'ink', 3.6); line(b, g.A, g.D, 'amber', 3.6); line(b, g.B, g.E, 'ink', 3.0, { dash: [7, 6], alpha: 0.9 }); T(b, g.E, 'E', { dy: -16, color: 'ink' });
      ang(b, g.A, g.C, g.D, { color: 'rose', rings: 1, r: 26 }); ang(b, g.A, g.D, g.E, { color: 'rose', rings: 1, r: 26 });
      const sz = 16, lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 11 });
      if (prob) {
        lb(g.A, g.B, cen, String(g.AB), 'sky'); lb(g.A, g.C, cen, String(g.AC), 'green'); lb(g.B, g.C, cen, String(g.BC), 'ink');
        if (pk.kind === 0) T(b, mid(g.C, g.D), 'x', { dy: 20, size: 18, color: 'amber' }); else { dim(b, g.B, g.D, pt(cen.x, cen.y - 5), 'x', { color: 'amber', off: 30, size: 18 }); } // BD 를 구하는 문제: 풀이 중간값 CD 는 그리지 않는다
      } else {
        lb(g.A, g.B, cen, String(g.AB), 'sky'); lb(g.A, g.C, cen, String(g.AC), 'green'); lb(g.B, g.C, cen, String(g.BC), 'ink');
        T(b, mid(g.C, g.D), String(g.CD), { dy: 20, size: 16, color: 'green' });
        if (!C.review || st >= 3) dim(b, g.B, g.D, pt(cen.x, cen.y - 5), `BD = ${g.BD}`, { color: 'sky', off: 30, size: 16 });
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      b.point(g.D, { color: 'amber', r: 5 }); T(b, g.D, 'D', { dy: 18, size: 17 });
      if (C.txt && !prob) {
        const msg = st >= 3 ? `AB : AC = BD : CD = ${g.AB} : ${g.AC} = ${g.BD} : ${g.CD}` : st >= 2 ? '점 D는 BC의 연장선 위 (AB가 더 길 때 C쪽 바깥)' : st >= 1 ? '외각을 이등분: ∠CAD = ∠DAE' : '∠A의 외각의 이등분선 AD';
        T(b, pt((g.B.x + g.D.x) / 2, 0), msg, { dy: 88, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      '∠A의 외각(∠CAE, E는 BA의 연장선 위의 점)을 이등분하는 선이 AD예요. $\\angle CAD=\\angle DAE$ (같은 표시)',
      `외각의 이등분선도 변 BC를 두 변의 길이의 비로 나눠요. 단, 점 D는 BC의 <b>연장선</b> 위에 있어요. $\\overline{AB}:\\overline{AC}=\\overline{BD}:\\overline{CD}$`,
      `$${M.AB}:${M.AC}=\\overline{BD}:${M.CD}$ → $\\overline{BD}=${M.BD}$. BD = BC + CD이므로 $\\overline{BC}=${M.BD}-${M.CD}=${M.BC}$`
    ],
    view: (M) => ({
      guide: '<b>AC의 단위</b>와 <b>AB−AC</b> 막대로 삼각형을 바꿔 보세요. 외각의 이등분선은 BC의 <b>연장선</b> 위의 점 D에서 만나요. BD : CD가 AB : AC가 되는 것을 확인해요.',
      readouts: [rd('AB : AC', `${M.AB} : ${M.AC}`, 'sky', `= ${M.m} : ${M.n}`), rd('BD : CD', `${M.BD} : ${M.CD}`, 'green', `= ${M.m} : ${M.n}`), rd('BC', `${M.BC}`, 'amber', 'BD − CD')],
      formula: `<p>$\\overline{AB}:\\overline{AC}=\\overline{BD}:\\overline{CD}$ → $${M.AB}:${M.AC}=${M.BD}:${M.CD}$</p>`,
      rule: '삼각형의 한 외각의 이등분선은 대변의 연장선과 만나고, BD : CD = AB : AC 이다',
      notes: notes('<b>[함정]</b> D는 BC 위가 아니라 <b>연장선</b> 위에 있어서 BC = BD − CD예요(합이 아니라 차).', '내각이면 BD : DC, 외각이면 BD : CD로 쓰고 BC와의 관계도 달라요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = bisxGeo(pk.n, pk.g0);
      if (pk.kind === 0) return { tag: '외각의 이등분선: CD', key: `x0${pk.n}${pk.g0}`, stem: 'AD가 ∠A의 외각의 이등분선일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.CD, [[g.BC * g.AC / (g.AB + g.AC), '내각의 이등분선처럼 BC를 나눴어요. 점 D는 BC의 연장선 위예요.'], [g.BC * g.AB / (g.AB + g.AC), ''], [g.BC, 'BC의 길이예요.'], [g.CD + 1, ''], [g.CD - 1, '']], { pad: 1 }) };
      return { tag: '외각의 이등분선: BD', key: `x1${pk.n}${pk.g0}`, stem: 'AD가 ∠A의 외각의 이등분선일 때, 점 B에서 점 D까지의 거리 $x$를 구하시오. (단위: cm)', choices: mkChoices(g.BD, [[g.CD, 'CD의 길이예요.'], [g.BC + g.CD * g.AB / g.AC - g.CD, ''], [g.BC + g.CD + 1, ''], [g.CD * g.AB / g.AC + 1, ''], [g.BD - 1, '']], { pad: 1 }) };
    }
  };

  G.geo = Object.assign(G.geo || {}, { lineGeo, xGeo, efGeo, midGeo, fourGeo, vGeo, bisGeo, bisxGeo });
  G.register(40, 't4', '④ 삼각형과 평행선', '삼각형과 평행선', PARAMS, [nest1, xS, efS, midS, fourS, vS, bisS, bisxS]);
})();
