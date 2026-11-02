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
    trEx: P('x', 2, 9, 1, 5, { color: 'amber', hint: 'x를 바꿔 두 변이 같아지는 곳을 찾아보세요', format: (v) => String(v) })
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
      fit(b, gen ? bboxOf([A, B, Cc]) : { x0: -1.05, x1: 1.05, y0: -1.02, y1: 0.05 }, { t: 40, b: C.problem ? 40 : 88, l: 40, r: C.problem && v === 2 ? 60 : 44 });
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
      if (v === 0) return numProb({ tag: '이등변삼각형의 밑각', key: `0:${a}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ∠A=${a}°일 때, $x$의 크기는?`, correct: bb, wrongs: [[a, '꼭지각 ∠A 그대로 썼어요. 밑각은 (180°−∠A)÷2예요.'], [180 - a, '두 밑각의 합을 구했어요. 하나로 나누어야 해요.'], [90 - a / 2, '밑각이 아니라 다른 각이에요.'], [bb + 10, '다시 계산해 보세요.'], [bb - 10, '다시 계산해 보세요.']], ...degOpts(5) });
      if (v === 1) return numProb({ tag: '이등변삼각형의 꼭지각', key: `1:${bb}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ∠B=${bb}°일 때, $x$의 크기는?`, correct: a, wrongs: [[bb, '밑각 ∠B와 같다고 했어요.'], [180 - bb, '∠B의 보각을 구했어요.'], [180 - bb * 3, '내각의 합에서 ∠B를 한 번만 뺐어요. ∠C=∠B도 빼야 해요.'], [a + 10, '다시 계산해 보세요.'], [a - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== a), ...degOpts(5) });
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
      if (v === 0) return numProb({ tag: '꼭지각의 이등분선과 밑각', key: `0:${a}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ${S('AD')}는 ∠A의 이등분선이고 ∠BAD=${h}°이다. $x=\\angle B$의 크기는?`, correct: bb, wrongs: [[h, '∠BAD 그대로 썼어요. 삼각형 ABD에서 ∠ADB=90°를 써야 해요.'], [180 - 2 * h, '∠A를 구했어요.'], [90 - h / 2, '다시 계산해 보세요.'], [a, '꼭지각이에요.'], [bb + 10, '다시 계산해 보세요.']], ...degOpts(5) });
      if (v === 1) return numProb({ tag: '꼭지각의 이등분선과 수직', key: `1:${bb}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ${S('AD')}는 ∠A의 이등분선이다. ∠A=${a}°일 때, $x=\\angle ADB$의 크기는?`, correct: 90, wrongs: [[a, '꼭지각이에요.'], [h, '∠BAD예요.'], [bb, '밑각이에요.'], [180 - a, '다시 생각해 보세요.']], ...degOpts(5), pad: 15 });
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
      return numProb({ tag: '직각이등변삼각형 · 각', key: `2:${m}`, stem: `그림과 같이 ∠A=90°, ${S('AB')}=${S('AC')}인 직각이등변삼각형 ABC에서 점 D는 변 BC의 중점이다. $x=\\angle BAD$의 크기는?`, correct: 45, wrongs: [[90, '직각 ∠A예요.'], [30, '다시 생각해 보세요.'], [60, '다시 생각해 보세요.'], [135, '다시 생각해 보세요.'], [50, '다시 생각해 보세요.']], ...degOpts(15) });
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
      if (v === 0) return numProb({ tag: '누운 이등변삼각형 · 밑각', key: `0:${a}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ∠A=${a}°일 때, $x=\\angle B$의 크기는?`, correct: bb, wrongs: [[a, '꼭지각 그대로예요.'], [180 - a, '두 밑각의 합이에요.'], [bb + 10, '다시 계산해 보세요.'], [bb - 10, '다시 계산해 보세요.'], [90 - a / 2 + 5, '다시 계산해 보세요.']], ...degOpts(5) });
      return numProb({ tag: '누운 이등변삼각형 · 꼭지각', key: `1:${bb}`, stem: `그림과 같이 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC에서 ∠B=${bb}°일 때, $x=\\angle A$의 크기는?`, correct: a, wrongs: [[bb, '밑각 그대로예요.'], [180 - bb, '다시 생각해 보세요.'], [180 - 3 * bb, '내각의 합에서 밑각 둘을 빼야 해요.'], [a + 10, '다시 계산해 보세요.'], [a - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== a), ...degOpts(5) });
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
        ang(b, B, D, Pp, { color: 'sky', r: 30, rings: 2, label: dg(th), size: 15, labelDist: 52 });
        ang(b, Cc, D, Pp, { color: 'sky', r: 30, rings: 2, label: dg(th), size: 15, labelDist: 52 });
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
    ctl: ['trEx'],
    init: (s) => { s.trEx = 5; s.trQ = { p: 5, q: -6, r: 2, sv: 3 }; },
    reroll: (s) => {
      const x0 = rint(2, 8), p = rint(2, 6); let r = rint(1, 5); if (r === p) r = p - 1 || p + 1;
      const sv = rint(1, 9), q = r * x0 + sv - p * x0;
      s.trQ = { p, q, r, sv, x0 };
    },
    model: (s) => {
      const Q = s.trQ || { p: 5, q: -6, r: 2, sv: 3 }, x0 = Q.x0 || (Q.sv - Q.q) / (Q.p - Q.r), x = clamp(Math.round(s.trEx), 2, 9);
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
      fit(b, bboxOf([A, Bp, Cp]), { t: 44, b: C.problem ? 44 : 92, l: 50, r: 50 });
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

  G.register(10, 't1', '① 이등변삼각형', '이등변삼각형', PARAMS, [i1, i2, i3, i4, i5, i6, i7]);
})();
