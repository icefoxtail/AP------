/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ⑦ 「외심·내심」 (t7.js, order 70) — 장면 5개
   · m1 이등변삼각형의 O와 I   · ∠A 조절: ∠BOC=2∠A, ∠BIC=90°+½∠A, ∠OBI
   · m2 직각삼각형의 O와 I     · 외심=빗변의 중점 R=c÷2, 내접원 r=(a+b−c)÷2, 색칠한 부분의 넓이
   · m3 보기 판별              · 칩 ①~⑤를 누르면 그 성질이 그림에 나타나고, 참·거짓(반례)을 보여 줌
   · m4 정삼각형의 O와 I        · O=I, R=2r, 높이 AD=3r
   · m5 중점과 수선의 발        · 외심의 D·E·F(변의 중점)와 내심의 D·E·F(수선의 발)의 차이
   무게중심은 「도형의 닮음」 심화 탭에서 다룹니다. 각은 정수(도), 길이는 정수(cm)만 보입니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, polar, angBetween, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, numProb, mkStmtChoices, mkTextChoices, degOpts, cmOpts, rd, notes, fmtN, dg, bboxOf, fs, dim, foot, circumcenter, incenter, triBC } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const S = (n) => `$\\overline{${n}}$`;
  const fr = (n, d) => `\\frac{${n}}{${d}}`;

  const RT2 = [[6, 8, 10, 2], [12, 16, 20, 4], [10, 24, 26, 4], [18, 24, 30, 6], [16, 30, 34, 6]]; // 빗변이 짝수인 정수 직각삼각형
  const PARAMS = {
    trMa: P('꼭지각 ∠A', 40, 88, 4, 52, { color: 'amber', format: (v) => v + '°' }),
    trMi: P('삼각형 고르기 (직각변, 직각변, 빗변)', 0, 4, 1, 0, { color: 'sky', format: (v) => { const t = RT2[clamp(Math.round(v), 0, 4)]; return `${t[0]}, ${t[1]}, ${t[2]} cm`; } }),
    trMx: P('∠A', 40, 130, 2, 70, { color: 'amber', format: (v) => v + '°' }),
    trMy: P('∠B', 20, 70, 2, 56, { color: 'green', format: (v) => v + '°' }),
    trMr: P('내접원의 반지름 r', 2, 6, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    trMs: P('∠A', 40, 80, 2, 60, { color: 'sky', format: (v) => v + '°' }),
    trMt: P('∠B', 40, 80, 2, 70, { color: 'green', format: (v) => v + '°' })
  };
  const near = (x, y) => Math.abs(x - y) < 1e-6;
  // 두 가지 경우를 보기 좋게: 보기 5개(글) 만들기
  const txt = (items, key) => ({ choices: mkTextChoices(items, key), wide: true });

  /* ====================================================================== 1. 이등변삼각형의 O와 I */
  function isoOI(a) {
    const h = 1 / Math.tan((a * DEG) / 2), B = pt(-1, 0), Cc = pt(1, 0), A = pt(0, -h);
    return { A, B, C: Cc, O: circumcenter(A, B, Cc), I: incenter(A, B, Cc) };
  }
  const m1 = {
    id: 't7-1', title: '이등변삼각형의 외심 O와 내심 I', short: '이등변삼각형의 O와 I',
    question: '이등변삼각형 ABC의 외심 O와 내심 I는 모두 대칭축 위에 있어요. ∠OBI는 얼마일까?',
    ctl: ['trMa'],
    init: (s) => { s.trMa = 52; s.trV = 0; },
    reroll: (s) => { s.trMa = pick([40, 44, 48, 52, 56, 64, 68, 72, 76, 80], s.trMa); s.trV = (s.trV + 1) % 3; },
    model: (s) => {
      const a = clamp(Math.round(s.trMa / 4) * 4, 40, 88), bb = (180 - a) / 2, obc = 90 - a, ibc = bb / 2, obi = Math.abs(obc - ibc), g = isoOI(a);
      return { a, b: bb, obc, ibc, obi, same: obi === 0, boc: 2 * a, bic: 90 + a / 2, g };
    },
    draw(b, s, M, C) {
      const { a, b: bb, obc, ibc, obi, same, boc, bic, g } = M, { A, B, C: Cc, O, I } = g, st = C.step, v = same ? 2 : (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc, O, I]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.6); tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      line(b, B, O, 'rose', 3); line(b, Cc, O, 'rose', 3); line(b, A, mid(B, Cc), 'ink', 2, { dash: [6, 5], alpha: 0.5 });
      line(b, B, I, 'green', 3, { dash: [7, 5] }); line(b, Cc, I, 'green', 3, { dash: [7, 5] });
      if (C.problem) {
        ang(b, A, B, Cc, { color: 'sky', r: 34, label: dg(a), size: 16, labelDist: 56 });
        if (same) ang(b, B, I, Cc, { color: 'amber', r: 38, label: 'x', size: 17, labelDist: 56 });
        else if ((s.trV || 0) % 3 === 0) ang(b, B, O, I, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 52 });
        else if ((s.trV || 0) % 3 === 1) ang(b, B, O, Cc, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 52 });
        else { ang(b, O, B, Cc, { color: 'rose', r: 24, label: '∠BOC', size: 13, labelDist: 46 }); ang(b, I, B, Cc, { color: 'green', r: 40, label: '∠BIC', size: 13, labelDist: 62 }); T(b, pt(0, 0), 'x = ∠BOC와 ∠BIC의 차', { dy: 32, size: fs(b, 16), color: 'amber' }); }
      } else {
        const lf = fs(b, 14);
        if (show(2)) { ang(b, B, Cc, O, { color: 'rose', r: 26, label: dg(obc), size: lf, labelDist: 118 }); ang(b, Cc, B, O, { color: 'rose', r: 26, rings: 2 }); }
        if (show(2)) ang(b, B, Cc, I, { color: 'green', r: 38, label: dg(ibc), size: lf, labelDist: 86 });
        if (show(3) && !same) ang(b, B, I, O, { color: 'amber', r: 52, label: dg(obi), size: lf, labelDist: 70 });
        ang(b, A, B, Cc, { color: 'sky', r: 30, label: dg(a), size: lf, labelDist: 50 });
      }
      b.point(O, { color: 'rose', r: 5.5 }); b.point(I, { color: 'green', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      if (same) T(b, O, 'O = I', { dx: 24, dy: 0, size: 16, color: 'rose' }); else { T(b, O, 'O', { dx: 14, dy: 12, size: 17, color: 'rose' }); T(b, I, 'I', { dx: 14, dy: -12, size: 17, color: 'green' }); }
      tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `AB=AC, ∠A=${a}° → ∠B=∠C=${bb}°`;
        else if (C.review && st === 2) { row = `∠OBC=90°−∠A=${obc}°, ∠IBC=\\frac{1}{2}∠B=${ibc}°`; col = 'green'; }
        else if (C.review && st === 3) { row = same ? '∠OBC=∠IBC → 정삼각형: O와 I가 같은 점' : `∠OBI=|${obc}°−${ibc}°|=${obi}°`; col = 'amber'; }
        else row = same ? '정삼각형: O와 I가 같은 점이에요' : `∠OBI=${obi}°  (∠BOC=${boc}°, ∠BIC=${bic}°)`;
        rowT(b, pt(0, 0), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `AB=AC이므로 $\\angle B=\\angle C=${fr('180^{\\circ}-\\angle A', 2)}=${M.b}^{\\circ}$예요. 외심 O와 내심 I는 모두 꼭지각의 이등분선 위에 있어요.`,
      `외심: $\\angle BOC=2\\angle A=${M.boc}^{\\circ}$이고 △OBC가 이등변삼각형이므로 $\\angle OBC=${fr(`180^{\\circ}-${M.boc}^{\\circ}`, 2)}=90^{\\circ}-\\angle A=${M.obc}^{\\circ}$. 내심: $\\angle IBC=${fr('1', 2)}\\angle B=${M.ibc}^{\\circ}$.`,
      M.same ? `$\\angle OBC=\\angle IBC$이므로 O와 I가 같은 점이에요 (정삼각형).` : `$\\angle OBI=|\\angle OBC-\\angle IBC|=|${M.obc}^{\\circ}-${M.ibc}^{\\circ}|=${M.obi}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>꼭지각 ∠A</b>를 바꿔 보세요. 외심 O는 <b>∠BOC=2∠A</b>를, 내심 I는 <b>∠BIC=90°+½∠A</b>를 만족해요. ∠A=60°(정삼각형)일 때 O와 I가 같은 점이 돼요.',
      readouts: [rd('∠B = ∠C', `${M.b}°`, 'sky'), rd('∠OBC · ∠IBC', `${M.obc}° · ${M.ibc}°`, 'rose'), rd('∠BOC · ∠BIC', `${M.boc}° · ${M.bic}°`, 'green'), rd('∠OBI', `${M.obi}°`, 'amber', '|∠OBC − ∠IBC|', null, true)],
      formula: `<p>$\\angle OBC=90^{\\circ}-\\angle A=${M.obc}^{\\circ}$, $\\angle IBC=${fr('1', 2)}\\angle B=${M.ibc}^{\\circ}$</p><p>$\\angle OBI=|${M.obc}^{\\circ}-${M.ibc}^{\\circ}|=${M.obi}^{\\circ}$</p>`,
      rule: '외심: ∠BOC=2∠A (△OBC는 이등변삼각형), 내심: ∠BIC=90°+½∠A, ∠IBC=½∠B. 두 각의 차로 ∠OBI를 구한다.',
      notes: notes('외심의 각은 <b>이등변삼각형 OBC</b>의 밑각(90°−∠A)이에요. 내심의 각은 ∠B를 <b>이등분</b>한 각이에요.', '∠OBI는 두 각 중 큰 값에서 작은 값을 빼요. 어느 것이 큰지 그림에서 확인해요.')
    }),
    prob: (M, s) => {
      const { a, obc, ibc, obi, boc, bic } = M, v = (s.trV || 0) % 3, key = `${v}:${a}`;
      const head = `그림에서 점 O, I는 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC의 외심, 내심이다.`;
      if (obi === 0) return numProb({ tag: '외심과 내심 · ∠IBC', key: `0:${a}`, stem: `${head} ∠A=${a}°일 때, ∠IBC의 크기 $x$는?`, correct: ibc, wrongs: [[a, '∠A 그대로예요.'], [(180 - a) / 2, '∠B예요. ∠IBC는 ∠B의 반이에요.'], [90 - a, '∠OBC예요.'], [ibc + 10, '다시 계산해 보세요.'], [ibc - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== ibc && q[0] > 0), ...degOpts(5) });
      if (v === 0) return numProb({ tag: '외심과 내심 · ∠OBI', key, stem: `${head} ∠A=${a}°일 때, ∠OBI의 크기 $x$는?`, correct: obi, wrongs: [[obc, '∠OBC예요. ∠OBI는 ∠OBC와 ∠IBC의 차예요.'], [ibc, '∠IBC예요.'], [obc + ibc, '차가 아니라 합을 구했어요.'], [obi + 5, '다시 계산해 보세요.'], [obi + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== obi && q[0] > 0), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '외심과 내심 · ∠OBC', key, stem: `${head} ∠A=${a}°일 때, ∠OBC의 크기 $x$는?`, correct: obc, wrongs: [[boc, '∠BOC예요. △OBC는 이등변삼각형이에요.'], [(180 - a) / 2, '∠B예요.'], [ibc, '∠IBC예요.'], [obc + 10, '다시 계산해 보세요.'], [obc - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== obc && q[0] > 0), ...degOpts(5) });
      return numProb({ tag: '[함정] 외심과 내심 · 같은 꼭지각', key, stem: `${head} ∠A=${a}°일 때, ∠BOC와 ∠BIC의 크기의 차 $x$는?`, correct: Math.abs(boc - bic), wrongs: [[boc, '∠BOC 그대로예요.'], [bic, '∠BIC 그대로예요.'], [boc + bic, '차가 아니라 합이에요.'], [Math.abs(boc - bic) + 10, '다시 계산해 보세요.'], [Math.abs(boc - bic) - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== Math.abs(boc - bic) && q[0] > 0), ...degOpts(5), valid: (v2) => Number.isInteger(v2) && v2 > 0 && v2 < 360 });
    },
    verify: (s) => { const M = m1.model(s), g = M.g; return { ans: angBetween(g.B, g.C, g.O), model: M.obc, extra: [[angBetween(g.B, g.C, g.I), M.ibc], [angBetween(g.O, g.B, g.C), angBetween(g.O, g.C, g.B)]] }; }
  };

  /* ====================================================================== 2. 직각삼각형의 O와 I */
  function rtOI(a, b) {
    const C0 = pt(0, 0), B = pt(a, 0), A = pt(0, -b), c = Math.hypot(a, b), r = (a + b - c) / 2;
    return { A, B, C: C0, O: mid(A, B), R: c / 2, I: pt(r, -r), r };
  }
  const m2 = {
    id: 't7-2', title: '직각삼각형의 외심 O와 내심 I', short: '직각삼각형의 O와 I',
    question: '직각삼각형의 외접원의 반지름 R과 내접원의 반지름 r은 세 변으로 어떻게 구할까?',
    ctl: ['trMi'],
    init: (s) => { s.trMi = 0; s.trV = 0; },
    reroll: (s) => { s.trMi = rint(0, 4); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const t = RT2[clamp(Math.round(s.trMi), 0, 4)], [a, b, c, r] = t, R = c / 2; return { a, b, c, r, R, g: rtOI(a, b), tri: (a * b) / 2, circ: R * R }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, r, R, g, tri } = M, { A, B, C: Cc, O, I } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, { x0: O.x - R, x1: O.x + R, y0: O.y - R, y1: O.y + R }, { t: 40, b: C.problem ? 44 : 84, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, R, { fill: 'amber', fillAlpha: v === 0 && (C.problem || show(3)) ? 0.22 : 0.06, color: 'amber', width: 2.4 });
      fillPoly(b, [A, B, Cc], 'sky', 0.35); poly(b, [A, B, Cc], 'ink', 3.6);
      b.circle(I, r, { color: 'green', width: 2.6, alpha: 0.9 });
      ang(b, Cc, A, B, { color: 'sky', r: 26 });
      line(b, O, Cc, 'rose', 3); tick(b, A, O, 1, 'amber'); tick(b, O, B, 1, 'amber'); tick(b, O, Cc, 1, 'amber');
      G.sideTag(b, Cc, B, pt(I.x, -50), `${a} cm`, { color: 'sky', size: fs(b, 15), gap: 8 }); G.sideTag(b, Cc, A, pt(80, I.y), `${bb} cm`, { color: 'sky', size: fs(b, 15), gap: 8 }); G.sideTag(b, A, B, I, `${c} cm`, { color: 'sky', size: fs(b, 15), gap: 8 });
      if (!C.problem) {
        if (show(1)) G.sideTag(b, O, Cc, I, `R = ${R} cm`, { color: 'rose', size: fs(b, 15), gap: 6 });
        if (show(2)) T(b, I, `r = ${r}`, { dx: 0, dy: 26, size: fs(b, 14), color: 'green' });
      }
      b.point(O, { color: 'rose', r: 5.5 }); b.point(I, { color: 'green', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 12, dy: 12, size: 17, color: 'rose' }); T(b, I, 'I', { dx: -10, dy: -12, size: 17, color: 'green' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `외심 O = 빗변의 중점 → R=${c}÷2=${R} cm`;
        else if (C.review && st === 2) { row = `r=(${a}+${bb}−${c})÷2=${r} cm`; col = 'green'; }
        else if (C.review && st === 3) { row = `색칠한 부분 = ${R * R}π − ${tri} (cm²)`; col = 'amber'; }
        else row = `R=${R} cm, r=${r} cm, 외접원−삼각형 = ${R * R}π−${tri} (cm²)`;
        rowT(b, pt(O.x, O.y + R), row, { dy: 34, size: fs(b, 14), color: col });
      }
    },
    steps: (M) => [
      `∠C=90°이므로 외심 O는 빗변 AB의 중점이에요. 외접원의 반지름은 $R=${fr('\\overline{AB}', 2)}=${fr(String(M.c), 2)}=${M.R}$ cm.`,
      `직각삼각형의 내접원의 반지름은 $r=${fr('a+b-c', 2)}=${fr(`${M.a}+${M.b}-${M.c}`, 2)}=${M.r}$ cm예요.`,
      `(외접원의 넓이) $=\\pi R^2=${M.circ}\\pi$, (삼각형의 넓이) $=${fr('1', 2)}\\times${M.a}\\times${M.b}=${M.tri}$이므로 색칠한 부분(외접원 − 삼각형)의 넓이는 $${M.circ}\\pi-${M.tri}$ (cm²)예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>삼각형</b>을 골라 보세요(빗변이 짝수인 정수 직각삼각형이에요). 외심은 <b>빗변의 중점</b>(R=빗변÷2), 내접원의 반지름은 <b>r=(a+b−c)÷2</b>예요. 색칠한 부분은 외접원에서 삼각형을 뺀 부분이에요.',
      readouts: [rd('빗변 c', `${M.c} cm`, 'sky'), rd('외접원의 반지름 R', `${M.R} cm`, 'rose', '빗변의 반'), rd('내접원의 반지름 r', `${M.r} cm`, 'green', '(a + b − c) ÷ 2'), rd('외접원 − 삼각형', `${M.circ}π − ${M.tri} cm²`, 'amber', null, null, true)],
      formula: `<p>$R=${fr(String(M.c), 2)}=${M.R}$, $r=${fr(`${M.a}+${M.b}-${M.c}`, 2)}=${M.r}$ (cm)</p><p>(색칠한 부분) $=\\pi\\times${M.R}^2-${fr('1', 2)}\\times${M.a}\\times${M.b}=${M.circ}\\pi-${M.tri}$ (cm²)</p>`,
      rule: '직각삼각형: 외심 = 빗변의 중점이므로 R = 빗변 ÷ 2, 내접원의 반지름 r = (직각을 낀 두 변의 합 − 빗변) ÷ 2.',
      notes: notes('R은 <b>빗변의 반</b>이고, r은 <b>(두 변의 합 − 빗변)의 반</b>이에요. 서로 달라요.', '넓이에서 π가 들어 있는 항과 없는 항은 더하거나 빼지 말고 그대로 써요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, r, R, tri, circ } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}`;
      const head = `그림과 같이 ∠C=90°이고 ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm, ${S('AB')}=${c} cm인 직각삼각형 ABC의 외심을 O, 내심을 I라 하자.`;
      if (v === 0) {
        const f = (p, q) => `${p}\\pi-${q}\\text{ cm}^2`;
        const items = [{ h: `$${f(circ, tri)}$`, ok: true }, { h: `$${f(circ, 2 * tri)}$`, hint: '삼각형의 넓이는 ½×밑변×높이예요. 2를 곱하지 않아요.' }, { h: `$${f(circ * 2, tri)}$`, hint: '외접원의 넓이는 πR²이에요. R은 빗변의 반이에요.' }, { h: `$${f(circ, tri / 2)}$`, hint: '삼각형의 넓이를 한 번 더 2로 나눴어요.' }, { h: `$${f((c * c) / 1, tri)}$`, hint: '빗변을 반지름으로 썼어요. 반지름 R은 빗변의 반이에요.' }].map((x) => ({ ...x, p: x.h.replace(/\$/g, '') }));
        return { tag: '외접원과 삼각형 · 색칠한 부분의 넓이', key, stem: `${head} 외접원에서 삼각형 ABC를 제외한 색칠한 부분의 넓이는?`, ...txt(items, key) };
      }
      return numProb({ tag: '외접원과 내접원의 반지름', key, stem: `${head} 외접원의 반지름 R과 내접원의 반지름 r의 합 $R+r$의 값은?`, correct: R + r, wrongs: [[R, 'R만 구했어요. r도 더해야 해요.'], [r, 'r만 구했어요. R도 더해야 해요.'], [R * 2 + r, 'R은 지름이 아니라 반지름이에요.'], [R + r + 1, '다시 계산해 보세요.'], [R + r - 1, '다시 계산해 보세요.']].filter((q) => q[0] !== R + r && q[0] > 0), ...cmOpts });
    },
    verify: (s) => { const M = m2.model(s), g = M.g; return { ans: dist(g.O, g.C), model: dist(g.O, g.A), extra: [[dist(g.O, g.B), M.R], [dist(g.I, pt(g.I.x, 0)), M.r], [dist(g.I, pt(0, g.I.y)), M.r]] }; }
  };

  /* ====================================================================== 3. 보기 판별 */
  const CHIPS = [
    { id: 'oa', t: '① 외심에서 세 꼭짓점까지의 거리가 같다' },
    { id: 'id', t: '② 내심에서 세 변까지의 거리가 같다' },
    { id: 'oin', t: '③ 외심은 항상 삼각형의 내부에 있다' },
    { id: 'ia', t: '④ 내심에서 세 꼭짓점까지의 거리가 같다' },
    { id: 'iin', t: '⑤ 내심은 항상 삼각형의 내부에 있다' }
  ];
  function oiGeo(a, b) {
    const c = 180 - a - b, [A, B, Cc] = triBC(2, b, c), O = circumcenter(A, B, Cc), I = incenter(A, B, Cc);
    const inside = (p) => { const s1 = G.cross(sub(B, A), sub(p, A)), s2 = G.cross(sub(Cc, B), sub(p, B)), s3 = G.cross(sub(A, Cc), sub(p, Cc)); return (s1 > 1e-9 && s2 > 1e-9 && s3 > 1e-9) || (s1 < -1e-9 && s2 < -1e-9 && s3 < -1e-9); };
    return { A, B, C: Cc, O, I, a, b, c, oIn: inside(O), iIn: inside(I), D: foot(I, B, Cc), E: foot(I, Cc, A), F: foot(I, A, B) };
  }
  const chipTruth = (k, g) => {
    if (k === 0) return true; if (k === 1) return true; if (k === 2) return g.oIn; if (k === 3) return near(dist(g.I, g.A), dist(g.I, g.B)) && near(dist(g.I, g.B), dist(g.I, g.C)); return g.iIn;
  };
  const m3 = {
    id: 't7-3', title: '외심·내심의 성질 판별', short: '보기 판별',
    question: '외심과 내심에 대한 설명 ①~⑤ 중 어떤 것이 늘 옳을까? 반례를 찾아 보세요.',
    ctl: ['trMx', 'trMy'],
    presets: () => CHIPS.map((c, i) => ({ group: i === 0 ? '확인할 보기' : '', label: c.t, apply: (s) => { s.trMk = i; }, on: (s) => (s.trMk || 0) === i })),
    init: (s) => { s.trMx = 70; s.trMy = 56; s.trMk = 0; s.trPa = 64; s.trPb = 52; s.trQi = 0; },
    reroll: (s) => { s.trPa = pick([44, 56, 64, 72, 100, 110, 120], s.trPa); s.trPb = pick([30, 36, 44, 52, 60], s.trPb); if (s.trPa + s.trPb > 170) s.trPb = 30; if (s.trPa === s.trPb) s.trPb += 2; s.trQi = (s.trQi || 0) + 1; },
    model: (s) => { const a = clamp(Math.round(s.trMx / 2) * 2, 40, 130); let b = clamp(Math.round(s.trMy / 2) * 2, 20, 70); if (180 - a - b < 10) b = 170 - a; const pa = s.trPa || 64, pb = s.trPb || 52; return { k: (s.trMk || 0) % 5, a, b, c: 180 - a - b, g: oiGeo(a, b), pg: oiGeo(pa, pb), pa, pb }; },
    draw(b, s, M, C) {
      const prob = C.problem, g = prob ? M.pg : M.g, k = M.k, { A, B, C: Cc, O, I, D, E, F } = g, st = C.step;
      fit(b, bboxOf([A, B, Cc, O, I]), { t: 50, b: prob ? 50 : 96, l: 56, r: 56 });
      const truth = chipTruth(k, g), col = truth ? 'green' : 'rose';
      fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.6);
      if (prob) {
        [A, B, Cc].forEach((z) => line(b, z, O, 'rose', 2, { alpha: 0.35 })); [D, E, F].forEach((z) => line(b, I, z, 'green', 2, { alpha: 0.5 }));
      } else {
        if (k === 0) { [A, B, Cc].forEach((z) => line(b, z, O, 'green', 3.4)); }
        if (k === 1) { [D, E, F].forEach((z) => line(b, I, z, 'green', 3.4)); b.circle(I, dist(I, D), { color: 'green', width: 2.4, alpha: 0.9 }); }
        if (k === 2) { [A, B, Cc].forEach((z) => line(b, z, O, col, 2, { alpha: 0.5 })); }
        if (k === 3) { [A, B, Cc].forEach((z) => line(b, z, I, col, 3.4)); }
        if (k === 4) { [D, E, F].forEach((z) => line(b, I, z, col, 2, { alpha: 0.5 })); }
      }
      b.point(O, { color: 'rose', r: prob || k === 0 || k === 2 ? 6 : 4.5 }); b.point(I, { color: 'green', r: prob || k === 1 || k === 3 || k === 4 ? 6 : 4.5 });
      [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 14, dy: 12, size: 17, color: 'rose' }); T(b, I, 'I', { dx: -14, dy: -12, size: 17, color: 'green' });
      tagOut(b, A, pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3), 'A', { size: 18 }); tagOut(b, B, pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3), 'B', { size: 18 }); tagOut(b, Cc, pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3), 'C', { size: 18 });
      if (!prob) {
        if (k === 0) { [[B, Cc], [Cc, A], [A, B]].forEach(() => {}); }
        const cenx = (A.x + B.x + Cc.x) / 3, yb = Math.max(B.y, Cc.y, O.y);
        const verdict = truth ? '참 ✓' : '거짓 ✗';
        let row = `${CHIPS[k].t.slice(2)} → ${verdict}`;
        if (k === 2 && !truth) row = `∠A=${g.a}°, ∠B=${g.b}°, ∠C=${g.c}° — 외심이 삼각형의 ${g.a >= 90 || g.b >= 90 || g.c >= 90 ? (g.a === 90 || g.b === 90 || g.c === 90 ? '변 위(직각)' : '바깥(둔각)') : '바깥'}에 있어요 → 거짓 ✗ (반례)`;
        if (k === 3 && !truth) row = `IA, IB, IC가 서로 달라요 → 거짓 ✗ (정삼각형일 때만 같아요)`;
        if (k === 3 && truth) row = `이 삼각형은 IA=IB=IC예요 (정삼각형). 다른 삼각형에서는 아니에요`;
        if (C.review) row = ['세 변의 수직이등분선의 교점이 외심이에요', '각의 이등분선 위의 점은 두 변에서 같은 거리예요', '∠A가 둔각이면 외심은 바깥이에요', '내심에서 꼭짓점까지는 서로 달라요', '내심은 늘 삼각형의 안쪽이에요'][k];
        rowT(b, pt(cenx, yb), row, { dy: 42, size: fs(b, 15), color: C.review ? 'sky' : col });
      }
    },
    steps: (M) => {
      const k = M.k;
      const base = [
        `외심 O는 세 변의 수직이등분선의 교점이고, 수직이등분선 위의 점은 선분의 두 끝점에서 같은 거리에 있으므로 $\\overline{OA}=\\overline{OB}=\\overline{OC}$. 그래서 ①은 늘 <b>참</b>이에요.`,
        `내심 I는 세 내각의 이등분선의 교점이고, 각의 이등분선 위의 점은 두 변에서 같은 거리에 있으므로 $\\overline{ID}=\\overline{IE}=\\overline{IF}$. 그래서 ②는 늘 <b>참</b>이에요.`,
        `∠A가 둔각이면 외심은 삼각형의 바깥에, 직각이면 변 위(빗변의 중점)에 있어요. 예각삼각형일 때만 내부에 있으므로 ③은 <b>거짓</b>이에요 (반례: 둔각삼각형).`,
        `내심에서 꼭짓점까지의 거리 IA, IB, IC는 일반적으로 서로 달라요. 정삼각형처럼 특별한 경우에만 같아요. 그래서 ④는 <b>거짓</b>이에요.`,
        `세 내각의 이등분선은 삼각형 안에서 만나므로 내심은 늘 삼각형의 내부에 있어요. 그래서 ⑤는 <b>참</b>이에요.`
      ];
      return [`보기 ${'①②③④⑤'[k]}을 그림에서 확인해요. ${CHIPS[k].t.slice(2)}`, base[k].replace(/<\/?b>/g, ''), `${[true, true, false, false, true][k] ? '늘 성립하므로 옳은 보기' : '성립하지 않는 경우(반례)가 있으므로 옳지 않은 보기'}예요.`];
    },
    view: (M) => {
      const k = M.k, g = M.g, truth = chipTruth(k, g);
      return {
        guide: '위의 칩에서 <b>보기 ①~⑤</b>를 하나씩 눌러 보세요. 해당 성질이 그림에 나타나요(참이면 초록, 거짓이면 분홍). 막대로 <b>∠A, ∠B</b>를 바꿔 <b>반례</b>(예: ∠A가 둔각)를 직접 만들어 보세요.',
        readouts: [rd('∠A · ∠B · ∠C', `${M.a}° · ${M.b}° · ${M.c}°`, 'sky'), rd('외심 O', g.oIn ? '삼각형의 안쪽' : '삼각형의 바깥', g.oIn ? 'green' : 'rose'), rd('이 삼각형에서 보기 ' + '①②③④⑤'[k], truth ? '참' : '거짓', truth ? 'green' : 'rose', null, null, true)],
        status: truth ? { tone: 'ok', text: `보기 ${'①②③④⑤'[k]} — 이 삼각형에서는 참` } : { tone: 'warn', text: `보기 ${'①②③④⑤'[k]} — 거짓 (반례)` },
        formula: `<p>외심 O: $\\overline{OA}=\\overline{OB}=\\overline{OC}$ (수직이등분선)</p><p>내심 I: $\\overline{ID}=\\overline{IE}=\\overline{IF}$ (각의 이등분선)</p>`,
        rule: '외심은 꼭짓점까지의 거리가 같고(둔각삼각형에서는 바깥), 내심은 변까지의 거리가 같다(늘 삼각형 안).',
        notes: notes('외심 ↔ <b>꼭짓점</b>까지 같은 거리, 내심 ↔ <b>변</b>까지 같은 거리. 짝을 바꾸면 틀려요.', '외심은 둔각삼각형에서 <b>바깥</b>에 있어요. 내심은 어떤 삼각형이든 안에 있어요.')
      };
    },
    prob: (M, s) => {
      const key = `q${s.trQi || 0}`, g = M.pg, ask = (s.trQi || 0) % 2 === 0;
      const pool = [
        { h: '점 O에서 세 꼭짓점 A, B, C까지의 거리가 같다.', f: () => true }, { h: '점 I에서 세 변까지의 거리가 같다.', f: () => true }, { h: '점 I는 삼각형 ABC의 내부에 있다.', f: () => true },
        { h: '점 O는 세 변의 수직이등분선의 교점이다.', f: () => true }, { h: '점 I는 세 내각의 이등분선의 교점이다.', f: () => true }, { h: '$\\angle BIC=90^{\\circ}+${HA}$', f: () => true },
        { h: '$\\overline{IA}=\\overline{IB}=\\overline{IC}$', f: (m) => near(dist(m.pg.I, m.pg.A), dist(m.pg.I, m.pg.B)) && near(dist(m.pg.I, m.pg.B), dist(m.pg.I, m.pg.C)) },
        { h: '점 O는 삼각형 ABC의 내부에 있다.', f: (m) => m.pg.oIn }, { h: '점 O에서 세 변까지의 거리가 같다.', f: (m) => { const d1 = dist(m.pg.O, foot(m.pg.O, m.pg.B, m.pg.C)), d2 = dist(m.pg.O, foot(m.pg.O, m.pg.C, m.pg.A)), d3 = dist(m.pg.O, foot(m.pg.O, m.pg.A, m.pg.B)); return near(d1, d2) && near(d2, d3); } },
        { h: '점 I는 세 변의 수직이등분선의 교점이다.', f: (m) => near(dist(m.pg.I, m.pg.O), 0) }, { h: '$\\angle BOC=\\angle BIC$', f: (m) => near(angBetween(m.pg.O, m.pg.B, m.pg.C), angBetween(m.pg.I, m.pg.B, m.pg.C)) }
      ].map((x) => ({ ...x, h: x.h.replace('${HA}', `\\dfrac{1}{2}\\angle A`).replace('\\dfrac', '\\frac') }));
      const r = mkStmtChoices(pool, M, key + (ask ? 'T' : 'F'), ask);
      return { tag: ask ? '외심·내심의 성질 · 옳은 것' : '[함정] 외심·내심의 성질 · 옳지 않은 것', key: key + (ask ? 'T' : 'F'), stem: `그림에서 점 O는 삼각형 ABC의 외심이고 점 I는 내심이다. 다음 중 ${ask ? '옳은' : '옳지 않은'} 것은?`, choices: r.choices, wide: true, note: '그림의 삼각형은 숫자 바꾸기를 누를 때마다 바뀌어요' };
    },
    verify: (s) => { const M = m3.model(s), g = M.g; return { ans: M.k, model: M.k, extra: [[dist(g.O, g.A), dist(g.O, g.B)], [dist(g.I, g.D), dist(g.I, g.E)]] }; }
  };

  /* ====================================================================== 4. 정삼각형의 O와 I */
  const m4 = {
    id: 't7-4', title: '정삼각형에서는 O와 I가 같은 점', short: '정삼각형의 O와 I',
    question: '정삼각형의 외심과 내심은 어떤 관계이고, 외접원과 내접원의 반지름의 비는?',
    ctl: ['trMr'],
    init: (s) => { s.trMr = 3; s.trV = 0; },
    reroll: (s) => { s.trMr = rint(2, 6); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const r = clamp(Math.round(s.trMr), 2, 6); return { r, R: 2 * r, h: 3 * r }; },
    draw(b, s, M, C) {
      const { r, R, h } = M, st = C.step, v = (s.trV || 0) % 3;
      const O = pt(0, 0), A = polar(O, 1, -90), B = polar(O, 1, 150), Cc = polar(O, 1, 30), D = mid(B, Cc);
      fit(b, { x0: -1.2, x1: 1.2, y0: -1.15, y1: 1.15 }, { t: 40, b: C.problem ? 44 : 60, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'rose', width: 2.6, alpha: 0.85 }); b.circle(O, 0.5, { color: 'green', width: 2.6, alpha: 0.95 });
      fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.6);
      line(b, A, D, 'ink', 2.4, { dash: [6, 5], alpha: 0.7 }); line(b, O, B, 'rose', 3); line(b, O, Cc, 'rose', 3); line(b, O, A, 'rose', 3);
      ang(b, D, O, B, { color: 'sky', r: 14 }); tick(b, A, O, 1, 'amber'); tick(b, B, O, 1, 'amber'); tick(b, Cc, O, 1, 'amber');
      const rr = fs(b, 15);
      if (C.problem) {
        if (v === 0) { G.sideTag(b, O, D, pt(-50, 0), `${r} cm`, { color: 'green', size: rr, gap: 8 }); G.sideTag(b, O, A, pt(50, 0), 'x', { color: 'rose', size: fs(b, 18), gap: 8 }); }
        else if (v === 1) { G.sideTag(b, O, A, pt(50, 0), `${R} cm`, { color: 'rose', size: rr, gap: 8 }); G.sideTag(b, O, D, pt(-50, 0), 'x', { color: 'green', size: fs(b, 18), gap: 8 }); }
        else { G.sideTag(b, O, D, pt(-50, 0), `${r} cm`, { color: 'green', size: rr, gap: 8 }); G.sideTag(b, A, D, pt(50, 0), 'x', { color: 'amber', size: fs(b, 18), gap: 8 }); }
      } else {
        G.sideTag(b, O, A, pt(50, 0), `R = ${R} cm`, { color: 'rose', size: rr, gap: 8 }); G.sideTag(b, O, D, pt(-50, 0), `r = ${r} cm`, { color: 'green', size: rr, gap: 8 });
        if (show(3)) G.sideTag(b, A, D, pt(50, 0), `AD = ${h} cm`, { color: 'amber', size: rr, gap: 38 });
      }
      b.point(O, { color: 'rose', r: 6 }); [A, B, Cc, D].forEach((z) => b.point(z, { color: z === D ? 'green' : 'ink', r: 4.5 }));
      T(b, O, 'O = I', { dx: 24, dy: 4, size: 16, color: 'rose' }); T(b, A, 'A', { dy: -14, size: 18 }); T(b, B, 'B', { dx: -14, dy: 6, size: 18 }); T(b, Cc, 'C', { dx: 14, dy: 6, size: 18 }); T(b, D, 'D', { dy: 16, size: 17, color: 'green' });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '정삼각형은 이등변삼각형 셋 → 외심 = 내심';
        else if (C.review && st === 2) { row = `∠OBC=30°, ∠IBC=30° → OB=2·OD`; col = 'green'; }
        else if (C.review && st === 3) { row = `R=2r=${R}, AD=R+r=3r=${h} (cm)`; col = 'amber'; }
        else row = `r=${r} cm → R=2r=${R} cm, AD=3r=${h} cm`;
        rowT(b, pt(0, 1.0), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `정삼각형은 어느 꼭짓점에서 보아도 이등변삼각형이에요. 그래서 각의 이등분선, 중선, 수선, 변의 수직이등분선이 모두 같은 선이므로 외심과 내심이 같은 점 O예요.`,
      `$\\angle OBC=\\angle IBC=30^{\\circ}$이고 $\\angle ODB=90^{\\circ}$인 △OBD에서 $\\overline{OB}=2\\overline{OD}$ (30°-60°-90°). 즉 외접원의 반지름 R은 내접원의 반지름 r의 2배예요: $R=2r=${2 * M.r * 1}$ ($r=${M.r}$ cm).`,
      `높이 $\\overline{AD}=\\overline{AO}+\\overline{OD}=R+r=${M.R}+${M.r}=${M.h}$ cm, 즉 AD=3r이에요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>내접원의 반지름 r</b>을 바꿔 보세요. 정삼각형에서는 외심과 내심이 <b>같은 점 O</b>이고, 외접원의 반지름은 늘 내접원의 반지름의 <b>2배</b>(R=2r)예요. 높이 AD는 <b>3r</b>이에요.',
      readouts: [rd('내접원의 반지름 r', `${M.r} cm`, 'green'), rd('외접원의 반지름 R', `${M.R} cm`, 'rose', '2 × r'), rd('높이 AD', `${M.h} cm`, 'amber', 'R + r = 3r', null, true)],
      formula: `<p>$R=2r=2\\times${M.r}=${M.R}$ (cm)</p><p>$\\overline{AD}=R+r=3r=${M.h}$ (cm)</p>`,
      rule: '정삼각형의 외심과 내심은 일치하고, 외접원의 반지름 R = 2 × (내접원의 반지름 r), 높이 = 3r이다.',
      notes: notes('R과 r은 같은 점 O에서 <b>다른 거리</b>예요. 꼭짓점까지가 R, 변까지가 r이에요.', '높이는 R만이 아니라 <b>R+r</b>이에요.')
    }),
    prob: (M, s) => {
      const { r, R, h } = M, v = (s.trV || 0) % 3, key = `${v}:${r}`;
      const head = '그림에서 점 O는 정삼각형 ABC의 외심이면서 내심이다.';
      if (v === 0) return numProb({ tag: '정삼각형의 외심과 내심 · R', key, stem: `${head} 내접원의 반지름 ${S('OD')}=${r} cm일 때, 외접원의 반지름 ${S('OA')}의 길이 $x$는?`, correct: R, wrongs: [[r, 'OD의 길이예요. R은 r의 2배예요.'], [h, '높이 AD예요.'], [R + 1, '다시 계산해 보세요.'], [Math.max(1, R - 1), '다시 계산해 보세요.'], [r + 1, '다시 계산해 보세요.']].filter((q) => q[0] !== R && q[0] > 0), ...cmOpts });
      if (v === 1) return numProb({ tag: '정삼각형의 외심과 내심 · r', key, stem: `${head} 외접원의 반지름 ${S('OA')}=${R} cm일 때, 내접원의 반지름 ${S('OD')}의 길이 $x$는?`, correct: r, wrongs: [[R, 'OA의 길이예요. r은 R의 반이에요.'], [h, '높이예요.'], [R * 2, '다시 생각해 보세요.'], [r + 1, '다시 계산해 보세요.'], [Math.max(1, r - 1), '다시 계산해 보세요.']].filter((q) => q[0] !== r && q[0] > 0), ...cmOpts });
      return numProb({ tag: '정삼각형의 외심과 내심 · 높이', key, stem: `${head} 내접원의 반지름 ${S('OD')}=${r} cm일 때, 높이 ${S('AD')}의 길이 $x$는?`, correct: h, wrongs: [[R, 'OA의 길이예요. 높이 AD=OA+OD예요.'], [r, 'OD의 길이예요.'], [h + 1, '다시 계산해 보세요.'], [Math.max(1, h - 1), '다시 계산해 보세요.'], [4 * r, '다시 계산해 보세요.']].filter((q) => q[0] !== h && q[0] > 0), ...cmOpts });
    },
    verify: (s) => { const M = m4.model(s); return { ans: M.R, model: 2 * M.r, extra: [[M.h, M.R + M.r]] }; }
  };

  /* ====================================================================== 5. 중점 D, E, F 와 수선의 발 D, E, F */
  const m5 = {
    id: 't7-5', title: '외심의 D·E·F와 내심의 D·E·F는 달라요', short: '중점과 수선의 발',
    question: '외심에서 변에 내린 점 D와 내심에서 변에 내린 점 D는 같은 위치일까? BD와 CD의 길이는?',
    ctl: ['trMs', 'trMt'],
    init: (s) => { s.trMs = 60; s.trMt = 70; s.trV = 0; s.trM = 6; s.trX = [4, 3, 5]; },
    reroll: (s) => { s.trV = (s.trV + 1) % 3; s.trM = rint(3, 9); s.trX = [rint(2, 7), rint(2, 7), rint(2, 7)]; },
    model: (s) => {
      const a = clamp(Math.round(s.trMs / 2) * 2, 40, 80); let b = clamp(Math.round(s.trMt / 2) * 2, 40, 80); if (a === b) b = b >= 80 ? b - 2 : b + 2; const c = 180 - a - b;
      const [A, B, Cc] = triBC(2, b, c), O = circumcenter(A, B, Cc), I = incenter(A, B, Cc), DO = mid(B, Cc), DI = foot(I, B, Cc);
      return { a, b, c, A, B, C: Cc, O, I, DO, DI, gap: dist(DO, DI), x: s.trX || [4, 3, 5], m: s.trM || 6 };
    },
    draw(b, s, M, C) {
      const { x } = M, st = C.step, v = (s.trV || 0) % 3, showL = !(C.problem && v === 1), showR = !(C.problem && v === 0);
      let { A, B, C: Cc, O, I, DO, DI } = M;
      if (C.problem && v === 1) { // 문제의 세 변 길이에 맞는 삼각형
        const a = x[1] + x[2], bb = x[2] + x[0], c = x[0] + x[1], xx = (c * c - bb * bb + a * a) / (2 * a), hh = Math.sqrt(Math.max(1e-9, c * c - xx * xx)), k = 2 / a;
        B = pt(0, 0); Cc = pt(a * k, 0); A = pt(xx * k, -hh * k); I = incenter(A, B, Cc); DI = foot(I, B, Cc); O = circumcenter(A, B, Cc); DO = mid(B, Cc);
      }
      const wdt = Math.max(B.x, Cc.x) - Math.min(B.x, Cc.x) + 0.4, off = showL && showR ? wdt + 0.9 : 0, sh = (p) => pt(p.x + off, p.y);
      const R2 = [A, B, Cc, I, DI].map(sh);
      const boxPts = (showL ? [A, B, Cc, O, DO] : []).concat(showR ? R2 : []);
      fit(b, bboxOf(boxPts), { t: 50, b: C.problem ? 56 : 96, l: 40, r: 40 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      const [A2, B2, C2, I2, D2] = R2;
      if (showL) {
        fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.4); line(b, O, DO, 'rose', 3); ang(b, DO, O, B, { color: 'rose', r: 14 });
        if (!C.problem) { tick(b, B, DO, 1, 'amber'); tick(b, DO, Cc, 1, 'amber'); }
        b.point(O, { color: 'rose', r: 5.5 }); b.point(DO, { color: 'rose', r: 4 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4 }));
        T(b, O, 'O', { dx: 12, dy: -10, size: 17, color: 'rose' }); T(b, DO, 'D', { dy: 16, size: 17, color: 'rose' });
        T(b, pt((B.x + Cc.x) / 2, A.y), '외심', { dy: -22, size: fs(b, 16), color: 'rose' });
      }
      if (showR) {
        fillPoly(b, [A2, B2, C2], 'sky', 0.08); poly(b, [A2, B2, C2], 'ink', 3.4); line(b, I2, D2, 'green', 3); ang(b, D2, I2, B2, { color: 'green', r: 14 });
        b.circle(I2, dist(I2, D2), { color: 'green', width: 2.2, alpha: 0.8 });
        b.point(I2, { color: 'green', r: 5.5 }); b.point(D2, { color: 'green', r: 4 }); [A2, B2, C2].forEach((z) => b.point(z, { color: 'ink', r: 4 }));
        T(b, I2, 'I', { dx: 12, dy: -10, size: 17, color: 'green' }); T(b, D2, 'D', { dy: 16, size: 17, color: 'green' });
        T(b, pt((B2.x + C2.x) / 2, A2.y), '내심', { dy: -22, size: fs(b, 16), color: 'green' });
      }
      const gc = pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3);
      if (showL) [[A, 'A'], [B, 'B'], [Cc, 'C']].forEach(([p, nm]) => tagOut(b, p, gc, nm, { size: 17 }));
      if (showR) [[A2, 'A'], [B2, 'B'], [C2, 'C']].forEach(([p, nm]) => tagOut(b, p, pt(gc.x + off, gc.y), nm, { size: 17 }));
      if (!C.thumb) {
        const bd = dist(B, DO), bi = dist(B, DI), ci = dist(DI, Cc);
        if (!C.problem) {
          if (show(1)) { T(b, mid(B, DO), 'BD', { dy: 34, size: fs(b, 14), color: 'rose' }); T(b, mid(DO, Cc), 'CD', { dy: 34, size: fs(b, 14), color: 'rose' }); }
          if (show(2)) { T(b, mid(B2, D2), 'BD', { dy: 34, size: fs(b, 14), color: 'green' }); T(b, mid(D2, C2), 'CD', { dy: 34, size: fs(b, 14), color: 'green' }); }
          const cx = (B.x + C2.x) / 2;
          T(b, pt(cx, Math.max(B.y, Cc.y)), `외심의 D: BD=CD (중점) / 내심의 D: BD${Math.abs(bi - ci) < 1e-6 ? '=' : '≠'}CD`, { dy: 62, size: fs(b, 15), color: 'sky' });
          T(b, pt(cx, Math.max(B.y, Cc.y)), Math.abs(bi - bd) < 1e-6 ? '두 점 D의 위치는 같아요' : '두 점 D의 위치가 달라요', { dy: 84, size: fs(b, 14), color: Math.abs(bi - bd) < 1e-6 ? 'ink' : 'rose' });
        } else if (v === 0) {
          T(b, mid(B, Cc), `BC = ${2 * M.m} cm`, { dy: 38, size: fs(b, 15), color: 'sky' }); T(b, mid(B, DO), 'x', { dy: 18, size: fs(b, 18), color: 'amber' });
        } else if (v === 1) {
          T(b, mid(B2, D2), 'x', { dy: 18, size: fs(b, 18), color: 'amber' }); G.sideTag(b, B2, A2, I2, `${x[0] + x[1]} cm`, { color: 'sky', size: fs(b, 15), gap: 8 }); G.sideTag(b, B2, C2, I2, `${x[1] + x[2]} cm`, { color: 'sky', size: fs(b, 15), gap: 22 }); G.sideTag(b, C2, A2, I2, `${x[2] + x[0]} cm`, { color: 'sky', size: fs(b, 15), gap: 8 });
        }
      }
    },
    steps: (M) => [
      `외심 O는 세 변의 <b>수직이등분선</b>의 교점이에요. 변 BC와 만나는 점 D는 BC의 <b>중점</b>이므로 $\\overline{BD}=\\overline{CD}$예요.`.replace(/<\/?b>/g, ''),
      `내심 I에서 변 BC에 내린 <b>수선의 발</b> D는 BC의 중점이 아니에요. 이 삼각형에서는 BD와 CD의 길이가 달라요 (접선의 길이 BD=BF, CD=CE).`.replace(/<\/?b>/g, ''),
      `외심 ↔ 꼭짓점까지 같은 거리, D는 변의 중점. 내심 ↔ 변까지 같은 거리, D는 수선의 발. 같은 이름 D라도 위치와 뜻이 달라요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A, ∠B</b>를 바꿔 보세요. 왼쪽은 <b>외심</b>의 D(변의 중점), 오른쪽은 <b>내심</b>의 D(수선의 발)예요. 두 점 D는 대부분 다른 위치이고, <b>BD=CD</b>는 외심의 D에서만 늘 성립해요.',
      readouts: [rd('∠A · ∠B · ∠C', `${M.a}° · ${M.b}° · ${M.c}°`, 'sky'), rd('외심의 D', 'BD = CD (중점)', 'rose'), rd('내심의 D', '수선의 발 (BD ≠ CD)', 'green', '접선의 길이 BD=BF', null, true)],
      formula: `<p>외심: $\\overline{BD}=\\overline{CD}$ (D는 변의 중점)</p><p>내심: $\\overline{BD}=\\overline{BF}$ (접선의 길이), 일반적으로 $\\overline{BD}\\ne\\overline{CD}$</p>`,
      rule: '외심의 D·E·F는 변의 중점(수직이등분선과 변의 교점), 내심의 D·E·F는 변에 내린 수선의 발(접점)이다.',
      notes: notes('외심의 D: 변을 <b>둘로 똑같이</b> 나눠요. 내심의 D: 변에 <b>수직</b>으로 내린 발이에요.', '문제에서 어느 점의 D인지 먼저 확인하세요(외심인지 내심인지).')
    }),
    prob: (M, s) => {
      const { m, x } = M, v = (s.trV || 0) % 3, key = `${v}:${m}:${x.join(',')}`;
      if (v === 0) return numProb({ tag: '외심의 중점 D', key, stem: `그림에서 점 O는 삼각형 ABC의 외심이고, 점 D는 O에서 변 BC에 내린 수선의 발이다. ${S('BC')}=${2 * m} cm일 때, ${S('BD')}의 길이 $x$는?`, correct: m, wrongs: [[2 * m, 'BC의 길이예요. D는 BC의 중점이에요.'], [m + 1, '다시 생각해 보세요.'], [Math.max(1, m - 1), '다시 생각해 보세요.'], [m + 2, '다시 생각해 보세요.'], [3 * m, '다시 생각해 보세요.']], ...cmOpts });
      if (v === 1) return numProb({ tag: '[함정] 내심의 수선의 발 D', key, stem: `그림에서 점 I는 삼각형 ABC의 내심이고, 점 D는 I에서 변 BC에 내린 수선의 발이다. ${S('AB')}=${x[0] + x[1]} cm, ${S('BC')}=${x[1] + x[2]} cm, ${S('CA')}=${x[2] + x[0]} cm일 때, ${S('BD')}의 길이 $x$는?`, correct: x[1], wrongs: [[(x[1] + x[2]) / 2, 'BC의 반이에요. 내심의 D는 BC의 중점이 아니에요.'], [x[0], 'AF의 길이예요.'], [x[2], 'CD의 길이예요.'], [x[1] + 1, '다시 계산해 보세요.'], [Math.max(1, x[1] - 1), '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== x[1] && q[0] > 0), ...cmOpts });
      const pool = [
        { h: '외심에서 변에 내린 수선의 발은 그 변의 중점이다.', f: () => true }, { h: '내심에서 세 변까지의 거리는 같다.', f: () => true }, { h: '외심에서 세 꼭짓점까지의 거리는 같다.', f: () => true }, { h: '내심에서 변에 내린 수선의 발에서 같은 점에서 그은 접선의 길이는 같다.', f: () => true }, { h: '내심에서 변에 내린 수선의 발은 항상 그 변의 중점이다.', f: () => false },
        { h: '외심에서 변에 내린 수선의 발은 변의 중점이 아닐 수 있다.', f: () => false }, { h: '내심에서 세 꼭짓점까지의 거리는 항상 같다.', f: () => false }, { h: '외심에서 세 변까지의 거리는 항상 같다.', f: () => false }
      ];
      const ask = true, r = mkStmtChoices(pool, M, key, ask);
      return { tag: '외심·내심의 D, E, F 구별 · 옳은 것', key, stem: '그림의 왼쪽은 삼각형 ABC의 외심 O를, 오른쪽은 내심 I를 나타낸 것이다. 다음 중 옳은 것은?', choices: r.choices, wide: true };
    },
    verify: (s) => { const M = m5.model(s); return { ans: dist(M.B, M.DO), model: dist(M.DO, M.C), extra: [[dist(M.O, M.A), dist(M.O, M.B)], [dist(M.I, M.DI), M.I === null ? 0 : dist(M.I, foot(M.I, M.C, M.A))]] }; }
  };

  G.register(70, 't7', '⑦ 외심·내심', '외심·내심', PARAMS, [m1, m2, m3, m4, m5]);
})();
