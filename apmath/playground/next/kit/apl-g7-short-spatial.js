/* Spatial proofs use the current native 3-D objects, not the legacy lesson
 * timeline. Hinges, plane pencils, line extensions and counterexamples have
 * separate proof states. Student controls, selected questions and seeds remain
 * unchanged. A projected crossing is never treated as a 3-D intersection. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root?.APLab) {
    root.APLab.G7ShortSpatial = api;
    Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
    Object.assign(root.APLab.G7ShortInfo = root.APLab.G7ShortInfo || {}, api.lessonInfo);
  }
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  const EPS = 1e-9, DEG = Math.PI / 180, NUM = ['①', '②', '③', '④', '⑤'];
  const V = (x, y, z = 0) => ({ x, y, z }), O = V(0, 0), X = V(1, 0), Y = V(0, 1), Z = V(0, 0, 1);
  const add = (a, b) => V(a.x + b.x, a.y + b.y, a.z + b.z);
  const sub = (a, b) => V(a.x - b.x, a.y - b.y, a.z - b.z);
  const mul = (a, k) => V(a.x * k, a.y * k, a.z * k);
  const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const cross = (a, b) => V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  const len = a => Math.hypot(a.x, a.y, a.z);
  const unit = a => mul(a, 1 / (len(a) || 1));
  const mix = (a, b, u) => add(a, mul(sub(b, a), u));
  const center = ps => mul(ps.reduce(add, O), 1 / ps.length);
  const clamp = x => Math.max(0, Math.min(1, x));
  const phase = (t, a, b) => { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); };
  const copy = s => JSON.parse(JSON.stringify(s));
  const F = (label, formula = '') => ({ label, formula });
  const format = n => String(Math.round(n * 1e4) / 1e4);
  const choose = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - i + 1) / i; return Math.round(r); };
  const REL = { same: '일치', ref: '같은 모서리', parallel: '평행', par: '평행', meet: '만남', ext: '늘이면 만남', skew: '꼬인 위치' };
  const COLORS = ['sky', 'rose', 'amber', 'green', 'violet'];
  const edgePoints = (sol, e) => [sol.verts[e.u], sol.verts[e.v]];
  const facePoints = (sol, i) => sol.faces[i].v.map(k => sol.verts[k]);

  // Infinite-line relations. The scalar triple product tests coplanarity;
  // endpoint coincidence alone does not distinguish extension intersections.
  function lineRelation(a, b, c, d) {
    const u = sub(b, a), v = sub(d, c), w = sub(c, a), n = cross(u, v);
    if (len(n) <= EPS * len(u) * len(v)) return len(cross(w, u)) <= EPS * len(u) * Math.max(1, len(w)) ? 'same' : 'parallel';
    return Math.abs(dot(w, n)) <= EPS * len(n) * Math.max(1, len(w)) ? 'meet' : 'skew';
  }
  function lineIntersection(a, b, c, d) {
    if (lineRelation(a, b, c, d) !== 'meet') return null;
    const u = sub(b, a), v = sub(d, c), n = cross(u, v);
    return add(a, mul(u, dot(cross(sub(c, a), v), n) / dot(n, n)));
  }
  function classifyEdges(sol, ref) {
    const groups = { meet: [], ext: [], parallel: [], skew: [], same: [] }, [a, b] = edgePoints(sol, ref);
    for (const e of sol.edges) {
      if (e.key === ref.key) continue;
      const relation = lineRelation(a, b, ...edgePoints(sol, e));
      const shared = e.u === ref.u || e.u === ref.v || e.v === ref.u || e.v === ref.v;
      groups[relation === 'meet' && !shared ? 'ext' : relation].push(e);
    }
    return groups;
  }
  function planeThrough(a, b, c) {
    const n = cross(sub(b, a), sub(c, a));
    if (len(n) < EPS) return null;
    const normal = unit(n); return { n: normal, d: dot(normal, a), p: a };
  }
  const planeDistance = (plane, p) => dot(plane.n, p) - plane.d;
  function orderedPlane(points, normal) {
    const c = center(points), u = unit(sub(points[0], c)), v = unit(cross(normal, u));
    return points.slice().sort((a, b) => Math.atan2(dot(sub(a, c), v), dot(sub(a, c), u)) - Math.atan2(dot(sub(b, c), v), dot(sub(b, c), u)));
  }
  function spanningPanel(points) {
    let plane = null;
    for (let i = 1; i < points.length - 1 && !plane; i++) for (let j = i + 1; j < points.length && !plane; j++) plane = planeThrough(points[0], points[i], points[j]);
    if (!plane) return null;
    const c = center(points), u = unit(sub(points.find(p => len(sub(p, c)) > EPS), c)), v = unit(cross(plane.n, u));
    const uv = points.map(p => [dot(sub(p, c), u), dot(sub(p, c), v)]);
    const x0 = Math.min(...uv.map(p => p[0])) - .15, x1 = Math.max(...uv.map(p => p[0])) + .15;
    const y0 = Math.min(...uv.map(p => p[1])) - .15, y1 = Math.max(...uv.map(p => p[1])) + .15;
    return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => add(c, add(mul(u, x), mul(v, y))));
  }
  function planeGroups(sol) {
    const groups = [], names = sol.order;
    for (let i = 0; i < names.length - 2; i++) for (let j = i + 1; j < names.length - 1; j++) for (let k = j + 1; k < names.length; k++) {
      const triple = [names[i], names[j], names[k]], plane = planeThrough(...triple.map(n => sol.verts[n]));
      if (!plane) continue;
      let group = groups.find(g => len(cross(g.n, plane.n)) < 1e-8 && Math.abs(planeDistance(g, plane.p)) < 1e-8);
      if (!group) { group = { ...plane, triples: [], members: names.filter(n => Math.abs(planeDistance(plane, sol.verts[n])) < 1e-8) }; groups.push(group); }
      group.triples.push(triple);
    }
    return groups;
  }
  const pairs = n => Array.from({ length: n }, (_, i) => Array.from({ length: n - i - 1 }, (_, j) => [i, j + i + 1])).flat();
  function solidFaceRelations(sol, fi) {
    const n = sol.faces[fi].n;
    return {
      edges: sol.edges.filter(e => len(cross(unit(sub(...edgePoints(sol, e).slice().reverse())), n)) < 1e-8),
      perpendicular: sol.faces.map((_, i) => i).filter(i => i !== fi && Math.abs(dot(sol.faces[i].n, n)) < 1e-8),
      parallelPairs: pairs(sol.faces.length).filter(([i, j]) => len(cross(sol.faces[i].n, sol.faces[j].n)) < 1e-8)
    };
  }

  function drawing(b, d, points, t = 0, camera = {}) {
    b.kind = 'figure'; b.aspect = '1:1'; b.setPanes(null); b.setInsets({ top: 38, right: 20, bottom: 70, left: 20 });
    b.zoom = 1; b.panX = 0; b.panY = 0;
    const s = { ...d.s, ...camera }, D = d.G.scene3(b, s, { txt: true, thumb: false, lesson: true, problem: false, review: false });
    if (points?.length) D.fitPts(points, { t: 30, b: 36, l: 32, r: 32 });
    return D;
  }
  const name = (D, p, text, color = 'ink') => D.label(p, text, { color, size: 15, dir: D.out(p, O), gap: 10, leader: true });
  const line = (D, a, b, color = 'amber', width = 4, options = {}) => D.line(a, b, color, width, options);
  const trace = (D, a, b, u, color = 'amber', width = 4, options = {}) => { if (u > 0) line(D, a, mix(a, b, u), color, width, options); };
  function solid(D, d, sol, style) {
    const result = d.G.drawSolid(D, sol, style || (() => ({ color: 'ink', width: 2.4 })), { faceAlpha: .045, over: () => true });
    return result;
  }
  function highlightFace(D, sol, i, color, alpha = .14) {
    const points = facePoints(sol, i);
    if (D.facing(sol.faces[i].n)) D.fill(points, color, alpha);
    D.path(points, color, 3.5, { close: true, dash: D.facing(sol.faces[i].n) ? undefined : [5, 4] });
  }
  function extentData(sol, ref, groups) {
    const [a, b] = edgePoints(sol, ref), radius = sol.R || 2;
    return groups.ext.map(e => {
      const [c, z] = edgePoints(sol, e), intersection = lineIntersection(a, b, c, z);
      const rays = [[a, b], [c, z]].map(([p, q]) => { const from = len(sub(p, intersection)) < len(sub(q, intersection)) ? p : q; const distance = len(sub(from, intersection)); return { from, to: mix(from, intersection, Math.min(1, radius * .75 / distance)), capped: distance > radius * .75 }; });
      return { e, intersection, rays, capped: rays.some(r => r.capped) };
    });
  }
  function edgeCountDraw(b, t, d) {
    const { sol, ref, groups, extensions } = d, points = sol.order.map(k => sol.verts[k]);
    const D = drawing(b, d, points.concat(extensions.flatMap(e => e.rays.map(r => r.to))), t);
    const groupOf = new Map(Object.entries(groups).flatMap(([key, es]) => es.map(e => [e.key, key])));
    const style = e => {
      if (e.key === ref.key) return { color: 'amber', width: 5 };
      const kind = groupOf.get(e.key);
      if ((kind === 'meet' || kind === 'ext') && t >= 1) return { color: t < 4.5 ? 'rose' : 'muted', width: t < 4.5 ? 3.8 : 1.8, alpha: t < 4.5 ? 1 : .3 };
      if (kind === 'parallel' && t >= 4.5) return { color: t < 6.4 ? 'sky' : 'muted', width: t < 6.4 ? 4 : 1.8, alpha: t < 6.4 ? 1 : .35 };
      if (t >= 6.4 && (d.coplanar ? kind !== 'skew' : kind === 'skew')) return { color: 'green', width: 4.8 };
      return { color: 'ink', width: 2.5 };
    };
    solid(D, d, sol, style);
    if (t >= 1) groups.meet.forEach(e => { const shared = [e.u, e.v].find(k => k === ref.u || k === ref.v); D.dot(sol.verts[shared], 'rose', 5.5); });
    if (t >= 2.4 && t < 6.4) extensions.forEach(ex => {
      ex.rays.forEach(r => trace(D, r.from, r.to, phase(t, 2.4, 4.3), 'violet', 2.4, { dash: [5, 4] }));
      if (!ex.capped && t >= 4.3) D.dot(ex.intersection, 'violet', 5);
    });
    if (t >= 4.5 && t < 6.4) [ref, ...groups.parallel].forEach(e => D.par(...edgePoints(sol, e), 1, 'sky'));
    if (t >= 6.4) {
      const chosen = d.coplanar ? groups.meet.concat(groups.ext, groups.parallel) : groups.skew;
      chosen.forEach((e, i) => { if (t >= 6.4 + i * .07) name(D, center(edgePoints(sol, e)), e.name, 'green'); });
    }
    d.G.drawVerts(D, sol, { names: t < 6.4, hot: k => k === ref.u || k === ref.v }); D.flush();
  }
  function edgeCountFrame(t, d) {
    const { groups: g, sol, ref } = d, meet = g.meet.length + g.ext.length;
    return t < 1 ? F(`기준 ${ref.name} 자신은 세지 않습니다.`) : t < 2.4 ? F('끝점을 공유하여 만나는 모서리를 먼저 표시합니다.') : t < 4.5 ? F(g.ext.length ? '같은 평면의 모서리는 끝없이 늘이면 만날 수 있습니다. 이 경우도 만남에 포함합니다.' : '끝점에서 만나는 경우를 빠짐없이 확인합니다.') : t < 6.4 ? F('방향이 같은 모서리에 평행 표시를 붙입니다.') : t < 7.8 ? F(d.coplanar ? '기준과 만나거나 평행한 모서리는 각각 기준과 한 평면 위에 놓입니다.' : '만나는 것과 평행한 것을 지우면 꼬인 위치만 남습니다.') : F(d.coplanar ? '각 모서리와 기준을 포함하는 평면은 서로 달라도 됩니다.' : '전체를 겹치지 않는 관계로 나누어 검산합니다.', d.coplanar ? `$${meet}+${g.parallel.length}=${d.answer}\\text{개}$` : `$${sol.edges.length}-1-${meet}-${g.parallel.length}=${d.answer}\\text{개}$`);
  }

  const recipes = {};
  function addPlan(scene, legacyLabel, factory, duration = 9.8) { (recipes[scene] ||= []).push({ legacyLabel, factory, duration }); }
  function make(d, title, given, motion, draw, frame, extra = {}) {
    return { title, label: title, given, motion, model: d, draw, frame, stops: [1, 2.5, 4.5, 6.4, 7.8], ...extra };
  }
  function modelAt(d, updates = {}) { return d.D.model({ ...copy(d.s), ...updates, lessonOn: false, lessonEntry: false }); }
  function edgeData(d, m, ref, coplanar = false) {
    const sol = m.sol, groups = classifyEdges(sol, ref);
    return { ...d, m, sol, ref, groups, coplanar, extensions: extentData(sol, ref, groups), answer: coplanar ? groups.meet.length + groups.ext.length + groups.parallel.length : groups.skew.length };
  }
  function referenceFor(d, label) {
    const { m } = d, choices = m.cfg.refs(m.sol), side = label === '옆모서리';
    const target = choices.find(x => side ? x.label.includes('옆') : label === '긴밑변' ? x.label.includes('긴') : label === '다리기준' ? x.label === '다리' : x.label.includes('밑')) || choices[0];
    const currentPoints = edgePoints(m.sol, m.ref), currentSide = Math.abs(currentPoints[0].z - currentPoints[1].z) > EPS;
    if (label !== '긴밑변' && label !== '다리기준' && currentSide === side) return m.ref;
    if (m.ref.key === target.key) return m.ref;
    return m.sol.edges.find(e => e.key === target.key);
  }
  const edgeLabels = { 's1-1': ['밑면기준', '옆모서리'], 's1-2': ['밑면기준', '옆모서리'], 's1-3': ['다리기준', '긴밑변', '옆모서리'], 's1-4': ['밑면기준', '옆모서리'], 's1-5': ['밑면기준', '옆모서리'], 's1-6': ['밑면기준', '옆모서리'], 's1-7': ['밑면기준', '옆모서리'] };
  for (const [id, labels] of Object.entries(edgeLabels)) labels.forEach(label => addPlan(id, label, d => {
    const e = edgeData(d, d.m, referenceFor(d, label));
    return make(e, `${e.sol.name} · ${e.ref.name} 기준으로 제외하며 세기`, `${e.sol.name} · ${label} ${e.ref.name} · 현재 입체의 모든 모서리`, 'shared-endpoints-extension-intersections-parallel-directions-then-skew-remainder', edgeCountDraw, edgeCountFrame);
  }));
  addPlan('s1-7', '두모서리', d => {
    const { sol, ref, tgt } = d.m, a = edgePoints(sol, ref), targetPoints = edgePoints(sol, tgt), relation = lineRelation(...a, ...targetPoints);
    const intersection = lineIntersection(...a, ...targetPoints), plane = planeThrough(a[0], a[1], targetPoints[0]);
    const panel = plane ? spanningPanel([a[0], a[1], targetPoints[0]]) : null;
    const m = { ...d, sol, ref, target: tgt, relation, intersection, plane, panel, answer: REL[relation] };
    return make(m, `${ref.name}와 ${tgt.name}의 실제 공간 관계`, `현재 ${sol.name}의 선택 모서리 ${ref.name}, ${tgt.name}`, 'coplanarity-test-with-a-third-point-and-off-plane-endpoint', (b, t, m) => {
      const points = sol.order.map(k => sol.verts[k]), showX = intersection && len(sub(intersection, sol.ctr)) < 3 * sol.R;
      const D = drawing(b, m, points.concat(showX ? [intersection] : [], panel || []));
      if (t >= 3 && panel) D.panel(panel, 'sky', .1, 'sky', 1.7);
      solid(D, m, sol, e => ({ color: e.key === ref.key ? 'amber' : e.key === tgt.key ? 'rose' : 'muted', width: e.key === ref.key || e.key === tgt.key ? 5 : 1.7, alpha: e.key === ref.key || e.key === tgt.key ? 1 : .45 }));
      if (relation === 'meet' && t >= 2) [a, targetPoints].forEach(ps => { if (showX) { trace(D, ps[0], intersection, phase(t, 2, 5.8), 'violet', 2.5, { dash: [5, 4] }); if (t >= 5.8) D.dot(intersection, 'green', 5); } });
      if (relation === 'parallel' && t >= 4) { D.par(...a, 1, 'green'); D.par(...targetPoints, 1, 'green'); }
      if (relation === 'skew' && plane && t >= 4) { const q = sub(targetPoints[1], mul(plane.n, planeDistance(plane, targetPoints[1]))); trace(D, q, targetPoints[1], phase(t, 4, 6.3), 'red', 3, { dash: [4, 3] }); D.dot(targetPoints[1], 'rose', 5); }
      m.G.drawVerts(D, sol, { hot: k => [ref.u, ref.v, tgt.u, tgt.v].includes(k) }); D.flush();
    }, (t, m) => t < 1 ? F('화면에서 선이 겹쳐 보이는지만으로 판단하지 않습니다.') : t < 3 ? F('끝점 또는 연장선에서 실제로 만나는지 확인합니다.') : t < 6.4 ? F(relation === 'skew' ? '기준 직선과 다른 직선의 한 점을 담은 평면을 만듭니다. 다른 끝점은 그 평면 밖에 있습니다.' : relation === 'parallel' ? '한 평면 안에서 두 선의 방향이 같은지 비교합니다.' : relation === 'same' ? '두 이름이 가리키는 직선 전체가 같은 위치인지 확인합니다.' : '연장한 두 직선의 점이 3차원에서도 같은 자리인지 확인합니다.') : t < 7.8 ? F(relation === 'skew' ? '두 직선을 함께 담을 평면이 없으므로 만나지도 평행하지도 않습니다.' : '현재 두 모서리를 포함하는 직선의 관계를 정리합니다.') : F(`${ref.name}와 ${tgt.name}: ${m.answer}`, m.answer));
  });

  // Statements are evaluated with their current controls first. A proof then
  // changes only the explicitly demonstrated degree of freedom, maintaining
  // the hypothesis; invalid starting hypotheses are identified before repair.
  const ST_NAME = { p1: '한 직선에 수직인 두 직선', p2: '한 평면에 평행한 두 직선', p3: '한 평면에 수직인 두 직선', p4: '한 평면에 수직인 두 평면', p5: '한 직선에 수직인 두 평면', p6: '수직인 막대와 다른 직선', perp: '한 직선에만 수직', door: '수직인 경첩을 포함하는 문', planes: '평행한 평면의 두 교선' };
  const ST_REASON = {
    p1: '같은 막대에 직각이어도 공간에서는 서로 다른 방향으로 돌 수 있습니다.',
    p2: '벽과 만나지 않는 두 직선도 벽과 나란한 방향 안에서 서로 다르게 돌 수 있습니다.',
    p3: '한 점에서 바닥의 두 방향에 모두 직각인 방향은 하나로 정해집니다. 두 직선의 방향이 같습니다.',
    p4: '두 벽은 모두 바닥에 수직이어도 서로 만나 교선을 만들 수 있습니다.',
    p5: '같은 막대에 수직인 두 판은 기울기가 같습니다. 서로 다른 두 판은 만나지 않습니다.',
    p6: '직선이 평면 안에 포함되면 평면과 만납니다. 평행이라는 결론의 반례입니다.',
    perp: '한 방향과는 직각인 채로 쓰러질 수 있습니다. 평면의 다른 방향과는 직각이 아닙니다.',
    door: '문을 돌려도 수직인 경첩을 포함합니다. 바닥과 문의 직각은 유지됩니다.',
    planes: '두 교선은 같은 평면 R 위에 있습니다. 만나면 그 점이 평행한 P와 Q에도 동시에 있어야 하므로 불가능합니다.'
  };
  function statementData(d, id, goal = '') {
    const st = d.G.stmt.STM[id], initial = d.G.stmt.ab(st, d.s), target = { ...initial };
    if (id === 'p1' || id === 'p2') target.a = initial.a > .15 ? initial.a : .65;
    if (id === 'p3' || id === 'p5') target.b = 0;
    if (id === 'p4') target.a = Math.max(initial.a, .65);
    if (id === 'p6') target.a = 0;
    if (id === 'perp') target.a = goal === 'two' ? 1 : 0;
    if (id === 'door') target.a = initial.a < .6 ? Math.min(1, initial.a + .45) : Math.max(0, initial.a - .45);
    if (id === 'planes') { target.a = 1 - initial.a; target.b = initial.b < .5 ? .75 : .25; }
    const start = st.geo(initial.a, initial.b), end = st.geo(target.a, target.b);
    return { ...d, st, initial, target, start, end, statement: id, goal, answer: goal === 'two' ? 'l ⟂ P' : st.truth ? '참' : '거짓' };
  }
  function statementPose(d, u) { return d.st.geo(d.initial.a + (d.target.a - d.initial.a) * u, d.initial.b + (d.target.b - d.initial.b) * u); }
  function completeWallIntersection(geo) {
    // The drawn rectangles are only finite windows into two infinite planes.
    // Extend their bottom edges when the real intersection lies beyond them.
    const q = geo.panels[1], r = geo.panels[2];
    if (!q || !r) return geo;
    const nq = planeThrough(...q.pts.slice(0, 3)), nr = planeThrough(...r.pts.slice(0, 3));
    const den = nq.n.x * nr.n.y - nq.n.y * nr.n.x;
    if (Math.abs(den) < EPS) return geo;
    const x = (nq.d * nr.n.y - nq.n.y * nr.d) / den, y = (nq.n.x * nr.d - nq.d * nr.n.x) / den;
    const a = V(x, y, q.pts[0].z), z = V(x, y, q.pts[2].z);
    const lines = geo.lines.filter(l => l.name !== '교선').concat([{ p: a, q: z, color: 'rose', width: 5, name: '교선', nameAt: z }]);
    [q, r].forEach(p => {
      for (const [edge, point] of [[[p.pts[0], p.pts[1]], a], [[p.pts[3], p.pts[2]], z]]) {
        const v = sub(edge[1], edge[0]), u = dot(sub(point, edge[0]), v) / dot(v, v);
        if (u < 0 || u > 1) lines.push({ p: edge[u < 0 ? 0 : 1], q: point, color: p.color, width: 2, dash: [5, 4] });
      }
    });
    return { ...geo, lines, fit: (geo.fit || []).concat(a, z) };
  }
  function statementDraw(b, t, d) {
    let geo = statementPose(d, phase(t, 1.3, 5.9));
    if (d.statement === 'p4' && t >= 5.9) geo = completeWallIntersection(geo);
    const display = { ...geo, pars: t >= 6.4 ? geo.pars : [], lines: geo.lines.map(l => ({ ...l, name: l.name === '교선' && t < 6.4 ? '' : l.name })) };
    const D = drawing(b, d, null);
    d.G.stmt.render(D, { ...d.st, geo: () => display }, { a: 0, b: 0 }, D.C, { caption: false, showRelation: t >= 6.4 });
    if (t >= 2.7 && (d.statement === 'p3' || d.goal === 'two')) {
      const upright = d.statement === 'p3' ? geo.given : geo.holds;
      if (upright) {
        const ray = V(Math.cos(phase(t, 2.7, 6.4) * Math.PI), Math.sin(phase(t, 2.7, 6.4) * Math.PI), 0);
        const feet = d.statement === 'p3' ? geo.lines.filter(l => l.name === 'l' || l.name === 'm').map(l => l.p) : [V(0, 0, -1)];
        feet.forEach(foot => { line(D, foot, add(foot, mul(ray, 1.15)), 'green', 3); D.right(foot, Z, ray, .3, 'green'); });
      }
    }
    if (d.statement === 'p5' && t >= 5.9) {
      const p = geo.panels[0].pts, q = geo.panels[1].pts, delta = sub(center(q), center(p)), u = phase(t, 5.9, 7.5);
      D.panel(p.map(v => add(v, mul(delta, u))), 'amber', .06, 'amber', 2.4, { dash: [5, 4] });
      line(D, center(p), center(q), 'amber', 3);
      if (t < 7.5) name(D, add(center(p), mul(delta, u)), '기울기를 유지한 평행이동', 'amber');
    }
    D.flush();
  }
  function statementFrame(t, d) {
    if (t < 1.3) return F(d.start.given ? '현재 그림에서 조건과 결론을 구분합니다.' : `현재는 조건이 깨졌습니다. ${d.start.note || '조건부터 맞추어야 합니다.'}`);
    if (t < 3.5) return F(d.statement === 'p3' || d.statement === 'p5' ? '수직 조건이 깨져 있다면 먼저 그 조건을 맞춥니다.' : d.goal === 'two' ? '직선 l을 세워 m뿐 아니라 n에도 직각이 되게 맞춥니다.' : '같은 조건을 지키면서 허용된 회전이나 위치 변화를 확인합니다.');
    if (t < 6.4) return F(d.goal === 'two' ? '서로 다른 두 방향에 모두 직각이 되면 기울일 자유가 사라지고 수직 방향으로 정해집니다.' : ST_REASON[d.statement]);
    if (t < 7.8) return F(d.goal === 'two' ? '교점에서 만나는 서로 다른 두 방향 모두와 직각이면 평면과 수직입니다.' : d.statement === 'p5' ? 'P를 막대를 따라 평행이동하면 Q와 포개집니다. 두 판의 방향은 같습니다.' : d.st.truth ? '그림 한 번의 일치가 아니라 조건이 방향을 제한하는 이유를 확인합니다.' : '조건은 참인데 결론이 성립하지 않는 한 가지 경우가 생겼습니다.');
    return F(d.goal === 'two' ? '평면 위의 두 직선이 한 점에서 만난다는 조건도 필요합니다.' : d.st.truth ? '주어진 조건에서 항상 성립합니다.' : '반례가 하나 있으므로 항상 참인 설명은 아닙니다.', d.goal === 'two' ? '$l\\perp P$' : `설명: ${d.answer}`);
  }
  // A small 3-D viewport for each of the five actual question statements.
  // Occluding projected crossings are cut by depth, just as in the main view.
  function miniProject(b, d, geo, c, width, height) {
    const cam = d.G.camOf(d.s), objects = geo.panels.flatMap(p => p.pts).concat(geo.lines.flatMap(l => [l.p, l.q]));
    const projected = objects.map(p => d.G.proj(cam, p)), box = { x0: Math.min(...projected.map(p => p.x)), x1: Math.max(...projected.map(p => p.x)), y0: Math.min(...projected.map(p => p.y)), y1: Math.max(...projected.map(p => p.y)) };
    const k = Math.min(width / Math.max(.1, box.x1 - box.x0), height / Math.max(.1, box.y1 - box.y0));
    const project = p => { const q = d.G.proj(cam, p); return { x: c.x + k * (q.x - (box.x0 + box.x1) / 2), y: c.y + k * (q.y - (box.y0 + box.y1) / 2), d: q.d }; };
    geo.panels.slice().sort((a, z) => project(center(z.pts)).d - project(center(a.pts)).d).forEach(p => b.path(p.pts.map(project), { close: true, fill: p.color, fillAlpha: .1, color: p.color, width: 1.2 }));
    geo.lines.forEach((l, i) => {
      const a = project(l.p), z = project(l.q), cuts = [];
      if (!l.dash) geo.lines.forEach((q, j) => {
        if (i === j || q.dash) return;
        const p = project(q.p), r = project(q.q), u = { x: z.x - a.x, y: z.y - a.y }, v = { x: r.x - p.x, y: r.y - p.y }, den = u.x * v.y - u.y * v.x;
        if (Math.abs(den) < EPS) return;
        const ta = ((p.x - a.x) * v.y - (p.y - a.y) * v.x) / den, tb = ((p.x - a.x) * u.y - (p.y - a.y) * u.x) / den;
        if (ta > .02 && ta < .98 && tb > 0 && tb < 1 && a.d + (z.d - a.d) * ta > p.d + (r.d - p.d) * tb + .08) cuts.push(ta);
      });
      let last = 0; const gap = 4 / (b.k * Math.max(.1, Math.hypot(z.x - a.x, z.y - a.y)));
      const at = u => ({ x: a.x + (z.x - a.x) * u, y: a.y + (z.y - a.y) * u });
      cuts.sort((a, z) => a - z).forEach(t => { if (t - gap > last) b.path([at(last), at(t - gap)], { color: l.color, width: 2.1 }); last = t + gap; });
      if (last < 1) b.path([at(last), z], { color: l.color, width: l.dash ? 1 : 2.1, dash: l.dash, alpha: l.alpha });
    });
    (geo.rights || []).forEach(r => {
      const a = mul(unit(r.a), r.size || .24), c = mul(unit(r.c), r.size || .24);
      b.path([add(r.O, a), add(add(r.O, a), c), add(r.O, c)].map(project), { color: r.color || 'green', width: 1.6 });
    });
  }
  function bankPlan(d) {
    const bank = d.m.bank.slice(), cases = bank.map(id => statementData(d, id)), answer = cases.map((q, i) => q.st.truth ? NUM[i] : null).filter(Boolean);
    const data = { ...d, bank, cases, answer };
    return make(data, '현재 다섯 보기의 조건과 반례 비교', bank.map((id, i) => `${NUM[i]} ${ST_NAME[id]}`).join(' · '), 'five-current-statements-with-hypothesis-preserving-counterexamples', (b, t, d) => {
      const cols = b.W < 560 ? 2 : 3, rows = Math.ceil(cases.length / cols), cw = 5.2, ch = 4.3;
      b.kind = 'figure'; b.aspect = '1:1'; b.setPanes(null); b.setInsets({ top: 48, right: 12, bottom: 82, left: 12 }); b.zoom = 1; b.panX = 0; b.panY = 0;
      b.setFocus({ x: [-cols * cw / 2, cols * cw / 2], y: [-rows * ch / 2, rows * ch / 2] }, false);
      cases.forEach((q, i) => {
        const c = V((i % cols - (cols - 1) / 2) * cw, (Math.floor(i / cols) - (rows - 1) / 2) * ch), start = .8 + i * 1.22, end = start + 1.05;
        let geo = statementPose(q, phase(t, start, end));
        if (q.statement === 'p4' && t >= end) geo = completeWallIntersection(geo);
        miniProject(b, q, geo, c, cw - .7, ch - 1.5);
        const shortGiven = { p1: 'l⊥m, l⊥n', p2: 'l∥P, m∥P', p3: 'l⊥P, m⊥P', p4: 'Q⊥P, R⊥P', p5: 'P⊥l, Q⊥l', p6: 'l⊥P, l⊥m', perp: 'l⊥m, m⊂P', planes: 'P∥Q, 자르는 R', door: 'l⊥P, l⊂Q' };
        b.text(V(c.x, c.y - ch / 2 + .28), `${NUM[i]} ${shortGiven[q.statement]}`, { size: 12, align: 'center', color: 'ink' });
        b.text(V(c.x, c.y + ch / 2 - .25), t >= end + .3 ? q.st.truth ? '조건에서 항상 성립' : '반례 있음' : !geo.given ? '현재 조건 불충족' : `결론 ${geo.conc}?`, { size: 12, align: 'center', color: t >= end + .3 ? q.st.truth ? 'green' : 'rose' : !geo.given ? 'rose' : 'ink' });
      });
    }, (t, d) => {
      if (t < .8) return F('현재 문제의 보기 순서와 종류를 그대로 확인합니다.');
      if (t < 7.4) { const i = Math.min(4, Math.floor((t - .8) / 1.22)); return F(`${NUM[i]} ${ST_REASON[cases[i].statement]}`); }
      return F('조건을 지킨 반례가 있으면 거짓입니다. 참인 보기는 방향을 제한하는 이유로 확인합니다.', `옳은 보기: ${d.answer.join(', ')}`);
    });
  }
  for (let i = 1; i <= 6; i++) {
    addPlan(`s2-${i}`, '관계 확인', d => { const m = statementData(d, `p${i}`); return make(m, ST_NAME[m.statement], m.st.text + ' 현재 조절 상태에서 확인', 'hypothesis-preserving-spatial-construction', statementDraw, statementFrame); });
    addPlan(`s2-${i}`, '다섯 보기', bankPlan);
  }
  addPlan('s2-7', '다섯 보기', bankPlan);

  // A pencil of planes about the actual fixed line. No plane count is inferred
  // from a screen crossing: whole-line containment uses a point AND direction.
  const page = th => { const w = V(0, Math.cos(th * DEG), Math.sin(th * DEG)); return [[-2.9, -2.2], [2.9, -2.2], [2.9, 2.2], [-2.9, 2.2]].map(([x, y]) => add(V(x, 0), mul(w, y))); };
  function fanPose(d, t) {
    if (!d.compare) return d.m.F;
    const u = phase(t, 1, 2.7);
    if (d.compare === 'on') return modelAt(d, { spCd: d.s.spCd * (1 - u) }).F;
    return modelAt(d, { spDs: d.s.spDs * (1 - u), spGm: d.s.spGm * (1 - u), spTl: d.s.spTl * (1 - u) }).F;
  }
  function fanDraw(b, t, d) {
    const F0 = fanPose(d, t), start = d.compare ? 2.8 : 1.1, u = phase(t, start, 6.4);
    const initial = d.s.spTh || 0, theta = F0.nPl === 1 ? initial + (F0.phi - initial) * u : initial + 145 * u;
    const pts = [0, 45, 90, 135, theta].flatMap(page).concat(F0.pts.map(p => p.p), F0.lines.flatMap(l => [l.p, l.q]));
    const D = drawing(b, d, pts);
    if (t >= start) [0, 45, 90, 135].forEach(th => D.panel(page(th), 'muted', .025, 'muted', 1));
    const accepted = F0.contains(theta);
    D.panel(page(theta), t >= 6.4 && accepted ? 'green' : 'amber', .11, t >= 6.4 && accepted ? 'green' : 'amber', 2.4);
    F0.lines.forEach(l => line(D, l.p, l.q, l.c, 4));
    if (F0.type === 'pts') { line(D, F0.A, F0.B, 'sky', 4); if (t >= 3.3 && F0.nPl === 1) D.path([F0.A, F0.pts[2].p, F0.B], 'green', 2.5, { close: true, fill: 'green', fillAlpha: .1 }); }
    F0.pts.forEach(q => { D.dot(q.p, q.c, 6); name(D, q.p, q.n, q.c); });
    F0.lines.forEach(l => name(D, l.q, l.n, l.c));
    if (t >= 4.2 && !accepted) {
      const n = V(0, -Math.sin(theta * DEG), Math.cos(theta * DEG)), obj = F0.objs[0];
      const samples = obj.k === 'pt' ? [obj.p] : [add(obj.p, mul(obj.d, 1.6)), sub(obj.p, mul(obj.d, 1.6))];
      samples.forEach(p => { const q = sub(p, mul(n, dot(n, p))); if (len(sub(p, q)) > 1e-7) { line(D, p, q, 'red', 2.5, { dash: [4, 4] }); D.dot(p, 'rose', 4.5); } });
    }
    if (t >= 6.4 && F0.nPl === 'inf') [25, 75, 125].forEach(th => D.panel(page(th), 'green', .035, 'green', 1.5));
    D.flush();
  }
  function fanPlan(d, label, compare = '') {
    const final = compare === 'on' ? modelAt(d, { spCd: 0 }).F : compare === 'same' ? modelAt(d, { spDs: 0, spGm: 0, spTl: 0 }).F : d.m.F;
    const m = { ...d, compare, final, answer: final.nPl };
    const given = compare === 'on' ? '현재 점에서 시작 · 직선 위로 옮긴 비교 조건' : compare === 'same' ? '현재 두 직선에서 시작 · 두 직선을 일치시킨 비교 조건' : `현재 ${d.m.F.axisName}과 ${d.m.F.type === 'pts' || d.m.F.type === 'linept' ? '점' : '다른 직선'}의 위치 유지`;
    return make(m, compare === 'on' ? '점이 직선 위에 놓인 경우 비교' : compare === 'same' ? '두 이름이 같은 직선일 때 비교' : '현재 조건을 함께 포함하는 평면 찾기', given, 'rotating-pencil-of-planes-with-whole-object-containment', fanDraw, (t, m) => {
      if (t < 1) return F('현재 주어진 점과 직선을 모두 확인합니다.');
      if (t < 2.8 && compare) return F(compare === 'on' ? '비교를 위해 점을 직선 위에 놓습니다. 탐구에서 고른 원래 값은 보존됩니다.' : '비교를 위해 두 직선이 일치하도록 겹칩니다.');
      if (t < 4.2) return F('한 직선을 포함하는 평면은 그 직선을 축으로 회전할 수 있습니다.');
      if (t < 6.4) return F(final.nPl === 0 ? '다른 직선의 한 점을 지나도 그 직선 전체를 담지는 못합니다.' : final.nPl === 'inf' ? '평면을 돌려도 모든 주어진 대상이 축 위에 남습니다.' : '축 밖의 점 또는 다른 직선까지 담는 방향에 맞춥니다.');
      if (t < 7.8) return F(final.nPl === 0 ? '두 직선이 꼬인 위치이면 함께 놓일 평면이 없습니다.' : final.nPl === 'inf' ? '추가 조건이 축 밖의 방향을 고정하지 못합니다.' : '축 밖의 한 점이 평면의 회전 방향을 고정합니다.');
      return F('현재 표시한 조건에서 가능한 평면의 수입니다.', final.nPl === 'inf' ? '무수히 많음' : `${final.nPl}개`);
    });
  }
  for (const id of ['s3-1', 's3-2']) {
    addPlan(id, '밖의 점', d => fanPlan(d, '밖의 점'));
    addPlan(id, '위의 점', d => fanPlan(d, '위의 점', 'on'));
  }
  function linePairsPlan(d, doubled) {
    const lines = d.m.problemLines, k = lines.length, all = pairs(k), answer = all.length;
    const condition = d.D.id === 's3-3' ? '한 점 O에서 만나는' : '서로 평행한';
    const m = { ...d, lines, pairs: all, k, answer };
    return make(m, `현재 ${k}직선 · ${doubled ? '두 번 센 순서 보정' : '두 직선씩 골라 평면 구성'}`, `현재 문제: ${condition} ${k}직선 · 어느 세 직선도 한 평면 위에 있지 않음`, doubled ? 'ordered-line-pairs-merge-to-one-plane' : 'enumerate-distinct-two-line-spanning-planes', (b, t, m) => {
      const points = lines.flatMap(l => [l.p, l.q]), index = Math.min(all.length - 1, Math.floor(phase(t, 1, 6.5) * all.length)), pair = all[index];
      const panel = spanningPanel([lines[pair[0]].p, lines[pair[0]].q, lines[pair[1]].p, lines[pair[1]].q]);
      const D = drawing(b, d, points.concat(panel || []));
      if (t >= 1 && panel) D.panel(panel, 'green', .13, 'green', 2.2);
      lines.forEach((l, i) => { line(D, l.p, l.q, t >= 1 && pair.includes(i) ? 'amber' : COLORS[i], t >= 1 && pair.includes(i) ? 5 : 3); name(D, l.q, ['l', 'm', 'n', 'p', 'q'][i], COLORS[i]); });
      if (t >= 6.5 && doubled) {
        const a = lines[pair[0]].q, z = lines[pair[1]].p, q = center([a, z]), u = phase(t, 6.5, 7.8), labels = ['l', 'm', 'n', 'p', 'q'];
        if (t < 7.8) { name(D, mix(a, q, u), `${labels[pair[0]]} → ${labels[pair[1]]}`, 'rose'); name(D, mix(z, q, u), `${labels[pair[1]]} → ${labels[pair[0]]}`, 'sky'); }
        else name(D, q, '순서만 다른 같은 평면', 'green');
      }
      if (t >= 1 && t < 6.5) b.stext(b.W / 2, b.H - b.insets.bottom - 8, `선택 ${index + 1}: ${['l', 'm', 'n', 'p', 'q'][pair[0]]}, ${['l', 'm', 'n', 'p', 'q'][pair[1]]}`, { align: 'center', size: 14, color: 'green' });
      D.flush();
    }, (t, m) => t < 1 ? F('현재 생성된 직선 수를 그대로 사용합니다.') : t < 4 ? F('두 직선마다 하나의 평면을 그립니다. 어느 세 직선도 같은 평면에 있지 않습니다.') : t < 6.5 ? F('이미 센 쌍을 제외하며 다음 두 직선을 고릅니다.') : t < 7.8 ? F(doubled ? 'l 다음 m을 고른 것과 m 다음 l을 고른 것은 같은 평면입니다.' : '어느 쌍도 빠뜨리거나 순서를 바꾸어 다시 세지 않았는지 확인합니다.') : F('서로 다른 두 직선의 쌍 수가 평면 수입니다.', doubled ? `$${k}\\times${k - 1}\\div2=${answer}\\text{개}$` : `$${Array.from({ length: k - 1 }, (_, i) => k - 1 - i).join('+')}=${answer}\\text{개}$`));
  }
  for (const id of ['s3-3', 's3-4']) {
    addPlan(id, '두 직선', d => fanPlan(d, '두 직선'));
    addPlan(id, '3직선', d => linePairsPlan(d, false));
    addPlan(id, '5직선', d => linePairsPlan(d, true));
  }
  addPlan('s3-5', '꼬인 위치', d => fanPlan(d, '꼬인 위치'));
  addPlan('s3-5', '일치', d => fanPlan(d, '일치', 'same'));
  addPlan('s3-5', '모서리 수', d => {
    const m = d.m.problemSolid, e = edgeData(d, m, m.ref, true);
    return make(e, `${e.sol.name} · ${e.ref.name}와 각각 한 평면 위의 모서리`, `현재 문제의 입체 ${e.sol.name} · 기준 ${e.ref.name}`, 'intersecting-or-parallel-lines-are-coplanar-pairwise', edgeCountDraw, edgeCountFrame);
  });
  for (const [label, kind] of [['직육면체', 'cuboid'], ['정사각뿔', 'pyr4'], ['정사면체', 'tetra']]) addPlan('s3-6', label, d => {
    // This label chooses an actual solid type, unlike the old numeric 3/5 examples.
    const native = d.m.kind === kind ? d.m : modelAt(d, { spK6: kind });
    const sol = native.sol, groups = planeGroups(sol), repeated = groups.filter(g => g.triples.length > 1), T = groups.reduce((n, g) => n + g.triples.length, 0), duplicates = T - groups.length;
    const selected = groups.find(g => native.sel.every(k => g.members.includes(k))) || groups[0];
    const m = { ...d, sol, groups, repeated, T, duplicates, selected, answer: groups.length, kind };
    return make(m, `${sol.name}의 세 점 선택과 같은 평면`, `선택한 입체 종류: ${sol.name} · 세 꼭짓점으로 만드는 서로 다른 평면`, 'coplanar-triples-merge-before-counting-planes', (b, t, m) => {
      const D = drawing(b, m, sol.order.map(k => sol.verts[k])), group = t < 2.8 ? selected : repeated.length ? repeated[Math.min(repeated.length - 1, Math.floor(phase(t, 2.8, 6.5) * repeated.length))] : groups[Math.min(groups.length - 1, Math.floor(phase(t, 2.8, 6.5) * groups.length))];
      solid(D, m, sol);
      if (t >= 1) {
        const triple = group.triples[Math.min(group.triples.length - 1, Math.floor(phase(t, 1, 6.5) * group.triples.length))];
        D.path(triple.map(k => sol.verts[k]), 'amber', 4, { close: true, fill: 'amber', fillAlpha: .11 });
        if (t >= 2.8) D.panel(orderedPlane(group.members.map(k => sol.verts[k]), group.n), 'green', .13, 'green', 2.5);
        if (t >= 4) name(D, center(group.members.map(k => sol.verts[k])), `${group.members.join('')} : 같은 평면`, 'green');
      }
      m.G.drawVerts(D, sol, { hot: k => t >= 1 && group.members.includes(k) }); D.flush();
    }, (t, m) => t < 1 ? F('세 점을 고른 방법과 서로 다른 평면의 개수를 구별합니다.') : t < 2.8 ? F('선택한 세 점이 한 평면을 만듭니다.') : t < 6.5 ? F(repeated.length ? '같은 평면 위의 다른 세 점으로 바꾸어도 평면은 그대로입니다. 중복을 한 묶음으로 합칩니다.' : '네 점이 한 평면 위에 있지 않아 세 점의 선택마다 다른 평면이 생깁니다.') : t < 7.8 ? F(`세 점 선택 ${T}가지에서 같은 평면으로 묶인 중복 ${duplicates}가지를 뺍니다.`) : F('모든 세 점 조합을 실제 평면별로 묶은 결과입니다.', `$${T}-${duplicates}=${m.answer}\\text{개}$`));
  });

  // Nets use the production hinge geometry but a separate unfolding/folding
  // proof schedule. All coincident flat copies keep their folded vertex names.
  function foldAt(t, initial) { return t < 1.8 ? initial * (1 - phase(t, .4, 1.7)) : phase(t, 1.9, 5.7); }
  function netSolid(net) {
    const sol = { ...net.sol }, names = net.faces.map((f, i) => f.poly.map((_, j) => net.vname(i, j)));
    sol.faces = names.map((v, i) => ({ v, n: net.faceInfo[i].n, c: net.faceInfo[i].c }));
    sol.edgeFaces = Object.fromEntries(sol.edges.map(e => [e.key, names.map((vs, i) => vs.some((v, j) => (v === e.u && vs[(j + 1) % vs.length] === e.v) || (v === e.v && vs[(j + 1) % vs.length] === e.u)) ? i : -1).filter(i => i >= 0)]));
    return sol;
  }
  function netDraw(b, t, d) {
    const { net, goal, ref, groups, initialFold } = d, f = foldAt(t, initialFold), faces = net.at(f), end = f > .999;
    const D = drawing(b, d, faces.flat(), t, { spYaw: (d.s.spYaw ?? -12) - 20 * f, spPitch: Math.max(15, (d.s.spPitchN ?? 62) - 34 * f) });
    const base = d.base ?? 0, right = d.perpendicular || [], parallel = d.parallel || [];
    const isBase = i => goal === 'base-parallel' || goal === 'base-perp' ? net.faces[i].poly.length === 3 : i === base;
    const selectedFace = (i) => {
      if (goal === 'face-parallel' || goal === 'face-perp') return i === base ? 'amber' : t >= 6.4 && (goal === 'face-parallel' ? parallel.includes(i) : right.includes(i)) ? 'green' : 'sky';
      if (goal === 'base-parallel') return isBase(i) ? t >= 6.4 ? 'green' : 'amber' : 'sky';
      if (goal === 'base-perp') return isBase(i) ? 'amber' : t >= 6.4 ? 'green' : 'sky';
      return 'sky';
    };
    const faceVisible = faces.map((_, i) => !end || D.facing(net.faceInfo[i].n));
    faces.map((pts, i) => ({ i, depth: D.depth(center(pts)) })).sort((a, z) => z.depth - a.depth).forEach(({ i }) => {
      if (faceVisible[i]) D.panel(faces[i], selectedFace(i), selectedFace(i) === 'sky' ? .07 : .15, selectedFace(i), 1.7);
    });
    const eVisible = new Map(), seen = new Map();
    faces.forEach((ps, i) => ps.forEach((p, j) => {
      const a = net.vname(i, j), z = net.vname(i, (j + 1) % ps.length), key = [a, z].sort().join('');
      if (faceVisible[i]) eVisible.set(key, true);
    }));
    faces.forEach((ps, i) => ps.forEach((p, j) => {
      const a = net.vname(i, j), z = net.vname(i, (j + 1) % ps.length), edge = d.sol.edges.find(e => (e.u === a && e.v === z) || (e.u === z && e.v === a)), key = [a, z].sort().join('');
      const isRef = ref && edge.key === ref.key, chosen = t >= 6.4 && groups?.skew.some(e => e.key === edge.key);
      let color = isRef ? 'amber' : chosen && (goal === 'name' || goal === 'count') ? 'green' : (goal === 'apex' || goal === 'lateral') && (a === 'V' || z === 'V') ? 'rose' : 'ink';
      if (end && t >= 5.7 && t < 6.4 && groups && (groups.meet.some(e => e.key === edge.key) || groups.parallel.some(e => e.key === edge.key))) color = groups.parallel.some(e => e.key === edge.key) ? 'sky' : 'rose';
      line(D, p, ps[(j + 1) % ps.length], color, isRef || chosen ? 4 : 2, { dash: end && !eVisible.get(key) ? [5, 4] : undefined, alpha: end && !eVisible.get(key) ? .65 : 1 });
      const pointKey = `${a}:${format(p.x)},${format(p.y)},${format(p.z)}`;
      if (!seen.has(pointKey)) { seen.set(pointKey, true); D.dot(p, a === 'V' && (goal === 'apex' || goal === 'lateral') ? 'amber' : 'ink', 3.5); if (!end || faceVisible[i]) name(D, p, a, a === 'V' ? 'amber' : 'ink'); }
    }));
    if (goal === 'face-parallel' || goal === 'face-perp') faces.forEach((ps, i) => { if (faceVisible[i]) name(D, center(ps), net.faceName[i], selectedFace(i)); });
    if (end && t >= 6.4 && (goal === 'base-perp' || goal === 'face-perp')) {
      const baseIndex = goal === 'base-perp' ? net.faces.findIndex(f => f.poly.length === 3) : base;
      const n0 = net.faceInfo[baseIndex].n;
      const targets = goal === 'base-perp' ? net.faces.map((f, i) => f.poly.length === 4 ? i : -1).filter(i => i >= 0) : right;
      targets.forEach(i => { const shared = d.sol.faces[i].v.filter(v => d.sol.faces[baseIndex].v.includes(v)); if (shared.length === 2) { const p = center(shared.map(k => d.sol.verts[k])); D.right(p, n0, net.faceInfo[i].n, .25, 'green'); } });
    }
    D.flush();
  }
  function netPlan(d, goal) {
    const net = d.m.net, sol = netSolid(net), ref = d.m.ref, groups = ref ? classifyEdges(sol, ref) : null;
    const question = ref && goal === 'name' ? d.D.prob(d.m, d.s) : null, correct = question?.choices.find(q => q.ok)?.p;
    const base = d.m.base, parallel = base == null ? [] : net.faceInfo.map((x, i) => i !== base && len(cross(x.n, net.faceInfo[base].n)) < 1e-8 ? i : -1).filter(i => i >= 0);
    const perpendicular = base == null ? [] : net.faceInfo.map((x, i) => i !== base && Math.abs(dot(x.n, net.faceInfo[base].n)) < 1e-8 ? i : -1).filter(i => i >= 0);
    const answer = goal === 'count' ? groups.skew.length : goal === 'name' ? correct : goal === 'face-parallel' ? parallel.map(i => net.faceName[i]).join(', ') : goal === 'face-perp' ? perpendicular.map(i => net.faceName[i]).join(', ') : goal === 'apex' ? '꼭짓점 V 하나' : goal === 'lateral' ? '모두 V에서 만남' : goal === 'base-parallel' ? '두 밑면은 평행' : '한 밑면과 세 옆면은 수직';
    const m = { ...d, net, sol, ref, groups, initialFold: clamp(d.s.spFold || 0), goal, base, parallel, perpendicular, answer };
    const given = goal.startsWith('face-') ? `현재 전개도 ${d.m.label} · 기준 면 ${d.m.bname}${d.m.none ? ' (문제의 기준 면)' : ''}` : `${net.name}의 현재 전개도${ref && ['count', 'name'].includes(goal) ? ` · 기준 ${ref.name}` : ''}${question ? ` · 보기 ${question.choices.map(q => q.p).join(', ')}` : ''}`;
    return make(m, { count: '접은 뒤 꼬인 모서리 세기', name: '접은 뒤 보기의 모서리 판별', apex: '네 꼭짓점 V가 모이는 자리', lateral: '옆모서리가 공유하는 꼭짓점', 'base-parallel': '두 삼각형 밑면의 방향 비교', 'base-perp': '밑면과 세 옆면의 직각 확인', 'face-parallel': '기준 면과 마주 보는 면', 'face-perp': '기준 면과 직각으로 만나는 면' }[goal], given, 'rigid-hinge-fold-with-persistent-vertex-identities-and-spatial-classification', netDraw, (t, m) => t < .4 ? F('현재 접힘 정도와 같은 문자로 표시된 꼭짓점을 확인합니다.') : t < 1.9 ? F('필요하면 펼쳐 같은 문자의 서로 다른 복사본을 찾아봅니다.') : t < 5.7 ? F(goal === 'apex' || goal === 'lateral' ? '각 삼각형이 경첩을 축으로 회전하며 V들이 같은 자리로 모입니다.' : '접는 선의 길이를 유지하며 각 면을 제자리에서 회전시킵니다.') : t < 6.4 ? F(goal === 'count' || goal === 'name' ? '접힌 입체에서 기준과 만나는 모서리와 평행한 모서리를 제외합니다.' : '접은 뒤 실제 면의 방향과 공통 꼭짓점·모서리를 확인합니다.') : t < 7.8 ? F(goal === 'face-parallel' || goal === 'base-parallel' ? '마주 보는 면은 같은 방향으로 놓이고 만나지 않습니다.' : goal === 'face-perp' || goal === 'base-perp' ? '두 면이 이루는 직각을 실제 공유 모서리에서 표시합니다.' : goal === 'lateral' ? '옆모서리는 모두 같은 점을 가지므로 꼬인 위치일 수 없습니다.' : goal === 'apex' ? '전개도에서 여러 곳에 적힌 V는 접으면 같은 한 점입니다.' : '남은 꼬인 모서리를 현재 보기 또는 개수와 대응합니다.') : F('전개도의 평면상 거리 대신 접은 공간에서 판정합니다.', typeof answer === 'number' ? `${answer}개` : answer));
  }
  const netRecipes = { 's4-1': [['모서리 찾기', 'name'], ['꼬인 개수', 'count']], 's4-2': [['평행한 면', 'face-parallel'], ['수직인 면', 'face-perp']], 's4-3': [['두 밑면', 'base-parallel'], ['옆면', 'base-perp'], ['꼬인 개수', 'count']], 's4-4': [['꼭짓점', 'apex'], ['옆모서리', 'lateral'], ['모서리 찾기', 'name']] };
  for (const [id, list] of Object.entries(netRecipes)) list.forEach(([label, goal]) => addPlan(id, label, d => netPlan(d, goal)));

  function solidRelationPlan(d, goal) {
    const { sol, q } = d.m, fi = q.face % sol.faces.length, relationships = solidFaceRelations(sol, fi);
    const items = goal === 'edges' ? relationships.edges : goal === 'perpendicular' ? relationships.perpendicular : relationships.parallelPairs;
    const m = { ...d, sol, q, fi, relationships, items, goal, answer: items.length };
    return make(m, `${sol.name} · ${goal === 'edges' ? '면에 수직인 모서리' : goal === 'perpendicular' ? '기준 면과 수직인 면' : '평행한 면의 쌍'} 세기`, `현재 문제: ${sol.name}${goal === 'parallel' ? '의 전체 면' : ` · 기준 면 ${sol.faces[fi].v.join('')}`}`, 'face-direction-and-two-independent-in-plane-directions', (b, t, d) => {
      const D = drawing(b, d, sol.order.map(k => sol.verts[k])); const { vis } = solid(D, d, sol);
      if (goal !== 'parallel' || t < 1) highlightFace(D, sol, fi, 'amber');
      if (t >= 1 && goal === 'edges') {
        const f = sol.faces[fi], p = f.c, u = sub(sol.verts[f.v[1]], sol.verts[f.v[0]]), v = cross(f.n, u);
        trace(D, p, add(p, mul(unit(u), .8)), phase(t, 1, 2.2), 'sky', 3); trace(D, p, add(p, mul(unit(v), .8)), phase(t, 1.5, 2.7), 'rose', 3);
        const nEnd = add(p, mul(f.n, .85)); if (t >= 2.7) { line(D, p, nEnd, 'green', 3); D.right(p, f.n, u, .2, 'sky'); D.right(p, f.n, v, .28, 'rose'); }
      }
      if (t >= 3) {
        const shown = Math.min(items.length, Math.ceil(phase(t, 3, 6.8) * items.length));
        items.slice(0, shown).forEach(item => {
          if (goal === 'edges') { line(D, ...edgePoints(sol, item), 'green', 4.6, { dash: vis(item) ? undefined : [5, 4] }); name(D, center(edgePoints(sol, item)), item.name, 'green'); }
          else if (goal === 'perpendicular') { highlightFace(D, sol, item, 'green', .1); const shared = sol.faces[item].v.filter(k => sol.faces[fi].v.includes(k)); if (shared.length === 2) D.right(center(shared.map(k => sol.verts[k])), sol.faces[fi].n, sol.faces[item].n, .25, 'green'); }
          else if (items.indexOf(item) === shown - 1) item.forEach(i => highlightFace(D, sol, i, 'green', .13));
        });
      }
      d.G.drawVerts(D, sol, { names: t < 3 }); D.flush();
    }, (t, d) => t < 1 ? F(goal === 'parallel' ? '같은 두 면은 순서를 바꾸어도 같은 쌍입니다.' : `기준 면 ${sol.faces[fi].v.join('')} 자신은 세지 않습니다.`) : t < 3 ? F(goal === 'edges' ? '면 위에서 만나는 서로 다른 두 방향을 표시합니다. 둘 모두와 직각인 방향을 찾습니다.' : goal === 'perpendicular' ? '공유 모서리에서 두 면의 벌어진 각이 직각인지 확인합니다.' : '이웃하여 만나는 면을 제외하고 마주 보는 방향을 비교합니다.') : t < 6.8 ? F(goal === 'edges' ? '면 위에 놓인 모서리와 비스듬한 모서리는 제외합니다.' : goal === 'perpendicular' ? '직각인 면만 하나씩 표시합니다. 비스듬히 만나는 면은 제외합니다.' : '평행한 면은 같은 기울기로 떨어져 있으며 만나지 않습니다.') : t < 7.8 ? F('현재 입체에서 해당 관계를 빠짐없이 셉니다.') : F('실제 면과 모서리의 방향으로 판별한 결과입니다.', `${d.answer}${goal === 'parallel' ? '쌍' : '개'}`));
  }
  addPlan('s5-1', '한 직선', d => { const m = statementData(d, 'perp'); return make(m, '한 방향과의 직각만으로 충분한지', '현재 l, m, n과 평면 P · l은 m에 수직', 'tilt-about-one-in-plane-direction-to-disprove-plane-perpendicularity', statementDraw, statementFrame); });
  addPlan('s5-1', '두 직선', d => { const m = statementData(d, 'perp', 'two'); return make(m, '교점에서 두 방향 모두와 직각', '현재 l과 평면 P · O에서 만나는 서로 다른 m, n', 'two-in-plane-perpendicular-constraints-fix-one-normal-direction', statementDraw, statementFrame); });
  addPlan('s5-1', '수직 모서리', d => solidRelationPlan(d, 'edges'));
  addPlan('s5-2', '문과 바닥', d => { const m = statementData(d, 'door'); return make(m, '수직인 경첩을 포함한 문 돌리기', m.st.text, 'hinged-plane-retains-a-perpendicular-line', statementDraw, statementFrame); });
  addPlan('s5-2', '수직인 면', d => solidRelationPlan(d, 'perpendicular'));
  addPlan('s5-3', '두 교선', d => { const m = statementData(d, 'planes'); return make(m, '평행한 두 평면에서 생긴 교선', m.st.text, 'coplanar-intersection-lines-cannot-meet-between-disjoint-planes', statementDraw, statementFrame); });
  addPlan('s5-3', '평행한 면', d => solidRelationPlan(d, 'parallel'));

  function build(lab, state) {
    const G = typeof window === 'undefined' ? lab.api || lab.G : window.APL_SP, D = lab.scene?.sp;
    if (!G || !D || !recipes[D.id]) return [];
    const s = { ...copy(state), lessonOn: false, lessonEntry: false }, m = D.model(s), d = { G, D, s, m };
    return recipes[D.id].map((r, i) => ({ ...r.factory(d), id: `spatial-${D.id}-${i + 1}`, legacyLabel: r.legacyLabel, duration: r.duration }));
  }
  const registry = Object.fromEntries(Object.keys(recipes).map(id => [`g7-spatial/${id}`, build]));
  const lessonInfo = Object.fromEntries(Object.entries(recipes).map(([id, list]) => [`g7-spatial/${id}`, list.map(({ legacyLabel, duration }) => ({ legacyLabel, duration }))]));
  return { registry, lessonInfo, recipes, build, phase, lineRelation, lineIntersection, classifyEdges, planeThrough, planeDistance, planeGroups, spanningPanel, solidFaceRelations, statementData, statementPose, completeWallIntersection, foldAt, netSolid, fanPose };
});
