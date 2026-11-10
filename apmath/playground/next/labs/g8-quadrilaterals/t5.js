/* ==========================================================================
   중2 · 사각형의 성질 — 탭 ⑤ 「넓이가 같은 도형」 (t5.js, order 50) — 장면 5개
   · q5-1 넓이가 같은 삼각형으로 바꾸기 · 꺾인 사각형 ABCD = △ABE (DE∥AC)
   · q5-2 평행선 위의 꼭짓점과 높이가 같은 삼각형 · 꼭짓점 A를 가로로 끌어도 넓이는 그대로, 넓이의 비 = 밑변의 비
   · q5-3 사다리꼴의 대각선과 네 삼각형 · △ABO = △DCO
   · q5-4 평행사변형 내부의 점 P   · 위+아래 = 왼쪽+오른쪽 = 전체의 절반
   · q5-5 평행사변형의 변 위의 점 E · △EBC = 전체의 절반
   넓이 값은 모두 정수이고, 지금의 길이·위치에서 다시 계산됩니다. (분수는 위아래로 쌓아 씁니다.)
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_QD;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, lerp, inter, pick, rint, bboxOf, centroid, T, tagOut, ang, tick, par, fillPoly, line, poly, fit, P, mkChoices, rd, notes, fmtN, sd, ll, an, tri, capLine, segTag, ci } = G;
  const lenF = (v) => fmtN(v);

  const PARAMS = {
    qeL: P('밑변 AC', 4, 8, 2, 6, { color: 'sky', format: lenF }),
    qeH1: P('B에서 AC까지의 높이', 3, 5, 1, 4, { color: 'green', format: lenF }),
    qeH2: P('D에서 AC까지의 높이', 2, 4, 1, 3, { color: 'amber', hint: '꼭짓점 D를 가로로 끌어도 돼요', format: lenF }),
    qeM: P('BD의 길이 m', 1, 6, 1, 2, { color: 'sky', format: lenF }),
    qeN: P('DC의 길이 n', 1, 6, 1, 3, { color: 'green', format: lenF }),
    qeH: P('높이', 2, 6, 2, 4, { color: 'amber', hint: '꼭짓점 A를 가로로 끌어도 높이는 같아요', format: lenF }),
    qeA: P('AD의 비 m (AD : BC = m : n)', 1, 3, 1, 1, { color: 'amber', format: (v) => String(v) }),
    qeB: P('BC의 비 n', 4, 6, 1, 4, { color: 'sky', format: (v) => String(v) }),
    qeK: P('넓이의 단위 k', 1, 2, 1, 1, { color: 'green', format: (v) => String(v) }),
    qeW: P('밑변 BC', 4, 8, 2, 6, { color: 'sky', format: lenF }),
    qeHp: P('높이', 4, 6, 2, 4, { color: 'green', format: lenF }),
    qeE: P('AE의 길이', 1, 7, 1, 2, { color: 'amber', hint: '그림의 점 E를 가로로 끌어도 돼요', format: lenF })
  };

  const aTag = (b, pts, v, color = 'sky', size = 16) => T(b, centroid(pts), `${v}`, { size, color, weight: 800 });
  // 문제 그림에서 △ACD 의 넓이 글자: 점선 AE 가 △ACD 를 둘로 가르므로 더 넓은 쪽 한가운데에 놓아 선과 겹치지 않게 합니다.
  const acdAt = (M) => {
    const X = inter(M.A, M.E, M.D, M.C), up = [M.A, M.D, X], lo = [M.A, X, M.C];
    const ar = (t) => Math.abs((t[1].x - t[0].x) * (t[2].y - t[0].y) - (t[2].x - t[0].x) * (t[1].y - t[0].y)) / 2;
    return centroid(ar(up) >= ar(lo) ? up : lo);
  };
  const aceAt = (M) => lerp(mid(M.C, M.E), centroid([M.A, M.C, M.E]), 0.45);
  const dotsN = (b, named, cen, o = {}) => Object.keys(named).forEach((k) => { b.point(named[k], { color: o.c || 'ink', r: 4.5 }); tagOut(b, named[k], (o.cens && o.cens[k]) || cen, k, { size: 17, gap: 11, color: o.c || 'ink' }); });

  /* ====================================================================== 1. 넓이가 같은 삼각형으로 바꾸기 */
  const quadToTri = {
    id: 'q5-1', title: '꺾인 사각형을 넓이가 같은 삼각형으로', short: '사각형 → 삼각형',
    question: '사각형 ABCD와 넓이가 같은 삼각형 ABE를 어떻게 만들까? 점 D를 지나 대각선 AC에 평행한 직선을 그어 보자.',
    ctl: ['qeL', 'qeH1', 'qeH2'],
    init: (s) => { s.qeL = 6; s.qeH1 = 4; s.qeH2 = 3; s.qeDx = 2; s.qeK = 0; },
    reroll: (s) => { s.qeL = pick([4, 6, 8], s.qeL); s.qeH1 = rint(3, 5); s.qeH2 = rint(2, 4); s.qeDx = rint(1, s.qeL - 1); s.qeK = rint(0, 2); },
    model: (s) => {
      const L = ci(s.qeL, 4, 8), h1 = ci(s.qeH1, 3, 5), h2 = ci(s.qeH2, 2, 4), dx = clamp(Math.round(s.qeDx == null ? 2 : s.qeDx), 1, L - 1);
      const A = pt(0, 0), C = pt(L, 0), B = pt(L - 2, h1), D = pt(dx, -h2), E = pt(L + (2 * h2) / h1, -h2);
      return { L, h1, h2, A, B, C, D, E, dx, S1: (L * h1) / 2, S2: (L * h2) / 2, tot: (L * (h1 + h2)) / 2, K: s.qeK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, E } = M, st = cx.step, quad = [A, B, C, D], cen = pt(L2(M) / 2, 0);
      const compactProblem = cx.problem && b.W < 560;
      fit(b, compactProblem ? bboxOf([A, B, C, D, E]) : { x0: -0.5, x1: M.L + 3.4, y0: -4.4, y1: 5.4 }, compactProblem ? { t: 26, b: 54, l: 36, r: 36 } : { t: 30, b: cx.problem ? 88 : 72, l: 40, r: 40 });
      fillPoly(b, quad, 'sky', 0.1); poly(b, quad, 'ink', 3.4);
      line(b, A, C, 'green', 3, { dash: [8, 5] });
      const showE = cx.problem || cx.review ? st >= 2 || cx.problem : true;
      if (showE) { line(b, D, E, 'amber', 3.2); line(b, C, E, 'ink', 3.4); par(b, A, C, 1, 'green', 0.42); par(b, D, E, 1, 'green', 0.42); }
      const abe = [A, B, E];
      if (cx.problem || st >= 4 || (!cx.review)) poly(b, abe, 'amber', 3, { dash: [10, 6], alpha: 0.9 });
      if (cx.problem) {
        const k = M.K;
        const cap = (str, col) => T(b, pt(M.L / 2 + 1, M.h1), str, { dy: compactProblem ? 40 : 58, size: b.W < 560 ? 15 : 17, color: col, weight: 800 });
        if (k === 0) { aTag(b, [A, B, C], M.S1, 'sky'); T(b, acdAt(M), `${M.S2}`, { size: 16, color: 'sky', weight: 800 }); cap('△ABE의 넓이 = x', 'rose'); }
        else if (k === 1) { T(b, acdAt(M), `${M.S2}`, { size: 16, color: 'sky', weight: 800 }); cap('△ACE의 넓이 = x', 'rose'); }
        else { aTag(b, [A, B, C], M.S1, 'sky'); T(b, acdAt(M), 'x', { size: 20, color: 'rose', weight: 800 }); cap(`△ABE의 넓이 = ${M.tot}`, 'amber'); }
        dotsN(b, { A, B, C, D, E }, mid(A, C), { cens: { E: C, D: mid(A, C) } });
        return;
      }
      if (cx.review ? st >= 1 : true) { aTag(b, [A, B, C], M.S1, 'sky'); aTag(b, [A, C, D], M.S2, 'green'); }
      if (showE && (cx.review ? st >= 3 : true)) { fillPoly(b, [A, C, E], 'green', 0.12); T(b, aceAt(M), `${M.S2}`, { size: 16, color: 'green' }); }
      if (cx.review ? st >= 4 : true) fillPoly(b, abe, 'amber', 0.1);
      dotsN(b, { A, B, C, D }, mid(A, C), { cens: { D: mid(A, C) } });
      b.point(E, { color: 'amber', r: 4.5 }); tagOut(b, E, C, 'E', { size: 17, gap: 11, color: 'amber' });
      if (!cx.review) b.handle('D', D, { color: 'amber', r: 8, ariaLabel: '꼭짓점 D 가로로 끌기', drag: (w2) => { s.qeDx = clamp(Math.round(w2.x), 1, M.L - 1); } });
      void cen;
      const cap = cx.review ? ['대각선 AC를 그어 △ABC와 △ACD로 나눠요', 'D를 지나 AC에 평행한 직선과 BC의 연장선이 만나는 점을 E라 해요', `△ACD = △ACE = ${M.S2} (밑변 AC, 높이 ${M.h2}로 같아요)`, `□ABCD = △ABC+△ACD = △ABC+△ACE = △ABE = ${M.tot}`][clamp(st, 1, 4) - 1] : `□ABCD = ${M.S1}+${M.S2} = ${M.tot} = △ABE`;
      capLine(b, pt((M.L + 3.4) / 2, 5.4), cap, 'amber', { dy: 34 });
    },
    steps: (M) => [
      `대각선 AC를 그어 사각형 ABCD를 △ABC=${M.S1}와 △ACD=${M.S2}로 나눠요. (△ABC=$\\frac{1}{2}$×${M.L}×${M.h1}, △ACD=$\\frac{1}{2}$×${M.L}×${M.h2})`,
      '점 D를 지나 AC에 평행한 직선을 긋고, 변 BC의 연장선과 만나는 점을 E라 해요. (AC∥DE)',
      `△ACD와 △ACE는 밑변 AC가 같고, AC∥DE이므로 높이(${M.h2})도 같아요. 그래서 △ACD=△ACE=${M.S2}예요.`,
      `□ABCD=△ABC+△ACD=△ABC+△ACE=△ABE=${M.S1}+${M.S2}=${M.tot}예요. 사각형을 넓이가 같은 삼각형으로 바꿨어요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 D</b>를 가로로 끌어 보세요. D가 평행선 위를 움직이면 △ACD의 넓이는 <b>변하지 않아요</b>. 막대로 밑변과 높이를 바꾸면 넓이가 다시 계산돼요.',
      readouts: [rd('△ABC', `${M.S1}`, 'sky', `${M.L}×${M.h1}÷2`), rd('△ACD', `${M.S2}`, 'green', `${M.L}×${M.h2}÷2`), rd('△ACE', `${M.S2}`, 'green', '= △ACD'), rd('□ABCD = △ABE', `${M.tot}`, 'amber', `${M.S1} + ${M.S2}`, null, true)],
      formula: `<p>$${tri('ACD')}=${tri('ACE')}$ (밑변 $${ll('AC')}$ 공통, $${ll('AC')}\\parallel${ll('DE')}$)</p><p>$\\square ABCD=${tri('ABC')}+${tri('ACD')}=${tri('ABC')}+${tri('ACE')}=${tri('ABE')}=${M.tot}$</p>`,
      rule: '밑변이 같고 높이가 같은(평행선 사이에 있는) 두 삼각형의 넓이는 같다 → 사각형을 넓이가 같은 삼각형으로 바꿀 수 있다',
      notes: notes('<b>평행선</b>을 그어 높이가 같은 삼각형을 만들어요. D가 평행선 위 어디에 있어도 △ACD의 넓이는 같아요.', 'E는 변 BC의 <b>연장선</b> 위에 있어요. 삼각형 ABE의 넓이는 △ABC와 △ACE의 합이에요.')
    }),
    prob: (M) => {
      const { S1, S2, tot, K } = M;
      if (K === 0) return { tag: '넓이가 같은 삼각형', key: `t0_${S1}_${S2}`, stem: `그림에서 AC∥DE이다. △ABC의 넓이가 ${S1}, △ACD의 넓이가 ${S2}일 때, △ABE의 넓이 x는?`, choices: mkChoices(tot, [[S1, '△ABC만 구했어요. △ABE=△ABC+△ACE예요.'], [S2, '△ACD만 구했어요.'], [Math.abs(S1 - S2) || S1 + 1, '차를 구했어요. 합이에요.'], [S1 * S2 % 7 + tot + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 2 }) };
      if (K === 1) return { tag: '평행선과 넓이', key: `t1_${S2}`, stem: `그림에서 AC∥DE이고 △ACD의 넓이가 ${S2}일 때, △ACE의 넓이 x는?`, choices: mkChoices(S2, [[S2 * 2, '두 배가 아니에요. 밑변과 높이가 같아 넓이가 같아요.'], [M.S1, '△ABC의 넓이예요.'], [tot, '△ABE의 넓이예요.'], [S2 + 2, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 2 }) };
      return { tag: '넓이가 같은 삼각형', key: `t2_${tot}_${S1}`, stem: `그림에서 AC∥DE이다. △ABE의 넓이가 ${tot}, △ABC의 넓이가 ${S1}일 때, △ACD의 넓이 x는?`, choices: mkChoices(S2, [[tot, '△ABE의 넓이예요.'], [S1, '△ABC의 넓이예요.'], [tot + S1, '더했어요.'], [S2 + 2, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 2 }) };
    }
  };
  const L2 = (M) => M.L;

  /* ====================================================================== 2. 평행선 위의 꼭짓점과 넓이의 비 */
  const slide = {
    id: 'q5-2', title: '평행선 위에서 꼭짓점을 옮겨도 넓이는 같다', short: '평행선 사이 삼각형',
    question: '△ABC에서 꼭짓점 A를 밑변 BC와 평행한 직선 위에서 옮기면 넓이는 어떻게 될까? 변 BC 위의 점 D가 밑변을 m : n으로 나누면 두 삼각형의 넓이의 비는?',
    ctl: ['qeM', 'qeN', 'qeH'],
    init: (s) => { s.qeM = 2; s.qeN = 3; s.qeH = 4; s.qeAx = 1.5; s.qeK = 0; },
    reroll: (s) => { s.qeM = rint(1, 6); s.qeN = pick([1, 2, 3, 4, 5, 6].filter((x) => x !== s.qeM), s.qeN); s.qeH = pick([2, 4, 6], s.qeH); s.qeK = rint(0, 1); },
    model: (s) => {
      const m = ci(s.qeM, 1, 6), n = ci(s.qeN, 1, 6), h = ci(s.qeH, 2, 6), w = m + n, ax = clamp(Number(s.qeAx == null ? 1.5 : s.qeAx), -2, w + 2);
      return { m, n, h, w, S: (w * h) / 2, S1: (m * h) / 2, S2: (n * h) / 2, B: pt(0, 0), C: pt(w, 0), D: pt(m, 0), A: pt(ax, -h), K: s.qeK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D } = M, st = cx.step, tr = [A, B, C];
      fit(b, { x0: -2.4, x1: M.w + 3.4, y0: -M.h - 0.5, y1: 0 }, { t: 30, b: cx.problem ? 80 : 60, l: 36, r: 36 });
      fillPoly(b, tr, 'sky', 0.1); poly(b, tr, 'ink', 3.4);
      if (!cx.problem || true) { line(b, pt(-2.4, -M.h), pt(M.w + 3.4, -M.h), 'green', 2.2, { dash: [8, 6], alpha: 0.9 }); par(b, pt(-2.4, -M.h), pt(M.w + 3.4, -M.h), 1, 'green', 0.9); par(b, B, C, 1, 'green', 0.88); }
      line(b, A, D, 'amber', 3.2);
      if (cx.problem) {
        const k = M.K;
        if (k === 0) { sd(b, B, D, A, `${M.m}`, 'sky'); sd(b, D, C, A, `${M.n}`, 'sky'); T(b, pt(M.w / 2, 0), `△ABC의 넓이 = ${M.S}`, { size: b.W < 560 ? 15 : 17, color: 'sky', dy: 58, weight: 800 }); aTag(b, [A, B, D], 'x', 'rose', 20); }
        else { sd(b, B, D, A, `${M.m}`, 'sky'); sd(b, D, C, A, `${M.n}`, 'sky'); aTag(b, [A, B, D], M.S1, 'sky'); aTag(b, [A, D, C], 'x', 'rose', 20); }
        [['A', A, B], ['B', B, A], ['C', C, A], ['D', D, A]].forEach(([k2, q, c]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, k2 === 'D' ? A : mid(A, mid(B, C)), k2, { size: 17, gap: 11 }); void c; });
        return;
      }
      if (cx.review ? st >= 1 : true) { aTag(b, [A, B, D], M.S1, 'sky'); aTag(b, [A, D, C], M.S2, 'green'); fillPoly(b, [A, B, D], 'sky', 0.14); fillPoly(b, [A, D, C], 'green', 0.14); }
      sd(b, B, D, A, `${M.m}`, 'sky'); sd(b, D, C, A, `${M.n}`, 'green');
      T(b, pt(-1.9, -M.h / 2), `높이 ${M.h}`, { size: 14, color: 'amber' }); line(b, pt(-1.2, 0), pt(-1.2, -M.h), 'amber', 2, { alpha: 0.8 });
      [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([k2, q]) => { b.point(q, { color: k2 === 'A' ? 'amber' : 'ink', r: 4.5 }); tagOut(b, q, k2 === 'D' ? A : mid(A, mid(B, C)), k2, { size: 17, gap: 11 }); });
      if (!cx.review) b.handle('A', A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 가로로 끌기', drag: (w2) => { s.qeAx = clamp(Math.round(w2.x * 2) / 2, -2, M.w + 2); } });
      const cap = cx.review ? ['A가 BC에 평행한 직선 위에 있으면 높이가 같아요', `△ABD와 △ADC의 높이가 ${M.h}로 같아요`, `넓이의 비 = 밑변의 비 = ${M.m} : ${M.n}, △ABD=${M.S1}, △ADC=${M.S2}`][clamp(st, 1, 3) - 1] : `△ABD : △ADC = ${M.m} : ${M.n} = ${M.S1} : ${M.S2} · △ABC = ${M.S}`;
      capLine(b, pt(M.w / 2 + 2, 0), cap, 'amber', { dy: 46 });
    },
    steps: (M) => [
      `점 A가 밑변 BC와 평행한 직선 위에 있으면 A를 어디로 옮겨도 높이는 ${M.h}로 같아요. 그래서 △ABC의 넓이는 ${M.S}로 그대로예요.`,
      `△ABD와 △ADC는 높이(${M.h})가 같아요. 넓이는 밑변×높이÷2이므로 △ABD=$\\frac{1}{2}$×${M.m}×${M.h}=${M.S1}, △ADC=$\\frac{1}{2}$×${M.n}×${M.h}=${M.S2}예요.`,
      `높이가 같은 두 삼각형의 넓이의 비는 밑변의 비와 같아요. △ABD : △ADC = BD : DC = ${M.m} : ${M.n}이에요. (제곱이 아니에요!)`
    ],
    view: (M) => ({
      guide: '<b>노란 점 A</b>를 가로로 끌어 보세요. 평행선 위에서는 높이가 같아서 <b>넓이가 그대로</b>예요. 막대로 BD=m, DC=n을 바꾸면 <b>넓이의 비 = m : n</b>인 걸 볼 수 있어요.',
      readouts: [rd('△ABD', `${M.S1}`, 'sky', `$\\frac{1}{2}$×${M.m}×${M.h}`), rd('△ADC', `${M.S2}`, 'green', `$\\frac{1}{2}$×${M.n}×${M.h}`), rd('넓이의 비', `${M.m} : ${M.n}`, 'amber', '= 밑변의 비'), rd('△ABC', `${M.S}`, 'rose', '꼭짓점을 옮겨도 같아요')],
      formula: `<p>$${tri('ABD')}:${tri('ADC')}=${ll('BD')}:${ll('DC')}=${M.m}:${M.n}$</p><p>$${tri('ABD')}=\\frac{${M.m}}{${M.w}}\\times${tri('ABC')}=${M.S1}$</p>`,
      rule: '높이가 같은 두 삼각형의 넓이의 비는 밑변의 길이의 비와 같다 (m : n). 평행선 위에서 꼭짓점을 옮겨도 넓이는 변하지 않는다',
      notes: notes('넓이의 비는 밑변의 비 <b>그대로</b>예요. 제곱하지 않아요.', '높이가 같으려면 <b>꼭짓점이 밑변과 평행한 직선 위</b>에 있어야 해요.')
    }),
    prob: (M) => {
      const { m, n, S, S1, S2, w, K } = M;
      if (K === 0) return { tag: '넓이의 비', key: `s0_${m}_${n}_${S}`, stem: `△ABC의 넓이가 ${S}이고 변 BC 위의 점 D에 대하여 BD : DC = ${m} : ${n}일 때, △ABD의 넓이 x는?`, choices: mkChoices(S1, [[S2, '△ADC의 넓이예요. △ABD는 BD에 해당하는 넓이예요.'], [(S * m * m) / (w * w) % 1 === 0 ? (S * m * m) / (w * w) : S1 + 1, '제곱의 비로 구했어요. 넓이의 비는 밑변의 비 그대로예요.'], [S / 2, '반으로 나눴어요. m : n으로 나눠야 해요.'], [S - S1 + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
      return { tag: '넓이의 비', key: `s1_${m}_${n}_${S1}`, stem: `변 BC 위의 점 D에 대하여 BD : DC = ${m} : ${n}이고 △ABD의 넓이가 ${S1}일 때, △ADC의 넓이 x는?`, choices: mkChoices(S2, [[S, '△ABC 전체의 넓이예요.'], [S1, '△ABD의 넓이예요.'], [S1 * n * n / (m * m) % 1 === 0 ? (S1 * n * n) / (m * m) : S2 + 1, '제곱의 비로 구했어요.'], [S2 + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
    }
  };

  /* ====================================================================== 3. 사다리꼴의 대각선과 네 삼각형 */
  const butterfly = {
    id: 'q5-3', title: '사다리꼴의 대각선으로 나뉜 네 삼각형', short: '사다리꼴 대각선',
    question: 'AD∥BC인 사다리꼴 ABCD의 두 대각선이 점 O에서 만나면 △ABO와 △DCO의 넓이는 어떤 관계일까?',
    ctl: ['qeA', 'qeB', 'qeK'],
    init: (s) => { s.qeA = 1; s.qeB = 4; s.qeK = 1; s.qeKk = 0; },
    reroll: (s) => { s.qeA = rint(1, 3); s.qeB = rint(4, 6); s.qeK = rint(1, 2); s.qeKk = rint(0, 1); },
    model: (s) => {
      const m = ci(s.qeA, 1, 3), n = ci(s.qeB, 4, 6), k = ci(s.qeK, 1, 2), u = 7.2 / n, h = 3.6;
      const B = pt(0, 0), C = pt(n * u, 0), A = pt(1.1, -h), D = pt(1.1 + m * u, -h), O = inter(A, C, B, D);
      return { m, n, k, A, B, C, D, O, up: m * m * k, dn: n * n * k, side: m * n * k, K: s.qeKk || 0, dbc: n * k * (m + n) };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, O } = M, st = cx.step, quad = [A, B, C, D];
      fit(b, { x0: -0.5, x1: 8.2, y0: -4.2, y1: 0 }, { t: 30, b: 70, l: 40, r: 40 });
      fillPoly(b, quad, 'sky', 0.08); poly(b, quad, 'ink', 3.4);
      par(b, A, D, 1, 'green'); par(b, B, C, 1, 'green');
      line(b, A, C, 'ink', 2.6); line(b, B, D, 'ink', 2.6);
      if (cx.problem) {
        const k = M.K;
        if (k === 0) { poly(b, [D, B, C], 'amber', 3, { dash: [10, 6], alpha: 0.9 }); aTag(b, [B, O, C], M.dn, 'sky'); T(b, pt(4, 0), `△DBC의 넓이 = ${M.dbc}`, { dy: 40, size: b.W < 560 ? 15 : 17, color: 'amber' }); aTag(b, [A, B, O], 'x', 'rose', 20); }
        else { aTag(b, [A, B, O], M.side, 'sky'); aTag(b, [D, O, C], 'x', 'rose', 20); }
        dotsN(b, { A, B, C, D }, O); b.point(O, { color: 'ink', r: 4.5 }); T(b, O, 'O', { dx: 10, dy: -14, size: 16 });
        return;
      }
      const tAOD = [A, O, D], tAOB = [A, B, O], tBOC = [B, C, O], tDOC = [D, O, C];
      if (cx.review ? st >= 1 : true) { fillPoly(b, tAOB, 'amber', 0.2); fillPoly(b, tDOC, 'amber', 0.2); }
      if (cx.review ? st >= 3 : false) { fillPoly(b, tAOD, 'green', 0.2); fillPoly(b, tBOC, 'rose', 0.14); }
      aTag(b, tAOD, M.up, 'green'); aTag(b, tAOB, M.side, 'amber'); aTag(b, tDOC, M.side, 'amber'); aTag(b, tBOC, M.dn, 'rose');
      dotsN(b, { A, B, C, D }, O); b.point(O, { color: 'amber', r: 5 }); T(b, O, 'O', { dx: 10, dy: -14, size: 16, color: 'amber' });
      const cap = cx.review ? ['AD∥BC이므로 △ABD=△ACD (밑변 AD 공통, 높이 같음)', `공통인 △AOD를 빼면 △ABO=△DCO=${M.side}`, `AO : OC = ${M.m} : ${M.n}이므로 △AOD : △AOB : △BOC = ${M.m}² : ${M.m * M.n} : ${M.n}²`][clamp(st, 1, 3) - 1] : `△ABO=△DCO=${M.side} · 위 ${M.up} × 아래 ${M.dn} = ${M.side} × ${M.side}`;
      capLine(b, pt(3.8, 0), cap, 'amber', { dy: 46 });
    },
    stepT: () => 0,
    steps: (M) => [
      'AD∥BC이므로 △ABD와 △ACD는 밑변 AD가 같고 높이도 같아서 넓이가 같아요. △ABD=△ACD',
      `두 삼각형에서 공통인 △AOD를 빼면 △ABO=△DCO가 돼요. 이 넓이는 ${M.side}예요.`,
      `AO : OC = AD : BC = ${M.m} : ${M.n}이에요. 높이가 같은 △AOD, △AOB, △BOC의 넓이의 비는 밑변의 비이므로 ${M.up} : ${M.side} : ${M.dn}이고, (위)×(아래)=${M.up}×${M.dn}=${M.side}×${M.side}예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AO : OC</b>와 넓이의 단위를 바꿔 보세요. 양옆의 두 삼각형 △ABO와 △DCO의 넓이는 늘 <b>같아요</b>. 위쪽×아래쪽 = 옆쪽×옆쪽도 성립해요.',
      readouts: [rd('△AOD (위)', `${M.up}`, 'green'), rd('△BOC (아래)', `${M.dn}`, 'rose'), rd('△ABO = △DCO', `${M.side}`, 'amber', '양옆'), rd('△DBC', `${M.dbc}`, 'sky', `${M.side} + ${M.dn}`)],
      formula: `<p>$${tri('ABO')}=${tri('DCO')}$ (△ABD=△ACD에서 △AOD를 뺀 것)</p><p>$${tri('AOD')}\\times${tri('BOC')}=${M.up}\\times${M.dn}=${M.side}\\times${M.side}=${tri('ABO')}\\times${tri('DCO')}$</p>`,
      rule: 'AD∥BC인 사다리꼴에서 두 대각선의 교점을 O라 하면 △ABO=△DCO',
      notes: notes('같은 넓이인 것은 <b>양옆</b>의 두 삼각형이에요. 위(△AOD)와 아래(△BOC)는 같지 않아요.', '△DBC=△DOC+△BOC예요. △OBC만 알면 △DOC=△DBC−△OBC로 구해요.')
    }),
    prob: (M) => {
      const { side, dbc, dn, up } = M;
      if (M.K === 0) return { tag: '사다리꼴 대각선과 넓이', key: `b0_${dbc}_${dn}`, stem: `AD∥BC인 사다리꼴 ABCD에서 두 대각선의 교점을 O라 하자. △DBC의 넓이가 ${dbc}, △OBC의 넓이가 ${dn}일 때, △ABO의 넓이 x는?`, choices: mkChoices(side, [[dbc, '△DBC의 넓이 그대로예요.'], [dn, '△OBC의 넓이예요.'], [dbc + dn, '더했어요. △DOC=△DBC−△OBC=△ABO예요.'], [side + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
      return { tag: '사다리꼴 대각선과 넓이', key: `b1_${side}_${up}`, stem: `AD∥BC인 사다리꼴 ABCD에서 두 대각선의 교점을 O라 하자. △ABO의 넓이가 ${side}일 때, △DCO의 넓이 x는?`, choices: mkChoices(side, [[up, '△AOD의 넓이예요. 같은 것은 양옆의 삼각형이에요.'], [dn, '△BOC의 넓이예요.'], [side * 2, '두 배가 아니에요.'], [side + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
    }
  };

  /* ====================================================================== 4. 평행사변형 내부의 점 P */
  const insideP = {
    id: 'q5-4', title: '평행사변형 내부의 한 점 P', short: '내부의 점 P',
    question: '평행사변형 ABCD의 내부에 점 P를 잡으면 네 삼각형의 넓이 사이에 어떤 관계가 있을까?',
    ctl: ['qeW', 'qeHp'],
    init: (s) => { s.qeW = 6; s.qeHp = 4; s.qeI = 2; s.qeJ = 1; s.qeK = 0; },
    reroll: (s) => { s.qeW = pick([4, 6, 8], s.qeW); s.qeHp = pick([4, 6], s.qeHp); s.qeI = rint(1, s.qeW - 1); s.qeJ = rint(1, s.qeHp - 1); s.qeK = rint(0, 1); },
    model: (s) => {
      const w = ci(s.qeW, 4, 8), h = ci(s.qeHp, 4, 6), i = clamp(Math.round(s.qeI == null ? 2 : s.qeI), 1, w - 1), j = clamp(Math.round(s.qeJ == null ? 1 : s.qeJ), 1, h - 1), sk = 2;
      const B = pt(0, 0), C = pt(w, 0), A = pt(sk, -h), D = pt(sk + w, -h), Pp = pt(i + (sk * j) / h, -j);
      const bot = (w * j) / 2, top = (w * (h - j)) / 2, lf = (h * i) / 2, rt = (h * (w - i)) / 2;
      return { w, h, i, j, sk, A, B, C, D, P: Pp, bot, top, lf, rt, S: w * h, half: (w * h) / 2, K: s.qeK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, P: Pp } = M, st = cx.step, pts = [A, B, C, D];
      fit(b, { x0: -0.4, x1: M.w + 2.4, y0: -M.h - 0.3, y1: 0 }, { t: 30, b: 70, l: 40, r: 40 });
      fillPoly(b, pts, 'sky', 0.08); poly(b, pts, 'ink', 3.4);
      [[Pp, A], [Pp, B], [Pp, C], [Pp, D]].forEach(([p0, q]) => line(b, p0, q, 'ink', 2.6));
      const tL = [Pp, A, B], tB = [Pp, B, C], tR = [Pp, C, D], tT = [Pp, D, A];
      if (cx.problem) {
        const k = M.K;
        if (k === 0) { aTag(b, tL, M.lf, 'sky'); aTag(b, tR, 'x', 'rose', 20); T(b, mid(B, C), `□ABCD = ${M.S}`, { dy: 22, size: 15, color: 'sky' }); }
        else { aTag(b, tL, M.lf, 'sky'); aTag(b, tR, M.rt, 'sky'); aTag(b, tB, M.bot, 'sky'); aTag(b, tT, 'x', 'rose', 20); }
        dotsN(b, { A, B, C, D }, Pp); b.point(Pp, { color: 'ink', r: 4.5 }); T(b, Pp, 'P', { dx: 10, dy: -14, size: 16 });
        return;
      }
      const show = (n) => (cx.review ? st >= n : true);
      if (show(1)) { fillPoly(b, tT, 'amber', 0.22); fillPoly(b, tB, 'amber', 0.22); }
      if (show(2)) { fillPoly(b, tL, 'green', 0.22); fillPoly(b, tR, 'green', 0.22); }
      aTag(b, tT, M.top, 'amber'); aTag(b, tB, M.bot, 'amber'); aTag(b, tL, M.lf, 'green'); aTag(b, tR, M.rt, 'green');
      dotsN(b, { A, B, C, D }, Pp); b.point(Pp, { color: 'amber', r: 5 }); T(b, Pp, 'P', { dx: 10, dy: -14, size: 16, color: 'amber' });
      if (!cx.review) b.handle('P', Pp, { color: 'amber', r: 8, ariaLabel: '점 P 끌기', drag: (w2) => { const j2 = clamp(Math.round(-w2.y), 1, M.h - 1); s.qeJ = j2; s.qeI = clamp(Math.round(w2.x - (M.sk * j2) / M.h), 1, M.w - 1); } });
      const cap = cx.review ? [`BC=${M.w}, 높이 ${M.h}이므로 평행사변형의 넓이는 ${M.S}`, `위 ${M.top} + 아래 ${M.bot} = ${M.top + M.bot} = 전체의 절반`, `왼쪽 ${M.lf} + 오른쪽 ${M.rt} = ${M.lf + M.rt} = 전체의 절반`][clamp(st, 1, 3) - 1] : `위 ${M.top}+아래 ${M.bot} = 왼쪽 ${M.lf}+오른쪽 ${M.rt} = ${M.half}`;
      capLine(b, pt(M.w / 2 + 1, 0), cap, 'amber', { dy: 44 });
    },
    steps: (M) => [
      `평행사변형 ABCD의 넓이는 BC×높이=${M.w}×${M.h}=${M.S}예요.`,
      `△PAD와 △PBC는 밑변 AD, BC가 같고 높이의 합이 평행사변형의 높이(${M.h})예요. 그래서 △PAD+△PBC=$\\frac{1}{2}$×${M.w}×${M.h}=${M.half} (=${M.top}+${M.bot})`,
      `같은 이유로 △PAB+△PCD=$\\frac{1}{2}$×(평행사변형의 넓이)=${M.half} (=${M.lf}+${M.rt})예요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 P</b>를 평행사변형 안에서 끌어 보세요. P가 어디에 있어도 <b>위+아래 = 왼쪽+오른쪽 = 전체의 절반</b>이에요.',
      readouts: [rd('위 + 아래', `${M.top} + ${M.bot} = ${M.top + M.bot}`, 'amber'), rd('왼쪽 + 오른쪽', `${M.lf} + ${M.rt} = ${M.lf + M.rt}`, 'green'), rd('평행사변형 넓이', `${M.S}`, 'sky'), rd('전체의 절반', `${M.half}`, 'rose', `$\\frac{1}{2}$×${M.S}`)],
      formula: `<p>$${tri('PAD')}+${tri('PBC')}=${tri('PAB')}+${tri('PCD')}=\\frac{1}{2}\\square ABCD=${M.half}$</p>`,
      rule: '평행사변형 내부의 한 점 P에 대하여 △PAB+△PCD = △PBC+△PDA = $\\frac{1}{2}$×□ABCD',
      notes: notes('마주 보는 두 삼각형의 넓이의 합이 같아요. <b>위+아래</b>와 <b>왼쪽+오른쪽</b>이 각각 절반이에요.', '점 P를 직선 AD, BC에 평행한 위치로 옮겨도 합은 변하지 않아요.')
    }),
    prob: (M) => {
      const { S, half, lf, rt, bot, top, K } = M;
      if (K === 0) return { tag: '내부의 점과 넓이', key: `p0_${S}_${lf}`, stem: `평행사변형 ABCD의 넓이가 ${S}이고 내부의 한 점 P에 대하여 △PAB의 넓이가 ${lf}일 때, △PCD의 넓이 x는?`, choices: mkChoices(rt, [[half, '전체의 절반이에요. △PAB+△PCD=절반이에요.'], [S - lf, '전체에서 뺐어요. 절반에서 빼요.'], [lf, '△PAB와 같게 구했어요.'], [rt + 2, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
      return { tag: '내부의 점과 넓이', key: `p1_${lf}_${rt}_${bot}`, stem: `평행사변형 ABCD의 내부의 한 점 P에 대하여 △PAB=${lf}, △PCD=${rt}, △PBC=${bot}일 때, △PDA의 넓이 x는?`, choices: mkChoices(top, [[lf + rt, '△PAB+△PCD의 값이에요. 이 값에서 △PBC를 빼요.'], [lf + rt + bot, '모두 더했어요.'], [Math.abs(lf - bot), '값을 다시 확인해 보세요.'], [top + 2, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
    }
  };

  /* ====================================================================== 5. 변 위의 점 E */
  const heightSplit = {
    id: 'q5-5', title: '평행사변형의 변 위의 점 E', short: '변 위의 점 E',
    question: '평행사변형 ABCD의 변 AD 위에 점 E를 잡으면 △EBC의 넓이는 얼마일까? E의 위치를 바꾸면?',
    ctl: ['qeW', 'qeHp', 'qeE'],
    init: (s) => { s.qeW = 6; s.qeHp = 4; s.qeE = 2; s.qeK = 0; },
    reroll: (s) => { s.qeW = pick([4, 6, 8], s.qeW); s.qeHp = pick([4, 6], s.qeHp); s.qeE = rint(1, s.qeW - 1); s.qeK = rint(0, 2); },
    model: (s) => {
      const w = ci(s.qeW, 4, 8), h = ci(s.qeHp, 4, 6), e = clamp(ci(s.qeE, 1, 7), 1, w - 1), sk = 2;
      const B = pt(0, 0), C = pt(w, 0), A = pt(sk, -h), D = pt(sk + w, -h), E = pt(sk + e, -h);
      return { w, h, e, sk, A, B, C, D, E, S: w * h, half: (w * h) / 2, abe: (e * h) / 2, ecd: ((w - e) * h) / 2, K: s.qeK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, E } = M, st = cx.step, pts = [A, B, C, D];
      fit(b, { x0: -0.4, x1: M.w + 2.4, y0: -M.h - 0.3, y1: 0 }, { t: 30, b: 70, l: 40, r: 40 });
      fillPoly(b, pts, 'sky', 0.08); poly(b, pts, 'ink', 3.4);
      line(b, E, B, 'ink', 2.6); line(b, E, C, 'ink', 2.6);
      const tBC = [E, B, C], tL = [E, A, B], tR = [E, D, C];
      if (cx.problem) {
        const k = M.K;
        if (k === 0) { aTag(b, tBC, 'x', 'rose', 20); T(b, mid(B, C), `□ABCD = ${M.S}`, { dy: 22, size: 15, color: 'sky' }); }
        else if (k === 1) { aTag(b, tL, M.abe, 'sky'); aTag(b, tR, M.ecd, 'sky'); T(b, mid(B, C), 'x = □ABCD의 넓이', { dy: 22, size: 15, color: 'rose' }); }
        else { aTag(b, tL, M.abe, 'sky'); aTag(b, tR, 'x', 'rose', 20); T(b, mid(B, C), `□ABCD = ${M.S}`, { dy: 22, size: 15, color: 'sky' }); }
        dotsN(b, { A, B, C, D }, mid(A, C)); b.point(E, { color: 'ink', r: 4.5 }); T(b, E, 'E', { dy: -16, size: 17 });
        return;
      }
      const show = (n) => (cx.review ? st >= n : true);
      if (show(1)) fillPoly(b, tBC, 'amber', 0.22);
      if (show(2)) { fillPoly(b, tL, 'green', 0.18); fillPoly(b, tR, 'green', 0.18); }
      aTag(b, tBC, M.half, 'amber'); aTag(b, tL, M.abe, 'green'); aTag(b, tR, M.ecd, 'green');
      sd(b, A, E, mid(B, C), `${M.e}`, 'green'); sd(b, E, D, mid(B, C), `${M.w - M.e}`, 'green');
      dotsN(b, { A, B, C, D }, mid(A, C)); b.point(E, { color: 'amber', r: 5 }); T(b, E, 'E', { dy: -16, size: 17, color: 'amber' });
      if (!cx.review) b.handle('E', E, { color: 'amber', r: 8, ariaLabel: '점 E 가로로 끌기', drag: (w2) => { s.qeE = clamp(Math.round(w2.x - M.sk), 1, M.w - 1); } });
      const cap = cx.review ? [`BC=${M.w}, 높이 ${M.h}이므로 평행사변형의 넓이는 ${M.S}`, `△EBC의 밑변 BC, 높이 ${M.h} → 넓이 ${M.half} = 전체의 절반`, `△ABE+△ECD = ${M.abe}+${M.ecd} = ${M.half}`][clamp(st, 1, 3) - 1] : `△EBC = ${M.half} = 전체의 절반 · E가 어디에 있어도 같아요`;
      capLine(b, pt(M.w / 2 + 1, 0), cap, 'amber', { dy: 44 });
    },
    steps: (M) => [
      `평행사변형 ABCD의 넓이는 BC×높이=${M.w}×${M.h}=${M.S}예요.`,
      `△EBC는 평행사변형과 밑변 BC(${M.w})와 높이(${M.h})가 같아요. 그래서 △EBC=$\\frac{1}{2}$×${M.w}×${M.h}=${M.half}으로, E의 위치와 상관없이 전체의 절반이에요.`,
      `나머지 △ABE+△ECD도 전체의 절반이에요. △ABE=$\\frac{1}{2}$×${M.e}×${M.h}=${M.abe}, △ECD=$\\frac{1}{2}$×${M.w - M.e}×${M.h}=${M.ecd}, 합은 ${M.half}예요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 E</b>를 가로로 끌어 보세요. E가 변 AD 위 어디에 있어도 <b>△EBC의 넓이는 평행사변형의 절반</b>이에요.',
      readouts: [rd('평행사변형 넓이', `${M.S}`, 'sky'), rd('△EBC', `${M.half}`, 'amber', `$\\frac{1}{2}$×${M.S}`), rd('△ABE', `${M.abe}`, 'green'), rd('△ECD', `${M.ecd}`, 'green'), rd('△ABE + △ECD', `${M.half}`, 'rose', '', null, true)],
      formula: `<p>$${tri('EBC')}=\\frac{1}{2}\\times\\square ABCD=\\frac{1}{2}\\times${M.S}=${M.half}$</p><p>$${tri('ABE')}+${tri('ECD')}=${M.abe}+${M.ecd}=${M.half}$</p>`,
      rule: '평행사변형의 한 변을 밑변으로 하고, 마주 보는 변 위에 꼭짓점이 있는 삼각형의 넓이는 평행사변형의 넓이의 절반이다',
      notes: notes('점 E가 변 AD 위 <b>어디에 있어도</b> △EBC의 넓이는 같아요. (높이가 평행사변형의 높이와 같아요.)', '△ABE와 △ECD는 E의 위치에 따라 달라지지만 둘의 합은 늘 절반이에요.')
    }),
    prob: (M) => {
      const { S, half, abe, ecd, K } = M;
      if (K === 0) return { tag: '변 위의 점과 넓이', key: `e0_${S}`, stem: `평행사변형 ABCD의 넓이가 ${S}이고 변 AD 위의 점 E에 대하여 △EBC의 넓이 x는?`, choices: mkChoices(half, [[S, '평행사변형 전체의 넓이예요.'], [S / 4 % 1 === 0 ? S / 4 : half + 1, '절반이 아니라 4분의 1로 구했어요.'], [S / 3 % 1 === 0 ? S / 3 : half + 2, '3등분하지 않아요.'], [half + 2, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
      if (K === 1) return { tag: '변 위의 점과 넓이', key: `e1_${abe}_${ecd}`, stem: `평행사변형 ABCD의 변 AD 위의 점 E에 대하여 △ABE=${abe}, △ECD=${ecd}일 때, 평행사변형 ABCD의 넓이 x는?`, choices: mkChoices(S, [[abe + ecd, '△ABE+△ECD는 전체의 절반이에요. 2배 해야 해요.'], [(abe + ecd) * 4, '4배 했어요.'], [(abe + ecd) * 3, '3배 했어요.'], [S + 2, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 2, valid: (v) => v > 0 && Number.isInteger(v) }) };
      return { tag: '변 위의 점과 넓이', key: `e2_${S}_${abe}`, stem: `평행사변형 ABCD의 넓이가 ${S}이고 변 AD 위의 점 E에 대하여 △ABE=${abe}일 때, △ECD의 넓이 x는?`, choices: mkChoices(ecd, [[half, '전체의 절반(△EBC)이에요. △ABE+△ECD가 절반이에요.'], [S - abe, '전체에서 뺐어요. 절반에서 빼요.'], [abe, '△ABE와 같게 구했어요.'], [ecd + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1, valid: (v) => v > 0 && Number.isInteger(v) }) };
    }
  };

  const gl = [quadToTri, slide, butterfly, insideP, heightSplit];
  G.register(50, 'qd5', '⑤ 넓이가 같은 도형', '넓이가 같은 도형', PARAMS, gl);
})();
