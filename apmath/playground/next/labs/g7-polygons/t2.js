/* ==========================================================================
   중1 · 다각형 — 탭 ② 「삼각형의 내각과 외각」 (t2.js, order 20) — 장면 5개
   · p2-ext   외각의 성질 (평행 보조선으로 증명)      · 꼭짓점 A 끌기, 보조선 긋기
   · p2-star  별 모양 ☆의 꼭짓점의 각의 합 180°        · 네 각을 조절, 나머지 한 각은 180°에서 자동
   · p2-bis   내각·외각의 이등분선이 만드는 각 (3가지)   · ∠A 조절, 경우 고르기
   · p2-chain 이등변삼각형 연쇄 x → 2x → 3x → 4x       · 꼭지각 x 조절, 한 칸씩 이어 붙이기
   · p2-iso   이등변삼각형에 이어 붙인 이등변삼각형    · ∠B 조절, 변을 가로로 늘이기
   모든 각의 값·식·보기·정답은 지금의 조절 값에서 다시 계산됩니다. 각은 모두 정수(도)로 만들어집니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PG;
  if (!G) return;
  const { DEG, clamp, seg01, pt, add, sub, mul, unit, mid, lerp, len, polar, inter, angBetween, pick, rint, bboxOf, T, tagOut, ang, tick, par, fillPoly, line, poly, fit, P, mkChoices, LET, rd, notes, fmtN, dg, texDeg, tx } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const dv = (d) => pt(cos(d), sin(d)); // 화면 각도(도) → 단위 벡터 (y 아래쪽)
  const KK = { board: 0 };
  void KK;

  const PARAMS = {
    pgEa: P('∠A', 30, 80, 1, 50, { color: 'sky', hint: '그림의 꼭짓점 A를 끌어도 돼요', format: (v) => v + '°' }),
    pgEb: P('∠B', 30, 65, 1, 60, { color: 'sky', format: (v) => v + '°' }),
    pgEt: P('보조선 긋기', 0, 1, 0.01, 1, { color: 'green', hint: '▶를 누르거나 막대를 끌면 보조선이 그어져요', format: (v) => Math.round(v * 100) + '%' }),
    pgSa: P('∠A', 30, 40, 1, 36, { color: 'sky', format: (v) => v + '°' }),
    pgSb: P('∠B', 30, 40, 1, 36, { color: 'sky', format: (v) => v + '°' }),
    pgSc: P('∠C', 30, 40, 1, 36, { color: 'sky', format: (v) => v + '°' }),
    pgSd: P('∠D', 30, 40, 1, 36, { color: 'sky', format: (v) => v + '°' }),
    pgKa: P('∠A', 40, 90, 2, 60, { color: 'sky', hint: '그림의 꼭짓점 A를 끌어도 돼요', format: (v) => v + '°' }),
    pgKb: P('∠B', 40, 60, 2, 60, { color: 'sky', format: (v) => v + '°' }),
    pgCx: P('꼭지각 x', 14, 20, 1, 18, { color: 'amber', format: (v) => v + '°' }),
    pgCt: P('이어 붙이기', 0, 1, 0.01, 1, { color: 'green', hint: '▶를 누르거나 막대를 끌면 삼각형이 하나씩 이어져요', format: (v) => (v >= 0.999 ? '4개' : Math.floor(v * 4 + 1e-6) + '개') }),
    pgIb: P('∠B', 40, 70, 2, 70, { color: 'sky', format: (v) => v + '°' }),
    pgIt: P('변 CD 늘이기', 0, 1, 0.01, 1, { color: 'green', hint: '▶를 누르거나 막대를 끌면 CD가 가로로 늘어나요', format: (v) => Math.round(v * 100) + '%' })
  };

  const triPts = (a, bb) => { // 밑변 BC=2 (가로), ∠A=a, ∠B=bb
    const c = 180 - a - bb, B = pt(-1, 0), C = pt(1, 0), AB = 2 * sin(c) / sin(a);
    return { A: add(B, mul(dv(-bb), AB)), B, C, c };
  };
  const pad2 = { t: 42, b: 90 };

  /* ====================================================================== 1. 외각의 성질 */
  const ext = {
    id: 'p2-ext', title: '삼각형의 외각', short: '외각의 성질',
    question: '삼각형의 한 꼭짓점에서 변을 늘여 만든 외각은 이웃하지 않는 두 내각과 어떤 관계일까?',
    ctl: ['pgEa', 'pgEb', 'pgEt'], anim: { key: 'pgEt', dur: 5, label: '평행 보조선 긋기', start: 1 },
    init: (s) => { s.pgEa = 50; s.pgEb = 60; s.pgEt = 1; },
    reroll: (s) => { s.pgEa = rint(30, 80); s.pgEb = rint(30, 65); },
    model: (s) => { const a = clamp(Math.round(s.pgEa), 30, 80), bb = clamp(Math.round(s.pgEb), 30, 65), c = 180 - a - bb; return { a, bb, c, e: a + bb, tri: triPts(a, bb) }; },
    draw(b, s, M, C) {
      const { a, bb, c, e, tri } = M, { A, B, C: Cp } = tri, D = pt(Cp.x + 1.4, 0), E = add(Cp, mul(dv(-bb), 1.6));
      const c1 = C.problem ? 0 : C.review ? (C.step >= 1 ? 1 : 0) : seg01(C.t, 0, 0.34);
      const c2 = C.problem ? 0 : C.review ? (C.step >= 2 ? 1 : 0) : seg01(C.t, 0.34, 0.67);
      const c3 = C.problem ? 0 : C.review ? (C.step >= 3 ? 1 : 0) : seg01(C.t, 0.67, 1);
      const box = bboxOf([A, B, Cp, D, c1 > 0 ? E : D]);
      fit(b, box, { t: 50, b: 92, l: 40, r: 40 });
      fillPoly(b, [A, B, Cp], 'sky', 0.1);
      poly(b, [A, B, Cp], 'ink', 3.4);
      line(b, Cp, D, 'ink', 3.4);
      // 평행 보조선 CE ∥ AB
      if (c1 > 0) {
        line(b, Cp, lerp(Cp, E, c1), 'green', 3.6);
        if (c1 > 0.95) { par(b, A, B, 1, 'green', 0.5); par(b, Cp, E, 1, 'green', 0.55); }
      }
      // 내각
      const R = 30;
      if (!C.problem || true) {
        ang(b, A, B, Cp, { color: 'sky', rings: 1, r: R, label: C.problem ? dg(a) : dg(a), size: 16 });
        ang(b, B, Cp, A, { color: 'sky', rings: 2, r: R, label: dg(bb), size: 16 });
      }
      if (!C.problem) ang(b, Cp, Cp.x > A.x ? A : B, Cp.x > A.x ? B : A, { color: 'sky', r: 24, label: dg(c), size: 15, noMark: false });
      else ang(b, Cp, B, A, { color: 'sky', r: 24, label: dg(c), size: 15 });
      // 엇각·동위각으로 옮긴 각
      if (c2 > 0.01) {
        ang(b, Cp, A, E, { color: 'sky', rings: 1, r: 30, size: 16, alpha: c2, fa: 0.2 * c2 });
        ang(b, Cp, E, D, { color: 'sky', rings: 2, r: 30, size: 16, alpha: c2, fa: 0.2 * c2 });
      }
      // 외각
      if (c3 > 0.01 || C.problem) {
        ang(b, Cp, A, D, { color: 'amber', r: c2 > 0.01 ? 54 : 40, label: C.problem ? 'x' : dg(e), size: 18, fa: 0.16, labelDist: c2 > 0.01 ? 92 : 66 });
      }
      if (C.txt) {
        b.point(A, { color: 'ink', r: 4.5 }); b.point(B, { color: 'ink', r: 4.5 }); b.point(Cp, { color: 'ink', r: 4.5 });
        const cen = pt((A.x + B.x + Cp.x) / 3, (A.y + B.y + Cp.y) / 3);
        tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cp, cen, 'C', { size: 18, gap: 10 });
        T(b, D, 'D', { dy: 20, size: 18 });
        if (c1 > 0.5) T(b, E, 'E', { dx: 12, dy: -10, size: 17 });
        if (!C.problem && !C.thumb && !C.review) b.handle('A', A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 끌기', drag: (w) => {
          const bAng = Math.atan2(-w.y, w.x + 1) / DEG, cAng = Math.atan2(-w.y, 1 - w.x) / DEG;
          const nb = clamp(Math.round(bAng), 30, 65); let na = clamp(180 - nb - Math.round(cAng), 30, 80);
          s.pgEb = nb; s.pgEa = na;
        } });
        else b.point(A, { color: 'amber', r: 6.5 });
        const yb = 0;
        let row = '', col = 'amber';
        if (C.problem) row = '외각 x는 몇 도일까요?';
        else if (C.review && C.step === 1) { row = '보조선 CE ∥ AB 를 그어요'; col = 'green'; }
        else if (C.review && C.step === 2) { row = `엇각 ∠ACE=∠A=${a}° · 동위각 ∠ECD=∠B=${bb}°`; col = 'sky'; }
        else if (c3 > 0.5) row = `외각 = ∠A+∠B = ${a}°+${bb}° = ${e}°`;
        else if (c1 > 0.5) { row = '보조선 CE ∥ AB'; col = 'green'; }
        else row = '∠A, ∠B를 바꿔 보세요';
        T(b, pt((B.x + D.x) / 2, yb), row, { dy: 64, size: 17, color: col });
        if (!C.problem) T(b, pt((B.x + D.x) / 2, yb), `내각의 합 ${a}°+${bb}°+${c}° = 180°`, { dy: 90, size: 15, color: 'sky', alpha: 0.9 });
      }
    },
    steps: (M) => [
      `점 C를 지나 변 AB에 평행한 반직선 CE를 그어요. (평행 보조선)`,
      `평행선의 성질: ∠ACE=∠A=${M.a}° (엇각), ∠ECD=∠B=${M.bb}° (동위각)`,
      `∠ACD=∠ACE+∠ECD=∠A+∠B=${M.a}°+${M.bb}°=${M.e}° 이므로 <b>외각 = 이웃하지 않는 두 내각의 합</b>이에요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 A</b>를 끌거나 막대로 ∠A, ∠B를 바꿔 보세요. ▶를 누르면 평행 보조선이 그어지고 같은 각이 옮겨져요. 외각(<b>노랑</b>)은 늘 <b>∠A+∠B</b>예요.',
      readouts: [
        rd('∠A', `${M.a}°`, 'sky'), rd('∠B', `${M.bb}°`, 'sky'),
        rd('∠C (내각)', `${M.c}°`, 'sky', '180° − (∠A+∠B)'),
        rd('외각 ∠ACD', `${M.e}°`, 'amber', '∠A + ∠B', null, true)
      ],
      formula: `<p>(외각) $=$ (이웃하지 않는 두 내각의 합)</p><p>$\\angle ACD=\\angle A+\\angle B=${M.a}^{\\circ}+${M.bb}^{\\circ}=${M.e}^{\\circ}$</p><p>(삼각형의 내각의 합) $=${M.a}^{\\circ}+${M.bb}^{\\circ}+${M.c}^{\\circ}=180^{\\circ}$</p>`,
      rule: '삼각형의 한 외각의 크기 = 이웃하지 않는 두 내각의 크기의 합',
      notes: notes('외각은 <b>이웃한 내각 ∠C가 아니라</b> 이웃하지 않는 두 내각 ∠A, ∠B의 합이에요.', '외각과 이웃한 내각을 더하면 180°예요: ∠ACD+∠C=180°.')
    }),
    prob: (M) => {
      const { a, bb, c, e } = M;
      return {
        tag: '삼각형의 외각', key: `a${a}b${bb}`,
        stem: `그림과 같은 삼각형 ABC에서 ∠A=${a}°, ∠B=${bb}°일 때, 변 BC의 연장선 위의 점 D에 대하여 외각 ∠ACD의 크기 $x$는?`,
        choices: mkChoices(e, [[c, '이웃한 내각 ∠C를 구했어요. 외각은 이웃하지 않는 두 내각의 합이에요.'], [a + bb + c, '내각의 합 180°를 썼어요. 외각은 두 내각만 더해요.'], [Math.abs(a - bb), '두 내각의 차를 구했어요. 합이에요.'], [e + 10, '다시 한번 더해 보세요.'], [e - 10, '다시 한번 더해 보세요.']])
      };
    },
    verify: (s) => { const M = ext.model(s), { A, B, C: Cp } = M.tri; return { ans: angBetween(Cp, A, pt(Cp.x + 1, 0)), model: M.e, extra: [[angBetween(A, B, Cp) + angBetween(B, A, Cp) + angBetween(Cp, A, B), 180]] }; }
  };

  /* ====================================================================== 2. 별 모양 */
  // 별 ☆: 꼭짓점 A(위)·B(오른쪽 위)·C(오른쪽 아래)·D(왼쪽 아래)·E(왼쪽 위), 선분 AC·AD·BD·BE·CE
  function starPts(a, b, c, d, e) {
    const x = c + e, y = b + d, S = pt(0, 0), Pp = pt(1, 0), k = 1.618; // SP=1, BP=SE=k·SP
    const A = add(S, mul(dv(-y), sin(x) / sin(a)));
    const Bp = pt(1 + k, 0), E = pt(-k, 0);
    const uAS = unit(sub(S, A)), uAP = unit(sub(Pp, A));
    const D = add(S, mul(uAS, (1 + k) * sin(b) / sin(d)));
    const C = add(Pp, mul(uAP, (1 + k) * sin(e) / sin(c)));
    return { A, B: Bp, C, D, E, P: Pp, S, x, y };
  }
  const star = {
    id: 'p2-star', title: '별 모양의 각', short: '별 모양',
    question: '별 모양 ☆의 다섯 꼭짓점의 각 ∠A, ∠B, ∠C, ∠D, ∠E를 모두 더하면 얼마일까?',
    ctl: ['pgSa', 'pgSb', 'pgSc', 'pgSd'],
    init: (s) => { s.pgSa = 36; s.pgSb = 36; s.pgSc = 36; s.pgSd = 36; },
    reroll: (s) => { s.pgSa = rint(31, 39); s.pgSb = rint(31, 39); s.pgSc = rint(31, 39); s.pgSd = rint(31, 39); },
    model: (s) => {
      const a = clamp(Math.round(s.pgSa), 30, 40), b = clamp(Math.round(s.pgSb), 30, 40), c = clamp(Math.round(s.pgSc), 30, 40), d = clamp(Math.round(s.pgSd), 30, 40);
      const e = 180 - a - b - c - d;
      return { a, b, c, d, e, sum4: a + b + c + d, pts: starPts(a, b, c, d, e) };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, d, e, pts } = M, { A, B, C: Cc, D, E, P: Pp, S } = pts;
      const all = [A, B, Cc, D, E];
      fit(b, bboxOf(all), { t: 58, b: 112, l: 62, r: 62 });
      const cen = pt(all.reduce((q, p) => q + p.x, 0) / 5, all.reduce((q, p) => q + p.y, 0) / 5);
      const st = C.step;
      const lines = [[A, Cc], [A, D], [B, D], [B, E], [Cc, E]];
      // 풀이 단계에 따라 쓰는 삼각형 칠하기
      if (!C.problem && st >= 1 && st < 99) { fillPoly(b, [Pp, Cc, E], 'green', 0.22); fillPoly(b, [S, B, D], 'green', 0.22); }
      if (!C.problem && st >= 2 && st < 99) fillPoly(b, [A, Pp, S], 'sky', 0.26);
      lines.forEach(([p, q]) => line(b, p, q, 'ink', 3.4));
      const tips = [[A, D, Cc, a, 'A'], [B, E, D, bb, 'B'], [Cc, A, E, c, 'C'], [D, B, A, d, 'D'], [E, Cc, B, e, 'E']];
      tips.forEach(([V, p, q, val, nm], i) => {
        const isX = C.problem && i === 4;
        const col = isX ? 'amber' : 'sky';
        const r = ang(b, V, p, q, { color: col, r: 26, rings: 0, size: 16, fa: 0.3 });
        const u = unit(sub(cen, V));
        const lab = isX ? `${nm} x` : `${nm} ${val}°`;
        const dist = 24 + G.textW(lab, 16) * 0.4;
        T(b, V, lab, { dx: -u.x * dist, dy: -u.y * dist, color: isX ? 'amber' : 'sky', size: 16 });
        b.point(V, { color: 'ink', r: 4.5 });
        void r;
      });
      if (!C.txt) return;
      if (!C.problem && st >= 1) {
        T(b, Pp, 'P', { dx: 14, dy: -12, size: 15 }); T(b, S, 'S', { dx: -14, dy: -12, size: 15 });
      }
      if (!C.problem && st >= 1 && st < 99) {
        ang(b, Pp, A, S, { color: 'rose', r: 22 });
        T(b, Pp, `c+e=${c + e}°`, { dx: 12, dy: -30, size: 15, color: 'rose', align: 'left' });
        ang(b, S, Pp, A, { color: 'rose', r: 22 });
        T(b, S, `b+d=${bb + d}°`, { dx: -12, dy: -30, size: 15, color: 'rose', align: 'right' });
      }
      const yb = Math.max(D.y, Cc.y);
      let row = '', col = 'amber';
      if (C.problem) row = '별 모양에서 ∠E = x 의 크기는?';
      else if (st === 1) { row = `삼각형 PCE, SBD 의 외각 → c+e, b+d`; col = 'green'; }
      else if (st === 2) { row = `△APS: ${a}°+${c + e}°+${bb + d}° = 180°`; col = 'sky'; }
      else row = b.W < 560 ? `A+B+C+D+E = 180°` : `A+B+C+D+E = ${a}+${bb}+${c}+${d}+${e} = 180°`;
      T(b, pt((D.x + Cc.x) / 2, yb), row, { dy: 80, size: 17, color: col });
      if (!C.problem && !C.review && b.W < 560) T(b, pt((D.x + Cc.x) / 2, yb), `${a}+${bb}+${c}+${d}+${e} = 180`, { dy: 104, size: 15, color: 'sky' });
    },
    steps: (M) => [
      `삼각형의 외각의 성질을 두 번 써요. △PCE의 외각 ∠APS=∠C+∠E=${M.c + M.e}°, △SBD의 외각 ∠ASP=∠B+∠D=${M.b + M.d}°`,
      `△APS의 세 내각의 합: ∠A + (∠C+∠E) + (∠B+∠D) = 180°`,
      `∠A+∠B+∠C+∠D+∠E = ${M.a}°+${M.b}°+${M.c}°+${M.d}°+${M.e}° = 180°`
    ],
    view: (M) => ({
      guide: '막대로 ∠A, ∠B, ∠C, ∠D를 바꿔 보세요. 별의 모양이 변해도 <b>다섯 꼭짓점의 각의 합은 늘 180°</b>예요. ∠E는 나머지 값으로 자동으로 정해져요.',
      readouts: [
        rd('∠A + ∠B + ∠C + ∠D', `${M.sum4}°`, 'sky'),
        rd('∠E', `${M.e}°`, 'sky', '180° − (네 각의 합)'),
        rd('다섯 각의 합', `${M.a + M.b + M.c + M.d + M.e}°`, 'amber', '늘 180°', null, true)
      ],
      formula: `<p>$\\angle A+\\angle B+\\angle C+\\angle D+\\angle E=180^{\\circ}$</p><p>$${M.a}^{\\circ}+${M.b}^{\\circ}+${M.c}^{\\circ}+${M.d}^{\\circ}+${M.e}^{\\circ}=180^{\\circ}$</p>`,
      rule: '별 모양(☆)의 다섯 꼭짓점의 각의 합 = 180°',
      notes: notes('별 모양의 각은 <b>꼭짓점의 뾰족한 각(안쪽)</b> 다섯 개만 더해요. 별 안쪽 오각형의 내각은 넣지 않아요.', '다섯 각의 합은 540°(오각형)가 아니라 <b>180°</b>예요.')
    }),
    prob: (M) => {
      const { sum4, e } = M;
      return {
        tag: '별 모양에서 각의 크기', key: `${M.a},${M.b},${M.c},${M.d}`,
        stem: `그림과 같은 별 모양에서 ∠A=${M.a}°, ∠B=${M.b}°, ∠C=${M.c}°, ∠D=${M.d}°일 때, ∠E의 크기 $x$는?`,
        choices: mkChoices(e, [[sum4, '네 각의 합을 구했어요. 다섯 각의 합 180°에서 빼야 해요.'], [540 - sum4, '오각형의 내각의 합 540°를 썼어요. 별 모양은 180°예요.'], [360 - sum4, '360°를 썼어요. 별 모양은 180°예요.'], [e + 10, '다시 한번 계산해 보세요.'], [e - 5, '다시 한번 계산해 보세요.']])
      };
    },
    verify: (s) => { const M = star.model(s), p = M.pts; const m = (V, q, r) => angBetween(V, q, r); const tot = m(p.A, p.D, p.C) + m(p.B, p.E, p.D) + m(p.C, p.A, p.E) + m(p.D, p.B, p.A) + m(p.E, p.C, p.B); return { ans: m(p.E, p.C, p.B), model: M.e, extra: [[tot, 180], [m(p.A, p.D, p.C), M.a], [m(p.B, p.E, p.D), M.b], [m(p.C, p.A, p.E), M.c], [m(p.D, p.B, p.A), M.d]] }; }
  };

  /* ====================================================================== 3. 이등분선 */
  const BIS = {
    1: { name: '내각의 이등분선 둘', val: (A) => 90 + A / 2, tex: (A) => `90^{\\circ}+\\dfrac{1}{2}\\times${A}^{\\circ}`, sym: '90° + ½∠A' },
    2: { name: '외각의 이등분선 둘', val: (A) => 90 - A / 2, tex: (A) => `90^{\\circ}-\\dfrac{1}{2}\\times${A}^{\\circ}`, sym: '90° − ½∠A' },
    3: { name: '내각과 외각의 이등분선', val: (A) => A / 2, tex: (A) => `\\dfrac{1}{2}\\times${A}^{\\circ}`, sym: '½∠A' }
  };
  function bisGeom(a, bb, k) {
    const { A, B, C, c } = triPts(a, bb);
    let X, extB = null, extC = null, F = null, tgtB, tgtC;
    if (k === 1) { X = inter(B, add(B, dv(-bb / 2)), C, add(C, dv(180 + c / 2))); }
    else if (k === 2) { X = inter(B, add(B, dv(90 - bb / 2)), C, add(C, dv(90 + c / 2))); extB = add(B, mul(dv(180 - bb), 1.5)); extC = add(C, mul(dv(c), 1.5)); }
    else { X = inter(B, add(B, dv(-bb / 2)), C, add(C, dv(c / 2 - 90))); F = pt(C.x + 1.5, 0); }
    return { A, B, C, c, X, extB, extC, F, tgtB, tgtC };
  }
  const bis = {
    id: 'p2-bis', title: '내각·외각의 이등분선', short: '이등분선',
    question: '삼각형의 두 각의 이등분선이 만나서 생기는 각은 ∠A와 어떤 관계일까?',
    ctl: ['pgKa', 'pgKb'],
    presets: () => [1, 2, 3].map((k, i) => ({ group: i === 0 ? '이등분선의 종류' : '', label: ['내각 + 내각', '외각 + 외각', '내각 + 외각'][i], apply: (s) => { s.pgK = k; }, on: (s) => s.pgK === k })),
    init: (s) => { s.pgKa = 60; s.pgKb = 60; s.pgK = 1; },
    reroll: (s) => { s.pgKa = pick([40, 44, 50, 56, 60, 64, 70, 76, 80, 90], s.pgKa); s.pgKb = pick([40, 44, 50, 56, 60], s.pgKb); },
    model: (s) => {
      const a = clamp(Math.round(s.pgKa / 2) * 2, 40, 90), bb = clamp(Math.round(s.pgKb / 2) * 2, 40, 60), k = [1, 2, 3].includes(s.pgK) ? s.pgK : 1, c = 180 - a - bb;
      return { a, bb, c, k, x: BIS[k].val(a), g: bisGeom(a, bb, k) };
    },
    draw(b, s, M, C) {
      const { a, bb, c, k, x, g } = M, { A, B, C: Cp, X, extB, extC, F } = g;
      const pts = [A, B, Cp, X].concat(extB ? [extB, extC] : []).concat(F ? [F] : []);
      fit(b, bboxOf(pts), { t: 50, b: 92, l: 40, r: 40 });
      const st = C.step, cen = pt((A.x + B.x + Cp.x) / 3, (A.y + B.y + Cp.y) / 3);
      const sh = (n) => (C.problem ? n <= 0 : st >= n);
      fillPoly(b, [A, B, Cp], 'sky', 0.1);
      poly(b, [A, B, Cp], 'ink', 3.4);
      // 연장선
      if (k === 2) { line(b, B, extB, 'ink', 3, { dash: [7, 6] }); line(b, Cp, extC, 'ink', 3, { dash: [7, 6] }); }
      if (k === 3) line(b, Cp, F, 'ink', 3, { dash: [7, 6] });
      // 이등분선 (초록)
      if (sh(2) || C.full) { line(b, B, X, 'green', 3.6); line(b, Cp, X, 'green', 3.6); }
      // 반으로 나뉜 각 표시 (● = 1개, × = 2개)
      const r1 = 30, r2 = 36;
      if (sh(2) || C.full) {
        if (k === 1) {
          ang(b, B, Cp, X, { color: 'sky', rings: 1, r: r1, label: '●', size: 17 }); ang(b, B, X, A, { color: 'sky', rings: 1, r: r1, label: '●', size: 17 });
          ang(b, Cp, X, A, { color: 'violet', rings: 2, r: r2, label: '×', size: 17 }); ang(b, Cp, B, X, { color: 'violet', rings: 2, r: r2, label: '×', size: 17 });
        } else if (k === 2) {
          ang(b, B, Cp, X, { color: 'rose', rings: 1, r: r1, label: '●', size: 17 }); ang(b, B, X, extB, { color: 'rose', rings: 1, r: r1, label: '●', size: 17 });
          ang(b, Cp, B, X, { color: 'violet', rings: 2, r: r2, label: '×', size: 17 }); ang(b, Cp, X, extC, { color: 'violet', rings: 2, r: r2, label: '×', size: 17 });
        } else {
          ang(b, B, Cp, X, { color: 'sky', rings: 1, r: r1, label: '●', size: 17 }); ang(b, B, X, A, { color: 'sky', rings: 1, r: r1, label: '●', size: 17 });
          ang(b, Cp, A, X, { color: 'violet', rings: 2, r: r2, label: '×', size: 17 }); ang(b, Cp, X, F, { color: 'violet', rings: 2, r: r2, label: '×', size: 17 });
        }
      }
      ang(b, A, B, Cp, { color: 'sky', r: 30, label: dg(a), size: 16 });
      // 구하는 각 x
      ang(b, X, B, Cp, { color: 'amber', r: 32, label: C.problem ? 'x' : dg(x), size: 18, fa: 0.26 });
      if (C.txt) {
        [A, B, Cp].forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, cen, 'ABC'[i], { size: 18 }); });
        b.point(X, { color: 'amber', r: 5 });
        tagOut(b, X, cen, k === 1 ? 'I' : k === 2 ? 'E' : 'D', { size: 17, color: 'amber', gap: 22 });
        if (!C.problem && !C.thumb && !C.review) b.handle('A', A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 끌기', drag: (w) => {
          const bAng = Math.atan2(-w.y, w.x + 1) / DEG, cAng = Math.atan2(-w.y, 1 - w.x) / DEG;
          const nb = clamp(Math.round(bAng / 2) * 2, 40, 60); const na = clamp(Math.round((180 - nb - cAng) / 2) * 2, 40, 90);
          s.pgKb = nb; s.pgKa = na;
        } });
        const hb = k === 2 ? 90 - bb / 2 : bb / 2, hc = k === 1 ? c / 2 : k === 2 ? 90 - c / 2 : 90 - c / 2 + 0; // 호
        void hc;
        const o = k === 1 ? { p: bb / 2, q: c / 2 } : k === 2 ? { p: 90 - bb / 2, q: 90 - c / 2 } : { p: bb / 2, q: (a + bb) / 2 };
        let row1, row2, col2 = 'amber';
        void hb;
        const bx = (B.x + Cp.x) / 2, yb = Math.max(B.y, Cp.y, X.y);
        if (C.problem) { row1 = '∠A 의 크기가 주어졌어요'; row2 = `x 의 크기는?`; }
        else {
          row1 = `● = ${fmtN(o.p)}°,  × = ${fmtN(o.q)}°`;
          row2 = st <= 1 ? '● 와 × 를 정해요' : st === 2 ? `2●+2×+∠A = 180°` : `x = ${BIS[k].sym} = ${dg(x)}`;
          if (C.full) row2 = `x = ${BIS[k].sym} = ${dg(x)}`;
        }
        T(b, pt(bx, yb), row1, { dy: 54, size: 16, color: 'sky' });
        T(b, pt(bx, yb), row2, { dy: 80, size: 17, color: col2 });
      }
    },
    steps: (M) => {
      const { a, k } = M;
      if (k === 1) return [
        `∠B의 이등분선과 ∠C의 이등분선이 만나는 점을 I라 하고, ∠ABI=∠IBC=●, ∠ACI=∠ICB=× 라 해요.`,
        `△ABC의 내각의 합: ${a}° + 2● + 2× = 180° 이므로 ● + × = 90° − ½×${a}° = ${90 - a / 2}°`,
        `△IBC에서 x = 180° − (● + ×) = 180° − ${90 - a / 2}° = ${90 + a / 2}° (= 90° + ½∠A)`
      ];
      if (k === 2) return [
        `∠B의 외각의 이등분선과 ∠C의 외각의 이등분선이 만나는 점을 E라 하고, 두 외각을 각각 이등분한 각을 ●, × 라 해요.`,
        `외각: 2● = 180° − ∠B, 2× = 180° − ∠C 이므로 2● + 2× = 360° − (∠B+∠C) = 360° − (180° − ${a}°) = ${180 + a}°, ● + × = ${90 + a / 2}°`,
        `△EBC에서 x = 180° − (● + ×) = 180° − ${90 + a / 2}° = ${90 - a / 2}° (= 90° − ½∠A)`
      ];
      return [
        `∠B의 이등분선과 ∠C의 외각의 이등분선이 만나는 점을 D라 하고, ∠ABD=∠DBC=●, ∠ACD=∠DCF=× 라 해요.`,
        `△ABC에서 ∠ACF는 외각이므로 2× = ${a}° + 2● 이고, △DBC에서 ∠DCF도 외각이므로 × = ● + x 예요.`,
        `2× = 2● + 2x 와 비교하면 ${a}° = 2x 이므로 x = ½×${a}° = ${a / 2}° (= ½∠A)`
      ];
    },
    view: (M) => ({
      guide: `<b>노란 점 A</b>를 끌거나 막대로 ∠A를 바꿔 보세요. 위의 칩으로 <b>이등분선의 종류</b>를 고르면 그림이 바뀌어요. 구하는 각 x는 늘 <b>${BIS[M.k].sym}</b>예요.`,
      readouts: [
        rd('이등분선', BIS[M.k].name, 'green'), rd('∠A', `${M.a}°`, 'sky'),
        rd('x', `${dg(M.x)}`, 'amber', BIS[M.k].sym, null, true)
      ],
      formula: `<p>$x=${BIS[M.k].tex(M.a)}=${tx(M.x)}^{\\circ}$</p>`,
      rule: M.k === 1 ? '내각의 이등분선 둘이 만드는 ∠BIC = 90° + ½∠A' : M.k === 2 ? '외각의 이등분선 둘이 만드는 ∠BEC = 90° − ½∠A' : '내각과 외각의 이등분선이 만드는 ∠BDC = ½∠A',
      notes: notes('세 가지를 헷갈리기 쉬워요. <b>내각+내각</b>은 90°보다 크고, <b>외각+외각</b>은 90°보다 작고, <b>내각+외각</b>은 ∠A의 반이에요.', '외각의 이등분선은 외각(180°−∠B)을 반으로 나눠요. 내각이 아니에요.')
    }),
    prob: (M) => {
      const { a, k, x } = M, V = BIS;
      const w = [[V[1].val(a), '내각의 이등분선 둘일 때의 값이에요. 이 문제와 다른 경우예요.'], [V[2].val(a), '외각의 이등분선 둘일 때의 값이에요.'], [V[3].val(a), '내각과 외각의 이등분선일 때의 값이에요.'], [180 - a, '∠A의 보각을 구했어요.'], [90 + a, '90°에 ∠A를 그대로 더했어요. ½을 곱해요.'], [a, '∠A 그대로예요.']].filter((q) => Math.abs(q[0] - x) > 1e-6);
      const stems = { 1: '∠B의 이등분선과 ∠C의 이등분선이 만나는 점을 I라 할 때, ∠BIC의 크기 $x$는?', 2: '∠B의 외각의 이등분선과 ∠C의 외각의 이등분선이 만나는 점을 E라 할 때, ∠BEC의 크기 $x$는?', 3: '∠B의 이등분선과 ∠C의 외각의 이등분선이 만나는 점을 D라 할 때, ∠BDC의 크기 $x$는?' };
      return { tag: ['', '내각의 이등분선', '외각의 이등분선', '내각과 외각의 이등분선'][k], key: `k${k}a${a}`, stem: `삼각형 ABC에서 ∠A=${a}°이고 ${stems[k]}`, choices: mkChoices(x, w) };
    },
    verify: (s) => { const M = bis.model(s), g = M.g; return { ans: angBetween(g.X, g.B, g.C), model: M.x }; }
  };

  /* ====================================================================== 4. 이등변삼각형 연쇄 */
  // 반직선 1(가로, A에서 오른쪽)과 반직선 2(A에서 x°)에 번갈아 길이 1인 선분을 이어 붙입니다. AB=BC=CD=DE=EF
  function chainPts(x) {
    const A = pt(0, 0), u1 = pt(1, 0), u2 = dv(-x), pts = [A];
    let prev = A, onRay2 = true, cur = add(A, u2); // B
    pts.push(cur);
    for (let i = 0; i < 4; i++) {
      onRay2 = !onRay2;
      const ray = onRay2 ? u2 : u1, X = pts[pts.length - 1];
      // 원 |P−X|=1 과 반직선 A+t·ray 의 교점 중 A에서 먼 쪽
      const bq = X.x * ray.x + X.y * ray.y, cq = X.x * X.x + X.y * X.y - 1, disc = bq * bq - cq;
      const t = bq + Math.sqrt(Math.max(0, disc));
      pts.push(add(A, mul(ray, t)));
    }
    return { A: pts[0], B: pts[1], C: pts[2], D: pts[3], E: pts[4], F: pts[5] };
  }
  const chain = {
    id: 'p2-chain', title: '이등변삼각형 연쇄 (x → 2x → 3x → 4x)', short: '이등변삼각형 연쇄',
    question: 'AB=BC=CD=DE=EF 일 때, 이등변삼각형을 하나씩 이어 붙이면 밑각은 x에서 몇 배씩 커질까?',
    ctl: ['pgCx', 'pgCt'], anim: { key: 'pgCt', dur: 7, label: '삼각형 하나씩 이어 붙이기', start: 1 },
    init: (s) => { s.pgCx = 18; s.pgCt = 1; },
    reroll: (s) => { s.pgCx = pick([14, 15, 16, 18, 20], s.pgCx); },
    model: (s) => { const x = clamp(Math.round(s.pgCx), 14, 20); return { x, p: chainPts(x) }; },
    draw(b, s, M, C) {
      const { x, p } = M, { A, B, C: Cc, D, E, F } = p;
      const n = C.problem ? 4 : C.review ? Math.min(4, C.step) : Math.min(4, Math.floor(C.t * 4 + 1e-6) + (C.t >= 0.999 ? 0 : 0));
      const part = C.problem || C.review ? 0 : (C.t * 4 - Math.floor(C.t * 4 + 1e-6));
      const vis = C.problem || C.review ? 4 : 4; // 그림은 처음부터 모두 보이되, 아직 아닌 삼각형은 흐리게
      void vis;
      fit(b, bboxOf([A, B, Cc, D, E, F]), { t: 40, b: 86, l: 36, r: 40 });
      const tri = [[A, B, Cc], [B, Cc, D], [Cc, D, E], [D, E, F]];
      const col = ['sky', 'green', 'violet', 'amber'];
      // 삼각형 칠하기
      tri.forEach((t3, i) => { const on = i < n || C.problem; fillPoly(b, t3, col[i], on ? 0.2 : 0.04); });
      // 두 반직선 + 이어 붙인 선분
      const segs = [[A, B], [B, Cc], [Cc, D], [D, E], [E, F]];
      line(b, A, pt(E.x + 0.5, 0), 'ink', 2.4, { alpha: 0.6 });
      line(b, A, add(F, mul(unit(sub(F, A)), 0.5)), 'ink', 2.4, { alpha: 0.6 });
      segs.forEach(([q, r], i) => { const on = i < n + 1 || C.problem; line(b, q, r, 'ink', on ? 3.6 : 1.6, { alpha: on ? 1 : 0.3 }); if (on) tick(b, q, r, 1, 'amber'); });
      // 각 표시: 삼각형 i 의 밑각 두 개 = (i+1)x
      const roomy = (b.k || 60) >= 150, lbl = (k) => (C.review || !roomy ? (k === 1 ? 'x' : `${k}x`) : `${k * x}°`);
      const sets = [[[A, Cc, B, 1], [Cc, A, B, 1]], [[B, Cc, D, 2], [D, B, Cc, 2]], [[Cc, D, E, 3], [E, Cc, D, 3]], [[D, E, F, 4], [F, D, E, 4]]];
      sets.forEach((pair, i) => {
        if (!(i < n || C.problem)) return;
        const isG = C.problem && i === 3, isX = C.problem && i === 0;
        void isG;
        const k = i + 1;
        pair.forEach(([V, q, r], j) => {
          const hide = C.problem && ((i === 3 && j === 0) || (i === 0 && j === 1) || (i === 1) || (i === 2) || (i === 3 && j === 1));
          void hide;
          let color = ['sky', 'green', 'violet', 'amber'][i];
          let label = lbl(k);
          if (C.problem) { if (!(i === 3 && j === 0) && !(i === 0 && j === 0)) return; label = i === 0 ? 'x' : dg(4 * x); color = i === 0 ? 'amber' : 'sky'; }
          const rr = 26 + (k - 1) * 0;
          ang(b, V, q, r, { color, rings: k, r: rr, label: (!roomy && !C.problem && j === 1) ? '' : label, size: 15, labelDist: 52 });
        });
        void isX;
      });
      if (!C.txt) return;
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach((nm, i) => { const q = [A, B, Cc, D, E, F][i]; b.point(q, { color: 'ink', r: 4.5 }); });
      const off = (q, dx, dy, nm) => T(b, q, nm, { dx, dy, size: 17 });
      off(A, -14, 10, 'A'); off(B, -6, -16, 'B'); off(Cc, 0, 18, 'C'); off(D, -4, -17, 'D'); off(E, 2, 18, 'E'); off(F, 4, -17, 'F');
      const bx = (A.x + E.x) / 2, yb = 0;
      let row, rcol = 'amber';
      if (C.problem) row = `AB=BC=CD=DE=EF 일 때 ∠A = x 의 크기는?`;
      else if (C.review) row = ['x', 'x → 2x', 'x → 2x → 3x', 'x → 2x → 3x → 4x'][Math.min(3, Math.max(0, C.step - 1))] + (C.step >= 1 ? `  (${[1, 2, 3, 4].slice(0, Math.max(1, C.step)).map((k) => k * x + '°').join(' → ')})` : '');
      else row = `x=${x}° → 2x=${2 * x}° → 3x=${3 * x}° → 4x=${4 * x}°`;
      T(b, pt(bx, yb), row, { dy: 66, size: 16, color: rcol });
      void part;
    },
    steps: (M) => [
      `AB=BC 이므로 △ABC는 이등변삼각형이에요. ∠ACB=∠A=x=${M.x}°`,
      `∠CBD는 △ABC의 외각이므로 ∠CBD=∠A+∠ACB=2x=${2 * M.x}°. BC=CD 이므로 ∠CDB=∠CBD=2x`,
      `∠DCE는 △ACD의 외각이므로 ∠DCE=∠A+∠ADC=x+2x=3x=${3 * M.x}°. CD=DE 이므로 ∠DEC=∠DCE=3x`,
      `∠EDF는 △ADE의 외각이므로 ∠EDF=∠A+∠AED=x+3x=4x=${4 * M.x}°. 따라서 ∠EDF=4∠A`
    ],
    view: (M) => ({
      guide: '막대로 <b>꼭지각 x</b>를 바꾸거나 ▶를 눌러 이등변삼각형이 하나씩 이어지는 것을 보세요. <b>같은 표시(호의 개수)</b>의 각은 크기가 같아요. 밑각은 x → 2x → 3x → 4x로 커져요.',
      readouts: [rd('∠A = x', `${M.x}°`, 'sky'), rd('∠CBD = 2x', `${2 * M.x}°`, 'green'), rd('∠DCE = 3x', `${3 * M.x}°`, 'violet'), rd('∠EDF = 4x', `${4 * M.x}°`, 'amber')],
      formula: `<p>$\\angle EDF=4x=4\\times${M.x}^{\\circ}=${4 * M.x}^{\\circ}$</p><p>x → 2x → 3x → 4x (외각 = 두 내각의 합)</p>`,
      rule: '이등변삼각형을 이어 붙이면 외각의 성질로 밑각이 x, 2x, 3x, 4x로 늘어난다',
      notes: notes('이등변삼각형의 <b>같은 두 각</b>은 밑각이에요. 어느 변이 같은지 먼저 확인하세요.', '외각은 <b>이웃하지 않는 두 내각의 합</b>이에요. 매번 ∠A=x가 더해져서 한 칸씩 x만큼 커져요.')
    }),
    prob: (M) => {
      const { x } = M;
      return {
        tag: '이등변삼각형과 외각', key: `x${x}`,
        stem: `그림에서 $\\overline{AB}=\\overline{BC}=\\overline{CD}=\\overline{DE}=\\overline{EF}$이고 ∠EDF=${4 * x}°일 때, ∠A의 크기 $x$는?`,
        choices: mkChoices(x, [[4 * x, '∠EDF 자체예요. ∠EDF는 ∠A의 4배예요.'], [2 * x, '∠EDF=4x이므로 x=∠EDF÷4예요.'], [(4 * x) / 3, '∠EDF=3x라고 생각했어요. 4x예요.'], [(4 * x) / 2, '∠EDF=2x라고 생각했어요. 4x예요.'], [x + 5, '다시 계산해 보세요.'], [x - 3, '다시 계산해 보세요.']], { pad: 3 })
      };
    },
    verify: (s) => { const M = chain.model(s), p = M.p; return { ans: angBetween(p.A, p.B, p.C), model: M.x, extra: [[angBetween(p.D, p.E, p.F), 4 * M.x], [angBetween(p.B, p.C, p.D), 2 * M.x], [angBetween(p.C, p.D, p.E), 3 * M.x]] }; }
  };

  /* ====================================================================== 5. 이등변삼각형에 붙인 이등변삼각형 */
  const iso = {
    id: 'p2-iso', title: '이등변삼각형에 이어 붙인 이등변삼각형', short: '이등변삼각형 + 외각',
    question: 'AB=AC인 이등변삼각형에서 변 BC를 늘여 CD=CA가 되게 하면 ∠D는 ∠B의 몇 배일까?',
    ctl: ['pgIb', 'pgIt'], anim: { key: 'pgIt', dur: 4.5, label: 'CD를 가로로 늘이기', start: 1 },
    init: (s) => { s.pgIb = 70; s.pgIt = 1; },
    reroll: (s) => { s.pgIb = pick([40, 44, 48, 50, 54, 56, 60, 64, 66, 70], s.pgIb); },
    model: (s) => {
      const bb = clamp(Math.round(s.pgIb / 2) * 2, 40, 70), al = 180 - 2 * bb, h = Math.tan(bb * DEG), ca = 1 / cos(bb);
      return { bb, al, d: bb / 2, A: pt(0, -h), B: pt(-1, 0), C: pt(1, 0), D: pt(1 + ca, 0), ca };
    },
    draw(b, s, M, C) {
      const { bb, al, d, A, B, C: Cp, D, ca } = M;
      const tt = C.problem ? 1 : C.review ? (C.step >= 3 ? 1 : C.step >= 2 ? 1 : C.step >= 1 ? 0.6 : 0) : C.t;
      const Dt = pt(Cp.x + ca * seg01(tt, 0, 0.7), 0), done = tt >= 0.7;
      const m2 = C.problem ? 0 : C.review ? (C.step >= 2 ? 1 : 0) : seg01(C.t, 0.7, 1);
      fit(b, bboxOf([A, B, Cp, D]), { t: 44, b: 92, l: 40, r: 44 });
      fillPoly(b, [A, B, Cp], 'sky', 0.12);
      if (done || C.problem) fillPoly(b, [A, Cp, D], 'green', 0.14);
      poly(b, [A, B, Cp], 'ink', 3.4);
      line(b, Cp, Dt, 'ink', 3.4);
      if (done || C.problem) line(b, A, D, 'ink', 3.4);
      tick(b, A, B, 1, 'amber'); tick(b, A, Cp, 2, 'rose'); if (done || C.problem) tick(b, Cp, D, 2, 'rose');
      // 각
      ang(b, B, Cp, A, { color: 'sky', rings: 1, r: 30, label: C.problem ? dg(bb) : dg(bb), size: 16 });
      ang(b, Cp, A, B, { color: 'sky', rings: 1, r: 30, label: dg(bb), size: 16, labelDist: 52 });
      ang(b, A, B, Cp, { color: 'sky', r: 30, label: dg(al), size: 16, labelDist: 56 });
      if (done || C.problem) {
        if (m2 > 0.01 || C.problem) {
          ang(b, A, Cp, D, { color: 'amber', rings: 2, r: 34, label: C.problem ? '' : dg(d), size: 16, labelDist: 62, alpha: C.problem ? 1 : m2 });
          ang(b, D, A, Cp, { color: 'amber', rings: 2, r: 34, label: C.problem ? 'x' : dg(d), size: 17, alpha: C.problem ? 1 : m2, labelDist: 62 });
        }
      }
      if (!C.txt) return;
      [A, B, Cp].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      if (done || C.problem) b.point(D, { color: 'ink', r: 4.5 });
      const cen = pt((A.x + B.x + Cp.x) / 3, (A.y + B.y + Cp.y) / 3);
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); T(b, Cp, 'C', { dy: 20, size: 18 });
      if (done || C.problem) T(b, D, 'D', { dy: 20, size: 18 });
      const bx = (B.x + D.x) / 2;
      let row, col = 'amber';
      if (C.problem) row = 'AB=AC, CA=CD 일 때 ∠D = x 의 크기는?';
      else if (C.review && C.step === 1) { row = `AB=AC → ∠ACB = ∠B = ${bb}°`; col = 'sky'; }
      else if (C.review && C.step === 2) { row = `∠ACB(${bb}°) = ∠CAD + ∠D`; col = 'sky'; }
      else row = done ? `∠D = ½ × ∠B = ½ × ${bb}° = ${d}°` : '막대를 끌어 CD를 늘여 보세요';
      T(b, pt(bx, 0), row, { dy: 62, size: 17, color: col });
      if (!C.problem) T(b, pt(bx, 0), 'AB = AC · CA = CD', { dy: 88, size: 15, color: 'rose', alpha: 0.9 });
    },
    steps: (M) => [
      `AB=AC 이므로 ∠ACB=∠B=${M.bb}° (이등변삼각형의 두 밑각)`,
      `∠ACB는 △ACD의 외각이므로 ∠ACB = ∠CAD + ∠D 예요.`,
      `CA=CD 이므로 ∠CAD=∠D 예요. 그러므로 ${M.bb}° = 2×∠D, ∠D = ${M.bb}° ÷ 2 = ${M.d}°`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠B</b>를 바꾸거나 ▶를 눌러 <b>CD</b>를 가로로 늘여 보세요. CD=CA(눈금 2개)가 되면 ∠D는 늘 <b>∠B의 반</b>이에요.',
      readouts: [rd('∠B = ∠ACB', `${M.bb}°`, 'sky'), rd('꼭지각 ∠A', `${M.al}°`, 'sky', '180° − 2×∠B'), rd('∠D = ∠CAD', `${M.d}°`, 'amber', '∠B ÷ 2', null, true)],
      formula: `<p>$\\angle ACB=\\angle CAD+\\angle D=2\\angle D$</p><p>$\\angle D=\\dfrac{1}{2}\\times${M.bb}^{\\circ}=${M.d}^{\\circ}$</p>`,
      rule: '이등변삼각형 ACD의 외각 ∠ACB = 두 밑각의 합 = 2 × ∠D',
      notes: notes('외각은 <b>이웃하지 않는 두 내각의 합</b>이에요. ∠ACB = ∠CAD + ∠D.', '밑각이 되는 두 각이 어느 것인지(CA=CD이면 ∠CAD와 ∠D) 먼저 확인하세요.')
    }),
    prob: (M) => {
      const { bb, al, d } = M;
      return {
        tag: '이등변삼각형과 외각', key: `b${bb}`,
        stem: `그림과 같이 $\\overline{AB}=\\overline{AC}$인 이등변삼각형 ABC에서 변 BC의 연장선 위에 $\\overline{CA}=\\overline{CD}$인 점 D를 잡았다. ∠B=${bb}°일 때, ∠D의 크기 $x$는?`,
        choices: mkChoices(d, [[bb, '∠B와 같다고 했어요. ∠D는 외각 ∠ACB의 반이에요.'], [al, '꼭지각 ∠A를 구했어요.'], [90 - bb, '직각에서 뺐어요.'], [bb * 2, '두 배로 했어요. ∠B의 반이에요.'], [180 - 2 * bb - bb / 2, '다시 계산해 보세요.']], { pad: 4 })
      };
    },
    verify: (s) => { const M = iso.model(s); return { ans: angBetween(M.D, M.A, M.C), model: M.d, extra: [[angBetween(M.C, M.A, M.B), M.bb]] }; }
  };

  G.register(20, 't2', '② 삼각형의 내각과 외각', '삼각형의 내각과 외각', PARAMS, [ext, star, bis, chain, iso]);
})();
