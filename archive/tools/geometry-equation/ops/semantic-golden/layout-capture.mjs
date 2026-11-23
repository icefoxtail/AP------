// The javascript observer of the semantic golden table: verify-rendered-layout.mjs analyzeRenderedLayout on a hand-made capture (no browser), the way
// tests/verify-rendered-layout.test.mjs does it. The normal capture is built from the box the generator's own layout chose (label_layout.layout), so the
// figure the observer accepts is the figure the generator makes; a mutation then moves the label away from its tick.
export class MutationNotApplicable extends Error {}

// a capture with a figure of 620 x 500, one value label bound to the x axis (y=160) at x=100, the axis drawn as a line
export function axisValueCapture({box,source=[100,160],axis='x',strokes=[]}) {
  return {runtime: 'playwright-chromium', synthetic: false, svg: {x: 0, y: 0, width: 620, height: 500}, viewBox: {width: 620, height: 500}, safeMargin: 32,
    labels: [{id: 'interval-end-label', kind: 'GRAPH_ANNOTATION', priority: 0, value: '-π', client: box, bbox: {width: box.width, height: box.height}, missingGlyphCount: 0,
      axisValue: axis, axisSource: source, axisSourceClient: source}],
    geometry: [axis === 'x'
      ? {id: 'x-axis', kind: 'axis', role: 'axis', points: [[0, 160], [300, 160]], client: {x: 0, y: 160, width: 300, height: 0}}
      : {id: 'y-axis', kind: 'axis', role: 'axis', points: [[100, 0], [100, 300]], client: {x: 100, y: 0, width: 0, height: 300}}, ...strokes]};
}

// a figure with a segment, one label on a leader from the middle of that segment (label-room LEADER), other strokes and other labels: what the label-room generator makes, as the JS observer reads it
const stroke = (id, a, b) => ({id, kind: 'line', role: 'line', points: [a, b], client: {x: Math.min(a[0], b[0]), y: Math.min(a[1], b[1]), width: Math.abs(b[0] - a[0]), height: Math.abs(b[1] - a[1])}});
export function leaderCapture({box, leader, segment, strokes = [], boxes = []}) {
  const label = (id, client, value) => ({id, kind: 'COORDINATE_LABEL', priority: 0, value, client, bbox: {width: client.width, height: client.height}, missingGlyphCount: 0});
  return {runtime: 'playwright-chromium', synthetic: false, svg: {x: 0, y: 0, width: 620, height: 500}, viewBox: {width: 620, height: 500}, safeMargin: 32,
    labels: [label('measure-s', {x: box.x, y: box.y, width: box.width, height: box.height}, '6'), ...boxes.map((b, i) => label('other-label-' + i, b, '7'))],
    geometry: [stroke('segment-s', segment.a, segment.b),
      {...stroke('leader-measure-s', leader[0], leader[1]), kind: 'leader', role: 'leader', ownerLabelId: 'measure-s'},
      ...strokes.map(s => stroke(s.id, s.a, s.b))]};
}

// mutation functions: (capture, args) -> capture
export const MUTATIONS = {
  // the -π tick label detached from its tick: moved away from the axis by (dx, dy), it floats like a value of the y axis
  // the label's leader runs across a stroke that is not its own: a stroke is drawn between the label and its segment
  'leader-crosses-stroke': capture => {
    const leader = capture.geometry.find(g => g.kind === 'leader');
    if (!leader) throw new MutationNotApplicable('no leader in the capture');
    const [a, b] = leader.points, mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    return {...capture, geometry: [...capture.geometry, stroke('crossing-stroke', [mid[0] - 40, mid[1] - 3], [mid[0] + 40, mid[1] + 3])]};
  },
  // the label itself sits on another stroke
  'leader-label-onto-stroke': capture => {
    const label = capture.labels[0], c = label.client;
    if (!label) throw new MutationNotApplicable('no label in the capture');
    return {...capture, geometry: [...capture.geometry, stroke('stroke-under-label', [c.x - 20, c.y + c.height / 2], [c.x + c.width + 20, c.y + c.height / 2 + 2])]};
  },
  // another label is put over this one
  'leader-label-onto-label': capture => {
    const label = capture.labels[0], c = label.client;
    if (!label) throw new MutationNotApplicable('no label in the capture');
    const other = {...label, id: 'moved-label', value: '7', client: {x: c.x + 6, y: c.y + 4, width: c.width, height: c.height}};
    return {...capture, labels: [...capture.labels, other]};
  },
  'minus-pi-tick-as-y': (capture, {dx = 0, dy = 40} = {}) => {
    const label = capture.labels[0];
    if (!label) throw new MutationNotApplicable('no label in the capture');
    if (!dx && !dy) throw new MutationNotApplicable('the label would not move');
    const client = {...label.client, x: label.client.x + dx, y: label.client.y + dy};
    return {...capture, labels: [{...label, client}, ...capture.labels.slice(1)]};
  },
};

export async function observeCapture(capture, {codePrefix} = {}) {
  const {analyzeRenderedLayout} = await import('../../verify-rendered-layout.mjs');
  const errors = analyzeRenderedLayout(structuredClone(capture)).errors;
  return codePrefix ? errors.filter(error => error.startsWith(codePrefix)) : errors;
}
