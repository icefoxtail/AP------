/**
 * Experimental observation correction; NOT a replacement for scene-smoke.
 * The original alpha>30, ink<200 and 2 CSS-pixel failures are retained verbatim.
 * This module is deliberately not connected to a workflow or production page.
 */
import { sampleInitialFigure } from './middle-initial-figure-contracts.mjs';

/** Analytic expected figure, independent of whether scene.draw emits any ink. */
export function deriveSparseFigureContract(f) {
  const key = `${f.unit}/${f.id}`, s = f.state || {}, cv = f.canvas || {};
  const applicable = ['alg-sequence/type8-0', 'alg-sequence/type8-1', 'alg-sequence/br-tree',
    'g7-surface-volume/sv2-6', 'g7-surface-volume/sv3-6', 'g7-surface-volume/sv6-1',
    'g8-pythagoras/py1-rot'].includes(key);
  const out = { applicable, key, contours: [], nodes: [], unknown: [], modelFacts: [] };
  if (!applicable) return out;
  // The shell initializes a scene with review steps at cursor 1. py1-rot keeps
  // that cursor while its explore renderer shows the original full triangle;
  // it is not an animation-progress value. The six other sparse initial models
  // below explicitly enter at cursor 0. Accept only each observed initial state.
  const initialCursor = key === 'g8-pythagoras/py1-rot' ? 1 : 0;
  if (f.tab !== 'explore' || f.step !== initialCursor || f.playing !== false) out.unknown.push('Only the completely observed original unplayed explore state is derived by this experiment.');
  const finite = x => typeof x === 'number' && Number.isFinite(x);
  const a = f.projection;
  if (!a || !['xx', 'xy', 'yx', 'yy', 'ox', 'oy'].every(k => finite(a[k]))) {
    out.unknown.push('Actual finite Board projection is unavailable.'); return out;
  }
  const project = p => ({ x: a.ox + a.xx * p.x + a.xy * p.y, y: a.oy + a.yx * p.x + a.yy * p.y });
  const poly = (name, points, density = .78, minimumSpan = 24) => out.contours.push({ name, points, density, minimumSpan });
  const line = (name, p, q, density = .78, minimumSpan = 24) => poly(name,
    Array.from({ length: 25 }, (_, i) => { const t = .08 + .84 * i / 24; return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t }; }), density, minimumSpan);
  const curve = (name, fn, lo, hi, density = .72) => poly(name,
    Array.from({ length: 37 }, (_, i) => fn(lo + (hi - lo) * i / 36)), density);
  const pi = Math.PI;
  const camera = () => {
    if (!finite(s.svYaw) || !finite(s.svPitch)) { out.unknown.push('Current 3D camera was not observed.'); return null; }
    const yaw = s.svYaw * pi / 180, pitch = s.svPitch * pi / 180;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    return { cy, sy, cp, sp, project: p => project({ x: p.x * cy - p.z * sy,
      y: -(p.y * cp - (p.x * sy + p.z * cy) * sp) }) };
  };
  if (f.unit === 'alg-sequence') {
    if (f.id === 'br-tree' && s.br_level !== 0) out.unknown.push('Only the original root before branching is derived.');
    const area = f.area;
    if (!area || ![area.w, area.h].every(finite)) { out.unknown.push('Usable design area is unavailable.'); return out; }
    const isBranch = f.id === 'br-tree', value = isBranch ? s.br_t : s.type8_targetA4;
    if (!finite(value) || !Number.isInteger(value)) { out.unknown.push('The given initial node value was not observed.'); return out; }
    // design() uses world y=usableHeight-designY. brFit puts its single root at
    // the center of the available width, not at an arbitrary visible ink blob.
    const cx = isBranch ? (area.w + 30) / 2 : area.w * .54;
    const cy = isBranch ? 30 : area.h * .18;
    const center = project({ x: cx, y: area.h - cy });
    const fs = finite(f.fontScale) ? f.fontScale : 1;
    const width = f.nodeTextWidth;
    if (!finite(width)) out.unknown.push('Given-node text width/identity was not captured by the old smoke observation.');
    const halfWidth = finite(width) ? (width + 16) / 2 : (String(value).length * 7 + 16) / 2;
    const halfHeight = 12 * fs;
    // Straight portions of the rounded box: no axis or diagram border can
    // substitute for this model-positioned given-node enclosure.
    for (const sign of [-1, 1]) {
      line(`given-node-${sign < 0 ? 'top' : 'bottom'}`,
        { x: center.x - Math.max(2, halfWidth - 7), y: center.y + sign * halfHeight },
        { x: center.x + Math.max(2, halfWidth - 7), y: center.y + sign * halfHeight }, .75, 3);
      line(`given-node-${sign < 0 ? 'left' : 'right'}`,
        { x: center.x + sign * halfWidth, y: center.y - halfHeight + 7 },
        { x: center.x + sign * halfWidth, y: center.y + halfHeight - 7 }, .75, 3);
    }
    out.nodes.push({ name: 'given-node-value', text: String(value).replace(/-/g, '−'), center, halfWidth, halfHeight, minimumGlyphPixels: 6 });
    out.modelFacts.push({ givenTerm: isBranch ? s.br_m + 1 : 4, value, expectedBranchesAtInitialStep: 0 });
  } else if (key === 'g8-pythagoras/py1-rot') {
    if (![s.pyWa, s.pyWb, s.pyRot].every(finite)) { out.unknown.push('Triangle side/rotation parameters are unavailable.'); return out; }
    const aa = Math.min(24, Math.max(2, Math.round(s.pyWa))), bb = Math.min(24, Math.max(2, Math.round(s.pyWb)));
    const center = { x: aa / 3, y: -bb / 3 }, theta = s.pyRot * pi / 180;
    const rotate = p => project({ x: center.x + (p.x - center.x) * Math.cos(theta) - (p.y - center.y) * Math.sin(theta),
      y: center.y + (p.x - center.x) * Math.sin(theta) + (p.y - center.y) * Math.cos(theta) });
    const A = rotate({ x: 0, y: -bb }), B = rotate({ x: aa, y: 0 }), C = rotate({ x: 0, y: 0 });
    line('triangle-AB-hypotenuse', A, B); line('triangle-BC-leg', B, C); line('triangle-CA-leg', C, A);
    out.modelFacts.push({ a: aa, b: bb, hypotenuseSquared: aa * aa + bb * bb, rotation: s.pyRot,
      minimumProjectedLeg: Math.min(Math.hypot(B.x - C.x, B.y - C.y), Math.hypot(A.x - C.x, A.y - C.y)) });
  } else {
    const cam = camera(); if (!cam) return out;
    const p3 = cam.project;
    if (f.id === 'sv2-6') {
      if (s.tpStarted !== false || s.tpMode !== 'surf') out.unknown.push('The original tetrahedron mode was not observed.');
      const v = [{ x: 0, y: 0, z: 0 }, { x: 6, y: 0, z: 0 }, { x: 0, y: 0, z: 8 }, { x: 0, y: 9, z: 0 }].map(p3);
      for (const [i, j] of [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]])
        line(`tetrahedron-edge-${'ABCD'[i]}${'ABCD'[j]}`, v[i], v[j], .37);
      out.modelFacts.push({ vertices: ['A(0,0,0)', 'B(6,0,0)', 'C(0,0,8)', 'D(0,9,0)'], independentVolume: 72 });
    } else if (f.id === 'sv3-6') {
      if (s.svShape6 !== 'full') { out.unknown.push('The hemisphere variant needs a separate contract.'); return out; }
      // The drawing uses radius2.2 world units; the problem radius is the label,
      // so changing the mathematical radius must not silently move these probes.
      const R = 2.2;
      curve('sphere-original-silhouette', t => project({ x: R * Math.cos(t), y: R * Math.sin(t) }), .07, 2 * pi + .07, .85);
      curve('sphere-equatorial-front-and-back', t => p3({ x: R * Math.cos(t), y: 0, z: R * Math.sin(t) }), .13, 2 * pi + .13, .42);
      out.modelFacts.push({ renderedRadius: R, mathematicalRadius: s.sAR, shape: 'sphere' });
    } else {
      if (s.jcKind !== 'hemi' || s.jcStarted !== false) { out.unknown.push('Only the original joined cylinder/hemisphere is derived.'); return out; }
      if (![s.jcK, s.jcH].every(finite)) { out.unknown.push('Joined-solid dimensions are unavailable.'); return out; }
      const k = Math.min(3, Math.max(1, Math.round(s.jcK))), H = Math.min(14, Math.max(2, Math.round(s.jcH)));
      const R = 3 * k, sc = 4 / Math.max(2 * R, H + R), r = R * sc, h = H * sc, y0 = -h / 2, yj = h / 2;
      for (const sign of [-1, 1]) line(`cylinder-${sign < 0 ? 'left' : 'right'}-generator`,
        p3({ x: sign * r * cam.cy, y: y0, z: -sign * r * cam.sy }),
        p3({ x: sign * r * cam.cy, y: yj, z: -sign * r * cam.sy }), .75);
      for (const [name, y] of [['base-rim', y0], ['joined-rim', yj]])
        curve(`cylinder-${name}`, t => p3({ x: r * Math.cos(t), y, z: r * Math.sin(t) }), .11, 2 * pi + .11, .4);
      const center = p3({ x: 0, y: yj, z: 0 });
      const horizontal = { x: a.xx * r, y: a.yx * r }, vertical = { x: a.xy * r, y: a.yy * r };
      curve('hemisphere-upper-silhouette', t => ({ x: center.x + horizontal.x * Math.cos(t) - vertical.x * Math.sin(t),
        y: center.y + horizontal.y * Math.cos(t) - vertical.y * Math.sin(t) }), .12, pi - .12, .78);
      out.modelFacts.push({ cylinderRadius: R, cylinderHeight: H, hemisphereRadius: R, renderedScale: sc });
    }
  }
  return out;
}

