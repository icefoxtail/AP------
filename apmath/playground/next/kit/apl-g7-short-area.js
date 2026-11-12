/* Grade 7 area proofs. Each plan captures the current production model once.
 * The proof has its own clock and drawing; it never starts a legacy lesson or
 * changes the explorer. Translations preserve y; rotations preserve all lengths.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root?.APLab) return;
  root.APLab.G7ShortArea = api;
  Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
  Object.assign(root.APLab.G7ShortInfo = root.APLab.G7ShortInfo || {}, api.lessonInfo);
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  const PI = Math.PI;
  const clamp = x => Math.max(0, Math.min(1, x));
  const phase = (t, a, z) => { const x = clamp((t - a) / (z - a)); return x * x * (3 - 2 * x); };
  const pt = (x, y) => ({ x, y });
  const mix = (a, b, t) => pt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
  const mid = (a, b) => mix(a, b, .5);
  const translate = (points, dx, dy = 0) => points.map(p => pt(p.x + dx, p.y + dy));
  const rotate = (points, center, angle) => points.map(p => {
    const x = p.x - center.x, y = p.y - center.y, c = Math.cos(angle), s = Math.sin(angle);
    return pt(center.x + c * x - s * y, center.y + s * x + c * y);
  });
  const polygonArea = points => Math.abs(points.reduce((s, p, i) => {
    const q = points[(i + 1) % points.length]; return s + p.x * q.y - p.y * q.x;
  }, 0)) / 2;
  const centroid = points => pt(points.reduce((s, p) => s + p.x, 0) / points.length, points.reduce((s, p) => s + p.y, 0) / points.length);
  const rectangle = (x, y, w, h) => [pt(x, y), pt(x + w, y), pt(x + w, y + h), pt(x, y + h)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const fraction = (n, d = 1) => {
    const g = gcd(Math.round(n), Math.round(d)) || 1;
    return d / g === 1 ? String(n / g) : `\\frac{${n / g}}{${d / g}}`;
  };
  const decimal = n => String(Math.round(n * 1e9) / 1e9);
  const frame = (label, formula = '', answer = false) => ({ label, formula, answer });
  const cm2 = value => `$${value}\\;\\mathrm{cm}^2$`;

  function prepare(b, points) {
    b.kind = 'figure'; b.aspect = '1:1'; b.setPanes(null);
    b.setInsets({ top: 48, right: 30, bottom: 80, left: 30 });
    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);
    b.setFocus({ x: [x0 - .13 * w, x1 + .13 * w], y: [y0 - .15 * h, y1 + .2 * h] });
  }
  const shape = (b, points, color = 'sky', alpha = .2, options = {}) => b.path(points, { close: true, color, width: 2.6, fill: color, fillAlpha: alpha, ...options });
  const line = (b, a, z, color = 'ink', options = {}) => b.path([a, z], { color, width: 2.5, ...options });
  const text = (b, p, value, color = 'ink', options = {}) => b.text(p, value, { color, align: 'center', baseline: 'middle', size: b.W < 560 ? 14 : 16, weight: 750, ...options });
  function dim(b, a, z, value, color = 'ink', side = 1, offset = 23) {
    const dx = z.x - a.x, dy = z.y - a.y, L = Math.hypot(dx, dy);
    if (L < 1e-9) return;
    const nx = -dy / L * side, ny = dx / L * side, k = b.k || 50;
    const p = pt(a.x + nx * offset / k, a.y + ny * offset / k), q = pt(z.x + nx * offset / k, z.y + ny * offset / k);
    line(b, p, q, color, { width: 1.6 });
    for (const r of [p, q]) line(b, pt(r.x - nx * 4 / k, r.y - ny * 4 / k), pt(r.x + nx * 4 / k, r.y + ny * 4 / k), color, { width: 1.6 });
    text(b, mid(p, q), value, color, { dx: nx * 9, dy: ny * 9 });
  }
  function altitude(b, apex, baseA, baseB, value, progress = 1, color = 'amber', side = -1) {
    const dx = baseB.x - baseA.x, dy = baseB.y - baseA.y, den = dx * dx + dy * dy;
    const u = ((apex.x - baseA.x) * dx + (apex.y - baseA.y) * dy) / den;
    const foot = pt(baseA.x + u * dx, baseA.y + u * dy);
    if (u < 0) line(b, baseA, foot, 'muted', { dash: [5, 5], width: 1.7 });
    if (u > 1) line(b, baseB, foot, 'muted', { dash: [5, 5], width: 1.7 });
    if (progress > 0) line(b, apex, mix(apex, foot, progress), color, { dash: [6, 4], width: 3 });
    if (progress > .98) {
      b.right(foot, apex, u < .5 ? baseB : baseA, { color, size: 10 });
      if (value) text(b, mid(apex, foot), value, color, { dx: side * 12, align: side < 0 ? 'right' : 'left' });
    }
    return foot;
  }
  const tagged = (b, points, names) => points.forEach((p, i) => text(b, p, names[i], 'ink', { dy: i === 0 ? -17 : 17, dx: i === 1 ? -10 : i === 2 ? 10 : 0 }));
  const outline = (b, points) => b.path(points, { close: true, color: 'muted', width: 1.7, dash: [5, 5], alpha: .65 });

  function paraPieces(m, progress) {
    return {
      fixed: [pt(m.S, 0), pt(m.B, 0), pt(m.B + m.S, -m.H), pt(m.S, -m.H)],
      cut: translate([pt(0, 0), pt(m.S, 0), pt(m.S, -m.H)], m.B * progress)
    };
  }
  function doubled(m, progress) {
    const source = m.geometry.trap || m.geometry.tri;
    return rotate(source, mid(source[1], source[2]), PI * progress);
  }
  function rhombPieces(m, progress) {
    return m.geometry.corners.map(piece => rotate(piece.tri, piece.c, PI * progress));
  }
  function railPose(m, progress, destination = m.x2) {
    const x = m.x + (destination - m.x) * progress;
    return [pt(x, -m.H), pt(0, 0), pt(m.B, 0)];
  }
  function ratioPieces(m) {
    const top = m.geometry.Av;
    return Array.from({ length: m.m + m.n }, (_, i) => [top, pt(i, 0), pt(i + 1, 0)]);
  }
  function roadPose(m, t) {
    const slide = phase(t, .8, 3), angle = PI / 2 * phase(t, 3.3, 4.8), close = phase(t, 4.8, 6.6);
    const center = pt(m.W / 2, m.H / 2), parts = [m.parts.UL, m.parts.UR, m.parts.LL, m.parts.LR];
    // During the second translation the figure is already rotated by 90°:
    // original-coordinate -y therefore becomes a horizontal +x displacement.
    return parts.map((part, i) => rotate(translate(part, i % 2 === 0 ? m.x * slide : 0, i >= 2 ? -m.x * close : 0), center, angle));
  }

  function drawRect(b, t, m, target) {
    const box = rectangle(0, 0, m.W, m.H);
    prepare(b, box); shape(b, box, 'sky', .08);
    const first = phase(t, .7, 2.5), rest = phase(t, 2.8, 5.2), visible = first * m.W + rest * m.W * (m.H - 1);
    for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) {
      const n = y * m.W + x, fill = clamp(visible - n);
      shape(b, rectangle(x, y, 1, 1), y === 0 ? 'amber' : 'green', .27 * fill, { color: 'muted', width: 1.2 });
    }
    shape(b, rectangle(0, 0, 1, 1), 'amber', .12, { width: 3 });
    dim(b, pt(0, m.H), pt(m.W, m.H), target === 'count' ? `한 줄 ${m.W}칸` : `가로 ${m.W} cm`, 'sky');
    dim(b, pt(m.W, 0), pt(m.W, m.H), target === 'count' ? `${m.H}줄` : `세로 ${m.H} cm`, 'sky', -1);
    if (t < 2.8) text(b, pt(0, 0), '한 칸 = 1 cm²', 'amber', { align: 'left', dy: -23 });
    if (target === 'area' && t > 5.2) shape(b, box, 'green', .07, { width: 3.4 });
  }
  function rectFrame(t, m, target) {
    if (t < .7) return frame('작은 정사각형 한 칸의 넓이는 1 cm²입니다.');
    if (t < 2.8) return frame(`한 줄을 채우면 ${m.W}칸입니다.`);
    if (t < 5.2) return frame(`같은 한 줄이 ${m.H}번 쌓입니다.`, `$${m.W}\\times${m.H}$`);
    if (t < 6.8) return frame(target === 'count' ? '겹치거나 빠진 칸 없이 모두 채웠습니다.' : '가로의 칸 수 × 세로의 줄 수가 넓이입니다.');
    return frame(target === 'count' ? '전체 칸 수를 곱셈으로 셉니다.' : '길이를 더한 둘레와 넓이의 단위를 구별합니다.', target === 'count' ? `$${m.W}\\times${m.H}=${m.A}$칸` : cm2(`${m.W}\\times${m.H}=${m.A}`), true);
  }

  function drawPara(b, t, m) {
    const progress = phase(t, 1.6, 4.8), pc = paraPieces(m, progress);
    prepare(b, m.geometry.para.concat(pc.cut)); outline(b, m.geometry.para);
    shape(b, pc.fixed, 'sky', .2); shape(b, pc.cut, progress > .98 ? 'green' : 'amber', .3);
    altitude(b, pt(m.S, -m.H), pt(0, 0), pt(m.B, 0), `${m.H} cm`, phase(t, .4, 1.5));
    dim(b, pt(0, 0), pt(m.B, 0), `밑변 ${m.B} cm`, 'sky');
    if (t >= 4.8) {
      dim(b, pt(m.S, -m.H), pt(m.S + m.B, -m.H), `${m.B} cm`, 'green', -1);
      text(b, centroid(rectangle(m.S, -m.H, m.B, m.H)), '직사각형', 'green');
    }
  }
  function paraFrame(t, m, target) {
    if (t < 1.6) return frame('밑변에 수직인 높이를 찾습니다. 옆변은 높이가 아닙니다.');
    if (t < 4.8) return frame(m.S === 0 ? '기울기가 0이므로 이미 직사각형입니다.' : '높이를 따라 자른 조각을 가로로 밀어 빈자리에 붙입니다.');
    if (t < 6.8) return frame(`밑변 ${m.B}, 높이 ${m.H}인 직사각형이 됩니다. 조각의 넓이는 그대로입니다.`);
    return target === 'build' ? frame('잘라 붙인 결과는 같은 넓이의 직사각형입니다.', `$${m.B}\\;\\mathrm{cm}\\times${m.H}\\;\\mathrm{cm}$`, true) : frame('평행사변형의 넓이 = 밑변 × 수직 높이', cm2(`${m.B}\\times${m.H}=${m.A}`), true);
  }

  function drawDouble(b, t, m, trapezoid) {
    const source = trapezoid ? m.geometry.trap : m.geometry.tri, progress = phase(t, .8, 4.7), copy = doubled(m, progress);
    prepare(b, source.concat(copy)); shape(b, source, 'sky', .2);
    if (t > .8) shape(b, copy, 'green', .24 * phase(t, .8, 1.2));
    const apex = trapezoid ? source[3] : source[2];
    altitude(b, apex, source[0], source[1], `${m.H} cm`, phase(t, .3, 1.3));
    dim(b, source[0], source[1], `${m.B} cm`, 'sky');
    if (trapezoid) dim(b, source[3], source[2], `${m.a} cm`, 'sky', -1);
    if (t >= 4.7) {
      const end = trapezoid ? pt(m.B + m.a, 0) : source[1];
      line(b, source[0], end, 'amber', { width: 4.5 });
      if (trapezoid) dim(b, source[1], end, `${m.a} cm`, 'green');
      text(b, centroid(source), '①', 'sky', { size: 21 });
      text(b, centroid(copy), '②', 'green', { size: 21 });
    }
  }
  function doubleFrame(t, m, target, trap) {
    if (t < .8) return frame(`같은 ${trap ? '사다리꼴' : '삼각형'}을 한 개 더 만듭니다.`);
    if (t < 4.7) return frame('복사본을 반 바퀴 돌립니다. 변의 길이와 넓이는 변하지 않습니다.');
    if (t < 6.8) return frame(trap ? '윗변과 아랫변이 이어져 새 밑변이 됩니다.' : '두 삼각형이 빈틈없이 평행사변형을 이룹니다.', trap ? `$(${m.B}+${m.a})\\times${m.H}$` : `$${m.B}\\times${m.H}$`);
    if (target === 'build') return frame('같은 두 도형이 평행사변형 한 개를 만듭니다.', `밑변 $${trap ? m.B + m.a : m.B}$ cm · 높이 $${m.H}$ cm`, true);
    if (target === 'base') return frame('붙인 밑변은 이어진 두 변의 합입니다.', `$${m.B}+${m.a}=${m.B + m.a}\\;\\mathrm{cm}$`, true);
    return frame('원래 도형 한 개는 전체 넓이의 절반입니다.', cm2(trap ? `(${m.B}+${m.a})\\times${m.H}\\div2=${decimal(m.S)}` : `${m.B}\\times${m.H}\\div2=${decimal(m.A)}`), true);
  }

  function drawRhomb(b, t, m) {
    const source = m.geometry.rh, corners = rhombPieces(m, phase(t, 1, 4.8)), box = rectangle(-m.X / 2, -m.Y / 2, m.X, m.Y);
    prepare(b, box.concat(corners.flat())); outline(b, box); shape(b, source, 'sky', .12);
    corners.forEach((p, i) => { shape(b, p, t < 4.8 ? 'amber' : 'green', .24); if (t < 6.6) text(b, centroid(p), String(i + 1), 'ink', { size: 14 }); });
    line(b, pt(-m.X / 2, 0), pt(m.X / 2, 0), 'sky', { dash: [6, 4] });
    line(b, pt(0, -m.Y / 2), pt(0, m.Y / 2), 'sky', { dash: [6, 4] });
    dim(b, box[3], box[2], `${m.X} cm`, 'sky'); dim(b, box[1], box[2], `${m.Y} cm`, 'sky', -1);
    if (t >= 4.8) text(b, pt(0, -m.Y / 2), '바깥 = 안쪽', 'green', { dy: -24 });
  }
  function rhombFrame(t, m, target) {
    if (t < 1) return frame('대각선을 가로·세로로 하는 직사각형을 둘러 그립니다.');
    if (t < 4.8) return frame('바깥 네 삼각형을 각각 반 바퀴 돌려 안쪽과 포갭니다.');
    if (t < 6.8) return frame('바깥 네 조각이 마름모를 정확히 덮습니다. 안팎의 넓이가 같습니다.');
    return target === 'fraction' ? frame('직사각형은 같은 넓이의 안쪽과 바깥쪽으로 나뉩니다.', '마름모 넓이 = 직사각형 넓이의 $\\frac{1}{2}$', true) : frame('두 대각선의 곱을 2로 나눕니다.', cm2(`${m.X}\\times${m.Y}\\div2=${decimal(m.A)}`), true);
  }

  function drawRail(b, t, m, target, obtuse = false) {
    const start = obtuse ? m.p : m.x;
    const end = obtuse ? (start < m.B / 2 ? m.B + 3 : -3) : m.x2;
    const base = { ...m, x: start }, progress = phase(t, 1.1, 5.4), tri = railPose(base, progress, end);
    const original = railPose(base, 0, end), final = railPose(base, 1, end);
    const left = Math.min(0, start, end) - .4, right = Math.max(m.B, start, end) + .4;
    prepare(b, original.concat(final));
    line(b, pt(left, -m.H), pt(right, -m.H), 'muted', { dash: [6, 4], width: 1.7 });
    line(b, pt(left, 0), pt(right, 0), 'muted', { dash: [6, 4], width: 1.7 });
    outline(b, original); shape(b, tri, 'sky', .22);
    line(b, tri[1], tri[2], 'green', { width: 4 });
    altitude(b, tri[0], tri[1], tri[2], target === 'transfer' ? 'h' : `${m.H} cm`, phase(t, .2, 1), 'amber', tri[0].x < m.B / 2 ? -1 : 1);
    dim(b, tri[1], tri[2], `BC = ${m.B} cm`, 'green');
    text(b, original[0], 'A', 'muted', { dy: -20 });
    if (progress > .05) text(b, tri[0], 'A′', 'sky', { dy: -20 });
    if (target === 'perimeter' && t > 2) {
      line(b, tri[0], tri[1], 'rose', { width: 4 }); line(b, tri[0], tri[2], 'amber', { width: 4 });
      if (t >= 5.4) text(b, pt(m.B / 2, -m.H), '옆변 두 길이가 달라져요', 'rose', { dy: -36, size: b.W < 560 ? 12 : 15 });
    }
    if (target === 'transfer') text(b, pt(m.B / 2, 0), `처음 넓이 ${decimal(m.A)} cm²`, 'sky', { dy: 54 });
  }
  function railFrame(t, m, target, obtuse = false) {
    if (t < 1.1) return frame(obtuse ? '수선의 발이 밖에 있어도 밑변의 연장선까지의 거리가 높이입니다.' : '밑변 BC와 평행한 직선 위에서 꼭짓점을 옮깁니다.');
    if (t < 5.4) return frame(target === 'perimeter' ? '밑변은 그대로지만 두 옆변의 길이는 움직임에 따라 달라집니다.' : '꼭짓점이 움직여도 밑변과 수직 높이는 그대로입니다.');
    if (t < 6.8) return frame(target === 'perimeter' ? '넓이와 둘레는 서로 다른 양입니다. 세 변의 합을 비교합니다.' : '두 삼각형은 같은 밑변과 같은 높이를 사용합니다.');
    if (target === 'perimeter') {
      const p1 = m.B + Math.hypot(m.x, m.H) + Math.hypot(m.B - m.x, m.H), p2 = m.B + Math.hypot(m.x2, m.H) + Math.hypot(m.B - m.x2, m.H);
      return frame(Math.abs(p1 - p2) < 1e-8 ? '이 두 위치에서는 둘레도 같습니다. 다른 위치에서는 달라질 수 있습니다.' : '넓이는 같아도 이 두 위치의 둘레는 다릅니다.', `둘레: $\\approx${p1.toFixed(2)}$ cm → $\\approx${p2.toFixed(2)}$ cm`, true);
    }
    if (target === 'transfer') return frame('높이의 수치를 몰라도 넓이가 같다는 것을 알 수 있습니다.', cm2(`S_{A'BC}=S_{ABC}=${decimal(m.A)}`), true);
    return frame('꼭짓점이 안쪽이든 바깥쪽이든 넓이는 같습니다.', cm2(`${m.B}\\times${m.H}\\div2=${decimal(m.A)}`), true);
  }

  function drawRight(b, t, m) {
    const [B, C, A] = m.geometry.tri, p = phase(t, .8, 3), copy = rotate(m.geometry.tri, mid(B, C), PI * p);
    const vanish = 1 - phase(t, 3.2, 4.2);
    prepare(b, m.geometry.tri.concat(t < 4.2 ? copy : [])); shape(b, m.geometry.tri, 'sky', .2);
    if (t > .8 && vanish > 0) shape(b, copy, 'green', .25 * vanish, { alpha: vanish });
    b.right(A, B, C, { color: 'sky', size: 14 });
    dim(b, B, A, `${m.a} cm`, 'sky', -1); dim(b, A, C, `${m.bb} cm`, 'sky', -1); dim(b, B, C, `${m.c} cm`, 'green');
    if (t > 4) altitude(b, A, B, C, t < 7 ? 'h = ?' : `h = ${decimal(m.h)}`, phase(t, 4, 5), 'amber', -1);
    if (t < 3.2) { line(b, B, A, 'amber', { width: 4 }); line(b, A, C, 'amber', { width: 4 }); }
    else line(b, B, C, 'green', { width: 4 });
    tagged(b, [A, B, C], ['A', 'B', 'C']);
  }
  function rightFrame(t, m) {
    if (t < .8) return frame('직각을 낀 두 변을 먼저 밑변과 높이로 봅니다.');
    if (t < 3.2) return frame('같은 삼각형을 돌려 붙이면 직사각형이 됩니다.', cm2(`${m.a}\\times${m.bb}\\div2=${decimal(m.S)}`));
    if (t < 5.2) return frame('이번에는 빗변을 밑변으로 잡고 수선 h를 그립니다.', `$S=${m.c}h\\div2$`);
    if (t < 7) return frame('같은 삼각형의 넓이를 두 방법으로 나타낸 식입니다.', `$${m.a}\\times${m.bb}=${m.c}h$`);
    return frame('넓이의 두 배를 빗변의 길이로 나눕니다.', `$h=\\frac{${m.a * m.bb}}{${m.c}}=${fraction(m.a * m.bb, m.c)}\\;\\mathrm{cm}$`, true);
  }

  function secondFoot(m) {
    const [B, C, D, A] = m.geometry.pg, dx = D.x - C.x, dy = D.y - C.y;
    const u = ((A.x - C.x) * dx + (A.y - C.y) * dy) / (dx * dx + dy * dy);
    return pt(C.x + u * dx, C.y + u * dy);
  }
  function drawTwoHeights(b, t, m) {
    const [B, C, D, A] = m.geometry.pg, foot = secondFoot(m);
    prepare(b, m.geometry.pg.concat([foot, pt(m.S, 0)])); shape(b, m.geometry.pg, 'sky', .2);
    dim(b, B, C, `${m.a} cm`, 'sky'); dim(b, C, D, `${m.c} cm`, 'rose');
    line(b, B, C, 'sky', { width: t < 3.4 ? 4.5 : 2.5 });
    altitude(b, A, B, C, `h₁ = ${m.h1}`, phase(t, .5, 1.8), 'amber', -1);
    if (t > 3.4) {
      line(b, C, D, 'rose', { width: 4.5 });
      altitude(b, A, C, D, t < 7 ? 'h₂ = ?' : `h₂ = ${decimal(m.h2)}`, phase(t, 3.4, 5), 'rose', 1);
    }
    text(b, centroid(m.geometry.pg), '같은 평행사변형', 'sky', { size: b.W < 560 ? 12 : 16 });
  }
  function heightsFrame(t, m, target) {
    if (t < 1.8) return frame('첫 밑변에 수직인 높이 h₁을 확인합니다.');
    if (t < 3.4) return frame('첫 밑변과 높이로 넓이를 구합니다.', cm2(`${m.a}\\times${m.h1}=${m.A}`));
    if (t < 5.2) return frame('새 밑변에 다시 수직인 높이 h₂를 그립니다.');
    if (t < 7) return frame('도형은 그대로이므로 두 넓이의 식이 같습니다.', `$${m.a}\\times${m.h1}=${m.c}h_2$`);
    return target === 'height' ? frame('전체 넓이를 새 밑변의 길이로 나눕니다.', `$h_2=${m.A}\\div${m.c}=${fraction(m.A, m.c)}\\;\\mathrm{cm}$`, true) : frame('어느 변을 밑변으로 잡아도 수직 높이를 쓰면 넓이가 같습니다.', `$${m.a}\\times${m.h1}=${m.c}\\times${fraction(m.A, m.c)}=${m.A}$`, true);
  }

  function drawWings(b, t, m, target) {
    const { Av: A, Bv: B, Cv: C, Dv: D, O } = m.geometry;
    const gap = .16 * m.B * phase(t, 4.8, 6.5), left = translate([A, B, O], -gap), right = translate([D, C, O], gap);
    prepare(b, [A, B, C, D].concat(left, right)); outline(b, [A, B, C, D]);
    if (t < 4.8) {
      shape(b, [A, B, C], 'sky', t < 2.5 ? .23 : .08);
      shape(b, [D, B, C], 'rose', t >= 2.5 ? .22 : .06);
    }
    const common = 1 - phase(t, 4.8, 6.5);
    shape(b, [B, C, O], 'green', .3 * common, { alpha: common });
    shape(b, left, t >= 4.8 ? 'amber' : 'sky', .22); shape(b, right, t >= 4.8 ? 'amber' : 'rose', .22);
    line(b, A, C, 'muted', { dash: [5, 4] }); line(b, B, D, 'muted', { dash: [5, 4] });
    if (t >= .8 && t < 4.8) {
      const apex = t < 2.5 ? A : D;
      altitude(b, apex, B, C, '같은 높이', 1, 'amber', apex.x < m.B / 2 ? -1 : 1);
      line(b, B, C, 'sky', { width: 4 });
    }
    text(b, A, 'A', 'ink', { dy: -18 }); text(b, B, 'B', 'ink', { dy: 20 });
    text(b, C, 'C', 'ink', { dy: 20 }); text(b, D, 'D', 'ink', { dy: -18 }); text(b, O, 'O', 'ink', { dx: 13, dy: -11 });
    if (t >= 4.8) { text(b, centroid(left), 'S₁', 'amber'); text(b, centroid(right), 'S₂', 'amber'); }
    if (target === 'area' && t < 4.8) text(b, mid(B, C), '초록 부분을 빼요', 'green', { dy: 48 });
  }
  function wingsFrame(t, m, target) {
    const X = fraction(m.B * m.H, 2), Y = fraction(m.B * m.B * m.H, 2 * (m.B + m.d)), W = fraction(m.B * m.d * m.H, 2 * (m.B + m.d));
    if (t < .8) return frame('대각선의 교점 O가 만든 양옆 삼각형을 비교합니다.');
    if (t < 4) return frame('△ABC와 △DBC는 밑변 BC와 높이가 같습니다.', '$S_{ABC}=S_{DBC}$');
    if (t < 6.5) return frame('넓이가 같은 두 삼각형에서 공통인 초록 △OBC를 뺍니다.');
    if (target === 'area') return frame('△ABC에서 △OBC를 빼면 △ABO가 남습니다.', cm2(`${X}-${Y}=${W}`), true);
    return frame('같은 넓이에서 같은 부분을 뺐으므로 양옆 넓이가 같습니다.', '$S_1=S_2$', true);
  }

  function drawRatio(b, t, m, target) {
    const { Av: A, Bv: B, Cv: C, D } = m.geometry, pieces = ratioPieces(m), number = (m.m + m.n) * phase(t, 2, 4.7);
    prepare(b, [A, B, C]); shape(b, [A, B, C], 'sky', .13); line(b, A, D, 'ink');
    pieces.forEach((p, i) => {
      const selected = target === 'left' ? i < m.m : target === 'right' ? i >= m.m : false;
      const color = t >= 5.6 && selected ? 'green' : i < m.m ? 'sky' : 'rose';
      if (i < number) shape(b, p, color, .26, { width: 1.7 });
    });
    altitude(b, A, B, C, '같은 높이 h', phase(t, .6, 1.8), 'amber', -1);
    dim(b, B, D, `${m.m}몫`, 'sky'); dim(b, D, C, `${m.n}몫`, 'rose');
    tagged(b, [A, B, C], ['A', 'B', 'C']); text(b, D, 'D', 'ink', { dy: 18 });
    if (target !== 'ratio') text(b, A, `전체 ${m.S} cm²`, 'sky', { dy: -42 });
    if (t >= 4.7 && t < 6.8) text(b, centroid(pieces[0]), '한 몫', 'amber', { size: 12 });
  }
  function ratioFrame(t, m, target) {
    if (t < 2) return frame('두 삼각형은 꼭짓점 A에서 밑변까지의 높이를 공유합니다.');
    if (t < 4.7) return frame('밑변을 같은 길이로 나누면 같은 넓이의 작은 삼각형이 생깁니다.');
    if (t < 6.8) return target === 'ratio' ? frame(`왼쪽은 ${m.m}몫, 오른쪽은 ${m.n}몫입니다.`) : frame('전체 넓이를 같은 몫으로 나눕니다.', cm2(`${m.S}\\div(${m.m}+${m.n})=${fraction(m.h, 2)}`));
    if (target === 'ratio') return frame('같은 높이에서는 넓이의 비가 밑변의 비와 같습니다.', `$S_{ABD}:S_{ADC}=${m.m}:${m.n}$`, true);
    const n = target === 'left' ? m.m : m.n, area = target === 'left' ? m.S1 : m.S2;
    return frame(`구하는 △${target === 'left' ? 'ABD' : 'ADC'}의 ${n}몫만 셉니다.`, cm2(`${fraction(m.h, 2)}\\times${n}=${decimal(area)}`), true);
  }

  function drawTrapSplit(b, t, m, target) {
    const { BL, BR, TL, TR } = m.geometry, both = target === 'both';
    if (both && t < 4.4) {
      const turn = t < 2.6 ? phase(t, .5, 2.6) : 1 - phase(t, 3, 4.4), copy = doubled(m, turn);
      prepare(b, m.geometry.trap.concat(copy)); shape(b, m.geometry.trap, 'sky', .22);
      if (t > .5) shape(b, copy, 'green', .23 * phase(t, .5, .8));
      dim(b, BL, BR, `${m.B}`, 'sky'); dim(b, TL, TR, `${m.a}`, 'sky', -1);
      altitude(b, TL, BL, BR, `${m.H}`, 1);
      return;
    }
    const begin = both ? 4.4 : .8, gap = Math.min(2, m.B * .2) * phase(t, begin, both ? 6.2 : 3.8);
    const first = [BL, BR, TL], second = translate([TL, TR, BR], gap);
    prepare(b, first.concat(second)); outline(b, m.geometry.trap);
    shape(b, first, 'sky', .2); shape(b, second, target === 'triangle' ? 'amber' : 'green', .26);
    dim(b, BL, BR, `${m.B} cm`, 'sky'); dim(b, second[0], second[1], `${m.a} cm`, 'green', -1);
    altitude(b, TL, BL, BR, `${m.H}`, 1, 'amber', -1);
    altitude(b, second[2], second[0], second[1], `${m.H}`, phase(t, both ? 5 : 3.8, both ? 6.5 : 5.2), 'amber', 1);
    text(b, second[0], 'A', 'ink', { dy: -18 }); text(b, second[1], 'D', 'ink', { dy: -18 }); text(b, second[2], 'C', 'ink', { dy: 18 });
    if (both && t >= 6.5) { text(b, centroid(first), '①', 'sky'); text(b, centroid(second), '②', 'green'); }
  }
  function trapSplitFrame(t, m, target) {
    if (target === 'triangle') {
      if (t < 3.8) return frame('대각선 AC를 따라 나누어 윗변 쪽 삼각형 ACD를 떼어 봅니다.');
      if (t < 5.2) return frame('밑변 AD와 BC가 평행하므로 점 C에서 AD까지의 높이는 같습니다.');
      if (t < 7) return frame(`구할 삼각형의 밑변은 ${m.a} cm, 높이는 ${m.H} cm입니다.`);
      return frame('윗변 쪽 삼각형의 넓이만 구합니다.', cm2(`${m.a}\\times${m.H}\\div2=${decimal(m.T2)}`), true);
    }
    if (t < 2.6) return frame('첫 방법: 같은 사다리꼴 두 개를 돌려 붙입니다.');
    if (t < 4.4) return frame('붙인 평행사변형의 넓이를 2로 나눕니다.', `$(${m.B}+${m.a})\\times${m.H}\\div2$`);
    if (t < 6.5) return frame('둘째 방법: 대각선으로 나눈 두 삼각형의 높이가 같습니다.');
    if (t < 7.8) return frame('각각의 밑변과 같은 높이를 사용합니다.', cm2(`${m.B}\\times${m.H}\\div2+${m.a}\\times${m.H}\\div2`));
    return frame('돌려 붙여 반으로 나누거나, 두 삼각형을 더해도 같은 넓이입니다.', cm2(`${decimal(m.T1)}+${decimal(m.T2)}=${decimal(m.S)}`), true);
  }

  function drawFrame(b, t, m) {
    const { tri, c1, c2, c3, Av, Bv, Cv } = m.geometry, remove = phase(t, 6, 7.4), gap = Math.min(1.4, m.W * .16) * remove;
    const corners = [translate(c1, -gap), translate(c2, -gap), translate(c3, gap)], box = rectangle(0, 0, m.W, m.H);
    prepare(b, box.concat(corners.flat()));
    for (let i = 0; i <= m.W; i++) line(b, pt(i, 0), pt(i, m.H), 'muted', { width: 1, alpha: .4 });
    for (let j = 0; j <= m.H; j++) line(b, pt(0, j), pt(m.W, j), 'muted', { width: 1, alpha: .4 });
    outline(b, box); shape(b, tri, remove > .98 ? 'green' : 'sky', .2);
    corners.forEach((p, i) => {
      const shown = phase(t, [1, 2.8, 4.4][i], [1.5, 3.3, 4.9][i]);
      shape(b, p, 'red', .25 * shown * (1 - .6 * remove), { alpha: 1 - .65 * remove, width: 1.8 });
      if (shown > .98) text(b, centroid(p), String(i + 1), 'red', { size: 17 });
    });
    dim(b, pt(0, m.H), pt(m.W, m.H), `${m.W}칸`, 'sky'); dim(b, pt(m.W, 0), pt(m.W, m.H), `${m.H}칸`, 'sky', -1);
    dim(b, pt(0, 0), Av, `${m.a}`, 'amber', 1, 21); dim(b, pt(0, m.H), Bv, `${m.x}`, 'amber', 1, 48);
    text(b, Av, 'A', 'ink', { dx: 15, dy: -8 }); text(b, Bv, 'B', 'ink', { dy: -15 }); text(b, Cv, 'C', 'ink', { dy: -19 });
  }
  function outerFrame(t, m) {
    if (t < 1) return frame('바깥 직사각형에서 세 귀퉁이를 빼면 파란 삼각형이 남습니다.', cm2(`${m.W}\\times${m.H}=${m.R}`));
    if (t < 2.8) return frame('귀퉁이 ①은 직각삼각형입니다.', cm2(`${m.W}\\times${m.a}\\div2=${decimal(m.t1)}`));
    if (t < 4.4) return frame('귀퉁이 ②의 세로 길이는 전체에서 위쪽 길이를 뺍니다.', cm2(`${m.x}\\times(${m.H}-${m.a})\\div2=${decimal(m.t2)}`));
    if (t < 6) return frame('귀퉁이 ③의 가로 길이도 남은 부분입니다.', cm2(`(${m.W}-${m.x})\\times${m.H}\\div2=${decimal(m.t3)}`));
    if (t < 7.4) return frame('겹치지 않는 세 귀퉁이를 모두 떼어 냅니다.');
    return frame('바깥 전체에서 귀퉁이의 합을 뺍니다.', cm2(`${m.R}-(${decimal(m.t1)}+${decimal(m.t2)}+${decimal(m.t3)})=${decimal(m.A)}`), true);
  }

  function drawRoad(b, t, m, target) {
    const pieces = roadPose(m, t), box = rectangle(0, 0, m.W, m.H), center = pt(m.W / 2, m.H / 2);
    const angle = PI / 2 * phase(t, 3.3, 4.8), currentBox = rotate(box, center, angle);
    prepare(b, (t < 3.3 ? currentBox : pieces.flat()).concat(pieces.flat()));
    if (t < 3.3) { shape(b, currentBox, 'red', .1 * (1 - phase(t, .8, 3))); outline(b, currentBox); }
    pieces.forEach((p, i) => shape(b, p, (t > .8 && t < 3 && i % 2 === 0) || (t > 4.8 && t < 6.6 && i >= 2) ? 'amber' : 'green', .23));
    if (t < 3.3) {
      dim(b, box[3], box[2], `${m.W} m`, 'sky'); dim(b, box[1], box[2], `${m.H} m`, 'sky', -1);
      const left = m.parts.UL[1].x;
      dim(b, pt(left, 0), pt(left + m.x, 0), `${m.x} m`, 'rose', -1, 20);
      dim(b, pt(0, m.h1), pt(0, m.h1 + m.x), `${m.x} m`, 'rose', 1, 19);
    }
    if (t >= 6.6) {
      const packed = rotate(rectangle(m.x, 0, m.W - m.x, m.H - m.x), center, PI / 2);
      dim(b, packed[0], packed[1], `${m.W - m.x} m`, 'green', -1);
      dim(b, packed[1], packed[2], `${m.H - m.x} m`, 'green', -1);
      if (target === 'road') text(b, centroid(packed), '잔디를 뺀 나머지가 길', 'rose', { size: b.W < 560 ? 12 : 15 });
    }
  }
  function roadFrame(t, m, target) {
    if (t < .8) return frame(m.mode ? '비스듬한 길의 폭은 가로로 잰 길이입니다.' : target === 'slanted' ? '현재 곧은 길에서 가로·세로로 잰 폭을 확인합니다.' : '땅에서 가로 길과 세로 길을 한 번씩 뺍니다.');
    if (t < 3.3) return frame('왼쪽 잔디 조각을 가로로 밀어 세로 길을 닫습니다.', `$${m.W}-${m.x}=${m.W - m.x}\\;\\mathrm{m}$`);
    if (t < 4.8) return frame('도형 전체를 제자리에서 90° 돌립니다. 넓이는 변하지 않습니다.');
    if (t < 6.6) return frame('다른 길도 가로로 밀어 붙입니다.', `$${m.H}-${m.x}=${m.H - m.x}\\;\\mathrm{m}$`);
    if (t < 7.5) return frame(target === 'slanted' ? '길이 기울어져도 가로·세로로 잰 폭이 같으면 같은 크기가 남습니다.' : '네 조각이 직사각형 한 개를 이룹니다.', `$(${m.W}-${m.x})\\times(${m.H}-${m.x})$`);
    return target === 'road' ? frame('전체 땅에서 모은 잔디밭의 넓이를 뺍니다.', `$${m.W * m.H}-${m.A}=${m.W * m.H - m.A}\\;\\mathrm{m}^2$`, true) : frame('길이 만나는 부분을 두 번 빼지 않고 잔디 조각을 모았습니다.', `$${m.W - m.x}\\times${m.H - m.x}=${m.A}\\;\\mathrm{m}^2$`, true);
  }

  // Every legacy label remains individually selectable. These descriptions are
  // about the captured live inputs, not the fixed numeric legacy lesson scripts.
  const spec = {
    'a1-rect': [['count', '칸세기', '한 줄씩 세는 직사각형', 8.6], ['area', '넓이공식', '길이에서 넓이로', 8.8]],
    'a2-para': [['build', '잘라붙이기', '높이를 따라 잘라 붙이기', 8.7], ['area', '넓이', '평행사변형의 밑변과 높이', 8.9]],
    'a3-tri': [['build', '붙인도형', '삼각형 두 개로 만드는 도형', 8.8], ['area', '넓이', '삼각형 한 개는 전체의 절반', 9]],
    'a4-trap': [['build', '붙인도형', '사다리꼴 두 개로 만드는 도형', 8.9], ['area', '넓이', '사다리꼴의 넓이', 9]],
    'a5-rhomb': [['fraction', '직사각형비', '마름모의 안쪽과 바깥쪽', 8.8], ['area', '넓이', '두 대각선으로 구하는 넓이', 9]],
    'a6-obt': [['preserve', '넓이유지', '밖으로 옮겨도 유지되는 넓이', 8.8], ['area', '넓이', '삼각형 바깥의 수직 높이', 9]],
    'b1-rt': [['height', '높이 h', '같은 넓이로 빗변의 높이 구하기', 9.2]],
    'b2-para': [['compare', '넓이 비교', '밑변을 바꾸어 비교하는 넓이', 9], ['height', '다른 높이', '새 밑변에 수직인 높이', 9.2]],
    'b3-rail': [['principle', '넓이 원리', '평행선 사이에서 움직이는 꼭짓점', 8.8], ['perimeter', '둘레', '넓이와 다른 둘레의 변화', 9.2], ['transfer', '넓이 문제', '높이를 몰라도 비교하는 넓이', 9]],
    'b4-wing': [['compare', '넓이 관계', '공통 부분을 뺀 양옆 삼각형', 8.8], ['area', '넓이 계산', '대각선 옆의 넓이 계산', 9]],
    'b5-ratio': [['ratio', '넓이의 비', '같은 높이에서 나누는 몫', 8.8], ['left', 'ABD 넓이', '왼쪽 삼각형의 몫', 9], ['right', 'ADC 넓이', '오른쪽 삼각형의 몫', 9]],
    'c1-trap': [['base', '붙인 밑변', '붙인 밑변의 두 길이', 8.8], ['both', '사다리꼴', '돌려 붙이기와 나누기', 9.8], ['triangle', '삼각형ACD', '윗변 쪽 삼각형의 넓이', 9]],
    'c2-frame': [['subtract', '바깥 빼기', '직사각형에서 세 귀퉁이 빼기', 9.6]],
    'c3-road': [['grass', '잔디밭', '길을 닫아 잔디밭 모으기', 9.4], ['slanted', '비스듬잔디', '가로로 잰 폭으로 잔디밭 모으기', 9.4], ['road', '길 넓이', '전체에서 잔디밭을 빼기', 9.6]]
  };
  const behavior = {
    'a1-rect': { draw: drawRect, frame: rectFrame, given: m => `가로 $${m.W}$ cm · 세로 $${m.H}$ cm · 한 칸 $1\\;\\mathrm{cm}^2$` },
    'a2-para': { draw: drawPara, frame: paraFrame, given: m => `밑변 $${m.B}$ cm · 수직 높이 $${m.H}$ cm` },
    'a3-tri': { draw: (b,t,m) => drawDouble(b,t,m,false), frame: (t,m,k) => doubleFrame(t,m,k,false), given: m => `밑변 $${m.B}$ cm · 수직 높이 $${m.H}$ cm` },
    'a4-trap': { draw: (b,t,m) => drawDouble(b,t,m,true), frame: (t,m,k) => doubleFrame(t,m,k,true), given: m => `윗변 $${m.a}$ cm · 아랫변 $${m.B}$ cm · 높이 $${m.H}$ cm` },
    'a5-rhomb': { draw: drawRhomb, frame: rhombFrame, given: m => `두 대각선 $${m.X}$ cm, $${m.Y}$ cm` },
    'a6-obt': { draw: (b,t,m,k) => k === 'area' ? drawDouble(b,t,m,false) : drawRail(b,t,m,k,true), frame: (t,m,k) => k === 'area' ? doubleFrame(t,m,k,false) : railFrame(t,m,k,true), given: m => `밑변 $${m.B}$ cm · 밑변 또는 연장선까지의 수직 높이 $${m.H}$ cm` },
    'b1-rt': { draw: drawRight, frame: rightFrame, given: m => `직각을 낀 두 변 $${m.a},${m.bb}$ cm · 빗변 $${m.c}$ cm` },
    'b2-para': { draw: drawTwoHeights, frame: heightsFrame, given: m => `밑변 $${m.a}$ cm · 그 높이 $${m.h1}$ cm · 다른 밑변 $${m.c}$ cm` },
    'b3-rail': { draw: drawRail, frame: railFrame, given: (m,k) => k === 'transfer' ? `두 직선은 평행 · 공통 밑변 BC · 처음 삼각형 넓이 $${m.A}\\;\\mathrm{cm}^2$` : `밑변 BC $${m.B}$ cm · 평행선 사이 거리 $${m.H}$ cm` },
    'b4-wing': { draw: drawWings, frame: wingsFrame, given: (m,k) => k === 'area' ? `AD ∥ BC · △ABC $${fraction(m.B*m.H,2)}\\;\\mathrm{cm}^2$ · △OBC $${fraction(m.B*m.B*m.H,2*(m.B+m.d))}\\;\\mathrm{cm}^2$` : 'AD ∥ BC · 두 대각선의 교점 O' },
    'b5-ratio': { draw: drawRatio, frame: ratioFrame, given: (m,k) => `BD : DC = $${m.m}:${m.n}$${k === 'ratio' ? ' · 꼭짓점 A를 공유' : ` · 전체 넓이 $${m.S}\\;\\mathrm{cm}^2$`}` },
    'c1-trap': { draw: (b,t,m,k) => k === 'base' ? drawDouble(b,t,m,true) : drawTrapSplit(b,t,m,k), frame: (t,m,k) => k === 'base' ? doubleFrame(t,m,k,true) : trapSplitFrame(t,m,k), given: m => `윗변 AD $${m.a}$ cm · 아랫변 BC $${m.B}$ cm · 높이 $${m.H}$ cm` },
    'c2-frame': { draw: drawFrame, frame: outerFrame, given: m => `모눈 한 변 1 cm · 바깥 $${m.W}\\times${m.H}$ · A는 위에서 ${m.a}칸, B는 왼쪽에서 ${m.x}칸` },
    'c3-road': { draw: drawRoad, frame: roadFrame, given: m => `땅 $${m.W}\\times${m.H}$ m · 두 길의 가로·세로 폭 $${m.x}$ m · ${m.mode ? '비스듬한' : '곧은'} 세로 길` }
  };
  function finite(value) {
    if (typeof value === 'number') return Number.isFinite(value);
    if (Array.isArray(value)) return value.every(finite);
    return !value || typeof value !== 'object' || Object.values(value).every(finite);
  }
  function bind(id, lab, state) {
    const ar = lab?.scene?.ar;
    if (!ar || ar.id !== id || typeof ar.model !== 'function') return null;
    const model = ar.model({ ...state });
    if (!finite(model)) return null;
    const result = { ...model };
    if (ar.geo) result.geometry = ar.geo(model);
    if (ar.pieces) { const p = ar.pieces(model); result.parts = { UL:p.UL, UR:p.UR, LL:p.LL, LR:p.LR }; }
    return finite(result) ? result : null;
  }
  const registry = {}, lessonInfo = {};
  for (const [id, recipes] of Object.entries(spec)) {
    const key = `g7-area/${id}`, behaviorForScene = behavior[id];
    lessonInfo[key] = recipes.map(([, legacyLabel,, duration]) => ({ legacyLabel, duration }));
    registry[key] = (lab, state) => {
      const model = bind(id, lab, state);
      if (!model) return [];
      return recipes.map(([target, legacyLabel, title, duration]) => ({
        id: `area-${id}-${target}`, label: legacyLabel, legacyLabel, title, duration,
        stops: id === 'c2-frame' ? [1,2.8,4.4,6,7.4] : id === 'c3-road' ? [.8,3.3,4.8,6.6,7.5] : id === 'c1-trap' && target === 'both' ? [.5,2.6,4.4,6.5,7.8] : [.8,2.8,4.8,6.8],
        model, given: behaviorForScene.given(model, target),
        draw: (b, t, m) => behaviorForScene.draw(b, t, m, target),
        frame: (t, m) => behaviorForScene.frame(t, m, target)
      }));
    };
  }
  return { polygonArea, translate, rotate, paraPieces, doubled, rhombPieces, railPose, ratioPieces, roadPose, secondFoot, bind, registry, lessonInfo };
});
