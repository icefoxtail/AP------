/* ==========================================================================
   중2 · 피타고라스 정리 — 탭 ① 「직각삼각형의 변」 (t1.js, order 10) — 장면 6개
   · py1-sq    세 정사각형의 넓이    · a, b 를 바꾸면 a², b², c² 가 그림 안에서 바로 바뀜, a²+b²=c²
   · py1-leg   직각변 구하기         · 빗변 c 와 한 직각변 a 로 b²=c²−a² (정수가 되는 값 찾기)
   · py1-rot   뒤집힌 삼각형         · 삼각형을 돌려도 빗변은 직각의 맞은편(가장 긴 변)
   · py1-grid  모눈 위 기울어진 정사각형 · 큰 정사각형에서 직각삼각형 4개를 빼서 넓이 u²+v²
   · py1-chain 이어 붙인 두 직각삼각형  · 직각삼각형 두 개를 이어 x, y 구하기 (x+y)
   · py1-perim 직각삼각형의 둘레와 넓이 · 빗변을 구한 뒤 둘레·넓이
   중2는 제곱근을 배우기 전이라 √ 표기가 없습니다. 길이가 정수가 아니면 x²=값 으로 씁니다.
   모든 글자·표시·정답은 지금의 길이로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G) return;
  const { clamp, pt, add, sub, mul, mid, unit, lerp, rotP, centroid, pick, rint, bboxOf, T, tagOut, sideTag, tick, line, poly, fillPoly, ang, fit, P, mkChoices, rd, notes, fmtN, texRat, plainRat, isSqN, isq, rtTri, squareOn, cenOf, drawSq, TRIPLES } = G;

  const PARAMS = {
    pyA: P('변 a (BC)', 2, 12, 1, 3, { color: 'sky', format: (v) => `${v}` }),
    pyB: P('변 b (CA)', 2, 12, 1, 4, { color: 'green', format: (v) => `${v}` }),
    pyWa: P('변 a (BC)', 2, 24, 1, 3, { color: 'sky', format: (v) => `${v}` }),
    pyWb: P('변 b (CA)', 2, 24, 1, 4, { color: 'green', format: (v) => `${v}` }),
    pyRot: P('삼각형 돌리기', 0, 360, 5, 35, { color: 'rose', hint: '돌려도 빗변은 직각의 맞은편이에요', format: (v) => `${Math.round(v)}°` }),
    pyH: P('빗변 c', 5, 25, 1, 10, { color: 'amber', format: (v) => `${v}` }),
    pyL: P('직각변 a', 2, 24, 1, 6, { color: 'sky', hint: '빗변보다 짧게 맞춰져요', format: (v) => `${v}` }),
    pyU: P('짧은 쪽 u', 1, 6, 1, 3, { color: 'sky', format: (v) => `${v}` }),
    pyV: P('긴 쪽 v', 1, 6, 1, 4, { color: 'green', format: (v) => `${v}` }),
    pyX: P('높이 AB', 3, 24, 1, 8, { color: 'amber', format: (v) => `${v}` }),
    pyM: P('BD', 2, 12, 1, 6, { color: 'sky', format: (v) => `${v}` }),
    pyN: P('DC', 1, 12, 1, 9, { color: 'green', format: (v) => `${v}` })
  };

  // 제곱한 값 v2 로 길이 이름표: 정수면 NAME=값, 아니면 NAME²=v2 (제곱근 기호 없이)
  const L2 = (name, v2) => (isSqN(v2) ? `${name}=${isq(v2)}` : `${name}²=${v2}`);
  const lenOrSq = (v2) => (isSqN(v2) ? `${isq(v2)}` : null);
  const COL = { a: 'sky', b: 'green', c: 'amber' };

  /* ---------------------------------------------------------------- 직각삼각형 그리기 (직각 C, 가로 BC=a, 세로 CA=b)
     o: sq(정사각형 3개), rot(제자리 회전 도), lab {a,b,c: 변 위 글자}, sqLab {a,b,c: 정사각형 안 글자}, names(꼭짓점 이름) */
  function figRt(b, a, bq, C, o = {}) {
    const T0 = rtTri(a, bq), cen0 = centroid([T0.A, T0.B, T0.C]);
    const R = (p) => { const q = rotP(p, cen0, o.rot || 0); return o.dx ? pt(q.x + o.dx, q.y) : q; };
    const A = R(T0.A), B = R(T0.B), Cc = R(T0.C), cen = R(cen0);
    const sqs = o.sq ? { a: squareOn(B, Cc, cen), b: squareOn(Cc, A, cen), c: squareOn(A, B, cen) } : null;
    const pts = [A, B, Cc].concat(sqs ? [...sqs.a, ...sqs.b, ...sqs.c] : []);
    let box;
    if (o.rot != null && !o.sq) { const Rr = Math.max(...pts.map((p) => Math.hypot(p.x - cen.x, p.y - cen.y))); box = { x0: cen.x - Rr, x1: cen.x + Rr, y0: cen.y - Rr, y1: cen.y + Rr }; } else box = bboxOf(pts);
    if (!o.noFit) fit(b, box, { t: o.t == null ? 40 : o.t, b: o.bt == null ? 40 : o.bt, l: o.l, r: o.r });
    const sh = (k) => !C.review || C.step >= (o.at && o.at[k] != null ? o.at[k] : 0);
    // 정사각형이 있고 삼각형이 작으면(휴대폰) 변의 길이 글자와 정사각형 글자가 겹치므로, 변의 길이를 정사각형 안에 두 줄로 함께 적습니다.
    const pxD = (p, q) => { const u = b.toS(p), v = b.toS(q); return Math.hypot(u.x - v.x, u.y - v.y); };
    const small = !!sqs && Math.min(pxD(B, Cc), pxD(Cc, A)) < 125;
    const sqDraw = (k, col) => {
      const two = small && o.lab && o.lab[k] && o.sqLab && o.sqLab[k];
      drawSq(b, sqs[k], col, two ? '' : o.sqLab && o.sqLab[k], { size: o.sqSize || 16 });
      if (two) { const c0 = cenOf(sqs[k]); T(b, c0, o.lab[k], { size: 15, color: col, dy: -10 }); T(b, c0, o.sqLab[k], { size: 15, color: col, dy: 10 }); }
    };
    if (sqs) {
      if (sh('sa')) sqDraw('a', 'sky');
      if (sh('sb')) sqDraw('b', 'green');
      if (sh('sc')) sqDraw('c', 'amber');
    }
    fillPoly(b, [A, B, Cc], 'ink', 0.06);
    poly(b, [A, B, Cc], 'ink', 3.4);
    ang(b, Cc, B, A, { color: 'amber', r: 22 });
    // 납작하거나 홀쭉한 삼각형: 빗변 글자가 직각변 글자와 붙으면 빗변 글자를 바깥쪽으로 보냅니다.
    const dS = (u, v) => Math.hypot(u.x - v.x, u.y - v.y);
    const cOut = !sqs && !o.labOut && Math.min(dS(b.toS(B), b.toS(Cc)), dS(b.toS(Cc), b.toS(A))) < 150;
    [[B, Cc, 'a', sqs && cenOf(sqs.a)], [Cc, A, 'b', sqs && cenOf(sqs.b)], [A, B, 'c', sqs && cenOf(sqs.c)]].forEach(([p, q, k, sc]) => {
      const t = o.lab && o.lab[k];
      if (t && !(small && o.sqLab && o.sqLab[k] && sh('s' + k))) sideTag(b, k === 'c' ? lerp(p, q, 0.25) : p, q, sc || (o.labOut || (cOut && k === 'c') ? cen : add(mul(mid(p, q), 2), mul(cen, -1))), t, { color: COL[k], size: o.size || 16, gap: o.gap == null ? 11 : o.gap });
      if (o.hi === k) line(b, p, q, COL[k], 6, { alpha: 0.9 });
    });
    const nm = o.names || ['A', 'B', 'C'];
    [[A, nm[0]], [B, nm[1]], [Cc, nm[2]]].forEach(([p, s]) => { b.point(p, { color: 'ink', r: 4.5 }); if (s) tagOut(b, p, cen, s, { size: 17, gap: 10 }); });
    return { A, B, C: Cc, sqs, cen };
  }
  // 격자 칸(정사각형 안 칸 세기): 변이 가로·세로인 정사각형 한 개
  const cells = (b, x0, y0, n, color) => { for (let i = 1; i < n; i++) { line(b, pt(x0 + i, y0), pt(x0 + i, y0 + n), color, 1, { alpha: 0.5 }); line(b, pt(x0, y0 + i), pt(x0 + n, y0 + i), color, 1, { alpha: 0.5 }); } };

  /* ====================================================================== 1. 세 정사각형의 넓이 */
  const triOf = (s) => { const a = clamp(Math.round(s.pyA), 2, 12), b = clamp(Math.round(s.pyB), 2, 12); return { a, b, a2: a * a, b2: b * b, c2: a * a + b * b, ci: lenOrSq(a * a + b * b) }; };
  const BASE_HYP = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9]];
  const sq1 = {
    id: 'py1-sq', title: '세 정사각형의 넓이', short: '세 정사각형의 넓이',
    question: '직각삼각형의 세 변 위에 정사각형을 그리면, 두 직각변 위 정사각형의 넓이를 더한 것이 빗변 위 정사각형의 넓이와 같을까?',
    ctl: ['pyA', 'pyB'],
    presets: (s) => [{ group: '칸으로 세어 보기', label: s.pyGrid ? '칸 끄기' : '칸 켜기', apply: (ss) => { ss.pyGrid = !ss.pyGrid; }, on: (ss) => !!ss.pyGrid }],
    init: (s) => { s.pyA = 3; s.pyB = 4; s.pyGrid = false; },
    gen: (s, prev) => { let t; do { t = pick(BASE_HYP, prev ? [prev.pyA, prev.pyB] : null); } while (prev && t[0] === prev.pyA && t[1] === prev.pyB); return { pyA: t[0], pyB: t[1] }; },
    model: (s) => triOf(s),
    draw(b, s, M, C) {
      const { a, b: bb, a2, b2, c2, ci } = M;
      const R = figRt(b, a, bb, C, {
        sq: !C.problem, bt: C.problem ? 40 : 50, size: 16,
        lab: { a: `a=${a}`, b: `b=${bb}`, c: C.problem ? 'x' : ci ? `c=${ci}` : 'c' },
        sqLab: { a: `a²=${a2}`, b: `b²=${bb * bb}`, c: `c²=${c2}` },
        at: { sa: 2, sb: 2, sc: 3 }
      });
      if (C.problem) return;
      if (s.pyGrid && !C.problem && (!C.review || C.step >= 2)) {
        // 직각변 위 정사각형 안의 칸: 변 BC(아래)·CA(왼쪽)가 가로·세로라 그대로 칸을 그릴 수 있습니다.
        cells(b, 0, 0, a, 'sky');
        cells(b, -bb, -bb, bb, 'green');
      }
      if (C.txt) {
        const y1 = Math.max(a, 0) + 0;
        T(b, pt((a + 0) / 2, y1), `${a2} + ${bb * bb} = ${c2}`, { dy: 34, size: 18, color: 'amber' });
      }
    },
    steps: (M) => [
      `직각을 낀 두 변은 $a=${M.a}$, $b=${M.b}$예요. 직각 C의 맞은편 빗변을 $c=x$라 놓아요.`,
      `두 직각변 위에 정사각형을 세워요. 하늘색 넓이는 $a^2$, 초록색 넓이는 $b^2$예요.`,
      `피타고라스 정리에 따라 빗변 위 정사각형의 넓이는 $c^2=a^2+b^2$예요. 노란 정사각형과 두 작은 정사각형을 비교해요.`,
      `현재 숫자를 대입하면 $c^2=${M.a}^2+${M.b}^2=${M.a2}+${M.b2}=${M.c2}$예요.`,
      M.ci ? `$${M.ci}^2=${M.c2}$이고 길이는 양수이므로 $x=c=${M.ci}$예요.` : `빗변의 제곱은 $x^2=${M.c2}$예요. 정수 길이로 바꾸지 않아요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>a</b>와 <b>b</b>를 바꿔 보세요. 파란 정사각형 + 초록 정사각형의 넓이가 <b>노란 정사각형</b>의 넓이와 늘 같아요. 칩으로 칸을 켜면 칸 수로도 셀 수 있어요.',
      readouts: [rd('파란 넓이 a²', `${M.a2}`, 'sky', `${M.a} × ${M.a}`), rd('초록 넓이 b²', `${M.b2}`, 'green', `${M.b} × ${M.b}`), rd('노란 넓이 c²', `${M.c2}`, 'amber', `${M.a2} + ${M.b2}`), rd('빗변 c', M.ci ? `${M.ci}` : `c²=${M.c2}`, M.ci ? 'green' : 'ink', M.ci ? '정수예요' : '정수가 아니에요 (제곱근은 중3)')],
      status: M.ci ? { tone: 'ok', text: `빗변도 정수 ${M.ci}예요 (피타고라스 수)` } : { tone: 'info', text: `c²=${M.c2} (정수 c는 없어요)` },
      formula: `<p>$a^2+b^2=c^2$</p><p>$${M.a}^2+${M.b}^2=${M.a2}+${M.b2}=${M.c2}=c^2$</p>`,
      rule: '직각삼각형에서 (직각을 낀 두 변의 제곱의 합) = (빗변의 제곱), 즉 a²+b²=c²',
      notes: notes('빗변은 <b>직각의 맞은편</b>이고 가장 긴 변이에요. 직각을 낀 변에 c를 붙이지 않도록 조심하세요.', '$c=a+b$가 아니에요. 길이의 합이 아니라 <b>넓이(제곱)</b>의 합이 같아요.')
    }),
    prob: (M) => {
      const { a, b: bb, c2 } = M, c = isq(c2);
      return {
        tag: '[기본] 빗변의 길이', key: `${a}-${bb}`,
        stem: `다음 직각삼각형 ABC에서 $\\angle C=90^\\circ$, $a=${a}$, $b=${bb}$일 때, 빗변의 길이 $x$의 값은?`,
        choices: mkChoices(c, [[a + bb, '길이의 합이 아니라 제곱의 합이 같아요: $a^2+b^2=c^2$.'], [c2, `$c^2=${c2}$이에요. $c$는 한 번 더 구해야 해요.`], [Math.abs(bb * bb - a * a), '넓이를 더해야 해요(빼지 않아요).'], [c + 1, '$a^2+b^2$를 다시 계산해 보세요.'], [c - 1, '$a^2+b^2$를 다시 계산해 보세요.'], [a * bb, '곱하지 않아요. 제곱을 더해요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  /* ====================================================================== 2. 직각변 구하기 */
  const LEG_CHIPS = [[5, 3], [10, 6], [13, 5], [13, 12], [15, 9], [17, 8], [20, 12], [25, 7]];
  const legOf = (s) => {
    const c = clamp(Math.round(s.pyH), 5, 25); const a = clamp(Math.round(s.pyL), 2, c - 1); s.pyL = a;
    const b2 = c * c - a * a;
    return { a, c, a2: a * a, c2: c * c, b2, bi: lenOrSq(b2), kind: s.pyK || 0 };
  };
  const leg = {
    id: 'py1-leg', title: '직각변 구하기', short: '직각변 구하기',
    question: '빗변 c와 한 직각변 a가 주어지면 나머지 직각변 b는? 빗변 위 정사각형에서 a 위 정사각형을 빼 보자.',
    ctl: ['pyH', 'pyL'],
    presets: () => LEG_CHIPS.map(([c, a], i) => ({ group: i === 0 ? 'b가 정수가 되는 (c, a)' : '', label: `c=${c}, a=${a}`, apply: (ss) => { ss.pyH = c; ss.pyL = a; }, on: (ss) => ss.pyH === c && ss.pyL === a })),
    init: (s) => { s.pyH = 10; s.pyL = 6; s.pyK = 0; },
    gen: (s, prev) => { let t; do { t = pick(LEG_CHIPS); } while (prev && t[0] === prev.pyH && t[1] === prev.pyL); return { pyH: t[0], pyL: t[1], pyK: 0 }; },
    model: (s) => legOf(s),
    draw(b, s, M, C) {
      const { a, c, a2, c2, b2, bi } = M;
      const bq = Math.sqrt(b2); // 그림을 그릴 때만 쓰는 값(화면에 제곱근 기호는 쓰지 않음)
      const R = figRt(b, a, bq, C, {
        sq: !C.problem, bt: 40,
        lab: { a: `a=${a}`, b: C.problem ? 'x' : bi ? `b=${bi}` : 'b', c: `c=${c}` },
        sqLab: { a: `a²=${a2}`, b: C.problem ? '' : `b²=${b2}`, c: `c²=${c2}` },
        at: { sa: 2, sb: 3, sc: 2 }
      });
      if (!C.problem && C.txt) T(b, pt(a / 2, a), `${c2} − ${a2} = ${b2}`, { dy: 34, size: 18, color: 'green' });
    },
    steps: (M) => [
      `빗변은 $c=${M.c}$, 한 직각변은 $a=${M.a}$예요. 나머지 직각변을 $b=x$라 놓아요.`,
      `$a^2+b^2=c^2$에서 $b^2=c^2-a^2$로 정리해요. 빗변 위 정사각형에서 하늘색 정사각형을 빼요.`,
      `주어진 길이를 제곱하면 $c^2=${M.c2}$, $a^2=${M.a2}$예요. 남은 초록색 넓이가 $b^2$예요.`,
      `$b^2=${M.c}^2-${M.a}^2=${M.c2}-${M.a2}=${M.b2}$예요.`,
      M.bi ? `$${M.bi}^2=${M.b2}$이므로 $x=b=${M.bi}$예요.` : `정수가 아닌 길이를 반올림하지 않고 $x^2=${M.b2}$로 써요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>c</b>와 <b>a</b>를 바꿔 보세요. 빗변 위 정사각형(노랑)에서 a 위 정사각형(파랑)을 빼면 b 위 정사각형(초록)의 넓이가 남아요. 칩은 b가 정수가 되는 경우예요.',
      readouts: [rd('빗변 c', `${M.c}`, 'amber'), rd('직각변 a', `${M.a}`, 'sky'), rd('b² = c² − a²', `${M.b2}`, 'green', `${M.c2} − ${M.a2}`), rd('직각변 b', M.bi ? `${M.bi}` : `b²=${M.b2}`, M.bi ? 'green' : 'ink', M.bi ? '정수예요' : '정수가 아니에요')],
      status: M.bi ? { tone: 'ok', text: `b=${M.bi} (정수)` } : { tone: 'info', text: `b²=${M.b2} (제곱수가 아니에요)` },
      formula: `<p>$b^2=c^2-a^2=${M.c}^2-${M.a}^2=${M.b2}$</p>`,
      rule: '빗변과 한 직각변을 알면 나머지 직각변은 b²=c²−a²',
      notes: notes('빗변이 가장 길어요. <b>c²−a²</b>이지 a²−c²가 아니에요.', '제곱수가 아니면 길이를 정수로 쓰지 말고 <b>b²=값</b>으로 써요.')
    }),
    prob: (M) => {
      const { a, c, b2 } = M, b = isq(b2);
      return {
        tag: '[기본] 직각변의 길이', key: `${c}-${a}`,
        stem: `다음 직각삼각형에서 빗변의 길이가 $${c}$, 한 직각변의 길이가 $${a}$일 때, 나머지 직각변의 길이 $x$의 값은?`,
        choices: mkChoices(b, [[c - a, '길이의 차가 아니라 제곱의 차예요: $b^2=c^2-a^2$.'], [b2, `$x^2=${b2}$이에요. $x$는 한 번 더 구해야 해요.`], [c * c + a * a, '빗변을 구할 때처럼 더하지 않아요. 직각변은 빼요.'], [b + 1, '$c^2-a^2$를 다시 계산해 보세요.'], [b - 1, '$c^2-a^2$를 다시 계산해 보세요.'], [a + c, '더하지 않아요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  /* ====================================================================== 3. 뒤집힌 삼각형 */
  const ROT_TRI = [[3, 4], [6, 8], [5, 12], [9, 12], [8, 15], [12, 5], [8, 6]];
  const rotOf = (s) => { const a = clamp(Math.round(s.pyWa), 2, 24), b = clamp(Math.round(s.pyWb), 2, 24); const c2 = a * a + b * b; return { a, b, c2, ci: lenOrSq(c2), rot: s.pyRot == null ? 35 : s.pyRot, kind: s.pyK || 0 }; };
  const rot = {
    id: 'py1-rot', title: '뒤집힌 삼각형의 빗변', short: '뒤집힌 삼각형',
    question: '삼각형을 돌려 놓으면 어느 변이 빗변인지 헷갈린다. 빗변은 어떻게 찾을까?',
    ctl: ['pyWa', 'pyWb', 'pyRot'],
    init: (s) => { s.pyWa = 3; s.pyWb = 4; s.pyRot = 35; s.pyK = 0; },
    gen: (s, prev) => { let t; do { t = pick(ROT_TRI); } while (prev && t[0] === prev.pyWa && t[1] === prev.pyWb); return { pyWa: t[0], pyWb: t[1], pyRot: pick([20, 55, 100, 145, 200, 245, 290, 330]), pyK: rint(0, 1) }; },
    model: (s) => rotOf(s),
    draw(b, s, M, C) {
      const { a, b: bb, c2, ci, rot: r, kind } = M;
      // 문제에서 kind=1 이면 한 직각변을 구하는 문제: 빗변 값을 주고 직각변 x 를 구합니다.
      const hypGiven = C.problem && kind === 1;
      figRt(b, a, bb, C, {
        rot: r, names: ['A', 'B', 'C'], hi: C.review && C.step >= 2 ? 'c' : null, t: 26, bt: 26,
        lab: { a: C.problem && kind === 1 ? 'x' : `${a}`, b: `${bb}`, c: hypGiven ? (ci || 'c') : C.problem ? 'x' : ci ? `${ci}` : 'c' },
        labOut: true
      });
      if (!C.problem && C.txt) T(b, pt(0, 0), '', {});
    },
    steps: (M) => [
      M.kind === 1 ? `직각 C의 맞은편 빗변은 $${M.ci}$, 주어진 직각변은 $${M.b}$예요. 구하는 $x$는 다른 직각변이에요.` : `직각 C를 끼는 두 변은 $${M.a}$, $${M.b}$예요. 구하는 $x$는 직각의 맞은편 빗변이에요.`,
      `네모 표시와 마주 보는 변을 강조해요. 그림을 돌려 놓아도 빗변은 바뀌지 않아요.`,
      M.kind === 1 ? `$x^2+${M.b}^2=${M.ci}^2$이므로 빗변의 제곱에서 주어진 직각변의 제곱을 빼요.` : `$x^2=${M.a}^2+${M.b}^2$이므로 두 직각변의 제곱을 더해요.`,
      M.kind === 1 ? `$x^2=${M.ci}^2-${M.b}^2=${M.c2}-${M.b * M.b}=${M.a * M.a}$예요.` : `$x^2=${M.a * M.a}+${M.b * M.b}=${M.c2}$예요.`,
      `$x=${M.kind === 1 ? M.a : M.ci}$예요. 구한 변이 직각변인지 빗변인지 다시 확인해요.`
    ],
    view: (M) => ({
      guide: '막대로 삼각형을 <b>돌려</b> 보세요. 어떻게 돌려도 <b>직각(네모)의 맞은편</b>이 빗변이에요. 두 직각변 길이도 바꿔 보세요.',
      readouts: [rd('직각을 낀 변', `${M.a}, ${M.b}`, 'sky'), rd('빗변 (직각의 맞은편)', M.ci ? `${M.ci}` : `c²=${M.c2}`, 'amber', `${M.a}² + ${M.b}²`)],
      status: { tone: 'info', text: `돌린 각 ${Math.round(M.rot)}° · 빗변은 직각의 맞은편` },
      formula: `<p>$c^2=${M.a}^2+${M.b}^2=${M.c2}$</p>`,
      rule: '빗변은 직각의 맞은편 변(가장 긴 변)이고, 돌려 놓아도 a²+b²=c²',
      notes: notes('그림이 돌아가 있어도 <b>직각 표시</b>부터 찾아요.', '$x$가 직각을 낀 변이면 $x^2=(빗변)^2-(다른 직각변)^2$로 빼서 구해요.')
    }),
    prob: (M) => {
      const { a, b: bb, c2, kind } = M, c = isq(c2);
      if (kind === 1) {
        return {
          tag: '[기본] 뒤집힌 삼각형에서 직각변 구하기', key: `k1-${a}-${bb}`,
          stem: `다음 직각삼각형 ABC에서 직각의 표시를 찾아, 직각의 맞은편 변이 $${c}$, 다른 한 직각변이 $${bb}$일 때 $x$의 값은?`,
          choices: mkChoices(a, [[c - bb, '길이의 차가 아니에요: $x^2=c^2-b^2$.'], [c2 - bb * bb, `$x^2=${c2 - bb * bb}$이에요. $x$는 한 번 더 구해야 해요.`], [c + bb, '더하지 않아요.'], [a + 1, '다시 계산해 보세요.'], [a - 1, '다시 계산해 보세요.'], [c2, '제곱한 값이에요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
        };
      }
      return {
        tag: '[기본] 뒤집힌 삼각형의 빗변', key: `k0-${a}-${bb}`,
        stem: `다음 직각삼각형 ABC에서 직각의 표시를 찾아, 직각을 낀 두 변이 $${a}$, $${bb}$일 때 직각의 맞은편 변의 길이 $x$의 값은?`,
        choices: mkChoices(c, [[a + bb, '길이의 합이 아니라 제곱의 합이에요.'], [c2, `$x^2=${c2}$이에요. $x$는 한 번 더 구해야 해요.`], [Math.abs(bb * bb - a * a), '빼지 않고 더해요.'], [c + 1, '다시 계산해 보세요.'], [c - 1, '다시 계산해 보세요.'], [a * bb, '곱하지 않아요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  /* ====================================================================== 4. 모눈 위 기울어진 정사각형 */
  const gridOf = (s) => { const u = clamp(Math.round(s.pyU), 1, 6), v = clamp(Math.round(s.pyV), 1, 6); return { u, v, n: u + v, big: (u + v) * (u + v), tri: u * v, S: u * u + v * v }; };
  const grid = {
    id: 'py1-grid', title: '모눈 위 기울어진 정사각형', short: '기울어진 정사각형',
    question: '모눈종이 위에 기울어져 놓인 정사각형의 넓이는 어떻게 구할까? 한 변의 길이를 모르는데도 넓이는 구할 수 있다.',
    ctl: ['pyU', 'pyV'],
    init: (s) => { s.pyU = 2; s.pyV = 3; },
    gen: (s, prev) => { let u, v; do { u = rint(1, 5); v = rint(u + 1, 6); } while (prev && u === prev.pyU && v === prev.pyV); return Math.random() < 0.5 ? { pyU: u, pyV: v } : { pyU: v, pyV: u }; },
    model: (s) => gridOf(s),
    draw(b, s, M, C) {
      const { u, v, n, big, S } = M;
      fit(b, { x0: 0, x1: n, y0: 0, y1: n }, { t: 36, b: C.problem ? 36 : 72, l: 36, r: 36 });
      for (let i = 0; i <= n; i++) { line(b, pt(i, 0), pt(i, n), 'muted', 1.2, { alpha: 0.5 }); line(b, pt(0, i), pt(n, i), 'muted', 1.2, { alpha: 0.5 }); }
      const Pq = [pt(u, 0), pt(n, u), pt(v, n), pt(0, v)]; // 기울어진 정사각형의 꼭짓점 P,Q,R,S
      const corners = [pt(0, 0), pt(n, 0), pt(n, n), pt(0, n)];
      const tris = [[pt(0, 0), Pq[0], Pq[3]], [pt(n, 0), Pq[1], Pq[0]], [pt(n, n), Pq[2], Pq[1]], [pt(0, n), Pq[3], Pq[2]]];
      const showTri = !C.review || C.step >= 2, showSq = !C.review || C.step >= 3 || C.problem;
      poly(b, corners, 'muted', 2.4);
      if (showTri && !C.problem) tris.forEach((t) => fillPoly(b, t, 'sky', 0.22));
      fillPoly(b, Pq, 'amber', C.problem ? 0.3 : 0.26);
      poly(b, Pq, 'amber', 3.6);
      ['P', 'Q', 'R', 'S'].forEach((nm, i) => { b.point(Pq[i], { color: 'amber', r: 5 }); tagOut(b, Pq[i], pt(n / 2, n / 2), nm, { size: 17, gap: 11, color: 'amber' }); });
      // 모눈 위 가로·세로 길이(그림 안)
      T(b, pt(u / 2, 0), `${u}`, { dy: 14, size: 16, color: 'sky' });
      T(b, pt(u + v / 2, 0), `${v}`, { dy: 14, size: 16, color: 'green' });
      T(b, pt(n, u / 2), `${u}`, { dx: -14, size: 16, color: 'sky' });
      T(b, pt(n, u + v / 2), `${v}`, { dx: -14, size: 16, color: 'green' });
      if (!C.problem) {
        if (showTri) tris.forEach((t) => b.right(t[0], t[1], t[2], { size: 11, color: 'sky' }));
        if (C.txt) T(b, pt(n / 2, n / 2), showSq ? `S=${S}` : '', { size: 20, color: 'amber' });
        if (C.txt) T(b, pt(n / 2, n), `큰 정사각형 ${n}×${n}=${big}`, { dy: 50, size: 15, color: 'ink' });
      }
    },
    steps: (M) => [
      `모눈의 가로·세로 간격은 각각 $${M.u}$, $${M.v}$예요. 기울어진 정사각형 PQRS의 넓이를 구해요.`,
      `바깥에 한 변이 $${M.u}+${M.v}=${M.n}$인 큰 정사각형을 잡으면, 모서리에 합동인 직각삼각형 4개가 생겨요.`,
      `큰 정사각형의 넓이는 $${M.n}^2=${M.big}$, 직각삼각형 4개의 넓이는 $4\\times\\frac{${M.u}\\times${M.v}}{2}=${M.tri * 2}$예요.`,
      `PQRS의 넓이는 $${M.big}-${M.tri * 2}=${M.S}$예요. 한 변의 길이를 먼저 구하지 않아도 돼요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>u</b>와 <b>v</b>를 바꿔 보세요. 기울어진 정사각형 PQRS의 한 변은 모눈과 맞지 않지만, <b>큰 정사각형 − 직각삼각형 4개</b>로 넓이를 구할 수 있어요.',
      readouts: [rd('큰 정사각형', `${M.big}`, 'ink', `(${M.u}+${M.v})²`), rd('직각삼각형 4개', `${M.tri * 2}`, 'sky', `4 × ½ × ${M.u} × ${M.v}`), rd('PQRS의 넓이 S', `${M.S}`, 'amber', `${M.u}² + ${M.v}²`)],
      formula: `<p>$S=(${M.u}+${M.v})^2-4\\times\\frac{1}{2}\\times${M.u}\\times${M.v}=${M.big}-${M.tri * 2}=${M.S}$</p><p>$S=u^2+v^2$ (피타고라스 정리와 같은 값)</p>`,
      rule: '모눈 위 기울어진 정사각형의 넓이 = 큰 정사각형 − 직각삼각형 4개 = u²+v²',
      notes: notes('한 변의 길이는 구하지 않아도 돼요. <b>넓이</b>가 바로 $u^2+v^2$이에요.', '직각삼각형은 <b>4개</b>예요. 하나만 빼면 안 돼요.')
    }),
    prob: (M) => {
      const { u, v, n, big, tri, S } = M;
      return {
        tag: '[기본] 기울어진 정사각형의 넓이', key: `${u}-${v}`,
        stem: `다음 그림은 모눈종이 위에 정사각형 PQRS를 그린 것이다. 모눈의 한 칸은 가로·세로가 각각 1인 정사각형일 때, 정사각형 PQRS의 넓이는?`,
        choices: mkChoices(S, [[big, '큰 정사각형의 넓이예요. 직각삼각형 4개를 빼야 해요.'], [S + tri, '직각삼각형을 4개가 아니라 2개만 뺐어요.'], [n * 2, '둘레가 아니라 넓이를 구해요.'], [u * u + v * v + 1, '다시 계산해 보세요.'], [S - 1, '다시 계산해 보세요.'], [u * v, '삼각형 하나의 가로·세로의 곱이에요.']], { tex: (x) => `${x}`, plain: (x) => `${x}` })
      };
    }
  };

  /* ====================================================================== 5. 이어 붙인 두 직각삼각형 */
  const CHAINS = (() => {
    const out = [];
    for (let x = 6; x <= 24; x++) {
      const ms = []; for (let m = 2; m <= 40; m++) if (isSqN(x * x + m * m)) ms.push(m);
      for (let i = 0; i < ms.length; i++) for (let j = i + 1; j < ms.length; j++) { const m = ms[i], n = ms[j] - ms[i]; if (m <= 12 && n <= 12) out.push({ pyX: x, pyM: m, pyN: n }); }
    }
    return out;
  })();
  const chainOf = (s) => {
    const x = clamp(Math.round(s.pyX), 3, 24), m = clamp(Math.round(s.pyM), 2, 12), n = clamp(Math.round(s.pyN), 1, 12);
    const y2 = x * x + m * m, z2 = x * x + (m + n) * (m + n);
    return { x, m, n, y2, z2, yi: lenOrSq(y2), zi: lenOrSq(z2), sum: isSqN(y2) ? x + isq(y2) : null };
  };
  const chain = {
    id: 'py1-chain', title: '이어 붙인 두 직각삼각형', short: '이어 붙인 두 삼각형',
    question: '직각삼각형 두 개가 변을 공유하며 이어져 있다. 공유하는 변 AB를 먼저 구하면 나머지 길이도 차례로 구할 수 있다.',
    ctl: ['pyX', 'pyM', 'pyN'],
    init: (s) => { s.pyX = 8; s.pyM = 6; s.pyN = 9; },
    gen: (s, prev) => { let t; do { t = pick(CHAINS); } while (prev && t.pyX === prev.pyX && t.pyM === prev.pyM && t.pyN === prev.pyN); return { ...t }; },
    model: (s) => chainOf(s),
    draw(b, s, M, C) {
      const { x, m, n, y2, z2, yi, zi } = M, y = Math.sqrt(y2);
      const Bp = pt(0, 0), Ap = pt(0, -x), Dp = pt(m, 0), Cp = pt(m + n, 0);
      fit(b, { x0: 0, x1: m + n, y0: -x, y1: 0 }, { t: 40, b: 60, l: 50, r: 40 });
      const s1 = !C.review || C.step >= 1, s2 = !C.review || C.step >= 2;
      fillPoly(b, [Ap, Bp, Dp], 'sky', s1 ? 0.2 : 0);
      if (s2) fillPoly(b, [Ap, Dp, Cp], 'green', 0.18);
      poly(b, [Ap, Bp, Cp], 'ink', 3.4);
      line(b, Ap, Dp, 'amber', 3.4);
      ang(b, Bp, Cp, Ap, { color: 'amber', r: 20 });
      [['A', Ap, 0, -1], ['B', Bp, -1, 0.5], ['D', Dp, 0, 1], ['C', Cp, 1, 0.5]].forEach(([nm, p, dx, dy]) => { b.point(p, { color: 'ink', r: 4.5 }); T(b, p, nm, { dx: dx * 15, dy: dy * 16, size: 17 }); });
      const cen = pt((m + n) / 2, -x / 2);
      // 값은 그림 안에: 변 위
      T(b, lerp(Ap, Bp, 0.5), C.problem ? 'x' : `x=${x}`, { dx: C.problem ? -14 : -26, size: 17, color: 'amber' });
      T(b, lerp(Bp, Dp, 0.5), `${m}`, { dy: 18, size: 16, color: 'sky' });
      T(b, lerp(Dp, Cp, 0.5), `${n}`, { dy: 18, size: 16, color: 'green' });
      sideTag(b, Ap, Cp, pt(0, 0), zi ? `${zi}` : `z²=${z2}`, { color: 'green', size: 16, gap: 12 });
      sideTag(b, Ap, Dp, Cp, C.problem ? 'y' : (yi ? `y=${yi}` : `y²=${y2}`), { color: 'amber', size: 16, gap: 12 });
    },
    steps: (M) => [
      `$BD=${M.m}$, $DC=${M.n}$, $AC=${M.zi}$예요. $AB=x$, $AD=y$일 때 $x+y$를 구해요.`,
      `큰 직각삼각형 ABC부터 봐요. 밑변 $BC=BD+DC=${M.m}+${M.n}=${M.m + M.n}$예요.`,
      `$x^2=AC^2-BC^2=${M.zi}^2-${M.m + M.n}^2=${M.x * M.x}$이므로 $x=${M.x}$예요.`,
      `작은 직각삼각형 ABD에서 $y^2=x^2+BD^2=${M.x}^2+${M.m}^2=${M.y2}$이므로 $y=${M.yi}$예요.`,
      `따라서 $x+y=${M.x}+${M.yi}=${M.sum}$예요. 두 직각삼각형이 같은 높이 AB를 쓴다는 점을 확인해요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AB, BD, DC</b>를 바꿔 보세요. 직각삼각형 ABD와 ABC가 변 AB를 나눠 쓰는 것을 확인해 보세요. 정수로 딱 떨어지지 않으면 <b>제곱한 값</b>으로 써요.',
      readouts: [rd('y (AD)', M.yi ? `${M.yi}` : `y²=${M.y2}`, 'amber', `${M.x}² + ${M.m}²`), rd('z (AC)', M.zi ? `${M.zi}` : `z²=${M.z2}`, 'green', `${M.x}² + ${M.m + M.n}²`), rd('x + y', M.sum != null ? `${M.sum}` : '정수가 아니에요', 'sky')],
      status: M.sum != null ? { tone: 'ok', text: `x=${M.x}, y=${M.yi}, x+y=${M.sum}` } : { tone: 'info', text: 'y가 정수가 아니에요 (y²를 써요)' },
      formula: `<p>$y^2=x^2+${M.m}^2=${M.y2}$</p><p>$z^2=x^2+${M.m + M.n}^2=${M.z2}$</p>`,
      rule: '직각삼각형이 이어져 있으면 공통인 변부터 구하고 차례로 피타고라스 정리를 쓴다',
      notes: notes('가운데 점 D에서 갈라져요. 큰 삼각형의 밑변은 <b>BD+DC</b>예요.', '$y$를 구할 때는 <b>BD</b>(=' + M.m + ')를, $z$를 구할 때는 <b>BC</b>(=' + (M.m + M.n) + ')를 써요.')
    }),
    prob: (M) => {
      const { x, m, n, yi, zi } = M, y = isq(M.y2);
      return {
        tag: '[기본] 이어 붙인 직각삼각형 x+y', key: `${x}-${m}-${n}`,
        stem: `다음 그림에서 $\\angle B=90^\\circ$, $\\overline{BD}=${m}$, $\\overline{DC}=${n}$, $\\overline{AC}=${zi}$일 때, $x+y$의 값은? ($x=\\overline{AB}$, $y=\\overline{AD}$)`,
        choices: mkChoices(x + y, [[x, '$y$도 더해야 해요.'], [y, '$x$도 더해야 해요.'], [zi * 1 + y, '$x$가 아니라 $AC$를 더했어요.'], [x + m + n, 'BD와 DC가 아니라 $AD$($y$)를 더해요.'], [x + y + 1, '다시 계산해 보세요.'], [x + y - 1, '다시 계산해 보세요.'], [x + y + 2, '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  /* ====================================================================== 6. 직각삼각형의 둘레와 넓이 */
  const PERIM = [[3, 4], [6, 8], [5, 12], [8, 15], [9, 12], [7, 24], [12, 5], [15, 8]];
  const perimOf = (s) => { const a = clamp(Math.round(s.pyWa), 2, 24), b = clamp(Math.round(s.pyWb), 2, 24), c2 = a * a + b * b, ci = lenOrSq(c2); return { a, b, c2, ci, area: (a * b) / 2, per: ci ? a + b + isq(c2) : null, kind: s.pyK || 0 }; };
  const perim = {
    id: 'py1-perim', title: '직각삼각형의 둘레와 넓이', short: '둘레와 넓이',
    question: '두 직각변을 알면 빗변을 구해 둘레를, 밑변과 높이로 넓이를 구할 수 있다. 빗변이 정수가 되는 경우를 찾아보자.',
    ctl: ['pyWa', 'pyWb'],
    presets: () => PERIM.slice(0, 6).map(([a, b], i) => ({ group: i === 0 ? '빗변이 정수가 되는 (a, b)' : '', label: `${a}, ${b}`, apply: (ss) => { ss.pyWa = a; ss.pyWb = b; }, on: (ss) => ss.pyWa === a && ss.pyWb === b })),
    init: (s) => { s.pyWa = 6; s.pyWb = 8; s.pyK = 0; },
    gen: (s, prev) => { let t; do { t = pick(PERIM); } while (prev && t[0] === prev.pyWa && t[1] === prev.pyWb); return { pyWa: t[0], pyWb: t[1], pyK: rint(0, 1) }; },
    model: (s) => perimOf(s),
    draw(b, s, M, C) {
      const { a, b: bb, c2, ci, area, kind } = M;
      const ask = C.problem && kind === 1; // 문제 kind=1: 빗변과 한 직각변을 주고 넓이를 구함(다른 직각변은 숨김)
      figRt(b, a, bb, C, { sq: false, bt: C.problem ? 40 : 100, lab: { a: `${a}`, b: ask ? '' : `${bb}`, c: C.problem && !ask ? '' : ci ? `${ci}` : 'c' }, labOut: true });
      if (!C.problem && C.txt) {
        T(b, pt(a / 2, 0), M.per != null ? `둘레 ${a}+${bb}+${ci}=${M.per}` : `둘레: c²=${c2}`, { dy: 48, size: 17, color: 'amber' });
        T(b, pt(a / 2, 0), `넓이 \\frac{${a}×${bb}}{2}=${fmtN(area)}`, { dy: 80, size: 17, color: 'sky' });
      }
    },
    steps: (M) => [
      M.kind === 1 ? `빗변은 $${M.ci}$, 한 직각변은 $${M.a}$예요. 넓이를 구하려면 다른 직각변 $b$가 필요해요.` : `주어진 두 직각변은 $${M.a}$, $${M.b}$예요. 둘레를 구하려면 빗변 $c$가 필요해요.`,
      M.kind === 1 ? `$b^2=${M.ci}^2-${M.a}^2$예요. 빗변과 직각변을 먼저 구별해요.` : `$c^2=${M.a}^2+${M.b}^2$예요. 직각의 맞은편 변을 찾아요.`,
      M.kind === 1 ? `$b^2=${M.ci}^2-${M.a}^2=${M.c2}-${M.a * M.a}=${M.b * M.b}$이므로 $b=${M.b}$예요.` : `$c^2=${M.a * M.a}+${M.b * M.b}=${M.c2}$이므로 $c=${M.ci}$예요.`,
      M.kind === 1 ? `두 직각변은 서로 수직이므로 밑변 $${M.a}$와 높이 $${M.b}$로 삼각형의 넓이를 구해요.` : `그림의 세 변을 한 번씩 더해요. 둘레는 $a+b+c$예요.`,
      M.kind === 1 ? `넓이 $=\\frac{1}{2}\\times${M.a}\\times${M.b}=${texRat(M.area)}$예요.` : `둘레 $=${M.a}+${M.b}+${M.ci}=${M.per}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>a</b>와 <b>b</b>를 바꿔 보세요. 빗변이 정수가 되는 칩을 누르면 둘레도 정수로 구해져요. 넓이는 항상 두 직각변으로 구해요.',
      readouts: [rd('빗변 c', M.ci ? `${M.ci}` : `c²=${M.c2}`, 'amber'), rd('둘레', M.per != null ? `${M.per}` : '구할 수 없어요', 'green'), rd('넓이', fmtN(M.area), 'sky', `${M.a} × ${M.b} ÷ 2`)],
      formula: `<p>$c^2=${M.a}^2+${M.b}^2=${M.c2}$</p><p>$S=\\frac{1}{2}ab=\\frac{1}{2}\\times${M.a}\\times${M.b}=${fmtN(M.area)}$</p>`,
      rule: '직각삼각형의 넓이 = (직각을 낀 두 변의 곱) ÷ 2, 둘레 = a + b + c',
      notes: notes('넓이는 <b>직각을 낀 두 변</b>으로 구해요. 빗변을 밑변으로 쓰려면 높이를 따로 알아야 해요.', '둘레에는 <b>세 변</b>을 모두 더해요. 빗변을 빠뜨리지 않아요.')
    }),
    prob: (M) => {
      const { a, b: bb, c2, area, kind } = M, c = isq(c2);
      if (kind === 1) {
        return {
          tag: '[기본] 직각삼각형의 넓이', key: `a${a}-${bb}`,
          stem: `다음 직각삼각형에서 빗변의 길이가 $${c}$이고 한 직각변의 길이가 $${a}$일 때, 이 삼각형의 넓이는?`,
          choices: mkChoices(area, [[a * bb, '2로 나누어야 해요(삼각형의 넓이).'], [area + c, '다시 계산해 보세요.'], [a * c / 2, '빗변이 아니라 나머지 직각변을 써요.'], [area + 1, '다시 계산해 보세요.'], [area - 1, '다시 계산해 보세요.'], [(a + bb + c), '둘레예요. 넓이를 구해요.']], { tex: (v) => texRat(v), plain: (v) => plainRat(v) })
        };
      }
      return {
        tag: '[기본] 직각삼각형의 둘레', key: `p${a}-${bb}`,
        stem: `다음 직각삼각형의 직각을 낀 두 변의 길이가 $${a}$, $${bb}$일 때, 이 삼각형의 둘레의 길이는?`,
        choices: mkChoices(a + bb + c, [[a + bb, '빗변까지 더해야 둘레예요.'], [c, '빗변만 구했어요. 세 변을 모두 더해요.'], [area, '넓이를 구했어요. 둘레를 구해요.'], [a + bb + c + 1, '다시 계산해 보세요.'], [a + bb + c - 1, '다시 계산해 보세요.'], [c2, '제곱한 값이에요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  G.figRt = figRt; G.L2 = L2; G.lenOrSq = lenOrSq; G.COL = COL;
  G.register(10, 't1', '① 직각삼각형의 변', '직각삼각형의 변', PARAMS, [sq1, leg, rot, grid, chain, perim]);
})();
