/* ==========================================================================
   중1 · 다각형의 넓이(초등 복습) — 탭 ① 「기본 넓이 공식」 (t1.js, order 10) — 장면 6개
   · a1-rect  직사각형   가로 × 세로            · 한 칸(1cm²)을 줄마다 세어 보기
   · a2-para  평행사변형 밑변 × 높이            · 삼각형 조각을 잘라 가로로 밀어 붙이면 직사각형
   · a3-tri   삼각형     ½ × 밑변 × 높이        · 같은 삼각형을 제자리에서 180° 돌려 가로로 붙이면 평행사변형
   · a4-trap  사다리꼴   ½ × (윗변 + 아랫변) × 높이 · 같은 사다리꼴을 제자리에서 180° 돌려 가로로 붙이면 평행사변형
   · a5-rhomb 마름모     ½ × (두 대각선의 곱)   · 바깥 삼각형 4개를 제자리에서 돌려 안쪽에 포개기
   · a6-obt   높이가 도형 밖에 있는 삼각형      · 꼭짓점을 평행선 위에서 끌어도 밑변·높이가 같으면 넓이가 같다
   모든 길이는 막대나 손잡이로 바꾸고, 글자·표시·정답은 지금의 값으로 다시 계산됩니다. 움직임은 가로 이동과 제자리 회전만 씁니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_AR;
  if (!G) return;
  const HALF = G.HALF; // 그림 속 글자의 분수(키트가 위·아래로 쌓아 그립니다)
  const { clamp, ease, seg01, pt, add, sub, mul, mid, lerp, fmtN, T, fit, fillPoly, line, poly, tick, par, mkChoices, P, rd, notes, cm1, cm2, rotAbout, rpick, range, dim, hgtTo, area2 } = G;

  const FIT = (b, box, o = {}) => fit(b, box, { l: 46, r: 46, t: 40, b: 70, ...o });
  const pad8 = (v) => Math.max(1, Math.round(v / 8));
  const num = (v) => fmtN(v);
  const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10]]; // (옆으로 민 길이, 높이, 옆변) — 옆변이 정수가 되는 세 쌍(√ 없이 길이를 그대로 주기 위해)
  const cInt = (p, h) => { if (!p) return null; const c = Math.hypot(p, h); return Math.abs(c - Math.round(c)) < 1e-9 ? Math.round(c) : null; }; // p=0 이면 옆변=높이라서 함정이 아니므로 옆변을 주지 않습니다
  const foot = (b, p, str, color = 'green', dy = 56) => T(b, p, str, { dy, size: 17, color });
  const handle = (b, C, id, p, label, drag) => { if (!C.problem && !C.thumb && !C.review) b.handle(id, p, { color: 'amber', r: 8, ariaLabel: label, drag }); };

  /* ====================================================================== 1. 직사각형 */
  const rect = {
    id: 'a1-rect', title: '직사각형의 넓이', short: '직사각형',
    question: '가로 6칸, 세로 4칸인 직사각형은 한 칸(1cm²)이 모두 몇 개일까? 넓이를 구하는 식은 무엇일까?',
    ctl: ['a1W', 'a1H', 'a1T'], anim: { key: 'a1T', dur: 6, label: '한 줄씩 세어 보기', start: 1 },
    init: (s) => { s.a1W = 6; s.a1H = 4; s.a1T = 1; },
    reroll: (s) => { s.a1W = rpick(range(3, 10), s.a1W); s.a1H = rpick(range(2, 7).filter((v) => v !== s.a1W), s.a1H); s.a1T = 1; },
    model: (s) => { const W = clamp(Math.round(s.a1W), 1, 12), H = clamp(Math.round(s.a1H), 1, 8); return { W, H, A: W * H }; },
    draw(b, s, M, C) {
      const { W, H, A } = M;
      FIT(b, { x0: 0, x1: W, y0: -H, y1: 0 }, { b: 92, l: 68 });
      const kp = C.problem ? 0 : C.review ? (C.step >= 3 ? W : 0) : C.t * W; // 세어 본 줄 수(소수)
      if (!C.problem) {
        for (let i = 0; i < W; i++) {
          const f = clamp(kp - i, 0, 1);
          for (let j = 0; j < H; j++) {
            const cell = [pt(i, -H + j), pt(i + 1, -H + j), pt(i + 1, -H + j + 1), pt(i, -H + j + 1)];
            if (f > 0) fillPoly(b, cell, 'sky', 0.1 + 0.28 * f);
          }
        }
        for (let i = 0; i <= W; i++) line(b, pt(i, -H), pt(i, 0), 'muted', 1.3, { alpha: 0.55 });
        for (let j = 0; j <= H; j++) line(b, pt(0, -H + j), pt(W, -H + j), 'muted', 1.3, { alpha: 0.55 });
        if (C.review && C.step === 1) fillPoly(b, [pt(0, -1), pt(1, -1), pt(1, 0), pt(0, 0)], 'amber', 0.5);
        if (C.review && C.step === 2) {
          fillPoly(b, [pt(0, -1), pt(W, -1), pt(W, 0), pt(0, 0)], 'amber', 0.32);
          fillPoly(b, [pt(0, -H), pt(1, -H), pt(1, 0), pt(0, 0)], 'amber', 0.32);
        }
      } else fillPoly(b, [pt(0, -H), pt(W, -H), pt(W, 0), pt(0, 0)], 'sky', 0.14);
      poly(b, [pt(0, -H), pt(W, -H), pt(W, 0), pt(0, 0)], 'ink', 3.6);
      const c0 = pt(W / 2, -H / 2);
      dim(b, pt(0, 0), pt(W, 0), `가로 ${W}cm`, { ref: c0, color: 'sky' });
      dim(b, pt(0, 0), pt(0, -H), `세로 ${H}cm`, { ref: c0, color: 'sky' });
      if (C.problem) { T(b, c0, '넓이 ?', { size: 22, color: 'amber' }); return; }
      if (C.review && C.step === 1) foot(b, pt(W / 2, 0), '한 칸 = 1cm × 1cm = 1cm²', 'amber');
      else if (C.review && C.step === 2) foot(b, pt(W / 2, 0), `한 줄에 ${W}칸 × ${H}줄`, 'amber');
      else if (C.review || kp >= W - 1e-9) foot(b, pt(W / 2, 0), `${W}칸 × ${H}줄 = ${A}칸 = ${A}cm²`, 'green');
      else foot(b, pt(W / 2, 0), `${Math.floor(kp + 1e-9)}줄 × ${H}칸 = ${Math.floor(kp + 1e-9) * H}칸`, 'sky');
    },
    steps: (M) => [
      '작은 정사각형 한 칸은 가로 1cm, 세로 1cm이므로 넓이가 1cm²예요.',
      `가로에 ${M.W}칸씩, 세로로 ${M.H}줄이 놓여 있어요.`,
      `칸의 수는 ${M.W}×${M.H}=${M.A}(개)이므로 넓이는 ${M.A}cm²예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>가로</b>와 <b>세로</b>를 바꿔 보세요. ▶를 누르면 한 줄씩 칸을 세어 줘요. 한 칸의 넓이는 <b>1cm²</b>예요.',
      readouts: [rd('가로', `${M.W}cm`, 'sky'), rd('세로', `${M.H}cm`, 'sky'), rd('넓이', `${M.A}cm²`, 'green', `${M.W} × ${M.H}`)],
      formula: `<p>(직사각형의 넓이) $=(\\text{가로})\\times(\\text{세로})$</p><p>$=${M.W}\\times${M.H}=${M.A}\\ (\\text{cm}^2)$</p>`,
      rule: '직사각형의 넓이 = 가로 × 세로',
      notes: notes('넓이의 단위는 cm²예요. 길이의 단위(cm)와 달라요.', '정사각형은 가로와 세로가 같아서 (한 변)×(한 변)이에요.')
    }),
    prob: (M) => {
      const { W, H, A } = M;
      return {
        tag: '직사각형의 넓이', key: `${W}x${H}`,
        stem: `가로가 ${W} cm, 세로가 ${H} cm인 직사각형의 넓이는?`,
        choices: mkChoices(A, [[W + H, '가로와 세로를 더했어요. 넓이는 곱해서 구해요.'], [2 * (W + H), '둘레를 구했어요. 넓이는 가로×세로예요.'], [A / 2, '2로 나누는 것은 삼각형일 때예요. 직사각형은 그대로 곱해요.'], [A * 2, '2를 곱하지 않아요. 가로×세로가 넓이예요.']], { ...cm2, pad: pad8(A) })
      };
    },
    verify: (s) => { const M = rect.model(s); let n = 0; for (let i = 0; i < M.W; i++) for (let j = 0; j < M.H; j++) n++; return { geo: n, formula: M.A }; }
  };

  /* ====================================================================== 2. 평행사변형 */
  const para = {
    id: 'a2-para', title: '평행사변형의 넓이', short: '평행사변형',
    question: '평행사변형은 어떻게 잘라 붙이면 직사각형이 될까? 넓이는 어떻게 구할까?',
    ctl: ['a2B', 'a2H', 'a2S', 'a2T'], anim: { key: 'a2T', dur: 5, label: '잘라서 밀어 붙이기', start: 0 },
    init: (s) => { s.a2B = 8; s.a2H = 4; s.a2S = 3; s.a2T = 0; },
    reroll: (s) => { const t = rpick(TRIPLES, TRIPLES.find((x) => x[0] === s.a2S && x[1] === s.a2H)); s.a2S = t[0]; s.a2H = t[1]; s.a2B = rpick(range(Math.max(6, t[0]), 12), s.a2B); s.a2T = 0; },
    model: (s) => { const B = clamp(Math.round(s.a2B), 6, 12), H = clamp(Math.round(s.a2H), 2, 8), S = clamp(Math.round(s.a2S), 0, Math.min(6, B)); return { B, H, S, A: B * H, c: cInt(S, H) }; },
    geo: (M) => ({ para: [pt(0, 0), pt(M.B, 0), pt(M.B + M.S, -M.H), pt(M.S, -M.H)] }),
    draw(b, s, M, C) {
      const { B, H, S, A, c } = M, [P0, P1, P2, P3] = para.geo(M).para;
      FIT(b, { x0: 0, x1: B + S, y0: -H, y1: 0 }, { b: 92, r: C.problem && c ? 78 : 46 });
      const t = C.problem ? 0 : C.t, mv = ease(t) * B;
      const tri = [P0, pt(S, 0), pt(S, -H)], rest = [pt(S, 0), P1, P2, P3];
      if (C.problem) { fillPoly(b, [P0, P1, P2, P3], 'sky', 0.2); poly(b, [P0, P1, P2, P3], 'ink', 3.6); }
      else {
        fillPoly(b, rest, 'sky', 0.2); poly(b, rest, 'ink', 3.6);
        if (mv > 0.01) poly(b, tri, 'muted', 2, { dash: [5, 5], alpha: 0.8 });
        const trm = tri.map((p) => pt(p.x + mv, p.y));
        fillPoly(b, trm, 'green', 0.34); poly(b, trm, 'green', 3.6);
      }
      if (mv < 0.01 || C.problem) { tick(b, P3, P2, 1); tick(b, P0, P1, 1); }
      hgtTo(b, P3, P0, P1, { label: `높이 ${H}cm`, side: S > B / 2 ? -1 : 1 });
      const c0 = pt((B + S) / 2, -H / 2);
      dim(b, P0, P1, `밑변 ${B}cm`, { ref: c0, color: 'sky' });
      if (C.problem && c) dim(b, P1, P2, `옆변 ${c}cm`, { ref: c0, color: 'rose' });
      if (C.problem) { foot(b, pt((B + S) / 2, 0), '넓이 = ? cm²', 'amber', 58); return; }
      const done = C.review ? C.step >= 3 : mv > B * 0.999;
      if (done) foot(b, pt((B + S) / 2, 0), `직사각형 ${B}×${H} = ${A}cm²`, 'green');
      else foot(b, pt((B + S) / 2, 0), C.review ? '삼각형 조각을 옆으로 옮겨요' : '평행사변형의 넓이 = ?', 'amber');
      handle(b, C, 's', P3, '윗변을 가로로 밀기', (w) => { s.a2S = clamp(Math.round(w.x), 0, Math.min(6, B)); });
    },
    stepT: (n) => (n <= 1 ? 0 : 1),
    steps: (M) => [
      `높이(점선)를 따라 잘라 낸 삼각형 조각이 한쪽에 있어요. 이 조각은 옆으로 옮겨도 넓이가 변하지 않아요.`,
      `조각을 가로로 ${M.B}cm 밀어 반대쪽에 붙이면 가로 ${M.B}cm, 세로 ${M.H}cm인 직사각형이 돼요.`,
      `직사각형의 가로는 밑변 ${M.B}cm, 세로는 높이 ${M.H}cm예요. 넓이는 ${M.B}×${M.H}=${M.A}cm²예요.`
    ],
    view: (M) => ({
      guide: '▶를 누르면 <b>초록 삼각형 조각</b>이 가로로 밀려 가서 직사각형이 돼요. <b>노란 점</b>을 가로로 끌거나 막대로 길이를 바꿔 보세요. <b>노란 점선</b>이 높이예요.',
      readouts: [rd('밑변', `${M.B}cm`, 'sky'), rd('높이', `${M.H}cm`, 'amber', '점선(수직)'), rd('넓이', `${M.A}cm²`, 'green', `${M.B} × ${M.H}`)],
      formula: `<p>(평행사변형의 넓이) $=(\\text{밑변})\\times(\\text{높이})$</p><p>$=${M.B}\\times${M.H}=${M.A}\\ (\\text{cm}^2)$</p>`,
      rule: '평행사변형의 넓이 = 밑변 × 높이',
      notes: notes('높이는 밑변에 <b>수직</b>인 점선이에요. 비스듬한 옆변은 높이가 아니에요.', '막대로 기울어진 정도를 바꿔도 밑변과 높이가 같으면 넓이가 같아요.')
    }),
    prob: (M) => {
      const { B, H, A, c } = M;
      const wr = [[B * c / 1, '옆변은 높이가 아니에요. 밑변에 수직인 점선(높이)을 곱해야 해요.'], [A / 2, '2로 나누는 것은 삼각형일 때예요. 평행사변형은 그대로 곱해요.'], [2 * (B + (c || H)), '둘레를 구했어요. 넓이는 밑변×높이예요.'], [B + H, '더하지 않고 곱해요.']];
      if (!c) wr.shift();
      return {
        tag: c ? '함정 · 평행사변형의 넓이 (옆변은 높이가 아니에요)' : '평행사변형의 넓이', key: `${B}-${H}-${M.S}`,
        stem: c ? `밑변의 길이가 ${B} cm, 높이가 ${H} cm, 옆변의 길이가 ${c} cm인 평행사변형의 넓이는?` : `밑변의 길이가 ${B} cm, 높이가 ${H} cm인 평행사변형의 넓이는?`,
        choices: mkChoices(A, wr, { ...cm2, pad: pad8(A) })
      };
    },
    verify: (s) => { const M = para.model(s); return { geo: area2(para.geo(M).para), formula: M.A }; }
  };

  /* ====================================================================== 3. 삼각형 */
  const tri = {
    id: 'a3-tri', title: '삼각형의 넓이', short: '삼각형',
    question: '똑같은 삼각형 2개를 붙이면 어떤 도형이 될까? 삼각형의 넓이는 어떻게 구할까?',
    ctl: ['a3B', 'a3H', 'a3P', 'a3T'], anim: { key: 'a3T', dur: 6, label: '복사해서 돌려 붙이기', start: 0 },
    init: (s) => { s.a3B = 8; s.a3H = 4; s.a3P = 3; s.a3T = 0; },
    reroll: (s) => { const t = rpick(TRIPLES, TRIPLES.find((x) => x[0] === s.a3P && x[1] === s.a3H)); s.a3P = t[0]; s.a3H = t[1]; s.a3B = rpick(range(Math.max(6, t[0]), 12), s.a3B); s.a3T = 0; },
    model: (s) => { const B = clamp(Math.round(s.a3B), 6, 12), H = clamp(Math.round(s.a3H), 2, 8), p = clamp(Math.round(s.a3P), 0, Math.min(6, B)); return { B, H, p, A: (B * H) / 2, c: cInt(p, H) }; },
    geo: (M) => ({ tri: [pt(0, 0), pt(M.B, 0), pt(M.p, -M.H)] }),
    draw(b, s, M, C) {
      const { B, H, p, A, c } = M, [Bv, Cv, Av] = tri.geo(M).tri;
      FIT(b, { x0: 0, x1: C.problem ? B : B + p, y0: -H, y1: 0 }, { b: 96, l: C.problem && c ? 84 : 46 });
      const t = C.problem ? 0 : C.t;
      const Q = pt(B / 2, -H / 2), d = p; // 제자리 180° 회전의 중심(삼각형을 감싸는 직사각형의 한가운데), 이어서 가로로 p 만큼 밀기
      const ang = Math.PI * seg01(t, 0.12, 0.55), slide = d * seg01(t, 0.55, 1), al = seg01(t, 0, 0.12);
      fillPoly(b, [Bv, Cv, Av], 'sky', 0.22); poly(b, [Bv, Cv, Av], 'ink', 3.6);
      if (!C.problem && t > 0.001) {
        const cp = [Bv, Cv, Av].map((v) => { const r = rotAbout(v, Q, ang); return pt(r.x + slide, r.y); });
        fillPoly(b, cp, 'green', 0.34 * al); poly(b, cp, 'green', 3.6, { alpha: Math.max(0.0, al), dash: t < 0.125 ? [7, 5] : undefined });
      }
      hgtTo(b, Av, Bv, Cv, { label: `높이 ${H}cm`, side: (C.problem ? p >= B / 2 : p > B / 2) ? -1 : 1, at: C.problem && c && p >= B / 2 ? 0.8 : 0.5 });
      const c0 = pt((B + p) / 2, -H / 2);
      dim(b, Bv, Cv, `밑변 ${B}cm`, { ref: pt(B / 2, -H), color: 'sky' });
      if (C.problem) {
        if (c) dim(b, Bv, Av, `옆변 ${c}cm`, { ref: Cv, color: 'rose', at: 0.7 });
        foot(b, pt(B / 2, 0), '넓이 = ? cm²', 'amber', 56);
        return;
      }
      const done = C.review ? C.step >= 3 : t > 0.999;
      if (done) foot(b, pt((B + p) / 2, 0), `평행사변형 ${B}×${H}=${B * H}의 절반 = ${num(A)}cm²`, 'green');
      else foot(b, pt((B + p) / 2, 0), t > 0.001 && t < 0.125 ? '똑같은 삼각형을 복사해요(초록 점선)' : C.review && C.step >= 2 ? '돌려서 가로로 붙여요' : '삼각형의 넓이 = ?', t > 0.001 && t < 0.125 ? 'green' : 'amber');
      handle(b, C, 'a', Av, '꼭짓점을 가로로 밀기', (w) => { s.a3P = clamp(Math.round(w.x), 0, Math.min(6, B)); });
    },
    stepT: (n) => (n <= 1 ? 0.12 : 1),
    steps: (M) => [
      '똑같은 삼각형을 하나 더 만들어요(복사).',
      `복사한 삼각형을 제자리에서 180° 돌린 뒤 가로로 밀어 붙이면 밑변 ${M.B}cm, 높이 ${M.H}cm인 평행사변형이 돼요.`,
      `평행사변형의 넓이는 ${M.B}×${M.H}=${M.B * M.H}cm²이고, 삼각형은 그 절반이므로 $\\frac{1}{2}$×${M.B}×${M.H}=${num(M.A)}cm²예요.`
    ],
    view: (M) => ({
      guide: '▶를 누르면 <b>초록 복사본</b>이 제자리에서 180° 돌고 가로로 밀려 와서 평행사변형이 돼요. <b>노란 점</b>을 가로로 끌면 꼭짓점 위치가 바뀌어요.',
      readouts: [rd('밑변', `${M.B}cm`, 'sky'), rd('높이', `${M.H}cm`, 'amber', '점선(수직)'), rd('넓이', `${num(M.A)}cm²`, 'green', `${M.B} × ${M.H} ÷ 2`)],
      formula: `<p>(삼각형의 넓이) $=\\dfrac{1}{2}\\times(\\text{밑변})\\times(\\text{높이})$</p><p>$=\\dfrac{1}{2}\\times${M.B}\\times${M.H}=${G.tx(M.A)}\\ (\\text{cm}^2)$</p>`,
      rule: '삼각형의 넓이 = $\\frac{1}{2}$ × 밑변 × 높이',
      notes: notes('삼각형 2개로 평행사변형이 되므로 넓이는 <b>$\\frac{1}{2}$</b>(2로 나누기)를 꼭 곱해요.', '높이는 밑변에 수직인 점선이에요. 비스듬한 옆변은 높이가 아니에요.')
    }),
    prob: (M) => {
      const { B, H, A, c } = M;
      const wr = [[B * H, '2로 나누지 않았어요. 삼각형은 평행사변형의 절반이에요.'], [(B * (c || H + 1)) / 2, '옆변은 높이가 아니에요. 밑변에 수직인 높이를 써요.'], [B + H, '더하지 않고 곱해서 2로 나눠요.'], [(B + H) / 2, '밑변과 높이는 더하지 않고 곱해요.']];
      return {
        tag: c ? '함정 · 삼각형의 넓이 (옆변은 높이가 아니에요)' : '삼각형의 넓이', key: `${B}-${H}-${M.p}`,
        stem: c ? `밑변의 길이가 ${B} cm, 높이가 ${H} cm, 한 옆변의 길이가 ${c} cm인 삼각형의 넓이는?` : `밑변의 길이가 ${B} cm, 높이가 ${H} cm인 삼각형의 넓이는?`,
        choices: mkChoices(A, wr, { ...cm2, pad: pad8(A) })
      };
    },
    verify: (s) => { const M = tri.model(s); return { geo: area2(tri.geo(M).tri), formula: M.A }; }
  };

  /* ====================================================================== 4. 사다리꼴 */
  const trap = {
    id: 'a4-trap', title: '사다리꼴의 넓이', short: '사다리꼴',
    question: '똑같은 사다리꼴 2개를 붙이면 어떤 도형이 될까? 사다리꼴의 넓이는 어떻게 구할까?',
    ctl: ['a4A', 'a4B', 'a4H', 'a4P', 'a4T'], anim: { key: 'a4T', dur: 7, label: '복사해서 돌려 붙이기', start: 0 },
    init: (s) => { s.a4A = 4; s.a4B = 8; s.a4H = 4; s.a4P = 1; s.a4T = 0; },
    reroll: (s) => { const t = rpick(TRIPLES, TRIPLES.find((x) => x[0] === s.a4P && x[1] === s.a4H)); s.a4P = t[0]; s.a4H = t[1]; s.a4A = rpick(range(2, 6), s.a4A); s.a4B = rpick(range(Math.max(6, t[0]), 12).filter((v) => v !== s.a4A), s.a4B); s.a4T = 0; },
    model: (s) => { const A = clamp(Math.round(s.a4A), 2, 6), B = clamp(Math.round(s.a4B), 6, 12), H = clamp(Math.round(s.a4H), 2, 8), p = clamp(Math.round(s.a4P), 0, 6); return { a: A, B, H, p, S: ((A + B) * H) / 2, c: cInt(p, H) }; },
    geo: (M) => ({ trap: [pt(0, 0), pt(M.B, 0), pt(M.p + M.a, -M.H), pt(M.p, -M.H)] }),
    draw(b, s, M, C) {
      const { a, B, H, p, S, c } = M, [BL, BR, TR, TL] = trap.geo(M).trap;
      const xr = Math.max(B, p + a);
      FIT(b, { x0: 0, x1: C.problem ? xr : xr + Math.max(a, 0) + p, y0: -H, y1: 0 }, { b: 112, l: C.problem && c ? 92 : 46 });
      const t = C.problem ? 0 : C.t;
      const cx = xr / 2, Q = pt(cx, -H / 2), d = B + p + a - 2 * cx;
      const ang = Math.PI * seg01(t, 0.12, 0.55), slide = d * seg01(t, 0.55, 1), al = seg01(t, 0, 0.12);
      fillPoly(b, [BL, BR, TR, TL], 'sky', 0.22); poly(b, [BL, BR, TR, TL], 'ink', 3.6);
      if (!C.problem && t > 0.001) {
        const cp = [BL, BR, TR, TL].map((v) => { const r = rotAbout(v, Q, ang); return pt(r.x + slide, r.y); });
        fillPoly(b, cp, 'green', 0.34 * al); poly(b, cp, 'green', 3.6, { alpha: al, dash: t < 0.125 ? [7, 5] : undefined });
      }
      par(b, TL, TR, 1, 'green'); par(b, BL, BR, 1, 'green');
      hgtTo(b, TL, BL, BR, { label: `높이 ${H}cm`, side: 1, gap: 10 });
      const cc = pt(Math.max(B, p + a) / 2, -H / 2), done = C.review ? C.step >= 2 : t > 0.999;
      dim(b, TL, TR, `윗변 ${a}cm`, { ref: cc, color: 'sky' });
      if (done) {
        dim(b, BL, BR, `${B}`, { ref: cc, color: 'sky' });
        dim(b, BR, pt(B + a, 0), `${a}`, { ref: cc, color: 'green' });
        dim(b, BL, pt(B + a, 0), `밑변 ${a}+${B} = ${a + B}`, { ref: cc, color: 'green', off: 54 });
      } else dim(b, BL, BR, `아랫변 ${B}cm`, { ref: cc, color: 'sky' });
      if (C.problem) {
        if (c) dim(b, BL, TL, `옆변 ${c}cm`, { ref: BR, color: 'rose' });
        foot(b, pt(xr / 2, 0), '넓이 = ? cm²', 'amber', 56);
        return;
      }
      const fin = C.review ? C.step >= 3 : t > 0.999;
      const fx = (B + a + p) / 2 > xr / 2 ? (B + a) / 2 : xr / 2;
      if (fin) foot(b, pt(fx, 0), `평행사변형의 절반: ${HALF}×${a + B}×${H} = ${num(S)}cm²`, 'green', 94);
      else foot(b, pt(fx, 0), t > 0.001 && t < 0.125 ? '똑같은 사다리꼴을 복사해요(초록 점선)' : C.review && C.step >= 2 ? '돌려서 가로로 붙여요' : '사다리꼴의 넓이 = ?', t > 0.001 && t < 0.125 ? 'green' : 'amber', C.review && C.step >= 2 ? 96 : 64);
      handle(b, C, 'a', TL, '윗변을 가로로 밀기', (w) => { s.a4P = clamp(Math.round(w.x), 0, 6); });
    },
    stepT: (n) => (n <= 1 ? 0.12 : 1),
    steps: (M) => [
      '똑같은 사다리꼴을 하나 더 만들어요(복사).',
      `복사한 사다리꼴을 제자리에서 180° 돌려 가로로 밀어 붙이면 평행사변형이 돼요. 밑변은 (윗변 + 아랫변) = ${M.a}+${M.B}=${M.a + M.B}cm, 높이는 ${M.H}cm예요.`,
      `평행사변형의 넓이는 ${M.a + M.B}×${M.H}=${(M.a + M.B) * M.H}cm²이고, 사다리꼴은 그 절반이므로 $\\frac{1}{2}$×(${M.a}+${M.B})×${M.H}=${num(M.S)}cm²예요.`
    ],
    view: (M) => ({
      guide: '▶를 누르면 <b>초록 복사본</b>이 제자리에서 180° 돌고 가로로 밀려 와서 평행사변형이 돼요. 윗변·아랫변·높이는 막대로, 윗변의 위치는 <b>노란 점</b>을 가로로 끌어 바꿔요.',
      readouts: [rd('윗변', `${M.a}cm`, 'sky'), rd('아랫변', `${M.B}cm`, 'sky'), rd('높이', `${M.H}cm`, 'amber', '점선(수직)'), rd('넓이', `${num(M.S)}cm²`, 'green', `(${M.a}+${M.B}) × ${M.H} ÷ 2`, null, true)],
      formula: `<p>(사다리꼴의 넓이) $=\\dfrac{1}{2}\\times\\{(\\text{윗변})+(\\text{아랫변})\\}\\times(\\text{높이})$</p><p>$=\\dfrac{1}{2}\\times(${M.a}+${M.B})\\times${M.H}=${G.tx(M.S)}\\ (\\text{cm}^2)$</p>`,
      rule: '사다리꼴의 넓이 = $\\frac{1}{2}$ × (윗변 + 아랫변) × 높이',
      notes: notes('윗변과 아랫변은 <b>더한 뒤</b> 높이를 곱하고 2로 나눠요.', '비스듬한 옆변은 높이가 아니에요. 평행한 두 변 사이의 수직 거리가 높이예요.')
    }),
    prob: (M) => {
      const { a, B, H, S, c } = M, w = a + B;
      const wr = [[w * H, '2로 나누지 않았어요. 사다리꼴은 평행사변형의 절반이에요.'], [(w * (c || H + 1)) / 2, '옆변은 높이가 아니에요. 평행한 두 변에 수직인 높이를 써요.'], [(B * H) / 2, '윗변을 빼먹었어요. (윗변+아랫변)을 써요.'], [(w / 2), '높이 H를 곱하지 않았어요.']];
      return {
        tag: c ? '함정 · 사다리꼴의 넓이 (옆변은 높이가 아니에요)' : '사다리꼴의 넓이', key: `${a}-${B}-${H}-${M.p}`,
        stem: c ? `윗변이 ${a} cm, 아랫변이 ${B} cm, 높이가 ${H} cm, 옆변이 ${c} cm인 사다리꼴의 넓이는?` : `윗변이 ${a} cm, 아랫변이 ${B} cm, 높이가 ${H} cm인 사다리꼴의 넓이는?`,
        choices: mkChoices(S, wr, { ...cm2, pad: pad8(S) })
      };
    },
    verify: (s) => { const M = trap.model(s); return { geo: area2(trap.geo(M).trap), formula: M.S }; }
  };

  /* ====================================================================== 5. 마름모 */
  const rhomb = {
    id: 'a5-rhomb', title: '마름모의 넓이', short: '마름모',
    question: '마름모의 두 대각선을 가로, 세로로 하는 직사각형을 그리면 마름모는 그 직사각형의 얼마일까?',
    ctl: ['a5X', 'a5Y', 'a5T'], anim: { key: 'a5T', dur: 6, label: '바깥 삼각형 돌려 넣기', start: 0 },
    init: (s) => { s.a5X = 8; s.a5Y = 6; s.a5T = 0; },
    reroll: (s) => { const pairs = []; for (const x of range(4, 12)) for (const y of range(3, 10)) if ((x * y) % 2 === 0 && x !== y) pairs.push([x, y]); const q = rpick(pairs, pairs.find((p) => p[0] === s.a5X && p[1] === s.a5Y)); s.a5X = q[0]; s.a5Y = q[1]; s.a5T = 0; },
    model: (s) => { const X = clamp(Math.round(s.a5X), 3, 12), Y = clamp(Math.round(s.a5Y), 2, 10); return { X, Y, R: X * Y, A: (X * Y) / 2 }; },
    geo: (M) => { const x = M.X / 2, y = M.Y / 2; return { rh: [pt(x, 0), pt(0, y), pt(-x, 0), pt(0, -y)], corners: [[1, -1], [-1, -1], [-1, 1], [1, 1]].map(([qx, qy]) => ({ tri: [pt(qx * x, 0), pt(0, qy * y), pt(qx * x, qy * y)], c: pt(qx * x / 2, qy * y / 2) })) }; },
    draw(b, s, M, C) {
      const { X, Y, R, A } = M, g = rhomb.geo(M), x = X / 2, y = Y / 2, O = pt(0, 0);
      FIT(b, { x0: -x, x1: x, y0: -y, y1: y }, { b: 96, t: 50, r: 66 });
      const t = C.problem ? 0 : C.t, showRect = !C.problem;
      if (showRect) poly(b, [pt(-x, -y), pt(x, -y), pt(x, y), pt(-x, y)], 'muted', 2.4, { dash: [7, 6] });
      fillPoly(b, g.rh, 'sky', 0.24); poly(b, g.rh, 'ink', 3.6);
      line(b, pt(-x, 0), pt(x, 0), 'green', 2.8, { dash: [7, 5] }); line(b, pt(0, -y), pt(0, y), 'green', 2.8, { dash: [7, 5] });
      b.right(O, pt(x, 0), pt(0, -y), { size: 11, color: 'amber' });
      if (!C.problem && (t > 0.001 || (C.review && C.step === 1))) {
        const al = seg01(t, 0, 0.2), ang = Math.PI * seg01(t, 0.3, 1);
        g.corners.forEach((cn) => {
          const cp = cn.tri.map((v) => rotAbout(v, cn.c, ang));
          fillPoly(b, cp, 'rose', 0.34 * Math.max(al, C.review && C.step === 1 ? 1 : 0)); poly(b, cp, 'rose', 2.8, { alpha: Math.max(al, C.review && C.step === 1 ? 1 : 0) });
        });
      }
      dim(b, pt(-x, y), pt(x, y), `대각선 ${X}cm`, { ref: O, color: 'green', off: 22 });
      dim(b, pt(x, -y), pt(x, y), `${Y}cm`, { ref: O, color: 'green', off: 30 });
      if (C.problem) { T(b, pt(0, -y * 0.45), '넓이 ?', { size: 20, color: 'amber' }); return; }
      const done = C.review ? C.step >= 3 : t > 0.999;
      if (done) foot(b, pt(0, y), `직사각형 ${X}×${Y} = ${R}의 절반 = ${num(A)}cm²`, 'green', 58);
      else foot(b, pt(0, y), C.review ? `가로 ${X}cm × 세로 ${Y}cm 직사각형` : '마름모의 넓이 = ?', 'amber', 58);
    },
    stepT: (n) => (n <= 1 ? 0.0 : n === 2 ? 1 : 1),
    steps: (M) => [
      `마름모의 두 대각선(${M.X}cm, ${M.Y}cm)은 수직으로 만나요. 두 대각선의 길이를 가로, 세로로 하는 직사각형을 그려요.`,
      '바깥의 분홍 삼각형 4개는 제자리에서 180° 돌리면 마름모 안쪽 삼각형과 꼭 겹쳐요(모양과 크기가 같아요).',
      `마름모의 넓이는 직사각형 ${M.X}×${M.Y}=${M.R}cm²의 절반이므로 $\\frac{1}{2}$×${M.X}×${M.Y}=${num(M.A)}cm²예요.`
    ],
    view: (M) => ({
      guide: '▶를 누르면 <b>분홍 삼각형 4개</b>가 제자리에서 돌아 마름모 안으로 들어가요. 두 <b>대각선</b>의 길이는 막대로 바꿔요.',
      readouts: [rd('한 대각선', `${M.X}cm`, 'green'), rd('다른 대각선', `${M.Y}cm`, 'green'), rd('넓이', `${num(M.A)}cm²`, 'green', `${M.X} × ${M.Y} ÷ 2`)],
      formula: `<p>(마름모의 넓이) $=\\dfrac{1}{2}\\times(\\text{한 대각선})\\times(\\text{다른 대각선})$</p><p>$=\\dfrac{1}{2}\\times${M.X}\\times${M.Y}=${G.tx(M.A)}\\ (\\text{cm}^2)$</p>`,
      rule: '마름모의 넓이 = $\\frac{1}{2}$ × (한 대각선) × (다른 대각선)',
      notes: notes('두 대각선을 곱한 뒤 <b>2로 나눠요</b>. (직사각형의 절반이에요.)', '마름모의 한 변의 길이는 넓이를 구하는 데 필요하지 않아요.')
    }),
    prob: (M) => {
      const { X, Y, R, A } = M;
      return {
        tag: '마름모의 넓이', key: `${X}x${Y}`,
        stem: `두 대각선의 길이가 ${X} cm, ${Y} cm인 마름모의 넓이는?`,
        choices: mkChoices(A, [[R, '2로 나누지 않았어요. 마름모는 직사각형의 절반이에요.'], [X + Y, '더하지 않고 곱해서 2로 나눠요.'], [R / 4, '2로 한 번만 나눠요.'], [2 * (X + Y), '둘레처럼 계산했어요. 넓이는 두 대각선의 곱의 절반이에요.']], { ...cm2, pad: pad8(A) })
      };
    },
    verify: (s) => { const M = rhomb.model(s); return { geo: area2(rhomb.geo(M).rh), formula: M.A }; }
  };

  /* ====================================================================== 6. 높이가 도형 밖에 있는 삼각형 */
  const obt = {
    id: 'a6-obt', title: '높이가 밖에 있는 삼각형', short: '높이가 밖에',
    question: '꼭짓점 A를 옆으로 많이 옮기면 높이를 나타내는 선이 삼각형 밖으로 나가요. 이때도 넓이는 $\\frac{1}{2}$×밑변×높이일까?',
    ctl: ['a6B', 'a6H', 'a6P'],
    init: (s) => { s.a6B = 6; s.a6H = 4; s.a6P = -3; },
    reroll: (s) => {
      const cand = [];
      for (const B of range(3, 8)) for (const t of [[3, 4, 5], [4, 3, 5]]) { cand.push({ B, h: t[1], p: -t[0] }); cand.push({ B, h: t[1], p: B + t[0] }); }
      const cur = cand.find((c) => c.B === s.a6B && c.h === s.a6H && c.p === s.a6P);
      const q = rpick(cand, cur); s.a6B = q.B; s.a6H = q.h; s.a6P = q.p;
    },
    model: (s) => { const B = clamp(Math.round(s.a6B), 3, 8), H = clamp(Math.round(s.a6H), 2, 8), p = clamp(Math.round(s.a6P), -4, B + 4); const out = p < 0 || p > B; const side = p < 0 ? Math.hypot(p, H) : p > B ? Math.hypot(p - B, H) : null; const c = side != null && Math.abs(side - Math.round(side)) < 1e-9 ? Math.round(side) : null; return { B, H, p, A: (B * H) / 2, out, c }; },
    geo: (M) => ({ tri: [pt(0, 0), pt(M.B, 0), pt(M.p, -M.H)] }),
    draw(b, s, M, C) {
      const { B, H, p, A, out, c } = M, [Bv, Cv, Av] = obt.geo(M).tri;
      // 보기: 풀이 화면은 점 A를 끌 때 그림이 흔들리지 않게 밑변(B)에만 맞추고, 문제 화면은 그림에 꼭 맞춥니다.
      const bx = C.problem ? { x0: Math.min(0, p), x1: Math.max(B, p), y0: -H, y1: 0 } : { x0: -4.6, x1: B + 4.6, y0: -H, y1: 0 };
      FIT(b, bx, { b: 84, t: 34, l: C.problem ? 30 : 72, r: C.problem ? 30 : 72 });
      const xa = bx.x0 - (C.problem ? 1 : 0.2), xb = bx.x1 + (C.problem ? 1 : 0.2);
      line(b, pt(xa, -H), pt(xb, -H), 'muted', 2, { dash: [6, 5], alpha: 0.9 });
      const pf = p < B / 2 ? 0.94 : 0.06;
      par(b, pt(xa, -H), pt(xb, -H), 2, 'green', pf); par(b, pt(xa, 0), pt(xb, 0), 2, 'green', pf);
      line(b, pt(xa, 0), pt(xb, 0), 'muted', 2, { dash: [6, 5], alpha: 0.9 });
      fillPoly(b, [Bv, Cv, Av], 'sky', 0.24); poly(b, [Bv, Cv, Av], 'ink', 3.6);
      const side = C.problem ? (p < 0 ? 1 : p > B ? -1 : (p < B / 2 ? 1 : -1)) : (p < 0 ? -1 : p > B ? 1 : (p < B / 2 ? 1 : -1));
      hgtTo(b, Av, Bv, Cv, { label: C.problem && c ? `${H}cm` : `높이 ${H}cm`, side, at: C.problem && c ? 0.85 : 0.5, gap: 12 });
      dim(b, Bv, Cv, `밑변 ${B}cm`, { ref: pt(B / 2, -H), color: 'sky' });
      T(b, Av, 'A', { dy: -19, size: 18 }); T(b, Bv, 'B', { dx: -14, dy: 15, size: 18 }); T(b, Cv, 'C', { dx: 14, dy: 15, size: 18 }); T(b, pt(p, 0), 'H', { dx: p < B / 2 ? -14 : 14, dy: 15, size: 18, color: 'amber' });
      if (C.problem) {
        if (c) { // 옆변은 분홍으로 칠하고, 삼각형 안쪽에 길이를 적습니다(높이 글자와 겹치지 않게)
          const e0 = p < 0 ? Bv : Cv, mm0 = mid(e0, Av), cen = G.centroid([Bv, Cv, Av]), k = b.k || 40, u = G.unit(sub(cen, mm0));
          line(b, e0, Av, 'rose', 6, { alpha: 0.85 }); T(b, mm0, `${c}cm`, { dx: u.x * 30, dy: u.y * 26, size: 18, color: 'rose' });
        }
        foot(b, pt((Math.max(B, p) + Math.min(0, p)) / 2, 0), '넓이 = ? cm²', 'amber', 58);
        return;
      }
      foot(b, pt(Math.min(0, p) / 2 + Math.max(B, p) / 2, 0), C.review && C.step < 3 ? (C.step === 1 ? '높이는 밑변의 연장선에 내려요' : `밑변 ${B}cm, 높이 ${H}cm`) : `넓이 = ${HALF}×${B}×${H} = ${num(A)}cm²`, C.review && C.step < 3 ? 'amber' : 'green', 58);
      handle(b, C, 'a', Av, '꼭짓점 A를 가로로 끌기', (w) => { s.a6P = clamp(Math.round(w.x), -4, B + 4); });
    },
    steps: (M) => [
      M.out ? `꼭짓점 A에서 밑변 BC를 늘인 직선에 수선을 내려요. 수선의 발 H가 밑변 밖에 있어도 AH가 높이예요.` : '꼭짓점 A에서 밑변 BC에 수선을 내려요. 수선의 발 H는 BC 위에 있어요.',
      `밑변 BC=${M.B}cm, 높이 AH=${M.H}cm예요.`,
      `넓이는 $\\frac{1}{2}$×${M.B}×${M.H}=${num(M.A)}cm²예요. 꼭짓점 A를 평행선 위에서 옮겨도 밑변과 높이가 같으면 넓이가 같아요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 A</b>를 가로로 끌어 보세요. 점이 밑변 밖으로 나가면 높이(점선)도 삼각형 <b>밖</b>에 그려져요. 그래도 밑변과 높이가 그대로이면 넓이는 같아요.',
      readouts: [rd('밑변 BC', `${M.B}cm`, 'sky'), rd('높이 AH', `${M.H}cm`, 'amber', M.out ? '삼각형 밖에 있어요' : '삼각형 안에 있어요'), rd('넓이', `${num(M.A)}cm²`, 'green', `${M.B} × ${M.H} ÷ 2`)],
      formula: `<p>(삼각형의 넓이) $=\\dfrac{1}{2}\\times${M.B}\\times${M.H}=${G.tx(M.A)}\\ (\\text{cm}^2)$</p>`,
      rule: '높이는 밑변을 늘인 직선에 내린 수선의 길이예요. 넓이 = $\\frac{1}{2}$ × 밑변 × 높이',
      notes: notes('높이는 <b>밑변에 수직</b>인 선분의 길이예요. 비스듬한 옆변의 길이를 높이로 쓰면 안 돼요.', '꼭짓점이 두 평행선 중 위쪽 선 위에 있으면, 어디에 있어도 높이는 두 평행선 사이의 거리로 같아요.')
    }),
    prob: (M) => {
      const { B, H, A, c } = M;
      const wr = [[(B * (c || H + 2)) / 2, '옆변은 높이가 아니에요. 밑변에 수직인 AH가 높이예요.'], [B * H, '2로 나누지 않았어요. 삼각형의 넓이는 $\\frac{1}{2}$×밑변×높이예요.'], [(B + H) / 2, '밑변과 높이는 더하지 않고 곱해서 2로 나눠요.'], [(c || H + 2) * H / 2, '밑변은 BC예요. 옆변이 아니에요.']];
      const nm = M.p < 0 ? 'AB' : 'AC', ft = M.out ? 'BC의 연장선' : 'BC';
      return {
        tag: c ? '함정 · 둔각삼각형의 넓이 (옆변은 높이가 아니에요)' : M.out ? '높이가 밖에 있는 삼각형의 넓이' : '삼각형의 넓이', key: `${B}-${H}-${M.p}`,
        stem: c ? `둔각삼각형 ABC에서 밑변 BC의 길이가 ${B} cm, 꼭짓점 A에서 ${ft}에 내린 수선 AH의 길이가 ${H} cm, 옆변 ${nm}의 길이가 ${c} cm일 때, 삼각형 ABC의 넓이는?` : `삼각형 ABC에서 밑변 BC의 길이가 ${B} cm, 꼭짓점 A에서 ${ft}에 내린 수선 AH의 길이가 ${H} cm일 때, 삼각형 ABC의 넓이는?`,
        choices: mkChoices(A, wr, { ...cm2, pad: pad8(A) })
      };
    },
    verify: (s) => { const M = obt.model(s); return { geo: area2(obt.geo(M).tri), formula: M.A }; }
  };

  const PARAMS = {
    a1W: P('가로', 1, 12, 1, 6, { color: 'sky', format: (v) => `${v}cm` }),
    a1H: P('세로', 1, 8, 1, 4, { color: 'sky', format: (v) => `${v}cm` }),
    a1T: P('세어 본 줄', 0, 1, 0.01, 1, { color: 'amber', hint: '▶를 누르거나 막대를 끌면 한 줄씩 세어요', format: (v) => Math.round(v * 100) + '%' }),
    a2B: P('밑변', 6, 12, 1, 8, { color: 'sky', format: (v) => `${v}cm` }),
    a2H: P('높이', 2, 8, 1, 4, { color: 'amber', format: (v) => `${v}cm` }),
    a2S: P('옆으로 민 길이', 0, 6, 1, 3, { color: 'green', hint: '윗변을 옆으로 밀어 기울기를 바꿔요(밑변·높이는 그대로)', format: (v) => `${v}cm` }),
    a2T: P('옮기기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 조각이 가로로 밀려 가요', format: (v) => Math.round(v * 100) + '%' }),
    a3B: P('밑변', 6, 12, 1, 8, { color: 'sky', format: (v) => `${v}cm` }),
    a3H: P('높이', 2, 8, 1, 4, { color: 'amber', format: (v) => `${v}cm` }),
    a3P: P('꼭짓점의 위치', 0, 6, 1, 3, { color: 'green', hint: '꼭짓점을 가로로 옮겨요(밑변·높이는 그대로)', format: (v) => `${v}cm` }),
    a3T: P('복사본 붙이기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 복사본이 돌고 밀려 와요', format: (v) => Math.round(v * 100) + '%' }),
    a4A: P('윗변', 2, 6, 1, 4, { color: 'sky', format: (v) => `${v}cm` }),
    a4B: P('아랫변', 6, 12, 1, 8, { color: 'sky', format: (v) => `${v}cm` }),
    a4H: P('높이', 2, 8, 1, 4, { color: 'amber', format: (v) => `${v}cm` }),
    a4P: P('윗변의 위치', 0, 6, 1, 1, { color: 'green', hint: '윗변을 옆으로 밀어요(길이·높이는 그대로)', format: (v) => `${v}cm` }),
    a4T: P('복사본 붙이기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 복사본이 돌고 밀려 와요', format: (v) => Math.round(v * 100) + '%' }),
    a5X: P('한 대각선', 3, 12, 1, 8, { color: 'green', format: (v) => `${v}cm` }),
    a5Y: P('다른 대각선', 2, 10, 1, 6, { color: 'green', format: (v) => `${v}cm` }),
    a5T: P('삼각형 돌려 넣기', 0, 1, 0.01, 0, { color: 'amber', hint: '▶를 누르거나 막대를 끌면 분홍 삼각형이 제자리에서 돌아요', format: (v) => Math.round(v * 100) + '%' }),
    a6B: P('밑변', 3, 8, 1, 6, { color: 'sky', format: (v) => `${v}cm`, onInput: (st) => { st.a6P = clamp(Math.round(st.a6P), -4, Math.round(st.a6B) + 4); } }),
    a6H: P('높이', 2, 8, 1, 4, { color: 'amber', format: (v) => `${v}cm` }),
    a6P: P('꼭짓점 A의 위치', -4, 12, 1, -3, { color: 'green', hint: '0은 점 B 바로 위, 밑변의 길이는 점 C 바로 위예요', format: (v) => `${v}cm` })
  };

  G.register(10, 't1', '① 기본 넓이 공식', '기본 넓이 공식', PARAMS, [rect, para, tri, trap, rhomb, obt]);
})();
