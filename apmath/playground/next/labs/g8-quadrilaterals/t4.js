/* ==========================================================================
   중2 · 사각형의 성질 — 탭 ④ 「사다리꼴」 (t4.js, order 40) — 장면 2개
   · q4-1 등변사다리꼴의 정의와 성질 · 아랫변의 양 끝각이 같다 · 두 대각선의 길이가 같다
   · q4-2 보조선 두 가지로 길이 구하기 · AD∥BC, ∠A=120°이면 BC=AD+AB (평행선 / 수선)
   이전 「등변사다리꼴 정의·성질 & 두 가지 보조선」 한 장면을 두 장면으로 나눴습니다. 길이·각은 정수로만 씁니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_QD;
  if (!G) return;
  const { outsideAng, DEG, clamp, pt, add, sub, mul, unit, mid, lerp, polar, pick, rint, bboxOf, T, tagOut, ang, tick, par, fillPoly, line, poly, fit, P, mkChoices, rd, notes, fmtN, dg, sd, ll, an, tri, capLine, segTag, ci } = G;
  const lenF = (v) => fmtN(v);
  const degF = G.degF;
  const dotsT = (b, A, B, C, D) => { const c = mid(A, C); [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([k, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, c, k, { size: 17, gap: 11 }); }); };

  const PARAMS = {
    qdTa: P('윗변 AD', 4, 7, 1, 5, { color: 'amber', hint: '꼭짓점 A를 가로로 끌어도 돼요', format: lenF }),
    qdTb: P('아랫변 BC', 8, 12, 1, 10, { color: 'sky', format: lenF }),
    qdTt: P('아랫변의 각 ∠B', 45, 65, 1, 55, { color: 'rose', format: degF }),
    qdUa: P('윗변 AD', 3, 9, 1, 6, { color: 'amber', format: lenF }),
    qdUl: P('다리 AB', 4, 10, 2, 6, { color: 'green', hint: '두 다리 AB, DC의 길이는 같아요', format: lenF })
  };

  /* ====================================================================== 1. 등변사다리꼴의 정의와 성질 */
  const iso = {
    id: 'q4-1', title: '등변사다리꼴의 정의와 성질', short: '정의·성질',
    question: '아랫변의 양 끝각의 크기가 같은 사다리꼴을 등변사다리꼴이라고 해. 이 사다리꼴에서 다리의 길이와 대각선의 길이는 어떨까?',
    ctl: ['qdTa', 'qdTb', 'qdTt'],
    init: (s) => { s.qdTa = 5; s.qdTb = 10; s.qdTt = 55; s.qdK = 0; },
    reroll: (s) => { s.qdTa = rint(4, 7); s.qdTb = rint(8, 12); s.qdTt = rint(45, 65); s.qdK = rint(0, 2); },
    model: (s) => {
      const a = ci(s.qdTa, 4, 7), bb = ci(s.qdTb, 8, 12), t = ci(s.qdTt, 45, 65), k = (bb - a) / 2, h = k * Math.tan(t * DEG);
      const A = pt(k, -h), B = pt(0, 0), C = pt(bb, 0), D = pt(k + a, -h);
      return { a, bb, t, h, k, A, B, C, D, K: s.qdK || 0, top: 180 - t };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D } = M, pts = [A, B, C, D], st = cx.step, O = mid(A, C);
      fit(b, bboxOf(pts), { t: 64, b: cx.problem ? 68 : 108, l: 68, r: 68 });
      fillPoly(b, pts, 'sky', 0.12); poly(b, pts, 'ink', 3.4);
      par(b, A, D, 1, 'green'); par(b, B, C, 1, 'green');
      if (cx.problem) { drawProb41(b, M); return; }
      if (st >= 1) { tick(b, A, B, 1); tick(b, D, C, 1); }
      if (st >= 2) { outsideAng(b, B, C, A, dg(M.t), 'sky'); outsideAng(b, C, D, B, dg(M.t), 'sky'); outsideAng(b, A, B, D, dg(M.top), 'rose'); outsideAng(b, D, A, C, dg(M.top), 'rose'); }
      if (st >= 3) { line(b, A, C, 'green', 3, { dash: [8, 5] }); line(b, B, D, 'green', 3, { dash: [8, 5] }); tick(b, A, C, 3); tick(b, B, D, 3); fillPoly(b, [A, B, C], 'amber', 0.14); fillPoly(b, [D, C, B], 'amber', 0.14); }
      sd(b, A, D, O, `${M.a}`, 'amber'); sd(b, B, C, O, `${M.bb}`, 'sky');
      dotsT(b, A, B, C, D);
      if (!cx.review && !cx.lesson) b.handle('A', A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 가로로 끌기', drag: (w2) => { s.qdTa = clamp(Math.round(M.bb - 2 * w2.x), 4, 7); } });
      const cap = cx.review ? ['AD∥BC이고 AB=DC인 등변사다리꼴 (아랫변의 양 끝각이 같아요)', `∠B=∠C=${M.t}°, ∠A=∠D=${M.top}°`, 'AC=BD (△ABC ≡ △DCB)'][clamp(st, 1, 3) - 1] : `∠B=∠C=${M.t}° · ∠A=∠D=${M.top}° · AB=DC, AC=BD`;
      if (!cx.lesson || cx.answer) capLine(b, pt(M.bb / 2, 0), cap, 'amber', { dy: 76 });
    },
    steps: (M) => [
      'AD∥BC인 사다리꼴에서 아랫변의 양 끝각이 같으면(∠B=∠C) 등변사다리꼴이에요. 이때 두 다리의 길이가 같아요(AB=DC).',
      `AD∥BC이므로 ∠A+∠B=180°, ∠D+∠C=180°예요. ∠B=∠C=${M.t}°이므로 ∠A=∠D=${180 - M.t}°=${M.top}°예요. 윗변의 양 끝각도 같아요.`,
      '△ABC와 △DCB에서 AB=DC, ∠ABC=∠DCB, BC는 공통이므로 △ABC ≡ △DCB (SAS 합동)이에요. 그래서 AC=DB, 두 대각선의 길이가 같아요.'
    ],
    view: (M) => ({
      guide: '<b>노란 점 A</b>를 가로로 끌거나 막대로 윗변·아랫변·∠B를 바꿔 보세요. 어떻게 바꿔도 <b>두 다리의 길이</b>, <b>아랫변의 양 끝각</b>, <b>두 대각선의 길이</b>가 같아요.',
      readouts: [rd('AD', `${M.a}`, 'amber'), rd('BC', `${M.bb}`, 'sky'), rd('∠B = ∠C', `${M.t}°`, 'sky'), rd('∠A = ∠D', `${M.top}°`, 'rose'), rd('AB = DC', '같아요', 'green'), rd('AC = BD', '같아요', 'green')],
      formula: `<p>$${ll('AD')}\\parallel${ll('BC')}$, $${an('B')}=${an('C')}=${M.t}^{\\circ}$ → $${ll('AB')}=${ll('DC')}$</p><p>$${an('A')}=${an('D')}=180^{\\circ}-${M.t}^{\\circ}=${M.top}^{\\circ}$</p><p>$${tri('ABC')}\\equiv${tri('DCB')}$ → $${ll('AC')}=${ll('BD')}$</p>`,
      rule: '등변사다리꼴의 정의: 아랫변의 양 끝각의 크기가 같은 사다리꼴. 성질: 평행하지 않은 두 변의 길이가 같고, 두 대각선의 길이가 같다',
      notes: notes('윗변의 양 끝각(∠A, ∠D)도 서로 같고, 윗변과 아랫변의 각의 합은 180°예요.', '대각선의 길이가 같은 사각형이 모두 등변사다리꼴인 것은 아니에요. 직사각형도 대각선의 길이가 같아요.')
    }),
    prob: (M) => {
      const t = M.t, top = M.top, K = M.K;
      if (K === 0) return { tag: '등변사다리꼴의 각', key: `i0_${t}`, stem: `AD∥BC인 등변사다리꼴 ABCD에서 ∠B=${t}°일 때, ∠A의 크기 x는?`, choices: mkChoices(top, [[t, '∠B와 ∠A는 같지 않아요. 합이 180°예요.'], [90, '직각이 아니에요.'], [360 - 2 * t, '네 각의 합에서 ∠B, ∠C를 뺀 값은 ∠A+∠D예요. 하나만 구해야 해요.'], [180 - 2 * t > 0 ? 180 - 2 * t : t + 20, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 6 }) };
      if (K === 1) return { tag: '등변사다리꼴의 각', key: `i1_${top}`, stem: `AD∥BC인 등변사다리꼴 ABCD에서 ∠A=${top}°일 때, ∠C의 크기 x는?`, choices: mkChoices(t, [[top, '∠A와 ∠C는 같지 않아요. 합이 180°가 아니라 ∠A+∠B=180°이고 ∠B=∠C예요.'], [90, '직각이 아니에요.'], [180 - 2 * t > 0 ? 180 - 2 * t : t + 20, '값을 다시 확인해 보세요.'], [360 - 2 * top, '네 각의 합을 이용한 값이에요.']], { valid: (v) => v > 0 && v < 180, pad: 6 }) };
      const ac = M.a + M.bb - 2;
      return { tag: '등변사다리꼴의 대각선', key: `i2_${ac}`, stem: `AD∥BC인 등변사다리꼴 ABCD에서 AC=${ac}일 때, BD의 길이 x는?`, choices: mkChoices(ac, [[ac / 2, '대각선의 절반이 아니에요. 두 대각선의 길이가 같아요.'], [ac * 2, '2배가 아니에요.'], [ac + 2, '값을 다시 확인해 보세요.'], [ac - 2 > 0 ? ac - 2 : ac + 4, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
    }
  };
  function drawProb41(b, M) {
    const { A, B, C, D } = M, K = M.K, O = mid(A, C);
    tick(b, A, B, 1); tick(b, D, C, 1);
    if (K === 0) { outsideAng(b, B, C, A, dg(M.t), 'sky'); outsideAng(b, A, B, D, 'x', 'rose'); }
    else if (K === 1) { outsideAng(b, A, B, D, dg(M.top), 'sky'); outsideAng(b, C, D, B, 'x', 'rose'); }
    else { line(b, A, C, 'ink', 2.6); line(b, B, D, 'ink', 2.6); segTag(b, A, C, 0.5, `${M.a + M.bb - 2}`, -16, 'sky'); segTag(b, B, D, 0.5, 'x', 16, 'rose', { size: 18 }); }
    void O;
    dotsT(b, A, B, C, D);
  }

  /* ====================================================================== 2. 보조선 두 가지 */
  const aux = {
    id: 'q4-2', title: '보조선으로 아랫변의 길이 구하기', short: '보조선 두 가지',
    question: 'AD∥BC인 등변사다리꼴에서 ∠A=120°이면 ∠B=60°야. 보조선을 그어 아랫변 BC의 길이를 구해 보자.',
    ctl: ['qdUa', 'qdUl'],
    presets: () => [['par', '평행선 긋기 (DE∥AB)'], ['perp', '수선 긋기 (AH⊥BC, DI⊥BC)']].map(([id, label], i) => ({ group: i === 0 ? '보조선' : '', label, color: 'green', apply: (s) => { s.qdMd = id; }, on: (s) => (s.qdMd || 'par') === id })),
    init: (s) => { s.qdUa = 6; s.qdUl = 6; s.qdMd = 'par'; s.qdK = 0; },
    reroll: (s) => { s.qdUa = rint(3, 9); s.qdUl = pick([4, 6, 8, 10], s.qdUl); s.qdK = rint(0, 2); },
    model: (s) => {
      const a = ci(s.qdUa, 3, 9), l = ci(s.qdUl, 4, 10), bc = a + l, h = (l * Math.sqrt(3)) / 2;
      const B = pt(0, 0), C = pt(bc, 0), A = pt(l / 2, -h), D = pt(l / 2 + a, -h);
      return { a, l, bc, h, A, B, C, D, E: pt(a, 0), H: pt(l / 2, 0), I: pt(a + l / 2, 0), half: l / 2, md: s.qdMd || 'par', K: s.qdK || 0, per: a + bc + 2 * l };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, E, H, I } = M, pts = [A, B, C, D], st = cx.step, O = mid(A, C);
      // The lesson places the two 60° labels outside B and C.
      fit(b, { x0: -0.2, x1: M.bc + 0.2, y0: -M.h - 0.2, y1: 0 }, { t: 30, b: 80, l: 64, r: 64 });
      fillPoly(b, pts, 'sky', 0.1); poly(b, pts, 'ink', 3.4);
      par(b, A, D, 1, 'green'); par(b, B, C, 1, 'green'); tick(b, A, B, 1); tick(b, D, C, 1);
      const md = cx.review ? M.md : M.md;
      if (cx.problem) {
        ang(b, A, B, D, { color: 'sky', rings: 1, r: 28, label: '120°', size: 15, labelDist: 54 });
        if (M.K === 0) { sd(b, A, D, O, `${M.a}`, 'sky'); sd(b, A, B, O, `${M.l}`, 'sky'); segTag(b, B, C, 0.5, 'x', 18, 'rose', { size: 18 }); }
        else if (M.K === 1) { sd(b, B, C, O, `${M.bc}`, 'sky'); sd(b, A, B, O, `${M.l}`, 'sky'); segTag(b, A, D, 0.5, 'x', -18, 'rose', { size: 18 }); }
        else { sd(b, A, D, O, `${M.a}`, 'sky'); sd(b, A, B, O, `${M.l}`, 'sky'); T(b, mid(mid(A, B), mid(C, D)), 'x = 사각형 ABCD의 둘레', { size: 14, color: 'rose' }); }
        dotsT(b, A, B, C, D); return;
      }
      ang(b, A, B, D, { color: 'sky', rings: 1, r: 28, label: '120°', size: 15, labelDist: 54 });
      ang(b, B, C, A, { color: 'sky', rings: 2, r: 28, label: '60°', size: 15, labelDist: 52 });
      if (md === 'par' && (st >= 1 || !cx.review)) {
        line(b, D, E, 'green', 3.2); par(b, D, E, 1, 'green', 0.5); par(b, A, B, 1, 'green', 0.5);
        if (st >= 2 || !cx.review) { fillPoly(b, [D, E, C], 'amber', 0.2); ang(b, E, C, D, { color: 'sky', rings: 2, r: 24 }); ang(b, C, E, D, { color: 'sky', rings: 2, r: 24 }); ang(b, D, E, C, { color: 'sky', rings: 2, r: 20 }); tick(b, D, E, 2, 'rose'); tick(b, E, C, 2, 'rose'); tick(b, D, C, 2, 'rose'); }
        segTag(b, B, E, 0.5, `${M.a}`, 20, 'sky'); segTag(b, E, C, 0.5, `${M.l}`, 20, 'rose'); b.point(E, { color: 'green', r: 4.5 }); T(b, E, 'E', { dy: 36, size: 16, color: 'green' });
      } else if (md === 'perp' && (st >= 1 || !cx.review)) {
        line(b, A, H, 'green', 3.2); line(b, D, I, 'green', 3.2); b.right(H, B, A, { size: 10, color: 'green' }); b.right(I, C, D, { size: 10, color: 'green' });
        if (st >= 2 || !cx.review) { fillPoly(b, [A, B, H], 'amber', 0.2); fillPoly(b, [D, C, I], 'amber', 0.2); }
        segTag(b, B, H, 0.5, `${M.half}`, 20, 'rose'); segTag(b, H, I, 0.5, `${M.a}`, 20, 'sky'); segTag(b, I, C, 0.5, `${M.half}`, 20, 'rose');
        b.point(H, { color: 'green', r: 4.5 }); T(b, H, 'H', { dy: 36, size: 16, color: 'green' }); b.point(I, { color: 'green', r: 4.5 }); T(b, I, 'I', { dy: 36, size: 16, color: 'green' });
      }
      sd(b, A, D, O, `${M.a}`, 'amber'); sd(b, A, B, O, `${M.l}`, 'amber');
      if (!cx.review || st >= 3) T(b, mid(B, C), `BC = ${M.bc}`, { dy: 62, size: b.W < 560 ? 15 : 17, color: 'rose' });
      dotsT(b, A, B, C, D);
      const cap = cx.review ? (md === 'par' ? ['점 D를 지나 AB에 평행한 DE를 그어요 (ABED는 평행사변형)', `△DEC는 ∠E=∠C=60°인 정삼각형 → EC=DC=${M.l}`, `BC=BE+EC=${M.a}+${M.l}=${M.bc}`] : ['점 A, D에서 BC에 수선 AH, DI를 그어요', `∠B=60°이므로 BH=CI=${M.half} (AB의 절반)`, `BC=BH+HI+IC=${M.half}+${M.a}+${M.half}=${M.bc}`])[clamp(st, 1, 3) - 1] : (md === 'par' ? `BC = AD + AB = ${M.a}+${M.l} = ${M.bc}` : `BC = ${M.half}+${M.a}+${M.half} = ${M.bc}`);
      capLine(b, pt(M.bc / 2, 0), cap, 'amber', { dy: 84 });
    },
    steps: (M) => (M.md === 'par' ? [
      `AD∥BC이고 ∠A=120°이므로 ∠B=∠C=60°예요. 점 D를 지나 AB에 평행한 선분 DE를 그으면 ABED는 평행사변형이라 BE=AD=${M.a}, DE=AB=${M.l}이에요.`,
      `△DEC에서 ∠DEC=∠B=60°(동위각), ∠C=60°이므로 정삼각형이에요. 그래서 EC=DC=${M.l}이에요.`,
      `BC=BE+EC=${M.a}+${M.l}=${M.bc}예요.`
    ] : [
      `AD∥BC이고 ∠A=120°이므로 ∠B=∠C=60°예요. 점 A, D에서 BC에 내린 수선의 발을 H, I라 해요.`,
      `△ABH는 ∠B=60°, ∠BAH=30°인 직각삼각형이므로 BH=$\\frac{1}{2}$AB=${M.half}이에요. 마찬가지로 CI=${M.half}이고, HI=AD=${M.a}예요.`,
      `BC=BH+HI+IC=${M.half}+${M.a}+${M.half}=${M.bc}예요.`
    ]),
    view: (M) => ({
      guide: '막대로 <b>윗변 AD</b>와 <b>다리 AB</b>를 바꿔 보세요. 버튼으로 보조선을 <b>평행선</b>과 <b>수선</b> 중에서 고를 수 있어요. 어느 방법이든 <b>BC=AD+AB</b>예요.',
      readouts: [rd('AD', `${M.a}`, 'amber'), rd('AB = DC', `${M.l}`, 'amber'), rd('∠B = ∠C', '60°', 'sky'), rd('BC', `${M.bc}`, 'rose', `${M.a} + ${M.l}`, null, true)],
      formula: M.md === 'par' ? `<p>$${ll('BE')}=${ll('AD')}=${M.a}$, $${ll('EC')}=${ll('DC')}=${M.l}$ (정삼각형 DEC)</p><p>$${ll('BC')}=${M.a}+${M.l}=${M.bc}$</p>` : `<p>$${ll('BH')}=${ll('CI')}=\\frac{1}{2}${ll('AB')}=${M.half}$, $${ll('HI')}=${ll('AD')}=${M.a}$</p><p>$${ll('BC')}=${M.half}+${M.a}+${M.half}=${M.bc}$</p>`,
      rule: '등변사다리꼴에서 ∠B=60°이면 BC=AD+AB (평행선을 긋거나 수선을 내려 구한다)',
      notes: notes('보조선은 <b>평행선(DE∥AB)</b>을 그으면 평행사변형과 정삼각형이, <b>수선</b>을 내리면 직각삼각형 2개와 직사각형이 생겨요.', '∠A=120°이면 ∠B=180°−120°=60°예요. 윗변의 각과 아랫변의 각의 합은 180°예요.')
    }),
    prob: (M) => {
      const { a, l, bc, K } = M;
      if (K === 0) return { tag: '보조선 · 아랫변', key: `a0_${a}_${l}`, stem: `AD∥BC인 등변사다리꼴 ABCD에서 AD=${a}, AB=${l}, ∠A=120°일 때, BC의 길이 x는?`, choices: mkChoices(bc, [[a + 2 * l, '두 다리를 모두 더했어요. BC=AD+AB예요.'], [a + l / 2, 'BH 한쪽만 더했어요. 양쪽에서 각각 AB의 절반이에요.'], [a + l / 2 + l / 2 + 1, '값을 다시 확인해 보세요.'], [Math.abs(a - l) + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
      if (K === 1) return { tag: '보조선 · 윗변', key: `a1_${bc}_${l}`, stem: `AD∥BC인 등변사다리꼴 ABCD에서 BC=${bc}, AB=${l}, ∠A=120°일 때, AD의 길이 x는?`, choices: mkChoices(a, [[bc - l / 2, 'BH 한쪽만 뺐어요. 양쪽에서 AB의 절반씩 빼요.'], [bc - 2 * l > 0 ? bc - 2 * l : bc - l + 2, '두 다리를 모두 뺐어요. AD=BC−AB예요.'], [bc + l, '더했어요.'], [a + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
      return { tag: '보조선 · 둘레', key: `a2_${a}_${l}`, stem: `AD∥BC인 등변사다리꼴 ABCD에서 AD=${a}, AB=${l}, ∠A=120°일 때, 사각형 ABCD의 둘레의 길이 x는?`, choices: mkChoices(M.per, [[a + bc + l, 'DC를 빠뜨렸어요. 다리가 두 개예요.'], [2 * a + 2 * l, '평행사변형처럼 구했어요. BC=AD+AB예요.'], [a + 2 * bc, 'BC를 두 번 더했어요.'], [M.per + 2, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 2, valid: (v) => v > 0 && Number.isInteger(v) }) };
    }
  };

  function trace(b, segments, progress) {
    segments.forEach(([p, q], i) => { const t = clamp((Number(progress) || 0) * segments.length - i, 0, 1); if (t > 0) line(b, p, lerp(p, q, t), 'green', 4.6); });
  }
  iso.lessonQuestion = (M, s, Q) => s.qdLessonProblem === false
    ? s.qdBMode === 'iso-legs' ? '아랫변의 양 끝각이 같은 등변사다리꼴에서 왜 두 다리의 길이가 같을까요?'
      : '등변사다리꼴에서 왜 두 대각선의 길이가 같을까요?'
    : (Q.html || Q.stem) + '<br>' + Q.choices.map((c, i) => G.NUM[i] + ' ' + (c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p)).join('<br>');
  iso.lessonDraw = (b, s, M, C, solution) => {
    const { A, B, C: Cc, D } = M, t = C.entry ? 0 : s.qdBT;
    if (s.qdLessonProblem) {
      const n = C.entry ? 0 : C.answer ? solution.steps.length : Math.min(s.step || 1, solution.steps.length - 1);
      iso.solveDraw(b, { ...s, step: n }, M, C, solution);
      if (!C.entry && C.calculation && M.K === 1) outsideAng(b, B, Cc, A, dg(M.t), 'green');
      trace(b, M.K === 2 ? [[A, Cc], [B, D]] : [[A, D], [B, Cc]], t);
      return;
    }
    const legs = s.qdBMode === 'iso-legs', H = pt(M.k, 0), I = pt(M.k + M.a, 0);
    iso.draw(b, s, M, { ...C, problem: false, review: true, step: C.answer ? (legs ? 1 : 3) : legs ? 0 : 1 });
    if (legs) {
      outsideAng(b, B, Cc, A, dg(M.t), 'sky'); outsideAng(b, Cc, D, B, dg(M.t), 'sky');
      trace(b, [[A, H], [D, I]], t);
      if (!C.entry && s.qdBFeet) {
        b.right(H, A, B, { size: 11, color: 'green' }); b.right(I, D, Cc, { size: 11, color: 'green' });
        b.point(H, { color: 'green', r: 4 }); b.point(I, { color: 'green', r: 4 });
        T(b, H, 'H', { dy: 24, color: 'green' }); T(b, I, 'I', { dy: 24, color: 'green' });
      }
      if (!C.entry && s.qdBFirstReady) { tick(b, A, H, 2, 'rose'); tick(b, D, I, 2, 'rose'); fillPoly(b, [A, B, H], 'amber', .12); fillPoly(b, [D, Cc, I], 'amber', .12); }
    } else {
      trace(b, [[A, Cc], [B, D]], t);
      if (!C.entry && s.qdBFirstReady) { fillPoly(b, [A, B, Cc], 'amber', .12); fillPoly(b, [D, Cc, B], 'amber', .12); tick(b, B, Cc, 2, 'rose'); }
    }
  };
  aux.lessonQuestion = (M, s, Q) => s.qdLessonProblem === false
    ? `∠A=120°인 등변사다리꼴에서 ${s.qdMd === 'perp' ? '수선' : '평행선'}을 보조선으로 그어 BC와 AD, AB의 관계를 구해 보세요.`
    : (Q.html || Q.stem) + '<br>' + Q.choices.map((c, i) => G.NUM[i] + ' ' + (c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p)).join('<br>');
  aux.lessonDraw = (b, s, M, C, solution) => {
    const { A, B, C: Cc, D, E, H, I } = M, center = mid(A, Cc), text = b.text;
    const answer = solution.question.choices.find(c => c.ok).p;
    b.text = function (p, str, options) {
      if (C.answer) str = String(str) === 'x = 사각형 ABCD의 둘레' ? `사각형 ABCD의 둘레 = ${answer}` : String(str).replace(/x(?:°|\s*cm)?$/, answer);
      return text.call(this, p, str, options);
    };
    try { aux.draw(b, s, M, { ...C, problem: true, review: false }); } finally { b.text = text; }
    const t = C.entry ? 0 : s.qdBT;
    if (M.md === 'par') {
      trace(b, [[D, E]], t);
      if (!C.entry && s.qdBFeet) { par(b, D, E, 2, 'green'); par(b, A, B, 2, 'green'); b.point(E, { color: 'green', r: 4 }); T(b, E, 'E', { dy: 36, color: 'green' }); }
      if (!C.entry && s.qdBFirstReady) {
        const known = M.K !== 1 || C.answer;
        segTag(b, B, E, .5, known ? String(M.a) : 'x', 20, 'sky');
        G.sideTag(b, D, E, center, String(M.l), { color: 'green', size: 15 });
      }
      if (!C.entry && s.qdBSecondReady) { fillPoly(b, [D, E, Cc], 'amber', .15); tick(b, E, Cc, 2, 'rose'); tick(b, D, E, 2, 'rose'); tick(b, D, Cc, 2, 'rose'); segTag(b, E, Cc, .5, String(M.l), 20, 'rose'); }
    } else {
      trace(b, [[A, H], [D, I]], t);
      if (!C.entry && s.qdBFeet) {
        b.right(H, A, B, { size: 11, color: 'green' }); b.right(I, D, Cc, { size: 11, color: 'green' });
        b.point(H, { color: 'green', r: 4 }); b.point(I, { color: 'green', r: 4 });
        T(b, H, 'H', { dy: 36, color: 'green' }); T(b, I, 'I', { dy: 36, color: 'green' });
      }
      if (!C.entry && s.qdBFirstReady) { fillPoly(b, [A, B, H], 'amber', .15); fillPoly(b, [D, Cc, I], 'amber', .15); segTag(b, B, H, .5, String(M.half), 20, 'rose'); segTag(b, I, Cc, .5, String(M.half), 20, 'rose'); }
      if (!C.entry && s.qdBSecondReady) segTag(b, H, I, .5, M.K !== 1 || C.answer ? String(M.a) : 'x', 20, 'sky');
    }
    if (!C.entry && C.calculation) { outsideAng(b, B, Cc, A, '60°', 'sky'); outsideAng(b, Cc, D, B, '60°', 'sky'); }
    if (!C.entry && s.qdBBaseReady && M.K === 2) T(b, mid(B, Cc), `BC = ${M.bc}`, { dy: 62, size: 16, color: 'green' });
  };
  const gl = [iso, aux];
  G.register(40, 'qd4', '④ 사다리꼴', '사다리꼴', PARAMS, gl);
})();
