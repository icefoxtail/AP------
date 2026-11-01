/* ==========================================================================
   중1 · 평행선의 성질 — 탭 ② 「꺾인 선」 (t2.js, order 20)
   - p2-1 ㄱ자 꺾인 선: 꺾인 점 P 를 지나는 평행 보조선을 그으면 엇각 두 개가 모여 x = a + b.
   - p2-2 꺾인 점이 여러 개: 오른쪽으로 열린 각의 합 = 왼쪽으로 열린 각의 합 (꺾인 점 1~3개).
   - p2-3 보조선 직접 긋기: 손잡이를 돌려 l 에 평행한 보조선을 직접 맞춥니다(꺾인 점이 오른쪽/왼쪽).
   그림: 평행선 l(위)·m(아래) 사이에 꺾인 선(분홍). 오른쪽으로 열린 각 = 노랑, 왼쪽으로 열린 각 = 보라, 구하는 각 x = 초록.
   ========================================================================== */
(function () {
  'use strict';
  const K = window.APL_PA_KIT;
  if (!K) return;
  const { DEG, clamp, NUM, dir, at, angOf, norm, T, dot, parLine, wedge, mkChoices, makeScene, pick, rnd, mi } = K;

  const XR = 3.6, FOCUS = { x: [-3.85, 3.85], y: [-3.0, 3.0] };
  const wdeg = (d1, d2) => { let w = norm(d2 - d1); if (w > 180) w = 360 - w; return Math.round(w * 1000) / 1000; };
  const YL = -1.7, YM = 1.7; // p2-1, p2-3 의 평행선 높이
  const lines = (b, yl, ym, o = {}) => {
    parLine(b, { x: 0, y: yl }, 0, { e0: -XR, e1: XR, arrows: [-2.6, 2.3], name: 'l', nameAt: XR - 0.3 });
    parLine(b, { x: 0, y: ym }, 0, { e0: -XR, e1: XR, arrows: [-2.6, 2.3], name: 'm', nameAt: XR - 0.3 });
  };
  const dashLine = (b, p, d, color = 'muted') => b.line(p, { x: p.x + Math.cos(d * DEG), y: p.y - Math.sin(d * DEG) }, { color, width: 2.2, dash: [7, 6], alpha: 0.9 });

  /* ======================================================================
     ㄱ자 꺾인 선 (p2-1, p2-3 공용): A(l 위) – P(가운데) – B(m 위), P 는 A·B 의 오른쪽(sx=+1) 또는 왼쪽(sx=-1)
     ====================================================================== */
  function bendGeom(a, bb, px, sx) {
    const P = { x: sx * px, y: 0 };
    const A = { x: sx * (px - -YL / Math.tan(a * DEG)), y: YL }, B = { x: sx * (px - YM / Math.tan(bb * DEG)), y: YM };
    const toA = angOf(P, A), toB = angOf(P, B);
    return { P, A, B, a, b: bb, sx, x: wdeg(toA, toB), xf: a + bb, toA, toB, auxDir: sx > 0 ? 180 : 0 };
  }
  // st: { aux: 0 없음 / 1 점선만 / 2 옮긴 각까지, x: 구하는 각을 보일지, givenText: 'value'|'name', handles, tx: 'x' 또는 값 }
  function drawBend(b, G, st) {
    lines(b, YL, YM);
    const { P, A, B, sx } = G;
    b.path([A, P, B], { color: 'rose', width: 3.6 });
    dot(b, A, 'rose', 5); dot(b, B, 'rose', 5); dot(b, P, 'ink', 5.5);
    T(b, A, 'A', { dy: -17, dx: -sx * 2, size: 17 }); T(b, B, 'B', { dy: 18, size: 17 }); T(b, P, 'P', { dx: sx * 17, dy: 0, size: 17 });
    const ray = sx > 0 ? 0 : 180;
    const aT = st.givenName ? 'a=' + mi(G.a) + '°' : mi(G.a) + '°', bT = st.givenName ? 'b=' + mi(G.b) + '°' : mi(G.b) + '°';
    wedge(b, A, ray, G.toA + 180, { color: 'amber', rings: 1, text: aT, r: 26, size: 17, flip: true });
    wedge(b, B, ray, G.toB + 180, { color: 'violet', rings: 2, text: bT, r: 26, size: 17, flip: true });
    if (st.aux >= 1) dashLine(b, P, 0);
    if (st.aux >= 2) {
      wedge(b, P, G.auxDir, G.toA, { color: 'amber', rings: 1, text: mi(G.a) + '°', r: 24, size: 16 });
      wedge(b, P, G.auxDir, G.toB, { color: 'violet', rings: 2, text: mi(G.b) + '°', r: 24, size: 16 });
    }
    if (st.x) {
      const cap = st.aux >= 2;
      const txt = st.xText != null ? st.xText : cap ? 'x' : 'x=' + mi(G.xf) + '°';
      wedge(b, P, G.toA, G.toB, { color: 'green', rings: 3, r: cap ? 90 : 46, fa: 0.1, text: txt, size: 18 });
      if (cap && !st.noCap) T(b, { x: 0, y: 2.55 }, `x = a + b = ${mi(G.a)}° + ${mi(G.b)}° = ${mi(G.xf)}°`, { color: 'green', size: 17 });
    }
  }

  /* ---------------- p2-1 ---------------- */
  const PB = {
    bA: K.param({ value: 50, min: 30, max: 75, label: '∠a (점 A에서의 각)', hint: '그림의 점 A를 좌우로 끌어도 돼요', color: 'amber' }),
    bB: K.param({ value: 30, min: 30, max: 75, label: '∠b (점 B에서의 각)', hint: '그림의 점 B를 좌우로 끌어도 돼요', color: 'violet' }),
    bP: K.param({ value: 1.0, min: -0.4, max: 1.8, step: 0.05, label: '꺾인 점 P의 위치', hint: '그림의 점 P를 좌우로 끌어도 돼요', color: 'sky', format: (v) => v.toFixed(1) })
  };
  const D21 = {
    id: 'p2-1', title: 'ㄱ자로 꺾인 선', short: 'ㄱ자 꺾인 선',
    question: '평행선 l, m 사이에서 꺾인 선 A–P–B 의 꺾인 각 x 는 두 각 a, b 와 어떤 관계일까요?',
    focus: FOCUS, ctl: ['bA', 'bB', 'bP'],
    init: (s) => { s.bA = 50; s.bB = 30; s.bP = 1.0; s.bAux = 0; },
    reroll: (s) => { s.bA = pick([30, 35, 40, 45, 50, 55, 60, 65, 70], s.bA); s.bB = pick([30, 35, 40, 45, 50, 55, 60], s.bB); s.bP = pick([0.2, 0.6, 1.0, 1.4], s.bP); },
    actions: () => [{ id: 'aux', primary: true, icon: 'layers', label: (s) => (s.bAux ? '보조선 지우기' : '보조선 긋기 (P를 지나 l에 평행)'), on: (s) => !!s.bAux, run: (s) => { s.bAux = s.bAux ? 0 : 2; } }],
    model: (s) => Object.assign(bendGeom(s.bA, s.bB, s.bP, 1), { aux: s.bAux || 0 }),
    draw(b, s, M, C) {
      const G = M;
      let st = { aux: M.aux, x: true, givenName: true };
      if (C.mode === 'problem') st = { aux: 0, x: true, xText: 'x', givenName: false, xFar: 20 };
      else if (C.mode === 'review') st = { aux: C.step === 1 ? 1 : 2, x: C.step >= 3, givenName: true };
      drawBend(b, G, st);
      if (C.mode === 'explore') {
        b.handle('hA', G.A, { color: 'amber', ariaLabel: '점 A 손잡이(좌우)', drag: (w) => { s.bA = clamp(Math.round(Math.atan2(-YL, s.bP - w.x) / DEG), 30, 75); } });
        b.handle('hB', G.B, { color: 'violet', ariaLabel: '점 B 손잡이(좌우)', drag: (w) => { s.bB = clamp(Math.round(Math.atan2(YM, s.bP - w.x) / DEG), 30, 75); } });
        b.handle('hP', G.P, { color: 'sky', ariaLabel: '꺾인 점 P 손잡이(좌우)', priority: 1, drag: (w) => { s.bP = clamp(Math.round(w.x * 20) / 20, -0.4, 1.8); } });
      }
    },
    steps: (M) => [
      '꺾인 점 P를 지나고 직선 l에 평행한 보조선을 그어요. (보조선은 m과도 평행해요.)',
      `엇각의 크기는 같아요. 보조선 위에 ∠a = ${mi(M.a)}° (노랑), ∠b = ${mi(M.b)}° (보라)를 옮겨 표시해요.`,
      `∠x는 두 각을 합한 각이에요. x = a + b = ${mi(M.a)}° + ${mi(M.b)}° = ${mi(M.xf)}°`
    ],
    view(M, C, s) {
      return {
        guide: M.aux ? '보조선이 P를 지나 l, m과 <b>평행</b>하게 그어졌어요. 노랑 각과 보라 각이 점 P로 옮겨 오고, 둘이 모여 ∠x가 돼요. 점 A, B, P를 끌어 확인해 보세요.' : '<b>보조선 긋기</b>를 눌러 보세요. 점 A, B, P를 끌어도 되고, 막대로 각 a, b를 바꿔도 돼요. x는 어떻게 변할까요?',
        readouts: [
          { label: '∠a (A에서)', value: mi(M.a) + '°', color: 'amber' }, { label: '∠b (B에서)', value: mi(M.b) + '°', color: 'violet' },
          { label: '∠x = ∠a + ∠b', value: mi(M.xf) + '°', color: 'green', note: `${mi(M.a)}° + ${mi(M.b)}°`, wide: true }
        ],
        status: { tone: 'ok', text: `x = a + b = ${mi(M.xf)}°` },
        formula: '<p>l ∥ m 이고 점 P를 지나는 보조선이 l, m 에 평행하면</p><p>∠x = ∠a + ∠b  (엇각 + 엇각)</p>',
        rule: '평행선 사이에서 꺾인 각 x = (한쪽 엇각) + (다른 쪽 엇각)',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>보조선은 꺾인 점을 지나야 하고, <b>l, m 과 평행</b>해야 엇각을 쓸 수 있어요.</li><li>x 는 두 엇각을 <b>더한</b> 값이에요. 빼거나 180°에서 빼는 것은 다른 모양이에요.</li></ul>'
      };
    },
    prob(M) {
      const a = M.a, bb = M.b, x = a + bb;
      const wrongs = [
        { v: Math.abs(a - bb), hint: '두 엇각을 더해야 해요. 보조선 위에서 a와 b는 이웃한 각이에요.' },
        { v: 180 - x, hint: '180°에서 빼는 모양이 아니에요. 보조선을 그어 엇각 a, b를 모아 보세요.' },
        { v: 180 - a - bb + 10, hint: '평행선 사이의 꺾인 각은 두 엇각의 합이에요.' },
        { v: 2 * a + bb, hint: 'a를 한 번만 더해요. 엇각 a, b가 이웃해서 x가 돼요.' },
        { v: a + 2 * bb, hint: 'b를 한 번만 더해요.' }
      ];
      return { tag: '평행선 사이의 꺾인 각', stem: `그림에서 l ∥ m 일 때, ∠x의 크기는? (∠a = ${mi(a)}°, ∠b = ${mi(bb)}°)`, key: `${a}-${bb}`, choices: mkChoices(x, wrongs, { lo: 5, hi: 175 }) };
    }
  };

  /* ---------------- p2-3 보조선 직접 긋기 ---------------- */
  const PC = {
    cA: K.param({ value: 45, min: 30, max: 75, label: '∠a (점 A에서의 각)', color: 'amber' }),
    cB: K.param({ value: 35, min: 30, max: 75, label: '∠b (점 B에서의 각)', color: 'violet' }),
    cP: K.param({ value: 1.0, min: -0.4, max: 1.8, step: 0.05, label: '꺾인 점 P의 위치', color: 'sky', format: (v) => v.toFixed(1) }),
    cPsi: K.param({ value: 28, min: -40, max: 40, label: '보조선의 기울기', hint: '그림의 하늘색 점을 끌어 l과 평행하게 맞춰요(0°)', color: 'sky', format: (v) => (v === 0 ? '0° (평행)' : (v > 0 ? '+' : '−') + Math.abs(v) + '°') })
  };
  const D23 = {
    id: 'p2-3', title: '보조선을 직접 그어 보기', short: '보조선 직접 긋기',
    question: '꺾인 점 P를 지나는 보조선을 직접 맞춰 보세요. 보조선이 l과 어떤 관계일 때 엇각을 쓸 수 있을까요?',
    focus: FOCUS, ctl: ['cA', 'cB', 'cP', 'cPsi'],
    init: (s) => { s.cA = 45; s.cB = 35; s.cP = 1.0; s.cPsi = 28; s.cDir = 1; },
    reroll: (s) => { s.cA = pick([30, 35, 40, 45, 50, 55, 60, 65], s.cA); s.cB = pick([30, 35, 40, 45, 50, 55], s.cB); s.cDir = Math.random() < 0.5 ? 1 : -1; s.cP = pick([0.2, 0.6, 1.0, 1.4], s.cP); s.cPsi = 0; },
    presets: () => [
      { group: '꺾인 점 P', label: '오른쪽 ▶', apply: (s) => { s.cDir = 1; }, on: (s) => s.cDir === 1 },
      { label: '◀ 왼쪽', apply: (s) => { s.cDir = -1; }, on: (s) => s.cDir === -1 },
      { group: '보조선', label: '평행으로 맞추기', apply: (s) => { s.cPsi = 0; }, on: (s) => s.cPsi === 0 }
    ],
    model: (s) => Object.assign(bendGeom(s.cA, s.cB, s.cP, s.cDir || 1), { psi: s.cPsi, ok: s.cPsi === 0 }),
    draw(b, s, M, C) {
      const G = M;
      if (C.mode === 'problem') { drawBend(b, G, { aux: 0, x: true, xText: 'x', givenName: false, xFar: 20 }); return; }
      const st = C.mode === 'review' ? C.step : 99;
      lines(b, YL, YM);
      const { P, A, B, sx } = G;
      b.path([A, P, B], { color: 'rose', width: 3.6 });
      dot(b, A, 'rose', 5); dot(b, B, 'rose', 5); dot(b, P, 'ink', 5.5);
      T(b, A, 'A', { dy: -17, size: 17 }); T(b, B, 'B', { dy: 18, size: 17 }); T(b, P, 'P', { dx: sx * 17, size: 17 });
      const ray = sx > 0 ? 0 : 180;
      wedge(b, A, ray, G.toA + 180, { color: 'amber', rings: 1, text: 'a=' + mi(G.a) + '°', r: 26, size: 17, flip: true });
      wedge(b, B, ray, G.toB + 180, { color: 'violet', rings: 2, text: 'b=' + mi(G.b) + '°', r: 26, size: 17, flip: true });
      const psi = C.mode === 'review' ? 0 : M.psi, ok = psi === 0;
      if (C.mode === 'explore' || st >= 1) {
        dashLine(b, P, psi, ok ? 'green' : 'muted');
        if (!ok) {
          wedge(b, P, 0, psi, { color: 'rose', rings: 1, r: 34, fa: 0.2, text: mi(Math.abs(psi)) + '°', size: 16, tcolor: 'rose', noRight: true });
          T(b, { x: 0, y: 2.55 }, '보조선이 l과 평행하지 않아요 (0°가 되도록)', { color: 'rose', size: 17 });
        }
      }
      if (ok && (C.mode === 'explore' || st >= 2)) {
        wedge(b, P, G.auxDir, G.toA, { color: 'amber', rings: 1, text: mi(G.a) + '°', r: 24, size: 16 });
        wedge(b, P, G.auxDir, G.toB, { color: 'violet', rings: 2, text: mi(G.b) + '°', r: 24, size: 16 });
      }
      if (ok && (C.mode === 'explore' || st >= 3)) { wedge(b, P, G.toA, G.toB, { color: 'green', rings: 3, r: 90, fa: 0.1, text: 'x', size: 19 }); T(b, { x: 0, y: 2.55 }, `x = a + b = ${mi(G.a)}° + ${mi(G.b)}° = ${mi(G.xf)}°`, { color: 'green', size: 17 }); }
      if (C.mode === 'explore') {
        const base = sx > 0 ? 0 : 180, H = at(P, base + psi, 2.2);
        b.handle('hAux', H, { color: 'sky', ariaLabel: '보조선 손잡이(돌리기)', priority: 2, drag: (w) => {
          let r = angOf(P, w) - base; r = ((r + 540) % 360) - 180;
          if (r > 90) r -= 180; if (r < -90) r += 180;
          let v = Math.round(r);
          if (Math.abs(v) <= 3) v = 0;
          s.cPsi = clamp(v, -40, 40);
        } });
        b.handle('hA', A, { color: 'amber', ariaLabel: '점 A 손잡이(좌우)', drag: (w) => { s.cA = clamp(Math.round(Math.atan2(-YL, s.cP - sx * w.x) / DEG), 30, 75); } });
        b.handle('hB', B, { color: 'violet', ariaLabel: '점 B 손잡이(좌우)', drag: (w) => { s.cB = clamp(Math.round(Math.atan2(YM, s.cP - sx * w.x) / DEG), 30, 75); } });
      }
    },
    steps: (M) => [
      '꺾인 점 P를 지나고 l에 평행한 보조선을 그어요. 보조선의 기울기가 0°가 되어야 평행이에요.',
      `보조선이 평행이면 엇각이 같아요. 보조선 쪽으로 ∠a = ${mi(M.a)}°, ∠b = ${mi(M.b)}°를 옮겨 표시해요.`,
      `∠x = ∠a + ∠b = ${mi(M.a)}° + ${mi(M.b)}° = ${mi(M.xf)}°`
    ],
    view(M, C, s) {
      return {
        guide: M.ok ? '보조선이 l, m 과 <b>평행</b>해졌어요! 이제 엇각이 같아서 노랑·보라 각이 점 P로 옮겨 와 ∠x = a + b가 돼요.' : '<b>하늘색 점</b>을 끌어 보조선을 돌려 보세요. 보조선이 직선 l 과 <b>평행(0°)</b>이 되어야 엇각을 쓸 수 있어요. 꺾인 점이 ◀ 왼쪽이어도 같아요.',
        readouts: [
          { label: '보조선의 기울기', value: M.ok ? '0° (평행)' : mi(Math.abs(M.psi)) + '°', color: M.ok ? 'green' : 'rose', note: M.ok ? 'l, m과 평행' : '아직 평행이 아니에요' },
          { label: '∠x', value: M.ok ? mi(M.xf) + '°' : '평행하게 맞추면 보여요', color: 'green', note: M.ok ? `${mi(M.a)}° + ${mi(M.b)}°` : '' }
        ],
        status: M.ok ? { tone: 'ok', text: `보조선 ∥ l → x = a + b = ${mi(M.xf)}°` } : { tone: 'warn', text: `보조선이 ${mi(Math.abs(M.psi))}° 기울어 있어요` },
        formula: '<p>① 꺾인 점 P를 지나고 l에 평행한 보조선을 긋는다</p><p>② 엇각의 크기는 같다 → a, b를 P로 옮긴다</p><p>③ ∠x = ∠a + ∠b</p>',
        rule: '꺾인 점을 지나는 평행 보조선 → 엇각 → x = a + b',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>보조선이 조금이라도 기울어 있으면 엇각이 같지 않아요. 평행임을 꼭 확인해요.</li><li>꺾인 점이 왼쪽이든 오른쪽이든 풀이 방법은 똑같아요.</li></ul>'
      };
    },
    prob(M) {
      const a = M.a, bb = M.b, x = a + bb;
      const wrongs = [
        { v: Math.abs(a - bb), hint: '보조선을 그으면 엇각 a, b가 이웃하게 모여요. 더해야 해요.' },
        { v: 180 - x, hint: '180°에서 빼지 않아요. x는 엇각 a와 b를 합한 각이에요.' },
        { v: 2 * a + bb, hint: 'a는 한 번만 더해요.' },
        { v: a + 2 * bb, hint: 'b는 한 번만 더해요.' }
      ];
      return { tag: '서술형 · 5지선다로 확인', stem: `그림에서 l ∥ m 일 때, 점 P를 지나는 보조선을 그어 ∠x의 크기를 구하시오. (∠a = ${mi(a)}°, ∠b = ${mi(bb)}°)`, key: `${a}-${bb}-${M.sx}`, choices: mkChoices(x, wrongs, { lo: 5, hi: 175 }) };
    }
  };

  /* ======================================================================
     p2-2 꺾인 점이 여러 개: 오른쪽으로 열린 각의 합 = 왼쪽으로 열린 각의 합
     ====================================================================== */
  const ZY0 = -1.9, ZY1 = 1.9;
  const UKEYS = ['uA', 'uB', 'uC', 'uD'];
  const ZNAME = ['A', 'P', 'Q', 'R', 'B'];
  function zigGeom(k, u) {
    const h = (ZY1 - ZY0) / (k + 1);
    const V = [{ x: 0, y: ZY0 }];
    for (let j = 0; j <= k; j++) { const dx = (j % 2 === 0 ? 1 : -1) * h / Math.tan(u[j] * DEG); V.push({ x: V[j].x + dx, y: ZY0 + (j + 1) * h }); }
    const xs = V.map((p) => p.x), sh = -(Math.min(...xs) + Math.max(...xs)) / 2;
    V.forEach((p) => { p.x += sh; });
    const W = [];
    W.push({ i: 0, V: V[0], d1: 0, d2: angOf(V[0], V[1]), side: 'R' });
    for (let i = 1; i <= k; i++) W.push({ i, V: V[i], d1: angOf(V[i], V[i - 1]), d2: angOf(V[i], V[i + 1]), side: i % 2 === 1 ? 'L' : 'R' });
    const rayB = k % 2 === 1 ? 0 : 180;
    W.push({ i: k + 1, V: V[k + 1], d1: rayB, d2: angOf(V[k + 1], V[k]), side: k % 2 === 1 ? 'R' : 'L' });
    W.forEach((w) => { w.val = wdeg(w.d1, w.d2); w.name = ZNAME[w.i === k + 1 ? 4 : w.i]; w.hv = w.i === 0 || w.i === k + 1; });
    const R = W.filter((w) => w.side === 'R'), L = W.filter((w) => w.side === 'L');
    const sum = (arr) => Math.round(arr.reduce((a, w) => a + w.val, 0) * 1000) / 1000;
    return { k, u, V, W, R, L, sumR: sum(R), sumL: sum(L), h };
  }
  const PZ = {
    kK: K.param({ value: 2, min: 1, max: 3, label: '꺾인 점의 개수', color: 'rose', format: (v) => v + '개' }),
    uA: K.param({ value: 55, min: 30, max: 80, label: '선분 ①이 평행선과 이루는 각', hint: '아래쪽(또는 위쪽) 평행선과 이루는 뾰족한 각이에요', color: 'amber' }),
    uB: K.param({ value: 40, min: 30, max: 80, label: '선분 ②가 평행선과 이루는 각', color: 'violet' }),
    uC: K.param({ value: 60, min: 30, max: 80, label: '선분 ③이 평행선과 이루는 각', color: 'amber' }),
    uD: K.param({ value: 45, min: 30, max: 80, label: '선분 ④가 평행선과 이루는 각', color: 'violet' })
  };
  const D22 = {
    id: 'p2-2', title: '꺾인 점이 여러 개일 때', short: '꺾인 점 여러 개',
    question: '평행선 사이에서 선이 여러 번 꺾였어요. 오른쪽으로 열린 각과 왼쪽으로 열린 각 사이에는 어떤 관계가 있을까요?',
    focus: { x: [-3.85, 3.85], y: [-3.95, 4.0] },
    ctl: (s) => ['kK'].concat(UKEYS.slice(0, (s.kK || 2) + 1)),
    init: (s) => { s.kK = 2; s.uA = 55; s.uB = 40; s.uC = 60; s.uD = 45; s.zAux = 0; s.zTar = 1; },
    reroll: (s) => {
      s.kK = pick([2, 3, 1], s.kK);
      UKEYS.forEach((key) => { s[key] = pick([30, 35, 40, 45, 50, 55, 60, 65, 70], s[key]); });
      s.zTar = Math.floor(Math.random() * (s.kK + 2));
    },
    actions: () => [{ id: 'aux', primary: true, icon: 'layers', label: (s) => (s.zAux ? '보조선 지우기' : '꺾인 점마다 보조선 긋기'), on: (s) => !!s.zAux, run: (s) => { s.zAux = s.zAux ? 0 : 1; } }],
    model: (s) => {
      const k = clamp(Math.round(s.kK || 2), 1, 3), u = UKEYS.slice(0, k + 1).map((key) => s[key]);
      const G = zigGeom(k, u);
      G.tar = clamp(s.zTar == null ? 1 : s.zTar, 0, k + 1); G.aux = s.zAux || 0;
      return G;
    },
    draw(b, s, M, C) {
      const G = M, k = G.k, mode = C.mode, st = mode === 'review' ? C.step : 99;
      lines(b, ZY0, ZY1);
      b.path(G.V, { color: 'rose', width: 3.6 });
      G.V.forEach((p, i) => { dot(b, p, i === 0 || i === k + 1 ? 'rose' : 'ink', 5); });
      G.V.forEach((p, i) => { const nm = ZNAME[i === k + 1 ? 4 : i]; T(b, p, nm, { dy: i === 0 ? -17 : i === k + 1 ? 18 : 0, dx: i === 0 || i === k + 1 ? 0 : (i % 2 === 1 ? 17 : -17), size: 16 }); });
      // 보조선(꺾인 점마다 평행선)
      const auxOn = mode === 'explore' ? G.aux : (mode === 'review' && st >= 1);
      if (auxOn) for (let i = 1; i <= k; i++) dashLine(b, G.V[i], 0);
      // 엇각으로 옮긴 각 u: 각 선분의 아래쪽 끝에
      const showU = mode === 'explore' ? G.aux : (mode === 'review' && st >= 2 && st < 3);
      if (showU) for (let j = 0; j < k; j++) {
        const Vj = G.V[j + 1], ray = j % 2 === 0 ? 180 : 0;
        wedge(b, Vj, ray, angOf(Vj, G.V[j]), { color: j % 2 === 0 ? 'amber' : 'violet', rings: j % 2 === 0 ? 1 : 2, text: mi(G.u[j]) + '°', r: 19, size: 14, fa: 0.2 });
      }
      // 각 부채꼴
      const showW = mode !== 'review' || st >= 3 || (st === 2);
      G.W.forEach((w) => {
        if (mode === 'review' && st < 2 && !w.hv) return;
        const isTar = mode === 'problem' && w.i === G.tar;
        const col = isTar ? 'green' : w.side === 'R' ? 'amber' : 'violet';
        let text = mi(w.val) + '°';
        if (isTar) text = 'x';
        if (mode === 'review' && st === 2 && !w.hv) return;
        wedge(b, w.V, w.d1, w.d2, { color: col, rings: isTar ? 3 : w.side === 'R' ? 1 : 2, text, r: 25, size: isTar ? 19 : 16, fa: 0.24, flip: w.hv });
      });
      if (mode === 'explore') {
        const setU = (j, v) => { s[UKEYS[j]] = clamp(Math.round(v), 30, 80); };
        b.handle('hEndA', G.V[0], { color: 'amber', ariaLabel: '선분 ①의 위쪽 끝 손잡이(좌우)', drag: (w) => setU(0, Math.atan2(G.h, G.V[1].x - w.x) / DEG) });
        const sg = k % 2 === 0 ? 1 : -1;
        b.handle('hEndB', G.V[k + 1], { color: 'violet', ariaLabel: '마지막 선분의 아래쪽 끝 손잡이(좌우)', drag: (w) => setU(k, Math.atan2(G.h, sg * (w.x - G.V[k].x)) / DEG) });
      }
      if (!showW) return;
      // 합
      if (mode !== 'problem' && (mode === 'explore' || st >= 3)) {
        const t = (arr) => arr.map((w) => mi(w.val)).join(' + ') + ' = ' + mi(Math.round(arr.reduce((a, w) => a + w.val, 0) * 10) / 10) + '°';
        T(b, { x: 0, y: 3.05 }, '오른쪽으로 열린 각: ' + t(G.R), { color: 'amber', size: 16 });
        T(b, { x: 0, y: 3.6 }, '왼쪽으로 열린 각: ' + t(G.L), { color: 'violet', size: 16 });
      }
    },
    steps: (M) => {
      const R = M.R, L = M.L, t = (arr) => arr.map((w) => mi(w.val) + '°').join(' + ');
      return [
        `꺾인 점마다 l, m에 평행한 보조선을 그어요. (꺾인 점이 ${M.k}개이므로 보조선 ${M.k}개)`,
        `엇각의 크기는 같아요. 각 선분이 평행선과 이루는 각을 옮겨 표시해요: ${M.u.map((v, i) => NUM[i] + ' ' + mi(v) + '°').join(', ')}`,
        `꺾인 각은 이웃한 두 선분의 각의 합이에요. 오른쪽으로 열린 각의 합 ${t(R)} = ${mi(M.sumR)}°, 왼쪽으로 열린 각의 합 ${t(L)} = ${mi(M.sumL)}° 로 서로 같아요.`
      ];
    },
    view(M, C, s) {
      return {
        guide: `막대로 꺾인 점의 개수와 각 선분의 기울기를 바꿔 보세요. <b>노랑</b>은 오른쪽으로 열린 각, <b>보라</b>는 왼쪽으로 열린 각이에요. 두 합을 비교해 보세요. <b>보조선 긋기</b>를 누르면 이유가 보여요.`,
        readouts: [
          { label: '오른쪽으로 열린 각의 합', value: mi(M.sumR) + '°', color: 'amber', note: M.R.map((w) => mi(w.val)).join(' + ') },
          { label: '왼쪽으로 열린 각의 합', value: mi(M.sumL) + '°', color: 'violet', note: M.L.map((w) => mi(w.val)).join(' + ') },
          { label: '두 합', value: M.sumR === M.sumL ? '항상 같아요' : '다름', color: 'green', wide: true }
        ],
        status: { tone: 'ok', text: `오른쪽 합 ${mi(M.sumR)}° = 왼쪽 합 ${mi(M.sumL)}°` },
        formula: '<p>l ∥ m 이고 꺾인 점이 여러 개일 때</p><p>(오른쪽으로 열린 각의 합) = (왼쪽으로 열린 각의 합)</p>',
        rule: '오른쪽으로 열린 각의 합 = 왼쪽으로 열린 각의 합',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>평행선 위의 두 끝점(A, B)에서의 각도 열린 방향대로 <b>합에 넣어요</b>.</li><li>꺾인 점이 늘어도 보조선만 더 그으면 같은 방법이에요.</li></ul>'
      };
    },
    prob(M) {
      const tar = M.W[M.tar], same = M.W.filter((w) => w.side === tar.side && w !== tar), opp = M.W.filter((w) => w.side !== tar.side);
      const sOpp = Math.round(opp.reduce((a, w) => a + w.val, 0)), sSame = Math.round(same.reduce((a, w) => a + w.val, 0));
      const x = tar.val;
      const all = M.W.filter((w) => w !== tar).reduce((a, w) => a + w.val, 0);
      const wrongs = [
        { v: sOpp, hint: '반대쪽 각의 합과 같은 쪽의 다른 각들의 합을 빼야 해요.' },
        { v: Math.round(all), hint: '모든 각을 더하지 않아요. 같은 쪽의 합 = 반대쪽의 합으로 식을 세워요.' },
        { v: Math.round(sOpp + sSame), hint: '같은 쪽 각은 더하지 않고 반대쪽 합에서 빼야 해요.' },
        { v: 180 - x, hint: '180°에서 빼는 문제가 아니에요.' }
      ];
      return { tag: '꺾인 점이 여러 개', stem: 'l ∥ m 일 때, ∠x의 크기는?', key: `${M.k}${M.u.join('')}${M.tar}`, choices: mkChoices(x, wrongs, { lo: 5, hi: 175 }) };
    }
  };

  K.register({
    order: 20, id: 'parallel-bent', title: '꺾인 선', short: '꺾인 선',
    params: Object.assign({}, PB, PC, PZ),
    scenes: [D21, D22, D23].map(makeScene)
  });
})();
