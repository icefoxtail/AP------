// Standalone figure kinds: one table row per kind plus one shared runner (R1-1; render-plan.mjs used to carry this flow five times).
// Flow: check -> size -> measure -> (measure again) -> compose -> capture -> bind. Everything a kind does differently lives in its row:
//   capability  the plan capability the row answers to
//   stage       the stage name a failure before measuring reports (check, size)
//   check       plan -> exact model (a refusal throws; stage is the row's stage)
//   settle      the measure/compose policy (how often the figure is measured again and why); it returns {measured, composed}
// Stage names, thrown {stage,detail}, row.fallback, measure/capture arguments (runId strings), call order and call count are the behavior of the five
// blocks this replaced; golden-gate must show every golden item byte-identical.
//
//   room        (label-room.mjs) what the kind does when a label has no place: {codes: the compose failures that start it, steps: the steps it has in the fixed order STAGGER, WRAP, LEADER, MARGIN,
//               apply(step, c, first) -> {measured, composed, target?}|null (one try of that step), best(c, first, collector) -> the best place there is, drawn but never bound}.
//               A kind without a row `room` (or with no steps) fails as before. The ladder starts only after the figure failed, so a figure that composes keeps its bytes.
// To add a kind (see ops/golden-gate/README.md "새 종류를 표에 더하는 법"): write the figure module, add its row below, list it in ops/golden-gate/lib/kinds.mjs,
// add an example plan and a guide section.
import * as cap from './construction-archive-capture-v1.mjs';
import * as sdg from './set-diagram-v1.mjs';
import * as scf from './stat-chart-v1.mjs';
import * as ell from './ellipse-figure-v1.mjs';
import * as cfv from './container-fill-v1.mjs';
import * as lpf from './lattice-path-v1.mjs';
import {runRoomLadder,degradeCollector,bestEffortRecord} from './label-room.mjs';

// ---- measure/compose policies ----------------------------------------------------------------------------------------------
// c: {authored, model, identity, st(stage), measure(size, suffix), measureRaw(size, suffix), compose(extra), row, clip}

// A size that depends on the policy font (set mapping rows, container labels): measure again at the size that font gives until it is the size measured (at most 6 times).
const sameSizePolicy = (sizeOf) => async (c) => {
  let size = sizeOf(c.model);
  c.st('measure');
  let measured = await c.measure(size, '');
  for (let again = 1; again <= 6; again++) {
    const exact = sizeOf(c.model, {fontPx: measured.policy.baseFontPx});
    if (exact.width === size.width && exact.height === size.height) break;
    size = exact;
    measured = await c.measure(size, `-r${again}`);
  }
  c.st('compose');
  const composed = await c.compose(measured, {});
  return {measured, composed};
};

// A frame that grows with the font (long legend, x title, tree path probabilities): sizes only grow, up to 6 measurements; then a tree whose branch labels found no room is
// composed at a wider leaf pitch (composed.rowScale), measured and composed again, up to 3 times.
// rc: the label-room extras of a rescue try ({room, roomPad, degrade}); tag: what its measurement run ids carry. Both are empty for the figure as written, which therefore runs exactly the calls it always did.
const statSettle = async (c, rc = null, tag = '') => {
  const ctxOf = base => rc ? {...base, ...rc} : base;
  let size = scf.statChartSize(c.model, rc ? ctxOf(undefined) : undefined);
  c.st('measure');
  let measured = await c.measure(size, tag);
  for (let again = 1; again <= 6; again++) {
    const exact = scf.statChartSize(c.model, ctxOf({fontPx: measured.policy.baseFontPx}));
    if (exact.width <= size.width && exact.height <= size.height) break;
    size = {width: Math.max(size.width, exact.width), height: Math.max(size.height, exact.height)};
    measured = await c.measure(size, `${tag}-r${again}`);
  }
  c.st('compose');
  let composed = await c.compose(measured, {minSize: size, ...(rc ?? {})});
  for (let wider = 1; wider <= 3 && composed.status === 'COMPOSED' && composed.rowScale > 1 && !(composed.rowScale === (composed.settledScale ?? 1)); wider++) {
    const rowScale = composed.rowScale, exact = scf.statChartSize(c.model, ctxOf({fontPx: measured.policy.baseFontPx, rowScale}));
    size = {width: Math.max(size.width, exact.width), height: Math.max(size.height, exact.height)};
    measured = await c.measure(size, `${tag}-s${wider}`);
    composed = await c.compose(measured, {minSize: size, rowScale, ...(rc ?? {})});
    composed.settledScale = rowScale;
  }
  return {measured, composed};
};
const statPolicy = c => statSettle(c);

