/* Individual grade 7 points/lines proofs. A plan owns a snapshot and its clock;
 * no legacy chapter.start, reroll, or explorer mutation participates in a proof.
 * Geometry comes from the production scene, including its seeded question.
 */
(function (root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root?.APLab) return;
  root.APLab.G7ShortPointsLines = api;
  Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
  Object.assign(root.APLab.G7ShortInfo = root.APLab.G7ShortInfo || {}, api.lessonInfo);
})(typeof window === 'undefined' ? null : window, function (root) {
  'use strict';
  const D = Math.PI / 180, LETTERS = 'ABCDEFGH';
  const clamp = x => Math.max(0, Math.min(1, x));
  const phase = (t, a, z) => { const u = clamp((t - a) / (z - a)); return u * u * (3 - 2 * u); };
  const pt = (x, y) => ({ x, y });
  const mix = (a, b, u) => pt(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u);
  const polar = (a, r = 1, c = pt(0, 0)) => pt(c.x + r * Math.cos(a * D), c.y - r * Math.sin(a * D));
  const num = x => String(Math.round(x * 1e9) / 1e9);
  const expr = (a, b) => `${a === 1 ? '' : a}x${b === 0 ? '' : b > 0 ? '+' + b : '-' + (-b)}`;
  const cm = x => `$${x}\\;\\mathrm{cm}$`;
  const clone = value => Array.isArray(value) ? Array.from(value, clone) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clone(v)])) : value;
  const pairs = n => Array.from({ length: n }, (_, i) => Array.from({ length: n - i - 1 }, (_, j) => [i, i + j + 1])).flat();
  const orderedPairs = n => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => [i, j]).filter(p => p[0] !== p[1])).flat();
  const C2 = n => n * (n - 1) / 2;

  const definitions = {
    'b1-1': ['b−a', 'a+b', '2b−a'],
    'b1-2': ['면과 면', '선과 면', '평행'],
    'b1-3': ['교점 비교', '교선 비교', '개수의 합'],
    'l-ray': ['순서바꾸기', '반직선순서', '공통부분'],
    'l-types': ['직선', '반직선', '선분'],
    'l-same': ['같은반직선', '시작점함정', '방향함정'],
    'l-common': ['마주봄', '같은방향', '끝점비교'],
    'l-short': ['거리뜻', '거리계산'],
    'l-col': ['선분', '반직선', '개수의합'],
    'l-gen': ['직선과선분', '반직선', '개수의합'],
    'l-mix': ['직선', '반직선', '선분'],
    'm-mid': ['MN 길이', 'AB 길이'],
    'm-dbl': ['AN 길이', 'MN→AB', 'AN→AB'],
    'm-tri': ['PM 길이', 'PM→AB', 'MQ 길이'],
    'm-ratio': ['MB 길이', 'MC→AB'],
    'm-eq': ['x 값', 'AB 길이'],
    ck1: ['시침의 각', '분침의 각', '사잇각'],
    ck2: ['회전 차이', '사잇각'],
    vt: ['맞꼭지각', '이웃한 각', '쌍의 개수'],
    ve: ['x 구하기', '각의 크기'],
    th: ['평각의 합', 'x 구하기'],
    pd: ['수선의 발', '최단 선분', '거리 구하기'],
    bs: ['평각 이등분', '다른 각'],
    tr: ['수선 찾기', '거리 구하기']
  };

  function clock(h, m) {
    const hh = h % 12, th = 30 * hh + .5 * m, tm = 6 * m, raw = Math.abs(th - tm);
    return { hh, th, tm, raw, gap: Math.min(raw, 360 - raw), start: raw <= 180 ? Math.min(th, tm) : Math.max(th, tm) };
  }
  function rayIntersection(a, z) {
    const lo = Math.max(a.d > 0 ? a.x : -Infinity, z.d > 0 ? z.x : -Infinity);
    const hi = Math.min(a.d < 0 ? a.x : Infinity, z.d < 0 ? z.x : Infinity);
    return lo > hi ? { kind: 'none' } : lo === hi ? { kind: 'point', x: lo } : Number.isFinite(lo) && Number.isFinite(hi) ? { kind: 'seg', lo, hi } : { kind: 'ray', x: Number.isFinite(lo) ? lo : hi, d: Number.isFinite(lo) ? 1 : -1 };
  }
  function bind(id, lab, state) {
    const scene = lab.scene;
    if (!scene || scene.id !== id) return null;
    const snapshot = clone(state), native = lab.api || root?.APL_PL;
    let m;
    if (scene._pl) {
      m = clone(scene._pl.model(snapshot));
      if (!native?.rng || !native?.hash) throw new Error('Points/lines production helpers are unavailable');
      m.question = clone(scene._pl.quiz(m, snapshot, native.rng(native.hash(id) + ((snapshot.plSeed || 0) + 1) * 7919)));
      if (id === 'b1-1') m.solid = clone(native.solids.build(m.k, m.n, 1.6, 2.3));
      if (id === 'b1-3') {
        m.solids = [native.solids.build(m.ka, m.na, 1.35, 2), native.solids.build(m.kb, m.nb, 1.35, 2)].map(clone);
      }
      if (id.startsWith('b1-')) m.camera = { yaw: snapshot.plYaw, pitch: snapshot.plPit };
      if (id === 'l-same') {
        m.asked = m.question.stem.match(/반직선 ([A-D]{2})와/)?.[1];
        m.other = m.question.choices.find(c => c.ok)?.t.match(/[A-D]{2}/)?.[0];
        if (!m.asked || !m.other) throw new Error('The seeded ray question has no names');
      }
    } else if (scene.__spec && scene.__sv) {
      const q = scene.__sv(snapshot), spec = scene.__spec;
      m = Object.fromEntries([...new Set([...Object.keys(spec.state || {}), ...Object.keys(spec.params || {}), 'seed'])].map(k => [k, clone(q[k])]));
      m.question = clone(spec.problem(q));
      if (id === 'ck1' || id === 'ck2') Object.assign(m, clock(m.h, m.m));
      if (id === 'vt') m.drawN = lab.tab === 'problem' || lab.tab === 'review' ? m.seed % 2 ? Math.max(3, m.n) : 2 : m.n;
      if (id === 've') { m.solution = (m.b2 - m.b1) / (m.a1 - m.a2); m.value = m.a1 * m.solution + m.b1; }
      if (id === 'th') {
        // The production problem key identifies the actual seed-selected equation.
        const [A, B, xs, r] = m.question.key.split(',').map(Number), C = 180 - A - B;
        m.cfg = { A, B, C, xs, r, p: A - xs, s: C - r * xs };
      }
      if (id === 'tr') {
        const values = m.question.stem.match(/AB = ([\d.]+) cm, BC = ([\d.]+) cm, CA = ([\d.]+) cm/);
        if (!values) throw new Error('The current triangle question has no side lengths');
        m.problemTriangle = { b: +values[2], h: +values[3], sa: +values[2], ab: +values[1] };
      }
    } else return null;
    m.sourceState = snapshot;
    return m;
  }

  function prepare(b, box) {
    b.kind = 'figure'; b.aspect = '1:1'; b.setPanes(null);
    b.setInsets({ top: 48, right: 32, bottom: 80, left: 32 });
    b.setFocus({ x: [box[0], box[2]], y: [box[1], box[3]] });
  }
  const line = (b, a, z, color = 'sky', o = {}) => b.path([a, z], { color, width: 3, ...o });
  const text = (b, p, value, color = 'ink', o = {}) => b.text(p, value, { color, align: 'center', baseline: 'middle', size: b.W < 560 ? 14 : 16, weight: 750, ...o });
  const dot = (b, p, label, color = 'ink', o = {}) => { b.point(p, { color, r: 5 }); if (label) text(b, p, label, color, { dy: 21, ...o }); };
  const drawPath = (b, points, color, o = {}) => b.path(points, { color, width: 3, ...o });
  const trace = (b, a, z, u, color = 'amber', o = {}) => { if (u > 0) line(b, a, mix(a, z, u), color, { width: 5, ...o }); };
  function arrow(b, a, z, color = 'sky', o = {}) {
    line(b, a, z, color, o);
    const dx = z.x - a.x, dy = z.y - a.y, len = Math.hypot(dx, dy);
    if (len < 1e-8) return;
    const k = Math.min(10 / (b.k || 40), len / 3), x = dx / len, y = dy / len;
    b.path([z, pt(z.x - k * x + k * y / 2, z.y - k * y - k * x / 2), pt(z.x - k * x - k * y / 2, z.y - k * y + k * x / 2)], { close: true, color, fill: color, fillAlpha: 1, ...o });
  }
  function ray(b, x, d, y, color = 'sky', u = 1, o = {}) {
    const a = pt(x, y), z = pt(d > 0 ? 13 : -1, y);
    arrow(b, a, mix(a, z, u), color, o); b.point(a, { color, r: 5 });
  }
  function infiniteLine(b, a, z, color = 'sky', o = {}) {
    const c = mix(a, z, .5); arrow(b, c, a, color, o); arrow(b, c, z, color, o);
  }
  function arc(b, a, z, r, color = 'amber', o = {}, center = pt(0, 0)) {
    if (Math.abs(z - a) < 1e-8) return;
    const count = Math.max(3, Math.ceil(Math.abs(z - a) / 4));
    const p = Array.from({ length: count + 1 }, (_, i) => polar(a + (z - a) * i / count, r, center));
    if (o.fill) b.path([center, ...p], { close: true, color: null, fill: color, fillAlpha: .15, ...o });
    b.path(p, { color, width: 3, ...o });
  }
  function unitTicks(b, a, z, n, color = 'amber', u = 1) {
    const show = Math.floor(n * u + 1e-7);
    for (let i = 1; i < n && i <= show; i++) {
      const p = mix(a, z, i / n); line(b, pt(p.x, p.y - .14), pt(p.x, p.y + .14), color, { width: 2 });
    }
  }
  function bracket(b, a, z, value, color = 'amber') {
    line(b, a, z, color, { width: 2 });
    [a, z].forEach(p => line(b, pt(p.x, p.y - .12), pt(p.x, p.y + .12), color, { width: 2 }));
    if (value) text(b, mix(a, z, .5), value, color, { dy: -16 });
  }
  function pointsOnLine(b, xs, y = 0, names = LETTERS) {
    line(b, pt(-1, y), pt(13, y), 'muted', { width: 1.6 });
    xs.forEach((x, i) => dot(b, pt(x, y), names[i]));
  }
  function project(p, camera, extra = 0) {
    const yaw = (camera.yaw + extra) * D, pit = camera.pitch * D;
    const x = p.x * Math.cos(yaw) - p.z * Math.sin(yaw), z = p.x * Math.sin(yaw) + p.z * Math.cos(yaw);
    return { x, y: -(p.y * Math.cos(pit) - z * Math.sin(pit)), d: p.y * Math.sin(pit) + z * Math.cos(pit) };
  }
  function solidVisibility(solid, camera, extra = 0) {
    const q = solid.V.map(p => project(p, camera, extra));
    const c = q.reduce((a, p) => ({ x: a.x + p.x / q.length, y: a.y + p.y / q.length, d: a.d + p.d / q.length }), { x: 0, y: 0, d: 0 });
    const fronts = solid.F.map(f => {
      const [a, b, z] = f.map(i => q[i]), u = { x: b.x - a.x, y: b.y - a.y, d: b.d - a.d }, v = { x: z.x - a.x, y: z.y - a.y, d: z.d - a.d };
      const n = { x: u.y * v.d - u.d * v.y, y: u.d * v.x - u.x * v.d, d: u.x * v.y - u.y * v.x };
      const fc = f.reduce((a, i) => ({ x: a.x + q[i].x / f.length, y: a.y + q[i].y / f.length, d: a.d + q[i].d / f.length }), { x: 0, y: 0, d: 0 });
      const sign = n.x * (fc.x - c.x) + n.y * (fc.y - c.y) + n.d * (fc.d - c.d) < 0 ? -1 : 1;
      return n.d * sign > 1e-8;
    });
    return { q, front: solid.E.map(e => solid.F.some((f, i) => fronts[i] && f.includes(e.u) && f.includes(e.v))) };
  }
  function drawSolid(b, solid, camera, extra, offset, mode, u) {
    const vis = solidVisibility(solid, camera, extra), p = i => pt(vis.q[i].x + offset.x, vis.q[i].y + offset.y);
    const edgeOrder = solid.kind === 1 ? ['bot','side'] : ['bot', 'top', 'side'];
    solid.E.forEach((e, i) => {
      const active = mode === 'edges' && (edgeOrder.indexOf(e.g) + .2) / edgeOrder.length < u;
      line(b, p(e.u), p(e.v), active ? e.g === 'side' ? 'rose' : 'amber' : 'sky', { width: active ? 4 : 2.4, dash: vis.front[i] ? undefined : [5, 5], alpha: vis.front[i] ? 1 : .6 });
    });
    solid.V.forEach((_, i) => dot(b, p(i), '', mode === 'vertices' && i / solid.V.length < u ? 'amber' : 'sky'));
  }
  function solidTally(b, m, variant, t) {
    if (t < 5.4) return;
    const span = 5.4, x = i => -span / 2 + (i + .5) * span / Math.max(m.a, m.b);
    text(b, pt(-3.05, 1.9), 'a', 'amber'); text(b, pt(-3.05, 2.5), 'b', 'sky');
    for (let i = 0; i < m.a; i++) b.point(pt(x(i), 1.9), { color: variant === 1 ? 'amber' : t > 6.4 ? 'muted' : 'amber', r: 4 });
    for (let i = 0; i < m.b; i++) {
      const erased = variant === 0 && i < m.a && t > 6.4;
      line(b, pt(x(i), 2.35), pt(x(i), 2.65), erased ? 'muted' : t > 6.4 ? 'green' : 'sky', { width: 3 });
      if (variant === 2) line(b, pt(x(i), 2.95), pt(x(i), 3.25), t > 6.4 ? 'green' : 'sky');
    }
    if (variant !== 1) {
      const u = phase(t, 5.5, 6.6);
      for (let i = 0; i < m.a; i++) line(b, pt(x(i), 1.98), pt(x(i), 1.98 + .42 * u), 'muted', { width: 1, dash: [3, 3] });
      if (variant === 2 && t > 6.4) for (let i = 0; i < m.a; i++) line(b, pt(x(i) - .07, 2.35), pt(x(i) + .07, 2.65), 'red', { width: 2 });
    }
    if (variant === 2) text(b, pt(-3.05, 3.1), 'b', 'sky');
  }
  function drawSolids(b, t, m, id, v) {
    if (id === 'b1-1') {
      prepare(b, [-3.5, -3, 3.5, 3.6]);
      drawSolid(b, m.solid, m.camera, 16 * phase(t, .8, 2.8), pt(0, -.75), t < 3.4 ? 'vertices' : 'edges', t < 3.4 ? phase(t, .8, 2.9) : phase(t, 3.4, 5.2));
      text(b, pt(0, -2.5), m.name, 'sky'); solidTally(b, m, v, t); return;
    }
    const tall = b.W < 560, offsets = tall ? [pt(0, -2.15), pt(0, 2.05)] : [pt(-2.5, 0), pt(2.5, 0)];
    prepare(b, tall ? [-3, -4.2, 3, 4.2] : [-5.2, -2.7, 5.2, 2.9]);
    m.solids.forEach((s, i) => {
      const mode = v === 2 ? t < 3.4 ? 'vertices' : 'edges' : v === 0 ? 'vertices' : 'edges';
      const u = v === 2 ? i === 0 ? phase(t, t < 3.4 ? .8 : 3.4, t < 3.4 ? 3 : 5.2) : 0 : phase(t, i === 0 ? .8 : 3.4, i === 0 ? 3 : 5.2);
      drawSolid(b, s, m.camera, 12 * phase(t, .8, 3), offsets[i], mode, u);
      text(b, pt(offsets[i].x, offsets[i].y - 1.65), i === 0 ? m.an : m.bn, i === 0 ? 'amber' : 'rose');
    });
  }
  function planeGeometry(m) {
    const point = (u, z) => ({ x: m.hx + u * Math.cos(m.phi * D), y: .9 + u * Math.sin(m.phi * D), z });
    return { P: [{ x:-4.6,y:0,z:-2.1 },{ x:4.6,y:0,z:-2.1 },{ x:4.6,y:0,z:2.1 },{ x:-4.6,y:0,z:2.1 }], Q: [point(-3,-2.1),point(3,-2.1),point(3,2.1),point(-3,2.1)], line: [point(-3,0),point(3,0)], point };
  }
  function drawPlanes(b, t, m, v) {
    prepare(b, [-6, -4.5, 6, 4.5]);
    const geo = planeGeometry(m), p = x => project(x, m.camera, 0);
    b.path(geo.P.map(p), { close:true, color:'sky', fill:'sky', fillAlpha:.13, width:2.5 });
    if (m.mode === 0) b.path(geo.Q.map(p), { close:true, color:'amber', fill:'amber', fillAlpha:.13, width:2.5 });
    else infiniteLine(b, p(geo.line[0]), p(geo.line[1]), 'amber');
    text(b, p(geo.P[2]), 'P', 'sky', { dx:14, dy:14 });
    text(b, p(m.mode === 0 ? geo.Q[2] : geo.line[1]), m.mode === 0 ? 'Q' : 'm', 'amber', { dx:12, dy:-15 });
    if (t < .8) return;
    const sweep = phase(t, .8, 3.4);
    if (m.par) {
      const xs = v === 2 ? [-2,0,2] : [-1.5,1.5];
      xs.forEach(x => {
        const a = p({x:m.hx+x,y:0,z:0}), z = p({x:m.hx+x,y:.9,z:0});
        trace(b, a, z, sweep, 'rose', { width:3 });
        if (t > 3.4) b.ticks(a, z, { color:'rose', count:1 });
      });
      if (t > 5.4) text(b, p({x:0,y:.45,z:0}), '일정한 간격', 'rose', { dx:38 });
    } else {
      const hit = {x:m.xHit,y:0,z:0};
      if (v !== 0) {
        const u = -.9 / Math.sin(m.phi * D), left=geo.point(u-.6,0), right=geo.point(u+.6,0);
        trace(b,p(left),p(right),sweep,'rose',{width:5});
        if(t>2.2) { dot(b,p(left),'아래','rose',{dy:20}); dot(b,p(right),'위','amber',{dy:-20}); }
      }
      if (t > (v === 0 ? .8 : 3.4)) {
        const u = phase(t,v===0?.8:3.4,5.2);
        if (m.mode === 0) trace(b,p({...hit,z:-2.1}),p({...hit,z:2.1}),u,'green',{width:5});
        else b.point(p(hit),{color:'green',r:5+3*u});
      }
    }
  }

  function sameComparison(m, v) {
    const a = LETTERS.indexOf(m.asked[0]), z = LETTERS.indexOf(m.asked[1]), d = Math.sign(z - a);
    const first = { s:a, x:m.xs[a], d, name:m.asked };
    if (v === 0) return [first, { s:a, x:m.xs[a], d, name:m.other }];
    if (v === 1) {
      const s = a + d, next = s + d;
      return [first, { s, x:m.xs[s], d, name:LETTERS[s] + LETTERS[next] }];
    }
    const other = a - d;
    return [first, { s:a, x:m.xs[a], d:-d, name:LETTERS[a] + (other >= 0 && other < 4 ? LETTERS[other] : 'X'), aux:other < 0 || other >= 4 ? pt(d > 0 ? -1 : 13,0) : null }];
  }
  function rotatePoint(p,c,a){const x=p.x-c.x,y=p.y-c.y;return pt(c.x+x*Math.cos(a)-y*Math.sin(a),c.y+x*Math.sin(a)+y*Math.cos(a));}
  function unfoldPath(m,u){
    const A=pt(m.A,0),C=pt(m.A+.4*m.d,-m.h),B=pt(m.B,0);
    const a=Math.atan2(C.y-A.y,C.x-A.x),z=Math.atan2(B.y-C.y,B.x-C.x);
    const moved=rotatePoint(B,C,(a-z)*Math.min(1,2*u)),turn=-a*Math.max(0,2*u-1);
    return [A,rotatePoint(C,A,turn),rotatePoint(moved,A,turn)];
  }
  function commonDescription(m) {
    const s = m.sh;
    if (s.kind === 'none') return '공통부분이 없습니다.';
    if (s.kind === 'point') return `공통부분은 점 ${LETTERS[s.p]}입니다.`;
    if (s.kind === 'seg') return `공통부분은 선분 ${LETTERS[s.a]}${LETTERS[s.c]}입니다.`;
    return `공통부분은 ${LETTERS[s.s]}에서 ${s.d > 0 ? '오른쪽' : '왼쪽'}으로 뻗는 반직선입니다.`;
  }
  function drawLinear(b, t, m, id, v) {
    prepare(b, [-1.8, -1.2, 13.8, 6.2]);
    const u = phase(t,.8,3.3), w = phase(t,3.4,5.3);
    if (id === 'l-ray') {
      const xs=[m.A,m.B], d=m.dir;
      if (v === 0) {
        [0,2.4].forEach((y,i)=>{ infiniteLine(b,pt(-1,y),pt(13,y),'sky'); pointsOnLine(b,xs,y,'AB'); text(b,pt(6,y-.65),i?'직선 BA':'직선 AB','sky'); });
        infiniteLine(b,pt(6-7*u,0),pt(6+7*u,0),'amber');
        if(t>=3.4) infiniteLine(b,pt(6-7*w,2.4),pt(6+7*w,2.4),'rose');
        line(b,pt(m.A,4.8),pt(m.B,4.8),'sky'); dot(b,pt(m.A,4.8),'A'); dot(b,pt(m.B,4.8),'B');
        trace(b,pt(m.A,4.8),pt(m.B,4.8),phase(t,5.4,6.3),'amber');
        trace(b,pt(m.B,4.8),pt(m.A,4.8),phase(t,6.3,7.2),'rose',{width:3});
      } else {
        ray(b,m.A,d,0,'sky'); ray(b,m.B,-d,2.4,'rose');
        pointsOnLine(b,xs,0,'AB'); pointsOnLine(b,xs,2.4,'AB');
        text(b,pt(6,-.65),'반직선 AB','sky'); text(b,pt(6,1.75),'반직선 BA','rose');
        ray(b,m.A,d,0,'amber',u); if(t>3.4)ray(b,m.B,-d,2.4,'amber',w);
        if(v===2){
          pointsOnLine(b,xs,4.8,'AB');
          if(t>5.4)trace(b,pt(Math.min(m.A,m.B),4.8),pt(Math.max(m.A,m.B),4.8),phase(t,5.4,7.1),'green',{width:6});
        } else if(t>5.4){
          b.point(pt(m.A,0),{color:'amber',r:8}); b.point(pt(m.B,2.4),{color:'amber',r:8});
          line(b,pt(m.A,0),pt(m.A,3.1),'muted',{dash:[4,5],width:1});
          line(b,pt(m.B,0),pt(m.B,3.1),'muted',{dash:[4,5],width:1});
        }
      }
      return;
    }
    if(id==='l-types'){
      prepare(b,[-1.8,-2,13.8,3.6]);
      if(v===0)infiniteLine(b,pt(-1,0),pt(13,0));
      else if(v===1)ray(b,m.A,1,0);
      else line(b,pt(m.A,0),pt(m.B,0));
      dot(b,pt(m.A,0),'A');dot(b,pt(m.B,0),'B');
      if(v===0){trace(b,pt(m.A,0),pt(-1,0),u);trace(b,pt(m.B,0),pt(13,0),u);}
      else if(v===1)ray(b,m.A,1,0,'amber',u);
      else trace(b,pt(m.A,0),pt(m.B,0),u);
      if(t>3.4){
        if(v>0)b.point(pt(m.A,0),{color:'rose',r:8});
        if(v===2){b.point(pt(m.B,0),{color:'rose',r:8});bracket(b,pt(m.A,1.4),pt(m.B,1.4),`${m.L} cm`,'sky');}
        else {arrow(b,pt(8,1.6),pt(8+4*w,1.6),'amber');if(v===0)arrow(b,pt(4,1.6),pt(4-4*w,1.6),'amber');}
      }
      return;
    }
    if(id==='l-same'){
      const rs=sameComparison(m,v);pointsOnLine(b,m.xs);
      if(rs[1].aux)dot(b,rs[1].aux,'X','muted');
      rs.forEach((r,i)=>{const y=2.1+i*2.2;ray(b,r.x,r.d,y,i?'rose':'sky');text(b,pt(6,y-.6),`반직선 ${r.name}`,i?'rose':'sky');
        if(t>(i?3.4:.8))ray(b,r.x,r.d,y,'amber',i?w:u);
        if(t>5.4)b.point(pt(r.x,y),{color:v===1?'rose':'green',r:8});
      });
      if(t>5.4){
        line(b,pt(rs[0].x,1.3),pt(rs[0].x,4.9),'muted',{dash:[4,5],width:1.3});
        if(v===1)line(b,pt(rs[1].x,1.3),pt(rs[1].x,4.9),'muted',{dash:[4,5],width:1.3});
      }
      return;
    }
    if(id==='l-common'){
      pointsOnLine(b,m.xs,0);const rs=[m.r1,m.r2];
      rs.forEach((r,i)=>{const y=1.7+i*1.8;ray(b,m.xs[r.s],r.d,y,i?'rose':'sky');text(b,pt(6,y-.56),i?m.n2:m.n1,i?'rose':'sky');if(t>(i?3.4:.8))ray(b,m.xs[r.s],r.d,y,'amber',i?w:u);});
      const y=5.2;
      if(t>5.4){
        const h=m.sh;
        if(h.kind==='seg')trace(b,pt(m.xs[h.a],y),pt(m.xs[h.c],y),phase(t,5.4,7.2),'green',{width:6});
        if(h.kind==='ray')ray(b,m.xs[h.s],h.d,y,'green',phase(t,5.4,7.2));
        if(h.kind==='point')dot(b,pt(m.xs[h.p],y),LETTERS[h.p],'green');
        if(h.kind==='none'){
          ray(b,m.xs[m.r1.s],m.r1.d,y,'sky');ray(b,m.xs[m.r2.s],m.r2.d,y,'rose');
          if(t>7.4)text(b,pt(6,y-.6),'겹치는 곳 없음','green');
        }
      }
      if(v===1&&t>.8&&t<5.4){
        const x=-.5+13*phase(t,.8,5.3),in1=(x-m.xs[m.r1.s])*m.r1.d>=0,in2=(x-m.xs[m.r2.s])*m.r2.d>=0;
        dot(b,pt(x,5.2),'검사점',in1&&in2?'green':'muted');
        rs.forEach((r,i)=>line(b,pt(x,1.7+i*1.8),pt(x,5.2),'muted',{dash:[3,6],width:1}));
      }
      if(v===2&&t>2.5)rs.forEach((r,i)=>b.point(pt(m.xs[r.s],1.7+i*1.8),{color:'amber',r:8}));
      return;
    }
    // Unbend the two-link route about its joint, then rotate the straightened
    // copy about A. Both link lengths stay unchanged throughout the proof.
    const A=pt(m.A,0),B=pt(m.B,0),C=pt(m.A+.4*m.d,-m.h);
    const first=Math.hypot(C.x-A.x,C.y),second=Math.hypot(B.x-C.x,C.y),total=first+second;
    prepare(b,v===0?[Math.min(m.A,C.x-second)-.9,Math.min(-m.h-second,-2)-.8,Math.max(m.A+total,C.x+second)+.9,3.1]:[-1,-4.3,13,3.6]);
    line(b,A,B,'sky');drawPath(b,[A,C,B],'rose');dot(b,A,'A');dot(b,B,'B');
    if(v===0){
      trace(b,A,B,u,'amber');
      if(t>3.4){
        drawPath(b,unfoldPath(m,phase(t,3.4,6.5)),'rose',{width:5});
      }
      if(t>5.4)trace(b,A,B,phase(t,5.4,7.1),'green',{width:6});
    }else{
      text(b,A,String(m.A),'amber',{dy:45});text(b,B,String(m.B),'amber',{dy:45});
      for(let i=Math.ceil(m.A);i<=m.B;i++)line(b,pt(i,1.1),pt(i,1.3),'muted',{width:1.5});
      trace(b,pt(m.A,1.2),pt(m.B,1.2),phase(t,.8,5.3),'amber');
      if(t>5.4)bracket(b,pt(m.A,2.4),pt(m.B,2.4),t>=7.4?`${m.d} cm`:'B의 눈금 − A의 눈금','green');
    }
  }

  function countGeometry(id,m){
    if(id==='l-col')return {points:m.xs.map(x=>pt(x,0)),n:m.n,col:m.n};
    if(id==='l-gen')return {points:m.pts.map(p=>pt(p.x,p.y)),n:m.m,col:0};
    return {points:[...m.on.map(x=>pt(x,0)),...m.off.map(p=>pt(p.x,p.y))],n:m.n,col:m.k};
  }
  function countPairs(id,v,m){
    const g=countGeometry(id,m), isRay=v===1;
    return (isRay?orderedPairs(g.n):pairs(g.n)).map(([a,z])=>({a,z,collinear:a<g.col&&z<g.col}));
  }
  function drawCounting(b,t,m,id,v){
    const combined=v===2&&id!=='l-mix',mode=combined&&t>=3.4?1:v;
    const g=countGeometry(id,m),ps=countPairs(id,mode,m),isRay=mode===1;
    prepare(b,id==='l-gen'?[-4.8,-4.8,4.8,4.8]:[-1.4,-6.2,13.5,4.1]);
    if(g.col)infiniteLine(b,pt(-1,0),pt(13,0),'muted',{width:1.7});
    const progress=combined?phase(t,t<3.4?.8:3.4,t<3.4?3.3:5.3):phase(t,.8,5.2), group=Math.min(g.n-1,Math.floor(progress*g.n));
    if(t>.8){
      ps.forEach(({a,z,collinear})=>{
        if(a>group)return;
        const p=g.points[a],q=g.points[z],active=a===group,color=active?'amber':'sky';
        if(id==='l-mix'&&v<2&&collinear&&t>=3.4)return;
        if(id==='l-col'&&!isRay){
          const h=.5+Math.abs(q.x-p.x)*.14;
          const curve=Array.from({length:25},(_,i)=>{const u=i/24;return pt(p.x+(q.x-p.x)*u,-4*h*u*(1-u));});
          drawPath(b,curve,color,{width:active?2.7:1.2,alpha:active?1:.35});
          if(active)line(b,p,q,'amber',{width:5,alpha:.65});
        }else if(id==='l-col'&&isRay){
          const d=Math.sign(z-a),y=d>0?1.5:2.8;
          if(z!==(d>0?g.n-1:0))return;
          ray(b,p.x,d,y,color,1,{width:active?3:1.5,alpha:active?1:.35});
        }else if(isRay){
          const dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy);
          arrow(b,p,pt(q.x+dx*.55/len,q.y+dy*.55/len),color,{width:active?2.6:1.1,alpha:active?1:.3});
        }else if(id==='l-mix'&&v===0){
          const d=.35/Math.hypot(q.x-p.x,q.y-p.y);
          infiniteLine(b,mix(p,q,-d),mix(p,q,1+d),color,{width:active?2.8:1.2,alpha:active?1:.35});
        }else if(id==='l-gen'&&v===0&&t>=3.4){
          const d=.6*phase(t,3.4,5.3)/Math.hypot(q.x-p.x,q.y-p.y);
          infiniteLine(b,mix(p,q,-d),mix(p,q,1+d),color,{width:active?2.8:1.2,alpha:active?1:.35});
        }else line(b,p,q,color,{width:active?3:1.3,alpha:active?1:.35});
      });
      if(id==='l-mix'&&v<2&&t>=3.4){
        if(v===0)infiniteLine(b,pt(-1,0),pt(13,0),'green',{width:4});
        else m.on.forEach((x,i)=>{if(i<m.k-1)ray(b,x,1,1.6,'green',1,{width:2});if(i>0)ray(b,x,-1,2.9,'rose',1,{width:2});});
      }
      if(id==='l-col'&&t>5.4)g.points.forEach((p,i)=>text(b,pt(p.x,3.65),String(isRay?i===0||i===g.n-1?1:2:g.n-i-1),isRay?'rose':'green',{size:13}));
    }
    g.points.forEach((p,i)=>dot(b,p,LETTERS[i],i<g.n?'ink':'muted',{dy:p.y<0?-19:20}));
    if(id==='l-gen'&&t>.8){dot(b,g.points[group],LETTERS[group],'amber',{dy:g.points[group].y<0?-19:20});}
    if(id==='l-mix'&&t>3.4)text(b,pt(6,3.65),v===0?`${C2(m.k)}개의 이름 → 한 직선`:v===1?`같은 시작점·방향끼리 묶기`:'양 끝점이 다르면 다른 선분','ink',{size:13});
    if(id==='l-gen'&&t>5.4&&v===2){
      const A=g.points[0],B=g.points[1];arrow(b,A,B,'rose',{width:4});arrow(b,B,A,'green',{width:2});
    }
    if(id==='l-col'&&v===0&&t>5.4){
      const A=g.points[0],B=g.points[1];
      trace(b,A,B,phase(t,5.4,6.3),'amber');trace(b,B,A,phase(t,6.3,7.2),'rose',{width:3});
      text(b,pt(6,-3.7),'선분 AB = 선분 BA','ink',{size:14});
    }
  }

  // Copies below a number line are introduced in place. Their subsequent
  // translations are horizontal, so a copied length is never stretched.
  function midpointPieces(m,u){
    return { first:[pt(0,3),pt(m.p,3)],second:[pt(m.N+(m.p-m.N)*u,3),pt(m.L+(m.p-m.N)*u,3)] };
  }
  function midLayout(id,m){
    if(id==='m-mid')return {L:m.L,n:0,points:[[0,'A'],[m.M,'M'],[m.a,'C'],[m.N,'N'],[m.L,'B']]};
    if(id==='m-dbl')return {L:m.L,n:4,points:[[0,'A'],[m.L/2,'M'],[m.AN,'N'],[m.L,'B']]};
    if(id==='m-tri')return {L:m.L,n:6,points:[[0,'A'],[m.L/3,'P'],[m.L/2,'M'],[2*m.L/3,'Q'],[m.L,'B']]};
    return {L:m.AB,n:m.n,points:[[0,'A'],[m.AC/2,'M'],[m.AC,'C'],[m.AB,'B']]};
  }
  function midpointGiven(id,v,m){
    if(id==='m-mid')return `${v===0?'AB = '+m.L:'MN = '+num(m.mn)} cm; M은 AC의 중점, N은 CB의 중점`;
    if(id==='m-dbl')return `${v===0?'AB = '+m.L:v===1?'MN = '+m.q:'AN = '+m.AN} cm; M은 AB의 중점, N은 MB의 중점`;
    if(id==='m-tri')return `${v===1?'PM = '+m.PM:'AB = '+m.L} cm; P, Q는 삼등분점, M은 중점`;
    return `${v===0?'AB = '+m.AB:'MC = '+m.mc} cm; AC = ${m.k} × CB, M은 AC의 중점`;
  }
  function drawMidpoints(b,t,m,id,v){
    const layout=midLayout(id,m),L=layout.L,X=x=>12*x/L;
    prepare(b,[-1.2,-2.2,13.2,5.6]);
    line(b,pt(0,0),pt(12,0),'sky',{width:5});
    layout.points.forEach(([x,name],i)=>dot(b,pt(X(x),0),name,'ink',{dy:i%2?43:21}));
    if(id==='m-mid'){
      const intervals=[[0,m.M,'sky'],[m.M,m.a,'sky'],[m.a,m.N,'rose'],[m.N,m.L,'rose']];
      intervals.forEach(([a,z,c])=>{line(b,pt(X(a),0),pt(X(z),0),c,{width:5});b.ticks(pt(X(a),0),pt(X(z),0),{color:c,count:c==='sky'?1:2});});
      bracket(b,pt(v===0?0:X(m.M),-1),pt(v===0?12:X(m.N),-1),`${v===0?m.L:num(m.mn)} cm`,'amber');
      if(t>.8){trace(b,pt(X(m.M),0),pt(X(m.a),0),phase(t,.8,2.3),'amber');trace(b,pt(X(m.a),0),pt(X(m.N),0),phase(t,2.3,3.4),'amber');}
      if(t>=3.4){
        const p=midpointPieces(m,phase(t,3.4,5.3));
        drawPath(b,p.first.map(a=>pt(X(a.x),a.y)),'sky',{width:7});drawPath(b,p.second.map(a=>pt(X(a.x),a.y)),'rose',{width:7});
        if(t>5.4){
          line(b,pt(6,3),pt(6+X(m.p),3),'sky',{width:7});line(b,pt(6+X(m.p),3),pt(12,3),'rose',{width:7});
          text(b,pt(3,3.8),'○ + △','ink');text(b,pt(9,3.8),'○ + △','ink');
        }
      }
      return;
    }
    const n=layout.n,unit=12/n,grid=phase(t,.8,3.3);
    unitTicks(b,pt(0,0),pt(12,0),n,'amber',grid);
    for(let i=0;i<n;i++){
      if(i/n>grid||t<.8)continue;
      const color=id==='m-ratio'&&i===n-1?'rose':i%2?'sky':'amber';
      line(b,pt(i*unit,0),pt((i+1)*unit,0),color,{width:6});
    }
    if(id==='m-dbl'){
      b.ticks(pt(0,0),pt(6,0),{color:'sky'});b.ticks(pt(6,0),pt(12,0),{color:'sky'});
      bracket(b,pt(v===1?6:0,-1),pt(v===0?12:9,-1),`${v===0?m.L:v===1?m.q:m.AN} cm`);
      if(t>3.4){
        const src=6,move=phase(t,3.4,5.3);
        for(let i=0;i<4;i++)line(b,pt(src+(3*i-src)*move,3),pt(src+3+(3*i-src)*move,3),i<3?'amber':'rose',{width:7});
      }
      if(t>5.4)trace(b,pt(0,4.4),pt(v===0?9:12,4.4),phase(t,5.4,7.1),'green',{width:6});
    }else if(id==='m-tri'){
      bracket(b,pt(v===1?4:0,-1),pt(v===1?6:12,-1),`${v===1?m.PM:m.L} cm`);
      if(t>3.4){
        const a=v===2?6:4,z=v===2?8:6;
        if(v===1){for(let i=0;i<6;i++){const dx=(2*i-4)*phase(t,3.4,5.3);line(b,pt(4+dx,3),pt(6+dx,3),'amber',{width:6});}}
        else {trace(b,pt(0,3),pt(z,3),phase(t,3.4,4.3),'amber');trace(b,pt(0,4),pt(a,4),phase(t,4.3,5.3),'rose');}
        if(t>5.4)trace(b,pt(v===1?0:a,5),pt(v===1?12:z,5),phase(t,5.4,7.1),'green',{width:5});
      }
    }else{
      const mid=X(m.AC/2),c=X(m.AC);
      bracket(b,pt(v===0?0:mid,-1),pt(v===0?12:c,-1),`${v===0?m.AB:m.mc} cm`);
      if(t>3.4){
        const move=phase(t,3.4,5.3);
        for(let i=0;i<n;i++){const dx=(i*unit-c)*move;line(b,pt(c+dx,3),pt(12+dx,3),i===n-1?'rose':'sky',{width:7});}
      }
      if(t>5.4){
        b.ticks(pt(0,0),pt(mid,0),{color:'amber'});b.ticks(pt(mid,0),pt(c,0),{color:'amber'});
        trace(b,pt(v===0?mid:0,4.6),pt(12,4.6),phase(t,5.4,7.1),'green',{width:6});
      }
    }
  }
  function drawLengthEquation(b,t,m,v){
    prepare(b,[-1.2,-2.2,13.2,6.3]);
    const u=phase(t,3.4,6.6),x=m.x+(m.x0-m.x)*u,am=m.a*x+m.bb,mb=m.c*x+m.d;
    const pos=12*am/(am+mb);
    line(b,pt(0,0),pt(pos,0),'sky',{width:7});line(b,pt(pos,0),pt(12,0),'rose',{width:7});
    dot(b,pt(0,0),'A');dot(b,pt(pos,0),'M','ink',{dy:43});dot(b,pt(12,0),'B');
    text(b,pt(pos/2,-.8),expr(m.a,m.bb),'sky');text(b,pt((12+pos)/2,-.8),expr(m.c,m.d),'rose');
    if(t<3.4)text(b,pt(6,3.1),`현재 시험값 x = ${num(m.x)}`,'muted');
    if(t>.8){
      const a=pt(0,4.2),z=pt(pos,4.2),p=pt(0,5.4),q=pt(12-pos,5.4);
      trace(b,a,z,phase(t,.8,2.2),'sky',{width:7});trace(b,p,q,phase(t,2.2,3.3),'rose',{width:7});
    }
    if(t>=6.6){b.ticks(pt(0,0),pt(pos,0),{color:'green'});b.ticks(pt(pos,0),pt(12,0),{color:'green'});}
    if(v===1&&t>=7.4)bracket(b,pt(0,-1.7),pt(12,-1.7),`${num(m.AB0)} cm`,'green');
  }

  function clockFace(b,m){
    const O=pt(0,0);b.circle(O,2,{color:'sky',width:2.5});
    for(let i=0;i<60;i++)line(b,polar(90-6*i,i%5?1.9:1.78),polar(90-6*i,2),'muted',{width:i%5?1:2});
    for(let i=1;i<=12;i++)text(b,polar(90-30*i,1.57),String(i),'ink',{size:14});
    line(b,O,polar(90-m.th,.96),'amber',{width:7});line(b,O,polar(90-m.tm,1.4),'sky',{width:4});dot(b,O,'');
    text(b,pt(0,-2.45),`${m.h}시 ${m.m}분`,'ink');
  }
  function drawClock(b,t,m,id,v){
    prepare(b,[-2.8,-2.9,2.8,3.5]);clockFace(b,m);
    const u=phase(t,.8,3.3),w=phase(t,3.4,5.3),O=pt(0,0);
    line(b,O,polar(90,1.3),'muted',{dash:[4,5],width:1.6});
    if(id==='ck2'&&v===0){
      if(t>.8){
        line(b,O,polar(90-m.tm-6*u,1.4),'rose',{width:3,dash:[4,4]});
        line(b,O,polar(90-m.th-.5*u,.96),'rose',{width:3,dash:[4,4]});
      }
      if(t>3.4){
        trace(b,pt(-2,2.5),pt(2,2.5),w,'sky',{width:7});
        trace(b,pt(-2,3.1),pt(-2+4/12,3.1),w,'amber',{width:7});
        text(b,pt(2,2.5),'6°','sky',{dx:18});text(b,pt(-2+4/12,3.1),'0.5°','amber',{dx:25});
        if(t>5.4)line(b,pt(-2+4/12,2.5),pt(2,2.5),'green',{width:5});
      }
      return;
    }
    const hour=id==='ck1'&&v===0,minute=id==='ck1'&&v===1;
    if(minute){
      arc(b,90,90-m.tm*u,1.16,'sky',{fill:true});
      if(t>.8)line(b,O,polar(90-m.tm*u,1.4),'rose',{width:2,dash:[4,5]});
    }else{
      const base=30*m.hh,angle=base*u+.5*m.m*w;
      arc(b,90,90-angle,.68,'amber',{fill:true});
      if(t>.8)line(b,O,polar(90-angle,.96),'rose',{width:2,dash:[4,5]});
      if(!hour&&t>3.4)arc(b,90,90-m.tm*w,1.16,'sky',{fill:true});
    }
    if(!hour&&!minute&&t>5.4)arc(b,90-m.start,90-m.start-m.gap*phase(t,5.4,7.1),.43,'green',{fill:true,width:4});
  }
  function lineDirections(th,n){const ds=[0,th];for(let i=2;i<n;i++)ds.push(th+(180-th)*(i-1)/(n-1));return ds.slice(0,n);}
  function angleLine(b,a,color='sky',o={}){infiniteLine(b,polar(a,2),polar(a+180,2),color,o);}
  function drawVertical(b,t,m,v){
    prepare(b,[-2.9,-2.9,2.9,3.4]);const dirs=lineDirections(m.th,m.drawN);
    dirs.forEach((a,i)=>angleLine(b,a,i<2?'sky':'muted',{width:i<2?3:1.6}));dot(b,pt(0,0),'O','ink',{dx:14,dy:14});
    if(v===2){
      const ps=pairs(m.drawN),i=Math.min(ps.length-1,Math.floor(phase(t,.8,6.6)*ps.length)),pair=ps[i];
      if(t>.8&&pair){
        const a=dirs[pair[0]],z=dirs[pair[1]];
        angleLine(b,a,'amber',{width:4});angleLine(b,z,'rose',{width:4});
        arc(b,a,z,.55,'amber',{fill:true});arc(b,a+180,z+180,.55,'amber',{fill:true});
        arc(b,z,a+180,.8,'rose',{fill:true});arc(b,z+180,a+360,.8,'rose',{fill:true});
        text(b,pt(0,2.7),`직선 ${pair[0]+1}·${pair[1]+1} → 맞꼭지각 2쌍`,'ink',{size:14});
      }
    }else{
      arc(b,0,m.th,.62,'amber',{fill:true});text(b,polar(m.th/2,1.25),`${m.th}°`,'amber');
      text(b,polar(180+m.th/2,1.25),'c','rose');text(b,polar((m.th+180)/2,1.25),'b','rose');
      if(t>.8)arc(b,m.th,m.th+(180-m.th)*phase(t,.8,3.3),.78,'rose',{fill:true});
      if(v===0&&t>3.4){const turn=180*phase(t,3.4,5.3);arc(b,turn,turn+m.th,.62,'amber',{fill:true,width:4});}
      if(v===1&&t>3.4)arc(b,180+m.th,180+m.th+(180-m.th)*phase(t,3.4,5.3),.78,'rose',{fill:true});
      if(t>5.4)arc(b,v===0?180:180+m.th,v===0?180+m.th:360,.45,'green',{fill:true,width:4});
    }
  }
  function drawAngleEquation(b,t,m,v){
    prepare(b,[-3,-3,3,3.1]);const x=m.x+(m.solution-m.x)*phase(t,3.4,6.5),a=m.a1*x+m.b1,z=m.a2*x+m.b2;
    angleLine(b,0);line(b,pt(0,0),polar(a,2),'sky');line(b,pt(0,0),polar(180+z,2),'sky');
    arc(b,0,a,.67,'amber',{fill:true});arc(b,180,180+z,.67,'rose',{fill:true});
    text(b,polar(a/2,1.25),'α','amber');text(b,polar(180+z/2,1.25),'β','rose');
    text(b,pt(0,-2.6),`α = (${expr(m.a1,m.b1)})°`,'amber');text(b,pt(0,2.6),`β = (${expr(m.a2,m.b2)})°`,'rose');
    if(t>.8&&t<3.4){const turn=180*phase(t,.8,3.3);arc(b,turn,turn+a,.9,'amber',{width:4});}
    if(t>=6.5){arc(b,0,m.value,.78,'green');arc(b,180,180+m.value,.78,'green');}
    if(v===1&&t>=7.4){text(b,polar(a/2,1.25),'α','green');text(b,polar(180+z/2,1.25),'β','green');}
  }
  function drawThreeLines(b,t,m,v){
    prepare(b,[-3.1,-3.1,3.1,3.1]);const c=m.cfg,angles=[0,c.A,c.A+c.B];
    angles.forEach(a=>angleLine(b,a));
    const wedges=[[0,c.A,'amber'],[c.A,c.A+c.B,'rose'],[c.A+c.B,180,'sky']];
    wedges.forEach(([a,z,col])=>arc(b,a,z,.65,col,{fill:true}));
    text(b,polar(c.A/2,1.35),'a','amber');
    text(b,polar(c.A+c.B/2,1.35),'b','rose');
    text(b,polar((c.A+c.B+180)/2,1.35),'c','sky');
    text(b,pt(0,-2.65),v?`a = (${expr(1,c.p)})°`:`a = ${c.A}°, b = ${c.B}°`,'amber');
    if(v){
      arc(b,180+c.A+c.B,360,.65,'sky',{fill:true});text(b,polar((540+c.A+c.B)/2,1.35),'c′','sky');
      text(b,pt(0,2.65),`${t>=3.4?'c = c′':'c′'} = (${expr(c.r,c.s)})°`,'sky');
      if(t>.8){const turn=-180*phase(t,.8,3.3);arc(b,180+c.A+c.B+turn,360+turn,.85,'sky',{width:4});}
    }
    if(t>(v?3.4:.8))arc(b,0,180*phase(t,v?3.4:.8,5.3),1.05,'green',{width:4});
  }

  function swingToPerpendicular(P,Q,H,u){
    const a=Math.atan2(Q.y-P.y,Q.x-P.x),z=Math.atan2(H.y-P.y,H.x-P.x);
    return rotatePoint(Q,P,(z-a)*u);
  }
  function drawPerpendicular(b,t,m,v){
    const P=pt(m.px,-m.d),H=pt(m.px,0),Q=pt(m.px+m.q,0),len=Math.hypot(m.d,m.q);
    prepare(b,[Math.min(-3.3,Q.x-1.2,m.px-2),-m.d-1.2,Math.max(3.3,Q.x+1.2,m.px+2),Math.max(2,len-m.d+.8)]);
    infiniteLine(b,pt(Math.min(-3,Q.x-1),0),pt(Math.max(3,Q.x+1),0),'sky');
    line(b,P,H,'sky');if(m.q!==0)line(b,P,Q,'rose');
    b.right(H,P,pt(H.x+1,0),{color:'amber',size:13});
    dot(b,P,'P','ink',{dy:-21});dot(b,H,m.q===0?'H = Q':'H');if(m.q!==0)dot(b,Q,'Q','rose',{dy:Math.abs(m.q)<1.2?42:21});
    text(b,mix(P,H,.5),`${m.d} cm`,'sky',{dx:-16,align:'right'});
    if(t>.8)trace(b,P,H,phase(t,.8,3.3),'amber',{width:5});
    if(v===0){
      if(t>3.4){b.right(H,P,pt(H.x+1,0),{color:'green',size:17});b.point(H,{color:'green',r:8});}
    }else if(t>3.4){
      const end=swingToPerpendicular(P,Q,H,phase(t,3.4,5.3));line(b,P,end,'rose',{width:4,dash:[7,4]});
      if(t>5.4){line(b,P,H,'green',{width:6});if(m.q!==0)line(b,H,end,'rose',{width:5});}
    }
  }
  function bisectorAngles(m){return {A:180,C:180-m.g,B:180-m.T,M:180-m.g/2,N:180-(m.T+m.g)/2};}
  function drawBisectors(b,t,m,v){
    prepare(b,[-2.9,-3,2.9,1.5]);const a=bisectorAngles(m),O=pt(0,0);
    Object.entries(a).forEach(([name,angle])=>{const bisector=name==='M'||name==='N';line(b,O,polar(angle,2),name==='C'?'ink':'sky',{width:bisector?2.3:3.3});text(b,polar(angle,bisector?2.65:2.25),name,'ink',{size:15});});
    dot(b,O,'O','ink',{dy:22});
    [[a.M,a.A,'amber'],[a.C,a.M,'amber'],[a.N,a.C,'rose'],[a.B,a.N,'rose']].forEach(([from,to,c])=>arc(b,from,to,.6,c,{fill:true}));
    if(t>.8){
      const turn=-m.g/2*phase(t,.8,3.3);arc(b,a.M+turn,a.A+turn,.85,'amber',{fill:true,width:4});
    }
    if(t>3.4){
      const turn=(m.T-m.g)/2*phase(t,3.4,5.3);arc(b,a.B+turn,a.N+turn,.85,'rose',{fill:true,width:4});
    }
    if(t>5.4){
      arc(b,a.N,a.N+(a.M-a.N)*phase(t,5.4,7.1),1.04,'green',{width:4});
      if(v===1)arc(b,a.B,a.A,1.28,'muted',{dash:[5,5],width:2});
    }
    if(t>=7.4&&m.T===180)b.right(O,polar(a.M),polar(a.N),{color:'green',size:15});
  }
  function triangleFor(m,v){return v===1?m.problemTriangle:{b:m.b,h:m.h,sa:m.sa};}
  function drawTriangleDistance(b,t,m,v){
    const q=triangleFor(m,v),A=pt(q.sa,-q.h),B=pt(0,0),C=pt(q.b,0),H=pt(q.sa,0);
    prepare(b,[Math.min(0,q.sa)-2,-q.h-1.3,Math.max(q.b,q.sa)+2,2.3]);
    b.path([A,B,C],{close:true,color:'sky',width:3.5,fill:'sky',fillAlpha:.1});
    infiniteLine(b,pt(Math.min(0,q.sa)-.8,0),pt(Math.max(q.b,q.sa)+.8,0),'muted',{dash:[5,5],width:1.5});
    line(b,A,H,'sky',{dash:[5,4],width:2});b.right(H,A,q.sa<q.b?C:B,{color:'amber',size:12});
    dot(b,A,'A','ink',{dy:-22});dot(b,B,q.sa===0?'B = H':'B','ink',{dx:-10});dot(b,C,q.sa===q.b?'C = H':'C','ink',{dx:12});
    if(q.sa!==0&&q.sa!==q.b)dot(b,H,'H','ink',{dy:Math.abs(q.sa)<.9||Math.abs(q.sa-q.b)<.9?44:22});
    bracket(b,pt(0,1),pt(q.b,1),`${q.b} cm`,'sky');
    text(b,mix(A,H,.5),`${q.h} cm`,'sky',{dx:q.sa>=q.b?18:-18,align:q.sa>=q.b?'left':'right'});
    if(v===1)text(b,mix(A,B,.5),`${q.ab} cm`,'sky',{dx:-15,dy:-17,align:'right'});
    if(t>.8)trace(b,A,H,phase(t,.8,3.3),'amber',{width:5});
    if(t>3.4){b.right(H,A,q.sa<q.b?C:B,{color:'green',size:17});b.point(H,{color:'green',r:7});}
    if(t>5.4)line(b,A,H,'green',{width:6});
  }

  function givenFor(id,v,m){
    if(id==='b1-1')return `${m.name}; 교점의 개수 a, 교선의 개수 b. $${['b-a','a+b','2b-a'][v]}$를 구합니다.`;
    if(id==='b1-2')return `${m.mode?'직선 m과 평면 P':'평면 P와 Q'}; ${m.par?'서로 떨어져 평행함':`기울기 ${m.phi}°`}. 현재 놓인 모양에서 공통부분을 확인합니다.`;
    if(id==='b1-3')return `${m.an}과 ${m.bn}; ${v===0?'교점':v===1?'교선':m.an+'의 교점과 교선 합'}을 셉니다.`;
    if(id==='l-ray')return `A의 눈금 ${m.A} cm, B의 눈금 ${m.B} cm. ${v===0?'직선·선분':v===1?'반직선 AB와 BA':'두 반직선의 공통부분'}을 비교합니다.`;
    if(id==='l-types')return `A와 B를 지나는 ${['직선','반직선','선분'][v]}; AB = ${m.L} cm. 실제 끝점과 계속 뻗는 쪽을 구별합니다.`;
    if(id==='l-same'){
      const rs=sameComparison(m,v);return `A, B, C, D는 현재 순서대로 한 직선 위에 있습니다. 반직선 ${rs[0].name}, ${rs[1].name}을 비교합니다.${rs[1].aux?' X는 시작점의 반대쪽에 표시한 보조점입니다.':''}`;
    }
    if(id==='l-common')return `${m.n1}과 ${m.n2}; 두 반직선이 모두 포함하는 곳을 찾습니다.`;
    if(id==='l-short')return `A의 눈금 ${m.A} cm, B의 눈금 ${m.B} cm. 돌아가는 길과 곧게 이은 길이를 비교합니다.`;
    if(id==='l-col')return `한 직선 위의 서로 다른 점 ${m.n}개. ${['선분','반직선','선분과 반직선의 합'][v]}을 셉니다.`;
    if(id==='l-gen')return `어느 세 점도 한 직선 위에 없는 점 ${m.n}개 중 현재 이어 본 점 ${m.m}개를 사용합니다.`;
    if(id==='l-mix')return `점 ${m.n}개 중 ${m.k}개가 한 직선 위에 있고, 그 밖에 세 점이 한 직선에 놓이는 경우는 없습니다.`;
    if(id.startsWith('m-')&&id!=='m-eq')return midpointGiven(id,v,m);
    if(id==='m-eq')return `AM = (${expr(m.a,m.bb)}) cm, MB = (${expr(m.c,m.d)}) cm. M이 중점이 되는 조건을 풉니다.`;
    if(id==='ck1'||id==='ck2')return `${m.h}시 ${m.m}분의 시계. ${id==='ck2'&&v===0?'같은 1분 동안 두 바늘이 더 도는 각을 비교합니다.':'12 방향을 기준으로 시계 방향의 회전을 잽니다.'}`;
    if(id==='vt')return `현재 직선 ${m.drawN}개가 한 점에서 만나며, 첫 두 직선의 ∠a = ${m.th}°입니다.`;
    if(id==='ve')return `두 각은 (${expr(m.a1,m.b1)})°, (${expr(m.a2,m.b2)})°. 두 반직선이 한 직선을 이루어 맞꼭지각이 되는 조건을 풉니다.`;
    if(id==='th'){const c=m.cfg;return v?`세 직선이 한 점에서 만납니다. $a=(${expr(1,c.p)})°$, $b=${c.B}°$, $c′=(${expr(c.r,c.s)})°$입니다.`:`세 직선이 한 점에서 만납니다. ∠a = ${c.A}°, ∠b = ${c.B}°, 나머지 각은 ∠c입니다.`;}
    if(id==='pd')return `PH = ${m.d} cm, PH ⟂ ℓ; Q는 H에서 ${m.q===0?'같은 자리':`${Math.abs(m.q)} cm ${m.q>0?'오른쪽':'왼쪽'}`}에 있습니다.`;
    if(id==='bs')return `∠AOB = ${m.T}°, ∠AOC = ${m.g}°. OM과 ON은 각각 ∠AOC와 ∠COB의 이등분선입니다.`;
    const q=triangleFor(m,v);return v?`현재 문제: ∠C = 90°, AB = ${q.ab} cm, BC = ${q.b} cm, CA = ${q.h} cm. A와 직선 BC 사이의 거리를 구합니다.`:`현재 탐구: BC = ${q.b} cm, AH = ${q.h} cm. H는 ${q.sa<0||q.sa>q.b?'BC의 연장선':'변 BC'} 위에 있습니다.`;
  }

  function stepFrame(t,rows){
    const i=t<1.4?0:t<3.4?1:t<5.4?2:t<7.4?3:4;
    return {label:rows[i][0],formula:rows[i][1]||'',answer:i===4};
  }
  function frames(id,v,t,m){
    let rows;
    if(id==='b1-1'){
      const result=[m.b-m.a,m.a+m.b,2*m.b-m.a][v],operation=['b-a','a+b','2b-a'][v];
      const vertices=m.k===1?`${m.n}+1`:`${m.n}+${m.n}`,edges=m.k===1?`${m.n}+${m.n}`:`${m.n}+${m.n}+${m.n}`;
      rows=[['현재 입체에서 꼭짓점과 모서리를 따로 찾습니다.'],
        ['밑면의 점과 위쪽 점을 빠짐없이 셉니다.',`$a=${vertices}=${m.a}$`],
        ['모서리를 밑면·윗면·옆 모서리로 묶습니다.',`$b=${edges}=${m.b}$`],
        [v===1?'두 종류의 개수를 합칩니다.':v===2?'모서리 두 묶음에서 꼭짓점 수만큼 하나씩 지웁니다.':'모서리와 꼭짓점을 하나씩 짝지어 남은 것을 셉니다.',`$${operation}$`],
        ['그림에서 센 값을 구하는 식에 넣습니다.',`$${operation}=${v===0?`${m.b}-${m.a}`:v===1?`${m.a}+${m.b}`:`2×${m.b}-${m.a}`}=${result}$`]];
    }else if(id==='b1-2'){
      const noun=m.mode?'교점':'교선',answer=m.par?`${noun} 없음`:m.mode?'교점 1개':'교선은 한 직선';
      rows=[['현재 두 대상이 놓인 모양을 그대로 살펴봅니다.'],
        [m.par?'서로 대응하는 위치 사이의 간격을 표시합니다.':v===0?'두 대상이 함께 지나는 위치를 따라 표시합니다.':'기울어진 대상의 위쪽과 아래쪽을 확인합니다.'],
        [m.par?'다른 위치에서도 간격이 같은지 비교합니다.':m.mode?'평면을 지나가는 한 위치에 표시가 모입니다.':'서로 다른 공통 위치들을 따라 선을 긋습니다.'],
        [m.par?'그림 밖으로 계속 넓혀도 두 대상의 간격이 유지됩니다.':m.mode?'직선 위에서 평면의 높이와 같아지는 곳을 확인합니다.':'공통 위치들이 끊김 없이 곧게 이어집니다.'],
        [m.par?'평행하고 떨어져 있으므로 공통부분이 없습니다.':m.mode?'직선과 평면이 한 점에서 만나는 곳입니다.':'서로 다른 두 평면이 공유하는 한 직선입니다.',answer]];
    }else if(id==='b1-3'){
      const key=v===0?'a':'b',word=v===0?'교점':'교선';
      rows=v===2?[['현재 첫 번째 입체에서 점과 선을 구별합니다.'],
        ['꼭짓점을 밑면과 위쪽으로 나누어 셉니다.',`교점 ${m.A.a}개`],
        ['모서리를 밑면과 옆면의 무리로 셉니다.',`교선 ${m.A.b}개`],
        ['점의 개수와 선의 개수를 합해야 합니다.',`$${m.A.a}+${m.A.b}$`],
        ['두 종류를 따로 센 뒤 더합니다.',`$${m.A.a}+${m.A.b}=${m.A.a+m.A.b}$개`]]:
        [[`두 입체의 ${word}을 같은 기준으로 비교합니다.`],
        [`${m.an}의 ${word}을 셉니다.`,`${m.A[key]}개`],
        [`${m.bn}의 ${word}을 셉니다.`,`${m.B[key]}개`],
        ['겉모양보다 실제로 센 수를 비교합니다.',`$${m.A[key]} ? ${m.B[key]}$`],
        [`현재 두 입체의 ${word} 수는 ${m.A[key]===m.B[key]?'같습니다.':'다릅니다.'}`,`$${m.A[key]}${m.A[key]===m.B[key]?'=':'≠'}${m.B[key]}$`]];
    }else if(id==='l-ray'){
      rows=v===0?[['A와 B의 이름 순서를 바꾸어 봅니다.'],
        ['두 점을 지나는 직선을 양쪽으로 늘립니다.'],
        ['BA라고 불러도 지나는 점과 방향이 그대로입니다.'],
        ['선분도 양 끝점 A와 B가 그대로입니다.'],
        ['직선과 선분은 이름 순서를 바꾸어도 같습니다.','직선 AB = 직선 BA; 선분 AB = 선분 BA']]:
        v===1?[['반직선의 첫 글자가 시작점입니다.'],
        [`AB는 A에서 ${m.dir>0?'오른쪽':'왼쪽'}으로 뻗습니다.`],
        [`BA는 B에서 ${m.dir>0?'왼쪽':'오른쪽'}으로 뻗습니다.`],
        ['시작점 두 곳과 화살표의 방향을 나란히 비교합니다.'],
        ['시작점과 뻗는 방향이 달라 다른 반직선입니다.','반직선 AB ≠ 반직선 BA']]:
        [['두 반직선이 모두 지나는 곳을 찾습니다.'],
        ['A에서 B 쪽으로 뻗는 곳을 칠합니다.'],
        ['B에서 A 쪽으로 뻗는 곳을 다른 색으로 칠합니다.'],
        ['두 색이 함께 포함하는 구간은 두 점 사이입니다.'],
        ['공통부분은 선분 AB입니다.',`AB = ${cm(`${Math.max(m.A,m.B)}-${Math.min(m.A,m.B)}=${m.d}`)}`]];
    }else if(id==='l-types'){
      rows=[['그림의 A와 B가 실제 끝점인지 확인합니다.'],
        [v===0?'두 점 밖으로 양쪽 화살표가 계속 이어집니다.':v===1?'A에서 출발해 B 너머로 계속 이어집니다.':'그림의 두 끝 A와 B에서 선이 멈춥니다.'],
        [v===2?'두 끝 사이를 눈금으로 잴 수 있습니다.':'계속 뻗는 쪽에는 길이를 재는 마지막 점이 없습니다.'],
        [v===0?'직선 위의 A와 B는 끝이 아니라 지나는 점입니다.':v===1?'A만 끝점이고 B는 지나는 점입니다.':'끝점 A, B와 그 사이의 길이를 함께 확인합니다.'],
        [`${['직선','반직선','선분'][v]}의 성질을 정리합니다.`,v===0?'끝점 0개 · 전체 길이를 잴 수 없음':v===1?'끝점 1개 · 전체 길이를 잴 수 없음':`끝점 2개 · AB = ${cm(m.L)}`]];
    }else if(id==='l-same'){
      const rs=sameComparison(m,v);
      rows=[['반직선의 시작점과 방향을 따로 확인합니다.'],
        [`${rs[0].name}은 ${rs[0].name[0]}에서 ${rs[0].d>0?'오른쪽':'왼쪽'}으로 뻗습니다.`],
        [`${rs[1].name}은 ${rs[1].name[0]}에서 ${rs[1].d>0?'오른쪽':'왼쪽'}으로 뻗습니다.`],
        [v===0?'처음 글자와 화살표가 가리키는 쪽을 함께 겹쳐 봅니다.':v===1?'화살표가 같은 쪽을 향해도 출발하는 점을 비교해야 합니다.':'출발하는 점이 같아도 뻗는 쪽을 비교해야 합니다.'],
        [v===0?'시작점과 방향이 모두 같아 같은 반직선입니다.':v===1?'시작점이 달라 서로 다른 반직선입니다.':'방향이 반대여서 서로 다른 반직선입니다.',`반직선 ${rs[0].name} ${v===0?'=':'≠'} 반직선 ${rs[1].name}`]];
    }else if(id==='l-common'){
      rows=[['현재 선택한 두 반직선의 포함 범위를 찾습니다.'],
        [v===1?'검사점을 옮기며 첫 반직선에 포함되는지 봅니다.':v===2?'두 반직선의 시작점을 먼저 표시합니다.':`${m.n1}이 지나는 곳을 칠합니다.`],
        [v===1?'같은 검사점이 두 번째 반직선에도 포함되어야 합니다.':v===2?'시작점도 반직선에 포함된다는 조건을 확인합니다.':`${m.n2}가 지나는 곳을 칠합니다.`],
        ['두 조건을 동시에 만족하는 곳만 남깁니다.'],
        [commonDescription(m),m.sh.kind==='seg'?`${LETTERS[m.sh.a]}${LETTERS[m.sh.c]} = ${cm(num(m.xs[m.sh.c]-m.xs[m.sh.a]))}`:commonDescription(m)]];
    }else if(id==='l-short'){
      rows=v===0?[['두 점을 잇는 곧은 길과 돌아가는 길을 비교합니다.'],
        ['같은 A와 B를 잇는지 먼저 확인합니다.'],
        ['돌아가는 길의 두 조각을 길이 변화 없이 펴 봅니다.'],
        ['편 길이와 선분 AB를 같은 출발점에 놓고 비교합니다.'],
        ['두 점 사이의 거리는 가장 짧은 선분 AB의 길이입니다.',`AB = ${cm(m.d)}`]]:
        [['두 점의 눈금은 위치를 나타냅니다.'],
        ['왼쪽 점의 눈금을 출발점으로 잡습니다.',`${m.A} cm`],
        ['오른쪽 눈금까지의 눈금 간격을 따라갑니다.',`${m.B} cm`],
        ['오른쪽 위치에서 왼쪽 위치를 빼면 그 사이 길이가 됩니다.',`$${m.B}-${m.A}$`],
        ['위치 두 개의 차이로 거리를 구합니다.',cm(`${m.B}-${m.A}=${m.d}`)]];
    }else if(id==='l-col'||id==='l-gen'){
      const n=id==='l-col'?m.n:m.m,segments=C2(n),rays=id==='l-col'?2*(n-1):n*(n-1);
      const rayRule=id==='l-col'?`1+2×${n-2}+1`:`${n}×${n-1}`;
      rows=v===0?[['선분을 정하는 두 끝점을 한 쌍씩 고릅니다.'],
        ['앞쪽 점에서 뒤쪽 점만 골라 같은 쌍을 두 번 세지 않습니다.'],
        [`기준점을 바꾸면 새로 생기는 쌍이 ${n-1}, ${n-2}, …, 1개입니다.`],
        ['AB와 BA는 같은 선분이므로 이름 순서의 중복을 나눕니다.',`$${n}×${n-1}÷2$`],
        [id==='l-col'?'선분의 개수는 끝점 쌍의 개수입니다.':'세 점이 한 직선에 없으므로 직선도 각 쌍마다 하나입니다.',`${id==='l-gen'?'직선·선분 각각 ':''}$${n}×${n-1}÷2=${segments}$개`]]:
        v===1?[['반직선은 시작점과 뻗는 방향으로 구별합니다.'],
        [id==='l-col'?'끝점에서는 다른 점들을 향하는 방향이 하나뿐입니다.':'한 시작점에서 나머지 점들이 모두 다른 방향입니다.'],
        [id==='l-col'?'안쪽 점에서는 왼쪽과 오른쪽 두 방향이 생깁니다.':`시작점을 바꾸어 각 점에서 ${n-1}방향씩 확인합니다.`],
        ['시작점이 다른 두 반직선은 같은 것으로 묶지 않습니다.',`$${rayRule}$`],
        ['서로 다른 시작점과 방향의 수를 합칩니다.',`$${rayRule}=${rays}$개`]]:
        [['선분과 반직선을 각각 세어 합합니다.'],
        ['선분은 끝점 순서가 바뀐 중복을 나눕니다.',`$${n}×${n-1}÷2=${segments}$개`],
        [id==='l-col'?'반직선은 끝점에서 하나, 안쪽에서 두 방향씩 셉니다.':'반직선은 시작점마다 다른 점을 향하는 방향을 셉니다.',`$${rayRule}=${rays}$개`],
        ['물어본 선분과 반직선 두 종류만 더합니다.',`$${segments}+${rays}$`],
        ['각 종류를 센 결과를 합합니다.',`$${segments}+${rays}=${segments+rays}$개`]];
    }else if(id==='l-mix'){
      const n=m.n,k=m.k;
      rows=v===0?[['먼저 두 점의 쌍을 모두 생각합니다.'],
        ['전체 쌍마다 직선을 그으면 같은 직선을 여러 번 세기도 합니다.',`$${n}×${n-1}÷2=${C2(n)}$쌍`],
        [`한 직선 위 ${k}개의 점끼리 고른 쌍은 모두 한 직선에 놓입니다.`,`$${k}×${k-1}÷2=${C2(k)}$쌍`],
        ['겹친 이름들을 모두 빼고 실제 직선 하나를 다시 넣습니다.',`$${C2(n)}-${C2(k)}+1$`],
        ['같은 직선의 중복을 제거한 개수입니다.',`$${C2(n)}-${C2(k)}+1=${m.line}$개`]]:
        v===1?[['시작점과 방향이 같은 반직선을 묶습니다.'],
        ['우선 서로 다른 두 점에 순서를 붙여 셉니다.',`$${n}×${n-1}$`],
        [`일직선 위 ${k}개 점끼리는 같은 방향 이름들이 겹칩니다.`,`$${k}×${k-1}$개 이름`],
        [`그 이름들을 지우고, 끝점 하나씩·안쪽 두 방향씩을 넣습니다.`,`$${n*(n-1)}-${k*(k-1)}+2×${k-1}$`],
        ['시작점과 방향이 다른 것만 남긴 개수입니다.',`$${n*(n-1)}-${k*(k-1)}+${2*(k-1)}=${m.ray}$개`]]:
        [['선분은 양 끝점이 정해지면 하나로 정해집니다.'],
        ['같은 직선 위에서도 서로 다른 끝점 쌍을 골라 봅니다.'],
        ['부분적으로 겹쳐도 끝점이 다르면 다른 선분입니다.'],
        ['AB와 BA처럼 순서만 바뀐 중복만 나눕니다.',`$${n}×${n-1}÷2$`],
        ['일직선 위에 놓였다는 이유로 선분 수를 빼지 않습니다.',`$${n}×${n-1}÷2=${m.seg}$개`]];
    }else if(id==='m-mid'){
      rows=[['M과 N이 각각 어느 선분의 중점인지 표시합니다.'],
        ['AM과 MC는 ○, CN과 NB는 △로 같은 길이입니다.'],
        ['MN의 ○와 △에 대응하는 AM과 NB를 나란히 옮깁니다.'],
        ['전체 AB는 ○+△ 묶음 두 개입니다.',v===0?`$2MN=AB=${m.L}$`:`$AB=2MN$`],
        [v===0?'중점 사이 거리는 전체 길이의 절반입니다.':'전체 길이는 중점 사이 거리의 두 배입니다.',v===0?`MN = ${cm(`${m.L}÷2=${num(m.mn)}`)}`:`AB = ${cm(`2×${num(m.mn)}=${m.L}`)}`]];
    }else if(id==='m-dbl'){
      rows=v===0?[['M은 AB의 중점, N은 MB의 중점입니다.'],
        ['전체를 절반으로 나눕니다.',`$AM=MB=${m.L}÷2=${m.AM}$`],
        ['MB를 다시 절반으로 나누면 같은 한 칸을 얻습니다.',`$MN=NB=${m.AM}÷2=${m.q}$`],
        ['AN은 두 칸 AM과 한 칸 MN을 합친 세 칸입니다.',`$AN=AM+MN$`],
        ['같은 네 칸 중 세 칸의 길이를 구합니다.',`AN = ${cm(`${m.AM}+${m.q}=${m.AN}`)}`]]:
        v===1?[['주어진 MN이 가장 작은 한 칸입니다.'],
        ['N이 MB의 중점이므로 NB도 같은 길이입니다.'],
        ['MN 두 칸으로 MB를 만들고, 같은 AM을 복사합니다.',`$MB=AM=2×${m.q}=${m.AM}$`],
        ['AB에는 한 칸이 네 번 들어갑니다.'],
        ['작은 한 칸의 네 배가 전체입니다.',`AB = ${cm(`4×${m.q}=${m.L}`)}`]]:
        [['주어진 AN이 전체 중 몇 칸인지 찾습니다.'],
        ['MN과 NB를 한 칸으로 놓으면 AM은 두 칸입니다.'],
        ['AN은 세 칸이므로 한 칸은 AN의 3분의 1입니다.',`$${m.AN}÷3=${m.q}$`],
        ['그 한 칸 네 개로 AB를 채웁니다.'],
        ['세 칸에서 한 칸을 구한 뒤 전체 네 칸을 구합니다.',`AB = ${cm(`${m.q}×4=${m.L}`)}`]];
    }else if(id==='m-tri'){
      rows=v===1?[['P, Q는 삼등분점이고 M은 중점입니다.'],
        ['2등분과 3등분을 함께 나타내는 여섯 칸을 만듭니다.'],
        ['P는 두 칸째, M은 세 칸째라 PM은 한 칸입니다.',`$PM=${m.PM}$`],
        ['같은 한 칸을 여섯 번 옆으로 옮겨 전체를 채웁니다.'],
        ['AB는 PM의 여섯 배입니다.',`AB = ${cm(`${m.PM}×6=${m.L}`)}`]]:
        [['삼등분점과 중점을 같은 눈금 위에서 비교합니다.'],
        ['전체를 같은 길이의 여섯 칸으로 나눕니다.'],
        [v===0?'A에서 P까지 두 칸, M까지 세 칸을 잽니다.':'A에서 M까지 세 칸, Q까지 네 칸을 잽니다.',v===0?`$AP=${m.L}÷3=${m.AP}, AM=${m.L}÷2=${m.L/2}$`:`$AQ=${m.L}÷3×2=${2*m.L/3}, AM=${m.L}÷2=${m.L/2}$`],
        ['같은 시작점에서 잰 두 길이의 겹친 부분을 뺍니다.'],
        [v===0?'PM은 AM에서 AP를 뺀 한 칸입니다.':'MQ는 AQ에서 AM을 뺀 한 칸입니다.',`${v===0?'PM':'MQ'} = ${cm(v===0?`${m.L/2}-${m.AP}=${m.PM}`:`${2*m.L/3}-${m.L/2}=${m.q}`)}`]];
    }else if(id==='m-ratio'){
      rows=v===0?[['짧은 CB를 한 칸으로 놓습니다.'],
        [`AC는 ${m.k}칸이므로 전체는 ${m.n}칸입니다.`],
        ['한 칸의 길이를 구하고 AC를 절반으로 나눕니다.',`$CB=${m.AB}÷${m.n}=${m.u}, MC=${m.AC}÷2=${m.mc}$`],
        ['MB는 MC에 마지막 한 칸 CB를 더한 구간입니다.'],
        ['중점에서 B까지 남은 칸을 합합니다.',`MB = ${cm(`${m.mc}+${m.u}=${m.MB}`)}`]]:
        [['주어진 MC와 중점 조건에서 시작합니다.'],
        ['AC는 같은 MC 두 조각입니다.',`$AC=2×${m.mc}=${m.AC}$`],
        [`AC를 ${m.k}칸으로 나누어 CB 한 칸을 구합니다.`,`$CB=${m.AC}÷${m.k}=${m.u}$`],
        ['AC와 마지막 CB를 이어 전체를 만듭니다.'],
        ['중점 조건을 먼저, 길이의 비를 다음에 사용합니다.',`AB = ${cm(`${m.AC}+${m.u}=${m.AB}`)}`]];
    }else if(id==='m-eq'){
      const a=expr(m.a,m.bb),z=expr(m.c,m.d),coef=m.a-m.c,rhs=m.d-m.bb;
      rows=[['현재 시험값의 두 길이를 보고, M이 중점이 되는 조건을 찾습니다.'],
        ['중점이면 두 선분의 길이가 같아야 합니다.',`$${a}=${z}$`],
        ['양변에서 같은 x항과 상수항을 빼서 정리합니다.',`$(${coef})x=${rhs}$`],
        v===0?['같은 두 길이가 되는 x를 찾고 그림을 포갭니다.',`$x=${rhs}÷(${coef})$`]:['x를 구한 뒤 한 조각의 길이에 대입합니다.',`$x=${num(m.x0)}, AM=${num(m.AM0)}$`],
        v===0?['두 식에 넣으면 AM과 MB가 같아집니다.',`$x=${num(m.x0)}$`]:['전체 AB는 같은 두 조각의 합입니다.',`AB = ${cm(`2×${num(m.AM0)}=${num(m.AB0)}`)}`]];
    }else if(id==='ck1'){
      rows=v===0?[[`${m.h}시 ${m.m}분에도 시침은 계속 움직입니다.`],
        ['시침은 12시간에 한 바퀴, 한 시간에 30° 돕니다.',`$360°÷12=30°$`],
        [`${m.hh}시간의 회전 뒤 ${m.m}분의 회전을 더합니다.`,`$30×${m.hh}+0.5×${m.m}$`],
        ['분 동안 조금 움직인 시침의 위치까지 호를 이어 갑니다.'],
        ['시침이 12 방향에서 돌아간 각입니다.',`$30×${m.hh}+0.5×${m.m}=${num(m.th)}°$`]]:
        v===1?[['분침의 현재 위치를 12 방향과 비교합니다.'],
        ['분침은 60분에 한 바퀴 돕니다.',`$360°÷60=6°$`],
        [`${m.m}분 동안 6°씩 회전한 호를 따라갑니다.`,`$6×${m.m}$`],
        ['시계 숫자 간격은 5분이고 작은 눈금 간격은 1분입니다.'],
        ['분침이 12 방향에서 돌아간 각입니다.',`$6×${m.m}=${num(m.tm)}°$`]]:
        [['두 바늘의 위치를 같은 12 방향에서 잽니다.'],
        ['시침의 정각 회전과 분 동안의 작은 회전을 합칩니다.',`$30×${m.hh}+0.5×${m.m}=${num(m.th)}°$`],
        ['분침의 회전을 같은 기준에서 잽니다.',`$6×${m.m}=${num(m.tm)}°$`],
        ['두 회전의 차를 구하고 180° 이하인 쪽을 고릅니다.',`$|${num(m.tm)}-${num(m.th)}|=${num(m.raw)}°$`],
        ['두 바늘 사이의 작은 각입니다.',m.raw>180?`$360-${num(m.raw)}=${num(m.gap)}°$`:`$${num(m.gap)}°$`]];
    }else if(id==='ck2'){
      rows=v===0?[['현재 시각에서 같은 1분을 더 진행하는 모습을 비교합니다.'],
        ['분침은 1분에 6°만큼 더 회전합니다.',`$360°÷60=6°$`],
        ['시침은 1분에 0.5°만큼 더 회전합니다.',`$30°÷60=0.5°$`],
        ['같은 눈금으로 표시한 회전에서 시침의 증가분을 뺍니다.'],
        ['분침은 1분마다 시침보다 이만큼 더 회전합니다.',`$6-0.5=5.5°$`]]:
        [['정각의 시침과 현재 두 바늘을 함께 봅니다.'],
        ['정각의 시침은 분침보다 이만큼 앞에 있습니다.',`$30×${m.hh}=${30*m.hh}°$`],
        ['분침은 매분 5.5°씩 더 돌아갑니다.',`$(6-0.5)×${m.m}=${num(5.5*m.m)}°$`],
        ['처음 차이에서 더 회전한 각을 빼고 크기를 비교합니다.',`$|${30*m.hh}-${num(5.5*m.m)}|=${num(m.raw)}°$`],
        ['따라잡거나 지나친 뒤에도 작은 사잇각을 고릅니다.',m.raw>180?`$360-${num(m.raw)}=${num(m.gap)}°$`:`$${num(m.gap)}°$`]];
    }else if(id==='vt'){
      rows=v===0?[['처음 두 직선이 만드는 마주 보는 각을 찾습니다.'],
        ['a와 이웃한 b를 합하면 평각입니다.',`$a+b=180°$`],
        ['a의 색칠한 부분을 반 바퀴 돌려 맞은편에 겹칩니다.'],
        ['c도 같은 b와 합쳐 평각을 만듭니다.',`$c+b=180°$`],
        ['같은 180°에서 같은 b를 빼므로 맞꼭지각은 같습니다.',`$c=a=${m.th}°$`]]:
        v===1?[['주어진 a와 이웃한 각을 찾습니다.'],
        ['한쪽 반평면의 두 각이 일직선을 채웁니다.',`$a+b=180°$`],
        ['반대쪽에서도 같은 크기의 평각을 채웁니다.'],
        ['평각에서 주어진 각을 빼면 이웃한 각이 남습니다.',`$180°-${m.th}°$`],
        ['이웃한 각은 주어진 각의 보각입니다.',`$180-${m.th}=${180-m.th}°$`]]:
        [[`현재 ${m.drawN}개 직선 중 두 직선씩 골라 봅니다.`],
        ['고른 두 직선에서는 마주 보는 각이 두 쌍 생깁니다.'],
        ['다른 두 직선을 고르면서 모든 조합을 살펴봅니다.'],
        ['직선 두 개를 고르는 경우마다 두 쌍씩 셉니다.',`$${m.drawN}×${m.drawN-1}÷2×2$`],
        ['서로 다른 두 직선이 정하는 모든 쌍을 합합니다.',`$${m.drawN}×${m.drawN-1}=${m.drawN*(m.drawN-1)}$쌍`]];
    }else if(id==='ve'){
      const a=expr(m.a1,m.b1),z=expr(m.a2,m.b2),coef=m.a1-m.a2,rhs=m.b2-m.b1;
      rows=[['현재 시험값에서 두 각이 같은지 비교합니다.'],
        ['맞꼭지각이 되려면 두 크기가 같아야 합니다.',`$${a}=${z}$`],
        ['양변에 같은 연산을 하여 x항만 남깁니다.',`$(${coef})x=${rhs}$`],
        v===0?['한 직선을 이루는 위치에 두 반직선이 맞춰집니다.',`$x=${rhs}÷(${coef})$`]:['구한 x를 원래 각의 식에 넣습니다.',`$x=${num(m.solution)}, ${m.a1}×${num(m.solution)}+(${m.b1})$`],
        v===0?['두 각의 식이 같은 값을 갖는 x입니다.',`$x=${num(m.solution)}$`]:['x 자체가 아니라 대입해서 구한 각의 크기입니다.',`$${num(m.value)}°$`]];
    }else if(id==='th'){
      const c=m.cfg,k=1+c.r,constant=c.p+c.B+c.s,rhs=180-constant;
      rows=v===0?[['한쪽 반평면에 놓인 세 각을 찾습니다.'],
        ['a에서 b를 지나 c까지 차례로 색을 이어 갑니다.'],
        ['처음 방향과 마지막 방향이 한 직선의 반대쪽입니다.'],
        ['세 각이 채운 회전은 반 바퀴입니다.'],
        ['한 직선 위의 세 각의 합은 평각입니다.','$a+b+c=180°$']]:
        [['현재 seed가 정한 각의 식과 세 직선을 그대로 사용합니다.'],
        ['반대편에 주어진 각을 반 바퀴 돌려 c와 겹칩니다.',`$c=(${expr(c.r,c.s)})°$`],
        ['한쪽의 세 각을 더해 평각의 식을 세웁니다.',`$(${expr(1,c.p)})+${c.B}+(${expr(c.r,c.s)})=180$`],
        ['x항과 상수를 모은 뒤 같은 수로 나눕니다.',`$${k}x=${rhs}$`],
        ['구한 값을 넣으면 세 각이 정확히 평각을 채웁니다.',`$x=${rhs}÷${k}=${num(c.xs)}$`]];
    }else if(id==='pd'){
      rows=[['P, H, Q와 직각 표시를 먼저 확인합니다.'],
        ['P에서 직선에 수직인 PH를 따라갑니다.'],
        [v===0?'직각으로 만나는 위치 H를 표시합니다.':'PQ의 길이를 바꾸지 않고 P 둘레로 돌려 PH와 나란히 놓습니다.'],
        [v===0?'수선이 직선과 만나는 점의 이름을 붙입니다.':m.q===0?'Q가 H와 같으므로 두 선분이 포개집니다.':'비스듬한 길이는 PH 끝을 지나 더 남습니다.'],
        [v===0?'수선과 원래 직선이 만나는 점이 수선의 발입니다.':v===1?'직선 위의 점까지 가장 짧은 선분은 수선입니다.':'점과 직선 사이의 거리는 수선의 길이입니다.',v===0?'수선의 발 H':v===1?m.q===0?'PQ = PH · 가장 짧은 선분 PH':'PQ > PH · 가장 짧은 선분 PH':`거리 = PH = ${cm(m.d)}`]];
    }else if(id==='bs'){
      rows=[[`현재 전체 각은 ${m.T}°입니다. 두 이등분선을 확인합니다.`],
        ['AOC의 두 절반을 돌려 포개면 같은 크기입니다.',`$∠MOC=${m.g}÷2=${num(m.g/2)}°$`],
        ['COB의 두 절반도 서로 포개집니다.',`$∠CON=(${m.T}-${m.g})÷2=${num((m.T-m.g)/2)}°$`],
        [v===0?'안쪽 두 절반을 합친 각 MON을 표시합니다.':'전체 각은 안쪽 두 절반의 합이 두 번 들어간 크기입니다.',`$2(∠MOC+∠CON)=${m.T}°$`],
        [m.T===180?'전체가 평각이므로 두 이등분선은 수직입니다.':'전체가 평각이 아니어도 그 절반이라는 관계가 성립합니다.',`$∠MON=${m.T}÷2=${num(m.T/2)}°$`]];
    }else{
      const q=triangleFor(m,v),outside=q.sa<0||q.sa>q.b;
      rows=[['점 A에서 직선 BC에 수직인 길을 찾습니다.'],
        [outside?'변의 끝에서 멈추지 말고 BC를 늘인 직선을 봅니다.':q.sa===q.b?'AC와 BC가 직각으로 만나는 점 C를 봅니다.':'A의 바로 아래에 수선의 발 H를 표시합니다.'],
        ['수선과 직선이 만나는 직각 표시를 확인합니다.'],
        [v===1?'빗변 AB는 비스듬한 길이므로 수선 AC와 구별합니다.':'A가 가로로 옮겨져도 거리는 수선의 길이로 잽니다.'],
        ['점과 직선 사이의 거리는 수선의 발까지의 길이입니다.',`거리 = ${q.sa===q.b?'AC':'AH'} = ${cm(q.h)}`]];
    }
    return stepFrame(t,rows);
  }

  function draw(id,v,b,t,m){
    if(id==='b1-1'||id==='b1-3')return drawSolids(b,t,m,id,v);
    if(id==='b1-2')return drawPlanes(b,t,m,v);
    if(['l-col','l-gen','l-mix'].includes(id))return drawCounting(b,t,m,id,v);
    if(id.startsWith('l-'))return drawLinear(b,t,m,id,v);
    if(id==='m-eq')return drawLengthEquation(b,t,m,v);
    if(id.startsWith('m-'))return drawMidpoints(b,t,m,id,v);
    if(id==='ck1'||id==='ck2')return drawClock(b,t,m,id,v);
    if(id==='vt')return drawVertical(b,t,m,v);
    if(id==='ve')return drawAngleEquation(b,t,m,v);
    if(id==='th')return drawThreeLines(b,t,m,v);
    if(id==='pd')return drawPerpendicular(b,t,m,v);
    if(id==='bs')return drawBisectors(b,t,m,v);
    return drawTriangleDistance(b,t,m,v);
  }
  const registry={},lessonInfo={};
  for(const [id,labels] of Object.entries(definitions)){
    const key=`g7-points-lines/${id}`;
    lessonInfo[key]=labels.map(legacyLabel=>({legacyLabel,duration:9.6}));
    registry[key]=(lab,state)=>{
      const model=bind(id,lab,state);if(!model)return [];
      return labels.map((legacyLabel,v)=>{
        const label = id === 'b1-2' ? ['공통부분 따라가기', '한 곳에서 비교하기', '평행 여부'][v]
          : id === 'l-common' ? ['두 색 겹치기', '검사점 이동', '시작점 비교'][v]
          : id === 'bs' && v === 0 && model.T !== 180 ? '현재 각 이등분'
          : id === 'bs' && v === 1 ? '전체 각의 절반' : legacyLabel;
        return {id:`${id}-short-${v+1}`,label,legacyLabel,title:`${lab.scene.title} · ${label}`,duration:9.6,stops:[1.4,3.4,5.4,7.4],model,given:givenFor(id,v,model),draw:(b,t,m)=>draw(id,v,b,t,m),frame:(t,m)=>frames(id,v,t,m)};
      });
    };
  }
  return {registry,lessonInfo,bind,clock,rayIntersection,pairs,orderedPairs,sameComparison,countGeometry,countPairs,midLayout,midpointPieces,unfoldPath,swingToPerpendicular,bisectorAngles,triangleFor,planeGeometry,project,solidVisibility};
});
