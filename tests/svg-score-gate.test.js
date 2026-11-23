// SVG publication score gate: table shape and scoring behaviour (archive/tools/geometry-equation/ops/score).
const assert = require('assert');
const path = require('path');
const { pathToFileURL } = require('url');

const dir = path.resolve(__dirname, '..', 'archive/tools/geometry-equation/ops/score');

(async () => {
  const score = await import(pathToFileURL(path.join(dir, 'score.mjs')).href);
  const table = score.loadTable();

  // table shape: one place for the numbers, version field, 90 to pass
  assert.strictEqual(table.passScore, 90);
  assert.strictEqual(table.baseScore, 100);
  assert.ok(/^score-table-v\d+$/.test(table.version));
  const tracks = new Set(['DEDUCT', 'WAIT_ENGINE', 'INDETERMINATE', 'BLOCK']);
  const stages = new Set(['post-render', 'placement', 'infra']);
  for (const [code, e] of Object.entries(table.codes)) {
    assert.ok(tracks.has(e.track), code + ' track');
    assert.ok(stages.has(e.stage), code + ' stage');
    if (e.track === 'DEDUCT') {
      assert.ok(Number.isFinite(e.fixed) && e.fixed > 0, code + ' needs a fixed deduction when the engine returns no degree');
      assert.ok(table.degreeKinds[e.degreeKind], code + ' degreeKind');
    }
  }
  // the agreed three lanes plus the block list keep their members (a code may be added, never dropped)
  for (const c of ['STAT_LABELS_TOO_CLOSE', 'ANGLE_LABEL_TOO_FAR', 'LABEL_GEOMETRY_COLLISION', 'LABEL_NEAREST_CURVE_MISMATCH', 'TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL', 'STAT_LABEL_OUT_OF_BOUNDS']) assert.strictEqual(score.classify(c).track, 'DEDUCT', c);
  for (const c of ['LAYOUT_INVENTORY_INCOMPLETE', 'SET_ELEMENT_NO_ROOM', 'SOLID_LABELS_NO_ROOM', 'AXIS_VALUE_LABEL_NO_PLACE', 'NUMBER_LINE_LABEL_TOO_LARGE']) assert.strictEqual(score.classify(c).track, 'WAIT_ENGINE', c);
  for (const c of ['WORKER_TIMEOUT', 'ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL', 'UNSUPPORTED_DISPLAY_ENVELOPE']) assert.strictEqual(score.classify(c).track, 'INDETERMINATE', c);
  for (const c of ['PUBLICATION_TEXT_NOT_READY', 'GEOMETRY_VIEWPORT_CLIPPING', 'OVERLAY_LINE_MISMATCH', 'SOME_UNLISTED_CODE_X']) assert.strictEqual(score.classify(c).track, 'BLOCK', c);

  const one = c => score.scoreFigure({ findings: [{ code: c }], hasSvg: true });
  // v2: a finding without a degree costs 3: three light flaws pass (91), four do not (88); repeats of one code add up with no cap
  assert.strictEqual(table.version, 'score-table-v3');
  const mild = one('STAT_LABELS_TOO_CLOSE');
  assert.strictEqual(mild.verdict, 'PASS');
  assert.strictEqual(mild.score, 97);
  const finding = c => ({ code: c });
  const three = score.scoreFigure({ findings: ['STAT_LABELS_TOO_CLOSE', 'ANGLE_LABEL_TOO_FAR', 'LEADER_CROSSING'].map(finding), hasSvg: true });
  assert.strictEqual(three.verdict, 'PASS');
  assert.strictEqual(three.score, 91);
  const four = score.scoreFigure({ findings: ['STAT_LABELS_TOO_CLOSE', 'ANGLE_LABEL_TOO_FAR', 'LEADER_CROSSING', 'ASYMPTOTE_LABEL_DETACHED'].map(finding), hasSvg: true });
  assert.strictEqual(four.verdict, 'FAIL_SCORE');
  assert.strictEqual(four.score, 88);
  const same = score.scoreFigure({ findings: [1, 2, 3, 4].map(i => ({ code: 'LABEL_GEOMETRY_COLLISION', id: 'a:s' + i })), hasSvg: true });
  assert.strictEqual(same.verdict, 'FAIL_SCORE');

  // a block is 0 whatever else is true; verdicts that cannot be scored carry no score
  assert.deepStrictEqual([one('OVERLAY_LINE_MISMATCH').verdict, one('OVERLAY_LINE_MISMATCH').score], ['BLOCK', 0]);
  const withBlock = score.scoreFigure({ findings: [{ code: 'STAT_LABELS_TOO_CLOSE' }, { code: 'PUBLICATION_TEXT_NOT_READY' }], hasSvg: true });
  assert.strictEqual(withBlock.verdict, 'BLOCK');
  assert.strictEqual(one('SET_ELEMENT_NO_ROOM').verdict, 'WAIT_ENGINE');
  assert.strictEqual(one('SET_ELEMENT_NO_ROOM').score, null);
  assert.strictEqual(one('WORKER_TIMEOUT').verdict, 'INDETERMINATE');
  const mixed = score.scoreFigure({ findings: [{ code: 'WORKER_TIMEOUT' }, { code: 'STAT_LABELS_TOO_CLOSE' }], hasSvg: true });
  assert.strictEqual(mixed.verdict, 'INDETERMINATE');

  // no SVG: nothing to publish, but the verdict the findings would give is kept
  const none = score.scoreFigure({ findings: [{ code: 'STAT_LABELS_TOO_CLOSE' }], hasSvg: false });
  assert.strictEqual(none.verdict, 'NO_SVG');
  assert.strictEqual(none.ifSvg, 'PASS');
  assert.strictEqual(none.tableVersion, table.version);

  // degree: viewBox clipping is a block, inside the viewBox but past the safe margin is a deduction
  const oobInside = score.scoreFigure({ findings: [{ code: 'STAT_LABEL_OUT_OF_BOUNDS', detail: { labelId: 'x', box: { x: 66, y: 10.76, width: 29.5, height: 64.4 }, size: { width: 793, height: 184 } } }], hasSvg: true });
  assert.strictEqual(oobInside.verdict, 'PASS');
  assert.strictEqual(oobInside.findings[0].basis, 'degree');
  const oobClipped = score.scoreFigure({ findings: [{ code: 'STAT_LABEL_OUT_OF_BOUNDS', detail: { labelId: 'x', box: { x: 600, y: 100, width: 60, height: 40 }, size: { width: 548, height: 293 } } }], hasSvg: true });
  assert.strictEqual(oobClipped.verdict, 'BLOCK');

  // degree: a label more than half covered is a block, a light touch is a small deduction
  assert.ok(score.overlapRatio({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 0, width: 10, height: 10 }) >= 0.5);
  const heavy = score.scoreFigure({ findings: [{ code: 'LABEL_OVERLAP', degree: { kind: 'overlap', d: 0.6 } }], hasSvg: true });
  assert.strictEqual(heavy.verdict, 'BLOCK');
  const light = score.scoreFigure({ findings: [{ code: 'LABEL_OVERLAP', degree: { kind: 'overlap', d: 0.1 } }], hasSvg: true });
  assert.strictEqual(light.verdict, 'PASS');
  assert.ok(light.score > 90 && light.score < 100);

  // stored engine results: wrappers are dropped, the engine's own code is used
  const fromWrapped = score.findingsFromResult({ status: 'FAILED', code: 'ANGLE_LABEL_TOO_FAR', detail: JSON.stringify({ status: 'PLANE_MARKS_AUDIT_FAIL', detail: { errors: ['ANGLE_LABEL_TOO_FAR:th'] } }) });
  assert.deepStrictEqual(fromWrapped.map(f => f.code), ['ANGLE_LABEL_TOO_FAR']);
  const fromPanel = score.findingsFromResult({ status: 'FAILED', code: 'NUMBER_LINE_LABEL_TOO_LARGE', detail: JSON.stringify({ status: 'COMPOSITE_PANEL_NOT_COMPOSED', detail: { panel: 0, status: 'NUMBER_LINE_LABEL_TOO_LARGE', detail: { labelId: 'r1-row-label', height: 42.57, rowHeight: 34 } } }) });
  assert.deepStrictEqual(fromPanel.map(f => f.code), ['NUMBER_LINE_LABEL_TOO_LARGE']);
  const rescored = score.scoreResult({ status: 'FAILED', code: 'NUMBER_LINE_LABEL_TOO_LARGE', detail: JSON.stringify({ status: 'COMPOSITE_PANEL_NOT_COMPOSED', detail: { panel: 0, status: 'NUMBER_LINE_LABEL_TOO_LARGE', detail: { labelId: 'r1-row-label', height: 42.57, rowHeight: 34 } } }) }, { hasSvg: false });
  assert.strictEqual(rescored.verdict, 'NO_SVG');
  assert.strictEqual(rescored.ifSvg, 'WAIT_ENGINE');
  const tick = score.findingsFromResult({ status: 'FAILED', code: 'TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL', detail: JSON.stringify({ status: 'RENDERED_LAYOUT_FAIL', detail: { errors: ['TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL:tick-x--1-label', 'TICK_LABEL_ALONG_AXIS_MISALIGNMENT:tick-x--1-label'] } }) });
  assert.deepStrictEqual(tick.map(f => f.code).sort(), ['TICK_LABEL_ALONG_AXIS_MISALIGNMENT', 'TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL']);

  // observer output: violations carry the measured degree, only on failure (a passing layout has no such field)
  const layoutMod = await import(pathToFileURL(path.resolve(__dirname, '..', 'archive/tools/geometry-equation/verify-rendered-layout.mjs')).href);
  const lab = (id, x, y, w, h) => ({ id, kind: 'POINT_NAME', priority: 3, client: { x, y, width: w, height: h }, bbox: { width: w, height: h }, effectiveFontPx: 14, baseFontPx: 14, font: 'x', missingGlyphCount: 0, owner: null, annotation: null, axisValue: null });
  const cap = labels => ({ synthetic: false, runtime: 'playwright-chromium', svg: { x: 0, y: 0, width: 200, height: 100 }, viewBox: { width: 200, height: 100 }, safeMargin: 0, coordinateScale: 1, labels, geometry: [], publicationProfile: 'x', fontStatus: 'loaded' });
  const clean = layoutMod.analyzeRenderedLayout(cap([lab('a', 10, 10, 40, 20), lab('b', 100, 12, 40, 20)]));
  assert.strictEqual(clean.status, 'PASS');
  assert.ok(!('violations' in clean));
  const bad = layoutMod.analyzeRenderedLayout(cap([lab('a', 10, 10, 40, 20), lab('b', 30, 12, 40, 20)]));
  assert.deepStrictEqual(bad.violations.map(v => v.code), ['LABEL_OVERLAP']);
  assert.strictEqual(bad.violations[0].degree.kind, 'overlap');
  assert.ok(bad.violations[0].degree.d > 0.4 && bad.violations[0].degree.d < 0.5);
  const clipped = layoutMod.analyzeRenderedLayout(cap([lab('c', 190, 50, 40, 20)]));
  assert.strictEqual(score.scoreFigure({ findings: clipped.violations, hasSvg: true }).verdict, 'BLOCK');
  const lightTouch = layoutMod.analyzeRenderedLayout(cap([lab('a', 10, 10, 40, 20), lab('b', 47, 10, 40, 20)]));
  assert.strictEqual(score.scoreFigure({ findings: lightTouch.violations, hasSvg: true }).verdict, 'PASS');

  // v3: a label crossed by a thin line keeps the light deduction; a label mostly hidden by shapes (one wide stroke, or several strokes together) is a block; a clean figure has no such field
  const line = (id, x1, y1, x2, y2, w) => ({ id, kind: 'line', points: [[x1, y1], [x2, y2]], client: { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) }, strokeWidthPx: w });
  const capG = (labels, geometry) => ({ ...cap(labels), geometry });
  const thin = layoutMod.analyzeRenderedLayout(capG([lab('a', 10, 10, 40, 20)], [line('s1', 30, 5, 30, 60, 1.5)]));
  assert.deepStrictEqual(thin.violations.map(v => v.code), ['LABEL_GEOMETRY_COLLISION']);
  assert.ok(thin.violations[0].degree.d > 0.02 && thin.violations[0].degree.d < 0.15, 'thin line hides a little: ' + thin.violations[0].degree.d);
  assert.strictEqual(score.scoreFigure({ findings: thin.violations, hasSvg: true }).verdict, 'PASS');
  const wide = layoutMod.analyzeRenderedLayout(capG([lab('a', 10, 10, 40, 20)], [line('s1', 5, 20, 150, 20, 16)]));
  assert.ok(wide.violations[0].degree.d > 0.6);
  assert.strictEqual(score.scoreFigure({ findings: wide.violations, hasSvg: true }).verdict, 'BLOCK');
  // three strokes each cover about a third of the label: no single one is a block, together they hide it
  const trio = layoutMod.analyzeRenderedLayout(capG([lab('a', 10, 10, 40, 20)], [line('s1', 18, 5, 18, 60, 9), line('s2', 30, 5, 30, 60, 9), line('s3', 42, 5, 42, 60, 9)]));
  assert.ok(trio.violations.every(v => v.degree.d < 0.5 && v.degree.labelHidden >= 0.5), JSON.stringify(trio.violations.map(v => v.degree)));
  assert.strictEqual(score.scoreFigure({ findings: trio.violations, hasSvg: true }).verdict, 'BLOCK');
  const free = layoutMod.analyzeRenderedLayout(capG([lab('a', 10, 10, 40, 20)], [line('s1', 120, 5, 120, 60, 1.5)]));
  assert.strictEqual(free.status, 'PASS');
  assert.ok(!('violations' in free));

  // PREFIX:REASON codes (phone display check): the reason decides
  const phone = r => score.classify('ARCHIVE_PHONE_DISPLAY_FAIL:' + r).track;
  for (const r of ['IMAGE_LOAD_FAIL', 'TARGET_OUTSIDE_SCREEN', 'TARGET_HORIZONTAL_OVERFLOW', 'TEXT_CLIPPED', 'GEOMETRY_VIEWPORT_CLIPPING', 'UNLISTED_REASON']) assert.strictEqual(phone(r), 'BLOCK', r);
  for (const r of ['LABEL_OVERLAP', 'LABEL_GEOMETRY_COLLISION']) assert.strictEqual(phone(r), 'DEDUCT', r);
  assert.strictEqual(phone('PAGE_ERROR'), 'INDETERMINATE');
  assert.strictEqual(score.scoreFigure({ findings: [{ code: 'ARCHIVE_PHONE_DISPLAY_FAIL', id: 'LABEL_OVERLAP' }], hasSvg: true }).verdict, 'PASS');

  console.log('svg-score-gate: ok');
})().catch(e => { console.error(e); process.exit(1); });
