/* ==========================================================================
   중1 · 작도와 합동 — 탭 ⑤ 「삼각형의 합동 조건」 (t5.js, order 50) — 장면 3개
   · c5-1 SSS · SAS · ASA 체험     · 조건 칩을 고르면 같은 부분이 표시되고 오른쪽 삼각형이 가로로 와서 포개짐
   · c5-2 두 각 → 셋째 각          · 두 각이 같으면 셋째 각도 같다(180° − 두 각) · 한 변까지 같으면 ASA
   · c5-3 보기 ㄱ~ㅁ 판별          · 기준 삼각형과 합동인 삼각형 찾기 (숫자를 바꾸면 새 삼각형이 만들어짐)
   값은 모두 지금의 길이·각으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CN;
  if (!G) return;
  const { DEG, clamp, ease, seg01, pt, add, sub, mul, unit, mid, dist, polar, rotP, dirDeg, centroid, pick, rint, T, tick, line, fit, P, mkChoices, mkTextChoices, seeded, shuffle, rd, notes, fmtN, dg, ol, triSSS, triSAS, triASA, sameTri, tagOut, sideTag, fillPoly, poly, ang, drawTri, bboxOf, unionBox, shiftPts, pair } = G;
  const { imageAt, VCOL } = G.pair;
  const pctF = (v) => Math.round(v * 100) + '%';
  const lenF = (v) => fmtN(v) + ' cm';
  const degF = G.degF;

  const PARAMS = {
    cnCt: P('포개기', 0, 1, 0.01, 0, { color: 'rose', hint: '조건 칩을 누르면 저절로 포개져요 · 막대를 끌어도 돼요', format: (v) => (v >= 0.999 ? '포개짐' : Math.round(v * 100) + '%') }),
    cnEA: P('∠A의 크기', 30, 80, 5, 55, { color: 'sky', format: degF }),
    cnEB: P('∠B의 크기', 30, 80, 5, 65, { color: 'green', format: degF }),
    cnEs: P('한 변 AB의 길이', 4, 8, 1, 6, { color: 'amber', format: lenF }),
    cnVa: P('변 1', 5, 8, 1, 6, { color: 'sky', format: lenF }),
    cnVb: P('변 2', 5, 8, 1, 7, { color: 'green', format: lenF }),
    cnVc: P('변 3', 5, 8, 1, 8, { color: 'amber', format: lenF }),
    cnWs1: P('변 1', 4, 9, 1, 6, { color: 'sky', format: lenF }),
    cnWs2: P('변 2', 4, 9, 1, 7, { color: 'green', format: lenF }),
    cnWth: P('끼인각', 30, 110, 10, 50, { color: 'amber', format: degF }),
    cnUc: P('한 변', 4, 9, 1, 6, { color: 'amber', format: lenF }),
    cnUa: P('한쪽 끝각', 30, 80, 10, 50, { color: 'sky', format: degF }),
    cnUb: P('다른 쪽 끝각', 30, 80, 10, 60, { color: 'green', format: degF })
  };

  /* ====================================================================== 1. SSS·SAS·ASA 체험 */
  const CONDS = [['SSS', '세 변 (SSS)'], ['SAS', '두 변과 끼인각 (SAS)'], ['ASA', '한 변과 양 끝각 (ASA)']];
  const marksOf = (c) => (c === 'SSS' ? { sides: [0, 1, 2], angs: [] } : c === 'SAS' ? { sides: [0, 2], angs: [0] } : { sides: [0], angs: [0, 1] });
  const SK = ['c', 'a', 'b']; // 변 AB=c, BC=a, CA=b (drawTri 의 키)
  const cond = {
    id: 'c5-1', title: '합동 조건 체험 (SSS · SAS · ASA)', short: 'SSS·SAS·ASA',
    question: '두 삼각형이 합동임을 알려면 모든 변과 각을 재어 봐야 할까? 어떤 조건만 같아도 꼭 포개어질까?',
    ctl: ['cnCt'], anim: { key: 'cnCt', dur: 4.5, label: '포개어 보기', start: 0 },
    presets: () => CONDS.map(([id, label], i) => ({ group: i === 0 ? '같다고 알려진 조건' : '', label, color: 'amber', apply: (s) => { s.cnCond = id; s.cnCt = 0; s.playing = true; }, on: (s) => (s.cnCond || 'SSS') === id })),
    init: (s) => { s.cnCond = 'SSS'; s.cnCt = 0; s.cnCx = 2.6; s.cnCy = 3.6; s.cnPk = { k: 0 }; },
    reroll: (s) => { s.cnPk = { k: ((s.cnPk && s.cnPk.k) || 0) + 1 + rint(0, 5) }; },
    model: (s) => ({ cond: s.cnCond || 'SSS', Cx: s.cnCx, Cy: s.cnCy, pk: s.cnPk || { k: 0 } }),
    draw(b, s, M, C) {
      const Tr = [pt(0, 0), pt(6, 0), pt(M.Cx, -M.Cy)];
      if (C.problem) { const Gt = [pt(0, 0), pt(6, 0), pt(2.4, -3.6)], I = imageAt(Gt, 'rot', 0, 9.8), bb = unionBox(bboxOf(Gt, 0.4), bboxOf(I, 0.4)); fit(b, bb, { t: 40, b: 44 }); fillPoly(b, Gt, 'sky', 0.1); poly(b, Gt, 'ink', 3.4); fillPoly(b, I, 'sky', 0.1); poly(b, I, 'ink', 3.4); const c1 = centroid(Gt), c2 = centroid(I); Gt.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, c1, 'ABC'[i], { size: 17 }); }); I.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, c2, 'DEF'[i], { size: 17 }); }); return; }
      const w = bboxOf(Tr).x1 - bboxOf(Tr).x0, X0 = w + 3.4, cond0 = C.review ? 'SSS' : M.cond;
      let bb = bboxOf(Tr, 0.3); [0, 0.5, 1].forEach((t) => { bb = unionBox(bb, bboxOf(imageAt(Tr, 'rot', t, X0), 0.3)); });
      fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 + 0.8 }, { t: 36, b: 56 });
      const t = C.review ? (C.step >= 2 ? 1 : 0) : C.t, img = imageAt(Tr, 'rot', t, X0), done = t >= 0.999;
      const cs = cond0;
      const mm = marksOf(cond0);
      const tk2 = {}, an2 = {}; mm.sides.forEach((i, n) => { tk2[SK[i]] = { n: n + 1, color: 'amber' }; }); mm.angs.forEach((i, n) => { an2['ABC'[i]] = { c: VCOL[i], rings: n + 1, t: '', r: 24 }; });
      fillPoly(b, Tr, 'sky', 0.1); fillPoly(b, img, done ? 'green' : 'sky', 0.1);
      drawTri(b, Tr, { ticks: tk2, angs: an2 }); drawTri(b, img, { ticks: tk2, angs: an2, color: done ? 'green' : 'ink', dash: done ? [8, 5] : undefined });
      const cA = centroid(Tr), cB = centroid(img);
      Tr.forEach((p) => b.point(p, { color: 'ink', r: 4.5 })); img.forEach((p) => b.point(p, { color: 'ink', r: 4.5 }));
      if (C.txt) {
        if (done) Tr.forEach((p, i) => tagOut(b, p, cA, 'ABC'[i] + '=' + 'DEF'[i], { size: 15, gap: 14 }));
        else { Tr.forEach((p, i) => tagOut(b, p, cA, 'ABC'[i], { size: 17 })); img.forEach((p, i) => tagOut(b, p, cB, 'DEF'[i], { size: 17 })); }
        const nmc = C.review ? '' : { SSS: '세 변이 각각 같아요', SAS: '두 변과 그 끼인각이 같아요', ASA: '한 변과 그 양 끝각이 같아요' }[cs];
        const cap = C.review ? (C.step === 1 ? '같은 조건을 두 삼각형에 표시해요 (같은 눈금·같은 호)' : '꼭 포개어져요 → △ABC ≡ △DEF') : done ? `${cs}: ${nmc} → 꼭 포개어져요, 합동이에요` : t > 0 ? '가로로 밀어 포개요' : `${cs}: ${nmc}`;
        T(b, pt((bb.x0 + bb.x1) / 2, bb.y1 + 0.2), cap, { dy: 24, size: b.W < 560 ? 13 : 16, color: done ? 'green' : 'amber' });
      }
      if (!C.review && C.txt && t <= 0) b.handle('C', Tr[2], { color: 'amber', r: 8, ariaLabel: '꼭짓점 C 끌기(모양 바꾸기)', drag: (w2) => { s.cnCx = clamp(w2.x, 0.8, 5.2); s.cnCy = clamp(-w2.y, 2.6, 5.4); } });
    },
    stepT: (n) => (n >= 2 ? 1 : 0),
    steps: () => [
      '세 합동 조건 중 하나를 고르면 두 삼각형에서 같은 부분이 표시돼요. SSS: 세 변, SAS: 두 변과 끼인각, ASA: 한 변과 양 끝각.',
      '표시한 조건이 같으면 나머지 변과 각도 저절로 같아져서 두 삼각형이 꼭 포개어져요. 그러므로 $\\triangle ABC\\equiv\\triangle DEF$ (합동)이라고 해요.'
    ],
    view: (M) => {
      const mk = marksOf(M.cond), nameS = ['AB=DE', 'BC=EF', 'CA=FD'], nameA = ['∠A=∠D', '∠B=∠E', '∠C=∠F'];
      return {
        guide: '위의 <b>조건 칩</b>을 눌러 보세요. 같다고 알려진 부분이 두 삼각형에 <b>같은 눈금·같은 호</b>로 표시되고, 오른쪽 삼각형이 제자리에서 돌고 가로로 와서 포개져요. <b>노란 점</b> C로 삼각형의 모양도 바꿔 보세요.',
        readouts: [rd('합동 조건', M.cond, 'amber'), rd('같다고 알려진 부분', [...mk.sides.map((i) => nameS[i]), ...mk.angs.map((i) => nameA[i])].join(', '), 'sky', '', null, true), rd('결론', '△ABC ≡ △DEF', 'green', '꼭 포개어져요', null, true)],
        formula: `<p>${M.cond}: ${[...mk.sides.map((i) => `$${ol(['AB', 'BC', 'CA'][i])}=${ol(['DE', 'EF', 'FD'][i])}$`), ...mk.angs.map((i) => `$\\angle ${'ABC'[i]}=\\angle ${'DEF'[i]}$`)].join(', ')}</p><p>$\\triangle ABC\\equiv\\triangle DEF$</p>`,
        rule: '세 변(SSS), 두 변과 끼인각(SAS), 한 변과 양 끝각(ASA)이 각각 같으면 두 삼각형은 합동이다',
        notes: notes('SAS에서 각은 두 변의 <b>사이(끼인각)</b>에 있어야 해요.', 'ASA에서 변은 두 각의 <b>사이</b>에 있어요. 두 각이 있으면 나머지 한 각도 같아요.')
      };
    },
    prob: (M) => {
      const k = M.pk.k, rnd = seeded('c51|' + k), kind = k % 2;
      const TRUE = ['세 변의 길이가 각각 같다.', '두 변의 길이가 각각 같고, 그 끼인각의 크기가 같다.', '한 변의 길이가 같고, 그 양 끝각의 크기가 각각 같다.', '한 변의 길이가 같고, 두 각의 크기가 각각 같다.'];
      const FALSE = ['세 각의 크기가 각각 같다.', '두 변의 길이가 각각 같고, 끼인각이 아닌 한 각의 크기가 같다.', '두 변의 길이와 한 각의 크기가 각각 같다.', '한 변의 길이와 한 각의 크기가 같다.', '두 변의 길이가 각각 같다.'];
      const hintT = '이것은 합동 조건이에요. 합동 조건이 아닌 것을 찾아야 해요.', hintF = '이것만으로는 합동이라고 할 수 없어요. 세 합동 조건(SSS, SAS, ASA)이 아니에요.';
      let items, stem;
      if (kind === 0) { const f = shuffle(FALSE, rnd)[0]; items = [{ h: f, ok: true }].concat(TRUE.map((x) => ({ h: x, hint: hintT }))); stem = '두 삼각형 ABC와 DEF가 합동이 되는 조건이 <b>아닌</b> 것은?'; }
      else { const t = shuffle(TRUE.slice(0, 3), rnd)[0]; items = [{ h: t, ok: true }].concat(shuffle(FALSE, rnd).slice(0, 4).map((x) => ({ h: x, hint: hintF }))); stem = '두 삼각형 ABC와 DEF가 합동이 되는 조건인 것은?'; }
      return { tag: kind === 0 ? '함정 · 합동 조건이 아닌 것' : '삼각형의 합동 조건', key: `k${k}`, html: stem, choices: mkTextChoices(items, `c51${k}`), wide: true };
    }
  };

  /* ====================================================================== 2. 두 각 → 셋째 각 */
  const twoAng = {
    id: 'c5-2', title: '두 각이 같으면 셋째 각도 같다', short: '셋째 각 구하기',
    question: '두 삼각형에서 두 각이 각각 같으면 나머지 한 각은 어떻게 될까? 한 변까지 같으면 합동일까?',
    ctl: ['cnEA', 'cnEB', 'cnCt'], anim: { key: 'cnCt', dur: 4, label: '포개어 보기', start: 0 },
    init: (s) => { s.cnEA = 55; s.cnEB = 65; s.cnCt = 0; s.cnPk = { A: 55, B: 70, k: 0 }; },
    reroll: (s) => { s.cnPk = { A: 5 * rint(7, 15), B: 5 * rint(7, 15), k: ((s.cnPk && s.cnPk.k) || 0) + 1 }; if (s.cnPk.A + s.cnPk.B > 165) s.cnPk.B = 165 - s.cnPk.A; },
    model: (s) => ({ A: s.cnEA, B: s.cnEB, Cc: 180 - s.cnEA - s.cnEB, pk: s.cnPk || { A: 55, B: 70, k: 0 } }),
    draw(b, s, M, C) {
      const A = C.problem ? M.pk.A : M.A, B = C.problem ? M.pk.B : M.B, Cc = 180 - A - B, Tr = triASA(6, A, B) || triASA(6, 55, 65);
      const w = bboxOf(Tr).x1 - bboxOf(Tr).x0, X0 = w + 3, t = C.problem ? 0 : C.review ? (C.step >= 3 ? 1 : 0) : C.t;
      const img = shiftPts(Tr, X0 * (1 - seg01(t, 0, 1))), done = t >= 0.999;
      const bb = unionBox(bboxOf(Tr, 0.4), bboxOf(shiftPts(Tr, X0), 0.4));
      fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 + 0.4 }, { t: 40, b: 56 });
      const st = C.problem ? 0 : C.review ? C.step : 3;
      const mk = (T3, nms, tag) => {
        fillPoly(b, T3, tag === 'r' && done ? 'green' : 'sky', 0.1);
        drawTri(b, T3, {
          color: tag === 'r' && done ? 'green' : 'ink', dash: tag === 'r' && done ? [8, 5] : undefined,
          ticks: st >= 3 ? { c: { n: 1, color: 'amber' } } : undefined,
          angs: { A: { c: 'sky', rings: 1, t: '', r: 28 }, B: { c: 'green', rings: 2, t: '', r: 28 }, C: st >= 2 || C.problem ? { c: 'rose', rings: 3, t: C.problem ? (tag === 'r' ? 'x°' : '') : dg(Cc), r: 24, d: 44 } : undefined }
        });
        const cc = centroid(T3);
        T(b, T3[0], dg(A), { dx: -30, dy: -16, size: 15, color: 'sky' }); T(b, T3[1], dg(B), { dx: 30, dy: -16, size: 15, color: 'green' });
        T3.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); if (!(done && tag === 'r')) tagOut(b, p, cc, nms[i], { size: 17, gap: i < 2 ? 22 : 11 }); });
      };
      mk(Tr, ['A', 'B', 'C'], 'l'); mk(img, ['D', 'E', 'F'], 'r');
      if (C.problem) { // BC = EF 눈금
        tick(b, Tr[1], Tr[2], 2, 'amber'); tick(b, img[1], img[2], 2, 'amber');
      }
      if (C.txt && !C.problem) {
        const cx = (bb.x0 + bb.x1) / 2;
        const cap = st >= 3 ? (done ? '한 변까지 같아서 포개어져요 → ASA 합동' : `∠F = ∠C = ${Cc}°, AB = DE → ASA 합동`) : st >= 2 ? `셋째 각: ∠C = 180° − (${A}° + ${B}°) = ${Cc}°  ∠F도 ${Cc}°` : `두 각이 각각 같아요: ∠A=∠D=${A}°, ∠B=∠E=${B}°`;
        T(b, pt(cx, bb.y1 + 0.2), cap, { dy: 26, size: b.W < 560 ? 13 : 16, color: st >= 3 ? 'green' : 'amber' });
      }
      if (!C.review && !C.problem && C.txt && t <= 0) b.handle('C', Tr[2], { color: 'amber', r: 8, ariaLabel: '꼭짓점 C 끌기(∠A, ∠B 바꾸기)', drag: (w2) => { s.cnEA = clamp(Math.round(-dirDeg(Tr[0], w2) / 5) * 5, 30, 80); s.cnEB = clamp(Math.round((180 + dirDeg(Tr[1], w2)) / 5) * 5, 30, 80); } });
    },
    stepT: (n) => (n >= 3 ? 1 : 0),
    steps: (M) => [
      `두 삼각형에서 $\\angle A=\\angle D=${M.A}^{\\circ}$, $\\angle B=\\angle E=${M.B}^{\\circ}$로 두 각이 각각 같아요.`,
      `삼각형의 세 내각의 합은 $180^{\\circ}$이므로 $\\angle C=180^{\\circ}-(${M.A}^{\\circ}+${M.B}^{\\circ})=${M.Cc}^{\\circ}$, $\\angle F$도 $${M.Cc}^{\\circ}$예요. 세 각이 모두 같아요.`,
      `변 AB와 DE의 길이까지 같으면 한 변과 그 양 끝각이 각각 같으므로 $\\triangle ABC\\equiv\\triangle DEF$ (ASA 합동)예요.`
    ],
    view: (M) => ({
      guide: '막대(또는 <b>노란 점</b> C)로 <b>∠A, ∠B</b>를 바꿔 보세요. 두 각이 정해지면 셋째 각 ∠C는 저절로 정해지고 ∠F와 같아요. ▶를 누르면 한 변까지 같은 두 삼각형이 포개어져요.',
      readouts: [rd('∠A = ∠D', dg(M.A), 'sky'), rd('∠B = ∠E', dg(M.B), 'green'), rd('∠C = ∠F', dg(M.Cc), 'rose', `180° − ${M.A + M.B}°`)],
      formula: `<p>$\\angle C=180^{\\circ}-(${M.A}^{\\circ}+${M.B}^{\\circ})=${M.Cc}^{\\circ}=\\angle F$</p>`,
      rule: '두 각이 각각 같으면 나머지 한 각도 같다. 한 변까지 같으면 합동(ASA)',
      notes: notes('두 각을 더해 $180^{\\circ}$에서 빼요. 두 각의 합을 답으로 쓰면 안 돼요.', '변이 하나도 같지 않으면 세 각이 같아도 합동이 아니에요(닮은 모양).')
    }),
    prob: (M) => {
      const { A, B } = M.pk, x = 180 - A - B;
      return {
        tag: '삼각형의 합동 조건 · 셋째 각', key: `a${A}b${B}`,
        stem: `그림의 두 삼각형 ABC와 DEF에서 $\\angle A=\\angle D=${A}^{\\circ}$, $\\angle B=\\angle E=${B}^{\\circ}$, $\\overline{BC}=\\overline{EF}$이다. $\\angle F=x^{\\circ}$일 때, $x$의 값은?`,
        choices: mkChoices(x, [[A + B, '두 각의 합이에요. 180°에서 빼야 해요.'], [180 - A, '한 각만 뺐어요. 두 각을 모두 빼야 해요.'], [180 - B, '한 각만 뺐어요. 두 각을 모두 빼야 해요.'], [360 - A - B, '삼각형의 세 내각의 합은 180°예요.']], { tex: (v) => `${v}^{\\circ}`, plain: (v) => v + '°', pad: 5, valid: (v) => v > 0 && v < 180 })
      };
    }
  };

  /* ====================================================================== 3. 보기 ㄱ~ㅁ 판별 */
  const KL = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  const ssaTri = (s1, s2, th) => { // 각 th 의 한 변(s1)과 맞은편 변(s2): 두 삼각형 중 k 번째 [V,W1,W2]
    const A = pt(0, 0), B = pt(s1, 0), dir = pt(-Math.cos(th * DEG), -Math.sin(th * DEG)), d = s2 * s2 - s1 * s1 * Math.sin(th * DEG) ** 2;
    if (d < 0) return [];
    const m = s1 * Math.cos(th * DEG), r = Math.sqrt(d), ts = (r < 1e-6 ? [m] : [m - r, m + r]).filter((t) => t > 1e-6);
    return ts.map((t) => [B, A, add(B, mul(dir, t))]); // [V=B(각), W1=A, W2=C]
  };
  const SSS_V = (a, b, c) => triSSS(a, b, c);
  function describe(type, d) { // 삼각형 점·표시를 만들어 돌려줌: {pts, sides:[[i,j,t]], angs:[[v,t]]}
    if (type === 0) { const Tr = triSSS(d[0], d[1], d[2]); return Tr && { pts: Tr, sides: [[1, 2, d[0]], [2, 0, d[1]], [0, 1, d[2]]], angs: [] }; }
    if (type === 1) { const Tr = triSAS(d[1], d[0], d[2]); return { pts: Tr, sides: [[0, 1, d[0]], [2, 0, d[1]]], angs: [[0, d[2]]] }; }
    const Tr = triASA(d[0], d[1], d[2]); return Tr && { pts: Tr, sides: [[0, 1, d[0]]], angs: [[0, d[1]], [1, d[2]]] };
  }
  function genSet(type, nums, seed) {
    const rnd = seeded(`c53|${type}|${nums.join(',')}|${seed}`), R = (a, b2) => a + Math.floor(rnd() * (b2 - a + 1));
    const base = describe(type, nums);
    const cand = [];
    const mkSame = () => { // 합동: 같은 수를 다른 순서(거울상·돌림)로
      if (type === 0) return { d: shuffle(nums, rnd), why: '세 변이 각각 같아요 → 합동 (SSS)' };
      if (type === 1) return { d: [nums[1], nums[0], nums[2]], why: '두 변과 끼인각이 같아요 → 합동 (SAS)' };
      return { d: [nums[0], nums[2], nums[1]], why: '한 변과 양 끝각이 같아요 → 합동 (ASA)' };
    };
    const wrongs = [];
    if (type === 0) {
      [[0, 1], [0, -1], [1, 1], [1, -1], [2, 1], [2, -1], [0, 2], [1, 2], [2, -2]].forEach(([i, dd]) => { const d = nums.slice(); d[i] += dd; wrongs.push({ d, why: `한 변이 달라요 (${nums[i]} → ${d[i]})` }); });
    } else if (type === 1) {
      [[2, 10], [2, -10], [0, 1], [1, 1], [0, -1], [1, -1], [2, 20]].forEach(([i, dd]) => { const d = nums.slice(); d[i] += dd; wrongs.push({ d, why: i === 2 ? `끼인각이 달라요 (${nums[2]}° → ${d[2]}°)` : `한 변이 달라요 (${nums[i]} → ${d[i]})` }); });
    } else {
      [[2, 10], [2, -10], [1, 10], [0, 1], [0, -1], [1, -10]].forEach(([i, dd]) => { const d = nums.slice(); d[i] += dd; wrongs.push({ d, why: i === 0 ? `변의 길이가 달라요 (${nums[0]} → ${d[0]})` : `끝각이 달라요 (${nums[i]}° → ${d[i]}°)` }); });
      wrongs.unshift({ d: [nums[0], nums[1], 180 - nums[1] - nums[2]], why: `같은 변이지만 각의 위치가 달라요 (양 끝각이 ${nums[1]}°, ${180 - nums[1] - nums[2]}°)`, trap: true });
    }
    const goodT = describe(type, nums.slice()), good = mkSame();
    const wr = [];
    for (const w of shuffle(wrongs, rnd)) {
      const dsc = describe(type, w.d);
      if (!dsc || !dsc.pts || dsc.pts.some((p) => !Number.isFinite(p.x))) continue;
      if (sameTri(base.pts, dsc.pts)) continue;
      if (type === 0 && w.d.slice().sort().join() === nums.slice().sort().join()) continue;
      if (wr.some((x) => x.d.join() === w.d.join())) continue;
      wr.push({ ...w, dsc });
      if (wr.length === 4) break;
    }
    // 끼인각이 아닌 각(SSA) 함정: SAS 기준일 때 한 후보를 SSA 삼각형으로 바꿈
    if (type === 1) {
      const t = ssaTri(nums[0], nums[1], nums[2]).filter((tr) => !sameTri(base.pts, tr));
      if (t.length) wr[wr.length - 1] = { d: ['SSA'], why: `같은 숫자지만 ${nums[2]}°가 두 변의 끼인각이 아니에요 → 합동이 아니에요`, dsc: { pts: t[0], sides: [[0, 1, nums[0]], [1, 2, nums[1]]], angs: [[0, nums[2]]] }, trap: true };
    }
    const all = [{ ok: true, why: good.why, dsc: describe(type, good.d) }].concat(wr.map((w) => ({ ok: false, why: w.why, dsc: w.dsc, trap: w.trap })));
    const ord = shuffle(all.map((_, i) => i), rnd);
    return { base, cands: ord.map((i) => all[i]), rnd };
  }
  const gridCols = (b) => (b.W < 560 ? 2 : 3);
  function drawSet(b, set, o) {
    const cols = gridCols(b), cells = [{ base: true, dsc: set.base }].concat(set.cands.map((c, i) => ({ ...c, label: KL[i] }))), rows = Math.ceil(cells.length / cols);
    const Wc = 8.4, Hc = 6.6;
    // 공통 배율: 모두 같은 크기로
    const rnd = set.rnd, pose = cells.map((c, i) => ({ rot: c.base ? 0 : [0, 70, 140, 200, 260, 320][Math.floor((((i * 7919 + (o.seed || 0)) % 6) + 6) % 6)], flip: !c.base && (i + (o.seed || 0)) % 2 === 1 }));
    const tris = cells.map((c, i) => { const cc = centroid(c.dsc.pts); return c.dsc.pts.map((p) => { let q = sub(p, cc); if (pose[i].flip) q = pt(-q.x, q.y); q = rotP(q, pt(0, 0), pose[i].rot); return q; }); });
    const ext = tris.map((t) => { const bb = bboxOf(t); return [bb.x1 - bb.x0, bb.y1 - bb.y0]; });
    const S = Math.min(1, ...ext.map(([w, h]) => Math.min((Wc * 0.72) / w, (Hc * 0.56) / h)));
    fit(b, { x0: 0, x1: cols * Wc, y0: 0, y1: rows * Hc }, { t: 8, b: 8, l: 8, r: 8 });
    const small = b.W < 560;
    cells.forEach((c, i) => {
      const col = i % cols, row = Math.floor(i / cols), x0 = col * Wc, y0 = row * Hc, cx = x0 + Wc / 2, cy = y0 + Hc * 0.55;
      const verdict = o.verdict && !c.base;
      const colr = verdict ? (c.ok ? 'green' : 'rose') : c.base ? 'amber' : 'muted';
      b.path([pt(x0 + 0.15, y0 + 0.15), pt(x0 + Wc - 0.15, y0 + 0.15), pt(x0 + Wc - 0.15, y0 + Hc - 0.15), pt(x0 + 0.15, y0 + Hc - 0.15)], { close: true, fill: colr, fillAlpha: verdict || c.base ? 0.07 : 0.03, color: colr, width: verdict || c.base ? 1.8 : 1.2, alpha: 0.8 });
      const T3 = tris[i].map((p) => pt(cx + p.x * S, cy + p.y * S)), cen = pt(cx, cy);
      fillPoly(b, T3, verdict ? colr : 'sky', 0.12); poly(b, T3, 'ink', 3);
      // 변 길이 · 각 크기 (그림 안)
      const cd = c.dsc, perm = (k) => k; // 점 번호는 그대로 (같은 순서로 변환)
      cd.sides.forEach(([p, q, t]) => sideTag(b, T3[p], T3[q], cen, `${t}`, { size: small ? 14 : 16, color: 'sky', gap: small ? 8 : 12 }));
      cd.angs.forEach(([v, t]) => { const a1 = T3[(v + 1) % 3], a2 = T3[(v + 2) % 3]; ang(b, T3[v], a1, a2, { color: 'amber', rings: 1, label: `${t}°`, r: small ? 16 : 22, labelDist: small ? 36 : 46, size: small ? 13 : 15 }); });
      T3.forEach((p) => b.point(p, { color: 'ink', r: 3.6 }));
      T(b, pt(x0, y0), c.base ? '기준 △ABC' : c.label, { dx: 8, dy: 16, align: 'left', size: small ? 14 : 17, color: c.base ? 'amber' : 'ink' });
      if (verdict) T(b, pt(x0 + Wc / 2, y0 + Hc), c.ok ? '합동 ✓' : '합동 아님 ✗', { dy: -12, size: small ? 13 : 15, color: colr });
    });
  }
  const TYPES = ['세 변이 주어진 경우', '두 변과 끼인각이 주어진 경우', '한 변과 양 끝각이 주어진 경우'];
  const pickSet = {
    id: 'c5-3', title: '합동인 삼각형 찾기', short: '합동 삼각형 찾기',
    question: '기준 삼각형 △ABC와 합동인 삼각형은 어느 것일까? 합동 조건(SSS, SAS, ASA)으로 판별해 보자.',
    ctl: (s) => ((s.cnTy || 0) === 0 ? ['cnVa', 'cnVb', 'cnVc'] : (s.cnTy === 1 ? ['cnWs1', 'cnWs2', 'cnWth'] : ['cnUc', 'cnUa', 'cnUb'])),
    presets: () => TYPES.map((label, i) => ({ group: i === 0 ? '기준 삼각형에 주어진 것' : '', label, apply: (s) => { s.cnTy = i; }, on: (s) => (s.cnTy || 0) === i })),
    init: (s) => { s.cnTy = 0; s.cnVa = 6; s.cnVb = 7; s.cnVc = 8; s.cnWs1 = 6; s.cnWs2 = 7; s.cnWth = 50; s.cnUc = 6; s.cnUa = 50; s.cnUb = 60; s.cnPk = { k: 0, ty: 0, nums: [6, 7, 8] }; },
    reroll: (s) => {
      const ty = rint(0, 2), k = ((s.cnPk && s.cnPk.k) || 0) + 1;
      const nums = ty === 0 ? (() => { for (;;) { const a = rint(5, 8), b2 = rint(5, 8), c = rint(5, 8); if (new Set([a, b2, c]).size >= 2 && a < b2 + c && b2 < a + c && c < a + b2) return [a, b2, c]; } })() : ty === 1 ? [rint(5, 9), rint(5, 9), 10 * rint(4, 9)] : [rint(5, 9), 10 * rint(3, 7), 10 * rint(3, 7)];
      if (ty === 1 && nums[0] === nums[1]) nums[1] += 1;
      if (ty === 2 && nums[1] === nums[2]) nums[2] += 10;
      s.cnPk = { k, ty, nums };
    },
    model: (s) => {
      const ty = s.cnTy || 0, nums = ty === 0 ? [s.cnVa, s.cnVb, s.cnVc] : ty === 1 ? [s.cnWs1, s.cnWs2, s.cnWth] : [s.cnUc, s.cnUa, s.cnUb];
      const pk = s.cnPk || { k: 0, ty: 0, nums: [6, 7, 8] };
      return { ty, nums, set: genSet(ty, nums, 0), pk, pset: genSet(pk.ty, pk.nums, pk.k) };
    },
    draw(b, s, M, C) {
      if (C.problem) { drawSet(b, M.pset, { verdict: false, seed: M.pk.k }); return; }
      const st = C.review ? C.step : 3;
      drawSet(b, M.set, { verdict: st >= 3, seed: 0 });
    },
    steps: (M) => {
      const ty = M.ty, ok = M.set.cands.findIndex((c) => c.ok);
      return [
        `기준 삼각형 △ABC에는 ${TYPES[ty].replace(' 경우', '')} 있어요. 같은 조건이 주어진 보기와 비교해요.`,
        `각 보기에서 변의 길이와 각의 크기를 하나씩 비교해요. 숫자가 다르거나, 각의 위치(끼인각, 양 끝각)가 다르면 합동 조건이 아니에요.`,
        `기준과 합동인 것은 ${KL[ok]}예요. ${M.set.cands[ok].why}.`
      ];
    },
    view: (M) => ({
      guide: '위의 칩으로 기준 삼각형에 <b>주어진 것</b>을 고르고 막대로 숫자를 바꿔 보세요. 숫자가 바뀌면 보기 ㄱ~ㅁ도 새로 만들어져요. 합동인 것은 <b>초록</b>, 아닌 것은 <b>분홍</b>으로 알려 줘요. 보기는 돌리거나 뒤집어 놓았으니 숫자와 각의 위치를 비교해 보세요.',
      readouts: [rd('기준 삼각형', M.ty === 0 ? M.nums.join(', ') : M.ty === 1 ? `${M.nums[0]}, ${M.nums[1]}, 끼인각 ${M.nums[2]}°` : `${M.nums[0]}, 양 끝각 ${M.nums[1]}°·${M.nums[2]}°`, 'amber', '', null, true), rd('합동인 보기', KL[M.set.cands.findIndex((c) => c.ok)], 'green')],
      status: { tone: 'info', text: '합동인 것은 보기 중 하나뿐이에요' },
      rule: '합동 조건(SSS, SAS, ASA)을 만족하는 삼각형만 합동이다',
      notes: notes('숫자가 같아도 각이 <b>두 변의 사이</b>에 있지 않으면 합동 조건이 아니에요.', '삼각형은 돌리거나 뒤집어 놓아도 합동일 수 있어요. 방향이 아니라 변과 각의 값을 비교해요.')
    }),
    prob: (M) => {
      const { pk, pset } = M, ok = pset.cands.findIndex((c) => c.ok);
      return {
        tag: '합동인 삼각형 찾기 · 합동 조건 판별', key: `k${pk.k}t${pk.ty}${pk.nums.join('.')}`,
        stem: '그림의 기준 △ABC와 합동인 것은? (삼각형은 돌리거나 뒤집어 놓았다.)',
        choices: pset.cands.map((c, i) => ({ h: KL[i], p: KL[i], ok: i === ok, hint: c.ok ? '' : `${KL[i]}: ${c.why}.` }))
      };
    }
  };

  G.register(50, 't5', '⑤ 삼각형의 합동 조건', '삼각형의 합동 조건', PARAMS, [cond, twoAng, pickSet]);
})();
