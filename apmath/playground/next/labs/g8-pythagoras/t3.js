/* ==========================================================================
   중2 · 피타고라스 정리 — 탭 ③ 「피타고라스 수」 (t3.js, order 30) — 장면 4개
   · py3-345    (3, 4, 5)의 k배         · 세 변이 모두 정수인 직각삼각형, k배를 해도 직각삼각형
   · py3-51213  (5, 12, 13)의 k배
   · py3-8157   (8, 15, 17) · (7, 24, 25)의 k배   · 칩으로 고르기
   · py3-trap   [함정] 세 변이 p, q, x 일 때 · 가장 긴 변이 x 인지 q 인지에 따라 x² 가 두 가지 (√ 없이 x² 로 씁니다)
   값은 모두 지금의 k, p, q 로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G || !G.figRt) return;
  const { clamp, pt, add, mid, T, sideTag, line, poly, fillPoly, ang, fit, P, mkChoices, rd, notes, fmtN, pick, rint, bboxOf, tagOut, isSqN, isq, figRt, L2, lenOrSq } = G;

  const PARAMS = {
    pyK: P('배수 k', 1, 4, 1, 1, { color: 'green', hint: 'k배를 해도 직각삼각형이에요', format: (v) => `×${v}` }),
    pyQ1: P('짧은 변 p', 2, 9, 1, 3, { color: 'sky', format: (v) => `${v}` }),
    pyQ2: P('긴 변 q', 3, 15, 1, 4, { color: 'green', format: (v) => `${v}` })
  };
  const num = (v) => `${v}`;

  /* ---------------------------------------------------------------- 피타고라스 수의 k배 (공용)
     fams: [[a,b,c],…] 기본 삼각형들, kmax: [최대 k] */
  function famScene(o) {
    const famOf = (s) => { const i = clamp(Math.round(s.pyF || 0), 0, o.fams.length - 1), [a0, b0, c0] = o.fams[i]; const k = clamp(Math.round(s.pyK), 1, o.kmax[i]); s.pyK = k; return { i, a0, b0, c0, k, a: a0 * k, b: b0 * k, c: c0 * k }; };
    const dd = {
      id: o.id, title: o.title, short: o.short, question: o.question,
      ctl: ['pyK'],
      presets: o.fams.length > 1 ? () => o.fams.map((f, i) => ({ group: i === 0 ? '기본 삼각형' : '', label: `(${f.join(', ')})`, apply: (ss) => { ss.pyF = i; ss.pyK = Math.min(ss.pyK || 1, o.kmax[i]); }, on: (ss) => Math.round(ss.pyF || 0) === i })) : undefined,
      init: (s) => { s.pyF = 0; s.pyK = 1; s.pyAsk = 'c'; },
      gen: (s, prev) => {
        let i, k, ask;
        do { i = rint(0, o.fams.length - 1); k = rint(1, o.kmax[i]); ask = pick(['a', 'b', 'c']); } while (prev && prev.pyF === i && prev.pyK === k && prev.pyAsk === ask);
        return { pyF: i, pyK: k, pyAsk: ask };
      },
      model: (s) => ({ ...famOf(s), ask: s.pyAsk || 'c' }),
      draw(b, s, M, C) {
        const { a, b: bb, c, k, ask } = M, prob = C.problem;
        const val = { a, b: bb, c };
        const lab = {};
        ['a', 'b', 'c'].forEach((q) => { lab[q] = C.givens ? (q === ask && !C.answer ? 'x' : `${val[q]}`) : `${q}=${val[q]}`; });
        const R = figRt(b, a, bb, C, {
          sq: !prob, bt: 44, lab, at: { sa: 2, sb: 2, sc: 2 },
          sqLab: Object.fromEntries(['a', 'b', 'c'].map((q) => [q, q === ask && !C.calculation ? 'x²' : `${q}²=${val[q] * val[q]}`]))
        });
        if (C.calculation && C.txt) T(b, pt(a / 2, a), `${a * a} + ${bb * bb} = ${c * c}`, { dy: 34, size: 18, color: 'amber' });
      },
      steps: (M) => {
        const known = ['a', 'b', 'c'].filter((k) => k !== M.ask), other = M.ask === 'a' ? 'b' : 'a';
        const ans = M[M.ask];
        return [
          `주어진 변은 ${known.map((k) => `$${k}=${M[k]}$`).join(', ')}예요. 구하는 $x$는 ${M.ask === 'c' ? '빗변' : '직각변'}이에요.`,
          `기본 피타고라스 수 $(${M.a0},${M.b0},${M.c0})$에서 $${M.a0}^2+${M.b0}^2=${M.c0}^2$예요. 같은 비율로 커져도 이 관계는 같아요.`,
          `주어진 ${known.map((k) => `$${M[k]}\\div${M[k + '0']}=${M.k}$`).join(', ')}로 두 변의 배수가 같음을 확인해요.`,
          M.ask === 'c' ? `$x^2=${M.a}^2+${M.b}^2=${ans * ans}$예요.` : `$x^2=${M.c}^2-${M[other]}^2=${ans * ans}$예요.`,
          `$x=${M[M.ask + '0']}\\times${M.k}=${ans}$예요. 양수 ${ans}를 제곱하면 ${ans * ans}인지 확인해요.`
        ];
      },
      view: (M) => ({
        guide: '막대로 <b>배수 k</b>를 바꿔 보세요. 세 변이 모두 k배가 되어도 <b>a²+b²=c²</b>가 그대로 성립해요.' + (o.fams.length > 1 ? ' 칩으로 기본 삼각형을 바꿀 수 있어요.' : ''),
        readouts: [rd('세 변 (a, b, c)', `${M.a}, ${M.b}, ${M.c}`, 'amber', `(${M.a0}, ${M.b0}, ${M.c0}) × ${M.k}`, null, true), rd('a² + b²', `${M.a * M.a + M.b * M.b}`, 'sky', `${M.a * M.a} + ${M.b * M.b}`), rd('c²', `${M.c * M.c}`, 'amber', `${M.c}²`)],
        status: { tone: 'ok', text: `(${M.a}, ${M.b}, ${M.c}) 는 직각삼각형이에요` },
        formula: `<p>$${M.a}^2+${M.b}^2=${M.a * M.a + M.b * M.b}=${M.c}^2$</p>`,
        rule: `(${M.a0}, ${M.b0}, ${M.c0}) 의 k배도 직각삼각형: 세 변의 비는 ${M.a0} : ${M.b0} : ${M.c0}`,
        notes: notes('가장 긴 변이 <b>빗변</b>이에요. $x$가 가장 긴 변인지 먼저 확인해요.', '피타고라스 수는 <b>외워 두면</b> 제곱을 계산하지 않고도 바로 답을 알 수 있어요. 배수도 잊지 마세요.')
      }),
      prob: (M) => {
        const { a, b: bb, c, ask } = M, vals = { a, b: bb, c }, ans = vals[ask], oth = ['a', 'b', 'c'].filter((q) => q !== ask).map((q) => vals[q]);
        const given = ['a', 'b', 'c'].filter((q) => q !== ask);
        const nameOf = { a: '변 BC', b: '변 CA', c: '빗변 AB' };
        const wr = ask === 'c' ? [[oth[0] + oth[1], '길이의 합이 아니라 제곱의 합이 같아요.'], [Math.abs(oth[1] * oth[1] - oth[0] * oth[0]), '직각변을 구하는 계산이에요. 빗변은 더해요.'], [ans * ans, '제곱한 값이에요.']]
          : [[oth[1] - oth[0], '길이의 차가 아니라 제곱의 차예요.'], [oth[0] + oth[1], '직각변은 더하지 않고 빼요.'], [oth[0] * oth[0] + oth[1] * oth[1], '직각변을 구하는 문제에요. 빗변과 직각변을 구분해요.']];
        return {
          tag: '[기본] 피타고라스 수 활용', key: `${M.a0}-${M.k}-${ask}`,
          stem: `다음 직각삼각형 ABC에서 $\\angle C=90^\\circ$일 때, $x$의 값은? (${given.map((q) => `${nameOf[q]}=${vals[q]}`).join(', ')})`,
          choices: mkChoices(ans, [...wr, [ans + 1, '다시 계산해 보세요.'], [ans - 1, '다시 계산해 보세요.']], { tex: num, plain: num })
        };
      }
    };
    return dd;
  }
  const s345 = famScene({ id: 'py3-345', title: '(3, 4, 5)의 k배', short: '(3, 4, 5)', fams: [[3, 4, 5]], kmax: [4], question: '(3, 4, 5)는 직각삼각형의 세 변이 될 수 있다. 모든 변을 k배 하면 어떻게 될까?' });
  const s51213 = famScene({ id: 'py3-51213', title: '(5, 12, 13)의 k배', short: '(5, 12, 13)', fams: [[5, 12, 13]], kmax: [3], question: '(5, 12, 13)도 직각삼각형의 세 변이 될까? k배를 해도 될까?' });
  const s8157 = famScene({ id: 'py3-8157', title: '(8, 15, 17)과 (7, 24, 25)', short: '(8, 15, 17)·(7, 24, 25)', fams: [[8, 15, 17], [7, 24, 25]], kmax: [2, 2], question: '자주 나오는 피타고라스 수 (8, 15, 17), (7, 24, 25)도 k배를 해도 직각삼각형일까?' });

  /* ====================================================================== 4. [함정] 세 변이 p, q, x */
  const trapOf = (s) => {
    const p = clamp(Math.round(s.pyQ1), 2, 9); const q = clamp(Math.round(s.pyQ2), 3, 15);
    const qq = Math.max(q, p + 1); s.pyQ2 = qq;
    const x1 = p * p + qq * qq, x2 = qq * qq - p * p; // x 가 빗변 / q 가 빗변
    return { p, q: qq, x1, x2, sum: x1 + x2, x1i: lenOrSq(x1), x2i: lenOrSq(x2), kind: s.pyKind || 0 };
  };
  const trap = {
    id: 'py3-trap', title: '[함정] 가장 긴 변이 어느 것인가', short: '[함정] 빗변이 누구?',
    question: '직각삼각형의 두 변이 p, q 라고 알려 주면 나머지 한 변 x는 하나로 정해질까? 가장 긴 변이 어느 것인지에 따라 달라질까?',
    ctl: ['pyQ1', 'pyQ2'],
    init: (s) => { s.pyQ1 = 3; s.pyQ2 = 4; s.pyKind = 0; },
    gen: (s, prev) => {
      let p, q, kind;
      do { p = rint(3, 9); q = rint(p + 1, 15); kind = rint(0, 2); } while (prev && prev.pyQ1 === p && prev.pyQ2 === q && prev.pyKind === kind);
      if (kind === 0) { // 가능한 x² 의 합: 2q²
        return { pyQ1: p, pyQ2: q, pyKind: 0 };
      }
      return { pyQ1: p, pyQ2: q, pyKind: kind };
    },
    model: (s) => trapOf(s),
    draw(b, s, M, C) {
      const { p, q, x1, x2, x1i, x2i, kind } = M, prob = C.problem;
      // 왼쪽: x 가 빗변(직각변 p, q), 오른쪽: q 가 빗변(직각변 p, x). 두 삼각형을 가로로 나란히 놓습니다.
      const w2 = Math.sqrt(x2), gap = Math.max(2.2, q * 0.5);
      const show1 = !C.givens || kind !== 1, show2 = !C.givens || kind !== 2;
      const rowScale = Math.min((b.W - 68) / (q + gap + w2), (b.H - 110) / p);
      const columnScale = Math.min((b.W - 68) / Math.max(q, w2), (b.H - 110) / (2 * p + gap));
      const stacked = b.W < 560 && show1 && show2 && columnScale > rowScale * 1.08;
      const x0 = stacked || !show1 ? 0 : q + gap, dy = stacked ? p + gap : 0;
      fit(b, { x0: -0.4, x1: (show2 ? Math.max(show1 ? q : 0, x0 + w2) : q) + 0.4, y0: -p, y1: dy }, { t: 44, b: 56, l: 34, r: 34 });
      if (show1) {
        figRt(b, q, p, C, { noFit: true, dx: 0, sq: false, names: ['', '', ''], lab: { a: `${q}`, b: `${p}`, c: C.answer ? x1i ? `x=${x1i}` : `x²=${x1}` : 'x' }, labOut: true });
        if (!prob) T(b, pt(q / 2, 0), 'x가 가장 긴 변', { dy: 40, size: 15, color: 'amber' });
      }
      if (show2) {
        figRt(b, w2, p, C, { noFit: true, dx: x0, dy, sq: false, names: ['', '', ''], lab: { a: C.answer ? x2i ? `x=${x2i}` : `x²=${x2}` : 'x', b: `${p}`, c: `${q}` }, labOut: true });
        if (!prob) T(b, pt(x0 + w2 / 2, dy), `${q}가 가장 긴 변`, { dy: 40, size: 15, color: 'amber' });
      }
    },
    steps: (M) => [
      `두 변의 길이는 $${M.p}$, $${M.q}$이고 $${M.p}<${M.q}$예요. ${M.kind === 1 ? `가장 긴 변은 $${M.q}$라고 주어졌어요.` : M.kind === 2 ? '가장 긴 변은 $x$라고 주어졌어요.' : '가장 긴 변이 주어지지 않았으므로 두 경우를 나눠요.'}`,
      M.kind === 1 ? `$${M.q}$가 빗변이므로 $x^2+${M.p}^2=${M.q}^2$예요.` : `$x$가 빗변이면 $x^2=${M.p}^2+${M.q}^2$예요.`,
      M.kind === 1 ? `$x^2=${M.q * M.q}-${M.p * M.p}=${M.x2}$예요.` : M.kind === 2 ? `$x^2=${M.p * M.p}+${M.q * M.q}=${M.x1}$예요.` : `$${M.q}$가 빗변인 경우도 가능해요. 이때 $x^2=${M.q}^2-${M.p}^2=${M.x2}$예요.`,
      M.kind === 0 ? `가능한 두 값의 합은 $${M.x1}+${M.x2}=${M.sum}$예요. 더 작은 주어진 변 $${M.p}$는 빗변이 될 수 없어요.` : `문제는 길이 $x$가 아니라 $x^2$를 물었으므로 답은 $${M.kind === 1 ? M.x2 : M.x1}$예요.`
    ],
    view: (M, C) => ({
      guide: '막대로 <b>p</b>, <b>q</b>를 바꿔 보세요. 같은 두 변이라도 <b>가장 긴 변</b>이 누구냐에 따라 나머지 변 x가 달라져요. 제곱근을 배우기 전이라 x²의 값으로 써요.',
      readouts: [rd('경우 1: x²', `${M.x1}`, 'amber', `${M.p}² + ${M.q}²`), rd('경우 2: x²', `${M.x2}`, 'rose', `${M.q}² − ${M.p}²`), rd('두 값의 합', `${M.sum}`, 'sky', `2 × ${M.q}²`)],
      status: { tone: 'warn', text: 'x가 가장 긴 변인지 먼저 따져 봐요' },
      formula: `<p>경우 1: $x^2=${M.p}^2+${M.q}^2=${M.x1}$</p><p>경우 2: $x^2=${M.q}^2-${M.p}^2=${M.x2}$</p>`,
      rule: '두 변만 알면 가장 긴 변이 누구인지 두 경우로 나누어 x²를 구한다',
      alert: { tone: 'warn', text: `<b>[함정]</b> $${M.p}$와 $${M.q}$가 직각변이라고만 생각하면 한 경우를 놓쳐요. $${M.q}$가 빗변이 될 수도 있어요.` },
      notes: C.review && M.kind !== 0 ? notes(M.kind === 1 ? `문제에서 가장 긴 변이 $${M.q}$라고 주어졌으므로 그 변을 빗변으로 놓아요.` : '문제에서 가장 긴 변이 $x$라고 주어졌으므로 $x$를 빗변으로 놓아요.', '이 문항은 주어진 빗변 조건에 맞는 <b>한 경우</b>의 $x^2$를 물어요.') : notes('가장 긴 변이 빗변이에요. $x$의 값이 $q$보다 커야 경우 1이고, 작아야 경우 2예요.', '두 경우의 $x^2$를 <b>모두</b> 구했는지 확인해요.')
    }),
    prob: (M) => {
      const { p, q, x1, x2, sum, kind } = M;
      const cm = { tex: num, plain: num };
      if (kind === 1) {
        return { tag: '[함정] x² 구하기 (q가 빗변)', key: `k1-${p}-${q}`, stem: `길이가 각각 $${p}$, $${q}$, $x$인 세 변으로 직각삼각형을 만들었다. 가장 긴 변의 길이가 $${q}$일 때, $x^2$의 값은?`, choices: mkChoices(x2, [[x1, `$${q}$가 빗변이에요. 빗변이 $x$일 때의 값이에요.`], [q - p, '길이의 차가 아니라 제곱의 차예요.'], [x1 + x2, '두 경우를 더하지 않아요. 이 문제는 한 경우만 묻고 있어요.'], [x2 + 1, '다시 계산해 보세요.'], [x2 - 1, '다시 계산해 보세요.']], cm) };
      }
      if (kind === 2) {
        return { tag: '[함정] x² 구하기 (x가 빗변)', key: `k2-${p}-${q}`, stem: `길이가 각각 $${p}$, $${q}$, $x$인 세 변으로 직각삼각형을 만들었다. 가장 긴 변의 길이가 $x$일 때, $x^2$의 값은?`, choices: mkChoices(x1, [[x2, `이것은 $${q}$가 빗변일 때의 값이에요.`], [p + q, '길이의 합이 아니라 제곱의 합이에요.'], [x1 + x2, '두 경우를 더하지 않아요.'], [x1 + 1, '다시 계산해 보세요.'], [x1 - 1, '다시 계산해 보세요.']], cm) };
      }
      return { tag: '[함정] 가능한 x²의 값들의 합', key: `k0-${p}-${q}`, stem: `길이가 각각 $${p}$, $${q}$, $x$인 세 개의 막대로 직각삼각형을 만들려고 한다. 가능한 $x^2$의 값들의 합은?`, choices: mkChoices(sum, [[x1, '한 경우만 구했어요. $x$가 가장 긴 변일 때와 $' + q + '$가 가장 긴 변일 때를 모두 더해요.'], [x2, '한 경우만 구했어요.'], [x1 * 2, '두 경우의 값이 서로 달라요.'], [sum + 2 * p * p, '다시 계산해 보세요.'], [sum - 2 * p * p, '다시 계산해 보세요.'], [q * q, '다시 계산해 보세요.']], cm) };
    }
  };

  G.register(30, 't3', '③ 피타고라스 수', '피타고라스 수', PARAMS, [s345, s51213, s8157, trap]);
})();
