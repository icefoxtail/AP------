// Label room (R1-2): what a figure does when a label has no place at the real font, the same for every kind.
// Until now each kind failed in its own way (SET_ELEMENT_NO_ROOM, STAT_LABEL_OUT_OF_BOUNDS, ELLIPSE_LABEL_NO_ROOM ...) or pushed the value out of the picture into the caption. The user's rule: a crowded or
// ambiguous label is pulled out on a leader line, never dropped. This file is the one place that says in what order a figure is rescued and the small geometry the steps share.
//
// The order is fixed and finite (SVG-ENGINE-REFACTOR-AGREED.md R1):
//   STAGGER  labels that stand in one row and touch take two rows (every second one lower)
//   WRAP     a label of several words is set on 2 to 4 lines
//   LEADER   the label stands in free space and a line leads to ITS OWN target (the point, the segment, the curve or the region it names), never to anything else
//   MARGIN   the frame grows (last, because it changes the size the Archive measures)
//
// Rules this file keeps:
//   * A ladder starts only for a figure that already failed with a room code. A figure that composes as written is never passed to it, so its bytes cannot change.
//   * When no step composes, the figure fails with the ORIGINAL failure, as it did before (no new code appears).
//   * Every step that rescued a figure is recorded in row.fallback as {kind, from, to:'ROOM_<STEP>', ...}, the same place and shape the other fallbacks use (ELLIPSE_FRAME_WIDEN ...).
//   * The independent observers never read this record to lower a bar: a leader label is checked by the ordinary rules (no overlap, distance, ownership). Nothing here is shared with them.
export const ROOM_STEPS = Object.freeze(['STAGGER', 'WRAP', 'LEADER', 'MARGIN']);
const rank = step => ROOM_STEPS.indexOf(step);

/** A kind row's own list of steps, in the fixed order. An unknown name or a repeated one is a bug in the table, so it throws. */
export function orderSteps(steps) {
  const seen = new Set();
  for (const step of steps) {
    if (rank(step) < 0) throw Error(`ROOM_STEP_UNKNOWN:${step}`);
    if (seen.has(step)) throw Error(`ROOM_STEP_REPEATED:${step}`);
    seen.add(step);
  }
  return [...ROOM_STEPS].filter(step => seen.has(step));
}

/**
 * Walk the steps of a kind in the fixed order until one composes.
 * first: {measured, composed} of the figure as written (composed.status is the room failure).
 * apply(step) -> {measured, composed, target?} (the step's own try, or null when the step has nothing to do for this figure).
 * Returns the first step's result that composed (and records it), else `first` untouched.
 */
export async function runRoomLadder({kind, steps, codes, first, apply, row, clip = value => value}) {
  if (!first || first.composed.status === 'COMPOSED' || !codes.includes(first.composed.status)) return first;
  for (const step of orderSteps(steps)) {
    const out = await apply(step, first);
    if (!out || !out.composed) continue;
    if (out.composed.status !== 'COMPOSED') continue;
    (row.fallback ??= []).push({kind, from: clip(first.composed.detail ?? first.composed.status), to: `ROOM_${step}`, ...(out.target === undefined ? {} : {target: out.target})});
    return out;
  }
  return first;
}

// ---- geometry the steps share -----------------------------------------------------------------------------------------------
const r6 = value => { const v = Math.round(value * 1e6) / 1e6; return v === 0 ? 0 : v; };
export const boxesTouch = (a, b, gap = 0) => a.x < b.x + b.width + gap && b.x < a.x + a.width + gap && a.y < b.y + b.height + gap && b.y < a.y + a.height + gap;
const nearestOnBox = (p, box) => [Math.max(box.x, Math.min(p[0], box.x + box.width)), Math.max(box.y, Math.min(p[1], box.y + box.height))];
function segmentsCross(a, b, c, d) {
  const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
}
function segmentHitsBox(a, b, box) {
  let t0 = 0, t1 = 1;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - box.x], [dx, box.x + box.width - a[0]], [-dy, a[1] - box.y], [dy, box.y + box.height - a[1]]]) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return false; continue; }
    const t = q / p;
    if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    if (t0 > t1) return false;
  }
  return true;
}
const pointOnSegment = (p, a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2));
  return [a[0] + t * dx, a[1] + t * dy];
};