/** Pure evaluator; callers may provide saved immutable PNG RGBA and model state. */
export function evaluateSmokeSemanticCalibration(f, existingInitialContract = null) {
  const legacy = { ...f.legacy, alphaThreshold: 30, minimumInk: 200, clipToleranceCssPx: 2 };
  legacy.status = Number.isFinite(legacy.ink) && Array.isArray(legacy.clipped)
    ? (legacy.ink < 200 || legacy.clipped.length ? 'FAIL' : 'PASS') : 'UNKNOWN';
  const result = { version: 1, unit: f.unit, id: f.id, purpose: 'EXPERIMENT_ONLY_NO_LEGACY_GATE_OVERRIDE',
    legacy, gateOverride: false, status: 'UNKNOWN', checks: [], failures: [], unknown: [], existingInitialContract };
  const cv = f.canvas || {}, rgba = f.rgba, W = cv.cssWidth, H = cv.cssHeight;
  if (!rgba || rgba.length !== cv.width * cv.height * 4 || !(W > 0 && H > 0)) {
    result.unknown.push('Source-bound canvas bytes unavailable.'); return result;
  }
  const plan = deriveSparseFigureContract(f); result.contract = plan;
  const sx = cv.width / W, sy = cv.height / H;
  const at = (x, y) => {
    const ix = Math.round(x * sx), iy = Math.round(y * sy);
    if (ix < 0 || iy < 0 || ix >= cv.width || iy >= cv.height) return [0, 0, 0, 0];
    const i = (iy * cv.width + ix) * 4, al = rgba[i + 3];
    return [rgba[i] * al / 255, rgba[i + 1] * al / 255, rgba[i + 2] * al / 255, al];
  };
  const delta = (p, q) => Math.max(...p.map((v, i) => Math.abs(v - q[i])));
  const area = f.area || { x: 0, y: 0, w: W, h: H };
  const visible = p => Number.isFinite(p.x) && Number.isFinite(p.y)
    && p.x >= Math.max(2, area.x) && p.y >= Math.max(2, area.y)
    && p.x <= Math.min(W - 2, area.x + area.w) && p.y <= Math.min(H - 2, area.y + area.h)
    && (!f.viewport || (cv.rect.left + p.x * (cv.rect.width ?? W) / W >= 0 && cv.rect.top + p.y * (cv.rect.height ?? H) / H >= 0
      && cv.rect.left + p.x * (cv.rect.width ?? W) / W <= f.viewport.width
      && cv.rect.top + p.y * (cv.rect.height ?? H) / H <= f.viewport.height));
  for (const c of plan.contours) {
    const probes = c.points.map((p, i, all) => {
      const prev = all[Math.max(0, i - 1)], next = all[Math.min(all.length - 1, i + 1)];
      const dx = next.x - prev.x, dy = next.y - prev.y, len = Math.hypot(dx, dy) || 1;
      const sides = [-1, 1].map(sign => at(p.x - dy / len * 6 * sign, p.y + dx / len * 6 * sign));
      let contrast = 0, alpha = 0;
      for (let y = -2; y <= 2; y += .5) for (let x = -2; x <= 2; x += .5) {
        const v = at(p.x + x, p.y + y);
        if (v[3] > 30) { const d = Math.min(delta(v, sides[0]), delta(v, sides[1])); if (d > contrast) { contrast = d; alpha = v[3]; } }
      }
      return { x: p.x, y: p.y, inView: visible(p), contrast, alpha, visible: visible(p) && alpha > 30 && contrast >= 26 };
    });
    // Board pixels and visible CSS pixels differ under a CSS transform. A full
    // internal canvas must not disguise a physically tiny displayed diagram.
    const span = Math.hypot((Math.max(...c.points.map(p => p.x)) - Math.min(...c.points.map(p => p.x))) * (cv.rect?.width ?? W) / W,
      (Math.max(...c.points.map(p => p.y)) - Math.min(...c.points.map(p => p.y))) * (cv.rect?.height ?? H) / H);
    const count = probes.filter(p => p.visible).length;
    const pass = probes.every(p => p.inView) && span >= c.minimumSpan && count >= Math.ceil(c.density * probes.length);
    result.checks.push({ kind: 'required-model-contour', name: c.name, span, minimumSpan: c.minimumSpan,
      required: Math.ceil(c.density * probes.length), visible: count, pass, probes });
    if (!pass) result.failures.push(`required-model-contour-missing-clipped-or-tiny:${c.name}`);
  }
  for (const n of plan.nodes) {
    const backgrounds = [-1, 1].map(sign => at(n.center.x + sign * (n.halfWidth - 4), n.center.y));
    let pixels = 0;
    for (let y = -7; y <= 7; y++) for (let x = -Math.min(6, n.halfWidth - 5); x <= Math.min(6, n.halfWidth - 5); x++) {
      const v = at(n.center.x + x, n.center.y + y);
      if (v[3] > 30 && backgrounds.every(bg => delta(v, bg) >= 26)) pixels++;
    }
    const identity = (f.glyphs || []).some(g => g.text === n.text && Math.abs((g.x0 + g.x1) / 2 - n.center.x) < n.halfWidth
      && Math.abs((g.y0 + g.y1) / 2 - n.center.y) < n.halfHeight);
    const observed = f.glyphCaptureComplete === true;
    const pass = pixels >= n.minimumGlyphPixels && (!observed || identity);
    result.checks.push({ kind: 'required-given-node', name: n.name, expectedText: n.text, pixels, identityObserved: observed,
      identityMatches: observed ? identity : 'UNKNOWN', pass });
    if (!pass) result.failures.push(`required-given-node-missing-or-wrong:${n.name}`);
    if (!observed) result.unknown.push('Given-node emitted text identity was not captured.');
  }
  const glyphs = [...(f.glyphs || []), ...(f.fractionBars || [])];
  const clipped = glyphs.filter(g => Math.max(-g.x0, g.x1 - W, -g.y0, g.y1 - H) > 2);
  result.actualGlyphMeasurement = { glyphs: (f.glyphs || []).length, fractionBars: (f.fractionBars || []).length,
    tolerance: 2, clipped, complete: f.glyphCaptureComplete === true && f.fractionBarCaptureComplete === true };
  if (clipped.length) result.failures.push('actual-glyph-or-fraction-bar-clipped-over-2px');
  if (!result.actualGlyphMeasurement.complete) result.unknown.push('Full emitted-glyph and fraction-bar observation is incomplete.');
  if (existingInitialContract?.status === 'FAIL') result.failures.push(...existingInitialContract.failures.map(x => `existing-initial-contract:${typeof x === 'string' ? x : x.code}`));
  const priorRequired = f.unit === 'g7-circle-sector' && /^(f1-(star|ss2|lens|ex22|ring|semis|tri)|f3-leaf-len)$/.test(f.id)
    || f.unit === 'g9-circle' && f.id === 'c6-8';
  if (priorRequired && (!existingInitialContract?.applicable || !['PASS', 'FAIL'].includes(existingInitialContract.status)))
    result.unknown.push('The existing required F01/F3/tangent contract did not run.');
  result.unknown.push(...plan.unknown);
  result.unknown.push(...(f.unobservedFields || []));
  if (!plan.applicable && !priorRequired && legacy.ink < 200) result.unknown.push('No analytic sparse-figure contract exists for this low-ink scene.');
  result.status = result.failures.length ? 'FAIL' : result.unknown.length ? 'UNKNOWN' : 'PASS';
  return result;
}

