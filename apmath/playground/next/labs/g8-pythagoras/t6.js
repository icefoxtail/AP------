/* ==========================================================================
   중2 · 피타고라스 정리 — 탭 ⑥ 「수선을 내려 만든 직각삼각형」 (t6.js, order 60) — 장면 3개
   · py6-iso    이등변삼각형의 높이   · 꼭짓점에서 수선을 내리면 밑변이 반으로 나뉘는 두 직각삼각형
   · py6-trap   사다리꼴의 높이       · 윗변의 양 끝에서 수선을 내려 아랫변을 (왼쪽 + 가운데 + 오른쪽)으로
   · py6-rect   직사각형 대각선에 내린 수선  · AP ⊥ BD, CQ ⊥ BD 일 때 AP, PQ 의 길이 (분수는 쌓은 분수로)
   모든 길이·넓이는 지금의 값으로 다시 계산됩니다. 정수가 아니면 x²=값 으로 씁니다(√ 없음).
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G || !G.figRt) return;
  const { clamp, pt, add, sub, mul, mid, lerp, unit, T, sideTag, tick, line, poly, fillPoly, ang, fit, P, mkChoices, rd, notes, fmtN, pick, rint, bboxOf, centroid, ratOf, texRat, plainRat, isSqN, isq, tagOut } = G;

  const PARAMS = {
    pyIb: P('밑변 BC', 4, 24, 2, 10, { color: 'sky', hint: '짝수로 움직여요 (반으로 나눌 수 있게)', format: (v) => `${v}` }),
    pyIl: P('같은 두 변 AB=AC', 3, 26, 1, 13, { color: 'amber', hint: '밑변의 반보다 길게 맞춰져요', format: (v) => `${v}` }),
    pyTu: P('윗변 AD', 2, 12, 1, 6, { color: 'sky', format: (v) => `${v}` }),
    pyTh: P('높이', 3, 24, 1, 12, { color: 'amber', format: (v) => `${v}` }),
    pyTd1: P('왼쪽 BH', 1, 16, 1, 5, { color: 'green', format: (v) => `${v}` }),
    pyTd2: P('오른쪽 IC', 1, 16, 1, 9, { color: 'rose', format: (v) => `${v}` }),
    pyWw: P('가로 BC', 3, 16, 1, 8, { color: 'sky', format: (v) => `${v}` }),
    pyWh: P('세로 AB', 3, 16, 1, 6, { color: 'green', format: (v) => `${v}` })
  };
  const lenOr = (v2) => (isSqN(v2) ? isq(v2) : null);
  const f = (v) => texRat(v); // 분수(쌓은 분수)

  /* ====================================================================== 1. 이등변삼각형의 높이 */
  const ISO_CHIPS = [[10, 13], [16, 17], [12, 10], [24, 13], [14, 25], [18, 15], [20, 26], [16, 10]];
  const isoOf = (s) => {
    const bc = clamp(Math.round(s.pyIb / 2) * 2, 4, 24), half = bc / 2; const leg = Math.max(clamp(Math.round(s.pyIl), 3, 26), half + 1); s.pyIl = leg;
    const h2 = leg * leg - half * half, hi = lenOr(h2);
    return { bc, half, leg, h2, hi, area: hi ? (bc * hi) / 2 : null, kind: s.pyKind || 0 };
  };
  const iso = {
    id: 'py6-iso', title: '이등변삼각형의 높이', short: '이등변삼각형의 높이',
    question: '이등변삼각형의 꼭짓점에서 밑변에 수선을 내리면 밑변은 반으로 나뉜다. 두 직각삼각형으로 높이와 넓이를 구해 보자.',
    ctl: ['pyIb', 'pyIl'],
    presets: () => ISO_CHIPS.map(([bc, l], i) => ({ group: i === 0 ? '높이가 정수가 되는 (밑변, 같은 변)' : '', label: `${bc}, ${l}`, apply: (ss) => { ss.pyIb = bc; ss.pyIl = l; }, on: (ss) => ss.pyIb === bc && ss.pyIl === l })),
    init: (s) => { s.pyIb = 10; s.pyIl = 13; s.pyKind = 0; },
    gen: (s, prev) => { let t; do { t = pick(ISO_CHIPS); } while (prev && prev.pyIb === t[0] && prev.pyIl === t[1]); return { pyIb: t[0], pyIl: t[1], pyKind: rint(0, 1) }; },
    model: (s) => isoOf(s),
    draw(b, s, M, C) {
      const { bc, half, leg, h2, hi, area, kind } = M, prob = C.problem;
      const h = Math.sqrt(h2), Bp = pt(-half, 0), Cp = pt(half, 0), Ap = pt(0, -h), H = pt(0, 0);
      fit(b, bboxOf([Ap, Bp, Cp, pt(0, 1.2)]), { t: 40, b: 40, l: 44, r: 44 });
      const st = (n) => !C.review || C.step >= n;
      fillPoly(b, [Ap, Bp, Cp], 'ink', 0.07);
      if (st(1)) { fillPoly(b, [Ap, Bp, H], 'sky', 0.22); fillPoly(b, [Ap, H, Cp], 'green', 0.2); }
      poly(b, [Ap, Bp, Cp], 'ink', 3.4);
      tick(b, Ap, Bp, 2, 'amber'); tick(b, Ap, Cp, 2, 'amber');
      if (st(1)) { line(b, Ap, H, 'rose', 3, { dash: [7, 6] }); b.right(H, Bp, Ap, { size: 11, color: 'rose' }); b.point(H, { color: 'rose', r: 4 }); T(b, H, 'H', { dy: 18, size: 16, color: 'rose' }); }
      if (st(2) && !prob) { tick(b, Bp, H, 1, 'sky'); tick(b, H, Cp, 1, 'sky'); }
      [[Ap, 'A', 0, -1], [Bp, 'B', -1, 1], [Cp, 'C', 1, 1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 14, dy: dy * 16, size: 17 }); });
      // 길이 (그림 안): 문제 kind=0 은 BC, AB 를 주고 높이 x, kind=1 은 BC 와 넓이를 주고 AB 를 구함
      T(b, mid(Bp, Cp), `${bc}`, { dy: 36, size: 17, color: 'sky' });
      if (!prob || kind === 0) { sideTag(b, Ap, Bp, Cp, `${leg}`, { color: 'amber', size: 17, gap: 12 }); sideTag(b, Ap, Cp, Bp, `${leg}`, { color: 'amber', size: 17, gap: 12 }); }
      else sideTag(b, Ap, Bp, Cp, 'x', { color: 'amber', size: 18, gap: 12 });
      if (st(1) || prob) {
        if (!prob) T(b, lerp(Ap, H, 0.5), hi ? `${hi}` : `h²=${h2}`, { dx: hi ? 14 : 34, size: 17, color: 'rose' });
      }
      if (prob && kind === 0) T(b, lerp(Ap, H, 0.5), 'x', { dx: 14, size: 18, color: 'rose' });
      if (kind === 1 && prob) T(b, centroid([Ap, Bp, Cp]), `넓이 ${area}`, { dy: 30, size: 16, color: 'ink' });
      if (!prob && st(2)) { T(b, lerp(Bp, H, 0.5), `${half}`, { dy: 16, size: 15, color: 'sky' }); T(b, lerp(H, Cp, 0.5), `${half}`, { dy: 16, size: 15, color: 'sky' }); }
      if (!prob && st(3) && area != null) T(b, centroid([Ap, Bp, Cp]), `넓이 ${area}`, { dy: 30, size: 15, color: 'ink' });
    },
    steps: (M) => [
      M.kind === 0 ? `$AB=AC=${M.leg}$, $BC=${M.bc}$인 이등변삼각형이에요. 높이 $AH=x$를 구해요.` : `밑변 $BC=${M.bc}$, 넓이 $${M.area}$인 이등변삼각형이에요. 같은 변 $AB=AC=x$를 구해요.`,
      `꼭짓점 A에서 밑변에 수선 AH를 내려요. 이등변삼각형이므로 $BH=HC=${M.bc}\\div2=${M.half}$예요.`,
      M.kind === 0 ? `직각삼각형 ABH의 빗변은 AB예요. $x^2=AB^2-BH^2=${M.leg}^2-${M.half}^2$예요.` : `넓이 $${M.area}=\\frac{1}{2}\\times${M.bc}\\times AH$에서 $AH=${M.area}\\times2\\div${M.bc}=${M.hi}$예요.`,
      M.kind === 0 ? `$x^2=${M.leg * M.leg}-${M.half * M.half}=${M.h2}$예요.` : `직각삼각형 ABH에서 $x^2=AH^2+BH^2=${M.hi}^2+${M.half}^2=${M.leg * M.leg}$예요.`,
      `따라서 ${M.kind === 0 ? '높이 AH' : '같은 변 AB'}의 길이는 $x=${M.kind === 0 ? M.hi : M.leg}$예요.`
    ],
    view: (M) => ({
      guide: '막대나 칩으로 <b>밑변</b>과 <b>같은 두 변</b>을 바꿔 보세요. 수선 AH는 밑변을 <b>반으로</b> 나누고, 직각삼각형 ABH로 높이를 구해요.',
      readouts: [rd('BH = HC', `${M.half}`, 'sky', `${M.bc} ÷ 2`), rd('높이 AH', M.hi ? `${M.hi}` : `AH²=${M.h2}`, 'rose', `${M.leg}² − ${M.half}²`), rd('넓이', M.area != null ? `${M.area}` : '구할 수 없어요', 'green', M.hi ? `½ × ${M.bc} × ${M.hi}` : '')],
      formula: `<p>$AH^2=AB^2-BH^2=${M.leg}^2-${M.half}^2=${M.h2}$</p>${M.hi ? `<p>$S=\\frac{1}{2}\\times${M.bc}\\times${M.hi}=${M.area}$</p>` : ''}`,
      rule: '이등변삼각형의 꼭짓점에서 밑변에 내린 수선은 밑변을 이등분 → 직각삼각형 ABH에서 높이',
      notes: notes('밑변이 아니라 <b>밑변의 반</b>이 직각삼각형의 한 변이에요.', '넓이의 높이는 <b>수선 AH</b>예요. 같은 변 AB가 아니에요.')
    }),
    prob: (M) => {
      const { bc, half, leg, hi, area, kind } = M, ans = kind === 0 ? hi : leg;
      return {
        tag: kind === 0 ? '[높이] 이등변삼각형의 높이' : '[높이] 넓이로 같은 변 구하기', key: `${kind}-${bc}-${leg}`,
        stem: kind === 0
          ? `다음 그림과 같이 $\\overline{AB}=\\overline{AC}=${leg}$, $\\overline{BC}=${bc}$인 이등변삼각형 ABC에서 꼭짓점 A에서 밑변 BC에 내린 수선의 길이 $x$는?`
          : `다음 그림과 같이 $\\overline{AB}=\\overline{AC}$이고 $\\overline{BC}=${bc}$인 이등변삼각형 ABC의 넓이가 $${area}$일 때, $\\overline{AB}$의 길이 $x$는?`,
        choices: mkChoices(ans, kind === 0 ? [[bc + 0 === leg ? leg + 1 : Math.abs(leg - bc) || 1, '밑변 전체가 아니라 밑변의 반을 써요.'], [leg - half, '길이의 차가 아니라 제곱의 차예요.'], [hi + 1, '다시 계산해 보세요.'], [hi - 1, '다시 계산해 보세요.'], [leg, '같은 변 AB의 길이예요.'], [h2x(leg, half), `$x^2=${leg * leg - half * half}$이에요. $x$는 한 번 더 구해야 해요.`]] : [[hi, '높이 AH를 구했어요. 구하려는 것은 AB예요.'], [bc, '밑변의 길이예요.'], [ans + 1, '다시 계산해 보세요.'], [ans - 1, '다시 계산해 보세요.'], [half + hi, '더하지 않아요. 제곱의 합이에요.'], [ans + 2, '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };
  const h2x = (leg, half) => leg * leg - half * half;

  /* ====================================================================== 2. 사다리꼴의 높이 */
  const TRAP_CHIPS = [[6, 12, 5, 9], [4, 12, 5, 5], [8, 12, 9, 9], [5, 8, 6, 6], [6, 15, 8, 8], [4, 12, 9, 16], [6, 4, 3, 3], [10, 6, 8, 8]];
  const trapOf = (s) => {
    const u = clamp(Math.round(s.pyTu), 2, 12), h = clamp(Math.round(s.pyTh), 3, 24), d1 = clamp(Math.round(s.pyTd1), 1, 16), d2 = clamp(Math.round(s.pyTd2), 1, 16);
    const v = u + d1 + d2, l1 = h * h + d1 * d1, l2 = h * h + d2 * d2, l1i = lenOr(l1), l2i = lenOr(l2);
    return { u, h, d1, d2, v, l1, l2, l1i, l2i, area: ((u + v) * h) / 2, per: l1i && l2i ? u + v + l1i + l2i : null, kind: s.pyKind || 0, iso: d1 === d2 };
  };
  const trap = {
    id: 'py6-trap', title: '사다리꼴의 높이', short: '사다리꼴의 높이',
    question: '사다리꼴의 윗변의 양 끝에서 아랫변에 수선을 내리면 직각삼각형 두 개가 생긴다. 높이와 둘레, 넓이를 어떻게 구할까?',
    ctl: ['pyTu', 'pyTh', 'pyTd1', 'pyTd2'],
    presets: () => TRAP_CHIPS.slice(0, 6).map(([u, h, d1, d2], i) => ({ group: i === 0 ? '변이 정수가 되는 사다리꼴' : '', label: `윗변${u} 높이${h} (${d1}, ${d2})`, apply: (ss) => { ss.pyTu = u; ss.pyTh = h; ss.pyTd1 = d1; ss.pyTd2 = d2; }, on: (ss) => ss.pyTu === u && ss.pyTh === h && ss.pyTd1 === d1 && ss.pyTd2 === d2 })),
    init: (s) => { s.pyTu = 6; s.pyTh = 12; s.pyTd1 = 5; s.pyTd2 = 9; s.pyKind = 0; },
    gen: (s, prev) => {
      let t, kind;
      do { kind = rint(0, 1); t = kind === 1 ? pick(TRAP_CHIPS.filter((q) => q[2] === q[3])) : pick(TRAP_CHIPS); } while (prev && prev.pyTu === t[0] && prev.pyTh === t[1] && prev.pyTd1 === t[2] && prev.pyTd2 === t[3] && prev.pyKind === kind);
      return { pyTu: t[0], pyTh: t[1], pyTd1: t[2], pyTd2: t[3], pyKind: kind };
    },
    model: (s) => trapOf(s),
    draw(b, s, M, C) {
      const { u, h, d1, d2, v, l1, l2, l1i, l2i, kind } = M, prob = C.problem;
      const Bp = pt(0, 0), Cp = pt(v, 0), Ap = pt(d1, -h), Dp = pt(d1 + u, -h), H = pt(d1, 0), I = pt(d1 + u, 0);
      fit(b, { x0: -0.2, x1: v + 0.2, y0: -h, y1: 0.8 }, { t: 36, b: 40, l: 40, r: 40 });
      const st = (n) => !C.review || C.step >= n;
      fillPoly(b, [Bp, Cp, Dp, Ap], 'ink', 0.07);
      if (st(1)) { fillPoly(b, [Bp, H, Ap], 'sky', 0.22); fillPoly(b, [I, Cp, Dp], 'green', 0.2); }
      poly(b, [Bp, Cp, Dp, Ap], 'ink', 3.4);
      if (st(1)) { line(b, Ap, H, 'rose', 2.8, { dash: [7, 6] }); line(b, Dp, I, 'rose', 2.8, { dash: [7, 6] }); b.right(H, Bp, Ap, { size: 10, color: 'rose' }); b.right(I, Cp, Dp, { size: 10, color: 'rose' }); }
      if (kind === 1 || !prob) { /* 이등변사다리꼴이면 두 다리 눈금 */ if (d1 === d2) { tick(b, Bp, Ap, 2, 'amber'); tick(b, Cp, Dp, 2, 'amber'); } }
      [[Ap, 'A', -1, -1], [Dp, 'D', 1, -1], [Cp, 'C', 1, 1], [Bp, 'B', -1, 1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 14, dy: dy * 15, size: 17 }); });
      if (st(1)) { T(b, H, 'H', { dx: -4, dy: 17, size: 15, color: 'rose' }); T(b, I, 'I', { dx: 4, dy: 17, size: 15, color: 'rose' }); }
      T(b, mid(Ap, Dp), `${u}`, { dy: -14, size: 17, color: 'sky' });
      if (!prob || kind === 0) T(b, mid(Bp, Cp), `${v}`, { dy: 34, size: 16, color: 'sky' });
      // 문제 kind=0 : AD, BC, AB, BH 를 주고 높이 x (AH) / kind=1 : 이등변사다리꼴 AD, BC, 높이를 주고 둘레
      if (prob && kind === 0) {
        sideTag(b, Bp, Ap, Cp, `${l1i}`, { color: 'amber', size: 17, gap: 12 }); T(b, mid(Bp, H), `${d1}`, { dy: 16, size: 16, color: 'green' });
        T(b, lerp(Ap, H, 0.5), 'x', { dx: 14, size: 18, color: 'rose' });
      } else if (prob && kind === 1) {
        T(b, mid(Bp, Cp), `${v}`, { dy: 34, size: 16, color: 'sky' }); T(b, lerp(Ap, H, 0.5), `${h}`, { dx: 14, size: 17, color: 'rose' });
      } else if (!prob) {
        sideTag(b, Bp, Ap, Cp, l1i ? `${l1i}` : `AB²=${l1}`, { color: 'amber', size: 16, gap: 12 }); sideTag(b, Cp, Dp, Bp, l2i ? `${l2i}` : `CD²=${l2}`, { color: 'amber', size: 16, gap: 12 });
        T(b, lerp(Ap, H, 0.5), `${h}`, { dx: 14, size: 17, color: 'rose' });
        if (st(2)) { T(b, mid(Bp, H), `${d1}`, { dy: 16, size: 15, color: 'green' }); T(b, mid(I, Cp), `${d2}`, { dy: 16, size: 15, color: 'green' }); }
      }
    },
    steps: (M) => [
      M.kind === 1 ? `이등변사다리꼴에서 $AD=${M.u}$, $BC=${M.v}$, 높이 $${M.h}$예요. 네 변의 길이를 더해 둘레를 구해요.` : `$AB=${M.l1i}$, $BH=${M.d1}$이고 $AH\\perp BC$예요. 구하는 높이는 $AH=x$예요.`,
      `A와 D에서 BC에 수선 AH, DI를 내려요. 가운데 AHID는 직사각형이고 양옆은 직각삼각형이에요.`,
      M.kind === 1 ? `양쪽 삼각형은 합동이므로 $BH=IC=\\frac{BC-AD}{2}=\\frac{${M.v}-${M.u}}{2}=${M.d1}$예요.` : `직각삼각형 ABH에서 빗변은 AB이므로 $x^2=AB^2-BH^2=${M.l1i}^2-${M.d1}^2$예요.`,
      M.kind === 1 ? `$AB^2=${M.h}^2+${M.d1}^2=${M.l1}$이므로 $AB=CD=${M.l1i}$예요.` : `$x^2=${M.l1}-${M.d1 * M.d1}=${M.h * M.h}$예요.`,
      M.kind === 1 ? `둘레 $=${M.u}+${M.v}+${M.l1i}+${M.l1i}=${M.per}$예요.` : `따라서 높이는 $x=${M.h}$예요. 다리 AB와 높이 AH를 구별해요.`
    ],
    view: (M) => ({
      guide: '막대나 칩으로 <b>윗변, 높이, BH, IC</b>를 바꿔 보세요. 수선 두 개를 내리면 <b>직각삼각형 두 개</b>와 <b>직사각형</b>(AHID)으로 나뉘어요.',
      readouts: [rd('아랫변 BC', `${M.v}`, 'sky', `${M.d1} + ${M.u} + ${M.d2}`), rd('다리 AB', M.l1i ? `${M.l1i}` : `AB²=${M.l1}`, 'amber', `${M.h}² + ${M.d1}²`), rd('다리 CD', M.l2i ? `${M.l2i}` : `CD²=${M.l2}`, 'amber', `${M.h}² + ${M.d2}²`), rd('둘레', M.per != null ? `${M.per}` : '정수가 아니에요', 'green'), rd('넓이', `$${G.texRat(M.area)}$`, 'ink', `½ × (${M.u}+${M.v}) × ${M.h}`)],
      formula: `<p>$AB^2=${M.h}^2+${M.d1}^2=${M.l1}$, $CD^2=${M.h}^2+${M.d2}^2=${M.l2}$</p>`,
      rule: '사다리꼴의 윗변 양 끝에서 수선을 내리면 직각삼각형 두 개 + 직사각형 하나',
      notes: notes('아랫변은 <b>BH + HI + IC</b>로 나뉘고, 가운데 $HI$는 윗변 $AD$와 같아요.', '이등변사다리꼴이면 $BH=IC=\\frac{BC-AD}{2}$로 같아요.')
    }),
    prob: (M) => {
      const { u, h, d1, v, l1i, per, kind } = M;
      if (kind === 1) {
        return { tag: '[높이] 이등변사다리꼴의 둘레', key: `1-${u}-${h}-${d1}`, stem: `다음 그림과 같이 $\\overline{AD}\\parallel\\overline{BC}$인 이등변사다리꼴 ABCD에서 $\\overline{AD}=${u}$, $\\overline{BC}=${v}$, 높이가 $${h}$일 때, 사다리꼴의 둘레는?`, choices: mkChoices(per, [[u + v + 2 * h, '다리의 길이는 높이가 아니에요. 직각삼각형으로 구해요.'], [u + v + 2 * d1, '다리의 길이는 BH가 아니에요.'], [per + 2, '다시 계산해 보세요.'], [per - 2, '다시 계산해 보세요.'], [u + v + l1i, '다리는 두 개예요.'], [per + 4, '다시 계산해 보세요.']], { tex: (x) => `${x}`, plain: (x) => `${x}` }) };
      }
      return { tag: '[높이] 사다리꼴의 높이', key: `0-${u}-${h}-${d1}`, stem: `다음 그림과 같이 $\\overline{AD}\\parallel\\overline{BC}$인 사다리꼴 ABCD에서 점 A에서 변 BC에 내린 수선의 발을 H라 하자. $\\overline{AB}=${l1i}$, $\\overline{BH}=${d1}$일 때, 높이 $x=\\overline{AH}$는?`, choices: mkChoices(h, [[l1i - d1, '길이의 차가 아니라 제곱의 차예요.'], [l1i + d1, '더하지 않고 제곱의 차를 구해요.'], [h + 1, '다시 계산해 보세요.'], [h - 1, '다시 계산해 보세요.'], [l1i * l1i - d1 * d1, `$x^2=${l1i * l1i - d1 * d1}$이에요. $x$는 한 번 더 구해야 해요.`], [d1, 'BH의 길이예요.']], { tex: (x) => `${x}`, plain: (x) => `${x}` }) };
    }
  };

  /* ====================================================================== 3. 직사각형 대각선에 내린 수선 */
  const RECT_CHIPS = [[8, 6], [12, 9], [12, 5], [15, 8], [16, 12], [6, 8], [9, 12], [5, 12], [8, 15]];
  const recOf = (s) => {
    const w = clamp(Math.round(s.pyWw), 3, 16), h = clamp(Math.round(s.pyWh), 3, 16), d2 = w * w + h * h, d = lenOr(d2);
    if (!d) return { w, h, d2, d: null, kind: s.pyKind || 0 };
    const AP = (w * h) / d, BP = (h * h) / d, PQ = Math.abs(d - (2 * h * h) / d);
    return { w, h, d2, d, AP, BP, PQ, sum: 2 * AP, kind: s.pyKind || 0 };
  };
  const rect = {
    id: 'py6-rect', title: '직사각형 대각선에 내린 수선', short: '대각선에 내린 수선',
    question: '직사각형 ABCD의 꼭짓점 A, C에서 대각선 BD에 수선을 내리면 AP, CQ의 길이와 PQ는 어떻게 구할까?',
    ctl: ['pyWw', 'pyWh'],
    presets: () => RECT_CHIPS.slice(0, 5).map(([w, h], i) => ({ group: i === 0 ? '대각선이 정수인 (가로 BC, 세로 AB)' : '', label: `${w}×${h}`, apply: (ss) => { ss.pyWw = w; ss.pyWh = h; }, on: (ss) => ss.pyWw === w && ss.pyWh === h })),
    init: (s) => { s.pyWw = 8; s.pyWh = 6; s.pyKind = 0; },
    gen: (s, prev) => { let t, k; do { t = pick(RECT_CHIPS); k = rint(0, 2); } while (prev && prev.pyWw === t[0] && prev.pyWh === t[1] && prev.pyKind === k); return { pyWw: t[0], pyWh: t[1], pyKind: k }; },
    model: (s) => recOf(s),
    draw(b, s, M, C) {
      const { w, h, d2, d, kind } = M, prob = C.problem;
      const A = pt(0, -h), Bp = pt(0, 0), Cp = pt(w, 0), D = pt(w, -h);
      fit(b, { x0: -0.3, x1: w + 0.3, y0: -h - 0.3, y1: 0.3 }, { t: 40, b: 46, l: 40, r: 40 });
      const st = (n) => !C.review || C.step >= n;
      fillPoly(b, [A, Bp, Cp, D], 'ink', 0.07); poly(b, [A, Bp, Cp, D], 'ink', 3.4);
      line(b, Bp, D, 'sky', 3.2);
      if (!d) { T(b, pt(w / 2, -h / 2), `BD²=${d2}`, { size: 18, color: 'amber' }); T(b, pt(w / 2, 0), '대각선이 정수가 되는 값을 골라 보세요', { dy: 34, size: 14, color: 'rose' }); return; }
      const dv = unit(sub(D, Bp)), Pf = add(Bp, mul(dv, M.BP)), Qf = add(D, mul(dv, -M.BP));
      if (st(1)) {
        const mAP = kind === 0 && prob, mPQ = kind === 1 && prob, mAP1 = kind === 2 && prob;
        line(b, A, Pf, (mAP || mAP1) ? 'amber' : 'rose', (mAP || mAP1) ? 4.2 : 2.8); line(b, Cp, Qf, mAP ? 'amber' : 'rose', mAP ? 4.2 : 2.8);
        b.right(Pf, Bp, A, { size: 10, color: 'rose' }); b.right(Qf, D, Cp, { size: 10, color: 'rose' });
        b.point(Pf, { color: 'rose', r: 4 }); b.point(Qf, { color: 'rose', r: 4 });
        T(b, Pf, 'P', { dx: 12, dy: 16, size: 17, color: 'rose' }); T(b, Qf, 'Q', { dx: -12, dy: -14, size: 17, color: 'rose' });
        if (mPQ) line(b, Pf, Qf, 'amber', 5);
      }
      [[A, 'A', -1, -1], [D, 'D', 1, -1], [Cp, 'C', 1, 1], [Bp, 'B', -1, 1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 14, dy: dy * 15, size: 17 }); });
      T(b, mid(Bp, Cp), `${w}`, { dy: 18, size: 17, color: 'sky' }); sideTag(b, A, Bp, Cp, `${h}`, { color: 'green', size: 17, gap: 12 });
      if (!prob) T(b, lerp(Bp, D, 0.2), `BD=${d}`, { dx: -4, dy: 20, size: 15, color: 'sky' });
      if (prob && kind === 2) T(b, mid(A, Pf), 'x', { dx: -10, dy: -10, size: 18, color: 'amber' });
      if (prob && kind === 1) T(b, mid(Pf, Qf), 'x', { dx: 6, dy: -14, size: 18, color: 'amber' });
      if (!prob && st(2)) { T(b, mid(A, Pf), `AP=${f(M.AP)}`, { dx: -6, dy: -16, size: 14, color: 'rose' }); }
      if (!prob && st(3)) T(b, mid(Pf, Qf), `PQ=${f(M.PQ)}`, { dx: 8, dy: 22, size: 14, color: 'amber' });
    },
    steps: (M) => M.d ? [
      `$AB=${M.h}$, $BC=AD=${M.w}$인 직사각형이에요. 구하는 것은 ${M.kind === 0 ? '$AP+CQ$' : M.kind === 1 ? '$PQ=x$' : '$AP=x$'}예요.`,
      `직각삼각형 ABD에서 $BD^2=${M.h}^2+${M.w}^2=${M.d2}$이므로 $BD=${M.d}$예요.`,
      M.kind === 1 ? `닮음 $\\triangle ABP\\sim\\triangle DBA$에서 $BP=\\frac{AB^2}{BD}=\\frac{${M.h * M.h}}{${M.d}}=${f(M.BP)}$이고 $DQ=BP$예요.` : `삼각형 ABD의 넓이는 $\\frac{AB\\times AD}{2}=\\frac{BD\\times AP}{2}$이므로 $AP=\\frac{${M.h}\\times${M.w}}{${M.d}}=${f(M.AP)}$예요.`,
      M.kind === 1 ? `B에서 잰 두 수선의 발의 위치는 $BP=${f(M.BP)}$, $BQ=BD-DQ=${f(M.d - M.BP)}$예요. P와 Q의 순서에 관계없이 두 위치의 차의 절댓값이 PQ예요.` : M.kind === 0 ? `대각선 양쪽의 합동인 삼각형 ABD, CDB의 높이가 같으므로 $CQ=AP=${f(M.AP)}$예요.` : `구한 AP는 대각선 BD에 수직인 높이예요. 삼각형의 넓이에 다시 대입해 확인해요.`,
      M.kind === 1 ? `$PQ=|${f(M.BP)}-${f(M.d - M.BP)}|=${f(M.PQ)}$예요.` : M.kind === 0 ? `$AP+CQ=${f(M.AP)}+${f(M.AP)}=${f(M.sum)}$예요.` : `$AP=x=${f(M.AP)}$예요.`
    ] : ['대각선의 제곱은 주어진 두 변의 제곱의 합이에요.'],
    view: (M) => M.d ? ({
      guide: '막대나 칩으로 <b>가로, 세로</b>를 바꿔 보세요. 삼각형의 넓이를 두 가지로 나타내 <b>AP</b>를 구하고, <b>BP</b>를 빼서 <b>PQ</b>를 구해요.',
      readouts: [rd('대각선 BD', `${M.d}`, 'sky', `${M.h}² + ${M.w}² = ${M.d2}`), rd('AP = CQ', `$${f(M.AP)}$`, 'rose', `${M.h} × ${M.w} ÷ ${M.d}`), rd('AP + CQ', `$${f(M.sum)}$`, 'amber'), rd('BP = DQ', `$${f(M.BP)}$`, 'green', `${M.h}² ÷ ${M.d}`), rd('PQ', `$${f(M.PQ)}$`, 'amber', `${M.d} − 2 × BP`)],
      formula: `<p>$AP=\\frac{AB\\times AD}{BD}=${f(M.AP)}$, $BP=\\frac{AB^2}{BD}=${f(M.BP)}$</p><p>$PQ=BD-2BP=${f(M.PQ)}$</p>`,
      rule: '직사각형의 대각선에 내린 수선: AP = (AB×AD)÷BD, BP = AB²÷BD, PQ = BD − 2BP',
      notes: notes('$AP\\times BD=AB\\times AD$ (삼각형의 넓이를 두 가지로) 는 자주 쓰여요.', '$PQ$는 $BD-BP-DQ$예요. $BD$에서 한 번만 빼지 않아요.')
    }) : ({ guide: '대각선이 정수가 되는 칩을 눌러 보세요.', readouts: [rd('대각선²', `${M.d2}`, 'amber', `${M.h}² + ${M.w}²`)], rule: '직사각형의 대각선 BD²=AB²+BC²' }),
    prob: (M) => {
      const { w, h, d, kind } = M;
      const cf = { tex: (v) => texRat(v), plain: (v) => plainRat(v), pad: 1 / d };
      const mine = kind === 0 ? { ans: M.sum, tag: '[높이] AP + CQ', stem: `다음 그림의 직사각형 ABCD에서 $\\overline{AP}\\perp\\overline{BD}$, $\\overline{CQ}\\perp\\overline{BD}$이다. $\\overline{AB}=${h}$, $\\overline{BC}=${w}$일 때, $\\overline{AP}+\\overline{CQ}$의 길이는?` }
        : kind === 1 ? { ans: M.PQ, tag: '[높이] PQ의 길이', stem: `다음 그림의 직사각형 ABCD에서 $\\overline{AP}\\perp\\overline{BD}$, $\\overline{CQ}\\perp\\overline{BD}$이다. $\\overline{AB}=${h}$, $\\overline{BC}=${w}$일 때, $\\overline{PQ}$의 길이 $x$는?` }
          : { ans: M.AP, tag: '[높이] AP의 길이', stem: `다음 그림의 직사각형 ABCD에서 $\\overline{AP}\\perp\\overline{BD}$이다. $\\overline{AB}=${h}$, $\\overline{BC}=${w}$일 때, $\\overline{AP}$의 길이 $x$는?` };
      const ans = mine.ans;
      const wrong = kind === 0 ? [[M.AP, 'AP 하나만 구했어요. CQ도 더해요.'], [(w * h) / d / 2, '다시 계산해 보세요.'], [d, '대각선의 길이예요.'], [M.PQ, 'PQ의 길이예요.'], [(w + h) * 2 / d + 0, '다시 계산해 보세요.'], [(w * h) / 2, '삼각형 ABD의 넓이예요.']]
        : kind === 1 ? [[M.BP, 'BP의 길이예요. PQ는 BD에서 BP와 DQ를 빼요.'], [d - M.BP, 'BD에서 BP를 한 번만 뺐어요. DQ도 빼요.'], [M.AP, 'AP의 길이예요.'], [d - 2 * M.AP, '다시 계산해 보세요.'], [M.BP * 2, '다시 계산해 보세요.'], [ans + 1 / d, '다시 계산해 보세요.']]
          : [[M.sum, 'AP와 CQ의 합이에요. 구하는 것은 AP 하나예요.'], [(w * h) / 2, '삼각형 ABD의 넓이예요. BD로 나누어야 해요.'], [(w * h) / d * 2, '다시 계산해 보세요.'], [h, 'AB의 길이예요.'], [w * h / (d + 1), '다시 계산해 보세요.'], [ans + 1 / d, '다시 계산해 보세요.']];
      return { tag: mine.tag, key: `${kind}-${w}-${h}`, stem: mine.stem, choices: mkChoices(ans, wrong, cf) };
    }
  };

  G.register(60, 't6', '⑥ 수선을 내려 만든 직각삼각형', '수선과 직각삼각형', PARAMS, [iso, trap, rect]);
})();
