/* Individual middle-school polygon proofs. Native models supply the current
 * question; the proof has its own immutable geometry and never runs or retimes
 * the legacy lesson timeline. Angles travel by rigid motion, not by changing
 * their size. The complete given figure is visible before construction starts. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root?.APLab) {
    root.APLab.G7ShortPolygons = api;
    Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
    Object.assign(root.APLab.G7ShortInfo = root.APLab.G7ShortInfo || {}, api.lessonInfo);
  }
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  const DEG = Math.PI / 180, TAU = 360, LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const P = (x, y) => ({ x, y }), O = P(0, 0);
  const add = (a, b) => P(a.x + b.x, a.y + b.y);
  const sub = (a, b) => P(a.x - b.x, a.y - b.y);
  const mul = (a, k) => P(a.x * k, a.y * k);
  const length = a => Math.hypot(a.x, a.y);
  const unit = a => mul(a, 1 / (length(a) || 1));
  const mix = (a, b, u) => add(a, mul(sub(b, a), u));
  const clamp = x => Math.max(0, Math.min(1, x));
  const phase = (t, a, z) => { const u = clamp((t - a) / (z - a)); return u * u * (3 - 2 * u); };
  const dir = (a, b) => Math.atan2(b.y - a.y, b.x - a.x) / DEG;
  const mod = a => (a % TAU + TAU) % TAU;
  const polar = (c, r, a) => P(c.x + r * Math.cos(a * DEG), c.y + r * Math.sin(a * DEG));
  const center = pts => mul(pts.reduce(add, O), 1 / pts.length);
  const copy = s => JSON.parse(JSON.stringify(s));
  const frac = x => {
    if (Math.abs(x - Math.round(x)) < 1e-8) return String(Math.round(x));
    for (let d = 2; d <= 720; d++) if (Math.abs(x * d - Math.round(x * d)) < 1e-7) return `${Math.round(x * d)}/${d}`;
    throw new Error(`Polygon proof requires an exact rational angle: ${x}`);
  };
  const tx = x => { const f = frac(x), p = f.split('/'); return p.length === 1 ? f : `\\frac{${p[0]}}{${p[1]}}`; };
  const dg = x => `${frac(x)}°`;
  const F = (label, formula = '') => ({ label, formula });
  const line = (b, a, z, color = 'amber', width = 3, opts = {}) => b.seg(a, z, { color, width, ...opts });
  const trace = (b, a, z, u, color = 'amber', width = 3) => { if (u > 0) line(b, a, mix(a, z, u), color, width); };
  const label = (b, p, s, color = 'ink', opts = {}) => b.text(p, s, { color, size: b.W < 560 ? 13 : 16, align: 'center', baseline: 'middle', ...opts });
  const dot = (b, p, color = 'ink') => b.point(p, { color, r: 4 });
  const poly = (b, pts, color = 'sky', alpha = .1, width = 2.5) => b.path(pts, { close: true, color, fill: color, fillAlpha: alpha, width });

  function bounds(pts) {
    return { x0: Math.min(...pts.map(p => p.x)), x1: Math.max(...pts.map(p => p.x)), y0: Math.min(...pts.map(p => p.y)), y1: Math.max(...pts.map(p => p.y)) };
  }
  function setup(b, pts, pad = .2) {
    const q = bounds(pts), span = Math.max(q.x1 - q.x0, q.y1 - q.y0, 1), margin = span * pad;
    b.kind = 'figure'; b.aspect = '1:1'; b.setPanes(null);
    b.setInsets({ top: 58, right: 38, bottom: 90, left: 38 });
    b.zoom = 1; b.panX = 0; b.panY = 0;
    b.setFocus({ x: [q.x0 - margin, q.x1 + margin], y: [q.y0 - margin, q.y1 + margin] }, false);
  }
  function figure(b, V, names = [], color = 'sky') {
    poly(b, V, color, .06); const c = center(V);
    V.forEach((p, i) => {
      dot(b, p); if (!names[i]) return;
      const u = unit(sub(p, c)); label(b, p, names[i], 'ink', { dx: u.x * 16, dy: u.y * 18, size: b.W < 560 ? 12 : 15 });
    });
  }
  // A positive sweep is clockwise in the figure Board's downwards y direction.
  function angle(v, a, z, reflex = false) {
    let start = dir(v, a), sweep = mod(dir(v, z) - start);
    if (sweep > 180) { start = dir(v, z); sweep = 360 - sweep; }
    if (reflex) { start += sweep; sweep = 360 - sweep; }
    return { c: v, start, sweep };
  }
  function transport(w, c, start, u) {
    let turn = mod(start - w.start + 180) - 180;
    return { c: mix(w.c, c, u), start: w.start + turn * u, sweep: w.sweep };
  }
  function sectorPoints(w, r) {
    const n = Math.max(4, Math.ceil(w.sweep / 6));
    return [w.c, ...Array.from({ length: n + 1 }, (_, i) => polar(w.c, r, w.start + w.sweep * i / n))];
  }
  function sector(b, w, color = 'amber', text = '', radius, alpha = .19) {
    const r = radius ?? Math.min(.3, 29 / (b.k || 60));
    b.path(sectorPoints(w, r), { close: true, color, fill: color, fillAlpha: alpha, width: 1.8 });
    if (text) label(b, polar(w.c, r + 17 / (b.k || 60), w.start + w.sweep / 2), text, color, { size: b.W < 560 ? 12 : 15 });
  }
  function mark(b, a, z, color = 'rose') {
    const m = mix(a, z, .5), u = unit(sub(z, a)), d = 5 / (b.k || 60), v = P(-u.y * d, u.x * d);
    line(b, sub(m, v), add(m, v), color, 2.2);
  }
  function diagonalPairs(n) {
    const pairs = [];
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) pairs.push([i, j]);
    return pairs;
  }
  function fanTriangles(V, v = 0) {
    return Array.from({ length: V.length - 2 }, (_, i) => [V[v], V[(v + i + 1) % V.length], V[(v + i + 2) % V.length]]);
  }
  function fanDraw(b, V, v, u, fill = true) {
    const triangles = fanTriangles(V, v), progress = u * triangles.length;
    triangles.forEach((tri, i) => {
      const amount = clamp(progress - i);
      if (amount > 0 && fill) poly(b, tri, i % 2 ? 'green' : 'sky', .13 * amount, 1);
      if (i < triangles.length - 1) trace(b, tri[0], tri[2], amount, 'green', 2.5);
      if (amount > .95 && fill) label(b, center(tri), String(i + 1), 'green', { size: 13 });
    });
  }
  function exteriorWedges(V) {
    return V.map((p, i) => {
      const previous = V[(i + V.length - 1) % V.length], next = V[(i + 1) % V.length];
      const start = dir(previous, p), sweep = mod(dir(p, next) - start);
      return { c: p, start, sweep };
    });
  }
  function collectExterior(b, V, t, { start = 1.1, end = 6.5, target = O, hideLast = false } = {}) {
    const wedges = exteriorWedges(V), u = phase(t, start, end);
    wedges.forEach((w, i) => {
      const color = hideLast && i === V.length - 1 ? 'amber' : i % 2 ? 'rose' : 'sky';
      if (u < .99) line(b, w.c, polar(w.c, .35, w.start), color, 1.5, { dash: [4, 4] });
      // The original directions already tile one full turn; only translation is needed.
      const moving = { ...w, c: mix(w.c, target, u) };
      sector(b, moving, color, '', Math.min(.4, (30 + 28 * u) / (b.k || 60)), hideLast && i === V.length - 1 ? .05 : .18);
    });
    return wedges;
  }

  const recipes = {};
  function addRecipe(scene, legacyLabel, title, options) {
    const recipe = { legacyLabel, title, duration: 9.6, ...options };
    (recipes[scene] ||= []).push(recipe);
  }

  // ① Count endpoints, regions, and repeated incidences separately.
  for (const [goal, old, title] of [['diagonal', '대각선', '이을 수 있는 꼭짓점 세기'], ['triangles', '삼각형', '대각선 사이의 삼각형 세기'], ['sum', 'a+b', '대각선 a와 삼각형 b 더하기']]) {
    addRecipe('p1-one', old, title, {
      goal, motion: 'exclude-three-endpoints-then-fan-triangulate',
      given: ({ m }) => `${m.n}각형 · 선택한 꼭짓점에서 ${goal === 'diagonal' ? '대각선 수' : goal === 'triangles' ? '나뉘는 삼각형 수' : '대각선 수 a와 삼각형 수 b의 합'}`,
      draw(b, t, { m, G }) {
        const V = G.regUp(m.n, 1); setup(b, V); figure(b, V); dot(b, V[m.v], 'amber');
        if (t >= .8 && goal !== 'triangles') {
          [m.v, (m.v + 1) % m.n, (m.v + m.n - 1) % m.n].forEach(i => b.circle(V[i], 9 / b.k, { color: 'red', width: 2 }));
          for (let j = 2; j <= m.n - 2; j++) trace(b, V[m.v], V[(m.v + j) % m.n], phase(t, 2.2, 4.5), 'amber');
        }
        if (goal !== 'diagonal') fanDraw(b, V, m.v, phase(t, goal === 'sum' ? 4.4 : 1.1, goal === 'sum' ? 7 : 5.6));
      },
      frame(t, { m }) {
        if (t < .8) return F('선택한 꼭짓점과 원래 다각형을 확인합니다.');
        if (goal === 'triangles') return t < 5.6 ? F('대각선을 하나씩 그으며 서로 겹치지 않는 영역을 셉니다.') : t < 7.1 ? F('대각선 사이 마지막 삼각형까지 하나 더 셉니다.') : F('삼각형 수는 대각선 수보다 하나 많습니다.', `$${m.n}-2=${m.t}\\text{개}$`);
        if (t < 2.2) return F('자기 자신과 이웃한 두 꼭짓점, 세 곳은 제외합니다.');
        if (t < 4.5) return F('남은 꼭짓점에만 대각선을 연결합니다.', `$${m.n}-3$`);
        if (goal === 'sum') return t < 7.1 ? F(`대각선 a=${m.a}개와 삼각형 영역 b를 따로 셉니다.`) : F('서로 다른 두 개수를 마지막에 더합니다.', `$a+b=${m.a}+${m.t}=${m.a + m.t}$`);
        return t < 7.1 ? F('남은 연결선 한 개마다 대각선 한 개입니다.') : F('전체 대각선이 아니라 한 꼭짓점에서 그은 개수입니다.', `$${m.n}-3=${m.a}\\text{개}$`);
      }
    });
  }
  addRecipe('p1-all', '전체개수', '같은 대각선의 두 끝을 짝짓기', {
    motion: 'vertex-incidences-paired-by-undirected-edge',
    given: ({ m }) => `${m.n}각형의 전체 대각선 수`,
    draw(b, t, { m, G }) {
      const V = G.regUp(m.n, 1), pairs = diagonalPairs(m.n); setup(b, V); figure(b, V);
      const progress = phase(t, .8, 4.5) * m.n;
      pairs.forEach(([i, j]) => {
        const count = Number(i < progress) + Number(j < progress);
        if (count) line(b, V[i], V[j], count === 2 ? 'green' : 'sky', count === 2 ? 2.5 : 1.5);
      });
      if (t >= 4.5 && pairs.length) {
        const [i, j] = pairs[0], u = phase(t, 4.7, 6.4), mid = mix(V[i], V[j], .5);
        line(b, V[i], V[j], 'amber', 5); dot(b, mix(V[i], mid, u), 'rose'); dot(b, mix(V[j], mid, u), 'sky');
        label(b, mid, '같은 1개', 'amber', { dy: 23 });
      }
    },
    frame(t, { m }) {
      return t < .8 ? F('꼭짓점마다 같은 방법으로 대각선을 셉니다.') : t < 2.8 ? F(`한 꼭짓점에서 ${m.n}−3=${m.a}개를 셉니다.`) : t < 4.7 ? F('모든 꼭짓점에서 세면 양쪽 끝이 각각 한 번씩 포함됩니다.', `$${m.n}\\times${m.a}=${m.tot}$`) : t < 7.1 ? F('두 끝에서 센 표시가 같은 선분 하나에서 만납니다. 두 번 센 값을 반으로 줄입니다.') : F('모든 대각선은 정확히 두 끝을 가집니다.', `$${m.n}\\times${m.a}\\div2=${m.N}\\text{개}$`);
    }
  });
  addRecipe('p1-find', '몇각형', '대각선 수에 맞는 꼭짓점 수 찾기', {
    motion: 'current-candidate-to-adjacent-factor-pair',
    given: ({ m }) => `대각선 ${m.T0}개 · 현재 후보 ${m.n}각형에서 시작`,
    draw(b, t, { m, G }) {
      // Candidate changes are explicit trials in the proof; live pgN is untouched.
      const n = t < 3 ? m.n : t < 5.2 ? Math.max(3, m.ns - 1) : t < 6.6 ? Math.min(12, m.ns + 1) : m.ns;
      const V = G.regUp(n, 1); setup(b, [P(-1, -1), P(1, 1)]); figure(b, V);
      if (t >= .8) diagonalPairs(n).forEach(([i, j]) => line(b, V[i], V[j], t >= 6.6 ? 'green' : 'muted', 1.4));
      if (t >= .8 && t < 6.6) label(b, O, `후보 ${n}각형`, 'amber', { dy: -12 });
      if (t >= .8) label(b, O, t < 6.6 ? `대각선 ${n * (n - 3) / 2}개` : t >= 7.2 ? `${m.ns}각형` : '목표와 일치', 'green', { dy: 15 });
    },
    frame(t, { m }) {
      return t < .8 ? F(`목표는 대각선 ${m.T0}개입니다.`) : t < 3 ? F('후보에서 한 꼭짓점의 수를 세고 전체로 넓힙니다.', `$n(n-3)\\div2=${m.T0}$`) : t < 5.2 ? F('두 번 센 개수는 차이가 3인 두 자연수의 곱입니다.', `$n(n-3)=${m.two}$`) : t < 7.2 ? F('이웃한 후보를 비교해 목표 개수와 맞는 경우를 찾습니다.') : F('찾은 꼭짓점 수를 공식에 넣어 확인합니다.', `$${m.ns}\\times${m.ns - 3}\\div2=${m.T0}\\;\\Rightarrow\\;${m.ns}\\text{각형}$`);
    }
  });

  // ② Triangle exterior angles and constructions.
  addRecipe('p2-ext', '외각', '두 내각을 외각에 옮겨 붙이기', {
    motion: 'parallel-ray-and-two-rigid-angle-transports',
    given: ({ m }) => `∠A=${dg(m.a)}, ∠B=${dg(m.bb)} · C의 외각 x`,
    draw(b, t, { m }) {
      const { A, B, C } = m.tri, D = add(C, P(1, 0)), E = polar(C, 1.3, -m.bb);
      setup(b, [A, B, C, D, E]); figure(b, [A, B, C], ['A', 'B', 'C']); line(b, C, D, 'muted', 2);
      const wA = angle(A, B, C), wB = angle(B, A, C), targetA = angle(C, A, E), targetB = angle(C, E, D);
      sector(b, wA, 'sky', dg(m.a)); sector(b, wB, 'rose', dg(m.bb));
      sector(b, angle(C, A, D), 'amber', t >= 7.2 ? dg(m.e) : 'x', 43 / b.k, .05);
      if (t >= .8) trace(b, C, E, phase(t, .8, 2.1), 'green', 2);
      if (t >= 2.2) sector(b, transport(wA, C, targetA.start, phase(t, 2.2, 4.2)), 'sky', t >= 4.2 ? dg(m.a) : '');
      if (t >= 4.3) sector(b, transport(wB, C, targetB.start, phase(t, 4.3, 6.3)), 'rose', t >= 6.3 ? dg(m.bb) : '');
    },
    frame(t, { m }) {
      return t < .8 ? F('C에서 BC를 연장한 외각 x를 찾습니다.') : t < 2.2 ? F('C를 지나며 AB와 평행한 보조선을 그립니다.') : t < 4.3 ? F('엇각이 같으므로 ∠A를 C의 첫 부분에 대응합니다.') : t < 7.2 ? F('동위각인 ∠B가 나머지 부분을 채웁니다.') : F('외각은 이웃하지 않는 두 내각의 합입니다.', `$x=${m.a}°+${m.bb}°=${m.e}°$`);
    }
  });
  for (const [goal, old, title] of [['sum', '다섯각합', '별의 다섯 각을 삼각형에 모으기'], ['solve', '빈각', '별에서 주어지지 않은 각 구하기']]) {
    addRecipe('p2-star', old, title, {
      goal, motion: 'five-star-tips-regroup-to-central-triangle',
      given: ({ m }) => goal === 'sum' ? '현재 별의 뾰족한 다섯 각의 합' : `A=${dg(m.a)}, B=${dg(m.b)}, C=${dg(m.c)}, D=${dg(m.d)} · E=x`,
      draw(b, t, { m }) {
        const { A, B, C, D, E, P: Q, S } = m.pts, all = [A, B, C, D, E]; setup(b, all, .18);
        [[A, C], [A, D], [B, D], [B, E], [C, E]].forEach(([a, z]) => line(b, a, z, 'ink', 2.5));
        const tips = [angle(A, D, C), angle(B, E, D), angle(C, A, E), angle(D, B, A), angle(E, C, B)];
        const colors = ['amber', 'sky', 'rose', 'sky', 'rose'];
        all.forEach((p, i) => { dot(b, p); const u = unit(sub(p, center(all))); label(b, p, LETTERS[i], 'ink', { dx: u.x * 18, dy: u.y * 18 }); });
        tips.forEach((w, i) => sector(b, w, colors[i], goal === 'solve' ? i === 4 ? t >= 7.3 ? dg(m.e) : 'x' : dg([m.a, m.b, m.c, m.d][i]) : LETTERS[i], 24 / b.k));
        if (t >= .9) poly(b, [A, Q, S], 'green', .13 * phase(t, .9, 1.7), 3);
        const wp = angle(Q, A, S), ws = angle(S, A, Q), u = phase(t, 1.9, 6.2);
        if (t >= 1.9) {
          // Exterior-angle identities: at P, C+E; at S, B+D.
          [[2, Q, wp.start], [4, Q, wp.start + m.c], [1, S, ws.start], [3, S, ws.start + m.b]].forEach(([i, c, a]) => sector(b, transport(tips[i], c, a, u), colors[i], '', 30 / b.k));
          dot(b, Q, 'green'); dot(b, S, 'green');
          if (t >= 6.2) { label(b, Q, 'C+E', 'rose', { dx: 35, dy: -12 }); label(b, S, 'B+D', 'sky', { dx: -35, dy: -12 }); }
        }
      },
      frame(t, { m }) {
        return t < .9 ? F('뾰족한 다섯 각과 선의 교점을 확인합니다.') : t < 1.9 ? F('교점 P, S와 A가 만드는 삼각형을 표시합니다.') : t < 6.2 ? F('외각의 성질로 C+E를 P에, B+D를 S에 모읍니다.') : t < 7.3 ? F('A+(C+E)+(B+D)가 한 삼각형의 세 내각을 채웁니다.', '$A+B+C+D+E=180°$') : goal === 'sum' ? F('따라서 별의 뾰족한 다섯 각의 합은 같습니다.', '$180°$') : F('주어진 네 각의 합을 빼면 빈 각만 남습니다.', `$x=180°-${m.sum4}°=${m.e}°$`);
      }
    });
  }
  for (const [variant, old, title] of [[1, '내각둘', '내각 이등분선 둘의 각'], [2, '외각둘', '외각 이등분선 둘의 각'], [3, '내외각', '내각·외각 이등분선의 각']]) {
    addRecipe('p2-bis', old, title, {
      variant, motion: 'bisected-base-angles-to-triangle-angle-remainder',
      given: ({ m }) => `∠A=${dg(m.a)} · ${['', 'B와 C의 내각', 'B와 C의 외각', 'B의 내각·C의 외각'][variant]} 이등분선`,
      draw(b, t, { m }) {
        const { A, B, C, X, extB, extC, F: Q } = m.g, pts = [A, B, C, X, ...[extB, extC, Q].filter(Boolean)];
        setup(b, pts, .19); figure(b, [A, B, C], ['A', 'B', 'C']);
        line(b, B, X, 'muted', 1.5); line(b, C, X, 'muted', 1.5);
        if (extB) { line(b, B, extB, 'muted', 1.5); line(b, C, extC, 'muted', 1.5); }
        if (Q) line(b, C, Q, 'muted', 1.5);
        sector(b, angle(A, B, C), 'sky', dg(m.a)); sector(b, angle(X, B, C), 'amber', t >= 7.2 ? dg(m.x) : 'x', 26 / b.k);
        if (t >= .8) {
          trace(b, B, X, phase(t, .8, 2.2), 'green'); trace(b, C, X, phase(t, .8, 2.2), 'green');
          const wb = angle(B, C, X), wc = variant === 3 ? angle(C, X, Q) : angle(C, B, X);
          sector(b, wb, 'rose', '●', 23 / b.k); sector(b, wc, 'sky', '×', 23 / b.k);
          sector(b, variant === 2 ? angle(B, X, extB) : angle(B, A, X), 'rose', '●', 36 / b.k);
          sector(b, variant === 2 ? angle(C, X, extC) : angle(C, A, X), 'sky', '×', 36 / b.k);
          if (t >= 2.5) {
            poly(b, [B, C, X], 'green', .08, 2);
            const base = variant === 1 ? 90 - m.a / 2 : variant === 2 ? 90 + m.a / 2 : m.bb / 2;
            if (variant < 3) {
              // Base angles are transported to a separate straight-angle strip;
              // they are not falsely fitted inside the unknown angle at X.
              const c = P((B.x + C.x) / 2, Math.max(...pts.map(p => p.y)) + .22);
              sector(b, transport(wb, c, 180, phase(t, 2.5, 5.8)), 'rose', '', 30 / b.k);
              sector(b, transport(wc, c, 180 + wb.sweep, phase(t, 2.5, 5.8)), 'sky', '', 30 / b.k);
              if (t >= 5.8) { sector(b, { c, start: 180 + base, sweep: m.x }, 'amber', 'x', 30 / b.k); }
            } else {
              const wcExternal = angle(C, X, Q), remainder = angle(X, B, C);
              sector(b, transport(wb, C, wcExternal.start, phase(t, 2.5, 5)), 'rose', '', 29 / b.k);
              if (t >= 5) sector(b, transport(remainder, C, wcExternal.start + wb.sweep, phase(t, 5, 6.6)), 'amber', 'x', 29 / b.k);
            }
          }
        }
      },
      frame(t, { m }) {
        if (t < .8) return F('선택한 종류의 이등분선과 구할 각 x를 확인합니다.');
        if (t < 2.5) return F('같은 각의 반쪽을 ●와 ×로 표시합니다.');
        if (variant === 3) return t < 5 ? F('큰 삼각형의 외각에서 두 배 관계를 씁니다.', `$2×=${m.a}°+2●$`) : t < 7.2 ? F('작은 삼각형의 외각은 ×=●+x이므로 두 식을 비교합니다.', `$2×=2●+2x$`) : F('같은 부분을 빼면 ∠A가 x 두 개입니다.', `$2x=${m.a}°\\;\\Rightarrow\\;x=${m.x}°$`);
        const total = variant === 1 ? 180 - m.a : 180 + m.a, half = total / 2;
        return t < 5.8 ? F(variant === 1 ? 'B와 C의 내각의 합을 반으로 나눕니다.' : '두 외각의 합을 구한 다음 반으로 나눕니다.', `$●+×=${total}°\\div2=${half}°$`) : t < 7.2 ? F('작은 삼각형에서 두 밑각을 옆으로 모으면 x만 남습니다.') : F('삼각형의 내각의 합에서 두 반쪽 각을 뺍니다.', `$x=180°-${half}°=${m.x}°$`);
      }
    });
  }
  for (const [goal, old, title] of [['derive', '연쇄유도', '같은 변을 따라 x에서 4x까지'], ['solve', 'x구하기', '마지막 각에서 x 거꾸로 구하기']]) {
    addRecipe('p2-chain', old, title, {
      goal, motion: 'successive-isosceles-base-angles-and-exterior-angle-addition',
      given: ({ m }) => `AB=BC=CD=DE=EF · ${goal === 'solve' ? `∠EDF=${4 * m.x}°에서 x 구하기` : '∠A=x에서 ∠EDF 구하기'}`,
      draw(b, t, { m }) {
        const { A, B, C, D, E, F: Q } = m.p, pts = [A, B, C, D, E, Q]; setup(b, pts, .16);
        line(b, A, Q, 'sky', 2.5); line(b, A, E, 'sky', 2.5);
        [[A, B], [B, C], [C, D], [D, E], [E, Q]].forEach(([a, z]) => { line(b, a, z, 'ink', 2.5); mark(b, a, z); });
        pts.forEach((p, i) => { dot(b, p); label(b, p, LETTERS[i], 'ink', { dy: i % 2 ? -18 : 18 }); });
        sector(b, angle(A, B, C), 'amber', goal === 'solve' && t >= 7.3 ? dg(m.x) : 'x', 25 / b.k);
        if (goal === 'solve') sector(b, angle(D, E, Q), 'sky', dg(4 * m.x), 30 / b.k);
        const stages = [[.8, [A, B, C], C, A, B, 'x'], [2.2, [B, C, D], B, C, D, '2x'], [3.7, [B, C, D], D, B, C, '2x'], [4.8, [C, D, E], C, D, E, '3x'], [5.8, [C, D, E], E, C, D, '3x'], [6.6, [D, E, Q], D, E, Q, '4x']];
        for (const [a, tri, v, r, z, s] of stages) if (t >= a) {
          if (t < a + 1.2) poly(b, tri, 'green', .13 * phase(t, a, a + .5), 2);
          sector(b, angle(v, r, z), 'green', goal === 'solve' && s === '4x' ? '' : s, (s === '3x' ? 24 : 32) / b.k);
        }
      },
      frame(t, { m }) {
        return t < .8 ? F('같은 눈금은 모두 같은 길이입니다.') : t < 2.2 ? F('AB=BC이므로 첫 삼각형의 두 밑각은 x입니다.') : t < 4.8 ? F('외각은 x+x=2x, 다음 같은 변의 밑각도 2x입니다.') : t < 6.6 ? F('다음 외각은 x+2x=3x, 마주 보는 밑각도 3x입니다.') : t < 7.3 ? F('마지막 외각은 x+3x로 모입니다.') : goal === 'derive' ? F('같은 변과 외각의 성질을 세 번 이어 씁니다.', '$\\angle EDF=4x$') : F('주어진 마지막 각을 네 부분으로 나눕니다.', `$4x=${4 * m.x}°\\;\\Rightarrow\\;x=${m.x}°$`);
      }
    });
  }
  addRecipe('p2-iso', '붙인삼각형', '외각을 같은 두 밑각으로 나누기', {
    motion: 'equal-side-pairs-to-two-equal-parts-of-exterior-angle',
    given: ({ m }) => `AB=AC=CD, ∠B=${dg(m.bb)} · ∠D=x`,
    draw(b, t, { m }) {
      const { A, B, C, D } = m; setup(b, [A, B, C, D]); figure(b, [A, B, D], ['A', 'B', 'D']); line(b, A, C, 'ink'); dot(b, C); label(b, C, 'C', 'ink', { dy: 19 });
      [[A, B], [A, C], [C, D]].forEach(([a, z]) => mark(b, a, z));
      sector(b, angle(B, A, C), 'sky', dg(m.bb)); sector(b, angle(D, A, C), 'amber', t >= 7.2 ? dg(m.d) : 'x');
      if (t >= .8) {
        poly(b, [A, B, C], 'sky', .1, 2); sector(b, angle(C, A, B), 'sky', t >= 2.4 ? dg(m.bb) : '');
        sector(b, transport(angle(B, A, C), C, angle(C, A, B).start, phase(t, .8, 2.4)), 'sky');
      }
      if (t >= 2.7) { poly(b, [A, C, D], 'green', .1, 2); sector(b, angle(A, C, D), 'rose', 'x'); }
      if (t >= 4.5) {
        const ext = angle(C, A, B), u = phase(t, 4.5, 6.6);
        sector(b, transport(angle(A, C, D), C, ext.start, u), 'rose');
        sector(b, transport(angle(D, A, C), C, ext.start + m.d, u), 'amber');
      }
    },
    frame(t, { m }) {
      return t < .8 ? F('붙인 두 삼각형의 같은 길이를 확인합니다.') : t < 2.7 ? F('AB=AC이므로 C의 왼쪽 밑각도 주어진 각과 같습니다.', `$\\angle ACB=${m.bb}°$`) : t < 4.5 ? F('CA=CD이므로 붙인 삼각형의 두 밑각은 모두 x입니다.') : t < 7.2 ? F('두 밑각을 C의 외각에 옮기면 빈틈없이 채웁니다.', `$2x=${m.bb}°$`) : F('외각을 같은 두 부분으로 나눕니다.', `$x=${m.bb}°\\div2=${m.d}°$`);
    }
  });

  // ③ Polygon angle sums, including the reflex-angle and flat boundary cases.
  for (const [goal, old, title] of [['count', '삼각형 수', '안의 점 O에서 삼각형 나누기'], ['sum', '내각의 합', '삼각형의 각에서 O 둘레 빼기']]) {
    addRecipe('p3-inO', old, title, {
      goal, motion: 'interior-point-fan-and-removal-of-central-full-turn',
      given: ({ m }) => `${m.n}각형 · 현재 위치의 안쪽 점 O`,
      draw(b, t, { m }) {
        setup(b, m.V); figure(b, m.V); dot(b, m.O, 'amber'); label(b, m.O, 'O', 'amber', { dx: 13, dy: -16 });
        const progress = phase(t, .8, 4.5) * m.n;
        m.V.forEach((v, i) => {
          const u = clamp(progress - i), next = m.V[(i + 1) % m.n];
          if (u > 0) { poly(b, [m.O, v, next], i % 2 ? 'sky' : 'green', .12 * u, 1); trace(b, m.O, v, u, 'green', 2.5); }
          if (u > .96) label(b, center([m.O, v, next]), String(i + 1), 'green', { size: 13 });
        });
        if (goal === 'sum' && t >= 4.7) {
          const u = phase(t, 4.7, 6.6), target = add(m.O, P(0, .48));
          m.V.forEach((v, i) => { const w = angle(m.O, v, m.V[(i + 1) % m.n]); sector(b, { ...w, c: mix(m.O, target, u) }, 'red', '', 23 / b.k, .2); });
          if (t >= 6.6) label(b, target, '−360°', 'red', { dy: 41 });
        }
      },
      frame(t, { m }) {
        if (t < .8) return F('지금 놓인 O를 그대로 두고 모든 꼭짓점을 잇습니다.');
        if (t < 4.5) return F('다각형의 변 하나마다 삼각형 하나가 대응합니다.');
        if (goal === 'count') return t < 7.2 ? F('마지막 변까지 빠짐없이 연결되었는지 확인합니다.') : F('O는 꼭짓점이 아니라 안의 점이므로 삼각형은 n개입니다.', `$${m.n}\\text{개}$`);
        return t < 6.6 ? F(`삼각형 ${m.n}개의 각에는 O 둘레 한 바퀴도 포함됩니다.`, `$180°\\times${m.n}=${m.tri}°$`) : t < 7.2 ? F('다각형의 내각이 아닌 가운데 360°를 떼어 냅니다.') : F('바깥 꼭짓점들의 내각만 남습니다.', `$${m.tri}°-360°=${m.S}°$`);
      }
    });
  }
  for (const [goal, old, title] of [['sum', '내각의 합', '오목해도 안쪽 삼각형으로 나누기'], ['angle', '오목한 각', '안쪽 큰 각과 움푹한 각 구별하기']]) {
    addRecipe('p3-concave', old, title, {
      goal, motion: 'interior-concave-fan-and-reflex-complement',
      given: ({ m }) => `${m.g.flat ? `꼭짓점 ${m.n}곳 · P가 일직선이 되는 경계 상태` : `${m.g.concave ? '현재 오목' : '현재 볼록'}${m.n}각형`}${goal === 'angle' ? ` · P 이외의 각 ${m.iv.slice(1).map(dg).join(', ')}` : ''}`,
      draw(b, t, { m }) {
        const V = m.g.V; setup(b, V, .24); figure(b, V, ['P', ...LETTERS.slice(0, m.n - 1)]);
        if (goal === 'angle') V.slice(1).forEach((p, j) => { const i = j + 1; sector(b, angle(p, V[i - 1], V[(i + 1) % m.n]), 'sky', dg(m.iv[i]), 19 / b.k); });
        fanDraw(b, V, 0, phase(t, .8, 4.5));
        if (t >= 4.6) {
          const interior = angle(V[0], V[m.n - 1], V[1], m.g.concave);
          sector(b, interior, 'rose', goal === 'angle' && t >= 5.8 && !m.g.concave ? dg(m.iv[0]) : '', 26 / b.k);
          if (goal === 'angle' && t >= 5.8 && m.g.concave) label(b, polar(interior.c, 43 / b.k, interior.start + interior.sweep / 2), dg(m.iv[0]), 'rose', { dy: -20, size: b.W < 560 ? 12 : 15 });
          if (goal === 'angle' && m.g.concave) sector(b, angle(V[0], V[m.n - 1], V[1]), 'amber', t >= 7.2 ? dg(m.x) : 'x', 43 / b.k);
          if (goal === 'angle' && !m.g.concave && t >= 7.2) sector(b, interior, 'amber', dg(m.x), 32 / b.k);
        }
      },
      frame(t, { m }) {
        if (m.g.flat && goal === 'angle') return t < 3 ? F('현재 P 양쪽의 두 변은 한 직선 위에 있습니다.') : t < 7.2 ? F('P에서 나가는 두 반직선은 서로 반대 방향입니다.') : F('이 경계에서 표시한 각은 평각입니다.', '$x=180°$');
        if (t < .8) return F(m.g.concave ? 'P의 안쪽은 180°보다 큰 쪽입니다.' : '현재 모양에 맞춰 P의 안쪽을 확인합니다.');
        if (t < 4.6) return F('P에서 안쪽 대각선을 그어 겹치지 않는 삼각형으로 나눕니다.');
        if (goal === 'sum') return t < 7.2 ? F(`안쪽 삼각형 ${m.n - 2}개가 원래 도형을 채웁니다.`) : F(m.g.flat ? '일직선의 표시 각도 포함한 합입니다.' : '오목한 꼭짓점의 큰 안쪽 각도 포함합니다.', `$180°\\times(${m.n}-2)=${m.S}°$`);
        if (t < 5.8) return F('전체에서 나머지 내각을 빼 P의 안쪽 각을 구합니다.', `$${m.S}°-${m.others}°=${m.iv[0]}°$`);
        if (t < 7.2) return F(m.g.concave ? '구하는 x는 큰 안쪽 각과 함께 한 바퀴를 채웁니다.' : '현재 볼록한 모양에서는 P의 안쪽 각 자체가 x입니다.');
        return F('현재 모양의 구할 각을 확인합니다.', m.g.concave ? `$x=360°-${m.iv[0]}°=${m.x}°$` : `$x=${m.x}°$`);
      }
    });
  }
  addRecipe('p3-ext360', '외각의 합', '크기를 유지한 외각을 한 점에 모으기', {
    motion: 'translate-oriented-exterior-sectors-without-resizing',
    given: ({ m }) => `현재 ${m.n}각형의 외각을 꼭짓점마다 하나씩`,
    draw(b, t, { m }) {
      setup(b, m.V, .28); figure(b, m.V, [], t >= 2 ? 'muted' : 'sky');
      collectExterior(b, m.V, t); if (t >= 7.1) label(b, O, '한 바퀴', 'green', { dy: 88 / (b.W < 560 ? 1.3 : 1) });
    },
    frame(t) {
      return t < 1.1 ? F('각 꼭짓점에서 들어온 변을 같은 방향으로 연장합니다.') : t < 3.6 ? F('한 외각은 들어온 방향에서 다음 변으로 돌아서는 각입니다.') : t < 6.5 ? F('외각의 방향과 크기를 유지한 채 꼭짓점만 한 점으로 옮깁니다.') : t < 7.1 ? F('마지막 방향이 처음 방향과 만나 빈틈없이 닫힙니다.') : F('한 번 돌아 제자리로 왔으므로 외각의 합은 한 바퀴입니다.', '$360°$');
    }
  });
  for (const scene of ['p3-given', 'p3-mixed']) {
    addRecipe(scene, '내각 x', scene === 'p3-given' ? '내각을 외각으로 바꾸어 빈 각 구하기' : '섞인 내각과 외각을 같은 종류로 모으기', {
      motion: 'supplement-given-interiors-then-close-exterior-turn',
      given: ({ m }) => m.given.map((g, i) => `${LETTERS[i]}의 ${g.kind === 'int' ? '내각' : '외각'} ${dg(g.v)}`).join(' · ') + ' · E의 내각 x',
      draw(b, t, { m }) {
        const V = m.V, wedges = exteriorWedges(V); setup(b, V, .3); figure(b, V, t < 4.5 ? ['A', 'B', 'C', 'D', 'E'] : [], t >= 4.5 ? 'muted' : 'sky');
        if (t < 4.5 || t >= 7.2) {
          m.given.forEach((g, i) => {
            const w = g.kind === 'int' ? angle(V[i], V[(i + 4) % 5], V[(i + 1) % 5]) : wedges[i];
            sector(b, w, g.kind === 'int' ? 'sky' : 'rose', dg(g.v), 22 / b.k);
          });
          sector(b, angle(V[4], V[3], V[0]), 'amber', t >= 7.2 ? dg(m.x) : 'x', 28 / b.k);
        }
        if (t >= .9 && t < 4.5) wedges.slice(0, 4).forEach((w, i) => {
          if (m.given[i].kind === 'ext') return;
          trace(b, w.c, polar(w.c, .4, w.start), phase(t, .9 + i * .35, 2 + i * .35), 'rose', 1.7);
          if (t >= 2.1 + i * .35) sector(b, w, 'rose', dg(m.eps[i]), 39 / b.k, .1);
        });
        if (t >= 4.5 && t < 7.2) {
          collectExterior(b, V, t, { start: 4.5, end: 5.9, hideLast: true });
          if (t >= 5.9) sector(b, { ...wedges[4], c: O }, 'amber', t >= 6.4 ? dg(m.ex) : 'e', 59 / b.k);
        }
        if (t >= 7.2) sector(b, wedges[4], 'rose', dg(m.ex), 42 / b.k, .12);
      },
      frame(t, { m }) {
        return t < .9 ? F('주어진 각이 안쪽인지 바깥쪽인지 먼저 구별합니다.') : t < 4.5 ? F('내각과 이웃한 외각은 180°를 채웁니다. 이미 외각인 값은 그대로 씁니다.', '$\\text{외각}=180°-\\text{내각}$') : t < 5.9 ? F('네 외각을 한 바퀴에 모으고 남는 부분 e를 찾습니다.', `$${m.sum4}°+e=360°$`) : t < 7.2 ? F('빈 외각을 구한 뒤 원래 꼭짓점으로 돌아갑니다.', `$e=360°-${m.sum4}°=${m.ex}°$`) : F('문제에서 물은 내각은 그 외각의 보각입니다.', `$x=180°-${m.ex}°=${m.x}°$`);
      }
    });
  }

  // ④ Regular polygons. Rational angles stay exact, including n=7, 11, ... .
  for (const [goal, old, title] of [['external', '한 외각', '같은 외각으로 한 바퀴 나누기'], ['interior', '한 내각', '외각을 구하고 평각에서 빼기']]) {
    addRecipe('p4-reg', old, title, {
      goal, motion: 'equal-exterior-turns-and-supplement',
      given: ({ m }) => `정${m.n}각형의 ${goal === 'external' ? '한 외각' : '한 내각'}`,
      draw(b, t, { m, G }) {
        const V = G.regUp(m.n, 1); setup(b, V, .28); figure(b, V, [], t > 2 && t < 6.4 ? 'muted' : 'sky');
        if (goal === 'external' || t < 6.4) collectExterior(b, V, t, { start: 1, end: 5.8 });
        if (goal === 'interior' && t >= 6.4) {
          const ext = exteriorWedges(V)[0]; line(b, ext.c, polar(ext.c, .55, ext.start), 'rose', 2);
          sector(b, ext, 'rose', dg(m.e), 36 / b.k);
          sector(b, angle(V[0], V[m.n - 1], V[1]), 'amber', t >= 7.3 ? dg(m.I) : 'x', 29 / b.k);
        }
        if (goal === 'external' && t >= 7.3) sector(b, { c: O, start: exteriorWedges(V)[0].start, sweep: m.e }, 'amber', dg(m.e), 58 / b.k);
      },
      frame(t, { m }) {
        return t < 1 ? F('정다각형의 외각은 모두 같은 크기입니다.') : t < 5.8 ? F(`같은 외각 ${m.n}개를 한 점에 옮겨 한 바퀴를 채웁니다.`) : t < 6.4 ? F('한 바퀴를 같은 개수로 나눕니다.', `$360°\\div${m.n}$`) : t < 7.3 ? F(goal === 'external' ? '한 조각이 구하는 외각입니다.' : `외각 ${dg(m.e)}와 한 내각을 합하면 180°입니다.`) : F(goal === 'external' ? '한 바퀴의 같은 한 조각입니다.' : '평각에서 외각을 뺀 나머지가 내각입니다.', goal === 'external' ? `$360°\\div${m.n}=${tx(m.e)}°$` : `$180°-${tx(m.e)}°=${tx(m.I)}°$`);
      }
    });
  }
  function ratioTurns(m) {
    const complete = Math.floor(m.nn + 1e-9), remainder = Math.max(0, 360 - complete * m.eps);
    return { complete, remainder, valid: m.valid };
  }
  for (const [goal, old, title] of [['count', '변의 수', '내각·외각의 비에서 변의 수 찾기'], ['exists', '존재 여부', '같은 외각이 한 바퀴를 정확히 채우는지']]) {
    addRecipe('p4-ratio', old, title, {
      goal, motion: 'ratio-partition-of-straight-angle-and-integer-turn-closure',
      given: ({ m }) => `한 내각 : 한 외각 = ${m.a}:${m.bb} · ${goal === 'exists' ? '정다각형의 존재 여부' : '변의 수'}`,
      draw(b, t, { m, G }) {
        setup(b, [P(-1.2, -1.1), P(1.2, 1.1)]);
        if (t < 3.5) {
          const c = P(0, .35), r = .9, parts = m.a + m.bb;
          line(b, P(-1, .35), P(1, .35), 'ink', 2.5);
          sector(b, { c, start: 180, sweep: m.I }, 'sky', `${m.a}부분`, r);
          sector(b, { c, start: 180 + m.I, sweep: m.eps }, 'rose', `${m.bb}부분`, r);
          if (t >= .8) for (let i = 1; i < parts; i++) trace(b, c, polar(c, r, 180 + 180 * i / parts), phase(t, .8, 2), 'muted', 1.2);
          label(b, P(0, .75), '내각 + 외각 = 180°', 'ink', { size: 14 });
        } else {
          const { complete, remainder } = ratioTurns(m), count = Math.min(complete, phase(t, 3.5, 6.5) * complete);
          for (let i = 0; i < complete; i++) if (i < count) sector(b, { c: O, start: -90 + i * m.eps, sweep: m.eps }, i % 2 ? 'rose' : 'sky', '', .8, .18);
          if (t >= 6.5 && remainder > 1e-8) sector(b, { c: O, start: -90 + complete * m.eps, sweep: remainder }, 'amber', '남음', .8, .08);
          if (t >= 7.3 && m.valid) {
            const V = G.regUp(Math.round(m.nn), 1); b.path(V, { close: true, color: 'green', width: 3 });
            label(b, O, `정${Math.round(m.nn)}각형`, 'green');
          }
        }
      },
      frame(t, { m }) {
        return t < .8 ? F('내각과 외각의 합인 180°를 비의 합만큼 나눕니다.') : t < 3.5 ? F('그중 외각의 몫만 따로 잡습니다.', `$\\text{외각}=180°\\times\\frac{${m.bb}}{${m.a + m.bb}}=${tx(m.eps)}°$`) : t < 6.5 ? F('같은 외각을 하나씩 더하며 한 바퀴에 몇 개가 필요한지 셉니다.') : t < 7.3 ? F(m.valid ? '같은 조각들이 남는 부분 없이 정확히 닫힙니다.' : '마지막에 다른 크기의 조각이 남으므로 같은 외각만으로 닫히지 않습니다.', `$n=360°\\div${tx(m.eps)}°=${tx(m.nn)}$`) : F(m.valid ? `3 이상의 자연수이므로 정${Math.round(m.nn)}각형이 존재합니다.` : '변의 수가 3 이상의 자연수가 아니므로 이 비의 정다각형은 없습니다.', m.valid ? `$n=${Math.round(m.nn)}$` : `$n=${tx(m.nn)}\\notin\\{3,4,5,\\ldots\\}$`);
      }
    });
  }
  addRecipe('p4-diag', '교각', '이등변삼각형으로 대각선의 교각 구하기', {
    motion: 'two-equal-side-triangles-to-intersection-triangle',
    given: ({ m }) => `정${m.n}각형 · 이웃한 A,B,C,D · AC와 BD의 교점 P`,
    draw(b, t, { m }) {
      const { A, B, C, D, P: Q, Pn } = m; setup(b, Pn); figure(b, Pn);
      [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']].forEach(([p, s]) => { const u = unit(p); label(b, p, s, 'ink', { dx: u.x * 17, dy: u.y * 17 }); });
      line(b, A, C, 'green', 2.5); line(b, B, D, 'green', 2.5); dot(b, Q, 'amber');
      sector(b, angle(Q, A, B), 'amber', t >= 7.3 ? dg(m.x) : 'x', 25 / b.k);
      if (t >= .8) { poly(b, [A, B, C], 'sky', .1, 2); mark(b, A, B); mark(b, B, C); sector(b, angle(B, A, C), 'sky', dg(m.I)); }
      if (t >= 2.5) { sector(b, angle(A, B, C), 'rose', dg(m.h), 25 / b.k); poly(b, [B, C, D], 'green', .09, 2); mark(b, C, D); sector(b, angle(B, C, D), 'rose', dg(m.h), 37 / b.k); }
      if (t >= 4.7) { poly(b, [A, B, Q], 'amber', .12, 2.5); sector(b, angle(B, A, D), 'sky', dg(m.ab), 21 / b.k); }
    },
    frame(t, { m }) {
      return t < .8 ? F('물은 각은 교점 P에서 A와 B 쪽으로 벌어진 각입니다.') : t < 2.5 ? F('정다각형의 한 내각과 같은 두 변을 확인합니다.', `$I=180°-\\frac{360°}{${m.n}}=${tx(m.I)}°$`) : t < 4.7 ? F('ABC와 BCD의 밑각은 각각 같은 값입니다.', `$h=(180°-${tx(m.I)}°)\\div2=${tx(m.h)}°$`) : t < 7.3 ? F('B의 내각에서 작은 밑각을 빼 △ABP의 각을 구합니다.', `$\\angle ABP=${tx(m.I)}°-${tx(m.h)}°=${tx(m.ab)}°$`) : F('△ABP의 세 각의 합으로 교각을 남깁니다.', `$x=180°-${tx(m.h)}°-${tx(m.ab)}°=${tx(m.x)}°$`);
    }
  });
  for (const [goal, old, title] of [['gap', '남는 각', '두 정다각형 사이 남는 각'], ['base', '밑각', '같은 두 변 사이 삼각형의 밑각'], ['straight', '일직선', '현재 두 도형의 일직선 여부']]) {
    addRecipe('p4-join', old, title, {
      goal, motion: 'shared-side-interiors-and-complement-with-equal-side-base-angles',
      given: ({ m }) => `정${m.n}각형·정${m.m}각형, 공통변 AB=${m.L}cm · ${goal === 'gap' ? 'A 둘레 남는 각' : goal === 'base' ? '∠APQ' : 'P,A,Q의 일직선 여부'}`,
      draw(b, t, { m }) {
        const { A, B, P: Q, Q: R, polyN, polyM } = m.g; setup(b, [...polyN, ...polyM], .2);
        figure(b, polyN, [], 'sky'); figure(b, polyM, [], 'green'); line(b, A, B, 'amber', 4);
        [[A, 'A', 0, -18], [B, 'B', 0, 18], [Q, 'P', -14, -13], [R, 'Q', 14, -13]].forEach(([p, s, dx, dy]) => label(b, p, s, 'ink', { dx, dy }));
        mark(b, A, Q); mark(b, A, R); label(b, mix(A, B, .5), `${m.L}cm`, 'amber', { dx: 27, size: 13 });
        if (t >= .8) { sector(b, angle(A, Q, B), 'sky', t >= 2.2 ? dg(m.In) : '', 27 / b.k); sector(b, angle(A, B, R), 'green', t >= 2.2 ? dg(m.Im) : '', 27 / b.k); }
        if (t >= 3.1) {
          const gap = angle(A, Q, R, m.gap > 180); sector(b, gap, 'amber', t >= 4.7 && goal !== 'gap' || t >= 7.3 ? dg(m.gap) : 'x', 43 / b.k, .14);
        }
        if (t >= 5 && goal !== 'gap') {
          line(b, Q, R, m.valid ? 'rose' : 'green', 3);
          if (m.valid) {
            poly(b, [A, Q, R], 'rose', .09, 2);
            if (m.gap > 180) sector(b, angle(A, Q, R), 'rose', dg(m.x), 21 / b.k);
            if (goal === 'base') { sector(b, angle(Q, A, R), 'rose', t >= 7.3 ? dg(m.base) : 'y', 24 / b.k); sector(b, angle(R, A, Q), 'rose', 'y', 24 / b.k); }
          }
        }
      },
      frame(t, { m }) {
        if (t < .8) return F('현재 두 정다각형과 공통변의 길이를 유지합니다.');
        if (t < 3.1) return F('공통 꼭짓점 A에서 각 도형의 내각을 표시합니다.', `$${tx(m.In)}°,\\quad${tx(m.Im)}°$`);
        if (t < 4.7) return F('한 점 둘레에서 두 내각을 빼 남는 부분을 찾습니다.', `$360°-${tx(m.In)}°-${tx(m.Im)}°$`);
        if (goal === 'gap') return t < 7.3 ? F('표시한 남는 부분이 180°보다 클 수도 있습니다.') : F('A 둘레에서 두 도형이 차지하지 않은 각입니다.', `$${tx(m.gap)}°$`);
        if (!m.valid) return t < 7.3 ? F('남는 각이 평각이므로 P, A, Q가 한 직선 위에 놓입니다.') : F('이 조건에서는 삼각형 APQ가 생기지 않아 밑각을 구할 수 없습니다.', '$\\angle PAQ=180°$');
        if (t < 6.1) return F(m.gap > 180 ? '삼각형의 꼭지각은 큰 남는 각의 반대편 작은 각입니다.' : '남는 각이 삼각형 APQ의 꼭지각입니다.', m.gap > 180 ? `$\\angle PAQ=360°-${tx(m.gap)}°=${tx(m.x)}°$` : `$\\angle PAQ=${tx(m.x)}°$`);
        if (t < 7.3) return F(goal === 'straight' ? '현재 꼭지각은 180°가 아니므로 세 점은 일직선이 아닙니다.' : 'AP=AQ이므로 남은 두 밑각을 같은 크기로 나눕니다.');
        return goal === 'straight' ? F('현재 선택된 조합은 삼각형을 만듭니다.', `$\\angle PAQ=${tx(m.x)}°\\ne180°$`) : F('두 밑각이 나머지 180°를 똑같이 나눕니다.', `$\\angle APQ=(180°-${tx(m.x)}°)\\div2=${tx(m.base)}°$`);
      }
    });
  }
  for (const [goal, old, title] of [['unit', '한 조각', '정다각형의 대각선이 나눈 한 각'], ['combined', '모은 각', '같은 각 조각을 필요한 만큼 모으기']]) {
    addRecipe('p4-fan', old, title, {
      goal, motion: 'isosceles-base-angle-and-congruent-fan-sector-superposition',
      given: ({ m }) => `정${m.n}각형 · 현재 선택한 A · ${goal === 'unit' ? '∠BAC' : `∠BA${LETTERS[m.k + 1]} (${m.k}조각)`}`,
      draw(b, t, { m }) {
        const V = m.Pn, A = m.at(0), B = m.at(1), C = m.at(2); setup(b, V); figure(b, V);
        [[A, 'A'], [B, 'B'], [C, 'C'], ...(goal === 'combined' ? [[m.at(m.k + 1), LETTERS[m.k + 1]]] : [])].forEach(([p, s]) => { const u = unit(p); label(b, p, s, 'ink', { dx: u.x * 16, dy: u.y * 18 }); });
        // Every ray is part of the question figure; the proof traces them again.
        for (let j = 2; j <= m.n - 2; j++) line(b, A, m.at(j), 'muted', 1.3);
        if (t >= .8) { poly(b, [A, B, C], 'sky', .12, 2); mark(b, A, B); mark(b, B, C); sector(b, angle(B, A, C), 'sky', 'I', 23 / b.k); }
        if (t >= 2.6) {
          if (t < 6.4) sector(b, angle(A, B, C), 'rose', 'h', 34 / b.k);
          sector(b, angle(C, A, B), 'rose', 'h', 24 / b.k);
        }
        if (t >= 4.4) {
          const first = angle(A, B, C), u = phase(t, 4.4, 6.3);
          for (let j = 2; j <= m.n - 2; j++) {
            const w = angle(A, m.at(j), m.at(j + 1));
            sector(b, transport(first, A, w.start, u), j <= m.k && goal === 'combined' ? 'amber' : 'green', '', 36 / b.k, .16);
          }
        }
        if (t >= 6.4) {
          const k = goal === 'unit' ? 1 : m.k;
          for (let j = 1; j <= k; j++) poly(b, [A, m.at(j), m.at(j + 1)], 'amber', .11, 1);
          sector(b, angle(A, B, m.at(k + 1)), 'amber', goal === 'unit' ? 'h' : 'x', 49 / b.k, .06);
        }
      },
      frame(t, { m }) {
        return t < .8 ? F('현재 선택한 꼭짓점 A에서 나뉜 각을 확인합니다.') : t < 2.6 ? F('AB=BC인 삼각형 ABC의 꼭지각은 정다각형의 한 내각입니다.', `$I=180°-\\frac{360°}{${m.n}}=${tx(m.I)}°$`) : t < 4.4 ? F('같은 두 밑각이 내각을 뺀 나머지를 반씩 나눕니다.', `$2h=180°-${tx(m.I)}°$`) : t < 6.4 ? F('정다각형에서 나뉜 각들은 같은 크기입니다. 한 조각을 회전해 차례로 겹쳐 봅니다.') : t < 7.3 ? F(goal === 'unit' ? '처음 두 변 사이의 한 조각만 읽습니다.' : `구하는 두 반직선 사이에는 같은 조각이 ${m.k}개입니다.`) : F(goal === 'unit' ? '한 조각은 정다각형의 변의 수로 결정됩니다.' : '한 조각의 크기에 실제 포함된 조각 수를 곱합니다.', goal === 'unit' ? `$h=180°\\div${m.n}=${tx(m.h)}°$` : `$x=${tx(m.h)}°\\times${m.k}=${tx(m.kk)}°$`);
      }
    });
  }

  function build(lab, state) {
    const G = typeof window === 'undefined' ? lab.api || lab.G : window.APL_PG;
    const D = lab.scene?.pg, list = recipes[D?.id];
    if (!G || !D || !list) return [];
    const saved = copy(state), current = D.model(saved);
    const plans = list.map((recipe, index) => {
      // Clicking a named bisector lesson explicitly chooses that construction;
      // its numerical triangle and the student's exploration state are retained.
      const m = recipe.variant ? D.model({ ...saved, pgK: recipe.variant }) : current;
      const data = { m, G, goal: recipe.goal, variant: recipe.variant, scene: D.id };
      return {
        id: `polygon-${D.id}-${index + 1}`, title: recipe.title, label: recipe.title,
        legacyLabel: recipe.legacyLabel, duration: recipe.duration, stops: [.8, 2.5, 4.5, 6.4, 7.3],
        model: data, given: recipe.given(data), motion: recipe.motion,
        draw: (b, t, d) => recipe.draw(b, t, d), frame: (t, d) => recipe.frame(t, d)
      };
    });
    if (D.id === 'p2-bis') plans.sort((a, b) => Number(b.model.variant === current.k) - Number(a.model.variant === current.k));
    return plans;
  }
  const registry = Object.fromEntries(Object.keys(recipes).map(id => [`g7-polygons/${id}`, build]));
  const lessonInfo = Object.fromEntries(Object.entries(recipes).map(([id, list]) => [`g7-polygons/${id}`, list.map(({ legacyLabel, duration }) => ({ legacyLabel, duration }))]));
  return { recipes, registry, lessonInfo, build, phase, angle, transport, sectorPoints, diagonalPairs, fanTriangles, exteriorWedges, ratioTurns, frac, tx };
});
