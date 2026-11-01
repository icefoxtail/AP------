/* ==========================================================================
   중1 · 다면체와 정다면체 — 탭 ① 「다면체와 각기둥·각뿔·각뿔대」 (t1.js, order 10) — 장면 8개
   · p1-0 다면체인가? · p1-1 n각기둥 · p1-2 n각뿔 · p1-3 각뿔대 만들기 · p1-4 옆면의 모양 · p1-5 이름 맞히기 · p1-6 [함정] 각뿔대 판별 · p1-7 오일러의 공식
   원칙: 입체는 처음부터 3차원 · 면·모서리·꼭짓점의 수는 그림 안에 크게 · 떼어 내기와 밀어내기는 화면 가로로만 · 모든 글자·정답은 지금의 n 으로 다시 계산
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PH;
  if (!G || !G.prismS) return;
  const { jo, clamp, pick, rint, shuf, v3, add3, sub3, mul3, mid3, scene3, P, VIEW, mkChoices, mkText, rd, notes, NK, KNAME, nameOf, countsOf, solidOfKind, banner, sRect,
    prismS, pyrS, frustumS, topPyrS, platS, PLAT, PLAT_KEYS, drawPoly, faceMid, drawCurved, hxOf, DEG, PI, unit3, dot3, bboxOf } = G;

  const PARAMS = {
    phN: P('밑면의 변의 수 n', 3, 12, 1, 5, { color: 'amber', hint: '막대를 움직여 n각형을 바꿔 보세요', format: (v) => `${Math.round(v)}각형` }),
    phN8: P('밑면의 변의 수 n', 3, 8, 1, 5, { color: 'amber', hint: '막대를 움직여 n각형을 바꿔 보세요', format: (v) => `${Math.round(v)}각형` }),
    phSplit: P('면 떼어 내기', 0, 1, 0.01, 1, { color: 'sky', hint: '밑면을 가로로 밀어내면 옆면이 몇 개인지 세기 쉬워요', format: (v) => (v < 0.02 ? '붙어 있음' : Math.round(v * 100) + '%') }),
    phCut: P('자르는 위치', 0.2, 0.8, 0.01, 0.5, { color: 'green', hint: '각뿔을 밑면과 평행하게 자를 위치예요', format: (v) => `꼭대기에서 ${Math.round(v * 100)}%` }),
    phSep: P('윗 각뿔 떼어 내기', 0, 1, 0.01, 0.7, { color: 'sky', hint: '잘라 낸 윗부분을 가로로 밀어내요', format: (v) => (v < 0.02 ? '붙어 있음' : Math.round(v * 100) + '%') }),
    phFace: P('옆면 고르기', 1, 8, 1, 1, { color: 'amber', hint: '옆면 하나를 골라 오른쪽으로 꺼내 봐요', format: (v) => `${Math.round(v)}번 옆면` }),
    phOut: P('옆면 꺼내기', 0, 1, 0.01, 1, { color: 'sky', hint: '고른 옆면을 가로로 꺼내요', format: (v) => (v < 0.02 ? '붙어 있음' : Math.round(v * 100) + '%') }),
    phF: P('면의 개수 F', 5, 10, 1, 8, { color: 'amber', hint: '면의 개수가 같은 세 입체를 비교해요', format: (v) => `${Math.round(v)}개` }),
    phCut2: P('자르는 위치', 0.25, 0.75, 0.01, 0.5, { color: 'green', format: (v) => `꼭대기에서 ${Math.round(v * 100)}%` })
  };
  const AMB = 'amber', SKY = 'sky', GRN = 'green', RED = 'red', VIO = 'violet';
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;
  const Q3 = { F: '면', E: '모서리', V: '꼭짓점' };
  const stepOf = (C) => (C.problem ? 0 : C.review ? C.step : 4);

  /* ------------------------------------------------------------------ 개수 문제 (기둥·뿔·뿔대 공통) */
  function mkCountQ(kind, n, given, ask) {
    const c = countsOf(kind, n), kn = KNAME[kind];
    const other = ['F', 'E', 'V'].filter((q) => q !== ask);
    const wr = [];
    other.forEach((q) => wr.push([c[q], `${Q3[q]}의 개수예요. 구하는 것은 ${Q3[ask]}의 개수예요.`]));
    wr.push([n, `밑면의 변의 수 n 이에요. 개수를 구하는 식에 넣어야 해요.`]);
    const alt = kind === 'pyr' ? countsOf('prism', n) : countsOf('pyr', n);
    wr.push([alt[ask], kind === 'pyr' ? '각기둥의 식으로 계산했어요.' : '각뿔의 식으로 계산했어요.']);
    wr.push([c[ask] + 1, '하나 더 셌어요. 밑면의 개수를 다시 확인해 보세요.']);
    wr.push([c[ask] - 1, '하나 덜 셌어요. 밑면의 개수를 다시 확인해 보세요.']);
    return {
      tag: '다면체의 구성 요소',
      key: `${kind}|${n}|${given}|${ask}`,
      stem: `${Q3[given]}의 개수가 ${c[given]}개인 ${kn}의 ${Q3[ask]}의 개수는?`,
      choices: mkChoices(c[ask], wr)
    };
  }
  function rollCount(kind) {
    const n = rint(kind === 'pyr' ? 4 : 4, 12);
    const pairs = kind === 'pyr' ? [['E', 'F'], ['E', 'V'], ['F', 'E'], ['V', 'E']] : [['E', 'F'], ['E', 'V'], ['V', 'F'], ['V', 'E'], ['F', 'E'], ['F', 'V']];
    const [g, a] = pairs[Math.floor(Math.random() * pairs.length)];
    return { n, given: g, ask: a };
  }

  /* ------------------------------------------------------------------ p1-0 다면체인가? */
  const KINDS = [
    { id: 'prism', nm: (n) => nameOf('prism', n), poly: true }, { id: 'cyl', nm: () => '원기둥', poly: false },
    { id: 'pyr', nm: (n) => nameOf('pyr', n), poly: true }, { id: 'cone', nm: () => '원뿔', poly: false },
    { id: 'sph', nm: () => '구', poly: false }, { id: 'fr', nm: (n) => nameOf('fr', n), poly: true }
  ];
  // 한 입체를 center 에 크기 k 로 그립니다. mode: 'big'(면 표시) | 'mini'(문제용)
  function drawKind(D, kd, n, c, k, o = {}) {
    const edgeW = o.mini ? 2.6 : 3;
    if (kd.poly) {
      const kind = kd.id, S = kind === 'prism' ? prismS(n, 1.5 * k, 2.1 * k) : kind === 'pyr' ? pyrS(n, 1.6 * k, 2.2 * k) : frustumS(n, 0.5, 1.7 * k, 2.2 * k);
      drawPoly(D, S, { off: c, face: (fi, vis) => (vis ? { c: o.faceCol || 'green', a: o.faceA == null ? 0.18 : o.faceA } : null), edge: () => ({ color: 'ink', width: edgeW }) });
      return { S, pts: S.V.map((p) => add3(p, c)) };
    }
    const r = (kd.id === 'sph' ? 1.35 : 1.25) * k, h = 2.1 * k;
    drawCurved(D, kd.id === 'cyl' ? 'cylinder' : kd.id === 'cone' ? 'cone' : 'sphere', c, r, h, { color: 'orange', alpha: 0.2, width: edgeW });
    const e = kd.id === 'sph' ? r : Math.max(r, h / 2);
    return { pts: [add3(c, v3(-e, -e, -e)), add3(c, v3(e, e, e))] };
  }
  // 문제용: 입체 5개를 3+2 로 늘어놓고 ①~⑤ 번호를 붙입니다(먼저 화면 틀을 맞춘 뒤 그립니다).
  function drawRow(D, s, its, C) {
    const ctr = [[-1, 0], [0, 0], [1, 0], [-0.5, 1], [0.5, 1]], SP = 2.9, k = 0.7;
    const pos = its.map((it, i) => add3(hxOf(s, ctr[i][0] * SP), v3(0, 0, -ctr[i][1] * 3.2)));
    const pts = [];
    pos.forEach((c) => pts.push(add3(c, v3(-1.5, 0, -1.5)), add3(c, v3(1.5, 0, 1.5))));
    D.fitPts(pts, { t: 24, b: 56, l: 24, r: 24 });
    its.forEach((it, i) => {
      drawKind(D, KINDS.find((q) => q.id === it.id), it.n, pos[i], k, { mini: true });
      D.label(add3(pos[i], v3(0, 0, -1.4)), `(${i + 1})`, { color: AMB, size: 19, at: [[0, 24]] });
    });
    D.flush();
  }
  function rollP0() {
    const polys = [['prism', rint(3, 7)], ['pyr', rint(3, 7)], ['fr', rint(3, 6)], ['prism', rint(3, 7)], ['pyr', rint(3, 7)]];
    const cur = ['cyl', 'cone', 'sph'][Math.floor(Math.random() * 3)];
    const items = [];
    const seenN = new Set();
    polys.forEach((p) => { const key = p[0] + p[1]; if (items.length < 4 && !seenN.has(key)) { seenN.add(key); items.push({ id: p[0], n: p[1] }); } });
    while (items.length < 4) { const id = ['prism', 'pyr', 'fr'][rint(0, 2)], n = rint(3, 7), key = id + n; if (!seenN.has(key)) { seenN.add(key); items.push({ id, n }); } }
    items.push({ id: cur, n: 4 });
    return { items: shuf(items) };
  }
  const kindOf = (it) => KINDS.find((q) => q.id === it.id);
  const P0 = {
    id: 'p1-0', title: '다면체인가?', short: '다면체인가?',
    question: '입체도형 중에서 다면체는 어떤 것일까? 면이 어떤 모양인지 살펴보자.',
    ctl: (s) => ['phN8'].concat(VIEW),
    presets: (s) => KINDS.map((k, i) => ({ group: i === 0 ? '입체 고르기' : '', label: k.id === 'prism' ? '각기둥' : k.id === 'pyr' ? '각뿔' : k.id === 'fr' ? '각뿔대' : k.nm(), apply: (st) => { st.phKind = i; }, on: (st) => st.phKind === i })),
    init: (s) => { s.phKind = 0; s.phN8 = 5; s.phQ = rollP0(); },
    reroll: (s) => { s.phQ = rollP0(); },
    model: (s) => {
      const kd = KINDS[clamp(s.phKind | 0, 0, 5)], n = clamp(Math.round(s.phN8), 3, 8);
      const F = kd.poly ? countsOf(kd.id, n).F : null;
      return { kd, n, F, name: kd.nm(n), Q: s.phQ };
    },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C);
      if (C.problem) { drawRow(D, s, M.Q.items, C); return; }
      const kd = M.kd, n = M.n, c0 = v3(0, 0, 0);
      const poly = kd.poly;
      const S = poly ? (kd.id === 'prism' ? prismS(n) : kd.id === 'pyr' ? pyrS(n) : frustumS(n, 0.5)) : null;
      const pts = poly ? S.V : [v3(-1.6, -1.6, -1.6), v3(1.6, 1.6, 1.6)];
      D.fitPts(pts, { t: 92, b: 50, l: 44, r: 44 });
      if (poly) {
        const info = drawPoly(D, S, { face: (fi, vis) => (vis ? { c: 'green', a: st >= 1 ? 0.26 : 0.12 } : null), edge: () => ({ color: 'ink', width: 3 }) });
        if (C.txt && (st === 1 || st === 4)) {
          S.F.forEach((f, fi) => { if (info.vis[fi]) D.label(faceMid(info.V, f), '다각형', { color: GRN, size: 14, at: [[0, 0]] }); });
        }
        S.V.forEach((p) => D.dot(p, 'ink', 3.5));
      } else {
        drawCurved(D, kd.id === 'cyl' ? 'cylinder' : kd.id === 'cone' ? 'cone' : 'sphere', c0, kd.id === 'sph' ? 1.6 : 1.4, 2.7, { color: 'orange', alpha: 0.24, width: 3.2 });
        if (C.txt && st !== 0) D.label(kd.id === 'cyl' ? v3(1.2, 0, 0) : kd.id === 'cone' ? v3(0.5, 0, -0.3) : v3(0.6, 0, 0.4), '곡면', { color: 'orange', size: 19, at: [[0, 0]] });
      }
      if (C.txt) {
        const title = M.name + (poly ? ` — ${M.F}면체` : '');
        const lines = [{ t: title, c: 'ink', size: 17 }];
        if (st === 4 || st === 2) lines.push({ t: poly ? '면이 모두 다각형이에요 → 다면체 ○' : '곡면이 있어요 → 다면체 ✕', c: poly ? GRN : 'orange', size: 16 });
        else if (st === 1) lines.push({ t: poly ? '모든 면이 다각형이에요' : '곡면이 하나 있어요', c: poly ? GRN : 'orange', size: 16 });
        else if (st === 3) lines.push({ t: poly ? `면이 ${M.F}개이니 ${M.F}면체` : '다면체가 아니라서 면의 수를 세지 않아요', c: poly ? AMB : 'orange', size: 16 });
        banner(b, lines, C);
      }
      D.flush();
    },
    steps: (M) => [
      `입체의 면을 하나씩 살펴요. ${M.name}의 면은 ${M.kd.poly ? '모두 다각형(평평한 면)이에요' : '곡면이 있어요'}.`,
      M.kd.poly ? `다각형인 면으로만 둘러싸인 입체가 다면체예요. ${M.name}은 다면체예요.` : `곡면이 하나라도 있으면 다면체가 아니에요. ${M.name}은 다면체가 아니에요.`,
      M.kd.poly ? `면의 개수가 $${M.F}$개이므로 $${M.F}$면체예요. ($n$면체 = 면이 $n$개인 다면체)` : '다면체가 아니면 몇 면체인지 말하지 않아요.'
    ],
    view: (M, C) => ({
      guide: `아래 <b>입체 고르기</b> 버튼으로 입체를 바꾸고, 막대로 밑면의 변의 수를 바꿔 보세요. ${span('green', '초록 다각형')}만으로 둘러싸이면 다면체, ${span('orange', '주황 곡면')}이 있으면 다면체가 아니에요.`,
      readouts: [rd('입체', M.name, AMB), rd('면의 모양', M.kd.poly ? '모두 다각형' : '곡면이 있음', M.kd.poly ? GRN : 'orange'), rd('다면체인가?', M.kd.poly ? '○ 다면체' : '✕ 아님', M.kd.poly ? GRN : 'orange'), rd('면의 개수', M.kd.poly ? `${M.F}개 (${M.F}면체)` : '—', AMB)],
      formula: M.kd.poly ? `<p>(면의 개수) $=${M.kd.id === 'pyr' ? M.n + '+1' : M.n + '+2'}=${M.F}$ → ${M.F}면체</p>` : '<p>곡면이 있으므로 다면체가 아니에요.</p>',
      rule: '다면체 = 다각형인 면으로만 둘러싸인 입체도형 (곡면이 있으면 다면체가 아니다)',
      notes: notes('각기둥·각뿔·각뿔대는 다면체예요. 원기둥·원뿔·구는 곡면이 있어서 다면체가 아니에요.', `$n$각형 밑면을 가진 각기둥의 면은 $n+2$개, 각뿔은 $n+1$개예요.`)
    }),
    prob: (M) => {
      const its = M.Q.items, ans = its.findIndex((it) => !kindOf(it).poly);
      return {
        tag: '다면체가 아닌 것',
        key: its.map((it) => it.id + it.n).join(','),
        stem: '다음 중 다면체가 아닌 것은? (그림의 (1)~(5)는 보기 ①~⑤의 입체예요)',
        choices: mkText(its.map((it, i) => ({ h: kindOf(it).nm(it.n), ok: i === ans, hint: kindOf(it).poly ? `${kindOf(it).nm(it.n)}은 다각형인 면으로만 둘러싸여 있어요. 곡면이 있는 입체를 찾아 보세요.` : '' })))
      };
    }
  };

  /* ------------------------------------------------------------------ p1-1 n각기둥 / p1-2 n각뿔 */
  function bpScene(kind) {
    const isP = kind === 'prism';
    const NAME = isP ? '각기둥' : '각뿔';
    const solid = (n) => (isP ? prismS(n, 1.25, 2.9) : pyrS(n, 1.3, 3.0));
    const baseIdx = (S) => S.F.map((f, i) => i).filter((i) => (isP ? Math.abs(S.F[i].n.z) > 0.999 : S.F[i].n.z < -0.999));
    const sideIdx = (S) => { const bi = baseIdx(S); return S.F.map((f, i) => i).filter((i) => !bi.includes(i)).sort((a, c) => Math.atan2(S.F[a].n.y, S.F[a].n.x) - Math.atan2(S.F[c].n.y, S.F[c].n.x)); };
    return {
      id: isP ? 'p1-1' : 'p1-2', title: isP ? 'n각기둥의 면·모서리·꼭짓점' : 'n각뿔의 면·모서리·꼭짓점', short: isP ? 'n각기둥' : 'n각뿔',
      question: isP ? '각기둥의 밑면이 n각형이면 면·모서리·꼭짓점은 각각 몇 개일까? 밑면을 가로로 밀어내고 옆면을 세어 보자.' : '각뿔의 밑면이 n각형이면 면·모서리·꼭짓점은 각각 몇 개일까? 밑면을 가로로 밀어내고 옆면을 세어 보자.',
      ctl: () => ['phN', 'phSplit'].concat(VIEW),
      init: (s) => { s.phN = 5; s.phSplit = 1; s.phQ = rollCount(kind); },
      reroll: (s) => { s.phQ = rollCount(kind); },
      model: (s) => {
        const n = clamp(Math.round(s.phN), 3, 12), S = solid(n), c = countsOf(kind, n);
        return { n, S, c, name: nameOf(kind, n), Q: s.phQ };
      },
      draw(b, s, M, C) {
        const D = scene3(b, s, C), { S, n } = M, st = stepOf(C), c = M.c;
        const W = (isP ? 2.8 : 3.0) - (b.W < 560 ? 0.4 : 0);
        const split = C.problem ? 0 : C.review ? (st === 1 ? 1 : 0) : s.phSplit;
        const bi = baseIdx(S), si = sideIdx(S);
        const dTop = isP ? hxOf(s, -W * split) : v3(0, 0, 0), dBot = hxOf(s, W * split);
        // 화면 틀: 가장 많이 벌어진 모양까지 담아서 막대를 움직여도 그림이 출렁이지 않게
        const ext = S.V.map((p) => add3(p, hxOf(s, W))).concat(isP ? S.V.map((p) => add3(p, hxOf(s, -W))) : [], S.V);
        D.fitPts(ext, { t: C.problem ? 30 : 100, b: 40, l: 36, r: 36 });
        const edgeSty = (ei) => {
          const e = S.E[ei], za = S.V[e.a].z, zb = S.V[e.b].z;
          const isBase = isP ? Math.abs(za - zb) < 1e-6 : (za < -1e-6 && zb < -1e-6) || (Math.abs(za - zb) < 1e-6);
          if (st === 2) return isBase ? { color: SKY, width: 5 } : { color: AMB, width: 5 };
          return { color: 'ink', width: 3 };
        };
        // 옆면
        const info = drawPoly(D, S, {
          only: si,
          face: (fi, vis) => (vis ? { c: AMB, a: st === 1 || st === 4 ? 0.26 : 0.1 } : null),
          edge: edgeSty
        });
        // 밑면 (붙어 있으면 그대로, 떨어지면 납작한 다각형으로)
        const bases = isP ? [bi.find((i) => S.F[i].n.z > 0), bi.find((i) => S.F[i].n.z < 0)] : [bi[0]];
        bases.forEach((fi, k) => {
          const f = S.F[fi], off = isP ? (k === 0 ? dTop : dBot) : dBot;
          if (split < 0.02) {
            drawPoly(D, S, { only: [fi], face: (q, vis) => (vis ? { c: SKY, a: st === 1 || st === 4 ? 0.3 : 0.1 } : null), edge: edgeSty });
          } else {
            D.panel(f.i.map((i) => add3(S.V[i], off)), SKY, st === 1 || st === 4 ? 0.3 : 0.1, st === 2 ? SKY : 'ink', st === 2 ? 5 : 2.8);
          }
          if (C.txt && st !== 2 && st !== 3 && (split >= 0.02 || D.facing(f.n))) D.label(add3(faceMid(S.V, f), off), '밑면', { color: SKY, size: 15, at: [[0, 0]] });
        });
        if (C.txt && !C.problem && st !== 2 && st !== 3) {
          si.forEach((fi, k) => { if (info.vis[fi]) D.label(faceMid(S.V, S.F[fi]), String(k + 1), { color: AMB, size: 17, at: [[0, 0]] }); });
        }
        // 꼭짓점
        S.V.forEach((p, i) => {
          if (C.problem) return;
          const apex = !isP && p.z > 0;
          const off = (isP && split >= 0.02) ? null : v3(0, 0, 0);
          if (!off) return;
          D.dot(p, st === 3 ? AMB : 'ink', st === 3 ? 5.5 : 3.5);
        });
        // 줄글
        if (C.txt && !C.problem) {
          const L = [];
          const lineF = { t: isP ? `면 = 밑면 2 + 옆면 ${n} = ${c.F}개` : `면 = 밑면 1 + 옆면 ${n} = ${c.F}개`, c: AMB, size: 15 };
          const lineE = { t: isP ? `모서리 = 밑 ${n}×2 + 옆 ${n} = ${c.E}개` : `모서리 = 밑 ${n} + 옆 ${n} = ${c.E}개`, c: SKY, size: 15 };
          const lineV = { t: isP ? `꼭짓점 = ${n}×2 = ${c.V}개` : `꼭짓점 = 밑 ${n} + 꼭대기 1 = ${c.V}개`, c: AMB, size: 15 };
          if (st === 4) L.push(lineF, lineE, lineV); else if (st === 1) L.push(lineF); else if (st === 2) L.push(lineE); else if (st === 3) L.push(lineV);
          banner(b, L, C);
        }
        D.flush();
      },
      steps: (M) => {
        const { n, c } = M;
        return isP ? [
          `면: 밑면 $2$개와 옆면 $${n}$개를 합하면 $2+${n}=${c.F}$ (개)예요.`,
          `모서리: 밑면의 모서리 $${n}\\times 2$개와 옆의 모서리 $${n}$개를 합하면 $${n}\\times 3=${c.E}$ (개)예요.`,
          `꼭짓점: 위 밑면에 $${n}$개, 아래 밑면에 $${n}$개이므로 $${n}\\times 2=${c.V}$ (개)예요.`
        ] : [
          `면: 밑면 $1$개와 옆면 $${n}$개를 합하면 $1+${n}=${c.F}$ (개)예요.`,
          `모서리: 밑면의 모서리 $${n}$개와 꼭짓점에서 뻗은 옆의 모서리 $${n}$개를 합하면 $${n}\\times 2=${c.E}$ (개)예요.`,
          `꼭짓점: 밑면의 꼭짓점 $${n}$개와 꼭대기 꼭짓점 $1$개를 합하면 $${n}+1=${c.V}$ (개)예요.`
        ];
      },
      view: (M) => ({
        guide: `막대로 <b>n</b>을 바꾸고 <b>면 떼어 내기</b>로 밑면을 가로로 밀어내 보세요. ${span('sky', '파랑')}은 밑면, ${span('amber', '노랑')}은 옆면이에요. 옆면에는 번호가 붙어 있고, 뒤쪽 면은 점선으로 보여요.`,
        readouts: [rd(M.name, `n = ${M.n}`, AMB), rd('면의 개수 F', `${M.c.F}개`, AMB, isP ? `2 + ${M.n}` : `1 + ${M.n}`), rd('모서리의 개수 E', `${M.c.E}개`, SKY, isP ? `${M.n} × 3` : `${M.n} × 2`), rd('꼭짓점의 개수 V', `${M.c.V}개`, AMB, isP ? `${M.n} × 2` : `${M.n} + 1`)],
        formula: isP ? `<p>$F=n+2,\\quad E=3n,\\quad V=2n$</p><p>$n=${M.n}$ → $F=${M.c.F},\\ E=${M.c.E},\\ V=${M.c.V}$</p>` : `<p>$F=n+1,\\quad E=2n,\\quad V=n+1$</p><p>$n=${M.n}$ → $F=${M.c.F},\\ E=${M.c.E},\\ V=${M.c.V}$</p>`,
        rule: isP ? 'n각기둥: 면 n+2, 모서리 3n, 꼭짓점 2n' : 'n각뿔: 면 n+1, 모서리 2n, 꼭짓점 n+1',
        notes: isP ? notes('옆면은 모두 직사각형이에요. 밑면이 2개라서 꼭짓점도 $n$개씩 두 번 세어요.', '모서리는 밑면 둘에서 $n$개씩, 옆모서리 $n$개를 더해요.') : notes('각뿔의 옆면은 모두 삼각형이에요. 밑면은 1개뿐이에요.', '면의 개수와 꼭짓점의 개수는 항상 같아요. ($n+1$로 같아요)')
      }),
      prob: (M) => { const q = M.Q; return mkCountQ(kind, q.n, q.given, q.ask); }
    };
  }

  /* ------------------------------------------------------------------ p1-3 각뿔대 만들기 */
  const FR = {
    id: 'p1-3', title: '각뿔을 잘라 각뿔대 만들기', short: '각뿔대',
    question: '각뿔을 밑면과 평행하게 자르면 아래 부분은 어떤 입체가 될까? 윗부분을 가로로 밀어내 보자.',
    ctl: () => ['phN8', 'phCut', 'phSep'].concat(VIEW),
    init: (s) => { s.phN8 = 4; s.phCut = 0.5; s.phSep = 0.7; s.phQ = rollCount('fr'); },
    reroll: (s) => { s.phQ = rollCount('fr'); },
    model: (s) => {
      const n = clamp(Math.round(s.phN8), 3, 8), k = clamp(s.phCut, 0.2, 0.8), c = countsOf('fr', n);
      return { n, k, S: frustumS(n, k, 1.5, 2.4), T: topPyrS(n, k, 1.5, 2.4), c, name: nameOf('fr', n), Q: s.phQ };
    },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), { S, T, n, k, c } = M, st = stepOf(C);
      const sep = C.problem ? 0 : C.review ? (st === 1 ? 0.7 : st === 4 ? 0 : 0.7) : s.phSep;
      const W = 2 * k * 1.5 + 0.9, off = hxOf(s, W * sep);
      const topPts = S.V.concat(T.V.map((p) => add3(p, hxOf(s, W))));
      D.fitPts(C.problem ? S.V : topPts.concat(S.V.map((p) => add3(p, hxOf(s, -0.4)))), { t: C.problem ? 30 : 104, b: 40, l: 36, r: 36 });
      // 윗 각뿔(잘려 나간 부분)
      if (!C.problem && sep > 0.01 || (!C.problem && st !== 4 && st !== 0 && sep > 0.01)) {
        drawPoly(D, T, { off, face: (fi, vis) => (vis ? { c: VIO, a: 0.18 } : null), edge: () => ({ color: VIO, width: 2.6, alpha: 0.9 }) });
        if (C.txt) D.label(add3(add3(T.ctr, off), v3(0, 0, 1.7)), '잘라 낸 각뿔', { color: VIO, size: 14, at: [[0, 0]] });
      }
      const zTop = Math.max(...S.V.map((p) => p.z));
      const topF = S.F.findIndex((f) => f.n.z > 0.999), botF = S.F.findIndex((f) => f.n.z < -0.999);
      const sideCol = st === 2 ? { c: AMB, a: 0.34 } : { c: AMB, a: st === 4 ? 0.2 : 0.1 };
      drawPoly(D, S, {
        face: (fi, vis) => (fi === topF ? { c: SKY, a: st === 1 || st === 4 ? 0.34 : 0.12 } : fi === botF ? (st === 1 ? { c: SKY, a: 0.3, hidden: true } : null) : vis ? sideCol : null),
        edge: (ei) => { const e = S.E[ei], za = S.V[e.a].z, zb = S.V[e.b].z; const isBase = Math.abs(za - zb) < 1e-6; return st === 3 ? (isBase ? { color: SKY, width: 5 } : { color: AMB, width: 5 }) : { color: 'ink', width: 3 }; }
      });
      if (C.txt) {
        const tf = S.F[topF];
        D.label(faceMid(S.V, tf), '윗밑면', { color: SKY, size: 15, at: [[0, 0]] });
        if (st === 1 || st === 4) {
          const bf = S.F[botF], bc = faceMid(S.V, bf);
          D.label(add3(bc, v3(0, 0, 0)), '아랫밑면', { color: SKY, size: 15, at: [[0, 8]], alpha: 0.9 });
        }
        if (st === 2 || st === 4) {
          const vs = S.F.map((f, i) => i).filter((i) => i !== topF && i !== botF && D.facing(S.F[i].n));
          if (vs.length) { const best = vs.reduce((a, q) => (D.depth(faceMid(S.V, S.F[q])) < D.depth(faceMid(S.V, S.F[a])) ? q : a), vs[0]); D.label(faceMid(S.V, S.F[best]), '사다리꼴', { color: AMB, size: 15, at: [[0, 0]] }); }
        }
      }
      // 평행 표시: 윗밑면의 변과 아랫밑면의 대응하는 변
      if (st === 1 || st === 4) {
        const topV = S.F[topF].i, botV = S.F[botF].i, m = topV.length;
        for (let j = 0; j < m; j++) {
          const a = S.V[topV[j]], b2 = S.V[topV[(j + 1) % m]];
          const fi = S.F.findIndex((f, i) => i !== topF && i !== botF && f.i.includes(topV[j]) && f.i.includes(topV[(j + 1) % m]));
          if (fi >= 0 && D.facing(S.F[fi].n)) {
            // 이 옆면의 아랫변
            const bb = S.F[fi].i.filter((v) => S.V[v].z < 0);
            if (bb.length === 2) { D.par(a, b2, 1, SKY, 0.5); D.par(S.V[bb[0]], S.V[bb[1]], 1, SKY, 0.5); break; }
          }
        }
      }
      if (C.txt && !C.problem) {
        const L = [];
        if (st === 1 || st === 4) L.push({ t: '윗밑면 ∥ 아랫밑면 (서로 평행)', c: SKY, size: 15 });
        if (st === 2 || st === 4) L.push({ t: `옆면은 사다리꼴 ${n}개`, c: AMB, size: 15 });
        if (st === 3 || st === 4) L.push({ t: `면 ${n}+2=${c.F} · 모서리 ${n}×3=${c.E} · 꼭짓점 ${n}×2=${c.V}`, c: st === 3 ? AMB : 'ink', size: 14 });
        banner(b, L, C);
      }
      void k; void zTop;
      D.flush();
    },
    steps: (M) => [
      `각뿔을 밑면에 평행한 평면으로 자르면 아랫부분이 각뿔대예요. 각뿔대의 두 밑면은 서로 $\\text{평행}$해요.`,
      `각뿔대의 옆면은 모두 사다리꼴이에요. ${NK[M.n]}각뿔대의 옆면은 $${M.n}$개예요.`,
      `면: $${M.n}+2=${M.c.F}$ (개), 모서리: $${M.n}\\times 3=${M.c.E}$ (개), 꼭짓점: $${M.n}\\times 2=${M.c.V}$ (개)예요.`
    ],
    view: (M) => ({
      guide: `<b>자르는 위치</b>와 <b>윗 각뿔 떼어 내기</b> 막대로 각뿔을 잘라 보세요. 잘려 나간 ${span('violet', '보라색 각뿔')}이 가로로 밀려 나가요. 남은 ${span('sky', '파란 윗밑면')}과 아랫밑면은 평행해요.`,
      readouts: [rd(M.name, `n = ${M.n}`, AMB), rd('두 밑면', '서로 평행', SKY, '모양은 같고 크기가 달라요'), rd('옆면', `사다리꼴 ${M.n}개`, AMB), rd('면 · 모서리 · 꼭짓점', `${M.c.F} · ${M.c.E} · ${M.c.V}`, 'ink', `${M.n}+2, ${M.n}×3, ${M.n}×2`)],
      formula: `<p>$F=n+2=${M.c.F},\\quad E=3n=${M.c.E},\\quad V=2n=${M.c.V}$</p>`,
      rule: '각뿔대 = 각뿔을 밑면에 평행한 평면으로 자를 때 생기는 아랫부분. 두 밑면은 평행하고 옆면은 사다리꼴이다.',
      notes: notes('각뿔대의 두 밑면은 평행하지만 <b>합동은 아니에요</b>. 모양은 같고 크기가 달라요.', `n각뿔대의 면·모서리·꼭짓점의 수는 n각기둥과 같아요.`)
    }),
    prob: (M) => { const q = M.Q; return mkCountQ('fr', q.n, q.given, q.ask); }
  };

  /* ------------------------------------------------------------------ p1-4 옆면의 모양 */
  const SHAPE_NAME = { prism: '직사각형', pyr: '삼각형', fr: '사다리꼴' };
  function rollP4() {
    const target = ['prism', 'pyr', 'fr'][rint(0, 2)];
    const others = ['prism', 'pyr', 'fr'].filter((x) => x !== target);
    const items = [{ id: target, n: rint(3, 6) }];
    const seen = new Set([target + items[0].n]);
    while (items.length < 5) { const id = others[rint(0, 1)], n = rint(3, 6); if (!seen.has(id + n)) { seen.add(id + n); items.push({ id, n }); } }
    return { target, items: shuf(items) };
  }
  const P4 = {
    id: 'p1-4', title: '옆면의 모양', short: '옆면의 모양',
    question: '각기둥·각뿔·각뿔대의 옆면은 각각 어떤 모양일까? 옆면 하나를 꺼내서 살펴보자.',
    ctl: () => ['phN8', 'phFace', 'phOut'].concat(VIEW),
    presets: () => [{ group: '입체', label: '각기둥', apply: (st) => { st.phK4 = 'prism'; }, on: (st) => st.phK4 === 'prism' }, { label: '각뿔', apply: (st) => { st.phK4 = 'pyr'; }, on: (st) => st.phK4 === 'pyr' }, { label: '각뿔대', apply: (st) => { st.phK4 = 'fr'; }, on: (st) => st.phK4 === 'fr' }],
    init: (s) => { s.phK4 = 'prism'; s.phN8 = 5; s.phFace = 1; s.phOut = 1; s.phQ = rollP4(); },
    reroll: (s) => { s.phQ = rollP4(); },
    model: (s) => {
      const kind = s.phK4 || 'prism', n = clamp(Math.round(s.phN8), 3, 8), S = solidOfKind(kind, n, 0.5);
      const sides = S.F.map((f, i) => i).filter((i) => Math.abs(S.F[i].n.z) < 0.999 || (kind === 'pyr' && S.F[i].n.z > -0.999)).filter((i) => !(kind !== 'pyr' && Math.abs(S.F[i].n.z) > 0.999)).filter((i) => !(kind === 'pyr' && S.F[i].n.z < -0.999)).sort((a, c) => Math.atan2(S.F[a].n.y, S.F[a].n.x) - Math.atan2(S.F[c].n.y, S.F[c].n.x));
      const fi = sides[clamp(Math.round(s.phFace) - 1, 0, sides.length - 1)];
      return { kind, n, S, sides, fi, name: nameOf(kind, n), shape: SHAPE_NAME[kind], Q: s.phQ };
    },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C);
      if (C.problem) { drawRow(D, s, M.Q.items, C); return; }
      const { S, fi, kind } = M, out = C.review ? (st >= 1 ? 1 : 0) : s.phOut;
      const F = S.F[fi], pts3 = F.i.map((i) => S.V[i]), cc = faceMid(S.V, F);
      // 고른 옆면의 실제 모양(평면 도형): 위쪽이 입체의 위쪽이 되게 펴서 화면 가로로 꺼냅니다
      let wv = sub3(v3(0, 0, 1), mul3(F.n, F.n.z)); wv = unit3(wv);
      const uv = G.cross3(wv, F.n);
      const flat = pts3.map((p) => { const d = sub3(p, cc); return { x: dot3(d, uv), y: dot3(d, wv) }; });
      const fw = Math.max(...flat.map((q) => q.x)) - Math.min(...flat.map((q) => q.x));
      const proj = S.V.map((p) => D.P(p)), p0 = D.P(cc);
      const maxX = Math.max(...proj.map((q) => q.x)), tx = maxX + fw / 2 + 0.55;
      const cx = p0.x + (tx - p0.x) * out;
      const flatPts = flat.map((q) => ({ x: cx + q.x, y: p0.y - q.y }));
      const flatEnd = flat.map((q) => ({ x: tx + q.x, y: p0.y - q.y }));
      G.fit(b, bboxOf(proj.concat(flatEnd)), { t: 84, b: 40, l: 34, r: 34 });
      drawPoly(D, S, {
        face: (q, vis) => (q === fi ? { c: AMB, a: 0.34 } : vis ? { c: 'green', a: 0.1 } : null),
        edge: () => ({ color: 'ink', width: 3 })
      });
      if (out > 0.02) {
        b.path(flatPts, { close: true, fill: AMB, fillAlpha: 0.4, color: AMB, width: 3.6 });
        const mid = flatPts.reduce((a, q) => ({ x: a.x + q.x / flatPts.length, y: a.y + q.y / flatPts.length }), { x: 0, y: 0 });
        const mk = (m, u, n, k) => { const sz = 0.11; b.path([{ x: m.x - u.x * sz + n.x * sz, y: m.y - u.y * sz + n.y * sz }, m, { x: m.x - u.x * sz - n.x * sz, y: m.y - u.y * sz - n.y * sz }], { color: SKY, width: 3 }); void k; };
        const dirOf = (a, c) => { const l = Math.hypot(c.x - a.x, c.y - a.y) || 1; return { x: (c.x - a.x) / l, y: (c.y - a.y) / l }; };
        if (kind === 'prism' && flatPts.length === 4) {
          const q = flatPts, u1 = dirOf(q[0], q[1]), u2 = dirOf(q[0], q[3]), sz = 0.2;
          b.path([{ x: q[0].x + u1.x * sz, y: q[0].y + u1.y * sz }, { x: q[0].x + (u1.x + u2.x) * sz, y: q[0].y + (u1.y + u2.y) * sz }, { x: q[0].x + u2.x * sz, y: q[0].y + u2.y * sz }], { color: AMB, width: 3 });
        }
        if (kind === 'fr' && flatPts.length === 4) {
          for (let a2 = 0; a2 < 2; a2++) { const A2 = flatPts[a2], B2 = flatPts[a2 + 1], C2 = flatPts[(a2 + 2) % 4], D2 = flatPts[(a2 + 3) % 4]; const d1 = dirOf(A2, B2), d2 = dirOf(D2, C2); if (Math.abs(d1.x * d2.y - d1.y * d2.x) < 1e-6) { const nn = { x: -d1.y, y: d1.x }; mk({ x: (A2.x + B2.x) / 2, y: (A2.y + B2.y) / 2 }, d1, nn); mk({ x: (C2.x + D2.x) / 2, y: (C2.y + D2.y) / 2 }, d1, nn); break; } }
        }
        if (C.txt && out > 0.3) D.b.text({ x: mid.x, y: mid.y }, M.shape, { color: 'ink', size: 17, weight: 800, align: 'center', baseline: 'middle' });
      }
      if (C.txt) {
        const L = [{ t: `${M.name}의 옆면은 모두 ${M.shape}`, c: AMB, size: 17 }];
        if (st === 2) L.push({ t: kind === 'prism' ? '직사각형: 마주 보는 변이 평행하고 네 각이 직각' : kind === 'pyr' ? '삼각형: 꼭대기 한 점에서 모여요' : '사다리꼴: 평행한 변이 한 쌍', c: 'ink', size: 14 });
        banner(b, L, C);
      }
      D.flush();
    },
    steps: (M) => [
      `밑면을 제외한 면이 옆면이에요. ${M.name}의 옆면은 $${M.kind === 'pyr' ? M.n : M.n}$개예요.`,
      `옆면 하나를 꺼내 모양을 살펴요. ${M.name}의 옆면은 ${M.shape}이에요.`,
      `각기둥 → 직사각형, 각뿔 → 삼각형, 각뿔대 → 사다리꼴로 기억해요.`
    ],
    view: (M) => ({
      guide: `아래 버튼으로 <b>각기둥·각뿔·각뿔대</b>를 고르고, <b>옆면 꺼내기</b> 막대를 움직여 ${span('amber', '노란 옆면')} 하나를 가로로 꺼내 보세요. 옆면 번호도 바꿀 수 있어요.`,
      readouts: [rd('입체', M.name, AMB), rd('옆면의 모양', M.shape, AMB), rd('옆면의 개수', `${M.sides.length}개`, 'ink', '밑면은 빼요')],
      formula: '<p>각기둥 → 직사각형 · 각뿔 → 삼각형 · 각뿔대 → 사다리꼴</p>',
      rule: '옆면의 모양: 각기둥은 직사각형, 각뿔은 삼각형, 각뿔대는 사다리꼴',
      notes: notes('정각기둥의 옆면은 직사각형이에요. 밑면과 수직인 면이에요.', '각뿔대의 옆면은 모두 사다리꼴이고, 평행한 두 변은 윗밑면과 아랫밑면의 변이에요.')
    }),
    prob: (M) => {
      const q = M.Q, items = q.items, shape = SHAPE_NAME[q.target];
      return {
        tag: '옆면의 모양',
        key: items.map((it) => it.id + it.n).join(',') + q.target,
        stem: `다음 중 옆면의 모양이 ${shape}인 입체는? (그림의 (1)~(5)는 보기 ①~⑤의 입체예요)`,
        choices: mkText(items.map((it) => ({ h: nameOf(it.id, it.n), ok: it.id === q.target, hint: `${nameOf(it.id, it.n)}의 옆면은 ${SHAPE_NAME[it.id]}이에요.` })))
      };
    }
  };

  /* ------------------------------------------------------------------ p1-5 이름 맞히기 */
  function rollP5() { return { kind: ['prism', 'pyr', 'fr'][rint(0, 2)], F: rint(6, 11) }; }
  const P5 = {
    id: 'p1-5', title: '면의 개수로 입체 이름 맞히기', short: '이름 맞히기',
    question: '면의 개수가 같은 각기둥·각뿔·각뿔대가 있어요. 면이 F개이면 각각 몇 각형이 밑면일까?',
    ctl: () => ['phF'].concat(VIEW),
    init: (s) => { s.phF = 8; s.phQ = rollP5(); },
    reroll: (s) => { s.phQ = rollP5(); },
    model: (s) => {
      const F = clamp(Math.round(s.phF), 5, 10);
      const nn = { prism: F - 2, pyr: F - 1, fr: F - 2 };
      return { F, nn, Q: s.phQ };
    },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C);
      if (C.problem) {
        const q = M.Q, n = q.kind === 'pyr' ? q.F - 1 : q.F - 2;
        const S = solidOfKind(q.kind, n, 0.5);
        D.fitPts(S.V, { t: 30, b: 40, l: 40, r: 40 });
        drawPoly(D, S, { face: (fi, vis) => (vis ? { c: 'green', a: 0.16 } : null), edge: () => ({ color: 'ink', width: 3 }) });
        D.flush();
        return;
      }
      const kinds = ['prism', 'pyr', 'fr'], SP = 3.6, pts = [], ctr = kinds.map((k, i) => hxOf(s, (i - 1) * SP));
      kinds.forEach((k, i) => {
        const n = M.nn[k], R = 1.15, h = 1.7;
        const S = k === 'prism' ? prismS(n, R, h) : k === 'pyr' ? pyrS(n, R + 0.05, h) : frustumS(n, 0.55, R, h);
        const hl = (st === 1 && k === 'prism') || (st === 2 && k === 'pyr') || (st === 3 && k === 'fr');
        drawPoly(D, S, { off: ctr[i], face: (fi, vis) => (vis ? { c: hl ? AMB : 'green', a: hl ? 0.32 : 0.14 } : null), edge: () => ({ color: 'ink', width: 2.8 }) });
        S.V.forEach((p) => pts.push(add3(p, ctr[i])));
        if (C.txt) {
          const c = countsOf(k, n), base = add3(ctr[i], v3(0, 0, -h / 2 - 0.3));
          const dim = (st === 1 && k !== 'prism') || (st === 2 && k !== 'pyr') || (st === 3 && k !== 'fr');
          D.label(base, nameOf(k, n), { color: AMB, size: 16, at: [[0, 34]], alpha: dim ? 0.45 : 1 });
          D.label(base, `면 ${c.F}`, { color: 'ink', size: 14, at: [[0, 56]], alpha: dim ? 0.45 : 1 });
          D.label(base, `모서리 ${c.E}`, { color: 'ink', size: 14, at: [[0, 74]], alpha: dim ? 0.45 : 1 });
          D.label(base, `꼭짓점 ${c.V}`, { color: 'ink', size: 14, at: [[0, 92]], alpha: dim ? 0.45 : 1 });
        }
      });
      D.fitPts(pts, { t: 70, b: 124, l: 30, r: 30 });
      if (C.txt) {
        const L = [{ t: `면이 ${M.F}개인 입체`, c: 'ink', size: 17 }];
        if (st === 1) L.push({ t: `각기둥: 밑면 2 + 옆면 n = ${M.F} → n = ${M.nn.prism}`, c: AMB, size: 14 });
        if (st === 2) L.push({ t: `각뿔: 밑면 1 + 옆면 n = ${M.F} → n = ${M.nn.pyr}`, c: AMB, size: 14 });
        if (st === 3) L.push({ t: `각뿔대: 밑면 2 + 옆면 n = ${M.F} → n = ${M.nn.fr}`, c: AMB, size: 14 });
        banner(b, L, C);
      }
      D.flush();
    },
    steps: (M) => [
      `각기둥은 면이 $n+2$개예요. $n+2=${M.F}$에서 $n=${M.nn.prism}$이므로 ${nameOf('prism', M.nn.prism)}이에요.`,
      `각뿔은 면이 $n+1$개예요. $n+1=${M.F}$에서 $n=${M.nn.pyr}$이므로 ${nameOf('pyr', M.nn.pyr)}이에요.`,
      `각뿔대는 면이 $n+2$개예요. $n+2=${M.F}$에서 $n=${M.nn.fr}$이므로 ${nameOf('fr', M.nn.fr)}이에요.`
    ],
    view: (M) => ({
      guide: `막대로 <b>면의 개수 F</b>를 바꿔 보세요. 면이 같아도 각기둥·각뿔·각뿔대는 밑면의 변의 수가 달라요. 모서리와 꼭짓점의 수도 비교해 보세요.`,
      readouts: [rd('각기둥', nameOf('prism', M.nn.prism), AMB, `n = ${M.F} − 2`), rd('각뿔', nameOf('pyr', M.nn.pyr), AMB, `n = ${M.F} − 1`), rd('각뿔대', nameOf('fr', M.nn.fr), AMB, `n = ${M.F} − 2`)],
      formula: `<p>각기둥·각뿔대: $F=n+2$ → $n=F-2$</p><p>각뿔: $F=n+1$ → $n=F-1$</p>`,
      rule: '면의 개수가 F개이면 각기둥·각뿔대는 (F−2)각형, 각뿔은 (F−1)각형이 밑면이다',
      notes: notes('면의 개수가 같아도 모서리·꼭짓점의 개수는 입체마다 달라요.', '각기둥과 각뿔대는 면·모서리·꼭짓점의 개수가 같아요.')
    }),
    prob: (M) => {
      const q = M.Q, n = q.kind === 'pyr' ? q.F - 1 : q.F - 2, kn = KNAME[q.kind];
      const wr = [], seenN = new Set([n]);
      const mk = (nn, why) => { if (nn >= 3 && nn <= 12 && !seenN.has(nn)) { seenN.add(nn); wr.push({ h: nameOf(q.kind, nn), nn, ok: false, hint: why }); } };
      mk(q.kind === 'pyr' ? q.F - 2 : q.F - 1, q.kind === 'pyr' ? '각기둥의 식($n+2$)으로 계산했어요. 각뿔은 면이 $n+1$개예요.' : '각뿔의 식($n+1$)으로 계산했어요. 밑면이 2개인 입체는 면이 $n+2$개예요.');
      mk(q.F, '면의 개수 F를 그대로 n으로 썼어요.');
      mk(n + 1, '밑면의 개수를 잘못 빼서 한 개 많아요.'); mk(n - 1, '밑면의 개수를 잘못 빼서 한 개 적어요.'); mk(n + 2, '밑면 수를 거꾸로 더했어요.'); mk(n - 2, '밑면 수를 거꾸로 뺐어요.'); mk(n + 3, '밑면의 변의 수를 다시 계산해 보세요.');
      const items = [{ h: nameOf(q.kind, n), nn: n, ok: true, hint: '' }].concat(wr).slice(0, 5);
      const sorted = items.sort((a, c) => a.nn - c.nn);
      return { tag: '면의 개수로 입체 찾기', key: `${q.kind}|${q.F}`, stem: `면의 개수가 ${q.F}개인 ${kn}은 몇 ${kn}인가?`, choices: mkText(sorted) };
    }
  };

  /* ------------------------------------------------------------------ p1-6 [함정] 각뿔대 판별 */
  const STM = [
    { id: 1, t: () => '두 밑면은 서로 평행하다.', ok: true, why: '각뿔을 밑면에 평행하게 잘랐으니 두 밑면은 평행해요.' },
    { id: 2, t: () => '두 밑면은 서로 합동이다.', ok: false, why: '두 밑면은 모양은 같지만 크기가 달라서 합동이 아니에요.' },
    { id: 3, t: () => '옆면은 모두 사다리꼴이다.', ok: true, why: '평행한 두 변이 있는 사다리꼴이에요.' },
    { id: 4, t: () => '옆면은 모두 직사각형이다.', ok: false, why: '각기둥의 옆면이 직사각형이에요. 각뿔대의 옆면은 사다리꼴이에요.' },
    { id: 5, t: (n) => `옆면은 ${n}개이다.`, ok: true, why: '옆면의 개수는 밑면의 변의 수와 같아요.' }
  ];
  function rollP6(s) {
    const n = rint(4, 8), wrongPool = [(n) => `면은 ${n + 1}개이다.`, (n) => `꼭짓점은 ${n + 1}개이다.`, (n) => `모서리는 ${2 * n}개이다.`, () => '두 밑면은 서로 합동이다.', () => '옆면은 모두 삼각형이다.', () => '옆면은 모두 직사각형이다.'];
    const truePool = [() => '두 밑면은 서로 평행하다.', () => '옆면은 모두 사다리꼴이다.', (n) => `면은 ${n + 2}개이다.`, (n) => `모서리는 ${3 * n}개이다.`, (n) => `꼭짓점은 ${2 * n}개이다.`, (n) => `옆면은 ${n}개이다.`];
    const wrong = wrongPool[rint(0, wrongPool.length - 1)], tr = shuf(truePool).slice(0, 4);
    const items = shuf([{ t: wrong(n), ok: true }].concat(tr.map((f) => ({ t: f(n), ok: false }))));
    return { n, items };
  }
  const P6 = {
    id: 'p1-6', title: '[함정] 각뿔대에 대한 설명', short: '[함정] 각뿔대 판별',
    question: '각뿔대에 대한 설명 중 옳은 것과 옳지 않은 것을 가려내 보자. 설명을 하나씩 눌러 그림에서 확인해요.',
    ctl: () => ['phN8', 'phCut2'].concat(VIEW),
    presets: () => STM.map((q, i) => ({ group: i === 0 ? '설명 고르기' : '', label: `설명 ${q.id}`, apply: (st) => { st.phStm = q.id; }, on: (st) => st.phStm === q.id })),
    init: (s) => { s.phStm = 2; s.phN8 = 5; s.phCut2 = 0.5; s.phQ = rollP6(s); },
    reroll: (s) => { s.phQ = rollP6(s); },
    model: (s) => {
      const n = clamp(Math.round(s.phN8), 3, 8), k = s.phCut2, q = STM.find((x) => x.id === s.phStm) || STM[1];
      return { n, k, S: frustumS(n, k), stm: q, Q: s.phQ, qn: s.phQ.n };
    },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C);
      const n = C.problem ? M.qn : M.n, k = C.problem ? 0.55 : M.k, S = C.problem ? frustumS(M.qn, 0.55) : M.S;
      D.fitPts(S.V, { t: C.problem ? 40 : 96, b: 44, l: 40, r: 40 });
      const topF = S.F.findIndex((f) => f.n.z > 0.999), botF = S.F.findIndex((f) => f.n.z < -0.999);
      const id = C.problem ? 0 : C.review ? (st === 1 ? 1 : st === 2 ? 3 : 2) : M.stm.id;
      const baseHL = id === 1 || id === 2, sideHL = id === 3 || id === 4 || id === 5;
      drawPoly(D, S, {
        face: (fi, vis) => (fi === topF ? { c: SKY, a: baseHL ? 0.4 : 0.1 } : fi === botF ? (baseHL ? { c: SKY, a: 0.28, hidden: true } : null) : vis ? { c: AMB, a: sideHL ? 0.36 : 0.08 } : null),
        edge: () => ({ color: 'ink', width: 3 })
      });
      if (C.txt && !C.problem) {
        D.label(faceMid(S.V, S.F[topF]), '윗밑면', { color: SKY, size: 15, at: [[0, 0]] });
        if (baseHL) D.label(faceMid(S.V, S.F[botF]), '아랫밑면', { color: SKY, size: 15, at: [[0, 8]] });
        if (id === 3 || id === 4) {
          const vs = S.F.map((f, i) => i).filter((i) => i !== topF && i !== botF && D.facing(S.F[i].n));
          vs.slice(0, 2).forEach((q) => D.label(faceMid(S.V, S.F[q]), id === 3 ? '사다리꼴' : '직사각형?', { color: AMB, size: 14, at: [[0, 0]] }));
        }
        if (id === 5) { const vs = S.F.map((f, i) => i).filter((i) => i !== topF && i !== botF && D.facing(S.F[i].n)); vs.forEach((q, j) => D.label(faceMid(S.V, S.F[q]), String(j + 1), { color: AMB, size: 16, at: [[0, 0]] })); }
        if (id === 1) { /* 평행 표시 */
          const topV = S.F[topF].i;
          for (let j = 0; j < topV.length; j++) {
            const fi = S.F.findIndex((f, i) => i !== topF && i !== botF && f.i.includes(topV[j]) && f.i.includes(topV[(j + 1) % topV.length]));
            if (fi >= 0 && D.facing(S.F[fi].n)) { const bb = S.F[fi].i.filter((v) => S.V[v].z < 0); if (bb.length === 2) { D.par(S.V[topV[j]], S.V[topV[(j + 1) % topV.length]], 1, SKY, 0.5); D.par(S.V[bb[0]], S.V[bb[1]], 1, SKY, 0.5); break; } }
          }
        }
        const stm = M.stm;
        const txt = id === 5 ? `옆면은 ${n}개 → ${stm.ok ? '맞아요 ○' : '틀려요 ✕'}` : `${stm.t(n)}  ${stm.ok ? '○ 맞아요' : '✕ 틀려요'}`;
        banner(b, [{ t: txt, c: stm.ok ? GRN : RED, size: 16 }, { t: stm.why, c: 'ink', size: 13 }], C);
        void k;
      }
      D.flush();
    },
    steps: (M) => [
      `밑면을 살펴요. 두 밑면은 서로 $\\text{평행}$하지만 크기가 달라서 $\\text{합동은 아니에요}$.`,
      `옆면을 살펴요. 각뿔대의 옆면은 모두 사다리꼴이에요. (직사각형은 각기둥의 옆면)`,
      `옆면의 개수는 밑면의 변의 수 $${M.n}$과 같아요. 면 $${M.n}+2$, 모서리 $${M.n}\\times 3$, 꼭짓점 $${M.n}\\times 2$ (개)예요.`
    ],
    view: (M) => ({
      guide: `위의 <b>설명 1~5</b>를 눌러 그림에서 확인하세요. 막대로 n과 자르는 위치를 바꿔도 결과는 같아요. ${span('sky', '파랑')}은 밑면, ${span('amber', '노랑')}은 옆면이에요.`,
      readouts: [rd('고른 설명', `설명 ${M.stm.id}`, AMB), rd('판정', M.stm.ok ? '○ 옳아요' : '✕ 옳지 않아요', M.stm.ok ? GRN : RED), rd(nameOf('fr', M.n), `n = ${M.n}`, AMB)],
      formula: `<p>${M.stm.t(M.n)}</p><p>${M.stm.ok ? '맞는 설명이에요.' : '틀린 설명이에요.'} ${M.stm.why}</p>`,
      rule: '각뿔대: 두 밑면은 평행(합동 ✕), 옆면은 사다리꼴, 면 n+2 · 모서리 3n · 꼭짓점 2n',
      notes: notes('두 밑면이 <b>합동</b>이라고 말하는 것이 가장 흔한 함정이에요. 크기가 달라서 합동이 아니에요.', '옆면이 직사각형이라고 헷갈리지 않도록 각기둥과 비교해 보세요.')
    }),
    prob: (M) => {
      const q = M.Q, ans = q.items.findIndex((x) => x.ok);
      return {
        tag: '각뿔대 판별 (함정)',
        key: q.items.map((x) => x.t).join('|') + q.n,
        stem: `다음은 ${nameOf('fr', q.n)}에 대한 설명이다. 옳지 않은 것은?`,
        choices: mkText(q.items.map((x, i) => ({ h: x.t, ok: i === ans, hint: x.ok ? '' : '이 설명은 옳아요. 옳지 않은 설명을 찾아야 해요.' }))),
        wide: true
      };
    }
  };

  /* ------------------------------------------------------------------ p1-7 오일러의 공식 */
  const EUL = [{ id: 'prism', label: '각기둥' }, { id: 'pyr', label: '각뿔' }, { id: 'fr', label: '각뿔대' }].concat(PLAT_KEYS.map((k) => ({ id: k, label: PLAT[k].name })));
  const eulerOf = (id, n) => {
    if (PLAT[id]) { const p = PLAT[id]; return { V: p.V, E: p.E, F: p.F }; }
    const c = countsOf(id, n); return { V: c.V, E: c.E, F: c.F };
  };
  function rollP7() {
    const opts = [['prism', rint(3, 9)], ['pyr', rint(3, 9)], ['fr', rint(3, 9)], ['cube'], ['octa'], ['dodeca'], ['icosa'], ['tetra']];
    const o = opts[rint(0, opts.length - 1)], ask = ['V', 'E', 'F'][rint(0, 2)];
    return { id: o[0], n: o[1] || 0, ask };
  }
  const solidEuler = (id, n) => (PLAT[id] ? platS(id) : solidOfKind(id, n, 0.5));
  const P7 = {
    id: 'p1-7', title: '오일러의 공식', short: '오일러의 공식',
    question: '볼록한 다면체의 꼭짓점 V, 모서리 E, 면 F 사이에는 어떤 관계가 있을까? 입체를 바꿔 가며 확인하자.',
    ctl: () => ['phN8'].concat(VIEW),
    presets: () => EUL.map((e, i) => ({ group: i === 0 ? '입체 고르기' : '', label: e.label, apply: (st) => { st.phE = e.id; }, on: (st) => st.phE === e.id })),
    init: (s) => { s.phE = 'prism'; s.phN8 = 5; s.phQ = rollP7(); },
    reroll: (s) => { s.phQ = rollP7(); },
    model: (s) => {
      const id = s.phE || 'prism', n = clamp(Math.round(s.phN8), 3, 8), e = eulerOf(id, n);
      const nm = PLAT[id] ? PLAT[id].name : nameOf(id, n);
      const q = s.phQ, qe = eulerOf(q.id, q.n);
      return { id, n, ...e, name: nm, S: solidEuler(id, n), Q: q, qe, qname: PLAT[q.id] ? PLAT[q.id].name : nameOf(q.id, q.n), qS: solidEuler(q.id, q.n) };
    },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C);
      const S = C.problem ? M.qS : M.S, e = C.problem ? M.qe : M;
      const bottom = C.problem ? 36 : 150;
      D.fitPts(S.V, { t: C.problem ? 70 : 74, b: bottom, l: 40, r: 40 });
      drawPoly(D, S, { face: (fi, vis) => (vis ? { c: st === 1 ? AMB : 'green', a: st === 1 ? 0.26 : 0.12 } : null), edge: () => ({ color: st === 1 ? SKY : 'ink', width: st === 1 ? 3.6 : 3 }) });
      S.V.forEach((p) => D.dot(p, st === 1 ? RED : 'ink', st === 1 ? 5.5 : 3.5));
      if (C.txt) {
        if (C.problem) banner(b, [{ t: `${M.qname}`, c: 'ink', size: 16 }, { t: '꼭짓점 V − 모서리 E + 면 F = 2', c: AMB, size: 15 }], C);
        else banner(b, [{ t: M.name, c: 'ink', size: 17 }, { t: st === 1 ? `꼭짓점 ${e.V}개 · 모서리 ${e.E}개 · 면 ${e.F}개` : st === 3 ? `V − E + F = ${e.V} − ${e.E} + ${e.F} = ${e.V - e.E + e.F}` : `V − E + F = ${e.V - e.E + e.F}`, c: st === 3 ? GRN : 'ink', size: 16 }], C);
      }
      // 아래 막대: V + F 와 E + 2
      if (!C.problem && C.txt && st !== 1) {
        const x0 = b.insets.left + 18, x1 = b.W - b.insets.right - 64, wAll = x1 - x0, tot = Math.max(e.V + e.F, e.E + 2) || 1, uw = wAll / tot;
        const yb = b.H - b.insets.bottom - 40;
        const bar = (y, parts, label) => {
          let x = x0;
          parts.forEach((p) => {
            const w = p.v * uw;
            sRect(b, x, y - 16, x + w, y + 16, p.c, 0.42);
            if (w > 24) b.stext(x + w / 2, y, p.t, { color: 'ink', size: 14, weight: 800, align: 'center', baseline: 'middle' });
            x += w;
          });
          b.stext(x0, y - 30, label, { color: 'ink', size: 13, weight: 800, align: 'left', baseline: 'middle' });
        };
        bar(yb - 56, [{ v: e.V, c: SKY, t: `V ${e.V}` }, { v: e.F, c: AMB, t: `F ${e.F}` }], `V + F = ${e.V + e.F}`);
        bar(yb, [{ v: e.E, c: RED, t: `E ${e.E}` }, { v: 2, c: GRN, t: '2' }], `E + 2 = ${e.E + 2}`);
      }
      D.flush();
    },
    steps: (M) => [
      `${M.name}에서 꼭짓점, 모서리, 면의 개수를 세요. $V=${M.V},\\ E=${M.E},\\ F=${M.F}$.`,
      `$V+F=${M.V}+${M.F}=${M.V + M.F}$, $E+2=${M.E}+2=${M.E + 2}$로 두 값이 같아요.`,
      `$V-E+F=${M.V}-${M.E}+${M.F}=2$예요. 어떤 볼록한 다면체에서도 항상 $2$예요.`
    ],
    view: (M) => ({
      guide: `아래 버튼으로 입체를 고르고 막대로 n을 바꿔 보세요. 입체가 달라져도 <b>V − E + F</b>는 늘 같아요. 아래 두 막대의 길이도 같아요.`,
      readouts: [rd('꼭짓점 V', `${M.V}개`, SKY), rd('모서리 E', `${M.E}개`, RED), rd('면 F', `${M.F}개`, AMB), rd('V − E + F', `${M.V - M.E + M.F}`, GRN, `${M.V} − ${M.E} + ${M.F}`)],
      formula: `<p>$V-E+F=${M.V}-${M.E}+${M.F}=2$</p>`,
      rule: '오일러의 공식: 볼록한 다면체에서 (꼭짓점의 수) − (모서리의 수) + (면의 수) = 2',
      notes: notes('이 값 2는 구멍이 없는 볼록한 다면체에서 늘 같아요.', '모서리의 개수를 구할 때 $E=V+F-2$를 쓸 수 있어요.')
    }),
    prob: (M) => {
      const q = M.Q, e = M.qe, ask = q.ask, given = ['V', 'E', 'F'].filter((x) => x !== ask);
      const val = e[ask];
      const sign = { V: (g) => g.E - g.F + 2, E: (g) => g.V + g.F - 2, F: (g) => g.E - g.V + 2 };
      void sign;
      const wr = [
        [e[given[0]] + e[given[1]], '두 수를 그냥 더했어요. 오일러의 공식 $V-E+F=2$를 써야 해요.'],
        [Math.abs(e[given[0]] - e[given[1]]), '두 수의 차를 구했어요. 2를 더하거나 빼는 것을 잊지 않았나요?'],
        [val + 2, '2를 한 번 잘못 더했어요.'], [val - 2, '2를 한 번 잘못 뺐어요.'],
        [e.V + e.E + e.F - val, '세 값의 합에서 빼는 식이 아니에요.']
      ];
      const nm = { V: '꼭짓점', E: '모서리', F: '면' };
      return {
        tag: '오일러의 공식',
        key: `${q.id}|${q.n}|${ask}`,
        stem: `${nm[given[0]]}의 개수가 ${e[given[0]]}개, ${nm[given[1]]}의 개수가 ${e[given[1]]}개인 볼록한 다면체의 ${nm[ask]}의 개수는?`,
        choices: mkChoices(val, wr, { valid: (v) => Number.isInteger(v) && v > 0 })
      };
    }
  };

  G.register(10, 't1', '① 다면체와 각기둥·각뿔·각뿔대', '다면체', PARAMS, [P0, bpScene('prism'), bpScene('pyr'), FR, P4, P5, P6, P7]);
})();