// The stat rescue (label-room): LEADER leads the normal-curve area labels out; MARGIN sizes the rows below the axis by the real label heights (a stacked fraction is taller than a text row) and, for a tree, widens the
// top and bottom margins by ROOM_PADS px; best draws the roomiest of those with the geometry checks turned into a record.
const ROOM_PADS = [0, 12, 28];
const statRoom = {
  codes: ['STAT_LABEL_OUT_OF_BOUNDS', 'STAT_LABELS_TOO_CLOSE', 'STAT_NORMAL_AREA_LABEL_NO_ROOM', 'STAT_NORMAL_CURVE_NAME_NO_ROOM', 'STAT_BRANCH_LABEL_NO_ROOM', 'STAT_VALUE_LABEL_NO_ROOM', 'STAT_DOT_DEVIATION_NO_ROOM'],
  steps: ['LEADER', 'MARGIN'],
  async apply(step, c) {
    const kind = c.model.kind;
    if (step === 'LEADER') return kind === 'NORMAL_CURVE' && c.model.shades?.some(s => s.label != null) ? {...await statSettle(c, {room: 'LEADER'}, '-roomLEADER'), target: 'area-labels'} : null;
    if (step === 'MARGIN' && (kind === 'NORMAL_CURVE' || kind === 'TREE')) {
      let out = null;
      for (const pad of kind === 'TREE' ? ROOM_PADS.slice(1) : ROOM_PADS) {
        out = await statSettle(c, {room: 'MARGIN', ...(pad ? {roomPad: pad} : {})}, `-roomMARGIN${pad}`);
        if (out.composed.status === 'COMPOSED') return {...out, target: {pad}};
      }
      return out;
    }
    return null;
  },
  async best(c, first, degrade) {
    return statSettle(c, {room: 'BEST', roomPad: ROOM_PADS[1], degrade}, '-roomBEST');
  }
};

// A fixed size: measured once, composed once.
const onceSizePolicy = (sizeOf) => async (c) => {
  const size = sizeOf(c.model);
  c.st('measure');
  const measured = await c.measure(size, '');
  c.st('compose');
  const composed = await c.compose(measured, {});
  return {measured, composed};
};

// No room for a label at the real font: the frame is widened (ELLIPSE_FRAME_STEPS px each side), measured and composed again; each widening is recorded in row.fallback.
// A widened frame the display profile cannot hold (its font would pass the largest allowed) ends the attempts: the figure fails as it failed before, with the no-room refusal.
const ellipsePolicy = async (c) => {
  let measured, composed;
  for (const [attempt, extra] of ell.ELLIPSE_FRAME_STEPS.entries()) {
    ell.setEllipseFrameExtra(c.model, extra);
    c.st('measure');
    measured = await c.measureRaw(ell.ellipseFigureSize(c.model), attempt ? `-frame${attempt}` : '');
    if (measured.status !== 'MEASURED' && attempt > 0) { c.st('compose'); ell.setEllipseFrameExtra(c.model, 0); break; }
    if (measured.status !== 'MEASURED') throw {stage: 'measure', detail: {status: measured.status, detail: measured.detail}};
    c.st('compose');
    composed = await c.compose(measured, {});
    if (composed.status !== 'ELLIPSE_LABEL_NO_ROOM' || attempt === ell.ELLIPSE_FRAME_STEPS.length - 1) break;
    (c.row.fallback ??= []).push({from: c.clip(composed.detail), to: 'ELLIPSE_FRAME_WIDEN', extra: ell.ELLIPSE_FRAME_STEPS[attempt + 1]});
  }
  return {measured, composed};
};

