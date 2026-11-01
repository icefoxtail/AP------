/* ==========================================================================
   중1 · 작도와 합동 — 탭 ② 「삼각형이 만들어질 조건」 (t2.js, order 20) — 장면 3개
   · c2-1 막대 세 개로 삼각형     · 세 막대의 길이 조절 · 막대가 경첩에서 제자리 회전해 닫히면 삼각형
   · c2-2 x가 미지수              · 두 변 a, b 와 x · 수직선에서 경우를 나누어 x의 범위 구하기
   · c2-3 막대 네 개에서 셋 고르기 · 만들 수 있는 조합의 개수 세기
   (한 변의 길이) < (나머지 두 변의 길이의 합) 이어야 삼각형이 만들어집니다. 값은 모두 지금의 길이로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CN;
  if (!G) return;
  const { DEG, clamp, ease, seg01, pt, add, sub, mul, unit, mid, dist, polar, pick, rint, T, tick, line, fit, P, mkChoices, mkTextChoices, seeded, shuffle, rd, notes, fmtN, ol, triSSS, tagOut, sideTag, vtx, fillPoly, poly } = G;
  const pctF = (v) => Math.round(v * 100) + '%';
  const lenF = (v) => fmtN(v) + ' cm';
  const cmTex = (v) => `${fmtN(v)}\\text{ cm}`;
  const numTex = (v) => String(v);
  const jos = (n, a, b) => ([0, 1, 3, 6, 7, 8].includes(Math.abs(Math.round(n)) % 10) ? a : b); // 받침 있는 숫자(영 일 삼 육 칠 팔 → 이) / 없으면 가

  const PARAMS = {
    cnA: P('막대 a', 1, 12, 1, 4, { color: 'sky', format: lenF }),
    cnB: P('막대 b', 1, 12, 1, 6, { color: 'green', format: lenF }),
    cnC: P('막대 c', 1, 12, 1, 9, { color: 'amber', format: lenF }),
    cnTa: P('막대 세워 닫기', 0, 1, 0.01, 1, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 두 막대가 경첩에서 일어나요', format: pctF }),
    cnXa: P('변 a', 2, 10, 1, 7, { color: 'sky', format: lenF }),
    cnXb: P('변 b', 2, 10, 1, 4, { color: 'green', format: lenF }),
    cnXx: P('변 x', 1, 20, 1, 6, { color: 'rose', hint: '수직선 위의 점 x를 끌어도 돼요', format: (v) => fmtN(v) + ' cm' }),
    cnQ1: P('막대 1', 2, 12, 1, 3, { color: 'sky', format: lenF }),
    cnQ2: P('막대 2', 2, 12, 1, 5, { color: 'green', format: lenF }),
    cnQ3: P('막대 3', 2, 12, 1, 7, { color: 'amber', format: lenF }),
    cnQ4: P('막대 4', 2, 12, 1, 9, { color: 'rose', format: lenF }),
    cnQt: P('막대 세워 닫기', 0, 1, 0.01, 1, { color: 'rose', hint: '▶를 누르면 네 조합의 막대가 한꺼번에 일어나요', format: pctF })
  };
  const can = (x, y, z) => { const m = Math.max(x, y, z); return m < x + y + z - m; };

  /* ====================================================================== 경첩 그리기 (가장 긴 막대 = 밑변) */
  // items: [{v, n, c}] 세 막대. opts: ox, oy(위치), sc(배율), nums(막대 옆 길이 글자), name(이름 붙이기), tt(0~1)
  function hinge(b, items, tt, o = {}) {
    const srt = items.slice().sort((x, y) => x.v - y.v), p = srt[0], q = srt[1], Lb = srt[2];
    const sc = o.sc || 1, ox = o.ox || 0, oy = o.oy || 0;
    const ok = Lb.v < p.v + q.v;
    const A = pt(ox, oy), B = pt(ox + Lb.v * sc, oy);
    const al = ok ? Math.acos(clamp((p.v * p.v + Lb.v * Lb.v - q.v * q.v) / (2 * p.v * Lb.v), -1, 1)) / DEG : 38;
    const be = ok ? Math.acos(clamp((q.v * q.v + Lb.v * Lb.v - p.v * p.v) / (2 * q.v * Lb.v), -1, 1)) / DEG : 38;
    const tp = polar(A, p.v * sc, -al * tt), tq = polar(B, q.v * sc, -180 + be * tt);
    const w = o.w || 7;
    line(b, A, B, Lb.c || 'amber', w, { alpha: 0.95 });
    line(b, A, tp, p.c || 'sky', w, { alpha: 0.95 });
    line(b, B, tq, q.c || 'green', w, { alpha: 0.95 });
    [A, B].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
    const closed = ok && tt >= 0.999;
    b.point(tp, { color: closed ? 'green' : p.c || 'sky', r: closed ? 6 : 4.5 });
    if (!closed) b.point(tq, { color: q.c || 'green', r: 4.5 });
    if (!ok && tt > 0.05) line(b, tp, tq, 'rose', 2.2, { dash: [6, 5] });
    if (o.nums) {
      const cen = pt((A.x + B.x + (tp.x + tq.x) / 2) / 3, (A.y + B.y + (tp.y + tq.y) / 2) / 3 - 0.2 * sc);
      const sz = o.numSize || 16;
      const lab = (x) => (o.name ? `${x.n}=${fmtN(x.v)}` : fmtN(x.v));
      if (tt > 0.2) {
        sideTag(b, A, tp, cen, lab(p), { color: p.c || 'sky', size: sz, gap: 12 });
        sideTag(b, B, tq, cen, lab(q), { color: q.c || 'green', size: sz, gap: 12 });
      }
      T(b, mid(A, B), lab(Lb), { dy: 18, size: sz, color: Lb.c || 'amber' });
    }
    return { p, q, L: Lb, ok, A, B, tp, tq };
  }
  G.hinge = hinge;
  const verdictText = (ok) => (ok ? '삼각형을 만들 수 있어요' : '삼각형을 만들 수 없어요');

  /* ====================================================================== 1. 막대 세 개로 삼각형 */
  const sticks = {
    id: 'c2-1', title: '막대 세 개로 삼각형', short: '막대 세 개',
    question: '막대 세 개로 삼각형을 만들려면 길이가 어떤 관계여야 할까?',
    ctl: ['cnA', 'cnB', 'cnC', 'cnTa'], anim: { key: 'cnTa', dur: 4, label: '막대 세워 보기', start: 1 },
    init: (s) => { s.cnA = 4; s.cnB = 6; s.cnC = 9; s.cnTa = 1; s.cnPk = { a: 5, b: 7, kind: 0 }; },
    reroll: (s) => { s.cnPk = { a: rint(3, 7), b: rint(3, 7), kind: s.cnPk && s.cnPk.kind ? 0 : 1 }; if (s.cnPk.a === s.cnPk.b) s.cnPk.b += s.cnPk.a > 3 ? -1 : 1; },
    model: (s) => {
      const it = [{ n: 'a', v: s.cnA, c: 'sky' }, { n: 'b', v: s.cnB, c: 'green' }, { n: 'c', v: s.cnC, c: 'amber' }];
      const srt = it.slice().sort((x, y) => x.v - y.v), L = srt[2].v, sum = srt[0].v + srt[1].v;
      return { it, srt, L, sum, ok: L < sum, pk: s.cnPk || { a: 5, b: 7, kind: 0 } };
    },
    draw(b, s, M, C) {
      const { L, sum, ok } = M;
      if (C.problem) { drawStickProblem(b, M); return; }
      const cx = L / 2;
      fit(b, { x0: cx - 6.6, x1: cx + 6.6, y0: -6.1, y1: 3.4 }, { t: 34, b: 34 });
      const tt = C.review ? (C.step >= 3 ? 1 : 0) : C.t;
      // 밑변 강조(1단계) 후 경첩
      const items = M.srt.map((x) => ({ ...x, c: x === M.srt[2] ? 'amber' : x.c }));
      const h = hinge(b, items, C.review ? (C.step >= 3 ? 1 : 0.0) : tt, { nums: true, name: true });
      // 길이 비교 줄 (작은 두 막대를 이어 붙이기)
      const y0 = 1.7, p = M.srt[0], q = M.srt[1];
      if (!C.review || C.step >= 2) {
        line(b, pt(0, y0), pt(p.v, y0), 'sky', 7, { alpha: 0.95 });
        line(b, pt(p.v, y0), pt(sum, y0), 'green', 7, { alpha: 0.95 });
        b.point(pt(p.v, y0), { color: 'ink', r: 3.5 });
        line(b, pt(L, -0.3), pt(L, y0 + 0.5), ok ? 'green' : 'rose', 2, { dash: [5, 5] });
        T(b, pt(sum / 2, y0), `나머지 두 막대의 합 = ${fmtN(p.v)}+${fmtN(q.v)} = ${fmtN(sum)}`, { dy: 24, size: b.W < 560 ? 14 : 16, color: ok ? 'green' : 'rose' });
        T(b, pt(sum / 2, y0), `가장 긴 막대 = ${fmtN(L)}  ${ok ? '<' : '≥'}  ${fmtN(sum)}`, { dy: 48, size: b.W < 560 ? 14 : 16, color: ok ? 'green' : 'rose' });
      }
      if (C.txt && (!C.review || C.step >= 3)) T(b, pt(cx, -6.1), ok ? verdictText(true) + ' ✓' : verdictText(false) + ' ✗', { dy: 4, size: 18, color: ok ? 'green' : 'rose' });
      else if (C.txt && C.review && C.step === 1) T(b, pt(cx, -6.1), `가장 긴 막대: ${M.srt[2].n} = ${fmtN(L)}`, { dy: 4, size: 18, color: 'amber' });
    },
    stepT: (n) => (n >= 3 ? 1 : 0),
    steps: (M) => [
      `세 막대 중 가장 긴 막대를 찾아요. 가장 긴 막대는 $${M.srt[2].n}=${fmtN(M.L)}$ cm예요.`,
      `나머지 두 막대의 길이의 합을 구해요. $${fmtN(M.srt[0].v)}+${fmtN(M.srt[1].v)}=${fmtN(M.sum)}$ (cm)`,
      `(가장 긴 막대) < (나머지 두 막대의 합)인지 확인해요. $${fmtN(M.L)}${M.ok ? '\\lt ' : '\\ge '}${fmtN(M.sum)}$ 이므로 삼각형을 ${M.ok ? '만들 수 있어요' : '만들 수 없어요'}.`
    ],
    view: (M, C) => ({
      guide: '막대 <b>a, b, c</b>의 길이를 바꾸고 ▶를 눌러 보세요. 가장 긴 막대를 밑변으로 놓고, 나머지 두 막대를 경첩에서 세워요. 두 막대의 끝이 만나면 삼각형이에요.',
      readouts: [rd('가장 긴 막대', `${fmtN(M.L)} cm`, 'amber'), rd('나머지 두 막대의 합', `${fmtN(M.sum)} cm`, M.ok ? 'green' : 'rose'), rd('삼각형', M.ok ? '만들 수 있어요' : '만들 수 없어요', M.ok ? 'green' : 'rose', `${fmtN(M.L)} ${M.ok ? '<' : '≥'} ${fmtN(M.sum)}`, null, true)],
      status: M.ok ? { tone: 'ok', text: '삼각형이 만들어져요' } : { tone: 'warn', text: M.L === M.sum ? '일직선이 돼요 — 삼각형이 아니에요' : '두 막대가 모자라서 닿지 않아요' },
      formula: `<p>(가장 긴 변) ${M.ok ? '<' : '≥'} (나머지 두 변의 합)</p><p>$${fmtN(M.L)}${M.ok ? '\\lt ' : '\\ge '}${fmtN(M.srt[0].v)}+${fmtN(M.srt[1].v)}=${fmtN(M.sum)}$</p>`,
      rule: '삼각형이 되려면 (가장 긴 변의 길이) < (나머지 두 변의 길이의 합)',
      notes: notes('합이 가장 긴 변과 <b>같아도</b> 삼각형이 되지 않아요. 두 막대가 일직선으로 놓여요.', '세 변 중 아무 변이나 골라 비교하면 안 돼요. 꼭 <b>가장 긴 변</b>과 나머지 두 변의 합을 비교해요.')
    }),
    prob: (M) => {
      const { a, b: bb, kind } = M.pk, lo = Math.abs(a - bb), hi = a + bb;
      const rnd = seeded(`s${a}.${bb}.${kind}`);
      const valid = [], inval = [];
      for (let x = 1; x <= 18; x++) (x > lo && x < hi ? valid : inval).push(x);
      const pickN = (arr, n) => shuffle(arr, rnd).slice(0, n);
      const mk = (v, ok, hint) => ({ t: cmTex(v), p: lenF(v), ok, hint });
      let choices;
      if (kind === 0) { // 될 수 없는 것
        const bad = pickN(inval, 1)[0];
        choices = [mk(bad, true, '')].concat(pickN(valid, 4).map((v) => mk(v, false, `${fmtN(v)} cm 막대로는 삼각형이 만들어져요. 될 수 없는 것을 찾아야 해요.`)));
      } else {
        const good = pickN(valid, 1)[0];
        choices = [mk(good, true, '')].concat(pickN(inval, 4).map((v) => mk(v, false, v >= hi ? `${fmtN(v)} cm가 가장 긴 변이 되는데 나머지 두 변의 합 ${hi} cm보다 크거나 같아요.` : `나머지 두 막대 중 긴 것(${Math.max(a, bb)} cm)이 가장 긴 변이 되는데, 다른 두 변의 합이 모자라요.`)));
      }
      choices.sort((x, y) => parseFloat(x.p) - parseFloat(y.p));
      return {
        tag: '삼각형의 세 변의 길이', key: `a${a}b${bb}k${kind}`,
        stem: kind === 0 ? `길이가 ${a} cm, ${bb} cm인 두 막대가 있다. 나머지 한 막대의 길이가 다음 중 하나일 때, 세 막대로 삼각형을 만들 수 <b>없는</b> 것은?` : `길이가 ${a} cm, ${bb} cm인 두 막대가 있다. 나머지 한 막대의 길이가 다음 중 하나일 때, 세 막대로 삼각형을 만들 수 <b>있는</b> 것은?`,
        html: kind === 0 ? `길이가 ${a} cm, ${bb} cm인 두 막대가 있다. 나머지 한 막대의 길이가 다음과 같을 때, 세 막대로 삼각형을 만들 수 <b>없는</b> 것은?` : `길이가 ${a} cm, ${bb} cm인 두 막대가 있다. 나머지 한 막대의 길이가 다음과 같을 때, 세 막대로 삼각형을 만들 수 <b>있는</b> 것은?`,
        choices
      };
    }
  };
  function drawStickProblem(b, M) {
    const { a, b: bb } = M.pk, W = Math.max(a, bb) + 3;
    fit(b, { x0: -1, x1: Math.max(a + bb, 12) + 0.5, y0: -0.6, y1: 3.6 }, { t: 40, b: 50 });
    line(b, pt(0, 0), pt(a, 0), 'sky', 8, { alpha: 0.95 });
    line(b, pt(0, 1.6), pt(bb, 1.6), 'green', 8, { alpha: 0.95 });
    line(b, pt(0, 3.2), pt(5, 3.2), 'rose', 6, { dash: [10, 8], alpha: 0.8 });
    [[a, 0, 'sky', `${a} cm`], [bb, 1.6, 'green', `${bb} cm`]].forEach(([v, y, c, t]) => { b.point(pt(0, y), { color: c, r: 5 }); b.point(pt(v, y), { color: c, r: 5 }); T(b, pt(v, y), t, { dx: 12, dy: 0, align: 'left', size: 17, color: c }); });
    T(b, pt(5, 3.2), '? cm', { dx: 12, dy: 0, align: 'left', size: 17, color: 'rose' });
  }

  /* ====================================================================== 2. x가 미지수 */
  const xr = (a, b2) => ({ lo: Math.abs(a - b2), hi: a + b2, mx: Math.max(a, b2), mn: Math.min(a, b2) });
  const tickStep = (b, span) => { const k = Math.max(1, (b.W - 40) / (span + 2)); return k >= 28 ? 1 : k >= 14 ? 2 : 5; };
  const xs = {
    id: 'c2-2', title: 'x가 미지수일 때', short: 'x의 범위',
    question: '세 변의 길이가 a, b, x인 삼각형이 만들어지려면 x는 어떤 범위여야 할까?',
    ctl: ['cnXa', 'cnXb', 'cnXx'],
    init: (s) => { s.cnXa = 7; s.cnXb = 4; s.cnXx = 6; s.cnPk = { a: 3, b: 7, kind: 0 }; },
    reroll: (s) => { s.cnPk = { a: rint(3, 9), b: rint(3, 9), kind: ((s.cnPk && s.cnPk.kind) + 1) % 3 }; if (s.cnPk.a === s.cnPk.b) s.cnPk.b += 1; },
    model: (s) => { const a = s.cnXa, b2 = s.cnXb, r = xr(a, b2), x = s.cnXx; return { a, b: b2, ...r, x, ok: x > r.lo && x < r.hi, cnt: r.hi - r.lo - 1, pk: s.cnPk || { a: 3, b: 7, kind: 0 } }; },
    draw(b, s, M, C) {
      if (C.problem) { drawXProblem(b, M); return; }
      const { a, b: b2, lo, hi, mx, mn, x } = M, span = hi + 2;
      fit(b, { x0: -1, x1: span + 0.6, y0: -6.2, y1: 1.6 }, { t: 24, b: 40 });
      const ts = tickStep(b, span), st = C.review ? C.step : 3, rows = [[-4.9, 'sky'], [-3.3, 'rose'], [-1.7, 'green']];
      // 수직선
      line(b, pt(-0.6, 0), pt(span + 0.2, 0), 'ink', 2.6);
      for (let v = 0; v <= span; v += ts) { line(b, pt(v, -0.12), pt(v, 0.12), 'ink', 2); T(b, pt(v, 0), String(v), { dy: 18, size: 13, color: 'muted' }); }
      const bar = (y, x0, x1, c, openL, openR, label, sub1) => {
        line(b, pt(x0, y), pt(x1, y), c, 8, { alpha: 0.9 });
        b.point(pt(x0, y), { color: c, r: 5.5, hollow: openL }); b.point(pt(x1, y), { color: c, r: 5.5, hollow: openR });
        T(b, pt(-0.6, y), label, { dx: 0, dy: -22, size: 14, color: c, align: 'left' });
      };
      const sz = b.W < 560 ? 13 : 15;
      // 경우 ① : x 가 가장 긴 변
      if (st >= 1) {
        bar(-4.9, mx, hi, 'sky', false, true, st >= 2 ? `① x가 가장 긴 변 → ${fmtN(mx)} ≤ x < ${hi}` : '① x가 가장 긴 변일 때', '');
        bar(-3.3, lo, mx, 'rose', true, true, st >= 2 ? `② 아닐 때 → ${lo} < x < ${fmtN(mx)}` : '② x가 가장 긴 변이 아닐 때', '');
      }
      if (st >= 3) {
        bar(-1.7, lo, hi, 'green', true, true, `x의 범위: ${lo} < x < ${hi}`, '');
        for (let v = lo + 1; v < hi; v++) b.point(pt(v, -1.7), { color: 'ink', r: 2.6 });
      }
      // 점 x
      if (!C.review) {
        const col = M.ok ? 'green' : 'rose';
        line(b, pt(x, -5.4), pt(x, 0), col, 1.8, { dash: [4, 5] });
        b.handle('x', pt(x, 0), { color: 'rose', r: 8, ariaLabel: 'x 끌기', drag: (w) => { s.cnXx = clamp(Math.round(w.x), 1, 20); } });
        if (C.txt) T(b, pt((span - 1) / 2, 0), M.ok ? `x = ${x} 이면 삼각형이 만들어져요 ✓` : `x = ${x} 이면 삼각형이 안 만들어져요 ✗`, { dy: 44, size: 16, color: col });
      } else if (C.txt) {
        T(b, pt((span - 1) / 2, 0), st >= 3 ? `정수 x는 ${M.cnt}개` : '', { dy: 44, size: 17, color: 'green' });
      }
    },
    steps: (M) => [
      `x가 가장 긴 변인 경우와 아닌 경우로 나눠요. (아니라면 ${fmtN(M.mx)}${jos(M.mx, '이', '가')} 가장 긴 변이에요.)`,
      `① x가 가장 긴 변: 가장 긴 변 < 나머지 두 변의 합이므로 $x<${M.a}+${M.b}=${M.hi}$ ($x\\ge ${fmtN(M.mx)}$) ② 아닐 때: $${fmtN(M.mx)}<${fmtN(M.mn)}+x$, 즉 $x>${M.lo}$`,
      `두 경우를 합치면 $${M.lo}<x<${M.hi}$예요. 이 범위의 정수 x는 ${M.lo + 1}부터 ${M.hi - 1}까지 $${M.cnt}$개예요.`
    ],
    view: (M, C) => ({
      guide: `변 <b>a, b</b>를 바꾸고, 수직선의 <b>분홍 점</b> x를 끌어 보세요. 색칠한 구간 안에 x가 있으면 삼각형이 만들어져요. 구간 끝의 <b>빈 동그라미</b>는 그 값이 들어가지 않는다는 뜻이에요.`,
      readouts: [rd('x의 범위', `${M.lo} < x < ${M.hi}`, 'green', '', null, true), rd('지금의 x', `${M.x} cm`, M.ok ? 'green' : 'rose', M.ok ? '범위 안' : '범위 밖'), rd('정수 x의 개수', `${M.cnt}개`, 'sky', `${M.lo + 1} ~ ${M.hi - 1}`)],
      status: M.ok ? { tone: 'ok', text: `x = ${M.x} 은(는) 삼각형이 돼요` } : { tone: 'warn', text: `x = ${M.x} 은(는) 삼각형이 안 돼요` },
      formula: `<p>$${M.lo}<x<${M.hi}$ → 정수 $x$: $${M.lo + 1},\\dots,${M.hi - 1}$ ($${M.cnt}$개)</p>`,
      rule: '|a − b| < x < a + b 이면 세 변 a, b, x로 삼각형을 만들 수 있다',
      notes: notes('x가 가장 긴 변일 때와 아닐 때를 <b>둘 다</b> 따져야 해요. 한쪽만 하면 범위가 반쪽만 나와요.', '끝값(' + M.lo + ', ' + M.hi + ')은 포함되지 않아요. 정수의 개수를 셀 때 끝값을 넣지 마세요.')
    }),
    prob: (M) => {
      const { a, b: bb, kind } = M.pk, r = xr(a, bb), cnt = r.hi - r.lo - 1;
      const key = `a${a}b${bb}k${kind}`;
      if (kind === 0) {
        return { tag: '함정 · 삼각형이 되는 x의 범위(정수의 개수)', key, stem: `세 변의 길이가 ${a} cm, ${bb} cm, x cm인 삼각형이 만들어질 때, 정수 x의 개수는?`, choices: mkChoices(cnt, [[cnt + 1, '끝값 하나를 포함했어요. 등호는 들어가지 않아요.'], [cnt + 2, '양쪽 끝값을 모두 포함했어요. 끝값은 들어가지 않아요.'], [r.hi - r.lo, '개수는 (큰 값) − (작은 값) − 1이에요. 끝값을 빼야 해요.'], [r.mn * 2, '범위를 잘못 구했어요. |a−b| < x < a+b로 다시 계산해 보세요.'], [cnt - 1, '끝값을 너무 많이 뺐어요.']], { tex: (v) => `${v}\\text{개}`, plain: (v) => v + '개', pad: 1, valid: (v) => v >= 0 }) };
      }
      if (kind === 1) {
        const m = r.hi - 1;
        return { tag: '삼각형이 되는 x의 최댓값', key, stem: `세 변의 길이가 ${a} cm, ${bb} cm, x cm인 삼각형이 만들어질 때, 정수 x의 최댓값은?`, choices: mkChoices(m, [[r.hi, '두 변의 합 ' + r.hi + '은(는) 포함되지 않아요. 한 칸 작은 정수예요.'], [r.hi + 1, '범위의 위쪽 끝값 ' + r.hi + ' 미만이어야 해요.'], [r.mx, 'x가 가장 큰 변이 아닐 때의 값이에요. 더 클 수 있어요.'], [r.hi - 2, '더 큰 정수도 가능해요.']], { tex: numTex, plain: (v) => String(v), pad: 1 }) };
      }
      const mn = r.lo + 1;
      return { tag: '삼각형이 되는 x의 최솟값', key, stem: `세 변의 길이가 ${a} cm, ${bb} cm, x cm인 삼각형이 만들어질 때, 정수 x의 최솟값은?`, choices: mkChoices(mn, [[r.lo, '두 변의 차 ' + r.lo + '은(는) 포함되지 않아요. 한 칸 큰 정수예요.'], [r.lo - 1, '범위의 아래쪽 끝값 ' + r.lo + '보다 커야 해요.'], [r.mn, '작은 변의 길이가 아니에요. 두 변의 차가 기준이에요.'], [mn + 1, '더 작은 정수도 가능해요.']], { tex: numTex, plain: (v) => String(v), pad: 1, valid: (v) => v >= 1 }) };
    }
  };
  function drawXProblem(b, M) {
    const { a, b: bb } = M.pk;
    const Tr = triSSS(5.2, 4.4, 6), cen = pt((Tr[0].x + Tr[1].x + Tr[2].x) / 3, (Tr[0].y + Tr[1].y + Tr[2].y) / 3);
    fit(b, { x0: -0.2, x1: 6.2, y0: -4.5, y1: 0.2 }, { t: 44, b: 44 });
    poly(b, Tr, 'ink', 3.4); fillPoly(b, Tr, 'sky', 0.08);
    tagOut(b, Tr[0], cen, 'A', { size: 17 }); tagOut(b, Tr[1], cen, 'B', { size: 17 }); tagOut(b, Tr[2], cen, 'C', { size: 17 });
    sideTag(b, Tr[0], Tr[1], cen, `${bb} cm`, { color: 'green', size: 17 });
    sideTag(b, Tr[1], Tr[2], cen, 'x cm', { color: 'rose', size: 18 });
    sideTag(b, Tr[2], Tr[0], cen, `${a} cm`, { color: 'sky', size: 17 });
  }

  /* ====================================================================== 3. 막대 네 개 중 셋 고르기 */
  const COMBO = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]];
  const four = {
    id: 'c2-3', title: '막대 네 개 중 세 개 고르기', short: '막대 네 개',
    question: '막대 네 개에서 세 개를 고를 때, 삼각형을 만들 수 있는 경우는 모두 몇 가지일까?',
    ctl: ['cnQ1', 'cnQ2', 'cnQ3', 'cnQ4', 'cnQt'], anim: { key: 'cnQt', dur: 4, label: '막대 세워 보기', start: 1 },
    init: (s) => { s.cnQ1 = 3; s.cnQ2 = 5; s.cnQ3 = 7; s.cnQ4 = 9; s.cnQt = 1; s.cnPk = { v: [2, 4, 5, 9] }; },
    reroll: (s) => { const set = new Set(); while (set.size < 4) set.add(rint(2, 12)); s.cnPk = { v: [...set].sort((x, y) => x - y) }; },
    model: (s) => {
      const v = [s.cnQ1, s.cnQ2, s.cnQ3, s.cnQ4];
      const cards = COMBO.map((c) => { const t = c.map((i) => v[i]).sort((x, y) => x - y); return { idx: c, t, ok: can(t[0], t[1], t[2]), sum: t[0] + t[1] }; });
      return { v, cards, n: cards.filter((c) => c.ok).length, pk: s.cnPk || { v: [2, 4, 5, 9] } };
    },
    draw(b, s, M, C) {
      if (C.problem) { drawFourProblem(b, M); return; }
      const colsN = 2, Wc = 7.6, Hc = 6.6, Hi = Hc - 0.5;
      fit(b, { x0: -0.2, x1: colsN * Wc + 0.4, y0: -2 * Hc - 0.3, y1: 0.4 }, { t: 20, b: 44 });
      const tt = C.review ? (C.step >= 3 ? 1 : 1) : C.t, st = C.review ? C.step : 3;
      M.cards.forEach((cd, i) => {
        const col = i % 2, row = Math.floor(i / 2), x0 = col * Wc + 0.2, y0 = -(2 - row) * Hc + 0.4;
        const sc = 5.6 / Math.max(cd.t[2], 1);
        const show = st >= 2;
        const c = cd.ok ? 'green' : 'rose';
        b.path([pt(x0, y0), pt(x0 + Wc - 0.4, y0), pt(x0 + Wc - 0.4, y0 + Hi), pt(x0, y0 + Hi)], { close: true, fill: show ? c : 'muted', fillAlpha: show ? 0.1 : 0.05, color: show ? c : 'muted', width: 1.6, alpha: 0.9 });
        const items = cd.t.map((v, k) => ({ v, n: '', c: k === 2 ? 'amber' : k === 0 ? 'sky' : 'green' }));
        hinge(b, items, tt, { ox: x0 + 0.9, oy: y0 + Hi - 3, sc: sc * 0.9, w: 5, nums: true, numSize: 14 });
        if (show) T(b, pt(x0 + (Wc - 0.4) / 2, y0 + Hi), `${fmtN(cd.t[0])}+${fmtN(cd.t[1])}=${fmtN(cd.sum)} ${cd.ok ? '>' : '≤'} ${fmtN(cd.t[2])}`, { dy: -16, size: 15, color: c });
        if (st >= 3) T(b, pt(x0 + Wc - 0.4, y0), cd.ok ? '✓' : '✗', { dx: -16, dy: 18, size: 20, color: c });
      });
      if (C.txt && st >= 3) T(b, pt(Wc, 0), `삼각형을 만들 수 있는 경우: ${M.n}가지`, { dy: 20, size: 17, color: 'green' });
    },
    stepT: () => 1,
    steps: (M) => [
      `네 막대 중 세 개를 고르는 경우는 모두 4가지예요. (빼는 막대가 하나씩 달라요.)`,
      `각 경우에서 (가장 긴 막대) < (나머지 두 막대의 합)인지 확인해요. ` + M.cards.map((c) => `${c.t.join(',')}: ${c.t[0]}+${c.t[1]}${c.ok ? '>' : '≤'}${c.t[2]}`).join(' / '),
      `삼각형이 되는 경우를 세면 모두 $${M.n}$가지예요.`
    ],
    view: (M) => ({
      guide: '네 막대의 길이를 바꿔 보세요. 막대 네 개에서 세 개를 고르는 <b>4가지 경우</b>가 한 칸씩 나오고, 삼각형이 되면 초록, 안 되면 분홍으로 바뀌어요.',
      readouts: [rd('삼각형이 되는 경우', `${M.n}가지`, 'green', '4가지 중'), rd('안 되는 경우', `${4 - M.n}가지`, 'rose')],
      status: { tone: M.n ? 'ok' : 'warn', text: `4가지 중 ${M.n}가지가 삼각형이 돼요` },
      formula: M.cards.map((c) => `<p>${c.t.join(', ')} → $${c.t[0]}+${c.t[1]}=${c.sum}$ ${c.ok ? '$>$' : '$\\le$'} $${c.t[2]}$</p>`).join(''),
      rule: '세 개를 고를 때마다 (가장 긴 변) < (나머지 두 변의 합)을 확인한다',
      notes: notes('조합을 빠뜨리지 않게 <b>하나씩 빼면서</b> 4가지를 모두 적어요.', '가장 긴 막대를 포함하지 않는 조합도 따로 확인해요.')
    }),
    prob: (M) => {
      const v = M.pk.v, cnt = COMBO.filter((c) => { const t = c.map((i) => v[i]); return can(t[0], t[1], t[2]); }).length;
      return {
        tag: '삼각형을 만들 수 있는 경우의 수', key: v.join(','),
        stem: `길이가 ${v.join(' cm, ')} cm인 막대가 하나씩 있다. 이 중 세 개를 골라 삼각형을 만들 때, 만들 수 있는 삼각형의 개수는? (길이가 같은 삼각형은 같은 것으로 본다.)`,
        choices: [0, 1, 2, 3, 4].map((n) => ({ t: `${n}\\text{개}`, p: n + '개', ok: n === cnt, hint: '네 가지 조합마다 (가장 긴 변) < (나머지 두 변의 합)을 하나씩 확인해 보세요.' }))
      };
    }
  };
  function drawFourProblem(b, M) {
    const v = M.pk.v;
    fit(b, { x0: -1, x1: Math.max(...v) + 3, y0: -0.6, y1: 6.4 }, { t: 30, b: 30 });
    const cols = ['sky', 'green', 'amber', 'rose'];
    v.forEach((x, i) => {
      const y = i * 1.7;
      line(b, pt(0, y), pt(x, y), cols[i], 9, { alpha: 0.95 });
      b.point(pt(0, y), { color: cols[i], r: 5 }); b.point(pt(x, y), { color: cols[i], r: 5 });
      T(b, pt(x, y), `${x} cm`, { dx: 12, align: 'left', size: 17, color: cols[i] });
    });
  }

  G.register(20, 't2', '② 삼각형이 만들어질 조건', '삼각형이 만들어질 조건', PARAMS, [sticks, xs, four]);
})();
