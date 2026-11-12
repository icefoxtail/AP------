/* ==========================================================================
   중2 · 피타고라스 정리 — 탭 ⑧ 「심화 · 수직인 대각선」 (t8.js, order 80) — 장면 3개
   · py8-quad  대각선이 수직인 사각형   · AB² + CD² = AD² + BC²  (그림을 돌려도 성립)
   · py8-rectP 직사각형 속의 점 P       · PA² + PC² = PB² + PD²  (P 를 끌어 보기)
   · py8-cross 직각삼각형 속 X 자 모양   · BE² + CD² = BC² + DE²  (D, E 를 변 위에서 움직이기)
   심화 단원입니다. 길이의 제곱끼리 비교하므로 √ 없이 정수로 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G || !G.figRt) return;
  const { clamp, pt, add, sub, mul, mid, lerp, rotP, T, sideTag, tick, line, poly, fillPoly, ang, fit, P, mkChoices, rd, notes, fmtN, pick, rint, bboxOf, centroid, isSqN, isq, tagOut } = G;
  const DEG = Math.PI / 180;

  const PARAMS = {
    pyQa: P('OA', 1, 12, 1, 3, { color: 'sky', format: (v) => `${v}` }),
    pyQb: P('OB', 1, 12, 1, 4, { color: 'green', format: (v) => `${v}` }),
    pyQc: P('OC', 1, 12, 1, 5, { color: 'amber', format: (v) => `${v}` }),
    pyQd: P('OD', 1, 12, 1, 2, { color: 'rose', format: (v) => `${v}` }),
    pyQr: P('그림 돌리기', 0, 90, 5, 20, { color: 'rose', hint: '돌려도 관계식은 그대로예요', format: (v) => `${Math.round(v)}°` }),
    pyRW: P('직사각형의 가로', 4, 12, 1, 8, { color: 'sky', format: (v) => `${v}` }),
    pyRH: P('직사각형의 세로', 4, 12, 1, 6, { color: 'green', format: (v) => `${v}` }),
    pyPx: P('P의 가로 위치', 1, 11, 1, 3, { color: 'amber', hint: '노란 점을 끌어도 돼요', format: (v) => `${v}` }),
    pyPy: P('P의 세로 위치', 1, 11, 1, 2, { color: 'rose', format: (v) => `${v}` }),
    pyXp: P('AB', 4, 12, 1, 8, { color: 'sky', format: (v) => `${v}` }),
    pyXq: P('AC', 4, 12, 1, 6, { color: 'green', format: (v) => `${v}` }),
    pyXm: P('AD', 1, 11, 1, 3, { color: 'amber', hint: 'AB보다 짧게 맞춰져요', format: (v) => `${v}` }),
    pyXn: P('AE', 1, 11, 1, 2, { color: 'rose', hint: 'AC보다 짧게 맞춰져요', format: (v) => `${v}` })
  };
  const L2 = (name, v2) => (isSqN(v2) ? `${name}=${isq(v2)}` : `${name}²=${v2}`);
  const ne = (v) => isSqN(v) ? isq(v) : null;

  /* ====================================================================== 1. 대각선이 수직인 사각형 */
  // 길이가 정수인 변이 나오는 (OA, OB, OC, OD) 후보
  const QUADS = (() => { const L = []; for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) for (let c = 1; c <= 12; c++) for (let d = 1; d <= 12; d++) if (isSqN(a * a + b * b) && isSqN(b * b + c * c) && isSqN(c * c + d * d) && (a !== c || b !== d)) L.push([a, b, c, d]); return L; })();
  const quadOf = (s) => {
    const a = clamp(Math.round(s.pyQa), 1, 12), b = clamp(Math.round(s.pyQb), 1, 12), c = clamp(Math.round(s.pyQc), 1, 12), d = clamp(Math.round(s.pyQd), 1, 12);
    const AB2 = a * a + b * b, BC2 = b * b + c * c, CD2 = c * c + d * d, DA2 = d * d + a * a;
    return { a, b, c, d, AB2, BC2, CD2, DA2, rot: s.pyQr == null ? 20 : s.pyQr, kind: s.pyKind || 0 };
  };
  const quad = {
    id: 'py8-quad', title: '대각선이 수직인 사각형', short: '대각선이 수직인 사각형',
    question: '두 대각선이 수직으로 만나는 사각형 ABCD에서 마주 보는 두 변의 제곱의 합 AB²+CD² 는 AD²+BC² 와 같을까?',
    ctl: ['pyQa', 'pyQb', 'pyQc', 'pyQd', 'pyQr'],
    init: (s) => { s.pyQa = 3; s.pyQb = 4; s.pyQc = 5; s.pyQd = 2; s.pyQr = 20; s.pyKind = 0; },
    gen: (s, prev) => { let t; do { t = pick(QUADS); } while (prev && prev.pyQa === t[0] && prev.pyQb === t[1] && prev.pyQc === t[2] && prev.pyQd === t[3]); return { pyQa: t[0], pyQb: t[1], pyQc: t[2], pyQd: t[3], pyQr: pick([0, 20, 35, 55, 70]), pyKind: rint(0, 1) }; },
    model: (s) => quadOf(s),
    draw(b, s, M, C) {
      const { a, b: bb, c, d, AB2, BC2, CD2, DA2, rot, kind } = M, prob = C.problem;
      // 대각선 AC(위·아래)와 BD(왼쪽·오른쪽)가 O 에서 수직 → 돌려서 그려요
      const R = (q) => rotP(q, pt(0, 0), rot);
      const O = pt(0, 0), A = R(pt(0, -a)), Cc = R(pt(0, c)), B = R(pt(-bb, 0)), D = R(pt(d, 0));
      const ext = Math.max(a, bb, c, d);
      const shapeBox = bboxOf([A, B, Cc, D]);
      const separateFooter = C.full && !b.thumb && b.W < 900;
      // Reserve space for the outward answer label (for example x²=225).
      fit(b, shapeBox, { t: 44, b: C.full ? (separateFooter ? 96 : 74) : C.answer ? 60 : 44, l: 76, r: 76 });
      const st = (n) => !C.review || C.step >= n;
      fillPoly(b, [A, B, Cc, D], 'ink', 0.07); poly(b, [A, B, Cc, D], 'ink', 3.4);
      if (st(1)) { line(b, A, Cc, 'rose', 2.6, { dash: [7, 6] }); line(b, B, D, 'rose', 2.6, { dash: [7, 6] }); b.right(O, A, B, { size: 11, color: 'rose' }); }
      [[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D']].forEach(([q, nm]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, pt(0, 0), nm, { size: 17, gap: 10 }); });
      b.point(O, { color: 'rose', r: 4 }); T(b, O, 'O', { dx: 12, dy: 12, size: 15, color: 'rose' });
      const sides = [[A, B, 'AB', AB2, 'sky'], [B, Cc, 'BC', BC2, 'green'], [Cc, D, 'CD', CD2, 'sky'], [D, A, 'DA', DA2, 'green']];
      if (C.lesson && !s.pyLessonProblem) {
        sides.forEach(([p, q, nm, v2, col]) => sideTag(b, p, q, O, nm, { color: col, size: 15, gap: 11 }));
        if (st(1)) [[A, 'a'], [B, 'b'], [Cc, 'c'], [D, 'd']].forEach(([p, name]) => T(b, mid(O, p), name, { dx: 10, dy: -10, color: 'rose', size: 16 }));
        if (C.step === 2) { fillPoly(b, [A, O, B], 'sky', 0.16); fillPoly(b, [Cc, O, D], 'sky', 0.16); }
        if (C.step >= 3) { fillPoly(b, [A, O, D], 'green', 0.16); fillPoly(b, [Cc, O, B], 'green', 0.16); }
      } else if (C.full) {
        sides.forEach(([p, q, nm, v2, col]) => sideTag(b, p, q, O, L2(nm, v2), { color: col, size: 15, gap: 11 }));
        if (st(2)) { T(b, pt((shapeBox.x0 + shapeBox.x1) / 2, shapeBox.y1), `${AB2}+${CD2}=${AB2 + CD2}`, { dy: separateFooter ? 48 : 26, size: 16, color: 'sky' }); T(b, pt((shapeBox.x0 + shapeBox.x1) / 2, shapeBox.y1), `${DA2}+${BC2}=${DA2 + BC2}`, { dy: separateFooter ? 72 : 50, size: 16, color: 'green' }); }
      } else {
        // 문제: AB, BC, CD 는 주어진 값(길이), DA 는 구하는 값 x (제곱을 물음)
        const val = { AB: AB2, BC: BC2, CD: CD2 };
        sides.slice(0, 3).forEach(([p, q, nm, v2, col]) => sideTag(b, p, q, O, `${isq(v2)}`, { color: col, size: 17, gap: 11 }));
        sideTag(b, D, A, O, C.answer ? `x²=${DA2}` : 'x', { color: 'amber', size: 17, gap: 11 });
      }
    },
    steps: (M) => [
      `주어진 길이는 $AB=${isq(M.AB2)}$, $BC=${isq(M.BC2)}$, $CD=${isq(M.CD2)}$예요. 대각선 AC와 BD는 O에서 수직으로 만나고 $AD^2=x^2$를 구해요.`,
      `네 직각삼각형에서 $AB^2=OA^2+OB^2$, $CD^2=OC^2+OD^2$예요. 내부 선분의 길이를 따로 알 필요는 없어요.`,
      `같은 네 제곱을 다시 묶으면 $AB^2+CD^2=AD^2+BC^2$예요. 마주 보는 변끼리 같은 색으로 짝지어요.`,
      `$AD^2=AB^2+CD^2-BC^2=${M.AB2}+${M.CD2}-${M.BC2}$예요.`,
      `따라서 $x^2=${M.DA2}$예요. 구하는 것은 길이가 아니라 길이의 제곱이에요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>OA, OB, OC, OD</b>를 바꾸고 <b>그림 돌리기</b>를 움직여 보세요. 대각선이 수직이면 마주 보는 두 변의 제곱의 합은 늘 같아요.',
      readouts: [rd('AB² + CD²', `${M.AB2 + M.CD2}`, 'sky', `${M.AB2} + ${M.CD2}`), rd('AD² + BC²', `${M.DA2 + M.BC2}`, 'green', `${M.DA2} + ${M.BC2}`), rd('차', `${M.AB2 + M.CD2 - M.DA2 - M.BC2}`, 'amber', '항상 0')],
      status: { tone: 'ok', text: `AB²+CD² = AD²+BC² = ${M.AB2 + M.CD2}` },
      formula: `<p>$AB^2+CD^2=(OA^2+OB^2)+(OC^2+OD^2)$</p><p>$AD^2+BC^2=(OA^2+OD^2)+(OB^2+OC^2)$</p><p>두 식이 같아요: $${M.AB2 + M.CD2}$</p>`,
      rule: '두 대각선이 수직인 사각형에서 AB² + CD² = AD² + BC²',
      notes: notes('<b>대각선이 수직일 때만</b> 성립해요. 수직이 아니면 두 값이 달라요.', '마주 보는 두 변끼리(AB와 CD, AD와 BC) 짝지어요. 이웃한 변끼리가 아니에요.')
    }),
    prob: (M) => {
      const { a, b: bb, c, d, AB2, BC2, CD2, DA2 } = M, ans = DA2;
      return {
        tag: '[심화] 수직인 대각선의 관계식', key: `${a}-${bb}-${c}-${d}`,
        stem: `다음 그림과 같이 대각선이 서로 수직인 사각형 ABCD에서 $\\overline{AB}=${isq(AB2)}$, $\\overline{BC}=${isq(BC2)}$, $\\overline{CD}=${isq(CD2)}$일 때, $\\overline{AD}^2=x^2$의 값은?`,
        choices: mkChoices(ans, [[AB2 + BC2 + CD2, '세 변의 제곱을 모두 더하지 않아요.'], [AB2 + BC2 - CD2, 'AD²+BC²=AB²+CD² 에서 BC²를 빼야 해요. 더하면 안 돼요.'], [isq(AB2) + isq(CD2) - isq(BC2), '길이가 아니라 제곱끼리 계산해요.'], [ans + 1, '다시 계산해 보세요.'], [ans - 1, '다시 계산해 보세요.'], [AB2 - CD2 + BC2, '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  /* ====================================================================== 2. 직사각형 속의 점 P */
  const rpOf = (s) => {
    const W = clamp(Math.round(s.pyRW), 4, 12), H = clamp(Math.round(s.pyRH), 4, 12), x = clamp(Math.round(s.pyPx), 1, W - 1), y = clamp(Math.round(s.pyPy), 1, H - 1);
    const PA = x * x + y * y, PB = x * x + (H - y) ** 2, PC = (W - x) ** 2 + (H - y) ** 2, PD = (W - x) ** 2 + y * y;
    return { W, H, x, y, PA, PB, PC, PD, kind: s.pyKind || 0 };
  };
  // 문제용: PB, PD 가 자연수 길이가 되는 (W,H,x,y)
  const RPQ = (() => { const L = []; for (let W = 4; W <= 12; W++) for (let H = 4; H <= 12; H++) for (let x = 1; x < W; x++) for (let y = 1; y < H; y++) { const m = rpOf({ pyRW: W, pyRH: H, pyPx: x, pyPy: y }); if (isSqN(m.PB) && isSqN(m.PD)) L.push([W, H, x, y]); } return L; })();
  const rectP = {
    id: 'py8-rectP', title: '직사각형 속의 점 P', short: '직사각형 속의 점 P',
    question: '직사각형 ABCD 안의 점 P를 움직여도 PA²+PC² 와 PB²+PD² 는 같을까?',
    ctl: ['pyRW', 'pyRH', 'pyPx', 'pyPy'],
    init: (s) => { s.pyRW = 8; s.pyRH = 6; s.pyPx = 3; s.pyPy = 2; s.pyKind = 0; },
    gen: (s, prev) => { let t; do { t = pick(RPQ); } while (prev && prev.pyRW === t[0] && prev.pyRH === t[1] && prev.pyPx === t[2] && prev.pyPy === t[3]); return { pyRW: t[0], pyRH: t[1], pyPx: t[2], pyPy: t[3], pyKind: rint(0, 1) }; },
    model: (s) => rpOf(s),
    draw(b, s, M, C) {
      const { W, H, x, y, PA, PB, PC, PD, kind } = M, prob = C.problem;
      const A = pt(0, 0), Bq = pt(0, H), Cc = pt(W, H), D = pt(W, 0), Pp = pt(x, y); // A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위
      fit(b, { x0: 0, x1: W, y0: 0, y1: H }, { t: 36, b: 40, l: 36, r: 36 });
      const st = (n) => !C.review || C.step >= n;
      fillPoly(b, [A, Bq, Cc, D], 'ink', 0.07); poly(b, [A, Bq, Cc, D], 'ink', 3.4);
      const segs = [[A, 'PA', PA, 'sky'], [Bq, 'PB', PB, 'green'], [Cc, 'PC', PC, 'sky'], [D, 'PD', PD, 'green']];
      if (!prob && st(2)) {
        line(b, pt(0, y), pt(W, y), 'rose', 1.8, { dash: [6, 5] });
        line(b, pt(x, 0), pt(x, H), 'rose', 1.8, { dash: [6, 5] });
        b.right(pt(0, y), Pp, A, { size: 8, color: 'rose' }); b.right(pt(W, y), Pp, Cc, { size: 8, color: 'rose' });
      }
      segs.forEach(([q, nm, v2, col]) => line(b, Pp, q, col, 2.8, { alpha: 0.9 }));
      b.right(A, D, Bq, { size: 10, color: 'ink' }); b.right(Bq, A, Cc, { size: 10, color: 'ink' }); b.right(Cc, Bq, D, { size: 10, color: 'ink' }); b.right(D, Cc, A, { size: 10, color: 'ink' });
      [[A, 'A', -1, -1], [Bq, 'B', -1, 1], [Cc, 'C', 1, 1], [D, 'D', 1, -1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 14, dy: dy * 15, size: 17 }); });
      if (C.givens) { b.point(Pp, { color: 'amber', r: 5.5 }); T(b, Pp, 'P', { dx: 10, dy: -12, size: 17, color: 'amber' }); }
      else b.handle('P', Pp, { color: 'amber', r: 8, ariaLabel: '점 P 끌기', drag: (w) => { s.pyPx = clamp(Math.round(w.x), 1, W - 1); s.pyPy = clamp(Math.round(w.y), 1, H - 1); } });
      if (C.full) T(b, Pp, 'P', { dx: 14, dy: -14, size: 17, color: 'amber' });
      if (C.lesson && !s.pyLessonProblem) {
        segs.forEach(([q, nm, v2, col]) => T(b, lerp(Pp, q, 0.55), nm, { dy: -12, size: 14, color: col }));
        if (st(2)) {
          [[mid(Pp, pt(0, y)), 'a'], [mid(Pp, pt(W, y)), 'b'], [mid(Pp, pt(x, 0)), 'c'], [mid(Pp, pt(x, H)), 'd']].forEach(([p, name]) => T(b, p, name, { dx: 8, dy: -10, size: 15, color: 'rose' }));
        }
      } else if (C.full) {
        segs.forEach(([q, nm, v2, col]) => T(b, lerp(Pp, q, 0.55), L2(nm, v2), { dx: 0, dy: -12, size: 14, color: col }));
        if (st(2)) T(b, pt(W / 2, H), `${PA}+${PC}=${PA + PC}  ·  ${PB}+${PD}=${PB + PD}`, { dy: 30, size: 15, color: 'ink' });
      } else {
        // 문제: 길이(PB, PD)를 주고 PA²+PC² 를 구함 (kind 0) / PA², PB², PC² 를 주고 PD² 를 구함 (kind 1)
        if (kind === 0) { T(b, lerp(Pp, Bq, 0.55), `${isq(PB)}`, { dx: 12, dy: -6, size: 16, color: 'green' }); T(b, lerp(Pp, D, 0.55), `${isq(PD)}`, { dx: 0, dy: -12, size: 16, color: 'green' }); }
        else { T(b, lerp(Pp, A, 0.55), `PA²=${PA}`, { dx: 0, dy: -12, size: 14, color: 'sky' }); T(b, lerp(Pp, Bq, 0.55), `PB²=${PB}`, { dx: 12, dy: -6, size: 14, color: 'green' }); T(b, lerp(Pp, Cc, 0.55), `PC²=${PC}`, { dx: 0, dy: 14, size: 14, color: 'sky' }); T(b, lerp(Pp, D, 0.55), C.answer ? `x²=${PD}` : 'x', { dx: 0, dy: -14, size: 16, color: 'amber' }); }
        if (C.answer && kind === 0) T(b, pt(W / 2, H), `PA²+PC²=${PB}+${PD}=${PB + PD}`, { dy: 30, size: 15, color: 'amber' });
      }
    },
    steps: (M) => [
      M.kind === 1 ? `$PA^2=${M.PA}$, $PB^2=${M.PB}$, $PC^2=${M.PC}$예요. $PD^2=x^2$를 구해요.` : `$PB=${isq(M.PB)}$, $PD=${isq(M.PD)}$예요. 마주 보는 두 꼭짓점까지의 제곱의 합 $PA^2+PC^2$를 구해요.`,
      `P를 지나는 가로·세로 보조선을 그어요. 각 꼭짓점까지의 거리를 직각삼각형의 빗변으로 보면, 그 제곱은 가로 거리의 제곱과 세로 거리의 제곱의 합이에요.`,
      `A와 C, B와 D를 각각 짝지으면 같은 네 제곱이 한 번씩 들어가므로 $PA^2+PC^2=PB^2+PD^2$예요.`,
      M.kind === 1 ? `$PD^2=PA^2+PC^2-PB^2=${M.PA}+${M.PC}-${M.PB}$예요.` : `$PA^2+PC^2=PB^2+PD^2=${isq(M.PB)}^2+${isq(M.PD)}^2=${M.PB}+${M.PD}$예요.`,
      M.kind === 1 ? `따라서 $x^2=${M.PD}$예요.` : `따라서 구하는 제곱의 합은 $${M.PB + M.PD}$예요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 P</b>를 끌거나 막대로 옮겨 보세요. P가 어디에 있어도 $PA^2+PC^2$와 $PB^2+PD^2$는 같아요(모눈 위의 점이라 정수로 계산돼요).',
      readouts: [rd('PA² + PC²', `${M.PA + M.PC}`, 'sky', `${M.PA} + ${M.PC}`), rd('PB² + PD²', `${M.PB + M.PD}`, 'green', `${M.PB} + ${M.PD}`), rd('차', `${M.PA + M.PC - M.PB - M.PD}`, 'amber', '항상 0')],
      status: { tone: 'ok', text: `PA²+PC² = PB²+PD² = ${M.PA + M.PC}` },
      formula: `<p>$PA^2+PC^2=(${M.x}^2+${M.y}^2)+(${M.W - M.x}^2+${M.H - M.y}^2)=${M.PA + M.PC}$</p><p>$PB^2+PD^2=(${M.x}^2+${M.H - M.y}^2)+(${M.W - M.x}^2+${M.y}^2)=${M.PB + M.PD}$</p>`,
      rule: '직사각형 ABCD와 그 안의 점 P에서 PA² + PC² = PB² + PD²',
      notes: notes('<b>마주 보는 꼭짓점</b>(A와 C, B와 D)끼리 짝지어요.', '점 P가 직사각형 바깥에 있어도 성립해요.')
    }),
    prob: (M) => {
      const { PA, PB, PC, PD, kind } = M;
      if (kind === 1) return { tag: '[심화] 직사각형 속 점의 관계식', key: `1-${PA}-${PB}-${PC}`, stem: `다음 그림과 같이 직사각형 ABCD의 내부의 한 점 P에 대하여 $\\overline{PA}^2=${PA}$, $\\overline{PB}^2=${PB}$, $\\overline{PC}^2=${PC}$일 때, $\\overline{PD}^2=x^2$의 값은?`, choices: mkChoices(PD, [[PA + PB + PC, '세 제곱을 모두 더하지 않아요.'], [PA + PC + PB, '다시 계산해 보세요.'], [PA + PB - PC, 'PA²+PC²=PB²+PD² 에서 마주 보는 짝을 확인해요.'], [PD + 1, '다시 계산해 보세요.'], [PD - 1, '다시 계산해 보세요.'], [PB + PC - PA, '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` }) };
      return { tag: '[심화] 직사각형 속 점의 관계식', key: `0-${PB}-${PD}`, stem: `다음 그림과 같이 직사각형 ABCD의 내부의 한 점 P에 대하여 $\\overline{PB}=${isq(PB)}$, $\\overline{PD}=${isq(PD)}$일 때, $\\overline{PA}^2+\\overline{PC}^2$의 값은?`, choices: mkChoices(PB + PD, [[isq(PB) + isq(PD), '길이의 합이 아니라 제곱의 합이에요.'], [PB, 'PB²만 구했어요. PD²도 더해요.'], [PD, 'PD²만 구했어요. PB²도 더해요.'], [Math.abs(PB - PD), '더해야 해요(빼지 않아요).'], [PB + PD + 1, '다시 계산해 보세요.'], [PB + PD - 1, '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` }) };
    }
  };

  /* ====================================================================== 3. 직각삼각형 속 X 자 */
  const crossOf = (s) => {
    const p = clamp(Math.round(s.pyXp), 4, 12), q = clamp(Math.round(s.pyXq), 4, 12), m = clamp(Math.round(s.pyXm), 1, p - 1), n = clamp(Math.round(s.pyXn), 1, q - 1);
    s.pyXm = m; s.pyXn = n;
    return { p, q, m, n, BC2: p * p + q * q, DE2: m * m + n * n, BE2: p * p + n * n, CD2: q * q + m * m, kind: s.pyKind || 0 };
  };
  const XQ = (() => { const L = []; for (let p = 4; p <= 12; p++) for (let q = 4; q <= 12; q++) for (let m = 1; m < p; m++) for (let n = 1; n < q; n++) if (isSqN(p * p + q * q) && isSqN(m * m + n * n)) L.push([p, q, m, n]); return L; })();
  const crossT = {
    id: 'py8-cross', title: '직각삼각형 속의 X자 모양', short: '직각삼각형 속 X자',
    question: '직각삼각형 ABC의 두 변 위에 점 D, E를 잡고 BE, CD를 그으면 BE²+CD² 와 BC²+DE² 는 같을까?',
    ctl: ['pyXp', 'pyXq', 'pyXm', 'pyXn'],
    init: (s) => { s.pyXp = 8; s.pyXq = 6; s.pyXm = 3; s.pyXn = 4; s.pyKind = 0; },
    gen: (s, prev) => { let t; do { t = pick(XQ); } while (prev && prev.pyXp === t[0] && prev.pyXq === t[1] && prev.pyXm === t[2] && prev.pyXn === t[3]); return { pyXp: t[0], pyXq: t[1], pyXm: t[2], pyXn: t[3], pyKind: 0 }; },
    model: (s) => crossOf(s),
    draw(b, s, M, C) {
      const { p, q, m, n, BC2, DE2, BE2, CD2 } = M, prob = C.problem;
      const A = pt(0, 0), B = pt(p, 0), Cc = pt(0, -q), D = pt(m, 0), E = pt(0, -n);
      fit(b, { x0: 0, x1: p, y0: -q, y1: 0 }, { t: 36, b: C.full ? 94 : C.answer ? 68 : 40, l: 40, r: 40 });
      const st = (n2) => !C.review || C.step >= n2;
      fillPoly(b, [A, B, Cc], 'ink', 0.07); poly(b, [A, B, Cc], 'ink', 3.4);
      if (!prob && st(2)) { fillPoly(b, [A, B, E], 'sky', 0.12); fillPoly(b, [A, Cc, D], 'green', 0.12); }
      line(b, B, E, 'sky', 3.4); line(b, Cc, D, 'green', 3.4); line(b, D, E, 'rose', 3);
      ang(b, A, B, Cc, { color: 'amber', r: 18 });
      [[A, 'A', -1, 1], [B, 'B', 1, 1], [Cc, 'C', -1, -1], [D, 'D', 0, 1], [E, 'E', -1, 0]].forEach(([q2, nm, dx, dy]) => { b.point(q2, { color: nm === 'D' || nm === 'E' ? 'rose' : 'ink', r: 4.5 }); T(b, q2, nm, { dx: dx * 14, dy: dy * 15, size: 17 }); });
      if (C.lesson && !s.pyLessonProblem) {
        T(b, lerp(B, E, 0.35), 'BE', { dx: 16, dy: -12, size: 14, color: 'sky' });
        T(b, lerp(Cc, D, 0.3), 'CD', { dx: -17, size: 14, color: 'green' });
        T(b, mid(D, E), 'DE', { dx: -20, dy: 2, size: 14, color: 'rose' });
        sideTag(b, B, Cc, A, 'BC', { color: 'amber', size: 14, gap: 12 });
        T(b, mid(A, D), `${m}`, { dy: 32, size: 15, color: 'amber' });
        T(b, mid(A, E), `${n}`, { dx: -16, size: 15, color: 'rose' });
      } else if (C.full) {
        T(b, lerp(B, E, 0.35), L2('BE', BE2), { dx: 16, dy: -12, size: 14, color: 'sky' }); T(b, lerp(Cc, D, (q - n) / q < 0.45 ? 0.5 : 0.3), L2('CD', CD2), { dx: (q - n) / q < 0.45 ? 28 : -17, dy: 0, size: 14, color: 'green' });
        T(b, mid(A, B), `${p}`, { dy: 36, size: 15, color: 'sky' }); (n > q / 2 ? sideTag(b, A, lerp(A, Cc, 0.4), B, `${q}`, { color: 'green', size: 15, gap: 12 }) : sideTag(b, lerp(A, Cc, 0.6), Cc, B, `${q}`, { color: 'green', size: 15, gap: 12 }));
        T(b, mid(D, E), L2('DE', DE2), { dx: -28, dy: 2, size: 14, color: 'rose' });
        sideTag(b, B, Cc, A, L2('BC', BC2), { color: 'amber', size: 14, gap: 12 });
        if (st(2)) T(b, pt(p / 2, 0), `${BE2}+${CD2}=${BE2 + CD2}`, { dy: 70, size: 15, color: 'ink' });
      } else {
        // 문제: BC, DE 는 길이로 주어지고 BE²+CD² 를 구함
        sideTag(b, B, Cc, A, `${isq(BC2)}`, { color: 'amber', size: 16, gap: 12 }); T(b, mid(D, E), `${isq(DE2)}`, { dx: -8, dy: -12, size: 16, color: 'rose' });
        T(b, lerp(B, E, 0.5), 'BE', { dx: 8, dy: -12, size: 14, color: 'sky' }); T(b, lerp(Cc, D, (q - n) / q < 0.45 ? 0.5 : 0.3), 'CD', { dx: (q - n) / q < 0.45 ? 20 : -17, dy: 0, size: 14, color: 'green' });
        if (C.answer) T(b, pt(p / 2, 0), `BE²+CD²=${BC2}+${DE2}=${BC2 + DE2}`, { dy: 40, size: 15, color: 'amber' });
      }
    },
    steps: (M) => [
      `$\\angle A=90^\\circ$, $BC=${isq(M.BC2)}$, $DE=${isq(M.DE2)}$예요. $BE^2+CD^2$를 구해요.`,
      `직각삼각형 ABE, ACD에서 $BE^2=AB^2+AE^2$, $CD^2=AC^2+AD^2$예요.`,
      `두 식을 더해 항을 다시 묶으면 $BE^2+CD^2=(AB^2+AC^2)+(AD^2+AE^2)=BC^2+DE^2$예요.`,
      `주어진 길이를 제곱해 $BC^2+DE^2=${isq(M.BC2)}^2+${isq(M.DE2)}^2=${M.BC2}+${M.DE2}$를 계산해요.`,
      `따라서 $BE^2+CD^2=${M.BC2 + M.DE2}$예요. BE와 CD를 하나씩 구하지 않아도 돼요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AB, AC, AD, AE</b>를 바꿔 보세요. D, E를 어디에 잡아도 $BE^2+CD^2=BC^2+DE^2$이에요.',
      readouts: [rd('BE² + CD²', `${M.BE2 + M.CD2}`, 'sky', `${M.BE2} + ${M.CD2}`), rd('BC² + DE²', `${M.BC2 + M.DE2}`, 'rose', `${M.BC2} + ${M.DE2}`), rd('차', `${M.BE2 + M.CD2 - M.BC2 - M.DE2}`, 'amber', '항상 0')],
      status: { tone: 'ok', text: `BE²+CD² = BC²+DE² = ${M.BE2 + M.CD2}` },
      formula: `<p>$BE^2+CD^2=(AB^2+AE^2)+(AC^2+AD^2)$</p><p>$BC^2+DE^2=(AB^2+AC^2)+(AD^2+AE^2)$</p>`,
      rule: '∠A=90°인 삼각형에서 D가 AB 위, E가 AC 위에 있을 때 BE² + CD² = BC² + DE²',
      notes: notes('X자로 엇갈린 두 선분 BE, CD와 <b>바깥 변 BC</b>, 안쪽 변 DE예요.', '문제에서 BC와 DE가 주어지면 BE²+CD²는 바로 구해요.')
    }),
    prob: (M) => {
      const { BC2, DE2 } = M, ans = BC2 + DE2;
      return { tag: '[심화] 직각삼각형 속 X자의 관계식', key: `${M.p}-${M.q}-${M.m}-${M.n}`, stem: `다음 그림과 같이 $\\angle A=90^\\circ$인 직각삼각형 ABC의 변 AB 위에 점 D, 변 AC 위에 점 E를 잡았다. $\\overline{BC}=${isq(BC2)}$, $\\overline{DE}=${isq(DE2)}$일 때, $\\overline{BE}^2+\\overline{CD}^2$의 값은?`, choices: mkChoices(ans, [[BC2, 'BC²만 구했어요. DE²도 더해요.'], [BC2 - DE2, '더해야 해요(빼지 않아요).'], [isq(BC2) + isq(DE2), '길이의 합이 아니라 제곱의 합이에요.'], [ans + 1, '다시 계산해 보세요.'], [ans - 1, '다시 계산해 보세요.'], [DE2, 'DE²만 구했어요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` }) };
    }
  };

  G.register(80, 't8', '⑧ 심화 · 수직인 대각선', '심화 · 수직인 대각선', PARAMS, [quad, rectP, crossT]);
})();
