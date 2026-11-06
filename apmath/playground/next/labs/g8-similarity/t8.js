/* ==========================================================================
   중2 · 도형의 닮음 — 탭 ⑧ 「심화 · 무게중심」 (t8.js, order 80) — 장면 4개
   2022 개정 중2에 포함되는지 확정되지 않아 별도 탭으로 둡니다(실제 기출 79문항).
   · s8-1 무게중심이 중선을 2 : 1로 나누는 이유 · △GED ∽ △GBA (닮음비 1 : 2), 제자리에서 돌려 포개기
   · s8-2 세 중선이 나누는 넓이 6등분      · 여섯 삼각형의 넓이가 모두 같아요
   · s8-3 두 무게중심 G, G′ 사이의 거리     · GG′ = BC의 3분의 1
   · s8-4 연속하는 무게중심의 넓이          · △G′BD = △ABC의 18분의 1
   값은 모두 정수이고, 글자·표시·정답은 지금의 슬라이더 값으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SM;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, mid, lerp, polar, rotP, unit, centroid, seeded, ri, rpick, T, sideTag, dim, ang, tick, par, fillPoly, line, poly, fit, P, rd, notes, mkChoices, gcd, fmtN, bboxOf, unionBox, phone, capSize, frT, vtx, inter, polyArea, shiftPts, textW } = G;

  const PARAMS = {
    smGt: P('AD의 3분의 1 (t)', 1, 4, 1, 2, { color: 'sky', format: (v) => `AD = ${3 * v}` }),
    smGs: P('BE의 3분의 1 (s)', 1, 4, 1, 2, { color: 'green', format: (v) => `BE = ${3 * v}` }),
    smGa: P('두 중선이 이루는 각', 60, 120, 10, 90, { color: 'rose', format: (v) => v + '°' }),
    smGr: P('회전해서 포개기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 작은 삼각형이 점 G를 중심으로 제자리에서 반 바퀴 돌아 큰 삼각형과 대응변의 방향이 나란해져요', format: (v) => (v >= 0.999 ? '포개짐' : Math.round(v * 100) + '%') }),
    smGu: P('작은 삼각형 하나의 넓이 σ', 1, 8, 1, 3, { color: 'amber', format: (v) => `${v}` }),
    smGk: P('BC의 길이 (6의 배수)', 1, 5, 1, 2, { color: 'sky', format: (v) => `${6 * v} cm` }),
    smGc: P('넓이의 단위 σ', 1, 3, 1, 1, { color: 'amber', format: (v) => `${v}` })
  };

  /* ====================================================================== 1. 무게중심이 중선을 2 : 1로 나누는 이유 */
  function cpGeo(t, s, th) {
    const Gp = pt(0, 0), A = polar(Gp, 2 * t, -100), B = polar(Gp, 2 * s, -100 + th), C = pt(-A.x - B.x, -A.y - B.y);
    return { t, s, th, G: Gp, A, B, C, D: mid(B, C), E: mid(A, C), AG: 2 * t, GD: t, BG: 2 * s, GE: s, AD: 3 * t, BE: 3 * s };
  }
  const cp = {
    id: 'sm8-proof', title: '무게중심이 중선을 2 : 1로 나누는 이유', short: '2 : 1의 이유',
    question: '삼각형의 세 중선은 한 점 G에서 만나고, G는 각 중선을 꼭짓점 쪽에서 2 : 1로 나눠. 왜 2 : 1일까? 닮은 삼각형으로 확인해 보자.',
    ctl: ['smGt', 'smGs', 'smGa', 'smGr'], anim: { key: 'smGr', dur: 4, label: '돌려서 포개 보기', start: 0 },
    stepT: (n) => (n >= 3 ? 1 : 0),
    init: (s) => { s.smGt = 2; s.smGs = 2; s.smGa = 90; s.smGr = 0; },
    gen: (seed) => { const r = seeded('j1' + seed), t = ri(r, 1, 4), s = ri(r, 1, 4), th = rpick(r, [70, 80, 90, 100, 110]), kind = ri(r, 0, 2); return { seed, t, s, th, kind }; },
    model: (s) => { const t = clamp(Math.round(s.smGt), 1, 4), q = clamp(Math.round(s.smGs), 1, 4); return { ...cpGeo(t, q, clamp(s.smGa, 60, 120)), rot: s.smGr || 0 }; },
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? cpGeo(pk.t, pk.s, pk.th) : M;
      const tri = bboxOf([g.A, g.B, g.C]), W = tri.x1 - tri.x0, off = W + 1.8;
      const withCopy = !prob;
      fit(b, withCopy ? { x0: tri.x0, x1: tri.x1 + off + 0.2, y0: tri.y0, y1: tri.y1 } : tri, { t: 44, b: 86, l: 52, r: 52 });
      const cen = centroid([g.A, g.B, g.C]);
      fillPoly(b, [g.G, g.E, g.D], 'sky', 0.26); fillPoly(b, [g.G, g.B, g.A], 'green', 0.14);
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.A, g.D, 'ink', 3.2); line(b, g.B, g.E, 'ink', 3.2); line(b, g.E, g.D, 'amber', 3.6, { dash: [7, 5] });
      tick(b, g.A, g.E, 1, 'amber'); tick(b, g.E, g.C, 1, 'amber'); tick(b, g.B, g.D, 2, 'amber'); tick(b, g.D, g.C, 2, 'amber');
      if (!prob && (!C.review || st >= 2)) { ang(b, g.E, g.G, g.D, { color: 'rose', rings: 1, r: 20 }); ang(b, g.B, g.G, g.A, { color: 'rose', rings: 1, r: 20 }); ang(b, g.D, g.G, g.E, { color: 'violet', rings: 2, r: 20 }); ang(b, g.A, g.G, g.B, { color: 'violet', rings: 2, r: 20 }); }
      const sz = 16, tg = (p, q, t, col, c) => t != null && sideTag(b, p, q, c || cen, t, { color: col, size: sz, gap: 9 });
      const cG = g.G;
      if (prob) {
        const k = pk.kind;
        if (k === 0) { dim(b, g.A, g.D, pt(g.G.x - 30, g.G.y), String(g.AD), { color: 'sky', off: 30, size: 16 }); T(b, lerp(g.G, g.D, 0.5), 'x', { dx: 12, dy: 10, size: 18, color: 'amber' }); }
        else if (k === 1) { T(b, lerp(g.B, g.G, 0.5), String(g.BG), { dx: -14, dy: 8, size: 16, color: 'sky' }); T(b, lerp(g.G, g.E, 0.5), 'x', { dx: -12, dy: 10, size: 18, color: 'amber' }); }
        else { T(b, lerp(g.A, g.G, 0.5), String(g.AG), { dx: -14, dy: -4, size: 16, color: 'sky' }); T(b, lerp(g.G, g.D, 0.5), 'x', { dx: 12, dy: 10, size: 18, color: 'amber' }); }
      } else {
        T(b, lerp(g.A, g.G, 0.5), String(g.AG), { dx: -14, size: 16, color: 'green' }); T(b, lerp(g.G, g.D, 0.5), String(g.GD), { dx: 14, dy: 4, size: 16, color: 'sky' });
        T(b, lerp(g.B, g.G, 0.5), String(g.BG), { dy: -15, size: 16, color: 'green' }); T(b, lerp(g.G, g.E, 0.5), String(g.GE), { dy: 16, size: 16, color: 'sky' });
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      b.point(g.G, { color: 'amber', r: 5.4 }); T(b, g.G, 'G', { dx: -14, dy: -13, size: 17, color: 'amber' });
      if (withCopy) {
        // 오른쪽 복사본(가로로만 옮김): 큰 삼각형 GBA 와 작은 삼각형 GED (G 를 중심으로 제자리에서 돌려 포개기)
        const sh = (p) => pt(p.x + off, p.y), rot = 180 * (C.t >= 0 ? C.t : 0);
        const G2 = sh(g.G), A2 = sh(g.A), B2 = sh(g.B), E2 = rotP(sh(g.E), G2, rot), D2 = rotP(sh(g.D), G2, rot);
        fillPoly(b, [G2, B2, A2], 'green', 0.14); poly(b, [G2, B2, A2], 'green', 3.4);
        fillPoly(b, [G2, E2, D2], 'sky', 0.3); poly(b, [G2, E2, D2], 'sky', 3.4);
        b.point(G2, { color: 'amber', r: 4.8 }); T(b, G2, 'G', { dx: 16, dy: 18, size: 16, color: 'amber' });
        [[A2, 'A'], [B2, 'B']].forEach(([p, nm]) => tagOut2(b, p, G2, nm));
        G.tagOut(b, E2, G2, 'E', { size: 16, gap: 12, color: 'sky' });
        G.tagOut(b, D2, G2, 'D', { size: 16, gap: 12, color: 'sky' });
        if (C.t >= 0.999) { par(b, E2, D2, 1, 'amber'); par(b, B2, A2, 1, 'amber'); }
        T(b, pt(G2.x, tri.y1), '△GBA와 △GED (G를 중심으로 반 바퀴 돌린 모양)', { dy: 68, size: phone(b) ? 12 : 14, color: 'amber' });
      }
      if (C.txt && !prob) {
        const msg = st >= 3 ? `GD : GA = GE : GB = 1 : 2` : st >= 2 ? '△GED ∽ △GBA (닮음비 1 : 2)' : st >= 1 ? 'DE ∥ AB, DE는 AB의 절반 (중점연결정리)' : '두 중선 AD, BE가 만나는 점 G';
        T(b, pt(tri.x0 + W / 2, tri.y1), msg, { dy: 40, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      '점 D, E는 BC, AC의 중점이므로 중점연결정리에 의해 $\\overline{DE}\\parallel\\overline{AB}$이고 $\\overline{DE}=\\dfrac{1}{2}\\overline{AB}$예요.',
      'DE ∥ AB이므로 엇각이 같고 맞꼭지각도 같아서 $\\triangle GED\\sim\\triangle GBA$ (AA 닮음)이에요. 닮음비는 $\\overline{DE}:\\overline{AB}=1:2$예요. (작은 삼각형을 G를 중심으로 반 바퀴 돌리면 대응변의 방향이 나란해져요)',
      `대응변: $\\overline{GD}:\\overline{GA}=\\overline{GE}:\\overline{GB}=1:2$ → $\\overline{GD}=${M.GD}$, $\\overline{GA}=${M.AG}$이므로 $\\overline{AG}:\\overline{GD}=2:1$, $\\overline{BG}:\\overline{GE}=${M.BG}:${M.GE}=2:1$예요.`
    ],
    view: (M) => ({
      guide: '<b>t, s</b>로 두 중선의 길이를, <b>각</b>으로 모양을 바꿔 보세요. 무게중심 G는 항상 각 중선을 꼭짓점 쪽에서 <b>2 : 1</b>로 나눠요. ▶를 누르면 작은 삼각형이 G를 중심으로 제자리에서 돌아 큰 삼각형과 대응변의 방향이 나란해져요.',
      readouts: [rd('AG : GD', `${M.AG} : ${M.GD}`, 'green', '= 2 : 1'), rd('BG : GE', `${M.BG} : ${M.GE}`, 'sky', '= 2 : 1'), rd('중선 AD, BE', `${M.AD}, ${M.BE}`, 'amber')],
      formula: `<p>$\\overline{AG}=\\dfrac{2}{3}\\overline{AD}=\\dfrac{2}{3}\\times${M.AD}=${M.AG}$, $\\overline{GD}=\\dfrac{1}{3}\\overline{AD}=${M.GD}$</p>`,
      rule: '삼각형의 무게중심은 세 중선의 교점이고, 각 중선을 꼭짓점으로부터 2 : 1로 나눈다',
      notes: notes('2가 꼭짓점 쪽, 1이 변의 중점 쪽이에요.', '중선 전체의 길이가 주어지면 3등분해서 2칸, 1칸으로 나누면 돼요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = cpGeo(pk.t, pk.s, pk.th);
      if (pk.kind === 0) return { tag: '무게중심: GD', key: `p0${pk.t}${pk.s}`, stem: '점 G가 △ABC의 무게중심일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.GD, [[g.AG, 'AG의 길이예요. GD는 그 절반이에요.'], [g.AD / 2, '중선의 절반이 아니에요. 3등분 중 1칸이에요.'], [g.AD - g.AG + 1, ''], [g.GD + 1, ''], [g.GD - 1, '']], { pad: 1 }) };
      if (pk.kind === 1) return { tag: '무게중심: GE', key: `p1${pk.t}${pk.s}`, stem: '점 G가 △ABC의 무게중심일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.GE, [[g.BG * 2, 'BG의 2배예요. GE는 BG의 절반이에요.'], [g.BG, 'BG의 길이예요.'], [g.BG - g.GE + 1, ''], [g.GE + 1, ''], [g.GE + 2, '']], { pad: 1 }) };
      return { tag: '무게중심: 2 : 1', key: `p2${pk.t}${pk.s}`, stem: '점 G가 △ABC의 무게중심일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.GD, [[g.AG * 2, 'AG의 2배예요. GD는 AG의 절반이에요.'], [g.AG, 'AG의 길이예요.'], [g.AG + 1, ''], [g.GD + 1, ''], [g.GD - 1, '']], { pad: 1 }) };
    }
  };
  const tagOut2 = (b, p, c, nm) => { const u = unit(sub(p, c)); T(b, p, nm, { dx: u.x * 14, dy: u.y * 14, size: 16 }); };

  /* ====================================================================== 공용: 모양을 끌어 바꾸는 삼각형 */
  const defA = pt(1, -5);
  function dragA(b, s, g, C) {
    if (C.review || !C.txt || C.problem) return;
    b.handle('hA', g.A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 끌기(모양 바꾸기)', drag: (w) => { s.smGax = clamp(Math.round(w.x * 2) / 2, -3, 5); s.smGay = clamp(Math.round(-w.y * 2) / 2, 3, 7); } });
  }
  const triOf = (s, prob, dy = 5) => { const ax = prob || s.smGax == null ? 1 : s.smGax, ay = prob || s.smGay == null ? dy : s.smGay; return { A: pt(ax, -ay), B: pt(-3, 0), C: pt(5, 0) }; };

  /* ====================================================================== 2. 세 중선이 나누는 넓이 6등분 */
  function sixGeo(s, prob, u) {
    const t = triOf(s, prob), A = t.A, B = t.B, Cc = t.C, D = mid(B, Cc), E = mid(Cc, A), F = mid(A, B), Gp = pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3);
    return { A, B, C: Cc, D, E, F, G: Gp, u, S: 6 * u };
  }
  const six = {
    id: 'sm8-six', title: '세 중선이 나누는 넓이 6등분', short: '넓이 6등분',
    question: '삼각형의 세 중선을 모두 그으면 삼각형이 6개로 나뉘어. 이 여섯 삼각형의 넓이는 서로 어떤 관계일까?',
    ctl: ['smGu'],
    init: (s) => { s.smGu = 3; s.smGax = 1; s.smGay = 5; },
    gen: (seed) => { const r = seeded('j2' + seed), u = ri(r, 1, 8), kind = ri(r, 0, 2); return { seed, u, kind }; },
    model: (s) => ({ u: clamp(Math.round(s.smGu), 1, 8), S: 6 * clamp(Math.round(s.smGu), 1, 8) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = sixGeo(s, prob, prob ? pk.u : M.u);
      fit(b, bboxOf([g.A, g.B, g.C]), { t: 44, b: 84, l: 54, r: 54 });
      const cen = centroid([g.A, g.B, g.C]);
      const T6 = [[g.A, g.F, g.G], [g.F, g.B, g.G], [g.B, g.D, g.G], [g.D, g.C, g.G], [g.C, g.E, g.G], [g.E, g.A, g.G]];
      T6.forEach((Tr, i) => fillPoly(b, Tr, !prob && (!C.review || st >= 3) ? (i % 2 ? 'green' : 'sky') : 'sky', 0.22));
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.A, g.D, 'ink', 3); line(b, g.B, g.E, 'ink', 3); line(b, g.C, g.F, 'ink', 3);
      tick(b, g.B, g.D, 1, 'amber'); tick(b, g.D, g.C, 1, 'amber'); tick(b, g.C, g.E, 2, 'amber'); tick(b, g.E, g.A, 2, 'amber'); tick(b, g.A, g.F, 3, 'amber'); tick(b, g.F, g.B, 3, 'amber');
      const sz = 15;
      if (prob) {
        const k = pk.kind, u = pk.u;
        if (k === 0) { T(b, pt((g.B.x + g.C.x) / 2, 0), `△ABC의 넓이 ${6 * u}`, { size: phone(b) ? 13 : 15, color: 'sky', dy: 50 }); T(b, centroid(T6[2]), 'x', { size: 18, color: 'amber' }); }
        else if (k === 1) { T(b, centroid(T6[2]), String(u), { size: 17, color: 'sky' }); T(b, pt((g.B.x + g.C.x) / 2, 0), '△ABC의 넓이 x', { size: phone(b) ? 13 : 15, color: 'amber', dy: 50 }); }
        else { T(b, pt((g.B.x + g.C.x) / 2, 0), `△ABC의 넓이 ${6 * u}`, { size: phone(b) ? 13 : 15, color: 'sky', dy: 50 }); fillPoly(b, [g.A, g.F, g.G, g.E], 'amber', 0.16); T(b, centroid([g.A, g.F, g.G, g.E]), 'x', { size: 18, color: 'amber' }); }
        if (k === 2) { /* 사각형 AFGE 의 넓이 */ }
      } else if (!C.review || st >= 3) T6.forEach((Tr, i) => T(b, centroid(Tr), String(M.u), { size: sz, color: i % 2 ? 'green' : 'sky' }));
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E'], [g.F, 'F']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      b.point(g.G, { color: 'amber', r: 5 }); T(b, g.G, 'G', { dx: 11, dy: 13, size: 15, color: 'amber' });
      dragA(b, s, g, C);
      if (C.txt && !prob) {
        const msg = st >= 3 ? `여섯 삼각형의 넓이가 모두 ${M.u}  (△ABC = ${M.S})` : st >= 2 ? `△GBC = △GCA = △GAB = ${M.S / 3}` : st >= 1 ? `중선은 넓이를 이등분: △ABD = △ADC = ${M.S / 2}` : '세 중선이 만나는 점 G';
        T(b, pt((g.B.x + g.C.x) / 2, 0), msg, { dy: 58, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `중선 AD는 BC를 이등분하고 높이가 같으므로 $\\triangle ABD=\\triangle ADC=\\dfrac{1}{2}\\triangle ABC=${M.S / 2}$예요. 다른 중선도 마찬가지로 삼각형의 넓이를 이등분해요.`,
      `$\\overline{AG}:\\overline{GD}=2:1$이므로 $\\triangle GAB=2\\times\\triangle GBD$이고, $\\triangle GBD=\\triangle GDC$(밑변이 같고 높이가 같음)이에요. 그래서 $\\triangle GBC=\\triangle GCA=\\triangle GAB=\\dfrac{1}{3}\\triangle ABC=${M.S / 3}$예요.`,
      `각 변의 중점으로 반씩 나뉘므로 여섯 삼각형의 넓이는 모두 $\\dfrac{1}{6}\\triangle ABC=${M.S}\\div6=${M.u}$로 같아요.`
    ],
    view: (M) => ({
      guide: '<b>σ</b> 막대로 삼각형 한 조각의 넓이를 바꾸고, <b>노란 점 A를 끌어</b> 삼각형의 모양을 바꿔 보세요. 모양이 달라져도 <b>여섯 조각의 넓이는 늘 같아요</b>.',
      readouts: [rd('작은 삼각형 하나', `${M.u}`, 'amber'), rd('△ABC의 넓이', `${M.S}`, 'sky', `${M.u} × 6`), rd('△GBC (세 개 중 하나)', `${M.S / 3}`, 'green', `${M.u} × 2`)],
      formula: `<p>$\\triangle ABC=6\\times${M.u}=${M.S}$, $\\triangle GAB=\\dfrac{1}{3}\\triangle ABC=${M.S / 3}$</p>`,
      rule: '삼각형의 세 중선은 넓이를 6등분한다 (여섯 삼각형의 넓이가 모두 같다)',
      notes: notes('G가 만드는 큰 삼각형 세 개(GAB, GBC, GCA)의 넓이는 각각 전체의 <b>3분의 1</b>이에요.', '모양을 바꿔도 6등분은 변하지 않아요.')
    }),
    prob: (M) => {
      const pk = M.pk, u = pk.u, S = 6 * u;
      if (pk.kind === 0) return { tag: '무게중심: 넓이 6등분', key: `x0${u}`, stem: '점 G가 △ABC의 무게중심일 때, △GBD의 넓이 $x$를 구하시오. (단위: cm²)', choices: mkChoices(u, [[S / 3, '△GBC의 넓이예요. △GBD는 그 절반이에요.'], [S / 2, '△ABD의 넓이예요.'], [S / 4, '4등분이 아니라 6등분이에요.'], [u + 1, ''], [S / 6 + 2, '']], { pad: 1 }) };
      if (pk.kind === 1) return { tag: '무게중심: 전체 넓이', key: `x1${u}`, stem: '점 G가 △ABC의 무게중심일 때, △ABC의 넓이 $x$를 구하시오. (단위: cm²)', choices: mkChoices(S, [[u * 3, '3등분이 아니라 6등분이에요.'], [u * 4, ''], [u * 2, ''], [u * 9, ''], [S + u, '']], { pad: u }) };
      return { tag: '무게중심: 사각형의 넓이', key: `x2${u}`, stem: '점 G가 △ABC의 무게중심이고 점 D, E, F가 각 변의 중점일 때, 사각형 AFGE의 넓이 $x$를 구하시오. (단위: cm²)', choices: mkChoices(2 * u, [[u, '삼각형 하나의 넓이예요. 사각형은 두 개예요.'], [3 * u, ''], [S / 3 - 1 === 2 * u ? 4 * u : 4 * u, ''], [S / 2, ''], [2 * u + 1, '']], { pad: 1 }) };
    }
  };
  // The queried region already receives one x label in six.draw.

  /* ====================================================================== 3. GG′ = BC의 3분의 1 */
  function ggGeo(s, prob, k) {
    const BC = 6 * k, B = pt(0, 0), Cc = pt(BC, 0);
    const fx = prob || s.smGgx == null ? 0.3 : s.smGgx, fy = prob || s.smGgy == null ? 0.75 : s.smGgy, A2 = pt(fx * BC, -fy * BC), A = A2;
    const D = mid(B, Cc), P1 = mid(B, D), Q1 = mid(D, Cc), M1 = mid(A2, B), N1 = mid(A2, Cc);
    const Gp = pt((A2.x + B.x + D.x) / 3, (A2.y + B.y + D.y) / 3), Gq = pt((A2.x + D.x + Cc.x) / 3, (A2.y + D.y + Cc.y) / 3);
    return { k, A: A2, B, C: Cc, D, P: P1, Q: Q1, M: M1, N: N1, G: Gp, Gq, BC, GGq: 2 * k, PQ: 3 * k };
  }
  const gg = {
    id: 'sm8-gg', title: '두 무게중심 사이의 거리 GG′', short: 'GG′ 구하기',
    question: '△ABC의 변 BC의 중점 D에 대하여 점 G, G′가 각각 △ABD, △ADC의 무게중심일 때, 선분 GG′의 길이는 BC의 몇 분의 몇일까?',
    ctl: ['smGk'],
    init: (s) => { s.smGk = 2; s.smGax = 1; s.smGay = 5; },
    gen: (seed) => { const r = seeded('j3' + seed), k = ri(r, 1, 5), kind = ri(r, 0, 1); return { seed, k, kind }; },
    model: (s) => ({ k: clamp(Math.round(s.smGk), 1, 5), BC: 6 * clamp(Math.round(s.smGk), 1, 5), GGq: 2 * clamp(Math.round(s.smGk), 1, 5), PQ: 3 * clamp(Math.round(s.smGk), 1, 5) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = ggGeo(s, prob, prob ? pk.k : M.k);
      fit(b, bboxOf([g.A, g.B, g.C]), { t: 44, b: prob ? 80 : 148, l: 54, r: 54 });
      const cen = centroid([g.A, g.B, g.C]);
      fillPoly(b, [g.A, g.B, g.D], 'sky', 0.14); fillPoly(b, [g.A, g.D, g.C], 'green', 0.12);
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.A, g.D, 'ink', 3);
      line(b, g.A, g.P, 'sky', 2.6); line(b, g.D, g.M, 'sky', 2.6); line(b, g.A, g.Q, 'green', 2.6); line(b, g.D, g.N, 'green', 2.6);
      tick(b, g.B, g.P, 1, 'amber'); tick(b, g.P, g.D, 1, 'amber'); tick(b, g.D, g.Q, 2, 'amber'); tick(b, g.Q, g.C, 2, 'amber');
      line(b, g.G, g.Gq, 'amber', 4.4);
      if (!prob && (!C.review || st >= 2)) { line(b, g.A, g.G, 'amber', 3); }
      const sz = 16;
      if (prob) {
        dim(b, g.B, g.C, cen, pk.kind === 0 ? String(g.BC) : 'x', { color: pk.kind === 0 ? 'sky' : 'amber', off: 30, size: 17 });
        T(b, mid(g.G, g.Gq), pk.kind === 0 ? 'x' : String(g.GGq), { dy: -15, size: 17, color: pk.kind === 0 ? 'amber' : 'sky' });
      } else {
        dim(b, g.B, g.C, cen, `BC = ${g.BC}`, { color: 'sky', off: 30, size: 16 });
        T(b, mid(g.G, g.Gq), !C.review || st >= 3 ? `GG′ = ${g.GGq}` : 'GG′', { dy: -15, size: 16, color: 'amber' });
        if (!C.review || st >= 2) dim(b, g.P, g.Q, cen, `PQ = ${g.PQ}`, { color: 'green', off: 78, size: 15 });
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      [[g.D, 'D', 'ink'], [g.P, 'P', 'sky'], [g.Q, 'Q', 'green']].forEach(([p, nm, col]) => { b.point(p, { color: col, r: 4.4 }); T(b, p, nm, { dy: -14, size: 15, color: col }); });
      b.point(g.G, { color: 'amber', r: 5 }); T(b, g.G, 'G', { dx: -14, dy: -4, size: 16, color: 'amber' }); b.point(g.Gq, { color: 'amber', r: 5 }); T(b, g.Gq, 'G′', { dx: 15, dy: -4, size: 16, color: 'amber' });
      if (!C.review && C.txt && !prob) b.handle('hA', g.A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 끌기(모양 바꾸기)', drag: (w) => { s.smGgx = clamp(w.x / g.BC, 0.1, 0.9); s.smGgy = clamp(-w.y / g.BC, 0.4, 1.0); } });
      if (C.txt && !prob) {
        const msg = st >= 3 ? `GG′ = ${g.PQ} × 2 ÷ 3 = ${g.GGq}  (BC의 3분의 1)` : st >= 2 ? `PQ = BC의 절반 = ${g.PQ}` : st >= 1 ? 'G는 AP를, G′는 AQ를 2 : 1로 나눠요' : 'D는 BC의 중점, P, Q는 BD, DC의 중점';
        T(b, pt((g.B.x + g.C.x) / 2, 0), msg, { dy: 126, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `점 P, Q를 BD, DC의 중점이라 하면 G는 △ABD의 무게중심이므로 $\\overline{AG}:\\overline{GP}=2:1$, G′는 △ADC의 무게중심이므로 $\\overline{AG^{\\prime}}:\\overline{G^{\\prime}Q}=2:1$이에요.`,
      `$\\overline{PQ}=\\overline{PD}+\\overline{DQ}=\\dfrac{1}{2}\\overline{BD}+\\dfrac{1}{2}\\overline{DC}=\\dfrac{1}{2}\\overline{BC}=\\dfrac{1}{2}\\times${M.BC}=${M.PQ}$예요.`,
      `$\\overline{AG}:\\overline{AP}=\\overline{AG^{\\prime}}:\\overline{AQ}=2:3$이므로 $\\triangle AGG^{\\prime}\\sim\\triangle APQ$ (닮음비 $2:3$)이고 $\\overline{GG^{\\prime}}=\\dfrac{2}{3}\\overline{PQ}=\\dfrac{2}{3}\\times${M.PQ}=${M.GGq}$, 곧 $\\overline{GG^{\\prime}}=\\dfrac{1}{3}\\overline{BC}$예요.`
    ],
    view: (M) => ({
      guide: '<b>BC의 길이</b>를 바꾸고 <b>노란 점 A를 끌어</b> 모양도 바꿔 보세요. 어떻게 바꿔도 두 무게중심 사이의 거리 GG′는 <b>BC의 3분의 1</b>이에요.',
      readouts: [rd('BC', `${M.BC}`, 'sky'), rd('PQ (BC의 절반)', `${M.PQ}`, 'green'), rd('GG′ (BC의 3분의 1)', `${M.GGq}`, 'amber', `${M.BC} ÷ 3`)],
      formula: `<p>$\\overline{GG^{\\prime}}=\\dfrac{1}{3}\\overline{BC}=\\dfrac{1}{3}\\times${M.BC}=${M.GGq}$</p>`,
      rule: '점 G, G′가 각각 △ABD, △ADC의 무게중심이면 GG′ ∥ BC 이고 GG′ = BC의 3분의 1',
      notes: notes('D가 BC 위의 <b>어떤 점이어도</b> 두 삼각형 ABD, ADC의 무게중심 사이의 거리는 BC의 3분의 1이에요.', '무게중심은 중선을 2 : 1로 나눈다는 것에서 출발해요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = ggGeo({}, true, pk.k);
      if (pk.kind === 0) return { tag: '두 무게중심 사이의 거리', key: `g0${pk.k}`, stem: '점 D는 BC의 중점이고, 점 G, G′는 각각 △ABD, △ADC의 무게중심이다. $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.GGq, [[g.PQ, 'PQ의 길이예요. GG′는 그 3분의 2예요.'], [g.BC / 2, 'BC의 절반이에요. 3분의 1이에요.'], [g.BC / 6 + 1, ''], [g.GGq + 1, ''], [g.GGq - 1, '']], { pad: 1 }) };
      return { tag: '두 무게중심 사이의 거리로 BC', key: `g1${pk.k}`, stem: '점 D는 BC의 중점이고, 점 G, G′는 각각 △ABD, △ADC의 무게중심이다. $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.GGq * 2, 'GG′의 2배예요. BC는 GG′의 3배예요.'], [g.GGq * 4, ''], [g.GGq * 3 / 2, ''], [g.BC + 1, ''], [g.BC - 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 4. 연속하는 무게중심의 넓이 */
  function chGeo(s, prob, c) {
    const t = triOf(s, prob, 7), A = t.A, B = t.B, Cc = t.C, D = mid(B, Cc), Gp = pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3), Gq = pt((Gp.x + B.x + Cc.x) / 3, (Gp.y + B.y + Cc.y) / 3);
    return { A, B, C: Cc, D, G: Gp, Gq, c, S: 18 * c, S3: 6 * c, S9: 2 * c, S18: c };
  }
  const ch = {
    id: 'sm8-chain', title: '연속하는 무게중심과 넓이', short: '연속 무게중심',
    question: '점 G는 △ABC의 무게중심이고, 점 G′는 △GBC의 무게중심이야. D가 BC의 중점일 때 △G′BD의 넓이는 △ABC의 몇 분의 몇일까?',
    ctl: ['smGc'],
    init: (s) => { s.smGc = 1; s.smGax = 1; s.smGay = 7; },
    gen: (seed) => { const r = seeded('j4' + seed), c = ri(r, 1, 4), kind = ri(r, 0, 1); return { seed, c, kind }; },
    model: (s) => { const c = clamp(Math.round(s.smGc), 1, 3); return { c, S: 18 * c, S3: 6 * c, S9: 2 * c, S18: c }; },
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = chGeo(s, prob, prob ? pk.c : M.c);
      fit(b, bboxOf([g.A, g.B, g.C]), { t: 44, b: 84, l: 54, r: 54 });
      const cen = centroid([g.A, g.B, g.C]);
      const show3 = prob || !C.review || st >= 1, show9 = !prob && (!C.review || st >= 2), show18 = prob || !C.review || st >= 3;
      fillPoly(b, [g.G, g.B, g.C], 'sky', show3 && !prob ? 0.2 : 0.1); if (show9) fillPoly(b, [g.Gq, g.B, g.C], 'green', 0.22);
      if (show18) fillPoly(b, [g.Gq, g.B, g.D], 'amber', 0.16);
      poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.A, g.D, 'ink', 3); line(b, g.G, g.B, 'ink', 2.4); line(b, g.G, g.C, 'ink', 2.4); line(b, g.Gq, g.B, 'green', 2.4); line(b, g.Gq, g.C, 'green', 2.4);
      tick(b, g.B, g.D, 1, 'amber'); tick(b, g.D, g.C, 1, 'amber');
      const sz = 15;
      if (prob) {
        if (pk.kind === 0) { T(b, pt((g.B.x + g.C.x) / 2, 0), `△ABC의 넓이 ${18 * pk.c}`, { size: phone(b) ? 13 : 15, color: 'sky', dy: 54 }); T(b, centroid([g.Gq, g.B, g.D]), 'x', { size: 17, color: 'amber', dy: 3 }); }
        else { T(b, centroid([g.Gq, g.B, g.D]), String(pk.c), { size: 16, color: 'amber', dy: 3 }); T(b, pt((g.B.x + g.C.x) / 2, 0), '△ABC의 넓이 x', { size: phone(b) ? 13 : 15, color: 'amber', dy: 54 }); }
      } else {
        const sd = (p, t, col, size, dy, dir) => T(b, p, t, { size, color: col, dx: dir * (textW(t, size) / 2 + 12), dy });
        const fz = phone(b) ? 12 : 14;
        sd(lerp(g.A, g.G, 0.6), `△ABC = ${M.S}`, 'sky', fz + 1, 0, -1);
        if (show3) sd(g.G, `△GBC = ${M.S3}`, 'sky', fz, -12, -1);
        if (show9) sd(g.Gq, `△G′BC = ${M.S9}`, 'green', fz, -12, 1);
        if (show18) T(b, centroid([g.Gq, g.B, g.D]), `${M.S18}`, { size: 15, color: 'amber', dx: -8, dy: 3 });
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      b.point(g.D, { color: 'ink', r: 4.2 }); T(b, g.D, 'D', { dy: 17, size: 17 });
      b.point(g.G, { color: 'sky', r: 5 }); T(b, g.G, 'G', { dx: 14, dy: 10, size: 16, color: 'sky' }); b.point(g.Gq, { color: 'green', r: 5 }); T(b, g.Gq, 'G′', { dx: -16, dy: 12, size: 16, color: 'green' });
      dragA(b, s, g, C);
      if (C.txt && !prob) {
        const msg = st >= 3 ? `△G′BD = △G′BC ÷ 2 = ${M.S9} ÷ 2 = ${M.S18}  (△ABC의 18분의 1)` : st >= 2 ? `△G′BC = △GBC ÷ 3 = ${M.S3} ÷ 3 = ${M.S9}` : st >= 1 ? `△GBC = △ABC ÷ 3 = ${M.S3}` : '△ABC → G → △GBC → G′';
        T(b, pt((g.B.x + g.C.x) / 2, 0), msg, { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `G는 △ABC의 무게중심이므로 $\\triangle GBC=\\dfrac{1}{3}\\triangle ABC=\\dfrac{1}{3}\\times${M.S}=${M.S3}$예요.`,
      `G′는 △GBC의 무게중심이므로 $\\triangle G^{\\prime}BC=\\dfrac{1}{3}\\triangle GBC=\\dfrac{1}{3}\\times${M.S3}=${M.S9}$예요.`,
      `D는 BC의 중점이므로 $\\triangle G^{\\prime}BD=\\dfrac{1}{2}\\triangle G^{\\prime}BC=\\dfrac{1}{2}\\times${M.S9}=${M.S18}$, 곧 $\\triangle ABC$의 $\\dfrac{1}{18}$이에요.`
    ],
    view: (M) => ({
      guide: '<b>σ</b> 막대로 넓이의 단위를 바꾸고, <b>노란 점 A를 끌어</b> 모양을 바꿔 보세요. 무게중심을 두 번 거치면 넓이는 <b>3분의 1, 다시 3분의 1, 그리고 반</b>이 돼요.',
      readouts: [rd('△GBC', `${M.S3}`, 'sky', '△ABC의 3분의 1'), rd('△G′BC', `${M.S9}`, 'green', '△GBC의 3분의 1'), rd('△G′BD', `${M.S18}`, 'amber', '△ABC의 18분의 1')],
      formula: `<p>$\\triangle G^{\\prime}BD=\\dfrac{1}{3}\\times\\dfrac{1}{3}\\times\\dfrac{1}{2}\\times\\triangle ABC=\\dfrac{1}{18}\\times${M.S}=${M.S18}$</p>`,
      rule: '무게중심이 이루는 삼각형의 넓이는 3분의 1씩 줄고, 중점으로 나누면 다시 절반이 된다 (△G′BD = △ABC의 18분의 1)',
      notes: notes('G′는 △ABC가 아니라 <b>△GBC</b>의 무게중심이에요. 기준이 되는 삼각형을 바꿔 가며 생각해요.', '마지막에 BC의 중점 D로 <b>절반</b>이 되는 것을 잊지 마세요.')
    }),
    prob: (M) => {
      const pk = M.pk, c = pk.c;
      if (pk.kind === 0) return { tag: '연속 무게중심: 넓이', key: `y0${c}`, stem: '점 G는 △ABC의 무게중심, 점 G′는 △GBC의 무게중심이고 점 D는 BC의 중점일 때, △G′BD의 넓이 $x$를 구하시오. (단위: cm²)', choices: mkChoices(c, [[c * 2, '△G′BC의 넓이예요. △G′BD는 그 절반이에요.'], [c * 3, '△G′BD는 △ABC의 18분의 1이에요.'], [c * 6, '△GBC의 넓이예요.'], [c * 4, ''], [c + 1, '']], { pad: 1 }) };
      return { tag: '연속 무게중심: 전체 넓이', key: `y1${c}`, stem: '점 G는 △ABC의 무게중심, 점 G′는 △GBC의 무게중심이고 점 D는 BC의 중점일 때, △ABC의 넓이 $x$를 구하시오. (단위: cm²)', choices: mkChoices(18 * c, [[9 * c, '9분의 1이 아니라 18분의 1이에요.'], [12 * c, ''], [6 * c, ''], [27 * c, ''], [18 * c + c, '']], { pad: c }) };
    }
  };

  G.geo = Object.assign(G.geo || {}, { cpGeo, sixGeo, ggGeo, chGeo });
  G.register(80, 't8', '⑧ 심화 · 무게중심', '심화 · 무게중심', PARAMS, [cp, six, gg, ch]);
})();
