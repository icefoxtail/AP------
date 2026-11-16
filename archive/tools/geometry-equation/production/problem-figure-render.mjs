import { composeSourceSchematic, isSourceSchematicCapability } from './source-schematic-figure.mjs';
import { pythonWorker } from './worker.mjs';
import { composeConstructionCandidate } from './construction-candidate-svg-v1.mjs';
import { checkSetDiagramPlan, composeSetDiagramFigure, solveDiagram } from './set-diagram-v1.mjs';
import { captionText, compositePanels, composeCompositeCandidate, isSetPanel, isSolidPanel } from './composite-candidate-svg-v1.mjs';
import { composeEllipseFigure, solveEllipseFigure } from './ellipse-figure-v1.mjs';
import { composeSolidFigurePanel, solveSolidFigure } from './solid-figure-v1.mjs';

async function checkedWorker(input, options) {
  const result = await pythonWorker(input, options);
  if (result.status !== 'OK') throw Error(JSON.stringify(result.result));
  return result.result;
}

async function constructionModel(plan) {
  if (!plan.graphPlan) {
    return { plan, model: await checkedWorker({ action: 'construction', graph: plan.mathPlan }, { timeoutMs: 90000 }) };
  }
  const { graphPlan } = await checkedWorker({ action: 'frame_graph', graphPlan: plan.graphPlan });
  const model = await checkedWorker({ action: 'graph', graphPlan });
  return { plan: { ...plan, graphPlan }, model };
}

export async function composeProblem(plan, identity, typographyPolicy, browser, { repoRoot, question } = {}) {
  const context = { identity, typographyPolicy, browser };
  if (isSourceSchematicCapability(plan.capability)) {
    return composeSourceSchematic(plan, { repoRoot, question, identity, typography: typographyPolicy, browser });
  }
  if (plan.capability === 'set-diagram-figure-v1') {
    return composeSetDiagramFigure({ ...context, plan, model: checkSetDiagramPlan(plan) });
  }
  if (plan.capability === 'ellipse-figure-v1') {
    return composeEllipseFigure({ ...context, plan, model: await solveEllipseFigure(plan) });
  }
  if (plan.capability === 'solid-figure-v1') {
    return composeSolidFigurePanel({ ...context, plan, model: solveSolidFigure(plan) });
  }
  if (plan.capability === 'composite-panels-v1') {
    const panels = [];
    const framed = [];
    for (const panel of compositePanels(plan)) {
      let prepared;
      if (isSetPanel(panel.plan)) {
        prepared = { plan: panel.plan, model: solveDiagram(panel.plan.diagram) };
      } else if (isSolidPanel(panel.plan)) {
        prepared = { plan: panel.plan, model: solveSolidFigure(panel.plan) };
      } else {
        if (!panel.plan.graphPlan && !panel.plan.mathPlan) throw Error('Unsupported problem panel: ' + panel.plan.capability);
        prepared = await constructionModel({ ...panel.plan, caption: panel.plan.caption ?? captionText(panel.caption) });
      }
      panels.push(prepared);
      framed.push({ caption: panel.caption, plan: prepared.plan });
    }
    return composeCompositeCandidate({ ...context, plan: { ...plan, panels: framed }, panels });
  }
  return composeConstructionCandidate({ ...context, ...await constructionModel(plan) });
}

