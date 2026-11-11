/* ==========================================================================
   중2 · 피타고라스 정리 — 탭 ④ 「예각·직각·둔각」 (t4.js, order 40) — 장면 5개
   · py4-hinge   경첩 (∠C 바꾸기)   · ∠C 를 돌리면 c² 가 a²+b² 보다 작아지고 커져요 — 두 개의 가로 막대로 비교 (√ 없음)
   · py4-acute   세 변 (5, 6, 7) 예각 판별      · 가장 긴 변의 제곱과 나머지 두 변의 제곱의 합 비교
   · py4-obtuse  세 변 (4, 5, 7) 둔각 판별
   · py4-orange  둔각삼각형이 되는 자연수 x   · 수직선 위에서 x 를 하나씩
   · py4-arange  예각삼각형이 되는 자연수 x   · 가장 긴 변이 정해지지 않았을 때 두 경우로 나누기
   길이의 제곱끼리 비교하므로 제곱근이 필요 없습니다. 값은 모두 지금의 길이로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G) return;
  const { clamp, pt, add, sub, mul, mid, lerp, unit, DEG, T, tagOut, sideTag, tick, line, poly, fillPoly, ang, fit, P, mkChoices, mkTextChoices, rd, notes, fmtN, pick, rint, bboxOf, triSSS, centroid, angBetween, r1 } = G;

  const PARAMS = {
    pyHa: P('변 a (BC)', 3, 10, 1, 8, { color: 'sky', format: (v) => `${v}` }),
    pyHb: P('변 b (CA)', 3, 10, 1, 6, { color: 'green', format: (v) => `${v}` }),
    pyHang: P('∠C의 크기', 30, 150, 1, 90, { color: 'rose', hint: '노란 점을 끌어도 돼요', format: (v) => `${Math.round(v)}°` }),
    pyJa: P('변 1', 2, 12, 1, 5, { color: 'sky', format: (v) => `${v}` }),
    pyJb: P('변 2', 2, 12, 1, 6, { color: 'green', format: (v) => `${v}` }),
    pyJc: P('변 3', 2, 12, 1, 7, { color: 'amber', format: (v) => `${v}` }),
    pyRp: P('주어진 변 p', 2, 8, 1, 4, { color: 'sky', format: (v) => `${v}` }),
    pyRq: P('주어진 변 q', 2, 9, 1, 5, { color: 'green', format: (v) => `${v}` }),
    pyRx: P('자연수 x', 1, 16, 1, 7, { color: 'amber', hint: '수직선의 숫자를 눌러도 돼요', format: (v) => `${v}` })
  };
  const TY = { acute: '예각', right: '직각', obtuse: '둔각' };
  const TYC = { acute: 'sky', right: 'green', obtuse: 'rose' };
  function lessonTrace(b, points, s, C) {
    if (!C.lesson) return;
    const t = clamp(s.pyBT || 0, 0, 1) * (points.length - 1);
    for (let i = 0; i < points.length - 1; i++) if (t > i) line(b, points[i], lerp(points[i], points[i + 1], Math.min(1, t - i)), 'amber', 6, { alpha: .8 });
  }
  // 세 변 → 삼각형이 되는지, 가장 긴 변과 종류 (제곱끼리 비교)
  function classify(p, q, r) {
    const s = [p, q, r].slice().sort((a, b) => a - b), [x, y, z] = s;
    if (x + y <= z) return { ok: false, s };
    const sum = x * x + y * y, zz = z * z;
    return { ok: true, s, L: z, sum, zz, type: zz < sum ? 'acute' : zz === sum ? 'right' : 'obtuse' };
  }
  const cmpTxt = (zz, sum) => (zz < sum ? '<' : zz === sum ? '=' : '>');
  const typeItems = (correct, key) => {
    const names = { acute: '예각삼각형', right: '직각삼각형', obtuse: '둔각삼각형' };
    const hints = { acute: '가장 긴 변의 제곱이 나머지 두 변의 제곱의 합보다 작으면 예각삼각형이에요.', right: '가장 긴 변의 제곱이 나머지 두 변의 제곱의 합과 같을 때만 직각삼각형이에요.', obtuse: '가장 긴 변의 제곱이 나머지 두 변의 제곱의 합보다 크면 둔각삼각형이에요.' };
    const items = ['acute', 'right', 'obtuse'].map((t) => ({ h: names[t], ok: t === correct, hint: t === correct ? '' : hints[correct] }));
    items.push({ h: '삼각형이 만들어지지 않는다', ok: false, hint: '가장 긴 변이 나머지 두 변의 합보다 짧으니 삼각형이 만들어져요.' });
    items.push({ h: '주어진 조건만으로는 알 수 없다', ok: false, hint: '세 변의 길이가 모두 주어지면 가장 긴 변의 제곱과 나머지 두 변의 제곱의 합을 비교해 알 수 있어요.' });
    return mkTextChoices(items, key);
  };
  /* ====================================================================== 1. 경첩 */
  const hingeOf = (s) => {
    const a = clamp(Math.round(s.pyHa), 3, 10), b = clamp(Math.round(s.pyHb), 3, 10), th = clamp(s.pyHang == null ? 90 : s.pyHang, 30, 150);
    const A = pt(b * Math.cos(th * DEG), -b * Math.sin(th * DEG)), B = pt(a, 0);
    let c2 = Math.hypot(A.x - B.x, A.y - B.y) ** 2; if (Math.abs(c2 - Math.round(c2)) < 1e-7) c2 = Math.round(c2);
    const sum = a * a + b * b, rightNow = Math.abs(c2 - sum) < 1e-6;
    return { a, b, th, A, B, c2, sum, type: rightNow ? 'right' : c2 < sum ? 'acute' : 'obtuse', kind: s.pyKind || 0 };
  };
  const hinge = {
    id: 'py4-hinge', title: '∠C를 돌려 보기 (경첩)', short: '경첩 (∠C 바꾸기)',
    question: '두 변 a, b를 경첩처럼 벌리면 ∠C가 커진다. ∠C가 예각·직각·둔각일 때 빗변 쪽 변 c의 제곱은 a²+b²와 어떻게 다를까?',
    ctl: ['pyHa', 'pyHb', 'pyHang'],
    presets: () => [65, 90, 115, 130].map((d, i) => ({ group: i === 0 ? '∠C의 크기' : '', label: `${d}°`, apply: (ss) => { ss.pyHang = d; }, on: (ss) => Math.round(ss.pyHang) === d })),
    init: (s) => { s.pyHa = 8; s.pyHb = 6; s.pyHang = 90; s.pyKind = 0; },
    gen: (s, prev) => {
      let a, b, kind, th, c2;
      do {
        a = rint(4, 10); b = rint(3, Math.min(10, a)); kind = rint(0, 1);
        const sum = a * a + b * b;
        const lo = (a - b) * (a - b) + 1, hi = (a + b) * (a + b) - 1;
        const t = pick(['acute', 'right', 'obtuse']);
        c2 = t === 'right' ? sum : t === 'acute' ? rint(Math.max(lo, sum - 2 * a * b + 1), sum - 1) : rint(sum + 1, Math.min(hi, sum + 2 * a * b - 1));
        if (kind === 0) { // 세 변이 모두 정수: c² 가 제곱수가 되는 값만
          const cands = []; for (let c = Math.abs(a - b) + 1; c < a + b; c++) cands.push(c);
          const c = pick(cands); c2 = c * c;
        }
        th = Math.acos(clamp((sum - c2) / (2 * a * b), -1, 1)) / DEG;
      } while (th < 31 || th > 149 || (prev && prev.pyHa === a && prev.pyHb === b && Math.abs(prev.pyHang - th) < 0.5));
      return { pyHa: a, pyHb: b, pyHang: th, pyKind: kind };
    },
    model: (s) => hingeOf(s),
    draw(b, s, M, C) {
      const { a, b: bb, A, B, c2, sum, th, type, kind } = M, prob = C.problem;
      const O = pt(0, 0);
      const bx = bboxOf([pt(-bb, -bb), pt(a + 1, 1)]);
      // 위: 삼각형 / 아래: 가로 막대 두 개(a²+b² 와 c²)
      const scale = Math.max(sum, sum + 2 * a * bb * 0.9) ;
      const barW = a + bb + 1.2;
      const shape = bboxOf([O, A, B]), barLeft = C.full ? -bb : shape.x0, barRight = a;
      fit(b, { x0: barLeft - 0.5, x1: a + 0.8, y0: C.full ? -bb - 0.4 : shape.y0 - 0.4, y1: prob ? 0.3 : 4.2 }, { t: 30, b: 34, l: 30, r: 30 });
      const st = (n) => C.lesson ? !!s.pyBBarReady : !C.review || C.step >= n;
      fillPoly(b, [O, B, A], C.answer ? TYC[type] : 'ink', C.answer ? 0.14 : 0.06);
      line(b, O, B, 'sky', 4); line(b, O, A, 'green', 4);
      line(b, A, B, 'amber', 4);
      lessonTrace(b, [B, O, A, B], s, C);
      ang(b, O, B, A, { color: C.answer ? TYC[type] : 'rose', r: 26, label: C.answer ? C.lesson ? TY[type] : `${Math.round(th)}°` : '', rings: 1, noRight: !C.answer });
      [[O, 'C', -1, -1], [B, 'B', 1, 1], [A, 'A', 0, -1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 14, dy: dy * 16, size: 17 }); });
      T(b, mid(O, B), `${a}`, { dy: 18, size: 17, color: 'sky' });
      sideTag(b, O, A, B, `${bb}`, { color: 'green', size: 17, gap: 11 });
      if (C.lesson) sideTag(b, A, B, O, s.pyLessonProblem ? kind === 1 ? `c²=${fmtN(c2)}` : `c=${Math.round(Math.sqrt(c2))}` : C.answer ? `c²=${fmtN(c2)}` : 'c', { color: 'amber', size: 16, gap: 12 });
      else if (C.full || C.review && C.step >= 2 || kind === 1) sideTag(b, A, B, O, prob ? `AB²=${c2}` : `c²${Math.abs(c2 - Math.round(c2)) < 1e-9 ? '=' : '≈'}${fmtN(c2)}`, { color: 'amber', size: 16, gap: 12 });
      else sideTag(b, A, B, O, `${Math.round(Math.sqrt(c2))}`, { color: 'amber', size: 16, gap: 12 });
      if (!prob && !C.review && C.txt) b.handle('th', A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 끌기', drag: (w) => { s.pyHang = clamp(Math.round(Math.atan2(-w.y, w.x) / DEG), 30, 150); } });
      if (prob) return;
      // 두 막대: a²+b² (파랑+초록) / c² (노랑)  — 길이는 넓이(제곱)에 비례
      const U = (barRight - barLeft) / Math.max(sum, c2);
      const y1 = 1.5, y2 = 3.3, h = 0.65, x0 = barLeft;
      if (st(2)) {
        fillPoly(b, [pt(x0, y1), pt(x0 + a * a * U, y1), pt(x0 + a * a * U, y1 + h), pt(x0, y1 + h)], 'sky', 0.3);
        fillPoly(b, [pt(x0 + a * a * U, y1), pt(x0 + sum * U, y1), pt(x0 + sum * U, y1 + h), pt(x0 + a * a * U, y1 + h)], 'green', 0.3);
        fillPoly(b, [pt(x0, y2), pt(x0 + c2 * U, y2), pt(x0 + c2 * U, y2 + h), pt(x0, y2 + h)], 'amber', 0.3);
        poly(b, [pt(x0, y1), pt(x0 + sum * U, y1), pt(x0 + sum * U, y1 + h), pt(x0, y1 + h)], 'ink', 2); poly(b, [pt(x0, y2), pt(x0 + c2 * U, y2), pt(x0 + c2 * U, y2 + h), pt(x0, y2 + h)], 'ink', 2);
        T(b, pt(x0, y1), C.lesson && !C.calculation ? 'a²+b²' : `a²+b²=${a * a}+${bb * bb}=${sum}`, { dy: -12, align: 'left', size: 15, color: 'ink' });
        T(b, pt(x0, y2), C.lesson && (!C.calculation || !s.pyLessonProblem && !C.answer) ? 'c²' : `c² ${Math.abs(c2 - Math.round(c2)) < 1e-9 ? '=' : '≈'} ${fmtN(c2)}`, { dy: -12, align: 'left', size: 15, color: 'amber' });
      }
    },
    steps: (M) => [
      `$BC=${M.a}$, $CA=${M.b}$${M.kind === 1 ? `, $AB^2=${M.c2}$` : `, $AB=${Math.round(Math.sqrt(M.c2))}$`}예요. 비교할 각은 AB의 맞은편 $\\angle C$예요.`,
      `$BC^2+CA^2=${M.a}^2+${M.b}^2=${M.sum}$을 하늘색·초록색 막대로, $AB^2=${M.c2}$을 노란 막대로 나타내요.`,
      `$AB^2${M.type === 'acute' ? '\\lt' : M.type === 'right' ? '=' : '\\gt'} BC^2+CA^2$이므로 $\\angle C$는 ${TY[M.type]}이에요. 삼각형 전체의 종류가 아니라 지정된 각을 판별해요.`
    ],
    view: (M) => ({
      guide: '막대나 <b>노란 점</b>을 끌어 ∠C를 바꿔 보세요. 파랑+초록 막대는 $a^2+b^2$, 노랑 막대는 $c^2$이에요. 노랑이 짧으면 예각, 같으면 직각, 길면 둔각이에요.',
      readouts: [rd('a² + b²', `${M.sum}`, 'sky', `${M.a * M.a} + ${M.b * M.b}`), rd('c² (AB²)', `${fmtN(M.c2)}`, 'amber', Math.abs(M.c2 - Math.round(M.c2)) < 1e-9 ? '' : '대략의 값'), rd('∠C', `${TY[M.type]}`, TYC[M.type], `${Math.round(M.th)}°`)],
      status: { tone: M.type === 'right' ? 'ok' : 'info', text: `∠C=${Math.round(M.th)}° → ${TY[M.type]} (c² ${cmpTxt(M.c2, M.sum)} a²+b²)` },
      formula: `<p>$a^2+b^2=${M.sum}$, $c^2${M.c2 === Math.round(M.c2) ? '=' : '\\approx'}${fmtN(M.c2)}$</p><p>$c^2${M.type === 'acute' ? '\\lt' : M.type === 'right' ? '=' : '\\gt'}a^2+b^2$ ⟹ ∠C는 ${TY[M.type]}</p>`,
      rule: '∠C가 예각 ⟺ c² < a²+b² · 직각 ⟺ c² = a²+b² · 둔각 ⟺ c² > a²+b²',
      notes: notes('∠C는 <b>c의 맞은편 각</b>이에요. 삼각형 전체가 예각이려면 세 각이 모두 예각이어야 해요.', '길이가 아니라 <b>제곱끼리</b> 비교해요.')
    }),
    prob: (M) => {
      const { a, b: bb, c2, type, kind } = M, c = Math.round(Math.sqrt(c2));
      const key = `h${kind}-${a}-${bb}-${c2}`;
      return {
        tag: '[판별] ∠C의 종류', key,
        stem: kind === 1
          ? `다음 삼각형 ABC에서 $\\overline{BC}=${a}$, $\\overline{CA}=${bb}$, $\\overline{AB}^2=${c2}$일 때, $\\angle C$는?`
          : `다음 삼각형 ABC에서 $\\overline{BC}=${a}$, $\\overline{CA}=${bb}$, $\\overline{AB}=${c}$일 때, $\\angle C$는?`,
        choices: mkTextChoices([
          { h: '예각', ok: type === 'acute', hint: '$c^2$이 $a^2+b^2$보다 작을 때만 예각이에요.' },
          { h: '직각', ok: type === 'right', hint: '$c^2=a^2+b^2$일 때만 직각이에요.' },
          { h: '둔각', ok: type === 'obtuse', hint: '$c^2$이 $a^2+b^2$보다 클 때만 둔각이에요.' },
          { h: '평각', ok: false, hint: '평각은 180°라서 삼각형의 각이 될 수 없어요.' },
          { h: '알 수 없다', ok: false, hint: '$c^2$과 $a^2+b^2$을 비교하면 알 수 있어요.' }
        ], key)
      };
    }
  };

  /* ====================================================================== 2·3. 세 변으로 판별 */
  const judgeOf = (s) => { const a = clamp(Math.round(s.pyJa), 2, 12), b = clamp(Math.round(s.pyJb), 2, 12), c = clamp(Math.round(s.pyJc), 2, 12); return { a, b, c, ...classify(a, b, c) }; };
  const JUDGE_GEN = (want) => (s, prev) => {
    const previous = prev && [prev.pyJa, prev.pyJb, prev.pyJc].sort((a, b) => a - b);
    let a, b, c, t;
    do {
      t = want || pick(['acute', 'right', 'obtuse']);
      if (t === 'right') { const tr = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]); [a, b, c] = tr; }
      else { a = rint(3, 9); b = rint(a, 11); c = rint(b, 12); }
      const cl = classify(a, b, c);
      if (!cl.ok || cl.type !== t) continue;
      if (previous && cl.s.every((v, i) => v === previous[i])) continue;
      const sh = [a, b, c].sort(() => Math.random() - 0.5); [a, b, c] = sh;
      break;
    } while (true);
    return { pyJa: a, pyJb: b, pyJc: c };
  };
  function judgeScene(o) {
    return {
      id: o.id, title: o.title, short: o.short, question: o.question,
      ctl: ['pyJa', 'pyJb', 'pyJc'],
      presets: () => o.chips.map(([a, b, c], i) => ({ group: i === 0 ? '세 변의 길이' : '', label: `(${a}, ${b}, ${c})`, apply: (ss) => { ss.pyJa = a; ss.pyJb = b; ss.pyJc = c; }, on: (ss) => ss.pyJa === a && ss.pyJb === b && ss.pyJc === c })),
      init: (s) => { [s.pyJa, s.pyJb, s.pyJc] = o.start; },
      gen: JUDGE_GEN(null),
      model: (s) => judgeOf(s),
      draw(b, s, M, C) {
        const { a, b: bb, c, ok, s: srt } = M, prob = C.problem;
        if (!ok) {
          fit(b, { x0: 0, x1: 10, y0: -3, y1: 0 }, { t: 30, b: 30 });
          T(b, pt(5, -1.5), `${srt[0]}+${srt[1]} ≤ ${srt[2]}`, { size: 22, color: 'rose' });
          T(b, pt(5, -0.4), '삼각형이 만들어지지 않아요', { size: 16, color: 'rose' });
          T(b, pt(5, -0.4), '가장 긴 변 ≥ 나머지 두 변의 합', { dy: 24, size: 14, color: 'ink' });
          return;
        }
        const [m1, m2, L] = srt;
        const Tr = triSSS(m2, m1, L); // A(0,0) B(L,0) C(위) : BC=m2, CA=m1, AB=L
        const [A, B, Cc] = Tr, cen = centroid(Tr);
        const box = bboxOf(Tr);
        fit(b, { x0: box.x0, x1: box.x1, y0: box.y0, y1: box.y1 + 1.8 }, { t: 40, b: 74, l: 36, r: 36 });
        const st = (n) => !C.review || C.step >= n;
        const ty = M.type;
        fillPoly(b, Tr, C.answer ? TYC[ty] : 'ink', C.answer ? 0.16 : 0.06);
        poly(b, Tr, 'ink', 3.4);
        if (C.lesson) lessonTrace(b, [A, B], s, C);
        else line(b, A, B, 'amber', 6, { alpha: st(1) ? 0.9 : 0 });
        ang(b, Cc, A, B, { color: C.answer ? TYC[ty] : 'rose', r: 28, rings: 1, noRight: !C.answer });
        [[A, 'A', -1, 1], [B, 'B', 1, 1], [Cc, 'C', 0, -1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 14, dy: dy * 16, size: 17 }); });
        sideTag(b, A, B, Cc, `${L}`, { color: 'amber', size: 17, gap: 12 });
        sideTag(b, Cc, A, B, `${m1}`, { color: 'green', size: 17, gap: 12 });
        sideTag(b, B, Cc, A, `${m2}`, { color: 'sky', size: 17, gap: 12 });
        if (!prob && C.txt && (C.lesson ? C.calculation : st(2))) { T(b, pt(L / 2, 0), `가장 긴 변의 제곱 ${L}²=${L * L}`, { dy: 46, size: 15, color: 'amber' }); T(b, pt(L / 2, 0), `나머지 제곱의 합 ${m1}²+${m2}²=${M.sum}`, { dy: 68, size: 15, color: 'ink' }); }
      },
      steps: (M) => M.ok ? [
        `세 변 중 가장 긴 변은 $${M.L}$이에요. 가장 긴 변의 맞은편 각이 가장 큰 각이에요.`,
        `가장 긴 변의 제곱 $${M.L}^2=${M.zz}$과 나머지 두 변의 제곱의 합 $${M.s[0]}^2+${M.s[1]}^2=${M.sum}$를 비교해요.`,
        `$${M.zz}${M.zz < M.sum ? '\\lt' : M.zz === M.sum ? '=' : '\\gt'}${M.sum}$이므로 ${TY[M.type]}삼각형이에요.`
      ] : ['세 변 중 가장 긴 변이 나머지 두 변의 합 이상이면 삼각형이 만들어지지 않아요. 변의 길이를 바꿔 보세요.'],
      view: (M) => M.ok ? ({
        guide: '막대나 칩으로 <b>세 변의 길이</b>를 바꿔 보세요. 가장 긴 변의 제곱과 나머지 두 변의 제곱의 합을 비교하면 삼각형의 종류를 알 수 있어요.',
        readouts: [rd('가장 긴 변의 제곱', `${M.zz}`, 'amber', `${M.L}²`), rd('나머지 제곱의 합', `${M.sum}`, 'sky', `${M.s[0]}² + ${M.s[1]}²`), rd('삼각형의 종류', `${TY[M.type]}삼각형`, TYC[M.type], `${M.zz} ${cmpTxt(M.zz, M.sum)} ${M.sum}`)],
        status: { tone: M.type === 'right' ? 'ok' : 'info', text: `${TY[M.type]}삼각형 (${M.zz} ${cmpTxt(M.zz, M.sum)} ${M.sum})` },
        formula: `<p>$${M.L}^2=${M.zz}$, $${M.s[0]}^2+${M.s[1]}^2=${M.sum}$</p>`,
        rule: '가장 긴 변의 제곱 < 나머지 두 변의 제곱의 합 → 예각삼각형, = → 직각삼각형, > → 둔각삼각형',
        notes: notes('먼저 <b>가장 긴 변</b>을 찾아요. 가장 긴 변이 아닌 변을 빗변처럼 쓰면 틀려요.', '삼각형이 만들어지는지 (가장 긴 변 < 나머지 두 변의 합) 부터 확인해요.')
      }) : ({
        guide: '세 변의 길이가 삼각형이 되는 값이 되도록 막대를 바꿔 보세요.', readouts: [],
        status: { tone: 'warn', text: '삼각형이 만들어지지 않아요' }, rule: '삼각형이 되려면 가장 긴 변 < 나머지 두 변의 합'
      }),
      prob: (M) => {
        const key = `${M.a}-${M.b}-${M.c}`;
        return { tag: '[판별] 세 변으로 삼각형의 종류', key, stem: `세 변의 길이가 $${M.a}$, $${M.b}$, $${M.c}$인 삼각형은 어떤 삼각형인가?`, choices: typeItems(M.type, key), wide: false };
      }
    };
  }
  const acuteEx = judgeScene({ id: 'py4-acute', title: '세 변 (5, 6, 7) 예각 판별', short: '(5, 6, 7) 예각', start: [5, 6, 7], chips: [[5, 6, 7], [6, 7, 8], [4, 6, 7], [7, 8, 9]], question: '세 변이 5, 6, 7인 삼각형은 예각삼각형일까? 가장 긴 변의 제곱을 비교해 보자.' });
  const obtuseEx = judgeScene({ id: 'py4-obtuse', title: '세 변 (4, 5, 7) 둔각 판별', short: '(4, 5, 7) 둔각', start: [4, 5, 7], chips: [[4, 5, 7], [3, 4, 6], [2, 3, 4], [5, 6, 10]], question: '세 변이 4, 5, 7인 삼각형은 둔각삼각형일까? 두 변의 합이 가장 긴 변보다 길어도 둔각이 될 수 있다.' });

  /* ====================================================================== 4·5. 자연수 x 의 범위 */
  const rangeOf = (s) => {
    const p = clamp(Math.round(s.pyRp), 2, 8), q0 = clamp(Math.round(s.pyRq), 2, 9);
    const lo = Math.min(p, q0), hi = Math.max(p, q0), n1 = hi - lo + 1, n2 = hi + lo - 1; // 가능한 자연수 x: n1 ≤ x ≤ n2
    const xs = []; for (let x = Math.max(1, n1); x <= n2; x++) xs.push({ x, ...classify(p, q0, x) });
    const x = clamp(Math.round(s.pyRx), 1, 16), cur = classify(p, q0, x);
    const by = (t) => xs.filter((r) => r.type === t).map((r) => r.x);
    return { p: lo, q: hi, n1, n2, xs, x, cur, acute: by('acute'), right: by('right'), obtuse: by('obtuse'), ask: s.pyAsk || 'obtuse' };
  };
  const listTxt = (a) => (a.length ? a.join(', ') : '없음');
  function rangeScene(o) {
    const sc = {
      id: o.id, title: o.title, short: o.short, question: o.question,
      ctl: ['pyRp', 'pyRq', 'pyRx'],
      init: (s) => { s.pyRp = o.start[0]; s.pyRq = o.start[1]; s.pyRx = o.start[2]; s.pyAsk = o.ask; },
      gen: (s, prev) => {
        let p, q;
        do { p = rint(3, 7); q = rint(p, 9); } while (prev && prev.pyRp === p && prev.pyRq === q);
        return { pyRp: p, pyRq: q, pyRx: Math.max(1, Math.floor((q - p + 1 + q + p - 1) / 2)), pyAsk: o.ask };
      },
      model: (s) => ({ ...rangeOf(s), ask: o.ask }),
      draw(b, s, M, C) {
        const { p, q, xs, n1, n2, x, cur, ask } = M, prob = C.problem;
        if (C.full && !cur.ok) {
          const [u, v, longest] = [p, q, x].sort((a, z) => a - z);
          fit(b, { x0: 0, x1: longest, y0: -3, y1: 1 }, { t: 40, b: 50, l: 34, r: 34 });
          line(b, pt(0, -2), pt(u, -2), 'sky', 5); line(b, pt(u, -2), pt(u + v, -2), 'green', 5);
          line(b, pt(0, 0), pt(longest, 0), 'amber', 5);
          T(b, pt(longest / 2, -2), `${u}+${v} ≤ ${longest}`, { dy: -24, size: 18, color: 'ink' });
          T(b, pt(longest / 2, 0), `x=${x}: 삼각형이 만들어지지 않아요`, { dy: 28, size: 15, color: 'rose' });
          return;
        }
        const xm = prob ? Math.round((n1 + n2) / 2) : clamp(x, n1, n2), tr = classify(p, q, xm);
        const sides = tr.ok ? tr.s : [p, q, Math.max(1, n1)];
        const Tr = triSSS(sides[1], sides[0], sides[2]);
        const bx = bboxOf(Tr), W = Math.max(bx.x1 - bx.x0, 9), nn = n2 - n1 + 1;
        const step = W / (nn + 1);
        fit(b, { x0: bx.x0, x1: bx.x0 + W, y0: bx.y0, y1: bx.y1 + 3.4 }, { t: 36, b: 38, l: 26, r: 26 });
        const st = (n) => !C.review || C.step >= n;
        const [A, B, Cc] = Tr;
        fillPoly(b, Tr, C.answer && tr.ok ? TYC[tr.type] : 'ink', C.answer ? 0.14 : 0.06);
        poly(b, Tr, 'ink', 3.4);
        lessonTrace(b, [A, B, Cc, A], s, C);
        if (tr.ok) ang(b, Tr[2], A, B, { color: C.answer ? TYC[tr.type] : 'rose', r: 26, noRight: !C.answer });
        [[A, 'A', -1, 1], [B, 'B', 1, 1], [Cc, 'C', 0, -1]].forEach(([q2, nm, dx, dy]) => { b.point(q2, { color: 'ink', r: 4.5 }); T(b, q2, nm, { dx: dx * 14, dy: dy * 16, size: 17 }); });
        // 변 길이: 주어진 p, q 는 값, x 는 문제에서 문자
        const lens = [[A, B, sides[2]], [Cc, A, sides[0]], [B, Cc, sides[1]]];
        // x 가 p 또는 q 와 같을 때도 한 변만 x 로 표시
        let xUsed = false;
        const used = [p, q].slice();
        lens.forEach(([P1, P2, len], i) => {
          let t = `${len}`;
          const idxUsed = used.indexOf(len);
          if (idxUsed >= 0) used.splice(idxUsed, 1); else if (!xUsed) { t = C.givens || C.lesson ? 'x' : `x=${len}`; xUsed = true; }
          sideTag(b, P1, P2, centroid(Tr), t, { color: t[0] === 'x' ? 'amber' : (i === 0 ? 'amber' : i === 1 ? 'green' : 'sky'), size: 17, gap: 12 });
        });
        if (prob) return;
        // 수직선: 가능한 자연수 x 를 점으로 (색 = 예각/직각/둔각)
        const y = bx.y1 + 2.0, x0 = bx.x0 + step * 0.7;
        line(b, pt(bx.x0, y), pt(bx.x0 + W, y), 'muted', 2);
        if (!C.lesson || s.pyBRangeReady) xs.forEach((r, i) => {
          const px = pt(x0 + i * step, y);
          const classified = C.lesson ? C.answer : C.full || C.step >= (r.x > q ? 2 : 3), col = classified ? TYC[r.type] : 'muted';
          const hit = C.answer && r.type === ask;
          b.point(px, { color: col, r: r.x === x && C.full ? 12 : 9, hollow: !hit });
          T(b, px, `${r.x}`, { size: 13, color: 'ink' });
        });
        if (C.full) b.handle('xh', pt(x0 + Math.max(0, Math.min(nn - 1, x - n1)) * step, y), { color: 'amber', r: 7, ariaLabel: 'x 고르기', drag: (w) => { const i = clamp(Math.round((w.x - x0) / step), 0, nn - 1); s.pyRx = n1 + i; } });
        if (C.txt && C.answer) { T(b, pt(bx.x0 + W / 2, y), `${TY[ask]}삼각형이 되는 x`, { dy: 26, size: 14, color: TYC[ask] }); T(b, pt(bx.x0 + W / 2, y), listTxt(M[ask]), { dy: 46, size: 14, color: 'ink' }); }
      },
      steps: (M) => [
        `삼각형이 되려면 $|${M.q}-${M.p}|\\lt x\\lt ${M.q}+${M.p}$, 즉 $${M.n1}\\le x\\le ${M.n2}$인 자연수예요.`,
        `가장 긴 변이 $x$일 때: $x^2\\gt ${M.p}^2+${M.q}^2=${M.p * M.p + M.q * M.q}$이면 둔각, $x^2=${M.p * M.p + M.q * M.q}$이면 직각, 작으면 예각이에요.`,
        `가장 긴 변이 $${M.q}$일 때($x\\le ${M.q}$): $${M.q}^2=${M.q * M.q}$와 $x^2+${M.p}^2$를 비교해요. $x^2\\lt ${M.q * M.q - M.p * M.p}$이면 둔각, $=$이면 직각, 크면 예각이에요.`,
        `조건에 맞는 자연수 $x$: ${listTxt(M[M.ask])} (${M[M.ask].length}개)`
      ],
      view: (M) => ({
        guide: `막대나 수직선의 숫자로 <b>x</b>를 바꿔 보세요. 점의 색은 <b>하늘=예각, 초록=직각, 분홍=둔각</b>이고, 속이 찬 점이 지금 찾는 ${TY[M.ask]}삼각형이에요.`,
        readouts: [rd('가능한 자연수 x', `${M.n1} ~ ${M.n2}`, 'ink', `${M.q}−${M.p}\u2009<\u2009x\u2009<\u2009${M.q}+${M.p}`), rd(`${TY[M.ask]}이 되는 x`, listTxt(M[M.ask]), TYC[M.ask], `${M[M.ask].length}개`, null, true), rd('지금의 x', M.cur.ok ? `${M.x}: ${TY[M.cur.type]}` : `${M.x}: 삼각형이 안 돼요`, M.cur.ok ? TYC[M.cur.type] : 'rose')],
        formula: `<p>$x^2${M.ask === 'obtuse' ? '\\gt ' : '\\lt '}${M.p * M.p + M.q * M.q}$ (x가 가장 긴 변) 또는 $x^2${M.ask === 'obtuse' ? '\\lt ' : '\\gt '}${M.q * M.q - M.p * M.p}$ ($${M.q}$가 가장 긴 변) → ${TY[M.ask]}</p>`,
        rule: '가장 긴 변이 정해지지 않으면 두 경우로 나누어 제곱을 비교하고, 삼각형이 되는 범위를 먼저 구한다',
        notes: notes('먼저 <b>삼각형이 되는 범위</b>(두 변의 차 < x < 합)를 구해요.', '$x$가 가장 긴 변일 때와 $' + M.q + '$가 가장 긴 변일 때를 <b>따로</b> 따져요.')
      }),
      prob: (M) => {
        const { p, q, ask } = M, ans = M[ask].length, key = `${ask}-${p}-${q}`;
        const other = ask === 'obtuse' ? M.acute.length : M.obtuse.length;
        return {
          tag: `[판별] ${TY[ask]}삼각형이 되는 자연수 x의 개수`, key,
          stem: `세 변의 길이가 $${p}$, $${q}$, $x$인 삼각형이 ${TY[ask]}삼각형이 되도록 하는 자연수 $x$의 개수는?`,
          choices: mkChoices(ans, [[other, `${ask === 'obtuse' ? '예각' : '둔각'}삼각형이 되는 x의 개수예요.`], [M.n2 - M.n1 + 1, '삼각형이 되는 모든 자연수의 개수예요. 종류를 가려야 해요.'], [ans + 1, '경계(직각이 되는 경우)나 범위를 다시 확인해 보세요.'], [Math.max(0, ans - 1), '빠뜨린 x가 없는지 확인해 보세요.'], [ans + 2, '다시 세어 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}개`, valid: (v) => v >= 0, pad: 1 })
        };
      }
    };
    return sc;
  }
  const oRange = rangeScene({ id: 'py4-orange', title: '둔각삼각형이 되는 자연수 x', short: '둔각이 되는 x', ask: 'obtuse', start: [4, 5, 7], question: '두 변이 4, 5이고 나머지 한 변이 자연수 x일 때, 둔각삼각형이 되는 x는 어떤 값일까?' });
  const aRange = rangeScene({ id: 'py4-arange', title: '예각삼각형이 되는 자연수 x', short: '예각이 되는 x', ask: 'acute', start: [6, 8, 8], question: '가장 긴 변이 정해지지 않은 두 변 6, 8과 자연수 x로 예각삼각형이 되려면 x는 얼마여야 할까?' });

  for (const D of [hinge, acuteEx, obtuseEx, oRange, aRange]) D.lessonQuestion = (M, s, Q) => s.pyLessonProblem ? Q.stem : D.question;
  G.register(40, 't4', '④ 예각·직각·둔각', '예각·직각·둔각', PARAMS, [hinge, acuteEx, obtuseEx, oRange, aRange]);
})();
