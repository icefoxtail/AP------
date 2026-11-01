/* ==========================================================================
   중1 · 평행선의 성질 — 탭 ③ 「정다각형 결합」 (t3.js, order 30)
   - p3-1 평행선 사이의 정삼각형: 꼭짓점 B 는 l 위, C 는 m 위, 정삼각형의 한 각 60° = a + b.
   - p3-2 정다각형의 꼭짓점 하나가 꺾인 점: 정사각형·정오각형·정육각형(n 칩) — 내각 I = a + b (90°·108°·120°).
   - p3-3 정다각형의 연속한 두 꼭짓점이 꺾인 점: 보조선 2개로 a + b + 180° = I + I.
   그림 좌표: 평행선 l(위)·m(아래) 높이 YL·YM. 정다각형은 한 꼭짓점 A 가 l 위, 방향은 A→B 가 l 과 a 를 이루도록 놓고,
   그 크기는 l, m 사이 간격에 맞춰 정해집니다. 각은 노랑 a · 보라 b · 정다각형의 내각(알려진 값)과 합 = 초록.
   ========================================================================== */
(function () {
  'use strict';
  const K = window.APL_PA_KIT;
  if (!K) return;
  const { DEG, clamp, dir, at, angOf, norm, T, dot, parLine, wedge, ticks, mkChoices, makeScene, pick, mi } = K;

  const XR = 3.6, YL = -1.7, YM = 1.7, H = YM - YL;
  const FOCUS = { x: [-3.85, 3.85], y: [-3.0, 3.0] };
  const wdeg = (d1, d2) => { let w = norm(d2 - d1); if (w > 180) w = 360 - w; return Math.round(w * 1000) / 1000; };
  const lines = (b) => {
    parLine(b, { x: 0, y: YL }, 0, { e0: -XR, e1: XR, arrows: [-2.6, 2.3], name: 'l', nameAt: XR - 0.3 });
    parLine(b, { x: 0, y: YM }, 0, { e0: -XR, e1: XR, arrows: [-2.6, 2.3], name: 'm', nameAt: XR - 0.3 });
  };
  const dashAt = (b, p, color = 'muted') => b.line(p, { x: p.x + 1, y: p.y }, { color, width: 2.2, dash: [7, 6], alpha: 0.9 });
  const LET = 'ABCDEFGH';
  const POLY = { 4: '정사각형', 5: '정오각형', 6: '정육각형', 8: '정팔각형', 3: '정삼각형' };
  const interior = (n) => 180 - 360 / n;

  /* ======================================================================
     p3-1 평행선 사이의 정삼각형: B 는 l 위, C 는 m 위, A 는 두 선 사이
     ====================================================================== */
  function triGeom(a, bx) {
    const psi = a + 60; // BC 가 l 과 이루는 각(아래쪽)
    const B = { x: bx, y: YL }, C = { x: bx + H / Math.tan(psi * DEG), y: YM };
    const len = H / Math.sin(psi * DEG);
    const A = { x: bx + len * Math.cos((60 - psi) * DEG), y: YL - len * Math.sin((60 - psi) * DEG) };
    const aw = wdeg(0, angOf(B, A)), bw = wdeg(0, angOf(C, A));
    const aA = angOf(A, B), cA = angOf(A, C);
    return { a, b: 60 - a, B, C, A, psi, aw, bw, ang: wdeg(aA, cA) };
  }
  const T1 = {
    tA: K.param({ value: 30, min: 10, max: 50, label: '∠a (점 B에서의 각)', hint: '정삼각형을 기울여 봐요. 그림의 점 C를 좌우로 끌어도 돼요', color: 'amber' }),
    tX: K.param({ value: -1.0, min: -2.2, max: 0.6, step: 0.05, label: '정삼각형의 위치', hint: '그림의 점 B를 좌우로 끌어도 돼요', color: 'sky', format: (v) => v.toFixed(1) })
  };
  const D31 = {
    id: 'p3-1', title: '평행선 사이의 정삼각형', short: '정삼각형',
    question: '정삼각형의 꼭짓점 B는 직선 l 위에, 꼭짓점 C는 직선 m 위에 있어요. 정삼각형의 한 각 60°는 a, b와 어떤 관계일까요?',
    focus: FOCUS, ctl: ['tA', 'tX'],
    init: (s) => { s.tA = 30; s.tX = -1.0; s.tAux = 0; },
    reroll: (s) => { s.tA = pick([12, 16, 20, 24, 28, 32, 36, 40, 44], s.tA); s.tX = pick([-1.8, -1.0, -0.4, 0.2], s.tX); },
    actions: () => [{ id: 'aux', primary: true, icon: 'layers', label: (s) => (s.tAux ? '보조선 지우기' : '보조선 긋기 (A를 지나 l에 평행)'), on: (s) => !!s.tAux, run: (s) => { s.tAux = s.tAux ? 0 : 1; } }],
    model: (s) => Object.assign(triGeom(s.tA, s.tX), { aux: s.tAux || 0 }),
    draw(b, s, M, C) {
      const G = M, { A, B, C: Cc } = G, st = C.mode === 'review' ? C.step : 99, prob = C.mode === 'problem';
      lines(b);
      b.path([A, B, Cc], { close: true, fill: 'amber', fillAlpha: 0.1, color: 'rose', width: 3.6 });
      ticks(b, A, B, 1, 'rose'); ticks(b, B, Cc, 1, 'rose'); ticks(b, Cc, A, 1, 'rose');
      dot(b, B, 'rose', 5); dot(b, Cc, 'rose', 5); dot(b, A, 'ink', 5.5);
      T(b, B, 'B', { dy: -17, size: 17 }); T(b, Cc, 'C', { dy: 18, size: 17 }); T(b, A, 'A', { dx: 18, size: 17 });
      // B, C 에서의 각 a, b
      const aT = prob ? G.a + '°' : 'a=' + G.a + '°';
      wedge(b, B, 0, angOf(B, A), { color: 'amber', rings: 1, text: aT, r: 26, size: 17, flip: true });
      wedge(b, Cc, 0, angOf(Cc, A), { color: prob ? 'green' : 'violet', rings: 2, text: prob ? 'x' : 'b=' + G.b + '°', r: 26, size: prob ? 20 : 17, flip: true });
      // A 에서: 보조선과 옮긴 각, 60°
      const auxOn = prob ? false : C.mode === 'review' ? st >= 1 : G.aux;
      if (auxOn) dashAt(b, A);
      if (!prob && (C.mode === 'review' ? st >= 2 : G.aux)) {
        wedge(b, A, 180, angOf(A, B), { color: 'amber', rings: 1, text: G.a + '°', r: 22, size: 15 });
        wedge(b, A, 180, angOf(A, Cc), { color: 'violet', rings: 2, text: G.b + '°', r: 22, size: 15 });
      }
      const auxCopies = !prob && (C.mode === 'review' ? st >= 2 : G.aux);
      const show60 = prob || C.mode === 'explore' || st !== 2;
      if (show60 && (prob || C.mode !== 'review' || st >= 1)) wedge(b, A, angOf(A, B), angOf(A, Cc), { color: prob ? 'ink' : 'green', rings: 3, text: '60°', r: auxCopies ? 90 : 46, fa: 0.1, size: 18, tcolor: prob ? 'ink' : 'green' });
      if (!prob && (C.mode === 'review' ? st >= 3 : G.aux)) T(b, { x: 0, y: 2.55 }, `60° = a + b = ${G.a}° + ${G.b}°`, { color: 'green', size: 17 });
      if (C.mode === 'explore') {
        b.handle('hB', B, { color: 'sky', ariaLabel: '점 B 손잡이(정삼각형을 좌우로)', priority: 1, drag: (w) => { s.tX = clamp(Math.round(w.x * 20) / 20, -2.2, 0.6); } });
        b.handle('hC', Cc, { color: 'amber', ariaLabel: '점 C 손잡이(기울이기)', drag: (w) => { const dx = w.x - s.tX; s.tA = clamp(Math.round(Math.atan2(H, dx) / DEG) - 60, 10, 50); } });
      }
    },
    steps: (M) => [
      '정삼각형의 한 내각은 60°예요. 그래서 ∠BAC = 60°예요.',
      `꼭짓점 A를 지나고 l에 평행한 보조선을 그어요. 엇각이 같으므로 ∠a = ${M.a}°, ∠b = ${M.b}°를 점 A로 옮겨 표시해요.`,
      `60° = ∠a + ∠b 이므로 ∠b = 60° − ${M.a}° = ${M.b}°`
    ],
    view(M, C, s) {
      return {
        guide: M.aux ? '보조선을 그었어요. 점 B와 C의 각 a, b가 엇각이라서 점 A로 옮겨져요. 두 각이 모여 정삼각형의 60°가 돼요.' : '막대나 <b>점 C</b>로 정삼각형을 기울이고, <b>점 B</b>로 가로로 밀어 보세요. 각 a가 커지면 각 b는 어떻게 될까요? <b>보조선 긋기</b>를 눌러 이유를 확인해요.',
        readouts: [
          { label: '∠a (B에서)', value: M.a + '°', color: 'amber' }, { label: '∠b (C에서)', value: M.b + '°', color: 'violet' },
          { label: '∠a + ∠b', value: (M.a + M.b) + '°', color: 'green', note: '정삼각형의 한 각 60°', wide: true }
        ],
        status: { tone: 'ok', text: `a + b = ${M.a}° + ${M.b}° = 60°` },
        formula: '<p>정삼각형 한 내각 = 60°</p><p>평행 보조선을 그으면 ∠a + ∠b = 60°</p><p>∠b = 60° − ∠a</p>',
        rule: '평행선 사이의 정삼각형: (한쪽 엇각) + (다른 쪽 엇각) = 60°',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>정삼각형의 세 각은 모두 60°예요. 평행선 사이에서도 마찬가지예요.</li><li>a, b가 <b>꼭짓점 A 쪽에서 합쳐져</b> 60°가 돼요. 180°에서 빼지 않아요.</li></ul>'
      };
    },
    prob(M) {
      const a = M.a, x = 60 - a;
      const wrongs = [
        { v: 120 - a, hint: '180°에서 60°를 빼는 방식이 아니에요. a + b = 60°예요.' },
        { v: 60 + a, hint: '60°에 더하는 것이 아니라, 60°에서 a를 빼요.' },
        { v: 90 - a, hint: '정삼각형의 한 각은 90°가 아니라 60°예요.' },
        { v: a, hint: '두 각이 같다고 할 수 없어요. 합이 60°예요.' },
        { v: 180 - a, hint: '평각 180°가 아니라 정삼각형의 한 각 60°를 써요.' }
      ];
      return { tag: '평행선과 정삼각형', stem: `그림에서 l ∥ m 이고 삼각형 ABC가 정삼각형일 때, ∠x의 크기는? (노란 각은 ${a}°)`, key: `${a}`, choices: mkChoices(x, wrongs, { lo: 5, hi: 175 }) };
    }
  };

  /* ======================================================================
     정다각형 사슬: A(l 위) → B → (C →) 끝점(m 위). 방향각은 화면 기준(오른쪽 0°, 아래쪽으로 +, 시계 방향).
     ====================================================================== */
  const sd = (p) => ({ x: Math.cos(p * DEG), y: Math.sin(p * DEG) });
  function chain(n, a, k) {
    const E = 360 / n, I = 180 - E;
    const phis = []; for (let j = 0; j <= k; j++) phis.push(a + j * E);
    const sum = phis.reduce((t, p) => t + Math.sin(p * DEG), 0), side = H / sum;
    const V = [{ x: 0, y: YL }];
    for (let j = 0; j < n - 1; j++) { const d = sd(a + j * E); V.push({ x: V[j].x + side * d.x, y: V[j].y + side * d.y }); }
    const xs = V.map((p) => p.x), sh = -(Math.min(...xs) + Math.max(...xs)) / 2;
    V.forEach((p) => { p.x += sh; });
    const end = k + 1, last = V[end];
    const cx = V.reduce((t, p) => t + p.x, 0) / n, cy = V.reduce((t, p) => t + p.y, 0) / n;
    const bw = wdeg(0, angOf(last, V[end - 1]));
    return { n, k, a, b: k === 1 ? I - a : 2 * I - 180 - a, bw, I, E, V, side, end, c: { x: cx, y: cy }, aw: wdeg(0, angOf(V[0], V[1])), sumOK: Math.abs(last.y - YM) < 1e-6 };
  }
  const aFrom = (n, k, t) => { const I = interior(n), lo = 6, hi = (k === 1 ? I : 2 * I - 180) - 6; return Math.round(lo + (clamp(t, 0, 100) / 100) * (hi - lo)); };
  function drawPoly(b, G, o = {}) {
    const { V, n, k, c } = G;
    b.path(V, { close: true, fill: 'amber', fillAlpha: 0.08, color: 'ink', width: 2, alpha: 0.5 });
    b.path(V.slice(0, G.end + 1), { color: 'rose', width: 3.8 });
    for (let i = 0; i < n; i++) ticks(b, V[i], V[(i + 1) % n], 1, 'rose');
    V.forEach((p, i) => {
      dot(b, p, i === 0 || i === G.end ? 'rose' : 'ink', i === 0 || i === G.end ? 5 : 4.5);
      const ux = p.x - c.x, uy = p.y - c.y, l = Math.hypot(ux, uy) || 1;
      T(b, p, LET[i], { dx: (ux / l) * 19, dy: (uy / l) * 19, size: 16 });
    });
  }
  // 정다각형 기울이기 손잡이: 꼭짓점 B 를 끌면 A→B 방향(= ∠a)이 바뀝니다.
  function tiltHandle(b, s, G, key) {
    const lo = 6, hi = (G.k === 1 ? G.I : 2 * G.I - 180) - 6;
    b.handle('hB', G.V[1], { color: 'amber', ariaLabel: '정다각형 기울이기 손잡이(꼭짓점 B)', drag: (w) => {
      const A = G.V[0], a = clamp(Math.round(Math.atan2(w.y - A.y, w.x - A.x) / DEG), lo, hi);
      s[key] = ((a - lo) / (hi - lo)) * 100;
    } });
  }
  const TP = {
    gN: K.param({ value: 5, min: 4, max: 6, label: '정다각형의 변의 수 n', color: 'sky', format: (v) => POLY[v] || v + '각형' }),
    gT: K.param({ value: 40, min: 0, max: 100, label: '정다각형의 기울기 (∠a의 크기)', hint: '정다각형을 돌리면 a와 b가 함께 변해요', color: 'amber', format: (v, s) => '∠a = ' + aFrom(s.gN || 5, 1, v) + '°' }),
    hN: K.param({ value: 6, min: 5, max: 8, step: 1, label: '정다각형의 변의 수 n', color: 'sky', format: (v) => POLY[v] || v + '각형' }),
    hT: K.param({ value: 40, min: 0, max: 100, label: '정다각형의 기울기 (∠a의 크기)', hint: '정다각형을 돌리면 a와 b가 함께 변해요', color: 'amber', format: (v, s) => '∠a = ' + aFrom(s.hN || 6, 2, v) + '°' })
  };
  const nOK = (n, list) => (list.includes(n) ? n : list[0]);

  /* ---------------- p3-2 꼭짓점 하나가 꺾인 점 ---------------- */
  const D32 = {
    id: 'p3-2', title: '정다각형의 꼭짓점이 꺾인 점', short: '정다각형 꼭짓점 하나',
    question: '정다각형의 꼭짓점 A는 l 위에, 꼭짓점 C는 m 위에 있어요. 정다각형의 내각 ∠ABC는 a, b와 어떤 관계일까요?',
    focus: { x: [-3.85, 3.85], y: [-3.15, 3.4] },
    ctl: ['gN', 'gT'],
    presets: () => [4, 5, 6].map((n, i) => ({ group: i === 0 ? '정다각형' : '', label: POLY[n], apply: (s) => { s.gN = n; }, on: (s) => s.gN === n })),
    actions: () => [{ id: 'aux', primary: true, icon: 'layers', label: (s) => (s.gAux ? '보조선 지우기' : '보조선 긋기 (B를 지나 l에 평행)'), on: (s) => !!s.gAux, run: (s) => { s.gAux = s.gAux ? 0 : 1; } }],
    init: (s) => { s.gN = 5; s.gT = 40; s.gAux = 0; },
    reroll: (s) => { s.gN = pick([4, 5, 6], s.gN); s.gT = pick([15, 30, 45, 60, 75], s.gT); },
    model: (s) => { const n = nOK(Math.round(s.gN), [4, 5, 6]), a = aFrom(n, 1, s.gT); return Object.assign(chain(n, a, 1), { aux: s.gAux || 0 }); },
    draw(b, s, M, C) {
      const G = M, prob = C.mode === 'problem', st = C.mode === 'review' ? C.step : 99;
      lines(b);
      drawPoly(b, G);
      const [A, B, Cc] = G.V;
      wedge(b, A, 0, angOf(A, B), { color: 'amber', rings: 1, text: prob ? G.a + '°' : 'a=' + G.a + '°', r: 26, size: 17, flip: true });
      wedge(b, Cc, 0, angOf(Cc, B), { color: prob ? 'green' : 'violet', rings: 2, text: prob ? 'x' : 'b=' + G.b + '°', r: 26, size: prob ? 20 : 17, flip: true });
      const auxOn = prob ? false : C.mode === 'review' ? st >= 1 : G.aux;
      if (auxOn) dashAt(b, B);
      if (!prob && (C.mode === 'review' ? st >= 2 : G.aux)) {
        wedge(b, B, 180, angOf(B, A), { color: 'amber', rings: 1, text: G.a + '°', r: 22, size: 15 });
        wedge(b, B, 180, angOf(B, Cc), { color: 'violet', rings: 2, text: G.b + '°', r: 22, size: 15 });
      }
      const copies = !prob && (C.mode === 'review' ? st >= 2 : G.aux);
      if (prob || C.mode === 'explore' || st === 1 || st >= 3) wedge(b, B, angOf(B, A), angOf(B, Cc), { color: prob ? 'ink' : 'green', rings: 3, text: copies ? '' : (prob ? '' : '∠B=') + G.I + '°', r: copies ? 90 : 44, fa: 0.1, size: 17, tcolor: prob ? 'ink' : 'green' });
      if (!prob && (C.mode === 'review' ? st >= 3 : G.aux)) T(b, { x: 0, y: 3.05 }, `∠B = ${G.I}° = a + b = ${G.a}° + ${G.b}°`, { color: 'green', size: 17 });
      if (C.mode === 'explore') tiltHandle(b, s, G, 'gT');
    },
    steps: (M) => [
      `${POLY[M.n]}의 한 내각은 ${M.I}°예요. 그래서 ∠ABC = ${M.I}°예요.`,
      `꼭짓점 B를 지나고 l에 평행한 보조선을 그어요. 엇각이 같으므로 ∠a = ${M.a}°, ∠b = ${M.b}°를 점 B로 옮겨 표시해요.`,
      `${M.I}° = ∠a + ∠b 이므로 ∠b = ${M.I}° − ${M.a}° = ${M.b}°`
    ],
    view(M, C, s) {
      return {
        guide: `<b>${POLY[M.n]}</b>의 꼭짓점 A는 l 위, C는 m 위에 있어요. 막대로 변의 수와 기울기를 바꿔 보세요. 내각 ∠B = <b>${M.I}°</b>가 a와 b로 나뉘는 것이 보이나요? 보조선 긋기를 눌러 확인해요.`,
        readouts: [
          { label: `${POLY[M.n]}의 한 내각`, value: M.I + '°', color: 'green', note: `(${M.n}−2)×180°÷${M.n}` },
          { label: '∠a (A에서)', value: M.a + '°', color: 'amber' }, { label: '∠b (C에서)', value: M.b + '°', color: 'violet' },
          { label: '∠a + ∠b', value: (M.a + M.b) + '°', color: 'green', wide: true }
        ],
        status: { tone: 'ok', text: `a + b = ${M.a}° + ${M.b}° = ${M.I}°` },
        formula: `<p>${POLY[M.n]}의 한 내각 = ${M.I}°</p><p>평행 보조선을 그으면 ∠a + ∠b = ${M.I}°</p>`,
        rule: '정다각형의 한 내각 = (한쪽 엇각) + (다른 쪽 엇각)',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>정n각형의 한 내각은 (n−2)×180° ÷ n 이에요. 정사각형 90°, 정오각형 108°, 정육각형 120°.</li><li>보조선을 그을 때는 꺾인 점 <b>B</b>를 지나게 해요. 다른 꼭짓점을 지나는 것이 아니에요.</li></ul>'
      };
    },
    prob(M) {
      const a = M.a, I = M.I, x = I - a;
      const wrongs = [
        { v: 180 - a, hint: '평각 180°가 아니라 정다각형의 한 내각을 써요.' },
        { v: I + a, hint: '내각 ' + I + '°에서 a를 빼야 해요. 더하지 않아요.' },
        { v: 180 - I - a + 10, hint: '내각이 a와 b로 나뉘어요. b = 내각 − a 예요.' },
        { v: 360 - I - a, hint: '바깥쪽 각이 아니라 내각을 써요.' },
        { v: a, hint: '두 각이 같다고 할 수 없어요. a + b = 내각이에요.' }
      ];
      return { tag: '평행선과 정다각형', stem: `그림에서 l ∥ m 이고 ${POLY[M.n]} ${LET.slice(0, M.n)}에서 꼭짓점 A는 l 위에, C는 m 위에 있을 때, ∠x의 크기는? (노란 각은 ${a}°)`, key: `${M.n}-${a}`, choices: mkChoices(x, wrongs, { lo: 3, hi: 177 }) };
    }
  };

  /* ---------------- p3-3 연속한 두 꼭짓점이 꺾인 점 ---------------- */
  const D33 = {
    id: 'p3-3', title: '정다각형의 두 꼭짓점이 꺾인 점', short: '정다각형 꼭짓점 둘',
    question: '정다각형의 꼭짓점 A는 l 위에, 꼭짓점 D는 m 위에 있어요. 꼭짓점 B, C가 두 선 사이에 있을 때 a, b는 어떤 관계일까요?',
    focus: { x: [-3.85, 3.85], y: [-3.15, 3.8] },
    ctl: ['hN', 'hT'],
    presets: () => [5, 6, 8].map((n, i) => ({ group: i === 0 ? '정다각형' : '', label: POLY[n], apply: (s) => { s.hN = n; }, on: (s) => s.hN === n })),
    actions: () => [{ id: 'aux', primary: true, icon: 'layers', label: (s) => (s.hAux ? '보조선 지우기' : '보조선 긋기 (B, C를 지나 l에 평행)'), on: (s) => !!s.hAux, run: (s) => { s.hAux = s.hAux ? 0 : 1; } }],
    init: (s) => { s.hN = 6; s.hT = 40; s.hAux = 0; },
    reroll: (s) => { s.hN = pick([5, 6, 8], s.hN); s.hT = pick([15, 30, 45, 60, 75], s.hT); },
    model: (s) => { const n = nOK(Math.round(s.hN), [5, 6, 8]), a = aFrom(n, 2, s.hT); return Object.assign(chain(n, a, 2), { aux: s.hAux || 0 }); },
    draw(b, s, M, C) {
      const G = M, prob = C.mode === 'problem', st = C.mode === 'review' ? C.step : 99;
      lines(b);
      drawPoly(b, G);
      const [A, B, Cc, D] = G.V;
      wedge(b, A, 0, angOf(A, B), { color: 'amber', rings: 1, text: prob ? G.a + '°' : 'a=' + G.a + '°', r: 26, size: 17, flip: true });
      wedge(b, D, 0, angOf(D, Cc), { color: prob ? 'green' : 'violet', rings: 2, text: prob ? 'x' : 'b=' + G.b + '°', r: 26, size: prob ? 20 : 17, flip: true });
      const auxOn = prob ? false : C.mode === 'review' ? st >= 1 : G.aux;
      if (auxOn) { dashAt(b, B); dashAt(b, Cc); }
      const copies = !prob && (C.mode === 'review' ? st >= 2 : G.aux);
      if (copies) {
        wedge(b, B, 180, angOf(B, A), { color: 'amber', rings: 1, text: G.a + '°', r: 22, size: 15 });
        wedge(b, Cc, 180, angOf(Cc, D), { color: 'violet', rings: 2, text: G.b + '°', r: 22, size: 15 });
      }
      const mid = !prob && (C.mode === 'review' ? st >= 3 : G.aux);
      if (mid) {
        wedge(b, B, 180, angOf(B, Cc), { color: 'green', rings: 1, text: 'c', r: 20, size: 16, fa: 0.2 });
        wedge(b, Cc, 180, angOf(Cc, B), { color: 'green', rings: 2, text: 'd', r: 20, size: 16, fa: 0.2 });
      }
      if (!mid && (prob || C.mode === 'explore' || st === 1 || st >= 3)) {
        wedge(b, B, angOf(B, A), angOf(B, Cc), { color: prob ? 'ink' : 'green', rings: 3, text: G.I + '°', r: 34, fa: 0.1, size: 16, tcolor: prob ? 'ink' : 'green' });
        wedge(b, Cc, angOf(Cc, B), angOf(Cc, D), { color: prob ? 'ink' : 'green', rings: 3, text: G.I + '°', r: 34, fa: 0.1, size: 16, tcolor: prob ? 'ink' : 'green' });
      }
      if (mid) {
        const cv = wdeg(180, angOf(B, Cc)), dv = wdeg(180, angOf(Cc, B));
        T(b, { x: 0, y: 2.95 }, `c = ${G.I}° − ${G.a}° = ${cv}° ,  d = ${G.I}° − ${G.b}° = ${dv}°`, { color: 'green', size: 16 });
        T(b, { x: 0, y: 3.5 }, `c + d = ${cv}° + ${dv}° = 180°`, { color: 'green', size: 16 });
      }
      if (C.mode === 'explore') tiltHandle(b, s, G, 'hT');
    },
    steps: (M) => [
      `꼭짓점 B, C를 지나고 l에 평행한 보조선을 각각 그어요.`,
      `엇각이 같으므로 B에서 ∠a = ${M.a}°, C에서 ∠b = ${M.b}°를 보조선 쪽으로 옮겨 표시해요.`,
      `${POLY[M.n]}의 한 내각은 ${M.I}°이므로 a + c = ${M.I}°, d + b = ${M.I}°이고, 두 보조선 사이에서 c + d = 180°예요. 따라서 a + b = ${M.I}° + ${M.I}° − 180° = ${M.a + M.b}°`
    ],
    view(M, C, s) {
      return {
        guide: `<b>${POLY[M.n]}</b>의 꼭짓점 A는 l 위, D는 m 위에 있어요. 막대로 변의 수와 기울기를 바꿔 보세요. a가 커지면 b는 어떻게 변할까요? <b>보조선 긋기</b>를 누르면 이유가 단계별로 보여요.`,
        readouts: [
          { label: `${POLY[M.n]}의 한 내각`, value: M.I + '°', color: 'green', note: `(${M.n}−2)×180°÷${M.n}` },
          { label: '∠a (A에서)', value: M.a + '°', color: 'amber' }, { label: '∠b (D에서)', value: M.b + '°', color: 'violet' },
          { label: '∠a + ∠b', value: (M.a + M.b) + '°', color: 'green', note: `${M.I}° + ${M.I}° − 180°`, wide: true }
        ],
        status: { tone: 'ok', text: `a + b = ${M.I}° + ${M.I}° − 180° = ${M.a + M.b}°` },
        formula: `<p>${POLY[M.n]}의 한 내각 = ${M.I}°</p><p>a + c = ${M.I}°, d + b = ${M.I}°, c + d = 180°</p><p>→ a + b = ${M.I}° + ${M.I}° − 180° = ${M.a + M.b}°</p>`,
        rule: '정다각형의 연속한 두 내각의 합 − 180° = a + b',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>꺾인 점이 두 개이면 보조선도 두 개예요. B와 C를 각각 지나게 그어요.</li><li>두 보조선 사이에 낀 c와 d는 합이 <b>180°</b>예요 (동위각 + 평각).</li></ul>'
      };
    },
    prob(M) {
      const a = M.a, I = M.I, x = 2 * I - 180 - a;
      const wrongs = [
        { v: I - a, hint: '꺾인 점이 두 개예요. 내각 두 개의 합에서 180°를 빼야 해요.' },
        { v: 2 * I - a, hint: '두 내각의 합에서 180°를 빼지 않았어요.' },
        { v: 180 - a, hint: '정다각형의 내각을 써서 a + b = 내각 + 내각 − 180°로 구해요.' },
        { v: 2 * I - 180, hint: 'a를 빼는 것을 잊지 않았나요? a + b = 내각 + 내각 − 180°예요.' },
        { v: 360 - 2 * I - a, hint: '내각이 아니라 바깥쪽 각을 썼어요.' }
      ];
      return { tag: '평행선과 정다각형', stem: `그림에서 l ∥ m 이고 ${POLY[M.n]} ${LET.slice(0, M.n)}에서 꼭짓점 A는 l 위에, D는 m 위에 있을 때, ∠x의 크기는? (노란 각은 ${a}°)`, key: `${M.n}-${a}`, choices: mkChoices(x, wrongs, { lo: 3, hi: 177 }) };
    }
  };

  K.register({
    order: 30, id: 'parallel-polygon', title: '정다각형 결합', short: '정다각형 결합',
    params: Object.assign({}, T1, TP),
    scenes: [D31, D32, D33].map(makeScene)
  });
})();
