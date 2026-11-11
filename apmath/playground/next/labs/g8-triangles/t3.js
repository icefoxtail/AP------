/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ③ 「직각삼각형의 합동」 (t3.js, order 30) — 장면 7개
   · r1 RHA 합동        · 빗변+한 예각 → 합동 (둘째 삼각형을 가로로 밀어 포개기)
   · r2 RHS 합동        · 빗변+한 직각변 → 합동, 붙여서 이등변삼각형 만들기
   · r3 합동 판별       · 조건을 고르면 두 직각삼각형이 포개어지는지, 아닌지(반례) 확인
   · r4 사다리꼴 속 직각삼각형 · ●+×=90°, △EAB≡△BCD
   · r5 직각이등변삼각형의 꼭짓점을 지나는 직선 · △ABD≡△CAE, DE=BD+CE
   · r6 연 모양(빗변 공유) · △ABC≡△ADC (RHS), AC는 각의 이등분선
   · r7 합동과 넓이      · 사다리꼴 BDEC에서 △ABC의 넓이
   피타고라스 정리(√)는 쓰지 않아요. 길이와 각은 정수만 보여 줍니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { DEG, clamp, ease, pt, add, sub, mul, unit, mid, dist, angBetween, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, numProb, mkStmtChoices, degOpts, cmOpts, rd, notes, fmtN, dg, bboxOf, fs, dim, solveCap } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG), tan = (d) => Math.tan(d * DEG);
  const S = (n) => `$\\overline{${n}}$`;
  const fr = (n, d) => `\\frac{${n}}{${d}}`;

  const PARAMS = {
    trRc: P('빗변 AB = DE', 4, 12, 1, 8, { color: 'sky', format: (v) => v + ' cm' }),
    trRa: P('∠A = ∠D', 20, 70, 2, 40, { color: 'amber', format: (v) => v + '°' }),
    trRt: P('△DEF 포개기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 △DEF가 왼쪽으로 가로로 밀려와요', format: (v) => Math.round(v * 100) + '%' }),
    trSc: P('△DEF의 빗변 DE', 4, 12, 1, 6, { color: 'rose', format: (v) => v + ' cm' }),
    trSa: P('△DEF의 ∠D', 20, 70, 2, 56, { color: 'rose', format: (v) => v + '°' }),
    trSb: P('△ABC의 ∠A', 20, 70, 2, 40, { color: 'amber', format: (v) => v + '°' }),
    trQa: P('AE', 3, 9, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    trQb: P('AB', 3, 9, 1, 3, { color: 'green', format: (v) => v + ' cm' }),
    trLm: P('BD', 2, 8, 1, 3, { color: 'sky', format: (v) => v + ' cm' }),
    trLn: P('CE', 2, 8, 1, 5, { color: 'green', format: (v) => v + ' cm' }),
    trKm: P('AB = AD', 4, 10, 1, 6, { color: 'sky', format: (v) => v + ' cm' }),
    trKa: P('∠BAC', 20, 70, 2, 40, { color: 'amber', format: (v) => v + '°' }),
    trKt: P('△ADC 접기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르면 AC를 따라 아래쪽 삼각형이 접혀 올라와요', format: (v) => Math.round(v * 100) + '%' }),
    trUm: P('BD', 2, 8, 1, 4, { color: 'sky', format: (v) => v + ' cm' }),
    trUe: P('CE − BD', 0, 6, 2, 2, { color: 'green', format: (v) => v + ' cm' })
  };

  // 직각삼각형: 직각 C=(ox,0), A 왼쪽 아래(−c·cosα), B 위(−c·sinα), 빗변 c, ∠A=α
  const rtri = (c, al, ox = 0) => ({ A: pt(ox - c * cos(al), 0), B: pt(ox, -c * sin(al)), C: pt(ox, 0) });

  /* ====================================================================== 1. RHA */
  const r1 = {
    id: 't3-1', title: 'RHA 합동', short: 'RHA 합동',
    question: '두 직각삼각형에서 빗변의 길이와 한 예각의 크기가 각각 같으면 합동일까?',
    ctl: ['trRc', 'trRa', 'trRt'], anim: { key: 'trRt', dur: 4, label: '△DEF 밀어 포개기', start: 0 },
    init: (s) => { s.trRc = 8; s.trRa = 40; s.trRt = 0; s.trV = 0; s.trM = 7; },
    reroll: (s) => { s.trRa = pick([30, 36, 40, 50, 56, 60], s.trRa); s.trM = rint(3, 9); s.trV = (s.trV + 1) % 2; },
    model: (s) => ({ c: clamp(Math.round(s.trRc), 4, 12), a: clamp(Math.round(s.trRa / 2) * 2, 20, 70), m: s.trM || 7 }),
    draw(b, s, M, C) {
      const { c, a, m } = M, st = C.step, v = (s.trV || 0) % 2;
      const t1 = C.problem ? 0 : C.review ? (st >= 4 ? 1 : 0) : (s.trRt || 0);
      const w = c * cos(a), gap = w * 0.45 + 0.8, k = 1 / c;
      const T1 = rtri(1, a, 0), off = (w * k + gap * k) * 1 + 0.0;
      const dx0 = off + 1 * cos(a) * 0 + 0.0;
      const D0 = off * 1;
      const x2 = D0 * (1 - ease(t1)); // 오른쪽 삼각형의 직각 위치
      const T2 = rtri(1, a, cos(a) + 0.35 + x2 * 1 + (1 - ease(t1)) * 0 );
      // T2 의 직각 꼭짓점이 T1 의 직각 꼭짓점과 겹치도록 x2 계산
      const gapX = cos(a) * 0.5 + 0.3, right = (px) => rtri(1, a, px);
      const px = (1 - ease(t1)) * (cos(a) + gapX);
      const U = right(px);
      fit(b, bboxOf([T1.A, T1.B, T1.C, right(cos(a) + gapX).C, right(cos(a) + gapX).B]), { t: 52, b: C.problem ? 50 : 92, l: 44, r: 44 });
      const cen1 = pt(T1.A.x * 0.4, T1.B.y * 0.4), cen2 = pt(U.A.x * 0.4 + U.C.x * 0.6, U.B.y * 0.4);
      const f1 = C.problem ? 0.1 : 0.1;
      fillPoly(b, [T1.A, T1.B, T1.C], 'sky', f1); poly(b, [T1.A, T1.B, T1.C], 'ink', 3.4);
      fillPoly(b, [U.A, U.B, U.C], 'green', t1 > 0.99 ? 0.25 : 0.1); poly(b, [U.A, U.B, U.C], t1 > 0.99 ? 'green' : 'ink', 3.4, { dash: t1 > 0.01 && t1 < 0.99 ? [7, 5] : undefined });
      const show = (n) => (C.problem ? true : C.review ? st >= n : true);
      [[T1, ['A', 'B', 'C']], [U, ['D', 'E', 'F']]].forEach(([Tr, nm], ti) => {
        const cc = ti ? cen2 : cen1;
        if (show(1)) ang(b, Tr.C, Tr.A, Tr.B, { color: 'sky', r: 20 });
        if (show(2)) tick(b, Tr.A, Tr.B, 1, 'amber');
        if (show(3) || C.problem) ang(b, Tr.A, Tr.B, Tr.C, { color: 'amber', r: 30, rings: 2, label: C.problem && ti === 0 && v === 1 ? dg(a) : C.problem ? '' : dg(a), size: 15, labelDist: 52 });
        [Tr.A, Tr.B, Tr.C].forEach((p) => b.point(p, { color: 'ink', r: 4 }));
        if (!(ti === 1 && t1 > 0.99)) { tagOut(b, Tr.A, cc, nm[0], { size: 17 }); tagOut(b, Tr.B, cc, nm[1], { size: 17 }); tagOut(b, Tr.C, cc, nm[2], { size: 17 }); }
      });
      if (!C.problem && (show(2))) { G.sideTag(b, T1.A, T1.B, pt(T1.C.x, 0.3), `${c} cm`, { color: 'amber', size: fs(b, 16), gap: 6 }); G.sideTag(b, U.A, U.B, pt(U.C.x, 0.3), `${c} cm`, { color: 'amber', size: fs(b, 16), gap: 6 }); }
      if (C.problem) {
        if (v === 0) G.sideTag(b, T1.B, T1.C, cen1, `${m} cm`, { color: 'sky', size: fs(b, 16), gap: 6 });
        G.sideTag(b, U.B, U.C, cen2, v === 0 ? 'x' : '', { color: 'amber', size: fs(b, 18), gap: 6 });
        if (v === 1) ang(b, U.B, U.A, U.C, { color: 'amber', r: 32, label: 'x', size: 17, labelDist: 50 });
      }
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '∠C=∠F=90° (Right angle)';
        else if (C.review && st === 2) { row = `AB=DE=${c} cm (Hypotenuse)`; col = 'amber'; }
        else if (C.review && st === 3) { row = `∠A=∠D=${a}° (Angle)`; col = 'amber'; }
        else if (t1 > 0.99 || (C.review && st >= 4)) { row = '완전히 포개어져요 → △ABC≡△DEF (RHA)'; col = 'green'; }
        else row = `직각 · 빗변 ${c} cm · 예각 ${a}° → 합동`;
        rowT(b, pt((T1.A.x + U.C.x) / 2 * 0.5 + 0.0, 0), row, { dy: b.W < 560 ? 40 : 50, size: fs(b, 16), color: col, dx: 0 });
      }
      void dx0; void T2; void gap; void k;
    },
    stepT: (n) => (n >= 4 ? 1 : 0),
    steps: (M) => [
      `두 삼각형에서 $\\angle C=\\angle F=90^{\\circ}$ (직각, Right angle)`,
      `빗변의 길이가 같아요: $\\overline{AB}=\\overline{DE}=${M.c}$ cm (빗변, Hypotenuse)`,
      `한 예각의 크기가 같아요: $\\angle A=\\angle D=${M.a}^{\\circ}$ (예각, Angle)`,
      `직각삼각형에서 빗변의 길이와 한 예각의 크기가 각각 같으므로 △ABC≡△DEF (RHA 합동)이에요. 그래서 $\\angle B=\\angle E=${90 - M.a}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>빗변</b>과 <b>예각</b>을 바꿔 보세요. 두 삼각형의 직각·빗변·한 예각이 같게 만들어 둔 상태에서 ▶를 누르면 △DEF가 <b>가로로 밀려와</b> △ABC와 완전히 포개어져요.',
      readouts: [rd('빗변 AB = DE', `${M.c} cm`, 'amber'), rd('∠A = ∠D', `${M.a}°`, 'amber'), rd('∠B = ∠E', `${90 - M.a}°`, 'sky', '90° − 예각', null, true)],
      formula: `<p>R: $\\angle C=\\angle F=90^{\\circ}$, H: $\\overline{AB}=\\overline{DE}$, A: $\\angle A=\\angle D$</p><p>$\\Rightarrow\\ \\triangle ABC\\equiv\\triangle DEF$ (RHA)</p>`,
      rule: '두 직각삼각형에서 빗변의 길이와 한 예각의 크기가 각각 같으면 두 삼각형은 합동이다. (RHA 합동)',
      notes: notes('같아야 하는 것은 <b>빗변</b>과 <b>한 예각</b>이에요. 직각변과 예각이 같아도 되지만, 이 경우는 ASA 합동이에요.', '예각 두 개만 같으면 합동이 아니에요. 크기가 달라질 수 있어요.')
    }),
    prob: (M, s) => {
      const { a, m } = M, v = (s.trV || 0) % 2;
      if (v === 0) return numProb({ tag: 'RHA 합동 · 대응변', key: `0:${m}:${a}`, stem: `그림과 같은 두 직각삼각형 ABC, DEF에서 $\\angle C=\\angle F=90^{\\circ}$, ${S('AB')}=${S('DE')}, $\\angle A=\\angle D$이다. ${S('BC')}=${m} cm일 때, ${S('EF')}의 길이 $x$는?`, correct: m, wrongs: [[m + 1, 'RHA 합동이므로 대응변의 길이는 같아요.'], [m - 1, 'RHA 합동이므로 대응변의 길이는 같아요.'], [m * 2, '두 배가 아니에요. 합동이면 대응변의 길이가 같아요.'], [m + 2, '다시 생각해 보세요.'], [m - 2, '다시 생각해 보세요.']], ...cmOpts });
      return numProb({ tag: 'RHA 합동 · 대응각', key: `1:${a}`, stem: `그림과 같은 두 직각삼각형 ABC, DEF에서 $\\angle C=\\angle F=90^{\\circ}$, ${S('AB')}=${S('DE')}, $\\angle A=\\angle D=${a}^{\\circ}$이다. $\\angle E$의 크기 $x$는?`, correct: 90 - a, wrongs: [[a, '∠D의 크기예요. ∠E는 ∠B의 대응각이에요.'], [180 - a, '다시 생각해 보세요.'], [90, '직각이에요.'], [90 - a + 10, '다시 계산해 보세요.'], [90 - a - 10, '다시 계산해 보세요.']], ...degOpts(5) });
    },
    verify: (s) => { const M = r1.model(s), T1 = rtri(1, M.a); return { ans: angBetween(T1.B, T1.A, T1.C) + angBetween(T1.A, T1.B, T1.C), model: 90 }; }
  };

  /* ====================================================================== 2. RHS */
  const r2 = {
    id: 't3-2', title: 'RHS 합동으로 이등변삼각형 만들기', short: 'RHS 합동',
    question: '빗변의 길이와 다른 한 변의 길이가 같은 두 직각삼각형을 붙이면 어떤 삼각형이 될까?',
    ctl: ['trKm', 'trKa'],
    init: (s) => { s.trKm = 8; s.trKa = 40; s.trV = 0; s.trM = 4; },
    reroll: (s) => { s.trKa = pick([30, 36, 40, 50, 54, 60], s.trKa); s.trM = rint(3, 8); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const l = clamp(Math.round(s.trKm), 4, 10), bt = clamp(Math.round(s.trKa / 2) * 2, 20, 70); return { l, bt, ad: 90 - bt, m: s.trM || 4 }; },
    draw(b, s, M, C) {
      const { l, bt, ad, m } = M, st = C.step, v = (s.trV || 0) % 3;
      const hw = cos(bt), h = sin(bt); // 빗변 AB=AC=1, ∠B=∠C=bt
      const A = pt(0, -h), B = pt(-hw, 0), Cc = pt(hw, 0), D = pt(0, 0);
      fit(b, { x0: -hw - 0.05, x1: hw + 0.05, y0: -h - 0.05, y1: 0.05 }, { t: 48, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const cen = pt(0, -h * 0.4), show = (n) => (C.problem ? false : C.review ? st >= n : true);
      fillPoly(b, [A, B, D], 'sky', 0.14); fillPoly(b, [A, D, Cc], 'violet', 0.14);
      poly(b, [A, B, Cc], 'ink', 3.6); line(b, A, D, 'green', 3.4);
      if (C.problem) {
        tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber'); ang(b, D, B, A, { color: 'sky', r: 20 });
        if (v === 0) { G.sideTag(b, B, D, pt(0, -2), `${m} cm`, { color: 'sky', size: fs(b, 17), gap: 10, dy: 0 }); dim(b, B, Cc, cen, 'x', { color: 'amber', size: fs(b, 18), off: 30 }); }
        else if (v === 1) { ang(b, A, B, Cc, { color: 'sky', r: 30, label: dg(2 * ad), size: 16, labelDist: 52 }); ang(b, B, A, Cc, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 50 }); }
        else { ang(b, B, A, Cc, { color: 'sky', r: 30, label: dg(bt), size: 16, labelDist: 50 }); ang(b, A, Cc, D, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 56 }); }
      } else {
        if (show(1)) { ang(b, D, B, A, { color: 'sky', r: 20 }); ang(b, D, Cc, A, { color: 'sky', r: 20 }); }
        if (show(2)) { tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber'); }
        if (show(3)) line(b, A, D, 'green', 4.4);
        if (show(4)) { tick(b, B, D, 2, 'rose'); tick(b, D, Cc, 2, 'rose'); ang(b, B, Cc, A, { color: 'green', r: 30, rings: 2, label: dg(bt), size: 15, labelDist: 52 }); ang(b, Cc, A, B, { color: 'green', r: 30, rings: 2, label: dg(bt), size: 15, labelDist: 52 }); }
        if (show(2)) { G.sideTag(b, A, B, cen, `${l} cm`, { color: 'amber', size: fs(b, 15), gap: 6 }); G.sideTag(b, A, Cc, cen, `${l} cm`, { color: 'amber', size: fs(b, 15), gap: 6 }); }
      }
      [A, B, Cc, D].forEach((p) => b.point(p, { color: p === D ? 'green' : 'ink', r: 4.5 }));
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, D, 'D', { dy: 18, size: 18, dx: 0 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '∠ADB=∠ADC=90° (R)';
        else if (C.review && st === 2) { row = `AB=AC=${l} cm (H)`; col = 'amber'; }
        else if (C.review && st === 3) { row = 'AD는 공통 (S)'; col = 'green'; }
        else if (C.review && st === 4) { row = '△ABD≡△ACD (RHS) → BD=CD, ∠B=∠C'; col = 'green'; }
        else row = `RHS 합동 → BD=CD, ∠B=∠C=${bt}°, ∠BAD=∠CAD=${ad}°`;
        rowT(b, pt(0, 0), row, { dy: b.W < 560 ? 44 : 54, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `△ABD와 △ACD에서 $\\angle ADB=\\angle ADC=90^{\\circ}$ (직각, R)`,
      `빗변의 길이가 같아요: $\\overline{AB}=\\overline{AC}=${M.l}$ cm (빗변, H)`,
      `다른 한 변이 공통이에요: $\\overline{AD}$는 공통 (한 변, S)`,
      `따라서 △ABD≡△ACD (RHS 합동). 대응변과 대응각이 같으므로 $\\overline{BD}=\\overline{CD}$, $\\angle B=\\angle C=${M.bt}^{\\circ}$, $\\angle BAD=\\angle CAD=${M.ad}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AB=AC</b>와 <b>∠B</b>를 바꿔 보세요. 직각삼각형 두 개를 AD를 맞대어 붙이면 <b>이등변삼각형</b>이 만들어져요. 두 직각삼각형은 RHS 합동이에요.',
      readouts: [rd('빗변 AB = AC', `${M.l} cm`, 'amber'), rd('∠B = ∠C', `${M.bt}°`, 'green'), rd('∠BAD = ∠CAD', `${M.ad}°`, 'violet', '90° − ∠B', null, true)],
      formula: `<p>R: $\\angle ADB=\\angle ADC=90^{\\circ}$, H: $\\overline{AB}=\\overline{AC}$, S: $\\overline{AD}$ 공통</p><p>$\\Rightarrow\\ \\triangle ABD\\equiv\\triangle ACD$ (RHS)</p>`,
      rule: '두 직각삼각형에서 빗변의 길이와 다른 한 변의 길이가 각각 같으면 두 삼각형은 합동이다. (RHS 합동)',
      notes: notes('RHS는 <b>빗변</b>과 <b>다른 한 변</b>이 같을 때예요. 직각을 낀 두 변이 같은 경우는 SAS예요.', '공통인 변도 같은 변이에요. 그림에 표시하는 것을 잊지 마세요.')
    }),
    prob: (M, s) => {
      const { bt, ad, m } = M, v = (s.trV || 0) % 3;
      if (v === 0) return numProb({ tag: 'RHS 합동 · 대응변', key: `0:${m}`, stem: `그림에서 ${S('AB')}=${S('AC')}이고 $\\angle ADB=90^{\\circ}$이다. ${S('BD')}=${m} cm일 때, ${S('BC')}의 길이 $x$는?`, correct: 2 * m, wrongs: [[m, 'BD의 길이예요. △ABD≡△ACD이므로 BC=BD+CD예요.'], [m * 3, '다시 계산해 보세요.'], [m + 2, '다시 계산해 보세요.'], [2 * m + 1, '다시 계산해 보세요.'], [2 * m - 1, '다시 계산해 보세요.']], ...cmOpts });
      if (v === 1) return numProb({ tag: 'RHS 합동 · 각', key: `1:${bt}`, stem: `그림에서 ${S('AB')}=${S('AC')}, $\\angle ADB=90^{\\circ}$, $\\angle A=${2 * ad}^{\\circ}$이다. $\\angle B$의 크기 $x$는?`, correct: bt, wrongs: [[ad, '∠BAD의 크기예요.'], [2 * ad, '꼭지각이에요.'], [90, '직각이에요.'], [bt + 10, '다시 계산해 보세요.'], [bt - 10, '다시 계산해 보세요.']], ...degOpts(5) });
      return numProb({ tag: 'RHS 합동 · 각', key: `2:${bt}`, stem: `그림에서 ${S('AB')}=${S('AC')}, $\\angle ADB=90^{\\circ}$, $\\angle B=${bt}^{\\circ}$이다. $\\angle CAD$의 크기 $x$는?`, correct: ad, wrongs: [[bt, '∠B의 크기예요.'], [2 * ad, '꼭지각이에요.'], [90, '직각이에요.'], [ad + 10, '다시 계산해 보세요.'], [ad - 10, '다시 계산해 보세요.']], ...degOpts(5) });
    },
    verify: (s) => { const M = r2.model(s), hw = cos(M.bt), h = sin(M.bt); return { ans: angBetween(pt(-hw, 0), pt(0, -h), pt(0, 0)), model: M.bt, extra: [[angBetween(pt(0, -h), pt(-hw, 0), pt(0, 0)), M.ad]] }; }
  };

  /* ====================================================================== 3. 합동이 될 수 없는 경우 */
  const CASES = [
    { id: 'rha', t: '빗변 + 한 예각', cong: true, why: 'RHA 합동' },
    { id: 'rhs', t: '빗변 + 다른 한 변', cong: true, why: 'RHS 합동' },
    { id: 'aa', t: '두 예각만', cong: false, why: '크기가 달라질 수 있어요' },
    { id: 'h', t: '빗변만', cong: false, why: '모양이 달라질 수 있어요' }
  ];
  const r3 = {
    id: 't3-3', title: '합동이라고 할 수 있을까? (반례)', short: '합동 조건과 반례',
    question: '두 직각삼각형에서 어떤 조건이면 반드시 합동이고, 어떤 조건만으로는 합동이라고 할 수 없을까?',
    presets: () => CASES.map((c, i) => ({ group: i === 0 ? '같은 조건' : '', label: c.t, apply: (s) => { s.trCase = i; }, on: (s) => (s.trCase || 0) === i })),
    ctl: (s) => ((s.trCase || 0) === 2 ? ['trSb', 'trSc'] : (s.trCase || 0) === 3 ? ['trSb', 'trSa'] : ['trSb']),
    init: (s) => { s.trCase = 0; s.trSb = 40; s.trSc = 6; s.trSa = 56; s.trQi = 0; },
    reroll: (s) => { s.trSb = pick([30, 36, 40, 50, 56, 60], s.trSb); s.trQi = (s.trQi || 0) + 1; },
    model: (s) => {
      const k = (s.trCase || 0) % 4, a = clamp(Math.round(s.trSb / 2) * 2, 20, 70), c1 = 8;
      let c2 = c1, a2 = a;
      if (k === 2) c2 = clamp(Math.round(s.trSc), 4, 12);
      if (k === 3) a2 = clamp(Math.round(s.trSa / 2) * 2, 20, 70);
      const same = c2 === c1 && a2 === a;
      return { k, a, c1, c2, a2, same, cong: same };
    },
    draw(b, s, M, C) {
      const { k, a, c1, c2, a2, same } = M, st = C.step;
      const gapX = 1.0 * cos(a) + 0.7;
      const T1 = rtri(1, a, 0), sc = c2 / c1, T2 = (() => { const r = rtri(sc, a2, 0); const sh = cos(a) + 0.7 + sc * cos(a2); return { A: pt(r.A.x + sh, 0), B: pt(r.B.x + sh, r.B.y), C: pt(r.C.x + sh, 0) }; })();
      fit(b, bboxOf([T1.A, T1.B, T1.C, T2.A, T2.B, T2.C, pt(T1.A.x, -1.05)]), { t: 50, b: C.problem ? 50 : 96, l: 40, r: 40 });
      const cen1 = pt(T1.A.x * 0.4, T1.B.y * 0.4), cen2 = pt((T2.A.x + T2.C.x) / 2, T2.B.y * 0.4);
      const colr = same ? 'green' : 'rose';
      fillPoly(b, [T1.A, T1.B, T1.C], 'sky', 0.12); fillPoly(b, [T2.A, T2.B, T2.C], colr, 0.14);
      poly(b, [T1.A, T1.B, T1.C], 'ink', 3.4); poly(b, [T2.A, T2.B, T2.C], 'ink', 3.4);
      const marks = (Tr, ti) => {
        ang(b, Tr.C, Tr.A, Tr.B, { color: 'sky', r: 18 });
        const hyp = k === 0 || k === 1 || k === 3 || C.problem, ang1 = k === 0 || k === 2 || k === 1 && false;
        if (k === 0 || k === 1 || k === 3) tick(b, Tr.A, Tr.B, 1, 'amber');
        if (k === 0 || k === 2) ang(b, Tr.A, Tr.B, Tr.C, { color: 'amber', r: 28, rings: 2 });
        if (k === 2) ang(b, Tr.B, Tr.A, Tr.C, { color: 'violet', r: 26, rings: 3 });
        if (k === 1) tick(b, Tr.A, Tr.C, 2, 'rose');
        void hyp; void ang1;
      };
      if (C.problem) { ang(b, T1.C, T1.A, T1.B, { color: 'sky', r: 18 }); ang(b, T2.C, T2.A, T2.B, { color: 'sky', r: 18 }); } else { marks(T1, 0); marks(T2, 1); }
      if (!C.problem) {
        if (k === 0 || k === 3) { G.sideTag(b, T1.A, T1.B, cen1, `${c1} cm`, { color: 'amber', size: fs(b, 15), gap: 5 }); G.sideTag(b, T2.A, T2.B, cen2, `${c2} cm`, { color: 'amber', size: fs(b, 15), gap: 5 }); }
        if (k === 2) { G.sideTag(b, T1.A, T1.B, cen1, `${c1} cm`, { color: 'rose', size: fs(b, 15), gap: 5 }); G.sideTag(b, T2.A, T2.B, cen2, `${c2} cm`, { color: 'rose', size: fs(b, 15), gap: 5 }); }
        if (k === 1) { G.sideTag(b, T1.A, T1.B, cen1, `${c1} cm`, { color: 'amber', size: fs(b, 15), gap: 5 }); G.sideTag(b, T2.A, T2.B, cen2, `${c2} cm`, { color: 'amber', size: fs(b, 15), gap: 5 }); }
        if (k !== 1) { T(b, T1.A, dg(a), { dx: 36, dy: -10, size: fs(b, 15), color: 'amber' }); T(b, T2.A, dg(a2), { dx: 36 * (c2 / c1) + 4, dy: -10, size: fs(b, 15), color: k === 3 ? 'rose' : 'amber' }); }
      }
      [T1, T2].forEach((Tr, ti) => { const nm = ti ? ['D', 'E', 'F'] : ['A', 'B', 'C']; const cc = ti ? cen2 : cen1; [Tr.A, Tr.B, Tr.C].forEach((p, i) => { b.point(p, { color: 'ink', r: 4 }); tagOut(b, p, cc, nm[i], { size: 17 }); }); });
      if (!C.thumb && !C.problem) {
        const cs = CASES[k];
        let row, col = same ? 'green' : 'rose';
        row = same ? `${cs.t}가 같아요 → ${cs.why}` : `${cs.t}만 같아요 → 합동이 아니에요 (${cs.why})`;
        rowT(b, pt((T1.A.x + T2.C.x) / 2, 0), row, { dy: b.W < 560 ? 40 : 52, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => {
      const cs = CASES[M.k];
      return [
        `두 직각삼각형 ABC, DEF에서 $\\angle C=\\angle F=90^{\\circ}$이에요. 이제 어떤 조건이 같은지 확인해요.`,
        `같은 조건: ${cs.t}. ${cs.cong ? '빗변과 다른 요소가 같아서 대응이 정해져요.' : '나머지 요소를 마음대로 바꿀 수 있어요.'}`,
        cs.cong ? `따라서 두 삼각형은 합동이에요 (${cs.why}).` : `이 조건만으로는 합동이라고 할 수 없어요. ${M.k === 2 ? '세 각이 같아도 크기가 다른 삼각형(닮은 삼각형)을 만들 수 있어요.' : '빗변이 같아도 다른 모양의 삼각형을 만들 수 있어요.'}`
      ];
    },
    view: (M) => ({
      guide: '칩에서 <b>같은 조건</b>을 고르세요. <b>합동</b>이면 두 삼각형이 포개어지고(초록), 아니면 막대로 바꿀 수 있는 부분이 생겨요(분홍). 막대를 움직여 <b>합동이 아닌 예</b>(반례)를 직접 만들어 보세요.',
      readouts: [rd('같은 조건', CASES[M.k].t, 'amber'), rd('두 삼각형', M.same ? '합동이에요' : '합동이 아니에요', M.same ? 'green' : 'rose', CASES[M.k].why, null, true)],
      status: M.same ? { tone: 'ok', text: `합동 (${CASES[M.k].why})` } : { tone: 'warn', text: '합동이 되지 않는 경우예요' },
      formula: `<p>직각삼각형의 합동 조건: RHA (빗변 + 한 예각), RHS (빗변 + 다른 한 변)</p><p>두 예각만, 또는 빗변만 같은 것은 합동 조건이 아니에요.</p>`,
      rule: '두 직각삼각형은 (빗변, 한 예각) 또는 (빗변, 다른 한 변)이 각각 같을 때 합동이다.',
      notes: notes('두 <b>예각</b>이 모두 같아도 크기가 다를 수 있으므로 합동이라고 단정할 수 없어요.', '<b>빗변</b>만 같은 조건은 합동을 보장하지 않아요. 합동인 예와 합동이 아닌 예를 모두 만들 수 있어요.')
    }),
    prob: (M, s) => {
      const key = 'q' + (s.trQi || 0), ask = (s.trQi || 0) % 2 === 0;
      const cond = (...x) => '$\\angle C=\\angle F=90^{\\circ},\\ ' + x.join(',\\ ') + '$';
      const ob = (n) => `\\overline{${n}}`;
      const pool = [
        { h: cond(`${ob('AB')}=${ob('DE')}`, '\\angle A=\\angle D'), f: () => true },
        { h: cond(`${ob('AB')}=${ob('DE')}`, `${ob('AC')}=${ob('DF')}`), f: () => true },
        { h: cond(`${ob('AC')}=${ob('DF')}`, `${ob('BC')}=${ob('EF')}`), f: () => true },
        { h: cond(`${ob('BC')}=${ob('EF')}`, '\\angle B=\\angle E'), f: () => true },
        { h: cond(`${ob('AB')}=${ob('DE')}`, '\\angle B=\\angle E'), f: () => true },
        { h: cond('\\angle A=\\angle D', '\\angle B=\\angle E'), f: () => false },
        { h: cond(`${ob('AB')}=${ob('DE')}`), f: () => false },
        { h: cond('\\angle A=\\angle D'), f: () => false },
        { h: cond(`${ob('AC')}=${ob('DF')}`), f: () => false },
        { h: cond(`${ob('BC')}=${ob('EF')}`), f: () => false }
      ];
      const r = mkStmtChoices(pool, M, key, ask);
      return { tag: ask ? '직각삼각형의 합동 조건 · 합동이 되는 것' : '[함정] 직각삼각형의 합동 조건 · 합동이 되지 않는 것', key, stem: `그림과 같이 $\\angle C=\\angle F=90^{\\circ}$인 두 직각삼각형 ABC, DEF가 있다. 다음 중 ${ask ? '합동이 되는' : '합동이 되지 않는'} 조건은?`, choices: r.choices, wide: true };
    },
    verify: (s) => { const M = r3.model(s); return { ans: M.same ? 1 : 0, model: M.k <= 1 ? 1 : (M.c2 === M.c1 && M.a2 === M.a ? 1 : 0) }; }
  };

  /* ====================================================================== 4. 사다리꼴 속 직각삼각형 */
  // A=(0,0), B=(q,0), C=(q+p,0), E=(0,−p), D=(q+p,−q): AE=BC=p, AB=CD=q
  const trapGeom = (p, q) => ({ A: pt(0, 0), B: pt(q, 0), C: pt(q + p, 0), E: pt(0, -p), D: pt(q + p, -q) });
  const vv4 = (M, s) => (((s.trV || 0) % 3 === 1 && (M.p + M.q) % 2) ? 0 : (s.trV || 0) % 3);
  const r4 = {
    id: 't3-4', title: '사다리꼴 속 직각삼각형', short: '사다리꼴 속 직각삼각형',
    question: '직선 위의 점 B에서 BE⊥BD, BE=BD이면 두 직각삼각형 EAB, BCD는 어떤 관계일까?',
    ctl: ['trQa', 'trQb'],
    init: (s) => { s.trQa = 5; s.trQb = 3; s.trV = 0; },
    reroll: (s) => { s.trQa = rint(3, 8); s.trQb = rint(3, 8); s.trV = (s.trV + 1) % 3; if ((s.trV === 1) && (s.trQa + s.trQb) % 2) s.trQb += s.trQb > 3 ? -1 : 1; s.trAl = pick([30, 36, 40, 50, 54, 60], s.trAl || 40); },
    model: (s) => { const p = clamp(Math.round(s.trQa), 3, 9), q = clamp(Math.round(s.trQb), 3, 9); return { p, q, g: trapGeom(p, q), al: s.trAl || 40 }; },
    draw(b, s, M, C) {
      const { p, q } = M, st = C.step, v = vv4(M, s);
      let P0 = p, Q0 = q;
      if (C.problem && v === 2) { Q0 = 1; P0 = tan(M.al); }
      const g = trapGeom(P0, Q0), { A, B, C: Cc, E, D } = g;
      fit(b, bboxOf([A, B, Cc, E, D]), { t: 50, b: C.problem ? 50 : 92, l: 44, r: 44 });
      const cen = pt((A.x + Cc.x) / 2, -(Math.max(P0, Q0)) * 0.4), show = (n) => (C.problem ? false : C.review ? st >= n : true);
      fillPoly(b, [A, B, E], 'sky', 0.15); fillPoly(b, [B, Cc, D], 'green', 0.15); fillPoly(b, [E, B, D], 'amber', C.review && st >= 4 || (!C.review && !C.problem) ? 0.06 : 0.0);
      line(b, A, Cc, 'ink', 3.4); line(b, A, E, 'ink', 3.4); line(b, Cc, D, 'ink', 3.4); line(b, E, B, 'ink', 3.4); line(b, B, D, 'ink', 3.4); line(b, E, D, 'ink', 3.4, { alpha: 0.8 });
      ang(b, A, B, E, { color: 'sky', r: 22 }); ang(b, Cc, B, D, { color: 'green', r: 22 }); ang(b, B, E, D, { color: 'amber', r: 26 });
      tick(b, E, B, 2, 'rose'); tick(b, B, D, 2, 'rose');
      if (C.problem) {
        if (v === 0) { G.sideTag(b, A, E, pt(50, 0), `${p} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, A, B, pt(0, -5), `${q} cm`, { color: 'sky', size: fs(b, 16), gap: 8 }); dim(b, A, Cc, pt(0, -3), 'x', { color: 'amber', size: fs(b, 18), off: 30 }); }
        else if (v === 1) { G.sideTag(b, A, E, pt(50, 0), `${p} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, A, B, pt(0, -5), `${q} cm`, { color: 'sky', size: fs(b, 16), gap: 8 }); poly(b, [A, E, D, Cc], 'amber', 3.6); T(b, pt((A.x + Cc.x) / 2, (A.y + (E.y + D.y) / 2) / 2), '사다리꼴 AEDC의 넓이 = x', { dy: 0, size: fs(b, 15), color: 'amber' }); }
        else { ang(b, B, A, E, { color: 'sky', r: 34, label: dg(M.al), size: 16, labelDist: 56 }); ang(b, D, Cc, B, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 56 }); }
      } else {
        if (show(2)) { ang(b, B, A, E, { color: 'sky', r: 34, rings: 1 }); ang(b, D, Cc, B, { color: 'sky', r: 30, rings: 1 }); ang(b, B, Cc, D, { color: 'green', r: 34, rings: 2 }); ang(b, E, A, B, { color: 'green', r: 34, rings: 2 }); }
        G.sideTag(b, A, E, pt(50, 0), `${p} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, A, B, pt(0, -5), `${q} cm`, { color: 'sky', size: fs(b, 16), gap: 8 });
        if (show(3)) { G.sideTag(b, B, Cc, pt(0, -5), `${p} cm`, { color: 'green', size: fs(b, 16), gap: 8 }); G.sideTag(b, Cc, D, pt(-50, -5), `${q} cm`, { color: 'green', size: fs(b, 16), gap: 6 }); }
        if (show(1)) { T(b, B, '●', { dx: -34, dy: -16, size: 16, color: 'sky' }); T(b, B, '×', { dx: 36, dy: -16, size: 18, color: 'green' }); }
      }
      [A, B, Cc, E, D].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); tagOut(b, E, cen, 'E', { size: 18 }); tagOut(b, D, cen, 'D', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '∠EBA+∠CBD=90° → ∠EBA=∠BDC';
        else if (C.review && st === 2) { row = '△EAB ≡ △BCD (RHA)'; col = 'green'; }
        else if (C.review && st === 3) { row = `BC=AE=${p} cm, CD=AB=${q} cm → AC=${p + q} cm`; col = 'green'; }
        else row = `AE=${p}, AB=${q} → BC=${p}, CD=${q}, AC=${p + q} (cm)`;
        rowT(b, pt((A.x + Cc.x) / 2, 0), row, { dy: b.W < 560 ? 40 : 50, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `점 B에서 일직선이므로 $\\angle EBA+\\angle EBD+\\angle CBD=180^{\\circ}$이고 $\\angle EBD=90^{\\circ}$이므로 $\\angle EBA+\\angle CBD=90^{\\circ}$ (●+×=90°). 또 △BCD에서 $\\angle BDC+\\angle CBD=90^{\\circ}$이므로 $\\angle EBA=\\angle BDC$예요.`,
      `△EAB와 △BCD에서 $\\angle A=\\angle C=90^{\\circ}$, $\\overline{EB}=\\overline{BD}$, $\\angle EBA=\\angle BDC$이므로 △EAB≡△BCD (RHA 합동)이에요.`,
      `대응변의 길이가 같으므로 $\\overline{BC}=\\overline{AE}=${M.p}$ cm, $\\overline{CD}=\\overline{AB}=${M.q}$ cm. 따라서 $\\overline{AC}=\\overline{AB}+\\overline{BC}=${M.q}+${M.p}=${M.p + M.q}$ (cm)`
    ],
    view: (M) => ({
      guide: '막대로 <b>AE</b>와 <b>AB</b>를 바꿔 보세요. BE⊥BD이고 BE=BD인 두 직각삼각형은 늘 합동이에요. 그래서 <b>BC=AE, CD=AB</b>예요.',
      readouts: [rd('AE = BC', `${M.p} cm`, 'sky'), rd('AB = CD', `${M.q} cm`, 'green'), rd('AC', `${M.p + M.q} cm`, 'amber', 'AB + BC', null, true)],
      formula: `<p>△EAB≡△BCD (RHA)</p><p>$\\overline{BC}=\\overline{AE}=${M.p},\\ \\overline{CD}=\\overline{AB}=${M.q},\\ \\overline{AC}=${M.q}+${M.p}=${M.p + M.q}$</p>`,
      rule: '직선 위의 점 B에서 BE⊥BD, BE=BD인 두 직각삼각형은 RHA 합동이고 ●+×=90°이다.',
      notes: notes('같은 각을 찾을 때 <b>● + × = 90°</b>를 이용해요. ∠EBA와 ∠CBD는 같지 않고 합이 90°예요.', '대응하는 변을 헷갈리지 마세요. AE는 BC와, AB는 CD와 같아요.')
    }),
    prob: (M, s) => {
      const { p, q, al } = M, v = vv4(M, s);
      if (v === 0) return numProb({ tag: '사다리꼴 속 합동 · 길이', key: `0:${p}:${q}`, stem: `그림에서 $\\angle A=\\angle C=90^{\\circ}$, $\\angle EBD=90^{\\circ}$, ${S('BE')}=${S('BD')}이고 ${S('AE')}=${p} cm, ${S('AB')}=${q} cm일 때, ${S('AC')}의 길이 $x$는?`, correct: p + q, wrongs: [[q, 'AB의 길이예요. AC=AB+BC이고 BC=AE예요.'], [p, 'AE의 길이예요.'], [p * q, '곱하지 않고 더해요.'], [p + q + 1, '다시 계산해 보세요.'], [Math.abs(p - q) || p + 2, '다시 계산해 보세요.']], ...cmOpts });
      if (v === 1) { const area = ((p + q) * (p + q)) / 2; return numProb({ tag: '[함정] 사다리꼴 속 합동 · 넓이', key: `1:${p}:${q}`, stem: `그림에서 $\\angle A=\\angle C=90^{\\circ}$, $\\angle EBD=90^{\\circ}$, ${S('BE')}=${S('BD')}이고 ${S('AE')}=${p} cm, ${S('AB')}=${q} cm일 때, 사다리꼴 AEDC의 넓이 $x$는?`, correct: area, wrongs: [[p * q, '밑변과 높이만 곱했어요. 사다리꼴 넓이를 구해야 해요.'], [(p + q) * (p + q), '2로 나누지 않았어요.'], [(p * q) / 2 + 1, '다시 계산해 보세요.'], [area + 4, '다시 계산해 보세요.'], [area - 4, '다시 계산해 보세요.']], tex: (v2) => `${v2}\\text{ cm}^2`, plain: (v2) => v2 + ' cm²', pad: 2, valid: (v2) => Number.isInteger(v2) && v2 > 0 }); }
      return numProb({ tag: '사다리꼴 속 합동 · 각', key: `2:${al}`, stem: `그림에서 $\\angle A=\\angle C=90^{\\circ}$, $\\angle EBD=90^{\\circ}$, ${S('BE')}=${S('BD')}이고 $\\angle ABE=${al}^{\\circ}$일 때, $\\angle CDB$의 크기 $x$는?`, correct: al, wrongs: [[90 - al, '∠CBD의 크기예요. ∠CDB는 ∠ABE와 같아요.'], [180 - al, '다시 생각해 보세요.'], [90, '직각이에요.'], [al + 10, '다시 계산해 보세요.'], [al - 10, '다시 계산해 보세요.']], ...degOpts(5) });
    },
    verify: (s) => { const M = r4.model(s), g = M.g; return { ans: angBetween(g.B, g.E, g.D), model: 90, extra: [[dist(g.E, g.B), dist(g.B, g.D)], [dist(g.B, g.C), M.p], [dist(g.C, g.D), M.q]] }; }
  };

  /* ====================================================================== 5. 직선 ℓ을 지나는 직각이등변삼각형 */
  // 직선 l(가로)이 A를 지나고, B·C는 ℓ 위쪽 양쪽. D,E 는 B,C에서 ℓ에 내린 수선의 발. BD=m, CE=n, AD=n, AE=m
  const lineGeom = (m, n) => { const A = pt(0, 0), D = pt(-n, 0), E = pt(m, 0), B = pt(-n, -m), C = pt(m, -n); return { A, B, C, D, E }; };
  const vv5 = (M, s) => (((s.trV || 0) % 3 === 2 && (M.m + M.n) % 2) ? 0 : (s.trV || 0) % 3);
  const r5 = {
    id: 't3-5', title: '꼭짓점을 지나는 직선과 합동', short: '직선을 지나는 합동',
    question: '직각이등변삼각형의 직각 꼭짓점 A를 지나는 직선 ℓ에 B, C에서 수선을 그으면 어떤 합동이 생길까?',
    ctl: ['trLm', 'trLn'],
    init: (s) => { s.trLm = 3; s.trLn = 5; s.trV = 0; },
    reroll: (s) => { s.trLm = rint(2, 8); s.trLn = rint(2, 8); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const m = clamp(Math.round(s.trLm), 2, 8), n = clamp(Math.round(s.trLn), 2, 8); return { m, n, g: lineGeom(m, n) }; },
    draw(b, s, M, C) {
      const { m, n, g } = M, { A, B, C: Cc, D, E } = g, st = C.step, v = vv5(M, s);
      fit(b, bboxOf([B, Cc, D, E, pt(-n - 0.5, 0), pt(m + 0.5, 0)]), { t: 50, b: C.problem ? 54 : 96, l: 44, r: 44 });
      const cen = pt((D.x + E.x) / 2, -Math.max(m, n) * 0.5), show = (k) => (C.problem ? false : C.review ? st >= k : true);
      line(b, pt(-n - 0.5, 0), pt(m + 0.5, 0), 'ink', 3, { alpha: 0.7 });
      fillPoly(b, [A, B, D], 'sky', show(2) ? 0.22 : 0.1); fillPoly(b, [A, Cc, E], 'green', show(2) ? 0.22 : 0.1); fillPoly(b, [A, B, Cc], 'amber', 0.08);
      poly(b, [A, B, Cc], 'ink', 3.6); line(b, B, D, 'ink', 3.2); line(b, Cc, E, 'ink', 3.2);
      ang(b, A, B, Cc, { color: 'amber', r: 24 }); ang(b, D, B, A, { color: 'sky', r: 18 }); ang(b, E, Cc, A, { color: 'green', r: 18 });
      tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      if (C.problem) {
        if (v === 0) { G.sideTag(b, B, D, pt(0, -2), `${m} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, Cc, E, pt(0, -2), `${n} cm`, { color: 'green', size: fs(b, 16), gap: 6 }); dim(b, D, E, pt(0, -3), 'x', { color: 'amber', size: fs(b, 18), off: 26 }); }
        else if (v === 1) { G.sideTag(b, B, D, pt(0, -2), `${m} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, A, D, pt(0, -5), `${n} cm`, { color: 'green', size: fs(b, 16), gap: 6 }); G.sideTag(b, Cc, E, pt(0, -2), 'x', { color: 'amber', size: fs(b, 18), gap: 6 }); }
        else { G.sideTag(b, B, D, pt(0, -2), `${m} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, Cc, E, pt(0, -2), `${n} cm`, { color: 'green', size: fs(b, 16), gap: 6 }); poly(b, [B, D, E, Cc], 'amber', 3.6); T(b, pt((D.x + E.x) / 2, (B.y + Cc.y) / 4), '사다리꼴 BDEC의 넓이 = x', { dy: 0, size: fs(b, 15), color: 'amber' }); }
      } else {
        if (show(1)) { ang(b, A, D, B, { color: 'sky', r: 34, rings: 1 }); ang(b, Cc, A, E, { color: 'sky', r: 34, rings: 1 }); ang(b, B, A, D, { color: 'green', r: 34, rings: 2 }); ang(b, A, Cc, E, { color: 'green', r: 34, rings: 2 }); }
        G.sideTag(b, B, D, pt(0, -2), `${m} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, Cc, E, pt(0, -2), `${n} cm`, { color: 'green', size: fs(b, 16), gap: 6 });
        if (show(3)) { G.sideTag(b, A, E, pt(0, -5), `${m} cm`, { color: 'sky', size: fs(b, 16), gap: 8 }); G.sideTag(b, D, A, pt(0, -5), `${n} cm`, { color: 'green', size: fs(b, 16), gap: 8 }); dim(b, D, E, pt(0, -3), `${m + n} cm`, { color: 'amber', size: fs(b, 16), off: 26 }); }
      }
      [A, B, Cc, D, E].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, A, 'A', { dy: -18, size: 18 }); T(b, D, 'D', { dy: 18, size: 18 }); T(b, E, 'E', { dy: 18, size: 18 });
      T(b, pt(m + 0.5, 0), 'ℓ', { dy: -14, dx: -6, size: 17, color: 'ink' });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '∠BAD+∠CAE=90° → ∠ABD=∠CAE';
        else if (C.review && st === 2) { row = '△ABD ≡ △CAE (RHA)'; col = 'green'; }
        else if (C.review && st === 3) { row = `AE=BD=${m}, AD=CE=${n} → DE=${m + n} cm`; col = 'amber'; }
        else row = `BD=${m} cm, CE=${n} cm → DE=BD+CE=${m + n} cm`;
        rowT(b, pt((D.x + E.x) / 2, 0), row, { dy: b.W < 560 ? 62 : 76, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `점 A에서 일직선이므로 $\\angle BAD+\\angle BAC+\\angle CAE=180^{\\circ}$이고 $\\angle BAC=90^{\\circ}$이므로 $\\angle BAD+\\angle CAE=90^{\\circ}$. △ABD에서 $\\angle ABD+\\angle BAD=90^{\\circ}$이므로 $\\angle ABD=\\angle CAE$ (● 와 × 가 같은 각끼리).`,
      `△ABD와 △CAE에서 $\\angle D=\\angle E=90^{\\circ}$, $\\overline{AB}=\\overline{CA}$, $\\angle ABD=\\angle CAE$이므로 △ABD≡△CAE (RHA 합동)이에요.`,
      `대응변의 길이가 같으므로 $\\overline{AE}=\\overline{BD}=${M.m}$ cm, $\\overline{AD}=\\overline{CE}=${M.n}$ cm. 따라서 $\\overline{DE}=\\overline{AD}+\\overline{AE}=${M.n}+${M.m}=${M.m + M.n}$ (cm)`
    ],
    view: (M) => ({
      guide: '막대로 <b>BD</b>와 <b>CE</b>를 바꿔 보세요. 직선 ℓ이 어떤 방향이어도 △ABD≡△CAE예요. 그래서 <b>AE=BD, AD=CE</b>이고 DE=BD+CE예요.',
      readouts: [rd('BD = AE', `${M.m} cm`, 'sky'), rd('CE = AD', `${M.n} cm`, 'green'), rd('DE', `${M.m + M.n} cm`, 'amber', 'BD + CE', null, true)],
      formula: `<p>△ABD≡△CAE (RHA)</p><p>$\\overline{DE}=\\overline{AD}+\\overline{AE}=\\overline{CE}+\\overline{BD}=${M.n}+${M.m}=${M.m + M.n}$</p>`,
      rule: '직각이등변삼각형의 직각 꼭짓점을 지나는 직선에 내린 두 수선의 발 D, E에서 △ABD≡△CAE이다.',
      notes: notes('BD와 AE, AD와 CE를 짝지어요. <b>BD와 CE가 같은 것이 아니에요</b>.', '직선 ℓ이 삼각형을 가로지르지 않을 때(B, C가 ℓ의 같은 쪽)만 DE=BD+CE예요.')
    }),
    prob: (M, s) => {
      const { m, n } = M, v = vv5(M, s);
      if (v === 0) return numProb({ tag: '직각이등변삼각형과 수선 · DE', key: `0:${m}:${n}`, stem: `그림과 같이 $\\angle A=90^{\\circ}$, ${S('AB')}=${S('AC')}인 직각이등변삼각형 ABC의 꼭짓점 A를 지나는 직선 ℓ에 B, C에서 내린 수선의 발을 각각 D, E라 하자. ${S('BD')}=${m} cm, ${S('CE')}=${n} cm일 때, ${S('DE')}의 길이 $x$는?`, correct: m + n, wrongs: [[Math.abs(m - n) || m + 1, '두 길이를 빼지 않고 더해요. DE=AD+AE=CE+BD예요.'], [m, 'BD의 길이예요.'], [n, 'CE의 길이예요.'], [m * n, '곱하지 않고 더해요.'], [m + n + 1, '다시 계산해 보세요.']], ...cmOpts });
      if (v === 1) return numProb({ tag: '직각이등변삼각형과 수선 · CE', key: `1:${m}:${n}`, stem: `그림과 같이 $\\angle A=90^{\\circ}$, ${S('AB')}=${S('AC')}인 직각이등변삼각형 ABC의 꼭짓점 A를 지나는 직선 ℓ에 B, C에서 내린 수선의 발을 각각 D, E라 하자. ${S('BD')}=${m} cm, ${S('AD')}=${n} cm일 때, ${S('CE')}의 길이 $x$는?`, correct: n, wrongs: [[m, 'BD의 길이예요. CE는 AD와 같아요.'], [m + n, 'DE의 길이예요.'], [Math.abs(m - n) || n + 2, '다시 생각해 보세요.'], [n + 1, '다시 계산해 보세요.'], [n + 2, '다시 계산해 보세요.']], ...cmOpts });
      const area = (m * m + n * n) / 2;
      return numProb({ tag: '[함정] 직각이등변삼각형과 수선 · 넓이', key: `2:${m}:${n}`, stem: `그림과 같이 $\\angle A=90^{\\circ}$, ${S('AB')}=${S('AC')}인 직각이등변삼각형 ABC의 꼭짓점 A를 지나는 직선 ℓ에 B, C에서 내린 수선의 발을 각각 D, E라 하자. ${S('BD')}=${m} cm, ${S('CE')}=${n} cm일 때, 사다리꼴 BDEC의 넓이 $x$는?`, correct: ((m + n) * (m + n)) / 2, wrongs: [[(m + n) * (m + n), '2로 나누지 않았어요.'], [m * n, '밑변과 높이만 곱했어요.'], [((m + n) * (m + n)) / 2 + 3, '다시 계산해 보세요.'], [((m + n) * (m + n)) / 2 - 3, '다시 계산해 보세요.'], [m + n, '넓이가 아니라 높이예요.']], tex: (v2) => `${v2}\\text{ cm}^2`, plain: (v2) => v2 + ' cm²', pad: 1, valid: (v2) => v2 > 0 && Number.isInteger(v2) });
    },
    verify: (s) => { const M = r5.model(s), g = M.g; return { ans: dist(g.D, g.E), model: M.m + M.n, extra: [[dist(g.A, g.B), dist(g.A, g.C)], [angBetween(g.A, g.B, g.C), 90], [dist(g.A, g.E), dist(g.B, g.D)], [dist(g.A, g.D), dist(g.C, g.E)]] }; }
  };

  /* ====================================================================== 6. 연 모양 (빗변 공유) */
  const r6 = {
    id: 't3-6', title: '빗변을 공유하는 연 모양', short: '연 모양',
    question: '직각삼각형 두 개가 빗변 AC를 공유하고 AB=AD이면 어떤 모양이 될까?',
    ctl: ['trKm', 'trKa', 'trKt'], anim: { key: 'trKt', dur: 4, label: 'AC로 접어 보기', start: 0 },
    init: (s) => { s.trKm = 6; s.trKa = 40; s.trKt = 0; s.trV = 0; s.trM = 5; },
    reroll: (s) => { s.trKa = pick([30, 36, 40, 50, 56, 60], s.trKa); s.trM = rint(3, 9); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const m = clamp(Math.round(s.trKm), 4, 10), a = clamp(Math.round(s.trKa / 2) * 2, 20, 70); return { m, a, c: 90 - a, n: s.trM || 5 }; },
    draw(b, s, M, C) {
      const { m, a, c, n } = M, st = C.step, v = (s.trV || 0) % 3;
      // A 왼쪽, C 오른쪽(AC=1, 가로). B 위, D 아래. B 는 AC 에서 ∠BAC=a, 직각 B → AB=cos a
      const A = pt(0, 0), Cc = pt(1, 0), Bp = pt(cos(a) * cos(a), -cos(a) * sin(a)), Dp = pt(Bp.x, -Bp.y);
      const f = C.problem ? 0 : C.review ? (st >= 3 ? 1 : 0) : (s.trKt || 0);
      fit(b, bboxOf([A, Cc, Bp, Dp]), { t: 56, b: C.problem ? 56 : 90, l: 50, r: 54 });
      const cen = pt(0.5, 0), show = (k) => (C.problem ? false : C.review ? st >= k : true);
      fillPoly(b, [A, Bp, Cc], 'sky', 0.14); fillPoly(b, [A, Dp, Cc], 'green', 0.14);
      poly(b, [A, Bp, Cc, Dp], 'ink', 3.6); line(b, A, Cc, 'green', 3.2);
      ang(b, Bp, A, Cc, { color: 'sky', r: 20 }); ang(b, Dp, A, Cc, { color: 'sky', r: 20 });
      tick(b, A, Bp, 1, 'amber'); tick(b, A, Dp, 1, 'amber');
      if (f > 0.001) { const k = Math.cos(Math.PI * f); poly(b, [A, pt(Dp.x, Dp.y * k), Cc], 'amber', 2.8, { dash: [6, 5] }); }
      if (C.problem) {
        if (v === 0) { ang(b, A, Bp, Dp, { color: 'sky', r: 34, label: dg(2 * a), size: 16, labelDist: 54 }); ang(b, Cc, Bp, Dp, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 56 }); }
        else if (v === 1) { G.sideTag(b, Bp, Cc, cen, `${n} cm`, { color: 'sky', size: fs(b, 17), gap: 6 }); G.sideTag(b, Dp, Cc, cen, 'x', { color: 'amber', size: fs(b, 18), gap: 6 }); }
        else { ang(b, A, Bp, Cc, { color: 'sky', r: 34, label: dg(a), size: 16, labelDist: 54 }); ang(b, Cc, Dp, A, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 50 }); }
      } else {
        ang(b, A, Bp, Cc, { color: 'sky', r: 34, rings: 2, label: dg(a), size: 15, labelDist: 56 });
        if (show(3)) ang(b, A, Dp, Cc, { color: 'sky', r: 34, rings: 2, label: dg(a), size: 15, labelDist: 56 });
        ang(b, Cc, Bp, A, { color: 'green', r: 30, rings: 3, label: dg(c), size: 15, labelDist: 52 });
        if (show(3)) { ang(b, Cc, Dp, A, { color: 'green', r: 30, rings: 3, label: dg(c), size: 15, labelDist: 52 }); tick(b, Bp, Cc, 2, 'rose'); tick(b, Dp, Cc, 2, 'rose'); }
        G.sideTag(b, A, Bp, cen, `${m} cm`, { color: 'amber', size: fs(b, 15), gap: 6 }); G.sideTag(b, A, Dp, cen, `${m} cm`, { color: 'amber', size: fs(b, 15), gap: 6 });
      }
      [A, Bp, Cc, Dp].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, Bp, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); tagOut(b, Dp, cen, 'D', { size: 18 });
      // Exploration guidance stays in the guide panel, clear of D and the floating toolbar.
      if (!C.thumb && !C.problem && C.review) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠B=∠D=90° (R), AB=AD=${m} cm`;
        else if (C.review && st === 2) { row = 'AC는 공통 (H) → RHS 합동'; col = 'amber'; }
        else if (C.review && st === 3) { row = `△ABC≡△ADC → CB=CD, ∠BAC=∠DAC=${a}°, ∠BCA=∠DCA=${c}°`; col = 'green'; }
        else row = `접으면 포개어져요: CB=CD, ∠A와 ∠C가 이등분돼요`;
        rowT(b, pt(0.5, 0), row, { dy: b.W < 560 ? 62 : 80, size: fs(b, 15), color: col });
      }
    },
    stepT: (n) => (n >= 3 ? 1 : 0),
    steps: (M) => [
      `△ABC와 △ADC에서 $\\angle B=\\angle D=90^{\\circ}$ (직각, R), $\\overline{AB}=\\overline{AD}=${M.m}$ cm (한 변)`,
      `$\\overline{AC}$는 두 직각삼각형의 빗변이므로 공통이에요 (빗변, H). 따라서 △ABC≡△ADC (RHS 합동)이에요.`,
      `대응변·대응각이 같으므로 $\\overline{CB}=\\overline{CD}$, $\\angle BAC=\\angle DAC=${M.a}^{\\circ}$, $\\angle BCA=\\angle DCA=${M.c}^{\\circ}$. 즉 AC는 ∠A와 ∠C를 이등분해요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AB=AD</b>와 <b>∠BAC</b>를 바꿔 보세요. ▶를 누르면 AC를 따라 아래쪽 삼각형이 접혀 올라와 위쪽 삼각형과 <b>포개어져요</b>. 두 삼각형은 RHS 합동이므로 <b>CB=CD</b>이고, AC는 ∠A와 ∠C를 이등분해요.',
      readouts: [rd('∠BAC = ∠DAC', `${M.a}°`, 'sky'), rd('∠BCA = ∠DCA', `${M.c}°`, 'green', '90° − ∠BAC'), rd('∠BAD', `${2 * M.a}°`, 'amber', null, null, true)],
      formula: `<p>△ABC≡△ADC (RHS)</p><p>$\\angle BAD=2\\times${M.a}^{\\circ}=${2 * M.a}^{\\circ},\\ \\angle BCD=2\\times${M.c}^{\\circ}=${2 * M.c}^{\\circ}$</p>`,
      rule: '빗변을 공유하는 두 직각삼각형에서 다른 한 변이 같으면 RHS 합동이고, 공통인 빗변은 각을 이등분한다.',
      notes: notes('공통인 변 AC가 <b>빗변</b>이에요. 길이가 같다고 따로 표시하지 않아도 같아요.', '합동이므로 ∠BAC=∠DAC이고, 그래서 ∠BAD는 ∠BAC의 <b>2배</b>예요.')
    }),
    prob: (M, s) => {
      const { a, c, n } = M, v = (s.trV || 0) % 3;
      if (v === 0) return numProb({ tag: '연 모양 · 마주 보는 각', key: `0:${a}`, stem: `그림과 같은 사각형 ABCD에서 $\\angle B=\\angle D=90^{\\circ}$, ${S('AB')}=${S('AD')}이고 $\\angle BAD=${2 * a}^{\\circ}$일 때, $\\angle BCD$의 크기 $x$는?`, correct: 180 - 2 * a, wrongs: [[c, '∠BCA의 크기예요. ∠BCD는 ∠BCA의 2배예요.'], [2 * a, '∠BAD의 크기예요.'], [90, '직각이에요.'], [360 - 2 * a - 180 + 10, '다시 계산해 보세요.'], [180 - 2 * a + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== 180 - 2 * a), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '연 모양 · 대응변', key: `1:${n}`, stem: `그림과 같은 사각형 ABCD에서 $\\angle B=\\angle D=90^{\\circ}$, ${S('AB')}=${S('AD')}이고 ${S('BC')}=${n} cm일 때, ${S('CD')}의 길이 $x$는?`, correct: n, wrongs: [[n + 1, 'RHS 합동이므로 CB=CD예요.'], [n - 1, 'RHS 합동이므로 CB=CD예요.'], [n * 2, 'RHS 합동이므로 CB=CD예요.'], [n + 2, '다시 생각해 보세요.'], [n - 2, '다시 생각해 보세요.']], ...cmOpts });
      return numProb({ tag: '연 모양 · 대응각', key: `2:${a}`, stem: `그림과 같은 사각형 ABCD에서 $\\angle B=\\angle D=90^{\\circ}$, ${S('AB')}=${S('AD')}이고 $\\angle BAC=${a}^{\\circ}$일 때, $\\angle ACD$의 크기 $x$는?`, correct: c, wrongs: [[a, '∠BAC의 크기예요. ∠ACD는 ∠ACB와 같아요.'], [2 * a, '다시 생각해 보세요.'], [180 - a, '다시 생각해 보세요.'], [c + 10, '다시 계산해 보세요.'], [c - 10, '다시 계산해 보세요.']], ...degOpts(5) });
    },
    verify: (s) => { const M = r6.model(s), A = pt(0, 0), Cc = pt(1, 0), Bp = pt(cos(M.a) * cos(M.a), -cos(M.a) * sin(M.a)), Dp = pt(Bp.x, -Bp.y); return { ans: angBetween(Cc, Bp, Dp), model: 180 - 2 * M.a, extra: [[angBetween(A, Bp, Cc), M.a], [angBetween(Bp, A, Cc), 90], [dist(A, Bp), dist(A, Dp)]] }; }
  };

  /* ====================================================================== 7. 합동과 넓이 */
  /* -------------------------------------------------------------------- 풀이 흐름 (탐구 · 문제 · 풀이) — 이 장면의 문제와 같은 상태·같은 숫자로 풀이합니다.
     v0: △ABC 의 넓이 x · v1: 사다리꼴 BDEC 의 넓이 x. 그림 단계(f): given → idea → cong(합동 찾기) → len(길이) → trapz(사다리꼴) → sub(빼기) → ans → trap(흔한 실수) */
  const r7Order = ['given', 'idea', 'cong', 'len', 'trapz', 'sub', 'ans', 'trap'];
  const r7Solve = {
    quickTitle: '10초 컷 · BD, CE의 길이로 바로 계산',
    quick: (M, s) => {
      const { m, n, trap, tri } = M, v = (s.trV || 0) % 2;
      return v === 0
        ? { steps: `<p>(사다리꼴) − (합동인 두 삼각형) $=\\frac{(${m}+${n})^2}{2}-${m}\\times${n}=\\frac{${m}^2+${n}^2}{2}$ 이므로</p><p>$\\triangle ABC=\\frac{${m * m}+${n * n}}{2}=${tri}$ (cm²)</p>`, note: '직각이등변삼각형에서 수선의 길이 BD, CE만 알면 넓이는 (BD²+CE²)÷2로 바로 나와요.' }
        : { steps: `<p>높이 $\\overline{DE}=\\overline{BD}+\\overline{CE}=${m + n}$${G.josa(m + n, '을', '를')} 바로 쓰면 $\\frac{(${m}+${n})^2}{2}=${trap}$ (cm²)</p>`, note: '합동을 찾아 DE=BD+CE만 알면 사다리꼴의 넓이는 (BD+CE)²÷2로 바로 나와요.' };
    },
    steps: (M, s) => {
      const { m, n, trap, tri, small } = M, v = (s.trV || 0) % 2, out = [];
      out.push({ k: 'given', f: 'given', t: `$\\angle A=90^{\\circ}$, $\\overline{AB}=\\overline{AC}$이고 $\\overline{BD}\\perp\\overline{DE}$, $\\overline{CE}\\perp\\overline{DE}$예요. $\\overline{BD}=${m}$ cm, $\\overline{CE}=${n}$ cm. 구하는 것은 ${v === 0 ? '△ABC' : '사다리꼴 BDEC'}의 넓이 $x$.`, cap: `∠A=90°, AB=AC, BD=${m} cm, CE=${n} cm` });
      out.push({ k: 'idea', f: 'idea', t: v === 0 ? '직각이등변삼각형과 두 직각이 있으면 RHA 합동인 두 삼각형(△ABD, △CAE)가 숨어 있어요.' : '사다리꼴의 높이 DE를 알아야 해요. 직각이등변삼각형과 두 직각 → RHA 합동으로 구해요.', cap: '직각이등변 + 두 직각 → RHA 합동 찾기' });
      out.push({ k: 'fig', f: 'cong', lb: '합동 찾기', t: `$\\angle BAD+\\angle CAE=180^{\\circ}-90^{\\circ}=90^{\\circ}$이고 △ABD에서 $\\angle ABD+\\angle BAD=90^{\\circ}$이므로 $\\angle ABD=\\angle CAE$. △ABD와 △CAE에서 $\\angle D=\\angle E=90^{\\circ}$, $\\overline{AB}=\\overline{CA}$, $\\angle ABD=\\angle CAE$이므로 △ABD≡△CAE (RHA 합동).`, cap: '∠ABD=∠CAE, ∠D=∠E=90°, AB=CA → △ABD≡△CAE (RHA)' });
      out.push({ k: 'fig', f: 'len', lb: '길이 구하기', t: `합동이므로 $\\overline{AE}=\\overline{BD}=${m}$ cm, $\\overline{AD}=\\overline{CE}=${n}$ cm예요. 따라서 $\\overline{DE}=${n}+${m}=${m + n}$ (cm).`, cap: `AE=BD=${m}, AD=CE=${n} → DE=${m + n} cm` });
      if (v === 0) {
        out.push({ k: 'eq', f: 'trapz', t: `사다리꼴 BDEC의 넓이는 $\\frac{(${m}+${n})\\times${m + n}}{2}=${trap}$ (cm²). (평행한 두 변은 BD, CE이고 높이는 DE)`, cap: `사다리꼴 BDEC=\\frac{(${m}+${n})×${m + n}}{2}=${trap} cm²` });
        out.push({ k: 'eq', f: 'sub', t: `합동인 △ABD, △CAE의 넓이의 합은 $2\\times\\frac{${m}\\times${n}}{2}=${small}$ (cm²)이므로 △ABC의 넓이 $x=${trap}-${small}=${tri}$ (cm²).`, cap: `△ABC=${trap}−2×\\frac{${m}×${n}}{2}=${trap}−${small}=${tri} cm²` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${tri}\\text{ cm}^2$`, cap: `x = ${tri} cm²` });
        out.push({ k: 'trap', f: 'trap', t: `사다리꼴 BDEC의 넓이 ${trap} cm²를 △ABC의 넓이로 쓰면 안 돼요. 사다리꼴 안에는 합동인 두 직각삼각형(합 ${small} cm²)도 들어 있으니 빼야 해요.`, cap: `사다리꼴 ${trap} cm²는 △ABC가 아니에요 → 두 삼각형 ${small} cm²를 빼요` });
      } else {
        out.push({ k: 'eq', f: 'trapz', t: `사다리꼴의 평행한 두 변은 $\\overline{BD}=${m}$, $\\overline{CE}=${n}$이고 높이는 $\\overline{DE}=${m + n}$이므로 $x=\\frac{(${m}+${n})\\times${m + n}}{2}=${trap}$ (cm²).`, cap: `x=\\frac{(${m}+${n})×${m + n}}{2}=${trap} cm²` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${trap}\\text{ cm}^2$`, cap: `x = ${trap} cm²` });
        out.push({ k: 'trap', f: 'trap', t: `높이를 $\\overline{BD}=${m}$로 놓고 $\\frac{(${m}+${n})\\times${m}}{2}=${((m + n) * m) / 2}$ (cm²)라고 하면 틀려요. 높이는 두 평행한 변 사이의 거리인 $\\overline{DE}=${m + n}$예요.`, cap: `높이를 BD=${m}로 놓으면 ${((m + n) * m) / 2} cm² (틀려요) → 높이는 DE=${m + n} cm` });
      }
      return out;
    },
    draw(b, s, M, C, ST, idx) {
      const { m, n, g, trap, tri } = M, { A, B, C: Cc, D, E } = g, v = (s.trV || 0) % 2, cur = idx >= 0 ? ST[idx] : null, f = cur ? cur.f : 'problem', K = cur ? cur.k : 'problem';
      const ph = (nm) => r7Order.indexOf(f) >= r7Order.indexOf(nm) && r7Order.indexOf(f) >= 0, at = (nm) => f === nm, FD = G.faded;
      const compact = b.W < 560;
      // 문제에는 풀이 설명 줄이 없으므로 그 공간까지 비우지 않습니다.
      // 풀이에서는 실제 길이 표시와 설명 줄이 필요한 만큼만 남깁니다.
      fit(b, bboxOf([B, Cc, D, E, pt(-n - 0.5, 0), pt(m + 0.5, 0)]), { t: compact ? 28 : 54, b: compact ? (idx < 0 ? 44 : ph('len') ? 112 : 88) : 128, l: 44, r: 44 });
      const cen = pt((D.x + E.x) / 2, -Math.max(m, n) * 0.5);
      const same = m === n, gv = at('given') || f === 'problem', early = f === 'problem' || at('given') || at('idea') || at('cong') || at('len');
      // 원칙: 그림 안에는 점 이름·값만 · 지금 단계가 다루는 것만 색 · 지난 단계는 가는 회색 · 한 꼭짓점에 색 호는 하나
      if (v === 0 && !ph('trapz')) fillPoly(b, [A, B, Cc], 'amber', 0.16);
      if (v === 1 && !ph('trapz')) fillPoly(b, [B, D, E, Cc], 'amber', 0.1);
      if (at('idea')) { fillPoly(b, [A, B, D], 'sky', 0.22); fillPoly(b, [A, Cc, E], 'green', 0.22); }
      if (at('cong')) { fillPoly(b, [A, B, D], 'sky', 0.34); fillPoly(b, [A, Cc, E], 'green', 0.34); }
      if (at('len')) { fillPoly(b, [A, B, D], 'sky', 0.2); fillPoly(b, [A, Cc, E], 'green', 0.2); }
      if (at('trapz')) fillPoly(b, [B, D, E, Cc], 'amber', 0.24);
      if (at('sub')) { fillPoly(b, [A, B, D], 'green', 0.3); fillPoly(b, [A, Cc, E], 'green', 0.3); fillPoly(b, [A, B, Cc], 'amber', 0.3); }
      if (at('ans')) { if (v === 0) fillPoly(b, [A, B, Cc], 'amber', 0.36); else fillPoly(b, [B, D, E, Cc], 'amber', 0.3); }
      if (at('trap')) { if (v === 0) { fillPoly(b, [A, B, Cc], 'amber', 0.2); fillPoly(b, [B, D, E, Cc], 'rose', 0.12); } else fillPoly(b, [B, D, E, Cc], 'amber', 0.14); }
      line(b, pt(-n - 0.5, 0), pt(m + 0.5, 0), 'ink', 3, { alpha: 0.7 });
      poly(b, [B, D, E, Cc], 'ink', 3.4); line(b, A, B, 'ink', 3.4); line(b, A, Cc, 'ink', 3.4);
      if (at('given')) { [[A, B], [A, Cc], [B, D], [Cc, E]].forEach(([p, q]) => line(b, p, q, 'sky', 4.6)); }
      if (at('trap') && v === 0) poly(b, [B, D, E, Cc], 'rose', 3.4, { dash: [8, 6] });
      if (at('trap') && v === 1) line(b, B, D, 'rose', 5.2);
      // 직각: 주어진 것에서는 색(문제 그림도), 합동 찾기에서는 ∠D·∠E 만 색, 나머지 단계는 가는 회색
      const markerR = (V, P, Q, r) => compact ? Math.min(r, Math.min(dist(V, P), dist(V, Q)) * b.k * 0.3) : r;
      const rc = (V, P, Q, col, now) => { const r = markerR(V, P, Q, V === A ? 28 : 20); return now ? ang(b, V, P, Q, { color: col, r, fa: 0.5 }) : FD(b, V, P, Q, { r }); };
      rc(A, B, Cc, 'amber', gv); rc(D, B, A, 'sky', gv || at('cong')); rc(E, Cc, A, 'sky', gv || at('cong'));
      tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      if (at('cong')) { // 합동 조건의 같은 각: ∠ABD=∠CAE (호 2개). ∠A=90° 직각은 회색이라 꼭짓점 A의 색 호는 하나
        ang(b, B, A, D, { color: 'green', r: markerR(B, A, D, 34), rings: 2, fa: 0.4 }); ang(b, A, Cc, E, { color: 'green', r: markerR(A, Cc, E, 34), rings: 2, fa: 0.4 });
      } else if (ph('len')) { FD(b, B, A, D, { rings: 2, r: markerR(B, A, D, 34) }); FD(b, A, Cc, E, { rings: 2, r: markerR(A, Cc, E, 34) }); }
      const colCE = ph('cong') && !same ? 'green' : 'sky';
      if (at('len')) { // 합동인 변: BD=AE (눈금 2개), CE=AD (눈금 3개). m=n 이면 네 변이 모두 같아요.
        const t1 = 2, t2 = same ? 2 : 3;
        tick(b, B, D, t1, 'sky'); tick(b, A, E, t1, 'sky'); tick(b, Cc, E, t2, colCE); tick(b, D, A, t2, colCE);
      }
      // 길이 글자: 길이를 다루는 단계(주어진 것~길이 구하기)에서 색, 이후는 회색
      const lg = ph('len') ? 16 : 6, lenA = early ? 1 : 0.5, lc = (c) => (early ? c : 'ink');
      G.sideTag(b, B, D, pt(0, -2), `${m} cm`, { color: lc('sky'), size: fs(b, 16), gap: lg, alpha: lenA }); G.sideTag(b, Cc, E, pt(0, -2), `${n} cm`, { color: lc(colCE), size: fs(b, 16), gap: lg, alpha: lenA });
      if (ph('len') && !at('sub') && !at('ans') && !(at('trap') && v === 0)) {
        G.sideTag(b, A, E, pt(0, -5), `${m} cm`, { color: lc('sky'), size: fs(b, 16), gap: 16, alpha: lenA }); G.sideTag(b, D, A, pt(0, -5), `${n} cm`, { color: lc(colCE), size: fs(b, 16), gap: 16, alpha: lenA });
        dim(b, D, E, pt(0, -3), `${m + n} cm`, { color: at('len') || at('trapz') || at('trap') ? 'amber' : 'ink', size: fs(b, 16), off: 44 });
      }
      [A, B, Cc, D, E].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, A, 'A', { dy: 18, size: 18 }); T(b, D, 'D', { dx: -12, dy: 16, size: 18 }); T(b, E, 'E', { dx: 12, dy: 16, size: 18 });
      // 구하는 넓이 x: 글자 x 만 영역 안에 (값은 답 단계에서)
      const xp = G.lerp(mid(B, Cc), A, v === 0 ? 0.62 : 0.4), val = v === 0 ? tri : trap;
      if (K === 'ans') T(b, xp, `x = ${val} cm²`, { size: fs(b, 16), color: 'amber' });
      else if (K === 'trap' && v === 0) T(b, xp, `${trap} cm²`, { size: fs(b, 15), color: 'rose' });
      else T(b, xp, 'x', { size: fs(b, 18), color: 'amber' });
      if (cur) solveCap(b, pt((D.x + E.x) / 2, 0), cur, { dy: ph('len') ? (b.W < 560 ? 84 : 96) : (b.W < 560 ? 62 : 76), size: 16 });
    }
  };

  const r7 = {
    id: 't3-7', title: '합동으로 구하는 넓이', short: '합동과 넓이', solve: r7Solve,
    question: '직각이등변삼각형 ABC의 넓이를 BD, CE만으로 구할 수 있을까?',
    ctl: ['trUm', 'trUe'],
    init: (s) => { s.trUm = 4; s.trUe = 2; s.trV = 0; },
    reroll: (s) => { s.trUm = rint(2, 8); s.trUe = pick([0, 2, 4, 6], s.trUe); s.trV = (s.trV + 1) % 2; },
    model: (s) => {
      const m = clamp(Math.round(s.trUm), 2, 8), e = clamp(Math.round(s.trUe / 2) * 2, 0, 6), n = m + e;
      return { m, n, e, g: lineGeom(m, n), trap: ((m + n) * (m + n)) / 2, tri: (m * m + n * n) / 2, small: m * n };
    },
    draw(b, s, M, C) {
      const { m, n, g, trap, tri, small } = M, { A, B, C: Cc, D, E } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, bboxOf([B, Cc, D, E, pt(-n - 0.5, 0), pt(m + 0.5, 0)]), { t: 50, b: C.problem ? 54 : 96, l: 44, r: 44 });
      const cen = pt((D.x + E.x) / 2, -Math.max(m, n) * 0.5), show = (k) => (C.problem ? false : C.review ? st >= k : true);
      line(b, pt(-n - 0.5, 0), pt(m + 0.5, 0), 'ink', 3, { alpha: 0.7 });
      fillPoly(b, [B, D, E, Cc], C.review && st === 1 ? 'amber' : 'sky', C.review && st === 1 ? 0.2 : 0.1);
      if (show(2)) { fillPoly(b, [A, B, D], 'green', 0.28); fillPoly(b, [A, Cc, E], 'green', 0.28); }
      fillPoly(b, [A, B, Cc], show(3) ? 'amber' : 'sky', show(3) ? 0.3 : 0.12);
      poly(b, [B, D, E, Cc], 'ink', 3.4); line(b, A, B, 'ink', 3.4); line(b, A, Cc, 'ink', 3.4);
      ang(b, A, B, Cc, { color: 'amber', r: 22 }); ang(b, D, B, A, { color: 'sky', r: 18 }); ang(b, E, Cc, A, { color: 'sky', r: 18 });
      tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      G.sideTag(b, B, D, pt(0, -2), `${m} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, Cc, E, pt(0, -2), `${n} cm`, { color: 'sky', size: fs(b, 16), gap: 6 });
            if (!C.problem && show(2)) dim(b, D, E, pt(0, -3), `${m + n} cm`, { color: 'sky', size: fs(b, 16), off: 26 });
      [A, B, Cc, D, E].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, A, 'A', { dy: -18, size: 18 }); T(b, D, 'D', { dy: 18, size: 18 }); T(b, E, 'E', { dy: 18, size: 18 });
      if (C.problem) T(b, mid(B, Cc), v === 0 ? '△ABC의 넓이 x' : '사다리꼴 BDEC의 넓이 x', { dy: -30, size: fs(b, 15), color: 'amber' });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `사다리꼴 BDEC = (${m}+${n})×${m + n}÷2 = ${trap} cm²`;
        else if (C.review && st === 2) { row = `△ABD ≡ △CAE → 두 삼각형의 넓이의 합 = ${m}×${n} = ${small} cm²`; col = 'green'; }
        else if (C.review && st === 3) { row = `△ABC = ${trap} − ${small} = ${tri} cm²`; col = 'amber'; }
        else row = `BD=${m}, CE=${n} → △ABC = ${tri} cm², 사다리꼴 = ${trap} cm²`;
        rowT(b, pt((D.x + E.x) / 2, 0), row, { dy: b.W < 560 ? 62 : 76, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `사다리꼴 BDEC에서 평행한 두 변은 $\\overline{BD}=${M.m}$, $\\overline{CE}=${M.n}$이고 높이는 $\\overline{DE}=${M.m}+${M.n}=${M.m + M.n}$ (△ABD≡△CAE이므로 DE=BD+CE). 넓이는 $${fr(`(${M.m}+${M.n})\\times${M.m + M.n}`, 2)}=${M.trap}$ (cm²)`,
      `△ABD≡△CAE (RHA)이고 직각을 낀 두 변이 $\\overline{BD}=${M.m}$, $\\overline{AD}=${M.n}$이므로 각각의 넓이는 $${fr(`${M.m}\\times${M.n}`, 2)}=${fr(String(M.small), 2)}$ (cm²)`,
      `△ABC의 넓이 = (사다리꼴 BDEC) − △ABD − △CAE $=${M.trap}-${M.small}=${M.tri}$ (cm²)`
    ],
    view: (M) => ({
      guide: '막대로 <b>BD</b>와 <b>CE−BD</b>를 바꿔 보세요(두 변의 합이 짝수가 되도록 돼요). 합동인 두 삼각형을 이용하면 <b>직각이등변삼각형의 넓이</b>를 BD, CE만으로 구할 수 있어요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('BD · CE', `${M.m} cm · ${M.n} cm`, 'sky'), rd('사다리꼴 BDEC', `${M.trap} cm²`, 'sky'), rd('합동인 두 삼각형의 합', `${M.small} cm²`, 'green', 'BD × CE'), rd('△ABC', `${M.tri} cm²`, 'amber', '사다리꼴 − 두 삼각형', null, true)],
      formula: `<p>(사다리꼴) $=${fr(`(${M.m}+${M.n})\\times${M.m + M.n}`, 2)}=${M.trap}$</p><p>$\\triangle ABC=${M.trap}-2\\times${fr(String(M.small), 2)}=${M.tri}$ (cm²)</p>`,
      rule: '합동인 두 직각삼각형으로 DE=BD+CE를 얻고, △ABC = (사다리꼴 BDEC) − 2×(합동인 직각삼각형 하나)이다.',
      notes: notes('사다리꼴의 높이는 BD도 CE도 아니라 <b>DE=BD+CE</b>예요.', '합동인 두 삼각형의 넓이가 같으므로 한 개를 구해서 <b>2배</b>해요.')
    }),
    prob: (M, s) => {
      const { m, n, trap, tri, small } = M, v = (s.trV || 0) % 2;
      const ar = (x) => ({ tex: (v2) => `${v2}\\text{ cm}^2`, plain: (v2) => v2 + ' cm²', pad: 2, valid: (v2) => Number.isInteger(v2) && v2 > 0 });
      if (v === 0) return numProb({ tag: '합동과 넓이 · △ABC', key: `0:${m}:${n}`, stem: `그림에서 점 A는 ${S('DE')} 위의 점이고 $\\angle A=90^{\\circ}$, ${S('AB')}=${S('AC')}이며 $\\overline{BD}\\perp\\overline{DE}$, $\\overline{CE}\\perp\\overline{DE}$이다. ${S('BD')}=${m} cm, ${S('CE')}=${n} cm일 때, △ABC의 넓이 $x$는?`, correct: tri, wrongs: [[trap, '사다리꼴 BDEC의 넓이예요. 두 직각삼각형의 넓이를 빼야 해요.'], [small, '직각삼각형 둘을 더한 넓이예요.'], [small / 2, '직각삼각형 하나의 넓이예요.'], [tri + 2, '다시 계산해 보세요.'], [tri - 2, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0])), ...ar() });
      return numProb({ tag: '합동과 넓이 · 사다리꼴 BDEC', key: `1:${m}:${n}`, stem: `그림에서 점 A는 ${S('DE')} 위의 점이고 $\\angle A=90^{\\circ}$, ${S('AB')}=${S('AC')}이며 $\\overline{BD}\\perp\\overline{DE}$, $\\overline{CE}\\perp\\overline{DE}$이다. ${S('BD')}=${m} cm, ${S('CE')}=${n} cm일 때, 사다리꼴 BDEC의 넓이 $x$는?`, correct: trap, wrongs: [[tri, '△ABC의 넓이예요.'], [m * n, '곱하기만 했어요. 높이는 DE=BD+CE예요.'], [(m + n) * (m + n), '2로 나누지 않았어요.'], [trap + 2, '다시 계산해 보세요.'], [trap - 2, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0])), ...ar() });
    },
    verify: (s) => { const M = r7.model(s), g = M.g; return { ans: G.polyArea([g.B, g.D, g.E, g.C].map((p) => pt(p.x, p.y))) * -1, model: M.trap, extra: [[Math.abs(G.polyArea([g.A, g.B, g.C])), M.tri], [angBetween(g.A, g.B, g.C), 90]] }; }
  };

  /* ====================================================================== 풀이 흐름 (t3-1 ~ t3-6) */
  const SK = G.SVK, mkSolve = G.mkSolve;
  const ov = (n) => `\\overline{${n}}`;
  const dd = (v) => `${v}^{\\circ}`;

  /* ---- t3-1 RHA 합동 · v0: BC → EF · v1: ∠A=∠D → ∠E ---- */
  const r1Plan = (M, s) => {
    const { a, m } = M, v = (s.trV || 0) % 2, b90 = 90 - a;
    const T1 = rtri(1, a, 0), U = rtri(1, a, cos(a) + 0.55), steps = [], items = [];
    const cen1 = pt(T1.A.x * 0.4, T1.B.y * 0.4), cen2 = pt(U.A.x * 0.4 + U.C.x * 0.6, U.B.y * 0.4);
    const g0 = `두 직각삼각형 ABC, DEF에서 $\\angle C=\\angle F=90^{\\circ}$, $${ov('AB')}=${ov('DE')}$, $\\angle A=\\angle D$예요.`;
    steps.push({ id: 'given', k: 'given', t: v === 0 ? `${g0} $${ov('BC')}=${m}$ cm이고, 구하는 것은 $${ov('EF')}=x$.` : `${g0} $\\angle A=\\angle D=${dd(a)}$이고, 구하는 것은 $\\angle E=x$.`, cap: v === 0 ? `∠C=∠F=90°, AB=DE, ∠A=∠D, BC=${m} cm` : `∠C=∠F=90°, AB=DE, ∠A=∠D=${a}°` });
    steps.push({ id: 'idea', k: 'idea', t: `두 삼각형이 합동이면 대응하는 ${v === 0 ? '변의 길이' : '각의 크기'}가 같아요. 먼저 직각, 빗변, 한 예각이 같은지 하나씩 확인해서 합동인지 살펴요.`, cap: `합동이면 대응${v === 0 ? '변' : '각'}이 같다 → 먼저 합동 조건 확인` });
    steps.push({ id: 'R', k: 'fig', lb: '합동 조건 ①', t: '직각이 같아요: $\\angle C=\\angle F=90^{\\circ}$ (Right angle)', cap: '∠C=∠F=90° (R)' });
    steps.push({ id: 'H', k: 'fig', lb: '합동 조건 ②', t: `빗변의 길이가 같아요: $${ov('AB')}=${ov('DE')}$ (Hypotenuse)`, cap: 'AB=DE (H)' });
    steps.push({ id: 'A', k: 'fig', lb: '합동 조건 ③', t: '한 예각의 크기가 같아요: $\\angle A=\\angle D$ (Angle)', cap: '∠A=∠D (A)' });
    steps.push({ id: 'cong', k: 'fig', lb: '합동', t: '직각삼각형에서 빗변의 길이와 한 예각의 크기가 각각 같으므로 △ABC≡△DEF (RHA 합동)이에요.', cap: '△ABC≡△DEF (RHA 합동)' });
    if (v === 0) steps.push({ id: 'eq', k: 'eq', t: `대응변의 길이는 같으므로 $x=${ov('EF')}=${ov('BC')}=${m}$ cm`, cap: `EF=BC=${m} cm` });
    else steps.push({ id: 'eq', k: 'eq', t: `$\\angle E$의 대응각은 $\\angle B$예요. △ABC에서 $\\angle B=180^{\\circ}-90^{\\circ}-${dd(a)}=${dd(b90)}$이므로 $x=\\angle E=\\angle B=${dd(b90)}$`, cap: `∠E=∠B=180°−90°−${a}°=${b90}°` });
    steps.push({ id: 'ans', k: 'ans', t: v === 0 ? `$x=${m}\\text{ cm}$` : `$x=${dd(b90)}$`, cap: v === 0 ? `x = ${m} cm` : `x = ${b90}°` });
    [[T1, cen1], [U, cen2]].forEach(([Tr]) => {
      items.push(SK.ang(Tr.C, Tr.A, Tr.B, { r: 20, on: ['given', 'R'], col: 'sky', cols: { R: 'green' } }), SK.tick(Tr.A, Tr.B, 1, { on: ['given', 'H'], col: 'amber' }),
        SK.ang(Tr.A, Tr.B, Tr.C, { r: 30, rings: 2, ld: 54, on: ['given', 'A'], col: 'sky', cols: { A: 'green' }, label: v === 1 && Tr === T1 ? dg(a) : '', gl: true, glTo: 'eq' }));
    });
    items.push(SK.fill([T1.A, T1.B, T1.C], { at: 'cong', to: 'eq', col: 'sky', a: 0.26 }), SK.fill([U.A, U.B, U.C], { at: 'cong', to: 'eq', col: 'green', a: 0.26 }));
    if (v === 0) items.push(SK.len(T1.B, T1.C, cen1, `${m} cm`, { on: ['given', 'eq'], col: 'sky', size: 16, gap: 6 }), SK.len(U.B, U.C, cen2, 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 6, labels: { ans: `x=${m} cm` } }));
    else items.push(SK.ang(U.B, U.C, U.A, { r: 28, ld: 50, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${b90}°` }, gl: true }), SK.ang(T1.B, T1.C, T1.A, { r: 28, ld: 50, at: 'eq', col: 'green', label: dg(b90), size: 15, gl: true }));
    return {
      fit: [T1.A, T1.B, T1.C, U.A, U.B, U.C], steps, items, l: 36, r: 36,
      base: (b) => { G.poly(b, [T1.A, T1.B, T1.C], 'ink', 3.4); G.poly(b, [U.A, U.B, U.C], 'ink', 3.4); G.fillPoly(b, [T1.A, T1.B, T1.C], 'sky', 0.08); G.fillPoly(b, [U.A, U.B, U.C], 'sky', 0.08); },
      names: (b) => [[T1, ['A', 'B', 'C'], cen1], [U, ['D', 'E', 'F'], cen2]].forEach(([Tr, nm, cc]) => G.dots(b, [Tr.A, Tr.B, Tr.C], nm, cc, { size: 17 }))
    };
  };
  r1.solve = mkSolve(r1Plan);

  /* ---- t3-2 RHS 합동 · v0: BD → BC · v1: ∠A → ∠B · v2: ∠B → ∠CAD ---- */
  const r2Plan = (M, s) => {
    const { bt, ad, m } = M, v = (s.trV || 0) % 3, hw = cos(bt), h = sin(bt);
    const A = pt(0, -h), B = pt(-hw, 0), Cc = pt(hw, 0), D = pt(0, 0), cen = pt(0, -h * 0.4), steps = [], items = [];
    const g0 = `$${ov('AB')}=${ov('AC')}$이고 $\\angle ADB=90^{\\circ}$예요.`;
    steps.push({ id: 'given', k: 'given', t: v === 0 ? `${g0} $${ov('BD')}=${m}$ cm이고, 구하는 것은 $${ov('BC')}=x$.` : v === 1 ? `${g0} $\\angle A=${dd(2 * ad)}$이고, 구하는 것은 $\\angle B=x$.` : `${g0} $\\angle B=${dd(bt)}$이고, 구하는 것은 $\\angle CAD=x$.`, cap: v === 0 ? `AB=AC, AD⊥BC, BD=${m} cm` : v === 1 ? `AB=AC, AD⊥BC, ∠A=${2 * ad}°` : `AB=AC, AD⊥BC, ∠B=${bt}°` });
    steps.push({ id: 'idea', k: 'idea', t: v === 0 ? 'BC=BD+CD이니까 CD의 길이가 필요해요. BD와 CD가 각각 들어 있는 두 직각삼각형 ABD, ACD가 합동이면 BD=CD예요.' : v === 1 ? '∠B는 직각삼각형 ABD의 예각이라서, ∠BAD를 알면 구해요. 두 직각삼각형 ABD, ACD가 합동이면 AD가 ∠A를 반으로 나눠요.' : '∠CAD는 ∠BAD와 같을 것 같아요. 두 직각삼각형 ABD, ACD가 합동이면 대응각이 같으니 ∠CAD=∠BAD이고, ∠BAD는 직각삼각형 ABD에서 구해요.', cap: '두 직각삼각형 ABD, ACD가 합동인지 확인' });
    steps.push({ id: 'R', k: 'fig', lb: '합동 조건 ①', t: '$\\angle ADB=\\angle ADC=90^{\\circ}$ (Right angle)', cap: '∠ADB=∠ADC=90° (R)' });
    steps.push({ id: 'H', k: 'fig', lb: '합동 조건 ②', t: `빗변의 길이가 같아요: $${ov('AB')}=${ov('AC')}$ (Hypotenuse)`, cap: 'AB=AC (H)' });
    steps.push({ id: 'S', k: 'fig', lb: '합동 조건 ③', t: '다른 한 변이 공통이에요: $\\overline{AD}$는 공통 (Side)', cap: 'AD는 공통 (S)' });
    steps.push({ id: 'cong', k: 'fig', lb: '합동', t: '직각삼각형에서 빗변과 다른 한 변이 각각 같으므로 △ABD≡△ACD (RHS 합동)이에요.', cap: '△ABD≡△ACD (RHS 합동)' });
    if (v === 0) steps.push({ id: 'eq', k: 'eq', t: `대응변이므로 $${ov('CD')}=${ov('BD')}=${m}$ cm. 따라서 $x=${ov('BD')}+${ov('CD')}=${m}+${m}=${2 * m}$ (cm)`, cap: `x=BD+CD=${m}+${m}=${2 * m} cm` });
    else if (v === 1) steps.push({ id: 'eq', k: 'eq', t: `대응각이므로 $\\angle BAD=\\angle CAD=\\frac{${dd(2 * ad)}}{2}=${dd(ad)}$. △ABD에서 $x=\\angle B=90^{\\circ}-${dd(ad)}=${dd(bt)}$`, cap: `∠BAD=\\frac{${2 * ad}°}{2}=${ad}° → x=90°−${ad}°=${bt}°` });
    else steps.push({ id: 'eq', k: 'eq', t: `△ABD에서 $\\angle BAD=90^{\\circ}-${dd(bt)}=${dd(ad)}$이고, 대응각이므로 $x=\\angle CAD=\\angle BAD=${dd(ad)}$`, cap: `x=∠CAD=∠BAD=90°−${bt}°=${ad}°` });
    const ans = v === 0 ? `${2 * m} cm` : dg(v === 1 ? bt : ad);
    steps.push({ id: 'ans', k: 'ans', t: v === 0 ? `$x=${2 * m}\\text{ cm}$` : `$x=${dd(v === 1 ? bt : ad)}$`, cap: `x = ${ans}` });
    items.push(SK.ang(D, A, B, { r: 20, on: ['given', 'R'], col: 'sky', cols: { R: 'green' } }), SK.ang(D, A, Cc, { r: 20, at: 'R', col: 'green' }),
      SK.tick(A, B, 1, { on: ['given', 'H'], col: 'amber' }), SK.tick(A, Cc, 1, { on: ['given', 'H'], col: 'amber' }), SK.seg(A, D, { at: 'given', to: 'S', col: 'green', w: 3.6 }), SK.tick(A, D, 2, { at: 'S', col: 'rose' }),
      SK.fill([A, B, D], { at: 'cong', to: 'eq', col: 'sky', a: 0.26 }), SK.fill([A, D, Cc], { at: 'cong', to: 'eq', col: 'violet', a: 0.26 }));
    if (v === 0) items.push(SK.len(B, D, pt(0, -2), `${m} cm`, { on: ['given', 'eq'], col: 'sky', size: 16, gap: 8 }), SK.len(D, Cc, pt(0, -2), `${m} cm`, { at: 'eq', col: 'green', size: 16, gap: 8 }), SK.dim(B, Cc, cen, 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, off: 34, labels: { ans: `x=${2 * m} cm` } }));
    else if (v === 1) items.push(SK.ang(A, B, Cc, { r: 34, ld: 62, lr: -ad / 2, on: ['given'], col: 'sky', label: dg(2 * ad), gl: true, glTo: 'cong' }), SK.ang(A, B, D, { r: 44, ld: 72, at: 'eq', col: 'green', label: dg(ad), size: 15 }), SK.ang(B, Cc, A, { r: 30, ld: 54, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${bt}°` }, gl: true }));
    else items.push(SK.ang(B, Cc, A, { r: 30, ld: 54, on: ['given'], col: 'sky', label: dg(bt), gl: true, glTo: 'eq' }), SK.ang(A, B, D, { r: 40, ld: 64, at: 'eq', col: 'green', label: dg(ad), size: 15 }), SK.ang(A, D, Cc, { r: 40, ld: 64, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${ad}°` }, gl: true }));
    return {
      fit: [A, B, Cc, pt(0, v === 0 ? 0.55 : 0.12)], steps, items, l: 50, r: 50,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.08); G.poly(b, [A, B, Cc], 'ink', 3.6); },
      names: (b) => { G.dots(b, [A, B, Cc], ['A', 'B', 'C'], cen, { size: 18 }); b.point(D, { color: 'ink', r: 4.5 }); T(b, D, 'D', { dy: 18, size: 18 }); }
    };
  };
  r2.solve = mkSolve(r2Plan);

  /* ---- t3-3 합동이 될 수 있을까? (반례) · 「다음 조건이 같을 때 합동인가?」 ---- */
  const ob = (n) => `\\overline{${n}}`;
  const R3 = [
    { id: 'rha1', h: `${ob('AB')}=${ob('DE')},\\ \\angle A=\\angle D`, cap: 'AB=DE, ∠A=∠D', cong: true, why: 'RHA 합동', m: { hyp: 1, ang: 'A' }, T2: null },
    { id: 'rhs', h: `${ob('AB')}=${ob('DE')},\\ ${ob('AC')}=${ob('DF')}`, cap: 'AB=DE, AC=DF', cong: true, why: 'RHS 합동', m: { hyp: 1, legA: 2 }, T2: null },
    { id: 'sas', h: `${ob('AC')}=${ob('DF')},\\ ${ob('BC')}=${ob('EF')}`, cap: 'AC=DF, BC=EF', cong: true, why: 'SAS 합동 (직각을 낀 두 변)', m: { legA: 2, legB: 3 }, T2: null },
    { id: 'asa', h: `${ob('BC')}=${ob('EF')},\\ \\angle B=\\angle E`, cap: 'BC=EF, ∠B=∠E', cong: true, why: 'ASA 합동', m: { legB: 3, ang: 'B' }, T2: null },
    { id: 'rha2', h: `${ob('AB')}=${ob('DE')},\\ \\angle B=\\angle E`, cap: 'AB=DE, ∠B=∠E', cong: true, why: 'RHA 합동', m: { hyp: 1, ang: 'B' }, T2: null },
    { id: 'aa', h: '\\angle A=\\angle D,\\ \\angle B=\\angle E', cap: '∠A=∠D, ∠B=∠E', cong: false, why: '두 예각만 같아요', m: { ang: 'AB' }, T2: [6, 4.5], reason: '두 예각이 같아도 크기가 다른 닮은 삼각형을 만들 수 있어요.' },
    { id: 'hyp', h: `${ob('AB')}=${ob('DE')}`, cap: 'AB=DE', cong: false, why: '빗변만 같아요', m: { hyp: 1 }, T2: [Math.sqrt(21), 2], reason: '빗변의 길이는 같지만 두 직각변의 길이가 원래 삼각형과 다른 삼각형을 만들 수 있어요.' },
    { id: 'angA', h: '\\angle A=\\angle D', cap: '∠A=∠D', cong: false, why: '한 예각만 같아요', m: { ang: 'A' }, T2: [6, 4.5], reason: '한 예각만 같으면 크기가 다른 삼각형을 만들 수 있어요.' },
    { id: 'legA', h: `${ob('AC')}=${ob('DF')}`, cap: 'AC=DF', cong: false, why: '한 직각변만 같아요', m: { legA: 2 }, T2: [4, 2], reason: '한 직각변만 같으면 다른 변이 달라질 수 있어요.' },
    { id: 'legB', h: `${ob('BC')}=${ob('EF')}`, cap: 'BC=EF', cong: false, why: '한 직각변만 같아요', m: { legB: 3 }, T2: [2, 3], reason: '한 직각변만 같으면 다른 변이 달라질 수 있어요.' }
  ];
  const r3Pick = (s) => { const qi = s.trQi || 0, pool = R3.filter((c) => c.cong === (qi % 2 === 0)), rnd = G.seeded('r33|' + qi); return G.shuffle(pool, rnd)[0]; };
  const rt3 = (p, q, ax) => ({ A: pt(ax, 0), B: pt(ax + p, -q), C: pt(ax + p, 0) });
  const r3Plan = (M, s) => {
    const c = r3Pick(s), P1 = 4, Q1 = 3, T1 = rt3(P1, Q1, 0), gap = 1.9, U = rt3(P1, Q1, P1 + gap), alt = c.T2 ? rt3(c.T2[0], c.T2[1], P1 + gap) : null;
    const cen1 = pt(P1 * 0.6, -Q1 * 0.4), cen2 = pt(P1 + gap + P1 * 0.6, -Q1 * 0.4), steps = [], items = [];
    steps.push({ id: 'given', k: 'given', t: `$\\angle C=\\angle F=90^{\\circ}$인 두 직각삼각형 ABC, DEF에서 $${c.h}$가 각각 같아요(그림의 같은 표시). 두 삼각형이 합동인지 알아봐요.`, cap: `∠C=∠F=90°, ${c.cap}` });
    steps.push({ id: 'idea', k: 'idea', t: '직각삼각형은 직각이 이미 같으니, 합동 조건(RHA, RHS, 그리고 SAS, ASA)에 맞게 직각 말고 같은 것이 충분한지 세어 봐요. 같은 것이 하나뿐이면 모양을 바꿀 수 있어서 합동이 아닐 수 있어요.', cap: '직각 말고 같은 것이 충분한가?' });
    steps.push({ id: 'R', k: 'fig', lb: '같은 것 ①', t: '직각이 같아요: $\\angle C=\\angle F=90^{\\circ}$', cap: '∠C=∠F=90°' });
    steps.push({ id: 'same', k: 'fig', lb: '같은 것 ②', t: `문제에서 같다고 한 것: $${c.h}$ (같은 표시)`, cap: c.cap });
    if (c.cong) {
      steps.push({ id: 'cong', k: 'fig', lb: '합동 판정', t: `직각을 빼고도 같은 것이 합동 조건에 맞아요. 따라서 △ABC≡△DEF (${c.why})이에요.`, cap: `△ABC≡△DEF (${c.why})` });
      steps.push({ id: 'ans', k: 'ans', t: `합동이에요 (${c.why})`, cap: `합동이다 (${c.why})` });
    } else {
      steps.push({ id: 'cong', k: 'fig', lb: '반례 찾기', t: `${c.reason} 점선 삼각형은 주어진 같은 조건을 유지하면서 원래 삼각형과 합동이 아닌 예예요. 같은 조건으로 합동인 예도 있으므로, 주어진 조건만으로는 합동이라고 할 수 없어요.`, cap: '주어진 조건은 같아도 합동이 아닌 예가 있어요' });
      steps.push({ id: 'ans', k: 'ans', t: `주어진 조건만으로는 합동이라고 할 수 없어요 (${c.why}).`, cap: '조건이 부족해 합동을 보장할 수 없어요' });
      steps.push({ id: 'trap', k: 'trap', t: '직각 하나만 같은 것으로는 부족해요. 합동 조건에 맞는 요소(변·각)이 충분한지 꼭 확인해요.', cap: '합동 조건에 맞는 요소가 충분한지 확인!' });
    }
    [[T1, 1], [U, 2]].forEach(([Tr]) => {
      const mk = c.m;
      items.push(SK.ang(Tr.C, Tr.A, Tr.B, { r: 18, on: ['given', 'R'], col: 'sky', cols: { R: 'green' } }));
      if (mk.hyp) items.push(SK.tick(Tr.A, Tr.B, 1, { on: ['given', 'same'], col: 'amber' }));
      if (mk.legA) items.push(SK.tick(Tr.A, Tr.C, mk.legA, { on: ['given', 'same'], col: 'rose' }));
      if (mk.legB) items.push(SK.tick(Tr.B, Tr.C, mk.legB, { on: ['given', 'same'], col: 'violet' }));
      if (mk.ang && mk.ang.includes('A')) items.push(SK.ang(Tr.A, Tr.B, Tr.C, { r: 28, rings: 2, on: ['given', 'same'], col: 'amber' }));
      if (mk.ang && mk.ang.includes('B')) items.push(SK.ang(Tr.B, Tr.C, Tr.A, { r: 28, rings: mk.ang === 'AB' ? 3 : 2, on: ['given', 'same'], col: 'green' }));
    });
    items.push(SK.fill([T1.A, T1.B, T1.C], { at: 'cong', col: c.cong ? 'sky' : 'rose', a: 0.22 }), SK.fill([U.A, U.B, U.C], { at: 'cong', col: c.cong ? 'green' : 'rose', a: 0.22 }));
    if (alt) items.push(SK.poly([alt.A, alt.B, alt.C], { at: 'cong', col: 'rose', dash: [8, 6], w: 3.4 }));
    return {
      fit: alt ? [T1.A, T1.B, T1.C, U.A, U.B, U.C, alt.B, alt.C, pt(U.A.x, -4.6)] : [T1.A, T1.B, T1.C, U.A, U.B, U.C], steps, items, l: 36, r: 36,
      base: (b) => { G.fillPoly(b, [T1.A, T1.B, T1.C], 'sky', 0.08); G.fillPoly(b, [U.A, U.B, U.C], 'sky', 0.08); G.poly(b, [T1.A, T1.B, T1.C], 'ink', 3.4); G.poly(b, [U.A, U.B, U.C], 'ink', 3.4); },
      names: (b) => [[T1, ['A', 'B', 'C'], cen1], [U, ['D', 'E', 'F'], cen2]].forEach(([Tr, nm, cc]) => G.dots(b, [Tr.A, Tr.B, Tr.C], nm, cc, { size: 17 }))
    };
  };
  r3.solve = mkSolve(r3Plan);
  r3.prob = (M, s) => {
    const c = r3Pick(s), key = 'q' + (s.trQi || 0), ans = c.cong ? `합동이에요 (${c.why})` : `주어진 조건만으로는 합동이라고 할 수 없어요 (${c.why}).`;
    return {
      tag: '직각삼각형의 합동 조건 · 주어진 조건으로 판단하기', key,
      stem: `그림과 같이 $\\angle C=\\angle F=90^{\\circ}$인 두 직각삼각형 ABC, DEF에서 $${c.h}$이다. 주어진 조건만으로 두 삼각형이 반드시 합동이라고 할 수 있는가? 합동 조건 또는 반례로 설명하시오.`,
      ansHTML: ans, choices: [{ t: '', p: ans, ok: true, hint: '' }]
    };
  };

  /* ---- t3-4 사다리꼴 속 직각삼각형 · v0: AC · v1 [함정]: 사다리꼴 AEDC의 넓이 · v2: ∠CDB ---- */
  const r4Plan = (M, s) => {
    const { p, q, al } = M, v = vv4(M, s), P0 = v === 2 ? tan(al) : p, Q0 = v === 2 ? 1 : q, g = trapGeom(P0, Q0), { A, B, C: Cc, E, D } = g;
    const cen = pt((A.x + Cc.x) / 2, -Math.max(P0, Q0) * 0.4), steps = [], items = [], area = ((p + q) * (p + q)) / 2;
    const g0 = `$\\angle A=\\angle C=90^{\\circ}$, $\\angle EBD=90^{\\circ}$, $${ov('BE')}=${ov('BD')}$이고`;
    steps.push({ id: 'given', k: 'given', t: v === 2 ? `${g0} $\\angle ABE=${dd(al)}$예요. 구하는 것은 $\\angle CDB=x$.` : `${g0} $${ov('AE')}=${p}$ cm, $${ov('AB')}=${q}$ cm예요. 구하는 것은 ${v === 0 ? `$${ov('AC')}=x$` : '사다리꼴 AEDC의 넓이 $x$'}.`, cap: v === 2 ? `∠A=∠C=∠EBD=90°, BE=BD, ∠ABE=${al}°` : `BE=BD, AE=${p} cm, AB=${q} cm` });
    steps.push({ id: 'idea', k: 'idea', t: v === 2 ? '∠CDB는 직각삼각형 BCD의 예각이에요. ∠ABE와 같은지 알아보려고, 점 B에서 일직선으로 이어진 세 각의 합이 180°인 것을 이용해요.' : v === 0 ? 'AC=AB+BC인데 BC를 몰라요. BC는 △BCD의 한 변이니까, 직각삼각형 EAB와 BCD가 합동이면 BC=AE예요.' : '사다리꼴의 넓이는 (윗변+아랫변)×높이÷2예요. 평행한 두 변 AE, CD와 높이 AC가 필요한데, 합동인 직각삼각형 EAB와 BCD에서 CD=AB, BC=AE로 구해요.', cap: v === 2 ? '일직선 → ●+×=90°' : '직각삼각형 EAB와 BCD가 합동인지 확인' });
    steps.push({ id: 'sum', k: 'fig', lb: '각 구하기 ①', t: '점 B에서 일직선이므로 $\\angle EBA+\\angle EBD+\\angle CBD=180^{\\circ}$이고 $\\angle EBD=90^{\\circ}$예요. 그래서 $\\angle EBA+\\angle CBD=90^{\\circ}$ (●+×=90°).', cap: '∠EBA+∠CBD=180°−90°=90° (●+×)' });
    steps.push({ id: 'eqang', k: 'fig', lb: '각 구하기 ②', t: '△BCD에서 $\\angle CBD+\\angle BDC=90^{\\circ}$이므로 $\\angle EBA=\\angle BDC$예요.', cap: '∠CBD+∠BDC=90° → ∠EBA=∠BDC' });
    if (v === 2) { steps.push({ id: 'eq', k: 'eq', t: `$x=\\angle CDB=\\angle ABE=${dd(al)}$`, cap: `x=∠CDB=∠ABE=${al}°` }); steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(al)}$`, cap: `x = ${al}°` }); steps.push({ id: 'trap', k: 'trap', t: `$\\angle CBD=90^{\\circ}-${dd(al)}=${dd(90 - al)}$를 답으로 하면 안 돼요. 구하는 각은 $\\angle CDB$이고, 이것은 $\\angle ABE$와 같아요.`, cap: `∠CBD=${90 - al}°는 답이 아니에요 → x=∠CDB=${al}°` }); }
    else {
      steps.push({ id: 'cong', k: 'fig', lb: '합동', t: '△EAB와 △BCD에서 $\\angle A=\\angle C=90^{\\circ}$, $\\overline{EB}=\\overline{BD}$, $\\angle EBA=\\angle BDC$이므로 △EAB≡△BCD (RHA 합동)이에요.', cap: '△EAB≡△BCD (RHA 합동)' });
      steps.push({ id: 'len', k: 'fig', lb: '길이 구하기', t: `대응변이므로 $${ov('BC')}=${ov('AE')}=${p}$ cm, $${ov('CD')}=${ov('AB')}=${q}$ cm예요.`, cap: `BC=AE=${p} cm, CD=AB=${q} cm` });
      if (v === 0) { steps.push({ id: 'eq', k: 'eq', t: `$x=${ov('AC')}=${ov('AB')}+${ov('BC')}=${q}+${p}=${p + q}$ (cm)`, cap: `x=AB+BC=${q}+${p}=${p + q} cm` }); steps.push({ id: 'ans', k: 'ans', t: `$x=${p + q}\\text{ cm}$`, cap: `x = ${p + q} cm` }); }
      else {
        steps.push({ id: 'eq', k: 'eq', t: `평행한 두 변은 $${ov('AE')}=${p}$, $${ov('CD')}=${q}$이고 높이는 $${ov('AC')}=${q}+${p}=${p + q}$이므로 $x=\\frac{(${p}+${q})\\times${p + q}}{2}=${area}$ (cm²)`, cap: `x=\\frac{(${p}+${q})×${p + q}}{2}=${area} cm²` });
        steps.push({ id: 'ans', k: 'ans', t: `$x=${area}\\text{ cm}^2$`, cap: `x = ${area} cm²` });
        steps.push({ id: 'trap', k: 'trap', t: `높이를 $${ov('AB')}=${q}$로 놓고 $\\frac{(${p}+${q})\\times${q}}{2}$로 구하면 틀려요. 높이는 두 평행한 변 사이의 거리인 $${ov('AC')}=${p + q}$예요.`, cap: `높이는 AB=${q}${G.josa(q, '이', '가')} 아니라 AC=${p + q}` });
      }
    }
    items.push(SK.ang(A, B, E, { r: 22, on: ['given', 'cong'], col: 'sky', cols: { cong: 'green' } }), SK.ang(Cc, B, D, { r: 22, on: ['given', 'cong'], col: 'sky', cols: { cong: 'green' } }), SK.ang(B, E, D, { r: 26, on: ['given'], col: 'amber' }),
      SK.tick(E, B, 2, { at: 'given', col: 'rose' }), SK.tick(B, D, 2, { at: 'given', col: 'rose' }),
      SK.ang(B, A, E, { r: 36, ld: 58, on: ['sum', 'eqang', 'cong'], col: 'sky', label: v === 2 ? dg(al) : '', gl: true, glTo: 'eq' }), SK.ang(B, Cc, D, { r: 30, ld: 52, rings: 2, at: 'sum', col: 'green', label: v === 2 ? dg(90 - al) : '', gl: true, glTo: 'sum' }),
      SK.ang(D, B, Cc, { r: 30, ld: 52, on: ['eqang', 'cong'], col: 'sky', gl: false }),
      SK.fill([A, B, E], { at: 'cong', col: 'sky', a: 0.24 }), SK.fill([B, Cc, D], { at: 'cong', col: 'green', a: 0.24 }));
    if (v === 0) items.push(SK.len(A, E, pt(50, 0), `${p} cm`, { on: ['given', 'len'], col: 'sky', size: 16, gap: 6 }), SK.len(A, B, pt(0, -5), `${q} cm`, { on: ['given', 'len'], col: 'sky', size: 16, gap: 8 }), SK.len(B, Cc, pt(0, -5), `${p} cm`, { at: 'len', col: 'green', size: 16, gap: 8 }), SK.len(Cc, D, pt(-50, -5), `${q} cm`, { at: 'len', col: 'green', size: 16, gap: 6 }), SK.dim(A, Cc, pt(0, -3), 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, off: 30, labels: { ans: `x=${p + q} cm` } }));
    else if (v === 1) items.push(SK.fill([A, E, D, Cc], { on: ['given', 'eq', 'ans'], col: 'amber', a: 0.16 }), SK.len(A, E, pt(50, 0), `${p} cm`, { on: ['given', 'len', 'eq'], col: 'sky', size: 16, gap: 6 }), SK.len(A, B, pt(0, -5), `${q} cm`, { on: ['given', 'len'], col: 'sky', size: 16, gap: 8 }), SK.len(B, Cc, pt(0, -5), `${p} cm`, { at: 'len', col: 'green', size: 16, gap: 8 }), SK.len(Cc, D, pt(-50, -5), `${q} cm`, { at: 'len', to: 'eq', col: 'green', size: 16, gap: 6 }), SK.txt(pt((A.x + Cc.x) / 2, (A.y + (E.y + D.y) / 2) / 2), 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, labels: { ans: `x=${area} cm²` } }), SK.seg(A, B, { at: 'trap', col: 'rose', w: 5.4 }));
    else items.push(SK.ang(D, B, Cc, { r: 34, ld: 56, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${al}°` }, gl: true }));
    return {
      fit: [A, B, Cc, E, D, pt(0, v === 0 ? 0.55 : 0.12)], steps, items, l: 44, r: 44,
      base: (b) => { G.line(b, A, Cc, 'ink', 3.4); G.line(b, A, E, 'ink', 3.4); G.line(b, Cc, D, 'ink', 3.4); G.line(b, E, B, 'ink', 3.4); G.line(b, B, D, 'ink', 3.4); G.line(b, E, D, 'ink', 3.4, { alpha: 0.8 }); },
      names: (b) => { [A, B, Cc, E, D].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); ['A', 'B', 'C', 'E', 'D'].forEach((nm, i) => G.tagOut(b, [A, B, Cc, E, D][i], cen, nm, { size: 18 })); }
    };
  };
  r4.solve = mkSolve(r4Plan);

  /* ---- t3-5 직선 ℓ 을 지나는 직각이등변삼각형 · v0: DE · v1: CE · v2 [함정]: 사다리꼴 BDEC 의 넓이 ---- */
  const r5Plan = (M, s) => {
    const { m, n, g } = M, { A, B, C: Cc, D, E } = g, v = vv5(M, s), cen = pt((D.x + E.x) / 2, -Math.max(m, n) * 0.5), steps = [], items = [], area = ((m + n) * (m + n)) / 2;
    const g0 = `$\\angle A=90^{\\circ}$, $${ov('AB')}=${ov('AC')}$인 직각이등변삼각형이고, B, C에서 직선 $\\ell$에 내린 수선의 발이 D, E예요.`;
    steps.push({ id: 'given', k: 'given', t: v === 0 ? `${g0} $${ov('BD')}=${m}$ cm, $${ov('CE')}=${n}$ cm이고, 구하는 것은 $${ov('DE')}=x$.` : v === 1 ? `${g0} $${ov('BD')}=${m}$ cm, $${ov('AD')}=${n}$ cm이고, 구하는 것은 $${ov('CE')}=x$.` : `${g0} $${ov('BD')}=${m}$ cm, $${ov('CE')}=${n}$ cm이고, 구하는 것은 사다리꼴 BDEC의 넓이 $x$.`, cap: v === 0 ? `AB=AC, ∠A=90°, BD=${m} cm, CE=${n} cm` : v === 1 ? `AB=AC, ∠A=90°, BD=${m} cm, AD=${n} cm` : `AB=AC, ∠A=90°, BD=${m} cm, CE=${n} cm` });
    steps.push({ id: 'idea', k: 'idea', t: v === 0 ? 'DE=AD+AE이니까 AD, AE의 길이가 필요해요. BD, CE를 이용하도록, 이 둘을 변으로 가지는 두 직각삼각형 ABD, CAE가 합동인지 찾아요.' : v === 1 ? 'CE는 직각삼각형 CAE의 변이에요. △ABD와 합동이라면 CE가 AD와 같을 거예요. 두 직각삼각형 ABD, CAE가 합동인지 찾아요.' : '사다리꼴의 넓이는 (윗변+아랫변)×높이÷2예요. 평행한 두 변 BD, CE와 높이 DE가 필요하니, DE=AD+AE를 합동인 두 직각삼각형 ABD, CAE로 구해요.', cap: '직각삼각형 ABD, CAE가 합동인지 확인' });
    steps.push({ id: 'sum', k: 'fig', lb: '각 구하기', t: '점 A에서 일직선이므로 $\\angle BAD+\\angle BAC+\\angle CAE=180^{\\circ}$이고 $\\angle BAC=90^{\\circ}$예요. 그래서 $\\angle BAD+\\angle CAE=90^{\\circ}$이고, △ABD에서 $\\angle ABD+\\angle BAD=90^{\\circ}$이므로 $\\angle ABD=\\angle CAE$.', cap: '∠BAD+∠CAE=90°, ∠ABD+∠BAD=90° → ∠ABD=∠CAE' });
    steps.push({ id: 'cong', k: 'fig', lb: '합동', t: '△ABD와 △CAE에서 $\\angle D=\\angle E=90^{\\circ}$, $\\overline{AB}=\\overline{CA}$, $\\angle ABD=\\angle CAE$이므로 △ABD≡△CAE (RHA 합동)이에요.', cap: '△ABD≡△CAE (RHA 합동)' });
    steps.push({ id: 'len', k: 'fig', lb: '길이 구하기', t: `대응변이므로 $${ov('AE')}=${ov('BD')}=${m}$ cm, $${ov('AD')}=${ov('CE')}=${n}$ cm예요.`, cap: `AE=BD=${m} cm, AD=CE=${n} cm` });
    if (v === 0) { steps.push({ id: 'eq', k: 'eq', t: `$x=${ov('DE')}=${ov('AD')}+${ov('AE')}=${n}+${m}=${m + n}$ (cm)`, cap: `x=AD+AE=${n}+${m}=${m + n} cm` }); steps.push({ id: 'ans', k: 'ans', t: `$x=${m + n}\\text{ cm}$`, cap: `x = ${m + n} cm` }); }
    else if (v === 1) { steps.push({ id: 'eq', k: 'eq', t: `$x=${ov('CE')}=${ov('AD')}=${n}$ cm`, cap: `x=CE=AD=${n} cm` }); steps.push({ id: 'ans', k: 'ans', t: `$x=${n}\\text{ cm}$`, cap: `x = ${n} cm` }); }
    else {
      steps.push({ id: 'eq', k: 'eq', t: `평행한 두 변은 $${ov('BD')}=${m}$, $${ov('CE')}=${n}$이고 높이는 $${ov('DE')}=${m + n}$이므로 $x=\\frac{(${m}+${n})\\times${m + n}}{2}=${area}$ (cm²)`, cap: `x=\\frac{(${m}+${n})×${m + n}}{2}=${area} cm²` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${area}\\text{ cm}^2$`, cap: `x = ${area} cm²` });
      steps.push({ id: 'trap', k: 'trap', t: `높이를 $${ov('BD')}=${m}$로 놓고 $\\frac{(${m}+${n})\\times${m}}{2}$로 구하면 틀려요. 높이는 두 평행한 변 사이의 거리인 $${ov('DE')}=${m + n}$이에요.`, cap: `높이는 BD=${m}${G.josa(m, '이', '가')} 아니라 DE=${m + n}` });
    }
    items.push(SK.ang(A, B, Cc, { r: 28, on: ['given'], col: 'amber' }), SK.tick(A, B, 1, { at: 'given', col: 'amber' }), SK.tick(A, Cc, 1, { at: 'given', col: 'amber' }),
      SK.ang(D, B, A, { r: 18, on: ['given', 'cong'], col: 'sky', cols: { cong: 'green' } }), SK.ang(E, Cc, A, { r: 18, on: ['given', 'cong'], col: 'sky', cols: { cong: 'green' } }),
      SK.ang(A, B, D, { r: 34, rings: 2, at: 'sum', to: 'cong', col: 'green' }), SK.ang(Cc, A, E, { r: 34, rings: 2, at: 'sum', to: 'cong', col: 'green' }), SK.ang(B, A, D, { r: 34, at: 'sum', to: 'cong', col: 'sky' }), SK.ang(A, Cc, E, { r: 34, at: 'sum', to: 'cong', col: 'sky' }),
      SK.fill([A, B, D], { at: 'cong', to: 'len', col: 'sky', a: 0.26 }), SK.fill([A, Cc, E], { at: 'cong', to: 'len', col: 'green', a: 0.26 }));
    items.push(SK.len(B, D, pt(0, -2), `${m} cm`, { on: ['given', 'len'], col: 'sky', size: 16, gap: 6 }));
    if (v !== 1) items.push(SK.len(Cc, E, pt(0, -2), `${n} cm`, { on: ['given', 'len'], col: 'green', size: 16, gap: 6 }));
    items.push(SK.len(A, E, pt(0, -5), `${m} cm`, { at: 'len', col: 'sky', size: 16, gap: 8 }), SK.len(D, A, pt(0, -5), `${n} cm`, v === 1 ? { on: ['given', 'len'], col: 'green', size: 16, gap: 8 } : { at: 'len', col: 'green', size: 16, gap: 8 }));
    if (v === 0) items.push(SK.dim(D, E, pt(0, -3), 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, off: 20, labels: { ans: `x=${m + n} cm` } }));
    else if (v === 1) items.push(SK.len(Cc, E, pt(0, -2), 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 6, labels: { ans: `x=${n} cm` } }));
    else items.push(SK.fill([B, D, E, Cc], { on: ['given', 'eq', 'ans'], col: 'amber', a: 0.14 }), SK.txt(pt((D.x + E.x) / 2, (B.y + Cc.y) / 4), 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, labels: { ans: `x=${area} cm²` } }), SK.seg(B, D, { at: 'trap', col: 'rose', w: 5.4 }), SK.dim(D, E, pt(0, -3), `${m + n} cm`, { at: 'len', to: 'eq', col: 'amber', size: 16, off: 20 }));
    return {
      fit: [B, Cc, D, E, pt(-n - 0.4, 0), pt(m + 0.4, 0), pt(0, v === 1 ? 0.2 : 0.7)], steps, items, l: 44, r: 44,
      base: (b) => { G.line(b, pt(-n - 0.5, 0), pt(m + 0.5, 0), 'ink', 3, { alpha: 0.7 }); G.poly(b, [A, B, Cc], 'ink', 3.6); G.line(b, B, D, 'ink', 3.2); G.line(b, Cc, E, 'ink', 3.2); G.fillPoly(b, [A, B, Cc], 'amber', 0.06); },
      names: (b) => { [A, B, Cc, D, E].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); G.tagOut(b, B, cen, 'B', { size: 18 }); G.tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, A, 'A', { dy: -34, size: 18 }); T(b, D, 'D', { dy: 18, size: 18 }); T(b, E, 'E', { dy: 18, size: 18 }); T(b, pt(m + 0.5, 0), 'ℓ', { dy: -13, dx: 8, size: 17 }); }
    };
  };
  r5.solve = mkSolve(r5Plan);

  /* ---- t3-6 빗변을 공유하는 연 모양 · v0: ∠BAD → ∠BCD · v1: BC → CD · v2: ∠BAC → ∠ACD ---- */
  const r6Plan = (M, s, board) => {
    const { m, a, c, n } = M, v = (s.trV || 0) % 3, A = pt(0, 0), Cc = pt(1, 0), Bp = pt(cos(a) * cos(a), -cos(a) * sin(a)), Dp = pt(Bp.x, -Bp.y), cen = pt(0.5, 0), steps = [], items = [];
    const g0 = `$\\angle B=\\angle D=90^{\\circ}$, $${ov('AB')}=${ov('AD')}$이고`;
    steps.push({ id: 'given', k: 'given', t: v === 0 ? `${g0} $\\angle BAD=${dd(2 * a)}$예요. 구하는 것은 $\\angle BCD=x$.` : v === 1 ? `${g0} $${ov('BC')}=${n}$ cm예요. 구하는 것은 $${ov('CD')}=x$.` : `${g0} $\\angle BAC=${dd(a)}$예요. 구하는 것은 $\\angle ACD=x$.`, cap: v === 0 ? `∠B=∠D=90°, AB=AD, ∠BAD=${2 * a}°` : v === 1 ? `∠B=∠D=90°, AB=AD, BC=${n} cm` : `∠B=∠D=90°, AB=AD, ∠BAC=${a}°` });
    steps.push({ id: 'idea', k: 'idea', t: '연 모양은 AC를 접는 선으로 위아래가 포개어지는 모양이에요. 그래서 △ABC와 △ADC가 합동인지 확인하면 대응변과 대응각이 모두 같아져요.', cap: '△ABC와 △ADC가 합동인지 확인 (AC로 접기)' });
    steps.push({ id: 'R', k: 'fig', lb: '합동 조건 ①', t: '$\\angle B=\\angle D=90^{\\circ}$ (Right angle)', cap: '∠B=∠D=90° (R)' });
    steps.push({ id: 'H', k: 'fig', lb: '합동 조건 ②', t: '$\\overline{AC}$는 두 직각삼각형의 빗변이면서 공통이에요 (Hypotenuse)', cap: 'AC는 공통인 빗변 (H)' });
    steps.push({ id: 'S', k: 'fig', lb: '합동 조건 ③', t: `한 변의 길이가 같아요: $${ov('AB')}=${ov('AD')}$ (Side)`, cap: 'AB=AD (S)' });
    steps.push({ id: 'cong', k: 'fig', lb: '합동', t: '직각삼각형에서 빗변과 다른 한 변이 각각 같으므로 △ABC≡△ADC (RHS 합동)이에요.', cap: '△ABC≡△ADC (RHS 합동)' });
    if (v === 0) {
      steps.push({ id: 'eq', k: 'eq', t: `대응각이므로 $\\angle BAC=\\angle DAC=\\frac{${dd(2 * a)}}{2}=${dd(a)}$. △ABC에서 $\\angle BCA=90^{\\circ}-${dd(a)}=${dd(c)}$이고 $\\angle DCA=\\angle BCA$이므로 $x=2\\times${dd(c)}=${dd(2 * c)}$`, cap: `∠BCA=90°−${a}°=${c}° → x=2×${c}°=${2 * c}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(2 * c)}$`, cap: `x = ${2 * c}°` });
    } else if (v === 1) {
      steps.push({ id: 'eq', k: 'eq', t: `대응변이므로 $x=${ov('CD')}=${ov('CB')}=${n}$ cm`, cap: `CD=CB=${n} cm` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${n}\\text{ cm}$`, cap: `x = ${n} cm` });
    } else {
      steps.push({ id: 'eq', k: 'eq', t: `△ABC에서 $\\angle ACB=90^{\\circ}-${dd(a)}=${dd(c)}$이고, 대응각이므로 $x=\\angle ACD=\\angle ACB=${dd(c)}$`, cap: `x=∠ACD=∠ACB=90°−${a}°=${c}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(c)}$`, cap: `x = ${c}°` });
    }
    items.push(SK.ang(Bp, A, Cc, { r: 20, on: ['given', 'R'], col: 'sky', cols: { R: 'green' } }), SK.ang(Dp, A, Cc, { r: 20, on: ['given', 'R'], col: 'sky', cols: { R: 'green' } }),
      SK.tick(A, Bp, 1, { on: ['given', 'S'], col: 'amber' }), SK.tick(A, Dp, 1, { on: ['given', 'S'], col: 'amber' }), SK.seg(A, Cc, { at: 'H', col: 'green', w: 4 }),
      SK.fill([A, Bp, Cc], { at: 'cong', to: 'eq', col: 'sky', a: 0.26 }), SK.fill([A, Dp, Cc], { at: 'cong', to: 'eq', col: 'green', a: 0.26 }));
    if (v === 0) items.push(SK.ang(A, Bp, Dp, { r: 30, ld: 58, lr: -a / 2, on: ['given'], col: 'sky', label: dg(2 * a), gl: true, glTo: 'cong' }), SK.ang(Cc, Bp, Dp, { r: 34, ld: 60, lr: c / 2, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${2 * c}°` }, gl: true }), SK.ang(A, Bp, Cc, { r: 34, ld: 60, at: 'eq', col: 'green', label: dg(a), size: 15, gl: true }), SK.ang(Cc, Bp, A, { r: 26, at: 'eq', col: 'green' }));
    else if (v === 1) items.push(SK.len(Bp, Cc, cen, `${n} cm`, { on: ['given', 'eq'], col: 'sky', size: 17, gap: 6 }), SK.len(Dp, Cc, cen, 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 6, labels: { ans: `x=${n} cm` } }), SK.tick(Bp, Cc, 2, { at: 'cong', col: 'rose' }), SK.tick(Dp, Cc, 2, { at: 'cong', col: 'rose' }));
    else items.push(SK.ang(A, Bp, Cc, { r: 34, ld: 58, on: ['given'], col: 'sky', label: dg(a), gl: true, glTo: 'cong' }), SK.ang(Cc, Dp, A, { r: 30, ld: 50, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${c}°` }, gl: true }), SK.ang(Cc, A, Bp, { r: 30, ld: 50, at: 'eq', col: 'green', label: dg(c), size: 15, gl: true }));
    return {
      fit: [A, Cc, Bp, Dp], steps, items, l: 50, r: 54, t: board && board.W < 560 ? 28 : 56,
      base: (b) => {
        if (b.W < 560) for (const it of items) if (it.ty === 'ang') {
          // 꼭짓점의 실제 두 변 길이보다 각 표시가 커지지 않게 합니다.
          it.r = Math.min(it.r || 28, Math.min(dist(it.V, it.A), dist(it.V, it.B)) * b.k * 0.28);
          if (it.label) {
            // A의 조건은 왼쪽, C의 구하는 각은 오른쪽에 둡니다.
            // ang()가 실제 꼭짓점에 지시선을 이어 B의 직각과 구별합니다.
            const a0 = Math.atan2(it.A.y - it.V.y, it.A.x - it.V.x), a1 = Math.atan2(it.B.y - it.V.y, it.B.x - it.V.x), delta = ((a1 - a0 + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
            it.ld = 44; it.lr = (it.V === A ? -155 : -25) - (a0 + delta / 2) / DEG;
          }
        }
        G.fillPoly(b, [A, Bp, Cc, Dp], 'sky', 0.08); G.poly(b, [A, Bp, Cc, Dp], 'ink', 3.6);
      },
      names: (b) => { [A, Bp, Cc, Dp].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); G.tagOut(b, A, cen, 'A', { size: 18 }); G.tagOut(b, Bp, cen, 'B', { size: 18 }); G.tagOut(b, Cc, cen, 'C', { size: 18 }); G.tagOut(b, Dp, cen, 'D', { size: 18 }); }
    };
  };
  r6.solve = mkSolve(r6Plan);

  // 해설은 원본 solve를 쓰되, 같은 조건을 유지한 두 삼각형을 떼어 비교한다.
  // 개념 버튼에는 원문 수치문제의 x와 계산값을 넣지 않는다.
  const withoutLengths = plan => (M, s, b) => {
    const p = plan(M, s, b);
    return { ...p, items: p.items.filter(it => !['len', 'dim', 'txt'].includes(it.ty)) };
  };
  const pair = (first, second, left, right, kind = 'RHA') => ({ triangles: [first, second], names: [left, right], kind });
  G.trLessonA.attach(r1, r1Plan, M => { const g = rtri(1, M.a); return [g.A, g.B]; }, M => {
    const p = rtri(1, M.a), q = rtri(1, M.a, cos(M.a) + .55);
    return pair([p.A, p.B, p.C], [q.A, q.B, q.C], ['A', 'B', 'C'], ['D', 'E', 'F']);
  }, withoutLengths(r1Plan));
  G.trLessonA.attach(r2, r2Plan, M => [pt(0, -sin(M.bt)), pt(0, 0)], M => {
    const A = pt(0, -sin(M.bt)), B = pt(-cos(M.bt), 0), Cc = pt(cos(M.bt), 0), D = pt(0, 0);
    return pair([A, B, D], [A, Cc, D], ['A', 'B', 'D'], ['A', 'C', 'D'], 'RHS');
  }, withoutLengths(r2Plan));
  r3.lessonQuestion = (M, s, Q) => Q.stem;
  G.trLessonA.attach(r3, r3Plan, (M, s) => {
    const c = r3Pick(s), p = rt3(4, 3, 0);
    return c.m.hyp ? [p.A, p.B] : c.m.legB ? [p.B, p.C] : [p.A, p.C];
  }, (M, s) => {
    const c = r3Pick(s), p = rt3(4, 3, 0), q = rt3(...(c.T2 || [4, 3]), 5.9);
    if (c.cong) {
      if (c.id === 'sas') return pair([p.C, p.A, p.B], [q.C, q.A, q.B], ['C', 'A', 'B'], ['F', 'D', 'E'], 'SAS');
      if (c.id === 'asa' || c.id === 'rha2') return pair([p.B, p.A, p.C], [q.B, q.A, q.C], ['B', 'A', 'C'], ['E', 'D', 'F'], c.id === 'asa' ? 'ASA' : 'RHA');
      return pair([p.A, p.B, p.C], [q.A, q.B, q.C], ['A', 'B', 'C'], ['D', 'E', 'F'], c.id === 'rhs' ? 'RHS' : 'RHA');
    }
    // 반례에는 실제로 같은 것으로 주어진 변·각만 표시한다.
    if (c.id === 'legA') return { ...pair([p.A, p.C, p.B], [q.A, q.C, q.B], ['A', 'C', 'B'], ['D', 'F', 'E']), counterexample: true, marks: { edges: [[0, 1, 2]], angles: [[1, 0, 2]] } };
    if (c.id === 'legB') return { ...pair([p.B, p.C, p.A], [q.B, q.C, q.A], ['B', 'C', 'A'], ['E', 'F', 'D']), counterexample: true, marks: { edges: [[0, 1, 3]], angles: [[1, 0, 2]] } };
    const angles = [[2, 0, 1]];
    if (c.m.ang && c.m.ang.includes('A')) angles.push([0, 1, 2, 2]);
    if (c.m.ang && c.m.ang.includes('B')) angles.push([1, 0, 2, 3]);
    return { ...pair([p.A, p.B, p.C], [q.A, q.B, q.C], ['A', 'B', 'C'], ['D', 'E', 'F']), counterexample: true, marks: { edges: c.m.hyp ? [[0, 1, 1]] : [], angles } };
  });
  const trapLessonGeom = (M, s) => vv4(M, s) === 2 ? trapGeom(tan(M.al), 1) : M.g;
  G.trLessonA.attach(r4, r4Plan, (M, s) => { const g = trapLessonGeom(M, s); return [g.E, g.B]; }, (M, s) => {
    const g = trapLessonGeom(M, s);
    return pair([g.B, g.E, g.A], [g.D, g.B, g.C], ['B', 'E', 'A'], ['D', 'B', 'C']);
  }, withoutLengths(r4Plan));
  const linePair = M => {
    const g = M.g;
    return pair([g.B, g.A, g.D], [g.A, g.C, g.E], ['B', 'A', 'D'], ['A', 'C', 'E']);
  };
  G.trLessonA.attach(r5, r5Plan, M => [M.g.B, M.g.D], linePair, withoutLengths(r5Plan));
  G.trLessonA.attach(r6, r6Plan, () => [pt(0, 0), pt(1, 0)], M => {
    const A = pt(0, 0), Cc = pt(1, 0), B = pt(cos(M.a) ** 2, -cos(M.a) * sin(M.a)), D = pt(B.x, -B.y);
    return pair([A, Cc, B], [A, Cc, D], ['A', 'C', 'B'], ['A', 'C', 'D'], 'RHS');
  }, (M, s, b) => {
    const p = withoutLengths(r6Plan)(M, s, b);
    const Cc = pt(1, 0), B = pt(cos(M.a) ** 2, -cos(M.a) * sin(M.a)), D = pt(B.x, -B.y);
    return { ...p, items: p.items.map(it => it.ty === 'ang' ? { ...it, label: '', labels: undefined, gl: false } : it).concat(SK.tick(B, Cc, 2, { at: 'ans', col: 'rose' }), SK.tick(D, Cc, 2, { at: 'ans', col: 'rose' })) };
  });
  r7.lessonDraw = (b, s, M, C, SV, ST, idx) => {
    if (!C.entry && s.trCompare) { G.trLessonA.pair(b, s, linePair(M)); return; }
    SV.draw(b, s, M, C, ST.map(st => ({ ...st, cap: '' })), idx);
    if (!C.entry && s.trTrace > 0) line(b, M.g.B, G.lerp(M.g.B, M.g.D, clamp(s.trTrace, 0, 1)), 'rose', 4.4);
    if (!C.entry && s.trLine) rowT(b, pt((M.g.D.x + M.g.E.x) / 2, 0), s.trLine, { dy: 84, size: fs(b, 16), color: C.answer ? 'amber' : 'green' });
  };

  /* @@SOLVE-END */

  G.register(30, 't3', '③ 직각삼각형의 합동', '직각삼각형의 합동', PARAMS, [r1, r2, r3, r4, r5, r6, r7]);
})();
