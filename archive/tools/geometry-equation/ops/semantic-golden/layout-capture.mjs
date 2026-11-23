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

// mutation functions: (capture, args) -> capture
export const MUTATIONS = {
  // the -π tick label detached from its tick: moved away from the axis by (dx, dy), it floats like a value of the y axis
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
