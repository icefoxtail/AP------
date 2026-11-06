/* ==========================================================================
   중2 · 사각형의 성질 — 탭 ① 「평행사변형의 성질」 (t1.js, order 10) — 장면 5개
   · q1-1 대변과 대각의 성질       · 대각선 AC로 나눈 △ABC ≡ △CDA(ASA), 꼭짓점 A를 끌어 ∠B 바꾸기
   · q1-2 각의 성질과 이등분선     · 이웃한 두 내각의 합 180°, 이등분선이 만나는 각 90°
   · q1-3 대각선과 O를 지나는 선분 · OA=OC, OB=OD, 점 O를 지나는 선분 EF는 OE=OF (점 E를 가로로 끌기)
   · q1-4 대각선과 삼각형의 둘레   · AB·AC·BD를 정하면 △ABO의 둘레가 정해져요
   · q1-5 각의 이등분선 → 이등변삼각형 · ∠A의 이등분선과 BC의 교점 E, BE=AB, EC=BC−AB
   값은 모두 지금의 길이·각(정수)으로 다시 계산됩니다. 사각형은 A 왼쪽 위 · B 왼쪽 아래 · C 오른쪽 아래 · D 오른쪽 위.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_QD;
  if (!G) return;
  const { outsideAng, ang2, dimLine, parAll, DEG, clamp, seg01, pt, add, sub, mul, unit, mid, lerp, dist, rotP, inter, pick, rint, bboxOf, unionBox, T, tagOut, ang, tick, par, fillPoly, line, poly, fit, P, mkChoices, mkTextChoices, rd, notes, fmtN, dg, texDeg, para, sd, ll, an, tri, vlab, capLine, segTag, ci, josa } = G;
  const lenF = (v) => fmtN(v);
  const degF = G.degF;
  const eqB = 'rose';

  const PARAMS = {
    qaW: P('밑변 BC', 6, 10, 1, 8, { color: 'sky', format: lenF }),
    qaS: P('옆변 AB', 3, 5, 1, 4, { color: 'green', format: lenF }),
    qaB: P('∠B의 크기', 50, 130, 2, 66, { color: 'amber', hint: '꼭짓점 A를 끌어도 ∠B가 바뀌어요', format: degF }),
    qaT: P('돌리기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 △ABC가 점 O를 중심으로 제자리에서 180° 돌아요', format: (v) => Math.round(v * 180) + '°' }),
    qaE: P('AE의 길이', 1, 5, 1, 2, { color: 'amber', hint: '그림의 점 E를 가로로 끌어도 돼요', format: lenF }),
    qaDA: P('대각선 AC', 8, 10, 2, 8, { color: 'sky', format: lenF }),
    qaDB: P('대각선 BD', 8, 12, 2, 12, { color: 'green', format: lenF }),
    qaDC: P('변 AB', 4, 7, 1, 5, { color: 'amber', format: lenF }),
    qaIW: P('밑변 BC', 8, 12, 1, 10, { color: 'sky', format: lenF }),
    qaIS: P('옆변 AB', 3, 7, 1, 5, { color: 'green', format: lenF })
  };

  const paraBox = (w, sd0) => ({ x0: -0.66 * sd0 - 0.1, x1: w + 0.66 * sd0 + 0.1, y0: -sd0 - 0.1, y1: 0 });
  // 꼭짓점 A 를 끌어 ∠B 를 바꾸는 손잡이(B 중심 원 위)
  function handleA(b, s, key, p, lo, hi) {
    b.handle('A', p.A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 끌기(∠B 바꾸기)', drag: (w2) => { const a = Math.atan2(-(w2.y - p.B.y), w2.x - p.B.x) / DEG; s[key] = clamp(Math.round(a / 2) * 2, lo, hi); } });
  }
  const dotsABCD = (b, p, o = {}) => { [['A', p.A], ['B', p.B], ['C', p.C], ['D', p.D]].forEach(([k, q]) => { b.point(q, { color: o.color || 'ink', r: 4.5 }); tagOut(b, q, p.O, k, { size: 17, gap: 11 }); }); };
  const rand66 = (cur) => pick([50, 56, 60, 64, 70, 76, 80, 110, 116, 120], cur);

  /* ====================================================================== 1. 대변과 대각 */
  const defSides = {
    id: 'q1-1', title: '대변과 대각의 성질', short: '대변·대각',
    question: '평행사변형에서 마주 보는 두 변의 길이와 마주 보는 두 각의 크기는 어떤 관계일까?',
    ctl: ['qaW', 'qaS', 'qaB', 'qaT'], anim: { key: 'qaT', dur: 5, label: '△ABC 돌려 포개기', start: 0 },
    init: (s) => { s.qaW = 8; s.qaS = 4; s.qaB = 66; s.qaT = 0; s.qaK = 0; },
    reroll: (s) => { s.qaW = rint(6, 10); s.qaS = rint(3, 5); s.qaB = rand66(s.qaB); s.qaK = rint(0, 2); s.qaT = 0; },
    model: (s) => { const w = ci(s.qaW, 6, 10), sd0 = ci(s.qaS, 3, 5), beta = ci(s.qaB, 50, 130); return { w, s: sd0, beta, alpha: 180 - beta, K: s.qaK || 0, p: para(w, sd0, beta) }; },
    draw(b, s, M, cx) {
      const p = M.p, { A, B, C, D, O } = p, pts = p.pts, st = cx.step, bx = bboxOf(p.pts);
      fit(b, bx, { t: 58, b: 76, l: 58, r: 58 });
      fillPoly(b, pts, 'sky', 0.1); poly(b, pts, 'ink', 3.4);
      if (cx.problem) { drawProb1(b, M); return; }
      if (st >= 1) line(b, A, C, 'green', 3, { dash: [8, 5] });
      const t = cx.review ? (st >= 2 ? 1 : 0) : cx.t;
      if (t > 0.001 && st >= 1) {
        const R = [A, B, C].map((q) => rotP(q, O, 180 * t));
        fillPoly(b, R, 'amber', 0.16); poly(b, R, 'amber', 3.2, { alpha: 0.95 });
      }
      parAll(b, { A, B, C, D }, st >= 3 ? 0.25 : 0.5);
      if (st >= 2) {
        ang(b, A, B, C, { color: 'sky', rings: 1, r: 24 }); ang(b, C, D, A, { color: 'sky', rings: 1, r: 24 });
        ang(b, A, C, D, { color: 'rose', rings: 2, r: 32 }); ang(b, C, A, B, { color: 'rose', rings: 2, r: 32 });
      }
      if (st >= 3) { tick(b, A, B, 1); tick(b, D, C, 1); tick(b, A, D, 2); tick(b, B, C, 2); }
      if (st >= 3) {
        if (b.W < 560) {
          outsideAng(b, B, C, A, dg(M.beta), 'green'); outsideAng(b, D, A, C, dg(M.beta), 'green');
          outsideAng(b, A, B, D, dg(M.alpha), 'sky'); outsideAng(b, C, B, D, dg(M.alpha), 'sky');
        } else {
          ang(b, B, C, A, { color: 'green', rings: 3, r: 24, label: dg(M.beta), size: 15, labelDist: 42 }); ang(b, D, A, C, { color: 'green', rings: 3, r: 24, label: dg(M.beta), size: 15, labelDist: 42 });
          vlab(b, pts, 0, dg(M.alpha), { color: 'sky', dist: 38 }); vlab(b, pts, 2, dg(M.alpha), { color: 'sky', dist: 38 });
        }
      }
      if (st >= 3) {
        sd(b, A, B, O, `${M.s}`, 'amber'); sd(b, D, C, O, `${M.s}`, 'amber'); sd(b, B, C, O, `${M.w}`, 'amber'); sd(b, A, D, O, `${M.w}`, 'amber');
      }
      dotsABCD(b, p);
      if (!cx.review) handleA(b, s, 'qaB', p, 50, 130); else b.point(A, { color: 'ink', r: 4.5 });
      const cap = cx.review ? ['대각선 AC를 그어요', '엇각이 같고 AC가 공통 → △ABC ≡ △CDA', `AB=DC=${M.s}, BC=AD=${M.w}, ∠B=∠D=${M.beta}°`][clamp(st, 1, 3) - 1] : t >= 0.999 ? '△ABC가 △CDA에 꼭 포개져요 (ASA 합동)' : '▶를 눌러 △ABC를 돌려 포개 보세요';
      capLine(b, pt((bx.x0 + bx.x1) / 2, 0), cap, t >= 0.999 || st >= 2 ? 'green' : 'amber', { dy: 44 });
    },
    stepT: (n) => (n >= 2 ? 1 : 0),
    steps: (M) => [
      '대각선 AC를 그어 평행사변형을 △ABC와 △CDA로 나눠요.',
      'AB∥DC이므로 ∠BAC=∠DCA(엇각), AD∥BC이므로 ∠BCA=∠DAC(엇각)이고 AC는 공통이에요. 한 변과 양 끝각이 같으므로 △ABC ≡ △CDA (ASA 합동)예요.',
      `합동인 도형의 대응변·대응각은 같으므로 AB=DC=${M.s}, BC=AD=${M.w}이고 ∠B=∠D=${M.beta}°예요. 같은 방법으로 ∠A=∠C=${M.alpha}°이에요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 A</b>를 끌거나 막대로 길이와 ∠B를 바꿔 보세요. ▶를 누르면 <b>△ABC가 점 O를 중심으로 180° 돌아</b> △CDA에 포개져요. 마주 보는 변과 각이 늘 같아요.',
      readouts: [rd('AB = DC', `${M.s} = ${M.s}`, 'amber'), rd('BC = AD', `${M.w} = ${M.w}`, 'amber'), rd('∠B = ∠D', `${M.beta}° = ${M.beta}°`, 'green'), rd('∠A = ∠C', `${M.alpha}° = ${M.alpha}°`, 'sky'), rd('∠A + ∠B', `${M.alpha}° + ${M.beta}° = 180°`, 'sky', '이웃한 두 각의 합', null, true)],
      formula: `<p>$${ll('AB')}=${ll('DC')}=${M.s},\\ \\ ${ll('AD')}=${ll('BC')}=${M.w}$</p><p>$${an('B')}=${an('D')}=${M.beta}^{\\circ},\\ \\ ${an('A')}=${an('C')}=${M.alpha}^{\\circ}$</p><p>둘레 $=2\\times(${M.s}+${M.w})=${2 * (M.s + M.w)}$</p>`,
      rule: '평행사변형에서 두 쌍의 대변의 길이는 각각 같고, 두 쌍의 대각의 크기는 각각 같다',
      notes: notes('<b>마주 보는</b> 변·각끼리 같아요. 이웃한 두 각은 같지 않고 합이 180°예요.', '대각선 하나로 나눈 두 삼각형은 합동이라서 대변과 대각이 같다는 걸 알 수 있어요.')
    }),
    prob: (M) => {
      const { beta, alpha, s: sd0, w, K } = M;
      if (K === 0) return { tag: '대각의 크기', key: `a${beta}`, stem: `평행사변형 ABCD에서 ∠B=${beta}°일 때, ∠D의 크기 x는?`, choices: mkChoices(beta, [[alpha, '이웃한 각 ∠A의 크기예요. 마주 보는 각 ∠B와 ∠D가 같아요.'], [90, '직사각형이 아니에요.'], [360 - 2 * beta, '네 각의 합 360°에서 두 각을 뺀 값이에요. ∠B=∠D이므로 ∠D=∠B예요.']], { valid: (v) => v > 0 && v < 180, pad: 6 }) };
      if (K === 1) return { tag: '이웃한 각', key: `b${beta}`, stem: `평행사변형 ABCD에서 ∠B=${beta}°일 때, ∠A의 크기 x는?`, choices: mkChoices(alpha, [[beta, '∠A와 ∠B는 이웃한 각이에요. 합이 180°예요.'], [360 - 2 * beta, '∠A=∠C이고 ∠A+∠B=180°예요.'], [90, '직사각형이 아니에요.']], { valid: (v) => v > 0 && v < 180, pad: 6 }) };
      return { tag: '둘레', key: `c${sd0}_${w}`, stem: `평행사변형 ABCD에서 AB=${sd0}, BC=${w}일 때, 평행사변형 ABCD의 둘레의 길이는?`, choices: mkChoices(2 * (sd0 + w), [[sd0 + w, '두 변만 더했어요. 대변도 같으니 2배 해요.'], [2 * sd0 + w, 'AB=CD, BC=AD이므로 2(AB+BC)예요.'], [sd0 * w, '넓이 비슷하게 곱했어요. 둘레는 더해요.'], [sd0 + 2 * w, '2(AB+BC)예요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 2 }) };
    },
    verify: (M) => { const p = M.p; return [[dist(p.A, p.B), dist(p.D, p.C)], [dist(p.B, p.C), dist(p.A, p.D)]]; }
  };
  function drawProb1(b, M) {
    const p = M.p, { A, B, C, D, O } = p, K = M.K, bx = bboxOf(p.pts);
    parAll(b, { A, B, C, D });
    if (K === 0) { ang(b, B, C, A, { color: 'sky', rings: 1, r: 26, label: dg(M.beta), size: 16, labelDist: 56 }); xl(b, D, A, C); }
    else if (K === 1) { ang(b, B, C, A, { color: 'sky', rings: 1, r: 26, label: dg(M.beta), size: 16, labelDist: 56 }); xl(b, A, D, B); }
    else { sd(b, A, B, O, `${M.s}`, 'sky'); sd(b, B, C, O, `${M.w}`, 'sky'); }
    dotsABCD(b, p);
    void bx;
  }
  // 구하는 각 x (꼭짓점 V, 두 이웃 점): 작은 각 안쪽에
  function xl(b, V, a, c) { ang(b, V, a, c, { color: 'rose', rings: 1, r: 28, label: 'x', size: 18, labelDist: 52 }); }

  /* ====================================================================== 2. 각의 성질과 이등분선 */
  const bisDir = (V, a, c) => unit(add(unit(sub(a, V)), unit(sub(c, V))));
  const angles = {
    id: 'q1-2', title: '이웃한 각과 각의 이등분선', short: '각의 이등분선',
    question: '평행사변형에서 이웃한 두 내각의 크기의 합은? 그리고 이웃한 두 내각의 이등분선은 어떻게 만날까?',
    ctl: ['qaW', 'qaS', 'qaB'],
    init: (s) => { s.qaW = 8; s.qaS = 4; s.qaB = 66; s.qaK = 0; },
    reroll: (s) => { s.qaW = rint(6, 10); s.qaS = rint(3, 5); s.qaB = rand66(s.qaB); s.qaK = rint(0, 1); },
    model: (s) => {
      const w = ci(s.qaW, 6, 10), sd0 = ci(s.qaS, 3, 5), beta = ci(s.qaB, 50, 130), alpha = 180 - beta, p = para(w, sd0, beta), { A, B, C, D } = p;
      const Pp = inter(A, add(A, bisDir(A, B, D)), B, add(B, bisDir(B, A, C)));
      const E0 = lerp(A, D, sd0 / w), E1 = lerp(B, C, sd0 / w); // B 의 이등분선이 AD 와, A 의 이등분선이 BC 와 만나는 점
      return { w, s: sd0, beta, alpha, hb: beta / 2, ha: alpha / 2, p, P: Pp, E0, E1, K: s.qaK || 0 };
    },
    draw(b, s, M, cx) {
      const p = M.p, { A, B, C, D, O } = p, pts = p.pts, st = cx.step, bx = bboxOf(p.pts);
      fit(b, bx, { t: 40, b: 64, l: 46, r: 46 });
      fillPoly(b, pts, 'sky', 0.1); poly(b, pts, 'ink', 3.4);
      parAll(b, { A, B, C, D });
      if (cx.problem) {
        const K = M.K;
        if (K === 0) { line(b, B, M.E0, 'green', 3.2); ang2(b, B, C, M.E0, A, { color: 'green', rings: 1, r: 34 }); ang(b, B, C, A, { color: 'sky', rings: 1, r: 52, label: dg(M.beta), size: 15, labelDist: 74 }); xl(b, M.E0, A, B); b.point(M.E0, { color: 'ink', r: 4.5 }); tagOut(b, M.E0, O, 'E', { size: 17 }); }
        else { line(b, A, M.E1, 'green', 3.2); ang2(b, A, B, M.E1, D, { color: 'green', rings: 1, r: 34 }); ang(b, B, C, A, { color: 'sky', rings: 1, r: 26, label: dg(M.beta), size: 15, labelDist: 56 }); xl(b, M.E1, A, B); b.point(M.E1, { color: 'ink', r: 4.5 }); tagOut(b, M.E1, O, 'E', { size: 17 }); }
        dotsABCD(b, p);
        return;
      }
      if (st >= 2) {
        line(b, A, M.P, 'green', 3.2); line(b, B, M.P, 'green', 3.2);
        line(b, A, lerp(A, M.P, 1.9), 'green', 3.2, { alpha: 0.55 }); line(b, B, lerp(B, M.P, 1.9), 'green', 3.2, { alpha: 0.55 });
      }
      const Aa = M.ha, Bb = M.hb;
      if (st >= 2) {
        ang(b, A, B, M.P, { color: 'sky', rings: 1, r: 26, trim: 4, hash: true, label: dg(Aa), size: 14, labelDist: 56 }); ang(b, A, M.P, D, { color: 'sky', rings: 1, r: 26, trim: 4, hash: true });
        ang(b, B, A, M.P, { color: 'rose', rings: 2, r: 26, trim: 4, hash: true, label: dg(Bb), size: 14, labelDist: 56 }); ang(b, B, M.P, C, { color: 'rose', rings: 2, r: 26, trim: 4, hash: true });
        ang(b, M.P, A, B, { color: 'amber', r: 24, size: 15, label: st >= 3 ? '90°' : '', labelDist: 40 });
        b.point(M.P, { color: 'amber', r: 5 }); T(b, M.P, 'P', { dy: -16, size: 16, color: 'amber' });
      } else {
        ang(b, A, B, D, { color: 'sky', rings: 1, r: 28, label: dg(M.alpha), size: 15, labelDist: 56 }); ang(b, B, C, A, { color: 'rose', rings: 2, r: 28, label: dg(M.beta), size: 15, labelDist: 56 });
      }
      dotsABCD(b, p);
      if (!cx.review) handleA(b, s, 'qaB', p, 50, 130);
      const cap = cx.review ? ['∠A+∠B=180° (AD∥BC, 동측내각)', '∠PAB+∠PBA=(∠A+∠B)의 절반=90°', '△PAB에서 ∠APB=180°−90°=90°'][clamp(st, 1, 3) - 1] : `∠A+∠B=${M.alpha}°+${M.beta}°=180° · 이등분선은 서로 수직(∠APB=90°)`;
      capLine(b, pt((bx.x0 + bx.x1) / 2, 0), cap, 'amber', { dy: 44 });
    },
    steps: (M) => [
      `AD∥BC이므로 이웃한 두 내각의 합은 180°예요. ∠A+∠B=${M.alpha}°+${M.beta}°=180°`,
      `AP, BP가 각의 이등분선이므로 ∠PAB=$\\frac{1}{2}$∠A=${M.ha}°, ∠PBA=$\\frac{1}{2}$∠B=${M.hb}°예요. 그래서 ∠PAB+∠PBA=$\\frac{1}{2}$×180°=90°`,
      `△PAB의 내각의 합이 180°이므로 ∠APB=180°−90°=90°. 이웃한 두 내각의 이등분선은 서로 수직이에요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 A</b>를 끌어 ∠B를 바꿔 보세요. ∠A와 ∠B는 합이 늘 <b>180°</b>이고, 두 이등분선이 만나는 각 ∠APB는 항상 <b>90°</b>예요.',
      readouts: [rd('∠A', `${M.alpha}°`, 'sky'), rd('∠B', `${M.beta}°`, 'rose'), rd('∠PAB', `${M.ha}°`, 'sky', '∠A의 절반'), rd('∠PBA', `${M.hb}°`, 'rose', '∠B의 절반'), rd('∠APB', '90°', 'amber', `${M.ha}°+${M.hb}°+90°=180°`, null, true)],
      formula: `<p>$${an('A')}+${an('B')}=${M.alpha}^{\\circ}+${M.beta}^{\\circ}=180^{\\circ}$</p><p>$${an('PAB')}+${an('PBA')}=\\frac{1}{2}\\times180^{\\circ}=90^{\\circ}$</p><p>$${an('APB')}=180^{\\circ}-90^{\\circ}=90^{\\circ}$</p>`,
      rule: '평행사변형에서 이웃한 두 내각의 합은 180°이고, 그 이등분선이 만나는 각은 90°이다',
      notes: notes('이웃한 두 각의 이등분선이 만나면 <b>직각</b>이에요. 마주 보는 두 각의 이등분선은 서로 평행해요.', '∠B의 이등분선은 AD와 만나는 점 E에서 ∠AEB=∠EBC(엇각)이므로 AB=AE인 이등변삼각형이 생겨요.')
    }),
    prob: (M) => {
      const { beta, alpha, K } = M;
      if (K === 0) return { tag: '이등분선과 엇각', key: `e0_${beta}`, stem: `평행사변형 ABCD에서 ∠B=${beta}°이고 ∠B의 이등분선이 변 AD와 만나는 점을 E라 할 때, ∠AEB의 크기 x는?`, choices: mkChoices(beta / 2, [[beta, '∠B 전체예요. ∠ABE는 절반이고, ∠AEB는 엇각이라 ∠EBC와 같아요.'], [alpha, '이웃한 각 ∠A예요.'], [alpha / 2, '∠A의 절반이에요. ∠AEB=∠EBC=∠B의 절반이에요.'], [90 - beta / 2, '90°에서 뺐어요. 엇각이므로 ∠AEB=∠EBC예요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
      return { tag: '이등분선과 엇각', key: `e1_${beta}`, stem: `평행사변형 ABCD에서 ∠B=${beta}°이고 ∠A의 이등분선이 변 BC와 만나는 점을 E라 할 때, ∠AEB의 크기 x는?`, choices: mkChoices(alpha / 2, [[alpha, '∠A 전체예요. ∠BAE는 절반이고, ∠AEB는 엇각이라 ∠EAD와 같아요.'], [beta, '∠B예요.'], [beta / 2, '∠B의 절반이에요. ∠AEB=∠EAD=∠A의 절반이에요.'], [90 - alpha / 2, '90°에서 뺐어요. 엇각이므로 ∠AEB=∠EAD예요.']], { valid: (v) => v > 0 && v < 180, pad: 5 }) };
    }
  };

  /* ====================================================================== 3. 대각선과 O를 지나는 선분 */
  const diag = {
    id: 'q1-3', title: '대각선과 점 O를 지나는 선분', short: '대각선·O',
    question: '평행사변형의 두 대각선은 서로를 어떻게 나눌까? 대각선의 교점 O를 지나는 선분 EF는 어떤 성질이 있을까?',
    ctl: ['qaW', 'qaS', 'qaB', 'qaE'],
    init: (s) => { s.qaW = 8; s.qaS = 4; s.qaB = 66; s.qaE = 2; s.qaK = 0; },
    reroll: (s) => { s.qaW = rint(6, 10); s.qaS = rint(3, 5); s.qaB = rand66(s.qaB); s.qaE = rint(1, 5); s.qaK = rint(0, 2); },
    model: (s) => {
      const w = ci(s.qaW, 6, 10), sd0 = ci(s.qaS, 3, 5), beta = ci(s.qaB, 50, 130), e = ci(s.qaE, 1, 5), p = para(w, sd0, beta);
      const E = pt(p.A.x + e, p.A.y), F = pt(w - e, 0);
      return { w, s: sd0, beta, e, rest: w - e, p, E, F, K: s.qaK || 0, S: 4 * (w + sd0) };
    },
    draw(b, s, M, cx) {
      const p = M.p, { A, B, C, D, O } = p, pts = p.pts, st = cx.step, bx = bboxOf(p.pts), { E, F } = M;
      fit(b, bx, { t: 40, b: 64, l: 46, r: 46 });
      fillPoly(b, pts, 'sky', 0.1); poly(b, pts, 'ink', 3.4);
      parAll(b, { A, B, C, D });
      const K = M.K;
      if (cx.problem) {
        line(b, A, C, 'ink', 2.4); line(b, B, D, 'ink', 2.4); line(b, E, F, 'green', 3.4);
        if (K === 2) { fillPoly(b, [A, B, F, E], 'green', 0.22); }
        b.point(O, { color: 'ink', r: 4.5 }); T(b, O, 'O', { dx: 0, dy: -16, size: 16 });
        if (K === 0) { dimLine(b, A, D, -38, `${M.w}`, 'sky'); sd(b, A, E, O, `${M.e}`, 'sky', { dy: -2 }); segTag(b, B, F, 0.5, 'x', 22, 'rose', { size: 18 }); }
        if (K === 1) { sd(b, A, E, O, `${M.e}`, 'sky'); sd(b, D, C, O, '', 'sky'); segTag(b, F, C, 0.5, 'x', 22, 'rose', { size: 18 }); }
        if (K === 2) { T(b, pt((bx.x0 + bx.x1) / 2, 0), `□ABCD의 넓이 = ${M.S}`, { dy: 48, size: b.W < 560 ? 15 : 17, color: 'sky', weight: 800 }); T(b, lerp(A, F, 0.5), 'x', { dx: -6, dy: 8, size: 20, color: 'rose' }); }
        tagE(b, M);
        dotsABCD(b, p);
        return;
      }
      line(b, A, C, 'green', 2.8, { dash: [8, 5] }); line(b, B, D, 'green', 2.8, { dash: [8, 5] });
      tick(b, A, O, 1); tick(b, O, C, 1); tick(b, B, O, 2); tick(b, O, D, 2);
      if (st >= 2) {
        line(b, E, F, 'amber', 3.6); tick(b, E, O, 3, 'rose'); tick(b, O, F, 3, 'rose');
        fillPoly(b, [A, E, O], 'amber', 0.2); fillPoly(b, [C, F, O], 'amber', 0.2);
        ang(b, O, A, E, { color: 'sky', rings: 1, r: 20 }); ang(b, O, C, F, { color: 'sky', rings: 1, r: 20 });
        ang(b, A, C, E, { color: 'green', rings: 2, r: 24 }); ang(b, C, A, F, { color: 'green', rings: 2, r: 24 });
      } else line(b, E, F, 'amber', 3.6);
      b.point(O, { color: 'amber', r: 5 }); T(b, O, 'O', { dx: 0, dy: -16, size: 16, color: 'amber' });
      if (st >= 3 || !cx.review) { sd(b, A, E, O, `${M.e}`, 'amber', { dy: -2 }); sd(b, F, C, O, `${M.e}`, 'amber'); sd(b, E, D, O, `${M.rest}`, 'sky', { dy: -2 }); sd(b, B, F, O, `${M.rest}`, 'sky'); }
      tagE(b, M);
      dotsABCD(b, p);
      if (!cx.review) b.handle('E', E, { color: 'amber', r: 8, ariaLabel: '점 E 가로로 끌기', drag: (w2) => { s.qaE = clamp(Math.round(w2.x - A.x), 1, 5); } });
      const cap = cx.review ? ['OA=OC, OB=OD (대각선은 서로 이등분)', '△AOE ≡ △COF (ASA 합동)', `OE=OF, AE=CF=${M.e}, DE=BF=${M.rest}`][clamp(st, 1, 3) - 1] : `OE=OF · AE=CF=${M.e} · DE=BF=${M.rest}`;
      capLine(b, pt((bx.x0 + bx.x1) / 2, 0), cap, 'amber', { dy: 44 });
    },
    steps: (M) => [
      '평행사변형의 두 대각선은 서로를 이등분해요. 그래서 OA=OC, OB=OD예요.',
      '△AOE와 △COF에서 OA=OC, ∠AOE=∠COF(맞꼭지각), ∠OAE=∠OCF(엇각)이므로 △AOE ≡ △COF (ASA 합동)예요.',
      `대응변이 같으므로 OE=OF이고 AE=CF=${M.e}예요. 그러므로 DE=AD−AE=${M.w}−${M.e}=${M.rest}, BF=BC−CF=${M.rest}예요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 E</b>를 가로로 끌어 보세요. 점 O를 지나는 선분 EF는 늘 <b>OE=OF</b>이고, 점 F는 E와 점대칭 자리에 와요. 평행사변형의 넓이도 EF가 반으로 나눠요.',
      readouts: [rd('AE = CF', `${M.e} = ${M.e}`, 'amber'), rd('DE = BF', `${M.rest} = ${M.rest}`, 'sky'), rd('OE = OF', '같아요', 'rose'), rd('OA = OC', '같아요', 'green'), rd('OB = OD', '같아요', 'green')],
      formula: `<p>$${tri('AOE')}\\equiv${tri('COF')}$ (ASA 합동)</p><p>$${ll('AE')}=${ll('CF')}=${M.e},\\ \\ ${ll('DE')}=${ll('BF')}=${M.w}-${M.e}=${M.rest}$</p><p>(사각형 ABFE의 넓이) $=\\frac{1}{2}\\times$(평행사변형 ABCD의 넓이)</p>`,
      rule: '평행사변형의 두 대각선은 서로를 이등분하고, 교점 O를 지나는 직선은 평행사변형의 넓이를 이등분한다',
      notes: notes('점 O를 지나지 않는 직선은 넓이를 반으로 나누지 못해요.', 'OE=OF이므로 EF도 O에서 이등분돼요. 사각형 AFCE도 평행사변형이에요.')
    }),
    prob: (M) => {
      const { w, e, rest, K, S } = M;
      if (K === 0) return { tag: '합동으로 길이 구하기', key: `l${w}_${e}`, stem: `평행사변형 ABCD의 대각선의 교점 O를 지나는 직선이 변 AD, BC와 만나는 점을 각각 E, F라 하자. AD=${w}, AE=${e}일 때, BF의 길이 x는?`, choices: mkChoices(rest, [[e, 'AE와 같은 CF의 길이예요. BF=DE=AD−AE예요.'], [w, 'AD 전체예요.'], [w + e, '더했어요.'], [e * 2, '2배 했어요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1 }) };
      if (K === 1) return { tag: '합동으로 길이 구하기', key: `m${w}_${e}`, stem: `평행사변형 ABCD의 대각선의 교점 O를 지나는 직선이 변 AD, BC와 만나는 점을 각각 E, F라 하자. AE=${e}일 때, FC의 길이 x는?`, choices: mkChoices(e, [[w - e, 'BF나 DE의 길이예요. FC=AE예요.'], [2 * e, '2배 했어요.'], [e + 1, '값을 다시 확인해 보세요.'], [Math.max(1, e - 1), '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1 }) };
      const half = S / 2;
      return { tag: '넓이의 이등분', key: `a${S}`, stem: `평행사변형 ABCD의 넓이가 ${S}이고, 대각선의 교점 O를 지나는 직선이 변 AD, BC와 만나는 점을 각각 E, F라 하자. 사각형 ABFE의 넓이 x는?`, choices: mkChoices(half, [[S, '전체 넓이예요.'], [S / 4, '더 작게 나눴어요.'], [S * 2, '2배 했어요.'], [half + 2, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 2 }) };
    }
  };
  function tagE(b, M) {
    b.point(M.E, { color: 'amber', r: 5 }); T(b, M.E, 'E', { dx: -4, dy: -16, size: 17, color: 'amber' });
    b.point(M.F, { color: 'amber', r: 5 }); T(b, M.F, 'F', { dx: 4, dy: 18, size: 17, color: 'amber' });
  }

  /* ====================================================================== 4. 대각선과 삼각형의 둘레 */
  const diagP = {
    id: 'q1-4', title: '대각선으로 만든 삼각형의 둘레', short: '△ABO 둘레',
    question: '평행사변형 ABCD에서 AB, AC, BD의 길이를 알 때 △ABO의 둘레는 어떻게 구할까?',
    ctl: ['qaDC', 'qaDA', 'qaDB'],
    init: (s) => { s.qaDC = 5; s.qaDA = 8; s.qaDB = 12; s.qaK = 0; },
    reroll: (s) => { s.qaDC = rint(4, 7); s.qaDA = pick([8, 10], s.qaDA); s.qaDB = pick([8, 10, 12], s.qaDB); s.qaK = rint(0, 1); },
    model: (s) => {
      const c = ci(s.qaDC, 4, 7), p = ci(s.qaDA, 8, 10) / 2, q = ci(s.qaDB, 8, 12) / 2;
      const w = Math.sqrt(2 * p * p + 2 * q * q - c * c), beta = Math.acos(clamp((q * q - p * p) / (c * w), -1, 1)) / DEG;
      return { c, p, q, ac: 2 * p, bd: 2 * q, per: c + p + q, per2: 2 * (c + 0) , w, beta, pg: para(w, c, beta), K: s.qaK || 0 };
    },
    draw(b, s, M, cx) {
      const pg = M.pg, { A, B, C, D, O } = pg, pts = pg.pts, st = cx.step;
      const bx = { x0: -0.2 * M.c - 0.5, x1: M.w + 0.2 * M.c + 0.8, y0: -M.c - 0.2, y1: 0 };
      void bx;
      fit(b, bboxOf([A, B, C, D]), { t: 40, b: 70, l: 46, r: 46 });
      fillPoly(b, pts, 'sky', 0.1); poly(b, pts, 'ink', 3.4);
      parAll(b, { A, B, C, D });
      line(b, A, C, 'ink', 2.6); line(b, B, D, 'ink', 2.6);
      tick(b, A, O, 1); tick(b, O, C, 1); tick(b, B, O, 2); tick(b, O, D, 2);
      { fillPoly(b, [A, B, O], 'amber', cx.problem ? 0.14 : st >= 2 ? 0.22 : 0.14); }
      b.point(O, { color: 'ink', r: 4.5 }); T(b, O, 'O', { dx: 8, dy: -16, size: 16 });
      if (!cx.problem || M.K === 0) sd(b, A, B, O, `${M.c}`, 'sky');
      if (cx.problem) {
        diagLab(b, A, C, 0.2, `AC=${M.ac}`, 'sky'); diagLab(b, B, D, 0.2, `BD=${M.bd}`, 'sky');
        if (M.K === 1) { segTag(b, A, B, 0.5, 'x', -22, 'rose', { size: 18 }); capLine(b, pt((A.x + D.x) / 2, 0), `△ABO의 둘레 = ${M.per}`, 'amber', { dy: 44 }); }
      } else {
        segTag(b, A, O, 0.5, `${M.p}`, 14, 'amber'); segTag(b, O, C, 0.5, `${M.p}`, 14, 'sky'); segTag(b, B, O, 0.5, `${M.q}`, -14, 'amber'); segTag(b, O, D, 0.5, `${M.q}`, -14, 'sky');
      }
      dotsABCD(b, pg);
      if (!cx.problem) capLine(b, pt((A.x + D.x) / 2, 0), cx.review ? ['AC=2·OA, BD=2·OB이므로 OA, OB를 구해요', `△ABO의 세 변: AB=${M.c}, OA=${M.p}, OB=${M.q}`, `둘레 = ${M.c}+${M.p}+${M.q} = ${M.per}`][clamp(st, 1, 3) - 1] : `△ABO의 둘레 = ${M.c}+${M.p}+${M.q} = ${M.per}`, 'amber', { dy: 44 });
    },
    steps: (M) => [
      `평행사변형의 두 대각선은 서로를 이등분하므로 OA=$\\frac{1}{2}$AC=$\\frac{1}{2}$×${M.ac}=${M.p}, OB=$\\frac{1}{2}$BD=$\\frac{1}{2}$×${M.bd}=${M.q}예요.`,
      `△ABO의 세 변은 AB=${M.c}, OA=${M.p}, OB=${M.q}예요.`,
      `(△ABO의 둘레) = AB+OA+OB = ${M.c}+${M.p}+${M.q} = ${M.per}`
    ],
    view: (M) => ({
      guide: 'AB, AC, BD를 막대로 바꿔 보세요. 대각선은 서로를 이등분하므로 <b>OA=AC의 절반, OB=BD의 절반</b>이에요.',
      readouts: [rd('OA = OC', `${M.p}`, 'amber', 'AC의 절반'), rd('OB = OD', `${M.q}`, 'amber', 'BD의 절반'), rd('AB', `${M.c}`, 'sky'), rd('△ABO의 둘레', `${M.per}`, 'rose', `${M.c}+${M.p}+${M.q}`, null, true)],
      formula: `<p>$${ll('OA')}=\\frac{1}{2}${ll('AC')}=${M.p},\\ \\ ${ll('OB')}=\\frac{1}{2}${ll('BD')}=${M.q}$</p><p>$${tri('ABO')}$의 둘레 $=${M.c}+${M.p}+${M.q}=${M.per}$</p>`,
      rule: '평행사변형의 두 대각선은 서로를 이등분한다 → OA=OC=$\\frac{1}{2}$AC, OB=OD=$\\frac{1}{2}$BD',
      notes: notes('대각선 전체(AC, BD)가 아니라 <b>절반(OA, OB)</b>을 더해야 해요.', 'AB, AC, BD 중 하나를 바꾸면 삼각형이 만들어지지 않을 수도 있어요. 막대 범위 안에서는 항상 삼각형이 돼요.')
    }),
    prob: (M) => {
      const { c, p, q, ac, bd, per, K } = M;
      if (K === 0) return { tag: '둘레의 길이', key: `p${c}_${ac}_${bd}`, stem: `평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. AB=${c}, AC=${ac}, BD=${bd}일 때, 삼각형 ABO의 둘레의 길이는?`, choices: mkChoices(per, [[c + ac + bd, '대각선 전체를 더했어요. OA, OB는 절반이에요.'], [c + ac / 2 + bd, 'BD도 절반으로 해야 해요.'], [c + ac + bd / 2, 'AC도 절반으로 해야 해요.'], [2 * c + p + q, 'AB를 두 번 더했어요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1 }) };
      const L = per;
      return { tag: '둘레에서 변 구하기', key: `q${c}_${ac}_${bd}`, stem: `평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. AC=${ac}, BD=${bd}이고 삼각형 ABO의 둘레가 ${L}일 때, AB의 길이 x는?`, choices: mkChoices(c, [[L - ac - bd, '대각선 전체를 뺐어요. OA, OB는 절반이에요.'], [L - ac / 2 - bd, 'BD도 절반으로 해야 해요.'], [L - ac - bd / 2, 'AC도 절반으로 해야 해요.'], [L, '둘레 그대로예요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1 }) };
    }
  };
  function diagLab(b, p, q, f, str, color) { segTag(b, p, q, f, str, -16, color, { size: 15 }); }

  /* ====================================================================== 5. 각의 이등분선 → 이등변삼각형 */
  const isoBis = {
    id: 'q1-5', title: '각의 이등분선과 이등변삼각형', short: '이등분선→이등변',
    question: '평행사변형에서 ∠A의 이등분선이 변 BC와 만나는 점을 E라 하면 △ABE는 어떤 삼각형일까? EC의 길이는?',
    ctl: ['qaIW', 'qaIS', 'qaB'],
    init: (s) => { s.qaIW = 10; s.qaIS = 5; s.qaB = 66; s.qaK = 0; s.qaPa = 4; s.qaPb = 8; },
    reroll: (s) => { s.qaIW = rint(8, 12); s.qaIS = rint(3, 7); s.qaB = rand66(s.qaB); s.qaK = rint(0, 1); s.qaPa = rint(3, 5); s.qaPb = rint(6, 9); },
    model: (s) => {
      const w = ci(s.qaIW, 8, 12), sd0 = ci(s.qaIS, 3, 7), beta = ci(s.qaB, 50, 130), p = para(w, sd0, beta);
      const E = pt(sd0, 0), ha = (180 - beta) / 2;
      const a = ci(s.qaPa, 3, 5), bb = ci(s.qaPb, 6, 9), pq = para(a, bb, 66);
      return { w, s: sd0, beta, p, E, ha, ec: w - sd0, K: s.qaK || 0, a, bb, pq, Eq: pt(bb, 0), Dq: pq.D };
    },
    draw(b, s, M, cx) {
      if (cx.problem && M.K === 1) { drawIso1(b, M); return; }
      const p = M.p, { A, B, C, D, O } = p, pts = p.pts, st = cx.step, E = M.E;
      fit(b, bboxOf(p.pts), { t: 48, b: cx.problem ? 90 : 76, l: 54, r: 54 });
      fillPoly(b, pts, 'sky', 0.1); poly(b, pts, 'ink', 3.4);
      parAll(b, { A, B, C, D }, 0.25);
      line(b, A, E, 'green', 3.4);
      if (cx.problem) {
        ang2(b, A, B, E, D, { color: 'sky', rings: 1, r: 30 });
        sd(b, A, B, O, `${M.s}`, 'sky'); dimLine(b, B, C, 50, `${M.w}`, 'sky');
        segTag(b, E, C, 0.5, 'x', 22, 'rose', { size: 18 });
        b.point(E, { color: 'ink', r: 4.5 }); T(b, E, 'E', { dy: 20, size: 17 });
        dotsABCD(b, p); return;
      }
      const ex = st >= 2 || !cx.review;
      if (b.W < 560) capLine(b, pt(M.w / 2, -M.s), `같은 표시의 각: ${M.ha}°`, 'sky', { dy: -20 });
      fillPoly(b, [A, B, E], 'amber', st >= 3 ? 0.2 : 0.1);
      ang(b, A, B, E, { color: 'sky', rings: 1, r: 26, trim: 4, hash: true, label: b.W < 560 ? null : dg(M.ha), size: 14, labelDist: 44 }); ang(b, A, E, D, { color: 'sky', rings: 1, r: 26, trim: 4, hash: true, label: b.W < 560 ? null : dg(M.ha), size: 14, labelDist: 46 });
      if (ex) ang(b, E, A, B, { color: 'sky', rings: 1, r: 26, hash: true, label: b.W < 560 ? null : dg(M.ha), size: 14, labelDist: 46 });
      if (st >= 3 || !cx.review) { tick(b, A, B, 1); tick(b, B, E, 1); segTag(b, B, E, 0.5, `${M.s}`, 22, 'amber'); segTag(b, E, C, 0.5, `${M.ec}`, 22, 'rose'); }
      sd(b, A, B, O, `${M.s}`, 'amber'); sd(b, A, D, O, `${M.w}`, 'sky');
      b.point(E, { color: 'amber', r: 5 }); T(b, E, 'E', { dy: 20, size: 17, color: 'amber' });
      dotsABCD(b, p);
      if (!cx.review) handleA(b, s, 'qaB', p, 50, 130);
      const cap = cx.review ? ['∠BAE=∠DAE (이등분선)', '∠DAE=∠AEB (엇각) → ∠BAE=∠AEB', `BE=AB=${M.s} → EC=${M.w}−${M.s}=${M.ec}`][clamp(st, 1, 3) - 1] : `BE=AB=${M.s} · EC=BC−AB=${M.w}−${M.s}=${M.ec}`;
      capLine(b, pt(M.w / 2, 0), cap, 'amber', { dy: 54 });
    },
    steps: (M) => [
      `AE가 ∠A의 이등분선이므로 ∠BAE=∠DAE=${M.ha}°예요.`,
      `AD∥BC이므로 ∠DAE=∠AEB(엇각)=${M.ha}°예요. 그러면 ∠BAE=∠AEB예요.`,
      `△ABE는 두 밑각이 같은 이등변삼각형이므로 BE=AB=${M.s}이고, EC=BC−BE=${M.w}−${M.s}=${M.ec}예요.`
    ],
    view: (M) => ({
      guide: 'BC와 AB를 바꿔 보세요. 점 A를 끌어 ∠B를 바꿔도 <b>BE=AB</b>는 변하지 않아요. 그래서 <b>EC=BC−AB</b>예요.',
      readouts: [rd('∠BAE = ∠DAE', `${M.ha}°`, 'sky', '∠A의 절반'), rd('∠AEB', `${M.ha}°`, 'sky', '엇각'), rd('BE', `${M.s}`, 'amber', '= AB'), rd('EC', `${M.ec}`, 'rose', `${M.w} − ${M.s}`, null, true)],
      formula: `<p>$${an('BAE')}=${an('DAE')}=${an('AEB')}$ → $${tri('ABE')}$는 이등변삼각형</p><p>$${ll('BE')}=${ll('AB')}=${M.s},\\ \\ ${ll('EC')}=${ll('BC')}-${ll('BE')}=${M.w}-${M.s}=${M.ec}$</p>`,
      rule: '평행사변형에서 한 내각의 이등분선은 이등변삼각형을 만든다 (엇각 = 이등분한 각)',
      notes: notes('이등분선을 그으면 같은 각이 <b>세 곳</b>(∠BAE, ∠DAE, ∠AEB)에 생겨요.', '짧은 변 쪽이면 E가 BC 안에, 긴 변 쪽이면 BC의 연장선 위에 와요. 문제 탭에서 두 경우를 모두 만나요.')
    }),
    prob: (M) => {
      if (M.K === 0) { const { s: sd0, w, ec } = M; return { tag: '이등분선 → 이등변', key: `i0_${sd0}_${w}`, stem: `평행사변형 ABCD에서 ∠A의 이등분선이 변 BC와 만나는 점을 E라 하자. AB=${sd0}, BC=${w}일 때, EC의 길이 x는?`, choices: mkChoices(ec, [[sd0, 'BE의 길이예요. EC=BC−BE예요.'], [w, 'BC 전체예요.'], [w + sd0, '더했어요.'], [w - sd0 + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1 }) }; }
      const { a, bb } = M;
      return { tag: '이등분선 → 이등변 (연장선)', key: `i1_${a}_${bb}`, stem: `평행사변형 ABCD에서 ∠A의 이등분선이 변 BC의 연장선과 만나는 점을 E라 하자. AB=${bb}, BC=${a}일 때, CE의 길이 x는?`, choices: mkChoices(bb - a, [[bb, 'BE의 길이예요. CE=BE−BC예요.'], [a, 'BC의 길이예요.'], [bb + a, '더했어요.'], [bb - a + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1 }) };
    }
  };
  // 문제 그림(연장선 경우): ∠A 의 이등분선이 BC 의 연장선과 E 에서 만난다(AB > BC)
  function drawIso1(b, M) {
    const q = M.pq, { A, B, C, D, O } = q, E = M.Eq;
    fit(b, bboxOf([A, B, C, D, E]), { t: 40, b: 70, l: 46, r: 46 });
    fillPoly(b, q.pts, 'sky', 0.1); poly(b, q.pts, 'ink', 3.4); line(b, C, E, 'ink', 3.4); line(b, A, E, 'green', 3.4);
    parAll(b, { A, B, C, D });
    ang2(b, A, B, E, D, { color: 'sky', rings: 1, r: 30 });
    ang(b, E, A, B, { color: 'sky', rings: 1, r: 30, hash: true });
    sd(b, A, B, O, `${M.bb}`, 'sky'); dimLine(b, B, C, 46, `${M.a}`, 'sky');
    segTag(b, C, E, 0.5, 'x', 22, 'rose', { size: 18 });
    dotsABCD(b, q); b.point(E, { color: 'ink', r: 4.5 }); T(b, E, 'E', { dy: 20, size: 17 });
  }

  const gl = [defSides, angles, diag, diagP, isoBis];
  G.register(10, 'qd1', '① 평행사변형의 성질', '평행사변형의 성질', PARAMS, gl);
})();
