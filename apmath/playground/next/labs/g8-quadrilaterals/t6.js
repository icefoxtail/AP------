/* ==========================================================================
   중2 · 사각형의 성질 — 탭 ⑥ 「종이접기·결합」 (t6.js, order 60) — 장면 6개
   · q6-1 대각선으로 접기      · 직사각형을 대각선 AC로 접으면 △EAC는 이등변삼각형 (∠AEB=2×∠DAC)
   · q6-2 꼭짓점을 겹치게 접기 · C를 A에 포개면 AECF는 마름모 (접은 부분은 제자리에서 접혀요)
   · q6-3 정사각형 대각선 위의 점 · △ABE ≡ △ADE → ∠ABE=∠ADE
   · q6-4 정사각형 + 정삼각형   · ∠ABE=30°, ∠BAE=75°, ∠AED=150°
   · q6-5 정사각형 속 수직인 두 선분 · BE=CF이면 AE⊥BF, AE=BF
   · q6-6 정사각형의 중심에서 회전 · 겹친 부분의 넓이는 늘 $\frac{1}{4}$
   접기·회전은 제자리에서 접히고 돕니다(옮기지 않아요). 길이·각은 모두 정수입니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_QD;
  if (!G) return;
  const { DEG, clamp, seg01, pt, add, sub, mul, unit, mid, lerp, dist, polar, inter, foot, refl, rotP, pick, rint, bboxOf, unionBox, T, tagOut, ang, tick, par, fillPoly, line, poly, fit, P, mkChoices, rd, notes, fmtN, dg, sd, ll, an, tri, capLine, segTag, ci } = G;
  const lenF = (v) => fmtN(v);
  const degF = G.degF;
  const sinD = (d) => Math.sin(d * DEG), cosD = (d) => Math.cos(d * DEG), tanD = (d) => Math.tan(d * DEG);
  const dotN = (b, named, cen, o = {}) => Object.keys(named).forEach((k) => { b.point(named[k], { color: (o.col && o.col[k]) || 'ink', r: 4.5 }); tagOut(b, named[k], (o.cens && o.cens[k]) || cen, k, { size: 17, gap: 11, color: (o.col && o.col[k]) || 'ink' }); });
  // 접기: 직선 ac 를 접는 선으로 점 P 를 t(0~1)만큼 접은 위치 (접는 선에 수직인 성분이 cos(πt)로 줄어듭니다)
  const foldP = (Pp, a, c, t) => { const f = foot(Pp, a, c), k = Math.cos(Math.PI * t); return pt(f.x + (Pp.x - f.x) * k, f.y + (Pp.y - f.y) * k); };

  const PARAMS = {
    qfT: P('접기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 접는 선을 따라 제자리에서 접혀요', format: (v) => (v >= 0.999 ? '접힘' : Math.round(v * 100) + '%') }),
    qfTh: P('∠DAC의 크기', 20, 40, 1, 30, { color: 'amber', format: degF }),
    qfW: P('밑변 BC', 6, 10, 1, 8, { color: 'sky', format: lenF }),
    qfPh: P('∠ACB의 크기', 20, 40, 1, 30, { color: 'amber', format: degF }),
    qfB: P('∠BEC의 크기', 50, 130, 5, 65, { color: 'amber', hint: '점 E를 대각선 위에서 끌어도 돼요', format: degF }),
    qfS: P('정사각형의 한 변', 3, 6, 1, 4, { color: 'sky', format: lenF }),
    qfE: P('BE의 길이', 1, 7, 1, 2, { color: 'amber', hint: '그림의 점 E를 가로로 끌어도 돼요', format: lenF }),
    qfSp: P('한 변의 길이', 4, 8, 2, 6, { color: 'sky', format: lenF }),
    qfRot: P('돌리기', 0, 1, 0.01, 0.28, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 합동인 정사각형이 점 O를 중심으로 제자리에서 돌아요', format: (v) => Math.round(v * 90) + '°' })
  };

  /* ====================================================================== 1. 대각선으로 접기 */
  const foldTape = {
    id: 'q6-1', title: '직사각형을 대각선으로 접기', short: '대각선으로 접기',
    question: '직사각형 ABCD를 대각선 AC를 접는 선으로 접으면 겹쳐진 △EAC는 어떤 삼각형일까? ∠AEB는 몇 도일까?',
    ctl: ['qfT', 'qfTh', 'qfW'], anim: { key: 'qfT', dur: 5, label: '대각선 AC로 접기', start: 0 },
    init: (s) => { s.qfT = 0; s.qfTh = 30; s.qfW = 8; s.qfK = 0; },
    reroll: (s) => { s.qfTh = rint(20, 40); s.qfW = rint(6, 10); s.qfK = rint(0, 1); s.qfT = 0; },
    model: (s) => {
      const th = ci(s.qfTh, 20, 40), w = ci(s.qfW, 6, 10), h = w * tanD(th), A = pt(0, -h), B = pt(0, 0), C = pt(w, 0), D = pt(w, -h), Dp = refl(D, A, C), E = inter(A, Dp, B, C);
      return { th, w, h, A, B, C, D, Dp, E, aeb: 2 * th, K: s.qfK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, Dp, E } = M, st = cx.step;
      const t = cx.lesson ? (cx.entry ? 0 : clamp(Number(s.qfT) || 0, 0, 1)) : cx.problem ? 1 : cx.review ? (st >= 2 ? 1 : 0) : cx.t, done = t >= 0.999;
      const yb = 0.31 * M.w + 0.3;
      const compactProblem = cx.problem && b.W < 560;
      fit(b, compactProblem ? bboxOf([A, B, C, D, Dp]) : { x0: -0.4, x1: M.w + 0.4, y0: -M.w * tanD(40) - 0.3, y1: yb }, compactProblem ? { t: 28, b: 32, l: 36, r: 36 } : { t: 30, b: 76, l: 40, r: 40 });
      const Dt = foldP(D, A, C, t);
      fillPoly(b, [A, B, C], 'sky', 0.1); poly(b, [A, B, C], 'ink', 3.4);
      if (t > 0.001) { poly(b, [A, C, D], 'muted', 2, { dash: [6, 6], alpha: 0.7 }); }
      fillPoly(b, [A, C, Dt], 'amber', 0.22); poly(b, [A, C, Dt], 'amber', 3.2);
      line(b, A, C, 'green', 3.4);
      if (!done) line(b, A, D, 'ink', 3.4), line(b, D, C, 'ink', 3.4);
      if (done) { line(b, A, Dp, 'amber', 3.4); line(b, B, C, 'ink', 3.4); }
      if (cx.problem) {
        ang(b, A, D, C, { color: 'sky', rings: 1, r: 36, label: M.K === 0 ? dg(M.th) : 'x', size: M.K === 0 ? 15 : 18, labelColor: M.K === 0 ? 'sky' : 'rose', labelDist: 58 }); ang(b, A, C, Dp, { color: 'sky', rings: 1, r: 26 });
        ang(b, E, A, B, { color: M.K === 0 ? 'rose' : 'sky', rings: 1, r: 28, label: M.K === 0 ? 'x' : dg(M.aeb), size: M.K === 0 ? 18 : 15, labelColor: M.K === 0 ? 'rose' : 'sky', labelDist: 50 });
        dotN(b, { A, B, C, D, E }, mid(A, C), { cens: { E: C } }); b.point(Dp, { color: 'ink', r: 4.5 }); tagOut(b, Dp, mid(A, C), 'D′', { size: 17 });
        return;
      }
      if (done && (!cx.review || st >= 2)) {
        ang(b, A, D, C, { color: 'sky', rings: 1, r: 26 }); ang(b, A, C, Dp, { color: 'sky', rings: 1, r: 34 }); ang(b, C, E, A, { color: 'sky', rings: 1, r: 24, label: dg(M.th), size: 14, labelDist: 46 });
      }
      if (done && (!cx.review || st >= 3)) { tick(b, E, A, 1); tick(b, E, C, 1); ang(b, E, A, B, { color: 'rose', rings: 1, r: 28, label: dg(M.aeb), size: 15, labelDist: 52 }); }
      if (!done && !cx.review) ang(b, A, D, C, { color: 'sky', rings: 1, r: 28, label: dg(M.th), size: 14, labelDist: 52 });
      const pts4 = { A, B, C };
      dotN(b, pts4, mid(A, C), { cens: { A: mid(A, C) } });
      b.point(D, { color: 'ink', r: 4.5 }); if (!done) tagOut(b, D, mid(A, C), 'D', { size: 17 });
      if (done) { b.point(E, { color: 'amber', r: 5 }); tagOut(b, E, A, 'E', { size: 17, gap: 12, color: 'amber' }); b.point(Dp, { color: 'ink', r: 4.5 }); tagOut(b, Dp, mid(A, C), 'D′', { size: 17 }); }
      const cap = cx.review ? ['접는 선 AC: ∠DAC=∠D′AC (접은 각)', `AD∥BC → ∠DAC=∠ACB=${M.th}° → ∠EAC=∠ECA → EA=EC`, `∠AEB = ∠EAC + ∠ECA = ${M.th}°+${M.th}° = ${M.aeb}°`][clamp(st, 1, 3) - 1] : done ? `EA=EC (이등변삼각형) · ∠AEB=${M.aeb}°` : `▶를 눌러 대각선 AC로 접어 보세요 (∠DAC=${M.th}°)`;
      capLine(b, pt(M.w / 2, yb), cap, done ? 'amber' : 'rose', { dy: 34 });
    },
    stepT: (n) => (n >= 2 ? 1 : 0),
    steps: (M) => [
      `직사각형 ABCD를 대각선 AC를 접는 선으로 접으면 점 D가 D′으로 옮겨져요. 접은 각이므로 ∠DAC=∠D′AC=${M.th}°예요.`,
      `AD∥BC이므로 ∠DAC=∠ACB(엇각)=${M.th}°예요. 그래서 ∠EAC=∠D′AC=${M.th}°=∠ECA이고, △EAC는 EA=EC인 이등변삼각형이에요.`,
      `∠AEB는 △EAC의 외각이므로 ∠AEB=∠EAC+∠ECA=${M.th}°+${M.th}°=${M.aeb}°예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>접기</b>를 움직이거나 ▶를 눌러 보세요. 직사각형이 대각선 AC를 접는 선으로 <b>제자리에서 접혀요</b>. 막대로 ∠DAC와 BC를 바꿔도 △EAC는 늘 <b>이등변삼각형</b>이에요.',
      readouts: [rd('∠DAC = ∠D′AC', `${M.th}°`, 'sky', '접은 각'), rd('∠ACB', `${M.th}°`, 'sky', '엇각'), rd('EA = EC', '이등변삼각형', 'green'), rd('∠AEB', `${M.aeb}°`, 'rose', `${M.th}°+${M.th}°`, null, true)],
      formula: `<p>$${an('DAC')}=${an('D\\prime AC')}=${an('ACB')}=${M.th}^{\\circ}$ → $${ll('EA')}=${ll('EC')}$</p><p>$${an('AEB')}=${an('EAC')}+${an('ECA')}=${M.th}^{\\circ}+${M.th}^{\\circ}=${M.aeb}^{\\circ}$</p>`,
      rule: '평행한 종이테이프를 접으면 (접은 각) = (엇각)이므로 겹친 삼각형은 이등변삼각형이다',
      notes: notes('접은 각과 엇각이 같아서 <b>같은 각이 세 곳</b>에 생겨요.', '∠AEB는 이등변삼각형의 <b>외각</b>이에요. 밑각 두 개의 합이에요.')
    }),
    prob: (M) => {
      if (M.K === 0) return { tag: '접은 각', key: `f0_${M.th}`, stem: `직사각형 ABCD를 대각선 AC를 접는 선으로 접었다. 점 D가 옮겨진 점을 D′, AD′과 BC가 만나는 점을 E라 하자. ∠DAC=${M.th}°일 때, ∠AEB의 크기 x는?`, choices: mkChoices(M.aeb, [[M.th, '∠EAC만 구했어요. ∠AEB는 이등변삼각형의 외각이에요.'], [180 - 2 * M.th, '꼭지각 ∠AEC를 구했어요. ∠AEB는 그 이웃한 각이에요.'], [90 - M.th, '값을 다시 확인해 보세요.'], [3 * M.th, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 4 }) };
      return { tag: '접은 각', key: `f1_${M.aeb}`, stem: `직사각형 ABCD를 대각선 AC를 접는 선으로 접었다. 점 D가 옮겨진 점을 D′, AD′과 BC가 만나는 점을 E라 하자. ∠AEB=${M.aeb}°일 때, ∠DAC의 크기 x는?`, choices: mkChoices(M.th, [[M.aeb, '∠AEB 자신이에요. ∠DAC는 그 절반이에요.'], [90 - M.th, '값을 다시 확인해 보세요.'], [180 - M.aeb, '이웃한 각이에요.'], [M.th + 5, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 4 }) };
    }
  };

  /* ====================================================================== 2. 꼭짓점을 겹치게 접기 */
  const foldV = {
    id: 'q6-2', title: '꼭짓점 C가 A에 포개어지게 접기', short: 'C를 A에 접기',
    question: '직사각형 ABCD를 꼭짓점 C가 A에 포개어지도록 접으면 접는 선 EF와 사각형 AECF는 어떻게 될까?',
    ctl: ['qfT', 'qfPh', 'qfW'], anim: { key: 'qfT', dur: 5, label: 'C를 A에 포개어 접기', start: 0 },
    init: (s) => { s.qfT = 0; s.qfPh = 30; s.qfW = 8; s.qfK = 0; },
    reroll: (s) => { s.qfPh = rint(20, 40); s.qfW = rint(6, 10); s.qfK = rint(0, 1); s.qfT = 0; },
    model: (s) => {
      const ph = ci(s.qfPh, 20, 40), w = ci(s.qfW, 6, 10), h = w * tanD(ph), A = pt(0, -h), B = pt(0, 0), C = pt(w, 0), D = pt(w, -h), ec = h / sinD(2 * ph);
      const E = pt(w - ec, 0), F = pt(ec, -h), G0 = refl(D, E, F), O = mid(A, C);
      return { ph, w, h, A, B, C, D, E, F, G: G0, O, aeb: 2 * ph, aef: 90 - ph, efd: 90 + ph, K: s.qfK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, E, F, G: G0, O } = M, st = cx.step;
      const t = cx.lesson ? (cx.entry ? 0 : clamp(Number(s.qfT) || 0, 0, 1)) : cx.problem ? 1 : cx.review ? (st >= 2 ? 1 : 0) : cx.t, done = t >= 0.999;
      const bb = unionBox(bboxOf([A, B, C, D, E, F, G0], 0.3), bboxOf([pt(0, -M.w * tanD(40)), pt(M.w, 0)], 0.3));
      fit(b, bb, { t: 30, b: 76, l: 40, r: 40 });
      const Ct = foldP(C, E, F, t), Dt = foldP(D, E, F, t);
      // 안 접히는 부분 A-B-E-F
      fillPoly(b, [A, B, E, F], 'sky', 0.1); poly(b, [A, B, E, F], 'ink', 3.4);
      if (t > 0.001) poly(b, [E, C, D, F], 'muted', 2, { dash: [6, 6], alpha: 0.7 });
      fillPoly(b, [E, Ct, Dt, F], 'amber', 0.22); poly(b, [E, Ct, Dt, F], 'amber', 3.2);
      line(b, E, F, 'green', 3.4);
      if (!done) { line(b, F, D, 'ink', 3.4); line(b, D, C, 'ink', 3.4); line(b, E, C, 'ink', 3.4); }
      if (cx.problem) {
        line(b, A, E, 'ink', 3.4);
        ang(b, E, A, B, { color: 'sky', rings: 1, r: 34, label: dg(M.aeb), size: 15, labelDist: 56 });
        if (M.K === 0) ang(b, E, A, F, { color: 'rose', rings: 1, r: 30, label: 'x', size: 18, labelDist: 50 }); else ang(b, F, E, D, { color: 'rose', rings: 1, r: 30, label: 'x', size: 18, labelDist: 50 });
        dotN(b, { A, B, C, D, E, F }, O, { cens: { E: A, F: B } });
        return;
      }
      if (done) {
        line(b, A, E, 'amber', 3.4); line(b, A, F, 'ink', 3.4);
        if (!cx.review || st >= 2) { tick(b, A, E, 1); tick(b, E, C, 1); tick(b, C, F, 1); tick(b, F, A, 1); fillPoly(b, [A, E, C, F], 'green', 0.12); }
        if (!cx.review || st >= 3) { ang(b, E, A, F, { color: 'sky', rings: 1, r: 28, label: dg(M.aef), size: 14, labelDist: 48 }); ang(b, E, F, C, { color: 'sky', rings: 1, r: 28 }); ang(b, E, A, B, { color: 'rose', rings: 1, r: 36, label: dg(M.aeb), size: 14, labelDist: 62 }); }
      }
      dotN(b, { A, B, C, D }, O, { cens: { A: O } }); b.point(E, { color: 'amber', r: 5 }); tagOut(b, E, A, 'E', { size: 17, gap: 12, color: 'amber' }); b.point(F, { color: 'amber', r: 5 }); tagOut(b, F, B, 'F', { size: 17, gap: 12, color: 'amber' });
      const cap = cx.review ? ['EF는 AC의 수직이등분선 (접으면 C가 A에 겹쳐요)', 'EA=EC=CF=FA → 사각형 AECF는 마름모', `∠AEF=∠CEF=(180°−${M.aeb}°)÷2=${M.aef}°`][clamp(st, 1, 3) - 1] : done ? `AECF는 마름모 · ∠AEB=${M.aeb}° → ∠AEF=${M.aef}°` : '▶를 눌러 C를 A에 포개어 접어 보세요';
      capLine(b, pt((bb.x0 + bb.x1) / 2, bb.y1 - 0.3), cap, done ? 'amber' : 'rose', { dy: 36 });
    },
    stepT: (n) => (n >= 2 ? 1 : 0),
    steps: (M) => [
      'C가 A에 포개어지도록 접으면 접는 선 EF는 선분 AC의 수직이등분선이에요. 그래서 EA=EC, FA=FC예요.',
      'AD∥BC이므로 엇각과 접은 각에 의해 AE∥FC도 성립해요. 네 변 AE=EC=CF=FA가 같으므로 사각형 AECF는 마름모예요.',
      `∠AEB=${M.aeb}°이면 ∠AEC=180°−${M.aeb}°=${180 - M.aeb}°예요. 접는 선 EF가 ∠AEC를 이등분하므로 ∠AEF=∠CEF=${M.aef}°예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>접기</b>를 움직이면 직사각형이 접는 선 EF를 따라 <b>제자리에서 접혀</b> 꼭짓점 C가 A에 포개어져요. ∠ACB를 바꿔 보세요. 사각형 AECF는 늘 <b>마름모</b>예요.',
      readouts: [rd('∠AEB', `${M.aeb}°`, 'rose', '2 × ∠ACB'), rd('∠AEC', `${180 - M.aeb}°`, 'sky', '180° − ∠AEB'), rd('∠AEF = ∠CEF', `${M.aef}°`, 'sky', '접는 선이 이등분'), rd('AECF', '마름모', 'green', 'EA=EC=CF=FA', null, true)],
      formula: `<p>EF는 AC의 수직이등분선 → $${ll('EA')}=${ll('EC')}=${ll('CF')}=${ll('FA')}$</p><p>$${an('AEF')}=${an('CEF')}=\\frac{1}{2}(180^{\\circ}-${M.aeb}^{\\circ})=${M.aef}^{\\circ}$</p>`,
      rule: '한 점을 다른 점에 포개어 접으면 접는 선은 두 점을 이은 선분의 수직이등분선이고, 이때 생기는 AECF는 마름모이다',
      notes: notes('접는 선 EF는 접기 전의 EC와 접은 뒤의 EA가 이루는 각 ∠AEC를 <b>이등분</b>해요.', 'EC∥FD이므로 ∠EFD=180°−∠FEC(동측내각)예요.')
    }),
    prob: (M) => {
      if (M.K === 0) return { tag: '접어서 생긴 각', key: `v0_${M.aeb}`, stem: `직사각형 ABCD를 꼭짓점 C가 A에 포개어지도록 접었다. 접는 선이 BC, AD와 만나는 점을 각각 E, F라 하자. ∠AEB=${M.aeb}°일 때, ∠AEF의 크기 x는?`, choices: mkChoices(M.aef, [[M.aeb, '∠AEB 자신이에요.'], [180 - M.aeb, '∠AEC예요. 접는 선이 이를 이등분해요.'], [M.aeb / 2, '∠AEB의 절반이 아니에요. ∠AEC=180°−∠AEB의 절반이에요.'], [M.aef + 10, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
      return { tag: '접어서 생긴 각', key: `v1_${M.aeb}`, stem: `직사각형 ABCD를 꼭짓점 C가 A에 포개어지도록 접었다. 접는 선이 BC, AD와 만나는 점을 각각 E, F라 하자. ∠AEB=${M.aeb}°일 때, ∠EFD의 크기 x는?`, choices: mkChoices(M.efd, [[M.aef, '∠AEF를 구했어요. ∠EFD는 동측내각이에요.'], [180 - M.aeb, '∠AEC예요.'], [M.aeb, '∠AEB 자신이에요.'], [M.efd + 10, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
    }
  };

  /* ====================================================================== 3. 정사각형 대각선 위의 점 */
  const sqDiag = {
    id: 'q6-3', title: '정사각형의 대각선 위의 점 E', short: '대각선 위의 점',
    question: '정사각형 ABCD의 대각선 AC 위에 점 E를 잡으면 △ABE와 △ADE는 어떤 관계일까? ∠BEC=θ이면 ∠ADE는?',
    ctl: ['qfB'],
    init: (s) => { s.qfB = 65; s.qfK = 0; },
    reroll: (s) => { s.qfB = pick([55, 60, 65, 70, 75, 80, 85, 95, 100, 105, 110, 115, 120], s.qfB); s.qfK = rint(0, 1); },
    model: (s) => {
      const th = ci(Math.round(s.qfB / 5) * 5, 50, 130), g = th - 45, r = 6 / (sinD(g) + cosD(g)), S = 6;
      const A = pt(0, -S), B = pt(0, 0), C = pt(S, 0), D = pt(S, -S), E = pt(r * sinD(g), -r * cosD(g));
      return { th, g, aeb: 180 - th, edc: 90 - g, A, B, C, D, E, S, K: s.qfK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, E } = M, st = cx.step, sq = [A, B, C, D], O = mid(A, C);
      fit(b, { x0: -0.4, x1: 6.4, y0: -6.4, y1: 0.4 }, { t: 30, b: 74, l: 50, r: 50 });
      fillPoly(b, sq, 'sky', 0.08); poly(b, sq, 'ink', 3.4); line(b, A, C, 'ink', 2.6); line(b, B, E, 'ink', 2.8); line(b, D, E, 'ink', 2.8);
      if (cx.problem) {
        ang(b, E, B, C, { color: 'sky', rings: 1, r: 30, label: dg(M.th), size: 15, labelDist: 52 });
        if (M.K === 0) ang(b, D, A, E, { color: 'rose', rings: 1, r: 30, label: 'x', size: 18, labelDist: 50 }); else ang(b, E, A, D, { color: 'rose', rings: 1, r: 30, label: 'x', size: 18, labelDist: 50 });
        dotN(b, { A, B, C, D }, O); b.point(E, { color: 'ink', r: 4.5 }); T(b, E, 'E', { dx: -14, dy: -2, size: 17 });
        return;
      }
      const show = (n) => (cx.review ? st >= n : true);
      if (show(1)) { ang(b, A, B, E, { color: 'sky', rings: 1, r: 26, label: '45°', size: 13, labelDist: 40 }); ang(b, A, E, D, { color: 'sky', rings: 1, r: 26 }); tick(b, A, B, 1); tick(b, A, D, 1); }
      if (show(2)) { fillPoly(b, [A, B, E], 'amber', 0.2); fillPoly(b, [A, D, E], 'amber', 0.2); ang(b, B, A, E, { color: 'rose', rings: 2, r: 22, label: dg(M.g), size: 13, labelDist: 40 }); ang(b, D, E, A, { color: 'rose', rings: 2, r: 22, label: dg(M.g), size: 13, labelDist: 40 }); }
      ang(b, E, B, C, { color: 'green', rings: 3, r: 30, label: dg(M.th), size: 14, labelDist: 52 });
      if (show(3)) ang(b, E, A, B, { color: 'amber', rings: 1, r: 22, label: dg(M.aeb), size: 12, labelDist: 56 });
      dotN(b, { A, B, C, D }, O); b.point(E, { color: 'amber', r: 5 }); T(b, E, 'E', { dx: -14, dy: -2, size: 17, color: 'amber' });
      if (!cx.review) b.handle('E', E, { color: 'amber', r: 8, ariaLabel: '점 E를 대각선 위에서 끌기', drag: (w2) => { const u = clamp(w2.x / 6, 0.06, 0.94), Ee = pt(u * 6, -6 + u * 6), gg = Math.atan2(Ee.x, -Ee.y) / DEG; s.qfB = clamp(Math.round((gg + 45) / 5) * 5, 50, 130); } });
      const cap = cx.review ? ['AC는 ∠A를 이등분: ∠BAE=∠DAE=45°, AB=AD', `△ABE ≡ △ADE (SAS) → ∠ABE=∠ADE=${M.g}°`, `∠AEB=180°−${M.th}°=${M.aeb}°, ∠ABE=180°−45°−${M.aeb}°=${M.g}°`][clamp(st, 1, 3) - 1] : `∠BEC=${M.th}° → ∠ABE=∠ADE=${M.g}°`;
      capLine(b, pt(3, 0), cap, 'amber', { dy: 44 });
    },
    steps: (M) => [
      '정사각형의 대각선 AC는 ∠A를 이등분해요. 그래서 ∠BAE=∠DAE=45°이고, AB=AD이고 AE는 공통이에요.',
      `△ABE와 △ADE에서 AB=AD, ∠BAE=∠DAE, AE는 공통이므로 △ABE ≡ △ADE (SAS 합동)이에요. 그래서 ∠ABE=∠ADE예요.`,
      `∠BEC=${M.th}°이므로 ∠AEB=180°−${M.th}°=${M.aeb}°예요. △ABE에서 ∠ABE=180°−45°−${M.aeb}°=${M.g}°이므로 ∠ADE=${M.g}°예요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 E</b>를 대각선 AC 위에서 끌어 보세요. E가 어디에 있어도 <b>△ABE ≡ △ADE</b>라서 ∠ABE와 ∠ADE는 늘 같아요. ∠BEC만 알면 둘 다 구해져요.',
      readouts: [rd('∠BEC', `${M.th}°`, 'green'), rd('∠AEB', `${M.aeb}°`, 'amber', '180° − ∠BEC'), rd('∠ABE = ∠ADE', `${M.g}°`, 'rose', `180°−45°−${M.aeb}°`, null, true), rd('∠EDC', `${M.edc}°`, 'sky', `90° − ${M.g}°`)],
      formula: `<p>$${tri('ABE')}\\equiv${tri('ADE')}$ (SAS) → $${an('ADE')}=${an('ABE')}$</p><p>$${an('ABE')}=180^{\\circ}-45^{\\circ}-${M.aeb}^{\\circ}=${M.g}^{\\circ}$</p>`,
      rule: '정사각형의 대각선 위의 한 점 E에 대하여 △ABE ≡ △ADE, △CBE ≡ △CDE',
      notes: notes('E가 대각선 위이므로 <b>AE는 공통</b>이고, 대각선이 꼭짓점의 각(90°)을 <b>45°씩</b> 나눠요.', '∠BEC=θ이면 ∠AEB=180°−θ예요. θ는 45°보다 커야 E가 대각선 위에 놓여요.')
    }),
    prob: (M) => {
      if (M.K === 0) return { tag: '정사각형과 합동', key: `d0_${M.th}`, stem: `정사각형 ABCD의 대각선 AC 위의 한 점 E에 대하여 ∠BEC=${M.th}°일 때, ∠ADE의 크기 x는?`, choices: mkChoices(M.g, [[M.th, '∠BEC 자신이에요.'], [M.aeb, '∠AEB의 크기예요.'], [M.edc, '∠EDC의 크기예요. ∠ADE=∠ABE예요.'], [M.g + 10, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
      return { tag: '정사각형과 합동', key: `d1_${M.th}`, stem: `정사각형 ABCD의 대각선 AC 위의 한 점 E에 대하여 ∠BEC=${M.th}°일 때, ∠AED의 크기 x는?`, choices: mkChoices(M.aeb, [[M.th, '∠BEC 자신이에요. ∠AED는 ∠AEB와 같고, ∠AEB=180°−∠BEC예요.'], [M.g, '∠ADE의 크기예요.'], [M.edc, '∠EDC의 크기예요.'], [M.aeb + 10, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
    }
  };

  /* ====================================================================== 4. 정사각형 + 정삼각형 */
  const squareTri = {
    id: 'q6-4', title: '[킬러] 정사각형 안의 정삼각형', short: '정사각형+정삼각형',
    question: '정사각형 ABCD 안에 한 변 BC를 공유하는 정삼각형 EBC를 그리면 ∠BAE, ∠AED는 몇 도일까?',
    ctl: ['qfS'],
    init: (s) => { s.qfS = 4; s.qfK = 0; },
    reroll: (s) => { s.qfS = rint(3, 6); s.qfK = rint(0, 3); },
    model: (s) => {
      const S = ci(s.qfS, 3, 6), A = pt(0, -S), B = pt(0, 0), C = pt(S, 0), D = pt(S, -S), E = pt(S / 2, -S * 0.8660254);
      return { S, A, B, C, D, E, K: s.qfK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, E, S } = M, st = cx.step, sq = [A, B, C, D], O = pt(S / 2, -S / 2);
      fit(b, bboxOf(sq), cx.problem && b.W < 560 ? { t: 28, b: 32, l: 36, r: 36 } : { t: 50, b: 94, l: 50, r: 50 });
      fillPoly(b, sq, 'sky', 0.08); poly(b, sq, 'ink', 3.4);
      fillPoly(b, [E, B, C], 'green', 0.18); poly(b, [E, B, C], 'green', 3.4);
      line(b, A, E, 'ink', 3); line(b, D, E, 'ink', 3);
      [[A, B], [B, C], [C, D], [D, A], [B, E], [C, E]].forEach(([p0, q]) => tick(b, p0, q, 1));
      const show = (n) => (cx.review ? st >= n : true);
      if (cx.problem) {
        const k = M.K, xs = ['BAE', 'AED', 'EAD', 'AEB'];
        if (k === 0) ang(b, A, B, E, { color: 'rose', rings: 1, r: 28, label: 'x', size: 18, labelDist: 48 });
        if (k === 1) ang(b, E, A, D, { color: 'rose', rings: 1, r: 26, label: 'x', size: 18, labelDist: 40 });
        if (k === 2) ang(b, A, E, D, { color: 'rose', rings: 1, r: 26, label: 'x', size: 18, labelDist: 44 });
        if (k === 3) ang(b, E, A, B, { color: 'rose', rings: 1, r: 26, label: 'x', size: 18, labelDist: 44 });
        void xs;
        dotN(b, { A, B, C, D }, O); b.point(E, { color: 'ink', r: 4.5 }); T(b, E, 'E', { dy: -16, size: 17 });
        return;
      }
      ang(b, E, B, C, { color: 'green', rings: 1, r: 24, label: '60°', size: 13, labelDist: 38 });
      if (show(1)) ang(b, B, A, E, { color: 'rose', rings: 2, r: 28, label: '30°', size: 14, labelDist: 52 });
      if (show(2)) { ang(b, A, B, E, { color: 'sky', rings: 1, r: 26, label: '75°', size: 14, labelDist: 40 }); ang(b, E, A, B, { color: 'sky', rings: 1, r: 26 }); ang(b, D, C, E, { color: 'sky', rings: 1, r: 26, label: '75°', size: 14, labelDist: 40 }); ang(b, E, C, D, { color: 'sky', rings: 1, r: 26 }); ang(b, C, D, E, { color: 'rose', rings: 2, r: 28, label: '30°', size: 14, labelDist: 52 }); }
      if (show(3)) {
        const mark = ang(b, A, E, D, { color: 'amber', rings: 1, r: 30 });
        const k = b.k || 60, dx = Math.cos(mark.mid) * 58, dy = Math.sin(mark.mid) * 58;
        const box = typeof b.annotationSize === 'function' ? b.annotationSize('15°', { size: 13, weight: 800 }) : { width: G.textW('15°', 13) + 6, height: 19 };
        const ex = (E.x - A.x) * k - dx, ey = (E.y - A.y) * k - dy;
        // A's short 15° wedge must not read as part of E's 150° arc.
        const nearE = Math.hypot(Math.max(0, Math.abs(ex) - box.width / 2), Math.max(0, Math.abs(ey) - box.height / 2)) < 32;
        if (!b.thumb && nearE) {
          const anchor = add(A, pt(Math.cos(mark.mid) * 30 / k, Math.sin(mark.mid) * 30 / k));
          const label = add(A, pt(37 / k, -22 / k));
          b.leader(anchor, label, { ...box, color: 'amber', lineWidth: 1.2, gap: 2 });
          T(b, label, '15°', { color: 'amber', size: 13 });
        } else T(b, A, '15°', { color: 'amber', size: 13, dx, dy });
        ang(b, E, A, D, { color: 'amber', rings: 1, r: 26, label: '150°', size: 13, labelDist: 40 });
      }
      dotN(b, { A, B, C, D }, O); b.point(E, { color: 'amber', r: 5 }); T(b, E, 'E', { dy: -16, size: 17, color: 'amber' });
      sd(b, B, C, O, `${S}`, 'sky');
      const cap = cx.review ? ['정삼각형 EBC: ∠EBC=60°, BE=BC=AB', '∠ABE=90°−60°=30° → 이등변 △ABE의 밑각 ∠BAE=∠BEA=75°', '∠EAD=90°−75°=15°, ∠AED=180°−15°−15°=150°'][clamp(st, 1, 3) - 1] : '∠ABE=30° · ∠BAE=∠BEA=75° · ∠EAD=15° · ∠AED=150°';
      capLine(b, pt(S / 2, 0), cap, 'amber', { dy: 44 });
    },
    steps: () => [
      '정삼각형 EBC에서 BE=BC이고 정사각형이므로 AB=BC예요. 그래서 AB=BE이고, ∠ABE=90°−60°=30°예요.',
      '△ABE는 AB=BE인 이등변삼각형이므로 ∠BAE=∠BEA=(180°−30°)÷2=75°예요. 같은 방법으로 △DCE에서 ∠CDE=∠CED=75°예요.',
      '∠EAD=90°−75°=15°, ∠EDA=15°이므로 △AED에서 ∠AED=180°−15°−15°=150°예요. (점 E 둘레: 75°+60°+75°+150°=360°)'
    ],
    view: (M) => ({
      guide: '막대로 한 변의 길이를 바꿔 보세요. 정사각형과 정삼각형이 한 변을 공유하면 길이가 바뀌어도 <b>각은 늘 30°·75°·15°·150°</b>예요. AB=BE인 <b>숨은 이등변삼각형</b>을 찾는 게 열쇠예요.',
      readouts: [rd('한 변', `${M.S}`, 'sky', 'AB = BC = BE'), rd('∠ABE', '30°', 'rose', '90° − 60°'), rd('∠BAE = ∠BEA', '75°', 'sky', '(180° − 30°) ÷ 2'), rd('∠EAD', '15°', 'amber', '90° − 75°'), rd('∠AED', '150°', 'amber', '180° − 15° − 15°', null, true)],
      formula: '<p>$\\overline{AB}=\\overline{BC}=\\overline{BE}$ → $\\angle ABE=90^{\\circ}-60^{\\circ}=30^{\\circ}$</p><p>$\\angle BAE=\\angle BEA=\\frac{180^{\\circ}-30^{\\circ}}{2}=75^{\\circ}$</p><p>$\\angle EAD=15^{\\circ},\\ \\angle AED=150^{\\circ}$</p>',
      rule: '정사각형과 정삼각형이 한 변을 공유하면 AB=BE인 이등변삼각형이 생긴다 (30° - 75° - 75°)',
      notes: notes('∠AED는 <b>150°</b>예요. 75°를 두 번 더한 게 아니에요. 점 E 둘레의 각은 75°+60°+75°+150°=360°예요.', '정삼각형을 정사각형 <b>안</b>에 그렸을 때의 값이에요. 밖에 그리면 달라져요.')
    }),
    prob: (M) => {
      const k = M.K;
      const stems = ['∠BAE의 크기 x는?', '∠EAD의 크기 x는?', '∠AED의 크기 x는?', '∠AEB의 크기 x는?'];
      void stems;
      if (k === 0) return { tag: '정사각형과 정삼각형', key: 'g0', stem: '정사각형 ABCD의 내부에 정삼각형 EBC를 그렸다. ∠BAE의 크기 x는?', choices: mkChoices(75, [[30, '∠ABE의 크기예요.'], [60, '정삼각형의 한 각이에요.'], [15, '∠EAD의 크기예요.'], [150, '∠AED의 크기예요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
      if (k === 1) return { tag: '정사각형과 정삼각형', key: 'g1', stem: '정사각형 ABCD의 내부에 정삼각형 EBC를 그렸다. ∠AED의 크기 x는?', choices: mkChoices(150, [[75, '∠AEB의 크기예요. ∠AED는 점 E 둘레에서 구해요.'], [30, '∠ABE의 크기예요.'], [120, '값을 다시 확인해 보세요.'], [135, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
      if (k === 2) return { tag: '정사각형과 정삼각형', key: 'g2', stem: '정사각형 ABCD의 내부에 정삼각형 EBC를 그렸다. ∠EAD의 크기 x는?', choices: mkChoices(15, [[30, '∠ABE의 크기예요.'], [75, '∠BAE의 크기예요. ∠EAD=90°−∠BAE예요.'], [60, '정삼각형의 한 각이에요.'], [45, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
      return { tag: '정사각형과 정삼각형', key: 'g3', stem: '정사각형 ABCD의 내부에 정삼각형 EBC를 그렸다. ∠AEB의 크기 x는?', choices: mkChoices(75, [[30, '∠ABE의 크기예요.'], [60, '∠BEC예요.'], [150, '∠AED의 크기예요.'], [15, '∠EAD의 크기예요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
    }
  };

  /* ====================================================================== 5. 정사각형 속 수직인 두 선분 */
  const sqPerp = {
    id: 'q6-5', title: '정사각형 속 두 선분 AE, BF', short: '정사각형 속 두 선분',
    question: '정사각형 ABCD에서 BE=CF가 되도록 변 BC, CD 위에 점 E, F를 잡으면 두 선분 AE와 BF는 어떤 관계일까?',
    ctl: ['qfSp', 'qfE'],
    init: (s) => { s.qfSp = 6; s.qfE = 2; s.qfK = 0; s.qfThA = 30; },
    reroll: (s) => { s.qfSp = pick([4, 6, 8], s.qfSp); s.qfE = rint(1, s.qfSp - 1); s.qfK = rint(0, 1); s.qfThA = rint(20, 44); },
    model: (s) => {
      const S = ci(s.qfSp, 4, 8), e = clamp(ci(s.qfE, 1, 7), 1, S - 1), th = ci(s.qfThA || 30, 20, 44);
      const mk = (S0, e0) => { const A = pt(0, -S0), B = pt(0, 0), C = pt(S0, 0), D = pt(S0, -S0), E = pt(e0, 0), F = pt(S0, -e0); return { A, B, C, D, E, F, Pp: inter(A, E, B, F) }; };
      const g = mk(S, e), g2 = mk(6, 6 * tanD(th));
      return { S, e, th, ...g, g2, fd: S - e, K: s.qfK || 0 };
    },
    draw(b, s, M, cx) {
      const K = M.K, pr = cx.problem && K === 0;
      const { A, B, C, D, E, F, Pp } = pr ? { ...M.g2, Pp: M.g2.Pp } : M, st = cx.step, S = pr ? 6 : M.S, sq = [A, B, C, D], O = mid(A, C);
      fit(b, { x0: -0.4, x1: S + 0.4, y0: -S - 0.4, y1: 0.4 }, { t: 30, b: 74, l: 50, r: 50 });
      fillPoly(b, sq, 'sky', 0.08); poly(b, sq, 'ink', 3.4); line(b, A, E, 'ink', 3); line(b, B, F, 'ink', 3);
      tick(b, B, E, 2, 'amber'); tick(b, C, F, 2, 'amber');
      if (cx.problem) {
        if (K === 0) { ang(b, A, B, E, { color: 'sky', rings: 1, r: 30, label: dg(M.th), size: 15, labelDist: 50 }); ang(b, F, B, C, { color: 'rose', rings: 1, r: 26, label: 'x', size: 18, labelDist: 46 }); }
        else { sd(b, A, B, O, `${M.S}`, 'sky'); sd(b, B, E, O, `${M.e}`, 'sky'); segTag(b, F, D, 0.5, 'x', 18, 'rose', { size: 18 }); }
        dotN(b, { A, B, C, D }, O); b.point(E, { color: 'ink', r: 4.5 }); T(b, E, 'E', { dy: 20, size: 17 }); b.point(F, { color: 'ink', r: 4.5 }); T(b, F, 'F', { dx: 16, dy: 0, size: 17 });
        return;
      }
      const show = (n) => (cx.review ? st >= n : true);
      if (show(1)) { fillPoly(b, [A, B, E], 'amber', 0.2); fillPoly(b, [B, C, F], 'amber', 0.2); }
      if (show(2)) { ang(b, A, B, E, { color: 'sky', rings: 1, r: 26 }); ang(b, B, C, F, { color: 'sky', rings: 1, r: 26 }); tick(b, A, E, 3); tick(b, B, F, 3); }
      if (show(3)) b.right(Pp, A, B, { size: 11, color: 'green' });
      sd(b, A, B, O, `${M.S}`, 'sky'); T(b, mid(B, E), `${M.e}`, { dy: 18, size: 15, color: 'amber' }); T(b, mid(C, F), `${M.e}`, { dx: 16, size: 15, color: 'amber' });
      dotN(b, { A, B, C, D }, O); b.point(E, { color: 'amber', r: 5 }); T(b, E, 'E', { dy: 20, size: 17, color: 'amber' }); b.point(F, { color: 'amber', r: 5 }); T(b, F, 'F', { dx: 16, dy: 0, size: 17, color: 'amber' });
      b.point(Pp, { color: 'green', r: 4.5 });
      if (!cx.review) b.handle('E', E, { color: 'amber', r: 8, ariaLabel: '점 E 가로로 끌기', drag: (w2) => { s.qfE = clamp(Math.round(w2.x), 1, M.S - 1); } });
      const cap = cx.review ? ['△ABE와 △BCF: AB=BC, ∠ABE=∠BCF=90°, BE=CF', '△ABE ≡ △BCF (SAS) → AE=BF, ∠BAE=∠CBF', '∠BAE+∠ABP=90° → ∠CBF+∠ABP=90° → ∠APB=90° (AE⊥BF)'][clamp(st, 1, 3) - 1] : `BE=CF=${M.e} → AE=BF, AE⊥BF`;
      capLine(b, pt(S / 2, 0), cap, 'amber', { dy: 44 });
    },
    steps: (M) => [
      `△ABE와 △BCF에서 AB=BC=${M.S}, ∠ABE=∠BCF=90°, BE=CF=${M.e}이에요.`,
      `두 변과 끼인각이 같으므로 △ABE ≡ △BCF (SAS 합동)이에요. 그래서 AE=BF이고 ∠BAE=∠CBF예요.`,
      `∠BAE+∠ABP=∠CBF+∠ABP=∠ABC=90°이므로 △ABP에서 ∠APB=90°, 즉 AE⊥BF예요. (DF=CD−CF=${M.S}−${M.e}=${M.fd})`
    ],
    view: (M) => ({
      guide: '<b>노란 점 E</b>를 가로로 끌어 보세요. E가 어디에 있어도 <b>BE=CF</b>이면 두 선분 AE, BF는 <b>길이가 같고 수직</b>으로 만나요.',
      readouts: [rd('BE = CF', `${M.e}`, 'amber'), rd('DF', `${M.fd}`, 'sky', `${M.S} − ${M.e}`), rd('AE와 BF', '길이가 같아요', 'green', 'AE = BF'), rd('AE ⊥ BF', '수직', 'rose', '∠APB = 90°')],
      formula: `<p>$${tri('ABE')}\\equiv${tri('BCF')}$ (SAS) → $${ll('AE')}=${ll('BF')}$, $${an('BAE')}=${an('CBF')}$</p><p>$${an('BAE')}+${an('ABP')}=90^{\\circ}$ → $${ll('AE')}\\perp${ll('BF')}$</p>`,
      rule: '정사각형 안에서 직각으로 만나는 두 선분의 길이는 같다 (BE=CF이면 AE⊥BF, AE=BF)',
      notes: notes('합동의 대응각 ∠BAE=∠CBF를 이용해 직각을 찾아요.', 'DF=CD−CF예요. CF를 구하면 FD도 구해져요.')
    }),
    prob: (M) => {
      if (M.K === 0) { const th = M.th; return { tag: '합동과 수직', key: `q0_${th}`, stem: `정사각형 ABCD에서 BE=CF가 되도록 변 BC, CD 위에 점 E, F를 잡았다. ∠BAE=${th}°일 때, ∠BFC의 크기 x는?`, choices: mkChoices(90 - th, [[th, '∠CBF와 같게 구했어요. ∠BFC는 직각삼각형 BCF의 다른 예각이에요.'], [180 - th, '값을 다시 확인해 보세요.'], [90, '직각이 아니에요.'], [90 - th + 10, '값을 다시 확인해 보세요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) }; }
      return { tag: '합동과 길이', key: `q1_${M.S}_${M.e}`, stem: `한 변의 길이가 ${M.S}인 정사각형 ABCD에서 BE=CF=${M.e}가 되도록 변 BC, CD 위에 점 E, F를 잡았다. FD의 길이 x는?`, choices: mkChoices(M.fd, [[M.e, 'CF의 길이예요. FD=CD−CF예요.'], [M.S, '변 CD 전체예요.'], [M.S + M.e, '더했어요.'], [M.fd + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
    }
  };

  /* ====================================================================== 6. 정사각형 중심에서 회전 */
  // 볼록 다각형 clip(Sutherland–Hodgman): subject 를 clipper(볼록, 시계/반시계 모두) 안으로 자릅니다.
  function clipPoly(subject, clipper) {
    const area = clipper.reduce((a, p, i) => a + (p.x * clipper[(i + 1) % clipper.length].y - clipper[(i + 1) % clipper.length].x * p.y), 0), sg = area >= 0 ? 1 : -1;
    let out = subject.slice();
    for (let i = 0; i < clipper.length && out.length; i++) {
      const a = clipper[i], c = clipper[(i + 1) % clipper.length], inp = out; out = [];
      const side = (p) => sg * ((c.x - a.x) * (p.y - a.y) - (c.y - a.y) * (p.x - a.x));
      for (let j = 0; j < inp.length; j++) {
        const p = inp[j], q = inp[(j + 1) % inp.length], sp = side(p), sq = side(q);
        if (sp >= 0) out.push(p);
        if ((sp >= 0) !== (sq >= 0)) { const tt = sp / (sp - sq); out.push(pt(p.x + (q.x - p.x) * tt, p.y + (q.y - p.y) * tt)); }
      }
    }
    return out;
  }
  const polyAreaAbs = (Pp) => Math.abs(Pp.reduce((a, p, i) => a + (p.x * Pp[(i + 1) % Pp.length].y - Pp[(i + 1) % Pp.length].x * p.y), 0) / 2);
  const innerRot = {
    id: 'q6-6', title: '정사각형의 중심에서 회전과 겹친 넓이', short: '중심에서 회전',
    question: '정사각형 ABCD의 대각선의 교점 O에 합동인 정사각형 OEFG의 한 꼭짓점을 두고 돌리면 겹쳐지는 부분의 넓이는 어떻게 변할까?',
    ctl: ['qfRot', 'qfSp'], anim: { key: 'qfRot', dur: 6, label: 'O를 중심으로 돌리기', start: 0.28 },
    init: (s) => { s.qfRot = 0.28; s.qfSp = 6; s.qfK = 0; },
    reroll: (s) => { s.qfSp = pick([4, 6, 8], s.qfSp); s.qfRot = rint(1, 17) / 18; s.qfK = rint(0, 1); },
    model: (s) => {
      const S = ci(s.qfSp, 4, 8), rot = clamp(Number(s.qfRot), 0, 1) * 90, h = S / 2, O = pt(0, 0);
      const A = pt(-h, -h), B = pt(-h, h), C = pt(h, h), D = pt(h, -h);
      const base = [pt(0, 0), pt(S, 0), pt(S, -S), pt(0, -S)];
      const sq2 = base.map((q) => rotP(q, O, rot)), over = clipPoly(sq2, [A, B, C, D]);
      return { S, rot, h, A, B, C, D, O, sq2, over, area: S * S, ov: S * S / 4, K: s.qfK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, O, sq2, over } = M, st = cx.step, R = M.S * 1.45;
      // 휴대폰의 정지된 문제 그림은 현재 두 정사각형에 맞춥니다. 회전 전체의
      // 빈 공간과 탐구 설명문 여백까지 잡으면 기본 정사각형이 40px대로 작아져요.
      const compactProblem = cx.problem && b.W < 560;
      const box = compactProblem ? bboxOf([A, B, C, D, ...sq2]) : { x0: -R, x1: R, y0: -R, y1: R };
      fit(b, box, compactProblem ? { t: 30, b: M.K === 1 ? 48 : 30, l: 34, r: 34 } : { t: 30, b: 74, l: 40, r: 40 });
      fillPoly(b, [A, B, C, D], 'sky', 0.12); poly(b, [A, B, C, D], 'ink', 3.4);
      const names = ['E', 'F', 'G'];
      fillPoly(b, sq2, 'amber', 0.1); poly(b, sq2, 'amber', 3.2);
      if (over.length > 2) { fillPoly(b, over, 'green', 0.3); poly(b, over, 'green', 2.6); }
      line(b, A, C, 'ink', 1.8, { dash: [6, 5], alpha: 0.7 }); line(b, B, D, 'ink', 1.8, { dash: [6, 5], alpha: 0.7 });
      b.right(O, sq2[1], sq2[3], { size: 10, color: 'amber' });
      b.point(O, { color: 'ink', r: 4.5 }); T(b, O, 'O', { dx: -4, dy: 16, size: 16 });
      [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([k, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, O, k, { size: 17, gap: 11 }); });
      sq2.slice(1).forEach((q, i) => { b.point(q, { color: 'amber', r: 4.5 }); tagOut(b, q, O, names[i], { size: 16, gap: 10, color: 'amber' }); });
      if (cx.problem) {
        if (M.K === 0) sd(b, A, B, O, `${M.S}`, 'sky');
        else T(b, compactProblem ? pt((box.x0 + box.x1) / 2, box.y1) : pt(0, R), '□ABCD의 넓이 = x', { dy: compactProblem ? 28 : 8, size: b.W < 560 ? 15 : 17, color: 'rose' });
        T(b, centroid2(over), M.K === 0 ? 'x' : `${M.ov}`, { size: 20, color: M.K === 0 ? 'rose' : 'green' });
        return;
      }
      if (cx.review ? st >= 1 : true) T(b, centroid2(over), `${M.ov}`, { size: 17, color: 'green' });
      const cap = cx.review ? ['정사각형 ABCD의 넓이는 한 변×한 변', '두 경계선을 O 둘레로 90°씩 돌리면 합동인 네 영역으로 나뉘어요', `겹친 넓이 = ${M.area}의 4분의 1 = ${M.ov}`][clamp(st, 1, 3) - 1] : `ABCD의 넓이 ${M.area} → 겹친 부분 ${M.ov} (돌려도 같아요)`;
      capLine(b, pt(0, R), cap, 'amber', { dy: 8 });
    },
    steps: (M) => [
      `정사각형 ABCD의 한 변이 ${M.S}이므로 넓이는 ${M.S}×${M.S}=${M.area}예요.`,
      '점 O에서 만나는 두 변은 직각이에요. 현재 두 경계 반직선을 O 주위로 90°씩 돌리면 ABCD가 네 영역으로 나뉘어요. 정사각형은 90° 회전하면 포개지므로 이 네 영역은 서로 합동이에요. 회전각을 바꾸면 영역의 모양은 달라져도 각각 전체의 4분의 1이에요.',
      `그래서 겹친 부분의 넓이는 언제나 ABCD의 넓이의 $\\frac{1}{4}$이에요. $\\frac{1}{4}$×${M.area}=${M.ov}`
    ],
    view: (M) => ({
      guide: '막대나 ▶로 합동인 정사각형 OEFG를 <b>점 O를 중심으로 돌려</b> 보세요(제자리 회전). 겹쳐진 초록 부분의 모양은 바뀌어도 <b>넓이는 늘 ABCD의 $\\frac{1}{4}$</b>이에요.',
      readouts: [rd('□ABCD의 넓이', `${M.area}`, 'sky', `${M.S} × ${M.S}`), rd('겹친 부분의 넓이', `${M.ov}`, 'green', `$\\frac{1}{4}$ × ${M.area}`, null, true), rd('돌린 각', `${Math.round(M.rot)}°`, 'rose')],
      formula: `<p>(겹친 부분의 넓이) $=\\frac{1}{4}\\times\\square ABCD=\\frac{1}{4}\\times${M.area}=${M.ov}$</p>`,
      rule: '정사각형의 두 대각선의 교점 O에 합동인 정사각형의 한 꼭짓점을 두고 돌려도 겹친 부분의 넓이는 처음 정사각형의 넓이의 $\\frac{1}{4}$이다',
      notes: notes('겹친 부분의 모양은 바뀌지만 <b>넓이는 늘 $\\frac{1}{4}$</b>이에요.', '두 경계 반직선을 중심 O 둘레로 90°씩 돌려 얻는 네 영역은 서로 합동이에요.')
    }),
    prob: (M) => {
      const { S, area, ov } = M;
      if (M.K === 0) return { tag: '회전 정사각형 넓이', key: `r0_${S}`, stem: `한 변의 길이가 ${S}인 정사각형 ABCD의 두 대각선의 교점 O에, 합동인 정사각형 OEFG의 한 꼭짓점을 놓았다. OEFG를 O를 중심으로 돌릴 때, 두 정사각형이 겹치는 부분의 넓이 x는?`, choices: mkChoices(ov, [[area / 2, '절반이 아니에요. 4분의 1이에요.'], [area, 'ABCD 전체의 넓이예요.'], [area / 8, '8분의 1이 아니에요.'], [ov + 2, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
      return { tag: '회전 정사각형 넓이', key: `r1_${S}`, stem: `정사각형 ABCD의 두 대각선의 교점 O에, 합동인 정사각형 OEFG의 한 꼭짓점을 놓고 돌렸더니 겹치는 부분의 넓이가 ${ov}${ov === 16 ? '이었다' : '였다'}. 정사각형 ABCD의 넓이 x는?`, choices: mkChoices(area, [[ov * 2, '2배가 아니에요. 4배예요.'], [ov * 8, '8배가 아니에요.'], [ov * 3, '3배가 아니에요.'], [ov, '겹친 부분의 넓이 그대로예요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 4, valid: (v) => v > 0 && Number.isInteger(v) }) };
    }
  };
  const centroid2 = (Pp) => (Pp.length ? pt(Pp.reduce((a, p) => a + p.x, 0) / Pp.length, Pp.reduce((a, p) => a + p.y, 0) / Pp.length) : pt(0, 0));

  const gl = [foldTape, foldV, sqDiag, squareTri, sqPerp, innerRot];
  G.register(60, 'qd6', '⑥ 종이접기·결합', '종이접기·결합', PARAMS, gl);
})();
