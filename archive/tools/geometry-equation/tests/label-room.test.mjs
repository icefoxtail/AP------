// label-room.mjs (R1-2): the fixed order of the room steps, the ladder that starts only for a figure that failed with a room code, the self-target leader geometry, the stagger and margin helpers
// and the best-place record. Pure: no browser, no python. The renders of the example plans are in label-room-render.test.mjs (Chrome).
import test from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {ROOM_STEPS, orderSteps, runRoomLadder, selfLeader, ringCandidates, placeWithLeader, staggerRows, marginNeeded, degradeCollector, bestEffortRecord, overlapArea, boxesTouch, CONSTRUCTION_ROOM_CODES, CONSTRUCTION_ROOM_STEPS, constructionLeaderPlan, constructionMarginPlan, constructionDimensionPlan, CONSTRUCTION_DIMENSION_OFFSETS} from '../production/label-room.mjs';
import {ROOM_PADS} from '../production/phase2.mjs';
import {isPlaneFigure} from '../production/plane-marks.mjs';
import {STANDALONE_KINDS} from '../production/standalone-kinds.mjs';
import {solveStatChart, statChartSize} from '../production/stat-chart-v1.mjs';
import {placeLabels} from '../production/ellipse-figure-v1.mjs';

test('the steps are fixed and finite: stagger, wrap, leader, margin (margin last)', () => {
  assert.deepEqual([...ROOM_STEPS], ['STAGGER', 'WRAP', 'LEADER', 'MARGIN']);
  assert.deepEqual(orderSteps(['MARGIN', 'LEADER']), ['LEADER', 'MARGIN']);
  assert.throws(() => orderSteps(['SQUEEZE']), /ROOM_STEP_UNKNOWN/);
  assert.throws(() => orderSteps(['LEADER', 'LEADER']), /ROOM_STEP_REPEATED/);
});

test('every kind row that names room steps orders them, lists the failures that start them, and a kind without a row fails as before', () => {
  for (const kind of STANDALONE_KINDS) {
    if (!kind.room) continue;
    assert.deepEqual(orderSteps(kind.room.steps), kind.room.steps, `${kind.name}: steps are listed in the fixed order`);
    assert.ok(kind.room.codes.length > 0, `${kind.name}: a room row names the failures that start it`);
    assert.equal(typeof kind.room.apply, 'function');
  }
  assert.ok(STANDALONE_KINDS.some(kind => kind.room), 'at least one kind has a room row');
});

const first = (status, detail = {x: 1}) => ({measured: {m: 1}, composed: {status, detail}});
test('the ladder: walks the steps in order, stops at the first that composes, records it where the other fallbacks go', async () => {
  const row = {}, tried = [];
  const out = await runRoomLadder({kind: 'stat', steps: ['MARGIN', 'LEADER'], codes: ['STAT_LABEL_OUT_OF_BOUNDS'], first: first('STAT_LABEL_OUT_OF_BOUNDS'), row, clip: value => JSON.stringify(value),
    apply: async step => { tried.push(step); return step === 'MARGIN' ? {measured: {m: 2}, composed: {status: 'COMPOSED'}, target: {pad: 12}} : {composed: {status: 'X'}}; }});
  assert.deepEqual(tried, ['LEADER', 'MARGIN']);   // the fixed order, whatever order the row lists them in
  assert.equal(out.composed.status, 'COMPOSED');
  assert.deepEqual(row.fallback, [{kind: 'stat', from: '{"x":1}', to: 'ROOM_MARGIN', target: {pad: 12}}]);
});

test('the ladder: a figure that composed, or failed for another reason, is never passed to a step; when nothing composes the original failure stands and nothing is recorded', async () => {
  const never = async () => { throw Error('apply must not run'); };
  for (const f of [first('COMPOSED'), first('STAT_CHART_STATIC_AUDIT_FAIL')]) {
    const row = {};
    assert.equal(await runRoomLadder({kind: 'stat', steps: ['LEADER'], codes: ['STAT_LABEL_OUT_OF_BOUNDS'], first: f, row, apply: never}), f);
    assert.equal(row.fallback, undefined);
  }
  const row = {}, f = first('STAT_LABEL_OUT_OF_BOUNDS');
  const out = await runRoomLadder({kind: 'stat', steps: ['LEADER', 'MARGIN'], codes: ['STAT_LABEL_OUT_OF_BOUNDS'], first: f, row, apply: async () => null});
  assert.equal(out, f);
  assert.equal(row.fallback, undefined);
});

