/* ==========================================================================
   중1 · 다각형의 넓이(초등 복습) — 탭 ③ 「잘라 붙이기 · 길 · 땅」 (t3.js, order 30) — 장면 3개
   옛 다각형 실험실에서 되살린 장면입니다(trapRot · boxFrame · roadMerge).
   · c1-trap  사다리꼴을 평행사변형으로, 또는 삼각형 둘로      (옛 trapRot)   · 제자리 회전 / 가로로 떼어 놓기
   · c2-frame 바깥 직사각형에서 귀퉁이 세 개 빼기(모눈 위 삼각형) (옛 boxFrame)  · 귀퉁이를 가로로 떼어 놓기
   · c3-road  길이 있는 땅 — 조각을 밀어 붙여 한 개의 직사각형으로 (옛 roadMerge) · 가로 이동 + 제자리 90° 회전
   옛 장면의 세로·대각선 이동은 가로 이동과 제자리 회전으로 바꿨습니다.
   (옛 boxFrame의 마름모 부분은 탭 ①의 「마름모의 넓이」가 맡습니다.)
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_AR;
  if (!G) return;
  const { clamp, ease, seg01, pt, add, sub, mul, mid, lerp, fmtN, T, tagOut, fit, fillPoly, line, poly, par, mkChoices, P, rd, notes, cm2, rotAbout, rpick, range, dim, hgtTo, area2, centroid, tx } = G;

  const FIT = (b, box, o = {}) => fit(b, box, { l: 46, r: 46, t: 40, b: 70, ...o });
  const pad8 = (v) => Math.max(1, Math.round(v / 8));
  const num = (v) => fmtN(v);
  const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10]];
  const foot = (b, p, str, color = 'green', dy = 56) => T(b, p, str, { dy, size: 17, color });
  const mm = (v) => `${v}cm`;

  /* ====================================================================== 1. 사다리꼴: 돌려 붙이기 · 둘로 나누기 (옛 trapRot) */
  const trap2 = {
    id: 'c1-trap', title: '사다리꼴: 돌려 붙이기와 둘로 나누기', short: '사다리꼴 두 방법',
    question: '사다리꼴의 넓이를 구하는 방법은 한 가지뿐일까? 돌려 붙이는 방법과 삼각형 둘로 나누는 방법을 비교해 보자.',
    ctl: ['c1A', 'c1B', 'c1H', 'c1T'], anim: { key: 'c1T', dur: 6, label: '움직여 보기', start: 0 },
    presets: () => [['돌려 붙이기', 1], ['삼각형 둘로 나누기', 0]].map(([l, m], i) => ({ group: i === 0 ? '방법' : '', label: l, apply: (s) => { s.c1Mode = m; s.c1T = 0; }, on: (s) => s.c1Mode === m })),
    init: (s) => { s.c1A = 4; s.c1B = 10; s.c1H = 6; s.c1T = 0; s.c1Mode = 1; s.c1Q = 0; },
    reroll: (s) => { s.c1A = rpick(range(2, 6), s.c1A); s.c1B = rpick(range(6, 12).filter((v) => v !== s.c1A), s.c1B); s.c1H = rpick([2, 3, 4, 5, 6, 7, 8], s.c1H); s.c1Q = rpick([0, 1, 2], s.c1Q); s.c1T = 0; },
    model: (s) => { const a = clamp(Math.round(s.c1A), 2, 6), B = clamp(Math.round(s.c1B), 6, 12), H = clamp(Math.round(s.c1H), 2, 8), p = (B - a) / 2; return { a, B, H, p, mode: s.c1Mode ? 1 : 0, q: s.c1Q | 0, S: ((a + B) * H) / 2, T1: (B * H) / 2, T2: (a * H) / 2 }; },
    geo: (M) => { const BL = pt(0, 0), BR = pt(M.B, 0), TR = pt(M.p + M.a, -M.H), TL = pt(M.p, -M.H); return { BL, BR, TR, TL, trap: [BL, BR, TR, TL] }; },
    draw(b, s, M, C) {
      const { a, B, H, p, S, T1, T2 } = M, g = trap2.geo(M), { BL, BR, TR, TL } = g;
      const mode = C.problem ? (M.q === 2 ? 0 : 1) : M.mode, c0 = centroid(g.trap);
      const t = C.problem ? 0 : C.t;
      if (mode === 1) {
        // 같은 사다리꼴(복사본)을 만들고, 붙을 자리에서 제자리 180° 회전
        const Mp = mid(BR, TR), cF = pt(2 * Mp.x - c0.x, 2 * Mp.y - c0.y), off = pt(2 * (Mp.x - c0.x), 2 * (Mp.y - c0.y));
        FIT(b, { x0: 0, x1: B + a + p, y0: -H - 3.2, y1: 3.2 }, { b: C.problem ? 80 : 118, t: 24 });
        fillPoly(b, g.trap, 'sky', 0.22); poly(b, g.trap, 'ink', 3.6);
        if (!C.problem) {
          const al = seg01(t, 0, 0.1), ang = Math.PI * seg01(t, 0.1, 1);
          const cp = g.trap.map((v) => rotAbout(pt(v.x + off.x, v.y + off.y), cF, ang));
          if (t > 0.001 || (C.review && C.step === 1)) { const a2 = C.review && C.step === 1 ? 1 : al; fillPoly(b, cp, 'green', 0.34 * a2); poly(b, cp, 'green', 3.6, { alpha: a2 }); }
        }
        par(b, TL, TR, 1, 'green'); par(b, BL, BR, 1, 'green');
        hgtTo(b, TL, BL, BR, { label: `높이 ${H}cm`, side: 1 });
        const fin = !C.problem && (C.review ? C.step >= 2 : t > 0.999);
        dim(b, TL, TR, `윗변 ${a}cm`, { ref: c0, color: 'sky' });
        dim(b, BL, BR, fin ? `${B}` : `아랫변 ${B}cm`, { ref: c0, color: 'sky' });
        if (fin) { dim(b, BR, pt(B + a, 0), `${a}`, { ref: c0, color: 'green' }); dim(b, BL, pt(B + a, 0), `밑변 ${a}+${B} = ${a + B}`, { ref: c0, color: 'green', off: 54 }); }
        if (C.problem) { foot(b, pt((B + a) / 2, 0), M.q === 0 ? '사다리꼴 2개를 거꾸로 붙여요' : '사다리꼴의 넓이 = ? cm²', 'amber', 60); return; }
        const fx = (B + a) / 2;
        if (C.review ? C.step >= 3 : t > 0.999) foot(b, pt(fx, 0), `평행사변형의 절반: ½×${a + B}×${H} = ${num(S)}cm²`, 'green', 92);
        else foot(b, pt(fx, 0), C.review && C.step >= 2 ? '돌려서 붙여요' : '사다리꼴의 넓이 = ?', 'amber', C.review && C.step >= 2 ? 92 : 64);
        return;
      }
      // 대각선 TL-BR 로 나누기: 윗변 쪽 삼각형이 가로로 떼어짐
      const gap = 1.6 * ease(C.problem ? 0 : C.review ? (C.step >= 2 ? 1 : 0) : t);
      FIT(b, { x0: 0, x1: Math.max(B, p + a) + 1.6, y0: -H, y1: 0 }, { b: C.problem ? 84 : 122 });
      const t1 = [BL, BR, TL], t2 = [TL, TR, BR].map((q) => pt(q.x + gap, q.y));
      fillPoly(b, t1, 'sky', 0.26); poly(b, t1, 'ink', 3.6);
      fillPoly(b, t2, C.problem && M.q === 2 ? 'amber' : 'green', 0.3); poly(b, t2, 'ink', 3.6);
      par(b, TL, TR, 1, 'green'); par(b, BL, BR, 1, 'green');
      if (!C.problem) {
        hgtTo(b, TL, BL, BR, { label: `높이 ${H}`, side: -1, gap: 8 });
        hgtTo(b, t2[2], t2[0], t2[1], { label: `높이 ${H}`, side: 1 });
      } else hgtTo(b, TL, BL, BR, { label: `높이 ${H}cm`, side: 1 });
      if (gap < 0.05) [[TL, 'A'], [BL, 'B'], [BR, 'C'], [TR, 'D']].forEach(([q, n]) => tagOut(b, q, c0, n, { size: 17, gap: 10 }));
      dim(b, TL, TR, `윗변 ${a}cm`, { ref: c0, color: 'sky' });
      dim(b, BL, BR, `아랫변 ${B}cm`, { ref: c0, color: 'sky' });
      if (C.problem) { foot(b, pt(Math.max(B, p + a) / 2, 0), '삼각형 ACD의 넓이 = ? cm²', 'amber', 58); return; }
      const x0 = Math.max(B, p + a) / 2;
      if (!C.review || C.step >= 2) { foot(b, pt(x0, 0), `① ½×${B}×${H} = ${num(T1)}`, 'sky', 58); foot(b, pt(x0, 0), `② ½×${a}×${H} = ${num(T2)}`, 'green', 84); }
      if (!C.review || C.step >= 3) foot(b, pt(x0, 0), `① + ② = ${num(T1)} + ${num(T2)} = ${num(S)}cm²`, 'amber', 110);
    },
    stepT: (n) => (n <= 1 ? 0 : 1),
    steps: (M) => (M.mode ? [
      '똑같은 사다리꼴을 하나 더 만들어요(복사). 복사본이 붙을 자리에 놓여 있어요.',
      `복사본을 제자리에서 180° 돌리면 꼭 맞게 붙어서 밑변 ${M.a}+${M.B}=${M.a + M.B}cm, 높이 ${M.H}cm인 평행사변형이 돼요.`,
      `평행사변형의 넓이는 ${M.a + M.B}×${M.H}=${(M.a + M.B) * M.H}cm²이고, 사다리꼴은 그 절반이므로 ${num(M.S)}cm²예요.`
    ] : [
      '대각선 AC를 그어 사다리꼴을 삼각형 ABC와 삼각형 ACD, 두 개로 나눠요.',
      `두 삼각형의 높이는 모두 ${M.H}cm예요. ① 아랫변을 밑변으로 하면 ½×${M.B}×${M.H}=${num(M.T1)}, ② 윗변을 밑변으로 하면 ½×${M.a}×${M.H}=${num(M.T2)}예요.`,
      `사다리꼴의 넓이는 두 삼각형의 합 ${num(M.T1)}+${num(M.T2)}=${num(M.S)}cm²예요. 식으로 묶으면 ½×(${M.a}+${M.B})×${M.H}예요.`
    ]),
    view: (M) => ({
      guide: M.mode ? '▶를 누르면 <b>초록 복사본</b>이 제자리에서 180° 돌아 붙어요. 위의 칩으로 <b>삼각형 둘로 나누기</b> 방법도 살펴보세요.' : '▶를 누르면 <b>윗변 쪽 삼각형</b>이 가로로 떼어져요. 두 삼각형은 높이가 같아요. 위의 칩으로 <b>돌려 붙이기</b> 방법도 살펴보세요.',
      readouts: [rd('윗변 · 아랫변', `${M.a} · ${M.B}`, 'sky'), rd('높이', mm(M.H), 'amber'), rd('넓이', `${num(M.S)}cm²`, 'green', `½ × (${M.a}+${M.B}) × ${M.H}`)],
      formula: M.mode ? `<p>$(${M.a}+${M.B})\\times${M.H}\\times\\dfrac{1}{2}=${tx(M.S)}$</p>` : `<p>$\\dfrac{1}{2}\\times${M.B}\\times${M.H}+\\dfrac{1}{2}\\times${M.a}\\times${M.H}=${tx(M.T1)}+${tx(M.T2)}=${tx(M.S)}$</p>`,
      rule: '사다리꼴의 넓이 = ½ × (윗변 + 아랫변) × 높이 — 두 방법의 답은 같다',
      notes: notes('돌려 붙이면 평행사변형의 밑변이 (윗변+아랫변)이 돼요.', '대각선으로 나누면 두 삼각형의 높이가 같아서 윗변과 아랫변의 크기가 넓이의 비가 돼요.')
    }),
    prob: (M) => {
      const { a, B, H, S, T2, q } = M, w = a + B;
      if (q === 0) return { tag: '사다리꼴을 돌려 붙인 평행사변형의 밑변', key: `0-${a}-${B}`, stem: `윗변이 ${a} cm, 아랫변이 ${B} cm, 높이가 ${H} cm인 사다리꼴 2개를 거꾸로 맞붙여 평행사변형을 만들었다. 이 평행사변형의 밑변의 길이는?`, choices: mkChoices(w, [[B, '아랫변 옆에 뒤집힌 윗변이 붙어서 밑변이 더 길어져요.'], [w / 2, '두 변의 평균은 사다리꼴 한 개의 넓이에 쓰는 값이에요.'], [a * B, '더하지 않고 곱했어요.'], [w * H, '밑변은 길이예요. 넓이가 아니에요.']], { tex: (v) => `${G.tx(v)}\\text{cm}`, plain: (v) => num(v) + 'cm', pad: 1 }) };
      if (q === 1) return { tag: '사다리꼴의 넓이 (돌려 붙이기)', key: `1-${a}-${B}-${H}`, stem: `윗변이 ${a} cm, 아랫변이 ${B} cm, 높이가 ${H} cm인 사다리꼴의 넓이는?`, choices: mkChoices(S, [[w * H, '2로 나누지 않았어요. 사다리꼴은 평행사변형의 절반이에요.'], [(B * H) / 2, '윗변을 빼먹었어요.'], [w / 2, '높이를 곱하지 않았어요.'], [a * B * H / 2, '윗변과 아랫변은 곱하지 않고 더해요.']], { ...cm2, pad: pad8(S) }) };
      return { tag: '사다리꼴을 대각선으로 나눈 삼각형의 넓이', key: `2-${a}-${B}-${H}`, stem: `AD ∥ BC인 사다리꼴 ABCD에서 AD = ${a} cm, BC = ${B} cm이고 높이는 ${H} cm이다. 대각선 AC로 나눈 삼각형 ACD의 넓이는?`, choices: mkChoices(T2, [[(B * H) / 2, '아랫변 BC를 밑변으로 한 삼각형 ABC의 넓이예요. 삼각형 ACD의 밑변은 AD예요.'], [S, '사다리꼴 전체의 넓이예요.'], [a * H, '2로 나누지 않았어요.'], [(a + B) * H / 4, '삼각형의 밑변은 윗변 AD 하나예요.']], { ...cm2, pad: pad8(T2) }) };
    },
    verify: (s) => { const M = trap2.model(s), g = trap2.geo(M); const Q = trap2.prob(M); return { geo: M.q === 0 ? M.a + M.B : M.q === 1 ? area2(g.trap) : area2([g.TL, g.TR, g.BL]), formula: Q.choices.find((c) => c.ok).v }; }
  };

  /* ====================================================================== 2. 바깥 직사각형에서 빼기 (옛 boxFrame의 모눈 삼각형) */
  const frame = {
    id: 'c2-frame', title: '바깥 직사각형에서 빼기', short: '바깥에서 빼기',
    question: '모눈 위에 비스듬히 놓인 삼각형은 밑변과 높이를 바로 알 수 없어요. 어떻게 넓이를 구할까?',
    ctl: ['c2W', 'c2H', 'c2A', 'c2X', 'c2T'], anim: { key: 'c2T', dur: 4, label: '귀퉁이 떼어 놓기', start: 0 },
    init: (s) => { s.c2W = 8; s.c2H = 6; s.c2A = 2; s.c2X = 3; s.c2T = 0; },
    reroll: (s) => { s.c2W = rpick(range(6, 12), s.c2W); s.c2H = rpick(range(5, 8), s.c2H); s.c2A = rpick(range(1, 4), s.c2A); s.c2X = rpick(range(1, 5), s.c2X); s.c2T = 0; },
    model: (s) => { const W = clamp(Math.round(s.c2W), 6, 12), H = clamp(Math.round(s.c2H), 5, 8), a = clamp(Math.round(s.c2A), 1, Math.min(4, H - 1)), x = clamp(Math.round(s.c2X), 1, Math.min(5, W - 1)); const t1 = (W * a) / 2, t2 = (x * (H - a)) / 2, t3 = ((W - x) * H) / 2; return { W, H, a, x, t1, t2, t3, R: W * H, A: W * H - t1 - t2 - t3 }; },
    geo: (M) => { const Av = pt(0, M.a), Bv = pt(M.x, M.H), Cv = pt(M.W, 0); return { Av, Bv, Cv, tri: [Av, Bv, Cv], c1: [pt(0, 0), Av, Cv], c2: [Av, pt(0, M.H), Bv], c3: [Bv, pt(M.W, M.H), Cv] }; },
    draw(b, s, M, C) {
      const { W, H, a, x, t1, t2, t3, R, A } = M, g = frame.geo(M);
      const t = C.problem ? 0 : C.review ? (C.step >= 2 ? 1 : 0) : C.t, sep = 1.4 * ease(t);
      FIT(b, { x0: -1.4, x1: W + 1.4, y0: 0, y1: H }, { b: C.problem ? 108 : 176, l: 40, r: 64 });
      for (let i = 0; i <= W; i++) line(b, pt(i, 0), pt(i, H), 'muted', 1.2, { alpha: 0.5 });
      for (let j = 0; j <= H; j++) line(b, pt(0, j), pt(W, j), 'muted', 1.2, { alpha: 0.5 });
      const mv = (P3, dx) => P3.map((q) => pt(q.x + dx, q.y));
      const showC = !C.problem && (!C.review || C.step >= 2);
      if (showC) { [[g.c1, -sep], [g.c2, -sep], [g.c3, sep]].forEach(([c, dx]) => { fillPoly(b, mv(c, dx), 'rose', 0.3); poly(b, mv(c, dx), 'rose', 3); }); }
      fillPoly(b, g.tri, 'sky', 0.3); poly(b, g.tri, 'ink', 3.8);
      if (sep < 0.05) poly(b, [pt(0, 0), pt(W, 0), pt(W, H), pt(0, H)], 'ink', 2.4, { dash: [7, 5], alpha: 0.9 });
      [[g.Av, 'A', pt(-1, 0)], [g.Bv, 'B', pt(0, 1)], [g.Cv, 'C', pt(1, -1)]].forEach(([q, n, d]) => T(b, q, n, { dx: d.x * 26, dy: d.y * 24, size: 18 }));
      b.point(g.Av, { color: 'amber', r: 5 }); b.point(g.Bv, { color: 'amber', r: 5 }); b.point(g.Cv, { color: 'amber', r: 5 });
      if (showC && sep < 0.9) { T(b, centroid(g.c1), '①', { size: 22, color: 'rose' }); T(b, centroid(g.c2), '②', { size: 22, color: 'rose' }); T(b, centroid(g.c3), '③', { size: 22, color: 'rose' }); }
      dim(b, pt(0, H), pt(W, H), `가로 ${W}칸`, { ref: pt(W / 2, H / 2), color: 'sky', off: 50 });
      if (sep < 0.05) dim(b, pt(W, 0), pt(W, H), `${H}칸`, { ref: pt(W / 2, H / 2), color: 'sky', off: 26 });
      if (C.problem) { foot(b, pt(W / 2, H), '모눈 한 칸 = 1cm²   △ABC = ? cm²', 'amber', 88); return; }
      const f = (str, col, i) => foot(b, pt(W / 2, H), str, col, 84 + 26 * i);
      if (C.review) {
        if (C.step === 1) f(`직사각형 ${W}×${H} = ${R}`, 'sky', 0);
        else if (C.step === 2) { f(`① ½×${W}×${a} = ${num(t1)}  ② ½×${x}×${H - a} = ${num(t2)}`, 'rose', 0); f(`③ ½×${W - x}×${H} = ${num(t3)}`, 'rose', 1); }
        else { f(`${R} − (${num(t1)}+${num(t2)}+${num(t3)}) = ${num(A)}`, 'green', 0); }
      } else {
        f(`직사각형 ${W}×${H} = ${R}`, 'sky', 0);
        if (t > 0.01) { f(`바깥 ①+②+③ = ${num(t1 + t2 + t3)}`, 'rose', 1); f(`△ABC = ${R} − ${num(t1 + t2 + t3)} = ${num(A)}`, 'green', 2); }
      }
      if (!C.review && !C.thumb) {
        b.handle('A', g.Av, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A를 세로로 끌기', drag: (w) => { s.c2A = clamp(Math.round(w.y), 1, Math.min(4, H - 1)); } });
        b.handle('B', g.Bv, { color: 'amber', r: 8, ariaLabel: '꼭짓점 B를 가로로 끌기', drag: (w) => { s.c2X = clamp(Math.round(w.x), 1, Math.min(5, W - 1)); } });
      }
    },
    stepT: (n) => (n >= 2 ? 1 : 0),
    steps: (M) => [
      `세 꼭짓점이 모두 닿도록 삼각형을 둘러싸는 직사각형을 그려요. 가로 ${M.W}, 세로 ${M.H}이므로 넓이는 ${M.W}×${M.H}=${M.R}예요.`,
      `바깥에 남는 직각삼각형 3개의 넓이를 각각 구해요. ① ½×${M.W}×${M.a}=${num(M.t1)}, ② ½×${M.x}×${M.H - M.a}=${num(M.t2)}, ③ ½×${M.W - M.x}×${M.H}=${num(M.t3)}예요.`,
      `삼각형 ABC의 넓이는 직사각형에서 세 귀퉁이를 뺀 ${M.R}−(${num(M.t1)}+${num(M.t2)}+${num(M.t3)})=${num(M.A)}예요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 A, B</b>를 끌거나 막대로 직사각형의 크기를 바꿔 보세요. ▶를 누르면 <b>분홍 귀퉁이 세 개</b>가 가로로 떼어져요. 모눈 한 칸의 넓이는 1이에요.',
      readouts: [rd('바깥 직사각형', `${M.W} × ${M.H} = ${M.R}`, 'sky'), rd('귀퉁이 ① ② ③', `${num(M.t1)}, ${num(M.t2)}, ${num(M.t3)}`, 'rose', `합 ${num(M.t1 + M.t2 + M.t3)}`), rd('△ABC의 넓이', num(M.A), 'green', `${M.R} − ${num(M.t1 + M.t2 + M.t3)}`, null, true)],
      formula: `<p>$\\triangle ABC=${M.R}-(${tx(M.t1)}+${tx(M.t2)}+${tx(M.t3)})=${tx(M.A)}$</p>`,
      rule: '밑변과 높이를 바로 알 수 없으면, 바깥 직사각형의 넓이에서 귀퉁이 직각삼각형의 넓이를 뺀다',
      notes: notes('귀퉁이는 모두 직각삼각형이라서 ½×가로×세로로 구해요.', '세 점이 직사각형의 변 위에 흩어져 있을 때는 직사각형의 절반이 아니에요. 귀퉁이를 각각 빼야 해요.')
    }),
    prob: (M) => {
      const { W, H, R, t1, t2, t3, A } = M, sum = t1 + t2 + t3;
      return {
        tag: '함정 · 모눈 위 삼각형의 넓이', key: `${W}-${H}-${M.a}-${M.x}`,
        stem: `모눈종이에서 한 칸의 한 변은 1 cm이다. 가로 ${W}칸, 세로 ${H}칸인 직사각형의 세 변 위에 꼭짓점이 있는 삼각형 ABC의 넓이는?`,
        choices: mkChoices(A, [[R / 2, '세 점이 변 위에 흩어져 있으면 절반이 아니에요. 귀퉁이 세 개를 각각 빼요.'], [sum, '그것은 바깥 세 귀퉁이의 넓이의 합이에요.'], [R, '직사각형 전체의 넓이예요.'], [R - t1 - t2, '귀퉁이 하나를 덜 뺐어요. 세 개를 모두 빼요.']], { ...cm2, pad: pad8(A) })
      };
    },
    verify: (s) => { const M = frame.model(s), g = frame.geo(M); return { geo: area2(g.tri), formula: M.A }; }
  };

  /* ====================================================================== 3. 길이 있는 땅 (옛 roadMerge) */
  const road = {
    id: 'c3-road', title: '길이 있는 땅의 넓이', short: '길이 있는 땅',
    question: '땅에 폭이 일정한 길을 가로·세로로 내면 잔디밭은 네 조각으로 나뉘어요. 조각을 밀어 붙이면 넓이를 쉽게 구할 수 있을까?',
    ctl: ['c3W', 'c3H', 'c3X', 'c3T'], anim: { key: 'c3T', dur: 9, label: '조각 밀어 붙이기', start: 0 },
    presets: () => [['곧은 길', 0], ['비스듬한 길', 1]].map(([l, m], i) => ({ group: i === 0 ? '세로 길' : '', label: l, apply: (s) => { s.c3Mode = m; s.c3T = 0; }, on: (s) => s.c3Mode === m })),
    init: (s) => { s.c3W = 14; s.c3H = 8; s.c3X = 2; s.c3T = 0; s.c3Mode = 0; },
    reroll: (s) => { s.c3W = rpick(range(10, 18), s.c3W); s.c3H = rpick(range(6, 10), s.c3H); s.c3X = rpick(range(1, 4), s.c3X); s.c3Mode = rpick([0, 1], s.c3Mode); s.c3T = 0; },
    model: (s) => { const W = clamp(Math.round(s.c3W), 10, 18), H = clamp(Math.round(s.c3H), 6, 10), x = clamp(Math.round(s.c3X), 1, 4), mode = s.c3Mode ? 1 : 0; return { W, H, x, mode, sl: mode ? 2 : 0, w1: Math.floor((W - x) / 2), h1: Math.floor((H - x) / 2), A: (W - x) * (H - x) }; },
    pieces: (M) => {
      const { W, H, x, w1, h1, sl } = M, e = (y) => w1 + sl * (0.5 - y / H);
      return {
        UL: [pt(0, 0), pt(e(0), 0), pt(e(h1), h1), pt(0, h1)],
        UR: [pt(e(0) + x, 0), pt(W, 0), pt(W, h1), pt(e(h1) + x, h1)],
        LL: [pt(0, h1 + x), pt(e(h1 + x), h1 + x), pt(e(H), H), pt(0, H)],
        LR: [pt(e(h1 + x) + x, h1 + x), pt(W, h1 + x), pt(W, H), pt(e(H) + x, H)],
        e
      };
    },
    draw(b, s, M, C) {
      const { W, H, x, h1, A } = M, pc = road.pieces(M), C0 = pt(W / 2, H / 2), R = Math.hypot(W, H) / 2;
      FIT(b, { x0: C0.x - R, x1: C0.x + R, y0: C0.y - R, y1: C0.y + R }, { b: C.problem ? 78 : 96, t: 34, l: 60, r: 90 });
      const t = C.problem ? 0 : C.review ? (C.step === 1 ? 0.4 : 1) : C.t;
      const s1 = ease(seg01(t, 0, 0.4)), phi = (Math.PI / 2) * ease(seg01(t, 0.4, 0.7)), s3 = ease(seg01(t, 0.7, 1));
      const tf = (q) => rotAbout(q, C0, phi), sh = (P3, dx, dy) => P3.map((q) => pt(q.x + dx, q.y + dy)), out = (P3) => P3.map(tf);
      const field = [pt(0, 0), pt(W, 0), pt(W, H), pt(0, H)];
      fillPoly(b, out(field), 'rose', 0.22); poly(b, out(field), 'rose', 2.6, { dash: [7, 6] });
      const parts = [sh(pc.UL, x * s1, 0), pc.UR, sh(pc.LL, x * s1, -x * s3), sh(pc.LR, 0, -x * s3)];
      parts.forEach((q) => { fillPoly(b, out(q), 'green', 0.34); poly(b, out(q), 'green', 3.2); });
      if (t < 0.02) {
        // 길의 폭 x 와 땅의 가로·세로 표시
        const ey = (y) => pc.e(y);
        dim(b, pt(0, H), pt(W, H), `가로 ${W}m`, { ref: C0, color: 'sky' });
        dim(b, pt(W, 0), pt(W, H), `세로 ${H}m`, { ref: C0, color: 'sky', off: 30 });
        dim(b, pt(ey(0), 0), pt(ey(0) + x, 0), `${x}m`, { ref: C0, color: 'rose', off: 20 });
        dim(b, pt(0, h1), pt(0, h1 + x), `${x}m`, { ref: C0, color: 'rose', off: 22 });
        T(b, pt(ey(H * 0.5) + x / 2, H * 0.3), '길', { size: 16, color: 'rose' });
      }
      if (C.problem) { foot(b, pt(W / 2, H), '잔디밭의 넓이 = ? m²', 'amber', 56); return; }
      const cy = C0.y + R;
      if (t < 0.4) foot(b, pt(W / 2, H), `땅 ${W}×${H}, 길의 폭 ${x}`, 'amber', 56);
      else if (t < 0.999) foot(b, pt(W / 2, cy), t < 0.7 ? `가로 = ${W} − ${x} = ${W - x}` : `(돌려서) 세로 = ${H} − ${x} = ${H - x}`, 'amber', 36);
      else foot(b, pt(W / 2, cy), `(${W}−${x}) × (${H}−${x}) = ${W - x} × ${H - x} = ${A}m²`, 'green', 36);
    },
    stepT: (n) => (n <= 1 ? 0.4 : 1),
    steps: (M) => [
      `길이 잔디밭을 네 조각으로 나눠요. 세로 길을 따라 왼쪽 조각을 오른쪽으로 ${M.x}m 밀어 붙이면 가로는 ${M.W}−${M.x}=${M.W - M.x}m가 돼요.${M.mode ? ' (길이 비스듬해도 가로로 잰 폭이 같으면 똑같이 붙어요.)' : ''}`,
      `도형을 제자리에서 90° 돌려 가로 길도 같은 방법으로 밀어 붙이면 세로는 ${M.H}−${M.x}=${M.H - M.x}m가 돼요.`,
      `잔디밭은 가로 ${M.W - M.x}m, 세로 ${M.H - M.x}m인 직사각형 한 개가 되므로 넓이는 ${M.W - M.x}×${M.H - M.x}=${M.A}m²예요.`
    ],
    view: (M) => ({
      guide: '▶를 누르면 잔디밭 조각이 <b>가로로 밀려 붙고</b>, 도형이 <b>제자리에서 90° 돌아</b> 한 번 더 붙어요. 위의 칩으로 비스듬한 길도 볼 수 있어요.',
      readouts: [rd('땅', `${M.W}m × ${M.H}m`, 'sky'), rd('길의 폭', `${M.x}m`, 'rose'), rd('잔디밭', `${M.W - M.x} × ${M.H - M.x}`, 'green', `${M.A}m²`, null, true)],
      formula: `<p>(잔디밭의 넓이) $=(${M.W}-${M.x})\\times(${M.H}-${M.x})=${M.W - M.x}\\times${M.H - M.x}=${M.A}\\ (\\text{m}^2)$</p>`,
      rule: '길의 폭이 일정하면 잔디밭의 넓이 = (가로 − 길의 폭) × (세로 − 길의 폭)',
      notes: notes('길이 가운데서 만나는 곳(교차로)을 두 번 빼지 않도록 조각을 밀어 붙이는 방법이 안전해요.', '길이 곧든 비스듬하든 폭이 같으면 넓이는 같아요.')
    }),
    prob: (M) => {
      const { W, H, x, mode, A } = M;
      return {
        tag: '함정 · 길을 낸 땅의 넓이', key: `${W}-${H}-${x}-${mode}`,
        stem: `가로 ${W} m, 세로 ${H} m인 직사각형 모양의 땅에 폭이 ${x} m인 길을 ${mode ? '세로 방향으로 비스듬하게 한 개(가로로 잰 폭이 ' + x + ' m), 가로 방향으로 한 개' : '세로·가로로 한 개씩'} 냈다. 길을 제외한 땅의 넓이는?`,
        choices: mkChoices(A, [[W * H - W * x - H * x, '길이 만나는 곳(' + x * x + ' m²)을 두 번 빼서 너무 작아요.'], [(W - x) * H, '가로 길을 빠뜨렸어요. 세로에서도 길의 폭을 빼야 해요.'], [W * H - x * x, '길의 넓이를 x²으로 계산했어요. 길은 땅을 가로질러요.'], [(W - 2 * x) * (H - 2 * x), '길의 폭을 두 번 뺐어요. 길은 가로·세로로 한 개씩이에요.']], { tex: (v) => `${G.tx(v)}\\text{m}^2`, plain: (v) => num(v) + 'm²', pad: pad8(A) })
      };
    },
    verify: (s) => { const M = road.model(s), pc = road.pieces(M); const tot = [pc.UL, pc.UR, pc.LL, pc.LR].reduce((a, q) => a + area2(q), 0); return { geo: tot, formula: M.A }; }
  };

  const PARAMS = {
    c1A: P('윗변', 2, 6, 1, 4, { color: 'sky', format: mm }),
    c1B: P('아랫변', 6, 12, 1, 10, { color: 'sky', format: mm }),
    c1H: P('높이', 2, 8, 1, 6, { color: 'amber', format: mm }),
    c1T: P('움직이기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌어 보세요', format: (v) => Math.round(v * 100) + '%' }),
    c2W: P('직사각형의 가로', 6, 12, 1, 8, { color: 'sky', format: (v) => `${v}칸` }),
    c2H: P('직사각형의 세로', 5, 8, 1, 6, { color: 'sky', format: (v) => `${v}칸` }),
    c2A: P('A의 높이', 1, 4, 1, 2, { color: 'amber', hint: '왼쪽 변 위의 점 A (위에서부터의 칸 수)', format: (v) => `${v}칸` }),
    c2X: P('B의 위치', 1, 5, 1, 3, { color: 'amber', hint: '아래쪽 변 위의 점 B (왼쪽에서부터의 칸 수)', format: (v) => `${v}칸` }),
    c2T: P('귀퉁이 떼어 놓기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 귀퉁이가 가로로 떼어져요', format: (v) => Math.round(v * 100) + '%' }),
    c3W: P('땅의 가로', 10, 18, 1, 14, { color: 'sky', format: (v) => `${v}m` }),
    c3H: P('땅의 세로', 6, 10, 1, 8, { color: 'sky', format: (v) => `${v}m` }),
    c3X: P('길의 폭', 1, 4, 1, 2, { color: 'rose', format: (v) => `${v}m` }),
    c3T: P('조각 밀어 붙이기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 조각이 밀려 붙고 한 번 돌아요', format: (v) => Math.round(v * 100) + '%' })
  };

  G.register(30, 't3', '③ 잘라 붙이기와 길·땅', '잘라 붙이기·길·땅', PARAMS, [trap2, frame, road]);
})();