/** Browser collector: observes actual glyphs, fraction bars and Board projection. */
export function captureSmokeCalibrationFrame() {
  const lab = window.lab, b = lab.board, c = b.ctx, glyphs = [], fractionBars = [], rawBoxes = [], annotations = [], draws = [];
  const saved = {}, stack = []; let path = [];
  const map = (x, y) => { const t = c.getTransform(); return { x: (t.a * x + t.c * y + t.e) * b.W / b.canvas.width,
    y: (t.b * x + t.d * y + t.f) * b.H / b.canvas.height }; };
  const opacity = style => { const a = /rgba\([^)]*,\s*([\d.]+)\s*\)/.exec(String(style)); return c.globalAlpha * (a ? +a[1] : 1); };
  const wrap = (name, fn) => { saved[name] = c[name]; c[name] = fn(saved[name]); };
  for (const name of ['fillText', 'strokeText']) wrap(name, original => function (value, x, y, maxWidth) {
    if (!b._bbox && !b.thumb && opacity(name === 'fillText' ? this.fillStyle : this.strokeStyle) > .01 && String(value).trim()) {
      const m = this.measureText(String(value)), sw = Number.isFinite(maxWidth) && maxWidth < m.width ? maxWidth / m.width : 1;
      const pad = name === 'strokeText' ? this.lineWidth / 2 : 0;
      const points = [x - m.actualBoundingBoxLeft * sw - pad, x + m.actualBoundingBoxRight * sw + pad]
        .flatMap(xx => [y - m.actualBoundingBoxAscent - pad, y + m.actualBoundingBoxDescent + pad].map(yy => map(xx, yy)));
      glyphs.push({ kind: name, text: String(value), parentText: stack.at(-1)?.text || null, invocationId: stack.at(-1)?.id ?? null,
        x0: Math.min(...points.map(p => p.x)), x1: Math.max(...points.map(p => p.x)),
        y0: Math.min(...points.map(p => p.y)), y1: Math.max(...points.map(p => p.y)) });
    }
    return original.apply(this, arguments);
  });
  wrap('beginPath', original => function () { path = []; return original.apply(this, arguments); });
  for (const name of ['moveTo', 'lineTo']) wrap(name, original => function (x, y) { path.push(map(x, y)); return original.apply(this, arguments); });
  wrap('stroke', original => function () {
    if (!b._bbox && stack.at(-1)?.fraction && opacity(this.strokeStyle) > .01 && path.length === 2) {
      const t = this.getTransform(), padX = this.lineWidth / 2 * Math.hypot(t.a, t.c) * b.W / b.canvas.width,
        padY = this.lineWidth / 2 * Math.hypot(t.b, t.d) * b.H / b.canvas.height;
      fractionBars.push({ kind: 'fraction-bar', text: stack.at(-1).text, invocationId: stack.at(-1).id,
        x0: Math.min(...path.map(p => p.x)) - padX, x1: Math.max(...path.map(p => p.x)) + padX,
        y0: Math.min(...path.map(p => p.y)) - padY, y1: Math.max(...path.map(p => p.y)) + padY });
    }
    return original.apply(this, arguments);
  });
  // The foreground fraction bar is a fillRect; a stroke is only its optional
  // halo. Observing strokes alone would falsely claim complete bar coverage.
  wrap('fillRect', original => function (x, y, w, h) {
    if (!b._bbox && stack.at(-1)?.fraction && opacity(this.fillStyle) > .01) {
      const points = [x, x + w].flatMap(xx => [y, y + h].map(yy => map(xx, yy)));
      fractionBars.push({ kind: 'fraction-bar-fill', text: stack.at(-1).text, invocationId: stack.at(-1).id,
        x0: Math.min(...points.map(p => p.x)), x1: Math.max(...points.map(p => p.x)),
        y0: Math.min(...points.map(p => p.y)), y1: Math.max(...points.map(p => p.y)) });
    }
    return original.apply(this, arguments);
  });
  const originalText = b._text;
  b._text = function (x, y, str, o = {}, screen) {
    const parts = this._fracSplit?.(String(str));
    const invocation = { id: annotations.length + 1, text: String(str), screen: !!screen,
      fraction: Boolean(parts), expectedFractionBars: parts ? parts.filter(part => part.t === undefined).length : 0,
      expectedGlyphs: (parts ? parts.flatMap(part => part.t === undefined ? [part.n, part.d] : [part.t]) : [String(str)]).filter(text => text.trim()),
      ignored: !!(this._bbox || this.thumb), completed: false };
    annotations.push(invocation);
    if (str != null && str !== '' && !screen && !this._bbox) {
      const size = (o.size || 13) * this.fs * this._ts(); c.save(); c.font = `${o.weight || 750} ${size}px ${this.font}`;
      const w = c.measureText(String(str)).width; c.restore(); const al = o.align || 'center', bl = o.baseline || 'alphabetic';
      const x0 = x + (al === 'center' ? -w / 2 : al === 'right' || al === 'end' ? -w : 0);
      const y0 = y + (bl === 'middle' ? -size / 2 : bl === 'top' || bl === 'hanging' ? 0 : bl === 'bottom' ? -size : -size * .8);
      rawBoxes.push({ text: String(str), invocationId: invocation.id, x0, x1: x0 + w, y0, y1: y0 + size });
    }
    stack.push(invocation);
    try { const value = originalText.apply(this, arguments); invocation.completed = true; return value; }
    catch (error) { invocation.error = String(error?.message || error); throw error; }
    finally { stack.pop(); }
  };
  const originalShapes = {};
  // The selected-face contract uses observed projected vertices in addition to
  // the model and pixels. This hook observes the same final render as the text.
  for (const name of ['path', 'point']) if (typeof b[name] === 'function') {
    originalShapes[name] = b[name];
    b[name] = function (value, options = {}) {
      if (!this._bbox && !this.thumb && ['p2-6-base-face', 'p2-6-common-vertex'].includes(options.ref)) {
        const points = (name === 'path' ? value : [value]).map(p => this.toS(p.x, p.y));
        draws.push({ method: name, ref: options.ref, points });
      }
      return originalShapes[name].apply(this, arguments);
    };
  }
  try { lab.render(); } finally {
    b._text = originalText;
    for (const [name, fn] of Object.entries(saved)) c[name] = fn;
    for (const [name, fn] of Object.entries(originalShapes)) b[name] = fn;
  }
  const canvas = b.canvas, rect = canvas.getBoundingClientRect(), rgba = c.getImageData(0, 0, canvas.width, canvas.height).data;
  const step = Math.min(31, Math.max(1, Math.round(canvas.width * canvas.height / 20360)));
  let ink = 0; for (let k = 3; k < rgba.length; k += 4 * step) if (rgba[k] > 30) ink++;
  const p0 = b.toS(0, 0), px = b.toS(1, 0), py = b.toS(0, 1);
  let nodeTextWidth;
  if (lab.id === 'alg-sequence') { c.save(); c.font = `800 ${12 * b.fs}px ${b.font}`;
    nodeTextWidth = c.measureText(String(lab.scene.id === 'br-tree' ? lab.s.br_t : lab.s.type8_targetA4).replace(/-/g, '−')).width; c.restore(); }
  return { unit: lab.id, id: lab.scene.id, tab: lab.tab, step: lab.s.step, playing: lab.s.playing,
    state: { ...lab.s }, fontScale: b.fs, area: b._area(), nodeTextWidth,
    projection: { xx: px.x - p0.x, xy: py.x - p0.x, yx: px.y - p0.y, yy: py.y - p0.y, ox: p0.x, oy: p0.y },
    canvas: { width: canvas.width, height: canvas.height, cssWidth: b.W, cssHeight: b.H,
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } },
    viewport: { width: window.innerWidth, height: window.innerHeight }, rgba,
    glyphs, fractionBars, rawBoxes, annotations, draws, annotationCaptureComplete: true, glyphCaptureComplete: true, fractionBarCaptureComplete: true,
    legacy: { ink, samplingStep: step, clipped: rawBoxes.filter(q => Math.max(-q.x0, q.x1 - b.W, -q.y0, q.y1 - b.H) > 2).map(q => q.text.slice(0, 20)) } };
}

// All dependencies are embedded in the function body, so Playwright can pass
// this function directly to page.evaluate without a window-global installation.
export const sampleSmokeSemanticCalibration = new Function(`return function sampleSmokeSemanticCalibration() {
  ${deriveSparseFigureContract.toString()}
  ${evaluateSmokeSemanticCalibration.toString()}
  ${captureSmokeCalibrationFrame.toString()}
  ${sampleInitialFigure.toString()}
  const frame = captureSmokeCalibrationFrame();
  return evaluateSmokeSemanticCalibration(frame, sampleInitialFigure());
}`)();
