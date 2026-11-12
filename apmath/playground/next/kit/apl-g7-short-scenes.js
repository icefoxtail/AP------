/* Bound Grade 7 visual proofs. Geometry below is reused for drawings and tested
 * against independent integration; it never changes the explorer's state.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root?.APLab) return;
  root.APLab.G7ShortGeometry = api;
  Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI;
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const seg = (t, a, b) => ease((t - a) / (b - a));
  const pt = (x, y) => ({ x, y });
  const move = (points, dx, dy) => points.map(p => pt(p.x + dx, p.y + dy));
  const arc = (center, r, a, z, n = 96) => Array.from({ length: n + 1 }, (_, i) => pt(center.x + r * Math.cos(a + (z - a) * i / n), center.y + r * Math.sin(a + (z - a) * i / n)));
  const sector = (center, r, a, z) => [center, ...arc(center, r, a, z)];
  const rect = (x, y, w, h) => [pt(x, y), pt(x + w, y), pt(x + w, y + h), pt(x, y + h)];
  const polygonArea = points => Math.abs(points.reduce((s, p, i) => { const q = points[(i + 1) % points.length]; return s + p.x * q.y - p.y * q.x; }, 0)) / 2;
  const positive = n => typeof n === 'number' && Number.isFinite(n) && n > 0;
  const pretty = n => String(Math.round(n * 1e9) / 1e9);
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  function fraction(n, d = 1) { const g = gcd(Math.round(n), Math.round(d)) || 1; return d / g === 1 ? String(n / g) : `\\frac{${n / g}}{${d / g}}`; }
  const pi = n => n === 1 ? '\\pi' : n === 0 ? '0' : `${pretty(n)}\\pi`;
  function starModel(a) {
    if (!positive(a)) throw new RangeError('The square side must be positive.');
    const r = a / 2, corners = [pt(0, 0), pt(a, 0), pt(a, a), pt(0, a)];
    const pieces = corners.map((c, i) => ({ id: i + 1, center: c, a0: i * PI / 2, a1: (i + 1) * PI / 2, points: sector(c, r, i * PI / 2, (i + 1) * PI / 2) }));
    const star = [0, 3, 2, 1].flatMap(i => arc(corners[i], r, pieces[i].a0, pieces[i].a1));
    return { a, r, corners, pieces, star, square: rect(0, 0, a, a), area: a * a - PI * r * r, perimeter: TAU * r };
  }
  function starPositions(m, center, progress) {
    return m.pieces.map(p => ({ ...p, center: pt(p.center.x + (center.x - p.center.x) * progress, p.center.y + (center.y - p.center.y) * progress), points: move(p.points, (center.x - p.center.x) * progress, (center.y - p.center.y) * progress) }));
  }
  function leafModel(a) {
    if (!positive(a)) throw new RangeError('The leaf side must be positive.');
    const A = arc(pt(0, 0), a, PI / 2, 0), B = arc(pt(a, a), a, PI, PI * 1.5);
    const leaf = [...A, ...B.slice().reverse()];
    return { a, A, B, square: rect(0, 0, a, a), leaf, onlyA: [pt(0, 0), pt(a, 0), ...B.slice().reverse()], onlyB: [pt(a, a), pt(0, a), ...A], area: (PI / 2 - 1) * a * a };
  }
  function setup(b, a, stacked = b.W < 560) {
    b.kind = 'figure'; b.aspect = '1:1'; b.setPanes(null);
    b.setInsets({ top: 48, right: 24, bottom: 80, left: 24 });
    b.setFocus(stacked ? { x: [-.3 * a, 1.3 * a], y: [-.3 * a, 2.8 * a] } : { x: [-.3 * a, 2.85 * a], y: [-.35 * a, 1.5 * a] });
    return { stacked, destination: stacked ? pt(0, 1.6 * a) : pt(1.65 * a, 0) };
  }
  function shape(b, points, fill, alpha = .25, color = fill, width = 2.4) { b.path(points, { close: true, fill, fillAlpha: alpha, color, width }); }
  function label(b, p, text, color = 'ink', options = {}) { b.text(p, text, { color, size: b.W < 560 ? 15 : 17, weight: 750, align: 'center', baseline: 'middle', ...options }); }
  function mark(b, p, text, color) { b.point(p, { color, r: 13 }); label(b, p, text, 'paper', { size: 13 }); }
  const colors = ['sky', 'rose', 'amber', 'violet'];
  function drawStar(b, t, m, perimeter) {
    const { a, r } = m, { destination } = setup(b, a);
    const target = pt(destination.x + a / 2, destination.y + a / 2);
    const out = seg(t, .8, 3.2), back = perimeter ? 0 : seg(t, 4.3, 6.3), progress = out * (1 - back);
    const remove = perimeter ? 0 : seg(t, 6.3, 7.4);
    b.path(m.square, { close: true, color: 'ink', width: 2 });
    shape(b, m.star, 'green', .25, 'green', 2.5);
    m.pieces.forEach(p => {
      // The pale original is only an outline, not a second counted piece.
      b.path(p.points, { close: true, color: 'muted', alpha: .28, dash: [3, 5], width: 1.4 });
    });
    const current = starPositions(m, target, progress);
    current.forEach((p, i) => {
      if (remove < .999) {
        if (!perimeter) shape(b, p.points, colors[i], .34 * (1 - remove), colors[i], 2.6);
        else b.path(arc(p.center, r, p.a0, p.a1), { color: colors[i], width: 5 });
        if (t < 6.3) {
          const mid = (p.a0 + p.a1) / 2;
          label(b, pt(p.center.x + r * .58 * Math.cos(mid), p.center.y + r * .58 * Math.sin(mid)), String(i + 1), colors[i], { size: 18 });
        }
      }
    });
    label(b, pt(a / 2, -.18 * a), `한 변 ${pretty(a)} cm`);
    label(b, pt(a / 2, 1.19 * a), perimeter ? '별의 경계: 네 개의 호' : '정사각형에서 네 모서리를 빼기', 'green', { size: b.W < 560 ? 13 : 16 });
    if (t >= 3.2 && (perimeter || t < 4.4)) {
      b.path([target, pt(target.x + r, target.y)], { color: 'ink', width: 2 });
      label(b, pt(target.x, target.y + r + .19 * a), `반지름 ${pretty(r)} cm · 원 한 개`, 'ink', { size: 15 });
    }
    if (remove > .9) {
      // The four curved edges are the actual boundary of the remaining star.
      m.pieces.forEach(p => b.path(arc(p.center, r, p.a0, p.a1), { color: 'green', width: 4 }));
      label(b, pt(destination.x + a / 2, destination.y + a / 2), '남은 넓이', 'green', { size: 21 });
    }
  }
  function starFrame(t, m, perimeter) {
    if (t < .8) return { label: perimeter ? '같은 네 호를 끝까지 따라가 보세요.' : '전체는 정사각형, 빼는 것은 네 사분원입니다.', formula: '' };
    if (t < 3.2) return { label: '번호가 같은 조각을 모읍니다. 크기는 변하지 않습니다.', formula: '' };
    if (t < 4.3) return { label: perimeter ? '네 호가 원의 둘레를 빈틈없이 이룹니다.' : '90°인 사분원 네 개가 원 한 개를 이룹니다.', formula: '$90^\\circ\\times4=360^\\circ$' };
    if (perimeter) return { label: '별 모양의 둘레 = 이 원의 둘레', formula: `$2\\pi\\times${pretty(m.r)}=${pi(m.a)}\\;\\mathrm{cm}$` };
    if (t < 6.3) return { label: '같은 조각을 원래 모서리에 돌려놓아 뺄 위치를 확인합니다.', formula: '넓이: 정사각형 − 원 한 개' };
    return { label: '네 모서리를 빼고 별 모양만 남습니다.', formula: `넓이 $=${pretty(m.a * m.a)}-${pi(m.r * m.r)}\\;\\mathrm{cm}^2$` };
  }
  function drawLeaf(b, t, m) {
    const { a } = m, { destination: dest, stacked } = setup(b, a);
    const split = seg(t, .8, 2.6), assemble = seg(t, 3, 5), remove = seg(t, 5.4, 7.1);
    const dA = stacked ? pt(0, -.16 * a * split) : pt(-.16 * a * split, 0);
    const dB = stacked ? pt(0, .16 * a * split) : pt(.16 * a * split, 0);
    const sqOff = pt(-.12 * a * remove, -.12 * a * remove);
    const posA = pt(dA.x * (1 - assemble) + sqOff.x, dA.y * (1 - assemble) + sqOff.y);
    const posB = pt(dB.x * (1 - assemble) + sqOff.x, dB.y * (1 - assemble) + sqOff.y);
    const leafB = pt(dB.x * (1 - assemble) + dest.x * assemble, dB.y * (1 - assemble) + dest.y * assemble);
    b.path(m.square, { close: true, color: 'muted', width: 1.5, dash: [4, 5], alpha: .4 });
    const fillA = assemble > .98 ? 'sky' : 'amber', fillB = assemble > .98 ? 'sky' : 'rose';
    if (remove < .999) {
      shape(b, move(m.onlyA, posA.x, posA.y), fillA, .32 * (1 - remove));
      shape(b, move(m.leaf, posA.x, posA.y), assemble > .98 ? 'sky' : 'amber', .26 * (1 - remove));
      shape(b, move(m.onlyB, posB.x, posB.y), fillB, .32 * (1 - remove));
    }
    shape(b, move(m.leaf, leafB.x, leafB.y), 'violet', .34, 'violet', 3);
    if (t < 2.9) {
      label(b, pt(.22 * a + dA.x, .22 * a + dA.y), '①', 'amber', { size: 21 });
      label(b, pt(.78 * a + dB.x, .78 * a + dB.y), '②', 'rose', { size: 21 });
      label(b, pt(a / 2, 1.19 * a), `한 변 ${pretty(a)} cm`, 'ink');
    } else {
      label(b, pt(a / 2, 1.2 * a), remove < .1 ? '정사각형 한 겹' : '한 겹을 빼기', 'sky', { size: 15 });
      label(b, pt(dest.x + a / 2, dest.y + 1.2 * a), '남은 잎 한 겹', 'violet', { size: 15 });
      if (t >= 5.4) label(b, pt(a / 2, a / 2), '−', 'sky', { size: 40 });
    }
  }
  function leafFrame(t, m) {
    if (t < .8) return { label: '사분원 ①과 ②가 겹친 잎의 넓이를 구합니다.', formula: '' };
    if (t < 3) return { label: '각 사분원에는 잎이 한 겹씩 들어 있습니다.', formula: '사분원 ① + 사분원 ②' };
    if (t < 5.4) return { label: '세 부분은 정사각형 한 겹, 남은 부분은 잎 한 겹입니다.', formula: '사분원 두 개의 넓이 = 정사각형 넓이 + 잎 넓이' };
    return { label: '정사각형 한 겹만 빼면 잎 한 겹이 남습니다.', formula: `넓이 $=${fraction(m.a * m.a, 2)}\\pi-${pretty(m.a * m.a)}\\;\\mathrm{cm}^2$` };
  }
  const registry = {
    'g7-circle-sector/f1-star': (lab, s) => {
      const K = lab.scene.csKeys?.K;
      if (!K || !positive(s[K('a')])) return [];
      const model = starModel(s[K('a')]);
      return ['넓이', '둘레'].map((name, i) => ({ id: `star-${i ? 'perimeter' : 'area'}`, title: `별 모양의 ${name}`, label: name, legacyLabel: name, duration: i ? 8.4 : 8.8, stops: [.8, 3.2, 4.3, 6.3], model, given: `정사각형 한 변 $${pretty(model.a)}$ cm · 사분원 반지름 $${pretty(model.r)}$ cm`, draw: (b, t, m) => drawStar(b, t, m, !!i), frame: (t, m) => starFrame(t, m, !!i) }));
    },
    'g7-circle-sector/f3-leaf-area': (lab, s) => {
      if (!positive(s.f3a) || !Number.isInteger(s.f3a)) return [];
      const model = leafModel(s.f3a);
      return [{ id: 'leaf-area', title: '겹친 잎의 넓이', label: '넓이', legacyLabel: '넓이', duration: 8.8, stops: [.8, 2.6, 3, 5.4, 7.1], model, given: `정사각형 한 변 $${model.a}$ cm · 같은 반지름의 사분원 두 개`, draw: drawLeaf, frame: leafFrame }];
    }
  };
  return { arc, sector, rect, move, polygonArea, starModel, starPositions, leafModel, registry };
});
