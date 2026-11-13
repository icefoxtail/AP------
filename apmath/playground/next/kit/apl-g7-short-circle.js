/* Individual circle/sector proofs. The two previously registered leaf/star
 * scenes remain in apl-g7-short-scenes.js. Every factory below reads an isolated
 * snapshot; explorer clocks, selected answers, seeds and inputs are untouched.
 * Motion uses our own proof clock and rigid geometry, never legacy cue playback.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root?.APLab) return;
  root.APLab.G7ShortCircle = api;
  Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
  Object.assign(root.APLab.G7ShortInfo = root.APLab.G7ShortInfo || {}, api.lessonInfo);
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  const PI = Math.PI, D = PI / 180, COLORS = ['sky', 'amber', 'green', 'violet', 'rose'];
  const clamp = x => Math.max(0, Math.min(1, x));
  const phase = (t, a, z) => { const u = clamp((t - a) / (z - a)); return u * u * (3 - 2 * u); };
  const pt = (x, y) => ({ x, y });
  const P = p => Array.isArray(p) ? pt(p[0], p[1]) : pt(p.x, p.y);
  const up = p => { const q = P(p); return pt(q.x, -q.y); };
  const mix = (p, q, t) => pt(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t);
  const mid = (p, q) => mix(p, q, .5);
  const clone = v => Array.isArray(v) ? Array.from(v, clone) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, a]) => [k, clone(a)])) : v;
  const num = x => String(Math.round(x * 1e9) / 1e9);
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  function rat(n, d = 1) {
    if (!Number.isFinite(n / d)) throw new Error('Non-finite circle coefficient');
    const v = n / d;
    for (let k = 1; k <= 3600; k++) if (Math.abs(v * k - Math.round(v * k)) < 1e-8) {
      const a = Math.round(v * k), g = gcd(a, k) || 1; return [a / g, k / g];
    }
    return null;
  }
  const fv = q => Array.isArray(q) ? q[0] / q[1] : q?.n != null ? q.n / q.d : +q;
  const fraction = (n, d = 1) => { const q = rat(n, d); return !q ? num(n / d) : q[1] === 1 ? String(q[0]) : `\\frac{${q[0]}}{${q[1]}}`; };
  const term = (n, symbol = '') => {
    if (Math.abs(n) < 1e-9) return '';
    const q = rat(Math.abs(n));
    if (!q) return `${num(n)}${symbol}`;
    const top = symbol && q[0] === 1 ? symbol : q[0] + symbol;
    return (n < 0 ? '-' : '') + (q[1] === 1 ? top : `\\frac{${top}}{${q[1]}}`);
  };
  const exact = (p = 0, c = 0, s = 0) => (p < 0 ? [term(c), term(s, '\\sqrt{3}'), term(p, '\\pi')] : [term(p, '\\pi'), term(c), term(s, '\\sqrt{3}')]).filter(Boolean).join('+').replace(/\+\-/g, '-') || '0';
  const canvasText = value => String(value).replace(/\\pi\b/g, 'π').replace(/\\sqrt\{([^{}]+)\}/g, '√$1').replace(/\\(?:dfrac|frac)\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2');
  const nativeExact = x => exact(fv(x.p), fv(x.c), fv(x.s));
  const unit = (value, power = 1, kind = 'cm') => `$${value}\\;\\mathrm{${kind}}${power === 2 ? '^2' : ''}$`;
  const frame = (label, formula = '', answer = false) => ({ label, formula, answer });
  const polar = (c, r, a) => pt(c.x + r * Math.cos(a), c.y + r * Math.sin(a));
  function arc(c, r, a, z, n = Math.max(12, Math.ceil(Math.abs(z - a) / D / 3))) {
    return Array.from({ length: n + 1 }, (_, i) => polar(c, r, a + (z - a) * i / n));
  }
  const sector = (c, r, a, z) => [c, ...arc(c, r, a, z)];
  const rect = (x, y, w, h) => [pt(x, y), pt(x + w, y), pt(x + w, y + h), pt(x, y + h)];
  const slide = (poly, dx) => poly.map(p => pt(p.x + dx, p.y));
  const rotate = (poly, c, a) => poly.map(p => { const x = p.x - c.x, y = p.y - c.y; return pt(c.x + x * Math.cos(a) - y * Math.sin(a), c.y + x * Math.sin(a) + y * Math.cos(a)); });
  const area = poly => Math.abs(poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p.x * q.y - p.y * q.x; }, 0)) / 2;
  const strip = value => String(value ?? '').replace(/<br\s*\/?\s*>|<\/p>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&times;/g, '×').replace(/&pi;/g, 'π').replace(/&minus;/g, '−').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const call = (v, ...args) => typeof v === 'function' ? v(...args) : v;
  const definitions = {
    'z0-center': ['중심·반지름'], 'z0-diameter': ['지름', '원주율'], 'z0-arc': ['호·현'], 'z0-sector': ['호의 길이', '넓이'], 'z0-segment': ['활꼴'],
    'z2-semi': [''], 'z2-quarter': [''], 'z2-sector': [''], 'z2-segment': [''], 'z3-circleProof': [''], 'z3-sectorProof': [''],
    '1101': ['원의 요소'], '1207': ['호와 현'], '1102': [''], '1103': [''], '1106': [''], '1210': ['호의 길이'], '1607': ['같은 중심각'],
    '1609': [''], '1610': [''], '1808': [''], '1209': ['호의 길이', '넓이'], '1719': [''], '1807': [''], '1104': [''], '1105': [''], '1809': [''], 'x01': ['중심각 합', '호 합', '넓이 합'],
    'f1-ss2': ['넓이', '둘레'], 'f1-lens': [''], 'f1-ex22': [''], 'f1-ring': [''],
    rot: [''], sj1: ['둘레', '넓이'], y12: ['둘레', '넓이'], cc08: ['둘레', '넓이'], lune13: [''], petal15: [''], nc: ['둘레', '넓이'], ns: ['둘레', '넓이'],
    'f3-leaf-len': [''], 'f3-rect-sector': ['AD 길이'], 'f3-two-arcs': ['넓이'], 'f3-crescent': ['넓이'], 'f3-four-leaf': ['네 잎 넓이'], 'f3-two-circles': ['넓이'], 'f3-half-sector': ['중심각'], 'f3-two-rects': ['합친 넓이'],
    'f4-sq12': [''], 'f4-circ2': ['넓이'], 'f4-turn': ['넓이'], 'f4-slide': [''], 'f4-slideq': [''], 'f4-swirl': [''], 'f4-inscr': [''], 'f4-ringmv': [''],
    'f5-sn': [''], 'f5-ring': [''], 'f5-ring240': ['둘레'], 'f5-star': ['둘레'], 'f5-lens': ['둘레'], 'f5-cut': ['둘레'], 'f5-track': ['둘레'], 'f5-sq4': [''], 'f5-rect': ['끈 길이'], 'f5-tri3': ['끈 길이'], 'f5-line': ['끈 길이'],
    'rl-rect': [''], 'rl-tri': [''], 'rl-rtri': [''], 'rl-turn60': [''], 'rl-turn45': [''], 'rl-semi': [''], 'rl-square': [''],
    'sw-square': [''], 'sw-rect': ['넓이'], 'sw-tri': ['넓이'], 'sw-center': ['거리'], 'sw-inside': ['넓이'],
    'gt-kennel': [''], 'gt-warehouse': [''], 'gt-tri': [''], 'gt-hex': ['넓이'], 'gt-spiral': ['넓이']
  };

  function prepare(b, points) {
    b.kind = 'figure'; b.aspect = '1:1'; b.setPanes(null);
    b.setInsets({ top: 50, right: 34, bottom: 80, left: 34 });
    const xs = points.map(p => p.x), ys = points.map(p => p.y), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);
    b.setFocus({ x: [x0 - .13 * w, x1 + .13 * w], y: [y0 - .18 * h, y1 + .22 * h] });
  }
  const line = (b, a, z, color = 'ink', o = {}) => b.path([a, z], { color, width: 2.5, ...o });
  const text = (b, p, value, color = 'ink', o = {}) => b.text(p, canvasText(value), { color, size: b.W < 560 ? 14 : 16, weight: 750, align: 'center', baseline: 'middle', ...o });
  const shape = (b, poly, color = 'sky', alpha = .17, o = {}) => b.path(poly, { close: true, color, fill: color, fillAlpha: alpha, width: 2.5, ...o });
  const path = (b, poly, color = 'sky', o = {}) => b.path(poly, { color, width: 3, ...o });
  const dot = (b, p, label = '', color = 'ink', o = {}) => { b.point(p, { color, r: 4.5 }); if (label) text(b, p, label, color, { dy: 19, ...o }); };
  function eo(b, polys, color = 'green', alpha = .2) {
    const c = b.ctx; c.save(); c.beginPath();
    for (const poly of polys) { poly.forEach((p, i) => { const q = b.toS(p.x, p.y); if (i) c.lineTo(q.x, q.y); else c.moveTo(q.x, q.y); }); c.closePath(); }
    c.fillStyle = b.color(color, alpha); c.fill('evenodd'); c.restore();
  }
  function angle(b, c, a, z, label, radius, color = 'amber') {
    path(b, arc(c, radius, a, z), color, { width: 2.5 });
    if (label) text(b, polar(c, radius + 19 / (b.k || 40), (a + z) / 2), label, color);
  }
  function cornerAngle(b, vertex, p, q, label, r, color = 'amber') {
    const a = Math.atan2(p.y - vertex.y, p.x - vertex.x); let d = Math.atan2(q.y - vertex.y, q.x - vertex.x) - a;
    while (d > PI) d -= 2 * PI; while (d < -PI) d += 2 * PI;
    angle(b, vertex, a, a + d, label, r, color);
  }
  function radius(b, c, r, a, label, color = 'amber') {
    const end = polar(c, r, a); line(b, c, end, color); if (label) text(b, mid(c, end), label, color, { dy: -17 });
  }
  function trace(b, poly, progress, color = 'amber') {
    if (progress <= 0 || poly.length < 2) return;
    const f = progress * (poly.length - 1), k = Math.min(poly.length - 2, Math.floor(f)), out = poly.slice(0, k + 1);
    out.push(mix(poly[k], poly[k + 1], f - k)); path(b, out, color, { width: 5 });
    b.point(out[out.length - 1], { color, r: 5 });
  }
  function item(b, it) {
    const p = it.p && P(it.p), q = it.q && P(it.q), color = it.color || 'ink';
    if (it.k === 'text' && (!it.when || it.when === 'g')) text(b, p, strip(it.text), color, { dx: it.dx || 0, dy: it.dy || 0, align: it.align || 'center' });
    else if (it.k === 'seg') line(b, p, q, color, { dash: it.dash, width: it.w || 2 });
    else if (it.k === 'dot') dot(b, p);
    else if (it.k === 'ticks') b.ticks(p, q, { count: it.count || it.n || 1, color });
  }

  function bind(id, lab, state) {
    const scene = lab.scene;
    if (!scene || scene.id !== id) return null;
    const sourceState = clone(state), read = clone(state);
    const original = call(scene.problem?.text, read) || call(scene.question, read) || scene.title;
    // Native problem HTML also contains an already selected answer's feedback.
    // Keep the current state, but the proof's given is the actual question stem.
    const stem = String(original).match(/<div class="(?:f[1345]-q|csd-stem)">([\s\S]*?)<\/div>/)?.[1]
      || String(original).match(/<p class="rl-stmt">([\s\S]*?)<\/p>/)?.[1];
    const question = strip(stem || original);
    const m = { id, title: scene.title, sourceState, question };
    if (scene.csModel) { m.native = clone(scene.csModel(clone(sourceState))); m.values = Object.fromEntries((scene.csSpec.vars || []).map(v => [v.k, sourceState[scene.csKeys.K(v.k)]])); }
    else if (scene.f5Model) { m.native = clone(scene.f5Model(read)); m.band = scene.f5Kind === 'band'; }
    else if (scene.f3) { m.live = clone(scene.f3.model(read, false)); m.native = clone(scene.f3.model(read, true)); }
    else if (scene.csd) { m.native = clone(scene.csd.make(read).M); }
    else if (scene.rl) {
      const liveCfg = sourceState.cfg && Object.keys(scene.rl.base).every(k => k in sourceState.cfg) ? sourceState.cfg : scene.rl.base;
      m.liveCfg = clone(liveCfg); m.live = rollingModel(scene.rl.shape, m.liveCfg);
      // This is the native probCfg eligibility rule. In particular its Sym
      // objects are not finite numbers, so any symbolic radius uses base cfg.
      const valid = m.live.turns.every(x => x.r < 1e-9 || (m.live.kind === 'semi' || nativeRollingFraction(x.r)) && nativeRollingFraction(x.r * x.deg / 180));
      m.fallback = !(valid && (!scene.rl.probOK || scene.rl.probOK(m.liveCfg)));
      m.cfg = clone(m.fallback ? scene.rl.base : m.liveCfg); m.native = rollingModel(scene.rl.shape, m.cfg);
      m.sourceQuestion = question;
      m.question = strip(scene.rl.statement(m.cfg)) + ` 회전 ${m.native.N}번.`;
    }
    else if (id.startsWith('z')) { m.r = read.csR; m.th = id.includes('semi') ? 180 : id.includes('quarter') ? 90 : id.includes('sector') && !id.startsWith('z3') ? read.csA : read.csS; m.n = read.csN || 16; m.a = read.csQ; }
    else if (['rot', 'sj1', 'y12', 'cc08', 'lune13', 'petal15', 'nc', 'ns'].includes(id)) {
      m.values = Object.fromEntries(Object.entries(sourceState).filter(([k]) => k.startsWith(`f02_${id}_`)).map(([k, v]) => [k.slice(id.length + 5), v]));
      m.native = compoundModel(id, m.values);
    } else m.values = Object.fromEntries(Object.entries(sourceState).filter(([k]) => k.startsWith(`b${id}_`)).map(([k, v]) => [k.slice(id.length + 2), v]));
    return m;
  }

  function baseDraw(b, t, m, label) {
    const r = m.r, c = pt(0, 0), a = -PI / 2, th = (m.th || 90) * D, z = a + th;
    const perimeter = m.id.startsWith('z2'), segment = m.id.includes('segment'), conceptArc = m.id === 'z0-arc';
    if (m.id.startsWith('z3')) return areaPiecesDraw(b, t, m);
    if (m.id === 'z0-diameter' && label === '원주율') {
      const u = phase(t, 1.2, 5.7), cx = 2 * PI * r * u, center = pt(cx, -r);
      prepare(b, [pt(-r, -2 * r), pt((2 * PI + 1) * r, .7 * r)]);
      line(b, pt(-r, 0), pt((2 * PI + .6) * r, 0), 'muted');
      path(b, arc(center, r, 0, 2 * PI), 'sky');
      const mark = polar(center, r, PI / 2 + u * 2 * PI); radius(b, center, r, PI / 2 + u * 2 * PI, '', 'amber'); dot(b, mark, 'P', 'amber');
      if (u > 0) line(b, pt(0, 0), pt(cx, 0), 'green', { width: 5 });
      for (let i = 0; i < 3; i++) { const x = 2 * r * i; if (t > 5.7) { line(b, pt(x, .4 * r), pt(x + 2 * r, .4 * r), 'rose', { width: 5 }); text(b, pt(x + r, .4 * r), '지름', 'rose', { dy: 20 }); } }
      text(b, center, `r=${num(r)} cm`, 'sky', { dy: -r * (b.k || 1) - 20 });
      return;
    }
    prepare(b, [pt(-r, -r), pt(r, r)]);
    if (m.id === 'z0-center') {
      path(b, arc(c, r, 0, 2 * PI)); dot(b, c, 'O', 'ink', { dx: -16, dy: 8 });
      const a0 = -m.a * D; radius(b, c, r, a0, `r=${num(r)} cm`);
      const aa = a0 + 2 * PI * phase(t, 1, 5.6); radius(b, c, r, aa, '', 'green'); dot(b, polar(c, r, aa), 'P', 'green');
      if (t > 3) [a0 + PI / 2, a0 + PI, a0 + 3 * PI / 2].forEach(x => { line(b, c, polar(c, r, x), 'muted', { dash: [4, 4] }); b.ticks(c, polar(c, r, x), { count: 1, color: 'green' }); });
      return;
    }
    if (m.id === 'z0-diameter') {
      path(b, arc(c, r, 0, 2 * PI)); line(b, pt(-r, 0), pt(r, 0), 'ink');
      trace(b, [pt(-r, 0), c], phase(t, .8, 2.6), 'sky'); trace(b, [c, pt(r, 0)], phase(t, 2.8, 4.6), 'green');
      dot(b, c, 'O'); text(b, pt(-r / 2, 0), `${num(r)} cm`, 'sky', { dy: -22 }); text(b, pt(r / 2, 0), `${num(r)} cm`, 'green', { dy: -22 });
      return;
    }
    if (conceptArc || segment) {
      path(b, arc(c, r, 0, 2 * PI), 'muted', { dash: [5, 5], width: 1.4 });
      shape(b, arc(c, r, a, z), 'sky', segment ? .18 : .04); path(b, arc(c, r, a, z), 'sky');
      line(b, polar(c, r, a), polar(c, r, z), 'rose');
      line(b, c, polar(c, r, a), 'muted', { dash: [5, 5] }); line(b, c, polar(c, r, z), 'muted', { dash: [5, 5] });
      dot(b, c, 'O'); dot(b, polar(c, r, a), 'A', 'ink', { dy: -19 }); dot(b, polar(c, r, z), 'B', 'ink', { dx: 14 });
      trace(b, arc(c, r, a, z), phase(t, .8, 3.3), 'sky'); trace(b, [polar(c, r, z), polar(c, r, a)], phase(t, 3.6, 5.8), 'rose');
      angle(b, c, a, z, `${m.th}°`, r * .23); text(b, pt(-r * .2, -r * .52), `r=${num(r)} cm`, 'muted', { align: 'right' });
      return;
    }
    const full = m.id === 'z0-sector';
    if (full) path(b, arc(c, r, 0, 2 * PI), 'muted', { dash: [5, 5], width: 1.5 });
    shape(b, sector(c, r, a, z), 'sky', .14); dot(b, c, 'O', 'ink', { dx: -15 });
    radius(b, c, r, a, `${num(r)} cm`); radius(b, c, r, z, perimeter ? `${num(r)} cm` : '', 'rose'); angle(b, c, a, z, `${m.th}°`, r * .22);
    if (label === '넓이') {
      const n = 24, visible = phase(t, 1.2, 5.6) * n;
      for (let i = 0; i < n; i++) if (visible > i) shape(b, sector(c, r, a + i * th / n, a + (i + 1) * th / n), i % 2 ? 'sky' : 'green', .2);
    } else {
      trace(b, arc(c, r, a, z), phase(t, .9, 3.8), 'sky');
      if (perimeter) { trace(b, [polar(c, r, z), c], phase(t, 3.8, 4.9), 'rose'); trace(b, [c, polar(c, r, a)], phase(t, 4.9, 6), 'rose'); }
    }
  }
  function baseFrame(t, m, label) {
    const r = m.r, th = m.th, arcT = exact(r * th / 180);
    if (m.id.startsWith('z3')) return areaPiecesFrame(t, m);
    const steps = m.id === 'z0-center' ? ['원 위의 현재 점 P와 중심 O를 잇습니다.', 'OP를 중심 O 둘레로 돌려 봅니다.', '끝점이 원 위에 머무르며 반지름의 길이는 같습니다.']
      : m.id === 'z0-diameter' ? label === '지름' ? ['지름은 중심 O를 지납니다.', '한쪽 반지름을 따라 중심까지 갑니다.', '다른 쪽 반지름까지 잇습니다. 같은 길이가 두 번입니다.'] : ['원에 찍힌 점이 바닥에 닿은 자리에서 시작합니다.', '미끄러지지 않고 한 바퀴 굴리면 원주가 바닥에 남습니다.', '남긴 길이는 지름 세 개보다 조금 깁니다. 원주÷지름을 π라 정합니다.']
      : m.id.includes('segment') || m.id === 'z0-arc' ? ['원 위의 A, B와 주어진 중심각을 확인합니다.', 'A에서 B까지 굽은 경계를 따라가면 호입니다.', 'A와 B를 바로 잇는 현을 확인합니다. 반지름은 이 경계에 포함되지 않습니다.']
      : label === '넓이' ? ['같은 반지름인 원에서 부채꼴을 찾습니다.', '작은 각 조각마다 넓이가 같은 부채꼴 한 조각이 대응합니다.', '중심각이 차지하는 비율과 넓이가 차지하는 비율이 같습니다.']
      : ['주어진 반지름과 중심각을 확인합니다.', '원의 한 바퀴 중 중심각이 차지하는 호를 따라갑니다.', m.id.startsWith('z2') ? '호 끝에서 두 반지름을 따라 돌아와야 경계가 닫힙니다.' : '호의 길이는 전체 원주에 중심각의 비율을 곱합니다.'];
    if (t < 6.8) return frame(steps[t < 1.3 ? 0 : t < 3.8 ? 1 : 2]);
    if (m.id === 'z0-center') return frame('중심에서 원 위의 모든 점까지 거리는 반지름입니다.', unit(`OP=r=${num(r)}`), true);
    if (m.id === 'z0-diameter') return label === '지름' ? frame('지름은 반지름 두 개의 합입니다.', unit(`d=${r}+${r}=${2 * r}`), true) : frame('원주율은 원주와 지름의 비입니다.', `$\\pi=\\frac{C}{d},\\quad C=2\\pi\\times${r}=${exact(2 * r)}\\;\\mathrm{cm}$`, true);
    if (m.id === 'z0-arc') return frame('호는 곡선, 현은 두 끝점을 곧게 잇는 선분입니다.', '두 점 사이에서 현의 길이가 더 짧습니다.', true);
    if (m.id === 'z0-segment') return frame('호와 현으로 둘러싸인 부분이 활꼴입니다.', '중심각이 180°이면 활꼴과 부채꼴이 모두 반원이 됩니다.', true);
    if (m.id === 'z2-segment') {
      const chord = Math.abs(th - 60) < 1e-7 ? String(r) : Math.abs(th - 180) < 1e-7 ? String(2 * r) : null;
      return frame('활꼴의 둘레는 호와 현의 합입니다.', chord ? unit(`${arcT}+${chord}`) : `$P=${arcT}+\\overline{AB}\\;\\mathrm{cm}$ (현의 길이는 별도로 구합니다.)`, true);
    }
    if (m.id.startsWith('z2')) return frame('경계를 이루는 호와 곧은 부분을 모두 더합니다.', unit(`${arcT}+${2 * r}`), true);
    return label === '넓이' ? frame('부채꼴의 넓이 = 원의 넓이 × 중심각의 비율', unit(`\\pi\\times${r}^2\\times\\frac{${th}}{360}=${exact(r * r * th / 360)}`, 2), true)
      : frame('호의 길이 = 원주 × 중심각의 비율', unit(`2\\pi\\times${r}\\times\\frac{${th}}{360}=${arcT}`), true);
  }

  function areaPiecesDraw(b, t, m) {
    const circ = m.id === 'z3-circleProof', r = m.r, th = circ ? 2 * PI : m.th * D, n = circ ? m.n : Math.max(2, 2 * Math.ceil(m.th / 20));
    const da = th / n, chord = 2 * r * Math.sin(da / 2), h = r * Math.cos(da / 2), width = n * chord / 2;
    const copyAt = m.copyAt ?? 1.1, moveAt = m.moveAt ?? 2.6, settledAt = m.settledAt ?? 5.6;
    const source = sector(pt(0, 0), r, -PI / 2, -PI / 2 + th), xc = r * 2.2 + width / 2, spread = 1 + .55 * (1 - phase(t, moveAt, settledAt));
    const pieces = Array.from({ length: n }, (_, i) => {
      const down = i % 2 === 0, x = (Math.floor(i / 2) + (down ? .5 : 1)) * chord - width / 2;
      const c = pt(xc + x * spread, down ? -h / 2 : h / 2), a = down ? PI / 2 : -PI / 2;
      return sector(c, r, a - da / 2, a + da / 2);
    });
    prepare(b, source.concat(...pieces));
    for (let i = 0; i < n; i++) shape(b, sector(pt(0, 0), r, -PI / 2 + i * da, -PI / 2 + (i + 1) * da), i % 2 ? 'green' : 'sky', .18, { width: 1 });
    radius(b, pt(0, 0), r, -PI / 2, t < (m.radiusKnownAt ?? 0) ? 'r = ?' : `r=${r} cm`);
    if (m.sourceArea) text(b, polar(pt(0, 0), r * .6, -PI / 2 + th / 2), m.sourceArea, 'green');
    if (m.sourceArc) text(b, polar(pt(0, 0), r, -PI / 2 + th / 2), m.sourceArc, 'sky', { dy: -20 });
    if (m.angleKnown) angle(b, pt(0, 0), -PI / 2, -PI / 2 + th, `${m.th}°`, r * .22);
    if (m.traceGivenArc) trace(b, arc(pt(0, 0), r, -PI / 2, -PI / 2 + th), phase(t, .8, 3.2), 'sky');
    // A second, explicitly copied row starts separated. Only horizontal sliding
    // happens in this row; the source figure remains as a size reference.
    if (t > copyAt) pieces.forEach((p, i) => shape(b, p, i % 2 ? 'green' : 'sky', .22 * phase(t, copyAt, copyAt + .4), { width: 1.4 }));
    if (t >= settledAt) {
      line(b, pt(xc - width / 2, -h / 2), pt(xc + width / 2, -h / 2), 'amber', { dash: [4, 4] });
      text(b, pt(xc, -h / 2), circ ? '가로 → 원주의 절반' : '가로 → 호의 절반', 'amber', { dy: -21 });
      text(b, pt(xc + width / 2, 0), '높이 → r', 'green', { dx: 18, align: 'left' });
    }
  }
  function areaPiecesFrame(t, m) {
    const circ = m.id === 'z3-circleProof', th = circ ? 360 : m.th, r = m.r;
    if (t < 1.1) return frame(circ ? `현재 ${m.n}개의 같은 부채꼴로 원을 나눕니다.` : `중심각 ${m.th}°인 부채꼴을 같은 작은 각으로 나눕니다.`);
    if (t < 2.6) return frame('같은 조각의 복사본을 방향이 번갈아 나오도록 나란히 놓습니다.');
    if (t < 5.6) return frame('가로로 밀어 조각끼리 맞물립니다. 각 조각의 크기는 그대로입니다.');
    if (t < 6.8) return frame('조각을 더 잘게 나누면 높이는 r, 가로는 호의 절반인 직사각형에 가까워집니다.');
    return frame('그 극한의 가로 × 높이로 넓이를 구합니다.', unit(circ ? `${exact(r)}\\times${r}=${exact(r * r)}` : `\\frac12\\times${r}\\times${exact(r * th / 180)}=${exact(r * r * th / 360)}`, 2), true);
  }

  const sectorBasics = new Set(['1209', '1210', '1609', '1610', '1808']);
  function basicDraw(b, t, m, label) {
    const q = m.values, id = m.id, O = pt(0, 0), R = q.r || 5;
    if (id === 'x01') {
      const n = q.n, da = 2 * PI / n, u = phase(t, 1.2, 5.4), gap = q.r * 1.2;
      const parts = Array.from({ length: n }, (_, i) => {
        const c = pt((i - (n - 1) / 2) * gap * (1 - u), 0), a = -PI / 2 + i * da;
        return { c, a, poly: sector(c, q.r, a, a + da) };
      });
      prepare(b, [pt(-(n - 1) / 2 * gap - q.r, -q.r), pt((n - 1) / 2 * gap + q.r, q.r)]);
      parts.forEach((p, i) => { shape(b, p.poly, COLORS[i % 5], label === '넓이 합' ? .3 : .13); if (label !== '넓이 합') path(b, arc(p.c, q.r, p.a, p.a + da), COLORS[i % 5], { width: label === '호 합' ? 5 : 2 }); });
      radius(b, parts[0].c, q.r, parts[0].a, `r=${q.r} cm`);
      if (label === '중심각 합' && t > 2) parts.forEach(p => angle(b, p.c, p.a, p.a + da, '', q.r * .22));
      return;
    }
    if (sectorBasics.has(id)) {
      if (id === '1210' || id === '1610') {
        const details = id === '1210'
          ? { sourceArea: `S=${exact(q.r * q.r * q.th / 360)} cm²` }
          : { sourceArc: `${exact(q.r * q.th / 180)} cm`, angleKnown: true, traceGivenArc: true, radiusKnownAt: 3.4, copyAt: 4.2, moveAt: 4.4, settledAt: 6.3 };
        areaPiecesDraw(b, t, { id: 'z3-sectorProof', r: q.r, th: q.th, n: 16, ...details });
        return;
      }
      const th = q.th * D, a = -PI / 2;
      prepare(b, [pt(-R, -R), pt(R, R)]);
      path(b, arc(O, R, 0, 2 * PI), 'muted', { dash: [5, 5], width: 1.5 }); shape(b, sector(O, R, a, a + th), 'sky', .15);
      radius(b, O, R, a, id === '1808' && t < 6.8 ? 'r = ?' : `r=${q.r} cm`);
      line(b, O, polar(O, R, a + th), 'ink'); dot(b, O, 'O', 'ink', { dx: -15 });
      angle(b, O, a, a + th, id === '1609' && t < 6.8 ? '?°' : `${q.th}°`, R * .23);
      if (['1210', '1609'].includes(id)) text(b, polar(O, R * .65, a + th / 2), `${exact(q.r * q.r * q.th / 360)} cm²`, 'green');
      if (['1610', '1808'].includes(id)) text(b, polar(O, R, a + th / 2), `${fraction(q.r * q.th, 180).replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')}π cm`, 'sky', { dx: 20, align: 'left' });
      trace(b, arc(O, R, a, a + th), phase(t, .8, 3), 'sky');
      if (t > 3) for (let i = 0; i < 12; i++) if (phase(t, 3, 5.8) * 12 > i) shape(b, sector(O, R, a + th * i / 12, a + th * (i + 1) / 12), i % 2 ? 'green' : 'amber', .16, { width: 1 });
      return;
    }
    if (id !== '1809') {
      prepare(b, [pt(-R, -R), pt(R, R)]); path(b, arc(O, R, 0, 2 * PI), 'muted', { width: 1.6 }); dot(b, O, 'O', 'ink', { dx: -14, dy: 12 });
    }
    const spoke = (a, name, color = 'ink') => { const p = polar(O, R, -a * D); line(b, O, p, color); dot(b, p, name, color, { dx: 10 * Math.cos(a * D), dy: -18 * Math.sin(a * D) }); return p; };
    const wedge = (a, th, color, alpha = .17) => shape(b, sector(O, R, -a * D, -(a + th) * D), color, alpha);
    if (id === '1101') {
      const A = spoke(0, 'A'), B = spoke(q.th, 'B'); line(b, A, B, 'rose');
      trace(b, arc(O, R, 0, -q.th * D), phase(t, .7, 2.8), 'sky'); trace(b, [A, B], phase(t, 2.8, 4.3), 'rose');
      if (t > 4.3) { const a = phase(t, 4.3, 6) * PI, aP = polar(O, R, a), zP = polar(O, R, a + PI); line(b, aP, zP, 'green', { width: 4 }); }
      return;
    }
    if (id === '1207') {
      const demo = t > 3.2, a = demo ? 60 : q.al, z = demo ? 120 : q.be;
      const P0 = spoke(0, 'A'), A = spoke(a, 'B', 'sky'), B = spoke(-z, 'C', 'green');
      path(b, arc(O, R, 0, -a * D), 'sky'); path(b, arc(O, R, 0, z * D), 'green'); line(b, P0, A, 'sky', { width: 4 }); line(b, P0, B, 'green', { width: 4 });
      angle(b, O, 0, -a * D, `${a}°`, R * .25, 'sky'); angle(b, O, 0, z * D, `${z}°`, R * .25, 'green');
      if (demo) { text(b, mid(P0, A), 'r', 'sky', { dx: 18 }); if (t > 5.6) text(b, mid(P0, B), '< 2r', 'green', { dy: 18 }); }
      return;
    }
    if (id === '1607') {
      const A = spoke(-q.ph, 'A'), B = spoke(0, 'B'), C = spoke(q.ph, 'C');
      line(b, A, B, 'sky', { width: 4 }); line(b, B, C, 'sky', { width: 4 }); line(b, A, C, 'rose', { width: 4 });
      b.ticks(A, B, { count: 1 }); b.ticks(B, C, { count: 1 });
      angle(b, O, q.ph * D, 0, '', R * .23, 'amber'); angle(b, O, 0, -q.ph * D, '', R * .23, 'amber');
      const moved = rotate([A, B], O, -q.ph * D * phase(t, 1.1, 3.7)); path(b, moved, 'amber', { width: 5 });
      if (t > 3.7) { trace(b, [A, B, C], phase(t, 3.7, 5.7), 'green'); trace(b, [A, C], phase(t, 5.7, 6.6), 'rose'); }
      return;
    }
    if (id === '1102') {
      const entries = [{ a: 145, th: q.t1, val: `${fraction(q.u * q.t1, 5)} cm`, ang: `${q.t1}°` }, { a: 5, th: q.t2, val: 'x cm', ang: `${q.t2}°` }, { a: 220, th: q.y, val: `${fraction(q.u * q.y, 5)} cm`, ang: 'y°' }];
      entries.forEach((e, i) => { wedge(e.a, e.th, COLORS[i]); spoke(e.a, ''); spoke(e.a + e.th, ''); angle(b, O, -e.a * D, -(e.a + e.th) * D, e.ang, R * .28, COLORS[i]); text(b, polar(O, R * 1.1, -(e.a + e.th / 2) * D), e.val.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2'), COLORS[i]); if (t > 1 + i * 1.5) trace(b, arc(O, R, -e.a * D, -(e.a + e.th) * D), phase(t, 1 + i * 1.5, 2.5 + i * 1.5), COLORS[i]); });
      return;
    }
    if (id === '1103') {
      const total = q.a + q.b + q.c, da = 360 / total, counts = [q.a, q.b, q.c]; let start = 0;
      counts.forEach((n, i) => { wedge(start, n * da, COLORS[i], .2); spoke(start, 'ABC'[i]); text(b, polar(O, R * .68, -(start + n * da / 2) * D), `${n}칸`, COLORS[i]); start += n * da; });
      for (let i = 0; i < Math.floor(total * phase(t, 1, 5.5)); i++) line(b, O, polar(O, R, -i * da * D), 'amber', { width: 1.6 });
      return;
    }
    if (id === '1106') {
      // Match the native AOB/COD figure: four distinct boundary points, with
      // AOB centred on the left and COD on the right of the same circle.
      const a0 = 180 - q.al / 2, a1 = 180 + q.al / 2, c0 = -q.be / 2, c1 = q.be / 2;
      wedge(a0, q.al, 'amber'); wedge(c0, q.be, 'rose');
      for (let i = 0; i < Math.floor(12 * phase(t, 1, 5.5)); i++) line(b, O, polar(O, R, -(a0 + q.al * i / 12) * D), 'green', { width: 1 });
      [a0, a1, c0, c1].forEach((a, i) => spoke(a, 'ABCD'[i]));
      angle(b, O, -a0 * D, -a1 * D, `${q.al}°`, R * .24); angle(b, O, -c0 * D, -c1 * D, `${q.be}°`, R * .24, 'rose');
      text(b, polar(O, R * .66, -PI), `${fraction(q.S * q.al, 360).replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')}π cm²`, 'amber', { dy: -30 });
      text(b, polar(O, R * .66, 0), 'x cm²', 'rose', { dy: -30 });
      return;
    }
    if (id === '1719') {
      const ph = 180 / (q.n + 1), A = spoke(180, 'A'), B = spoke(0, 'B'), C = spoke(ph, 'C'); line(b, A, C, 'rose');
      b.ticks(O, A, { count: 1 }); b.ticks(O, C, { count: 1 });
      cornerAngle(b, A, O, C, 'x', R * .24, 'rose');
      path(b, arc(O, R, -PI, -ph * D), 'sky', { width: 4 }); path(b, arc(O, R, -ph * D, 0), 'amber', { width: 4 });
      text(b, polar(O, R * .65, -(180 + ph) * D / 2), `${q.n}칸`, 'sky'); text(b, polar(O, R * .75, -ph * D / 2), '1칸', 'amber');
      if (t > 2.8) angle(b, O, -PI, -ph * D, `${fraction(180 * q.n, q.n + 1)}°`, R * .25, 'green');
      if (t > 4.5) shape(b, [A, O, C], 'green', .12);
      return;
    }
    if (id === '1807') {
      const x = q.cof / 3, a0 = -q.cof / 2;
      const A = spoke(180 - x / 2, 'A'), B = spoke(180 + x / 2, 'B'); line(b, A, B, 'rose'); b.ticks(A, B, { count: 1 });
      const right = Array.from({ length: 4 }, (_, i) => spoke(a0 + i * x, 'CDEF'[i]));
      for (let i = 0; i < 3; i++) { line(b, right[i], right[i + 1], 'sky'); b.ticks(right[i], right[i + 1], { count: 1 }); if (t > 1.1 + i * 1.5) wedge(a0 + i * x, x, COLORS[i], .23); }
      if (t > 4.4) { const from = 180 - x / 2; path(b, rotate([O, A, B], O, -(a0 - from) * D * phase(t, 4.4, 6.4)), 'rose', { width: 4 }); }
      return;
    }
    if (id === '1104' || id === '1105') {
      const v = id === '1104' ? q.al : q.be;
      const A = spoke(180, 'A'), B = spoke(0, 'B');
      if (id === '1104') {
        const C = spoke(180 + v, 'C'), E = spoke(360 - v, 'D'); line(b, C, E, 'rose');
        cornerAngle(b, O, A, C, `${v}°`, R * .23);
        if (t > 1.5) { b.ticks(O, C, { count: 1 }); b.ticks(O, E, { count: 1 }); shape(b, [O, C, E], 'green', .12); cornerAngle(b, C, O, E, `${v}°`, R * .2); cornerAngle(b, E, C, O, `${v}°`, R * .2); }
        if (t > 3.6) angle(b, O, -(180 + v) * D, -(360 - v) * D, `${180 - 2 * v}°`, R * .26);
        if (t > 5) trace(b, arc(O, R, -(180 + v) * D, -(360 - v) * D), phase(t, 5, 6.6));
      } else {
        const C = polar(O, R, -2 * v * D), E = spoke(v, 'D'); line(b, A, C, 'rose'); dot(b, C, 'C', 'ink', { dy: -18 });
        cornerAngle(b, O, B, E, `${v}°`, R * .23);
        if (t > 1.3) { line(b, O, C, 'green', { dash: [5, 5] }); b.ticks(O, A, { count: 1 }); b.ticks(O, C, { count: 1 }); }
        if (t > 3.6) { shape(b, [A, O, C], 'green', .12); cornerAngle(b, A, O, C, `${v}°`, R * .21); cornerAngle(b, C, A, O, `${v}°`, R * .21); }
        if (t > 5) trace(b, arc(O, R, -PI, -2 * v * D), phase(t, 5, 6.6));
      }
      text(b, mid(A, B), '평행한 두 선', 'rose', { dy: 24 });
      return;
    }
    if (id === '1809') {
      const n = [3, 4, 5, 6, 8][Math.max(0, Math.min(4, Math.round(q.i) - 1))], inner = 180 * (n - 2) / n;
      const points = [O]; let p = O;
      for (let i = 0; i < n - 1; i++) { p = pt(p.x + q.r * Math.cos(-i * 2 * PI / n), p.y + q.r * Math.sin(-i * 2 * PI / n)); points.push(p); }
      prepare(b, points.concat(sector(O, q.r, -inner * D, 0))); shape(b, points, 'muted', .07); shape(b, sector(O, q.r, -inner * D, 0), 'sky', .19);
      text(b, mid(points[0], points[1]), `${q.r} cm`, 'sky', { dy: 20 });
      if (t > 1.5) for (let i = 2; i < n - 1; i++) line(b, O, points[i], 'amber', { dash: [5, 5] });
      if (t > 4) angle(b, O, -inner * D, 0, `${num(inner)}°`, q.r * .22);
    }
  }
  function basicFrame(t, m, label) {
    const q = m.values, id = m.id;
    let steps, formula, result;
    if (sectorBasics.has(id)) {
      const l = exact(q.r * q.th / 180), a = exact(q.r * q.r * q.th / 360);
      if (id === '1610') {
        if (t < 1.4) return frame('주어진 호의 길이와 중심각을 확인합니다. 반지름 r은 아직 미지수입니다.');
        if (t < 3.4) return frame('호는 원주의 중심각÷360만큼입니다. 이 식에서 반지름을 먼저 구합니다.', `$${l}=2\\pi r\\times\\frac{${q.th}}{360}$`);
        if (t < 4.2) return frame('양쪽을 같은 비율로 나누어 반지름을 얻습니다.', unit(`r=${l}\\times\\frac{360}{2\\pi\\times${q.th}}=${q.r}`));
        if (t < 6.3) return frame('같은 작은 부채꼴의 복사본을 가로로 밀어 맞물립니다. 넓이는 보존됩니다.');
        if (t < 6.8) return frame('더 잘게 나누면 가로는 호의 절반, 높이는 구한 반지름에 가까워집니다.', `$S=\\frac12\\times${q.r}\\times${l}$`);
        return frame('반지름과 호의 길이를 이용한 부채꼴의 넓이입니다.', unit(a, 2), true);
      }
      const target = id === '1209' ? label : id === '1210' ? '호의 길이' : id === '1609' ? '중심각' : id === '1610' ? '넓이' : '반지름';
      steps = ['주어진 반지름·호·중심각 중 구하려는 양을 ?로 남깁니다.', '같은 원에서 호와 부채꼴이 차지하는 비율은 중심각÷360입니다.', ['1210', '1610'].includes(id) ? '호의 절반을 밑변, 반지름을 높이로 생각하면 넓이는 ½rl입니다.' : '전체 원의 양과 부채꼴의 비율을 대응시킵니다.'];
      formula = target === '중심각' ? `$\\frac{x}{360}=\\frac{${a}}{${exact(q.r * q.r)}}$` : target === '반지름' ? `$${l}=2\\pi r\\times\\frac{${q.th}}{360}$` : target === '넓이' ? `$S=\\frac12\\times${q.r}\\times${l}$` : id === '1210' ? `$l=2\\times${a}\\div${q.r}$` : `$l=2\\pi\\times${q.r}\\times\\frac{${q.th}}{360}$`;
      result = target === '중심각' ? `$x=${q.th}^\\circ$` : target === '반지름' ? unit(`r=${q.r}`) : unit(target === '넓이' ? a : l, target === '넓이' ? 2 : 1);
    } else if (id === '1101') { steps = ['원의 두 점 A, B를 확인합니다.', '굽은 선은 호, 두 점을 바로 이은 선분은 현입니다.', '지름은 중심을 지나는 현이며 반지름 두 개만큼 깁니다.']; result = '② 두 점을 이은 선분은 호가 아니라 현입니다.'; }
    else if (id === '1207') { steps = ['현재 두 중심각에 대한 호와 현을 구별합니다.', '호는 중심각에 비례하지만 현은 곧은 지름길입니다.', '같은 반지름에서 60°와 120°를 비교합니다. 60°의 현은 r, 120°의 현은 2r보다 짧습니다.']; result = '③ 현의 길이는 중심각에 정비례하지 않습니다.'; }
    else if (id === '1607') { steps = ['같은 중심각에 대응하는 두 현과 두 호를 봅니다.', '첫 현을 중심 둘레로 돌리면 둘째 현과 포개집니다.', 'A→B→C 두 현의 합보다 A→C 직선이 짧습니다. 호는 두 호를 그대로 이어 붙입니다.']; result = '③ AC의 현은 BC의 2배가 아닙니다. AB=BC, 호 AC=2×호 BC.'; }
    else if (id === '1102') { const k = q.u / 5; steps = ['세 호의 알려진 각과 길이를 확인합니다.', '같은 작은 중심각 하나에는 같은 호의 길이가 대응합니다.', '기준 호의 길이÷기준 각을 두 다른 호에도 적용합니다.']; formula = `$x=${fraction(k * q.t1)}\\times\\frac{${q.t2}}{${q.t1}},\\quad y=${q.t1}\\times\\frac{${fraction(k * q.y)}}{${fraction(k * q.t1)}}$`; result = `$x+y=${fraction(k * q.t2)}+${q.y}=${fraction(k * q.t2 + q.y)}$`; }
    else if (id === '1103') { const total = q.a + q.b + q.c; steps = ['호의 비와 각의 비는 같습니다.', `원을 ${total}개의 같은 각 조각으로 나눕니다.`, `AB에는 그중 ${q.a}조각이 대응합니다.`]; formula = `$360^\\circ\\div${total}\\times${q.a}$`; result = `$\\angle AOB=${fraction(360 * q.a, total)}^\\circ$`; }
    else if (id === '1106') { steps = ['알려진 부채꼴과 구하려는 부채꼴을 봅니다.', '같은 작은 각 조각마다 같은 넓이가 대응합니다.', '넓이의 비는 중심각의 비와 같습니다.']; formula = `$x=${exact(q.S * q.al / 360)}\\times\\frac{${q.be}}{${q.al}}$`; result = unit(exact(q.S * q.be / 360), 2); }
    else if (id === '1719') { const p = 180 / (q.n + 1); steps = ['지름이 가르는 반원 전체는 180°입니다.', `${q.n}:1의 호에 중심각도 ${q.n}:1로 나뉩니다.`, 'OA=OC인 이등변삼각형에서 남은 두 밑각은 같습니다.']; formula = `$\\angle AOC=${fraction(180 - p)}^\\circ,\\quad x=\\frac{180-${fraction(180 - p)}}2$`; result = `$x=${fraction(p / 2)}^\\circ$`; }
    else if (id === '1807') { steps = ['같은 길이의 현 네 개를 확인합니다.', '반지름 두 변도 같으므로 각 현을 마주 보는 삼각형이 합동입니다.', '∠COF는 같은 중심각 세 개를 이어 붙인 각입니다.']; formula = `$3x=${q.cof}^\\circ$`; result = `$\\angle AOB=${fraction(q.cof, 3)}^\\circ$`; }
    else if (id === '1104' || id === '1105') { const v = id === '1104' ? q.al : q.be, th = 180 - 2 * v; steps = ['평행한 선과 주어진 각을 확인합니다.', id === '1104' ? '엇각이 같고 두 반지름이 같아 밑각도 같습니다.' : 'OC를 그으면 동위각과 같은 반지름으로 두 밑각이 같습니다.', '삼각형에서 두 밑각을 빼면 목표 호의 중심각을 얻습니다.']; formula = `$180^\\circ-2\\times${v}^\\circ=${th}^\\circ$`; result = unit(`2\\pi\\times${q.r}\\times\\frac{${th}}{360}=${exact(q.r * th / 180)}`); }
    else if (id === '1809') { const n = [3, 4, 5, 6, 8][Math.max(0, Math.min(4, Math.round(q.i) - 1))], th = 180 * (n - 2) / n; steps = [`현재 정${n}각형에서 한 꼭짓점이 부채꼴의 중심입니다.`, `삼각형 ${n - 2}개로 나누어 내각의 합을 셉니다.`, '내각의 합을 꼭짓점 수로 나누면 이 부채꼴의 중심각입니다.']; formula = `$180\\times(${n}-2)\\div${n}=${fraction(th)}^\\circ$`; result = unit(exact(q.r * q.r * th / 360), 2); }
    else { steps = [`현재 ${q.n}조각은 같은 원을 똑같이 나눈 부채꼴입니다.`, '방향과 크기를 그대로 두고 가로로 모읍니다.', label === '중심각 합' ? '중심각들이 한 점 둘레를 빠짐없이 채웁니다.' : label === '호 합' ? '각 조각의 굽은 경계가 원주 한 바퀴를 만듭니다.' : '겹치거나 빠진 부분 없이 원 하나를 채웁니다.']; result = label === '중심각 합' ? '$360^\\circ$' : unit(exact(label === '호 합' ? 2 * q.r : q.r * q.r), label === '넓이 합' ? 2 : 1); }
    if (t < 1.4) return frame(steps[0]);
    if (t < 3.4) return frame(steps[1]);
    if (t < 6.8) return frame(steps[2], t > 5.5 ? formula || '' : '');
    return frame('도형의 대응을 식으로 정리합니다.', result, true);
  }

  function cutDraw(b, t, m, label) {
    const M = m.native, cuts = M.cuts.flatMap(x => x.polys), outline = M.outer, xs = outline.map(p => p.x), w = Math.max(...xs) - Math.min(...xs);
    const movement = label === '둘레' ? 0 : phase(t, 3.9, 6.1), dx = w * 1.25 * movement;
    prepare(b, outline.concat(...cuts.map(p => slide(p, w * 1.25))));
    eo(b, [outline, ...cuts], 'green', .22); path(b, [...outline, outline[0]], 'ink');
    for (const p of cuts) path(b, [...p, p[0]], 'sky');
    for (const it of M.fig || []) item(b, it);
    if (label === '둘레') {
      const edges = M.edges || [], count = edges.length, f = phase(t, .8, 6.2) * count;
      edges.forEach((e, i) => { trace(b, e.pts, clamp(f - i), COLORS[i % 5]); if (f > i + .95 && t > 2.5) text(b, P(e.at), e.text, COLORS[i % 5], { dx: e.dx || 0, dy: e.dy || 0, align: e.align || 'center' }); });
      return;
    }
    if (m.id === 'f1-lens' && t > 1.2 && t < 3.9) {
      const a = m.values.a; shape(b, sector(pt(0, a), a, -PI / 2, 0), 'amber', .13); shape(b, sector(pt(a, 0), a, PI / 2, PI), 'sky', .13);
      line(b, pt(0, a), pt(a, 0), 'muted', { dash: [5, 5] });
    }
    if (m.id === 'f1-ex22' && t > 1.2 && t < 3.9) {
      const a = m.values.a; shape(b, sector(pt(0, a), a, -PI / 2, 0), 'sky', .12); shape(b, arc(pt(a / 2, a), a / 2, PI, 2 * PI), 'amber', .16);
    }
    if (t > .8) for (const p of cuts) shape(b, slide(p, dx), 'amber', .28 * phase(t, .8, 1.4), { dash: movement > 0 ? [] : [4, 4] });
    if (movement > .99) {
      const p = cuts.flat(), x = p.reduce((v, z) => v + z.x, 0) / p.length + dx, y = p.reduce((v, z) => v + z.y, 0) / p.length;
      text(b, pt(x, y), '빼는 조각', 'amber');
    }
  }
  function cutFrame(t, m, label) {
    const M = m.native, v = m.values;
    if (label === '둘레') {
      if (t < 1.5) return frame('색칠한 영역의 실제 바깥 경계를 따라갑니다.');
      if (t < 4) return frame('큰 사분원호와 작은 반원호는 모두 경계입니다.', `$r_{\\text{작은 반원}}=${v.a}\\div2$`);
      if (t < 6.8) return frame('남은 곧은 변도 더합니다. 안쪽의 보조선은 세지 않습니다.');
      return frame('경계의 세 부분을 모두 더합니다.', unit(M.periEq), true);
    }
    const mechanism = m.id === 'f1-ss2' ? '반원의 지름은 사분원의 반지름과 같습니다. 작은 반지름은 그 절반입니다.'
      : m.id === 'f1-lens' ? '두 사분원의 넓이 합은 정사각형을 한 번, 겹친 잎을 한 번 셉니다.'
      : m.id === 'f1-ex22' ? '파낸 조각은 큰 사분원에서 반원을 뺀 부분입니다.' : '두 부채꼴의 중심각은 같습니다. 반지름의 제곱에 따른 넓이를 비교합니다.';
    if (t < 1.3) return frame('전체 도형과 실제로 파낸 부분을 구별합니다.');
    if (t < 3.9) return frame(mechanism);
    if (t < 6.8) return frame('빼는 조각을 가로로 꺼냅니다. 전체에서 이 넓이를 한 번 뺍니다.', `$(${nativeExact(M.wholeX)})-(${nativeExact(M.partX)})$`);
    return frame('남은 색칠한 부분의 넓이입니다.', unit(nativeExact(M.resX), 2), true);
  }
  function piecePose(piece, u) {
    return piece.polys.map(poly => piece.tf.kind === 'slide' ? slide(poly, piece.tf.dx * u) : rotate(poly, P(piece.tf.c), piece.tf.ang * D * u));
  }
  function moveDraw(b, t, m) {
    const M = m.native, u = phase(t, 1.6, 5.7), moving = M.pieces.filter(p => p.fill !== false), src = moving.flatMap(p => p.polys);
    const all = [...M.shade0, ...M.target, ...M.pieces.flatMap(p => p.dst), ...M.pieces.flatMap(p => piecePose(p, .5))]; prepare(b, all.flat());
    // This native Cartesian model cuts the corner at (0,H), the upper left.
    // Keep its coordinates and horizontal translation instead of reflecting it.
    if (m.id === 'f4-slideq') b.kind = 'cartesian';
    if (M.crossfade) { eo(b, M.shade0, 'green', .22 * (1 - u)); if (u > 0) eo(b, M.target, 'green', .22 * u); }
    else eo(b, M.shade0.concat(src), 'green', .22);
    (M.base || []).forEach(p => path(b, p.pts, 'muted', { width: 1.7, dash: [4, 4] }));
    (M.fig || []).forEach(it => item(b, it));
    M.pieces.forEach((piece, i) => {
      const polys = piecePose(piece, u);
      if (piece.fill !== false) eo(b, polys, u > .99 ? 'green' : 'amber', .3);
      else eo(b, polys, 'amber', .24 * (1 - u));
      for (const p of polys) path(b, [...p, p[0]], piece.fill === false ? 'amber' : u > .99 ? 'green' : 'amber', { width: 3, alpha: piece.fill === false ? 1 - u : 1 });
      if (t < 1.6) { const p = polys[0][Math.floor(polys[0].length / 2)]; text(b, p, String(i + 1), 'amber', { dy: -18 }); }
      if (piece.tf.kind === 'rot') dot(b, P(piece.tf.c), '', 'amber');
    });
    if (u > .99) M.target.forEach(p => path(b, [...p, p[0]], 'green', { width: 3.5 }));
  }
  function moveFrame(t, m) {
    const M = m.native, steps = {
      'f4-sq12': ['정사각형 안의 두 반원과 겹친 조각을 찾습니다.', '겹친 잎을 두 활꼴로 나눕니다. 반지름과 각이 같은 빈자리와 짝지읍니다.', '두 조각을 각 반원의 중심에서 90°씩 돌립니다. 대각선 아래 삼각형을 채웁니다.'],
      'f4-circ2': ['같은 반지름인 두 원의 중심 사이 거리를 확인합니다.', '오른쪽의 반원은 왼쪽의 빈 반원과 합동입니다.', '반원을 왼쪽으로 밀면 높이가 지름인 직사각형이 됩니다.'],
      'f4-turn': ['회전하기 전과 후의 반원은 같은 크기입니다.', '반원의 한 끝점을 중심으로 회전합니다. 반대 끝점의 반지름은 지름입니다.', '회전한 반원을 원래 반원과 포개면 둘은 상쇄되고 부채꼴이 남습니다.'],
      'f4-slide': ['직사각형에서 파낸 반원과 오른쪽에 붙인 반원을 찾습니다.', '두 반원의 반지름이 같아 조각이 정확히 맞습니다.', '오른쪽 반원을 가로로 밀어 왼쪽 빈자리를 채웁니다.'],
      'f4-slideq': ['파낸 사분원과 붙인 사분원을 찾습니다.', '반지름과 90°인 중심각이 같아 두 조각이 합동입니다.', '같은 조각을 가로로 밀어 직사각형을 채웁니다.'],
      'f4-swirl': ['큰 반원 안팎의 작은 반원을 비교합니다.', '두 작은 반원은 같은 반지름입니다.', '붙은 작은 반원을 180° 돌리면 빈 반원을 채워 큰 반원만 남습니다.'],
      'f4-inscr': ['원과 정사각형이 만든 두 반원 조각을 찾습니다.', '왼쪽의 빈 조각과 오른쪽 조각이 합동입니다.', '중심에서 180° 돌리면 정사각형의 절반이 채워집니다.'],
      'f4-ringmv': ['고리 부분과 작은 부채꼴의 중심각이 같습니다.', '작은 부채꼴은 고리의 빈 부채꼴과 같은 반지름입니다.', '중심에서 돌려 빈자리에 끼우면 큰 부채꼴 하나가 됩니다.']
    }[m.id];
    if (t < .8) return frame(steps[0]);
    if (t < 1.6) return frame(steps[1]);
    if (t < 6.8) return frame(steps[2]);
    return frame('회전·이동으로 넓이는 변하지 않습니다.', unit(M.eqTex, 2), true);
  }

  function perimeterPiece(p, u = 1) {
    return p.kind === 'arc' ? arc(p.c, p.R, p.rev ? p.a1 : p.a0, p.rev ? p.a1 - (p.a1 - p.a0) * u : p.a0 + (p.a1 - p.a0) * u) : [p.p, mix(p.p, p.q, u)];
  }
  function bandParts(M) {
    const parts = [];
    for (const e of M.G.edges) {
      const a = pt(M.r * (e.a.x + e.n.x), M.r * (e.a.y + e.n.y)), z = pt(M.r * (e.b.x + e.n.x), M.r * (e.b.y + e.n.y));
      parts.push({ kind: 'seg', p: a, q: z, cm: 2 * M.r, name: '직선', len: { n: 0, d: 1, c: 2 * M.r } });
    }
    for (const a of M.arcs) { const v = M.G.V[a.v]; parts.push({ kind: 'arc', c: pt(v.x * M.r, v.y * M.r), R: M.r, a0: a.a0, a1: a.a1, rcm: M.r, deg: a.deg, name: '원호', len: { n: a.len[0], d: a.len[1], c: 0 } }); }
    return parts;
  }
  function regionPoints(ops) {
    const out = [];
    for (const op of ops) {
      if (op.t === 'M' || op.t === 'L') out.push(P(op.p));
      else if (op.t === 'A') {
        let end = op.a1;
        if (op.ccw) while (end > op.a0) end -= 2 * PI;
        else while (end < op.a0) end += 2 * PI;
        out.push(...arc(P(op.c), op.R, op.a0, end));
      }
    }
    return out;
  }
  const perimeterStart = m => m.id === 'f5-lens' ? 3.1 : m.id === 'f5-ring240' ? 2.4 : m.band || m.id === 'f5-sn' || m.id === 'f5-star' ? 1.8 : .8;
  function perimeterContext(b, t, m) {
    const M = m.native;
    const regions = M.regions || M.petals || (M.region ? [M.region] : []);
    regions.forEach(ops => shape(b, regionPoints(ops), 'sky', .16, { color: 'sky', width: 1 }));
    if (m.id === 'f5-sn') {
      path(b, arc(pt(0, 0), 1.5, 0, 2 * PI), 'muted', { width: 1.5 });
      const pts = [-1.5, -.5, .5, 1.5].map(x => pt(x, 0)); line(b, pts[0], pts[3], 'muted');
      pts.forEach(p => dot(b, p));
      for (let i = 0; i < 3; i++) b.ticks(pts[i], pts[i + 1], { count: 1 });
      text(b, pt(0, -1.5), `AD=${M.AD} cm`, 'ink', { dy: -22 });
    } else if (m.id === 'f5-star') {
      path(b, [...rect(-1, -1, 2, 2), pt(-1, -1)], 'muted'); path(b, arc(pt(0, 0), 1, 0, 2 * PI), 'muted', { width: 1.4 });
      text(b, pt(0, 1), `한 변 ${M.sd} cm`, 'ink', { dy: 23 });
      if (t > .8 && t < 1.8) radius(b, pt(0, 0), 1, 0, `${M.sd}÷2 cm`);
    } else if (m.id === 'f5-lens') {
      const A = pt(0, -Math.sqrt(3) / 2), B = pt(0, Math.sqrt(3) / 2);
      [M.O1, M.O2].forEach((c, i) => { path(b, arc(c, 1, 0, 2 * PI), 'muted', { width: 1.5 }); dot(b, c, i ? 'O′' : 'O', 'ink', { dx: i ? 15 : -15, dy: 18 }); });
      dot(b, A, 'A', 'ink', { dy: -20 }); dot(b, B, 'B'); line(b, M.O1, M.O2, 'ink'); text(b, pt(0, 0), `${M.R} cm`, 'ink', { dy: 21 });
      if (t > .8) for (const z of [A, B]) { line(b, M.O1, z, 'amber'); line(b, M.O2, z, 'amber'); b.ticks(M.O1, z, { count: 1 }); b.ticks(M.O2, z, { count: 1 }); }
      if (t > .8) b.ticks(M.O1, M.O2, { count: 1 });
      if (t > 1.8 && t < 3.1) { angle(b, M.O1, -PI / 3, 0, '60°', .26); angle(b, M.O1, 0, PI / 3, '60°', .26, 'green'); }
    } else if (m.id === 'f5-ring' || m.id === 'f5-ring240') {
      const g = M.g, O = pt(0, 0), a = m.id === 'f5-ring' ? -g.t : -g.h;
      radius(b, O, g.r, m.id === 'f5-ring' ? 0 : PI, `${g.r} cm`, 'muted');
      if (m.id === 'f5-ring') { radius(b, O, g.R, a, `${g.R} cm`, 'muted'); angle(b, O, a, 0, `${g.th}°`, g.r * .3); }
      else angle(b, O, -g.h, g.h, `${g.phi}°`, g.r * .4);
      dot(b, O, 'O', 'ink', { dx: -16 });
    } else if (m.band) {
      const c = M.G.uniq[0]; radius(b, pt(c.x * M.r, c.y * M.r), M.r, PI, `r=${M.r} cm`, 'muted');
    }
  }
  function perimeterDraw(b, t, m) {
    const M = m.native, parts = m.band ? bandParts(M) : M.P, all = parts.flatMap(p => perimeterPiece(p));
    if (m.id === 'f5-sn') all.push(pt(-1.5, -1.5), pt(1.5, 1.5));
    if (m.id === 'f5-lens') all.push(pt(-1.5, -1), pt(1.5, 1));
    if (m.id === 'f5-ring' || m.id === 'f5-ring240') all.push(pt(0, 0));
    prepare(b, all);
    if (m.band) {
      M.G.uniq.forEach(p => path(b, arc(pt(p.x * M.r, p.y * M.r), M.r, 0, 2 * PI), 'muted', { width: 1.5 }));
      M.G.edges.forEach(e => line(b, pt(e.a.x * M.r, e.a.y * M.r), pt(e.b.x * M.r, e.b.y * M.r), 'muted', { dash: [4, 4], width: 1.2 }));
    }
    perimeterContext(b, t, m);
    parts.forEach(p => path(b, perimeterPiece(p), 'ink', { width: 2.4 }));
    const start = perimeterStart(m), f = phase(t, start, 6.2) * parts.length;
    parts.forEach((p, i) => {
      const u = clamp(f - i), color = p.kind === 'arc' ? COLORS[i % 4] : 'rose';
      if (u > 0) trace(b, perimeterPiece(p), u, color);
      if (t >= start && (u > 0 && u < 1 || i === Math.min(parts.length - 1, Math.floor(f)) && t < 6.8)) {
        if (p.kind === 'arc') { radius(b, p.c, p.R, p.a0, `${num(p.rcm)} cm`, color); radius(b, p.c, p.R, p.a1, '', color); angle(b, p.c, p.a0, p.a1, `${num(p.deg)}°`, p.R * .26, color); }
        else text(b, mid(p.p, p.q), `${num(p.cm ?? p.len.c)} cm`, 'rose', { dy: -20 });
      }
    });
    // These native condition labels sit beside the very boundary being traced.
    // Paint their halos last so the proof's coloured strokes cannot erase them.
    if (m.id === 'f5-sn') [-1.5, -.5, .5, 1.5].forEach((x, i) => text(b, pt(x, 0), 'ABCD'[i], 'ink', { dy: i % 2 ? 20 : -20 }));
    if (m.id === 'f5-ring240') text(b, mid(M.P[1].p, M.P[1].q), `폭 ${M.g.w} cm`, 'ink', { dy: -20 });
  }
  function perimeterFrame(t, m) {
    const M = m.native, parts = m.band ? bandParts(M) : M.P;
    const start = perimeterStart(m), f = phase(t, start, 6.2) * parts.length, i = Math.min(parts.length - 1, Math.floor(f)), p = parts[i];
    if (t < .8) return frame(m.band ? `같은 반지름인 원 ${M.n}개를 두른 끈의 바깥 경계를 봅니다.` : '현재 도형의 바깥 경계를 처음부터 끝까지 따라갑니다.');
    if (t < start) return frame(m.id === 'f5-lens' ? '두 중심과 교점을 이은 삼각형은 세 변이 같은 정삼각형입니다. 60° 두 개가 모여 호의 중심각은 120°입니다.'
      : m.id === 'f5-ring240' ? `바깥 반지름은 ${M.g.r}+${M.g.w}, 남은 중심각은 360°−${M.g.phi}°입니다.`
      : m.id === 'f5-sn' ? '지름 AD를 삼등분합니다. AC·BD는 두 칸, AB·CD는 한 칸이므로 반지름을 각각 절반으로 구합니다.'
      : m.id === 'f5-star' ? '원의 반지름과 사분원의 반지름은 모두 정사각형 한 변의 절반입니다.'
      : '접점의 반지름은 끈과 수직입니다. 모서리에서 굽는 중심각은 중심들을 이은 다각형의 외각입니다.');
    if (t < 6.2) return frame(p.kind === 'arc' ? `${p.name}: 중심과 반지름을 잡고 중심각만큼 원주의 일부를 셉니다.` : `${p.name}: 곧은 부분의 길이를 셉니다.`, p.kind === 'arc' ? `$2\\pi\\times${p.rcm}\\times\\frac{${p.deg}}{360}$` : unit(String(p.cm ?? p.len.c)));
    if (t < 6.8) return frame(m.band ? `굽은 부분의 중심각 합은 ${M.degSum}°로 원 한 바퀴입니다. 직선 ${M.E}개는 각각 지름과 같습니다.` : '처음 점으로 돌아왔습니다. 호와 직선을 빠짐없이 한 번씩 더합니다.');
    return frame(m.band ? '끈 길이 = 곧은 부분 + 반지름 r인 원주' : '경계 길이의 합이 둘레입니다.', unit(exact(M.total.n / M.total.d, M.total.c)), true);
  }

  function shortArc(c, a, z) {
    const r = Math.hypot(a.x - c.x, a.y - c.y), from = Math.atan2(a.y - c.y, a.x - c.x); let d = Math.atan2(z.y - c.y, z.x - c.x) - from;
    while (d > PI) d -= 2 * PI; while (d < -PI) d += 2 * PI;
    return arc(c, r, from, from + d);
  }
  function compoundModel(id, v) {
    const items = [], base = [], labels = [];
    const semi = (name, c, r, a, sign = 1) => { const poly = arc(c, r, a, a - PI); const x = { name, c, r, poly, curve: poly, sign, p: r * r / 2, constant: 0, length: r }; items.push(x); return x; };
    const disk = (name, c, r, sign = 1) => { const poly = arc(c, r, 0, 2 * PI); const x = { name, c, r, poly, curve: poly, sign, p: r * r, constant: 0, length: 2 * r }; items.push(x); return x; };
    let width;
    if (id === 'sj1') {
      const { a, b } = v, d = a + b; width = d;
      semi('큰 반원', pt(d / 2, 0), d / 2, 0); semi('왼쪽 반원', pt(a / 2, 0), a / 2, PI); semi('오른쪽 반원', pt(a + b / 2, 0), b / 2, 0, -1);
      base.push([pt(0, 0), pt(d, 0)]); labels.push({ p: pt(a / 2, 0), text: `${a} cm`, dy: 20 }, { p: pt(a + b / 2, 0), text: `${b} cm`, dy: 20 });
    } else if (id === 'y12') {
      const { p, q } = v, R = p + q; width = 2 * R;
      semi('큰 반원', pt(R, 0), R, 0); semi('작은 반원 1', pt(p, 0), p, 0, -1); semi('작은 반원 2', pt(2 * p + q, 0), q, 0, -1);
      base.push([pt(0, 0), pt(2 * R, 0)]); labels.push({ p: pt(p, 0), text: `r₁=${p} cm`, dy: 20 }, { p: pt(2 * p + q, 0), text: `r₂=${q} cm`, dy: 20 });
    } else if (id === 'cc08' || id === 'nc' || id === 'ns') {
      const R = v.R, n = id === 'cc08' ? 2 : Math.round(v.n), r = R / n, circle = id !== 'ns'; width = 2 * R;
      const add = (name, c, rr, sign) => circle ? disk(name, c, rr, sign) : semi(name, c, rr, 0, sign);
      add(circle ? '큰 원' : '큰 반원', pt(R, 0), R, 1);
      for (let i = 0; i < n; i++) add(`작은 ${circle ? '원' : '반원'} ${i + 1}`, pt((2 * i + 1) * r, 0), r, -1);
      base.push([pt(0, 0), pt(2 * R, 0)]); labels.push({ p: pt(R * 1.5, 0), text: `R=${R} cm`, dy: 21 });
    } else if (id === 'rot') {
      const r = v.r, th = v.th * D, O = pt(0, 0), source = arc(pt(r, 0), r, 0, -PI), moved = rotate(source, O, -th), wedge = sector(O, 2 * r, 0, -th);
      width = 4 * r;
      items.push({ name: '회전한 반원', poly: moved, sign: 1, p: r * r / 2, constant: 0 }, { name: '부채꼴', poly: wedge, sign: 1, p: 4 * r * r * v.th / 360, constant: 0 }, { name: '처음 반원', poly: source, sign: -1, p: r * r / 2, constant: 0 });
      base.push(source, moved, [O, polar(O, 2 * r, 0)], [O, polar(O, 2 * r, -th)]);
      labels.push({ p: pt(r / 2, 0), text: `AO=${r} cm`, dy: 44 });
    } else if (id === 'lune13') {
      const { p, q } = v, c = Math.hypot(p, q), B = pt(0, 0), C = pt(c, 0), A = pt(p * p / c, -p * q / c); width = c;
      const outwardSemi = (name, a, z, other, len) => {
        const center = mid(a, z), aa = Math.atan2(a.y - center.y, a.x - center.x), candidate = polar(center, len / 2, aa - PI / 2);
        const cross = (candidate.x - center.x) * (other.x - center.x) + (candidate.y - center.y) * (other.y - center.y);
        return semi(name, center, len / 2, cross < 0 ? aa : aa + PI, 1);
      };
      outwardSemi('AB 위 반원', A, B, C, p); outwardSemi('AC 위 반원', A, C, B, q);
      items.push({ name: '직각삼각형', poly: [B, C, A], sign: 1, p: 0, constant: p * q / 2 });
      semi('BC 위 반원', pt(c / 2, 0), c / 2, 0, -1); items[3].p = (p * p + q * q) / 8;
      base.push([A, B, C, A]); labels.push({ p: A, text: 'A', dy: -19 }, { p: B, text: 'B', dy: 20 }, { p: C, text: 'C', dy: 20 }, { p: mid(A, B), text: `${p} cm`, dx: -26 }, { p: mid(A, C), text: `${q} cm`, dx: 26 });
    } else {
      const a = v.a, h = a * Math.sqrt(3) / 2, A = pt(a / 2, -h), B = pt(0, 0), C = pt(a, 0), ab = mid(A, B), ac = mid(A, C), bc = mid(B, C); width = a;
      for (const [name, vertex, m1, m2, other] of [['A쪽 꽃잎', A, ab, ac, bc], ['B쪽 꽃잎', B, ab, bc, ac], ['C쪽 꽃잎', C, ac, bc, ab]]) {
        const poly = [...shortArc(m2, vertex, m1), ...shortArc(other, m1, m2).slice(1), ...shortArc(m1, m2, vertex).slice(1)];
        items.push({ name, poly, sign: 1, p: a * a / 24, constant: 0, vertex, m1, m2, other });
      }
      base.push([A, B, C, A]); labels.push({ p: mid(A, B), text: `${a} cm`, dx: -25 });
    }
    return { id, v: clone(v), items, base, labels, width, p: items.reduce((s, x) => s + x.sign * x.p, 0), constant: items.reduce((s, x) => s + x.sign * x.constant, 0), perimeter: items.reduce((s, x) => s + (x.length || 0), 0) };
  }
  function compoundDraw(b, t, m, label) {
    const M = m.native, original = M.items.flatMap(x => x.poly), perimeter = label === '둘레';
    prepare(b, original);
    if (m.id === 'rot') {
      const u = phase(t, 1.8, 5.8), source = M.items[2].poly, moving = rotate(M.items[0].poly, pt(0, 0), m.values.th * D * u);
      eo(b, [M.items[0].poly, M.items[1].poly, source], 'green', .22 * (1 - u)); shape(b, M.items[1].poly, 'green', .22 * u);
      shape(b, moving, 'amber', .25 * (1 - u)); path(b, source, 'rose', { dash: [5, 5] });
      radius(b, pt(0, 0), 2 * m.values.r, 0, `2r=${2 * m.values.r} cm`); radius(b, pt(0, 0), 2 * m.values.r, -m.values.th * D, '', 'amber');
      angle(b, pt(0, 0), 0, -m.values.th * D, `${m.values.th}°`, m.values.r * .55);
    } else if (m.id === 'petal15') {
      M.items.forEach(p => shape(b, p.poly, 'sky', .24));
      M.base.forEach(p => path(b, p, 'ink'));
      if (t > 1.3) {
        const p = M.items[0]; shape(b, [p.vertex, p.m1, p.m2], 'amber', .2);
        // Each petal consists of the small equilateral triangle, two equal
        // outer circular segments and one equal inner segment with minus sign.
        shape(b, shortArc(p.m2, p.vertex, p.m1), 'green', .2);
        shape(b, shortArc(p.m1, p.m2, p.vertex), 'green', .2);
        shape(b, shortArc(p.other, p.m1, p.m2), 'rose', .22);
        if (t > 3.7) { const a = Math.atan2(p.m2.y - p.m1.y, p.m2.x - p.m1.x), z = Math.atan2(p.vertex.y - p.m1.y, p.vertex.x - p.m1.x); shape(b, sector(p.m1, m.values.a / 2, a, z), 'amber', .24); angle(b, p.m1, a, z, '60°', m.values.a * .12); }
      }
    } else {
      eo(b, M.items.map(p => p.poly), 'green', .2);
      M.items.forEach(p => path(b, [...p.poly, p.poly[0]], 'ink', { width: 2 }));
      const f = phase(t, 1, 5.9) * M.items.length;
      M.items.forEach((p, i) => {
        const u = clamp(f - i);
        if (perimeter) { if (p.curve) trace(b, p.curve, u, COLORS[i % 5]); }
        else if (u > 0) shape(b, p.poly, p.sign < 0 ? 'rose' : 'amber', .19 * u, { dash: p.sign < 0 ? [5, 5] : [] });
        if (u > 0 && u < 1 && p.c) radius(b, p.c, p.r, 0, `${num(p.r)} cm`, COLORS[i % 5]);
      });
      if (m.id === 'lune13' && t > 5.2) shape(b, M.items[2].poly, 'green', .32 * phase(t, 5.2, 6.3));
    }
    M.base.forEach(p => path(b, p, 'muted', { dash: [5, 5], width: 1.5 })); M.labels.forEach(p => text(b, p.p, p.text, 'ink', { dx: p.dx || 0, dy: p.dy || 0 }));
    if (m.id === 'rot') {
      const A = pt(0, 0), O = pt(m.values.r, 0), B = pt(2 * m.values.r, 0);
      line(b, A, O, 'sky', { width: 3 });
      dot(b, A, 'A', 'ink', { dx: -12, dy: 18 }); dot(b, O, 'O'); dot(b, B, 'B', 'ink', { dx: 12, dy: 18 });
    }
  }
  function compoundFrame(t, m, label) {
    const M = m.native, v = m.values, perimeter = label === '둘레'; let steps, formula;
    if (m.id === 'rot') { steps = ['회전 중심은 반원의 끝점입니다. 끝에서 끝까지 거리는 지름입니다.', '회전 전후의 반원은 합동입니다.', '회전한 반원을 되돌려 원래 반원과 포개면 남는 넓이는 부채꼴입니다.']; formula = `\\pi\\times${2 * v.r}^2\\times\\frac{${v.th}}{360}`; }
    else if (m.id === 'lune13') { steps = ['직각삼각형의 세 변을 지름으로 하는 반원을 봅니다.', '색칠한 두 초승달 = 작은 두 반원 + 삼각형 − 큰 반원입니다.', '지름 제곱의 관계가 같아 작은 두 반원의 넓이 합과 큰 반원이 상쇄됩니다.']; formula = `\\frac{\\pi}{8}(${v.p}^2+${v.q}^2)-\\frac{\\pi}{8}(${v.p * v.p + v.q * v.q})+\\frac12\\times${v.p}\\times${v.q}`; }
    else if (m.id === 'petal15') { steps = ['한 변의 중점들이 만드는 작은 정삼각형을 찾습니다.', '꽃잎 하나는 작은 삼각형과 같은 활꼴 두 개를 더하고 활꼴 하나를 뺀 것입니다.', '같은 활꼴 하나가 남아 60° 부채꼴 하나와 넓이가 같습니다. 세 꽃잎도 합동입니다.']; formula = `3\\times\\pi\\times(${fraction(v.a, 2)})^2\\times\\frac{60}{360}`; }
    else if (perimeter) {
      steps = ['색칠한 부분에 닿은 곡선은 안쪽 경계도 둘레에 포함됩니다.', '지름은 반지름의 두 배입니다. 각 원호의 반지름을 확인합니다.', '곧은 지름선은 내부의 보조선입니다. 곡선들만 모두 더합니다.'];
      formula = M.items.map(p => exact(p.length)).join('+');
    } else {
      steps = ['전체 원 또는 반원과 붙이거나 파낸 부분을 구별합니다.', m.id === 'sj1' ? '왼쪽 반원은 더하고, 오른쪽 반원은 뺍니다.' : '안쪽의 작은 원 또는 반원의 넓이를 빼야 합니다.', ['nc', 'ns'].includes(m.id) ? `지름을 ${v.n}등분했으므로 작은 반지름도 큰 반지름의 1/${v.n}입니다.` : '길이는 반지름으로 바꾸고, 넓이에는 반지름의 제곱을 사용합니다.'];
      formula = M.items.map((p, i) => `${i ? p.sign > 0 ? '+' : '-' : p.sign < 0 ? '-' : ''}(${exact(p.p, p.constant)})`).join('');
    }
    if (t < 1.4) return frame(steps[0]);
    if (t < 3.8) return frame(steps[1]);
    if (t < 6.8) return frame(steps[2], t > 5.5 ? `$${formula}$` : '');
    return frame(perimeter ? '모든 곡선 경계를 한 번씩 더한 둘레입니다.' : '도형의 더하기·빼기로 색칠한 넓이를 구했습니다.', unit(perimeter ? exact(M.perimeter) : exact(M.p, M.constant), perimeter ? 1 : 2), true);
  }

  function overlapDraw(b, t, m) {
    const M = m.native, id = m.id, u = phase(t, 2, 5.6);
    if (id === 'f3-two-rects') {
      const a = rect(0, 0, M.wA, M.h), z = rect(M.wA - M.o, 0, M.wB, M.h), overlap = rect(M.wA - M.o, 0, M.o, M.h);
      prepare(b, a.concat(z)); shape(b, a, 'sky', .2); shape(b, z, 'amber', .2); if (t > 1.4) shape(b, overlap, 'rose', .24 * phase(t, 1.4, 3));
      text(b, pt(M.wA / 2, 0), `${M.wA}`, 'sky', { dy: -21 }); text(b, pt(M.wA - M.o + M.wB / 2, M.h), `${M.wB}`, 'amber', { dy: 21 });
      text(b, pt(0, M.h / 2), `h=${M.h}`, 'ink', { dx: -20, align: 'right' }); text(b, pt(M.wA - M.o / 2, M.h / 2), `겹침 ${M.oP}`, 'rose');
      return;
    }
    if (id === 'f3-two-circles') {
      const r = M.r, d = M.d, O = pt(0, 0), C = pt(d, 0), hull = [pt(0, -r), pt(d, -r), ...arc(C, r, -PI / 2, PI / 2), pt(0, r), ...arc(O, r, PI / 2, 3 * PI / 2)];
      const cut = arc(O, r, 0, 2 * PI), bump = arc(C, r, -PI / 2, PI / 2), fixed = rect(0, -r, d, 2 * r), hole = arc(O, r, -PI / 2, PI / 2);
      prepare(b, hull); eo(b, [hull, cut, bump], 'green', .2); shape(b, slide(bump, -d * u), 'amber', .25); path(b, hole, 'muted', { dash: [5, 5] }); path(b, hull, 'ink');
      if (u > .99) path(b, [...fixed, fixed[0]], 'green', { width: 4 });
      radius(b, O, r, PI, `${r} cm`); text(b, pt(d / 2, -r), `중심 사이 ${M.dP} cm`, 'ink', { dy: -22 });
      return;
    }
    if (id === 'f3-rect-sector') {
      const r = M.r, w = M.w, O = pt(0, 0), box = rect(0, -r, w, r), sec = sector(O, r, -PI / 2, 0);
      prepare(b, box.concat(sec)); shape(b, box, 'sky', .15); shape(b, sec, 'amber', .15);
      // The condition asks for equality; w is the unknown width. Both colored
      // differences share the same intersection, which we add back once.
      eo(b, [box, sec], 'green', .18); path(b, [pt(0, -r), pt(w, -r), pt(w, 0), O, pt(0, -r)], 'ink');
      text(b, pt(0, -r / 2), `${r} cm`, 'sky', { dx: -20, align: 'right' }); text(b, pt(w / 2, -r), t < 6.8 ? 'AD = ?' : `AD=${M.adP}`, 'sky', { dy: -21 });
      if (t > 1.8) { shape(b, box, 'sky', .2 * u); shape(b, sec, 'amber', .2 * u); text(b, pt(r * .38, -r * .35), '공통 부분', 'green'); }
      return;
    }
    if (id === 'f3-half-sector') {
      const r = M.r, d = M.dia, O = pt(0, 0), half = arc(pt(r, 0), r, PI, 2 * PI), sec = sector(O, d, 0, -M.x * D);
      prepare(b, half.concat(sec)); shape(b, half, 'sky', .16); shape(b, sec, 'amber', .16); eo(b, [half, sec], 'green', .19);
      path(b, [O, pt(d, 0)], 'ink'); text(b, pt(r, 0), `${d} cm`, 'ink', { dy: 22 });
      angle(b, O, 0, -M.x * D, t < 6.8 ? 'x°' : `${M.x}°`, d * .22);
      if (t > 1.6) { shape(b, half, 'sky', .12 * u); shape(b, sec, 'amber', .12 * u); }
      return;
    }
    const a = M.a, sq = rect(0, 0, a, a); prepare(b, sq);
    path(b, [...sq, sq[0]], 'ink'); text(b, pt(a / 2, 0), `${a} cm`, 'ink', { dy: -22 });
    if (id === 'f3-leaf-len') {
      const c1 = pt(0, a), c2 = pt(a, 0), A = arc(c1, a, -PI / 2, 0), B = arc(c2, a, PI / 2, PI); shape(b, [...A, ...B], 'sky', .2);
      trace(b, A, phase(t, .9, 3.3), 'sky'); trace(b, B, phase(t, 3.5, 5.9), 'green');
      if (t > 1.2) { radius(b, c1, a, -PI / 2, `${a} cm`); angle(b, c1, -PI / 2, 0, '90°', a * .2); }
      if (t > 3.5) { radius(b, c2, a, PI / 2, '', 'green'); angle(b, c2, PI / 2, PI, '90°', a * .2, 'green'); }
    } else if (id === 'f3-two-arcs') {
      const B = pt(0, a), C = pt(a, a), E = pt(a / 2, a - a * Math.sqrt(3) / 2), s1 = sector(B, a, -PI / 2, -PI / 3), s2 = sector(C, a, -2 * PI / 3, -PI / 2);
      eo(b, [sq, s1, s2], 'green', .24); path(b, arc(B, a, -PI / 2, 0), 'muted'); path(b, arc(C, a, -PI, -PI / 2), 'muted');
      path(b, [B, E, C], 'sky'); if (t > 1.4) { b.ticks(B, C, { count: 1 }); b.ticks(B, E, { count: 1 }); b.ticks(C, E, { count: 1 }); text(b, E, '60°', 'sky', { dy: 24 }); }
      if (t > 3.4) { shape(b, s1, 'amber', .26); shape(b, s2, 'rose', .26); angle(b, B, -PI / 2, -PI / 3, '30°', a * .3); angle(b, C, -2 * PI / 3, -PI / 2, '30°', a * .3, 'rose'); }
      dot(b, pt(0, 0), 'A', 'ink', { dx: -14, dy: -17 }); dot(b, pt(a, 0), 'D', 'ink', { dx: 14, dy: -17 });
      dot(b, B, 'B', 'ink', { dx: -14, dy: 18 }); dot(b, C, 'C', 'ink', { dx: 14, dy: 18 }); dot(b, E, 'E', 'ink', { dy: -17 });
    } else if (id === 'f3-crescent') {
      const h = a / 2, BL = pt(0, a), M1 = pt(0, h), M2 = pt(h, a), Q = sector(BL, a, -PI / 2, 0), H1 = arc(M1, h, -PI / 2, PI / 2), H2 = arc(M2, h, PI, 2 * PI);
      const cres = [...arc(BL, a, -PI / 2, 0), ...arc(M2, h, 2 * PI, 3 * PI / 2), ...arc(M1, h, 0, -PI / 2)], lens = [...arc(M1, h, 0, PI / 2), ...arc(M2, h, PI, 3 * PI / 2)];
      shape(b, cres, 'sky', .25); path(b, H1, 'ink'); path(b, H2, 'ink');
      if (t > 1.2) shape(b, Q, 'amber', .1 * phase(t, 1.2, 2));
      if (t > 2.3) { shape(b, H1, 'green', .15); shape(b, H2, 'green', .15); }
      if (t > 4.7) { shape(b, lens, 'rose', .26); path(b, rect(0, h, h, h), 'rose', { dash: [4, 4] }); text(b, pt(h / 2, h * 1.5), '겹침', 'rose'); }
    } else {
      const h = a / 2, T = pt(h, 0), L = pt(0, h), B = pt(h, a), R = pt(a, h);
      const qs = [[L, -90, 0, T, 90, 180], [T, 0, 90, R, 180, 270], [R, 90, 180, B, 270, 360], [L, 0, 90, B, 180, 270]];
      qs.forEach(([c, s, z, d, p, q], i) => {
        const one = arc(c, h, s * D, z * D), two = arc(d, h, p * D, q * D); shape(b, [...one, ...two], 'sky', .22);
        if (t > 1.4 && (i === 0 || t > 5.5)) { shape(b, sector(c, h, s * D, z * D), 'amber', .14); shape(b, sector(d, h, p * D, q * D), 'green', .14); }
      });
      if (t > 2.6) { path(b, [...rect(0, 0, h, h), pt(0, 0)], 'rose', { dash: [5, 5] }); text(b, pt(h / 2, 0), `r=${h}`, 'amber', { dy: 20 }); }
    }
  }
  function overlapFrame(t, m) {
    const M = m.native, id = m.id; let steps, formula, result, power = 2;
    if (id === 'f3-leaf-len') { steps = ['잎의 경계는 정사각형의 두 꼭짓점을 중심으로 한 호입니다.', '첫 호는 한 변을 반지름으로 하는 90° 호입니다.', '둘째 호도 같은 길이입니다. 두 사분원호를 더합니다.']; formula = `2\\times2\\pi\\times${M.a}\\times\\frac{90}{360}`; result = exact(M.a); power = 1; }
    else if (id === 'f3-two-arcs') { steps = ['정사각형의 한 변과 두 반지름이 만나는 삼각형을 봅니다.', '세 변이 모두 같은 정삼각형이므로 한 각은 60°입니다.', '직각에서 60°를 빼면 파낸 부채꼴은 각각 30°입니다.']; formula = `${M.a}^2-2\\times\\pi\\times${M.a}^2\\times\\frac{30}{360}`; result = exact(-M.a * M.a / 6, M.a * M.a); }
    else if (id === 'f3-crescent') { steps = ['큰 사분원에서 두 반원이 차지하는 자리를 봅니다.', '두 반원 넓이의 합은 큰 사분원의 넓이와 같습니다.', '두 반원이 겹친 만큼 빈 초승달이 생깁니다. 그 겹침은 작은 사분원 둘 − 작은 정사각형입니다.']; formula = `2\\times\\pi\\times${M.h}^2\\times\\frac14-${M.h}^2`; result = exact(M.a * M.a / 8, -M.a * M.a / 4); }
    else if (id === 'f3-four-leaf') { steps = ['정사각형을 같은 작은 네 칸으로 나눕니다.', '한 칸의 두 사분원을 더하면 칸 전체와 겹친 잎을 한 번씩 셉니다.', '사분원 둘에서 작은 정사각형을 빼서 잎 하나를 얻고 네 배 합니다.']; formula = `4\\left(2\\times\\pi\\times${M.h}^2\\times\\frac14-${M.h}^2\\right)`; result = exact(M.a * M.a / 2, -M.a * M.a); }
    else if (id === 'f3-two-circles') { steps = ['문제의 두 원은 서로의 중심을 지나므로 중심 사이 거리는 r입니다.', '붙은 반원과 빈 반원은 같은 크기입니다.', '붙은 반원을 가로로 옮기면 가로 r, 세로 2r인 직사각형이 됩니다.']; formula = `${M.r}\\times${2 * M.r}`; result = M.areaT; }
    else if (id === 'f3-rect-sector') { steps = ['문제는 색칠한 두 부분의 넓이가 같을 때 AD를 묻습니다.', '두 부분에 똑같은 공통 영역을 다시 더합니다.', '직사각형 넓이와 사분원 넓이가 같습니다. 공통 세로로 나누면 AD입니다.']; formula = `${M.r}\\times AD=\\pi\\times${M.r}^2\\times\\frac14`; result = exact(M.r / 4); power = 1; }
    else if (id === 'f3-half-sector') { steps = ['문제는 색칠한 두 부분의 넓이가 같은 중심각을 묻습니다.', '두 도형의 공통 영역을 각각 더하면 반원과 부채꼴의 넓이가 같습니다.', '부채꼴 반지름은 반원의 지름이므로 제곱하면 네 배입니다.']; formula = `\\pi\\times${M.dia}^2\\times\\frac{x}{360}=\\pi\\times${M.r}^2\\times\\frac12`; result = '$x=45^\\circ$'; power = 0; }
    else { steps = ['두 직사각형의 현재 폭과 높이, 겹친 폭을 확인합니다.', '두 넓이를 더하면 겹친 부분을 두 번 셉니다.', '겹친 직사각형의 넓이를 한 번 빼면 전체를 한 번씩 셉니다.']; formula = `${M.wA}\\times${M.h}+${M.wB}\\times${M.h}-${M.oT}\\times${M.h}`; result = M.UT; }
    if (t < 1.4) return frame(steps[0]); if (t < 3.5) return frame(steps[1]); if (t < 6.8) return frame(steps[2], t > 5.6 ? `$${formula}$` : '');
    return frame('공통 부분 또는 같은 조각의 관계로 정리합니다.', power ? unit(result, power) : result, true);
  }

  function rollingModel(kind, cfg) {
    let points, names, target = cfg.track, N = cfg.rolls, nOut;
    if (kind === 'semi') {
      points = arc(pt(cfg.R, 0), cfg.R, PI, 0, 48); points.push(pt(cfg.R, 0)); names = points.map((p, i) => i === 0 ? 'A' : i === 48 ? 'B' : i === 49 ? 'O' : ''); target = 49; N = 3; nOut = 49;
    } else if (kind === 'rect' || kind === 'square') {
      const w = kind === 'rect' ? cfg.w : cfg.a, h = kind === 'rect' ? cfg.h : cfg.a; points = rect(0, 0, w, h); names = ['A', 'B', 'C', 'D'];
    } else if (kind === 'tri') { points = [pt(0, 0), pt(cfg.a, 0), pt(cfg.a / 2, cfg.a * Math.sqrt(3) / 2)]; names = ['A', 'B', 'C']; }
    else if (kind === 'rtri') { points = [pt(0, 0), pt(cfg.a, 0), pt(cfg.a, cfg.a * Math.tan(cfg.beta * D))]; names = ['B', 'C', 'A']; }
    else {
      const g = (cfg.at === 'C' ? cfg.deg : 90 - cfg.deg) * D;
      points = [pt(0, 0), pt(cfg.d / Math.cos(g), 0), pt(cfg.d * Math.sin(g) ** 2 / Math.cos(g), cfg.d * Math.sin(g))]; names = ['B', 'C', 'A'];
    }
    const states = [points], turns = [], n = points.length; nOut = nOut || n;
    const interior = kind === 'semi' ? [] : points.map((p, i) => {
      const a = points[(i + n - 1) % n], z = points[(i + 1) % n], x = a.x - p.x, y = a.y - p.y, u = z.x - p.x, v = z.y - p.y;
      return Math.acos(Math.max(-1, Math.min(1, (x * u + y * v) / (Math.hypot(x, y) * Math.hypot(u, v))))) / D;
    });
    for (let i = 0; i < N; i++) {
      const from = states[i], roll = kind === 'semi' && i === 1, pivot = kind === 'semi' ? i === 0 ? 48 : i === 1 ? 49 : 0 : (i + 1) % n;
      const c = from[pivot], deg = kind === 'semi' ? i === 1 ? 180 : 90 : Math.round((180 - interior[pivot]) * 1e8) / 1e8;
      const r = roll ? cfg.R : Math.hypot(from[target].x - c.x, from[target].y - c.y), length = roll ? PI * cfg.R : r * deg * D;
      const a0 = Math.atan2(from[target].y - c.y, from[target].x - c.x), next = rotate(from, c, -deg * D).map(p => pt(p.x + (roll ? length : 0), p.y));
      turns.push({ i, c, pivot, deg, interior: kind === 'semi' ? null : interior[pivot], r, length, a0, kind: roll ? 'roll' : 'pivot', radiusName: names[pivot] + names[target] }); states.push(next);
    }
    const irr = [], exactTerms = new Map();
    let coefficient = 0;
    for (const x of turns) {
      if (x.r < 1e-8) { x.rLabel = '0'; continue; }
      const q = rat(x.r);
      if (q) { x.rLabel = fraction(x.r); coefficient += x.r * x.deg / 180; }
      else { let k = irr.findIndex(y => Math.abs(y.r - x.r) < 1e-7); if (k < 0) { k = irr.length; irr.push(x); } x.rLabel = irr.length === 1 ? 'x' : `x_${k + 1}`; exactTerms.set(k, (exactTerms.get(k) || 0) + x.deg / 180); }
    }
    const symbolic = Array.from(exactTerms, ([i, c]) => term(c, `${irr.length === 1 ? 'x' : `x_{${i + 1}}`}\\pi`));
    const totalTex = [term(coefficient, '\\pi'), ...symbolic].filter(Boolean).join('+') || '0';
    return { kind, cfg: clone(cfg), names, T: target, N, nOut, states, turns, totalTex, total: turns.reduce((s, x) => s + x.length, 0), unknownRadii: irr.map((x, i) => ({ label: irr.length === 1 ? 'x' : `x_${i + 1}`, segment: x.radiusName, value: x.r })) };
  }
  function nativeRollingFraction(value) {
    if (!Number.isFinite(value)) return false;
    for (let q = 1; q <= 720; q++) if (Math.abs(value * q - Math.round(value * q)) < 1e-7) return true;
    return false;
  }
  function rollingPose(M, progress) {
    const f = clamp(progress) * M.N, k = Math.min(M.N - 1, Math.floor(f)), u = Math.min(1, f - k), turn = M.turns[k];
    const poly = rotate(M.states[k], turn.c, -turn.deg * D * u);
    return { k, u, turn, points: turn.kind === 'roll' ? slide(poly, turn.length * u) : poly };
  }
  function rollingDraw(b, t, m) {
    const M = m.native, progress = phase(t, 1.2, 6.1), pose = rollingPose(M, progress);
    const bounds = M.states.flat();
    M.turns.forEach(x => {
      if (x.kind === 'pivot') for (const p of M.states[x.i].slice(0, M.nOut)) { const r = Math.hypot(p.x - x.c.x, p.y - x.c.y), a = Math.atan2(p.y - x.c.y, p.x - x.c.x); bounds.push(...arc(x.c, r, a, a - x.deg * D)); }
    });
    prepare(b, bounds.map(up));
    const xs = bounds.map(p => p.x); line(b, pt(Math.min(...xs), 0), pt(Math.max(...xs), 0), 'muted');
    path(b, [...M.states[0].slice(0, M.nOut), M.states[0][0]].map(up), 'muted', { dash: [5, 5], width: 1.5 });
    const poly = pose.points.slice(0, M.nOut).map(up); shape(b, poly, 'sky', .16);
    const marked = up(pose.points[M.T]), turnScene = M.kind === 'turn';
    dot(b, marked, turnScene && progress === 1 ? '' : M.names[M.T], 'rose', { dy: M.kind === 'semi' ? -42 : -20 });
    M.turns.forEach((turn, i) => {
      const u = clamp(progress * M.N - i); if (!u) return;
      if (turn.kind === 'roll') trace(b, [up(turn.c), up(pt(turn.c.x + turn.length, turn.c.y))], u, COLORS[i % 5]);
      else if (turn.r > 1e-8) path(b, arc(turn.c, turn.r, turn.a0, turn.a0 - turn.deg * D * u).map(up), COLORS[i % 5], { width: 4 });
    });
    const rt = pose.turn;
    if (rt.kind === 'pivot') {
      dot(b, up(rt.c), M.names[rt.pivot], 'amber', { dy: 20 });
      if (rt.r > 1e-8) { line(b, up(rt.c), marked, 'amber', { width: 3 }); text(b, mid(up(rt.c), marked), `${rt.rLabel} cm`, 'amber', { dy: -20 }); }
      if (pose.u > .25) angle(b, up(rt.c), -rt.a0, -rt.a0 + rt.deg * D, `${num(rt.deg)}°`, Math.max(rt.r * .22, (M.cfg.a || M.cfg.R || M.cfg.d || M.cfg.w) * .2));
    } else radius(b, up(pose.points[M.T]), M.cfg.R, PI / 2, `r=${M.cfg.R} cm`);
    if (t < 1.2) M.names.forEach((name, i) => { if (name && i !== M.T) dot(b, up(M.states[0][i]), name, 'ink'); });
    if (turnScene) {
      const target = up(M.states[M.N][M.T]);
      if (progress < 1) b.point(target, { hollow: true, color: 'rose', r: 5, glow: false });
      text(b, target, `${M.names[M.T]}′`, 'rose', { dy: 20 });
      text(b, pt(Math.max(...xs), 0), 'l', 'muted', { dx: 19, dy: -12 });
    }
  }
  function rollingFrame(t, m) {
    const M = m.native, pose = rollingPose(M, phase(t, 1.2, 6.1)), rt = pose.turn, target = M.names[M.T];
    if (t < 1.2) return frame(`이 문제의 점 ${target}을 ${M.N}번 회전하는 동안 추적합니다. 회전 중심까지의 거리가 호의 반지름입니다.`);
    if (t < 6.1) {
      if (rt.kind === 'roll') return frame('둥근 부분이 미끄러지지 않고 굴러가므로 중심은 반원호 길이만큼 수평으로 갑니다.', `$\\pi\\times${M.cfg.R}$`);
      if (rt.r < 1e-8) return frame(`점 ${target} 자체가 회전 중심입니다. 이번에는 움직인 길이가 0입니다.`);
      return frame(`${pose.k + 1}번째: ${M.names[rt.pivot]}를 중심으로 돌 때 반지름은 ${rt.radiusName}입니다.`, `${rt.interior == null ? '' : `$180^\\circ-${num(rt.interior)}^\\circ=${num(rt.deg)}^\\circ$, `}$l=2\\pi\\times${rt.rLabel}\\times\\frac{${num(rt.deg)}}{360}$`);
    }
    if (t < 6.8) return frame('실제로 움직인 각 호와 곧은 구간의 길이를 합칩니다.');
    const note = M.unknownRadii.length ? M.unknownRadii.map(x => `${x.label}는 선분 ${x.segment}의 길이`).join(', ') + '. ' : '';
    return frame(`${note}점 ${target}의 전체 이동 거리입니다.`, unit(M.totalTex), true);
  }

  function sweepDraw(b, t, m) {
    const M = m.native, progress = phase(t, 1, 4.6), inside = m.id === 'sw-inside', center = m.id === 'sw-center';
    const vertices = M.V.map(up), bounds = inside ? vertices : vertices.flatMap(p => [pt(p.x - 2 * M.r, p.y - 2 * M.r), pt(p.x + 2 * M.r, p.y + 2 * M.r)]);
    prepare(b, bounds); shape(b, vertices, 'muted', .08); path(b, [...vertices, vertices[0]], 'ink');
    const now = M.centerAt(M.Lc * progress), C = up(now.p), contact = up(now.contact || now.p);
    if (progress > 0) {
      const trail = M.ptsUpTo(M.Lc * progress).map(up);
      if (!center) path(b, trail, 'sky', { width: 2 * M.r * (b.k || 1), alpha: .16, lineCap: 'round', lineJoin: 'round' });
      path(b, trail, 'amber', { width: 3.4 });
    }
    path(b, arc(C, M.r, 0, 2 * PI), 'sky'); dot(b, C, 'O', 'sky', { dy: -19 }); line(b, C, contact, 'amber');
    text(b, polar(C, M.r, PI / 2), `r=${num(M.r)} cm`, 'sky', { dy: 20 });
    if (inside && t > 4.6) {
      const h = M.hole, off = 2 * M.r; shape(b, rect(off, -(off + h), h, h), 'rose', .18);
      M.corners.forEach(c => {
        const sq = rect(c.x, -(c.y + M.r), M.r, M.r), qd = sector(up(c.c), M.r, -c.t0, -c.t1); eo(b, [sq, qd], 'rose', .2);
      });
      text(b, pt(M.a / 2, -M.a / 2), `${num(h)} × ${num(h)}`, 'rose');
    } else if (!inside && t > 4.6) {
      if (!center) M.rects.forEach(x => shape(b, x.pts.map(up), 'green', .18));
      (center ? M.arcs : M.secs).forEach(x => {
        const c = up(x.c);
        if (center) path(b, arc(c, x.R, -x.t0, -x.t1), 'amber', { width: 4 });
        else shape(b, sector(c, x.R, -x.t0, -x.t1), 'amber', .17);
      });
    }
    if (t < 4.6) {
      const a = M.shape === 'rect' ? `가로 ${M.a} · 세로 ${M.b} cm` : `한 변 ${M.a} cm`;
      const separate = ['sw-square', 'sw-center', 'sw-rect'].includes(m.id);
      const at = separate ? pt((Math.min(...vertices.map(p => p.x)) + Math.max(...vertices.map(p => p.x))) / 2, Math.max(...vertices.map(p => p.y))) : vertices[0];
      text(b, at, a, 'ink', { dy: 24 });
    }
  }
  function sweepFrame(t, m) {
    const M = m.native, inside = m.id === 'sw-inside', center = m.id === 'sw-center';
    if (t < 1) return frame(inside ? '현재 원이 정사각형 안쪽 벽에 닿은 채 한 바퀴 돕니다.' : `현재 반지름 ${M.r}인 원이 도형의 바깥에 닿은 채 한 바퀴 돕니다.`);
    if (t < 4.6) return frame(center ? '직선 옆에서 중심은 평행하게 가고, 꼭짓점에서는 반지름 r인 호를 그립니다.' : inside ? '원이 지나간 자리와 닿지 못한 자리를 구별합니다.' : '직선 변에서는 폭 2r인 띠를, 꼭짓점에서는 반지름 2r인 부채꼴을 쓸고 갑니다.');
    if (t < 6.8) return frame(inside ? '가운데 정사각형과 모서리 네 곳을 전체 정사각형에서 뺍니다.' : '꼭짓점에서 도는 외각을 모두 더하면 360°입니다. 같은 반지름의 부채꼴들은 원 하나의 양입니다.', inside ? `$${M.a}^2-(${M.a}-4\\times${M.r})^2-4(${M.r}^2-\\frac{\\pi${M.r}^2}{4})$` : center ? `$${num(M.per)}+2\\pi\\times${M.r}$` : `$${num(M.per)}\\times${2 * M.r}+\\pi\\times${2 * M.r}^2$`);
    const value = inside ? exact(M.r * M.r, M.a * M.a - M.hole * M.hole - 4 * M.r * M.r) : center ? exact(2 * M.r, M.per) : exact(4 * M.r * M.r, 2 * M.r * M.per);
    return frame(center ? '중심이 움직인 거리입니다.' : '원이 지나간 모든 자리의 넓이입니다.', unit(value, center ? 1 : 2), true);
  }
  function goatDraw(b, t, m) {
    const M = m.native, spiral = m.id === 'gt-spiral', sections = spiral ? M.secs : M.order;
    const bounds = M.V.map(up).concat(...sections.map(s => sector(up(s.c), s.R, -s.t0, -s.t1)));
    prepare(b, bounds); shape(b, M.V.map(up), 'muted', .12); path(b, [...M.V, M.V[0]].map(up), 'ink');
    M.V.forEach((p, i) => dot(b, up(p), M.names[i], 'ink', { dy: 17 }));
    const f = phase(t, 1.1, 6.2) * sections.length;
    sections.forEach((s, i) => {
      const c = up(s.c), a = -s.t0, z = -s.t1, u = clamp(f - i), color = COLORS[i % 5];
      path(b, arc(c, s.R, a, z), 'muted', { dash: [5, 5], width: 1.5 });
      if (u > 0) { shape(b, sector(c, s.R, a, a + (z - a) * u), color, .2); trace(b, arc(c, s.R, a, z), u, color); }
      if (i === Math.min(sections.length - 1, Math.floor(f))) {
        if (s.path?.length > 1) path(b, s.path.map(up), 'rose', { width: 4 });
        const end = polar(c, s.R, a + (z - a) * u); line(b, c, end, 'amber', { width: 3 });
        text(b, mid(c, end), `${num(s.R)} ${spiral ? 'cm' : 'm'}`, 'amber', { dy: -18 });
        if (u > .3) angle(b, c, a, z, `${s.deg}°`, s.R * .23, color);
      }
    });
    if (t < 1.1) text(b, M.V.map(up)[0], spiral ? `한 변 ${M.p} cm · ${M.k}구간` : `줄 ${M.L} m`, 'amber', { dy: -26 });
  }
  function goatFrame(t, m) {
    const M = m.native, spiral = m.id === 'gt-spiral', sections = spiral ? M.secs : M.order, f = phase(t, 1.1, 6.2) * sections.length, s = sections[Math.min(sections.length - 1, Math.floor(f))];
    if (t < 1.1) return frame(spiral ? '정육각형의 각 꼭짓점을 차례로 중심으로 삼는 부채꼴을 봅니다.' : '건물 바깥에서 줄이 팽팽해질 때 닿을 수 있는 경계를 봅니다.');
    if (t < 6.2) return frame(spiral ? `${s.id} 중심: 반지름은 한 변의 ${s.idx + 1}배, 돌아가는 각은 외각 60°입니다.` : `${s.id} 중심: 모서리까지 감긴 줄 ${num(s.used)} m를 제외하면 ${num(s.R)} m가 남습니다.`, `$\\pi\\times${num(s.R)}^2\\times\\frac{${s.deg}}{360}$`);
    if (t < 6.8) return frame(spiral ? '각 구간의 부채꼴 넓이를 더합니다. 반지름을 먼저 제곱합니다.' : '건물에 가려지지 않고 실제로 닿는 부채꼴들을 겹침 없이 더합니다.');
    return frame('현재 조건에서 구한 넓이입니다.', unit(exact(fv(M.area)), 2, spiral ? 'cm' : 'm'), true);
  }

  function makePlans(id, lab, state) {
    const model = bind(id, lab, state); if (!model) return [];
    const labels = definitions[id];
    let draw, step;
    if (id.startsWith('z')) { draw = baseDraw; step = baseFrame; }
    else if (id.startsWith('f1-')) { draw = cutDraw; step = cutFrame; }
    else if (id.startsWith('f3-')) { draw = overlapDraw; step = overlapFrame; }
    else if (id.startsWith('f4-')) { draw = moveDraw; step = moveFrame; }
    else if (id.startsWith('f5-')) { draw = perimeterDraw; step = perimeterFrame; }
    else if (id.startsWith('rl-')) { draw = rollingDraw; step = rollingFrame; }
    else if (id.startsWith('sw-')) { draw = sweepDraw; step = sweepFrame; }
    else if (id.startsWith('gt-')) { draw = goatDraw; step = goatFrame; }
    else if (['rot', 'sj1', 'y12', 'cc08', 'lune13', 'petal15', 'nc', 'ns'].includes(id)) { draw = compoundDraw; step = compoundFrame; }
    else { draw = basicDraw; step = basicFrame; }
    let given = model.question;
    if (id === 'x01') given = `반지름 ${model.values.r} cm인 원을 같은 부채꼴 ${model.values.n}개로 나누었습니다. 중심각·호·넓이의 합을 각각 확인합니다.`;
    if (id === 'f3-rect-sector') given += ` 현재 탐구 AD=${model.live.adP} cm는 보존하며, 이 문제는 두 색칠한 넓이가 같을 때의 AD를 구합니다.`;
    if (id === 'f3-half-sector') given += ` 현재 탐구 각 ${model.live.xP}는 보존하며, 두 색칠한 넓이가 같을 때의 x를 구합니다.`;
    if (id === 'f3-two-circles' && !model.live.rectEq) given += ` 탐구의 중심 거리 ${model.live.dP} cm는 보존하며, 문제의 ‘서로의 중심을 지남’ 조건은 중심 거리 r입니다.`;
    if (id === 'f3-two-rects' && Math.abs(model.live.o - model.native.o) > 1e-8) given += ` 탐구의 겹친 폭 ${model.live.oP}는 보존하며, 원문 문제에서 사용하는 겹친 폭은 ${model.native.oP} cm입니다.`;
    if (id.startsWith('rl-') && model.fallback) {
      const live = model.live, c = model.liveCfg;
      const sizes = live.kind === 'turn' ? `AC=${c.d} cm, ∠${c.at === 'C' ? 'ACB' : 'ABC'}=${c.deg}°`
        : live.kind === 'rect' ? `AB=${c.w} cm, AD=${c.h} cm`
          : live.kind === 'rtri' ? `BC=${c.a} cm, ∠ABC=${c.beta}°`
            : live.kind === 'semi' ? `반지름 ${c.R} cm` : `한 변 ${c.a} cm`;
      given += ` 탐구 조건(${sizes}, 선택점 ${live.names[live.T]}, ${live.N}번 회전)은 그대로 보존합니다. 원문 확인 문제는 위에 적힌 기본 조건의 점 ${model.native.names[model.native.T]}을 묻습니다.`;
    }
    return labels.map((legacyLabel, i) => ({
      id: `${id}-circle-${i + 1}`, label: legacyLabel || model.title, legacyLabel: legacyLabel || '', title: model.title,
      duration: 9.8, stops: id === '1610' ? [0, 1.4, 3.4, 4.2, 5.6, 6.3, 6.8, 9.8] : [0, 1.4, 3.4, 5.6, 6.8, 9.8], model, given,
      draw: (b, t, m) => draw(b, t, m, legacyLabel), frame: (t, m) => step(t, m, legacyLabel)
    }));
  }
  const registry = Object.fromEntries(Object.keys(definitions).map(id => [`g7-circle-sector/${id}`, (lab, state) => makePlans(id, lab, state)]));
  const lessonInfo = Object.fromEntries(Object.entries(definitions).map(([id, labels]) => [`g7-circle-sector/${id}`, labels.map(legacyLabel => ({ legacyLabel, duration: 9.8 }))]));
  return { registry, lessonInfo, math: { rat, exact, nativeExact, compoundModel, rollingModel, rollingPose, piecePose, bandParts, rotate, slide, arc, area } };
});