test('selfLeader: starts on the label box, ends on its OWN target (point, segment, curve), never crosses another stroke, label or leader', () => {
  const box = {x: 100, y: 100, width: 30, height: 14};
  const segment = {kind: 'segment', a: [60, 160], b: [200, 160]};
  const leader = selfLeader(box, segment, {minLength: 8, maxLength: 80});
  assert.ok(leader, 'a leader to the middle part of the segment');
  assert.ok(leader.a[1] >= box.y && leader.a[1] <= box.y + box.height && leader.a[0] >= box.x && leader.a[0] <= box.x + box.width, 'starts on the box');
  assert.equal(leader.b[1], 160, 'ends on the target segment');
  assert.ok(leader.b[0] >= 60 && leader.b[0] <= 200);
  // another stroke between the label and the target blocks it
  assert.equal(selfLeader(box, segment, {obstacleSegments: [{a: [90, 140], b: [140, 140]}]}), null);
  // another label in the way blocks it
  assert.equal(selfLeader(box, segment, {obstacleBoxes: [{x: 95, y: 125, width: 60, height: 10}]}), null);
  // an earlier leader crossing it blocks it
  assert.equal(selfLeader(box, segment, {placedLeaders: [{a: [90, 130], b: [140, 130]}]}), null);
  // too short and too long are refused
  assert.equal(selfLeader(box, {kind: 'point', x: 115, y: 118}, {minLength: 8}), null);
  assert.equal(selfLeader(box, {kind: 'point', x: 115, y: 400}, {maxLength: 64}), null);
  // a point leader can stop short of the dot
  const point = selfLeader(box, {kind: 'point', x: 115, y: 150}, {stopShort: 4.5});
  assert.ok(Math.abs(point.b[1] - 145.5) < 1e-6 || Math.abs(point.b[1] - 145.5) < 0.01);
  // a curve: the end is a sample of the curve nearest the box
  const curve = selfLeader(box, {kind: 'curve', points: [[50, 200], [115, 150], [180, 200]]});
  assert.deepEqual(curve.b, [115, 150]);
  assert.throws(() => selfLeader(box, {kind: 'region'}), /ROOM_TARGET_UNKNOWN/);
});

test('placeWithLeader: the nearest free candidate inside the bounds that has a self leader', () => {
  const target = {kind: 'point', x: 100, y: 100};
  const candidates = ringCandidates([100, 100], {width: 30, height: 14}, {distances: [20, 40], baseAngle: 0, angles: [0, 90, 180, -90]});
  const bounds = {x: 0, y: 0, width: 200, height: 200};
  const busy = [{x: 112, y: 92, width: 60, height: 16}];   // another label right of the point: the places on that side are taken
  const got = placeWithLeader(candidates, target, {bounds, boxes: busy, minLength: 6, maxLength: 80});
  assert.ok(got, 'a place outside the busy block');
  assert.ok(!boxesTouch(got.box, busy[0], 2));
  assert.deepEqual(got.leader.b, [100, 100]);
  assert.equal(placeWithLeader(candidates, target, {bounds: {x: 90, y: 90, width: 20, height: 20}}), null);
});

test('staggerRows: labels that touch take two rows alternately; a row that clears stays one row', () => {
  assert.deepEqual(staggerRows([{x: 0, width: 20}, {x: 40, width: 20}, {x: 80, width: 20}]), [0, 0, 0]);
  assert.deepEqual(staggerRows([{x: 0, width: 30}, {x: 20, width: 30}, {x: 40, width: 30}, {x: 100, width: 10}]), [0, 1, 0, 0]);
  // the order given is kept even when the labels are listed right to left
  assert.deepEqual(staggerRows([{x: 40, width: 30}, {x: 20, width: 30}, {x: 0, width: 30}]), [0, 1, 0]);
});

