/* Grade 7 parallel-line shorts. Each proof is built from the current native
 * scene model. Copies of angles and hinged paper pieces are independent proof
 * objects: the explorer's controls, random choices and folding state are kept. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root?.APLab) return;
  root.APLab.G7ShortParallel = api;
  Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
  Object.assign(root.APLab.G7ShortInfo = root.APLab.G7ShortInfo || {}, api.lessonInfo);
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  const DEG = Math.PI / 180;
  const P = (x, y) => ({ x, y });
  const clone = x => JSON.parse(JSON.stringify(x));
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const phase = (t, a, b) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
  const lerp = (a, b, u) => P(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u);
  const at = (p, d, r) => P(p.x + r * Math.cos(d * DEG), p.y - r * Math.sin(d * DEG));
  const angle = (p, q) => Math.atan2(p.y - q.y, q.x - p.x) / DEG;
  const norm = d => ((d % 360) + 360) % 360;
  const number = n => String(Math.round(n * 1000) / 1000);
  const deg = n => `${number(n)}°`;
  const tex = n => `${number(n)}^{\\circ}`;
  const describe = (label, formula = '') => ({ label, formula });
  const LABELS = 'abcdefgh';
  const CORR = [['a', 'e'], ['b', 'f'], ['c', 'g'], ['d', 'h']];
  const ALT = [['c', 'f'], ['d', 'e']];
  const COLORS = ['amber', 'violet', 'rose', 'sky'];
  const POLY = { 3: '정삼각형', 4: '정사각형', 5: '정오각형', 6: '정육각형', 8: '정팔각형' };

  function sector(w) {
    let start = w.d1, sweep = norm(w.d2 - w.d1);
    if (sweep > 180) { start = w.d2; sweep = 360 - sweep; }
    return { start, sweep };
  }
  function straightUnion(a, b) {
    const same = (x, y) => Math.abs(Math.sin((x - y) * DEG / 2)) < 1e-8;
    const ar = [a.d1, a.d2], br = [b.d1, b.d2];
    const shared = ar.find(x => br.some(y => same(x, y)));
    if (shared == null) throw Error('A linear pair must share a ray');
    const first = ar.find(x => !same(x, shared)), second = br.find(x => !same(x, shared));
    return norm(shared - first) <= 180 ? { V: a.V, d1: first, d2: second } : { V: a.V, d1: second, d2: first };
  }
  function pose(w, destination, rotation, u) {
    return { V: lerp(w.V, destination, u), d1: w.d1 + rotation * u, d2: w.d2 + rotation * u };
  }
  function mark(b, K, w, text = '', color = 'amber', o = {}) {
    K.wedge(b, w.V, w.d1, w.d2, { color, r: 25, text, size: 15, ...o });
  }
  function transfer(b, K, w, destination, rotation, u, color = 'amber', text = '', o = {}) {
    if (u <= 0) return;
    const q = pose(w, destination, rotation, u);
    const radius = (o.r || 23) / b.k;
    b.path([at(q.V, q.d1, radius * 1.5), q.V, at(q.V, q.d2, radius * 1.5)], { color, width: 2, alpha: .65 });
    mark(b, K, q, text, color, { r: 23, fa: .22, ...o });
  }
  function label(b, p, text, color = 'ink', o = {}) {
    b.text(p, text, { align: 'center', baseline: 'middle', size: b.W < 560 ? 13 : 16, weight: 750, color, ...o });
  }
  function dot(b, p, name, color = 'ink', o = {}) {
    b.point(p, { color, r: 4.5 });
    if (name) label(b, p, name, color, { dy: -17, ...o });
  }
  function prepare(b, points, extra = {}) {
    b.kind = 'figure'; b.aspect = '1:1'; b.setPanes(null);
    b.setInsets({ top: 45, right: 24, bottom: 82, left: 24 });
    b.zoom = 1; b.panX = 0; b.panY = 0;
    b.setFocus({
      x: [Math.min(extra.x0 ?? -3.9, ...points.map(p => p.x - .7)), Math.max(extra.x1 ?? 3.9, ...points.map(p => p.x + .7))],
      y: [Math.min(extra.y0 ?? -2.8, ...points.map(p => p.y - .7)), Math.max(extra.y1 ?? 2.8, ...points.map(p => p.y + .7))]
    }, false);
  }
  function horizontal(b, K, y, name, left = -3.55, right = 3.55, parallel = true) {
    K.parLine(b, P(0, y), 0, { e0: left, e1: right, name, nameAt: right - .15, arrows: parallel ? [left * .72, right * .72] : [] });
  }
  function auxiliary(b, p, u, d = 0, span = 3.5) {
    if (u > 0) b.path([at(p, d, -span * u), at(p, d, span * u)], { color: 'muted', dash: [6, 5], width: 1.8 });
  }
  const wedge = (V, d1, d2) => ({ V, d1, d2 });
  function parallelGeometry(theta, phi, cx = 0) {
    const cot = Math.cos(theta * DEG) / Math.sin(theta * DEG);
    const top = P(cx + 1.7 * cot, -1.7), bottom = P(cx - 1.7 * cot, 1.7);
    const W = {
      a: wedge(top, 180, theta), b: wedge(top, 0, theta),
      c: wedge(top, 180, theta + 180), d: wedge(top, theta + 180, 0),
      e: wedge(bottom, phi + 180, theta), f: wedge(bottom, phi, theta),
      g: wedge(bottom, phi + 180, theta + 180), h: wedge(bottom, theta + 180, phi)
    };
    Object.values(W).forEach(w => { w.val = sector(w).sweep; });
    return { theta, phi, P: top, Q: bottom, W };
  }
  function parallelBase(b, K, G, showParallel, allLetters = false, omit = []) {
    const x0 = Math.min(-4.2, G.P.x - .8, G.Q.x - 1), x1 = Math.max(4.2, G.P.x + .8, G.Q.x + 1);
    const lower = [at(G.Q, G.phi, -3.8), at(G.Q, G.phi, 3.8)];
    prepare(b, [G.P, G.Q, ...lower], { x0: x0 - .25, x1: x1 + .25, y0: -3.4, y1: 3.4 });
    horizontal(b, K, -1.7, 'l', x0, x1, showParallel);
    K.parLine(b, G.Q, G.phi, { e0: -3.8, e1: 3.8, arrows: showParallel ? [-2.7, 2.7] : [], name: 'm', nameAt: 3.5 });
    b.path([at(G.P, G.theta, 1.2), at(G.Q, G.theta + 180, 1.2)], { color: 'rose', width: 3.3 });
    dot(b, G.P, 'P', 'ink', { dx: -13, dy: 0 }); dot(b, G.Q, 'Q', 'ink', { dx: -13, dy: 0 });
    if (allLetters) Object.entries(G.W).filter(([name]) => !omit.includes(name)).forEach(([name, w]) => mark(b, K, w, name, 'muted', { r: 15, bare: true, size: 13 }));
  }
  function modelAt(D, state, updates = {}) {
    const copy = { ...clone(state), ...updates, lessonOn: false, lessonEntry: false };
    return D.model(copy);
  }
  function makePlan(d, id, legacyLabel, duration, given, motion, draw, frame, stops = [.8, 2.7, 4.8, 7.2]) {
    return { id: `parallel-${id}`, title: d.D.title, label: legacyLabel, legacyLabel, duration,
      stops: stops.filter(t => t < duration), model: d, given, motion, draw, frame };
  }

  function locationPlan(d, kind) {
    const pairs = kind === 'corr' ? CORR : ALT;
    const target = d.s.pKind === kind ? d.G.tar : null;
    const selected = pairs.find(p => target && p.includes(target)) || pairs[Math.min(d.s.pPair || 0, pairs.length - 1)];
    const from = target && selected.includes(target) ? target : selected[0], to = selected.find(n => n !== from);
    const m = { ...d, from, to, kind, answer: to };
    const name = kind === 'corr' ? '동위각' : '엇각';
    return makePlan(m, `location-${kind}`, name, 8.2, `l ∥ m · ∠${from}의 ${name} 찾기`, kind === 'corr' ? 'corresponding-angle-translation' : 'alternate-angle-half-turn-and-translation',
      (b, t, m) => {
        const G = m.G.G; parallelBase(b, m.K, G, true, true, [m.from, ...(t >= 5.7 ? [m.to] : [])]);
        mark(b, m.K, G.W[m.from], m.from, 'amber', { r: 26, fa: .3 });
        transfer(b, m.K, G.W[m.from], G.W[m.to].V, m.kind === 'alt' ? 180 : 0, phase(t, 1.3, 5.7), 'amber', t >= 5.7 ? m.to : '', { r: 26 });
        if (t >= 6) mark(b, m.K, G.W[m.to], m.to, 'green', { r: 26 });
      },
      (t, m) => t < 1.3 ? describe(`∠${m.from}이 어느 교점의 어느 쪽인지 봅니다.`) : t < 5.7 ? describe(m.kind === 'corr' ? '각 조각의 방향을 유지하며 다른 교점으로 옮깁니다.' : '두 평행선 사이의 각을 반 바퀴 돌려 다른 교점에 포갭니다.') : describe(`∠${m.from}과 ∠${m.to}은 ${name}입니다.`, `$\\angle ${m.from}=\\angle ${m.to}$`));
  }
  function conditionPlan(d, kind) {
    const m = { ...d, kind, from: kind === 'corr' ? 'b' : 'c' };
    const name = kind === 'corr' ? '동위각' : '엇각';
    return makePlan(m, `condition-${kind}`, `${name}조건`, 8.8, `횡단선 ${deg(d.G.theta)} · 현재 m의 기울기 ${deg(d.G.phi)}`, 'lower-line-rotation-until-angle-copy-fits',
      (b, t, m) => {
        const G = parallelGeometry(m.G.theta, m.G.phi * (1 - phase(t, 2.7, 5.6)));
        parallelBase(b, m.K, G, t >= 6);
        mark(b, m.K, G.W[m.from], deg(G.W[m.from].val), 'amber');
        mark(b, m.K, G.W.f, deg(G.W.f.val), t >= 5.6 ? 'green' : 'violet', { rings: 2 });
        transfer(b, m.K, G.W[m.from], G.Q, m.kind === 'alt' ? 180 : 0, phase(t, .8, 2.5), 'amber', '', { r: 36 });
      },
      (t, m) => t < 2.7 ? describe(`현재 ${name} 한쪽을 다른 교점으로 옮겨 비교합니다.`) : t < 5.6 ? describe('m을 돌려 두 각 조각의 양쪽 변이 모두 겹치게 맞춥니다.') : describe(`${name}의 크기가 같아지면 두 직선이 평행해집니다.`, `$${tex(m.G.theta)}=${tex(m.G.theta)}\\;\\Longrightarrow\\;l\\parallel m$`));
  }
  function parallelValue(d) {
    const G = modelAt(d.D, d.s, { qPhi: 0 }).G;
    const from = d.G.given, to = d.G.ask, carried = CORR.find(p => p[0] === from)[1];
    const vertical = { e: 'h', h: 'e', f: 'g', g: 'f' };
    const relation = to === carried ? 'corresponding' : vertical[carried] === to ? 'vertical' : 'straight';
    const m = { ...d, proof: G, from, to, carried, relation, straight: relation === 'straight' ? straightUnion(G.W[carried], G.W[to]) : null, answer: G.W[to].val };
    return makePlan(m, 'parallel-value', '각크기', 9, `문제의 조건 l ∥ m · ∠${from}=${deg(G.W[from].val)} · ∠${to}=?`, 'corresponding-transfer-then-vertical-or-linear-pair',
      (b, t, m) => {
        const G = m.proof; parallelBase(b, m.K, G, true);
        mark(b, m.K, G.W[m.from], deg(G.W[m.from].val), 'amber');
        mark(b, m.K, G.W[m.to], t >= 7.2 ? deg(m.answer) : 'x', 'green', { r: 29 });
        transfer(b, m.K, G.W[m.from], G.Q, 0, phase(t, .9, 3.3), 'amber', t >= 3.3 && m.carried !== m.to ? deg(G.W[m.from].val) : '', { r: 23 });
        if (m.relation === 'vertical' && t >= 3.6) transfer(b, m.K, G.W[m.carried], G.Q, 180, phase(t, 3.6, 6.2), 'amber', '', { r: 33 });
        if (m.relation === 'straight' && t >= 4) {
          mark(b, m.K, m.straight, '180°', 'muted', { r: 54, fa: .04, size: 14 });
        }
      },
      (t, m) => t < 3.4 ? describe('주어진 각을 동위각 자리로 옮깁니다.') : t < 7.2 ? describe(m.relation === 'corresponding' ? '구할 각과 그대로 포개어집니다.' : m.relation === 'vertical' ? '맞꼭지각은 반 바퀴 돌리면 포개어집니다.' : '같은 교점에서 이웃한 두 각이 평각을 만듭니다.') : describe('문제에서 요구한 각의 위치까지 확인했습니다.', m.relation === 'straight' ? `$x=180^{\\circ}-${tex(G.W[from].val)}=${tex(m.answer)}$` : `$x=${tex(m.answer)}$`));
  }
  function judgement(d, trap) {
    // The comparison example retains the current p; its complementary q is
    // explicitly named in `given`. The 90° case remains a valid equal pair.
    const p = d.G.vP, q = trap ? 180 - p : d.G.vQ, kind = d.G.kind;
    const G = parallelGeometry(p, p - q), from = kind === 'alt' ? 'c' : 'b';
    const m = { ...d, p, q, kind, proof: G, from, equal: p === q, trap, answer: p === q };
    return makePlan(m, trap ? 'sum-trap' : 'equal-angles', trap ? '합180함정' : '같은각', 8.6,
      trap ? `현재 p=${deg(p)} 유지 · 합이 180°인 q=${deg(q)} 비교 보기` : `현재 ${kind === 'alt' ? '엇각' : '동위각'} p=${deg(p)}, q=${deg(q)}`,
      'rigid-angle-copy-compared-with-both-rays',
      (b, t, m) => {
        parallelBase(b, m.K, m.proof, t >= 6.5 && m.equal);
        mark(b, m.K, m.proof.W[m.from], deg(m.p), 'amber');
        mark(b, m.K, m.proof.W.f, deg(m.q), 'violet', { rings: 2, r: 24 });
        transfer(b, m.K, m.proof.W[m.from], m.proof.Q, m.kind === 'alt' ? 180 : 0, phase(t, 1.2, 5), 'amber', '', { r: 37 });
        if (t >= 6.5) label(b, P(0, -3.05), m.equal ? '두 각이 같음 → l ∥ m' : '두 각이 다름 → 평행 아님', m.equal ? 'green' : 'rose');
      },
      (t, m) => t < 1.2 ? describe(m.trap ? '현재 p를 유지하고, 합이 180°인 비교 각을 만듭니다.' : '평행 표시를 가정하지 않고 두 각부터 비교합니다.') : t < 5.4 ? describe('각 조각을 강체 이동해 같은 교점에서 비교합니다.') : describe(m.trap ? m.equal ? '90°와 90°는 합도 180°이고 크기도 같은 특별한 경우입니다.' : '합이 180°여도 동위각·엇각의 크기가 다르면 평행하지 않습니다.' : m.equal ? '두 각 조각이 정확히 포개어져 평행 조건을 만족합니다.' : '한쪽 변이 어긋나므로 평행 조건을 만족하지 않습니다.', `$${tex(m.p)}${m.equal ? '=' : '\\ne'}${tex(m.q)}$`));
  }
  function casePlans(d) {
    const cases = d.G.list.map((q, i) => ({ ...q, i, geometry: parallelGeometry(q.vP, q.vP - q.vQ) }));
    const m = { ...d, cases, answer: cases.filter(q => q.vP === q.vQ).map(q => q.i + 1) };
    return makePlan(m, 'judge-five', '보기판별', 9.8, `현재 생성된 ${cases.length}개 보기 · 같은 각인 그림 찾기`, 'independent-angle-overlays-for-current-five-choices',
      (b, t, m) => {
        const cols = b.W < 560 ? 2 : 3, rows = Math.ceil(m.cases.length / cols), cw = 3.05, ch = 3.1;
        prepare(b, [], { x0: -cols * cw / 2 - .15, x1: cols * cw / 2 + .15, y0: -rows * ch / 2 - .15, y1: rows * ch / 2 + .15 });
        m.cases.forEach((q, i) => {
          const c = P((i % cols - (cols - 1) / 2) * cw, (Math.floor(i / cols) - (rows - 1) / 2) * ch), G = q.geometry;
          const convert = p => P(c.x + p.x * .22, c.y + p.y * .22);
          const top = convert(G.P), bottom = convert(G.Q), start = i * 1.05 + .8, u = phase(t, start, start + 1.25), done = t >= start + 1.5;
          b.path([P(c.x - 1.24, top.y), P(c.x + 1.24, top.y)], { color: 'sky', width: 2 });
          b.path([at(bottom, G.phi, -1.05), at(bottom, G.phi, 1.05)], { color: 'sky', width: 2 });
          b.path([at(top, G.theta, .28), at(bottom, G.theta + 180, .28)], { color: 'rose', width: 2 });
          const from = q.kind === 'alt' ? 'c' : 'b', original = { ...G.W[from], V: top }, target = { ...G.W.f, V: bottom };
          mark(b, m.K, original, '', 'amber', { r: 13, fa: .35 });
          mark(b, m.K, target, '', 'violet', { r: 13, fa: .35, rings: 2 });
          transfer(b, m.K, original, bottom, q.kind === 'alt' ? 180 : 0, u, 'amber', '', { r: 19 });
          label(b, P(c.x, c.y - 1.27), `${['①','②','③','④','⑤'][i]} ${q.kind === 'alt' ? '엇각' : '동위각'}`, 'ink', { size: 13 });
          label(b, P(c.x, c.y + .85), `${deg(q.vP)}${done ? q.vP === q.vQ ? ' = ' : ' ≠ ' : ' , '}${deg(q.vQ)}`, done && q.vP === q.vQ ? 'green' : 'ink', { size: 13 });
          if (done) label(b, P(c.x, c.y + 1.35), q.vP === q.vQ ? '평행' : '평행 아님', q.vP === q.vQ ? 'green' : 'muted', { size: 12 });
        });
      },
      (t, m) => t < .8 ? describe('문제에 생성된 보기들을 그대로 비교합니다.') : t < 7.3 ? describe('각 조각을 하나씩 옮겨, 같은 위치의 두 각이 일치하는지 확인합니다.') : describe('그림의 기울기나 두 각의 합 대신, 표시된 두 각의 크기를 비교합니다.', `평행한 보기: ${m.answer.map(i => ['①','②','③','④','⑤'][i - 1]).join(', ')}`));
  }

  function bendBase(b, m, t, numeric, sourceModel = m.G, showCopies = true) {
    const G = sourceModel, K = m.K, sourceRay = G.sx > 0 ? 0 : 180;
    prepare(b, [G.A, G.P, G.B]);
    const left = Math.min(-3.55, G.A.x - .5, G.B.x - .5), right = Math.max(3.55, G.A.x + .5, G.B.x + .5);
    horizontal(b, K, -1.7, 'l', left, right); horizontal(b, K, 1.7, 'm', left, right);
    b.path([G.A, G.P, G.B], { color: 'rose', width: 3.6 });
    dot(b, G.A, 'A'); dot(b, G.B, 'B', 'ink', { dy: 18 }); dot(b, G.P, 'P', 'ink', { dx: G.sx * 17, dy: 0 });
    const wa = wedge(G.A, sourceRay, G.toA + 180), wb = wedge(G.B, sourceRay, G.toB + 180);
    mark(b, K, wa, `a=${deg(G.a)}`, 'amber', { flip: true });
    mark(b, K, wb, `b=${deg(G.b)}`, 'violet', { flip: true, rings: 2 });
    mark(b, K, wedge(G.P, G.toA, G.toB), numeric && t >= 7.2 ? deg(G.xf) : 'x', 'green', { r: t >= 2 ? 58 : 34, fa: .08 });
    if (showCopies) {
      auxiliary(b, G.P, phase(t, .8, 1.9));
      transfer(b, K, wa, G.P, 180, phase(t, 2, 3.9), 'amber', t >= 3.9 ? 'a' : '', { r: 21 });
      transfer(b, K, wb, G.P, 180, phase(t, 4, 5.9), 'violet', t >= 5.9 ? 'b' : '', { r: 21, rings: 2 });
    }
  }
  function bendPlan(d, numeric, direction) {
    const G = direction ? modelAt(d.D, d.s, { cDir: direction }) : d.G;
    const m = { ...d, G, answer: G.xf, numeric };
    const legacy = direction ? direction > 0 ? '오른쪽꺾임' : '왼쪽꺾임' : numeric ? '각크기' : '각의관계';
    return makePlan(m, `bend-${direction || (numeric ? 'value' : 'relation')}`, legacy, 8.8,
      `l ∥ m · ${direction ? direction > 0 ? 'P가 오른쪽 · ' : 'P가 왼쪽 · ' : ''}a=${deg(G.a)}, b=${deg(G.b)}`,
      'parallel-auxiliary-and-two-half-turn-angle-transfers',
      (b, t, m) => bendBase(b, m, t, m.numeric || !!direction),
      (t, m) => t < 2 ? describe('꺾인 점 P를 지나 두 직선에 평행한 보조선을 긋습니다.') : t < 4 ? describe('위쪽 각 a를 엇각 자리로 옮깁니다.') : t < 6.3 ? describe('아래쪽 각 b도 옮기면 두 각이 P에서 이웃합니다.') : describe('x는 옮겨 온 두 각을 합한 각입니다.', m.numeric || direction ? `$x=${tex(G.a)}+${tex(G.b)}=${tex(G.xf)}$` : '$x=a+b$'));
  }
  function auxiliaryCondition(d) {
    return makePlan(d, 'auxiliary-condition', '보조선조건', 8.4, `현재 P의 위치 유지 · 보조선 기울기 ${deg(d.G.psi)}`, 'auxiliary-rotates-about-current-bend-vertex',
      (b, t, m) => {
        bendBase(b, m, 0, false, m.G, false);
        const psi = m.G.psi * (1 - phase(t, 1.2, 4.4));
        auxiliary(b, m.G.P, 1, psi, 3.25);
        if (t < 4.4 && Math.abs(psi) > .05) mark(b, m.K, wedge(m.G.P, 0, psi), deg(psi), 'rose', { r: 30 });
        if (t >= 4.6) {
          const src = wedge(m.G.A, m.G.sx > 0 ? 0 : 180, m.G.toA + 180);
          transfer(b, m.K, src, m.G.P, 180, phase(t, 4.6, 6.5), 'amber', t >= 6.5 ? 'a' : '');
        }
      },
      t => t < 1.2 ? describe('보조선은 꺾인 점 P를 지나야 합니다.') : t < 4.4 ? describe('P를 고정하고 보조선의 기울기를 l과 같게 맞춥니다.') : t < 6.5 ? describe('이제 엇각 조각이 포개어지는지 확인합니다.') : describe('P를 지나고 l, m과 평행해야 엇각을 옮겨 쓸 수 있습니다.', '$\\text{보조선}\\parallel l\\parallel m$'));
  }
  function zigzagPlan(d, k) {
    const G = modelAt(d.D, d.s, { kK: k }), names = ['a', 'b', 'c', 'd'];
    const pieces = w => w.i === 0 ? [0] : w.i === k + 1 ? [k] : [w.i - 1, w.i];
    const right = G.R.flatMap(pieces), left = G.L.flatMap(pieces);
    const target = G.W[G.tar], other = target.side === 'R' ? G.L : G.R, own = target.side === 'R' ? G.R : G.L;
    const total = other.reduce((sum, w) => sum + w.val, 0), known = own.filter(w => w.i !== G.tar).reduce((sum, w) => sum + w.val, 0);
    const m = { ...d, G, right, left, target, total, known, answer: total - known };
    return makePlan(m, `zigzag-${k}`, ['한번꺾임', '두번꺾임', '세번꺾임'][k - 1], 9.6,
      `꺾인 점 ${k}개 · 현재 선분 기울기 유지 · 점 ${target.name}의 각 x`, 'segment-angle-transport-and-equal-component-regrouping',
      (b, t, m) => {
        const G = m.G, K = m.K;
        prepare(b, G.V, { y0: -2.8, y1: 4.0 });
        horizontal(b, K, -1.9, 'l'); horizontal(b, K, 1.9, 'm');
        b.path(G.V, { color: 'rose', width: 3.3 });
        G.W.forEach(w => {
          dot(b, w.V, w.name, 'ink', { dx: w.hv ? 0 : w.i % 2 ? 17 : -17, dy: w.i === 0 ? -17 : w.i === k + 1 ? 17 : 0 });
          mark(b, K, w, w.i === G.tar ? t >= 7.8 ? deg(m.answer) : 'x' : deg(w.val), w.i === G.tar ? 'green' : w.side === 'R' ? 'amber' : 'violet', { r: t >= 2 ? 37 : 25, flip: w.hv, rings: w.side === 'R' ? 1 : 2, size: 14 });
        });
        for (let i = 1; i <= k; i++) auxiliary(b, G.V[i], phase(t, .6 + i * .15, 1.6 + i * .15));
        for (let j = 0; j <= k; j++) {
          const from = wedge(G.V[j], j % 2 === 0 ? 0 : 180, angle(G.V[j], G.V[j + 1]));
          const u = phase(t, 1.7 + j * .65, 3.1 + j * .65);
          if (t >= 1.7) mark(b, K, from, '', COLORS[j], { r: 15, fa: .2 });
          transfer(b, K, from, G.V[j + 1], 180, u, COLORS[j], '', { r: 15, rings: 1 });
        }
        if (t >= 5.2) [m.right, m.left].forEach((order, row) => {
          const y = 2.8 + row * .65, factor = 5.2 / G.u.reduce((a, v) => a + v, 0), u = phase(t, 5.2, 6.7);
          let x = -2.1;
          label(b, P(-2.8, y), row ? '왼쪽' : '오른쪽', row ? 'violet' : 'amber', { size: 12 });
          order.forEach(j => {
            const w = G.u[j] * factor;
            b.path([P(x, y - .15), P(x + w * u, y - .15), P(x + w * u, y + .15), P(x, y + .15)], { close: true, fill: COLORS[j], fillAlpha: .3, color: COLORS[j], width: 1.5 });
            if (u > .9) label(b, P(x + w / 2, y), names[j], COLORS[j], { size: 13 });
            x += w;
          });
        });
      },
      (t, m) => t < 1.8 ? describe('모든 꺾인 점에 평행 보조선을 긋습니다.') : t < 5.2 ? describe('각 선분의 기울기를 나타내는 각 조각을 양 끝에서 짝지어 봅니다.') : t < 7.8 ? describe('오른쪽과 왼쪽의 합에는 같은 조각이 각각 한 번씩 들어갑니다.', '$\\text{오른쪽 각의 합}=\\text{왼쪽 각의 합}$') : describe('x가 있는 쪽의 알려진 각만 빼면 됩니다.', `$x=${tex(m.total)}-${tex(m.known)}=${tex(m.answer)}$`), [.8, 2.2, 5.2, 7.8]);
  }

  function polygonBase(b, m, t) {
    const G = m.G, K = m.K, tri = !G.V, vertices = tri ? [G.A, G.B, G.C] : G.V;
    prepare(b, vertices, { y1: m.two ? 3.5 : 2.8 });
    const left = Math.min(-3.55, ...vertices.map(p => p.x - .45)), right = Math.max(3.55, ...vertices.map(p => p.x + .45));
    horizontal(b, K, -1.7, 'l', left, right); horizontal(b, K, 1.7, 'm', left, right);
    b.path(vertices, { close: true, color: 'sky', fill: 'sky', fillAlpha: .09, width: 2 });
    const centre = P(vertices.reduce((s, p) => s + p.x, 0) / vertices.length, vertices.reduce((s, p) => s + p.y, 0) / vertices.length);
    vertices.forEach((p, i) => {
      b.ticks(p, vertices[(i + 1) % vertices.length], { count: 1, color: 'rose' });
      const v = P(p.x - centre.x, p.y - centre.y), len = Math.hypot(v.x, v.y) || 1;
      dot(b, p, 'ABCDEFGH'[i], 'ink', { dx: 18 * v.x / len, dy: 18 * v.y / len });
    });
    const chain = tri ? [G.B, G.A, G.C] : vertices.slice(0, G.end + 1);
    b.path(chain, { color: 'rose', width: 3.4 });
    const top = chain[0], bottom = chain[chain.length - 1], topNext = chain[1], bottomPrev = chain[chain.length - 2];
    mark(b, K, wedge(top, 0, angle(top, topNext)), `a=${deg(G.a)}`, 'amber', { flip: true });
    mark(b, K, wedge(bottom, 0, angle(bottom, bottomPrev)), m.numeric ? t >= 7.5 ? deg(G.b) : 'x' : 'b', 'green', { flip: true, rings: 2, r: 26 });
    return chain;
  }
  function polygonOne(d, numeric) {
    const tri = d.D.id === 'p3-1', I = tri ? 60 : d.G.I, n = tri ? 3 : d.G.n;
    const m = { ...d, numeric, I, n, answer: d.G.b };
    return makePlan(m, `${d.D.id}-${numeric ? 'value' : 'relation'}`, numeric ? 'x 구하기' : '각의 관계', 9.1,
      `l ∥ m · ${POLY[n]} · a=${deg(d.G.a)}${numeric ? ' · x=?' : ' · a와 b의 관계'}`, 'regular-polygon-interior-split-by-transported-alternate-angles',
      (b, t, m) => {
        const [top, middle, bottom] = polygonBase(b, m, t), K = m.K;
        const wa = wedge(top, 0, angle(top, middle)), wb = wedge(bottom, 0, angle(bottom, middle));
        const interior = wedge(middle, angle(middle, top), angle(middle, bottom));
        mark(b, K, interior, deg(m.I), 'green', { r: t >= 2 ? 58 : 34, fa: .08, size: 16 });
        auxiliary(b, middle, phase(t, .8, 1.9));
        transfer(b, K, wa, middle, 180, phase(t, 2, 3.8), 'amber', t >= 3.8 ? 'a' : '', { r: 20 });
        transfer(b, K, wb, middle, 180, phase(t, 4, 5.8), 'violet', t >= 5.8 ? m.numeric ? 'x' : 'b' : '', { r: 20, rings: 2 });
      },
      (t, m) => t < 2 ? describe(`${POLY[m.n]}의 내각 ${deg(m.I)}를 지나는 평행 보조선을 긋습니다.`) : t < 4 ? describe('위쪽의 각 a를 엇각 자리로 옮깁니다.') : t < 6.5 ? describe('아래쪽 각도 옮기면 두 조각이 정다각형의 한 내각을 채웁니다.') : describe('정다각형의 내각에서 이미 아는 각을 뺍니다.', m.numeric ? `$x=${tex(m.I)}-${tex(m.G.a)}=${tex(m.answer)}$` : `$a+b=${tex(m.I)}$`));
  }
  function polygonTwo(d, numeric) {
    const m = { ...d, numeric, two: true, I: d.G.I, n: d.G.n, answer: d.G.b };
    return makePlan(m, `polygon-two-${numeric ? 'value' : 'relation'}`, numeric ? 'x 구하기' : '각의 관계', 9.8,
      `l ∥ m · ${POLY[m.n]} · 내각 ${deg(m.I)} · a=${deg(m.G.a)}`, 'two-interiors-minus-transported-straight-angle',
      (b, t, m) => {
        const [A, B, C, D] = polygonBase(b, m, t), K = m.K;
        const wa = wedge(A, 0, angle(A, B)), wb = wedge(D, 0, angle(D, C));
        const c = wedge(B, 180, angle(B, C)), dd = wedge(C, 180, angle(C, B));
        [B, C].forEach(p => auxiliary(b, p, phase(t, .8, 1.8)));
        if (t < 4.7) {
          mark(b, K, wedge(B, angle(B, A), angle(B, C)), deg(m.I), 'green', { r: 43, fa: .06, at: { dx: -62, dy: -22 } });
          mark(b, K, wedge(C, angle(C, B), angle(C, D)), deg(m.I), 'green', { r: 43, fa: .06, at: { dx: -62, dy: 22 } });
        }
        transfer(b, K, wa, B, 180, phase(t, 1.9, 3.3), 'amber', t >= 3.3 ? 'a' : '', { r: 19 });
        transfer(b, K, wb, C, 180, phase(t, 3.4, 4.8), 'violet', t >= 4.8 ? m.numeric ? 'x' : 'b' : '', { r: 19, rings: 2 });
        if (t >= 4.8) {
          mark(b, K, c, 'c', 'sky', { r: 22 }); mark(b, K, dd, 'd', 'rose', { r: 22 });
          transfer(b, K, c, C, 0, phase(t, 5.2, 6.8), 'sky', '', { r: 31 });
        }
        if (t >= 6.8) label(b, P(0, 3.0), 'c + d = 180°', 'green');
      },
      (t, m) => t < 1.9 ? describe('두 꺾인 꼭짓점 B, C에 평행 보조선을 긋습니다.') : t < 4.8 ? describe('a와 b를 각각 옮겨 두 내각을 나눕니다.', `$a+c=${tex(m.I)},\\quad b+d=${tex(m.I)}$`) : t < 7.5 ? describe('가운데 c를 C로 옮기면 d와 함께 평각 180°를 만듭니다.', '$c+d=180^{\\circ}$') : describe('두 내각의 합에서 가운데 평각을 빼면 a와 b가 남습니다.', m.numeric ? `$x=2\\times${tex(m.I)}-180^{\\circ}-${tex(m.G.a)}=${tex(m.answer)}$` : `$a+b=2\\times${tex(m.I)}-180^{\\circ}=${tex(2 * m.I - 180)}$`), [.8, 1.9, 4.8, 7.5]);
  }

  // Orthographic projection of a rigid 3-D half-turn around the crease. z is
  // retained for tests: a shrinking 2-D projection is not a shrinking paper.
  function spin(p, origin, u, fraction) {
    const dx = p.x - origin.x, dy = p.y - origin.y, along = dx * u.x + dy * u.y;
    const perpendicular = -dx * u.y + dy * u.x, c = Math.cos(Math.PI * fraction), s = Math.sin(Math.PI * fraction);
    return { x: origin.x + along * u.x - perpendicular * u.y * c, y: origin.y + along * u.y + perpendicular * u.x * c, z: perpendicular * s };
  }
  function folding(t, initial, start, end) {
    if (t < 1.35) return initial * (1 - phase(t, .4, 1.35));
    return phase(t, start, end);
  }
  function tapeBase(b, t, m) {
    const G = m.G, K = m.K, flap = [G.B, G.C, G.F, G.E], reflected = flap.map(p => spin(p, G.B, G.u, 1));
    const left = Math.min(-3.75, G.A.x - .5), right = Math.max(3.6, G.E.x + .2);
    prepare(b, [...flap, ...reflected, G.A, P(left, 1.3)], { y0: -3.2, y1: 2.6 });
    b.path([P(left, 1.3), G.B, G.C, P(left, -1.3)], { close: true, fill: 'sky', fillAlpha: .13, color: null });
    horizontal(b, K, -1.3, 'l', left, right); horizontal(b, K, 1.3, 'm', left, right);
    b.path(flap, { close: true, color: 'muted', dash: [5, 5], width: 1.5, alpha: .5 });
    const f = folding(t, G.pat, 1.5, 3.8);
    b.path(flap.map(p => spin(p, G.B, G.u, f)), { close: true, fill: 'amber', fillAlpha: .24, color: 'ink', width: 2.2 });
    b.seg(G.B, G.C, { color: 'rose', width: 3.7 });
    dot(b, G.B, 'B', 'ink', { dy: 19 }); dot(b, G.C, 'C');
    mark(b, K, wedge(G.B, 0, G.a), `a=${deg(G.a)}`, 'amber', { r: 26 });
    if (f > .999) {
      dot(b, G.A, 'A', 'ink', { dy: -18 });
      mark(b, K, wedge(G.B, G.a, 2 * G.a), t >= 3.8 ? 'a' : '?', 'amber', { r: 26 });
      if (m.goal === 'value') mark(b, K, wedge(G.A, angle(G.A, G.B), 0), t >= 7.6 ? deg(G.x) : 'x', 'green', { r: 28, at: { dx: 0, dy: -48 } });
    }
    return f;
  }
  function tapePlan(d, goal) {
    const m = { ...d, goal, answer: goal === 'value' ? d.G.x : goal === 'triangle' ? 'AB=AC' : d.G.a };
    return makePlan(m, `tape-${goal}`, { fold: '접은 각', triangle: '삼각형', value: '각도' }[goal], goal === 'fold' ? 7.2 : 9.4,
      `현재 접는 선 BC · a=${deg(d.G.a)}${goal === 'value' ? ' · ∠A=x' : ''}`, 'hinged-paper-reflection-and-base-angle-transport',
      (b, t, m) => {
        const f = tapeBase(b, t, m), G = m.G;
        if (f > .999 && goal !== 'fold' && t >= 4) {
          transfer(b, m.K, wedge(G.B, 0, G.a), G.C, 180, phase(t, 4, 5.9), 'amber', t >= 5.9 ? 'a' : '', { r: 25 });
          if (t >= 6.2) {
            b.path([G.A, G.B, G.C], { close: true, fill: 'green', fillAlpha: .08, color: 'green', width: 2 });
            b.ticks(G.A, G.B, { color: 'rose', count: 1 }); b.ticks(G.A, G.C, { color: 'rose', count: 1 });
          }
        }
      },
      (t, m) => t < 1.5 ? describe('현재 접힌 부분을 펼쳐 원래 각과 접는 선을 확인합니다.') : t < 3.8 ? describe('종이 조각이 접는 선 BC를 축으로 반 바퀴 돌아갑니다.') : goal === 'fold' ? describe('접는 선 양쪽의 원래 각과 접힌 각은 같습니다.', `$\\angle EBC=\\angle ABC=${tex(m.G.a)}$`) : t < 6.2 ? describe('평행한 종이의 위·아래 변에서 엇각 a를 C로 옮깁니다.') : goal === 'triangle' ? describe('B와 C의 밑각이 같으므로 그 맞은편 변도 같습니다.', '$AB=AC\\quad(\\text{이등변삼각형})$') : t < 7.6 ? describe('삼각형 ABC의 두 밑각은 각각 a입니다.', '$x+a+a=180^{\\circ}$') : describe('삼각형의 내각 합에서 같은 밑각 두 개를 뺍니다.', `$x=180^{\\circ}-2\\times${tex(m.G.a)}=${tex(m.G.x)}$`), [.4, 1.5, 3.8, 6.2, 7.6]);
  }
  function cornerPlan(d, numeric) {
    const G = d.G, two = !!G.two, m = { ...d, numeric, two, answer: G.x };
    return makePlan(m, `${two ? 'two-corners' : 'corner'}-${numeric ? 'value' : 'relation'}`, numeric ? '각도' : '각의 관계', two ? 9.8 : 9,
      `직각 A · a=${deg(G.a)}${two ? `, b=${deg(G.b)}` : ''} · 현재 종이 폭 ${number(G.w)}`, two ? 'two-independent-crease-reflections-partition-a-right-angle' : 'crease-reflection-partitions-a-right-angle',
      (b, t, m) => {
        const G = m.G, K = m.K, f1 = folding(t, G.pat, 1.5, 3.6), f2 = m.two ? folding(t, G.pat, 3.7, 5.6) : 0;
        prepare(b, [G.A, G.B, G.D, G.TR, G.B1, ...(m.two ? [G.D2] : [])], { x0: G.xl - 1.4, x1: G.xr + .8, y0: -2.8, y1: 3.3 });
        const fixed = m.two ? [G.A, G.E1, G.TR, G.F2] : [G.A, G.E1, G.TR, G.D];
        b.path(fixed, { close: true, fill: 'sky', fillAlpha: .13, color: null });
        b.path([G.A, G.B, G.TR, G.D], { close: true, color: 'sky', width: 2.5 });
        b.path([G.A, G.B, G.E1], { close: true, color: 'muted', dash: [5, 5], width: 1.4 });
        b.path([G.A, G.B, G.E1].map(p => spin(p, G.A, G.u1, f1)), { close: true, fill: 'amber', fillAlpha: .27, color: 'ink', width: 2.1 });
        b.seg(G.A, G.E1, { color: 'rose', width: 3.5 });
        if (m.two) {
          b.path([G.A, G.D, G.F2], { close: true, color: 'muted', dash: [5, 5], width: 1.4 });
          b.path([G.A, G.D, G.F2].map(p => spin(p, G.A, G.u2, f2)), { close: true, fill: 'violet', fillAlpha: .24, color: 'ink', width: 2.1 });
          b.seg(G.A, G.F2, { color: 'rose', width: 3.5 }); dot(b, G.F2, 'F');
        }
        dot(b, G.A, 'A', 'ink', { dx: -19, dy: 15 }); dot(b, G.B, 'B', 'ink', { dy: 18 }); dot(b, G.D, 'D'); dot(b, G.E1, 'E', 'ink', { dx: 16, dy: 0 });
        b.right(G.A, at(G.A, 0, 1), at(G.A, 90, 1), { size: 14, color: 'muted' });
        mark(b, K, wedge(G.A, 0, G.a), `a=${deg(G.a)}`, 'amber', { r: 35, at: { dx: 56, dy: 25 } });
        if (m.two) mark(b, K, wedge(G.A, 90 - G.b, 90), `b=${deg(G.b)}`, 'violet', { rings: 2, r: 35, at: { dx: -38, dy: -58 } });
        if (f1 > .999) {
          dot(b, G.B1, 'B′', 'amber', { dx: 18, dy: 0 });
          mark(b, K, wedge(G.A, G.a, 2 * G.a), t >= 3.6 ? 'a' : '?', 'amber', { r: 35, at: { dx: 80, dy: -9 } });
        }
        if (m.two && f2 > .999) {
          dot(b, G.D2, 'D′', 'violet');
          mark(b, K, wedge(G.A, 90 - 2 * G.b, 90 - G.b), t >= 5.6 ? 'b' : '?', 'violet', { rings: 2, r: 35, at: { dx: 7, dy: -91 } });
        }
        if (f1 > .999 && (!m.two || f2 > .999)) {
          mark(b, K, wedge(G.A, 2 * G.a, m.two ? 90 - 2 * G.b : 90), m.numeric && t >= 7.5 ? deg(G.x) : 'x', 'green', { r: 44, rings: 3, at: { dx: 81, dy: -63 } });
          if (t >= 6.1) mark(b, K, wedge(G.A, 0, 90), '', 'muted', { r: 70, fa: .025, noRight: true });
        }
      },
      (t, m) => t < 1.5 ? describe('현재 종이를 펼쳐 꼭짓점 A의 직각과 접는 선을 확인합니다.') : t < 3.6 ? describe('아래쪽 귀퉁이를 접으면 접는 선 양쪽에 같은 각 a가 생깁니다.') : m.two && t < 5.6 ? describe('왼쪽 귀퉁이도 그 접는 선을 축으로 접어 같은 각 b를 만듭니다.') : t < 7.5 ? describe(m.two ? '직각을 a, a, x, b, b의 다섯 조각으로 나누어 봅니다.' : '직각을 a, a, x의 세 조각으로 나누어 봅니다.', m.two ? '$a+a+x+b+b=90^{\\circ}$' : '$a+a+x=90^{\\circ}$') : describe('직각에서 접힌 각의 두 배씩 빼면 가운데 각이 남습니다.', m.numeric ? `$x=90^{\\circ}-2\\times${tex(m.G.a)}${m.two ? `-2\\times${tex(m.G.b)}` : ''}=${tex(m.answer)}$` : m.two ? '$x=90^{\\circ}-2a-2b$' : '$x=90^{\\circ}-2a$'), [.4, 1.5, 3.6, ...(two ? [5.6] : []), 7.5]);
  }

  const builders = {
    'p1-1': d => [locationPlan(d, 'corr'), locationPlan(d, 'alt')],
    'p1-2': d => [conditionPlan(d, 'corr'), conditionPlan(d, 'alt'), parallelValue(d)],
    'p1-3': d => [judgement(d, false), judgement(d, true), casePlans(d)],
    'p2-1': d => [bendPlan(d, false), bendPlan(d, true)],
    'p2-2': d => [1, 2, 3].map(k => zigzagPlan(d, k)),
    'p2-3': d => [auxiliaryCondition(d), bendPlan(d, true, 1), bendPlan(d, true, -1)],
    'p3-1': d => [polygonOne(d, false), polygonOne(d, true)],
    'p3-2': d => [polygonOne(d, false), polygonOne(d, true)],
    'p3-3': d => [polygonTwo(d, false), polygonTwo(d, true)],
    'p4-1': d => ['fold', 'triangle', 'value'].map(goal => tapePlan(d, goal)),
    'p4-2': d => [cornerPlan(d, false), cornerPlan(d, true)],
    'p4-3': d => [cornerPlan(d, false), cornerPlan(d, true)]
  };
  function build(lab, state) {
    const K = typeof window === 'undefined' ? lab.api : window.APL_PA_KIT, D = lab.scene.pa;
    if (!K || !D || !builders[D.id]) return [];
    const s = clone(state), G = modelAt(D, s);
    return builders[D.id]({ K, D, s, G });
  }
  const registry = Object.fromEntries(Object.keys(builders).map(id => [`g7-parallel/${id}`, build]));
  const metadata = {
    'p1-1': [['동위각', 8.2], ['엇각', 8.2]],
    'p1-2': [['동위각조건', 8.8], ['엇각조건', 8.8], ['각크기', 9]],
    'p1-3': [['같은각', 8.6], ['합180함정', 8.6], ['보기판별', 9.8]],
    'p2-1': [['각의관계', 8.8], ['각크기', 8.8]],
    'p2-2': [['한번꺾임', 9.6], ['두번꺾임', 9.6], ['세번꺾임', 9.6]],
    'p2-3': [['보조선조건', 8.4], ['오른쪽꺾임', 8.8], ['왼쪽꺾임', 8.8]],
    'p3-1': [['각의 관계', 9.1], ['x 구하기', 9.1]],
    'p3-2': [['각의 관계', 9.1], ['x 구하기', 9.1]],
    'p3-3': [['각의 관계', 9.8], ['x 구하기', 9.8]],
    'p4-1': [['접은 각', 7.2], ['삼각형', 9.4], ['각도', 9.4]],
    'p4-2': [['각의 관계', 9], ['각도', 9]],
    'p4-3': [['각의 관계', 9.8], ['각도', 9.8]]
  };
  const lessonInfo = Object.fromEntries(Object.entries(metadata).map(([id, entries]) => [`g7-parallel/${id}`, entries.map(([legacyLabel, duration]) => ({ legacyLabel, duration }))]));
  return { build, registry, lessonInfo, phase, pose, sector, straightUnion, spin, folding, parallelGeometry };
});
