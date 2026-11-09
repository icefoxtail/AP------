/**
 * Semantic, rendered-pixel contracts for the initial circle/sector figures.
 * Pass directly to page.evaluate(sampleInitialFigure). All helpers deliberately
 * live inside the function so it has no closure or runtime-source dependency.
 *
 * These checks supplement the generic renderer audit and independent visual QA.
 * They do not grade mathematical explanations or certify unlisted scenes.
 */
export function sampleInitialFigure() {
  const lab = window.lab;
  const unit = lab?.id || null, id = String(lab?.scene?.id || ''), tab = lab?.tab || null;
  const result = { version: 1, unit, id, tab, applicable: false, status: 'NOT_APPLICABLE', checks: [], failures: [],
    limitation: 'Analytic contour and region probes only; independent visual readability and mathematical review remain required.' };
  const names = ['star', 'ss2', 'lens', 'ex22', 'ring', 'semis', 'tri'];
  const f1 = id.startsWith('f1-') ? id.slice(3) : null;
  if (unit !== 'g7-circle-sector' || !(names.includes(f1) || id === 'f3-leaf-len')) return result;
  const s = lab.s || {}, progress = f1 ? Number(s[`f1_${f1}_t`] || 0) : Number(s.f3t || 0);
  if (tab !== 'problem' && (progress > 0.001 || s.playing)) {
    result.reason = 'The initial-figure contract does not assert transformed animation frames.';
    return result;
  }
  result.applicable = true;
  const b = lab.board, c = b?.canvas;
  const fail = (code, detail) => { result.failures.push({ code, detail }); };
  if (!c || !b.toS || !(b.W > 0) || !(b.H > 0) || !(c.width > 0) || !(c.height > 0)) {
    fail('semantic-canvas-unavailable', 'Canvas and a finite world-to-screen projection are required.');
    result.status = 'FAIL'; return result;
  }
  let pixels;
  try { pixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; }
  catch (e) { fail('semantic-pixels-unreadable', String(e?.message || e)); result.status = 'FAIL'; return result; }
  const rect = c.getBoundingClientRect(), sx = c.width / b.W, sy = c.height / b.H;
  const vw = window.innerWidth, vh = window.innerHeight;
  const distance = (x, y) => Math.max(...x.map((v, i) => Math.abs(v - y[i])));
  // Premultiplied channels include transparency. A transparent pixel's arbitrary
  // RGB values must never count as a visible colored region.
  const pixel = (x, y) => {
    const ix = Math.round(x * sx), iy = Math.round(y * sy);
    if (ix < 0 || iy < 0 || ix >= c.width || iy >= c.height) return [0, 0, 0, 0];
    const k = (iy * c.width + ix) * 4, a = pixels[k + 3];
    return [pixels[k] * a / 255, pixels[k + 1] * a / 255, pixels[k + 2] * a / 255, a];
  };
  const patch = (p, radius = 1) => {
    const values = [];
    for (let y = -radius; y <= radius; y++) for (let x = -radius; x <= radius; x++) values.push(pixel(p.x + x, p.y + y));
    return { values, mean: [0, 1, 2, 3].map(k => values.reduce((n, v) => n + v[k], 0) / values.length) };
  };
  const project = p => b.toS({ x: p[0], y: p[1] });
  const visible = p => Number.isFinite(p.x) && Number.isFinite(p.y)
    && p.x >= 2 && p.x <= b.W - 2 && p.y >= 2 && p.y <= b.H - 2
    && rect.left + p.x * rect.width / b.W >= 0 && rect.left + p.x * rect.width / b.W <= vw
    && rect.top + p.y * rect.height / b.H >= 0 && rect.top + p.y * rect.height / b.H <= vh;
  const contours = [], regions = [];
  const curve = (name, cx, cy, r, angles) => contours.push({ name, points: angles.map(a => {
    const t = a * Math.PI / 180;
    return { p: [cx + r * Math.cos(t), cy + r * Math.sin(t)], n: [Math.cos(t), Math.sin(t)] };
  }) });
  const line = (name, p, q) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy);
    contours.push({ name, points: [.18, .34, .56, .72, .85].map(t => ({ p: [p[0] + dx * t, p[1] + dy * t], n: [-dy / len, dx / len] })) });
  };
  const region = (name, p, q) => regions.push({ name, p, q });
  const value = (name, fallback) => { const v = Number(s[`f1_${f1}_${name}`]); return Number.isFinite(v) ? v : fallback; };
  const a = value('a', f1 === 'star' ? 10 : f1 === 'lens' ? 8 : f1 === 'ex22' ? 4 : 6);
  if (f1 === 'star') {
    [[0, 0, 0], [a, 0, 90], [a, a, 180], [0, a, 270]].forEach(([x, y, start], i) => curve(`quarter-${i + 1}`, x, y, a / 2, [17, 33, 51, 69, 78].map(t => start + t)));
    region('star-versus-cut', [.51 * a, .54 * a], [.17 * a, .16 * a]);
  } else if (f1 === 'ss2') {
    curve('original-quarter', a, a, a, [197, 213, 231, 249, 258]);
    curve('removed-semicircle', a, a / 2, a / 2, [113, 146, 174, 213, 247]);
    region('remainder-versus-semicircle', [.25 * a, .8 * a], [.82 * a, .51 * a]);
  } else if (f1 === 'lens') {
    curve('leaf-arc-one', a, 0, a, [107, 123, 142, 159, 171]);
    curve('leaf-arc-two', 0, a, a, [-17, -33, -51, -69, -78]);
    region('leaf-versus-corner', [.55 * a, .56 * a], [.12 * a, .72 * a]);
  } else if (f1 === 'ex22') {
    curve('quarter-cut', a, 0, a, [107, 123, 141, 159, 171]);
    curve('semicircle-cut', a, a / 2, a / 2, [113, 146, 174, 213, 247]);
    region('compound-cut-versus-remainder', [.25 * a, .45 * a], [.8 * a, .51 * a]);
  } else if (f1 === 'ring') {
    const R = value('R', 6), r = Math.min(value('r', 3), R - 1), theta = value('th', 90);
    const angles = theta >= 359.9 ? [23, 81, 149, 217, 293] : [.16, .32, .51, .7, .85].map(t => 90 - theta / 2 + theta * t);
    curve('outer-arc', 0, 0, R, angles); curve('inner-arc', 0, 0, r, angles);
    // Stay away from the vertical radius annotation in the 360-degree preset.
    const t = (90 - theta * .14) * Math.PI / 180;
    region('annulus-versus-center-cut', [(R + r) / 2 * Math.cos(t), (R + r) / 2 * Math.sin(t)], [r * .55 * Math.cos(t), r * .55 * Math.sin(t)]);
  } else if (f1 === 'semis') {
    const R = value('R', 6), r1 = Math.min(Math.max(value('r1', 3), 1), R - 1), r2 = R - r1;
    curve('left-small-semicircle', -R + r1, 0, r1, [27, 58, 83, 122, 153]);
    curve('right-small-semicircle', R - r2, 0, r2, [27, 58, 83, 122, 153]);
    const leftX = -R + r1;
    region('arbelos-versus-left-cut', [leftX, (r1 + Math.sqrt(R * R - leftX * leftX)) / 2], [leftX + .13 * r1, .68 * r1]);
  } else if (f1 === 'tri') {
    const ac = value('AC', 6), bc = value('BC', 8), diameter = Math.hypot(ac, bc), R = diameter / 2;
    const A = [-R, 0], B = [R, 0], C = [(ac * ac - bc * bc) / (2 * diameter), ac * bc / diameter];
    line('triangle-AC', A, C); line('triangle-BC', B, C);
    const mid = [(A[0] + C[0]) / 2, C[1] / 2], center = [C[0] / 3, C[1] / 3];
    const dx = C[0] - A[0], dy = C[1], len = Math.hypot(dx, dy);
    region('triangle-versus-segment', center, [mid[0] - dy / len * R * .18, mid[1] + dx / len * R * .18]);
  } else {
    const side = Number(s.f3a) || 6;
    curve('leaf-arc-one', side, side, side, [197, 213, 231, 249, 258]);
    curve('leaf-arc-two', 0, 0, side, [17, 33, 51, 69, 78]);
    region('leaf-versus-corner', [.51 * side, .47 * side], [.85 * side, .82 * side]);
  }
  for (const contour of contours) {
    const probes = contour.points.map(({ p, n }) => {
      const at = project(p), shifted = project([p[0] + n[0], p[1] + n[1]]);
      const dx = shifted.x - at.x, dy = shifted.y - at.y, len = Math.hypot(dx, dy);
      const normal = { x: dx / len, y: dy / len }, center = patch(at, 2);
      const sides = [-1, 1].map(sign => patch({ x: at.x + normal.x * 7 * sign, y: at.y + normal.y * 7 * sign }).mean);
      const strongestRidge = Math.max(...center.values.map(v => Math.min(distance(v, sides[0]), distance(v, sides[1]))));
      const boundaryContrast = distance(sides[0], sides[1]);
      const inView = visible(at), contrast = Math.max(strongestRidge, boundaryContrast);
      return { x: +at.x.toFixed(2), y: +at.y.toFixed(2), inView, contrast: +contrast.toFixed(2), visible: inView && contrast >= 26 };
    });
    const count = probes.filter(p => p.visible).length;
    const check = { kind: 'essential-contour', name: contour.name, requiredVisible: 3, visible: count, probes, pass: count >= 3 && probes.every(p => p.inView) };
    result.checks.push(check);
    if (!check.pass) fail('essential-contour-missing-or-clipped', contour.name);
  }
  for (const item of regions) {
    const p = project(item.p), q = project(item.q), delta = distance(patch(p).mean, patch(q).mean);
    const inView = visible(p) && visible(q), pass = inView && delta >= 20;
    result.checks.push({ kind: 'essential-region-contrast', name: item.name, contrast: +delta.toFixed(2), minimum: 20, inView, pass });
    if (!pass) fail('essential-regions-indistinguishable-or-clipped', item.name);
  }
  result.status = result.failures.length ? 'FAIL' : 'PASS';
  return result;
}
