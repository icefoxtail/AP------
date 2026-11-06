/* ==========================================================================
   중2 · 사각형의 성질 — 탭 ③ 「직사각형·마름모·정사각형」 (t3.js, order 30) — 장면 5개
   · q3-1 직사각형이 되는 조건     · 평행사변형 + (∠B=90° 또는 AC=BD)
   · q3-2 마름모가 되는 조건       · 평행사변형 + (AB=BC 또는 AC⊥BD)
   · q3-3 정사각형 = 직사각형 + 마름모 · 칩으로 두 성질을 켜고 끄기
   · q3-4 대각선의 세 가지 조건    · 이등분 · 길이가 같다 · 수직 → 사각형의 이름
   · q3-5 사각형 사이의 포함 관계  · 도형을 골라 보면 어느 집합에 속하는지 보여요
   모든 값은 지금의 길이·각(정수)으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_QD;
  if (!G) return;
  const { parAll, DEG, clamp, pt, add, sub, mul, unit, mid, dist, polar, inter, pick, rint, bboxOf, T, tagOut, ang, tick, par, fillPoly, line, poly, fit, P, mkChoices, mkTextChoices, rd, notes, fmtN, dg, para, sd, ll, an, tri, capLine, segTag, ci, vlab, shuffle } = G;
  const lenF = (v) => fmtN(v);
  const degF = G.degF;
  const rand66 = (cur) => pick([50, 56, 60, 64, 70, 76, 80, 110, 116, 120], cur);
  const same = (a, b) => Math.abs(a - b) < 1e-6;

  const PARAMS = {
    qcW: P('밑변 BC', 6, 10, 1, 8, { color: 'sky', format: lenF }),
    qcS: P('옆변 AB', 3, 5, 1, 4, { color: 'green', format: lenF }),
    qcB: P('∠B의 크기', 50, 130, 2, 66, { color: 'amber', hint: '꼭짓점 A를 끌어도 ∠B가 바뀌어요. 90°에 맞춰 보세요', format: degF }),
    qcRw: P('밑변 BC', 3, 7, 1, 6, { color: 'sky', format: lenF }),
    qcRs: P('옆변 AB', 3, 7, 1, 4, { color: 'green', hint: '두 변이 같아지는 순간을 찾아 보세요', format: lenF }),
    qcSs: P('한 변의 길이', 3, 6, 1, 4, { color: 'amber', format: lenF }),
    qcDw: P('BC − AB', 1, 4, 1, 3, { color: 'sky', hint: '마름모 성질을 끄면 이웃한 변의 길이가 달라져요', format: lenF }),
    qcSb: P('∠B의 크기', 50, 130, 2, 66, { color: 'rose', hint: '직사각형 성질을 끄면 ∠B가 바뀌어요', format: degF }),
    qcP: P('OA의 길이', 3, 5, 1, 4, { color: 'amber', format: lenF }),
    qcTh: P('∠AOB', 50, 130, 10, 70, { color: 'rose', hint: '대각선이 수직이 아닐 때의 각', format: degF }),
    qcZs: P('크기', 3, 5, 1, 4, { color: 'amber', format: lenF })
  };

  const paraBox = (w, sd0) => ({ x0: -0.66 * sd0 - 0.1, x1: w + 0.66 * sd0 + 0.1, y0: -sd0 - 0.1, y1: 0 });
  const dotsABCD = (b, p) => { [['A', p.A], ['B', p.B], ['C', p.C], ['D', p.D]].forEach(([k, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, p.O, k, { size: 17, gap: 11 }); }); };
  const dotO = (b, O, color = 'ink') => { b.point(O, { color, r: 4.5 }); T(b, O, 'O', { dx: 11, dy: -13, size: 16, color }); };
  function handleA(b, s, key, p, lo, hi) {
    b.handle('A', p.A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 끌기(∠B 바꾸기)', drag: (w2) => { const a = Math.atan2(-(w2.y - p.B.y), w2.x - p.B.x) / DEG; s[key] = clamp(Math.round(a / 2) * 2, lo, hi); } });
  }
  const rightAll = (b, p, size = 11) => { [[p.A, p.D, p.B], [p.B, p.A, p.C], [p.C, p.B, p.D], [p.D, p.C, p.A]].forEach(([v, x, y]) => b.right(v, x, y, { size, color: 'green' })); };
  // 대각선 교점 O 를 원점으로 한 사각형: OA=p1, OC=p2, OB=q1, OD=q2, ∠AOB=th
  function dq(p1, p2, q1, q2, th) {
    const O = pt(0, 0), aA = -180 + th / 2;
    const A = polar(O, p1, aA), B = polar(O, q1, aA - th), C = polar(O, p2, aA + 180), D = polar(O, q2, aA - th + 180);
    return { A, B, C, D, O, pts: [A, B, C, D] };
  }
  const stdPara = () => para(7, 4, 66);

  /* ====================================================================== 1. 직사각형이 되는 조건 */
  const evoRect = {
    id: 'q3-1', title: '평행사변형이 직사각형이 되는 조건', short: '직사각형 조건',
    question: '평행사변형이 직사각형이 되려면 ∠B가 몇 도여야 할까? 두 대각선의 길이는 어떤 관계일까?',
    ctl: ['qcW', 'qcS', 'qcB'],
    init: (s) => { s.qcW = 8; s.qcS = 4; s.qcB = 66; s.qcTh0 = 30; s.qcK = 0; s.qcAc = 12; },
    reroll: (s) => { s.qcW = rint(6, 10); s.qcS = rint(3, 5); s.qcB = rand66(s.qcB); s.qcTh0 = rint(20, 70); s.qcK = rint(0, 1); s.qcAc = pick([8, 10, 12, 14, 16], s.qcAc); },
    model: (s) => {
      const w = ci(s.qcW, 6, 10), sd0 = ci(s.qcS, 3, 5), beta = ci(s.qcB, 50, 130), p = para(w, sd0, beta), ac = dist(p.A, p.C), bd = dist(p.B, p.D);
      const th = ci(s.qcTh0 || 30, 20, 70), rr = para(8, 8 * Math.tan(th * DEG), 90);
      return { w, s: sd0, beta, p, ac, bd, eq: same(ac, bd), cmp: same(ac, bd) ? '=' : ac < bd ? '<' : '>', th, rr, K: s.qcK || 0, acv: ci(s.qcAc || 12, 8, 16), rec: para(w, sd0, 90) };
    },
    draw(b, s, M, cx) {
      if (cx.problem) { drawRectProb(b, M); return; }
      const rv = cx.review, st = cx.step, p = rv ? M.rec : M.p, { A, B, C, D, O } = p, pts = p.pts, rect = rv || M.eq;
      fit(b, paraBox(M.w, M.s), { t: 40, b: 70, l: 46, r: 46 });
      fillPoly(b, pts, rect ? 'green' : 'sky', 0.1); poly(b, pts, 'ink', 3.4);
      parAll(b, { A, B, C, D });
      line(b, A, C, 'green', 3, { dash: [8, 5] }); line(b, B, D, 'green', 3, { dash: [8, 5] });
      if (rv && st >= 2) { fillPoly(b, [A, B, C], 'amber', 0.16); fillPoly(b, [D, C, B], 'amber', 0.16); tick(b, A, B, 1); tick(b, D, C, 1); tick(b, B, C, 2); tick(b, A, C, 3); tick(b, D, B, 3); }
      if (rv && st === 1) { tick(b, A, C, 3); tick(b, D, B, 3); }
      if (!rv && rect) { tick(b, A, C, 3); tick(b, D, B, 3); tick(b, A, O, 1); tick(b, O, B, 1); tick(b, O, C, 1); tick(b, O, D, 1); }
      if (rect && (!rv || st >= 3)) rightAll(b, p);
      if (!rect || (rv && st < 3)) { /* 직각이 아닐 때는 ∠B 만 표시 */ }
      if (!rv && !rect) { ang(b, B, C, A, { color: 'amber', rings: 1, r: 28, label: dg(M.beta), size: 16, labelDist: 56 }); }
      dotO(b, O);
      dotsABCD(b, p);
      if (!rv) handleA(b, s, 'qcB', p, 50, 130);
      const cap = rv ? ['AC=BD인 평행사변형을 생각해요', 'AB=DC, BC 공통, AC=DB → △ABC ≡ △DCB (SSS)', '∠B=∠C, ∠B+∠C=180° → ∠B=∠C=90° → 직사각형'][clamp(st, 1, 3) - 1] : rect ? 'AC=BD, ∠B=90° → 직사각형이에요' : `∠B=${M.beta}° 이고 AC ${M.cmp === '<' ? '<' : '>'} BD → 직사각형이 아니에요`;
      capLine(b, pt((paraBox(M.w, M.s).x0 + paraBox(M.w, M.s).x1) / 2, 0), cap, rect ? 'green' : 'amber', { dy: 44 });
    },
    stepT: () => 0,
    steps: (M) => [
      `평행사변형 ABCD에서 두 대각선의 길이가 같다(AC=BD)고 해요. (AB=DC=${M.s}, BC=AD=${M.w})`,
      '△ABC와 △DCB에서 AB=DC, BC는 공통, AC=DB이므로 △ABC ≡ △DCB (SSS 합동)이에요. 그래서 ∠ABC=∠DCB예요.',
      'AB∥DC이므로 ∠ABC+∠DCB=180°예요. 두 각이 같으므로 ∠ABC=∠DCB=90°이고, 같은 방법으로 네 각이 모두 직각이에요. 따라서 직사각형이에요.'
    ],
    view: (M) => ({
      guide: '<b>노란 점 A</b>를 끌어 ∠B를 바꿔 보세요. ∠B가 <b>90°</b>가 되는 순간 두 대각선의 길이가 같아지고 직사각형이 돼요. 반대로 AC=BD이면 ∠B=90°예요.',
      readouts: [rd('∠B', `${M.beta}°`, 'amber'), rd('∠A = 180° − ∠B', `${180 - M.beta}°`, 'sky'), rd('AC와 BD', M.eq ? 'AC = BD' : `AC ${M.cmp} BD`, M.eq ? 'green' : 'rose'), rd('사각형 ABCD', M.eq ? '직사각형' : '평행사변형', M.eq ? 'green' : 'sky', '', null, true)],
      formula: `<p>평행사변형에서 $${an('B')}=90^{\\circ}$ 또는 $${ll('AC')}=${ll('BD')}$ → 직사각형</p><p>$${tri('ABC')}\\equiv${tri('DCB')}$ (SSS) → $${an('ABC')}=${an('DCB')}=90^{\\circ}$</p>`,
      rule: '평행사변형이 직사각형이 되는 조건: ① 한 내각이 직각 ② 두 대각선의 길이가 같다',
      notes: notes('직사각형의 정의는 <b>네 내각이 모두 직각</b>이에요. 평행사변형은 한 각만 직각이어도 나머지 각이 모두 직각이 돼요.', '직사각형의 대각선은 길이가 같고 서로를 이등분하므로 OA=OB=OC=OD예요.')
    }),
    prob: (M) => {
      if (M.K === 0) { const th = M.th; return { tag: '직사각형의 대각선', key: `r0_${th}`, stem: `직사각형 ABCD의 두 대각선의 교점을 O라 하자. ∠OBC=${th}°일 때, ∠AOB의 크기 x는?`, choices: mkChoices(2 * th, [[th, '∠OBC와 같게 구했어요. ∠AOB는 △OBC의 외각이에요.'], [90 - th, '∠OBA를 구했어요.'], [180 - 2 * th, '∠BOC를 구했어요. ∠AOB는 그 이웃한 각이에요.'], [90, '대각선이 수직인 것이 아니에요(마름모가 아니에요).']], { valid: (v) => v > 0 && v < 180, pad: 6 }) }; }
      const ac = M.acv;
      return { tag: '직사각형의 대각선', key: `r1_${ac}`, stem: `직사각형 ABCD에서 두 대각선의 교점을 O라 하자. AC=${ac}일 때, OB의 길이 x는?`, choices: mkChoices(ac / 2, [[ac, 'AC 전체예요. OB는 BD의 절반이고 BD=AC예요.'], [ac / 2 + 1, '값을 다시 확인해 보세요.'], [ac / 4, '한 번 더 나눴어요.'], [ac * 2, '2배 했어요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1 }) };
    }
  };
  function drawRectProb(b, M) {
    const p = M.K === 0 ? M.rr : para(8, 5, 90), { A, B, C, D, O } = p;
    fit(b, bboxOf(p.pts), { t: 40, b: 44, l: 46, r: 46 });
    fillPoly(b, p.pts, 'sky', 0.1); poly(b, p.pts, 'ink', 3.4); line(b, A, C, 'ink', 2.6); line(b, B, D, 'ink', 2.6);
    rightAll(b, p);
    if (M.K === 0) { ang(b, B, C, O, { color: 'sky', rings: 1, r: 36, label: dg(M.th), size: 15, labelDist: 60 }); ang(b, O, A, B, { color: 'rose', rings: 1, r: 26, label: 'x', size: 18, labelDist: 44 }); }
    else { segTag(b, A, C, 0.27, `${M.acv}`, -18, 'sky'); segTag(b, B, O, 0.5, 'x', 18, 'rose', { size: 18 }); }
    dotO(b, O); dotsABCD(b, p);
  }

  /* ====================================================================== 2. 마름모가 되는 조건 */
  const evoRhomb = {
    id: 'q3-2', title: '평행사변형이 마름모가 되는 조건', short: '마름모 조건',
    question: '평행사변형이 마름모가 되려면 이웃한 두 변의 길이는? 두 대각선은 어떻게 만날까?',
    ctl: ['qcRw', 'qcRs', 'qcB'],
    presets: () => [{ group: '바로 맞추기', label: '이웃한 변을 같게 (AB=BC)', color: 'amber', apply: (s) => { s.qcRw = s.qcRs; }, on: (s) => s.qcRw === s.qcRs }],
    init: (s) => { s.qcRw = 6; s.qcRs = 4; s.qcB = 66; s.qcAl = 66; s.qcK = 0; s.qcTh1 = 30; },
    reroll: (s) => { s.qcRw = rint(3, 7); s.qcRs = rint(3, 7); s.qcB = rand66(s.qcB); s.qcAl = pick([50, 60, 70, 80, 100, 110, 120], s.qcAl); s.qcK = rint(0, 1); s.qcTh1 = rint(20, 70); },
    model: (s) => {
      const w = ci(s.qcRw, 3, 7), sd0 = ci(s.qcRs, 3, 7), beta = ci(s.qcB, 50, 130), p = para(w, sd0, beta);
      const dot = (p.C.x - p.A.x) * (p.D.x - p.B.x) + (p.C.y - p.A.y) * (p.D.y - p.B.y), rh = w === sd0, al = ci(s.qcAl || 66, 50, 120), th = ci(s.qcTh1 || 30, 20, 70);
      return { w, s: sd0, beta, p, rh, perp: Math.abs(dot) < 1e-6, al, th, K: s.qcK || 0, rp: para(6, 6, 180 - al), rq: para(6, 6, 2 * th) };
    },
    draw(b, s, M, cx) {
      if (cx.problem) { drawRhProb(b, M); return; }
      const rv = cx.review, st = cx.step, w = rv ? M.s : M.w, p = rv ? para(M.s, M.s, M.beta) : M.p, { A, B, C, D, O } = p, pts = p.pts, rh = rv || M.rh;
      fit(b, paraBox(Math.max(M.w, M.s, 6), Math.max(M.s, 6)), { t: 40, b: 70, l: 46, r: 46 });
      fillPoly(b, pts, rh ? 'green' : 'sky', 0.1); poly(b, pts, 'ink', 3.4);
      parAll(b, { A, B, C, D }, rh ? 0.25 : 0.5);
      line(b, A, C, 'green', 3, { dash: [8, 5] }); line(b, B, D, 'green', 3, { dash: [8, 5] });
      if (rh && (!rv || st >= 1)) { tick(b, A, B, 1); tick(b, B, C, 1); tick(b, C, D, 1); tick(b, D, A, 1); }
      if (rh && (!rv || st >= 3)) { b.right(O, A, B, { size: 11, color: 'green' }); tick(b, A, O, 2); tick(b, O, C, 2); tick(b, B, O, 3); tick(b, O, D, 3); ang(b, B, A, O, { color: 'rose', rings: 2, r: 26 }); ang(b, B, C, O, { color: 'rose', rings: 2, r: 26 }); }
      if (rv && st === 2) { fillPoly(b, [A, B, O], 'amber', 0.16); fillPoly(b, [C, B, O], 'amber', 0.16); }
      if (!rv) { sd(b, A, B, O, `${M.s}`, 'amber'); sd(b, B, C, O, `${M.w}`, 'sky'); if (!rh) ang(b, B, C, A, { color: 'amber', rings: 1, r: 28, label: dg(M.beta), size: 15, labelDist: 54 }); }
      dotO(b, O); dotsABCD(b, p);
      if (!rv) handleA(b, s, 'qcB', p, 50, 130);
      void w;
      const cap = rv ? ['AB=BC인 평행사변형을 생각해요', 'AB=DC, BC=AD → 네 변의 길이가 같다 → 마름모', '△ABO ≡ △CBO (SSS) → ∠AOB=∠COB=90° → AC⊥BD'][clamp(st, 1, 3) - 1] : rh ? `AB=BC=${M.s} → 마름모예요. 대각선이 수직으로 만나요` : `AB=${M.s} ≠ BC=${M.w} → 마름모가 아니에요 (대각선이 수직이 아니에요)`;
      capLine(b, pt(3, 0), cap, rh ? 'green' : 'amber', { dy: 44 });
    },
    stepT: () => 0,
    steps: (M) => [
      `평행사변형 ABCD에서 이웃한 두 변의 길이가 같다(AB=BC=${M.s})고 해요.`,
      `평행사변형이므로 AB=DC, BC=AD예요. 그래서 네 변의 길이가 모두 ${M.s}로 같아져 마름모예요.`,
      `△ABO와 △CBO에서 AB=CB, AO=CO, BO는 공통이므로 합동(SSS)이에요. ∠AOB=∠COB이고 두 각의 합이 180°이므로 ∠AOB=90°, 즉 AC⊥BD예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>BC와 AB</b>를 바꿔 보세요. 두 변이 같아지면(<b>AB=BC</b>) 네 변이 모두 같아지고 두 대각선이 <b>수직</b>으로 만나요. 버튼으로 바로 맞출 수 있어요.',
      readouts: [rd('AB', `${M.s}`, 'amber'), rd('BC', `${M.w}`, 'sky'), rd('AB와 BC', M.rh ? '같아요' : '달라요', M.rh ? 'green' : 'rose'), rd('AC ⊥ BD', M.perp ? '수직이에요' : '수직이 아니에요', M.perp ? 'green' : 'rose'), rd('사각형 ABCD', M.rh ? '마름모' : '평행사변형', M.rh ? 'green' : 'sky', '', null, true)],
      formula: `<p>평행사변형에서 $${ll('AB')}=${ll('BC')}$ 또는 $${ll('AC')}\\perp${ll('BD')}$ → 마름모</p><p>$${tri('ABO')}\\equiv${tri('CBO')}$ (SSS) → $${an('AOB')}=90^{\\circ}$</p>`,
      rule: '평행사변형이 마름모가 되는 조건: ① 이웃한 두 변의 길이가 같다 ② 두 대각선이 서로 수직이다',
      notes: notes('마름모는 <b>네 변의 길이가 모두 같은</b> 사각형이에요. 평행사변형은 이웃한 두 변만 같으면 돼요.', '마름모의 대각선은 서로를 <b>수직이등분</b>하고, 각 꼭짓점의 각을 이등분해요.')
    }),
    prob: (M) => {
      if (M.K === 0) { const al = M.al, x = (180 - al) / 2; return { tag: '마름모의 각', key: `m0_${al}`, stem: `마름모 ABCD에서 ∠A=${al}°일 때, ∠ABD의 크기 x는?`, choices: mkChoices(x, [[al / 2, '∠A의 절반이에요. △ABD는 AB=AD인 이등변삼각형이에요.'], [180 - al, '이웃한 각 ∠B예요.'], [90 - al / 2 + 5 + (al % 2), '값을 다시 확인해 보세요.'], [al, '∠A 자신이에요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) }; }
      const th = M.th;
      return { tag: '마름모의 대각선', key: `m1_${th}`, stem: `마름모 ABCD의 두 대각선의 교점을 O라 하자. ∠ABO=${th}°일 때, ∠BAO의 크기 x는?`, choices: mkChoices(90 - th, [[th, '∠ABO와 같게 구했어요. 대각선이 수직이므로 △ABO의 세 번째 각은 90°예요.'], [180 - 2 * th, '꼭지각을 구했어요.'], [90 + th, '더했어요.'], [2 * th, '2배 했어요.']], { valid: (v) => v > 0 && v < 180, pad: 6 }) };
    }
  };
  function drawRhProb(b, M) {
    const p = M.K === 0 ? M.rp : M.rq, { A, B, C, D, O } = p;
    fit(b, bboxOf(p.pts), { t: 40, b: 44, l: 46, r: 46 });
    fillPoly(b, p.pts, 'sky', 0.1); poly(b, p.pts, 'ink', 3.4); tick(b, A, B, 1); tick(b, B, C, 1); tick(b, C, D, 1); tick(b, D, A, 1);
    if (M.K === 0) { line(b, B, D, 'ink', 2.6); ang(b, A, B, D, { color: 'sky', rings: 1, r: 36, label: dg(M.al), size: 15, labelDist: 56 }); ang(b, B, A, D, { color: 'rose', rings: 1, r: 28, label: 'x', size: 18, labelDist: 46 }); void 0; }
    else { line(b, A, C, 'ink', 2.6); line(b, B, D, 'ink', 2.6); ang(b, B, A, O, { color: 'sky', rings: 1, r: 34, label: dg(M.th), size: 15, labelDist: 56 }); ang(b, A, B, O, { color: 'rose', rings: 1, r: 26, label: 'x', size: 18, labelDist: 46 }); dotO(b, O); }
    dotsABCD(b, p);
  }

  /* ====================================================================== 3. 정사각형 = 직사각형 + 마름모 */
  const SQ_CONDS = [
    { h: '$\\angle A=90^{\\circ}$이고 $\\overline{AB}=\\overline{BC}$', ok: true, hint: '직사각형이 되는 조건(∠A=90°)과 마름모가 되는 조건(AB=BC)이 모두 있어요.' },
    { h: '$\\overline{AC}=\\overline{BD}$이고 $\\overline{AC}\\perp\\overline{BD}$', ok: true, hint: '대각선의 길이가 같으면 직사각형, 수직이면 마름모예요.' },
    { h: '$\\overline{AC}=\\overline{BD}$이고 $\\overline{AB}=\\overline{BC}$', ok: true, hint: '직사각형 조건과 마름모 조건이 모두 있어요.' },
    { h: '$\\angle A=\\angle B$이고 $\\overline{AC}\\perp\\overline{BD}$', ok: true, hint: '평행사변형에서 ∠A=∠B이면 ∠A=90°(직사각형), 대각선이 수직이면 마름모예요.' },
    { h: '$\\angle A=90^{\\circ}$이고 $\\overline{AC}\\perp\\overline{BD}$', ok: true, hint: '직사각형이면서 마름모예요.' }
  ];
  const SQ_WRONG = [
    { h: '$\\overline{AC}=\\overline{BD}$', hint: '대각선의 길이가 같으면 직사각형일 뿐 정사각형은 아니에요.' },
    { h: '$\\overline{AC}\\perp\\overline{BD}$', hint: '대각선이 수직이면 마름모일 뿐 정사각형은 아니에요.' },
    { h: '$\\overline{AB}=\\overline{BC}$', hint: '이웃한 두 변이 같으면 마름모일 뿐 정사각형은 아니에요.' },
    { h: '$\\angle A=90^{\\circ}$', hint: '한 각이 직각이면 직사각형일 뿐 정사각형은 아니에요.' },
    { h: '$\\overline{AC}=\\overline{BD}$이고 $\\angle A=90^{\\circ}$', hint: '둘 다 직사각형이 되는 조건이에요. 마름모 조건이 빠졌어요.' },
    { h: '$\\overline{AB}=\\overline{BC}$이고 $\\overline{AC}\\perp\\overline{BD}$', hint: '둘 다 마름모가 되는 조건이에요. 직사각형 조건이 빠졌어요.' }
  ];
  const RECT_SQ = [
    { h: '$\\overline{AB}=\\overline{BC}$', ok: true, hint: '직사각형에서 이웃한 두 변이 같으면 마름모이기도 해요.' },
    { h: '$\\overline{AC}\\perp\\overline{BD}$', ok: true, hint: '직사각형에서 대각선이 수직이면 마름모이기도 해요.' }
  ];
  const RECT_WRONG = [
    { h: '$\\overline{AC}=\\overline{BD}$', hint: '직사각형은 원래 두 대각선의 길이가 같아요. 새로운 조건이 아니에요.' },
    { h: '$\\angle A=90^{\\circ}$', hint: '직사각형은 원래 ∠A=90°예요. 새로운 조건이 아니에요.' },
    { h: '$\\overline{OA}=\\overline{OC}$', hint: '직사각형은 원래 대각선이 서로 이등분해요.' },
    { h: '$\\overline{AB}\\parallel\\overline{DC}$', hint: '직사각형은 원래 대변이 평행해요.' },
    { h: '$\\angle A=\\angle C$', hint: '직사각형은 원래 대각의 크기가 같아요.' }
  ];
  const evoSq = {
    id: 'q3-3', title: '정사각형 = 직사각형 + 마름모', short: '정사각형',
    question: '직사각형의 성질(네 각이 직각)과 마름모의 성질(네 변이 같다)을 모두 켜면 어떤 사각형이 될까?',
    ctl: (s) => (s.qcR && s.qcM ? ['qcSs'] : s.qcR ? ['qcSs', 'qcDw'] : s.qcM ? ['qcSs', 'qcSb'] : ['qcSs', 'qcDw', 'qcSb']),
    presets: () => [['qcR', '직사각형의 성질 켜기 (네 각이 직각)'], ['qcM', '마름모의 성질 켜기 (네 변의 길이가 같다)']].map(([k, label], i) => ({ group: i === 0 ? '성질을 켜 보세요' : '', label, color: 'amber', apply: (s) => { s[k] = !s[k]; }, on: (s) => !!s[k] })),
    init: (s) => { s.qcR = false; s.qcM = false; s.qcSs = 4; s.qcDw = 3; s.qcSb = 66; s.qcK = 0; s.qcPk = null; },
    reroll: (s) => { s.qcK = rint(0, 1); s.qcPk = null; },
    model: (s) => {
      const ss = ci(s.qcSs, 3, 6), r = !!s.qcR, m = !!s.qcM, w = m ? ss : ss + ci(s.qcDw, 1, 4), beta = r ? 90 : ci(s.qcSb, 50, 130);
      const name = r && m ? '정사각형' : r ? '직사각형' : m ? '마름모' : '평행사변형';
      return { ss, r, m, w, beta, name, p: para(w, ss, beta), K: s.qcK || 0 };
    },
    draw(b, s, M, cx) {
      if (cx.problem) { drawSqProb(b, M); return; }
      const rv = cx.review, st = cx.step, r = rv ? st >= 1 : M.r, m = rv ? st >= 2 : M.m, ss = M.ss, w = m ? ss : ss + (rv ? 3 : ci(s.qcDw, 1, 4)), beta = r ? 90 : (rv ? 66 : M.beta);
      const p = para(w, ss, beta), { A, B, C, D, O } = p, pts = p.pts;
      fit(b, paraBox(ss + 4, ss), { t: 40, b: 70, l: 46, r: 46 });
      fillPoly(b, pts, r && m ? 'green' : r ? 'sky' : m ? 'amber' : 'rose', 0.14); poly(b, pts, 'ink', 3.4);
      parAll(b, { A, B, C, D }, m ? 0.25 : 0.5);
      if (r) rightAll(b, p);
      if (m) { tick(b, A, B, 1); tick(b, B, C, 1); tick(b, C, D, 1); tick(b, D, A, 1); }
      if (r || m) { line(b, A, C, 'green', 2.6, { dash: [8, 5] }); line(b, B, D, 'green', 2.6, { dash: [8, 5] }); }
      if (r) { tick(b, A, C, 3); tick(b, D, B, 3); }
      if (m) b.right(O, A, B, { size: 10, color: 'amber' });
      if (r || m) dotO(b, O);
      if (!rv) { sd(b, A, B, O, `${ss}`, 'amber'); sd(b, B, C, O, `${w}`, 'sky'); if (!r) ang(b, B, C, A, { color: 'rose', rings: 1, r: 28, label: dg(beta), size: 15, labelDist: 54 }); }
      dotsABCD(b, p);
      const nm = r && m ? '정사각형' : r ? '직사각형' : m ? '마름모' : '평행사변형';
      const cap = rv ? ['직사각형의 성질: 네 내각이 직각, 두 대각선의 길이가 같다', '마름모의 성질: 네 변의 길이가 같다, 두 대각선이 수직이등분', '두 성질을 모두 가지면 정사각형'][clamp(st, 1, 3) - 1] : `지금은 ${nm}이에요${r && m ? ' (직사각형이면서 마름모)' : ''}`;
      capLine(b, pt((ss + 4) / 2, 0), cap, r && m ? 'green' : 'amber', { dy: 44 });
    },
    stepT: () => 0,
    steps: (M) => [
      `직사각형의 성질을 켜면 네 각이 모두 90°이고 두 대각선의 길이가 같아요. 그림에서 AB=${M.ss}인 직사각형이 돼요.`,
      `마름모의 성질을 켜면 네 변의 길이가 모두 ${M.ss}로 같고 두 대각선이 수직으로 만나요.`,
      `두 성질을 모두 가지면 네 각이 직각이고 네 변이 같은 정사각형이에요. 대각선은 길이가 같고 서로 수직이등분해요.`
    ],
    view: (M) => ({
      guide: '버튼으로 <b>직사각형의 성질</b>과 <b>마름모의 성질</b>을 켜고 꺼 보세요. 막대로 크기를 바꿔도 이름은 성질에 따라 정해져요. 두 성질이 모두 켜지면 <b>정사각형</b>이에요.',
      readouts: [rd('직사각형의 성질', M.r ? '켜짐' : '꺼짐', M.r ? 'green' : 'muted'), rd('마름모의 성질', M.m ? '켜짐' : '꺼짐', M.m ? 'green' : 'muted'), rd('사각형 ABCD', M.name, M.r && M.m ? 'green' : 'sky', '', null, true)],
      formula: `<p>(정사각형) = (직사각형) ∩ (마름모)</p><p>네 각이 모두 $90^{\\circ}$ 이고 네 변의 길이가 모두 같다</p><p>$${ll('AC')}=${ll('BD')}$ 이고 $${ll('AC')}\\perp${ll('BD')}$, 서로 이등분한다</p>`,
      rule: '정사각형은 직사각형이면서 마름모이다. (직사각형의 성질 + 마름모의 성질을 모두 가진다)',
      notes: notes('정사각형은 <b>직사각형이기도 하고 마름모이기도</b> 해요. 그래서 두 도형의 성질을 모두 써도 돼요.', '직사각형이라고 해서 정사각형은 아니에요. 이웃한 변이 같아야 해요.')
    }),
    prob: (M, s) => {
      const key = s.qcPk || (s.qcPk = { c: Math.floor(Math.random() * SQ_CONDS.length), w: shuffle(SQ_WRONG.map((_, i) => i), Math.random).slice(0, 4), rc: Math.floor(Math.random() * RECT_SQ.length), rw: shuffle(RECT_WRONG.map((_, i) => i), Math.random).slice(0, 4) });
      if (M.K === 0) {
        const items = [SQ_CONDS[key.c]].concat(key.w.map((i) => ({ h: SQ_WRONG[i].h, ok: false, hint: SQ_WRONG[i].hint })));
        return { tag: '정사각형이 되는 조건', key: `s0_${key.c}${key.w.join('')}`, html: '평행사변형 ABCD가 정사각형이 되기 위한 조건은?', choices: mkTextChoices(items, s.qdOrd), wide: true };
      }
      const items = [RECT_SQ[key.rc]].concat(key.rw.map((i) => ({ h: RECT_WRONG[i].h, ok: false, hint: RECT_WRONG[i].hint })));
      return { tag: '정사각형이 되는 조건', key: `s1_${key.rc}${key.rw.join('')}`, html: '직사각형 ABCD가 정사각형이 되기 위한 조건은? (단, 점 O는 두 대각선의 교점이다.)', choices: mkTextChoices(items, s.qdOrd), wide: true };
    }
  };
  function drawSqProb(b, M) {
    const p = M.K === 0 ? para(7, 4, 66) : para(7, 4, 90), { A, B, C, D, O } = p;
    fit(b, bboxOf(p.pts), { t: 40, b: 44, l: 46, r: 46 });
    fillPoly(b, p.pts, 'sky', 0.1); poly(b, p.pts, 'ink', 3.4); line(b, A, C, 'ink', 2.4); line(b, B, D, 'ink', 2.4);
    if (M.K === 1) { rightAll(b, p); dotO(b, O); }
    dotsABCD(b, p);
  }

  /* ====================================================================== 4. 대각선의 세 가지 조건 */
  const NAME_OF = (bi, le, pe) => (bi ? (le && pe ? '정사각형' : le ? '직사각형' : pe ? '마름모' : '평행사변형') : le && pe ? '대각선이 같고 수직인 사각형 (평행사변형이 아니에요)' : pe ? '대각선이 수직이기만 한 사각형 (평행사변형이 아니에요)' : le ? '대각선 길이만 같은 사각형 (평행사변형이 아니에요)' : '일반 사각형 (평행사변형이 아니에요)');
  const REC_C = [
    { h: '$\\overline{AC}=\\overline{BD}$', hint: '' }, { h: '$\\angle A=90^{\\circ}$', hint: '' }, { h: '$\\angle A=\\angle B$', hint: '' }
  ];
  void REC_C;
  const RT = [{ h: '$\\overline{AC}=\\overline{BD}$' }, { h: '$\\angle A=90^{\\circ}$' }, { h: '$\\angle A=\\angle B$' }];
  const RF = [{ h: '$\\overline{AC}\\perp\\overline{BD}$', hint: '대각선이 수직이면 마름모가 돼요.' }, { h: '$\\overline{AB}=\\overline{BC}$', hint: '이웃한 변이 같으면 마름모가 돼요.' }, { h: '$\\overline{AB}=\\overline{AD}$', hint: '이웃한 변이 같으면 마름모가 돼요.' }, { h: '$\\angle A=\\angle C$', hint: '평행사변형은 원래 대각의 크기가 같아요. 새로운 조건이 아니에요.' }, { h: '$\\overline{OA}=\\overline{OC}$', hint: '평행사변형은 원래 대각선이 서로 이등분해요. 새로운 조건이 아니에요.' }, { h: '$\\overline{AD}\\parallel\\overline{BC}$', hint: '평행사변형은 원래 대변이 평행해요. 새로운 조건이 아니에요.' }];
  const MT = [{ h: '$\\overline{AB}=\\overline{BC}$' }, { h: '$\\overline{AC}\\perp\\overline{BD}$' }, { h: '$\\overline{AB}=\\overline{AD}$' }];
  const MF = [{ h: '$\\overline{AC}=\\overline{BD}$', hint: '대각선의 길이가 같으면 직사각형이 돼요.' }, { h: '$\\angle A=90^{\\circ}$', hint: '한 각이 직각이면 직사각형이 돼요.' }, { h: '$\\angle A=\\angle B$', hint: '한 각이 직각이 되어 직사각형이 돼요.' }, { h: '$\\angle A=\\angle C$', hint: '평행사변형은 원래 대각의 크기가 같아요.' }, { h: '$\\overline{OB}=\\overline{OD}$', hint: '평행사변형은 원래 대각선이 서로 이등분해요.' }, { h: '$\\overline{AB}\\parallel\\overline{DC}$', hint: '평행사변형은 원래 대변이 평행해요.' }];
  const diagSyn = {
    id: 'q3-4', title: '대각선의 세 가지 조건과 사각형', short: '대각선 조건',
    question: '두 대각선이 ① 서로 이등분하고 ② 길이가 같고 ③ 수직이면 사각형의 이름이 어떻게 바뀔까?',
    ctl: (s) => ['qcP'].concat(s.qcV ? [] : ['qcTh']),
    presets: () => [['qcI', '① 서로 이등분'], ['qcL', '② 길이가 같다'], ['qcV', '③ 수직으로 만난다']].map(([k, label], i) => ({ group: i === 0 ? '대각선의 조건을 켜 보세요' : '', label, color: 'amber', apply: (s) => { s[k] = !s[k]; }, on: (s) => !!s[k] })),
    init: (s) => { s.qcI = true; s.qcL = false; s.qcV = false; s.qcP = 4; s.qcTh = 70; s.qcK = 0; s.qcPk = null; s.qcTg = 0; },
    reroll: (s) => { s.qcK = rint(0, 1); s.qcPk = null; },
    model: (s) => {
      const bi = !!s.qcI, le = !!s.qcL, pe = !!s.qcV, p = ci(s.qcP, 3, 5), th = pe ? 90 : ci(s.qcTh, 50, 130);
      let q;
      if (bi) { q = le ? p : (p === 3 ? 4 : p - 1); } else q = 0;
      let g;
      if (bi) g = dq(p, p, q, q, th);
      else if (le) g = dq(p - 1, p + 1, p - 1, p + 1, th);
      else g = dq(p - 1, p + 1, 2, 4, th);
      const a = { ...g };
      return { bi, le, pe, p, q, th, g: a, name: NAME_OF(bi, le, pe), K: s.qcK || 0, rect: bi && le, rh: bi && pe };
    },
    draw(b, s, M, cx) {
      if (cx.problem) { drawDiagProb(b, M); return; }
      const rv = cx.review, st = cx.step;
      const bi = rv ? true : M.bi, le = rv ? st >= 1 : M.le, pe = rv ? st >= 2 : M.pe;
      const q0 = bi ? (le ? M.p : M.p === 3 ? 4 : M.p - 1) : 0;
      const th = pe ? 90 : (rv ? 70 : M.th);
      const g = bi ? dq(M.p, M.p, q0, q0, th) : (le ? dq(M.p - 1, M.p + 1, M.p - 1, M.p + 1, th) : dq(M.p - 1, M.p + 1, 2, 4, th)), { A, B, C, D, O, pts } = g;
      fit(b, { x0: -6.4, x1: 6.4, y0: -5.2, y1: 5.2 }, { t: 36, b: 74, l: 40, r: 40 });
      fillPoly(b, pts, bi && le && pe ? 'green' : bi ? 'sky' : 'rose', 0.12); poly(b, pts, 'ink', 3.4);
      line(b, A, C, 'green', 2.8, { dash: [8, 5] }); line(b, B, D, 'green', 2.8, { dash: [8, 5] });
      if (bi) { tick(b, A, O, 1); tick(b, O, C, 1); tick(b, B, O, 2); tick(b, O, D, 2); }
      if (le) { tick(b, A, C, 3); tick(b, B, D, 3); }
      if (pe) b.right(O, A, B, { size: 11, color: 'amber' });
      else ang(b, O, A, B, { color: 'rose', rings: 1, r: 22, label: dg(th), size: 14, labelDist: 40 });
      if (bi) { par(b, A, B, 1, 'green'); par(b, D, C, 1, 'green'); par(b, A, D, 2, 'green'); par(b, B, C, 2, 'green'); }
      dotO(b, O); dotsABCD(b, g);
      const nm = NAME_OF(bi, le, pe);
      const cap = rv ? ['두 대각선이 서로 이등분 → 평행사변형', '+ 두 대각선의 길이가 같다 → 직사각형', '+ 두 대각선이 수직 → 정사각형'][clamp(st, 1, 3) - 1] : `${nm}`;
      capLine(b, pt(0, 5.2), cap, bi ? 'green' : 'rose', { dy: 40 });
    },
    stepT: () => 0,
    steps: (M) => [
      `① 두 대각선이 서로 다른 것을 이등분하면(OA=OC, OB=OD) 사각형 ABCD는 평행사변형이에요.`,
      `② 여기에 두 대각선의 길이가 같다(AC=BD=${2 * M.p})는 조건이 더해지면 직사각형이에요.`,
      `③ 두 대각선이 수직이라는 조건까지 더해지면 정사각형이에요. (③만 더하면 마름모)`
    ],
    view: (M) => ({
      guide: '버튼으로 <b>대각선의 조건</b>을 켜고 꺼 보세요. ①(서로 이등분)이 꺼지면 평행사변형이 아니에요. ①+②는 <b>직사각형</b>, ①+③은 <b>마름모</b>, 셋 다는 <b>정사각형</b>이에요.',
      readouts: [rd('① 서로 이등분', M.bi ? '켜짐' : '꺼짐', M.bi ? 'green' : 'muted'), rd('② 길이가 같다', M.le ? '켜짐' : '꺼짐', M.le ? 'green' : 'muted'), rd('③ 수직', M.pe ? '켜짐' : '꺼짐', M.pe ? 'green' : 'muted'), rd('사각형 ABCD', M.name.replace(' (평행사변형이 아니에요)', ''), M.bi ? 'green' : 'rose', M.bi ? '' : '평행사변형이 아니에요', null, true)],
      formula: '<p>이등분만 → 평행사변형</p><p>이등분 + 길이가 같다 → 직사각형</p><p>이등분 + 수직 → 마름모</p><p>이등분 + 길이가 같다 + 수직 → 정사각형</p>',
      rule: '평행사변형에서 두 대각선의 길이가 같으면 직사각형, 수직이면 마름모, 둘 다이면 정사각형이다',
      notes: notes('<b>이등분</b>이 먼저예요. 이등분하지 않으면 길이가 같아도, 수직이어도 평행사변형이 아니에요.', '대각선의 길이가 같다는 조건은 <b>직사각형</b>, 수직이라는 조건은 <b>마름모</b>와 짝이에요.')
    }),
    prob: (M, s) => {
      const key = s.qcPk || (s.qcPk = { a: Math.floor(Math.random() * 3), b: shuffle(RF.map((_, i) => i), Math.random).slice(0, 4), c: Math.floor(Math.random() * 3), d: shuffle(MF.map((_, i) => i), Math.random).slice(0, 4) });
      if (M.K === 0) {
        const items = [{ h: RT[key.a].h, ok: true }].concat(key.b.map((i) => ({ h: RF[i].h, ok: false, hint: RF[i].hint })));
        return { tag: '직사각형이 되는 조건', key: `d0_${key.a}${key.b.join('')}`, html: '평행사변형 ABCD가 직사각형이 되기 위한 조건은? (단, 점 O는 두 대각선의 교점이다.)', choices: mkTextChoices(items, s.qdOrd), wide: true };
      }
      const items = [{ h: MT[key.c].h, ok: true }].concat(key.d.map((i) => ({ h: MF[i].h, ok: false, hint: MF[i].hint })));
      return { tag: '마름모가 되는 조건', key: `d1_${key.c}${key.d.join('')}`, html: '평행사변형 ABCD가 마름모가 되기 위한 조건은? (단, 점 O는 두 대각선의 교점이다.)', choices: mkTextChoices(items, s.qdOrd), wide: true };
    }
  };
  function drawDiagProb(b, M) {
    const p = para(7, 4, 66), { A, B, C, D, O } = p;
    fit(b, bboxOf(p.pts), { t: 40, b: 44, l: 46, r: 46 });
    fillPoly(b, p.pts, 'sky', 0.1); poly(b, p.pts, 'ink', 3.4); line(b, A, C, 'ink', 2.4); line(b, B, D, 'ink', 2.4);
    parAll(b, { A, B, C, D });
    dotO(b, O); dotsABCD(b, p);
  }

  /* ====================================================================== 5. 사각형 사이의 포함 관계 */
  const SHAPES = [['gen', '사각형'], ['trap', '사다리꼴'], ['para', '평행사변형'], ['rect', '직사각형'], ['rhomb', '마름모'], ['sq', '정사각형']];
  // 포함 관계 그림(집합 상자)의 칸 (세계 좌표: 가로 0~12, 세로 0~7)
  const BOX = { gen: [0, 0, 12, 7], trap: [0.4, 0.9, 11.6, 6.6], para: [0.8, 1.8, 11.2, 6.2], rect: [1.2, 2.8, 7.4, 5.9], rhomb: [4.6, 2.8, 10.8, 5.9] };
  const IN = { gen: ['gen'], trap: ['gen', 'trap'], para: ['gen', 'trap', 'para'], rect: ['gen', 'trap', 'para', 'rect'], rhomb: ['gen', 'trap', 'para', 'rhomb'], sq: ['gen', 'trap', 'para', 'rect', 'rhomb'] };
  function figOf(kind, sz) {
    const h = sz;
    switch (kind) {
      case 'gen': return [pt(1.1, -h), pt(0, 0), pt(7, 0), pt(5.6, -h * 0.72)];
      case 'trap': return [pt(1.4, -h), pt(0, 0), pt(7, 0), pt(5.2, -h)];
      case 'para': { const q = para(7, h, 66); return q.pts; }
      case 'rect': return para(7, h, 90).pts;
      case 'rhomb': return para(h + 2, h + 2, 66).pts;
      default: return para(h + 1, h + 1, 90).pts;
    }
  }
  function drawVenn(b, active, y0, scale = 1) {
    const mk = (id, name, color, tx, ty) => {
      const [x0, ya, x1, yb] = BOX[id], on = active ? active.includes(id) : true, Y = (v) => y0 + v * scale;
      const pts = [pt(x0, Y(ya)), pt(x1, Y(ya)), pt(x1, Y(yb)), pt(x0, Y(yb))];
      fillPoly(b, pts, color, on ? (active ? 0.22 : 0.08) : 0.03); poly(b, pts, on ? color : 'muted', on ? 3 : 1.6, { alpha: on ? 1 : 0.6 });
      T(b, pt(tx, Y(ya)), name, { dy: 12, size: b.W < 560 ? 12 : 14, color: on ? 'ink' : 'muted', align: 'left' });
    };
    mk('gen', '사각형', 'sky', 0.25, 0); mk('trap', '사다리꼴', 'violet', 0.65, 0.9); mk('para', '평행사변형', 'green', 1.05, 1.8);
    mk('rect', '직사각형', 'amber', 1.45, 2.8); mk('rhomb', '마름모', 'rose', 7.7, 2.8);
    const sqOn = !active || active.includes('rect') && active.includes('rhomb');
    T(b, pt(6.0, y0 + 4.35 * scale), '정사각형', { size: b.W < 560 ? 12 : 14, color: sqOn ? 'green' : 'muted' });
    if (active && active.includes('rect') && active.includes('rhomb')) { fillPoly(b, [pt(4.6, y0 + 2.8 * scale), pt(7.4, y0 + 2.8 * scale), pt(7.4, y0 + 5.9 * scale), pt(4.6, y0 + 5.9 * scale)], 'green', 0.3); }
  }
  const shapeName = (k) => SHAPES.find((x) => x[0] === k)[1];
  const MEM_T = [
    { h: '정사각형은 직사각형이다.' }, { h: '정사각형은 마름모이다.' }, { h: '직사각형은 평행사변형이다.' }, { h: '마름모는 평행사변형이다.' }, { h: '평행사변형은 사다리꼴이다.' }, { h: '정사각형은 평행사변형이다.' }, { h: '마름모는 사다리꼴이다.' }
  ];
  const MEM_F = [
    { h: '직사각형은 마름모이다.', hint: '직사각형은 이웃한 변의 길이가 같다고 할 수 없어요. (정사각형일 때만)' }, { h: '마름모는 직사각형이다.', hint: '마름모는 네 각이 직각이라고 할 수 없어요. (정사각형일 때만)' }, { h: '평행사변형은 직사각형이다.', hint: '평행사변형은 네 각이 직각이라고 할 수 없어요.' }, { h: '사다리꼴은 평행사변형이다.', hint: '사다리꼴은 한 쌍의 대변만 평행해도 돼요. 반대로 평행사변형이 사다리꼴이에요.' }, { h: '마름모는 정사각형이다.', hint: '마름모는 네 각이 직각이라고 할 수 없어요.' }, { h: '직사각형은 정사각형이다.', hint: '직사각형은 네 변의 길이가 같다고 할 수 없어요.' }, { h: '평행사변형은 마름모이다.', hint: '평행사변형은 네 변의 길이가 같다고 할 수 없어요.' }
  ];
  const incl = {
    id: 'q3-5', title: '사각형 사이의 포함 관계', short: '포함 관계',
    question: '사각형, 사다리꼴, 평행사변형, 직사각형, 마름모, 정사각형은 서로 어떤 관계일까? 어느 도형이 어느 도형에 속할까?',
    ctl: ['qcZs'],
    presets: () => SHAPES.map(([id, label], i) => ({ group: i === 0 ? '도형을 골라 보세요' : '', label, color: 'amber', apply: (s) => { s.qcSh = id; }, on: (s) => (s.qcSh || 'sq') === id })),
    init: (s) => { s.qcSh = 'sq'; s.qcZs = 4; s.qcK = 0; s.qcPk = null; },
    reroll: (s) => { s.qcK = rint(0, 1); s.qcPk = null; },
    model: (s) => { const k = s.qcSh || 'sq', z = ci(s.qcZs, 3, 5); return { k, z, pts: figOf(k, z), mem: IN[k], K: s.qcK || 0 }; },
    draw(b, s, M, cx) {
      const narrow = b.W < 560;
      if (cx.problem) { fit(b, { x0: 0, x1: 12, y0: 0, y1: 7 }, { t: 24, b: 24, l: 24, r: 24 }); drawVenn(b, null, 0); return; }
      const rv = cx.review, st = cx.step, k = rv ? ['para', 'rect', 'sq'][clamp(st, 1, 3) - 1] : M.k, pts = rv ? figOf(k, M.z) : M.pts;
      const bb = bboxOf(pts), shW = bb.x1 - bb.x0, shH = bb.y1 - bb.y0;
      if (narrow) {
        const gap = 1.5, sh = pts.map((q) => pt(q.x - bb.x0 + (12 - shW) / 2, q.y - bb.y0));
        fit(b, { x0: 0, x1: 12, y0: -0.2, y1: shH + gap + 7.1 }, { t: 14, b: 44, l: 12, r: 12 });
        drawFig(b, sh, k); drawVenn(b, IN[k], shH + gap);
        capLine(b, pt(6, shH + gap + 7), memCap(k), 'green', { dy: 16 });
      } else {
        const ox = 14, sh = pts.map((q) => pt(q.x - bb.x0 + ox, q.y - bb.y0 + (7 - shH) / 2));
        fit(b, { x0: -0.3, x1: ox + shW + 0.6, y0: -0.3, y1: 7.3 }, { t: 24, b: 56, l: 24, r: 24 });
        drawVenn(b, IN[k], 0); drawFig(b, sh, k);
        capLine(b, pt((ox + shW) / 2, 7.3), memCap(k), 'green', { dy: 20 });
      }
    },
    stepT: () => 0,
    steps: () => [
      '한 쌍의 대변이 평행한 사각형이 사다리꼴이에요. 두 쌍의 대변이 각각 평행하면 평행사변형이므로 평행사변형은 사다리꼴에 포함돼요.',
      '평행사변형 중 네 각이 직각이면 직사각형, 네 변의 길이가 같으면 마름모예요. 둘 다 평행사변형에 포함돼요.',
      '직사각형이면서 마름모인 것이 정사각형이에요. 그래서 정사각형은 직사각형과 마름모에 모두 포함돼요.'
    ],
    view: (M) => ({
      guide: '버튼으로 <b>도형을 골라</b> 보세요. 그림에서 그 도형이 <b>속하는 상자가 모두 칠해져요</b>. 막대로 도형의 크기를 바꿔도 같아요.',
      readouts: [rd('고른 도형', shapeName(M.k), 'amber', '', null, true), rd('속하는 도형', M.mem.map(shapeName).join(' · '), 'green', '', null, true)],
      formula: '<p>(정사각형) ⊂ (직사각형), (마름모) ⊂ (평행사변형) ⊂ (사다리꼴) ⊂ (사각형)</p><p>(직사각형) ∩ (마름모) = (정사각형)</p>',
      rule: '사각형 ⊃ 사다리꼴 ⊃ 평행사변형 ⊃ 직사각형·마름모 ⊃ 정사각형 (정사각형은 직사각형이면서 마름모이다)',
      notes: notes('<b>작은 상자 안의 도형은 큰 상자 도형의 성질을 모두</b> 가져요. 예: 마름모는 평행사변형이므로 대변이 평행해요.', '거꾸로는 성립하지 않아요. 평행사변형이라고 해서 직사각형은 아니에요.')
    }),
    prob: (M, s) => {
      const pk = s.qcPk || (s.qcPk = { t: shuffle(MEM_T.map((_, i) => i), Math.random).slice(0, 4), f: shuffle(MEM_F.map((_, i) => i), Math.random).slice(0, 4), a: Math.floor(Math.random() * MEM_T.length), b: Math.floor(Math.random() * MEM_F.length) });
      if (M.K === 0) {
        const items = [{ h: MEM_F[pk.b].h, ok: true, hint: MEM_F[pk.b].hint }].concat(pk.t.map((i) => ({ h: MEM_T[i].h, ok: false, hint: '이 문장은 옳아요. 포함 관계 그림을 다시 보세요.' })));
        return { tag: '포함 관계', key: `i0_${pk.b}${pk.t.join('')}`, html: '다음 중 사각형 사이의 포함 관계로 옳지 <u>않은</u> 것은? (그림은 사각형 사이의 포함 관계예요.)', choices: mkTextChoices(items, s.qdOrd), wide: true };
      }
      const items = [{ h: MEM_T[pk.a].h, ok: true }].concat(pk.f.map((i) => ({ h: MEM_F[i].h, ok: false, hint: MEM_F[i].hint })));
      return { tag: '포함 관계', key: `i1_${pk.a}${pk.f.join('')}`, html: '다음 중 사각형 사이의 포함 관계로 옳은 것은? (그림은 사각형 사이의 포함 관계예요.)', choices: mkTextChoices(items, s.qdOrd), wide: true };
    }
  };
  const memCap = (k) => (k === 'gen' ? '아무 조건이 없는 사각형' : `${shapeName(k)}: ${IN[k].filter((x) => x !== k).map(shapeName).join('·') || ''}${IN[k].length > 1 ? '이기도 해요' : ''}`);
  function drawFig(b, pts, kind) {
    fillPoly(b, pts, kind === 'sq' ? 'green' : 'sky', 0.14); poly(b, pts, 'ink', 3.4);
    const n = pts.length;
    if (kind === 'trap') { par(b, pts[0], pts[3], 1, 'green'); par(b, pts[1], pts[2], 1, 'green'); }
    if (kind === 'para' || kind === 'rect' || kind === 'rhomb' || kind === 'sq') { const pf = kind === 'rhomb' || kind === 'sq' ? 0.25 : 0.5; par(b, pts[0], pts[3], 1, 'green', pf); par(b, pts[1], pts[2], 1, 'green', pf); par(b, pts[0], pts[1], 2, 'green', pf); par(b, pts[3], pts[2], 2, 'green', pf); }
    if (kind === 'rect' || kind === 'sq') { [[0, 3, 1], [1, 0, 2], [2, 1, 3], [3, 2, 0]].forEach(([v, a1, c1]) => b.right(pts[v], pts[a1], pts[c1], { size: 10, color: 'green' })); }
    if (kind === 'rhomb' || kind === 'sq') { for (let i = 0; i < n; i++) tick(b, pts[i], pts[(i + 1) % n], 1); }
    ['A', 'B', 'C', 'D'].forEach((nm, i) => { b.point(pts[i], { color: 'ink', r: 4 }); tagOut(b, pts[i], pts.reduce((a, q) => add(a, mul(q, 0.25)), pt(0, 0)), nm, { size: 15, gap: 9 }); });
  }

  const gl = [evoRect, evoRhomb, evoSq, diagSyn, incl];
  G.register(30, 'qd3', '③ 직사각형·마름모·정사각형', '직사각형·마름모·정사각형', PARAMS, gl);
})();
