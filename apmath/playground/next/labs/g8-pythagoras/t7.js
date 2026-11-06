/* ==========================================================================
   중2 · 피타고라스 정리 — 탭 ⑦ 「접기·최단거리」 (t7.js, order 70) — 장면 5개
   · py7-rect  직사각형의 꼭짓점 D 접기     · 접어도 길이가 같아요 → AE=AD, FE=FD, 직각삼각형 ABE·FEC
   · py7-tri   직각삼각형을 접어 B 를 A 에 포개기 · 접는 선은 AB 의 수직이등분선, AE=BE
   · py7-refl  직선 위의 점을 지나는 최단거리  · 한 점을 직선에 대해 대칭이동 → 일직선이 최단
   · py7-box   [심화] 직육면체의 겉면을 따라 가는 최단거리  · 전개도에서 직선 → 직각삼각형의 빗변 (x² 로)
   · py7-cyl   [심화] 원기둥의 옆면에 실 감기      · 옆면 전개도(직사각형)의 대각선 (π 가 없는 값)
   접는 움직임은 접는 선을 축으로 제자리에서 돌아요(가로·세로로 옮기지 않음). 값은 모두 지금의 길이로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G || !G.figRt) return;
  const { clamp, pt, add, sub, mul, mid, lerp, unit, len, T, sideTag, tick, line, poly, fillPoly, ang, fit, P, mkChoices, rd, notes, fmtN, pick, rint, bboxOf, centroid, ratOf, texRat, plainRat, isSqN, isq, tagOut, cenOf } = G;
  const PI = Math.PI;

  const FOLD_TAB = [[3, 5], [4, 5], [6, 10], [8, 10], [5, 13], [12, 13], [9, 15], [12, 15], [8, 17], [15, 17], [12, 20], [16, 20]]; // [AB, AD] (AD² − AB² 이 제곱수)
  const PARAMS = {
    pyFi: P('직사각형 고르기', 0, FOLD_TAB.length - 1, 1, 6, { color: 'amber', hint: '(AB, AD) — BE가 정수가 되는 직사각형', format: (v) => { const [h, w] = FOLD_TAB[clamp(Math.round(v), 0, FOLD_TAB.length - 1)]; return `${h}×${w}`; } }),
    pyFp: P('접기', 0, 1, 0.01, 0, { color: 'rose', hint: '막대를 끌면 접는 선을 축으로 접혀요', format: (v) => `${Math.round(v * 100)}%` }),
    pyGa: P('밑변 BC', 4, 25, 1, 8, { color: 'sky', format: (v) => `${v}` }),
    pyGb: P('높이 CA', 3, 24, 1, 6, { color: 'green', hint: '밑변보다 짧게 맞춰져요', format: (v) => `${v}` }),
    pyLd: P('두 발 사이 거리', 3, 24, 1, 12, { color: 'sky', format: (v) => `${v}` }),
    pyLp: P('A의 높이', 1, 14, 1, 3, { color: 'green', format: (v) => `${v}` }),
    pyLq: P('B의 높이', 1, 14, 1, 2, { color: 'rose', format: (v) => `${v}` }),
    pyLt: P('점 P의 위치', 0, 24, 0.1, 5, { color: 'amber', hint: '노란 점을 끌어도 돼요', format: (v) => fmtN(v) }),
    pyXa: P('가로 a', 1, 8, 1, 1, { color: 'sky', format: (v) => `${v}` }),
    pyXb: P('깊이 b', 1, 8, 1, 2, { color: 'green', format: (v) => `${v}` }),
    pyXc: P('높이 c', 1, 8, 1, 4, { color: 'rose', format: (v) => `${v}` }),
    pyCl: P('밑면의 둘레', 6, 24, 2, 12, { color: 'sky', format: (v) => `${v}` }),
    pyCh: P('원기둥의 높이', 3, 24, 1, 5, { color: 'amber', format: (v) => `${v}` })
  };
  // 접는 선(A1A2)을 축으로 점 Pt 를 p(0~1)만큼 접기: 축에서 떨어진 거리를 cos(πp)배
  function foldPt(Pt, A1, A2, p) {
    const d = unit(sub(A2, A1)), t = (Pt.x - A1.x) * d.x + (Pt.y - A1.y) * d.y, foot = add(A1, mul(d, t));
    const perp = sub(Pt, foot), k = Math.cos(PI * p);
    return add(foot, mul(perp, k));
  }
  const f = (v) => texRat(v);
  const fcl = (v) => texRat(v);

  /* ====================================================================== 1. 직사각형 접기 */
  const rectOf = (s) => {
    const [h, w] = FOLD_TAB[clamp(Math.round(s.pyFi), 0, FOLD_TAB.length - 1)];
    const be = isq(w * w - h * h), ec = w - be, x = (h * h + ec * ec) / (2 * h);
    return { h, w, be, ec, x, fc: h - x, p: clamp(s.pyFp || 0, 0, 1), kind: s.pyKind || 0 };
  };
  const frect = {
    id: 'py7-rect', title: '직사각형의 꼭짓점 D 접기', short: '직사각형 접기',
    question: '직사각형 ABCD를 선분 AF를 접는 선으로 하여 꼭짓점 D가 변 BC 위의 점 E에 오도록 접으면, 접어서 겹친 부분의 길이는 어떻게 될까?',
    ctl: ['pyFi', 'pyFp'],
    presets: () => [0, 0.5, 1].map((v, i) => ({ group: i === 0 ? '접는 정도' : '', label: v === 0 ? '펼침' : v === 1 ? '접음' : '반쯤', apply: (ss) => { ss.pyFp = v; }, on: (ss) => Math.abs((ss.pyFp || 0) - v) < 0.01 })),
    init: (s) => { s.pyFi = 6; s.pyFp = 0; s.pyKind = 0; },
    gen: (s, prev) => { let i, k; do { i = rint(0, FOLD_TAB.length - 1); k = rint(0, 2); } while (prev && prev.pyFi === i && prev.pyKind === k); return { pyFi: i, pyKind: k, pyFp: 1 }; },
    model: (s) => rectOf(s),
    draw(b, s, M, C) {
      const { h, w, be, ec, x, p, kind } = M, prob = C.problem;
      const A = pt(0, 0), D = pt(w, 0), B = pt(0, h), Cc = pt(w, h), E = pt(be, h), F = pt(w, x);
      fit(b, { x0: 0, x1: w, y0: 0, y1: h }, { t: 40, b: 44, l: 44, r: 40 });
      const st = (n) => !C.review || C.step >= n;
      const pp = prob ? 1 : C.review ? (C.step >= 1 ? 1 : 0) : p;
      const Dp = foldPt(D, A, F, pp);
      fillPoly(b, [A, B, Cc, D], 'ink', 0.06); poly(b, [A, B, Cc, D], 'ink', 3.2);
      // 접히는 부분(삼각형 A D F) — 접는 선 AF 를 축으로 제자리에서 돌아요
      fillPoly(b, [A, Dp, F], pp > 0.5 ? 'amber' : 'sky', 0.3); poly(b, [A, Dp, F], pp > 0.5 ? 'amber' : 'sky', 3);
      line(b, A, F, 'rose', 3.6);
      if (pp > 0.5) { line(b, A, D, 'muted', 2, { dash: [5, 5] }); line(b, D, F, 'muted', 2, { dash: [5, 5] }); }
      [[A, 'A', -1, -1], [B, 'B', -1, 1], [Cc, 'C', 1, 1], [D, 'D', 1, -1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 14, dy: dy * 15, size: 17 }); });
      b.point(F, { color: 'rose', r: 4.5 }); T(b, F, 'F', { dx: 14, dy: 0, size: 17, color: 'rose' });
      if (pp > 0.5) { b.point(Dp, { color: 'amber', r: 4.5 }); T(b, Dp, 'E', { dx: 0, dy: 17, size: 17, color: 'amber' }); b.right(Dp, A, F, { size: 10, color: 'amber' }); tick(b, A, D, 2, 'amber'); tick(b, A, Dp, 2, 'amber'); tick(b, D, F, 1, 'sky'); tick(b, Dp, F, 1, 'sky'); }
      b.right(B, A, Cc, { size: 10, color: 'ink' }); b.right(Cc, B, D, { size: 10, color: 'ink' });
      // 주어진 길이 (그림 안)
      sideTag(b, A, B, Cc, `${h}`, { color: 'green', size: 17, gap: 12 }); T(b, mid(A, D), `${w}`, { dy: -24, size: 17, color: 'sky' });
      if (!prob) {
        if (pp > 0.5) {
          T(b, mid(B, E), `${be}`, { dy: 16, size: 15, color: 'sky' }); T(b, mid(E, Cc), `${ec}`, { dy: 16, size: 15, color: 'green' });
          T(b, mid(Dp, F), `x=${f(x)}`, { dx: -22, dy: 0, size: 15, color: 'sky' }); T(b, mid(F, Cc), `${f(M.fc)}`, { dx: 14, size: 15, color: 'green' });
        }
      } else {
        // x 는 묻는 선분에만, 구하는 것이 아닌 값은 적지 않음
        if (kind === 0) T(b, mid(F, Cc), 'x', { dx: 14, size: 18, color: 'amber' });
        if (kind === 1) T(b, mid(Dp, F), 'x', { dx: -12, dy: -8, size: 18, color: 'amber' });
        if (kind === 2) T(b, mid(B, Dp), 'x', { dy: 16, size: 18, color: 'amber' });
      }
    },
    steps: (M) => [
      `$AB=${M.h}$, $AD=BC=${M.w}$예요. D를 E에 겹치도록 접었고, 구하는 선분은 ${M.kind === 0 ? 'FC' : M.kind === 1 ? 'FE' : 'BE'}예요.`,
      `접어도 길이는 같으므로 $AE=AD=${M.w}$, $FE=FD$예요. 직각삼각형 ABE를 먼저 찾아요.`,
      `$BE^2=AE^2-AB^2=${M.w}^2-${M.h}^2=${M.be * M.be}$이므로 $BE=${M.be}$예요.${M.kind === 2 ? '' : ` 또한 $EC=${M.w}-${M.be}=${M.ec}$예요.`}`,
      M.kind === 2 ? `BE는 밑변 BC의 일부이며, EC가 아니라 BE를 물었는지 확인해요.` : `$FE=FD=y$라 하면 $FC=${M.h}-y$예요. 직각삼각형 FEC에서 $y^2=(${M.h}-y)^2+${M.ec}^2$이므로 $y=${f(M.x)}$예요.`,
      M.kind === 0 ? `$FC=x=${M.h}-${f(M.x)}=${f(M.fc)}$예요.` : M.kind === 1 ? `$FE=x=${f(M.x)}$예요.` : `$BE=x=${M.be}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>직사각형</b>을 고르고 <b>접기</b> 막대를 끌어 보세요. 접힌 부분(삼각형 ADF)은 접는 선 AF를 축으로 돌아요. 접으면 <b>같은 길이</b>(AE=AD, FE=FD)가 생겨요.',
      readouts: [rd('BE', `${M.be}`, 'sky', `AE² − AB² = ${M.w * M.w} − ${M.h * M.h}`), rd('EC', `${M.ec}`, 'green', `${M.w} − ${M.be}`), rd('FD = FE = x', `$${f(M.x)}$`, 'amber', `(AB² + EC²) ÷ (2 × AB)`), rd('FC', `$${f(M.fc)}$`, 'rose', `${M.h} − x`)],
      status: { tone: 'info', text: `접기 ${Math.round(M.p * 100)}%` },
      formula: `<p>$BE=${M.be}$, $EC=${M.ec}$</p><p>$x^2=(${M.h}-x)^2+${M.ec}^2\\Rightarrow x=${f(M.x)}$, $FC=${f(M.fc)}$</p>`,
      rule: '접으면 겹치는 길이가 같다 → 직각삼각형을 찾아 피타고라스 정리로 x를 구한다',
      notes: notes('접은 선분 $FE$와 접히기 전 $FD$는 길이가 같아요. 같은 문자 $x$로 놓아요.', '직각삼각형이 <b>두 개</b>예요: $ABE$(BE를 구함), $FEC$(x를 구함). 순서대로 풀어요.')
    }),
    prob: (M) => {
      const { h, w, be, ec, x, fc, kind } = M;
      const cf = { tex: (v) => f(v), plain: (v) => plainRat(v), pad: 1 / 3 };
      const q = kind === 0 ? { ans: fc, tag: '[접기] FC의 길이', ask: `$\\overline{FC}$의 길이 $x$` } : kind === 1 ? { ans: x, tag: '[접기] FE의 길이', ask: `$\\overline{FE}$의 길이 $x$` } : { ans: be, tag: '[접기] BE의 길이', ask: `$\\overline{BE}$의 길이 $x$` };
      const wr = kind === 0 ? [[x, 'FD(=FE)의 길이예요. FC는 DC에서 x를 뺀 것이에요.'], [ec, 'EC의 길이예요.'], [be, 'BE의 길이예요.'], [fc + 1 / 3, '다시 계산해 보세요.'], [fc - 1 / 3, '다시 계산해 보세요.'], [h - ec, '다시 계산해 보세요.']]
        : kind === 1 ? [[fc, 'FC의 길이예요. FE는 FD와 같아요.'], [ec, 'EC의 길이예요.'], [h - ec, '다시 계산해 보세요.'], [x + 1 / 3, '다시 계산해 보세요.'], [x - 1 / 3, '다시 계산해 보세요.'], [be, 'BE의 길이예요.']]
          : [[ec, 'EC의 길이예요.'], [w - h, '길이의 차가 아니라 제곱의 차예요.'], [w, '접으면 AE=AD예요. BE는 직각삼각형 ABE로 구해요.'], [be + 1, '다시 계산해 보세요.'], [be - 1, '다시 계산해 보세요.'], [h, 'AB의 길이예요.']];
      return { tag: q.tag, key: `${kind}-${h}-${w}`, stem: `다음 그림과 같이 $\\overline{AB}=${h}$, $\\overline{AD}=${w}$인 직사각형 ABCD를 꼭짓점 D가 변 BC 위의 점 E에 오도록 접었다. 접는 선이 $\\overline{AF}$일 때, ${q.ask}는?`, choices: mkChoices(q.ans, wr, kind === 2 ? { tex: (v) => `${v}`, plain: (v) => `${v}` } : cf) };
    }
  };

  /* ====================================================================== 2. 직각삼각형 접어 B 를 A 에 */
  const ftOf = (s) => {
    const a = clamp(Math.round(s.pyGa), 4, 25), b = Math.min(clamp(Math.round(s.pyGb), 3, 24), a - 1); s.pyGb = b;
    const c2 = a * a + b * b, y = c2 / (2 * a), ce = a - y, ci = isSqN(c2) ? isq(c2) : null;
    return { a, b, c2, ci, y, ce, de: ci ? (b * ci) / (2 * a) : null, p: clamp(s.pyFp || 0, 0, 1), kind: s.pyKind || 0 };
  };
  const TRI_CHIPS = [[8, 6], [12, 5], [15, 8], [12, 9], [16, 12], [20, 15]];
  const ftri = {
    id: 'py7-tri', title: '직각삼각형을 접어 B를 A에 포개기', short: '삼각형 접기',
    question: '직각삼각형 ABC를 꼭짓점 B가 꼭짓점 A에 겹치도록 접으면 접는 선은 어디를 지날까? 접어서 생긴 선분의 길이는 어떻게 구할까?',
    ctl: ['pyGa', 'pyGb', 'pyFp'],
    presets: () => TRI_CHIPS.slice(0, 6).map(([a, b], i) => ({ group: i === 0 ? '빗변이 정수가 되는 (BC, CA)' : '', label: `${a}, ${b}`, apply: (ss) => { ss.pyGa = a; ss.pyGb = b; }, on: (ss) => ss.pyGa === a && ss.pyGb === b })),
    init: (s) => { s.pyGa = 8; s.pyGb = 6; s.pyFp = 0; s.pyKind = 0; },
    gen: (s, prev) => { let t, k; do { t = pick(TRI_CHIPS); k = rint(0, 2); } while (prev && prev.pyGa === t[0] && prev.pyGb === t[1] && prev.pyKind === k); return { pyGa: t[0], pyGb: t[1], pyKind: k, pyFp: 1 }; },
    model: (s) => ftOf(s),
    draw(b, s, M, C) {
      const { a, b: bb, y, ce, p, kind, ci } = M, prob = C.problem;
      const Cc = pt(0, 0), B = pt(a, 0), A = pt(0, -bb), D = mid(A, B), E = pt(a - y, 0);
      fit(b, { x0: 0, x1: a, y0: -bb, y1: 0 }, { t: 40, b: 46, l: 46, r: 40 });
      const st = (n) => !C.review || C.step >= n;
      const pp = prob ? 1 : C.review ? (C.step >= 1 ? 1 : 0) : p;
      const Bp = foldPt(B, D, E, pp);
      fillPoly(b, [A, B, Cc], 'ink', 0.06); poly(b, [A, B, Cc], 'ink', 3.2);
      fillPoly(b, [D, Bp, E], pp > 0.5 ? 'amber' : 'sky', 0.3); poly(b, [D, Bp, E], pp > 0.5 ? 'amber' : 'sky', 3);
      line(b, D, E, 'rose', 3.6);
      if (pp > 0.5) { line(b, D, B, 'muted', 2, { dash: [5, 5] }); line(b, E, B, 'muted', 2, { dash: [5, 5] }); }
      ang(b, Cc, B, A, { color: 'amber', r: 18 });
      [[A, 'A', -1, -1], [Cc, 'C', -1, 1], [B, 'B', 1, 1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 14, dy: dy * 15, size: 17 }); });
      b.point(D, { color: 'rose', r: 4.5 }); T(b, D, 'D', { dx: 10, dy: -14, size: 17, color: 'rose' }); b.point(E, { color: 'rose', r: 4.5 }); T(b, E, 'E', { dx: 0, dy: 17, size: 17, color: 'rose' });
      if (pp > 0.5) { tick(b, E, A, 2, 'amber'); tick(b, E, B, 2, 'amber'); tick(b, D, A, 1, 'sky'); tick(b, D, B, 1, 'sky'); b.right(D, E, A, { size: 10, color: 'rose' }); }
      // 길이는 그림 안에: AC, BC 는 문제에서도 주어진 값
      sideTag(b, Cc, A, B, `${bb}`, { color: 'green', size: 17, gap: 12 }); T(b, mid(Cc, B), `${a}`, { dy: 36, size: 17, color: 'sky' });
      if (!prob) {
        if (pp > 0.5) { T(b, mid(Cc, E), `${f(ce)}`, { dy: 16, size: 15, color: 'green' }); T(b, mid(E, B), `${f(y)}`, { dy: 16, size: 15, color: 'amber' }); }
        if (ci) T(b, lerp(A, B, 0.8), `${ci}`, { dx: 20, dy: -12, size: 16, color: 'ink' });
      } else {
        if (kind === 0) T(b, mid(Cc, E), 'x', { dy: 17, size: 18, color: 'amber' });
        if (kind === 1) T(b, mid(E, A), 'x', { dx: -14, dy: 0, size: 18, color: 'amber' });
        if (kind === 2) T(b, mid(D, E), 'x', { dx: 12, dy: 10, size: 18, color: 'amber' });
      }
    },
    steps: (M) => [
      `$BC=${M.a}$, $CA=${M.b}$, $\\angle C=90^\\circ$예요. B를 A에 겹치도록 접고 ${M.kind === 0 ? 'CE' : M.kind === 1 ? 'AE' : '접는 선 DE'}의 길이를 구해요.`,
      `접는 선 DE는 AB의 수직이등분선이에요. 따라서 $AE=BE$이고 $AD=BD$예요.`,
      M.kind === 2 ? `$AB^2=${M.a}^2+${M.b}^2=${M.c2}$이므로 $AB=${M.ci}$, $BD=\\frac{${M.ci}}{2}$예요.` : `$AE=BE=y$로 놓으면 $CE=${M.a}-y$예요. 직각삼각형 ACE에서 $y^2=(${M.a}-y)^2+${M.b}^2$예요.`,
      M.kind === 2 ? `$\\triangle BDE\\sim\\triangle BCA$이므로 $DE:CA=BD:BC$예요. 따라서 $DE=\\frac{${f(M.ci / 2)}\\times${M.b}}{${M.a}}$예요.` : `식을 정리하면 $2\\times${M.a}y=${M.a}^2+${M.b}^2=${M.c2}$이므로 $y=${f(M.y)}$예요.`,
      M.kind === 0 ? `$CE=x=${M.a}-${f(M.y)}=${f(M.ce)}$예요.` : M.kind === 1 ? `$AE=x=${f(M.y)}$예요.` : `$DE=x=${f(M.de)}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>BC, CA</b>를 바꾸고 <b>접기</b> 막대를 끌어 보세요. B가 A에 포개지면 접는 선 DE는 AB의 <b>수직이등분선</b>이에요. (CA < BC일 때 접는 선이 BC와 만나요)',
      readouts: [rd('AE = BE', `$${f(M.y)}$`, 'amber', `(${M.a}² + ${M.b}²) ÷ (2 × ${M.a})`), rd('CE', `$${f(M.ce)}$`, 'green', `${M.a} − AE`), rd('DE', M.de != null ? `$${f(M.de)}$` : '구할 수 없어요', 'rose', M.ci ? `${f(M.ci / 2)} × ${M.b} ÷ ${M.a}` : '')],
      status: { tone: 'info', text: `접기 ${Math.round(M.p * 100)}%` },
      formula: `<p>$y^2=(${M.a}-y)^2+${M.b}^2\\Rightarrow y=${f(M.y)}$, $CE=${f(M.ce)}$</p>`,
      rule: '접는 선은 포개지는 두 점을 잇는 선분의 수직이등분선 → AE=BE 로 직각삼각형 ACE',
      notes: notes('접는 선 위의 점에서 포개지는 두 점까지의 거리가 같아요: $AE=BE$.', '직각삼각형 <b>ACE</b>(직각은 C)의 빗변은 $AE$예요. $CE$가 아니에요.')
    }),
    prob: (M) => {
      const { a, b: bb, y, ce, de, kind } = M;
      const cf = { tex: (v) => f(v), plain: (v) => plainRat(v), pad: 1 / (2 * a) };
      const q = kind === 0 ? { ans: ce, tag: '[접기] CE의 길이', ask: '$\\overline{CE}$의 길이 $x$' } : kind === 1 ? { ans: y, tag: '[접기] AE의 길이', ask: '$\\overline{AE}$의 길이 $x$' } : { ans: de, tag: '[접기] 접는 선 DE의 길이', ask: '접는 선 $\\overline{DE}$의 길이 $x$' };
      const wr = kind === 0 ? [[y, 'AE(=BE)의 길이예요. CE는 BC에서 BE를 뺀 것이에요.'], [a - bb, '길이의 차가 아니라 제곱을 이용해요.'], [bb, 'AC의 길이예요.'], [ce + 1 / (2 * a), '다시 계산해 보세요.'], [ce - 1 / (2 * a), '다시 계산해 보세요.'], [a / 2, '다시 계산해 보세요.']]
        : kind === 1 ? [[ce, 'CE의 길이예요. AE=BE=BC−CE예요.'], [a - bb, '길이의 차가 아니라 제곱을 이용해요.'], [a / 2, '다시 계산해 보세요.'], [y + 1 / (2 * a), '다시 계산해 보세요.'], [y - 1 / (2 * a), '다시 계산해 보세요.'], [bb, 'AC의 길이예요.']]
          : [[y, 'AE의 길이예요.'], [ce, 'CE의 길이예요.'], [de + 1 / (2 * a), '다시 계산해 보세요.'], [de - 1 / (2 * a), '다시 계산해 보세요.'], [bb / 2, '다시 계산해 보세요.'], [M.ci / 2, 'BD의 길이예요.']];
      return { tag: q.tag, key: `${kind}-${a}-${bb}`, stem: `다음 그림과 같이 $\\angle C=90^\\circ$, $\\overline{BC}=${a}$, $\\overline{CA}=${bb}$인 직각삼각형 ABC를 꼭짓점 B가 꼭짓점 A에 오도록 접었다. 접는 선이 $\\overline{DE}$일 때, ${q.ask}는?`, choices: mkChoices(q.ans, wr, cf) };
    }
  };

  /* ====================================================================== 3. 직선 위의 점을 지나는 최단거리 */
  const REFL_CHIPS = [[12, 3, 2], [8, 4, 2], [15, 5, 3], [9, 7, 5], [5, 8, 4], [24, 4, 3], [20, 9, 6], [12, 2, 3]];
  const reflOf = (s) => {
    const d = clamp(Math.round(s.pyLd), 3, 24), p = clamp(Math.round(s.pyLp), 1, 14), q = clamp(Math.round(s.pyLq), 1, 14), t = clamp(s.pyLt == null ? 5 : s.pyLt, 0, d);
    const ap = Math.hypot(t, p), pb = Math.hypot(d - t, q), min2 = d * d + (p + q) * (p + q), tStar = (d * p) / (p + q);
    return { d, p, q, t, ap, pb, tot: ap + pb, min2, mini: isSqN(min2) ? isq(min2) : null, tStar, onBest: Math.abs(t - tStar) < 0.06 };
  };
  const refl = {
    id: 'py7-refl', title: '직선 위의 점을 지나는 최단거리', short: '직선 위 점의 최단거리',
    question: '직선 ℓ 위의 점 P를 지나 A에서 B로 갈 때, 가장 짧은 길은 P를 어디에 잡을 때일까?',
    ctl: ['pyLd', 'pyLp', 'pyLq', 'pyLt'],
    presets: (s) => [{ group: '위치', label: '최단 위치로', apply: (ss) => { const m = reflOf(ss); ss.pyLt = Math.round(m.tStar * 10) / 10; }, on: (ss) => reflOf(ss).onBest }].concat(REFL_CHIPS.slice(0, 6).map(([d, p, q], i) => ({ group: i === 0 ? '최단이 정수인 (거리, A, B 높이)' : '', label: `${d}, ${p}, ${q}`, apply: (ss) => { ss.pyLd = d; ss.pyLp = p; ss.pyLq = q; ss.pyLt = Math.round(((d * p) / (p + q)) * 10) / 10; }, on: (ss) => ss.pyLd === d && ss.pyLp === p && ss.pyLq === q }))),
    init: (s) => { s.pyLd = 12; s.pyLp = 3; s.pyLq = 2; s.pyLt = 5; },
    gen: (s, prev) => { let t; do { t = pick(REFL_CHIPS.slice(0, 7)); } while (prev && prev.pyLd === t[0] && prev.pyLp === t[1] && prev.pyLq === t[2]); return { pyLd: t[0], pyLp: t[1], pyLq: t[2], pyLt: Math.round(((t[0] * t[1]) / (t[1] + t[2])) * 10) / 10 }; },
    model: (s) => reflOf(s),
    draw(b, s, M, C) {
      const { d, p, q, t, ap, pb, tot, min2, mini, onBest } = M, prob = C.problem;
      const tt = prob ? d / 2 : t;
      const A = pt(0, -p), B = pt(d, -q), H = pt(0, 0), K = pt(d, 0), Pp = pt(tt, 0), A2 = pt(0, p);
      const showMirror = !prob && (!C.review || C.step >= 2);
      fit(b, { x0: -1, x1: d + 1, y0: -Math.max(p, q) - 0.2, y1: showMirror ? p + 0.4 : 1.4 }, { t: 40, b: 70, l: 36, r: 36 });
      const st = (n) => !C.review || C.step >= n;
      line(b, pt(-1, 0), pt(d + 1, 0), 'ink', 3); T(b, pt(d + 1, 0), 'ℓ', { dx: -4, dy: 16, size: 18 });
      line(b, A, H, 'muted', 2, { dash: [5, 5] }); line(b, B, K, 'muted', 2, { dash: [5, 5] }); b.right(H, K, A, { size: 9, color: 'ink' }); b.right(K, H, B, { size: 9, color: 'ink' });
      const best = prob ? false : onBest;
      line(b, A, Pp, best ? 'green' : 'sky', 4); line(b, Pp, B, best ? 'green' : 'sky', 4);
      if (showMirror) { line(b, A2, pt(d, -q), 'amber', 2.4, { dash: [6, 5] }); line(b, A, A2, 'muted', 1.6, { dash: [4, 5] }); b.point(A2, { color: 'amber', r: 4 }); T(b, A2, "A′", { dx: -16, dy: 4, size: 17, color: 'amber' }); }
      [[A, 'A', -1, -1], [B, 'B', 1, -1]].forEach(([q2, nm, dx, dy]) => { b.point(q2, { color: 'ink', r: 4.5 }); T(b, q2, nm, { dx: dx * 14, dy: dy * 14, size: 17 }); });
      if (prob) { b.point(Pp, { color: 'amber', r: 5 }); T(b, Pp, 'P', { dx: 0, dy: 17, size: 17, color: 'amber' }); }
      else b.handle('P', Pp, { color: 'amber', r: 8, ariaLabel: '점 P 끌기', drag: (w) => { s.pyLt = clamp(Math.round(w.x * 10) / 10, 0, d); } });
      if (!prob) T(b, Pp, 'P', { dx: 0, dy: 26, size: 16, color: 'amber' });
      // 길이: 그림 안
      T(b, mid(A, H), `${p}`, { dx: 12, size: 16, color: 'green' }); T(b, mid(B, K), `${q}`, { dx: 12, size: 16, color: 'rose' }); T(b, mid(H, K), `${d}`, { dy: 48, size: 16, color: 'sky' });
      if (!prob && C.txt) T(b, pt(d / 2, -Math.max(p, q) - 0.2), `AP+PB ${best && mini ? '=' : '≈'} ${best && mini ? mini : fmtN(Math.round(tot * 10) / 10)}`, { dy: -14, size: 18, color: best ? 'green' : 'sky' });
    },
    steps: (M) => [
      `A에서 직선 ℓ에 수선의 발 H, B에서 수선의 발 K를 내리면 $AH=${M.p}$, $BK=${M.q}$, $HK=${M.d}$예요.`,
      `직선 ℓ에 대한 A의 대칭점 A′을 잡으면 $A^{\\prime}P=AP$이므로 $AP+PB=A^{\\prime}P+PB$예요. 이 값이 가장 짧으려면 A′, P, B가 한 직선 위에 있어야 해요.`,
      `A′에서 B까지의 거리는 가로 ${M.d}, 세로 ${M.p}+${M.q}=${M.p + M.q}인 직각삼각형의 빗변이에요. $x^2=${M.d}^2+${M.p + M.q}^2=${M.min2}$${M.mini ? `, 최단거리 $x=${M.mini}$` : ''}예요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 P</b>를 끌거나 막대로 옮겨 보세요. 파란 선의 길이 AP+PB가 가장 짧을 때는 <b>대칭점 A′</b>과 B를 이은 직선 위에 P가 있을 때예요(초록). 칩은 최단거리가 정수인 경우예요.',
      readouts: [rd('AP + PB (지금)', `${fmtN(Math.round(M.tot * 10) / 10)}`, M.onBest ? 'green' : 'sky', '대략의 값'), rd('가장 짧은 값 x', M.mini ? `${M.mini}` : `x²=${M.min2}`, 'green', `${M.d}² + ${M.p + M.q}² = ${M.min2}`), rd('최단 위치 (H에서)', `$${f(M.tStar)}$`, 'amber', `${M.d} × ${M.p} ÷ ${M.p + M.q}`)],
      status: M.onBest ? { tone: 'ok', text: '가장 짧은 길이에요 (A′, P, B가 한 직선)' } : { tone: 'info', text: 'P를 움직여 가장 짧은 길을 찾아보세요' },
      formula: `<p>$x^2=${M.d}^2+(${M.p}+${M.q})^2=${M.min2}$</p>`,
      rule: '직선에 대해 한 점을 대칭이동하면, 대칭점과 다른 점을 잇는 선분이 최단거리',
      notes: notes('대칭점과 이은 선분의 세로 길이는 두 높이의 <b>합</b> ($p+q$)이에요. 차가 아니에요.', '두 점이 직선의 <b>같은 쪽</b>에 있을 때 대칭이동을 써요. 서로 반대쪽이면 그냥 일직선이 최단이에요.')
    }),
    prob: (M) => {
      const { d, p, q, min2, mini } = M;
      return { tag: '[최단거리] 직선 위의 점을 지나는 최단거리', key: `${d}-${p}-${q}`, stem: `다음 그림과 같이 직선 ℓ에서 점 A까지의 거리가 $${p}$, 점 B까지의 거리가 $${q}$이고 두 점에서 ℓ에 내린 수선의 발 사이의 거리가 $${d}$이다. ℓ 위의 점 P에 대하여 $\\overline{AP}+\\overline{PB}$의 최솟값은?`, choices: mkChoices(mini, [[Math.round(Math.sqrt(d * d + (p - q) * (p - q))), '두 높이의 차가 아니라 합을 써야 해요(대칭점을 쓸 때).'], [d + p + q, '길이의 합이 아니라 직각삼각형의 빗변이에요.'], [min2, '제곱한 값이에요.'], [mini + 1, '다시 계산해 보세요.'], [mini - 1, '다시 계산해 보세요.'], [d + Math.max(p, q), '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` }) };
    }
  };

  /* ====================================================================== 4. [심화] 직육면체 */
  const BOXES = [[1, 2, 4], [1, 5, 8], [2, 2, 3], [2, 4, 8], [3, 3, 8], [3, 5, 6], [4, 4, 6]];
  const boxOf = (s) => {
    const a = clamp(Math.round(s.pyXa), 1, 8), b = clamp(Math.round(s.pyXb), 1, 8), c = clamp(Math.round(s.pyXc), 1, 8);
    const v = [(b + c) * (b + c) + a * a, (a + b) * (a + b) + c * c, (a + c) * (a + c) + b * b]; // 0: 앞면+윗면, 1: 앞면+오른쪽면, 2: 왼쪽면+윗면
    const min = Math.min(...v); const best = v.indexOf(min);
    const route = s.pyRoute == null || s.pyRoute < 0 ? best : clamp(Math.round(s.pyRoute), 0, 2);
    return { a, b, c, v, min, best, route, mini: isSqN(min) ? isq(min) : null };
  };
  const ROUTE_NM = ['앞면 + 윗면', '앞면 + 오른쪽면', '왼쪽면 + 윗면'];
  const box = {
    id: 'py7-box', title: '[심화] 직육면체의 최단거리', short: '[심화] 직육면체',
    question: '직육면체의 꼭짓점 A에서 가장 먼 꼭짓점 G까지 겉면을 따라 가는 가장 짧은 길은? 전개도를 펼치면 직각삼각형의 빗변이 보인다.',
    ctl: ['pyXa', 'pyXb', 'pyXc'],
    presets: () => [{ group: '지나는 면', label: '가장 짧은 길', apply: (ss) => { ss.pyRoute = -1; }, on: (ss) => ss.pyRoute == null || ss.pyRoute < 0 }].concat(ROUTE_NM.map((n, i) => ({ group: '', label: n, apply: (ss) => { ss.pyRoute = i; }, on: (ss) => ss.pyRoute === i }))),
    init: (s) => { s.pyXa = 1; s.pyXb = 2; s.pyXc = 4; s.pyRoute = -1; },
    gen: (s, prev) => { let t; do { t = pick(BOXES); } while (prev && prev.pyXa === t[0] && prev.pyXb === t[1] && prev.pyXc === t[2]); const sh = t.slice().sort(() => Math.random() - 0.5); return { pyXa: sh[0], pyXb: sh[1], pyXc: sh[2], pyRoute: -1 }; },
    model: (s) => boxOf(s),
    draw(b, s, M, C) {
      const { a, b: bb, c, route, v, mini, min } = M, prob = C.problem;
      const kx = 0.5 * Math.cos(Math.PI / 4), dx = bb * kx, dy = -bb * kx; // 비스듬히 본 깊이 방향
      const F0 = pt(0, 0), F1 = pt(a, 0), F2 = pt(0, -c), F3 = pt(a, -c);
      const G0 = add(F0, pt(dx, dy)), G1 = add(F1, pt(dx, dy)), G2 = add(F2, pt(dx, dy)), G3 = add(F3, pt(dx, dy));
      // 오른쪽: 선택한 경로의 전개도 (가로로 펼침)
      const nw = route === 0 ? c + bb : route === 1 ? a + bb : c + a, nh = route === 0 ? a : route === 1 ? c : bb;
      const gapX = Math.max(1.2, (a + dx) * 0.25), ox = a + dx + gapX, oy = -(Math.max(0, nh));
      fit(b, { x0: -0.2, x1: prob ? a + dx + 0.3 : ox + nw + 0.3, y0: Math.min(-c + dy, -nh) - 0.2, y1: 0.5 }, { t: 40, b: 48, l: 26, r: 26 });
      const st = (n) => !C.review || C.step >= n;
      // 상자 (앞면 / 윗면 / 오른쪽면) — 밑면이 아래
      fillPoly(b, [F0, F1, F3, F2], 'ink', 0.06); fillPoly(b, [F2, F3, G3, G2], 'sky', 0.14); fillPoly(b, [F1, F3, G3, G1], 'green', 0.12);
      poly(b, [F0, F1, F3, F2], 'ink', 2.8); poly(b, [F2, F3, G3, G2], 'ink', 2.8); poly(b, [F1, F3, G3, G1], 'ink', 2.8);
      line(b, F0, G0, 'muted', 1.6, { dash: [5, 5] }); line(b, G0, G1, 'muted', 1.6, { dash: [5, 5] }); line(b, G0, G2, 'muted', 1.6, { dash: [5, 5] });
      b.point(F0, { color: 'amber', r: 5.5 }); T(b, F0, 'A', { dx: -14, dy: 14, size: 17, color: 'amber' });
      b.point(G3, { color: 'rose', r: 5.5 }); T(b, G3, 'G', { dx: 14, dy: -12, size: 17, color: 'rose' });
      T(b, mid(F0, F1), `${a}`, { dy: 16, size: 16, color: 'sky' }); T(b, mid(F0, F2), `${c}`, { dx: -14, size: 16, color: 'rose' }); T(b, mid(F1, G1), `${bb}`, { dx: 14, dy: 6, size: 16, color: 'green' });
      if (prob) { T(b, pt((a + dx) / 2, -c + dy), 'x : A→G 겉면 최단거리', { dy: -24, size: 14, color: 'amber' }); return; }
      if (st(2)) {
        // 상자 위의 경로 (선택한 경로)
        let X, path;
        if (route === 0) { X = pt((a * c) / (bb + c), -c); path = [F0, X, G3]; } else if (route === 1) { X = pt(a, -(c * a) / (a + bb)); path = [F0, X, G3]; } else { const t = c / (a + c); X = add(F2, pt(dx * t, dy * t)); path = [F0, X, G3]; }
        b.path(path, { color: 'amber', width: 4 });
        // 전개도: 두 직사각형을 가로로 나란히
        const X0 = ox, Y0 = 0;
        let r1, r2, q0, q1;
        if (route === 0) { r1 = [X0, Y0, c, a]; r2 = [X0 + c, Y0, bb, a]; } else if (route === 1) { r1 = [X0, Y0, a, c]; r2 = [X0 + a, Y0, bb, c]; } else { r1 = [X0, Y0, c, bb]; r2 = [X0 + c, Y0, a, bb]; }
        const rc = (r) => [pt(r[0], r[1]), pt(r[0] + r[2], r[1]), pt(r[0] + r[2], r[1] - r[3]), pt(r[0], r[1] - r[3])];
        fillPoly(b, rc(r1), 'ink', 0.06); fillPoly(b, rc(r2), 'sky', 0.14); poly(b, rc(r1), 'ink', 2.6); poly(b, rc(r2), 'ink', 2.6);
        const S = pt(X0, 0), Eg = pt(X0 + nw, -nh);
        if (st(3)) { line(b, S, Eg, 'amber', 4.2); T(b, S, 'A', { dx: -12, dy: 14, size: 16, color: 'amber' }); T(b, Eg, 'G', { dx: 12, dy: -12, size: 16, color: 'rose' }); T(b, mid(S, Eg), mini ? `x=${isq(v[route])}` : `x²=${v[route]}`, { dx: 0, dy: 18, size: 16, color: 'amber' }); T(b, pt(X0 + nw / 2, 0), `${nw}`, { dy: 16, size: 15, color: 'sky' }); T(b, pt(X0 + nw, -nh / 2), `${nh}`, { dx: 12, size: 15, color: 'green' }); }
        T(b, pt(X0 + nw / 2, 0), st(3) ? '' : ROUTE_NM[route], { dy: 18, size: 14, color: 'ink' });
      }
    },
    steps: (M) => [
      `A에서 G로 겉면을 따라 가는 길은 지나는 면에 따라 세 가지예요. 각각 전개도를 펼쳐 직선으로 나타내요.`,
      `전개도에서 가로가 $${M.route === 0 ? `${M.c}+${M.b}` : M.route === 1 ? `${M.a}+${M.b}` : `${M.c}+${M.a}`}$, 세로가 $${M.route === 0 ? M.a : M.route === 1 ? M.c : M.b}$인 직각삼각형의 빗변이 $x$예요.`,
      `세 경로의 $x^2$: ${ROUTE_NM.map((n, i) => `${n} $${M.v[i]}$`).join(', ')}. 가장 짧은 것은 $x^2=${M.min}$${M.mini ? `, $x=${M.mini}$` : ''}예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>가로 a, 깊이 b, 높이 c</b>를 바꿔 보세요. 칩으로 지나는 면을 고르면 <b>전개도</b>가 가로로 펼쳐지고 직선이 보여요. 세 경로의 길이를 비교해 가장 짧은 것을 찾아요. (제곱근은 배우기 전이라 x²로 비교해요)',
      readouts: ROUTE_NM.map((n, i) => rd(n, `x²=${M.v[i]}`, i === M.best ? 'green' : 'ink', i === M.best ? '가장 짧아요' : '', null, false)).concat([rd('최단거리', M.mini ? `${M.mini}` : `x²=${M.min}`, 'amber')]),
      formula: `<p>${ROUTE_NM.map((n, i) => `${n}: $x^2=${M.v[i]}$`).join('</p><p>')}</p>`,
      rule: '직육면체의 겉면을 따라 가는 최단거리: 전개도를 펼쳐 직각삼각형의 빗변을 구하고 세 경우를 비교',
      notes: notes('<b>세 가지 경로</b>를 모두 비교해야 해요. 한 경우만 구하면 틀릴 수 있어요.', '가장 긴 모서리를 포함하는 경로가 항상 짧은 것은 아니에요. 계산해서 비교해요.')
    }),
    prob: (M) => {
      const { a, b: bb, c, min, mini } = M;
      return { tag: '[심화][최단거리] 직육면체', key: `${a}-${bb}-${c}`, stem: `다음 그림과 같이 가로 $${a}$, 깊이 $${bb}$, 높이 $${c}$인 직육면체의 꼭짓점 A에서 겉면을 따라 꼭짓점 G까지 가는 가장 짧은 거리를 $x$라 할 때, $x$의 값은?`, choices: mkChoices(mini, [[a + bb + c, '직선으로 가는 것이 아니에요. 겉면을 펼쳐서 빗변을 구해요.'], [min, '제곱한 값이에요.'], [Math.max(...M.v.map((q) => isq(q))), '세 경로 중 가장 짧은 것을 구해요.'], [mini + 1, '다시 계산해 보세요.'], [mini - 1, '다시 계산해 보세요.'], [mini + 2, '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` }) };
    }
  };

  /* ====================================================================== 5. [심화] 원기둥 */
  const CYL = [[12, 5], [8, 6], [16, 12], [24, 7], [20, 15], [18, 24], [6, 8]];
  const cylOf = (s) => {
    const L = clamp(Math.round(s.pyCl / 2) * 2, 6, 24), h = clamp(Math.round(s.pyCh), 3, 24), half = s.pyTurn === 0.5, W = half ? L / 2 : L, x2 = W * W + h * h;
    return { L, h, half, W, x2, x: isSqN(x2) ? isq(x2) : null };
  };
  const cylN = (tt, L, h, turn) => {
    const r = L / (2 * PI), ry = r * 0.34, out = [];
    const N = 80;
    for (let i = 0; i <= N; i++) { const t = (i / N) * turn, phi = t * 2 * PI; out.push({ p: pt(r * Math.sin(phi), -h * (i / N) + ry * Math.cos(phi)), front: Math.cos(phi) >= -0.02 }); }
    return out;
  };
  const cyl = {
    id: 'py7-cyl', title: '[심화] 원기둥의 옆면에 실 감기', short: '[심화] 원기둥',
    question: '원기둥의 옆면을 따라 실을 감을 때 가장 짧은 길이는? 옆면을 펼치면 직사각형이 되고, 실은 그 대각선이 된다.',
    ctl: ['pyCl', 'pyCh'],
    presets: (s) => [{ group: '감는 횟수', label: '한 바퀴', apply: (ss) => { ss.pyTurn = 1; }, on: (ss) => ss.pyTurn !== 0.5 }, { group: '', label: '반 바퀴 (맞은편)', apply: (ss) => { ss.pyTurn = 0.5; }, on: (ss) => ss.pyTurn === 0.5 }].concat(CYL.slice(0, 5).map(([L, h], i) => ({ group: i === 0 ? '최단이 정수인 (둘레, 높이)' : '', label: `${L}, ${h}`, apply: (ss) => { ss.pyCl = L; ss.pyCh = h; }, on: (ss) => ss.pyCl === L && ss.pyCh === h }))),
    init: (s) => { s.pyCl = 12; s.pyCh = 5; s.pyTurn = 1; },
    gen: (s, prev) => { let t, k; do { t = pick(CYL.slice(0, 6)); k = pick([1, 0.5]); if (k === 0.5) t = pick([[10, 12], [6, 4], [16, 15], [8, 3 + 0], [24, 5]].filter((q) => isSqN((q[0] / 2) ** 2 + q[1] ** 2))); } while (prev && prev.pyCl === t[0] && prev.pyCh === t[1] && prev.pyTurn === k); return { pyCl: t[0], pyCh: t[1], pyTurn: k }; },
    model: (s) => cylOf(s),
    draw(b, s, M, C) {
      const { L, h, half, W, x2, x } = M, prob = C.problem;
      const r = L / (2 * PI), ry = r * 0.34, gapX = Math.max(1.4, r * 0.6), ox = r + gapX + 0.3;
      fit(b, { x0: -r - 0.3, x1: prob ? r + 0.5 : ox + W + 0.3, y0: -h - ry - 0.3, y1: ry + 0.9 }, { t: 40, b: 50, l: 24, r: 24 });
      const st = (n) => !C.review || C.step >= n;
      const ell = (cy, from, to) => { const pts = []; for (let i = 0; i <= 60; i++) { const t = from + (to - from) * (i / 60); pts.push(pt(r * Math.sin(t), cy + ry * Math.cos(t))); } return pts; };
      // 원기둥: 밑면이 아래 — 옆면 좌우 선, 아래 앞쪽 반타원, 위 타원
      fillPoly(b, [pt(-r, 0), pt(r, 0), pt(r, -h), pt(-r, -h)], 'ink', 0.06);
      line(b, pt(-r, 0), pt(-r, -h), 'ink', 2.8); line(b, pt(r, 0), pt(r, -h), 'ink', 2.8);
      b.path(ell(0, 0, PI * 2), { color: 'muted', width: 1.6, dash: [5, 5] });
      const front = []; for (let i = 0; i <= 40; i++) { const t = -PI / 2 + PI * (i / 40); front.push(pt(r * Math.sin(t) * 1, ry * Math.cos(t))); }
      b.path(front.map((q) => pt(q.x, q.y)), { color: 'ink', width: 2.8 });
      b.path(ell(-h, 0, PI * 2), { color: 'ink', width: 2.8, close: true, fill: 'sky', fillAlpha: 0.1 });
      // 실: 앞쪽은 실선, 뒤쪽은 점선
      {
        const pts = cylN(0, L, h, half ? 0.5 : 1);
        let seg = [pts[0]]; let cur = pts[0].front;
        for (let i = 1; i < pts.length; i++) { if (pts[i].front === cur) seg.push(pts[i]); else { b.path(seg.map((q) => q.p), { color: 'amber', width: 3.6, dash: cur ? undefined : [6, 5] }); seg = [pts[i - 1], pts[i]]; cur = pts[i].front; } }
        b.path(seg.map((q) => q.p), { color: 'amber', width: 3.6, dash: cur ? undefined : [6, 5] });
        b.point(pts[0].p, { color: 'amber', r: 5 }); T(b, pts[0].p, 'A', { dx: -14, dy: 14, size: 17, color: 'amber' });
        const e = pts[pts.length - 1].p; b.point(e, { color: 'rose', r: 5 }); T(b, e, 'B', { dx: half ? 14 : 14, dy: -12, size: 17, color: 'rose' });
      }
      T(b, pt(0, ry), `둘레 ${L}`, { dy: 40, size: 15, color: 'sky' });
      if (prob) {
        T(b, pt(-r, -h / 2), `${h}`, { dx: -16, size: 16, color: 'green' });
        const pp = cylN(0, L, h, half ? 0.5 : 1), xp = pp[Math.round((pp.length - 1) * (half ? 0.5 : 0.25))].p;
        T(b, xp, 'x', { dx: 15, size: 18, color: 'amber' }); return;
      }
      T(b, pt(r, -h / 2), `${h}`, { dx: 16, size: 16, color: 'green' });
      if (st(2)) {
        const X0 = ox, rc = [pt(X0, 0), pt(X0 + W, 0), pt(X0 + W, -h), pt(X0, -h)];
        fillPoly(b, rc, 'sky', 0.12); poly(b, rc, 'ink', 2.8);
        if (st(3)) { line(b, pt(X0, 0), pt(X0 + W, -h), 'amber', 4.2); T(b, pt(X0, 0), 'A', { dx: -12, dy: 14, size: 16, color: 'amber' }); T(b, pt(X0 + W, -h), 'B', { dx: 12, dy: -12, size: 16, color: 'rose' }); T(b, pt(X0 + W / 2, -h / 2), x ? `x=${x}` : `x²=${x2}`, { dx: 0, dy: 20, size: 16, color: 'amber' }); }
        T(b, pt(X0 + W / 2, 0), half ? `\\frac{${L}}{2}=${L / 2}` : `${L}`, { dy: 18, size: 15, color: 'sky' }); T(b, pt(X0 + W, -h / 2), `${h}`, { dx: 14, size: 15, color: 'green' });
      }
    },
    steps: (M) => [
      `원기둥의 옆면을 펼치면 직사각형이 돼요. 가로는 ${M.half ? '밑면의 둘레의 반' : '밑면의 둘레'} $${M.half ? `\\frac{${M.L}}{2}=${M.W}` : M.L}$, 세로는 높이 $${M.h}$예요.`,
      `실이 ${M.half ? '반 바퀴' : '한 바퀴'} 감기는 가장 짧은 길은 펼친 직사각형의 <b>대각선</b>이에요. 직각삼각형의 빗변이 $x$예요.`,
      `$x^2=${M.W}^2+${M.h}^2=${M.x2}$${M.x ? `, $x=${M.x}$` : ''}예요.`
    ],
    view: (M) => ({
      guide: '막대나 칩으로 <b>둘레</b>와 <b>높이</b>를 바꾸고, 감는 횟수(한 바퀴·반 바퀴)를 골라 보세요. 옆면을 펼치면 <b>직사각형의 대각선</b>이 가장 짧은 실의 길이예요. (둘레가 정수로 주어지면 π 없이 구해져요)',
      readouts: [rd('펼친 가로', M.half ? `$\\frac{${M.L}}{2}=${M.W}$` : `${M.W}`, 'sky', M.half ? '밑면의 둘레의 반' : '밑면의 둘레'), rd('세로 (높이)', `${M.h}`, 'green'), rd('실의 길이 x', M.x ? `${M.x}` : `x²=${M.x2}`, 'amber', `${M.W}² + ${M.h}² = ${M.x2}`)],
      formula: `<p>$x^2=${M.W}^2+${M.h}^2=${M.x2}$${M.x ? `, $x=${M.x}$` : ''}</p>`,
      rule: '원기둥의 옆면에 실을 감는 최단거리 = 옆면 전개도(직사각형)의 대각선',
      notes: notes('한 바퀴이면 가로는 <b>밑면의 둘레 전체</b>, 반 바퀴이면 둘레의 <b>반</b>이에요.', '높이와 둘레를 <b>더하는</b> 것이 아니라 직각삼각형의 빗변이에요.')
    }),
    prob: (M) => {
      const { L, h, half, W, x2, x } = M;
      return { tag: '[심화][최단거리] 원기둥', key: `${half ? 'h' : 'f'}-${L}-${h}`, stem: half ? `다음 그림과 같이 밑면의 둘레가 $${L}$, 높이가 $${h}$인 원기둥의 점 A에서 옆면을 따라 반대쪽 위의 점 B까지 실을 반 바퀴 감으려고 한다. 필요한 실의 최소 길이 $x$는?` : `다음 그림과 같이 밑면의 둘레가 $${L}$, 높이가 $${h}$인 원기둥의 점 A에서 옆면을 따라 바로 위의 점 B까지 실을 한 바퀴 감으려고 한다. 필요한 실의 최소 길이 $x$는?`, choices: mkChoices(x, [[L + h, '둘레와 높이를 더하지 않아요. 직각삼각형의 빗변이에요.'], [half ? L + h : W + h, '둘레의 반 (또는 둘레)과 높이를 더했어요.'], [x2, '제곱한 값이에요.'], [x + 1, '다시 계산해 보세요.'], [x - 1, '다시 계산해 보세요.'], [half ? isq(L * L + h * h) || L + 1 : Math.round(Math.sqrt((L / 2) ** 2 + h * h)) || 1, half ? '반 바퀴인데 둘레 전체를 가로로 썼어요.' : '한 바퀴인데 둘레의 반을 가로로 썼어요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` }) };
    }
  };

  G.register(70, 't7', '⑦ 접기·최단거리', '접기·최단거리', PARAMS, [frect, ftri, refl, box, cyl]);
})();
