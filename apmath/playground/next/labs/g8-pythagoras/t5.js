/* ==========================================================================
   중2 · 피타고라스 정리 — 탭 ⑤ 「정사각형·반원의 넓이」 (t5.js, order 50) — 장면 6개
   · py5-tree     피타고라스 나무      · 직각삼각형 바깥 변마다 또 직각삼각형·정사각형이 자라나요
   · py5-sqarea   정사각형의 넓이로 구하기 · 두 정사각형의 넓이를 알면 나머지 한 정사각형의 넓이
   · py5-rectsemi 직사각형의 각 변을 지름으로 하는 반원 · 색칠한 초승달 4개의 합 = 직사각형의 넓이
   · py5-hippo    히포크라테스의 초승달      · 초승달 두 개의 넓이 = 직각삼각형의 넓이 (직각이등변삼각형은 칩으로)
   · py5-semi     세 변을 지름으로 하는 반원 · S₁ + S₂ = S₃
   · py5-findhyp  두 반원의 넓이의 합으로 빗변의 길이 구하기
   π 가 들어간 값은 π 를 그대로 두고 계수만 계산합니다(√ 없음). 모든 값은 지금의 길이로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G || !G.figRt) return;
  const { clamp, pt, add, sub, mul, mid, lerp, unit, T, tagOut, sideTag, line, poly, fillPoly, ang, fit, P, mkChoices, rd, notes, fmtN, pick, rint, bboxOf, centroid, squareOn, cenOf, drawSq, semiPts, outsideCircle, ratOf, texRat, plainRat, isSqN, isq, figRt, TRIPLES } = G;
  const DEG = Math.PI / 180;

  const PARAMS = {
    pyTa: P('AB의 길이', 3, 12, 1, 12, { color: 'sky', format: (v) => `${v}` }),
    pyTb: P('AC의 길이', 3, 12, 1, 9, { color: 'green', format: (v) => `${v}` }),
    pyT1: P('AB 쪽 가지의 모양', 25, 65, 5, 40, { color: 'rose', hint: '꼭짓점의 위치를 바꿔도 두 정사각형의 합은 그대로예요', format: (v) => `${v}°` }),
    pyT2: P('AC 쪽 가지의 모양', 25, 65, 5, 55, { color: 'rose', format: (v) => `${v}°` }),
    pyS1: P('정사각형 ①의 넓이', 4, 100, 1, 20, { color: 'sky', format: (v) => `${v}` }),
    pyS2: P('정사각형 ②의 넓이', 4, 100, 1, 15, { color: 'green', format: (v) => `${v}` }),
    pyRw: P('가로 w', 4, 16, 1, 12, { color: 'sky', format: (v) => `${v}` }),
    pyRh: P('세로 h', 4, 16, 1, 16, { color: 'green', format: (v) => `${v}` }),
    pyIa: P('직각변 a', 2, 15, 1, 6, { color: 'sky', format: (v) => `${v}` }),
    pyIb: P('직각변 b', 2, 15, 1, 8, { color: 'green', format: (v) => `${v}` }),
    pyHy: P('빗변의 길이', 1, 5, 1, 3, { color: 'amber', hint: '빗변이 4, 8, 12, 16, 20 중 하나', format: (v) => `${4 * v}` })
  };
  const L2 = G.L2;
  const semiLab = (pts) => lerp(mid(pts[0], pts[pts.length - 1]), pts[Math.floor(pts.length / 2)], 0.5);
  const piC = (v) => { const q = ratOf(v); if (!q) return `${fmtN(v)}π`; return q.d === 1 ? `${q.n}π` : `\\frac{${q.n}π}{${q.d}}`; }; // 캔버스 라벨 (쌓은 분수)
  const piT = (v) => { const q = ratOf(v); if (!q) return `${fmtN(v)}\\pi`; return q.d === 1 ? `${q.n}\\pi` : `\\frac{${q.n}}{${q.d}}\\pi`; };
  const piP = (v) => { const q = ratOf(v); return q ? (q.d === 1 ? `${q.n}π` : `${q.d}분의 ${q.n}π`) : `${fmtN(v)}π`; };

  /* ====================================================================== 1. 피타고라스 나무 */
  const treeOf = (s) => { const p = clamp(Math.round(s.pyTa), 3, 12), q = clamp(Math.round(s.pyTb), 3, 12); return { p, q, w2: p * p + q * q, th1: clamp(s.pyT1 || 40, 25, 65), th2: clamp(s.pyT2 || 55, 25, 65), shade: s.pyShade || 'all' }; };
  // 변 UV(길이 L)가 정사각형의 바깥 변일 때, 그 바깥쪽에 그리는 직각삼각형(빗변 UV, 꼭짓점이 지름 UV 인 반원 위)과 두 변 위 정사각형
  function branch(U, V, ref, th) {
    const d = sub(V, U), L = Math.hypot(d.x, d.y), u = unit(d);
    let n = pt(-u.y, u.x); const m = mid(U, V); if (n.x * (ref.x - m.x) + n.y * (ref.y - m.y) > 0) n = mul(n, -1);
    const c = Math.cos(th * DEG), s = Math.sin(th * DEG);
    const W = add(U, add(mul(u, L * c * c), mul(n, L * c * s)));
    const c3 = centroid([U, V, W]);
    return { W, tri: [U, V, W], s1: squareOn(U, W, c3), s2: squareOn(W, V, c3) };
  }
  const tree = {
    id: 'py5-tree', title: '피타고라스 나무', short: '피타고라스 나무',
    question: '직각삼각형의 바깥 변마다 정사각형을 세우고, 그 바깥 변을 빗변으로 하는 직각삼각형과 정사각형을 또 세우면 넓이의 합은 어떻게 될까?',
    ctl: ['pyTa', 'pyTb', 'pyT1', 'pyT2'],
    init: (s) => { s.pyTa = 12; s.pyTb = 9; s.pyT1 = 40; s.pyT2 = 55; s.pyShade = 'all'; },
    gen: (s, prev) => { let p, q; do { p = rint(4, 12); q = rint(3, 12); } while (prev && prev.pyTa === p && prev.pyTb === q); return { pyTa: p, pyTb: q, pyT1: pick([30, 40, 50, 60]), pyT2: pick([30, 40, 50, 60]), pyShade: pick(['all', 'ab']) }; },
    model: (s) => treeOf(s),
    draw(b, s, M, C) {
      const { p, q, w2, th1, th2, shade } = M, prob = C.problem;
      const w = Math.sqrt(w2), B = pt(0, 0), Cc = pt(w, 0), A = pt((p * p) / w, -(p * q) / w), cen = centroid([A, B, Cc]);
      const sBC = squareOn(B, Cc, cen), sAB = squareOn(B, A, cen), sAC = squareOn(A, Cc, cen);
      // 바깥 변: sAB 의 A 쪽이 아닌 변(꼭짓점 두 개)
      const br1 = branch(sAB[2], sAB[3], cen, th1), br2 = branch(sAC[3], sAC[2], cen, th2);
      const all = [A, B, Cc, ...sBC, ...sAB, ...sAC, ...br1.s1, ...br1.s2, ...br2.s1, ...br2.s2];
      fit(b, bboxOf(all), { t: 24, b: 26, l: 24, r: 24 });
      const st = (n) => !C.review || C.step >= n;
      const sh = (k) => (prob ? (shade === 'all' || (shade === 'ab' && k === 1)) : st(k === 1 ? 3 : 4));
      drawSq(b, sBC, 'amber', prob ? '' : `BC²=${w2}`, { size: 14 });
      drawSq(b, sAB, 'sky', prob ? '' : `AB²=${p * p}`, { size: 14 });
      drawSq(b, sAC, 'green', prob ? '' : `AC²=${q * q}`, { size: 14 });
      if (st(2) || prob) {
        [[br1, 1], [br2, 2]].forEach(([br, k]) => {
          fillPoly(b, br.tri, 'ink', 0.08); poly(b, br.tri, 'ink', 2.4);
          b.right(br.W, br.tri[0], br.tri[1], { size: 9, color: 'amber' });
          const on = sh(k);
          drawSq(b, br.s1, 'rose', '', { fa: on ? 0.34 : 0.1, w: 2.2 }); drawSq(b, br.s2, 'rose', '', { fa: on ? 0.34 : 0.1, w: 2.2 });
          if (!prob) { T(b, cenOf(br.s1), 'S₁', { size: 14, color: 'rose' }); T(b, cenOf(br.s2), 'S₂', { size: 14, color: 'rose' }); }
        });
      }
      fillPoly(b, [A, B, Cc], 'ink', 0.1); poly(b, [A, B, Cc], 'ink', 3.2);
      ang(b, A, B, Cc, { color: 'amber', r: 18 });
      [[A, 'A', 0, -1], [B, 'B', -1, 1], [Cc, 'C', 1, 1]].forEach(([q2, nm, dx, dy]) => { b.point(q2, { color: 'ink', r: 4 }); T(b, q2, nm, { dx: dx * 14, dy: dy * 15, size: 16 }); });
      if (prob) { sideTag(b, B, A, Cc, `${p}`, { color: 'sky', size: 16, gap: -24 }); sideTag(b, A, Cc, B, `${q}`, { color: 'green', size: 16, gap: -24 }); }
    },
    steps: (M) => [
      `$AB=${M.p}$, $AC=${M.q}$예요. 구하는 것은 ${M.shade === 'ab' ? 'AB 쪽 두 정사각형' : '양쪽 네 정사각형'}의 넓이의 합이에요.`,
      `가지의 직각삼각형에 피타고라스 정리를 적용해요. 두 직각변 위 정사각형의 넓이의 합은 빗변 위 정사각형의 넓이와 같아요.`,
      `AB 쪽 두 정사각형을 묶으면 넓이가 $AB^2=${M.p}^2=${M.p * M.p}$예요. 가지의 모양은 이 합을 바꾸지 않아요.`,
      M.shade === 'ab' ? `AC 쪽은 색칠하지 않았어요. 따라서 구하는 합은 $${M.p * M.p}$예요.` : `AC 쪽도 $AC^2=${M.q}^2=${M.q * M.q}$이므로 네 정사각형의 합은 $${M.p * M.p}+${M.q * M.q}=${M.w2}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>AB, AC의 길이</b>와 두 가지의 <b>모양(각도)</b>을 바꿔 보세요. 가지의 모양이 달라져도 <b>두 정사각형의 합</b>은 바깥 변 위 정사각형의 넓이로 늘 같아요.',
      readouts: [rd('AB 쪽 두 정사각형의 합', `${M.p * M.p}`, 'rose', `AB² = ${M.p}²`), rd('AC 쪽 두 정사각형의 합', `${M.q * M.q}`, 'rose', `AC² = ${M.q}²`), rd('색칠한 4개의 합', `${M.w2}`, 'amber', `${M.p * M.p} + ${M.q * M.q} = BC²`)],
      formula: `<p>$S_1+S_2=AB^2=${M.p * M.p}$</p><p>$S_3+S_4=AC^2=${M.q * M.q}$</p><p>$S_1+S_2+S_3+S_4=${M.p * M.p}+${M.q * M.q}=${M.w2}$</p>`,
      rule: '직각삼각형의 한 변 위 정사각형은 그 변을 빗변으로 하는 직각삼각형의 두 직각변 위 정사각형의 합과 같다',
      notes: notes('색칠한 정사각형을 하나씩 구하려고 하지 말고 <b>두 개씩 묶어서</b> 빗변 위 정사각형으로 바꿔요.', '새 직각삼각형의 빗변은 <b>정사각형의 바깥 변</b>이에요.')
    }),
    prob: (M) => {
      const { p, q, shade } = M, ans = shade === 'ab' ? p * p : p * p + q * q;
      return {
        tag: '[넓이] 피타고라스 나무', key: `${shade}-${p}-${q}`,
        stem: shade === 'ab'
          ? `다음 그림은 직각삼각형 ABC의 세 변 위에 정사각형을 그리고, 변 AB 위 정사각형의 바깥 변을 빗변으로 하는 직각삼각형과 그 두 직각변 위 정사각형을 그린 것이다. $\\overline{AB}=${p}$, $\\overline{AC}=${q}$일 때, 색칠한 두 정사각형의 넓이의 합은?`
          : `다음 그림은 $\\angle A=90^\\circ$인 직각삼각형 ABC의 변 AB, AC 위에 각각 정사각형을 그리고, 그 정사각형의 바깥 변을 빗변으로 하는 직각삼각형과 그 두 직각변 위 정사각형을 그린 것이다. $\\overline{AB}=${p}$, $\\overline{AC}=${q}$일 때, 색칠한 네 정사각형의 넓이의 합은?`,
        choices: mkChoices(ans, shade === 'ab' ? [[p * p + q * q, 'AC 쪽 두 정사각형은 색칠하지 않았어요.'], [q * q, '색칠한 것은 AB 쪽이에요.'], [p + q, '넓이는 제곱이에요.'], [ans + 1, '다시 계산해 보세요.'], [ans - 1, '다시 계산해 보세요.']] : [[p * p, '한 쪽 두 개의 합만 구했어요. 네 개를 모두 더해요.'], [q * q, '한 쪽 두 개의 합만 구했어요.'], [p * q, '곱하지 않아요.'], [ans + 1, '다시 계산해 보세요.'], [ans - 1, '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  /* ====================================================================== 2. 정사각형의 넓이로 구하기 */
  const sqOf = (s) => { const S1 = clamp(Math.round(s.pyS1), 4, 100), S2 = clamp(Math.round(s.pyS2), 4, 100); return { S1, S2, S3: S1 + S2, unk: s.pyUnk || 'c' }; };
  const sqarea = {
    id: 'py5-sqarea', title: '정사각형의 넓이로 구하기', short: '정사각형의 넓이로',
    question: '직각삼각형의 세 변 위 정사각형 중 두 개의 넓이를 알면 나머지 하나의 넓이는 어떻게 구할까?',
    ctl: ['pyS1', 'pyS2'],
    presets: () => [['c', '빗변 위 정사각형이 모를 때'], ['b', '직각변 위 정사각형이 모를 때']].map(([k, l], i) => ({ group: i === 0 ? '구하려는 것' : '', label: l, apply: (ss) => { ss.pyUnk = k; }, on: (ss) => (ss.pyUnk || 'c') === k })),
    init: (s) => { s.pyS1 = 20; s.pyS2 = 15; s.pyUnk = 'c'; },
    gen: (s, prev) => { let a, b, k; do { a = rint(8, 60); b = rint(8, 60); k = pick(['c', 'b']); } while (prev && prev.pyS1 === a && prev.pyS2 === b); return { pyS1: a, pyS2: b, pyUnk: k }; },
    model: (s) => sqOf(s),
    draw(b, s, M, C) {
      const { S1, S2, S3, unk } = M, prob = C.problem;
      const a = Math.sqrt(S1), bq = Math.sqrt(S2); // 그림을 그릴 때만 쓰는 길이 (변의 길이는 적지 않음)
      const lab = (k, v) => (prob && unk === k ? 'x' : `${v}`);
      figRt(b, a, bq, C, {
        sq: true, bt: 30, t: 30, names: ['A', 'B', 'C'], sqLab: { a: lab('a', S1), b: lab('b', S2), c: lab('c', S3) }, sqSize: 20,
        at: { sa: 1, sb: 1, sc: 2 }
      });
    },
    steps: (M) => [
      M.unk === 'c' ? `직각변 위 두 정사각형의 넓이는 $${M.S1}$, $${M.S2}$예요. 빗변 위의 넓이를 $x$라 놓아요.` : `빗변 위 넓이는 $${M.S3}$, 한 직각변 위 넓이는 $${M.S1}$예요. 다른 직각변 위의 넓이를 $x$라 놓아요.`,
      `직각 표시를 찾아 빗변 위 정사각형을 확인해요. (하늘색 넓이)+(초록색 넓이)=(노란 넓이)예요.`,
      M.unk === 'c' ? `$x=${M.S1}+${M.S2}$로 더해요.` : `$${M.S1}+x=${M.S3}$이므로 $x=${M.S3}-${M.S1}$로 빼요.`,
      `구하는 정사각형의 넓이는 $x=${M.unk === 'c' ? M.S3 : M.S2}$예요. 주어진 수가 이미 넓이이므로 다시 제곱하지 않아요.`
    ],
    view: (M) => ({
      guide: '막대로 두 직각변 위 정사각형의 <b>넓이</b>를 바꿔 보세요. 정사각형의 한 변의 길이는 몰라도 <b>넓이끼리</b> 계산해서 구할 수 있어요.',
      readouts: [rd('파랑 정사각형', `${M.S1}`, 'sky'), rd('초록 정사각형', `${M.S2}`, 'green'), rd('노랑 (빗변) 정사각형', `${M.S3}`, 'amber', `${M.S1} + ${M.S2}`)],
      formula: `<p>(빗변 위) = (직각변 위) + (직각변 위)</p><p>$${M.S3}=${M.S1}+${M.S2}$</p>`,
      rule: '직각삼각형의 빗변 위 정사각형의 넓이 = 두 직각변 위 정사각형의 넓이의 합',
      notes: notes('한 변의 길이를 구하려고 하지 말고 <b>넓이끼리</b> 더하거나 빼요.', '모르는 것이 <b>직각변</b> 위 정사각형이면 더하지 않고 <b>빼요</b>.')
    }),
    prob: (M) => {
      const { S1, S2, S3, unk } = M, ans = unk === 'c' ? S3 : S2;
      const names = unk === 'c' ? `직각을 낀 두 변 위 정사각형의 넓이가 각각 $${S1}$, $${S2}$일 때, 빗변 위 정사각형의 넓이 $x$` : `빗변 위 정사각형의 넓이가 $${S3}$, 한 직각변 위 정사각형의 넓이가 $${S1}$일 때, 나머지 직각변 위 정사각형의 넓이 $x$`;
      return {
        tag: '[넓이] 정사각형의 넓이 관계', key: `${unk}-${S1}-${S2}`,
        stem: `다음 그림은 직각삼각형의 세 변을 한 변으로 하는 정사각형을 각각 그린 것이다. ${names}의 값은?`,
        choices: mkChoices(ans, unk === 'c' ? [[Math.abs(S1 - S2), '빼지 않고 더해요.'], [S1 * S2, '곱하지 않아요.'], [ans + 1, '다시 계산해 보세요.'], [ans - 1, '다시 계산해 보세요.'], [ans + 5, '다시 계산해 보세요.']] : [[S3 + S1, '직각변은 더하지 않고 빼요.'], [S3, '빗변 위 정사각형의 넓이예요.'], [ans + 1, '다시 계산해 보세요.'], [ans - 1, '다시 계산해 보세요.'], [ans + 5, '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };
  /* ====================================================================== 3. 직사각형 각 변을 지름으로 하는 반원 */
  const rectOf = (s) => { const w = clamp(Math.round(s.pyRw), 4, 16), h = clamp(Math.round(s.pyRh), 4, 16), d2 = w * w + h * h; return { w, h, d2, di: isSqN(d2) ? isq(d2) : null, area: w * h, kind: s.pyKind || 0 }; };
  const rectsemi = {
    id: 'py5-rectsemi', title: '직사각형의 각 변을 지름으로 하는 반원', short: '직사각형의 반원',
    question: '직사각형의 네 변을 각각 지름으로 하는 반원을 그리면, 직사각형의 외접원 바깥에 생기는 초승달 모양 네 개의 넓이의 합은 얼마일까?',
    ctl: ['pyRw', 'pyRh'],
    presets: () => [[12, 16], [6, 8], [9, 12], [5, 12], [8, 15]].map(([w, h], i) => ({ group: i === 0 ? '대각선이 정수인 (가로, 세로)' : '', label: `${w}×${h}`, apply: (ss) => { ss.pyRw = w; ss.pyRh = h; }, on: (ss) => ss.pyRw === w && ss.pyRh === h })),
    init: (s) => { s.pyRw = 12; s.pyRh = 16; s.pyKind = 0; },
    gen: (s, prev) => { let t; do { t = pick([[12, 16], [6, 8], [9, 12], [5, 12], [8, 15], [16, 12], [12, 9], [8, 6]]); } while (prev && prev.pyRw === t[0] && prev.pyRh === t[1]); return { pyRw: t[0], pyRh: t[1], pyKind: rint(0, 1) }; },
    model: (s) => rectOf(s),
    draw(b, s, M, C) {
      const { w, h, d2, di, kind } = M, prob = C.problem;
      const A = pt(0, 0), B = pt(0, h), Cc = pt(w, h), D = pt(w, 0), cen = pt(w / 2, h / 2), R = Math.sqrt(d2) / 2;
      const dd = Math.sqrt(d2);
      const edges = [[A, D], [D, Cc], [Cc, B], [B, A]];
      fit(b, bboxOf(edges.flatMap(([p, q]) => semiPts(p, q, cen)).concat([A, B, Cc, D])), { t: 28, b: 34, l: 28, r: 28 });
      const st = (n) => !C.review || C.step >= n;
      const showLune = st(3) || prob;
      if (showLune) outsideCircle(b, cen, R, () => { edges.forEach(([p, q]) => { const pts = semiPts(p, q, cen); b.path(pts, { close: true, fill: 'amber', fillAlpha: 0.5, color: null }); }); });
      edges.forEach(([p, q]) => { const pts = semiPts(p, q, cen); b.path(pts, { color: 'amber', width: 2.6 }); });
      b.circle(cen, R, { color: 'sky', width: st(2) ? 2.6 : 1.4, dash: [6, 5] });
      fillPoly(b, [A, B, Cc, D], 'ink', 0.1); poly(b, [A, B, Cc, D], 'ink', 3.4);
      if (prob && kind === 1 || (!prob && st(2))) line(b, A, Cc, 'sky', 2.4, { dash: [6, 5] });
      [[A, 'A', -1, -1], [D, 'D', 1, -1], [Cc, 'C', 1, 1], [B, 'B', -1, 1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 13, dy: dy * 14, size: 17 }); });
      // 길이: 문제 kind=1 은 가로와 대각선, kind=0 은 가로·세로
      T(b, mid(A, D), `${w}`, { dy: 18, size: 17, color: 'sky' });
      if (!prob || kind === 0) T(b, mid(A, B), `${h}`, { dx: 18, size: 17, color: 'green' });
      if (prob && kind === 1) T(b, lerp(A, Cc, 0.62), `${di}`, { dx: 12, dy: -12, size: 17, color: 'sky' });
      if (!prob && C.txt && st(3)) T(b, cen, `색칠 = ${w}×${h} = ${w * h}`, { size: 17, color: 'amber' });
    },
    steps: (M) => [
      M.kind === 1 ? `직사각형의 가로 $AD=${M.w}$와 대각선 $AC=${M.di}$가 주어졌어요. 색칠한 네 초승달의 넓이를 구해요.` : `직사각형의 가로 $AD=${M.w}$, 세로 $AB=${M.h}$가 주어졌어요. 색칠한 네 초승달의 넓이를 구해요.`,
      M.kind === 1 ? `직각삼각형 ADC에서 세로 $CD^2=AC^2-AD^2=${M.di}^2-${M.w}^2=${M.h * M.h}$이므로 $CD=AB=${M.h}$예요.` : `대각선 AC를 그으면 $AC^2=${M.w}^2+${M.h}^2=${M.d2}$예요. AC는 외접원의 지름이에요.`,
      `반원 4개의 넓이의 합은 $\\frac{\\pi}{4}(AD^2+AB^2)=\\frac{\\pi AC^2}{4}$로 외접원의 넓이와 같아요.`,
      `두 넓이에서 공통 부분인 '외접원 안, 직사각형 밖'을 빼요. 남는 네 초승달의 합은 직사각형의 넓이와 같아요.`,
      `따라서 색칠한 넓이는 $${M.w}\\times${M.h}=${M.area}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>가로</b>와 <b>세로</b>를 바꿔 보세요. 반원 네 개의 넓이의 합이 <b>외접원의 넓이</b>와 같아서, 색칠한 초승달 네 개는 늘 <b>직사각형의 넓이</b>와 같아요.',
      readouts: [rd('대각선²', `${M.d2}`, 'sky', `${M.w}² + ${M.h}²`), rd('색칠한 넓이', `${M.area}`, 'amber', `${M.w} × ${M.h}`), rd('대각선', M.di ? `${M.di}` : `제곱 ${M.d2}`, M.di ? 'green' : 'ink', M.di ? '정수예요' : '정수가 아니에요')],
      formula: `<p>(반원 4개) $=\\frac{\\pi}{8}(2w^2+2h^2)=\\frac{\\pi}{4}(w^2+h^2)=$ (외접원)</p><p>색칠한 부분 $=wh=${M.area}$</p>`,
      rule: '직사각형의 각 변을 지름으로 하는 반원 4개의 합 = 외접원 → 색칠한 초승달 4개의 합 = 직사각형의 넓이',
      notes: notes('구하는 것은 <b>초승달 모양</b>(반원에서 외접원 안쪽을 뺀 것)이에요. 반원 전체가 아니에요.', 'π가 들어간 계산은 모두 사라지고 <b>직사각형의 넓이</b>만 남아요.')
    }),
    prob: (M) => {
      const { w, h, area, kind, di } = M;
      return {
        tag: '[반원] 초승달 네 개의 넓이', key: `${kind}-${w}-${h}`,
        stem: kind === 1
          ? `다음 그림과 같이 원에 내접하는 직사각형 ABCD의 각 변을 지름으로 하는 반원을 그렸다. $\\overline{AD}=${w}$, 대각선의 길이가 $${di}$일 때, 색칠한 부분의 넓이는?`
          : `다음 그림과 같이 원에 내접하는 직사각형 ABCD의 각 변을 지름으로 하는 반원을 그렸다. $\\overline{AD}=${w}$, $\\overline{AB}=${h}$일 때, 색칠한 부분의 넓이는?`,
        choices: mkChoices(area, [[area / 2, '색칠한 부분은 직사각형 전체의 넓이와 같아요.'], [w + h, '넓이를 구해야 해요.'], [(w * w + h * h) / 4, '원의 넓이에서 π를 뺀 값이에요.'], [area + 1 + (w % 3), '다시 계산해 보세요.'], [area - 6, '다시 계산해 보세요.'], [area + 12, '다시 계산해 보세요.']], { tex: (v) => texRat(v), plain: (v) => plainRat(v) })
      };
    }
  };

  /* ====================================================================== 4. 히포크라테스의 초승달 */
  const hipOf = (s) => { const a = clamp(Math.round(s.pyIa), 2, 15), b = clamp(Math.round(s.pyIb), 2, 15), c2 = a * a + b * b; return { a, b, c2, ci: isSqN(c2) ? isq(c2) : null, tri: (a * b) / 2, kind: s.pyKind || 0 }; };
  const HIP_CHIPS = [[3, 4], [6, 8], [5, 12], [9, 12], [8, 15]];
  const hippo = {
    id: 'py5-hippo', title: '히포크라테스의 초승달', short: '히포크라테스의 초승달',
    question: '직각삼각형의 두 직각변을 지름으로 하는 반원에서 빗변을 지름으로 하는 반원을 덮은 나머지(초승달 두 개)의 넓이는 얼마일까?',
    ctl: ['pyIa', 'pyIb'],
    presets: () => HIP_CHIPS.map(([a, b], i) => ({ group: i === 0 ? '직각삼각형' : '', label: `${a}, ${b}`, apply: (ss) => { ss.pyIa = a; ss.pyIb = b; }, on: (ss) => ss.pyIa === a && ss.pyIb === b })).concat([{ group: '직각이등변삼각형', label: 'a = b', apply: (ss) => { ss.pyIb = ss.pyIa; }, on: (ss) => ss.pyIa === ss.pyIb }]),
    init: (s) => { s.pyIa = 6; s.pyIb = 8; s.pyKind = 0; },
    gen: (s, prev) => { let t; do { t = pick([[3, 4], [6, 8], [5, 12], [12, 5], [9, 12], [8, 6], [12, 9], [8, 15], [4, 3]]); } while (prev && prev.pyIa === t[0] && prev.pyIb === t[1]); return { pyIa: t[0], pyIb: t[1], pyKind: rint(0, 1) }; },
    model: (s) => hipOf(s),
    draw(b, s, M, C) {
      const { a, b: bb, c2, ci, tri, kind } = M, prob = C.problem;
      const w = Math.sqrt(c2), Bp = pt(0, 0), Cp = pt(w, 0), Ap = pt((a * a) / w, -(a * bb) / w);
      // a = AB (B 쪽), b = AC; 직각은 A
      const cen = centroid([Ap, Bp, Cp]), mBC = mid(Bp, Cp), R = w / 2;
      const sABp = semiPts(Bp, Ap, cen), sACp = semiPts(Ap, Cp, cen), sBCp = semiPts(Bp, Cp, pt(mBC.x, mBC.y + 100));
      const all = [...sABp, ...sACp, ...sBCp, Bp, Cp, pt(mBC.x, mBC.y + R * 0.1)];
      fit(b, bboxOf(all), { t: 28, b: 34, l: 26, r: 26 });
      const st = (n) => !C.review || C.step >= n;
      // 빗변 위 큰 반원(삼각형 쪽): 점선 / 빗변이 지름인 원은 꼭짓점 A 를 지나요
      if (st(2) || prob) {
        outsideCircle(b, mBC, R, () => { b.path(sABp, { close: true, fill: 'amber', fillAlpha: 0.55, color: null }); b.path(sACp, { close: true, fill: 'amber', fillAlpha: 0.55, color: null }); });
      } else { b.path(sABp, { close: true, fill: 'amber', fillAlpha: 0.2, color: null }); b.path(sACp, { close: true, fill: 'amber', fillAlpha: 0.2, color: null }); }
      b.path(sABp, { color: 'amber', width: 2.6 }); b.path(sACp, { color: 'amber', width: 2.6 });
      b.path(sBCp, { color: 'sky', width: 2.4, dash: [6, 5] });
      fillPoly(b, [Ap, Bp, Cp], 'green', st(3) ? 0.32 : 0.14); poly(b, [Ap, Bp, Cp], 'ink', 3.2);
      ang(b, Ap, Bp, Cp, { color: 'amber', r: 18 });
      [[Ap, 'A', 0, 0], [Bp, 'B', -1, 1], [Cp, 'C', 1, 1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); if (nm !== 'A') T(b, q, nm, { dx: dx * 13, dy: dy * 14, size: 17 }); });
      T(b, Ap, 'A', { dx: 14, dy: -10, size: 17 });
      // 길이 (문제 kind=1 은 한 직각변과 빗변)
      const lAB = a, lAC = bb;
      sideTag(b, Bp, Ap, Cp, `${lAB}`, { color: 'sky', size: 17, gap: -22 });
      if (!prob || kind === 0) sideTag(b, Ap, Cp, Bp, `${lAC}`, { color: 'green', size: 17, gap: -22 });
      else T(b, mid(Bp, Cp), `${ci}`, { dy: 18, size: 17, color: 'sky' });
      if (!prob && C.txt && st(3)) T(b, centroid([Ap, Bp, Cp]), `△ABC=${fmtN(tri)}`, { dy: 24, size: 15, color: 'green' });
      if (!prob && ci) T(b, mid(Bp, Cp), `${ci}`, { dy: 18, size: 16, color: 'sky' });
    },
    steps: (M) => [
      M.kind === 1 ? `직각 A를 확인해요. 주어진 길이는 $AB=${M.a}$와 빗변 $BC=${M.ci}$예요.` : `직각 A를 끼는 두 변은 $AB=${M.a}$, $AC=${M.b}$예요. 색칠한 두 초승달의 넓이를 구해요.`,
      M.kind === 1 ? `$AC^2=BC^2-AB^2=${M.ci}^2-${M.a}^2=${M.b * M.b}$이므로 $AC=${M.b}$예요.` : `세 반원의 넓이를 $S_1,S_2,S_3$라 하면 지름의 제곱에 비례하므로 $S_1+S_2=S_3$예요.`,
      `피타고라스 정리 $AB^2+AC^2=BC^2$에 $\\frac{\\pi}{8}$을 곱하면 $S_1+S_2=S_3$예요.`,
      `두 작은 반원과 큰 반원에서 공통으로 겹치는 두 활꼴을 빼면, 초승달 두 개의 합은 삼각형 ABC의 넓이와 같아요.`,
      `따라서 색칠한 넓이는 $\\frac{1}{2}\\times${M.a}\\times${M.b}=${texRat(M.tri)}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>a</b>, <b>b</b>를 바꿔 보세요. 초승달(노랑) 두 개의 넓이의 합은 늘 <b>초록 삼각형의 넓이</b>와 같아요. 칩의 <b>a = b</b>는 직각이등변삼각형이에요.',
      readouts: [rd('삼각형의 넓이', fmtN(M.tri), 'green', `½ × ${M.a} × ${M.b}`), rd('초승달 두 개의 합', fmtN(M.tri), 'amber', 'S₁ + S₂ + △ − S₃'), rd('빗변', M.ci ? `${M.ci}` : `제곱 ${M.c2}`, 'sky', `${M.a}² + ${M.b}²`)],
      formula: `<p>$S_1+S_2=S_3$ ⟹ (초승달 두 개) $=\\triangle ABC=\\frac{1}{2}ab=${fmtN(M.tri)}$</p>`,
      rule: '직각삼각형의 두 직각변을 지름으로 하는 반원의 초승달 두 개의 넓이 = 직각삼각형의 넓이',
      notes: notes('초승달의 넓이를 직접 구하지 않고 <b>S₁+S₂=S₃</b>를 이용해 삼각형의 넓이로 바꿔요.', '삼각형의 넓이는 <b>직각을 낀 두 변</b>으로 구해요(빗변이 아니에요).')
    }),
    prob: (M) => {
      const { a, b: bb, tri, kind, ci } = M;
      return {
        tag: '[반원] 히포크라테스의 초승달', key: `${kind}-${a}-${bb}`,
        stem: kind === 1
          ? `다음 그림은 $\\angle A=90^\\circ$인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그린 것이다. $\\overline{AB}=${a}$, $\\overline{BC}=${ci}$일 때, 색칠한 부분의 넓이는?`
          : `다음 그림은 $\\angle A=90^\\circ$인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그린 것이다. $\\overline{AB}=${a}$, $\\overline{AC}=${bb}$일 때, 색칠한 부분의 넓이는?`,
        choices: mkChoices(tri, [[a * bb, '삼각형의 넓이는 2로 나누어야 해요.'], [tri * 2 + 0.5 * 0 + 2, '다시 계산해 보세요.'], [ci ? (ci * ci) / 2 : tri + 1, '빗변 위 반원이 아니라 삼각형의 넓이예요.'], [tri + 1, '다시 계산해 보세요.'], [tri - 1, '다시 계산해 보세요.'], [a + bb, '넓이를 구해야 해요.']], { tex: (v) => texRat(v), plain: (v) => plainRat(v) })
      };
    }
  };

  /* ====================================================================== 5. 세 변을 지름으로 하는 반원 */
  const semiOf = (s) => { const a = clamp(Math.round(s.pyIa), 2, 15), b = clamp(Math.round(s.pyIb), 2, 15), c2 = a * a + b * b; return { a, b, c2, c: isSqN(c2) ? isq(c2) : null, S1: (a * a) / 8, S2: (b * b) / 8, S3: c2 / 8, unk: s.pyUnk || 'c' }; };
  const semi = {
    id: 'py5-semi', title: '세 변을 지름으로 하는 반원', short: '세 변 위의 반원',
    question: '직각삼각형의 세 변을 각각 지름으로 하는 반원의 넓이 S₁, S₂, S₃ 사이에는 어떤 관계가 있을까?',
    ctl: ['pyIa', 'pyIb'],
    presets: () => HIP_CHIPS.map(([a, b], i) => ({ group: i === 0 ? '직각삼각형' : '', label: `${a}, ${b}`, apply: (ss) => { ss.pyIa = a; ss.pyIb = b; }, on: (ss) => ss.pyIa === a && ss.pyIb === b })),
    init: (s) => { s.pyIa = 6; s.pyIb = 8; s.pyUnk = 'c'; },
    gen: (s, prev) => { let t; do { t = pick([[3, 4], [6, 8], [5, 12], [9, 12], [8, 15], [4, 3], [12, 5]]); } while (prev && prev.pyIa === t[0] && prev.pyIb === t[1]); return { pyIa: t[0], pyIb: t[1], pyUnk: pick(['c', 'a']) }; },
    model: (s) => semiOf(s),
    draw(b, s, M, C) {
      const { a, b: bb, c2, S1, S2, S3, unk } = M, prob = C.problem;
      const w = Math.sqrt(c2), Bp = pt(0, 0), Cp = pt(w, 0), Ap = pt((a * a) / w, -(a * bb) / w), cen = centroid([Ap, Bp, Cp]);
      const sAB = semiPts(Bp, Ap, cen), sAC = semiPts(Ap, Cp, cen), sBC = semiPts(Bp, Cp, cen);
      fit(b, bboxOf([...sAB, ...sAC, ...sBC]), { t: 28, b: 30, l: 26, r: 26 });
      const st = (n) => !C.review || C.step >= n;
      const lbl = (k, v) => (prob && unk === k ? 'x' : piC(v));
      [[sAB, 'sky', 'a', S1], [sAC, 'green', 'b', S2], [sBC, 'amber', 'c', S3]].forEach(([pts, col, k, v]) => {
        if (k === 'c' && !(st(2) || prob)) { b.path(pts, { color: col, width: 2.4, dash: [6, 5] }); return; }
        b.path(pts, { close: true, fill: col, fillAlpha: 0.22, color: col, width: 2.6 });
        const cm = semiLab(pts);
        T(b, cm, (prob ? 'S' : `S`) + { a: '₁', b: '₂', c: '₃' }[k] + (prob && unk === k ? '=x' : `=${piC(v)}`), { size: 16, color: col });
      });
      fillPoly(b, [Ap, Bp, Cp], 'ink', 0.1); poly(b, [Ap, Bp, Cp], 'ink', 3.2);
      ang(b, Ap, Bp, Cp, { color: 'amber', r: 18 });
      [[Ap, 'A', 0, -1], [Bp, 'B', -1, 1], [Cp, 'C', 1, 1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4 }); T(b, q, nm, { dx: dx * 13, dy: dy * 13, size: 16 }); });
      if (!prob) { sideTag(b, Bp, Ap, Cp, `${a}`, { color: 'sky', size: 15, gap: -20 }); sideTag(b, Ap, Cp, Bp, `${bb}`, { color: 'green', size: 15, gap: -20 }); }
    },
    steps: (M) => [
      M.unk === 'c' ? `주어진 반원 넓이는 $S_1=${piT(M.S1)}$, $S_2=${piT(M.S2)}$예요. 빗변 위 넓이 $S_3=x$를 구해요.` : `주어진 반원 넓이는 $S_2=${piT(M.S2)}$, $S_3=${piT(M.S3)}$예요. 직각변 위 넓이 $S_1=x$를 구해요.`,
      `지름이 $d$인 반원의 넓이는 $\\frac{\\pi d^2}{8}$예요. 직각삼각형의 관계 $AB^2+AC^2=BC^2$에서 $S_1+S_2=S_3$를 얻어요.`,
      M.unk === 'c' ? `$x=S_1+S_2=${piT(M.S1)}+${piT(M.S2)}$예요.` : `$x=S_3-S_2=${piT(M.S3)}-${piT(M.S2)}$예요.`,
      `구하는 넓이는 $x=${piT(M.unk === 'c' ? M.S3 : M.S1)}$예요. $\\pi$를 그대로 두고 계수끼리 계산해요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>a</b>, <b>b</b>를 바꿔 보세요. 직각을 낀 두 변 위의 반원의 넓이의 합은 늘 <b>빗변 위의 반원</b>의 넓이와 같아요.',
      readouts: [rd('S₁', `$${piT(M.S1)}$`, 'sky', `π × ${M.a}² ÷ 8`), rd('S₂', `$${piT(M.S2)}$`, 'green', `π × ${M.b}² ÷ 8`), rd('S₃', `$${piT(M.S3)}$`, 'amber', `π × ${M.c2} ÷ 8`), rd('S₁ + S₂', `$${piT(M.S1 + M.S2)}$`, 'ink', '= S₃')],
      formula: `<p>$S_1+S_2=\\frac{\\pi}{8}(a^2+b^2)=\\frac{\\pi}{8}c^2=S_3$</p>`,
      rule: '직각삼각형의 세 변을 지름으로 하는 반원의 넓이: S₁ + S₂ = S₃',
      notes: notes('반원의 넓이는 <b>지름의 제곱에 비례</b>해요. 지름의 길이가 아니라 반지름 또는 지름의 제곱을 써요.', '빗변 위 반원이 가장 커요. 구하는 것이 직각변 위 반원이면 <b>빼요</b>.')
    }),
    prob: (M) => {
      const { a, b: bb, S1, S2, S3, unk } = M, ans = unk === 'c' ? S3 : S1;
      const given = unk === 'c' ? `$S_1=${piT(S1)}$, $S_2=${piT(S2)}$일 때, $S_3=x$` : `$S_2=${piT(S2)}$, $S_3=${piT(S3)}$일 때, $S_1=x$`;
      return {
        tag: '[반원] 세 반원의 넓이', key: `${unk}-${a}-${bb}`,
        stem: `다음 그림은 $\\angle A=90^\\circ$인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그린 것이다. 세 반원의 넓이를 각각 $S_1$, $S_2$, $S_3$라 할 때, ${given}의 값은?`,
        choices: mkChoices(ans, unk === 'c' ? [[Math.abs(S2 - S1), '빼지 않고 더해요.'], [S1 * S2, '곱하지 않아요.'], [ans * 2, '다시 계산해 보세요.'], [ans + 0.5, '다시 계산해 보세요.'], [ans / 2, '다시 계산해 보세요.']] : [[S3 + S2, '직각변 위 반원은 더하지 않고 빼요.'], [S3, '빗변 위 반원의 넓이예요.'], [ans * 2, '다시 계산해 보세요.'], [ans + 0.5, '다시 계산해 보세요.'], [ans / 2, '다시 계산해 보세요.']], { tex: piT, plain: piP, pad: 0.5 })
      };
    }
  };

  /* ====================================================================== 6. 두 반원의 넓이로 빗변 구하기 */
  const fhOf = (s) => { const m = clamp(Math.round(s.pyHy), 1, 5), c = 4 * m, k = 2 * m * m; return { m, c, k, r: c / 2 }; };
  const findhyp = {
    id: 'py5-findhyp', title: '두 반원의 넓이로 빗변의 길이 구하기', short: '반원 넓이 → 빗변',
    question: '두 직각변을 지름으로 하는 반원의 넓이의 합이 주어지면, 빗변의 길이는 얼마일까?',
    ctl: ['pyHy'],
    init: (s) => { s.pyHy = 3; },
    gen: (s, prev) => { let m; do { m = rint(1, 5); } while (prev && prev.pyHy === m); return { pyHy: m }; },
    model: (s) => fhOf(s),
    draw(b, s, M, C) {
      const { c, k, r } = M, prob = C.problem;
      const a = c * 0.6, bb = c * 0.8; // 그림용 직각삼각형(3:4:5)
      const Bp = pt(0, 0), Cp = pt(c, 0), Ap = pt((a * a) / c, -(a * bb) / c), cen = centroid([Ap, Bp, Cp]);
      const sAB = semiPts(Bp, Ap, cen), sAC = semiPts(Ap, Cp, cen), sBC = semiPts(Bp, Cp, cen);
      fit(b, bboxOf([...sAB, ...sAC, ...sBC]), { t: 28, b: 30, l: 26, r: 26 });
      const st = (n) => !C.review || C.step >= n;
      b.path(sAB, { close: true, fill: 'sky', fillAlpha: 0.24, color: 'sky', width: 2.6 }); b.path(sAC, { close: true, fill: 'green', fillAlpha: 0.24, color: 'green', width: 2.6 });
      if (st(2) || prob) b.path(sBC, { close: true, fill: 'amber', fillAlpha: prob ? 0.08 : 0.22, color: 'amber', width: 2.6, dash: prob ? [6, 5] : undefined });
      fillPoly(b, [Ap, Bp, Cp], 'ink', 0.1); poly(b, [Ap, Bp, Cp], 'ink', 3.2); ang(b, Ap, Bp, Cp, { color: 'amber', r: 18 });
      [[Ap, 'A', 0, -1], [Bp, 'B', -1, 1], [Cp, 'C', 1, 1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4 }); T(b, q, nm, { dx: dx * 13, dy: dy * 13, size: 16 }); });
      T(b, semiLab(sAB), 'S₁', { size: 17, color: 'sky' }); T(b, semiLab(sAC), 'S₂', { size: 17, color: 'green' });
      T(b, semiLab(sBC), prob ? '' : `S₃=${k}π`, { size: 16, color: 'amber' });
      T(b, mid(Bp, Cp), prob ? 'x' : `${c}`, { dy: 18, size: 17, color: 'amber' });
      T(b, cen, `S₁+S₂=${k}π`, { size: 17, color: 'ink' });
    },
    steps: (M) => [
      `두 직각변 위 반원의 넓이의 합 $S_1+S_2=${M.k}\\pi$예요.`,
      `$S_1+S_2=S_3$이므로 빗변 위 반원의 넓이 $S_3=${M.k}\\pi$예요.`,
      `반원의 넓이 $\\frac{1}{2}\\pi r^2=${M.k}\\pi$에서 $r^2=${2 * M.k}$, 그러므로 $r=${M.r}$이고 빗변의 길이 $=2r=${M.c}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>S₁+S₂의 값</b>(빗변이 4, 8, 12, 16, 20)을 바꿔 보세요. 두 반원의 합은 빗변 위 반원이므로 <b>반지름을 구해 지름 = 빗변</b>을 알 수 있어요.',
      readouts: [rd('S₁ + S₂ = S₃', `${M.k}π`, 'amber'), rd('반지름 r (r² = 2k)', `${M.r}`, 'sky', `r² = ${2 * M.k}`), rd('빗변의 길이', `${M.c}`, 'green', `2 × ${M.r}`)],
      formula: `<p>$\\frac{1}{2}\\pi r^2=${M.k}\\pi \\Rightarrow r^2=${2 * M.k}$, $r=${M.r}$</p><p>빗변 $=2r=${M.c}$</p>`,
      rule: '두 직각변 위 반원의 넓이의 합 = 빗변 위 반원의 넓이 → 반지름 → 지름이 빗변',
      notes: notes('빗변의 길이는 반지름이 아니라 <b>지름</b>(반지름의 2배)이에요.', '반원의 넓이는 $\\frac{1}{2}\\pi r^2$이에요. 2를 곱하는 것을 잊지 마세요.')
    }),
    prob: (M) => {
      const { k, c, r } = M;
      return {
        tag: '[반원] 빗변의 길이', key: `${k}`,
        stem: `다음 그림은 $\\angle A=90^\\circ$인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그린 것이다. 두 직각변 위 반원의 넓이의 합이 $${k}\\pi$일 때, 빗변 $\\overline{BC}=x$의 길이는?`,
        choices: mkChoices(c, [[r, '반지름이에요. 빗변은 지름(반지름의 2배)이에요.'], [c * c, '제곱한 값이에요.'], [k, '반원의 넓이의 계수예요.'], [c + 2, '다시 계산해 보세요.'], [c - 2, '다시 계산해 보세요.'], [2 * c, '다시 계산해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  G.register(50, 't5', '⑤ 정사각형·반원의 넓이', '정사각형·반원의 넓이', PARAMS, [tree, sqarea, rectsemi, hippo, semi, findhyp]);
})();
