/* ==========================================================================
   중1 · 다면체와 정다면체 — 탭 ② 「정다면체」 (t2.js, order 20) — 장면 6개
   · p2-1 정다면체의 조건(한 꼭짓점에 모인 각의 합) · p2-2 정다면체 5가지 한눈에 · p2-3 [함정] 정다면체가 아닌 예
   · p2-4 구성 요소 세기(면·모서리·꼭짓점) · p2-5 면의 중심을 이으면(확장) · p2-6 5가지뿐인 까닭(표)
   정삼각형·정사각형·정오각형만 쓸 수 있고, 한 꼭짓점에 모인 각의 합이 360° 보다 작아야 입체가 됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PH;
  if (!G || !G.prismS) return;
  const { jo, clamp, pick, rint, shuf, PI, DEG, v3, add3, sub3, mul3, dot3, len3, unit3, lerp3, scene3, P, VIEW, mkChoices, mkText, rd, notes, camOf, fit,
    solidOf, platS, PLAT, PLAT_KEYS, drawPoly, faceMid, hxOf, banner, sRect, cen3 } = G;

  const PARAMS = {
    phPp: P('면의 모양(정p각형)의 p', 3, 6, 1, 3, { color: 'amber', hint: '정삼각형·정사각형·정오각형·정육각형', format: (v) => ({ 3: '정삼각형', 4: '정사각형', 5: '정오각형', 6: '정육각형' }[Math.round(v)]) }),
    phQq: P('한 꼭짓점에 모인 면의 수 q', 3, 6, 1, 3, { color: 'sky', hint: '면이 하나씩 늘면 각의 합이 늘어요', format: (v) => `${Math.round(v)}개` }),
    phJoin: P('붙이기', 0, 1, 0.01, 1, { color: 'sky', hint: '오른쪽 정사면체를 가로로 밀어 붙여요', format: (v) => (v > 0.995 ? '붙임' : v < 0.01 ? '떨어져 있음' : Math.round(v * 100) + '%') }),
    phDual: P('안쪽 입체 키우기', 0, 1, 0.01, 1, { color: 'amber', hint: '면의 중심을 이은 입체가 커져요', format: (v) => Math.round(v * 100) + '%' })
  };
  const AMB = 'amber', SKY = 'sky', GRN = 'green', RED = 'red', VIO = 'violet';
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;
  const stepOf = (C) => (C.problem ? 0 : C.review ? C.step : 4);
  const PNAME = { 3: '정삼각형', 4: '정사각형', 5: '정오각형', 6: '정육각형' };
  const PKEY = { '3-3': 'tetra', '4-3': 'cube', '3-4': 'octa', '5-3': 'dodeca', '3-5': 'icosa' };
  const interior = (p) => 180 - 360 / p;
  const verdict = (p, q) => { const sum = q * interior(p), k = PKEY[p + '-' + q]; return { sum, kind: sum < 360 - 1e-9 ? 'ok' : Math.abs(sum - 360) < 1e-9 ? 'flat' : 'over', key: k || null }; };
  const nameOfPlat = (k) => PLAT[k].name;
  const NAMES5 = PLAT_KEYS.map((k) => PLAT[k].name);

  /* ------------------------------------------------------------------ p2-1 정다면체의 조건 */
  // 점 O 둘레에 정p각형 q개를 붙인 모양(평면). 반환: 다각형 목록(그림 좌표)
  function fan(p, q) {
    const th = interior(p) * DEG, ext = (360 / p) * DEG, out = [];
    for (let i = 0; i < q; i++) {
      const a0 = -PI / 2 + i * th; // 위쪽에서 시작해 시계 방향으로 붙임
      let cur = { x: 0, y: 0 }, dir = a0;
      const pts = [{ x: 0, y: 0 }];
      for (let k = 0; k < p - 1; k++) { cur = { x: cur.x + Math.cos(dir), y: cur.y + Math.sin(dir) }; pts.push(cur); dir += ext; }
      out.push({ pts, mid: a0 + th / 2 });
    }
    return out;
  }
  function rollQ1() {
    const opts = [[3, 3], [3, 4], [3, 5], [4, 3], [5, 3], [3, 6], [4, 4], [5, 4], [6, 3], [4, 5], [3, 3], [4, 3], [5, 3]];
    const o = opts[rint(0, opts.length - 1)];
    return { p: o[0], q: o[1] };
  }
  const P1 = {
    id: 'p2-1', title: '정다면체가 되는 조건', short: '정다면체의 조건',
    question: '정다각형 면을 한 꼭짓점에 몇 개 모으면 입체가 될까? 각의 합이 360°에 가까워지면 틈이 어떻게 변하는지 보자.',
    ctl: () => ['phPp', 'phQq'],
    init: (s) => { s.phPp = 3; s.phQq = 3; s.phQ = rollQ1(); },
    reroll: (s) => { s.phQ = rollQ1(); },
    model: (s) => {
      const p = clamp(Math.round(s.phPp), 3, 6), q = clamp(Math.round(s.phQq), 3, 6), th = interior(p), v = verdict(p, q);
      return { p, q, th, ...v, Q: s.phQ, qv: verdict(s.phQ.p, s.phQ.q) };
    },
    draw(b, s, M, C) {
      const st = stepOf(C);
      const p = C.problem ? M.Q.p : M.p, q = C.problem ? M.Q.q : M.q, th = interior(p), sum = q * th;
      const polys = fan(p, q);
      // 화면 틀: 점 O 중심, 어느 p 에서도 같은 크기
      const R = p === 6 ? 2.05 : p === 5 ? 1.75 : p === 4 ? 1.45 : 1.05;
      const bottom = C.problem ? 40 : 122;
      fit(b, { x0: -R, x1: R, y0: -R - 0.1, y1: R + 0.1 }, { t: C.problem ? 36 : 76, b: bottom, l: 30, r: 40 });
      polys.forEach((pl, i) => {
        const over = sum > 360 + 1e-9 && i >= Math.floor(360 / th + 1e-9);
        b.path(pl.pts, { close: true, fill: over && !C.problem ? RED : SKY, fillAlpha: over && !C.problem ? 0.3 : 0.22, color: 'ink', width: 2.4 });
      });
      // 틈(남는 각)
      const gap = 360 - sum;
      if (gap > 0.01 && !C.problem) {
        const a0 = -PI / 2 + q * th * DEG, a1 = a0 + gap * DEG, rr = 0.9;
        const arc = [{ x: 0, y: 0 }]; for (let k = 0; k <= 24; k++) { const a = a0 + (a1 - a0) * (k / 24); arc.push({ x: rr * Math.cos(a), y: rr * Math.sin(a) }); }
        b.path(arc, { close: true, fill: RED, fillAlpha: 0.4, color: RED, width: 2.4 });
        if (C.txt) b.text({ x: 0.62 * Math.cos((a0 + a1) / 2) * 1.35, y: 0.62 * Math.sin((a0 + a1) / 2) * 1.35 }, `${Math.round(gap)}°`, { color: RED, size: 15, weight: 800, align: 'center', baseline: 'middle' });
      }
      // 각 표시(한 면의 꼭짓점에서의 각)
      polys.forEach((pl, i) => {
        if (C.txt && !C.problem) {
          const rr = 0.42 + (p === 3 ? 0.1 : 0.2);
          b.text({ x: rr * Math.cos(pl.mid), y: rr * Math.sin(pl.mid) }, `${Math.round(th)}°`, { color: 'ink', size: 14, weight: 800, align: 'center', baseline: 'middle' });
        }
      });
      b.point({ x: 0, y: 0 }, { color: AMB, r: 6 });
      // 아래 막대: 360° 칸에 q 개의 각을 이어 붙임
      if (C.txt && !C.problem) {
        const x0 = b.insets.left + 24, x1 = b.W - b.insets.right - 64, W = x1 - x0, k = W / Math.max(360, sum), y = b.H - b.insets.bottom - 62;
        let x = x0;
        for (let i = 0; i < q; i++) {
          const w = th * k, over = x - x0 + w > 360 * k + 1;
          sRect(b, x, y - 17, x + w, y + 17, over ? RED : SKY, 0.4);
          if (w > 22) b.stext(x + w / 2, y, `${Math.round(th)}°`, { color: 'ink', size: 14, weight: 800, align: 'center', baseline: 'middle' });
          x += w;
        }
        // 360° 기준선
        const xr = x0 + 360 * k;
        b.path([b.toW(xr, y - 26), b.toW(xr, y + 26)], { color: GRN, width: 3 });
        b.stext(xr, y - 38, '360°', { color: GRN, size: 14, weight: 800, align: 'center', baseline: 'middle' });
        b.stext(x0, y + 34, `${Math.round(th)}° × ${q} = ${Math.round(sum)}°`, { color: 'ink', size: 15, weight: 800, align: 'left', baseline: 'middle' });
      }
      if (C.txt && !C.problem) {
        const v = verdict(p, q);
        const t = v.kind === 'ok' ? `${Math.round(sum)}° < 360° → 입체가 돼요 (${nameOfPlat(v.key)})` : v.kind === 'flat' ? '합이 360° → 평평해서 입체가 안 돼요' : `합이 360°보다 커서 겹쳐요 → 입체가 안 돼요`;
        banner(b, [{ t: `${PNAME[p]} ${q}개`, c: 'ink', size: 17 }, st >= 3 || st === 4 ? { t, c: v.kind === 'ok' ? GRN : RED, size: 15 } : null], C);
      }
    },
    steps: (M) => [
      `정${M.p}각형의 한 내각의 크기는 $180^\\circ-\\dfrac{360^\\circ}{${M.p}}=${Math.round(M.th)}^\\circ$예요.`,
      `한 꼭짓점에 면이 $${M.q}$개 모이면 각의 합은 $${Math.round(M.th)}^\\circ\\times ${M.q}=${Math.round(M.sum)}^\\circ$예요.`,
      M.kind === 'ok' ? `각의 합이 $360^\\circ$보다 작으므로 입체가 만들어져요. → ${nameOfPlat(M.key)}` : M.kind === 'flat' ? `각의 합이 $360^\\circ$이면 평평해져서 입체가 되지 않아요.` : `각의 합이 $360^\\circ$보다 크면 면이 겹쳐서 입체가 되지 않아요.`
    ],
    view: (M) => ({
      guide: `막대로 <b>면의 모양 p</b>와 <b>한 꼭짓점에 모인 면의 수 q</b>를 바꿔 보세요. 면을 붙일수록 ${span('red', '붉은 틈')}이 줄어들고, 각의 합이 ${span('green', '360°')}에 가까워져요.`,
      readouts: [rd('한 면의 한 각', `${Math.round(M.th)}°`, SKY, `180° − 360°÷${M.p}`), rd('모인 면의 수 q', `${M.q}개`, SKY), rd('각의 합', `${Math.round(M.sum)}°`, M.kind === 'ok' ? GRN : RED, `${Math.round(M.th)}° × ${M.q}`), rd('판정', M.kind === 'ok' ? `입체 ○ ${nameOfPlat(M.key)}` : '입체 ✕', M.kind === 'ok' ? GRN : RED, M.kind === 'flat' ? '합이 360°' : M.kind === 'over' ? '합이 360° 초과' : '', null, true)],
      formula: `<p>(한 꼭짓점에 모인 각의 합) $=${Math.round(M.th)}^\\circ\\times ${M.q}=${Math.round(M.sum)}^\\circ$ ${M.kind === 'ok' ? '$\\lt 360^\\circ$' : M.kind === 'flat' ? '$=360^\\circ$' : '$\\gt 360^\\circ$'}</p>`,
      rule: '입체가 되려면 한 꼭짓점에 모인 각의 합이 360°보다 작아야 한다',
      notes: notes('정삼각형은 3개·4개·5개, 정사각형과 정오각형은 3개일 때만 입체가 돼요.', '정육각형은 3개만 모여도 합이 $360^\\circ$라서 입체가 안 돼요.')
    }),
    prob: (M) => {
      const q = M.Q, v = M.qv, correctName = v.kind === 'ok' ? nameOfPlat(v.key) : '만들 수 없다';
      const others = NAMES5.filter((n) => n !== correctName);
      let list = [correctName].concat(shuf(others).slice(0, 4));
      if (v.kind !== 'ok') list = ['만들 수 없다'].concat(shuf(NAMES5).slice(0, 4));
      const order = shuf(NAMES5.concat(['만들 수 없다']).filter((n) => list.includes(n)));
      const hint = (n) => (n === '만들 수 없다' ? '각의 합을 계산해 보세요. 360°보다 작은데도 만들 수 없다고 했어요.' : '한 꼭짓점에 모인 면의 모양과 개수를 다시 확인해 보세요.');
      return {
        tag: '정다면체의 조건',
        key: `${q.p}-${q.q}`,
        stem: `한 꼭짓점에 ${PNAME[q.p]}${jo(PNAME[q.p], 'i')} ${q.q}개씩 모여 있다. 이 면으로 만들 수 있는 정다면체는?`,
        choices: mkText(order.map((n) => ({ h: n, ok: n === correctName, hint: hint(n) })))
      };
    }
  };

  /* ------------------------------------------------------------------ p2-2 정다면체 5가지 한눈에 */
  const SLOT = [[-1, 0], [0, 0], [1, 0], [-0.5, 1], [0.5, 1]];
  function layout5(s, SP, RZ) { return PLAT_KEYS.map((k, i) => add3(hxOf(s, SLOT[i][0] * SP), v3(0, 0, -SLOT[i][1] * RZ))); }
  function rollP22() {
    const key = PLAT_KEYS[rint(0, 4)], shapes = ['정삼각형', '정사각형', '정오각형', '정육각형'];
    const wrong = shuf(PLAT_KEYS.filter((k) => k !== key)).slice(0, 4).map((k) => ({ k, shape: shuf(shapes.filter((x) => x !== PLAT[k].face))[0] }));
    return { key, shape: PLAT[key].face, items: shuf([{ k: key, shape: PLAT[key].face, ok: true }].concat(wrong.map((w) => ({ k: w.k, shape: w.shape, ok: false })))) };
  }
  const P2 = {
    id: 'p2-2', title: '정다면체 5가지 한눈에', short: '5가지 한눈에',
    question: '정다면체는 5가지뿐이에요. 각각 면의 모양과 한 꼭짓점에 모인 면의 수가 어떻게 다를까?',
    ctl: () => VIEW,
    presets: () => PLAT_KEYS.map((k, i) => ({ group: i === 0 ? '입체 고르기' : '', label: PLAT[k].name, apply: (st) => { st.phSel = k; }, on: (st) => st.phSel === k })),
    init: (s) => { s.phSel = 'octa'; s.phQ = rollP22(); },
    reroll: (s) => { s.phQ = rollP22(); },
    model: (s) => { const k = s.phSel || 'octa', I = PLAT[k]; return { k, I, Q: s.phQ }; },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C);
      const scl = (S, f) => Object.assign({}, S, { V: S.V.map((p) => mul3(p, f)), F: S.F.map((x) => Object.assign({}, x, { c: mul3(x.c, f) })), ctr: mul3(S.ctr, f) });
      if (C.problem) {
        const SP = 3.7, RZ = 4.6, ctr = layout5(s, SP, RZ), pts = [];
        ctr.forEach((c) => pts.push(add3(c, v3(-1.9, 0, -1.9)), add3(c, v3(1.9, 0, 1.9))));
        D.fitPts(pts, { t: 26, b: 60, l: 26, r: 26 });
        PLAT_KEYS.forEach((k, i) => {
          drawPoly(D, platS(k), { off: ctr[i], face: (fi, vis) => (vis ? { c: 'green', a: 0.16 } : null), edge: () => ({ color: 'ink', width: 2.6 }) });
          D.label(add3(ctr[i], v3(0, 0, -2.1)), PLAT[k].name, { color: 'ink', size: 15, at: [[0, 22]] });
        });
        D.flush();
        return;
      }
      // 큰 입체 하나(고른 것) + 아래 작은 입체 5개(고르는 줄). 작은 줄은 화면 아래쪽에 화면 픽셀 기준으로 놓아 큰 입체를 최대한 키웁니다.
      const S = platS(M.k), I = M.I, narrow = b.W < 560, rowPx = narrow ? 56 : 70;
      D.fitPts(S.V, { t: 66, b: rowPx + 26, l: 10, r: 10 });
      const kpx = b.k, cp = camOf(s).cp;
      const spPx = Math.min(rowPx + 14, (b.W - 24) / 5.2), ctrS = b.toS(D.P(S.ctr));
      const dyFig = (b.H - b.insets.bottom - rowPx / 2 - 14 - ctrS.y) / kpx;
      const MS = (spPx * 0.42) / (1.75 * kpx);
      const mini = PLAT_KEYS.map((k, i) => add3(add3(S.ctr, hxOf(s, ((i - 2) * spPx) / kpx)), v3(0, 0, -dyFig / cp)));
      const hlFace = st !== 0 ? S.F.map((f, fi) => fi).filter((fi) => D.facing(S.F[fi].n)).sort((a, c) => D.depth(faceMid(S.V, S.F[a])) - D.depth(faceMid(S.V, S.F[c])))[0] : -1;
      let hv = -1;
      if (st === 2 || st === 4) { let bd = 1e9; S.V.forEach((p, vi) => { const d = D.depth(p); if (d < bd) { bd = d; hv = vi; } }); }
      drawPoly(D, S, {
        face: (fi, vis) => (!vis ? null : fi === hlFace && (st === 1 || st === 4) ? { c: SKY, a: 0.4 } : hv >= 0 && S.vf[hv].includes(fi) ? { c: AMB, a: 0.36 } : { c: 'green', a: 0.14 }),
        edge: () => ({ color: 'ink', width: 3.2 })
      });
      if (C.txt && hlFace >= 0 && (st === 1 || st === 4)) D.label(faceMid(S.V, S.F[hlFace]), I.face, { color: SKY, size: 14, at: [[0, 0]] });
      if (hv >= 0) {
        D.dot(S.V[hv], AMB, 8);
        if (C.txt) D.label(S.V[hv], `한 꼭짓점에 모인 면 ${I.q}개`, { color: AMB, size: 14, dir: D.out(S.V[hv], S.ctr), gap: 16 });
      }
      PLAT_KEYS.forEach((k, i) => {
        const sel = k === M.k;
        drawPoly(D, scl(platS(k), MS), { off: mini[i], face: (fi, vis) => (vis ? { c: sel ? AMB : 'green', a: sel ? 0.3 : 0.12 } : null), edge: () => ({ color: sel ? AMB : 'ink', width: sel ? 2.8 : 2, alpha: sel ? 1 : 0.7 }) });
      });
      if (C.txt) {
        const L = [{ t: `${I.name}: ${I.face} ${I.F}개, 한 꼭짓점에 ${I.q}개씩`, c: 'ink', size: 16 }];
        if (st === 2) L.push({ t: `모서리 = ${I.p}×${I.F}÷2 = ${I.E}개`, c: SKY, size: 15 });
        if (st === 3) L.push({ t: `꼭짓점 = ${I.p}×${I.F}÷${I.q} = ${I.V}개`, c: AMB, size: 15 });
        banner(b, L, C);
        if (C.tab === 'explore' && !C.thumb) {
          const i = PLAT_KEYS.indexOf(M.k), hp = D.P(add3(mini[i], v3(0, 0, -(spPx * 0.5) / kpx / cp)));
          b.handle('sel', hp, { color: 'amber', r: 8.5, ariaLabel: '정다면체 고르기', drag: (w) => { let best = 0, bd = 1e18; mini.forEach((c, j) => { const q = D.P(c), d = (q.x - w.x) ** 2; if (d < bd) { bd = d; best = j; } }); s.phSel = PLAT_KEYS[best]; } });
        }
      }
      D.flush();
    },
    steps: (M) => {
      const I = M.I;
      return [
        `${I.name}의 면은 ${I.face}이고, 면의 개수는 $${I.F}$개예요. 한 꼭짓점에는 면이 $${I.q}$개씩 모여요.`,
        `모서리: 면 하나에 변이 $${I.p}$개이고, 모서리는 두 면이 함께 가지므로 $${I.p}\\times ${I.F}\\div 2=${I.E}$ (개)예요.`,
        `꼭짓점: 면의 꼭짓점 수 $${I.p}\\times ${I.F}$를 한 꼭짓점에 모인 면의 수 $${I.q}$로 나눠요. $${I.p}\\times ${I.F}\\div ${I.q}=${I.V}$ (개)예요.`
      ];
    },
    view: (M) => {
      const I = M.I;
      return {
        guide: `아래 버튼이나 <b>노란 손잡이</b>로 정다면체를 골라 보세요. ${span('sky', '파란 면')}은 면의 모양, ${span('amber', '노란 면들')}은 한 꼭짓점에 모인 면이에요. 정다면체는 5가지뿐이에요.`,
        readouts: [rd('입체', I.name, AMB), rd('면의 모양', `${I.face} ${I.F}개`, SKY), rd('한 꼭짓점에 모인 면', `${I.q}개`, AMB), rd('모서리 · 꼭짓점', `${I.E}개 · ${I.V}개`, 'ink', `${I.p}×${I.F}÷2 · ${I.p}×${I.F}÷${I.q}`)],
        formula: `<p>$E=\\dfrac{p\\times F}{2}=${I.E},\\quad V=\\dfrac{p\\times F}{q}=${I.V}$</p>`,
        rule: '정다면체: 모든 면이 합동인 정다각형이고, 각 꼭짓점에 모인 면의 수가 같은 다면체 (5가지뿐)',
        notes: notes('정사면체·정팔면체·정이십면체의 면은 정삼각형, 정육면체는 정사각형, 정십이면체는 정오각형이에요.', '정팔면체는 꼭짓점이 6개, 정십이면체는 꼭짓점이 20개예요.')
      };
    },
    prob: (M) => {
      const q = M.Q, ans = q.items.findIndex((x) => x.ok);
      return {
        tag: '정다면체의 면의 모양',
        key: q.items.map((x) => x.k + x.shape).join(','),
        stem: `다음 중 정다면체와 그 면의 모양이 옳게 짝지어진 것은?`,
        choices: mkText(q.items.map((x, i) => ({ h: `${PLAT[x.k].name} — ${x.shape}`, ok: i === ans, hint: `${PLAT[x.k].name}의 면은 ${PLAT[x.k].face}이에요.` }))),
        wide: true
      };
    }
  };

  /* ------------------------------------------------------------------ p2-3 정다면체가 아닌 예 */
  // 화면 가로를 e1, 안쪽을 e2, 위를 e3 로 하는 틀(시점이 돌아도 같은 모양으로 보이게)
  const frameOf = (s) => { const c = camOf(s); return { e1: v3(c.cy, -c.sy, 0), e2: v3(c.sy, c.cy, 0), e3: v3(0, 0, 1) }; };
  const loc = (F, x, y, z) => add3(add3(mul3(F.e1, x), mul3(F.e2, y)), mul3(F.e3, z));
  function tetraLocal(F, x0, dir, a) { // x0 에 놓인 정삼각형 면(법선 = 가로 방향), 꼭짓점은 dir 쪽
    const r = a / Math.sqrt(3), h = a * Math.sqrt(2 / 3);
    const tri = [0, 1, 2].map((k) => { const t = PI / 2 + (2 * PI * k) / 3; return [r * Math.cos(t), r * Math.sin(t)]; });
    return { tri: tri.map((q) => loc(F, x0, q[0], q[1] - r / 2)), apex: loc(F, x0 + dir * h, 0, -r / 2), h, r };
  }
  const P3EX = [{ id: 'bi', label: '정사면체 2개를 붙인 것' }, { id: 'sq', label: '정사각뿔' }];
  function rollP23() { return { t: ['why', 'count', 'four'][rint(0, 2)], seed: Math.random() }; }
  const P3 = {
    id: 'p2-3', title: '[함정] 정다면체가 아닌 예', short: '[함정] 정다면체가 아닌 예',
    question: '면이 모두 정삼각형인데도 정다면체가 아닌 입체가 있어요. 정사면체 2개를 붙여 보면 무엇이 달라질까?',
    ctl: (s) => (s.phEx === 'sq' ? ['phPitch'] : ['phJoin', 'phPitch']),
    presets: () => P3EX.map((e, i) => ({ group: i === 0 ? '예 고르기' : '', label: e.label, apply: (st) => { st.phEx = e.id; }, on: (st) => st.phEx === e.id })),
    init: (s) => { s.phEx = 'bi'; s.phJoin = 1; s.phQ = rollP23(); },
    reroll: (s) => { s.phQ = rollP23(); },
    cam0: { yaw: -30, pitch: 22 },
    model: (s) => ({ ex: s.phEx || 'bi', join: clamp(s.phJoin, 0, 1), Q: s.phQ }),
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C), F = frameOf(s), a = 2.4;
      const ex = C.problem ? 'bi' : M.ex, join = C.problem ? 1 : C.review ? (st === 1 ? 0 : 1) : M.join;
      const tt = tetraLocal(F, 0, 1, a);
      const vcount = [];
      if (ex === 'bi') {
        const gap = (1 - join) * 2.8;
        const A = tetraLocal(F, 0, -1, a), B = tetraLocal(F, gap, 1, a);
        const ptsAll = A.tri.concat([A.apex, loc(F, tt.h + 2.8, 0, -tt.r / 2)]);
        D.fitPts(ptsAll.concat(B.tri), { t: C.problem ? 30 : 90, b: 60, l: 40, r: 40 });
        if (join > 0.995) {
          const S = solidOf(A.tri.concat([A.apex, B.apex]));
          const info = drawPoly(D, S, { face: (fi, vis) => (vis ? { c: 'green', a: 0.18 } : null), edge: () => ({ color: 'ink', width: 3.2 }) });
          // 꼭짓점마다 모인 면의 수
          if (!C.problem) S.V.forEach((p, vi) => { const q = S.vf[vi].length; D.dot(p, q === 4 ? RED : SKY, 6.5); D.label(p, String(q), { color: q === 4 ? RED : SKY, size: 17, dir: D.out(p, S.ctr), gap: 11 }); });
          if (C.txt && !C.problem) banner(b, [{ t: '면 6개 모두 합동인 정삼각형', c: 'ink', size: 15 }, { t: `꼭짓점: 3개씩 모임(파랑) 2곳 · 4개씩 모임(빨강) 3곳`, c: RED, size: 15 }, st >= 2 || st === 4 ? { t: '모인 면의 수가 다르다 → 정다면체가 아니에요', c: RED, size: 15 } : null], C);
          void info;
        } else {
          const SA = solidOf(A.tri.concat([A.apex])), SB = solidOf(B.tri.map((p) => add3(p, v3(0, 0, 0))).concat([B.apex]));
          drawPoly(D, SA, { face: (fi, vis) => (vis ? { c: 'green', a: 0.18 } : null), edge: () => ({ color: 'ink', width: 3.2 }) });
          drawPoly(D, SB, { face: (fi, vis) => (vis ? { c: AMB, a: 0.18 } : null), edge: () => ({ color: AMB, width: 3.2 }) });
          if (!C.problem) { SA.V.forEach((p) => { D.dot(p, SKY, 5.5); D.label(p, '3', { color: SKY, size: 16, dir: D.out(p, SA.ctr), gap: 10 }); }); SB.V.forEach((p, i) => { if (i < 3 || true) { D.dot(p, SKY, 5.5); D.label(p, '3', { color: SKY, size: 16, dir: D.out(p, SB.ctr), gap: 10 }); } }); }
          if (C.txt) banner(b, [{ t: '정사면체 2개: 모든 꼭짓점에 면이 3개씩 모여요', c: 'ink', size: 15 }, { t: '막대로 오른쪽 정사면체를 붙여 보세요', c: AMB, size: 14 }], C);
        }
      } else {
        // 정사각뿔: 밑면 정사각형 + 정삼각형 4개 (옆모서리 = 밑변)
        const h = a / Math.SQRT2, V = [loc(F, -a / 2, -a / 2, -h / 2), loc(F, a / 2, -a / 2, -h / 2), loc(F, a / 2, a / 2, -h / 2), loc(F, -a / 2, a / 2, -h / 2), loc(F, 0, 0, h / 2)];
        const S = solidOf(V);
        D.fitPts(V, { t: 100, b: 60, l: 50, r: 50 });
        const bot = S.F.findIndex((f) => f.n.z < -0.999);
        drawPoly(D, S, { face: (fi, vis) => (vis ? (fi === bot ? { c: SKY, a: 0.3 } : { c: 'green', a: 0.2 }) : null), edge: () => ({ color: 'ink', width: 3.2 }) });
        S.V.forEach((p, vi) => { const q = S.vf[vi].length; D.dot(p, q === 4 ? RED : SKY, 6); D.label(p, String(q), { color: q === 4 ? RED : SKY, size: 17, dir: D.out(p, S.ctr), gap: 11 }); });
        D.label(S.F[bot].c, '정사각형', { color: SKY, size: 14, at: [[0, 8]], alpha: 0.9 });
        if (C.txt) banner(b, [{ t: '밑면은 정사각형, 옆면은 정삼각형 4개', c: 'ink', size: 15 }, { t: '면이 모두 합동은 아니에요 · 모인 면의 수도 달라요', c: RED, size: 15 }], C);
      }
      D.flush();
    },
    steps: (M) => [
      `정사면체 2개를 붙이기 전에는 모든 꼭짓점에 면이 $3$개씩 모여요.`,
      `붙이면 면이 모두 합동인 정삼각형 $6$개예요. 그런데 붙인 면의 꼭짓점 $3$개에는 면이 $4$개씩, 나머지 $2$개에는 $3$개씩 모여요.`,
      `각 꼭짓점에 모인 면의 수가 같지 않으므로 $\\text{정다면체가 아니에요}$.`
    ],
    view: (M) => ({
      guide: M.ex === 'bi' ? `막대로 오른쪽 정사면체를 <b>가로로 밀어 붙여</b> 보세요. 꼭짓점의 ${span('sky', '파란 3')}과 ${span('red', '빨간 4')}는 그 꼭짓점에 모인 면의 수예요.` : `${span('sky', '파란 3')}과 ${span('red', '빨간 4')}는 꼭짓점에 모인 면의 수예요. 정사각뿔의 면은 정사각형 1개와 정삼각형 4개예요.`,
      readouts: M.ex === 'bi' ? [rd('면', '정삼각형 6개', GRN, '모두 합동'), rd('3개 모인 꼭짓점', M.join > 0.995 ? '2개' : '모두', SKY), rd('4개 모인 꼭짓점', M.join > 0.995 ? '3개' : '없음', RED), rd('정다면체?', M.join > 0.995 ? '✕ 아님' : '—', RED)] : [rd('면', '정사각형 1 + 정삼각형 4', AMB, '합동이 아니에요'), rd('3개 모인 꼭짓점', '4개', SKY), rd('4개 모인 꼭짓점', '1개', RED), rd('정다면체?', '✕ 아님', RED)],
      formula: M.ex === 'bi' ? '<p>모든 면이 합동인 정삼각형이어도, 모인 면의 수가 다르면 정다면체가 아니에요.</p>' : '<p>면이 합동이 아니므로 정다면체가 아니에요.</p>',
      rule: '정다면체의 조건: ① 모든 면이 합동인 정다각형 ② 각 꼭짓점에 모인 면의 수가 같다',
      notes: notes('면이 모두 합동인 정삼각형이라는 조건만으로는 정다면체가 아니에요. <b>두 조건을 모두</b> 확인해야 해요.', '정사각뿔은 면의 모양이 서로 달라서 정다면체가 아니에요.')
    }),
    prob: (M) => {
      const t = M.Q.t;
      if (t === 'why') {
        const items = shuf([
          { h: '각 꼭짓점에 모인 면의 수가 같지 않다.', ok: true }, { h: '면의 모양이 정다각형이 아니다.', ok: false, hint: '모든 면은 정삼각형이에요.' },
          { h: '면이 모두 합동이 아니다.', ok: false, hint: '정삼각형 6개는 모두 합동이에요.' }, { h: '면의 개수가 너무 많다.', ok: false, hint: '면의 개수는 조건이 아니에요.' }, { h: '모서리의 길이가 서로 다르다.', ok: false, hint: '모든 모서리의 길이는 같아요.' }
        ]);
        return { tag: '정다면체가 아닌 까닭 (함정)', key: 'why' + items.map((x) => x.h).join(''), stem: '그림은 정사면체 2개를 붙인 입체이다. 면이 모두 합동인 정삼각형인데 정다면체가 아닌 까닭은?', choices: mkText(items), wide: true };
      }
      if (t === 'count') return { tag: '정다면체가 아닌 예', key: 'count', stem: '그림과 같이 정사면체 2개를 붙인 입체의 면의 개수는?', choices: mkChoices(6, [[8, '정사면체 2개의 면 $4+4$를 더했어요. 붙인 면 2개는 안쪽에 들어가요.'], [7, '붙인 면을 한 개만 뺐어요.'], [4, '정사면체 하나의 면의 개수예요.'], [5, '꼭짓점의 개수예요.'], [10, '모서리의 개수예요.']]) };
      return { tag: '정다면체가 아닌 예', key: 'four', stem: '그림과 같이 정사면체 2개를 붙인 입체에서, 면이 4개씩 모이는 꼭짓점의 개수는?', choices: mkChoices(3, [[2, '면이 3개씩 모이는 꼭짓점의 개수예요.'], [4, '꼭짓점의 개수예요.'], [5, '전체 꼭짓점의 개수예요.'], [6, '면의 개수예요.']]) };
    }
  };

  /* ------------------------------------------------------------------ p2-4 구성 요소 세기 */
  function rollP24() { return { k: PLAT_KEYS[rint(0, 4)], ask: ['V', 'E'][rint(0, 1)] }; }
  const P4 = {
    id: 'p2-4', title: '정다면체의 구성 요소 세기', short: '구성 요소 세기',
    question: '정다면체의 면의 모양과 개수를 알면 모서리와 꼭짓점의 개수를 계산할 수 있을까?',
    ctl: () => VIEW,
    presets: () => PLAT_KEYS.map((k, i) => ({ group: i === 0 ? '입체 고르기' : '', label: PLAT[k].name, apply: (st) => { st.phSel4 = k; st.phHv = 0; st.phHf = 0; }, on: (st) => st.phSel4 === k })),
    init: (s) => { s.phSel4 = 'dodeca'; s.phHv = 0; s.phHf = 0; s.phQ = rollP24(); },
    reroll: (s) => { s.phQ = rollP24(); },
    model: (s) => { const k = s.phSel4 || 'dodeca', S = platS(k); return { k, I: PLAT[k], S, hv: clamp(s.phHv | 0, 0, S.V.length - 1), hf: clamp(s.phHf | 0, 0, S.F.length - 1), Q: s.phQ }; },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C), S = C.problem ? platS(M.Q.k) : M.S, I = C.problem ? PLAT[M.Q.k] : M.I;
      D.fitPts(S.V, { t: C.problem ? 40 : 92, b: 50, l: 50, r: 50 });
      const hv = C.problem ? -1 : M.hv, hf = C.problem ? -1 : M.hf;
      drawPoly(D, S, {
        face: (fi, vis) => { if (!vis && !(hf === fi)) return null; if (fi === hf && (st === 1 || st === 4)) return { c: SKY, a: 0.42, hidden: true }; if (hv >= 0 && S.vf[hv].includes(fi) && (st === 2 || st === 4)) return { c: AMB, a: 0.36, hidden: true }; return vis ? { c: 'green', a: 0.1 } : null; },
        edge: () => ({ color: 'ink', width: 3 })
      });
      if (!C.problem) {
        S.V.forEach((p, vi) => { if (vi !== hv) D.dot(p, 'ink', 3.2); });
        D.dot(S.V[hv], AMB, 7);
        if (C.txt) {
          if (st === 2 || st === 4) D.label(S.V[hv], `면 ${I.q}개`, { color: AMB, size: 15, dir: D.out(S.V[hv], S.ctr), gap: 14 });
          if (st === 1 || st === 4) D.label(faceMid(S.V, S.F[hf]), I.face, { color: SKY, size: 14, at: [[0, 26]] });
        }
        if (C.tab === 'explore' && !C.thumb) {
          const vp = D.P(S.V[hv]), fp = D.P(faceMid(S.V, S.F[hf]));
          b.handle('hv', vp, { color: 'amber', r: 8.5, priority: 1, ariaLabel: '꼭짓점 고르기', drag: (w) => { let best = 0, bd = 1e18; S.V.forEach((p, vi) => { const q = D.P(p), d = (q.x - w.x) ** 2 + (q.y - w.y) ** 2; if (d < bd && D.depth(p) < D.depth(S.ctr) + 1e-9) { bd = d; best = vi; } }); s.phHv = best; } });
          b.handle('hf', fp, { color: 'sky', r: 8.5, ariaLabel: '면 고르기', drag: (w) => { let best = 0, bd = 1e18; S.F.forEach((f, fi) => { if (!D.facing(f.n)) return; const q = D.P(faceMid(S.V, f)), d = (q.x - w.x) ** 2 + (q.y - w.y) ** 2; if (d < bd) { bd = d; best = fi; } }); s.phHf = best; } });
        }
        const L = [{ t: `${I.name}`, c: 'ink', size: 17 }];
        if (st === 1) L.push({ t: `면: ${I.face} ${I.F}개`, c: SKY, size: 15 });
        if (st === 2) L.push({ t: `한 꼭짓점에 면 ${I.q}개 모임`, c: AMB, size: 15 });
        if (st === 3 || st === 4) L.push({ t: `모서리 ${I.p}×${I.F}÷2 = ${I.E}개`, c: SKY, size: 15 }, { t: `꼭짓점 ${I.p}×${I.F}÷${I.q} = ${I.V}개`, c: AMB, size: 15 });
        banner(b, L, C);
      } else banner(b, [{ t: I.name, c: 'ink', size: 17 }], C);
      D.flush();
    },
    steps: (M) => {
      const I = M.I;
      return [
        `면의 모양과 개수를 세요. ${I.name}은 ${I.face} $${I.F}$개로 이루어져 있어요. (한 면의 변의 수 $p=${I.p}$)`,
        `한 꼭짓점에 모인 면의 수를 세요. $q=${I.q}$이에요.`,
        `모서리는 $${I.p}\\times ${I.F}\\div 2=${I.E}$ (개), 꼭짓점은 $${I.p}\\times ${I.F}\\div ${I.q}=${I.V}$ (개)예요.`
      ];
    },
    view: (M) => {
      const I = M.I;
      return {
        guide: `입체를 고른 뒤 ${span('sky', '파란 손잡이')}로 면을, ${span('amber', '노란 손잡이')}로 꼭짓점을 골라 보세요. 면의 모양(p)과 한 꼭짓점에 모인 면의 수(q)를 세어 계산해요.`,
        readouts: [rd('면의 모양', `${I.face} (p=${I.p})`, SKY), rd('면의 개수 F', `${I.F}개`, SKY), rd('한 꼭짓점에 모인 면 q', `${I.q}개`, AMB), rd('모서리 E', `${I.E}개`, 'ink', `${I.p}×${I.F}÷2`), rd('꼭짓점 V', `${I.V}개`, 'ink', `${I.p}×${I.F}÷${I.q}`)],
        formula: `<p>$E=\\dfrac{${I.p}\\times ${I.F}}{2}=${I.E},\\quad V=\\dfrac{${I.p}\\times ${I.F}}{${I.q}}=${I.V}$</p>`,
        rule: '모서리의 수 = (면의 수 × 한 면의 변의 수) ÷ 2, 꼭짓점의 수 = (면의 수 × 한 면의 변의 수) ÷ (한 꼭짓점에 모인 면의 수)',
        notes: notes('모서리는 두 면이 함께 가지므로 2로 나눠요.', '꼭짓점은 $q$개의 면이 함께 가지므로 $q$로 나눠요.')
      };
    },
    prob: (M) => {
      const I = PLAT[M.Q.k], ask = M.Q.ask, val = I[ask], other = ask === 'V' ? I.E : I.V, pF = I.p * I.F;
      const wr = [[pF, '변의 수를 모두 더하기만 했어요. 같은 모서리를 두 번 센 값이에요.'], [pF / 2, ask === 'V' ? '모서리의 개수예요. 꼭짓점은 한 꼭짓점에 모인 면의 수로 나눠요.' : '이 값이 모서리의 개수예요.'], [other, ask === 'V' ? '모서리의 개수예요.' : '꼭짓점의 개수예요.'], [I.F, '면의 개수예요.'], [pF / I.q, ask === 'E' ? '꼭짓점의 개수예요.' : '']];
      return { tag: '정다면체의 구성 요소', key: `${M.Q.k}|${ask}`, stem: `${I.name}의 ${ask === 'V' ? '꼭짓점' : '모서리'}의 개수는?`, choices: mkChoices(val, wr) };
    }
  };

  /* ------------------------------------------------------------------ p2-5 면의 중심을 이으면(확장) */
  const DUAL = { tetra: 'tetra', cube: 'octa', octa: 'cube', dodeca: 'icosa', icosa: 'dodeca' };
  const dualS = (k, t) => { const S = platS(k); return solidOf(S.F.map((f) => add3(S.ctr, mul3(sub3(f.c, S.ctr), t)))); };
  function rollP25() { const k = PLAT_KEYS[rint(0, 4)]; return { k }; }
  const P5 = {
    id: 'p2-5', title: '면의 중심을 이으면', short: '면의 중심 잇기',
    question: '정다면체의 각 면의 중심을 이으면 어떤 입체가 만들어질까? 안쪽 입체를 키워 보자.',
    ctl: () => ['phDual'].concat(VIEW),
    presets: () => PLAT_KEYS.map((k, i) => ({ group: i === 0 ? '입체 고르기' : '', label: PLAT[k].name, apply: (st) => { st.phSel5 = k; }, on: (st) => st.phSel5 === k })),
    init: (s) => { s.phSel5 = 'cube'; s.phDual = 1; s.phQ = rollP25(); },
    reroll: (s) => { s.phQ = rollP25(); },
    model: (s) => { const k = s.phSel5 || 'cube', t = clamp(s.phDual, 0.02, 1); return { k, t, I: PLAT[k], D2: PLAT[DUAL[k]], S: platS(k), Q: s.phQ }; },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), st = stepOf(C), k = C.problem ? M.Q.k : M.k, S = platS(k), t = C.problem ? 1 : C.review ? (st === 1 ? 0.02 : 1) : M.t;
      D.fitPts(S.V, { t: C.problem ? 40 : 92, b: 46, l: 50, r: 50 });
      drawPoly(D, S, { face: (fi, vis) => (vis ? { c: 'green', a: 0.08 } : null), edge: () => ({ color: 'ink', width: 2.4, alpha: 0.55 }) });
      if (!C.problem && t > 0.03) {
        const T = dualS(k, t);
        drawPoly(D, T, { face: (fi, vis) => (vis ? { c: AMB, a: 0.2 } : null), edge: () => ({ color: AMB, width: 3.4 }) });
      }
      S.F.forEach((f) => D.dot(f.c, AMB, 5.5));
      if (C.txt) {
        const I = PLAT[k], D2 = PLAT[DUAL[k]];
        if (C.problem) banner(b, [{ t: `${I.name}의 면의 중심 ${I.F}개를 이어 입체를 만들어요`, c: 'ink', size: 15 }], C);
        else banner(b, [{ t: `${I.name}의 면 ${I.F}개 → 중심 ${I.F}개`, c: 'ink', size: 16 }, st === 3 || st === 4 ? { t: `꼭짓점이 ${I.F}개인 ${D2.name}이 생겨요`, c: AMB, size: 16 } : null], C);
      }
      D.flush();
    },
    steps: (M) => [
      `${M.I.name}의 각 면의 중심에 점을 찍어요. 면이 $${M.I.F}$개이므로 점도 $${M.I.F}$개예요.`,
      `이웃한 면의 중심끼리 선분으로 이어요. 모서리 하나마다 선분 하나가 생겨요.`,
      `만들어진 입체는 꼭짓점이 $${M.I.F}$개인 ${M.D2.name}이에요.`
    ],
    view: (M) => ({
      guide: `막대로 안쪽 입체를 키워 보세요. ${span('amber', '노란 점')}은 면의 중심이에요. 이 점을 이으면 ${span('amber', '노란 입체')}가 생겨요. 입체를 바꿔서 짝을 찾아보세요.`,
      readouts: [rd('원래 입체', M.I.name, 'ink', `면 ${M.I.F}개`), rd('이은 점의 수', `${M.I.F}개`, AMB, '= 원래 면의 수'), rd('만들어진 입체', M.D2.name, AMB, `꼭짓점 ${M.D2.V}개`)],
      formula: '<p>정사면체↔정사면체 · 정육면체↔정팔면체 · 정십이면체↔정이십면체</p>',
      rule: '정다면체의 각 면의 중심을 이으면 또 하나의 정다면체가 생긴다',
      notes: notes('원래 입체의 면의 수 = 새 입체의 꼭짓점의 수예요.', '정육면체와 정팔면체, 정십이면체와 정이십면체는 서로 짝이에요.')
    }),
    prob: (M) => {
      const k = M.Q.k, ans = nameOfPlat(DUAL[k]);
      return { tag: '면의 중심을 이은 입체', key: k, stem: `${nameOfPlat(k)}의 각 면의 중심을 이어 만든 입체는?`, choices: mkText(PLAT_KEYS.map((q) => ({ h: nameOfPlat(q), ok: nameOfPlat(q) === ans, hint: `${nameOfPlat(k)}의 면은 ${PLAT[k].F}개예요. 중심을 이은 입체의 꼭짓점의 수가 ${PLAT[k].F}개인 것을 찾아 보세요.` }))) };
    }
  };

  /* ------------------------------------------------------------------ p2-6 5가지뿐인 까닭 */
  function rollP26() { return { p: [3, 4, 5][rint(0, 2)] }; }
  const P6 = {
    id: 'p2-6', title: '정다면체가 5가지뿐인 까닭', short: '5가지뿐인 까닭',
    question: '정다각형과 모이는 면의 수를 모두 조합해 보면 입체가 되는 것은 몇 가지일까?',
    ctl: () => ['phPp', 'phQq'],
    init: (s) => { s.phPp = 3; s.phQq = 5; s.phQ = rollP26(); },
    reroll: (s) => { s.phQ = rollP26(); },
    model: (s) => { const p = clamp(Math.round(s.phPp), 3, 6), q = clamp(Math.round(s.phQq), 3, 6), v = verdict(p, q); return { p, q, th: interior(p), ...v, Q: s.phQ }; },
    draw(b, s, M, C) {
      const st = stepOf(C);
      if (C.problem) {
        // 문제: 면 하나(정p각형)와 모을 꼭짓점 O 만 보여 줍니다
        const pp = M.Q.p, pl = fan(pp, 1)[0], R = pp === 6 ? 2.05 : pp === 5 ? 1.75 : pp === 4 ? 1.45 : 1.05;
        fit(b, { x0: -R, x1: R, y0: -R, y1: R }, { t: 70, b: 50, l: 40, r: 40 });
        b.path(pl.pts, { close: true, fill: SKY, fillAlpha: 0.25, color: 'ink', width: 2.6 });
        b.point({ x: 0, y: 0 }, { color: AMB, r: 7 });
        if (C.txt) banner(b, [{ t: `${PNAME[pp]}을 한 꼭짓점 O에 여러 개 모아요`, c: 'ink', size: 16 }], C);
        return;
      }
      b.focus = { x: [0, 1], y: [0, 1] }; // 그림 좌표는 쓰지 않고 화면 좌표로 그립니다
      const x0 = b.insets.left + 12, x1 = b.W - b.insets.right - 60, top = b.insets.top + (C.problem ? 20 : 70), bot = b.H - b.insets.bottom - 16;
      const hw = 74, hh = 30, cw = (x1 - x0 - hw) / 4, ch = Math.min((bot - top - hh) / 4, 78);
      const cell = (pp, qq) => ({ x: x0 + hw + (qq - 3) * cw, y: top + hh + (pp - 3) * ch });
      for (let qq = 3; qq <= 6; qq++) b.stext(cell(3, qq).x + cw / 2, top + hh / 2, `${qq}개`, { color: SKY, size: 15, weight: 800, align: 'center', baseline: 'middle' });
      b.stext(x0 + hw / 2, top + hh / 2, '모인 면', { color: 'ink', size: 12, weight: 700, align: 'center', baseline: 'middle' });
      for (let pp = 3; pp <= 6; pp++) b.stext(x0 + hw / 2, cell(pp, 3).y + ch / 2, PNAME[pp], { color: AMB, size: 14, weight: 800, align: 'center', baseline: 'middle' });
      for (let pp = 3; pp <= 6; pp++) for (let qq = 3; qq <= 6; qq++) {
        const c = cell(pp, qq), v = verdict(pp, qq), sel = !C.problem && pp === M.p && qq === M.q;
        const hide = C.problem || (st === 1);
        const col = hide ? 'muted' : v.kind === 'ok' ? GRN : v.kind === 'flat' ? 'orange' : RED;
        sRect(b, c.x + 2, c.y + 2, c.x + cw - 2, c.y + ch - 2, col, sel ? 0.5 : (hide ? 0.06 : 0.22), true);
        if (C.problem) { continue; }
        b.stext(c.x + cw / 2, c.y + ch * 0.36, `${Math.round(v.sum)}°`, { color: 'ink', size: 15, weight: 800, align: 'center', baseline: 'middle' });
        if (st !== 1) b.stext(c.x + cw / 2, c.y + ch * 0.7, v.kind === 'ok' ? nameOfPlat(v.key) : '입체 ✕', { color: v.kind === 'ok' ? GRN : RED, size: 12.5, weight: 800, align: 'center', baseline: 'middle' });
      }
      if (C.txt && !C.problem) {
        const v = verdict(M.p, M.q);
        banner(b, [{ t: `${PNAME[M.p]} ${M.q}개: ${Math.round(interior(M.p))}° × ${M.q} = ${Math.round(v.sum)}°`, c: 'ink', size: 16 }, st >= 2 ? { t: v.kind === 'ok' ? `360°보다 작아요 → ${nameOfPlat(v.key)}` : v.kind === 'flat' ? '360°와 같아요 → 입체가 안 돼요' : '360°보다 커요 → 입체가 안 돼요', c: v.kind === 'ok' ? GRN : RED, size: 15 } : null], C, { y0: 14 });
      }
      if (C.problem && C.txt) banner(b, [{ t: `${PNAME[M.Q.p]}를 한 꼭짓점에 모아요`, c: 'ink', size: 16 }], C, { y0: 0 });
      // 손잡이: 칸 고르기
      if (C.tab === 'explore' && !C.thumb) {
        const c = cell(M.p, M.q);
        b.handle('cell', b.toW(c.x + cw - 9, c.y + 9), { color: 'amber', r: 6.5, ariaLabel: '칸 고르기', drag: (w) => { const sp = b.toS(w.x, w.y); s.phQq = clamp(Math.floor((sp.x - x0 - hw) / cw) + 3, 3, 6); s.phPp = clamp(Math.floor((sp.y - top - hh) / ch) + 3, 3, 6); } });
      }
    },
    steps: (M) => [
      `정다각형 면의 한 각은 정삼각형 $60^\\circ$, 정사각형 $90^\\circ$, 정오각형 $108^\\circ$, 정육각형 $120^\\circ$예요.`,
      `한 꼭짓점에 면이 $3$개 이상 모이고, 각의 합은 $360^\\circ$보다 작아야 해요.`,
      `조건을 만족하는 경우는 정삼각형 $3,4,5$개, 정사각형 $3$개, 정오각형 $3$개의 $5$가지뿐이에요. 정육각형은 $3$개만 모여도 $360^\\circ$예요.`
    ],
    view: (M) => ({
      guide: `표에서 칸을 눌러 보거나 막대·${span('amber', '노란 손잡이')}로 칸을 고르세요. 각의 합이 ${span('green', '360°보다 작은 칸(초록)')}만 입체가 돼요. 초록 칸은 모두 5개예요.`,
      readouts: [rd('고른 칸', `${PNAME[M.p]} ${M.q}개`, AMB), rd('각의 합', `${Math.round(M.sum)}°`, M.kind === 'ok' ? GRN : RED, `${Math.round(M.th)}° × ${M.q}`), rd('판정', M.kind === 'ok' ? nameOfPlat(M.key) : '입체 ✕', M.kind === 'ok' ? GRN : RED)],
      formula: `<p>입체가 되는 칸: $60^\\circ\\times 3,4,5 \\;/\\; 90^\\circ\\times 3 \\;/\\; 108^\\circ\\times 3$ → 5가지</p>`,
      rule: '한 꼭짓점에 모인 각의 합이 360°보다 작은 경우만 입체가 된다 → 정다면체는 5가지뿐',
      notes: notes('정삼각형은 최대 5개까지, 정사각형·정오각형은 3개까지 모을 수 있어요.', '정육각형 이상은 3개를 모아도 $360^\\circ$ 이상이라 정다면체를 만들 수 없어요.')
    }),
    prob: (M) => {
      const p = M.Q.p, mx = p === 3 ? 5 : 3;
      const wr = [[mx + 1, '그 개수를 모으면 각의 합이 360° 이상이 되어 입체가 안 돼요.'], [mx - 1, '이보다 한 개 더 모을 수 있어요.'], [6, '정삼각형 6개는 합이 360°예요.'], [4, `정${p}각형 4개의 합을 계산해 보세요.`], [3, '3개는 가능하지만 최대가 아닐 수 있어요.'], [2, '면은 3개 이상 모여야 해요.'], [mx + 2, '그 개수를 모으면 각의 합이 360°를 넘어요.']];
      return { tag: '정다면체의 조건', key: 'max' + p, stem: `${PNAME[p]}으로 정다면체를 만들 때, 한 꼭짓점에 모일 수 있는 면의 최대 개수는?`, choices: mkChoices(mx, wr, { valid: (v) => Number.isInteger(v) && v >= 2 && v <= 7 }) };
    }
  };

  G.register(20, 't2', '② 정다면체', '정다면체', PARAMS, [P1, P2, P3, P4, P5, P6]);
})();