test('marginNeeded: how far each side must grow for the labels to sit inside the safe frame (whole px, never negative)', () => {
  const size = {width: 200, height: 100};
  assert.deepEqual(marginNeeded([{x: 20, y: 20, width: 20, height: 10}], size, 8), {left: 0, top: 0, right: 0, bottom: 0});
  assert.deepEqual(marginNeeded([{x: 4, y: 3.2, width: 20, height: 10}, {x: 190, y: 95, width: 15, height: 10}], size, 8), {left: 4, top: 5, right: 13, bottom: 13});
});

test('the best-place record: out of bounds and touching labels carry measures (px, px2, ratio) and say whether the label is cut off by the viewBox', () => {
  const c = degradeCollector();
  c.outOfBounds('STAT_LABEL_OUT_OF_BOUNDS', 'z-tick-0-label', {x: 208, y: 260, width: 40, height: 50}, {width: 548, height: 312}, 8);
  c.outOfBounds('STAT_LABEL_OUT_OF_BOUNDS', 'x-label', {x: 540, y: 100, width: 18, height: 14}, {width: 548, height: 312}, 8);
  c.touching('STAT_LABELS_TOO_CLOSE', 'a', 'b', {x: 0, y: 0, width: 20, height: 10}, {x: 10, y: 0, width: 20, height: 10});
  c.unplaced('SET_LABEL_NO_ROOM', 'set-name-A');
  c.observed('rendered-layout', ['LABEL_GEOMETRY_COLLISION:set-name-A:shade-0']);
  const [inside, cut, close, unplaced, observed] = c.items;
  assert.deepEqual([inside.overflowPx, inside.cutOff, inside.ratio], [6, false, 0.12]);
  assert.equal(cut.cutOff, true);
  assert.equal(cut.cutOffPx, 10);
  assert.deepEqual([close.overlapAreaPx2, close.smallerLabelAreaPx2, close.ratio], [100, 200, 0.5]);
  assert.deepEqual(unplaced, {code: 'SET_LABEL_NO_ROOM', labels: ['set-name-A']});
  assert.equal(observed.code, 'OBSERVER_ERRORS');
  assert.equal(overlapArea({x: 0, y: 0, width: 10, height: 10}, {x: 20, y: 0, width: 5, height: 5}), 0);
  const record = bestEffortRecord({kind: 'stat', failure: {code: 'STAT_LABEL_OUT_OF_BOUNDS'}, step: 'BEST', collector: c, file: 'q1-besteffort.svg'});
  assert.deepEqual([record.kind, record.step, record.svgFile, record.degrees.length], ['stat', 'BEST', 'q1-besteffort.svg', 5]);
});

test('a stat figure that fits is sized and spec-ed exactly as before; the MARGIN room only grows the rows below the axis (a stacked fraction is taller than a text row)', () => {
  const chart = {kind: 'NORMAL_CURVE', curves: [{id: 'S', mean: '0', sd: '12', label: 'S'}], ticks: [{x: '-8'}, {x: '0'}],
    shades: [{from: '-8', to: '0', color: 'WARM'}, {from: '0', to: null, color: 'BLUE'}], areaLabels: [{shade: 1, text: '0.5'}], zAxis: true};
  const model = solveStatChart(chart);
  const plain = statChartSize(model, {fontPx: 21});
  assert.deepEqual(statChartSize(model, {fontPx: 21, room: undefined, roomPad: undefined}), plain, 'no room asked: the same size');
  const margin = statChartSize(model, {fontPx: 21, room: 'MARGIN'});
  assert.equal(margin.width, plain.width);
  assert.ok(margin.height > plain.height, `margin ${margin.height} > plain ${plain.height}`);
  const padded = statChartSize(model, {fontPx: 21, room: 'MARGIN', roomPad: 12});
  assert.equal(padded.height, margin.height + 12);
});

