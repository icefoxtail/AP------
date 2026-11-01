/* ==========================================================================
   중1 · 평행선의 성질 — 탭 ① 「동위각·엇각」 (t1.js, order 10)
   - p1-1 동위각·엇각의 위치: 평행선 l, m 과 횡단선 n. n 을 돌리고(노란 점) 밀어서(하늘색 점) 각 8개의 이름과 크기를 확인합니다.
   - p1-2 평행 조건: m 을 돌려 보며 동위각·엇각이 같아지는 순간에만 l ∥ m 이 됨을 확인합니다.
   - p1-3 평행 판별: 두 각의 값을 바꿔 보고, 문제에서는 그림 5개 중 평행한 것을 고릅니다.
   그림 좌표: 평행선 사이 간격 GAP, 횡단선 n 은 가운데 (cx, 0)을 지나고 l 과 θ 를 이룹니다. 각은 모두 도형 좌표(y 아래쪽)로 그립니다.
   ========================================================================== */
(function () {
  'use strict';
  const K = window.APL_PA_KIT;
  if (!K) return;
  const { DEG, clamp, NUM, dir, add, at, angOf, norm, T, dot, parLine, wedge, mkChoices, makeScene, pick, rnd, mi, esc } = K;

  const GAP = 3.4, XR = 4.3; // 평행선 사이 간격, 선 반쪽 길이
  const NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const CORR = [['a', 'e'], ['b', 'f'], ['c', 'g'], ['d', 'h']];
  const ALT = [['c', 'f'], ['d', 'e']];
  const FOCUS = { x: [-4.6, 4.6], y: [-4.2, 4.2] };
  const wdeg = (d1, d2) => { let w = norm(d2 - d1); if (w > 180) w = 360 - w; return Math.round(w * 1000) / 1000; };

  /* ---------------- 도형 ---------------- */
  // theta: 횡단선 n 이 l 과 이루는 각, phi: m 의 기울기(평행이면 0), cx: n 의 가로 위치
  function geom(theta, phi, cx) {
    const half = GAP / 2, cot = Math.cos(theta * DEG) / Math.sin(theta * DEG);
    const P = { x: cx + half * cot, y: -half }, Q = { x: cx - half * cot, y: half };
    const W = {
      a: { V: P, d1: 180, d2: theta, at: 'P' }, b: { V: P, d1: 0, d2: theta, at: 'P' },
      c: { V: P, d1: 180, d2: theta + 180, at: 'P' }, d: { V: P, d1: theta + 180, d2: 0, at: 'P' },
      e: { V: Q, d1: phi + 180, d2: theta, at: 'Q' }, f: { V: Q, d1: phi, d2: theta, at: 'Q' },
      g: { V: Q, d1: phi + 180, d2: theta + 180, at: 'Q' }, h: { V: Q, d1: theta + 180, d2: phi, at: 'Q' }
    };
    NAMES.forEach((n) => { W[n].val = wdeg(W[n].d1, W[n].d2); });
    return { theta, phi, cx, P, Q, W };
  }
  const SHAPE = (kind) => (kind === 'corr' ? 'F' : 'Z');
  const KIND = (kind) => (kind === 'corr' ? '동위각' : '엇각');
  const isPair = (kind, x, y) => (kind === 'corr' ? CORR : ALT).some((p) => (p[0] === x && p[1] === y) || (p[0] === y && p[1] === x));
  const partnerOf = (kind, n) => { const p = (kind === 'corr' ? CORR : ALT).find((q) => q.includes(n)); return p ? (p[0] === n ? p[1] : p[0]) : null; };

  // 직선 l·m·n 과 점. opt.arrowM: m 에 평행 표시(>) 를 그릴지
  function drawBase(b, G, opt = {}) {
    const { P, Q, theta, phi } = G;
    parLine(b, { x: 0, y: -GAP / 2 }, 0, { e0: -XR, e1: XR, arrows: [-3.0, 2.6], name: 'l', nameAt: XR - 0.3 });
    const cp = Math.cos(phi * DEG);
    const e0 = (-XR - Q.x) / cp, e1 = (XR - Q.x) / cp;
    if (opt.arrowM !== false) parLine(b, Q, phi, { e0, e1, arrows: [(-3.0 - Q.x) / cp, (2.6 - Q.x) / cp], name: null });
    else b.path([at(Q, phi, e0), at(Q, phi, e1)], { color: 'sky', width: 3.4 });
    // m 이름: 오른쪽 끝(화면 안으로 밀어 넣음)
    const ym = clamp(Q.y - (XR - 0.3 - Q.x) * Math.tan(phi * DEG), -3.6, 3.6);
    T(b, { x: XR - 0.3, y: ym }, 'm', { dy: -17, color: 'sky', size: 18 });
    const top = at(P, theta, 1.3), bot = at(Q, theta + 180, 1.3);
    b.path([bot, top], { color: 'rose', width: 3.4 });
    T(b, bot, 'n', { dx: -14, dy: 8, color: 'rose', size: 18 });
    dot(b, P, 'rose', 5); dot(b, Q, 'rose', 5);
  }
  // F·Z 윤곽: 두 각의 변과 PQ 를 굵게 겹쳐 그림
  function overlay(b, G, n1, n2, color, alpha = 0.42) {
    const L = 1.15;
    [n1, n2].forEach((n) => {
      const w = G.W[n];
      b.path([at(w.V, w.d1, L), w.V, at(w.V, w.d2, L)], { color, width: 9, alpha });
    });
    b.path([G.P, G.Q], { color, width: 9, alpha });
  }
  // 각 8개를 그립니다. spec: { name: { color, rings, text } } 에 없는 각은 연한 이름만.
  function drawWedges(b, G, spec, o = {}) {
    NAMES.forEach((n) => {
      const w = G.W[n], sp = spec[n];
      if (sp) wedge(b, w.V, w.d1, w.d2, { color: sp.color, rings: sp.rings || 1, text: sp.text, r: sp.r || 28, size: sp.size || 17, fa: sp.fa });
      else if (o.letters !== false) wedge(b, w.V, w.d1, w.d2, { color: 'muted', r: 20, text: n, size: 16, tcolor: 'muted', bare: true, maxD: 44 });
    });
  }

  /* ======================================================================
     p1-1 동위각·엇각의 위치
     ====================================================================== */
  const P1 = {
    pT: K.param({ value: 65, min: 45, max: 135, label: '횡단선 n의 기울기', hint: '그림의 노란 점을 끌어 돌려도 돼요', color: 'rose' }),
    pX: K.param({ value: 0, min: -1.8, max: 1.8, step: 0.05, label: '횡단선 n의 위치', hint: '그림의 하늘색 점을 좌우로 끌어도 돼요', color: 'sky', format: (v) => (Math.abs(v) < 0.025 ? '가운데' : (v > 0 ? '오른쪽 ' : '왼쪽 ') + Math.abs(v).toFixed(1)) })
  };
  const D11 = {
    id: 'p1-1', title: '동위각과 엇각의 위치', short: '동위각·엇각 위치',
    question: '두 직선 l, m 을 한 직선 n 이 가로지르면 각이 8개 생겨요. 어느 두 각이 동위각이고, 어느 두 각이 엇각일까요?',
    focus: FOCUS,
    ctl: ['pT', 'pX'],
    init: (s) => { s.pT = 65; s.pX = 0; s.pMode = 'corr'; s.pPair = 0; s.pTar = 'c'; s.pKind = 'corr'; },
    reroll: (s) => {
      s.pT = pick([50, 55, 60, 70, 75, 110, 115, 120, 125], s.pT); s.pX = pick([-1, -0.5, 0, 0.5, 1], s.pX);
      s.pKind = Math.random() < 0.5 ? 'corr' : 'alt';
      const pool = s.pKind === 'corr' ? NAMES : ['c', 'd', 'e', 'f'];
      s.pTar = pick(pool, s.pTar);
    },
    presets: (s) => {
      const out = [
        { group: '찾을 각', label: '동위각 (F)', apply: (st) => { st.pMode = 'corr'; st.pPair = 0; }, on: (st) => st.pMode === 'corr' },
        { label: '엇각 (Z)', apply: (st) => { st.pMode = 'alt'; st.pPair = 0; }, on: (st) => st.pMode === 'alt' }
      ];
      (s.pMode === 'corr' ? CORR : ALT).forEach((p, i) => out.push({ group: i === 0 ? '각의 짝' : '', label: `${p[0]} · ${p[1]}`, apply: (st) => { st.pPair = i; }, on: (st) => st.pPair === i }));
      return out;
    },
    model: (s) => {
      const G = geom(s.pT, 0, s.pX);
      const pairs = s.pMode === 'corr' ? CORR : ALT;
      const pair = pairs[Math.min(s.pPair || 0, pairs.length - 1)];
      return { G, theta: s.pT, mode: s.pMode, pair, tar: s.pTar, tkind: s.pKind, cx: s.pX };
    },
    draw(b, s, M, C) {
      const G = M.G, W = G.W, th = M.theta;
      const val = (n) => W[n].val;
      const label = (n) => `${n}=${mi(val(n))}°`;
      drawBase(b, G);
      const spec = {};
      let ov = [];
      if (C.mode === 'problem') {
        spec[M.tar] = { color: 'green', text: M.tar, rings: 1, size: 20 };
      } else if (C.mode === 'review') {
        if (C.step === 1) { spec.a = { color: 'amber', text: label('a') }; spec.e = { color: 'amber', text: label('e') }; ov = [['a', 'e', 'amber']]; }
        else if (C.step === 2) { spec.c = { color: 'amber', text: label('c') }; spec.f = { color: 'amber', text: label('f') }; ov = [['c', 'f', 'amber']]; }
        else {
          spec.a = { color: 'amber', text: label('a') }; spec.e = { color: 'amber', text: label('e') };
          spec.c = { color: 'violet', rings: 2, text: label('c') }; spec.f = { color: 'violet', rings: 2, text: label('f') };
        }
      } else {
        const [n1, n2] = M.pair;
        spec[n1] = { color: 'amber', text: label(n1) }; spec[n2] = { color: 'amber', text: label(n2) };
        ov = [[n1, n2, 'amber']];
      }
      ov.forEach((o) => overlay(b, G, o[0], o[1], o[2]));
      drawWedges(b, G, spec);
      // 모양 이름(F / Z)
      let cap = null;
      if (C.mode === 'explore') cap = `${KIND(M.mode)} : ${SHAPE(M.mode)} 모양`;
      else if (C.mode === 'review') cap = C.step === 1 ? '동위각 : F 모양' : C.step === 2 ? '엇각 : Z 모양' : `동위각 ∠a=∠e=${mi(val('a'))}° · 엇각 ∠c=∠f=${mi(val('c'))}°`;
      if (cap) T(b, { x: 0, y: 3.55 }, cap, { color: C.mode === 'review' && C.step === 2 ? 'amber' : 'amber', size: 18 });
      if (C.mode === 'explore') {
        const top = at(G.P, th, 1.3), center = { x: s.pX, y: 0 };
        b.handle('rot', top, { color: 'amber', ariaLabel: '횡단선 n의 기울기 손잡이', drag: (w) => { let a = angOf({ x: s.pX, y: 0 }, w); a = ((a % 180) + 180) % 180; s.pT = clamp(Math.round(a), 45, 135); } });
        b.handle('slide', center, { color: 'sky', ariaLabel: '횡단선 n의 위치 손잡이(좌우)', drag: (w) => { s.pX = clamp(Math.round(w.x * 20) / 20, -1.8, 1.8); } });
      }
    },
    steps: (M) => {
      const W = M.G.W;
      return [
        '동위각: 두 직선이 한 직선과 만날 때, 같은 쪽의 같은 위치에 있는 두 각이에요. 그림에서 F 모양이에요. 예) ∠a와 ∠e',
        '엇각: 두 직선 사이에서 서로 엇갈린 위치에 있는 두 각이에요. Z 모양이에요. 예) ∠c와 ∠f',
        `l ∥ m 이면 동위각의 크기도 같고 엇각의 크기도 같아요. ∠a = ∠e = ${mi(W.a.val)}°, ∠c = ∠f = ${mi(W.c.val)}°`
      ];
    },
    view(M, C, s) {
      const W = M.G.W, [n1, n2] = M.pair, k = KIND(M.mode);
      return {
        guide: `횡단선 n을 <b>노란 점</b>으로 돌리고 <b>하늘색 점</b>으로 밀어 보세요. 같은 색으로 칠한 두 각은 <b>${k}</b>(${SHAPE(M.mode)} 모양)이에요. 아래에서 각의 짝을 바꿔 눌러 보세요.`,
        readouts: [
          { label: `∠${n1}`, value: mi(W[n1].val) + '°', color: 'amber', note: `${k}`, wide: false },
          { label: `∠${n2}`, value: mi(W[n2].val) + '°', color: 'amber', note: `${k}`, wide: false },
          { label: `∠${n1} 와 ∠${n2}`, value: W[n1].val === W[n2].val ? '크기가 같아요' : '크기가 달라요', color: 'green', note: 'l ∥ m 이므로', wide: true }
        ],
        status: { tone: 'ok', text: `${k} ∠${n1} = ∠${n2} = ${mi(W[n1].val)}°` },
        formula: `<p>l ∥ m 일 때</p><p>동위각의 크기는 같다 → ∠a = ∠e, ∠b = ∠f, ∠c = ∠g, ∠d = ∠h</p><p>엇각의 크기는 같다 → ∠c = ∠f, ∠d = ∠e</p>`,
        rule: '평행선에서 동위각의 크기는 같고, 엇각의 크기도 같다',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>동위각·엇각은 <b>두 직선 사이의 위치</b>로 정해져요. 크기가 같다는 것은 두 직선이 <b>평행할 때</b>만 말할 수 있어요.</li><li>맞꼭지각(예: ∠a와 ∠d)은 평행하지 않아도 항상 같아요. 동위각·엇각과 헷갈리지 마세요.</li></ul>'
      };
    },
    prob(M) {
      const t = M.tar, kind = M.tkind, ans = partnerOf(kind, t), other = partnerOf(kind === 'corr' ? 'alt' : 'corr', t);
      const sameP = NAMES.filter((n) => M.G.W[n].at === M.G.W[t].at && n !== t);
      const kindName = KIND(kind);
      const order = [];
      if (other && other !== ans) order.push([other, `∠${t}, ∠${other}의 관계는 ${KIND(kind === 'corr' ? 'alt' : 'corr')}이에요. ${kindName}은 ${SHAPE(kind)} 모양으로 찾아요.`]);
      sameP.forEach((n) => order.push([n, `∠${n}: 두 각이 같은 교점에 있어요. ${kindName}은 서로 다른 두 교점에서 하나씩 찾아요.`]));
      NAMES.forEach((n) => { if (n !== t && n !== ans && !order.some((o) => o[0] === n)) order.push([n, `∠${n}: ∠${t}의 ${kindName}이 아니에요. ${SHAPE(kind)} 모양을 이루는 각을 찾아요.`]); });
      const wrong = order.filter((o) => o[0] !== ans).slice(0, 4);
      const list = [{ n: ans, ok: true, hint: '' }].concat(wrong.map((o) => ({ n: o[0], ok: false, hint: o[1] })));
      list.sort((x, y) => x.n.localeCompare(y.n));
      return {
        tag: `${kindName} 찾기`, stem: `그림에서 l ∥ m 일 때, ∠${t}의 ${kindName}은?`, key: `${t}${kind}${M.theta}`,
        choices: list.map((c) => ({ t: `\\angle ${c.n}`, p: `∠${c.n}`, ok: c.ok, hint: c.hint })),
        note: '그림의 초록색 각이 ∠' + t + ' 예요.'
      };
    }
  };

  /* ======================================================================
     p1-2 평행 조건: m 을 돌려 동위각·엇각이 같아지는 순간 l ∥ m
     ====================================================================== */
  const P2 = {
    qT: K.param({ value: 65, min: 45, max: 135, label: '횡단선 n의 기울기', hint: '그림의 분홍 선 위쪽 손잡이를 끌어도 돼요', color: 'rose' }),
    qPhi: K.param({ value: 14, min: -25, max: 25, label: '직선 m 돌리기', hint: '그림의 오른쪽 하늘색 점을 위아래로 끌어도 돼요. 0°일 때 l과 평행이에요', color: 'sky', format: (v) => (v === 0 ? '0° (평행)' : (v > 0 ? '+' : '−') + Math.abs(v) + '°') })
  };
  const D12 = {
    id: 'p1-2', title: '평행이 되는 조건', short: '평행 조건',
    question: '직선 m 을 돌려 보세요. 동위각(또는 엇각)의 크기가 어떻게 될 때 두 직선 l, m 이 평행할까요?',
    focus: FOCUS,
    ctl: ['qT', 'qPhi'],
    init: (s) => { s.qT = 65; s.qPhi = 14; s.qMode = 'corr'; s.qGiven = 'a'; s.qAsk = 'f'; },
    reroll: (s) => {
      s.qT = pick([50, 55, 60, 70, 75, 105, 110, 115, 125], s.qT);
      s.qGiven = pick(['a', 'b', 'c', 'd'], s.qGiven);
      s.qAsk = pick(['e', 'f', 'g', 'h'], s.qAsk);
    },
    presets: () => [
      { group: '확인할 각', label: '동위각 (F)', apply: (s) => { s.qMode = 'corr'; }, on: (s) => s.qMode === 'corr' },
      { label: '엇각 (Z)', apply: (s) => { s.qMode = 'alt'; }, on: (s) => s.qMode === 'alt' },
      { group: '바로 맞추기', label: 'm을 평행으로', apply: (s) => { s.qPhi = 0; }, on: (s) => s.qPhi === 0 }
    ],
    model: (s) => {
      const G = geom(s.qT, s.qPhi, 0);
      const n1 = s.qMode === 'corr' ? 'b' : 'c', n2 = 'f';
      const v1 = G.W[n1].val, v2 = G.W[n2].val;
      return { G, theta: s.qT, phi: s.qPhi, mode: s.qMode, n1, n2, v1, v2, eq: v1 === v2, given: s.qGiven, ask: s.qAsk };
    },
    draw(b, s, M, C) {
      const prob = C.mode === 'problem';
      const G = prob ? geom(M.theta, 0, 0) : M.G, W = G.W;
      drawBase(b, G, { arrowM: prob ? true : M.eq });
      const spec = {};
      if (prob) {
        const g = M.given, a = M.ask;
        spec[g] = { color: 'amber', text: mi(W[g].val) + '°', rings: 1 };
        spec[a] = { color: 'green', text: 'x', rings: 1, size: 20 };
        drawWedges(b, G, spec, { letters: false });
        T(b, { x: 0, y: 3.55 }, 'l ∥ m', { color: 'sky', size: 18 });
        return;
      }
      const { n1, n2, v1, v2, eq } = M;
      const st = C.mode === 'review' ? C.step : 99;
      if (st >= 1) {
        spec[n1] = { color: 'amber', text: st >= 2 ? mi(v1) + '°' : n1 };
        spec[n2] = { color: eq ? 'amber' : 'violet', rings: eq ? 1 : 2, text: st >= 2 ? mi(v2) + '°' : n2 };
        if (st < 2) { spec[n1].size = 18; spec[n2].size = 18; }
        overlay(b, G, n1, n2, 'amber', 0.34);
      }
      if (M.mode === 'corr' && st >= 3) spec.e = { color: 'violet', rings: 3, text: mi(W.e.val) + '°', fa: 0.14 };
      drawWedges(b, G, spec, { letters: false });
      if (st >= 2) T(b, { x: 0, y: -3.7 }, eq ? 'l ∥ m  (두 각이 같아요)' : 'l과 m은 평행하지 않아요', { color: eq ? 'green' : 'rose', size: 19 });
      if (st >= 3 && M.mode === 'corr') T(b, { x: 0, y: 3.55 }, `∠e + ∠f = ${mi(W.e.val)}° + ${mi(v2)}° = 180°`, { color: 'violet', size: 17 });
      if (C.mode === 'explore') {
        const Q = G.Q, cp = Math.cos(M.phi * DEG), tt = (3.2 - Q.x) / cp, E = at(Q, M.phi, tt);
        b.handle('mrot', E, { color: 'sky', ariaLabel: '직선 m 돌리기 손잡이', drag: (w) => { s.qPhi = clamp(Math.round(angOf(Q, w)), -25, 25); } });
        const top = at(G.P, M.theta, 1.3);
        b.handle('rot', top, { color: 'rose', ariaLabel: '횡단선 n의 기울기 손잡이', drag: (w) => { let a = angOf({ x: 0, y: 0 }, w); a = ((a % 180) + 180) % 180; s.qT = clamp(Math.round(a), 45, 135); } });
      }
    },
    steps: (M) => {
      const k = KIND(M.mode), a = M.n1, f = M.n2;
      return [
        `${k}을 찾아요. ${SHAPE(M.mode)} 모양을 이루는 노란 각 → ∠${a}와 ∠${f}`,
        `두 각의 크기를 비교해요. ∠${a} = ${mi(M.v1)}°, ∠${f} = ${mi(M.v2)}°`,
        M.eq ? `${k}의 크기가 같으므로 l ∥ m 이에요. (이웃한 각 ∠e = 180° − ${mi(M.v2)}° = ${mi(180 - M.v2)}°)` : `${k}의 크기가 다르므로 l과 m은 평행하지 않아요. m을 ${mi(M.v2 - M.v1)}° 만큼 더 돌려야 같아져요.`
      ];
    },
    view(M, C, s) {
      const k = KIND(M.mode);
      return {
        guide: `<b>하늘색 점</b>(또는 아래 막대)으로 직선 m 을 돌려 보세요. 노란 각 ∠${M.n1} 과 ∠${M.n2} 는 <b>${k}</b>예요. 두 각이 같아지는 순간에만 두 직선이 평행해요.`,
        readouts: [
          { label: `∠${M.n1} (${k})`, value: mi(M.v1) + '°', color: 'amber' },
          { label: `∠${M.n2} (${k})`, value: mi(M.v2) + '°', color: M.eq ? 'amber' : 'violet' },
          { label: '두 각의 차', value: mi(Math.abs(M.v1 - M.v2)) + '°', color: M.eq ? 'green' : 'rose', note: M.eq ? '차가 0° → 평행' : '평행이 아니에요', wide: true }
        ],
        status: M.eq ? { tone: 'ok', text: `${k}이 같아요 → l ∥ m` } : { tone: 'warn', text: `${k}이 달라요 (${mi(M.v1)}° ≠ ${mi(M.v2)}°)` },
        formula: `<p>${k}의 크기가 같으면 → 두 직선은 평행</p><p>이웃한 두 각의 합 = 평각 = 180° (∠e + ∠f = 180°)</p>`,
        rule: '동위각(또는 엇각)의 크기가 같으면 두 직선은 평행하다',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>평행선의 <b>성질</b>(평행이면 같다)과 평행 <b>조건</b>(같으면 평행이다)은 서로 거꾸로예요.</li><li>이웃한 두 각은 합이 180°이므로, 하나를 알면 나머지도 구할 수 있어요.</li></ul>'
      };
    },
    prob(M) {
      const G = geom(M.theta, 0, 0), W = G.W, g = M.given, a = M.ask;
      const ans = W[a].val, gv = W[g].val;
      const rel = W[g].at === W[a].at ? '' : isPair('corr', g, a) ? '동위각' : isPair('alt', g, a) ? '엇각' : '동위각과 평각';
      const wrongs = [
        { v: 180 - ans, hint: `이웃한 각의 합은 180°예요. ∠x와 노란 각이 ${ans === gv ? '같은 크기' : '이웃한 각'}인지 확인해 보세요.` },
        { v: gv, hint: '노란 각과 같다고 바로 쓰기 전에 ∠x가 어떤 관계(동위각·엇각·이웃한 각)인지 확인해 보세요.' },
        { v: 180 - gv, hint: '평각 180°를 이용했어요. 두 각이 이웃한 각인지 동위각·엇각인지 먼저 구분해 보세요.' },
        { v: ans + 10, hint: '같은 위치(F)·엇갈린 위치(Z)의 각은 크기가 같고, 이웃한 각은 합이 180°예요.' }
      ];
      return {
        tag: '평행선과 각의 크기', stem: 'l ∥ m 일 때, ∠x의 크기는? (노란 각은 ' + mi(gv) + '°)', key: `${g}${a}${M.theta}`,
        choices: mkChoices(ans, wrongs, { lo: 5, hi: 175 }),
        note: rel ? '힌트: 노란 각과 ∠x는 ' + rel + ' 관계예요.' : ''
      };
    }
  };

  /* ======================================================================
     p1-3 평행 판별: 두 각의 값을 바꿔 보고, 그림 5개 중 평행한 것 고르기
     ====================================================================== */
  const P3 = {
    rA: K.param({ value: 70, min: 50, max: 130, label: '노란 각 p (l 쪽)', color: 'amber', hint: '그림의 노란 점을 끌어도 돼요' }),
    rB: K.param({ value: 70, min: 50, max: 130, label: '보라 각 q (m 쪽)', color: 'violet', hint: '그림의 보라색 점을 끌어도 돼요' })
  };
  // 값(vP, vQ)과 종류로 만든 그림: θ = vP, m 의 기울기 φ = vP − vQ
  function judgeGeom(vP, vQ) { return geom(vP, vP - vQ, 0); }
  function miniSVG(vP, vQ, kind) {
    const W = 170, H = 112, yl = 32, ym = 82, cx = 85, half = (ym - yl) / 2;
    const th = vP * DEG, cot = Math.cos(th) / Math.sin(th);
    const px = cx + half * cot, qx = cx - half * cot, phi = (vP - vQ) * DEG;
    const ptf = (x, y, d, len) => [x + Math.cos(d * DEG) * len, y - Math.sin(d * DEG) * len];
    const arc = (x, y, r, d1, d2) => { // 수학 각도 d1→d2(반시계) 부채꼴 호
      let w = norm(d2 - d1); if (w > 180) { const t = d1; d1 = d2; d2 = t; w = 360 - w; }
      const a = ptf(x, y, d1, r), c = ptf(x, y, d1 + w, r), bis = ptf(x, y, d1 + w / 2, r + 17);
      return { d: `M${x},${y} L${a[0].toFixed(1)},${a[1].toFixed(1)} A${r},${r} 0 0 0 ${c[0].toFixed(1)},${c[1].toFixed(1)} Z`, tx: bis[0], ty: bis[1] };
    };
    const mk = [px, yl, kind === 'corr' ? [0, vP] : [180, vP + 180]];
    const A1 = arc(px, yl, 16, mk[2][0], mk[2][1]);
    const A2 = arc(qx, ym, 16, phi / DEG, vP);
    const sx = (x, y, d1, d2) => `${(x + Math.cos(d1 * DEG) * d2).toFixed(1)},${(y - Math.sin(d1 * DEG) * d2).toFixed(1)}`;
    const mE0 = ptf(qx, ym, phi / DEG, -90), mE1 = ptf(qx, ym, phi / DEG, 90);
    const eq = vP === vQ;
    const nTop = ptf(px, yl, vP, 24), nBot = ptf(qx, ym, vP + 180, 24);
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${KIND(kind)} ${vP}°와 ${vQ}°"><g fill="none" stroke-linecap="round">` +
      `<line x1="4" y1="${yl}" x2="${W - 4}" y2="${yl}" stroke="var(--m-sky)" stroke-width="3"/>` +
      `<line x1="${mE0[0].toFixed(1)}" y1="${mE0[1].toFixed(1)}" x2="${mE1[0].toFixed(1)}" y2="${mE1[1].toFixed(1)}" stroke="var(--m-sky)" stroke-width="3"/>` +
      `<line x1="${nBot[0].toFixed(1)}" y1="${nBot[1].toFixed(1)}" x2="${nTop[0].toFixed(1)}" y2="${nTop[1].toFixed(1)}" stroke="var(--m-rose)" stroke-width="3"/>` +
      `<path d="${A1.d}" fill="var(--m-amber)" fill-opacity=".28" stroke="var(--m-amber)" stroke-width="2"/>` +
      `<path d="${A2.d}" fill="var(${eq ? '--m-amber' : '--m-violet'})" fill-opacity=".28" stroke="var(${eq ? '--m-amber' : '--m-violet'})" stroke-width="2"/></g>` +
      `<text x="${(A1.tx + (kind === 'corr' ? 9 : -9)).toFixed(1)}" y="${(A1.ty + 4).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="800" fill="var(--m-amber)" stroke="var(--card-2)" stroke-width="3" paint-order="stroke">${vP}°</text>` +
      `<text x="${(A2.tx + 6).toFixed(1)}" y="${(A2.ty + 4).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="800" fill="var(${eq ? '--m-amber' : '--m-violet'})" stroke="var(--card-2)" stroke-width="3" paint-order="stroke">${vQ}°</text></svg>`;
  }
  function genJudge(s) {
    // 정답 1개(두 각이 같음) + 오답 4개(다름). 오답 중 하나는 합이 180°인 함정.
    const kinds = () => (Math.random() < 0.5 ? 'corr' : 'alt');
    const VALS = [55, 60, 65, 70, 75, 80, 100, 105, 110, 115, 120, 125];
    const base = pick(VALS, s.rSeedBase || 0);
    s.rSeedBase = base;
    const all = [{ kind: kinds(), vP: base, vQ: base, ok: true, hint: '' }];
    const trap = 180 - base;
    if (Math.abs(trap - base) >= 10 && Math.abs(trap - base) <= 60) all.push({ kind: kinds(), vP: base, vQ: trap, ok: false, hint: `${base}°와 ${trap}°는 더해서 180°가 되는 각이에요. 평행이 되려면 두 각의 크기가 같아야 해요.` });
    while (all.length < 5) {
      const vP = pick(VALS, -1), sg = Math.random() < 0.5 ? 1 : -1, d = pick([10, 15, 20], 0);
      let vQ = vP + sg * d;
      if (vQ < 50 || vQ > 130) vQ = vP - sg * d;
      if (all.some((x) => x.vP === vP && x.vQ === vQ)) continue;
      all.push({ kind: kinds(), vP, vQ, ok: false, hint: `두 각이 ${vP}°와 ${vQ}°로 달라요. 크기가 같아야 평행이에요.` });
    }
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = all[i]; all[i] = all[j]; all[j] = t; }
    s.rList = all;
  }
  const D13 = {
    id: 'p1-3', title: '평행인지 판별하기', short: '평행 판별',
    question: '동위각 또는 엇각이라고 표시한 두 각의 크기가 주어졌어요. 두 각의 크기가 어떨 때 두 직선 l, m 이 평행일까요?',
    focus: FOCUS,
    ctl: ['rA', 'rB'],
    init: (s) => { s.rA = 70; s.rB = 70; s.rMode = 'corr'; s.rSeedBase = 0; genJudge(s); },
    reroll: (s) => { genJudge(s); },
    presets: () => [
      { group: '표시한 각', label: '동위각 (F)', apply: (s) => { s.rMode = 'corr'; }, on: (s) => s.rMode === 'corr' },
      { label: '엇각 (Z)', apply: (s) => { s.rMode = 'alt'; }, on: (s) => s.rMode === 'alt' },
      { group: '바로 맞추기', label: '두 각을 같게', apply: (s) => { s.rB = s.rA; }, on: (s) => s.rA === s.rB }
    ],
    model: (s) => {
      return { vP: s.rA, vQ: s.rB, kind: s.rMode, eq: s.rA === s.rB, list: s.rList || [], pickIdx: s.papick ? s.papick.idx : 0 };
    },
    draw(b, s, M, C) {
      let vP = M.vP, vQ = M.vQ, kind = M.kind;
      if (C.mode === 'problem') { const it = M.list[M.pickIdx] || M.list[0]; if (!it) return; vP = it.vP; vQ = it.vQ; kind = it.kind; }
      const G = judgeGeom(vP, vQ), W = G.W, eq = vP === vQ;
      drawBase(b, G, { arrowM: eq });
      const n1 = kind === 'corr' ? 'b' : 'c', n2 = 'f';
      const spec = {};
      spec[n1] = { color: 'amber', text: mi(vP) + '°' };
      spec[n2] = { color: eq ? 'amber' : 'violet', rings: eq ? 1 : 2, text: mi(vQ) + '°' };
      if (C.mode === 'review' && C.step === 1) { spec[n1].text = 'p'; spec[n2].text = 'q'; }
      overlay(b, G, n1, n2, 'amber', 0.3);
      drawWedges(b, G, spec, { letters: false });
      if (C.mode === 'problem') T(b, { x: 0, y: -3.7 }, `${NUM[Math.max(0, M.list.indexOf(M.list[M.pickIdx] || M.list[0]))]} 그림 (${KIND(kind)})`, { color: 'muted', size: 17 });
      else if (!(C.mode === 'review' && C.step < 3)) T(b, { x: 0, y: -3.7 }, eq ? 'l ∥ m  (두 각이 같아요)' : 'l과 m은 평행하지 않아요', { color: eq ? 'green' : 'rose', size: 19 });
      if (C.mode === 'explore') {
        const Q = G.Q, top = at(G.P, vP, 1.3);
        const E = at(Q, G.phi, (3.2 - Q.x) / Math.cos(G.phi * DEG));
        b.handle('ra', top, { color: 'amber', ariaLabel: '노란 각 p 손잡이', drag: (w) => { let a = angOf({ x: 0, y: 0 }, w); a = ((a % 180) + 180) % 180; s.rA = clamp(Math.round(a), 50, 130); } });
        b.handle('rb', E, { color: 'violet', ariaLabel: '보라 각 q 손잡이', drag: (w) => { const ph = clamp(Math.round(angOf(Q, w)), -60, 60); s.rB = clamp(s.rA - ph, 50, 130); } });
      }
    },
    steps: (M) => {
      const k = KIND(M.kind);
      return [
        `${k}을 찾아요. 노란 각 p(l 쪽)와 보라 각 q(m 쪽)는 ${SHAPE(M.kind)} 모양의 ${k}이에요.`,
        `두 각의 크기를 비교해요. p = ${mi(M.vP)}°, q = ${mi(M.vQ)}°`,
        M.eq ? `${k}의 크기가 같으므로 l ∥ m 이에요.` : `${k}의 크기가 다르므로 l과 m은 평행하지 않아요. (평행이려면 q = ${mi(M.vP)}°)`
      ];
    },
    view(M, C, s) {
      const k = KIND(M.kind);
      return {
        guide: `노란 각 p와 보라 각 q는 <b>${k}</b>이에요. 두 값을 바꿔 보며 어떨 때 l ∥ m 이 되는지 찾아보세요. <b>문제</b> 탭에서는 그림 5개 중 평행한 것을 골라요.`,
        readouts: [
          { label: '노란 각 p', value: mi(M.vP) + '°', color: 'amber' },
          { label: '보라 각 q', value: mi(M.vQ) + '°', color: M.eq ? 'amber' : 'violet' },
          { label: '결론', value: M.eq ? 'l ∥ m' : '평행하지 않음', color: M.eq ? 'green' : 'rose', note: M.eq ? `${k}이 같아요` : `${k}이 달라요`, wide: true }
        ],
        status: M.eq ? { tone: 'ok', text: `${k}이 같아요 → l ∥ m` } : { tone: 'warn', text: `${k}이 달라요 (${mi(M.vP)}° ≠ ${mi(M.vQ)}°)` },
        formula: '<p>① 동위각(또는 엇각)을 찾는다</p><p>② 두 각의 크기를 비교한다</p><p>③ 같으면 평행, 다르면 평행하지 않다</p>',
        rule: '동위각 또는 엇각의 크기가 같을 때만 두 직선은 평행하다',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>두 각의 합이 180°(예: 70°와 110°)이면 평행이 <b>아니에요</b>. 평행이려면 크기가 <b>같아야</b> 해요.</li><li>그림에 평행 표시(>)가 없으면 평행하다고 가정하면 안 돼요. 각으로 확인해요.</li></ul>'
      };
    },
    prob(M, s) {
      const list = M.list;
      return {
        tag: '평행 판별', stem: '다음 중 두 직선 l, m 이 평행한 것은? (그림을 눌러 크게 볼 수 있어요)', key: list.map((x) => x.kind + x.vP + x.vQ).join(','),
        choices: list.map((it) => ({ html: miniSVG(it.vP, it.vQ, it.kind), p: `${KIND(it.kind)} ${it.vP}°, ${it.vQ}°`, ok: it.ok, hint: it.hint || '', t: '' })),
        note: '표시한 두 각이 같은 그림이 평행해요.'
      };
    }
  };

  K.register({
    order: 10, id: 'parallel-angles', title: '동위각·엇각', short: '동위각·엇각',
    params: Object.assign({}, P1, P2, P3),
    scenes: [D11, D12, D13].map(makeScene)
  });
})();