// The set rescue (label-room): LEADER lays the figure out again with the set names clear of every circle's line, led out on a leader to their own circle when no such place exists (WRAP of the element labels is part of the figure's own
// layout attempts, setDiagramAttempts). The size does not change, so the measurement of the first try stands; best draws the most capable layout with the shortfall recorded.
const setRoom = {
  codes: ['SET_ELEMENT_NO_ROOM', 'SET_LABEL_NO_ROOM', 'SET_COUNT_LABEL_NO_ROOM', 'SET_LABELS_TOO_CLOSE', 'SET_LABEL_OUT_OF_BOUNDS', 'SET_DIAGRAM_RENDERED_LAYOUT_FAIL'],
  steps: ['LEADER'],
  async apply(step, c, first) {
    if (step !== 'LEADER') return null;
    c.st('compose');
    return {measured: first.measured, composed: await c.compose(first.measured, {room: 'LEADER'}), target: 'set-names'};
  },
  async best(c, first, degrade) {
    c.st('compose');
    return {measured: first.measured, composed: await c.compose(first.measured, {room: 'BEST', degrade})};
  }
};

// The ellipse rescue (label-room): its frame widening (ELLIPSE_FRAME_WIDEN, ellipsePolicy) is its MARGIN step and runs as part of the figure as written. LEADER: a segment measure (6√3) with no near place goes to free space on a leader from the
// middle of its own segment (the exact value is written as before), and no leader may cross an axis arrow head. The frame and its measurement do not change, so the first measurement stands.
const ellipseRoom = {
  codes: ['ELLIPSE_LABEL_NO_ROOM', 'ELLIPSE_FIGURE_RENDERED_LAYOUT_FAIL'],
  steps: ['LEADER'],
  async apply(step, c, first) {
    if (step !== 'LEADER') return null;
    c.st('compose');
    return {measured: first.measured, composed: await c.compose(first.measured, {room: 'LEADER'}), target: 'measures-and-leaders'};
  },
  async best(c, first, degrade) {
    c.st('compose');
    return {measured: first.measured, composed: await c.compose(first.measured, {room: 'BEST', degrade})};
  }
};

// ---- the table ----------------------------------------------------------------------------------------------------------------
export const STANDALONE_KINDS = [
  {name: 'set', capability: sdg.FIGURE_CAPABILITY, stage: 'set-diagram', check: sdg.checkSetDiagramPlan, compose: sdg.composeSetDiagramFigure, settle: sameSizePolicy(sdg.setDiagramSize), room: setRoom},
  {name: 'stat', capability: scf.FIGURE_CAPABILITY, stage: 'stat-chart', check: scf.checkStatChartPlan, compose: scf.composeStatChartFigure, settle: statPolicy, room: statRoom},
  {name: 'container', capability: cfv.FIGURE_CAPABILITY, stage: 'container-fill', check: cfv.checkContainerFillPlan, compose: cfv.composeContainerFillFigure, settle: sameSizePolicy(cfv.containerFillSize)},
  {name: 'lattice', capability: lpf.FIGURE_CAPABILITY, stage: 'lattice-path', check: lpf.checkLatticePathPlan, compose: lpf.composeLatticePathFigure, settle: onceSizePolicy(lpf.latticePathSize)},
  {name: 'ellipse', capability: ell.FIGURE_CAPABILITY, stage: 'ellipse', check: ell.solveEllipseFigure, compose: ell.composeEllipseFigure, settle: ellipsePolicy, room: ellipseRoom}
];

export const standaloneKindFor = capability => STANDALONE_KINDS.find(k => k.capability === capability);