test('ellipse: a segment length (6√3) with no near place goes on a leader that starts at the middle of its own segment; without the LEADER room it is refused as before, and no leader crosses another stroke', () => {
  const mid = [200, 150], own = {a: [140, 150], b: [260, 150]};
  const wall = (a, b) => ({a, b});
  // the owner segment and a closed ring round it with one gap (top side, between x=194 and x=206: narrower than a label)
  const segments = [wall(own.a, own.b), wall([150, 126], [194, 126]), wall([206, 126], [250, 126]), wall([150, 174], [250, 174]), wall([150, 126], [150, 174]), wall([250, 126], [250, 174])];
  const obstacles = {points: [], curve: [], segments};
  const layout = {size: {width: 400, height: 300}};
  const near = [];   // no near place at all (every one of the eight directions is blocked in the figure): the entry brings none
  const entry = () => ({key: 'measure-s1', role: 'measure', segmentId: 's1', text: '6√3', width: 34, height: 18, requiresLeader: false, ownerSegment: own, pointX: mid[0], pointY: mid[1], centerX: mid[0], centerY: mid[1], candidates: near});
  assert.throws(() => placeLabels([entry()], layout, obstacles), error => error.status === 'ELLIPSE_LABEL_NO_ROOM');
  const [placed] = placeLabels([entry()], layout, obstacles, {room: 'LEADER'});
  assert.ok(placed.leader, 'a leader');
  assert.ok(Math.abs(placed.leader.b[0] - mid[0]) < 1e-6 && Math.abs(placed.leader.b[1] - mid[1]) < 1e-6, 'it ends at the middle of its own segment');
  const {box} = placed;
  assert.ok(placed.leader.a[0] >= box.x - 1e-6 && placed.leader.a[0] <= box.x + box.width + 1e-6 && placed.leader.a[1] >= box.y - 1e-6 && placed.leader.a[1] <= box.y + box.height + 1e-6, 'it starts on the label box');
  assert.ok(box.y + box.height < 126, 'the label stands outside the ring, and its leader goes through the gap');
  assert.ok(placed.leader.a[0] > 194 && placed.leader.a[0] < 206 && Math.abs(placed.leader.b[0] - 200) < 1e-6);
  assert.equal(placed.text, '6√3', 'the exact value is written as it always was');
});

test('a tree gets roomPad px more at the top and at the bottom (the MARGIN step), nothing else changes', () => {
  const model = solveStatChart(JSON.parse(fs.readFileSync(new URL('./label-room-plans/stat-tree-branch-fraction.json', import.meta.url), 'utf8')).chart);
  const plain = statChartSize(model, {fontPx: 21});
  assert.equal(statChartSize(model, {fontPx: 21, roomPad: 12}).height, plain.height + 24);
  assert.equal(statChartSize(model, {fontPx: 21, roomPad: 12}).width, plain.width);
});

test('roomGrow: any stat chart gets that many px more frame at the right and bottom, and the same chart without it is sized exactly as before', () => {
  const model = solveStatChart(JSON.parse(fs.readFileSync(new URL('./label-room-plans/stat-normal-z-fraction.json', import.meta.url), 'utf8')).chart);
  const plain = statChartSize(model, {fontPx: 21});
  assert.deepEqual(statChartSize(model, {fontPx: 21, roomGrow: undefined}), plain);
  assert.deepEqual(statChartSize(model, {fontPx: 21, roomGrow: {right: 0, bottom: 6}}), {width: plain.width, height: plain.height + 6});
  assert.deepEqual(statChartSize(model, {fontPx: 21, roomGrow: {right: 9, bottom: 0}}), {width: plain.width + 9, height: plain.height});
});

// ---- the plane construction figure (R2): LEADER rewrites the placement of the marks that stand inside their mark, MARGIN grows the frame ---------------------------------------------------------------
const constructionPlan = () => ({capability: 'construction-spike-v1', mathPlan: {realization: {recipeId: 'PLANE_FIGURE_v1'}}, planeMarks: {
  regions: [{id: 'rABC', label: '48', labelName: '△ABC', unit: 'cm^2'}, {id: 'rK', label: '3', labelPlacement: 'LEADER'}, {id: 'rQ', label: '5', labelPlacement: 'AUTO'}, {id: 'rNo'}],
  angles: [{id: 'a1', label: 'x'}, {id: 'a2', label: 'y', noLabel: true}, {id: 'a3', label: '60', labelPlacement: 'LEADER'}],
  arcs: [{id: 'arc1', label: '8π'}], dimensions: [{id: 'd1', label: '5'}]}});