/**
 * The target a label names, as the leader must end on it. kind: 'point' {x,y} | 'segment' {a,b} | 'curve' {points:[[x,y]...]} (a polyline or sampled curve).
 * Returns the end of a leader for a box: the point of the target nearest to the box (a point: the point itself; a segment: its nearest point; a curve: its nearest sample).
 */
export function targetEnd(target, box) {
  const centre = [box.x + box.width / 2, box.y + box.height / 2];
  if (target.kind === 'point') return [target.x, target.y];
  if (target.kind === 'segment') return pointOnSegment(centre, target.a, target.b);
  if (target.kind === 'curve') {
    let best = null;
    for (const p of target.points) { const d = Math.hypot(p[0] - centre[0], p[1] - centre[1]); if (!best || d < best.d) best = {d, p}; }
    return best ? best.p : null;
  }
  throw Error(`ROOM_TARGET_UNKNOWN:${target.kind}`);
}

/**
 * A leader from `box` to its own target, or null when there is none that reads clearly.
 * opts: {obstacleSegments:[{a,b}] other strokes the leader must not cross (the target's own stroke is not listed), obstacleBoxes:[box] other labels (and anything the leader must not run through),
 *        placedLeaders:[{a,b}] leaders already drawn, minLength=8, maxLength=64, stopShort=0 (a point leader stops this far before the dot)}
 * The leader starts on the box edge, ends on the target and never crosses another stroke, label or leader.
 */
export function selfLeader(box, target, opts = {}) {
  const {obstacleSegments = [], obstacleBoxes = [], placedLeaders = [], minLength = 8, maxLength = 64, stopShort = 0} = opts;
  const end0 = targetEnd(target, box);
  if (!end0) return null;
  const start = nearestOnBox(end0, box);
  let end = end0;
  const full = Math.hypot(end[0] - start[0], end[1] - start[1]);
  if (!(full > 0)) return null;
  if (stopShort > 0) end = [end[0] + (start[0] - end[0]) * stopShort / full, end[1] + (start[1] - end[1]) * stopShort / full];
  const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
  if (length < minLength || length > maxLength) return null;
  const a = [r6(start[0]), r6(start[1])], b = [r6(end[0]), r6(end[1])];
  for (const seg of obstacleSegments) if (segmentsCross(a, b, seg.a, seg.b)) return null;
  for (const other of placedLeaders) if (segmentsCross(a, b, other.a, other.b)) return null;
  for (const other of obstacleBoxes) if (segmentHitsBox(a, b, other)) return null;
  return {a, b, length: r6(length)};
}

/** Candidate boxes round a centre, nearest first: distances x angles (degrees from `baseAngle`). The caller keeps the first that is free and has a leader. */
export function ringCandidates(centre, size, {distances, angles = [0, 30, -30, 60, -60, 90, -90, 120, -120, 150, -150, 180], baseAngle = 0}) {
  const out = [];
  for (const distance of distances) for (const angle of angles) {
    const rad = (baseAngle + angle) * Math.PI / 180;
    out.push({x: r6(centre[0] + Math.cos(rad) * distance - size.width / 2), y: r6(centre[1] + Math.sin(rad) * distance - size.height / 2), width: size.width, height: size.height, distance});
  }
  return out;
}

/** The first candidate that is inside `bounds`, touches none of `boxes` and has a self leader; {box, leader} or null. */
export function placeWithLeader(candidates, target, {bounds, boxes = [], gap = 2, ...leaderOpts}) {
  for (const box of candidates) {
    if (bounds && (box.x < bounds.x || box.y < bounds.y || box.x + box.width > bounds.x + bounds.width || box.y + box.height > bounds.y + bounds.height)) continue;
    if (boxes.some(other => boxesTouch(box, other, gap))) continue;
    if ((leaderOpts.obstacleSegments ?? []).some(seg => segmentHitsBox(seg.a, seg.b, {x: box.x - 1, y: box.y - 1, width: box.width + 2, height: box.height + 2}))) continue;   // a label never sits on a stroke
    const leader = selfLeader(box, target, {...leaderOpts, obstacleBoxes: [...(leaderOpts.obstacleBoxes ?? []), ...boxes]});
    if (leader) return {box, leader};
  }
  return null;
}

