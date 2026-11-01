/* ==========================================================================
   중1 · 다각형의 넓이(초등 복습) — 탭 ② 「넓이가 같은 도형 (밑변과 높이)」 (t2.js, order 20) — 장면 5개
   옛 다각형 실험실에서 되살린 장면입니다(triAlt · paraMove · railWing · baseRatio).
   · b1-rt    직각삼각형의 빗변에 내린 높이   · 넓이를 두 가지로 나타내기(½ab = ½ch)           (옛 triAlt)
   · b2-para  평행사변형의 두 가지 높이       · 밑변×높이 = 옆변×(옆변에 대한 높이)              (옛 paraMove)
   · b3-rail  평행선 사이의 삼각형            · 꼭짓점을 평행선 위에서 옮겨도 넓이는 그대로      (옛 railWing 앞부분)
   · b4-wing  사다리꼴의 대각선과 양옆 삼각형 · △ABO = △DCO                                    (옛 railWing 뒷부분)
   · b5-ratio 높이가 같은 두 삼각형           · 넓이의 비 = 밑변의 비                             (옛 baseRatio)
   움직임은 가로 이동·제자리 회전·서서히 나타남만 씁니다(옛 장면의 세로 이동은 없앴습니다).
   둔각삼각형의 바깥 높이(옛 triAlt 앞부분)는 탭 ①의 「높이가 밖에 있는 삼각형」이 맡습니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_AR;
  if (!G) return;
  const { clamp, ease, seg01, pt, add, sub, mul, mid, lerp, inter, fmtN, T, tagOut, fit, fillPoly, line, poly, tick, par, mkChoices, P, rd, notes, cm1, cm2, rotAbout, rpick, range, dim, hgtTo, area2, centroid, bboxOf, tx } = G;

  const FIT = (b, box, o = {}) => fit(b, box, { l: 46, r: 46, t: 40, b: 70, ...o });
  const pad8 = (v) => Math.max(1, Math.round(v / 8));
  const num = (v) => fmtN(v);
  const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10]];
  const foot = (b, p, str, color = 'green', dy = 56) => T(b, p, str, { dy, size: 17, color });
  const handle = (b, C, id, p, label, drag) => { if (!C.problem && !C.thumb && !C.review) b.handle(id, p, { color: 'amber', r: 8, ariaLabel: label, drag }); };
  const okOf = (Q) => Q.choices.find((c) => c.ok);

  /* ====================================================================== 1. 직각삼각형의 빗변에 내린 높이 (옛 triAlt) */
  const rt = {
    id: 'b1-rt', title: '직각삼각형에서 빗변에 내린 높이', short: '빗변의 높이',
    question: '직각삼각형의 넓이를 두 가지 방법으로 나타내면, 빗변에 내린 높이 h를 구할 수 있을까?',
    ctl: ['b1K', 'b1T'], anim: { key: 'b1T', dur: 6, label: '180° 돌려 직사각형 만들기', start: 0 },
    init: (s) => { s.b1K = 1; s.b1T = 0; },
    reroll: (s) => { s.b1K = rpick([1, 2, 3], Math.round(s.b1K)); s.b1T = 0; },
    model: (s) => { const k = clamp(Math.round(s.b1K), 1, 3), a = 3 * k, bb = 4 * k, c = 5 * k; return { k, a, bb, c, h: (a * bb) / c, S: (a * bb) / 2 }; },
    geo: (M) => ({ tri: [pt(0, 0), pt(M.c, 0), pt((M.a * M.a) / M.c, -M.h)] }),
    draw(b, s, M, C) {
      const { a, bb, c, h, S } = M, [Bv, Cv, Av] = rt.geo(M).tri, Hf = pt(Av.x, 0), Mh = pt(c / 2, 0);
      FIT(b, { x0: 0, x1: c, y0: -c / 2, y1: c / 2 }, { b: 96, t: 40 });
      const t = C.problem ? 0 : C.t, al = seg01(t, 0, 0.1), ang = Math.PI * seg01(t, 0.1, 1);
      fillPoly(b, [Bv, Cv, Av], 'sky', 0.24); poly(b, [Bv, Cv, Av], 'ink', 3.6);
      if (!C.problem && t > 0.001) {
        const cp = [Bv, Cv, Av].map((v) => rotAbout(v, Mh, ang));
        fillPoly(b, cp, 'green', 0.32 * al); poly(b, cp, 'green', 3.4, { alpha: al });
      }
      const hot1 = C.review && C.step === 1, hot2 = C.review && C.step >= 2;
      b.right(Av, Bv, Cv, { size: 16, color: 'sky' });
      hgtTo(b, Av, Bv, Cv, { label: C.problem ? 'h = ?' : `h = ${num(h)}`, side: Av.x > c / 2 ? -1 : 1 });
      dim(b, Bv, Av, `${a}`, { ref: Cv, color: 'sky', width: 3 });
      dim(b, Av, Cv, `${bb}`, { ref: Bv, color: 'sky' });
      dim(b, Bv, Cv, `${c}`, { ref: Av, color: 'green' });
      if (hot1) { line(b, Bv, Av, 'sky', 6, { alpha: 0.6 }); line(b, Av, Cv, 'sky', 6, { alpha: 0.6 }); }
      if (hot2) line(b, Bv, Cv, 'green', 6, { alpha: 0.6 });
      if (C.problem) { foot(b, Mh, '빗변에 내린 수선의 길이 h = ?', 'amber', 58); return; }
      if (C.review) foot(b, Mh, C.step === 1 ? `넓이 = ½×${a}×${bb} = ${S}` : C.step === 2 ? `넓이 = ½×${c}×h` : `${a}×${bb} = ${c}×h → h = ${num(h)}`, C.step >= 3 ? 'green' : 'amber', 58);
      else foot(b, Mh, t > 0.999 ? `직사각형 ${a}×${bb}=${a * bb}의 절반 = ${S}` : `넓이 = ½×${a}×${bb} = ${S}`, 'green', 58);
    },
    stepT: (n) => (n === 1 ? 1 : 0),
    steps: (M) => [
      `직각을 낀 두 변 ${M.a}, ${M.bb}를 밑변과 높이로 보면 넓이는 ½×${M.a}×${M.bb}=${M.S}예요. (같은 삼각형 2개는 직사각형이 돼요.)`,
      `빗변 BC=${M.c}를 밑변으로 보면 높이는 A에서 BC에 내린 수선 h예요. 넓이는 ½×${M.c}×h예요.`,
      `같은 삼각형의 넓이이므로 ½×${M.a}×${M.bb}=½×${M.c}×h에서 ${M.a * M.bb}=${M.c}×h이고, h=${num(M.h)}예요.`
    ],
    view: (M) => ({
      guide: '막대로 세 변(3, 4, 5의 몇 배)을 바꿔 보세요. ▶를 누르면 같은 삼각형이 <b>제자리에서 180° 돌아</b> 직사각형이 돼요. <b>노란 점선</b>이 빗변에 내린 높이 h예요.',
      readouts: [rd('직각을 낀 두 변', `${M.a}, ${M.bb}`, 'sky'), rd('빗변', `${M.c}`, 'green'), rd('넓이', `${M.S}`, 'ink', `½ × ${M.a} × ${M.bb}`), rd('빗변에 내린 높이 h', `${num(M.h)}`, 'amber', `${M.a * M.bb} ÷ ${M.c}`, null, true)],
      formula: `<p>$\\dfrac{1}{2}\\times${M.a}\\times${M.bb}=\\dfrac{1}{2}\\times${M.c}\\times h$</p><p>$${M.a * M.bb}=${M.c}h\\ \\Rightarrow\\ h=${tx(M.h)}$</p>`,
      rule: '직각삼각형: (직각을 낀 두 변의 곱) = (빗변) × (빗변에 내린 높이)',
      notes: notes('빗변을 밑변으로 볼 때 높이는 <b>직각 꼭짓점에서 빗변에 내린 수선</b>이에요. 직각을 낀 변은 그 높이가 아니에요.', '같은 삼각형의 넓이를 두 가지로 나타낸 식이에요. 2로 나누는 것은 양쪽에 모두 있어서 없어져요.')
    }),
    prob: (M) => {
      const { a, bb, c, h, S } = M;
      return {
        tag: '함정 · 직각삼각형의 빗변에 내린 높이', key: `k${M.k}`,
        stem: `∠A = 90°인 직각삼각형 ABC에서 AB = ${a} cm, AC = ${bb} cm, BC = ${c} cm이다. 꼭짓점 A에서 빗변 BC에 내린 수선 AH의 길이는?`,
        choices: mkChoices(h, [[S, '그것은 삼각형의 넓이예요. 넓이 ½×밑변×높이에서 높이를 구해요.'], [c / 2, '빗변의 절반이에요. 높이가 아니에요.'], [a * bb, '2로 나누는 식이 양쪽에 있어요. 넓이의 2배는 높이가 아니에요.'], [(a + bb) / 2, '두 변을 더해 평균을 냈어요. 넓이로 식을 세워야 해요.']], { ...cm1, pad: 1 })
      };
    },
    verify: (s) => { const M = rt.model(s), g = rt.geo(M).tri; return { geo: Math.abs(g[2].y), formula: M.h }; }
  };

  /* ====================================================================== 2. 평행사변형의 두 가지 높이 (옛 paraMove) */
  const para2 = {
    id: 'b2-para', title: '평행사변형의 두 가지 높이', short: '두 가지 높이',
    question: '평행사변형은 어느 변을 밑변으로 잡아도 넓이가 같을까? 밑변이 달라지면 높이는 어떻게 될까?',
    ctl: ['b2A'],
    presets: () => [
      ...[['밑변 BC', 0], ['밑변 CD', 1], ['둘 다', 2]].map(([l, i], k) => ({ group: k === 0 ? '밑변 고르기' : '', label: l, apply: (s) => { s.b2Mode = i; }, on: (s) => s.b2Mode === i })),
      ...TRIPLES.map((t, i) => ({ group: i === 0 ? '모양' : '', label: `옆변 ${t[2]}cm · 높이 ${t[1]}cm`, apply: (s) => { s.b2K = i; }, on: (s) => s.b2K === i }))
    ],
    init: (s) => { s.b2A = 10; s.b2K = 0; s.b2Mode = 2; },
    reroll: (s) => { s.b2K = rpick([0, 1, 2], s.b2K); const t = TRIPLES[s.b2K]; s.b2A = rpick(range(Math.max(6, t[0]), 12), s.b2A); s.b2Mode = 2; },
    model: (s) => { const K = clamp(Math.round(s.b2K), 0, 2), [S, h1, c] = TRIPLES[K], a = clamp(Math.round(s.b2A), 6, 12); return { K, S, h1, c, a, A: a * h1, h2: (a * h1) / c }; },
    geo: (M) => { const B = pt(0, 0), Cc = pt(M.a, 0), D = pt(M.a + M.S, -M.h1), A = pt(M.S, -M.h1); return { pg: [B, Cc, D, A] }; },
    draw(b, s, M, C) {
      const { a, S, h1, c, h2, A: ar } = M, [Bp, Cp, Dp, Ap] = para2.geo(M).pg;
      const mode = C.review ? (C.step === 1 ? 0 : C.step === 2 ? 1 : 2) : C.problem ? 2 : s.b2Mode;
      const u = mul(sub(Dp, Cp), 1 / c), tt = (sub(Ap, Cp).x * u.x + sub(Ap, Cp).y * u.y), Fp = add(Cp, mul(u, tt));
      const bb = bboxOf([Bp, Cp, Dp, Ap, Fp, pt(S, 0)]);
      FIT(b, bb, { b: 92, r: 54 });
      const c0 = centroid([Bp, Cp, Dp, Ap]);
      fillPoly(b, [Bp, Cp, Dp, Ap], 'sky', 0.14); poly(b, [Bp, Cp, Dp, Ap], 'ink', 3.6);
      par(b, Ap, Dp, 1, 'green'); par(b, Bp, Cp, 1, 'green'); par(b, Bp, Ap, 2, 'green'); par(b, Cp, Dp, 2, 'green');
      const show1 = mode === 0 || mode === 2, show2 = mode === 1 || mode === 2;
      if (show1) line(b, Bp, Cp, 'sky', 6, { alpha: 0.65 });
      if (show2) line(b, Cp, Dp, 'green', 6, { alpha: 0.65 });
      if (show1) hgtTo(b, Ap, Bp, Cp, { color: 'amber', label: `h₁ = ${h1}`, side: 1 });
      if (show2) hgtTo(b, Ap, Cp, Dp, { color: 'rose', label: C.problem ? 'h₂ = ?' : `h₂ = ${num(h2)}`, side: 1, gap: 14, dy: -10, at: 0.62 });
      dim(b, Bp, Cp, `BC = ${a}`, { ref: c0, color: 'sky' });
      dim(b, Cp, Dp, `CD = ${c}`, { ref: c0, color: 'green', off: 26 });
      [[Ap, 'A'], [Bp, 'B'], [Cp, 'C'], [Dp, 'D']].forEach(([p, n]) => tagOut(b, p, c0, n, { size: 17, gap: 10 }));
      const fx = (a + S) / 2;
      if (C.problem) { foot(b, pt(fx, 0), '평행사변형의 넓이를 두 가지로 나타내 보세요', 'amber', 58); return; }
      if (mode === 0) foot(b, pt(fx, 0), `넓이 = ${a} × ${h1} = ${ar}`, 'sky', 58);
      else if (mode === 1) foot(b, pt(fx, 0), `넓이 = ${c} × ${num(h2)} = ${ar}`, 'green', 58);
      else foot(b, pt(fx, 0), `${a}×${h1} = ${c}×${num(h2)} = ${ar}`, 'amber', 58);
    },
    steps: (M) => [
      `BC=${M.a}를 밑변으로 하면 높이 h₁=${M.h1}이에요. 넓이는 ${M.a}×${M.h1}=${M.A}예요.`,
      `CD=${M.c}를 밑변으로 하면 높이는 A에서 CD에 내린 수선 h₂예요. 넓이는 ${M.c}×h₂예요.`,
      `같은 평행사변형이므로 ${M.a}×${M.h1}=${M.c}×h₂에서 h₂=${num(M.h2)}예요.`
    ],
    view: (M) => ({
      guide: '위의 칩으로 <b>밑변 BC</b>와 <b>밑변 CD</b>를 골라 보세요. 밑변이 달라지면 <b>높이(점선)</b>도 달라지지만 넓이는 같아요.',
      readouts: [rd('밑변 BC · 높이 h₁', `${M.a} · ${M.h1}`, 'sky', `넓이 ${M.A}`), rd('밑변 CD · 높이 h₂', `${M.c} · ${num(M.h2)}`, 'green', `넓이 ${M.A}`), rd('넓이', `${M.A}`, 'amber', `${M.a}×${M.h1} = ${M.c}×h₂`, null, true)],
      formula: `<p>$${M.a}\\times${M.h1}=${M.c}\\times h_2$</p><p>$h_2=\\dfrac{${M.A}}{${M.c}}=${tx(M.h2)}$</p>`,
      rule: '평행사변형은 어느 변을 밑변으로 해도 (밑변)×(높이)가 같다',
      notes: notes('높이는 <b>고른 밑변에 수직</b>이에요. 밑변이 바뀌면 높이도 바뀌어요.', '밑변이 긴 쪽의 높이가 더 짧아요. 곱은 같아요.')
    }),
    prob: (M) => {
      const { a, h1, c, h2, A } = M;
      return {
        tag: '평행사변형에서 다른 밑변에 대한 높이', key: `${M.K}-${a}`,
        stem: `평행사변형 ABCD에서 BC = ${a} cm, CD = ${c} cm이고, 꼭짓점 A에서 BC에 내린 수선의 길이가 ${h1} cm이다. 꼭짓점 A에서 CD에 내린 수선의 길이는?`,
        choices: mkChoices(h2, [[A, '그것은 평행사변형의 넓이예요. 넓이=CD×(구하는 높이)로 높이를 구해요.'], [h1, '밑변이 CD로 바뀌었으니 높이도 달라져요.'], [(c * h1) / a, '식을 거꾸로 세웠어요. a×h₁ = c×h₂예요.'], [a + h1 - c, '더하고 빼서는 구할 수 없어요. 넓이가 같다는 식을 세워요.']], { ...cm1, pad: 1 })
      };
    },
    verify: (s) => { const M = para2.model(s), [Bp, Cp, Dp, Ap] = para2.geo(M).pg; const d = sub(Dp, Cp), L = Math.hypot(d.x, d.y); const dist = Math.abs((Ap.x - Cp.x) * d.y - (Ap.y - Cp.y) * d.x) / L; return { geo: dist, formula: M.h2 }; }
  };

  /* ====================================================================== 3. 평행선 사이의 삼각형 (옛 railWing 앞부분) */
  const xOf = (B, t) => -4 + (B + 8) * t;
  const rail = {
    id: 'b3-rail', title: '평행선 사이의 삼각형', short: '평행선 사이',
    question: '밑변 BC가 같고 꼭짓점 A가 평행선 위에 있을 때, A를 옮기면 넓이는 어떻게 될까? 둘레는?',
    ctl: ['b3B', 'b3H', 'b3T'], anim: { key: 'b3T', dur: 8, label: '꼭짓점 A를 가로로 옮기기', start: 0.35 },
    init: (s) => { s.b3B = 8; s.b3H = 5; s.b3T = 0.35; s.b3U = 0.8; },
    reroll: (s) => { s.b3B = rpick([4, 6, 8, 10, 12], s.b3B); s.b3H = rpick([2, 3, 4, 5, 6, 7, 8].filter((h) => (h * s.b3B) % 2 === 0 && h !== s.b3H), s.b3H) || 4; s.b3T = rpick([0.1, 0.25, 0.4, 0.55], s.b3T); s.b3U = rpick([0.7, 0.85, 0.95], s.b3U); },
    model: (s) => { const B = clamp(Math.round(s.b3B), 4, 12), H = clamp(Math.round(s.b3H), 2, 8), x = xOf(B, clamp(s.b3T, 0, 1)), x2 = xOf(B, clamp(s.b3U, 0, 1)); return { B, H, x, x2, A: (B * H) / 2, per: B + Math.hypot(x, H) + Math.hypot(B - x, H) }; },
    geo: (M) => ({ tri: [pt(M.x, -M.H), pt(0, 0), pt(M.B, 0)], tri2: [pt(M.x2, -M.H), pt(0, 0), pt(M.B, 0)] }),
    draw(b, s, M, C) {
      const { B, H, x, A, per } = M, g = rail.geo(M);
      FIT(b, { x0: -5, x1: B + 5, y0: -H, y1: 0 }, { b: 110 });
      const xa = -5.6, xb = B + 5.6;
      line(b, pt(xa, -H), pt(xb, -H), 'green', 2.4); line(b, pt(xa, 0), pt(xb, 0), 'green', 2.4);
      par(b, pt(xa, -H), pt(xb, -H), 2, 'green', 0.07); par(b, pt(xa, 0), pt(xb, 0), 2, 'green', 0.07);
      T(b, pt(xb, -H), 'l', { dx: -2, dy: -16, size: 17, color: 'green' }); T(b, pt(xb, 0), 'm', { dx: -2, dy: -16, size: 17, color: 'green' });
      const [Av, Bv, Cv] = g.tri;
      if (C.problem) {
        const [A2] = g.tri2;
        fillPoly(b, g.tri2, 'rose', 0.1); poly(b, g.tri2, 'rose', 3, { dash: [7, 6] });
        b.point(A2, { color: 'rose', r: 5 }); T(b, A2, 'A′', { dy: -18, size: 17, color: 'rose' });
      }
      fillPoly(b, g.tri, 'sky', 0.24); poly(b, g.tri, 'ink', 3.6);
      T(b, Av, 'A', { dy: -18, size: 17 }); T(b, Bv, 'B', { dx: -14, dy: 14, size: 17 }); T(b, Cv, 'C', { dx: 14, dy: 14, size: 17 });
      dim(b, Bv, Cv, `BC = ${B}`, { ref: pt(B / 2, -H), color: 'sky' });
      if (C.problem) { foot(b, pt(B / 2, 0), `△ABC = ${A} cm² → △A′BC = ?`, 'amber', 58); return; }
      hgtTo(b, Av, Bv, Cv, { label: `높이 ${H}`, side: x < B / 2 ? 1 : -1 });
      const showP = !C.review || C.step >= 3;
      foot(b, pt(B / 2, 0), `넓이 = ½×${B}×${H} = ${num(A)} (그대로)`, 'green', 58);
      if (showP) foot(b, pt(B / 2, 0), `둘레 ≈ ${fmtN(per)} (변해요)`, 'rose', 84);
      handle(b, C, 'a', Av, '꼭짓점 A를 가로로 끌기', (w) => { s.b3T = clamp((w.x + 4) / (B + 8), 0, 1); });
    },
    steps: (M) => [
      `두 직선 l, m은 평행하므로 점 A가 l 위 어디에 있어도 A에서 BC까지의 거리(높이)는 ${M.H}로 같아요.`,
      `밑변 BC=${M.B}도 그대로예요.`,
      `그러므로 넓이 ½×${M.B}×${M.H}=${num(M.A)}는 변하지 않아요. (둘레는 변해요. 넓이가 같다고 둘레가 같은 것은 아니에요.)`
    ],
    view: (M) => ({
      guide: '<b>노란 점 A</b>를 평행선 위에서 가로로 끌거나 ▶를 눌러 보세요. 밑변과 높이가 그대로이면 <b>넓이는 그대로</b>예요. 그런데 둘레는 어떻게 될까요?',
      readouts: [rd('밑변 BC', `${M.B}`, 'sky'), rd('두 평행선 사이의 거리', `${M.H}`, 'amber'), rd('넓이', `${num(M.A)}`, 'green', `½ × ${M.B} × ${M.H}`), rd('둘레(어림)', `≈ ${fmtN(M.per)}`, 'rose', 'A가 한가운데일 때 가장 짧아요')],
      formula: `<p>(삼각형의 넓이) $=\\dfrac{1}{2}\\times${M.B}\\times${M.H}=${tx(M.A)}$ — A를 옮겨도 같아요</p>`,
      rule: '밑변이 같고 꼭짓점이 평행선 위에 있으면 넓이가 같다',
      notes: notes('높이는 두 평행선 사이의 거리라서 A가 어디에 있어도 같아요.', '넓이가 같아도 둘레는 달라질 수 있어요.')
    }),
    prob: (M) => {
      const { B, A } = M;
      return {
        tag: '함정 · 꼭짓점을 옮겨도 넓이가 같은 삼각형', key: `${B}-${A}-${fmtN(M.x)}-${fmtN(M.x2)}`,
        stem: `직선 l과 m은 평행하고, m 위의 선분 BC의 길이는 ${B} cm이다. l 위의 두 점 A, A′에 대하여 삼각형 ABC의 넓이가 ${A} cm²일 때, 삼각형 A′BC의 넓이는?`,
        choices: mkChoices(A, [[A * 2, '넓이가 두 배가 되지 않아요. 밑변과 높이가 그대로예요.'], [A / 2, '넓이가 반이 되지 않아요. 평행선 사이의 거리는 일정해요.'], [A + B, '점의 위치가 달라도 밑변과 높이가 같으면 넓이가 같아요.'], [B, '밑변의 길이는 넓이가 아니에요.']], { ...cm2, pad: pad8(A) })
      };
    },
    verify: (s) => { const M = rail.model(s), g = rail.geo(M); return { geo: area2(g.tri2), formula: M.A }; }
  };

  /* ====================================================================== 4. 사다리꼴의 대각선과 양옆 삼각형 (옛 railWing 뒷부분) */
  const wing = {
    id: 'b4-wing', title: '사다리꼴의 대각선과 양옆 삼각형', short: '양옆 삼각형',
    question: '사다리꼴에서 두 대각선이 만나는 점 O의 양옆 삼각형 ABO와 DCO의 넓이는 어떤 관계일까?',
    ctl: ['b4B', 'b4D', 'b4H', 'b4T'], anim: { key: 'b4T', dur: 6, label: '넓이 비교하기', start: 0 },
    init: (s) => { s.b4B = 10; s.b4D = 5; s.b4H = 6; s.b4P = 2; s.b4T = 0; },
    reroll: (s) => {
      const cand = [];
      for (const B of range(6, 12)) for (const d of range(2, 8)) for (const H of range(3, 8)) { const X = (B * H) / 2, Y = (B * B * H) / (2 * (B + d)); if (Number.isInteger(X) && Number.isInteger(Y) && B !== d) cand.push([B, d, H]); }
      const q = rpick(cand, cand.find((c) => c[0] === s.b4B && c[1] === s.b4D && c[2] === s.b4H)); s.b4B = q[0]; s.b4D = q[1]; s.b4H = q[2]; s.b4P = rpick([0, 1, 2, 3], s.b4P); s.b4T = 0;
    },
    model: (s) => { const B = clamp(Math.round(s.b4B), 6, 12), d = clamp(Math.round(s.b4D), 2, 8), H = clamp(Math.round(s.b4H), 3, 8), p = clamp(Math.round(s.b4P), 0, 4); const X = (B * H) / 2, Y = (B * B * H) / (2 * (B + d)); return { B, d, H, p, X, Y, w: X - Y }; },
    geo: (M) => { const Bv = pt(0, 0), Cv = pt(M.B, 0), Av = pt(M.p, -M.H), Dv = pt(M.p + M.d, -M.H), O = inter(Av, Cv, Bv, Dv); return { Av, Bv, Cv, Dv, O }; },
    draw(b, s, M, C) {
      const { B, d, H, p, X, Y, w } = M, { Av, Bv, Cv, Dv, O } = wing.geo(M);
      FIT(b, { x0: 0, x1: Math.max(B, 4 + 8), y0: -H, y1: 0 }, { b: 138, l: 52, r: 52 });
      const t = C.problem ? 0 : C.review ? (C.step === 1 ? 0.4 : C.step === 2 ? 0.8 : 1) : C.t;
      const c0 = centroid([Av, Bv, Cv, Dv]);
      if (C.problem) { fillPoly(b, [Bv, Cv, O], 'green', 0.3); fillPoly(b, [Av, Bv, O], 'amber', 0.3); }
      else {
        if (t > 0) { const f = seg01(t, 0, 0.3); fillPoly(b, [Av, Bv, Cv], 'sky', 0.2 * f); fillPoly(b, [Dv, Bv, Cv], 'rose', 0.16 * f); }
        if (t > 0.5) { const f = seg01(t, 0.5, 0.75); fillPoly(b, [Bv, Cv, O], 'green', 0.4 * f); }
        if (t > 0.8) { const f = seg01(t, 0.8, 1); fillPoly(b, [Av, Bv, O], 'amber', 0.4 * f); fillPoly(b, [Dv, Cv, O], 'amber', 0.4 * f); }
      }
      poly(b, [Av, Bv, Cv, Dv], 'ink', 3.6);
      line(b, Av, Cv, 'ink', 2.6, { dash: [7, 5] }); line(b, Bv, Dv, 'ink', 2.6, { dash: [7, 5] });
      par(b, Av, Dv, 2, 'green'); par(b, Bv, Cv, 2, 'green');
      b.point(O, { color: 'ink', r: 4.5 });
      [[Av, 'A'], [Bv, 'B'], [Cv, 'C'], [Dv, 'D']].forEach(([q, n]) => tagOut(b, q, c0, n, { size: 17, gap: 10 }));
      T(b, O, 'O', { dy: -4, dx: 15, size: 16 });
      const cen = (P3) => centroid(P3);
      if (C.problem) {
        T(b, cen([Av, Bv, O]), 'S₁=?', { size: 16, color: 'amber' });
        foot(b, pt(B / 2, 0), `△ABC = ${X} cm²`, 'sky', 36); foot(b, pt(B / 2, 0), `△OBC = ${Y} cm²`, 'green', 62);
        return;
      }
      if (t > 0.8) { T(b, cen([Av, Bv, O]), 'S₁', { size: 16, color: 'amber' }); T(b, cen([Dv, Cv, O]), 'S₂', { size: 16, color: 'amber' }); }
      dim(b, Bv, Cv, `${B}`, { ref: c0, color: 'sky' });
      let r = 0;
      if (t > 0.25) foot(b, pt(B / 2, 0), `△ABC = △DBC = ${num(X)}`, 'sky', 58 + 26 * r++);
      if (t > 0.55) foot(b, pt(B / 2, 0), `공통 △OBC = ${num(Y)}`, 'green', 58 + 26 * r++);
      if (t > 0.9) foot(b, pt(B / 2, 0), `S₁ = S₂ = ${num(X)} − ${num(Y)} = ${num(w)}`, 'amber', 58 + 26 * r++);
      handle(b, C, 'a', Av, '윗변을 가로로 끌기', (q) => { s.b4P = clamp(Math.round(q.x), 0, 4); });
    },
    stepT: (n) => (n <= 1 ? 0.4 : n === 2 ? 0.8 : 1),
    steps: (M) => [
      `△ABC와 △DBC는 밑변 BC가 같고, 높이(두 평행선 사이의 거리)도 같으므로 넓이가 같아요. 둘 다 ${num(M.X)}예요.`,
      `두 삼각형에 공통인 △OBC(${num(M.Y)})가 있어요. 양쪽에서 이 부분을 빼면 남는 것이 양옆 삼각형이에요.`,
      `△ABO = △ABC − △OBC = ${num(M.X)} − ${num(M.Y)} = ${num(M.w)}, △DCO = △DBC − △OBC = ${num(M.w)}. 따라서 △ABO = △DCO예요.`
    ],
    view: (M) => ({
      guide: '▶를 눌러 <b>△ABC</b>(하늘)와 <b>△DBC</b>(분홍)를 비교하고, 공통 부분(초록)을 빼면 <b>노란 양옆 삼각형</b>이 남아요. 길이는 막대로 바꿔요.',
      readouts: [rd('△ABC = △DBC', num(M.X), 'sky', `½ × ${M.B} × ${M.H}`), rd('공통 △OBC', num(M.Y), 'green'), rd('△ABO = △DCO', num(M.w), 'amber', `${num(M.X)} − ${num(M.Y)}`, null, true)],
      formula: `<p>$\\triangle ABO=\\triangle ABC-\\triangle OBC=${tx(M.X)}-${tx(M.Y)}=${tx(M.w)}$</p><p>$\\triangle DCO=\\triangle DBC-\\triangle OBC=${tx(M.w)}$</p>`,
      rule: 'AD ∥ BC인 사다리꼴에서 대각선의 교점 O를 잡으면 △ABO = △DCO',
      notes: notes('밑변이 BC로 같고 평행선 사이에 있으니 △ABC=△DBC예요.', '공통 부분 △OBC를 빼는 것이 핵심이에요. 대각선으로 나뉜 위·아래 삼각형(△AOD, △OBC)은 같지 않아요.')
    }),
    prob: (M) => {
      const { X, Y, w } = M;
      return {
        tag: '사다리꼴에서 대각선이 만든 삼각형의 넓이', key: `${M.B}-${M.d}-${M.H}`,
        stem: `AD ∥ BC인 사다리꼴 ABCD에서 두 대각선의 교점을 O라 하자. 삼각형 ABC의 넓이가 ${X} cm², 삼각형 OBC의 넓이가 ${Y} cm²일 때, 삼각형 ABO의 넓이는?`,
        choices: mkChoices(w, [[X, '△ABC 전체의 넓이예요. 공통 부분 △OBC를 빼야 해요.'], [Y, '공통 부분 △OBC의 넓이예요.'], [X + Y, '공통 부분을 더하지 않고 빼요.'], [2 * w, '△ABO와 △DCO의 합이에요.']], { ...cm2, pad: pad8(w) })
      };
    },
    verify: (s) => { const M = wing.model(s), g = wing.geo(M); return { geo: area2([g.Av, g.Bv, g.O]), formula: M.w }; }
  };

  /* ====================================================================== 5. 높이가 같은 두 삼각형 (옛 baseRatio) */
  const ratio = {
    id: 'b5-ratio', title: '밑변의 비 = 넓이의 비', short: '밑변의 비',
    question: '높이가 같은 두 삼각형의 밑변의 길이의 비가 m : n이면, 넓이의 비는 어떻게 될까?',
    ctl: ['b5M', 'b5N', 'b5H', 'b5T'], anim: { key: 'b5T', dur: 4, label: '두 삼각형 떼어 놓기', start: 0 },
    init: (s) => { s.b5M = 3; s.b5N = 2; s.b5H = 8; s.b5T = 0; s.b5Q = 0; },
    reroll: (s) => { const pairs = []; for (const m of range(1, 6)) for (const n of range(1, 6)) if (m !== n) pairs.push([m, n]); const q = rpick(pairs, pairs.find((x) => x[0] === s.b5M && x[1] === s.b5N)); s.b5M = q[0]; s.b5N = q[1]; s.b5H = rpick([4, 6, 8], s.b5H); s.b5Q = rpick([0, 1], s.b5Q); s.b5T = 0; },
    model: (s) => { const m = clamp(Math.round(s.b5M), 1, 6), n = clamp(Math.round(s.b5N), 1, 6), h = clamp(Math.round(s.b5H / 2) * 2, 2, 8), q = s.b5Q ? 1 : 0; return { m, n, h, q, S1: (m * h) / 2, S2: (n * h) / 2, S: ((m + n) * h) / 2 }; },
    geo: (M, gap = 0) => { const xA = (M.m + M.n) * 0.4, Bv = pt(0, 0), D = pt(M.m, 0), Cv = pt(M.m + M.n, 0), Av = pt(xA, -M.h); return { Bv, D, Cv, Av, left: [Av, Bv, D], right: [Av, D, Cv].map((p) => pt(p.x + gap, p.y)) }; },
    draw(b, s, M, C) {
      const { m, n, h, S1, S2, S } = M, t = C.problem ? 0 : C.review ? (C.step === 1 ? 0.7 : 0.7) : C.t, gap = 1.6 * ease(t), g = ratio.geo(M, gap), { Bv, D, Cv, Av } = g;
      FIT(b, { x0: 0, x1: m + n + 1.6, y0: -h, y1: 0 }, { b: 130 });
      fillPoly(b, g.left, 'sky', 0.24); poly(b, g.left, 'ink', 3.6);
      fillPoly(b, g.right, 'rose', 0.24); poly(b, g.right, 'ink', 3.6);
      [[Av, 'A'], [Bv, 'B'], [pt(D.x, 0), 'D'], [pt(Cv.x + gap, 0), 'C']].forEach(([q, nm], i) => T(b, q, nm, { dy: i === 0 ? -18 : 18, dx: i === 1 ? -12 : i === 3 ? 12 : 0, size: 17 }));
      if (!C.problem && (!C.review || C.step >= 1)) {
        hgtTo(b, Av, Bv, D, { label: `h = ${h}`, side: -1, gap: 8 });
        if (gap > 0.05) hgtTo(b, g.right[0], g.right[1], g.right[2], { label: `h = ${h}`, side: 1, gap: 8 });
      }
      const cc = centroid(g.left.concat(g.right));
      dim(b, Bv, D, `${m}`, { ref: cc, color: 'sky' });
      dim(b, pt(D.x + gap, 0), pt(Cv.x + gap, 0), `${n}`, { ref: cc, color: 'rose' });
      if (C.problem) {
        T(b, M.q ? pt((Av.x + D.x + Cv.x) / 3, -h / 3) : pt((Av.x + Bv.x + D.x) / 3, -h / 3), '?', { size: 20, color: 'amber' });
        foot(b, pt((m + n) / 2, 0), `△ABC = ${S} cm²   BD : DC = ${m} : ${n}`, 'amber', 58); return;
      }
      T(b, pt((Av.x + Bv.x + D.x) / 3, -h / 3), 'S₁', { size: 16, color: 'sky' }); T(b, pt((Av.x + D.x + Cv.x) / 3 + gap, -h / 3), 'S₂', { size: 16, color: 'rose' });
      const x0 = (m + n) / 2;
      if (!C.review || C.step >= 2) { foot(b, pt(x0, 0), `S₁ = ½×${m}×${h} = ${S1}`, 'sky', 58); foot(b, pt(x0, 0), `S₂ = ½×${n}×${h} = ${S2}`, 'rose', 84); }
      if (!C.review || C.step >= 3) foot(b, pt(x0, 0), `S₁ : S₂ = ${m} : ${n}`, 'amber', 110);
    },
    steps: (M) => [
      `△ABD와 △ADC는 꼭짓점 A에서 직선 BC까지의 높이 h=${M.h}가 같아요.`,
      `넓이는 S₁=½×${M.m}×${M.h}=${M.S1}, S₂=½×${M.n}×${M.h}=${M.S2}예요.`,
      `S₁ : S₂ = ${M.S1} : ${M.S2} = ${M.m} : ${M.n}이에요. 높이가 같으면 넓이의 비는 밑변의 길이의 비와 같아요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>BD</b>와 <b>DC</b>의 길이를 바꿔 보세요. ▶를 누르면 두 삼각형이 가로로 떼어져요. 두 삼각형의 <b>높이(점선)</b>는 같아요.',
      readouts: [rd('BD : DC', `${M.m} : ${M.n}`, 'amber'), rd('S₁ (△ABD)', num(M.S1), 'sky', `½ × ${M.m} × ${M.h}`), rd('S₂ (△ADC)', num(M.S2), 'rose', `½ × ${M.n} × ${M.h}`), rd('S₁ : S₂', `${M.S1 / G.gcd(M.S1, M.S2)} : ${M.S2 / G.gcd(M.S1, M.S2)}`, 'green', '밑변의 비와 같아요')],
      formula: `<p>$S_1:S_2=\\dfrac{1}{2}\\times${M.m}\\times${M.h}:\\dfrac{1}{2}\\times${M.n}\\times${M.h}=${M.m}:${M.n}$</p>`,
      rule: '높이가 같은 두 삼각형의 넓이의 비 = 밑변의 길이의 비',
      notes: notes('높이가 같을 때만 성립해요. 꼭짓점 A를 공유하면 두 삼각형의 높이가 같아요.', '밑변의 중점 D를 이으면 m = n이라 넓이가 정확히 반으로 나뉘어요.')
    }),
    prob: (M) => {
      const { m, n, S, q } = M, x = q ? n : m, y = q ? m : n, ans = (S * x) / (x + y), nm = q ? 'ADC' : 'ABD';
      return {
        tag: '함정 · 밑변의 비로 나누는 삼각형의 넓이', key: `${m}-${n}-${S}-${q}`,
        stem: `삼각형 ABC의 변 BC 위의 점 D에 대하여 BD : DC = ${m} : ${n}이다. 삼각형 ABC의 넓이가 ${S} cm²일 때, 삼각형 ${nm}의 넓이는?`,
        choices: mkChoices(ans, [[(S * y) / (x + y), '비의 순서를 바꿨어요. 구하는 삼각형의 밑변이 어느 쪽인지 확인해요.'], [S / 2, '반으로 나뉘는 것은 D가 BC의 중점일 때만이에요.'], [(S * x) / y, '전체가 아니라 두 부분의 합에 대한 비로 나눠야 해요.'], [S - x, '비례배분을 해야 해요. 빼서는 구할 수 없어요.']], { ...cm2, pad: pad8(ans) })
      };
    },
    verify: (s) => { const M = ratio.model(s), g = ratio.geo(M), tri = M.q ? g.right : g.left; return { geo: area2(tri), formula: M.q ? M.S2 : M.S1 }; }
  };

  const mm = (v) => `${v}cm`;
  const PARAMS = {
    b1K: P('세 변의 크기', 1, 3, 1, 1, { color: 'sky', hint: '세 변이 (3, 4, 5)의 1배·2배·3배', format: (v) => `${3 * v}, ${4 * v}, ${5 * v}` }),
    b1T: P('돌리기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 복사본이 180° 돌아요', format: (v) => Math.round(v * 100) + '%' }),
    b2A: P('밑변 BC', 6, 12, 1, 10, { color: 'sky', format: mm }),
    b3B: P('밑변 BC', 4, 12, 1, 8, { color: 'sky', format: mm }),
    b3H: P('평행선 사이의 거리', 2, 8, 1, 5, { color: 'amber', format: mm }),
    b3T: P('꼭짓점 A의 위치', 0, 1, 0.01, 0.35, { color: 'green', hint: '▶를 누르거나 막대를 끌면 A가 평행선 위를 가로로 움직여요', format: (v) => Math.round(v * 100) + '%' }),
    b4B: P('아랫변 BC', 6, 12, 1, 10, { color: 'sky', format: mm }),
    b4D: P('윗변 AD', 2, 8, 1, 5, { color: 'sky', format: mm }),
    b4H: P('높이', 3, 8, 1, 6, { color: 'amber', format: mm }),
    b4T: P('넓이 비교', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 같은 넓이끼리 색이 칠해져요', format: (v) => Math.round(v * 100) + '%' }),
    b5M: P('BD의 길이', 1, 6, 1, 3, { color: 'sky', format: mm }),
    b5N: P('DC의 길이', 1, 6, 1, 2, { color: 'rose', format: mm }),
    b5H: P('높이', 2, 8, 2, 8, { color: 'amber', format: mm }),
    b5T: P('떼어 놓기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 오른쪽 삼각형이 가로로 밀려 가요', format: (v) => Math.round(v * 100) + '%' })
  };

  G.register(20, 't2', '② 넓이가 같은 도형 (밑변과 높이)', '넓이가 같은 도형', PARAMS, [rt, para2, rail, wing, ratio]);
})();
