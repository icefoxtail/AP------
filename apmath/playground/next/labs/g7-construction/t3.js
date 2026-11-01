/* ==========================================================================
   중1 · 작도와 합동 — 탭 ③ 「삼각형의 결정 조건」 (t3.js, order 30) — 장면 5개
   · c3-1 세 변(SSS)               · 두 막대를 경첩으로 흔들어 보면 꼭 맞는 곳은 한 곳뿐
   · c3-2 두 변과 한 각(SAS)       · 끼인각이면 하나, 끼인각이 아니면 두 후보를 가로로 나란히 놓기
   · c3-3 한 변과 양 끝각(ASA)     · 한 변의 길이가 다르면 닮은꼴(크기가 달라 합동이 아님)
   · c3-4 안 정해지는 경우         · 세 각만(AAA) · 끼인각이 아닌 각(SSA) · 가장 긴 변 ≥ 나머지 합
   · c3-5 추가 조건                · 합동이 되려면 하나로 정해지는 조건이 되도록 무엇을 더할까
   「삼각형이 하나로 정해진다」 = 합동인 삼각형만 만들어진다는 뜻입니다. 값은 모두 지금의 길이·각으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CN;
  if (!G) return;
  const { DEG, clamp, ease, seg01, pt, add, sub, mul, unit, mid, dist, polar, dirDeg, angBetween, centroid, pick, rint, T, tick, line, arcPart, fit, P, mkChoices, mkTextChoices, seeded, shuffle, rd, notes, fmtN, dg, ol, triSSS, triSAS, triASA, tagOut, sideTag, fillPoly, poly, ang, drawTri, bboxOf, unionBox, shiftPts, hinge } = G;
  const dvv = (d) => pt(Math.cos(d * DEG), Math.sin(d * DEG));
  const pctF = (v) => Math.round(v * 100) + '%';
  const lenF = (v) => fmtN(v) + ' cm';
  const degF = G.degF;
  const LET = ['A', 'B', 'C'];

  const PARAMS = {
    cnSa: P('변 a (BC)', 5, 8, 1, 6, { color: 'sky', format: lenF }),
    cnSb: P('변 b (CA)', 5, 8, 1, 7, { color: 'green', format: lenF }),
    cnSc: P('변 c (AB)', 5, 8, 1, 8, { color: 'amber', format: lenF }),
    cnSphi: P('왼쪽 막대를 돌린 각', 5, 175, 1, 70, { color: 'rose', hint: '노란 점을 끌어도 돼요 · 딱 맞는 곳에서 초록이 돼요', format: degF }),
    cnMb: P('변 AC의 길이', 4, 9, 1, 6, { color: 'green', format: lenF }),
    cnMc: P('변 AB의 길이', 4, 9, 1, 7, { color: 'amber', format: lenF }),
    cnMA: P('표시한 각의 크기', 25, 120, 5, 50, { color: 'sky', format: degF, hint: '노란 점을 끌어도 돼요' }),
    cnMp: P('가로로 나란히 놓기', 0, 1, 0.01, 0, { color: 'rose', hint: '막대를 끌면 두 번째 삼각형이 가로로 밀려가 나란히 놓여요', format: pctF }),
    cnAA: P('∠A의 크기', 30, 80, 5, 55, { color: 'sky', format: degF }),
    cnAB: P('∠B의 크기', 30, 80, 5, 65, { color: 'green', format: degF }),
    cnAc: P('한 변 AB의 길이', 3, 8, 1, 6, { color: 'amber', format: lenF, hint: '노란 점 B를 끌어도 돼요 · 6 cm가 기준 삼각형이에요' }),
    cnKp: P('가로로 벌려 보기', 0, 1, 0.01, 1, { color: 'rose', hint: '▶를 누르면 겹쳐 있던 삼각형들이 가로로 벌어져요', format: pctF }),
    cnLa: P('막대 a', 2, 6, 1, 3, { color: 'sky', format: lenF }),
    cnLb: P('막대 b', 2, 6, 1, 4, { color: 'green', format: lenF }),
    cnLd: P('긴 막대 − (a+b)', 0, 3, 1, 1, { color: 'amber', format: (v) => (v === 0 ? '같아요(0)' : fmtN(v) + ' cm 더 길어요') }),
    cnLt: P('막대 세워 보기', 0, 1, 0.01, 1, { color: 'rose', format: pctF, hint: '막대를 끌면 막대가 경첩에서 일어나요' })
  };

  /* ====================================================================== 하나로 정해지는 조건 문제 (공용) */
  const triCnt = { // 삼각형이 몇 개 만들어지는가: 1(정해짐), 2(두 개), 0(안 만들어짐), Infinity(정해지지 않음)
    ssa: (adj, opp, th) => { const d = opp * opp - adj * adj * Math.sin(th * DEG) ** 2; if (d < 0) return 0; const m = adj * Math.cos(th * DEG), r = Math.sqrt(d); return [m - r, m + r].filter((t) => t > 1e-9).length; }
  };
  const nm = (p, q) => `\\overline{${p}${q}}`;
  const KIND_HINT = {
    sssx: '가장 긴 변이 나머지 두 변의 합보다 작아야 삼각형이 만들어져요. 이 조건으로는 삼각형이 만들어지지 않아요.',
    ssa: '이 각은 두 변의 끼인각이 아니에요. 같은 조건으로 서로 다른 삼각형이 두 개 만들어질 수 있어요.',
    aaa: '세 각만 알면 모양은 같지만 크기가 다른 삼각형이 얼마든지 있어요.',
    s2: '두 변만으로는 삼각형이 정해지지 않아요. 끼인각이나 나머지 한 변이 더 필요해요.',
    sa: '한 변과 한 각만으로는 삼각형이 정해지지 않아요.'
  };
  function condText(kind, rnd) {
    const r = Math.floor(rnd() * 3), V = LET[r], W1 = LET[(r + 1) % 3], W2 = LET[(r + 2) % 3];
    const L = (m, n) => Math.floor(rnd() * (n - m + 1)) + m;
    const cm = (v) => `${v}\\text{ cm}`;
    if (kind === 'sss') { const x = L(4, 7), y = L(5, 8), z = L(Math.abs(x - y) + 1, x + y - 1); return `$${nm('A', 'B')}=${cm(x)},\\ ${nm('B', 'C')}=${cm(y)},\\ ${nm('C', 'A')}=${cm(z)}$`; }
    if (kind === 'sssx') { const x = L(3, 5), y = L(3, 5), z = L(x + y, x + y + 4); return `$${nm('A', 'B')}=${cm(x)},\\ ${nm('B', 'C')}=${cm(y)},\\ ${nm('C', 'A')}=${cm(z)}$`; }
    if (kind === 'sas') { const x = L(4, 8), y = L(4, 8), t = 10 * L(3, 9); return `$${nm(V, W1)}=${cm(x)},\\ ${nm(V, W2)}=${cm(y)},\\ \\angle ${V}=${t}^{\\circ}$`; }
    if (kind === 'asa') { const x = L(4, 9), t1 = 10 * L(3, 8), t2 = 10 * L(3, 8); return `$${nm(V, W1)}=${cm(x)},\\ \\angle ${V}=${t1}^{\\circ},\\ \\angle ${W1}=${t2}^{\\circ}$`; }
    if (kind === 'ssa') {
      for (let k = 0; k < 40; k++) { const x = L(6, 9), t = [30, 40, 45, 50][L(0, 3)], y = L(2, x - 1); if (triCnt.ssa(x, y, t) === 2) return `$${nm(V, W1)}=${cm(x)},\\ ${nm(W1, W2)}=${cm(y)},\\ \\angle ${V}=${t}^{\\circ}$`; }
      return `$${nm(V, W1)}=${cm(8)},\\ ${nm(W1, W2)}=${cm(6)},\\ \\angle ${V}=${40}^{\\circ}$`;
    }
    if (kind === 'aaa') { const t1 = 10 * L(3, 7), t2 = 10 * L(3, 7); return `$\\angle A=${t1}^{\\circ},\\ \\angle B=${t2}^{\\circ},\\ \\angle C=${180 - t1 - t2}^{\\circ}$`; }
    if (kind === 's2') { const x = L(4, 8), y = L(4, 8); return `$${nm(V, W1)}=${cm(x)},\\ ${nm(V, W2)}=${cm(y)}$`; }
    const x = L(4, 8), t = 10 * L(3, 9); return `$${nm(V, W1)}=${cm(x)},\\ \\angle ${V}=${t}^{\\circ}$`; // sa
  }
  const WRONG_KINDS = ['sssx', 'ssa', 'aaa', 's2', 'sa'];
  function uniqProb(good, key0) {
    const rnd = seeded('u|' + good + '|' + key0), wr = shuffle(WRONG_KINDS, rnd).slice(0, 4);
    const items = [{ h: condText(good, rnd), ok: true }].concat(wr.map((k) => ({ h: condText(k, rnd), hint: KIND_HINT[k] })));
    const key = `${good}${key0}`;
    return { tag: '삼각형이 하나로 정해지는 조건', key, stem: '삼각형 ABC가 하나로 정해지는 것은?', choices: mkTextChoices(items, key), wide: true };
  }
  function drawGeneric(b) {
    const Tr = triSSS(5.4, 4.4, 6);
    fit(b, { x0: -0.2, x1: 6.2, y0: -4.6, y1: 0.2 }, { t: 44, b: 44 });
    drawTri(b, Tr, { fill: 'sky', fa: 0.08, names: ['A', 'B', 'C'] });
  }
  const newKey = (s) => { s.cnPk = { k: ((s.cnPk && s.cnPk.k) || 0) + 1 + rint(0, 5) }; };

  /* ====================================================================== 1. SSS */
  const sss = {
    id: 'c3-1', title: '세 변의 길이가 주어지면 (SSS)', short: '세 변 (SSS)',
    question: '삼각형의 세 변의 길이가 정해지면 삼각형의 모양은 하나뿐일까? 막대를 흔들어 확인해 보자.',
    ctl: ['cnSa', 'cnSb', 'cnSc', 'cnSphi'],
    presets: (s) => [{ group: '꼭 맞는 곳', label: '딱 맞는 곳으로', apply: (ss) => { const g = sss.geo(ss); ss.cnSphi = Math.round(g.phi0); ss.cnSsnap = 1; }, on: (ss) => sss.geo(ss).match }],
    init: (s) => { s.cnSa = 6; s.cnSb = 7; s.cnSc = 8; s.cnSphi = 70; s.cnPk = { k: 0 }; },
    reroll: newKey,
    geo: (s) => {
      const a = s.cnSa, b2 = s.cnSb, c = s.cnSc, Tr = triSSS(a, b2, c), phi0 = angBetween(Tr[0], Tr[1], Tr[2]);
      const match = Math.abs(s.cnSphi - phi0) < 2;
      return { a, b: b2, c, Tr, phi0, phi: match ? phi0 : s.cnSphi, match };
    },
    model: (s) => ({ ...sss.geo(s), pk: s.cnPk || { k: 0 } }),
    draw(b, s, M, C) {
      if (C.problem) { drawGeneric(b); return; }
      const { a, b: b2, c, Tr, phi0 } = M, A = Tr[0], B = Tr[1];
      const phi = C.review ? (C.step <= 1 ? Math.min(175, phi0 + 24) : phi0) : M.phi;
      const match = Math.abs(phi - phi0) < 2, ph = match ? phi0 : phi;
      fit(b, { x0: -1, x1: c + 1, y0: -Math.max(8.2, b2 + 0.6), y1: 1.6 }, { t: 30, b: 62 });
      const H = polar(A, b2, -ph), E = add(B, mul(unit(sub(H, B)), a)), gap = dist(B, H) - a;
      // 두 원(반지름 b, a)이 만나는 곳 = 꼭짓점
      if (!C.review || C.step >= 2) {
        const dA = dirDeg(A, Tr[2]), dB = dirDeg(B, Tr[2]);
        arcPart(b, A, b2, dA - 26, dA + 26, 1, 'muted', { pen: false, width: 1.8, dash: [6, 6], alpha: 0.85 });
        arcPart(b, B, a, dB - 26, dB + 26, 1, 'muted', { pen: false, width: 1.8, dash: [6, 6], alpha: 0.85 });
      }
      line(b, A, B, 'amber', 7, { alpha: 0.95 });
      line(b, A, H, 'green', 7, { alpha: 0.95 });
      line(b, B, E, 'sky', 7, { alpha: 0.95 });
      if (!match && Math.abs(gap) > 0.02) { line(b, E, H, 'rose', 2.4, { dash: [5, 5] }); }
      [A, B].forEach((p) => b.point(p, { color: 'ink', r: 4.8 }));
      b.point(H, { color: match ? 'green' : 'green', r: 5.5 });
      if (!match) b.point(E, { color: 'sky', r: 5.5 });
      T(b, A, 'A', { dx: -14, dy: 16, size: 17 }); T(b, B, 'B', { dx: 14, dy: 16, size: 17 });
      if (match) { b.point(H, { color: 'green', r: 7 }); T(b, H, 'C', { dx: 0, dy: -18, size: 17 }); }
      // 길이
      T(b, mid(A, B), `c = ${c}`, { dy: 22, size: 16, color: 'amber' });
      const cen = pt((A.x + B.x + H.x) / 3, (A.y + B.y + H.y) / 3);
      sideTag(b, A, H, cen, `b = ${b2}`, { color: 'green', size: 16, gap: 12 });
      sideTag(b, B, E, cen, `a = ${a}`, { color: 'sky', size: 16, gap: 12 });
      if (C.txt) {
        const col = match ? 'green' : 'rose';
        T(b, pt(c / 2, 0), match ? '딱 맞아요! 세 변이 정해지면 모양은 하나뿐이에요' : Math.abs(gap) > 0.02 ? (gap > 0 ? `a 막대가 모자라서 닿지 않아요 (틈 ${fmtN(gap)})` : `a 막대가 길어서 남아요 (${fmtN(-gap)} 넘침)`) : '', { dy: 48, size: b.W < 560 ? 14 : 16, color: col });
      }
      if (!C.review && !C.problem && C.txt) b.handle('H', H, { color: 'amber', r: 8, ariaLabel: '왼쪽 막대 돌리기', drag: (w) => { const f = clamp(Math.round(-dirDeg(A, w)), 5, 175); s.cnSphi = Math.abs(f - phi0) < 3 ? Math.round(phi0) : f; } });
    },
    steps: (M) => [
      `세 변의 길이 $a=${M.a}$, $b=${M.b}$, $c=${M.c}$가 주어졌어요. 길이가 ${M.c}인 변 AB를 밑변으로 놓아요.`,
      `점 A에서 반지름 ${M.b}인 원, 점 B에서 반지름 ${M.a}인 원을 그리면 두 원이 만나는 점이 꼭짓점 C예요. 막대가 닿는 곳은 이 점뿐이에요.`,
      `세 변의 길이가 같은 삼각형은 모양과 크기가 모두 같아요. 즉 세 변의 길이가 주어지면 삼각형은 <b>하나로 정해져요</b> (SSS).`
    ],
    view: (M) => ({
      guide: '막대 <b>a, b, c</b>의 길이를 바꿔 보세요. <b>노란 점</b>을 끌어 왼쪽 막대를 돌리면 오른쪽 막대가 닿는지 볼 수 있어요. <b>딱 맞는 곳</b>은 한 곳뿐이에요.',
      readouts: [rd('세 변의 길이', `a=${M.a}, b=${M.b}, c=${M.c}`, 'sky', '', null, true), rd('왼쪽 막대의 각도', dg(M.phi), M.match ? 'green' : 'rose', M.match ? '딱 맞아요' : '맞지 않아요'), rd('삼각형의 모양', '하나', 'green', 'SSS')],
      status: M.match ? { tone: 'ok', text: '딱 맞아요 → 삼각형이 하나로 정해져요' } : { tone: 'info', text: '노란 점을 끌어 딱 맞는 곳을 찾아보세요' },
      formula: `<p>$a=${M.a},\\ b=${M.b},\\ c=${M.c}$ → 삼각형 ABC가 하나로 정해진다</p>`,
      rule: '세 변의 길이가 주어지면 삼각형은 하나로 정해진다 (SSS)',
      notes: notes('두 원이 만나는 점은 밑변의 위·아래 두 곳이지만 서로 <b>뒤집은 모양</b>이라 합동이에요.', '세 변의 길이가 삼각형이 될 수 있는 조건(가장 긴 변 < 나머지 합)을 만족해야 해요.')
    }),
    prob: (M) => uniqProb('sss', M.pk.k)
  };

  /* ====================================================================== 2. SAS (끼인각 / 끼인각이 아닌 각) */
  const ssaGeo = (b2, c, be) => {
    const A = pt(0, 0), B = pt(c, 0), dir = dvv(-(180 - be)), d = b2 * b2 - c * c * Math.sin(be * DEG) ** 2, ts = [];
    if (d >= -1e-9) { const r = Math.sqrt(Math.max(0, d)), m = c * Math.cos(be * DEG); const cand = r < 1e-6 ? [m] : [m - r, m + r]; cand.forEach((t) => { if (t > 1e-6) ts.push(t); }); }
    return { A, B, dir, ts, Cs: ts.map((t) => add(B, mul(dir, t))) };
  };
  function drawSsa(b, s, M, C, o) {
    const { b: b2, c, A: be } = M, g = ssaGeo(b2, c, be), A = g.A, B = g.B, p = o.p;
    const trs = g.Cs.map((Cc) => [A, B, Cc]);
    // 가로로 벌려 놓을 거리
    let dX = 0;
    if (trs.length === 2) { const xs1 = trs[0].map((q) => q.x), xs2 = trs[1].map((q) => q.x); dX = Math.max(...xs1) - Math.min(...xs2) + 2.8; }
    const all = [...trs.flat(), ...(trs.length === 2 ? shiftPts(trs[1], dX) : []), g.Cs[0] ? polar(B, Math.max(...g.ts) + 1.3, -(180 - be)) : polar(B, 6, -(180 - be)), pt(-1, 1.4)];
    const bb = bboxOf(all, 0.5);
    fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 + 2.0 }, { t: 26, b: 40 });
    const cx = (bb.x0 + bb.x1) / 2, yb = bb.y1 + 2.0;
    const fade = 1 - 0.85 * p, n = trs.length;
    const showRay = p < 0.98;
    if (showRay) {
      const tr = n ? Math.max(...g.ts) + 1.3 : 7;
      line(b, B, add(B, mul(g.dir, tr)), 'muted', 2, { dash: [6, 6], alpha: fade });
      arcPart(b, A, b2, -6, -174, 1, 'muted', { pen: false, width: 1.8, dash: [6, 6], alpha: fade * 0.9 });
    }
    const draw1 = (Tr, off, label, col, quiet) => {
      const T3 = shiftPts(Tr, off), [a, bq, cq] = T3;
      fillPoly(b, T3, col, 0.1);
      poly(b, T3, 'ink', 3.4);
      tick(b, a, bq, 1, 'amber'); tick(b, cq, a, 2, 'amber');
      ang(b, bq, a, cq, { color: 'sky', rings: 1, label: quiet ? '' : dg(be), r: 26, labelDist: 46 });
      [a, bq, cq].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      const cen = centroid(T3);
      if (!quiet) { tagOut(b, a, cen, 'A', { size: 17 }); tagOut(b, bq, cen, 'B', { size: 17 }); }
      tagOut(b, cq, cen, 'C', { size: 17 });
      if (!quiet) { sideTag(b, a, bq, cen, `${c}`, { color: 'amber', size: 16 }); sideTag(b, cq, a, cen, `${b2}`, { color: 'amber', size: 16 }); }
      if (label && p > 0.6) T(b, mid(a, bq), label, { dy: 52, size: 15, color: col });
    };
    if (n === 0) {
      b.point(A, { color: 'ink', r: 4.8 }); b.point(B, { color: 'ink', r: 4.8 });
      line(b, A, B, 'amber', 3.4); T(b, A, 'A', { dx: -12, dy: 16, size: 17 }); T(b, B, 'B', { dx: 12, dy: 16, size: 17 });
      return { n, g, cx, yb };
    }
    if (n === 1) { draw1(trs[0], 0, '', 'green'); return { n, g, cx, yb }; }
    draw1(trs[0], 0, '후보 ①', 'green');
    draw1(trs[1], dX * p, '후보 ②', 'rose', p < 0.9);
    return { n, g, dX, cx, yb };
  }
  const sas = {
    id: 'c3-2', title: '두 변과 한 각 (SAS)', short: '두 변과 각 (SAS)',
    question: '두 변의 길이와 한 각의 크기가 주어졌을 때, 삼각형은 언제 하나로 정해질까? 각의 위치가 중요할까?',
    ctl: (s) => (s.cnMmode === 'non' ? ['cnMb', 'cnMc', 'cnMA', 'cnMp'] : ['cnMb', 'cnMc', 'cnMA']),
    presets: () => [['inc', '끼인각 (두 변 사이의 각)'], ['non', '끼인각이 아닌 각']].map(([id, label], i) => ({ group: i === 0 ? '주어진 각의 위치' : '', label, apply: (s) => { s.cnMmode = id; s.cnMp = 0; s.cnMA = id === 'non' ? 40 : 50; s.cnMb = id === 'non' ? 5 : 6; s.cnMc = 7; }, on: (s) => (s.cnMmode || 'inc') === id })),
    init: (s) => { s.cnMb = 6; s.cnMc = 7; s.cnMA = 50; s.cnMp = 0; s.cnMmode = 'inc'; s.cnPk = { k: 0 }; },
    reroll: newKey,
    model: (s) => ({ b: s.cnMb, c: s.cnMc, A: s.cnMA, p: clamp(s.cnMp, 0, 1), mode: s.cnMmode || 'inc', pk: s.cnPk || { k: 0 } }),
    draw(b, s, M, C) {
      if (C.problem) { drawGeneric(b); return; }
      const mode = C.review ? (C.step <= 1 ? 'inc' : 'non') : M.mode;
      if (mode === 'inc') {
        const Tr = triSAS(M.b, M.c, M.A), [A, B, Cc] = Tr, cen = centroid(Tr);
        fit(b, { x0: -1, x1: M.c + 1, y0: -(Math.max(M.b * Math.sin(M.A * DEG), 2) + 1.2), y1: 1.4 }, { t: 30, b: 64 });
        fillPoly(b, Tr, 'sky', 0.08);
        line(b, A, B, 'sky', 6, { alpha: 0.95 }); line(b, A, Cc, 'sky', 6, { alpha: 0.95 }); line(b, B, Cc, 'ink', 3.2);
        tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 2, 'amber');
        ang(b, A, B, Cc, { color: 'amber', rings: 1, label: dg(M.A), r: 30, labelDist: 54 });
        [A, B, Cc].forEach((q) => b.point(q, { color: 'ink', r: 4.8 }));
        tagOut(b, A, cen, 'A', { size: 17 }); tagOut(b, B, cen, 'B', { size: 17 }); tagOut(b, Cc, cen, 'C', { size: 17 });
        sideTag(b, A, B, cen, `${M.c}`, { color: 'sky', size: 17 }); sideTag(b, Cc, A, cen, `${M.b}`, { color: 'sky', size: 17 });
        sideTag(b, B, Cc, cen, 'BC는 저절로 정해져요', { color: 'muted', size: 13, gap: 10 });
        if (C.txt) T(b, pt(M.c / 2, 0), '끼인각 ∠A를 바꾸면 BC가 변하지만, ∠A가 정해지면 삼각형은 하나예요', { dy: 54, size: b.W < 560 ? 13 : 15, color: 'amber' });
        if (!C.review && C.txt) b.handle('C', Cc, { color: 'amber', r: 8, ariaLabel: '∠A 조절', drag: (w) => { s.cnMA = clamp(Math.round(-dirDeg(A, w) / 5) * 5, 25, 120); } });
        return;
      }
      const p = C.review ? (C.step >= 2 ? 1 : 0) : M.p;
      const r = drawSsa(b, s, { ...M, A: M.A }, C, { p });
      if (C.txt) {
        const msg = r.n === 2 ? (p > 0.95 ? '같은 조건인데 삼각형이 두 개! 하나로 정해지지 않아요' : '반직선과 호가 두 곳에서 만나요') : r.n === 1 ? '이 값에서는 하나뿐이지만, 다른 값에서는 두 개가 될 수 있어요' : '반직선과 호가 만나지 않아서 삼각형이 안 만들어져요';
        T(b, pt(r.cx, r.yb), msg, { size: b.W < 560 ? 13 : 15, color: r.n === 2 ? 'rose' : 'amber' });
      }
      if (!C.review && C.txt && p < 0.02 && r.n >= 1) { const tr = Math.max(...r.g.ts) + 1.3; b.handle('R', add(r.g.B, mul(r.g.dir, tr)), { color: 'amber', r: 8, ariaLabel: '각 조절', drag: (w) => { s.cnMA = clamp(Math.round((180 + dirDeg(r.g.B, w)) / 5) * 5, 25, 120); s.cnMA = clamp(s.cnMA, 25, 120); } }); }
    },
    stepT: () => 1,
    steps: (M) => {
      const g = ssaGeo(M.b, M.c, M.A);
      return [
        `끼인각: 두 변 ${M.c}, ${M.b} 사이의 각 ∠A=${M.A}°를 주면 삼각형은 <b>하나로 정해져요</b> (SAS).`,
        `끼인각이 아닌 각을 주면 반직선과 호가 두 곳에서 만날 수 있어요. 서로 다른 두 삼각형이 만들어져요.`,
        `따라서 두 변의 길이와 그 <b>끼인각</b>이 주어질 때만 삼각형이 하나로 정해져요. (끼인각이 아니면 조건만으로는 정해진다고 할 수 없어요.)`
      ];
    },
    view: (M) => {
      const non = M.mode === 'non', g = ssaGeo(M.b, M.c, M.A), n = g.Cs.length;
      return {
        guide: non ? '<b>끼인각이 아닌 각</b>을 주었어요. 막대로 길이와 각을 바꾸고, <b>가로로 나란히 놓기</b>를 움직여 두 후보를 비교해 보세요. 같은 눈금은 같은 길이, 같은 호는 같은 각이에요.' : '<b>끼인각</b>(두 변 사이의 각)을 주었어요. 노란 점 C를 끌거나 막대로 각의 크기를 바꿔 보세요. 각이 정해지면 삼각형은 하나예요.',
        readouts: non ? [rd('만들어지는 삼각형', n === 0 ? '0개 (안 만나요)' : n === 1 ? '1개' : '2개', n === 2 ? 'rose' : 'amber'), rd('표시한 각', dg(M.A), 'sky', '∠B (끼인각 아님)')] : [rd('두 변', `${M.c}, ${M.b}`, 'sky'), rd('끼인각 ∠A', dg(M.A), 'amber'), rd('삼각형', '하나', 'green', 'SAS')],
        status: non ? { tone: n === 2 ? 'warn' : 'info', text: n === 2 ? '두 후보 → 하나로 정해지지 않아요' : n === 1 ? '이 값에서는 하나 (항상은 아니에요)' : '삼각형이 만들어지지 않아요' } : { tone: 'ok', text: '두 변과 끼인각 → 하나로 정해져요' },
        formula: non ? `<p>같은 조건(두 변, 끼인각이 아닌 각)에서 삼각형이 ${n}개</p>` : `<p>$${ol('AB')}=${M.c},\\ ${ol('AC')}=${M.b},\\ \\angle A=${M.A}^{\\circ}$ → 삼각형이 하나로 정해진다</p>`,
        rule: '두 변의 길이와 그 끼인각이 주어지면 삼각형은 하나로 정해진다 (SAS)',
        notes: notes('각이 <b>두 변의 사이</b>에 있어야 SAS예요. 한 변의 끝에 있는 각은 끼인각이 아니에요.', '끼인각이 아닌 각을 주면(SSA) 삼각형이 하나일 수도, 두 개일 수도 있어서 합동 조건이 아니에요.')
      };
    },
    prob: (M) => uniqProb('sas', M.pk.k)
  };

  /* ====================================================================== 3. ASA */
  const asa = {
    id: 'c3-3', title: '한 변과 양 끝각 (ASA)', short: '한 변과 양 끝각 (ASA)',
    question: '한 변의 길이와 그 양 끝에 있는 두 각이 주어지면 삼각형은 하나로 정해질까? 각만으로는 안 될까?',
    ctl: ['cnAA', 'cnAB', 'cnAc'],
    init: (s) => { s.cnAA = 55; s.cnAB = 65; s.cnAc = 6; s.cnPk = { k: 0 }; },
    reroll: newKey,
    model: (s) => { const A = s.cnAA, B = s.cnAB, c = s.cnAc, Tr = triASA(c, A, B), ref = triASA(6, A, B); return { A, B, c, Cc: 180 - A - B, Tr, ref, same: c === 6, pk: s.cnPk || { k: 0 } }; },
    draw(b, s, M, C) {
      if (C.problem) { drawGeneric(b); return; }
      const { Tr, ref, A, B, c, Cc } = M, ghost = !C.review || C.step >= 3;
      const bb = unionBox(bboxOf(Tr, 0.2), ghost ? bboxOf(ref, 0.2) : bboxOf(Tr, 0.2));
      fit(b, { x0: Math.min(bb.x0, -0.6), x1: Math.max(bb.x1, 6.6), y0: bb.y0 - 0.2, y1: 1.2 }, { t: 30, b: 70 });
      if (ghost && !M.same) { poly(b, ref, 'muted', 2.2, { dash: [7, 6], alpha: 0.9 }); T(b, mid(ref[0], ref[1]), '기준 c = 6', { dy: 34, size: 14, color: 'muted' }); }
      const st = C.review ? C.step : 3;
      fillPoly(b, Tr, M.same ? 'green' : 'sky', 0.1);
      poly(b, Tr, 'ink', 3.4);
      line(b, Tr[0], Tr[1], 'amber', 6, { alpha: 0.95 });
      ang(b, Tr[0], Tr[1], Tr[2], { color: 'sky', rings: 1, label: dg(A), r: 30, labelDist: 56 });
      ang(b, Tr[1], Tr[2], Tr[0], { color: 'green', rings: 2, label: dg(B), r: 30, labelDist: 56 });
      if (st >= 2) ang(b, Tr[2], Tr[0], Tr[1], { color: 'rose', rings: 3, label: dg(Cc), r: 26, labelDist: 46 });
      Tr.forEach((q) => b.point(q, { color: 'ink', r: 4.8 }));
      const cen = centroid(Tr);
      ['A', 'B', 'C'].forEach((nme, i) => tagOut(b, Tr[i], cen, nme, { size: 17 }));
      T(b, mid(Tr[0], Tr[1]), `AB = ${c}`, { dy: 22, size: 16, color: 'amber' });
      if (C.txt && st >= 3) T(b, pt((Tr[0].x + Tr[1].x) / 2, 0), M.same ? '기준 삼각형과 겹쳐요 → 합동이에요' : `같은 각이지만 AB = ${c}라서 크기가 달라요 (닮은 모양)`, { dy: 56, size: b.W < 560 ? 13 : 15, color: M.same ? 'green' : 'rose' });
      if (!C.review && C.txt) b.handle('B', Tr[1], { color: 'amber', r: 8, ariaLabel: '점 B 끌기(한 변의 길이)', drag: (w) => { s.cnAc = clamp(Math.round(w.x), 3, 8); } });
    },
    steps: (M) => [
      `한 변 AB의 길이($${M.c}$ cm)와 양 끝각 $\\angle A=${M.A}^{\\circ}$, $\\angle B=${M.B}^{\\circ}$가 주어졌어요.`,
      `A와 B에서 각의 크기만큼 반직선을 그으면 만나는 점 C가 하나로 정해져요. 나머지 각 $\\angle C=180^{\\circ}-(${M.A}^{\\circ}+${M.B}^{\\circ})=${M.Cc}^{\\circ}$예요.`,
      M.same ? `기준 삼각형(AB=6)과 정확히 겹쳐요. 한 변과 양 끝각이 같으면 합동이에요 (ASA).` : `각이 같아도 AB의 길이가 다르면(${M.c} ≠ 6) 크기가 달라서 합동이 아니에요. <b>한 변의 길이</b>도 꼭 필요해요.`
    ],
    view: (M) => ({
      guide: '<b>∠A, ∠B</b>를 바꾸고 <b>노란 점 B</b>를 끌어 AB의 길이를 바꿔 보세요. 회색 점선은 <b>AB = 6</b>인 기준 삼각형이에요. AB가 6일 때만 꼭 겹쳐요.',
      readouts: [rd('양 끝각', `${dg(M.A)}, ${dg(M.B)}`, 'sky'), rd('나머지 각 ∠C', dg(M.Cc), 'rose', `180° − ${M.A + M.B}°`), rd('기준과', M.same ? '겹쳐요 (합동)' : '크기가 달라요', M.same ? 'green' : 'rose', `AB = ${M.c}`)],
      status: M.same ? { tone: 'ok', text: '한 변과 양 끝각이 같아 합동이에요' } : { tone: 'info', text: '각만 같으면 닮은꼴이에요. 변의 길이가 같아야 합동이에요' },
      formula: `<p>$\\angle C=180^{\\circ}-(${M.A}^{\\circ}+${M.B}^{\\circ})=${M.Cc}^{\\circ}$</p>`,
      rule: '한 변의 길이와 그 양 끝각이 주어지면 삼각형은 하나로 정해진다 (ASA)',
      notes: notes('두 각이 있으면 나머지 한 각은 $180^{\\circ}$에서 빼서 구할 수 있어요.', '세 각만 주어지면 변의 길이가 달라도 되니까 하나로 정해지지 않아요. 변이 <b>하나는 꼭</b> 필요해요.')
    }),
    prob: (M) => uniqProb('asa', M.pk.k)
  };

  /* ====================================================================== 4. 안 정해지는 경우 */
  const BADS = [['aaa', '세 각만 (AAA)'], ['ssa', '끼인각이 아닌 각 (SSA)'], ['long', '가장 긴 변 ≥ 나머지 합']];
  const never = {
    id: 'c3-4', title: '하나로 정해지지 않는 경우', short: '안 정해지는 경우',
    question: '삼각형이 하나로 정해지지 않는 경우에는 어떤 것이 있을까?',
    ctl: (s) => ((s.cnKmode || 'aaa') === 'aaa' ? ['cnAA', 'cnAB', 'cnKp'] : s.cnKmode === 'ssa' ? ['cnMb', 'cnMc', 'cnMA', 'cnMp'] : ['cnLa', 'cnLb', 'cnLd', 'cnLt']),
    anim: undefined,
    presets: () => BADS.map(([id, label], i) => ({ group: i === 0 ? '경우' : '', label, apply: (s) => { s.cnKmode = id; if (id === 'ssa') { s.cnMb = 5; s.cnMc = 7; s.cnMA = 40; s.cnMp = 0; } if (id === 'aaa') s.cnKp = 1; if (id === 'long') { s.cnLt = 1; } }, on: (s) => (s.cnKmode || 'aaa') === id })),
    init: (s) => { s.cnKmode = 'aaa'; s.cnAA = 55; s.cnAB = 65; s.cnKp = 1; s.cnMb = 5; s.cnMc = 7; s.cnMA = 40; s.cnMp = 0; s.cnLa = 3; s.cnLb = 4; s.cnLd = 1; s.cnLt = 1; s.cnPk = { k: 0, g: 'sss' }; },
    reroll: (s) => { s.cnPk = { k: ((s.cnPk && s.cnPk.k) || 0) + 1 + rint(0, 5), g: pick(['sss', 'sas', 'asa'], s.cnPk && s.cnPk.g) }; },
    model: (s) => ({ mode: s.cnKmode || 'aaa', A: s.cnAA, B: s.cnAB, p: clamp(s.cnKp, 0, 1), sb: s.cnMb, sc: s.cnMc, sA: s.cnMA, sp: clamp(s.cnMp, 0, 1), la: s.cnLa, lb: s.cnLb, ld: s.cnLd, lt: clamp(s.cnLt, 0, 1), pk: s.cnPk || { k: 0, g: 'sss' } }),
    draw(b, s, M, C) {
      if (C.problem) { drawGeneric(b); return; }
      const mode = C.review ? ['aaa', 'ssa', 'long'][Math.min(2, Math.max(0, C.step - 1))] : M.mode;
      if (mode === 'aaa') {
        const A = M.A, B = M.B, Cc = 180 - A - B, p = C.review ? 1 : M.p;
        const unitTr = triASA(1, A, B), h1 = Math.max(...unitTr.map((q) => -q.y)), w1 = Math.max(...unitTr.map((q) => q.x)) - Math.min(...unitTr.map((q) => q.x));
        const S = Math.min(1, 3.4 / Math.max(h1 * 4, w1 * 4));
        const lens = [2, 3, 4], trs = lens.map((L) => triASA(L * S, A, B));
        const le = trs.map((t) => -Math.min(...t.map((q) => q.x))), re = trs.map((t) => Math.max(...t.map((q) => q.x)));
        const fx = [le[0]]; for (let i = 1; i < 3; i++) fx.push(fx[i - 1] + re[i - 1] + 0.9 + le[i]);
        const total = fx[2] + re[2], hmax = Math.max(...trs[2].map((q) => -q.y));
        fit(b, { x0: -Math.max(...le) - 0.4, x1: total + 0.4, y0: -hmax - 0.5, y1: 1.4 }, { t: 26, b: 100 });
        for (let i = 2; i >= 0; i--) {
          const T3 = shiftPts(trs[i], p * fx[i]), big = i === 2 && p > 0.5;
          fillPoly(b, T3, ['green', 'sky', 'amber'][i], 0.08);
          drawTri(b, T3, { color: 'ink', angs: { A: { c: 'sky', rings: 1, r: 22 + i * 6 }, B: { c: 'green', rings: 2, r: 22 + i * 6 }, C: { c: 'rose', rings: 3, r: 22 + i * 4 } } });
          if (p > 0.6) T(b, mid(T3[0], T3[1]), `AB = ${lens[i]}`, { dy: 20, size: 15, color: 'amber' });
        }
        if (C.txt) T(b, pt((total - 0.4) / 2, 0), `∠A = ${A}°, ∠B = ${B}°, ∠C = ${Cc}° (모두 같아요)`, { dy: 30, size: b.W < 560 ? 14 : 16, color: 'sky' });
        if (C.txt) T(b, pt((total - 0.4) / 2, 0), p < 0.05 ? '세 각이 같은 삼각형을 겹쳐 놓았어요' : p > 0.95 ? '각이 모두 같아도 크기가 달라요 → 합동이 아니에요' : '가로로 벌려 봐요', { dy: 74, size: b.W < 560 ? 13 : 16, color: p > 0.95 ? 'rose' : 'amber' });
        return;
      }
      if (mode === 'ssa') {
        const p = C.review ? 1 : M.sp, r = drawSsa(b, s, { b: M.sb, c: M.sc, A: M.sA }, C, { p });
        if (C.txt) T(b, pt(r.cx, r.yb), r.n === 2 ? (p > 0.95 ? '같은 조건인데 삼각형이 두 개!' : '반직선과 호가 두 곳에서 만나요') : r.n === 1 ? '이 값에서는 하나지만 다른 값에서는 두 개가 될 수 있어요' : '만나지 않아요', { size: b.W < 560 ? 13 : 15, color: r.n === 2 ? 'rose' : 'amber' });
        return;
      }
      // long: 가장 긴 변 ≥ 나머지 합
      const la = M.la, lb = M.lb, L = la + lb + M.ld, tt = C.review ? 1 : M.lt;
      const items = [{ n: 'a', v: la, c: 'sky' }, { n: 'b', v: lb, c: 'green' }, { n: 'c', v: L, c: 'amber' }];
      fit(b, { x0: L / 2 - 6, x1: L / 2 + 6, y0: -6, y1: 3.2 }, { t: 40, b: 40 });
      hinge(b, items, tt, { nums: true, name: true });
      line(b, pt(0, 1.6), pt(la, 1.6), 'sky', 7, { alpha: 0.95 }); line(b, pt(la, 1.6), pt(la + lb, 1.6), 'green', 7, { alpha: 0.95 });
      line(b, pt(L, -0.3), pt(L, 2.1), 'rose', 2, { dash: [5, 5] });
      T(b, pt((la + lb) / 2, 1.6), `${la}+${lb} = ${la + lb}  ≤  ${L}`, { dy: 24, size: b.W < 560 ? 15 : 17, color: 'rose' });
      if (C.txt) T(b, pt(L / 2, -6), M.ld === 0 ? '일직선이 돼요 → 삼각형이 만들어지지 않아요' : '막대가 닿지 않아요 → 삼각형이 만들어지지 않아요', { dy: 4, size: b.W < 560 ? 14 : 16, color: 'rose' });
    },
    steps: (M) => [
      `<b>세 각만</b> 같은 삼각형은 크기가 다를 수 있어요. 모양은 같지만 합동이 아니에요 (AAA는 합동 조건이 아니에요).`,
      `<b>끼인각이 아닌 각</b>을 주면 같은 조건으로 서로 다른 삼각형이 두 개 만들어질 수 있어요 (SSA는 합동 조건이 아니에요).`,
      `가장 긴 변이 나머지 두 변의 합보다 <b>크거나 같으면</b> 삼각형이 만들어지지 않아요.`
    ],
    view: (M) => {
      const mode = M.mode, g = ssaGeo(M.sb, M.sc, M.sA), n = g.Cs.length;
      const guide = mode === 'aaa' ? '막대로 <b>∠A, ∠B</b>를 바꿔 보세요. 세 각이 같은 삼각형을 겹쳐 놓았다가 <b>가로로 벌리면</b> 크기가 다른 것을 볼 수 있어요.' : mode === 'ssa' ? '길이와 각을 바꾸고 <b>가로로 나란히 놓기</b>를 움직여 보세요. 끼인각이 아니면 같은 조건에서 두 삼각형이 나올 수 있어요.' : '막대 <b>a, b</b>와 긴 막대를 바꿔 보세요. 긴 막대가 a+b 이상이면 아무리 막대를 세워도 닿지 않아요.';
      const rds = mode === 'aaa' ? [rd('세 각', `${M.A}°, ${M.B}°, ${180 - M.A - M.B}°`, 'sky', '', null, true), rd('삼각형', '무수히 많아요', 'rose', '크기가 달라요')] : mode === 'ssa' ? [rd('만들어지는 삼각형', n === 0 ? '0개' : n + '개', n === 2 ? 'rose' : 'amber')] : [rd('가장 긴 막대', `${M.la + M.lb + M.ld} cm`, 'amber'), rd('나머지 두 막대의 합', `${M.la + M.lb} cm`, 'rose')];
      return { guide, readouts: rds, status: { tone: 'warn', text: mode === 'aaa' ? '세 각만으로는 정해지지 않아요' : mode === 'ssa' ? '끼인각이 아니면 정해지지 않을 수 있어요' : '삼각형이 만들어지지 않아요' }, rule: '세 각(AAA), 끼인각이 아닌 각(SSA), 가장 긴 변 ≥ 나머지 합 → 삼각형이 하나로 정해지지 않는다', notes: notes('모양이 같아 보여도 크기가 다르면 합동이 아니에요.', '두 변과 한 각을 알아도 그 각이 <b>끼인각이 아니면</b> 정해지지 않을 수 있어요.') };
    },
    prob: (M) => uniqProb(M.pk.g || 'sss', M.pk.k)
  };

  /* ====================================================================== 5. 추가 조건 */
  // 부분: 0 AB, 1 BC, 2 CA (변) / 3 ∠A, 4 ∠B, 5 ∠C (각). 끼인각: AB·CA → ∠A, AB·BC → ∠B, BC·CA → ∠C
  const PART = ['AB', 'BC', 'CA', '∠A', '∠B', '∠C'], PART2 = ['DE', 'EF', 'FD', '∠D', '∠E', '∠F'];
  const partTex = (i, rot = 0) => { const L = ['A', 'B', 'C'], M = ['D', 'E', 'F']; if (i < 3) { const a = L[(i + rot) % 3], b = L[(i + 1 + rot) % 3], d = M[(i + rot) % 3], e = M[(i + 1 + rot) % 3]; return `${nm(a, b)}=${nm(d, e)}`; } const v = L[(i - 3 + rot) % 3], w = M[(i - 3 + rot) % 3]; return `\\angle ${v}=\\angle ${w}`; };
  const GIVEN = [[0, 3], [0, 1], [3, 4], [0, 5]]; // 변과 그 끝각 / 두 변 / 두 각 / 변과 반대쪽 각
  function congKind(set) {
    const ang3 = [3, 4, 5].filter((i) => set.has(i)), sides = [0, 1, 2].filter((i) => set.has(i));
    const angs = ang3.length >= 2 ? [3, 4, 5] : ang3;
    if (sides.length === 3) return 'SSS';
    if (sides.length === 2) { const inc = sides.includes(0) && sides.includes(2) ? 3 : sides.includes(0) && sides.includes(1) ? 4 : 5; if (angs.includes(inc)) return 'SAS'; }
    if (sides.length >= 1 && angs.length === 3) return 'ASA';
    return '';
  }
  const addable = (g) => [0, 1, 2, 3, 4, 5].filter((i) => !GIVEN[g].includes(i));
  const extra = {
    id: 'c3-5', title: '합동이 되도록 조건 더하기', short: '추가 조건',
    question: '두 삼각형에서 이미 알려진 조건이 있을 때, 어떤 조건을 더하면 합동이 될까?',
    ctl: [],
    presets: (s) => {
      const g = s.cnGv || 0, add0 = addable(g);
      const a = GIVEN.map((_, i) => ({ group: i === 0 ? '이미 알려진 두 조건' : '', label: ['변 AB와 ∠A', '두 변 AB, BC', '두 각 ∠A, ∠B', '변 AB와 ∠C'][i], apply: (ss) => { ss.cnGv = i; ss.cnAdd = []; }, on: (ss) => (ss.cnGv || 0) === i }));
      const c = add0.map((p, i) => ({ group: i === 0 ? '더 알려 줄 조건' : '', label: `${PART[p]} = ${PART2[p]}`, color: 'amber', apply: (ss) => { const cur = new Set(ss.cnAdd || []); cur.has(p) ? cur.delete(p) : cur.add(p); ss.cnAdd = [...cur]; }, on: (ss) => (ss.cnAdd || []).includes(p) }));
      return a.concat(c);
    },
    init: (s) => { s.cnGv = 0; s.cnAdd = []; s.cnCx = 2.6; s.cnCy = 3.6; s.cnPk = { g: 0, rot: 0, k: 0 }; },
    reroll: (s) => { s.cnPk = { g: pick([0, 1, 2, 3], s.cnPk && s.cnPk.g), rot: rint(0, 2), k: ((s.cnPk && s.cnPk.k) || 0) + 1 }; },
    model: (s) => {
      const g = s.cnGv || 0, add0 = (s.cnAdd || []).filter((p) => addable(g).includes(p)), set = new Set([...GIVEN[g], ...add0]);
      return { g, add: add0, set, kind: congKind(set), Cx: s.cnCx, Cy: s.cnCy, pk: s.cnPk || { g: 0, rot: 0, k: 0 } };
    },
    draw(b, s, M, C) {
      if (C.problem) {
        fit(b, { x0: -0.3, x1: 14.3, y0: -4.8, y1: 0.4 }, { t: 40, b: 50 });
        const T1 = [pt(0, 0), pt(6, 0), pt(2.6, -3.7)], T2 = shiftPts(T1, 7.6), rot = M.pk.rot || 0;
        // 문제에서 주어진 두 조건을 두 삼각형에 같은 표시로 그립니다 (이름이 한 칸씩 돌아간 만큼 부분도 돌려서)
        const mp = (i) => (i < 3 ? (i + rot) % 3 : 3 + ((i - 3 + rot) % 3)), ticksP = {}, angsP = {}, SKp = ['c', 'a', 'b'];
        GIVEN[M.pk.g || 0].map(mp).forEach((i, n) => { if (i < 3) ticksP[SKp[i]] = { n: n + 1, color: 'sky' }; else angsP['ABC'[i - 3]] = { c: 'sky', rings: n + 1, t: '', r: 24 }; });
        drawTri(b, T1, { fill: 'sky', fa: 0.08, names: ['A', 'B', 'C'], ticks: ticksP, angs: angsP }); drawTri(b, T2, { fill: 'sky', fa: 0.08, names: ['D', 'E', 'F'], ticks: ticksP, angs: angsP });
        return;
      }
      const T1 = [pt(0, 0), pt(6, 0), pt(M.Cx, -M.Cy)], T2 = shiftPts(T1, 7.6);
      fit(b, { x0: -0.6, x1: 14.2, y0: -6.2, y1: 1.4 }, { t: 30, b: 70 });
      const gv = new Set(GIVEN[M.g]);
      const set = C.review ? new Set([...GIVEN[M.g], ...(C.step >= 2 ? M.add : [])]) : M.set;
      const ticks = {}, angs = {}, A1 = T1, A2 = T2, SK = ['c', 'a', 'b']; // 변 키: AB=c, BC=a, CA=b
      [0, 1, 2].forEach((i) => { if (set.has(i)) ticks[SK[i]] = { n: i + 1, color: gv.has(i) ? 'sky' : 'amber' }; });
      [0, 1, 2].forEach((i) => { if (set.has(3 + i)) angs['ABC'[i]] = { c: gv.has(3 + i) ? 'sky' : 'amber', rings: i + 1, t: '', r: 24 }; });
      drawTri(b, T1, { fill: 'sky', fa: 0.08, names: ['A', 'B', 'C'], ticks, angs });
      drawTri(b, T2, { fill: 'sky', fa: 0.08, names: ['D', 'E', 'F'], ticks, angs });
      if (C.txt) {
        const k = congKind(set), col = k ? 'green' : 'rose';
        const txt = k ? `${k} 합동 조건을 만족해요 → △ABC ≡ △DEF ✓` : `아직 부족해요 → 합동이라고 할 수 없어요`;
        T(b, pt(7.1, 0), txt, { dy: 46, size: b.W < 560 ? 14 : 17, color: col });
        T(b, pt(7.1, 0), '같다고 알려진 부분만 표시했어요 (파랑 = 처음 조건, 노랑 = 더한 조건)', { dy: 72, size: b.W < 560 ? 11.5 : 14, color: 'muted' });
      }
      if (!C.review && C.txt) b.handle('C', T1[2], { color: 'amber', r: 8, ariaLabel: '꼭짓점 C 끌기(모양 바꾸기)', drag: (w) => { s.cnCx = clamp(w.x, 0.6, 5.4); s.cnCy = clamp(-w.y, 2.2, 5.2); } });
    },
    steps: (M) => {
      const gn = GIVEN[M.g].map((p) => `${PART[p]}=${PART2[p]}`).join(', ');
      const adds = addable(M.g).filter((p) => congKind(new Set([...GIVEN[M.g], p])));
      const no = addable(M.g).filter((p) => !adds.includes(p));
      const txt = (p) => PART[p] + '=' + PART2[p];
      return [
        `이미 알려진 조건은 ${gn}이에요. 이 두 조건이 SSS, SAS, ASA 중 어느 조건의 일부인지 생각해요.`,
        `알려진 조건에 하나를 더해서 세 변(SSS), 두 변과 끼인각(SAS), 한 변과 양 끝각(ASA)이 되는지 확인해요. (두 각이 같으면 나머지 한 각도 같아요.)`,
        adds.length ? `이 경우 더할 수 있는 조건은 ${adds.map(txt).join(', ')} (${adds.length}개)예요.` + (no.length ? ` ${no.map(txt).join(', ')}을(를) 더하면 합동 조건이 되지 않아요.` : '') : '더해서 합동 조건이 되는 것이 없어요.'
      ];
    },
    view: (M) => {
      const adds = addable(M.g).filter((p) => congKind(new Set([...GIVEN[M.g], p])));
      return {
        guide: '위 칩에서 <b>이미 알려진 두 조건</b>을 고르고, <b>더 알려 줄 조건</b>을 눌러 보세요. 세 조건이 SSS, SAS, ASA 중 하나가 되면 합동이에요. <b>노란 점 C</b>를 끌어 삼각형의 모양을 바꿀 수도 있어요.',
        readouts: [rd('알려진 변의 수', `${[0, 1, 2].filter((i) => M.set.has(i)).length}개`, 'sky'), rd('알려진 각의 수', `${[3, 4, 5].filter((i) => M.set.has(i)).length}개`, 'sky'), rd('합동 조건', M.kind || '부족해요', M.kind ? 'green' : 'rose', '', null, true), rd('더해서 합동이 되는 조건', `${adds.length}개`, 'amber', '네 후보 중', null, true)],
        status: M.kind ? { tone: 'ok', text: `${M.kind} 합동 조건이에요` } : { tone: 'info', text: '조건을 더해 보세요' },
        rule: '합동 조건: 세 변(SSS) · 두 변과 끼인각(SAS) · 한 변과 양 끝각(ASA)',
        notes: notes('두 변과 <b>끼인각이 아닌</b> 각이 같은 것은 합동 조건이 아니에요.', '두 각이 같으면 나머지 한 각도 같으니까, 한 변이 더 같으면 ASA예요.')
      };
    },
    prob: (M) => {
      const { g, rot } = M.pk, cands = addable(g), cnt = cands.filter((p) => congKind(new Set([...GIVEN[g], p]))).length;
      const given = GIVEN[g].map((p) => `$${partTex(p, rot)}$`).join(', ');
      const KL = ['㉠', '㉡', '㉢', '㉣'];
      const list = cands.map((p, i) => `<li><b>${KL[i]}</b>$${partTex(p, rot)}$</li>`).join('');
      return {
        tag: '함정 · 합동이 되도록 추가할 수 있는 조건', key: `g${g}r${rot}k${M.pk.k}`,
        html: `삼각형 ABC와 DEF에서 ${given}이다. 다음 ㉠~㉣ 중 하나를 더 알려 줄 때, $\\triangle ABC\\equiv\\triangle DEF$가 되는 것은 모두 몇 개인가?<ol>${list}</ol>`,
        choices: [0, 1, 2, 3, 4].map((n) => ({ t: `${n}\\text{개}`, p: n + '개', ok: n === cnt, hint: '㉠~㉣을 하나씩 더해 보며 SSS, SAS, ASA가 되는지 확인해 보세요. 끼인각이 아닌 각은 안 돼요.' }))
      };
    }
  };
  // 문제 그림은 부분 이름이 둘레 순환(rot)을 따르므로 이름만 그림에 그립니다.

  G.register(30, 't3', '③ 삼각형의 결정 조건', '삼각형의 결정 조건', PARAMS, [sss, sas, asa, never, extra]);
})();