/**
 * STAGGER: labels of one row (each {x, width}) that touch their neighbour (gap px between boxes) take two rows: every second label of those in the order along the row stands one row lower.
 * Returns the row (0 or 1) of each label, in the order given. A row that already clears returns all zeros (nothing to stagger).
 */
export function staggerRows(items, gap = 4) {
  const order = items.map((item, index) => ({item, index})).sort((a, b) => a.item.x - b.item.x);
  const rows = new Array(items.length).fill(0);
  let right = -Infinity, clear = true;
  for (const {item} of order) { if (item.x - right < gap) clear = false; right = Math.max(right, item.x + item.width); }
  if (clear) return rows;
  const lastRight = [-Infinity, -Infinity];
  for (const {item, index} of order) {
    let row = lastRight[0] + gap <= item.x ? 0 : 1;
    if (row === 1 && lastRight[1] + gap > item.x) row = lastRight[0] <= lastRight[1] ? 0 : 1;
    rows[index] = row;
    lastRight[row] = item.x + item.width;
  }
  return rows;
}

/** MARGIN: how far past the safe frame the labels go, per side (>= 0). Used to size the frame the figure grows to (never smaller than before). */
export function marginNeeded(boxes, size, safe) {
  const need = {left: 0, top: 0, right: 0, bottom: 0};
  for (const b of boxes) {
    need.left = Math.max(need.left, safe - b.x);
    need.top = Math.max(need.top, safe - b.y);
    need.right = Math.max(need.right, b.x + b.width - (size.width - safe));
    need.bottom = Math.max(need.bottom, b.y + b.height - (size.height - safe));
  }
  for (const side of Object.keys(need)) need[side] = Math.ceil(need[side]);
  return need;
}

// ---- the best place there is (when no step composes) -------------------------------------------------------------------------
// User rule 2026-11-23: a figure a student can read at 90 % is good enough. When every step above failed, a kind may still draw the figure with its labels at the best place it found and say so:
// the figure is NOT bound (the original failure is still reported, the observers keep their bars); the drawn SVG is kept beside the result (<item>-besteffort.svg) and row.bestEffort says
// what is wrong and by how much. A later gate scores that record; nothing here decides pass or fail.
export const overlapArea = (a, b) => Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
const round2 = value => Math.round(value * 100) / 100;

/** A collector a composer fills instead of throwing: degrade.out(code, label, measures) -> the record shape below. */
export function degradeCollector() {
  const items = [];
  return {
    items,
    /** A label that leaves the frame: how far (px) past the safe edge and relative to its own height. */
    outOfBounds(code, id, box, size, safe) {
      const over = Math.max(safe - box.x, safe - box.y, box.x + box.width - (size.width - safe), box.y + box.height - (size.height - safe), 0);
      const outside = Math.max(-box.x, -box.y, box.x + box.width - size.width, box.y + box.height - size.height, 0);   // past the viewBox itself: that part of the label is cut off
      items.push({code, labels: [id], overflowPx: round2(over), labelHeightPx: round2(box.height), ratio: round2(over / Math.max(1, box.height)), cutOffPx: round2(outside), cutOff: outside > 0});
    },
    /** Two labels that overlap: the shared area against the smaller label's area. */
    touching(code, idA, idB, boxA, boxB) {
      const area = overlapArea(boxA, boxB), smaller = Math.min(boxA.width * boxA.height, boxB.width * boxB.height);
      items.push({code, labels: [idA, idB], overlapAreaPx2: round2(area), smallerLabelAreaPx2: round2(smaller), ratio: round2(area / Math.max(1, smaller))});
    },
    /** A label that found no place at all: it stays where it was first put; `distance` is how far that is from its target (px) and `height` the label's height. */
    unplaced(code, id, extra = {}) { items.push({code, labels: [id], ...extra}); },
    /** Anything the independent checks said about the drawn bytes (codes only: they keep their own bars). */
    observed(source, errors) { if (errors?.length) items.push({code: 'OBSERVER_ERRORS', source, errors: errors.slice(0, 8)}); }
  };
}
/** The record row.bestEffort carries: the failure it stands for, the step that drew it and the measures. */
export const bestEffortRecord = ({kind, failure, step, collector, file}) => ({kind, failure, step, degrees: collector.items, svgFile: file});

