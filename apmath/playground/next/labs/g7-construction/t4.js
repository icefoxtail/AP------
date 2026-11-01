/* ==========================================================================
   중1 · 작도와 합동 — 탭 ④ 「합동인 도형」 (t4.js, order 40) — 장면 3개
   · c4-1 합동 = 포개어짐          · 한 도형을 가로로 밀고(필요하면 제자리에서 돌리거나 뒤집어) 포개기 · 대응점·대응변·대응각
   · c4-2 대응 순서와 ≡            · △ABC ≡ △DEF 는 대응 순서대로 쓰기 · 넓이가 같아도 합동은 아니에요
   · c4-3 합동의 성질로 구하기     · 대응변의 길이·대응각의 크기는 같다 → x 구하기
   값은 모두 지금의 삼각형(꼭짓점 C를 끌어 모양을 바꿈)·숫자로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CN;
  if (!G) return;
  const { DEG, clamp, ease, seg01, pt, add, sub, mul, unit, mid, dist, polar, rotP, dirDeg, centroid, pick, rint, T, tick, line, fit, P, mkChoices, mkTextChoices, seeded, shuffle, rd, notes, fmtN, dg, ol, triSSS, triASA, tagOut, sideTag, fillPoly, poly, ang, drawTri, bboxOf, unionBox, shiftPts, textW } = G;
  const pctF = (v) => Math.round(v * 100) + '%';
  const lenF = (v) => fmtN(v) + ' cm';
  const degF = G.degF;
  const VCOL = ['sky', 'rose', 'green']; // 꼭짓점 A·D / B·E / C·F 의 색

  const PARAMS = {
    cnPt: P('포개기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 오른쪽 삼각형이 가로로 와서 포개져요', format: (v) => (v >= 0.999 ? '포개짐' : Math.round(v * 100) + '%') }),
    cnOa: P('변 BC', 5, 8, 1, 6, { color: 'sky', format: lenF }),
    cnOb: P('변 CA', 5, 8, 1, 7, { color: 'green', format: lenF }),
    cnOc: P('변 AB', 5, 8, 1, 8, { color: 'amber', format: lenF }),
    cnRw: P('왼쪽 직사각형의 가로', 2, 8, 1, 6, { color: 'sky', format: lenF }),
    cnRh: P('왼쪽 직사각형의 세로', 2, 6, 1, 4, { color: 'green', format: lenF }),
    cnRw2: P('오른쪽 직사각형의 가로', 2, 12, 1, 8, { color: 'amber', format: lenF, hint: '넓이가 같도록 세로가 저절로 정해져요' }),
    cnQa: P('변 BC', 5, 8, 1, 6, { color: 'sky', format: lenF }),
    cnQb: P('변 CA', 5, 8, 1, 7, { color: 'green', format: lenF }),
    cnQc: P('변 AB', 5, 8, 1, 8, { color: 'amber', format: lenF }),
    cnQA: P('∠A의 크기', 30, 80, 5, 50, { color: 'sky', format: degF }),
    cnQB: P('∠B의 크기', 30, 80, 5, 60, { color: 'green', format: degF })
  };

  /* ====================================================================== 삼각형 쌍 (공용) */
  // pose: {rot, flip}. t: 0(떨어져 있음)~1(포개짐). mode: 'slide'|'rot'|'flip'
  const POSE = { slide: { rot: 0, flip: false }, rot: { rot: 150, flip: false }, flip: { rot: 0, flip: true } };
  function imageAt(Tr, mode, t, X0) {
    const c0 = centroid(Tr), t1 = mode === 'slide' ? 0 : seg01(t, 0, 0.5), t2 = mode === 'slide' ? seg01(t, 0, 1) : seg01(t, 0.5, 1);
    const sx = mode === 'flip' ? -Math.cos(Math.PI * t1) : 1, rot = mode === 'rot' ? 150 * (1 - t1) : 0, off = X0 * (1 - t2);
    return Tr.map((p) => { let q = sub(p, c0); q = pt(q.x * sx, q.y); q = rotP(q, pt(0, 0), rot); return pt(c0.x + q.x + off, c0.y + q.y); });
  }
  const triOf = (cx, cy) => [pt(0, 0), pt(6, 0), pt(cx, -cy)];
  // 쌍의 그림 상자(모든 t 에서의 위치를 합침)
  function pairBox(Tr, mode, X0) {
    let bb = bboxOf(Tr, 0.3);
    [0, 0.25, 0.5, 0.75, 1].forEach((t) => { bb = unionBox(bb, bboxOf(imageAt(Tr, mode, t, X0), 0.3)); });
    return bb;
  }
  const edgeTicks = { c: { n: 1, color: 'amber' }, a: { n: 2, color: 'amber' }, b: { n: 3, color: 'amber' } };
  const angMarks = (t0 = '') => ({ A: { c: VCOL[0], rings: 1, t: t0, r: 24 }, B: { c: VCOL[1], rings: 2, t: t0, r: 24 }, C: { c: VCOL[2], rings: 3, t: t0, r: 24 } });

  /* ====================================================================== 1. 합동 = 포개어짐 */
  const MODES = [['slide', '밀어서'], ['rot', '돌려서'], ['flip', '뒤집어서']];
  const overlap = {
    id: 'c4-1', title: '합동 = 포개어지는 도형', short: '합동과 대응',
    question: '모양과 크기가 같아서 꼭 포개어지는 두 도형을 합동이라고 해. 포갰을 때 겹치는 점·변·각은 서로 어떻게 대응할까?',
    ctl: ['cnPt'], anim: { key: 'cnPt', dur: 5, label: '포개어 보기', start: 0 },
    presets: () => MODES.map(([id, label], i) => ({ group: i === 0 ? '포개는 방법' : '', label, apply: (s) => { s.cnPmode = id; s.cnPt = 0; s.playing = false; }, on: (s) => (s.cnPmode || 'rot') === id })),
    init: (s) => { s.cnPt = 0; s.cnPmode = 'rot'; s.cnCx = 2.4; s.cnCy = 3.6; s.cnPk = { q: 0, p: [1, 2, 0], k: 0 }; },
    reroll: (s) => { const perms = [[1, 2, 0], [2, 0, 1], [1, 0, 2], [2, 1, 0], [0, 2, 1]]; s.cnPk = { q: rint(0, 2), p: pick(perms, null), k: ((s.cnPk && s.cnPk.k) || 0) + 1, kind: rint(0, 2) }; },
    model: (s) => ({ Cx: s.cnCx, Cy: s.cnCy, mode: s.cnPmode || 'rot', pk: s.cnPk || { q: 0, p: [1, 2, 0], k: 0 } }),
    draw(b, s, M, C) {
      const Tr = triOf(M.Cx, M.Cy);
      if (C.problem) { drawCorrProblem(b, M); return; }
      const mode = M.mode, w = bboxOf(Tr).x1 - bboxOf(Tr).x0, X0 = w + 3.2;
      const bb = pairBox(Tr, mode, X0);
      fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 + 0.8 }, { t: 36, b: 46 });
      const t = C.review ? (C.step === 1 ? 1 : 0) : C.t;
      const img = imageAt(Tr, mode, t, X0), done = t >= 0.999, st = C.review ? C.step : 3;
      const col = (cs) => (st >= 2 ? cs : 'ink');
      const mk = (T3, nm, nm2) => {
        fillPoly(b, T3, 'sky', done ? 0.06 : 0.1);
        poly(b, T3, 'ink', 3.4);
        if (st >= 3) { drawTri(b, T3, { color: null, ticks: edgeTicks, angs: angMarks() }); }
      };
      mk(Tr); poly(b, Tr, 'ink', 3.4);
      if (!done || true) { fillPoly(b, img, 'green', 0.1); poly(b, img, st >= 2 && done ? 'green' : 'ink', done ? 4 : 3.4, { dash: done ? [8, 5] : undefined }); }
      if (st >= 3) { drawTri(b, img, { color: null, ticks: edgeTicks, angs: angMarks() }); }
      const cA = centroid(Tr), cB = centroid(img);
      Tr.forEach((p, i) => { b.point(p, { color: col(VCOL[i]), r: 5.2 }); });
      img.forEach((p, i) => { b.point(p, { color: col(VCOL[i]), r: 5.2 }); });
      if (C.txt) {
        if (done) { Tr.forEach((p, i) => tagOut(b, p, cA, 'ABC'[i] + '=' + 'DEF'[i], { size: 15, gap: 14, color: st >= 2 ? VCOL[i] : 'ink' })); }
        else { Tr.forEach((p, i) => tagOut(b, p, cA, 'ABC'[i], { size: 17, color: st >= 2 ? VCOL[i] : 'ink' })); img.forEach((p, i) => tagOut(b, p, cB, 'DEF'[i], { size: 17, color: st >= 2 ? VCOL[i] : 'ink' })); }
        const cap = done ? '꼭 포개어져요 → 합동 (△ABC ≡ △DEF)' : t <= 0 ? '▶를 눌러 오른쪽 삼각형을 가로로 밀어 포개 보세요' : mode === 'slide' ? '가로로 밀어 포개요' : t < 0.5 ? (mode === 'rot' ? '제자리에서 돌려요' : '제자리에서 뒤집어요') : '가로로 밀어 포개요';
        T(b, pt((bb.x0 + bb.x1) / 2, bb.y1 + 0.2), cap, { dy: 22, size: b.W < 560 ? 14 : 17, color: done ? 'green' : 'amber' });
      }
      if (!C.review && C.txt && t <= 0) b.handle('C', Tr[2], { color: 'amber', r: 8, ariaLabel: '꼭짓점 C 끌기(모양 바꾸기)', drag: (w2) => { s.cnCx = clamp(w2.x, 0.8, 5.2); s.cnCy = clamp(-w2.y, 2.6, 5.4); } });
    },
    stepT: (n) => (n === 1 ? 1 : 0),
    steps: () => [
      '한 도형을 움직여(밀기·돌리기·뒤집기) 다른 도형에 꼭 포갤 수 있으면 두 도형은 합동이에요.',
      '포개었을 때 겹치는 꼭짓점을 대응점이라고 해요. 점 A와 D, 점 B와 E, 점 C와 F가 대응점이에요.',
      '겹치는 변을 대응변, 겹치는 각을 대응각이라고 해요. 대응변의 길이는 같고 대응각의 크기도 같아요. AB=DE, BC=EF, CA=FD, ∠A=∠D, ∠B=∠E, ∠C=∠F'
    ],
    view: (M) => ({
      guide: '<b>포개는 방법</b>을 고르고 ▶를 눌러 보세요. 오른쪽 삼각형이 <b>제자리에서 돌거나 뒤집힌 뒤 가로로</b> 와서 포개져요. <b>노란 점</b> C를 끌어 삼각형의 모양도 바꿔 볼 수 있어요.',
      readouts: [rd('대응점', 'A↔D · B↔E · C↔F', 'sky', '', null, true), rd('대응변', 'AB=DE · BC=EF · CA=FD', 'amber', '길이가 같아요', null, true), rd('대응각', '∠A=∠D · ∠B=∠E · ∠C=∠F', 'green', '크기가 같아요', null, true)],
      rule: '합동인 두 도형은 대응변의 길이와 대응각의 크기가 각각 같다',
      notes: notes('합동은 <b>모양과 크기가 모두 같아야</b> 해요. 모양만 같으면 합동이 아니에요(닮음).', '뒤집어서 포개어지는 도형도 합동이에요.')
    }),
    prob: (M) => {
      const { q, p, kind, k } = M.pk, K = kind == null ? 0 : kind;
      const D = ['D', 'E', 'F'], A3 = ['A', 'B', 'C'], img = p.map((i) => D[i]); // 점 A·B·C 의 대응점 이름
      const stmt = `△ABC ≡ △${img.join('')}`;
      const key = `${p.join('')}q${q}K${K}`;
      let items;
      if (K === 0) {
        const ans = img[q], oth = ['D', 'E', 'F'].filter((x) => x !== ans), w = A3.filter((x) => x !== A3[q]);
        items = [{ h: ans, ok: true }].concat(oth.map((x) => ({ h: x, hint: '대응점은 ≡ 기호 양쪽에서 같은 순서에 있는 꼭짓점이에요.' }))).concat(w.map((x) => ({ h: x, hint: '같은 삼각형(ABC)의 꼭짓점은 대응점이 아니에요. DEF 중에서 찾아야 해요.' })));
        return { tag: '대응점 찾기', key, stem: `그림에서 ${stmt}일 때, 점 ${A3[q]}의 대응점은?`, choices: mkTextChoices(items.map((it) => ({ ...it, h: `점 ${it.h}` })), key) };
      }
      if (K === 1) {
        const sd = (a2, b2) => a2 + b2, side = [[0, 1], [1, 2], [2, 0]][q], ansI = side.map((i) => img[i]).join(''), nm = (x) => `$\\overline{${x}}$`;
        const allD = ['DE', 'EF', 'FD'].map((x) => x), same = (x, y) => x.split('').sort().join('') === y.split('').sort().join('');
        const ans = allD.find((x) => same(x, ansI)), oth = allD.filter((x) => x !== ans), w = ['AB', 'BC', 'CA'].filter((x) => x !== A3[side[0]] + A3[side[1]]);
        items = [{ h: nm(ans), ok: true }].concat(oth.map((x) => ({ h: nm(x), hint: '대응변은 대응점끼리 이은 변이에요. ≡ 기호의 같은 순서 꼭짓점을 이어 보세요.' }))).concat(w.map((x) => ({ h: nm(x), hint: '같은 삼각형(ABC)의 변은 대응변이 아니에요. DEF의 변 중에서 찾아야 해요.' })));
        return { tag: '대응변 찾기', key, stem: `그림에서 ${stmt}일 때, 변 ${A3[side[0]]}${A3[side[1]]}의 대응변은?`, choices: mkTextChoices(items, key) };
      }
      const ans = img[q], oth = ['D', 'E', 'F'].filter((x) => x !== ans), w = A3.filter((x) => x !== A3[q]);
      items = [{ h: `$\\angle ${ans}$`, ok: true }].concat(oth.map((x) => ({ h: `$\\angle ${x}$`, hint: '대응각은 대응점에 있는 각이에요. ≡ 기호의 같은 순서 꼭짓점을 찾아 보세요.' }))).concat(w.map((x) => ({ h: `$\\angle ${x}$`, hint: '같은 삼각형(ABC)의 각은 대응각이 아니에요. DEF 중에서 찾아야 해요.' })));
      return { tag: '대응각 찾기', key, stem: `그림에서 ${stmt}일 때, ∠${A3[q]}의 대응각은?`, choices: mkTextChoices(items, key) };
    }
  };
  // 문제 그림: 점 A,B,C 의 상(像)에 D,E,F 중 지금 문장의 대응 이름을 붙인다 (포개는 방법은 제자리 회전)
  function drawCorrProblem(b, M) {
    const Tr = triOf(2.4, 3.6), img = imageAt(Tr, 'rot', 0, 9.8), p = M.pk.p, cA = centroid(Tr), cB = centroid(img);
    const bb = unionBox(bboxOf(Tr, 0.3), bboxOf(img, 0.3));
    fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 }, { t: 40, b: 44 });
    fillPoly(b, Tr, 'sky', 0.1); poly(b, Tr, 'ink', 3.4); fillPoly(b, img, 'sky', 0.1); poly(b, img, 'ink', 3.4);
    Tr.forEach((q, i) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, cA, 'ABC'[i], { size: 17 }); });
    img.forEach((q, i) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, cB, 'DEF'[p[i]], { size: 17 }); });
  }

  /* ====================================================================== 2. 대응 순서와 ≡ */
  const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]; // 점 A,B,C 의 대응점이 D,E,F 중 무엇인지
  const permName = (p) => 'DEF'[p[0]] + 'DEF'[p[1]] + 'DEF'[p[2]];
  const ordGeo = (s) => {
    const a = s.cnOa, b2 = s.cnOb, c = s.cnOc, Tr = triSSS(a, b2, c), sg = PERMS[(s.cnOs || 0) % 6], X0 = 12;
    // 그림 속 DEF: 점 A,B,C 를 150°돌린 상에 D,E,F 중 sg 가 가리키는 이름을 붙임
    const img = imageAt(Tr, 'rot', 0, X0), len = (P1, P2) => dist(P1, P2);
    const sidesA = [len(Tr[0], Tr[1]), len(Tr[1], Tr[2]), len(Tr[2], Tr[0])];
    const posOf = []; // 이름 D,E,F 가 붙은 점의 위치(그림의 상)
    sg.forEach((nameIdx, i) => { posOf[nameIdx] = img[i]; });
    return { a, b: b2, c, Tr, img, sg, posOf, sidesA, X0 };
  };
  const orderOK = (G0, pick2) => { // 고른 대응 pick2(점 A,B,C 의 대응점 번호 배열)가 변의 길이로 성립하는지
    const L = (arr, i, j) => dist(arr[i], arr[j]);
    const Dp = G0.posOf; // 이름별 위치
    return [[0, 1], [1, 2], [2, 0]].every(([i, j]) => Math.abs(L(G0.Tr, i, j) - dist(Dp[pick2[i]], Dp[pick2[j]])) < 1e-6);
  };
  const ordScene = {
    id: 'c4-2', title: '대응 순서와 합동 기호 ≡', short: '대응 순서와 ≡',
    question: '합동 기호 ≡ 를 쓸 때는 대응하는 꼭짓점의 순서를 맞춰 써야 해. 그리고 넓이가 같으면 합동일까?',
    ctl: (s) => (s.cnOmode === 'area' ? ['cnRw', 'cnRh', 'cnRw2'] : ['cnOa', 'cnOb', 'cnOc']),
    presets: (s) => {
      const md = [['order', '대응 순서 맞추기'], ['area', '넓이가 같으면 합동?']].map(([id, label], i) => ({ group: i === 0 ? '무엇을 살펴볼까요' : '', label, apply: (ss) => { ss.cnOmode = id; ss.cnOpick = null; }, on: (ss) => (ss.cnOmode || 'order') === id }));
      if ((s.cnOmode || 'order') !== 'order') return md;
      return md.concat(PERMS.map((p, i) => ({ group: i === 0 ? '△ABC ≡ △ 다음 순서는?' : '', label: `△ABC ≡ △${permName(p)}`, color: 'amber', apply: (ss) => { ss.cnOpick = i; }, on: (ss) => ss.cnOpick === i })));
    },
    init: (s) => { s.cnOmode = 'order'; s.cnOa = 6; s.cnOb = 7; s.cnOc = 8; s.cnOs = 3; s.cnOpick = null; s.cnRw = 6; s.cnRh = 4; s.cnRw2 = 8; s.cnPk = { s: 0, k: 0 }; },
    reroll: (s) => { s.cnOs = pick([0, 1, 2, 3, 4, 5], s.cnOs); s.cnOpick = null; s.cnPk = { k: ((s.cnPk && s.cnPk.k) || 0) + 1, t: [0, 1, 2, 3, 4, 5, 6, 7], f: rint(0, 6), tt: shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], Math.random).slice(0, 4), sg: pick([0, 1, 2, 3, 4, 5], null) }; },
    model: (s) => ({ mode: s.cnOmode || 'order', g: ordGeo(s), pick: s.cnOpick, Rw: s.cnRw, Rh: s.cnRh, Rw2: s.cnRw2, pk: s.cnPk || { k: 0 } }),
    draw(b, s, M, C) {
      if (C.problem) { drawOrderProblem(b, M); return; }
      const mode = C.review ? (C.step >= 3 ? 'area' : 'order') : M.mode;
      if (mode === 'area') {
        const w1 = M.Rw, h1 = M.Rh, area = w1 * h1, w2 = M.Rw2, h2 = area / w2, same = w2 === w1 || w2 === h1;
        const X = w1 + 2.4, hmax = Math.max(h1, h2, 4);
        fit(b, { x0: -0.6, x1: X + Math.max(w2, 8) + 0.6, y0: -hmax - 0.6, y1: 1.4 }, { t: 30, b: 70 });
        const r1 = [pt(0, 0), pt(w1, 0), pt(w1, -h1), pt(0, -h1)], r2 = [pt(X, 0), pt(X + w2, 0), pt(X + w2, -h2), pt(X, -h2)];
        fillPoly(b, r1, 'sky', 0.14); poly(b, r1, 'ink', 3.4); fillPoly(b, r2, same ? 'green' : 'rose', 0.14); poly(b, r2, 'ink', 3.4);
        T(b, pt(w1 / 2, -h1 / 2), `넓이 ${area}`, { size: 17, color: 'sky' }); T(b, pt(X + w2 / 2, -h2 / 2), `넓이 ${fmtN(area)}`, { size: 17, color: same ? 'green' : 'rose' });
        T(b, pt(w1 / 2, 0), `${w1}`, { dy: 18, size: 16, color: 'sky' }); T(b, pt(0, -h1 / 2), `${h1}`, { dx: -14, size: 16, color: 'sky' });
        T(b, pt(X + w2 / 2, 0), `${w2}`, { dy: 18, size: 16, color: same ? 'green' : 'rose' }); T(b, pt(X + w2, -h2 / 2), `${fmtN(h2)}`, { dx: 16, size: 16, color: same ? 'green' : 'rose' });
        if (C.txt) T(b, pt((X + w2 + 0) / 2, 0), same ? '넓이도 같고 모양·크기도 같아서 합동이에요 ✓' : '넓이는 같지만 합동이 아니에요 ✗ (모양이 달라요)', { dy: 46, size: b.W < 560 ? 14 : 17, color: same ? 'green' : 'rose' });
        return;
      }
      const g = M.g, pk = M.pick == null ? null : PERMS[M.pick];
      const bb = unionBox(bboxOf(g.Tr, 0.5), bboxOf(g.img, 0.5));
      fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 + 1.6 }, { t: 34, b: 60 });
      const cA = centroid(g.Tr), cB = centroid(g.img);
      const chosen = C.review ? PERMS.findIndex((p) => orderOK(g, p)) : M.pick, pkk = chosen == null || chosen < 0 ? null : PERMS[chosen], ok = pkk ? orderOK(g, pkk) : false;
      const L = (i, j) => dist(g.Tr[i], g.Tr[j]);
      fillPoly(b, g.Tr, 'sky', 0.1); poly(b, g.Tr, 'ink', 3.4); fillPoly(b, g.img, 'sky', 0.1); poly(b, g.img, 'ink', 3.4);
      // 변 길이 (그림 안, 정수)
      [[0, 1, g.c], [1, 2, g.a], [2, 0, g.b]].forEach(([i, j, v]) => { sideTag(b, g.Tr[i], g.Tr[j], cA, `${v}`, { size: 16, color: 'sky' }); });
      [[0, 1, g.c], [1, 2, g.a], [2, 0, g.b]].forEach(([i, j, v]) => { sideTag(b, g.img[i], g.img[j], cB, `${v}`, { size: 16, color: 'sky' }); });
      g.Tr.forEach((p, i) => { b.point(p, { color: pkk ? VCOL[i] : 'ink', r: 5 }); tagOut(b, p, cA, 'ABC'[i], { size: 17, color: pkk ? VCOL[i] : 'ink' }); });
      // 점 이름 D,E,F : 그림의 상 위치에 sg 가 정한 이름
      g.img.forEach((p, i) => { const nameIdx = g.sg[i]; const mine = pkk ? pkk.findIndex((x) => x === nameIdx) : -1; b.point(p, { color: mine >= 0 ? VCOL[mine] : 'ink', r: 5 }); tagOut(b, p, cB, 'DEF'[nameIdx], { size: 17, color: mine >= 0 ? VCOL[mine] : 'ink' }); });
      if (pkk) {
        pkk.forEach((nameIdx, i) => { const q = g.posOf[nameIdx]; line(b, g.Tr[i], q, VCOL[i], 1.6, { dash: [4, 6], alpha: 0.7 }); });
      }
      if (C.txt) {
        const cx = (bb.x0 + bb.x1) / 2;
        if (!pkk) T(b, pt(cx, bb.y1 + 0.6), `점 A, B, C와 대응하는 점을 순서대로 골라 보세요`, { dy: 30, size: b.W < 560 ? 14 : 16, color: 'amber' });
        else {
          const bad = [[0, 1], [1, 2], [2, 0]].find(([i, j]) => Math.abs(L(i, j) - dist(g.posOf[pkk[i]], g.posOf[pkk[j]])) > 1e-6);
          T(b, pt(cx, bb.y1 + 0.3), ok ? `△ABC ≡ △${permName(pkk)} ✓ 대응변의 길이가 모두 같아요` : `△ABC ≡ △${permName(pkk)} ✗ ${'ABC'[bad[0]]}${'ABC'[bad[1]]} = ${fmtN(L(bad[0], bad[1]))} 인데 ${'DEF'[pkk[bad[0]]]}${'DEF'[pkk[bad[1]]]} = ${fmtN(dist(g.posOf[pkk[bad[0]]], g.posOf[pkk[bad[1]]]))}`, { dy: 34, size: b.W < 560 ? 13 : 16, color: ok ? 'green' : 'rose' });
        }
      }
    },
    stepT: () => 1,
    steps: (M) => {
      const g = M.g, good = PERMS.find((p) => orderOK(g, p));
      return [
        '합동인 두 삼각형은 대응하는 꼭짓점의 순서에 맞게 쓰는 것이 약속이에요. 점 A, B, C와 대응하는 점을 차례로 써요.',
        `길이가 같은 변을 찾아 대응점을 이어요. 이 그림에서는 $\\triangle ABC\\equiv\\triangle ${good ? permName(good) : 'DEF'}$예요.`,
        '넓이가 같아도 모양이 다르면 합동이 아니에요. 합동이면 넓이는 같지만, 넓이가 같다고 합동인 것은 아니에요.'
      ];
    },
    view: (M) => {
      if (M.mode === 'area') {
        const area = M.Rw * M.Rh, same = M.Rw2 === M.Rw || M.Rw2 === M.Rh;
        return { guide: '두 직사각형의 <b>넓이는 같게</b> 맞춰 두었어요. 막대로 가로·세로를 바꿔 보세요. 모양까지 같을 때만 합동이에요.', readouts: [rd('넓이', `${area}`, 'sky', '두 직사각형 모두'), rd('합동인가요', same ? '합동이에요' : '합동이 아니에요', same ? 'green' : 'rose')], status: same ? { tone: 'ok', text: '합동이에요' } : { tone: 'warn', text: '넓이가 같아도 합동이 아니에요' }, rule: '합동이면 넓이가 같지만, 넓이가 같다고 합동인 것은 아니다', notes: notes('합동의 필요조건: 넓이가 같아야 해요. 하지만 이것만으로는 부족해요(모양도 같아야 해요).') };
      }
      const g = M.g, pkk = M.pick == null ? null : PERMS[M.pick], ok = pkk ? orderOK(g, pkk) : null;
      return {
        guide: '위의 칩에서 <b>△ABC ≡ △○○○</b>의 순서를 골라 보세요. 맞으면 초록, 틀리면 어떤 변이 안 맞는지 알려 줘요. 변의 길이가 그림 안에 적혀 있어요.',
        readouts: [rd('세 변', `${g.c}, ${g.a}, ${g.b}`, 'sky', 'AB, BC, CA'), rd('고른 순서', pkk ? `△ABC ≡ △${permName(pkk)}` : '아직 안 골랐어요', ok == null ? 'ink' : ok ? 'green' : 'rose')],
        status: ok == null ? { tone: 'info', text: '순서를 골라 보세요' } : ok ? { tone: 'ok', text: '대응 순서가 맞아요' } : { tone: 'warn', text: '대응 순서가 틀렸어요' },
        rule: '합동인 두 삼각형은 대응하는 꼭짓점의 순서대로 쓴다  △ABC ≡ △DEF',
        notes: notes('대응변의 길이가 같은 꼭짓점끼리 순서를 맞춰요. 알파벳 순서대로(ABC ≡ DEF)가 아닐 때도 있어요.', '세 변이 모두 다르면 맞는 순서는 하나뿐이에요.')
      };
    },
    prob: (M) => {
      const pk = M.pk, key = `${pk.k}.${pk.f}.${(pk.tt || []).join('')}`;
      const TRUE = ['합동인 두 도형은 모양과 크기가 같다.', '합동인 두 도형에서 대응변의 길이는 각각 같다.', '합동인 두 도형에서 대응각의 크기는 각각 같다.', '합동인 두 삼각형의 넓이는 서로 같다.', '$\\triangle ABC\\equiv\\triangle DEF$이면 $\\angle B=\\angle E$이다.', '$\\triangle ABC\\equiv\\triangle DEF$이면 $\\overline{BC}=\\overline{EF}$이다.', '$\\triangle ABC\\equiv\\triangle DEF$이면 $\\angle C=\\angle F$이다.', '$\\triangle ABC\\equiv\\triangle DEF$이면 $\\overline{CA}=\\overline{FD}$이다.', '합동인 두 삼각형은 포개어진다.'];
      const FALSE = ['넓이가 같은 두 삼각형은 합동이다.', '둘레의 길이가 같은 두 삼각형은 합동이다.', '세 각의 크기가 각각 같은 두 삼각형은 합동이다.', '모양이 같은 두 도형은 합동이다.', '한 각의 크기가 같은 두 삼각형은 합동이다.', '$\\triangle ABC\\equiv\\triangle DEF$이면 $\\overline{AB}=\\overline{EF}$이다.', '$\\triangle ABC\\equiv\\triangle DEF$이면 $\\angle A=\\angle E$이다.'];
      const items = [{ h: FALSE[pk.f % FALSE.length], ok: true }].concat((pk.tt || [0, 1, 2, 3]).slice(0, 4).map((i) => ({ h: TRUE[i % TRUE.length], hint: '이 설명은 옳아요. 옳지 않은 것을 찾아야 해요.' })));
      return { tag: '합동의 성질 · 옳지 않은 것', key, stem: '다음 중 옳지 않은 것은? (△ABC와 △DEF는 그림과 같이 꼭짓점 A, B, C가 각각 D, E, F에 대응한다.)', choices: mkTextChoices(items, key), wide: true };
    }
  };
  function drawOrderProblem(b, M) {
    const Tr = triSSS(6, 7, 8), img = imageAt(Tr, 'rot', 0, 12), cA = centroid(Tr), cB = centroid(img), bb = unionBox(bboxOf(Tr, 0.4), bboxOf(img, 0.4));
    fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 }, { t: 40, b: 44 });
    fillPoly(b, Tr, 'sky', 0.1); poly(b, Tr, 'ink', 3.4); fillPoly(b, img, 'sky', 0.1); poly(b, img, 'ink', 3.4);
    Tr.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, cA, 'ABC'[i], { size: 17 }); });
    img.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, cB, 'DEF'[i], { size: 17 }); });
  }

  /* ====================================================================== 3. 합동의 성질로 구하기 */
  const QMODES = [['side', '변의 길이'], ['ang', '각의 크기']];
  const cong = {
    id: 'c4-3', title: '합동의 성질로 길이와 각 구하기', short: '성질로 구하기',
    question: '△ABC ≡ △DEF 일 때, 대응변의 길이와 대응각의 크기는 어떻게 될까? 값을 바꿔 가며 확인해 보자.',
    ctl: (s) => ((s.cnQmode || 'side') === 'ang' ? ['cnQA', 'cnQB', 'cnPt'] : ['cnQa', 'cnQb', 'cnQc', 'cnPt']),
    anim: { key: 'cnPt', dur: 4, label: '포개어 보기', start: 0 },
    presets: () => QMODES.map(([id, label], i) => ({ group: i === 0 ? '살펴볼 것' : '', label, apply: (s) => { s.cnQmode = id; s.cnPt = 0; s.playing = false; }, on: (s) => (s.cnQmode || 'side') === id })),
    init: (s) => { s.cnQmode = 'side'; s.cnQa = 6; s.cnQb = 7; s.cnQc = 8; s.cnQA = 50; s.cnQB = 60; s.cnPt = 0; s.cnPk = { kind: 0, x: 4, k: 2, m: 1, n: 9, b: 6, c: 7, A: 60, r: 60, p: 2, q: 0, k0: 0 }; },
    reroll: (s) => {
      const kind = ((s.cnPk && s.cnPk.kind) || 0) === 0 ? 1 : 0;
      let pk = { kind, k0: ((s.cnPk && s.cnPk.k0) || 0) + 1 };
      if (kind === 0) { for (let t = 0; t < 80; t++) { const k = pick([2, 3], 0), x = rint(2, 6), n = rint(5, 9), m = n - k * x; if (Math.abs(m) <= 4 && m !== 0) { const b2 = rint(5, 8), c2 = rint(5, 8); if (n < b2 + c2 && b2 < n + c2 && c2 < n + b2) { pk = { ...pk, k, x, m, n, b: b2, c: c2 }; break; } } } }
      else { for (let t = 0; t < 80; t++) { const p = pick([2, 3, 5], 0), x = rint(4, 15), r = 5 * rint(8, 16), q = r - p * x; if (Math.abs(q) <= 20 && q !== 0 && r >= 40 && r <= 80) { pk = { ...pk, p, x, q, r, A: 5 * rint(7, 14) }; if (pk.A + r < 175) break; } } }
      s.cnPk = pk;
    },
    model: (s) => ({ mode: s.cnQmode || 'side', a: s.cnQa, b: s.cnQb, c: s.cnQc, A: s.cnQA, B: s.cnQB, pk: s.cnPk || { kind: 0, x: 4, k: 2, m: 1, n: 9, b: 6, c: 7 } }),
    draw(b, s, M, C) {
      const mode = C.review ? (C.step >= 3 ? 'ang' : 'side') : M.mode;
      let Tr;
      if (C.problem) {
        const pk = M.pk;
        Tr = (pk.kind || 0) === 0 ? triSSS(pk.n, pk.b || 6, pk.c || 7) : triASA(6, pk.A || 60, pk.r || 60);
      } else Tr = mode === 'side' ? triSSS(M.a, M.b, M.c) : triASA(6, M.A, M.B);
      if (!Tr) Tr = triSSS(6, 7, 8);
      const X0 = bboxOf(Tr).x1 - bboxOf(Tr).x0 + 3.2, t = C.problem ? 0 : (C.review ? 0 : C.t);
      const bb = unionBox(bboxOf(Tr, 0.3), (() => { let u = bboxOf(Tr, 0.3); [0, 1].forEach((tt) => { u = unionBox(u, bboxOf(imageAt(Tr, 'rot', tt, X0), 0.3)); }); return u; })());
      fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 + 0.6 }, { t: 40, b: 58 });
      const img = imageAt(Tr, 'rot', t, X0), done = t >= 0.999, cA = centroid(Tr), cB = centroid(img), st = C.review ? C.step : 3;
      fillPoly(b, Tr, 'sky', 0.1); poly(b, Tr, 'ink', 3.4); fillPoly(b, img, 'green', 0.1); poly(b, img, 'ink', 3.4);
      const sideNum = C.problem ? null : mode === 'side' ? { c: M.c, a: M.a, b: M.b } : null;
      const angNum = C.problem ? null : mode === 'ang' ? { A: M.A, B: M.B, C: 180 - M.A - M.B } : null;
      const showTick = !C.problem && st >= 2, showRing = !C.problem && st >= 3;
      const S = [[0, 1, 'c'], [1, 2, 'a'], [2, 0, 'b']];
      if (!C.problem && (mode === 'side' ? st >= 2 : true)) {
        S.forEach(([i, j, k]) => { if (sideNum) { sideTag(b, Tr[i], Tr[j], cA, `${sideNum[k]}`, { size: 16, color: 'sky' }); if (!done) sideTag(b, img[i], img[j], cB, `${sideNum[k]}`, { size: 16, color: 'sky' }); } });
      }
      if (showTick) S.forEach(([i, j, k], idx) => { tick(b, Tr[i], Tr[j], idx + 1, 'amber'); tick(b, img[i], img[j], idx + 1, 'amber'); });
      if (!C.problem && (mode === 'ang' ? st >= 2 : true)) {
        [0, 1, 2].forEach((i) => {
          if (!(showRing || mode === 'ang')) return;
          const k = 'ABC'[i], v = Tr[i], q1 = Tr[(i + 1) % 3], q2 = Tr[(i + 2) % 3], w = img[i], r1 = img[(i + 1) % 3], r2 = img[(i + 2) % 3];
          ang(b, v, q1, q2, { color: VCOL[i], rings: i + 1, label: angNum ? dg(angNum[k]) : '', r: 24 });
          ang(b, w, r1, r2, { color: VCOL[i], rings: i + 1, label: angNum && !done ? dg(angNum[k]) : '', r: 24 });
        });
      }
      if (C.problem) drawProblemLabels(b, M, Tr, img, cA, cB);
      Tr.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, cA, 'ABC'[i], { size: 17 }); });
      img.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); if (!done) tagOut(b, p, cB, 'DEF'[i], { size: 17 }); });
      if (C.txt && !C.problem) T(b, pt((bb.x0 + bb.x1) / 2, bb.y1 + 0.2), done ? '포개어져요 → 대응하는 값이 모두 같아요' : mode === 'side' ? '대응변: AB=DE, BC=EF, CA=FD (길이가 같아요)' : '대응각: ∠A=∠D, ∠B=∠E, ∠C=∠F (크기가 같아요)', { dy: 24, size: b.W < 560 ? 13 : 16, color: 'amber' });
    },
    stepT: () => 0,
    steps: (M) => [
      '△ABC ≡ △DEF에서 합동 기호의 순서대로 대응점은 A↔D, B↔E, C↔F예요. 이 대응에서 변과 각을 찾아요.',
      `대응변의 길이는 같아요. $\\overline{AB}=\\overline{DE}=${M.c}$, $\\overline{BC}=\\overline{EF}=${M.a}$, $\\overline{CA}=\\overline{FD}=${M.b}$ (cm)`,
      `대응각의 크기도 같아요. $\\angle A=\\angle D=${M.A}^{\\circ}$, $\\angle B=\\angle E=${M.B}^{\\circ}$, $\\angle C=\\angle F=${180 - M.A - M.B}^{\\circ}$ (삼각형의 세 내각의 합 $180^{\\circ}$)`
    ],
    view: (M) => {
      const side = M.mode === 'side';
      return {
        guide: `<b>살펴볼 것</b>을 골라 막대로 값을 바꿔 보세요. 삼각형 ABC와 DEF는 합동이라서 대응하는 ${side ? '변의 길이' : '각의 크기'}가 늘 같아요. ▶를 누르면 오른쪽 삼각형이 제자리에서 돌고 가로로 와서 포개져요.`,
        readouts: side ? [rd('AB = DE', `${M.c} cm`, 'amber'), rd('BC = EF', `${M.a} cm`, 'sky'), rd('CA = FD', `${M.b} cm`, 'green')] : [rd('∠A = ∠D', dg(M.A), 'sky'), rd('∠B = ∠E', dg(M.B), 'rose'), rd('∠C = ∠F', dg(180 - M.A - M.B), 'green', `180° − ${M.A + M.B}°`)],
        formula: side ? `<p>$\\overline{AB}=\\overline{DE}=${M.c}$, $\\overline{BC}=\\overline{EF}=${M.a}$, $\\overline{CA}=\\overline{FD}=${M.b}$</p>` : `<p>$\\angle A=\\angle D=${M.A}^{\\circ}$, $\\angle B=\\angle E=${M.B}^{\\circ}$, $\\angle C=\\angle F=${180 - M.A - M.B}^{\\circ}$</p>`,
        rule: '합동인 두 도형에서 대응변의 길이는 같고, 대응각의 크기는 같다',
        notes: notes('같은 알파벳 위치가 아니라 <b>합동 기호의 순서</b>가 대응을 정해요.', '대응변을 쓸 때는 대응점끼리 짝지어 써요. 예: $\\overline{BC}$의 대응변은 $\\overline{EF}$.')
      };
    },
    prob: (M) => {
      const pk = M.pk;
      if ((pk.kind || 0) === 0) {
        const { k, x, m, n } = pk, ex = `${k}x${m > 0 ? '+' : '−'}${Math.abs(m)}`;
        return {
          tag: '합동인 도형의 성질 · 변의 길이', key: `s${k}.${x}.${m}.${n}`,
          stem: `그림에서 △ABC ≡ △DEF이다. $\\overline{BC}=(${ex})$ cm, $\\overline{EF}=${n}$ cm일 때, $x$의 값은?`,
          choices: mkChoices(x, [[n, '대응변의 길이가 같다고 식을 세워야 해요. $' + ex + '=' + n + '$을 풀어 보세요.'], [(n + m) / k, '부호를 확인하세요. 상수항을 옮길 때 부호가 바뀌어요.'], [x + 1, '식을 풀 때 계산이 틀렸어요.'], [x - 1, '식을 풀 때 계산이 틀렸어요.'], [k * x + m, 'x가 아니라 변의 길이예요.']], { tex: (v) => String(v), plain: (v) => String(v), valid: (v) => Number.isInteger(v) && v > 0, pad: 1 })
        };
      }
      const { p, x, q, r } = pk, ex = `${p}x${q > 0 ? '+' : '−'}${Math.abs(q)}`;
      return {
        tag: '합동인 도형의 성질 · 각의 크기', key: `a${p}.${x}.${q}.${r}`,
        stem: `그림에서 △ABC ≡ △DEF이다. $\\angle B=(${ex})^{\\circ}$, $\\angle E=${r}^{\\circ}$일 때, $x$의 값은?`,
        choices: mkChoices(x, [[r, '대응각의 크기가 같다고 식을 세워야 해요. $' + ex + '=' + r + '$을 풀어 보세요.'], [(r + q) / p, '부호를 확인하세요. 상수항을 옮기면 부호가 바뀌어요.'], [x + 1, '식을 풀 때 계산이 틀렸어요.'], [x - 1, '식을 풀 때 계산이 틀렸어요.'], [180 - r - pk.A, '∠C의 크기를 구했어요. x를 구해야 해요.']], { tex: (v) => String(v), plain: (v) => String(v), valid: (v) => Number.isInteger(v) && v > 0, pad: 1 })
      };
    }
  };
  function drawProblemLabels(b, M, Tr, img, cA, cB) {
    const pk = M.pk;
    if ((pk.kind || 0) === 0) {
      const ex = `${pk.k}x${pk.m > 0 ? '+' : '−'}${Math.abs(pk.m)}`;
      sideTag(b, Tr[1], Tr[2], cA, ex, { size: 16, color: 'rose' }); sideTag(b, img[1], img[2], cB, `${pk.n}`, { size: 16, color: 'sky' });
      sideTag(b, Tr[0], Tr[1], cA, `${pk.c}`, { size: 16, color: 'sky' }); sideTag(b, Tr[2], Tr[0], cA, `${pk.b}`, { size: 16, color: 'sky' });
    } else {
      const ex = `${pk.p}x${pk.q > 0 ? '+' : '−'}${Math.abs(pk.q)}`;
      ang(b, Tr[1], Tr[2], Tr[0], { color: 'rose', rings: 2, label: `(${ex})°`, r: 26, labelDist: 62 });
      ang(b, img[1], img[2], img[0], { color: 'rose', rings: 2, label: `${pk.r}°`, r: 26, labelDist: 56 });
      ang(b, Tr[0], Tr[1], Tr[2], { color: 'sky', rings: 1, label: `${pk.A}°`, r: 26, labelDist: 56 });
    }
  }

  G.pair = { imageAt, pairBox, triOf, POSE, VCOL, edgeTicks, angMarks };
  G.register(40, 't4', '④ 합동인 도형', '합동인 도형', PARAMS, [overlap, ordScene, cong]);
})();
