// Standalone figure kinds: one table row per kind plus one shared runner (R1-1; render-plan.mjs used to carry this flow five times).
// Flow: check -> size -> measure -> (measure again) -> compose -> capture -> bind. Everything a kind does differently lives in its row:
//   capability  the plan capability the row answers to
//   stage       the stage name a failure before measuring reports (check, size)
//   check       plan -> exact model (a refusal throws; stage is the row's stage)
//   settle      the measure/compose policy (how often the figure is measured again and why); it returns {measured, composed}
// Stage names, thrown {stage,detail}, row.fallback, measure/capture arguments (runId strings), call order and call count are the behavior of the five
// blocks this replaced; golden-gate must show every golden item byte-identical.
//
// To add a kind (see ops/golden-gate/README.md "새 종류를 표에 더하는 법"): write the figure module, add its row below, list it in ops/golden-gate/lib/kinds.mjs,
// add an example plan and a guide section.
import * as cap from './construction-archive-capture-v1.mjs';
import * as sdg from './set-diagram-v1.mjs';
import * as scf from './stat-chart-v1.mjs';
import * as ell from './ellipse-figure-v1.mjs';
import * as cfv from './container-fill-v1.mjs';
import * as lpf from './lattice-path-v1.mjs';

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
const statPolicy = async (c) => {
  let size = scf.statChartSize(c.model);
  c.st('measure');
  let measured = await c.measure(size, '');
  for (let again = 1; again <= 6; again++) {
    const exact = scf.statChartSize(c.model, {fontPx: measured.policy.baseFontPx});
    if (exact.width <= size.width && exact.height <= size.height) break;
    size = {width: Math.max(size.width, exact.width), height: Math.max(size.height, exact.height)};
    measured = await c.measure(size, `-r${again}`);
  }
  c.st('compose');
  let composed = await c.compose(measured, {minSize: size});
  for (let wider = 1; wider <= 3 && composed.status === 'COMPOSED' && composed.rowScale > 1 && !(composed.rowScale === (composed.settledScale ?? 1)); wider++) {
    const rowScale = composed.rowScale, exact = scf.statChartSize(c.model, {fontPx: measured.policy.baseFontPx, rowScale});
    size = {width: Math.max(size.width, exact.width), height: Math.max(size.height, exact.height)};
    measured = await c.measure(size, `-s${wider}`);
    composed = await c.compose(measured, {minSize: size, rowScale});
    composed.settledScale = rowScale;
  }
  return {measured, composed};
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

// ---- the table ----------------------------------------------------------------------------------------------------------------
export const STANDALONE_KINDS = [
  {name: 'set', capability: sdg.FIGURE_CAPABILITY, stage: 'set-diagram', check: sdg.checkSetDiagramPlan, compose: sdg.composeSetDiagramFigure, settle: sameSizePolicy(sdg.setDiagramSize)},
  {name: 'stat', capability: scf.FIGURE_CAPABILITY, stage: 'stat-chart', check: scf.checkStatChartPlan, compose: scf.composeStatChartFigure, settle: statPolicy},
  {name: 'container', capability: cfv.FIGURE_CAPABILITY, stage: 'container-fill', check: cfv.checkContainerFillPlan, compose: cfv.composeContainerFillFigure, settle: sameSizePolicy(cfv.containerFillSize)},
  {name: 'lattice', capability: lpf.FIGURE_CAPABILITY, stage: 'lattice-path', check: lpf.checkLatticePathPlan, compose: lpf.composeLatticePathFigure, settle: onceSizePolicy(lpf.latticePathSize)},
  {name: 'ellipse', capability: ell.FIGURE_CAPABILITY, stage: 'ellipse', check: ell.solveEllipseFigure, compose: ell.composeEllipseFigure, settle: ellipsePolicy}
];

export const standaloneKindFor = capability => STANDALONE_KINDS.find(k => k.capability === capability);

// ---- the shared runner --------------------------------------------------------------------------------------------------------
// ctx: {authored, identity, meta, tag, row, setStage(stage) (render-plan's own stage variable), bind({plan,model,composed,capture}), clip}
// Sets row.status/row.sizeClass on success; the caller returns finish(). A failure throws as the engine always threw ({stage,detail:{status,detail}}).
export async function runStandaloneKind(kind, ctx) {
  const {authored, identity, meta, tag, row, setStage, bind, clip} = ctx;
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
  const {measured, composed} = await kind.settle({authored, model, identity, st, measure, measureRaw, compose, row, clip});
  if (composed.status !== 'COMPOSED') throw {stage, detail: {status: composed.status, detail: composed.detail}};
  st('capture');
  const capture = await cap.captureArchiveCandidate({identity, sourcePath: meta.sourcePath, ordinal: meta.ordinal, requestedSizeClass: 'full', composed, measuredPolicy: measured, alt: authored.caption || '', fixtureClassification: 'PILOT_AUTHOR_PLAN_CANDIDATE', runId: `pilot-capture-${tag}`});
  if (capture.status !== 'ARCHIVE_BOUND') throw {stage, detail: {status: capture.status, detail: capture.detail}};
  await bind({plan: authored, model, composed, capture});
  row.status = 'ARCHIVE_BOUND'; row.sizeClass = 'full';
}