test('construction room: the steps are the two a plan can answer, in the fixed order, started only by the failure a label without a place gives', () => {
  assert.deepEqual([...CONSTRUCTION_ROOM_STEPS], ['LEADER', 'MARGIN']);
  assert.deepEqual(orderSteps(CONSTRUCTION_ROOM_STEPS), [...CONSTRUCTION_ROOM_STEPS]);
  assert.deepEqual([...CONSTRUCTION_ROOM_CODES], ['LAYOUT_INVENTORY_INCOMPLETE']);
  assert.deepEqual([...ROOM_PADS], [0.14, 0.24, 0.36]);
});

test('construction LEADER: a stuck region, angle or arc label that stands inside its mark goes out on its own leader; a label that already has a leader, no label at all or an unnamed row is left alone', () => {
  const plan = constructionPlan(), before = JSON.stringify(plan);
  const out = constructionLeaderPlan(plan, ['rABC-label', 'rK-label', 'a1-label', 'a2-label', 'a3-label', 'arc1-label', 'd1-label', 'A-name']);
  assert.equal(JSON.stringify(plan), before, 'the plan argument is never changed');
  assert.deepEqual(out.rows, [{array: 'regions', id: 'rABC', to: 'AUTO_LEADER'}, {array: 'angles', id: 'a1', to: 'LEADER'}, {array: 'arcs', id: 'arc1', to: 'LEADER'}]);
  assert.equal(out.plan.planeMarks.regions[0].labelPlacement, 'AUTO_LEADER', 'a region value takes a leader only when it does not fit inside');
  assert.equal(out.plan.planeMarks.regions[1].labelPlacement, 'LEADER');
  assert.equal(out.plan.planeMarks.angles[0].labelPlacement, 'LEADER');
  assert.equal(out.plan.planeMarks.angles[1].labelPlacement, undefined, 'an angle with noLabel has no label to lead out');
  assert.deepEqual(out.plan.planeMarks.dimensions, plan.planeMarks.dimensions, 'a dimension has no leader placement: untouched');
  assert.equal(constructionLeaderPlan(plan, ['rK-label', 'a3-label', 'd1-label', 'B-name']), null, 'no row that can take a leader: nothing to try');
  assert.equal(constructionLeaderPlan(plan, []), null);
  assert.equal(constructionLeaderPlan({mathPlan: {}}, ['rABC-label']), null);
  assert.deepEqual(constructionLeaderPlan(plan, [{id: 'rQ-label'}, 'rNo-label']).rows, [{array: 'regions', id: 'rQ', to: 'AUTO_LEADER'}], 'AUTO is the same as no placement; a region without a label has nothing to move');
});

test('construction MARGIN: only a plane figure gets roomPad, the frame padding of the figure grows with it, and the plan without it keeps its frame', () => {
  const plan = constructionPlan();
  assert.equal(constructionMarginPlan(plan, 0.24, isPlaneFigure).roomPad, 0.24);
  assert.equal(plan.roomPad, undefined, 'a copy');
  assert.equal(constructionMarginPlan({...plan, mathPlan: {realization: {recipeId: 'SOURCE_COORDINATE_AXES_v1'}}}, 0.24, isPlaneFigure), null, 'a coordinate figure keeps its own wider frame');
  assert.equal(constructionMarginPlan({...plan, graphPlan: {}}, 0.24, isPlaneFigure), null);
});

test('construction MARGIN, dimension lines: every dimension line that stands nearer than offsetPx moves out to it (an INLINE one stays on its segment), a copy; none that can move: null', () => {
  assert.deepEqual([...CONSTRUCTION_DIMENSION_OFFSETS], [40, 60]);
  const plan = {planeMarks: {dimensions: [{id: 'd1', label: '5'}, {id: 'd2', label: '6', offsetPx: 50}, {id: 'd3', label: '7', style: 'INLINE'}, {id: 'd4', label: '8', offsetPx: 24}]}};
  const before = JSON.stringify(plan), out = constructionDimensionPlan(plan, 40);
  assert.equal(JSON.stringify(plan), before);
  assert.deepEqual(out.planeMarks.dimensions.map(row => row.offsetPx), [40, 50, undefined, 40]);
  assert.equal(constructionDimensionPlan(out, 40), null, 'already out there');
  assert.equal(constructionDimensionPlan({planeMarks: {}}, 40), null);
  assert.equal(constructionDimensionPlan(constructionPlan(), 40).planeMarks.dimensions[0].offsetPx, 40);
});