// ---- the shared runner --------------------------------------------------------------------------------------------------------
// ctx: {authored, identity, meta, tag, row, setStage(stage) (render-plan's own stage variable), bind({plan,model,composed,capture}), clip}
// Sets row.status/row.sizeClass on success; the caller returns finish(). A failure throws as the engine always threw ({stage,detail:{status,detail}}).
export async function runStandaloneKind(kind, ctx) {
  const {authored, identity, meta, tag, row, setStage, bind, clip, write, name} = ctx;
  let stage = kind.stage;
  const st = s => { stage = s; setStage(s); };
  st(kind.stage);
  const model = await kind.check(authored);
  const measureRaw = (size, suffix) => cap.measureArchiveTypographyPolicy({identity, sourcePath: meta.sourcePath, ordinal: meta.ordinal, requestedSizeClass: 'full', intrinsicSvg: size, runId: `pilot-measure-${tag}${suffix}`});
  const measure = async (size, suffix) => {
    const measured = await measureRaw(size, suffix);
    if (measured.status !== 'MEASURED') throw {stage, detail: {status: measured.status, detail: measured.detail}};
    return measured;
  };
  const compose = (measured, extra) => kind.compose({plan: authored, model, identity, typographyPolicy: measured.policy, ...extra});
  const settleCtx = {authored, model, identity, st, measure, measureRaw, compose, row, clip};
  let {measured, composed} = await kind.settle(settleCtx);
  if (composed.status !== 'COMPOSED' && kind.room?.codes.includes(composed.status)) {
    // label-room: the figure failed for lack of room. Rescue it in the fixed order; when nothing composes it fails with the failure it had, and the best place there is may be drawn beside the result.
    const failedStage = stage, first = {measured, composed}, trace = [];
    const rescued = await runRoomLadder({kind: kind.name, steps: kind.room.steps, codes: kind.room.codes, first, row, clip,
      apply: async (step, was) => { try { const out = await kind.room.apply(step, settleCtx, was); trace.push({step, status: out?.composed?.status ?? 'NOT_APPLICABLE'}); return out; } catch (error) { trace.push({step, status: 'ERROR', error: String(error?.message ?? error?.stage ?? error).slice(0, 120)}); return null; } }});
    if (rescued.composed.status === 'COMPOSED') ({measured, composed} = rescued);
    else {
      if (kind.room.best && write && name) {
        const degrade = degradeCollector();
        try {
          const out = await kind.room.best(settleCtx, first, degrade);
          if (out?.composed?.status === 'BEST_EFFORT' && out.composed.svg) {
            const file = `${name}-besteffort.svg`;
            write(file, out.composed.svg);
            row.bestEffort = bestEffortRecord({kind: kind.name, failure: {code: first.composed.status, detail: clip(first.composed.detail)}, step: 'BEST', collector: degrade, file});
          } else trace.push({step: 'BEST', status: out?.composed?.status ?? 'NONE'});
        } catch (error) { trace.push({step: 'BEST', status: 'ERROR', error: String(error?.message ?? error?.stage ?? error).slice(0, 120)}); }
      }
      row.roomTrace = trace;
      st(failedStage);
    }
  }
  if (composed.status !== 'COMPOSED') throw {stage, detail: {status: composed.status, detail: composed.detail}};
  st('capture');
  const capture = await cap.captureArchiveCandidate({identity, sourcePath: meta.sourcePath, ordinal: meta.ordinal, requestedSizeClass: 'full', composed, measuredPolicy: measured, alt: authored.caption || '', fixtureClassification: 'PILOT_AUTHOR_PLAN_CANDIDATE', runId: `pilot-capture-${tag}`});
  if (capture.status !== 'ARCHIVE_BOUND') throw {stage, detail: {status: capture.status, detail: capture.detail}};
  await bind({plan: authored, model, composed, capture});
  row.status = 'ARCHIVE_BOUND'; row.sizeClass = 'full';
}
