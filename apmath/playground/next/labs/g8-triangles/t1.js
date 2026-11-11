/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ① 「이등변삼각형」 (t1.js, order 10) — 장면 7개
   · i1 두 밑각            · 꼭지각·AB=AC 조절, 꼭짓점 B·C를 가로로 끌기, AD로 접기(제자리 회전), 「일반 삼각형 보기」 칩
   · i2 두 각이 같으면      · ∠B, ∠C 조절 → 같을 때만 AB=AC 표시 (이등변삼각형이 되는 조건)
   · i3 꼭지각의 이등분선    · 꼭지각 조절, △ABD≡△ACD(SAS)를 단계로 확인 (AD는 이등분선이자 중선이자 수선)
   · i4 직각이등변삼각형     · AD=BD=CD 길이 조절, BC=2AD
   · i5 옆으로 누운 이등변   · 꼭지각 조절, 꼭짓점 A를 가로로 끌기 (꼭지각이 왼쪽에 있어도 같은 성질)
   · i6 대칭축 위의 점 P     · 점 P를 AD 위에서 가로로 끌기, PB=PC
   · i7 변의 길이가 식       · 두 변이 (5x−6), (2x+3)일 때 x를 움직여 같아지는 곳 찾기
   모든 각의 값·식·보기·정답은 지금의 조절 값에서 다시 계산됩니다. 각과 길이는 모두 정수만 보입니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { dim, DEG, clamp, seg01, pt, add, sub, mul, unit, mid, lerp, dist, polar, angBetween, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, mkChoices, mkStmtChoices, numProb, degOpts, cmOpts, rd, notes, fmtN, dg, foot, bboxOf, josa, fs, triBC } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG), tan = (d) => Math.tan(d * DEG);
  const S = (n) => `$\\overline{${n}}$`; // 선분 이름(발문용)
  const fr = (n, d) => `\\frac{${n}}{${d}}`;
  const even = (v) => Math.round(v / 2) * 2;

  const PARAMS = {
    trIa: P('꼭지각 ∠A', 20, 140, 2, 80, { color: 'amber', hint: '그림의 꼭짓점 B, C를 가로로 끌어도 돼요', format: (v) => v + '°' }),
    trIl: P('AB = AC', 4, 12, 1, 8, { color: 'sky', format: (v) => v + ' cm' }),
    trIf: P('AD로 접기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 AD를 따라 왼쪽 반이 접혀요', format: (v) => Math.round(v * 100) + '%' }),
    trIb: P('∠B', 30, 80, 1, 50, { color: 'sky', format: (v) => v + '°' }),
    trIc: P('∠C', 30, 80, 1, 70, { color: 'green', format: (v) => v + '°' }),
    trJb: P('∠B', 40, 70, 1, 55, { color: 'sky', hint: '꼭짓점 A를 가로로 끌어도 돼요', format: (v) => v + '°' }),
    trJc: P('∠C', 40, 70, 1, 55, { color: 'green', format: (v) => v + '°' }),
    trKa: P('꼭지각 ∠A', 20, 140, 2, 50, { color: 'amber', format: (v) => v + '°' }),
    trKt: P('AD로 접기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르면 AD를 따라 왼쪽 반이 접혀 오른쪽 반과 겹쳐요', format: (v) => Math.round(v * 100) + '%' }),
    trMm: P('AD = BD = CD', 2, 9, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    trLa: P('꼭지각 ∠A', 40, 140, 2, 80, { color: 'amber', hint: '꼭짓점 A를 가로로 끌어도 돼요', format: (v) => v + '°' }),
    trPa: P('꼭지각 ∠A', 40, 120, 2, 60, { color: 'sky', format: (v) => v + '°' }),
    trPt: P('∠PBC', 10, 40, 1, 20, { color: 'amber', hint: '점 P를 AD 위에서 가로로 끌어도 돼요', format: (v) => v + '°' }),
    trExprX: P('x', 2, 9, 1, 5, { color: 'amber', hint: 'x를 바꿔 두 변이 같아지는 곳을 찾아보세요', format: (v) => String(v) })
  };

  // 꼭지각 a(짝수), 한 변 1: A 위쪽, BC 가로, D = BC의 중점(원점)
  const isoUp = (a) => { const h = (a * DEG) / 2; return { A: pt(0, -Math.cos(h)), B: pt(-Math.sin(h), 0), C: pt(Math.sin(h), 0), D: pt(0, 0) }; };
  // 꼭지각이 왼쪽: 밑변 BC 세로(길이 2), A 가 왼쪽
  const isoSide = (a) => { const h = (a * DEG) / 2, hh = Math.cos(h) / Math.sin(h); return { A: pt(-hh, 0), B: pt(0, -1), C: pt(0, 1), D: pt(0, 0) }; };
  const rowDy = (b) => (b.W < 560 ? 52 : 62);

  /* ====================================================================== 1. 두 밑각 (+ 일반 삼각형 보기) */
  function i1Model(s) {
    const gen = !!s.trGen;
    if (gen) {
      const Bd = clamp(Math.round(s.trIb), 30, 80), Cd = clamp(Math.round(s.trIc), 30, 80), Ad = 180 - Bd - Cd;
      const [A, B0, C0] = triBC(2, Bd, Cd), dx = 1, B = pt(B0.x - dx, 0), C = pt(C0.x - dx, 0), A2 = pt(A.x - dx, A.y);
      const AB = dist(A2, B), AC = dist(A2, C), t = AB / (AB + AC), Dd = lerp(B, C, t), M = pt(0, 0), H = foot(A2, B, C);
      return { gen, a: Ad, b: Bd, c: Cd, tri: { A: A2, B, C }, D: Dd, M, H, same: Bd === Cd };
    }
    const a = clamp(even(s.trIa), 20, 140), L = clamp(Math.round(s.trIl), 4, 12), b = (180 - a) / 2, g = isoUp(a);
    return { gen, a, b, c: b, L, tri: g, D: g.D, M: g.D, H: g.D, same: true };
  }
  const i1 = {
    id: 't1-1', title: '이등변삼각형의 두 밑각', short: '두 밑각',
    question: '두 변의 길이가 같은 삼각형(이등변삼각형)에서 두 밑각의 크기는 어떤 관계일까?',
    ctl: (s) => (s.trGen ? ['trIb', 'trIc'] : ['trIa', 'trIl', 'trIf']),
    anim: { key: 'trIf', dur: 4, label: 'AD로 접어 보기', start: 0 },
    presets: () => [
      { group: '삼각형의 종류', label: 'AB=AC (이등변)', apply: (s) => { s.trGen = false; s.trIf = 0; }, on: (s) => !s.trGen },
      { label: '일반 삼각형 보기', apply: (s) => { s.trGen = true; s.playing = false; }, on: (s) => !!s.trGen }
    ],
    init: (s) => { s.trIa = 80; s.trIl = 8; s.trIf = 0; s.trIb = 50; s.trIc = 70; s.trGen = false; s.trV = 0; },
    reroll: (s) => { s.trIa = pick([40, 50, 56, 64, 70, 76, 84, 90, 100], s.trIa); s.trIb = pick([36, 40, 46, 52, 58, 64, 70], s.trIb); s.trV = (s.trV + 1 + rint(0, 1)) % 3; },
    model: i1Model,
    draw(b, s, M, C) {
      const { gen, a, b: Bd, c: Cd, tri } = M, { A, B, C: Cc } = tri, D = M.D;
      const f = C.problem ? 0 : C.review ? (C.step >= 2 ? 1 : 0) : (s.trIf || 0);
      const v = (s.trV || 0) % 3;
      let E = null;
      if (C.problem && v === 2) E = pt(Cc.x + 0.7, 0);
      fit(b, gen ? bboxOf([A, B, Cc]) : { x0: -1.05, x1: C.problem && v === 2 ? Math.max(1.05, Cc.x + 0.9) : 1.05, y0: -1.02, y1: 0.05 }, { t: 40, b: C.problem ? 40 : 88, l: 40, r: C.problem && v === 2 ? 30 : 44 });
      const cen = pt(0, A.y * 0.4);
      fillPoly(b, [A, B, Cc], 'sky', 0.1);
      poly(b, [A, B, Cc], 'ink', 3.6);
      if (E) line(b, Cc, E, 'ink', 3.4);
      if (!gen) { tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber'); }
      // 일반 삼각형: 세 가지 선분이 한 점으로 모이지 않음
      if (gen && !C.problem) {
        line(b, A, M.D, 'green', 3); line(b, A, M.M, 'sky', 3); line(b, A, M.H, 'amber', 3);
        [[M.D, 'D', 'green', 20], [M.M, 'M', 'sky', 44], [M.H, 'H', 'amber', 20]].forEach(([q, nmm, col, dy]) => { b.point(q, { color: col, r: 4.5 }); T(b, q, nmm, { dy, size: 16, color: col }); });
      }
      // 접기: 왼쪽 반(△ABD)이 AD를 축으로 제자리 회전
      if (!gen && f > 0.001) {
        const k = cos(180 * f), fold = (p) => pt(D.x + (p.x - D.x) * k, p.y);
        fillPoly(b, [A, fold(B), D], 'green', 0.3);
        poly(b, [A, fold(B), D], 'green', 2.8, { dash: [6, 5] });
        line(b, A, D, 'green', 3);
      }
      if (!gen && !C.problem && (C.review ? C.step >= 2 : true)) line(b, A, D, 'green', 2.6, { dash: [6, 5], alpha: f > 0.001 ? 0.0 : 1 });
      // 각 표시
      if (C.problem) {
        const ex = v === 2, apex = v === 1, bc = v === 0 ? 'amber' : 'sky';
        ang(b, B, Cc, A, { color: bc, r: 30, rings: 1, label: v === 0 ? 'x' : apex ? dg(Bd) : '', size: 17, fa: 0.2 });
        ang(b, Cc, A, B, { color: bc, r: 30, rings: 1, label: '', size: 17, fa: 0.2 }); // 같은 밑각(같은 표시)
        ang(b, A, B, Cc, { color: apex ? 'amber' : 'sky', r: 32, rings: 1, label: apex ? 'x' : dg(a), size: 17, fa: 0.2, labelDist: 54 });
        if (ex) { ang(b, Cc, A, E, { color: 'amber', r: 34, label: 'x', size: 17, big: false }); }
      } else {
        const rg = gen ? 1 : 2;
        ang(b, B, Cc, A, { color: 'sky', r: 30, rings: rg, label: dg(Bd), size: 16, labelDist: 52 });
        ang(b, Cc, A, B, { color: gen ? 'green' : 'sky', r: 30, rings: gen ? 2 : rg, label: dg(Cd), size: 16, labelDist: 52 });
        ang(b, A, B, Cc, { color: 'amber', r: 30, rings: 1, label: dg(a), size: 16, labelDist: 50 });
      }
      // 길이 (그림 안)
      if (!gen && !C.problem) { G.sideTag(b, A, B, cen, `${M.L} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); G.sideTag(b, A, Cc, cen, `${M.L} cm`, { color: 'sky', size: fs(b, 16), gap: 6 }); }
      // 점 이름
      b.point(A, { color: 'ink', r: 4.5 });
      tagOut(b, A, cen, 'A', { size: 18 });
      if (!gen && !C.problem && !C.thumb && !C.review) {
        b.handle('B', B, { color: 'amber', r: 8, ariaLabel: '꼭짓점 B를 가로로 끌기', drag: (w) => { s.trIa = clamp(even(2 * Math.asin(clamp(Math.abs(w.x) / 1, 0.17, 0.94)) / DEG), 20, 140); } });
        b.handle('C', Cc, { color: 'amber', r: 8, ariaLabel: '꼭짓점 C를 가로로 끌기', drag: (w) => { s.trIa = clamp(even(2 * Math.asin(clamp(Math.abs(w.x) / 1, 0.17, 0.94)) / DEG), 20, 140); } });
      } else { b.point(B, { color: 'ink', r: 4.5 }); b.point(Cc, { color: 'ink', r: 4.5 }); }
      tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 });
      if (E) T(b, E, 'D', { dy: 18, size: 18 });
      if (!gen && !C.problem && (C.review ? C.step >= 2 : f > 0.5)) { b.point(D, { color: 'green', r: 4 }); T(b, D, 'D', { dy: 18, size: 17, color: 'green' }); ang(b, D, B, A, { color: 'green', r: 20 }); }
      // 아래 줄
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (gen) { row = Bd === Cd ? `∠B=∠C=${Bd}° — 이때만 AB=AC` : `∠B=${Bd}° ≠ ∠C=${Cd}° → AB≠AC, D·M·H가 서로 달라요`; col = Bd === Cd ? 'green' : 'rose'; }
        else if (C.review && C.step === 1) row = `AB=AC=${M.L} cm  (이등변삼각형)`;
        else if (C.review && C.step === 2) { row = '∠B=∠C (접으면 포개어져요)'; col = 'green'; }
        else if (f >= 0.999 || C.review) { row = `∠B=∠C=(180°−${a}°)÷2=${Bd}°`; col = 'green'; }
        else row = `AB=AC=${M.L} cm  →  ∠B=∠C=${Bd}°`;
        rowT(b, pt(0, 0), row, { dy: rowDy(b), size: fs(b, 17), color: col });
      }
      if (C.problem && !C.thumb) {
        T(b, pt(0, 0), '', {});
      }
    },
    stepT: (n) => (n >= 2 ? 1 : 0),
    steps: (M) => [
      `$\\overline{AB}=\\overline{AC}$이므로 삼각형 ABC는 이등변삼각형이에요. 두 변 AB, AC의 길이가 같다고 표시해요.`,
      `꼭지각 ∠A의 이등분선 AD를 그어 접으면 △ABD와 △ACD가 포개어져요. 그래서 $\\angle B=\\angle C$ (두 밑각의 크기는 같아요).`,
      `삼각형의 내각의 합은 $180^{\\circ}$이므로 $\\angle B=\\angle C=${fr('180^{\\circ}-\\angle A', 2)}=${fr(`180^{\\circ}-${M.a}^{\\circ}`, 2)}=${M.b}^{\\circ}$`
    ],
    view: (M, C, s) => M.gen ? {
      guide: '<b>일반 삼각형</b>에서는 ∠B와 ∠C를 바꿔 보세요. ∠B와 ∠C가 <b>같을 때만</b> AB=AC가 되고, 꼭지각의 이등분선(D)·중선(M)·수선(H)이 한 점으로 모여요.',
      readouts: [rd('∠B', `${M.b}°`, 'sky'), rd('∠C', `${M.c}°`, 'green'), rd('∠A', `${M.a}°`, 'amber'), rd('D, M, H', M.same ? '한 점' : '서로 달라요', M.same ? 'green' : 'rose', null, null, true)],
      status: M.same ? { tone: 'ok', text: '∠B=∠C — 이등변삼각형' } : { tone: 'warn', text: '∠B≠∠C — 이등변삼각형이 아니에요' },
      formula: `<p>이등변삼각형이 아니면 $\\angle B\\ne\\angle C$이고, 이등분선 AD·중선 AM·수선 AH가 서로 달라요.</p>`,
      rule: '두 밑각이 같고, 꼭지각의 이등분선·중선·수선이 한 선분이 되는 것은 이등변삼각형일 때뿐이에요.',
      notes: notes('일반 삼각형에서는 ∠B≠∠C예요. 밑각이 같다고 쓰면 안 돼요.', '꼭지각의 이등분선·중선·수선이 한 선분이 되는 것은 AB=AC일 때뿐이에요.')
    } : {
      guide: '막대로 <b>꼭지각 ∠A</b>와 <b>AB=AC</b>를 바꿔 보세요. 꼭짓점 B, C를 가로로 끌어도 돼요. ▶를 누르면 AD를 따라 접혀서 두 밑각이 포개어져요. 칩에서 <b>일반 삼각형 보기</b>를 고르면 반례를 볼 수 있어요.',
      readouts: [rd('∠A', `${M.a}°`, 'amber'), rd('∠B = ∠C', `${M.b}°`, 'sky', '(180° − ∠A) ÷ 2'), rd('AB = AC', `${M.L} cm`, 'sky')],
      formula: `<p>$\\angle B=\\angle C=${fr('180^{\\circ}-\\angle A', 2)}=${fr(`180^{\\circ}-${M.a}^{\\circ}`, 2)}=${M.b}^{\\circ}$</p>`,
      rule: '이등변삼각형의 두 밑각의 크기는 같다.',
      notes: notes('같은 길이의 두 변이 <b>만나는 점</b>이 꼭지점이에요. 꼭지각은 그 점의 각이고, 나머지 두 각이 밑각이에요.', '꼭지각이 아니라 <b>밑각</b>이 같아요. $\\angle B=\\angle C$.')
    },
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, a = M.a, bb = M.b;
      if (v === 0) return numProb({ tag: '이등변삼각형의 밑각', key: `0:${a}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ∠A=${a}°일 때, ∠B의 크기 $x$는?`, correct: bb, wrongs: [[a, '꼭지각 ∠A 그대로 썼어요. 밑각은 (180°−∠A)÷2예요.'], [180 - a, '두 밑각의 합을 구했어요. 하나로 나누어야 해요.'], [90 - a / 2, '밑각이 아니라 다른 각이에요.'], [bb + 10, '다시 계산해 보세요.'], [bb - 10, '다시 계산해 보세요.']], ...degOpts(5) });
      if (v === 1) return numProb({ tag: '이등변삼각형의 꼭지각', key: `1:${bb}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ∠B=${bb}°일 때, ∠A의 크기 $x$는?`, correct: a, wrongs: [[bb, '밑각 ∠B와 같다고 했어요.'], [180 - bb, '∠B의 보각을 구했어요.'], [180 - bb * 3, '내각의 합에서 ∠B를 한 번만 뺐어요. ∠C=∠B도 빼야 해요.'], [a + 10, '다시 계산해 보세요.'], [a - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== a), ...degOpts(5) });
      return numProb({ tag: '[함정] 이등변삼각형의 외각', key: `2:${a}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ∠A=${a}°이고, 변 BC의 연장선 위에 점 D를 잡았다. ∠ACD의 크기 $x$는?`, correct: 90 + a / 2, wrongs: [[bb, '밑각 ∠ACB를 구했어요. x는 그 바깥쪽의 외각이에요.'], [a + bb, '외각은 이웃하지 않는 두 내각의 합이에요. ∠A와 ∠B예요. 계산해 보세요.'], [180 - a, '∠A의 보각을 구했어요.'], [a, '꼭지각 그대로예요.'], [90 + a / 2 + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== 90 + a / 2), ...degOpts(5) });
    },
    verify: (s) => { const M = i1.model(s), { A, B, C } = M.tri; return { ans: angBetween(B, A, C), model: M.b, extra: [[angBetween(C, A, B), M.b], [angBetween(A, B, C), M.a]] }; }
  };

  /* ====================================================================== 2. 두 각이 같으면 이등변 */
  function i2Model(s) {
    const Bd = clamp(Math.round(s.trJb), 40, 70), Cd = clamp(Math.round(s.trJc), 40, 70), Ad = 180 - Bd - Cd;
    const [A, B0, C0] = triBC(2, Bd, Cd), tri = { A: pt(A.x - 1, A.y), B: pt(-1, 0), C: pt(1, 0) };
    return { b: Bd, c: Cd, a: Ad, tri, eq: Bd === Cd, AB: dist(tri.A, tri.B), AC: dist(tri.A, tri.C) };
  }
  const i2 = {
    id: 't1-2', title: '두 각이 같으면 이등변삼각형', short: '이등변이 되는 조건',
    question: '삼각형의 두 내각의 크기가 같으면, 그 두 각의 대변(마주 보는 변)은 어떤 관계일까?',
    ctl: ['trJb', 'trJc'],
    init: (s) => { s.trJb = 55; s.trJc = 55; s.trV = 0; },
    reroll: (s) => { s.trJb = pick([40, 45, 50, 55, 60, 65, 70], s.trJb); s.trV = (s.trV + 1) % 2; s.trM = rint(4, 12); },
    model: i2Model,
    draw(b, s, M, C) {
      const { tri, eq, b: Bd, c: Cd } = M, { A, B, C: Cc } = tri, D = pt(A.x, 0);
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: 88, l: 44, r: 44 });
      const cen = pt(A.x * 0.3, A.y * 0.4), v = (s.trV || 0) % 2;
      fillPoly(b, [A, B, Cc], eq ? 'green' : 'sky', 0.12);
      poly(b, [A, B, Cc], 'ink', 3.6);
      if (C.problem) {
        ang(b, B, Cc, A, { color: 'sky', r: 30, rings: 2, size: 16 });
        ang(b, Cc, A, B, { color: 'sky', r: 30, rings: 2, size: 16 });
        const m = s.trM || 8;
        G.sideTag(b, A, B, cen, `${m} cm`, { color: 'sky', size: fs(b, 17), gap: 6 });
        G.sideTag(b, A, Cc, cen, 'x', { color: 'amber', size: fs(b, 18), gap: 6 });
        if (v === 1) T(b, A, dg(M.a), { dy: 50, size: 17, color: 'sky' });
      } else {
        ang(b, B, Cc, A, { color: eq ? 'sky' : 'sky', r: 30, rings: 2, label: dg(Bd), size: 16, labelDist: 54 });
        ang(b, Cc, A, B, { color: eq ? 'sky' : 'green', r: 30, rings: eq ? 2 : 3, label: dg(Cd), size: 16, labelDist: 54 });
        if (eq && (!C.review || C.step >= 3)) { tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber'); }
        if (C.review && C.step >= 2) { line(b, A, D, 'green', 3, { dash: [6, 5] }); b.point(D, { color: 'green', r: 4 }); T(b, D, 'D', { dy: 18, size: 17, color: 'green' }); }
      }
      b.point(A, { color: 'ink', r: 4.5 }); tagOut(b, A, cen, 'A', { size: 18 });
      if (!C.thumb && !C.problem && !C.review) {
        b.handle('A', A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A를 가로로 끌기', drag: (w) => {
          const bAng = Math.atan2(-w.y, w.x + 1) / DEG, cAng = Math.atan2(-w.y, 1 - w.x) / DEG;
          const nb = clamp(Math.round(bAng), 40, 70), nc = clamp(Math.round(cAng), 40, 70);
          s.trJb = nb; s.trJc = nc;
        } });
      } else { b.point(B, { color: 'ink', r: 4.5 }); b.point(Cc, { color: 'ink', r: 4.5 }); }
      b.point(B, { color: 'ink', r: 4.5 }); b.point(Cc, { color: 'ink', r: 4.5 });
      tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && C.step === 1) row = `∠B=${Bd}°, ∠C=${Cd}°`;
        else if (C.review && C.step === 2) { row = '수선 AD → △ABD와 △ACD를 비교해요'; col = 'green'; }
        else if (eq) { row = `∠B=∠C=${Bd}° → AB=AC (이등변삼각형)`; col = 'green'; }
        else row = `∠B=${Bd}° ≠ ∠C=${Cd}° → AB≠AC`;
        rowT(b, pt(A.x * 0.2, 0), row, { dy: rowDy(b), size: fs(b, 17), color: col });
      }
    },
    steps: (M) => [
      `$\\angle B=\\angle C$인 삼각형 ABC를 생각해요. 이때 $\\overline{AB}=\\overline{AC}$임을 보이려 해요.`,
      `꼭짓점 A에서 변 BC에 수선 AD를 그으면 $\\angle ADB=\\angle ADC=90^{\\circ}$이고, 내각의 합에서 $\\angle BAD=\\angle CAD$예요. AD는 공통이므로 △ABD≡△ACD (ASA 합동)이에요.`,
      `합동인 도형의 대응변의 길이는 같으므로 $\\overline{AB}=\\overline{AC}$. 즉 두 내각이 같으면 이등변삼각형이에요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠B와 ∠C</b>를 바꾸거나 꼭짓점 A를 가로로 끌어 보세요. ∠B와 ∠C가 <b>같을 때만</b> AB=AC가 돼요.',
      readouts: [rd('∠B', `${M.b}°`, 'sky'), rd('∠C', `${M.c}°`, M.eq ? 'sky' : 'green'), rd('두 변 AB, AC', M.eq ? '길이가 같아요' : '길이가 달라요', M.eq ? 'green' : 'rose', null, null, true)],
      status: M.eq ? { tone: 'ok', text: '이등변삼각형이에요 (AB=AC)' } : { tone: 'info', text: '∠B와 ∠C가 달라요' },
      formula: `<p>$\\angle B=\\angle C \\Rightarrow \\overline{AB}=\\overline{AC}$</p>`,
      rule: '삼각형에서 두 내각의 크기가 같으면 그 삼각형은 이등변삼각형이다.',
      notes: notes('같은 각의 <b>대변</b>이 같아요. ∠B=∠C이면 ∠B의 대변 AC와 ∠C의 대변 AB가 같아요.', '합동 조건은 ASA예요. 한 변 AD와 그 양 끝 각이 같아요.')
    }),
    prob: (M, s) => {
      const m = s.trM || 8, v = (s.trV || 0) % 2;
      if (v === 0) return numProb({ tag: '이등변삼각형이 되는 조건', key: `0:${m}`, stem: `그림과 같은 삼각형 ABC에서 ∠B=∠C이고 ${S('AB')}=${m} cm일 때, ${S('AC')}의 길이 $x$는?`, correct: m, wrongs: [[m * 2, '두 배로 구했어요. 같은 각의 대변은 길이가 같아요.'], [m + 1, '다시 생각해 보세요.'], [m - 1, '다시 생각해 보세요.'], [m + 2, '다시 생각해 보세요.'], [m - 2, '다시 생각해 보세요.']], ...cmOpts });
      const a = M.a;
      return numProb({ tag: '이등변삼각형이 되는 조건', key: `1:${m}:${a}`, stem: `그림과 같은 삼각형 ABC에서 ∠A=${a}°이고 ∠B=∠C이다. ${S('AB')}=${m} cm일 때, ${S('AC')}의 길이 $x$는?`, correct: m, wrongs: [[m * 2, '두 배로 구했어요. ∠B=∠C이면 AB=AC예요.'], [m + 1, '다시 생각해 보세요.'], [m - 1, '다시 생각해 보세요.'], [m + 2, '다시 생각해 보세요.'], [m - 2, '다시 생각해 보세요.']], ...cmOpts });
    },
    verify: (s) => { const M = i2.model(s); return { ans: M.eq ? 1 : 0, model: M.eq ? 1 : 0 }; }
  };

  /* ====================================================================== 3. 꼭지각의 이등분선 AD */
  const i3 = {
    id: 't1-3', title: '꼭지각의 이등분선', short: '꼭지각의 이등분선',
    question: '이등변삼각형의 꼭지각의 이등분선은 밑변과 어떻게 만날까?',
    ctl: ['trKa', 'trKt'], anim: { key: 'trKt', dur: 4, label: 'AD로 접어 보기', start: 0 },
    init: (s) => { s.trKa = 50; s.trKt = 0; s.trV = 0; },
    reroll: (s) => { s.trKa = pick([30, 40, 50, 56, 60, 70, 80, 100], s.trKa); s.trV = (s.trV + 1 + rint(0, 1)) % 3; s.trM = rint(3, 9); },
    model: (s) => { const a = clamp(even(s.trKa), 20, 140), b = (180 - a) / 2; return { a, b, h: a / 2, g: isoUp(a), m: s.trM || 6 }; },
    draw(b, s, M, C) {
      const { a, b: Bd, h, g } = M, { A, B, C: Cc, D } = g;
      fit(b, { x0: -1.05, x1: 1.05, y0: -1.02, y1: 0.05 }, { t: 40, b: C.problem ? 40 : 88, l: 44, r: 44 });
      const cen = pt(0, A.y * 0.4), st = C.step, v = (s.trV || 0) % 3;
      const f = C.problem ? 0 : C.review ? (st >= 2 ? 1 : 0) : (s.trKt || 0);
      fillPoly(b, [A, B, D], C.review && st >= 2 ? 'green' : 'sky', 0.12);
      fillPoly(b, [A, D, Cc], C.review && st >= 2 ? 'violet' : 'sky', 0.12);
      poly(b, [A, B, Cc], 'ink', 3.6);
      tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      line(b, A, D, 'green', 3.4);
      if (C.problem) {
        // 이등분선: 같은 크기의 두 각(같은 표시, 사이를 띄움). 값은 주어진 것만 적는다.
        ang(b, A, B, D, { color: 'sky', r: 34, rings: 1, cut: [0, 7] }); ang(b, A, D, Cc, { color: 'sky', r: 34, rings: 1, cut: [7, 0] });
        if (v === 0) { const dd = Math.max(sin(h / 2) * 66, G.textW(dg(h), 16) / 2 + 4); T(b, A, dg(h), { dx: -dd, dy: cos(h / 2) * 66, size: 16, color: 'sky' }); ang(b, B, Cc, A, { color: 'amber', r: 30, label: 'x', size: 17 }); }
        else if (v === 1) { ang(b, A, B, Cc, { color: 'sky', r: 56, label: dg(a), size: 16, labelDist: 76, fa: 0.05 }); ang(b, D, B, A, { color: 'amber', r: 22, noRight: true, label: 'x', size: 17, labelDist: 38 }); }
        else { G.sideTag(b, B, D, pt(0, -1), `${M.m} cm`, { color: 'sky', size: fs(b, 17), gap: 4 }); dim(b, B, Cc, pt(0, -1), 'x', { color: 'amber', size: fs(b, 18), off: 30 }); }
      } else {
        if (C.review ? st >= 2 : true) {
          ang(b, A, B, D, { color: 'sky', r: 34, rings: 1, cut: [0, 7] });
          ang(b, A, D, Cc, { color: 'sky', r: 34, rings: 1, cut: [7, 0] });
          { const dd = Math.max(sin(h / 2) * 66, G.textW(dg(h), 16) / 2 + 4), dy = cos(h / 2) * 66; T(b, A, dg(h), { dx: -dd, dy, size: 16, color: 'sky' }); T(b, A, dg(h), { dx: dd, dy, size: 16, color: 'sky' }); }
          ang(b, D, B, A, { color: 'amber', r: 22 }); ang(b, D, A, Cc, { color: 'amber', r: 22 });
          ang(b, B, Cc, A, { color: 'green', r: 30, rings: 2, label: dg(Bd), size: 16, labelDist: 52 });
          ang(b, Cc, A, B, { color: 'green', r: 30, rings: 2, label: dg(Bd), size: 16, labelDist: 52 });
        }
      }
      if (f > 0.001) { // 접기 겹침
        const k = cos(180 * f), fold = (p) => pt(D.x + (p.x - D.x) * k, p.y);
        poly(b, [A, fold(B), D], 'amber', 2.8, { dash: [6, 5] });
      }
      [A, B, Cc, D].forEach((q) => b.point(q, { color: q === D ? 'green' : 'ink', r: 4.5 }));
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, D, 'D', { dy: 18, size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `AB=AC, ∠BAD=∠CAD=${h}°, AD 공통`;
        else if (C.review && st === 2) { row = '△ABD ≡ △ACD (SAS 합동)'; col = 'green'; }
        else if (C.review && st === 3) { row = 'BD=CD, ∠ADB=∠ADC=90°'; col = 'green'; }
        else row = `∠BAD=∠CAD=${h}°  →  BD=CD, AD⊥BC`;
        rowT(b, pt(0, 0), row, { dy: rowDy(b), size: fs(b, 17), color: col });
      }
    },
    stepT: (n) => (n >= 2 ? 1 : 0),
    steps: (M) => [
      `AB=AC이고 AD는 꼭지각의 이등분선이므로 $\\angle BAD=\\angle CAD=${M.h}^{\\circ}$이고, AD는 두 삼각형에 공통이에요.`,
      `두 변과 그 끼인각이 각각 같으므로 △ABD≡△ACD (SAS 합동)이에요.`,
      `대응변의 길이가 같으므로 $\\overline{BD}=\\overline{CD}$ (AD는 BC의 중선), 대응각의 크기가 같으므로 $\\angle ADB=\\angle ADC=90^{\\circ}$ (AD⊥BC)이에요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>꼭지각</b>을 바꾸거나 ▶를 눌러 보세요. 꼭지각의 이등분선 AD로 접으면 두 삼각형이 포개어져요. AD는 <b>이등분선이면서 중선이면서 수선</b>이에요.',
      readouts: [rd('∠BAD = ∠CAD', `${M.h}°`, 'sky', '꼭지각의 반'), rd('∠B = ∠C', `${M.b}°`, 'green'), rd('∠ADB', '90°', 'amber', 'AD ⊥ BC', null, true)],
      formula: `<p>△ABD≡△ACD (SAS)</p><p>$\\overline{BD}=\\overline{CD},\\ \\angle ADB=\\angle ADC=90^{\\circ}$</p>`,
      rule: '이등변삼각형의 꼭지각의 이등분선은 밑변을 수직이등분한다.',
      notes: notes('AD가 밑변을 <b>수직</b>으로 이등분해요. ∠ADB=90°이고 BD=CD예요.', '밑각이 아니라 <b>꼭지각</b>의 이등분선일 때만 이렇게 돼요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { a, b: bb, h, m } = M;
      if (v === 0) return numProb({ tag: '꼭지각의 이등분선과 밑각', key: `0:${a}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ${S('AD')}는 ∠A의 이등분선이고 ∠BAD=${h}°이다. ∠B의 크기 $x$는?`, correct: bb, wrongs: [[h, '∠BAD 그대로 썼어요. 삼각형 ABD에서 ∠ADB=90°를 써야 해요.'], [180 - 2 * h, '∠A를 구했어요.'], [90 - h / 2, '다시 계산해 보세요.'], [a, '꼭지각이에요.'], [bb + 10, '다시 계산해 보세요.']], ...degOpts(5) });
      if (v === 1) return numProb({ tag: '꼭지각의 이등분선과 수직', key: `1:${bb}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ${S('AD')}는 ∠A의 이등분선이다. ∠A=${a}°일 때, ∠ADB의 크기 $x$는?`, correct: 90, wrongs: [[a, '꼭지각이에요.'], [h, '∠BAD예요.'], [bb, '밑각이에요.'], [180 - a, '다시 생각해 보세요.']], ...degOpts(5), pad: 15 });
      return numProb({ tag: '꼭지각의 이등분선과 중점', key: `2:${m}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ${S('AD')}는 ∠A의 이등분선이고 ${S('BD')}=${m} cm일 때, ${S('BC')}의 길이 $x$는?`, correct: 2 * m, wrongs: [[m, 'BD는 BC의 반이에요. D는 BC의 중점이에요.'], [3 * m, '다시 생각해 보세요.'], [m + 2, '다시 생각해 보세요.'], [m * 2 - 1, '다시 생각해 보세요.'], [m * 2 + 1, '다시 생각해 보세요.']], ...cmOpts });
    },
    verify: (s) => { const M = i3.model(s), g = M.g; return { ans: angBetween(g.B, g.A, g.C), model: M.b, extra: [[angBetween(g.D, g.A, g.B), 90], [angBetween(g.A, g.B, g.D), M.h]] }; }
  };

  /* ====================================================================== 4. 직각이등변삼각형 */
  const i4 = {
    id: 't1-4', title: '직각이등변삼각형 (AD=BD=CD)', short: '직각이등변삼각형',
    question: '∠A=90°인 직각이등변삼각형에서 꼭지점 A에서 빗변 BC의 중점 D까지의 거리 AD는 BC의 몇 분의 몇일까?',
    ctl: ['trMm'],
    init: (s) => { s.trMm = 5; s.trV = 0; },
    reroll: (s) => { s.trMm = rint(2, 9); s.trV = (s.trV + 1 + rint(0, 1)) % 3; },
    model: (s) => { const m = clamp(Math.round(s.trMm), 2, 9); return { m, bc: 2 * m, g: isoUp(90) }; },
    draw(b, s, M, C) {
      const { m, g } = M, { A, B, C: Cc, D } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, { x0: -1.05, x1: 1.05, y0: -1.0, y1: 0.05 }, { t: 40, b: C.problem ? 40 : 128, l: 44, r: 44 });
      const cen = pt(0, A.y * 0.4);
      fillPoly(b, [A, B, Cc], 'sky', 0.1);
      poly(b, [A, B, Cc], 'ink', 3.6);
      tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      line(b, A, D, 'green', 3.4);
      ang(b, A, B, Cc, { color: 'sky', r: 34 }); // 직각
      const below = pt(0, -5), left = pt(-5, A.y / 2);
      if (C.problem) {
        tick(b, B, D, 1, 'rose'); tick(b, D, Cc, 1, 'rose');
        if (v === 0) { G.sideTag(b, A, D, left, `${m} cm`, { color: 'sky', size: fs(b, 17), gap: 8, dy: 10 }); dim(b, B, Cc, cen, 'x', { color: 'amber', size: fs(b, 18), off: 30 }); }
        else if (v === 1) { G.sideTag(b, A, D, left, 'x', { color: 'amber', size: fs(b, 18), gap: 8, dy: 10 }); dim(b, B, Cc, cen, `${2 * m} cm`, { color: 'sky', size: fs(b, 17), off: 30 }); }
        else ang(b, A, B, D, { color: 'amber', r: 40, label: 'x', size: 17, labelDist: 62 });
      } else {
        ang(b, B, Cc, A, { color: 'green', r: 30, rings: 2, label: '45°', size: 16, labelDist: 54 });
        ang(b, Cc, A, B, { color: 'green', r: 30, rings: 2, label: '45°', size: 16, labelDist: 54 });
        if (C.review ? st >= 2 : true) {
          ang(b, A, B, D, { color: 'amber', r: 44, rings: 2 });
          T(b, A, '45°', { dx: -sin(22.5) * 60, dy: cos(22.5) * 60, size: 16, color: 'amber' });
          ang(b, A, D, Cc, { color: 'amber', r: 44, rings: 2 });
          tick(b, B, D, 2, 'rose'); tick(b, D, Cc, 2, 'rose'); tick(b, A, D, 2, 'rose');
          ang(b, D, B, A, { color: 'green', r: 18 });
        }
        if (!C.review || st >= 3) {
          G.sideTag(b, A, D, left, `${m} cm`, { color: 'rose', size: fs(b, 16), gap: 8, dy: 10 });
          G.sideTag(b, B, D, below, `${m} cm`, { color: 'rose', size: fs(b, 16), gap: 12 }); G.sideTag(b, D, Cc, below, `${m} cm`, { color: 'rose', size: fs(b, 16), gap: 12 });
          dim(b, B, Cc, cen, `${2 * m} cm`, { color: 'sky', size: fs(b, 16), off: 34 });
        }
      }
      [A, B, Cc, D].forEach((q) => b.point(q, { color: q === D ? 'green' : 'ink', r: 4.5 }));
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, D, 'D', { dy: 18, size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '∠A=90°, AB=AC → ∠B=∠C=45°';
        else if (C.review && st === 2) { row = '△ABD, △ACD도 이등변삼각형 → BD=AD, CD=AD'; col = 'green'; }
        else row = `AD=BD=CD=${m} cm  →  BC=${2 * m} cm`;
        rowT(b, pt(0, 0), row, { dy: rowDy(b) + 36, size: fs(b, 17), color: col });
      }
    },
    steps: (M) => [
      `∠A=90°이고 AB=AC이므로 두 밑각은 $\\angle B=\\angle C=${fr('180^{\\circ}-90^{\\circ}', 2)}=45^{\\circ}$예요.`,
      `AD는 꼭지각의 이등분선이므로 $\\angle BAD=\\angle CAD=45^{\\circ}$이고 AD⊥BC예요. △ABD에서 $\\angle BAD=\\angle B=45^{\\circ}$이므로 $\\overline{BD}=\\overline{AD}$. 같은 방법으로 $\\overline{CD}=\\overline{AD}$.`,
      `따라서 $\\overline{AD}=\\overline{BD}=\\overline{CD}=${M.m}$ cm이고, $\\overline{BC}=\\overline{BD}+\\overline{CD}=${M.bc}$ cm예요. 즉 $\\overline{AD}=${fr('1', 2)}\\overline{BC}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AD의 길이</b>를 바꿔 보세요. 직각이등변삼각형에서 점 D는 빗변의 중점이고 <b>AD=BD=CD</b>예요. 그래서 BC는 AD의 2배예요.',
      readouts: [rd('AD = BD = CD', `${M.m} cm`, 'rose'), rd('BC', `${M.bc} cm`, 'amber', 'AD의 2배'), rd('∠B = ∠C', '45°', 'green')],
      formula: `<p>$\\overline{BC}=2\\times\\overline{AD}=2\\times${M.m}=${M.bc}$ (cm)</p><p>$\\overline{AD}=${fr('1', 2)}\\overline{BC}$</p>`,
      rule: '직각이등변삼각형에서 직각 꼭짓점에서 빗변의 중점까지의 거리 = 빗변의 길이의 반',
      notes: notes('AD=BD=CD예요. AD는 BD, CD와 길이가 같아요.', '빗변 BC는 AD의 2배로 구해요. (BC=BD+CD=2×AD)')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { m } = M;
      if (v === 0) return numProb({ tag: '직각이등변삼각형 · 빗변', key: `0:${m}`, stem: `그림과 같이 ∠A=90°, ${S('AB')}=${S('AC')}인 직각이등변삼각형 ABC에서 점 D는 변 BC의 중점이다. ${S('AD')}=${m} cm일 때, ${S('BC')}의 길이 $x$는?`, correct: 2 * m, wrongs: [[m, 'AD의 길이 그대로 썼어요. BC=BD+CD=2AD예요.'], [m * 3, '다시 계산해 보세요.'], [m + 2, '다시 계산해 보세요.'], [m * 2 + 1, '다시 계산해 보세요.'], [m * 2 - 1, '다시 계산해 보세요.']], ...cmOpts });
      if (v === 1) return numProb({ tag: '직각이등변삼각형 · 중선', key: `1:${m}`, stem: `그림과 같이 ∠A=90°, ${S('AB')}=${S('AC')}인 직각이등변삼각형 ABC에서 점 D는 변 BC의 중점이다. ${S('BC')}=${2 * m} cm일 때, ${S('AD')}의 길이 $x$는?`, correct: m, wrongs: [[2 * m, 'BC의 길이 그대로예요. AD는 BC의 반이에요.'], [m * 3, '다시 계산해 보세요.'], [m + 2, '다시 계산해 보세요.'], [m + 1, '다시 계산해 보세요.'], [m - 1, '다시 계산해 보세요.']], ...cmOpts });
      return numProb({ tag: '직각이등변삼각형 · 각', key: `2:${m}`, stem: `그림과 같이 ∠A=90°, ${S('AB')}=${S('AC')}인 직각이등변삼각형 ABC에서 점 D는 변 BC의 중점이다. ∠BAD의 크기 $x$는?`, correct: 45, wrongs: [[90, '직각 ∠A예요.'], [30, '다시 생각해 보세요.'], [60, '다시 생각해 보세요.'], [135, '다시 생각해 보세요.'], [50, '다시 생각해 보세요.']], ...degOpts(15) });
    },
    verify: (s) => { const M = i4.model(s), g = M.g; return { ans: dist(g.A, g.D), model: dist(g.B, g.D), extra: [[dist(g.D, g.C), dist(g.A, g.D)], [angBetween(g.A, g.B, g.C), 90]] }; }
  };

  /* ====================================================================== 5. 옆으로 누운 이등변 */
  const i5 = {
    id: 't1-5', title: '옆으로 누운 이등변삼각형', short: '누운 이등변삼각형',
    question: '이등변삼각형이 옆으로 누워도 같은 변이 만나는 점이 꼭지점일까?',
    ctl: ['trLa'],
    init: (s) => { s.trLa = 80; s.trV = 0; },
    reroll: (s) => { s.trLa = pick([40, 50, 60, 70, 80, 90, 100, 110, 120], s.trLa); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const a = clamp(even(s.trLa), 40, 140), b = (180 - a) / 2, g = isoSide(a); return { a, b, g }; },
    draw(b, s, M, C) {
      const { a, b: Bd, g } = M, { A, B, C: Cc, D } = g, v = (s.trV || 0) % 2;
      const hh = A.x;
      fit(b, { x0: -2.8, x1: 0.5, y0: -1.15, y1: 1.15 }, { t: 40, b: C.problem ? 40 : 84, l: 44, r: 44 });
      const cen = pt(A.x * 0.3, 0);
      fillPoly(b, [A, B, Cc], 'sky', 0.1);
      poly(b, [A, B, Cc], 'ink', 3.6);
      tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      if (C.problem) {
        if (v === 0) { ang(b, A, B, Cc, { color: 'sky', r: 32, label: dg(a), size: 16 }); ang(b, B, A, Cc, { color: 'amber', r: 30, label: 'x', size: 17 }); }
        else { ang(b, B, A, Cc, { color: 'sky', r: 30, label: dg(Bd), size: 16 }); ang(b, A, B, Cc, { color: 'amber', r: 32, label: 'x', size: 17 }); }
      } else {
        ang(b, A, B, Cc, { color: 'amber', r: 32, rings: 3, label: dg(a), size: 16, labelDist: 56 });
        ang(b, B, A, Cc, { color: 'sky', r: 30, rings: 2, label: dg(Bd), size: 16, labelDist: 50 });
        ang(b, Cc, A, B, { color: 'sky', r: 30, rings: 2, label: dg(Bd), size: 16, labelDist: 50 });
      }
      b.point(B, { color: 'ink', r: 4.5 }); b.point(Cc, { color: 'ink', r: 4.5 });
      if (!C.thumb && !C.problem && !C.review) b.handle('A', A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A를 가로로 끌기', drag: (w) => { const h = Math.max(0.3, -w.x); s.trLa = clamp(even(2 * Math.atan(1 / h) / DEG), 40, 140); } });
      else b.point(A, { color: 'ink', r: 4.5 });
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 });
      void hh; void D;
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && C.step === 1) row = 'AB=AC → 꼭지점은 A (같은 변이 만나는 점)';
        else if (C.review && C.step === 2) { row = `밑각 ∠B=∠C`; col = 'green'; }
        else row = `꼭지각 ∠A=${a}°  →  밑각 ∠B=∠C=${Bd}°`;
        rowT(b, pt(-1.2, 0), row, { dy: rowDy(b) + 12 + 0, size: fs(b, 17), color: col }); // 그림 아래
      }
    },
    steps: (M) => [
      `같은 길이의 두 변 AB, AC가 만나는 점 A가 꼭지점이에요. 그림이 누워 있어도 마찬가지예요.`,
      `꼭지점이 아닌 나머지 두 점 B, C의 각이 밑각이므로 $\\angle B=\\angle C$예요.`,
      `$\\angle B=\\angle C=${fr('180^{\\circ}-\\angle A', 2)}=${fr(`180^{\\circ}-${M.a}^{\\circ}`, 2)}=${M.b}^{\\circ}$`
    ],
    view: (M) => ({
      guide: '막대로 <b>꼭지각 ∠A</b>를 바꾸거나 꼭짓점 A를 가로로 끌어 보세요. 삼각형이 옆으로 누워 있어도, <b>같은 두 변이 만나는 점 A</b>가 꼭지점이에요.',
      readouts: [rd('꼭지각 ∠A', `${M.a}°`, 'amber'), rd('밑각 ∠B = ∠C', `${M.b}°`, 'sky', '(180° − ∠A) ÷ 2')],
      formula: `<p>$\\angle B=\\angle C=${fr(`180^{\\circ}-${M.a}^{\\circ}`, 2)}=${M.b}^{\\circ}$</p>`,
      rule: '같은 두 변이 만나는 점이 꼭지점이고, 꼭지점이 아닌 두 꼭짓점의 각(밑각)이 같다.',
      notes: notes('그림이 누워 있으면 꼭지각이 위쪽에 있지 않아요. <b>눈금(같은 변 표시)</b>을 먼저 찾으세요.', '위쪽 꼭짓점이 꼭지점인 것이 아니에요. 같은 변이 만나는 점이 꼭지점이에요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 2, { a, b: bb } = M;
      if (v === 0) return numProb({ tag: '누운 이등변삼각형 · 밑각', key: `0:${a}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ∠A=${a}°일 때, ∠B의 크기 $x$는?`, correct: bb, wrongs: [[a, '꼭지각 그대로예요.'], [180 - a, '두 밑각의 합이에요.'], [bb + 10, '다시 계산해 보세요.'], [bb - 10, '다시 계산해 보세요.'], [90 - a / 2 + 5, '다시 계산해 보세요.']], ...degOpts(5) });
      return numProb({ tag: '누운 이등변삼각형 · 꼭지각', key: `1:${bb}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ∠B=${bb}°일 때, ∠A의 크기 $x$는?`, correct: a, wrongs: [[bb, '밑각 그대로예요.'], [180 - bb, '다시 생각해 보세요.'], [180 - 3 * bb, '내각의 합에서 밑각 둘을 빼야 해요.'], [a + 10, '다시 계산해 보세요.'], [a - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== a), ...degOpts(5) });
    },
    verify: (s) => { const M = i5.model(s), g = M.g; return { ans: angBetween(g.B, g.A, g.C), model: M.b, extra: [[angBetween(g.A, g.B, g.C), M.a]] }; }
  };

  /* ====================================================================== 6. 대칭축 위의 점 P */
  function i6Model(s) {
    const a = clamp(even(s.trPa), 40, 120), b = (180 - a) / 2, th = clamp(Math.round(s.trPt), 10, Math.max(11, b - 5)), g = isoSide(a);
    const P0 = pt(-tan(th) * 1 * 1, 0); // D=(0,0), BD=1, PD=BD·tan(∠PBC)
    const Pp = pt(-tan(th), 0);
    return { a, b, th, g, P: Pp, rest: b - th };
  }
  const i6 = {
    id: 't1-6', title: '대칭축 위의 점 P', short: '대칭축 위의 점',
    question: '이등변삼각형의 꼭지각의 이등분선 AD 위의 점 P에서 두 꼭짓점 B, C까지의 거리는 어떤 관계일까?',
    ctl: ['trPa', 'trPt'],
    init: (s) => { s.trPa = 60; s.trPt = 20; s.trV = 0; },
    reroll: (s) => { s.trPa = pick([50, 60, 70, 80, 90, 100], s.trPa); s.trPt = rint(15, 30); s.trV = (s.trV + 1) % 2; },
    model: i6Model,
    draw(b, s, M, C) {
      const { a, b: Bd, th, g, P: Pp, rest } = M, { A, B, C: Cc, D } = g, st = C.step;
      fit(b, { x0: A.x - 0.15, x1: 0.5, y0: -1.15, y1: 1.15 }, { t: 40, b: C.problem ? 40 : 84, l: 44, r: 44 });
      const cen = pt(A.x * 0.3, 0);
      fillPoly(b, [A, B, Cc], 'sky', 0.08);
      poly(b, [A, B, Cc], 'ink', 3.6);
      tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      line(b, A, D, 'green', 3.2);
      line(b, B, Pp, 'ink', 3); line(b, Cc, Pp, 'ink', 3);
      if (C.problem) {
        // 문제에서는 AB=AC와 점 P(AD 위)만 주어진다. 선분 PB, PC도 그림에 그린다. (직각 표시는 정답의 단서라 그리지 않는다)
      } else {
        if (!C.review || st >= 2) { tick(b, Pp, B, 2, 'rose'); tick(b, Pp, Cc, 2, 'rose'); }
        // 실제 화면에서 각 값과 PB=PC 눈금이 가까울 때만 바깥으로 옮겨요.
        // 태블릿 세로처럼 폭은 넓어도 도형이 작은 무대도 같은 기준으로 보호합니다.
        const bs = b.toS(B), ps = b.toS(Pp), tm = mid(bs, ps), td = unit(sub(ps, bs));
        const labelScale = (b.fs || 1) * (b._ts ? b._ts() : 1), labelSize = 15 * labelScale;
        const labelX = bs.x - sin(th / 2) * 52, labelY = bs.y + cos(th / 2) * 52;
        const tickHalfX = Math.abs(td.y) * 9 + Math.abs(td.x) * 2.25 + 1.05 * (b.lw || 1);
        const tickHalfY = Math.abs(td.x) * 9 + Math.abs(td.y) * 2.25 + 1.05 * (b.lw || 1);
        const closeToTick = Math.abs(labelX - tm.x) < (G.textW(dg(th), labelSize) + 8) / 2 + tickHalfX + 4 &&
          Math.abs(labelY - tm.y) < (labelSize * 1.12 + 6) / 2 + tickHalfY + 4;
        const outside = !C.thumb && closeToTick ? th / 2 + 35 : 0;
        ang(b, B, D, Pp, { color: 'sky', r: 30, rings: 2, label: dg(th), size: 15, labelDist: 52, labelRot: -outside });
        ang(b, Cc, D, Pp, { color: 'sky', r: 30, rings: 2, label: dg(th), size: 15, labelDist: 52, labelRot: outside });
        if (!C.review || st >= 3) {
          ang(b, B, Pp, A, { color: 'amber', r: 38, rings: 3, label: dg(rest), size: 15, labelDist: 58 });
          ang(b, Cc, Pp, A, { color: 'amber', r: 38, rings: 3, label: dg(rest), size: 15, labelDist: 58 });
        }
        ang(b, D, B, A, { color: 'sky', r: 18 });
      }
      [A, B, Cc, D].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      if (!C.thumb && !C.problem && !C.review) b.handle('P', Pp, { color: 'amber', r: 8, ariaLabel: '점 P를 AD 위에서 가로로 끌기', drag: (w) => { s.trPt = clamp(Math.round(Math.atan(Math.max(0.01, -w.x)) / DEG), 10, Math.max(11, Bd - 5)); } });
      else b.point(Pp, { color: 'amber', r: 6 });
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, D, 'D', { dx: 14, dy: -2, size: 18 }); T(b, Pp, 'P', { dy: -18, size: 18, color: 'amber' });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'AD는 꼭지각의 이등분선 → BD=CD, AD⊥BC';
        else if (C.review && st === 2) { row = '△PBD ≡ △PCD (SAS) → PB=PC'; col = 'rose'; }
        else if (C.review && st === 3) { row = `∠ABP=∠ACP=${rest}°`; col = 'amber'; }
        else row = `PB=PC,  ∠PBC=∠PCB=${th}°,  ∠ABP=∠ACP=${rest}°`;
        rowT(b, pt(-1.0, 0), row, { dy: rowDy(b) + 14, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `AB=AC이고 AD는 꼭지각의 이등분선이므로 $\\overline{BD}=\\overline{CD}$, $\\overline{AD}\\perp\\overline{BC}$예요.`,
      `△PBD와 △PCD에서 BD=CD, PD는 공통, $\\angle PDB=\\angle PDC=90^{\\circ}$이므로 △PBD≡△PCD (SAS 합동). 따라서 $\\overline{PB}=\\overline{PC}$이고 $\\angle PBC=\\angle PCB=${M.th}^{\\circ}$예요.`,
      `$\\angle ABC=\\angle ACB=${M.b}^{\\circ}$이므로 $\\angle ABP=${M.b}^{\\circ}-${M.th}^{\\circ}=${M.rest}^{\\circ}$이고, $\\angle ACP$도 같아요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠PBC</b>를 바꾸거나 점 P를 AD 위에서 가로로 끌어 보세요. P가 어디에 있어도 <b>PB=PC</b>이고, ∠ABP=∠ACP예요.',
      readouts: [rd('∠PBC = ∠PCB', `${M.th}°`, 'sky'), rd('∠ABP = ∠ACP', `${M.rest}°`, 'amber', '밑각 − ∠PBC'), rd('PB와 PC', '길이가 같아요', 'rose', null, null, true)],
      formula: `<p>△PBD≡△PCD (SAS)</p><p>$\\overline{PB}=\\overline{PC},\\ \\angle ABP=\\angle ACP=${M.b}^{\\circ}-${M.th}^{\\circ}=${M.rest}^{\\circ}$</p>`,
      rule: '이등변삼각형의 꼭지각의 이등분선 위의 점은 두 밑변의 끝점에서 같은 거리에 있다.',
      notes: notes('점 P가 AD 위에 있을 때만 PB=PC예요. AD 밖의 점은 안 돼요.', '∠PBC=∠PCB이지만 이 각은 밑각 ∠ABC와 달라요. 밑각의 일부예요.')
    }),
    prob: (M, s) => {
      const key = `a${M.a}t${M.th}`;
      const pool = [
        { h: '$\\overline{PB}=\\overline{PC}$', f: () => true }, { h: '$\\overline{BD}=\\overline{CD}$', f: () => true }, { h: '$\\overline{AD}\\perp\\overline{BC}$', f: () => true },
        { h: '$\\angle ABP=\\angle ACP$', f: () => true }, { h: '$\\angle PBC=\\angle PCB$', f: () => true },
        { h: '$\\overline{PB}=\\overline{AB}$', f: (m) => Math.abs(dist(m.P, m.g.B) - dist(m.g.A, m.g.B)) < 1e-6 }, { h: '$\\angle ABP=\\angle PBC$', f: (m) => m.rest === m.th },
        { h: '$\\overline{AP}=\\overline{PD}$', f: (m) => Math.abs(dist(m.g.A, m.P) - dist(m.P, m.g.D)) < 1e-6 }, { h: '$\\angle BPC=\\angle BAC$', f: (m) => Math.abs(angBetween(m.P, m.g.B, m.g.C) - m.a) < 1e-6 },
        { h: '$\\overline{PB}=\\overline{BD}$', f: (m) => Math.abs(dist(m.P, m.g.B) - dist(m.g.B, m.g.D)) < 1e-6 }, { h: '$\\overline{AB}=\\overline{BC}$', f: (m) => Math.abs(dist(m.g.A, m.g.B) - dist(m.g.B, m.g.C)) < 1e-6 }
      ];
      const wantTrue = (s.trV || 0) % 2 === 0;
      const r = mkStmtChoices(pool, M, key + (wantTrue ? 'T' : 'F'), wantTrue);
      return { tag: wantTrue ? '이등변삼각형 · 옳은 것' : '이등변삼각형 · 옳지 않은 것', key: key + (wantTrue ? 'T' : 'F'), stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 점 P는 꼭지각의 이등분선 AD 위의 점이다. 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, choices: r.choices, wide: true };
    },
    verify: (s) => { const M = i6.model(s), g = M.g; return { ans: dist(M.P, g.B), model: dist(M.P, g.C), extra: [[angBetween(g.B, g.D, M.P), M.th], [angBetween(g.B, g.A, M.P), M.rest]] }; }
  };

  /* ====================================================================== 7. 변의 길이가 식 (이등변삼각형이 되는 x) */
  const i7 = {
    id: 't1-7', title: '두 변의 길이가 x의 식', short: '변의 길이가 식',
    question: '∠B=∠C인 삼각형에서 두 변 AB, AC의 길이가 x의 식일 때 x는 어떻게 구할까?',
    ctl: ['trExprX'],
    init: (s) => { s.trExprX = 5; s.trQ = { p: 5, q: -6, r: 2, sv: 3 }; },
    reroll: (s) => {
      const x0 = rint(2, 8), p = rint(2, 6); let r = rint(1, 5); if (r === p) r = p - 1 || p + 1;
      const sv = rint(1, 9), q = r * x0 + sv - p * x0;
      s.trQ = { p, q, r, sv, x0 };
    },
    model: (s) => {
      const Q = s.trQ || { p: 5, q: -6, r: 2, sv: 3 }, x0 = Q.x0 || (Q.sv - Q.q) / (Q.p - Q.r), x = clamp(Math.round(s.trExprX), 2, 9);
      const L1 = Q.p * x + Q.q, L2 = Q.r * x + Q.sv;
      return { Q, x, x0, L1, L2, eq: L1 === L2, ok1: L1 > 0 && L2 > 0 };
    },
    draw(b, s, M, C) {
      const { Q } = M, st = C.step;
      const xv = C.problem ? M.x0 : M.x;
      const l1 = Math.max(1, Q.p * xv + Q.q), l2 = Math.max(1, Q.r * xv + Q.sv), bc = Math.max(l1, l2) * 0.9 + 0.5;
      const tri = G.triSSS(bc, l2, l1) || [pt(0, 0), pt(bc, 0), pt(bc / 2, -Math.min(l1, l2))]; // [B? 아래 설명] A=(0,0) 왼쪽 아래를 B로
      // triSSS(a,b,c): A=(0,0), B=(c,0), C 위. 여기서는 B=(0,0), C=(bc,0), A 위로 다시 계산
      const Bp = pt(0, 0), Cp = pt(bc, 0), xx = (l1 * l1 - l2 * l2 + bc * bc) / (2 * bc), hh = Math.sqrt(Math.max(1e-6, l1 * l1 - xx * xx)), A = pt(xx, -hh);
      void tri;
      // On desktop-style stages the upper status badge must not hide A,
      // including when changing x shifts the apex towards the right.
      const top = !C.thumb && !C.problem && b.insets.right > 0 ? 74 : 44;
      fit(b, bboxOf([A, Bp, Cp]), { t: top, b: C.problem ? 44 : 92, l: 50, r: 50 });
      const cen = pt((A.x + Bp.x + Cp.x) / 3, (A.y + Bp.y + Cp.y) / 3);
      const eq = Math.abs(l1 - l2) < 1e-9;
      fillPoly(b, [A, Bp, Cp], eq ? 'green' : 'sky', 0.12);
      poly(b, [A, Bp, Cp], 'ink', 3.6);
      const ex1 = (v) => `${Q.p === 1 ? '' : Q.p}x${Q.q < 0 ? '−' + (-Q.q) : '+' + Q.q}`, ex2 = `${Q.r === 1 ? '' : Q.r}x+${Q.sv}`;
      if (C.problem) {
        ang(b, Bp, Cp, A, { color: 'sky', r: 30, rings: 2 }); ang(b, Cp, A, Bp, { color: 'sky', r: 30, rings: 2 });
        G.sideTag(b, A, Bp, cen, `(${ex1()})cm`, { color: 'sky', size: fs(b, 16), gap: 6 });
        G.sideTag(b, A, Cp, cen, `(${ex2})cm`, { color: 'sky', size: fs(b, 16), gap: 6 });
      } else {
        ang(b, Bp, Cp, A, { color: eq ? 'sky' : 'rose', r: 30, rings: 2, size: 15 }); ang(b, Cp, A, Bp, { color: eq ? 'sky' : 'rose', r: 30, rings: eq ? 2 : 1, size: 15 });
        if (eq) { tick(b, A, Bp, 1, 'amber'); tick(b, A, Cp, 1, 'amber'); }
        G.sideTag(b, A, Bp, cen, `${ex1()}=${M.L1} cm`, { color: 'sky', size: fs(b, 15), gap: 6 });
        G.sideTag(b, A, Cp, cen, `${ex2}=${M.L2} cm`, { color: 'sky', size: fs(b, 15), gap: 6 });
      }
      [A, Bp, Cp].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, Bp, cen, 'B', { size: 18 }); tagOut(b, Cp, cen, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '∠B=∠C이므로 AB=AC';
        else if (C.review && st === 2) { row = `${ex1()} = ${ex2}`; col = 'green'; }
        else if (C.review && st >= 3) { row = `x=${M.x0}  →  AB=AC=${Q.p * M.x0 + Q.q} cm`; col = 'green'; }
        else if (eq) { row = `x=${M.x}일 때 두 변이 같아요: ${M.L1} cm = ${M.L2} cm`; col = 'green'; }
        else row = `x=${M.x}: AB=${M.L1} cm, AC=${M.L2} cm → 같지 않아요`;
        rowT(b, pt(A.x, 0), row, { dy: rowDy(b), size: fs(b, 16), color: col });
      }
    },
    steps: (M) => {
      const { Q, x0 } = M, e1 = `${Q.p === 1 ? '' : Q.p}x${Q.q < 0 ? '-' + (-Q.q) : '+' + Q.q}`, e2 = `${Q.r === 1 ? '' : Q.r}x+${Q.sv}`;
      return [
        `$\\angle B=\\angle C$이므로 두 변 AB, AC의 길이가 같아요. (두 내각이 같으면 이등변삼각형)`,
        `$\\overline{AB}=\\overline{AC}$이므로 $${e1}=${e2}$`,
        `$${Q.p - Q.r === 1 ? '' : Q.p - Q.r}x=${Q.sv - Q.q}$이므로 $x=${x0}$. 이때 $\\overline{AB}=\\overline{AC}=${Q.p * x0 + Q.q}$ cm예요.`
      ];
    },
    view: (M) => {
      const { Q } = M;
      return {
        guide: `막대로 <b>x</b>를 바꿔 보세요. 두 변의 길이 (${Q.p}x${Q.q < 0 ? '−' + (-Q.q) : '+' + Q.q})와 (${Q.r}x+${Q.sv})가 <b>같아지는 x</b>에서만 이등변삼각형(∠B=∠C)이 돼요.`,
        readouts: [rd('AB', `${M.L1} cm`, 'sky'), rd('AC', `${M.L2} cm`, 'sky'), rd('x', String(M.x), 'amber', M.eq ? '두 변이 같아요!' : '아직 달라요', null, true)],
        status: M.eq ? { tone: 'ok', text: '이등변삼각형이에요' } : { tone: 'info', text: '두 변이 같아지는 x를 찾아보세요' },
        formula: `<p>$${Q.p}x${Q.q < 0 ? '-' + (-Q.q) : '+' + Q.q}=${Q.r}x+${Q.sv}$</p><p>$${Q.p - Q.r}x=${Q.sv - Q.q}$, $x=${M.x0}$</p>`,
        rule: '두 내각이 같으면 대변의 길이가 같다 → 길이의 식을 같다고 놓고 x를 구한다.',
        notes: notes('식을 세울 때 <b>같은 변끼리</b> 놓아야 해요. 밑변 BC가 아니라 AB와 AC예요.', 'x의 값을 구한 뒤 변의 길이가 <b>양수</b>인지 확인해요.')
      };
    },
    prob: (M) => {
      const { Q, x0 } = M, e1 = `${Q.p === 1 ? '' : Q.p}x${Q.q < 0 ? '-' + (-Q.q) : '+' + Q.q}`, e2 = `${Q.r === 1 ? '' : Q.r}x+${Q.sv}`;
      const L = Q.p * x0 + Q.q;
      return {
        tag: '이등변삼각형 · 변의 길이로 방정식 세우기', key: `${Q.p},${Q.q},${Q.r},${Q.sv}`,
        stem: `그림과 같은 삼각형 ABC에서 ∠B=∠C이고 ${S('AB')}=(${e1}) cm, ${S('AC')}=(${e2}) cm일 때, $x$의 값은?`,
        choices: mkChoices(x0, [[Q.sv - Q.q, '식을 풀 때 x의 계수 $' + (Q.p - Q.r) + '$로 나누어야 해요.'], [L, 'x가 아니라 변의 길이예요.'], [x0 + 1, '식을 풀 때 계산이 틀렸어요.'], [x0 - 1, '식을 풀 때 계산이 틀렸어요.'], [(Q.sv + Q.q) / (Q.p + Q.r), '부호를 확인하세요. 상수항을 옮기면 부호가 바뀌어요.']], { tex: (v) => String(v), plain: (v) => String(v), valid: (v) => Number.isInteger(v) && v > 0, pad: 1 })
      };
    },
    verify: (s) => { const M = i7.model(s), { Q, x0 } = M; return { ans: Q.p * x0 + Q.q, model: Q.r * x0 + Q.sv }; }
  };

  /* ====================================================================== 풀이 흐름 (탐구 · 문제 · 풀이)
     문제 탭과 같은 상태·같은 숫자로, 그림 위에서 ① 주어진 것 ② 발상 ③ 그림 변화 ④ 식 ⑤ 답(+ 흔한 실수)을 한 단계씩 보여 줍니다.
     그림 항목은 G.SVK(core.js)로 선언합니다: 지금 단계의 항목만 색, 앞 단계는 회색. */
  const SK = G.SVK, mkSolve = G.mkSolve;
  const ov = (n) => `\\overline{${n}}`;
  const dd = (v) => `${v}^{\\circ}`;
  const eqAB = `$${ov('AB')}=${ov('AC')}$`;

  /* ---- t1-1 두 밑각 · v0: ∠A → ∠B, v1: ∠B → ∠A, v2 [함정]: 외각 ∠ACD ---- */
  const i1Iso = (s) => { const a = clamp(even(s.trIa), 20, 140); return { a, b: (180 - a) / 2, g: isoUp(a) }; }; // 문제 탭은 늘 이등변삼각형(일반 삼각형 보기와 무관)
  const i1Plan = (M0, s) => {
    const { a, b: bb, g } = i1Iso(s), { A, B, C: Cc } = g, v = (s.trV || 0) % 3, ext = pt(Cc.x + 0.7, 0), cen = pt(0, A.y * 0.4);
    const x = v === 0 ? bb : v === 1 ? a : 90 + a / 2;
    const steps = [], items = [];
    const apex = (o) => SK.ang(A, B, Cc, { r: 32, ld: 56, ...o });
    const angB = (o) => SK.ang(B, Cc, A, { r: 30, ld: 54, rings: 2, ...o });
    const angC = (o) => SK.ang(Cc, A, B, { r: 30, ld: 54, rings: 2, ...o });
    items.push(SK.fill([A, B, Cc], { at: 'idea', col: 'violet', a: 0.16 }), SK.tick(A, B, 1, { col: 'amber' }), SK.tick(A, Cc, 1, { col: 'amber' }));
    if (v === 0) {
      steps.push({ id: 'given', k: 'given', t: `${eqAB}인 이등변삼각형이에요. 꼭지각 $\\angle A=${dd(a)}$이고, 구하는 것은 밑각 $\\angle B=x$.`, cap: `AB=AC, ∠A=${a}°` });
      steps.push({ id: 'idea', k: 'idea', t: '이등변삼각형은 두 밑각이 같으니까 $\\angle B=\\angle C$예요. 세 각의 합이 $180^{\\circ}$이므로, 꼭지각을 빼고 반으로 나누면 한 밑각이 나와요.', cap: '밑각 ∠B=∠C = \\frac{180°−∠A}{2}' });
      steps.push({ id: 'fig', k: 'fig', lb: '그림 변화', t: `$\\angle C$도 $\\angle B$와 같으니까 같은 호를 그려요. 두 밑각의 합은 $180^{\\circ}-${dd(a)}=${dd(180 - a)}$예요.`, cap: `∠B=∠C, ∠B+∠C=180°−${a}°=${180 - a}°` });
      steps.push({ id: 'eq', k: 'eq', t: `$x=\\frac{180^{\\circ}-${dd(a)}}{2}=\\frac{${dd(180 - a)}}{2}=${dd(bb)}$`, cap: `x=\\frac{180°−${a}°}{2}=${bb}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(bb)}$`, cap: `x = ${bb}°` });
      items.push(apex({ on: ['given'], col: 'sky', label: dg(a), gl: true, glTo: 'eq' }),
        angB({ on: ['given', 'fig', 'eq', 'ans'], col: 'amber', cols: { fig: 'green' }, label: 'x', size: 17, labels: { ans: `x=${bb}°` }, gl: true }),
        angC({ on: ['fig'], col: 'green' }));
    } else if (v === 1) {
      steps.push({ id: 'given', k: 'given', t: `${eqAB}인 이등변삼각형에서 $\\angle B=${dd(bb)}$예요. 구하는 것은 꼭지각 $\\angle A=x$.`, cap: `AB=AC, ∠B=${bb}°` });
      steps.push({ id: 'idea', k: 'idea', t: `밑각은 서로 같으니 $\\angle C$도 ${bb}°예요. 세 각의 합이 $180^{\\circ}$이므로, 두 밑각을 빼면 꼭지각이 나와요.`, cap: `밑각이 같다 → ∠C=∠B=${bb}°` });
      steps.push({ id: 'fig', k: 'fig', lb: '그림 변화', t: `$\\angle C=\\angle B=${dd(bb)}$이므로 $\\angle C$에도 같은 호와 ${bb}°를 써요.`, cap: `∠C=∠B=${bb}°` });
      steps.push({ id: 'eq', k: 'eq', t: `$x=180^{\\circ}-${dd(bb)}-${dd(bb)}=${dd(a)}$`, cap: `x=180°−${bb}°−${bb}°=${a}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(a)}$`, cap: `x = ${a}°` });
      items.push(angB({ on: ['given'], col: 'sky', label: dg(bb), gl: true, glTo: 'eq' }),
        angC({ on: ['fig'], col: 'green', label: dg(bb), gl: true, glTo: 'eq' }),
        apex({ on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${a}°` }, gl: true }));
    } else {
      steps.push({ id: 'given', k: 'given', t: `${eqAB}이고 $\\angle A=${dd(a)}$예요. 변 BC를 길게 늘인 선 위에 점 D가 있고, 구하는 것은 $\\angle ACD=x$.`, cap: `AB=AC, ∠A=${a}°, 구하는 각: ∠ACD` });
      steps.push({ id: 'idea', k: 'idea', t: '$\\angle ACD$는 삼각형 ABC의 외각이에요. 외각은 이웃하지 않는 두 내각 $\\angle A$, $\\angle B$의 합이니까 $\\angle B$만 알면 돼요. 이등변삼각형이라 $\\angle B$는 밑각으로 구해요.', cap: '외각 = 이웃하지 않는 두 내각의 합' });
      steps.push({ id: 'fig', k: 'fig', lb: '그림 변화', t: `$\\angle B=\\angle ACB=\\frac{180^{\\circ}-${dd(a)}}{2}=${dd(bb)}$ (이등변삼각형의 밑각). 안쪽 각 $\\angle ACB$에도 같은 호를 그려요.`, cap: `∠B=∠ACB=\\frac{180°−${a}°}{2}=${bb}°` });
      steps.push({ id: 'eq', k: 'eq', t: `$x=\\angle A+\\angle B=${dd(a)}+${dd(bb)}=${dd(x)}$`, cap: `x=∠A+∠B=${a}°+${bb}°=${x}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(x)}$`, cap: `x = ${x}°` });
      steps.push({ id: 'trap', k: 'trap', t: `안쪽 각 $\\angle ACB=${dd(bb)}$를 답으로 쓰면 안 돼요. $x$는 바깥쪽 각이라서 $\\angle ACB$와 합이 $180^{\\circ}$예요.`, cap: `안쪽 각 ∠ACB=${bb}°는 답이 아니에요 → 바깥쪽 각 x=${x}°` });
      items.push(apex({ on: ['given', 'eq'], col: 'sky', label: dg(a), gl: true, glTo: 'eq' }),
        SK.ang(Cc, A, ext, { r: 34, ld: 58, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${x}°` }, gl: true }),
        angB({ on: ['fig', 'eq'], col: 'green', label: dg(bb), gl: true, glTo: 'eq' }),
        angC({ on: ['fig', 'trap'], col: 'green', cols: { trap: 'rose' }, labels: { trap: dg(bb) } }));
    }
    const fitPts = [A, B, Cc, pt(v === 2 ? ext.x + 0.15 : Cc.x, 0.05)];
    return {
      fit: fitPts, steps, items,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.08); G.poly(b, [A, B, Cc], 'ink', 3.6); if (v === 2) G.line(b, Cc, ext, 'ink', 3.4); },
      names: (b) => { G.dots(b, [A, B, Cc], ['A', 'B', 'C'], cen, { size: 18 }); if (v === 2) { b.point(ext, { color: 'ink', r: 4 }); T(b, ext, 'D', { dy: 18, size: 18 }); } }
    };
  };
  i1.solve = mkSolve(i1Plan);
  { const p0 = i1.prob; i1.prob = (M, s) => p0(i1Iso(s), s); }

  /* ---- t1-2 두 각이 같으면 이등변삼각형 · v0: ∠B=∠C, AB=m → AC · v1: 같은 조건에 ∠A도 주어짐 ---- */
  const i2Eq = (s) => { const Bd = clamp(Math.round(s.trJb), 40, 70); return { a: 180 - 2 * Bd, b: Bd, c: Bd, tri: { A: pt(0, -tan(Bd)), B: pt(-1, 0), C: pt(1, 0) } }; }; // 문제는 늘 ∠B=∠C인 그림
  const i2Plan = (M0, s) => {
    const M = i2Eq(s), { A, B, C: Cc } = M.tri, D = pt(0, 0), m = s.trM || 8, v = (s.trV || 0) % 2, a = M.a, cen = pt(0, A.y * 0.4);
    const steps = [], items = [];
    steps.push({ id: 'given', k: 'given', t: `$\\angle B=\\angle C$이고 $${ov('AB')}=${m}$ cm예요. ${v === 1 ? `$\\angle A=${dd(a)}$도 주어졌어요. ` : ''}구하는 것은 $${ov('AC')}=x$.`, cap: `∠B=∠C, AB=${m} cm${v === 1 ? `, ∠A=${a}°` : ''}` });
    steps.push({ id: 'idea', k: 'idea', t: `마주 보는 두 변 AB, AC의 길이가 같음을 보이려면, 이 두 변이 하나씩 들어 있는 합동인 삼각형이 필요해요. 그래서 A에서 BC에 수선 AD를 그어 삼각형을 둘로 나눠요.${v === 1 ? ' (∠A의 크기는 쓰지 않아도 돼요.)' : ''}`, cap: '같은 각의 마주 보는 변 → 합동인 삼각형으로 확인' });
    steps.push({ id: 'fig', k: 'fig', lb: '그림 변화', t: '$\\angle ADB=\\angle ADC=90^{\\circ}$이고 $\\angle B=\\angle C$이므로 $\\angle BAD=\\angle CAD$예요. $\\overline{AD}$는 공통이므로 △ABD≡△ACD (ASA 합동).', cap: 'AD⊥BC, ∠B=∠C → ∠BAD=∠CAD → △ABD≡△ACD' });
    steps.push({ id: 'eq', k: 'eq', t: `합동인 삼각형의 대응변은 같으므로 $${ov('AC')}=${ov('AB')}=${m}$ cm.`, cap: `AC=AB=${m} cm` });
    steps.push({ id: 'ans', k: 'ans', t: `$x=${m}\\text{ cm}$`, cap: `x = ${m} cm` });
    items.push(
      SK.ang(B, Cc, A, { rings: 2, r: 30, ld: 54, on: ['given'], col: 'sky' }), SK.ang(Cc, A, B, { rings: 2, r: 30, ld: 54, on: ['given'], col: 'sky' }),
      SK.len(A, B, cen, `${m} cm`, { on: ['given', 'eq'], col: 'sky', size: 17, gap: 6 }),
      SK.len(A, Cc, cen, 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 6, labels: { ans: `x=${m} cm` } }),
      SK.fill([A, B, D], { at: 'fig', col: 'sky', a: 0.26 }), SK.fill([A, D, Cc], { at: 'fig', col: 'green', a: 0.26 }),
      SK.seg(A, D, { at: 'fig', col: 'green', w: 4 }), SK.dot(D, 'D', { at: 'fig', col: 'green', dy: 18 }),
      SK.ang(D, A, B, { r: 20, at: 'fig', col: 'green' }), SK.ang(D, A, Cc, { r: 20, at: 'fig', col: 'green' }),
      SK.ang(A, B, D, { rings: 3, r: 36, ld: 58, at: 'fig', col: 'violet' }), SK.ang(A, D, Cc, { rings: 3, r: 36, ld: 58, at: 'fig', col: 'violet' }),
      SK.tick(A, B, 1, { at: 'eq', col: 'amber' }), SK.tick(A, Cc, 1, { at: 'eq', col: 'amber' }));
    if (v === 1) items.push(SK.ang(A, B, Cc, { r: 24, ld: 70, on: ['given'], col: 'sky', label: dg(a), gl: true, glTo: 'idea' }));
    return {
      fit: [A, B, Cc, pt(0, 0.1)], steps, items,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.08); G.poly(b, [A, B, Cc], 'ink', 3.6); },
      names: (b) => G.dots(b, [A, B, Cc], ['A', 'B', 'C'], cen, { size: 18 })
    };
  };
  i2.solve = mkSolve(i2Plan);
  { const p0 = i2.prob; i2.prob = (M, s) => p0(i2Eq(s), s); }

  /* ---- t1-3 꼭지각의 이등분선 · v0: ∠BAD → ∠B · v1: ∠A → ∠ADB · v2: BD → BC ---- */
  const i3Plan = (M, s) => {
    const { a, b: bb, h, m, g } = M, { A, B, C: Cc, D } = g, v = (s.trV || 0) % 3, cen = pt(0, A.y * 0.4);
    const steps = [], items = [];
    const halfL = (o) => SK.ang(A, B, D, { r: 34, cut: [0, 7], ...o }), halfR = (o) => SK.ang(A, D, Cc, { r: 34, cut: [7, 0], ...o });
    const given0 = `$${ov('AB')}=${ov('AC')}$이고 $${ov('AD')}$는 $\\angle A$의 이등분선이에요.`;
    const cong = '△ABD와 △ACD에서 $\\overline{AB}=\\overline{AC}$, $\\angle BAD=\\angle CAD$, $\\overline{AD}$는 공통이므로 △ABD≡△ACD (SAS 합동).';
    items.push(SK.tick(A, B, 1, { col: 'amber' }), SK.tick(A, Cc, 1, { col: 'amber' }),
      SK.fill([A, B, D], { at: 'cong', col: 'sky', a: 0.26 }), SK.fill([A, D, Cc], { at: 'cong', col: 'green', a: 0.26 }),
      SK.seg(A, D, { at: 'given', col: 'green', w: 3.6 }));
    if (v === 0) {
      steps.push({ id: 'given', k: 'given', t: `${given0} $\\angle BAD=${dd(h)}$이고, 구하는 것은 $\\angle B=x$.`, cap: `AB=AC, ∠BAD=∠CAD=${h}°` });
      steps.push({ id: 'idea', k: 'idea', t: '밑각 $\\angle B$는 △ABD에서 구할 수 있어요. 아는 각이 $\\angle BAD$뿐이니, 이등변삼각형에서 꼭지각의 이등분선은 밑변과 수직이라는 성질로 $\\angle ADB=90^{\\circ}$를 찾아요.', cap: '이등분선 AD ⊥ BC → △ABD에서 ∠B 구하기' });
      steps.push({ id: 'cong', k: 'fig', lb: '합동 찾기', t: `${cong} 그래서 $\\angle ADB=\\angle ADC$예요.`, cap: 'AB=AC, ∠BAD=∠CAD, AD 공통 → △ABD≡△ACD (SAS)' });
      steps.push({ id: 'perp', k: 'fig', lb: '그림 변화', t: '$\\angle ADB$와 $\\angle ADC$는 같고 합이 $180^{\\circ}$(일직선)이므로 각각 $90^{\\circ}$예요. 그림에 직각을 표시해요.', cap: '∠ADB=∠ADC, 합 180° → 각각 90°' });
      steps.push({ id: 'eq', k: 'eq', t: `△ABD의 내각의 합에서 $x=180^{\\circ}-${dd(h)}-90^{\\circ}=${dd(bb)}$`, cap: `x=180°−${h}°−90°=${bb}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(bb)}$`, cap: `x = ${bb}°` });
      items.push(halfL({ on: ['given', 'cong', 'eq'], col: 'sky', label: dg(h), ld: 70, lr: G.sideRot(A, B, D, 'A', 24), gl: true, glTo: 'eq' }), halfR({ on: ['given', 'cong'], col: 'sky', cols: { cong: 'green' }, label: dg(h), ld: 70, lr: G.sideRot(A, D, Cc, 'B', 24), gl: true, glTo: 'eq' }),
        SK.ang(B, Cc, A, { r: 30, ld: 54, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${bb}°` }, gl: true }),
        SK.ang(D, A, B, { r: 20, at: 'perp', to: 'eq', col: 'green' }), SK.ang(D, A, Cc, { r: 20, at: 'perp', col: 'green' }));
    } else if (v === 1) {
      steps.push({ id: 'given', k: 'given', t: `${given0} $\\angle A=${dd(a)}$이고, 구하는 것은 $\\angle ADB=x$.`, cap: `AB=AC, ∠A=${a}°` });
      steps.push({ id: 'idea', k: 'idea', t: 'AD로 나뉜 두 삼각형이 합동이면 $\\angle ADB=\\angle ADC$예요. 이 두 각은 일직선 위에 있어서 합이 $180^{\\circ}$이니, 합동임을 보이는 것이 열쇠예요.', cap: '△ABD≡△ACD이면 ∠ADB=∠ADC' });
      steps.push({ id: 'cong', k: 'fig', lb: '합동 찾기', t: `${cong} 그래서 $\\angle ADB=\\angle ADC$예요.`, cap: 'AB=AC, ∠BAD=∠CAD, AD 공통 → △ABD≡△ACD (SAS)' });
      steps.push({ id: 'eq', k: 'eq', t: '$\\angle ADB+\\angle ADC=180^{\\circ}$이고 두 각이 같으므로 $x=\\frac{180^{\\circ}}{2}=90^{\\circ}$', cap: 'x=\\frac{180°}{2}=90°' });
      steps.push({ id: 'ans', k: 'ans', t: '$x=90^{\\circ}$', cap: 'x = 90° (AD ⊥ BC)' });
      items.push(halfL({ on: ['given', 'cong'], col: 'sky', cols: { cong: 'green' } }), halfR({ on: ['given', 'cong'], col: 'sky', cols: { cong: 'green' } }),
        SK.ang(A, B, Cc, { r: 54, ld: 78, on: ['given'], col: 'sky', label: dg(a), gl: true, glTo: 'cong', fa: 0.05 }),
        SK.ang(D, A, B, { r: 22, ld: 38, on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: 'x=90°' }, gl: true }));
    } else {
      steps.push({ id: 'given', k: 'given', t: `${given0} $${ov('BD')}=${m}$ cm이고, 구하는 것은 $${ov('BC')}=x$.`, cap: `AB=AC, BD=${m} cm` });
      steps.push({ id: 'idea', k: 'idea', t: 'BC가 BD의 몇 배인지 알아야 해요. 점 D가 BC의 한가운데(중점)라면 BC는 BD의 2배이니, 이등변삼각형에서 꼭지각의 이등분선이 밑변을 반으로 나눈다는 것을 합동으로 확인해요.', cap: 'D가 BC의 중점이면 BC = 2 × BD' });
      steps.push({ id: 'cong', k: 'fig', lb: '합동 찾기', t: `${cong} 그래서 $\\overline{BD}=\\overline{CD}=${m}$ cm예요.`, cap: `△ABD≡△ACD → BD=CD=${m} cm` });
      steps.push({ id: 'eq', k: 'eq', t: `$x=\\overline{BD}+\\overline{CD}=${m}+${m}=${2 * m}$ (cm)`, cap: `x=BD+CD=${m}+${m}=${2 * m} cm` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${2 * m}\\text{ cm}$`, cap: `x = ${2 * m} cm` });
      items.push(halfL({ on: ['given'], col: 'sky' }), halfR({ on: ['given'], col: 'sky' }),
        SK.len(B, D, pt(0, -1), `${m} cm`, { on: ['given', 'cong'], col: 'sky', size: 16, gap: 4 }),
        SK.len(D, Cc, pt(0, -1), `${m} cm`, { at: 'cong', col: 'green', size: 16, gap: 4 }),
        SK.tick(B, D, 2, { at: 'cong', col: 'rose' }), SK.tick(D, Cc, 2, { at: 'cong', col: 'rose' }),
        SK.dim(B, Cc, cen, 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, off: 34, labels: { ans: `x=${2 * m} cm` } }));
    }
    return {
      fit: [A, B, Cc, pt(0, v === 2 ? 0.45 : 0.1)], steps, items,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.08); G.poly(b, [A, B, Cc], 'ink', 3.6); },
      names: (b) => { G.dots(b, [A, B, Cc], ['A', 'B', 'C'], cen, { size: 18 }); b.point(D, { color: 'ink', r: 4.5 }); if (v === 2) T(b, D, 'D', { dx: 11, dy: -14, size: 18 }); else T(b, D, 'D', { dy: 18, size: 18 }); }
    };
  };
  i3.solve = mkSolve(i3Plan, { quickTitle: '10초 컷 · 꼭지각의 이등분선 = 밑변의 수직이등분선', quick: (M, s) => { const v = (s.trV || 0) % 3; return v === 0 ? { steps: `<p>꼭지각의 이등분선 AD는 밑변과 수직이므로 $x=90^{\\circ}-${M.h}^{\\circ}=${M.b}^{\\circ}$</p>`, note: '△ABD는 직각삼각형이라 두 예각의 합이 90°예요.' } : v === 1 ? { steps: '<p>꼭지각의 이등분선은 밑변과 수직이므로 $x=90^{\\circ}$</p>', note: '꼭지각의 크기와 상관없이 항상 90°예요.' } : { steps: `<p>꼭지각의 이등분선은 밑변을 수직이등분하므로 $\\overline{BC}=2\\times\\overline{BD}=2\\times${M.m}=${2 * M.m}$ (cm)</p>`, note: 'D는 BC의 중점이에요.' }; } });

  /* ---- t1-4 직각이등변삼각형 · v0: AD → BC · v1: BC → AD · v2: ∠BAD ---- */
  const i4Plan = (M, s) => {
    const { m, g } = M, { A, B, C: Cc, D } = g, v = (s.trV || 0) % 3, cen = pt(0, A.y * 0.4), left = pt(-5, A.y / 2), below = pt(0, -5);
    const steps = [], items = [];
    const g0 = `$\\angle A=90^{\\circ}$, $${ov('AB')}=${ov('AC')}$인 직각이등변삼각형이고 점 D는 변 BC의 중점이에요.`;
    items.push(SK.ang(A, B, Cc, { r: 34, on: ['given'], col: 'sky' }), SK.tick(A, B, 1, { col: 'amber' }), SK.tick(A, Cc, 1, { col: 'amber' }),
      SK.tick(B, D, 1, { at: 'given', col: 'rose' }), SK.tick(D, Cc, 1, { at: 'given', col: 'rose' }), SK.seg(A, D, { at: 'given', col: 'green', w: 3.6 }),
      SK.ang(B, Cc, A, { r: 30, ld: 54, rings: 2, at: 'b45', col: 'green', label: '45°', size: 15, gl: true, glTo: 'eq' }), SK.ang(Cc, A, B, { r: 30, ld: 54, rings: 2, at: 'b45', col: 'green', label: '45°', size: 15, gl: true, glTo: 'eq' }));
    const mid2 = [SK.ang(A, B, D, { r: 44, ld: 66, rings: 2, at: 'iso', col: 'amber', label: '45°', gl: true, glTo: 'eq' }), SK.ang(A, D, Cc, { r: 44, ld: 66, rings: 2, at: 'iso', col: 'amber', label: '45°', gl: true, glTo: 'eq' }),
      SK.tick(B, D, 2, { at: 'iso', col: 'rose' }), SK.tick(D, Cc, 2, { at: 'iso', col: 'rose' }), SK.tick(A, D, 2, { at: 'iso', col: 'rose' })];
    const b45 = { id: 'b45', k: 'fig', lb: '각 구하기', t: '$\\angle A=90^{\\circ}$이고 $\\overline{AB}=\\overline{AC}$이므로 두 밑각은 $\\angle B=\\angle C=\\frac{180^{\\circ}-90^{\\circ}}{2}=45^{\\circ}$예요.', cap: '∠B=∠C=\\frac{180°−90°}{2}=45°' };
    const iso = { id: 'iso', k: 'fig', lb: '그림 변화', t: '$\\overline{AD}$는 꼭지각의 이등분선이라 $\\angle BAD=\\angle CAD=45^{\\circ}$예요. △ABD에서 $\\angle BAD=\\angle B=45^{\\circ}$이므로 $\\overline{BD}=\\overline{AD}$, 같은 방법으로 $\\overline{CD}=\\overline{AD}$예요.', cap: '∠BAD=∠B=45° → BD=AD, CD=AD' };
    if (v === 0) {
      steps.push({ id: 'given', k: 'given', t: `${g0} $${ov('AD')}=${m}$ cm이고, 구하는 것은 $${ov('BC')}=x$.`, cap: `∠A=90°, AB=AC, AD=${m} cm` });
      steps.push({ id: 'idea', k: 'idea', t: 'BC의 길이를 AD로 나타내야 해요. △ABD가 이등변삼각형이 되어 BD=AD이면 BC=BD+CD=2AD가 돼요. 그래서 밑각이 45°임을 이용해요.', cap: 'BD=AD=CD 이면 BC = 2 × AD' });
      steps.push(b45, iso);
      steps.push({ id: 'eq', k: 'eq', t: `$\\overline{AD}=\\overline{BD}=\\overline{CD}=${m}$ cm이므로 $x=\\overline{BD}+\\overline{CD}=${m}+${m}=${2 * m}$ (cm)`, cap: `x=BD+CD=${m}+${m}=${2 * m} cm` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${2 * m}\\text{ cm}$`, cap: `x = ${2 * m} cm` });
      items.push(SK.len(A, D, left, `${m} cm`, { on: ['given', 'eq'], col: 'sky', size: 16, gap: 8, dy: 26 }), SK.dim(B, Cc, cen, 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, off: 34, labels: { ans: `x=${2 * m} cm` } }), ...mid2);
    } else if (v === 1) {
      steps.push({ id: 'given', k: 'given', t: `${g0} $${ov('BC')}=${2 * m}$ cm이고, 구하는 것은 $${ov('AD')}=x$.`, cap: `∠A=90°, AB=AC, BC=${2 * m} cm` });
      steps.push({ id: 'idea', k: 'idea', t: 'AD를 BC로 나타내려고 해요. △ABD가 이등변삼각형이 되어 AD=BD이면, BD는 BC의 반이므로 AD도 BC의 반이에요. 그래서 밑각이 45°임을 이용해요.', cap: 'AD=BD=\\frac{BC}{2}' });
      steps.push(b45, iso);
      steps.push({ id: 'eq', k: 'eq', t: `$x=\\overline{AD}=\\overline{BD}=\\frac{\\overline{BC}}{2}=\\frac{${2 * m}}{2}=${m}$ (cm)`, cap: `x=AD=BD=\\frac{${2 * m}}{2}=${m} cm` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${m}\\text{ cm}$`, cap: `x = ${m} cm` });
      items.push(SK.len(A, D, left, 'x', { on: ['given', 'eq', 'ans'], col: 'amber', size: 18, gap: 8, dy: 26, labels: { ans: `x=${m} cm` } }), SK.dim(B, Cc, cen, `${2 * m} cm`, { on: ['given', 'eq'], col: 'sky', size: 16, off: 34 }), ...mid2);
    } else {
      steps.push({ id: 'given', k: 'given', t: `${g0} 구하는 것은 $\\angle BAD=x$.`, cap: '∠A=90°, AB=AC, D는 BC의 중점' });
      steps.push({ id: 'idea', k: 'idea', t: '$\\angle BAD$는 $\\angle A$를 둘로 나눈 각이에요. D가 BC의 중점이면 AD가 꼭지각을 이등분하는지, 두 삼각형 ABD, ACD가 합동인지 확인하면 돼요.', cap: 'D가 중점 → △ABD≡△ACD → ∠BAD=∠CAD' });
      steps.push({ id: 'cong', k: 'fig', lb: '합동 찾기', t: '△ABD와 △ACD에서 $\\overline{AB}=\\overline{AC}$, $\\overline{BD}=\\overline{CD}$, $\\overline{AD}$는 공통이므로 △ABD≡△ACD (SSS 합동). 그래서 $\\angle BAD=\\angle CAD$예요.', cap: 'AB=AC, BD=CD, AD 공통 → △ABD≡△ACD (SSS)' });
      steps.push({ id: 'eq', k: 'eq', t: '$\\angle BAD+\\angle CAD=90^{\\circ}$이고 두 각이 같으므로 $x=\\frac{90^{\\circ}}{2}=45^{\\circ}$', cap: 'x=\\frac{90°}{2}=45°' });
      steps.push({ id: 'ans', k: 'ans', t: '$x=45^{\\circ}$', cap: 'x = 45°' });
      items.length = 0;
      items.push(SK.ang(A, B, Cc, { r: 52, on: ['given'], col: 'sky', fa: 0.05 }), SK.tick(A, B, 1, { col: 'amber' }), SK.tick(A, Cc, 1, { col: 'amber' }), SK.tick(B, D, 1, { at: 'given', col: 'rose' }), SK.tick(D, Cc, 1, { at: 'given', col: 'rose' }), SK.seg(A, D, { at: 'given', col: 'green', w: 3.6 }),
        SK.fill([A, B, D], { at: 'cong', col: 'sky', a: 0.26 }), SK.fill([A, D, Cc], { at: 'cong', col: 'green', a: 0.26 }),
        SK.ang(A, B, D, { r: 40, ld: 64, rings: 2, on: ['given', 'cong', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: 'x=45°' }, gl: true, cut: [0, 6] }),
        SK.ang(A, D, Cc, { r: 40, ld: 64, rings: 2, at: 'cong', col: 'green', cut: [6, 0], label: '', to: 'eq' }));
    }
    return {
      fit: [A, B, Cc, pt(0, v === 2 ? 0.1 : 0.5)], steps, items,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.08); G.poly(b, [A, B, Cc], 'ink', 3.6); },
      names: (b) => { G.dots(b, [A, B, Cc], ['A', 'B', 'C'], cen, { size: 18 }); b.point(D, { color: 'ink', r: 4.5 }); T(b, D, 'D', { dy: 18, size: 18 }); }
    };
  };
  i4.solve = mkSolve(i4Plan, { quickTitle: '10초 컷 · 빗변의 중점에서 직각 꼭짓점까지는 빗변의 반', quick: (M, s) => { const v = (s.trV || 0) % 3; return v === 0 ? { steps: `<p>직각삼각형에서 빗변의 중점에서 직각 꼭짓점까지의 거리는 빗변의 반이므로 $\\overline{BC}=2\\times\\overline{AD}=2\\times${M.m}=${2 * M.m}$ (cm)</p>`, note: 'AD=BD=CD예요.' } : v === 1 ? { steps: `<p>$\\overline{AD}=\\frac{1}{2}\\overline{BC}=\\frac{${M.bc}}{2}=${M.m}$ (cm)</p>`, note: 'AD=BD=CD예요.' } : { steps: '<p>직각이등변삼각형에서 꼭지각(직각)의 이등분선이므로 $x=\\frac{90^{\\circ}}{2}=45^{\\circ}$</p>', note: '이등변삼각형의 꼭지각의 이등분선은 꼭지각을 반으로 나눠요.' }; } });

  /* ---- t1-5 누운 이등변삼각형 · v0: ∠A → ∠B · v1: ∠B → ∠A ---- */
  const i5Plan = (M, s) => {
    const { a, b: bb, g } = M, { A, B, C: Cc } = g, v = (s.trV || 0) % 2, cen = pt(A.x * 0.3, 0);
    const x = v === 0 ? bb : a, steps = [], items = [];
    const apex = (o) => SK.ang(A, B, Cc, { r: 32, ld: 56, ...o });
    const angB = (o) => SK.ang(B, Cc, A, { r: 30, ld: 54, rings: 2, ...o });
    const angC = (o) => SK.ang(Cc, A, B, { r: 30, ld: 54, rings: 2, ...o });
    items.push(SK.fill([A, B, Cc], { at: 'idea', col: 'violet', a: 0.16 }), SK.tick(A, B, 1, { col: 'amber' }), SK.tick(A, Cc, 1, { col: 'amber' }));
    const idea0 = '그림이 누워 있어도 같은 길이의 눈금이 있는 두 변 AB, AC가 만나는 점 A가 꼭지점이에요. 그래서 밑각은 꼭지점이 아닌 B, C의 각이고, 이 둘이 서로 같아요.';
    if (v === 0) {
      steps.push({ id: 'given', k: 'given', t: `${eqAB}인 이등변삼각형이 옆으로 누워 있어요. $\\angle A=${dd(a)}$이고, 구하는 것은 $\\angle B=x$.`, cap: `AB=AC, ∠A=${a}°` });
      steps.push({ id: 'idea', k: 'idea', t: `${idea0} 세 각의 합이 $180^{\\circ}$이니, 꼭지각을 빼고 반으로 나누면 한 밑각이에요.`, cap: '같은 눈금의 두 변이 만나는 점 A가 꼭지점' });
      steps.push({ id: 'fig', k: 'fig', lb: '그림 변화', t: `$\\angle C$도 $\\angle B$와 같으니까 같은 호를 그려요. 두 밑각의 합은 $180^{\\circ}-${dd(a)}=${dd(180 - a)}$예요.`, cap: `∠B=∠C, ∠B+∠C=180°−${a}°=${180 - a}°` });
      steps.push({ id: 'eq', k: 'eq', t: `$x=\\frac{180^{\\circ}-${dd(a)}}{2}=\\frac{${dd(180 - a)}}{2}=${dd(bb)}$`, cap: `x=\\frac{180°−${a}°}{2}=${bb}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(bb)}$`, cap: `x = ${bb}°` });
      items.push(apex({ on: ['given'], col: 'sky', label: dg(a), gl: true, glTo: 'eq' }), angB({ on: ['given', 'fig', 'eq', 'ans'], col: 'amber', cols: { fig: 'green' }, label: 'x', size: 17, labels: { ans: `x=${bb}°` }, gl: true }), angC({ on: ['fig'], col: 'green' }));
    } else {
      steps.push({ id: 'given', k: 'given', t: `${eqAB}인 이등변삼각형이 옆으로 누워 있어요. $\\angle B=${dd(bb)}$이고, 구하는 것은 꼭지각 $\\angle A=x$.`, cap: `AB=AC, ∠B=${bb}°` });
      steps.push({ id: 'idea', k: 'idea', t: `${idea0} 그러니 $\\angle C$도 ${bb}°이고, 세 각의 합 $180^{\\circ}$에서 두 밑각을 빼면 꼭지각이 나와요.`, cap: `밑각이 같다 → ∠C=∠B=${bb}°` });
      steps.push({ id: 'fig', k: 'fig', lb: '그림 변화', t: `$\\angle C=\\angle B=${dd(bb)}$이므로 $\\angle C$에도 같은 호와 ${bb}°를 써요.`, cap: `∠C=∠B=${bb}°` });
      steps.push({ id: 'eq', k: 'eq', t: `$x=180^{\\circ}-${dd(bb)}-${dd(bb)}=${dd(a)}$`, cap: `x=180°−${bb}°−${bb}°=${a}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(a)}$`, cap: `x = ${a}°` });
      items.push(angB({ on: ['given'], col: 'sky', label: dg(bb), gl: true, glTo: 'eq' }), angC({ on: ['fig'], col: 'green', label: dg(bb), gl: true, glTo: 'eq' }), apex({ on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${a}°` }, gl: true }));
    }
    void x;
    return {
      fit: [A, B, Cc], steps, items, l: 50, r: 50,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.08); G.poly(b, [A, B, Cc], 'ink', 3.6); },
      names: (b) => G.dots(b, [A, B, Cc], ['A', 'B', 'C'], cen, { size: 18 })
    };
  };
  i5.solve = mkSolve(i5Plan);

  /* ---- t1-6 대칭축 위의 점 P (옳은 것 고르기 → 값 구하기) · v0: ∠A, ∠PCB → ∠ABP · v1: ∠PBC → ∠BPC ---- */
  const i6Plan = (M, s) => {
    const { a, b: bb, th, rest, g, P: Pp } = M, { A, B, C: Cc, D } = g, v = (s.trV || 0) % 2, cen = pt(A.x * 0.3, 0), x = v === 0 ? rest : 180 - 2 * th;
    const steps = [], items = [];
    const g0 = `$${ov('AB')}=${ov('AC')}$이고 점 P는 꼭지각의 이등분선 AD 위의 점이에요.`;
    items.push(SK.tick(A, B, 1, { col: 'amber' }), SK.tick(A, Cc, 1, { col: 'amber' }), SK.seg(A, D, { at: 'given', col: 'green', w: 3.4 }),
      SK.fill([Pp, B, D], { at: 'sym', col: 'sky', a: 0.26 }), SK.fill([Pp, D, Cc], { at: 'sym', col: 'green', a: 0.26 }),
      SK.tick(Pp, B, 2, { at: 'sym', col: 'rose' }), SK.tick(Pp, Cc, 2, { at: 'sym', col: 'rose' }),
      SK.ang(D, Pp, B, { r: 20, at: 'sym', col: 'green' }), SK.ang(D, Pp, Cc, { r: 20, at: 'sym', col: 'green' }));
    const sym = { id: 'sym', k: 'fig', lb: '합동 찾기', t: `AD는 BC를 수직이등분하므로 △PBD와 △PCD에서 $\\overline{BD}=\\overline{CD}$, $\\angle PDB=\\angle PDC=90^{\\circ}$, $\\overline{PD}$는 공통이에요. 따라서 △PBD≡△PCD (SAS 합동)이고 $\\overline{PB}=\\overline{PC}$, $\\angle PBC=\\angle PCB=${dd(th)}$예요.`, cap: `△PBD≡△PCD → PB=PC, ∠PBC=∠PCB=${th}°` };
    const sr = G.sideRot; // 좁은 각의 값은 부채꼴 밖에 두되, G.ang 이 호에서 시작하는 지시선으로 그 각을 가리켜요
    if (v === 0) {
      steps.push({ id: 'given', k: 'given', t: `${g0} $\\angle A=${dd(a)}$, $\\angle PCB=${dd(th)}$이고, 구하는 것은 $\\angle ABP=x$.`, cap: `AB=AC, ∠A=${a}°, ∠PCB=${th}°` });
      steps.push({ id: 'idea', k: 'idea', t: 'P가 이등분선 AD 위에 있으면 PB=PC예요. 그러면 $\\angle PBC=\\angle PCB$를 알 수 있고, $\\angle ABP$는 밑각 $\\angle ABC$에서 $\\angle PBC$를 뺀 각이에요.', cap: '∠ABP = ∠ABC − ∠PBC' });
      steps.push(sym);
      steps.push({ id: 'base', k: 'fig', lb: '각 구하기', t: `이등변삼각형의 밑각은 $\\angle ABC=\\frac{180^{\\circ}-${dd(a)}}{2}=${dd(bb)}$예요.`, cap: `∠ABC=\\frac{180°−${a}°}{2}=${bb}°` });
      steps.push({ id: 'eq', k: 'eq', t: `$x=\\angle ABC-\\angle PBC=${dd(bb)}-${dd(th)}=${dd(rest)}$`, cap: `x=${bb}°−${th}°=${rest}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(rest)}$`, cap: `x = ${rest}°` });
      items.push(SK.ang(A, B, Cc, { r: 30, ld: 62, lr: -a / 4, on: ['given'], col: 'sky', label: dg(a), gl: true, glTo: 'idea' }),
        SK.ang(Cc, Pp, B, { r: 44, on: ['given', 'sym'], col: 'sky', cols: { sym: 'green' }, label: dg(th), ld: 76, lr: sr(Cc, Pp, B, 'B', 16) }),
        SK.ang(B, Pp, Cc, { r: 44, at: 'sym', col: 'green', label: dg(th), ld: 76, lr: sr(B, Pp, Cc, 'B', 16), gl: true }),
        SK.ang(B, A, Cc, { r: 60, ld: 90, at: 'base', col: 'violet', fa: 0.2, label: dg(bb), size: 16 }),
        SK.ang(B, A, Pp, { r: 40, on: ['given', 'eq', 'ans'], col: 'amber', fa: 0.5, label: 'x', size: 17, labels: { ans: `x=${rest}°` }, ld: 72, lr: sr(B, A, Pp, 'A', 16), gl: true }));
    } else {
      steps.push({ id: 'given', k: 'given', t: `${g0} $\\angle PBC=${dd(th)}$이고, 구하는 것은 $\\angle BPC=x$.`, cap: `AB=AC, ∠PBC=${th}°` });
      steps.push({ id: 'idea', k: 'idea', t: 'P가 이등분선 AD 위에 있으면 PB=PC라서 삼각형 PBC는 이등변삼각형이에요. 그러면 $\\angle PCB$도 알 수 있고, 세 각의 합 $180^{\\circ}$에서 꼭지각 $\\angle BPC$를 구해요.', cap: 'PB=PC → △PBC는 이등변삼각형' });
      steps.push(sym);
      steps.push({ id: 'eq', k: 'eq', t: `△PBC의 내각의 합에서 $x=180^{\\circ}-${dd(th)}-${dd(th)}=${dd(x)}$`, cap: `x=180°−${th}°−${th}°=${x}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(x)}$`, cap: `x = ${x}°` });
      items.push(SK.ang(B, Pp, Cc, { r: 44, on: ['given', 'sym'], col: 'sky', cols: { sym: 'green' }, label: dg(th), ld: 76, lr: sr(B, Pp, Cc, 'B', 16) }),
        SK.ang(Cc, Pp, B, { r: 44, at: 'sym', col: 'green', label: dg(th), ld: 76, lr: sr(Cc, Pp, B, 'B', 16), gl: true }),
        SK.ang(Pp, B, Cc, { r: 16, on: ['given', 'eq', 'ans'], col: 'amber', fa: 0.5, label: 'x', size: 17, labels: { ans: `x=${x}°` }, ld: 40, lr: sr(Pp, B, Cc, 'A', 40 - (90 - th)), gl: true }));
    }
    return {
      fit: [A, B, Cc, pt(0.45, 0)], steps, items, l: 50, r: 56,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.08); G.poly(b, [A, B, Cc], 'ink', 3.6); G.line(b, B, Pp, 'ink', 3); G.line(b, Cc, Pp, 'ink', 3); },
      names: (b) => { [A, B, Cc, D, Pp].forEach((q) => b.point(q, { color: q === Pp ? 'amber' : 'ink', r: q === Pp ? 5.5 : 4.5 })); G.tagOut(b, A, cen, 'A', { size: 18 }); G.tagOut(b, B, cen, 'B', { size: 18 }); G.tagOut(b, Cc, cen, 'C', { size: 18 }); T(b, D, 'D', { dx: 14, dy: -2, size: 18 }); T(b, Pp, 'P', { dx: -8, dy: 18, size: 18, color: 'amber' }); }
    };
  };
  i6.solve = mkSolve(i6Plan);
  i6.reroll = ((r0) => (s) => { r0(s); const b = (180 - even(s.trPa)) / 2; s.trPt = Math.max(10, Math.min(rint(22, 32), b - 15)); })(i6.reroll);
  i6.prob = (M, s) => {
    const { a, b: bb, th, rest } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${th}`;
    if (v === 0) return numProb({ tag: '대칭축 위의 점 · ∠ABP', key, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 점 P는 꼭지각의 이등분선 AD 위의 점이다. ∠A=${a}°, ∠PCB=${th}°일 때, ∠ABP의 크기 $x$는?`, correct: rest, wrongs: [[bb, '밑각 ∠ABC 전체예요. ∠PBC를 빼야 해요.'], [th, '∠PBC의 크기예요.'], [a / 2, '다시 생각해 보세요.'], [rest + 5, '다시 계산해 보세요.'], [rest - 5, '다시 계산해 보세요.']], ...degOpts(5) });
    return numProb({ tag: '대칭축 위의 점 · ∠BPC', key, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 점 P는 꼭지각의 이등분선 AD 위의 점이다. ∠PBC=${th}°일 때, ∠BPC의 크기 $x$는?`, correct: 180 - 2 * th, wrongs: [[th, '∠PBC의 크기예요.'], [180 - th, '다시 생각해 보세요.'], [90 - th, '∠BPD의 크기예요. ∠BPC는 그 2배예요.'], [180 - 2 * th + 10, '다시 계산해 보세요.'], [180 - 2 * th - 10, '다시 계산해 보세요.']], ...degOpts(5) });
  };

  /* ---- t1-7 변의 길이가 x의 식: ∠B=∠C → AB=AC → 방정식 ---- */
  const i7Plan = (M, s) => {
    const { Q, x0 } = M, texE = (p, q, sg) => `${p === 1 ? '' : p}x${q < 0 ? '-' + (-q) : '+' + q}`;
    const e1 = texE(Q.p, Q.q), e2 = texE(Q.r, Q.sv), pe1 = e1.replace('-', '−'), pe2 = e2;
    const l1 = Q.p * x0 + Q.q, l2 = Q.r * x0 + Q.sv, bc = Math.max(l1, l2) * 0.9 + 0.5, xx = (l1 * l1 - l2 * l2 + bc * bc) / (2 * bc), hh = Math.sqrt(Math.max(1e-6, l1 * l1 - xx * xx));
    const A = pt(xx, -hh), B = pt(0, 0), Cc = pt(bc, 0), cen = pt((A.x + bc) / 3, A.y / 3), steps = [], items = [];
    steps.push({ id: 'given', k: 'given', t: `$\\angle B=\\angle C$이고 $${ov('AB')}=(${e1})$ cm, $${ov('AC')}=(${e2})$ cm예요. 구하는 것은 $x$의 값.`, cap: `∠B=∠C, AB=(${pe1}) cm, AC=(${pe2}) cm` });
    steps.push({ id: 'idea', k: 'idea', t: '두 내각이 같은 삼각형은 이등변삼각형이라서, 그 각의 마주 보는 변 AB, AC의 길이가 같아요. 같은 길이를 두 가지 식으로 나타냈으니 "="로 이으면 $x$에 대한 방정식이 돼요.', cap: '∠B=∠C → AB=AC → 두 식을 =로 잇기' });
    steps.push({ id: 'fig', k: 'fig', lb: '그림 변화', t: '$\\angle B=\\angle C$이므로 마주 보는 변 AB, AC에 같은 눈금을 그려요.', cap: 'AB=AC' });
    steps.push({ id: 'eq1', k: 'eq', lb: '식 세우기', t: `$${e1}=${e2}$`, cap: `${pe1} = ${pe2}` });
    steps.push({ id: 'eq2', k: 'eq', lb: '식 풀기', t: Q.p - Q.r === 1 ? `$x$ 항은 왼쪽으로, 숫자는 오른쪽으로 모아 정리하면 $x=${Q.sv - Q.q}$` : `$${Q.p - Q.r}x=${Q.sv - Q.q}$이므로 $x=${x0}$`, cap: Q.p - Q.r === 1 ? `x=${Q.sv - Q.q}` : `${Q.p - Q.r}x=${Q.sv - Q.q} → x=${x0}` });
    steps.push({ id: 'ans', k: 'ans', t: `$x=${x0}$ (이때 $\\overline{AB}=\\overline{AC}=${l1}$ cm로 양수예요)`, cap: `x = ${x0}  (AB=AC=${l1} cm)` });
    items.push(SK.ang(B, Cc, A, { rings: 2, r: 30, on: ['given'], col: 'sky' }), SK.ang(Cc, A, B, { rings: 2, r: 30, on: ['given'], col: 'sky' }),
      SK.len(A, B, cen, `(${pe1})cm`, { on: ['given', 'eq1', 'ans'], col: 'sky', size: 16, gap: 6, labels: { ans: `${l1} cm` } }), SK.len(A, Cc, cen, `(${pe2})cm`, { on: ['given', 'eq1', 'ans'], col: 'sky', size: 16, gap: 6, labels: { ans: `${l2} cm` } }),
      SK.tick(A, B, 1, { at: 'fig', col: 'amber' }), SK.tick(A, Cc, 1, { at: 'fig', col: 'amber' }));
    return {
      fit: [A, B, Cc], steps, items, l: 56, r: 56,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.08); G.poly(b, [A, B, Cc], 'ink', 3.6); },
      names: (b) => G.dots(b, [A, B, Cc], ['A', 'B', 'C'], cen, { size: 18 })
    };
  };
  i7.solve = mkSolve(i7Plan);

  // 원클릭 해설은 기존 solve의 조건·단계·도형을 재사용한다.
  // 비교 장면은 대응하는 꼭짓점 순서를 유지한 두 삼각형을 같은 방향으로 떼어 놓고 평행이동한다.
  function lessonPair(b, s, config) {
    const { triangles, names, kind = 'SAS' } = config, first = triangles[0], second = triangles[1];
    const canonical = (points) => {
      const e = unit(sub(points[1], points[0])), n = pt(-e.y, e.x);
      const sign = (points[2].x - points[0].x) * n.x + (points[2].y - points[0].y) * n.y > 0 ? -1 : 1;
      return points.map(p => { const v = sub(p, points[0]); return pt(v.x * e.x + v.y * e.y, sign * (v.x * n.x + v.y * n.y)); });
    };
    const p = canonical(first), q = canonical(second), box = bboxOf([...p, ...q]), w = Math.max(box.x1 - box.x0, Math.abs(box.y1 - box.y0), .4), gap = 1.45 * w;
    const t = clamp(s.trMatch || 0, 0, 1), move = (points, dx) => points.map(p0 => pt(p0.x + dx, p0.y));
    const Pp = move(p, gap * t / 2), Qq = move(q, gap * (1 - t / 2));
    fit(b, { x0: box.x0 - .12 * w, x1: box.x1 + gap + .12 * w, y0: box.y0 - .15 * w, y1: box.y1 + .1 * w }, { t: 48, b: 90, l: 40, r: 40 });
    const marks = (points, color) => {
      const [A, B, Cc] = points;
      if (config.marks) {
        (config.marks.edges || []).forEach(([a, z, count]) => tick(b, points[a], points[z], count, color));
        (config.marks.angles || []).forEach(([v, a, z, rings = 1]) => ang(b, points[v], points[a], points[z], { color, rings, r: rings === 1 ? 18 : 25 }));
        return;
      }
      if (kind === 'SAS' || kind === 'SSS' || kind === 'RHA' || kind === 'RHS') tick(b, A, B, 1, color);
      if (kind === 'SAS' || kind === 'ASA' || kind === 'SSS' || kind === 'RHS') tick(b, A, Cc, 2, color);
      if (kind === 'SSS') tick(b, B, Cc, 3, color);
      if (kind === 'SAS' || kind === 'ASA' || kind === 'RHA') ang(b, A, B, Cc, { color, rings: 1, r: 25 });
      if (kind === 'ASA' || kind === 'RHA' || kind === 'RHS') ang(b, Cc, A, B, { color, r: 18 });
    };
    [[Pp, 'sky'], [Qq, 'green']].forEach(([points, color]) => { fillPoly(b, points, color, .12); poly(b, points, color, 3.2); marks(points, color); });
    if (config.counterexample && t >= .98) {
      Pp.forEach((p0, i) => {
        if (dist(p0, Qq[i]) < 1e-7) G.dots(b, [p0], [names[0][i] + '↔' + names[1][i]], G.centroid(Pp), { size: 16 });
        else { G.dots(b, [p0], [names[0][i]], G.centroid(Pp), { size: 16 }); G.dots(b, [Qq[i]], [names[1][i]], G.centroid(Qq), { size: 16 }); }
      });
    } else if (t < .98) [Pp, Qq].forEach((points, j) => G.dots(b, points, names[j], G.centroid(points), { size: 16 }));
    else G.dots(b, Pp, names[0].map((name, i) => name === names[1][i] ? name : name + '↔' + names[1][i]), G.centroid(Pp), { size: 16 });
    if (s.trLine) rowT(b, pt((box.x0 + box.x1 + gap) / 2, box.y1), s.trLine, { dy: 56, size: fs(b, 16), color: 'amber' });
  }
  function lessonAttach(D, plan, traceOf, pairOf, conceptPlan) {
    const selectedPlan = (M, s, b) => {
      const p = s.trLessonProblem === false && conceptPlan ? conceptPlan(M, s, b) : plan(M, s, b);
      return { ...p, steps: p.steps.map(st => ({ ...st, cap: '' })) };
    };
    const renderer = mkSolve(selectedPlan);
    D.lessonDraw = (b, s, M, C, SV, ST, idx) => {
      if (!C.entry && s.trCompare && pairOf) { lessonPair(b, s, pairOf(M, s)); return; }
      renderer.draw(b, s, M, C, ST, idx);
      if (!C.entry && s.trTrace > 0) { const [A, B] = traceOf(M, s); line(b, A, lerp(A, B, clamp(s.trTrace, 0, 1)), 'rose', 4.4); }
      if (!C.entry && s.trLine) { const box = bboxOf(selectedPlan(M, s, b).fit); rowT(b, pt((box.x0 + box.x1) / 2, box.y1), s.trLine, { dy: 56, size: fs(b, 16), color: C.answer ? 'amber' : 'green' }); }
    };
  }
  G.trLessonA = { attach: lessonAttach, pair: lessonPair };
  const splitPair = (g, kind = 'SAS') => ({ triangles: [[g.A, g.B, g.D], [g.A, g.C, g.D]], names: [['A', 'B', 'D'], ['A', 'C', 'D']], kind });
  lessonAttach(i1, i1Plan, (M, s) => { const g = i1Iso(s).g; return [g.A, g.B]; }, (M, s) => splitPair(i1Iso(s).g), (M, s) => {
    const p = i1Plan(M, s), { A, B, C: Cc, D } = i1Iso(s).g;
    return { ...p, items: p.items.filter(it => it.ty !== 'ang').concat(SK.seg(A, D, { at: 'idea', col: 'green', dash: [6, 5] }), SK.dot(D, 'D', { at: 'idea', dy: 18 }), SK.ang(B, Cc, A, { at: 'ans', col: 'green', rings: 2, label: 'β' }), SK.ang(Cc, A, B, { at: 'ans', col: 'green', rings: 2, label: 'β' })) };
  });
  lessonAttach(i2, i2Plan, (M, s) => { const g = i2Eq(s).tri; return [g.A, g.C]; }, (M, s) => splitPair({ ...i2Eq(s).tri, D: pt(0, 0) }, 'ASA'), (M, s) => {
    const p = i2Plan(M, s); return { ...p, items: p.items.filter(it => it.ty !== 'len') };
  });
  lessonAttach(i3, i3Plan, M => [M.g.A, M.g.D], M => splitPair(M.g));
  lessonAttach(i4, i4Plan, M => [M.g.A, M.g.D], M => splitPair(M.g, 'SSS'), (M, s) => {
    const p = i4Plan(M, s);
    return { ...p, items: p.items.map(it => it.ty === 'len' ? { ...it, str: 'AD', label: undefined, labels: undefined } : it.ty === 'dim' ? { ...it, str: 'BC', label: undefined, labels: undefined } : it) };
  });
  lessonAttach(i5, i5Plan, M => [M.g.A, M.g.B], null, (M, s) => {
    const p = i5Plan(M, s), { A, B, C: Cc } = M.g;
    return { ...p, items: p.items.filter(it => it.ty !== 'ang').concat(SK.ang(A, B, Cc, { at: 'ans', col: 'amber', rings: 3, label: '꼭지각', ld: 64 })) };
  });
  lessonAttach(i6, i6Plan, M => [M.P, M.g.B], M => ({ triangles: [[M.g.D, M.g.B, M.P], [M.g.D, M.g.C, M.P]], names: [['D', 'B', 'P'], ['D', 'C', 'P']], kind: 'SAS' }), (M, s) => {
    const p = i6Plan(M, s); return { ...p, items: p.items.filter(it => it.ty !== 'ang') };
  });
  lessonAttach(i7, i7Plan, (M, s) => i7Plan(M, s).fit.slice(0, 2));

  /* @@SOLVE-END */

  G.register(10, 't1', '① 이등변삼각형', '이등변삼각형', PARAMS, [i1, i2, i3, i4, i5, i6, i7]);
})();