// ---- the plane construction figure (a mathPlan figure with planeMarks) ------------------------------------------------------
// A construction figure did not take part in the ladder: its layout (label_layout.py) already tries every place and leader a label may have, and a figure whose label found none was left to fail with
// LAYOUT_INVENTORY_INCOMPLETE. The two steps below are the ones the plan itself can answer, always the same ones for every figure, never a label dropped:
//   LEADER  a label the plan lets stand inside its mark (a region value, an angle value, an arc length) takes the placement that leads it out on a leader to its OWN mark
//           (regions AUTO -> AUTO_LEADER: inside when it fits, outside on a leader from a dot inside the region when it does not; angles and arcs -> LEADER)
//   MARGIN  the dimension lines stand further out (CONSTRUCTION_DIMENSION_OFFSETS px from their points, default 24: a point name or a label between the figure and its dimension line gets room), then more empty frame round the figure (phase2 ROOM_PADS, a share of the figure's span): the labels that stand outside it get the room the tight .06 frame did not leave. The canvas itself does not change,
//           so the Archive measures the same size (the figure is a little smaller inside it).
// Both only rewrite the plan the way an author could have written it; the observers judge the result as for any plan, and a figure that composed as written never comes here.
export const CONSTRUCTION_ROOM_CODES = Object.freeze(['LAYOUT_INVENTORY_INCOMPLETE']);
export const CONSTRUCTION_ROOM_STEPS = Object.freeze(['LEADER', 'MARGIN']);
const labelIdOf = id => String(id?.id ?? id);

/**
 * The plan with the labels in `unresolved` (ids as the layout reports them: "<mark id>-label") led out on a leader, or null when no row of the plan can take one.
 * Returns {plan, rows:[{array, id, to}]}: `plan` is a copy (the argument is never changed), `rows` names what was rewritten.
 */
export function constructionLeaderPlan(plan, unresolved) {
  const marks = plan?.planeMarks;
  if (!marks || typeof marks !== 'object') return null;
  const stuck = new Set((unresolved ?? []).map(labelIdOf));
  const rules = [['regions', row => row.label !== undefined && (row.labelPlacement === undefined || row.labelPlacement === 'AUTO'), 'AUTO_LEADER'],
    ['angles', row => row.label !== undefined && row.noLabel !== true && (row.labelPlacement === undefined || row.labelPlacement === 'AUTO'), 'LEADER'],
    ['arcs', row => row.label !== undefined && (row.labelPlacement === undefined || row.labelPlacement === 'AUTO'), 'LEADER']];
  const rows = [], next = {...marks};
  for (const [array, wanted, to] of rules) {
    if (!Array.isArray(marks[array])) continue;
    let touched = false;
    const list = marks[array].map(row => {
      if (!row || typeof row !== 'object' || typeof row.id !== 'string' || !stuck.has(`${row.id}-label`) || !wanted(row)) return row;
      touched = true; rows.push({array, id: row.id, to});
      return {...row, labelPlacement: to};
    });
    if (touched) next[array] = list;
  }
  return rows.length ? {plan: {...plan, planeMarks: next}, rows} : null;
}

/** The plan with `roomPad` (one of phase2 ROOM_PADS) set: the frame round a plane figure grows. A copy; null for a plan that has no such frame. */
export function constructionMarginPlan(plan, pad, isPlane) {
  if (!plan?.mathPlan || plan.graphPlan || !isPlane(plan)) return null;
  return {...plan, roomPad: pad};
}

/** The dimension lines of a plan stand `offsetPx` from their points (the default is 24: a point name or a label between the figure and its dimension line has no room there). A copy; null when no dimension line can move out. */
export const CONSTRUCTION_DIMENSION_OFFSETS = Object.freeze([40, 60]);
export function constructionDimensionPlan(plan, offsetPx) {
  const rows = plan?.planeMarks?.dimensions;
  if (!Array.isArray(rows)) return null;
  let moved = false;
  const dimensions = rows.map(row => {
    if (!row || typeof row !== 'object' || row.style === 'INLINE' || (row.offsetPx ?? 24) >= offsetPx) return row;
    moved = true;
    return {...row, offsetPx};
  });
  return moved ? {...plan, planeMarks: {...plan.planeMarks, dimensions}} : null;
}
